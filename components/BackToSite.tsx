'use client'

// components/BackToSite.tsx
// Barra de navegação simples para páginas de conta (/cliente, /favoritos, /cliente/perfil)

export function BackToSite() {
  return (
    <div className="backToSiteBar">
      <a href="/" className="backToSiteLink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar ao catálogo
      </a>
    </div>
  )
}
