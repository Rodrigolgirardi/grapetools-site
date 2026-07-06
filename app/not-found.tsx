// app/not-found.tsx
// Página 404 branded: se alguém chega num link quebrado (anúncio antigo, erro de
// digitação, produto removido), mostra uma tela bonita com caminhos de volta pra
// loja — em vez de um 404 cru que faz a pessoa (e a venda) ir embora.

import Link from "next/link";
import { Logo } from "@/components/Logo";

const categorias = ["Ferragens", "Abrasivos", "Elétrica", "Fixação", "Ferramentas", "Utilidades"];

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "#f7f6fb",
        color: "#0f0a1e",
        padding: "32px 24px",
        fontFamily: "var(--font-fustat), system-ui, Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Logo />
      </div>

      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1,
          background: "linear-gradient(135deg, #5b21b6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 6px" }}>Página não encontrada</h1>
      <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 420, lineHeight: 1.55, margin: "0 0 22px" }}>
        Esse endereço não existe (ou o produto mudou de lugar). Mas temos muita coisa boa esperando por você.
      </p>

      <Link
        href="/"
        style={{
          background: "#5b21b6",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 8,
          padding: "12px 24px",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Voltar para a loja
      </Link>

      <div style={{ marginTop: 28, maxWidth: 460 }}>
        <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8b5cf6", fontWeight: 700, marginBottom: 10 }}>
          Ou explore por categoria
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {categorias.map((c) => (
            <Link
              key={c}
              href={`/?categoria=${encodeURIComponent(c)}`}
              style={{
                background: "#fff",
                color: "#5b21b6",
                textDecoration: "none",
                border: "1px solid #e5e0f0",
                borderRadius: 20,
                padding: "7px 15px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
