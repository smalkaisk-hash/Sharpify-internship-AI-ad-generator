# Meta Ad Generator — Global Rules

Rules that apply to ALL ad work regardless of workspace (clients, Sharpify LV, Sharpify ENG). Workspace-specific rules live in their own CLAUDE.md files:

- `clients/CLAUDE.md` — client ad work
- `sharpify/CLAUDE.md` — Sharpify cross-language rules
- `sharpify/lv/CLAUDE.md` — LV account specifics
- `sharpify/eng/CLAUDE.md` — ENG account specifics

---

## 1. Launch & QA (universal)

### Never launch without approval
Always present creatives + copy first and ask "Palaižam Meta?" (or similar). Only call Meta's API after explicit user approval. Applies to API creation, not just UI uploads.

### Always create as PAUSED via API
Set `status: "PAUSED"` on every ad creation call. User flips to ACTIVE manually after verification.

### Full self-QA before presenting any ad set
Before showing the user any batch:
1. **View every rendered PNG** (not just 2-3 samples) — catch wrapping issues, overflow, overlap, orphan words, typos
2. **Native-speaker plausibility check on every headline** — read aloud, does a real person in that market actually say this? Watch LV→ENG direct translations ("You roof homes", "You finish the windows") and plural-noun traps (windows/tiles/shingles)
3. **Offer/bonus verification** — any chips, gifts, badges, price slashes must match the actual landing page / product
4. **After any font/layout change: regenerate ALL variants, view ALL PNGs** — one fix can break others

The user's job is strategic review, not proofreading. Do QA silently.

### Always fetch the live landing page first
Before writing ad copy, WebFetch the current live landing page and verify:
1. **Language match** — ENG ads to ENG page, LV to LV. Stop if mismatched.
2. **Current offer** — page content changes over time (e.g., `reg.sharpify.lv/ai-workshops/` flipped from live workshop to digital product at different times).
3. **Current pricing** — live page prices override any cached prices.

First step in any ad session: `WebFetch` on the target URL.

---

## 2. Emoji Pattern (universal)

**Two-emoji system in ad primary text:**
- **✅** checkmarks for **pain point checklists** ("Vislabāk varam palīdzēt tiem, kas:" / "Are you a business owner who:")
- **🔹** blue diamonds for **feature/benefit lists** ("Ar MP Risinājums™ ieviešam:" / "Inside you'll find:")
- **🎁** allowed for gift/bonus callouts ("🎁 Free website included")

Do NOT use decorative emojis (🔧, 🤔, 🏆, ⭐, 🌍, 📰, 👇) — business owners don't want decorative emojis in B2B ads.

No emoji openers. No emoji CTAs. No emoji decorations. Write social proof stats as plain text ("Over 5 million euros in services sold...").

---

## 3. Workflow Rules

### Delete HTML when deleting PNG
`scripts/export-png.js` regenerates PNGs from every HTML it finds. When removing unwanted ads, delete BOTH `{workspace}/output/{slug}/png/ad-N.png` AND `{workspace}/output/{slug}/html/ad-N.html` — or the next export resurrects the deleted ad as a ghost.

### Never duplicate text across ads in a set
Every ad in the same campaign/adset must have unique headlines AND primary text. User-provided example text is directional hook concept, not literal copy to duplicate.

### Preserve layout when iterating on text/image changes
When the user asks for tweaks ("make text bigger", "remove this label", "swap this image"), edit ONLY what they asked and keep every other pixel identical. Don't redesign layouts mid-iteration — forces the user to re-evaluate everything and wastes rounds.

### When image generation fails, retry sequentially (not parallel)
Gemini Imagen 4 fails intermittently with 503 DEADLINE_EXCEEDED, especially when spawned in parallel via `&` in bash. If a batch fails, retry failed ones ONE AT A TIME. Parallel spawns race the API; sequential retries almost always succeed.

### Source HTML files are handed off to designers
Keep HTML clean and editable — no unused divs, no inline styles that duplicate CSS, no broken refs. Designers on the team need to tweak these files by hand.

---

## 4. Design Taste — Anti-AI-Slop Heuristics (universal)

These principles separate forgettable AI-looking ads from ones people actually stop for. Apply on every design decision across every workspace.

### Commit to a bold aesthetic direction
Before designing, pick ONE extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, editorial/magazine, brutalist/raw, art deco, pastel/soft, industrial/utilitarian.

**Don't default to "modern" or "clean" — that's the AI fallback.** Pick a direction, commit fully, execute it precisely. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Typography
- Avoid Inter, Roboto, Arial, and system fonts as **headline** fonts — they scream AI-generated. Fine as body fonts only.
- Pair a distinctive display font with a refined body font (e.g., Instrument Serif + Space Grotesk, Fraunces + Inter, PP Neue Machina + Newsreader).
- Rotate fonts across clients — if the last 2 clients got Space Grotesk, use something else for the third. Never converge on the same "safe" font twice.
- Base templates use Montserrat/Inter as the floor. For custom/editorial/extra templates, reach higher.

### Color & theme
- Dominant colors with sharp accents beat timid evenly-distributed palettes (60-70% dominant / 10-15% sharp accent / rest neutrals).
- **NEVER purple gradients on white.** Single most obvious AI-slop color combo.
- Match palette to product category — beauty soft/luxe, security dark+urgency, B2B staffing industrial yellow+dark, SaaS restrained greys/blacks + one bold accent. Don't default to dark-tech for everything.
- Vary light/dark theme between clients.

### Spatial composition
- Prefer asymmetry, overlap, diagonal flow, grid-breaking over balanced-and-boring centered layouts.
- Generous negative space OR controlled density — pick one. The mushy middle is forgettable.
- Full-bleed imagery, corner elements, rotated cards, clipped frames add perceived production quality.

### Backgrounds
- Don't default to solid colors. Add atmosphere: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, subtle grain overlays.
- Gradient mesh + color-matched palette IS a gradient — fits the intangible-product "no stock hero" rule.

### Sanity check before shipping
- Could this ad have been generated by any AI pipeline? If yes → it's generic, rework.
- Is there ONE memorable detail someone would describe to a friend? If no → add one.
- Would a senior art director show this in their portfolio? If no → keep iterating.

---

## 5. Plugin Integrations

### Figma (`figma@claude-plugins-official`)
Preferred source of truth for brand assets. When a client provides a Figma file URL in the brief, `2-brand-scraper` uses the Figma MCP instead of web scraping. Figma wins because scraped CSS colors often pull random greys from framework defaults, not actual brand intent.

Fall back to web scraper if no Figma URL.

### Remotion Superpowers (`remotion-superpowers`)
Video ad production. Ships 3 agents (video-director, media-scout, post-producer), 15 slash commands (`/create-video`, `/add-voiceover`, `/add-music`, `/add-captions`, `/add-transitions`, `/review-video`, etc.), and MCP tools for image/music/speech/subtitle generation.

Our 4-scene structure (HOOK / PROBLEM / PROOF / CTA, 13-15s) maps directly into the plugin. LV and ENG Sharpify skills call this plugin instead of hand-coding Remotion.

Videos hit 3-5% CTR vs 1-2% for static (LV account history) — prefer video when budget allows.

Brand constraints that override plugin defaults are documented per-workspace (`sharpify/CLAUDE.md` for Sharpify brand palette, `clients/CLAUDE.md` for client-specific).

---

## 6. Meta Graph API Reference (v21.0)

### Deprecated fields
Don't include `degrees_of_freedom_spec.standard_enhancements.enroll_status` on ad creative creation — returns `error_subcode: 3858504`.

### Advantage Audience + age_max
If `targeting_automation.advantage_audience: 1`, Meta enforces `age_max >= 65`. Use 65 as hard max. Error: `error_subcode: 1870189`.

### Optimization goals
- **THRUPLAY** — 15-second video views (max eyeballs on video content)
- **LEAD_GENERATION** — lead form submissions (LV default for MP Risinājums)
- **LINK_CLICKS** / **LANDING_PAGE_VIEWS** — website-destination (ENG default for B2B Playbook)

### Encoding
Use **Python urllib**, NOT `curl -F`, when creating ads with Latvian special characters — multipart form encoding breaks on special chars.

---

## 7. Gemini Imagen 4 Reference

### 503 / DEADLINE_EXCEEDED
Usually too-long prompt (30+ descriptors) or parallel spawns. Shorten to ~80 words. Retry failed generations **one at a time**, never in parallel.

### Off-topic outputs
Imagen 4 occasionally returns unrelated images. Retry with stripped-down prompt. Add explicit framing: `"empty space no people"` for interiors, `"extreme close-up of [subject]"` for details.

### Output path gotcha
`generate-image.js` resolves paths relative to CWD. Running from `meta-ad-generator/` with `claude-ad/output/foo.png` creates nested `meta-ad-generator/claude-ad/output/foo.png`. Use absolute paths or paths relative to the workspace's output/.

### Reusable niche photo library
`sharpify/lv/output/sharpify-leadgen/images/` holds proven niche persona photos (niche-jumiki.png, niche-it.png, niche-buvnieks.png). Reuse before regenerating.
