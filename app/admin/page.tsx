import { Boxes, ClipboardList, Megaphone, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { adminModules, products } from "@/lib/data";

const stats = [
  { label: "Produtos ativos", value: products.length.toString(), icon: Boxes },
  { label: "Pedidos em aberto", value: "42", icon: ClipboardList },
  { label: "Clientes B2B", value: "318", icon: Users },
  { label: "Campanhas", value: "7", icon: Megaphone }
];

export default function AdminPage() {
  return (
    <main className="adminLayout">
      <aside className="adminSidebar">
        <Logo />
        <nav>
          {adminModules.map((module) => (
            <a key={module} href={`#${module.toLowerCase()}`}>
              {module}
            </a>
          ))}
        </nav>
      </aside>
      <section className="adminMain">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Next.js Admin</span>
            <h1>Painel Administrativo</h1>
          </div>
          <a className="secondaryButton" href="/">
            Ver portal
          </a>
        </div>
        <div className="adminStats">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label}>
              <Icon size={22} />
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
        <div className="adminTable">
          <div className="tableHead">
            <strong>Produtos</strong>
            <span>Base pronta para Supabase/PostgreSQL</span>
          </div>
          {products.map((product) => (
            <div className="tableRow" key={product.sku}>
              <span>{product.sku}</span>
              <strong>{product.name}</strong>
              <span>{product.category}</span>
              <span>{product.stock.toLocaleString("pt-BR")} un.</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
