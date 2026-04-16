---
name: Gemini Imagen 4 generation quirks
description: Known failure modes and fixes for generate-image.js (Gemini Imagen 4) — 503 errors, off-topic outputs, parallel spawns.
type: reference
originSessionId: 5095a699-8fca-4ecf-b9e6-6a0d7e74c0bd
---
Reference for `scripts/generate-image.js` (Gemini Imagen 4) issues:

## 503 UNAVAILABLE / DEADLINE_EXCEEDED
- **Cause:** Usually a too-long prompt (30+ descriptors, verbose camera specs). Also hit when spawning in parallel via `&` in bash.
- **Fix:** Shorten the prompt to ~80 words (strip verbose camera specs, drop secondary details). Retry failed generations **one at a time, not in parallel** — parallel spawns race against the API.

## Off-topic outputs
- **Cause:** Imagen 4 occasionally returns completely unrelated images (e.g., "beauty salon interior" → woman at sunset by sea; "diagnostic tool on engine" → people in forest with typewriter).
- **Fix:** Retry with a stripped-down prompt. Add explicit framing: `"empty space no people"` for interiors, `"extreme close-up of [specific subject]"` for detail shots. Remove verbose modifiers.

## Output path gotcha
- `generate-image.js` resolves paths **relative to the CWD**. Running from `meta-ad-generator/` with an output path like `claude-ad/output/foo.png` creates a nested `meta-ad-generator/claude-ad/output/foo.png`.
- **Fix:** Use absolute paths OR paths relative to the project's `output/` (e.g., `output/{slug}/images/foo.png`).

## Reusable asset library
- `meta-ad-generator/output/sharpify-leadgen/images/` holds proven niche persona photos:
  - `niche-jumiki.png` (roofer)
  - `niche-it.png` (IT owner)
  - `niche-buvnieks.png` (construction owner)
  - `reference/salona-ipasniece.jpg` (proven-winner aesthetic reference)
- Reuse these before re-generating — saves API credits and keeps brand aesthetic consistent.

## LV leadgen persona prompt formula
See the full prompt template in the LV notes: `C:\Users\Ritvars Volfs\.claude\skills\reklamas-meta-sharpify\notes.md` (section "Photo prompt formula for niche entrepreneur portraits"). That's the canonical source — don't duplicate here.
