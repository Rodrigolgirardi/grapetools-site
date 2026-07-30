// lib/frete-server.ts
// Cotação de frete via Melhor Envio (SÓ servidor — o token nunca vai ao browser).
//
// O catálogo ainda não tem peso/medida reais na maioria dos SKUs, então o pacote
// é estimado por uma heurística de "caixa padrão" que cresce com a quantidade de
// itens. Quando um SKU tiver weight preenchido no data.ts ("120g", "1.2kg"), o
// valor real passa a ser usado automaticamente — dá pra refinar o catálogo aos
// poucos sem mexer aqui.

import { findVariation } from './pricing'

const ME_API = 'https://melhorenvio.com.br/api/v2'

// CEP de origem: o mesmo endereço da loja usado na retirada (checkout).
export const CEP_ORIGEM = '04678002'

export type OpcaoFrete = {
  id: number            // id do serviço no Melhor Envio (SEDEX=2, etc.)
  nome: string          // "SEDEX", ".Package"
  transportadora: string// "Correios", "Jadlog"
  logo: string          // url da logomarca (servida pelo Melhor Envio)
  preco: number         // em reais
  prazo: number         // dias úteis
}

export type ItemFrete = { sku: string; quantidade: number }

// Frete grátis: pedidos >= FRETE_GRATIS_MIN (R$199) com destino na GRANDE SÃO
// PAULO — capital + região metropolitana, que na prática é a faixa de CEP
// começando em 0 (01000-000 a 09999-999). É a promessa do topo do site.
export function freteGratisElegivel(cepDestino: string, subtotalReais: number): boolean {
  const d = cepDestino.replace(/\D/g, '')
  return d.length === 8 && d.startsWith('0') && subtotalReais >= 199
}

// Peso de UMA unidade, em kg. Usa o weight do catálogo quando parseável
// ("8.00g", "14g", "1.2kg"); senão assume 250g — ferragens são densas e é
// melhor errar um pouco pra cima do que a etiqueta sair mais cara na hora.
const PESO_PADRAO_KG = 0.25

function pesoUnitarioKg(weight: string | undefined): number {
  if (!weight) return PESO_PADRAO_KG
  const m = weight.trim().toLowerCase().match(/^([\d.,]+)\s*(kg|g)$/)
  if (!m) return PESO_PADRAO_KG
  const n = parseFloat(m[1].replace(',', '.'))
  if (!Number.isFinite(n) || n <= 0) return PESO_PADRAO_KG
  return m[2] === 'kg' ? n : n / 1000
}

// Caixa padrão por volume de itens (cm). Mínimos do Melhor Envio: 11x16x2.
function caixaPorQuantidade(totalItens: number): { height: number; width: number; length: number } {
  if (totalItens <= 4) return { height: 8, width: 16, length: 20 }
  if (totalItens <= 12) return { height: 12, width: 20, length: 25 }
  return { height: 20, width: 30, length: 35 }
}

export function montarPacote(itens: ItemFrete[]) {
  let totalItens = 0
  let pesoKg = 0.15 // embalagem
  for (const it of itens) {
    const found = findVariation(it.sku)
    const unit = pesoUnitarioKg(found?.variation.weight)
    pesoKg += unit * it.quantidade
    totalItens += it.quantidade
  }
  return { ...caixaPorQuantidade(totalItens), weight: Math.max(0.05, Math.round(pesoKg * 1000) / 1000) }
}

// Cota o frete no Melhor Envio. Lança erro em falha de rede/autenticação;
// devolve [] se nenhuma transportadora atende o trecho.
export async function cotarFrete(cepDestino: string, itens: ItemFrete[]): Promise<OpcaoFrete[]> {
  const token = process.env.MELHORENVIO_TOKEN
  if (!token) throw new Error('MELHORENVIO_TOKEN ausente')

  const pacote = montarPacote(itens)
  const res = await fetch(`${ME_API}/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'GrapeTools (contato@grapetools.com.br)',
    },
    body: JSON.stringify({
      from: { postal_code: CEP_ORIGEM },
      to: { postal_code: cepDestino },
      package: pacote,
    }),
    // Cotação é leitura pura — cache curto do Next segura repetições do mesmo trecho.
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Melhor Envio HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }

  const data = (await res.json()) as Array<Record<string, unknown>>
  if (!Array.isArray(data)) return []

  return data
    .filter((o) => !o.error && o.price)
    .map((o) => ({
      id: Number(o.id),
      nome: String(o.name ?? ''),
      transportadora: String((o.company as { name?: string } | undefined)?.name ?? ''),
      logo: String((o.company as { picture?: string } | undefined)?.picture ?? ''),
      preco: Math.round(parseFloat(String(o.price)) * 100) / 100,
      prazo: Number(o.delivery_time ?? 0),
    }))
    .filter((o) => Number.isFinite(o.preco) && o.preco > 0)
    .sort((a, b) => a.preco - b.preco)
}
