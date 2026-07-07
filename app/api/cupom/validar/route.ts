// app/api/cupom/validar/route.ts
// Valida um cupom pro cliente ver o desconto no checkout. Precisa estar logado
// (o checkout já exige login) — evita ficar adivinhando códigos de cupom.
// NÃO devolve comissão/vendedor: o cliente só precisa saber a % de desconto.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { buscarCupomAtivo } from '@/lib/cupom'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Faça login.' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const codigo = String(body?.codigo || '').trim()
  if (!codigo) return NextResponse.json({ valido: false })

  const cupom = await buscarCupomAtivo(codigo)
  if (!cupom || cupom.desconto_percent <= 0) {
    return NextResponse.json({ valido: false })
  }
  return NextResponse.json({
    valido: true,
    codigo: cupom.codigo,
    desconto_percent: cupom.desconto_percent,
  })
}
