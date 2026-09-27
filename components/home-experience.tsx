"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { mainFormats, formatHref } from "@/content/integrations";
import { ShowcaseDepth } from "@/components/showcase-depth";
import { SoffitBackdrop } from "@/components/soffit-backdrop";

const phrases = [
  "рекламу в папке для счёта",
  "гастрономические коллаборации",
  "размещение буклетов и каталогов",
  "вложение в доставку и заказы «с собой»",
  "интеграции в Шереметьево",
  "цифровые интеграции",
];
const descriptions = [
  "Ваше сообщение в момент завершения визита — в папке, которую получает гость.",
  "Специальный десерт или напиток, в котором ваш бренд становится частью впечатления.",
  "Содержательное знакомство с вашим брендом — рядом с деловой прессой.",
  "Продолжите общение с гостем дома, в офисе и в дороге.",
  "Ваше сообщение — в повседневном ритуале гостя перед полётом.",
  "Сайт, приложение, Wi-Fi и Яндекс Карты — разные моменты встречи с гостем.",
];
export function HomeExperience() {
  const [index, setIndex] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const format = mainFormats[index];
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("pressdirect-format");
      const parsed = saved === null ? 1 : Number(saved);
      // Restore browser-only state after hydration so the server and first client render agree.
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < mainFormats.length) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIndex(parsed);
      }
    } catch {
      /* Optional preference. */
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Respect the browser motion preference after hydration.
    setPlaying(!motion.matches);
    const stop = () => {
      if (motion.matches) setPlaying(false);
    };
    motion.addEventListener("change", stop);
    return () => motion.removeEventListener("change", stop);
  }, []);
  useEffect(() => {
    if (!playing || hovered || focused || chooserOpen) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % mainFormats.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [index, playing, hovered, focused, chooserOpen]);
  function remember(next: number) {
    try {
      sessionStorage.setItem("pressdirect-format", String(next));
    } catch {
      /* Optional preference. */
    }
  }
  function choose(next: number) {
    const selected = (next + mainFormats.length) % mainFormats.length;
    setIndex(selected);
    setPlaying(false);
    setChooserOpen(false);
    remember(selected);
  }
  return (
    <main id="main" className="home-page">
      <section
        className="showcase section-wrap"
        aria-label="Выбор интеграции"
        aria-roledescription="карусель"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <SoffitBackdrop playing={playing && !focused && !chooserOpen} />
        <div className="showcase-meta">
          <span>Ваш бренд в «Кофемании»</span>
          <span>Рекламные и партнёрские интеграции</span>
        </div>
        <div className="showcase-hero">
          <div
            className="showcase-copy"
            data-reveal
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <h1>Мы делаем</h1>
            <div
              className="showcase-current"
              aria-live={playing ? "off" : "polite"}
              aria-atomic="true"
            >
              <a
                className="showcase-phrase"
                href={formatHref(format.slug)}
                key={format.slug}
                aria-label={"Подробнее: " + format.title}
                onClick={() => remember(index)}
              >
                {phrases[index]}
              </a>
              <p>{descriptions[index]}</p>
            </div>
            <a
              className="showcase-open"
              href={formatHref(format.slug)}
              onClick={() => remember(index)}
            >
              Узнать о формате <ArrowUpRight size={21} />
            </a>
          </div>
          <div
            className="showcase-photo"
            data-reveal
            data-parallax="16"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={(event) => {
              touchStart.current = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
              };
            }}
            onTouchEnd={(event) => {
              if (touchStart.current) {
                const dx = touchStart.current.x - event.changedTouches[0].clientX;
                const dy = touchStart.current.y - event.changedTouches[0].clientY;
                if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy))
                  choose(index + (dx > 0 ? 1 : -1));
              }
              touchStart.current = null;
            }}
            onTouchCancel={() => {
              touchStart.current = null;
            }}
          >
            <ShowcaseDepth index={index} playing={playing && !focused && !chooserOpen} />
          </div>
        </div>
        <div className="showcase-switch" data-reveal="row">
          <Select
            value={String(index)}
            onValueChange={(value) => choose(Number(value))}
            open={chooserOpen}
            onOpenChange={setChooserOpen}
          >
            <SelectTrigger
              className="showcase-chooser"
              aria-label={"Все 6 форматов. Выбрано: " + format.short}
            >
              <span>Все 6 форматов</span>
            </SelectTrigger>
            <SelectContent className="showcase-options" position="popper" align="start">
              {mainFormats.map((item, i) => (
                <SelectItem key={item.slug} value={String(i)}>
                  <span className="showcase-option-number">{item.number}</span>
                  <span>{item.short}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="showcase-controls">
            <span className="showcase-count" aria-label={"Формат " + (index + 1) + " из 6"}>
              {format.number} / 06
            </span>
            <button
              className="showcase-play"
              aria-label={
                playing
                  ? "Приостановить анимацию и смену форматов"
                  : "Включить анимацию и смену форматов"
              }
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              <span>{playing ? "Пауза" : "Авто"}</span>
            </button>
            <button aria-label="Предыдущий формат" onClick={() => choose(index - 1)}>
              <ArrowLeft size={23} />
            </button>
            <button aria-label="Следующий формат" onClick={() => choose(index + 1)}>
              <ArrowRight size={23} />
            </button>
          </div>
        </div>
        <div className="showcase-note">
          <h2 data-reveal>
            Место встречи
            <br />
            вашего бренда и гостя.
          </h2>
          <div data-reveal data-reveal-delay="80">
            <p>
              В ресторане, в заказе «с собой» и в цифровых каналах. Подберём формат под вашу задачу
              и вместе подготовим запуск.
            </p>
            <a className="text-link" href="/coffeemania">
              О возможностях сети <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section className="format-index section-wrap" aria-labelledby="all-formats">
        <div className="section-heading" data-reveal>
          <h2 id="all-formats">Форматы интеграций</h2>
          <span className="eyebrow">06 направлений</span>
        </div>
        {mainFormats.map((item, i) => (
          <a
            key={item.slug}
            href={formatHref(item.slug)}
            className="index-row"
            data-reveal="row"
            onClick={() => remember(i)}
          >
            <span className="row-number">{item.number}</span>
            <h3>{item.title}</h3>
            <ArrowUpRight size={26} />
          </a>
        ))}
      </section>
      <section className="contact-band section-wrap" data-reveal>
        <span className="eyebrow">Начнём с вашей идеи</span>
        <h2>Обсудим проект?</h2>
        <a className="text-link" href="/contacts">
          Связаться с нами <ArrowUpRight size={24} />
        </a>
      </section>
    </main>
  );
}
