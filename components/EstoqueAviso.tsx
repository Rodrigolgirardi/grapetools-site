'use client'

// components/EstoqueAviso.tsx
// Banner vermelho de estoque insuficiente (carrinho e checkout): avisa ANTES de
// o cliente tentar pagar — o servidor já bloqueava, mas só na hora do pagamento
// e com mensagem genérica. Aqui ele vê qual item passou do estoque e quanto há.

import { kitDisponivel } from '@/lib/kit'
import type { Product, Variation } from '@/lib/data'

export type ItemSemEstoque = { nome: string; disponivel: number; pedido: number }

type LinhaCarrinho = { product: Product; variation: Variation; quantity: number }

// Itens do carrinho pedindo acima do estoque. SKU fora da tabela de estoque =
// "não controlado" (sem limite) — mesma regra do servidor e da página de produto.
export function itensSemEstoque(
  lines: LinhaCarrinho[],
  estoque: Record<string, number>
): ItemSemEstoque[] {
  const out: ItemSemEstoque[] = []
  for (const l of lines) {
    const v = l.variation
    const disponivel = v.composicao
      ? kitDisponivel(v.composicao, estoque)
      : Object.prototype.hasOwnProperty.call(estoque, v.sku)
        ? estoque[v.sku]
        : null
    if (disponivel !== null && l.quantity > disponivel) {
      out.push({
        nome: `${l.product.name}${v.label !== l.product.name ? ` · ${v.label}` : ''}`,
        disponivel: Math.max(0, disponivel),
        pedido: l.quantity,
      })
    }
  }
  return out
}

export function EstoqueAviso({ itens }: { itens: ItemSemEstoque[] }) {
  if (itens.length === 0) return null
  return (
    <div className="estoqueAviso" role="alert">
      {itens.map((i) => (
        <p key={i.nome}>
          Desculpe, não temos a quantidade suficiente de <strong>&ldquo;{i.nome}&rdquo;</strong> em
          estoque para atender o seu pedido{' '}
          {i.disponivel === 0
            ? '(esgotado no momento)'
            : <>(temos apenas <strong>{i.disponivel}</strong> em estoque)</>}
          . Ajuste a quantidade para continuar.
        </p>
      ))}
    </div>
  )
}
