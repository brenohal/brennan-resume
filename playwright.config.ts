import { defineConfig, devices } from '@playwright/test'

const PORT = 4321
// Point the suite at any deployed URL with BASE_URL (must end in '/'); otherwise it serves the local build.
const LIVE = process.env.BASE_URL
const BASE = LIVE ?? `http://localhost:${PORT}/brennan-resume/`
// In CI Playwright installs its own Chromium; locally we reuse the Chrome that is already installed.
const channel = process.env.CI ? undefined : 'chrome'

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: BASE, trace: 'retain-on-failure' },
  // Serves the already-built dist/ (run `npm run build` first; CI does).
  webServer: LIVE ? undefined : { command: `npx astro preview --port ${PORT}`, url: BASE, reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], channel } },
  ],
})
