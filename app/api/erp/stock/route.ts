// app/api/erp/stock/route.ts
// API de ESTOQUE para o Grape One (modo PULL).
// GET /api/erp/stock   com cabeçalho  x-api-key: <ERP_API_KEY>
//
// IMPORTANTE: no catálogo (lib/data.ts) o estoque é por PRODUTO, mas o SKU é por
// VARIAÇÃO. Então cada SKU herda o estoque do produto pai (mesmo número repetido).
// Aqui devolvemos uma linha por SKU para o Grape One consumir item a item.
//
// Filtros opcionais:
//   ?baixo=true        -> só SKUs com estoque abaixo do limite
//   ?limite_baixo=10   -> define o que é "estoque baixo" (padrão 10)

import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import { autorizadoErp } from '@/lib/erp-auth'

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

  // Achata: uma linha por SKU (variação), herdando o estoque do produto.
  let linhas = products.flatMap((p) =>
    (p.variations || []).map((v) => ({
      sku: v.sku,
      produto: p.name,
      variacao: v.label,
      estoque: p.stock,
      vendidos: p.sold,
      estoque_baixo: p.stock < limiteBaixo,
    }))
  )

  if (apenasBaixo) {
    linhas = linhas.filter((l) => l.estoque_baixo)
  }

  return NextResponse.json({
    source: 'grape-tools-b2b',
    integration: 'erp.stock',
    nota: 'Estoque é controlado por produto; cada SKU da mesma família compartilha o mesmo número.',
    total_skus: linhas.length,
    data: linhas,
  })
}
