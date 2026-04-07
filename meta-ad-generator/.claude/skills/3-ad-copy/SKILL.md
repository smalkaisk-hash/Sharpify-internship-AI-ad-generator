---
name: 3-ad-copy
description: Generate Meta ad copy sets with dynamic template selection based on client ad type (tangible/intangible)
---

# Ad Copy Generator — Persuasive Copy + Dynamic Template Selection

## When to Use
Run this skill after `/ad-intake` (and optionally `/ad-brand`) to generate ad copy with matched templates for Meta feed ads.

## Prerequisites
- `client-brief.json` must exist in `output/{client-slug}/brief/`
- `client-brief.json` must have `ad_type` set (`"client-tangible"` or `"client-intangible"`)

## Instructions

1. **Read the client brief and reference files**:
   - `output/{client-slug}/brief/client-brief.json`
   - `output/{client-slug}/brief/brand-assets.json` — check `product_category.type` and `content` for client's language
   - `reference/copy-frameworks.md`
   - `reference/meta-ad-specs.md` (for character limits)
   - `.claude/skills/8-extra-templates/SKILL.md` — the template registry (for template selection)

2. **Determine ad count**: read `client-brief.json → ad_count` (default 6, max 8).

3. **Select templates** based on `ad_type` (see Template Selection below).

4. **Generate copy sets** — one per selected template. Each copy set pairs a copywriting framework with the selected template.

5. **Save output** to `output/{client-slug}/copy/ad-copy.json`.

---

## Template Selection

### For `client-tangible`

Every ad MUST feature product imagery prominently. Viewers should understand what the ad is about without reading.

**Step 1 — Select 2 base template anchors:**
- `hero-overlay` — product as hero image with gradient overlay + text
- `split-horizontal` — product on one side, benefits on the other

**Step 2 — Select 4-6 extra templates from these priority categories:**
1. `product-hero/` — always include 1-2 (the product IS the ad)
2. `data-driven/` — if client has stats, review counts, ingredients
3. `social-proof/` — if client has reviews/testimonials
4. `comparison/` — if client has competitive advantages or before/after
5. `promotional/` — if client has active offers, discounts, bundles

**Step 3 — Filter by eligibility:**
- Only select templates marked `Tangible: Yes` in the template registry
- Check `required_fields` can be filled from client data
- If a template needs product photos and none exist → skip it or flag for AI generation

**Step 4 — Add `image_requirements` per copy set:**
```json
"image_requirements": {
  "type": "product-photo | lifestyle | ai-generated",
  "description": "Product centered on white background with soft shadow",
  "source": "brief/images/product-1.jpg",
  "ai_prompt": null
}
```
- Use product photos from `brief/images/product-*.{ext}` when available
- If no product photos exist, set `"type": "ai-generated"` with a prompt describing the product based on the client brief

### For `client-intangible`

Each client should get a **unique mix of templates**. No two clients should get the same 6.

**Step 1 — Score template categories:**

Read the client brief and score each category (0-3 points):

| Category | +3 points | +2 points | +1 point |
|---|---|---|---|
| social-proof | Has testimonials/reviews | Has social proof credentials | Has user count |
| comparison | Has differentiator vs named competitors | Has pain points with clear before/after | Has pricing advantage |
| data-driven | Has specific numbers/stats | Has quantifiable results | Has review counts |
| editorial-authority | Has press coverage or awards | Has professional credentials | Has industry recognition |
| lifestyle | — | Brand is personality-driven | Audience is emotionally motivated |
| ugc-native | — | Audience is social-media-savvy (18-35) | Brand voice is casual |
| promotional | Has active offer/discount | Has pricing/bundle info | Has seasonal hook |
| product-hero | — | Has app/digital product | Has features to diagram |

**Step 2 — Select top categories:**
- Sort categories by score descending
- Take the top 4-5 scoring categories (skip any scoring 0)

**Step 3 — Pick 1 template per selected category:**
- From each top category, pick the single best template whose description matches the client data
- Only select templates marked `Intangible: Yes` in the registry
- Prefer templates with `[.md]` files (richer descriptions) but any template in the registry is valid

**Step 4 — Add 1-2 base template anchors:**
- `hero-overlay` (with gradient background, no hero photo) — for the main hook/PAS copy
- `benefit-stack` — for the feature/benefit summary
- OR `comparison` — if Before vs After scored high

**Step 5 — Rotation check:**
- Look at `output/` directory for the last 3 client folders
- Read their `ad-copy.json` files to see which extra template IDs were used
- Avoid reusing the same extra template IDs if possible (swap for another template from the same category)

**Result:** 6-8 templates, each unique to this client's data profile.

---

## Copy Set Structure

For each selected template, generate a copy set:

```json
{
  "id": "ad-1",
  "framework": "PAS | AIDA | Before-After | Comparison | Benefit-Stack | Editorial | Social-Proof | Curiosity-Gap | Direct-Offer | Story",
  "layout_recommendation": "hero-overlay | extra:social-proof/17-verified-review-card",
  "primary_text": {
    "short": "Max 125 chars — shows without 'See more' truncation",
    "long": "Full version, up to 500 chars with emoji and line breaks"
  },
  "headline": "Max 27 chars ideally, 40 chars absolute max",
  "description": "Max 27 chars — supporting detail",
  "cta_button": "One of Meta's CTA options (e.g., Book Now)",
  "cta_text_on_image": "Text shown ON the ad image CTA button",
  "hook_type": "question / bold-claim / statistic / story / pain-point",
  "image_requirements": null,
  "template_fields": {}
}
```

### `layout_recommendation` format:
- Base template: `"hero-overlay"`, `"bold-statement"`, `"split-horizontal"`, `"comparison"`, `"benefit-stack"`, `"testimonial-card"`
- Extra template: `"extra:{category}/{id}-{name}"` — e.g., `"extra:social-proof/17-verified-review-card"`

### `template_fields` object:
When using an extra template, include any template-specific fields the designer needs:
```json
"template_fields": {
  "before_items": ["Pain 1", "Pain 2", "Pain 3", "Pain 4", "Pain 5"],
  "after_items": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"],
  "stat_1": "2,300+",
  "stat_1_label": "clients served",
  "reviewer_name": "Anna K.",
  "review_text": "..."
}
```
This lets the designer fill template-specific placeholders beyond the standard headline/body/CTA.

---

## Matching Frameworks to Templates

Don't force a framework onto a template — match them naturally:

| Template Type | Best Frameworks |
|---|---|
| hero-overlay, bold-statement | PAS, AIDA, Curiosity-Gap |
| split-horizontal, comparison | Before-After, Comparison |
| benefit-stack | Benefit-Stack, Direct-Offer |
| social-proof templates | Social-Proof, Story |
| editorial-authority templates | Editorial, Story |
| lifestyle templates | AIDA, Curiosity-Gap, Story |
| ugc-native templates | Social-Proof, Story, Curiosity-Gap |
| product-hero templates | Benefit-Stack, Direct-Offer, AIDA |
| data-driven templates | Social-Proof, Direct-Offer |
| promotional templates | Direct-Offer, AIDA |

---

## Copywriting Frameworks Reference

Use these frameworks. You're not limited to 6 — pick whichever fits each template best:

1. **PAS** — Problem → Agitate → Solution
2. **AIDA** — Attention → Interest → Desire → Action
3. **Before-After** — Current struggle → Transformed state → Bridge (the offer)
4. **Comparison** — Side-by-side: without vs with the product/service
5. **Benefit-Stack** — List 3-5 key benefits with short descriptions
6. **Editorial** — Magazine-ad feel, elegance IS the hook
7. **Social-Proof** — Lead with testimonial, review, or user count
8. **Curiosity-Gap** — Provocative hook that earns the click, minimal reveal
9. **Direct-Offer** — Lead with the offer, price, or promotion
10. **Story** — Personal narrative or client transformation story

---

## Copy Writing Rules

**Hook (first line of primary_text):**
- Must be max 10 words
- Must stop the scroll — use: question, bold claim, "imagine..." statement, or number
- NEVER start with the client's name or "We offer..."

**Language:**
- Write in the language specified in `client-brief.json → language`
- For Latvian (lv): use informal "tu" for coaching/personal brands
- Mirror the tone of the client's own website copy (from `brand-assets.json → content`)
- Cultural sensitivity: Latvian audiences respond to warmth + authenticity, not American-style hype

**Emoji usage:**
- ✅ checkmarks for list items in primary text only
- No decorative emojis (🔧, 🏆, 👇, ⭐, 🌍 etc.)
- Never in headlines
- Keep it professional and conversational

**CTA matching:**
- Discovery call → "Piesakies bezmaksas sarunai" / "Book Now"
- Product purchase → "Iegādāties tagad" / "Shop Now"
- Lead magnet → "Lejupielādēt" / "Download"
- Information → "Uzzināt vairāk" / "Learn More"

---

## Category-Aware Copy Rules

### Tangible Products (physical items)

**Headlines:** Product-focused. Name the product. Highlight material, craftsmanship, unique feature.
- Good: "Premium Leather Wallet — Built to Last"
- Bad: "Finally Find What You've Been Looking For" (too vague)

**Primary text:** Lead with what the customer gets. Features, materials, quality, what's included.

**Hooks:** Bold claims with specifics: "100% Italian Leather" / "Handmade in 48h" / "3x Thicker Than Store-Bought"

**CTAs:** "Shop Now" / "Order Today" / "Get Yours" / Latvian: "Iegādāties tagad" / "Pasūtīt"

### Intangible Products (services, courses, digital, coaching)

**Headlines:** Transformation-focused. What changes in the buyer's life.

**Primary text:** Lead with pain points and outcomes. Sell the result, not the thing.

**Hooks:** Questions, pain points, "imagine..." openers, emotional triggers.

**CTAs:** "Sign Up" / "Book Now" / "Learn More" / Latvian: "Piesakies" / "Uzzināt vairāk"

---

## Output

Save to `output/{client-slug}/copy/ad-copy.json`:

```json
{
  "client_name": "...",
  "client_slug": "...",
  "language": "lv",
  "ad_type": "client-tangible | client-intangible",
  "generated_at": "ISO timestamp",
  "copy_sets": [
    { ...copy set 1... },
    { ...copy set 2... },
    ...
  ]
}
```

**Print summary**: show a table with: ad number, template name, framework, headline, hook type.

---

## Quality Checklist
Before saving, verify each copy set:
- [ ] Hook is under 10 words and scroll-stopping
- [ ] Primary text short version is under 125 characters
- [ ] Headline is under 40 characters
- [ ] CTA matches the funnel stage
- [ ] All text is in the correct language
- [ ] No invented facts or claims not in the brief
- [ ] Each set uses a genuinely different angle/framework
- [ ] Templates are varied — not all from the same category
- [ ] For tangible: every ad has `image_requirements` set
- [ ] **ANTI-AI SLOP CHECK**: Run the 7-point self-check from `.claude/skills/7-anti-ai-slop/SKILL.md`
