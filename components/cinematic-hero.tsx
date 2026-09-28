import { ArrowUpRight } from "lucide-react";

export function CinematicHero() {
  return (
    <section className="cinematic-hero" aria-labelledby="cinematic-title">
      <div className="cinematic-backdrop" aria-hidden="true">
        <img
          src="/media/atmosphere/restaurant-hero.webp"
          alt=""
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="cinematic-content section-wrap">
        <div className="cinematic-copy">
          <h1 id="cinematic-title">
            <span>Ваш бренд</span>
            <span>в «Кофемании»</span>
          </h1>
          <p>
            Рекламные и партнёрские интеграции
            <br className="cinematic-desktop-break" /> в сети премиальных ресторанов
          </p>
          <a className="cinematic-cta" href="#formats">
            Выбрать формат <ArrowUpRight size={23} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
