// app/api/erp/marketplace/route.ts
// API de CANAIS DE VENDA para o Grape One (modo PULL).
// GET /api/erp/marketplace   com cabeçalho  x-api-key: <ERP_API_KEY>
//
// HOJE o site é canal único (B2B). Não há integração com marketplaces externos
// (Mercado Livre, etc.) nem campo de "canal" nos pedidos. Este endpoint reporta
// os números reais do canal B2B e lista os demais canais como não integrados,
// para o Grape One já ter a estrutura pronta quando forem ativados.

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { autorizadoErp, round2 } from '@/lib/erp-auth'

export async function GET(request: NextRequest) {
  if (!autorizadoErp(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  try {
    const supabase = createAdminClient()

    // Números reais do canal B2B (o site)
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('total, pagamento_status')
      .limit(5000)

    if (error) {
      console.error('Erro ao buscar pedidos (marketplace):', error)
      return NextResponse.json({ error: 'Erro ao buscar dados no banco.' }, { status: 500 })
    }

    const linhas = pedidos || []
    const totalPedidos = linhas.length
    let pedidosPagos = 0
    let faturamentoPago = 0
    for (const p of linhas) {
      if (p.pagamento_status === 'pago') {
        pedidosPagos += 1
        faturamentoPago += Number(p.total) || 0
      }
    }

    return NextResponse.json({
      source: 'grape-tools-b2b',
      integration: 'erp.marketplace',
      data: [
        {
          canal: 'b2b',
          nome: 'Site B2B (Grape Tools)',
          integrado: true,
          total_pedidos: totalPedidos,
          pedidos_pagos: pedidosPagos,
          faturamento_pago: round2(faturamentoPago),
        },
        { canal: 'representantes', nome: 'Representantes', integrado: false },
        { canal: 'marketplaces', nome: 'Marketplaces externos', integrado: false },
      ],
    })
  } catch (err) {
    console.error('Erro inesperado em /api/erp/marketplace:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
