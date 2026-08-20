# Apollo Professional — Website

A production-ready, static marketing website for **Apollo Professional**, a detail-focused
window and exterior cleaning company based in Evanston, IL, serving a 30-mile radius around
Chicago. Built with Astro + TypeScript + Tailwind CSS, with an auto-generated sitemap and
local-SEO metadata baked into every page.

> Content source: the company's live site (apolloprofessional.net), rebuilt with a fresh,
> premium design. The former co-owner is not mentioned; Eric is presented as the sole
> owner/operator and every page uses the primary number **(773) 600-1308**.

## Pages

| Route                     | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `/`                       | Home — hero, trust bar, services, areas, reviews |
| `/about/`                 | About the company + owner bio (Eric)           |
| `/services/<slug>/`       | 6 service pages (window, gutter, screens ×2, power washing, shower doors) |
| `/areas/`                 | Service areas overview (16 communities)        |
| `/areas/<slug>/`          | Chicago, Evanston, Oak Park, La Grange, Hinsdale |
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
- **Colors / fonts** → `tailwind.config.cjs` (navy + sky palette, Inter + Plus Jakarta Sans)
- **Placeholder images** → `src/components/PlaceholderImage.astro` (swap for real photos;
  the component API stays the same)

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
- `og-image.svg` is a placeholder for social shares — replace with a 1200×630 PNG for
  best results.
