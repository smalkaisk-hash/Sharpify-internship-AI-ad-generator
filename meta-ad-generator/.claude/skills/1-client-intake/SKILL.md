---
name: 1-client-intake
description: Parse pasted raw client information (name, website, target audience, offer details) into a structured client-brief.json. Trigger this skill whenever the user pastes unstructured client data for a new ad project — typed notes, form-field dumps, copy-pasted proposals, bullet points. Auto-detects language and classifies product_type (tangible/intangible) for downstream pipeline routing. Step 1 of the client ad pipeline.
---

# Client Intake — Parse Client Data into Structured Brief

## When to Use
Run this skill when a user pastes raw client information (name, website, target audience, offer details, etc.) and you need to create a structured brief for ad generation.

## Instructions

1. **Read the pasted client data** carefully. It may be in any format — form fields, bullet points, free text, or mixed language.

2. **Detect the primary language** of the client's content (e.g., Latvian, English, German). This determines the language for all generated ad copy.

3. **Create the client output directory**:
   ```bash
   mkdir -p output/{client-slug}/brief
   mkdir -p output/{client-slug}/copy
   mkdir -p output/{client-slug}/html
   mkdir -p output/{client-slug}/png
   ```
   Use a URL-safe slug of the client name (e.g., "Aiva Juste" → "aiva-juste").

4. **Generate `client-brief.json`** at `output/{client-slug}/brief/client-brief.json` with this exact schema:

```json
{
  "client_name": "Full Name",
  "client_slug": "url-safe-slug",
  "email": "email@example.com",
  "phone": "+371...",
  "website": "https://...",
  "figma_file_url": "https://www.figma.com/file/... or null",
  "language": "lv",
  "target_audience": {
    "raw": "Original text from client",
    "demographics": "Women 20-45 in Latvia",
    "psychographics": "Feeling confused, tired of self-doubt, seeking clarity",
    "pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"],
    "desires": ["Desire 1", "Desire 2", "Desire 3"]
  },
  "offer": {
    "main_offer": "Primary product/service name and description",
    "secondary_offer": "Secondary offer if mentioned",
    "result_promise": "The specific transformation or outcome promised",
    "duration": "8 weeks / ongoing / etc.",
    "price_mentioned": false
  },
  "differentiator": {
    "raw": "Original text",
    "key_points": ["Point 1", "Point 2"]
  },
  "trust_signals": {
    "raw": "Original text",
    "credentials": ["Certified coach", "3 summers sales experience USA"],
    "social_proof": ["40+ sessions with women", "Clients achieve results in 2-6 months"],
    "personal_story": "Summary of personal journey if mentioned"
  },
  "client_acquisition": {
    "method": "How they currently get clients",
    "funnel": "Lead → Discovery call → Program enrollment"
  },
  "bonuses": ["Bonus 1", "Bonus 2"],
  "guarantees": ["Guarantee 1", "Guarantee 2"],
  "capacity": "10 clients/month",
  "product_type": "tangible / intangible / null",
  "ad_type": "client-tangible / client-intangible / null",
  "ad_count": 6,
  "ad_strategy": {
    "recommended_objective": "Lead Generation / Conversions / Awareness",
    "recommended_cta": "Book Now / Sign Up / Learn More / Send Message",
    "funnel_stage_focus": "Top of funnel — awareness + lead gen"
  }
}
```

5. **Extract Figma file URL if provided** (any `https://www.figma.com/file/...` or `https://www.figma.com/design/...` link in the pasted data). Save to `figma_file_url`. This becomes the preferred brand-asset source over web scraping — the scraper in step 2 will check here first. If no Figma link is provided, leave as `null`.

6. **Classify `product_type`** if determinable from client data:
   - `"tangible"` — physical products the customer can touch/hold (candles, clothing, electronics, food products, etc.)
   - `"intangible"` — services, digital products, courses, coaching, consulting, memberships, SaaS, etc.
   - `null` — if the client data doesn't make it clear. The brand scraper will auto-detect from the website.
   - This field overrides the scraper's auto-detection when set, so only set it when you're confident.

7. **Set `ad_type`** based on `product_type`:
   - If `product_type` is `"tangible"` → set `"ad_type": "client-tangible"`
   - If `product_type` is `"intangible"` → set `"ad_type": "client-intangible"`
   - If `product_type` is `null` → set `"ad_type": null` (the brand scraper will resolve it)

8. **Set `ad_count`** — default is `6`. Increase to `7-8` if the client data is rich:
   - Has 3+ testimonials/reviews → +1
   - Has specific stats/numbers (revenue, client count, etc.) → +1
   - Has clear competitor differentiators AND active promotions → +1
   - Maximum is `8`.

9. **Fill in the `ad_strategy` section** based on your analysis:
   - If client gets clients via discovery calls → recommend Lead Generation objective with "Book Now" CTA
   - If client sells products directly → recommend Conversions with "Shop Now" CTA
   - If client is new/building awareness → recommend Awareness with "Learn More" CTA

10. **Print a summary** after saving, confirming: client name, language detected, product type (if set), ad type, ad count, figma URL (if provided), number of pain points extracted, recommended ad objective.

## Important Rules
- NEVER invent or fabricate client data. Only use what was provided.
- If a field is not provided in the paste, set it to `null` — do not guess.
- Preserve the original language in `raw` fields.
- The `pain_points` and `desires` should be extracted/inferred from the target audience and offer description.
- Keep the slug lowercase, alphanumeric + hyphens only.
