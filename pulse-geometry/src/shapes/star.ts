import type { Shape } from '../types';
import { polar, strokeGlow } from '../engine/stroke';
import { hsl } from '../engine/colors';

/**
 * Star — a classic 5..9-point star that spins and breathes.
 * Complexity raises the number of points and the echo layers.
 */

function starPoints(
  points: number,
  outer: number,
  inner: number,
  t: number,
  layer: number,
  stretch: number,
) {
  const verts = [];
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const isOuter = i % 2 === 0;
    const angle = (i / total) * Math.PI * 2 + t * (0.25 + layer * 0.06);
    // Outer points pulse; inner points stay steadier for contrast.
    const wobble = isOuter
      ? 1 + stretch * 0.3 * Math.sin(t * 2 + i * 0.9 + layer)
      : 1 + stretch * 0.12 * Math.sin(t * 1.4 + i * 1.3);
    verts.push(polar((isOuter ? outer : inner) * wobble, angle));
  }
  return verts;
}

export const star: Shape = {
  id: 'star',
  name: 'Star',
  icon:
    '<path d="M24 8 l4.2 8.9 9.8 1.2 -7.2 6.8 1.8 9.7 -8.6 -4.8 -8.6 4.8 1.8 -9.7 -7.2 -6.8 9.8 -1.2 Z" />',
  render(ctx, t, p, r, hue) {
    const points = 5 + Math.floor(p.complexity / 3);
    const layers = 3;
    const innerRatio = 0.45;

    for (let i = 0; i < layers; i++) {
      const scale = 1 - i * 0.18;
      const verts = starPoints(points, r * scale, r * scale * innerRatio, t, i, p.stretch);
      const color = hsl(hue + (i * 360) / layers, p.saturation, 60);
      const glow = p.glow * 14;
      const width = 1.2 - i * 0.2;

      strokeGlow(ctx, verts, true, color, { glow, width, alpha: 0.9 - i * 0.15 });
      strokeGlow(ctx, verts, true, color, {
        glow: glow * 1.6,
        width,
        alpha: (0.45 - i * 0.08) * p.glow,
        lighter: true,
      });
    }
  },
};
