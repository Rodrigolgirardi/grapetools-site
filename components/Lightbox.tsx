"use client";

import { useEffect, useState } from "react";

type Props = {
  photos: string[];
  index: number;
  alt: string;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, alt, onIndex, onClose }: Props) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const multiplas = photos.length > 1;

  const irPara = (i: number) => {
    setZoom(false);
    onIndex((i + photos.length) % photos.length);
  };

  // Teclado: Esc fecha, setas navegam. Trava o scroll do fundo enquanto aberto.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") irPara(index + 1);
      else if (e.key === "ArrowLeft") irPara(index - 1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, photos.length]);

  // Quando ampliado, o ponto de foco segue o cursor (efeito Mercado Livre).
  function handleMove(e: React.MouseEvent<HTMLImageElement>) {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin({ x, y });
  }

  return (
    <div className="lightboxOverlay" onClick={onClose}>
      <button className="lightboxClose" onClick={onClose} aria-label="Fechar">✕</button>

      {multiplas && (
        <button
          className="lightboxNav lightboxPrev"
          onClick={(e) => { e.stopPropagation(); irPara(index - 1); }}
          aria-label="Foto anterior"
        >
          ‹
        </button>
      )}

      <div className="lightboxStage" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index]}
          alt={alt}
          className={`lightboxImg ${zoom ? "zoomed" : ""}`}
          style={zoom ? { transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
          onClick={() => setZoom((z) => !z)}
          onMouseMove={handleMove}
          onMouseLeave={() => setOrigin({ x: 50, y: 50 })}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
      </div>

      {multiplas && (
        <button
          className="lightboxNav lightboxNext"
          onClick={(e) => { e.stopPropagation(); irPara(index + 1); }}
          aria-label="Próxima foto"
        >
          ›
        </button>
      )}

      {multiplas && (
        <div className="lightboxThumbs" onClick={(e) => e.stopPropagation()}>
          {photos.map((url, i) => (
            <button
              key={url}
              className={`lightboxThumb ${i === index ? "active" : ""}`}
              onClick={() => irPara(i)}
              aria-label={`Foto ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" onContextMenu={(e) => e.preventDefault()} draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
