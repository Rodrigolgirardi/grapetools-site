'use client'

// components/AdminEstoque.tsx
// Painel de estoque: pausar/reativar cada SKU (variação). Pausado = "Esgotado" no
// site. A pausa é uma flag separada da quantidade (não briga com o GrapeOne).
// Escreve via /api/admin/pausar (protegido por admin).

import { useMemo, useState } from 'react'
import { products } from '@/lib/data'
import styles from './AdminEstoque.module.css'

export function AdminEstoque({ pausadosIniciais }: { pausadosIniciais: string[] }) {
  const [pausados, setPausados] = useState<Set<string>>(() => new Set(pausadosIniciais))
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [soPausados, setSoPausados] = useState(false)
  const [salvando, setSalvando] = useState<string | null>(null)
  const [aberto, setAberto] = useState<Set<string>>(() => new Set())

  const categorias = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    []
  )
  const totalVariacoes = useMemo(
    () => products.reduce((s, p) => s + p.variations.length, 0),
    []
  )

  // Ao buscar texto ou filtrar "só pausados", expande os cartões automaticamente.
  const autoExpand = busca.trim() !== '' || soPausados

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return products.filter((p) => {
      if (categoria && p.category !== categoria) return false
      if (soPausados && !p.variations.some((v) => pausados.has(v.sku))) return false
      if (t) {
        const hay = [p.name, p.prefix, ...p.variations.map((v) => `${v.label} ${v.sku}`)]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(t)) return false
      }
      return true
    })
  }, [busca, categoria, soPausados, pausados])

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

  function toggleCard(prefix: string) {
    setAberto((prev) => {
      const n = new Set(prev)
      if (n.has(prefix)) n.delete(prefix)
      else n.add(prefix)
      return n
    })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Estoque</h2>
          <p className={styles.sub}>
            Pause o que você não tem — aparece “Esgotado” no site na hora e o checkout bloqueia a venda.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>{products.length}</strong>
            <span>produtos</span>
          </div>
          <div className={styles.stat}>
            <strong>{totalVariacoes}</strong>
            <span>variações</span>
          </div>
          <div className={`${styles.stat} ${pausados.size ? styles.statAlert : ''}`}>
            <strong>{pausados.size}</strong>
            <span>pausadas</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          type="text"
          placeholder="Buscar produto, variação ou SKU…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className={styles.select}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className={`${styles.filterBtn} ${soPausados ? styles.filterBtnOn : ''}`}
          onClick={() => setSoPausados((v) => !v)}
          type="button"
        >
          {soPausados ? '● Só pausados' : '○ Só pausados'}
        </button>
      </div>

      {lista.length === 0 ? (
        <p className={styles.vazio}>Nenhum produto encontrado com esses filtros.</p>
      ) : (
        <div className={styles.list}>
          {lista.map((p) => {
            const pausadasNo = p.variations.filter((v) => pausados.has(v.sku)).length
            const expandido = autoExpand || aberto.has(p.prefix)
            return (
              <div key={p.prefix} className={styles.card}>
                <button className={styles.cardHead} onClick={() => toggleCard(p.prefix)} type="button">
                  <span className={styles.cardInfo}>
                    <span className={styles.cardName}>{p.name}</span>
                    <span className={styles.cardMeta}>
                      {p.category} · {p.variations.length}{' '}
                      {p.variations.length === 1 ? 'variação' : 'variações'}
                    </span>
                  </span>
                  <span className={styles.cardRight}>
                    {pausadasNo > 0 && (
                      <span className={styles.badge}>
                        {pausadasNo} pausada{pausadasNo > 1 ? 's' : ''}
                      </span>
                    )}
                    <span className={`${styles.chevron} ${expandido ? styles.chevronOpen : ''}`}>▾</span>
                  </span>
                </button>

                {expandido && (
                  <div className={styles.cardBody}>
                    {p.variations.map((v) => {
                      const off = pausados.has(v.sku)
                      const saving = salvando === v.sku
                      return (
                        <div key={v.sku} className={styles.varRow}>
                          <span className={styles.varInfo}>
                            <span className={styles.varLabel}>{v.label}</span>
                            <span className={styles.varSku}>{v.sku}</span>
                          </span>
                          <span className={styles.varRight}>
                            <span className={`${styles.status} ${off ? styles.statusOff : styles.statusOn}`}>
                              {off ? 'Pausado' : 'À venda'}
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={!off}
                              aria-label={off ? `Reativar ${v.sku}` : `Pausar ${v.sku}`}
                              className={`${styles.switch} ${off ? '' : styles.switchOn} ${saving ? styles.switchSaving : ''}`}
                              disabled={saving}
                              onClick={() => toggle(v.sku, !off)}
                            >
                              <span className={styles.knob} />
                            </button>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
