// Visual check of the running site in headless Chromium (the in-app pane throttles rAF).
// Usage: PLAYWRIGHT_BROWSERS_PATH=... node scripts/shoot-site.mjs <playwright-core dir> [url] [outDir]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const [, , pwDir, url = "http://localhost:3800/", out = ".shots/site"] = process.argv;
const { chromium } = createRequire(pwDir + "/")("playwright-core");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const errors = [];

async function run(name, opts, { intro = false, theme } = {}) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${name} console: ${m.text()}`));
  if (theme) await page.addInitScript((t) => localStorage.setItem("kz-theme", t), theme);
  await page.goto(url, { waitUntil: "networkidle" });

  if (intro) {
    for (const t of [500, 1500, 2600]) {
      await page.waitForTimeout(t === 500 ? 500 : 1000);
      await page.screenshot({ path: `${out}/${name}-intro-${t}.png` });
    }
  }
  await page.waitForFunction(() => !document.documentElement.dataset.intro, null, { timeout: 15000 });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `${out}/${name}-00-hero.png` });

  const stops = await page.evaluate(() => {
    const top = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    };
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const op = top("#one-percent");
    const work = top("#work");
    const method = top("#method");
    return [
      ["01-statement", top("#top") + vh * 1.15],
      ["02-onep-enter", op - vh * 0.35],
      ["03-onep-mid", op + vh * 0.8],
      ["04-onep-end", op + vh * 1.6],
      ["05-work-start", work + 2],
      ["06-work-mid", work + (method - work) * 0.45],
      ["07-work-late", work + (method - work) * 0.8],
      ["08-method-a", method + 2],
      ["09-method-b", method + vh * 1.3],
      ["10-clients", top("#clients") + vh * 0.2],
      ["11-contact-enter", top("#contact") - vh * 0.45],
      ["12-contact", max],
    ].map(([n, y]) => [n, Math.max(0, Math.min(max, Math.round(y)))]);
  });

  for (const [n, y] of stops) {
    await page.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)), y);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-${n}.png` });
  }
  await ctx.close();
}

await run("desktop", { viewport: { width: 1440, height: 900 } }, { intro: true });
await run("mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await run("dark", { viewport: { width: 1440, height: 900 }, colorScheme: "dark" });

// Reduced motion: one full-page capture, everything should already be in its final state.
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
rp.on("pageerror", (e) => errors.push(`reduced: ${e.message}`));
await rp.goto(url, { waitUntil: "networkidle" });
await rp.waitForTimeout(800);
await rp.screenshot({ path: `${out}/reduced-full.png`, fullPage: true });
await rm.close();

await browser.close();
console.log(errors.length ? errors.join("\n") : "no page errors");
