# meta-ad-generator-3 — Claude Rules

## Pipeline is mandatory

**NEVER hand-write ad HTML directly.** All ad generation must go through the pipeline:

```
node src/pipeline.js <client-slug>
```

Examples:
```
node src/pipeline.js naqaa-beauty
node src/pipeline.js changer-club
node src/pipeline.js mariposa
```

The pipeline runs these steps in order:
1. `2-copy.js` — AI generates headlines, bullets, base_texts, on_image_texts, CTA from `client-brief.json`
2. `3-refine.js` — AI refines and quality-checks the copy
3. `2b-assemble.js` — assembles multiple ad variations from the copy components
4. `3b-select-template.js` — AI selects the right HTML template per variation
5. `4-html.js` — AI generates complete HTML using the template + copy + palette
6. `5-export.js` — exports HTML to PNG via Edge headless

Output is written to `clients/<slug>/output/` including `ad-generation-v3.json` which contains all copy variations and decisions.

## Exceptions

Re-exporting existing HTML to PNG (e.g. after a CSS fix) is allowed directly:
```
node src/steps/5-export.js <client-slug>
```

If `OPENAI_API_KEY` is not configured, hand-writing HTML is permitted as a fallback — but the rules below are still absolute.

---

## Allowed copy elements — WHITELIST

When writing HTML (whether via pipeline or fallback), the ONLY copy elements permitted are exactly what `src/steps/4-html.js → buildDesignBrief()` passes to the designer:

| Element | Source | Notes |
|---|---|---|
| `on_image_text` | `components.md` on_image_texts | 3–6 words, ONE statement |
| `headline` | `components.md` headlines | max 40 chars |
| `base_text` | `components.md` base_texts | 2–3 sentences, max 220 chars |
| `bullets` | `components.md` bullets | max 6 items |
| `cta` | `components.md` cta | single button only |
| Logo | `brand-assets.json` logo_url | image only, no alt text as visible copy |
| Brand colors | `brand-assets.json` | primary, secondary, accent |
| Brand fonts | `brand-assets.json` | heading_font |

**If it is not in this table, it does not go in the ad. No exceptions.**

Specifically forbidden (not in the pipeline — never add):
- Eyebrow text / category labels
- Taglines or slogans not from the brief
- Secondary CTA links ("Uzzināt vairāk" or any equivalent)
- Subheadlines, descriptors, or any extra text layer not listed above
- Invented copy of any kind — every word must come from `client-brief.json`

---

## Palette rules

- Colors must come from `src/data/palettes-neutral.md`
- For ⚠-rated palettes (113 of 144): use Base only for atmosphere/backgrounds; derive text/CTA colors from the fallback rules in `src/prompts/color-theory.md` §17
- For ✓-rated palettes (20 of 144): all colors including text and CTA may come from the palette
