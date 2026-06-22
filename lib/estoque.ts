// lib/estoque.ts
// Acesso ao estoque (tabela public.estoque no Supabase).
// O GrapeOne grava via API ERP; o site lê (disponibilidade) e dá baixa (venda paga).
// Regra: SKU sem linha na tabela = "não controlado" (não bloqueia, não dá baixa).

import { createAdminClient } from '@/lib/supabase-admin'

export type EstoqueItem = { sku: string; quantidade: number }

// Mapa { sku: quantidade } de todos os SKUs controlados.
export async function getEstoqueMap(): Promise<Record<string, number>> {
  const admin = createAdminClient()
  const { data, error } = await admin.from('estoque').select('sku, quantidade')
  if (error || !data) return {}
  const map: Record<string, number> = {}
  for (const r of data) map[r.sku] = r.quantidade as number
  return map
}

// Define (sobrescreve) as quantidades. Usado pelo GrapeOne via API ERP.
export async function setEstoque(itens: EstoqueItem[]): Promise<number> {
  const admin = createAdminClient()
  // Deduplica por SKU (o último valor vence) — um mesmo SKU pode vir repetido
  // (ex.: chicote que é variação do botão E produto avulso).
  const porSku = new Map<string, number>()
  for (const i of itens) {
    if (i?.sku && Number.isFinite(i?.quantidade)) {
      porSku.set(String(i.sku), Math.max(0, Math.trunc(i.quantidade)))
    }
  }
  const agora = new Date().toISOString()
  const rows = [...porSku].map(([sku, quantidade]) => ({ sku, quantidade, atualizado_em: agora }))
  if (rows.length === 0) return 0
  const { error } = await admin.from('estoque').upsert(rows, { onConflict: 'sku' })
  if (error) throw error
  return rows.length
}

// Baixa atômica via função do banco. Retorna a quantidade restante,
// -1 se faltou estoque, ou null se o SKU não é controlado.
export async function baixarEstoque(sku: string, qtd: number): Promise<number | null> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('baixar_estoque', { p_sku: sku, p_qtd: qtd })
  if (error) return null
  return data as number | null
}

// Dá baixa em todos os itens de um pedido (chamar uma única vez, quando vira "pago").
export async function baixarEstoquePedido(pedidoId: string): Promise<void> {
  const admin = createAdminClient()
  const { data: itens } = await admin
    .from('pedido_itens')
    .select('sku, quantidade')
    .eq('pedido_id', pedidoId)
  if (!itens) return
  for (const it of itens) {
    const restante = await baixarEstoque(it.sku as string, it.quantidade as number)
    if (restante === -1) {
      console.warn(`Estoque insuficiente na baixa: ${it.sku} x${it.quantidade} (pedido ${pedidoId})`)
    }
    // restante === null -> SKU não controlado (ok, ignora)
  }
}
