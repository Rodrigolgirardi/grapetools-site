// app/[slug]/page.tsx  (SERVER component)
// Casca de servidor da página de produto: gera o <title>/<meta>/OpenGraph PRÓPRIOS
// de cada produto (antes, os 314 herdavam o mesmo título genérico). A interação
// fica no ProductPageClient (client component).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { productImageSrc } from "@/lib/product-image";
import { breadcrumbJsonLd } from "@/lib/seo";
import ProductPageClient from "./ProductPageClient";

type Props = { params: Promise<{ slug: string }> };

function descricaoDoProduto(slug: string): string | null {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  if (product.description) return product.description;
  return `${product.name} — ${product.category} · ${product.subcategory}. Marca ${product.brand}, com desconto progressivo por quantidade e nota fiscal.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {}; // deixa o notFound cuidar

  const description = descricaoDoProduto(slug) ?? undefined;
  const image = productImageSrc(product.variations[0].sku, product.prefix);

  return {
    title: product.name, // o template do layout adiciona " | Grape Tools"
    description,
    alternates: { canonical: `/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      locale: "pt_BR",
      // Foto do produto (se existir) e og-image como reserva -> preview sempre bonito.
      images: [image, "/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image, "/og-image.png"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <>
      {/* Migalhas (Início > Categoria > Produto) para a busca do Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(product)).replace(/</g, "\\u003c"),
        }}
      />
      <ProductPageClient slug={slug} />
    </>
  );
}
