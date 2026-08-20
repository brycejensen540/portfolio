import type { Shape } from '../types';
import { circle } from './circle';
import { triangle, square, hexagon, nested } from './polygon';
import { star } from './star';
import { spiral } from './spiral';
import { flower } from './flower';

/**
 * The shape registry. Add a new shape by creating a module in this
 * folder that exports a `Shape`, then adding it to this array — the
 * landing page picker, the random picker, and the renderer all read
 * from `shapes`, so nothing else needs to change.
 */
export const shapes: Shape[] = [
  circle,
  triangle,
  square,
  hexagon,
  star,
  spiral,
  flower,
  nested,
];

export function getShape(id: string): Shape | undefined {
  return shapes.find((s) => s.id === id);
}

export function randomShape(): Shape {
  return shapes[Math.floor(Math.random() * shapes.length)];
}
