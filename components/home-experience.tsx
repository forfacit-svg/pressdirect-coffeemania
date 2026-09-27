"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { mainFormats, formatHref } from "@/content/integrations";

const phrases = [
  "рекламу в папке для счёта",
  "гастрономические коллаборации",
  "размещение буклетов и каталогов",
  "вложение в доставку и заказы «с собой»",
  "интеграции в Шереметьево",
  "цифровые интеграции",
];
const ROTATION_MS = 5000;

export function HomeExperience() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const touchStart = useRef<number | null>(null);
  const format = mainFormats[index];
  useEffect(() => {
    const saved = sessionStorage.getItem("pressdirect-format");
    const parsed = saved === null ? 0 : Number(saved);
    // Restore browser-only state after hydration so server and first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < mainFormats.length) setIndex(parsed);
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  useEffect(() => {
    if (!playing || hovered) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % mainFormats.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [playing, hovered]);
  function choose(next: number) {
    const n = (next + mainFormats.length) % mainFormats.length;
    setIndex(n);
    setPlaying(false);
    sessionStorage.setItem("pressdirect-format", String(n));
  }
  return (
    <main id="main">
      <div className="home-intro">
        <h1>
          Ваш бренд
          <br />
          <span>в «Кофемании».</span>
        </h1>
        <div className="intro-aside">
          <p>
            Рекламные и партнёрские
            <br />
            интеграции
          </p>
          <span className="eyebrow">Прессдирект / 2026</span>
        </div>
      </div>
      <section
        className="hero"
        aria-label="Выбор интеграции"
        aria-roledescription="карусель"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current !== null) {
            const delta = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(delta) > 65) choose(index + (delta > 0 ? 1 : -1));
            touchStart.current = null;
          }
        }}
      >
        {mainFormats.map((f, i) => (
          <div
            key={f.slug}
            className={
              "hero-image " +
              (i === index ? "active " : "") +
              (f.slug === "digital" ? "digital-hero" : "")
            }
            aria-hidden={i !== index}
          >
            <img
              src={"/media/image" + f.image + ".webp"}
              alt={f.title + " в Кофемании"}
              style={{ objectPosition: f.position }}
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="hero-shade" />
        <div className="selector-panel">
          <div className="selector-meta">
            <span className="eyebrow">Интеграции в Кофемании</span>
            <span className="selector-count">
              {format.number}
              <span> / 06</span>
            </span>
          </div>
          <div className="rotating-statement">
            <span className="statement-prefix">Мы делаем</span>
            <a
              className="statement-link"
              href={formatHref(format.slug)}
              aria-label={"Подробнее: " + format.title}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={(e) => setHovered(e.currentTarget === document.activeElement)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              onClick={() => sessionStorage.setItem("pressdirect-format", String(index))}
            >
              <span className="statement-phrase" key={format.slug}>
                {phrases[index]}
              </span>
              <ArrowUpRight className="statement-arrow" size={28} />
            </a>
          </div>
          <div className="selector-bottom">
            <p>
              {format.slug === "digital"
                ? "Сайт, приложение, Wi-Fi и Яндекс Карты"
                : "Партнёрские возможности в «Кофемании»"}
            </p>
            <a
              href={formatHref(format.slug)}
              onClick={() => sessionStorage.setItem("pressdirect-format", String(index))}
            >
              Подробнее{" "}
              <span className="arrow-circle">
                <ArrowUpRight size={22} />
              </span>
            </a>
          </div>
        </div>
        <div className="hero-bottom">
          <span className="hero-caption">Кофемания × ваш бренд</span>
          <div className="hero-controls">
            <button
              aria-label={playing ? "Приостановить смену форматов" : "Включить смену форматов"}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button aria-label="Предыдущий формат" onClick={() => choose(index - 1)}>
              <ArrowLeft size={21} />
            </button>
            <button aria-label="Следующий формат" onClick={() => choose(index + 1)}>
              <ArrowRight size={21} />
            </button>
          </div>
        </div>
      </section>
      <nav className="format-strip" aria-label="Страницы интеграций">
        {mainFormats.map((f, i) => (
          <a
            key={f.slug}
            href={formatHref(f.slug)}
            className={index === i ? "active" : ""}
            onClick={() => sessionStorage.setItem("pressdirect-format", String(i))}
          >
            <span>{f.number}</span>
            {f.short}
            <i
              className={playing && index === i && !hovered ? "running" : ""}
              key={String(playing) + index + String(hovered)}
            />
          </a>
        ))}
      </nav>
      <section className="home-context section-wrap">
        <span className="eyebrow">Одна сеть. Разные точки контакта.</span>
        <div>
          <h2>
            От первого впечатления
            <br />
            до следующего визита.
          </h2>
          <p>
            В ресторане, в заказе с собой и в цифровых каналах. Подберём формат, в котором ваш бренд
            станет частью привычного маршрута гостя «Кофемании».
          </p>
          <a className="text-link" href="/coffeemania">
            О возможностях сети <ArrowUpRight size={19} />
          </a>
        </div>
      </section>
      <section className="format-index section-wrap" aria-labelledby="all-formats">
        <div className="section-heading">
          <h2 id="all-formats">Форматы интеграций</h2>
          <span className="eyebrow">06 направлений</span>
        </div>
        {mainFormats.map((f) => (
          <a key={f.slug} href={formatHref(f.slug)} className="index-row">
            <span className="row-number">{f.number}</span>
            <h3>{f.title}</h3>
            <ArrowUpRight size={26} />
          </a>
        ))}
      </section>
      <section className="contact-band section-wrap">
        <span className="eyebrow">Начнём с вашей идеи</span>
        <h2>Обсудим проект?</h2>
        <a className="text-link" href="/contacts">
          Связаться с нами <ArrowUpRight size={24} />
        </a>
      </section>
    </main>
  );
}
