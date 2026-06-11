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
const skipDeadZone = process.argv.includes('--skip-dead-zone');

if (!inputPath) {
  console.error('Usage: node export-png.js <html-file-or-directory> [output-directory] [--skip-dead-zone]');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

/**
 * Check for duplicate generated images across HTML files.
 * Each ad in a batch must use a unique photo — sharing images weakens visual variety.
 * Returns an array of [imageBasename, [htmlFile, ...]] pairs where the list has > 1 entry.
 */
function checkDuplicateImages(htmlFiles) {
  const imageToFiles = new Map();

  for (const htmlPath of htmlFiles) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const srcs = [...html.matchAll(/\bsrc="([^"]+)"/g)].map(m => m[1]);
    for (const src of srcs) {
      const base = path.basename(src);
      // Only flag generated AI images — skip logos, favicons, fonts, etc.
      if (!/generated.*\.jpe?g$/i.test(base) && !/generated.*\.png$/i.test(base)) continue;
      if (!imageToFiles.has(base)) imageToFiles.set(base, []);
      const htmlName = path.basename(htmlPath);
      if (!imageToFiles.get(base).includes(htmlName)) {
        imageToFiles.get(base).push(htmlName);
      }
    }
  }

  return [...imageToFiles.entries()].filter(([, files]) => files.length > 1);
}

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
 * Analyse vertical content distribution on the rendered page.
 *
 * Divides the 1080px canvas into BANDS horizontal slices and marks each
 * slice as occupied if any non-background content element intersects it.
 * Returns fill% and the largest internal empty gap.
 */
async function analyzeContentDistribution(page) {
  return page.evaluate(() => {
    const H = 1080, W = 1080;
    const BANDS = 18;           // ~60px per band
    const bandH = H / BANDS;
    const occupied = new Array(BANDS).fill(false);

    for (const el of document.querySelectorAll('*')) {
      const rect = el.getBoundingClientRect();

      // Skip zero-size elements
      if (rect.width < 8 || rect.height < 2) continue;

      // Skip full-bleed overlays (photo, fade, ui wrapper)
      if (rect.width >= W * 0.92 && rect.height >= H * 0.45) continue;

      const st = window.getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden') continue;
      if (parseFloat(st.opacity || '1') < 0.04) continue;

      // Count element if it carries direct text, is a media element,
      // has a solid non-transparent background (small elements only), or has a border
      const hasOwnText = Array.from(el.childNodes)
        .some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
      const isMedia = el.tagName === 'IMG' || el.tagName === 'SVG';
      const bg = st.backgroundColor;
      const hasSolidBg = bg
        && bg !== 'rgba(0, 0, 0, 0)'
        && bg !== 'transparent'
        && rect.height < 300;
      const hasBorder = st.borderTopStyle !== 'none' && st.borderTopWidth !== '0px';

      if (!hasOwnText && !isMedia && !hasSolidBg && !hasBorder) continue;

      // Mark every band this element overlaps
      const topBand = Math.max(0, Math.floor(rect.top / bandH));
      const botBand = Math.min(BANDS - 1, Math.floor(rect.bottom / bandH));
      for (let i = topBand; i <= botBand; i++) occupied[i] = true;
    }

    // Find the largest consecutive empty run, ignoring the very top and bottom band
    // (small padding gaps there are expected and intentional)
    let maxRun = 0, runLen = 0, runStart = -1, maxStart = -1;
    for (let i = 1; i < BANDS - 1; i++) {
      if (!occupied[i]) {
        if (runLen === 0) runStart = i;
        runLen++;
        if (runLen > maxRun) { maxRun = runLen; maxStart = runStart; }
      } else {
        runLen = 0;
      }
    }

    const filled = occupied.filter(Boolean).length;
    return {
      fillPct:    Math.round(filled / BANDS * 100),
      gapPx:      Math.round(maxRun * bandH),
      gapStartPx: maxStart >= 0 ? Math.round(maxStart * bandH) : -1,
      bands:      occupied.map(Number).join(''),
    };
  });
}

/**
 * Export a single HTML file to PNG
 */
async function exportToPng(page, htmlPath, pngPath) {
  const absolutePath = path.resolve(htmlPath);
  const fileUrl = `file://${absolutePath.replace(/\\/g, '/')}`;

  // Check for photo-dominant marker before opening — suppresses known false-positive dead-zone warnings
  const htmlContent = fs.readFileSync(absolutePath, 'utf8');
  const isPhotoDominant = htmlContent.includes('<!-- photo-dominant -->');

  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 });

  // Wait for fonts + force-load Latvian unicode-range subsets before screenshot.
  // document.fonts.ready alone resolves before subset files finish downloading.
  await page.evaluate(async () => {
    await document.fonts.ready;
    const LV = 'āēīūģķļņšžĀĒĪŪĢĶĻŅŠŽčČ';
    const loads = [];
    for (const ff of document.fonts) {
      loads.push(document.fonts.load(`${ff.style} ${ff.weight} 24px "${ff.family}"`, LV));
    }
    await Promise.allSettled(loads);
  });

  // Additional wait for any images/transitions
  await new Promise(r => setTimeout(r, 500));

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

  // Layout health check — page is still loaded so we can query the DOM
  const dist = await analyzeContentDistribution(page);
  const warns = [];

  if (!isPhotoDominant && !skipDeadZone && dist.gapPx > 190 && dist.gapStartPx > 50 && dist.gapStartPx < 900) {
    warns.push(`dead zone ${dist.gapPx}px at y≈${dist.gapStartPx}`);
  } else if ((isPhotoDominant || skipDeadZone) && dist.gapPx > 190) {
    // Silently skip — photo-dominant layouts are expected to trigger this check
  }
  if (dist.fillPct < 55) {
    warns.push(`sparse layout: content fills only ${dist.fillPct}%`);
  }

  const sizeMB = (fs.statSync(pngPath).size / 1024 / 1024).toFixed(2);
  const warnStr = warns.length ? `  ⚠  ${warns.join(' · ')}` : `  ✓ ${dist.fillPct}% fill`;
  console.log(`  Exported: ${path.basename(pngPath)} (${sizeMB} MB)${warnStr}`);
}

async function main() {
  const htmlFiles = getHtmlFiles(inputPath);

  // Pre-export guard: every ad must use a unique generated image
  if (htmlFiles.length > 1) {
    const dups = checkDuplicateImages(htmlFiles);
    if (dups.length > 0) {
      console.error('\n⚠  Duplicate generated images detected — each ad should use a unique photo:\n');
      for (const [img, files] of dups) {
        console.error(`   ${img}  →  used by: ${files.join(', ')}`);
      }
      console.error('\nAssign unique images to all ads before exporting. Aborting.\n');
      process.exit(1);
    }
  }

  console.log(`\nExporting ${htmlFiles.length} ad(s) to PNG...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-device-scale-factor=2',
      '--window-size=2160,2160'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 2
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
