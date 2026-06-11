# Ad Design Style Guide — 1080×1080px Meta Ads

This guide defines the visual language for all ads. Every ad must use at least 4 distinct layers. Single-layer flat designs are rejected.

---

## 1. Composition Templates

Pick ONE composition per ad. Never mix two layouts.

### Diagonal Split
Left: dark text panel. Right: photo or color block.
The dividing line is a diagonal (10–15°), not vertical.
A gradient overlay fades the photo into the dark side.
Best for: tangible products in context, outdoor/industrial brands.

```css
.photo { clip-path: polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%); }
.overlay { background: linear-gradient(to right, #111 38%, transparent 72%); }
```

### Full-Bleed Editorial
Photo or gradient covers the entire canvas.
Text floats over it via a semi-transparent dark band or drop shadow.
Best for: luxury, lifestyle, emotion-first brands.

```css
.band { background: linear-gradient(to top, rgba(0,0,0,0.85) 40%, transparent 100%); }
```

### Bottom Panel Showcase
Top 65%: hero image or large typography.
Bottom 35%: solid dark bar containing product photos + CTA.
Best for: multi-product, feature-rich, B2B.

```css
.panel { position: absolute; bottom: 0; width: 1080px; height: 360px; background: #0a0a0a; }
```

### Typographic Poster
No photos. Full canvas = one dominant typographic statement.
Color block behind the headline (rotated rectangle or diagonal strip).
Best for: intangible products, UHNWI audiences, bold brand statements.

```css
.color-block {
  position: absolute; top: 200px; left: -40px;
  width: 1160px; height: 260px;
  background: #c8a86a; transform: rotate(-2deg);
}
```

### Grid / Multi-Panel
Canvas divided into 2–4 zones by sharp lines or contrasting colors.
Each zone holds a distinct piece of information.
Best for: before/after, benefit stacks, comparison ads.

```css
.grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
```

---

## 2. Layer Stack (use at least 4)

### Layer 1 — Base
Solid dark color, gradient mesh, or noise texture. Never plain white.

```css
background:
  radial-gradient(ellipse at 70% 20%, rgba(200,168,106,0.18) 0%, transparent 55%),
  radial-gradient(ellipse at 15% 85%, rgba(180,60,40,0.12) 0%, transparent 50%),
  #0d0b09;
```

### Layer 2 — Atmosphere
Adds depth behind the main content.
Options: large blurred circle, diagonal color band, noise overlay, vignette.

```css
/* Noise overlay */
.noise {
  position: absolute; inset: 0; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### Layer 3 — Structural Shapes
Geometric elements that define the layout skeleton.
Use: clip-path polygons, rotated rectangles, hexagons, diagonal strips.

```css
/* Hexagon */
clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);

/* Diagonal accent strip */
position: absolute; width: 140%; height: 6px; background: #c8a86a;
transform: rotate(-8deg); transform-origin: left center;

/* Diamond */
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
```

### Layer 4 — Photo / Hero Visual
Always clip photos with a non-rectangular shape.
Never place a raw rectangle photo on a dark background — it looks pasted.

```css
/* Diagonal left edge */
clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);

/* Angled both sides */
clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
```

### Layer 5 — Gradient Overlay on Photo
Always place a gradient between the photo and text to ensure legibility.
Never put white or light text directly on a photo without an overlay.

```css
/* Left-side legibility */
background: linear-gradient(to right, rgba(10,10,10,0.92) 30%, rgba(10,10,10,0.4) 60%, transparent 85%);

/* Bottom legibility */
background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 60%);
```

### Layer 6 — Text Content
Strict hierarchy: on-image text → body → CTA. No eyebrow labels, no category text, no taglines.
- On-image text: 64–100px, heaviest weight available, line-height 1.0–1.1
- Body: 20–26px, line-height 1.5–1.6, 60–75% opacity white

### Layer 7 — Accent Details
Small elements that add perceived production quality.
Options: thin rule lines, dot clusters, corner marks, badge pills.

```css
/* Thin rule */
width: 60px; height: 2px; background: #c8a86a; margin-bottom: 24px;

/* Corner mark */
position: absolute; top: 48px; left: 48px;
width: 32px; height: 32px;
border-top: 3px solid #c8a86a; border-left: 3px solid #c8a86a;
```

### Layer 8 — CTA Button
Always last in the stack. Minimum 150px from canvas bottom.
Accent glow lifts it off the background.

```css
background: #c8a86a; color: #0d0b09;
padding: 22px 52px; border-radius: 6px;
box-shadow: 0 8px 32px rgba(200,168,106,0.45), 0 2px 8px rgba(0,0,0,0.4);
```

---

## 3. Shape Vocabulary

Match shapes to brand personality:

| Shape | CSS | Use when |
|---|---|---|
| Hexagon | `clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)` | Industrial, technical, robotics, engineering |
| Diagonal cut | `clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%)` | Dynamic, construction, sports, forward motion |
| Sharp rectangle | `border-radius: 0` | Authority, finance, luxury restraint, B2B |
| Rounded rectangle | `border-radius: 12–20px` | Consumer, wellness, approachable tech |
| Circle | `border-radius: 50%` | Trust, testimonials, community, avatars |
| Rotated rectangle | `transform: rotate(-3deg to -8deg)` | Energy, disruption, editorial surprise |

---

## 4. Border Techniques (for product frames)

### Hexagonal frame with border
Use two stacked elements — outer (border color) slightly larger than inner (photo).

```css
.frame-outer {
  width: 320px; height: 320px;
  background: #c8a86a;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.frame-inner {
  position: absolute; top: 8px; left: 8px; width: 304px; height: 304px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  overflow: hidden;
}
```

### Glowing border
```css
box-shadow: 0 0 0 3px #c8a86a, 0 0 24px rgba(200,168,106,0.5);
```

---

## 5. Typography Rules

**Headline font — never use:** Inter, Roboto, Arial, system-ui as headline. Fine as body only.

| Style | Heading | Body |
|---|---|---|
| Luxury / editorial | Cormorant Garamond | Montserrat |
| Bold / modern | Bebas Neue | Inter |
| Refined serif | Playfair Display | DM Sans |
| Geometric | Josefin Sans | Space Grotesk |
| Industrial | Oswald | Roboto Condensed |
| Premium humanist | Fraunces | Inter |

**Sizing scale (1080px canvas):**
- On-image text: 64–100px, weight 700–900, line-height 1.0–1.1
- Body: 20–26px, weight 400, line-height 1.5–1.6
- CTA: 18–22px, weight 600
- Micro: 14–16px, brand URL or legal only

**Line breaks:** Force with `<br>` into complete-thought lines. Never let the browser auto-wrap headlines.

---

## 6. Effects Reference

```css
/* Radial glow behind headline or product */
background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(200,168,106,0.2) 0%, transparent 70%);

/* Vignette around photo edges */
box-shadow: inset 0 0 120px rgba(0,0,0,0.7);

/* Glass / frosted card */
background: rgba(255,255,255,0.06);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 12px;

/* Dark gradient scrim over photo */
background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);

/* Inset shadow on panel */
box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5);

/* Diagonal accent line */
.accent-line {
  position: absolute; width: 180px; height: 3px;
  background: linear-gradient(to right, #c8a86a, transparent);
  transform: rotate(-8deg);
}

/* Product floating shadow */
filter: drop-shadow(0 24px 48px rgba(0,0,0,0.6));
```

---

## 7. Checkmarks / Bullet Points

For benefit lists, use inline SVG — not emoji, not text bullets.

```html
<div class="bullet">
  <svg width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="10" fill="#FF6B00"/>
    <polyline points="5,10 8.5,13.5 15,7" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>
  <span>Benefit text here</span>
</div>
```

```css
.bullet { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.bullet span { font-size: 22px; color: rgba(255,255,255,0.9); line-height: 1.4; }
```

---

## 8. What Makes an Ad Feel Non-Generic

One technique that makes this ad memorable vs forgettable:
- A diagonal photo cut instead of a rectangular frame
- A headline where one word is a different color
- Hexagonal product frames that echo the brand's geometric identity
- A glow under the CTA that lifts it off the canvas
- A noise texture layer that adds tactility at 3–5% opacity
- A rotated accent rectangle behind the headline

**Before outputting: name the ONE memorable detail in this ad. If you cannot name it, add one.**
