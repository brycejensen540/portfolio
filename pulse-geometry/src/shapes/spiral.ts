import type { Shape } from '../types';
import { polar, strokeGlow } from '../engine/stroke';
import { hsl } from '../engine/colors';

/**
 * Spiral — intertwined Archimedean spirals that spin outward.
 * Complexity adds more arms and more turns.
 */

export const spiral: Shape = {
  id: 'spiral',
  name: 'Spiral',
  icon:
    '<path d="M24 24 a6 6 0 0 1 6 -6 a9 9 0 0 1 0 18 a12 12 0 0 1 -12 -12 a15 15 0 0 1 15 -15" />',
  render(ctx, t, p, r, hue) {
    const arms = 1 + Math.floor(p.complexity / 4);
    const turns = 2.2 + p.complexity * 0.15;
    const samples = 170;

    for (let arm = 0; arm < arms; arm++) {
      const armPhase = (arm * Math.PI * 2) / arms;
      const points = [];

      for (let i = 0; i <= samples; i++) {
        const f = i / samples;
        const angle = f * turns * Math.PI * 2 + armPhase + t * (0.5 + p.rotationSpeed * 0.6);
        // Radius grows with a soft ease so the spiral fans out nicely,
        // with a gentle ripple riding along its length.
        const radius =
          r * Math.pow(f, 0.8) * (1 + p.stretch * 0.2 * Math.sin(f * 12 + t * 2 + armPhase));
        points.push(polar(radius, angle));
      }

      const color = hsl(hue + (arm * 360) / arms, p.saturation, 62);
      const glow = p.glow * 14;

      strokeGlow(ctx, points, false, color, { glow, width: 1, alpha: 0.9 });
      strokeGlow(ctx, points, false, color, {
        glow: glow * 1.6,
        width: 0.9,
        alpha: 0.4 * p.glow,
        lighter: true,
      });
    }
  },
};
