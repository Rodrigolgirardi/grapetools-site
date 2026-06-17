// lib/product-image.ts
// Resolve a foto de um produto aceitando o nome do arquivo:
//  - com HÍFEN (CH-FEC-MAGNET) ou com PONTO (CH.FEC.MAGNET)
//  - com acento/cedilha (AÇOESC) ou sem (ACOESC)
//  - em png/jpg/jpeg

const EXTS = ["png", "jpg", "jpeg"];

// Remove acentos e cedilha, preservando maiúsculas/minúsculas (ex: AÇOESC -> ACOESC).
export function semAcento(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Nomes-base a tentar (sem extensão), já sem duplicatas.
export function productImageBases(sku: string): string[] {
  const dash = sku.replace(/\./g, "-");
  const dot = sku;
  return [...new Set([dash, dot, semAcento(dash), semAcento(dot)])];
}

// Lista de URLs candidatas, em ordem de prioridade.
export function productImageCandidates(sku: string): string[] {
  return productImageBases(sku).flatMap((b) => EXTS.map((ext) => `/products/${b}.${ext}`));
}

// Primeira candidata (o src inicial da <img>).
export function productImageSrc(sku: string): string {
  return productImageCandidates(sku)[0];
}

// Handler de onError: tenta a próxima candidata; no fim, esconde a imagem.
export function handleProductImageError(sku: string) {
  const candidates = productImageCandidates(sku);
  return (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget;
    const atual = img.getAttribute("src") || "";
    const proxima = candidates[candidates.indexOf(atual) + 1];
    if (proxima) img.src = proxima;
    else img.style.display = "none";
  };
}
