'use client'

import "./cart.css"
import { useMemo, useState } from 'react'
import { products } from '@/lib/data'
import { formatCurrency, getTierForQuantity, getCartLines, descontoCarrinhoPercent, PIX_DESCONTO_PERCENT } from '@/lib/pricing'
import { useCart } from '@/hooks/useCart'
import { productImageSrc, handleProductImageError } from '@/lib/product-image'
import { BackToSite } from '@/components/BackToSite'
import { EstoqueAviso, itensSemEstoque } from '@/components/EstoqueAviso'
import { useEstoque } from '@/hooks/useEstoque'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'

const FRETE_GRATIS = 199

export default function CartPage() {
  const { cart, updateQuantity, clearCart, addToCart } = useCart()
  const estoque = useEstoque()

  // Animação do "+ Adicionar" das sugestões: o cartão confirma e se recolhe,
  // e o item recém-chegado pisca na lista pra mostrar onde foi parar.
  const [sugestaoSaindo, setSugestaoSaindo] = useState<Set<string>>(new Set())
  const [recemAdicionado, setRecemAdicionado] = useState<string | null>(null)

  function adicionarSugestao(prefix: string, sku: string) {
    if (sugestaoSaindo.has(prefix)) return
    setSugestaoSaindo(prev => new Set(prev).add(prefix))
    // 1º a confirmação visual no cartão; o item entra quando ele termina de sair
    setTimeout(() => {
      addToCart(sku, 1)
      setRecemAdicionado(sku)
      // Limpa a marca de "saindo": se o produto voltar às sugestões um dia
      // (cliente removeu do carrinho), o cartão renderiza visível de novo.
      setSugestaoSaindo(prev => { const n = new Set(prev); n.delete(prefix); return n })
      setTimeout(() => setRecemAdicionado(null), 1600)
    }, 450)
  }

  const lines = getCartLines(cart).map(l => {
    // Economia vs. preço do tier mais caro (menor quantidade)
    const economiaTotal = (l.variation.tiers[0].price - l.tier.price) * l.quantity
    return { ...l, economiaTotal }
  })

  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0)
  const totalEconomia = lines.reduce((s, l) => s + l.economiaTotal, 0)
  // Desconto por valor total do carrinho (2% a 5%) — aplicado por preço unitário
  const descPercent = descontoCarrinhoPercent(subtotal)
  const totalComDesc = lines.reduce(
    (s, l) => s + (Math.round(l.tier.price * (100 - descPercent)) / 100) * l.quantity,
    0
  )
  const descValor = subtotal - totalComDesc
  // Desconto Pix real (3%): o checkout aplica quando a forma escolhida é Pix
  const pixSubtotal = Math.round(totalComDesc * (100 - PIX_DESCONTO_PERCENT)) / 100

  const freteProgress = Math.min((subtotal / FRETE_GRATIS) * 100, 100)
  const freteGratis = subtotal >= FRETE_GRATIS

  // Próximo tier de qualquer item
  function getNextTierSuggestion() {
    for (const { variation, quantity } of lines) {
      const tiers = variation.tiers
      const nextTier = tiers.find(t => t.minQty > quantity)
      if (nextTier) {
        const diff = nextTier.minQty - quantity
        const currentTier = getTierForQuantity(tiers, quantity)
        const economia = (currentTier.price - nextTier.price) * nextTier.minQty
        return { diff, label: nextTier.label, sku: variation.sku, nextPrice: nextTier.price, economia, variation, quantity }
      }
    }
    return null
  }

  const nextTier = getNextTierSuggestion()

  // Itens pedindo acima do estoque → banner vermelho + checkout travado
  const semEstoque = itensSemEstoque(lines, estoque)

  // Progresso do próximo tier
  function getTierProgress() {
    if (!nextTier) return 100
    const { variation, quantity } = nextTier
    const tiers = variation.tiers
    const currentTierIdx = tiers.findIndex(t => t.minQty === getTierForQuantity(tiers, quantity).minQty)
    const prevMin = tiers[currentTierIdx]?.minQty ?? 1
    const nextMin = nextTier.label ? tiers[currentTierIdx + 1]?.minQty ?? prevMin : prevMin
    return Math.min(((quantity - prevMin) / (nextMin - prevMin)) * 100, 100)
  }

  const tierProgress = getTierProgress()

  // Cross-sell: produtos da mesma categoria dos itens no carrinho
  // Recalcula quando a COMPOSIÇÃO do carrinho muda (não só o nº de itens): item
  // adicionado sai das sugestões e outro entra no lugar — a prateleira fica
  // sempre cheia. As setinhas ‹ › paginam o catálogo inteiro, 5 por vez.
  const skusNoCarrinho = lines.map(l => l.variation.sku).sort().join('|')
  const todasSugestoes = useMemo(() => {
    const cartPrefixes = new Set(lines.map(l => l.product.prefix))
    const cartCategories = new Set(lines.map(l => l.product.category))
    // Prioriza mesma categoria, depois qualquer produto
    const sameCategory = products.filter(p => !cartPrefixes.has(p.prefix) && cartCategories.has(p.category))
    const others = products.filter(p => !cartPrefixes.has(p.prefix) && !cartCategories.has(p.category))
    return [...sameCategory, ...others]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skusNoCarrinho])

  const SUGESTOES_POR_PAGINA = 5
  const [sugPagina, setSugPagina] = useState(0)
  // Direção da última navegação: a página nova desliza vindo do lado certo
  const [sugDirecao, setSugDirecao] = useState<1 | -1>(1)
  const totalPaginasSug = Math.max(1, Math.ceil(todasSugestoes.length / SUGESTOES_POR_PAGINA))
  const paginaAtual = Math.min(sugPagina, totalPaginasSug - 1)
  const sugestoes = todasSugestoes.slice(paginaAtual * SUGESTOES_POR_PAGINA, paginaAtual * SUGESTOES_POR_PAGINA + SUGESTOES_POR_PAGINA)

  return (
    <>
      <BackToSite />
      <main className="cartPage">
        <div className="cartLayout">

          {/* ─── COLUNA ESQUERDA ─── */}
          <div className="cartMain">
            <div className="cartMainHead">
              <h1 className="cartTitle">
                <ShoppingCart size={22} />
                Carrinho
                {lines.length > 0 && <span className="cartCount">{totalQty} itens</span>}
              </h1>
              {lines.length > 0 && (
                <button className="cartClearBtn" onClick={clearCart}>
                  <Trash2 size={14} />
                  Limpar
                </button>
              )}
            </div>

            <EstoqueAviso itens={semEstoque} />

            {/* ── BARRAS DE PROGRESSO DUPLAS ── */}
            {lines.length > 0 && (
              <div className="cartProgressCards">
                {/* Barra 1: Próximo desconto */}
                {nextTier ? (
                  <div className="cartProgressCard">
                    <div className="cartProgressCardHead">
                      <span className="cartProgressIcon">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/etiqueta-promo-icon.png" alt="" aria-hidden="true" /></span>
                      <div>
                        <strong>Próximo desconto</strong>
                        <span>Adicione <strong>{nextTier.diff} un.</strong> para {formatCurrency(nextTier.nextPrice)}/un.</span>
                      </div>
                    </div>
                    <div className="cartProgressBar">
                      <div className="cartProgressFill cartProgressFillDiscount" style={{ width: `${tierProgress}%` }} />
                    </div>
                    <p className="cartProgressLabel">
                      <span className="cartProgressBadge cartProgressBadgePurple">{nextTier.diff} unidades restantes</span>
                    </p>
                  </div>
                ) : (
                  <div className="cartProgressCard cartProgressCardDone">
                    <span className="cartProgressIcon">✅</span>
                    <strong>Melhor desconto por volume atingido!</strong>
                  </div>
                )}

                {/* Barra 2: Frete grátis */}
                {freteGratis ? (
                  <div className="cartProgressCard cartProgressCardDone">
                    <span className="cartProgressIcon">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/icone-caminhao.png" alt="" aria-hidden="true" /></span>
                    <strong>Frete grátis conquistado!</strong>
                  </div>
                ) : (
                  <div className="cartProgressCard">
                    <div className="cartProgressCardHead">
                      <span className="cartProgressIcon">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/icone-caminhao.png" alt="" aria-hidden="true" /></span>
                      <div>
                        <strong>Frete grátis</strong>
                        <span>Faltam <strong>{formatCurrency(FRETE_GRATIS - subtotal)}</strong></span>
                      </div>
                    </div>
                    <div className="cartProgressBar">
                      <div className="cartProgressFill cartProgressFillShipping" style={{ width: `${freteProgress}%` }} />
                    </div>
                    <p className="cartProgressLabel">
                      <span className="cartProgressBadge cartProgressBadgeGreen">
                        {Math.round(freteProgress)}% concluído
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {lines.length === 0 ? (
              <div className="cartEmpty">
                <ShoppingCart size={48} />
                <h2>Seu carrinho está vazio</h2>
                <p>Adicione produtos para continuar</p>
                <a href="/" className="cartEmptyBtn">Ver produtos</a>
              </div>
            ) : (
              <div className="cartItems">
                {lines.map(({ product, variation, quantity, tier, total, economiaTotal }) => {
                  const nextProductTier = variation.tiers.find(t => t.minQty > quantity)
                  const prevTierIdx = variation.tiers.findIndex(t => t.minQty === tier.minQty)
                  const prevMin = variation.tiers[prevTierIdx]?.minQty ?? 1
                  const nextMin = nextProductTier?.minQty ?? quantity
                  const itemProgress = nextProductTier
                    ? Math.min(((quantity - prevMin) / (nextMin - prevMin)) * 100, 100)
                    : 100

                  return (
                    <div key={variation.sku} className={`cartItem ${variation.sku === recemAdicionado ? 'cartItemFlash' : ''}`}>
                      {/* Imagem */}
                      <a href={`/${product.slug}`} className="cartItemImg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImageSrc(variation.sku, product.prefix)}
                          alt={product.name}
                          onError={handleProductImageError(variation.sku, product.prefix)}
                        />
                      </a>

                      {/* Info */}
                      <div className="cartItemInfo">
                        <a href={`/${product.slug}`} className="cartItemName">{product.name}</a>
                        {variation.label !== product.name && (
                          <span className="cartItemVariant">{variation.label}</span>
                        )}
                        <span className="cartItemSku">{variation.sku}</span>

                        {/* Tiers */}
                        <div className="cartItemTiers">
                          {variation.tiers.map(t => (
                            <span
                              key={t.minQty}
                              className={`cartItemTierBadge ${t.minQty === tier.minQty ? 'active' : ''}`}
                            >
                              {t.label}+ → {formatCurrency(t.price)}
                            </span>
                          ))}
                        </div>

                        {/* Mini barra de progresso do item */}
                        {nextProductTier && (
                          <div className="cartItemProgress">
                            <div className="cartItemProgressBar">
                              <div className="cartItemProgressFill" style={{ width: `${itemProgress}%` }} />
                            </div>
                            <span>+{nextProductTier.minQty - quantity} un. → {formatCurrency(nextProductTier.price)}/un.</span>
                          </div>
                        )}

                        {economiaTotal > 0.01 && (
                          <span className="cartItemEconomia">
                            Você economizou {formatCurrency(economiaTotal)} neste item
                          </span>
                        )}
                      </div>

                      {/* Controles */}
                      <div className="cartItemControls">
                        <div className="cartItemQty">
                          <button
                            onClick={() => updateQuantity(variation.sku, Math.max(0, quantity - 1))}
                            aria-label="Diminuir"
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={e => updateQuantity(variation.sku, Math.max(0, Number(e.target.value)))}
                          />
                          <button
                            onClick={() => updateQuantity(variation.sku, quantity + 1)}
                            aria-label="Aumentar"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <strong className="cartItemTotal">{formatCurrency(total)}</strong>
                        <button
                          className="cartItemRemove"
                          onClick={() => updateQuantity(variation.sku, 0)}
                          aria-label="Remover"
                        >
                          <Trash2 size={14} />
                          Remover
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── CROSS-SELL ── */}
            {lines.length > 0 && (
              <div className="cartSugestoes">
                <div className="cartSugestoesHead">
                  <div>
                    <h2 className="cartSugestoesTitle">Complete seu pedido</h2>
                    <p className="cartSugestoesSubtitle">Clientes que compraram esses produtos também levaram:</p>
                  </div>
                  <div className="cartSugestoesNav">
                    <button
                      type="button"
                      aria-label="Sugestões anteriores"
                      disabled={paginaAtual === 0}
                      onClick={() => { setSugDirecao(-1); setSugPagina(p => Math.max(0, p - 1)) }}
                    >‹</button>
                    <button
                      type="button"
                      aria-label="Mais sugestões"
                      disabled={paginaAtual >= totalPaginasSug - 1}
                      onClick={() => { setSugDirecao(1); setSugPagina(p => Math.min(totalPaginasSug - 1, p + 1)) }}
                    >›</button>
                  </div>
                </div>
                {/* key pela página: cada troca remonta o grid e dispara o deslize */}
                <div key={paginaAtual} className={`cartSugestoesGrid ${sugDirecao === 1 ? 'sugEntraDir' : 'sugEntraEsq'}`}>
                  {sugestoes.map(p => {
                    const lowestPrice = Math.min(...p.variations.flatMap(v => v.tiers.map(t => t.price)))
                    const saindo = sugestaoSaindo.has(p.prefix)
                    return (
                      <a key={p.prefix} href={`/${p.slug}`} className={`cartSugestaoCard ${saindo ? 'cartSugestaoSaindo' : ''}`}>
                        <div className="cartSugestaoImg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={productImageSrc(p.variations[0].sku, p.prefix)}
                            alt={p.name}
                            onError={handleProductImageError(p.variations[0].sku, p.prefix)}
                          />
                        </div>
                        <div className="cartSugestaoInfo">
                          <p className="cartSugestaoCategoria">{p.category}</p>
                          <p className="cartSugestaoNome">{p.name}</p>
                          <p className="cartSugestaoPreco">
                            a partir de <strong>{formatCurrency(lowestPrice)}</strong>
                          </p>
                        </div>
                        {/* Botão de verdade: adiciona AQUI no carrinho, sem sair da página */}
                        <button
                          type="button"
                          className={`cartSugestaoBtn ${saindo ? 'cartSugestaoBtnOk' : ''}`}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adicionarSugestao(p.prefix, p.variations[0].sku) }}
                        >
                          {saindo ? '✓ Adicionado!' : '+ Adicionar'}
                        </button>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─── SIDEBAR ─── */}
          {lines.length > 0 && (
            <aside className="cartSidebar">
              <div className="cartSidebarCard">
                <h2 className="cartSidebarTitle">Resumo do pedido</h2>

                <div className="cartSidebarLines">
                  {lines.map(({ product, variation, quantity, total }) => (
                    <div key={variation.sku} className="cartSidebarLine">
                      <span className="cartSidebarThumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImageSrc(variation.sku)}
                          alt=""
                          loading="lazy"
                          onError={handleProductImageError(variation.sku)}
                        />
                      </span>
                      <span className="cartSidebarLineInfo">
                        <span className="cartSidebarLineNome">
                          {product.name}
                          {variation.label !== product.name && ` · ${variation.label}`}
                        </span>
                        <span className="cartSidebarLineQtd">Quantidade: <b>{quantity}</b></span>
                      </span>
                      <strong>{formatCurrency(total)}</strong>
                    </div>
                  ))}
                </div>

                <div className="cartSidebarDivider" />

                <div className="cartSidebarRow">
                  <span>Subtotal ({totalQty} un.)</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                {totalEconomia > 0.01 && (
                  <div className="cartSidebarRow cartSidebarEconomia">
                    <span>Desconto por volume</span>
                    <strong>− {formatCurrency(totalEconomia)}</strong>
                  </div>
                )}

                {descPercent > 0 && (
                  <div className="cartSidebarRow cartSidebarEconomia">
                    <span>Desconto ({descPercent}%)</span>
                    <strong>− {formatCurrency(descValor)}</strong>
                  </div>
                )}

                <div className="cartSidebarRow cartSidebarFrete">
                  <span>Frete</span>
                  <span>{freteGratis ? <span className="cartFreteGratisTag">Grátis 🚚</span> : 'A calcular'}</span>
                </div>

                <div className="cartSidebarDivider" />

                <div className="cartSidebarRow cartSidebarTotal">
                  <span>Total</span>
                  <strong>{formatCurrency(totalComDesc)}</strong>
                </div>

                {/* Desconto real de 3% pagando com Pix (aplicado no checkout) */}
                <div className="cartSidebarRow cartSidebarPixRow">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pagamento-pix.png" alt="" aria-hidden="true" style={{ height: 15, width: 15 }} />
                    No Pix ({PIX_DESCONTO_PERCENT}% off)
                  </span>
                  <strong className="cartSidebarPixValue">{formatCurrency(pixSubtotal)}</strong>
                </div>

                {semEstoque.length > 0 ? (
                  <span className="cartSidebarCheckout cartSidebarCheckoutOff" aria-disabled="true">
                    Ajuste o estoque para continuar
                  </span>
                ) : (
                  <a href="/checkout" className="cartSidebarCheckout">
                    Finalizar compra →
                  </a>
                )}

                {/* Segurança + logos de pagamento */}
                <div className="cartSecurePay">
                  <span className="cartSecureLabel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Ambiente 100% seguro
                  </span>
                  <div className="cartPayLogos">
                    {/* Visa */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://logospng.org/download/visa/logo-visa-2048.png" alt="Visa" className="cartPayLogoImg" />
                    {/* Mastercard */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://logospng.org/download/mastercard/logo-mastercard-1024.png" alt="Mastercard" className="cartPayLogoImg" />
                    {/* Elo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/elo-icon.png" alt="Elo" className="cartPayLogoImg" />
                    {/* Pix */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://logospng.org/download/pix/logo-pix-icone-512.png" alt="Pix" className="cartPayLogoImg" />
                    {/* Boleto (mesmo ícone do checkout) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pagamento-boleto.png" alt="Boleto" className="cartPayLogoImg" />
                  </div>
                </div>

                <a href="/" className="cartSidebarContinue">
                  ← Continuar comprando
                </a>

                {/* Selos de confiança */}
                {/* eslint-disable @next/next/no-img-element */}
                <div className="cartTrust">
                  <div className="cartTrustItem"><img src="/icone-nf.png" alt="" aria-hidden="true" className="cartTrustIco" /><span>Nota Fiscal</span></div>
                  <div className="cartTrustItem"><img src="/icone-shield.png" alt="" aria-hidden="true" className="cartTrustIco" /><span>Compra Segura</span></div>
                  <div className="cartTrustItem"><img src="/icone-caminhao.png" alt="" aria-hidden="true" className="cartTrustIco" /><span>Entrega Nacional</span></div>
                  <div className="cartTrustItem"><img src="/icon-zapzap.png" alt="" aria-hidden="true" className="cartTrustIco cartTrustIcoZap" /><span>Suporte WhatsApp</span></div>
                </div>
                {/* eslint-enable @next/next/no-img-element */}
              </div>
            </aside>
          )}
        </div>
      </main>
    </>
  )
}
