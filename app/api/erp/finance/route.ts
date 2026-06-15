// app/api/erp/finance/route.ts
// API FINANCEIRA para o Grape One (modo PULL).
// GET /api/erp/finance   com cabeçalho  x-api-key: <ERP_API_KEY>
//
// Filtros opcionais:
//   ?desde=2026-06-01   -> considera pedidos criados a partir dessa data
//   ?ate=2026-06-30     -> considera pedidos criados até essa data
//
// REGRA: faturamento = só pedidos PAGOS. "Em aberto" = ainda não pagos
// (exclui estornados/falhados do faturamento).

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { autorizadoErp, round2 } from '@/lib/erp-auth'

// Teto de linhas agregadas. Volume atual é baixo (uso interno); se um dia
// passar disso, migrar a agregação para uma função SQL no Supabase.
const TETO_LINHAS = 5000

export async function GET(request: NextRequest) {
  if (!autorizadoErp(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const desde = searchParams.get('desde')
    const ate = searchParams.get('ate')

    const supabase = createAdminClient()

    let query = supabase
      .from('pedidos')
      .select('total, pagamento_status, forma_pagamento, created_at, pago_em')
      .order('created_at', { ascending: false })
      .limit(TETO_LINHAS)

    if (desde) query = query.gte('created_at', desde)
    if (ate) query = query.lte('created_at', ate)

    const { data: pedidos, error } = await query

    if (error) {
      console.error('Erro ao buscar dados financeiros:', error)
      return NextResponse.json({ error: 'Erro ao buscar dados no banco.' }, { status: 500 })
    }

    const linhas = pedidos || []

    // Acumuladores
    let faturamentoPago = 0
    let valorEmAberto = 0
    let pedidosPagos = 0
    let pedidosEmAberto = 0
    const porFormaPagamento: Record<string, { pago: number; pedidos_pagos: number }> = {}
    const porMes: Record<string, { pago: number; em_aberto: number }> = {}

    for (const p of linhas) {
      const valor = Number(p.total) || 0
      const mes = (p.created_at || '').slice(0, 7) // "2026-06"
      if (!porMes[mes]) porMes[mes] = { pago: 0, em_aberto: 0 }

      if (p.pagamento_status === 'pago') {
        faturamentoPago += valor
        pedidosPagos += 1
        porMes[mes].pago += valor
        const forma = p.forma_pagamento || 'desconhecido'
        if (!porFormaPagamento[forma]) porFormaPagamento[forma] = { pago: 0, pedidos_pagos: 0 }
        porFormaPagamento[forma].pago += valor
        porFormaPagamento[forma].pedidos_pagos += 1
      } else if (p.pagamento_status === 'nao_pago') {
        // só "não pago" entra em aberto; estornado/falhou ficam de fora do faturamento
        valorEmAberto += valor
        pedidosEmAberto += 1
        porMes[mes].em_aberto += valor
      }
    }

    // Arredonda as quebras
    const porFormaArredondado = Object.fromEntries(
      Object.entries(porFormaPagamento).map(([k, v]) => [
        k,
        { pago: round2(v.pago), pedidos_pagos: v.pedidos_pagos },
      ])
    )
    const porMesArredondado = Object.fromEntries(
      Object.entries(porMes)
        .sort(([a], [b]) => b.localeCompare(a)) // mês mais recente primeiro
        .map(([k, v]) => [k, { pago: round2(v.pago), em_aberto: round2(v.em_aberto) }])
    )

    return NextResponse.json({
      source: 'grape-tools-b2b',
      integration: 'erp.finance',
      periodo: { desde: desde || null, ate: ate || null },
      resumo: {
        faturamento_pago: round2(faturamentoPago),
        valor_em_aberto: round2(valorEmAberto),
        pedidos_pagos: pedidosPagos,
        pedidos_em_aberto: pedidosEmAberto,
        ticket_medio_pago: pedidosPagos > 0 ? round2(faturamentoPago / pedidosPagos) : 0,
      },
      por_forma_pagamento: porFormaArredondado,
      por_mes: porMesArredondado,
      aviso: linhas.length >= TETO_LINHAS
        ? `Agregação limitada a ${TETO_LINHAS} pedidos.`
        : undefined,
    })
  } catch (err) {
    console.error('Erro inesperado em /api/erp/finance:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
