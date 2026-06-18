import { products, type Tier } from "@/lib/data";

export function getTierForQuantity(tiers: Tier[], qty: number): Tier {
  let best = tiers[0];
  for (const tier of tiers) {
    if (qty >= tier.minQty) best = tier;
  }
  return best;
}

// ---- Frete grátis e desconto por valor do carrinho ----

// Frete grátis a partir deste valor de carrinho (R$)
export const FRETE_GRATIS_MIN = 199;

// Desconto aplicado sobre o subtotal conforme o valor total do carrinho.
// Maior para menor (a primeira faixa atingida vence).
const DESCONTO_TIERS = [
  { min: 400, percent: 5 },
  { min: 200, percent: 4 },
  { min: 100, percent: 3 },
  { min: 50, percent: 2 },
];

// Maior desconto possível e o valor de carrinho necessário para atingi-lo
export const DESCONTO_MAX_PERCENT = 5;
export const DESCONTO_MAX_MIN = 400;

// Retorna a % de desconto (0, 2, 3, 4 ou 5) para um dado subtotal
export function descontoCarrinhoPercent(subtotal: number): number {
  for (const t of DESCONTO_TIERS) {
    if (subtotal >= t.min) return t.percent;
  }
  return 0;
}

// Soma o subtotal do carrinho (já com o preço de atacado por quantidade)
export function getCartSubtotal(cart: Record<string, number>): number {
  let s = 0;
  for (const p of products) {
    for (const v of p.variations) {
      const q = cart[v.sku];
      if (q && q > 0) s += getTierForQuantity(v.tiers, q).price * q;
    }
  }
  return s;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export function getMaxDiscount(tiers: Tier[]): number {
  if (tiers.length < 2) return 0;
  const max = tiers[0].price;
  const min = tiers[tiers.length - 1].price;
  return Math.round(((max - min) / max) * 100);
}

export function getTierRangeLabel(tiers: Tier[], index: number): string {
  const current = tiers[index];
  const next = tiers[index + 1];
  return next ? `${current.minQty}–${next.minQty - 1} un.` : `${current.minQty}+ un.`;
}
