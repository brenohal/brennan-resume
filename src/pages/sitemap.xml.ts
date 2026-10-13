import type { APIRoute } from 'astro'
import { absolute } from '../lib/url'

// Public, indexable pages only. (resume/ and 404/ are noindex.)
const pages = ['', 'work/job-application-engine/']

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10)
  const urls = pages.map((p) => `  <url><loc>${absolute(p)}</loc><lastmod>${today}</lastmod><priority>${p ? '0.7' : '1.0'}</priority></url>`).join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml' } })
}
