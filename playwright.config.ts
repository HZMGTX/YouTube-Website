import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const PORT = 4173;

/**
 * The pinned Chromium shipped with the image may not match the revision this
 * Playwright version expects, so point at it explicitly when it is there and fall back
 * to Playwright's own download everywhere else (CI included).
 */
const CHROMIUM = '/opt/pw-browsers/chromium';
const launchOptions = existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    launchOptions,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions } },
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions } },
  ],
  // Tests run against the real exported site, not a dev server.
  webServer: {
    command: 'node scripts/serve.mjs',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
