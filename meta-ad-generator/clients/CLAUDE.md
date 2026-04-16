# Client Ad Workspace — Rules

These rules apply ONLY to client ad work (third-party businesses). For Sharpify's own ads, see `sharpify/CLAUDE.md`.

---

## 1. Routing

Trigger `full-pipeline` skill when:
- User says "make ads for [client name/link]"
- User pastes client info or a third-party business URL
- User says "generate ads for [business]" or similar

Do NOT use this workflow when:
- The client is actually Sharpify/Niks Jansons → use `sharpify/lv/` or `sharpify/eng/` workspace instead
- The user wants standalone copywriting for a single ad (not a full set) → use skill 9-ad-copywriting

Outputs land in `clients/output/{client-slug}/`. Never write client ads to `sharpify/` folders.

---

## 2. Tangible vs Intangible

The pipeline auto-detects product type from the website. This determines two key things:

**Tangible products** (physical goods — candles, furniture, supplements, apparel, products you can touch):
- Product imagery is MANDATORY in every ad. Viewers must recognize what's being sold in one second without reading.
- Lead with what the product IS, not the brand name. "DUŠAS FILTRS" tag pill above "Precious Rose" — not the other way around.
- Product photos with colored studio backgrounds MUST be cut out (use `scripts/remove-bg.py`) before placing on ad designs. Raw backgrounds clash with ad palettes.
- For context-heavy ads, generate AI lifestyle backgrounds via `scripts/generate-image.js` (Imagen 4) and place product cutout on top. Text alone doesn't communicate context fast enough in the feed.
- Product should fill the frame — 800-1050px tall on 1080 canvas, often overflowing bottom or right edge. Small centered products feel catalog-y.

**Intangible products** (services, courses, coaching, SaaS, digital):
- NO generic stock photos or hero background images. Use solid color gradients with brand colors.
- Template-specific visuals (phone mockups, review cards, social post screenshots) built with CSS/HTML are fine when the template calls for them.

---

## 3. Design Rules (client-specific)

### No logos on V2 + V5 templates
bold-statement and benefit-stack layouts don't carry logos. Brand communicates through colors and text. Other layouts: only if client requests.

### Center all text by default
Headlines, body, CTAs centered unless the layout explicitly requires left-alignment (like benefit-stack list items). Left-aligned text on solid backgrounds looks unbalanced. Break long headlines with `<br>` into complete-thought lines.

### Never repeat the same info on one ad
Price in CTA button AND price badge = wasted slot. Use the second spot for a trust signal or event detail.

### V4 = Before vs After comparison (never ironic testimonial)
Two columns: left red (pain points), right green (benefits). 5 items each with emoji icons. Never use made-up reviews — fake reviews are a hard "no".

### Interface mockups fatigue fast
Google/ChatGPT/iMessage/iPhone Notes mockups scroll-stop on first exposure but fatigue rapidly across a scaled campaign. Use at most 1-2 per set of 10+. Default to editorial / poster / documentary / product-forward. Never a full campaign built on interface mockups.

### Fill the entire frame — no blank regions
Every pixel of the 1080x1080 canvas should carry information: product, context image, text, or a purposeful color block. Empty dark space = wasted attention.

### Match tone to product category (not a default dark palette)
- Beauty → soft/luxe (rose, lavender, amber, gold)
- Security/industrial → dark moody + urgency red
- B2B staffing → yellow/gold industrial with dark accents
- SaaS → restrained greys/blacks with one bold accent
- Food/CPG → warm saturated + appetite colors

Never default to "dark-tech" for every client.

### Remove clutter labels
Default pill/chip: `background: rgba(255,255,255,0.1); border: none`. Don't add outline borders unless contrast demands it. Keep price clean — just number + currency. Remove sub-labels like "+ PVN", "Centrāle + detektors", "ATLAIDE" badges unless user explicitly requests them.

### Match the client team's existing ad format when they have one
If a client has a preferred layout (yellow block + collage, big image + dark panel + yellow CTA bar, etc.), replicate the layout structure exactly and only upgrade imagery + copy. Teams have brand consistency and production pipelines around their formats — a better ad in the wrong format gets rejected.

### B2B staffing = no recruitment-ad visuals
For workforce/staffing clients: NO smiling worker portraits, close-up happy faces, or "join our team" imagery. Use workers from behind, crews at work, aerial sites, executive/PM stress shots, transport/mobilization scenes. Smiling close-ups read as job listings (Indeed/LinkedIn vibes) — wrong audience. The buyer is a company owner who needs to see the solution (delivered crews, scale), not happy workers.

### Preserve layout when iterating
When the user asks for tweaks ("make text bigger", "remove +PVN", "swap this image"), edit ONLY what they asked and keep every other pixel identical. Don't redesign mid-iteration — forces them to re-evaluate and wastes rounds.

---

## 4. Voice Calibration (critical for copy quality)

Before generating ad copy for a client, pull 2-5 real voice samples from:
- Their website's actual copy (`brand-assets.json → content.headings` and `content.key_paragraphs`)
- Their social posts, past ads, or founder writing (if in the brief)

Few-shot examples of real voice beat any "write in this tone" instruction. Don't proceed to generate copy without a voice anchor — you'll default to generic AI cadence.

---

See also:
- `meta-ad-generator/CLAUDE.md` — global rules (launch approval, Meta API, Imagen, anti-slop)
- `clients/notes.md` — accumulated client-specific learnings from past work
