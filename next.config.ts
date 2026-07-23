import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content-Security-Policy: limita de onde scripts/conexões/imagens podem vir.
// Libera só o que o site usa: Supabase (auth/db/realtime) e Pagar.me (tokenização
// do cartão). 'unsafe-inline'/'unsafe-eval' são exigidos pelo Next (sem nonce); o
// ganho real aqui é bloquear script EXTERNO, exfiltração (connect-src) e clickjacking.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.pagar.me https://*.sentry.io",
  "frame-src 'self' https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// Cabeçalhos de segurança aplicados a todas as páginas.
const securityHeaders = [
  // Content-Security-Policy (anti-XSS / anti-injeção de script externo)
  { key: "Content-Security-Policy", value: csp },
  // Impede que o site seja embutido em iframe de terceiros (anti-clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Impede o navegador de "adivinhar" tipos de arquivo (anti-MIME-sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla quanta informação de origem vaza ao navegar para outros sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs sensíveis que o site não usa
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Força HTTPS por 2 anos (só tem efeito quando publicado em https; ignorado em http://localhost)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Serve as imagens direto (sem o otimizador do Next, que roda o sharp em
  // worker e estava crashando — "Jest worker exceeding retry limit"). Resolve
  // o erro na pagina de produto. Para producao, depois da pra reativar e
  // comprimir as imagens grandes.
  images: { unoptimized: true },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Redirects 301 dos endereços antigos que sumiram ao unificar produtos (mão
  // francesa branca/preta -> unificada; trilho branco/preto -> unificado). Preserva
  // SEO e não perde a visita de quem chega por link antigo.
  async redirects() {
    return [
      { source: "/14-maof-br", destination: "/14-maof", permanent: true },
      { source: "/14-maof-pt", destination: "/14-maof", permanent: true },
      { source: "/14-ts-br", destination: "/trilho-simples", permanent: true },
      { source: "/25-ts-100", destination: "/trilho-simples", permanent: true },
      // Trava Porta Magnético separada em 3 produtos -> o antigo vai pro Longo.
      { source: "/3-tpor", destination: "/3-tpor-long", permanent: true },
      // Mão Francesa Leve branca + preta unificadas numa página só.
      { source: "/6-maof-br", destination: "/6-maof", permanent: true },
      { source: "/6-maof-pt", destination: "/6-maof", permanent: true },
      // Bucha Bolt 3/16 + 1/4 unificadas -> "Bucha para Gesso/Drywall com Parafuso".
      { source: "/13-blt-3", destination: "/13-blt", permanent: true },
      { source: "/13-blt-1", destination: "/13-blt", permanent: true },
    ];
  },
};

// Só aplica o Sentry (integração de build + upload de source maps) quando o DSN
// público está configurado. Sem DSN: build normal e ZERO Sentry no bundle do
// cliente (dormente de verdade). Com DSN + redeploy: monitor ativo.
const sentryAtivo = !!process.env.NEXT_PUBLIC_SENTRY_DSN;

export default sentryAtivo
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      widenClientFileUpload: true,
      disableLogger: true,
    })
  : nextConfig;
