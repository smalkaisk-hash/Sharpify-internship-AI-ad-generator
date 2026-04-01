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

2. **Check product category** from `brand-assets.json → product_category.type`:
   - This determines which templates are eligible and which design rules apply
   - See "Template Eligibility by Category" and "Category-Specific Design Rules" sections below

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

4. **For each of the 5 copy sets** in `ad-copy.json`:

   a. **Select the layout template** based on `layout_recommendation`, filtered by category eligibility (see table below):
      - `"hero-overlay"` → `templates/layouts/hero-overlay.html`
      - `"bold-statement"` → `templates/layouts/bold-statement.html`
      - `"split-horizontal"` → `templates/layouts/split-horizontal.html`
      - `"comparison"` → `templates/layouts/comparison.html`
      - `"benefit-stack"` → `templates/layouts/benefit-stack.html`
      - `"editorial"` → Custom inline (Playfair Display serif, white bg, gold accents — no template file, build from scratch each time)

   b. **Read the template file** and replace ALL placeholders:
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
   - Example: `file:///C:/Users/Ritvars Volfs/meta-ad-generator/output/aiva-juste/brief/images/hero-1.jpg`

8. **Print summary**: List all generated HTML files with their layout type, copy framework, and product category applied.

## Template Eligibility by Category

Before selecting a layout template, check `brand-assets.json → product_category.type` and filter to eligible templates:

| Template | Tangible | Intangible | Notes |
|---|---|---|---|
| hero-overlay | Yes | Yes | Tangible: product photo as background. Intangible: gradient background |
| bold-statement | No | Yes | Text-only layout — great for outcomes, not for product showcase |
| split-horizontal | Yes | Yes | Tangible: product image + text. Intangible: before/after transformation |
| comparison | No | Yes | Before vs After is transformation-focused |
| testimonial-card | Yes | Yes | Social proof works universally |
| benefit-stack | Yes | Yes | Works for product specs or service benefits |
| editorial | Yes | Yes | Works for both — elegant product showcase or service presentation |

If a copy set's `layout_recommendation` maps to a template that is NOT eligible for the detected category, substitute the closest eligible template instead (e.g., tangible PAS → hero-overlay with product photo instead of bold-statement).

## Category-Specific Design Rules

### Tangible Products (physical items)
- **Product photos ARE allowed and encouraged** as hero elements and backgrounds
- Use product images from `brand-assets.json → images.products` (paths: `brief/images/product-*.{ext}`)
- The product image should be the centerpiece of the ad — text supports the image
- Clean layouts that let the product speak — don't overcrowd with text
- hero-overlay: use product photo as the background with gradient overlay for text readability
- split-horizontal: product image on one side, benefits/text on the other

### Intangible Products (services, courses, digital) — Default Rules
- **DO NOT use background images or hero photos in any ad.** Use solid brand color backgrounds or gradients instead.
- This applies to ALL intangible layouts: hero-overlay, bold-statement, split-horizontal, etc.
- Use brand primary/secondary colors for gradients (e.g., `linear-gradient(160deg, secondary 0%, primary 50%, secondary 100%)`)
- For split-horizontal: replace the image top half with a color block featuring key info (price, event name, etc.)

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
