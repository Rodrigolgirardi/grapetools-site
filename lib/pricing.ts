import type { Tier } from "@/lib/data";

export function getTierForQuantity(tiers: Tier[], qty: number): Tier {
  let best = tiers[0];
  for (const tier of tiers) {
    if (qty >= tier.minQty) best = tier;
  }
  return best;
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
