// app/api/admin/etiqueta/route.ts
// Compra a etiqueta de envio de um pedido no Melhor Envio (debita a carteira).
// SÓ ADMIN. Um clique no /admin: valida o pedido, compra, gera, e grava
// etiqueta_id/etiqueta_url/rastreio no pedido. Idempotente: pedido que já tem
// etiqueta não compra de novo.
// Body: { "pedido_id": "..." }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'
import { comprarEtiqueta } from '@/lib/frete-server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const pedidoId = String(body?.pedido_id || '').trim()
  if (!pedidoId) {
    return NextResponse.json({ error: 'pedido_id ausente.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: pedido, error } = await admin
    .from('pedidos')
    .select('*')
    .eq('id', pedidoId)
    .single()
  if (error || !pedido) {
    return NextResponse.json({ error: 'Pedido não encontrado (ou migração 008 pendente).' }, { status: 404 })
  }

  // Regras de elegibilidade — mensagens diretas pro admin entender o porquê
  if (pedido.etiqueta_id) {
    return NextResponse.json(
      { error: 'Este pedido já tem etiqueta comprada.', etiqueta_url: pedido.etiqueta_url, rastreio: pedido.rastreio },
      { status: 409 }
    )
  }
  if (pedido.pagamento_status !== 'pago') {
    return NextResponse.json({ error: 'O pedido ainda não está pago.' }, { status: 400 })
  }
  if (pedido.entrega_tipo === 'retirada') {
    return NextResponse.json({ error: 'Pedido de retirada na loja — não precisa de etiqueta.' }, { status: 400 })
  }
  const end = pedido.endereco_entrega as Record<string, string> | null
  if (!end?.cep || !end?.rua || !end?.numero) {
    return NextResponse.json(
      { error: 'Pedido sem endereço de entrega salvo (anterior à migração 008). Compre manualmente no Melhor Envio.' },
      { status: 400 }
    )
  }
  // Sem serviço escolhido (ex.: frete grátis) usa PAC/serviço mais barato? Não:
  // exige serviço definido OU frete grátis — no grátis, cotamos de novo e usamos
  // a opção mais barata na hora da compra.
  const { data: itensRows } = await admin
    .from('pedido_itens')
    .select('sku, quantidade')
    .eq('pedido_id', pedidoId)
  const itens = (itensRows || [])
    .filter((i) => i.sku !== 'JUROS')
    .map((i) => ({ sku: String(i.sku), quantidade: Number(i.quantidade) }))
  if (itens.length === 0) {
    return NextResponse.json({ error: 'Pedido sem itens.' }, { status: 400 })
  }

  let servicoId = Number(pedido.frete_servico_id) || 0
  if (!servicoId) {
    // Frete grátis (Grande SP): a loja escolhe o mais barato disponível agora.
    const { cotarFrete } = await import('@/lib/frete-server')
    try {
      const opcoes = await cotarFrete(String(end.cep), itens)
      if (!opcoes.length) {
        return NextResponse.json({ error: 'Nenhuma transportadora disponível para o CEP agora.' }, { status: 502 })
      }
      servicoId = opcoes[0].id
    } catch (e) {
      console.error('Cotação para etiqueta falhou:', e instanceof Error ? e.message : e)
      return NextResponse.json({ error: 'Não foi possível cotar o envio agora.' }, { status: 502 })
    }
  }

  // Destinatário: perfil do cliente (nome/email/telefone/documento)
  const { data: perfil } = await admin
    .from('profiles')
    .select('nome, email, telefone, cnpj')
    .eq('id', pedido.user_id)
    .single()

  try {
    const etiqueta = await comprarEtiqueta({
      servicoId,
      valorSeguro: Number(pedido.total) || 1,
      itens,
      destinatario: {
        nome: String(perfil?.nome || 'Cliente'),
        email: String(perfil?.email || ''),
        documento: String(perfil?.cnpj || ''),
        telefone: String(perfil?.telefone || ''),
        endereco: {
          rua: String(end.rua), numero: String(end.numero), complemento: end.complemento ? String(end.complemento) : '',
          bairro: String(end.bairro || ''), cidade: String(end.cidade || ''), estado: String(end.estado || ''), cep: String(end.cep),
        },
      },
    })

    // Grava no pedido (best-effort com log — a etiqueta JÁ foi comprada)
    const { error: errSave } = await admin
      .from('pedidos')
      .update({
        etiqueta_id: etiqueta.etiquetaId,
        etiqueta_url: etiqueta.etiquetaUrl || null,
        ...(etiqueta.rastreio ? { rastreio: etiqueta.rastreio } : {}),
        status: 'em_separacao',
      })
      .eq('id', pedidoId)
    if (errSave) {
      console.error(`[RECONCILIAR] Etiqueta ${etiqueta.etiquetaId} comprada mas nao salva no pedido ${pedidoId}:`, errSave.message)
    }

    return NextResponse.json({
      etiqueta_id: etiqueta.etiquetaId,
      etiqueta_url: etiqueta.etiquetaUrl,
      rastreio: etiqueta.rastreio,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Falha ao comprar a etiqueta.'
    console.error(`Compra de etiqueta falhou (pedido ${pedidoId}):`, msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
