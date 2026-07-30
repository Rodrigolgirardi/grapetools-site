// app/api/frete/calcular/route.ts
// Cotação de frete para o site (página de produto, carrinho e checkout).
// Endpoint público (cotar frete não exige login), mas com validação rígida do
// corpo — SKUs precisam existir no catálogo e as quantidades serem inteiros.

import { NextRequest, NextResponse } from 'next/server'
import { cotarFrete, type ItemFrete } from '@/lib/frete-server'
import { findVariation } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const cep = String(body?.cep ?? '').replace(/\D/g, '')
    const itensRaw = body?.itens

    if (cep.length !== 8) {
      return NextResponse.json({ error: 'CEP inválido.' }, { status: 400 })
    }
    if (!Array.isArray(itensRaw) || itensRaw.length === 0 || itensRaw.length > 60) {
      return NextResponse.json({ error: 'Itens inválidos.' }, { status: 400 })
    }

    const itens: ItemFrete[] = []
    for (const it of itensRaw) {
      const sku = String(it?.sku ?? '')
      const quantidade = Number(it?.quantidade)
      if (!findVariation(sku) || !Number.isInteger(quantidade) || quantidade <= 0 || quantidade > 9999) {
        return NextResponse.json({ error: `Item inválido: ${sku || '?'}` }, { status: 400 })
      }
      itens.push({ sku, quantidade })
    }

    const opcoes = await cotarFrete(cep, itens)
    return NextResponse.json({ opcoes })
  } catch (err) {
    console.error('Erro na cotação de frete:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: 'Não foi possível cotar o frete agora. Tente novamente.' },
      { status: 502 }
    )
  }
}
