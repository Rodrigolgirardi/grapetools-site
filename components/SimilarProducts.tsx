"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductVisual } from "@/components/ProductVisual";
import { products, Product } from "@/lib/data";
import { formatCurrency } from "@/lib/pricing";

interface SimilarProductsProps {
  currentSlug: string;
  category: string;
}

const VISIBLE = 5; // cards visíveis por vez

export function SimilarProducts({ currentSlug, category }: SimilarProductsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const similar: Product[] = products.filter(
    (p) => p.category === category && p.slug !== currentSlug
  );

  const totalPages = Math.ceil(similar.length / VISIBLE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goTo = useCallback((nextPage: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".simCard") as HTMLElement;
    if (!card) return;
    const cardW = card.offsetWidth + 16; // 16 = gap
    el.scrollTo({ left: nextPage * VISIBLE * cardW, behavior: "smooth" });
    setPage(nextPage);
  }, []);

  // Sincroniza page com scroll manual (arrastar no mobile)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    function onScroll() {
      const card = el!.querySelector(".simCard") as HTMLElement;
      if (!card) return;
      const cardW = card.offsetWidth + 16;
      const newPage = Math.round(el!.scrollLeft / (cardW * VISIBLE));
      setPage(newPage);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [similar]);

  if (similar.length === 0) return null;

  return (
    <section className="simSection">
      <div className="simHeader">
        <h2 className="simTitle">
          Produtos <span className="simTitleAccent">Similares</span>
        </h2>
        <div className="simNavRow">
          <button
            className="simNavBtn"
            onClick={() => goTo(page - 1)}
            disabled={!canPrev}
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="simNavBtn"
            onClick={() => goTo(page + 1)}
            disabled={!canNext}
            aria-label="Próximo"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="simTrack" ref={trackRef}>
        {similar.map((p) => {
          const lowestPrice =
            p.variations[0].tiers[p.variations[0].tiers.length - 1].price;
          const hasDiscount = p.isPromotion;

          return (
            <a key={p.slug} href={`/${p.slug}`} className="simCard">
              <div className="simCardImg">
                <ProductVisual product={p} sku={p.variations[0].sku} />
                {hasDiscount && <span className="simBadgeOff">OFERTA</span>}
                {p.isLaunch && !hasDiscount && (
                  <span className="simBadgeLaunch">NOVO</span>
                )}
                {p.brand === "Grape Tools" && (
                  <span className="simBadgeBrand">🏷 Marca Própria</span>
                )}
              </div>
              <div className="simCardBody">
                <span className="simCardSub">{p.subcategory}</span>
                <span className="simCardName">{p.name}</span>
                <div className="simCardPrices">
                  <span className="simCardFrom">a partir de</span>
                  <strong className="simCardPrice">
                    {formatCurrency(lowestPrice)}
                  </strong>
                  <span className="simCardNote">em 500+ un.</span>
                </div>
                {p.variations.length > 1 && (
                  <span className="simCardVars">
                    {p.variations.length} variações disponíveis
                  </span>
                )}
              </div>
              <div className="simCardFooter">
                <span className="simCardBtn">Ver produto</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Dots de paginação — só aparece se tiver mais de 1 página */}
      {totalPages > 1 && (
        <div className="simDots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`simDot ${i === page ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
