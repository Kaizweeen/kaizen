"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

/** Inertial scrolling on GSAP's clock. Off entirely under reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (!matchMedia(MOTION_OK).matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.11, anchors: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;

    // Layout settles once the webfonts land; re-measure every trigger then.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
