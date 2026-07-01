// app/api/cron/reconciliar/route.ts
// REDE DE SEGURANÇA de pagamento. Pega os pedidos ainda "nao_pago" das últimas horas
// e pergunta ao Pagar.me qual o status REAL de cada um — confirmando os que já foram
// pagos mas cujo webhook falhou/se perdeu. Fecha o buraco de "cliente pagou o Pix mas
// o site não soube" (perda silenciosa de venda).
//
// Também recupera o pior caso: pedido cujo pagarme_order_id nunca foi salvo — acha a
// cobrança no Pagar.me pelo `code` e confere o metadata.pedido_id.
//
// Protegido por CRON_SECRET (header x-cron-key OU ?token=<segredo>). Deve ser chamado
// a cada ~20min por um agendador (.github/workflows/reconciliar-pagamentos.yml).

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase-admin'
import { confirmarPedidoPago } from '@/lib/estoque'

export const dynamic = 'force-dynamic'

const PAGARME_API = 'https://api.pagar.me/core/v5'
const SECRET_KEY = process.env.PAGARME_SECRET_KEY!

// Janela de reconciliação (Pix/boleto costumam pagar em até alguns dias).
const JANELA_HORAS = 72
// Teto de pedidos verificados por execução (protege contra rajada de chamadas ao Pagar.me).
const LIMITE_PEDIDOS = 100
// Teto de buscas "por code" por execução (o caso raro de pagarme_order_id nulo).
const LIMITE_BUSCA_CODE = 30

function segredoConfere(recebido: string | null, esperado: string): boolean {
  if (!recebido) return false
  const a = Buffer.from(recebido)
  const b = Buffer.from(esperado)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function autorizado(request: NextRequest): boolean {
  const esperado = process.env.CRON_SECRET
  if (!esperado) return false
  const recebido =
    request.headers.get('x-cron-key') || new URL(request.url).searchParams.get('token')
  return segredoConfere(recebido, esperado)
}

async function pagarmeGet(path: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${PAGARME_API}${path}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`,
      },
    })
    if (!res.ok) return null
    return (await res.json()) as Record<string, unknown>
  } catch {
    return null
  }
}

async function reconciliar(request: NextRequest) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const admin = createAdminClient()
  const desde = new Date(Date.now() - JANELA_HORAS * 60 * 60 * 1000).toISOString()

  const { data: pendentes, error } = await admin
    .from('pedidos')
    .select('id, pagarme_order_id, forma_pagamento, created_at')
    .eq('pagamento_status', 'nao_pago')
    .gte('created_at', desde)
    .order('created_at', { ascending: true })
    .limit(LIMITE_PEDIDOS)

  if (error) {
    console.error('[RECONCILIAR] erro ao ler pedidos pendentes:', error.message)
    return NextResponse.json({ error: 'Erro ao ler pedidos.' }, { status: 500 })
  }

  let verificados = 0
  let confirmados = 0
  let falhados = 0
  let ainda_pendentes = 0
  let sem_order_id = 0 // silent-loss: não deu pra localizar a cobrança no Pagar.me
  let erros_api = 0
  let buscasCodeRestantes = LIMITE_BUSCA_CODE

  for (const p of pendentes || []) {
    verificados++
    const pedidoId = p.id as string
    let order: Record<string, unknown> | null = null

    if (p.pagarme_order_id) {
      order = await pagarmeGet(`/orders/${p.pagarme_order_id}`)
      if (!order) erros_api++
    } else if (p.forma_pagamento && p.forma_pagamento !== 'transferencia' && buscasCodeRestantes > 0) {
      // pagarme_order_id nunca salvou: tenta achar pela cobrança pelo code + metadata.
      buscasCodeRestantes--
      const code = pedidoId.slice(0, 8).toUpperCase()
      const lista = await pagarmeGet(`/orders?code=${encodeURIComponent(code)}&size=5`)
      const candidatos = (lista?.data as Array<Record<string, unknown>>) || []
      const achado = candidatos.find(
        (o) => (o?.metadata as Record<string, unknown> | undefined)?.pedido_id === pedidoId
      )
      if (achado) {
        order = achado
        // Recupera o elo perdido para as próximas reconciliações/estornos.
        await admin.from('pedidos').update({ pagarme_order_id: achado.id as string }).eq('id', pedidoId)
      } else {
        sem_order_id++
      }
    } else {
      // transferência (sem cobrança no Pagar.me) ou teto de buscas atingido: pula.
      ainda_pendentes++
      continue
    }

    if (!order) {
      ainda_pendentes++
      continue
    }

    const status = order.status as string
    if (status === 'paid') {
      const confirmou = await confirmarPedidoPago(pedidoId)
      if (confirmou) confirmados++
    } else if (status === 'failed' || status === 'canceled') {
      // Não rebaixa um já-pago (guarda de regressão, igual ao webhook).
      await admin
        .from('pedidos')
        .update({ pagamento_status: 'falhou' })
        .eq('id', pedidoId)
        .neq('pagamento_status', 'pago')
      falhados++
    } else {
      ainda_pendentes++ // pending/processing: ainda aguardando pagamento
    }
  }

  // Precisa de atenção humana: cobranças que não deu pra localizar, ou erros de API.
  const needs_attention = sem_order_id > 0 || erros_api > 0
  const resumo = {
    ok: true,
    verificados,
    confirmados,
    falhados,
    ainda_pendentes,
    sem_order_id,
    erros_api,
    needs_attention,
  }

  if (confirmados > 0 || needs_attention) {
    console.log('[RECONCILIAR] resumo:', JSON.stringify(resumo))
  }
  return NextResponse.json(resumo)
}

export const GET = reconciliar
export const POST = reconciliar
