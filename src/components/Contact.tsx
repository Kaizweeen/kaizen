"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK, surface } from "@/lib/gsap";
import { copy, EMAIL, GITHUB } from "@/lib/content";
import { Seal } from "./Seal";

/**
 * The close. Vermilion floods the frame from the bottom edge, the heading lands, and the
 * seal is stamped: v1.0. Text on the field is always ink.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const flood = useRef<HTMLDivElement>(null);
  const stamp = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  useGSAP(
    () => {
      // The version tag's corner is paper until the plate has grown over it.
      surface(root.current!, "shu", matchMedia(MOTION_OK).matches ? "top 5%" : undefined);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The seal's plate, a tall vermilion block, grows until it is the whole page.
        gsap.fromTo(
          flood.current,
          { clipPath: "inset(22% 41% 40% 41%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.inOut",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 5%", scrub: true },
          },
        );

        const split = SplitText.create("[data-close]", { type: "words", mask: "words", wordsClass: "reg" });
        gsap.set(split.words, { yPercent: 110, "--reg": 1 });
        gsap.set(stamp.current, { opacity: 0, scale: 1.7, rotation: -14 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 30%" } });
        tl.to(split.words, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 })
          .to(split.words, { "--reg": 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, "<0.25")
          .to(stamp.current, { opacity: 1, scale: 1, rotation: -4, duration: 0.32, ease: "power4.in" }, "-=0.5")
          .to(stamp.current, { x: 3, y: -2, duration: 0.05, yoyo: true, repeat: 3, ease: "none" });

        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setStatus(copy.contact.copied);
    } catch {
      setStatus("Your browser blocked copying. The address is above.");
    }
    window.setTimeout(() => setStatus(""), 2600);
  }

  return (
    <section ref={root} id="contact" data-surface="shu" aria-labelledby="contact-h" className="relative overflow-hidden">
      <div ref={flood} className="absolute inset-0 bg-shu" />
      <div className="relative flex min-h-[100svh] flex-col px-[var(--gutter)] pb-16 pt-28 text-on-shu">
        <div className="grid grid-cols-12 items-start gap-6">
          <h2
            id="contact-h"
            data-close
            className="display col-span-12 text-[clamp(3.2rem,10.5vw,10rem)] leading-[0.9] lg:col-span-9"
          >
            {copy.contact.heading}
          </h2>
          <div className="col-span-12 flex lg:col-span-3 lg:justify-end">
            <div ref={stamp} className="h-[clamp(7rem,22vh,13rem)]" style={{ aspectRatio: "120 / 228" }}>
              <Seal id="contact-seal" plate="var(--on-shu)" ink="var(--shu)" className="h-full w-full" label="改善, Kai's seal" />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-16">
          <p className="wide break-all text-[clamp(1.05rem,2.5vw,2.1rem)] font-bold">{EMAIL}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={copyEmail} className="btn btn-onshu" data-magnetic>
              {status === copy.contact.copied ? "Copied" : copy.contact.copy}
            </button>
            <a href={`mailto:${EMAIL}`} className="btn btn-onshu-line" data-magnetic>
              {copy.contact.write}
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="btn btn-onshu-line" data-magnetic>
              {copy.contact.github}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p role="status" className="mt-3 min-h-[1.5em] text-sm font-semibold">
            {status}
          </p>

          <footer className="mt-12 grid gap-3 border-t-2 border-on-shu pt-5 text-sm sm:grid-cols-[auto_1fr_auto] sm:gap-8">
            <p className="font-bold">&copy; 2026 Kaizen Gabriel</p>
            <p>
              {copy.footer.built}{" "}
              <a href="https://kanjivg.tagaini.net" target="_blank" rel="noreferrer" className="underline">
                {copy.footer.credit}
              </a>
            </p>
            <a href="#top" className="wide font-bold uppercase tracking-[0.08em] underline">
              Back to top
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}
