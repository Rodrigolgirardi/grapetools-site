'use client'

import "./checkout.css"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { products } from '@/lib/data'
import { formatCurrency, getTierForQuantity } from '@/lib/pricing'
import { BackToSite } from '@/components/BackToSite'

interface Endereco {
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
}

function formatCEP(v: string) {
  return v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9)
}

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const { cart, clearCart } = useCart()
  const router = useRouter()

  const [step, setStep] = useState<'resumo' | 'entrega' | 'pagamento' | 'confirmado'>('resumo')
  const [endereco, setEndereco] = useState<Endereco>({})
  const [cepLoading, setCepLoading] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'boleto' | 'transferencia'>('pix')
  const [obs, setObs] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pedidoId, setPedidoId] = useState<string | null>(null)
  const [nomeContato, setNomeContato] = useState('')
  const [telefoneContato, setTelefoneContato] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  const [pagamentoResult, setPagamentoResult] = useState<{
    tipo: string
    qr_code?: string
    qr_code_url?: string
    boleto_url?: string
    boleto_barcode?: string
    due_at?: string
    mensagem?: string
  } | null>(null)

  // Linhas do carrinho
  const lines = products.flatMap(p =>
    p.variations
      .filter(v => cart[v.sku])
      .map(v => {
        const quantity = cart[v.sku]
        const tier = getTierForQuantity(v.tiers, quantity)
        return { product: p, variation: v, quantity, tier, total: tier.price * quantity }
      })
  )
  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0)

  // Redireciona se não logado ou carrinho vazio
  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/login?redirect=/checkout'); return }
    if (!loading && lines.length === 0 && step !== 'confirmado') { router.push('/'); return }
  }, [user, loading, lines.length])

  // Carrega perfil do usuário
  useEffect(() => {
    if (!user) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
      if (data) {
        if (data.endereco) setEndereco(data.endereco)
        if (data.nome) setNomeContato(data.nome.split(' ')[0] || data.nome)
        if (data.telefone) setTelefoneContato(data.telefone)
      } else {
        const name = user!.user_metadata?.full_name || user!.user_metadata?.nome || ''
        setNomeContato(name.split(' ')[0] || name)
      }
    }
    load()
  }, [user])

  async function buscarCEP(cep: string) {
    const raw = cep.replace(/\D/g, '')
    if (raw.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setEndereco(e => ({ ...e, rua: data.logradouro || '', bairro: data.bairro || '', cidade: data.localidade || '', estado: data.uf || '' }))
      }
    } catch {}
    setCepLoading(false)
  }

  function enderecoCompleto() {
    return endereco.rua && endereco.numero && endereco.cidade && endereco.estado && endereco.cep
  }

  async function finalizarPedido() {
    if (!user) return
    setSubmitting(true)
    const supabase = createClient()

    // 1. Cria pedido no Supabase
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        user_id: user.id,
        status: 'pendente',
        total: subtotal,
        forma_pagamento: formaPagamento,
        observacao: obs || null,
      })
      .select('id')
      .single()

    if (pedidoError || !pedido) {
      alert('Erro ao criar pedido. Tente novamente.')
      setSubmitting(false)
      return
    }

    // 2. Cria itens do pedido
    const itens = lines.map(l => ({
      pedido_id: pedido.id,
      sku: l.variation.sku,
      descricao: `${l.product.name} — ${l.variation.label}`,
      quantidade: l.quantity,
      preco_unitario: l.tier.price,
    }))
    await supabase.from('pedido_itens').insert(itens)

    // 3. Salva endereço no perfil
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      endereco,
      updated_at: new Date().toISOString(),
    })

    // 4. Chama Pagar.me (se Pix ou Boleto)
    if (formaPagamento !== 'transferencia') {
      const profile = await supabase.from('profiles').select('cnpj').eq('id', user.id).single()
      const documento = profile.data?.cnpj || ''

      const pagarmeRes = await fetch('/api/pagarme/criar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedido.id,
          total: subtotal,
          forma_pagamento: formaPagamento,
          itens: itens.map(i => ({
            sku: i.sku,
            descricao: i.descricao,
            quantidade: i.quantidade,
            preco_unitario: lines.find(l => l.variation.sku === i.sku)?.tier.price || 0,
          })),
          cliente: {
            nome: nomeContato || user.user_metadata?.full_name || user.email || 'Cliente',
            email: user.email || '',
            documento,
            telefone: telefoneContato,
          },
          endereco,
        }),
      })

      const pagarmeData = await pagarmeRes.json()

      if (pagarmeData.error) {
        alert(pagarmeData.error)
        setSubmitting(false)
        return
      }

      setPagamentoResult(pagarmeData)
    } else {
      setPagamentoResult({ tipo: 'transferencia', mensagem: 'Aguarde os dados de transferência por WhatsApp.' })
    }

    // 5. Limpa carrinho e vai para confirmado
    clearCart()
    setPedidoId(pedido.id)
    setStep('confirmado')
    setSubmitting(false)
  }

  // Evita hydration mismatch — só renderiza após montar no cliente
  if (!mounted || loading) {
    return (
      <>
        <BackToSite />
        <main className="checkoutPage">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
            <div className="clienteLoadingSpinner" />
          </div>
        </main>
      </>
    )
  }

  // ─── STEP: CONFIRMADO ────────────────────────────────
  if (step === 'confirmado') {
    return (
      <>
        <BackToSite />
        <main className="checkoutPage">
          <div className="checkoutConfirmado">
            <div className="checkoutConfirmadoIcon">✓</div>
            <h1>Pedido recebido!</h1>
            {pedidoId && <p className="checkoutPedidoId">Pedido <strong>#{pedidoId.slice(0, 8).toUpperCase()}</strong></p>}

            {/* PIX */}
            {pagamentoResult?.tipo === 'pix' && pagamentoResult.qr_code && (
              <div className="checkoutPix">
                <p className="checkoutPixTitle">⚡ Pague com Pix</p>
                <p className="checkoutPixDesc">Escaneie o QR Code ou copie o código abaixo</p>
                {pagamentoResult.qr_code_url && (
                  <img src={pagamentoResult.qr_code_url} alt="QR Code Pix" className="checkoutPixQR" />
                )}
                <div className="checkoutPixCode">
                  <input readOnly value={pagamentoResult.qr_code} className="checkoutPixInput" />
                  <button
                    className="checkoutPixCopy"
                    onClick={() => navigator.clipboard.writeText(pagamentoResult.qr_code!)}
                  >
                    Copiar
                  </button>
                </div>
                <p className="checkoutPixObs">O pagamento expira em 1 hora</p>
              </div>
            )}

            {/* BOLETO */}
            {pagamentoResult?.tipo === 'boleto' && (
              <div className="checkoutBoleto">
                <p className="checkoutPixTitle">📄 Boleto bancário</p>
                {pagamentoResult.boleto_barcode && (
                  <div className="checkoutPixCode">
                    <input readOnly value={pagamentoResult.boleto_barcode} className="checkoutPixInput" />
                    <button
                      className="checkoutPixCopy"
                      onClick={() => navigator.clipboard.writeText(pagamentoResult.boleto_barcode!)}
                    >
                      Copiar
                    </button>
                  </div>
                )}
                {pagamentoResult.boleto_url && (
                  <a href={pagamentoResult.boleto_url} target="_blank" rel="noopener noreferrer" className="checkoutBtnPrimary" style={{marginTop: 12, display: 'inline-flex'}}>
                    Abrir boleto PDF
                  </a>
                )}
              </div>
            )}

            {/* TRANSFERÊNCIA */}
            {pagamentoResult?.tipo === 'transferencia' && (
              <p style={{color: '#6b7280', fontSize: '0.9375rem'}}>Entraremos em contato em breve com os dados para transferência.</p>
            )}

            <div className="checkoutConfirmadoAcoes" style={{marginTop: 24}}>
              <a href="/pedidos" className="checkoutBtnPrimary">Ver meus pedidos</a>
              <a href="/" className="checkoutBtnSecondary">Continuar comprando</a>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <BackToSite />
      <main className="checkoutPage">
        <div className="checkoutLayout">

          {/* ─── COLUNA ESQUERDA ─── */}
          <div className="checkoutMain">

            {/* Steps */}
            <div className="checkoutSteps">
              {(['resumo', 'entrega', 'pagamento'] as const).map((s, i) => (
                <div key={s} className={`checkoutStep ${step === s ? 'active' : ''} ${['resumo','entrega','pagamento'].indexOf(step) > i ? 'done' : ''}`}>
                  <span className="checkoutStepNum">{['resumo','entrega','pagamento'].indexOf(step) > i ? '✓' : i + 1}</span>
                  <span>{s === 'resumo' ? 'Resumo' : s === 'entrega' ? 'Entrega' : 'Pagamento'}</span>
                </div>
              ))}
            </div>

            {/* ─── STEP 1: RESUMO ─── */}
            {step === 'resumo' && (
              <div className="checkoutSection">
                <h2 className="checkoutSectionTitle">Itens do pedido</h2>
                <div className="checkoutItems">
                  {lines.map(({ product, variation, quantity, tier, total }) => (
                    <div key={variation.sku} className="checkoutItem">
                      <div className="checkoutItemImg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/products/${variation.sku.replace(/\./g, '-')}.png`}
                          alt={product.name}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                      <div className="checkoutItemInfo">
                        <p className="checkoutItemName">{product.name}</p>
                        {variation.label !== product.name && (
                          <p className="checkoutItemVar">{variation.label}</p>
                        )}
                        <p className="checkoutItemSku">{variation.sku}</p>
                      </div>
                      <div className="checkoutItemRight">
                        <p className="checkoutItemQty">{quantity} un.</p>
                        <p className="checkoutItemPrice">{formatCurrency(tier.price)}/un.</p>
                        <p className="checkoutItemTotal">{formatCurrency(total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="checkoutBtnPrimary checkoutBtnFull" onClick={() => setStep('entrega')}>
                  Continuar para entrega →
                </button>
              </div>
            )}

            {/* ─── STEP 2: ENTREGA ─── */}
            {step === 'entrega' && (
              <div className="checkoutSection">
                <h2 className="checkoutSectionTitle">Endereço de entrega</h2>

                <div className="checkoutGrid">
                  <div className="checkoutField">
                    <label>Nome para contato</label>
                    <input type="text" value={nomeContato} onChange={e => setNomeContato(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div className="checkoutField">
                    <label>Telefone / WhatsApp</label>
                    <input type="tel" value={telefoneContato} onChange={e => setTelefoneContato(e.target.value)} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="checkoutField">
                    <label>CEP</label>
                    <div className="checkoutCepWrap">
                      <input
                        type="text"
                        value={endereco.cep || ''}
                        onChange={e => setEndereco(v => ({ ...v, cep: formatCEP(e.target.value) }))}
                        onBlur={e => buscarCEP(e.target.value)}
                        placeholder="00000-000"
                      />
                      {cepLoading && <span className="checkoutCepSpinner" />}
                    </div>
                  </div>
                  <div className="checkoutField">
                    <label>Número</label>
                    <input type="text" value={endereco.numero || ''} onChange={e => setEndereco(v => ({ ...v, numero: e.target.value }))} placeholder="123" />
                  </div>
                  <div className="checkoutField checkoutFieldFull">
                    <label>Rua / Avenida</label>
                    <input type="text" value={endereco.rua || ''} onChange={e => setEndereco(v => ({ ...v, rua: e.target.value }))} placeholder="Nome da rua" />
                  </div>
                  <div className="checkoutField">
                    <label>Complemento <span className="checkoutOptional">opcional</span></label>
                    <input type="text" value={endereco.complemento || ''} onChange={e => setEndereco(v => ({ ...v, complemento: e.target.value }))} placeholder="Apto, sala…" />
                  </div>
                  <div className="checkoutField">
                    <label>Bairro</label>
                    <input type="text" value={endereco.bairro || ''} onChange={e => setEndereco(v => ({ ...v, bairro: e.target.value }))} placeholder="Bairro" />
                  </div>
                  <div className="checkoutField">
                    <label>Cidade</label>
                    <input type="text" value={endereco.cidade || ''} onChange={e => setEndereco(v => ({ ...v, cidade: e.target.value }))} placeholder="Cidade" />
                  </div>
                  <div className="checkoutField">
                    <label>Estado</label>
                    <select value={endereco.estado || ''} onChange={e => setEndereco(v => ({ ...v, estado: e.target.value }))}>
                      <option value="">Selecione</option>
                      {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>

                <div className="checkoutFieldFull">
                  <label className="checkoutLabel">Observações <span className="checkoutOptional">opcional</span></label>
                  <textarea
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                    placeholder="Instruções especiais, horário de entrega, referência…"
                    rows={3}
                    className="checkoutTextarea"
                  />
                </div>

                <div className="checkoutBtnRow">
                  <button className="checkoutBtnSecondary" onClick={() => setStep('resumo')}>← Voltar</button>
                  <button
                    className="checkoutBtnPrimary"
                    onClick={() => setStep('pagamento')}
                    disabled={!enderecoCompleto()}
                  >
                    Continuar para pagamento →
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 3: PAGAMENTO ─── */}
            {step === 'pagamento' && (
              <div className="checkoutSection">
                <h2 className="checkoutSectionTitle">Forma de pagamento</h2>

                <div className="checkoutPayOptions">
                  {([
                    { id: 'pix', label: 'Pix', desc: 'Aprovação imediata · Chave CNPJ', icon: '⚡' },
                    { id: 'boleto', label: 'Boleto bancário', desc: 'Prazo de 1–3 dias úteis', icon: '📄' },
                    { id: 'transferencia', label: 'Transferência / TED', desc: 'Dados enviados por WhatsApp', icon: '🏦' },
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      className={`checkoutPayOption ${formaPagamento === opt.id ? 'active' : ''}`}
                      onClick={() => setFormaPagamento(opt.id)}
                    >
                      <span className="checkoutPayIcon">{opt.icon}</span>
                      <div>
                        <strong>{opt.label}</strong>
                        <span>{opt.desc}</span>
                      </div>
                      <span className="checkoutPayCheck">{formaPagamento === opt.id ? '●' : '○'}</span>
                    </button>
                  ))}
                </div>

                {formaPagamento === 'pix' && (
                  <div className="checkoutPixInfo">
                    <p>Após confirmar o pedido, a chave Pix será enviada para o seu WhatsApp ou e-mail.</p>
                  </div>
                )}

                <div className="checkoutBtnRow">
                  <button className="checkoutBtnSecondary" onClick={() => setStep('entrega')}>← Voltar</button>
                  <button
                    className="checkoutBtnPrimary checkoutBtnFinalizar"
                    onClick={finalizarPedido}
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando pedido…' : `Finalizar pedido · ${formatCurrency(subtotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── COLUNA DIREITA: RESUMO FIXO ─── */}
          <aside className="checkoutSidebar">
            <div className="checkoutSidebarCard">
              <h3 className="checkoutSidebarTitle">Resumo</h3>
              <div className="checkoutSidebarLines">
                {lines.map(({ product, variation, quantity, total }) => (
                  <div key={variation.sku} className="checkoutSidebarLine">
                    <span>{product.name} <em>×{quantity}</em></span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                ))}
              </div>
              <div className="checkoutSidebarDivider" />
              <div className="checkoutSidebarTotal">
                <span>{totalQty} itens</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="checkoutSidebarFrete">
                <span>Frete</span>
                <span className="checkoutSidebarFreteVal">A combinar</span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </>
  )
}
