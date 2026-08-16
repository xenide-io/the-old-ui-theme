import { chromium } from '@playwright/test';

const OUT = '/tmp/sidebar-audit';
const URL = 'http://localhost:3130/demo/suite';

// Exact "before" classes taken from the pre-fix suite-user-menu.tsx. These
// classes are also used by demo-shell.tsx, so Tailwind has compiled them.
const OLD_ROW = 'flex min-w-0 items-center gap-2';
const OLD_AVATAR_WRAP =
  'inline-flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-ph-border ring-offset-1 ring-offset-ph-canvas transition-colors hover:bg-ph-muted';
const OLD_FALLBACK =
  'flex h-10 w-10 items-center justify-center rounded-full bg-ph-muted text-sm font-semibold text-ph-brand';

async function findRow(page) {
  // The showSignOutAction row: parent of the visible sign-out button.
  const signOut = page.locator('[data-test="suite-user-menu-visible-sign-out"]').first();
  await signOut.waitFor({ state: 'visible', timeout: 15000 });
  return signOut.locator('xpath=..');
}

async function toOld(page) {
  await page.evaluate(
    ({ OLD_ROW, OLD_AVATAR_WRAP, OLD_FALLBACK }) => {
      const btn = document.querySelector('[data-test="suite-user-menu-visible-sign-out"]');
      if (!btn) return;
      const row = btn.parentElement;
      row.className = OLD_ROW;
      const trigger = row.querySelector('[aria-label="Account menu"]');
      const wrap = trigger?.querySelector('span');
      if (wrap) {
        wrap.className = OLD_AVATAR_WRAP;
        const fallback = wrap.querySelector('span');
        if (fallback) fallback.className = OLD_FALLBACK;
      }
    },
    { OLD_ROW, OLD_AVATAR_WRAP, OLD_FALLBACK },
  );
}

async function shot(row, file) {
  await row.screenshot({ path: `${OUT}/${file}`, scale: 'device' });
}

const browser = await chromium.launch();
try {
  for (const theme of ['turtletime', 'turtletime-dark']) {
    const mode = theme.includes('dark') ? 'dark' : 'light';
    // Desktop
    const desk = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await desk.goto(URL, { waitUntil: 'networkidle' });
    await desk.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
    await desk.evaluate(() => document.fonts.ready);
    let row = await findRow(desk);
    await shot(row, `after-desktop-${mode}.png`);
    await toOld(desk);
    row = await findRow(desk);
    await shot(row, `before-desktop-${mode}.png`);
    await desk.close();
  }

  // Narrow (phone) width: the sidebar footer row is only ~176px wide inside a
  // mobile drawer. Force that width to prove the row layout holds — avatar
  // pinned left, logout pinned right, both 44px hit targets.
  for (const theme of ['turtletime', 'turtletime-dark']) {
    const mode = theme.includes('dark') ? 'dark' : 'light';
    const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await m.goto(URL, { waitUntil: 'networkidle' });
    await m.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
    await m.evaluate(() => document.fonts.ready);
    // Reveal + isolate the showSignOutAction row and constrain it to 176px.
    const box = await m.evaluate(() => {
      const btn = document.querySelector('[data-test="suite-user-menu-visible-sign-out"]');
      if (!btn) return null;
      const row = btn.parentElement;
      const holder = document.createElement('div');
      holder.id = 'narrow-probe';
      holder.style.cssText =
        'position:fixed;top:16px;left:16px;width:176px;z-index:9999;padding:12px;';
      holder.className = 'bg-ph-surface border border-ph-border rounded-lg';
      document.body.appendChild(holder);
      holder.appendChild(row);
      const r = document.getElementById('narrow-probe').getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    if (box) {
      await m.locator('#narrow-probe').screenshot({ path: `${OUT}/after-narrow-${mode}.png`, scale: 'device' });
    }
    await m.close();
  }
  console.log('done');
} finally {
  await browser.close();
}
