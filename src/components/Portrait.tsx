"use client";

// Not mounted right now: Kai pulled his photo until he has a professional one.
// To bring it back, cut the new photo out with scripts/matte.mjs, export it to
// public/kai.webp (720x960, transparent background), and render <Portrait /> beside
// the paragraph in Statement.tsx.

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, token } from "@/lib/gsap";

/** True when the active ground is dark, so the halftone prints light dots for light areas. */
function darkGround(): boolean {
  const hex = token("--bg").replace("#", "");
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 < 128;
}

/**
 * Kai's photo re-printed as a two-ink halftone on the page's own paper: sumi dots carry the
 * image, a vermilion plate starts off register. Scrolling runs the print from top to bottom
 * and brings the plate into register; the pointer knocks nearby dots loose.
 * Draws only when something changes. Returns a cleanup.
 */
function runHalftone(wrap: HTMLElement, cv: HTMLCanvasElement, img: HTMLImageElement, motion: boolean) {
  const ctx = cv.getContext("2d")!;
  const html = document.documentElement;
  const state = { p: motion ? 0 : 1, reg: motion ? 1 : 0, h: 0 };
  let w = 0;
  let h = 0;
  let cell = 6;
  let cols = 0;
  let rows = 0;
  let cover = new Float32Array(0);
  let pointer: { x: number; y: number } | null = null;
  let ink = "";
  let shu = "";
  let frame = 0;
  let disposed = false;

  function sample() {
    const r = wrap.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.max(3, Math.min(4.6, w / 100));
    cols = Math.floor(w / cell);
    rows = Math.floor(h / cell);

    const off = document.createElement("canvas");
    off.width = cols;
    off.height = rows;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    o.drawImage(img, 0, 0, cols, rows);
    const d = o.getImageData(0, 0, cols, rows).data;
    const dark = darkGround();
    cover = new Float32Array(cols * rows);
    for (let i = 0; i < cols * rows; i++) {
      const lum = d[i * 4] / 255;
      const alpha = d[i * 4 + 3] / 255;
            cover[i] = alpha * (dark ? lum : 1 - lum);
    }
    ink = token("--fg");
    shu = token("--shu");
  }

  function draw() {
    frame = 0;
    if (disposed) return;
    ctx.clearRect(0, 0, w, h);
    const band = rows * 0.32;
    const head = state.p * (rows + band);
    const reach = w * 0.17;
    const pass = (color: string, plate: boolean) => {
      ctx.fillStyle = color;
      for (let r = 0; r < rows; r++) {
        const t = Math.min(1, Math.max(0, (head - r) / band));
        if (t <= 0) break;
        const ease = 1 - (1 - t) ** 3;
        for (let c = 0; c < cols; c++) {
          const v = cover[r * cols + c];
          if (v < 0.04) continue;
          const cx = c * cell + cell / 2;
          const cy = r * cell + cell / 2;
          let s = cell * 0.98 * Math.sqrt(v) * ease;
          let dx = 0;
          let dy = 0;
          let off = state.reg;
          if (pointer && state.h > 0) {
            const ex = cx - pointer.x;
            const ey = cy - pointer.y;
            const dist = Math.hypot(ex, ey);
            const k = state.h * Math.max(0, 1 - dist / reach);
            if (k > 0) {
              // A loupe, not a hole: dots swell and lean outward a little, the plate slips.
              s *= 1 + k * 0.4;
              dx = (ex / (dist || 1)) * k * cell * 0.7;
              dy = (ey / (dist || 1)) * k * cell * 0.7;
              off = Math.max(off, k * 0.8);
            }
          }
          if (plate) {
            if (off < 0.02 || v < 0.35) continue;
            ctx.fillRect(cx - s / 2 + dx + off * cell * 1.7, cy - s / 2 + dy - off * cell * 1.2, s, s);
          } else {
            ctx.fillRect(cx - s / 2 + dx, cy - s / 2 + dy, s, s);
          }
        }
      }
    };
    pass(shu, true);
    pass(ink, false);
  }

  // Once the dots are down, the continuous-tone photo develops underneath them, so the
  // face stays recognisable at any screen size.
  const develop = () => {
    img.style.opacity = String(0.55 * Math.min(1, Math.max(0, (state.p - 0.55) / 0.45)));
  };
  const request = () => {
    develop();
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const onMove = (e: PointerEvent) => {
    const r = wrap.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (state.h < 1) gsap.to(state, { h: 1, duration: 0.5, ease: "expo.out", onUpdate: request, overwrite: "auto" });
    request();
  };
  const onLeave = () => {
    gsap.to(state, { h: 0, duration: 0.9, ease: "expo.out", onUpdate: request, overwrite: "auto" });
  };

  const refresh = () => {
    sample();
    request();
  };
  const themeObserver = new MutationObserver(refresh);
  const darkMq = matchMedia("(prefers-color-scheme: dark)");
  let resizeTimer = 0;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 120);
  });

  img
    .decode()
    .catch(() => {})
    .then(() => {
      if (disposed || !img.naturalWidth) return;
      sample();
      draw();
      develop();
      themeObserver.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
      darkMq.addEventListener("change", refresh);
      resizeObserver.observe(wrap);
      if (motion) {
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
        gsap.to(state, {
          p: 1,
          reg: 0,
          ease: "none",
          onUpdate: request,
          scrollTrigger: { trigger: wrap, start: "top 92%", end: "center 58%", scrub: 0.6 },
        });
      }
    });

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    clearTimeout(resizeTimer);
    themeObserver.disconnect();
    darkMq.removeEventListener("change", refresh);
    resizeObserver.disconnect();
    wrap.removeEventListener("pointermove", onMove);
    wrap.removeEventListener("pointerleave", onLeave);
    gsap.killTweensOf(state);
    img.style.opacity = "";
  };
}

export function Portrait() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => runHalftone(wrap.current!, cv.current!, img.current!, matchMedia(MOTION_OK).matches),
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="relative aspect-[3/4] w-full" data-cursor="Hi">
      {/* The printed source; the canvas replaces it once drawn. Without JS it stays. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={img}
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/kai.webp`}
        alt="Kaizen Gabriel"
        width={720}
        height={960}
        className="portrait-src absolute inset-0 h-full w-full"
      />
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
}
