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

  // "Bases" (nomes de arquivo) a tentar, em ordem de prioridade. Aceita o nome
  // com HÍFEN (CH-FEC-MAGNET) e com PONTO (CH.FEC.MAGNET) — assim funciona
  // mesmo se a foto for salva de qualquer das duas formas.
  const bases = fileBase
    ? [fileBase]
    : [imageSku.replace(/\./g, "-"), imageSku];
  bases.push(product.prefix.replace(/\./g, "-"), product.prefix); // foto genérica do produto

  const exts = ["png", "jpg", "jpeg"];
  const sources = bases.flatMap((b) => exts.map((ext) => `/products/${b}.${ext}`));

  const [srcIndex, setSrcIndex] = useState(0);

  // Reseta o índice quando o SKU/arquivo muda (troca de variação)
  useEffect(() => {
    setSrcIndex(0);
  }, [sources[0]]);

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
