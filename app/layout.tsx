import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import "./globals.css";

// Fonte única do site (igual abacatepay.com). As variáveis --font-syne e
// --font-dm-sans usadas no CSS apontam para esta fonte (alias no globals.css).
const fustat = Fustat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-fustat",
  display: "swap",
});

export const metadata: Metadata = {
  // Base p/ URLs absolutas de OG/canonical (compartilhamento no WhatsApp, Google, etc.)
  metadataBase: new URL("https://grapetools.com.br"),
  title: {
    default: "Grape Tools | Ferragens e Ferramentas",
    template: "%s | Grape Tools"
  },
  description:
    "Ferragens, ferramentas e utilidades com desconto progressivo por quantidade. Marca própria, estoque nacional e entrega rápida.",
  openGraph: {
    title: "Grape Tools",
    description: "Ferragens e ferramentas com desconto progressivo.",
    type: "website",
    locale: "pt_BR",
    siteName: "Grape Tools"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fustat.variable}>
      <body>{children}</body>
    </html>
  );
}
