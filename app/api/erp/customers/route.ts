// app/api/erp/customers/route.ts
// API de CLIENTES para o Grape One (modo PULL).
// GET /api/erp/customers   com cabeçalho  x-api-key: <ERP_API_KEY>
//
// Filtros opcionais:
//   ?busca=texto      -> filtra por nome, email ou CNPJ
//   ?limite=50        -> máximo de clientes (padrão 200, teto 1000)
//
// Cada cliente vem com um resumo de compras: total de pedidos, total pago,
// total em aberto, e data do último pedido.

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
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('busca')?.trim()
    const limiteParam = parseInt(searchParams.get('limite') || '200', 10)
    const limite = Math.min(Math.max(Number.isNaN(limiteParam) ? 200 : limiteParam, 1), 1000)

    const supabase = createAdminClient()

    // 1) Busca os perfis (clientes)
    let query = supabase
      .from('profiles')
      .select('id, nome, email, cnpj, telefone, endereco, created_at')
      .order('created_at', { ascending: false })
      .limit(limite)

    if (busca) {
      // procura em nome OU email OU cnpj
      query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,cnpj.ilike.%${busca}%`)
    }

    const { data: perfis, error } = await query

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json({ error: 'Erro ao buscar clientes no banco.' }, { status: 500 })
    }

    // 2) Resumo de compras por cliente (uma consulta só, depois agrupa)
    const ids = (perfis || []).map((p) => p.id)
    const resumoPorCliente = new Map<
      string,
      { total_pedidos: number; total_pago: number; total_em_aberto: number; ultimo_pedido: string | null }
    >()

    if (ids.length > 0) {
      const { data: pedidos, error: pedErro } = await supabase
        .from('pedidos')
        .select('user_id, total, pagamento_status, created_at')
        .in('user_id', ids)

      if (pedErro) {
        console.error('Erro ao buscar pedidos dos clientes:', pedErro)
        // segue sem o resumo
      } else {
        for (const ped of pedidos || []) {
          const r =
            resumoPorCliente.get(ped.user_id) ||
            { total_pedidos: 0, total_pago: 0, total_em_aberto: 0, ultimo_pedido: null }
          const valor = Number(ped.total) || 0
          r.total_pedidos += 1
          if (ped.pagamento_status === 'pago') r.total_pago += valor
          else r.total_em_aberto += valor
          if (!r.ultimo_pedido || ped.created_at > r.ultimo_pedido) r.ultimo_pedido = ped.created_at
          resumoPorCliente.set(ped.user_id, r)
        }
      }
    }

    // 3) Monta a resposta
    const clientes = (perfis || []).map((p) => {
      const r = resumoPorCliente.get(p.id)
      return {
        id: p.id,
        nome: p.nome,
        email: p.email,
        cnpj: p.cnpj,
        telefone: p.telefone,
        endereco: p.endereco || null,
        cadastrado_em: p.created_at,
        compras: {
          total_pedidos: r?.total_pedidos || 0,
          total_pago: round2(r?.total_pago || 0),
          total_em_aberto: round2(r?.total_em_aberto || 0),
          ultimo_pedido: r?.ultimo_pedido || null,
        },
      }
    })

    return NextResponse.json({
      source: 'grape-tools-b2b',
      integration: 'erp.customers',
      total_clientes: clientes.length,
      data: clientes,
    })
  } catch (err) {
    console.error('Erro inesperado em /api/erp/customers:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
