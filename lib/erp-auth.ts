// lib/erp-auth.ts
// Utilidades compartilhadas pelos endpoints do ERP (app/api/erp/*).
import { NextRequest } from 'next/server'

// Confere a chave de API enviada pelo Grape One (cabeçalho x-api-key).
export function autorizadoErp(request: NextRequest): boolean {
  const esperada = process.env.ERP_API_KEY
  if (!esperada) return false // sem chave configurada, bloqueia por segurança
  return request.headers.get('x-api-key') === esperada
}

// Arredonda para 2 casas decimais, evitando os "0.30000000004" do float.
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
