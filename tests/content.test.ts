import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { copy, projects } from "../src/lib/content";

const DASHES = /[–—]/;

const strings = (v: unknown): string[] =>
  typeof v === "string"
    ? [v]
    : v && typeof v === "object"
      ? Object.values(v).flatMap(strings)
      : [];

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(p) ? [p] : [];
  });

describe("copy contract", () => {
  it("content has no em or en dashes", () => {
    for (const s of strings({ copy, projects })) expect(s, s).not.toMatch(DASHES);
  });

  it("no source file ships an em or en dash", () => {
    for (const f of files(join(__dirname, "../src"))) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(DASHES);
    }
  });
});

describe("projects", () => {
  it("lists all nine, complete", () => {
    expect(projects).toHaveLength(9);
    for (const p of projects) {
      expect(p.name && p.line && p.detail, p.slug).toBeTruthy();
      expect(p.stack.length, p.slug).toBeGreaterThan(0);
      expect(["shipped", "in progress"]).toContain(p.status);
      expect(p.links.length > 0 || p.private === true, p.slug).toBe(true);
      for (const l of p.links) expect(l.href, p.slug).toMatch(/^https:\/\//);
    }
  });

  it("shows BrightSmile only as DentaSync's live site, never as its own project", () => {
    expect(projects.map((p) => p.name)).not.toContain("BrightSmile");
    expect(strings(copy).some((s) => s.includes("BrightSmile"))).toBe(false);
  });

  it("states the project count the page actually shows", () => {
    expect(copy.work.sub.startsWith("Nine projects")).toBe(true);
  });

  it("has unique slugs", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it("only claims commit counts that are whole numbers", () => {
    for (const p of projects) {
      if (p.commits !== null) expect(Number.isInteger(p.commits) && p.commits > 0, p.slug).toBe(true);
    }
  });
});
