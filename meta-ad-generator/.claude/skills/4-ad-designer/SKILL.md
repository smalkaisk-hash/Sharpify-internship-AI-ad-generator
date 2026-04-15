---
name: 4-ad-designer
description: Generate HTML/CSS ad creatives by combining brand assets, copy, and layout templates
---

# Ad Designer — Build Visual Ad Creatives as HTML/CSS

## When to Use
Run this skill after `/ad-copy` to produce the actual ad creative files. This combines brand colors, fonts, images, ad copy, and layout templates into self-contained HTML files that render at exactly 1080x1080px.

## Prerequisites
- `output/{client-slug}/brief/client-brief.json`
- `output/{client-slug}/brief/brand-assets.json`
- `output/{client-slug}/copy/ad-copy.json`
- Layout templates in `templates/layouts/`
- Base styles in `templates/base.css`

## Instructions

1. **Read all input files**:
   - Client brief (for client name, language)
   - Brand assets (for colors, fonts, image paths)
   - Ad copy (for text content + layout recommendations)
   - Reference: `reference/color-theory.md` and `reference/meta-ad-specs.md`

2. **Check `ad_type`** from `client-brief.json → ad_type`:
   - `"client-tangible"` → every ad must feature product imagery (see "Design Rules by Ad Type" below)
   - `"client-intangible"` → no generic stock photos, use gradients/CSS-built visuals
   - The AI freely picks any template from the library — no eligibility filtering

3. **Prepare brand variables** from `brand-assets.json`:
   ```
   color_primary    → colors.suggested.primary
   color_secondary  → colors.suggested.secondary
   color_accent     → colors.suggested.accent (use for CTA)
   color_bg         → colors.suggested.background
   color_text       → colors.suggested.text
   color_cta_bg     → colors.suggested.accent (or complementary high-contrast color)
   color_cta_text   → #FFFFFF (or #1A1A2E if CTA bg is light)
   font_heading     → typography.suggested.heading
   font_body        → typography.suggested.body
   hero_image       → Absolute path to best hero image in brief/images/
   logo_url         → Absolute path to logo in brief/images/
   product_image    → (Tangible only) Absolute path to best product image in brief/images/product-*.{ext}
   ```

4. **For each copy set** in `ad-copy.json` (6-8 ads based on `ad_count`):

   a. **Select the layout** based on `layout_recommendation`:
   
      **Base templates** (direct file):
      - `"hero-overlay"` → `templates/layouts/hero-overlay.html`
      - `"bold-statement"` → `templates/layouts/bold-statement.html`
      - `"split-horizontal"` → `templates/layouts/split-horizontal.html`
      - `"comparison"` → `templates/layouts/comparison.html`
      - `"benefit-stack"` → `templates/layouts/benefit-stack.html`
      - `"testimonial-card"` → `templates/layouts/testimonial-card.html`
      - `"editorial"` → Custom inline (Playfair Display serif, white bg, gold accents)
      
      **Extra templates** (generate HTML from description):
      - When `layout_recommendation` starts with `"extra:"` → see "Generating HTML from Extra Templates" section below
      - Parse the path: `"extra:social-proof/17-verified-review-card"` → category `social-proof`, template `17-verified-review-card`

   b. **For base templates**, read the template file and replace ALL placeholders:
      - `{{color_primary}}` → hex color
      - `{{color_secondary}}` → hex color
      - `{{color_accent}}` → hex color
      - `{{color_bg}}` → hex color
      - `{{color_text}}` → hex color
      - `{{color_cta_bg}}` → hex color
      - `{{color_cta_text}}` → hex color
      - `{{font_heading}}` → font family name
      - `{{font_body}}` → font family name
      - `{{hero_image}}` → absolute file path or URL to hero image
      - `{{logo_url}}` → absolute file path or URL to logo
      - `{{client_name}}` → client name
      - `{{headline}}` → from copy set
      - `{{primary_text}}` → use `primary_text.short` for on-image text
      - `{{cta_text}}` → from `cta_text_on_image`
      - `{{language}}` → language code
      - Template-specific:
        - comparison: `{{before_label}}`, `{{after_label}}`, `{{before_icon_1}}` through `{{before_icon_5}}`, `{{before_text_1}}` through `{{before_text_5}}`, same for after
        - benefit-stack: `{{badge_text}}`, `{{subheadline}}`, `{{benefit_1_title}}`, `{{benefit_1_desc}}` through 4
        - bold-statement: `{{footer_tagline}}` — use "Sponsored · domain.com" or leave empty

   c. **Fix the base.css path** in each generated file — change `../base.css` to the absolute path: `{project-root}/templates/base.css`

   d. **Fix the Google Fonts link** — if brand uses custom fonts, add them to the Google Fonts URL. If brand fonts aren't on Google Fonts, fall back to Montserrat/Inter.

   e. **Validate contrast**:
      - Check headline color vs background: must be >= 4.5:1 ratio
      - For hero-overlay: white text on dark gradient is usually fine
      - For split-horizontal: white text on primary color background — verify primary isn't too light
      - For benefit-stack: text color on background color — verify
      - If contrast fails: darken the overlay, switch text to dark, or adjust background

   f. **Write the output HTML** to `output/{client-slug}/html/ad-v{n}-{layout}.html`
      Example: `output/aiva-juste/html/ad-v1-hero-overlay.html`

5. **For the benefit-stack template**, extract benefits:
   - Pull from `client-brief.json → offer`, `bonuses`, `differentiator`
   - Format as 4 items: title (3-5 words) + description (1 short sentence)
   - Map to `{{benefit_1_title}}`, `{{benefit_1_desc}}`, etc.

6. **For the testimonial-card template**:
   - Use the social proof copy set
   - Set `{{testimonial_text}}` from the generated testimonial quote
   - Set `{{author_name}}` to a generic label (e.g., "Programmas dalībniece" / "Program Participant")
   - Use the hero image as `{{author_photo}}` or a placeholder

7. **Image path handling**:
   - Use **absolute file paths** with `file://` protocol for local rendering
   - Convert backslashes to forward slashes for browser compatibility
   - Example: `file:///<absolute-project-path>/meta-ad-generator/output/<client-slug>/brief/images/hero-1.jpg`

8. **Print summary**: List all generated HTML files with their layout type, copy framework, and product category applied.

## Design Rules by Ad Type

### Tangible Products (physical items)
- **Product images are mandatory in every ad** — viewers must understand what the product is without reading
- Use product photos from `brief/images/product-*.{ext}` or AI-generated images from `image_requirements`
- The product should be visually prominent — text supports the image, not the other way around
- Adapt any template to feature the product: hero shots, lifestyle contexts, diagrams, grids, etc.

### Intangible Products (services, courses, digital)
- **No generic stock photos.** Default to solid color gradients or brand-colored backgrounds
- Template-specific visuals are fine — phone UI mockups, social post screenshots, review cards, comparison columns, etc. Build these with CSS/HTML
- Some templates (like UGC-native, lifestyle) may call for specific visual treatments — follow the template description

### No Logos
- **DO NOT include logos** in V2 (bold-statement) or V5 (benefit-stack) layouts — they are already removed from templates.
- For other layouts, only include a logo if specifically requested by the client.

### Text Alignment & Layout
- **Center all text** by default — headlines, body text, CTAs should be centered unless the layout specifically requires left-alignment (like benefit-stack list items).
- **Never let headline text run in a single long line.** Use `<br>` tags to break long headlines into organized, readable lines (e.g., "2 stundas.<br>1 sistēma.<br>10+ ietaupītas stundas nedēļā.").
- Each line should be a complete thought or phrase.

### No Repeated Information
- **Never repeat the same information twice on the same ad.** If the price appears in the CTA button (e.g., "Iegūsti mājaslapu — €59"), do NOT also put it in a badge or elsewhere. Use a trust signal or different info instead.

### Footer Rules
- V2 (bold-statement): either no footer, or a minimal "Sponsored · domain.com" style footer. No trust stats.
- V5 (benefit-stack): no footer at all — just the centered CTA button.

### V4 Layout — Comparison (Before vs After)
- V4 should use a **comparison/before-after layout**, NOT an ironic testimonial.
- Left side: "Before" / pain points in red tones (border + label color: #e74c3c)
- Right side: "After" / benefits in accent/green tones
- Each side: 5 items with emoji icon + short text
- Use clear, practical language — avoid generic phrases like "Profesionāla klātbūtne Google" — be specific about what the client actually gets.

### CTA Button Styling
- CTA button color can be customized to match the design. For light backgrounds (like benefit-stack), the button can use the primary brand color instead of the accent color to match other design elements (like numbered circles).

### Typography
- Headline: never more than 3 lines at the template's font size
- If headline is too long, reduce font-size by 8-12px via inline style OR add line breaks
- Body text: max 4 lines visible
- CTA text: single line, never wraps

### Color Overrides
- If `color_primary` is very light (luminance > 0.7): use it as background, switch text to dark
- If `color_primary` is very dark (luminance < 0.15): good for bold-statement background
- CTA button: must be the most visually prominent element — highest saturation color

### Spacing
- All text must stay within safe zones (40px from edges minimum)
- CTA button: minimum 40px from bottom edge
- Between headline and body: 20-28px gap

### Anti-AI Slop (CRITICAL)
- All on-image text MUST pass the anti-AI slop check from `.claude/skills/7-anti-ai-slop/SKILL.md`
- No banned phrases, no corporate filler, no vague claims
- Write like a human — plain words, specific claims, real information
- If a headline could apply to any business, it's too generic — rewrite it

### Anti-Overlap Rules (CRITICAL)
- **Every flex row that contains both a logo/brand and a CTA button MUST have `gap: 24px`**
- The CTA button gets `flex-shrink: 0` — it never compresses
- The logo/brand container gets `flex-shrink: 1; min-width: 0; overflow: hidden` — it yields space to the CTA if needed
- Logo images get `max-width: 100%` so they scale down within their container rather than overflowing
- After generating HTML, mentally verify: "Can the CTA button (min-width 280px) + logo + gap (24px) + padding (2×56px) fit within 1080px?" If not, reduce the logo height or switch to a text brand name
- This applies to: `.split-bottom`, `.bold-footer`, `.testimonial-footer`, `.benefit-footer`, and any custom footer rows

---

## Generating HTML from Extra Templates

When `layout_recommendation` starts with `"extra:"`, you generate the HTML inline (the same approach used for the editorial template). This is how the pipeline uses the 116+ extended templates without pre-built HTML files.

### Process

1. **Parse the template reference**: `"extra:social-proof/17-verified-review-card"` → look for:
   - First: `templates/extra/social-proof/17-verified-review-card.md` (if `.md` file exists)
   - Fallback: the template description in `.claude/skills/8-extra-templates/SKILL.md`

2. **Read the template description**:
   - If `.md` file exists: read the frontmatter (`required_fields`, `best_for`) and the body (visual layout description)
   - If no `.md` file: use the one-line description from the template registry index table

3. **Map client data to template fields**:
   - Read `template_fields` from the copy set in `ad-copy.json` — the copy generator pre-fills template-specific data
   - Map standard fields: brand colors, fonts, headline, body text, CTA
   - Map template-specific fields: `reviewer_name`, `stat_1`, `before_items`, etc.

4. **Build the HTML** following the template description:
   - Start with `<!DOCTYPE html>` and the standard 1080x1080 canvas
   - Link `base.css` (absolute path) + Google Fonts
   - Set CSS custom properties from brand assets (same as base templates)
   - Build the layout following the `.md` description literally — every visual element mentioned must appear
   - Use CSS flexbox/grid for layout positioning
   - Apply all design rules from above (contrast, spacing, anti-overlap, anti-AI slop)

5. **Apply ad type rules**:
   - **Tangible**: include product images where the template calls for them. Use `image_requirements` from the copy set
   - **Intangible**: no generic photos. Use solid gradients, CSS-built visual elements (phone UI mockups, social post cards, etc.), or brand color backgrounds
   - If the template description mentions lifestyle/product photography and the ad is intangible, replace with a CSS gradient or color block

6. **Handle AI-generated images** (tangible only):
   - If `image_requirements.type` is `"ai-generated"`, run:
     ```bash
     node scripts/generate-image.js "{ai_prompt}" "output/{client-slug}/brief/images/generated-{n}.png"
     ```
   - Use the generated image path in the HTML

7. **Save the file** as `output/{client-slug}/html/ad-{n}-{template-name}.html`
   - Example: `output/client-slug/html/ad-3-verified-review-card.html`
   - Note: file naming is now `ad-{n}-{name}` not `ad-v{n}-{layout}` — the numbering matches the copy set order

### Quality Checks for Extra Template HTML
- Does the HTML render at exactly 1080x1080px?
- Is all text readable (contrast >= 4.5:1)?
- Does the layout match the template description?
- Are brand colors applied correctly?
- Is the CTA button prominent and not overlapping other elements?
- Does on-image text pass the anti-AI slop check?
