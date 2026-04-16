# Sharpify — Cross-Language Learnings (LV + ENG)

This file accumulates rules and patterns that apply to BOTH Sharpify accounts (LV and ENG). Language-specific learnings live in `sharpify/lv/notes.md` and `sharpify/eng/notes.md`.

## Format

Each entry follows:

```
### YYYY-MM-DD — [topic]
**Rule:** What to do (or not do)
**Why:** The reason — often a past incident or strong preference
**Example:** (optional) Specific case that triggered this
```

---

## Brand & Visual

<!-- Rules that apply equally across LV and ENG Sharpify campaigns -->

### 2026-04-14 — Sharpify brand palette (strict)
**Rule:** Yellow `#E8D500`, Pure Black-ish `#0a0a0a` (not `#000`), White `#FFFFFF`, Red `#FF3344` (price slash only), Green `#22C55E` (savings/done), Cyan `#00D4FF` and Magenta `#FF00C8` for chromatic aberration only. Never trendy purple/pink gradients.
**Why:** Established through all Sharpify video + static ads. User praised ads that use this palette strictly; rejected departures.

### 2026-04-14 — Gold italic signature for editorial/landscape ads
**Rule:** For editorial-style landscape ads on either account: dark gradient bg `linear-gradient(145deg, #0a0a14, #0f1020, #0a0a12)` + gold italic accents (Playfair Display serif, gold gradient `#f5d76e → #daa520 → #b8860b`) + Montserrat 900 headlines + Inter body + "Sharpify" bottom-right in Playfair italic gold.
**Why:** Matches proven top-performer visual language across both accounts.

### 2026-04-14 — Mobile-scale defaults (universal)
**Rule:** Headlines 56-72px (ENG: 60-74px), body 32-36px, stats 54-64px (ENG: 42-64px), prices 100-260px for slam moments, CTA buttons ≥48px with generous padding. Default sizes look tiny in phone feed.
**Why:** Repeated user feedback on both LV and ENG — "make it bigger, people view on phones."

---

## Video Production (Remotion)

### 2026-04-14 — 4-scene structure (~13-15s)
**Rule:** Scene 1 HOOK (3s pattern interrupt), Scene 2 PROBLEM/DEMO (4-5s), Scene 3 PROOF/DETAILS (3-4s), Scene 4 PRICE+CTA (3s). Use `<Sequence layout="none">` for hard cuts so `useCurrentFrame()` resets per scene.
**Why:** Structure emerged as winner across 15+ ads. Anything longer loses mobile viewers.

### 2026-04-14 — No decorative emoji icons — use inline SVG
**Rule:** Emoji icons (📝💼📧⚡🎯💬📣💰✍️) look "brutally AI generated" in video and landscape formats. Use clean inline SVG line icons (Lucide/Feather style: `stroke="#10b981"` or `#daa520`, `fill="none"`, `stroke-width="1.75"`). Copy emoji (✅ pain points, 🔹 features, 🎁 gift) still allowed in primary text.
**Why:** User consistently called emojis "ļoti brutāli AI ģenerētas" across both languages.

### 2026-04-14 — No white flash transitions
**Rule:** Avoid white flash overlays between scene items in list/card reveals. Looks like scene oscillates bright → normal. Distracting.
**Why:** User: "joprojām tiek izmantots gaišais effects... šis ir lieks effects."

### 2026-04-14 — Don't fade old items when new ones appear
**Rule:** In sequential list reveals, keep earlier items at full brightness — don't dim to 0.55-0.6 opacity when new items appear. Full brightness until scene ends.
**Why:** User said fade-to-dim felt unnecessary and cheap.

### 2026-04-14 — Always prefer real Sharpify assets
**Rule:** Use real Sharpify assets (workshop photos, product mockups, 5-AI-levels infographic) over AI-generated equivalents. Real assets carry credibility.
**Files:** `workshop-assets/ai-5-limeni.png`, `mockup.png`, `workshop-audience.jpg`.

### 2026-04-14 — Bear mascot must have transparent background
**Rule:** Sharpify yellow bear PNG assets from `Downloads/Sharpify logo/` have white backgrounds. Run through `remotion-videos/scripts/remove-bg.js` first. Use cropped/ versions in ads.

### 2026-04-14 — Pro techniques for "wow" ads
**Rule:** For pro-level (not simple-slideshow) Sharpify ads: motion blur scaled with velocity, chromatic aberration on dramatic text (cyan/magenta RGB split), masked clip-path reveals, extreme 8x punch-ins on prices, screen shake on impact, particle systems, 3D perspective transforms, custom cubic-bezier easing (`Easing.bezier(0.83, 0, 0.17, 1)`). Reference: `remotion-videos/src/ads/AIToolkitProShowcase.tsx`.
**Why:** User rejected "simple slideshow with a logo and button that becomes bigger and smaller" — wanted more wow.

---

## Targeting & Meta Launch

### 2026-04-14 — Always run Meta insights analysis before building new campaigns
**Rule:** Before new creative concepts or targeting, pull historical performance: `GET /act_{ID}/ads?fields=name,status,insights.date_preset(maximum){impressions,clicks,ctr,spend,actions,cost_per_action_type}`. Reference past winners instead of rebuilding from scratch.
**Why:** This analysis revealed "Salona īpašniece" winner, landscape 16:9 win, proven targeting stack. Saves weeks of testing.

---

## Production / Workflow

### 2026-04-14 — Remotion compositions registered via Root.tsx
**Rule:** All video compositions in `remotion-videos/src/ads/*.tsx` must be registered in `src/Root.tsx` with `<Composition>` specifying id, durationInFrames, fps: 30, width: 1080, height: 1080 (or 1920 for Reels).

### 2026-04-14 — Render command pattern
**Rule:** `cd remotion-videos && npx remotion render <composition-id> out/<filename>.mp4 --codec=h264 --crf=18`. Don't run parallel renders — bundler conflicts. Render sequentially.

### 2026-04-14 — Reviews must be real, never fabricated
**Rule:** Never invent customer testimonials. Only use real reviews from sharpify.lv / Trustpilot / Google. If no real review for a specific product, flag to user — either use general Sharpify reviews with source badge, or drop testimonials from that ad.
**Why:** User: "atsauksmes nezinu vai ir īstas, vai nu ieliekam īstas vai ņemam ārā atsauksmes."
**Verified real reviews:** Kaspars Cveiģelis (Google), Artūrs Mogijevcevs (Trustpilot), Jeļena Beitane (Google), Oskars Kaneps-Kabinēji (Trustpilot). Always stamp source badge on the ad.

### 2026-04-14 — Don't mock competitors
**Rule:** Don't position Sharpify by mocking other agencies ("bet aģentūras prasa tūkstošus?"). Reframe toward customer's goal.
**Why:** User: "we're not mocking other agencies" — comes across as combative.

### 2026-04-14 — Don't brag about Sharpify's metrics as the core angle
**Rule:** Stats (2,300+ uzņēmumu, €50M+, Forbes 30U30) are fine as supporting social proof. An entire ad built around bragging reads self-congratulatory.
**Why:** User rejected "Trust Blitz" — "kindof like we're bragging about our business." Authority works wrapped in customer-focused narrative, not "look how great we are."
