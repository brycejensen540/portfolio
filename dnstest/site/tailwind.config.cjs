/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{css,html}'],
  theme: {
    extend: {
      colors: {
        // Pure-black terminal aesthetic.
        carbon: '#000000',      // page background
        panel: '#0D1117',       // elevated surfaces (code blocks, cards)
        line: '#21262D',        // 1px borders
        text: '#E6EDF3',        // primary off-white text
        muted: '#8B949E',       // secondary text
        // A single accent, used sparingly.
        accent: '#00E5FF',      // electric cyan
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};