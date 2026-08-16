import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const OUT = '/tmp/sidebar-audit';
const BASE = 'http://localhost:3001';
const WS = '87a68e61-acf8-4798-a920-123b9a1bf829';
const login = JSON.parse(readFileSync('/tmp/sidebar-audit/login.json', 'utf8'));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
page.setDefaultTimeout(8000);
try {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ({ login, WS }) => {
      localStorage.setItem('tides_access_token', login.access);
      localStorage.setItem('tides_refresh_token', login.refresh);
      localStorage.setItem('tides_active_workspace_id', WS);
      localStorage.setItem('tides-theme', 'turtletime');
    },
    { login, WS },
  );
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await page.evaluate((t) => (document.documentElement.dataset.theme = t), 'turtletime');
  await page.waitForTimeout(1200);

  const info = await page.evaluate(() => {
    const btn = document.querySelector('[data-test="sidebar-user-menu-visible-sign-out"]');
    if (!btn) return { found: false };
    const row = btn.parentElement;
    const trigger = row.querySelector('[aria-label="Account menu"]');
    const wrap = trigger?.querySelector('span');
    const fallback = wrap?.querySelector('span');
    return {
      found: true,
      rowClass: row.className,
      wrapClass: wrap?.className ?? null,
      fallbackClass: fallback?.className ?? null,
      fallbackText: fallback?.textContent ?? null,
      hasImg: !!wrap?.querySelector('img'),
    };
  });
  console.log(JSON.stringify(info));

  const row = page.locator('[data-test="sidebar-user-menu-visible-sign-out"]').first().locator('xpath=..');
  if (await row.isVisible().catch(() => false)) {
    await row.screenshot({ path: `${OUT}/tides-real-row-light.png`, scale: 'device' });
  }
} catch (e) {
  console.log('ERR', String(e).slice(0, 200));
} finally {
  await browser.close();
}
