/**
 * Scroll progress (0 to 1) as a release number. v0.1 to v0.9 split the page evenly;
 * v1.0 ships only when the reader reaches the very end.
 */
export function versionFor(progress: number): string {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  if (p >= 0.995) return "v1.0";
  return `v0.${1 + Math.floor(p * 9)}`;
}

/** Growth after compounding `rate` for `days`. 1.01 for 365 days is 37.78. */
export function compound(rate: number, days: number): number {
  return Math.pow(1 + rate, days);
}
