---
name: Always fetch live landing page before writing copy
description: Sharpify landing pages change over time (live workshop → digital product, etc.). Always WebFetch the current page and verify language + offer match BEFORE writing ads.
type: feedback
originSessionId: 5095a699-8fca-4ecf-b9e6-6a0d7e74c0bd
---
Before writing any ad copy, **fetch the current live landing page** and verify:
1. **Language match:** ENG ads → ENG landing page. LV ads → LV landing page. Stop and flag if mismatched.
2. **Current offer:** The page content may have changed since last session (e.g., `reg.sharpify.lv/ai-workshops/` was a live workshop, then later an "AI Rīku Komplekts" digital product).
3. **Current pricing:** Prices on the live page override any prices from previous sessions.

**Why:** User nearly shipped English ads to a Latvian landing page. Also hit mismatched copy when page content flipped from workshop to digital kit but ad copy still promoted the old offer. Both kill conversions.

**How to apply:** First step in any ad creation session is `WebFetch` on the target URL. Extract the actual language, offer, price, and CTA — don't trust memory or skill templates.
