# Scene Frameworks for Video Ads

Maps ad copywriting frameworks to video scene sequences.

## PAS (Pain → Agitate → Solve)
Best for: Products that solve a clear problem

```json
[
  { "type": "hook", "headline": "[Pain point as question]", "subtext": "[Specific symptoms]", "durationFrames": 90, "transition": "fade" },
  { "type": "benefits", "headline": "[Agitate — what happens without solution]", "items": ["Problem 1", "Problem 2", "Problem 3"], "durationFrames": 105, "transition": "fade" },
  { "type": "product", "headline": "[Product tagline]", "imagePath": "photos/{slug}/product.jpg", "productName": "[Name]", "price": "[Price]", "durationFrames": 90, "transition": "slide-left" },
  { "type": "cta", "headline": "[Result promise]", "subtext": "[Price or offer]", "items": ["[CTA button text]"], "durationFrames": 75, "transition": "fade" }
]
```

## AIDA (Attention → Interest → Desire → Action)
Best for: New product launches, brand awareness

```json
[
  { "type": "hook", "headline": "[Bold attention-grabbing statement]", "durationFrames": 90, "transition": "fade" },
  { "type": "product", "headline": "[What makes it interesting]", "imagePath": "photos/{slug}/product.jpg", "productName": "[Name]", "durationFrames": 90, "transition": "slide-left" },
  { "type": "benefits", "headline": "[Why you want this]", "items": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"], "durationFrames": 105, "transition": "fade" },
  { "type": "cta", "headline": "[Desire + action]", "items": ["[CTA]"], "durationFrames": 75, "transition": "slide-up" }
]
```

## Before/After
Best for: Tangible transformation products

```json
[
  { "type": "comparison", "headline": "[Transformation promise]", "beforeLabel": "Bez", "afterLabel": "Ar [Brand]", "items": ["Before 1", "Before 2", "Before 3", "After 1", "After 2", "After 3"], "durationFrames": 120, "transition": "fade" },
  { "type": "product", "headline": "[Product line]", "imagePath": "photos/{slug}/product.jpg", "durationFrames": 90, "transition": "slide-left" },
  { "type": "testimonial", "headline": "[Customer quote]", "subtext": "[Name]", "rating": 5, "durationFrames": 90, "transition": "fade" },
  { "type": "cta", "headline": "[Action line]", "items": ["[CTA]"], "durationFrames": 75, "transition": "fade" }
]
```

## Social Proof First
Best for: Established brands with reviews/stats

```json
[
  { "type": "testimonial", "headline": "[Best customer quote]", "subtext": "[Reviewer]", "rating": 5, "durationFrames": 90, "transition": "fade" },
  { "type": "stats", "headline": "[Trust headline]", "items": ["2300+ klienti", "4.8 vērtējums", "98% iesaka"], "durationFrames": 90, "transition": "slide-up" },
  { "type": "product", "headline": "[Product line]", "imagePath": "photos/{slug}/product.jpg", "durationFrames": 90, "transition": "slide-left" },
  { "type": "cta", "headline": "[Join them]", "items": ["[CTA]"], "durationFrames": 75, "transition": "fade" }
]
```

## Full Showcase (5-6 scenes, 18-22s)
Best for: Premium/luxury products, comprehensive introduction

```json
[
  { "type": "hook", "headline": "[Provocative question]", "subtext": "[Context]", "durationFrames": 90, "transition": "fade" },
  { "type": "product", "headline": "[Hero product]", "imagePath": "photos/{slug}/product.jpg", "productName": "[Name]", "price": "[Price]", "durationFrames": 90, "transition": "slide-left" },
  { "type": "benefits", "headline": "[Why it works]", "items": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"], "durationFrames": 105, "transition": "fade" },
  { "type": "comparison", "headline": "[The difference]", "items": ["Before 1", "Before 2", "After 1", "After 2"], "durationFrames": 105, "transition": "slide-up" },
  { "type": "testimonial", "headline": "[Social proof]", "subtext": "[Name]", "rating": 5, "durationFrames": 90, "transition": "fade" },
  { "type": "cta", "headline": "[Final push]", "subtext": "[Offer]", "items": ["[CTA]"], "durationFrames": 75, "transition": "fade" }
]
```
