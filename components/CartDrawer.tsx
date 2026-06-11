"use client";

import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency, getTierForQuantity } from "@/lib/pricing";
import { products } from "@/lib/data";

type CartLine = {
  sku: string;
  quantity: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  onUpdate: (sku: string, qty: number) => void;
};

export function CartDrawer({ open, onClose, cart, onUpdate }: Props) {
  const lines = products.flatMap((p) =>
    p.variations
      .filter((v) => cart[v.sku])
      .map((v) => {
        const quantity = cart[v.sku];
        const tier = getTierForQuantity(v.tiers, quantity);
        return { product: p, variation: v, quantity, tier, total: tier.price * quantity };
      })
  );

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="cartDrawerOverlay" onClick={onClose} />
      )}

      {/* Drawer */}
      <aside className={`cartDrawer ${open ? "open" : ""}`} aria-label="Carrinho">
        {/* Header */}
        <div className="cartDrawerHead">
          <div className="cartDrawerHeadLeft">
            <ShoppingCart size={18} />
            <strong>Carrinho de compras</strong>
          </div>
          <button className="cartDrawerClose" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Itens */}
        <div className="cartDrawerBody">
          {lines.length === 0 ? (
            <div className="cartDrawerEmpty">
              <ShoppingCart size={40} style={{ color: "var(--line)" }} />
              <span>Carrinho vazio</span>
              <small>Adicione produtos para continuar</small>
            </div>
          ) : (
            lines.map(({ product, variation, quantity, tier, total }) => (
              <div key={variation.sku} className="cartDrawerItem">
                <div className="cartDrawerItemImg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/products/${variation.sku.replace(/\./g, "-")}.png`}
                    alt={product.name}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = `/products/${variation.sku.replace(/\./g, "-")}.jpg`;
                      img.onerror = () => { img.style.display = "none"; };
                    }}
                  />
                </div>
                <div className="cartDrawerItemInfo">
                  <a href={`/${product.slug}`} className="cartDrawerItemName">{product.name}</a>
                  {variation.label !== product.name && (
                    <span className="cartDrawerItemVariant">{variation.label}</span>
                  )}
                  <div className="cartDrawerItemPriceRow">
                    <span className="cartDrawerItemTier">{tier.label}+ un. · {formatCurrency(tier.price)}/un.</span>
                    <button
                      className="cartDrawerRemove"
                      onClick={() => onUpdate(variation.sku, 0)}
                      aria-label="Remover"
                    >
                      <Trash2 size={13} />
                      Remover
                    </button>
                  </div>
                  <div className="cartDrawerQtyRow">
                    <div className="cartDrawerQty">
                      <button onClick={() => onUpdate(variation.sku, Math.max(0, quantity - 1))}>
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => onUpdate(variation.sku, Math.max(0, Number(e.target.value)))}
                      />
                      <button onClick={() => onUpdate(variation.sku, quantity + 1)}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <strong className="cartDrawerItemTotal">{formatCurrency(total)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="cartDrawerFooter">
            <div className="cartDrawerSubtotal">
              <span>Subtotal ({totalQty} un.)</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="cartDrawerPix">
              <span>Ou <strong>{formatCurrency(subtotal)}</strong> com Pix</span>
            </div>
            <a href="/checkout" className="cartDrawerCheckout">
              Iniciar compra
            </a>
            <a href="/cart" className="cartDrawerCartBtn" onClick={onClose}>
              Ver carrinho completo
            </a>
            <button className="cartDrawerContinue" onClick={onClose}>
              Ver mais produtos
            </button>          </div>
        )}
      </aside>
    </>
  );
}
