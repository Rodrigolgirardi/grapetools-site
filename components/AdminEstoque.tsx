'use client'

// components/AdminEstoque.tsx
// Painel de estoque: pausar/reativar cada SKU (variação). Pausado = aparece
// "Esgotado" no site. A pausa é uma flag separada da quantidade (não briga com o
// GrapeOne). Escreve via /api/admin/pausar (protegido por admin).

import { useMemo, useState } from 'react'
import { products } from '@/lib/data'

export function AdminEstoque({ pausadosIniciais }: { pausadosIniciais: string[] }) {
  const [pausados, setPausados] = useState<Set<string>>(() => new Set(pausadosIniciais))
  const [busca, setBusca] = useState('')
  const [salvando, setSalvando] = useState<string | null>(null)

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase()
    if (!t) return products
    return products.filter((p) =>
      [p.name, p.prefix, ...p.variations.map((v) => `${v.label} ${v.sku}`)]
        .join(' ')
        .toLowerCase()
        .includes(t)
    )
  }, [busca])

  async function toggle(sku: string, pausar: boolean) {
    setSalvando(sku)
    try {
      const res = await fetch('/api/admin/pausar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, pausado: pausar }),
      })
      if (!res.ok) throw new Error()
      setPausados((prev) => {
        const n = new Set(prev)
        if (pausar) n.add(sku)
        else n.delete(sku)
        return n
      })
    } catch {
      alert('Não foi possível salvar. Confira se a migração 005 foi rodada no Supabase e tente de novo.')
    } finally {
      setSalvando(null)
    }
  }

  return (
    <div className="adminTable">
      <div className="tableHead">
        <strong>Estoque — Pausar / Ativar</strong>
        <span>{pausados.size} pausado(s). SKU pausado aparece como “Esgotado” no site.</span>
      </div>

      <input
        type="text"
        placeholder="Buscar produto, variação ou SKU…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          margin: '12px 0',
          borderRadius: 8,
          border: '1px solid #ddd',
          fontSize: 14,
        }}
      />

      {lista.map((p) => (
        <div key={p.prefix} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {p.name} <span style={{ color: '#999', fontWeight: 400 }}>· {p.prefix}</span>
          </div>
          {p.variations.map((v) => {
            const off = pausados.has(v.sku)
            const saving = salvando === v.sku
            return (
              <div
                key={v.sku}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '5px 0',
                }}
              >
                <span style={{ fontSize: 13 }}>
                  {v.label} <span style={{ color: '#999' }}>· {v.sku}</span>
                  {off && <strong style={{ color: '#c0392b', marginLeft: 8 }}>PAUSADO</strong>}
                </span>
                <button
                  onClick={() => toggle(v.sku, !off)}
                  disabled={saving}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: saving ? 'wait' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 90,
                    background: off ? '#e8f5e9' : '#fdecea',
                    color: off ? '#1e7e34' : '#c0392b',
                  }}
                >
                  {saving ? '…' : off ? 'Ativar' : 'Pausar'}
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
