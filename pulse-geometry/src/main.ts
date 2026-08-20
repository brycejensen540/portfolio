import './style.css';
import { Renderer } from './engine/renderer';
import { DEFAULTS } from './engine/params';
import type { Params, Shape } from './types';
import { shapes, randomShape } from './shapes';
import { buildControls } from './ui/controls';
import { createInactivityTracker } from './ui/inactivity';

// ---------------------------------------------------------------------------
// App bootstrap: view switching, the renderer, and the inactivity freeze.
// ---------------------------------------------------------------------------

const landing = document.getElementById('view-landing')!;
const rendererView = document.getElementById('view-renderer')!;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const shapeNameEl = document.getElementById('shape-name')!;
const overlay = document.getElementById('inactive-overlay')!;

// A single live params object shared by the renderer (reads it) and the
// control panel (mutates it). Calmer defaults under prefers-reduced-motion.
const params: Params = { ...DEFAULTS };
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  params.pulseSpeed = 0.35;
  params.colorSpeed = 0.02;
  params.stretch = 0.3;
}

const renderer = new Renderer(canvas, params);

// --- View switching ---------------------------------------------------------

function showLanding(): void {
  renderer.stop();
  tracker.disarm();
  overlay.classList.add('is-hidden');
  landing.classList.add('is-active');
  rendererView.classList.remove('is-active');
}

function showRenderer(shape: Shape): void {
  shapeNameEl.textContent = shape.name;
  landing.classList.remove('is-active');
  rendererView.classList.add('is-active');
  overlay.classList.add('is-hidden');
  renderer.start(shape, params);
  tracker.arm();
}

// --- Landing page -----------------------------------------------------------

document.getElementById('btn-random')!.addEventListener('click', () => {
  showRenderer(randomShape());
});

// Build the shape picker grid from the registry.
const grid = document.getElementById('shape-grid')!;
for (const shape of shapes) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shape-card';
  button.setAttribute('aria-label', `Load the ${shape.name} pattern`);
  button.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${shape.icon}</svg><span>${shape.name}</span>`;
  button.addEventListener('click', () => showRenderer(shape));
  grid.append(button);
}

// --- Renderer chrome --------------------------------------------------------

document.getElementById('btn-back')!.addEventListener('click', showLanding);

// Control panel (desktop = side panel, mobile = collapsible bottom sheet).
const panel = document.getElementById('controls-panel')!;
const panelToggle = document.getElementById('panel-toggle')!;
const isDesktop = window.matchMedia('(min-width: 900px)');
if (isDesktop.matches) panel.classList.add('open');
panelToggle.addEventListener('click', () => panel.classList.toggle('open'));

buildControls(params, {
  onRandomize: () => {
    // Params were already swapped in place — nothing else to do.
  },
  onReset: showLanding,
});

// --- Inactivity freeze ------------------------------------------------------
//
// 5 minutes without any pointer / touch / wheel / key / input activity:
// the loop stops, the last frame stays on screen, and the overlay appears.
// Clicking the overlay (or its button) returns to the landing page.

const tracker = createInactivityTracker(() => {
  renderer.stop(); // freeze: canvas keeps the last composited frame
  overlay.classList.remove('is-hidden');
});

const leaveOverlay = () => showLanding();
overlay.addEventListener('click', leaveOverlay);
document.getElementById('btn-inactive-reset')!.addEventListener('click', leaveOverlay);

// --- Manual testing hook ----------------------------------------------------
//
// The 5-minute timer can't be waited out during development. This exposes
// the freeze path so it can be triggered directly from the console:
//   window.__pulseGeometry.simulateInactivity()
declare global {
  interface Window {
    __pulseGeometry?: {
      simulateInactivity: () => void;
      state: () => { view: string; running: boolean };
    };
  }
}
window.__pulseGeometry = {      simulateInactivity: () => tracker.fire(),
      state: () => ({
        view: landing.classList.contains('is-active') ? 'landing' : 'renderer',
        running: renderer.isRunning,
        camera: renderer.camera,
      }),
    };
