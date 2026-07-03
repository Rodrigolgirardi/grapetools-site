import { Boxes, ClipboardList, Megaphone, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { adminModules, products } from "@/lib/data";
import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { getPausados } from "@/lib/estoque";
import { AdminEstoque } from "@/components/AdminEstoque";

const stats = [
  { label: "Produtos ativos", value: products.length.toString(), icon: Boxes },
  { label: "Pedidos em aberto", value: "42", icon: ClipboardList },
  { label: "Clientes B2B", value: "318", icon: Users },
  { label: "Campanhas", value: "7", icon: Megaphone }
];

export default async function AdminPage() {
  // Defesa em profundidade: além do middleware, confere admin aqui também.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    redirect("/");
  }

  const pausados = await getPausados();

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
        <AdminEstoque pausadosIniciais={pausados} />
      </section>
    </main>
  );
}
