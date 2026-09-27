"use client";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand compact" : "brand"}>
      <span className="brand-corner a" />
      <span className="brand-corner b" />
      <span className="brand-corner c" />
      <span className="brand-corner d" />
      {!compact && (
        <span className="brand-word">
          <b>ПРЕСС</b>ДИРЕКТ
        </span>
      )}
    </span>
  );
}
export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="Прессдирект — главная">
        <Brand />
      </a>
      <nav aria-label="Основная навигация">
        <a href="/" aria-current={pathname === "/" ? "page" : undefined}>
          Интеграции
        </a>
        <a href="/coffeemania" aria-current={pathname === "/coffeemania" ? "page" : undefined}>
          Кофемания
        </a>
        <a href="/addresses" aria-current={pathname === "/addresses" ? "page" : undefined}>
          Адреса
        </a>
        <a
          href="/contacts"
          className="header-contact"
          aria-current={pathname === "/contacts" ? "page" : undefined}
        >
          Обсудить проект <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top" data-reveal>
        <a href="/" aria-label="Прессдирект — главная">
          <Brand />
        </a>
        <p>
          Рекламные и партнёрские
          <br />
          интеграции в «Кофемании».
        </p>
        <div className="footer-contacts">
          <a href="mailto:partner@pressdirect.ru">partner@pressdirect.ru</a>
          <a href="tel:+74957402336">+7 495 740-23-36</a>
        </div>
      </div>
      <div className="footer-bottom" data-reveal="row">
        <span>© 2026 Прессдирект</span>
        <span>Москва и Московская область</span>
        <a href="/contacts">
          Контакты <ArrowUpRight size={14} />
        </a>
      </div>
    </footer>
  );
}
