// app/api/pagarme/webhook/route.ts
// Recebe os avisos do Pagar.me e atualiza o status de PAGAMENTO do pedido.
//
// Configurar no painel do Pagar.me (só funciona com o site PUBLICADO, não em localhost):
//   Dashboard Pagar.me → Configurações → Webhooks → adicionar URL:
//   https://SEU-SITE.com/api/pagarme/webhook?token=<PAGARME_WEBHOOK_SECRET>
//   Eventos: order.paid, order.payment_failed, order.canceled, charge.paid, charge.refunded
//
// Segurança: o token na URL precisa bater com a env PAGARME_WEBHOOK_SECRET.

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { baixarEstoquePedido } from '@/lib/estoque'

// Descobre o id do pedido no Pagar.me a partir do payload (order ou charge).
function extrairPagarmeOrderId(evento: string, data: Record<string, unknown>): string | null {
  if (evento.startsWith('order')) {
    return (data.id as string) || null
  }
  if (evento.startsWith('charge')) {
    const order = data.order as Record<string, unknown> | undefined
    return (data.order_id as string) || (order?.id as string) || null
  }
  return (data.id as string) || null
}

// Traduz o evento do Pagar.me para o nosso status de pagamento.
function statusDoEvento(evento: string): 'pago' | 'falhou' | 'estornado' | null {
  if (evento.endsWith('.paid')) return 'pago'
  if (evento.endsWith('.payment_failed')) return 'falhou'
  if (evento.endsWith('.refunded') || evento.endsWith('.canceled')) return 'estornado'
  return null // evento que não muda pagamento (ignoramos)
}

export async function POST(request: NextRequest) {
  // 1) Segurança: confere o token da URL
  const esperado = process.env.PAGARME_WEBHOOK_SECRET
  const recebido = new URL(request.url).searchParams.get('token')
  if (!esperado || recebido !== esperado) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const evento: string = body?.type || ''
    const data: Record<string, unknown> = body?.data || {}

    const novoStatus = statusDoEvento(evento)
    const pagarmeOrderId = extrairPagarmeOrderId(evento, data)

    // Evento que não nos interessa, ou sem id: responde OK e ignora.
    if (!novoStatus || !pagarmeOrderId) {
      return NextResponse.json({ received: true, ignored: true, evento })
    }

    const supabase = createAdminClient()

    // Estado ANTES do update (pra dar baixa de estoque só na 1ª vez que vira "pago")
    const { data: antes } = await supabase
      .from('pedidos')
      .select('id, pagamento_status')
      .eq('pagarme_order_id', pagarmeOrderId)

    const update: Record<string, unknown> = { pagamento_status: novoStatus }
    if (novoStatus === 'pago') {
      update.pago_em = new Date().toISOString()
      update.status = 'confirmado' // andamento: pagamento confirmado
    }

    const { data: atualizados, error } = await supabase
      .from('pedidos')
      .update(update)
      .eq('pagarme_order_id', pagarmeOrderId)
      .select('id')

    if (error) {
      console.error('Webhook: erro ao atualizar pedido:', error)
      // Responde 500 para o Pagar.me TENTAR DE NOVO depois
      return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
    }

    // Baixa de estoque: só nos pedidos que NÃO estavam "pago" antes (evita baixar 2x)
    if (novoStatus === 'pago' && antes) {
      for (const ped of antes) {
        if (ped.pagamento_status !== 'pago') {
          await baixarEstoquePedido(ped.id as string)
        }
      }
    }

    console.log(`Webhook ${evento}: ${atualizados?.length || 0} pedido(s) -> ${novoStatus}`)
    return NextResponse.json({ received: true, atualizados: atualizados?.length || 0 })
  } catch (err) {
    console.error('Erro no webhook Pagar.me:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
