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

You have access to the full template library — 6 base HTML templates in `templates/layouts/` and 56+ extended templates described in `.claude/skills/8-extra-templates/SKILL.md` and `templates/extra/*.md` files. There are also 319 PNG previews in `template-pages/` for visual reference.

**There are no mandatory templates.** Choose whatever templates best serve this specific client. Variety is the goal — each ad should use a different template to give the client a diverse ad set.

### How to choose:

1. **Read the client brief thoroughly** — understand who they are, what they sell, what data they have (testimonials, stats, competitors, offers, awards, etc.)
2. **Browse the template registry** (skill 8) and the `.md` files in `templates/extra/` — find templates that match this client's story
3. **Pick 6-8 templates** that create a varied, compelling ad set. Mix categories — don't pick 6 social-proof templates. Use different visual approaches (text-heavy, image-centric, comparison, social mock-up, editorial, etc.)
4. **Match a copywriting framework to each template** naturally — a social-proof template gets Social-Proof copy, a comparison template gets Comparison copy, etc.

### The only rule — tangible vs intangible:

**Tangible** (physical products): every ad must include product imagery so viewers understand the product without reading. Use product photos from `brief/images/` or AI-generated images. Add `image_requirements` to each copy set:
```json
"image_requirements": {
  "type": "product-photo | lifestyle | ai-generated",
  "description": "Product centered on white background with soft shadow",
  "source": "brief/images/product-1.jpg",
  "ai_prompt": null
}
```

**Intangible** (services/digital): no generic stock photos. Use solid color gradients, CSS-built visuals (phone mockups, social screenshots, review cards), or template-specific treatments. `image_requirements` is `null`.

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
