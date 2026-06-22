"use client";

import { useState, useEffect } from "react";
import { ProductVisual } from "./ProductVisual";
import { Lightbox } from "./Lightbox";
import { productImageBases } from "@/lib/product-image";
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
// Recebe várias bases pra aceitar nome com HÍFEN/PONTO e com/sem acento.
function resolveFromBases(bases: string[]): Promise<string | null> {
  const urls = [...new Set(bases.flatMap((b) => EXTS.map((ext) => `/products/${b}.${ext}`)))];
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
  // Nome-base com hífen, usado no placeholder quando não há foto.
  const skuDash = variation.sku.replace(/\./g, "-");

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
      // Bases do SKU (hífen, ponto, com e sem acento) e do prefixo
      const skuBases = productImageBases(variation.sku);
      const prefixBases = productImageBases(product.prefix);

      // Foto principal: tenta o SKU; se não houver, foto genérica (prefixo)
      let principal = await resolveFromBases(skuBases);
      if (!principal) principal = await resolveFromBases(prefixBases);

      // Secundárias (-2, -3, ...): testa TODAS em paralelo. Tenta pelo SKU e,
      // se for kit, também pelo prefixo (1 jogo de fotos serve o anúncio todo).
      const basesExtras = [...new Set([...skuBases, ...prefixBases])];
      const extras = (await Promise.all(
        Array.from({ length: MAX_EXTRAS }, (_, i) => i + 2).map((n) =>
          resolveFromBases(basesExtras.map((b) => `${b}-${n}`))
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
  }, [variation.sku, product.prefix]);

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
