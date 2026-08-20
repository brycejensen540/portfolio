import type { Shape } from '../types';
import { circlePoints, strokeGlow } from '../engine/stroke';
import { hsl } from '../engine/colors';

/**
 * Flower of Life — the classic hexagonal lattice of overlapping rings.
 * Complexity raises it from a single rosette (7 rings) to the full
 * 19-ring lattice. Each ring is drawn once (no bloom pass) because the
 * lattice is dense enough already — keeps it fast.
 */

interface Position {
  x: number;
  y: number;
}

/** Hexagonal lattice positions: center + `rings` layers of 6*ring circles. */
function latticePositions(rings: number, spacing: number): Position[] {
  const positions: Position[] = [{ x: 0, y: 0 }];
  for (let ring = 1; ring <= rings; ring++) {
    for (let k = 0; k < 6 * ring; k++) {
      const angle = (k / (6 * ring)) * Math.PI * 2 + (ring % 2 === 1 ? Math.PI / 6 : 0);
      positions.push({
        x: spacing * ring * Math.cos(angle),
        y: spacing * ring * Math.sin(angle),
      });
    }
  }
  return positions;
}

export const flower: Shape = {
  id: 'flower',
  name: 'Flower of Life',
  icon:
    '<circle cx="24" cy="24" r="6" />' +
    '<circle cx="24" cy="12" r="6" />' +
    '<circle cx="24" cy="36" r="6" />' +
    '<circle cx="12" cy="18" r="6" />' +
    '<circle cx="36" cy="18" r="6" />' +
    '<circle cx="12" cy="30" r="6" />' +
    '<circle cx="36" cy="30" r="6" />',
  render(ctx, t, p, r, hue) {
    const rings = Math.min(1 + Math.floor(p.complexity / 4), 2);
    const spacing = r * 0.34;
    const positions = latticePositions(rings, spacing);

    for (const pos of positions) {
      // Each ring breathes slightly out of phase with its neighbours,
      // so the lattice shimmers rather than pulsing as one solid mass.
      const phase = pos.x * 0.35 + pos.y * 0.35;
      const wobble = 1 + p.stretch * 0.15 * Math.sin(t * 2 + phase);
      const color = hsl(hue + phase * 6, p.saturation, 62);

      strokeGlow(ctx, circlePoints(spacing * 0.98 * wobble, 40), true, color, {
        glow: p.glow * 10,
        width: 0.9,
        alpha: 0.85,
      });
    }
  },
};
