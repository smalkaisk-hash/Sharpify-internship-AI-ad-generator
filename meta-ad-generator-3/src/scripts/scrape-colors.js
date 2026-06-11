/**
 * Color Palette Scraper
 * Scrapes hex color codes from a Figma color palette page.
 * Handles "Load more" pagination by clicking until exhausted.
 *
 * Usage: node src/scripts/scrape-colors.js <url> [output.json]
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const url = process.argv[2];
if (!url) { console.error('Usage: node scrape-colors.js <url> [output.json]'); process.exit(1); }

const outputFile = process.argv[3] || 'scraped-colors.json';

async function scrapeColors() {
  console.log(`\nScraping colors from: ${url}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Click "Load more" until it disappears
    let round = 0;
    while (true) {
      const clicked = await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')]
          .find(b => /load\s*more/i.test(b.textContent.trim()));
        if (!btn) return false;
        btn.scrollIntoView({ behavior: 'instant', block: 'center' });
        btn.click();
        return true;
      });

      if (!clicked) {
        console.log(`  No more "Load more" — done after ${round} click(s).`);
        break;
      }

      round++;
      console.log(`  Clicked "Load more" (round ${round})…`);
      await new Promise(r => setTimeout(r, 2000));
    }

    // Get full innerText of main content
    const innerText = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      return main.innerText;
    });

    // Parse the innerText.
    // Structure per palette:
    //   Copy Hex:\n#XXXXXX\n  (repeated N times)
    //   PALETTE NAME\n\n
    //   Action menu, PALETTE NAME\n
    //
    // The very first group has no preceding name — it comes before any "Action menu" line.

    const hexRe = /^#[0-9A-Fa-f]{6}$/;
    const lines = innerText.split('\n').map(l => l.trim()).filter(Boolean);

    const palettes = [];
    let currentHexes = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line === 'Copy Hex:') {
        // Next line is the hex code
        const hex = lines[i + 1] || '';
        if (hexRe.test(hex)) {
          currentHexes.push(hex.toUpperCase());
          i += 2;
          continue;
        }
      }

      if (/^Action menu,\s+(.+)$/.test(line)) {
        // This marks the end of the current palette — the name is the part after "Action menu, "
        const name = line.replace(/^Action menu,\s+/, '').trim();
        if (currentHexes.length > 0) {
          palettes.push({ name, hexes: [...currentHexes] });
          currentHexes = [];
        }
      }

      i++;
    }

    // Flush any remaining hexes (last palette may not have Action menu after it)
    if (currentHexes.length > 0) {
      palettes.push({ name: '(unnamed)', hexes: currentHexes });
    }

    const totalHexes = palettes.reduce((s, p) => s + p.hexes.length, 0);
    console.log(`\n  Found ${palettes.length} palettes, ${totalHexes} hex codes total.\n`);

    for (const p of palettes) {
      console.log(`  ${p.name}`);
      console.log(`    ${p.hexes.join('  ')}`);
    }

    const output = {
      source: url,
      scraped_at: new Date().toISOString(),
      total_palettes: palettes.length,
      total_hex_codes: totalHexes,
      palettes,
      flat: [...new Set(palettes.flatMap(p => p.hexes))],
    };

    writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
    console.log(`\n  Saved → ${outputFile}`);

    return output;
  } finally {
    await browser.close();
  }
}

scrapeColors().catch(err => {
  console.error('Scraper failed:', err.message);
  process.exit(1);
});
