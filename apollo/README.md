# Apollo Professional — Website

A production-ready, static marketing website for **Apollo Professional**, a detail-focused
window and exterior cleaning company based in Chicago, IL, serving a 30-mile radius around
the city. Built with Astro + TypeScript + Tailwind CSS, with an auto-generated sitemap and
local-SEO metadata baked into every page.

> Content source: the company's live site (apolloprofessional.net), rebuilt with a fresh,
> premium design. The former co-owner is not mentioned; Eric is presented as the sole
> owner/operator and every page uses the primary number **(773) 600-1308**.
>
> Branding: the redesign keeps the company's real identity — the orange sun logo
> (dark + white variants in `public/images/`), the brand orange accent (#D03B02),
> real service photos, and the Angi / Home Advisor / Yelp trust badges — presented
> in a clean, modern layout.

## Pages

| Route                     | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `/`                       | Home — hero, trust bar, services, areas, reviews |
| `/about/`                 | About the company + owner bio (Eric)           |
| `/services/<slug>/`       | 5 service pages (window, gutter, screens ×2, power washing) |
| `/areas/`                 | Service areas overview (16 communities)        |
| `/areas/<slug>/`          | Chicago, Oak Park, La Grange, Hinsdale |
| `/contact/`               | Contact form + details                          |

Service and service-area pages are **data-driven**: edit `src/data/services.ts` or
`src/data/areas.ts` and the pages (plus sitemap entries) update automatically.

## Tech stack

- [Astro](https://astro.build) (static output) + TypeScript
- Tailwind CSS via `@astrojs/tailwind`
- `@astrojs/sitemap` — generates `sitemap-index.xml` + `sitemap-0.xml` at build
- Vanilla TypeScript only: mobile menu, scroll reveal, form enhancement
- No component frameworks, no UI libraries

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # astro check (type checking)
npm run build      # static build → dist/
npm run preview    # serve the built site
```

The repo uses a portable Node in `.tooling/` (this machine has no system Node).
If you need it:

```bash
export PATH="$PWD/.tooling/node-v24.19.0-win-x64:$PATH"
```

## Where to edit things

- **Company info** (name, phone, email, hours, rating) → `src/data/site.ts`
- **Services** (content, benefits, FAQs, meta descriptions) → `src/data/services.ts`
- **Service areas** → `src/data/areas.ts`
- **Google reviews** → `src/data/reviews.ts`
- **Colors / fonts** → `tailwind.config.cjs` (navy + brand-orange palette, Inter + Plus Jakarta Sans)
- **Photos** → `public/images/` (brand logo, service photos, owner photo, area photos);
  `src/components/MediaImage.astro` renders a real photo when an `image` path is passed
  and falls back to brand-colored geometric art otherwise. Service photos are wired
  up in `src/data/services.ts`; area photos in `src/data/areas.ts`.
- **Trust badges** → `public/badges/` (Angi, Home Advisor ×3, Yelp), shown on the home page

## SEO

- Unique `<title>` + meta description per page
- Open Graph + Twitter Card tags (branded `og-image.svg` placeholder)
- Canonical URLs, `robots.txt`, auto-generated `sitemap.xml`
- JSON-LD: `LocalBusiness` (home/areas), `Service` (service pages), `AboutPage`, `ContactPage`
- Semantic HTML, one `h1` per page, aria labels, alt-equivalent placeholder labels

Update `site` in `astro.config.mjs` before deploying if the domain changes.

## Notes

- The contact form is intentionally static: submitting composes a pre-filled email to the
  company inbox in the visitor's mail app (no backend). The phone number is always the
  fastest path and is shown on every page.
- `og-image.svg` carries the brand sun mark and colors — replace with a 1200×630 PNG
  for best results.
