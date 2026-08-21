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
2. **Identity** — the site uses the name **Bryce Jensen** (in `Header.astro`,
   `Footer.astro`,   `BaseLayout.astro`, and the Home/About copy). The footer's
   GitHub button points at the main profile `brycejensen540`; the other
   social links are `#` placeholders.
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

## Auto-deploy to Cloudflare Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site and
pushes it to Cloudflare Pages on **every push to `main`**. Live site:
**https://bryce-jensen-portfolio.pages.dev**

The build command (`npm run build`) and output directory (`dist`) are recorded
in `wrangler.toml` at the repo root and mirrored in the workflow.

**One-time setup** (the only manual step is creating the API token):

1. Create a Cloudflare API token: dashboard → **My Profile → API Tokens →
   Create Token → "Edit Cloudflare Workers"** template (or a custom token)
   with *Account: Cloudflare Pages: Edit* and *Account: Workers Scripts: Edit*.
2. Add it as a repo secret so the workflow can deploy:

   ```bash
   gh secret set CLOUDFLARE_API_TOKEN --repo brycejensen540/portfolio
   ```

3. Push to `main` — the workflow builds and deploys automatically. Watch it
   under **Actions** on GitHub; deployments appear in the Pages project.

> The workflow only runs once the secret exists — until then pushes will show
> a failed "Deploy to Cloudflare Pages" check, which is expected.
