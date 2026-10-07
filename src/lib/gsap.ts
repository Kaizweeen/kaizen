import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** A colour token from the root, so canvas drawing follows the active theme. */
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Scroll the page to `y`, through Lenis when it is running. */
export function scrollToY(y: number, immediate = false) {
  if (window.__lenis) window.__lenis.scrollTo(y, { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "auto" });
}

/**
 * Tell the fixed header and version tag which surface they are sitting on, so they can
 * switch ink. `top` is the header line, `bottom` the version tag line.
 */
export function surface(trigger: Element, kind: "ink" | "shu", bottomStart = "top bottom-=32") {
  const html = document.documentElement;
  const toggle = (key: "surfaceTop" | "surfaceBottom") => (self: ScrollTrigger) => {
    if (self.isActive) html.dataset[key] = kind;
    else if (html.dataset[key] === kind) delete html.dataset[key];
  };
  // Measured last, after every pin above and inside has added its spacing.
  const base = { trigger, refreshPriority: -1 };
  ScrollTrigger.create({ ...base, start: "top 32px", end: "bottom 32px", onToggle: toggle("surfaceTop") });
  ScrollTrigger.create({ ...base, start: bottomStart, end: "bottom bottom-=32", onToggle: toggle("surfaceBottom") });
}

/** Run `cb` once the intro curtain has lifted (or right away when there is no intro). */
export function whenIntroDone(cb: () => void): () => void {
  if (document.documentElement.dataset.intro !== "play") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("kz:intro-done", handler, { once: true });
  return () => window.removeEventListener("kz:intro-done", handler);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
