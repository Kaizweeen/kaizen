# Kaizen

Portfolio of Kaizen Gabriel ([@Kaizweeen](https://github.com/Kaizweeen)). A two-ink print run that refines itself as you scroll: 改善 drawn in stroke order and stamped as a seal, KAIZEN in ink particles, the real arithmetic of 1% a day, nine projects with real commit counts, and the kaizen cycle as a turning ring.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3800.

## Check it

```bash
npm test
```

Vitest guards the copy contract (no em or en dashes anywhere in `src`), the version and compound math, the particle physics, and the project data.

```bash
npm run build
```

The site is a static export (`out/`). Locally it builds for the root path.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: tests, a static export with the Pages base path (`/kaizen`), and a deploy to GitHub Pages at https://kaizweeen.github.io/kaizen/. The base path comes from the `PAGES_BASE_PATH` environment variable, so local dev stays at `localhost:3800/`.

## Where things live

- `PRODUCT.md`: who the site is for and what must never be faked.
- `DESIGN.md`: the visual system and its rules. Read it before changing the look.
- `src/lib/content.ts`: every word on the page and the project list.
- `src/components/`: one file per section, plus the seal, cursor, and version tag.
- `scripts/`: headless Chromium helpers for project screenshots, the portrait cut-out, and visual checks. They borrow Playwright from another local project; pass its path as the first argument.

Kanji stroke data from [KanjiVG](https://kanjivg.tagaini.net) by Ulrich Apel, CC BY-SA 3.0.
