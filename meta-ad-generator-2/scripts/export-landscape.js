const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputDir = process.argv[3] || './output/png';
const WIDTH = 1280;
const HEIGHT = 720;

fs.mkdirSync(outputDir, { recursive: true });

function getHtmlFiles(inputPath) {
  const resolved = path.resolve(inputPath);
  const stat = fs.statSync(resolved);
  if (stat.isFile() && resolved.endsWith('.html')) return [resolved];
  if (stat.isDirectory()) {
    return fs.readdirSync(resolved)
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(resolved, f))
      .sort();
  }
  process.exit(1);
}

async function exportToPng(page, htmlPath, pngPath) {
  const absolutePath = path.resolve(htmlPath);
  const fileUrl = `file://${absolutePath.replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: pngPath,
    type: 'png',
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT }
  });
  const stats = fs.statSync(pngPath);
  console.log(`  Exported: ${path.basename(pngPath)} (${(stats.size/1024/1024).toFixed(2)} MB)`);
}

async function main() {
  const htmlFiles = getHtmlFiles(inputPath);
  console.log(`\nExporting ${htmlFiles.length} landscape ad(s) at ${WIDTH}x${HEIGHT}...\n`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1', `--window-size=${WIDTH},${HEIGHT}`]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  for (const htmlPath of htmlFiles) {
    const pngPath = path.join(outputDir, path.basename(htmlPath, '.html') + '.png');
    try { await exportToPng(page, htmlPath, pngPath); }
    catch (err) { console.error(`  FAILED: ${err.message}`); }
  }
  await browser.close();
  console.log(`\nDone!`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
