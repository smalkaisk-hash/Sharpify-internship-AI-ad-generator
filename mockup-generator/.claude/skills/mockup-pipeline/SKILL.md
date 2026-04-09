---
name: mockup-pipeline
description: Generate professional device mockup compositions from website screenshots. Takes a URL or existing client slug, captures screenshots, fills composition templates, and exports to high-res PNG.
---

# Mockup Pipeline

Generate professional multi-device mockup compositions — website screenshots composited into device frames (laptop, phone, tablet, monitor, browser, book) and exported as high-res marketing PNGs.

## When to Use
- Client wants a visual showcase of their website across devices
- Creating marketing materials / portfolio pieces
- Building "Scale Secrets Summit"-style device spreads
- Generating social proof or portfolio mockups

## Pipeline Steps

### Step 1: Input & Screenshots

**Option A — From URL:**
```bash
cd mockup-generator
node scripts/capture-screenshot.js <url> output/<slug>/screenshots/
```
Captures desktop (1440x900), mobile (390x844), tablet (820x1180) at 2x resolution.

**Option B — From existing client:**
```bash
node scripts/bridge-config.js <client-slug>
# Then capture screenshots using the website from the config
node scripts/capture-screenshot.js <website-url> output/<slug>/screenshots/
```

**Option C — User-provided screenshots:**
Place files directly in `output/<slug>/screenshots/` as `desktop.png`, `mobile.png`, `tablet.png`.

### Step 2: Select Composition

Available composition templates in `templates/compositions/`:

| Template | Best For | Devices Used |
|----------|----------|-------------|
| `multi-device-spread` | Flagship showcase, portfolio hero | Monitor + MacBook + iPad + iPhone |
| `hero-single-phone` | Mobile-first products, apps | iPhone (large) |
| `hero-single-laptop` | SaaS, web platforms | MacBook (large) |
| `phone-laptop-duo` | Responsive design showcase | MacBook + iPhone |
| `isometric-grid` | Portfolio of multiple sites | 4 browser windows |
| `browser-showcase` | Feature highlight, landing pages | Browser window + feature list |

### Step 3: Assemble HTML

1. Read the selected composition template from `templates/compositions/`
2. Replace all `{{placeholders}}` with actual values:
   - `{{screenshot_desktop}}` → path to desktop screenshot (use relative path from the HTML file)
   - `{{screenshot_mobile}}` → path to mobile screenshot
   - `{{screenshot_tablet}}` → path to tablet screenshot
   - `{{badge_text}}`, `{{headline_line1}}`, `{{headline_accent}}`, etc.
   - `{{cta_text}}` → call-to-action button text
3. Override CSS custom properties for brand colors:
   ```css
   :root {
     --mockup-accent: #CLIENT_ACCENT;
     --mockup-bg: #CLIENT_BG;
   }
   ```
4. Save assembled HTML to `output/<slug>/html/`

**Image path rules:**
- Screenshots referenced from HTML should use relative paths
- For file:// rendering, use `../../../../path` if needed (Puppeteer resolves from the HTML file location)

### Step 4: Export to PNG

```bash
node scripts/export-mockup.js output/<slug>/html/ output/<slug>/png/ --size=1920x1080 --scale=2
```

**Available sizes:**
- `--size=1920x1080` — marketing banner (default)
- `--size=1080x1080` — Meta/Instagram square
- `--size=1080x1350` — Instagram portrait
- `--size=1200x628` — OG image / Facebook link preview

**Scale options:**
- `--scale=2` — high-res output, 2x dimensions (default)
- `--scale=1` — standard resolution

### Step 5: Verify

1. Check PNG file exists and has reasonable file size (1-5 MB typical)
2. Open the PNG and verify:
   - All device frames render correctly
   - Screenshots are visible inside frames (not blank/white)
   - Text is readable
   - Brand colors applied correctly
   - No rendering artifacts from 3D transforms

## Available Device Frames

Individual device templates in `templates/devices/`:
- `iphone.html` — iPhone with Dynamic Island notch
- `macbook.html` — MacBook with screen + keyboard base
- `ipad.html` — iPad with home indicator
- `monitor.html` — Desktop monitor with stand
- `browser.html` — Browser window with chrome (traffic lights + URL)
- `book.html` — 3D book/box mockup with spine

## CSS Theming

All templates use CSS custom properties from `templates/base-mockup.css`:
```css
:root {
  --mockup-bg: #0f172a;         /* Canvas background */
  --mockup-bg-end: #1e293b;     /* Gradient end */
  --mockup-accent: #10b981;     /* Accent color (CTA, highlights) */
  --mockup-text: #ffffff;       /* Primary text */
  --mockup-text-muted: #94a3b8; /* Secondary text */
  --device-bezel: #1a1a1a;      /* Device frame color */
  --font-heading: 'Montserrat'; /* Heading font */
  --font-body: 'Inter';         /* Body font */
}
```

Override any of these in the assembled HTML's `<style>` block to match client branding.

## Output Structure

```
output/<slug>/
├── screenshots/
│   ├── desktop.png
│   ├── mobile.png
│   └── tablet.png
├── html/
│   ├── mockup-multi-device.html
│   └── mockup-browser-showcase.html
├── png/
│   ├── mockup-multi-device.png
│   └── mockup-browser-showcase.png
└── mockup-config.json (if bridged from meta-ad-generator)
```

## Tips

- For the best results, capture screenshots with `--full-page` flag if the site has a single-page layout
- Use different portfolio sites for different devices in multi-device-spread to show variety
- Keep 3D perspective angles moderate (5-15 degrees) to avoid Puppeteer rendering artifacts
- The isometric-grid composition works great for showing multiple client sites from a portfolio
