// lib/estoque.ts
// Acesso ao estoque (tabela public.estoque no Supabase).
// O GrapeOne grava via API ERP; o site lê (disponibilidade) e dá baixa (venda paga).
// Regra: SKU sem linha na tabela = "não controlado" (não bloqueia, não dá baixa).

import { createAdminClient } from '@/lib/supabase-admin'
import { composicaoDoSku } from '@/lib/data'

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

// Confirma um pedido como PAGO e dá baixa no estoque — de forma ATÔMICA e idempotente.
// Reivindica a transição virando estoque_baixado false→true numa só operação: só quem
// "ganha" o UPDATE dá baixa. Retorna true se ESTE chamador confirmou agora, false se o
// pedido já estava pago (no-op) ou em erro. Fonte ÚNICA usada pelo cartão e pelo cron.
// (O webhook tem uma versão-irmã que reivindica em lote por pagarme_order_id.)
export async function confirmarPedidoPago(pedidoId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data: claimed, error } = await admin
    .from('pedidos')
    .update({
      pagamento_status: 'pago',
      pago_em: new Date().toISOString(),
      status: 'confirmado',
      estoque_baixado: true,
    })
    .eq('id', pedidoId)
    .eq('estoque_baixado', false)
    .select('id')
  if (error) {
    console.error(`[RECONCILIAR] Falha ao gravar "pago" no pedido ${pedidoId}:`, error.message)
    return false
  }
  if (!claimed || claimed.length === 0) return false // já estava pago → nada a fazer
  // Baixa não pode derrubar o fluxo (o pedido já está pago); loga alto se falhar.
  try {
    await baixarEstoquePedido(pedidoId)
  } catch (e) {
    console.error(`[RECONCILIAR] Pedido ${pedidoId} pago mas falhou a baixa de estoque:`, e)
  }
  return true
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
    const sku = it.sku as string
    const qtd = it.quantidade as number
    // Se for KIT, dá baixa nos COMPONENTES (qtd do componente × qtd vendida do kit).
    const composicao = composicaoDoSku(sku)
    if (composicao) {
      for (const c of composicao) {
        const restante = await baixarEstoque(c.sku, c.quantidade * qtd)
        if (restante === -1) {
          console.warn(`Estoque insuficiente na baixa do kit ${sku} → componente ${c.sku} x${c.quantidade * qtd} (pedido ${pedidoId})`)
        }
      }
      continue
    }
    const restante = await baixarEstoque(sku, qtd)
    if (restante === -1) {
      console.warn(`Estoque insuficiente na baixa: ${sku} x${qtd} (pedido ${pedidoId})`)
    }
    // restante === null -> SKU não controlado (ok, ignora)
  }
}
