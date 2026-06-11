import type { Tier } from "@/lib/data";
import { formatCurrency, getTierRangeLabel } from "@/lib/pricing";

export function PricingTable({ tiers }: { tiers: Tier[] }) {
  const lastIndex = tiers.length - 1;
  return (
    <div className="pricingTable">
      {tiers.map((tier, i) => (
        <div key={tier.label} className={i === lastIndex ? "bestTier" : ""}>
          <span>{getTierRangeLabel(tiers, i)}</span>
          <strong>{formatCurrency(tier.price)}</strong>
        </div>
      ))}
    </div>
  );
}
