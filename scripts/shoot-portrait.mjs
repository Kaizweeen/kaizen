// Captures the halftone portrait at print stages, under the pointer, dark, and on mobile.
// Usage: PLAYWRIGHT_BROWSERS_PATH=... node scripts/shoot-portrait.mjs <playwright-core dir> [url]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const [, , pwDir, url = "http://localhost:3800/"] = process.argv;
const { chromium } = createRequire(pwDir + "/")("playwright-core");
const out = ".shots/portrait";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];

async function session(name, opts, shots) {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript(() => sessionStorage.setItem("kz-intro", "1"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const fig = page.locator("figure").first();
  const top = await fig.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const vh = await page.evaluate(() => window.innerHeight);
  for (const [label, y, hover] of shots(top, vh)) {
    await page.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)), y);
    await page.waitForTimeout(1300);
    if (hover) {
      const b = await fig.boundingBox();
      await page.mouse.move(b.x + b.width * 0.45, b.y + b.height * 0.42);
      await page.waitForTimeout(700);
    }
    await page.screenshot({ path: `${out}/${name}-${label}.png` });
  }
  await ctx.close();
}

const desk = (top, vh) => [
  ["a-printing", top - vh * 0.62],
  ["b-printed", top - vh * 0.08],
  ["c-hover", top - vh * 0.08, true],
];
await session("desktop", { viewport: { width: 1440, height: 900 } }, desk);
await session("dark", { viewport: { width: 1440, height: 900 }, colorScheme: "dark" }, (t, vh) => [["printed", t - vh * 0.08]]);
await session("mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, (t, vh) => [
  ["printed", t - vh * 0.12],
]);
await browser.close();
console.log(errors.length ? errors.join("\n") : "no page errors");
