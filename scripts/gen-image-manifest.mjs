// scripts/gen-image-manifest.mjs
// Varre public/products e gera lib/product-images.generated.ts com a lista dos
// arquivos de imagem existentes. Assim o SERVIDOR resolve a foto real de um SKU
// (pro OG/compartilhamento e futuros feeds) sem chutar extensão. Roda no prebuild.
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "products");
let files = [];
try {
  files = readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));
} catch {
  files = [];
}
files.sort();

const out = `// GERADO por scripts/gen-image-manifest.mjs — NÃO editar à mão.
// Arquivos de imagem em public/products (pra resolver a foto real de um SKU no
// servidor, sem chutar extensão). Regenerado no prebuild.
export const IMAGENS_PRODUTO: ReadonlySet<string> = new Set(${JSON.stringify(files)});
`;

writeFileSync(join(process.cwd(), "lib", "product-images.generated.ts"), out, "utf8");
console.log(`Manifesto de imagens: ${files.length} arquivos`);
