# Arched SaaS Template

**Status:** Approved winner (user marked "ad-3 ir riktīgi labs" — first design that unlocked follow-up variations across niches).

**When to use:** Primary go-to for designed MP Risinājums leadgen ads when documentary photo isn't the right fit. Also works for ENG Website Offer.

## Visual spec

- **Background:** dark gradient + accent radial glow
- **Typography:**
  - Headline: Instrument Serif italic
  - Body/supporting: Space Grotesk
- **Photo window:** arched shape with border-radius `310px 310px 20px 20px`
- **Frame detail:** dashed outer ring around the arched window
- **Chip row:** small category tags above or below photo
- **CTA:** rounded pill button with 34×34 arrow circle (font-size 20px, font-weight 900)

## Typography sizing

- Headline: 46px with "parūpējies" formula (fits ~48 chars on line 1 at 960px width in Instrument Serif)
- Sticker headline drops to 36px for three lines

## Post-export tweaks

User often edits after export:
- CTA arrow circle upgrade: from 26×26/14px to 34×34/20px (font-weight 900)
- Top brand bar often hidden via `<div class="top" style="display:none"></div>` — don't delete the div, hide it
- When top bar hidden, lift `.arch` from `top:130px` → `top:50px` and `.ring` from `top:120px` → `top:40px`

Apply these as defaults in future arched generations.

## Languages

Works in both LV and ENG. Copy formula differs:
- LV: "parūpējies" care-theme (see `sharpify/lv/CLAUDE.md`)
- ENG: identity hook pattern (see `sharpify/eng/CLAUDE.md`)
