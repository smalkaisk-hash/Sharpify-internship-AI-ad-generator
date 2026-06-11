import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function exportPngs(htmlFiles, outputDir) {
  console.log('\nStep 5: Exporting to PNG...');

  mkdirSync(resolve(outputDir, 'png'), { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const pngFiles = [];

  try {
    for (const { filename, filepath, index } of htmlFiles) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

      const fileUrl = pathToFileURL(resolve(filepath)).href;
      await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30_000 });

      // Wait for Google Fonts to load
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 600));

      const pngFilename = filename.replace('.html', '.png');
      const pngPath = resolve(outputDir, 'png', pngFilename);

      await page.screenshot({
        path: pngPath,
        clip: { x: 0, y: 0, width: 1080, height: 1080 },
      });

      await page.close();
      pngFiles.push({ filename: pngFilename, filepath: pngPath, index });
      console.log(`  Exported: png/${pngFilename}`);
    }
  } finally {
    await browser.close();
  }

  return pngFiles;
}

// Standalone: node src/steps/5-export.js <client-slug>  OR  <absolute-path>
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  if (!arg) { console.error('Usage: node src/steps/5-export.js <client-slug>'); process.exit(1); }

  // Accept either a slug (changer-club) or an absolute/relative path
  const __dirname2 = dirname(fileURLToPath(import.meta.url));
  const isSlug = !arg.includes('/') && !arg.includes('\\');
  const outputDir = isSlug
    ? resolve(__dirname2, `../../clients/${arg}/output`)
    : resolve(arg);

  const htmlDir = resolve(outputDir, 'html');

  const htmlFiles = readdirSync(htmlDir)
    .filter(f => f.endsWith('.html'))
    .sort()
    .map((filename, i) => ({
      filename,
      filepath: join(htmlDir, filename),
      index: i + 1,
    }));

  console.log(`Re-exporting ${htmlFiles.length} HTML files from ${htmlDir}`);
  exportPngs(htmlFiles, outputDir).catch(console.error);
}
