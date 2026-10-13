import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { site } from './src/site.config.ts'

const siteUrl = site.origin + site.base

const template = (name: string) => readFileSync(new URL(`./site-templates/${name}`, import.meta.url), 'utf8')
const fill = (s: string) =>
  s
    .replaceAll('__SITE_URL__', siteUrl)
    .replaceAll('__SITE_ORIGIN__', site.origin)
    .replaceAll('__BASE__', site.base)
    .replaceAll('__DATE__', new Date().toISOString().slice(0, 10))

/** Strict Content-Security-Policy, with hashes computed from the page's own inline scripts. */
function contentSecurityPolicy(html: string) {
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`,
  )
  const gc = site.goatcounter ? `https://${site.goatcounter}.goatcounter.com` : ''
  const form = site.formEndpoint ? new URL(site.formEndpoint).origin : ''
  return [
    `default-src 'self'`,
    `script-src 'self' ${hashes.join(' ')}${gc ? ' https://gc.zgo.at' : ''}`,
    `style-src 'self'`,
    `style-src-attr 'unsafe-inline'`, // React/Framer set inline style attributes; <style> elements stay blocked
    `img-src 'self' data:${gc ? ` ${gc}` : ''}`,
    `font-src 'self'`,
    `media-src 'self'`,
    `connect-src 'self'${form ? ` ${form}` : ''}${gc ? ` ${gc}` : ''}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

function sitePlugin(): Plugin {
  return {
    name: 'portfolio-site',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        html = fill(html)
        if (!ctx.bundle) return html // dev server: HMR needs inline scripts, so no CSP there
        if (site.goatcounter) {
          html = html.replace(
            '</body>',
            `    <script data-goatcounter="https://${site.goatcounter}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>\n  </body>`,
          )
        }
        const csp = contentSecurityPolicy(html.replace(/<script data-goatcounter[\s\S]*?<\/script>/, ''))
        return html.replace('<!--CSP-->', `<meta http-equiv="Content-Security-Policy" content="${csp}" />`)
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '404.html', source: fill(template('404.html')) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: fill(template('sitemap.xml')) })
      if (site.customDomain) this.emitFile({ type: 'asset', fileName: 'CNAME', source: `${site.customDomain}\n` })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sitePlugin()],
  base: site.base,
})
