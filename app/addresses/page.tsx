import { ArrowUpRight } from "lucide-react";
import { LocationList } from "@/components/locations";
export const metadata = {
  title: "Адреса ресторанов Кофемания",
  description:
    "Адресная программа 2026 года: 35 городских ресторанов Кофемания и три ресторана в Шереметьево.",
};
export default function Addresses() {
  return (
    <main id="main" className="addresses-page">
      <section className="page-title section-wrap" data-reveal>
        <span className="eyebrow">Адресная программа / 2026</span>
        <h1>
          Места встречи
          <br />с вашей аудиторией.
        </h1>
        <p>
          35 ресторанов городского формата и 3 ресторана в Шереметьево. Комсомольский отмечен в
          адресной программе как «скоро».
        </p>
        <div className="jump-links">
          <a href="#city">Городские рестораны ↓</a>
          <a href="#airport">Шереметьево ↓</a>
        </div>
      </section>
      <section id="city" className="section-wrap">
        <div className="section-heading" data-reveal>
          <h2>Москва и Московская область</h2>
          <span className="eyebrow">35 адресов</span>
        </div>
        <LocationList area="city" />
      </section>
      <section id="airport" className="section-wrap airport-addresses">
        <div className="section-heading" data-reveal>
          <h2>Шереметьево</h2>
          <span className="eyebrow">3 ресторана</span>
        </div>
        <LocationList area="airport" />
        <a className="text-link" href="/integrations/airport">
          Форматы в аэропорту <ArrowUpRight size={19} />
        </a>
      </section>
    </main>
  );
}
