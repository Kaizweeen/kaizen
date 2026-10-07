"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { copy, EMAIL } from "@/lib/content";

/** Three plain offers. Each lands in register as it arrives, and again on hover. */
export function Clients() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const offers = root.current!.querySelectorAll<HTMLElement>("[data-offer]");
        gsap.set(offers, { y: 70, opacity: 0 });
        gsap.set(root.current!.querySelectorAll("[data-offer] h3"), { "--reg": 1 });
        offers.forEach((o) =>
          gsap.to(o, {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: o, start: "top 88%" },
            onStart: () => {
              gsap.to(o.querySelector("h3"), { "--reg": 0, duration: 1, ease: "expo.out", delay: 0.15 });
            },
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="clients" aria-labelledby="clients-h" className="px-[var(--gutter)] py-[clamp(6rem,16vh,12rem)]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <div className="flex items-start gap-4">
            <h2 id="clients-h" className="display max-w-[11ch] text-[clamp(2.3rem,4.4vw,4.2rem)]">
              {copy.clients.heading}
            </h2>
            <span lang="ja" aria-hidden className="jp vertical mt-1 text-lg text-shu">
              依頼
            </span>
          </div>
          <p className="mt-6 max-w-[38ch] text-fg-2">{copy.clients.sub}</p>
          <a href={`mailto:${EMAIL}?subject=Project%20inquiry`} className="btn btn-ink mt-8" data-magnetic>
            Tell me what you need
          </a>
        </div>

        <ul className="col-span-12 lg:col-span-7 lg:col-start-6">
          {copy.clients.offers.map((o) => (
            <li key={o.name} data-offer className="offer border-t-2 border-fg py-8 last:border-b-2 lg:py-10">
              <h3 className="reg display text-[clamp(1.8rem,3.3vw,3.1rem)] leading-[1]">{o.name}</h3>
              <p className="mt-4 max-w-[50ch] text-[1.1rem] text-fg-2">{o.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
