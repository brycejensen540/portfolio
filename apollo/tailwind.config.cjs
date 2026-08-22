/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Surfaces — very light cool gray backgrounds.
        surface: {
          DEFAULT: '#F7F8FA',
          alt: '#EEF0F3',    // alternating sections
          white: '#FFFFFF',  // cards on surface
        },
        // Text — deep charcoal scale.
        ink: {
          DEFAULT: '#1A1A2E', // headings, primary text
          soft: '#4B5563',    // body copy
          faint: '#9CA3AF',   // labels, captions
        },
        // Primary accent — muted teal.
        accent: {
          DEFAULT: '#4A8FA8',
          light: '#E8F4F8',   // tints, selected states
          dark: '#2E7A92',    // hovers
        },
        // Secondary neutral.
        neutral: '#8B95A2',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Restrained, soft shadows per design spec.
        soft: '0 4px 24px rgba(0, 0, 0, 0.06)',
        lift: '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
