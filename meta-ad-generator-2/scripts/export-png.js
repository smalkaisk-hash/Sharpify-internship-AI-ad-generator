/**
 * PNG Exporter — Converts HTML ad files to 1080x1080 PNG images
 *
 * Usage:
 *   Single file:  node scripts/export-png.js path/to/ad.html output/png/
 *   Batch (dir):  node scripts/export-png.js path/to/html-dir/ output/png/
 *
 * The script opens each HTML file in a headless browser at 1080x1080 viewport
 * and takes a pixel-perfect screenshot.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputDir = process.argv[3] || './output/png';

if (!inputPath) {
  console.error('Usage: node export-png.js <html-file-or-directory> [output-directory]');
  process.exit(1);
}

// Enforce copy validation gate: refuse to export if validate-copy.js hasn't passed
// Stamp is written by validate-copy.js into the sibling copy/ directory
const htmlDir = path.resolve(inputPath);
const clientRoot = path.resolve(htmlDir, '..'); // html/../ = client root
const stampPath = path.join(clientRoot, 'copy', '.copy-validated');
if (!fs.existsSync(stampPath)) {
  console.error('\n  BLOCKED: Copy has not been validated.');
  console.error('  Run first:  node scripts/validate-copy.js clients/output/{slug}/copy/ad-copy.json');
  console.error('  Fix all errors, then re-run this export.\n');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

/**
 * Get all HTML files from input — supports single file or directory
 */
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

/**
 * Export a single HTML file to PNG
 */
async function exportToPng(page, htmlPath, pngPath) {
  const absolutePath = path.resolve(htmlPath);
  const fileUrl = `file://${absolutePath.replace(/\\/g, '/')}`;

  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Additional wait for any images/transitions
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: pngPath,
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1080,
      height: 1080
    }
  });

  const stats = fs.statSync(pngPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`  Exported: ${path.basename(pngPath)} (${sizeMB} MB)`);
}

async function main() {
  const htmlFiles = getHtmlFiles(inputPath);
  console.log(`\nExporting ${htmlFiles.length} ad(s) to PNG...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-device-scale-factor=1',
      '--window-size=1080,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1
  });

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
