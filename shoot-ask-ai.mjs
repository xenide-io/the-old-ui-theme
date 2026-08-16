// Temporary screenshot driver for the Ask AI panel redesign. Delete when done.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const phase = process.argv[2] ?? 'after';
const base = `${process.env.SHOOT_BASE ?? 'http://localhost:3130'}/visual-tests/ask-ai`;
const outDir = `/tmp/chat-redesign/${phase}`;
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const themes = [
  { name: 'light', id: 'hedgehog-light' },
  { name: 'dark', id: 'turtletime-dark' },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  for (const theme of themes) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();

    const shot = async (name) => {
      await page.waitForTimeout(600);
      const file = `${outDir}/${name}-${vp.name}-${theme.name}.png`;
      await page.screenshot({ path: file });
      console.log(file);
    };

    const goto = async (fixture) => {
      await page.goto(`${base}?fixture=${fixture}&theme=${theme.id}`);
      await page.waitForSelector('[data-test="suite-ask-ai-panel"]');
      await page.waitForTimeout(900);
    };

    // 1. Empty state
    await goto('empty');
    await shot('01-empty');

    // 2. Conversation with a code block
    await goto('convo');
    await shot('02-conversation');

    // 3. Streaming / thinking state
    await page.fill('[data-test="ask-ai-input"]', 'Draft the client update.');
    await page.click('[data-test="ask-ai-send"]');
    await page.waitForTimeout(500);
    await shot('03-streaming');

    // 4. Error state
    await goto('error');
    await page.fill('[data-test="ask-ai-input"]', 'Draft the client update.');
    await page.click('[data-test="ask-ai-send"]');
    await page.waitForTimeout(900);
    await shot('04-error');

    await ctx.close();
  }
}

await browser.close();
