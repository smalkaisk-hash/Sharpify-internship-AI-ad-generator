# Meta Ad Generator — Pipeline Instructions

You are the orchestrator. The user gives you a website URL and a brand brief; you run the pipeline below. Stages 1 and 3 are Python scripts you invoke. Stage 2 is **you** doing copywriting work directly, guided by `prompts/copywriter.md` and `prompts/refiner.md`.

The design spec is at `docs/superpowers/specs/2026-05-11-meta-ad-pipeline-design.md`. The implementation plan is at `docs/superpowers/plans/2026-05-11-meta-ad-pipeline-stages-1-3.md`.

## When the user gives you a URL + brief

### Step 1 — Scrape

If the user supplied the brief as a file path:
```
python -m adgen scrape <url> --brief <path-to-brief-file>
```

If they typed the brief inline, save it to a temp file first, then pass `--brief`:
```
python -m adgen scrape <url> --brief <temp-brief-file>
```

Note the domain from the scraper's final output line. The scrape output lives at `clients/<domain>/scrape/`.

### Step 1b — Validate images

```
python -m adgen validate-images clients/<domain>/scrape/manifest.json
```

If validation reports issues (missing logo, images too small, not enough usable assets), **stop and surface the issues to the user** before proceeding to copy. Do not write copy against broken assets.

### Step 2 — Copy

1. Read these files into context:
   - `clients/<domain>/scrape/info.txt` — brand summary **and social proof** (look for `[TESTIMONIAL]`, `[REVIEW COUNT]`, `[PRESS]`, `[BADGE]` lines)
   - `clients/<domain>/scrape/manifest.json` — structured data (language, brand_name, `social_proof` key)
   - `clients/<domain>/scrape/client_memory.txt` — assets summary and brand context
   - `clients/<domain>/brief.txt` — the user's brief
   - `prompts/copywriter.md` — your instructions

2. Following `prompts/copywriter.md` **exactly**, generate the components JSON. Write it to `clients/<domain>/copy/components.json`. Do not include any prose around the JSON; the file must be valid JSON.

   **Testimonials:** if `info.txt` contains `[TESTIMONIAL]` lines, include a `"testimonials"` array in the JSON using verbatim scraped quotes. Omit the field if no real testimonials were found — never fabricate quotes.

   **Social proof in copy:** if `[REVIEW COUNT]` or `[BADGE]` entries exist, use the specific number in headline C and reference it in a bullet.

3. Validate the output:
   ```
   python -m adgen validate clients/<domain>/copy/components.json
   ```

4. If the validator reports issues:
   - Read `prompts/refiner.md`.
   - Fix only the flagged issues. Preserve everything else.
   - Write the result to `clients/<domain>/copy/refined.json`.
   - Re-run the validator on `refined.json` to confirm clean.

5. Promote the canonical version to `final.json`:
   ```
   python -m adgen promote-copy <domain>
   ```
   Stages 4+ read only `final.json`.

### Step 3 — Palette

```
python -m adgen palette <domain>
```

Output lands at `clients/<domain>/palette/chosen.json` (top pick) and `clients/<domain>/palette/shortlist.json` (top 5 for reference).

### Step 3b — Generate brand image (optional)

```
python -m adgen generate-image <domain>
```

Uses Pollinations AI to generate a brand image. Output lands at `clients/<domain>/image/generated.jpg`. Seed is saved to `clients/<domain>/image/seed.txt` for reproducibility.

Skip this step for service or intangible brands — render templates degrade gracefully to palette gradients when no photo is provided.

Pass the generated image to the render step with `--photo`:
```
python -m adgen render <domain> --photo clients/<domain>/image/generated.jpg
```

**Available flags:**

| Flag | Values | Default | Purpose |
|------|--------|---------|---------|
| `--count N` | integer | 1 | Generate N images (each gets a unique prompt) |
| `--seed INT` | integer | random | Fix seed for reproducibility (single image only) |
| `--model NAME` | e.g. `flux` | `flux` | Pollinations model |
| `--concept` | `lifestyle`, `product-flat`, `before-after`, `social-proof` | `lifestyle` | Visual concept |
| `--format` | `square`, `portrait` | `square` | Canvas: square=1080×1080, portrait=1080×1350 |

**Concept guide:**
- `lifestyle` — person in a brand-matching scene (default, works for all categories)
- `product-flat` — clean product-on-surface shot, no people (best for e-commerce)
- `before-after` — split problem/solution composition (best for transformations)
- `social-proof` — happy customer portrait, testimonial feel (pair with testimonial ad templates)

**Portrait format (4:5):** use `--format portrait` to generate 1080×1350 images for portrait-layout ads. Portrait ads occupy ~25% more screen on mobile feed. When writing portrait HTML, set `.ad { width:1080px; height:1350px }` and keep primary content in the upper 60% of the canvas (bottom 20% is sometimes clipped in preview).

### Step 4 — Write HTML ads directly, then validate

#### 4a — Read brand context

Before writing HTML, read:
- `clients/<domain>/palette/chosen.json` — hex colours for all roles
- `clients/<domain>/copy/final.json` — headlines, bullets, CTA, body text
- `clients/<domain>/scrape/manifest.json` — logo path, brand name, language, **and `logo_bg`**
- `clients/<domain>/image/` — generated photos (one per ad)

#### 4b — Write unique HTML ad files

Write each ad directly to `clients/<domain>/html/ad-N-<slug>.html`. There are no templates — design each layout from scratch, tailored to this specific client's brand, palette, and copy tone. Do not reuse layouts from previous clients.

Each ad must be a self-contained 1080×1080 HTML file. Design principles:
- Use only the palette colours from `chosen.json` — never hardcode arbitrary hex values.
- Logo `height` = `_LOGO_HEIGHT` (116px), `max-width` = 360px. On light/cream backgrounds add `filter:brightness(0);opacity:0.70`.
- **Logo placement based on `manifest.logo_bg`:**
  - `"transparent"` — logo can float on any background freely, no wrapper needed.
  - `"white"` — always sit the logo on a white panel. Either place it in a naturally white section of the layout, or add `.logo-zone { background:#fff; padding:8px 16px; border-radius:6px; display:inline-block; align-self:flex-start; }` and wrap the `<img>` in it. Never float a white-bg logo directly over a dark photo or dark panel.
  - `"dark"` — logo works on light/white sections. On dark panels add a white `.logo-zone` strip.
  - `"color"` — treat same as `"white"`: add a contrasting panel so the logo background doesn't clash.
  - If `logo_bg` is missing (old manifest), assume `"white"` and add a white zone on dark panels.
- No brand-tag spans next to the logo — logo image only.
- CTA pinned to bottom (`margin-top:auto` or `position:absolute;bottom:0`).
- 4-item bullet lists → 2-column grid (`display:grid;grid-template-columns:1fr 1fr`).
- **Bullet style — one unique style per ad**: every ad in a batch must use a different bullet style. Cycle by 0-indexed ad position. Get the CSS block to paste into `<style>` by running:
  ```
  python -c "from adgen.render.bullet_styles import bullet_style_for_ad,bullet_style_css; print(bullet_style_css(bullet_style_for_ad(N),'ACCENT','ACCENT2'))"
  ```
  Replace `N` (0, 1, 2 …), `ACCENT`, and `ACCENT2` with the hex values from `chosen.json`. The 7 styles in rotation order:
  | Index | Name | Visual |
  |-------|------|--------|
  | 0 | `gradient-pill` | full gradient fill pill + drop shadow — most aggressive |
  | 1 | `glow-border` | outlined pill with neon color glow |
  | 2 | `color-flash` | full-width stripe + 5px left accent bar (feature-table feel) |
  | 3 | `hard-tab` | sharp 5px left border only, no container — editorial |
  | 4 | `frosted-card` | frosted glass card with backdrop-blur |
  | 5 | `numbered-badge` | numbered accent circles replace icons (CSS counters) |
  | 6 | `accent-dot` | glowing dot marker + bottom-border separator |
- Each ad uses a different photo from `clients/<domain>/image/`.
- Include `<script>document.fonts.ready.then(()=>{ document.title="fonts-ready"; });</script>` before `</body>`.

#### 4c — Validate

```
python -m adgen render <domain>
```

This runs the layout validator on every HTML file in `clients/<domain>/html/` and fixes issues in-place. Check for `[layout]` and `[template] WARN` lines and fix any that appear.

### Step 5 — Export PNG

```
node path/to/export-png.js clients/<domain>/html/ clients/<domain>/png/
```

### Stages 6–7

Not yet implemented. After stages 1–5 finish, summarize what was produced and stop — wait for the user's next instruction.

## When the user asks for something else

If the user is iterating on a single stage (e.g. "regenerate the copy for 123spa.lv"), run only that stage. Each stage is independently re-runnable as long as the prior stage's output exists.

---

## Ad design rules — do not break these

These rules were learned from iterative feedback. Violating them means re-rendering.

### Logo
- **Size**: always 116px height (`_LOGO_HEIGHT` in `adgen/render/templates.py`). Use this value consistently across every ad in a set.
- **Max-width**: 360px (`_LOGO_MAX_W`) — prevents wide logos overflowing narrow panels.
- **No brand-tag spans**: never add `<span class="brand-tag">` or any duplicate text next to the logo image. Logo image only.
- **Light backgrounds**: add `filter:brightness(0);opacity:0.70` to the logo tag whenever the ad background is light/cream — makes a white-on-transparent logo visible.
- **Logo background (`logo_bg` in manifest)**: `validate-images` detects the logo's background type and writes it to `manifest.json`. Read it in step 4a and follow the placement rules — white-bg logos must never float over dark panels.
- **Validator**: `LOGO_IMG_MAX_H` and `LOGO_HEADLINE_MAX_RATIO` in `validate_html.py` are set permissively on purpose. Do not lower them — they must not fight `_LOGO_HEIGHT`.
- **Logo size optimizer**: after writing all HTML ads in a batch, run `node path/to/find-logo-size.js clients/<domain>/html/ --apply` to auto-tune each ad's logo height to best align with its headline. 116px is the default; the optimizer may lower it for ads with narrow text columns or raise it where the column is wide. Always verify ads that use a stat number (e.g. "4.9") as their primary element — the optimizer may match the stat instead of the headline.

### Photos
- Each ad must use a **different** generated photo. Run `generate-image --count N` to get N images, then render each ad with its own `--photo` flag.
- Never pass the same photo to more than one ad in a set.

### Positioned elements near the logo
- Any absolutely positioned element below the logo must have its `top` computed as `logo_top + _LOGO_HEIGHT + gap` — use a Python f-string expression, never a hardcoded pixel value that will break if logo height changes.

### Layout patterns
- **4-item bullet lists** → 2-column grid (`display:grid;grid-template-columns:1fr 1fr`). Single-column leaves the right half empty. **Exception:** when a shaped frame occupies the right side of the canvas and the text column's content width (text-col-width − padding-left − padding-right) is ≤ 350px, use a single-column flex list instead — the two-column grid produces 175px-wide cells which are too narrow for 22px text.
- **Editorial dark column** → two equal `flex:1` spacers: one above the headline, one below the bullets. This distributes dead space symmetrically. Never use a single spacer plus `margin-top:auto` on the CTA — it creates a dead zone.
- **Headline clearance**: `.hd-wrap` needs `padding-bottom:28px` before the rule/bullets. Less than ~20px and the headline crashes into the next element at large font sizes.
- **CTA positioning**: use `margin-top:auto` (flex child) or absolute `bottom:0` to pin the CTA to the bottom. Do not rely on a spacer alone.
- **Vertical centering — what goes inside vs outside `.middle`**: `.middle { flex:1; display:flex; flex-direction:column; justify-content:center; width:100% }` should hold **only the headline block** (eyebrow + `.hd` + subtitle). Bullets, benefit lists, and chips must be placed **outside** `.middle` as direct siblings, between `</div>` (end of middle) and the CTA. Putting bullets inside `.middle` creates two equal dead voids — one above the headline and one between the bullets and the CTA. The gap below bullets reads as "odd empty space" and was the root cause of the afepo batch layout issues.
- **Sparse content / Q&A layouts** (no bullet list): skip `.middle` entirely. Use `.spacer { flex:1 }` as a single absorber, then stack all content (headline + sub + chips) as direct flex children below the spacer. This pushes the block to the bottom, with the photo visible through the spacer area.

### Typography
- **Hyphenation**: the universal reset must be `*{margin:0;padding:0;box-sizing:border-box;hyphens:none;-webkit-hyphens:none}`. Never use `hyphens:auto`. Also add `hyphens:none;-webkit-hyphens:none` on `.hd` directly as a belt-and-suspenders. The validator auto-corrects missing resets and any `hyphens:auto` it finds.
- **No hard hyphens in content**: never split a word across a `<br>` with a hyphen — e.g. `tehno-<br>loģijas` is forbidden. If a word is too long to fit, reduce font size or widen the column; never write a manual word-split hyphen. The validator detects and fixes `letter-<br>` patterns automatically.
- **Headline font-weight**: for non-editorial templates, `.hd` must use `font-weight:700` or higher. The ad has ~1 second of attention on mobile — sub-600 weight headlines disappear. The validator warns when it detects weight below 600 on a non-editorial (non-Cormorant) template.
- **Editorial exception**: Cormorant Garamond at 400-600 is intentional for luxury/premium brands. The validator skips the weight check when Cormorant is present.
- **Recommended type choices**: bold/grotesque templates → Barlow Condensed 800, Inter 800; editorial templates → Cormorant Garamond 400-500; clean-sans templates → DM Sans or Inter 600-700.
- **Minimum type scale** (1080×1080 canvas): headline ≥ 68px, subtitle/body ≥ 22px, bullet/benefit text ≥ 22px, chip/tag labels ≥ 20px, CTA button text ≥ 21px, eyebrow/badge ≥ 20px, proof/fine-print ≥ 18px. Rationale: the ad renders at ~360px on a phone feed (0.33× scale), so a 22px element lands at ~7px on screen — the minimum legible size. Anything below 22px becomes noise. Scale proportionally for portrait (1080×1350) canvases.
- **Bullet/benefit icon size**: SVG icons (`.bicon`) paired with bullet text must be ≥ 24px. Set BOTH the CSS (`.bicon{width:24px;height:24px}`) AND the inline SVG viewBox/path coordinates consistently — do not use `width="16"` or `width="18"` SVGs next to 22px text. The validator auto-fixes `.bicon` that falls below 24px.
- **Shaped frame text column boundary**: When a shaped photo frame is anchored from the right (`right:Xpx; width:Wpx`), its left canvas edge = `1080 − X − W`. The text column's content right edge = `text-col-width − padding-right`. That value **must be ≤ the frame's left canvas edge** or bullets will appear inside the photo. Add ≥10px clearance. Example: frame at `right:36px; width:620px` → left edge = 424px → text-col must satisfy `text-col-width − padding-right ≤ 414px`.
- **Two-spacer naming**: name both spacers exactly `class="spacer"` and `class="spacer2"`. The validator counts `spacer*` class names — one spacer triggers a dead-zone warning, two passes cleanly.

### Portrait ads (4:5, 1080×1350)
- Set `.ad { width:1080px; height:1350px }`.
- Keep all key content (logo, headline, CTA) in the top 80% of the canvas — the bottom 20% may be clipped in feed preview.
- Generate portrait photos with `python -m adgen generate-image <domain> --format portrait` so image proportions match the canvas.
- Template slug convention: `ad-N-portrait-<concept>` (e.g. `ad-5-portrait-testimonial`).

### Testimonial ads
- Use the `"testimonials"` array from `final.json` when available (scraped real quotes only).
- Layout: face/social-proof photo fills left 50%; quote card with star rating + name on right; brand logo + CTA bottom.
- Generate the photo with `--concept social-proof` for an authentic customer portrait feel.
- Testimonial quote max 120 chars in the HTML — truncate with "…" if longer.

### Export
- The PNG exporter (`meta-ad-generator/scripts/export-png.js`) runs from the `meta-ad-generator/` directory.
- Second argument is always a **directory**, never a file path.
- deviceScaleFactor is 2 — output is 2160×2160 (retina). Do not change this.

---

## Visual design direction — make it pop

Every ad must be visually arresting. A rectangle with text is not acceptable. Each layout should have a defining shape moment — something that stops the scroll.

### Shape vocabulary — use these and invent new ones

**Organic / flowing shapes**
- `clip-path:path('M ...')` blob frames — asymmetric organic ovals that breathe and feel alive
- Teardrop frames — `M 250,H C 250,H-40 0,700 0,460 C 0,226 112,0 250,0 C 388,0 500,226 500,460 C 500,700 250,H-40 250,H Z` — pointed at the bottom, tall and dramatic
- Concave sweep — a photo zone clipped with an S-curve or concave left edge, using `path('M X,0 C cx,270 cx,810 X,1080 L W,1080 L W,0 Z')`

**Wave / motion shapes**
- SVG wave panel rising from the bottom — `<svg viewBox="0 0 1080 90"><path d="M 0,69 C 130,25 262,88 405,51 ..." fill="#E9D9C8"/></svg>` — the cream content area erupts from a wavy horizon into the photo
- Diagonal sash / band — a full-width `<div>` with `transform:rotate(-5deg); left:-120px; right:-120px` to bleed past canvas edges. Use for a headline that slashes across the image.
- Multiple diagonal bands — eyebrow band (semi-transparent) + main coral headline band + accent band below

**Geometric / structured shapes**
- Diagonal split panel — dark text panel as `clip-path:polygon(0 0, 55% 0, 64% 100%, 0 100%)` with photo full-bleed behind it. The diagonal leans for direction and movement.
- Circle / arch frames — `border-radius:50%` or arch clip-path for the photo, with a decorative ring behind it (same shape at 108% size, stroke only)
- Half-moon, pill, stadium shapes — wide `border-radius` values for unexpected cropping

### Every shape needs a decorative echo
Never leave a shape alone — add a sibling decorative element:
- A thin stroke ring (same path, slightly larger, `fill:none; stroke:rgba(...,0.42); stroke-width:1.5`) behind the photo frame
- A gradient that feathers the edge where shape meets background (`edge-blend` pattern)
- A matching SVG accent line tracing the shape boundary

### Photo framing rules
- Photo must feel **large and immersive** inside its shape — scale the frame to 65–85% of canvas height
- `object-position` for portrait/face subjects: `50% 10%`–`50% 18%` to crop to upper body and face. Never `50% 50%` — that shows a tiny full-body figure.
- The frame should feel like the subject is bursting out of or into the text side

### Color and contrast
- Maximum contrast between the photo frame and background creates the pop. Cream `#E9D9C8` on deep teal `#3E4C54` background (or reverse) is the strongest pair.
- Accent strokes, dots, lines: use the second tone (peach/gold e.g. `#E4A489`) at 0.38–0.55 opacity for decorative elements — they should feel subtle, not loud.
- CTA button: always solid coral / brand accent on contrasting background. Never muted.
- **Tinted neutral backgrounds**: never use pure `#1E1E1E` or `#FFFFFF` when a brand hue is available. Mix ~8% of the dominant logo color into the base — blue brand `#007FFF` → dark panel `#0D1A2E`, light panel `#F0F5FF`; yellow brand `#FFD600` → dark panel `#1C1A0F`. Apply the same tint to bullet card `background:rgba(...)` values. This makes the logo feel integrated, not pasted on.

### Text readability over photos
- **Never use a gradient overlay** to fix white text clashing with a light photo area. Gradients darken or obscure the photo.
- **Fix order**: (1) shift `object-position` so a naturally dark area of the photo sits behind the text — increase Y% to pull the photo upward and expose darker lower portions; (2) wrap the text block in a frosted glass card (`background:rgba(0,0,0,0.42);backdrop-filter:blur(14px);border-radius:16px;padding:20px 28px`); (3) add multi-layer `text-shadow:0 0 40px rgba(0,0,0,0.95),0 0 80px rgba(0,0,0,0.80)` as belt-and-suspenders.
- Gradients are only acceptable for the narrow logo scrim zone (diagonal corner, small area) documented in the Logo section.

### What makes it feel flat — avoid these
- A rectangular photo with straight edges — always clip or mask it
- Empty background with no texture, gradient, or decorative element
- Shapes that feel timid (a small circle in one corner) — own the canvas
- Two ads in the same set with similar layouts — every ad in a batch must use a different shape concept
- Floating elements with no visual anchor (a decorative ring with no relationship to the photo)

### Shape checklist before writing any HTML ad
1. What is the single defining shape of this ad? (name it: wave, blob, teardrop, sweep, diagonal split, bands…)
2. Is the photo large and immersive inside the shape?
3. Is there a decorative echo element (ring, accent line, gradient feather)?
4. Does the layout have directional energy — diagonal, curve, or wave — not just horizontal and vertical lines?
5. Would someone scrolling at speed stop to look at it?

If the answer to question 5 is "maybe" — redesign.
