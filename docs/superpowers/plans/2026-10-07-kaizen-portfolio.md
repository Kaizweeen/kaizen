# Kaizen Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Refinement" portfolio from `docs/superpowers/specs/2026-10-07-kaizen-portfolio-design.md`.

**Architecture:** Next.js App Router, one page composed of section components. All copy and project data live in `src/lib/content.ts`; pure logic (version mapping, compound math, particle physics step) lives in `src/lib/` and is unit tested. Animation is GSAP only, registered once in a client provider.

**Tech Stack:** Next.js (App Router) + TypeScript + Tailwind v4, GSAP + @gsap/react, Vitest.

## Global Constraints

- No em dashes or en dashes in any user-facing string.
- Dev port 3600, recorded in `C:\Users\User\.claude\launch.json`.
- GSAP is the only animation dependency. No Three.js, no Lenis, no Framer Motion.
- `prefers-reduced-motion: reduce` gets a designed static path.
- Vermilion never sits behind small text unless the pair passes WCAG AA.
- Commits use the GitHub no-reply email.
- Every project fact comes from the real repo; nothing invented.

---

## File map

| File | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | fonts, metadata, theme bootstrap script, providers |
| `src/app/page.tsx` | section order |
| `src/app/globals.css` | tokens (Paper and Sumi themes), base type, grain, utilities |
| `src/lib/content.ts` | every string on the page and the `projects` array |
| `src/lib/math.ts` | `versionFor(progress)`, `compound(rate, days)` |
| `src/lib/kanji.ts` | KanjiVG stroke paths for 改 and 善 |
| `src/lib/particles.ts` | target sampling from text and the spring step |
| `src/components/*` | one file per section plus Cursor, VersionTag, ThemeToggle, Seal, Motion provider |
| `tests/*.test.ts` | copy contract, math, project data |

## Task 1: Scaffold

- [ ] `create-next-app` with TypeScript, Tailwind, App Router, `src/`, no ESLint prompt changes; dev script on port 3600.
- [ ] Add `gsap`, `@gsap/react`; dev deps `vitest`.
- [ ] Add `launch.json` entry `kaizen` on 3600.
- [ ] Run `/impeccable init` to write PRODUCT.md and DESIGN.md for this project.
- [ ] Commit.

## Task 2: Content and logic (TDD)

**Produces:** `versionFor(p: number): string`, `compound(rate: number, days: number): number`, `projects: Project[]`, `copy` object.

- [ ] Write failing tests:

```ts
// tests/math.test.ts
import { describe, it, expect } from "vitest";
import { versionFor, compound } from "../src/lib/math";

describe("versionFor", () => {
  it("maps the ends", () => {
    expect(versionFor(0)).toBe("v0.1");
    expect(versionFor(1)).toBe("v1.0");
  });
  it("clamps", () => {
    expect(versionFor(-3)).toBe("v0.1");
    expect(versionFor(9)).toBe("v1.0");
  });
  it("climbs in tenths", () => {
    expect(versionFor(0.5)).toBe("v0.6");
  });
});

describe("compound", () => {
  it("1% a day for a year", () => {
    expect(compound(0.01, 365).toFixed(2)).toBe("37.78");
    expect(compound(0, 365)).toBe(1);
  });
});
```

```ts
// tests/content.test.ts
import { describe, it, expect } from "vitest";
import { copy, projects } from "../src/lib/content";

const strings = (v: unknown): string[] =>
  typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];

describe("copy contract", () => {
  it("has no em or en dashes", () => {
    for (const s of strings({ copy, projects })) expect(s).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("projects", () => {
  it("are complete", () => {
    expect(projects.length).toBe(9);
    for (const p of projects) {
      expect(p.name && p.line && p.stack.length).toBeTruthy();
      expect(["shipped", "in progress"]).toContain(p.status);
      expect(p.links.length > 0 || p.private).toBe(true);
    }
  });
});
```

- [ ] Run `npx vitest run`, expect FAIL (modules missing).
- [ ] Implement `src/lib/math.ts` and `src/lib/content.ts` with real data.
- [ ] Run tests, expect PASS. Commit.

## Task 3: Shell and motion system

- [ ] Tokens for Paper and Sumi in `globals.css`; theme bootstrap script in `<head>` to avoid a flash; ThemeToggle.
- [ ] Motion provider: registers ScrollTrigger, ScrollSmoother, SplitText; creates the smoother only when motion is allowed and pointer is fine.
- [ ] Cursor (pointer: fine only), VersionTag bound to page scroll progress via `versionFor`, grain overlay, header with Seal.
- [ ] Verify in browser, commit.

## Task 4: Intro

- [ ] Fetch KanjiVG `06539.svg` and `05584.svg`, copy stroke paths into `src/lib/kanji.ts` with the licence note.
- [ ] Intro draws strokes in order (stroke-dashoffset), stamps the seal, hands off to the header seal. Once per session (`sessionStorage`, wrapped in try/catch). Skippable. Not rendered under reduced motion.
- [ ] Verify, commit.

## Task 5: Hero particles

- [ ] `src/lib/particles.ts`: `sampleText(text, w, h, gap)` returns target points from an offscreen canvas; `step(ps, mouse, dt)` applies spring plus cursor repulsion. Unit test `step` converges to target with no mouse.
- [ ] Hero canvas sized to DPR, paused when off screen (IntersectionObserver), crisp text fallback under reduced motion and for screen readers (`h1` stays real text).
- [ ] Verify, commit.

## Task 6: Statement and the 1%

- [ ] Statement words scrub from faint to ink with ScrollTrigger.
- [ ] 1% section: two counters and an SVG curve drawn with scroll.
- [ ] Verify, commit.

## Task 7: Work

- [ ] Capture real screenshots for projects that can run; save to `public/work/<slug>.webp`. Note which got typographic covers.
- [ ] Pinned horizontal track on wide screens, vertical list under 900px. Cards: index, name, line, status, stack, commits, links. Ink tint to colour on hover and focus.
- [ ] Verify, commit.

## Task 8: Method, Clients, Contact, footer

- [ ] PDCA ring rotating with scroll; four labelled steps readable without the animation.
- [ ] Three client offers.
- [ ] Contact with magnetic email button (copy to clipboard with a live-region confirmation), GitHub, KanjiVG credit.
- [ ] Verify, commit.

## Task 9: Hardening and proof

- [ ] Reduced-motion pass, keyboard pass, mobile 375px pass, both themes.
- [ ] `npx vitest run`, `npm run build` clean.
- [ ] Screenshots of the running site as proof. Commit.
