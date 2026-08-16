import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const OUT = '/tmp/sidebar-audit';
const BASE = 'http://localhost:3001';
const WS = '87a68e61-acf8-4798-a920-123b9a1bf829';
const login = JSON.parse(readFileSync('/tmp/sidebar-audit/login.json', 'utf8'));

const browser = await chromium.launch();
try {
  for (const [theme, mode] of [['turtletime', 'light'], ['turtletime-dark', 'dark']]) {
    for (const [w, tag] of [[1280, 'desktop'], [390, 'narrow']]) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(
        ({ login, WS, theme }) => {
          localStorage.setItem('tides_access_token', login.access);
          localStorage.setItem('tides_refresh_token', login.refresh);
          localStorage.setItem('tides_active_workspace_id', WS);
          localStorage.setItem('tides-theme', theme);
        },
        { login, WS, theme },
      );
      await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
      await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(800);

      const signOut = page.locator('[data-test="sidebar-user-menu-visible-sign-out"]').first();
      const found = await signOut.isVisible().catch(() => false);
      if (found && w >= 1280) {
        const row = signOut.locator('xpath=..');
        await row.screenshot({ path: `${OUT}/tides-real-${tag}-${mode}.png`, scale: 'device' });
      } else {
        // Narrow width: sidebar becomes a mobile header; capture the avatar chrome.
        const avatar = page.locator('[data-test="mobile-header-profile-trigger"], [aria-label="Account menu"]').first();
        const ok = await avatar.isVisible().catch(() => false);
        if (ok) await avatar.screenshot({ path: `${OUT}/tides-real-${tag}-${mode}.png`, scale: 'device' });
        else await page.screenshot({ path: `${OUT}/tides-real-${tag}-${mode}-full.png` });
      }
      await page.close();
    }
  }
  console.log('done');
} finally {
  await browser.close();
}
