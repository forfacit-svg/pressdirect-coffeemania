import { ArrowUpRight } from "lucide-react";
export function ContactOptions({ format }: { format?: string }) {
  const email =
    "mailto:partner@pressdirect.ru" +
    (format ? "?subject=" + encodeURIComponent("Интеграция в Кофемании: " + format) : "");
  return (
    <div className="contact-options">
      <a href={email}>
        <span>Написать на почту</span>
        <strong>partner@pressdirect.ru</strong>
        <ArrowUpRight size={21} />
      </a>
      <a href="tel:+74957402336">
        <span>Позвонить</span>
        <strong>+7 495 740-23-36</strong>
        <ArrowUpRight size={21} />
      </a>
    </div>
  );
}
