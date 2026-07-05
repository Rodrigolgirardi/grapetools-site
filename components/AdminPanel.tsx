'use client'

// components/AdminPanel.tsx
// Painel admin com abas. Dados reais do Supabase (espelho de segurança). A aba
// Estoque reusa o AdminEstoque (pausar/ativar). Financeiro/Relatórios: em breve.

import { useMemo, useState } from 'react'
import { Logo } from '@/components/Logo'
import { AdminEstoque } from '@/components/AdminEstoque'
import { formatCurrency } from '@/lib/pricing'
import styles from './AdminPanel.module.css'

type Item = { descricao: string; sku: string; quantidade: number; preco_unitario: number }
type Pedido = {
  id: string
  data: string
  clienteNome: string
  clienteEmail: string
  total: number
  forma_pagamento: string
  pagamento_status: string
  status: string
  pagarme_order_id: string | null
  itens: Item[]
}
type Cliente = {
  nome: string
  email: string
  cnpj: string
  telefone: string
  criadoEm: string
  numPedidos: number
  totalGasto: number
}
type Stats = {
  produtos: number
  pedidos: number
  pedidosPagos: number
  pedidosPendentes: number
  clientes: number
  faturamento: number
  aReceber: number
  pedidosNoCap: boolean
}

const TABS = ['Início', 'Pedidos', 'Clientes', 'Estoque', 'Financeiro', 'Relatórios'] as const
type Tab = (typeof TABS)[number]

function dataBR(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

const PAG_LABEL: Record<string, { texto: string; cls: string }> = {
  pago: { texto: 'Pago', cls: 'pgPago' },
  nao_pago: { texto: 'Aguardando', cls: 'pgAguard' },
  falhou: { texto: 'Falhou', cls: 'pgFalhou' },
  estornado: { texto: 'Estornado', cls: 'pgEstorno' },
}

function BadgePagamento({ status }: { status: string }) {
  const b = PAG_LABEL[status] || { texto: status, cls: 'pgAguard' }
  return <span className={`${styles.badge} ${styles[b.cls]}`}>{b.texto}</span>
}

// ---------- Aba: Início (números reais) ----------
function Dashboard({ stats, pedidos }: { stats: Stats; pedidos: Pedido[] }) {
  const cards: { label: string; valor: string; tipo?: 'destaque' | 'alerta' }[] = [
    { label: 'Faturamento (pago)', valor: formatCurrency(stats.faturamento), tipo: 'destaque' },
    { label: 'A receber (pendente)', valor: formatCurrency(stats.aReceber), tipo: stats.aReceber > 0 ? 'alerta' : undefined },
    { label: 'Pedidos', valor: String(stats.pedidos) },
    { label: 'Pagos', valor: String(stats.pedidosPagos) },
    { label: 'Pendentes', valor: String(stats.pedidosPendentes), tipo: stats.pedidosPendentes > 0 ? 'alerta' : undefined },
    { label: 'Clientes', valor: String(stats.clientes) },
  ]
  const recentes = pedidos.slice(0, 5)
  return (
    <div>
      <div className={styles.statsGrid}>
        {cards.map((c) => (
          <div
            key={c.label}
            className={`${styles.stat} ${c.tipo === 'destaque' ? styles.statBig : ''} ${c.tipo === 'alerta' ? styles.statAlerta : ''}`}
          >
            <strong>{c.valor}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
      <h3 className={styles.blocoTitulo}>Últimos pedidos</h3>
      {recentes.length === 0 ? (
        <p className={styles.vazio}>Nenhum pedido ainda.</p>
      ) : (
        <div className={styles.list}>
          {recentes.map((p) => (
            <div key={p.id} className={styles.rowMini}>
              <span className={styles.miniData}>{dataBR(p.data)}</span>
              <span className={styles.miniCliente}>{p.clienteNome}</span>
              <BadgePagamento status={p.pagamento_status} />
              <strong className={styles.miniTotal}>{formatCurrency(p.total)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- Aba: Pedidos ----------
function PedidosView({ pedidos, noCap }: { pedidos: Pedido[]; noCap: boolean }) {
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState<string | null>(null)
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'nao_pago' | 'pago'>('todos')

  const counts = useMemo(
    () => ({
      todos: pedidos.length,
      nao_pago: pedidos.filter((p) => p.pagamento_status === 'nao_pago').length,
      pago: pedidos.filter((p) => p.pagamento_status === 'pago').length,
    }),
    [pedidos]
  )

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return pedidos.filter((p) => {
      if (statusFiltro !== 'todos' && p.pagamento_status !== statusFiltro) return false
      if (
        t &&
        !`${p.clienteNome} ${p.clienteEmail} ${p.id} ${p.pagamento_status} ${p.status}`
          .toLowerCase()
          .includes(t)
      )
        return false
      return true
    })
  }, [busca, statusFiltro, pedidos])

  const chips: { key: 'todos' | 'nao_pago' | 'pago'; label: string; n: number }[] = [
    { key: 'todos', label: 'Todos', n: counts.todos },
    { key: 'nao_pago', label: 'Pendentes', n: counts.nao_pago },
    { key: 'pago', label: 'Pagos', n: counts.pago },
  ]

  return (
    <div>
      <div className={styles.chips}>
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`${styles.chip} ${statusFiltro === c.key ? styles.chipOn : ''}`}
            onClick={() => setStatusFiltro(c.key)}
          >
            {c.label} <span className={styles.chipN}>{c.n}</span>
          </button>
        ))}
      </div>
      <input
        className={styles.search}
        placeholder="Buscar por cliente, e-mail, status…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      {noCap && <p className={styles.aviso}>Mostrando os 300 pedidos mais recentes.</p>}
      {lista.length === 0 ? (
        <p className={styles.vazio}>
          {statusFiltro === 'nao_pago'
            ? 'Nenhum pedido pendente no momento. 🎉'
            : 'Nenhum pedido encontrado.'}
        </p>
      ) : (
        <div className={styles.list}>
          {lista.map((p) => {
            const exp = aberto === p.id
            return (
              <div key={p.id} className={styles.card}>
                <button className={styles.cardHead} onClick={() => setAberto(exp ? null : p.id)} type="button">
                  <span className={styles.pedInfo}>
                    <span className={styles.pedCliente}>{p.clienteNome}</span>
                    <span className={styles.pedMeta}>{dataBR(p.data)} · {p.forma_pagamento} · {p.itens.length} item(ns)</span>
                  </span>
                  <span className={styles.pedRight}>
                    <BadgePagamento status={p.pagamento_status} />
                    <strong className={styles.pedTotal}>{formatCurrency(p.total)}</strong>
                    <span className={`${styles.chevron} ${exp ? styles.chevronOpen : ''}`}>▾</span>
                  </span>
                </button>
                {exp && (
                  <div className={styles.cardBody}>
                    <div className={styles.detGrid}>
                      <span><b>E-mail:</b> {p.clienteEmail}</span>
                      <span><b>Status do pedido:</b> {p.status}</span>
                      <span><b>Pedido:</b> {p.id.slice(0, 8).toUpperCase()}</span>
                      {p.pagarme_order_id && <span><b>Pagar.me:</b> {p.pagarme_order_id}</span>}
                    </div>
                    <table className={styles.itensTable}>
                      <thead>
                        <tr><th>Item</th><th>SKU</th><th>Qtd</th><th>Unit.</th><th>Subtotal</th></tr>
                      </thead>
                      <tbody>
                        {p.itens.map((it, i) => (
                          <tr key={`${it.sku}-${i}`}>
                            <td>{it.descricao}</td>
                            <td className={styles.mono}>{it.sku}</td>
                            <td>{it.quantidade}</td>
                            <td>{formatCurrency(it.preco_unitario)}</td>
                            <td>{formatCurrency(it.preco_unitario * it.quantidade)}</td>
                          </tr>
                        ))}
                        {p.itens.length === 0 && (
                          <tr><td colSpan={5} className={styles.vazioCell}>Sem itens registrados.</td></tr>
                        )}
                      </tbody>
                    </table>
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

// ---------- Aba: Clientes ----------
function ClientesView({ clientes }: { clientes: Cliente[] }) {
  const [busca, setBusca] = useState('')
  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase()
    const base = t
      ? clientes.filter((c) => `${c.nome} ${c.email} ${c.cnpj} ${c.telefone}`.toLowerCase().includes(t))
      : clientes
    return [...base].sort((a, b) => b.numPedidos - a.numPedidos)
  }, [busca, clientes])

  return (
    <div>
      <input
        className={styles.search}
        placeholder="Buscar cliente por nome, e-mail, CNPJ…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      {lista.length === 0 ? (
        <p className={styles.vazio}>Nenhum cliente encontrado.</p>
      ) : (
        <div className={styles.list}>
          {lista.map((c) => (
            <div key={c.email} className={styles.clienteRow}>
              <span className={styles.cliInfo}>
                <span className={styles.cliNome}>{c.nome}</span>
                <span className={styles.cliMeta}>
                  {c.email}
                  {c.cnpj ? ` · ${c.cnpj}` : ''}
                  {c.telefone ? ` · ${c.telefone}` : ''}
                </span>
              </span>
              <span className={styles.cliStats}>
                <span className={styles.cliPedidos}>{c.numPedidos} pedido(s)</span>
                <strong>{formatCurrency(c.totalGasto)}</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmBreve({ nome }: { nome: string }) {
  return (
    <div className={styles.emBreve}>
      <strong>{nome}</strong>
      <span>Em breve. Por enquanto, use a aba Início para os números.</span>
    </div>
  )
}

// ---------- Painel ----------
export function AdminPanel({
  pedidos,
  clientes,
  pausadosIniciais,
  stats,
}: {
  pedidos: Pedido[]
  clientes: Cliente[]
  pausadosIniciais: string[]
  stats: Stats
}) {
  const [tab, setTab] = useState<Tab>('Início')

  return (
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logo />
        </div>
        <nav className={styles.nav}>
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.navBtn} ${tab === t ? styles.navOn : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <a href="/" className={styles.verPortal}>← Ver o site</a>
      </aside>

      <section className={styles.main}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Painel Administrativo</span>
            <h1 className={styles.title}>{tab}</h1>
          </div>
        </div>

        {tab === 'Início' && <Dashboard stats={stats} pedidos={pedidos} />}
        {tab === 'Pedidos' && <PedidosView pedidos={pedidos} noCap={stats.pedidosNoCap} />}
        {tab === 'Clientes' && <ClientesView clientes={clientes} />}
        {tab === 'Estoque' && <AdminEstoque pausadosIniciais={pausadosIniciais} />}
        {tab === 'Financeiro' && <EmBreve nome="Financeiro" />}
        {tab === 'Relatórios' && <EmBreve nome="Relatórios" />}
      </section>
    </main>
  )
}
