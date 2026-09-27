"use client";

import { useEffect, useRef } from "react";
import { createSoffitRenderer } from "@/lib/soffit-renderer";
import { soffitGutters } from "@/lib/soffit-layout";

export function SoffitBackdrop({ playing }: { playing: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createSoffitRenderer>>(null);
  useEffect(() => {
    const element = canvas.current;
    const host = element?.ownerDocument.body;
    const backdrop = element?.parentElement;
    if (!element || !host || !backdrop) return;
    const blocks = Array.from(
      host.querySelectorAll<HTMLElement>(
        ".home-page > .section-wrap, .site-header > *, .site-footer > *",
      ),
    );
    const measure = () => {
      const gutters = soffitGutters(
        element.getBoundingClientRect(),
        blocks.map((block) => block.getBoundingClientRect()),
      );
      backdrop.style.setProperty("--soffit-left", `${gutters.left}px`);
      backdrop.style.setProperty("--soffit-right", `${gutters.right}px`);
      renderer.current?.resize();
    };
    measure();
    const observer = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    for (const block of blocks) observer?.observe(block);
    window.addEventListener("resize", measure, { passive: true });
    try {
      renderer.current = createSoffitRenderer(element, host);
    } catch {
      // The CSS light field remains available when WebGL is disabled.
    }
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);
  useEffect(() => {
    renderer.current?.setPlaying(playing);
  }, [playing]);

  return (
    <div className="soffit-backdrop" aria-hidden="true">
      <canvas ref={canvas} className="soffit-canvas" />
    </div>
  );
}
