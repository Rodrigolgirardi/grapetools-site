'use client'

// components/MetaPixel.tsx
// Carrega o Meta Pixel (Facebook/Instagram) SÓ se a env NEXT_PUBLIC_META_PIXEL_ID
// estiver configurada. Sem ela, não renderiza nada (nenhum script, zero impacto).
// Espelha components/Analytics.tsx: registra a visita a cada mudança de rota,
// porque o site é SPA e a navegação não recarrega a página.

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { META_PIXEL_ID, metaPageview } from '@/lib/meta-pixel'

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const primeira = useRef(true)
  useEffect(() => {
    // A 1ª visita já é contada pelo fbq('track','PageView') do snippet de init —
    // aqui só contamos as navegações seguintes (SPA).
    if (primeira.current) {
      primeira.current = false
      return
    }
    metaPageview()
  }, [pathname, searchParams])
  return null
}

export function MetaPixel() {
  if (!META_PIXEL_ID) return null
  return (
    <>
      {/* Snippet oficial da Meta: cria a fila do fbq e carrega o fbevents.js */}
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      {/* useSearchParams exige Suspense */}
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  )
}
