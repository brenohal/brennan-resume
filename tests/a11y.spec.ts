import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// WCAG 2.0/2.1 A and AA, every page, both themes, desktop and phone.
const pages = [
  { name: 'home', path: './' },
  { name: 'case study', path: 'work/job-application-engine/' },
  { name: 'print view', path: 'resume/' },
  { name: '404', path: '404.html' },
]

for (const theme of ['dark', 'light'] as const) {
  for (const p of pages) {
    test(`a11y: ${p.name} (${theme})`, async ({ page }) => {
      // Reduced motion disables the scroll-reveal fade, so axe never measures a half-faded element.
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.route(/gc\.zgo\.at|goatcounter\.com/, (r) => r.abort())
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
      await page.goto(p.path)
      await expect(page.locator('h1')).toBeVisible()
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0].target.join(' ')}`)
      expect(summary, summary.join('\n')).toEqual([])
    })
  }
}
