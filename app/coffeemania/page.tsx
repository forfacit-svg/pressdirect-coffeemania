import { ArrowUpRight } from "lucide-react";
export const metadata = {
  title: "Кофемания для вашего бренда",
  description:
    "Партнёрские возможности в ресторанах Кофемания: городская аудитория, гости аэропорта и цифровые каналы.",
};
export default function Coffeemania() {
  return (
    <main id="main">
      <section className="page-title section-wrap about-title">
        <span className="eyebrow">Кофемания × бренды</span>
        <h1>
          Часть городской жизни.
          <br />
          Место для вашего бренда.
        </h1>
        <p>
          «Кофемания» объединяет гастрономию, культуру сервиса и ежедневные городские традиции.
          Встречи, завтраки, обеды и кофе перед вылетом создают разные сценарии общения с гостем.
        </p>
      </section>
      <div className="about-photo section-wrap">
        <img src="/media/image32.webp" alt="Заказ с собой в ресторане Кофемания" />
      </div>
      <section className="facts section-wrap">
        <div>
          <strong>25 лет</strong>
          <span>истории к 2026 году</span>
        </div>
        <div>
          <strong>35</strong>
          <span>городских ресторанов в адресной программе, включая «скоро»</span>
        </div>
        <div>
          <strong>3</strong>
          <span>ресторана в Шереметьево</span>
        </div>
      </section>
      <section className="home-context section-wrap">
        <span className="eyebrow">Партнёрство с Кофеманией</span>
        <div>
          <h2>
            Контакт в момент,
            <br />
            когда есть внимание.
          </h2>
          <p>
            Гость проводит время за столиком, ждёт встречу или выбирает десерт. Мы помогаем встроить
            сообщение бренда в эти ситуации: от рекламной полосы до совместного гастрономического
            проекта.
          </p>
          <a className="text-link" href="/">
            Выбрать интеграцию <ArrowUpRight size={19} />
          </a>
        </div>
      </section>
      <section className="about-links section-wrap">
        <a href="/addresses">
          Рестораны и адреса
          <ArrowUpRight size={25} />
        </a>
        <a href="/contacts">
          Обсудить партнёрство
          <ArrowUpRight size={25} />
        </a>
      </section>
    </main>
  );
}
