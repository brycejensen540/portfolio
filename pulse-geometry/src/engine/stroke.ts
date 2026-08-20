import type { Point } from '../types';

/** Point on a circle, given a radius and an angle in radians. */
export function polar(radius: number, angle: number): Point {
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

export interface StrokeOptions {
  /** Neon glow radius in px. 0 disables the shadow. */
  glow?: number;
  /** Line width in px. */
  width?: number;
  /** Overall opacity of this pass. */
  alpha?: number;
  /**
   * Additive blending (`globalCompositeOperation = 'lighter'`). Used for
   * a second pass that makes the bright parts bloom outward.
   */
  lighter?: boolean;
}

/**
 * Stroke a polyline / polygon with a glowing neon look.
 *
 * `strokeGlow` is the single drawing primitive every shape uses, so all
 * glow styling lives here. Each shape usually calls it twice per layer:
 * once for the crisp core line, once (with `lighter: true`) for the bloom.
 */
export function strokeGlow(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed: boolean,
  color: string,
  options: StrokeOptions = {},
): void {
  if (points.length === 0) return;

  // Thin, restrained defaults — the whole theme is thinner lines.
  const { glow = 14, width = 1.1, alpha = 1, lighter = false } = options;

  ctx.save();
  if (lighter) ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;

  ctx.beginPath();
  points.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
  if (closed) ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

/** Sample `count` points around a circle with a smooth per-vertex wobble. */
export function circlePoints(
  radius: number,
  count: number,
  wobble: (angle: number, index: number) => number = () => 1,
): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    points.push(polar(radius * wobble(angle, i), angle));
  }
  return points;
}
