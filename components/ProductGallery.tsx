"use client";

import { useState, useEffect } from "react";
import { ProductVisual } from "./ProductVisual";
import type { Product, Variation } from "@/lib/data";

const EXTS = ["png", "jpg", "jpeg"];
// Quantas fotos secundárias procurar por SKU (foto principal + até 5 extras).
const MAX_EXTRAS = 5;

// Verifica (no navegador) se uma imagem existe de fato.
function imagemExiste(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

type Props = {
  product: Product;
  variation: Variation;
};

export function ProductGallery({ product, variation }: Props) {
  // Nome-base da foto principal: SKU com pontos virando hífen (ex: 1.TPOR.BR -> 1-TPOR-BR)
  const mainBase = variation.sku.replace(/\./g, "-");

  const [extras, setExtras] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);

  // Sempre que a variação (cor) muda, redescobre as fotos daquela variação.
  useEffect(() => {
    let cancelled = false;
    setSelected(0);
    setExtras([]);

    (async () => {
      const encontradas: string[] = [];
      // Procura 1-TPOR-BR-2, -3, -4, ... em qualquer extensão suportada
      for (let n = 2; n <= MAX_EXTRAS + 1; n++) {
        const base = `${mainBase}-${n}`;
        let existe = false;
        for (const ext of EXTS) {
          if (await imagemExiste(`/products/${base}.${ext}`)) {
            existe = true;
            break;
          }
        }
        if (existe) encontradas.push(base);
      }
      if (!cancelled) setExtras(encontradas);
    })();

    return () => {
      cancelled = true;
    };
  }, [mainBase]);

  // Lista final: foto principal + secundárias encontradas
  const bases = [mainBase, ...extras];
  const baseSelecionada = bases[selected] ?? mainBase;

  return (
    <div className="detailGallery">
      {bases.length > 1 && (
        <div className="detailThumbs">
          {bases.map((base, i) => (
            <button
              key={base}
              className={`detailThumb ${selected === i ? "active" : ""}`}
              onClick={() => setSelected(i)}
              aria-label={i === 0 ? "Foto principal" : `Foto ${i + 1}`}
            >
              <ProductVisual product={product} fileBase={base} />
            </button>
          ))}
        </div>
      )}
      <div className="detailMainPhoto">
        <ProductVisual product={product} fileBase={baseSelecionada} />
      </div>
    </div>
  );
}
