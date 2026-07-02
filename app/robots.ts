// app/robots.ts
// Diz aos buscadores o que podem indexar. Libera a loja e os produtos, bloqueia
// áreas privadas/transacionais (não faz sentido o Google indexar carrinho, login,
// painel, etc.). Aponta pro sitemap.

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/cliente',
        '/checkout',
        '/cart',
        '/pedidos',
        '/favoritos',
        '/login',
        '/api/',
      ],
    },
    sitemap: 'https://grapetools.com.br/sitemap.xml',
  }
}
