# Client Ad Pipeline — Workflow Notes

This file accumulates learnings specific to the client ad generation pipeline (tangible + intangible). Claude reads this at the start of every client ad session and writes new entries here when you give feedback.

## Format

Each entry follows this format:

```
### YYYY-MM-DD — [topic]
**Rule:** What to do (or not do)
**Why:** The reason — often a past incident or strong preference
**Example:** (optional) Specific case that triggered this
```

---

## Tangible Products (physical goods)

### 2026-04-14 — Tangible product photos must be cut out with transparent backgrounds
**Rule:** When a client provides product photos with colored backgrounds (e.g., studio blue), ALWAYS run them through `scripts/remove-bg.py` to produce transparent PNG cutouts before using them in ads. Never place raw photos on top of ad designs.
**Why:** The raw backgrounds clash with the ad's color scheme, make every ad look the same, and prevent designing a proper brand palette. Cutouts let the product sit on any background — dark luxe, burst gradients, lifestyle photos.
**Example:** Naqaa Beauty shower filters came on bright cyan/blue. The first round of ads used the raw photos and looked generic. Cutouts unlocked proper color-matched designs.

### 2026-04-14 — Generate lifestyle/context AI backgrounds, don't just use solid colors
**Rule:** For tangible products where the user wants to communicate the product's context (who it's for, where it's used), generate AI lifestyle backgrounds via `scripts/generate-image.js` (Gemini Imagen 4). Place the product cutout on top.
**Why:** Text alone doesn't communicate what a product is fast enough in a feed. A shower scene instantly says "this is for your bathroom". An aerial construction site instantly says "this is for big projects". Scroll-stopping context > explanatory copy.
**Example:** Naqaa Beauty ads with AI shower/bathroom/dewy-skin backgrounds performed far better than the earlier "product on dark background" attempts.

### 2026-04-14 — Product should be big and bleed/overflow the frame edges
**Rule:** For single-product ads, make the product image 800-1050px tall on a 1080 canvas, often overflowing bottom or right edge. Don't center a small product with lots of space around it.
**Why:** Scale creates impact. A product that fills the frame feels premium and confident; a small centered product feels catalog-y and weak.

---

## Intangible Products (services, digital, coaching)

<!-- Entries about gradient design, text-heavy layouts, trust signals, etc. -->

### 2026-04-14 — Avoid "recruitment ad" visuals when selling B2B staffing services
**Rule:** For B2B staffing/workforce supply ads, do NOT use smiling worker portraits, close-up happy faces, or "join our team" imagery. Use workers from behind, crews at work, aerial sites, executive/PM stress shots, empty scaffolding, transport/mobilization scenes.
**Why:** Smiling worker close-ups read as job listings (Indeed/LinkedIn vibes) — wrong audience. The buyer is a construction/industrial company owner or project manager, and they need to see the SOLUTION (delivered crews, mobilization, scale), not happy workers looking for jobs.
**Example:** Rihards EU workforce supply — team's designer made ads with smiling workers posing. Felt like recruiting ads. Fixed by using aerial site shots, demolition wide shots, workers from behind, exec at site, and one creative "team in van heading to job" shot.

---

## Template Selection

<!-- Entries about which templates work best for specific client types or industries -->

### 2026-04-14 — When user's team has existing ad formats, match the exact format before redesigning
**Rule:** If the client/team has a preferred layout (e.g., Rihards' "yellow block + collage" or "big image + dark panel + yellow CTA bar"), replicate that layout structure exactly and only upgrade the imagery + copy. Don't propose a completely new design unless asked.
**Why:** Teams have brand consistency and production pipelines built around their formats. A better ad in the wrong format gets rejected.

---

## Copy Patterns

<!-- Entries about headline style, framework choices, language handling, etc. -->

### 2026-04-14 — The product must be instantly recognizable — lead with what it IS, not the brand name
**Rule:** In on-image text, lead with the product category ("Dušas filtrs", "Drošības sistēma", "Vitamīnu dušas filtrs") BEFORE the brand name or SKU name (e.g., "Precious Rose"). A tag pill with the category at the top of the ad is a reliable pattern.
**Why:** If someone scrolling doesn't know what they're looking at in 1 second, the ad fails. "Precious Rose" means nothing unless you already know the brand. Category-first copy solves this.
**Example:** Early Naqaa ads said "Precious Rose" as the main headline and no one knew it was a shower filter. Fixed by adding "DUŠAS FILTRS" tag pill above the headline.

### 2026-04-14 — Remove "supporting labels" that clutter: +PVN, "Centrāle + detektors", "ATLAIDE" badges
**Rule:** Keep price clean — just the number + currency. Remove sub-labels under the price unless the user explicitly requests them. Red/yellow "ATLAIDE"/"SALE" badge boxes next to the price usually add clutter, not value.
**Why:** Every extra label steals attention from the price and headline. The offer details belong in the Meta ad body text, not on the creative.
**Example:** Ajax ads originally had "130€ + PVN · Centrāle + detektors · ATLAIDE" stacked — user asked to remove it all. Cleaner ads resulted.

---

## Design Rules

<!-- Entries about brand color handling, typography, contrast, layout quirks -->

### 2026-04-14 — Fill the entire frame — no blank/empty regions
**Rule:** Every pixel of the 1080x1080 canvas should carry information: product, context image, text, or a purposeful color block. Avoid ads where large portions of the frame are empty dark space.
**Why:** Empty frame = wasted attention. Feeds compete ruthlessly for eyeballs. An ad that looks half-finished gets skipped.
**Example:** Naqaa ads where the filter was small and surrounded by vignette looked "stupid" — user feedback. Fixed by making product overflow edges, using full-bleed background photos, or pairing product + lifestyle image.

### 2026-04-14 — Match the tone to the product category, not a "one size fits all" dark palette
**Rule:** Beauty products need soft/luxe palettes (rose, lavender, amber, gold) — NOT tech/SaaS dark green backgrounds. Security/industrial needs dark moody + red urgency. B2B staffing needs yellow/gold industrial with dark accents. Pick palette based on category, not a default template.
**Why:** A shower filter on a dark tech background looks wrong. Each industry has visual language buyers expect.
**Example:** Early Naqaa beauty ads used FJDynamics-style dark green with tech stat-cards. Wrong vibe. Corrected to rose pink, lilac, warm amber, champagne gold.

### 2026-04-14 — Remove outline borders on chip/pill components unless there's a functional reason
**Rule:** Default pill/chip styling should be `background: rgba(255,255,255,0.1); border: none`. Don't add `border: 1px solid rgba(255,255,255,0.15)` unless contrast demands it.
**Why:** User consistently asked to remove these thin outline boxes — they look amateur and cluttered.

### 2026-04-14 — Always preserve layout when iterating on text/image changes
**Rule:** When the user asks for tweaks ("make text bigger", "remove +PVN", "swap this image"), edit ONLY what they asked and keep every other pixel identical. Don't redesign layouts mid-iteration.
**Why:** The user is iterating on a specific creative they've mentally committed to. Surprise changes force them to re-evaluate everything and waste iterations.

---

## Workflow / Tooling

### 2026-04-14 — When image generation fails, always retry sequentially (not in parallel)
**Rule:** Gemini Imagen 4 API fails intermittently with 503 DEADLINE_EXCEEDED, especially when spawned in parallel via `&` in bash. If a batch fails, retry the failed ones ONE AT A TIME.
**Why:** Parallel spawns race against the API; sequential retries almost always succeed.

### 2026-04-14 — Source HTML files are handed off to designers; keep them clean and editable
**Rule:** The `.html` files are the editable source of truth — keep them well-structured with labeled sections, reasonable CSS class names, and inline styles grouped logically. Designers who can't read HTML can rebuild in Canva using the cutout/background assets in `brief/images/` + the PNG as reference.
**Why:** Designers asked "how do we edit these?" The answer is: tell me, or rebuild in Canva using the asset folders. Clean source files make this handoff smoother.

### 2026-04-14 — Project structure path note
**Rule:** The working project directory may be under `claude-ad/` (not `meta-ad-generator/`). Scripts live at `claude-ad/scripts/`, outputs at `claude-ad/output/{client-slug}/`. Check actual paths before running scripts — both may exist in this repo.
**Why:** Folder was renamed/moved mid-project. Commands failed with "No such file or directory" until checking the actual location.
