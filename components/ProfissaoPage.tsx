"use client";

import { useEffect, useState } from "react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { products, type Product } from "@/lib/data";
import { formatCurrency, getTierForQuantity, descontoCarrinhoPercent, DESCONTO_TIERS } from "@/lib/pricing";
import { SlidersHorizontal } from "lucide-react";

const PERFIS = {
  eletricista: {
    id: "eletricista",
    label: "Eletricista",
    emoji: "⚡",
    titulo: "A loja do eletricista",
    subtitulo: "Conectores, cabos, disjuntores, abraçadeiras e tudo que você precisa no dia a dia.",
    cor: "#1e3a5f",
    corAcento: "#3b82f6",
    categorias: ["Elétrica", "Fixação"],
    keywords: ["conector", "disjuntor", "cabo", "fio", "botao", "chicote", "abraçadeira"],
    destaques: ["Conectores", "Cabos e Fios", "Disjuntores", "Abraçadeiras"],
  },
  marceneiro: {
    id: "marceneiro",
    label: "Marceneiro",
    emoji: "🪵",
    titulo: "A loja do marceneiro",
    subtitulo: "Corrediças, dobradiças, puxadores, rodízios e suportes para móveis e instalações.",
    cor: "#3b1f0a",
    corAcento: "#d97706",
    categorias: ["Ferragens"],
    keywords: ["corredica", "dobradica", "puxador", "suporte", "trilho", "pe", "rodizio"],
    destaques: ["Corrediças", "Dobradiças", "Puxadores", "Rodízios"],
  },
} as const;

type PerfilId = keyof typeof PERFIS;

function ProfissaoPage({ perfilId }: { perfilId: PerfilId }) {
  const perfil = PERFIS[perfilId];
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"best" | "low" | "high">("best");
  const [cart, setCart] = useState<Record<string, number>>({});

  // Salvar profissão no localStorage
  useEffect(() => {
    localStorage.setItem("grapetools_profissao", perfilId);
  }, [perfilId]);

  const filteredProducts = products
    .filter((p) => {
      const text = [p.name, p.brand, p.supplier, p.prefix, ...p.keywords,
        ...p.variations.map((v) => v.sku)].join(" ").toLowerCase();
      const matchQuery = !query || text.includes(query.toLowerCase());
      const matchPerfil =
        perfil.categorias.includes(p.category as never) ||
        perfil.keywords.some((k) => text.includes(k));
      return matchQuery && matchPerfil;
    })
    .sort((a, b) => {
      const aPrice = a.variations[0].tiers[0].price;
      const bPrice = b.variations[0].tiers[0].price;
      if (sort === "low") return aPrice - bPrice;
      if (sort === "high") return bPrice - aPrice;
      return Number(b.isPromotion) - Number(a.isPromotion);
    });

  const cartLines = products.flatMap((p) =>
    p.variations.filter((v) => cart[v.sku]).map((v) => {
      const quantity = cart[v.sku];
      const tier = getTierForQuantity(v.tiers, quantity);
      return { product: p, variation: v, quantity, tier, total: tier.price * quantity };
    })
  );
  const cartTotal = cartLines.reduce((s, l) => s + l.total, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.quantity, 0);

  function addProduct(_p: Product, sku: string) {
    setCart((c) => ({ ...c, [sku]: (c[sku] ?? 0) + 1 }));
  }

  function updateQuantity(sku: string, qty: number) {
    setCart((c) => { const n = { ...c }; if (qty <= 0) delete n[sku]; else n[sku] = qty; return n; });
  }

  return (
    <>
      <Header cartCount={cartCount} onSearch={setQuery} />
      <main>

        {/* HERO DA PROFISSÃO */}
        <div className="profissaoHero" style={{
          background: `linear-gradient(110deg, ${perfil.cor} 0%, ${perfil.corAcento}88 100%)`
        }}>
          <div className="profissaoHeroInner">
            <div className="profissaoHeroContent">
              <span className="profissaoHeroBadge">Especializado para você</span>
              <h1 className="profissaoHeroTitle">
                <span>{perfil.emoji}</span> {perfil.titulo}
              </h1>
              <p className="profissaoHeroSub">{perfil.subtitulo}</p>
              <div className="profissaoHeroTags">
                {perfil.destaques.map((d) => (
                  <span key={d} className="profissaoHeroTag">{d}</span>
                ))}
              </div>
            </div>
            <div className="profissaoHeroStats">
              <div><strong>{filteredProducts.length}</strong><span>produtos</span></div>
              <div><strong>ATÉ 28%</strong><span>por volume</span></div>
              <div><strong>✓</strong><span>Nota fiscal</span></div>
            </div>
          </div>
        </div>

        {/* BREADCRUMB */}
        <div className="profissaoBreadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <span>{perfil.emoji} {perfil.label}</span>
        </div>

        {/* PRODUTOS */}
        <div className="profissaoShell">
          <div className="profissaoProductArea">
            <div className="sectionHead">
              <h2>Para {perfil.label}s <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--muted)" }}>— {filteredProducts.length} itens</span></h2>
              <select className="sortSelect" value={sort} onChange={(e) => setSort(e.target.value as never)}>
                <option value="best">Relevância</option>
                <option value="low">Menor preço</option>
                <option value="high">Maior preço</option>
              </select>
            </div>
            <div className="productGrid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.prefix} product={p} onAdd={addProduct} />
              ))}
            </div>
          </div>

          {/* CARRINHO */}
          <aside className="cartSummary">
            <div className="filterTitle">
              <SlidersHorizontal size={15} />
              <strong>Resumo do Pedido</strong>
            </div>
            <div className="discountMeter">
              <div className="discountCurrentLabel">
                <span>Bônus por valor do pedido</span>
                <strong className="discountCurrentPct">{descontoCarrinhoPercent(cartTotal)}%</strong>
              </div>
              {[...DESCONTO_TIERS].sort((a, b) => a.min - b.min).map((tier, i, arr) => {
                const prev = i === 0 ? 0 : arr[i - 1].min;
                const progress = Math.min(100, Math.max(0, ((cartTotal - prev) / (tier.min - prev)) * 100));
                const reached = cartTotal >= tier.min;
                return (
                  <div key={tier.min} className="progressTier">
                    <div className="progressTierLabel">
                      <span>{formatCurrency(tier.min)} → -{tier.percent}%</span>
                      {reached && <span className="progressReached">✓</span>}
                    </div>
                    <div className="progressBar">
                      <div className={`progressFill ${reached ? "reached" : ""}`} style={{ width: `${reached ? 100 : progress}%` }} />
                    </div>
                  </div>
                );
              })}
              {(() => {
                const proximo = [...DESCONTO_TIERS].sort((a, b) => a.min - b.min).find((t) => cartTotal < t.min);
                return proximo ? (
                  <p className="discountHint">
                    Faltam {formatCurrency(proximo.min - cartTotal)} para -{proximo.percent}% no pedido
                  </p>
                ) : null;
              })()}
            </div>
            {cartLines.length === 0 ? (
              <p className="muted" style={{ fontSize: "12px", textAlign: "center", padding: "8px 0" }}>
                Nenhum produto adicionado ainda.
              </p>
            ) : (
              <>
                {cartLines.map(({ product, variation, quantity, tier, total }) => (
                  <div className="cartLine" key={variation.sku}>
                    <strong>{product.name}</strong>
                    <span>{variation.label} · {tier.label}+ un. · {formatCurrency(tier.price)}</span>
                    <input type="number" min="0" value={quantity}
                      onChange={(e) => updateQuantity(variation.sku, Number(e.target.value))} />
                    <b>{formatCurrency(total)}</b>
                  </div>
                ))}
                <div className="checkoutBox">
                  <span>Frete</span><strong>A calcular</strong>
                  <span>Total</span><strong>{formatCurrency(cartTotal)}</strong>
                </div>
                <a className="primaryButton fullButton" href="/checkout">Finalizar compra</a>
              </>
            )}
          </aside>
        </div>

      </main>
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}

export default ProfissaoPage;
