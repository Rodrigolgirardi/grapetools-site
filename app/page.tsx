"use client";

import { BadgePercent, ChevronDown, ChevronRight, SlidersHorizontal, X, Menu } from "lucide-react";
import { useEffect, useRef, useMemo, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ProductVisual } from "@/components/ProductVisual";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, suppliers, type Product } from "@/lib/data";
import { formatCurrency, getTierForQuantity } from "@/lib/pricing";
import { useCart } from "@/hooks/useCart";

type SortOption = "best" | "high" | "low" | "sold";

// Tira acentos e deixa minúsculo, pra busca funcionar com ou sem acento
// (ex: "rodizio" encontra "rodízio").
function semAcento(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const CATEGORY_COUNTS = Object.fromEntries(
  categories.map((c) => [c, products.filter((p) => p.category === c).length])
);
const SUPPLIER_COUNTS = Object.fromEntries(
  suppliers.map((s) => [s, products.filter((p) => p.supplier === s).length])
);

function BannerCarousel({ setCategory }: { setCategory: (v: string) => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const banners = [
    {
      content: (
        <a href="#produtos" className="bannerImageLink" aria-label="Ver catálogo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner-home.png" alt="Grape Tools" className="bannerImage" style={{ height: "220px", objectFit: "fill" }} />
        </a>
      ),
    },
    {
      content: (
        <div className="bannerSlide bannerSlide2">
          <div className="bannerSlideContent">
            <span className="bannerSlideEyebrow">Exclusivo Grape Tools</span>
            <h2 className="bannerSlideTitle">Marca Própria<br /><em>com qualidade premium</em></h2>
            <div className="bannerSlideTags">
              {["Conectores", "Discos de Lixa", "Ferragens", "Fixação"].map((t) => (
                <span key={t} className="bannerSlideTag">{t}</span>
              ))}
            </div>
            <button className="bannerSlideBtn" onClick={() => setCategory("Ferragens")}>Ver produtos →</button>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="bannerSlide bannerSlide3">
          <div className="bannerSlideContent">
            <span className="bannerSlideEyebrow">Quanto mais leva, mais economiza</span>
            <h2 className="bannerSlideTitle">Desconto<br /><em>até 28% OFF</em></h2>
            <div className="bannerSlideTiers">
              <div><span>50 un.</span><strong>-10%</strong></div>
              <div><span>100 un.</span><strong>-18%</strong></div>
              <div><span>500 un.</span><strong>-28%</strong></div>
            </div>
            <a href="#produtos" className="bannerSlideBtn">Comprar agora →</a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="carouselWrap">
      <div className="carouselTrack" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b, i) => (
          <div key={i} className="carouselSlide">{b.content}</div>
        ))}
      </div>
      <div className="carouselDots">
        {banners.map((_, i) => (
          <button key={i} className={`carouselDot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} aria-label={`Banner ${i + 1}`} />
        ))}
      </div>
      <button className="carouselArrow left" onClick={() => setCurrent((c) => (c - 1 + 3) % 3)}>‹</button>
      <button className="carouselArrow right" onClick={() => setCurrent((c) => (c + 1) % 3)}>›</button>
    </div>
  );
}

const PERFIS = [
  {
    id: "eletricista",
    label: "Eletricista",
    emoji: "⚡",
    desc: "Conectores, disjuntores, cabos e fixação",
    banner: "A loja do eletricista",
    bannerSub: "Conectores · Cabos · Disjuntores · Abraçadeiras",
    cor: "#1e3a5f",
    corAcento: "#3b82f6",
    categorias: ["Elétrica", "Fixação"],
    keywords: ["conector", "disjuntor", "cabo", "fio", "botao", "chicote", "abraçadeira"],
    recomendados: ["Conectores", "Cabos e Fios", "Disjuntores", "Abraçadeiras", "Fixação de Cabos"],
  },
  {
    id: "marceneiro",
    label: "Marceneiro",
    emoji: "🪵",
    desc: "Corrediças, dobradiças, puxadores e suportes",
    banner: "A loja do marceneiro",
    bannerSub: "Corrediças · Dobradiças · Puxadores · Rodízios · Suportes",
    cor: "#3b1f0a",
    corAcento: "#d97706",
    categorias: ["Ferragens"],
    keywords: ["corredica", "dobradica", "puxador", "suporte", "trilho", "pe", "rodizio"],
    recomendados: ["Corrediças", "Dobradiças", "Puxadores", "Rodízios", "Suportes"],
  },
  {
    id: "instalador",
    label: "Instalador",
    emoji: "🔩",
    desc: "Ferragens, travas, rodízios e fixação",
    banner: "A loja do instalador",
    bannerSub: "Travas · Rodízios · Buchas · Parafusos · Mãos Francesas",
    cor: "#1a1a2e",
    corAcento: "#7c3aed",
    categorias: ["Ferragens", "Fixação"],
    keywords: ["trava", "rodizio", "bucha", "parafuso", "mao francesa", "gancho"],
    recomendados: ["Travas", "Rodízios", "Buchas", "Parafusos", "Mãos Francesas"],
  },
  {
    id: "pintor",
    label: "Pintor",
    emoji: "🎨",
    desc: "Discos abrasivos, lixas e ferramentas de acabamento",
    banner: "A loja do pintor",
    bannerSub: "Discos de Lixa · Disco Flap · Boinas · Suportes",
    cor: "#1a2e1a",
    corAcento: "#16a34a",
    categorias: ["Abrasivos", "Ferramentas"],
    keywords: ["lixa", "disco", "abrasivo", "suporte", "esponja", "flap", "boina"],
    recomendados: ["Discos de Lixa", "Disco Flap", "Discos Especiais", "Suportes"],
  },
  {
    id: "diy",
    label: "DIY / Casa",
    emoji: "🏠",
    desc: "Utilidades, organização e ferramentas gerais",
    banner: "Tudo para sua casa",
    bannerSub: "Organização · Fixação · Ferramentas · Utilidades",
    cor: "#1f2937",
    corAcento: "#f59e0b",
    categorias: ["Utilidades", "Ferramentas", "Fixação"],
    keywords: ["suporte", "gancho", "vassoura", "balanca", "porta", "trava"],
    recomendados: ["Organização", "Suportes", "Ganchos", "Banheiro"],
  },
  {
    id: "lojista",
    label: "Lojista / Revenda",
    emoji: "🏪",
    desc: "Todos os produtos com desconto por volume",
    banner: "Atacado para lojistas",
    bannerSub: "314 SKUs · Desconto até 28% · NF emitida",
    cor: "#2e1065",
    corAcento: "#a855f7",
    categorias: [],
    keywords: [],
    recomendados: [],
  },
];

function ProfissaoModal({ onSelect, onClose }: {
  onSelect: (perfil: typeof PERFIS[0]) => void;
  onClose: () => void;
}) {
  return (
    <div className="profissaoOverlay" onClick={onClose}>
      <div className="profissaoModal" onClick={(e) => e.stopPropagation()}>
        <div className="profissaoModalHead">
          <div>
            <span className="profissaoModalEyebrow">✨ Filtro inteligente</span>
            <h2 className="profissaoModalTitle">Qual é a sua profissão?</h2>
            <p className="profissaoModalSub">Vamos mostrar os produtos certos para você.</p>
          </div>
          <button className="profissaoModalClose" onClick={onClose}>✕</button>
        </div>
        <div className="profissaoGrid">
          {PERFIS.map((p) => (
            <button
              key={p.id}
              className="profissaoCard"
              onClick={() => { onSelect(p); onClose(); }}
            >
              <span className="profissaoEmoji">{p.emoji}</span>
              <strong>{p.label}</strong>
              <span>{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const SIDE_CATS = [
  { cat: "Ferragens", subs: ["Pistões", "Rodízios", "Dobradiças", "Fechaduras", "Travas", "Cadeados", "Corrediças", "Puxadores"] },
  { cat: "Abrasivos", subs: ["Discos de Lixa", "Discos com Furos", "Disco Flap", "Discos Especiais"] },
  { cat: "Elétrica", subs: ["Conectores", "Cabos e Fios", "Disjuntores", "Botões", "Iluminação"] },
  { cat: "Fixação", subs: ["Buchas", "Parafusos", "Brocas", "Ganchos", "Colas", "Abraçadeiras"] },
  { cat: "Ferramentas", subs: ["Lâminas", "Medição", "Suportes"] },
  { cat: "Utilidades", subs: ["Organização", "Banheiro"] },
];

function SidePanelCategories({ category, setCategory, setSideOpen }: {
  category: string;
  setCategory: (v: string) => void;
  setSideOpen: (v: boolean) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(category !== "Todas" ? category : null);

  function toggleExpand(cat: string) {
    setExpanded(expanded === cat ? null : cat);
  }

  return (
    <>
      {SIDE_CATS.map(({ cat, subs }) => (
        <div key={cat} className="sidePanelGroup">
          <button
            className={`sidePanelCat ${category === cat ? "active" : ""}`}
            onClick={() => toggleExpand(cat)}
          >
            <span className="sidePanelCatLabel">
              <span className={`sidePanelChevron ${expanded === cat ? "open" : ""}`}>▶</span>
              {cat}
            </span>
            <span className="sidePanelCount">{products.filter(p => p.category === cat).length}</span>
          </button>
          {expanded === cat && (
            <div className="sidePanelSubs">
              <button
                className={`sidePanelSub sidePanelSubAll ${category === cat ? "active" : ""}`}
                onClick={() => { setCategory(cat); setSideOpen(false); }}
              >
                Todos em {cat}
              </button>
              {subs.map((sub) => (
                <button key={sub} className="sidePanelSub" onClick={() => { setCategory(cat); setSideOpen(false); }}>
                  <ChevronRight size={11} />
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function CategoryDropdown({ category, setCategory, supplier, setSupplier }: {
  category: string;
  setCategory: (v: string) => void;
  supplier: string;
  setSupplier: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"categoria" | "fornecedor">("categoria");
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen(!open);
  }

  const activeFilter = category !== "Todas" ? category : supplier !== "Todos" ? supplier : null;

  return (
    <div className="catDropdownWrap" ref={ref}>
      <button
        ref={btnRef}
        className={`categoryPill catDropdownBtn ${open || activeFilter ? "active" : ""}`}
        onClick={handleToggle}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        Categorias
        {activeFilter && <span className="catDropdownBadge">1</span>}
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div className="catDropdownMenu" style={{ top: menuPos.top, left: menuPos.left }}>
          <div className="catDropdownTabs">
            <button className={`catDropdownTab ${tab === "categoria" ? "active" : ""}`} onClick={() => setTab("categoria")}>Categoria</button>
            <button className={`catDropdownTab ${tab === "fornecedor" ? "active" : ""}`} onClick={() => setTab("fornecedor")}>Fornecedor</button>
          </div>

          {tab === "categoria" && (
            <div className="catDropdownList">
              <button
                className={`catDropdownItem ${category === "Todas" ? "active" : ""}`}
                onClick={() => { setCategory("Todas"); setOpen(false); }}
              >
                <span>Todas as categorias</span>
                <span className="catDropdownCount">{products.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`catDropdownItem ${category === c ? "active" : ""}`}
                  onClick={() => { setCategory(c); setOpen(false); }}
                >
                  <span>
                    <ChevronRight size={12} style={{ opacity: 0.4 }} />
                    {c}
                  </span>
                  <span className="catDropdownCount">{CATEGORY_COUNTS[c]}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "fornecedor" && (
            <div className="catDropdownList">
              <button
                className={`catDropdownItem ${supplier === "Todos" ? "active" : ""}`}
                onClick={() => { setSupplier("Todos"); setOpen(false); }}
              >
                <span>Todos os fornecedores</span>
                <span className="catDropdownCount">{products.length}</span>
              </button>
              {suppliers.map((s) => (
                <button
                  key={s}
                  className={`catDropdownItem ${supplier === s ? "active" : ""}`}
                  onClick={() => { setSupplier(s); setOpen(false); }}
                >
                  <span>
                    <ChevronRight size={12} style={{ opacity: 0.4 }} />
                    {s}
                  </span>
                  <span className="catDropdownCount">{SUPPLIER_COUNTS[s]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [supplier, setSupplier] = useState("Todos");
  const [grapeOnly, setGrapeOnly] = useState(false);
  const [grapeLogoSrc, setGrapeLogoSrc] = useState("/grape-tools-logo.png");
  const [grapeLogoErro, setGrapeLogoErro] = useState(false);
  const [sort, setSort] = useState<SortOption>("best");
  const [sideOpen, setSideOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [profissaoOpen, setProfissaoOpen] = useState(false);
  const [perfilAtivo, setPerfilAtivo] = useState<typeof PERFIS[0] | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("grapetools_profissao");
    return saved ? (PERFIS.find(p => p.id === saved) ?? null) : null;
  });
  const { cart, addToCart: addToCartHook, updateQuantity } = useCart();

  const filteredProducts = useMemo(() => {
    const q = semAcento(query.trim());
    return products
      .filter((p) => {
        const text = semAcento([p.name, p.brand, p.supplier, p.description, p.prefix,
          ...p.keywords, ...p.variations.map((v) => v.sku)].join(" "));
        return (
          (!q || text.includes(q)) &&
          (!grapeOnly || p.prefix.startsWith("CH.")) &&
          (category === "Todas" || p.category === category) &&
          (supplier === "Todos" || p.supplier === supplier) &&
          (!perfilAtivo || perfilAtivo.categorias.length === 0 ||
            perfilAtivo.categorias.includes(p.category) ||
            perfilAtivo.keywords.some(k => text.includes(k)))
        );
      })
      .sort((a, b) => {
        const aPrice = a.variations[0].tiers[0].price;
        const bPrice = b.variations[0].tiers[0].price;
        if (sort === "high") return bPrice - aPrice;
        if (sort === "low") return aPrice - bPrice;
        if (sort === "sold") return b.sold - a.sold;
        return Number(b.isPromotion) - Number(a.isPromotion) || b.sold - a.sold;
      });
  }, [category, query, sort, supplier, grapeOnly, perfilAtivo]);

  const cartLines = products.flatMap((p) =>
    p.variations
      .filter((v) => cart[v.sku])
      .map((v) => {
        const quantity = cart[v.sku];
        const tier = getTierForQuantity(v.tiers, quantity);
        return { product: p, variation: v, quantity, tier, total: tier.price * quantity };
      })
  );

  const cartTotal = cartLines.reduce((s, l) => s + l.total, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.quantity, 0);

  function addProduct(_product: Product, sku: string, qty: number = 1) {
    addToCartHook(sku, qty);
  }

  const activeFilters = [
    grapeOnly && { label: "Grape Tools", clear: () => setGrapeOnly(false) },
    category !== "Todas" && { label: category, clear: () => setCategory("Todas") },
    supplier !== "Todos" && { label: supplier, clear: () => setSupplier("Todos") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <>
      <Header cartCount={cartCount} onSearch={setQuery} onCartOpen={() => setCartDrawerOpen(true)} />
      <main>

        {/* ── NAV BAR: CATEGORIAS + PILLS ── */}
        <div className="categoryPills">
          <button
            className={`categoryPill catDropdownBtn ${sideOpen ? "active" : ""}`}
            onClick={() => setSideOpen(true)}
          >
            <Menu size={15} />
            Categorias
            <ChevronDown size={13} />
          </button>

          <button
            className={`categoryPill profissaoBtn ${perfilAtivo ? "active" : ""}`}
            onClick={() => setProfissaoOpen(true)}
            title="Filtrar por profissão"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {perfilAtivo ? perfilAtivo.emoji + " " + perfilAtivo.label : "Minha profissão"}
            {perfilAtivo && (
              <span
                className="profissaoClear"
                onClick={(e) => { e.stopPropagation(); setPerfilAtivo(null); localStorage.removeItem("grapetools_profissao"); }}
                title="Remover filtro"
              >✕</span>
            )}
          </button>

          <button
            className={`categoryPill grapePill ${grapeOnly ? "active" : ""}`}
            onClick={() => { setGrapeOnly(true); setCategory("Todas"); }}
            title="Ver só os produtos da marca Grape Tools"
          >
            {grapeLogoErro ? (
              "Grape Tools"
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={grapeLogoSrc}
                alt="Grape Tools"
                className="grapePillImg"
                onError={() => {
                  // tenta .png, depois .jpg, depois mostra o texto
                  if (grapeLogoSrc.endsWith(".png")) setGrapeLogoSrc("/grape-tools-logo.jpg");
                  else setGrapeLogoErro(true);
                }}
              />
            )}
          </button>

          {[
            { label: "Top Ofertas", value: "ofertas", icon: <BadgePercent size={15}/> },
            { label: "Ferragens", value: "Ferragens", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg> },
            { label: "Abrasivos", value: "Abrasivos", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg> },
            { label: "Elétrica", value: "Elétrica", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
            { label: "Fixação", value: "Fixação", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M8 6h8M9 10h6M10 14h4"/></svg> },
            { label: "Ferramentas", value: "Ferramentas", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> },
            { label: "Utilidades", value: "Utilidades", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
          ].map(({ label, value, icon }) => (
            <button
              key={value}
              className={`categoryPill ${category === value && !grapeOnly ? "active" : ""}`}
              onClick={() => { setGrapeOnly(false); setCategory(value === "ofertas" ? "Todas" : value); }}
            >
              <span className="categoryPillIcon">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ── BANNER ── */}
        {/* ── BANNER / CARROSSEL ── */}
        {perfilAtivo ? (
          <div className="animatedBannerSlot">
            <div className="bannerPerfil" style={{ background: `linear-gradient(110deg, ${perfilAtivo.cor} 0%, ${perfilAtivo.corAcento}55 100%)` }}>
              <div className="bannerPerfilContent">
                <span className="bannerPerfilEmoji">{perfilAtivo.emoji}</span>
                <div>
                  <span className="bannerSlideEyebrow">Personalizado para você</span>
                  <h2 className="bannerSlideTitle">{perfilAtivo.banner}</h2>
                  <p className="bannerPerfilSub">{perfilAtivo.bannerSub}</p>
                </div>
              </div>
              <button className="bannerSlideBtn" onClick={() => setCategory("Todas")}>Ver meus produtos →</button>
            </div>
          </div>
        ) : (
          <BannerCarousel setCategory={setCategory} />
        )}

        {/* ── TRUST ── */}
        <div className="trustBar">
          <div className="trustBarInner">
            <span>✓ Nota fiscal emitida</span>
            <span>✓ Estoque nacional</span>
            <span>✓ Entrega para todo o Brasil</span>
            <span>✓ Compra por CNPJ ou CPF</span>
            <span>✓ Desconto progressivo automático</span>
          </div>
        </div>

        {/* ── MODAL PROFISSÃO ── */}
        {profissaoOpen && (
          <ProfissaoModal
            onSelect={(p) => {
              setPerfilAtivo(p);
              localStorage.setItem("grapetools_profissao", p.id);
            }}
            onClose={() => setProfissaoOpen(false)}
          />
        )}

        {/* ── PAINEL LATERAL AMAZON ── */}
        {sideOpen && (
          <div className="sideOverlay" onClick={() => setSideOpen(false)}>
            <aside className="sidePanelAmazon" onClick={(e) => e.stopPropagation()}>
              <div className="sidePanelHead">
                <strong>Categorias</strong>
                <button onClick={() => setSideOpen(false)} aria-label="Fechar"><X size={18}/></button>
              </div>
              <div className="sidePanelBody">
                <button
                  className={`sidePanelRoot ${category === "Todas" ? "active" : ""}`}
                  onClick={() => { setCategory("Todas"); setSideOpen(false); }}
                >
                  Todos os produtos
                  <span>{products.length}</span>
                </button>
                <SidePanelCategories
                  category={category}
                  setCategory={setCategory}
                  setSideOpen={setSideOpen}
                />
                <div className="sidePanelDivider">Fornecedor</div>
                <button
                  className={`sidePanelRoot ${supplier === "Todos" ? "active" : ""}`}
                  onClick={() => { setSupplier("Todos"); setSideOpen(false); }}
                >
                  Todos os fornecedores
                </button>
                {suppliers.map((s) => (
                  <button
                    key={s}
                    className={`sidePanelCat ${supplier === s ? "active" : ""}`}
                    onClick={() => { setSupplier(s); setSideOpen(false); }}
                  >
                    <span>{s}</span>
                    <span className="sidePanelCount">{products.filter(p => p.supplier === s).length}</span>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* ── MAIS VENDIDOS ── */}
        <div className="maisVendidosSection">
          <div className="maisVendidosInner">
            <div className="maisVendidosHead">
              <h2>🔥 Mais Vendidos</h2>
              <button className="maisVendidosLink" onClick={() => setSort("sold")}>Ver todos →</button>
            </div>
            <div className="maisVendidosGrid">
              {products.slice(0, 6).map((p) => (
                <a key={p.prefix} href={`/${p.slug}`} className="maisVendidosCard">
                  <div className="maisVendidosThumb">
                    <ProductVisual product={p} sku={p.variations[0].sku} />
                  </div>
                  {p.brand === "Grape Tools" && (
                    <span className="marcaPropriaBadge">Marca Própria</span>
                  )}
                  <strong>{p.name}</strong>
                  <span className="maisVendidosPrice">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      p.variations[0].tiers[p.variations[0].tiers.length - 1].price
                    )}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        <section className="commerceShell" id="produtos">
          <div className="productArea">
            {perfilAtivo && (
              <div className="perfilWelcome">
                <span>{perfilAtivo.emoji}</span>
                <div>
                  <strong>Bem-vindo{localStorage.getItem("grapetools_profissao") ? " de volta" : ""}, {perfilAtivo.label}!</strong>
                  <span>Mostrando produtos recomendados para você · <button onClick={() => { setPerfilAtivo(null); localStorage.removeItem("grapetools_profissao"); }}>Mudar profissão</button></span>
                </div>
              </div>
            )}
            <div className="sectionHead">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h2>{perfilAtivo ? `Para ${perfilAtivo.label}s` : "Produtos"}</h2>
                {perfilAtivo && (
                  <span className="activeFilterTag" style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" }}>
                    {perfilAtivo.emoji} {perfilAtivo.label}
                    <button onClick={() => { setPerfilAtivo(null); localStorage.removeItem("grapetools_profissao"); }}><X size={11}/></button>
                  </span>
                )}
                {activeFilters.map((f) => (
                  <span key={f.label} className="activeFilterTag">
                    {f.label}
                    <button onClick={f.clear} aria-label={`Remover filtro ${f.label}`}><X size={11}/></button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <select
                  className="sortSelect"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                >
                  <option value="best">Relevância</option>
                  <option value="low">Menor preço</option>
                  <option value="high">Maior preço</option>
                  <option value="sold">Mais vendidos</option>
                </select>
                <span className="muted" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>{filteredProducts.length} itens</span>
              </div>
            </div>
            <div className="productGrid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.prefix} product={p} onAdd={addProduct} />
              ))}
            </div>
          </div>

        </section>
      </main>
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdate={updateQuantity}
      />
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
