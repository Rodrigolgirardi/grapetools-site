import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
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
    locale: "pt_BR"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
