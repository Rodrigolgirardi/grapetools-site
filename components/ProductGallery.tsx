"use client";

import { useState, useEffect } from "react";
import { ProductVisual } from "./ProductVisual";
import { Lightbox } from "./Lightbox";
import type { Product, Variation } from "@/lib/data";

const EXTS = ["png", "jpg", "jpeg"];
// Quantas fotos secundárias procurar por SKU (principal + até 5 extras).
const MAX_EXTRAS = 5;

// Resolve a URL real de uma foto, testando as extensões na ordem. null se não existir.
function resolveUrl(base: string): Promise<string | null> {
  return new Promise((resolve) => {
    let i = 0;
    const tryNext = () => {
      if (i >= EXTS.length) {
        resolve(null);
        return;
      }
      const url = `/products/${base}.${EXTS[i++]}`;
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  });
}

type Props = {
  product: Product;
  variation: Variation;
};

export function ProductGallery({ product, variation }: Props) {
  const mainBase = variation.sku.replace(/\./g, "-");
  const prefixBase = product.prefix.replace(/\./g, "-");

  const [photos, setPhotos] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);

  // A cada troca de variação (cor), redescobre as fotos daquela variação.
  useEffect(() => {
    let cancelled = false;
    setSelected(0);
    setPhotos([]);
    setLoading(true);

    (async () => {
      // Foto principal: tenta o SKU; se não houver, cai pra foto genérica do produto (prefixo)
      let principal = await resolveUrl(mainBase);
      if (!principal) principal = await resolveUrl(prefixBase);

      // Secundárias: 1-TPOR-BR-2, -3, ...
      const extras: string[] = [];
      for (let n = 2; n <= MAX_EXTRAS + 1; n++) {
        const u = await resolveUrl(`${mainBase}-${n}`);
        if (u) extras.push(u);
      }

      const todas = [principal, ...extras].filter(Boolean) as string[];
      if (!cancelled) {
        setPhotos(todas);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mainBase, prefixBase]);

  const temFotos = photos.length > 0;

  return (
    <div className="detailGallery">
      {photos.length > 1 && (
        <div className="detailThumbs">
          {photos.map((url, i) => (
            <button
              key={url}
              className={`detailThumb ${selected === i ? "active" : ""}`}
              onClick={() => setSelected(i)}
              aria-label={i === 0 ? "Foto principal" : `Foto ${i + 1}`}
            >
              <div className="productVisual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="productImage" src={url} alt={product.name} onContextMenu={(e) => e.preventDefault()} draggable={false} />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="detailMainPhoto">
        {temFotos ? (
          <button
            type="button"
            className="detailZoomTrigger"
            onClick={() => setZoomOpen(true)}
            aria-label="Ampliar imagem"
          >
            <div className="productVisual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="productImage" src={photos[selected]} alt={product.name} onContextMenu={(e) => e.preventDefault()} draggable={false} />
            </div>
            <span className="detailZoomHint" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
          </button>
        ) : loading ? (
          // esqueleto enquanto procura as fotos (só o fundo, sem flash)
          <div className="productVisual" />
        ) : (
          // nenhuma foto encontrada → placeholder com iniciais
          <ProductVisual product={product} fileBase={mainBase} />
        )}
      </div>

      {zoomOpen && temFotos && (
        <Lightbox
          photos={photos}
          index={selected}
          alt={product.name}
          onIndex={setSelected}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
}
