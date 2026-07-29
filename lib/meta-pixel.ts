// lib/meta-pixel.ts
// Camada fina sobre o Meta Pixel (fbq), espelhando lib/analytics.ts. TUDO é no-op
// se o Pixel não estiver configurado (env NEXT_PUBLIC_META_PIXEL_ID ausente) ou
// fora do browser — então é seguro chamar de qualquer lugar sem quebrar nada.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

type FbqFn = (...args: unknown[]) => void

function getFbq(): FbqFn | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { fbq?: FbqFn }
  return typeof w.fbq === 'function' ? w.fbq : null
}

// Registra a visita a uma página (SPA — chamado a cada mudança de rota).
export function metaPageview() {
  const f = getFbq()
  if (!f || !META_PIXEL_ID) return
  f('track', 'PageView')
}

// Evento padrão do catálogo da Meta (PageView, AddToCart, Purchase, ...)
export function metaTrack(name: string, params?: Record<string, unknown>) {
  const f = getFbq()
  if (!f || !META_PIXEL_ID) return
  f('track', name, params ?? {})
}

// ——— Eventos de e-commerce (mesmos pontos do funil que o GA4) ———

export function metaAddToCart(opts: { id: string; value: number }) {
  metaTrack('AddToCart', { content_ids: [opts.id], content_type: 'product', currency: 'BRL', value: opts.value })
}

export function metaBeginCheckout(opts: { ids: string[]; value: number; numItems: number }) {
  metaTrack('InitiateCheckout', {
    content_ids: opts.ids,
    content_type: 'product',
    num_items: opts.numItems,
    currency: 'BRL',
    value: opts.value,
  })
}

// A CONVERSÃO. eventID = id do pedido — a Meta usa para não contar o mesmo
// pedido duas vezes caso um dia a API de Conversões (servidor) seja ligada.
export function metaPurchase(opts: { orderId: string; value: number; ids: string[] }) {
  const f = getFbq()
  if (!f || !META_PIXEL_ID) return
  f(
    'track',
    'Purchase',
    { content_ids: opts.ids, content_type: 'product', currency: 'BRL', value: opts.value },
    { eventID: opts.orderId },
  )
}
