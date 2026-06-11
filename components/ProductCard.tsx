"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { formatCurrency, getMaxDiscount } from "@/lib/pricing";
import { ProductVisual } from "./ProductVisual";

type Props = { product: Product; onAdd: (product: Product, sku: string, qty: number) => void; };

export function ProductCard({ product, onAdd }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const variation = product.variations[selectedIdx];
  const bestPrice = variation.tiers[variation.tiers.length - 1].price;
  const discount = getMaxDiscount(variation.tiers);
  const hasVariations = product.variations.length > 1;
  const isMarcaPropria = product.brand === "Grape Tools";

  const badge = product.isPromotion
    ? { label: "OFERTA", className: "badgeOferta" }
    : product.isLaunch
    ? { label: "LANÇAMENTO", className: "badgeLancamento" }
    : product.sold > 50
    ? { label: "MAIS VENDIDO", className: "badgeMaisVendido" }
    : null;

  return (
    <article className="productCard">
      {/* FOTO — 65% do card */}
      <a href={`/${product.slug}`} aria-label={`Ver ${product.name}`} className="productThumb">
        <ProductVisual product={product} sku={variation.sku} />
        {badge && <span className={`productBadge ${badge.className}`}>{badge.label}</span>}
        {discount > 0 && <span className="productDiscount">ATÉ {discount}% OFF</span>}
        {isMarcaPropria && <span className="marcaPropriaDot" title="Marca Própria Grape Tools">MP</span>}
      </a>

      {/* INFO — 35% do card */}
      <div className="productInfo">
        <a className="productName" href={`/${product.slug}`}>{product.name}</a>

        <div className="tierPreview">
          <strong className="tierPrice">{formatCurrency(bestPrice)}</strong>
          <span className="tierNote">/ 500+ un.</span>
        </div>

        {hasVariations && (
          <select
            className="variantSelect"
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
          >
            {product.variations.map((v, i) => (
              <option key={v.sku} value={i}>{v.label}</option>
            ))}
          </select>
        )}

        <div className="cardQtyRow">
          <div className="cardQtyControl">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir">
              <Minus size={12} />
            </button>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            />
            <button onClick={() => setQty(q => q + 1)} aria-label="Aumentar">
              <Plus size={12} />
            </button>
          </div>
        </div>

        <button className="addButton" onClick={() => onAdd(product, variation.sku, qty)}>
          Adicionar
        </button>
      </div>
    </article>
  );
}
