'use client'

// hooks/useCart.ts
// Carrinho persistido:
// - Deslogado: localStorage
// - Logado: localStorage + Supabase (synced)

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'
import { findVariation, getTierForQuantity } from '@/lib/pricing'
import { trackAddToCart } from '@/lib/analytics'

export type Cart = Record<string, number> // { [sku]: quantity }

const STORAGE_KEY = 'grapetools_cart'

function readLocal(): Cart {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function writeLocal(cart: Cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

export function useCart() {
  const { user } = useAuth()
  const [cart, setCartState] = useState<Cart>(readLocal)
  const [syncing, setSyncing] = useState(false)

  // Carrega do Supabase quando loga
  useEffect(() => {
    if (!user) return
    loadFromSupabase(user.id)
  }, [user?.id])

  async function loadFromSupabase(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('carrinhos')
      .select('sku, quantidade')
      .eq('user_id', userId)

    if (error || !data) return

    // Merge: Supabase + localStorage (localStorage tem prioridade para itens novos)
    const local = readLocal()
    const remote: Cart = {}
    data.forEach(row => { remote[row.sku] = row.quantidade })

    // Itens no local que não estão no remoto → sincronizar para o banco
    const merged = { ...remote }
    for (const [sku, qty] of Object.entries(local)) {
      if (!remote[sku] && qty > 0) merged[sku] = qty
    }

    setCartState(merged)
    writeLocal(merged)

    // Sincroniza itens locais que não estavam no banco
    const newItems = Object.entries(local).filter(([sku]) => !remote[sku])
    if (newItems.length > 0) {
      await syncToSupabase(userId, merged)
    }
  }

  async function syncToSupabase(userId: string, cartData: Cart) {
    const supabase = createClient()
    const rows = Object.entries(cartData)
      .filter(([, qty]) => qty > 0)
      .map(([sku, quantidade]) => ({ user_id: userId, sku, quantidade }))

    if (rows.length === 0) {
      await supabase.from('carrinhos').delete().eq('user_id', userId)
      return
    }

    // Upsert todos os itens de uma vez
    await supabase.from('carrinhos').upsert(rows, { onConflict: 'user_id,sku' })

    // Remove itens que foram zerados
    const activeSKUs = rows.map(r => r.sku)
    await supabase.from('carrinhos')
      .delete()
      .eq('user_id', userId)
      .not('sku', 'in', `(${activeSKUs.map(s => `"${s}"`).join(',')})`)
  }

  const setCart = useCallback((updater: (prev: Cart) => Cart) => {
    setCartState(prev => {
      const next = updater(prev)
      writeLocal(next)

      // Sincroniza com Supabase em background se logado
      if (user) {
        syncToSupabase(user.id, next)
      }

      return next
    })
  }, [user?.id])

  function addToCart(sku: string, qty: number = 1) {
    setCart(c => ({ ...c, [sku]: (c[sku] ?? 0) + qty }))
    // Analytics (best-effort; não bloqueia o carrinho)
    const found = findVariation(sku)
    if (found) {
      trackAddToCart({
        item_id: sku,
        item_name: `${found.product.name} — ${found.variation.label}`,
        price: getTierForQuantity(found.variation.tiers, qty).price,
        quantity: qty,
        item_category: found.product.category,
      })
    }
  }

  function updateQuantity(sku: string, quantity: number) {
    setCart(c => {
      const next = { ...c }
      if (quantity <= 0) delete next[sku]
      else next[sku] = quantity
      return next
    })
  }

  function clearCart() {
    setCart(() => ({}))
    if (user) {
      const supabase = createClient()
      supabase.from('carrinhos').delete().eq('user_id', user.id)
    }
  }

  return { cart, setCart, addToCart, updateQuantity, clearCart, syncing }
}
