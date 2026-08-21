// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The sitemap integration uses `site` to build absolute URLs.
  // This is the Cloudflare Pages deployment URL for the portfolio.
  site: 'https://bryce-jensen-portfolio.pages.dev',

  // applyBaseStyles: false lets us write the three Tailwind directives
  // ourselves in src/styles/global.css (see that file).
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
});