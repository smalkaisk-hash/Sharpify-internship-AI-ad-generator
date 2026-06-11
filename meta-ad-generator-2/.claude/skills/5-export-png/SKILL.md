---
name: 5-export-png
description: Export HTML ad creatives to 1080x1080 PNG files via Puppeteer headless browser. Trigger this skill whenever HTML ads exist and need to become PNGs for Meta upload — or when the user says "export to PNG", "render the ads", "finalize the creatives", "run the export", or "do step 5". Final step of the client ad pipeline before review.
---

# PNG Export — Convert HTML Ads to Production-Ready PNG Images

## When to Use
Run this skill after `/ad-design` to export all generated HTML ad files to PNG images ready for Meta Ads upload.

## Prerequisites
- HTML ad files must exist in `clients/output/{client-slug}/html/`
- Puppeteer must be installed (`npm install` in project root)

## Instructions

1. **Identify the client's HTML directory**:
   ```bash
   ls clients/output/{client-slug}/html/
   ```
   Confirm HTML files exist.

2. **Run the PNG export script**:
   ```bash
   node scripts/export-png.js "clients/output/{client-slug}/html" "clients/output/{client-slug}/png"
   ```

3. **Run automated validation** (mandatory):
   ```bash
   node scripts/validate-output.js clients/output/{client-slug}/png {ad_count}
   ```
   - Script checks: 1080×1080 dimensions, 50 KB–2 MB file size, correct count
   - Exit 0 = all pass; exit 1 = fix errors before continuing

4. **If validation fails**:

   | Error | Fix |
   |-------|-----|
   | File < 50 KB (blank render) | Open the HTML in Chrome, find the missing path or CSS issue, fix and re-export that ad only |
   | Wrong dimensions | Verify `body { width: 1080px; height: 1080px; overflow: hidden }` in the HTML |
   | Missing count | Check which HTML file failed to produce a PNG; look for Puppeteer errors in the console |
   | File > 2 MB | Run `node scripts/export-png.js` with `--quality 92` flag or compress with ImageMagick |

   After fixing, re-export only the affected ads and re-run validation.

5. **Visual QA** (after validation passes):
   - Open every PNG — do not sample 2-3, view all of them
   - Check: fonts rendered correctly (not system fallback), images loaded, colors match brand, no text overflow
   - Run the read-aloud test on every headline
   - If anything looks off, fix the HTML and re-export that specific ad

6. **Print summary**: Number of PNGs exported, file sizes, output directory path, validation result.

## Manual Export Alternative
If Puppeteer fails, you can manually export:
1. Open each HTML file in Chrome
2. Open DevTools → Device Mode → set viewport to 1080x1080
3. Right-click → Capture screenshot (full size)

## File Size Guidelines for Meta
- **Recommended**: Under 2MB per image for fast ad delivery
- **Maximum**: 30MB (but Meta will compress heavily)
- If PNG is over 3MB: consider converting to high-quality JPG (quality 92%)
