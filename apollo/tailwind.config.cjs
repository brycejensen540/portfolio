/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Deep professional navy — the primary brand color.
        // Used for headers, footers, and dark sections.
        navy: {
          DEFAULT: '#0B2447',
          deep: '#081A36',
          mid: '#12305F',
          light: '#1E4B8F',
          soft: '#E8EFFA', // light tint for section backgrounds
          faint: '#F4F8FD', // faintest tint
        },
        // One sharp accent — a clean sky blue that echoes glass and water.
        sky: {
          DEFAULT: '#0EA5E9',
          bright: '#38BDF8',
          deep: '#0369A1',
          soft: '#BAE6FD',
        },
      },
      fontFamily: {
        // Inter for body copy, Plus Jakarta Sans for headings.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Soft card shadow and a subtle accent glow used on hover.
        soft: '0 4px 24px -6px rgba(11, 36, 71, 0.12)',
        glow: '0 8px 30px -8px rgba(14, 165, 233, 0.45)',
      },
    },
  },
  plugins: [],
};
