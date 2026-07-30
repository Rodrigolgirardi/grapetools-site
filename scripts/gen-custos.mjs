// scripts/gen-custos.mjs
// Gera lib/grape-one.generated.ts a partir do export MAIS RECENTE do GrapeOne
// (data/grape-skus-*.json): custo unitário (CMV do painel de Vendas) e peso em
// gramas (cotação de frete) por SKU. Roda no prebuild — pra atualizar, basta
// salvar um export novo do GrapeOne na pasta data/.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "data");
let arquivos = [];
try {
  arquivos = readdirSync(dataDir)
    .filter((f) => /^grape-skus-.*\.json$/i.test(f))
    .sort(); // nome tem a data (YYYY-MM-DD): ordem alfabética = cronológica
} catch {
  arquivos = [];
}

// SKUs renomeados no site depois do export (site → GrapeOne antigo).
// Remova o alias quando o GrapeOne for atualizado com o SKU novo.
const ALIASES = {
  "CH.DISC.POL.5": "4.DISC.POL.5", // Disco de Polimento virou marca própria em 30/07/2026
};

const mapa = {};
let fonte = "";
if (arquivos.length > 0) {
  fonte = arquivos[arquivos.length - 1];
  const rows = JSON.parse(readFileSync(join(dataDir, fonte), "utf8"));
  for (const r of Array.isArray(rows) ? rows : []) {
    if (!r?.sku) continue;
    const entry = {};
    const custo = Number(r.custo);
    const peso = Number(r.peso);
    if (Number.isFinite(custo) && custo > 0) entry.custo = Math.round(custo * 1000) / 1000;
    if (Number.isFinite(peso) && peso > 0) entry.pesoG = Math.round(peso * 100) / 100;
    if (Object.keys(entry).length > 0) mapa[r.sku] = entry;
  }
  for (const [novo, antigo] of Object.entries(ALIASES)) {
    if (!mapa[novo] && mapa[antigo]) mapa[novo] = mapa[antigo];
  }
}

const out = `// GERADO por scripts/gen-custos.mjs a partir de data/${fonte || "(nenhum export)"} — NÃO editar à mão.
// custo = CMV unitário em R$ (painel de Vendas); pesoG = peso unitário em gramas (frete).
// Para atualizar: salve um export novo do GrapeOne em data/grape-skus-YYYY-MM-DD.json.
export const GRAPEONE: Readonly<Record<string, { custo?: number; pesoG?: number }>> = ${JSON.stringify(mapa)};
`;

writeFileSync(join(process.cwd(), "lib", "grape-one.generated.ts"), out, "utf8");
const nCusto = Object.values(mapa).filter((e) => e.custo).length;
const nPeso = Object.values(mapa).filter((e) => e.pesoG).length;
console.log(`GrapeOne (${fonte || "sem export"}): ${nCusto} custos, ${nPeso} pesos`);
