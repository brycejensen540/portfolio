# Personal Portfolio

A clean, minimal, static personal portfolio built with **Astro + TypeScript** and
**Tailwind CSS**. First version: three pages (Home, About, Projects) with
placeholder content, a slightly vaporwave-inspired feel, and restrained
interactivity (mobile hamburger menu + very light fade-in).

**Stack**

- [Astro](https://astro.build) (v5) with TypeScript
- Tailwind CSS via the official `@astrojs/tailwind` integration (Tailwind v3)
- Official `@astrojs/sitemap` integration (generates `/sitemap-index.xml` at build)
- Vanilla TypeScript only — no component frameworks

**Commands**

All commands below assume Node/npm are on your PATH. If your machine has no
Node installed, they also work with the portable runtime checked into
`.tooling/` (see "Portable Node" below).

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:4321
npm run build      # build the static site into dist/
npm run preview    # preview the production build locally
npm run check      # type-check and validate Astro files
```

**Portable Node**

This repo was scaffolded on a machine without Node. A self-contained Windows
Node runtime lives in `.tooling/` (git-ignored). To use it for a one-off
install/build:

```bash
NODE=.tooling/node-v24.19.0-win-x64/node.exe
NPM=.tooling/node-v24.19.0-win-x64/node_modules/npm/bin/npm-cli.js
"$NODE" "$NPM" install
"$NODE" "$NPM" run build
```

**Project structure**

```
├── astro.config.mjs          Strapped: Tailwind + sitemap integrations, `site` URL
├── tailwind.config.cjs        Design tokens: colors (paper/ink/teal/orange), fonts
├── public/
│   └── favicon.svg            Sun-over-horizon brand mark
└── src/
    ├── components/            Header (nav + mobile menu), Footer, ProjectCard
    ├── data/
    │   └── projects.ts        All project content — edit here to update both pages
    ├── layouts/
    │   └── BaseLayout.astro   Shared head/fonts/header/footer/scripts
    ├── pages/                 index.astro, about.astro, projects.astro
    ├── scripts/               menu.ts (hamburger), fade-in.ts (reveal on scroll)
    └── styles/
        └── global.css         Tailwind directives + design-system classes
```

**Customizing for real content**

1. **Domain** — in `astro.config.mjs` replace the placeholder `site` URL
   (used by the sitemap).
2. **Name** — replace "Jordan Avery" in `Header.astro`, `Footer.astro`,
   `BaseLayout.astro`, and the Home/About copy.
3. **Projects** — edit `src/data/projects.ts` (single source shared by Home
   and Projects). Replace `#` links with real URLs.
4. **Fonts** — the Google Fonts `<link>` lives in `src/layouts/BaseLayout.astro`;
   weights are configured in `tailwind.config.cjs`.
5. **Colors** — the teal/orange accents, off-white `paper`, and near-black
   `ink` are all in `tailwind.config.cjs`.

**Notes for v1**

- All prose is intentional placeholder copy; `favicon.svg` doubles as the
  header logo.
- The fade-in only applies when JavaScript runs and respects
  `prefers-reduced-motion`.
- No analytics, contact forms, or build-time assets are included yet.
