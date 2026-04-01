# Category-Aware Ad Generation System

## Context

The current ad generation pipeline treats every client identically — same templates, same copy frameworks, same design rules. Whether the client sells physical products or online courses, they get the same output. This doesn't work because:

- **Physical products need to be seen.** People want to see what they're buying — real product photos, straightforward messaging.
- **Intangible offers sell transformation.** Courses, services, coaching — these need outcome-focused copy, social proof, and clean text-driven layouts.

The goal is to make the existing pipeline **category-aware** so each skill adapts its behavior based on what the client is selling, without duplicating the pipeline or rewriting templates.

## Design

### Two Core Categories

| Category | Definition | Examples |
|---|---|---|
| **Tangible** | Physical products you can touch/hold | Handmade candles, leather goods, clothing, food products, electronics |
| **Intangible** | Services, digital products, experiences | Online courses, coaching, SaaS, consulting, events, memberships |

### 1. Product Category Detection

**Source priority:** Manual input (client intake) > Auto-detection (scraper)

#### Auto-Detection in Scraper (`scrape-brand.js`)

The scraper analyzes three signal types:

**Page content signals:**
- Tangible indicators: "Add to Cart", "Buy Now", prices with shipping info, product SKUs, size/color selectors, weight/dimensions
- Intangible indicators: "Sign Up", "Book Now", "Enroll", "Subscribe", "Download", course modules, session/consultation language, "free trial"

**URL structure signals:**
- Tangible: `/shop`, `/products`, `/store`, `/collections`, `/catalog`
- Intangible: `/services`, `/courses`, `/programs`, `/coaching`, `/pricing` (without product pages)

**Image signals:**
- Product galleries, multiple angles of same item, images near price/cart buttons → tangible
- Headshots, abstract graphics, screenshots → intangible

#### Output in `brand-assets.json`

```json
{
  "product_category": {
    "type": "tangible",
    "confidence": "high",
    "signals": ["shop page found", "product prices detected", "add-to-cart buttons"],
    "product_images": ["images/product-1.jpg", "images/product-2.jpg"]
  }
}
```

#### Product Image Downloading (Tangible Only)

When tangible is detected, the scraper additionally:
- Identifies product images (near price/cart elements, in product galleries)
- Downloads top 5 product images to `images/product-{n}.{ext}`
- These are separate from hero images — hero images are general site banners, product images are the actual items being sold

#### Manual Override in `client-brief.json`

```json
{
  "product_type": "tangible"
}
```

If provided during intake, this overrides auto-detection entirely.

### 2. Ad Copy Skill Adaptation

The 6 copywriting frameworks (PAS, AIDA, Before/After, Comparison, Benefit Stack, Editorial) remain the same. The **tone and content focus** shifts:

#### Tangible Copy Rules
- **Headlines:** Straightforward, product-focused. Name the product. Highlight what makes it special (material, craftsmanship, feature).
- **Primary text:** Lead with what you get. Features, materials, quality. Show tangible value.
- **Hooks:** Bold claims about the product, specific numbers ("100% Italian Leather", "Handmade in 48h")
- **CTAs:** "Shop Now", "Order Today", "Get Yours", "Buy Now"

#### Intangible Copy Rules (Current Behavior)
- **Headlines:** Transformation-focused. What changes in the buyer's life.
- **Primary text:** Pain points, outcomes, before/after narrative. Sell the result, not the thing.
- **Hooks:** Questions, pain points, "imagine..." openers
- **CTAs:** "Sign Up", "Book Now", "Start Free", "Learn More"

### 3. Ad Designer Skill Adaptation

#### Template Eligibility by Category

Existing templates are **tagged**, not modified:

| Template | Tangible | Intangible | Notes |
|---|---|---|---|
| hero-overlay | Yes | Yes | Tangible: product photo as background. Intangible: gradient background |
| bold-statement | No | Yes | Text-only — great for outcomes, not for product showcase |
| split-horizontal | Yes | Yes | Tangible: product + text. Intangible: before/after |
| comparison | No | Yes | Before vs After is transformation-focused |
| testimonial-card | Yes | Yes | Social proof works universally |
| benefit-stack | Yes | Yes | Works for product specs or service benefits |

Extra templates (`/templates/extra/`) follow the same tagging:
- Product-hero, product-surround → tangible
- Manifesto, editorial, faux-press → intangible
- Social proof, UGC variants → both

#### Design Rules by Category

**Tangible:**
- Product photos ARE allowed and encouraged as backgrounds/hero elements
- Product image is the centerpiece of the ad
- Text supports the image (not the other way around)
- Clean layouts that let the product speak

**Intangible (unchanged):**
- No background images — solid colors and gradients only
- Text is the hero element
- Brand colors drive the visual identity

#### Template Selection Logic

Before selecting a layout, the designer skill:
1. Reads `product_category.type` from `brand-assets.json`
2. Filters available templates to those tagged for that category
3. Maps copy framework → eligible template (e.g., PAS for tangible → hero-overlay with product photo, not bold-statement)

### 4. Variations Skill Adaptation

Existing variation axes remain. One new axis added for tangible:

- **Axis E - Product Image Swap**: Same layout and copy, different product photo (only for tangible)

Intangible variations stay exactly as-is.

### 5. Files to Modify

| File | Change |
|---|---|
| `.claude/skills/1-client-intake/SKILL.md` | Add optional `product_type` field to brief schema |
| `.claude/skills/2-brand-scraper/SKILL.md` | Add category detection instructions, product image downloading |
| `scripts/scrape-brand.js` | Add category detection logic, product image identification and download |
| `.claude/skills/3-ad-copy/SKILL.md` | Add tangible vs intangible copy rules |
| `.claude/skills/4-ad-designer/SKILL.md` | Add template eligibility filter, tangible design rules |
| `.claude/skills/6-variations/SKILL.md` | Add product image swap axis for tangible |
| `brand-assets.json` schema | New `product_category` field |

### 6. What Does NOT Change

- Template HTML/CSS files — no modifications to existing templates
- Export script (`export-png.js`) — renders whatever HTML it gets
- Pipeline structure — same 6 stages in the same order
- Extra templates — just get tagged, not rewritten
- Anti-AI slop rules — apply equally to both categories

## Verification

After implementation, test with:

1. **Tangible test:** Run full pipeline on a site that sells physical products (e.g., an e-commerce store). Verify:
   - Scraper detects "tangible" with product images downloaded
   - Ad copy uses product-focused headlines and "Shop Now" CTAs
   - Designer picks tangible-eligible templates with product photos
   - At least one variation uses product image swap

2. **Intangible test:** Run full pipeline on a service/course site. Verify:
   - Scraper detects "intangible"
   - Ad copy uses transformation-focused headlines
   - Designer uses current solid color/gradient approach
   - No product images in output

3. **Manual override test:** Provide `product_type` in client brief, verify it overrides scraper detection

4. **Edge case:** Site selling both physical and digital products — verify scraper picks the dominant category with appropriate confidence level
