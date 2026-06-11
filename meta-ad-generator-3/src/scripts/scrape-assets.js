/**
 * Website Asset Scraper
 * Scrapes real content assets (images, logos, videos) from a client website.
 * Crawls homepage + all internal subpages. Skips maps, icons, tracking, and other junk.
 *
 * Usage: node src/scripts/scrape-assets.js <client-slug> [url]
 * Saves to: meta-ad-generator-3/clients/<slug>/assets/
 */

import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Args ─────────────────────────────────────────────────────────────────────

const slug = process.argv[2];
if (!slug) { console.error('Usage: node scrape-assets.js <client-slug> [url]'); process.exit(1); }

const inputDir  = resolve(__dirname, `../../clients/${slug}`);
const assetsDir = resolve(inputDir, 'assets');

const brief = JSON.parse(readFileSync(resolve(inputDir, 'client-brief.json'), 'utf8'));
const websiteUrl = process.argv[3] || brief.website;

if (!websiteUrl) {
  console.error('No website URL found. Add "website" to client-brief.json or pass URL as second arg.');
  process.exit(1);
}

mkdirSync(assetsDir, { recursive: true });

// ─── Junk filters ─────────────────────────────────────────────────────────────

// Domains whose assets are never real content
const JUNK_DOMAINS = [
  'googleapis.com', 'gstatic.com', 'google.com/maps', 'maps.google',
  'googletagmanager.com', 'google-analytics.com', 'doubleclick.net',
  'facebook.com', 'fbcdn.net', 'connect.facebook',
  'twitter.com', 'twimg.com',
  'hotjar.com', 'clarity.ms', 'cookiebot.com',
  'gravatar.com',
];

// URL path/query patterns that indicate infrastructure or icon assets
const JUNK_URL_PATTERNS = [
  /\/tile\?/i, /[?&]tile=/i,
  /StaticMapService/i, /streetviewpixels/i,
  /\/maps\/vt/i,
  /tracking|analytics|beacon|pixel|telemetry/i,
  /spinner|loader|placeholder|skeleton/i,
  /\.cur(\?|$)/i,
  /data:image\/svg/i,
];

// Filename patterns that indicate icons or infrastructure
const JUNK_NAME_PATTERNS = [
  /^(vt|tile|sv9|openhand|spinner|loader|placeholder)\b/i,
  /svg%3[Ee]/,
  /1x1|pixel/i,
];

function isJunk(url) {
  try {
    const u = new URL(url);
    if (JUNK_DOMAINS.some(d => u.hostname.includes(d) || u.href.includes(d))) return true;
  } catch { return true; }
  if (JUNK_URL_PATTERNS.some(p => p.test(url))) return true;
  const name = basename(new URL(url).pathname);
  if (JUNK_NAME_PATTERNS.some(p => p.test(name))) return true;
  return false;
}

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov|avi|m4v)(\?|$)/i.test(url);
}

function isImageUrl(url) {
  return /\.(jpe?g|png|webp|gif|avif|svg|bmp|tiff?)(\?|$)/i.test(url);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeFilename(url, prefix = '') {
  try {
    const u = new URL(url);
    let name = basename(u.pathname) || 'image';
    name = name.split('?')[0];
    if (!extname(name)) name += '.png';
    return prefix ? `${prefix}-${name}` : name;
  } catch {
    const hash = createHash('md5').update(url).digest('hex').slice(0, 8);
    return `${prefix || 'asset'}-${hash}.png`;
  }
}

async function downloadFile(url, filepath) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AssetScraper/1.0)' },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    // Skip files smaller than 3 KB — likely icons, tracking pixels, or empty responses
    if (buffer.length < 3072) throw new Error(`too small (${buffer.length}B)`);
    writeFileSync(filepath, buffer);
    return filepath;
  } catch (err) {
    console.warn(`  Skip (${err.message}): ${url.slice(0, 90)}`);
    return null;
  }
}

// ─── DOM extraction (runs inside page.evaluate) ───────────────────────────────

function extractFromDOM(baseUrl) {
  const results = [];
  const seen = new Set();

  function add(entry) {
    if (!entry.url) return;
    let resolved;
    try { resolved = new URL(entry.url, baseUrl).href; } catch { return; }
    if (seen.has(resolved)) return;
    seen.add(resolved);
    results.push({ ...entry, url: resolved });
  }

  // ── <img> tags ────────────────────────────────────────────────────────────
  document.querySelectorAll('img').forEach(img => {
    const src = img.currentSrc || img.src;
    if (!src || src.startsWith('data:')) return;

    // Also check srcset for the highest-res variant
    if (img.srcset) {
      const best = img.srcset.split(',').map(s => {
        const [u, w] = s.trim().split(/\s+/);
        return { u, w: parseInt(w) || 0 };
      }).sort((a, b) => b.w - a.w)[0]?.u;
      if (best) add({ url: best, category: 'image', alt: img.alt || '', naturalWidth: img.naturalWidth || 0, naturalHeight: img.naturalHeight || 0 });
    }

    const inHeader = !!img.closest('header, nav, [class*="header"], [class*="nav"], [id*="header"], [id*="nav"]');
    const isLogo = inHeader
      || (img.alt || '').toLowerCase().includes('logo')
      || (img.className || '').toLowerCase().includes('logo')
      || (img.id || '').toLowerCase().includes('logo')
      || src.toLowerCase().includes('logo');
    const isHero = !!img.closest('[class*="hero"], [class*="banner"], [class*="jumbotron"], [id*="hero"]');

    add({
      url: src,
      category: isLogo ? 'logo' : isHero ? 'hero' : 'image',
      alt: img.alt || '',
      naturalWidth: img.naturalWidth || img.width || 0,
      naturalHeight: img.naturalHeight || img.height || 0,
    });
  });

  // ── <picture> / <source> srcsets ─────────────────────────────────────────
  document.querySelectorAll('picture source[srcset]').forEach(src => {
    const best = src.srcset.split(',').map(s => {
      const [u, w] = s.trim().split(/\s+/);
      return { u, w: parseInt(w) || 0 };
    }).sort((a, b) => b.w - a.w)[0]?.u;
    if (best) add({ url: best, category: 'image', alt: '', naturalWidth: 0, naturalHeight: 0 });
  });

  // ── <video> tags ──────────────────────────────────────────────────────────
  document.querySelectorAll('video').forEach(video => {
    if (video.src) add({ url: video.src, category: 'video', alt: video.title || '', naturalWidth: video.videoWidth || 0, naturalHeight: video.videoHeight || 0 });
    video.querySelectorAll('source').forEach(s => {
      if (s.src) add({ url: s.src, category: 'video', alt: '', naturalWidth: 0, naturalHeight: 0 });
    });
    if (video.poster) add({ url: video.poster, category: 'image', alt: 'video poster', naturalWidth: 0, naturalHeight: 0 });
  });

  // ── Favicon ───────────────────────────────────────────────────────────────
  document.querySelectorAll('link[rel*="icon"]').forEach(icon => {
    if (icon.href) add({ url: icon.href, category: 'favicon', alt: 'favicon', naturalWidth: 32, naturalHeight: 32 });
  });

  // ── OG / Twitter meta images ──────────────────────────────────────────────
  const og = document.querySelector('meta[property="og:image"], meta[name="og:image"]');
  if (og?.content) add({ url: og.content, category: 'og-image', alt: 'og:image', naturalWidth: 1200, naturalHeight: 630 });

  const tw = document.querySelector('meta[name="twitter:image"]');
  if (tw?.content) add({ url: tw.content, category: 'social-image', alt: 'twitter:image', naturalWidth: 800, naturalHeight: 418 });

  // ── CSS background-image on hero/banner/section elements only ─────────────
  const bgCandidates = document.querySelectorAll(
    'header, section, main, article, [class*="hero"], [class*="banner"], [class*="bg-"], [class*="background"], [class*="cover"], [class*="slider"], [class*="gallery"], [class*="parallax"]'
  );
  bgCandidates.forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === 'none') return;
    [...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].forEach(m => {
      const url = m[1];
      if (!url || url.startsWith('data:')) return;
      add({ url, category: 'background', alt: el.getAttribute('aria-label') || '', naturalWidth: el.offsetWidth || 0, naturalHeight: el.offsetHeight || 0 });
    });
  });

  // ── data-src / lazy-load attributes ──────────────────────────────────────
  document.querySelectorAll('[data-src],[data-lazy],[data-original],[data-bg]').forEach(el => {
    const src = el.getAttribute('data-src') || el.getAttribute('data-lazy') ||
                el.getAttribute('data-original') || el.getAttribute('data-bg');
    if (src && !src.startsWith('data:')) {
      add({ url: src, category: 'image', alt: el.alt || '', naturalWidth: el.naturalWidth || 0, naturalHeight: el.naturalHeight || 0 });
    }
  });

  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function scrapeAssets() {
  console.log(`\nScraping assets from ${websiteUrl}`);
  console.log(`Saving to: ${assetsDir}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allFound = new Map(); // url → entry (deduped)
  const networkVideos = new Set();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    // Intercept network to catch video files and any image not in DOM
    await page.setRequestInterception(true);
    page.on('request', req => {
      const url = req.url();
      if (!isJunk(url)) {
        if (isVideoUrl(url)) networkVideos.add(url);
      }
      req.continue();
    });

    async function visitPage(url) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      } catch {
        // fallback: domcontentloaded is fine if networkidle2 times out
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      }
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 800));

      // Scroll to trigger lazy-loaded images
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 350) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 800));

      // Collect DOM assets
      const found = await page.evaluate(extractFromDOM, url);
      for (const entry of found) {
        if (!allFound.has(entry.url)) allFound.set(entry.url, entry);
      }
      return found.length;
    }

    // Visit homepage
    const homeCount = await visitPage(websiteUrl);
    console.log(`  Homepage: ${homeCount} assets found in DOM`);

    // Discover internal links (up to 15 subpages)
    const links = await page.evaluate((base) => {
      const origin = new URL(base).origin;
      return [...new Set(
        [...document.querySelectorAll('a[href]')]
          .map(a => { try { return new URL(a.href, base).href; } catch { return null; } })
          .filter(h => h && h.startsWith(origin) && !h.includes('#') && !h.match(/\.(pdf|zip|docx?|xml|json)$/i) && h !== base)
      )].slice(0, 15);
    }, websiteUrl);

    console.log(`  Found ${links.length} subpages to crawl\n`);

    for (const link of links) {
      try {
        const count = await visitPage(link);
        const label = link.replace(new URL(websiteUrl).origin, '');
        console.log(`  ${label}: ${count} assets`);
      } catch (e) {
        console.warn(`  Skip ${link}: ${e.message}`);
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }

  // Add network-intercepted videos
  for (const url of networkVideos) {
    if (!allFound.has(url)) {
      allFound.set(url, { url, category: 'video', alt: '', naturalWidth: 0, naturalHeight: 0 });
    }
  }

  // Filter: remove junk and known-tiny images
  const candidates = [...allFound.values()].filter(img => {
    if (isJunk(img.url)) return false;
    if (!isImageUrl(img.url) && !isVideoUrl(img.url) && img.category !== 'favicon') return false;
    // skip SVG files entirely (they're almost always icons/UI elements)
    if (/\.svg(\?|$)/i.test(img.url)) return false;
    // skip known-tiny images by dimension
    if (img.naturalWidth > 0 && img.naturalHeight > 0 && img.naturalWidth < 80 && img.naturalHeight < 80) return false;
    return true;
  });

  console.log(`\n  Total candidates after filtering: ${candidates.length}\n`);

  // Download
  const manifest = { website: websiteUrl, scraped_at: new Date().toISOString(), assets: [] };
  const counts = {};

  for (const img of candidates) {
    counts[img.category] = (counts[img.category] || 0) + 1;
    const idx = counts[img.category];
    const filename = safeFilename(img.url, `${img.category}-${idx}`);
    const filepath = resolve(assetsDir, filename);

    const saved = await downloadFile(img.url, filepath);
    if (!saved) continue;

    manifest.assets.push({
      category: img.category,
      filename,
      alt: img.alt,
      width: img.naturalWidth || null,
      height: img.naturalHeight || null,
      source_url: img.url,
    });

    console.log(`  [${img.category}] ${filename}`);
  }

  const manifestPath = resolve(inputDir, 'assets-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\nDone — ${manifest.assets.length} assets saved to assets/`);
  console.log(`Manifest: assets-manifest.json`);

  return manifest;
}

scrapeAssets().catch(err => {
  console.error('Scraper failed:', err.message);
  process.exit(1);
});
