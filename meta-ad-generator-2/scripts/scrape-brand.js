/**
 * Brand Scraper — Extracts brand assets from a client's website
 *
 * Usage: node scripts/scrape-brand.js <url> <output-dir>
 * Example: node scripts/scrape-brand.js https://aivajuste1.wixsite.com/aiva-juste-coach output/aiva-juste/brief
 *
 * Outputs:
 *   brand-assets.json — colors, fonts, images, logo candidates
 *   images/ — downloaded hero images and logo candidates
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const url = process.argv[2];
const outputDir = process.argv[3] || './output/brand';

if (!url) {
  console.error('Usage: node scrape-brand.js <url> <output-dir>');
  process.exit(1);
}

// Ensure output directories exist
const imagesDir = path.join(outputDir, 'images');
fs.mkdirSync(imagesDir, { recursive: true });

/**
 * Download a file from URL to local path.
 * Follows up to 5 redirects to prevent infinite loops / stack overflow.
 */
const MAX_REDIRECTS = 5;

function downloadFile(fileUrl, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > MAX_REDIRECTS) {
      return reject(new Error(`Too many redirects (>${MAX_REDIRECTS}) for ${fileUrl}`));
    }
    const protocol = fileUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol.get(fileUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(destPath, (unlinkErr) => {
          if (unlinkErr && unlinkErr.code !== 'ENOENT') {
            console.warn(`Warning: could not clean up ${destPath}: ${unlinkErr.message}`);
          }
          downloadFile(response.headers.location, destPath, redirectCount + 1)
            .then(resolve)
            .catch(reject);
        });
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
    }).on('error', (err) => {
      fs.unlink(destPath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== 'ENOENT') {
          console.warn(`Warning: could not clean up ${destPath}: ${unlinkErr.message}`);
        }
        reject(err);
      });
    });
  });
}

/**
 * Extract color from rgb/rgba string to hex
 */
function rgbToHex(rgb) {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return null;
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb; // already hex or named
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate relative luminance for contrast checking
 */
function luminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map(x => {
    const c = parseInt(x, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

async function scrapeBrand() {
  console.log(`\nScraping brand assets from: ${url}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait extra for Wix/dynamic sites to render
    await new Promise(r => setTimeout(r, 3000));
  } catch (e) {
    console.warn('Warning: Page load timeout, proceeding with partial content...');
  }

  // === EXTRACT COLORS ===
  const colors = await page.evaluate(() => {
    const colorMap = {};
    const elements = document.querySelectorAll('*');

    elements.forEach(el => {
      const style = getComputedStyle(el);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      const tag = el.tagName.toLowerCase();

      if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
        if (!colorMap[bgColor]) colorMap[bgColor] = { count: 0, contexts: [] };
        colorMap[bgColor].count++;
        colorMap[bgColor].contexts.push(`bg:${tag}`);
      }

      if (textColor && textColor !== 'transparent') {
        if (!colorMap[textColor]) colorMap[textColor] = { count: 0, contexts: [] };
        colorMap[textColor].count++;
        colorMap[textColor].contexts.push(`text:${tag}`);
      }
    });

    // Also check for CSS custom properties / Wix color variables
    const root = getComputedStyle(document.documentElement);
    const wixColors = {};
    for (let i = 1; i <= 35; i++) {
      const val = root.getPropertyValue(`--color_${i}`).trim();
      if (val) wixColors[`--color_${i}`] = val;
    }

    return { colorMap, wixColors };
  });

  // Process colors — rank by frequency, filter out black/white/transparent
  const processedColors = Object.entries(colors.colorMap)
    .map(([rgb, data]) => ({
      hex: rgbToHex(rgb),
      rgb,
      count: data.count,
      contexts: [...new Set(data.contexts)].slice(0, 5)
    }))
    .filter(c => c.hex && c.hex !== '#000000' && c.hex !== '#ffffff' && c.hex !== '#f5f5f5')
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // === EXTRACT FONTS ===
  const fonts = await page.evaluate(() => {
    const fontMap = {};
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, div');

    elements.forEach(el => {
      const style = getComputedStyle(el);
      const family = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      const weight = style.fontWeight;
      const size = style.fontSize;
      const tag = el.tagName.toLowerCase();

      if (family) {
        if (!fontMap[family]) fontMap[family] = { count: 0, weights: new Set(), sizes: new Set(), contexts: [] };
        fontMap[family].count++;
        fontMap[family].weights.add(weight);
        fontMap[family].sizes.add(size);
        fontMap[family].contexts.push(tag);
      }
    });

    return Object.entries(fontMap).map(([family, data]) => ({
      family,
      count: data.count,
      weights: [...data.weights],
      sizes: [...data.sizes].slice(0, 5),
      contexts: [...new Set(data.contexts)]
    })).sort((a, b) => b.count - a.count);
  });

  // === EXTRACT IMAGES ===
  const images = await page.evaluate(() => {
    const imgs = [];

    // Regular img tags
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.getAttribute('data-src') || '';
      const alt = img.alt || '';
      const rect = img.getBoundingClientRect();
      if (src && rect.width > 80 && rect.height > 80) {
        imgs.push({
          src,
          alt,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          area: Math.round(rect.width * rect.height),
          isLogo: (
            alt.toLowerCase().includes('logo') ||
            src.toLowerCase().includes('logo') ||
            img.className.toLowerCase().includes('logo') ||
            (rect.width < 250 && rect.height < 150 && rect.y < 200)
          )
        });
      }
    });

    // Background images
    document.querySelectorAll('*').forEach(el => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none' && bg.includes('url(')) {
        const match = bg.match(/url\(["']?(.+?)["']?\)/);
        if (match) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 200 && rect.height > 200) {
            imgs.push({
              src: match[1],
              alt: 'background-image',
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              area: Math.round(rect.width * rect.height),
              isLogo: false
            });
          }
        }
      }
    });

    return imgs.sort((a, b) => b.area - a.area);
  });

  // === DETECT PRODUCT CATEGORY (TANGIBLE vs INTANGIBLE) ===
  const categorySignals = await page.evaluate(() => {
    const bodyText = document.body.innerText.toLowerCase();
    const bodyHtml = document.body.innerHTML.toLowerCase();
    const allLinks = [...document.querySelectorAll('a')].map(a => a.href.toLowerCase());

    const tangibleSignals = [];
    const intangibleSignals = [];

    // Content signals — tangible (physical products)
    const tangibleKeywords = [
      'add to cart', 'add to bag', 'buy now', 'shop now', 'order now',
      'in stock', 'out of stock', 'shipping', 'delivery', 'free shipping',
      'size', 'color', 'quantity', 'sku', 'weight', 'dimensions',
      'product details', 'product description', 'materials', 'ingredients',
      'pievienot grozam', 'pirkt', 'pasūtīt', 'piegāde', 'bezmaksas piegāde',
      'izmērs', 'krāsa', 'daudzums', 'svars', 'materiāls'
    ];
    tangibleKeywords.forEach(kw => {
      if (bodyText.includes(kw)) tangibleSignals.push(`content: "${kw}"`);
    });

    // Content signals — intangible (services, courses, digital)
    const intangibleKeywords = [
      'sign up', 'enroll', 'subscribe', 'book now', 'book a call',
      'free trial', 'get started', 'join now', 'register',
      'course', 'program', 'module', 'lesson', 'coaching', 'consultation',
      'session', 'webinar', 'workshop', 'membership', 'download',
      'software', 'app', 'platform', 'saas', 'online',
      'piesakies', 'reģistrēties', 'kurss', 'programma', 'modulis',
      'nodarbība', 'konsultācija', 'sesija', 'koučings'
    ];
    intangibleKeywords.forEach(kw => {
      if (bodyText.includes(kw)) intangibleSignals.push(`content: "${kw}"`);
    });

    // URL structure signals
    const urlPatterns = {
      tangible: ['/shop', '/products', '/store', '/collections', '/catalog', '/product/', '/veikals'],
      intangible: ['/services', '/courses', '/programs', '/coaching', '/pricing', '/book', '/pakalpojumi', '/kursi']
    };
    allLinks.forEach(link => {
      urlPatterns.tangible.forEach(p => {
        if (link.includes(p)) tangibleSignals.push(`url: "${p}"`);
      });
      urlPatterns.intangible.forEach(p => {
        if (link.includes(p)) intangibleSignals.push(`url: "${p}"`);
      });
    });

    // E-commerce element signals
    const hasCartButton = !!document.querySelector('[class*="cart"], [class*="basket"], [id*="cart"], [id*="basket"], [data-hook*="cart"]');
    const hasPriceElements = !!document.querySelector('[class*="price"], [class*="cost"], [data-hook*="price"]');
    const hasProductGallery = !!document.querySelector('[class*="gallery"], [class*="product-image"], [class*="product-photo"], [data-hook*="product-image"]');
    const hasAddToCart = !!document.querySelector('button[class*="add-to-cart"], [data-hook*="add-to-cart"], .shopify-payment-button');

    if (hasCartButton) tangibleSignals.push('element: cart button');
    if (hasPriceElements) tangibleSignals.push('element: price display');
    if (hasProductGallery) tangibleSignals.push('element: product gallery');
    if (hasAddToCart) tangibleSignals.push('element: add-to-cart button');

    // Check for booking/scheduling elements (intangible)
    const hasBookingWidget = !!document.querySelector('[class*="booking"], [class*="calendar"], [class*="schedule"], [data-hook*="booking"]');
    const hasFormSignup = !!document.querySelector('form[class*="signup"], form[class*="register"], form[class*="enroll"]');
    if (hasBookingWidget) intangibleSignals.push('element: booking widget');
    if (hasFormSignup) intangibleSignals.push('element: signup form');

    // Identify product images (images near price/cart elements)
    const productImgs = [];
    const priceEls = document.querySelectorAll('[class*="price"], [class*="product"], [data-hook*="product"]');
    priceEls.forEach(el => {
      const nearby = el.closest('section, article, div[class*="product"], [data-hook*="product"]');
      if (nearby) {
        nearby.querySelectorAll('img').forEach(img => {
          const src = img.src || img.getAttribute('data-src') || '';
          const rect = img.getBoundingClientRect();
          if (src && rect.width > 150 && rect.height > 150) {
            productImgs.push({
              src,
              alt: img.alt || '',
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              area: Math.round(rect.width * rect.height)
            });
          }
        });
      }
    });

    return {
      tangibleSignals: [...new Set(tangibleSignals)],
      intangibleSignals: [...new Set(intangibleSignals)],
      productImages: productImgs.sort((a, b) => b.area - a.area).slice(0, 10)
    };
  });

  // Determine category
  const tangibleCount = categorySignals.tangibleSignals.length;
  const intangibleCount = categorySignals.intangibleSignals.length;
  let categoryType, categoryConfidence;

  if (tangibleCount > intangibleCount && tangibleCount >= 2) {
    categoryType = 'tangible';
    categoryConfidence = tangibleCount >= 5 ? 'high' : (tangibleCount >= 3 ? 'medium' : 'low');
  } else if (intangibleCount > tangibleCount && intangibleCount >= 2) {
    categoryType = 'intangible';
    categoryConfidence = intangibleCount >= 5 ? 'high' : (intangibleCount >= 3 ? 'medium' : 'low');
  } else {
    categoryType = 'intangible'; // default fallback
    categoryConfidence = 'low';
  }

  console.log(`\nCategory detected: ${categoryType} (${categoryConfidence} confidence)`);
  console.log(`  Tangible signals (${tangibleCount}): ${categorySignals.tangibleSignals.slice(0, 5).join(', ')}`);
  console.log(`  Intangible signals (${intangibleCount}): ${categorySignals.intangibleSignals.slice(0, 5).join(', ')}`);

  // Download product images if tangible
  const downloadedProductImages = [];
  if (categoryType === 'tangible' && categorySignals.productImages.length > 0) {
    console.log('\nDownloading product images...');
    const productImgs = categorySignals.productImages.slice(0, 5);
    for (let i = 0; i < productImgs.length; i++) {
      try {
        const ext = productImgs[i].src.match(/\.(jpg|jpeg|png|webp|svg)/i)?.[1] || 'jpg';
        const filename = `product-${i + 1}.${ext}`;
        const destPath = path.join(imagesDir, filename);
        await downloadFile(productImgs[i].src, destPath);
        downloadedProductImages.push({
          type: 'product',
          filename,
          originalUrl: productImgs[i].src,
          width: productImgs[i].width,
          height: productImgs[i].height
        });
        console.log(`  Downloaded: ${filename}`);
      } catch (e) {
        console.warn(`  Failed to download product image ${i + 1}: ${e.message}`);
      }
    }
  }

  // === EXTRACT PAGE CONTENT / TONE ===
  const content = await page.evaluate(() => {
    const headings = [];
    document.querySelectorAll('h1, h2, h3').forEach(h => {
      const text = h.textContent.trim();
      if (text.length > 2 && text.length < 200) headings.push({ tag: h.tagName, text });
    });

    const paragraphs = [];
    document.querySelectorAll('p').forEach(p => {
      const text = p.textContent.trim();
      if (text.length > 20 && text.length < 500) paragraphs.push(text);
    });

    const buttons = [];
    document.querySelectorAll('a, button').forEach(btn => {
      const text = btn.textContent.trim();
      if (text.length > 1 && text.length < 50) buttons.push(text);
    });

    const title = document.title || '';
    const metaDesc = document.querySelector('meta[name="description"]')?.content || '';

    return { title, metaDesc, headings: headings.slice(0, 10), paragraphs: paragraphs.slice(0, 8), buttons: [...new Set(buttons)].slice(0, 10) };
  });

  // === DOWNLOAD IMAGES ===
  console.log('Downloading images...');
  const downloadedImages = [];

  // Download top hero images (largest by area)
  const heroImages = images.filter(i => !i.isLogo).slice(0, 5);
  for (let i = 0; i < heroImages.length; i++) {
    try {
      const ext = heroImages[i].src.match(/\.(jpg|jpeg|png|webp|svg)/i)?.[1] || 'jpg';
      const filename = `hero-${i + 1}.${ext}`;
      const destPath = path.join(imagesDir, filename);
      await downloadFile(heroImages[i].src, destPath);
      downloadedImages.push({ type: 'hero', filename, originalUrl: heroImages[i].src, width: heroImages[i].width, height: heroImages[i].height });
      console.log(`  Downloaded: ${filename}`);
    } catch (e) {
      console.warn(`  Failed to download hero image ${i + 1}: ${e.message}`);
    }
  }

  // Download logo candidates
  const logoImages = images.filter(i => i.isLogo).slice(0, 3);
  for (let i = 0; i < logoImages.length; i++) {
    try {
      const ext = logoImages[i].src.match(/\.(jpg|jpeg|png|webp|svg)/i)?.[1] || 'png';
      const filename = `logo-${i + 1}.${ext}`;
      const destPath = path.join(imagesDir, filename);
      await downloadFile(logoImages[i].src, destPath);
      downloadedImages.push({ type: 'logo', filename, originalUrl: logoImages[i].src, width: logoImages[i].width, height: logoImages[i].height });
      console.log(`  Downloaded: ${filename}`);
    } catch (e) {
      console.warn(`  Failed to download logo ${i + 1}: ${e.message}`);
    }
  }

  // === BUILD BRAND ASSETS JSON ===
  const brandAssets = {
    source_url: url,
    scraped_at: new Date().toISOString(),

    colors: {
      palette: processedColors.slice(0, 8).map(c => ({ hex: c.hex, usage_count: c.count, contexts: c.contexts })),
      suggested: {
        primary: processedColors[0]?.hex || '#2C3E50',
        secondary: processedColors[1]?.hex || '#3498DB',
        accent: processedColors[2]?.hex || '#E74C3C',
        background: '#FFFFFF',
        text: '#1A1A2E'
      },
      wix_variables: colors.wixColors || {}
    },

    typography: {
      fonts_found: fonts.slice(0, 5).map(f => ({
        family: f.family,
        usage_count: f.count,
        weights: f.weights,
        contexts: f.contexts
      })),
      suggested: {
        heading: fonts[0]?.family || 'Montserrat',
        body: fonts.length > 1 ? fonts[1].family : (fonts[0]?.family || 'Inter')
      }
    },

    images: {
      heroes: downloadedImages.filter(i => i.type === 'hero'),
      logos: downloadedImages.filter(i => i.type === 'logo'),
      products: downloadedProductImages,
      all_found: images.length
    },

    product_category: {
      type: categoryType,
      confidence: categoryConfidence,
      signals: [...categorySignals.tangibleSignals, ...categorySignals.intangibleSignals],
      product_images: downloadedProductImages.map(i => `images/${i.filename}`)
    },

    content: {
      page_title: content.title,
      meta_description: content.metaDesc,
      headings: content.headings,
      key_paragraphs: content.paragraphs.slice(0, 4),
      cta_buttons_found: content.buttons
    }
  };

  // Write output
  const outputPath = path.join(outputDir, 'brand-assets.json');
  fs.writeFileSync(outputPath, JSON.stringify(brandAssets, null, 2));

  console.log(`\nBrand assets saved to: ${outputPath}`);
  console.log(`Colors found: ${processedColors.length}`);
  console.log(`Fonts found: ${fonts.length}`);
  console.log(`Images downloaded: ${downloadedImages.length}`);
  console.log(`Product category: ${categoryType} (${categoryConfidence})`);
  if (downloadedProductImages.length > 0) {
    console.log(`Product images downloaded: ${downloadedProductImages.length}`);
  }

  await browser.close();
  return brandAssets;
}

scrapeBrand().catch(err => {
  console.error('Scrape failed:', err.message);
  process.exit(1);
});
