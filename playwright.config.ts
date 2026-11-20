import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 35000,
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:5175',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npx tsx scripts/dev.mjs',
    env: { PORT: '5175', RESEND_API_KEY: '', ORDER_FROM_EMAIL: '', ORDER_TO_EMAIL: '' },
    url: 'http://127.0.0.1:5175',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
