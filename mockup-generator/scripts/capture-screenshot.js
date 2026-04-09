/**
 * Website Screenshot Capture — Takes desktop, mobile, and tablet screenshots
 *
 * Usage:
 *   node scripts/capture-screenshot.js <url> <output-dir>
 *   node scripts/capture-screenshot.js https://sharpify.lv output/sharpify/screenshots/
 *   node scripts/capture-screenshot.js https://sharpify.lv output/sharpify/screenshots/ --full-page
 *
 * Outputs:
 *   desktop.png  — 1440x900 viewport
 *   mobile.png   — 390x844 viewport (iPhone 14 Pro)
 *   tablet.png   — 820x1180 viewport (iPad)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flags = {};
const positional = [];

for (const arg of args) {
  if (arg.startsWith('--')) {
    flags[arg.slice(2)] = true;
  } else {
    positional.push(arg);
  }
}

const url = positional[0];
const outputDir = positional[1] || './output/screenshots';
const fullPage = !!flags['full-page'];

if (!url) {
  console.error('Usage: node capture-screenshot.js <url> [output-dir] [--full-page]');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 820, height: 1180, mobile: true },
];

async function captureScreenshot(page, viewport, outputPath) {
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 2,
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  const screenshotOptions = {
    path: outputPath,
    type: 'png',
  };

  if (fullPage) {
    screenshotOptions.fullPage = true;
  } else {
    screenshotOptions.clip = {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    };
  }

  await page.screenshot(screenshotOptions);

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`  ${viewport.name}: ${viewport.width}x${viewport.height} → ${path.basename(outputPath)} (${sizeMB} MB)`);
}

async function main() {
  console.log(`\nCapturing screenshots of: ${url}`);
  console.log(`  Full page: ${fullPage ? 'yes' : 'no (above-fold only)'}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Block unnecessary resources for faster loading
  await page.setRequestInterception(true);
  page.on('request', req => {
    const type = req.resourceType();
    if (['media', 'websocket'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const viewport of viewports) {
    const outputPath = path.join(outputDir, `${viewport.name}.png`);
    try {
      await captureScreenshot(page, viewport, outputPath);
    } catch (err) {
      console.error(`  FAILED (${viewport.name}): ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to: ${path.resolve(outputDir)}`);
}

main().catch(err => {
  console.error('Capture failed:', err.message);
  process.exit(1);
});
