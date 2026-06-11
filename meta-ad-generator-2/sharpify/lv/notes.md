# LV Sharpify Ads — Workflow Notes

This file accumulates learnings specific to the Latvian Sharpify ad workflow. Claude reads this at the start of every LV ad session and writes new entries here when you give feedback.

## Format

Each entry follows this format:

```
### YYYY-MM-DD — [topic]
**Rule:** What to do (or not do)
**Why:** The reason — often a past incident or strong preference
**Example:** (optional) Specific case that triggered this
```

---

## Copy & Tone

### 2026-04-14 — Don't mock competitors in copy
**Rule:** Don't position Sharpify against "other agencies" by mocking them (e.g. "bet aģentūras prasa tūkstošus?"). Reframe toward the customer's goal instead.
**Why:** User said "we're not mocking other agencies" when reviewing V1 of the Sharpify €59 website ad. Comes across as combative.
**Example:** Replaced "bet aģentūras prasa tūkstošus?" with "kas patiešām piesaista klientus?"

### 2026-04-14 — Don't brag about Sharpify's own metrics as the core angle
**Rule:** Stats like "2,300+ uzņēmumu, €50M+ saģenerēti, Forbes 30 Under 30" are fine as supporting social proof, but an entire ad built around bragging about the company reads as self-congratulatory.
**Why:** User rejected V7 Trust Blitz ("kindof like we're bragging about our business"). Authority works when wrapped in customer-focused narrative (e.g. "Pirms Tu pērc AI kursu — pajautā: kas Tevi māca?"), not when it's "look how great we are."
**Example:** Replaced V7 with "Two Options" A/B choice ad instead.

### 2026-04-14 — Hot takes and counter-intuitive hooks beat pitch-style openings
**Rule:** Openings like "Beidz mācīties AI. Sāc to lietot." and "Tev ir divas opcijas..." perform better than "Iegūsti mājaslapu par €59!" style pitches. Use pattern interrupts: a question, a bold claim, a specific weird number.
**Why:** User praised V5 (Lost Client pain story), V6 (Speed Run with 10 min reveal), V8 (Objections), V9 (Calculator) as "really good" vs rejecting straightforward pitches.

### 2026-04-14 — Reviews MUST be real, never fabricated
**Rule:** Never invent customer testimonials. Only use actual reviews pulled from sharpify.lv / Trustpilot / Google. If no real reviews exist for a specific product (e.g. AI Rīku Komplekts), flag it to user and either use general Sharpify reviews with source badge, or drop testimonials from that ad entirely.
**Why:** User explicitly said "atsauksmes nezinu vai ir īstas, vai nu ieliekam īstas vai ņemam ārā atsauksmes."
**Example:** Proven real reviews: Kaspars Cveiģelis ("Jopcik. Perfekti 👍" · Google), Artūrs Mogijevcevs ("Sharpify ir labākais! Ļoti profesionāla un atsaucīga" · Trustpilot), Jeļena Beitane ("Baigi labais! Palīdz augt un attīstīties!" · Google), Oskars Kaneps-Kabinēji ("Great support, fantastic people..." · Trustpilot). Always stamp the source badge (Google / Trustpilot) on the ad.

### 2026-04-14 — "Salona īpašniece" formula is the proven LV service-provider leadgen structure
**Rule:** For any LV service-provider leadgen ad (roofer, IT, construction, beauty, etc.), use this exact copy structure:
1. Hook: `"Meklēju vēl pāris [niche] profesionāļus, kas labprāt uzņemtu vairāk klientu."`
2. Qualification: `"Vislabāk varam palīdzēt [niche]iem, kas:"` + 4 ✔️ criteria
3. Industry context: how clients typically come in that niche (word-of-mouth, referrals)
4. Identity challenge: `"Bet ko darīt, ja [pain point]?"`
5. Pain amplification paragraph
6. Solution intro: `"Tādā gadījumā Tev ir nepieciešams ātrs un paredzams veids, kā piesaistīt..."`
7. Credibility: `"pēdējo gadu laikā esam sadarbojušies ar desmitiem..."`
8. Soft CTA: `"atbildi uz pāris jautājumiem anketā zemāk"`
9. Signature: `"Stay sharp / Niks"`

**Why:** "Salona īpašniece" ad hit €5.21/lead at 6.77% CTR — account's best-ever leadgen performer. Template is replicable across niches.

### 2026-04-14 — Winning landscape ad copy structure (time-saving framing)
**Rule:** For landscape 16:9 workshop-style ads, use: Title `"Izveidot Savu [X] | Rezervē Biļeti"` + body opens with `"[N] stundās Tu uzbūvēsi..."` + 4-line `— [benefit]` block + specific date + `"Sākot no €X"` + `"100% naudas atgriešanas garantija."` Emphasize time-investment framing ("2 stundas → 10h+ nedēļā") over feature lists.
**Why:** Exact copy of account top-performer "landscape 16:9 - Copy" — €134 spend → 18 purchases at €7.44 CPA.

---

## Visual & Design

### 2026-04-14 — Mobile-scale defaults (everything bigger than you think)
**Rule:** Default sizes for LV Sharpify creatives:
- Headlines: 56-72px
- Body text: 32-36px
- Stat numbers: 54-64px
- Prices (slam moments): 100-260px
- CTA buttons: fontSize ≥48px, padding ≥28px vertical × ≥60-72px horizontal
Don't default to 40-48px headlines or 28-36px CTA buttons.
**Why:** User repeatedly asked for everything bigger ("lets make the pasūti button a lot bigger," "Let's make everything a bit bigger so people watching from phones can view it"). Default sizes look tiny in the phone feed.

### 2026-04-14 — No decorative emoji icons — use inline SVG instead
**Rule:** Emoji icons (📝💼📧⚡🎯💬📣💰✍️) look "brutally AI generated" in both video and landscape/editorial formats. Use clean inline SVG line icons instead — Lucide/Feather/Heroicons style: `stroke="#10b981"` or `#daa520`, `fill="none"`, `stroke-width="1.75"`, `stroke-linecap="round"`. Inside a bordered box with yellow accent for video ads.
**Why:** User repeatedly called emojis "ļoti brutāli AI ģenerētas" across both video ads and landscape L1-L7. Switching to clean SVG looked drastically more pro.
**Example:** Replaced 📝💼📧🎤 with SVG image/megaphone/mail/presentation icons via `<Icon name="..." />` component. NOTE: This rule applies to DECORATIVE icons only — copy emoji (✅ pain points, 🔹 features, 🎁 gift) still allowed per global emoji rule.

### 2026-04-14 — Don't use white flash overlays between Scene 3 items
**Rule:** Avoid white flash transition overlays on each item impact in list/card reveals. Scene looks like it goes from bright → normal repeatedly, which is distracting.
**Why:** User: "joprojām tiek izmantots gaišais effects, 3 scēnā visiem video... šis ir lieks effects."

### 2026-04-14 — Don't fade/dim older items when new ones appear
**Rule:** In sequential list reveals, don't dim opacity of previously-appeared items to 0.55-0.6. Keep all items at full brightness until the scene ends.
**Why:** User said the fade-to-dim effect felt unnecessary and cheap.

### 2026-04-14 — Always use real brand assets when available
**Rule:** Prefer real Sharpify assets (workshop audience photos, product mockups, actual 5-AI-levels infographic) over AI-generated equivalents. Real assets carry credibility.
**Why:** User provided `workshop-assets/` folder and explicitly asked to build ads around them. The 5-levels infographic from sharpify.lv is far more credible than a recreation.
**Files:** `ai-5-limeni.png`, `mockup.png`, `workshop-audience.jpg` in `workshop-assets/` (copied to `remotion-videos/public/photos/workshop/`).

### 2026-04-14 — Bear mascot background must be transparent, not white
**Rule:** Sharpify yellow bear PNG assets from `Downloads/Sharpify logo/` have white backgrounds that look awful on dark gradient compositions. Always run through `remotion-videos/scripts/remove-bg.js` first. Use the `cropped/` versions in ads.
**Why:** User noticed white boxes around bear and asked to crop them out.

### 2026-04-14 — Pro techniques checklist for "wow" ads
**Rule:** For Sharpify pro-level ads (not simple slideshow style), use: motion blur scaled with velocity (`filter: blur(Xpx)`), chromatic aberration on dramatic text (cyan/magenta RGB split), masked clip-path reveals (expanding circles, sweeping wipes), extreme 8x scale punch-ins on prices, screen shake on impact (`Math.sin(frame * 40) * decayingAmplitude`), particle ambient systems (30-50 drifting dots), 3D perspective transforms on cards, custom cubic-bezier easing (`EASE_DRAMATIC = Easing.bezier(0.83, 0, 0.17, 1)`).
**Why:** User kept asking for more "wow effect" and rejected "simple slideshow with a logo and button that becomes bigger and smaller." Reference implementation: `remotion-videos/src/ads/AIToolkitProShowcase.tsx`.

### 2026-04-14 — Brand color palette (strict)
**Rule:** Yellow `#E8D500`, Pure Black-ish `#0a0a0a` (not `#000`), White `#FFFFFF`, Red `#FF3344` (price slash), Green `#22C55E` (savings/done), Cyan `#00D4FF` and Magenta `#FF00C8` for chromatic aberration only. Never use trendy purple/pink gradients.
**Why:** Established through all Sharpify video ads. User praised ads that used this palette strictly.

### 2026-04-14 — Gold/silver embossed text on product mockups must be baked into Imagen 4 output
**Rule:** Don't use CSS `background-clip: text` with gradients to simulate metallic embossed text over photo backgrounds — it renders flat and reads as "melni burti ar zelta riņķi." Instead, prompt Imagen 4: `"matte black hardcover box with embossed gold foil 'SHARPIFY' text debossed into the cover"`. Let the AI render real metallic sheen with proper lighting.
**Why:** User rejected three CSS gold-text variants before the Imagen-baked version worked. CSS can't simulate realistic light reflection on metallic surfaces.

### 2026-04-14 — Landscape 16:9 (1280×720) outperforms 1:1 for ai-workshops campaigns
**Rule:** Always offer landscape 16:9 (1280×720) variants alongside 1:1 (1080×1080) for ai-workshops / workshop-type campaigns. Account top-performer was landscape 16:9 (€7.44 CPA) vs 1:1 formats (€9-14 range).
**Why:** Meta insights analysis showed landscape 16:9 had best ROI in account history (18 purchases on €134 spend).

### 2026-04-14 — Winning leadgen creative = authentic documentary photo, zero text overlay
**Rule:** For LV service-provider leadgen ads, the creative is a real documentary-style photo of the target persona in their work environment. **NO** text overlay, **NO** graphics, **NO** CTA button on the image. All copy lives in Meta's primary text field.
**Why:** Top-performer "Salona īpašniece" was literally just a photo of a salon owner in her salon — no design elements. Beat every designed-looking creative in the account.

### 2026-04-14 — Photo prompt formula for niche entrepreneur portraits
**Rule:** Use this Imagen 4 prompt template for leadgen persona photos:
```
Documentary-style candid photograph of a professional [occupation] in his/her 40s ...
wearing [work-appropriate outfit] ... Confident relaxed posture, slight smile, looking at camera.
Overcast natural daylight, slightly desaturated muted colors. Shot on 35mm lens, shallow depth of field.
Authentic Latvian [niche] entrepreneur portrait, unposed. No text, no logos, no AI-looking artifacts.
```
**Why:** Produces the authentic documentary look matching winning "Salona īpašniece" aesthetic. Tested on jumiķi, IT, būvnieki — all 3 came out realistic.

### 2026-04-14 — Video > Static for CTR
**Rule:** Videos consistently hit 3-5% CTR vs 1-2% for static in this account. When budget allows, prefer video format — especially for ai-workshops / workshop campaigns.
**Why:** Confirmed across multiple video ads (paperclip 3.38%, Video 3 5.58%, Video Veca vs Jauna 4.59%) vs static averages.

### 2026-04-14 — Sharpify landscape ad design language (gold italic + Playfair Display + dark gradient)
**Rule:** For landscape 16:9 editorial-style ads, use:
- **Background:** dark gradient `linear-gradient(145deg, #0a0a14, #0f1020, #0a0a12)` with subtle gold + green radial glows
- **Gold italic accents:** Playfair Display serif `font-style: italic` + gold gradient `#f5d76e → #daa520 → #b8860b`
- **Headlines:** Montserrat 900
- **Body:** Inter regular/medium
- **Wordmark:** "Sharpify" always bottom-right in Playfair italic gold

**Why:** Matches the proven top-performer visual language. Gold italic is the Sharpify editorial signature.

### 2026-04-14 — AI Rīku Komplekts ≠ MP Risinājums — different product, different template
**Rule:** When generating LV ads for reg.sharpify.lv/ai-workshops/, the product is **"AI Rīku Komplekts uzņēmējiem"** (€99→€19 Training, €199→€49 Pro). This is a direct-purchase digital product, NOT the MP Risinājums leadgen funnel. Don't reuse the "Meklēju vēl pāris [niche] profesionāļus..." MP Risinājums primary text template. Write direct-purchase copy: identity hook → pain points (✅) → what's inside (🔹) → price → "Stay Sharp & Make a Move, Niks".
**Why:** Different funnel (direct purchase, not lead form), different audience (wider B2C-ish entrepreneurs, not gated prospects), different price psychology (€19 impulse vs €4K+ consulting).

### 2026-04-14 — AI Workshop: editorial/poster formats > interface mockups
**Rule:** For AI Rīku Komplekts ads, user consistently approved **editorial/poster formats** (magazine cover with bold italic type, newspaper front page, movie poster, hand-drawn whiteboard, hazard/warning sign, Swiss minimalist poster, real workshop audience photo) and rejected **interface mockups** (video course player, AI tools grid, subscription comparison card, calendar time-saved visualization, ChatGPT-style cards, receipt itemization, transformation list, stat-bomb hero, math equation). Start with editorial formats by default.
**Why:** User rejected ad-1/2/3/4/5/7/8/9/10/12/17 (all interface/card-based), approved ad-6/11/13/14/15/16/18 (all editorial/bold typography). Clear pattern.

### 2026-04-14 — Use real Sharpify assets for AI Workshop ads
**Rule:** For AI Rīku Komplekts ads, pull real assets from `reg.sharpify.lv/ai-workshops/` — specifically `mockup.png`, `workshop-audience.jpg`, `ai-5-limeni.png`. Also extract real testimonials from the page (Inga Zaharova, Rita Majore, Kaspars Meilands, Irina Zebcuka etc.). Saved to `workshop-assets/` folder in project root.
**Why:** Extracted via urllib in this session. User: "you can take reviews from our website" + "you can also make an ad with the mockup that you can find on the website."

### 2026-04-14 — Source the AI workshop deck for ad content
**Rule:** The full 128-slide deck lives at `C:\Users\Ritvars Volfs\Downloads\Kā ar AI aģentiem un Claude Code izveidot savu digitālo dubultnieku - Pro plan.docx`. Extract text with `zipfile.ZipFile('word/document.xml')` + regex. Use real skill names, real tool lists, real prompts from the deck for "free value" or "what's inside" style ads — don't fabricate content.
**Why:** User provided the file and said "take snippets of whatever you need." Real content > invented content.

---

## Targeting & Meta Launch

### 2026-04-14 — Standard LV business targeting (proven stack)
**Rule:** For Sharpify LV business audiences, start with: age 25-65 (65 required by Advantage Audience), country LV (location_types `home`, `recent`), interests Business / Business development / Business leaders / Entrepreneurship / Small business / Artificial intelligence / B2B. Placements: FB + IG, all mobile + desktop positions.
**Why:** Pulled from a past proven Sharpify video campaign ("Jauna mājas lapa - Sales - Video ads"). Applied successfully to AI Workshop campaign.

### 2026-04-14 — Quiz leadgen funnels don't work — don't propose them
**Rule:** Don't propose "Quiz Leadgen" style funnels (ad → landing page with quiz → lead form). Straight lead-form ads consistently outperform quiz funnels in this account.
**Why:** Account history: 0 leads across €35+ spend on 4 different niches (roofing, IT, beauty, foundations) all running quiz funnels. Conversion path is too long.

### 2026-04-14 — Always run Meta insights analysis before building new campaigns
**Rule:** Before suggesting new ad concepts, targeting, or creatives for Sharpify LV, pull `GET /act_{ID}/ads?fields=name,status,insights.date_preset(maximum){impressions,clicks,ctr,spend,actions,cost_per_action_type}` to see what's already working. Reference past winners instead of rebuilding from scratch.
**Why:** This analysis revealed "Salona īpašniece" winner formula, landscape 16:9 format win, and the proven targeting stack. Saves weeks of testing.

---

## Production Pipeline

### 2026-04-14 — Remotion ad structure template
**Rule:** Every Sharpify video ad follows 4 scenes (~13-15s total): Scene 1 HOOK (3s pattern interrupt), Scene 2 PROBLEM/DEMO (4-5s), Scene 3 PROOF/DETAILS (3-4s), Scene 4 PRICE+CTA (3s). Use `<Sequence layout="none">` for hard cuts between scenes so `useCurrentFrame()` resets per scene.
**Why:** This structure emerged as the winner across 15+ ads. Anything longer loses mobile viewers.

### 2026-04-14 — Remotion compositions registered via Root.tsx
**Rule:** All video compositions live in `remotion-videos/src/ads/*.tsx` and must be registered in `src/Root.tsx` with a `<Composition>` element specifying `id`, `durationInFrames`, `fps: 30`, `width: 1080`, `height: 1080` (or 1920 for Reels).
**Why:** Established pattern. Don't need to re-explain every session.

### 2026-04-14 — Render command pattern
**Rule:** `cd remotion-videos && npx remotion render <composition-id> out/<filename>.mp4 --codec=h264 --crf=18`. Don't run parallel renders of different compositions — the bundler conflicts. Render sequentially.
**Why:** First parallel render attempt of V2 and V3 failed while V1 was still bundling.

### 2026-04-14 — Output location is ALWAYS `meta-ad-generator/output/`, never `claude-ad/output/`
**Rule:** All ad outputs (html, png, images, reference) MUST go into `meta-ad-generator/output/{slug}/{html|png|images}/`. Never create files in `claude-ad/output/` even though puppeteer lives in `claude-ad/node_modules/`. If you find files accidentally landed in `claude-ad/output/`, move them to `meta-ad-generator/output/` and delete the `claude-ad/output/` dir.
**Why:** User got frustrated after files ended up duplicated across both: "viss ir haoss." Settled on `meta-ad-generator/output/` as single source of truth.

### 2026-04-14 — Running export-png.js when puppeteer lives in `claude-ad/node_modules/`
**Rule:** Puppeteer is installed in `claude-ad/node_modules/`, not in the skill's declared generator root. When export-png.js throws `Cannot find module 'puppeteer'`:
```bash
cd claude-ad && NODE_PATH=./node_modules node ../meta-ad-generator/scripts/export-png.js \
  ../meta-ad-generator/output/{slug}/html/ \
  ../meta-ad-generator/output/{slug}/png/
```
Output paths always point into `meta-ad-generator/output/`. Never output into `claude-ad/output/`.
**Why:** Hit the module-not-found error when running standalone. Running from `claude-ad` with `NODE_PATH` resolves it without modifying project structure.

### 2026-04-14 — generate-image.js resolves output paths relative to CWD
**Rule:** `generate-image.js` saves the image relative to its running directory. Running from `meta-ad-generator/` with an output path like `claude-ad/output/foo.png` creates a nested `meta-ad-generator/claude-ad/output/foo.png`. Either pass absolute paths or pass paths relative to `meta-ad-generator/output/` (e.g. `output/{slug}/images/foo.png`).
**Why:** Hit this mistake and had to `mv` files after the fact.

---

## Niches

<!-- Niche-specific patterns (construction, beauty, IT, security, etc.) -->

### 2026-04-14 — Beauty (Skaistumkopšana) is scaling territory, not test territory
**Rule:** Beauty niche has accumulated €7k+ spend and 768+ leads at €8.50 avg CPL on Sharpify LV. Any new beauty ad should scale existing winners (Salona īpašniece, Manikīra salona īpašniece, Skaistumkopšana 6/8/11), not test new angles. For new beauty creatives, duplicate proven structure and only vary photo + micro-headline.
**Why:** Enough data to know what works. Don't reinvent; replicate.

### 2026-04-14 — Other niches (roofing, IT, construction, security) = under-tested, not underperforming
**Rule:** Don't write off roofing / IT / construction / security niches based on current €0-60 spend data. "Roofing Wide Shot - v1" shows 3.04% CTR (promising signal) and IT had 7.28% CTR on Quiz ads (very strong intent). These need more budget to reach statistical significance, not different creatives.
**Why:** Current sample sizes are too small. Scale spend on the current winners before declaring them failures.

### 2026-04-14 — Niche-group adsets for long-tail trades
**Rule:** For niches individually too narrow (logu montāža, bruģēšana, fasāde, siltumsūkņi), group 4-6 related sub-niches under one thematic adset like "Mājokļa uzlabojumi" or "Inženierkomunikācijas." One adset, 2 ads per sub-niche, each ad with niche-specific headline + notif, sharing overall targeting.
**Why:** Gets specificity benefit (relevance, lower CPL) without Meta audience-size floor issues. User validated this strategy.

---

## Current Messaging (MP Risinājums LV)

### 2026-04-14 — AI marketing system + website gift is the current angle
**Rule:** Current Sharpify LV positioning (per shef): "Trūkst klientu? Mēs iegūsim Tev klientus ar AI mārketinga sistēmu | Dāvana jauniem klientiem: Moderna mājaslapa." Every MP Risinājums creative leads with AI-system framing and includes "🎁 Mājaslapa bonusā / dāvanā" element until told otherwise.
**Why:** Shef's exact brief. Website gift is the current differentiator.

### 2026-04-14 — "Tu [verb]. Mēs [we-verb] Tavu klientu plūsmu." formula — SUPERSEDED
**Rule:** ~~For designed multi-niche creatives, use the parallel-verb headline: `"Tu remontē auto. Mēs remontēsim Tavu klientu plūsmu."` / `"Tu būvē virtuves. Mēs uzbūvēsim..."` / `"Tu veido dārzus. Mēs iekoposim..."`.~~ SUPERSEDED by the "Tu parūpējies par X" formulation below — user later rejected forced verb pairs (izbruģēsim/iekoposim/uzbūvēsim klientu plūsmu) as contrived.
**Why:** Still kept for history: the formula got early approval before user noticed the LV verb contortions read as "stulbi."

### 2026-04-14 — "Tu parūpējies par X. Mēs parūpēsimies, lai nākamais Y jau gaida" is the current headline formula
**Rule:** Do NOT use forced verb-pair formula like "Tu bruģē piebraucamos. Mēs izbruģēsim Tavu klientu plūsmu" / "Tu veido virtuves. Mēs uzbūvēsim plūsmu" — reads as contrived in LV. Instead, use consistent care/parallel theme: "Tu parūpējies par [work X]. Mēs parūpēsimies, lai nākamais [outcome Y] jau gaida." Each niche gets a unique X→Y pair (pagalmu→darbs, fasādi→māja, jumtu→objekts, logiem→klients, terasi→pasūtījums, virtuvi→nākamā, klienti→nākamā). Sticker variant: "Tu parūpējies par klienta X, mēs parūpēsimies, lai nākamais Y jau rindā/kalendārā/gaida."
**Why:** User: "Tu bruģē piebraucamos, What the hell does that even mean man... sāc domāt loģiski." Then: "turamies pie kautkādas tēmas, 'Tu parūpējies par klientiem, mēs parūpēsimies lai nākamais darbs tevi gaida'." Validated across all 12 niks-majokla-uzlabojumi ads + niks-skaistumkopsana.

### 2026-04-14 — Correct LV auto-service abbreviations in notification cards
**Rule:** In "Jauns pieraksts" notifications for auto-serviss ads, use **"TA"** (Tehniskā apskate), not "TO". Prefer **"bremžu maiņa"** over "bremžu nomaiņa" — shorter, more colloquial.
**Why:** User: "kur notifikācija lets put TA + bremžu maiņa Audi A6" — corrected original TO + nomaiņa wording.

### 2026-04-14 — "Bezmaksas" allowed for the mājaslapa gift
**Rule:** The mājaslapa bonus can be labeled "🎁 BEZMAKSAS mājaslapa dāvanā" — it's a real free add-on when purchasing MP Risinājums. Does NOT contradict the "Playbook is not free" rule (that applies to B2B Playbook ENG only — different product).
**Why:** User's own edits added BEZMAKSAS framing for the website gift.

---

## Designed-Creative Templates

### 2026-04-14 — Arched SaaS format is the approved designed-creative winner
**Rule:** When user wants variety beyond documentary-photo winners, use the "arched SaaS" template: `Instrument Serif` italic headline + `Space Grotesk` supporting text, arched photo window (border-radius 310/310/20/20) with dashed outer ring, dark gradient bg with accent radial glow, chip row + rounded pill CTA with 34×34 arrow circle.
**Why:** User: "ad-3 ir riktīgi labs" — base for every subsequent niche in this session.

### 2026-04-14 — Sticker card + rotated "Jauns pieteikums" notification
**Rule:** Second approved format: full-bleed photo bg, rotated (-1.4°) dark card at bottom with 6px accent top border, plus rotated (+2.4°) white iPhone-style notification top-right showing niche-specific fake pieteikums ("TO + bremžu maiņa · Audi A6 · Rīga", "Gēla manikīrs · Elīna K.", etc.).
**Why:** Notif card turns abstract "AI system" into tangible proof. User approved across niches.

### 2026-04-14 — Accent color by niche category
**Rule:**
- Construction / home improvement / general trades → amber `#F59E0B`
- Auto service → red `#DC2626`
- Beauty / wellness → warm gold `#C9A878` on dark brown `#1a1410` / `#14100d` bg
**Why:** Established across niks-buvnieki, niks-auto-serviss, niks-skaistumkopsana, niks-majokla-uzlabojumi.

### 2026-04-14 — Avoid repetitive "photo + centered text overlay" layouts
**Rule:** Don't default to one layout (full-bleed photo + centered stacked headline/sub/CTA). User explicitly rejected that as already-tried-and-failed. Always offer 2-3 structurally different layouts per niche set (arched, sticker, poster-split, gradient-dissolve, diagonal, magazine-editorial).
**Why:** User: "pagaidām visi ir vienādi, bilde aizmugurē, un teksts pa vidu priekšā" — rejected sameness.

### 2026-04-14 — Soft/organic frames only — never hard split lines
**Rule:** When splitting a creative into photo + text zones, avoid rectangular hard-edge splits. Use: diagonal clip-path, arched window, rotated sticker card, gradient dissolve, polaroid with rotation+shadow, puzzle/interlocking clip-paths.
**Why:** User: "negribu lai ir 'cietais' rāmis" — hard rectangular splits read as PowerPoint.

### 2026-04-14 — Hide top brand bar with `display:none`, don't delete the DOM node
**Rule:** When removing the arched template's top brand strip (MP Risinājums™ + niche·LV), change it to `<div class="top" style="display:none"></div>` — do NOT delete the `<div class="top">...</div>` node entirely. Deleting the node caused rendered output where "half the ad disappeared" (likely a Puppeteer/cache quirk).
**Why:** First attempt deleted the full div; user: "what the hell happened, half the ad disappeared, revert the changes." Keeping the empty div with display:none is safe across arched templates.

### 2026-04-14 — When top bar is hidden, lift arched image up (~80px)
**Rule:** After hiding the top brand bar on arched templates, consider lifting `.arch` from `top:130px` → `top:50px` and `.ring` from `top:120px` → `top:40px` if the image now sits too low and overlaps the headline area.
**Why:** User on brugesana-1: "attēlu paceļam uz augšu, tas pagaidām ir virsū tekstam."

### 2026-04-14 — User's post-export size tweaks (apply as new defaults)
**Rule:** User consistently edits exported HTML to: CTA arrow circle `width:34px;height:34px` with `font-size:20px;font-weight:900` (up from 26×26/14px); sticker headline drops to 46px for two long lines / 36px for three lines; top brand bar often hidden via `<div class="top" style="display:none"></div>`. Apply these as defaults in future arched + sticker templates.
**Why:** Same pattern across auto-serviss, skaistumkopsana, buvnieki post-generation edits.

---

## Production Pipeline (additions)

### 2026-04-14 — Template + Node generator script for multi-niche adsets
**Rule:** For adsets with 6+ ads sharing design but differing in content, write a `gen.js` in the niche output folder with a niches[] array (slug, tag, badge, headline fragments, notif body) and template functions. Run `node gen.js` to emit all HTML files at once.
**Why:** Used for 12-ad "Mājokļa uzlabojumi" adset. Fast, keeps headlines unique, no copy drift.

