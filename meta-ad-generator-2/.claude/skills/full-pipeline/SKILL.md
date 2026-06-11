---
name: full-pipeline
description: Use when making ads for a CLIENT (not Sharpify) — "generate ads for [client name/link]", "make ads for this client", "create ads for [business]". Paste client info or link, get finished Meta ad PNGs. NOT for Sharpify's own ads (use reklamas-meta-sharpify or reklamas-meta-sharpify-eng instead).
---

# Full Ad Generation Pipeline

## When to Use
Raw client info → finished Meta ad PNGs in one session. Orchestrates all five steps in sequence with validation gates between each.

## First Step (always)
Before anything else, read both:
1. `clients/CLAUDE.md` — client-workspace rules (tangible/intangible routing, design, voice calibration)
2. `clients/notes.md` — accumulated learnings from past client sessions

When the user gives feedback during this session, append it to `clients/notes.md` using the format in that file.

---

## Pipeline Execution

Run each step in order. **Do not proceed to the next step if a gate check fails.**

---

### STEP 1 — Client Intake

**Goal:** Parse raw client data into `client-brief.json`.

**Do:**
- Detect language automatically
- Classify `product_type` (`tangible` / `intangible`) and set `ad_type` accordingly
- Determine `ad_count` (default 6, max 8 — scale with data richness)
- Create output directories:
  ```
  clients/output/{slug}/brief/images/
  clients/output/{slug}/copy/
  clients/output/{slug}/html/
  clients/output/{slug}/png/
  ```
- Save `clients/output/{slug}/brief/client-brief.json`
- **Follows:** `.claude/skills/1-client-intake/SKILL.md`

**Gate check after Step 1:**
- [ ] `client-brief.json` exists and contains: `client_slug`, `language`, `product_type`, `ad_type`, `ad_count`, `website`
- [ ] `ad_type` is one of: `client-tangible`, `client-intangible`
- [ ] If `ad_type` resolves to a Sharpify brand → **STOP**, direct user to `reklamas-meta-sharpify` or `reklamas-meta-sharpify-eng`

---

### STEP 2 — Brand Scraping

**Goal:** Extract brand colors, fonts, and images from the client's website.

**Do:**
- Prefer Figma MCP if a Figma URL was provided in the brief (Figma beats scraped CSS)
- Fallback: run `node scripts/scrape-brand.js {website}` to scrape the live site
- Download hero images, logos, product photos into `clients/output/{slug}/brief/images/`
- Flag `has_product_images: true/false` in `brand-assets.json`
- Save `clients/output/{slug}/brief/brand-assets.json`
- **Follows:** `.claude/skills/2-brand-scraper/SKILL.md`

**Gate check after Step 2:**
- [ ] `brand-assets.json` exists and contains: `colors.suggested`, `typography.suggested`
- [ ] `product_category.type` is set
- [ ] **Tangible only:** if `has_product_images: false` → **STOP**, ask user:
  *"No product images were found on the website. Please provide product photos, or type 'generate with AI' and I'll create them during Step 4."*
  Do not proceed until product images are confirmed or AI generation is approved.

**If scraper fails:**
- Continue with default colors from `reference/color-theory.md`
- Flag to user: *"Brand scraper failed — using default colors. You can paste brand hex codes now if you have them."*

---

### STEP 3 — Ad Copy + Template Selection

**Goal:** Generate `ad_count` copy sets, each paired with a distinct template.

**Do:**
- Read `templates/registry.json` for programmatic template lookup — use `selection_guide.by_framework` and `selection_guide.by_product_niche` as starting points, then pick the best fit
- Calibrate voice: pull 2-5 real samples from `brand-assets.json → content.headings` and `content.key_paragraphs` before writing a single word
- Generate copy sets — each on a different framework and template
- Apply sentence-rhythm variance on every set (see CLAUDE.md §4 Anti-AI-Slop)
- Save `clients/output/{slug}/copy/ad-copy.json`
- **Follows:** `.claude/skills/3-ad-copy/SKILL.md`

**Gate check after Step 3:**
Run copy validation:
```bash
node scripts/validate-copy.js clients/output/{slug}/copy/ad-copy.json
```
- [ ] Script exits 0 (no errors)
- [ ] If errors exist → fix them before moving to Step 4
- [ ] Warnings may proceed but should be reviewed

---

### STEP 4 — Ad Design (HTML)

**Goal:** Build one 1080x1080 HTML file per copy set.

**Do:**
- For **base templates** (`layout_recommendation` has no `extra:` prefix): read the HTML file from `templates/layouts/`, replace all `{{placeholder}}` tokens
- For **extra templates** (`layout_recommendation` starts with `extra:`): generate HTML inline from the template description in `templates/extra/{category}/{id}-{name}.md` or from `templates/registry.json`
- Fix `base.css` path to absolute: `{absolute-project-root}/templates/base.css`
- Fix Google Fonts links for any non-standard fonts
- **Tangible:** every ad must include product imagery — use `brief/images/product-*.{ext}` or run:
  ```bash
  node scripts/generate-image.js "{ai_prompt}" "clients/output/{slug}/brief/images/generated-{n}.png"
  ```
  Retry failed generations **one at a time** (never parallel — see CLAUDE.md §3)
- **Intangible:** no generic stock photos — use brand color gradients or CSS-built visuals
- Run three sanity checks per ad (scroll-stop, read-aloud, generic-swap) as defined in `.claude/skills/4-ad-designer/SKILL.md`
- Save HTML files to `clients/output/{slug}/html/ad-{n}-{template-name}.html`
- **Follows:** `.claude/skills/4-ad-designer/SKILL.md`

**Gate check after Step 4:**
- [ ] HTML file count equals `ad_count`
- [ ] Every file opens cleanly in a browser (no broken paths visible in source)
- [ ] Every tangible ad has a product image path that resolves to an existing file
- [ ] No `{{placeholder}}` tokens left unfilled (grep: `grep -r "{{" clients/output/{slug}/html/`)

---

### STEP 5 — PNG Export

**Goal:** Screenshot every HTML ad to a 1080x1080 PNG.

**Do:**
```bash
node scripts/export-png.js "clients/output/{slug}/html" "clients/output/{slug}/png"
```
- Wait for fonts to load (the script handles this — do not interrupt)
- **Follows:** `.claude/skills/5-export-png/SKILL.md`

**Gate check after Step 5:**
Run output validation:
```bash
node scripts/validate-output.js clients/output/{slug}/png {ad_count}
```
- [ ] Script exits 0 (no errors)
- [ ] All PNGs are exactly 1080×1080px
- [ ] All PNGs are between 50 KB and 2 MB
- [ ] PNG count matches `ad_count`

If validation fails:
- File too small (< 50 KB): open the HTML in a browser, diagnose the blank render, fix the path issue, re-export
- Wrong dimensions: verify `body { width: 1080px; height: 1080px }` in the HTML
- Missing count: check for HTML files that failed to export

---

## After Pipeline Completes

Run self-QA (silently, before showing results to user):
1. Open every PNG — catch wrapping, overflow, orphan words, broken images
2. Read every headline aloud — flag unnatural phrasing or wrong-language text
3. Verify every offer/badge/price matches the client's live landing page
4. If anything fails: fix the HTML, re-export only that ad, re-validate

Then print the final summary:

```
============================================================
  AD GENERATION COMPLETE
============================================================

Client:       {client_name}
Language:     {language}
Ad Type:      {ad_type}
Website:      {website}

Output:
  Brief:      clients/output/{slug}/brief/client-brief.json
  Brand:      clients/output/{slug}/brief/brand-assets.json
  Copy:       clients/output/{slug}/copy/ad-copy.json ({n} sets)
  HTML:       clients/output/{slug}/html/ ({n} files)
  PNG:        clients/output/{slug}/png/ ({n} files)

Creatives:
  1. ad-1-{template}.png  — {framework} · {category}
  2. ad-2-{template}.png  — {framework} · {category}
  3. ad-3-{template}.png  — {framework} · {category}
  4. ad-4-{template}.png  — {framework} · {category}
  5. ad-5-{template}.png  — {framework} · {category}
  6. ad-6-{template}.png  — {framework} · {category}
  [7-8 if ad_count > 6]

Validation:   copy ✓  |  output ✓
Next:         /ad-variations for A/B test versions
              "lets push em out to meta" to upload
============================================================
```

---

## Error Recovery

| Failure | Action |
|---------|--------|
| Scraper times out | Skip Step 2, use default palette, ask user for brand hex codes |
| No product images (tangible) | Block Step 3, ask user for photos or AI-gen approval |
| `validate-copy.js` exits 1 | Fix all ERRORs in `ad-copy.json`, re-run validation, then proceed |
| `generate-image.js` 503 | Retry one at a time (never parallel). Shorten prompt to ≤80 words |
| Puppeteer export fails | Save HTML, give user manual screenshot instructions (DevTools device mode, 1080×1080) |
| `validate-output.js` exits 1 | Fix the specific failing PNG(s), re-export only those, re-validate |
| Unfilled `{{placeholder}}` | Go back to Step 4, fill the missing token, re-export that ad |

---

## Optional: Variations
```
/ad-variations
```
Generates 3-6 A/B test variants (hook swaps, CTA color changes, layout swaps) from the completed ad set.

## Optional: Video
After static ads are complete, hand off to the Remotion pipeline:
```
cd ../remotion-videos && node scripts/bridge-config.js {client-slug}
```
The video pipeline reuses `client-brief.json` and `brand-assets.json` — no duplicate data entry needed.
