# Sharpify Workspace — Shared Rules (LV + ENG)

These rules apply to both LV and ENG Sharpify ad accounts. For account-specific rules see `sharpify/lv/CLAUDE.md` or `sharpify/eng/CLAUDE.md`.

---

## Brand Palette (strict)

- **Yellow:** `#E8D500`
- **Pure Black-ish:** `#0a0a0a` (NOT `#000`)
- **White:** `#FFFFFF`
- **Red:** `#FF3344` (price slash only)
- **Green:** `#22C55E` (savings / done states)
- **Cyan + Magenta:** `#00D4FF` / `#FF00C8` — chromatic aberration effects only

Never use trendy purple/pink gradients. Never use tech-SaaS dark-green defaults for non-SaaS campaigns.

---

## Meta API Identifiers

Used in `object_story_spec` when creating video/image ads via Graph API:
- **Page ID:** `116359515734204`
- **Instagram User ID:** `17841401853795292`

LV account: `act_549172712351324` (see `sharpify/lv/CLAUDE.md` for details)
ENG account: `act_1184056475376090` (see `sharpify/eng/CLAUDE.md` for details)

---

## Video Ad Workflow (Remotion Superpowers plugin)

When the user asks for video ads on either account, delegate to the `remotion-superpowers` plugin. Don't hand-code Remotion.

**4-scene structure (13-15s total):**
- Scene 1 — HOOK (3s): pattern interrupt. Niche-specific question or bold claim.
- Scene 2 — PROBLEM/DEMO (4-5s): show the pain. UGC/phone footage, split-screen, screen recording.
- Scene 3 — PROOF/DETAILS (3-4s): real numbers (2,300+ clients, €50M+), dashboards, notification stacks.
- Scene 4 — PRICE + CTA (3s): product + CTA + landing URL.

**Delegation approaches:**
- Full-auto: invoke `video-director` agent with the 4-scene script
- Manual control: `/find-footage` → `/create-video` → `/add-voiceover` → `/add-music` → `/add-captions` → `/add-transitions` → `/review-video`

**Video > static for CTR.** Videos hit 3-5% CTR vs 1-2% for static on the LV account. Prefer video when budget allows.

---

## Veo / Stock Footage — No Generic Cinematic B-roll

Don't prompt Veo (or any video generator) for polished commercial footage — founder typing, generic website on screen, handshake, walking through cafe. It looks nice, gives the viewer no reason to stop scrolling. Pattern interrupt beats polish. Prefer UGC/phone feel, visual metaphors, text-on-screen moments, absurd or funny framings, strong before/after with concrete dollar/client payoff.

Save cinematic polish for YouTube pre-roll or website hero reels — not feed ads.

---

## Video Ad Design Rules (both accounts)

### No decorative emoji icons
Emoji icons (📝💼📧⚡🎯💬📣💰) look "brutally AI generated" in video and landscape formats. Use clean inline SVG line icons (Lucide/Feather style: `stroke="#10b981"` or `#daa520`, `fill="none"`, `stroke-width="1.75"`). Copy emoji (✅ pain points, 🔹 features, 🎁 gift) still allowed in primary text per the global emoji rule.

### No cheap white flash transitions
Avoid white flash overlays between scene items. Use clean cuts or purposeful transitions instead.

### Mobile-scale defaults
Headlines 56-72px, body 32-36px, stat numbers 54-64px, prices 100-260px (slam moments), CTA buttons ≥48px with ≥28px vertical padding and ≥60-72px horizontal padding. Default sizes look tiny in the phone feed.

### Always use real brand assets when available
Prefer real Sharpify assets (workshop audience photos, product mockups, 5-AI-levels infographic) over AI-generated equivalents. Real assets carry credibility.

### Gold/silver embossed text on product mockups — bake into Imagen output
Don't use CSS `background-clip: text` with gradients to simulate metallic text — renders flat. Prompt Imagen 4 for real metallic sheen: `"matte black hardcover box with embossed gold foil 'SHARPIFY' text debossed into the cover"`.

---

## Output Destinations

- LV ads: `sharpify/lv/output/{niche}/`
- ENG ads: `sharpify/eng/output/{niche-or-product}/`
- Video renders: same workspace + `videos/{filename}.mp4`

Never write Sharpify ads to `clients/` or `output/` folders.

---

## Cross-Language Cloning

The LV and ENG skills CAN read each other's workspaces. When the user asks to clone an ad set across languages (e.g., "translate these LV ads to English for the ENG account"), the active skill reads the source workspace, adapts copy for the target market + product, and writes output to the target workspace.

---

See also:
- `meta-ad-generator/CLAUDE.md` — global rules (universal)
- `sharpify/notes.md` — Sharpify-wide learnings
- `sharpify/formats/*.md` — proven Sharpify ad formats (arched-saas, sticker-card, notification-card, documentary-photo-leadgen, landscape-16-9-workshop)
- `sharpify/lv/CLAUDE.md`, `sharpify/eng/CLAUDE.md` — account-specific rules
