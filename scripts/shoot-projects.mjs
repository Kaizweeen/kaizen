// Captures each project's live page for the Work section, 16:10 at 1.5x.
// Usage: PLAYWRIGHT_BROWSERS_PATH=... node scripts/shoot-projects.mjs <playwright-core dir> [slug=url ...]
// Then convert with ffmpeg to public/work/<slug>.webp. Provenance: screenshots of Kai's own deployed projects.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const [, , pwDir, ...pairs] = process.argv;
const { chromium } = createRequire(pwDir + "/")("playwright-core");

const DEFAULT = {
  koino: "https://koino-bay.vercel.app",
  brightsmile: "https://brightsmile.pro",
  handscope: "https://kaizweeen.github.io/handscope/#demo",
  "air-loops": "https://kaizweeen.github.io/air-loops/",
  "penalty-keeper": "https://kaizweeen.github.io/penalty-keeper/",
};
const targets = pairs.length ? Object.fromEntries(pairs.map((p) => p.split(/=(.*)/s).slice(0, 2))) : DEFAULT;

const out = ".shots/work";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
for (const [slug, url] of Object.entries(targets)) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    console.log(slug, "load:", e.message.split("\n")[0]);
  }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${out}/${slug}.png` });
  console.log(slug, "->", await page.title());
}
await browser.close();
