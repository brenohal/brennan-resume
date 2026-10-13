// Post-build quality gate. Fails the build if the output breaks a promise this site makes:
// strict CSP, no inline code, no unexpected third-party origins, working internal links,
// complete metadata, and size budgets. Runs automatically after `npm run build`.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { site } from '../src/site.config.ts'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const BUDGET = { jsGzKB: 30, cssGzKB: 25, htmlGzKB: 40, imageKB: 160 }
// Origins the pages may reference. Anything else is a failure.
const ALLOWED = new Set([
  site.origin,
  'https://github.com', 'https://www.linkedin.com',
  ...(site.formEndpoint ? [new URL(site.formEndpoint).origin] : []),
  ...(site.goatcounter ? ['https://gc.zgo.at', `https://${site.goatcounter}.goatcounter.com`] : []),
])

const failures = [], notes = []
const fail = (page, msg) => failures.push(`${page}: ${msg}`)

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p] })
const files = walk(DIST)
const htmlFiles = files.filter((f) => extname(f) === '.html')

// ---------- size budgets ----------
const gz = (f) => gzipSync(readFileSync(f), { level: 9 }).length
const sum = (ext) => files.filter((f) => extname(f) === ext).reduce((n, f) => n + gz(f), 0) / 1024
const js = sum('.js'), css = sum('.css')
if (js > BUDGET.jsGzKB) fail('budget', `JavaScript ${js.toFixed(1)} KB gz exceeds ${BUDGET.jsGzKB} KB`)
if (css > BUDGET.cssGzKB) fail('budget', `CSS ${css.toFixed(1)} KB gz exceeds ${BUDGET.cssGzKB} KB`)
for (const f of files.filter((f) => /\.(avif|webp|jpe?g|png)$/.test(f) && !f.endsWith('og-image.jpg'))) {
  const kb = statSync(f).size / 1024
  if (kb > BUDGET.imageKB) fail('budget', `${relative(DIST, f)} is ${kb.toFixed(0)} KB (limit ${BUDGET.imageKB} KB)`)
}
notes.push(`JS ${js.toFixed(1)} KB gz · CSS ${css.toFixed(1)} KB gz · ${htmlFiles.length} pages`)

// ---------- per-page checks ----------
const resolvesInDist = (ref) => {
  const path = decodeURIComponent(ref.split('#')[0].split('?')[0]).slice(site.base.length)
  const candidates = [join(DIST, path), join(DIST, path, 'index.html')]
  return candidates.some((c) => existsSync(c) && statSync(c).isFile())
}
for (const file of htmlFiles) {
  const page = '/' + relative(DIST, file).replaceAll('\\', '/')
  const html = readFileSync(file, 'utf8')

  if (gz(file) / 1024 > BUDGET.htmlGzKB) fail(page, `HTML ${(gz(file) / 1024).toFixed(1)} KB gz over budget`)
  if (!/<html[^>]*\slang="[a-z-]+"/.test(html)) fail(page, 'missing <html lang>')
  if (!/<title>[^<]{5,}<\/title>/.test(html)) fail(page, 'missing <title>')
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail(page, 'missing or too-short meta description')
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail(page, 'must have exactly one <h1>')
  const noindex = /<meta name="robots" content="noindex"/.test(html)
  if (!noindex && !/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) fail(page, 'missing canonical link')
  if (noindex && /<link rel="canonical"/.test(html)) fail(page, 'noindex page should not declare a canonical')
  if (!/property="og:image" content="https:\/\/[^"]+"/.test(html)) fail(page, 'missing og:image')
  if (!/<meta name="viewport"/.test(html)) fail(page, 'missing viewport meta')

  // strict CSP present, with no escape hatches
  const csp = /<meta http-equiv="content-security-policy" content="([^"]+)"/i.exec(html)?.[1]
  if (!csp) fail(page, 'no Content-Security-Policy meta')
  else {
    if (/unsafe-eval/.test(csp)) fail(page, "CSP allows 'unsafe-eval'")
    const scriptSrc = /script-src ([^;]+)/.exec(csp)?.[1] ?? ''
    if (/unsafe-inline/.test(scriptSrc)) fail(page, "CSP script-src allows 'unsafe-inline'")
    const styleSrc = /style-src ([^;]+)/.exec(csp)?.[1] ?? ''
    if (/unsafe-inline/.test(styleSrc)) fail(page, "CSP style-src allows 'unsafe-inline'")
    if (!/object-src 'none'/.test(csp)) fail(page, "CSP missing object-src 'none'")
    if (!/base-uri 'self'/.test(csp)) fail(page, "CSP missing base-uri 'self'")
  }
  // nothing the CSP would have to block
  if (/<style[\s>]/.test(html)) fail(page, 'inline <style> element')
  if (/\sstyle=["']/.test(html)) fail(page, 'inline style attribute')
  if (/\son[a-z]+=["']/i.test(html)) fail(page, 'inline event handler attribute')
  if (/javascript:/i.test(html)) fail(page, 'javascript: URL')

  // every referenced URL is ours or explicitly allowed; every internal one exists
  const refs = [...html.matchAll(/\b(?:href|src|action|data-src|data-endpoint)="([^"]+)"/g)].map((m) => m[1])
  for (const ref of refs) {
    if (/^(mailto:|tel:|#|data:)/.test(ref)) continue
    if (/^https?:\/\//.test(ref)) {
      if (!ALLOWED.has(new URL(ref).origin)) fail(page, `unexpected external origin: ${ref}`)
      else if (ref.startsWith(site.origin + site.base) && !resolvesInDist(new URL(ref).pathname)) fail(page, `broken absolute link: ${ref}`)
      continue
    }
    if (ref.startsWith('/')) {
      if (!ref.startsWith(site.base)) fail(page, `link outside the site base: ${ref}`)
      else if (!resolvesInDist(ref)) fail(page, `broken internal link: ${ref}`)
    }
  }
  // external links that open new tabs must not leak the opener
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(m[0])) fail(page, `target=_blank without noopener: ${m[0].slice(0, 80)}`)
  // images have alt text
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) fail(page, `<img> without alt: ${m[0].slice(0, 80)}`)
}

// ---------- site-level files ----------
for (const f of ['404.html', 'sitemap.xml', 'favicon.svg', 'og-image.jpg', 'assets/resume.pdf', '.nojekyll']) if (!existsSync(join(DIST, f))) fail('dist', `missing ${f}`)
// GitHub Pages runs Jekyll unless .nojekyll exists, and Jekyll silently drops every _-prefixed folder, including _astro/ (all CSS, JS, fonts).

if (existsSync(join(DIST, 'og-image.jpg'))) {
  const m = await sharp(join(DIST, 'og-image.jpg')).metadata()
  if (m.width !== 1200 || m.height !== 630) fail('og-image.jpg', `must be 1200x630, is ${m.width}x${m.height}`)
}
if (existsSync(join(DIST, 'sitemap.xml'))) {
  const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  if (sm.includes(`${site.base}resume/`) || sm.includes('/404')) fail('sitemap.xml', 'lists a noindex page')
  if (!sm.includes(site.origin)) fail('sitemap.xml', `does not use the site origin ${site.origin}`)
}
if (site.customDomain && !existsSync(join(DIST, 'CNAME'))) fail('dist', 'custom domain set but no CNAME in dist (add public/CNAME)')

if (failures.length) {
  console.error(`\n✖ dist check failed (${failures.length}):\n` + failures.map((f) => '  - ' + f).join('\n') + '\n')
  process.exit(1)
}
console.log(`✔ dist check passed: ${notes.join(' · ')}; CSP strict, no inline code, ${htmlFiles.length} pages with complete metadata, all internal links resolve`)
