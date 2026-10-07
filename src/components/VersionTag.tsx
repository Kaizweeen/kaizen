"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { versionFor } from "@/lib/math";

/**
 * The page's release number, v0.1 at the top to v1.0 at the close, read from scroll
 * progress. Ten ticks show it to scale.
 */
export function VersionTag() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]");
      let last = "";
      const render = (progress: number) => {
        const v = versionFor(progress);
        if (v === last) return;
        last = v;
        num.current!.textContent = v;
        const filled = v === "v1.0" ? 10 : Number(v.slice(3));
        ticks.forEach((t, i) => t.toggleAttribute("data-on", i < filled));
        root.current!.toggleAttribute("data-released", v === "v1.0");
        gsap.fromTo(num.current, { "--reg": 1 }, { "--reg": 0, duration: 0.5, ease: "expo.out" });
      };
      const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => render(self.progress) });
      render(st.progress);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="vtag pointer-events-none fixed bottom-4 left-[var(--gutter)] z-50 flex items-end gap-2.5 transition-colors duration-300"
    >
      <span className="jp text-[0.7rem] leading-none">版</span>
      <span ref={num} className="reg wide nums text-[0.8rem] font-bold leading-none">
        v0.1
      </span>
      <span className="mb-px flex items-end gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} data-tick className="vtick block h-2.5 w-[2px] bg-current" />
        ))}
      </span>
    </div>
  );
}
