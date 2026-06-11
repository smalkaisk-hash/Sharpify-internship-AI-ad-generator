/**
 * Debug: dump page HTML after Load more clicks so we can see the real DOM structure.
 */
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const url = process.argv[2] || 'https://www.figma.com/color-palettes/pastel/';

async function debug() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click load more once
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button, a, [role="button"]')]
      .find(el => /load\s*more/i.test(el.textContent.trim()));
    if (btn) { btn.scrollIntoView(); btn.click(); return btn.outerHTML; }
    return null;
  });
  console.log('Load more button HTML:', clicked);
  await new Promise(r => setTimeout(r, 2000));

  // Dump a sample of the body HTML
  const info = await page.evaluate(() => {
    // Find any elements that look like color swatches
    const hexRe = /#?[0-9A-Fa-f]{6}/g;
    const allText = document.body.innerText;
    const allHexes = [...new Set(allText.match(hexRe) || [])];

    // Also try data attributes
    const dataAttrs = [...document.querySelectorAll('[data-color],[data-hex],[data-value],[style*="background"]')]
      .slice(0, 20)
      .map(el => ({ tag: el.tagName, data: el.dataset, style: el.getAttribute('style'), text: el.textContent.trim().slice(0, 50) }));

    // Sample of inner text around hex-like patterns
    const bodySnippet = document.body.innerHTML.slice(0, 5000);

    // Look for any element with a class containing "color", "swatch", "palette", "hex"
    const colorEls = [...document.querySelectorAll('[class*="color"],[class*="swatch"],[class*="palette"],[class*="hex"],[class*="chip"]')]
      .slice(0, 20)
      .map(el => ({ tag: el.tagName, className: el.className, text: el.textContent.trim().slice(0, 80) }));

    return { allHexes: allHexes.slice(0, 50), dataAttrs, bodySnippet, colorEls };
  });

  console.log('\nHex-like strings found in page text:', info.allHexes);
  console.log('\nColor-related elements (first 20):', JSON.stringify(info.colorEls, null, 2));
  console.log('\nData-attr elements (first 20):', JSON.stringify(info.dataAttrs, null, 2));
  writeFileSync('debug-page.html', info.bodySnippet);
  console.log('\nBody HTML snippet saved to debug-page.html');

  await browser.close();
}

debug().catch(console.error);
