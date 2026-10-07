import { describe, it, expect } from "vitest";
import { versionFor, compound } from "../src/lib/math";

describe("versionFor", () => {
  it("maps the ends of the page", () => {
    expect(versionFor(0)).toBe("v0.1");
    expect(versionFor(1)).toBe("v1.0");
  });

  it("clamps out-of-range progress", () => {
    expect(versionFor(-3)).toBe("v0.1");
    expect(versionFor(9)).toBe("v1.0");
    expect(versionFor(Number.NaN)).toBe("v0.1");
  });

  it("climbs in tenths and only releases at the very end", () => {
    expect(versionFor(0.1)).toBe("v0.1");
    expect(versionFor(0.5)).toBe("v0.5");
    expect(versionFor(0.95)).toBe("v0.9");
    expect(versionFor(0.997)).toBe("v1.0");
  });
});

describe("compound", () => {
  it("is the real 1% a day figure", () => {
    expect(compound(0.01, 365).toFixed(2)).toBe("37.78");
    expect(compound(0, 365)).toBe(1);
    expect(compound(0.01, 0)).toBe(1);
  });
});
