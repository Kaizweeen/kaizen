# Kaizen portfolio: design spec

Date: 2026-10-07. Status: approved by Kai in chat. Built 2026-10-07; see Changes during the build at the end.

## Decisions taken with Kai

- **Name theme:** embrace 改善. The meaning of the name is the design idea. This deliberately reverses the "never gloss the name" rule in the older PC-98 portfolio (`C:\Users\User\portfolio\PRODUCT.md`), which stays untouched.
- **Location:** new project at `C:\Users\User\kaizen`, dev port 3600.
- **Audience:** recruiters screening for internships and junior roles, plus small-business clients deciding whether to trust Kai with a site.
- **Direction:** "Refinement". The page improves itself: things enter rough and settle into a crisp final state.

## Look

- Washi paper background with fine grain, sumi ink type, generous whitespace, small vertical Japanese labels in the margins.
- Vermilion (hanko seal red) appears only on the 改善 seal and live states.
- Two themes: Paper (light, default follows the OS) and Sumi (dark). Manual toggle.
- A fixed version tag climbs from v0.1 at the top of the page to v1.0 at the contact section, driven by scroll progress.

## Sections

1. **Intro** (about 2s, once per session, skippable by click or key): 改 and 善 draw in real stroke order (KanjiVG data), stamp into a vermilion seal, and the seal settles into the header as the logo.
2. **Hero:** KAIZEN rendered by about 3,000 ink particles on a 2D canvas that converge into the letterforms. The cursor scatters nearby particles; they spring back. Copy: "Kaizen Gabriel. Student developer. I ship it, then I make it better."
3. **Statement:** a short paragraph on how Kai works, inked in word by word on scroll (scrubbed).
4. **The 1%:** 1.00^365 = 1 beside 1.01^365 = 37.78. Counter and exponential curve draw with scroll. The only place the meaning of the name is stated outright.
5. **Work:** pinned horizontal scroll through nine projects: Koino, BrightSmile, Planorama, Prompt Builder, chord-transposer, handscope, air-loops, penalty-keeper, Moonshadow. Each card: index, name, one line, status (shipped or in progress), stack, real commit count from git, links. Visuals are real screenshots where a build can be captured, tinted to ink and full colour on hover; otherwise a typographic cover. Mobile falls back to a vertical stack.
6. **Method:** Plan, Do, Check, Act ring that rotates with scroll, mapped to Kai's real workflow: spec, build, verify, revise.
7. **For clients:** three plain offers: small-business websites, web apps, interactive experiences. No invented clients, quotes, or numbers.
8. **Contact:** "Let's make it better." Magnetic email button that copies the address, GitHub link, footer with KanjiVG credit.

Global motion: smooth scroll, ink-dot cursor that grows and snaps on interactive elements (pointer devices only), line-split text reveals, grain overlay, section wipes.

## Honesty rules

- Every project fact (status, stack, commit count, link) comes from the real repo or PRODUCT.md. Nothing is inflated.
- In-progress work is labelled in progress.
- No testimonials, client logos, traction numbers, or employment history, because none exist.
- No em dashes or en dashes anywhere in page copy.

## Accessibility

- Reduced motion gets a designed static path: no intro, no particles (crisp text instead), final states shown, native scroll.
- Full keyboard use, visible focus, skip link, semantic landmarks, `lang` declared, kanji given readable labels.
- WCAG AA contrast in both themes, including text on vermilion.

## Stack

- Next.js App Router, TypeScript, Tailwind.
- GSAP (ScrollTrigger, ScrollSmoother, SplitText) via `@gsap/react` as the only animation dependency.
- Plain canvas for the hero. No Three.js.
- KanjiVG stroke paths for 改 (U+6539) and 善 (U+5584), CC BY-SA 3.0, credited on the page.
- Deploy target Vercel, only when Kai asks.

## Tests (Vitest)

- Copy contract: no em or en dashes in any user-facing string.
- Compound math: 1.01^365 rounds to 37.78.
- Version mapping: scroll progress 0 maps to v0.1, 1 maps to v1.0, clamped.
- Project data: every entry has name, line, status, stack, and at least one link or an explicit "private" flag.

## Changes during the build

- **Port 3800, not 3600.** BrightSmile already uses 3600.
- **Lenis for smooth scroll, not ScrollSmoother.** ScrollSmoother wraps the page in a transformed container, which breaks fixed elements, anchor links, and React effect ordering. Lenis keeps native scroll; GSAP still owns every animation.
- **Nine projects, not ten.** Kai confirmed BrightSmile and DentaSync are one project; it ships as DentaSync with brightsmile.pro as its live site.
- **Commit counts span every branch** (stashes excluded), so DentaSync shows 322 and Planorama 3.
- **Planorama has no live link.** Its Vercel deployment sits behind Vercel login.
- **Portrait added at Kai's request.** His photo is cut out with MediaPipe's selfie segmenter, toned for print, and rendered as a two-ink halftone beside the statement: it prints top to bottom with scroll, its vermilion plate registers, the continuous-tone photo develops underneath, and the pointer acts as a loupe.
- **Portrait removed again, same day, at Kai's request**, until he has a professional photo. `Portrait.tsx` and `scripts/matte.mjs` stay in the repo; `public/kai.webp` was deleted so it is not deployed.
- **Contact flood grows as the seal's rectangular plate**, not a circle: a red disc rising on white read as a national flag.
