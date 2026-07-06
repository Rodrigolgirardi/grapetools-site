'use client'

// app/global-error.tsx
// Última rede: se a página quebrar ao renderizar (tela branca), mostra uma tela
// amigável em vez do erro cru, e reporta ao Sentry (se ativo — import dinâmico
// guardado pelo DSN, então não pesa nada quando dormente).

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs').then((Sentry) => Sentry.captureException(error)).catch(() => {})
    }
  }, [error])

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, Arial, sans-serif',
          background: '#f7f6fb',
          color: '#0f0a1e',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🍇</div>
          <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>Algo deu errado</h1>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.5, margin: '0 0 20px' }}>
            Tivemos um probleminha ao carregar esta página. Tente novamente.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#5b21b6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '11px 22px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tentar de novo
          </button>
          <div style={{ marginTop: 14 }}>
            <a href="/" style={{ color: '#6d28d9', fontSize: 13, textDecoration: 'none' }}>
              Voltar para a loja
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
