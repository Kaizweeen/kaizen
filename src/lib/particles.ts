/**
 * Ink particles for the hero word. Each particle springs toward a target pixel of the
 * rendered word; the cursor pushes them away. `heat` is how far a particle is from home,
 * 0 to 1, and drives the misregistered vermilion plate in the renderer.
 */
export type Particles = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  tx: Float32Array;
  ty: Float32Array;
  heat: Float32Array;
};

export type Pointer = { x: number; y: number; r: number } | null;

/** Opaque pixels of an RGBA buffer, sampled every `gap` pixels, as flat [x, y, x, y, ...]. */
export function targetsFromAlpha(data: Uint8ClampedArray, w: number, h: number, gap: number): Float32Array {
  const out: number[] = [];
  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      if (data[(y * w + x) * 4 + 3] > 128) out.push(x, y);
    }
  }
  return new Float32Array(out);
}

/** Particles start scattered across the field: the rough first draft. */
export function createParticles(targets: Float32Array, w: number, h: number, rand = Math.random): Particles {
  const n = targets.length / 2;
  const p: Particles = {
    n,
    x: new Float32Array(n),
    y: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    tx: new Float32Array(n),
    ty: new Float32Array(n),
    heat: new Float32Array(n),
  };
  for (let i = 0; i < n; i++) {
    p.tx[i] = targets[i * 2];
    p.ty[i] = targets[i * 2 + 1];
    p.x[i] = rand() * w;
    p.y[i] = rand() * h;
  }
  return p;
}

const SPRING = 90; // pull toward home, per second squared per pixel
const DAMPING = 11; // velocity bleed per second
const PUSH = 5200; // cursor push at the centre, pixels per second squared

export function step(p: Particles, pointer: Pointer, dt: number): void {
  const damp = Math.exp(-DAMPING * dt);
  const r2 = pointer ? pointer.r * pointer.r : 0;
  for (let i = 0; i < p.n; i++) {
    let ax = (p.tx[i] - p.x[i]) * SPRING;
    let ay = (p.ty[i] - p.y[i]) * SPRING;
    if (pointer) {
      const dx = p.x[i] - pointer.x;
      const dy = p.y[i] - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const f = PUSH * (1 - d / pointer.r);
        ax += (dx / d) * f;
        ay += (dy / d) * f;
      }
    }
    p.vx[i] = (p.vx[i] + ax * dt) * damp;
    p.vy[i] = (p.vy[i] + ay * dt) * damp;
    p.x[i] += p.vx[i] * dt;
    p.y[i] += p.vy[i] * dt;
    const ox = p.x[i] - p.tx[i];
    const oy = p.y[i] - p.ty[i];
    p.heat[i] = Math.min(1, Math.sqrt(ox * ox + oy * oy) / 36);
  }
}
