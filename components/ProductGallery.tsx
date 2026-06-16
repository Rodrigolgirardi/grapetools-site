"use client";

import { useState, useEffect } from "react";
import { ProductVisual } from "./ProductVisual";
import { Lightbox } from "./Lightbox";
import type { Product, Variation } from "@/lib/data";

const EXTS = ["png", "jpg", "jpeg"];
// Quantas fotos secundárias procurar por SKU (principal + até 5 extras).
const MAX_EXTRAS = 5;

// Testa se uma imagem existe (no navegador).
function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Resolve a URL real de uma foto. Testa cada "base" (nome do arquivo) nas 3
// extensões, TUDO em paralelo, e pega a primeira que existir (na ordem dada).
// Recebe várias bases pra aceitar o nome com HÍFEN e com PONTO.
function resolveFromBases(bases: string[]): Promise<string | null> {
  const urls = bases.flatMap((b) => EXTS.map((ext) => `/products/${b}.${ext}`));
  return Promise.all(urls.map(checkUrl)).then((oks) => {
    const i = oks.findIndex(Boolean);
    return i >= 0 ? urls[i] : null;
  });
}

type Props = {
  product: Product;
  variation: Variation;
};

export function ProductGallery({ product, variation }: Props) {
  // Aceita o nome do arquivo com hífen (CH-FEC-MAGNET) OU com ponto (CH.FEC.MAGNET)
  const skuDash = variation.sku.replace(/\./g, "-");
  const skuDot = variation.sku;
  const prefixDash = product.prefix.replace(/\./g, "-");
  const prefixDot = product.prefix;

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
      // Foto principal: tenta o SKU (hífen e ponto); se não houver, foto genérica (prefixo)
      let principal = await resolveFromBases([skuDash, skuDot]);
      if (!principal) principal = await resolveFromBases([prefixDash, prefixDot]);

      // Secundárias (-2, -3, ...): testa TODAS em paralelo, hífen e ponto
      const extras = (await Promise.all(
        Array.from({ length: MAX_EXTRAS }, (_, i) => i + 2).map((n) =>
          resolveFromBases([`${skuDash}-${n}`, `${skuDot}-${n}`])
        )
      )).filter(Boolean) as string[];

      const todas = [principal, ...extras].filter(Boolean) as string[];
      if (!cancelled) {
        setPhotos(todas);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [skuDash, skuDot, prefixDash, prefixDot]);

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
          <ProductVisual product={product} fileBase={skuDash} />
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
