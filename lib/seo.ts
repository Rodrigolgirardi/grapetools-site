import type { Product } from "./data";

export function productJsonLd(product: Product) {
  const allTiers = product.variations.flatMap((v) => v.tiers);
  const prices = allTiers.map((t) => t.price);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    sku: product.prefix,
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand
    },
    description: product.description,
    category: `${product.category} > ${product.subcategory}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice,
      highPrice,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  };
}
