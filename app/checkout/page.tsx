'use client'

import "./checkout.css"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { productImageSrc, handleProductImageError } from '@/lib/product-image'
import { documentoValido } from '@/lib/documento'
import { formatCurrency, getCartLines, descontoCarrinhoPercent } from '@/lib/pricing'
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
  const { cart, clearCart } = useCart()
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
  const precoComDesc = (preco: number) => Math.round(preco * (100 - descPercent)) / 100
  const totalComDesc = lines.reduce((s, l) => s + precoComDesc(l.tier.price) * l.quantity, 0)
  const descValor = subtotal - totalComDesc

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
        total: totalComDesc,
        forma_pagamento: formaPagamento,
        observacao: `Entrega: ${entregaLabel}${descPercent > 0 ? ` | Desconto ${descPercent}%` : ''}${obs ? ' | Obs: ' + obs : ''}`,
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

    // Valor cobrado: parte do total JÁ COM desconto. 3x sem juros; acima disso,
    // repassa os juros (2% por parcela).
    const valorCobrar =
      formaPagamento === 'cartao' && parcelas > 3
        ? Math.round(totalComDesc * (1 + 0.02 * parcelas) * 100) / 100
        : totalComDesc

    // 5. Chama o Pagar.me
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
      }),
    })

    const pagarmeData = await pagarmeRes.json()

    if (pagarmeData.error) {
      alert(pagarmeData.error)
      setSubmitting(false)
      return
    }

    setPagamentoResult(pagarmeData)

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
                <h2 className="checkoutSectionTitle">Itens do pedido</h2>
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
                <h2 className="checkoutSectionTitle">Entrega</h2>

                {/* Tipo de entrega */}
                <div className="checkoutPayOptions">
                  <button
                    className={`checkoutPayOption ${entregaTipo === 'entrega' ? 'active' : ''}`}
                    onClick={() => setEntregaTipo('entrega')}
                  >
                    <span className="checkoutPayIcon">📦</span>
                    <div>
                      <strong>Receber em casa</strong>
                      <span>Entrega no seu endereço</span>
                    </div>
                    <span className="checkoutPayCheck">{entregaTipo === 'entrega' ? '●' : '○'}</span>
                  </button>
                  <button
                    className={`checkoutPayOption ${entregaTipo === 'retirada' ? 'active' : ''}`}
                    onClick={() => setEntregaTipo('retirada')}
                  >
                    <span className="checkoutPayIcon">🏪</span>
                    <div>
                      <strong>Retirar na loja</strong>
                      <span>Frete grátis · retire no balcão</span>
                    </div>
                    <span className="checkoutPayCheck">{entregaTipo === 'retirada' ? '●' : '○'}</span>
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
                      onChange={e => setDocumento(e.target.value)}
                      placeholder="Obrigatório para o pagamento"
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
                        <label>Número</label>
                        <input type="text" className={mostrarErros && !endereco.numero ? 'campoErro' : undefined} value={endereco.numero || ''} onChange={e => setEndereco(v => ({ ...v, numero: e.target.value }))} placeholder="123" />
                      </div>
                      <div className="checkoutField checkoutFieldFull">
                        <label>Rua / Avenida</label>
                        <input type="text" className={mostrarErros && !endereco.rua ? 'campoErro' : undefined} value={endereco.rua || ''} onChange={e => setEndereco(v => ({ ...v, rua: e.target.value }))} placeholder="Nome da rua" />
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
                  <div className="checkoutPixInfo">
                    <p><strong>🏪 Retirada na loja — frete grátis</strong></p>
                    <p>{LOJA.rua}, {LOJA.numero} — {LOJA.bairro}, {LOJA.cidade}/{LOJA.estado} · CEP {LOJA.cep}</p>
                    <p>Avisaremos por WhatsApp quando seu pedido estiver pronto para retirada.</p>
                  </div>
                )}

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
                    { id: 'pix', label: 'Pix', desc: 'Aprovação imediata', icon: '⚡' },
                    { id: 'cartao', label: 'Cartão de crédito', desc: 'Em até 12x', icon: '💳' },
                    { id: 'boleto', label: 'Boleto bancário', desc: 'Prazo de 1–3 dias úteis', icon: '📄' },
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
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
                          const comJuros = n > 3
                          const totalParc = comJuros ? totalComDesc * (1 + 0.02 * n) : totalComDesc
                          return (
                            <option key={n} value={n}>
                              {n}x de {formatCurrency(totalParc / n)}
                              {comJuros ? ` (total ${formatCurrency(totalParc)})` : ' sem juros'}
                            </option>
                          )
                        })}
                      </select>
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
                    {submitting ? 'Processando…' : `Finalizar pedido · ${formatCurrency(totalComDesc)}`}
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
              {descPercent > 0 && (
                <div className="checkoutSidebarTotal" style={{ color: '#16a34a', fontWeight: 500 }}>
                  <span>Desconto ({descPercent}%)</span>
                  <strong>− {formatCurrency(descValor)}</strong>
                </div>
              )}
              <div className="checkoutSidebarTotal">
                <span>{totalQty} itens</span>
                <strong>{formatCurrency(totalComDesc)}</strong>
              </div>
              <div className="checkoutSidebarFrete">
                <span>Frete</span>
                <span className="checkoutSidebarFreteVal">
                  {entregaTipo === 'retirada' ? 'Grátis · Retirar na loja' : 'A combinar'}
                </span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </>
  )
}
