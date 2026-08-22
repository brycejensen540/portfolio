// Central image registry.
//
// Every photo on the site resolves through this map, so replacing any
// image is a one-line change here. To use your own real photography,
// drop the files into /public/images and update the paths below.
//
// Current photos are free-license images from Pexels (window cleaning,
// architectural and natural-light photography) — see the comment on
// each entry for the subject, so you know what to replace it with.

export const images = {
  // Hero — a window cleaner on a ladder at a residential-scale
  // stone facade (within our 4-story / ladder-reachable limit).
  hero: '/images/hero-cleaner.jpg',

  about: {
    // Eric — the real owner photo. Keep or replace with a new one.
    team: '/images/about.webp',
    // "Who we are" — a suburban home in daylight.
    home: '/images/suburban-home.jpg',
    // Philosophy — modern glass architecture reflecting trees.
    modern: '/images/modern-glass.jpg',
  },

  services: {
    // Window cleaning — residential shuttered windows with a
    // wooden ladder (ladder-reachable scale).
    'window-cleaning': '/images/service-window.jpg',
    // Gutter cleaning — water draining away from the roofline.
    'gutter-cleaning': '/images/service-gutter.jpg',
    // Screen cleaning — a clean white window with mesh screen.
    'screen-cleaning': '/images/service-screen.jpg',
    // Screen repair — a screen with damage, ready to be fixed.
    'screen-repair': '/images/service-repair.jpg',
    // Power washing — a surface being pressure cleaned.
    'power-washing': '/images/service-power.jpg',
  },

  areas: {
    // Chicago — the skyline and lakefront from above.
    chicago: '/images/chicago-aerial.jpg',
    // Oak Park — a home with strong natural light.
    'oak-park': '/images/suburban-home.jpg',
    // La Grange — classic brick with tall windows.
    'la-grange': '/images/brick-windows.jpg',
    // Hinsdale — modern glass and clean architecture.
    hinsdale: '/images/city-facades.jpg',
    // CTA band background — Chicago at golden hour.
    skyline: '/images/chicago-sunset.jpg',
  },
} as const;
