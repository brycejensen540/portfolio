# dnstest — companion website

The public face of the [dnstest CLI](../README.md): a single landing page with
a pure-black, terminal aesthetic. One accent color (electric cyan), one
monospace font, zero JavaScript.

**Why plain HTML + Tailwind instead of Astro?** The site is a single static
page — a framework would add build machinery without adding value. Tailwind's
CLI compiles one stylesheet from `src/styles.css`; the rest is hand-written
HTML. (The sitemap integration in the spec is Astro-only, so `sitemap.xml` is
a small hand-written file here.)

## Build

```bash
npm install
npm run build        # writes dist/ (styles.css + index.html + public assets)
npm run serve        # preview dist/ at http://localhost:4322
npm run watch        # rebuild styles.css on change (dev)
```

Deploy `dist/` anywhere static files are welcome.

## Structure

```
site/
├── index.html            # the whole landing page
├── src/styles.css        # Tailwind directives + a few custom utilities
├── public/               # favicon.svg, robots.txt, sitemap.xml (copied to dist/)
├── scripts/copy-static.mjs
├── tailwind.config.cjs   # palette: carbon/panel/line/text/muted/accent
├── postcss.config.cjs
└── package.json
```

## Before deploying

1. Replace `dnstest.example.com` in `index.html` (canonical link) and
   `public/sitemap.xml` + `public/robots.txt` with the real domain.
2. Point the GitHub links wherever the repo ends up.
3. The accent color and palette live in `tailwind.config.cjs`.