import type { NextConfig } from "next";

// Cabeçalhos de segurança aplicados a todas as páginas.
// (CSP — Content-Security-Policy — foi deixado de fora de propósito: exige
//  testar página por página por causa de Supabase/Pagar.me/Google, fica como
//  endurecimento futuro.)
const securityHeaders = [
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
