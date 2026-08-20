import type { Shape } from '../types';
import { circlePoints, strokeGlow } from '../engine/stroke';
import { hsl } from '../engine/colors';

/**
 * Circle — a breathing, wobbling ring. The complexity knob controls how
 * many concentric echo rings appear and how wavy the wobble gets.
 */
export const circle: Shape = {
  id: 'circle',
  name: 'Circle',
  icon: '<circle cx="24" cy="24" r="15" />',
  render(ctx, t, p, r, hue) {
    const layers = 2 + Math.floor(p.complexity / 3);
    const waves = 3 + Math.floor(p.complexity / 2);
    const samples = 96;

    for (let i = 0; i < layers; i++) {
      const scale = 1 - i * 0.15;
      const points = circlePoints(r * scale, samples, (angle) => {
        // A traveling wave around the ring — smooth, organic warping.
        return 1 + p.stretch * 0.35 * Math.sin(angle * waves + t * (1.5 + i * 0.7));
      });

      const color = hsl(hue + (i * 360) / layers, p.saturation, 60);
      const glow = p.glow * 14;
      const width = 1.2 - i * 0.15;

      strokeGlow(ctx, points, true, color, { glow, width, alpha: 0.9 - i * 0.15 });
      strokeGlow(ctx, points, true, color, {
        glow: glow * 1.6,
        width,
        alpha: (0.45 - i * 0.08) * p.glow,
        lighter: true,
      });
    }
  },
};
