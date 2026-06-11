---
name: 3-ad-copy
description: Generate 6-8 Meta ad copy sets (primary text, headline, CTA) with dynamic template selection per client, pairing each copy variant with a template from the registry. Trigger this skill whenever client-brief.json and brand-assets.json exist and the user says "write the copy", "generate ad text", "make the ads", or "do step 3" — or any mention of ad copy generation in the client pipeline. Step 3 of the client ad pipeline.
---

# Ad Copy Generator — Persuasive Copy + Dynamic Template Selection

## When to Use
Run this skill after `/ad-intake` (and optionally `/ad-brand`) to generate ad copy with matched templates for Meta feed ads.

## Prerequisites
- `client-brief.json` must exist in `clients/output/{client-slug}/brief/`
- `client-brief.json` must have `ad_type` set (`"client-tangible"` or `"client-intangible"`)

## Instructions

1. **Read the client brief and reference files**:
   - `clients/output/{client-slug}/brief/client-brief.json`
   - `clients/output/{client-slug}/brief/brand-assets.json` — check `product_category.type` and `content` for client's language
   - `reference/copy-frameworks.md`
   - `reference/meta-ad-specs.md` (for character limits)
   - **`templates/registry.json`** — machine-readable template index (primary source for template selection)
   - `.claude/skills/8-extra-templates/SKILL.md` — detailed descriptions for extended templates

2. **Calibrate voice from real samples** (critical for avoiding AI-sounding copy):
   Before writing any copy, pull 2-5 real voice samples from the client:
   - `brand-assets.json → content.headings` and `content.key_paragraphs` (scraped from their website)
   - Client's social posts, past ads, testimonials, or founder writing — if available in the brief
   - Save these as `voice_samples` in your working memory
   
   **Why it matters:** Few-shot examples of real voice beat any descriptive "write in this tone" instruction. Reading 3 real ads the client wrote themselves teaches Claude the cadence, quirks, and phrasing that instructions alone can't.
   
   If no voice samples exist anywhere, flag it to the user and ask for 2-3 examples of how they (or their client) actually write. Don't proceed without some voice anchor — you'll default to generic AI cadence.

3. **Determine ad count**: read `client-brief.json → ad_count` (default 6, max 8).

4. **Select templates** based on `ad_type` (see Template Selection below).

5. **Generate copy sets** — one per selected template. Each copy set pairs a copywriting framework with the selected template.

6. **Apply sentence-rhythm variance** — this is the single highest-leverage anti-AI-slop rule. AI writing defaults to uniform 12-18 word sentences; mixing 3-word sentences with 25+ word ones removes ~60% of the AI smell by itself. Target: every 3rd sentence under 6 words, every 5th sentence over 20 words, never two similar-length sentences in a row.

7. **Save output** to `clients/output/{client-slug}/copy/ad-copy.json`.

---

## Template Selection

You have access to the full template library — 6 base HTML templates in `templates/layouts/` and 56+ extended templates described in `.claude/skills/8-extra-templates/SKILL.md` and `templates/extra/*.md` files. There are also 319 PNG previews in `template-pages/` for visual reference.

**There are no mandatory templates.** Choose whatever templates best serve this specific client. Variety is the goal — each ad should use a different template to give the client a diverse ad set.

### How to choose:

1. **Read the client brief thoroughly** — understand who they are, what they sell, and what data they have (testimonials, stats, competitors, offers, awards, etc.)
2. **Query `templates/registry.json`** — check `selection_guide.by_product_niche` for this client's category, then `selection_guide.by_framework` for framework-to-template pairings. Use these as a starting shortlist.
3. **Browse extended descriptions** in `templates/extra/{category}/*.md` for shortlisted templates — verify the visual fits the copy angle before committing
4. **Pick 6-8 templates** that create a varied, compelling ad set. Mix categories — never pick 6 from the same category. Use different visual approaches (text-heavy, image-centric, comparison, social mock-up, editorial, etc.)
5. **Match a copywriting framework to each template** naturally — a social-proof template gets Social-Proof copy, a comparison template gets Comparison copy, etc.

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

Save to `clients/output/{client-slug}/copy/ad-copy.json`:

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
- [ ] `primary_text.short` is under 125 characters
- [ ] Headline is under 27 characters (hard max 40)
- [ ] `description` is under 27 characters if present
- [ ] `cta_text_on_image` is under 20 characters if present
- [ ] CTA matches the funnel stage
- [ ] All text is in the correct language
- [ ] No invented facts or claims not in the brief
- [ ] Each set uses a genuinely different angle/framework
- [ ] Templates are varied — not all from the same category
- [ ] For tangible: every ad has `image_requirements` set
- [ ] **ANTI-AI SLOP CHECK**: Run the 7-point self-check from `.claude/skills/7-anti-ai-slop/SKILL.md`
- [ ] No duplicate headlines or primary_text across sets

## Validation Step (mandatory before handing off to Step 4)

After saving `ad-copy.json`, run the copy validator:
```bash
node scripts/validate-copy.js clients/output/{client-slug}/copy/ad-copy.json
```

- If the script exits with **errors** → fix every reported error, update `ad-copy.json`, re-run
- If the script exits with **warnings only** → review each warning, decide whether to fix
- Only proceed to Step 4 when the validator exits 0 with 0 errors
