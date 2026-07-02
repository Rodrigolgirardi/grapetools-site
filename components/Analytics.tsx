'use client'

// components/Analytics.tsx
// Carrega o Google Analytics 4 SÓ se a env NEXT_PUBLIC_GA_ID estiver configurada.
// Sem ela, não renderiza nada (nenhum script, zero impacto). Registra a visita a
// cada mudança de rota (o site é SPA, então a navegação não recarrega a página).

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { GA_ID, pageview } from '@/lib/analytics'

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const primeira = useRef(true)
  useEffect(() => {
    // A 1ª visita já é contada pelo gtag('config') no load — aqui só contamos as
    // navegações seguintes (SPA), evitando perder a inicial ou contá-la duas vezes.
    if (primeira.current) {
      primeira.current = false
      return
    }
    const qs = searchParams?.toString()
    pageview(qs ? `${pathname}?${qs}` : pathname)
  }, [pathname, searchParams])
  return null
}

export function Analytics() {
  if (!GA_ID) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      {/* useSearchParams exige Suspense */}
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  )
}
