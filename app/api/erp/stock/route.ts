// app/api/erp/stock/route.ts
// API de ESTOQUE para o Grape One.
//
// GET  /api/erp/stock        -> lê o estoque (uma linha por SKU do catálogo).
//   ?baixo=true              -> só SKUs controlados com estoque abaixo do limite
//   ?limite_baixo=10         -> define "estoque baixo" (padrão 10)
//
// POST /api/erp/stock        -> o GrapeOne GRAVA as quantidades (fonte de verdade).
//   body: { "itens": [ { "sku": "12.BOT.AZ", "quantidade": 50 }, ... ] }
//   (define o valor absoluto de cada SKU; cria a linha se não existir)
//
// Ambas exigem o cabeçalho x-api-key: <ERP_API_KEY>.
// Regra: SKU sem linha na tabela = "não controlado" (controlado:false).

import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import { autorizadoErp } from '@/lib/erp-auth'
import { getEstoqueMap, setEstoque } from '@/lib/estoque'

export async function GET(request: NextRequest) {
  if (!autorizadoErp(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const apenasBaixo = searchParams.get('baixo') === 'true'
  const limiteBaixoParam = parseInt(searchParams.get('limite_baixo') || '10', 10)
  const limiteBaixo = Number.isNaN(limiteBaixoParam) ? 10 : limiteBaixoParam

  const estoque = await getEstoqueMap()

  // Uma linha por SKU (variação). quantidade vem da tabela; se não houver, é "não controlado".
  let linhas = products.flatMap((p) =>
    (p.variations || []).map((v) => {
      const controlado = Object.prototype.hasOwnProperty.call(estoque, v.sku)
      const quantidade = controlado ? estoque[v.sku] : null
      return {
        sku: v.sku,
        produto: p.name,
        variacao: v.label,
        controlado,
        quantidade,
        vendidos: p.sold,
        estoque_baixo: controlado && (quantidade as number) < limiteBaixo,
      }
    })
  )

  if (apenasBaixo) {
    linhas = linhas.filter((l) => l.estoque_baixo)
  }

  return NextResponse.json({
    source: 'grape-tools-b2b',
    integration: 'erp.stock',
    nota: 'Estoque por SKU. SKU "controlado:false" não tem estoque cadastrado (o site não bloqueia nem dá baixa nele).',
    total_skus: linhas.length,
    data: linhas,
  })
}

export async function POST(request: NextRequest) {
  if (!autorizadoErp(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const itens = Array.isArray(body?.itens) ? body.itens : null
    if (!itens) {
      return NextResponse.json(
        { error: 'Envie { "itens": [ { "sku": "...", "quantidade": 0 }, ... ] }' },
        { status: 400 }
      )
    }

    const atualizados = await setEstoque(itens)
    return NextResponse.json({
      source: 'grape-tools-b2b',
      integration: 'erp.stock',
      atualizados,
    })
  } catch (err) {
    console.error('Erro ao gravar estoque:', err)
    return NextResponse.json({ error: 'Erro ao gravar estoque.' }, { status: 500 })
  }
}
