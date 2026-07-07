// app/api/admin/cupons/route.ts
// CRUD de cupons — SÓ ADMIN logado. Usa o admin client (ignora RLS).
//   GET    -> lista todos os cupons
//   POST   -> cria { codigo, desconto_percent, vendedor, comissao_percent }
//   PATCH  -> { id, ativo } liga/desliga
//   DELETE -> { id } remove (pedidos guardam a comissão desnormalizada, não quebra)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'

async function ehAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return isAdminEmail(user?.email)
}

const NEGADO = () => NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })

export async function GET() {
  if (!(await ehAdmin())) return NEGADO()
  const admin = createAdminClient()
  const { data, error } = await admin.from('cupons').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ cupons: [], erroMigracao: true })
  return NextResponse.json({ cupons: data || [] })
}

export async function POST(request: NextRequest) {
  if (!(await ehAdmin())) return NEGADO()
  const body = await request.json().catch(() => ({}))

  const codigo = String(body?.codigo || '').trim().toUpperCase().replace(/\s+/g, '')
  const desconto_percent = Number(body?.desconto_percent)
  const vendedor = String(body?.vendedor || '').trim() || null
  const comissao_percent = Number(body?.comissao_percent) || 0

  if (!codigo) return NextResponse.json({ error: 'Código obrigatório.' }, { status: 400 })
  if (!(desconto_percent >= 0 && desconto_percent <= 90)) {
    return NextResponse.json({ error: 'Desconto deve ser entre 0% e 90%.' }, { status: 400 })
  }
  if (!(comissao_percent >= 0 && comissao_percent <= 100)) {
    return NextResponse.json({ error: 'Comissão deve ser entre 0% e 100%.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('cupons').insert({ codigo, desconto_percent, vendedor, comissao_percent, ativo: true })
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Já existe um cupom com esse código.' }, { status: 409 })
    }
    console.error('Erro ao criar cupom:', error.message)
    return NextResponse.json({ error: 'Não foi possível salvar. Rodou a migração 007 no Supabase?' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, codigo })
}

export async function PATCH(request: NextRequest) {
  if (!(await ehAdmin())) return NEGADO()
  const body = await request.json().catch(() => ({}))
  const id = String(body?.id || '')
  if (!id) return NextResponse.json({ error: 'ID ausente.' }, { status: 400 })
  if (typeof body?.ativo !== 'boolean') return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('cupons').update({ ativo: body.ativo }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Falha ao atualizar.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!(await ehAdmin())) return NEGADO()
  const body = await request.json().catch(() => ({}))
  const id = String(body?.id || '')
  if (!id) return NextResponse.json({ error: 'ID ausente.' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('cupons').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Falha ao remover.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
