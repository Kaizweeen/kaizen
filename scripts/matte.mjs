// Cuts the subject out of a photo with MediaPipe's selfie segmenter, run in headless Chromium.
// Writes a greyscale PNG matte (white = person) the size of the input.
// Usage: PLAYWRIGHT_BROWSERS_PATH=... node scripts/matte.mjs <playwright-core dir> <photo.jpg> <out.png>
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";

const [, , pwDir, photo, out] = process.argv;
const { chromium } = createRequire(pwDir + "/")("playwright-core");

const V = "0.10.14";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite";
const src = `data:image/jpeg;base64,${readFileSync(photo).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (m) => console.log("page:", m.text()));
await page.setContent(`<img id="img" src="${src}"><script type="module">
  import { FilesetResolver, ImageSegmenter } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${V}/vision_bundle.mjs";
  try {
    const files = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${V}/wasm");
    const seg = await ImageSegmenter.createFromOptions(files, {
      baseOptions: { modelAssetPath: "${MODEL}", delegate: "CPU" },
      runningMode: "IMAGE", outputConfidenceMasks: true, outputCategoryMask: false,
    });
    const img = document.getElementById("img");
    await img.decode();
    const res = seg.segment(img);
    const bg = res.confidenceMasks[0];
    const w = bg.width, h = bg.height, a = bg.getAsFloat32Array();
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d"); const d = ctx.createImageData(w, h);
    for (let i = 0; i < w * h; i++) { const v = Math.round((1 - a[i]) * 255); d.data.set([v, v, v, 255], i * 4); }
    ctx.putImageData(d, 0, 0);
    window.__matte = c.toDataURL("image/png");
  } catch (e) { window.__matte = "error: " + e.message; }
</script>`);
await page.waitForFunction(() => window.__matte, null, { timeout: 120000 });
const result = await page.evaluate(() => window.__matte);
await browser.close();
if (result.startsWith("error")) throw new Error(result);
writeFileSync(out, Buffer.from(result.split(",")[1], "base64"));
console.log("matte written:", out);
