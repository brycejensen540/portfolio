/**
 * Inactivity tracker.
 *
 * Arms while the renderer view is active. Any mouse movement, touch,
 * wheel, key, or input event resets a 5-minute timer. When the timer
 * fires, `onInactive` runs: the renderer freezes on its last frame and
 * the overlay is shown. The tracker stays disarmed until the next
 * session starts.
 */
export function createInactivityTracker(onInactive: () => void) {
  const TIMEOUT_MS = 5 * 60 * 1000; // 5 full minutes

  const EVENTS: (keyof WindowEventMap)[] = [
    'pointermove',
    'pointerdown',
    'touchstart',
    'wheel',
    'keydown',
    'input',
  ];

  let timer = 0;
  let armed = false;

  const fire = () => {
    disarm();
    onInactive();
  };

  const reset = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(fire, TIMEOUT_MS);
  };

  const onActivity = () => reset();

  function arm(): void {
    if (armed) return;
    armed = true;
    for (const event of EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    reset();
  }

  function disarm(): void {
    armed = false;
    window.clearTimeout(timer);
    for (const event of EVENTS) {
      window.removeEventListener(event, onActivity);
    }
  }

  return { arm, disarm, fire };
}
