// instrumentation.ts
// Carrega a config do Sentry conforme o runtime (Node/Edge) e captura erros de
// requisição das rotas do servidor.
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Reporta erros das rotas/handlers do servidor ao Sentry (no-op se dormente).
export const onRequestError = Sentry.captureRequestError
