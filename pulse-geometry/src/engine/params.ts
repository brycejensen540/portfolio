import type { Params } from '../types';

/**
 * Calm, tasteful defaults. The "Start — Random Shape" button replaces
 * these with a randomized set; the sliders always reflect the live values.
 */
export const DEFAULTS: Params = {
  pulseSpeed: 0.8,
  glow: 0.5,
  stretch: 0.45,
  rotationSpeed: 0.5,
  scale: 1,
  hue: 200,
  saturation: 90,
  colorSpeed: 0.06,
  complexity: 6,
  trail: 0.55,
};

/** A full randomized set — used by the "Randomize" and "Start" buttons. */
export function randomParams(): Params {
  return {
    pulseSpeed: 0.3 + Math.random() * 1.3,
    glow: 0.4 + Math.random() * 0.6,
    stretch: Math.random(),
    rotationSpeed: Math.random() * 1.6,
    scale: 0.7 + Math.random() * 0.6,
    hue: Math.random() * 360,
    saturation: 70 + Math.random() * 30,
    colorSpeed: 0.02 + Math.random() * 0.2,
    complexity: 3 + Math.floor(Math.random() * 8),
    trail: 0.2 + Math.random() * 0.6,
  };
}
