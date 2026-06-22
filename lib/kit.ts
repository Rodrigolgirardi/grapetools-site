// lib/kit.ts
// Disponibilidade de um kit a partir do estoque dos componentes.

import type { KitComponente } from '@/lib/data'

// Quantos kits dá pra montar com o estoque atual dos componentes.
// Componente "não controlado" (sem linha no estoque) não limita.
// Retorna null se NENHUM componente é controlado (kit sem limite de estoque).
export function kitDisponivel(
  composicao: KitComponente[],
  estoque: Record<string, number>
): number | null {
  let min = Infinity
  for (const c of composicao) {
    if (Object.prototype.hasOwnProperty.call(estoque, c.sku)) {
      const cap = Math.floor((estoque[c.sku] ?? 0) / Math.max(1, c.quantidade))
      if (cap < min) min = cap
    }
  }
  return min === Infinity ? null : min
}
