'use client'

// components/AdminPanel.tsx
// Painel admin com abas. Dados reais do Supabase (espelho de segurança). A aba
// Estoque reusa o AdminEstoque (pausar/ativar). Financeiro/Relatórios: em breve.

import { useMemo, useState } from 'react'
import { Logo } from '@/components/Logo'
import { AdminEstoque } from '@/components/AdminEstoque'
import { formatCurrency, findVariation } from '@/lib/pricing'
import styles from './AdminPanel.module.css'

type Item = { descricao: string; sku: string; quantidade: number; preco_unitario: number }
type Pedido = {
  id: string
  data: string
  pagoEm: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone: string
  total: number
  forma_pagamento: string
  pagamento_status: string
  status: string
  rastreio: string
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

// Opções do status do pedido (enum pedido_status)
const STATUS_OPCOES: { valor: string; label: string }[] = [
  { valor: 'pendente', label: 'Pendente' },
  { valor: 'confirmado', label: 'Confirmado' },
  { valor: 'em_separacao', label: 'Em separação' },
  { valor: 'enviado', label: 'Enviado' },
  { valor: 'entregue', label: 'Entregue' },
  { valor: 'cancelado', label: 'Cancelado' },
]

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
      {stats.pedidosNoCap && (
        <p className={styles.aviso}>
          ⚠ Números baseados nos 300 pedidos mais recentes (há mais no banco).
        </p>
      )}
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
  const [overrides, setOverrides] = useState<Record<string, { status?: string; rastreio?: string }>>({})
  // Draft e "salvando" POR PEDIDO (não global): evita o rascunho de rastreio vazar
  // entre pedidos e não trava os botões de todos ao salvar um.
  const [rastreioDraft, setRastreioDraft] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState<Set<string>>(new Set())

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

  const statusDe = (p: Pedido) => overrides[p.id]?.status ?? p.status
  const rastreioDe = (p: Pedido) => overrides[p.id]?.rastreio ?? p.rastreio ?? ''

  function abrirPedido(p: Pedido) {
    setAberto((cur) => (cur === p.id ? null : p.id))
  }

  // Valor atual do input de rastreio de um pedido (rascunho > salvo).
  const draftDe = (p: Pedido) => rastreioDraft[p.id] ?? rastreioDe(p)

  async function salvar(id: string, patch: { status?: string; rastreio?: string }) {
    setSalvando((prev) => new Set(prev).add(id))
    try {
      const res = await fetch('/api/admin/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: id, ...patch }),
      })
      if (!res.ok) throw new Error()
      setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
      // Rastreio salvo -> limpa o rascunho pra o input refletir o valor do servidor
      // (evita reeditar/apagar um rastreio salvo achando que é rascunho novo).
      if (patch.rastreio !== undefined) {
        setRastreioDraft((prev) => {
          const n = { ...prev }
          delete n[id]
          return n
        })
      }
    } catch {
      alert('Não foi possível salvar. Confira se a migração 006 foi rodada no Supabase e tente de novo.')
    } finally {
      setSalvando((prev) => {
        const n = new Set(prev)
        n.delete(id)
        return n
      })
    }
  }

  function waLink(p: Pedido): string | null {
    const tel = (p.clienteTelefone || '').replace(/\D/g, '')
    if (tel.length < 10) return null
    const num = tel.startsWith('55') ? tel : `55${tel}`
    const codigo = p.id.slice(0, 8).toUpperCase()
    const msg =
      p.pagamento_status === 'pago'
        ? `Olá ${p.clienteNome}! Sobre o seu pedido ${codigo} na Grape Tools:`
        : `Olá ${p.clienteNome}! Passando sobre o seu pedido ${codigo} na Grape Tools — o pagamento ainda não foi confirmado. Posso te ajudar a finalizar? 😊`
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
  }

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
                <button className={styles.cardHead} onClick={() => abrirPedido(p)} type="button">
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
                      {p.clienteTelefone && <span><b>Telefone:</b> {p.clienteTelefone}</span>}
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

                    <div className={styles.acoes}>
                      <div className={styles.acaoCampo}>
                        <label>Status do pedido</label>
                        <select
                          value={statusDe(p)}
                          disabled={salvando.has(p.id)}
                          onChange={(e) => salvar(p.id, { status: e.target.value })}
                        >
                          {STATUS_OPCOES.map((o) => (
                            <option key={o.valor} value={o.valor}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.acaoCampo}>
                        <label>Código de rastreio</label>
                        <div className={styles.rastreioRow}>
                          <input
                            type="text"
                            placeholder="Ex.: AA123456789BR"
                            value={draftDe(p)}
                            onChange={(e) =>
                              setRastreioDraft((prev) => ({ ...prev, [p.id]: e.target.value }))
                            }
                          />
                          <button
                            type="button"
                            disabled={salvando.has(p.id) || draftDe(p) === rastreioDe(p)}
                            onClick={() => salvar(p.id, { rastreio: draftDe(p) })}
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                      {waLink(p) && (
                        <a
                          className={styles.waBtn}
                          href={waLink(p) as string}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {p.pagamento_status === 'pago' ? 'Falar no WhatsApp' : 'Cobrar no WhatsApp'}
                        </a>
                      )}
                    </div>
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

const FORMA_LABEL: Record<string, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  boleto: 'Boleto',
  transferencia: 'Transferência',
}
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function mesLabel(ym: string): string {
  const [y, m] = ym.split('-')
  const idx = Number(m) - 1
  if (!y || idx < 0 || idx > 11) return ym
  return `${MESES_ABREV[idx]}/${y}`
}

// ---------- Aba: Financeiro ----------
function FinanceiroView({ pedidos, noCap }: { pedidos: Pedido[]; noCap: boolean }) {
  const fin = useMemo(() => {
    const pagos = pedidos.filter((p) => p.pagamento_status === 'pago')
    const faturamento = pagos.reduce((s, p) => s + p.total, 0)
    const aReceber = pedidos
      .filter((p) => p.pagamento_status === 'nao_pago')
      .reduce((s, p) => s + p.total, 0)
    const ticketMedio = pagos.length ? faturamento / pagos.length : 0

    const formaMap = new Map<string, { total: number; n: number }>()
    for (const p of pagos) {
      const k = p.forma_pagamento || '—'
      const cur = formaMap.get(k) || { total: 0, n: 0 }
      cur.total += p.total
      cur.n += 1
      formaMap.set(k, cur)
    }
    const porForma = [...formaMap.entries()]
      .map(([forma, v]) => ({ forma, ...v, pct: faturamento ? (v.total / faturamento) * 100 : 0 }))
      .sort((a, b) => b.total - a.total)

    const mesMap = new Map<string, number>()
    for (const p of pagos) {
      const iso = p.pagoEm || p.data
      const mes = iso ? iso.slice(0, 7) : '—'
      mesMap.set(mes, (mesMap.get(mes) || 0) + p.total)
    }
    const porMes = [...mesMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    const maxMes = Math.max(1, ...porMes.map(([, v]) => v))

    return { qtdPagos: pagos.length, faturamento, aReceber, ticketMedio, porForma, porMes, maxMes }
  }, [pedidos])

  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={`${styles.stat} ${styles.statBig}`}>
          <strong>{formatCurrency(fin.faturamento)}</strong>
          <span>Faturamento (pago)</span>
        </div>
        <div className={`${styles.stat} ${fin.aReceber > 0 ? styles.statAlerta : ''}`}>
          <strong>{formatCurrency(fin.aReceber)}</strong>
          <span>A receber (pendente)</span>
        </div>
        <div className={styles.stat}>
          <strong>{formatCurrency(fin.ticketMedio)}</strong>
          <span>Ticket médio</span>
        </div>
        <div className={styles.stat}>
          <strong>{fin.qtdPagos}</strong>
          <span>Pedidos pagos</span>
        </div>
      </div>

      {fin.qtdPagos === 0 ? (
        <p className={styles.vazio}>Ainda não há pagamentos confirmados.</p>
      ) : (
        <>
          <h3 className={styles.blocoTitulo}>Por forma de pagamento</h3>
          <div className={styles.finList}>
            {fin.porForma.map((f) => (
              <div key={f.forma} className={styles.finRow}>
                <span className={styles.finLabel}>{FORMA_LABEL[f.forma] || f.forma}</span>
                <span className={styles.finBarWrap}>
                  <span className={styles.finBar} style={{ width: `${Math.max(2, f.pct)}%` }} />
                </span>
                <span className={styles.finVal}>
                  {formatCurrency(f.total)} <em>{f.pct.toFixed(0)}%</em>
                </span>
              </div>
            ))}
          </div>

          <h3 className={styles.blocoTitulo}>Faturamento por mês</h3>
          <div className={styles.finList}>
            {fin.porMes.map(([mes, val]) => (
              <div key={mes} className={styles.finRow}>
                <span className={styles.finLabel}>{mesLabel(mes)}</span>
                <span className={styles.finBarWrap}>
                  <span className={styles.finBar} style={{ width: `${Math.max(2, (val / fin.maxMes) * 100)}%` }} />
                </span>
                <span className={styles.finVal}>{formatCurrency(val)}</span>
              </div>
            ))}
          </div>

          {noCap && (
            <p className={styles.aviso}>Baseado nos 300 pedidos mais recentes.</p>
          )}
        </>
      )}
    </div>
  )
}

// ---------- Aba: Relatórios ----------
function RelatoriosView({ pedidos, noCap }: { pedidos: Pedido[]; noCap: boolean }) {
  const rel = useMemo(() => {
    const pagos = pedidos.filter((p) => p.pagamento_status === 'pago')
    const skuMap = new Map<string, { descricao: string; qtd: number; receita: number }>()
    const catMap = new Map<string, { qtd: number; receita: number }>()
    for (const p of pagos) {
      for (const it of p.itens) {
        const receita = it.preco_unitario * it.quantidade
        const s = skuMap.get(it.sku) || { descricao: it.descricao, qtd: 0, receita: 0 }
        s.qtd += it.quantidade
        s.receita += receita
        skuMap.set(it.sku, s)
        const cat = findVariation(it.sku)?.product.category || 'Outros'
        const c = catMap.get(cat) || { qtd: 0, receita: 0 }
        c.qtd += it.quantidade
        c.receita += receita
        catMap.set(cat, c)
      }
    }
    const maisVendidos = [...skuMap.entries()]
      .map(([sku, v]) => ({ sku, ...v }))
      .sort((a, b) => b.qtd - a.qtd)
    const totalCat = [...catMap.values()].reduce((s, v) => s + v.receita, 0)
    const porCategoria = [...catMap.entries()]
      .map(([cat, v]) => ({ cat, ...v, pct: totalCat ? (v.receita / totalCat) * 100 : 0 }))
      .sort((a, b) => b.receita - a.receita)
    const maxCat = Math.max(1, ...porCategoria.map((c) => c.receita))
    return { maisVendidos, porCategoria, maxCat }
  }, [pedidos])

  if (rel.maisVendidos.length === 0) {
    return <p className={styles.vazio}>Ainda não há vendas pagas para gerar relatórios.</p>
  }

  const top = rel.maisVendidos.slice(0, 30)

  return (
    <div>
      <h3 className={styles.blocoTitulo}>Produtos mais vendidos</h3>
      <div className={styles.tabelaWrap}>
        <table className={styles.itensTable}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>SKU</th>
              <th>Qtd vendida</th>
              <th>Receita</th>
            </tr>
          </thead>
          <tbody>
            {top.map((m) => (
              <tr key={m.sku}>
                <td>{m.descricao}</td>
                <td className={styles.mono}>{m.sku}</td>
                <td>{m.qtd}</td>
                <td>{formatCurrency(m.receita)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rel.maisVendidos.length > 30 && (
        <p className={styles.aviso}>Mostrando os 30 mais vendidos (de {rel.maisVendidos.length} itens).</p>
      )}

      <h3 className={styles.blocoTitulo}>Vendas por categoria</h3>
      <div className={styles.finList}>
        {rel.porCategoria.map((c) => (
          <div key={c.cat} className={styles.finRow}>
            <span className={styles.finLabel}>{c.cat}</span>
            <span className={styles.finBarWrap}>
              <span className={styles.finBar} style={{ width: `${Math.max(2, (c.receita / rel.maxCat) * 100)}%` }} />
            </span>
            <span className={styles.finVal}>
              {formatCurrency(c.receita)} <em>{c.pct.toFixed(0)}%</em>
            </span>
          </div>
        ))}
      </div>
      {noCap && <p className={styles.aviso}>Baseado nos 300 pedidos mais recentes.</p>}
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
        {tab === 'Financeiro' && <FinanceiroView pedidos={pedidos} noCap={stats.pedidosNoCap} />}
        {tab === 'Relatórios' && <RelatoriosView pedidos={pedidos} noCap={stats.pedidosNoCap} />}
      </section>
    </main>
  )
}
