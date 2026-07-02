// app/sitemap.ts
// Mapa do site pro Google (e outros buscadores) acharem TODAS as páginas —
// incluindo os 314+ produtos. Gerado automaticamente do catálogo.
// Acessível em https://grapetools.com.br/sitemap.xml

import type { MetadataRoute } from 'next'
import { products } from '@/lib/data'

const BASE = 'https://grapetools.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  // Páginas fixas públicas (as privadas/login ficam de fora — ver robots.ts)
  const rotasFixas: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/eletricista', priority: 0.7 },
    { path: '/marceneiro', priority: 0.7 },
    { path: '/politica-de-privacidade', priority: 0.3 },
    { path: '/trocas-e-devolucoes', priority: 0.3 },
  ]

  const fixas: MetadataRoute.Sitemap = rotasFixas.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly',
    priority,
  }))

  // Uma entrada por produto (deduplicando slugs, por segurança)
  const vistos = new Set<string>()
  const produtos: MetadataRoute.Sitemap = []
  for (const p of products) {
    if (!p.slug || vistos.has(p.slug)) continue
    vistos.add(p.slug)
    produtos.push({
      url: `${BASE}/${p.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  return [...fixas, ...produtos]
}
