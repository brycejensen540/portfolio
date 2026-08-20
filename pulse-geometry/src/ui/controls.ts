import type { Params } from '../types';
import { randomParams } from '../engine/params';
import { clamp } from '../engine/colors';

interface SliderSpec {
  key: keyof Params;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

/**
 * Every slider the panel exposes. The `key` maps straight onto the live
 * Params object, so wiring is one place and nothing else needs to know
 * about the DOM.
 */
const SLIDERS: SliderSpec[] = [
  { key: 'pulseSpeed', label: 'Pulse Speed', min: 0, max: 2, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'glow', label: 'Glow / Bloom', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'stretch', label: 'Stretch / Warp', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'rotationSpeed', label: 'Rotation Speed', min: 0, max: 2, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'scale', label: 'Scale / Size', min: 0.25, max: 1.6, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'hue', label: 'Color Hue', min: 0, max: 360, step: 1, format: (v) => `${Math.round(v)}°` },
  { key: 'saturation', label: 'Saturation', min: 20, max: 100, step: 1, format: (v) => `${Math.round(v)}%` },
  { key: 'colorSpeed', label: 'Color Cycle Speed', min: 0, max: 0.5, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'complexity', label: 'Complexity', min: 2, max: 10, step: 1, format: (v) => String(Math.round(v)) },
  { key: 'trail', label: 'Trail Persistence', min: 0, max: 0.94, step: 0.01, format: (v) => `${Math.round(v * 100)}%` },
];

export interface ControlCallbacks {
  /** Called when "Randomize" is pressed (params already updated). */
  onRandomize: () => void;
  /** Called when "Reset" is pressed — returns to the landing view. */
  onReset: () => void;
}

/**
 * Builds the control panel: one labeled slider per Params field, plus
 * Randomize / Reset. The sliders mutate the *same* params object the
 * renderer reads, so changes apply instantly on the next frame.
 */
export function buildControls(params: Params, callbacks: ControlCallbacks): void {
  const body = document.getElementById('panel-body')!;
  const sliders = new Map<keyof Params, HTMLInputElement>();
  const refreshers = new Map<keyof Params, () => void>();

  for (const spec of SLIDERS) {
    const row = document.createElement('div');
    row.className = 'slider-row';

    const head = document.createElement('div');
    head.className = 'slider-head';

    const label = document.createElement('label');
    label.textContent = spec.label;
    label.htmlFor = `slider-${spec.key}`;

    const output = document.createElement('output');
    output.htmlFor = `slider-${spec.key}`;

    const input = document.createElement('input');
    input.type = 'range';
    input.id = `slider-${spec.key}`;
    input.min = String(spec.min);
    input.max = String(spec.max);
    input.step = String(spec.step);
    input.value = String(params[spec.key]);

    const refresh = () => {
      params[spec.key] = Number(input.value);
      output.textContent = spec.format(Number(input.value));
    };

    input.addEventListener('input', refresh);

    head.append(label, output);
    row.append(head, input);
    body.append(row);
    sliders.set(spec.key, input);
    refreshers.set(spec.key, refresh);
    refresh();
  }

  document.getElementById('btn-randomize')!.addEventListener('click', () => {
    // Swap the shared params object in place, then re-sync every slider
    // and its value readout through the same refresh path the user drags use.
    Object.assign(params, randomParams());
    for (const [key, input] of sliders) {
      input.value = String(params[key]);
      refreshers.get(key)!();
    }
    callbacks.onRandomize();
  });

  document.getElementById('btn-reset')!.addEventListener('click', callbacks.onReset);

  setupPanelResize();
}

/**
 * Desktop-only: drag the corner grip to resize the control panel.
 * The grip is hidden on mobile (bottom sheet), where the panel always
 * fills the width of the screen.
 */
function setupPanelResize(): void {
  // Desktop only — on mobile the panel is a full-width bottom sheet
  // and its size is controlled by the layout, not the user.
  if (!window.matchMedia('(min-width: 900px)').matches) return;

  const panel = document.getElementById('controls-panel')!;
  const grip = document.getElementById('resize-grip')!;

  // Min sizes keep the panel usable; max sizes keep it on screen.
  const MIN_W = 230;
  const MIN_H = 300;

  let startW = 0;
  let startH = 0;
  let startX = 0;
  let startY = 0;
  let resizing = false;

  grip.addEventListener('pointerdown', (e) => {
    resizing = true;
    startW = panel.offsetWidth;
    startH = panel.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    grip.setPointerCapture(e.pointerId);
  });

  grip.addEventListener('pointermove', (e) => {
    if (!resizing) return;
    panel.style.width = `${clamp(startW + (e.clientX - startX), MIN_W, window.innerWidth - 48)}px`;
    panel.style.height = `${clamp(startH + (e.clientY - startY), MIN_H, window.innerHeight - 120)}px`;
  });

  const stop = () => {
    resizing = false;
  };
  grip.addEventListener('pointerup', stop);
  grip.addEventListener('pointercancel', stop);
}
