// Screenshot sharpify.io/lv hero, saved into public/images/
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = 'public/images/sharpify-site-hero.png';
fs.mkdirSync('public/images', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto('https://sharpify.io/lv', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(6000);
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log('saved', OUT);
await browser.close();
