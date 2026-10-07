"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Seal } from "./Seal";

type Theme = "paper" | "sumi";

const STORE = "kz-theme";

function effectiveTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "paper" || set === "sumi") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "sumi" : "paper";
}

/** The theme lives on <html> and in storage; React only reads it. */
function subscribeTheme(onChange: () => void) {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener("kz:theme", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("kz:theme", onChange);
  };
}

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#method", label: "Method" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, effectiveTheme, () => null);
  const root = useRef<HTMLElement>(null);

  // Out of the way while reading down, back the moment the reader scrolls up.
  useGSAP(() => {
    const el = root.current!;
    let hidden = false;
    const set = (hide: boolean) => {
      if (hide === hidden) return;
      hidden = hide;
      gsap.to(el, {
        yPercent: hide ? -110 : 0,
        duration: matchMedia(MOTION_OK).matches ? 0.6 : 0,
        ease: "expo.out",
        overwrite: true,
      });
    };
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => set(self.direction === 1 && self.scroll() > 160),
    });
    el.addEventListener("focusin", () => set(false));
  });

  useLayoutEffect(() => {
    // Re-apply after a dev-mode remount clears the attribute the head script set.
    try {
      const stored = localStorage.getItem(STORE);
      if (stored === "paper" || stored === "sumi") {
        document.documentElement.dataset.theme = stored;
        window.dispatchEvent(new Event("kz:theme"));
      }
    } catch {}
  }, []);

  function toggle() {
    const next: Theme = effectiveTheme() === "sumi" ? "paper" : "sumi";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORE, next);
    } catch {}
    window.dispatchEvent(new Event("kz:theme"));
  }

  return (
    <header
      ref={root}
      className="hdr fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-[var(--gutter)] transition-colors duration-300"
    >
      <a href="#top" className="group flex items-center gap-3" aria-label="Kaizen Gabriel, back to the top">
        <span data-seal-target className="block h-9 w-[19px] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-rotate-6">
          <Seal id="hdr-seal" className="h-full w-full" />
        </span>
        <span className="wide hidden text-[0.72rem] font-bold uppercase tracking-[0.08em] sm:block">Kaizen Gabriel</span>
      </a>

      <nav aria-label="Sections">
        <ul className="flex items-center gap-4 text-[0.72rem] font-bold uppercase tracking-[0.08em] sm:gap-8">
          {LINKS.map((l) => (
            <li key={l.href} className="wide">
              <a href={l.href} className="nav-link">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={toggle}
              className="theme-toggle jp flex items-center gap-1 text-base leading-none"
              aria-label={theme === "sumi" ? "Switch to the light paper theme" : "Switch to the dark ink theme"}
              data-theme-now={theme ?? undefined}
            >
              <span data-glyph="paper">紙</span>
              <span aria-hidden className="text-[0.6rem] opacity-40">/</span>
              <span data-glyph="sumi">墨</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
