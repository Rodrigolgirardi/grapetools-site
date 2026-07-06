// instrumentation-client.ts
// Monitor de erros no NAVEGADOR — DORMENTE e SEM PESO no bundle até você setar a env
// NEXT_PUBLIC_SENTRY_DSN. O import é dinâmico e guardado pelo DSN (que o Next injeta
// no build): sem DSN, o webpack remove o Sentry do bundle do cliente (zero KB). Com
// DSN, ele carrega num chunk separado e ativa o monitor.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    })
  })
}
