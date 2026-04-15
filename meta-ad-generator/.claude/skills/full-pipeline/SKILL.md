---
name: full-pipeline
description: Use when making ads for a CLIENT (not Sharpify) — "generate ads for [client name/link]", "make ads for this client", "create ads for [business]". Paste client info or link, get finished Meta ad PNGs. NOT for Sharpify's own ads (use reklamas-meta-sharpify or reklamas-meta-sharpify-eng instead).
---

# Full Ad Generation Pipeline

## When to Use
Run this skill when you want to go from raw client info to finished Meta ad creatives in one command. This orchestrates all individual skills in sequence.

## How to Use
1. Type `/ad-generate` in Claude Code
2. Paste the client's information (any format — form fields, bullet points, free text)
3. Claude will run the full pipeline automatically

## FIRST STEP (always)

Before starting the pipeline, **read `notes.md`** (sibling file in this skill directory). It contains client-pipeline-specific learnings from past sessions — template preferences, design patterns, copy quirks, things to avoid.

When the user gives feedback during this session, **append it to `notes.md`** using the format defined in that file. This builds the system's memory over time without you having to re-explain.

## Pipeline Steps

### Step 1: Client Intake
- Parse the pasted client data into a structured brief
- Detect language, classify `product_type` and `ad_type`
- Determine `ad_count` (6-8 based on data richness)
- Create output directories
- Save `client-brief.json`
- **Follows**: `.claude/skills/1-client-intake/SKILL.md`

**Routing check after Step 1:**
- If `ad_type` resolves to a Sharpify brand ad → stop and direct user to use the `reklamas-meta-sharpify` skill instead
- If `ad_type` is `"client-tangible"` or `"client-intangible"` → continue

### Step 2: Brand Scraping
- Visit the client's website URL from the brief
- Extract brand colors, fonts, images, logo
- Download assets to local directory
- Resolve `ad_type` if still null (from scraped product category)
- Flag `has_product_images` in brand-assets.json
- Save `brand-assets.json`
- **Follows**: `.claude/skills/2-brand-scraper/SKILL.md`

**Image check after Step 2 (tangible only):**
- If `ad_type` is `"client-tangible"` and `has_product_images` is `false`:
  - Ask user: "No product images were found on the website. Can you provide product photos? Or should I generate them with AI?"
  - If user provides photos: save to `output/{slug}/brief/images/product-*.{ext}`
  - If user chooses AI generation: note this — the ad designer will generate images during Step 4

### Step 3: Ad Copy + Template Selection
- Browse the full template library (`.claude/skills/8-extra-templates/SKILL.md` + `templates/extra/*.md` + `template-pages/` PNG previews)
- **Choose templates freely** — pick whatever 6-8 templates best serve this client's story
- No mandatory templates, no category restrictions — just pick what works
- For tangible: every ad needs product imagery
- For intangible: no stock photos, use gradients/CSS visuals
- Generate copy sets paired with selected templates
- Save `ad-copy.json`
- **Follows**: `.claude/skills/3-ad-copy/SKILL.md`

### Step 4: Ad Design
- For **base templates**: fill HTML template with brand colors, fonts, and copy
- For **extra templates** (`layout_recommendation` starting with `"extra:"`): generate HTML inline from the template's `.md` description or registry entry
- For **tangible ads**: ensure every ad features product imagery. Run AI generation if needed
- For **intangible ads**: no generic stock photos. Use gradients, CSS-built visuals, or template-specific treatments
- Center all text by default, break long headlines with `<br>`
- Validate contrast and readability
- Save HTML files to `output/{client-slug}/html/`
- **Follows**: `.claude/skills/4-ad-designer/SKILL.md`

### Step 5: PNG Export
- Run Puppeteer to screenshot each HTML file at 1080x1080
- Save PNGs to `output/{client-slug}/png/`
- Verify file sizes and dimensions
- **Follows**: `.claude/skills/5-export-png/SKILL.md`

## After Pipeline Completes

Print a final summary showing the **actual templates used** (not a generic list):

```
============================================
  AD GENERATION COMPLETE
============================================

Client:       {client_name}
Language:     {language}
Ad Type:      {ad_type}
Website:      {website}

Generated:
  - Client Brief:      output/{slug}/brief/client-brief.json
  - Brand Assets:      output/{slug}/brief/brand-assets.json
  - Ad Copy ({n} sets): output/{slug}/copy/ad-copy.json
  - HTML Ads ({n}):    output/{slug}/html/
  - PNG Ads ({n}):     output/{slug}/png/

Ad Creatives:
  1. ad-1-{template-name}.png  — {framework} ({category})
  2. ad-2-{template-name}.png  — {framework} ({category})
  3. ad-3-{template-name}.png  — {framework} ({category})
  4. ad-4-{template-name}.png  — {framework} ({category})
  5. ad-5-{template-name}.png  — {framework} ({category})
  6. ad-6-{template-name}.png  — {framework} ({category})
  [7. ad-7-... if ad_count > 6]
  [8. ad-8-... if ad_count > 7]

Next Steps:
  - Review PNGs in output/{slug}/png/
  - Run /ad-variations for A/B test versions
  - Upload to Meta Ads Manager
============================================
```

## Error Handling

- **If brand scraper fails**: Continue with default colors (from reference/color-theory.md). Flag to user that brand colors are defaults.
- **If no images found on website**: For tangible — ask user for product photos or offer AI generation. For intangible — use solid color backgrounds.
- **If Puppeteer export fails**: Save HTML files and instruct user on manual browser screenshot method.
- **If website is unreachable**: Skip brand scraping, ask user to provide colors/fonts/logo manually.
- **If template .md file not found**: Fall back to the template description in the registry skill. The ad designer can generate HTML from either source.

## Optional: Run with Variations
After the main pipeline, the user can optionally run:
```
/ad-variations
```
This generates 3-6 additional A/B test variations and a test matrix.

## Optional: Video Ad Generation
After static ads are complete, offer to generate video ads using the Remotion pipeline:
```
cd ../remotion-videos && node scripts/bridge-config.js {client-slug}
```
Then follow the `remotion-videos/.claude/skills/video-pipeline/SKILL.md` skill to configure scenes and render MP4 video ads (feed 1:1, Reels 9:16). The video pipeline reuses the same `client-brief.json` and `brand-assets.json` — no duplicate data entry needed.
