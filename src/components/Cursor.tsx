"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * An ink dot that sits exactly on the pointer and a ring that trails it. The ring opens
 * over anything clickable; [data-magnetic] elements lean toward the pointer.
 * Mouse only: touch and reduced motion keep the native cursor.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia(`(pointer: fine) and ${MOTION_OK}`).matches) return;
    const html = document.documentElement;
    const d = dot.current!;
    const r = ring.current!;
    html.classList.add("has-cursor");

    const dx = gsap.quickSetter(d, "x", "px");
    const dy = gsap.quickSetter(d, "y", "px");
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "expo.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "expo.out" });

    let shown = false;
    let hovered: Element | null = null;
    let magnet: HTMLElement | null = null;
    let surfaceFrame = 0;

    const release = (el: HTMLElement) =>
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      // Magnetic pull, a third of the distance to the pointer.
      const m = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== m) release(magnet);
      magnet = m;
      if (m) {
        const b = m.getBoundingClientRect();
        gsap.to(m, {
          x: (e.clientX - (b.left + b.width / 2)) * 0.3,
          y: (e.clientY - (b.top + b.height / 2)) * 0.3,
          duration: 0.5,
          ease: "expo.out",
        });
      }

      // Swap to ink over the vermilion field, checked once a frame.
      if (!surfaceFrame) {
        surfaceFrame = requestAnimationFrame(() => {
          surfaceFrame = 0;
          const under = document.elementFromPoint(e.clientX, e.clientY);
          const s = under?.closest<HTMLElement>("[data-surface]")?.dataset.surface ?? "";
          d.parentElement!.dataset.on = s;
        });
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest(INTERACTIVE) ?? null;
      if (t === hovered) return;
      hovered = t;
      const text = t?.getAttribute("data-cursor") ?? "";
      label.current!.textContent = text;
      gsap.to(r, { scale: t ? (text ? 2.6 : 1.9) : 1, duration: 0.5, ease: "expo.out" });
      gsap.to(d, { scale: t ? 0 : 1, duration: 0.3, ease: "expo.out" });
    };

    const onLeave = () => {
      shown = false;
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
      if (magnet) release(magnet);
      magnet = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(surfaceFrame);
    };
  }, []);

  return (
    <div aria-hidden className="cursor pointer-events-none fixed left-0 top-0 z-[80]">
      <div
        ref={ring}
        className="cursor-ring absolute -left-5 -top-5 grid size-10 place-items-center rounded-full border-[1.5px] border-current opacity-0"
      >
        <span ref={label} className="wide text-[0.32rem] font-bold uppercase tracking-[0.08em]" />
      </div>
      <div ref={dot} className="absolute -left-[3.5px] -top-[3.5px] size-[7px] rounded-full bg-current opacity-0" />
    </div>
  );
}
