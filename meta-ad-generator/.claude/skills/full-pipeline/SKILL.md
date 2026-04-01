---
name: full-pipeline
description: Full pipeline — paste client info, get finished Meta ad PNGs
---

# Full Ad Generation Pipeline

## When to Use
Run this skill when you want to go from raw client info to finished Meta ad creatives in one command. This orchestrates all individual skills in sequence.

## How to Use
1. Type `/ad-generate` in Claude Code
2. Paste the client's information (any format — form fields, bullet points, free text)
3. Claude will run the full pipeline automatically

## Pipeline Steps

### Step 1: Client Intake
- Parse the pasted client data into a structured brief
- Detect language
- Create output directories
- Save `client-brief.json`
- **Follows**: `.claude/skills/1-client-intake/SKILL.md`

### Step 2: Brand Scraping
- Visit the client's website URL from the brief
- Extract brand colors, fonts, images, logo
- Download assets to local directory
- Save `brand-assets.json`
- **Follows**: `.claude/skills/2-brand-scraper/SKILL.md`

### Step 3: Ad Copy Generation
- Generate 6 ad copy sets using different copywriting frameworks
- Each set: primary text (short + long), headline, description, CTA
- All in the client's language
- Save `ad-copy.json`
- **Follows**: `.claude/skills/3-ad-copy/SKILL.md`

### Step 4: Ad Design
- Combine brand assets + copy into HTML/CSS ad creatives
- Fill layout templates with brand colors, fonts, and copy
- Generate 6 HTML files (one per copy set / layout)
- NO background images — use solid color gradients only
- NO logos on V2 (bold-statement) and V5 (benefit-stack)
- Center all text by default, break long headlines with `<br>`
- V6 editorial: white bg, Playfair Display serif, gold accents (built inline, no template file)
- Validate contrast and readability
- Save HTML files to `output/{client-slug}/html/`
- **Follows**: `.claude/skills/4-ad-designer/SKILL.md`

### Step 5: PNG Export
- Run Puppeteer to screenshot each HTML file at 1080x1080
- Save PNGs to `output/{client-slug}/png/`
- Verify file sizes and dimensions
- **Follows**: `.claude/skills/5-export-png/SKILL.md`

## After Pipeline Completes

Print a final summary:

```
============================================
  AD GENERATION COMPLETE
============================================

Client:       {client_name}
Language:     {language}
Website:      {website}

Generated:
  - Client Brief:    output/{slug}/brief/client-brief.json
  - Brand Assets:    output/{slug}/brief/brand-assets.json
  - Ad Copy (6 sets): output/{slug}/copy/ad-copy.json
  - HTML Ads (6):    output/{slug}/html/
  - PNG Ads (6):     output/{slug}/png/

Ad Creatives:
  1. ad-v1-hero-overlay.png     — PAS framework
  2. ad-v2-bold-statement.png   — AIDA framework
  3. ad-v3-split-horizontal.png — Before/After/Bridge
  4. ad-v4-comparison.png       — Before vs After Comparison
  5. ad-v5-benefit-stack.png    — Benefit Stack
  6. ad-v6-editorial.png        — Editorial (serif + gold accents)

Next Steps:
  - Review PNGs in output/{slug}/png/
  - Run /ad-variations for A/B test versions
  - Upload to Meta Ads Manager
============================================
```

## Error Handling

- **If brand scraper fails**: Continue with default colors (from reference/color-theory.md). Flag to user that brand colors are defaults and may need manual adjustment.
- **If no images found on website**: Use solid color backgrounds. Suggest user provides hero images manually.
- **If Puppeteer export fails**: Save HTML files and instruct user on manual browser screenshot method.
- **If website is unreachable**: Skip brand scraping, ask user to provide colors/fonts/logo manually.

## Optional: Run with Variations
After the main pipeline, the user can optionally run:
```
/ad-variations
```
This generates 3-6 additional A/B test variations and a test matrix.
