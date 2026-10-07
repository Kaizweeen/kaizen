"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { copy } from "@/lib/content";

/** The paragraph prints itself word by word as it scrolls through, each word landing in register. */
export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-words]", { type: "words", wordsClass: "reg" });
        gsap.set(split.words, { opacity: 0.14, "--reg": 1 });
        gsap.to(split.words, {
          opacity: 1,
          "--reg": 0,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 72%", end: "bottom 62%", scrub: 0.6 },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="About Kai" className="px-[var(--gutter)] py-[clamp(7rem,20vh,14rem)]">
      <p
        data-words
        className="mx-auto max-w-[26ch] text-[clamp(1.85rem,4.3vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.022em] text-balance lg:ml-[16.6%] lg:mr-0"
      >
        <span className="text-shu">{copy.statement.lead}</span> {copy.statement.body}
      </p>
    </section>
  );
}
