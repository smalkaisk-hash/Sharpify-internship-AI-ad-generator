---
name: 8-extra-templates
description: Generate additional ad creatives from extended template library beyond the 6 defaults
---

# Extra Templates — Extended Ad Creative Library

## How It Works

The ad generation pipeline has two tiers:

### Tier 1: Default 6 (Always Generated)
These are always generated for every client via the standard pipeline:
1. `ad-v1-hero-overlay` — PAS framework, teal gradient bg, centered text
2. `ad-v2-bold-statement` — AIDA framework, dark bg, bold headline broken into lines
3. `ad-v3-split-horizontal` — Before/After, color block top + text bottom
4. `ad-v4-comparison` — Before vs After two-column comparison
5. `ad-v5-benefit-stack` — Numbered benefits on white bg
6. `ad-v6-editorial` — White bg, Playfair Display serif, gold accents

### Tier 2: Extra Templates (Generated on Request or When Relevant)
Located in `templates/extra/{category}/`. Each template is a `.md` file with:
- **Frontmatter**: name, number, category, best_for, required_fields
- **Body**: Detailed prompt describing the visual layout

## Template Categories

### comparison/
For brands with clear competitive advantages.
- `07-us-vs-them.md` — Side-by-side VS layout. Your brand vs competitor category. 5 strengths vs 5 weaknesses with checkmarks/X marks.
- `25-us-vs-them-color-split.md` — Vibrant brand color vs muted competitor. 4 strengths vs 4 weaknesses. Comic-style VS burst divider.
- `31-comparison-grid.md` — Meme-format table. Product photos top, 3-row comparison below. No icons — copy contrast does the work. Viral potential.
- `41-nutritional-stat-comparison.md` — Stats side-by-side with numbers. Brand vs competitor with checkmark/X icons, large stat values flanking products. Data does the talking.
- `42-two-option-comparison.md` — Same-brand two options in a table. Emojis add personality. Great for product variants, tiers, or usage modes.
- `44-lifestyle-photo-comparison.md` — Full-bleed lifestyle photos make the comparison visceral. Unflattering competitor photo vs aspirational brand photo with feature lists.
- `46-head-to-head-competitor.md` — Name the competitor directly. Side-by-side product photos with price + benefits. DTC challenger vs incumbent.
- `53-old-vs-upgrade.md` — Worn-out old product vs sleek new one. Dark-to-light split. The visual degradation gap sells the upgrade.

### data-driven/
For brands with impressive stats, numbers, or clinical results.
- `13-stat-surround-product.md` — Product center, 4 stats flanking with curved arrows. Price badge. Scannable in 2 seconds.
- `18-stat-surround-lifestyle.md` — Lifestyle flatlay with hand-held product, 4 stat callouts with arrows. Energetic, appetizing.
- `26-stat-callout-lifestyle.md` — Statistic IS the headline. Lifestyle photo top, dark gradient bottom with bold stat text. No subhead needed.
- `27-benefit-checklist.md` — Split layout: product photo left, star rating + benefits checklist + CTA right. Information-dense.
- `49-ingredients-breakdown.md` — Ingredient list with small images + benefit labels, curved arrows pointing to product. Shows what's inside and why it matters.

### editorial-authority/
For premium brands with press coverage, strong stories, or viral presence.
- `10-press-editorial.md` — "As Featured In" + grayscale press logos + serif pull-quote. Vogue back-page energy.
- `20-advertorial.md` — Looks like organic editorial content, not an ad. Moody portrait + oversized headline. Culture account vibe.
- `23-manifesto.md` — Copy-dominant. White bg, provocative headline, short punchy sentences building an argument. The writing IS the ad.
- `33-faux-press.md` — Looks like a real news article screenshot. Publication masthead + headline + UGC photos. Viral shareability.

### lifestyle/
For brands with strong personality, visual products, or taste/experience as the selling point.
- `12-lifestyle-action-colorway.md` — Action hero shot + fanned product variants. Athletic/outdoor brands with multiple colorways.
- `21-bold-statement.md` — Pure brand energy. Vibrant gradient, playful oversized headline, product. No stats, no reviews. The vibe IS the ad.
- `22-flavor-story.md` — Food/flavor visualization. Indulgent food photo bg + product placed in scene + stat bar. Taste is the hero.
- `39-curiosity-gap-scroll-stopper.md` — No product, no logo, no branding. Hook headline + problem photo. Pure curiosity. Earns the click.
- `55-lifestyle-label-tags.md` — Two lifestyle photos side-by-side with floating keyword tags (Luxury, Classy, Comfortable). The labels name the aspiration.

### product-hero/
For product-focused ads where the item is the star.
- `01-headline.md` — Clean headline + subhead + product shot. Authoritative first impression. Good for testing.
- `04-features-benefits.md` — Educational diagram. Product center, 4 callout boxes with connecting lines. Scientific luxury feel.
- `05-bullet-points.md` — Split composition. Product left 40%, 5 bullet benefits right 60%. Clean and scannable.
- `28-feature-arrow-callout.md` — Hand-drawn arrows from product to benefit labels. Editorial feel. Promo banner bottom.
- `30-hero-statement-icon-bar.md` — Bold 2-3 word statement + lifestyle product photo + 3 icon benefits + social proof ticker.
- `35-hero-showcase-stat-bar.md` — Product hero with exploded ingredient elements + stat bar with 3 metrics.
- `43-whats-included-kit.md` — Grid of 5 included items with labels. Shows everything they get. Subscription boxes, starter kits, welcome packs.
- `48-benefits-list-stack.md` — "X benefits of..." headline + stacked label rows + product on the side. Scannable list format.
- `56-app-product-launch.md` — Brand logo + product name + key stat + mascot/icon. Launch announcement energy for apps and digital products.

### promotional/
For sales, discounts, bundles, and urgency-driven campaigns.
- `02-offer-promotion.md` — Split color bg, product at intersection, offer text top, value adds bottom. The money-maker.
- `14-bundle-showcase.md` — Open box hero + benefit bar segments + gradient bg. Sells the system, not the SKU.
- `37-hero-statement-promo.md` — Moody dark bg + starburst discount badge + icon benefits + promo banner. Black Friday energy.
- `45-product-grid-offer.md` — 3x3 product photo mosaic with centered offer card overlay. Retention/reorder campaigns.
- `50-flash-sale.md` — Lightning bolt + giant SALE text + percentage + phone mockup. Pure urgency, seasonal clearance energy.
- `54-product-grid-discount.md` — 2x2 grid: 3 product photos + branded discount panel in 4th quadrant. Clean grid, strong offer.

### social-proof/
For brands with reviews, testimonials, press coverage, or large user bases. The biggest category.
- `03-testimonials.md` — Product in real setting + quote overlay + stars. Warm, authentic.
- `06-social-proof.md` — Member count + review card + press logos. The full trust stack.
- `09-negative-marketing.md` — Fake 1-star review that's actually a rave. Bait & switch scroll-stopper.
- `11-pull-quote-review.md` — Emotional quote on color block + truncated review card with "...Read more" open loop.
- `15-social-comment-screenshot.md` — Screenshotted social comment + product below. Raw, organic feel.
- `16-curiosity-gap-hook.md` — Provocative bait-and-switch testimonial headline. Double-take machine.
- `17-verified-review-card.md` — Mimics real review platform UI. Verified badge + helpfulness count.
- `19-highlighted-testimonial.md` — Long-form review with highlighter pen on key phrases. Emotional detail.
- `24-product-comment-callout.md` — Product top + Facebook comment card bottom. Organic screenshot feel.
- `38-ugc-lifestyle-review-split.md` — Vertical split: casual UGC photo left, brand color + product + review right.
- `47-bold-headline-review.md` — Big bold claim headline + review card with stars + product below. The headline hooks, the review proves.
- `51-review-product-float.md` — Stars + review + highlighted quote + product floating on an open palm. Elegant dark-bg social proof.
- `52-review-benefits-icons.md` — Star review + benefit icons + product collage on one side, lifestyle photo on the other. Maximum proof density.

### ugc-native/
For ads that look like real user posts, not ads. Anti-ad aesthetic.
- `08-before-after.md` — Mirror selfie transformation split. Grainy iPhone, CapCut stitched feel.
- `29-ugc-viral-post.md` — Casual selfie + Reddit/Twitter post overlay. The opinion is the hook. Zero branding.
- `32-ugc-story-callout.md` — Instagram Story with 5 text bubbles. Casual hand-placed educational feel.
- `34-faux-iphone-notes.md` — Disguised as iPhone Notes app screenshot. Food-equivalency benefit comparisons.
- `36-whiteboard-before-after.md` — Real photo with whiteboard drawings. Casual educational, not an ad.
- `40-postit-note-product.md` — Lifestyle product photo with handwritten post-it note. Feels found, not composed.

### comparison/ (new additions)
For brands with clear competitive advantages — expanded patterns.
- `57-toggle-on-off.md` — Toggle switch on/off layout. Green toggles for brand benefits, red for competitor bad habits. Product hero top. Dark background. Visual yes/no makes scanning instant.
- `58-but-better-same-brand.md` — Same-brand "It's X. But Better." dark split. Not competitor-based — compares your old product to your upgrade. Punchy contrast copy on dark bg.
- `59-more-than-equivalency.md` — "More protein than 3 eggs, more vitamins than 2 oranges" equivalency framing. Product on one side, comparison benefit list on the other. Makes abstract nutrition concrete.
- `60-two-option-food-stats.md` — Two food options side-by-side with full nutrition stat columns (calories, fat, carbs) beneath each. Rhetorical question headline ("BREAKFAST DECISION?"). Data does the persuading.
- `61-captcha-select-all.md` — Mimics a CAPTCHA "Select all images that won't [problem]" with product photos in a grid. Pattern interrupt scroll-stopper. The interaction format IS the hook.

### data-driven/ (new additions)
For brands with impressive stats — expanded patterns.
- `62-quote-headline-flanking-stats.md` — Punchy quote IS the entire headline in quotation marks. Product photo below, 2 stat badges flanking bottom (e.g., "14g Protein", "0g Sugar"). The quote hooks, the stats prove.
- `63-faq-stat-answer.md` — FAQ question format. Real-life photo background, bold question headline, answer body copy with a reassuring stat ("removes 99.9% of 200+ contaminants"). Handles objections directly.
- `64-weight-loss-timeline.md` — Horizontal day-by-day progress timeline (Day 1, 10, 30, 60, 90) with descending weight numbers. Product photo below. The data trajectory IS the ad.
- `65-sales-velocity-stat.md` — "1 SOLD every 5 SECONDS" as dominant stat. Product color range displayed below. Social proof through sheer volume. The velocity metric creates FOMO.
- `66-review-count-stat-hero.md` — Product centered, oversized customer quote at top, star row, then massive review count number ("29,931 Five Star Reviews"). The scale of the number IS the persuasion.
- `67-sales-milestone-badge.md` — Product image + customer quote + circular milestone badge ("2 MILLION CUPS SOLD"). The milestone number acts as social proof without needing individual reviews.

### editorial-authority/ (new additions)
For premium brands with press coverage or professional endorsements — expanded patterns.
- `68-award-badge-press-bar.md` — "MULTI-AWARD WINNING" badge top-left, product photo center, horizontal press logo bar at bottom (Allure, Cosmopolitan, BuzzFeed). Awards + press = double credibility layer.
- `69-enterprise-logo-wall.md` — "As Seen On [Employees]" with corporate logos (Slack, Google, Airbnb). Lifestyle photo background. Signals workplace/enterprise adoption rather than consumer press.
- `70-doctor-recommended-badge.md` — "Recommended by [Specialists]" authority badge on product hero, payment method icons (Visa, PayPal, Afterpay), "30 days risk-free return." Triple trust stack: expert + payment + guarantee.
- `71-press-quote-media-strip.md` — Large centered editorial quote in bold quotation marks + "FEATURED BY" label + row of media logos (Yahoo, CNN, NYT). The quote hooks, the logos validate.
- `72-expert-credential-testimonial.md` — Cream background, large decorative quotation marks, pull-quote from named expert with credential/title badge (e.g., "Dr. Sarah Kim, Dermatologist"). Authority through individual expertise.

### lifestyle/ (new additions)
For brands with strong personality or experience as the selling point — expanded patterns.
- `73-humor-floating-callouts.md` — Product centered on soft background, witty social-situation text annotations floating on each side ("people asking what are you using", "confident boost"). The humor IS the selling point.
- `74-girl-math-value-calc.md` — Viral "GIRL MATH" headline + 3-step cost breakdown calculation justifying the purchase price humorously. Trend-hook format that makes price feel like a steal.
- `75-fourth-wall-humor.md` — Self-aware ad copy breaking the fourth wall ("Our marketing team is on vacation. Please still buy our [product]"). Hand-drawn arrow points to product. Disarming honesty as strategy.
- `76-brand-intro-empathetic.md` — Soft lifestyle background, empathetic benefit headline ("Weight loss that is realistic. Not restrictive."), subtle "Introducing [brand]" line. Emotion-first, product-second.
- `77-conversational-launch-teaser.md` — Minimalist single product on clean bg, playful conversational headline ("Hues Ready For New Colors?" / "(Raises Hand.)"). No CTA button. Curiosity > hard sell.
- `78-soft-emotional-aspirational.md` — Blurred soft-focus lifestyle photo, dark overlay, centered empathetic copy ("Have a better period"). Fine-print disclaimer. Vulnerability as connection.
- `79-ambient-reminder-cta.md` — Full-bleed lifestyle desk/workspace photo, centered "REMINDER" text overlay, product name, minimal "Got it" CTA button. Soft, non-pushy retargeting energy.
- `80-billboard-mockup.md` — Real-world outdoor billboard photo mockup showing product + bold social-proof quote. Brand logo corner. Makes the brand feel established and visible IRL.
- `81-lifestyle-hack-discount-ticker.md` — "My morning [product] hack" lifestyle framing, benefit icons mid-section, repeating "$20 OFF" discount ticker strip scrolling across the bottom. Content + offer hybrid.

### product-hero/ (new additions)
For product-focused ads — expanded patterns.
- `82-dark-problem-solution-icons.md` — Dark/starry background, bold problem headline ("No More Sleepless Nights"), 4 ingredient/benefit rows with icons, CTA button. The darkness sets the mood for the problem.
- `83-annotation-lines-rotated.md` — Product on white bg, hand-drawn-style annotation lines pointing to fabric/feature details. Rotated vertical brand headline along left edge. "Best Seller" badge. Editorial diagram feel.
- `84-dark-benefit-list-price.md` — Dark background, product image (box/bag), checkmark bullet benefit list, retail price anchor badge, CTA button at bottom. Premium unboxing energy.
- `85-2x2-color-panel-benefit-grid.md` — 4 equal-sized color-blocked panels (purple, blue, pink, yellow), product photo in each panel, numbered benefit caption under each. Scannable and vibrant.
- `86-orbiting-benefit-callouts.md` — Dark moody background, product center, floating text labels orbiting around it like satellites. CTA button at bottom. Problem headline at top ("CAN'T SLEEP THROUGH THE NOISE?").
- `87-multi-sku-lineup.md` — 3 stacked rows, each pairing a SKU image on left with a provocative benefit headline on right. Shows the full product line with attitude. No CTA button.
- `88-radial-ingredient-icons.md` — Product canister center, 6 circular ingredient icons radiating outward (Lion's Mane, Reishi, etc.), each with name + benefit label. Dark green bg. Visualizes the formula.
- `89-dark-minimal-saas.md` — Dark background, brand logo top-left, category pill tag, large bold headline (2-3 lines), single CTA button with arrow. Clean SaaS/app energy for digital products.
- `90-audience-targeted-claim.md` — Minimalist product/app mockup center, gradient background, bold audience-specific headline ("The best gift for anyone with ADHD"), partner logo badges at bottom.
- `91-app-download-lifestyle.md` — Full-bleed action lifestyle photo (cyclist, runner), bold value prop headline ("#1 app to discover new routes"), dual Google Play + App Store download badges at bottom.
- `92-product-grid-subscription.md` — 4-panel lifestyle photo grid on botanical background, bold "Subscribe & save 15%" overlay, CTA button. Retention/reorder energy.
- `93-problem-solution-split-icons.md` — Hard two-column vertical split: dark left side with "PROBLEMS" header + 3 icon pain points, colored right side with "SOLUTION" header + product hero. The contrast IS the message.
- `94-feature-checklist-panel.md` — Bold product name headline, dark feature box panel with 4 checkmark bullets, product photo alongside, "GET IT NOW!" CTA button. Information-dense but clean.

### promotional/ (new additions)
For sales, discounts, and urgency-driven campaigns — expanded patterns.
- `95-scarcity-urgency-models.md` — Multiple model/lifestyle images stacked, bold discount overlay ("50% Off"), "We Won't Do This Again" scarcity copy, free shipping note. FOMO through finality.
- `96-news-alert-urgency.md` — Cash/money photo as hero background, bold colored "LIMITED FUNDING" banner, benefit bullet list. News-alert visual language creates urgency without feeling salesy.
- `97-seasonal-resolution-hook.md` — Year callout ("2025"), "Solutions" headline, 3 benefit bullets, bottom tagline ("Results over resolutions"). Hooks into seasonal motivation cycles.
- `98-bogo-urgency-grid.md` — Product grid with "BUY 3 GET 3 FREE" banner, "LIMITED STOCK" badge, "get yours NOW!" CTA, price labels. Stacks multiple urgency signals.
- `99-split-panel-sale.md` — Classic split: lifestyle photo left panel, brand logo + sale headline + discount + CTA on dark right panel. Black Friday / seasonal sale workhorse.

### social-proof/ (new additions)
For brands with reviews, testimonials, or large user bases — expanded patterns.
- `100-multi-testimonial-grid.md` — 2x2 grid of review cards (each with stars + short quote + name) surrounding a centered product image. Four voices > one voice. Visual proof density.
- `101-quad-panel-hybrid.md` — 4-panel grid: bold guarantee claim (top-left), product lineup (top-right), UGC photo (bottom-left), star-rated quote + name (bottom-right). Everything in one frame.
- `102-speech-bubble-lifestyle.md` — Lifestyle product-in-use photo with 2 overlaid customer speech bubble quotes. CTA banner mid-image. Product closeup corner. Organic conversation feel.
- `103-tweet-product-sale-bar.md` — Embedded real tweet screenshot at top (with engagement stats), product photo middle, sale announcement banner with discount at bottom. Three layers of persuasion.
- `104-emotional-poem-overlay.md` — Jewelry/gift product photo background, handwritten-style poem/message card overlay, sentimental hook headline ("She cried reading this"). Emotional gift-giving energy.
- `105-yellow-textured-quote-card.md` — Dark outer border, yellow paper-texture card center, large serif pull-quote, small avatar + name attribution. Editorial warmth on premium dark frame.
- `106-dual-named-review-cards.md` — Brand credibility header ("BRINGING [X] HOME SINCE [year]"), two stacked named review cards with stars beside product. Authority + proof combo.
- `107-popup-card-testimonial.md` — Clean card UI with product lifestyle photos top-left, brand logo top-right, named testimonial in popup-style card center, dot pagination indicator. App-like polish.
- `108-bold-quote-product-row.md` — Large centered bold quote headline, horizontal row of product images beneath, small "SHOP NOW" CTA. The quote dominates, products support.
- `109-multi-badge-trust-stack.md` — Baby/lifestyle image on left, stacked trust badges on right: Google reviews badge, press/media logos, star ratings, testimonial quote. Maximum trust density.
- `110-dual-trustpilot-stack.md` — Two full Trustpilot review entries stacked vertically on clean white background. Each with name, location, date, star rating, and full body text. Platform credibility.
- `111-dual-stacked-quotes.md` — Product bottle/can on one side, two separate bold quote snippets stacked on the other, each with its own star rating. Two punchy voices > one long review.
- `112-lifestyle-press-benefit-bar.md` — Dark lifestyle product photo as hero, benefit text badges overlaid, press logos (Unilad, Daily Mail) bottom-left, CTA button bottom-right. Authority meets aspiration.

### ugc-native/ (new additions)
For ads that look like real user posts — expanded patterns.
- `113-iphone-notes-checklist.md` — iOS Notes app interface with iCloud label, circular checkboxes, casual product list. Mimics personal shopping list. Zero ad energy, maximum organic feel.
- `114-chatgpt-conversation.md` — Simulated ChatGPT UI with user question bubble and AI response listing 4 numbered benefit points. Leverages AI trust/novelty as the format hook.
- `115-imessage-recommendation.md` — iMessage conversation thread with green/white bubbles showing friend recommending product. Product boxes blurred in background. Word-of-mouth format.
- `116-google-serp-mockup.md` — Mimics Google search results page with search bar, tab nav, product appearing as top result. "I Googled it so it must be good" energy.
- `117-airdrop-notification.md` — Simulated iOS AirDrop notification overlay on lifestyle photo with Decline/Accept buttons. Pattern interrupt through familiar phone UI.
- `118-meme-format.md` — Classic internet meme structure ("Literally no one: / Me:") with lifestyle image. Viral humor format for novelty/personality brands.
- `119-ugc-collage-bold-quote.md` — 3-panel UGC photo collage (product in use, lifestyle shots), large bold customer quote overlaid as hero element. Raw multi-angle proof.
- `120-reddit-community-post.md` — Simulated Reddit/community post UI with username, post text, upvotes, and nested comment reply. Long-form organic social proof.
- `121-twitter-conversation.md` — Two-tweet format: customer testimonial tweet + brand reply below, with full Twitter UI chrome and engagement metrics. Dialogue as proof.
- `122-phone-screen-story.md` — Phone-screen UI frame (status bar, signal/battery), personal story caption in center. Text-only — no product image. The vulnerability IS the hook.
- `123-facebook-post-screenshot.md` — Full Facebook post UI (avatar, name, date, reactions, comments) with testimonial as body text. Dark background variant for drama.

*(116 templates total across all categories)*

## How to Generate Extra Templates

1. **Read the template .md file** from `templates/extra/{category}/`
2. **Check required_fields** against the client brief — can we fill all of them?
3. **Map client data to template fields**:
   - `primary_brand_color` → from brand-assets.json
   - `brand_name` → from client-brief.json
   - `strengths` / `weaknesses` → from client-brief.json differentiator + pain_points
   - `competitor_category` → infer from the market (e.g., "Traditional agencies" for Sharpify)
   - `product_description` → from client-brief.json offer
4. **Build the HTML** following the template's layout description, using:
   - Same brand colors from brand-assets.json
   - Same font (Montserrat) unless template specifies otherwise
   - 1080x1080px canvas
   - No background images (use solid colors/gradients per our design rules)
5. **Save to** `output/{client-slug}/html/ad-extra-{number}-{name}.html`
6. **Export PNG** to `output/{client-slug}/png/`

## When to Suggest Extra Templates

- **comparison/** templates → when client has clear differentiators vs competitors (price, speed, quality, nutrition)
- **data-driven/** templates → when client has impressive stats, clinical results, sales volume, or review counts
- **editorial-authority/** templates → when client has press coverage, awards, expert endorsements, or enterprise adoption
- **lifestyle/** templates → when brand has strong personality, humor, emotional connection, or experiential products
- **product-hero/** templates → when the product itself is the star (ingredients, features, app, multi-SKU lines)
- **promotional/** templates → when running sales, discounts, bundles, BOGO, seasonal campaigns, or urgency-driven offers
- **social-proof/** templates → when client has reviews, testimonials, Trustpilot ratings, or large user bases
- **ugc-native/** templates → when targeting audiences who distrust ads — use phone UI mockups, social screenshots, meme formats
- Suggest relevant extras after generating the default 6
- Ask the user which extras they want before generating

## Important Rules
- All extra template output must pass the anti-AI slop check
- No background images — solid colors and gradients only
- Follow all design rules from the ad-designer skill
