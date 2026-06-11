# Image Reconstruction Specification – Dental Tourism Ad (Egypt Theme)

## 1. Overview
- **Aspect Ratio:** 1:1 (square)
- **Style:** Premium, clean, medical tourism advertisement
- **Theme:** Travel (Egypt) + Dental clinic
- **Primary Colors:**
  - Deep Teal: #0f3b3f (approx)
  - Orange Accent: #e66a2c (approx)
  - Background: Soft beige gradient
- **Lighting:** Soft, diffused, studio-quality
- **Composition:** Multi-layer composite with smooth blending

---

## 2. Layer Structure (Back to Front)

### 2.1 Base Background
- Gradient: off-white → light beige
- Subtle vignette on edges
- No visible texture

---

### 2.2 Split Background Scene

#### Left Side – Egypt Landscape
- Pyramids (mid-left)
- Warm sunset tones (golden/orange)
- River in foreground (calm water)
- Sailboat with white triangular sail
- Palm trees along shoreline
- Slight atmospheric haze

#### Right Side – Dental Clinic
- Modern dental chair (teal upholstery)
- Overhead dental light
- Instrument tray (tools visible)
- Monitor displaying dental X-ray (teeth)
- Bright window in background
- Clean, minimal interior
- Cool white lighting

#### Blend Behavior
- No hard split line
- Use gradient mask / soft blending between scenes

---

### 2.3 Bottom Curved Overlay
- Shape: Large arc/wave spanning full width
- Color: Deep teal
- Top edge: Thin orange curved stroke
- Function: Separates CTA section from background

---

### 2.4 Foreground Subject (Person)
- Position: Center, slightly lower than midpoint
- Subject: Elderly woman smiling
- Features:
  - White teeth (highlighted)
  - Gray-blonde shoulder-length hair
  - Light makeup
- Clothing:
  - Beige cardigan
  - White top
- Lighting: Soft studio lighting
- Edges: Clean cutout with slight feather
- Overlaps both background scenes

---

### 2.5 Logo & Branding (Top Center)

#### Logo Icon
- Abstract tooth-like mirrored curves
- Teal shapes
- Orange elliptical orbit line

#### Text
- "nuwara" (Latin)
- Arabic text below
- Font: Modern sans-serif
- Alignment: Horizontal with icon

---

### 2.6 Headline Typography

#### Line 1
"Combine a trip to Egypt"
- Serif font
- Dark teal color

#### Line 2
"with getting a"
- Smaller size
- Same style

#### Line 3
"Brand-New Smile"
- "Brand-New" → Dark teal
- "Smile" → Orange
- Largest size

#### Typography Hierarchy
1. Line 3 (largest)
2. Line 1
3. Line 2 (smallest)

---

### 2.7 Call-To-Action Button

- Text: "See how much you could save"

#### Style
- Shape: Pill (fully rounded)
- Background: Orange (slight gradient)
- Text: White, bold sans-serif
- Position: Centered in bottom section
- Shadow: Subtle drop shadow

---

## 3. Visual Techniques

### Color Contrast
- Warm tones (left) vs cool tones (right)
- Orange used for emphasis and CTA

### Depth
- Foreground subject overlaps all layers
- Background slightly softened

### Blending
- Gradient mask between Egypt and clinic

### Branding Consistency
- Teal and orange repeated across:
  - Logo
  - CTA
  - Decorative elements

---

## 4. Layout Structure (Logical Tree)

Container (relative)
- Background gradient
- Left image (Egypt) [masked]
- Right image (Clinic) [masked]
- Foreground person (center, high z-index)
- Logo block (top center)
- Headline text block (upper center)
- Bottom curved overlay (SVG or clip-path)
- CTA button (bottom center)

---

## 5. Implementation Notes

- Use `mask-image` or gradient overlays for blending
- Use PNG or AI-cutout for subject
- Bottom curve:
  - Prefer SVG for precision
  - Alternative: CSS `clip-path`
- Suggested Fonts:
  - Serif: Playfair Display / Libre Baskerville
  - Sans-serif: Inter / Helvetica
- Maintain:
  - Generous whitespace
  - Visual balance

---

## 6. Critical Details

- Orange curved line above bottom section
- Dental X-ray screen (important detail)
- Sailboat in water
- Smooth color transition between halves
- Only the word "Smile" is orange in headline

---

## 7. Optional Enhancements

- Add slight glow to CTA button
- Add soft shadow under subject
- Subtle blur on background for depth
- Fine-tune warm/cool color grading split
