// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The sitemap integration uses `site` to build absolute URLs and
  // canonical links. This is the company's real domain — update it
  // if the site is deployed somewhere else.
  site: 'https://www.apolloprofessional.net',

  // applyBaseStyles: false lets us write the three Tailwind directives
  // ourselves in src/styles/global.css (see that file).
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
});
