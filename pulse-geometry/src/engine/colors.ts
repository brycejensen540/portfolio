/** Tiny color helpers. Keeping these inline avoids any color library. */

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Build an `hsl(...)` color string. Hue wraps around 360. */
export function hsl(hue: number, saturation: number, lightness: number): string {
  const h = ((hue % 360) + 360) % 360;
  return `hsl(${h} ${clamp(saturation, 0, 100)}% ${clamp(lightness, 0, 100)}%)`;
}
