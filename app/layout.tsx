import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

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
    siteName: "Grape Tools",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Grape Tools" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Grape Tools | Ferragens e Ferramentas",
    description: "Ferragens e ferramentas com desconto progressivo por quantidade.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fustat.variable}>
      <body>
        {/* Dados estruturados do site (Organização + WebSite com caixa de busca) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
