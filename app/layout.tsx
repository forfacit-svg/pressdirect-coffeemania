import type { Metadata } from "next";
import { Header, Footer } from "@/components/site-shell";
import { SiteMotion } from "@/components/site-motion";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Прессдирект — интеграции в Кофемании", template: "%s — Прессдирект" },
  description:
    "Рекламные и партнёрские интеграции в Кофемании: форматы размещения, фотографии, условия размещения и адреса ресторанов.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main">
          К содержанию
        </a>
        <Header />
        {children}
        <Footer />
        <SiteMotion />
      </body>
    </html>
  );
}
