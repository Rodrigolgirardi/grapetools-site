// app/api/admin/pausar/route.ts
// Pausa/reativa um SKU (marca "Esgotado" na mão). Só ADMIN logado pode chamar.
// Body: { "sku": "14.MAOF.BR.20", "pausado": true }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { isAdminEmail } from '@/lib/admin'
import { setPausado } from '@/lib/estoque'

export async function POST(request: NextRequest) {
  // Segurança: precisa estar logado E ser admin (mesma checagem do painel /admin).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const sku = String(body?.sku || '').trim()
  const pausado = Boolean(body?.pausado)
  if (!sku) {
    return NextResponse.json({ error: 'SKU ausente.' }, { status: 400 })
  }

  try {
    await setPausado(sku, pausado)
    return NextResponse.json({ ok: true, sku, pausado })
  } catch (e) {
    console.error('Erro ao pausar/reativar SKU:', e)
    return NextResponse.json({ error: 'Não foi possível salvar. Rode a migração 005?' }, { status: 500 })
  }
}
