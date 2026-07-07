import { products, type Tier, type Product, type Variation } from "@/lib/data";

export function getTierForQuantity(tiers: Tier[], qty: number): Tier {
  let best = tiers[0];
  for (const tier of tiers) {
    if (qty >= tier.minQty) best = tier;
  }
  return best;
}

export type CartLine = {
  product: Product;
  variation: Variation;
  quantity: number;
  tier: Tier;
  total: number;
};

// Monta as linhas do carrinho a partir do {sku: qtd}, deduplicando por SKU.
// (Um mesmo SKU pode aparecer em mais de um produto — ex.: chicote avulso E como
//  variação do botão. Sem dedup, o carrinho contaria duas vezes.)
export function getCartLines(cart: Record<string, number>): CartLine[] {
  const seen = new Set<string>();
  const lines: CartLine[] = [];
  for (const p of products) {
    for (const v of p.variations) {
      const quantity = cart[v.sku];
      if (quantity && quantity > 0 && !seen.has(v.sku)) {
        seen.add(v.sku);
        const tier = getTierForQuantity(v.tiers, quantity);
        lines.push({ product: p, variation: v, quantity, tier, total: tier.price * quantity });
      }
    }
  }
  return lines;
}

// ---- Frete grátis e desconto por valor do carrinho ----

// Frete grátis a partir deste valor de carrinho (R$)
export const FRETE_GRATIS_MIN = 199;

// Desconto aplicado sobre o subtotal conforme o valor total do carrinho.
// Maior para menor (a primeira faixa atingida vence).
export const DESCONTO_TIERS = [
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
  return getCartLines(cart).reduce((s, l) => s + l.total, 0);
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
  return next ? `${current.minQty}–${next.minQty - 1} Peças` : `${current.minQty}+ Peças`;
}

// ---- Cálculo AUTORITATIVO de pedido (fonte de verdade no servidor) ----
// Regra de parcelamento: até N parcelas sem juros; acima disso, juros/parcela.
export const PARCELAS_SEM_JUROS = 3;
export const JUROS_AO_MES = 0.02;

const r2 = (n: number) => Math.round(n * 100) / 100;

// Localiza a variação (e o produto) de um SKU no catálogo autoritativo.
export function findVariation(sku: string): { product: Product; variation: Variation } | null {
  for (const p of products) {
    for (const v of p.variations) {
      if (v.sku === sku) return { product: p, variation: v };
    }
  }
  return null;
}

export type ItemAutoritativo = { sku: string; descricao: string; quantidade: number; preco_unitario: number };
export type CalculoPedido = {
  ok: boolean;
  erro?: string;
  itens: ItemAutoritativo[];
  subtotal: number;      // soma dos preços de atacado por quantidade, SEM desconto de carrinho
  descPercent: number;   // % de desconto por valor do carrinho (0..5)
  descValor: number;     // subtotal - total
  total: number;         // valor real da compra (com desconto), sem juros de cartão
  valorCobrar: number;   // total + juros do parcelamento (se cartão > PARCELAS_SEM_JUROS)
};

// Recalcula TODO o valor do pedido a partir do catálogo, IGNORANDO qualquer
// preço/total vindo do cliente. Usado no servidor (criar-pedido) para impedir
// adulteração de preço. Espelha exatamente a fórmula usada no checkout, mas aqui
// é a única fonte confiável: o cliente só informa sku + quantidade.
export function calcularPedidoServidor(
  itensPedido: { sku: string; quantidade: number }[],
  opts: { cartao: boolean; parcelas: number }
): CalculoPedido {
  const vazio: CalculoPedido = { ok: false, itens: [], subtotal: 0, descPercent: 0, descValor: 0, total: 0, valorCobrar: 0 };

  if (!Array.isArray(itensPedido) || itensPedido.length === 0) {
    return { ...vazio, erro: 'Pedido sem itens.' };
  }

  // 1) Resolve cada SKU no catálogo e valida quantidade
  const linhas: { sku: string; descricao: string; quantidade: number; precoBase: number }[] = [];
  for (const it of itensPedido) {
    const q = Number(it?.quantidade);
    if (!Number.isInteger(q) || q <= 0) {
      return { ...vazio, erro: `Quantidade inválida para o item ${it?.sku ?? '?'}.` };
    }
    const found = findVariation(String(it?.sku ?? ''));
    if (!found) {
      return { ...vazio, erro: `Produto não encontrado: ${it?.sku ?? '?'}.` };
    }
    const precoBase = getTierForQuantity(found.variation.tiers, q).price;
    linhas.push({
      sku: found.variation.sku,
      descricao: `${found.product.name} — ${found.variation.label}`,
      quantidade: q,
      precoBase,
    });
  }

  // 2) Subtotal (preço de atacado por quantidade) e desconto por valor do carrinho
  const subtotal = linhas.reduce((s, l) => s + l.precoBase * l.quantidade, 0);
  const descPercent = descontoCarrinhoPercent(subtotal);

  // 3) Preço unitário final (com desconto aplicado por unidade — igual ao checkout)
  const itens: ItemAutoritativo[] = linhas.map((l) => ({
    sku: l.sku,
    descricao: l.descricao,
    quantidade: l.quantidade,
    preco_unitario: r2((l.precoBase * (100 - descPercent)) / 100),
  }));

  const total = r2(itens.reduce((s, i) => s + i.preco_unitario * i.quantidade, 0));
  const descValor = r2(subtotal - total);

  // 4) Juros do parcelamento (só cartão acima de PARCELAS_SEM_JUROS)
  const comJuros = opts.cartao && opts.parcelas > PARCELAS_SEM_JUROS;
  const valorCobrar = comJuros ? r2(total * (1 + JUROS_AO_MES * opts.parcelas)) : total;

  return { ok: true, itens, subtotal, descPercent, descValor, total, valorCobrar };
}
