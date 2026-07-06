// sentry.server.config.ts
// Monitor de erros no SERVIDOR (rotas /api, server components). DORMENTE: só liga se
// houver DSN configurado no host (env SENTRY_DSN). Sem DSN, nada é enviado.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1, // 10% das requisições p/ performance (barato)
    sendDefaultPii: false, // não manda dados pessoais do cliente
  })
}
