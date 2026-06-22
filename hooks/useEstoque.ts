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
      const { data } = await supabase.from('estoque').select('sku, quantidade')
      const map: Record<string, number> = {}
      if (data) for (const r of data) map[r.sku as string] = r.quantidade as number
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
