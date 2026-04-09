---
name: video-pipeline
description: Generate professional Meta video ads using Remotion. Accepts a client URL or existing client-brief.json, builds a dynamic video composition with transitions, brand colors, and product images. Use when making VIDEO ads for a client.
---

# Video Ad Pipeline

Generate professional Meta video ads (MP4) for clients using the Remotion framework.

## When to Use
- User asks for a **video ad** (not a static PNG ad)
- User provides a URL and wants an animated/video ad
- User wants to convert existing static ad data into a video
- User says "make a video for [client]" or "video ad for [URL]"

## Prerequisites
- Remotion project at `remotion-videos/` must be set up (npm install done)
- For existing clients: `meta-ad-generator/output/{slug}/brief/` must exist
- For new clients: run the static pipeline first, or scrape manually

## Pipeline Steps

### Step 1: Get Client Data

**If existing client (brief already exists):**
```bash
cd remotion-videos && node scripts/bridge-config.js {client-slug}
```
This copies product images and generates `public/configs/{slug}.json`.

**If new client (URL only):**
1. First run the brand scraper from meta-ad-generator:
   ```bash
   cd meta-ad-generator && node scripts/scrape-brand.js {url}
   ```
2. Then run the bridge:
   ```bash
   cd remotion-videos && node scripts/bridge-config.js {client-slug}
   ```

### Step 2: Plan Scene Sequence

Choose 4-6 scenes based on the ad framework. Always start with a **hook** and end with a **CTA**.

**Available scene types:**
| Type | Best for | Required props |
|------|----------|---------------|
| `hook` | Opening attention grabber | headline, subtext |
| `product` | Product showcase with image | headline, imagePath, productName, price |
| `benefits` | Feature/benefit list | headline, items[] |
| `comparison` | Before/After | headline, items[] (first half = before, second half = after), beforeLabel, afterLabel |
| `testimonial` | Social proof quote | headline (the quote), subtext (reviewer name), rating |
| `stats` | Animated numbers | headline, items[] (format: "2300+ customers") |
| `cta` | Call to action | headline, subtext, items[0] = button text |

**Framework → Scene mapping:**

| Framework | Scene Flow |
|-----------|-----------|
| **PAS** (Pain-Agitate-Solve) | hook(pain) → benefits(agitate) → product(solve) → cta |
| **AIDA** | hook(attention) → product(interest) → benefits(desire) → cta(action) |
| **Before/After** | comparison → product → testimonial → cta |
| **Social Proof** | testimonial → stats → product → cta |
| **Full Showcase** | hook → product → benefits → comparison → testimonial → cta |

### Step 3: Configure the Composition

Edit `src/Root.tsx` to set the `defaultProps` for the DynamicAd composition with the client's brand config and scene sequence.

**Brand config comes from** `public/configs/{slug}.json` — read it and map to `VideoInputProps`.

**Scene config rules:**
- Each scene gets `durationFrames` (90 = 3 seconds at 30fps)
- Hook: 90 frames (3s)
- Product/Benefits/Comparison: 90-120 frames (3-4s)
- CTA: 75 frames (2.5s)
- Total: 15-20 seconds ideal for Meta feed ads
- Transitions: use "fade" for most, "slide-left" for product reveals, "slide-up" for dramatic moments

**Format options:**
- `1:1` (1080x1080) — Meta feed ads
- `9:16` (1080x1920) — Reels / Stories
- `4:5` (1080x1350) — Instagram feed (taller)

### Step 4: Preview

```bash
cd remotion-videos && npm run dev
```
Open http://localhost:3123 to preview. Scrub the timeline to check each scene.

### Step 5: Render to MP4

```bash
cd remotion-videos
npx remotion render DynamicAd-Feed out/{slug}-feed.mp4 --codec=h264 --crf=18
npx remotion render DynamicAd-Reels out/{slug}-reels.mp4 --codec=h264 --crf=18
```

## Design Rules

### Text
- Headlines: 56-72px minimum (must be readable on mobile)
- Body: 28-36px minimum
- Always use the brand's heading font for headlines, body font for body text
- White text on dark/colored backgrounds, brand text color on light backgrounds

### Colors
- Use brand colors from `brand-assets.json` — never hardcode colors
- Accent color for highlights, dividers, CTA glow
- Primary color for backgrounds and overlays

### Animation
- Use `damping: 200` springs for professional, smooth feel (not bouncy)
- Stagger list items by 10 frames each
- Floating product images: `Math.sin(frame / 15) * 6` for subtle bob
- CTA button: gentle pulse `1 + Math.sin(frame / 8) * 0.025`

### Images
- Product images go in `public/photos/{slug}/`
- Reference via `staticFile("photos/{slug}/filename.jpg")`
- Use `objectFit: "cover"` with `borderRadius: 16`
- Add `drop-shadow` for depth on light backgrounds

### Safe Zones (for Reels 9:16)
- Top: 150px (username/avatar overlay)
- Bottom: 170px (caption/CTA overlay)
- Sides: 60px
- The SafeZone component handles this automatically

## Ad Copy Quality Rules
- Follow the anti-AI-slop rules from the meta-ad-generator
- No generic filler ("in today's fast-paced world")
- Be specific, concrete, direct
- Use the client's actual data (pain points, benefits, prices)
- Match the brand tone from brand-assets.json

## File Structure
```
remotion-videos/
├── src/
│   ├── DynamicAd.tsx          ← Main dynamic composition
│   ├── Root.tsx               ← Composition registry + default props
│   ├── types/VideoConfig.ts   ← TypeScript types
│   └── components/
│       ├── animations/        ← FadeSlideIn, StaggeredList, ScaleSpring, TextReveal
│       ├── layout/            ← SafeZone, BrandBackground, BrandText
│       └── scenes/            ← SceneHook, SceneProduct, SceneBenefits, etc.
├── scripts/
│   └── bridge-config.js       ← meta-ad-generator → Remotion bridge
├── public/
│   ├── photos/{slug}/         ← Product images per client
│   └── configs/{slug}.json    ← Video config per client
└── out/                       ← Rendered MP4 output
```
