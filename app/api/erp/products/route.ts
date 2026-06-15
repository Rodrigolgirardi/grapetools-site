// app/api/erp/products/route.ts
// API de PRODUTOS para o Grape One (modo PULL).
// GET /api/erp/products   com cabeçalho  x-api-key: <ERP_API_KEY>
//
// Os produtos vêm do catálogo em lib/data.ts (arquivo, não do banco).
// Cada produto tem variações (cada variação = 1 SKU) com tabela de preço por quantidade.
//
// Filtros opcionais:
//   ?categoria=Elétrica   -> filtra por categoria
//   ?busca=disco          -> procura no nome, descrição e palavras-chave
//   ?limite=100           -> máximo de produtos (padrão 500)

import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import { autorizadoErp, round2 } from '@/lib/erp-auth'

export async function GET(request: NextRequest) {
  if (!autorizadoErp(request)) {
    return NextResponse.json(
      { error: 'Não autorizado. Envie o cabeçalho x-api-key válido.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')?.toLowerCase()
  const busca = searchParams.get('busca')?.toLowerCase()
  const limiteParam = parseInt(searchParams.get('limite') || '500', 10)
  const limite = Math.min(Math.max(Number.isNaN(limiteParam) ? 500 : limiteParam, 1), 2000)

  let lista = products

  if (categoria) {
    lista = lista.filter((p) => p.category?.toLowerCase() === categoria)
  }
  if (busca) {
    lista = lista.filter((p) =>
      [p.name, p.description, ...(p.keywords || [])]
        .join(' ')
        .toLowerCase()
        .includes(busca)
    )
  }

  const data = lista.slice(0, limite).map((p) => ({
    slug: p.slug,
    nome: p.name,
    descricao: p.description,
    categoria: p.category,
    subcategoria: p.subcategory,
    marca: p.brand,
    fornecedor: p.supplier,
    palavras_chave: p.keywords || [],
    estoque: p.stock,
    vendidos: p.sold,
    promocao: p.isPromotion,
    lancamento: p.isLaunch,
    variacoes: (p.variations || []).map((v) => ({
      sku: v.sku,
      label: v.label,
      ncm: v.ncm,
      peso: v.weight,
      // preço base = menor quantidade (primeira faixa); demais faixas em "tiers"
      preco_base: v.tiers?.[0] ? round2(v.tiers[0].price) : null,
      tiers: (v.tiers || []).map((t) => ({
        min_qtd: t.minQty,
        preco: round2(t.price),
      })),
    })),
  }))

  return NextResponse.json({
    source: 'grape-tools-b2b',
    integration: 'erp.products',
    total_produtos: data.length,
    data,
  })
}
