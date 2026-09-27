"use client";

import { useEffect, useRef } from "react";
import { mainFormats } from "@/content/integrations";
import { showcaseImages } from "@/content/showcase";

/** Pointer motion stays outside React: one short-lived frame loop, no render on move. */
export function attachDepthMotion(stage: HTMLDivElement) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)");
  let visible = true;
  let frame = 0;
  let previousTime = 0;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  const enabled = () => !motion.matches && pointer.matches && visible && !document.hidden;

  function paint() {
    stage.style.setProperty("--depth-rx", `${(-y * 3.2).toFixed(3)}deg`);
    stage.style.setProperty("--depth-ry", `${(x * 4.2).toFixed(3)}deg`);
    stage.style.setProperty("--depth-light-x", `${50 + x * 30}%`);
    stage.style.setProperty("--depth-light-y", `${40 + y * 25}%`);
  }
  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    x = y = targetX = targetY = 0;
    delete stage.dataset.tracking;
    paint();
  }
  function tick(time: number) {
    frame = 0;
    if (!enabled()) return stop();
    const delta = previousTime ? Math.min(time - previousTime, 48) : 16;
    previousTime = time;
    const easing = 1 - Math.exp(-delta / 85);
    x += (targetX - x) * easing;
    y += (targetY - y) * easing;
    const settled = Math.abs(x - targetX) + Math.abs(y - targetY) < 0.001;
    if (settled) {
      x = targetX;
      y = targetY;
    }
    paint();
    if (!settled) frame = window.requestAnimationFrame(tick);
    else previousTime = 0;
  }
  function schedule() {
    if (!frame && enabled()) frame = window.requestAnimationFrame(tick);
  }
  function move(event: PointerEvent) {
    if (!enabled() || event.pointerType !== "mouse") return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
    stage.dataset.tracking = "true";
    schedule();
  }
  function leave() {
    targetX = targetY = 0;
    delete stage.dataset.tracking;
    schedule();
  }
  function sync() {
    stage.dataset.depthEnabled = String(enabled());
    if (!enabled()) stop();
  }
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            sync();
          },
          { threshold: 0 },
        )
      : null;
  observer?.observe(stage);
  stage.addEventListener("pointermove", move, { passive: true });
  stage.addEventListener("pointerleave", leave);
  stage.addEventListener("pointercancel", leave);
  motion.addEventListener("change", sync);
  pointer.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();

  return () => {
    observer?.disconnect();
    stage.removeEventListener("pointermove", move);
    stage.removeEventListener("pointerleave", leave);
    stage.removeEventListener("pointercancel", leave);
    motion.removeEventListener("change", sync);
    pointer.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    stop();
    delete stage.dataset.depthEnabled;
  };
}

export function ShowcaseDepth({ index, playing }: { index: number; playing: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stage.current) return attachDepthMotion(stage.current);
  }, []);

  return (
    <div className="depth-stage" ref={stage} data-playing={playing}>
      <div className="depth-float">
        <div className="depth-rig">
          {mainFormats.map((format, position) => {
            const distance = (position - index + mainFormats.length) % mainFormats.length;
            const slot =
              distance === 0
                ? "front"
                : distance === 1
                  ? "next"
                  : distance === 2
                    ? "back"
                    : "hidden";
            const photo = showcaseImages[format.slug];
            return (
              <div
                key={format.slug}
                className="depth-card"
                data-slot={slot}
                aria-hidden={distance !== 0}
              >
                <img
                  src={photo.src}
                  alt={distance === 0 ? photo.alt : ""}
                  width={1536}
                  height={1024}
                  fetchPriority={position === 1 ? "high" : "auto"}
                  loading={distance < 3 ? "eager" : "lazy"}
                  draggable={false}
                />
                <span className="depth-sheen" aria-hidden="true" />
              </div>
            );
          })}
          <div className="depth-registration" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
