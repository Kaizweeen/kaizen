"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { copy } from "@/lib/content";

/** PDCA, the kaizen cycle, in the Japanese it is usually written in. */
const KANJI = ["計画", "実行", "評価", "改善"];
const R = 100;
const GAP = 7; // degrees of bare paper between segments

function arc(i: number) {
  // Segment i is centred at 12, 3, 6, then 9 o'clock.
  const a0 = ((i * 90 - 45 + GAP / 2 - 90) * Math.PI) / 180;
  const a1 = ((i * 90 + 45 - GAP / 2 - 90) * Math.PI) / 180;
  const p = (a: number) => `${(Math.cos(a) * R).toFixed(2)} ${(Math.sin(a) * R).toFixed(2)}`;
  return `M ${p(a0)} A ${R} ${R} 0 0 1 ${p(a1)}`;
}

/**
 * The ring turns once as you scroll through, carrying each step under the fixed marker
 * at the top, and ends back at Plan: the loop starts again.
 */
export function Method() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGGElement>(null);
  const kanji = useRef<HTMLParagraphElement>(null);
  const name = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 1024px)", motion: MOTION_OK }, (ctx) => {
        const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
        if (!motion) return;
        const el = root.current!;
        const arcs = el.querySelectorAll<SVGPathElement>("[data-arc]");
        const steps = el.querySelectorAll<HTMLElement>("[data-step]");
        let active = -1;

        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          arcs.forEach((a, j) => a.toggleAttribute("data-on", j === i));
          steps.forEach((s, j) => s.toggleAttribute("data-on", j === i));
          kanji.current!.textContent = KANJI[i];
          name.current!.textContent = copy.method.steps[i].name;
          gsap.fromTo(
            [kanji.current, name.current],
            { "--reg": 1, y: 10 },
            { "--reg": 0, y: 0, duration: 0.6, ease: "expo.out", overwrite: true },
          );
        };
        setActive(0);

        gsap.to(ring.current, {
          rotation: -360,
          svgOrigin: "0 0",
          ease: "none",
          scrollTrigger: {
            trigger: wide ? pin.current : el,
            start: wide ? "top top" : "top 70%",
            end: wide ? "+=220%" : "bottom 40%",
            pin: wide,
            scrub: 0.6,
            onUpdate: (self) => setActive(Math.round(self.progress * 4) % 4),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="method" aria-labelledby="method-h" className="px-[var(--gutter)]">
      <div
        ref={pin}
        className="grid grid-cols-12 items-center gap-x-6 gap-y-12 py-24 lg:min-h-[100svh] lg:py-20"
      >
        <div className="relative col-span-12 lg:col-span-6">
          <svg viewBox="-125 -125 250 250" className="mx-auto block w-[min(80vw,64vh)] overflow-visible" aria-hidden>
            <path d="M0 -122 L-7 -134 L7 -134 Z" fill="var(--shu)" />
            <g ref={ring}>
              {copy.method.steps.map((s, i) => (
                <path key={s.name} data-arc d={arc(i)} className="method-arc" fill="none" strokeWidth={11} />
              ))}
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p ref={kanji} lang="ja" className="reg jp text-[clamp(2.8rem,6vw,5.4rem)] leading-none">
              改善
            </p>
            <p ref={name} className="reg wide mt-3 text-sm font-bold uppercase tracking-[0.1em] text-fg-2">
              The loop
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <h2 id="method-h" className="display text-[clamp(2.4rem,5vw,4.6rem)]">
            {copy.method.heading}
          </h2>
          <ol className="mt-10 space-y-7">
            {copy.method.steps.map((s, i) => (
              <li key={s.name} data-step className="method-step grid grid-cols-[2.5rem_1fr] gap-x-2">
                <span className="step-n wide nums text-sm font-bold">{i + 1}</span>
                <div>
                  <h3 className="text-[1.35rem] font-bold leading-tight">
                    <span>{s.name}</span>{" "}
                    <span lang="ja" className="jp ml-1 text-sm font-bold tracking-normal text-fg-2">
                      {KANJI[i]}
                    </span>
                  </h3>
                  <p className="mt-1.5 max-w-[46ch] text-fg-2">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
