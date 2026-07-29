"use client";

import { useState, useEffect, useRef } from "react";
import { semAcento } from "@/lib/product-image";
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
  // com HÍFEN (CH-FEC-MAGNET) ou PONTO (CH.FEC.MAGNET), e com ou sem acento/
  // cedilha (AÇOESC/ACOESC). Funciona se a foto for salva de qualquer forma.
  const baseList = fileBase
    ? [fileBase]
    : [imageSku.replace(/\./g, "-"), imageSku];
  baseList.push(product.prefix.replace(/\./g, "-"), product.prefix); // foto genérica do produto

  const bases = [...new Set(baseList.flatMap((b) => [b, semAcento(b)]))];
  const exts = ["png", "jpg", "jpeg"];
  const sources = bases.flatMap((b) => exts.map((ext) => `/products/${b}.${ext}`));

  const [srcIndex, setSrcIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reseta o índice quando o SKU/arquivo muda (troca de variação)
  useEffect(() => {
    setSrcIndex(0);
  }, [sources[0]]);

  // A <img> já vem renderizada do servidor com a 1ª candidata. Se o 404 dela
  // chegar ANTES da hidratação, o onError acontece sem ninguém ouvindo e a foto
  // fica quebrada para sempre — some no navegador rápido, aparece no lento.
  // Esta checagem no mount detecta a imagem que já falhou e retoma a cadeia.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setSrcIndex((i) => i + 1);
  }, [srcIndex]);

  return (
    <div className="productVisual" aria-label={`Imagem de ${product.name}`}>
      {srcIndex < sources.length ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={sources[srcIndex]}
          alt={product.name}
          className="productImage"
          loading="lazy"
          decoding="async"
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
