// lib/frete-server.ts
// Cotação de frete via Melhor Envio (SÓ servidor — o token nunca vai ao browser).
//
// O catálogo ainda não tem peso/medida reais na maioria dos SKUs, então o pacote
// é estimado por uma heurística de "caixa padrão" que cresce com a quantidade de
// itens. Quando um SKU tiver weight preenchido no data.ts ("120g", "1.2kg"), o
// valor real passa a ser usado automaticamente — dá pra refinar o catálogo aos
// poucos sem mexer aqui.

import { findVariation } from './pricing'
import { GRAPEONE } from './grape-one.generated'

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
    // Peso: weight do catálogo do site > peso do export GrapeOne > padrão 250g
    const found = findVariation(it.sku)
    const doCatalogo = found?.variation.weight
    const doGrapeOne = GRAPEONE[it.sku]?.pesoG
    const unit = doCatalogo && /\d/.test(doCatalogo) && !/consultar/i.test(doCatalogo)
      ? pesoUnitarioKg(doCatalogo)
      : doGrapeOne && doGrapeOne > 0
        ? doGrapeOne / 1000
        : PESO_PADRAO_KG
    pesoKg += unit * it.quantidade
    totalItens += it.quantidade
  }
  return { ...caixaPorQuantidade(totalItens), weight: Math.max(0.05, Math.round(pesoKg * 1000) / 1000) }
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'GrapeTools (contato@grapetools.com.br)',
  }
}

export type CompraEtiquetaArgs = {
  servicoId: number
  valorSeguro: number // valor declarado dos produtos (seguro)
  itens: ItemFrete[]
  destinatario: {
    nome: string
    email: string
    documento: string // CPF ou CNPJ, só dígitos
    telefone?: string
    endereco: { rua: string; numero: string; complemento?: string; bairro: string; cidade: string; estado: string; cep: string }
  }
}

export type EtiquetaComprada = { etiquetaId: string; etiquetaUrl: string; rastreio: string }

// Compra a etiqueta no Melhor Envio (debita a CARTEIRA da conta): carrinho →
// checkout → gerar → link de impressão. O remetente vem do cadastro da própria
// conta Melhor Envio (GET /me), então não há endereço de loja duplicado aqui.
// Lança Error com mensagem legível em qualquer falha — quem chama decide o HTTP.
export async function comprarEtiqueta(args: CompraEtiquetaArgs): Promise<EtiquetaComprada> {
  const token = process.env.MELHORENVIO_TOKEN
  if (!token) throw new Error('MELHORENVIO_TOKEN ausente')
  const h = headers(token)

  // Remetente = titular da conta Melhor Envio (endereço padrão do cadastro)
  const meRes = await fetch(`${ME_API}/me`, { headers: h })
  if (!meRes.ok) throw new Error(`Melhor Envio /me HTTP ${meRes.status}`)
  const me = await meRes.json()
  const endLoja = me?.address
  if (!endLoja?.postal_code) {
    throw new Error('A conta Melhor Envio não tem endereço cadastrado (Painel → Cadastro).')
  }

  const d = args.destinatario
  const docClean = d.documento.replace(/\D/g, '')
  const pacote = montarPacote(args.itens)

  // 1) Insere o envio no carrinho do Melhor Envio
  const cartRes = await fetch(`${ME_API}/me/cart`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({
      service: args.servicoId,
      from: {
        name: `${me.firstname ?? ''} ${me.lastname ?? ''}`.trim() || 'Grape Tools',
        phone: me.phone?.phone ?? '',
        email: me.email ?? '',
        document: me.document ?? undefined,
        company_document: me.company_document ?? undefined,
        address: endLoja.address,
        number: endLoja.number,
        complement: endLoja.complement ?? '',
        district: endLoja.district,
        city: endLoja.city?.city ?? endLoja.city,
        state_abbr: endLoja.city?.state?.state_abbr ?? undefined,
        postal_code: endLoja.postal_code,
      },
      to: {
        name: d.nome,
        email: d.email,
        phone: d.telefone ?? '',
        document: docClean.length === 11 ? docClean : undefined,
        company_document: docClean.length === 14 ? docClean : undefined,
        address: d.endereco.rua,
        number: d.endereco.numero,
        complement: d.endereco.complemento ?? '',
        district: d.endereco.bairro,
        city: d.endereco.cidade,
        state_abbr: d.endereco.estado,
        postal_code: d.endereco.cep.replace(/\D/g, ''),
      },
      volumes: [{ height: pacote.height, width: pacote.width, length: pacote.length, weight: pacote.weight }],
      options: {
        insurance_value: Math.max(1, args.valorSeguro),
        receipt: false,
        own_hand: false,
        reverse: false,
        non_commercial: true, // envio com declaração de conteúdo (sem NF-e atrelada)
      },
    }),
  })
  const cart = await cartRes.json().catch(() => null)
  if (!cartRes.ok || !cart?.id) {
    throw new Error(`Falha ao montar o envio: ${JSON.stringify(cart?.error ?? cart).slice(0, 200)}`)
  }
  const envioId = String(cart.id)

  // 2) Paga com o saldo da carteira
  const payRes = await fetch(`${ME_API}/me/shipment/checkout`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ orders: [envioId] }),
  })
  const pay = await payRes.json().catch(() => null)
  if (!payRes.ok) {
    const msg = JSON.stringify(pay?.error ?? pay).slice(0, 200)
    if (/insufficient|saldo/i.test(msg)) {
      throw new Error('Saldo insuficiente na carteira do Melhor Envio. Adicione créditos e tente de novo.')
    }
    throw new Error(`Falha ao pagar a etiqueta: ${msg}`)
  }

  // 3) Gera a etiqueta
  const genRes = await fetch(`${ME_API}/me/shipment/generate`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ orders: [envioId] }),
  })
  if (!genRes.ok) {
    const t = await genRes.text().catch(() => '')
    throw new Error(`Etiqueta paga, mas falhou ao gerar (${genRes.status}): ${t.slice(0, 150)}. Gere pelo painel do Melhor Envio.`)
  }

  // 4) Link público do PDF
  const printRes = await fetch(`${ME_API}/me/shipment/print`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ mode: 'public', orders: [envioId] }),
  })
  const print = await printRes.json().catch(() => null)

  // 5) Código de rastreio
  const trackRes = await fetch(`${ME_API}/me/shipment/tracking`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ orders: [envioId] }),
  })
  const track = await trackRes.json().catch(() => null)
  const rastreio = String(track?.[envioId]?.tracking ?? '')

  return { etiquetaId: envioId, etiquetaUrl: String(print?.url ?? ''), rastreio }
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
