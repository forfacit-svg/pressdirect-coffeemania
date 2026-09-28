"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { digitalHref, formatHref, mainFormats } from "@/content/integrations";
import { showcaseFor } from "@/content/showcase";

type PreviewFormat = {
  slug: string;
  title: string;
  image: number | null;
  number?: string;
  note?: string;
};

function previewFor(item: PreviewFormat) {
  const approved = showcaseFor(item.slug);
  if (approved) return { ...approved, curated: true };
  if (item.image === null) return null;
  return {
    src: `/media/image${item.image}.webp`,
    alt: `${item.title} — пример размещения`,
    curated: false,
  };
}

/** A shared visual index for the home, digital and related-format lists. */
export function FormatPreviewList({
  items,
  digital = false,
  compact = false,
}: {
  items: PreviewFormat[];
  digital?: boolean;
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  const activeIndex = Math.min(active, Math.max(0, items.length - 1));
  const selected = items[activeIndex];
  if (!selected) return null;
  const selectedImage = previewFor(selected);
  const Title = compact ? "span" : "h3";

  function remember(slug: string) {
    if (digital) return;
    const index = mainFormats.findIndex((item) => item.slug === slug);
    if (index < 0) return;
    try {
      sessionStorage.setItem("pressdirect-format", String(index));
    } catch {
      /* Optional preference. Links always work without storage. */
    }
  }

  return (
    <div className={"format-catalog" + (compact ? " format-catalog--compact" : "")}>
      <div className="format-catalog-links">
        {items.map((item, index) => {
          const preview = previewFor(item);
          return (
            <a
              key={item.slug}
              className="format-catalog-link"
              href={digital ? digitalHref(item.slug) : formatHref(item.slug)}
              data-reveal="row"
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setActive(index);
              }}
              onFocus={() => setActive(index)}
              onClick={() => remember(item.slug)}
            >
              <span className="format-catalog-number" aria-hidden="true">
                {item.number ?? String(index + 1).padStart(2, "0")}
              </span>
              <span className="format-catalog-thumb" aria-hidden="true">
                {preview ? (
                  <img src={preview.src} alt="" width={144} height={96} loading="lazy" />
                ) : (
                  <MapPin size={24} strokeWidth={1.25} />
                )}
              </span>
              <div className="format-catalog-copy">
                <Title className="format-catalog-title">{item.title}</Title>
                {item.note && <span className="format-catalog-note">{item.note}</span>}
              </div>
              <ArrowUpRight className="format-catalog-arrow" size={24} aria-hidden="true" />
            </a>
          );
        })}
      </div>
      <div className="format-catalog-preview" aria-hidden="true">
        <div className="format-catalog-stage">
          {items.map((item, index) => {
            const preview = previewFor(item);
            return preview ? (
              <img
                key={item.slug}
                className={"format-catalog-image" + (preview.curated ? " is-curated" : "")}
                src={preview.src}
                alt=""
                width={1536}
                height={1024}
                loading="lazy"
                data-active={index === activeIndex}
              />
            ) : null;
          })}
          {!selectedImage && (
            <div className="format-catalog-platform">
              <MapPin size={30} strokeWidth={1.25} />
              <span>Яндекс Карты</span>
              <span className="format-catalog-note">{selected.note ?? "Цифровая интеграция"}</span>
            </div>
          )}
        </div>
        <div className="format-catalog-caption">
          <span>{selected.number ?? String(activeIndex + 1).padStart(2, "0")}</span>
          <span>{selected.title}</span>
        </div>
      </div>
    </div>
  );
}
