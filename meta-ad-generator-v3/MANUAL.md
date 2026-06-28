# Meta Ad Generator V3

An end-to-end, human-in-the-loop pipeline for producing production-ready Meta (Facebook/Instagram) ad creatives from a single client URL. The system scrapes brand assets, writes and validates copy, algorithmically selects a color palette, generates AI photography, and renders self-contained HTML layouts at 1080×1080 px — then exports retina PNGs via headless Chromium.

> **Why does this exist?** Creating a single batch of Meta ads manually involves 30–60 minutes of brand research, copywriting, design iteration, and export. Multiply that by a client roster and it becomes the dominant cost of a performance marketing operation. This pipeline reduces that to a directed sequence of CLI commands and Claude prompts, producing output that is structurally consistent, copy-validated, and visually non-generic.

---

## Table of Contents

1. [What This Is vs. What It Is Not](#what-this-is-vs-what-it-is-not)
2. [How It Compares to V2](#how-it-compares-to-v2)
3. [System Architecture](#system-architecture)
4. [Tech Stack and Why Each Tool Was Chosen](#tech-stack-and-why-each-tool-was-chosen)
5. [Services Used at a Glance](#services-used-at-a-glance)
6. [Repository Layout](#repository-layout)
7. [Installation](#installation)
8. [The brief.txt Format](#the-brieftxt-format)
9. [Complete Session Walkthrough — New Client](#complete-session-walkthrough--new-client)
10. [Stage 1 — Web Scraping](#stage-1--web-scraping)
11. [Stage 2 — Copy Generation and Validation](#stage-2--copy-generation-and-validation)
12. [Stage 2b — Copy Assembly (assemble)](#stage-2b--copy-assembly-assemble)
13. [Stage 3a — Palette Selection](#stage-3a--palette-selection)
14. [Stage 3b — Image Generation](#stage-3b--image-generation)
15. [Stage 4 — HTML Ad Design](#stage-4--html-ad-design)
16. [Stage 5 — PNG Export](#stage-5--png-export)
17. [Client Output Layout](#client-output-layout)
18. [CLI Reference](#cli-reference)
19. [Validation Architecture and Why It Matters](#validation-architecture-and-why-it-matters)
20. [Decision Log — Why Each Architecture Choice Was Made](#decision-log--why-each-architecture-choice-was-made)
21. [Extending the System](#extending-the-system)
22. [Roadmap](#roadmap)

---

## What This Is vs. What It Is Not

**What it is:**
A pipeline that takes a client's website URL and brand brief and produces a full set of Meta ad creatives — structured copy, matched color palette, AI-generated photography, and rendered HTML/PNG files — ready for upload to Meta Ads Manager.

**What it is not:**
- A fully autonomous system. Claude makes the creative decisions (copy angles, layout choices, design direction). The pipeline provides Claude with the right structured inputs and validates the outputs, but human judgment drives the creative work.
- A generic ad tool. Everything is anchored in the client's actual scraped brand data — colors extracted from their real CSS, copy grounded in their real website text, images tuned to their detected industry.
- A campaign manager. The pipeline ends at PNG export. Uploading to Meta, setting budgets and targeting, and monitoring performance are outside its scope.

**The core philosophy:**
Claude is expensive to run and excellent at reasoning. Python is cheap to run and reliable at deterministic tasks. This pipeline assigns work accordingly: Python handles scraping, color math, validation, and file I/O; Claude handles copywriting, design judgment, and creative decisions. Neither is used where the other would be better.

---

## How It Compares to V2

V2 (`meta-ad-generator/`) was the first generation of this system. It solved the same problem but made different architectural choices. Understanding those differences explains why V3 was built the way it was.

### Side-by-side comparison

| Dimension | V2 | V3 |
|-----------|----|----|
| **Scraper** | Puppeteer (headless Chromium) | Python Requests + BeautifulSoup4 |
| **Image generation** | Google Gemini Imagen 4 API | Pollinations AI (Flux model) |
| **Color selection** | Frequency-ranked CSS extraction | CIE L\*a\*b\* distance matching against 144 curated palettes |
| **Copy structure** | Free-form Claude output, 10 copywriting frameworks | Strict JSON schema with hard character limits and automated validator |
| **Copy validation** | Manual checklist ("anti-AI-slop rules"), Claude self-checks | Automated: length, dash separators, filler openers, vague descriptors, hook strength — exits 0/1 |
| **Template system** | 6 base HTML templates + 120+ `.md` template descriptions | 7 structural shape templates + 7 bullet CSS styles (all in code) |
| **Template selection** | Manual — user picks 6–8 per client | Systematic — full rotation across all 7 shapes |
| **Orchestration** | 12 Claude Code skills (slash commands) | 9 CLI subcommands (`python -m adgen <cmd>`) + Claude session |
| **Category detection** | Puppeteer DOM signals (`add to cart`, `shipping`, etc.) | Text keyword matching across 19 industry categories in Python |
| **Brief parsing** | Raw text pasted into Claude | Structured `brief.txt` file, parsed by `_parse_brief_sections()` |
| **API keys required** | `GEMINI_API_KEY`, `META_ACCESS_TOKEN`, hardcoded account IDs | None for stages 1–5 |
| **Portability** | Broken: hardcoded paths to `c:/Users/Ritvars Volfs/...` | Fully portable: all paths relative to project root |
| **Package management** | `package.json` (Node) only | `pyproject.toml` + `uv.lock` (Python) + `package.json` (Node) |
| **Reproducibility** | Seeds not saved; re-running image gen produces different result | `seed.txt` written after every generation; `--seed N` flag for exact reproduction |
| **Multi-language** | Detected per client, rules in CLAUDE.md | Detected per client, Raleway enforced in templates for Latvian glyph coverage |
| **Meta API integration** | Full: create/update ads, adsets, campaigns | None (out of scope for stages 1–5) |

### Why V2's scraper was replaced

V2 used Puppeteer (`scrape-brand.js`) to launch a real Chromium browser, load the client's website, wait for JavaScript, and extract colors and fonts via `getComputedStyle()`. This worked but had three problems:

1. **Brittleness.** Sites with anti-bot JavaScript, strict CSP headers, or heavy client-side rendering would time out or return empty results. Puppeteer also requires a full browser binary to be installed and running — it's a heavy dependency for what is fundamentally an HTTP + HTML parsing task.
2. **Speed.** A Puppeteer scrape takes 5–15 seconds per page (browser launch + network + JS execution). V3's `requests` + `BeautifulSoup4` approach takes under 1 second per page and runs 12 pages in the same time Puppeteer scrapes one.
3. **Color quality.** `getComputedStyle()` returns every computed color on the page including browser defaults and invisible elements. V3's scraper reads CSS source files directly, targeting `background-color` and `color` properties in header/nav selectors — yielding brand-intent colors rather than computed-everywhere colors.

### Why Gemini Imagen was replaced with Pollinations

V2 used `scripts/generate-image.js` to call the Gemini Imagen 4 API (`imagen-4.0-generate-001`). The API required a `GEMINI_API_KEY` and produced good quality images, but had operational problems:

1. **503 DEADLINE_EXCEEDED errors.** Long prompts or concurrent requests would fail with a 503. The V2 fix was to force sequential generation (no parallel `&`), which made multi-image batches slow.
2. **Paid API.** Every image costs money. For a batch of 15 ads with 3 image variants each, the cost accumulates quickly.
3. **Path resolution bug.** The script resolved output paths relative to CWD, meaning running it from a subfolder would nest files incorrectly.

V3's Pollinations AI integration (`pollinations.Image()`) is free, has built-in retry logic, and the Flux model produces photorealistic output on par with Imagen for advertising photography. The tradeoff is rate limiting (hence the 10s/20s/40s retry backoff), but for a pipeline that generates 3–6 images per client session, that is acceptable.

### Why the palette algorithm was built

V2 extracted the top 8 colors by frequency from the client's CSS and suggested a `primary/secondary/accent` mapping. This worked as a starting point but the output was raw CSS values — the designer still had to manually decide which colors to use for which roles (headline text, CTA button, body copy, backgrounds).

V3 replaces this with a 144-palette catalog where every palette has pre-assigned semantic roles (`base`, `second_tone`, `accents`, `text_cta_bg`, `body_text`, `cta_text`). The algorithm finds the catalog palette whose swatches are perceptually closest to the client's brand colors (using CIE L\*a\*b\* distance, not RGB distance). The output is a ready-to-use 6-hex color system that Claude can reference directly when writing HTML — no manual color role assignment needed.

### Why the copy validator was built

V2 had a "7-point anti-AI-slop checklist" that Claude was instructed to self-check before finalizing copy. These were good rules, but they relied entirely on Claude's self-assessment — which is inconsistent across sessions and has no enforcement mechanism.

V3's `validate.py` runs as a CLI gate that exits 1 if any blocking issue is found. It is deterministic and session-independent. Claude cannot proceed to stage 3 without passing it. The validator catches issues that are mechanical enough to automate (character counts, dash separators, filler openers) rather than relying on Claude's judgment for things that can be measured.

### What V2 did better

V2 had two capabilities V3 does not yet have:

1. **Meta Graph API integration.** V2 could create paused ads directly in Meta Ads Manager via `scripts/create-ads.py`. It handled the full creative upload flow including video ads. V3 ends at PNG export and requires manual upload.
2. **120+ template variety.** V2's template library covered UGC-native formats (iPhone Notes, iMessage mock, Reddit post, Google SERP), promotional formats (flash sale, countdown timer, scarcity), and editorial styles (faux press, advertorial, manifesto). V3's 7 structural shapes are more architecturally sound but less diverse in format type.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  INPUT: client URL + optional brief.txt                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Stage 1 — adgen scrape (Python)    │
          │  BFS crawl up to 12 pages           │
          │  Extract: brand metadata, images,   │
          │  CSS colors, logo, social proof     │
          │  ► manifest.json, accent_colors.txt │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Stage 2 — Copy  (Claude session)   │
          │  Reads: info.txt + manifest.json    │
          │  + brief.txt + copywriter.md rules  │
          │  ► copy/components.json             │
          │            │                         │
          │  adgen validate ← Python hard gate  │
          │  ► PASS → promote-copy → final.json │
          │  ► FAIL → Claude refines (refiner   │
          │    .md rules) → re-validate         │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Stage 3a — adgen palette (Python)  │
          │  CIE L*a*b* nearest-swatch scoring  │
          │  + 19-category industry boost       │
          │  ► palette/chosen.json              │
          ├──────────────────┴──────────────────┤
          │  Stage 3b — adgen generate-image    │
          │  Brief-driven Flux prompt builder   │
          │  Pollinations AI API + retry logic  │
          │  ► image/generated-N.jpg            │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Stage 4 — HTML Ads (Claude session)│
          │  Reads: chosen.json + final.json    │
          │  + manifest.json + generated images │
          │  + CLAUDE.md design rules           │
          │  Writes: 7 shapes × 7 bullet styles │
          │  ► html/ad-N-<slug>.html            │
          │            │                         │
          │  adgen render ← auto-fix gate       │
          │  ► fixes logo/font/CTA in-place     │
          │  ► prints fix+warn table per file   │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Stage 5 — export-png.js (Node.js)  │
          │  Puppeteer headless Chromium         │
          │  deviceScaleFactor=2 → 2160×2160    │
          │  Waits for document.fonts.ready     │
          │  ► png/ad-N-<slug>.png              │
          └─────────────────────────────────────┘
```

**Why this architecture?**

The pipeline is split into discrete stages rather than one monolithic operation because each stage has a different failure mode and a different input/output contract:

- **Scraping** fails due to network errors or anti-bot measures. Running it separately means you never re-scrape a client just because the copy validation failed.
- **Copy** requires human-quality judgment. Making it a Claude session step keeps a human in the loop for the most brand-sensitive work.
- **Palette** is pure math on already-scraped data. It is instant, deterministic, and never needs to re-run unless the scrape changes.
- **Image generation** is slow (5–30 seconds per image) and rate-limited. Running it as a separate step lets you regenerate just the images without touching copy or palette.
- **HTML design** is the most creative and variable stage. Keeping it as a Claude session step means design decisions are always human-supervised.
- **PNG export** is a pure rendering step. If Puppeteer fails for one file, you fix that file and re-run just the export.

Every stage writes its output to disk before the next stage reads it. This means any stage can be re-run independently, inspected, or manually overridden without restarting from scratch.

---

## Tech Stack and Why Each Tool Was Chosen

| Component | Technology | Version | Why This Choice |
|-----------|-----------|---------|----------------|
| **HTTP client** | `requests` | ≥ 2.31 | Simple, reliable, excellent connection pooling via `Session`. No JS execution needed — CSS and HTML are the data sources, not computed DOM state. |
| **HTML parsing** | `BeautifulSoup4` | ≥ 4.12 | Handles malformed HTML gracefully. The `html.parser` backend has no C dependencies, making it portable across Windows/macOS/Linux. |
| **Image processing** | `Pillow` | ≥ 10 | Complete EXIF, alpha channel, color quantisation, and format conversion without external binaries. Used for logo background detection and color extraction. |
| **Background removal** | `rembg[cpu]` | ≥ 2.0.38 | ONNX-based U2Net model running on CPU, no GPU required. Produces clean alpha-channel masks for product photos without an API call. |
| **Image generation** | `pollinations` | ≥ 4.5.1 | Free public API. Flux model produces photorealistic output. No API key, no billing. Rate-limiting is the only constraint and is handled by retry logic. |
| **Claude integration** | `anthropic` | ≥ 0.40 | Reserved for future stages (6–7). Stages 1–5 run entirely within the user's Claude Code session — no programmatic API calls needed. |
| **Environment loading** | `python-dotenv` | ≥ 1.0 | Loads `.env` at startup from the project root two levels above `adgen/__main__.py`. Ensures API keys are never hardcoded. |
| **CLI framework** | `click` | ≥ 8.1 | Type-safe argument parsing, automatic `--help` generation, command groups. More robust than `argparse` for a multi-subcommand CLI. |
| **Package manager** | `uv` | latest | 10–100× faster than pip for environment creation. Lock file ensures identical environments across machines. |
| **PNG export** | Puppeteer (Node.js) | 18+ | The only reliable way to render Google Fonts + complex CSS (`clip-path`, `backdrop-filter`, `conic-gradient`) at pixel-perfect accuracy is a real browser engine. |

**Full dependency list** (`pyproject.toml`):

```toml
[project]
name = "adgen"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
  "requests>=2.31",
  "beautifulsoup4>=4.12",
  "Pillow>=10",
  "click>=8.1",
  "pollinations>=4.5.1",
  "packaging>=26.2",
  "anthropic>=0.40",
  "python-dotenv>=1.0",
  "rembg[cpu]>=2.0.38",
]

[project.optional-dependencies]
dev = ["pytest>=8.0"]
```

---

## Services Used at a Glance

| Service | Purpose | Stages Used | Auth Required |
|---------|---------|------------|--------------|
| **Pollinations AI** | Image generation via Flux model | 3b | None — free public API |
| **Google Fonts CDN** | Typography in rendered HTML ads | 4, 5 | None — public CDN |
| **Anthropic Claude** | Copy generation, HTML ad design | 2, 4 | Claude Code session |
| **rembg (local)** | Background removal from product photos | Any time | None — runs locally via ONNX |
| **Meta Ads Manager** | Final upload destination | Manual (post stage 5) | Meta Business account |

No API keys are required to run stages 1–5. The `.env` file is currently empty and reserved for future stages.

---

## Repository Layout

```
meta-ad-generator-v3/
├── CLAUDE.md                        # Master pipeline instructions for Claude (21 KB)
│                                    # Why: Claude has no memory between sessions.
│                                    # CLAUDE.md is reloaded at the start of every
│                                    # session by Claude Code, giving Claude every
│                                    # design rule, stage command, and file convention.
│
├── pyproject.toml                   # Python package + dependency declaration
├── uv.lock                          # Locked dependency tree
│                                    # Why: pins exact versions so the pipeline
│                                    # produces identical results on any machine.
│
├── .env                             # Empty; reserved for future API keys
│
├── adgen/                           # Core Python package (python -m adgen)
│   ├── __main__.py                  # Click CLI dispatcher — all subcommands here
│   ├── config.py                    # DEFAULT_MAX_PAGES=12, DEFAULT_MAX_IMAGES=100
│   ├── paths.py                     # client_dir(), scrape_dir(), palette_dir(), image_dir()
│   │                                # Why: centralised path logic. One change updates all
│   │                                # path references across the entire codebase.
│   ├── brief.py                     # Load brief.txt or prompt interactively if missing
│   ├── assemble.py                  # Merge copy + palette into a RenderContext object
│   ├── validate.py                  # Stage 2 copy validator — exits 0 (PASS) or 1 (FAIL)
│   ├── validate_html.py             # Stage 4 layout validator + auto-fixer
│   ├── validate_images.py           # Post-scrape logo/image quality checker
│   ├── zone_analysis.py             # Per-zone brightness + edge density on exported PNGs
│   ├── preview.py                   # Quick in-browser preview helper
│   ├── promote.py                   # refined.json → final.json (or components.json)
│   ├── bg_remove.py                 # CLI wrapper around rembg
│   │
│   ├── scrape/                      # Stage 1 — website crawler
│   │   ├── crawler.py               # Multi-page BFS crawl, color/image extraction
│   │   ├── config.py                # LOGO_HINTS, PRODUCT_HINTS, SKIP_LINK_HINTS, etc.
│   │   │                            # Why separate: these hint lists change frequently
│   │   │                            # as new client site patterns are discovered.
│   │   ├── models.py                # ImageCandidate, ScrapedPage, ScrapeResult dataclasses
│   │   ├── images.py                # Logo scoring, srcset parsing, CDN URL normalisation
│   │   ├── text.py                  # Brand name, language, social proof extraction
│   │   ├── ai_colors.py             # Regex-based accent color extraction from CSS text
│   │   ├── output.py                # Write manifest.json, info.txt, accent_colors.txt
│   │   └── utils.py                 # URL normalisation, JSON-LD flattening, session factory
│   │
│   ├── palette/                     # Stage 3a — color matching
│   │   ├── runner.py                # CIE L*a*b* scoring, category detection, boost, output
│   │   ├── catalog.py               # Parse palettes-neutral.md → list[Palette] dataclasses
│   │   ├── photo_palette.py         # k-means color extraction from image files
│   │   ├── image_colors.py          # Batch extraction from a folder of images
│   │   └── data/
│   │       └── palettes-neutral.md  # 144 curated palettes with semantic swatch roles
│   │                                # Why a flat .md file: human-readable, easy to add
│   │                                # new palettes without touching any code.
│   │
│   ├── image/                       # Stage 3b — AI image generation
│   │   ├── generator.py             # generate_image() — Pollinations wrapper + retry
│   │   └── prompt_builder.py        # build_prompt() — brief-driven randomised prompt
│   │
│   └── render/                      # Stage 4 — HTML ad construction
│       ├── cli.py                   # validate_and_fix_html_dir() entry point
│       ├── context.py               # RenderContext — typed view over all stage 1–3 outputs
│       ├── renderer.py              # Per-file fix pass (logo height, font sizes, CTA gap)
│       ├── templates.py             # Shared helpers: _FONT_READY, _logo_tag, _h()
│       ├── bullet_styles.py         # 7 CSS generators for bullet point designs
│       └── shape_templates.py       # 7 structural HTML shape templates
│                                    # Why code over .md descriptions: V2 required Claude
│                                    # to interpret prose specs and generate HTML from
│                                    # scratch each session — producing inconsistent output.
│                                    # V3 encodes each template as a Python function that
│                                    # generates deterministic, validator-compatible HTML.
│
├── prompts/
│   ├── copywriter.md                # Rules Claude follows when writing copy (stage 2)
│   │                                # Why external file: rules evolve with client feedback.
│   │                                # Kept outside CLAUDE.md so they can be updated
│   │                                # without touching master pipeline instructions.
│   └── refiner.md                   # Rules for fixing failed validation without
│                                    # destroying fields that already passed
│
├── scripts/
│   └── check-copy.js                # Node.js alternative copy length checker
│
├── docs/superpowers/                # Architecture specs and implementation plans
│
└── clients/                         # Git-ignored per-client output root
    └── <domain>/
        ├── brief.txt
        ├── scrape/
        ├── copy/
        ├── palette/
        ├── image/
        ├── html/
        └── png/
```

---

## Installation

**Prerequisites:** Python ≥ 3.10, Node.js ≥ 18, [uv](https://github.com/astral-sh/uv)

```bash
git clone <repo-url>
cd meta-ad-generator-v3

# Install Python package and all dependencies from the lock file
uv sync

# Install Node.js dependencies for the PNG export step
npm install puppeteer
```

**Why `uv sync` rather than `pip install`?**
`uv sync` reads `uv.lock` and installs exact pinned versions, not the latest compatible versions. `Pillow 10.x` changed color quantisation behavior, `pollinations` changes its API surface across minor versions, and `rembg` requires a specific ONNX runtime version. `pip install` with only `pyproject.toml` would silently install newer versions that could break color extraction or image generation.

---

## The brief.txt Format

`brief.txt` is the only required manual input beyond the client URL. It is written once per client and read by three separate systems: `adgen scrape` (saves it alongside the scrape output), `build_prompt()` (extracts subject, mood, and setting for image generation), and the Claude copy session (context for tone and offer).

### Format

Each field is `Key: value`. Multi-line values use `- ` bullet lines after the key header. All fields are optional but `Target audience` and `Product` produce the most impact on image generation quality.

```
Brand name: Aekora Studio
URL: https://aekora.com

Target audience: women aged 28-45 interested in sustainable skincare
Product:
- Daily serum and moisturiser set
- Sold as a 30-day starter kit
Brand tone: warm, honest, science-backed, quietly confident
Goal: drive trial purchases of the starter kit
Offer: 15% off first order with code FIRST15
Language: English
Location: Riga, Latvia
```

### How each field is used

| Field | Used by | How |
|-------|--------|-----|
| `Target audience` | `build_prompt()` | Gender + age → photographic subject (`"elegant woman in her early thirties"`) |
| `Product` | `build_prompt()` | Keywords → setting label (`clinic`, `studio`, `shop`, etc.) |
| `Brand tone` | `build_prompt()` | First sentence, stop words removed → up to 5 mood keywords for image |
| `Brand tone` | Claude (stage 2) | Guides copy voice and emotional register |
| `Goal` | Claude (stage 2) | Shapes copy angle — acquisition vs. retention vs. awareness |
| `Offer` | Claude (stage 2) | Specific offer to feature in headlines and CTA |
| `Language` | Claude (stages 2+4) | Latvian triggers Raleway font enforcement and bilingual validator |
| `Location` | Claude (stages 2+4) | City/country for localised copy references |

### What happens without a brief

If `--brief` is omitted from `adgen scrape`, the CLI prompts interactively:

```
Paste any extra context about the brand (target audience, offer, tone).
Press Enter on an empty line twice when done.
```

Enter text and press Enter twice to finish. The brief is saved to `clients/<domain>/brief.txt` automatically.

---

## Complete Session Walkthrough — New Client

This is the exact command sequence for a full client session from URL to PNG. Claude steps are marked with a session indicator.

```
STEP 1 — Scrape the website
────────────────────────────
python -m adgen scrape https://client-site.com --brief path/to/brief.txt
python -m adgen validate-images clients/<domain>/scrape/manifest.json

  Review: clients/<domain>/scrape/info.txt
          clients/<domain>/scrape/logo/
          clients/<domain>/scrape/accent_colors.txt


STEP 2 — Write copy
────────────────────
[Claude session] Read info.txt + manifest.json + brief.txt + prompts/copywriter.md
                 Write clients/<domain>/copy/components.json

python -m adgen validate clients/<domain>/copy/components.json
  → PASS: python -m adgen promote-copy <domain>
  → FAIL: [Claude session] read refiner.md, fix flagged fields → refined.json
          python -m adgen validate clients/<domain>/copy/refined.json
          python -m adgen promote-copy <domain>


STEP 3 — Select palette and generate images
─────────────────────────────────────────────
python -m adgen palette <domain>
  Review: clients/<domain>/palette/chosen.json
          clients/<domain>/palette/shortlist.json  ← top-5 alternatives

python -m adgen generate-image <domain> --count 3
  Review: clients/<domain>/image/generated-1.jpg  (+ -2.jpg, -3.jpg)
  Seeds:  clients/<domain>/image/seed.txt


STEP 4 — Design HTML ads
──────────────────────────
[Claude session] Read chosen.json + final.json + manifest.json + generated images
                 Write clients/<domain>/html/ad-N-<slug>.html (7 files)

python -m adgen render <domain>
  → auto-fixes in-place, prints summary table

python -m adgen preview <domain>
  → generates clients/<domain>/html/preview-feed.html
     open in browser: Instagram phone-frame mockup at 320px


STEP 5 — Export PNGs
─────────────────────
node scripts/export-png.js clients/<domain>/html clients/<domain>/png
  → clients/<domain>/png/ad-N-<slug>.png (2160×2160 retina)

python -m adgen zone-review <domain>
  → prints brightness/layout grid for each PNG

[Optional] python -m adgen assemble <domain>
  → clients/<domain>/copy/assembled.json (Meta Ads API format)
```

**Re-running individual stages:** Each stage writes to disk before the next reads. Any stage can be re-run without restarting from the top:
- Re-scrape: `adgen scrape <url> --keep-existing` (adds pages without wiping images)
- Re-palette: delete `chosen.json`, run `adgen palette <domain>`
- Re-image: `adgen generate-image <domain> --append` (adds images without overwriting)
- Re-render: `adgen render <domain>` (re-validates and re-fixes all HTML in-place)
- Re-export: `node scripts/export-png.js ...` (re-renders all HTML → PNG)

---

## Stage 1 — Web Scraping

**What it does:** Crawls up to 12 pages of the client's website, extracts structured brand data, downloads visual assets, and detects accent colors from CSS and images.

**Why it exists:** All downstream stages are grounded in the client's actual brand — not generic assumptions. The palette matcher needs real brand colors. The image prompt builder needs the detected industry category. The HTML designer needs the logo and its background type. Without a scrape, every subsequent stage would require manual data entry.

**Entry point:** `adgen/scrape/crawler.py:scrape_site()`
**CLI:** `python -m adgen scrape <url> [--brief <path>] [--max-pages N] [--max-images N] [--keep-existing]`

### Why Python requests instead of Puppeteer

V2 used Puppeteer because it could execute JavaScript and extract `getComputedStyle()` values. V3 uses `requests` + `BeautifulSoup4` instead for three reasons:

1. **Most brand information is in the HTML source**, not in computed styles. Logo URLs, brand names, meta descriptions, JSON-LD, and CSS file links are all available without executing JavaScript.
2. **CSS files are a better color source than computed styles.** `getComputedStyle()` returns values for every visible element including browser defaults. Reading actual CSS source and filtering for header/nav selectors returns deliberate brand colors.
3. **Speed and reliability.** A `requests.get()` call takes ~100ms. A Puppeteer page load takes 3–15 seconds. For a 12-page crawl, that is 3 minutes vs. 12 seconds.

### Crawl algorithm

`scrape_site()` runs a priority-sorted BFS (breadth-first search):

1. Fetch the root URL via a shared `requests.Session` with connection pooling (created by `make_session()`).
2. Parse HTML with BeautifulSoup4 and flatten any JSON-LD `@graph` arrays.
3. Build a link queue via `extract_internal_links()`:
   - Only same-domain HTTP/S links.
   - Filter out URLs matching `SKIP_LINK_HINTS`: `login`, `cart`, `checkout`, `account`, `wp-admin`, `sitemap`, `feed`, etc.
   - Filter out file extensions: `.pdf`, `.zip`, `.jpg`, `.png`, `.webp`, etc.
   - Score each link: start at 1, add 12 points for each `INTERNAL_PAGE_HINTS` match (`about`, `services`, `pricing`, `contact`, `portfolio`, `products`). High-value pages are fetched first.
4. BFS continues until `max_pages` (default 12) pages are collected.

**Why prioritise certain pages?** Brand-relevant data (brand promise, services, USPs) appears on About and Services pages — not on blog post archives. Scoring links ensures the most informative pages are scraped even if the queue fills up before all links are visited.

### Brand metadata extraction

| Field | Extraction logic |
|-------|----------------|
| `brand_name` | `<title>` tag, JSON-LD `Organization.name`, `og:site_name`, domain slug as fallback |
| `language` | `<html lang>` attribute, JSON-LD `inLanguage`, heuristic detection of Latvian characters (ā, ē, ī, ū, ģ, ķ, ļ, ņ, š, ž) |
| `location` | JSON-LD `PostalAddress`, `<address>` tags, footer text patterns for city/country names |
| `company_summary` | `og:description`, JSON-LD `Organization.description`, first `<p>` under `<main>` |
| `goal_summary` | `<h1>` + `<h2>` text from root page |
| `text_sections` | Per-page heading→body text blocks (Claude reads these for copy context) |
| `social_proof` | Review counts, star ratings, press logos, certification badges, `<blockquote>` testimonials |

### Image pipeline — scoring and download

`extract_images()` processes every `<img>`, `<source>`, CSS `background-image`, and Open Graph image tag across all pages.

**1. Resolves the highest-quality URL variant:**
- Parses `srcset` descriptors: for `w` descriptors (pixel widths), picks the largest; for `x` descriptors (density multipliers), multiplies by 1000 for comparable scoring.
- Strips CDN resize query parameters: `?w=`, `?width=`, `?h=`, `?height=`, `?fit=`, `?crop=`, `?resize=`.
- Removes thumbnail path segments (`/thumbs/`, `/small/`, `/preview/`) by replacing with `/`.
- Removes `WxH` size suffixes: `hero-800x600.jpg` → `hero.jpg`.

**Why strip these?** CDN-served images are available at full resolution with no query parameters. Stripping size constraints fetches a much larger, sharper image than the one embedded in the page.

**2. Scores each image as `logo`, `product`, or `other`:**

`ImageCandidate.score` is incremented by keyword matches in:
- Image URL path (`/logo/`, `brand-logo.png`)
- `alt` attribute text
- `class` and `id` attributes
- JSON-LD `logo` field (strong positive signal)
- Parent `<a>` tag's `href` — if a small image links to the homepage, it is very likely the logo

Images in `<header>` or `<nav>` get a boost via `is_inside_header()`. Images matching `LOW_QUALITY_IMAGE_HINTS` (spinner, placeholder, tracking pixel, `1x1`) get score set to 0.

**3. Downloads to appropriate subfolder:**
- Top-scored logos → `logo/`
- Images classified as product → `product_images/` (up to 35)
- All remaining → `other_images/` (up to `max_images`)

### Color extraction — four sources merged in priority order

**Why four sources?** No single source reliably captures brand intent:
- `<meta name="theme-color">` is the most explicit signal but not all sites set it.
- Inline header styles are brand-intentional but often provide only one color.
- CSS files are the richest source but include utility and reset colors.
- Logo image colors reflect the actual visual identity but may be low-contrast on white.

```
1. AI/regex extraction from CSS files  ← richest source, processed first
2. <meta name="theme-color">           ← most explicit brand signal, prepended
3. Inline style= on header/nav         ← brand-zone element colors
4. Primary logo image dominant colors  ← visual identity signal
5. Product image folder colors         ← 4 images × 6 colors via k-means
```

The scraper fetches up to 4 external stylesheets per site and runs `extract_background_css_colors_from_text()` — a regex pass extracting hex values from `background`, `background-color`, `border-color`, and `color` CSS properties.

### Outputs written to `clients/<domain>/scrape/`

| File | Contents |
|------|---------|
| `manifest.json` | Full structured JSON: brand, language, location, text_sections, social_proof, logo paths, colors |
| `info.txt` | Human-readable summary — Claude reads this in stage 2 |
| `client_memory.txt` | Chat context block for Claude sessions |
| `accent_colors.txt` | Hex colors, one per line, in extraction priority order |
| `scraped_urls.txt` | All page and image URLs collected |
| `logo/` | Downloaded logo files |
| `product_images/` | Downloaded product/gallery images (up to 35) |
| `other_images/` | All remaining images (up to `max_images`) |

### Post-scrape image validation

**CLI:** `python -m adgen validate-images clients/<domain>/scrape/manifest.json`

| Check | Why it matters |
|-------|---------------|
| Logo minimum dimensions | A 1×1 tracking pixel in the header with `alt="logo"` passes the scorer. This prevents invisible assets from being used in ads. |
| Logo aspect ratio | A 1400×20 px banner classified as a logo would break every ad layout. Warns when ratio is outside 0.2–8.0. |
| `logo_bg` detection | Opens the logo with Pillow, checks for alpha channel, samples corner pixels. Classifies as `transparent`/`white`/`dark`/`color`. Prevents placing a white-background logo on a white panel in stage 4 where it would disappear. |

---

## Stage 2 — Copy Generation and Validation

**What it does:** Claude writes structured ad copy anchored in the scraped brand data, then a Python validator runs a mechanical quality gate. If the gate fails, Claude refines only the failing fields.

**Why Claude, not automated generation?** Ad copy quality is the single largest determinant of ad performance. The specificity of the pain point, the freshness of the framing, and the authenticity of the brand voice all require reading and understanding the actual brand content — not pattern-matching. Claude reads the scraped `info.txt`, the brand brief, and the copywriting rules and writes copy grounded in the client's real website text.

**Why a validator gate?** Claude's self-assessment is inconsistent across sessions. In a fresh session with full context it reliably produces good copy. In a half-full context window it can produce vague, over-length, or cliché-laden copy with no warning. The validator enforces rules that can be expressed as measurements so Claude's attention is freed for the rules that cannot.

**Entry point:** Claude session reading `prompts/copywriter.md`
**Validation CLI:** `python -m adgen validate clients/<domain>/copy/components.json`

### Copy schema (`copy/components.json`)

```json
{
  "headlines":      ["string × 3"],
  "bullets":        ["string × 6"],
  "base_texts":     ["string × 3"],
  "on_image_texts": ["string × 3"],
  "cta":            "string",
  "testimonials":   [
    { "quote": "string", "name": "string", "outcome": "string" }
  ]
}
```

**Why these field counts?**

- **3 headlines** — each covers a distinct angle: result-focused ("Save 12 hours a week"), mechanism-focused ("AI does the analysis, you make decisions"), stat-focused ("3,400 businesses trust this workflow"). Three headlines = three different ads without rewriting everything.
- **6 bullets** — the first 4 fill a 2×2 `flex-wrap` grid; bullets 5–6 appear below as a secondary row. The 2-column structure is baked into the template system.
- **3 base_texts** — three dominant copy structures: problem→solution, result-first, offer-first. Each resonates with a different reader intent. Which one performs best is a testing question, not a copywriting question.
- **3 on_image_texts** — the shortest, boldest lines rendered directly over a photo background. One per image variant.

### Copy validator — all rules with implementation

**File:** `adgen/validate.py`

#### Field count and length requirements

```python
REQUIRED_COUNTS = {
    "headlines": 3, "bullets": 6,
    "base_texts": 3, "on_image_texts": 3,
}

LIMITS = {
    "headlines":      40,   # Must fit on ≤2 visual lines at 68+ px font size
    "bullets":        60,   # Must fit in a ~480px column at 22 px
    "base_texts":     220,  # Two visual lines maximum at 24 px
    "on_image_texts": 30,   # Overlay text — must read in under 1 second
}
```

**Why 40 chars for headlines?** At 68 px font on a 1080 px canvas, roughly 20–25 characters fit per line. 40 chars = at most 2 lines. More than 2 and the headline dominates the ad at the expense of everything else.

**Why 60 chars for bullets?** Each bullet column is ~480 px wide. At 22 px body font, a line is approximately 40–50 characters. 60 chars allows occasional line wraps without the bullet becoming a paragraph.

#### Issue dataclass

```python
@dataclass
class Issue:
    field: str
    message: str
    level: str = "error"  # "error" blocks the pipeline; "warn" prints but passes
```

#### Dash separator check

Rejects ` — ` and ` - ` in any field.

**Why?** On a mobile feed, em-dash or hyphen separators (`Book a call — free`) look like unfinished sentences or list formatting artifacts. Real ad copy uses periods, colons, or line breaks. This is also a strong marker of AI-generated copy — LLMs reach for em-dashes when connecting two ideas they could not integrate naturally.

#### Filler opener check (headlines + base_texts)

```python
FILLER_OPENERS = (
    "are you", "do you", "have you", "imagine",         # English
    "vai jūs", "vai tu", "iedomājies", "iedomājieties", # Latvian
)
```

**Why block these?** "Are you struggling with..." and "Imagine if you could..." are the two most overused hooks in performance marketing. They signal formula to the reader. They also lead with the problem rather than the solution — on a feed where attention is measured in milliseconds, leading with a result or a number is a faster hook.

#### Vague descriptor check

```python
VAGUE_DESCRIPTORS = (
    # English
    "great", "amazing", "best", "quality", "professional",
    "effective", "fast results", "modern", "innovative", "seamless",
    # Latvian
    "efektīvs", "labākais", "kvalitatīvs", "profesionāls",
    "moderns", "inovatīvs",
)
```

**Why these words?** They are non-falsifiable claims. Any business can say they are "professional" or "innovative." Every competitor uses the same words. A word that does not differentiate the brand wastes character budget that could hold a specific fact (a number, a result, a named mechanism).

#### Hook strength check (headlines[0] only, level=warn)

```python
_HOOK_NUMBER_RE = re.compile(r"\d")
_HOOK_CONTRAST_RE = re.compile(
    r"\b(stop|quit|never|without|instead|before|after|still|finally|already|"
    r"every|zero|only|no more|why|what if|this is)\b",
    re.IGNORECASE,
)
```

**Why a warning, not an error?** Hook strength is partially subjective. A brand with strong identity can open with the brand name alone. The validator warns when the first headline lacks a number or a contrast word — but does not block — because brand context might justify an exception.

**Why numbers?** "12 hours saved per week" is more concrete than "save significant time." Numbers interrupt pattern recognition — the brain processes digits differently from words, creating a micro-pause in the scroll.

**Why contrast words?** "Without the agency fees", "Finally, a CRM that works", "Still paying per seat?" — these carry implicit tension and promise resolution of a known problem.

#### Testimonial validation

```python
TESTIMONIAL_QUOTE_MAX   = 120
TESTIMONIAL_NAME_MAX    = 40   # first name + last initial format
TESTIMONIAL_OUTCOME_MAX = 30   # optional short outcome label
```

All three fields are validated for length. `quote` and `name` are required. `outcome` is optional. The `name` constraint enforces the `"J. Smith"` format rather than full names that could raise privacy concerns.

#### Validator exit behavior

```python
if not errors:
    click.echo("PASS — no blocking issues found")
    sys.exit(0)
click.echo(f"FAIL — {len(errors)} issue(s):")
sys.exit(1)
```

Warnings are printed but do not block. Errors block. This allows the pipeline to surface informational feedback (hook suggestion) without stopping work for non-critical observations.

### Refinement flow

If `validate.py` exits 1, Claude reads `prompts/refiner.md` and writes `copy/refined.json`. The refiner rules specifically instruct Claude to fix only the flagged fields and preserve everything else — preventing the common failure mode where asking Claude to "fix the copy" results in a complete rewrite that loses specific numbers and brand voice that were working.

```bash
python -m adgen promote-copy <domain>
# Copies refined.json → final.json (or components.json if no refinement was needed)
```

All stages 3b and 4 read exclusively from `final.json`. This prevents a half-refined state where one stage reads `components.json` and another reads `refined.json`.

---

## Stage 2b — Copy Assembly (assemble)

**What it does:** Converts `final.json` into `assembled.json` — a Meta Ads API–ready structure with one entry per copy angle, field names matching the Graph API, and the free-text CTA mapped to a Meta CTA enum.

**Why it exists:** The Meta Graph API uses different field names than the pipeline's copy schema. `primary_text` maps to the feed post body. `headline` is the bolded line below the image. `description` is truncated to 30 chars (a bullet). `call_to_action_type` must be one of Meta's enums (`SHOP_NOW`, `LEARN_MORE`, `BOOK_TRAVEL`, etc.) — it cannot be the free-text CTA string from `final.json`. `assemble` handles all of these mappings so the upload step doesn't need to know the pipeline schema.

**CLI:** `python -m adgen assemble <domain>`

### CTA text → Meta enum mapping

```python
_CTA_MAP = [
    ("book",       "BOOK_TRAVEL"),
    ("reserve",    "BOOK_TRAVEL"),
    ("shop",       "SHOP_NOW"),
    ("buy",        "SHOP_NOW"),
    ("order",      "SHOP_NOW"),
    ("sign up",    "SIGN_UP"),
    ("subscribe",  "SUBSCRIBE"),
    ("download",   "DOWNLOAD"),
    ("install",    "INSTALL_MOBILE_APP"),
    ("contact",    "CONTACT_US"),
    ("call",       "CALL_NOW"),
    ("get",        "GET_OFFER"),
    ("claim",      "GET_OFFER"),
    ("learn",      "LEARN_MORE"),
    ("see",        "LEARN_MORE"),
    ("watch",      "WATCH_MORE"),
]
```

The first keyword match wins. If no keyword matches, defaults to `"LEARN_MORE"`. Matching is case-insensitive. `"Book a Free Call"` → `BOOK_TRAVEL`. `"Get 15% Off"` → `GET_OFFER`.

### Output format (`copy/assembled.json`)

```json
[
  {
    "angle": 1,
    "primary_text": "Save 12 hours a week on client reporting.",
    "headline": "Reports in 90 seconds",
    "description": "No spreadsheets needed",
    "call_to_action_type": "GET_OFFER",
    "cta_display": "Get 15% Off"
  },
  {
    "angle": 2,
    "primary_text": "3,400 agencies use this workflow.",
    "headline": "AI does the analysis",
    "description": "Trusted by 3,400 teams",
    "call_to_action_type": "GET_OFFER",
    "cta_display": "Get 15% Off"
  },
  {
    "angle": 3,
    "primary_text": "Still building reports manually?",
    "headline": "Finally, reporting that runs itself",
    "description": "Free 14-day trial",
    "call_to_action_type": "GET_OFFER",
    "cta_display": "Get 15% Off"
  }
]
```

`angle` is 1-indexed. `cta_display` is the original free-text CTA — kept for human reference but not sent to the API. `description` is truncated to 30 characters (the Meta field limit).

**Note:** `assemble` is a utility step, not a required pipeline gate. Run it when preparing to upload ads to Meta Ads Manager. Stages 3–5 do not depend on it.

---

## Stage 3a — Palette Selection

**What it does:** Compares the client's extracted brand colors to 144 curated palettes using perceptual color distance in CIE L\*a\*b\* color space. The nearest-matching palette — with a boost for industry relevance — becomes the six-hex color system for all HTML ads.

**Why an algorithm instead of Claude choosing?** Color selection in V2 was manual: Claude was shown extracted hex values and asked to pick a palette. Hex codes are not intuitively comparable — `#3A7BD5` and `#2E6BC4` look identical when typed but have a CIE ΔE of 8.2, a perceptible difference on screen. An algorithm operating in perceptual color space is more accurate at finding a visual match than a human reading hex strings.

**Why a curated catalog instead of raw scraped colors?** The scraped colors tell us what the brand looks like. But the palette in an ad also needs to work as a design system: the text needs sufficient contrast, the CTA button needs to be visible, the headline needs to read on a dark panel. The 144 curated palettes come pre-tested for these constraints. Matching to them gives Claude a ready-to-use 6-role color system instead of raw hex values that still need role assignment.

**Entry point:** `adgen/palette/runner.py:run_palette()`
**CLI:** `python -m adgen palette <domain>`

### Palette catalog format

`adgen/palette/data/palettes-neutral.md` — 144 entries. Each maps to a `Palette` dataclass:

```python
@dataclass
class Palette:
    name: str
    theme: str            # "Light" or "Dark"
    use_for: str          # comma-separated industry tags
    base: str             # hex — headline text on dark background
    second_tone: str      # hex — secondary text on dark background
    accents: list[str]    # 1–2 hexes — primary/secondary accent colors
    text_cta_bg: str      # hex — dark panel/CTA button background
    body_text: str        # hex — body copy color
    cta_text: str         # hex — CTA button text color
    contrast_rating: str
    all_swatches: list[str]  # flattened list used for distance scoring
```

Each entry in the markdown file:

```markdown
### Palette Name
**Theme:** Light
**Use for:** beauty, wellness, spa
**Colors:** #hex1, #hex2, #hex3, #hex4, #hex5
**Roles:** base, second_tone, accent, text_cta_bg, body_text
```

**Why these six roles?** Every ad in the pipeline uses the same color slots: background, panel, headline text, body text, accent bars, and CTA button. Assigning a hex to each role upfront means Claude never has to decide "which of these colors should be the CTA color?" The palette is a complete, internally-consistent color system.

### Why CIE L\*a\*b\* and not RGB distance

RGB Euclidean distance is not perceptually uniform. The numerical distance between `#FF0000` (red) and `#FE0000` (near-identical red) in RGB is 1 — the same as between `#FF0000` and `#FF0001`. The perceived differences are identical in one direction but very different in another. 

CIE L\*a\*b\* is perceptually uniform: a ΔE of 1.0 = the smallest perceivable color difference. ΔE of 10 = clearly noticeable. ΔE of 30 = strong difference (e.g. medium blue vs. orange). The nearest-swatch score in L\*a\*b\* directly reflects how visually close the palette is to the brand colors.

### sRGB → CIE L\*a\*b\* conversion (full implementation)

```python
def _linearize(c: float) -> float:
    # sRGB linearisation per IEC 61966-2-1
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def _f(t: float) -> float:
    # CIE standard f function
    return t ** (1 / 3) if t > 0.008856 else (7.787 * t + 16 / 116)

def rgb_to_lab(r: int, g: int, b: int) -> tuple[float, float, float]:
    """Convert sRGB (0–255) to CIE L*a*b* using the D65 illuminant."""
    rl = _linearize(r / 255)
    gl = _linearize(g / 255)
    bl = _linearize(b / 255)

    # Linear RGB → CIE XYZ via ITU-R BT.709 matrix, normalised by D65 white point
    # D65 white: Xn=0.95047, Yn=1.00000, Zn=1.08883
    x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047
    y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) / 1.00000
    z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883

    # XYZ → L*a*b*
    L = 116 * _f(y) - 16
    a = 500 * (_f(x) - _f(y))
    b_val = 200 * (_f(y) - _f(z))
    return L, a, b_val
```

### Scoring algorithm

```python
def palette_distance(palette: Palette,
                     scraped_labs: list[tuple[float, float, float]]) -> float:
    """Sum of nearest-swatch CIE Lab distances for each scraped color."""
    swatch_labs = [rgb_to_lab(*hex_to_rgb(s)) for s in palette.all_swatches]
    return sum(
        min(lab_distance(scraped, swatch) for swatch in swatch_labs)
        for scraped in scraped_labs
    )
```

Each scraped brand color finds its nearest match in the palette. The sum of those minimum distances is the palette's total score. Lower = better visual match. This is a nearest-neighbor sum, not an average — it rewards palettes that can match every scraped color closely, not just the average.

### Category detection — 19 industry categories

`detect_category()` scans `manifest.json` text fields (`company_summary`, `goal_summary`, `brand_name`, `text_sections`) for keyword matches. The first category whose keywords appear wins.

```python
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "travel":      ["travel", "ceļojum", "tour", "vacation", "holiday", "trip",
                    "destination", "flight", "hotel", "resort", "beach",
                    "maršrut", "atpūt", "tūrism", "viesn"],
    "beauty":      ["beauty", "wellness", "cosmetics", "spa", "salon", "skin",
                    "āda", "skaistum"],
    "luxury":      ["luxury", "premium", "luksus", "ekskluzīv"],
    "fitness":     ["gym", "fitness", "crossfit", "pilates", "yoga", "workout",
                    "personal trainer", "sporta zāl", "trenažier", "fitnesa", "treniņ"],
    "pets":        ["veterinary", "vet clinic", "pet shop", "pet care", "dog training",
                    "veterinār", "mājas dzīvnieks", "suņ", "kaķ", "zoovet"],
    "health":      ["health", "medical", "clinic", "klīnik", "veselīb",
                    "pharmacy", "aptieka"],
    "food":        ["food", "restaurant", "café", "cafe", "restorān", "ēdien",
                    "catering", "bakery", "maizn", "konditorejas"],
    "real-estate": ["real estate", "property", "realty", "apartment", "mortgage",
                    "nekustam", "dzīvokl", "māj", "īpašum", "rent", "īre",
                    "developer", "būvniek"],
    "automotive":  ["car", "vehicle", "dealership", "auto repair", "car service",
                    "automašīn", "autoserviss", "autoīre", "autosalons",
                    "wheel", "tire", "riepa"],
    "education":   ["school", "course", "training", "academy", "university",
                    "e-learning", "tutor", "skol", "kurs", "akadēmij",
                    "apmācīb", "izglītīb", "sertifikāt"],
    "finance":     ["bank", "insurance", "loan", "invest", "fintech", "mortgage",
                    "credit", "apdrošināšan", "kredīt", "ieguldījum",
                    "finanses", "pensij", "savings"],
    "fashion":     ["fashion", "clothing", "apparel", "collection", "boutique",
                    "wear", "mode", "apģērb", "kolekcij", "drēb"],
    "home":        ["furniture", "interior design", "decor", "renovation",
                    "flooring", "curtains", "mēbel", "interjers", "remont",
                    "dizains", "grīd", "logiem"],
    "events":      ["wedding", "event", "venue", "photography", "photo studio",
                    "videography", "kāzas", "pasākum", "fotogrāf", "videograf",
                    "birthday", "corporate event"],
    "legal":       ["law", "legal", "notary", "attorney", "juridisk", "advokāt",
                    "notārs", "tiesisk", "jurists"],
    "b2b":         ["b2b", "business", "corporate", "staffing", "recruitment",
                    "uzņēmum"],
    "tech":        ["saas", "software", "app", "platform", "digital",
                    "programm", "tehnoloģij"],
    "industrial":  ["construction", "manufacturing", "logistics", "būvniecīb",
                    "loģistik", "safety", "drošīb", "aizsardz", "augstum",
                    "alpīnism", "fall protection", "height", "scaffold",
                    "industrial", "facility", "warehouse", "installation",
                    "inspection", "certif"],
    "retail":      ["shop", "store", "e-commerce", "veikals"],
}
```

**Why both English and Latvian keywords?** The majority of clients served by this pipeline are Latvian businesses. A Latvian beauty salon's website uses `skaistumkopšana` (beauty care), not `beauty`. Without Latvian keyword variants, Latvian-language sites fail to detect any category and lose the 60-point boost entirely.

### Category boost

```python
CATEGORY_BOOST = 60.0  # subtracted from distance score

USE_FOR_BOOST: dict[str, list[str]] = {
    "travel":      ["travel", "lifestyle", "outdoor", "adventure", "clean", "water"],
    "beauty":      ["beauty", "wellness", "cosmetics", "spa", "luxury", "feminine"],
    "luxury":      ["luxury", "premium", "beauty", "fashion"],
    "fitness":     ["fitness", "sport", "health", "active", "energetic", "bold"],
    "health":      ["wellness", "health", "medical", "clean"],
    "food":        ["food", "warm", "restaurant", "appetite"],
    "real-estate": ["real estate", "luxury", "home", "property", "clean", "minimal"],
    "automotive":  ["automotive", "industrial", "clean", "professional", "bold"],
    "education":   ["education", "professional", "clean", "corporate", "fresh"],
    "finance":     ["finance", "corporate", "professional", "clean", "premium"],
    "fashion":     ["fashion", "luxury", "lifestyle", "premium", "feminine", "editorial"],
    "home":        ["home", "interior", "lifestyle", "warm", "clean", "minimal"],
    "events":      ["events", "luxury", "lifestyle", "warm", "feminine", "wedding"],
    "legal":       ["legal", "corporate", "professional", "b2b", "business"],
    "pets":        ["lifestyle", "warm", "clean", "fresh", "friendly"],
    "b2b":         ["b2b", "corporate", "professional", "business"],
    "tech":        ["tech", "saas", "software", "digital", "minimal"],
    "industrial":  ["industrial", "construction", "heavy", "utilitarian", "b2b",
                    "professional services", "safety"],
    "retail":      ["retail", "e-commerce", "product", "consumer"],
}
```

**Why 60 ΔE?** A ΔE of 60 in L\*a\*b\* space corresponds approximately to the perceived difference between a warm beige and a saturated medium blue — a strong but not absolute preference. It overrides a moderate color mismatch but not an extreme one. A beauty brand with electric-orange brand colors gets a beauty palette even if it's a mediocre color match, because the palette theme (soft, warm, feminine) is more important than color proximity for that industry. This value was calibrated empirically against 20+ real clients.

### Input augmentation with product image colors

```python
img_colors = extract_colors_from_folder(product_dir, max_images=4, n_per_image=6)
# Image colors go first — they reflect visual aesthetics better than CSS UI colors
raw = img_colors + [c for c in raw if c not in img_set]
```

**Why?** CSS colors reflect UI design decisions — often muted, functional colors that don't represent the brand's visual identity. Product photography is a stronger signal of how the brand wants to be perceived visually. Prepending product image colors gives them more weight in the distance calculation.

### Manual palette override protection

```python
existing = palette_dir / "chosen.json"
if existing.exists():
    existing_data = json.loads(existing.read_text(encoding="utf-8"))
    if existing_data.get("source") == "image-match":
        print(f"[palette] Skipping — {domain} has an image-matched palette. "
              f"Delete chosen.json to force re-pick.")
        return
```

A `chosen.json` with `"source": "image-match"` is treated as a manually chosen palette and is never overwritten by a re-run. To force the algorithm to re-run, delete `chosen.json`.

### Outputs

```
clients/<domain>/palette/
├── chosen.json    # Top-1 palette: name, theme, swatches (all 6 roles), distance, category
└── shortlist.json # Top-5 candidates for manual inspection or override
```

---

## Stage 3b — Image Generation

**What it does:** Generates AI brand photography using the Pollinations Flux model. Each image gets a fresh, randomised prompt derived from the client's brief, detected industry category, copy content, and palette theme.

**Why generate images rather than using scraped photos?** Scraped photos are the client's existing content — often the wrong dimensions, with busy backgrounds, watermarks, or low resolution. AI-generated images are produced at exactly the right format (1080×1080 or 1080×1350), with deliberate composition for text overlay (clean zone in the bottom third), and tuned to the brand's industry aesthetic.

**Why Flux via Pollinations?** Flux (Black Forest Labs) produces photorealistic images with strong compositional control and excellent prompt adherence. Pollinations provides it as a free public API. V2's Gemini Imagen 4 required a paid API key, failed under concurrent load, and had path resolution bugs. The tradeoff with Pollinations is rate limiting, handled by retry logic.

**Entry point:** `adgen/image/generator.py:generate_image()`
**CLI:** `python -m adgen generate-image <domain> [--count N] [--seed N] [--model <name>] [--concept <name>] [--format square|portrait] [--append]`

### How `build_prompt()` constructs the prompt

`build_prompt(domain, concept)` in `adgen/image/prompt_builder.py` reads three artifacts and derives visual parameters:

| Input | Field used | Derived parameter |
|-------|-----------|------------------|
| `scrape/manifest.json` | All text fields | `category` via `detect_category()` |
| `palette/chosen.json` | `theme` | `"Light"` or `"Dark"` |
| `brief.txt` | `target audience` | `subject` — photographic subject description |
| `brief.txt` | `brand tone` | `mood` — 5 visual mood keywords |
| `brief.txt` | `product` | `setting` — 1–2 word location label |
| `copy/final.json` | `on_image_texts` | `mood_hint` — randomly sampled |

**Brief parsing (`_parse_brief_sections()`):** Line-by-line parser. A line matching `Key: value` starts a new section. Lines starting with `- ` continue the current section as bullet items:

```
Target audience: women aged 28-45 interested in sustainable skincare
Product:
- Daily serum and moisturiser set
- Sold as a 30-day starter kit
Brand tone: warm, honest, science-backed
```

**Subject derivation (`_subject_from_audience()`):** Parses gender keywords (`women/woman/female`, `men/man/male`) and age ranges (`aged? N–N`). Maps the midpoint age to a descriptive bucket:

```python
buckets = [
    (30, "in her late twenties",  "in his late twenties"),
    (40, "in her early thirties", "in his early thirties"),
    (50, "in her early forties",  "in his early forties"),
    (99, "in her fifties",        "in his fifties"),
]
```

Produces: `"elegant woman in her early thirties"` — a photographic subject description the model can render directly, rather than a demographic description it cannot.

**Why derive a subject rather than pass the audience description directly?** Flux is a text-to-image model, not a text-understanding model. "Women aged 28-45 interested in sustainable skincare" confuses it. "Elegant woman in her early thirties" is a direct photographic instruction.

**Mood derivation (`_mood_from_tone()`):** Takes the first sentence of `brand tone`, removes stop words (`and`, `with`, `the`, `a`, etc.) and Latvian grammar markers, returns up to 5 adjective-style keywords.

**Setting derivation (`_setting_from_product()`):** Maps product description keywords to location labels:
```python
mapping = {
    "clinic": "luxury clinic", "spa": "spa", "salon": "beauty salon",
    "studio": "studio", "office": "office", "restaurant": "restaurant",
    "store": "boutique", "shop": "boutique", "gym": "gym",
    "kitchen": "kitchen", "workshop": "workshop",
}
```

### Scene pools — all 19 industry categories

`_SCENES` maps each category to 4–8 scene template strings. `{subject}` is replaced with the derived subject at runtime.

```python
_SCENES = {
    "travel": [
        "{subject} on tropical beach with turquoise water and white sand, vacation lifestyle, warm golden hour light, aspirational travel editorial",
        "{subject} exploring cobblestone street in European old town, travel adventure, warm afternoon light, editorial travel photography",
        "aerial view of stunning Mediterranean coastline with turquoise water, no people, dramatic natural light, travel destination photography",
        "{subject} standing on hotel balcony overlooking ocean at sunset, luxury vacation, warm golden tones, lifestyle editorial",
        "wide shot of Greek island village with whitewashed buildings and blue domes, golden hour, vibrant travel destination photography",
        "{subject} with luggage at beautiful European city square, excited traveller, bright clear daylight, travel lifestyle editorial",
        "panoramic view of tropical resort pool and palm trees, luxury holiday setting, vivid colours, no people, premium travel photography",
        "{subject} hiking on scenic coastal trail, sea views, adventure travel, bright sunny daylight, aspirational lifestyle",
    ],
    "beauty": [
        "close-up portrait of {subject} with radiant luminous glowing skin, no products, no hands, serene expression, warm golden light, clean cream background",
        "{subject} in white spa robe by tall window, morning light flooding in, peaceful expression, lush greenery outside, editorial lifestyle",
        "side profile of {subject} with flawless skin, soft dreamy bokeh, warm amber tones, elegant and serene",
        "overhead aesthetic shot of {subject} lying on white linen treatment bed, face relaxed, soft dramatic shadows, luxury spa atmosphere",
        "{subject} sitting in front of large softbox studio light, glowing skin close-up, clean minimal background, beauty campaign quality",
        "atmospheric luxury spa interior, warm candles, marble surfaces, white orchids, no people, golden reflections, premium beauty editorial",
        "{subject} in elegant minimalist bathroom, steamy mirror, morning ritual, soft diffused light, serene and confident",
        "wide-angle luxury beauty clinic interior, clean white walls, accent lighting, serene and inviting, no people, premium feel",
    ],
    "industrial": [
        "skilled {subject} applying liquid epoxy resin on warehouse floor, wide squeegee tool, industrial floor coating work, dramatic factory lighting",
        "{subject} smoothing freshly poured glossy epoxy flooring in large industrial hall, bent over with long-handled roller, blue coveralls, professional editorial",
        "{subject} operating angle grinder on concrete floor surface preparation, sparks, protective gear, industrial construction site",
        "close-up of {subject} pouring pigmented epoxy compound on concrete floor, hands-on skilled trade work, commercial facility",
        "{subject} inspecting freshly coated glossy epoxy floor in warehouse, kneeling, checking surface quality, industrial editorial",
        "wide shot of epoxy flooring installation crew working on large industrial floor, {subject} in foreground with floor roller, professional construction photography",
    ],
    # ... plus: luxury, fitness, health, food, b2b, tech, real-estate, automotive,
    #           education, finance, fashion, home, events, legal, pets, retail
    # Each with 4–8 scenes specific to that industry's visual language
}
```

**Why are the `industrial` scenes so specific?** Generic industrial prompts (factory, machinery, hard hats) produce stock-photo-looking images that no advertiser would use. These scenes were written based on a real client (epoxy flooring installer) and produce images that match the actual service. Industry scene specificity is built manually as clients with unusual categories are onboarded.

**Why multiple scenes per category?** Random scene selection ensures visual variety while keeping the output within the correct aesthetic range for the industry. Generating the same scene for every beauty client would produce visually identical images across clients.

### Concept modes

| Concept | Scene source | Why it exists |
|---------|-------------|--------------|
| `lifestyle` | Category `_SCENES` pool (default) | Emotional connection through aspirational human scenes |
| `product-flat` | `_CONCEPT_SCENES["product-flat"]` | For product-forward ads where the offering itself is the hero |
| `before-after` | `_CONCEPT_SCENES["before-after"]` | Pairs with pain-point copy; split composition matches the copy structure |
| `social-proof` | `_CONCEPT_SCENES["social-proof"]` | Pairs with testimonial copy; authentic human scenes reinforce trust |

Non-lifestyle concepts bypass the category scene pool entirely:

```python
_CONCEPT_SCENES = {
    "product-flat": [
        "hero product flat lay on clean white surface, soft diffused studio light, minimal drop shadow, commercial product photography, no people",
        "product displayed on textured marble surface, natural side light, clean editorial food-and-product styling, no people, sharp focus",
        "overhead flat lay of product on linen texture, warm morning light, minimal props, premium lifestyle product photography",
        "product on white seamless background, professional studio lighting, sharp commercial photography, no watermarks, no text",
    ],
    "before-after": [
        "split composition: left side dim desaturated problem state, right side bright vibrant transformed result, same {subject} in both halves, strong center divider",
        "diptych: left half shows {subject} looking frustrated and dull, right half shows {subject} confident and glowing after transformation, dramatic lighting contrast",
        "before and after comparison, same {subject}, left panel muted and stressed, right panel bright and satisfied, clean minimal background",
    ],
    "social-proof": [
        "authentic group of satisfied diverse customers in warm natural light, genuine smiles, lifestyle editorial, no studio feel",
        "collage-style composition of multiple happy {subject} faces, warm candid photography, real people, community feel",
        "close-up portrait of happy {subject} after achieving goal, authentic expression, warm natural light, testimonial photography style",
        "{subject} showing result to camera with genuine pride, natural indoor light, authentic and unscripted feel",
    ],
}
```

### Composition, lighting, and copy-space instructions

Every prompt also includes a randomised composition:

```python
_COMPOSITIONS = [
    "subject positioned left third, open negative space on right for text overlay",
    "subject positioned right third, clean open space on left for headline",
    "subject in lower half, clean background above for text",
    "subject slightly off-center, generous breathing room around edges",
]
```

And theme-matched lighting + copy-space directions:

```python
_LIGHTING = {
    "Light": [
        "bright airy lighting, soft natural light, clean bright tones",
        "warm golden hour light, soft diffused glow, lifestyle editorial feel",
        "clean studio lighting, soft even shadows, fresh and pure atmosphere",
        "overcast natural daylight, even soft tones, Nordic minimal aesthetic",
    ],
    "Dark": [
        "dramatic moody lighting, deep rich tones, cinematic shadows",
        "low-key studio lighting, dark background, luxury photography feel",
        "candlelight warm glow, dark atmospheric backdrop, intimate luxury",
        "dramatic side-lighting, strong contrast, editorial high-fashion",
    ],
}

_COPY_SPACE = {
    "Dark": (
        "naturally dark shadowed area occupying the bottom third of the frame "
        "suitable for white text overlay — no bright highlights in that zone"
    ),
    "Light": (
        "clean soft-light area in the bottom third of the frame "
        "suitable for dark text overlay — no busy patterns or high contrast in that zone"
    ),
}

# Guard: both dicts must share the same keys
assert set(_LIGHTING) == set(_COPY_SPACE), \
    "keys must match — mismatched defaults produce contradictory lighting+copy-space combos"
```

**Why the copy-space instruction?** In the final ad, copy is placed over the generated image. If the image has a bright highlight where the copy sits, white text becomes unreadable. If it has a busy pattern, dark text is unreadable. This instruction directs the model to leave a legible text zone in the bottom third — exactly where the ad's headline and CTA will be rendered.

### Safety prefix and negative prompt

```python
_SAFETY_PREFIX = (
    "family-friendly, fully clothed, professional, appropriate for all ages, PG-13, "
    "no nudity, no revealing clothing, no suggestive poses"
)

_NEGATIVE = (
    "nudity, bare skin, revealing clothing, suggestive poses, sexual content, "
    "adult content, NSFW, violence, gore, weapons, drugs, alcohol, smoking, "
    "text, words, letters, logos, watermarks, signs, banners, "
    "low quality, blurry, pixelated, cartoon, illustration, painting, "
    "multiple faces, crowd, cluttered background, ugly, deformed"
)
```

`_SAFETY_PREFIX` is prepended to every positive prompt — it keeps output PG-13 across all models and use cases. The negative prompt excludes the most common failure modes: unwanted text overlays (the model sometimes generates signage), illustration styles (Flux can drift toward illustrated looks), and multiple faces (which create confusing ad compositions).

### Final prompt assembly

```python
parts = [
    f"Professional advertising photograph for {brand_name}.",
    _SAFETY_PREFIX + ".",
    concept_note,                   # "Concept: product-flat." if non-lifestyle
    scene + ".",                    # randomised scene with {subject} substituted
    f"{setting} interior." if (setting and concept == "lifestyle") else "",
    f"Mood: {mood}." if mood else "",
    lighting + ".",                 # randomised from _LIGHTING[theme]
    composition + ".",              # randomised from _COMPOSITIONS
    copy_space + ".",               # palette-theme-aware text zone instruction
    f'Emotion: "{mood_hint}".' if mood_hint else "",
    _QUALITY + ".",                 # "ultra high quality, 8k, sharp focus, ..."
]

prompt = " ".join(p for p in parts if p)
return prompt, _NEGATIVE
```

### API call and retry logic

```python
_RETRY_DELAYS = [10, 20, 40]  # seconds

gen = pollinations.Image(
    model=model,     # "flux" by default
    width=width,     # 1080 (square) or 1080 (portrait)
    height=height,   # 1080 (square) or 1350 (portrait)
    seed=seed,       # random int in [1, 999_999]
    nologo=True,     # suppress Pollinations watermark
    enhance=True,    # Pollinations prompt enhancement pass
    safe=True,       # content safety filter
)

for attempt, delay in enumerate([0] + _RETRY_DELAYS):
    if delay:
        print(f"[image] Rate-limited, retrying in {delay}s… (attempt {attempt + 1})")
        time.sleep(delay)
    try:
        gen(prompt=prompt, negative=negative, file=str(out_path), save=True)
        break
    except Exception as exc:
        if "429" not in str(exc):
            raise  # non-rate-limit errors are fatal immediately
else:
    raise RuntimeError(f"Pollinations failed after retries: {last_err}")
```

**Why exponential backoff (10, 20, 40)?** Rate-limiting means the API queue is full. Retrying immediately adds to the queue. Waiting progressively longer gives the API time to drain. After 70 seconds total wait across 3 retries, a `RuntimeError` is raised — a hard stop that tells the user to try again rather than silently producing corrupt output.

**Why does a non-429 error re-raise immediately?** A 400 (bad prompt), 500 (server error), or connection error will not resolve by waiting. Only 429 is expected to resolve with time.

When `--count N` is used, each image gets a fresh `build_prompt()` call and a new random seed — no two images in a batch share the same prompt. A 5-second inter-request pause is inserted between images.

### Output naming matrix

```python
suffix = f"-{concept}" if concept != "lifestyle" else ""
suffix += f"-{fmt}" if fmt != "square" else ""
```

| Flags | Filename |
|-------|---------|
| Default (single lifestyle square) | `generated.jpg` |
| `--count 3` | `generated-1.jpg`, `generated-2.jpg`, `generated-3.jpg` |
| `--concept social-proof` | `generated-social-proof.jpg` |
| `--format portrait` | `generated-portrait.jpg` |
| `--concept social-proof --format portrait` | `generated-social-proof-portrait.jpg` |
| `--concept social-proof --count 2` | `generated-social-proof-1.jpg`, `generated-social-proof-2.jpg` |
| `--append` (after `generated-2.jpg` exists) | `generated-3.jpg` (continues from 3) |

All seeds from a run are written to `image/seed.txt` (one per line). Use `--seed <N>` to reproduce any image exactly.

---

## Stage 4 — HTML Ad Design

**What it does:** Claude reads all stage 1–3 outputs and writes self-contained HTML files, one per ad. Python then validates and auto-fixes each file in-place.

**Why HTML?** HTML + CSS is the most expressive layout format available without a design tool. It renders accurately in any browser, is easily inspected and edited, loads Google Fonts natively, and can be rendered to pixel-perfect PNG via Puppeteer. Alternative formats (SVG, PDF, image compositing) would be less expressive, harder to edit, or require additional dependencies.

**Why self-contained?** Each HTML file embeds everything it needs — fonts via Google Fonts CDN link, images via file-path references, all CSS inline or in a `<style>` tag. Any file can be opened directly in a browser or passed to Puppeteer without a local server.

**Entry point:** Claude session reading `CLAUDE.md`
**Validation CLI:** `python -m adgen render <domain>`

### Canvas specification and universal CSS reset

```css
* { margin: 0; padding: 0; box-sizing: border-box }
* { hyphens: none; -webkit-hyphens: none }
html, body { width: 1080px; height: 1080px; overflow: hidden }
```

In code (`shape_templates.py`):
```python
_RESET = (
    "*{margin:0;padding:0;box-sizing:border-box}"
    "*{hyphens:none;-webkit-hyphens:none}"
    "html,body{width:1080px;height:1080px;overflow:hidden}"
)
```

**Why `hyphens: none` universally?** On a 1080 px canvas displayed at ~360 px on a mobile feed (0.33× scale), hyphenated word breaks produce endings like `profes-` `sional` that read as broken text at small sizes. `hyphens: none` forces words to wrap as complete units. This eliminates a major readability problem common in AI-generated ad HTML.

**Why `overflow: hidden`?** The canvas is exactly 1080×1080. If any element overflows — a long headline, a tall bullet list — `overflow: hidden` clips it at the canvas boundary, preventing layout breaks that would only be discovered in Puppeteer.

### Google Fonts loading

```python
_FONTS = (
    '<link href="https://fonts.googleapis.com/css2?family='
    "Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600"
    "&family=Raleway:wght@300;400;500;600"
    '&display=swap" rel="stylesheet">'
)
```

**Why Raleway specifically?** Raleway has full Latvian glyph coverage (ā, ē, ī, ū, ģ, ķ, ļ, ņ, š, ž). Other modern sans-serif fonts commonly used in ads (Jost, DM Sans) do not. All templates for Latvian-language clients default to Raleway for body copy.

All ads also include before `</body>`:
```html
<script>document.fonts.ready.then(() => document.body.classList.add('fonts-loaded'))</script>
```

This `fonts.ready` script is what Puppeteer waits for before taking the screenshot.

### Two-spacer flex layout

Every ad uses this vertical structure regardless of shape template:

```html
<body style="display:flex; flex-direction:column; height:1080px">
  <div class="logo-zone">…logo…</div>
  <div style="flex:1"></div>           <!-- spacer 1 -->
  <div class="content">
    …headline, on_image_text, bullets…
  </div>
  <div style="flex:1"></div>           <!-- spacer 2 -->
  <div class="cta-wrap">…CTA…</div>
</body>
```

**Why two spacers?** A single spacer would push content to one end. Two equal `flex:1` spacers distribute remaining height symmetrically — content is always centered between the logo and the CTA, spacers absorb the difference when copy length varies. A short set of bullets produces large spacers (more whitespace). A long set produces small spacers (tighter layout). The visual hierarchy — logo top, content middle, CTA bottom — is preserved in both cases.

### Typography constraints

| Element | Minimum size | Minimum weight | Rationale |
|---------|-------------|---------------|-----------|
| Headline | 68 px | 600 | At 360 px feed width: 68 × 0.33 ≈ 22 px on screen. Minimum for a dominant visual hierarchy element. Weight 600 ensures stroke thickness against background images. |
| Body / bullets | 22 px | — | 22 × 0.33 = 7.3 px on screen — empirical minimum for legible body text on mobile. Below this, text is decorative rather than readable. |
| CTA button | 21 px | — | Button background provides additional contrast; slightly smaller than body is acceptable. |
| Chip / eyebrow | 20 px | — | Secondary labels; slightly smaller is acceptable. |
| Logo image | 64–130 px height | — | 64 = minimum identifiable. 130 = maximum before dominating canvas. Pipeline default: 116 px. |
| Logo text | 36–64 px | — | Minimum readable as a brand identifier; maximum before overwhelming the layout. |

**Why is Cormorant Garamond exempted from the weight-600 minimum?** Cormorant Garamond is a display serif with optically prominent thin strokes even at weight 500. Forcing weight 600 destroys its editorial character. The validator explicitly exempts it.

### Logo placement by `logo_bg`

The scraper writes `logo_bg` into `manifest.json` (stage 1 post-validation). Stage 4 uses this to choose safe placement:

| `logo_bg` | Treatment | Why |
|-----------|----------|-----|
| `transparent` | Place on any background | A transparent PNG composites correctly on any color. |
| `white` | Light panels only, or add padding | White logo on white panel = invisible. On dark panel = white rectangle artifact. |
| `dark` | Dark panels only | Dark logo on light panel = dark box around logo. |
| `color` | Contrasting panel or `drop-shadow` filter | Colored background needs either to match (invisible box) or contrast (intentional box). |

### RenderContext — the data object passed to every template

`load_context(domain, photo_path)` in `adgen/render/context.py` reads three pipeline outputs and merges them into a single typed object passed to every shape template function.

```python
@dataclass
class RenderContext:
    # Identity
    domain: str           # e.g. "aekora.com"
    brand_name: str       # from manifest.json — full title string
    language: str         # "lv" or "en" — controls font choice and copy language
    logo_path: str | None # absolute path to primary logo file
    photo_path: str | None # absolute path to generated image (passed via --photo)

    # Palette swatches (from chosen.json → swatches)
    base: str             # headline text on dark background
    second_tone: str      # secondary text
    accents: list[str]    # 1–2 accent hex values
    text_cta_bg: str      # dark panel / CTA button background
    body_text: str        # body copy color
    cta_text: str         # CTA button text color

    # Copy (from final.json)
    headlines: list[str]      # 3 items
    bullets: list[str]        # 6 items
    base_texts: list[str]     # 3 items
    on_image_texts: list[str] # 3 items
    cta: str                  # e.g. "Book a Free Call"
```

**Derived properties** (computed, not stored):

| Property | Returns | Logic |
|----------|--------|-------|
| `ctx.accent` | `str` | `accents[0]` or `text_cta_bg` if no accents |
| `ctx.accent2` | `str` | `accents[1]` or `accent` if only one accent |
| `ctx.short_name` | `str` | Brand name stripped of subtitle separators (` – `, ` | `, ` - `, ` — `) |
| `ctx.logo_url()` | `str` | `file:///...` URI for the logo file, or `""` if not found |
| `ctx.photo_url()` | `str` | `file:///...` URI for the generated photo, or `""` if not found |

**Why file:// URIs?** Puppeteer opens files via the local filesystem. Relative paths from inside the HTML file to a different directory (`../../image/generated.jpg`) break when the file is opened from a different CWD. Absolute `file:///` URIs are always resolved correctly regardless of where Puppeteer is launched from.

**Why `short_name`?** The scraped brand name often includes a subtitle (`"Aekora Studio — Natural Skincare"`). Using the full title in a logo text element produces text too long for the logo zone. `short_name` strips everything after the first separator, giving just `"Aekora Studio"`.

### Shape vocabulary — 7 structural templates

All seven are Python functions in `adgen/render/shape_templates.py`. Each: `fn(ctx: RenderContext, angle: int = 0) → str`

**Shared geometry constants:**

```python
# 8-point starburst — 16 alternating points (outer 50%, inner 25%, 22.5° step)
_STARBURST = (
    "polygon(50% 0%,60% 27%,85% 15%,73% 40%,100% 50%,"
    "73% 60%,85% 85%,60% 73%,50% 100%,40% 73%,"
    "15% 85%,27% 60%,0% 50%,27% 40%,15% 15%,40% 27%)"
)

# Flat-top regular hexagon — 6 vertices
_HEXAGON = "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)"

# 9 concave scallop arcs across 1080px, relative to a 550px-tall panel element.
# Each arc: 120px wide, peak 50px above element top edge.
_SCALLOP = (
    "path('M 0,50 Q 60,0 120,50 Q 180,0 240,50 Q 300,0 360,50 "
    "Q 420,0 480,50 Q 540,0 600,50 Q 660,0 720,50 "
    "Q 780,0 840,50 Q 900,0 960,50 Q 1020,0 1080,50 L 1080,550 L 0,550 Z')"
)
```

| Slug | Technique | Key geometry details |
|------|-----------|---------------------|
| `starburst` | `clip-path: polygon(…)` | 16 alternating vertices: outer at 50% radius, inner at 25% radius, advancing 22.5° per step → 8-point star |
| `overlap` | `border-radius:50%` at negative margin | Circle photo bleeds behind text column; 4 px accent bar marks the junction |
| `diamond` | `clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)` | 4 vertices at midpoints of each side — a 45°-rotated square |
| `knockout` | SVG `<clipPath>` + `<text>` element | Photo is visible through the letterform shape |
| `hexagon` | `clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)` | Flat-top regular hexagon, 6 vertices |
| `scallop` | `clip-path: path('M 0,50 Q 60,0 120,50 …')` | 9 quadratic Bézier arcs at 120 px pitch across 1080 px canvas, each peaking 50 px above panel edge |
| `conic` | `background: conic-gradient(from N deg at 50% 50%, …)` | Type-forward, no photo; visual interest from burst gradient |

**Why 7 shapes?** Enough to fill a typical ad batch (6–10 ads) with a unique structural layout for each, without repetition. More would add diminishing value; fewer would produce visually repetitive batches.

**Why code rather than descriptions (V2 used .md specs)?** V2's template descriptions required Claude to interpret prose and generate HTML from scratch each session — producing inconsistent class names, different inline values, and different structures that made the regex-based validator unreliable. V3 encodes each template as a function that always produces the same structural HTML; Claude's contribution is the copy, color values, and photo paths passed in via `RenderContext`.

### Bullet style catalog — 7 CSS generators (full implementation)

`bullet_style_for_ad(ad_index)` returns `STYLE_NAMES[ad_index % 7]`. `bullet_style_css(style, accent, accent2)` returns a CSS block ready to paste into `<style>`.

**Alpha derivation from palette accent:**
```python
glow  = _rgba(accent, 0.55)  # box-shadow glow
light = _rgba(accent, 0.14)  # subtle background fill
faint = _rgba(accent, 0.20)  # separator line
inner = _rgba(accent, 0.08)  # inset glow
```

All tints derive from the same accent hex — the frosted-card style on `accent: #E4A489` produces a warm peach glow; on `accent: #2E6BC4` it produces blue. Style vocabulary is constant; color expression adapts to the brand.

**Complete CSS for all 7 styles:**

```python
# gradient-pill
f".benefit,.brow{{background:linear-gradient(105deg,{accent},{accent2});"
f"border-radius:28px;padding:11px 20px;"
f"box-shadow:0 4px 18px {glow};gap:12px;}}\n"
f".btext{{color:#fff;font-weight:600;}}\n"
f".bicon,.bicon svg{{color:#fff;fill:#fff;}}\n"
f".bdot{{background:rgba(255,255,255,0.65);}}"

# glow-border
f".benefit,.brow{{border:2px solid {accent};border-radius:28px;"
f"padding:10px 18px;gap:12px;"
f"box-shadow:0 0 18px {glow},inset 0 0 8px {inner};"
f"background:rgba(255,255,255,0.05);}}\n"
f".btext{{color:{text};}}\n"
f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
f".bdot{{background:{accent};box-shadow:0 0 8px {glow};}}"

# color-flash
f".benefit,.brow{{background:{light};border-left:5px solid {accent};"
f"border-radius:0 10px 10px 0;padding:11px 18px;gap:12px;}}\n"
f".btext{{color:{text};font-weight:500;}}\n"
f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
f".bdot{{display:none;}}"

# hard-tab
f".benefit,.brow{{border-left:5px solid {accent};border-radius:0;"
f"padding:9px 16px;gap:12px;background:transparent;}}\n"
f".btext{{color:{text};}}\n"
f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
f".bdot{{display:none;}}"

# frosted-card
f".benefit,.brow{{background:rgba(255,255,255,0.13);"
f"backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);"
f"border:1px solid rgba(255,255,255,0.22);"
f"border-radius:14px;padding:11px 18px;gap:12px;}}\n"
f".btext{{color:{text};}}\n"
f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
f".bdot{{background:rgba(255,255,255,0.6);}}"

# numbered-badge  (uses CSS counters — no icon HTML needed)
f".benefits{{counter-reset:benefit-num;}}\n"
f".benefit,.brow{{counter-increment:benefit-num;gap:14px;}}\n"
f".benefit::before,.brow::before{{content:counter(benefit-num);"
f"min-width:34px;height:34px;background:{accent};border-radius:50%;"
f"font-size:15px;font-weight:700;color:#fff;"
f"text-align:center;line-height:34px;flex-shrink:0;}}\n"
f".bicon,.bdot{{display:none;}}\n"
f".btext{{color:{text};font-weight:500;}}"

# accent-dot
f".benefit,.brow{{gap:14px;padding:8px 0;"
f"border-bottom:1px solid {faint};}}\n"
f".benefit:last-child,.brow:last-child{{border-bottom:none;}}\n"
f".benefit::before,.brow::before{{content:'';"
f"width:10px;height:10px;border-radius:50%;background:{accent};"
f"flex-shrink:0;margin-top:7px;box-shadow:0 0 8px {glow};}}\n"
f".bicon,.bdot{{display:none;}}\n"
f".btext{{color:{text};}}"
```

| Style | When it works best |
|-------|-------------------|
| `gradient-pill` | Dark backgrounds with strong accent colors |
| `glow-border` | Dark backgrounds where the neon glow adds depth |
| `color-flash` | Bold, feature-table aesthetic on any background |
| `hard-tab` | Editorial / magazine-style layouts |
| `frosted-card` | On-photo layouts where blur creates visual separation from the background |
| `numbered-badge` | When sequence or ranking matters (step 1, 2, 3 framing) |
| `accent-dot` | Minimal, high-contrast layouts; reads cleanly at very small sizes |

### HTML layout validator — all thresholds and checks

**File:** `adgen/validate_html.py`

```python
# Canvas
CANVAS_H = 1080
MIN_GAP  = 8   # px minimum clear gap between any text element and CTA

# Logo image thresholds (img.logo-img, img.logo)
LOGO_IMG_MIN_H   = 64    # below this logo disappears at feed scale
LOGO_IMG_MAX_H   = 130   # above _LOGO_HEIGHT (116) — don't lower this
LOGO_IMG_DEFAULT = 76

# Logo text thresholds (.logo-txt)
LOGO_TXT_MIN_FONT   = 36
LOGO_TXT_MAX_FONT   = 64
LOGO_TXT_DEFAULT    = 48

LOGO_DEFAULT_MAX_W  = "360px"
LOGO_MIN_OPACITY    = 0.50

# Proportionality
LOGO_HEADLINE_MIN_RATIO = 0.45
LOGO_HEADLINE_MAX_RATIO = 2.00  # permissive — house logo (116px) > typical 80px headline

# Typography minimums
BULLET_TEXT_MIN_FONT = 22   # 22 × 0.33 feed scale ≈ 7px on phone — minimum legible
BODY_TEXT_MIN_FONT   = 22
CHIP_TEXT_MIN_FONT   = 20
EYEBROW_MIN_FONT     = 20

# Headline font-weight
HEADLINE_MIN_WEIGHT_NON_EDITORIAL = 600

# Overlay protection
MIN_OVERLAY_ALPHA = 0.55  # gradient darkest stop must reach this to protect white text
```

| Check | Threshold | Auto-fix or warn |
|-------|-----------|-----------------|
| Logo img height | `[64, 130]` px | Auto-clamp to 76 |
| Logo txt font-size | `[36, 64]` px | Auto-clamp to 48 |
| Logo max-width | Must be set | Auto-set to 360px |
| Logo opacity | `≥ 0.50` | Warn only — may be intentional glass effect |
| Headline font-weight | `≥ 600` (non-editorial) | Warn only — may be intentional editorial choice |
| Body text size | `≥ 22` px | Warn |
| CTA gap | `≥ 8` px clear space | Auto-fix padding |
| Overlay alpha | `≥ 0.55` darkest stop | Warn only |

**Why auto-fix some but warn on others?** Auto-fixes apply to measurements with a safe default: a logo at 50 px can be clamped to 76 px without understanding design intent. Warnings apply where the value might be intentional: opacity 0.4 on a logo might be a deliberate glass effect. Auto-fixing it would destroy the design. A warning puts the decision in the designer's hands.

---

## Stage 5 — PNG Export

**What it does:** Puppeteer renders each HTML file to a 2160×2160 PNG using headless Chromium.

**Why Puppeteer and not a Python library?** Python image libraries (Pillow, wkhtmltopdf, imgkit) cannot reliably render modern CSS: `clip-path`, `backdrop-filter`, `conic-gradient`, Google Fonts, CSS custom properties. Only a real browser engine handles all of these correctly. Puppeteer uses the same Chromium engine as Google Chrome.

**Why `deviceScaleFactor: 2`?** Produces 2160×2160 from a 1080×1080 canvas — a 2× retina PNG. Meta Ads Manager displays ads at varying sizes per placement. A 2× image stays sharp at native 1080 resolution and survives any platform upscaling. A 1× image upscaled would show pixelation on high-DPI displays.

**Why wait for `document.fonts.ready`?** Google Fonts are loaded via a `<link>` tag — the browser makes an extra HTTP request to fetch the font file. If Puppeteer screenshots before the font loads, text renders in a fallback font (usually generic serif or sans-serif) — producing an ad that looks completely different from the intended design. The `document.fonts.ready` promise resolves only when all fonts are downloaded and ready.

**CLI:** `node scripts/export-png.js <html-dir> <png-dir>`

**Output:** `clients/<domain>/png/<same-filename-as-html>.png` — 2160×2160 retina PNG, ready for Meta Ads Manager.

---

## Client Output Layout

```
clients/<domain>/
├── brief.txt
├── scrape/
│   ├── manifest.json          # Full structured JSON
│   │                          # Fields: brand_name, language, location, company_summary,
│   │                          #   goal_summary, text_sections, social_proof,
│   │                          #   primary_logo_path, logos[], product_images[],
│   │                          #   other_images[], colors[], logo_bg
│   ├── info.txt               # Human-readable summary (Claude reads in stage 2)
│   ├── client_memory.txt      # Claude chat context block
│   ├── accent_colors.txt      # Hex colors, one per line, priority-ordered
│   ├── scraped_urls.txt       # All page and image URLs collected
│   ├── logo/                  # Downloaded logo files
│   ├── product_images/        # Downloaded product/gallery images (up to 35)
│   └── other_images/          # All other images (up to max_images)
│
├── copy/
│   ├── components.json        # Claude's first-pass copy (temp)
│   ├── refined.json           # Claude's refined copy if validation failed (temp)
│   ├── final.json             # CANONICAL — the only file stages 3b+ read
│   └── assembled.json         # Meta Ads API format (optional, from adgen assemble)
│                              # Fields: angle, primary_text, headline, description,
│                              #   call_to_action_type (Meta enum), cta_display
│
├── palette/
│   ├── chosen.json            # Top-1: name, theme, swatches (all 6 roles),
│   │                          #   distance, detected_category, matched_against[]
│   └── shortlist.json         # Top-5 candidates for manual inspection/override
│
├── image/
│   ├── generated.jpg          # Single lifestyle square (most common case)
│   ├── generated-1.jpg        # Multiple images (--count 3 → -1, -2, -3)
│   ├── generated-social-proof-1.jpg   # Concept-labeled variants
│   ├── generated-portrait-1.jpg       # Format-labeled variants
│   └── seed.txt               # One seed per line; pass to --seed for reproduction
│
├── html/
│   ├── ad-1-starburst.html    # Self-contained 1080×1080 HTML ad
│   ├── ad-2-overlap.html
│   ├── ad-3-diamond.html
│   ├── …
│   └── preview-feed.html      # Instagram phone-frame mockup (from adgen preview)
│                              # Shows first 3 ads at 320px scale inside IG UI shells
│
└── png/
    ├── ad-1-starburst.png     # 2160×2160 retina PNG
    ├── ad-2-overlap.png
    ├── …
    └── ad-1-starburst-zones.json  # Zone analysis output (from adgen zone-review)
                               # Per-zone: brightness, uniformity, edge_density,
                               #   dominant_color, label ("dark panel", "photo", etc.)
```

**Why domain-based naming?** The output directory name is always deterministic from the input URL — no manual naming decision, no collision risk if two clients have similar business names, easy cross-referencing between output and source URL.

**Why is `final.json` the canonical file?**
The promote step copies `refined.json` → `final.json` if refinement happened, or `components.json` → `final.json` if not. Downstream stages always read `final.json`. This means: (a) stages 3b+ never need to know whether refinement happened, (b) a human can manually edit `final.json` without the change being overwritten, (c) re-running palette or image stages never accidentally reads a pre-refinement draft.

---

## CLI Reference

```bash
# ── Stage 1: Scrape ────────────────────────────────────────────────────────────
python -m adgen scrape <url>
  [--brief <path>]          # Path to brief.txt. Prompts interactively if omitted.
  [--max-pages N]           # Max pages to crawl. Default: 12.
  [--max-images N]          # Max images to download. Default: 100.
  [--keep-existing]         # Skip clearing existing scrape output. Useful for
                            # adding pages without wiping downloaded images.

# Post-scrape: validate images and detect logo_bg
python -m adgen validate-images clients/<domain>/scrape/manifest.json

# ── Stage 2: Copy ──────────────────────────────────────────────────────────────
# (Claude writes components.json in the session, then:)

python -m adgen validate clients/<domain>/copy/components.json
  # Exits 0 (PASS — no blocking issues) or 1 (FAIL — issue list printed)

python -m adgen promote-copy <domain>
  # Copies refined.json → final.json, or components.json → final.json if no refinement

# ── Stage 3a: Palette ──────────────────────────────────────────────────────────
python -m adgen palette <domain>
  # Reads accent_colors.txt + product_images/, writes chosen.json + shortlist.json

# ── Stage 3b: Image generation ─────────────────────────────────────────────────
python -m adgen generate-image <domain>
  [--count N]                # Images to generate. Each gets a fresh randomised prompt.
  [--seed N]                 # Fixed seed (single-image only). For exact reproduction.
  [--model <name>]           # Pollinations model. Default: flux.
  [--concept lifestyle|product-flat|before-after|social-proof]
  [--format square|portrait] # square=1080×1080, portrait=1080×1350. Default: square.
  [--append]                 # Continue numbering after highest existing generated-N file.

# ── Stage 4: HTML ads ──────────────────────────────────────────────────────────
# (Claude writes HTML files in the session, then:)

python -m adgen render <domain>
  [--photo <path>]           # Pass a specific photo to templates that need one.
  # Reads all .html in html/, validates, auto-fixes in-place, prints summary table.

python -m adgen generate-shapes <domain>
  [--photo <path>]
  [--start-index N]          # First ad number. Auto-detected from existing files if omitted.
  [--only starburst,hexagon] # Generate only specific shape slugs.

# ── Utilities ──────────────────────────────────────────────────────────────────
python -m adgen validate-html <domain>
  # Standalone HTML validator (same as render but no photo arg)

python -m adgen zone-review <domain>
  [--file <png-path>]        # Analyse a single PNG instead of whole domain.
  [--rows N] [--cols N]      # Grid division. Default: 3×3 (TOP/MID/BOT × LEFT/CENTER/RIGHT)
  # Splits each PNG into a rows×cols grid and measures per zone:
  #   brightness    — 0-255 mean pixel brightness
  #   uniformity    — 0-1, inverse of brightness std-dev (1 = flat solid, 0 = complex photo)
  #   edge_density  — 0-1 mean edge strength via FIND_EDGES filter (high = text / UI elements)
  #   dominant_color — most-frequent non-extreme hex after 16-color quantisation
  #   label         — heuristic: "dark panel", "photo", "light background", "text/UI", etc.
  # Writes clients/<domain>/png/<ad-name>-zones.json per file
  # Use to verify: copy-space zone (BOT row) is dark/light appropriate for text overlay

python -m adgen remove-bg <image-path>
  # Removes background from an image using rembg (ONNX U2Net, CPU)
  # Output: <original-name>-no-bg.png with alpha channel
  # Use case: product photos, logos with colored backgrounds

python -m adgen preview <domain>
  # Generates clients/<domain>/html/preview-feed.html
  # An Instagram phone-frame mockup showing the first 3 ads at 320px width
  # Scale factor: 320/1080 = 0.296× (matches actual feed display size)
  # The phone shell includes: Dynamic Island, Instagram top bar, stories row,
  #   sponsored post header, ad iframe, engagement row (likes/comment/share/save)
  # Open in Chrome/Edge with --allow-file-access-from-files for iframe rendering

python -m adgen assemble <domain>
  # Reads copy/final.json, writes copy/assembled.json
  # Meta Ads API fields: primary_text, headline, description (30 char), call_to_action_type
  # Maps free-text CTA → Meta enum (SHOP_NOW, BOOK_TRAVEL, GET_OFFER, LEARN_MORE, etc.)
  # Produces 3 copy angles (one per headline × base_text pair)

# ── matrix (not yet implemented) ───────────────────────────────────────────────
# python -m adgen matrix <domain>
#   Reserved for future use — planned to generate all 7×7 shape×bullet combinations

# ── Stage 5: PNG export ────────────────────────────────────────────────────────
node scripts/export-png.js <html-dir> <png-dir>
  # Puppeteer renders each .html → 2160×2160 PNG
  # Waits for document.fonts.ready before each screenshot
```

---

## Validation Architecture and Why It Matters

Two validation passes gate the pipeline at different junctions with different behaviors:

```
Stage 2 ──► validate.py ──► EXIT 1 ──► Claude refines ──► validate.py ──► EXIT 0 ──► promote-copy
              (hard gate)                                     (re-check)

Stage 4 ──► validate_html.py ──► auto-fix in-place ──► summary table printed
              (soft gate)
```

**Why different behavior at each gate?**

`validate.py` exits 1 and **blocks** the pipeline because copy quality errors cannot be auto-fixed — they require Claude's judgment to rewrite. Proceeding to palette and image stages with bad copy means those stages generate assets for copy that will need to change anyway — wasted work.

`validate_html.py` auto-fixes and **continues** because HTML layout issues are mostly mechanical: a logo at 50 px can be clamped to 76 px algorithmically without understanding design intent. Auto-fixing avoids requiring the user to iterate with Claude on layout numbers that have obvious correct values. Only issues that might be intentional design choices (opacity, editorial font weight) become warnings rather than auto-fixes.

**Why not just trust Claude to get it right and skip validation?**

Validation exists because Claude's output consistency cannot be relied on for mechanical constraints. In a fresh session with full context, Claude reliably produces good copy. In a half-full context window, or a session where the user has been iterating on something else for a while, the copy quality drops without any signal that it has dropped. The validator catches that drop deterministically before it becomes a downstream problem. It also catches language drift: the FILLER_OPENERS check is bilingual (English + Latvian), but the character limits and vague descriptor checks are language-independent and fire regardless of what has happened in the session.

---

## Decision Log — Why Each Architecture Choice Was Made

### Why is Claude the copy and design engine rather than fine-tuned models?

Fine-tuned models for ad copy exist (GPT-4-based tools, Jasper, etc.) but they produce formulaic output anchored in training data patterns. The pipeline's copy quality standard — specific to the client's brand voice, grounded in scraped website text, avoiding vague descriptors, producing native-language Latvian copy with correct cultural register — requires reasoning about the specific client, not pattern-matching to ad examples. Claude reads the scraped `info.txt`, understands the brand context, and writes copy informed by that context. A fine-tuned model sees the prompt and produces tokens; Claude reasons about the brief and writes copy.

### Why is the pipeline staged rather than end-to-end automated?

An end-to-end automated system would produce consistent but mediocre output. The bottleneck in ad performance is creative quality — a technically correct ad with generic copy and adequate design does not perform. The staged pipeline keeps a human in the loop at the two highest-value decision points (copy and design) while automating deterministic work (scraping, color math, image generation, PNG export). This produces better output than full automation and requires less effort than full manual work.

### Why 12 pages as the default crawl limit?

12 pages captures the main brand-relevant content (homepage, about, services, contact, 2–3 product pages) on most SMB websites without hitting blog post archives or terms-of-service pages that add noise without adding brand signal. For larger sites with more product depth, `--max-pages` can be increased. For single-page sites (common in Latvia), the crawl completes early with fewer pages — the limit is a ceiling, not a target.

### Why 144 palettes in the catalog?

144 palettes covers the main aesthetic directions across the 19 supported industries with enough variety that similar industries don't all land on the same palette. Each industry typically has 3–5 relevant palette families (light/fresh, dark/luxury, warm/earthy, cool/professional, bold/energetic). 144 total provides 7–8 palettes per industry on average — enough to produce a distinguishable result for different brands within the same category.

### Why is `CATEGORY_BOOST = 60.0`?

60 ΔE in L\*a\*b\* space approximates the perceived difference between a warm beige and a saturated medium blue — a strong but not absolute preference. It overrides a moderate color mismatch but not an extreme one. If a beauty brand has electric-orange brand colors and the nearest beauty palette is pastel pink (ΔE = 80), the boost makes the beauty palette win even though it's a poor color match — because the theme (soft, warm, feminine) matters more than color proximity for that industry. This value was calibrated empirically against 20+ real clients.

### Why store seeds in `seed.txt`?

Without recording the seed, a generated image cannot be reproduced. `seed.txt` records all seeds from a batch so that if a specific image needs to be regenerated at a different format or concept, the same seed + prompt combination produces a visually consistent result. This is important for A/B testing — a client wanting both square and portrait versions of the same image uses `--seed <N> --format portrait` to reproduce the same subject and scene in the new format.

### Why `final.json` as the canonical copy file?

The promote step creates an explicit "checkpoint" file. Subsequent stages read only `final.json`. This means: (a) re-running any downstream stage never accidentally reads a pre-refinement draft, (b) a human can manually edit `final.json` to override Claude without the change being overwritten by a future run, (c) the pipeline never needs to know which path was taken (components → final directly, or components → refined → final).

### Why not just trust Claude to follow the V2 anti-AI-slop rules?

V2's anti-AI-slop rules were good rules. The problem was enforcement: Claude self-assessed compliance, which is inconsistent across sessions. Measurement-based rules (character count, regex match for banned phrases) should be enforced by a program, not by the same system generating the content. V3's validator enforces everything that can be measured. Claude's attention is reserved for everything that cannot be measured: voice, specificity, hook originality.

---

## Extending the System

### Adding a palette

Edit `adgen/palette/data/palettes-neutral.md`. Each entry must follow:

```markdown
### Palette Name
**Theme:** Light
**Use for:** category1, category2
**Colors:** #hex1, #hex2, #hex3, #hex4, #hex5
**Roles:** base, second_tone, accent, text_cta_bg, body_text
```

`catalog.py` parses the file on every run. No code changes required.

### Adding an industry category

**Why three files must change:** Category detection (`runner.py`), palette boosting (`runner.py`), and image generation (`prompt_builder.py`) are three independent systems that share the same category name. Adding it in only one place produces an incomplete result.

1. Add a keyword list to `CATEGORY_KEYWORDS` in `adgen/palette/runner.py`.
2. Add a `USE_FOR_BOOST` entry in the same file.
3. Add a scene pool to `_SCENES` in `adgen/image/prompt_builder.py` (4–8 scenes minimum).

Verify category detection works before generating images:

```bash
python -c "
from adgen.palette.runner import detect_category
import json, pathlib
m = json.loads(pathlib.Path('clients/<domain>/scrape/manifest.json').read_text())
print(detect_category(m))
"
```

### Adding a bullet style

Add a new entry to `STYLE_NAMES` in `adgen/render/bullet_styles.py` and implement the `if style == "name":` branch in `bullet_style_css()`. The cycle length via `ad_index % len(STYLE_NAMES)` updates automatically.

### Adding a shape template

Add a `(slug, fn)` tuple to `TEMPLATES` in `adgen/render/shape_templates.py`. The function must:
- Accept `(ctx: RenderContext, angle: int = 0)` and return a complete HTML string
- Include `_RESET` CSS: `*{hyphens:none;-webkit-hyphens:none}`
- Use the two-spacer flex pattern (logo → spacer → content → spacer → cta)
- Include `<script>document.fonts.ready.then(…)</script>` before `</body>`
- Reference only palette hex values from `ctx.palette`, never hardcoded arbitrary colors
- Contain all layout within the 1080×1080 canvas (`overflow:hidden` on `body`)

### Manually overriding the selected palette

1. Find the palette name in `adgen/palette/data/palettes-neutral.md`.
2. Modify `clients/<domain>/palette/chosen.json` and add `"source": "image-match"`.
3. Re-running `python -m adgen palette <domain>` detects this field and skips overwriting.

---

## Roadmap

| Stage | Status | Description |
|-------|--------|------------|
| 1 — Scrape | Done | Multi-page BFS crawler, asset download, four-source color extraction, logo background detection |
| 2 — Copy | Done | Claude copywriting with hard-gate validator (length, dash, filler, vague, hook strength) |
| 3a — Palette | Done | CIE L\*a\*b\* nearest-swatch matching against 144 curated palettes with 19-category boost |
| 3b — Images | Done | Brief-driven Pollinations Flux generation with 19-category scene pools, 4 concepts, retry logic |
| 4 — HTML Ads | Done | Claude design with 7 shape templates × 7 bullet CSS styles + auto-fix validator |
| 5 — PNG Export | Done | Puppeteer 2× retina rendering (2160×2160), `fonts.ready` wait |
| 6 — Image QA | Planned | Automated LLM-based image quality scoring before stage 4 — reject images before Claude sees them |
| 7 — Memory | Planned | Persistent client memory across pipeline sessions — remember past choices per domain |
| 8 — Meta API | Planned | Restore V2's direct ad creation via Meta Graph API v21.0 with PAUSED-by-default safety |
