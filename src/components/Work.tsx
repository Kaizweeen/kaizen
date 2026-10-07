"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_OK, scrollToY } from "@/lib/gsap";
import { copy, projects, type Project } from "@/lib/content";

const MOST_COMMITS = Math.max(...projects.map((p) => p.commits ?? 0));

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" className="size-[0.7em]" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M3 9 9 3M4 3h5v5" strokeLinecap="square" />
    </svg>
  );
}

/** A proof sheet for projects with no public screens: the name set big, with crop marks. */
function Cover({ name }: { name: string }) {
  const mark = "absolute size-5 border-fg/50";
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-bg-2 [container-type:inline-size]">
      <span className={`${mark} left-4 top-4 border-l-[1.5px] border-t-[1.5px]`} />
      <span className={`${mark} right-4 top-4 border-r-[1.5px] border-t-[1.5px]`} />
      <span className={`${mark} bottom-4 left-4 border-b-[1.5px] border-l-[1.5px]`} />
      <span className={`${mark} bottom-4 right-4 border-b-[1.5px] border-r-[1.5px]`} />
      <svg viewBox="0 0 24 24" className="absolute left-1/2 top-4 size-5 -translate-x-1/2 text-fg/50" aria-hidden>
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="display whitespace-nowrap text-[8cqw] text-fg/85">{name}</span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-fg-2">
        Private repo. Screens on request.
      </span>
    </div>
  );
}

function Panel({ p, index }: { p: Project; index: number }) {
  const primary = p.links[0];
  return (
    <article
      data-panel
      aria-labelledby={`p-${p.slug}`}
      className="panel group grid shrink-0 grid-cols-12 gap-x-8 gap-y-6 lg:items-center lg:motion-safe:w-[min(90vw,1480px)]"
    >
      <div className="col-span-12 lg:col-span-8">
        <div
          data-shot
          className="reg-img relative aspect-[16/10] overflow-hidden bg-bg-2"
          data-cursor={primary ? "Open" : undefined}
        >
          {p.shot ? (
            <a
              href={primary?.href}
              target="_blank"
              rel="noreferrer"
              tabIndex={-1}
              aria-hidden
              className={primary ? "block h-full w-full" : "pointer-events-none block h-full w-full"}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p.shot}`}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="shot object-cover object-top"
                priority={index < 2}
              />
            </a>
          ) : (
            <Cover name={p.name} />
          )}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <h3 id={`p-${p.slug}`} className="display text-[clamp(2rem,3vw,3rem)]">
          {p.name}
        </h3>
        <p className="mt-3 text-[1.2rem] font-medium leading-snug">{p.line}</p>
        <p className="mt-3 max-w-[48ch] text-fg-2">{p.detail}</p>

        <dl className="mt-6 grid grid-cols-[6.5rem_1fr] gap-y-2.5 text-sm">
          <dt className="text-fg-2">Status</dt>
          <dd className="flex items-center gap-2 font-semibold">
            <span aria-hidden className={`size-2 ${p.status === "shipped" ? "bg-fg" : "bg-shu"}`} />
            {p.status === "shipped" ? "Shipped" : "In progress"}
          </dd>
          <dt className="text-fg-2">Stack</dt>
          <dd>{p.stack.join(", ")}</dd>
          {p.commits !== null && (
            <>
              <dt className="text-fg-2">Commits</dt>
              <dd className="flex items-center gap-3">
                <span className="nums w-8 font-semibold">{p.commits}</span>
                <span
                  aria-hidden
                  className="relative h-[3px] flex-1 bg-line"
                  title={`${p.commits} of ${MOST_COMMITS}, the most on this page`}
                >
                  <span
                    data-bar
                    className="absolute inset-y-0 left-0 bg-fg"
                    style={{ width: `${(p.commits / MOST_COMMITS) * 100}%` }}
                  />
                </span>
              </dd>
            </>
          )}
        </dl>

        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          {p.links.length ? (
            p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="wide inline-flex items-center gap-1.5 uppercase tracking-[0.06em] underline decoration-[1.5px] underline-offset-[0.35em] hover:text-shu"
              >
                {l.label}
                <Arrow />
                <span className="sr-only">: {p.name} (opens in a new tab)</span>
              </a>
            ))
          ) : (
            <span className="font-normal text-fg-2">Private repository</span>
          )}
        </p>
      </div>
    </article>
  );
}

/**
 * Ten projects on one horizontal run. Wide screens pin the section and scroll the track
 * sideways; each screenshot comes into register as it arrives. Narrow screens stack.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      mm.add({ wide: "(min-width: 1024px)", motion: MOTION_OK }, (ctx) => {
        const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
        if (!motion) return;

        const bars = (panel: HTMLElement) => panel.querySelectorAll("[data-bar]");

        if (!wide) {
          panels.forEach((panel) => {
            gsap.fromTo(
              panel.querySelector("[data-shot]"),
              { "--reg": 1, y: 48 },
              { "--reg": 0, y: 0, ease: "none", scrollTrigger: { trigger: panel, start: "top 92%", end: "top 50%", scrub: true } },
            );
            gsap.from(bars(panel), {
              scaleX: 0,
              transformOrigin: "left",
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: panel, start: "top 60%" },
            });
          });
          return;
        }

        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const run = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(panels.length, Math.floor(self.progress * (panels.length - 0.01)) + 1);
              count.current!.textContent = String(n).padStart(2, "0");
            },
          },
        });

        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelector("[data-shot]"),
            { "--reg": 1, xPercent: 8 },
            {
              "--reg": 0,
              xPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: run, start: "left 95%", end: "left 35%", scrub: true },
            },
          );
          gsap.from(bars(panel), {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, containerAnimation: run, start: "left 60%" },
          });
        });

        // Keyboard users: tabbing into an off-screen panel scrolls the page to it.
        const onFocus = (e: FocusEvent) => {
          const panel = (e.target as Element).closest<HTMLElement>("[data-panel]");
          const st = run.scrollTrigger;
          if (!panel || !st) return;
          const along = Math.min(1, Math.max(0, (panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2) / distance()));
          scrollToY(st.start + along * (st.end - st.start), true);
        };
        track.current!.addEventListener("focusin", onFocus);
        return () => track.current?.removeEventListener("focusin", onFocus);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-h">
      <div ref={pin} className="flex flex-col py-20 lg:motion-safe:h-[100svh] lg:motion-safe:py-0 lg:motion-safe:pt-24">
        <div className="flex items-end justify-between gap-6 px-[var(--gutter)]">
          <div className="flex items-start gap-4">
            <h2 id="work-h" className="display text-[clamp(3rem,7vw,6rem)]">
              {copy.work.heading}
            </h2>
            <span lang="ja" aria-hidden className="jp vertical mt-1 text-lg text-shu">
              作品
            </span>
          </div>
          <div className="hidden max-w-[40ch] text-right text-sm text-fg-2 md:block">
            <p>{copy.work.sub}</p>
            <p aria-hidden className="wide nums mt-3 hidden text-base font-bold text-fg lg:motion-safe:block">
              <span ref={count}>01</span> / {String(projects.length).padStart(2, "0")}
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-[46ch] px-[var(--gutter)] text-sm text-fg-2 md:hidden">{copy.work.sub}</p>

        <div className="mt-12 flex-1 overflow-hidden lg:motion-safe:mt-0 lg:motion-safe:flex lg:motion-safe:items-center">
          <div
            ref={track}
            className="flex flex-col gap-24 px-[var(--gutter)] lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:gap-[7vw]"
          >
            {projects.map((p, i) => (
              <Panel key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
