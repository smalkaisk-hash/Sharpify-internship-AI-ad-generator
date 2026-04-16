---
name: 8-extra-templates
description: Complete index of 120+ ad layout templates (6 base HTML + 56 extended .md descriptions + 60+ unlinked patterns) organized by category — comparison, data-driven, editorial, lifestyle, product-hero, promotional, social-proof, ugc-native. Read this skill whenever picking layouts for an ad set — skill 3-ad-copy uses it to select templates, skill 4-ad-designer uses it to generate HTML. Contains the placeholder reference table for base templates and creative briefs for extended templates.
---

# Template Registry — Ad Creative Library

This is the complete index of all available ad templates. The ad copy generator (skill 3) browses this registry and picks whatever templates best serve each client. There are no mandatory templates and no eligibility restrictions — the only rule is tangible products need product imagery, intangible don't use stock photos.

## Template Sources

1. **Base templates** (`templates/layouts/*.html`) — 6 pre-built HTML files with `{{placeholder}}` syntax
2. **Extended templates** (`templates/extra/{category}/*.md`) — 56 detailed creative briefs. The ad designer generates HTML inline from these descriptions
3. **Additional templates** (described below, #57-123) — described in this skill file. The ad designer generates HTML from these descriptions
4. **Visual previews** — 319 PNG previews in `template-pages/` for visual reference

## All Templates

### Base Templates (pre-built HTML)

| ID | Name | Best For |
|---|---|---|
| hero-overlay | Full-bleed image/gradient + text overlay | Strong visual hook, emotional appeal |
| bold-statement | Large centered headline on color background | Text-driven scroll-stopper |
| split-horizontal | Image top + text bottom (or split) | Product showcase, before/after |
| comparison | Two-column red vs green | Before vs After, competitive advantage |
| benefit-stack | Numbered benefits list + CTA | Feature/benefit listings |
| testimonial-card | Quote + author + stars | Social proof, customer validation |

### Base template placeholders

All base templates share these **core placeholders**:
`{{color_primary}}`, `{{color_secondary}}`, `{{color_accent}}`, `{{color_bg}}`, `{{color_text}}`, `{{color_cta_bg}}`, `{{color_cta_text}}`, `{{font_heading}}`, `{{font_body}}`, `{{language}}`, `{{cta_text}}`.

Per-template additional fields:

| Template | Additional placeholders |
|---|---|
| hero-overlay | `{{headline}}`, `{{primary_text}}`, `{{hero_image}}`, `{{logo_url}}`, `{{client_name}}` |
| bold-statement | `{{headline}}`, `{{primary_text}}`, `{{hero_image}}`, `{{footer_tagline}}` |
| split-horizontal | `{{headline}}`, `{{primary_text}}`, `{{hero_image}}`, `{{logo_url}}`, `{{client_name}}` |
| comparison | `{{headline}}`, `{{before_label}}`, `{{after_label}}`, `{{before_icon_1..5}}`, `{{before_text_1..5}}`, `{{after_icon_1..5}}`, `{{after_text_1..5}}` |
| benefit-stack | `{{headline}}`, `{{subheadline}}`, `{{badge_text}}`, `{{benefit_1..4_title}}`, `{{benefit_1..4_desc}}` |
| testimonial-card | `{{testimonial_text}}`, `{{author_name}}`, `{{author_title}}`, `{{author_photo}}`, `{{logo_url}}`, `{{client_name}}` |

### comparison/ (13 templates)

| ID | Name | Best For |
|---|---|---|
| 07 [.md] | Us vs Them | 5v5 checklist, brand vs competitor |
| 25 [.md] | Color-Split VS | Comic-style burst divider, vibrant vs muted |
| 31 [.md] | Comparison Grid | Meme-format table, viral potential |
| 41 [.md] | Nutritional Stat Comparison | Stats side-by-side with numbers |
| 42 [.md] | Two-Option Comparison | Same-brand variants with emojis |
| 44 [.md] | Lifestyle Photo Comparison | Aspirational vs unflattering photos |
| 46 [.md] | Head-to-Head Competitor | Named competitor, price + benefits |
| 53 [.md] | Old vs Upgrade | Worn-out vs sleek, dark-to-light |
| 57 | Toggle On/Off | Green/red toggles for benefits |
| 58 | But Better (Same Brand) | Old vs new upgrade within brand |
| 59 | More-Than Equivalency | "More protein than 3 eggs" framing |
| 60 | Two-Option Food Stats | Nutrition columns side-by-side |
| 61 | CAPTCHA Select All | Pattern interrupt grid mimicking CAPTCHA |

### data-driven/ (11 templates)

| ID | Name | Best For |
|---|---|---|
| 13 [.md] | Stat Surround Product | Product center, 4 stats flanking |
| 18 [.md] | Stat Surround Lifestyle | Lifestyle photo, 4 stat callouts |
| 26 [.md] | Stat Callout Lifestyle | Single bold stat as headline |
| 27 [.md] | Benefit Checklist | Split: product + star rating + checklist |
| 49 [.md] | Ingredients Breakdown | Ingredient list with arrows to product |
| 62 | Quote Headline + Stats | Punchy quote headline, 2 stat badges |
| 63 | FAQ Stat Answer | FAQ question format with reassuring stat |
| 64 | Weight Loss Timeline | Day-by-day progress with descending numbers |
| 65 | Sales Velocity Stat | "1 SOLD every 5 SECONDS" FOMO metric |
| 66 | Review Count Stat Hero | Massive review count number |
| 67 | Sales Milestone Badge | Circular milestone badge ("2M CUPS SOLD") |

### editorial-authority/ (9 templates)

| ID | Name | Best For |
|---|---|---|
| 10 [.md] | Press Editorial | "As Featured In" + press logos + pull-quote |
| 20 [.md] | Advertorial | Looks like editorial content, not an ad |
| 23 [.md] | Manifesto | Copy-dominant, provocative argument |
| 33 [.md] | Faux Press | Fake news article screenshot |
| 68 | Award Badge + Press Bar | Multi-award badge + press logo bar |
| 69 | Enterprise Logo Wall | "As Seen On" corporate logos |
| 70 | Doctor Recommended | Expert badge + payment icons + guarantee |
| 71 | Press Quote + Media Strip | Large editorial quote + media logos |
| 72 | Expert Credential Testimonial | Named expert pull-quote with title |

### lifestyle/ (14 templates)

| ID | Name | Best For |
|---|---|---|
| 12 [.md] | Lifestyle Action + Colorway | Action shot + product variants |
| 21 [.md] | Bold Statement | Vibrant gradient, playful headline |
| 22 [.md] | Flavor Story | Food/flavor visualization |
| 39 [.md] | Curiosity Gap Scroll-Stopper | No product, pure hook headline |
| 55 [.md] | Lifestyle Label Tags | Two photos with floating keyword tags |
| 73 | Humor Floating Callouts | Witty text annotations around product |
| 74 | Girl Math Value Calc | Viral cost breakdown justifying price |
| 75 | Fourth Wall Humor | Self-aware ad breaking fourth wall |
| 76 | Brand Intro Empathetic | Soft lifestyle, empathetic headline |
| 77 | Conversational Launch Teaser | Minimalist, playful conversational |
| 78 | Soft Emotional Aspirational | Blurred photo, empathetic copy |
| 79 | Ambient Reminder CTA | Desk photo, "REMINDER" overlay |
| 80 | Billboard Mockup | Outdoor billboard showing product + quote |
| 81 | Lifestyle Hack + Discount | "My morning hack" + discount ticker |

### product-hero/ (22 templates)

| ID | Name | Best For |
|---|---|---|
| 01 [.md] | Headline | Clean headline + product shot |
| 04 [.md] | Features-Benefits | Diagram with 4 callout boxes |
| 05 [.md] | Bullet Points | Product left, 5 bullets right |
| 28 [.md] | Feature Arrow Callout | Hand-drawn arrows to benefit labels |
| 30 [.md] | Hero Statement + Icon Bar | Bold statement + 3 icon benefits |
| 35 [.md] | Hero Showcase + Stat Bar | Product + ingredient elements + stat bar |
| 43 [.md] | What's Included Kit | Grid of 5 items with labels |
| 48 [.md] | Benefits List Stack | "X benefits of..." + stacked rows |
| 56 [.md] | App Product Launch | Logo + product name + stat + icon |
| 82 | Dark Problem-Solution Icons | Dark bg, problem headline, 4 benefit rows |
| 83 | Annotation Lines Rotated | Hand-drawn annotation lines to features |
| 84 | Dark Benefit List + Price | Dark bg, checkmark benefits, price badge |
| 85 | 2x2 Color Panel Grid | 4 color-blocked panels with product + benefit |
| 86 | Orbiting Benefit Callouts | Dark bg, floating labels around product |
| 87 | Multi-SKU Lineup | 3 stacked rows: SKU image + headline |
| 88 | Radial Ingredient Icons | 6 circular icons radiating from product |
| 89 | Dark Minimal SaaS | Clean SaaS/app energy, dark bg, CTA |
| 90 | Audience-Targeted Claim | App mockup, audience-specific headline |
| 91 | App Download Lifestyle | Action photo + download badges |
| 92 | Product Grid Subscription | 4-panel photos + subscribe overlay |
| 93 | Problem-Solution Split Icons | Dark/light vertical split with icons |
| 94 | Feature Checklist Panel | Bold name, dark feature box, 4 checkmarks |

### promotional/ (11 templates)

| ID | Name | Best For |
|---|---|---|
| 02 [.md] | Offer Promotion | Split bg, product + offer + value adds |
| 14 [.md] | Bundle Showcase | Open box + benefit bar segments |
| 37 [.md] | Hero Statement Promo | Dark bg + starburst discount + icons |
| 45 [.md] | Product Grid Offer | 3x3 mosaic with centered offer overlay |
| 50 [.md] | Flash Sale | Lightning bolt + giant SALE + phone mockup |
| 54 [.md] | Product Grid Discount | 2x2: 3 product photos + discount panel |
| 95 | Scarcity Urgency Models | Models + discount + "won't do this again" |
| 96 | News Alert Urgency | Cash hero bg, "LIMITED FUNDING" banner |
| 97 | Seasonal Resolution Hook | Year callout + solutions + benefit bullets |
| 98 | BOGO Urgency Grid | Product grid + BOGO banner + stock badge |
| 99 | Split Panel Sale | Lifestyle left, sale CTA right |

### social-proof/ (26 templates)

| ID | Name | Best For |
|---|---|---|
| 03 [.md] | Testimonials | Product in real setting + quote + stars |
| 06 [.md] | Social Proof | Member count + review card + press logos |
| 09 [.md] | Negative Marketing | Fake 1-star that's actually a rave |
| 11 [.md] | Pull Quote Review | Emotional quote + truncated "Read more" |
| 15 [.md] | Social Comment Screenshot | Screenshotted comment + product |
| 16 [.md] | Curiosity Gap Hook | Bait-and-switch testimonial headline |
| 17 [.md] | Verified Review Card | Review platform UI with verified badge |
| 19 [.md] | Highlighted Testimonial | Long-form review with highlighter effect |
| 24 [.md] | Product Comment Callout | Product + Facebook comment card |
| 38 [.md] | UGC Lifestyle Review Split | UGC photo left, brand + review right |
| 47 [.md] | Bold Headline Review | Big claim headline + review + product |
| 51 [.md] | Review Product Float | Stars + review + product on palm |
| 52 [.md] | Review Benefits Icons | Review + icons + product collage |
| 100 | Multi-Testimonial Grid | 2x2 review cards around product |
| 101 | Quad Panel Hybrid | Guarantee + lineup + UGC + quote |
| 102 | Speech Bubble Lifestyle | Lifestyle photo + 2 speech bubbles |
| 103 | Tweet + Product + Sale | Tweet screenshot + product + discount |
| 104 | Emotional Poem Overlay | Product photo + handwritten poem |
| 105 | Yellow Textured Quote Card | Dark frame, yellow paper, serif quote |
| 106 | Dual Named Review Cards | Credibility header + 2 review cards |
| 107 | Popup Card Testimonial | App-like card UI with testimonial |
| 108 | Bold Quote + Product Row | Large quote + product row below |
| 109 | Multi-Badge Trust Stack | Lifestyle + stacked trust badges |
| 110 | Dual Trustpilot Stack | 2 full Trustpilot review entries |
| 111 | Dual Stacked Quotes | Product + 2 quote snippets with stars |
| 112 | Lifestyle Press Benefit Bar | Dark lifestyle + benefit badges + press logos |

### ugc-native/ (17 templates)

| ID | Name | Best For |
|---|---|---|
| 08 [.md] | Before & After | Mirror selfie transformation split |
| 29 [.md] | UGC Viral Post | Selfie + Reddit/Twitter overlay |
| 32 [.md] | UGC Story Callout | Instagram Story with 5 text bubbles |
| 34 [.md] | Faux iPhone Notes | Disguised as Notes app screenshot |
| 36 [.md] | Whiteboard Before/After | Photo with whiteboard drawings |
| 40 [.md] | Post-it Note Product | Product photo + handwritten post-it |
| 113 | iPhone Notes Checklist | iOS Notes with circular checkboxes |
| 114 | ChatGPT Conversation | Simulated ChatGPT UI response |
| 115 | iMessage Recommendation | Friend recommending via iMessage |
| 116 | Google SERP Mockup | Product as top Google search result |
| 117 | AirDrop Notification | iOS AirDrop overlay on lifestyle photo |
| 118 | Meme Format | Classic "Literally no one: / Me:" format |
| 119 | UGC Collage + Bold Quote | 3-panel UGC collage + customer quote |
| 120 | Reddit Community Post | Reddit post UI with upvotes + reply |
| 121 | Twitter Conversation | Customer tweet + brand reply |
| 122 | Phone Screen Story | Phone UI frame, text-only personal story |
| 123 | Facebook Post Screenshot | Full Facebook post UI with testimonial |

## How the Ad Designer Generates HTML from Template Descriptions

1. **If template has a `.md` file** (marked `[.md]` in index): read from `templates/extra/{category}/`, extract `required_fields` from frontmatter, follow the visual layout description
2. **If template has no `.md` file**: use the description from this registry + the category context to generate appropriate HTML
3. **Build complete 1080x1080px HTML** with:
   - Brand colors from `brand-assets.json`
   - Fonts: Montserrat (heading) + Inter (body) unless template specifies otherwise
   - `base.css` linked for shared styles
   - All text centered by default, broken with `<br>` for natural line breaks
4. **For tangible ads**: product images MUST be included
5. **For intangible ads**: no generic photos. Use gradients, CSS-built visuals, or template-specific treatments
6. **Save to** `clients/output/{client-slug}/html/ad-{number}-{template-name}.html`
7. **All output must pass the anti-AI slop check** (skill 7)
8. **Visual reference**: check `template-pages/` for 319 PNG previews of rendered templates

## Important Rules
- No mandatory templates — the AI chooses what's best for each client
- Each ad should use a different template for variety
- The `layout_recommendation` format is either a base template name (`"hero-overlay"`) or `"extra:{category}/{id}-{name}"` (e.g., `"extra:social-proof/17-verified-review-card"`)
