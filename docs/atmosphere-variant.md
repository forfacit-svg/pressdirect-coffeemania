# Атмосферная версия главной страницы

Отдельный вариант для сравнения с текущим сайтом. Ветка `design/atmosphere-home` не должна заменять `main` без решения владельца.

- Исходный сайт: https://pressdirect-coffeemania.forfacit.chatgpt.site
- Новый первый экран: общая фотография ресторана, заголовок «Ваш бренд в «Кофемании»», короткое описание и кнопка перехода к форматам.
- Фотография заканчивается CSS-градиентом в цвет страницы; градиент не встроен в изображение.
- Все текущие форматы, тексты, условия, адреса и внутренние страницы сохранены. Карусель и каталог расположены ниже первого экрана.
- На телефонах усилено затемнение под текстом; навигация переносится в отдельную строку. Заголовки используют Prata, основной текст — Golos Text.

## Изображение

`public/media/atmosphere/restaurant-hero.webp`, 1672 × 941, 193 716 байт. Иллюстративное изображение создано ImageGen по предоставленному пользователем референсу; это не документальная фотография конкретного ресторана или реализованного размещения. Исходный PNG конвертирован в WebP с качеством 88. Текст и кнопки отрисовываются HTML.

Промпт: “Full-width 16:9 restaurant website hero photograph. Reconstruct the screenshot’s underlying photo into one clean continuous image. Preserve warm walnut/honey tables, brass, glass, upholstery, orange flower in a white vase and blurred busy counter. Place a realistically scaled advertising brochure on the right with image-led architectural photography and no readable claims. Keep the left and lower-left calm and dark for live white text. Remove all website UI, logo, text, buttons, inset cards, frames and watermarks. No baked-in gradient. Crisp editorial photography, realistic optics, natural amber daylight.”

## Проверки

Проверены TypeScript, форматирование, линтер с конфигурацией проекта и производственная сборка. Контент и внутренние страницы сравнивались с исходной версией. Проверка событий карусели подтверждает автопереключение, паузу, навигацию, синхронизацию прогресса и восстановление после возвращения на вкладку. Полноценная браузерная визуальная проверка в этой среде недоступна.
