import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { ContactOptions } from "@/components/contact-options";
import { LocationSection } from "@/components/locations";
import { IntegrationStory } from "@/components/integration-story";
import media from "@/content/media.json";
import {
  type Integration,
  mainFormats,
  contactHref,
  digitalHref,
  formatHref,
  digital,
} from "@/content/integrations";
export function IntegrationPage({
  item,
  isDigital = false,
}: {
  item: Integration;
  isDigital?: boolean;
}) {
  return (
    <main id="main">
      <div className="detail-top section-wrap">
        <a className="back-link" href={isDigital ? "/integrations/digital" : "/"}>
          <ArrowLeft size={16} />
          {isDigital ? "Цифровые интеграции" : "Все интеграции"}
        </a>
        <span className="eyebrow">{item.eyebrow} / 2026</span>
      </div>
      <section
        className={
          "detail-hero section-wrap " +
          (isDigital ? "is-digital " : "") +
          (item.image === null ? "no-image" : "")
        }
      >
        <div className="detail-title">
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <a className="text-link" href={contactHref(item.title)}>
            Обсудить размещение <ArrowUpRight size={19} />
          </a>
        </div>
        {item.image !== null && (
          <div className="detail-cover">
            <img
              src={"/media/image" + item.image + ".webp"}
              alt={item.title + " — пример размещения в Кофемании"}
              style={{ objectPosition: item.position }}
              fetchPriority="high"
            />
          </div>
        )}
      </section>
      <div className="facts section-wrap">
        {item.facts.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <IntegrationStory slug={item.slug} />
      <section className="placement-section section-wrap" id="placement">
        <div className="section-heading">
          <h2>Обсудим вашу интеграцию</h2>
          <span className="eyebrow">Прессдирект</span>
        </div>
        <p className="section-note">
          Напишите нам или позвоните. Подберём площадки, согласуем сроки и подготовим предложение
          для вашего бренда.
        </p>
        <ContactOptions format={item.title} />
        <div className="conditions">
          <h3>Условия размещения</h3>
          <ul>
            {item.conditions.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        {item.specs && (
          <div className="specs">
            <h3>Требования к материалам</h3>
            <dl>
              {item.specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>
      {item.gallery.length > 0 && (
        <section className="gallery-section section-wrap">
          <div className="section-heading">
            <h2>{isDigital ? "Как выглядит размещение" : "Примеры интеграций"}</h2>
            <span className="eyebrow">Кофемания × бренды</span>
          </div>
          <div className={"gallery source-gallery " + (isDigital ? "digital-gallery" : "")}>
            {item.gallery.map((img, i) => {
              const dimensions = (media as Record<string, { width: number; height: number }>)[
                "image" + img + ".webp"
              ];
              return (
                <figure key={img}>
                  <div>
                    <img
                      src={"/media/image" + img + ".webp"}
                      loading="lazy"
                      alt={item.title + " — пример " + (i + 1)}
                      width={dimensions?.width}
                      height={dimensions?.height}
                      style={{ maxWidth: dimensions?.width }}
                    />
                  </div>
                  <figcaption>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {item.title}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}
      <LocationSection scope={item.scope} />
      <section className="other-formats section-wrap">
        <div className="section-heading">
          <h2>Другие форматы</h2>
          <a className="text-link" href={isDigital ? "/integrations/digital" : "/"}>
            Все форматы <ArrowUpRight size={18} />
          </a>
        </div>
        <div>
          {(isDigital ? digital : mainFormats)
            .filter((x) => x.slug !== item.slug)
            .slice(0, 3)
            .map((x) => (
              <a key={x.slug} href={isDigital ? digitalHref(x.slug) : formatHref(x.slug)}>
                {x.title}
                <ArrowUpRight size={21} />
              </a>
            ))}
        </div>
      </section>
    </main>
  );
}
