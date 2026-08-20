/**
 * Shared types for Pulse Geometry.
 *
 * A `Shape` knows how to draw itself onto the canvas. The renderer
 * handles the global setup (trails, rotation, centering, bloom) and
 * hands each shape the current animation clock `t`, the live `Params`,
 * a base radius `r`, and the base hue in degrees.
 */

export interface Point {
  x: number;
  y: number;
}

/** Every knob exposed in the control panel. */
export interface Params {
  /** Multiplier for the internal animation clock. */
  pulseSpeed: number;
  /** 0..1 — strength of the neon glow / bloom. */
  glow: number;
  /** 0..1 — how much vertices warp and stretch. */
  stretch: number;
  /** Multiplier for global rotation. */
  rotationSpeed: number;
  /** Base size multiplier for the whole composition. */
  scale: number;
  /** Base hue in degrees (0..360). */
  hue: number;
  /** Saturation of the geometry (20..100). */
  saturation: number;
  /** How fast the hue cycles over time. */
  colorSpeed: number;
  /** Layers / sides / rings — meaning varies per shape. */
  complexity: number;
  /** 0..0.94 — how long after-images persist on screen. */
  trail: number;
}

export interface Shape {
  id: string;
  name: string;
  /** Inline SVG used on the landing-page picker. */
  icon: string;
  /**
   * Draw one frame. The context is already translated to the canvas
   * center and rotated by the global rotation. `hue` is the live base
   * hue in degrees; shapes shift it per layer.
   */
  render: (
    ctx: CanvasRenderingContext2D,
    t: number,
    p: Params,
    r: number,
    hue: number,
  ) => void;
}
