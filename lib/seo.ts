import type { Product } from "./data";

const BASE = "https://grapetools.com.br";

// Identidade da loja para o Google (nome, logo, site).
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Grape Tools",
    url: BASE,
    logo: `${BASE}/logo.png`,
    description:
      "Ferragens, ferramentas e utilidades com desconto progressivo por quantidade. Atacado para lojistas, com nota fiscal e entrega para todo o Brasil.",
  };
}

// WebSite + caixa de busca (sitelinks searchbox nos resultados do Google).
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Grape Tools",
    url: BASE,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Migalhas (Início > Categoria > Produto) — aparece na busca do Google.
export function breadcrumbJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `${BASE}/?categoria=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${BASE}/${product.slug}`,
      },
    ],
  };
}

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
