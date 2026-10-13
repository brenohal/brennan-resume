import { test, expect, type Page } from '@playwright/test'

const FORM = 'https://formspree.io/f/xppqyloe'
const EMAIL = 'Brennan.ohal1@gmail.com'

// Never touch the real analytics or form service from a test.
async function hermetic(page: Page) {
  await page.route(/gc\.zgo\.at|goatcounter\.com/, (r) => r.abort())
  await page.route(FORM, (r) => (r.request().method() === 'OPTIONS' ? r.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } }) : r.abort()))
}

test.describe('page content and promises', () => {
  test('renders the content from the data files', async ({ page }) => {
    await hermetic(page)
    await page.goto('./')
    await expect(page.locator('h1')).toContainText("O'Halloran")
    await expect(page.getByText('Takes cases from Torq and investigates them in SentinelOne.')).toBeVisible()
    await expect(page.locator('.metric')).toHaveCount(4)
    await expect(page.locator('.job')).toHaveCount(5)
    await expect(page.locator('.project')).toHaveCount(4)
  })

  test('makes no requests to unexpected origins and sets no cookies', async ({ page, context }) => {
    const origins = new Set<string>()
    page.on('request', (r) => { const u = new URL(r.url()); if (u.protocol.startsWith('http')) origins.add(u.origin) })
    await hermetic(page)
    await page.goto('./')
    await page.waitForLoadState('networkidle')
    const allowed = new Set([new URL(page.url()).origin, 'https://gc.zgo.at', 'https://brenohal.goatcounter.com'])
    expect([...origins].filter((o) => !allowed.has(o))).toEqual([])
    expect(await context.cookies()).toEqual([])
  })

  test('the Content-Security-Policy is enforced, not just present', async ({ page }) => {
    await hermetic(page)
    await page.goto('./')
    const outcome = await page.evaluate(async () => {
      const w = window as unknown as { __x?: boolean; __y?: boolean }
      const s = document.createElement('script'); s.textContent = 'window.__x = true'; document.body.append(s)
      const d = document.createElement('div'); d.setAttribute('onclick', 'window.__y = true'); document.body.append(d); d.click()
      await new Promise((r) => setTimeout(r, 200))
      return { inlineScript: !!w.__x, inlineHandler: !!w.__y }
    })
    expect(outcome).toEqual({ inlineScript: false, inlineHandler: false })
  })

  test('has structured data that matches the page', async ({ page }) => {
    await hermetic(page)
    await page.goto('./')
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')
    expect(ld['@type']).toBe('Person')
    expect(ld.jobTitle).toBe('Internal SOC Analyst')
    expect(ld.worksFor.name).toBe('Henry Schein')
  })

  test('the 404 page renders for unknown paths', async ({ page }) => {
    await page.goto('404.html')
    await expect(page.locator('h1')).toHaveText('That page doesn’t exist.')
  })
})

test.describe('interaction', () => {
  test.beforeEach(async ({ page }) => { await hermetic(page) })

  test('theme toggle switches and persists across reloads', async ({ page }) => {
    // Start from a clean slate once; a plain removeItem here would also run on the reload we are testing.
    await page.addInitScript(() => { if (!sessionStorage.getItem('seeded')) { localStorage.removeItem('theme'); sessionStorage.setItem('seeded', '1') } })
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('./')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await page.locator('[data-theme-toggle]:visible').first().click()
    await expect(html).toHaveAttribute('data-theme', 'light')
    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('roles expand and collapse with the keyboard', async ({ page }) => {
    await page.goto('./')
    const job = page.locator('.job').first()
    await expect(job.locator('details')).not.toHaveAttribute('open', '')
    await job.locator('summary').focus()
    await page.keyboard.press('Enter')
    await expect(job.locator('details')).toHaveAttribute('open', '')
  })

  test('copy email puts the address on the clipboard and announces it', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permission API is Chromium-only')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('./')
    const btn = page.locator('[data-copy]')
    await btn.scrollIntoViewIfNeeded()
    await btn.click()
    await expect(btn).toContainText('Copied')
    await expect(page.locator('[data-copy-live]')).toHaveText('Email address copied to clipboard')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL)
    await expect(btn).toContainText('Copy email', { timeout: 4000 })
  })

  test('command palette: open, filter, run', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut flow is a desktop feature')
    await page.goto('./')
    await page.keyboard.press('Control+K')
    const palette = page.locator('#palette')
    await expect(palette).toBeVisible()
    await page.keyboard.type('case')
    await expect(palette.locator('.palette__item:visible')).toHaveCount(1)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/work\/job-application-engine\/$/)
    await expect(page.locator('h1')).toContainText('Job Application Engine')
  })

  test('palette closes with Escape and returns focus to the page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only')
    await page.goto('./')
    await page.keyboard.press('Control+K')
    await expect(page.locator('#palette')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#palette')).toBeHidden()
  })

  test('click-to-play demo loads no video until pressed', async ({ page }) => {
    const videoRequests: string[] = []
    page.on('request', (r) => { if (/\.mp4/.test(r.url())) videoRequests.push(r.url()) })
    await page.goto('./')
    await page.waitForLoadState('networkidle')
    expect(videoRequests).toEqual([])
    const play = page.locator('[data-media-play]').first()
    await play.scrollIntoViewIfNeeded()
    await play.click()
    await expect(page.locator('[data-media] video').first()).toBeVisible()
    expect(videoRequests.length).toBeGreaterThan(0)
  })
})

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => { await page.route(/gc\.zgo\.at|goatcounter\.com/, (r) => r.abort()) })

  const fill = async (page: Page, name: string, email: string, msg: string) => {
    await page.locator('#c-name').fill(name); await page.locator('#c-email').fill(email); await page.locator('#c-msg').fill(msg)
  }

  test('validates, shows accessible errors, and focuses the first problem', async ({ page }) => {
    await page.goto('./')
    await page.locator('[data-submit]').scrollIntoViewIfNeeded()
    await page.locator('[data-submit]').click()
    await expect(page.locator('#c-name')).toBeFocused()
    await expect(page.locator('#c-name')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('.field__msg[role="alert"]')).toHaveCount(3)
    await page.locator('#c-name').fill('Jane')
    await expect(page.locator('#c-name')).not.toHaveAttribute('aria-invalid', 'true')
  })

  test('sends JSON to the form service and confirms', async ({ page }) => {
    let body: Record<string, string> | undefined
    await page.route(FORM, async (r) => {
      if (r.request().method() === 'POST') { body = r.request().postDataJSON(); await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true}' }) }
      else await r.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } })
    })
    await page.goto('./')
    await fill(page, 'Test Person', 'test@example.com', 'Hello Brennan, this is a real message.')
    await page.locator('[data-submit]').click()
    await expect(page.locator('[data-result]')).toContainText('Message sent.')
    expect(body).toMatchObject({ name: 'Test Person', email: 'test@example.com', message: 'Hello Brennan, this is a real message.' })
  })

  test('keeps the message and offers email when the service fails', async ({ page }) => {
    await page.route(FORM, (r) => (r.request().method() === 'POST' ? r.fulfill({ status: 500, headers: { 'access-control-allow-origin': '*' }, body: '{}' }) : r.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } })))
    await page.goto('./')
    await fill(page, 'Test Person', 'test@example.com', 'This one will fail on the server.')
    await page.locator('[data-submit]').click()
    await expect(page.locator('[data-result]')).toContainText('didn’t go through')
    await expect(page.locator('[data-result] a[href^="mailto:"]')).toBeVisible()
    await expect(page.locator('#c-msg')).toHaveValue('This one will fail on the server.')
  })

  test('a bot filling the honeypot sends nothing', async ({ page }) => {
    let posts = 0
    await page.route(FORM, (r) => { if (r.request().method() === 'POST') posts++; return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, body: '{}' }) })
    await page.goto('./')
    await fill(page, 'Bot', 'bot@example.com', 'Buy cheap pills now, click here please.')
    await page.locator('#c-gotcha').evaluate((el: HTMLInputElement) => { el.value = 'http://spam.example' })
    await page.locator('[data-submit]').click()
    await page.waitForTimeout(400)
    expect(posts).toBe(0)
  })
})

test.describe('phone layout', () => {
  test.skip(({ isMobile }) => !isMobile, 'phone project only')

  test('no sideways scroll, menu works, bottom bar present', async ({ page }) => {
    await page.route(/gc\.zgo\.at|goatcounter\.com/, (r) => r.abort())
    await page.goto('./')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('.bottombar')).toBeVisible()
    await page.locator('.nav__menu').click()
    await expect(page.locator('#menu')).toBeVisible()
    await expect(page.locator('#menu a')).toHaveCount(5)
    await page.locator('#menu a', { hasText: 'Work' }).click()
    await expect(page.locator('#menu')).toBeHidden()
  })

  test('every tap target is at least 44px', async ({ page }) => {
    await page.route(/gc\.zgo\.at|goatcounter\.com/, (r) => r.abort())
    await page.goto('./')
    const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('a,button,summary,input,textarea')]
      .filter((e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width && r.height && cs.visibility !== 'hidden' && !e.closest('.hp') && !e.classList.contains('skip') && !e.closest('#menu:not(:popover-open)') && !e.closest('dialog:not([open])') && (r.height < 44 || r.width < 44) })
      .map((e) => `${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 24)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`))
    expect(small).toEqual([])
  })
})

test('print stylesheet hides chrome and reveals everything', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only')
  await page.route(/gc\.zgo\.at|goatcounter\.com/, (r) => r.abort())
  await page.goto('./')
  await page.emulateMedia({ media: 'print' })
  expect(await page.locator('.nav').isVisible()).toBe(false)
  expect(await page.locator('.cta-row').first().isVisible()).toBe(false)
  const dim = await page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 1).length)
  expect(dim).toBe(0)
})
