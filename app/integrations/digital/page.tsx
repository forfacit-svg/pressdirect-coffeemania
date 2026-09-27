import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { digital, digitalHref } from "@/content/integrations";
import { showcaseImages } from "@/content/showcase";
import { ContactOptions } from "@/components/contact-options";
import { LocationSection } from "@/components/locations";
export const metadata = {
  title: "Цифровые интеграции",
  description:
    "Семь цифровых форматов в Кофемании: сайт, приложение, Wi-Fi и Яндекс Карты. Возможности размещения и требования к материалам.",
};
export default function Digital() {
  return (
    <main id="main">
      <div className="detail-top section-wrap">
        <a className="back-link" href="/">
          <ArrowLeft size={16} />
          Все интеграции
        </a>
        <span className="eyebrow">Digital / 2026</span>
      </div>
      <section className="digital-intro section-wrap">
        <div data-reveal>
          <h1>
            На связи
            <br />с вашим гостем.
          </h1>
          <p>
            Цифровые интеграции в «Кофемании».
            <br />
            Сайт, приложение, Wi-Fi и Яндекс Карты.
          </p>
          <a className="text-link" href="#digital-formats">
            Выбрать формат ↓
          </a>
        </div>
        <div className="digital-visual curated-visual" data-reveal data-parallax="12">
          <img
            src={showcaseImages.digital.src}
            alt={showcaseImages.digital.alt}
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="digital-formats section-wrap" id="digital-formats">
        <div className="section-heading" data-reveal>
          <h2>Семь точек контакта</h2>
          <span className="eyebrow">Форматы / 2026</span>
        </div>
        <p className="section-note" data-reveal>
          Выберите формат и свяжитесь с нами, чтобы обсудить условия размещения.
        </p>
        {digital.map((x, i) => (
          <a key={x.slug} href={digitalHref(x.slug)} className="digital-row" data-reveal="row">
            <span className="row-number">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{x.title}</h3>
              <p>{x.facts[0][0]} — охват в месяц</p>
            </div>
            <span className="digital-open">Подробнее</span>
            <ArrowUpRight size={24} />
          </a>
        ))}
      </section>
      <section className="digital-inquiry section-wrap">
        <h2 data-reveal>Подберём подходящий формат</h2>
        <p>Расскажите о вашей задаче по почте или телефону.</p>
        <ContactOptions format="Цифровые интеграции" />
      </section>
      <LocationSection scope="digital" />
    </main>
  );
}
