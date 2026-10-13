import { defineConfig, devices } from '@playwright/test'

const PORT = 4321
const BASE = `http://localhost:${PORT}/brennan-resume/`
// In CI Playwright installs its own Chromium; locally we reuse the Chrome that is already installed.
const channel = process.env.CI ? undefined : 'chrome'

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: BASE, trace: 'retain-on-failure' },
  // Serves the already-built dist/ (run `npm run build` first; CI does).
  webServer: { command: `npx astro preview --port ${PORT}`, url: BASE, reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], channel } },
  ],
})
