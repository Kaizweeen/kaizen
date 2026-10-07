import { describe, it, expect } from "vitest";
import { createParticles, step, targetsFromAlpha } from "../src/lib/particles";

describe("targetsFromAlpha", () => {
  it("keeps only opaque pixels on the sampling grid", () => {
    const w = 4, h = 4;
    const data = new Uint8ClampedArray(w * h * 4);
    data[(1 * w + 2) * 4 + 3] = 255; // (2,1) opaque but off a gap-2 grid row
    data[(2 * w + 2) * 4 + 3] = 255; // (2,2) opaque and on the grid
    const t = targetsFromAlpha(data, w, h, 2);
    expect(Array.from(t)).toEqual([2, 2]);
  });
});

describe("step", () => {
  const targets = new Float32Array([10, 10, 50, 80, 200, 40]);

  it("settles every particle onto its target with no cursor", () => {
    let seed = 1;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const p = createParticles(targets, 300, 300, rand);
    for (let i = 0; i < 600; i++) step(p, null, 1 / 60);
    for (let i = 0; i < p.n; i++) {
      expect(Math.abs(p.x[i] - p.tx[i])).toBeLessThan(0.5);
      expect(Math.abs(p.y[i] - p.ty[i])).toBeLessThan(0.5);
      expect(p.heat[i]).toBeLessThan(0.05);
    }
  });

  it("pushes particles away from the cursor", () => {
    const p = createParticles(targets, 300, 300, () => 0);
    p.x.set([10, 50, 200]);
    p.y.set([10, 80, 40]);
    for (let i = 0; i < 10; i++) step(p, { x: 14, y: 10, r: 60 }, 1 / 60);
    expect(p.x[0]).toBeLessThan(10);
    expect(p.heat[0]).toBeGreaterThan(0);
    expect(p.x[2]).toBeCloseTo(200, 3); // far away, untouched
  });
});
