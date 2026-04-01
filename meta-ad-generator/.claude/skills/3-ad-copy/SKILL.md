---
name: 3-ad-copy
description: Generate Meta ad copy sets using proven copywriting frameworks
---

# Ad Copy Generator — Create Persuasive Ad Copy from Client Brief

## When to Use
Run this skill after `/ad-intake` (and optionally `/ad-brand`) to generate ad copy variations for Meta feed ads.

## Prerequisites
- `client-brief.json` must exist in `output/{client-slug}/brief/`

## Instructions

1. **Read the client brief and reference files**:
   - `output/{client-slug}/brief/client-brief.json`
   - `reference/copy-frameworks.md`
   - `reference/meta-ad-specs.md` (for character limits)

2. **Read brand assets** if available:
   - `output/{client-slug}/brief/brand-assets.json` — check `content.headings` and `content.key_paragraphs` for the client's own language and phrasing to mirror in ad copy.
   - **Check `product_category.type`** — this determines which copy rules to apply (see Category-Aware Copy Rules below).

3. **Generate 6 ad copy sets**, each using a different framework. Every set must be in the client's detected language (`client-brief.json → language`). Apply the category-aware copy rules based on the detected product category.

### Copy Set Structure

For each of the 5 sets, generate:

```json
{
  "id": "copy-1-pas",
  "framework": "PAS",
  "layout_recommendation": "hero-overlay",
  "primary_text": {
    "short": "Max 125 chars — shows without 'See more' truncation",
    "long": "Full version, up to 500 chars with emoji and line breaks"
  },
  "headline": "Max 27 chars ideally, 40 chars absolute max",
  "description": "Max 27 chars — supporting detail",
  "cta_button": "One of Meta's CTA options (e.g., Book Now)",
  "cta_text_on_image": "Text shown ON the ad image CTA button",
  "hook_type": "question / bold-claim / statistic / story / pain-point"
}
```

### The 6 Required Frameworks

1. **PAS (Problem → Agitate → Solution)** — `layout_recommendation: "hero-overlay"`
   - Open with the #1 pain point from `target_audience.pain_points`
   - Agitate with emotional language
   - Present the offer as the solution

2. **AIDA (Attention → Interest → Desire → Action)** — `layout_recommendation: "bold-statement"`
   - Bold attention-grabbing hook (question or provocative statement)
   - Interest with a relevant detail
   - Desire with outcome painting
   - Action with clear CTA

3. **Before/After/Bridge** — `layout_recommendation: "split-horizontal"`
   - Describe the "before" state (current struggle)
   - Describe the "after" state (life after transformation)
   - Bridge = the offer

4. **Comparison (Before vs After)** — `layout_recommendation: "comparison"`
   - Create a side-by-side comparison: "Without [product/service]" vs "With [product/service]"
   - Left side (red/negative): 5 pain points from `target_audience.pain_points`
   - Right side (green/positive): 5 matching benefits/solutions
   - Use specific, practical language — avoid generic marketing phrases
   - NEVER use made-up testimonials or fake reviews — only use real, verified customer quotes if available

5. **Benefit Stack** — `layout_recommendation: "benefit-stack"`
   - List 3-4 key benefits extracted from: `offer`, `bonuses`, `differentiator`
   - Each benefit: short title + one-line description
   - CTA at bottom

6. **Editorial / Elegant** — `layout_recommendation: "editorial"`
   - White background, Playfair Display serif font, gold accents
   - Top: eye-catching headline with key words in gold italic
   - Middle: engaging description text (Inter font, muted gray)
   - Bottom: event details or trust signal + price
   - Structure: attention → interest → details. No CTA button — the elegance IS the hook
   - Must feel like a magazine ad, not a Meta ad

### Copy Writing Rules

**Hook (first line of primary_text):**
- Must be max 10 words
- Must stop the scroll — use: question, bold claim, "imagine..." statement, or number
- NEVER start with the client's name or "We offer..."
- Test: Would YOU stop scrolling to read this?

**Language:**
- Write in the language specified in `client-brief.json → language`
- For Latvian (lv): use informal "tu" for coaching/personal brands
- Mirror the tone of the client's own website copy (from `brand-assets.json → content`)
- Cultural sensitivity: Latvian audiences respond to warmth + authenticity, not American-style hype

**Emoji usage:**
- 1-3 emojis per primary_text, placed as visual anchors
- Never in headlines
- Preferred: ✨ 💡 ➡️ ✅ 💪 🎯 🔥 (avoid childish emojis)

**CTA matching:**
- Discovery call offer → "Piesakies bezmaksas sarunai" / "Book Now"
- Product purchase → "Iegādāties tagad" / "Shop Now"
- Lead magnet → "Lejupielādēt" / "Download"
- Information → "Uzzināt vairāk" / "Learn More"

4. **Save output** to `output/{client-slug}/copy/ad-copy.json`:

```json
{
  "client_name": "...",
  "client_slug": "...",
  "language": "lv",
  "generated_at": "ISO timestamp",
  "copy_sets": [
    { ...copy set 1... },
    { ...copy set 2... },
    { ...copy set 3... },
    { ...copy set 4... },
    { ...copy set 5... },
    { ...copy set 6... }
  ]
}
```

5. **Print summary**: show all 6 headlines and their frameworks in a readable table.

## Category-Aware Copy Rules

Read `brand-assets.json → product_category.type` to determine which rules to apply.

### Tangible Products (physical items you can touch/hold)

**Headlines:** Straightforward and product-focused. Name the product. Highlight what makes it special — material, craftsmanship, unique feature, quality.
- Good: "Premium Leather Wallet — Built to Last" / "Handmade Soy Candles — Pure & Natural"
- Bad: "Finally Find What You've Been Looking For" (too vague for a physical product)

**Primary text:** Lead with what the customer gets. Features, materials, quality, what's included. Show the tangible value of the physical product. People want to see and understand what they're buying.

**Hooks:** Bold claims about the product itself. Use specific numbers, materials, or features.
- "100% Italian Leather" / "Handmade in 48h" / "3x Thicker Than Store-Bought"

**CTAs:** Action-oriented purchase language:
- "Shop Now" / "Order Today" / "Get Yours" / "Buy Now"
- Latvian: "Iegādāties tagad" / "Pasūtīt" / "Iegūsti savu"

### Intangible Products (services, courses, digital, coaching)

This is the **current default behavior** — no changes needed. Apply all existing copy rules as-is:

**Headlines:** Transformation-focused. What changes in the buyer's life after using the service/course.

**Primary text:** Lead with pain points and outcomes. Sell the result, not the thing. Before/after narrative.

**Hooks:** Questions, pain points, "imagine..." openers, emotional triggers.

**CTAs:** Engagement-focused:
- "Sign Up" / "Book Now" / "Start Free" / "Learn More"
- Latvian: "Piesakies" / "Reģistrēties" / "Uzzināt vairāk"

## Quality Checklist
Before saving, verify each copy set:
- [ ] Hook is under 10 words and scroll-stopping
- [ ] Primary text short version is under 125 characters
- [ ] Headline is under 40 characters
- [ ] CTA matches the funnel stage
- [ ] All text is in the correct language
- [ ] No invented facts or claims not in the brief
- [ ] Each set uses a genuinely different angle/framework
- [ ] **ANTI-AI SLOP CHECK**: Run the 7-point self-check from `.claude/skills/7-anti-ai-slop/SKILL.md` — no banned phrases, no corporate filler, no vague claims, every sentence says something specific
