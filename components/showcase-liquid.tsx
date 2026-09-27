"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { mainFormats } from "@/content/integrations";
import { showcaseImages } from "@/content/showcase";
import { createLiquidTransition } from "@/lib/liquid-transition";

export function ShowcaseLiquid({ index }: { index: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [initialIndex] = useState(index);
  const transition = useRef<ReturnType<typeof createLiquidTransition>>(null);
  useLayoutEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const images = Array.from(element.parentElement!.querySelectorAll("img"));
    transition.current = createLiquidTransition(element, images, initialIndex);
    return () => {
      transition.current?.dispose();
      transition.current = null;
    };
  }, [initialIndex]);
  useLayoutEffect(() => {
    transition.current?.goTo(index);
  }, [index]);

  return (
    <div className="liquid-stage">
      <div className="liquid-frame">
        <div className="liquid-window">
          {mainFormats.map((format, position) => {
            const photo = showcaseImages[format.slug];
            return (
              <img
                key={format.slug}
                src={photo.src}
                alt={position === index ? photo.alt : ""}
                aria-hidden={position !== index}
                data-visible={position === initialIndex}
                width={1536}
                height={1024}
                loading="eager"
                fetchPriority={position === initialIndex ? "high" : "low"}
                draggable={false}
              />
            );
          })}
          <canvas ref={canvas} className="liquid-canvas" aria-hidden="true" />
        </div>
        <span className="liquid-registration" aria-hidden="true" />
      </div>
    </div>
  );
}
