'use client'

// components/BackToSite.tsx
// Barra das páginas internas (carrinho, checkout, conta, pedidos…): só a logo
// Grape Tools no canto esquerdo — clicar nela volta pra home.

export function BackToSite() {
  return (
    <div className="backToSiteBar">
      <a href="/" className="backToSiteLogo" aria-label="Ir para a página inicial">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-h-branca.png" alt="Grape Tools" />
      </a>
    </div>
  )
}
