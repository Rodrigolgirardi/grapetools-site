"use client";

import { Heart, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { products } from "@/lib/data";
import { Logo } from "./Logo";
import { formatCurrency } from "@/lib/pricing";
import { useAuth, getFirstName } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase-client";

type HeaderProps = {
  cartCount: number;
  onSearch: (term: string) => void;
  onCartOpen?: () => void;
};

export function Header({ cartCount, onSearch, onCartOpen }: HeaderProps) {
  const [term, setTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [favIds, setFavIds] = useState<string[]>([]);
  const loginWrapRef = useRef<HTMLDivElement>(null);
  const favWrapRef = useRef<HTMLDivElement>(null);
  const favBtnRef = useRef<HTMLButtonElement>(null);

  const { user, loading } = useAuth();
  const firstName = getFirstName(user);
  const initials = firstName.charAt(0).toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // Carregar favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("grapetools_favoritos");
    if (saved) setFavIds(JSON.parse(saved));

    // Escutar mudanças de favoritos de outras páginas
    function handleStorage(e: StorageEvent) {
      if (e.key === "grapetools_favoritos" && e.newValue) {
        setFavIds(JSON.parse(e.newValue));
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (favWrapRef.current && !favWrapRef.current.contains(e.target as Node)) setFavOpen(false);
      if (loginWrapRef.current && !loginWrapRef.current.contains(e.target as Node)) setLoginOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const favProducts = products.filter(p => favIds.includes(p.prefix));

  function removeFav(prefix: string) {
    const next = favIds.filter(id => id !== prefix);
    setFavIds(next);
    localStorage.setItem("grapetools_favoritos", JSON.stringify(next));
  }

  function positionFavDropdown() {
    if (!favBtnRef.current || !favWrapRef.current) return;
    const rect = favBtnRef.current.getBoundingClientRect();
    const dropdown = favWrapRef.current.querySelector('.favDropdown') as HTMLElement;
    if (dropdown) {
      const dropW = 300;
      const margin = 8;
      const rightEdge = window.innerWidth - rect.right;
      const leftEdge = rect.right - dropW;
      const clampedRight = leftEdge < margin
        ? window.innerWidth - dropW - margin
        : rightEdge;
      dropdown.style.top = `${rect.bottom + 6}px`;
      dropdown.style.left = 'auto';
      if (window.innerWidth < 420) {
        dropdown.style.right = `${margin}px`;
        dropdown.style.left = `${margin}px`;
        dropdown.style.width = 'auto';
      } else {
        dropdown.style.right = `${Math.max(margin, clampedRight)}px`;
        dropdown.style.width = `${dropW}px`;
      }
    }
  }



  const suggestions = useMemo(() => {
    if (term.trim().length < 2) return [];
    const normalized = term.toLowerCase();
    return products
      .filter((p) =>
        [p.name, p.brand, p.supplier, p.prefix, ...p.keywords,
          ...p.variations.map((v) => v.sku)]
          .join(" ").toLowerCase().includes(normalized)
      )
      .slice(0, 7);
  }, [term]);

  function handleSearch(value: string) {
    setTerm(value);
    onSearch(value);
  }

  return (
    <header className="siteHeader">
      <div className="headerShell">
        <Logo white />

        <div className="searchBox">
          <Search size={18} style={{ color: "var(--muted)", flexShrink: 0 }} />
          <input
            value={term}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Buscar produto, SKU, marca ou categoria…"
            aria-label="Pesquisar produtos"
          />
          {term && (
            <button className="searchClear" onClick={() => handleSearch("")} aria-label="Limpar">
              <X size={14} />
            </button>
          )}
          {focused && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((p) => (
                <a key={p.prefix} href={`/${p.slug}`} onClick={() => handleSearch(p.name)}>
                  <strong>{p.name}</strong>
                  <span>{p.category} · {p.supplier}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="headerActions">
          {/* LOGIN / USUÁRIO LOGADO */}
          <div className="headerLoginWrap" ref={loginWrapRef}>
            {loading ? (
              <div className="headerLoginLoading" />
            ) : user ? (
              <>
                <button className="headerUserBtn" onClick={() => setLoginOpen(o => !o)}>
                  <span className="headerUserAvatar">{initials}</span>
                  <span className="headerUserName">{firstName}</span>
                </button>
                <div className={`headerLoginDropdown${loginOpen ? " open" : ""}`}>
                  <a href="/cliente" className="headerLoginItem"><UserRound size={14} />Minha conta</a>
                  <a href="/pedidos" className="headerLoginItem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Meus pedidos
                  </a>
                  <div className="headerLoginDivider" />
                  <button onClick={handleLogout} className="headerLoginItem headerLoginItemSair">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <a href="/login" className="headerLogin">
                <UserRound size={16} />
                <span>Entrar</span>
              </a>
            )}
          </div>

          {/* FAVORITOS */}
          <div className="favWrap" ref={favWrapRef}>
            <button
              ref={favBtnRef}
              className="headerFavBtn"
              onClick={() => { positionFavDropdown(); setFavOpen(!favOpen); }}
              aria-label="Favoritos"
            >
              <Heart size={16} />
              <span>Favoritos</span>
              {favIds.length > 0 && <span className="headerCartBadge">{favIds.length}</span>}
            </button>

            {favOpen && (
              <div className="favDropdown">
                <div className="favDropdownHead">
                  <strong>Favoritos</strong>
                  <span>{favProducts.length} {favProducts.length === 1 ? "produto" : "produtos"}</span>
                </div>
                {favProducts.length === 0 ? (
                  <div className="favDropdownEmpty">
                    <Heart size={28} style={{ color: "var(--line)" }} />
                    <span>Nenhum favorito ainda</span>
                    <small>Clique no ♡ em qualquer produto</small>
                  </div>
                ) : (
                  <div className="favDropdownList">
                    {favProducts.map((p) => (
                      <div key={p.prefix} className="favDropdownItem">
                        <a href={`/${p.slug}`} className="favDropdownInfo">
                          <strong>{p.name}</strong>
                          <span>{formatCurrency(p.variations[0].tiers[p.variations[0].tiers.length - 1].price)} <em>a partir de</em></span>
                        </a>
                        <button className="favDropdownRemove" onClick={() => removeFav(p.prefix)} aria-label="Remover">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <a href="/" className="favDropdownFooter">Ver todos os produtos →</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CARRINHO */}
          <button
            className="headerCart"
            aria-label={`Carrinho — ${cartCount} itens`}
            onClick={onCartOpen}
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && <span className="headerCartBadge">{cartCount}</span>}
            <span className="headerCartLabel">Carrinho</span>
          </button>
        </div>
      </div>
    </header>
  );
}
