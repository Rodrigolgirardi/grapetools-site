"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { ChevronDown, ChevronUp, CreditCard, Smartphone } from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductVisual } from "@/components/ProductVisual";
import { SimilarProducts } from "@/components/SimilarProducts";
import { products } from "@/lib/data";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/pricing";
import { productJsonLd } from "@/lib/seo";
import { FreteCalc } from "@/components/FreteCalc";

type Props = { params: Promise<{ slug: string }> };

function calcInstallment(price: number, n: number): number {
  if (n <= 3) return price / n;
  return (price * (1 + 0.02 * n)) / n;
}

function PaymentBlock({ basePrice }: { basePrice: number }) {
  const [open, setOpen] = useState(false);
  const installments = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const monthly = calcInstallment(basePrice, n);
    return { n, monthly, total: monthly * n, hasInterest: n > 3 };
  });

  return (
    <div className="paymentBlock">
      <div className="pixRow">
        <Smartphone size={16} style={{ color: "#16a34a", flexShrink: 0 }} />
        <span className="pixLabel">Pix</span>
        <strong className="pixPrice">{formatCurrency(basePrice)}</strong>
        <span className="pixNote">à vista</span>
      </div>
      <div className="paymentDivider" />
      <button className="cardAccordionBtn" onClick={() => setOpen(!open)}>
        <div className="cardAccordionLeft">
          <CreditCard size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
          <div>
            <span className="cardLabel">Cartão de crédito</span>
            <span className="cardBest">em até 3x de {formatCurrency(basePrice / 3)} sem juros</span>
          </div>
        </div>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="installmentList">
          <div className="installmentGrid">
            {[0,1,2,3,4,5].map((i) => (
              <>
                <div key={installments[i].n} className={`installmentRow ${!installments[i].hasInterest ? "noInterest" : ""}`}>
                  <span className="installmentN">{installments[i].n}x</span>
                  <span className="installmentMonthly">
                    de {formatCurrency(installments[i].monthly)}
                    {!installments[i].hasInterest ? <em className="green"> sem juros</em> : <em> com juros</em>}
                  </span>
                </div>
                <div key={installments[i+6].n} className={`installmentRow ${!installments[i+6].hasInterest ? "noInterest" : ""}`}>
                  <span className="installmentN">{installments[i+6].n}x</span>
                  <span className="installmentMonthly">
                    de {formatCurrency(installments[i+6].monthly)}
                    {!installments[i+6].hasInterest ? <em className="green"> sem juros</em> : <em> com juros</em>}
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Gera nota e avaliações determinísticas (sempre iguais para o mesmo produto)
function getRating(prefix: string): { nota: string; avaliacoes: number; vendidos: number } {
  let hash = 0
  for (let i = 0; i < prefix.length; i++) {
    hash = (hash * 31 + prefix.charCodeAt(i)) >>> 0
  }
  // Nota entre 4.8 e 4.9
  const nota = (4.8 + (hash % 2) * 0.1).toFixed(1).replace('.', ',')
  // Avaliações entre 80 e 350
  const avaliacoes = 80 + (hash % 271)
  // Vendidos entre 5.000 e 25.000
  const vendidos = 5000 + (hash % 20001)
  return { nota, avaliacoes, vendidos }
}

function StarRating() {
  return (
    <span className="ratingStars" aria-hidden="true">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  )
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [fichaOpen, setFichaOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const variation = product.variations[selectedIdx];
  const basePrice = variation.tiers[0].price;
  const rating = getRating(product.prefix);
  const { addToCart, cart } = useCart();
  const cartCountFromHook = Object.values(cart).reduce((s, q) => s + q, 0);

  useEffect(() => {
    const saved = localStorage.getItem("grapetools_favoritos");
    if (saved) setIsFav(JSON.parse(saved).includes(product!.prefix));
  }, [product]);

  function toggleFav() {
    const saved = localStorage.getItem("grapetools_favoritos");
    const current: string[] = saved ? JSON.parse(saved) : [];
    const next = isFav
      ? current.filter((id) => id !== product!.prefix)
      : [...current, product!.prefix];
    localStorage.setItem("grapetools_favoritos", JSON.stringify(next));
    setIsFav(!isFav);
    window.dispatchEvent(new StorageEvent("storage", { key: "grapetools_favoritos", newValue: JSON.stringify(next) }));
  }

  return (
    <>
      <Header
        cartCount={cartCountFromHook}
        onSearch={(term) => { if (term) window.location.href = `/?q=${encodeURIComponent(term)}`; }}
        onCartOpen={() => window.location.href = "/cart"}
      />

      {/* Barra de categorias — igual à home */}
      <nav className="categoryBar">
        <div className="categoryBarInner">
          <a href="/?categoria=Ferragens"   className="catPill">Ferragens</a>
          <a href="/?categoria=Abrasivos"   className="catPill">Abrasivos</a>
          <a href="/?categoria=Elétrica"    className="catPill">Elétrica</a>
          <a href="/?categoria=Fixação"     className="catPill">Fixação</a>
          <a href="/?categoria=Ferramentas" className="catPill">Ferramentas</a>
          <a href="/?categoria=Utilidades"  className="catPill">Utilidades</a>
        </div>
      </nav>
      <main className="productDetail">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
        />

        <section className="detailHero">
          {/* COL 1 — GALERIA */}
          <div className="detailGallery">
            <div className="detailThumbs">
              {product.variations.map((v, i) => (
                <button
                  key={v.sku}
                  className={`detailThumb ${selectedIdx === i ? "active" : ""}`}
                  onClick={() => setSelectedIdx(i)}
                  aria-label={v.label}
                >
                  <ProductVisual product={product} sku={v.sku} />
                </button>
              ))}
              {product.variations.length === 1 && (
                <div className="detailThumb active">
                  <ProductVisual product={product} sku={product.variations[0].sku} />
                </div>
              )}
            </div>
            <div className="detailMainPhoto">
              <ProductVisual product={product} sku={variation.sku} />
            </div>
          </div>

          {/* COL 2 — INFO */}
          <div>
            <span className="eyebrow">{product.category} / {product.subcategory}</span>
            <div className="detailTitleRow">
              <h1>{product.name}</h1>
            </div>

            <div className="detailRating">
              <StarRating />
              <strong>{rating.nota}</strong>
              <span>({rating.avaliacoes} avaliações)</span>
              <span className="detailRatingDivider">|</span>
              <span>+{rating.vendidos.toLocaleString('pt-BR')} unidades vendidas</span>
            </div>

            {product.variations.length > 1 && (
              <div style={{ margin: "16px 0" }}>
                <label className="variantLabel">VARIAÇÃO</label>
                <select
                  value={selectedIdx}
                  onChange={(e) => setSelectedIdx(Number(e.target.value))}
                  className="variantSelectLarge"
                >
                  {product.variations.map((v, i) => (
                    <option key={v.sku} value={i}>{v.label}</option>
                  ))}
                </select>
              </div>
            )}

            <PaymentBlock basePrice={basePrice} />

            <div className="fichaAccordion">
              <button className="fichaAccordionBtn" onClick={() => setFichaOpen(!fichaOpen)}>
                <span>Ficha Técnica</span>
                {fichaOpen ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
              </button>
              {fichaOpen && (
                <dl className="specGrid">
                  <div><dt>Marca</dt><dd>{product.brand}</dd></div>
                  <div><dt>Tamanho</dt><dd>{product.tamanho || variation.label || "—"}</dd></div>
                  <div><dt>Material</dt><dd>{product.material || "—"}</dd></div>
                  <div><dt>Uso indicado</dt><dd>{product.usoIndicado || "—"}</dd></div>
                  <div><dt>Compatível com</dt><dd>{product.compativelCom || "—"}</dd></div>
                </dl>
              )}
            </div>

            <div className="productDescBlock">
              <h3 className="productDescTitle">Descrição do produto</h3>
              <p className="productDetailDesc">
                {product.name} — {product.category} · {product.subcategory}.
                Fornecido por <strong>{product.supplier}</strong>, marca <strong>{product.brand}</strong>.
                {product.variations.length > 1 && (
                  <> Disponível em {product.variations.length} variações: {product.variations.map(v => v.label).join(", ")}.</>
                )}
                {" "}Compre com desconto progressivo: quanto maior a quantidade, menor o preço por unidade.
              </p>
            </div>
          </div>

          {/* COL 3 — CTA */}
          <aside className="detailBuy">
            <div className="detailPrice">
              <span className="detailPriceFrom">A partir de</span>
              <div className="detailPriceRow">
                <strong className="detailPriceValue">{formatCurrency(variation.tiers[variation.tiers.length - 1].price)}</strong>
                <button
                  className={`detailFavBtn ${isFav ? "active" : ""}`}
                  onClick={toggleFav}
                  aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  title={isFav ? "Remover dos favoritos" : "Salvar nos favoritos"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
              </div>
              <span className="detailPriceNote">em 500+ unidades</span>
            </div>

            <div className="detailQtyRow">
              <label className="detailQtyLabel">Quantidade</label>
              <div className="detailQtyControl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                />
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <span className="stockDot">● Em estoque</span>

            <button className="detailBtnPrimary" onClick={() => { addToCart(variation.sku, qty); window.location.href = "/checkout"; }}>Comprar agora</button>
            <button className="detailBtnSecondary" onClick={() => { addToCart(variation.sku, qty); window.location.href = "/cart"; }}>Adicionar ao carrinho</button>

            <div className="detailTrustRow">
              <span>✓ Nota fiscal emitida</span>
              <span>✓ Entrega para todo Brasil</span>
            </div>

            <div className="detailGuarantees">
              <div className="detailGuaranteeItem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span><a href="/trocas-e-devolucoes" className="detailGuaranteeLink">Devolução Grátis</a>: Você tem 7 dias a partir da data de recebimento.</span>
              </div>
              <div className="detailGuaranteeItem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span><a href="/trocas-e-devolucoes" className="detailGuaranteeLink">Compra Segura</a>: Receba o produto que está esperando ou devolvemos o dinheiro.</span>
              </div>
            </div>

            <FreteCalc subtotal={variation.tiers[variation.tiers.length - 1].price * qty} />
          </aside>
        </section>
      </main>

      {/* ── PRODUTOS SIMILARES ────────────────────────────────── */}
      <SimilarProducts currentSlug={product.slug} category={product.category} />

      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
