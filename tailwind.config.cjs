/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white page background and near-black text
        paper: '#F8F5F0',
        ink: '#1C1A17',

        // Accents — kept to two, used sparingly.
        // The DEFAULT value is the darker, readable tone for text;
        // "bright" and "soft" exist for glows and tints.
        teal: {
          DEFAULT: '#0F766E',
          bright: '#14B8A6',
          soft: '#5EEAD4',
          deep: '#134E4A',
        },
        orange: {
          DEFAULT: '#C2410C',
          bright: '#F97316',
          soft: '#FDBA74',
          deep: '#9A3412',
        },
      },
      fontFamily: {
        // Primary body font (Inter) and display font for headings (Space Grotesk)
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};