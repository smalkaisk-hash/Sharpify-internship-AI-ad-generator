# Pastel Palettes

Scraped from https://www.figma.com/color-palettes/pastel/ on 2026-05-08.
144 palettes — 523 hex codes.

**Structural rule:** Within each palette, swatches are sorted light → dark by relative luminance. The lightest swatch is the `Base`. The darkest is `Text + CTA button`. Mid-luminance swatches (between lightest and darkest) fall in a zone where neither in-palette light nor dark text achieves reliable WCAG AA contrast — mark these **decorative only** (rules, borders, atmosphere, box-shadow). See §14 of color-theory.md for the contrast decision rule.

**Contrast rating:** ✓ = ≥4.5:1 (WCAG AA full) | (large only) = 3.0–4.5:1 (large text / UI only) | ⚠ = <3.0:1 (decorative only)

**Category cross-reference:** The **Use for** tags in each palette use descriptive labels that map to §2 of color-theory.md as follows:

| Palette "Use for" label | §2 category |
|---|---|
| botanical beauty, spa, wellness | Beauty / Wellness / Skincare |
| premium cosmetics, luxury goods, high-end fashion | Luxury / UHNWI / Wealth Management |
| organic beauty, natural food, sustainable lifestyle | Lifestyle / Consumer / DTC |
| DTC fashion, architecture, professional services | Lifestyle / Consumer / DTC |
| confectionery, gifting, playful lifestyle | Lifestyle / Consumer / DTC |
| coastal lifestyle, travel, clean beauty | Lifestyle / Consumer / DTC |
| light lifestyle editorial, wellness, home goods | Beauty / Wellness / Skincare |

See §2 for the authoritative category-to-color mapping, and §18 for image-based palette selection.

**Low-contrast fallback:** 113 of 144 palettes are rated ⚠ (<3:1) — their darkest swatch cannot carry body text or CTA labels on its own. When using a ⚠ or (large only) palette:
- Use its Base swatch for background atmosphere and surface only
- Use its mid-tone swatches for decorative accents (rule lines, eyebrow, atmosphere)
- Substitute text and CTA colors from the nearest §17 ready-made palette in color-theory.md:
  - Warm image direction → Beauty Light: text `#1a1410`, body `#6e5248`, CTA bg `#c9927a`
  - Cool/neutral image direction → Wellness Light: text `#161a14`, body `#405e4a`, CTA bg `#3a7a5a`
  - Moody/dark image direction → Luxury Dark: text `#f5f0e8`, CTA bg `#c8a86a`
- Never use a ⚠ palette's darkest swatch as body text without manually verifying its contrast against the base using the formula in §14 of color-theory.md.

---

## Lavender Sapphire Mist

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F0DAD5` | L≈0.73 |
| Light Mid | `#BABBB1` | L≈0.49 |
| Mid | `#DEA785` | L≈0.45 |
| Dark Mid | `#D9A69F` | L≈0.45 |
| Darkest | `#C56B62` | L≈0.23 |
| Deep | `#6C739C` | L≈0.18 |
| Deepest | `#424658` | L≈0.06 |

| Role | Value |
|---|---|
| Base | `#F0DAD5` |
| Second tone (decorative only) | `#BABBB1` |
| Accent (decorative only) | `#DEA785` |
| Accent (decorative only) | `#D9A69F` |
| Accent (decorative only) | `#C56B62` |
| Accent (decorative only) | `#6C739C` |
| **Text + CTA button** | `#424658` |
| **Body text hex** | `#424658` (7.0:1 on base ✓) |
| **CTA text** | `#F0DAD5` (7.0:1 on `#424658` ✓) |
| Accent glow | `rgba(217,166,159,0.26)` |
| Atmosphere | `rgba(217,166,159,0.10)` |
---

## Opal Seashell Cascade

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#DBDBDB` | L≈0.71 |
| Light Mid | `#F4CC9C` | L≈0.65 |
| Dark Mid | `#3EBCB3` | L≈0.40 |
| Darkest | `#C592A8` | L≈0.35 |

| Role | Value |
|---|---|
| Base | `#DBDBDB` |
| Second tone (decorative only) | `#F4CC9C` |
| Accent (decorative only) | `#3EBCB3` |
| **Text + CTA button** | `#C592A8` |
| Body text | ⚠ insufficient contrast (1.9:1) — decorative use only |
| Accent glow | `rgba(62,188,179,0.26)` |
| Atmosphere | `rgba(62,188,179,0.10)` |
---

## Amethyst Wisteria Twilight

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F0F0F0` | L≈0.87 |
| Light Mid | `#FCE5CC` | L≈0.81 |
| Mid | `#D0ADC4` | L≈0.47 |
| Dark Mid | `#C889B5` | L≈0.34 |
| Darkest | `#736EAE` | L≈0.18 |
| Deep | `#744B93` | L≈0.11 |

| Role | Value |
|---|---|
| Base | `#F0F0F0` |
| Second tone (decorative only) | `#FCE5CC` |
| Accent (decorative only) | `#D0ADC4` |
| Accent (decorative only) | `#C889B5` |
| Accent (decorative only) | `#736EAE` |
| **Text + CTA button** | `#744B93` |
| **Body text hex** | `#744B93` (5.8:1 on base ✓) |
| **CTA text** | `#F0F0F0` (5.8:1 on `#744B93` ✓) |
| Accent glow | `rgba(200,137,181,0.26)` |
| Atmosphere | `rgba(200,137,181,0.10)` |
---

## Lilac Sapphire Serenity

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#B1D2EC` | L≈0.61 |
| Light Mid | `#F8B1EA` | L≈0.57 |
| Mid | `#C04CC5` | L≈0.20 |
| Dark Mid | `#527AA6` | L≈0.18 |
| Darkest | `#702C74` | L≈0.07 |
| Deep | `#48415F` | L≈0.06 |

| Role | Value |
|---|---|
| Base | `#B1D2EC` |
| Second tone (decorative only) | `#F8B1EA` |
| Accent (decorative only) | `#C04CC5` |
| Accent (decorative only) | `#527AA6` |
| Accent (decorative only) | `#702C74` |
| **Text + CTA button** | `#48415F` |
| **Body text hex** | `#48415F` (6.1:1 on base ✓) |
| **CTA text** | `#B1D2EC` (6.1:1 on `#48415F` ✓) |
| Accent glow | `rgba(82,122,166,0.26)` |
| Atmosphere | `rgba(82,122,166,0.10)` |
---

## Gentle Dunes

**Theme:** Light — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FEE1BB` | L≈0.79 |
| Light Mid | `#F3C09F` | L≈0.59 |
| Mid | `#52DCCE` | L≈0.57 |
| Dark Mid | `#9DC9C3` | L≈0.53 |
| Darkest | `#E083AC` | L≈0.35 |
| Deep | `#69AAAF` | L≈0.35 |

| Role | Value |
|---|---|
| Base | `#FEE1BB` |
| Second tone (decorative only) | `#F3C09F` |
| Accent (decorative only) | `#52DCCE` |
| Accent (decorative only) | `#9DC9C3` |
| Accent (decorative only) | `#E083AC` |
| **Text + CTA button** | `#69AAAF` |
| Body text | ⚠ insufficient contrast (2.1:1) — decorative use only |
| Accent glow | `rgba(157,201,195,0.26)` |
| Atmosphere | `rgba(157,201,195,0.10)` |
---

## Pastel Blush

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E9D9C8` | L≈0.71 |
| Light Mid | `#E4A489` | L≈0.45 |
| Mid | `#9B9F91` | L≈0.34 |
| Dark Mid | `#A6844E` | L≈0.25 |
| Darkest | `#BC6C54` | L≈0.22 |
| Deep | `#3E4C54` | L≈0.07 |

| Role | Value |
|---|---|
| Base | `#E9D9C8` |
| Second tone (decorative only) | `#E4A489` |
| Accent (decorative only) | `#9B9F91` |
| Accent (decorative only) | `#A6844E` |
| Accent (decorative only) | `#BC6C54` |
| **Text + CTA button** | `#3E4C54` |
| **Body text hex** | `#3E4C54` (6.4:1 on base ✓) |
| **CTA text** | `#E9D9C8` (6.4:1 on `#3E4C54` ✓) |
| Accent glow | `rgba(166,132,78,0.26)` |
| Atmosphere | `rgba(166,132,78,0.10)` |
---

## Meadows

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E6F0F1` | L≈0.85 |
| Light Mid | `#ECCCBC` | L≈0.65 |
| Mid | `#B6A8D0` | L≈0.43 |
| Dark Mid | `#D48A93` | L≈0.34 |
| Darkest | `#846CAC` | L≈0.19 |

| Role | Value |
|---|---|
| Base | `#E6F0F1` |
| Second tone (decorative only) | `#ECCCBC` |
| Accent (decorative only) | `#B6A8D0` |
| Accent (decorative only) | `#D48A93` |
| **Text + CTA button** | `#846CAC` |
| **Body text hex** | `#846CAC` (3.8:1 — large text only) |
| **CTA text** | `#E6F0F1` (3.8:1 — large text only) |
| Accent glow | `rgba(182,168,208,0.26)` |
| Atmosphere | `rgba(182,168,208,0.10)` |
---

## Blushwave

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FECB00` | L≈0.64 |
| Light Mid | `#71C7FE` | L≈0.52 |
| Mid | `#F09FC2` | L≈0.47 |
| Dark Mid | `#D86897` | L≈0.27 |
| Darkest | `#F71941` | L≈0.21 |
| Deep | `#675F61` | L≈0.12 |

| Role | Value |
|---|---|
| Base | `#FECB00` |
| Second tone (decorative only) | `#71C7FE` |
| Accent (decorative only) | `#F09FC2` |
| Accent (decorative only) | `#D86897` |
| Accent (decorative only) | `#F71941` |
| **Text + CTA button** | `#675F61` |
| **Body text hex** | `#675F61` (4.1:1 — large text only) |
| **CTA text** | `#FECB00` (4.1:1 — large text only) |
| Accent glow | `rgba(216,104,151,0.26)` |
| Atmosphere | `rgba(216,104,151,0.10)` |
---

## Rosewater

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#EEF1F8` | L≈0.88 |
| Light Mid | `#A1C3E7` | L≈0.52 |
| Mid | `#F6A0AC` | L≈0.48 |
| Dark Mid | `#D99BD8` | L≈0.43 |
| Darkest | `#E47C9C` | L≈0.33 |
| Deep | `#908DCE` | L≈0.29 |

| Role | Value |
|---|---|
| Base | `#EEF1F8` |
| Second tone (decorative only) | `#A1C3E7` |
| Accent (decorative only) | `#F6A0AC` |
| Accent (decorative only) | `#D99BD8` |
| Accent (decorative only) | `#E47C9C` |
| **Text + CTA button** | `#908DCE` |
| Body text | ⚠ insufficient contrast (2.7:1) — decorative use only |
| Accent glow | `rgba(217,155,216,0.26)` |
| Atmosphere | `rgba(217,155,216,0.10)` |
---

## Petals

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FCCB96` | L≈0.66 |
| Light Mid | `#F5B3F1` | L≈0.58 |
| Mid | `#FF9A59` | L≈0.45 |
| Dark Mid | `#E286D3` | L≈0.38 |
| Darkest | `#F77E48` | L≈0.35 |
| Deep | `#D34D85` | L≈0.21 |

| Role | Value |
|---|---|
| Base | `#FCCB96` |
| Second tone (decorative only) | `#F5B3F1` |
| Accent (decorative only) | `#FF9A59` |
| Accent (decorative only) | `#E286D3` |
| Accent (decorative only) | `#F77E48` |
| **Text + CTA button** | `#D34D85` |
| Body text | ⚠ insufficient contrast (2.7:1) — decorative use only |
| Accent glow | `rgba(226,134,211,0.26)` |
| Atmosphere | `rgba(226,134,211,0.10)` |
---

## Sorbet Sky

**Theme:** Mid — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#CCB9AC` | L≈0.51 |
| Light Mid | `#E88914` | L≈0.35 |
| Mid | `#DD72A9` | L≈0.30 |
| Dark Mid | `#DA5C21` | L≈0.23 |
| Darkest | `#106EE2` | L≈0.17 |
| Deep | `#D4266D` | L≈0.16 |

| Role | Value |
|---|---|
| Base | `#CCB9AC` |
| Second tone (decorative only) | `#E88914` |
| Accent (decorative only) | `#DD72A9` |
| Accent (decorative only) | `#DA5C21` |
| Accent (decorative only) | `#106EE2` |
| **Text + CTA button** | `#D4266D` |
| Body text | ⚠ insufficient contrast (2.6:1) — decorative use only |
| Accent glow | `rgba(218,92,33,0.26)` |
| Atmosphere | `rgba(218,92,33,0.10)` |
---

## Zephyr

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F5F1FA` | L≈0.89 |
| Light Mid | `#FBB7B7` | L≈0.58 |
| Mid | `#A0A095` | L≈0.35 |
| Dark Mid | `#A698C2` | L≈0.34 |
| Darkest | `#DE7A38` | L≈0.30 |

| Role | Value |
|---|---|
| Base | `#F5F1FA` |
| Second tone (decorative only) | `#FBB7B7` |
| Accent (decorative only) | `#A0A095` |
| Accent (decorative only) | `#A698C2` |
| **Text + CTA button** | `#DE7A38` |
| Body text | ⚠ insufficient contrast (2.7:1) — decorative use only |
| Accent glow | `rgba(160,160,149,0.26)` |
| Atmosphere | `rgba(160,160,149,0.10)` |
---

## Soft Tears

**Theme:** Light — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#ECE9E6` | L≈0.82 |
| Light Mid | `#C1CBCA` | L≈0.58 |
| Mid | `#9F97B8` | L≈0.33 |
| Dark Mid | `#3030CF` | L≈0.07 |
| Darkest | `#39445B` | L≈0.06 |

| Role | Value |
|---|---|
| Base | `#ECE9E6` |
| Second tone (decorative only) | `#C1CBCA` |
| Accent (decorative only) | `#9F97B8` |
| Accent (decorative only) | `#3030CF` |
| **Text + CTA button** | `#39445B` |
| **Body text hex** | `#39445B` (8.1:1 on base ✓) |
| **CTA text** | `#ECE9E6` (8.1:1 on `#39445B` ✓) |
| Accent glow | `rgba(159,151,184,0.26)` |
| Atmosphere | `rgba(159,151,184,0.10)` |
---

## Sorbet

**Theme:** Light — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FEFEFE` | L≈0.99 |
| Light Mid | `#EDECEC` | L≈0.84 |
| Mid | `#E0E7D7` | L≈0.78 |
| Dark Mid | `#CCCCCC` | L≈0.60 |
| Darkest | `#B7C396` | L≈0.51 |
| Deep | `#BA9A91` | L≈0.36 |

| Role | Value |
|---|---|
| Base | `#FEFEFE` |
| Second tone (decorative only) | `#EDECEC` |
| Accent (decorative only) | `#E0E7D7` |
| Accent (decorative only) | `#CCCCCC` |
| Accent (decorative only) | `#B7C396` |
| **Text + CTA button** | `#BA9A91` |
| Body text | ⚠ insufficient contrast (2.6:1) — decorative use only |
| Accent glow | `rgba(204,204,204,0.26)` |
| Atmosphere | `rgba(204,204,204,0.10)` |
---

## Opaline

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F4F4F6` | L≈0.91 |
| Light Mid | `#E7E7E7` | L≈0.80 |
| Dark Mid | `#D2D2D4` | L≈0.65 |
| Darkest | `#FF634A` | L≈0.31 |

| Role | Value |
|---|---|
| Base | `#F4F4F6` |
| Second tone (decorative only) | `#E7E7E7` |
| Accent (decorative only) | `#D2D2D4` |
| **Text + CTA button** | `#FF634A` |
| Body text | ⚠ insufficient contrast (2.7:1) — decorative use only |
| Accent glow | `rgba(210,210,212,0.26)` |
| Atmosphere | `rgba(210,210,212,0.10)` |
---

## Calm blue

**Theme:** Mid — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#90D5FF` | L≈0.61 |
| Light Mid | `#57B9FF` | L≈0.44 |
| Dark Mid | `#77B1D4` | L≈0.40 |
| Darkest | `#517891` | L≈0.17 |

| Role | Value |
|---|---|
| Base | `#90D5FF` |
| Second tone (decorative only) | `#57B9FF` |
| Accent (decorative only) | `#77B1D4` |
| **Text + CTA button** | `#517891` |
| Body text | ⚠ insufficient contrast (3.0:1) — decorative use only |
| Accent glow | `rgba(119,177,212,0.26)` |
| Atmosphere | `rgba(119,177,212,0.10)` |
---

## Rose Petals

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#DBB2B9` | L≈0.50 |
| Light Mid | `#FF8DA1` | L≈0.43 |
| Dark Mid | `#8A4C57` | L≈0.11 |
| Darkest | `#61212D` | L≈0.04 |

| Role | Value |
|---|---|
| Base | `#DBB2B9` |
| Second tone (decorative only) | `#FF8DA1` |
| Accent (decorative only) | `#8A4C57` |
| **Text + CTA button** | `#61212D` |
| **Body text hex** | `#61212D` (6.3:1 on base ✓) |
| **CTA text** | `#DBB2B9` (6.3:1 on `#61212D` ✓) |
| Accent glow | `rgba(138,76,87,0.26)` |
| Atmosphere | `rgba(138,76,87,0.10)` |
---

## Watermelon Candy

**Theme:** Light — **Use for:** confectionery, gifting, playful lifestyle, children

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#66FFED` | L≈0.80 |
| Light Mid | `#FFC7D1` | L≈0.67 |
| Dark Mid | `#95E082` | L≈0.61 |
| Darkest | `#FF8DA1` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#66FFED` |
| Second tone (decorative only) | `#FFC7D1` |
| Accent (decorative only) | `#95E082` |
| **Text + CTA button** | `#FF8DA1` |
| Body text | ⚠ insufficient contrast (1.8:1) — decorative use only |
| Accent glow | `rgba(149,224,130,0.26)` |
| Atmosphere | `rgba(149,224,130,0.10)` |
---

## Hydrangea

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFC2BA` | L≈0.63 |
| Light Mid | `#FF9CE9` | L≈0.51 |
| Dark Mid | `#FF8DA1` | L≈0.43 |
| Darkest | `#AD56C4` | L≈0.20 |

| Role | Value |
|---|---|
| Base | `#FFC2BA` |
| Second tone (decorative only) | `#FF9CE9` |
| Accent (decorative only) | `#FF8DA1` |
| **Text + CTA button** | `#AD56C4` |
| Body text | ⚠ insufficient contrast (2.8:1) — decorative use only |
| Accent glow | `rgba(255,141,161,0.26)` |
| Atmosphere | `rgba(255,141,161,0.10)` |
---

## Cherry Blossom

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#C2FFB5` | L≈0.86 |
| Light Mid | `#FFB5C0` | L≈0.58 |
| Dark Mid | `#4B8067` | L≈0.18 |
| Darkest | `#804B53` | L≈0.10 |

| Role | Value |
|---|---|
| Base | `#C2FFB5` |
| Second tone (decorative only) | `#FFB5C0` |
| Accent (decorative only) | `#4B8067` |
| **Text + CTA button** | `#804B53` |
| **Body text hex** | `#804B53` (6.0:1 on base ✓) |
| **CTA text** | `#C2FFB5` (6.0:1 on `#804B53` ✓) |
| Accent glow | `rgba(75,128,103,0.26)` |
| Atmosphere | `rgba(75,128,103,0.10)` |
---

## Rococo Romance

**Theme:** Mid — **Use for:** luxury beauty, premium fashion, editorial

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F5C8B5` | L≈0.64 |
| Light Mid | `#F1B5FF` | L≈0.59 |
| Dark Mid | `#FFB5C0` | L≈0.58 |
| Darkest | `#FFA294` | L≈0.49 |

| Role | Value |
|---|---|
| Base | `#F5C8B5` |
| Second tone (decorative only) | `#F1B5FF` |
| Accent (decorative only) | `#FFB5C0` |
| **Text + CTA button** | `#FFA294` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(255,181,192,0.26)` |
| Atmosphere | `rgba(255,181,192,0.10)` |
---

## Promenade

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFFFC5` | L≈0.97 |
| Light Mid | `#F4C4FF` | L≈0.66 |
| Dark Mid | `#CEC4FF` | L≈0.60 |
| Darkest | `#754480` | L≈0.09 |

| Role | Value |
|---|---|
| Base | `#FFFFC5` |
| Second tone (decorative only) | `#F4C4FF` |
| Accent (decorative only) | `#CEC4FF` |
| **Text + CTA button** | `#754480` |
| **Body text hex** | `#754480` (7.0:1 on base ✓) |
| **CTA text** | `#FFFFC5` (7.0:1 on `#754480` ✓) |
| Accent glow | `rgba(206,196,255,0.26)` |
| Atmosphere | `rgba(206,196,255,0.10)` |
---

## Lavender Lilt

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#D3D3FF` | L≈0.68 |
| Light Mid | `#9D9DCC` | L≈0.36 |
| Dark Mid | `#575799` | L≈0.11 |
| Darkest | `#090933` | L≈0.00 |

| Role | Value |
|---|---|
| Base | `#D3D3FF` |
| Second tone (decorative only) | `#9D9DCC` |
| Accent (decorative only) | `#575799` |
| **Text + CTA button** | `#090933` |
| **Body text hex** | `#090933` (13.2:1 on base ✓) |
| **CTA text** | `#D3D3FF` (13.2:1 on `#090933` ✓) |
| Accent glow | `rgba(87,87,153,0.26)` |
| Atmosphere | `rgba(87,87,153,0.10)` |
---

## Ethereal Dawn

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFF9A3` | L≈0.92 |
| Light Mid | `#FFD87D` | L≈0.72 |
| Dark Mid | `#D3D3FF` | L≈0.68 |
| Darkest | `#807B3C` | L≈0.19 |

| Role | Value |
|---|---|
| Base | `#FFF9A3` |
| Second tone (decorative only) | `#FFD87D` |
| Accent (decorative only) | `#D3D3FF` |
| **Text + CTA button** | `#807B3C` |
| **Body text hex** | `#807B3C` (4.0:1 — large text only) |
| **CTA text** | `#FFF9A3` (4.0:1 — large text only) |
| Accent glow | `rgba(211,211,255,0.26)` |
| Atmosphere | `rgba(211,211,255,0.10)` |
---

## Charming Seaside

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#C9FDF2` | L≈0.89 |
| Light Mid | `#B6F2D1` | L≈0.78 |
| Dark Mid | `#B3EBF2` | L≈0.75 |
| Darkest | `#85D1DB` | L≈0.56 |

| Role | Value |
|---|---|
| Base | `#C9FDF2` |
| Second tone (decorative only) | `#B6F2D1` |
| Accent (decorative only) | `#B3EBF2` |
| **Text + CTA button** | `#85D1DB` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(179,235,242,0.26)` |
| Atmosphere | `rgba(179,235,242,0.10)` |
---

## Peach Skyline

**Theme:** Light — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#BAFFF5` | L≈0.89 |
| Light Mid | `#FFDBBB` | L≈0.76 |
| Dark Mid | `#BADDFF` | L≈0.69 |
| Darkest | `#496580` | L≈0.12 |

| Role | Value |
|---|---|
| Base | `#BAFFF5` |
| Second tone (decorative only) | `#FFDBBB` |
| Accent (decorative only) | `#BADDFF` |
| **Text + CTA button** | `#496580` |
| **Body text hex** | `#496580` (5.4:1 on base ✓) |
| **CTA text** | `#BAFFF5` (5.4:1 on `#496580` ✓) |
| Accent glow | `rgba(186,221,255,0.26)` |
| Atmosphere | `rgba(186,221,255,0.10)` |
---

## Subtle Blush

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFDBBB` | L≈0.76 |
| Light Mid | `#FFB0A6` | L≈0.55 |
| Dark Mid | `#E0B672` | L≈0.51 |
| Darkest | `#CC8A6E` | L≈0.32 |

| Role | Value |
|---|---|
| Base | `#FFDBBB` |
| Second tone (decorative only) | `#FFB0A6` |
| Accent (decorative only) | `#E0B672` |
| **Text + CTA button** | `#CC8A6E` |
| Body text | ⚠ insufficient contrast (2.2:1) — decorative use only |
| Accent glow | `rgba(224,182,114,0.26)` |
| Atmosphere | `rgba(224,182,114,0.10)` |
---

## Lavender Fields

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FDFBD4` | L≈0.95 |
| Light Mid | `#C1BFFF` | L≈0.56 |
| Dark Mid | `#BDB96A` | L≈0.47 |
| Darkest | `#CF6DFC` | L≈0.31 |

| Role | Value |
|---|---|
| Base | `#FDFBD4` |
| Second tone (decorative only) | `#C1BFFF` |
| Accent (decorative only) | `#BDB96A` |
| **Text + CTA button** | `#CF6DFC` |
| Body text | ⚠ insufficient contrast (2.7:1) — decorative use only |
| Accent glow | `rgba(189,185,106,0.26)` |
| Atmosphere | `rgba(189,185,106,0.10)` |
---

## Lilac Dreams

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFADFF` | L≈0.58 |
| Light Mid | `#DAB1DA` | L≈0.51 |
| Dark Mid | `#733B73` | L≈0.08 |
| Darkest | `#5E095E` | L≈0.03 |

| Role | Value |
|---|---|
| Base | `#FFADFF` |
| Second tone (decorative only) | `#DAB1DA` |
| Accent (decorative only) | `#733B73` |
| **Text + CTA button** | `#5E095E` |
| **Body text hex** | `#5E095E` (7.6:1 on base ✓) |
| **CTA text** | `#FFADFF` (7.6:1 on `#5E095E` ✓) |
| Accent glow | `rgba(115,59,115,0.26)` |
| Atmosphere | `rgba(115,59,115,0.10)` |
---

## Enigma

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#BED966` | L≈0.62 |
| Light Mid | `#8DD691` | L≈0.56 |
| Dark Mid | `#DAB1DA` | L≈0.51 |
| Darkest | `#2C592E` | L≈0.08 |

| Role | Value |
|---|---|
| Base | `#BED966` |
| Second tone (decorative only) | `#8DD691` |
| Accent (decorative only) | `#DAB1DA` |
| **Text + CTA button** | `#2C592E` |
| **Body text hex** | `#2C592E` (5.2:1 on base ✓) |
| **CTA text** | `#BED966` (5.2:1 on `#2C592E` ✓) |
| Accent glow | `rgba(218,177,218,0.26)` |
| Atmosphere | `rgba(218,177,218,0.10)` |
---

## Flirty

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#DAB1DA` | L≈0.51 |
| Light Mid | `#D991AE` | L≈0.38 |
| Dark Mid | `#B09AD9` | L≈0.37 |
| Darkest | `#D97068` | L≈0.27 |

| Role | Value |
|---|---|
| Base | `#DAB1DA` |
| Second tone (decorative only) | `#D991AE` |
| Accent (decorative only) | `#B09AD9` |
| **Text + CTA button** | `#D97068` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(176,154,217,0.26)` |
| Atmosphere | `rgba(176,154,217,0.10)` |
---

## Sunny Lilac

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFF88F` | L≈0.90 |
| Light Mid | `#F7D78D` | L≈0.70 |
| Dark Mid | `#CCCCFF` | L≈0.63 |
| Darkest | `#8F8FBF` | L≈0.29 |

| Role | Value |
|---|---|
| Base | `#FFF88F` |
| Second tone (decorative only) | `#F7D78D` |
| Accent (decorative only) | `#CCCCFF` |
| **Text + CTA button** | `#8F8FBF` |
| Body text | ⚠ insufficient contrast (2.8:1) — decorative use only |
| Accent glow | `rgba(204,204,255,0.26)` |
| Atmosphere | `rgba(204,204,255,0.10)` |
---

## Cotton Candy

**Theme:** Mid — **Use for:** confectionery, gifting, playful lifestyle, children

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E3A1CD` | L≈0.46 |
| Light Mid | `#A47DAB` | L≈0.26 |
| Dark Mid | `#8776CC` | L≈0.22 |
| Darkest | `#8A65AD` | L≈0.18 |

| Role | Value |
|---|---|
| Base | `#E3A1CD` |
| Second tone (decorative only) | `#A47DAB` |
| Accent (decorative only) | `#8776CC` |
| **Text + CTA button** | `#8A65AD` |
| Body text | ⚠ insufficient contrast (2.3:1) — decorative use only |
| Accent glow | `rgba(135,118,204,0.26)` |
| Atmosphere | `rgba(135,118,204,0.10)` |
---

## Tea Party

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#D2FFC4` | L≈0.89 |
| Light Mid | `#ADFFF5` | L≈0.87 |
| Dark Mid | `#FFC5D3` | L≈0.66 |
| Darkest | `#448061` | L≈0.18 |

| Role | Value |
|---|---|
| Base | `#D2FFC4` |
| Second tone (decorative only) | `#ADFFF5` |
| Accent (decorative only) | `#FFC5D3` |
| **Text + CTA button** | `#448061` |
| **Body text hex** | `#448061` (4.2:1 — large text only) |
| **CTA text** | `#D2FFC4` (4.2:1 — large text only) |
| Accent glow | `rgba(255,197,211,0.26)` |
| Atmosphere | `rgba(255,197,211,0.10)` |
---

## Pink Lemonade

**Theme:** Mid — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFC5D3` | L≈0.66 |
| Light Mid | `#FFA3DD` | L≈0.53 |
| Dark Mid | `#FF8375` | L≈0.39 |
| Darkest | `#ED6F3E` | L≈0.30 |

| Role | Value |
|---|---|
| Base | `#FFC5D3` |
| Second tone (decorative only) | `#FFA3DD` |
| Accent (decorative only) | `#FF8375` |
| **Text + CTA button** | `#ED6F3E` |
| Body text | ⚠ insufficient contrast (2.0:1) — decorative use only |
| Accent glow | `rgba(255,131,117,0.26)` |
| Atmosphere | `rgba(255,131,117,0.10)` |
---

## Pressed Flowers

**Theme:** Light — **Use for:** seasonal campaigns, fresh produce, floristry

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD6D6` | L≈0.74 |
| Light Mid | `#DCA1A1` | L≈0.43 |
| Dark Mid | `#825656` | L≈0.12 |
| Darkest | `#3D1D1D` | L≈0.02 |

| Role | Value |
|---|---|
| Base | `#FFD6D6` |
| Second tone (decorative only) | `#DCA1A1` |
| Accent (decorative only) | `#825656` |
| **Text + CTA button** | `#3D1D1D` |
| **Body text hex** | `#3D1D1D` (11.4:1 on base ✓) |
| **CTA text** | `#FFD6D6` (11.4:1 on `#3D1D1D` ✓) |
| Accent glow | `rgba(130,86,86,0.26)` |
| Atmosphere | `rgba(130,86,86,0.10)` |
---

## Peonies

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD9D9` | L≈0.76 |
| Light Mid | `#9AE3C7` | L≈0.66 |
| Dark Mid | `#84C77F` | L≈0.47 |
| Darkest | `#DCA1A1` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#FFD9D9` |
| Second tone (decorative only) | `#9AE3C7` |
| Accent (decorative only) | `#84C77F` |
| **Text + CTA button** | `#DCA1A1` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(132,199,127,0.26)` |
| Atmosphere | `rgba(132,199,127,0.10)` |
---

## Grape Milkshake

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E0AFFF` | L≈0.54 |
| Light Mid | `#C197DB` | L≈0.39 |
| Dark Mid | `#795F8A` | L≈0.14 |
| Darkest | `#4B2861` | L≈0.04 |

| Role | Value |
|---|---|
| Base | `#E0AFFF` |
| Second tone (decorative only) | `#C197DB` |
| Accent (decorative only) | `#795F8A` |
| **Text + CTA button** | `#4B2861` |
| **Body text hex** | `#4B2861` (6.6:1 on base ✓) |
| **CTA text** | `#E0AFFF` (6.6:1 on `#4B2861` ✓) |
| Accent glow | `rgba(121,95,138,0.26)` |
| Atmosphere | `rgba(121,95,138,0.10)` |
---

## Wisteria Lane

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F0D9FF` | L≈0.75 |
| Light Mid | `#E2DD9C` | L≈0.70 |
| Dark Mid | `#E0AFFF` | L≈0.54 |
| Darkest | `#A1C588` | L≈0.49 |

| Role | Value |
|---|---|
| Base | `#F0D9FF` |
| Second tone (decorative only) | `#E2DD9C` |
| Accent (decorative only) | `#E0AFFF` |
| **Text + CTA button** | `#A1C588` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(224,175,255,0.26)` |
| Atmosphere | `rgba(224,175,255,0.10)` |
---

## Jelly Shoes

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#C4D6FF` | L≈0.67 |
| Light Mid | `#E0AFFF` | L≈0.54 |
| Dark Mid | `#DD68E3` | L≈0.31 |
| Darkest | `#8866DE` | L≈0.20 |

| Role | Value |
|---|---|
| Base | `#C4D6FF` |
| Second tone (decorative only) | `#E0AFFF` |
| Accent (decorative only) | `#DD68E3` |
| **Text + CTA button** | `#8866DE` |
| Body text | ⚠ insufficient contrast (2.9:1) — decorative use only |
| Accent glow | `rgba(221,104,227,0.26)` |
| Atmosphere | `rgba(221,104,227,0.10)` |
---

## Watercolor Wisp

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#8FFFB0` | L≈0.80 |
| Light Mid | `#FFD3C9` | L≈0.72 |
| Dark Mid | `#92DEDC` | L≈0.64 |
| Darkest | `#DEA193` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#8FFFB0` |
| Second tone (decorative only) | `#FFD3C9` |
| Accent (decorative only) | `#92DEDC` |
| **Text + CTA button** | `#DEA193` |
| Body text | ⚠ insufficient contrast (1.8:1) — decorative use only |
| Accent glow | `rgba(146,222,220,0.26)` |
| Atmosphere | `rgba(146,222,220,0.10)` |
---

## Ballet Slippers

**Theme:** Light — **Use for:** luxury beauty, premium fashion, editorial

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD2B8` | L≈0.71 |
| Light Mid | `#E0BA8D` | L≈0.53 |
| Dark Mid | `#DEA193` | L≈0.43 |
| Darkest | `#DE7E7C` | L≈0.32 |

| Role | Value |
|---|---|
| Base | `#FFD2B8` |
| Second tone (decorative only) | `#E0BA8D` |
| Accent (decorative only) | `#DEA193` |
| **Text + CTA button** | `#DE7E7C` |
| Body text | ⚠ insufficient contrast (2.1:1) — decorative use only |
| Accent glow | `rgba(222,161,147,0.26)` |
| Atmosphere | `rgba(222,161,147,0.10)` |
---

## Spring Flowers

**Theme:** Mid — **Use for:** seasonal campaigns, fresh produce, floristry

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#88E788` | L≈0.64 |
| Light Mid | `#E7B788` | L≈0.53 |
| Dark Mid | `#88B7E7` | L≈0.45 |
| Darkest | `#E788E7` | L≈0.40 |

| Role | Value |
|---|---|
| Base | `#88E788` |
| Second tone (decorative only) | `#E7B788` |
| Accent (decorative only) | `#88B7E7` |
| **Text + CTA button** | `#E788E7` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(136,183,231,0.26)` |
| Atmosphere | `rgba(136,183,231,0.10)` |
---

## Fresh Start

**Theme:** Light — **Use for:** seasonal campaigns, fresh produce, floristry

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#A1FFC0` | L≈0.83 |
| Light Mid | `#D2E861` | L≈0.72 |
| Dark Mid | `#88E788` | L≈0.64 |
| Darkest | `#51E8B8` | L≈0.63 |

| Role | Value |
|---|---|
| Base | `#A1FFC0` |
| Second tone (decorative only) | `#D2E861` |
| Accent (decorative only) | `#88E788` |
| **Text + CTA button** | `#51E8B8` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(136,231,136,0.26)` |
| Atmosphere | `rgba(136,231,136,0.10)` |
---

## Country Garden

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFFFE3` | L≈0.98 |
| Light Mid | `#DBD4FF` | L≈0.69 |
| Dark Mid | `#808034` | L≈0.20 |
| Darkest | `#723480` | L≈0.08 |

| Role | Value |
|---|---|
| Base | `#FFFFE3` |
| Second tone (decorative only) | `#DBD4FF` |
| Accent (decorative only) | `#808034` |
| **Text + CTA button** | `#723480` |
| **Body text hex** | `#723480` (8.2:1 on base ✓) |
| **CTA text** | `#FFFFE3` (8.2:1 on `#723480` ✓) |
| Accent glow | `rgba(128,128,52,0.26)` |
| Atmosphere | `rgba(128,128,52,0.10)` |
---

## Purple Rain

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E4F0C0` | L≈0.83 |
| Light Mid | `#DFCBEB` | L≈0.64 |
| Dark Mid | `#BBB791` | L≈0.46 |
| Darkest | `#7A4179` | L≈0.09 |

| Role | Value |
|---|---|
| Base | `#E4F0C0` |
| Second tone (decorative only) | `#DFCBEB` |
| Accent (decorative only) | `#BBB791` |
| **Text + CTA button** | `#7A4179` |
| **Body text hex** | `#7A4179` (6.1:1 on base ✓) |
| **CTA text** | `#E4F0C0` (6.1:1 on `#7A4179` ✓) |
| Accent glow | `rgba(187,183,145,0.26)` |
| Atmosphere | `rgba(187,183,145,0.10)` |
---

## Chalkboard

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD5CC` | L≈0.73 |
| Light Mid | `#D3D3D3` | L≈0.65 |
| Dark Mid | `#ADCCA3` | L≈0.55 |
| Darkest | `#C7A3CC` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#FFD5CC` |
| Second tone (decorative only) | `#D3D3D3` |
| Accent (decorative only) | `#ADCCA3` |
| **Text + CTA button** | `#C7A3CC` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(173,204,163,0.26)` |
| Atmosphere | `rgba(173,204,163,0.10)` |
---

## Morning Pasture

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#80FFDB` | L≈0.81 |
| Light Mid | `#80D0FF` | L≈0.57 |
| Dark Mid | `#FFB27F` | L≈0.55 |
| Darkest | `#807066` | L≈0.17 |

| Role | Value |
|---|---|
| Base | `#80FFDB` |
| Second tone (decorative only) | `#80D0FF` |
| Accent (decorative only) | `#FFB27F` |
| **Text + CTA button** | `#807066` |
| **Body text hex** | `#807066` (3.9:1 — large text only) |
| **CTA text** | `#80FFDB` (3.9:1 — large text only) |
| Accent glow | `rgba(255,178,127,0.26)` |
| Atmosphere | `rgba(255,178,127,0.10)` |
---

## Ballerina

**Theme:** Mid — **Use for:** luxury beauty, premium fashion, editorial

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E89EB8` | L≈0.45 |
| Light Mid | `#C4869C` | L≈0.31 |
| Dark Mid | `#734E5B` | L≈0.10 |
| Darkest | `#4A323B` | L≈0.04 |

| Role | Value |
|---|---|
| Base | `#E89EB8` |
| Second tone (decorative only) | `#C4869C` |
| Accent (decorative only) | `#734E5B` |
| **Text + CTA button** | `#4A323B` |
| **Body text hex** | `#4A323B` (5.5:1 on base ✓) |
| **CTA text** | `#E89EB8` (5.5:1 on `#4A323B` ✓) |
| Accent glow | `rgba(115,78,91,0.26)` |
| Atmosphere | `rgba(115,78,91,0.10)` |
---

## Garden Gala

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFDBE8` | L≈0.78 |
| Light Mid | `#9FF5C3` | L≈0.77 |
| Dark Mid | `#92D175` | L≈0.53 |
| Darkest | `#E89EB8` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#FFDBE8` |
| Second tone (decorative only) | `#9FF5C3` |
| Accent (decorative only) | `#92D175` |
| **Text + CTA button** | `#E89EB8` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(146,209,117,0.26)` |
| Atmosphere | `rgba(146,209,117,0.10)` |
---

## Spring Fling

**Theme:** Mid — **Use for:** seasonal campaigns, fresh produce, floristry

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFCBBA` | L≈0.68 |
| Light Mid | `#FFADFB` | L≈0.58 |
| Dark Mid | `#E89EB8` | L≈0.45 |
| Darkest | `#C779E8` | L≈0.32 |

| Role | Value |
|---|---|
| Base | `#FFCBBA` |
| Second tone (decorative only) | `#FFADFB` |
| Accent (decorative only) | `#E89EB8` |
| **Text + CTA button** | `#C779E8` |
| Body text | ⚠ insufficient contrast (2.0:1) — decorative use only |
| Accent glow | `rgba(232,158,184,0.26)` |
| Atmosphere | `rgba(232,158,184,0.10)` |
---

## Soft Spring

**Theme:** Mid — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#85DECB` | L≈0.62 |
| Light Mid | `#88CFA8` | L≈0.53 |
| Dark Mid | `#90B8D6` | L≈0.45 |
| Darkest | `#6395EE` | L≈0.30 |

| Role | Value |
|---|---|
| Base | `#85DECB` |
| Second tone (decorative only) | `#88CFA8` |
| Accent (decorative only) | `#90B8D6` |
| **Text + CTA button** | `#6395EE` |
| Body text | ⚠ insufficient contrast (1.9:1) — decorative use only |
| Accent glow | `rgba(144,184,214,0.26)` |
| Atmosphere | `rgba(144,184,214,0.10)` |
---

## Florist

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#B2FFA6` | L≈0.84 |
| Light Mid | `#FFBDC2` | L≈0.62 |
| Dark Mid | `#4DD69D` | L≈0.52 |
| Darkest | `#FF7782` | L≈0.36 |

| Role | Value |
|---|---|
| Base | `#B2FFA6` |
| Second tone (decorative only) | `#FFBDC2` |
| Accent (decorative only) | `#4DD69D` |
| **Text + CTA button** | `#FF7782` |
| Body text | ⚠ insufficient contrast (2.2:1) — decorative use only |
| Accent glow | `rgba(77,214,157,0.26)` |
| Atmosphere | `rgba(77,214,157,0.10)` |
---

## Minty Fresh

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#BFFFED` | L≈0.89 |
| Light Mid | `#98FBCB` | L≈0.80 |
| Dark Mid | `#7FCFA8` | L≈0.52 |
| Darkest | `#558B71` | L≈0.22 |

| Role | Value |
|---|---|
| Base | `#BFFFED` |
| Second tone (decorative only) | `#98FBCB` |
| Accent (decorative only) | `#7FCFA8` |
| **Text + CTA button** | `#558B71` |
| **Body text hex** | `#558B71` (3.5:1 — large text only) |
| **CTA text** | `#BFFFED` (3.5:1 — large text only) |
| Accent glow | `rgba(127,207,168,0.26)` |
| Atmosphere | `rgba(127,207,168,0.10)` |
---

## Garden Fresco

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#98FBCB` | L≈0.80 |
| Light Mid | `#FAB598` | L≈0.56 |
| Dark Mid | `#FA98AB` | L≈0.46 |
| Darkest | `#547A68` | L≈0.17 |

| Role | Value |
|---|---|
| Base | `#98FBCB` |
| Second tone (decorative only) | `#FAB598` |
| Accent (decorative only) | `#FA98AB` |
| **Text + CTA button** | `#547A68` |
| **Body text hex** | `#547A68` (3.9:1 — large text only) |
| **CTA text** | `#98FBCB` (3.9:1 — large text only) |
| Accent glow | `rgba(250,152,171,0.26)` |
| Atmosphere | `rgba(250,152,171,0.10)` |
---

## Whimsy And Wonder

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#98FBCB` | L≈0.80 |
| Light Mid | `#89E099` | L≈0.61 |
| Dark Mid | `#48E0CA` | L≈0.59 |
| Darkest | `#6EC1D4` | L≈0.46 |

| Role | Value |
|---|---|
| Base | `#98FBCB` |
| Second tone (decorative only) | `#89E099` |
| Accent (decorative only) | `#48E0CA` |
| **Text + CTA button** | `#6EC1D4` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(72,224,202,0.26)` |
| Atmosphere | `rgba(72,224,202,0.10)` |
---

## Victorian Rose

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E491A6` | L≈0.39 |
| Light Mid | `#BF7A8C` | L≈0.27 |
| Dark Mid | `#96384F` | L≈0.10 |
| Darkest | `#450C1B` | L≈0.02 |

| Role | Value |
|---|---|
| Base | `#E491A6` |
| Second tone (decorative only) | `#BF7A8C` |
| Accent (decorative only) | `#96384F` |
| **Text + CTA button** | `#450C1B` |
| **Body text hex** | `#450C1B` (6.7:1 on base ✓) |
| **CTA text** | `#E491A6` (6.7:1 on `#450C1B` ✓) |
| Accent glow | `rgba(150,56,79,0.26)` |
| Atmosphere | `rgba(150,56,79,0.10)` |
---

## Aphrodite

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#E491A6` | L≈0.39 |
| Light Mid | `#1FBF1D` | L≈0.38 |
| Dark Mid | `#FF7E70` | L≈0.37 |
| Darkest | `#DB6EFF` | L≈0.33 |

| Role | Value |
|---|---|
| Base | `#E491A6` |
| Second tone (decorative only) | `#1FBF1D` |
| Accent (decorative only) | `#FF7E70` |
| **Text + CTA button** | `#DB6EFF` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(255,126,112,0.26)` |
| Atmosphere | `rgba(255,126,112,0.10)` |
---

## Salt Lake

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#C4EDED` | L≈0.78 |
| Light Mid | `#FFCAAB` | L≈0.66 |
| Dark Mid | `#8DDCDC` | L≈0.62 |
| Darkest | `#E3905F` | L≈0.37 |

| Role | Value |
|---|---|
| Base | `#C4EDED` |
| Second tone (decorative only) | `#FFCAAB` |
| Accent (decorative only) | `#8DDCDC` |
| **Text + CTA button** | `#E3905F` |
| Body text | ⚠ insufficient contrast (2.0:1) — decorative use only |
| Accent glow | `rgba(141,220,220,0.26)` |
| Atmosphere | `rgba(141,220,220,0.10)` |
---

## Zephyr

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#97FCE7` | L≈0.82 |
| Light Mid | `#B8E3E9` | L≈0.71 |
| Dark Mid | `#7DE8AD` | L≈0.65 |
| Darkest | `#74B6E8` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#97FCE7` |
| Second tone (decorative only) | `#B8E3E9` |
| Accent (decorative only) | `#7DE8AD` |
| **Text + CTA button** | `#74B6E8` |
| Body text | ⚠ insufficient contrast (1.8:1) — decorative use only |
| Accent glow | `rgba(125,232,173,0.26)` |
| Atmosphere | `rgba(125,232,173,0.10)` |
---

## Mint Julep

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F1FFBF` | L≈0.94 |
| Light Mid | `#A8DCAB` | L≈0.62 |
| Dark Mid | `#91BEA2` | L≈0.45 |
| Darkest | `#88A27B` | L≈0.33 |

| Role | Value |
|---|---|
| Base | `#F1FFBF` |
| Second tone (decorative only) | `#A8DCAB` |
| Accent (decorative only) | `#91BEA2` |
| **Text + CTA button** | `#88A27B` |
| Body text | ⚠ insufficient contrast (2.6:1) — decorative use only |
| Accent glow | `rgba(145,190,162,0.26)` |
| Atmosphere | `rgba(145,190,162,0.10)` |
---

## Soft Whisper

**Theme:** Mid — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#B5C7EB` | L≈0.57 |
| Light Mid | `#94AEE3` | L≈0.42 |
| Dark Mid | `#94A3C0` | L≈0.36 |
| Darkest | `#60697C` | L≈0.14 |

| Role | Value |
|---|---|
| Base | `#B5C7EB` |
| Second tone (decorative only) | `#94AEE3` |
| Accent (decorative only) | `#94A3C0` |
| **Text + CTA button** | `#60697C` |
| **Body text hex** | `#60697C` (3.2:1 — large text only) |
| **CTA text** | `#B5C7EB` (3.2:1 — large text only) |
| Accent glow | `rgba(148,163,192,0.26)` |
| Atmosphere | `rgba(148,163,192,0.10)` |
---

## Lavender Lullaby

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#9EF0FF` | L≈0.77 |
| Light Mid | `#B5C7EB` | L≈0.57 |
| Dark Mid | `#A4A5F5` | L≈0.41 |
| Darkest | `#8E70CF` | L≈0.22 |

| Role | Value |
|---|---|
| Base | `#9EF0FF` |
| Second tone (decorative only) | `#B5C7EB` |
| Accent (decorative only) | `#A4A5F5` |
| **Text + CTA button** | `#8E70CF` |
| **Body text hex** | `#8E70CF` (3.0:1 — large text only) |
| **CTA text** | `#9EF0FF` (3.0:1 — large text only) |
| Accent glow | `rgba(164,165,245,0.26)` |
| Atmosphere | `rgba(164,165,245,0.10)` |
---

## Saltwater Pearl

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFF1E7` | L≈0.90 |
| Light Mid | `#F0DFB9` | L≈0.75 |
| Dark Mid | `#FFCA8A` | L≈0.65 |
| Darkest | `#FFB69E` | L≈0.57 |

| Role | Value |
|---|---|
| Base | `#FFF1E7` |
| Second tone (decorative only) | `#F0DFB9` |
| Accent (decorative only) | `#FFCA8A` |
| **Text + CTA button** | `#FFB69E` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(255,202,138,0.26)` |
| Atmosphere | `rgba(255,202,138,0.10)` |
---

## Precious Orchid

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#ED80E9` | L≈0.39 |
| Light Mid | `#C96DC6` | L≈0.27 |
| Dark Mid | `#784176` | L≈0.09 |
| Darkest | `#4F2B4E` | L≈0.04 |

| Role | Value |
|---|---|
| Base | `#ED80E9` |
| Second tone (decorative only) | `#C96DC6` |
| Accent (decorative only) | `#784176` |
| **Text + CTA button** | `#4F2B4E` |
| **Body text hex** | `#4F2B4E` (5.0:1 on base ✓) |
| **CTA text** | `#ED80E9` (5.0:1 on `#4F2B4E` ✓) |
| Accent glow | `rgba(120,65,118,0.26)` |
| Atmosphere | `rgba(120,65,118,0.10)` |
---

## Cupcake Frosting

**Theme:** Light — **Use for:** confectionery, gifting, playful lifestyle, children

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD9FE` | L≈0.78 |
| Light Mid | `#C9ED5C` | L≈0.74 |
| Dark Mid | `#80ED88` | L≈0.67 |
| Darkest | `#ED80E9` | L≈0.39 |

| Role | Value |
|---|---|
| Base | `#FFD9FE` |
| Second tone (decorative only) | `#C9ED5C` |
| Accent (decorative only) | `#80ED88` |
| **Text + CTA button** | `#ED80E9` |
| Body text | ⚠ insufficient contrast (1.9:1) — decorative use only |
| Accent glow | `rgba(128,237,136,0.26)` |
| Atmosphere | `rgba(128,237,136,0.10)` |
---

## Peony Passion

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#ED80E9` | L≈0.39 |
| Light Mid | `#E3827B` | L≈0.34 |
| Dark Mid | `#A479ED` | L≈0.28 |
| Darkest | `#A746D4` | L≈0.17 |

| Role | Value |
|---|---|
| Base | `#ED80E9` |
| Second tone (decorative only) | `#E3827B` |
| Accent (decorative only) | `#A479ED` |
| **Text + CTA button** | `#A746D4` |
| Body text | ⚠ insufficient contrast (2.0:1) — decorative use only |
| Accent glow | `rgba(164,121,237,0.26)` |
| Atmosphere | `rgba(164,121,237,0.10)` |
---

## Belle Rose

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD6D1` | L≈0.74 |
| Light Mid | `#E0A59D` | L≈0.45 |
| Dark Mid | `#94716C` | L≈0.19 |
| Darkest | `#57221B` | L≈0.03 |

| Role | Value |
|---|---|
| Base | `#FFD6D1` |
| Second tone (decorative only) | `#E0A59D` |
| Accent (decorative only) | `#94716C` |
| **Text + CTA button** | `#57221B` |
| **Body text hex** | `#57221B` (9.6:1 on base ✓) |
| **CTA text** | `#FFD6D1` (9.6:1 on `#57221B` ✓) |
| Accent glow | `rgba(148,113,108,0.26)` |
| Atmosphere | `rgba(148,113,108,0.10)` |
---

## Macaron

**Theme:** Light — **Use for:** confectionery, gifting, playful lifestyle, children

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#A8FFB7` | L≈0.83 |
| Light Mid | `#FFD6D1` | L≈0.74 |
| Dark Mid | `#6DD1C2` | L≈0.53 |
| Darkest | `#BA8E88` | L≈0.32 |

| Role | Value |
|---|---|
| Base | `#A8FFB7` |
| Second tone (decorative only) | `#FFD6D1` |
| Accent (decorative only) | `#6DD1C2` |
| **Text + CTA button** | `#BA8E88` |
| Body text | ⚠ insufficient contrast (2.4:1) — decorative use only |
| Accent glow | `rgba(109,209,194,0.26)` |
| Atmosphere | `rgba(109,209,194,0.10)` |
---

## Turkish Delight

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFD6D1` | L≈0.74 |
| Light Mid | `#FFBDA1` | L≈0.60 |
| Dark Mid | `#EDA4DE` | L≈0.50 |
| Darkest | `#E67088` | L≈0.30 |

| Role | Value |
|---|---|
| Base | `#FFD6D1` |
| Second tone (decorative only) | `#FFBDA1` |
| Accent (decorative only) | `#EDA4DE` |
| **Text + CTA button** | `#E67088` |
| Body text | ⚠ insufficient contrast (2.2:1) — decorative use only |
| Accent glow | `rgba(237,164,222,0.26)` |
| Atmosphere | `rgba(237,164,222,0.10)` |
---

## Lavender Clay

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#B1DAB1` | L≈0.63 |
| Light Mid | `#DAC5B1` | L≈0.58 |
| Dark Mid | `#B1C5DA` | L≈0.54 |
| Darkest | `#DAB1DA` | L≈0.51 |

| Role | Value |
|---|---|
| Base | `#B1DAB1` |
| Second tone (decorative only) | `#DAC5B1` |
| Accent (decorative only) | `#B1C5DA` |
| **Text + CTA button** | `#DAB1DA` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(177,197,218,0.26)` |
| Atmosphere | `rgba(177,197,218,0.10)` |
---

## Lilac Sunbeam

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFCC` | L≈0.97 |
| Dark | `#CCCCFF` | L≈0.63 |

| Role | Value |
|---|---|
| Base | `#FFFFCC` |
| **Text + CTA button** | `#CCCCFF` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(204,204,255,0.26)` |
| Atmosphere | `rgba(204,204,255,0.10)` |
---

## Glimmer Stones

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#E6FFCC` | L≈0.93 |
| Mid | `#FFE6CC` | L≈0.82 |
| Dark | `#CCCCFF` | L≈0.63 |

| Role | Value |
|---|---|
| Base | `#E6FFCC` |
| Accent (decorative only) | `#FFE6CC` |
| **Text + CTA button** | `#CCCCFF` |
| Body text | ⚠ insufficient contrast (1.4:1) — decorative use only |
| Accent glow | `rgba(255,230,204,0.26)` |
| Atmosphere | `rgba(255,230,204,0.10)` |
---

## Lavender Ice

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFFF` | L≈1.00 |
| Mid | `#CCCCFF` | L≈0.63 |
| Dark | `#7070FF` | L≈0.22 |

| Role | Value |
|---|---|
| Base | `#FFFFFF` |
| Accent (decorative only) | `#CCCCFF` |
| **Text + CTA button** | `#7070FF` |
| **Body text hex** | `#7070FF` (3.9:1 — large text only) |
| **CTA text** | `#FFFFFF` (3.9:1 — large text only) |
| Accent glow | `rgba(204,204,255,0.26)` |
| Atmosphere | `rgba(204,204,255,0.10)` |
---

## Celestial Lilac

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#CCE5FF` | L≈0.76 |
| Mid | `#E5CCFF` | L≈0.67 |
| Dark | `#CCCCFF` | L≈0.63 |

| Role | Value |
|---|---|
| Base | `#CCE5FF` |
| Accent (decorative only) | `#E5CCFF` |
| **Text + CTA button** | `#CCCCFF` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(229,204,255,0.26)` |
| Atmosphere | `rgba(229,204,255,0.10)` |
---

## Petal Glow

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#CCFFCC` | L≈0.89 |
| Mid | `#FFCCCC` | L≈0.69 |
| Dark | `#CCCCFF` | L≈0.63 |

| Role | Value |
|---|---|
| Base | `#CCFFCC` |
| Accent (decorative only) | `#FFCCCC` |
| **Text + CTA button** | `#CCCCFF` |
| Body text | ⚠ insufficient contrast (1.4:1) — decorative use only |
| Accent glow | `rgba(255,204,204,0.26)` |
| Atmosphere | `rgba(255,204,204,0.10)` |
---

## Lavender Breeze

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFFFCC` | L≈0.97 |
| Light Mid | `#CCFFE6` | L≈0.90 |
| Dark Mid | `#FFCCE6` | L≈0.70 |
| Darkest | `#CCCCFF` | L≈0.63 |

| Role | Value |
|---|---|
| Base | `#FFFFCC` |
| Second tone (decorative only) | `#CCFFE6` |
| Accent (decorative only) | `#FFCCE6` |
| **Text + CTA button** | `#CCCCFF` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(255,204,230,0.26)` |
| Atmosphere | `rgba(255,204,230,0.10)` |
---

## Harmony Gems

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#CAF7E6` | L≈0.85 |
| Mid | `#F7E6CA` | L≈0.81 |
| Dark | `#E6CAF7` | L≈0.66 |

| Role | Value |
|---|---|
| Base | `#CAF7E6` |
| Accent (decorative only) | `#F7E6CA` |
| **Text + CTA button** | `#E6CAF7` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(247,230,202,0.26)` |
| Atmosphere | `rgba(247,230,202,0.10)` |
---

## Serene Pastels

**Theme:** Light — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#CAF7D0` | L≈0.84 |
| Light Mid | `#F7E6CA` | L≈0.81 |
| Dark Mid | `#CADBF7` | L≈0.70 |
| Darkest | `#F7CAF1` | L≈0.68 |

| Role | Value |
|---|---|
| Base | `#CAF7D0` |
| Second tone (decorative only) | `#F7E6CA` |
| Accent (decorative only) | `#CADBF7` |
| **Text + CTA button** | `#F7CAF1` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(202,219,247,0.26)` |
| Atmosphere | `rgba(202,219,247,0.10)` |
---

## Lavender Grove

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#84AB7D` | L≈0.36 |
| Dark | `#A47DAB` | L≈0.26 |

| Role | Value |
|---|---|
| Base | `#84AB7D` |
| **Text + CTA button** | `#A47DAB` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(164,125,171,0.26)` |
| Atmosphere | `rgba(164,125,171,0.10)` |
---

## Lilac Sagebrush

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#9BAB7D` | L≈0.38 |
| Mid | `#7DAB8D` | L≈0.35 |
| Dark | `#A47DAB` | L≈0.26 |

| Role | Value |
|---|---|
| Base | `#9BAB7D` |
| Accent (decorative only) | `#7DAB8D` |
| **Text + CTA button** | `#A47DAB` |
| Body text | ⚠ insufficient contrast (1.4:1) — decorative use only |
| Accent glow | `rgba(125,171,141,0.26)` |
| Atmosphere | `rgba(125,171,141,0.10)` |
---

## Lavender Opal

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#BDA1C2` | L≈0.40 |
| Mid | `#A47DAB` | L≈0.26 |
| Dark | `#885D90` | L≈0.15 |

| Role | Value |
|---|---|
| Base | `#BDA1C2` |
| Accent (decorative only) | `#A47DAB` |
| **Text + CTA button** | `#885D90` |
| Body text | ⚠ insufficient contrast (2.3:1) — decorative use only |
| Accent glow | `rgba(164,125,171,0.26)` |
| Atmosphere | `rgba(164,125,171,0.10)` |
---

## Lilac Quartz

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#AB7D9B` | L≈0.26 |
| Mid | `#A47DAB` | L≈0.26 |
| Dark | `#8D7DAB` | L≈0.23 |

| Role | Value |
|---|---|
| Base | `#AB7D9B` |
| Accent (decorative only) | `#A47DAB` |
| **Text + CTA button** | `#8D7DAB` |
| Body text | ⚠ insufficient contrast (1.1:1) — decorative use only |
| Accent glow | `rgba(164,125,171,0.26)` |
| Atmosphere | `rgba(164,125,171,0.10)` |
---

## Lavender Drift

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#84AB7D` | L≈0.36 |
| Light Mid | `#7D9BAB` | L≈0.31 |
| Dark Mid | `#AB8D7D` | L≈0.29 |
| Darkest | `#A47DAB` | L≈0.26 |

| Role | Value |
|---|---|
| Base | `#84AB7D` |
| Second tone (decorative only) | `#7D9BAB` |
| Accent (decorative only) | `#AB8D7D` |
| **Text + CTA button** | `#A47DAB` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(171,141,125,0.26)` |
| Atmosphere | `rgba(171,141,125,0.10)` |
---

## Blush Tide

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#C5FFF1` | L≈0.90 |
| Dark | `#FFC5D3` | L≈0.66 |

| Role | Value |
|---|---|
| Base | `#C5FFF1` |
| **Text + CTA button** | `#FFC5D3` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(255,197,211,0.26)` |
| Atmosphere | `rgba(255,197,211,0.10)` |
---

## Rosy Mist

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#C5FFD4` | L≈0.88 |
| Mid | `#C5F0FF` | L≈0.81 |
| Dark | `#FFC5D3` | L≈0.66 |

| Role | Value |
|---|---|
| Base | `#C5FFD4` |
| Accent (decorative only) | `#C5F0FF` |
| **Text + CTA button** | `#FFC5D3` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(197,240,255,0.26)` |
| Atmosphere | `rgba(197,240,255,0.10)` |
---

## Rose Foam

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFFF` | L≈1.00 |
| Mid | `#FFC5D3` | L≈0.66 |
| Dark | `#FF6B8E` | L≈0.34 |

| Role | Value |
|---|---|
| Base | `#FFFFFF` |
| Accent (decorative only) | `#FFC5D3` |
| **Text + CTA button** | `#FF6B8E` |
| Body text | ⚠ insufficient contrast (2.7:1) — decorative use only |
| Accent glow | `rgba(255,197,211,0.26)` |
| Atmosphere | `rgba(255,197,211,0.10)` |
---

## Petal Quartz

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFD4C5` | L≈0.72 |
| Mid | `#FFC5F0` | L≈0.67 |
| Dark | `#FFC5D3` | L≈0.66 |

| Role | Value |
|---|---|
| Base | `#FFD4C5` |
| Accent (decorative only) | `#FFC5F0` |
| **Text + CTA button** | `#FFC5D3` |
| Body text | ⚠ insufficient contrast (1.1:1) — decorative use only |
| Accent glow | `rgba(255,197,240,0.26)` |
| Atmosphere | `rgba(255,197,240,0.10)` |
---

## Petal Haven

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#D3FFC5` | L≈0.89 |
| Mid | `#FFC5D3` | L≈0.66 |
| Dark | `#C5D3FF` | L≈0.66 |

| Role | Value |
|---|---|
| Base | `#D3FFC5` |
| Accent (decorative only) | `#FFC5D3` |
| **Text + CTA button** | `#C5D3FF` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(255,197,211,0.26)` |
| Atmosphere | `rgba(255,197,211,0.10)` |
---

## Pebble Blush

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F0FFC5` | L≈0.94 |
| Light Mid | `#C5FFF1` | L≈0.90 |
| Dark Mid | `#FFC5D3` | L≈0.66 |
| Darkest | `#D4C5FF` | L≈0.61 |

| Role | Value |
|---|---|
| Base | `#F0FFC5` |
| Second tone (decorative only) | `#C5FFF1` |
| Accent (decorative only) | `#FFC5D3` |
| **Text + CTA button** | `#D4C5FF` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(255,197,211,0.26)` |
| Atmosphere | `rgba(255,197,211,0.10)` |
---

## Blush Aqua

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#A1DCDC` | L≈0.64 |
| Dark | `#DCA1A1` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#A1DCDC` |
| **Text + CTA button** | `#DCA1A1` |
| Body text | ⚠ insufficient contrast (1.4:1) — decorative use only |
| Accent glow | `rgba(220,161,161,0.26)` |
| Atmosphere | `rgba(220,161,161,0.10)` |
---

## Blush Fern

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#A1DCBF` | L≈0.63 |
| Mid | `#A1BEDC` | L≈0.50 |
| Dark | `#DCA1A1` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#A1DCBF` |
| Accent (decorative only) | `#A1BEDC` |
| **Text + CTA button** | `#DCA1A1` |
| Body text | ⚠ insufficient contrast (1.4:1) — decorative use only |
| Accent glow | `rgba(161,190,220,0.26)` |
| Atmosphere | `rgba(161,190,220,0.10)` |
---

## Blush Garnet

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#F1D9D9` | L≈0.73 |
| Mid | `#DCA1A1` | L≈0.43 |
| Dark | `#C76969` | L≈0.23 |

| Role | Value |
|---|---|
| Base | `#F1D9D9` |
| Accent (decorative only) | `#DCA1A1` |
| **Text + CTA button** | `#C76969` |
| Body text | ⚠ insufficient contrast (2.8:1) — decorative use only |
| Accent glow | `rgba(220,161,161,0.26)` |
| Atmosphere | `rgba(220,161,161,0.10)` |
---

## Blush Granite

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#DCBFA1` | L≈0.55 |
| Mid | `#DCA1BE` | L≈0.44 |
| Dark | `#DCA1A1` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#DCBFA1` |
| Accent (decorative only) | `#DCA1BE` |
| **Text + CTA button** | `#DCA1A1` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(220,161,190,0.26)` |
| Atmosphere | `rgba(220,161,190,0.10)` |
---

## Pastel Treasures

**Theme:** Mid — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#A1DCA1` | L≈0.61 |
| Mid | `#DCA1A1` | L≈0.43 |
| Dark | `#A1A1DC` | L≈0.38 |

| Role | Value |
|---|---|
| Base | `#A1DCA1` |
| Accent (decorative only) | `#DCA1A1` |
| **Text + CTA button** | `#A1A1DC` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(220,161,161,0.26)` |
| Atmosphere | `rgba(220,161,161,0.10)` |
---

## Blush Harmony

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#BFDCA1` | L≈0.65 |
| Light Mid | `#A1DCDC` | L≈0.64 |
| Dark Mid | `#DCA1A1` | L≈0.43 |
| Darkest | `#BEA1DC` | L≈0.42 |

| Role | Value |
|---|---|
| Base | `#BFDCA1` |
| Second tone (decorative only) | `#A1DCDC` |
| Accent (decorative only) | `#DCA1A1` |
| **Text + CTA button** | `#BEA1DC` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(220,161,161,0.26)` |
| Atmosphere | `rgba(220,161,161,0.10)` |
---

## Beach Pearl

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFD3AC` | L≈0.71 |
| Dark | `#ACD8FF` | L≈0.65 |

| Role | Value |
|---|---|
| Base | `#FFD3AC` |
| **Text + CTA button** | `#ACD8FF` |
| Body text | ⚠ insufficient contrast (1.1:1) — decorative use only |
| Accent glow | `rgba(172,216,255,0.26)` |
| Atmosphere | `rgba(172,216,255,0.10)` |
---

## Peach Blossom

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFCAC` | L≈0.94 |
| Mid | `#FFD3AC` | L≈0.71 |
| Dark | `#FFACAE` | L≈0.54 |

| Role | Value |
|---|---|
| Base | `#FFFCAC` |
| Accent (decorative only) | `#FFD3AC` |
| **Text + CTA button** | `#FFACAE` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(255,211,172,0.26)` |
| Atmosphere | `rgba(255,211,172,0.10)` |
---

## Lilac Meadow

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#CEFFAF` | L≈0.88 |
| Dark | `#E0AFFF` | L≈0.54 |

| Role | Value |
|---|---|
| Base | `#CEFFAF` |
| **Text + CTA button** | `#E0AFFF` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(224,175,255,0.26)` |
| Atmosphere | `rgba(224,175,255,0.10)` |
---

## Lavender Citrus

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#F6FFAF` | L≈0.94 |
| Mid | `#AFFFB8` | L≈0.84 |
| Dark | `#E0AFFF` | L≈0.54 |

| Role | Value |
|---|---|
| Base | `#F6FFAF` |
| Accent (decorative only) | `#AFFFB8` |
| **Text + CTA button** | `#E0AFFF` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(175,255,184,0.26)` |
| Atmosphere | `rgba(175,255,184,0.10)` |
---

## Amethyst Frost

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFFF` | L≈1.00 |
| Mid | `#E0AFFF` | L≈0.54 |
| Dark | `#BF59FF` | L≈0.25 |

| Role | Value |
|---|---|
| Base | `#FFFFFF` |
| Accent (decorative only) | `#E0AFFF` |
| **Text + CTA button** | `#BF59FF` |
| **Body text hex** | `#BF59FF` (3.4:1 — large text only) |
| **CTA text** | `#FFFFFF` (3.4:1 — large text only) |
| Accent glow | `rgba(224,175,255,0.26)` |
| Atmosphere | `rgba(224,175,255,0.10)` |
---

## Lilac Dream

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFAFF6` | L≈0.59 |
| Mid | `#E0AFFF` | L≈0.54 |
| Dark | `#B8AFFF` | L≈0.48 |

| Role | Value |
|---|---|
| Base | `#FFAFF6` |
| Accent (decorative only) | `#E0AFFF` |
| **Text + CTA button** | `#B8AFFF` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(224,175,255,0.26)` |
| Atmosphere | `rgba(224,175,255,0.10)` |
---

## Lilac Blossom

**Theme:** Light — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#AFFFE0` | L≈0.86 |
| Mid | `#FFE0AF` | L≈0.78 |
| Dark | `#E0AFFF` | L≈0.54 |

| Role | Value |
|---|---|
| Base | `#AFFFE0` |
| Accent (decorative only) | `#FFE0AF` |
| **Text + CTA button** | `#E0AFFF` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(255,224,175,0.26)` |
| Atmosphere | `rgba(255,224,175,0.10)` |
---

## Gem Haze

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#CEFFAF` | L≈0.88 |
| Light Mid | `#AFF6FF` | L≈0.82 |
| Dark Mid | `#FFB8AF` | L≈0.59 |
| Darkest | `#E0AFFF` | L≈0.54 |

| Role | Value |
|---|---|
| Base | `#CEFFAF` |
| Second tone (decorative only) | `#AFF6FF` |
| Accent (decorative only) | `#FFB8AF` |
| **Text + CTA button** | `#E0AFFF` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(255,184,175,0.26)` |
| Atmosphere | `rgba(255,184,175,0.10)` |
---

## Blush Surf

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#93D0DE` | L≈0.57 |
| Dark | `#DEA193` | L≈0.43 |

| Role | Value |
|---|---|
| Base | `#93D0DE` |
| **Text + CTA button** | `#DEA193` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(222,161,147,0.26)` |
| Atmosphere | `rgba(222,161,147,0.10)` |
---

## Lemon Frost

**Theme:** Light — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFE3` | L≈0.98 |
| Mid | `#E3F1FF` | L≈0.86 |
| Dark | `#F1E3FF` | L≈0.81 |

| Role | Value |
|---|---|
| Base | `#FFFFE3` |
| Accent (decorative only) | `#E3F1FF` |
| **Text + CTA button** | `#F1E3FF` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(227,241,255,0.26)` |
| Atmosphere | `rgba(227,241,255,0.10)` |
---

## Dawn Citrine

**Theme:** Light — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFE3` | L≈0.98 |
| Mid | `#F1FFE3` | L≈0.96 |
| Dark | `#FFF1E3` | L≈0.90 |

| Role | Value |
|---|---|
| Base | `#FFFFE3` |
| Accent (decorative only) | `#F1FFE3` |
| **Text + CTA button** | `#FFF1E3` |
| Body text | ⚠ insufficient contrast (1.1:1) — decorative use only |
| Accent glow | `rgba(241,255,227,0.26)` |
| Atmosphere | `rgba(241,255,227,0.10)` |
---

## Gem Tranquil

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#FFFFE3` | L≈0.98 |
| Mid | `#E3FFFF` | L≈0.95 |
| Dark | `#FFE3FF` | L≈0.83 |

| Role | Value |
|---|---|
| Base | `#FFFFE3` |
| Accent (decorative only) | `#E3FFFF` |
| **Text + CTA button** | `#FFE3FF` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(227,255,255,0.26)` |
| Atmosphere | `rgba(227,255,255,0.10)` |
---

## Soft Spring

**Theme:** Light — **Use for:** light lifestyle editorial, wellness, home goods

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FFFFE3` | L≈0.98 |
| Light Mid | `#E3FFF1` | L≈0.94 |
| Dark Mid | `#FFE3F1` | L≈0.83 |
| Darkest | `#E3E3FF` | L≈0.78 |

| Role | Value |
|---|---|
| Base | `#FFFFE3` |
| Second tone (decorative only) | `#E3FFF1` |
| Accent (decorative only) | `#FFE3F1` |
| **Text + CTA button** | `#E3E3FF` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(255,227,241,0.26)` |
| Atmosphere | `rgba(255,227,241,0.10)` |
---

## Peach Breeze

**Theme:** Light — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#7FFFF2` | L≈0.82 |
| Mid | `#FFB27F` | L≈0.55 |
| Dark | `#7F8CFF` | L≈0.30 |

| Role | Value |
|---|---|
| Base | `#7FFFF2` |
| Accent (decorative only) | `#FFB27F` |
| **Text + CTA button** | `#7F8CFF` |
| Body text | ⚠ insufficient contrast (2.5:1) — decorative use only |
| Accent glow | `rgba(255,178,127,0.26)` |
| Atmosphere | `rgba(255,178,127,0.10)` |
---

## Blush Mint

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#9EE8CE` | L≈0.69 |
| Dark | `#E89EB8` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#9EE8CE` |
| **Text + CTA button** | `#E89EB8` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(232,158,184,0.26)` |
| Atmosphere | `rgba(232,158,184,0.10)` |
---

## Blush Emerald

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#9EE8A9` | L≈0.68 |
| Mid | `#9EDDE8` | L≈0.65 |
| Dark | `#E89EB8` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#9EE8A9` |
| Accent (decorative only) | `#9EDDE8` |
| **Text + CTA button** | `#E89EB8` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(158,221,232,0.26)` |
| Atmosphere | `rgba(158,221,232,0.10)` |
---

## Blush Opal

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#F7DDE6` | L≈0.77 |
| Mid | `#E89EB8` | L≈0.45 |
| Dark | `#D95F8A` | L≈0.25 |

| Role | Value |
|---|---|
| Base | `#F7DDE6` |
| Accent (decorative only) | `#E89EB8` |
| **Text + CTA button** | `#D95F8A` |
| Body text | ⚠ insufficient contrast (2.8:1) — decorative use only |
| Accent glow | `rgba(232,158,184,0.26)` |
| Atmosphere | `rgba(232,158,184,0.10)` |
---

## Rose Garnet

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#E8A99E` | L≈0.48 |
| Mid | `#E89EDD` | L≈0.47 |
| Dark | `#E89EB8` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#E8A99E` |
| Accent (decorative only) | `#E89EDD` |
| **Text + CTA button** | `#E89EB8` |
| Body text | ⚠ insufficient contrast (1.1:1) — decorative use only |
| Accent glow | `rgba(232,158,221,0.26)` |
| Atmosphere | `rgba(232,158,221,0.10)` |
---

## Meadow Quartz

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#B8E89E` | L≈0.70 |
| Mid | `#9EB8E8` | L≈0.47 |
| Dark | `#E89EB8` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#B8E89E` |
| Accent (decorative only) | `#9EB8E8` |
| **Text + CTA button** | `#E89EB8` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(158,184,232,0.26)` |
| Atmosphere | `rgba(158,184,232,0.10)` |
---

## Blush Essence

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#DDE89E` | L≈0.76 |
| Light Mid | `#9EE8CE` | L≈0.69 |
| Dark Mid | `#E89EB8` | L≈0.45 |
| Darkest | `#A99EE8` | L≈0.39 |

| Role | Value |
|---|---|
| Base | `#DDE89E` |
| Second tone (decorative only) | `#9EE8CE` |
| Accent (decorative only) | `#E89EB8` |
| **Text + CTA button** | `#A99EE8` |
| Body text | ⚠ insufficient contrast (1.8:1) — decorative use only |
| Accent glow | `rgba(232,158,184,0.26)` |
| Atmosphere | `rgba(232,158,184,0.10)` |
---

## Teal Rosewood

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#81D8D0` | L≈0.58 |
| Dark | `#D88189` | L≈0.32 |

| Role | Value |
|---|---|
| Base | `#81D8D0` |
| **Text + CTA button** | `#D88189` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(216,129,137,0.26)` |
| Atmosphere | `rgba(216,129,137,0.10)` |
---

## Oasis Trio

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#81D8D0` | L≈0.58 |
| Mid | `#D8A581` | L≈0.43 |
| Dark | `#D881B4` | L≈0.34 |

| Role | Value |
|---|---|
| Base | `#81D8D0` |
| Accent (decorative only) | `#D8A581` |
| **Text + CTA button** | `#D881B4` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(216,165,129,0.26)` |
| Atmosphere | `rgba(216,165,129,0.10)` |
---

## Aquamarine Blossom

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#B4D881` | L≈0.60 |
| Light Mid | `#81D8D0` | L≈0.58 |
| Dark Mid | `#D88189` | L≈0.32 |
| Darkest | `#A581D8` | L≈0.29 |

| Role | Value |
|---|---|
| Base | `#B4D881` |
| Second tone (decorative only) | `#81D8D0` |
| Accent (decorative only) | `#D88189` |
| **Text + CTA button** | `#A581D8` |
| Body text | ⚠ insufficient contrast (1.9:1) — decorative use only |
| Accent glow | `rgba(216,129,137,0.26)` |
| Atmosphere | `rgba(216,129,137,0.10)` |
---

## Aqua Rose

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#66F1C2` | L≈0.70 |
| Dark | `#F16695` | L≈0.30 |

| Role | Value |
|---|---|
| Base | `#66F1C2` |
| **Text + CTA button** | `#F16695` |
| Body text | ⚠ insufficient contrast (2.1:1) — decorative use only |
| Accent glow | `rgba(241,102,149,0.26)` |
| Atmosphere | `rgba(241,102,149,0.10)` |
---

## Mint Lagoon

**Theme:** Mid — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#66F1C2` | L≈0.70 |
| Mid | `#66F17D` | L≈0.67 |
| Dark | `#66DBF1` | L≈0.60 |

| Role | Value |
|---|---|
| Base | `#66F1C2` |
| Accent (decorative only) | `#66F17D` |
| **Text + CTA button** | `#66DBF1` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(102,241,125,0.26)` |
| Atmosphere | `rgba(102,241,125,0.10)` |
---

## Blush Jades

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#77FFB0` | L≈0.79 |
| Mid | `#77C6FF` | L≈0.52 |
| Dark | `#FF7782` | L≈0.36 |

| Role | Value |
|---|---|
| Base | `#77FFB0` |
| Accent (decorative only) | `#77C6FF` |
| **Text + CTA button** | `#FF7782` |
| Body text | ⚠ insufficient contrast (2.0:1) — decorative use only |
| Accent glow | `rgba(119,198,255,0.26)` |
| Atmosphere | `rgba(119,198,255,0.10)` |
---

## Serene Blossom

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#82FF77` | L≈0.78 |
| Mid | `#FF7782` | L≈0.36 |
| Dark | `#7782FF` | L≈0.27 |

| Role | Value |
|---|---|
| Base | `#82FF77` |
| Accent (decorative only) | `#FF7782` |
| **Text + CTA button** | `#7782FF` |
| Body text | ⚠ insufficient contrast (2.6:1) — decorative use only |
| Accent glow | `rgba(255,119,130,0.26)` |
| Atmosphere | `rgba(255,119,130,0.10)` |
---

## Mint Blush

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#98FBCB` | L≈0.80 |
| Dark | `#FB98C8` | L≈0.47 |

| Role | Value |
|---|---|
| Base | `#98FBCB` |
| **Text + CTA button** | `#FB98C8` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(251,152,200,0.26)` |
| Atmosphere | `rgba(251,152,200,0.10)` |
---

## Mint Quartz

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#98FBCB` | L≈0.80 |
| Mid | `#FB98FA` | L≈0.50 |
| Dark | `#FB9998` | L≈0.46 |

| Role | Value |
|---|---|
| Base | `#98FBCB` |
| Accent (decorative only) | `#FB98FA` |
| **Text + CTA button** | `#FB9998` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(251,152,250,0.26)` |
| Atmosphere | `rgba(251,152,250,0.10)` |
---

## Seaspray Essence

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#98F9FB` | L≈0.81 |
| Mid | `#98FBCB` | L≈0.80 |
| Dark | `#98FB9A` | L≈0.78 |

| Role | Value |
|---|---|
| Base | `#98F9FB` |
| Accent (decorative only) | `#98FBCB` |
| **Text + CTA button** | `#98FB9A` |
| Body text | ⚠ insufficient contrast (1.0:1) — decorative use only |
| Accent glow | `rgba(152,251,203,0.26)` |
| Atmosphere | `rgba(152,251,203,0.10)` |
---

## Pistachio Harmony

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#FAFB98` | L≈0.92 |
| Light Mid | `#98FBCB` | L≈0.80 |
| Dark Mid | `#FB98C8` | L≈0.47 |
| Darkest | `#9A98FB` | L≈0.36 |

| Role | Value |
|---|---|
| Base | `#FAFB98` |
| Second tone (decorative only) | `#98FBCB` |
| Accent (decorative only) | `#FB98C8` |
| **Text + CTA button** | `#9A98FB` |
| Body text | ⚠ insufficient contrast (2.3:1) — decorative use only |
| Accent glow | `rgba(251,152,200,0.26)` |
| Atmosphere | `rgba(251,152,200,0.10)` |
---

## Rose Turquoise

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#91E4CF` | L≈0.66 |
| Dark | `#E491A6` | L≈0.39 |

| Role | Value |
|---|---|
| Base | `#91E4CF` |
| **Text + CTA button** | `#E491A6` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(228,145,166,0.26)` |
| Atmosphere | `rgba(228,145,166,0.10)` |
---

## Blossom Jade

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#91E4A6` | L≈0.64 |
| Mid | `#91D0E4` | L≈0.57 |
| Dark | `#E491A6` | L≈0.39 |

| Role | Value |
|---|---|
| Base | `#91E4A6` |
| Accent (decorative only) | `#91D0E4` |
| **Text + CTA button** | `#E491A6` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(145,208,228,0.26)` |
| Atmosphere | `rgba(145,208,228,0.10)` |
---

## Rose Sunrise

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#E4A591` | L≈0.45 |
| Mid | `#E491D0` | L≈0.41 |
| Dark | `#E491A6` | L≈0.39 |

| Role | Value |
|---|---|
| Base | `#E4A591` |
| Accent (decorative only) | `#E491D0` |
| **Text + CTA button** | `#E491A6` |
| Body text | ⚠ insufficient contrast (1.1:1) — decorative use only |
| Accent glow | `rgba(228,145,208,0.26)` |
| Atmosphere | `rgba(228,145,208,0.10)` |
---

## Aquatic Rose

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#8DDCDC` | L≈0.62 |
| Dark | `#DC8D8D` | L≈0.36 |

| Role | Value |
|---|---|
| Base | `#8DDCDC` |
| **Text + CTA button** | `#DC8D8D` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(220,141,141,0.26)` |
| Atmosphere | `rgba(220,141,141,0.10)` |
---

## Aquamarine Blush

**Theme:** Mid — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#8DDCDC` | L≈0.62 |
| Mid | `#DCB58D` | L≈0.50 |
| Dark | `#DC8DB5` | L≈0.38 |

| Role | Value |
|---|---|
| Base | `#8DDCDC` |
| Accent (decorative only) | `#DCB58D` |
| **Text + CTA button** | `#DC8DB5` |
| Body text | ⚠ insufficient contrast (1.6:1) — decorative use only |
| Accent glow | `rgba(220,181,141,0.26)` |
| Atmosphere | `rgba(220,181,141,0.10)` |
---

## Spa Serenity

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#C4EDED` | L≈0.78 |
| Mid | `#8DDCDC` | L≈0.62 |
| Dark | `#56CBCB` | L≈0.49 |

| Role | Value |
|---|---|
| Base | `#C4EDED` |
| Accent (decorative only) | `#8DDCDC` |
| **Text + CTA button** | `#56CBCB` |
| Body text | ⚠ insufficient contrast (1.5:1) — decorative use only |
| Accent glow | `rgba(141,220,220,0.26)` |
| Atmosphere | `rgba(141,220,220,0.10)` |
---

## Tranquil Gems

**Theme:** Mid — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#DCDC8D` | L≈0.68 |
| Mid | `#8DDCDC` | L≈0.62 |
| Dark | `#DC8DDC` | L≈0.39 |

| Role | Value |
|---|---|
| Base | `#DCDC8D` |
| Accent (decorative only) | `#8DDCDC` |
| **Text + CTA button** | `#DC8DDC` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(141,220,220,0.26)` |
| Atmosphere | `rgba(141,220,220,0.10)` |
---

## Golden Pasture

**Theme:** Light — **Use for:** artisan food, warm editorial, natural skincare

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#F1E8CF` | L≈0.81 |
| Mid | `#E0CD95` | L≈0.62 |
| Dark | `#CFB25B` | L≈0.46 |

| Role | Value |
|---|---|
| Base | `#F1E8CF` |
| Accent (decorative only) | `#E0CD95` |
| **Text + CTA button** | `#CFB25B` |
| Body text | ⚠ insufficient contrast (1.7:1) — decorative use only |
| Accent glow | `rgba(224,205,149,0.26)` |
| Atmosphere | `rgba(224,205,149,0.10)` |
---

## Serene Coral

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#B8E3E9` | L≈0.71 |
| Dark | `#E9BEB8` | L≈0.58 |

| Role | Value |
|---|---|
| Base | `#B8E3E9` |
| **Text + CTA button** | `#E9BEB8` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(233,190,184,0.26)` |
| Atmosphere | `rgba(233,190,184,0.10)` |
---

## Crystal Seas

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#B8E3E9` | L≈0.71 |
| Mid | `#E9D7B8` | L≈0.69 |
| Dark | `#E9B8CA` | L≈0.56 |

| Role | Value |
|---|---|
| Base | `#B8E3E9` |
| Accent (decorative only) | `#E9D7B8` |
| **Text + CTA button** | `#E9B8CA` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(233,215,184,0.26)` |
| Atmosphere | `rgba(233,215,184,0.10)` |
---

## Aquatic Dream

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#B8E9D7` | L≈0.73 |
| Mid | `#B8E3E9` | L≈0.71 |
| Dark | `#B8CAE9` | L≈0.58 |

| Role | Value |
|---|---|
| Base | `#B8E9D7` |
| Accent (decorative only) | `#B8E3E9` |
| **Text + CTA button** | `#B8CAE9` |
| Body text | ⚠ insufficient contrast (1.2:1) — decorative use only |
| Accent glow | `rgba(184,227,233,0.26)` |
| Atmosphere | `rgba(184,227,233,0.10)` |
---

## Tranquil Treasure

**Theme:** Light — **Use for:** lifestyle editorial, light-theme campaigns

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#E3E9B8` | L≈0.78 |
| Mid | `#B8E3E9` | L≈0.71 |
| Dark | `#E9B8E3` | L≈0.57 |

| Role | Value |
|---|---|
| Base | `#E3E9B8` |
| Accent (decorative only) | `#B8E3E9` |
| **Text + CTA button** | `#E9B8E3` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(184,227,233,0.26)` |
| Atmosphere | `rgba(184,227,233,0.10)` |
---

## Aquatic Pasture

**Theme:** Light — **Use for:** coastal lifestyle, wellness, travel, clean beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#CAE9B8` | L≈0.74 |
| Light Mid | `#B8E3E9` | L≈0.71 |
| Dark Mid | `#E9BEB8` | L≈0.58 |
| Darkest | `#D7B8E9` | L≈0.55 |

| Role | Value |
|---|---|
| Base | `#CAE9B8` |
| Second tone (decorative only) | `#B8E3E9` |
| Accent (decorative only) | `#E9BEB8` |
| **Text + CTA button** | `#D7B8E9` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(233,190,184,0.26)` |
| Atmosphere | `rgba(233,190,184,0.10)` |
---

## Floral Whimsy

**Theme:** Light — **Use for:** beauty, skincare, floral, feminine lifestyle

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#46FFFF` | L≈0.80 |
| Mid | `#46FF46` | L≈0.73 |
| Dark | `#FF46A2` | L≈0.28 |

| Role | Value |
|---|---|
| Base | `#46FFFF` |
| Accent (decorative only) | `#46FF46` |
| **Text + CTA button** | `#FF46A2` |
| Body text | ⚠ insufficient contrast (2.6:1) — decorative use only |
| Accent glow | `rgba(70,255,70,0.26)` |
| Atmosphere | `rgba(70,255,70,0.10)` |
---

## Garden Opal

**Theme:** Mid — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#A8DCAB` | L≈0.62 |
| Dark | `#DCA8D9` | L≈0.48 |

| Role | Value |
|---|---|
| Base | `#A8DCAB` |
| **Text + CTA button** | `#DCA8D9` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(220,168,217,0.26)` |
| Atmosphere | `rgba(220,168,217,0.10)` |
---

## Peridot Lilac

**Theme:** Mid — **Use for:** botanical beauty, floral branding, spa, wellness

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#A8DCAB` | L≈0.62 |
| Mid | `#DCA8BF` | L≈0.47 |
| Dark | `#C5A8DC` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#A8DCAB` |
| Accent (decorative only) | `#DCA8BF` |
| **Text + CTA button** | `#C5A8DC` |
| Body text | ⚠ insufficient contrast (1.3:1) — decorative use only |
| Accent glow | `rgba(220,168,191,0.26)` |
| Atmosphere | `rgba(220,168,191,0.10)` |
---

## Mint Jasper

**Theme:** Light — **Use for:** organic beauty, wellness, natural food, sustainability

| Swatch | Hex | Luminance |
|---|---|---|
| Light | `#DFF2E0` | L≈0.85 |
| Mid | `#A8DCAB` | L≈0.62 |
| Dark | `#71C676` | L≈0.45 |

| Role | Value |
|---|---|
| Base | `#DFF2E0` |
| Accent (decorative only) | `#A8DCAB` |
| **Text + CTA button** | `#71C676` |
| Body text | ⚠ insufficient contrast (1.8:1) — decorative use only |
| Accent glow | `rgba(168,220,171,0.26)` |
| Atmosphere | `rgba(168,220,171,0.10)` |
