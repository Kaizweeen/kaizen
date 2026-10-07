"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Seal } from "./Seal";

const SEEN = "kz-intro";

/**
 * Once per visit: 改 and 善 are written in stroke order, pressed into a vermilion seal,
 * and the seal flies to the header to become the mark. Any click, key, or scroll skips it.
 * The head script decides whether it plays; CSS keeps it hidden otherwise.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      let play = html.dataset.intro === "play";
      // A dev-mode remount wipes the attribute the head script set; decide again.
      if (!play && matchMedia(MOTION_OK).matches) {
        try {
          play = !sessionStorage.getItem(SEEN);
        } catch {}
        if (play) html.dataset.intro = "play";
      }
      if (!play) {
        setDone(true);
        return;
      }
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}

      const el = root.current!;
      const seal = el.querySelector<HTMLElement>("[data-intro-seal]")!;
      const curtain = el.querySelector<HTMLElement>("[data-curtain]")!;
      const plate = el.querySelector<SVGRectElement>("[data-plate]")!;
      const ink = el.querySelector<SVGGElement>("[data-ink]")!;
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-stroke]", el);

      window.__lenis?.stop();
      html.style.overflow = "hidden";

      const finish = () => {
        html.style.overflow = "";
        delete html.dataset.intro;
        window.__lenis?.start();
        window.dispatchEvent(new Event("kz:intro-done"));
        setDone(true);
      };

      // A gap twice the path keeps the next dash off the end, where its round cap would
      // print a dot; strokes also stay hidden until their turn.
      gsap.set(strokes, { strokeDashoffset: 1, strokeDasharray: "1 2", opacity: 0 });
      gsap.set(ink, { stroke: "var(--fg)" });
      gsap.set(plate, { opacity: 0, scale: 1.25, rotation: -7, transformOrigin: "50% 50%" });
      gsap.set(seal, { opacity: 1 });

      const tl = gsap.timeline({ onComplete: finish, delay: 0.25 });

      // Brush: each stroke takes time in proportion to its length, the next starts as it lifts.
      strokes.forEach((s, i) => {
        const len = s.getTotalLength();
        tl.set(s, { opacity: 1 }, i === 0 ? 0 : ">-0.035").to(s, {
          strokeDashoffset: 0,
          duration: 0.07 + (len / 109) * 0.2,
          ease: "power2.inOut",
        }, "<");
      });

      // Stamp: the plate presses down and the strokes turn to bare paper.
      tl.to(plate, { opacity: 1, scale: 1, rotation: -2, duration: 0.34, ease: "power4.in" }, "+=0.12")
        .set(ink, { stroke: "var(--knock)" })
        .to(seal, { scale: 0.975, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" });

      // Hand-off: the seal lands on the header mark while the curtain lifts.
      tl.add(() => {
        const target = document.querySelector("[data-seal-target]")!.getBoundingClientRect();
        const from = seal.getBoundingClientRect();
        gsap.to(seal, {
          x: target.left + target.width / 2 - (from.left + from.width / 2),
          y: target.top + target.height / 2 - (from.top + from.height / 2),
          scale: target.height / from.height,
          rotation: 0,
          duration: 0.95,
          ease: "expo.inOut",
        });
      }, "+=0.28")
        .to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "expo.inOut" }, "<")
        .to({}, { duration: 0.95 });

      const skip = () => tl.timeScale(6);
      el.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", skip);
      window.addEventListener("wheel", skip, { passive: true });
      window.addEventListener("touchmove", skip, { passive: true });
      return () => {
        el.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("wheel", skip);
        window.removeEventListener("touchmove", skip);
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} aria-hidden className="intro fixed inset-0 z-[70] place-items-center">
      <div data-curtain className="absolute inset-0 bg-bg" style={{ clipPath: "inset(0% 0% 0% 0%)" }} />
      <div data-intro-seal className="relative h-[min(62vh,78vw)] opacity-0" style={{ aspectRatio: "120 / 228" }}>
        <Seal id="intro-seal" className="h-full w-full" strokeWidth={6.5} />
      </div>
    </div>
  );
}
