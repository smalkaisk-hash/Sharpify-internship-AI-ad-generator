# Meta Ad Generator — Project Rules

Everything below auto-loads into every Claude Code session in this project. These are the operating rules — not suggestions. All rules derive from user feedback during real ad work; each "**Why:**" cites the original incident.

---

## 1. Ad Generation Routing

Three ad paths. Auto-route based on what the user asks for:

| Trigger | Skill | Product | Account |
|---|---|---|---|
| "make ads for [client/link]", third-party business | `full-pipeline` | Client's product | Client's ad account |
| "LV account", "Latvian ads for [niche]", "reklāmas priekš [niša]" | `reklamas-meta-sharpify` | MP Risinājums™ | `act_549172712351324` |
| "English account", "ENG ads for [niche]", "B2B Playbook ads" | `reklamas-meta-sharpify-eng` | B2B Playbook / Website Offer | `act_1184056475376090` |

**ENG account runs TWO products:**
- **B2B Playbook** — landing `eu.sharpify.lv/ms/`. Lead-gen for consultants/coaches. Long-form MS Solution framing, €50M+ generated claim. Default for ENG Sharpify ads.
- **Website Offer** — landing `web.sharpify.lv`. Direct purchase for service providers needing a website, €299→€59 (built in 1-3 days). Audience: solo founders, trades, local services. Don't reuse B2B Playbook templates here.

---

## 2. Launch & QA Rules

### Never launch without approval
Always present creatives + copy first and ask "Palaižam Meta?" (or similar). Only call Meta's API after explicit user approval. Applies to API creation, not just UI uploads.

### Always create as PAUSED via API
Set `status: "PAUSED"` on every ad creation call. User flips to ACTIVE manually after verification.

### Full self-QA before presenting any ad set
Before showing the user any batch:
1. **View every rendered PNG** (not just 2-3 samples) — catch wrapping issues, overflow, overlap, orphan words, typos
2. **Native-speaker plausibility check on every headline** — read aloud, does a real tradesperson in that market actually say this? Watch LV→ENG direct translations ("You roof homes", "You finish the windows" etc.)
3. **Offer/bonus verification** — any chips, gifts, badges, price slashes must match the actual landing page / product
4. **After any font/layout change: regenerate ALL variants, view ALL PNGs** — one fix can break others

The user's job is strategic review, not proofreading. Do QA silently.

---

## 3. Copy Rules

### Emoji pattern (two-emoji system)
- ✅ for **pain point checklists** ("Vislabāk varam palīdzēt tiem, kas:")
- 🔹 for **feature/benefit lists** ("Ar MP Risinājums™ ieviešam:")
- NO other decorative emojis (🔧, 🤔, 🏆, ⭐, 🌍, 📰, 👇 etc.)
- No emoji openers, no emoji CTAs, no emoji decorations
- Social proof stats = plain text ("Over 5 million euros in services sold...")

### Never duplicate text across ads
Every ad in a set must have unique headline + body. User's example text is directional "hook" concept, not literal copy to duplicate.

### Playbook is NOT free (ENG B2B Playbook only)
Never use "free", "free playbook", "free training" in ENG B2B Playbook ad copy. Use "Get the Playbook", "Download the Playbook", "Get Instant Access" instead.

**Exception:** The website bonus IS free. "🎁 Free website included" is correct on MS-funnel ads (LV and ENG). The rule only applies to the downloadable playbook itself.

### No "€10K+/month" targeting claims in LV warning ads
Don't use "kas gatavi augt līdz €10k+ mēnesī ar AI mārketinga sistēmu". Use "kas gatavi uzņemt jaunus klientus katru mēnesi ar AI mārketinga sistēmu" instead.

**Exception:** Real past client results in case-study carousels ("Baiba Aucīte 3 gados līdz €10K/mēn") are fine — factual outcomes, not a promise.

### LV "parūpējies" headline formula (arched template)
**Correct:** "Tu parūpējies, lai [client outcome], kamēr nākamais [klients/objekts/pasūtījums] jau gaida rindā."

**Wrong:** "Tu parūpējies par [product noun]" — in LV, "parūpēties par X" implies maintenance/caring-for, doesn't fit installation trades.

Examples:
- garāžas durvis: "Tu parūpējies, lai garāžām ir kvalitatīvi vārti, kamēr nākamais klients jau gaida rindā."
- flīzētāji: "Tu parūpējies, lai flīzes ir perfektas, kamēr nākamais objekts jau gaida rindā."
- jumiķi: "Tu parūpējies, lai ūdens nebojā māju, kamēr nākamais klients jau gaida rindā." (NOT "lai jumti ir sausi" — gutters don't dry roofs)

`[outcome]` must be factually accurate for the trade — would a contractor actually claim this? Vary italic noun per niche for uniqueness. Font size 46px fits ~48 chars on line 1 at 960px width in Instrument Serif.

---

## 4. Design Rules

### No background images — use gradients
Solid color gradients with brand colors. User tested real product screenshots and team photos — they looked unprofessional and cluttered.

### No logos on V2 (bold-statement) and V5 (benefit-stack)
Templates already updated. Other layouts: only if client requests.

### Center all text by default
Break long headlines with `<br>` tags — each line a complete thought. Left-aligned text on solid backgrounds looks unbalanced.

### Never repeat information on one ad
If price is in the CTA button, don't also put it in a badge. Use the second spot for a trust signal or date.

### V4 = Before vs After comparison (not ironic testimonial)
- Two columns: left red (pain points), right green (benefits)
- 5 items each with emoji icons
- Never use made-up reviews — fake reviews are a "big nono"

### Interface mockups fatigue fast
Google/ChatGPT/iMessage/iPhone Notes mockups work as scroll-stoppers the FIRST exposure but fatigue fast across scaled campaigns. Use at most 1-2 per set of 10+. Default to editorial / poster / documentary / product-forward. Never propose a full campaign built on interface mockups.

---

## 4.4. Plugin Integrations

### Figma (`figma@claude-plugins-official`)
**Preferred source of truth for brand assets.** When a client provides a Figma file URL in the brief, the `2-brand-scraper` skill uses the Figma MCP instead of web scraping:
- Colors → from Figma variables / style guide / color styles
- Typography → from text styles (font family, weight, size)
- Logo assets → from logo frames/components
- Branded imagery → from pages marked as brand assets

Figma wins over web scraping because it's the designer's source of truth (scraped CSS colors often pull random greys from framework defaults, not actual brand intent).

**Sharpify's own brand kit:** We should maintain Sharpify's brand in a Figma file so LV/ENG ads pull from it automatically rather than relying on scattered hex values in notes. TODO: set up canonical Sharpify Figma file.

**If no Figma URL is in the brief** → fall back to web scraper.

### Remotion Superpowers (`remotion-superpowers`)
**Video ad production upgrade** for the LV/ENG Sharpify workflows and (eventually) client video ads. Bundles:
- AI voiceover generation
- Music library integration
- Stock footage search
- TikTok-style captions
- Scene transitions
- AI review loop (critiques each scene before finalizing)

Our existing 4-scene structure (HOOK / PROBLEM / PROOF / CTA, ~13-15s) maps directly to the plugin. When the user asks for a video ad, the LV/ENG skills should call this plugin instead of hand-rolled Remotion code.

Videos hit 3-5% CTR vs 1-2% for static (per LV account history) — worth using when budget allows.

---

## 4.5. Design Taste — Anti-AI-Slop Heuristics

These are the principles that separate forgettable AI-looking ads from ones people actually stop for. Apply on every ad design decision.

### Commit to a bold aesthetic direction
Before designing, pick ONE extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, editorial/magazine, brutalist/raw, art deco, pastel/soft, industrial/utilitarian.

**Don't default to "modern" or "clean" — that's the AI fallback.** Clean + modern = generic. Pick a direction, commit fully, execute it precisely. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Typography
- **Avoid Inter, Roboto, Arial, and system fonts as headline fonts.** They scream AI-generated. Fine as body fonts only.
- **Pair a distinctive display font with a refined body font** (e.g., Instrument Serif + Space Grotesk, Fraunces + Inter, PP Neue Machina + Newsreader).
- **Rotate fonts across clients** — if the last 2 clients got Space Grotesk, use something else for the third. Never converge on the same "safe" font twice.
- **Our base templates use Montserrat/Inter as the floor.** For custom/editorial/extra templates, reach higher.

### Color & theme
- **Dominant colors with sharp accents beat timid evenly-distributed palettes.** One dominant color (60-70% of the frame) + one sharp accent (10-15%) + neutrals for balance — not four equal-weight colors competing.
- **NEVER purple gradients on white.** The single most obvious AI-slop color combo.
- **Match palette to product category.** Beauty → soft/luxe (rose, lavender, amber, gold). Security/industrial → dark moody + urgency red. B2B staffing → industrial yellow + dark. SaaS → restrained greys/blacks with one bold accent. Don't use a default dark-tech look for everything.
- **Vary light/dark theme between clients** — if two recent clients were dark, make the next one light.

### Spatial composition
- **Prefer asymmetry, overlap, diagonal flow, grid-breaking elements** over balanced-and-boring centered layouts.
- **Generous negative space OR controlled density — pick one.** The mushy middle is forgettable.
- **Full-bleed imagery, corner elements, rotated cards, clipped frames** add perceived production quality over plain rectangular compositions.

### Backgrounds & visual depth
- **Don't default to solid colors.** Add atmosphere: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, subtle grain overlays.
- These add production-value with minimal effort and differentiate from every other flat-color AI ad.
- **Exception:** our intangible-product rule (no generic stock-photo hero) still stands. Gradient mesh + color-matched palette is a gradient — fits the rule.

### Match complexity to vision
- Maximalist designs need elaborate code: multi-layer effects, animations, textures.
- Minimalist designs need surgical precision: perfect spacing, typography, alignment, one small unexpected detail.
- **Don't half-ass either direction.** Elegance IS execution.

### Sanity check before shipping
- Could this ad have been generated by any AI pipeline? If yes → it's generic, rework it.
- Is there ONE memorable detail someone would describe to a friend? If no → add one.
- Would a senior art director show this in their portfolio? If no → keep iterating.

---

## 5. Sharpify-Specific Facts

### Website pricing (web.sharpify.lv)
- **Original:** €299 (NOT €300, NOT €2,000)
- **Discounted:** €59
- **Savings:** €240 (NOT €241)
- **€2,000 / €2,500** = AGENCY comparison price for crossout comparisons only

### LV account — no quiz funnels
Account history: 0 leads across €35+ spend on 4 niches (roofing, IT, beauty, foundations) all running quiz funnels. Default to Meta's native lead gen form (ID `944838491325482`) with `destination_type=ON_AD`. If user asks for quiz funnel, flag the historical data before proceeding.

### Always fetch the live landing page first
Before writing ad copy:
1. **Language match:** ENG ads → ENG page. LV → LV. Stop if mismatched.
2. **Current offer:** Page content changes over time (e.g., `reg.sharpify.lv/ai-workshops/` was a live workshop, then flipped to "AI Rīku Komplekts" digital product).
3. **Current pricing:** Live page prices override any cached prices.

First step in any ad session is `WebFetch` on the target URL.

### Veo prompts — no generic cinematic b-roll
Don't prompt Veo for "cinematic commercial" footage (founder typing → website → handshake). Pretty b-roll = scrolled past. Lead with hook concept, not aesthetic. Prefer UGC/phone feel, visual metaphors, text-on-screen, absurd/funny framings, strong before/after with concrete payoff.

---

## 6. Pipeline Workflow Rules

### Delete HTML when deleting PNG
`scripts/export-png.js` regenerates PNGs from every HTML it finds. When removing unwanted ads, delete BOTH `output/{slug}/png/ad-N.png` AND `output/{slug}/html/ad-N.html` — or the next export resurrects the deleted ad as a "ghost."

---

## 7. Reference — Meta Graph API (v21.0)

### Deprecated fields
Don't include `degrees_of_freedom_spec.standard_enhancements.enroll_status` on ad creative creation — returns `error_subcode: 3858504`.

### Advantage Audience + age_max
If `targeting_automation.advantage_audience: 1`, Meta enforces `age_max >= 65`. Use 65 as hard max when enabled. Error: `error_subcode: 1870189`.

### Optimization goals
- **THRUPLAY** — 15-second video views (max eyeballs on video content)
- **LEAD_GENERATION** — lead form submissions (LV default for MP Risinājums)
- **LINK_CLICKS** / **LANDING_PAGE_VIEWS** — website-destination (ENG default for B2B Playbook)

### Latvian Sharpify identifiers
- **Page ID:** `116359515734204`
- **Instagram User ID:** `17841401853795292`

### Encoding
Use **Python urllib**, NOT `curl -F`, when creating ads with Latvian text — special chars break multipart form encoding.

---

## 8. Reference — Gemini Imagen 4

### 503 / DEADLINE_EXCEEDED
Usually too-long prompt (30+ descriptors) or parallel spawns. Shorten to ~80 words (strip verbose camera specs). Retry failed generations **one at a time**, never in parallel.

### Off-topic outputs
Imagen 4 occasionally returns unrelated images. Retry with stripped-down prompt. Add explicit framing: `"empty space no people"` for interiors, `"extreme close-up of [subject]"` for details.

### Output path gotcha
`generate-image.js` resolves paths relative to CWD. Running from `meta-ad-generator/` with `claude-ad/output/foo.png` creates nested `meta-ad-generator/claude-ad/output/foo.png`. Use absolute paths or paths relative to `output/`.

### Reusable niche photo library
`meta-ad-generator/output/sharpify-leadgen/images/` holds proven niche persona photos:
- `niche-jumiki.png` (roofer), `niche-it.png`, `niche-buvnieks.png`
- `reference/salona-ipasniece.jpg` = proven-winner aesthetic reference

Reuse before regenerating — saves API credits, keeps aesthetic consistent.

### LV leadgen persona prompt formula
See `.claude/skills/reklamas-meta-sharpify/notes.md` → "Photo prompt formula for niche entrepreneur portraits" for the canonical template. Tested on jumiķi, IT, būvnieki — all realistic.
