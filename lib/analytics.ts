// lib/analytics.ts
// Camada fina sobre o Google Analytics 4 (gtag). TUDO é no-op se o GA não estiver
// configurado (env NEXT_PUBLIC_GA_ID ausente) ou fora do browser — então é seguro
// chamar de qualquer lugar sem quebrar nada.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

type GtagFn = (...args: unknown[]) => void

function getGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { gtag?: GtagFn }
  return typeof w.gtag === 'function' ? w.gtag : null
}

// Item no formato de e-commerce do GA4
export type GaItem = {
  item_id: string
  item_name: string
  price?: number
  quantity?: number
  item_category?: string
}

// Registra a visita a uma página (SPA — chamado a cada mudança de rota).
// Padrão GA4 p/ SPA: dispara o evento page_view (o config inicial usa
// send_page_view:false, então quem conta as visitas é isto aqui).
export function pageview(url: string) {
  const g = getGtag()
  if (!g || !GA_ID) return
  g('event', 'page_view', {
    page_path: url,
    page_location: typeof window !== 'undefined' ? window.location.origin + url : url,
  })
}

// Evento genérico
export function trackEvent(name: string, params?: Record<string, unknown>) {
  const g = getGtag()
  if (!g) return
  g('event', name, params ?? {})
}

// ——— Eventos de e-commerce (funil de venda) ———

export function trackAddToCart(item: GaItem) {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [item],
  })
}

export function trackBeginCheckout(items: GaItem[], value: number) {
  trackEvent('begin_checkout', { currency: 'BRL', value, items })
}

// A CONVERSÃO. transactionId = id do pedido (evita contar 2x o mesmo pedido no GA).
export function trackPurchase(opts: { transactionId: string; value: number; items: GaItem[] }) {
  trackEvent('purchase', {
    transaction_id: opts.transactionId,
    currency: 'BRL',
    value: opts.value,
    items: opts.items,
  })
}
