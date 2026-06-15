// app/api/erp/orders/route.ts
// API de VENDAS para integração com o Grape One (modo PULL).
// O Grape One chama:  GET /api/erp/orders   com o cabeçalho  x-api-key: <ERP_API_KEY>
//
// Filtros opcionais (query string):
//   ?status=confirmado          -> só pedidos com esse status
//   ?desde=2026-06-01           -> só pedidos criados a partir dessa data (ISO)
//   ?limite=50                  -> máximo de pedidos retornados (padrão 100, teto 500)

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// Confere a chave de API enviada pelo Grape One.
function autorizado(request: NextRequest): boolean {
  const esperada = process.env.ERP_API_KEY
  if (!esperada) return false // sem chave configurada, bloqueia por segurança
  const recebida = request.headers.get('x-api-key')
  return recebida === esperada
}

export async function GET(request: NextRequest) {
  // 1) Segurança: precisa da chave certa
  if (!autorizado(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
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
        preco_unitario: Number(i.preco_unitario),
        subtotal: Number(i.preco_unitario) * i.quantidade,
      }))

      return {
        id: p.id,
        status: p.status,
        total: Number(p.total),
        forma_pagamento: p.forma_pagamento,
        observacao: p.observacao,
        criado_em: p.created_at,
        atualizado_em: p.updated_at,
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
