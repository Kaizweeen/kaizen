# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind v4, GSAP (ScrollTrigger, ScrollSmoother, SplitText) as the only animation dependency, Vitest. Chosen in chat on 2026-10-07: Kai's default stack, deploys to Vercel. Dev port 3800 (3600 belongs to BrightSmile).

## Users

1. **Recruiters and hiring managers** screening for internships and junior developer roles. Skimming, on a schedule, often on a phone. They want a fast, confident answer to "can this person build real things, and is he worth a reply."
2. **Small-business owners** deciding whether to trust Kai with a website or web app. Not technical. They judge by how the site itself feels and whether the work shown looks like something real people use.

Success for both: they email Kai or open his GitHub.

## Product Purpose

A personal portfolio for Kaizen Gabriel (GitHub: @Kaizweeen), a student developer. It has to convert a skim into a reply, and it has to be good enough as a made object that the site itself is evidence of craft.

## Positioning

The site is built on the meaning of his name. 改善 (kaizen) is change for the better through small, continuous steps, and that is genuinely how Kai works: ship a rough version, then improve it in visible increments. The page performs that idea: it starts rough and refines itself as the visitor moves through it. A neighbouring portfolio cannot copy this truthfully, because the name, the method, and the git history all point the same way.

## Operating Context

- Reached from a resume link, a GitHub profile, an application form, or a link sent to a business owner.
- Read on phones as often as laptops. Mobile is primary, not a fallback.
- Read in offices and on transit. No uninvited sound, ever.
- The first viewport may be the only one seen, so name, role, and a route to contact must be there.

## Capabilities and Constraints

Content the site presents (all real, verified 2026-10-07):

| Project | What it is | Status | Public link |
| --- | --- | --- | --- |
| Koino | Daily SOAP devotion app: guided Scripture reading, journaling, streaks, reading plans, offline PWA | shipped, still improving | koino-bay.vercel.app, github.com/Kaizweeen/Koino |
| DentaSync | Booking, chairs, patient forms, and dental charts for a three-branch dental clinic in Makati. Kai confirmed BrightSmile is the same project; the name is DentaSync, the live site is brightsmile.pro | in progress | brightsmile.pro, github.com/Kaizweeen/BrightSmile |
| Planorama | Group scheduling for college students that finds when everyone is free (team course project) | shipped | github.com/Kaizweeen/Planorama (the Vercel deployment sits behind Vercel login, so it is not linked) |
| Prompt Builder | Full-stack prompt workspace: templates, versions, local ghost-text autocomplete, simulated test runs | shipped | private repo |
| chord-transposer | Transpose a progression to any key and read the shapes off the neck, built as a stage tuner | shipped | github.com/Kaizweeen/chord-transposer |
| handscope | Webcam hand tracking that fires twelve hand-drawn canvas techniques | shipped | kaizweeen.github.io/handscope |
| air-loops | Hold up fingers to stack lo-fi loops, sing over them, record the take | shipped | kaizweeen.github.io/air-loops |
| Moonshadow | Shadow-puppet storybook: five hand poses become animated creatures in a narrated tale | shipped | private repo |
| penalty-keeper | Retro pixel penalty game where you are the keeper and read the striker's run-up | shipped | kaizweeen.github.io/penalty-keeper |

Commit counts are read from the local git history across every branch (stashes excluded) on 2026-10-07 and shown as they are, including small ones. Nine projects in total.

## Brand Commitments

- Name: Kaizen Gabriel. Signs informal things as Kai. GitHub @Kaizweeen. Email kaizen.gabriel.0106@gmail.com.
- **The meaning of the name is welcome on this site** (decided by Kai on 2026-10-07). This reverses the rule in the older PC-98 portfolio, which stays as a separate project.
- Voice: direct, plain, self-aware. Comfortable naming what is unfinished. Not boastful, not falsely modest.
- No em dashes or en dashes anywhere in page copy.

## Evidence on Hand

Real: nine projects and the facts above, live sites for Koino and DentaSync plus three GitHub Pages demos, git history for commit counts, the site itself as a working demonstration. No photo of Kai is on the page for now: he pulled the selfie on 2026-10-07 until he has a professional one. The halftone portrait component (`src/components/Portrait.tsx`) is kept, unmounted, ready for it.

Absent, must not be fabricated: testimonials, client logos or names, employment history, user counts, revenue, awards, press, pricing. The clinic behind DentaSync is described by what its live site shows, not as a client endorsement. Client offers are described as offers, never as past client work.

## Product Principles

1. **Show the refinement, don't claim it.** The page's own motion is the argument; the projects and commit counts are the proof.
2. **Honesty is a feature.** In-progress work says in progress. Small numbers are shown as they are.
3. **Respect the skim.** Name, role, and contact land in the first viewport and survive a phone.
4. **Motion serves, never blocks.** Nothing hides content the visitor came for, and nothing waits on an animation.

## Accessibility & Inclusion

- Full keyboard use with visible focus.
- `prefers-reduced-motion` gets a designed static version, not a broken one.
- Both themes meet WCAG AA, including text on vermilion.
- Kanji carry readable labels for assistive tech.
