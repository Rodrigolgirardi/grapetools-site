'use client'

import "./cart.css"
import { useState, useMemo } from 'react'
import { products } from '@/lib/data'
import { formatCurrency, getTierForQuantity } from '@/lib/pricing'
import { useCart } from '@/hooks/useCart'
import { productImageSrc, handleProductImageError } from '@/lib/product-image'
import { BackToSite } from '@/components/BackToSite'
import { Minus, Plus, Trash2, ShoppingCart, Shield, FileText, Truck, MessageCircle } from 'lucide-react'

const FRETE_GRATIS = 199

export default function CartPage() {
  const { cart, updateQuantity, clearCart } = useCart()
  const [cupom, setCupom] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState(false)
  const [cupomErro, setCupomErro] = useState('')

  function aplicarCupom() {
    if (!cupom.trim()) { setCupomErro('Digite um cupom válido.'); return }
    setCupomErro('')
    setCupomAplicado(false)
    setCupomErro('Cupom inválido ou expirado.')
  }

  const lines = products.flatMap(p =>
    p.variations
      .filter(v => cart[v.sku])
      .map(v => {
        const quantity = cart[v.sku]
        const tier = getTierForQuantity(v.tiers, quantity)
        // Economia vs. preço do tier mais caro (menor quantidade)
        const maxPrice = v.tiers[0].price
        const economiaUnit = maxPrice - tier.price
        const economiaTotal = economiaUnit * quantity
        return { product: p, variation: v, quantity, tier, total: tier.price * quantity, economiaTotal }
      })
  )

  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0)
  const totalEconomia = lines.reduce((s, l) => s + l.economiaTotal, 0)
  const pixSubtotal = subtotal // desconto Pix quando implementado

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
  const sugestoes = useMemo(() => {
    const cartPrefixes = new Set(lines.map(l => l.product.prefix))
    const cartCategories = new Set(lines.map(l => l.product.category))
    // Prioriza mesma categoria, depois qualquer produto
    const sameCategory = products.filter(p => !cartPrefixes.has(p.prefix) && cartCategories.has(p.category))
    const others = products.filter(p => !cartPrefixes.has(p.prefix) && !cartCategories.has(p.category))
    return [...sameCategory, ...others].slice(0, 5)
  }, [lines.length])

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

            {/* ── BARRAS DE PROGRESSO DUPLAS ── */}
            {lines.length > 0 && (
              <div className="cartProgressCards">
                {/* Barra 1: Próximo desconto */}
                {nextTier ? (
                  <div className="cartProgressCard">
                    <div className="cartProgressCardHead">
                      <span className="cartProgressIcon">🏷️</span>
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
                    <span className="cartProgressIcon">🚚</span>
                    <strong>Frete grátis conquistado!</strong>
                  </div>
                ) : (
                  <div className="cartProgressCard">
                    <div className="cartProgressCardHead">
                      <span className="cartProgressIcon">🚚</span>
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
                    <div key={variation.sku} className="cartItem">
                      {/* Imagem */}
                      <a href={`/${product.slug}`} className="cartItemImg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImageSrc(variation.sku)}
                          alt={product.name}
                          onError={handleProductImageError(variation.sku)}
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
                <h2 className="cartSugestoesTitle">Complete seu pedido</h2>
                <p className="cartSugestoesSubtitle">Clientes que compraram esses produtos também levaram:</p>
                <div className="cartSugestoesGrid">
                  {sugestoes.map(p => {
                    const lowestPrice = Math.min(...p.variations.flatMap(v => v.tiers.map(t => t.price)))
                    return (
                      <a key={p.prefix} href={`/${p.slug}`} className="cartSugestaoCard">
                        <div className="cartSugestaoImg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={productImageSrc(p.variations[0].sku)}
                            alt={p.name}
                            onError={handleProductImageError(p.variations[0].sku)}
                          />
                        </div>
                        <div className="cartSugestaoInfo">
                          <p className="cartSugestaoCategoria">{p.category}</p>
                          <p className="cartSugestaoNome">{p.name}</p>
                          <p className="cartSugestaoPreco">
                            a partir de <strong>{formatCurrency(lowestPrice)}</strong>
                          </p>
                        </div>
                        <span className="cartSugestaoBtn">+ Adicionar</span>
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
                      <span>
                        {product.name}
                        {variation.label !== product.name && ` · ${variation.label}`}
                        <em> ×{quantity}</em>
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

                <div className="cartSidebarRow cartSidebarFrete">
                  <span>Frete</span>
                  <span>{freteGratis ? <span className="cartFreteGratisTag">Grátis 🚚</span> : 'A calcular'}</span>
                </div>

                <div className="cartSidebarDivider" />

                <div className="cartSidebarRow cartSidebarTotal">
                  <span>Total</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                <div className="cartSidebarRow cartSidebarPixRow">
                  <span>⚡ Pagando com Pix</span>
                  <strong className="cartSidebarPixValue">{formatCurrency(pixSubtotal)}</strong>
                </div>

                {/* Economizou destaque */}
                {totalEconomia > 0.01 && (
                  <div className="cartEconomiaDestaque">
                    <span>🎉</span>
                    <div>
                      <strong>Você economizou {formatCurrency(totalEconomia)}</strong>
                      <span>com desconto por volume</span>
                    </div>
                  </div>
                )}

                {/* Cupom */}
                <div className="cartCupomWrap">
                  <label className="cartCupomLabel">Cupom de desconto</label>
                  <div className="cartCupomRow">
                    <input
                      type="text"
                      className="cartCupomInput"
                      placeholder="Digite seu cupom"
                      value={cupom}
                      onChange={e => { setCupom(e.target.value.toUpperCase()); setCupomErro(''); setCupomAplicado(false) }}
                      onKeyDown={e => e.key === 'Enter' && aplicarCupom()}
                    />
                    <button className="cartCupomBtn" onClick={aplicarCupom}>Aplicar</button>
                  </div>
                  {cupomErro && <p className="cartCupomErro">⚠ {cupomErro}</p>}
                  {cupomAplicado && <p className="cartCupomSucesso">✓ Cupom aplicado!</p>}
                </div>

                <a href="/checkout" className="cartSidebarCheckout">
                  Finalizar compra →
                </a>

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
                    {/* Elo — badge estilizado */}
                    <span className="cartPayLogoElo">elo</span>
                    {/* Pix */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://logospng.org/download/pix/logo-pix-icone-512.png" alt="Pix" className="cartPayLogoImg" />
                    {/* Boleto — SVG com barras reais + label */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 44" className="cartPayLogoImg" style={{height:'24px',width:'auto'}}>
                      <rect x="2"  y="0" width="5" height="34" fill="#1a1a1a"/>
                      <rect x="9"  y="0" width="2" height="34" fill="#1a1a1a"/>
                      <rect x="13" y="0" width="4" height="34" fill="#1a1a1a"/>
                      <rect x="19" y="0" width="2" height="34" fill="#1a1a1a"/>
                      <rect x="23" y="0" width="6" height="34" fill="#1a1a1a"/>
                      <rect x="31" y="0" width="2" height="34" fill="#1a1a1a"/>
                      <rect x="35" y="0" width="5" height="34" fill="#1a1a1a"/>
                      <rect x="42" y="0" width="2" height="34" fill="#1a1a1a"/>
                      <rect x="46" y="0" width="4" height="34" fill="#1a1a1a"/>
                      <rect x="52" y="0" width="6" height="34" fill="#1a1a1a"/>
                      <rect x="60" y="0" width="2" height="34" fill="#1a1a1a"/>
                      <rect x="64" y="0" width="5" height="34" fill="#1a1a1a"/>
                      <rect x="71" y="0" width="2" height="34" fill="#1a1a1a"/>
                      <rect x="75" y="0" width="3" height="34" fill="#1a1a1a"/>
                      <text x="40" y="43" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="9" fill="#1a1a1a">BOLETO</text>
                    </svg>
                  </div>
                </div>

                <a href="/" className="cartSidebarContinue">
                  ← Continuar comprando
                </a>

                {/* Selos de confiança */}
                <div className="cartTrust">
                  <div className="cartTrustItem"><FileText size={13} /><span>Nota Fiscal</span></div>
                  <div className="cartTrustItem"><Shield size={13} /><span>Compra Segura</span></div>
                  <div className="cartTrustItem"><Truck size={13} /><span>Entrega Nacional</span></div>
                  <div className="cartTrustItem"><MessageCircle size={13} /><span>Suporte WhatsApp</span></div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </>
  )
}
