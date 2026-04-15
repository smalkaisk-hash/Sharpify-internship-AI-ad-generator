---
name: 6-variations
description: Create 3-6 A/B test variations from existing ad creatives — hook swaps, CTA color changes, layout swaps, background treatments, product image swaps. Trigger this skill whenever base ads exist and the user wants more variants to test — or says "make variations", "create A/B versions", "generate more creatives from these", "test different angles". Optional step after the main pipeline.
---

# Ad Variations — Generate A/B Test Variants

## When to Use
Run this skill after you have base ads (from `/ad-design` + `/ad-export`) and want to create systematic variations for split testing on Meta.

## Prerequisites
- Base HTML ads in `output/{client-slug}/html/`
- `output/{client-slug}/brief/brand-assets.json`
- `output/{client-slug}/copy/ad-copy.json`

## Instructions

1. **Read existing ads and assets**:
   - List HTML files in `output/{client-slug}/html/`
   - Read `brand-assets.json` for color palette
   - Read `ad-copy.json` for all copy sets

2. **Generate variations using these axes** (pick 2-3 per base ad):

### Axis A: Hook Swap
- Take an existing ad and replace the headline + primary_text with a different copy set
- Keep the same layout and colors
- Naming: `ad-v1-hero-overlay-hookB.html`

### Axis B: CTA Color Swap
- Change the CTA button color to a different high-contrast brand color
- Try: accent → secondary, or use complementary color
- Naming: `ad-v1-hero-overlay-ctaB.html`

### Axis C: Layout Swap
- Take the same copy set but use a different layout template
- E.g., hero-overlay copy → bold-statement layout
- Naming: `ad-v1-bold-statement-alt.html`

### Axis D: Background Treatment
- Swap between: different gradient directions, solid color, different brand color combos
- Try: primary→secondary gradient, secondary→accent gradient, solid primary
- Naming: `ad-v1-hero-overlay-darkBG.html`

### Axis E: Product Image Swap (Tangible Only)
- **Only for tangible products** (check `brand-assets.json → product_category.type`)
- Take an existing ad and swap the product photo for a different one from `images/product-*.{ext}`
- Keep the same layout, copy, and colors — only the product image changes
- This tests which product angle/photo drives more engagement
- Naming: `ad-v1-hero-overlay-prodB.html`

3. **Generate 3-6 additional variations** (not more — keep it testable):
   - 2 hook swaps (Axis A)
   - 1-2 CTA color swaps (Axis B)
   - 1-2 layout swaps (Axis C)
   - 1-2 product image swaps (Axis E) — only if `product_category.type` is `"tangible"` and multiple product images exist

4. **Save all variation HTML files** to `output/{client-slug}/html/`

5. **Export all new variations to PNG**:
   ```bash
   node scripts/export-png.js "output/{client-slug}/html" "output/{client-slug}/png"
   ```

6. **Create a test matrix** at `output/{client-slug}/test-matrix.md`:

```markdown
# A/B Test Matrix — {Client Name}

| Ad File | Layout | Hook Framework | CTA Color | Image | Test Variable |
|---------|--------|---------------|-----------|-------|--------------|
| ad-v1-hero-overlay.png | Hero Overlay | PAS | #E74C3C | hero-1 | Control |
| ad-v1-hero-overlay-hookB.png | Hero Overlay | AIDA | #E74C3C | hero-1 | Hook |
| ad-v1-hero-overlay-ctaB.png | Hero Overlay | PAS | #3498DB | hero-1 | CTA Color |
| ad-v2-bold-statement.png | Bold Statement | AIDA | #E74C3C | hero-1 | Layout |
...

## Recommended Test Order
1. Test hooks first (biggest impact on CTR)
2. Test product images second (tangible only — different product angles/photos)
3. Test layouts third
4. Test CTA colors last (smallest impact)
```

7. **Print summary**: total variations created, test matrix overview.

## Quality Rules
- **ANTI-AI SLOP CHECK**: All variation copy must pass the 7-point self-check from `.claude/skills/7-anti-ai-slop/SKILL.md`
- **Category-aware design rules** — tangible products use product photos; intangible uses solid color gradients only (per ad-designer rules)
- **No logos** on V2 (bold-statement) and V5 (benefit-stack) variations

## Testing Best Practices
- Each A/B test should change only ONE variable
- Minimum 3-5 ads per ad set for Meta's algorithm to optimize
- Run each test for at least 3-5 days before declaring a winner
- Budget: minimum $5-10/day per ad variation for statistical significance
