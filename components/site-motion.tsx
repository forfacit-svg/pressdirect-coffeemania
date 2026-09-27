"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible if scripts or observers are unavailable. */
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMotion = window.matchMedia(
      "(min-width: 761px) and (hover: hover) and (pointer: fine)",
    );
    let dispose = () => {};

    function setup() {
      dispose();
      if (reducedMotion.matches) return;

      const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      const pending = new Set<HTMLElement>();
      const show = (element: HTMLElement, instant = false) => {
        if (instant) element.dataset.revealInstant = "true";
        element.dataset.revealState = "visible";
        pending.delete(element);
        revealObserver.unobserve(element);
      };
      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) show(entry.target as HTMLElement);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -28px 0px" },
      );

      for (const element of reveals) {
        // Never conceal an element that is already visible, including restored scroll positions.
        const bounds = element.getBoundingClientRect();
        if (
          element.dataset.revealState === "visible" ||
          (bounds.top < window.innerHeight && bounds.bottom > 0)
        ) {
          element.dataset.revealState = "visible";
          continue;
        }
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(Number(element.dataset.revealDelay) || 0, 180)}ms`,
        );
        element.dataset.revealState = "pending";
        pending.add(element);
        revealObserver.observe(element);
      }

      // Keyboard navigation must never focus an invisible link or control.
      const onFocus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        let element = event.target.closest<HTMLElement>('[data-reveal-state="pending"]');
        while (element) {
          show(element, true);
          element =
            element.parentElement?.closest<HTMLElement>('[data-reveal-state="pending"]') ?? null;
        }
      };
      document.addEventListener("focusin", onFocus);

      const photos = desktopMotion.matches
        ? Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"))
        : [];
      const activePhotos = new Set<HTMLElement>();
      const offsets = new WeakMap<HTMLElement, number>();
      let frame = 0;
      let stopped = false;
      const paint = () => {
        frame = 0;
        if (stopped || document.hidden) return;
        const height = window.innerHeight;
        // Read all geometry before writing transforms, to avoid layout thrashing.
        const updates = Array.from(activePhotos, (element) => {
          const bounds = element.getBoundingClientRect();
          const previous = offsets.get(element) ?? 0;
          const progress =
            (height / 2 - (bounds.top - previous + bounds.height / 2)) /
            ((height + bounds.height) / 2);
          const distance = Math.min(Number(element.dataset.parallax) || 14, 20);
          return { element, offset: Math.max(-1, Math.min(1, progress)) * distance };
        });
        for (const { element, offset } of updates) {
          element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
          offsets.set(element, offset);
        }
      };
      const schedule = () => {
        if (!stopped && !document.hidden && !frame && activePhotos.size)
          frame = window.requestAnimationFrame(paint);
      };
      const photoObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting) activePhotos.add(element);
            else activePhotos.delete(element);
          }
          schedule();
        },
        { rootMargin: "120px 0px" },
      );
      for (const photo of photos) photoObserver.observe(photo);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      document.addEventListener("visibilitychange", schedule);
      document.addEventListener("load", schedule, true);
      // Expanding the restaurant list changes positions of photography further down the page.
      document.addEventListener("toggle", schedule, true);

      dispose = () => {
        stopped = true;
        revealObserver.disconnect();
        photoObserver.disconnect();
        window.cancelAnimationFrame(frame);
        document.removeEventListener("focusin", onFocus);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", schedule);
        document.removeEventListener("load", schedule, true);
        document.removeEventListener("toggle", schedule, true);
        for (const element of pending) delete element.dataset.revealState;
        for (const element of reveals) element.style.removeProperty("--reveal-delay");
        for (const photo of photos) photo.style.removeProperty("--parallax-y");
      };
    }

    setup();
    reducedMotion.addEventListener("change", setup);
    desktopMotion.addEventListener("change", setup);
    return () => {
      dispose();
      reducedMotion.removeEventListener("change", setup);
      desktopMotion.removeEventListener("change", setup);
    };
  }, [pathname]);

  return null;
}
