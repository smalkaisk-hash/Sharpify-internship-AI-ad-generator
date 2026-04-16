# Sharpify ENG Account — Rules

Rules specific to the ENGLISH Sharpify ad account. For shared rules see `sharpify/CLAUDE.md`.

---

## Routing

Trigger `reklamas-meta-sharpify-eng` skill when user says:
- "make ads for English account"
- "English ads for [niche]"
- "ENG ads for coaches/consultants/trades"
- "B2B Playbook ads"
- "Website Offer ads"

Do NOT use this workflow if the user names a third-party business — route to `clients/` workspace (full-pipeline) instead.

---

## Account + Products

**Account:** `act_1184056475376090`

**Two distinct products run on this account — don't mix copy between them:**

### Product 1: B2B Playbook (default)
- **Landing:** `https://eu.sharpify.lv/ms/`
- **Target:** consultants, coaches, agencies
- **Framing:** long-form empathetic "MS Solution" framing, €50M+ generated claim
- **Audience:** established business operators scaling client acquisition

### Product 2: Website Offer
- **Landing:** `https://web.sharpify.lv/`
- **Pricing:** €299 → €59 (savings €240) — built in 1-3 days
- **Target:** solo founders, trades, local service businesses
- **Framing:** direct purchase, scrappier tone, impulse buy psychology
- **Audience:** newer/smaller operators needing a functional website fast

Copy and template approaches differ substantially between the two. Don't reuse B2B Playbook copy templates for Website Offer ads — different audience, different buying behavior.

---

## Pricing Rules

**Sharpify website service pricing** (web.sharpify.lv):
- Original: **€299** (NOT €300, NOT €2,000)
- Discounted: **€59**
- Savings: **€240** (NOT €241)

The **€2,000 / €2,500** figure is the AGENCY comparison price only — use when explicitly comparing to what agencies charge, never as Sharpify's own crossed-out price.

---

## Copy Rules

### Playbook is NOT free

The B2B Client Acquisition Playbook at `eu.sharpify.lv/ms/` is NOT free. Never use "free", "free playbook", "free training" in ad copy, headlines, or on-image text.

**Why:** Landing page may say "free" but the actual product is paid. Calling it free creates wrong expectations and is misleading.

**How to apply:** Use value-focused CTAs: "Get the Playbook", "Download the Playbook", "Get Instant Access".

### Website bonus IS free — and that's OK to say

On ENG MS-funnel ads pointing to `eu.sharpify.lv/ms/`, the chip and gift element promotes:

**"🎁 Free website included"**

Same bonus mechanic as LV MP Risinājums. This does NOT contradict the "Playbook not free" rule — the Playbook lead magnet is paid; the website bonus IS a real free add-on when someone buys MS.

### Primary text formula (ENG B2B Playbook)

Opens with identity question ("Are you a business owner who..."), followed by 4 ✅ pain points, transition ("Here's what we do differently"), 4-5 🔹 features, social proof line, 👉 CTA, signed "Niks Jansons, CEO @ Sharpify". Empathetic and long-form, not descriptive.

### Headlines = short identity hooks, not ad descriptions

Write headlines that make the reader think "that's me" — e.g. "Still searching for the right website?" — NOT descriptions of the ad creative ("Still searching? Your competitors already found this."). Keep under ~40 chars so they don't overflow in Meta's preview.

### Never claim unverified stars or ratings

Don't include "★★★★★", "5-star", or "1,000+ five-star reviews" in ad creatives unless verified from Trustpilot/Google. "2,300+ businesses served" is fine (verifiable via press). If user mentions star ratings, verify the source before including.

---

## ENG-Specific Design Rules

### Interface mockups fatigue fast (confirmed on ENG account)

"Pretend it's a Google search / iMessage / ChatGPT / Spotify / Tinder" format stops the scroll on the first exposure but fatigues fast across a scaled campaign. Don't default to this format — mix with editorial, portrait, and product-forward creatives.

**User diagnosis:** no proof of product, no face, format played out, price buried, wrong format for visual product, targeting off.

### Cross-out comparisons: cross out only the price

When showing competitor prices being "beaten" by Sharpify, draw the strike-through line ONLY across the price number. Don't strike through the entire row/item.

### No brand footer strip at the bottom

Don't add a persistent "Sharpify · web.sharpify.lv" footer bar at the bottom of ad creatives. Keep brand presence to inline price treatments or CTA buttons.

### CTA buttons: bigger, text must fit, drop the arrow when crowded

CTA button text must fit cleanly inside the button (no ellipsis, no line breaks). If "Get Yours →" crowds the box, drop the arrow and keep "Get Yours". Scale button padding generously for mobile.

### Scale text bigger for mobile viewers

Headlines 60-74px, body 28-36px, stats 42-64px, price slam 54-88px. Default mockups render too small on phone feed.

---

## Targeting

**ENG Website Offer reference** (from past campaign):
- Campaign: "ENG Website Offer — Purchases" (ID `120242514306140328`)
- Adset: "Cold — Experts, Consultants, Coaches (30-45, EN)" (ID `120242514313810328`)
- Target countries: US, IE, NL, NO, CA, SE, GB, DK, AU, DE
- Objective: OUTCOME_SALES

---

See also:
- `meta-ad-generator/CLAUDE.md` — global rules
- `sharpify/CLAUDE.md` — shared Sharpify rules
- `sharpify/eng/notes.md` — ENG-specific learnings log
- `sharpify/formats/` — proven ad formats (some are LV-specific, check applicability for ENG)
