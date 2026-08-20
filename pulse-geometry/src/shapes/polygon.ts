import type { Shape } from '../types';
import { polar, strokeGlow } from '../engine/stroke';
import { hsl } from '../engine/colors';
import type { Params } from '../types';

/**
 * Polygon shapes: triangle, square, hexagon, and the "nested polygons"
 * composition. They all share the same vertex math below.
 */

/** Vertices of a regular polygon, each radius modulated by a sine wave. */
function polygonPoints(
  sides: number,
  radius: number,
  t: number,
  phase: number,
  stretch: number,
  freq: number,
) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + phase;
    // Each vertex breathes in and out at its own offset — this is what
    // makes a rigid polygon look alive and morphing.
    const wobble = 1 + stretch * 0.4 * Math.sin(t * freq * 2 + i * 1.7 + phase * 3);
    points.push(polar(radius * wobble, angle));
  }
  return points;
}

/** Number of echoing layers a polygon gets from the complexity knob. */
function layersFor(p: Params): number {
  return 2 + Math.floor(p.complexity / 3);
}

/**
 * Draws a regular polygon with several echoing, hue-shifted layers.
 * Used by triangle, square, and hexagon.
 */
function renderPolygon(
  ctx: CanvasRenderingContext2D,
  t: number,
  p: Params,
  r: number,
  hue: number,
  sides: number,
): void {
  const layers = layersFor(p);
  const phase = t * 0.5;

  for (let i = 0; i < layers; i++) {
    const scale = 1 - i * 0.16;
    const points = polygonPoints(sides, r * scale, t, (i * Math.PI * 2) / sides + phase, p.stretch, sides);
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
}

export const triangle: Shape = {
  id: 'triangle',
  name: 'Triangle',
  icon: '<path d="M24 8 40 40 8 40 Z" />',
  render(ctx, t, p, r, hue) {
    renderPolygon(ctx, t, p, r, hue, 3);
  },
};

export const square: Shape = {
  id: 'square',
  name: 'Square',
  icon: '<rect x="10" y="10" width="28" height="28" />',
  render(ctx, t, p, r, hue) {
    renderPolygon(ctx, t, p, r, hue, 4);
  },
};

export const hexagon: Shape = {
  id: 'hexagon',
  name: 'Hexagon',
  icon: '<path d="M24 8 38 16 v16 L24 40 10 32 V16 Z" />',
  render(ctx, t, p, r, hue) {
    renderPolygon(ctx, t, p, r, hue, 6);
  },
};

export const nested: Shape = {
  id: 'nested',
  name: 'Nested Polygons',
  icon:
    '<polygon points="24,10 38,24 24,38 10,24" />' +
    '<polygon points="24,16 32,24 24,32 16,24" />',
  render(ctx, t, p, r, hue) {
    // Complexity drives both the number of sides and the number of layers.
    const sides = 3 + Math.floor(p.complexity / 2);
    const layers = Math.max(3, p.complexity);

    for (let i = 0; i < layers; i++) {
      const f = layers === 1 ? 0 : i / (layers - 1);
      const scale = 0.15 + f * 0.85;
      const points = polygonPoints(
        sides,
        r * scale,
        t,
        (i * Math.PI * 2) / layers + t * 0.3,
        p.stretch,
        sides,
      );
      const color = hsl(hue + (i * 360) / layers, p.saturation, 60 - f * 8);
      const glow = p.glow * (8 + f * 12);

      strokeGlow(ctx, points, true, color, {
        glow,
        width: 0.8 + f * 0.9,
        alpha: 0.35 + f * 0.5,
      });

      // Only the outer half needs the additive bloom pass — saves cost.
      if (f > 0.5) {
        strokeGlow(ctx, points, true, color, {
          glow: glow * 1.5,
          width: 0.8 + f * 0.7,
          alpha: 0.25 * p.glow,
          lighter: true,
        });
      }
    }
  },
};
