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
        // The Apollo brand accent — the orange carried over from the
        // company's original branding (sun logo + script wordmark).
        brand: {
          DEFAULT: '#D03B02', // Apollo orange — primary CTAs and icons
          bright: '#FDAD05', // amber — text accents on dark navy sections
          deep: '#A62F02', // darker orange for hovers
          soft: '#FBE9E0', // light orange tint for selections
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
        glow: '0 8px 30px -8px rgba(208, 59, 2, 0.45)',
      },
    },
  },
  plugins: [],
};
