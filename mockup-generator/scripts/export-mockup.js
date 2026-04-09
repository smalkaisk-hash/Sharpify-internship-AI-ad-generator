/**
 * Mockup PNG Exporter — Converts HTML mockup files to high-res PNG images
 *
 * Usage:
 *   Single file:  node scripts/export-mockup.js path/to/mockup.html output/png/
 *   Batch (dir):  node scripts/export-mockup.js path/to/html-dir/ output/png/
 *   Custom size:  node scripts/export-mockup.js mockup.html output/ --size=1920x1080
 *   High DPI:     node scripts/export-mockup.js mockup.html output/ --scale=2
 *
 * Defaults: 1920x1080 viewport, 2x device scale factor
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// --- Parse CLI args ---
const args = process.argv.slice(2);
const flags = {};
const positional = [];

for (const arg of args) {
  if (arg.startsWith('--')) {
    const [key, val] = arg.slice(2).split('=');
    flags[key] = val;
  } else {
    positional.push(arg);
  }
}

const inputPath = positional[0];
const outputDir = positional[1] || './output/png';
const [width, height] = (flags.size || '1920x1080').split('x').map(Number);
const scale = parseInt(flags.scale || '2', 10);

if (!inputPath) {
  console.error('Usage: node export-mockup.js <html-file-or-directory> [output-directory] [--size=1920x1080] [--scale=2]');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

function getHtmlFiles(inputPath) {
  const resolved = path.resolve(inputPath);
  const stat = fs.statSync(resolved);

  if (stat.isFile() && resolved.endsWith('.html')) {
    return [resolved];
  }

  if (stat.isDirectory()) {
    return fs.readdirSync(resolved)
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(resolved, f))
      .sort();
  }

  console.error(`Input must be an HTML file or directory: ${inputPath}`);
  process.exit(1);
}

async function exportToPng(page, htmlPath, pngPath) {
  const absolutePath = path.resolve(htmlPath);
  const fileUrl = `file://${absolutePath.replace(/\\/g, '/')}`;

  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for fonts and images
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({
    path: pngPath,
    type: 'png',
    clip: { x: 0, y: 0, width, height }
  });

  const stats = fs.statSync(pngPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`  Exported: ${path.basename(pngPath)} (${sizeMB} MB, ${width * scale}x${height * scale}px effective)`);
}

async function main() {
  const htmlFiles = getHtmlFiles(inputPath);
  console.log(`\nExporting ${htmlFiles.length} mockup(s) to PNG...`);
  console.log(`  Viewport: ${width}x${height}, Scale: ${scale}x\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--force-device-scale-factor=${scale}`,
      `--window-size=${width},${height}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: scale });

  for (const htmlPath of htmlFiles) {
    const baseName = path.basename(htmlPath, '.html');
    const pngPath = path.join(outputDir, `${baseName}.png`);

    try {
      await exportToPng(page, htmlPath, pngPath);
    } catch (err) {
      console.error(`  FAILED: ${baseName} — ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! ${htmlFiles.length} PNG(s) saved to: ${path.resolve(outputDir)}`);
}

main().catch(err => {
  console.error('Export failed:', err.message);
  process.exit(1);
});
