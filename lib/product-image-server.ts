// lib/product-image-server.ts
// Resolve a foto REAL de um SKU consultando o manifesto (só servidor — usa a lista
// de arquivos gerada no build). Diferente do productImageSrc do cliente, NÃO chuta
// extensão: retorna o caminho que existe de fato, ou null se não há foto ainda.
import { productImageCandidates } from "./product-image";
import { IMAGENS_PRODUTO } from "./product-images.generated";

export function imagemRealDoSku(sku: string, fallback?: string): string | null {
  for (const path of productImageCandidates(sku, fallback)) {
    if (IMAGENS_PRODUTO.has(path.replace("/products/", ""))) return path;
  }
  return null;
}
