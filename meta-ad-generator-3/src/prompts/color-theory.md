# Color Theory — Meta Ad Design

This file governs all color decisions. When in doubt, come here first.

---

## 1. Distribution Rule

Every ad uses this ratio. No exceptions.

| Role | Share | What it is |
|---|---|---|
| Dominant | 60–70% | Background, primary surface |
| Accent | 10–15% | CTA, eyebrow, structural details |
| Neutral | 10–15% | Body text (white/off-white) |
| Detail | 5% | Second accent, dividers, micro-elements |

Equal distribution of 3+ colors looks accidental. One color must dominate.

---

## 2. Category-to-Palette Mapping

Match the palette to what the product *feels like*, not just what it is.

### Luxury / UHNWI / Wealth Management
- Base: `#0d0b09` (near-black, not pure black — pure black is flat)
- Text: `#f5f0e8` (warm cream, not pure white — pure white is cold)
- Accent: `#c8a86a` (warm gold)
- Secondary accent: `#b8a88a` (muted gold for body text, captions)
- Mood: restraint, weight, permanence

### Beauty / Wellness / Skincare
- Base: soft blush `#f5ede8`, warm ivory `#faf6f0`, or deep plum `#1a0d12`
- Accent: rose gold `#c9927a`, dusty rose `#d4a5a5`, amber `#d4956a`, lavender `#b8a8c8`
- Avoid: clinical white, neon anything
- Mood: softness, transformation, self-care

### Security / Insurance / Protection
- Base: dark navy `#0a0e1a` or near-black `#0d0f14`
- Accent: urgency red `#c8302a` or electric blue `#1e6fff`
- Text: pure white `#ffffff` (contrast matters most here)
- Mood: authority, vigilance, trust

### SaaS / Tech / B2B Software
- Base: deep charcoal `#111318` or cool dark `#0f1117`
- Accent: electric blue `#4f8eff`, teal `#00c2a8`, or brand color
- Text: `#e8eaf0` (cool off-white)
- Mood: precision, capability, control

### Industrial / Construction / Engineering
- Base: dark charcoal `#1a1a1a` or warm dark `#181410`
- Accent: safety orange `#ff6b00` or `#e85d00`
- Text: white `#ffffff`
- Mood: force, reliability, output

### Health / Fitness / Performance
- Base: dark `#0d1210` or mid-dark `#1a1f1a`
- Accent: vivid green `#2dcc70`, electric lime `#b8ff00`, or red `#e82d2d`
- Text: white or near-white
- Mood: energy, results, transformation

### Financial Services / Investment
- Base: deep navy `#08101e` or dark green `#071510`
- Accent: muted gold `#a89060` or emerald `#1a7a5a`
- Text: `#e8f0e8` (cool cream)
- Mood: stability, growth, trust

### Lifestyle / Consumer / DTC
- Flexible — pull from brand colors directly
- Keep the 60/15/15/5 ratio; vary the hue
- Light theme is valid here — dark is not mandatory

**Finding palette hex values:** For contrast-verified swatches matched to these categories, scan `palettes-neutral.md` by the **Use for** tags — they map directly to the categories above. When a product image is provided, use §18 instead to select by visual match rather than category alone.

---

## 3. Color Application by Layer

The 8-layer stack determines where each color lives.

| Layer | Role | Color rule |
|---|---|---|
| 1 Base | Background fill | Dominant color (60–70%). Never plain flat — use a gradient mesh or radial offset |
| 2 Atmosphere | Depth behind content | Accent at 8–18% opacity in a radial gradient. Adds glow without competing |
| 3 Structural shapes | Geometry / skeleton | Accent at 20–40% opacity, or a second dark tone |
| 4 Photo / hero | Visual anchor | No color rule — preserve photo naturalism |
| 5 Gradient overlay | Photo → text legibility | Black/dark at 85–92% opacity on the text side, fading to transparent |
| 6 Text | Copy | Neutral (cream/white) for headline + body. Accent for eyebrow only |
| 7 Accent details | Rule lines, corner marks | Accent color at full opacity, small footprint |
| 8 CTA button | Action trigger | Accent at full opacity. Padding ≥ 20px vertical / 44px horizontal. Border-radius 6–14px. CTA text: dark on mid/light accent, light on dark accent — verify with §14, not intuition. Box-shadow: accent at 40–50% opacity |

**Key rule:** Accent color only touches Layers 2, 3, 7, and 8. If it appears in more than four places on the canvas it stops being an accent.

---

## 4. Light vs Dark Theme

Do not default dark for everything. Choose based on what the product *feels like*.

**Use dark when:** luxury, security, finance, B2B, industrial, nightlife, premium tech
**Use light when:** wellness, beauty, organic/natural, consumer food, family, spring/summer seasonal

**Light theme construction:**
- Base: `#faf8f4` or `#f5f0e8` (never pure `#ffffff` — it's clinically flat)
- Text: `#1a1710` (near-black, not pure black)
- Accent: same brand accent, but at higher saturation to pop against light

**Dark theme construction:**
- Base: `#0d0b09` to `#1a1a20` range
- Text: `#f5f0e8` to `#e8eaf0` (never pure white on near-black)
- Accent: warm or vivid to create contrast

---

## 5. Building a Palette from Client Colors

When given only primary + accent from `brand-assets.json`, derive the full working set:

1. **Background:** client primary. If it's too light for ad use, darken by 15–20% lightness.
2. **Text:** if dark background → warm off-white (`#f5f0e8`). If light background → near-black (`#1a1710`).
3. **Accent:** client accent, used at full saturation for CTA + eyebrow.
4. **Body text:** if dark background → near-white at 65–75% opacity (safe on dark surface). If light background → derive a mid-dark solid hex: target 5.5–7:1 contrast against the base (see §14). Do not use opacity for body text on light backgrounds — it collapses contrast. Use the accent hue as a tonal reference to keep the body text color-harmonious, but commit to a specific hex.
5. **Atmospheric / decorative:** client accent at 8–18% opacity for Layer 2 radial glow, box-shadows, noise overlays. This opacity value is for visual atmosphere only — never for readable text.
6. **Detail:** client accent at 100% for thin rule lines (2–3px), corner marks, dividers, eyebrow separators.

If the client brief suggests a pastel, botanical, or light-editorial direction and you need a pre-built starting point, `palettes-neutral.md` contains 144 palettes organized by hue family with contrast ratings. Find the closest match by **Use for** tag and hue, then apply the derivation steps above to complete the working set. If the matched palette is rated ⚠, follow the low-contrast fallback instructions in the `palettes-neutral.md` header.

---

## 6. Opacity System

Color at full opacity competes. Control visual hierarchy with opacity.

| Use | Opacity range | Theme constraint |
|---|---|---|
| Layer 2 atmospheric glow (radial) | 8–18% | Both |
| Structural shape fill | 20–40% | Both |
| Gradient overlay on photo (text side) | 85–92% | Both |
| Body text on dark bg | 65–75% | Dark only — see warning below |
| Caption / micro text | 50–60% | Dark only — see warning below |
| Accent glow behind CTA (box-shadow) | 40–50% | Both |
| Noise texture | 3–5% | Both |

**Light-theme opacity warning:** Do NOT use opacity for body text or captions on light backgrounds. Opacity simulates a tint toward the base — on a dark base this keeps contrast high; on a light base it pushes text toward the background and collapses contrast. `rgba(42,36,32,0.62)` on `#f8f5f0` = ~2.3:1 contrast (fails WCAG). Use a specific hex color instead: `#5c5248` on `#f8f5f0` = 6.4:1 (passes). See §14 for the full contrast requirement table.

```css
/* Atmospheric accent — Layer 2 (both themes) */
background: radial-gradient(ellipse 600px 500px at 70% 20%, rgba(200,168,106,0.15) 0%, transparent 60%);

/* Gradient overlay — Layer 5 (both themes) */
background: linear-gradient(to right, rgba(10,10,10,0.92) 30%, rgba(10,10,10,0.4) 60%, transparent 85%);

/* Body text — DARK THEME: opacity safe against dark base */
color: rgba(245,240,232,0.70);

/* Body text — LIGHT THEME: solid hex required, opacity forbidden */
color: #5c5248;  /* warm dark taupe — 6.4:1 on #f8f5f0 base */
color: #6e5248;  /* warm dark rose — 6.4:1 on #faf6f0 base */
color: #405e4a;  /* muted forest — 6.4:1 on #f5f8f4 base */

/* CTA glow */
box-shadow: 0 8px 32px rgba(200,168,106,0.45), 0 2px 8px rgba(0,0,0,0.4);
```

---

## 7. Typography Color Rules

- **Eyebrow:** always brand accent color, full opacity. It's the brand signal.
- **Headline:** dominant neutral (cream/white). One phrase can be accent — not the whole headline.
- **Body text (dark theme):** near-white at 65–75% opacity. Full-opacity body text competes with the headline. Dark base makes this safe — the dark surface prevents the opacity from collapsing contrast.
- **Body text (light theme):** do NOT use opacity — use a specific mid-dark hex color (e.g., `#5c5248`, `#4a4440`). On a light base, opacity pushes the text toward the background and fails WCAG. See §14 for contrast requirements.
- **CTA label:** dark text on mid/light accent buttons; light text on dark accent buttons. See §14 for the exact decision rule.

**Headline color split technique:**
Break the headline into two parts at a natural phrase boundary. White for the setup, accent for the emotional or value word.
```html
<h1 class="headline">
  After the exit,<br>
  <span style="color: #c8a86a;">what's next?</span>
</h1>
```
Use this once per ad maximum. It is a focal point, not a pattern.

---

## 8. Background Treatment

Never plain flat color. Minimum: a subtle radial gradient offset from center.

```css
/* Minimal dark — one radial offset */
background:
  radial-gradient(ellipse at 75% 15%, rgba(200,168,106,0.12) 0%, transparent 55%),
  #0d0b09;

/* Richer dark — dual radial atmosphere */
background:
  radial-gradient(ellipse at 70% 20%, rgba(200,168,106,0.18) 0%, transparent 55%),
  radial-gradient(ellipse at 15% 85%, rgba(180,60,40,0.10) 0%, transparent 50%),
  #0d0b09;

/* Light theme — warm tonal shift */
background:
  radial-gradient(ellipse at 30% 20%, rgba(212,149,106,0.10) 0%, transparent 60%),
  #faf8f4;
```

**Gradient mesh for SaaS/Tech:**
```css
background:
  radial-gradient(ellipse at 10% 90%, rgba(79,142,255,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 90% 10%, rgba(0,194,168,0.12) 0%, transparent 45%),
  #0f1117;
```

---

## 9. Color Psychology

Understanding why colors work is what separates deliberate palette choices from guesswork. Every hue carries psychological weight — match it to the emotional job the ad must do.

### Red
**Effect:** Urgency, energy, passion, danger, appetite stimulation. Red is the most perceptually ambiguous color — the same shade can read as danger, urgency, passion, celebration, or appetite depending entirely on context.
**Use in ads:** CTAs that demand immediate action, fitness/performance accents, security/protection signals.
**Caution:** Never use as dominant background — it overwhelms and fatigues fast. Never use as text on dark backgrounds — illegible. Never deploy it just because "the brand uses red" — ask what emotional job it's doing. Always pair with supporting copy that clarifies intent — red alone does not communicate a single clear emotion and viewers will read it through their own lens.

### Blue
**Effect:** Trust, calm, reliability, professionalism, intelligence.
**Use in ads:** SaaS, B2B, financial services, healthcare — any category where credibility is the purchase driver.
**Caution:** Blue is the most overused corporate color. Differentiate through shade: deep navy `#0a1628` reads premium and authoritative; electric `#4f8eff` reads technical and modern; muted steel `#6a85a8` reads calm and understated. Generic mid-blue reads as nothing.

### Yellow / Gold
**Effect:** At high saturation — optimism, warmth, attention-grabbing. At low saturation (desaturated gold) — wealth, refinement, prestige.
**Use in ads:** Two modes. Vivid yellow (`#ffd000`) = energy, urgency, low-cost consumer. Desaturated warm gold (`#c8a86a`) = luxury, heritage, UHNWI. Never mix the two modes — they signal opposite ends of the market.
**Caution:** Yellow text on any light surface is invisible. Yellow as a dominant background reads cheap unless the entire design commits to it (editorial poster style).

### Green
**Effect:** Two completely different registers depending on saturation and value.
- Vivid green (`#2dcc70`, `#b8ff00`) = energy, performance, results, growth metrics
- Dark/muted green (`#1a7a5a`, `#071510`) = stability, wealth, nature, trustworthiness
**Use in ads:** Match register to product. Performance supplements → vivid. Investment/wealth → muted dark. Organic/wellness → mid-tone natural greens.
**Caution:** Bright green adjacent to red reads as "Christmas" or "traffic light" — avoid that combination unless it's intentional.

### Black / Near-Black
**Effect:** Sophistication, authority, exclusivity, luxury restraint.
**Use in ads:** The dominant choice for premium, UHNWI, and high-authority brands. Near-black (`#0d0b09`) reads warmer and more crafted than pure black (`#000000`), which reads as digital and flat.
**Caution:** Near-black requires warm undertones in both the base and the accent to avoid feeling cold and sterile. Pair with warm gold or warm cream — never cold blue on near-black unless the product category demands technical precision.

### White / Cream
**Effect:** Purity, clarity, simplicity, space. Cream adds warmth; pure white is clinical.
**Use in ads:** Headlines and body text on dark backgrounds. Light themes for wellness, beauty, organic. Use warm cream (`#f5f0e8`) for luxury and near-warm themes; cooler off-white (`#e8eaf0`) for tech/SaaS.
**Caution:** Pure white base backgrounds feel sterile and undesigned. Always introduce a subtle warm or cool tint.

### Orange
**Effect:** Energy and enthusiasm with less aggression than red. Approachable urgency, warmth, creativity.
**Use in ads:** CTAs where red feels too harsh (consumer products, lifestyle). Industrial accents. Fitness performance. Desaturated/shaded orange (burnt orange `#b5451b`, amber `#d4956a`) works as a warm background tone for lifestyle and organic categories — it provides warmth without the intensity of vivid orange.
**Caution:** Vivid orange at high saturation on light backgrounds reads as "discount" or "fast food." Dark base + vivid orange accent (`#ff6b00`) is the professional register for industrial and performance categories.

### Purple
**Effect:** Creativity, luxury (when dark and muted), spirituality, femininity.
**Use in ads:** Very rarely — dark plum `#1a0d1a` can work for beauty/wellness dark themes. Muted violet as an accent for cosmetics or creativity-adjacent brands.
**Caution:** Bright purple gradient on white is the single most recognizable AI-generated design pattern. Never use it. Any purple must be heavily desaturated, dark, or used as a small accent — never dominant.

### Brown
**Effect:** Earthy, natural, warm, trustworthy. Associated with organic materials, craftsmanship, and sustainability.
**Use in ads:** Organic food and drink, coffee, outdoor/adventure brands, sustainable and artisan products.
**Nuance is critical:** Light tints read clean and natural. Darker shades feel rich and premium. Muddy mid-tones feel dirty and dated — the exact tint determines whether brown feels artisan or cheap.
**Caution:** Brown as a dominant background risks feeling dull unless offset with a vivid or clean accent. Works best as a warm tone in an analogous scheme alongside amber, cream, and off-white.

### Pink
**Effect:** Happiness, warmth, playfulness. Carries strong feminine coding in consumer culture — but executed deliberately, can be gender-neutral.
**Use in ads:** Beauty, wellness, consumer goods for female-skewing audiences, food and lifestyle.
**Two registers:** Bright/vivid pink = youthful energy and attention-grabbing. Muted dusty rose = sophisticated and editorial. Choose deliberately — they signal opposite ends of the market.
**Caution:** Do audience research before defaulting to pink for female demographics. "Millennial pink" (`#f4a7a0` range) reads dated. Dusty rose and deep mauve are the current sophisticated registers.

### Metallic (Gold / Silver / Bronze)
**Effect:** Glamour, achievement, premium quality, exclusivity.
**Screen limitation:** True metallics are physical (foil, powder, paint) and cannot be rendered directly in RGB. Simulate with gradient overlays and calibrated hex values:
- Gold: `#c8a86a` (warm, restrained) or `#d4af37` (vibrant). A subtle linear highlight gradient adds shimmer.
- Silver: `#b8c0cc` (cool) paired with near-white `#f0f2f5` highlights.
- Bronze: `#a0785a` (warm brown-gold).
**Use in ads:** One metallic accent element maximum — CTA button, eyebrow rule, or structural frame. Multiple competing metallic surfaces cancel each other out.
**Caution:** Metallic gradients quickly read as tacky when overused. The simulation only holds at small footprint against a dark base.

---

## 10. Color Harmony

The structural reason a palette works or doesn't. Before combining any two colors, know which scheme you're working in.

### Monochromatic
One hue, varied across lightness and saturation. Most refined scheme — impossible to look discordant because there's only one hue involved.
- **Example:** near-black base + deep gold mid-tone + bright gold accent → all in the warm-brown-gold hue family
- **Best for:** luxury, premium, editorial. Any category where restraint signals quality.
- **Risk:** monotony. Prevent it with extreme lightness contrast — the dark and light ends of the range must be far apart.
- **Marketing caution:** monochromatic schemes can lack the contrast needed to stop the scroll in a competitive social feed. In print and editorial it reads as refined; in a feed of hundreds of competing ads, it risks blending into surrounding content. Use only when the brief explicitly calls for restraint, or when the product category (ultra-luxury, UHNWI) makes understatement the signal of quality.

### Complementary
Colors from opposite sides of the wheel. Creates the highest natural contrast and visual energy.
- **Example:** near-black (warm) + electric blue accent; orange CTA on dark navy
- **Best for:** high-impact ads with a clear hero element that needs to pop. Security, tech, performance.
- **Rule:** complementary colors must never appear in equal amounts — use the 70/15 distribution or they fight each other. One dominates, one accents.
- **Note:** our luxury palette (near-black + warm gold) uses a near-complementary tension — the warm undertones of the base and the gold occupy opposite warmth zones, which is why the combination has inherent visual energy despite being low-contrast overall.

### Analogous
Adjacent colors on the wheel — e.g., gold + amber + burnt orange, or teal + blue + indigo. Naturally harmonious because they share undertones.
- **Best for:** wellness, beauty, organic, lifestyle. Any category where harmony and naturalness are the emotional target.
- **Risk:** low contrast between elements if the adjacent colors are too close. The accent must be at least 2 steps removed from the base in lightness, not just a slightly different hue.

### Triadic
Three colors spaced evenly around the wheel. Vivid and balanced, but complex to control.
- **Practical use in ads:** suppress two of the three to near-accent footprint (5% each) and let one dominate. Do not attempt equal triadic distribution on a 1080×1080px canvas — it reads as chaotic.
- **Best for:** high-energy consumer campaigns, retail, youth-oriented brands where complexity signals abundance.
- **Avoid for:** luxury, UHNWI, B2B, any category where simplicity signals quality.
- **Scheme quality depends on which tier of the wheel you draw from:** Primary triads (red + blue + yellow) produce vibrant, distinct, high-contrast results. Secondary triads (orange + green + violet) produce murkier, lower-contrast combinations. Tertiary triads risk looking dark and jumbled. For ad design, only deploy triadic schemes built from primary colors. If the client's brand colors form a secondary or tertiary triad, suppress two of them and treat the palette as complementary instead.

### Split Complementary
One base color and two colors flanking its complement — rather than pointing directly across the wheel, the triangle leans to one side.
- **Example:** red base → blue-green and yellow-green as the split pair. Navy base → warm gold and burnt orange as split accents.
- **Effect:** visual contrast and energy similar to complementary, but with significantly less tension. More forgiving and harmonious.
- **Best for:** lifestyle, wellness, consumer DTC — categories where you want contrast without aggression. A good default when pure complementary creates too much visual conflict.
- **Rule:** base dominates (60–70%); the two split colors share the accent budget (10–15% combined) at roughly equal weight. Never let one split color dominate over the other — they should feel like a pair.
- **Advantage:** when a client's brand colors create harsh tension as direct complements, shifting to split complementary resolves the conflict while preserving contrast.

### Square
Four colors equally spaced around the wheel — two sets of complementary pairs working simultaneously.
- **Effect:** rich and energetic when controlled, chaotic when not.
- **Rule:** one color dominates at 80%+; the remaining three are accents only. If you cannot maintain this ratio without the design feeling cluttered, abandon the scheme entirely.
- **Best for:** high-energy consumer campaigns — entertainment, gaming, events, retail. Almost never appropriate for luxury, B2B, or finance.
- **Practical reality:** square schemes rarely appear in effective ad design. Default to complementary or split complementary; use square only when the brief explicitly demands maximum color energy.

---

## 11. Simultaneous Contrast

A color does not exist in isolation — it looks different depending on what surrounds it. This is the most practically important perceptual principle in ad design.

**Core principle (Chevreul):** Adjacent colors shift each other's perceived hue, saturation, and value. Complementary adjacent colors intensify each other. Similar adjacent colors dull each other.

**Practical implications:**

| Situation | Effect | Action |
|---|---|---|
| Gold `#c8a86a` on near-black base | Appears warm, luminous, rich | This is the luxury formula — the dark base amplifies the gold |
| Same gold `#c8a86a` on white | Appears dull, muted, flat | Do not use gold accents on light bases — switch to a more saturated version |
| Orange CTA on dark navy background | Orange appears more vivid — complementary push | Use this intentionally; navy + orange is high-impact |
| Orange CTA on warm brown background | Orange appears less vivid — analogous dullness | Add more lightness contrast, not more saturation |
| White text on near-black | Slightly warm/ivory appearance due to dark surround | Use warm cream (`#f5f0e8`) to work with this, not against it |
| Dark text on light background | Text appears darker than its hex value | Slightly lighter text is still legible and feels less harsh |

**For ad backgrounds:** Dark bases make accents look more saturated and vivid than they are. Light bases require you to push accent saturation higher to achieve equivalent pop. Always prototype accents against the actual base color — hex swatches in isolation lie.

---

## 12. Cultural Color Context

Relevant when the client targets specific geographic markets. Color meanings are not universal.

| Color | Western default | East Asian context | Middle Eastern context |
|---|---|---|---|
| Red | Urgency, danger, passion | Luck, prosperity, celebration | Danger, caution |
| White | Purity, cleanliness | Mourning (in some cultures) | Purity, peace |
| Green | Nature, health, growth | Luck, prosperity | Sacred color (Islamic context) |
| Gold | Wealth, prestige | Wealth, prestige | Wealth, prestige |
| Blue | Trust, calm | Immortality, healing | Safety, protection |
| Black | Sophistication, luxury | Mourning, negative omen | Mourning, evil |

**Safe colors across all major markets:** gold, blue (mid-to-dark range), neutral cream/off-white.

**For East Asian markets:** Avoid using red as an urgency or warning signal — it reads as positive. Shift urgency signaling to orange or high-contrast white. Lead trust signals with blue or gold.

**For global campaigns with no specified market:** Default to gold, blue, or neutral accent. Avoid red as the dominant accent unless the brief explicitly calls for it.

---

## 13. Anti-Patterns

**Hard prohibitions:**

| Pattern | Why |
|---|---|
| Purple/blue gradient on white | The single most obvious AI-slop signal |
| Equal split of 3+ colors | Looks accidental, no hierarchy |
| Red text on dark background | Illegible in mobile feed |
| Yellow text on white | Invisible |
| Gradient text (webkit-background-clip: text) | Kills legibility at small sizes |
| Pure `#000000` black as base | Flat, harsh, no depth |
| Pure `#ffffff` white as base | Clinical, no warmth |
| Full-saturation accent on headline | Accent is for accenting — not headlining |
| Accent color in more than 4 places | Dilutes the accent's attention-pull |
| Dark theme on wellness/beauty/organic | Wrong emotional register |
| Shadow stacked on shadow | Multiple box-shadows + drop-shadow + text-shadow compound. One shadow layer per element max — stack them and the depth reads as noise, not dimension |
| More than 3 distinct text sizes | Eyebrow / headline / body: 3 sizes is the ceiling. A fourth size (pull quote, sub-caption, etc.) destroys hierarchy — collapse it into one of the existing three |
| Opacity for body/caption text on light base | Contrast collapses — see §6 warning and §14. Use solid hex instead |

---

## 14. Contrast & Legibility

Every piece of text in an ad must meet WCAG AA contrast minimums. These are not optional — failing contrast is invisible at design time but makes text unreadable on real devices in varied lighting.

### WCAG AA minimums

| Text type | Minimum contrast ratio |
|---|---|
| Normal text (< 18px regular, < 14px bold) | 4.5:1 |
| Large text (≥ 18px regular, ≥ 14px bold) | 3:1 |
| CTA labels (11–13px uppercase tracked) | 4.5:1 — counts as normal text despite small size |
| Eyebrow labels (11–12px uppercase bold) | 4.5:1 — counts as normal text |
| Body text (≥ 22px per designer.md floor) | technically 3:1, but target 5.5:1+ for comfortable reading |

Contrast ratio = `(L_lighter + 0.05) / (L_darker + 0.05)` where L = relative luminance (0 = black, 1 = white).

**CTA labels and the 22px floor:** designer.md enforces a 22px minimum for readable body copy. CTA button labels (11–13px uppercase, heavily tracked, inside a padded button) are an intentional exception — the button affordance (padding, background, border-radius) compensates for the small type size. They remain at 4.5:1 because the small physical size puts them in the normal-text WCAG category regardless of styling.

### CTA button text color — decision rule

"Invert the dominant color" is a dark-theme shortcut that breaks on light-theme ads. Use this logic:

1. Estimate the accent button's luminance (L)
2. **L < 0.18** (dark accent) → use light text (near-white primary)
3. **L > 0.35** (light/mid-light accent) → use dark text (near-black primary)
4. **0.18 ≤ L ≤ 0.35** (ambiguous mid-zone) → calculate both options; use whichever gives the higher ratio

Neutral palette accents (`#a89880`, `#6a7a8a`, `#7a7060`, `#9a8a78`) all fall in the L=0.15–0.33 range. See the verified CTA text values in `palettes-neutral.md`.

### The opacity anti-pattern on light themes

Opacity is a contrast-management tool that only works in one direction: it reduces the gap between text and background. On a dark base, semi-transparent light text still reads — the dark surface keeps luminance low. On a light base, semi-transparent dark text is pushed toward the background and fails:

```
❌  rgba(42,36,32,0.62) on #f8f5f0  →  effective contrast ~2.3:1  (fails AA)
✅  #5c5248 at 100% opacity on #f8f5f0  →  contrast 6.4:1  (passes AA)
```

**Rule:** Body text and captions on light-theme ads must use a specific solid hex, not opacity. The hex should be a mid-dark value — dark enough to pass 4.5:1 against the base, light enough to maintain visual hierarchy under the headline.

Deriving a safe body text hex for a light theme:
- Target: contrast 5.5–7:1 against the base (legible but not as heavy as the near-black headline)
- Example: headline `#2a2420` on `#f8f5f0` = ~12:1. Body `#5c5248` on `#f8f5f0` = ~6.4:1. Hierarchy maintained by luminance distance, not opacity.

### Secondary text and links

Secondary copy (sub-CTAs, metadata, fine print) often uses opacity for softness. On light themes:

- Opacity ≥ 0.65 on `rgba(near-black, X)` keeps contrast above 3:1 for large-ish text (≥ 16px)
- Opacity < 0.55 on any light bg reliably fails for small text
- Prefer a solid muted hex over opacity — it's predictable and avoids context-dependent failures

---

## 15. Warm vs Cool Color Temperature

The color wheel is divided into two temperature zones. Every color decision carries a temperature signal — understanding it prevents palette mismatches.

**Warm colors:** red, orange, yellow, warm gold, amber, coral, brown.
**Cool colors:** blue, green, violet, teal, silver, grey-blue.

**Perceptual behavior:**
- Warm colors advance toward the viewer — they feel closer, more immediate, more urgent.
- Cool colors recede — they feel calmer, more spacious, more distant.
- In interior design: warm rooms feel cozy and intimate; cool rooms feel clean, open, and larger. The same principle applies on a canvas.

**For ad design:**
- If the dominant color is cool, add a single warm accent to create tension and direct attention to the most important element (CTA, key phrase).
- If the dominant color is warm, a cool accent provides visual balance and prevents the ad from feeling aggressive or overwhelming.
- Never mix a warm base with a warm accent of similar temperature — you get heat without contrast. The accent must be either cooler than the base, or significantly lighter/darker.

**Temperature and product category:**
| Category | Temperature direction |
|---|---|
| Luxury / UHNWI | Warm (near-black with warm gold — both warm-toned) |
| Security / authority | Cool to neutral (navy, dark grey) |
| Wellness / organic | Warm (amber, green-gold, cream) |
| Tech / SaaS | Cool (electric blue, teal, grey) |
| Fitness / performance | Warm accent on dark neutral base |
| Beauty / skincare | Warm (rose, blush, amber) or deliberately cool (clinical white-based) |

**Warm base + warm accent:** only works if one is extremely dark and one extremely light — temperature alone cannot separate them, lightness contrast must do the work.

---

## 16. Tints, Shades, and Tones

These are the three ways to modify a pure color. Understanding them is what allows you to build a complete palette from a single client brand color.

| Term | How to make it | Effect |
|---|---|---|
| **Tint** | Pure color + white | Lighter, softer, more delicate and airy |
| **Shade** | Pure color + black | Darker, heavier, more serious and dramatic |
| **Tone** | Pure color + grey | Desaturated, muted, more sophisticated and restrained |

**Why this matters for ad design:**

A single brand accent (e.g., `#c8a86a` warm gold) has an entire family of derived values:
- Its tint → atmospheric glow, background radial gradients (Layer 2)
- Its shade → structural shapes, deep base tones (Layer 3)
- Its tone → muted body text accent, secondary captions
- Full saturation → CTA button, eyebrow, rule lines (Layers 7, 8)

**Practical mapping to the opacity system:**

Using `rgba` and low opacity is functionally equivalent to creating a tint (mixing the color toward the background). This is why Layer 2 atmosphere uses `rgba(accent, 0.12–0.18)` — it's a tint of the accent against the dark base.

```css
/* Tint equivalent — accent at low opacity on dark base */
background: radial-gradient(ellipse at 70% 20%, rgba(200,168,106,0.15) 0%, transparent 60%);

/* Full saturation — pure accent at Layer 7/8 */
background: #c8a86a;
color: #c8a86a;
```

**Saturation and emotional register:**
- High saturation (pure hue): vivid, energetic, attention-demanding — use for CTAs and eyebrows only
- Desaturated (toned): refined, sophisticated, restrained — use for luxury, UHNWI, and editorial categories
- Very desaturated (near-grey): near-neutral — use for subtle structural elements that shouldn't attract attention

**Caution:** different saturations of the same hue can look mismatched if the shift is too small. When building a tinted or toned variant, move far enough along the saturation axis that the relationship reads as intentional — not as if the wrong shade was accidentally used.

---

## 17. Ready-Made Palettes

Complete working palettes with all derived values.

### Luxury Dark
```
Base:           #0d0b09
Text:           #f5f0e8  (headline)
Body text:      rgba(245,240,232,0.70)  (dark theme — opacity safe)
Accent:         #c8a86a
Accent muted:   #b8a88a
Accent glow:    rgba(200,168,106,0.45)
Atmosphere:     rgba(200,168,106,0.15)
CTA text:       #0d0b09  (dark — 8.4:1 on accent ✓)
```

### Security Dark
```
Base:           #0a0e1a
Text:           #ffffff  (headline)
Body text:      rgba(255,255,255,0.72)  (dark theme — opacity safe)
Accent:         #c8302a
Accent glow:    rgba(200,48,42,0.40)
Atmosphere:     rgba(200,48,42,0.10)
CTA text:       #ffffff  (light — 5.4:1 on accent ✓)
```

### SaaS Dark
```
Base:           #0f1117
Text:           #e8eaf0  (headline)
Body text:      rgba(232,234,240,0.70)  (dark theme — opacity safe)
Accent:         #4f8eff
Accent glow:    rgba(79,142,255,0.35)
Atmosphere:     rgba(79,142,255,0.12)
CTA text:       #0f1117  (dark — 5.9:1 on accent ✓)
```

### Industrial Dark
```
Base:           #181410
Text:           #ffffff  (headline)
Body text:      rgba(255,255,255,0.70)  (dark theme — opacity safe)
Accent:         #ff6b00
Accent glow:    rgba(255,107,0,0.40)
Atmosphere:     rgba(255,107,0,0.10)
CTA text:       #181410  (dark — 6.3:1 on accent ✓)
```

### Beauty Light
```
Base:           #faf6f0
Text:           #1a1410  (headline — ~12:1)
Body text:      #6e5248  (solid hex — 6.4:1 on base ✓; do NOT use rgba here)
Accent:         #c9927a
Accent glow:    rgba(201,146,122,0.22)
Atmosphere:     rgba(201,146,122,0.12)
CTA text:       #1a1410  (dark — 6.8:1 on accent ✓)
```

### Wellness Light
```
Base:           #f5f8f4
Text:           #161a14  (headline — ~12:1)
Body text:      #405e4a  (solid hex — 6.4:1 on base ✓; do NOT use rgba here)
Accent:         #3a7a5a
Accent glow:    rgba(58,122,90,0.22)
Atmosphere:     rgba(58,122,90,0.10)
CTA text:       #f5f8f4  (light — 4.6:1 on accent ✓)
```

---

## 18. Image-Based Palette Selection

When a product image or client photo is provided, do not pick a palette arbitrarily or purely from the category mapping in §2. Instead, read the image first and let its colors guide the palette choice. The goal is coherence: the ad's background, typography, and CTA should feel like they grew from the same color world as the product itself.

### Step 1 — Read the image

Identify the three dominant properties of the image:

1. **Dominant hue family** — what color category dominates? (warm neutrals, blush/rose, teal/aqua, lavender/violet, green, gold/amber, etc.)
2. **Temperature** — is the image overall warm (reds, oranges, yellows, warm whites), cool (blues, greys, cool greens), or neutral?
3. **Luminance register** — is the image mostly light (high-key, pale, pastel), mostly dark (low-key, deep, rich), or mid-tone?

### Step 2 — Match to a palette

Open `palettes-neutral.md` and find the palette whose **Base** and mid-tone swatches are closest to the image's dominant hue and temperature. Prioritize:

- **Hue family match first** — a warm rose image wants a rose/blush-family base, not a teal one.
- **Temperature match second** — a warm-toned image should pair with a warm palette base. A cool-toned image with a cool or neutral base.
- **Luminance register third** — a high-key (light, pastel) image fits a light-base palette. A dark or moody image fits a darker base palette.

Do not force a palette that contradicts the image's temperature — it will make the product look like it was dropped into the wrong environment.

### Step 3 — Extract a cohesion accent

If no palette in `palettes-neutral.md` is a close match, derive the accent directly from the image:

1. Identify the **single most vivid or distinctive color** in the image (e.g., a product label color, a flower petal, a clothing highlight).
2. Use that color — or a slightly desaturated version of it — as the ad's accent (eyebrow, CTA button, rule lines).
3. Select the closest neutral palette base that does not compete with the extracted accent.

### Decision table

| Image character | Palette direction |
|---|---|
| Warm ivory / cream tones | Saltwater Pearl, Gentle Dunes, Ballet Slippers — warm light bases |
| Cool grey / white tones | Opaline, Soft Tears, Sorbet — cool/neutral light bases |
| Blush / rose / pink dominant | Rose Petals, Pastel Blush, Petal family palettes |
| Lavender / violet dominant | Lavender Sapphire Mist, Lavender Lilt, Amethyst Wisteria Twilight, Lilac Dreams |
| Teal / aqua / mint dominant | Charming Seaside, Aquamarine Blossom, Aqua Rose, Spa Serenity |
| Green / botanical dominant | Minty Fresh, Mint Julep, Garden Fresco, Meadows |
| Gold / amber / warm orange dominant | Golden Pasture, Gentle Dunes, or extract accent directly from image |
| Muted / desaturated / greige | Pastel Blush, Sorbet, Soft Tears — pull text from §17 Beauty Light or Wellness Light |
| Dark / moody / deep tones | §17 ready-made dark palettes — Luxury Dark or Security Dark |

**Low-contrast fallback:** Most pastel palettes in `palettes-neutral.md` are rated ⚠ (<3:1) and cannot carry body text or CTA labels on their own. When the best image-matched palette is ⚠ or (large only):
- Use its Base swatch for background surface and atmosphere only
- Use its mid-tone swatches for decorative accents: eyebrow rule, separator lines, atmosphere glow
- Substitute all text and CTA colors from the nearest §17 ready-made palette:
  - Warm image → Beauty Light: headline `#1a1410`, body `#6e5248`, CTA `#c9927a`
  - Cool/neutral → Wellness Light: headline `#161a14`, body `#405e4a`, CTA `#3a7a5a`
  - Moody/dark → Luxury Dark: headline `#f5f0e8`, body `rgba(245,240,232,0.70)`, CTA `#c8a86a`
- If a ✓-rated palette exists that matches the image, prefer it — the contrast is already solved.

### What to avoid

- Do not pick a palette because the name sounds right. Base the choice on the actual hex values and their relationship to the image's colors.
- Do not introduce a hue family that has no presence anywhere in the image or brand assets — it will make the product feel disconnected from its context.
- If the image contains multiple strong hue families (e.g., a product on a multicolor background), anchor to the **product itself**, not the background.
