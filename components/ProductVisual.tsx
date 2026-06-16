"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/data";

const categoryIcon: Record<string, string> = {
  Abrasivos: "AB",
  Ferragens: "FG",
  Ferramentas: "FT",
  Elétrica: "EL",
  Fixação: "FX",
  Utilidades: "UT",
  Outros: "GT",
};

type Props = {
  product: Product;
  sku?: string;
  // Quando informado, usa este nome de arquivo exato (sem extensão), ex:
  // "1-TPOR-BR-2". Tem prioridade sobre o SKU. Usado pela galeria de fotos.
  fileBase?: string;
};

export function ProductVisual({ product, sku, fileBase }: Props) {
  const initials = categoryIcon[product.category] ?? product.category.slice(0, 2).toUpperCase();

  // SKU da variação selecionada OU primeira variação OU prefixo do produto
  const imageSku = sku ?? product.variations[0]?.sku ?? product.prefix;
  const imageFile = fileBase ?? imageSku.replace(/\./g, "-");
  const prefixFile = product.prefix.replace(/\./g, "-");

  // Tenta:
  // 1. PNG da variação → 2. JPG da variação → 3. JPEG da variação
  // 4. PNG do prefixo → 5. JPG do prefixo (foto genérica do produto)
  // 6. placeholder com iniciais
  const sources = [
    `/products/${imageFile}.png`,
    `/products/${imageFile}.jpg`,
    `/products/${imageFile}.jpeg`,
    `/products/${prefixFile}.png`,
    `/products/${prefixFile}.jpg`,
    `/products/${prefixFile}.jpeg`,
  ];

  const [srcIndex, setSrcIndex] = useState(0);

  // Reseta o índice quando o SKU muda (troca de variação)
  useEffect(() => {
    setSrcIndex(0);
  }, [imageFile]);

  return (
    <div className="productVisual" aria-label={`Imagem de ${product.name}`}>
      {srcIndex < sources.length ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[srcIndex]}
          alt={product.name}
          className="productImage"
          onError={() => setSrcIndex((i) => i + 1)}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
      ) : (
        <div className="productPlaceholder">
          <span className="productPlaceholderInitials">{initials}</span>
          <span className="productPlaceholderName">{product.name}</span>
        </div>
      )}
    </div>
  );
}
