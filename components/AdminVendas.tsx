'use client'

// components/AdminVendas.tsx
// Aba "Vendas" do admin — central de expedição no estilo Mercado Livre.
// Só pedidos PAGOS aparecem aqui (venda = dinheiro entrou). Cada cartão traz o
// que a expedição precisa: quem comprou, o quê, status do envio, botão de
// comprar/imprimir a etiqueta (Melhor Envio), romaneio e conversa no WhatsApp.

import { useEffect, useMemo, useState } from 'react'
import { formatCurrency, findVariation, JUROS_AO_MES, PARCELAS_SEM_JUROS } from '@/lib/pricing'
import { productImageSrc, handleProductImageError } from '@/lib/product-image'
import { tarifaVenda, tarifaDescricao } from '@/lib/tarifas'
import { GRAPEONE } from '@/lib/grape-one.generated'
import type { Pedido } from '@/components/AdminPanel'
import styles from './AdminVendas.module.css'

type Filtro = 'enviar' | 'pronta' | 'enviadas' | 'retirada' | 'finalizadas' | 'todas'

const MOTIVOS_CANCELAMENTO = [
  'Me arrependi da venda',
  'Produto está sem estoque',
  'Comprador teve problema com o pedido',
  'Problema de integração',
  'Outros problemas',
] as const

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function dataML(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${MESES[d.getMonth()]} ${hh}:${mm} hs`
}

const codigoPedido = (p: Pedido) => `#${p.id.slice(0, 8).toUpperCase()}`
const codigoCliente = (p: Pedido) => p.clienteUserId.slice(0, 8).toUpperCase()

export function AdminVendas({ pedidos }: { pedidos: Pedido[] }) {
  const [filtro, setFiltro] = useState<Filtro>('enviar')
  const [busca, setBusca] = useState('')
  // Estado local por pedido: etiqueta comprada agora + rastreio/status novos
  const [etiquetas, setEtiquetas] = useState<Record<string, string>>({})
  const [rastreios, setRastreios] = useState<Record<string, string>>({})
  const [statusLocal, setStatusLocal] = useState<Record<string, string>>({})
  const [comprando, setComprando] = useState<Set<string>>(new Set())
  // Menu "⋯" e painéis
  const [menuAberto, setMenuAberto] = useState<string | null>(null)
  const [detalheDe, setDetalheDe] = useState<Pedido | null>(null)
  const [cancelandoPedido, setCancelandoPedido] = useState<Pedido | null>(null)
  const [notaPedido, setNotaPedido] = useState<Pedido | null>(null)
  // Overrides locais salvos pelos painéis (sem recarregar a página)
  const [notasLocal, setNotasLocal] = useState<Record<string, string>>({})
  const [nfLocal, setNfLocal] = useState<Record<string, string>>({})

  // Fecha o menu "⋯" ao clicar em qualquer outro lugar
  useEffect(() => {
    if (!menuAberto) return
    const fechar = () => setMenuAberto(null)
    window.addEventListener('click', fechar)
    return () => window.removeEventListener('click', fechar)
  }, [menuAberto])

  const etiquetaDe = (p: Pedido) => etiquetas[p.id] || p.etiquetaUrl
  const rastreioDe = (p: Pedido) => rastreios[p.id] || p.rastreio
  const statusDe = (p: Pedido) => statusLocal[p.id] ?? p.status

  // Classificação de cada venda pro filtro (só pagos entram na aba)
  const vendas = useMemo(() => pedidos.filter((p) => p.pagamento_status === 'pago'), [pedidos])
  function grupoDe(p: Pedido): Filtro {
    const st = statusDe(p)
    if (st === 'entregue') return 'finalizadas'
    if (st === 'enviado') return 'enviadas'
    if (p.entregaTipo === 'retirada') return 'retirada'
    if (etiquetaDe(p)) return 'pronta'
    return 'enviar'
  }

  const contagem = useMemo(() => {
    const c: Record<Filtro, number> = { enviar: 0, pronta: 0, enviadas: 0, retirada: 0, finalizadas: 0, todas: vendas.length }
    for (const p of vendas) c[grupoDe(p)]++
    return c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendas, etiquetas, statusLocal])

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return vendas
      .filter((p) => (filtro === 'todas' ? true : grupoDe(p) === filtro))
      .filter((p) => {
        if (!q) return true
        return (
          p.clienteNome.toLowerCase().includes(q) ||
          p.clienteEmail.toLowerCase().includes(q) ||
          codigoPedido(p).toLowerCase().includes(q) ||
          p.itens.some((it) => it.sku.toLowerCase().includes(q) || it.descricao.toLowerCase().includes(q))
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendas, filtro, busca, etiquetas, statusLocal])

  async function comprarEtiqueta(p: Pedido) {
    const freteTxt = p.freteServicoNome
      ? `${p.freteServicoNome}${p.freteValor > 0 ? ` (cliente pagou ${formatCurrency(p.freteValor)})` : ' (frete grátis)'}`
      : 'serviço mais barato disponível'
    if (!confirm(`Comprar etiqueta via ${freteTxt}?\n\nO valor será debitado da carteira do Melhor Envio.`)) return
    setComprando((prev) => new Set(prev).add(p.id))
    try {
      const res = await fetch('/api/admin/etiqueta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: p.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (data?.etiqueta_url) setEtiquetas((prev) => ({ ...prev, [p.id]: data.etiqueta_url }))
      if (data?.rastreio) setRastreios((prev) => ({ ...prev, [p.id]: data.rastreio }))
      if (!res.ok) {
        alert(data?.error || 'Não foi possível comprar a etiqueta.')
        return
      }
    } catch {
      alert('Erro de rede. Confira no painel do Melhor Envio antes de tentar de novo (a etiqueta pode ter sido comprada).')
    } finally {
      setComprando((prev) => {
        const n = new Set(prev)
        n.delete(p.id)
        return n
      })
    }
  }

  async function marcarEnviado(p: Pedido) {
    const novo = p.entregaTipo === 'retirada' ? 'entregue' : 'enviado'
    try {
      const res = await fetch('/api/admin/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: p.id, status: novo }),
      })
      if (!res.ok) throw new Error()
      setStatusLocal((prev) => ({ ...prev, [p.id]: novo }))
    } catch {
      alert('Não foi possível atualizar o status.')
    }
  }

  const notaDe = (p: Pedido) => notasLocal[p.id] ?? p.notaAdmin
  const nfDe = (p: Pedido) => nfLocal[p.id] ?? p.nfNumero

  // Salva um campo administrativo do pedido (nota, motivo de cancelamento, NF)
  async function salvarCampo(pedidoId: string, patch: Record<string, string>): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: pedidoId, ...patch }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        alert(d?.error || 'Não foi possível salvar. A migração 009 foi rodada no Supabase?')
        return false
      }
      return true
    } catch {
      alert('Erro de rede ao salvar.')
      return false
    }
  }

  async function confirmarCancelamento(p: Pedido, motivo: string) {
    const ok = await salvarCampo(p.id, { status: 'cancelado', cancel_motivo: motivo })
    if (!ok) return
    setStatusLocal((prev) => ({ ...prev, [p.id]: 'cancelado' }))
    setCancelandoPedido(null)
    alert(
      'Venda cancelada.\n\nAtenção: o cancelamento NÃO estorna o pagamento nem devolve o estoque sozinho — ' +
      'faça o estorno no painel do Pagar.me e ajuste o estoque se precisar.'
    )
  }

  // ——— Cálculo de margem (DRE da venda) ———
  function margemDe(p: Pedido) {
    const vendaProdutos = Math.round((p.total - p.freteValor) * 100) / 100
    // Tarifa sobre o total COBRADO (com juros de parcelamento, se cartão >3x)
    const totalCobrado = p.forma_pagamento === 'cartao' && p.parcelas > PARCELAS_SEM_JUROS
      ? Math.round(p.total * (1 + JUROS_AO_MES * p.parcelas) * 100) / 100
      : p.total
    const tarifa = tarifaVenda(p.forma_pagamento, totalCobrado, p.parcelas)
    // Juros repassados ao cliente entram como receita extra da venda
    const jurosRecebidos = Math.round((totalCobrado - p.total) * 100) / 100
    // CMV: precisa do custo cadastrado no catálogo (variation.custo)
    let cmv = 0
    const semCusto: string[] = []
    for (const it of p.itens) {
      if (it.sku === 'JUROS') continue
      // Custo: catálogo do site (se preenchido) > export do GrapeOne > sem custo
      const v = findVariation(it.sku)?.variation
      const custo = (v?.custo && v.custo > 0 ? v.custo : 0) || GRAPEONE[it.sku]?.custo || 0
      if (custo > 0) cmv += custo * it.quantidade
      else semCusto.push(it.sku)
    }
    cmv = Math.round(cmv * 100) / 100
    const margem = Math.round((vendaProdutos + jurosRecebidos - tarifa - p.comissaoValor - cmv) * 100) / 100
    return { vendaProdutos, jurosRecebidos, tarifa, cmv, semCusto, margem }
  }

  function waLink(p: Pedido): string | null {
    const tel = (p.clienteTelefone || '').replace(/\D/g, '')
    if (tel.length < 10) return null
    const num = tel.startsWith('55') ? tel : `55${tel}`
    const msg = `Olá ${p.clienteNome}! Sobre o seu pedido ${codigoPedido(p)} na Grape Tools:`
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
  }

  // Romaneio: janela imprimível com os dados da separação/despacho
  function imprimirRomaneio(p: Pedido) {
    const e = p.enderecoEntrega
    const rastreio = rastreioDe(p)
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Pedido ${codigoPedido(p)} — Grape Tools</title>
<style>body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:24px;max-width:640px}h1{font-size:18px;margin:0 0 2px}h2{font-size:13px;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.04em;color:#555}p{margin:2px 0}table{width:100%;border-collapse:collapse;margin-top:6px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;font-size:12.5px}th{background:#f3f3f3}td.num,th.num{text-align:right}.tot{font-weight:bold}.muted{color:#666}</style></head><body>
<h1>Grape Tools — Romaneio do pedido ${codigoPedido(p)}</h1>
<p class="muted">${dataML(p.data)} · ${p.forma_pagamento} · ${p.entregaTipo === 'retirada' ? 'RETIRADA NA LOJA' : (p.freteServicoNome || 'Entrega')}</p>
<h2>Cliente</h2>
<p><strong>${p.clienteNome}</strong> (cód. ${codigoCliente(p)})</p>
<p>${p.clienteEmail}${p.clienteTelefone ? ' · ' + p.clienteTelefone : ''}</p>
${e?.cep ? `<h2>Endereço de entrega</h2><p>${e.rua || ''}, ${e.numero || ''}${e.complemento ? ' — ' + e.complemento : ''}</p><p>${e.bairro || ''} — ${e.cidade || ''}/${e.estado || ''} · CEP ${e.cep}</p>` : ''}
${rastreio ? `<p><strong>Rastreio:</strong> ${rastreio}</p>` : ''}
<h2>Itens</h2>
<table><thead><tr><th>Item</th><th>SKU</th><th class="num">Qtd</th><th class="num">Unit.</th><th class="num">Subtotal</th></tr></thead><tbody>
${p.itens.map((it) => `<tr><td>${it.descricao}</td><td>${it.sku}</td><td class="num">${it.quantidade}</td><td class="num">${formatCurrency(it.preco_unitario)}</td><td class="num">${formatCurrency(it.preco_unitario * it.quantidade)}</td></tr>`).join('')}
<tr><td colspan="4" class="tot">Total do pedido${p.freteValor > 0 ? ' (com frete)' : ''}</td><td class="num tot">${formatCurrency(p.total)}</td></tr>
</tbody></table>
<script>window.print()</script></body></html>`
    const w = window.open('', '_blank', 'width=720,height=860')
    if (!w) { alert('O navegador bloqueou a janela de impressão. Libere pop-ups para o site.') ; return }
    w.document.write(html)
    w.document.close()
  }

  const chips: { key: Filtro; label: string }[] = [
    { key: 'enviar', label: 'Para enviar' },
    { key: 'pronta', label: 'Etiqueta pronta' },
    { key: 'enviadas', label: 'Enviadas' },
    { key: 'retirada', label: 'Retirada na loja' },
    { key: 'finalizadas', label: 'Finalizadas' },
    { key: 'todas', label: 'Todas' },
  ]

  return (
    <div>
      <div className={styles.chips}>
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`${styles.chip} ${filtro === c.key ? styles.chipOn : ''}`}
            onClick={() => setFiltro(c.key)}
          >
            {c.label} <span className={styles.chipN}>{contagem[c.key]}</span>
          </button>
        ))}
      </div>
      <input
        className={styles.search}
        placeholder="Buscar por cliente, código do pedido, SKU ou produto…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {lista.length === 0 ? (
        <p className={styles.vazio}>
          {filtro === 'enviar' ? 'Nenhuma venda aguardando envio. 🎉' : 'Nada por aqui.'}
        </p>
      ) : (
        <div className={styles.lista}>
          {lista.map((p) => {
            const etiqueta = etiquetaDe(p)
            const rastreio = rastreioDe(p)
            const grupo = grupoDe(p)
            return (
              <div key={p.id} className={styles.card}>
                {/* Cabeçalho: data · código · cliente · conversa */}
                <div className={styles.head}>
                  <span className={styles.headData}>{dataML(p.data)}</span>
                  <span className={styles.headCod}>{codigoPedido(p)}</span>
                  <span className={styles.headTipo}>
                    {p.entregaTipo === 'retirada' ? 'RETIRADA' : (p.freteServicoNome || 'ENTREGA')}
                  </span>
                  <span className={styles.headCliente}>
                    {p.clienteNome} <em>{codigoCliente(p)}</em>
                  </span>
                  {waLink(p) && (
                    <a className={styles.headChat} href={waLink(p) as string} target="_blank" rel="noopener noreferrer">
                      💬 Iniciar conversa
                    </a>
                  )}
                  {/* Menu "⋯" (padrão ML) */}
                  <span className={styles.menuWrap}>
                    <button
                      type="button"
                      className={styles.menuBtn}
                      aria-label="Mais opções"
                      onClick={(e) => { e.stopPropagation(); setMenuAberto(menuAberto === p.id ? null : p.id) }}
                    >
                      ⋮
                    </button>
                    {menuAberto === p.id && (
                      <span className={styles.menu} onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => { setDetalheDe(p); setMenuAberto(null) }}>Detalhes da venda</button>
                        {statusDe(p) !== 'cancelado' && (
                          <button type="button" onClick={() => { setCancelandoPedido(p); setMenuAberto(null) }}>Cancelar pedido</button>
                        )}
                        <button type="button" onClick={() => { setNotaPedido(p); setMenuAberto(null) }}>
                          {notaDe(p) ? 'Editar nota do pedido' : 'Adicionar nota ao pedido'}
                        </button>
                        <button type="button" disabled title="Em desenvolvimento">Emitir NF-e (em breve)</button>
                      </span>
                    )}
                  </span>
                </div>

                {/* Linha de status + ações (padrão ML: aviso à esquerda, botão à direita) */}
                <div className={styles.statusRow}>
                  <div className={styles.statusTexto}>
                    {grupo === 'finalizadas' && <span className={styles.statusOk}>Venda finalizada — entregue.</span>}
                    {grupo === 'enviadas' && (
                      <span className={styles.statusOk}>Enviado{rastreio ? <> — rastreio <strong>{rastreio}</strong></> : ''}.</span>
                    )}
                    {grupo === 'retirada' && (
                      <span className={styles.statusLaranja}>Aguardando retirada — avise o cliente que o pedido está pronto.</span>
                    )}
                    {grupo === 'pronta' && (
                      <span className={styles.statusLaranja}>Etiqueta pronta para impressão. Envie o pacote para não atrasar.</span>
                    )}
                    {grupo === 'enviar' && (
                      <span className={styles.statusLaranja}>
                        {p.temEndereco
                          ? 'Aguardando etiqueta — compre para liberar a impressão.'
                          : 'Pedido sem endereço salvo (antigo) — compre a etiqueta manualmente no Melhor Envio.'}
                      </span>
                    )}
                  </div>
                  <div className={styles.statusAcoes}>
                    {etiqueta && grupo !== 'finalizadas' && (
                      <a className={styles.btnAzul} href={etiqueta} target="_blank" rel="noopener noreferrer">
                        Imprimir etiqueta
                      </a>
                    )}
                    {grupo === 'enviar' && p.temEndereco && (
                      <button
                        type="button"
                        className={styles.btnAzul}
                        disabled={comprando.has(p.id)}
                        onClick={() => comprarEtiqueta(p)}
                      >
                        {comprando.has(p.id) ? 'Comprando…' : 'Comprar etiqueta'}
                      </button>
                    )}
                    {(grupo === 'pronta' || grupo === 'retirada') && (
                      <button type="button" className={styles.btnBranco} onClick={() => marcarEnviado(p)}>
                        {p.entregaTipo === 'retirada' ? 'Marcar como retirado' : 'Marcar como enviado'}
                      </button>
                    )}
                    <button type="button" className={styles.btnBranco} onClick={() => imprimirRomaneio(p)}>
                      Imprimir romaneio
                    </button>
                  </div>
                </div>

                {/* Itens da venda */}
                {p.itens.map((it, i) => (
                  <div key={`${it.sku}-${i}`} className={styles.item}>
                    <div className={styles.itemThumb}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={productImageSrc(it.sku)} alt="" onError={handleProductImageError(it.sku)} />
                    </div>
                    <span className={styles.itemNome}>{it.descricao}</span>
                    <span className={styles.itemPreco}>{formatCurrency(it.preco_unitario)}</span>
                    <span className={styles.itemQtd}>{it.quantidade} unidade{it.quantidade > 1 ? 's' : ''}</span>
                    <span className={styles.itemSku}>SKU: {it.sku}</span>
                  </div>
                ))}

                <div className={styles.rodape}>
                  <span>
                    {p.freteValor > 0
                      ? <>Frete pago pelo cliente: <strong>{formatCurrency(p.freteValor)}</strong></>
                      : p.entregaTipo === 'retirada' ? 'Sem frete (retirada)' : 'Frete grátis'}
                    {notaDe(p) && <span className={styles.rodapeNota}> · 📝 {notaDe(p)}</span>}
                  </span>
                  <span className={styles.rodapeTotal}>Total: <strong>{formatCurrency(p.total)}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {detalheDe && (
        <DetalheModal
          p={detalheDe}
          nf={nfDe(detalheDe)}
          nota={notaDe(detalheDe)}
          margem={margemDe(detalheDe)}
          etiqueta={etiquetaDe(detalheDe)}
          rastreio={rastreioDe(detalheDe)}
          status={statusDe(detalheDe)}
          waHref={waLink(detalheDe)}
          onImprimir={() => imprimirRomaneio(detalheDe)}
          onSalvarNf={async (nf) => {
            const ok = await salvarCampo(detalheDe.id, { nf_numero: nf })
            if (ok) setNfLocal((prev) => ({ ...prev, [detalheDe.id]: nf }))
            return ok
          }}
          onFechar={() => setDetalheDe(null)}
        />
      )}

      {cancelandoPedido && (
        <CancelarModal
          p={cancelandoPedido}
          onConfirmar={(motivo) => confirmarCancelamento(cancelandoPedido, motivo)}
          onFechar={() => setCancelandoPedido(null)}
        />
      )}

      {notaPedido && (
        <NotaModal
          p={notaPedido}
          notaAtual={notaDe(notaPedido)}
          onSalvar={async (texto) => {
            const ok = await salvarCampo(notaPedido.id, { nota_admin: texto })
            if (ok) {
              setNotasLocal((prev) => ({ ...prev, [notaPedido.id]: texto }))
              setNotaPedido(null)
            }
          }}
          onFechar={() => setNotaPedido(null)}
        />
      )}
    </div>
  )
}

// ───────────────────────── Painéis do menu "⋯" ─────────────────────────

type Margem = { vendaProdutos: number; jurosRecebidos: number; tarifa: number; cmv: number; semCusto: string[]; margem: number }

function DetalheModal({ p, nf, nota, margem, etiqueta, rastreio, status, waHref, onImprimir, onSalvarNf, onFechar }: {
  p: Pedido
  nf: string
  nota: string
  margem: Margem
  etiqueta: string
  rastreio: string
  status: string
  waHref: string | null
  onImprimir: () => void
  onSalvarNf: (nf: string) => Promise<boolean>
  onFechar: () => void
}) {
  const [nfDraft, setNfDraft] = useState(nf)
  const [salvandoNf, setSalvandoNf] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const e = p.enderecoEntrega
  // % de cada linha em relação ao preço de venda dos produtos (produtos = 100%)
  const pct = (v: number) =>
    margem.vendaProdutos > 0
      ? `${((v / margem.vendaProdutos) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
      : '—'
  const primeiro = p.itens[0]
  const titulo = primeiro
    ? `${primeiro.descricao}${p.itens.length > 1 ? ` +${p.itens.length - 1} item(ns)` : ''}`
    : `Venda ${codigoPedido(p)}`
  const iniciais = p.clienteNome.split(/\s+/).slice(0, 2).map((s) => s[0] || '').join('').toUpperCase()

  // Situação do envio, no tom do ML
  const envio = (() => {
    if (status === 'cancelado') return { titulo: 'Venda cancelada', desc: p.cancelMotivo || 'Cancelada pelo admin.', tom: 'ruim' as const }
    if (status === 'entregue') return { titulo: 'Entregue', desc: 'Venda finalizada.', tom: 'bom' as const }
    if (status === 'enviado') return { titulo: 'Enviado', desc: rastreio ? `Rastreio ${rastreio}.` : 'A caminho do cliente.', tom: 'bom' as const }
    if (p.entregaTipo === 'retirada') return { titulo: 'Aguardando retirada', desc: 'Avise o cliente que o pedido está pronto no balcão.', tom: 'atencao' as const }
    if (etiqueta) return { titulo: 'Etiqueta pronta para impressão', desc: 'Imprima, cole no pacote e despache.', tom: 'atencao' as const }
    return { titulo: 'Etiqueta pendente', desc: 'Compre a etiqueta na lista de vendas para liberar a impressão.', tom: 'atencao' as const }
  })()

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={`${styles.modal} ${styles.modalLarga}`} onClick={(ev) => ev.stopPropagation()}>
        {/* Cabeçalho: trilha + título grande + ações */}
        <div className={styles.detTopo}>
          <div>
            <span className={styles.detTrilha}>Vendas › Detalhe da venda</span>
            <h3 className={styles.detTitulo}>{titulo}</h3>
            <span className={styles.detSub}>
              Venda <strong>{codigoPedido(p)}</strong> · {dataML(p.data)} · {p.forma_pagamento}
            </span>
          </div>
          <div className={styles.detTopoAcoes}>
            <button type="button" className={styles.detImprimir} onClick={onImprimir}>Imprimir dados</button>
            <button type="button" className={styles.modalFechar} onClick={onFechar} aria-label="Fechar">✕</button>
          </div>
        </div>

        <div className={styles.detCols}>
          {/* ─── Coluna principal ─── */}
          <div className={styles.detMain}>
            {/* Cliente */}
            <div className={styles.detCard}>
              <div className={styles.cliRow}>
                <span className={styles.cliAvatar}>{iniciais || '?'}</span>
                <span className={styles.cliInfo}>
                  <strong>{p.clienteNome}</strong>
                  <em>{codigoCliente(p)}{p.clienteEmail !== '—' ? ` · ${p.clienteEmail}` : ''}{p.clienteTelefone ? ` · ${p.clienteTelefone}` : ''}</em>
                </span>
                {waHref && (
                  <a className={styles.cliChat} href={waHref} target="_blank" rel="noopener noreferrer">Iniciar conversa</a>
                )}
              </div>
            </div>

            {/* Situação do envio + itens */}
            <div className={styles.detCard}>
              <p className={`${styles.envioTitulo} ${envio.tom === 'bom' ? styles.envioBom : envio.tom === 'ruim' ? styles.envioRuim : styles.envioAtencao}`}>
                {envio.titulo}
              </p>
              <p className={styles.envioDesc}>{envio.desc}</p>
              {etiqueta && status !== 'entregue' && status !== 'cancelado' && (
                <a className={styles.btnAzul} href={etiqueta} target="_blank" rel="noopener noreferrer" style={{ marginBottom: 10 }}>
                  Imprimir etiqueta
                </a>
              )}
              {p.itens.map((it, i) => (
                <div key={`${it.sku}-${i}`} className={styles.detItem}>
                  <span className={styles.itemThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={productImageSrc(it.sku)} alt="" onError={handleProductImageError(it.sku)} />
                  </span>
                  <span className={styles.detItemNome}>{it.descricao}</span>
                  <span className={styles.detItemMeta}>{formatCurrency(it.preco_unitario)}</span>
                  <span className={styles.detItemMeta}>{it.quantidade} un.</span>
                  <span className={styles.detItemSku}>SKU {it.sku}</span>
                </div>
              ))}
            </div>

            {/* Dados do envio */}
            <div className={styles.detCard}>
              <h4 className={styles.detCardTitulo}>Dados do envio</h4>
              {p.entregaTipo === 'retirada' ? (
                <p className={styles.detTexto}>Retirada na loja — sem frete.</p>
              ) : (
                <p className={styles.detTexto}>
                  {p.freteServicoNome || 'Envio ao endereço'} · frete {p.freteValor > 0 ? formatCurrency(p.freteValor) : 'grátis'}
                  {rastreio && <> · rastreio <strong>{rastreio}</strong></>}
                  {e?.cep && (
                    <>
                      <br />{e.rua}, {e.numero}{e.complemento ? ` — ${e.complemento}` : ''}
                      <br />{e.bairro} · {e.cidade}/{e.estado} · CEP {e.cep}
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Nota fiscal */}
            <div className={styles.detCard}>
              <h4 className={styles.detCardTitulo}>Nota fiscal</h4>
              <p className={styles.detTexto}>
                {p.clienteNome} · {p.clienteEmail}
                <br /><span className={styles.modalMuted}>CPF/CNPJ do pagamento no Pagar.me ({p.pagarme_order_id || '—'}).</span>
              </p>
              <div className={styles.nfRow}>
                <label>Nº da NF-e {nf ? '(emitida)' : ''}</label>
                <input value={nfDraft} onChange={(ev) => setNfDraft(ev.target.value)} placeholder="Ex.: 000.000.123" />
                <button
                  type="button"
                  disabled={salvandoNf || nfDraft === nf}
                  onClick={async () => { setSalvandoNf(true); await onSalvarNf(nfDraft.trim()); setSalvandoNf(false) }}
                >
                  {salvandoNf ? '…' : 'Salvar'}
                </button>
              </div>
            </div>

            {/* Observações */}
            {(p.observacao || nota) && (
              <div className={styles.detCard}>
                <h4 className={styles.detCardTitulo}>Observações</h4>
                {p.observacao && <p className={styles.detTexto}><span className={styles.modalMuted}>Do pedido:</span> {p.observacao}</p>}
                {nota && <p className={styles.detTexto}><span className={styles.modalMuted}>Sua nota:</span> {nota}</p>}
              </div>
            )}
          </div>

          {/* ─── Resumo financeiro (coluna direita, estilo ML) ─── */}
          <div className={styles.detLado}>
            <div className={styles.detCard}>
              <p className={status === 'cancelado' ? styles.pagRuim : styles.pagOk}>
                {status === 'cancelado' ? 'Venda cancelada' : 'Pagamento aprovado'}
              </p>
              <p className={styles.detSub}>{codigoPedido(p)} · {dataML(p.data)}</p>

              <div className={styles.finLinhas}>
                <span className={styles.finLinha}>
                  <em>Preço dos produtos{p.cupomCodigo ? ` (cupom ${p.cupomCodigo} · ${p.cupomPercent}% já aplicado)` : ''}</em>
                  <strong>{formatCurrency(margem.vendaProdutos)} <i className={styles.finPct}>100%</i></strong>
                </span>
                {p.freteValor > 0 && (
                  <span className={styles.finLinha}>
                    <em>Frete pago pelo cliente</em>
                    <strong>{formatCurrency(p.freteValor)} <i className={styles.finPct}>{pct(p.freteValor)}</i></strong>
                  </span>
                )}
                {margem.jurosRecebidos > 0 && (
                  <span className={styles.finLinha}>
                    <em>Juros do parcelamento</em>
                    <strong>{formatCurrency(margem.jurosRecebidos)} <i className={styles.finPct}>{pct(margem.jurosRecebidos)}</i></strong>
                  </span>
                )}
                <span className={styles.finLinha}>
                  <em>Tarifa de venda ({tarifaDescricao(p.forma_pagamento, p.parcelas)})</em>
                  <strong className={styles.finNeg}>− {formatCurrency(margem.tarifa)} <i className={styles.finPct}>{pct(margem.tarifa)}</i></strong>
                </span>
                {p.comissaoValor > 0 && (
                  <span className={styles.finLinha}>
                    <em>Comissão{p.vendedor ? ` (${p.vendedor})` : ''}</em>
                    <strong className={styles.finNeg}>− {formatCurrency(p.comissaoValor)} <i className={styles.finPct}>{pct(p.comissaoValor)}</i></strong>
                  </span>
                )}
                {p.freteValor > 0 && (
                  <span className={styles.finLinha}>
                    <em>Etiqueta (custo estimado = frete cobrado)</em>
                    <strong className={styles.finNeg}>− {formatCurrency(p.freteValor)} <i className={styles.finPct}>{pct(p.freteValor)}</i></strong>
                  </span>
                )}
                <span className={styles.finLinha}>
                  <em>CMV (custo da mercadoria)</em>
                  <strong className={styles.finNeg}>− {formatCurrency(margem.cmv)} <i className={styles.finPct}>{pct(margem.cmv)}</i></strong>
                </span>
                {margem.semCusto.length > 0 && (
                  <span className={styles.finAviso}>⚠ Sem custo cadastrado: {margem.semCusto.join(', ')}</span>
                )}
              </div>

              <div className={styles.finTotal}>
                <span>Resultado{margem.semCusto.length > 0 ? ' (parcial)' : ''}</span>
                <strong>{formatCurrency(margem.margem)} <i className={styles.finPctTotal}>{pct(margem.margem)}</i></strong>
              </div>
              <p className={styles.modalMuted} style={{ marginTop: 8 }}>
                A etiqueta é debitada da carteira do Melhor Envio — o custo real pode variar um pouco do frete cobrado.
              </p>
            </div>

            {/* Conciliação: abre a venda no Pagar.me (e copia o código, porque o
                painel deles às vezes perde o link direto após o login) */}
            {p.pagarme_order_id && (
              <a
                className={styles.detFaturamento}
                href={`https://dash.pagar.me/#/orders/${p.pagarme_order_id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try { navigator.clipboard?.writeText(p.pagarme_order_id as string); setCopiado(true) } catch {}
                }}
              >
                <span className={styles.detFaturamentoIco} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/pagarme-stone.png" alt="" />
                </span>
                <span className={styles.detFaturamentoTexto}>
                  <strong>Conferir faturamento no Pagar.me</strong>
                  <em>{copiado ? `Código ${p.pagarme_order_id} copiado — cole na busca se o painel não abrir direto.` : 'Abre esta venda no Pagar.me para conciliar os valores.'}</em>
                </span>
                <span className={styles.detFaturamentoSeta} aria-hidden="true">›</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CancelarModal({ p, onConfirmar, onFechar }: {
  p: Pedido
  onConfirmar: (motivo: string) => void
  onFechar: () => void
}) {
  const [motivo, setMotivo] = useState('')
  const [outro, setOutro] = useState('')
  const motivoFinal = motivo === 'Outros problemas' && outro.trim() ? `Outros: ${outro.trim()}` : motivo
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(ev) => ev.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3>Cancelar venda {codigoPedido(p)}</h3>
          <button type="button" className={styles.modalFechar} onClick={onFechar} aria-label="Fechar">✕</button>
        </div>
        <p className={styles.modalTexto}>Qual o motivo do cancelamento?</p>
        <div className={styles.motivos}>
          {MOTIVOS_CANCELAMENTO.map((m) => (
            <label key={m} className={styles.motivo}>
              <input type="radio" name="motivo" checked={motivo === m} onChange={() => setMotivo(m)} />
              {m}
            </label>
          ))}
          {motivo === 'Outros problemas' && (
            <textarea
              className={styles.motivoOutro}
              rows={2}
              placeholder="Descreva o motivo…"
              value={outro}
              onChange={(ev) => setOutro(ev.target.value)}
            />
          )}
        </div>
        <p className={styles.modalAviso}>
          ⚠ Cancelar aqui só muda o status do pedido. O estorno do pagamento é feito no painel do Pagar.me,
          e o estoque não é devolvido automaticamente.
        </p>
        <div className={styles.modalAcoes}>
          <button type="button" className={styles.btnCinza} onClick={onFechar}>Voltar</button>
          <button
            type="button"
            className={styles.btnVermelho}
            disabled={!motivo}
            onClick={() => onConfirmar(motivoFinal)}
          >
            Cancelar venda
          </button>
        </div>
      </div>
    </div>
  )
}

function NotaModal({ p, notaAtual, onSalvar, onFechar }: {
  p: Pedido
  notaAtual: string
  onSalvar: (texto: string) => Promise<void>
  onFechar: () => void
}) {
  const [texto, setTexto] = useState(notaAtual)
  const [salvando, setSalvando] = useState(false)
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(ev) => ev.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3>Nota do pedido {codigoPedido(p)}</h3>
          <button type="button" className={styles.modalFechar} onClick={onFechar} aria-label="Fechar">✕</button>
        </div>
        <p className={styles.modalMuted}>Anotação interna — o cliente não vê.</p>
        <textarea
          className={styles.notaArea}
          rows={5}
          placeholder="Ex.: cliente pediu pra despachar só na segunda; embalar com reforço…"
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
        />
        <div className={styles.modalAcoes}>
          <button type="button" className={styles.btnCinza} onClick={onFechar}>Voltar</button>
          <button
            type="button"
            className={styles.btnAzul}
            disabled={salvando || texto === notaAtual}
            onClick={async () => { setSalvando(true); await onSalvar(texto.trim()); setSalvando(false) }}
          >
            {salvando ? 'Salvando…' : 'Salvar nota'}
          </button>
        </div>
      </div>
    </div>
  )
}
