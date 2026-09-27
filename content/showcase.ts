export const showcaseImages: Record<string, { src: string; alt: string }> = {
  "bill-folder": {
    src: "/media/showcase/bill-folder.webp",
    alt: "Открытая папка для счёта с рекламным размещением",
  },
  collaborations: {
    src: "/media/showcase/collaborations.webp",
    alt: "Авторский шоколадный десерт в форме сумки — пример коллаборации",
  },
  "press-stands": {
    src: "/media/showcase/catalogues.webp",
    alt: "Каталог Dantone Home на стойке с прессой в Кофемании",
  },
  delivery: {
    src: "/media/showcase/delivery.webp",
    alt: "Буклет партнёра в пакете с заказом Кофемании",
  },
  airport: {
    src: "/media/showcase/airport.webp",
    alt: "Плейсмат Альфа Премиум на подносе в ресторане аэропорта",
  },
  digital: {
    src: "/media/showcase/digital.webp",
    alt: "Stories Кофемании с пасхальной коллекцией в рамке iPhone 17 Pro Max",
  },
};
export function showcaseFor(slug: string) {
  return showcaseImages[slug === "stories" ? "digital" : slug];
}
