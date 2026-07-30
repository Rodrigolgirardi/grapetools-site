'use client'

import "./checkout.css"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { productImageSrc, handleProductImageError } from '@/lib/product-image'
import { documentoValido, formatarDocumento } from '@/lib/documento'
import { formatCurrency, getCartLines, descontoCarrinhoPercent, parcelasMaximas, PARCELAS_MAX, PARCELAS_SEM_JUROS, PARCELA_VALOR_MIN, JUROS_AO_MES } from '@/lib/pricing'
import { trackBeginCheckout, trackPurchase, type GaItem } from '@/lib/analytics'
import { metaBeginCheckout, metaPurchase } from '@/lib/meta-pixel'
import { BackToSite } from '@/components/BackToSite'

type FreteOpcao = {
  id: number
  nome: string
  transportadora: string
  preco: number
  prazo: number
}

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

function maskCartaoNumero(v: string) {
  return v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function maskValidade(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

// Endereço da loja para retirada (ajuste se necessário)
const LOJA = {
  rua: 'Rua Professor Guilherme Belfort Sabino',
  numero: '348',
  bairro: 'Campininha',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '04678-002',
}

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const { cart, clearCart, updateQuantity } = useCart()
  const router = useRouter()

  const [step, setStep] = useState<'resumo' | 'entrega' | 'pagamento' | 'confirmado'>('resumo')
  const [entregaTipo, setEntregaTipo] = useState<'entrega' | 'retirada'>('entrega')
  const [endereco, setEndereco] = useState<Endereco>({})
  const [cepLoading, setCepLoading] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao' | 'boleto'>('pix')
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' })
  const [parcelas, setParcelas] = useState(1)
  const [obs, setObs] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pedidoId, setPedidoId] = useState<string | null>(null)
  const [nomeContato, setNomeContato] = useState('')
  const [telefoneContato, setTelefoneContato] = useState('')
  const [documento, setDocumento] = useState('')
  const [mostrarErros, setMostrarErros] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Cupom de desconto
  const [cupomInput, setCupomInput] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState<{ codigo: string; desconto_percent: number } | null>(null)
  const [cupomErro, setCupomErro] = useState<string | null>(null)
  const [cupomLoading, setCupomLoading] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  const [pagamentoResult, setPagamentoResult] = useState<{
    tipo: string
    qr_code?: string
    qr_code_url?: string
    boleto_url?: string
    boleto_barcode?: string
    due_at?: string
    mensagem?: string
    status?: string
    parcelas?: number
  } | null>(null)

  // Linhas do carrinho
  const lines = getCartLines(cart)
  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0)
  // Desconto por valor total do carrinho (2% a 5%), aplicado no preço unitário
  const descPercent = descontoCarrinhoPercent(subtotal)
  // Cupom SOMA com o desconto por valor do carrinho (teto 90%) — igual ao servidor.
  const cupomPercent = cupomAplicado?.desconto_percent || 0
  const descTotalPercent = Math.min(90, descPercent + cupomPercent)
  const precoComDesc = (preco: number) => Math.round(preco * (100 - descTotalPercent)) / 100
  const totalComDesc = lines.reduce((s, l) => s + precoComDesc(l.tier.price) * l.quantity, 0)
  const descValor = subtotal - totalComDesc

  // ——— FRETE (cotação real via Melhor Envio) ———
  const [freteOpcoes, setFreteOpcoes] = useState<FreteOpcao[] | null>(null)
  const [freteId, setFreteId] = useState<number | null>(null)
  const [freteLoading, setFreteLoading] = useState(false)
  const [freteErro, setFreteErro] = useState<string | null>(null)

  const cepDigits = (endereco.cep || '').replace(/\D/g, '')
  // Frete grátis: >= R$199 com destino na Grande SP (CEP 0xxxx-xxx) — regra do topo do site
  const freteGratis = entregaTipo === 'entrega' && cepDigits.length === 8 && cepDigits.startsWith('0') && totalComDesc >= 199
  const freteEscolhido = freteOpcoes?.find(o => o.id === freteId) || null
  const freteValor = entregaTipo === 'retirada' || freteGratis ? 0 : (freteEscolhido?.preco ?? 0)
  const freteDefinido = entregaTipo === 'retirada' || freteGratis || !!freteEscolhido
  const totalFinal = Math.round((totalComDesc + freteValor) * 100) / 100

  // Cota quando o CEP fica completo (e re-cota se o carrinho ou o CEP mudarem)
  const linesKey = lines.map(l => `${l.variation.sku}:${l.quantity}`).join('|')
  useEffect(() => {
    setFreteOpcoes(null)
    setFreteId(null)
    setFreteErro(null)
    if (entregaTipo !== 'entrega' || cepDigits.length !== 8 || freteGratis || lines.length === 0) return
    let cancelado = false
    setFreteLoading(true)
    fetch('/api/frete/calcular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep: cepDigits, itens: lines.map(l => ({ sku: l.variation.sku, quantidade: l.quantity })) }),
    })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (cancelado) return
        if (!ok || !d.opcoes) { setFreteErro(d.error || 'Não foi possível cotar o frete.'); return }
        if (d.opcoes.length === 0) { setFreteErro('Nenhuma transportadora atende esse CEP.'); return }
        const top = d.opcoes.slice(0, 4)
        setFreteOpcoes(top)
        setFreteId(top[0].id) // pré-seleciona a mais barata
      })
      .catch(() => { if (!cancelado) setFreteErro('Não foi possível cotar o frete.') })
      .finally(() => { if (!cancelado) setFreteLoading(false) })
    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepDigits, entregaTipo, freteGratis, linesKey])

  // Só oferece parcelas que respeitem o valor mínimo por parcela (ver pricing.ts).
  // Base: produtos + frete — é o valor que o cliente parcela de fato.
  const maxParcelas = parcelasMaximas(totalFinal)
  // Se o carrinho encolher depois de escolher (ex.: 6x e o cliente tira um item),
  // a opção selecionada some do menu mas o estado continuaria em 6 — reancora.
  useEffect(() => {
    if (parcelas > maxParcelas) setParcelas(maxParcelas)
  }, [maxParcelas, parcelas])

  // Itens no formato de e-commerce do Google Analytics (funil de venda)
  const buildGaItems = (): GaItem[] =>
    lines.map((l) => ({
      item_id: l.variation.sku,
      item_name: `${l.product.name} — ${l.variation.label}`,
      price: precoComDesc(l.tier.price),
      quantity: l.quantity,
      item_category: l.product.category,
    }))

  // Dispara begin_checkout uma única vez, quando o carrinho já tem itens
  const beganCheckout = useRef(false)
  useEffect(() => {
    if (beganCheckout.current || lines.length === 0) return
    beganCheckout.current = true
    trackBeginCheckout(buildGaItems(), totalComDesc)
    metaBeginCheckout({
      ids: lines.map((l) => l.variation.sku),
      value: totalComDesc,
      numItems: lines.reduce((s, l) => s + l.quantity, 0),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.length])

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
        if (data.cnpj) setDocumento(data.cnpj)
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

  function entregaValida() {
    if (!nomeContato.trim()) return false
    if (!telefoneContato.trim()) return false
    if (!documentoValido(documento)) return false
    if (entregaTipo === 'entrega' && !enderecoCompleto()) return false
    // Entrega precisa de frete resolvido (opção escolhida ou grátis)
    if (entregaTipo === 'entrega' && !freteDefinido) return false
    return true
  }

  function cartaoValido() {
    const num = cartao.numero.replace(/\D/g, '')
    const val = cartao.validade.replace(/\D/g, '')
    const cvv = cartao.cvv.replace(/\D/g, '')
    return num.length >= 13 && cartao.nome.trim().length >= 2 && val.length === 4 && cvv.length >= 3
  }

  // Tenta avançar para o pagamento; se faltar algo, destaca os campos em vermelho
  function avancarPagamento() {
    if (entregaValida()) {
      setMostrarErros(false)
      setStep('pagamento')
    } else {
      setMostrarErros(true)
    }
  }

  async function aplicarCupom() {
    const codigo = cupomInput.trim()
    if (!codigo) return
    setCupomLoading(true)
    setCupomErro(null)
    try {
      const res = await fetch('/api/cupom/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      })
      const data = await res.json().catch(() => ({}))
      if (data?.valido) {
        setCupomAplicado({ codigo: data.codigo, desconto_percent: data.desconto_percent })
        setCupomErro(null)
      } else {
        setCupomAplicado(null)
        setCupomErro('Cupom inválido ou inativo.')
      }
    } catch {
      setCupomErro('Não foi possível validar o cupom agora.')
    } finally {
      setCupomLoading(false)
    }
  }

  function removerCupom() {
    setCupomAplicado(null)
    setCupomInput('')
    setCupomErro(null)
  }

  async function finalizarPedido() {
    if (!user) return
    setSubmitting(true)
    const supabase = createClient()

    // Endereço usado para o frete/Pagar.me: da loja (retirada) ou do cliente (entrega)
    const enderecoEnvio = entregaTipo === 'retirada' ? LOJA : endereco
    const entregaLabel = entregaTipo === 'retirada' ? 'Retirar na loja' : 'Entrega no endereço'

    // 1. Cria pedido no Supabase
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        user_id: user.id,
        status: 'pendente',
        total: totalFinal,
        forma_pagamento: formaPagamento,
        observacao: `Entrega: ${entregaLabel}${descTotalPercent > 0 ? ` | Desconto ${descTotalPercent}%` : ''}${cupomAplicado ? ` | Cupom ${cupomAplicado.codigo}` : ''}${obs ? ' | Obs: ' + obs : ''}`,
      })
      .select('id')
      .single()

    if (pedidoError || !pedido) {
      alert('Erro ao criar pedido. Tente novamente.')
      setSubmitting(false)
      return
    }

    // 2. Monta os itens (só sku+quantidade importam; o SERVIDOR recalcula o preço
    //    e grava os itens de forma autoritativa em criar-pedido, numa etapa que
    //    aborta antes de cobrar se falhar — por isso NÃO inserimos itens aqui,
    //    evitando "pedido órfão" (pedido gravado sem itens e mesmo assim cobrado).
    const itens = lines.map(l => ({
      pedido_id: pedido.id,
      sku: l.variation.sku,
      descricao: `${l.product.name} — ${l.variation.label}`,
      quantidade: l.quantity,
      preco_unitario: precoComDesc(l.tier.price),
    }))

    // 3. Salva dados no perfil (documento/telefone sempre; endereço só na entrega)
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      cnpj: documento || null,
      telefone: telefoneContato || null,
      ...(entregaTipo === 'entrega' ? { endereco } : {}),
      updated_at: new Date().toISOString(),
    })

    // 4. Cartão: tokeniza no navegador (o cartão cru nunca passa pelo nosso servidor)
    let cardToken: string | undefined
    if (formaPagamento === 'cartao') {
      const pubKey = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY
      const [mm, aa] = cartao.validade.split('/')
      try {
        const tkRes = await fetch(`https://api.pagar.me/core/v5/tokens?appId=${pubKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'card',
            card: {
              number: cartao.numero.replace(/\D/g, ''),
              holder_name: cartao.nome,
              exp_month: Number(mm),
              exp_year: Number(aa),
              cvv: cartao.cvv,
            },
          }),
        })
        const tkData = await tkRes.json()
        if (!tkRes.ok || !tkData.id) throw new Error('token')
        cardToken = tkData.id
      } catch {
        alert('Não foi possível validar o cartão. Confira número, validade e CVV.')
        setSubmitting(false)
        return
      }
    }

    // Valor cobrado: produtos com desconto + frete. 3x sem juros; acima disso,
    // repassa os juros (JUROS_AO_MES por parcela). O servidor recalcula tudo.
    const valorCobrar =
      formaPagamento === 'cartao' && parcelas > PARCELAS_SEM_JUROS
        ? Math.round(totalFinal * (1 + JUROS_AO_MES * parcelas) * 100) / 100
        : totalFinal

    // 5. Chama o Pagar.me — com tratamento de rede/erro para o botão NUNCA travar
    try {
      const pagarmeRes = await fetch('/api/pagarme/criar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedido.id,
          total: valorCobrar,
          forma_pagamento: formaPagamento,
          itens: itens.map(i => ({
            sku: i.sku,
            descricao: i.descricao,
            quantidade: i.quantidade,
            preco_unitario: i.preco_unitario,
          })),
          cliente: {
            nome: nomeContato || user.user_metadata?.full_name || user.email || 'Cliente',
            email: user.email || '',
            documento,
            telefone: telefoneContato,
          },
          endereco: enderecoEnvio,
          card_token: cardToken,
          parcelas,
          cupom: cupomAplicado?.codigo || undefined,
          entrega: entregaTipo,
          frete_servico_id: entregaTipo === 'entrega' && !freteGratis ? freteId ?? undefined : undefined,
        }),
      })

      const pagarmeData = await pagarmeRes.json().catch(() => ({ error: 'Resposta inválida do servidor.' }))

      if (!pagarmeRes.ok || pagarmeData.error) {
        alert(pagarmeData.error || 'Não foi possível concluir o pagamento. Tente novamente.')
        return
      }

      // Conversão! Registra a compra no GA e na Meta antes de limpar o carrinho.
      trackPurchase({ transactionId: pedido.id, value: totalComDesc, items: buildGaItems() })
      metaPurchase({ orderId: pedido.id, value: totalComDesc, ids: lines.map((l) => l.variation.sku) })
      setPagamentoResult(pagarmeData)
      clearCart()
      setPedidoId(pedido.id)
      setStep('confirmado')
    } catch {
      alert(
        'Falha de conexão ao processar o pagamento. Verifique sua internet e tente de novo. ' +
        'Se o valor já tiver sido cobrado, confira em "Meus pedidos" antes de refazer.'
      )
    } finally {
      setSubmitting(false)
    }
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

            {/* CARTÃO */}
            {pagamentoResult?.tipo === 'cartao' && (
              <div className="checkoutPix">
                <p className="checkoutPixTitle">💳 Pagamento aprovado!</p>
                <p className="checkoutPixDesc">
                  Seu cartão foi aprovado{pagamentoResult.parcelas && pagamentoResult.parcelas > 1 ? ` em ${pagamentoResult.parcelas}x` : ''}. Já estamos preparando seu pedido.
                </p>
              </div>
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
                <h2 className="checkoutSectionTitle">Revise seus itens</h2>
                <p className="checkoutSectionSub">Veja os produtos que você escolheu e faça ajustes se necessário.</p>
                <div className="checkoutItems">
                  {lines.map(({ product, variation, quantity, tier, total }) => (
                    <div key={variation.sku} className="checkoutItem">
                      <div className="checkoutItemImg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImageSrc(variation.sku)}
                          alt={product.name}
                          onError={handleProductImageError(variation.sku)}
                        />
                      </div>
                      <div className="checkoutItemInfo">
                        <p className="checkoutItemName">{product.name}</p>
                        {variation.label !== product.name && (
                          <p className="checkoutItemVar">{variation.label}</p>
                        )}
                        <span className="checkoutItemSku">{variation.sku}</span>
                        <button
                          type="button"
                          className="checkoutItemRemove"
                          onClick={() => updateQuantity(variation.sku, 0)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Remover
                        </button>
                      </div>
                      <div className="checkoutItemMeio">
                        <div className="checkoutItemStepper">
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            onClick={() => updateQuantity(variation.sku, quantity - 1)}
                            disabled={quantity <= 1}
                          >−</button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            onClick={() => updateQuantity(variation.sku, quantity + 1)}
                          >+</button>
                        </div>
                        <p className="checkoutItemPrice">{formatCurrency(tier.price)} / un.</p>
                      </div>
                      <p className="checkoutItemTotal">{formatCurrency(total)}</p>
                    </div>
                  ))}
                </div>

                {/* Convite pra voltar ao catálogo sem perder o checkout */}
                <a href="/#produtos" className="checkoutContinueBanner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-700, #5b21b6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" />
                  </svg>
                  <span className="checkoutContinueBannerTexto">
                    <strong>Precisa de mais alguma coisa?</strong>
                    Continue comprando e aproveite o frete!
                  </span>
                  <span className="checkoutContinueBannerLink">Continuar comprando →</span>
                </a>

                <button className="checkoutBtnPrimary checkoutBtnFull" onClick={() => setStep('entrega')}>
                  Continuar para entrega →
                </button>
              </div>
            )}

            {/* ─── STEP 2: ENTREGA ─── */}
            {step === 'entrega' && (
              <div className="checkoutSection">
                <h2 className="checkoutSectionTitle">Entrega</h2>

                {/* Tipo de entrega */}
                <div className="checkoutPayOptions">
                  <button
                    className={`checkoutPayOption ${entregaTipo === 'entrega' ? 'active' : ''}`}
                    onClick={() => setEntregaTipo('entrega')}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/receber-em-casa.png" alt="" aria-hidden="true" className="checkoutPayIcon" />
                    <div>
                      <strong>Receber em casa</strong>
                      <span>Entrega no seu endereço</span>
                    </div>
                    <span className={`checkoutPayCheck ${entregaTipo === 'entrega' ? 'checked' : ''}`} aria-hidden="true" />
                  </button>
                  <button
                    className={`checkoutPayOption ${entregaTipo === 'retirada' ? 'active' : ''}`}
                    onClick={() => setEntregaTipo('retirada')}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/retirada-na-loja.png" alt="" aria-hidden="true" className="checkoutPayIcon" />
                    <div>
                      <strong>Retirar na loja</strong>
                      <span>Frete grátis · retire no balcão</span>
                    </div>
                    <span className={`checkoutPayCheck ${entregaTipo === 'retirada' ? 'checked' : ''}`} aria-hidden="true" />
                  </button>
                </div>

                {/* Contato (sempre) + endereço (só na entrega) */}
                <div className="checkoutGrid">
                  <div className="checkoutField">
                    <label>Nome para contato</label>
                    <input type="text" className={mostrarErros && !nomeContato.trim() ? 'campoErro' : undefined} value={nomeContato} onChange={e => setNomeContato(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div className="checkoutField">
                    <label>Telefone / WhatsApp</label>
                    <input type="tel" className={mostrarErros && !telefoneContato.trim() ? 'campoErro' : undefined} value={telefoneContato} onChange={e => setTelefoneContato(e.target.value)} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="checkoutField">
                    <label>CPF ou CNPJ</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className={mostrarErros && !documentoValido(documento) ? 'campoErro' : undefined}
                      value={documento}
                      onChange={e => setDocumento(formatarDocumento(e.target.value))}
                      placeholder="Obrigatório para o pagamento"
                      maxLength={18} /* CNPJ formatado: 00.000.000/0000-00 */
                    />
                    {documento.replace(/\D/g, '').length > 0 && !documentoValido(documento) && (
                      <span style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>
                        CPF ou CNPJ inválido
                      </span>
                    )}
                  </div>

                  {entregaTipo === 'entrega' && (
                    <>
                      <div className="checkoutField">
                        <label>CEP</label>
                        <div className="checkoutCepWrap">
                          <input
                            type="text"
                            className={mostrarErros && !endereco.cep ? 'campoErro' : undefined}
                            value={endereco.cep || ''}
                            onChange={e => setEndereco(v => ({ ...v, cep: formatCEP(e.target.value) }))}
                            onBlur={e => buscarCEP(e.target.value)}
                            placeholder="00000-000"
                          />
                          {cepLoading && <span className="checkoutCepSpinner" />}
                        </div>
                      </div>
                      <div className="checkoutField">
                        <label>Rua / Avenida</label>
                        <input type="text" className={mostrarErros && !endereco.rua ? 'campoErro' : undefined} value={endereco.rua || ''} onChange={e => setEndereco(v => ({ ...v, rua: e.target.value }))} placeholder="Nome da rua" />
                      </div>
                      <div className="checkoutField">
                        <label>Número</label>
                        <input type="text" className={mostrarErros && !endereco.numero ? 'campoErro' : undefined} value={endereco.numero || ''} onChange={e => setEndereco(v => ({ ...v, numero: e.target.value }))} placeholder="123" />
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
                        <input type="text" className={mostrarErros && !endereco.cidade ? 'campoErro' : undefined} value={endereco.cidade || ''} onChange={e => setEndereco(v => ({ ...v, cidade: e.target.value }))} placeholder="Cidade" />
                      </div>
                      <div className="checkoutField">
                        <label>Estado</label>
                        <select className={mostrarErros && !endereco.estado ? 'campoErro' : undefined} value={endereco.estado || ''} onChange={e => setEndereco(v => ({ ...v, estado: e.target.value }))}>
                          <option value="">Selecione</option>
                          {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {entregaTipo === 'retirada' && (
                  <div className="checkoutPixInfo checkoutPixInfoBranco">
                    <p><strong>Retirada na loja</strong> — frete grátis</p>
                    <p>{LOJA.rua}, {LOJA.numero} — {LOJA.bairro}, {LOJA.cidade}/{LOJA.estado} · CEP {LOJA.cep}</p>
                    <p>Avisaremos por WhatsApp quando seu pedido estiver pronto para retirada.</p>
                  </div>
                )}

                {/* ─── FRETE: opções cotadas no Melhor Envio ─── */}
                {entregaTipo === 'entrega' && cepDigits.length === 8 && (
                  <div className="checkoutFreteBloco">
                    <label className="checkoutLabel">Frete</label>
                    {freteGratis && (
                      <div className="checkoutPixInfo checkoutPixInfoBranco" style={{ marginBottom: 10 }}>
                        <p><strong>Frete grátis</strong> — seu pedido passa de {formatCurrency(199)} e o destino é na Grande São Paulo. 🎉</p>
                      </div>
                    )}
                    {!freteGratis && freteLoading && (
                      <p className="checkoutFreteStatus">Cotando frete para o seu CEP…</p>
                    )}
                    {!freteGratis && freteErro && (
                      <p className="checkoutFreteStatus checkoutFreteStatusErro">{freteErro}</p>
                    )}
                    {!freteGratis && freteOpcoes && (
                      <div className="checkoutPayOptions" style={{ marginBottom: 4 }}>
                        {freteOpcoes.map(o => (
                          <button
                            key={o.id}
                            type="button"
                            className={`checkoutPayOption checkoutFreteOpcao ${freteId === o.id ? 'active' : ''}`}
                            onClick={() => setFreteId(o.id)}
                          >
                            <div>
                              <strong>{o.transportadora} {o.nome}</strong>
                              <span>Chega em até {o.prazo} dia{o.prazo === 1 ? '' : 's'} út{o.prazo === 1 ? 'il' : 'eis'}</span>
                            </div>
                            <em className="checkoutFretePreco">{formatCurrency(o.preco)}</em>
                            <span className={`checkoutPayCheck ${freteId === o.id ? 'checked' : ''}`} aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    )}
                    {mostrarErros && !freteDefinido && (
                      <span style={{ color: '#dc2626', fontSize: 12 }}>Escolha uma opção de frete para continuar.</span>
                    )}
                  </div>
                )}

                <div className="checkoutFieldFull">
                  <label className="checkoutLabel">Observações <span className="checkoutOptional">opcional</span></label>
                  <textarea
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                    placeholder="Instruções especiais, horário de entrega, referência…"
                    rows={2}
                    className="checkoutTextarea"
                  />
                </div>

                {mostrarErros && !entregaValida() && (
                  <p style={{ color: '#dc2626', fontSize: '13px', margin: '12px 0 0' }}>
                    Preencha os campos destacados em vermelho para continuar.
                  </p>
                )}

                <div className="checkoutBtnRow">
                  <button className="checkoutBtnSecondary" onClick={() => setStep('resumo')}>← Voltar</button>
                  <button
                    className="checkoutBtnPrimary"
                    onClick={avancarPagamento}
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
                    { id: 'pix', label: 'Pix', desc: 'Aprovação imediata', icon: '/pagamento-pix.png' },
                    { id: 'cartao', label: 'Cartão de crédito', desc: 'Em até 12x', icon: '/pagamento-cartao.png' },
                    { id: 'boleto', label: 'Boleto bancário', desc: 'Prazo de 1–3 dias úteis', icon: '/pagamento-boleto.png' },
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      className={`checkoutPayOption ${formaPagamento === opt.id ? 'active' : ''}`}
                      onClick={() => setFormaPagamento(opt.id)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={opt.icon} alt="" aria-hidden="true" className="checkoutPayIcon" />
                      <div>
                        <strong>{opt.label}</strong>
                        <span>{opt.desc}</span>
                      </div>
                      <span className={`checkoutPayCheck ${formaPagamento === opt.id ? 'checked' : ''}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>

                {/* Selo de confiança: quem processa o pagamento não é a loja */}
                <div className="checkoutTrust">
                  <span className="checkoutTrustIcon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span className="checkoutTrustText">
                    Pagamento processado com segurança pela <strong>Pagar.me</strong> <em>— uma empresa Stone</em>.
                    Seus dados de cartão são criptografados e não passam pelos nossos servidores.
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/pagarme-stone.png" alt="Pagar.me — uma empresa Stone" className="checkoutTrustLogo" />
                </div>

                {formaPagamento === 'pix' && (
                  <div className="checkoutPixInfo checkoutPixInfoNeutro">
                    <p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/whatsapp-icon.png" alt="" aria-hidden="true" className="checkoutZapIcon" />
                      Após confirmar o pedido, a chave Pix será enviada para o seu <span className="checkoutZap">WhatsApp</span> ou e-mail.
                    </p>
                  </div>
                )}

                {formaPagamento === 'cartao' && (
                  <div className="checkoutGrid" style={{ marginTop: 16 }}>
                    <div className="checkoutField checkoutFieldFull">
                      <label>Número do cartão</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cartao.numero}
                        onChange={e => setCartao(c => ({ ...c, numero: maskCartaoNumero(e.target.value) }))}
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div className="checkoutField checkoutFieldFull">
                      <label>Nome impresso no cartão</label>
                      <input
                        type="text"
                        value={cartao.nome}
                        onChange={e => setCartao(c => ({ ...c, nome: e.target.value.toUpperCase() }))}
                        placeholder="Como está no cartão"
                      />
                    </div>
                    <div className="checkoutField">
                      <label>Validade (MM/AA)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cartao.validade}
                        onChange={e => setCartao(c => ({ ...c, validade: maskValidade(e.target.value) }))}
                        placeholder="MM/AA"
                      />
                    </div>
                    <div className="checkoutField">
                      <label>CVV</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cartao.cvv}
                        onChange={e => setCartao(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                      />
                    </div>
                    <div className="checkoutField checkoutFieldFull">
                      <label>Parcelas</label>
                      <select value={parcelas} onChange={e => setParcelas(Number(e.target.value))}>
                        {Array.from({ length: maxParcelas }, (_, i) => i + 1).map(n => {
                          const comJuros = n > 3
                          const totalParc = comJuros ? totalFinal * (1 + JUROS_AO_MES * n) : totalFinal
                          return (
                            <option key={n} value={n}>
                              {n}x de {formatCurrency(totalParc / n)}
                              {comJuros ? ` (total ${formatCurrency(totalParc)})` : ' sem juros'}
                            </option>
                          )
                        })}
                      </select>
                      <p className="checkoutFieldHint">
                        {maxParcelas < PARCELAS_MAX
                          ? `Parcela mínima de ${formatCurrency(PARCELA_VALOR_MIN)} — por isso este pedido vai até ${maxParcelas}x.`
                          : `Parcela mínima de ${formatCurrency(PARCELA_VALOR_MIN)}. Até ${PARCELAS_SEM_JUROS}x sem juros.`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="checkoutBtnRow">
                  <button className="checkoutBtnSecondary" onClick={() => setStep('entrega')}>← Voltar</button>
                  <button
                    className="checkoutBtnPrimary checkoutBtnFinalizar"
                    onClick={finalizarPedido}
                    disabled={submitting || (formaPagamento === 'cartao' && !cartaoValido())}
                  >
                    {submitting ? 'Processando…' : `Finalizar pedido · ${formatCurrency(totalFinal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── COLUNA DIREITA: RESUMO FIXO ─── */}
          <aside className="checkoutSidebar">
            <div className="checkoutSidebarCard">
              <h3 className="checkoutSidebarTitle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Seu pedido <em className="checkoutSidebarQtdTotal">({totalQty} {totalQty === 1 ? 'item' : 'itens'})</em>
              </h3>
              <div className="checkoutSidebarLines">
                {lines.map(({ product, variation, quantity, total }) => (
                  <div key={variation.sku} className="checkoutSidebarItem">
                    <div className="checkoutSidebarThumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={productImageSrc(variation.sku)}
                        alt={product.name}
                        loading="lazy"
                        onError={handleProductImageError(variation.sku)}
                      />
                    </div>
                    <div className="checkoutSidebarItemInfo">
                      <span className="checkoutSidebarItemNome">{product.name}</span>
                      <span className="checkoutSidebarItemQtd">Quantidade: {quantity}</span>
                    </div>
                    <strong className="checkoutSidebarItemPreco">{formatCurrency(total)}</strong>
                  </div>
                ))}
              </div>
              <div className="checkoutSidebarDivider" />

              <div className="checkoutSidebarTotal">
                <span>Subtotal</span>
                <strong className="checkoutSidebarSubtotal">{formatCurrency(subtotal)}</strong>
              </div>
              {descTotalPercent > 0 && (
                <div className="checkoutSidebarTotal" style={{ color: '#16a34a', fontWeight: 500 }}>
                  <span style={{ color: '#16a34a' }}>Desconto ({descTotalPercent}%)</span>
                  <strong style={{ fontSize: '0.875rem', color: '#16a34a' }}>− {formatCurrency(descValor)}</strong>
                </div>
              )}
              <div className="checkoutSidebarFrete">
                <span>Frete</span>
                <span className="checkoutSidebarFreteVal">
                  {entregaTipo === 'retirada'
                    ? 'Grátis · Retirar na loja'
                    : freteGratis
                      ? 'Grátis (Grande SP)'
                      : freteLoading
                        ? 'calculando…'
                        : freteEscolhido
                          ? formatCurrency(freteEscolhido.preco)
                          : 'Informe o CEP'}
                </span>
              </div>

              <div className="checkoutSidebarDivider" />

              <div className="checkoutSidebarTotalFinal">
                <span>TOTAL</span>
                <strong>{formatCurrency(totalFinal)}</strong>
              </div>

              {/* Cupom de desconto */}
              <div style={{ margin: '4px 0 10px' }}>
                {cupomAplicado ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 10px', fontSize: 12.5 }}>
                    <span>Cupom <strong>{cupomAplicado.codigo}</strong> · {cupomAplicado.desconto_percent}% OFF</span>
                    <button type="button" onClick={removerCupom} aria-label="Remover cupom" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, lineHeight: 1 }}>✕</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Cupom de desconto"
                        value={cupomInput}
                        onChange={(e) => { setCupomInput(e.target.value.toUpperCase()); setCupomErro(null) }}
                        onKeyDown={(e) => e.key === 'Enter' && aplicarCupom()}
                        style={{ flex: 1, minWidth: 0, height: 38, border: '1px solid var(--line, #e5e0f0)', borderRadius: 6, padding: '0 10px', fontSize: 13 }}
                      />
                      <button type="button" onClick={aplicarCupom} disabled={cupomLoading || !cupomInput.trim()} style={{ height: 38, padding: '0 14px', borderRadius: 6, border: '1px solid var(--line, #e5e0f0)', background: '#f3f4f6', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {cupomLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {cupomErro && <span style={{ color: '#dc2626', fontSize: 12, marginTop: 4, display: 'block' }}>{cupomErro}</span>}
                  </>
                )}
              </div>

            </div>

            {/* Selos de confiança abaixo do resumo */}
            <div className="checkoutSidebarTrust">
              <div className="checkoutSidebarTrustItem">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
                </svg>
                <div>
                  <strong>Compra 100% segura</strong>
                  <span>Seus dados protegidos e criptografados</span>
                </div>
              </div>
              <div className="checkoutSidebarTrustItem">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <div>
                  <strong>Postagem rápida</strong>
                  <span>Seu pedido postado em até 1 dia útil</span>
                </div>
              </div>
              <div className="checkoutSidebarTrustItem">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" />
                </svg>
                <div>
                  <strong>Garantia Grape Tools</strong>
                  <span>Produtos de qualidade com garantia</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </>
  )
}
