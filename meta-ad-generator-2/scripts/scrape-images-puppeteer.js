/**
 * Deep image scraper — uses Puppeteer to scroll and collect all images
 * including lazy-loaded ones from JS-rendered SPAs
 *
 * Usage: node scripts/scrape-images-puppeteer.js <url> <output-dir>
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const siteUrl = process.argv[2] || 'https://nuwara.me';
const outputDir = process.argv[3] || 'clients/output/nuwara/brief/images';

fs.mkdirSync(outputDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function safeFilename(urlStr) {
  try {
    const u = new URL(urlStr);
    const base = path.basename(u.pathname).split('?')[0];
    return base.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 80) || 'image.jpg';
  } catch {
    return 'image_' + Date.now() + '.jpg';
  }
}

async function main() {
  console.log(`\nScraping images from: ${siteUrl}`);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const collectedUrls = new Set();

  // Intercept network requests to catch all image loads
  await page.setRequestInterception(true);
  page.on('request', req => {
    const rt = req.resourceType();
    if (rt === 'image') collectedUrls.add(req.url());
    req.continue();
  });
  page.on('response', async res => {
    const ct = res.headers()['content-type'] || '';
    if (ct.startsWith('image/')) collectedUrls.add(res.url());
  });

  await page.goto(siteUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Scroll to trigger lazy loading
  for (let i = 0; i < 8; i++) {
    await page.evaluate((step) => window.scrollTo(0, step * 600), i);
    await new Promise(r => setTimeout(r, 600));
  }
  await new Promise(r => setTimeout(r, 1500));

  // Also collect from DOM
  const domImages = await page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll('img[src], img[data-src], img[data-lazy]').forEach(img => {
      ['src','data-src','data-lazy','srcset'].forEach(attr => {
        const v = img.getAttribute(attr);
        if (v) v.split(',').forEach(part => {
          const url = part.trim().split(' ')[0];
          if (url && !url.startsWith('data:')) urls.add(url);
        });
      });
    });
    document.querySelectorAll('[style]').forEach(el => {
      const m = el.style.backgroundImage?.match(/url\(["']?([^"')]+)["']?\)/);
      if (m && m[1] && !m[1].startsWith('data:')) urls.add(m[1]);
    });
    return [...urls];
  });

  domImages.forEach(u => {
    try { collectedUrls.add(new URL(u, siteUrl).href); } catch {}
  });

  await browser.close();

  // Filter: only meaningful images (skip tiny icons, tracking pixels, svgs)
  const imageUrls = [...collectedUrls].filter(u => {
    const lower = u.toLowerCase();
    return (
      (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp')) &&
      !lower.includes('favicon') &&
      !lower.includes('icon') &&
      !lower.includes('logo') &&
      !lower.includes('1x1') &&
      !lower.includes('pixel') &&
      !lower.includes('tracking')
    );
  });

  console.log(`\nFound ${imageUrls.length} image(s):\n`);
  imageUrls.forEach(u => console.log(' ', u));

  console.log(`\nDownloading to ${outputDir}...\n`);
  let count = 0;
  for (const url of imageUrls) {
    const filename = safeFilename(url);
    const dest = path.join(outputDir, filename);
    if (fs.existsSync(dest)) { console.log(`  skip (exists): ${filename}`); continue; }
    try {
      await downloadFile(url, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(`  ✓ ${filename} (${size} KB)`);
      count++;
    } catch (e) {
      console.log(`  ✗ ${filename}: ${e.message}`);
    }
  }

  console.log(`\nDone — ${count} new image(s) saved to ${outputDir}`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
