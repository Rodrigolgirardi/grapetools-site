import { describe, it, expect } from 'vitest'
import { products } from '@/lib/data'
import {
  getTierForQuantity,
  descontoCarrinhoPercent,
  calcularPedidoServidor,
  getCartLines,
  JUROS_AO_MES,
  PARCELAS_SEM_JUROS,
  PARCELAS_MAX,
  PARCELA_VALOR_MIN,
  parcelasMaximas,
} from '@/lib/pricing'

// Uma variação real do catálogo (não-kit) pra testar com dados verdadeiros.
const prod = products.find((p) => p.category !== 'Kits' && p.variations.length > 0)!
const v = prod.variations[0]
const r2 = (n: number) => Math.round(n * 100) / 100

// Menor quantidade cujo total do pedido alcança `alvo` — usado para montar um
// carrinho grande o bastante para permitir N parcelas.
function qtdParaTotalMinimo(alvo: number): number {
  for (let q = 1; q <= 5000; q++) {
    const r = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: false, parcelas: 1 })
    if (r.ok && r.total >= alvo) return q
  }
  throw new Error('não foi possível montar um carrinho grande o suficiente')
}

describe('descontoCarrinhoPercent (desconto por valor do carrinho)', () => {
  it('aplica as faixas 2/3/4/5% nos limiares certos', () => {
    expect(descontoCarrinhoPercent(49.99)).toBe(0)
    expect(descontoCarrinhoPercent(50)).toBe(2)
    expect(descontoCarrinhoPercent(99.99)).toBe(2)
    expect(descontoCarrinhoPercent(100)).toBe(3)
    expect(descontoCarrinhoPercent(200)).toBe(4)
    expect(descontoCarrinhoPercent(400)).toBe(5)
    expect(descontoCarrinhoPercent(99999)).toBe(5)
  })
})

describe('getTierForQuantity', () => {
  it('abaixo do menor minQty usa o primeiro tier', () => {
    expect(getTierForQuantity(v.tiers, 1)).toBe(v.tiers[0])
  })
  it('acima do maior minQty usa o último tier', () => {
    const ultimo = v.tiers[v.tiers.length - 1]
    expect(getTierForQuantity(v.tiers, ultimo.minQty + 1000)).toBe(ultimo)
  })
})

describe('getCartLines', () => {
  it('monta a linha com quantidade e total corretos', () => {
    const lines = getCartLines({ [v.sku]: 3 })
    const l = lines.find((x) => x.variation.sku === v.sku)!
    expect(l).toBeTruthy()
    expect(l.quantity).toBe(3)
    expect(l.total).toBeCloseTo(l.tier.price * 3, 4)
  })
  it('não duplica o mesmo SKU', () => {
    const lines = getCartLines({ [v.sku]: 2 })
    expect(lines.filter((x) => x.variation.sku === v.sku).length).toBe(1)
  })
})

describe('calcularPedidoServidor — PROTEÇÃO DE PREÇO (anti-adulteração)', () => {
  it('rejeita SKU inexistente', () => {
    const r = calcularPedidoServidor([{ sku: 'SKU.QUE.NAO.EXISTE', quantidade: 1 }], { cartao: false, parcelas: 1 })
    expect(r.ok).toBe(false)
    expect(r.erro).toBeTruthy()
  })

  it('rejeita quantidade inválida (0, negativa, fracionária)', () => {
    for (const q of [0, -3, 1.5, NaN]) {
      const r = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: false, parcelas: 1 })
      expect(r.ok).toBe(false)
    }
  })

  it('rejeita pedido vazio', () => {
    expect(calcularPedidoServidor([], { cartao: false, parcelas: 1 }).ok).toBe(false)
  })

  it('recalcula o preço a partir do CATÁLOGO (ignora qualquer preço do cliente)', () => {
    const q = 3
    const precoBase = getTierForQuantity(v.tiers, q).price
    const r = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: false, parcelas: 1 })
    expect(r.ok).toBe(true)
    const desc = descontoCarrinhoPercent(precoBase * q)
    const esperadoUnit = r2((precoBase * (100 - desc)) / 100)
    expect(r.itens[0].preco_unitario).toBeCloseTo(esperadoUnit, 2)
    expect(r.total).toBeCloseTo(r2(esperadoUnit * q), 2)
    expect(r.subtotal).toBeCloseTo(precoBase * q, 2)
  })

  it('aplica o desconto por valor do carrinho de forma consistente', () => {
    const q = 500
    const precoBase = getTierForQuantity(v.tiers, q).price
    const subtotal = precoBase * q
    const r = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: false, parcelas: 1 })
    expect(r.descPercent).toBe(descontoCarrinhoPercent(subtotal))
    expect(r.descPercent).toBeGreaterThan(0)
    expect(r.descValor).toBeCloseTo(r2(r.subtotal - r.total), 2)
  })

  it('juros de parcelamento: até 3x sem juros, acima com juros', () => {
    // Quantidade grande o bastante pra 6x caber no mínimo por parcela.
    const q = qtdParaTotalMinimo(6 * PARCELA_VALOR_MIN)

    const semJuros = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: true, parcelas: 3 })
    expect(semJuros.valorCobrar).toBeCloseTo(semJuros.total, 2)

    const comJuros = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: true, parcelas: 6 })
    expect(comJuros.parcelas).toBe(6)
    expect(comJuros.valorCobrar).toBeCloseTo(r2(comJuros.total * (1 + JUROS_AO_MES * 6)), 2)
    expect(comJuros.valorCobrar).toBeGreaterThan(comJuros.total)
  })

  it('frete entra no valor cobrado (e na base dos juros), mas não no total dos produtos', () => {
    const semFrete = calcularPedidoServidor([{ sku: v.sku, quantidade: 2 }], { cartao: false, parcelas: 1 })
    const comFrete = calcularPedidoServidor([{ sku: v.sku, quantidade: 2 }], { cartao: false, parcelas: 1, freteReais: 23.5 })
    expect(comFrete.total).toBeCloseTo(semFrete.total, 2)          // produtos não mudam
    expect(comFrete.frete).toBeCloseTo(23.5, 2)
    expect(comFrete.valorCobrar).toBeCloseTo(semFrete.total + 23.5, 2)

    // Com cartão parcelado, os juros incidem sobre produtos + frete
    const q = qtdParaTotalMinimo(6 * PARCELA_VALOR_MIN)
    const parcelado = calcularPedidoServidor([{ sku: v.sku, quantidade: q }], { cartao: true, parcelas: 6, freteReais: 20 })
    expect(parcelado.valorCobrar).toBeCloseTo(r2((parcelado.total + 20) * (1 + JUROS_AO_MES * parcelado.parcelas!)), 2)

    // Frete negativo/lixo não vira desconto
    const lixo = calcularPedidoServidor([{ sku: v.sku, quantidade: 2 }], { cartao: false, parcelas: 1, freteReais: -50 })
    expect(lixo.valorCobrar).toBeCloseTo(lixo.total, 2)
  })

  it('limita as parcelas pelo valor mínimo por parcela (e ignora o pedido do cliente)', () => {
    // Pedido pequeno: mesmo pedindo 12x, o servidor cobra à vista e sem juros.
    const pequeno = calcularPedidoServidor([{ sku: v.sku, quantidade: 1 }], { cartao: true, parcelas: 12 })
    expect(pequeno.parcelas).toBe(parcelasMaximas(pequeno.total))
    expect(pequeno.parcelas! * PARCELA_VALOR_MIN).toBeLessThanOrEqual(
      Math.max(pequeno.total, PARCELA_VALOR_MIN)
    )
    if (pequeno.parcelas! <= PARCELAS_SEM_JUROS) {
      expect(pequeno.valorCobrar).toBeCloseTo(pequeno.total, 2)
    }

    // Nenhuma parcela oferecida pode ficar abaixo do mínimo.
    for (const total of [3, 7.37, 25, 60, 500]) {
      const n = parcelasMaximas(total)
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(PARCELAS_MAX)
      if (n > 1) expect(total / n).toBeGreaterThanOrEqual(PARCELA_VALOR_MIN)
    }
  })

  it('Pix/boleto (não-cartão) nunca tem juros', () => {
    const r = calcularPedidoServidor([{ sku: v.sku, quantidade: 2 }], { cartao: false, parcelas: 1 })
    expect(r.valorCobrar).toBeCloseTo(r.total, 2)
  })
})
