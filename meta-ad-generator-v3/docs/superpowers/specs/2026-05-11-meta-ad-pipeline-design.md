# Meta Ad Generator — Pipeline Design

Date: 2026-05-11
Status: Draft, scope limited to stages 1–3

## Goal

A fully automatic Meta ad creation tool. The user opens a Claude Code session in this folder, provides a website URL and a short brief about the firm, and Claude orchestrates the entire pipeline — running Python tools for deterministic work, doing the reasoning/copy/design work itself, and using OpenAI only for image generation and image validation.

This spec covers the **first three stages** (scrape, copy, palette). Stages 4–7 (templates, OpenAI image generation, image verification, chat memory) will be designed in follow-on specs.

## Architecture Overview

**Claude is the brain. Python is the toolbelt. OpenAI is reserved for image work.**

```
┌───────────────────────────────────────────────────────────────┐
│  Claude Code session                                          │
│                                                               │
│  Reads CLAUDE.md → follows the pipeline for given URL+brief   │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Stage 1 — Scrape                                       │ │
│  │  Runs:  python -m adgen scrape <url>                    │ │
│  │  Reads: clients/<domain>/scrape/{info.txt,manifest.json}│ │
│  └─────────────────────────────────────────────────────────┘ │
│                            ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Stage 2 — Copy                                         │ │
│  │  Claude generates components.json per copywriter.md     │ │
│  │  Runs:  python -m adgen validate <path>                 │ │
│  │  If issues: Claude refines per refiner.md → refined.json│ │
│  │  Writes: clients/<domain>/copy/final.json               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Stage 3 — Palette                                      │ │
│  │  Runs:  python -m adgen palette <domain>                │ │
│  │  Writes: clients/<domain>/palette/{chosen,shortlist}.json│ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

**Stages 1 and 3 are pure Python — no LLM involved.** Stage 2 is Claude doing the copy work in its own responses, with a Python validator as the quality gate.

## Key Decisions

| Decision | Choice |
|---|---|
| Language | Python for helper tools |
| LLM | Claude (this Claude Code session) — no API key needed |
| OpenAI usage | Reserved for stages 5–6 only (image gen, image validation) |
| Folder layout | One folder per brand: `clients/<domain>/<stage>/` |
| Brief input | `--brief <file>` flag, with interactive prompt fallback |
| Palette selection | Hex-distance match — pure code, no LLM |
| CLI | `click` with subcommands |
| Orchestration | `CLAUDE.md` at project root tells Claude the pipeline steps |

## Top-Level Layout

```
meta-ad-generator-v3/
├── .env                          OPENAI_API_KEY (only used stages 5–6)
├── CLAUDE.md                     Pipeline instructions for Claude
├── pyproject.toml                deps + entry point
├── prompts/
│   ├── copywriter.md             Claude reads this to generate copy
│   └── refiner.md                Claude reads this when validator flags issues
├── adgen/                        Python helper package
│   ├── __main__.py               CLI dispatcher
│   ├── config.py                 paths and constants
│   ├── paths.py                  client_dir(domain), stage paths
│   ├── brief.py                  load brief from file or prompt
│   ├── scrape/                   stage 1 — see below
│   ├── validate.py               stage 2 quality gate
│   └── palette/                  stage 3 — see below
├── docs/superpowers/specs/       this folder
└── clients/
    └── <domain>/
        ├── brief.txt             user's brand feedback (saved for repro)
        ├── scrape/
        │   ├── info.txt
        │   ├── manifest.json
        │   ├── accent_colors.txt
        │   ├── scraped_urls.txt
        │   ├── client_memory.txt
        │   ├── logo/
        │   ├── product_images/
        │   └── other_images/
        ├── copy/
        │   ├── components.json   Claude's first-pass output
        │   ├── refined.json      after refiner pass (only if validation flagged issues)
        │   └── final.json        the canonical file downstream stages read
        └── palette/
            ├── chosen.json       single chosen palette
            └── shortlist.json    top 5 candidates (debugging + future template use)
```

## CLI Surface (the Python toolbelt)

```bash
python -m adgen scrape <url> [--brief <file>] [--max-images N] [--max-pages N] [--keep-existing]
python -m adgen validate <path-to-components-json>
python -m adgen palette <domain>
```

These are the deterministic tools Claude calls during the pipeline. Each is independently runnable — useful for debugging or re-running a single stage.

There is **no `run` subcommand**. Orchestration is Claude's job (per `CLAUDE.md`), not the CLI's. The pipeline is driven by a human prompt to Claude, not a shell command.

If `--brief` is omitted on `scrape`, the tool prompts interactively at run-time and writes the result to `clients/<domain>/brief.txt`.

## CLAUDE.md (orchestration)

A markdown file at project root that any Claude Code session opened in this folder will see. It describes the pipeline so Claude knows exactly how to respond when the user says "generate ads for example.com with this brief".

Contents (sketch — exact wording finalized during implementation):

```markdown
# Meta Ad Generator — How to Run the Pipeline

When the user gives you a URL and a brand brief, run these steps:

1. **Scrape:** `python -m adgen scrape <url> --brief <path-to-brief-file>`
   The scraper writes everything to `clients/<domain>/`. Note the domain
   from the scraper's final output line.

2. **Copy:** Read `clients/<domain>/scrape/info.txt`, `manifest.json`, and
   `brief.txt`. Read `prompts/copywriter.md` — follow it exactly. Write the
   JSON you produce to `clients/<domain>/copy/components.json`.

3. **Validate:** Run `python -m adgen validate clients/<domain>/copy/components.json`.
   If it reports issues, read `prompts/refiner.md`, fix only the flagged
   issues, and write the result to `clients/<domain>/copy/refined.json`.
   Then copy the final version (refined if it ran, else components) to
   `clients/<domain>/copy/final.json`.

4. **Palette:** `python -m adgen palette <domain>`

5–7: Templates, image generation, image validation, chat memory —
specs to be written.
```

## Stage 1 — Scrape

**Source:** Port the existing `webscraper/` package from the `webscrape/` reference folder into `adgen/scrape/`.

**Changes from the original:**
- Single output folder `clients/<domain>/scrape/`. Drop the dual write to `memory_client/`.
- Rewrite the outdated `chat_context` string in `client_memory.txt`. New string describes this project (brand scraped for downstream ad generation), not "user is building a website brand scraper".
- Save `brief.txt` to `clients/<domain>/brief.txt` (alongside `scrape/`, not inside it).
- Same CLI flags: `--max-images`, `--max-pages`, `--keep-existing`.

**What stays:** All extraction logic — brand name, language, location, company info, goal summary, text sections, logo selection, color extraction from CSS backgrounds and primary logo, image classification (logo / product / other), JSON-LD parsing.

**Files written:**
- `info.txt` — human-readable brand summary
- `manifest.json` — full structured data (consumed by stages 2 and 3)
- `accent_colors.txt` — one hex per line (consumed by stage 3)
- `scraped_urls.txt` — scraped page URLs and image source URLs
- `client_memory.txt` — chat-context summary
- `logo/`, `product_images/`, `other_images/` — downloaded images

## Stage 2 — Copy

**No LLM API calls.** Claude does the copy work directly in its responses, reading the same prompt the original Node code used as a system prompt.

**Inputs Claude reads:**
- `clients/<domain>/scrape/info.txt`
- `clients/<domain>/scrape/manifest.json` (for `language`, `brand_name`)
- `clients/<domain>/brief.txt`
- `prompts/copywriter.md` (copied verbatim from `copy+color/prompts/copywriter.md`)

**Flow:**
1. Claude reads the scrape outputs + brief + `prompts/copywriter.md`. Following `copywriter.md` exactly, Claude generates the components JSON and writes it to `clients/<domain>/copy/components.json` with the Write tool.
2. Claude runs `python -m adgen validate clients/<domain>/copy/components.json`. The validator (`adgen/validate.py`) is a port of the JS validator from `copy+color/`:
   - headline length ≤ 40 chars
   - bullet length ≤ 60 chars
   - base_text length ≤ 220 chars
   - on_image_text length ≤ 30 chars
   - no `" — "` or `" - "` separators
   - no filler openers ("Are you", "Do you", "Have you", "Imagine", and Latvian equivalents — wordlist in code)
   - no vague descriptors (configurable wordlist)
   Prints issues to stdout, exits 0 if clean, exit 1 if issues.
3. If validator reported issues: Claude reads `prompts/refiner.md` (copied from `copy+color/prompts/refiner.md`), fixes only the flagged issues, and writes the result to `clients/<domain>/copy/refined.json`.
4. Claude writes the canonical version (refined if it ran, else components) to `clients/<domain>/copy/final.json`. Stages 4+ read this single file and never need to know whether refinement ran.

**Prompts:** Copy `copywriter.md` and `refiner.md` from `copy+color/prompts/` unchanged. They are language-agnostic and well-tested.

**Why this works:** Claude follows external prompt files all the time (skills, CLAUDE.md). Treating `copywriter.md` and `refiner.md` as instructions to Claude — rather than as API system prompts — is mechanically the same and saves an API call + a key.

## Stage 3 — Palette

**No LLM call.** Pure code.

**Inputs:**
- `clients/<domain>/scrape/accent_colors.txt`

**Catalog source:** `adgen/palette/data/palettes-neutral.md` (copied from `copy+color/color palete/palettes-neutral.md`, 144 palettes).

**Catalog parsing (`catalog.py`):** Parse the markdown once. Each palette block produces a `Palette` dataclass:
```python
@dataclass
class Palette:
    name: str
    theme: str                     # "Light" / "Dark"
    use_for: str                   # category tags
    base: str                      # hex
    second_tone: str | None
    accents: list[str]
    text_cta_bg: str
    body_text: str                 # may differ from text_cta_bg
    cta_text: str
    contrast_rating: str           # "✓" / "(large only)" / "⚠"
    all_swatches: list[str]        # every hex in the palette, for distance matching
```

**Matching (`runner.py`):**
1. Load scraped accent colors as RGB tuples.
2. For each palette, compute `distance = sum over scraped_colors of min(rgb_euclidean(scraped, swatch) for swatch in palette.all_swatches)`. This rewards palettes that have something near every scraped color.
3. Sort palettes ascending by distance. Take top 5.
4. Write `palette/shortlist.json` with the top 5 (name + swatches + distance).
5. Write `palette/chosen.json` with the top 1:
   ```json
   {
     "name": "Lavender Sapphire Mist",
     "theme": "Light",
     "use_for": "botanical beauty, floral branding, spa, wellness",
     "swatches": {
       "base": "#F0DAD5",
       "second_tone": "#BABBB1",
       "accents": ["#DEA785", "#D9A69F", "#C56B62", "#6C739C"],
       "text_cta_bg": "#424658",
       "body_text": "#424658",
       "cta_text": "#F0DAD5"
     },
     "contrast_rating": "✓",
     "distance": 12.3,
     "matched_against": ["#a0a0a0", "#808080", "#604020"]
   }
   ```

## Cross-Cutting Concerns

### `config.py`
```python
DEFAULT_MAX_PAGES = 12
DEFAULT_MAX_IMAGES = 100
# Image-generation / vision constants reserved for stages 5–6.
```

### `paths.py`
Helpers: `client_dir(domain)`, `scrape_dir(domain)`, `copy_dir(domain)`, `palette_dir(domain)`, `brief_path(domain)`. All anchored to a `clients/` root at the project root.

### Dependencies (`pyproject.toml`)
```toml
[project]
dependencies = [
  "requests>=2.31",
  "beautifulsoup4>=4.12",
  "Pillow>=10",
  "click>=8.1",
]
# OpenAI SDK + python-dotenv will be added with stages 5–6.
```

## Out of Scope (Future Specs)

- Stage 4: Templates — teammate is working on these
- Stage 5: OpenAI image generation (gpt-image-1 or DALL-E 3) — produces the final ad imagery
- Stage 6: Image verification using OpenAI vision (gpt-4o)
- Stage 7: Chat memory — persistent notes Claude reads/updates per user request

These stages will be designed in follow-on specs once stages 1–3 are working.

## Testing Approach

- Stage 1: run end-to-end on `https://123spa.lv` (the example client already scraped in the reference folder). Verify output matches the structure documented above.
- Stage 2: with the stage 1 output of 123spa.lv plus a one-paragraph brief, manually walk through the pipeline — Claude produces components.json, validator runs clean (or flags issues that the refiner round fixes).
- Stage 3: confirm the chosen palette for 123spa.lv has reasonable hex distance from the scraped grayscale palette; sanity-check the matched palette visually.

## Open Questions

None for stages 1–3.
