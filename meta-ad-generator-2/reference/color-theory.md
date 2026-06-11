# Color Theory & Visual Design Reference

## Contrast Requirements

### Text Readability (WCAG AA)
- **Normal text**: Minimum 4.5:1 contrast ratio against background
- **Large text (24px+)**: Minimum 3:1 contrast ratio
- **CTA button text**: Minimum 4.5:1 against button background
- Always test: white text on dark overlay, dark text on light backgrounds

### Calculating Contrast
- Use relative luminance formula
- Quick rule: white text works on backgrounds darker than #767676
- Quick rule: black text works on backgrounds lighter than #767676

## CTA Button Color Psychology

| Color | Association | Best For |
|-------|------------|----------|
| Orange (#FF6B35) | Energy, urgency, action | Sign ups, limited offers |
| Green (#2ECC71) | Growth, safety, go | Free trials, health/wellness |
| Blue (#3498DB) | Trust, professionalism | B2B, finance, consulting |
| Red (#E74C3C) | Urgency, excitement | Sales, limited time |
| Purple (#9B59B6) | Premium, creativity | Luxury, coaching, personal dev |
| Coral (#FF6F61) | Warm, approachable | Lifestyle, coaching, women's brands |
| Teal (#1ABC9C) | Calm confidence | Wellness, therapy, coaching |

### CTA Button Rules
- Button must be the highest-contrast element in the ad
- Minimum size: 200x56px (thumb-friendly)
- Rounded corners (8-16px border-radius) outperform sharp corners
- Add subtle shadow for depth: `box-shadow: 0 4px 15px rgba(0,0,0,0.2)`
- Padding: minimum 16px vertical, 32px horizontal

## Color Harmony Systems

### Complementary (high contrast)
- Use brand primary + its complement for CTA
- Example: Blue brand → Orange CTA

### Analogous (harmonious)
- Use 2-3 adjacent colors on the wheel
- Feels cohesive, calming — good for wellness/coaching brands

### Split-Complementary (balanced pop)
- Primary + two colors adjacent to its complement
- Best for: multi-element ads with variety

## Brand Color Application Hierarchy

1. **Background**: Brand primary (or neutral derived from brand)
2. **Text**: High-contrast against background (usually white or dark gray)
3. **Headline**: Can use brand accent color if contrast permits
4. **CTA button**: Highest-saturation brand color OR complementary color
5. **Secondary elements**: Brand secondary at reduced opacity

## Gradient Rules
- Max 2 colors in a gradient
- Gradient angle: 135deg or 180deg (top-to-bottom or diagonal)
- Use gradients for background overlays on photos: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)`
- Never gradient on text itself — only backgrounds
- Gradient overlay on photos: ensures text readability while keeping image visible

## Typography Scale (1080x1080)

| Element | Size Range | Weight | Line Height |
|---------|-----------|--------|-------------|
| Headline | 48-72px | 700-900 (Bold/Black) | 1.1-1.2 |
| Subheadline | 32-42px | 600 (Semibold) | 1.2-1.3 |
| Body text | 24-32px | 400-500 (Regular/Medium) | 1.4-1.5 |
| CTA text | 24-32px | 700 (Bold) | 1.0 |
| Caption/fine print | 18-22px | 400 (Regular) | 1.3 |

### Font Pairing Rules
- Max 2 fonts per ad (one heading, one body)
- If brand uses only 1 font, use weight contrast (Bold heading + Regular body)
- Sans-serif is default for digital ads (Montserrat, Inter, Open Sans, Poppins)
- Serif for premium/luxury feel (Playfair Display, Lora)
- Google Fonts CDN for web font loading in HTML templates

## Photo Overlay Techniques

### Dark Overlay (for light text)
```css
background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
```

### Light Overlay (for dark text)
```css
background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.9) 100%);
```

### Brand Color Overlay
```css
background: linear-gradient(135deg, rgba(BRAND_R,BRAND_G,BRAND_B,0.85) 0%, rgba(BRAND_R,BRAND_G,BRAND_B,0.95) 100%);
```

### Blur + Overlay (modern look)
```css
backdrop-filter: blur(8px);
background: rgba(0,0,0,0.4);
```

## Layout Spacing (1080x1080)
- **Outer padding**: 40-60px on all sides
- **Between elements**: 24-32px vertical spacing
- **Logo area**: 80-120px square, positioned in corner with 40px margin
- **CTA button**: centered or right-aligned, 40px from bottom safe zone
- **Visual weight**: image/photo takes 50-70% of space, text takes 30-50%
