---
name: Ad generation routing system
description: Three ad paths — client ads (full-pipeline), Sharpify LV (reklamas-meta-sharpify), Sharpify ENG (reklamas-meta-sharpify-eng). Auto-route based on user request.
type: project
originSessionId: 5095a699-8fca-4ecf-b9e6-6a0d7e74c0bd
---
Three ad generation paths that auto-route based on what the user asks:

1. **Client ads** → `full-pipeline` skill
   - Triggers: "make ads for [client]", "generate ads for [link]", any third-party business name/URL
   - Auto-detects tangible vs intangible, selects templates dynamically
   - Outputs: HTML + PNG ad creatives (6-8 per client)

2. **Sharpify Latvian ads** → `reklamas-meta-sharpify` skill
   - Triggers: "LV account", "Latvian ads for [niche]", "reklāmas priekš [niša]"
   - Product: MP Risinājums™, landing: jauniklienti.netlify.app (quiz funnel)
   - Account: act_549172712351324, lead gen form: 944838491325482
   - Outputs: Imagen photos + HTML overlay + PNG + Meta API launch

3. **Sharpify English ads** → `reklamas-meta-sharpify-eng` skill
   - Triggers: "English account", "ENG ads for [niche]", "B2B Playbook ads"
   - Account: `act_1184056475376090` (both ENG products run on this account)
   - Two distinct products on this account:
     - **B2B Playbook** — landing `eu.sharpify.lv/ms/`. Lead-gen for consultants/coaches. Long-form MS Solution framing, €50M+ generated claim. Default for ENG Sharpify ads.
     - **Website Offer** — landing `web.sharpify.lv`. Direct purchase for service providers needing a website, €299→€59 (built in 1-3 days). Audience: solo founders, trades, local services. Don't reuse B2B Playbook templates for this.
   - Outputs: Text-only copy + Meta API launch (no image creatives)

**Why:** User needs to open a chat, say what they want, and the right workflow kicks in automatically. No manual skill selection.

**How to apply:** When user mentions ads, identify which path based on: (a) is it for Sharpify or a client? (b) if Sharpify, which language/account?
