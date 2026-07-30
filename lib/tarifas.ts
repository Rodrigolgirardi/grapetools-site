// lib/tarifas.ts
// Tarifas do Pagar.me usadas no cálculo de margem da aba Vendas do admin.
//
// Taxas REAIS do contrato, conferidas no painel do Pagar.me em 30/07/2026:
// cartão (e-Commerce, todos os cartões, por nº de parcelas), Pix 1,19% e
// boleto R$ 3,49/transação. A taxa do cartão incide sobre o TOTAL cobrado
// (incluindo os juros repassados ao cliente). Se o contrato mudar, ajuste aqui.

export const TARIFA_CARTAO_POR_PARCELA: Record<number, number> = {
  1: 5.59,
  2: 8.59,
  3: 9.84,
  4: 11.09,
  5: 12.34,
  6: 13.59,
  7: 15.34,
  8: 16.59,
  9: 17.84,
  10: 19.09,
  11: 20.34,
  12: 21.59,
}

export const TARIFA_PIX = { percent: 1.19, fixo: 0 }
export const TARIFA_BOLETO = { percent: 0, fixo: 3.49 }

// Tarifa estimada de uma venda. `parcelas` só importa no cartão (1 se não souber).
export function tarifaVenda(formaPagamento: string, valorCobrado: number, parcelas = 1): number {
  if (valorCobrado <= 0) return 0
  let v = 0
  if (formaPagamento === 'cartao') {
    const pct = TARIFA_CARTAO_POR_PARCELA[Math.min(12, Math.max(1, parcelas))] ?? TARIFA_CARTAO_POR_PARCELA[1]
    v = valorCobrado * (pct / 100)
  } else if (formaPagamento === 'pix') {
    v = valorCobrado * (TARIFA_PIX.percent / 100) + TARIFA_PIX.fixo
  } else if (formaPagamento === 'boleto') {
    v = valorCobrado * (TARIFA_BOLETO.percent / 100) + TARIFA_BOLETO.fixo
  }
  return Math.round(v * 100) / 100
}

// Descrição curta da tarifa aplicada (pro painel mostrar a conta).
export function tarifaDescricao(formaPagamento: string, parcelas = 1): string {
  if (formaPagamento === 'cartao') {
    const pct = TARIFA_CARTAO_POR_PARCELA[Math.min(12, Math.max(1, parcelas))] ?? TARIFA_CARTAO_POR_PARCELA[1]
    return `cartão ${parcelas}x · ${pct}%`
  }
  if (formaPagamento === 'pix') return `pix · ${TARIFA_PIX.percent}%`
  if (formaPagamento === 'boleto') return `boleto · R$ ${TARIFA_BOLETO.fixo.toFixed(2)}`
  return formaPagamento
}
