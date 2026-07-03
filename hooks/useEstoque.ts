'use client'

// hooks/useEstoque.ts
// Lê o estoque (tabela public.estoque) no navegador, uma vez só (cache compartilhado).
// Retorna { sku: quantidade }. SKU ausente = "não controlado" (sem limite).

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

let cache: Record<string, number> | null = null
let inflight: Promise<Record<string, number>> | null = null

async function carregar(): Promise<Record<string, number>> {
  if (cache) return cache
  if (inflight) return inflight
  inflight = (async () => {
    try {
      const supabase = createClient()
      const [estoqueRes, pausadosRes] = await Promise.all([
        supabase.from('estoque').select('sku, quantidade'),
        supabase.from('produtos_pausados').select('sku'),
      ])
      const map: Record<string, number> = {}
      if (estoqueRes.data) for (const r of estoqueRes.data) map[r.sku as string] = r.quantidade as number
      // SKU pausado → 0 (esgotado), independente da quantidade real.
      if (pausadosRes.data) for (const r of pausadosRes.data) map[r.sku as string] = 0
      cache = map
      return map
    } catch {
      return {}
    }
  })()
  return inflight
}

export function useEstoque(): Record<string, number> {
  const [estoque, setEstoque] = useState<Record<string, number>>(cache || {})
  useEffect(() => {
    let vivo = true
    carregar().then((m) => { if (vivo) setEstoque(m) })
    return () => { vivo = false }
  }, [])
  return estoque
}
