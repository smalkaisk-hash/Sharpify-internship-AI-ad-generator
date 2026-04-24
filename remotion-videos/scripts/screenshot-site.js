#!/usr/bin/env node
/**
 * Headless-browser full-page screenshot at mobile viewport width.
 *
 * Usage: node scripts/screenshot-site.js <url> <outputPath> [width]
 *
 * Saves a tall PNG of the whole page. Meant to feed the "scrolling phone"
 * mockup in the Sharpify Construction composition.
 */
const path = require("path");
const puppeteer = require(path.join(
  "c:/Users/Ritvars Volfs/meta-ad-generator-v2/meta-ad-generator",
  "node_modules",
  "puppeteer"
));

(async () => {
  const [, , url, out, widthArg] = process.argv;
  if (!url || !out) {
    console.error("Usage: node screenshot-site.js <url> <out.png> [width=390]");
    process.exit(1);
  }
  const width = parseInt(widthArg || "390", 10);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );
    console.log(`[screenshot] ${url} @ ${width}px → ${out}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    // Let fonts / first-paint settle
    await new Promise((r) => setTimeout(r, 2000));
    // Slow viewport-sized scroll to trigger lazy images + scroll-linked animations.
    // Uses small viewport-fraction steps with long pauses so IntersectionObservers fire.
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const stepSize = Math.floor(window.innerHeight * 0.4);
        let y = 0;
        const maxH = () =>
          Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const timer = setInterval(() => {
          window.scrollTo(0, y);
          y += stepSize;
          if (y >= maxH()) {
            clearInterval(timer);
            // Back to top and settle
            setTimeout(() => {
              window.scrollTo(0, 0);
              setTimeout(resolve, 500);
            }, 800);
          }
        }, 350);
      });
    });
    // Extra settle time for any intersection-triggered transitions
    await new Promise((r) => setTimeout(r, 1500));

    await page.screenshot({
      path: out,
      fullPage: true,
      type: "png",
    });

    // Report final dimensions
    const dims = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      height: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ),
    }));
    console.log(`[screenshot] saved ${out}  dims=${dims.width}x${dims.height}px`);
  } finally {
    await browser.close();
  }
})();
