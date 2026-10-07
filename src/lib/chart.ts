import { compound } from "./math";

export const DAYS = 365;
export const CHART_W = 1000;
export const CHART_H = 440;
export const Y_MAX = 40;

const toX = (day: number) => (day / DAYS) * CHART_W;
export const toY = (v: number) => CHART_H - (v / Y_MAX) * CHART_H;

/** The curve of (1 + rate)^day, one vertex per day, plotted to the chart's exact scale. */
export function plot(rate: number) {
  const pts: [number, number][] = [];
  for (let d = 0; d <= DAYS; d++) pts.push([toX(d), toY(compound(rate, d))]);
  // Cumulative arc length per day, so drawing the line can follow the day count exactly.
  const cum = [0];
  for (let d = 1; d <= DAYS; d++) {
    const [x0, y0] = pts[d - 1];
    const [x1, y1] = pts[d];
    cum.push(cum[d - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  const total = cum[DAYS];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join("");
  return { d, pts, frac: cum.map((c) => c / total) };
}
