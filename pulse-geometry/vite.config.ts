import { defineConfig } from 'vite';

// `base: './'` keeps every asset path relative, so the built `dist/`
// folder works from any static host — a subpath, a CDN, anywhere.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
