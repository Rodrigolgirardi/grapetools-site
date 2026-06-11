'use client'

import "./favoritos.css"
import { useEffect, useState } from 'react'
import { products, Product } from '@/lib/data'
import { formatCurrency } from '@/lib/pricing'
import { ProductVisual } from '@/components/ProductVisual'
import { Heart, X, ShoppingCart } from 'lucide-react'
import { BackToSite } from '@/components/BackToSite'

export default function FavoritosPage() {
  const [favIds, setFavIds] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('grapetools_favoritos')
    if (saved) setFavIds(JSON.parse(saved))
    setLoaded(true)

    function handleStorage(e: StorageEvent) {
      if (e.key === 'grapetools_favoritos' && e.newValue) {
        setFavIds(JSON.parse(e.newValue))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function removeFav(prefix: string) {
    const next = favIds.filter(id => id !== prefix)
    setFavIds(next)
    localStorage.setItem('grapetools_favoritos', JSON.stringify(next))
  }

  function clearAll() {
    setFavIds([])
    localStorage.setItem('grapetools_favoritos', JSON.stringify([]))
  }

  const favProducts = products.filter(p => favIds.includes(p.prefix))

  if (!loaded) {
    return (
      <main className="favPage">
        <div className="favLoading">
          <div className="favLoadingSpinner" />
        </div>
      </main>
    )
  }

  return (
    <>
      <BackToSite />
      <main className="favPage">
      <div className="favContainer">

        {/* Header */}
        <div className="favHeader">
          <div>
            <h1 className="favTitle">
              <Heart size={22} fill="currentColor" />
              Favoritos
            </h1>
            <p className="favSubtitle">
              {favProducts.length === 0
                ? 'Nenhum produto salvo ainda'
                : `${favProducts.length} ${favProducts.length === 1 ? 'produto salvo' : 'produtos salvos'}`}
            </p>
          </div>
          {favProducts.length > 0 && (
            <button className="favClearBtn" onClick={clearAll}>
              <X size={14} />
              Limpar tudo
            </button>
          )}
        </div>

        {/* Empty state */}
        {favProducts.length === 0 && (
          <div className="favEmpty">
            <div className="favEmptyIcon">
              <Heart size={40} />
            </div>
            <h2>Nenhum favorito ainda</h2>
            <p>Clique no ♡ em qualquer produto para salvar aqui</p>
            <a href="/" className="favEmptyBtn">Ver produtos</a>
          </div>
        )}

        {/* Grid de produtos */}
        {favProducts.length > 0 && (
          <div className="favGrid">
            {favProducts.map(product => {
              const lowestPrice = Math.min(
                ...product.variations.flatMap(v =>
                  v.tiers.map(t => t.price)
                )
              )
              const highestPrice = Math.max(
                ...product.variations.flatMap(v =>
                  v.tiers.map(t => t.price)
                )
              )

              return (
                <div key={product.prefix} className="favCard">
                  {/* Botão remover */}
                  <button
                    className="favCardRemove"
                    onClick={() => removeFav(product.prefix)}
                    aria-label="Remover dos favoritos"
                  >
                    <X size={14} />
                  </button>

                  {/* Imagem */}
                  <a href={`/${product.slug}`} className="favCardImage">
                    <ProductVisual product={product} />
                  </a>

                  {/* Info */}
                  <div className="favCardInfo">
                    <p className="favCardCategory">{product.category} · {product.subcategory}</p>
                    <a href={`/${product.slug}`} className="favCardName">{product.name}</a>

                    {/* Preço */}
                    <div className="favCardPrice">
                      {product.variations.length > 1 || product.variations[0].tiers.length > 1 ? (
                        <span>
                          a partir de <strong>{formatCurrency(lowestPrice)}</strong>
                        </span>
                      ) : (
                        <strong>{formatCurrency(lowestPrice)}</strong>
                      )}
                      <span className="favCardUnit">/ unid.</span>
                    </div>

                    {/* Variações */}
                    {product.variations.length > 1 && (
                      <p className="favCardVars">
                        {product.variations.length} variações disponíveis
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="favCardActions">
                    <a href={`/${product.slug}`} className="favCardBtn favCardBtnPrimary">
                      Ver produto
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </main>
    </>
  )
}
