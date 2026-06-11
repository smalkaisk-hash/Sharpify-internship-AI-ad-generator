# Changer Club — Design System

> **Be wealthy, not just rich.**
> A private membership club for ultra-high-net-worth families in Monaco, Dubai, Switzerland and Italy. Changer is the room where multi-generational wealth is built — heir, parent, and spouse seated at the same table, taught by first-generation billionaires, Nobel laureates, and operators.

This folder is a working design system for everything Changer Club ships: the marketing website, the VSL launch film, social tiles, decks, and the application funnel. Everything here is brand-correct: dark, restrained, gold-accented, serif-led — never glossy, never theatrical.

---

## 0 · Index

| File / folder            | Purpose                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `README.md`              | This file. Brand context + content + visual + iconography rules.    |
| `colors_and_type.css`    | All design tokens (CSS vars) + semantic typography classes.         |
| `SKILL.md`               | Agent skill manifest — load when generating Changer artifacts.       |
| `assets/`                | Logos, brand photography (social tiles), VSL brief PDF + script.    |
| `preview/`               | Small HTML cards rendered in the Design System tab.                 |
| `ui_kits/website/`       | Marketing site UI kit — components + interactive index.html.        |
| `slides/`                | Sample slides in the Changer visual register (Dynasty deck style).  |
| `fonts/`                 | (empty — using Google Font fallbacks; see Substitutions below.)     |

---

## 1 · Company context

| Item            | Value                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Name**        | Changer Club (sometimes "Changer Dynasty Club")                                            |
| **Tagline**     | *Be wealthy, not just rich.*                                                                |
| **Mission**     | Stop the 70% inter-generational wealth loss by educating heir and parent in the same room. |
| **Founders**    | Jonas Rolo & Camelia Rolo (Co-Founders)                                                     |
| **Chapters**    | Monaco · Dubai (operative) · Switzerland · Italy (audience)                                 |
| **Audience**    | UHNW 50+, $20M+ liquid, $5M minimum to qualify; spouses + heirs always invited              |
| **Capacity**    | 50 families admitted per year; 270 power-family members; ~€25B in joint capital            |
| **Programme**   | (1) Seated with first-gen builders/Nobel laureates (e.g. Marc Randolph, Netflix co-founder). (2) Heirs in the same room — not a junior track. (3) Co-investment: families and heirs deploy capital together in real transactions. |
| **Press**       | Fortune · Business Insider · Nebelspalter · Khaleej Times                                  |
| **Member proof**| Brooks Newmark — joined at 64; 4 yrs later took Rezolve public at $2B; son now joining.   |

### Sources we were given
- **Logos:** `uploads/698c2400adbe3_6762839805a87_logowight.webp` (white wordmark + tagline lockup)
- **Social tiles (4):** `uploads/Changer Club*.png` — primary visual reference for the brand register
- **VSL brief & script:** `uploads/Changer New Position VSL - Dynasty.pdf` — extracted to `assets/dynasty-vsl.txt`. This is the most authoritative voice document in the project: it dictates pacing, tone, kill-list, on-screen text rules, color, and music. **Read it before writing copy.**

No codebase, Figma, or live website was provided — the visual system is reverse-engineered from the four social tiles + the wordmark + the VSL brief's explicit rules ("single muted palette: cream, warm neutral, deep burgundy as accent only", "serif typeface — Canela or equivalent", "white on image, no box, no shadow", "single final fade to black").

---

## 2 · Content fundamentals

The voice is non-negotiable. The VSL brief states it bluntly: *"This audience cannot be sold to… The only register that converts is the register of an equal speaking quietly to another equal."*

### Voice & tone
- **Restrained.** Never enthusiastic. Never exclamatory. Never sales-y.
- **Equal-to-equal.** The reader is a peer, not a prospect. No "discover," "unlock," "transform," "supercharge."
- **Plural pronoun on us, second-person you on them.** *"We admit fifty families a year. You will know whether you want to be in this room."* "I" is rare and only used by the founders directly.
- **Short sentences. Hard stops. Strategic silence.** Pauses on the page mirror the 2-second pauses the brief protects in the film.
- **European register, not American DR.** ~130 words/min spoken, prose pacing in writing. Contractions minimal ("do not" > "don't" in body; contractions allowed only in dialogue or quotes).
- **Truth over decoration.** The brief's rule for film applies to copy: *"a breath in the wrong place, a small hesitation… these are gold, not flaws."* Don't sand the prose flat.

### Casing
- **Sentence case** for body, captions, navigation.
- **UPPERCASE** for the wordmark, eyebrows, navigation labels, and short calls like "FOR THE NEXT GENERATION OF" — always with wide tracking (~0.22em).
- **Display Serif Italic** for the emotional one-word punch: *Legacy*, *Power Families*, *Meets Legacy*. Use sparingly — once per surface.
- **Title Case** is rare; use only on press logos or proper nouns.

### Examples (verbatim from existing brand materials)

| Use                       | Copy                                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| Hero (social)             | *We don't do networking, we do* **LEGACY**                             |
| Hero (social)             | *Changer is Where Longevity* ***Meets Legacy***                        |
| Sub-headline              | *Your next 10 years are one conversation away*                         |
| Sub-headline              | *Add years to your life — and life to your years*                      |
| Sub-headline              | *Build a legacy your children are proud to carry forward*              |
| Eyebrow                   | FOR THE NEXT GENERATION OF                                             |
| Tagline (always with mark)| BE WEALTHY, NOT JUST RICH                                              |
| Primary CTA               | **See if you qualify →**                                               |
| Secondary CTA             | **Apply to join Changer →**                                            |
| Final card (VSL)          | Changer Club · Monaco · Dubai                                          |
| Filter line (scarcity)    | *We admit just fifty families a year… we have said no to applicants with considerably more, when the fit was wrong.* |
| Stat phrasing             | *Statistically, 70% of wealthy families lose money by the second generation. 90% by the third.* |

### Forbidden
- **No emoji.** Anywhere. (The brief literally rules out animated logos and stings — emoji is the same register error.)
- **No exclamation marks.** None.
- **No "🎉 Welcome!"-style microcopy** — even on success states. Use one calm sentence: *"Application received. We will be in touch."*
- **No drone-shot, watch-ad, or TED metaphors.** ("Unlock your potential," "level up," "elevate.")
- **No statistics on screen during the emotional 70% line** — the figure is spoken, never printed beside the talent.
- **No bluish-purple gradients, no animated logo, no lower-thirds during dialogue.**
- **No "modal popup that interrupts."** This audience does not tolerate it.

---

## 3 · Visual foundations

### Palette
A **single muted palette**: ink black ground, warm cream type, **gold as the only accent**. Burgundy exists but is used sparingly (the brief calls for it as "accent only"). No greens, no blues, no purples, no rainbow charts.

| Role            | Hex        | Where it goes                                       |
| --------------- | ---------- | --------------------------------------------------- |
| Ink (page)      | `#000000`  | Hero ground, footer, full-bleed sections            |
| Ink-2 (card)    | `#141414`  | Cards on ink                                        |
| Cream           | `#F4EFE6`  | Primary type on dark, lockup tagline                |
| Cream muted     | `rgba(244,239,230,0.72)` | Body copy on dark                     |
| Gold            | `#C9A24A`  | CTA fill, italic display accent ("LEGACY"), rules  |
| Gold bright     | `#D9B860`  | Hover only                                          |
| Gold deep       | `#8E6F2C`  | Pressed CTA, inset shadow under CTA pill            |
| Burgundy        | `#4A1C24`  | Editorial accents (rare)                            |

### Typography
Three families, each with a single job. **Do not** introduce a fourth.

| Family                    | Substitute (Google) | Used for                                                        |
| ------------------------- | -------------------- | --------------------------------------------------------------- |
| **Canela** (display serif)| Playfair Display     | Emotional one-word italics ("Legacy"), section headlines        |
| **Canela Text** (body serif)| Cormorant Garamond | Long-form editorial, sub-headlines                              |
| **Druk Wide / Anton**     | Anton                | The CHANGER wordmark only                                       |
| **Inter** (UI sans)       | Inter                | CTAs, eyebrows, captions, navigation                            |

> ⚠️ **Substitution flag.** We are using Google Font fallbacks (Playfair Display, Cormorant Garamond, Anton, Inter) until licensed Canela / Druk Wide files arrive. Designs created here will recompose cleanly when the real fonts drop into `fonts/` — every token references the family name through CSS vars in `colors_and_type.css`.

### Spacing
Generous. Luxury reads as *air*. Default vertical rhythm between sections: **96–160px** at desktop. Avoid ≤24px gaps between hero elements; tight stacks read as ad-tech.

8-pt scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160` — exposed as `--cc-space-1 … --cc-space-11`.

### Backgrounds
- **Default ground: pure black** (`#000`). Not "dark mode grey" — black.
- **Photographic hero** with a **hard horizontal split** between image and black panel (see the social tiles). The image and the panel have a **straight cut**, not a gradient, not a feathered mask. Sometimes the photo is offset / inset on the panel rather than full-bleed.
- **No mesh gradients. No noise. No grain.** A subtle radial vignette toward the bottom is permitted.
- **No repeating patterns / textures.**
- **A thin gold rule** (1px, `#C9A24A`) divides press logos / sub-sections.

### Photography
- **Warm, candid, ambient-lit interiors.** Wood-paneled rooms, natural window light, chandelier glow, breakfast spreads, handshakes, mid-conversation.
- **Diverse, 30s–60s subjects** — Monaco / Dubai / Geneva / Milan attire. Real members at real receptions. Never stock-photo "diverse business team."
- **Eyes connect with each other** in B-roll-style imagery, but never with the camera in founder-shot pairs (per VSL brief §5.2).
- **Color grade invisible.** No teal-orange. No film-emulation LUTs. The brief: *"if the look is visible, the look is wrong."*
- **No drones, no aerials, no Monaco/Dubai skyline establishing shots.** Patronising to this viewer.

### Animation & motion
**Restrained throughout.** The visual identity is built on *stillness*.
- **Default = no animation.** Static layouts win.
- **Permitted:** slow opacity fades (180–560ms, ease `cubic-bezier(0.22, 0.61, 0.36, 1)`); the **final fade-to-black** at 900ms on hero/exit transitions.
- **Permitted:** quiet hover state — gold brightens from `#C9A24A` → `#D9B860` over 320ms.
- **Forbidden:** bounce, spring overshoot, scroll-jacking, parallax depth, particle effects, looped video backgrounds with motion, animated counters, marquee scrollers.
- **Reduced-motion:** all durations collapse to 0ms (already wired in `colors_and_type.css`).

### Hover & press states
- **Buttons (gold pill):** hover → `--cc-gold-bright` + faint gold glow `0 0 32px rgba(201,162,74,0.18)`. Press → `--cc-gold-deep`, no scale change. Never shrink or scale on press; this is a luxury register.
- **Links (cream):** hover → cream → gold over 180ms. Underline appears on hover only, 1px, gold, 2px below baseline.
- **Cards:** hover → border opacity rises from 0.12 → 0.55 (gold hairline emerges). No lift, no shadow growth.

### Borders, rules, frames
- **Default hairline:** 1px `rgba(244,239,230,0.12)` — the "framed canvas" look on social tiles.
- **Featured frame:** 1px `#C9A24A` inset 16–24px from the panel edge — the gold "frame" rectangle visible in the LEGACY tile.
- **Section divider:** 1px gold rule, full bleed, 85% opacity.
- **Burgundy is never used as a border.** It's editorial.

### Shadows & elevation
- **Cards:** very low — `0 2px 4px rgba(0,0,0,0.5), 0 24px 60px rgba(0,0,0,0.55)` (mostly to lift off photo backgrounds, not for depth).
- **CTA pill:** **inset** shadow `inset 0 -2px 0 #8E6F2C` to give the gold a struck-coin feel; outer glow is barely-there.
- **No drop-shadow on type.** Per the VSL brief: *"white on image, no box, no shadow."*
- **No inner shadows on inputs.** Inputs are framed by hairlines.

### Corner radii
- **Sharp by default.** 0 or 2px on cards, panels, image crops. The brand is *editorial*, not friendly.
- **Pill (`999px`)** is reserved for **the gold CTA only**. This is the one place softness is allowed; it makes the call to action feel like a coin or a wax seal.
- **No rounded-rectangle (8/12/16px) cards.** That's SaaS-product vocabulary.

### Transparency & blur
- **Black panels are 100% opaque.** Never `rgba(0,0,0,0.6)` over an image — use a hard cut.
- **Backdrop-blur is not used.** Period. (No frosted-glass nav.)
- **Image opacity is rare.** When an image dims, it dims to 40–55% over solid black, not via opacity on the image itself.

### Layout rules
- **12-column grid, 1240px container, 80px gutters.** A narrower 880px container holds long-form copy.
- **Asymmetry over symmetry.** The social tiles offset the photo to one corner of the panel; mirror this in web hero composition. Avoid centered hero-with-button-below unless the moment is genuinely climactic (e.g., the final qualification card).
- **Fixed elements:** the navigation is fixed at top; on scroll it does **not** add a background blur — it gains a 1px gold-line bottom border instead.
- **One CTA per surface above the fold.** "See if you qualify" or "Apply to join Changer" — never both at once.
- **Press logos** sit on a single horizontal row, separated by a gold rule above; aligned to a baseline; equal optical weight (de-saturate to cream).

### Cards
- **Square photo card with bottom black panel** is the canonical Changer card (every social tile is one). Image takes ~55–65% of the height; black panel below carries headline + sub + CTA.
- **No rounded corners.** No drop shadow. No border by default — the image edge is the frame.
- **Variant:** image inset within a 1px gold rectangle, 16px from edge — this is the LEGACY-tile treatment.

---

## 4 · Iconography

The brand uses **almost no iconography.** This is intentional. The VSL brief explicitly forbids on-screen statistics, animated logos, and lower-thirds during dialogue — the same restraint applies to the website and social.

### Rules
- **No emoji. No unicode dingbats. No flag emoji for Monaco/Dubai.**
- **No hand-drawn SVG illustrations.** No "luxury icon set" with crowns, diamonds, columns. These read as cliché on this audience.
- **The arrow is the one icon we use:** a slim **right arrow `→`** following the CTA label. Drawn at `1.5px` stroke, gold or ink depending on button context. Use the unicode `→` (U+2192) at the same weight as surrounding type — no fancy SVG arrow.
- **The CHANGER wordmark** doubles as the brand mark. There is no separate icon-only logo. When space is critical, use the wordmark at small size with the tagline omitted; never invent a "C" monogram.
- **Press-logo wall:** Fortune · Business Insider · Nebelspalter · Khaleej Times — these are word-marks, not icons. Render in cream, equal optical height, separated by space, single row.

### When an icon is unavoidable (functional UI only)
Account / form / nav controls in the application funnel may need icons (close, check, calendar, lock). Use **Lucide** at `1.5px` stroke, 20px box, `currentColor` (which will be cream or gold by context). Lucide's quiet outline style matches the brand's restraint better than Heroicons-solid or Phosphor-fill. **Substitution flag:** if the brand later commissions custom icons, the entire Lucide set should be swapped — no production designs should rely on icon-specific quirks.

### Logos in this kit
- `assets/logo-changer-white.webp` — white wordmark + tagline lockup. Use on dark grounds.
- A black-on-cream version is **not** provided; treat dark logos as missing until the user supplies them. Designs requiring it should fall back to white-on-black inside a black panel.

---

## 5 · Substitutions to flag with the user

| What we substituted             | With                                  | Action requested                       |
| ------------------------------- | ------------------------------------- | -------------------------------------- |
| Canela (display + text serif)   | Playfair Display + Cormorant Garamond | Send Canela `.woff2` files to `fonts/` |
| Druk Wide (wordmark)            | Anton (Google Fonts)                  | Send Druk Wide `.woff2`                |
| Black-on-cream logo             | (not yet provided)                    | Send dark wordmark version             |
| Production photography          | Existing social tiles only            | Send raw event / portrait photography  |
| Member-portrait library         | (none provided)                       | Send Brooks Newmark, Marc Randolph, founder portraits |

---

## 6 · The VSL brief's rules apply everywhere

The Dynasty brief is a brand bible. Even though it's about a film, every rule maps to web, deck, and social:

- **No music swell** under emotional copy → no animations under emotional copy.
- **No B-roll over confessions** → no decorative imagery beside the most personal lines.
- **2-second silence after key statements** → web equivalent is ample whitespace and slow scroll-fades, never carousel auto-advance.
- **Single fade to black at the end** → the funnel ends on a single dark application card. No celebration screen.
- **The pause is the conversion mechanic.** Emptiness is not dead space; it is the design.

Read `assets/dynasty-vsl.txt` before drafting any new copy.
