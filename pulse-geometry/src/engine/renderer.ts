import type { Params, Shape } from '../types';
import { clamp } from './colors';

const BACKGROUND = 'rgb(0, 0, 0)';

/**
 * The rendering engine.
 *
 * Owns the requestAnimationFrame loop, the animation clock, trail
 * fading, global rotation, and a soft central bloom. Each frame it:
 *
 *   1. Fades the previous frame (creating after-images / trails).
 *   2. Asks the active shape to draw itself (rotated, centered).
 *   3. Adds a soft radial bloom on top for extra depth.
 *
 * Quality guard: if the rolling average frame rate drops below ~40 fps,
 * the internal resolution is halved (once), which roughly doubles the
 * speed on weaker devices.
 */
export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private rafId = 0;
  private running = false;
  private time = 0;
  private lastFrame = 0;
  private dpr = 1;
  private fpsSamples: number[] = [];
  private bloom: HTMLCanvasElement;

  private shape: Shape | null = null;
  private params: Params;

  // --- Camera (user-controlled) ---
  private zoom = 1;
  private userRotation = 0;
  private dragging = false;
  private lastPointerX = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    params: Params,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not supported in this browser.');
    this.ctx = ctx;
    this.params = params;
    this.bloom = this.buildBloomSprite();

    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      // Avoid a huge time jump when the tab comes back into view.
      this.lastFrame = performance.now();
    });

    this.setupCameraControls();
  }

  /**
   * Mouse / touch camera:
   *   - click and hold, then drag → spin the composition
   *   - mouse wheel → zoom in / out (exponentially, so it feels even)
   * The controls work on pointer events so touch dragging works too.
   */
  private setupCameraControls(): void {
    const canvas = this.canvas;

    canvas.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastPointerX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add('is-dragging');
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      // Roughly 0.5° of spin per pixel dragged — sensitive but steady.
      this.userRotation += (e.clientX - this.lastPointerX) * 0.008;
      this.lastPointerX = e.clientX;
    });

    const endDrag = () => {
      this.dragging = false;
      canvas.classList.remove('is-dragging');
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault(); // don't let the wheel scroll or pinch-zoom
        this.zoom = clamp(this.zoom * Math.exp(-e.deltaY * 0.0012), 0.4, 3);
      },
      { passive: false },
    );
  }

  get isRunning(): boolean {
    return this.running;
  }

  /** Current camera state — exposed for the console test hook. */
  get camera(): { zoom: number; rotation: number } {
    return { zoom: this.zoom, rotation: this.userRotation };
  }

  /** Begin (or restart) the loop with a shape. Clears the canvas first. */
  start(shape: Shape, params: Params): void {
    this.shape = shape;
    this.params = params;
    this.time = 0;
    // Fresh camera for each session — predictable after a shape switch.
    this.zoom = 1;
    this.userRotation = 0;
    this.dragging = false;
    this.running = true;

    this.resize();
    // Paint a solid background so trails start from black, not garbage.
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = BACKGROUND;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.lastFrame = performance.now();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.frame);
  }

  /** Freeze the loop. The canvas keeps its last composited frame. */
  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  /** Match the canvas backing store to its CSS size and the device DPR. */
  private resize(): void {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private frame = (now: number): void => {
    if (!this.running) return;

    // Clamp dt so a dropped frame (or tab switch) never causes a jump.
    const dt = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;

    // The pulse speed knob scales how fast the whole world moves.
    this.time += dt * (0.35 + this.params.pulseSpeed * 1.1);

    this.monitorFps(dt);
    this.render();

    this.rafId = requestAnimationFrame(this.frame);
  };

  private render(): void {
    const ctx = this.ctx;
    const p = this.params;
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;

    // 1) Fade the previous frame — this creates the psychedelic trails.
    if (p.trail > 0) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(0, 0, 0, ${p.trail})`;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    if (!this.shape) return;

    // 2) Center the composition, apply global rotation, draw the shape.
    const cx = width / 2;
    const cy = height / 2;
    // Camera: base size × scale knob × user zoom.
    const radius = Math.min(width, height) * 0.36 * p.scale * this.zoom;
    const hue = (p.hue + this.time * p.colorSpeed * 360) % 360;

    ctx.save();
    ctx.translate(cx, cy);
    // Global spin (knob) + the user's drag-to-spin rotation.
    ctx.rotate(this.time * p.rotationSpeed * 0.8 + this.userRotation);
    this.shape.render(ctx, this.time, p, radius, hue);
    ctx.restore();

    // 3) Soft central bloom — a pre-rendered radial gradient drawn with
    //    additive blending. Cheap depth that sells the "glow" look.
    if (p.glow > 0.05) {
      const size = radius * 2.4;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.glow * 0.35;
      ctx.drawImage(this.bloom, cx - size / 2, cy - size / 2, size, size);
      ctx.restore();
    }
  }

  /** Watch the rolling average FPS; degrade resolution once if it's slow. */
  private monitorFps(dt: number): void {
    this.fpsSamples.push(dt);
    if (this.fpsSamples.length < 90) return;

    const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
    this.fpsSamples = [];
    const fps = 1 / avg;
    if (fps < 40 && this.dpr > 0.75) {
      this.dpr = Math.max(0.75, this.dpr / 2);
      this.resize();
    }
  }

  /** Pre-render a soft white radial glow used for the central bloom. */
  private buildBloomSprite(): HTMLCanvasElement {
    const size = 192;
    const sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const g = sprite.getContext('2d')!;
    const grad = g.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2,
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.18)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return sprite;
  }
}
