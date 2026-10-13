# Brennan O'Halloran · portfolio (v2)

A static, content-driven portfolio built with [Astro](https://astro.build). It ships pre-rendered HTML and about
**3 KB of JavaScript**, under a strict Content-Security-Policy, with every page checked for accessibility on every push.

Live: <https://brenohal.github.io/brennan-resume/>

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server with hot reload (no CSP in dev, by design) |
| `npm run build` | Type-check, generate the share image, build the site, then run the **dist quality gate** |
| `npm run preview` | Serve the production build at `http://localhost:4321/brennan-resume/` |
| `npm test` | Playwright: accessibility (axe) on every page in both themes, plus behavior tests, desktop and phone |
| `npm run lint` | oxlint |
| `npm run deploy` | Build and publish `dist/` to the `gh-pages` branch (manual, on purpose) |

First time running tests locally: they reuse your installed Chrome. In CI they install Chromium.

## Editing content

Nothing is hard-coded in components. Content lives in typed, build-validated files, so a typo fails the build instead of shipping.

| What | Where |
|---|---|
| Name, status, bio, contact copy, hero "impact log" | `src/data/personal.json` |
| Jobs (dates are `YYYY-MM`; every job needs a `headline` outcome) | `src/content/experience.json` |
| Coursework projects | `src/content/projects.json` |
| Flagship project and case-study page | `src/data/caseStudy.json` (+ `src/pages/work/job-application-engine.astro`) |
| Metrics band, credentials, toolbox, involvement | `src/content/*.json` |
| Education | `src/data/education.json` |
| **Résumé PDF** | `public/assets/resume.pdf` (replace the file; keep the name) |

The schemas are in `src/content.config.ts`.

## One file controls where the site lives: `src/site.config.ts`

```ts
const customDomain = ''           // e.g. 'brennan.example.com'
formEndpoint: '...formspree...'   // contact form service ('' = open the visitor's email app)
goatcounter: 'brenohal'           // cookie-free analytics ('' = none)
```

Change a value and the base path, canonical/OG tags, sitemap, CSP, footer privacy line, and share image all follow.

**Using a custom domain**
1. Set `customDomain`, and add a `public/CNAME` file containing the domain (the build fails if it is missing).
2. At your DNS provider, point the domain to GitHub Pages (`A` records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, or a `CNAME` for a subdomain).
3. In the repo's Pages settings set the custom domain and enable "Enforce HTTPS".
4. `npm run deploy`.

## What is generated at build time

- **Share image** (`og-image.jpg`) is drawn from the site's own data by `scripts/make-og.mjs` (satori), so it cannot drift from the content.
- **Structured data (JSON-LD)**, **sitemap**, and **canonical URLs** are derived from the same data and config.
- **Optimized images** (AVIF/WebP at the sizes used) come from `src/assets/images`.

## Quality gates

`npm run build` ends with `scripts/check-dist.mjs`, which **fails the build** if the output breaks a promise:
strict CSP (no `unsafe-inline`/`unsafe-eval`), no inline `<style>`/`style=`/`on*=`, no unexpected third-party origins,
every internal link resolves, one `<h1>`, alt text on images, complete metadata, size budgets (JS ≤ 30 KB, CSS ≤ 25 KB gzipped).

CI (`.github/workflows/ci.yml`) runs lint, build + gate, a production dependency audit, and the full browser suite.
Actions are pinned to commit SHAs and the workflow token is read-only.

## Security notes

- **Content-Security-Policy** is injected by Astro with computed hashes. The one inline script (theme, applied before first paint)
  is `src/scripts/theme-init.js`; its hash is derived from that file in `astro.config.ts`.
- **No third-party requests** except the optional analytics and form service named in `site.config.ts`. Fonts are self-hosted.
- GitHub Pages cannot send HTTP headers, so `frame-ancestors`, HSTS and similar need a different host if ever required.

## Rollback

The previous (React) site is tagged `v1-final`. To restore it: check out that tag, `npm ci && npm run deploy`.
