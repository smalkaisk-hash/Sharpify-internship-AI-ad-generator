# Meta Ad Generator V3

**End-to-end pipeline for producing production-ready Meta (Facebook/Instagram) ad creatives from a client URL.**

Scrape → Write copy → Match palette → Generate photography → Design HTML → Export PNG.
No design tool. No paid image API. No manual color picking. One Claude session per stage.

![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue)
![Node 18+](https://img.shields.io/badge/Node.js-18%2B-green)
![Image API](https://img.shields.io/badge/Image%20API-Free-brightgreen)
![Output](https://img.shields.io/badge/Output-2160×2160%20PNG-orange)
![License](https://img.shields.io/badge/License-Proprietary%20%C2%A9%20Sharpify-red)

---

## What it produces

A full ad batch from one URL:

```
clients/example.com/
├── copy/final.json          ← validated copy: headlines, bullets, base texts, CTA
├── palette/chosen.json      ← 6-role color system matched to brand colors
├── image/generated-1.jpg    ← AI photography tuned to industry + palette theme
├── html/ad-1-starburst.html ← self-contained 1080×1080 HTML (7 layouts)
└── png/ad-1-starburst.png   ← 2160×2160 retina PNG, ready for Ads Manager
```

---

## Quick start

**Prerequisites:** Python ≥ 3.10, Node.js ≥ 18, [uv](https://github.com/astral-sh/uv)

```bash
cd meta-ad-generator-v3
uv sync
npm install puppeteer
```

**Run a full client session:**

```bash
# 1 — Scrape brand assets
python -m adgen scrape https://client-site.com

# 2 — Write and validate copy  (Claude session)
python -m adgen validate clients/<domain>/copy/components.json
python -m adgen promote-copy <domain>

# 3 — Select palette + generate images
python -m adgen palette <domain>
python -m adgen generate-image <domain> --count 3

# 4 — Design HTML ads  (Claude session)
python -m adgen render <domain>
python -m adgen preview <domain>

# 5 — Export PNGs
node scripts/export-png.js clients/<domain>/html clients/<domain>/png
```

---

## How it works

| Stage | Tool | What happens |
|-------|------|-------------|
| Scrape | Python (requests + BS4) | BFS crawl up to 12 pages — logo, colors, brand text, social proof |
| Copy | Claude session | Structured JSON copy validated by a hard-exit Python gate |
| Palette | Python (CIE L*a*b*) | 144 curated palettes scored by perceptual color distance + industry boost |
| Images | Pollinations Flux | Brief-driven prompt built from audience, tone, and category scene pool |
| HTML ads | Claude session | 7 shape templates × 7 bullet styles, auto-fixed by layout validator |
| PNG export | Puppeteer | `deviceScaleFactor: 2` → 2160×2160, waits for `document.fonts.ready` |

**Human in the loop at copy (stage 2) and design (stage 4).** Everything else is automated.

---

## Key design choices

- **No paid APIs for stages 1–5.** Pollinations AI (Flux) is free. No Gemini, no OpenAI images.
- **Validated copy, not trusted copy.** `validate.py` exits 1 on bad copy — Claude cannot proceed without passing it.
- **Perceptual color matching.** CIE ΔE distance, not RGB. The algorithm works in the color space the human eye uses.
- **Portable.** No hardcoded paths. All output lives under `clients/<domain>/`.

---

## Project layout

```
meta-ad-generator-v3/   ← active system (this README)
meta-ad-generator/      ← V2 archive (Gemini Imagen, Puppeteer scraper)
```

Full technical reference, all algorithms, CLI flags, and extension guide:
**[→ meta-ad-generator-v3/MANUAL.md](meta-ad-generator-v3/MANUAL.md)**

---

## Requirements

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Python | ≥ 3.10 | Core pipeline |
| uv | latest | Package manager (lock file install) |
| Node.js | ≥ 18 | PNG export via Puppeteer |
| Puppeteer | latest | Headless Chromium renderer |

All Python dependencies are pinned in `meta-ad-generator-v3/uv.lock`.

---

## License

**Proprietary — All Rights Reserved.**

This software was developed during an internship using Sharpify's resources and equipment. It is the exclusive intellectual property of Sharpify. No part of this codebase may be used, copied, modified, distributed, or reproduced in any form without explicit written permission from Sharpify.

See [LICENSE](LICENSE) for full terms.
