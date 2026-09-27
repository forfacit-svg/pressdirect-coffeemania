"use client";

import { useEffect, useRef } from "react";
import { createSoffitRenderer } from "@/lib/soffit-renderer";

export function SoffitBackdrop({ playing }: { playing: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createSoffitRenderer>>(null);
  useEffect(() => {
    const element = canvas.current;
    const host = element?.ownerDocument.body;
    if (!element || !host) return;
    try {
      renderer.current = createSoffitRenderer(element, host);
    } catch {
      // The CSS light field remains available when WebGL is disabled.
    }
    return () => {
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
