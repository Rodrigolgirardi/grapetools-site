// app/api/erp/orders/route.ts
// API de VENDAS para integração com o Grape One (modo PULL).
// O Grape One chama:  GET /api/erp/orders   com o cabeçalho  x-api-key: <ERP_API_KEY>
//
// Filtros opcionais (query string):
//   ?status=confirmado          -> só pedidos com esse status (andamento/entrega)
//   ?pagamento=pago             -> só pedidos com esse status de pagamento
//   ?pago=true | false          -> atalho: só pagos (true) ou só não-pagos (false)
//   ?desde=2026-06-01           -> só pedidos criados a partir dessa data (ISO)
//   ?limite=50                  -> máximo de pedidos retornados (padrão 100, teto 500)

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { autorizadoErp, round2 } from '@/lib/erp-auth'

export async function GET(request: NextRequest) {
  // 1) Segurança: precisa da chave certa
  if (!autorizadoErp(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const pagamento = searchParams.get('pagamento')
    const pago = searchParams.get('pago') // 'true' | 'false'
    const desde = searchParams.get('desde')
    const limiteParam = parseInt(searchParams.get('limite') || '100', 10)
    const limite = Math.min(Math.max(Number.isNaN(limiteParam) ? 100 : limiteParam, 1), 500)

    const supabase = createAdminClient()

    // 2) Busca os pedidos + itens. O FK pedido_itens -> pedidos existe,
    //    então esse embed é seguro. Os dados do cliente vêm em seguida.
    let query = supabase
      .from('pedidos')
      .select(`
        id,
        status,
        pagamento_status,
        pago_em,
        pagarme_order_id,
        total,
        observacao,
        forma_pagamento,
        created_at,
        updated_at,
        user_id,
        pedido_itens ( sku, descricao, quantidade, preco_unitario )
      `)
      .order('created_at', { ascending: false })
      .limit(limite)

    if (status) query = query.eq('status', status)
    if (pagamento) query = query.eq('pagamento_status', pagamento)
    if (pago === 'true') query = query.eq('pagamento_status', 'pago')
    if (pago === 'false') query = query.neq('pagamento_status', 'pago')
    if (desde) query = query.gte('created_at', desde)

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar pedidos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar pedidos no banco.' },
        { status: 500 }
      )
    }

    // 2b) Busca os perfis dos clientes desses pedidos (uma consulta só)
    //     e indexa por id para juntar sem depender de FK pedidos<->profiles.
    const userIds = [...new Set((data || []).map((p) => p.user_id).filter(Boolean))]
    const perfilPorId = new Map<string, { nome: string; email: string; cnpj: string; telefone: string }>()

    if (userIds.length > 0) {
      const { data: perfis, error: perfilErro } = await supabase
        .from('profiles')
        .select('id, nome, email, cnpj, telefone')
        .in('id', userIds)

      if (perfilErro) {
        console.error('Erro ao buscar perfis:', perfilErro)
        // Não derruba a resposta: segue sem dados de cliente
      } else {
        for (const perfil of perfis || []) {
          perfilPorId.set(perfil.id, perfil)
        }
      }
    }

    // 3) Normaliza num formato limpo e estável para o Grape One consumir
    const pedidos = (data || []).map((p) => {
      const cliente = perfilPorId.get(p.user_id)
      const itens = (p.pedido_itens || []).map((i) => ({
        sku: i.sku,
        descricao: i.descricao,
        quantidade: i.quantidade,
        preco_unitario: round2(Number(i.preco_unitario)),
        subtotal: round2(Number(i.preco_unitario) * i.quantidade),
      }))

      const pagamentoStatus = p.pagamento_status || 'nao_pago'

      return {
        id: p.id,
        status: p.status,              // andamento/entrega
        pagamento_status: pagamentoStatus, // nao_pago | pago | estornado | falhou
        pago: pagamentoStatus === 'pago', // atalho booleano
        pago_em: p.pago_em || null,
        total: round2(Number(p.total)),
        forma_pagamento: p.forma_pagamento,
        observacao: p.observacao,
        criado_em: p.created_at,
        atualizado_em: p.updated_at,
        pagarme_order_id: p.pagarme_order_id || null,
        cliente: cliente
          ? {
              nome: cliente.nome,
              email: cliente.email,
              cnpj: cliente.cnpj,
              telefone: cliente.telefone,
            }
          : null,
        itens,
      }
    })

    return NextResponse.json({
      source: 'grape-tools-b2b',
      integration: 'erp.orders',
      total_pedidos: pedidos.length,
      data: pedidos,
    })
  } catch (err) {
    console.error('Erro inesperado em /api/erp/orders:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
