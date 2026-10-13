import { defineConfig } from 'astro/config'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { site } from './src/site.config.ts'

// The one synchronous inline script (theme, applied before first paint so there is no flash).
// Its hash is computed from the very file the page inlines, so the CSP can never drift from it.
const themeInit = readFileSync(new URL('./src/scripts/theme-init.js', import.meta.url), 'utf8')
const themeHash = `sha256-${createHash('sha256').update(themeInit).digest('base64')}` as `sha256-${string}`

const gc = site.goatcounter ? `https://${site.goatcounter}.goatcounter.com` : ''
const form = site.formEndpoint ? new URL(site.formEndpoint).origin : ''
// Astro types each directive by its name prefix; these helpers keep that guarantee at the call sites.
const join = (...parts: string[]) => parts.filter(Boolean).join(' ')
// (the cast satisfies the type; each string already starts with its real directive name)
const d = (s: string) => s as `default-src${string}`

export default defineConfig({
  site: site.origin,
  base: site.base,
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false }, // no code blocks on this site; Shiki's inline styles would conflict with the strict CSP
  build: { inlineStylesheets: 'never' }, // external CSS keeps `style-src 'self'` strict
  vite: { build: { assetsInlineLimit: 0 } }, // never inline assets/scripts as data: or inline <script>
  security: {
    csp: {
      directives: [
        d("default-src 'self'"),
        d(join('img-src', "'self'", 'data:', gc)),
        d("font-src 'self'"),
        d("media-src 'self'"),
        d(join('connect-src', "'self'", form, gc)),
        d("object-src 'none'"),
        d("base-uri 'self'"),
        d(join('form-action', "'self'", form)),
        d('upgrade-insecure-requests'),
      ],
      scriptDirective: {
        resources: ["'self'", ...(gc ? ['https://gc.zgo.at'] : [])],
        hashes: [themeHash],
      },
      styleDirective: { resources: ["'self'"] },
    },
  },
})
