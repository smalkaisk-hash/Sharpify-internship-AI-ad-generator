// Record a real click on sharpify.io/lv with a visible cursor.
// Captures vertical 9:16 video of the laptop-style browser window clicking Pieslēgties.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'public/video/click-recording';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Record at 1440x900 laptop-ish viewport. We'll crop to 9:16 in Remotion.
const VIEWPORT = { width: 1440, height: 900 };

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT_DIR, size: VIEWPORT },
});
const page = await ctx.newPage();

await page.goto('https://sharpify.io/lv', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);

// Inject a visible cursor overlay.
await page.evaluate(() => {
  const c = document.createElement('div');
  c.id = '__cursor';
  c.style.cssText = [
    'position:fixed',
    'z-index:2147483647',
    'left:-100px',
    'top:-100px',
    'width:36px',
    'height:36px',
    'pointer-events:none',
    'transition:transform 0.08s linear',
    'filter:drop-shadow(0 4px 10px rgba(0,0,0,0.7))',
  ].join(';');
  c.innerHTML = `
    <svg viewBox="0 0 32 32" width="36" height="36">
      <path d="M5 3 L5 25 L11 19 L16 29 L20 27 L15 17 L23 17 Z"
            fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
  document.body.appendChild(c);

  // Click ripple container
  const r = document.createElement('div');
  r.id = '__ripple';
  r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;left:-100px;top:-100px';
  document.body.appendChild(r);

  (window).__moveCursor = (x, y) => {
    c.style.left = x + 'px';
    c.style.top = y + 'px';
  };
  (window).__ripple = (x, y) => {
    const d = document.createElement('div');
    d.style.cssText = [
      'position:fixed',
      `left:${x}px`,
      `top:${y}px`,
      'width:12px',
      'height:12px',
      'margin-left:-6px',
      'margin-top:-6px',
      'border:4px solid #E8D500',
      'border-radius:50%',
      'pointer-events:none',
      'z-index:2147483646',
      'transform:scale(0.3)',
      'opacity:1',
      'transition:transform 0.6s cubic-bezier(0.2,0.8,0.3,1), opacity 0.6s ease-out',
    ].join(';');
    document.body.appendChild(d);
    requestAnimationFrame(() => {
      d.style.transform = 'scale(8)';
      d.style.opacity = '0';
    });
    setTimeout(() => d.remove(), 700);
  };
});

// Find the Pieslēgties button real position.
const target = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a, button'));
  const match =
    links.find((el) => /pieslēgties|piesl.gties/i.test(el.textContent || '')) ||
    links.find((el) => /izmēģini|demo/i.test(el.textContent || ''));
  if (!match) return null;
  const r = match.getBoundingClientRect();
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    w: r.width,
    h: r.height,
    text: match.textContent?.trim(),
  };
});
console.log('target:', target);

if (!target) {
  console.error('no target button found — dumping top links');
  const list = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a, button'))
      .slice(0, 30)
      .map((el) => (el.textContent || '').trim().slice(0, 40))
      .filter(Boolean)
  );
  console.log(list);
  await browser.close();
  process.exit(1);
}

// Initial cursor position: lower center of the viewport, so it feels natural.
let curX = VIEWPORT.width / 2 + 100;
let curY = VIEWPORT.height - 140;
await page.evaluate(([x, y]) => (window).__moveCursor(x, y), [curX, curY]);
await page.waitForTimeout(800);

// Animate cursor to target with easing, stepwise.
const steps = 50;
const dx = target.x - curX;
const dy = target.y - curY;
for (let i = 1; i <= steps; i++) {
  const p = i / steps;
  const eased = 1 - Math.pow(1 - p, 3);
  const x = curX + dx * eased;
  const y = curY + dy * eased;
  await page.evaluate(([x, y]) => (window).__moveCursor(x, y), [x, y]);
  await page.waitForTimeout(18);
}
await page.waitForTimeout(350);

// Hover tick (simulate hover state on the button)
await page.hover('a:has-text("Pieslēgties"), button:has-text("Pieslēgties")').catch(() => {});
await page.waitForTimeout(400);

// Fire click ripple + real click.
await page.evaluate(([x, y]) => (window).__ripple(x, y), [target.x, target.y]);
await page.waitForTimeout(80);
await page.mouse.click(target.x, target.y);

// Let the navigation / modal breathe.
await page.waitForTimeout(3500);

await page.close();
await ctx.close();
await browser.close();

// Move the produced video to a predictable name.
const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.webm'));
if (files.length) {
  const src = path.join(OUT_DIR, files[0]);
  const dest = path.join('public/video/click-recording.webm');
  fs.renameSync(src, dest);
  console.log('saved', dest);
}
