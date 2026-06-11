/**
 * Logo Size Optimizer
 *
 * Tests multiple logo heights for each HTML ad and picks the size where the
 * rendered logo width best aligns with the headline width (ratio closest to 1.0).
 *
 * Usage:
 *   node scripts/find-logo-size.js path/to/html-dir/ [--apply]
 *
 * Without --apply: prints a report only.
 * With --apply:    patches each HTML file in-place with the optimal height.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const inputDir = process.argv[2];
const applyChanges = process.argv.includes('--apply');

if (!inputDir) {
  console.error('Usage: node find-logo-size.js <html-directory> [--apply]');
  process.exit(1);
}

const SIZES = [72, 88, 104, 116, 130, 148, 164];

// CSS selectors that could be a logo image — tries each in order
const LOGO_SELECTORS = [
  '.logo img',
  '.logo-float img',
  '.logo-zone img',
  'img[alt]',
];

// CSS selectors for the headline — tries each in order, picks widest match
const HEADLINE_SELECTORS = [
  '.hd',
  '.headline',
  'h1',
  'h2',
  '.big-num',
  '.title',
];

function getHtmlFiles(dir) {
  const resolved = path.resolve(dir);
  return fs.readdirSync(resolved)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(resolved, f))
    .sort();
}

async function measureAtSize(page, fileUrl, logoSize) {
  // Inject override before page renders
  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 });

  // Force the logo height via injected style override
  await page.addStyleTag({
    content: `
      .logo img, .logo-float img, .logo-zone img, img[alt] {
        height: ${logoSize}px !important;
        max-width: 400px !important;
        width: auto !important;
      }
    `
  });

  // Wait for fonts
  await page.evaluate(async () => {
    await document.fonts.ready;
    const LV = 'āēīūģķļņšžĀĒĪŪĢĶĻŅŠŽčČ';
    const loads = [];
    for (const ff of document.fonts) {
      loads.push(document.fonts.load(`${ff.style} ${ff.weight} 24px "${ff.family}"`, LV));
    }
    await Promise.allSettled(loads);
  });

  return page.evaluate((logoSelectors, headlineSelectors) => {
    // Find logo element
    let logoEl = null;
    for (const sel of logoSelectors) {
      logoEl = document.querySelector(sel);
      if (logoEl) break;
    }

    // Find widest headline element
    let headlineEl = null;
    let maxW = 0;
    for (const sel of headlineSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        const w = el.getBoundingClientRect().width;
        if (w > maxW) { maxW = w; headlineEl = el; }
      }
    }

    const logoW = logoEl ? Math.round(logoEl.getBoundingClientRect().width) : 0;
    const headW = headlineEl ? Math.round(headlineEl.getBoundingClientRect().width) : 0;

    return { logoW, headW };
  }, LOGO_SELECTORS, HEADLINE_SELECTORS);
}

// Replace the first occurrence of height:\d+px on a logo img rule
function patchLogoHeight(html, newHeight) {
  // Handles both CSS rule forms and inline style on the img tag
  return html
    // CSS rule: .logo img{height:80px; or .logo-float img{height:80px;
    .replace(/(\.logo(?:-float|-zone)?\s*img\s*\{[^}]*?)height:\s*\d+px/g,
      `$1height:${newHeight}px`)
    // Inline style on img: style="height:80px;..."
    .replace(/(<img\b[^>]*style="[^"]*?)height:\s*\d+px/g,
      `$1height:${newHeight}px`);
}

async function processFile(page, htmlPath) {
  const absolutePath = path.resolve(htmlPath);
  const fileUrl = `file://${absolutePath.replace(/\\/g, '/')}`;
  const name = path.basename(htmlPath);

  const results = [];

  for (const size of SIZES) {
    const { logoW, headW } = await measureAtSize(page, fileUrl, size);
    const ratio = headW > 0 ? logoW / headW : 0;
    results.push({ size, logoW, headW, ratio });
  }

  // Pick size where ratio is closest to 1.0; on ties prefer smaller size
  const best = results.reduce((a, b) => {
    const da = Math.abs(1 - a.ratio), db = Math.abs(1 - b.ratio);
    if (Math.abs(da - db) < 0.02) return a.size < b.size ? a : b;
    return da < db ? a : b;
  });

  // Print table
  console.log(`\n${name}`);
  console.log('  Size   Logo-W  Head-W  Ratio');
  for (const r of results) {
    const marker = r.size === best.size ? ' ◀ optimal' : '';
    console.log(`  ${String(r.size).padEnd(6)} ${String(r.logoW).padEnd(7)} ${String(r.headW).padEnd(7)} ${r.ratio.toFixed(2)}${marker}`);
  }

  if (applyChanges) {
    const original = fs.readFileSync(htmlPath, 'utf8');
    const patched = patchLogoHeight(original, best.size);
    if (patched !== original) {
      fs.writeFileSync(htmlPath, patched, 'utf8');
      console.log(`  ✓ Patched to ${best.size}px`);
    } else {
      console.log(`  — Already at ${best.size}px or pattern not matched`);
    }
  }

  return { name, optimal: best.size, ratio: best.ratio };
}

async function main() {
  const htmlFiles = getHtmlFiles(inputDir);
  if (htmlFiles.length === 0) {
    console.error('No HTML files found in', inputDir);
    process.exit(1);
  }

  console.log(`\nTesting logo sizes [${SIZES.join(', ')}]px across ${htmlFiles.length} ad(s)...\n`);
  if (applyChanges) console.log('--apply flag set: will patch HTML files in-place.\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=2', '--window-size=2160,2160']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  const summary = [];
  for (const htmlPath of htmlFiles) {
    try {
      const result = await processFile(page, htmlPath);
      summary.push(result);
    } catch (err) {
      console.error(`  FAILED: ${path.basename(htmlPath)} — ${err.message}`);
    }
  }

  await browser.close();

  console.log('\n── Summary ──────────────────────────────');
  for (const s of summary) {
    const flag = applyChanges ? ' (applied)' : '';
    console.log(`  ${s.name.padEnd(32)} → ${s.optimal}px  (logo/headline ratio ${s.ratio.toFixed(2)})${flag}`);
  }
  console.log('─────────────────────────────────────────\n');
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
