"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK, token, whenIntroDone } from "@/lib/gsap";
import { createParticles, step, targetsFromAlpha, type Particles, type Pointer } from "@/lib/particles";
import { copy } from "@/lib/content";

const WORD = "KAIZEN";

/**
 * The word arrives as scattered ink and settles into type. The pointer knocks particles
 * off register (they show a vermilion plate while displaced) and they settle back.
 * Returns a cleanup. The loop sleeps once everything is at rest.
 */
function runParticles(stage: HTMLElement, cv: HTMLCanvasElement, fallback: HTMLElement) {
  const ctx = cv.getContext("2d")!;
  const html = document.documentElement;
  let p: Particles | null = null;
  let w = 0;
  let h = 0;
  let gap = 5;
  let wordTop = 0;
  let wordBottom = 0;
  let raf = 0;
  let last = 0;
  let restFrames = 0;
  let started = false;
  let visible = true;
  let disposed = false;
  let pointer: Pointer = null;
  let touched = false;
  let ink = token("--fg");
  let shu = token("--shu");

  const family = getComputedStyle(html).getPropertyValue("--font-archivo").trim() || "sans-serif";

  async function build() {
    const r = stage.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = Math.max(3, Math.round(w / 240));

    try {
      await document.fonts.load(`800 100px ${family}`);
    } catch {}
    if (disposed) return;

    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    const font = (size: number) => `800 ${size}px ${family}`;
    if ("fontStretch" in o) (o as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "expanded";
    // Portrait stages set the word as KAI over ZEN so it can fill the space.
    const lines = h > w * 0.75 ? [WORD.slice(0, 3), WORD.slice(3)] : [WORD];
    const LEAD = 1.12;
    let size = 100;
    o.font = font(size);
    const widest = Math.max(...lines.map((l) => o.measureText(l).width));
    const capRatio = o.measureText("K").actualBoundingBoxAscent / size;
    size = Math.min((size * (w * 0.97)) / widest, (h * 0.9) / (capRatio * (1 + (lines.length - 1) * LEAD)));
    o.font = font(size);
    o.textAlign = "center";
    o.textBaseline = "alphabetic";
    // Set the word on the stage floor, like type sitting on the rule below it.
    const step = size * capRatio * LEAD;
    lines.forEach((l, i) => o.fillText(l, w / 2, h - 2 - (lines.length - 1 - i) * step));

    const targets = targetsFromAlpha(o.getImageData(0, 0, w, h).data, w, h, gap);
    wordTop = h;
    wordBottom = 0;
    for (let i = 1; i < targets.length; i += 2) {
      wordTop = Math.min(wordTop, targets[i]);
      wordBottom = Math.max(wordBottom, targets[i]);
    }
    const prev = p;
    p = createParticles(targets, w, h);
    if (prev) {
      // On resize, keep the ink where it is and let it flow to the new shape.
      const n = Math.min(prev.n, p.n);
      p.x.set(prev.x.subarray(0, n));
      p.y.set(prev.y.subarray(0, n));
    }
    draw();
  }

  function draw() {
    if (!p) return;
    const s = gap * 0.72;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = shu;
    for (let i = 0; i < p.n; i++) {
      const k = p.heat[i];
      if (k > 0.08) ctx.fillRect(p.x[i] + k * 7, p.y[i] - k * 5, s, s);
    }
    ctx.fillStyle = ink;
    for (let i = 0; i < p.n; i++) ctx.fillRect(p.x[i], p.y[i], s, s);
  }

  function frame(t: number) {
    raf = 0;
    if (!p || !visible || disposed) return;
    const dt = last ? Math.min(0.033, (t - last) / 1000) : 1 / 60;
    last = t;
    step(p, pointer, dt);
    draw();
    let hot = 0;
    for (let i = 0; i < p.n; i += 7) hot = Math.max(hot, p.heat[i]);
    restFrames = hot < 0.004 && !pointer ? restFrames + 1 : 0;
    if (restFrames < 30) raf = requestAnimationFrame(frame);
    else last = 0;
  }

  function wake() {
    restFrames = 0;
    if (started && !raf && visible) raf = requestAnimationFrame(frame);
  }

  const onMove = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const reach = Math.max(56, w * 0.065);
    if (x < -reach || y < -reach || x > w + reach || y > h + reach) {
      pointer = null;
      return;
    }
    touched = true;
    pointer = { x, y, r: reach };
    wake();
  };
  const onLeave = () => {
    pointer = null;
  };

  // One unprompted pass of an invisible brush, so touch visitors learn the word reacts.
  function ghostSweep() {
    if (touched || disposed) return;
    const g = { t: 0 };
    gsap.to(g, {
      t: 1,
      duration: 1.5,
      ease: "power1.inOut",
      onUpdate: () => {
        if (touched) return;
        const mid = (wordTop + wordBottom) / 2;
        const span = wordBottom - wordTop;
        pointer = { x: -60 + g.t * (w + 120), y: mid + Math.sin(g.t * Math.PI * 2) * span * 0.32, r: Math.max(56, w * 0.065) };
        wake();
      },
      onComplete: () => {
        if (!touched) pointer = null;
      },
    });
  }

  const refreshColors = () => {
    ink = token("--fg");
    shu = token("--shu");
    draw();
  };
  const themeObserver = new MutationObserver(refreshColors);
  themeObserver.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
  const darkMq = matchMedia("(prefers-color-scheme: dark)");
  darkMq.addEventListener("change", refreshColors);

  let resizeTimer = 0;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => build().then(wake), 160);
  });

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
  });

  let offIntro = () => {};
  build().then(() => {
    if (disposed) return;
    fallback.style.opacity = "0";
    resizeObserver.observe(stage);
    io.observe(stage);
    offIntro = whenIntroDone(() => {
      started = true;
      wake();
      gsap.delayedCall(2.6, ghostSweep);
    });
  });

  window.addEventListener("pointermove", onMove, { passive: true });
  html.addEventListener("pointerleave", onLeave);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    offIntro();
    gsap.killTweensOf(ghostSweep);
    themeObserver.disconnect();
    darkMq.removeEventListener("change", refreshColors);
    resizeObserver.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    html.removeEventListener("pointerleave", onLeave);
    fallback.style.opacity = "";
  };
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const stop = runParticles(stage.current!, canvas.current!, fallback.current!);

        const rise = gsap.utils.toArray<HTMLElement>("[data-rise]");
        const split = SplitText.create(rise, { type: "lines", mask: "lines", linesClass: "reg" });
        gsap.set(rise, { opacity: 1 });
        gsap.set(split.lines, { yPercent: 115, "--reg": 1 });
        const offIntro = whenIntroDone(() =>
          gsap.to(split.lines, {
            yPercent: 0,
            "--reg": 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.07,
            delay: 0.1,
            onComplete: () => split.revert(),
          }),
        );

        // Leaving the hero, the word lifts and thins, like ink drying back into paper.
        gsap.to(stage.current, {
          yPercent: -16,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          stop();
          offIntro();
          split.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-name"
      className="relative flex h-[100svh] min-h-[620px] flex-col px-[var(--gutter)] pb-[clamp(3.25rem,6vh,4.5rem)] pt-20"
    >
      <div ref={stage} className="relative flex-1 md:mr-12">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
        <p
          ref={fallback}
          aria-hidden
          className="display pointer-events-none absolute inset-0 flex items-end justify-center text-[17vw] leading-[0.74] transition-opacity duration-500 select-none"
        >
          {WORD}
        </p>
      </div>

      <p
        lang="ja"
        aria-hidden
        className="jp vertical absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 text-[1.35rem] text-shu md:block"
      >
        改善
      </p>

      <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-5 border-t-2 border-fg pt-5">
        <h1 id="hero-name" className="col-span-12 sm:col-span-6 lg:col-span-4">
          <span data-rise className="display block text-[clamp(1.7rem,3.1vw,2.7rem)]">
            {copy.hero.name}
          </span>
          <span data-rise className="mt-2 block text-fg-2">
            {copy.hero.role}
          </span>
        </h1>
        <p
          data-rise
          className="col-span-12 max-w-[22ch] text-[clamp(1.2rem,1.7vw,1.5rem)] font-medium leading-snug sm:col-span-6 lg:col-span-4"
        >
          {copy.hero.line}
        </p>
        <div className="col-span-12 flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <a href="#work" className="btn btn-ink" data-magnetic>
            {copy.hero.cta}
          </a>
          <a href="#contact" className="btn btn-line" data-magnetic>
            {copy.hero.contact}
          </a>
        </div>
      </div>
    </section>
  );
}
