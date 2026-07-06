// app/api/admin/pedido/route.ts
// Atualiza o STATUS e/ou o RASTREIO de um pedido. Só ADMIN logado pode chamar.
// Body: { "pedido_id": "...", "status"?: "enviado", "rastreio"?: "AA123..." }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'

// Valores válidos do enum pedido_status (ver sql/001_schema.sql).
const STATUS_VALIDOS = ['pendente', 'confirmado', 'em_separacao', 'enviado', 'entregue', 'cancelado']

export async function POST(request: NextRequest) {
  // Segurança: precisa estar logado E ser admin.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const pedidoId = String(body?.pedido_id || '').trim()
  if (!pedidoId) {
    return NextResponse.json({ error: 'pedido_id ausente.' }, { status: 400 })
  }

  // Monta só os campos enviados (status e/ou rastreio).
  const patch: Record<string, unknown> = {}
  if (body?.status !== undefined) {
    const status = String(body.status)
    if (!STATUS_VALIDOS.includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
    }
    patch.status = status
  }
  if (body?.rastreio !== undefined) {
    patch.rastreio = String(body.rastreio).trim().slice(0, 120) || null
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })
  }

  // Valida o formato do id antes de tocar no banco (id malformado num campo uuid
  // geraria erro do Postgres; aqui damos um 400 limpo).
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_RE.test(pedidoId)) {
    return NextResponse.json({ error: 'pedido_id inválido.' }, { status: 400 })
  }

  const admin = createAdminClient()
  // .select('id') pra saber se ALGUMA linha foi atualizada — sem isso, um pedido_id
  // inexistente retorna sucesso sem erro e o admin veria "salvo" falsamente.
  const { data, error } = await admin.from('pedidos').update(patch).eq('id', pedidoId).select('id')
  if (error) {
    console.error('Erro ao atualizar pedido (admin):', error.message)
    return NextResponse.json({ error: 'Não foi possível salvar. Rode a migração 006?' }, { status: 500 })
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, pedido_id: pedidoId, ...patch })
}
