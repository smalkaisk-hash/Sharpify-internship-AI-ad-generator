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

3. **Verify the output**:
   ```bash
   ls -la clients/output/{client-slug}/png/
   ```
   - Each HTML file should have a corresponding PNG
   - File sizes should be 200KB–3MB (very small = something didn't render; very large = uncompressed)

4. **Quality check** each PNG:
   - Open the PNG files to visually inspect
   - Verify dimensions are exactly 1080x1080
   - Check that fonts rendered correctly (not falling back to system fonts)
   - Check that images loaded (not broken image icons)
   - Check that colors match the brand assets

5. **If any issues**:
   - **Fonts not loading**: The HTML may need a longer wait time, or fonts need to be loaded via a local file instead of Google Fonts CDN
   - **Images not loading**: Verify the `file://` paths are correct with forward slashes
   - **Wrong dimensions**: The script clips at 1080x1080, verify the HTML body is set to that size
   - **Blank/white output**: The HTML file may have a path error — open the HTML file in a regular browser first to debug

6. **Print summary**: Number of PNGs exported, file sizes, output directory path.

## Manual Export Alternative
If Puppeteer fails, you can manually export:
1. Open each HTML file in Chrome
2. Open DevTools → Device Mode → set viewport to 1080x1080
3. Right-click → Capture screenshot (full size)

## File Size Guidelines for Meta
- **Recommended**: Under 2MB per image for fast ad delivery
- **Maximum**: 30MB (but Meta will compress heavily)
- If PNG is over 3MB: consider converting to high-quality JPG (quality 92%)
