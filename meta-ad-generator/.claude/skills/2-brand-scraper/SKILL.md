---
name: 2-brand-scraper
description: Scrape a client website to extract brand colors, fonts, images, and tone
---

# Brand Scraper — Extract Brand Assets from Client Website

## When to Use
Run this skill after `/ad-intake` when you have the client's website URL and need to extract visual brand assets for ad creation.

## Prerequisites
- `client-brief.json` must exist in `output/{client-slug}/brief/`
- Node.js and Puppeteer must be installed (`npm install` in project root)

## Instructions

1. **Read the client brief** to get the website URL:
   ```bash
   cat output/{client-slug}/brief/client-brief.json
   ```

2. **Run the brand scraper script**:
   ```bash
   node scripts/scrape-brand.js "{website-url}" "output/{client-slug}/brief"
   ```
   This will:
   - Visit the website in a headless browser
   - Extract all CSS colors used on the page, ranked by frequency
   - Extract font families and weights
   - Download hero images and logo candidates to `output/{client-slug}/brief/images/`
   - Save everything to `output/{client-slug}/brief/brand-assets.json`

3. **Check for manual product_type override**:
   - Read `client-brief.json` and check if `product_type` is set (`"tangible"` or `"intangible"`)
   - If set: this overrides the scraper's auto-detection. After scraping, update `brand-assets.json → product_category.type` to match the client brief value, and set confidence to `"manual"`.
   - If `null` or not set: use the scraper's auto-detected category as-is.

4. **Review the scraped results** by reading `brand-assets.json`.

4. **Refine the color suggestions** if needed:
   - The script auto-suggests primary/secondary/accent from frequency data
   - For Wix sites: check `wix_variables` for the site's actual color scheme
   - Verify contrast: ensure suggested `text` color has >= 4.5:1 ratio against `background`
   - If the scraped colors look wrong (e.g., all grays from a framework), examine the Wix color variables or page-specific styles

5. **Review product category detection**:
   - Check `brand-assets.json → product_category` for the detected type and confidence
   - The scraper now auto-detects whether the client sells tangible (physical) or intangible (services/digital) products
   - If confidence is `"low"`: review the signals and correct if needed — look at the website manually
   - If `"tangible"`: verify that product images were downloaded to `images/product-*.{ext}`
   - The category determines which templates, copy rules, and design rules are used downstream

6. **Verify image downloads**:
   - Check `output/{client-slug}/brief/images/` for downloaded files
   - Confirm at least 1 usable hero image exists
   - For tangible products: confirm usable product images exist. If scraper missed them, manually download product photos from the site.
   - If logo wasn't auto-detected, manually note which image is the logo

7. **Update brand-assets.json** if manual corrections are needed:
   - Fix `suggested.primary` / `secondary` / `accent` if auto-detection missed the real brand colors
   - Update `suggested.heading` / `body` font if the most-used font is a system font and a branded font was found lower in the list

8. **Print summary**: colors found, primary/secondary/accent hex values, heading font, number of images downloaded, product category (tangible/intangible + confidence).

## Fallback — If Scraper Fails
If the Puppeteer script fails (CORS, heavy JavaScript site, etc.):

1. Use Claude's browser tools (WebFetch) to visit the site and visually identify:
   - Primary brand color (most prominent colored element)
   - Secondary color (buttons, accents)
   - Font style (serif vs sans-serif, rounded vs geometric)
2. Manually construct `brand-assets.json` with the identified values
3. Ask the user to provide a logo file if none was found

## Color Validation Rules
Reference: `reference/color-theory.md`

- Primary color: should be the dominant brand color (headers, large sections)
- Secondary color: supporting color (backgrounds, borders)
- Accent/CTA color: highest-saturation color, used for buttons — must contrast against both primary and background
- Background: usually white (#FFFFFF) or very light neutral
- Text: usually near-black (#1A1A2E) or dark gray (#333333)
