import locations from "@/content/locations.json";
import type { Integration } from "@/content/integrations";
import { ChevronDown } from "lucide-react";
export function LocationList({
  area = "all",
  activeOnly = false,
}: {
  area?: "all" | "city" | "airport";
  activeOnly?: boolean;
}) {
  const list = locations.filter(
    (x) => (area === "all" || x.area === area) && (!activeOnly || !x.soon),
  );
  return (
    <div className="location-grid">
      {list.map((x) => (
        <article
          className="location"
          key={x.id}
          data-reveal="row"
          data-reveal-delay={(x.id % 2) * 50}
        >
          <span className="row-number">{String(x.id).padStart(2, "0")}</span>
          <div>
            <h3>
              {x.name.replace(" (скоро)", "")}
              {x.soon && <span className="soon">Скоро</span>}
            </h3>
            <p>{x.address}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
export function LocationSection({ scope }: { scope: Integration["scope"] }) {
  const airport = scope === "airport",
    active = scope === "active",
    both = scope === "delivery",
    network = scope === "digital" || scope === "wifi";
  return (
    <section className="locations-section section-wrap" id="locations">
      <div className="section-heading" data-reveal>
        <h2>{network ? "Адреса ресторанов сети" : "Где разместить интеграцию"}</h2>
        <span className="eyebrow">
          {airport ? "Шереметьево" : both ? "Город и аэропорт" : "Москва и область"}
        </span>
      </div>
      <p className="section-note" data-reveal>
        {scope === "wifi"
          ? "Для Wi-Fi доступны 22 ресторана. Ниже приведён общий адресный список сети; точный состав подключённых площадок согласовывается отдельно."
          : network
            ? "Адресный список «Кофемании». Состав площадок для конкретного цифрового размещения согласовывается отдельно."
            : airport
              ? "Три ресторана в терминалах B, C и D."
              : active
                ? "34 ресторана городского формата. Участие аэропортных ресторанов можно обсудить отдельно."
                : "Рестораны из адресной программы 2026 года. Комсомольский отмечен как «скоро»; его доступность уточняется перед размещением."}
      </p>
      <details className="address-disclosure">
        <summary>
          {airport
            ? "Адреса 3 ресторанов"
            : active
              ? "Адреса 34 ресторанов"
              : "Адреса 35 городских ресторанов"}
          <ChevronDown size={23} />
        </summary>
        <LocationList area={airport ? "airport" : "city"} activeOnly={active} />
      </details>
      {both && (
        <details className="address-disclosure">
          <summary>
            Адреса 3 ресторанов Шереметьево
            <ChevronDown size={23} />
          </summary>
          <LocationList area="airport" />
        </details>
      )}
    </section>
  );
}
