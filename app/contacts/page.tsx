import { ArrowUpRight } from "lucide-react";
import { integrations, digital } from "@/content/integrations";
export const metadata = {
  title: "Контакты",
  description:
    "Обсудите интеграцию в Кофемании с агентством Прессдирект. Телефон +7 495 740-23-36, partner@pressdirect.ru.",
};
export default async function Contacts({
  searchParams,
}: {
  searchParams: Promise<{ format?: string }>;
}) {
  const { format } = await searchParams;
  const selected = [...integrations, ...digital].find((x) => x.title === format);
  const mailto =
    "mailto:partner@pressdirect.ru" +
    (selected ? "?subject=" + encodeURIComponent("Интеграция в Кофемании: " + selected.title) : "");
  return (
    <main id="main">
      <section className="page-title section-wrap">
        <span className="eyebrow">Прессдирект / Контакты</span>
        <h1>
          Начнём
          <br />с вашей идеи.
        </h1>
        <p>
          Расскажите о бренде, задаче и желаемых сроках. Подберём формат интеграции в «Кофемании» и
          подготовим предложение.
        </p>
        {selected && (
          <div className="selected-contact">
            <span className="eyebrow">Выбранная интеграция</span>
            <h2>{selected.title}</h2>
          </div>
        )}
      </section>
      <section className="contacts-grid section-wrap">
        <div>
          <span className="eyebrow">Партнёрские проекты</span>
          <a href={mailto}>
            partner@pressdirect.ru
            <ArrowUpRight />
          </a>
          <a className="secondary-email" href="mailto:adv@pressdirect.ru">
            adv@pressdirect.ru
            <ArrowUpRight size={19} />
          </a>
        </div>
        <div>
          <span className="eyebrow">Позвонить</span>
          <a href="tel:+74957402336">
            +7 495 740-23-36
            <ArrowUpRight />
          </a>
          <p>Москва и Московская область</p>
        </div>
      </section>
      <section className="process section-wrap">
        <div className="section-heading">
          <h2>От идеи до запуска</h2>
        </div>
        <ol>
          {["Бриф", "Идея", "Согласование", "Запуск", "Отчётность"].map((x, i) => (
            <li key={x}>
              <span className="row-number">0{i + 1}</span>
              <h3>{x}</h3>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
