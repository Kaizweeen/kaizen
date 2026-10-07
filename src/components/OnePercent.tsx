"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, surface } from "@/lib/gsap";
import { CHART_H, CHART_W, DAYS, plot, toY } from "@/lib/chart";
import { compound } from "@/lib/math";
import { copy } from "@/lib/content";

const better = plot(0.01);
const still = plot(0);
const FINAL = compound(0.01, DAYS).toFixed(2);
const Y_TICKS = [1, 10, 20, 30];
const X_TICKS = [0, 91, 182, 273, 365];

/**
 * The only place the name's meaning is spelled out, and it is proved in arithmetic.
 * The section wipes in as a solid ink block, pins, and scrolls the year from day 0 to
 * day 365; the curve, the dot, and the number are all read from the same day value.
 */
export function OnePercent() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const curve = useRef<SVGPathElement>(null);
  const flat = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const value = useRef<HTMLSpanElement>(null);
  const day = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      surface(root.current!, "ink");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { d: 0 };
        const render = () => {
          const i = Math.round(state.d);
          curve.current!.style.strokeDashoffset = String(1 - better.frac[i]);
          flat.current!.style.strokeDashoffset = String(1 - still.frac[i]);
          const [x, y] = better.pts[i];
          head.current!.setAttribute("cx", x.toFixed(2));
          head.current!.setAttribute("cy", y.toFixed(2));
          value.current!.textContent = compound(0.01, i).toFixed(2);
          day.current!.textContent = String(i);
        };
        render();

        gsap.fromTo(
          panel.current,
          { clipPath: "inset(9% 5% 9% 5%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
          },
        );

        gsap.to(state, {
          d: DAYS,
          ease: "none",
          onUpdate: render,
          scrollTrigger: { trigger: panel.current, start: "top top", end: "+=160%", pin: true, scrub: 0.5 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="one-percent" data-surface="ink" aria-labelledby="one-h">
      <div
        ref={panel}
        className="relative flex min-h-[100svh] flex-col bg-fg px-[var(--gutter)] pb-16 pt-24 text-bg"
      >
        <h2 id="one-h" className="display max-w-[17ch] text-[clamp(2rem,4.8vw,4.6rem)] leading-[1]">
          <span lang="ja" className="jp tracking-normal">
            {copy.onePercent.jp}
          </span>{" "}
          {copy.onePercent.heading}
        </h2>

        <div className="mt-auto grid grid-cols-12 items-end gap-x-6 gap-y-10 pt-10">
          <figure className="col-span-12 lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <svg
              viewBox={`-40 -20 ${CHART_W + 80} ${CHART_H + 60}`}
              className="h-auto max-h-[52vh] w-full overflow-visible"
              role="img"
              aria-label={`Chart: improving one percent a day compounds to ${FINAL} times after ${DAYS} days. Not improving stays at 1.`}
            >
              {Y_TICKS.map((v) => (
                <g key={v}>
                  <line x1={0} x2={CHART_W} y1={toY(v)} y2={toY(v)} stroke="currentColor" strokeOpacity={0.14} />
                  <text x={-12} y={toY(v) + 5} textAnchor="end" className="nums chart-label" fill="currentColor" fillOpacity={0.6}>
                    {v}
                  </text>
                </g>
              ))}
              <line x1={0} x2={CHART_W} y1={CHART_H} y2={CHART_H} stroke="currentColor" strokeWidth={2} />
              {X_TICKS.map((d) => (
                <text
                  key={d}
                  x={(d / DAYS) * CHART_W}
                  y={CHART_H + 30}
                  textAnchor={d === 0 ? "start" : d === DAYS ? "end" : "middle"}
                  className="nums chart-label"
                  fill="currentColor"
                  fillOpacity={0.6}
                >
                  {d === 0 ? "Day 0" : d === DAYS ? "Day 365" : d}
                </text>
              ))}
              <path
                ref={flat}
                d={still.d}
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.55}
                strokeWidth={3}
                strokeDasharray={1}
                strokeDashoffset={0}
              />
              <path
                ref={curve}
                d={better.d}
                pathLength={1}
                fill="none"
                stroke="var(--shu)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={0}
              />
              <circle ref={head} cx={better.pts[DAYS][0]} cy={better.pts[DAYS][1]} r={9} fill="var(--shu)" />
            </svg>
            <figcaption className="mt-3 text-right text-sm text-bg/70">
              Day <span ref={day} className="nums">{DAYS}</span> of {DAYS}
            </figcaption>
          </figure>

          <div className="col-span-12 grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:row-start-1 lg:grid-cols-1">
            <div>
              <p className="text-sm text-bg/70">{copy.onePercent.still}</p>
              <p className="wide nums mt-1 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold">
                1.00<sup className="text-[0.45em]">365</sup> = 1.00
              </p>
            </div>
            <div>
              <p className="text-sm text-bg/70">{copy.onePercent.better}</p>
              <p className="wide nums mt-1 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold text-shu">
                1.01<sup className="text-[0.45em]">365</sup> = <span ref={value}>{FINAL}</span>
              </p>
            </div>
            <p className="max-w-[34ch] text-sm text-bg/70 sm:col-span-2 lg:col-span-1">{copy.onePercent.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
