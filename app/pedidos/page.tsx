'use client'

import "./pedidos.css"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/pricing'
import { BackToSite } from '@/components/BackToSite'

interface PedidoItem {
  id: string
  sku: string
  descricao: string
  quantidade: number
  preco_unitario: number
}

interface Pedido {
  id: string
  status: string
  total: number
  forma_pagamento: string | null
  observacao: string | null
  created_at: string
  itens?: PedidoItem[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendente:     { label: 'Aguardando confirmação', color: '#b45309', bg: '#fef3c7' },
  confirmado:   { label: 'Confirmado',             color: '#1d4ed8', bg: '#dbeafe' },
  em_separacao: { label: 'Em separação',           color: '#6d28d9', bg: '#ede9fe' },
  enviado:      { label: 'Enviado',                color: '#0369a1', bg: '#e0f2fe' },
  entregue:     { label: 'Entregue',               color: '#15803d', bg: '#dcfce7' },
  cancelado:    { label: 'Cancelado',              color: '#dc2626', bg: '#fee2e2' },
}

const PAGAMENTO_LABEL: Record<string, string> = {
  pix: '⚡ Pix',
  boleto: '📄 Boleto',
  transferencia: '🏦 Transferência',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function PedidosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidosLoading, setPedidosLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [itensCache, setItensCache] = useState<Record<string, PedidoItem[]>>({})

  useEffect(() => {
    if (!loading && !user) { router.push('/login?redirect=/pedidos'); return }
    if (user) loadPedidos(user.id)
  }, [user, loading])

  async function loadPedidos(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) setPedidos(data)
    setPedidosLoading(false)
  }

  async function loadItens(pedidoId: string) {
    if (itensCache[pedidoId]) return
    const supabase = createClient()
    const { data } = await supabase
      .from('pedido_itens')
      .select('*')
      .eq('pedido_id', pedidoId)

    if (data) setItensCache(c => ({ ...c, [pedidoId]: data }))
  }

  function toggleExpand(pedidoId: string) {
    if (expandedId === pedidoId) {
      setExpandedId(null)
    } else {
      setExpandedId(pedidoId)
      loadItens(pedidoId)
    }
  }

  if (loading || pedidosLoading) {
    return (
      <>
        <BackToSite />
        <main className="pedidosPage">
          <div className="clienteLoading">
            <div className="clienteLoadingSpinner" />
            <p>Carregando pedidos…</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <BackToSite />
      <main className="pedidosPage">
        <div className="pedidosContainer">

          <div className="pedidosHeader">
            <div>
              <h1 className="pedidosTitle">Meus pedidos</h1>
              <p className="pedidosSubtitle">
                {pedidos.length === 0
                  ? 'Nenhum pedido ainda'
                  : `${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'}`}
              </p>
            </div>
            <a href="/cliente" className="pedidosBackBtn">← Minha conta</a>
          </div>

          {pedidos.length === 0 ? (
            <div className="pedidosEmpty">
              <div className="pedidosEmptyIcon">📦</div>
              <h2>Nenhum pedido ainda</h2>
              <p>Seus pedidos aparecerão aqui após a compra</p>
              <a href="/" className="checkoutBtnPrimary">Ver produtos</a>
            </div>
          ) : (
            <div className="pedidosList">
              {pedidos.map(pedido => {
                const status = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pendente
                const isExpanded = expandedId === pedido.id
                const itens = itensCache[pedido.id] || []

                return (
                  <div key={pedido.id} className="pedidoCard">
                    {/* Cabeçalho do pedido */}
                    <div className="pedidoCardHead" onClick={() => toggleExpand(pedido.id)}>
                      <div className="pedidoCardInfo">
                        <div className="pedidoCardTop">
                          <span className="pedidoNum">#{pedido.id.slice(0, 8).toUpperCase()}</span>
                          <span
                            className="pedidoStatus"
                            style={{ color: status.color, background: status.bg }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="pedidoCardMeta">
                          <span>{formatDate(pedido.created_at)}</span>
                          {pedido.forma_pagamento && (
                            <span>{PAGAMENTO_LABEL[pedido.forma_pagamento] || pedido.forma_pagamento}</span>
                          )}
                        </div>
                      </div>
                      <div className="pedidoCardRight">
                        <strong className="pedidoTotal">{formatCurrency(pedido.total)}</strong>
                        <span className="pedidoExpandBtn">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Itens do pedido (expandido) */}
                    {isExpanded && (
                      <div className="pedidoCardBody">
                        {itens.length === 0 ? (
                          <div className="pedidoItensLoading">Carregando itens…</div>
                        ) : (
                          <>
                            <div className="pedidoItens">
                              {itens.map(item => (
                                <div key={item.id} className="pedidoItem">
                                  <div className="pedidoItemInfo">
                                    <p className="pedidoItemDesc">{item.descricao}</p>
                                    <p className="pedidoItemSku">{item.sku}</p>
                                  </div>
                                  <div className="pedidoItemRight">
                                    <span className="pedidoItemQty">{item.quantidade} un.</span>
                                    <span className="pedidoItemPrice">{formatCurrency(item.preco_unitario)}/un.</span>
                                    <strong className="pedidoItemTotal">
                                      {formatCurrency(item.quantidade * item.preco_unitario)}
                                    </strong>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {pedido.observacao && (
                              <div className="pedidoObs">
                                <strong>Observação:</strong> {pedido.observacao}
                              </div>
                            )}

                            <div className="pedidoCardFooter">
                              <span>Total do pedido</span>
                              <strong>{formatCurrency(pedido.total)}</strong>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
