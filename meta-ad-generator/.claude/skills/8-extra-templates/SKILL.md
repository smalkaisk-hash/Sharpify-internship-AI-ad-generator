---
name: 8-extra-templates
description: Template registry — index of all available ad templates with eligibility by ad type. Referenced by the ad copy generator for dynamic template selection.
---

# Template Registry — Ad Creative Library

This skill serves as the **template index** for the ad generation pipeline. The ad copy generator (skill 3) references this registry to dynamically select templates based on the client's `ad_type` and data.

## How Templates Work

There are two sources of templates:

1. **Base templates** (`templates/layouts/*.html`) — 6 HTML files with `{{placeholder}}` syntax. Used as anchors in every ad set.
2. **Extended templates** (`templates/extra/{category}/*.md` + descriptions below) — Creative briefs that the ad designer (skill 4) converts to inline HTML. These provide variety and uniqueness per client.

Templates are **auto-selected** by the copy generator based on client data scoring. There is no manual "pick which extras you want" step.

## Base Templates (6)

| ID | File | Best For | Tangible | Intangible |
|---|---|---|---|---|
| hero-overlay | `layouts/hero-overlay.html` | Strong hero visual, emotional hook | Yes (product photo) | Yes (gradient bg) |
| bold-statement | `layouts/bold-statement.html` | Bold headline, text-only | No | Yes |
| split-horizontal | `layouts/split-horizontal.html` | Product + text, before/after | Yes | Yes |
| comparison | `layouts/comparison.html` | Before vs After two-column | No | Yes |
| benefit-stack | `layouts/benefit-stack.html` | Numbered benefits list | Yes | Yes |
| testimonial-card | `layouts/testimonial-card.html` | Social proof, quote focus | Yes | Yes |

## Extended Templates — Index

Templates marked with `[.md]` have a detailed `.md` file in `templates/extra/`. Templates without `[.md]` are described in this skill — the ad designer generates HTML from whichever description is available.

### comparison/ (13 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 07 [.md] | Us vs Them | Clear competitive advantages, 5v5 checklist | Yes | Yes |
| 25 [.md] | Color-Split VS | Brand vs competitor with comic-style burst | Yes | Yes |
| 31 [.md] | Comparison Grid | Meme-format table, viral potential | Yes | Yes |
| 41 [.md] | Nutritional Stat Comparison | Stats side-by-side with numbers | Yes | No |
| 42 [.md] | Two-Option Comparison | Same-brand variants in table with emojis | Yes | Yes |
| 44 [.md] | Lifestyle Photo Comparison | Aspirational vs unflattering photos | Yes | No |
| 46 [.md] | Head-to-Head Competitor | Named competitor with price + benefits | Yes | Yes |
| 53 [.md] | Old vs Upgrade | Worn-out vs sleek, dark-to-light split | Yes | Yes |
| 57 | Toggle On/Off | Green/red toggles for benefits vs bad habits | Yes | Yes |
| 58 | But Better (Same Brand) | Same-brand old vs new upgrade | Yes | Yes |
| 59 | More-Than Equivalency | "More protein than 3 eggs" framing | Yes | No |
| 60 | Two-Option Food Stats | Nutrition columns side-by-side | Yes | No |
| 61 | CAPTCHA Select All | Pattern interrupt grid mimicking CAPTCHA | Yes | Yes |

### data-driven/ (11 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 13 [.md] | Stat Surround Product | Product center, 4 stats flanking | Yes | No |
| 18 [.md] | Stat Surround Lifestyle | Lifestyle photo, 4 stat callouts | Yes | No |
| 26 [.md] | Stat Callout Lifestyle | Single bold stat as headline | Yes | Yes |
| 27 [.md] | Benefit Checklist | Split: product + star rating + checklist | Yes | Yes |
| 49 [.md] | Ingredients Breakdown | Ingredient list with arrows to product | Yes | No |
| 62 | Quote Headline + Stats | Punchy quote headline, 2 stat badges | Yes | Yes |
| 63 | FAQ Stat Answer | FAQ question format with reassuring stat | Yes | Yes |
| 64 | Weight Loss Timeline | Day-by-day progress with descending numbers | Yes | Yes |
| 65 | Sales Velocity Stat | "1 SOLD every 5 SECONDS" FOMO metric | Yes | Yes |
| 66 | Review Count Stat Hero | Massive review count number as persuasion | Yes | Yes |
| 67 | Sales Milestone Badge | Circular milestone badge ("2M CUPS SOLD") | Yes | Yes |

### editorial-authority/ (9 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 10 [.md] | Press Editorial | "As Featured In" + press logos + pull-quote | Yes | Yes |
| 20 [.md] | Advertorial | Looks like editorial content, not an ad | Yes | Yes |
| 23 [.md] | Manifesto | Copy-dominant, provocative argument | No | Yes |
| 33 [.md] | Faux Press | Fake news article screenshot | Yes | Yes |
| 68 | Award Badge + Press Bar | Multi-award badge + press logo bar | Yes | Yes |
| 69 | Enterprise Logo Wall | "As Seen On" corporate logos | No | Yes |
| 70 | Doctor Recommended | Expert badge + payment icons + guarantee | Yes | Yes |
| 71 | Press Quote + Media Strip | Large editorial quote + media logos | Yes | Yes |
| 72 | Expert Credential Testimonial | Named expert pull-quote with title badge | No | Yes |

### lifestyle/ (14 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 12 [.md] | Lifestyle Action + Colorway | Action shot + product variants | Yes | No |
| 21 [.md] | Bold Statement | Vibrant gradient, playful headline | Yes | Yes |
| 22 [.md] | Flavor Story | Food/flavor visualization | Yes | No |
| 39 [.md] | Curiosity Gap Scroll-Stopper | No product, pure hook headline | No | Yes |
| 55 [.md] | Lifestyle Label Tags | Two photos with floating keyword tags | Yes | Yes |
| 73 | Humor Floating Callouts | Witty text annotations around product | Yes | Yes |
| 74 | Girl Math Value Calc | Viral cost breakdown justifying price | Yes | Yes |
| 75 | Fourth Wall Humor | Self-aware ad breaking fourth wall | Yes | Yes |
| 76 | Brand Intro Empathetic | Soft lifestyle, empathetic headline | No | Yes |
| 77 | Conversational Launch Teaser | Minimalist, playful conversational headline | Yes | Yes |
| 78 | Soft Emotional Aspirational | Blurred photo, empathetic copy | No | Yes |
| 79 | Ambient Reminder CTA | Desk photo, "REMINDER" overlay | Yes | Yes |
| 80 | Billboard Mockup | Outdoor billboard showing product + quote | Yes | Yes |
| 81 | Lifestyle Hack + Discount | "My morning hack" framing + discount ticker | Yes | Yes |

### product-hero/ (22 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 01 [.md] | Headline | Clean headline + product shot | Yes | No |
| 04 [.md] | Features-Benefits | Diagram with 4 callout boxes | Yes | No |
| 05 [.md] | Bullet Points | Product left, 5 bullets right | Yes | No |
| 28 [.md] | Feature Arrow Callout | Hand-drawn arrows to benefit labels | Yes | No |
| 30 [.md] | Hero Statement + Icon Bar | Bold statement + 3 icon benefits | Yes | Yes |
| 35 [.md] | Hero Showcase + Stat Bar | Product + ingredient elements + stat bar | Yes | No |
| 43 [.md] | What's Included Kit | Grid of 5 items with labels | Yes | No |
| 48 [.md] | Benefits List Stack | "X benefits of..." headline + stacked rows | Yes | Yes |
| 56 [.md] | App Product Launch | Logo + product name + stat + icon | No | Yes |
| 82 | Dark Problem-Solution Icons | Dark bg, problem headline, 4 benefit rows | Yes | Yes |
| 83 | Annotation Lines Rotated | Hand-drawn annotation lines to features | Yes | No |
| 84 | Dark Benefit List + Price | Dark bg, checkmark benefits, price badge | Yes | No |
| 85 | 2x2 Color Panel Grid | 4 color-blocked panels with product + benefit | Yes | No |
| 86 | Orbiting Benefit Callouts | Dark bg, floating labels around product | Yes | Yes |
| 87 | Multi-SKU Lineup | 3 rows: SKU image + provocative headline | Yes | No |
| 88 | Radial Ingredient Icons | 6 circular icons radiating from product | Yes | No |
| 89 | Dark Minimal SaaS | Clean SaaS/app energy, dark bg, CTA | No | Yes |
| 90 | Audience-Targeted Claim | App mockup, audience-specific headline | No | Yes |
| 91 | App Download Lifestyle | Action photo + download badges | No | Yes |
| 92 | Product Grid Subscription | 4-panel photos + subscribe overlay | Yes | No |
| 93 | Problem-Solution Split Icons | Dark/light vertical split with icons | Yes | Yes |
| 94 | Feature Checklist Panel | Bold name, dark feature box, 4 checkmarks | Yes | No |

### promotional/ (11 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 02 [.md] | Offer Promotion | Split bg, product + offer + value adds | Yes | Yes |
| 14 [.md] | Bundle Showcase | Open box + benefit bar segments | Yes | No |
| 37 [.md] | Hero Statement Promo | Dark bg + starburst discount + icon benefits | Yes | Yes |
| 45 [.md] | Product Grid Offer | 3x3 mosaic with centered offer overlay | Yes | No |
| 50 [.md] | Flash Sale | Lightning bolt + giant SALE + phone mockup | Yes | Yes |
| 54 [.md] | Product Grid Discount | 2x2: 3 product photos + discount panel | Yes | No |
| 95 | Scarcity Urgency Models | Models + discount + "won't do this again" | Yes | Yes |
| 96 | News Alert Urgency | Cash hero bg, "LIMITED FUNDING" banner | Yes | Yes |
| 97 | Seasonal Resolution Hook | Year callout + solutions + benefit bullets | Yes | Yes |
| 98 | BOGO Urgency Grid | Product grid + BOGO banner + stock badge | Yes | No |
| 99 | Split Panel Sale | Lifestyle left, sale CTA right | Yes | Yes |

### social-proof/ (26 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 03 [.md] | Testimonials | Product in real setting + quote + stars | Yes | Yes |
| 06 [.md] | Social Proof | Member count + review card + press logos | Yes | Yes |
| 09 [.md] | Negative Marketing | Fake 1-star that's actually a rave | Yes | Yes |
| 11 [.md] | Pull Quote Review | Emotional quote + truncated "Read more" | Yes | Yes |
| 15 [.md] | Social Comment Screenshot | Screenshotted comment + product | Yes | Yes |
| 16 [.md] | Curiosity Gap Hook | Bait-and-switch testimonial headline | Yes | Yes |
| 17 [.md] | Verified Review Card | Review platform UI with verified badge | Yes | Yes |
| 19 [.md] | Highlighted Testimonial | Long-form review with highlighter effect | Yes | Yes |
| 24 [.md] | Product Comment Callout | Product + Facebook comment card | Yes | Yes |
| 38 [.md] | UGC Lifestyle Review Split | UGC photo left, brand + review right | Yes | Yes |
| 47 [.md] | Bold Headline Review | Big claim headline + review + product | Yes | Yes |
| 51 [.md] | Review Product Float | Stars + review + product on palm | Yes | Yes |
| 52 [.md] | Review Benefits Icons | Review + icons + product collage | Yes | Yes |
| 100 | Multi-Testimonial Grid | 2x2 review cards around product | Yes | Yes |
| 101 | Quad Panel Hybrid | Guarantee + lineup + UGC + quote | Yes | Yes |
| 102 | Speech Bubble Lifestyle | Lifestyle photo + 2 speech bubbles | Yes | Yes |
| 103 | Tweet + Product + Sale | Tweet screenshot + product + discount | Yes | Yes |
| 104 | Emotional Poem Overlay | Product photo + handwritten poem | Yes | No |
| 105 | Yellow Textured Quote Card | Dark frame, yellow paper, serif quote | No | Yes |
| 106 | Dual Named Review Cards | Credibility header + 2 review cards | Yes | Yes |
| 107 | Popup Card Testimonial | App-like card UI with testimonial | Yes | Yes |
| 108 | Bold Quote + Product Row | Large quote + product row below | Yes | Yes |
| 109 | Multi-Badge Trust Stack | Baby/lifestyle + stacked trust badges | Yes | Yes |
| 110 | Dual Trustpilot Stack | 2 full Trustpilot review entries | Yes | Yes |
| 111 | Dual Stacked Quotes | Product + 2 quote snippets with stars | Yes | Yes |
| 112 | Lifestyle Press Benefit Bar | Dark lifestyle + benefit badges + press logos | Yes | Yes |

### ugc-native/ (17 templates)

| ID | Name | Best For | Tangible | Intangible |
|---|---|---|---|---|
| 08 [.md] | Before & After | Mirror selfie transformation split | Yes | Yes |
| 29 [.md] | UGC Viral Post | Selfie + Reddit/Twitter overlay | Yes | Yes |
| 32 [.md] | UGC Story Callout | Instagram Story with 5 text bubbles | Yes | Yes |
| 34 [.md] | Faux iPhone Notes | Disguised as Notes app screenshot | Yes | Yes |
| 36 [.md] | Whiteboard Before/After | Photo with whiteboard drawings | Yes | Yes |
| 40 [.md] | Post-it Note Product | Product photo + handwritten post-it | Yes | Yes |
| 113 | iPhone Notes Checklist | iOS Notes with circular checkboxes | Yes | Yes |
| 114 | ChatGPT Conversation | Simulated ChatGPT UI response | Yes | Yes |
| 115 | iMessage Recommendation | Friend recommending via iMessage | Yes | Yes |
| 116 | Google SERP Mockup | Product as top Google search result | Yes | Yes |
| 117 | AirDrop Notification | iOS AirDrop overlay on lifestyle photo | Yes | Yes |
| 118 | Meme Format | Classic "Literally no one: / Me:" format | Yes | Yes |
| 119 | UGC Collage + Bold Quote | 3-panel UGC collage + customer quote | Yes | Yes |
| 120 | Reddit Community Post | Reddit post UI with upvotes + reply | Yes | Yes |
| 121 | Twitter Conversation | Customer tweet + brand reply | Yes | Yes |
| 122 | Phone Screen Story | Phone UI frame, text-only personal story | No | Yes |
| 123 | Facebook Post Screenshot | Full Facebook post UI with testimonial | Yes | Yes |

## Category Scoring Guide

The ad copy generator uses this scoring to select templates:

| Category | Score +3 | Score +2 | Score +1 |
|---|---|---|---|
| social-proof | Has testimonials/reviews | Has social proof credentials | Has user count |
| comparison | Has differentiator vs named competitors | Has pain points with clear before/after | Has pricing advantage |
| data-driven | Has specific numbers/stats | Has quantifiable results | Has review counts |
| editorial-authority | Has press coverage or awards | Has professional credentials | Has industry recognition |
| lifestyle | — | Brand is personality-driven | Audience is emotionally motivated |
| ugc-native | — | Audience is social-media-savvy (18-35) | Brand voice is casual |
| promotional | Has active offer/discount | Has pricing/bundle info | Has seasonal hook |
| product-hero | Has multi-SKU/variants (tangible) | Has features to diagram | Has app/digital product |

## How the Ad Designer Generates HTML from Template Descriptions

1. **If template has a `.md` file** (marked `[.md]` in index): read the file from `templates/extra/{category}/`, extract `required_fields` from frontmatter, follow the visual layout description in the body
2. **If template has no `.md` file**: use the description from this skill's index tables above — the Name + Best For columns plus the category-level descriptions provide enough creative direction
3. **Build complete 1080x1080px HTML** with:
   - Brand colors from `brand-assets.json`
   - Fonts: Montserrat (heading) + Inter (body) unless template specifies otherwise
   - `base.css` linked for shared styles
   - All text centered by default, broken with `<br>` for natural line breaks
4. **For tangible ads**: product images MUST be included. Use `brief/images/product-*.{ext}` or AI-generated images
5. **For intangible ads**: no generic stock photos. Use solid color gradients as default. Template-specific visuals (phone UI mockups, social post screenshots) should be built with CSS/HTML
6. **Save to** `output/{client-slug}/html/ad-{number}-{template-name}.html`
7. **All output must pass the anti-AI slop check** (skill 7)

## Important Rules
- Templates are auto-selected — no manual picking step
- Each client should get a unique mix of templates based on their data
- Check `output/` for recent clients — avoid reusing the same extra template IDs within the last 3 clients
- The `layout_recommendation` format is either a base template name (`"hero-overlay"`) or `"extra:{category}/{id}-{name}"` (e.g., `"extra:social-proof/17-verified-review-card"`)
