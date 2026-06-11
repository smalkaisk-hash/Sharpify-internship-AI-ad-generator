# Meta Ad Generator — Stages 1–3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first three pipeline stages (scrape, copy, palette) for the Meta Ad Generator, plus the orchestration scaffolding (`CLAUDE.md`, `prompts/`, CLI) that Claude will use to drive the full pipeline.

**Architecture:** Python helper package `adgen/` with three subcommands (`scrape`, `validate`, `palette`) callable via `python -m adgen <cmd>`. Claude (this Claude Code session) is the LLM doing copywriting and refining work directly in its responses, guided by `prompts/copywriter.md` and `prompts/refiner.md`. A root `CLAUDE.md` tells Claude how to run the pipeline. OpenAI is not touched in stages 1–3.

**Tech Stack:** Python 3.10+, requests, beautifulsoup4, Pillow, click, pytest. No LLM SDK in stages 1–3.

**Reference source locations (read-only during the port):**
- Scraper: `C:\Users\Ritvars Volfs\Downloads\webscrape\webscraper\`
- Prompts: `C:\Users\Ritvars Volfs\Downloads\copy+color (1)\copy+color\prompts\` (need `copywriter.md` and `refiner.md`)
- Palette catalog: `C:\Users\Ritvars Volfs\Downloads\copy+color (1)\copy+color\color palete\palettes-neutral.md`
- Example scraped output (for testing reference): `C:\Users\Ritvars Volfs\Downloads\webscrape\memory_client\123spa.lv\`

**Target project root:** `C:\Users\Ritvars Volfs\Desktop\meta-ad-generator-v3\`

---

## Task 1: Project scaffolding + git init

**Files:**
- Create: `pyproject.toml`
- Create: `.gitignore`
- Create: `adgen/__init__.py`
- Create: `adgen/config.py`
- Create: `tests/__init__.py`
- Create: `tests/conftest.py`

- [ ] **Step 1.1: Initialize git**

Run:
```bash
cd "C:/Users/Ritvars Volfs/Desktop/meta-ad-generator-v3"
git init
git branch -m main
```

Expected: `Initialized empty Git repository in .../meta-ad-generator-v3/.git/`

- [ ] **Step 1.2: Write `.gitignore`**

Create `.gitignore`:
```
.env
__pycache__/
*.pyc
.pytest_cache/
.venv/
venv/
clients/
*.egg-info/
build/
dist/
```

- [ ] **Step 1.3: Write `pyproject.toml`**

Create `pyproject.toml`:
```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "adgen"
version = "0.1.0"
description = "Automatic Meta ad generator"
requires-python = ">=3.10"
dependencies = [
  "requests>=2.31",
  "beautifulsoup4>=4.12",
  "Pillow>=10",
  "click>=8.1",
]

[project.optional-dependencies]
dev = ["pytest>=8.0"]

[tool.setuptools.packages.find]
where = ["."]
include = ["adgen*"]
```

- [ ] **Step 1.4: Create empty package files**

Create `adgen/__init__.py`:
```python
"""Meta Ad Generator — Claude-orchestrated pipeline."""
```

Create `adgen/config.py`:
```python
"""Project-wide constants."""
from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CLIENTS_ROOT = PROJECT_ROOT / "clients"

DEFAULT_MAX_PAGES = 12
DEFAULT_MAX_IMAGES = 100
```

Create `tests/__init__.py` (empty file).

Create `tests/conftest.py`:
```python
"""Shared pytest fixtures."""
from __future__ import annotations

import pytest


@pytest.fixture
def tmp_clients_root(tmp_path, monkeypatch):
    """Redirect CLIENTS_ROOT to a temp directory for the duration of a test."""
    from adgen import config
    monkeypatch.setattr(config, "CLIENTS_ROOT", tmp_path)
    return tmp_path
```

- [ ] **Step 1.5: Install package in editable mode**

Run:
```bash
pip install -e ".[dev]"
```

Expected: `Successfully installed adgen-0.1.0` plus the listed deps.

- [ ] **Step 1.6: Verify pytest discovers the empty tests folder**

Run:
```bash
pytest -q
```

Expected: `no tests ran in <time>` (exit 0) or a single line saying 0 tests collected. Should not error.

- [ ] **Step 1.7: Commit**

```bash
git add .gitignore pyproject.toml adgen/__init__.py adgen/config.py tests/__init__.py tests/conftest.py
git commit -m "chore: scaffold adgen package and project config"
```

---

## Task 2: `paths.py` — file-layout helpers

Path helpers for every stage. Tests assert that paths resolve under the configured `CLIENTS_ROOT` so the rest of the code never hard-codes layout.

**Files:**
- Create: `adgen/paths.py`
- Create: `tests/test_paths.py`

- [ ] **Step 2.1: Write the failing tests**

Create `tests/test_paths.py`:
```python
from __future__ import annotations

from adgen import paths


def test_client_dir_under_root(tmp_clients_root):
    result = paths.client_dir("example.com")
    assert result == tmp_clients_root / "example.com"


def test_scrape_dir(tmp_clients_root):
    assert paths.scrape_dir("example.com") == tmp_clients_root / "example.com" / "scrape"


def test_copy_dir(tmp_clients_root):
    assert paths.copy_dir("example.com") == tmp_clients_root / "example.com" / "copy"


def test_palette_dir(tmp_clients_root):
    assert paths.palette_dir("example.com") == tmp_clients_root / "example.com" / "palette"


def test_brief_path(tmp_clients_root):
    assert paths.brief_path("example.com") == tmp_clients_root / "example.com" / "brief.txt"


def test_ensure_client_dirs_creates_all_subdirs(tmp_clients_root):
    paths.ensure_client_dirs("example.com")
    base = tmp_clients_root / "example.com"
    assert (base / "scrape").is_dir()
    assert (base / "copy").is_dir()
    assert (base / "palette").is_dir()
```

- [ ] **Step 2.2: Run the tests and confirm they fail**

Run:
```bash
pytest tests/test_paths.py -v
```

Expected: All tests FAIL with `ModuleNotFoundError: No module named 'adgen.paths'`.

- [ ] **Step 2.3: Implement `paths.py`**

Create `adgen/paths.py`:
```python
"""File layout helpers anchored under `config.CLIENTS_ROOT`.

Importing `config.CLIENTS_ROOT` at call time (rather than at import time)
lets tests monkeypatch the root.
"""
from __future__ import annotations

from pathlib import Path

from . import config


def client_dir(domain: str) -> Path:
    return config.CLIENTS_ROOT / domain


def scrape_dir(domain: str) -> Path:
    return client_dir(domain) / "scrape"


def copy_dir(domain: str) -> Path:
    return client_dir(domain) / "copy"


def palette_dir(domain: str) -> Path:
    return client_dir(domain) / "palette"


def brief_path(domain: str) -> Path:
    return client_dir(domain) / "brief.txt"


def ensure_client_dirs(domain: str) -> None:
    for path in (scrape_dir(domain), copy_dir(domain), palette_dir(domain)):
        path.mkdir(parents=True, exist_ok=True)
```

- [ ] **Step 2.4: Run the tests and confirm they pass**

Run:
```bash
pytest tests/test_paths.py -v
```

Expected: All six tests PASS.

- [ ] **Step 2.5: Commit**

```bash
git add adgen/paths.py tests/test_paths.py
git commit -m "feat: add path helpers for per-brand stage folders"
```

---

## Task 3: `brief.py` — load brand brief from file or prompt

Loads the user's brand brief text either from a `--brief` file or by prompting interactively.

**Files:**
- Create: `adgen/brief.py`
- Create: `tests/test_brief.py`

- [ ] **Step 3.1: Write the failing tests**

Create `tests/test_brief.py`:
```python
from __future__ import annotations

from pathlib import Path

import pytest

from adgen import brief


def test_load_from_file_reads_contents(tmp_path: Path):
    target = tmp_path / "brief.txt"
    target.write_text("Premium spa builder targeting affluent homeowners.\n", encoding="utf-8")
    assert brief.load_brief(target) == "Premium spa builder targeting affluent homeowners."


def test_load_from_file_missing_raises(tmp_path: Path):
    with pytest.raises(FileNotFoundError):
        brief.load_brief(tmp_path / "missing.txt")


def test_prompt_brief_reads_multiline_until_blank(monkeypatch):
    lines = iter(["First line.", "Second line.", "", ""])
    monkeypatch.setattr("builtins.input", lambda *_args, **_kwargs: next(lines))
    result = brief.prompt_brief()
    assert result == "First line.\nSecond line."
```

- [ ] **Step 3.2: Run the tests and confirm they fail**

Run:
```bash
pytest tests/test_brief.py -v
```

Expected: All tests FAIL — module not found.

- [ ] **Step 3.3: Implement `brief.py`**

Create `adgen/brief.py`:
```python
"""Load a brand brief from a file or interactive prompt."""
from __future__ import annotations

from pathlib import Path


def load_brief(path: Path) -> str:
    """Read brief text from a file, stripped of leading/trailing whitespace."""
    return Path(path).read_text(encoding="utf-8").strip()


def prompt_brief() -> str:
    """Prompt for multi-line brief input. Two consecutive blank lines end input."""
    print("Paste any extra context about the brand (target audience, offer, tone).")
    print("Press Enter on an empty line twice when done.\n")
    lines: list[str] = []
    blank_run = 0
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line == "":
            blank_run += 1
            if blank_run >= 2:
                break
            continue
        blank_run = 0
        lines.append(line)
    return "\n".join(lines).strip()
```

- [ ] **Step 3.4: Run the tests and confirm they pass**

Run:
```bash
pytest tests/test_brief.py -v
```

Expected: All three tests PASS.

- [ ] **Step 3.5: Commit**

```bash
git add adgen/brief.py tests/test_brief.py
git commit -m "feat: add brief loader (file or interactive prompt)"
```

---

## Task 4: Port the scraper into `adgen/scrape/` — copy reference files

Verbatim copy of the eight Python files from the reference webscraper. Modifications happen in Tasks 5–8.

**Files:**
- Create: `adgen/scrape/__init__.py`
- Create: `adgen/scrape/cli.py` (copy of reference `cli.py`)
- Create: `adgen/scrape/config.py` (copy of reference `config.py`)
- Create: `adgen/scrape/crawler.py` (copy of reference `crawler.py`)
- Create: `adgen/scrape/images.py` (copy of reference `images.py`)
- Create: `adgen/scrape/models.py` (copy of reference `models.py`)
- Create: `adgen/scrape/output.py` (copy of reference `output.py`)
- Create: `adgen/scrape/text.py` (copy of reference `text.py`)
- Create: `adgen/scrape/utils.py` (copy of reference `utils.py`)

- [ ] **Step 4.1: Copy the reference files**

Source: `C:\Users\Ritvars Volfs\Downloads\webscrape\webscraper\`

Use the `Read` and `Write` tools (or `cp`) to copy each file's exact contents:
- `cli.py` → `adgen/scrape/cli.py`
- `config.py` → `adgen/scrape/config.py`
- `crawler.py` → `adgen/scrape/crawler.py`
- `images.py` → `adgen/scrape/images.py`
- `models.py` → `adgen/scrape/models.py`
- `output.py` → `adgen/scrape/output.py`
- `text.py` → `adgen/scrape/text.py`
- `utils.py` → `adgen/scrape/utils.py`

- [ ] **Step 4.2: Create the package init**

Create `adgen/scrape/__init__.py`:
```python
"""Stage 1 — website brand scraper."""
from .crawler import scrape_site

__all__ = ["scrape_site"]
```

- [ ] **Step 4.3: Verify the imports still resolve**

Run:
```bash
python -c "from adgen.scrape import scrape_site; print('ok')"
```

Expected: `ok`

If you get an import error, it is almost certainly because internal imports in the copied files use `from .config import ...` etc. — those should be unchanged from the original (they were already relative imports).

- [ ] **Step 4.4: Commit**

```bash
git add adgen/scrape/
git commit -m "feat: port scraper package into adgen/scrape (verbatim copy)"
```

---

## Task 5: Adapt scraper config and output paths

Switch the scraper to write into the new per-brand layout: `clients/<domain>/scrape/` instead of `clients/scraping/<domain>/`. Drop the dual write to `memory_client/`.

**Files:**
- Modify: `adgen/scrape/config.py`
- Modify: `adgen/scrape/crawler.py`

- [ ] **Step 5.1: Update `adgen/scrape/config.py`**

Replace the two output-root constants at the top of the file.

Find:
```python
DEFAULT_OUTPUT_ROOT = Path("clients") / "scraping"
MEMORY_OUTPUT_ROOT = Path("memory_client")
```

Replace with:
```python
from adgen.config import CLIENTS_ROOT

DEFAULT_OUTPUT_ROOT = CLIENTS_ROOT
```

(Delete the `MEMORY_OUTPUT_ROOT` line entirely — no more dual write.)

- [ ] **Step 5.2: Update `adgen/scrape/crawler.py` — remove the memory_client import and per-domain layout**

Find the import line:
```python
from .config import DEFAULT_OUTPUT_ROOT, INTERNAL_PAGE_HINTS, MAX_IMAGES, MAX_PAGES, MEMORY_OUTPUT_ROOT, REQUEST_TIMEOUT, SKIP_LINK_HINTS
```

Replace with:
```python
from .config import DEFAULT_OUTPUT_ROOT, INTERNAL_PAGE_HINTS, MAX_IMAGES, MAX_PAGES, REQUEST_TIMEOUT, SKIP_LINK_HINTS
```

- [ ] **Step 5.3: Update the output directory derivation in `scrape_site`**

Find this line inside `scrape_site`:
```python
    output_dir = output_root / domain_slug(final_url)
```

Replace with:
```python
    output_dir = output_root / domain_slug(final_url) / "scrape"
```

- [ ] **Step 5.4: Drop the memory_client copy**

Find the call inside `scrape_site`:
```python
    write_memory_client_copy(result, output_dir, clear_existing)
```

Replace with:
```python
    write_client_memory_inline(result, output_dir)
```

- [ ] **Step 5.5: Replace the `write_memory_client_copy` function**

Delete the entire `write_memory_client_copy` function (the one that copies the folder to `memory_client/`).

In its place, define a small inline writer that just produces `client_memory.txt` next to the other outputs in `scrape/`:

```python
def write_client_memory_inline(result: ScrapeResult, output_dir: Path) -> None:
    chat_context = (
        "This brand was scraped by the Meta Ad Generator pipeline. The scrape "
        "output sits under clients/<domain>/scrape/ and is consumed by the copy "
        "and palette stages. See info.txt for human-readable summary, manifest.json "
        "for structured data, accent_colors.txt for the extracted color palette."
    )
    write_client_memory_file(result, output_dir, chat_context)
```

- [ ] **Step 5.6: Smoke-test the import + output path**

Run:
```bash
python -c "from adgen.scrape import scrape_site; from adgen.scrape.config import DEFAULT_OUTPUT_ROOT; print(DEFAULT_OUTPUT_ROOT)"
```

Expected: the absolute path to `C:\...\meta-ad-generator-v3\clients`.

- [ ] **Step 5.7: Commit**

```bash
git add adgen/scrape/config.py adgen/scrape/crawler.py
git commit -m "feat(scrape): write to clients/<domain>/scrape, drop memory_client dual-write"
```

---

## Task 6: Adapt scraper CLI to use a click-friendly entry point

The original `cli.py` has its own argparse parser and `main()` function. We will keep that working (for backwards compatibility and isolated runs), but also expose a function the project CLI dispatcher can call.

**Files:**
- Modify: `adgen/scrape/cli.py`

- [ ] **Step 6.1: Add a `run_scrape` function that accepts parsed args directly**

Append to `adgen/scrape/cli.py` (after the existing `main()`):

```python
def run_scrape(
    url: str,
    output: Path | None = None,
    max_images: int = MAX_IMAGES,
    max_pages: int = MAX_PAGES,
    keep_existing: bool = False,
) -> Path:
    """Programmatic entry point used by the project CLI dispatcher.

    Returns the output directory on success. Raises RequestException if the
    site cannot be opened.
    """
    output_root = Path(output) if output else DEFAULT_OUTPUT_ROOT
    ensure_dependencies()
    return scrape_site(
        url,
        output_root,
        max_images=max_images,
        max_pages=max_pages,
        clear_existing=not keep_existing,
    )
```

- [ ] **Step 6.2: Verify import**

Run:
```bash
python -c "from adgen.scrape.cli import run_scrape; print('ok')"
```

Expected: `ok`

- [ ] **Step 6.3: Commit**

```bash
git add adgen/scrape/cli.py
git commit -m "feat(scrape): add programmatic run_scrape entry point"
```

---

## Task 7: Validator (`adgen/validate.py`)

Port of the JS `validator.js` from the reference `copy+color/` Node code. Pure logic — perfect for TDD.

**Files:**
- Create: `adgen/validate.py`
- Create: `tests/test_validate.py`

- [ ] **Step 7.1: Write the failing tests**

Create `tests/test_validate.py`:
```python
from __future__ import annotations

from adgen.validate import validate_components, Issue


CLEAN: dict = {
    "headlines": [
        "Pay off debt 3x faster",
        "AI tracks every subscription",
        "42,000 users save 280 per month",
    ],
    "bullets": [
        "Connects to 12,000+ banks in 30 seconds",
        "Cancels unused subscriptions automatically",
        "Average user saves 280 per month",
        "No spreadsheets. One dashboard.",
        "Free 30-day trial. No credit card needed.",
        "Bank-level 256-bit encryption",
    ],
    "base_texts": [
        "Most people overspend by 340 per month without realising it. Clarity shows you where it goes and stops it.",
        "42,000 users cut their monthly spend by 280. The app does the tracking. You keep the money.",
        "Try Clarity free for 30 days. No credit card. If it does not save you money in the first month, cancel in two taps.",
    ],
    "on_image_texts": [
        "Stop bleeding money.",
        "280 saved. Every month.",
        "Free 30 days. Real results.",
    ],
    "cta": "Sign Up",
}


def test_clean_components_have_no_issues():
    issues = validate_components(CLEAN)
    assert issues == []


def test_headline_over_40_chars_flagged():
    bad = {**CLEAN, "headlines": ["x" * 41, *CLEAN["headlines"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "headlines[0]" and "40" in i.message for i in issues)


def test_bullet_over_60_chars_flagged():
    bad = {**CLEAN, "bullets": ["x" * 61, *CLEAN["bullets"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "bullets[0]" and "60" in i.message for i in issues)


def test_base_text_over_220_chars_flagged():
    bad = {**CLEAN, "base_texts": ["x" * 221, *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "base_texts[0]" and "220" in i.message for i in issues)


def test_on_image_text_over_30_chars_flagged():
    bad = {**CLEAN, "on_image_texts": ["x" * 31, *CLEAN["on_image_texts"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "on_image_texts[0]" and "30" in i.message for i in issues)


def test_em_dash_separator_flagged():
    bad = {**CLEAN, "base_texts": ["A long claim — with em dash separator here, definitely.", *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any("dash" in i.message.lower() for i in issues)


def test_hyphen_separator_flagged():
    bad = {**CLEAN, "base_texts": ["A long claim - with hyphen separator here, definitely.", *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any("dash" in i.message.lower() for i in issues)


def test_filler_opener_flagged():
    bad = {**CLEAN, "base_texts": ["Are you tired of overspending every single month, friend?", *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any("filler" in i.message.lower() or "opener" in i.message.lower() for i in issues)


def test_vague_descriptor_flagged():
    bad = {**CLEAN, "bullets": ["Great service that gives you amazing results.", *CLEAN["bullets"][1:]]}
    issues = validate_components(bad)
    assert any("vague" in i.message.lower() for i in issues)


def test_issue_dataclass_fields():
    bad = {**CLEAN, "headlines": ["x" * 50, *CLEAN["headlines"][1:]]}
    issues = validate_components(bad)
    issue = issues[0]
    assert isinstance(issue, Issue)
    assert isinstance(issue.field, str)
    assert isinstance(issue.message, str)
```

- [ ] **Step 7.2: Run the tests — confirm they fail**

Run:
```bash
pytest tests/test_validate.py -v
```

Expected: All tests FAIL — `ModuleNotFoundError: No module named 'adgen.validate'`.

- [ ] **Step 7.3: Implement `adgen/validate.py`**

Create `adgen/validate.py`:
```python
"""Quality gate for the copy components JSON produced by Claude in stage 2.

Run as a script:  python -m adgen validate path/to/components.json

Exits 0 if clean, 1 if any issues found. Prints one issue per line to stdout.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path

import click


LIMITS = {
    "headlines": 40,
    "bullets": 60,
    "base_texts": 220,
    "on_image_texts": 30,
}

FILLER_OPENERS = (
    # English
    "are you", "do you", "have you", "imagine",
    # Latvian equivalents
    "vai jūs", "vai tu", "iedomājies", "iedomājieties",
)

VAGUE_DESCRIPTORS = (
    # English
    "great", "amazing", "best", "quality", "professional",
    "effective", "fast results", "modern", "innovative", "seamless",
    # Latvian
    "efektīvs", "labākais", "kvalitatīvs", "profesionāls",
    "moderns", "inovatīvs",
)


@dataclass
class Issue:
    field: str
    message: str


def _check_length(field: str, value: str, limit: int) -> Issue | None:
    if len(value) > limit:
        return Issue(field, f"exceeds max {limit} chars (got {len(value)})")
    return None


def _check_dashes(field: str, value: str) -> Issue | None:
    if " — " in value or " - " in value:
        return Issue(field, "contains dash separator (use period, colon, or comma)")
    return None


def _check_filler_opener(field: str, value: str) -> Issue | None:
    lower = value.lstrip().lower()
    if any(lower.startswith(opener) for opener in FILLER_OPENERS):
        return Issue(field, "opens with filler phrase (lead with the pain, fact, or result)")
    return None


def _check_vague(field: str, value: str) -> Issue | None:
    lower = value.lower()
    hit = next((word for word in VAGUE_DESCRIPTORS if word in lower), None)
    if hit:
        return Issue(field, f"contains vague descriptor '{hit}' — replace with a concrete fact")
    return None


def validate_components(components: dict) -> list[Issue]:
    issues: list[Issue] = []

    for category, limit in LIMITS.items():
        values = components.get(category) or []
        for index, value in enumerate(values):
            field = f"{category}[{index}]"
            if (issue := _check_length(field, value, limit)):
                issues.append(issue)
            if (issue := _check_dashes(field, value)):
                issues.append(issue)
            if category in {"base_texts", "headlines"} and (issue := _check_filler_opener(field, value)):
                issues.append(issue)
            if (issue := _check_vague(field, value)):
                issues.append(issue)

    cta = components.get("cta", "")
    if isinstance(cta, str) and len(cta) > 40:
        issues.append(Issue("cta", f"exceeds max 40 chars (got {len(cta)})"))

    return issues


@click.command()
@click.argument("path", type=click.Path(exists=True, dir_okay=False, path_type=Path))
def cli(path: Path) -> None:
    """Validate a copy components JSON file."""
    data = json.loads(path.read_text(encoding="utf-8"))
    issues = validate_components(data)
    if not issues:
        click.echo("PASS — no issues found")
        sys.exit(0)
    click.echo(f"FAIL — {len(issues)} issue(s):")
    for issue in issues:
        click.echo(f"  • {issue.field}: {issue.message}")
    sys.exit(1)


if __name__ == "__main__":
    cli()
```

- [ ] **Step 7.4: Run tests — confirm they pass**

Run:
```bash
pytest tests/test_validate.py -v
```

Expected: All ten tests PASS.

- [ ] **Step 7.5: Commit**

```bash
git add adgen/validate.py tests/test_validate.py
git commit -m "feat: add copy components validator (char limits, dashes, fillers, vague words)"
```

---

## Task 8: Palette catalog parser (`adgen/palette/catalog.py`)

Parse `palettes-neutral.md` into structured `Palette` objects.

**Files:**
- Create: `adgen/palette/__init__.py`
- Create: `adgen/palette/catalog.py`
- Create: `adgen/palette/data/palettes-neutral.md` (copy of reference catalog)
- Create: `tests/test_palette_catalog.py`
- Create: `tests/fixtures/sample_palettes.md`

- [ ] **Step 8.1: Create the package directory and copy the catalog**

Create `adgen/palette/__init__.py` (empty file).

Create `adgen/palette/data/` directory.

Copy `C:\Users\Ritvars Volfs\Downloads\copy+color (1)\copy+color\color palete\palettes-neutral.md` to `adgen/palette/data/palettes-neutral.md` verbatim (use Read + Write).

- [ ] **Step 8.2: Create a small fixture file with two palettes for fast tests**

Create `tests/fixtures/sample_palettes.md`:
```markdown
# Test palettes — used by tests only.

---

## Test Light

**Theme:** Light — **Use for:** wellness, spa, beauty

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#F0DAD5` | L≈0.73 |
| Light Mid | `#BABBB1` | L≈0.49 |
| Darkest | `#424658` | L≈0.06 |

| Role | Value |
|---|---|
| Base | `#F0DAD5` |
| Second tone (decorative only) | `#BABBB1` |
| **Text + CTA button** | `#424658` |
| **Body text hex** | `#424658` (7.0:1 on base ✓) |
| **CTA text** | `#F0DAD5` (7.0:1 on `#424658` ✓) |
---

## Test Dark

**Theme:** Dark — **Use for:** luxury, fashion

| Swatch | Hex | Luminance |
|---|---|---|
| Lightest | `#f5f0e8` | L≈0.93 |
| Darkest | `#0d0b09` | L≈0.02 |

| Role | Value |
|---|---|
| Base | `#0d0b09` |
| **Text + CTA button** | `#c8a86a` |
| **Body text hex** | `#f5f0e8` (12.0:1 on base ✓) |
| **CTA text** | `#0d0b09` (8.0:1 on `#c8a86a` ✓) |
---
```

- [ ] **Step 8.3: Write the failing tests**

Create `tests/test_palette_catalog.py`:
```python
from __future__ import annotations

from pathlib import Path

from adgen.palette.catalog import Palette, load_catalog

FIXTURE = Path(__file__).parent / "fixtures" / "sample_palettes.md"


def test_load_catalog_returns_two_palettes():
    palettes = load_catalog(FIXTURE)
    assert len(palettes) == 2


def test_first_palette_fields():
    p = load_catalog(FIXTURE)[0]
    assert isinstance(p, Palette)
    assert p.name == "Test Light"
    assert p.theme == "Light"
    assert "wellness" in p.use_for
    assert p.base == "#F0DAD5"
    assert p.text_cta_bg == "#424658"
    assert p.body_text == "#424658"
    assert p.cta_text == "#F0DAD5"


def test_second_palette_dark_theme():
    p = load_catalog(FIXTURE)[1]
    assert p.name == "Test Dark"
    assert p.theme == "Dark"
    assert p.base == "#0d0b09"
    assert p.text_cta_bg == "#c8a86a"


def test_all_swatches_collects_every_hex():
    p = load_catalog(FIXTURE)[0]
    assert "#F0DAD5" in p.all_swatches
    assert "#BABBB1" in p.all_swatches
    assert "#424658" in p.all_swatches


def test_real_catalog_loads_with_many_palettes():
    real = Path(__file__).parent.parent / "adgen" / "palette" / "data" / "palettes-neutral.md"
    palettes = load_catalog(real)
    assert len(palettes) > 100, f"expected 100+ palettes, got {len(palettes)}"
    # Every palette must have a name and a base swatch.
    for p in palettes:
        assert p.name, f"empty name in palette: {p}"
        assert p.base.startswith("#"), f"bad base in {p.name}: {p.base}"
```

- [ ] **Step 8.4: Run the tests and confirm they fail**

Run:
```bash
pytest tests/test_palette_catalog.py -v
```

Expected: All FAIL with `ModuleNotFoundError`.

- [ ] **Step 8.5: Implement `adgen/palette/catalog.py`**

Create `adgen/palette/catalog.py`:
```python
"""Parse the palettes-neutral.md catalog into Palette dataclasses."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path


HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}")
PALETTE_HEADER_RE = re.compile(r"^## (.+?)\s*$", re.MULTILINE)


@dataclass
class Palette:
    name: str
    theme: str
    use_for: str
    base: str
    second_tone: str | None
    accents: list[str] = field(default_factory=list)
    text_cta_bg: str = ""
    body_text: str = ""
    cta_text: str = ""
    contrast_rating: str = ""
    all_swatches: list[str] = field(default_factory=list)


def load_catalog(path: Path) -> list[Palette]:
    text = Path(path).read_text(encoding="utf-8")
    blocks = _split_into_palette_blocks(text)
    return [palette for palette in (_parse_block(block) for block in blocks) if palette]


def _split_into_palette_blocks(text: str) -> list[tuple[str, str]]:
    """Return [(name, body), ...] — body is everything from the ## header until the next ## (or EOF)."""
    matches = list(PALETTE_HEADER_RE.finditer(text))
    blocks: list[tuple[str, str]] = []
    for index, match in enumerate(matches):
        name = match.group(1).strip()
        # Skip the document title and any meta sections that aren't palettes.
        if name.lower().startswith(("pastel palettes", "test palettes")):
            continue
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        body = text[start:end]
        blocks.append((name, body))
    return blocks


def _parse_block(block: tuple[str, str]) -> Palette | None:
    name, body = block
    theme_match = re.search(r"\*\*Theme:\*\*\s*(\w+)", body)
    use_for_match = re.search(r"\*\*Use for:\*\*\s*([^\n]+)", body)
    theme = theme_match.group(1).strip() if theme_match else ""
    use_for = use_for_match.group(1).strip() if use_for_match else ""

    base = _grab_role(body, "Base")
    second_tone = _grab_role(body, "Second tone")
    text_cta_bg = _grab_role(body, r"\*\*Text \+ CTA button\*\*")
    body_text = _grab_role(body, r"\*\*Body text hex\*\*")
    cta_text = _grab_role(body, r"\*\*CTA text\*\*")

    if not base:
        return None

    accents = [
        hex_match.group(0)
        for line in body.splitlines()
        if "Accent" in line and "decorative only" in line
        for hex_match in [HEX_RE.search(line)]
        if hex_match
    ]

    contrast_rating = "✓" if "✓" in body else ("⚠" if "⚠" in body else "")

    all_swatches = list(dict.fromkeys(HEX_RE.findall(body)))

    return Palette(
        name=name,
        theme=theme,
        use_for=use_for,
        base=base,
        second_tone=second_tone,
        accents=accents,
        text_cta_bg=text_cta_bg or "",
        body_text=body_text or "",
        cta_text=cta_text or "",
        contrast_rating=contrast_rating,
        all_swatches=all_swatches,
    )


def _grab_role(body: str, role_pattern: str) -> str | None:
    """Find a role row in the markdown table and return the first hex inside its value cell."""
    row_re = re.compile(rf"^\|\s*{role_pattern}[^|]*\|\s*([^\n|]+)\|\s*$", re.MULTILINE)
    match = row_re.search(body)
    if not match:
        return None
    cell = match.group(1)
    hex_match = HEX_RE.search(cell)
    return hex_match.group(0) if hex_match else None
```

- [ ] **Step 8.6: Run the tests — confirm they pass**

Run:
```bash
pytest tests/test_palette_catalog.py -v
```

Expected: All five tests PASS, including `test_real_catalog_loads_with_many_palettes` which verifies > 100 palettes parsed from the real file.

- [ ] **Step 8.7: Commit**

```bash
git add adgen/palette/__init__.py adgen/palette/catalog.py adgen/palette/data/palettes-neutral.md tests/test_palette_catalog.py tests/fixtures/sample_palettes.md
git commit -m "feat: parse palettes-neutral.md catalog into Palette dataclasses"
```

---

## Task 9: Palette matcher (`adgen/palette/runner.py`)

Find the catalog palette nearest to the scraped accent colors.

**Files:**
- Create: `adgen/palette/runner.py`
- Create: `tests/test_palette_runner.py`

- [ ] **Step 9.1: Write the failing tests**

Create `tests/test_palette_runner.py`:
```python
from __future__ import annotations

import json
from pathlib import Path

import pytest

from adgen.palette import runner
from adgen.palette.catalog import Palette


def test_hex_to_rgb_basic():
    assert runner.hex_to_rgb("#ff0000") == (255, 0, 0)
    assert runner.hex_to_rgb("#00ff00") == (0, 255, 0)
    assert runner.hex_to_rgb("#0000ff") == (0, 0, 255)
    assert runner.hex_to_rgb("#FFFFFF") == (255, 255, 255)


def test_rgb_euclidean_self_distance_zero():
    assert runner.rgb_euclidean((10, 20, 30), (10, 20, 30)) == 0.0


def test_rgb_euclidean_known_distance():
    # (0,0,0) vs (255,255,255) → sqrt(3 * 255^2) ≈ 441.67
    distance = runner.rgb_euclidean((0, 0, 0), (255, 255, 255))
    assert 441.0 < distance < 442.0


def _palette(name: str, swatches: list[str]) -> Palette:
    return Palette(
        name=name,
        theme="Light",
        use_for="test",
        base=swatches[0],
        second_tone=None,
        accents=[],
        text_cta_bg=swatches[-1],
        body_text=swatches[-1],
        cta_text=swatches[0],
        all_swatches=swatches,
    )


def test_palette_distance_picks_nearer_swatch():
    palette = _palette("p", ["#000000", "#ff0000"])
    # Scraped is bright red — distance should be near 0 because palette has #ff0000.
    distance = runner.palette_distance(palette, [(255, 0, 0)])
    assert distance < 1.0


def test_pick_nearest_palette_returns_lowest_distance():
    a = _palette("dark", ["#000000", "#111111"])
    b = _palette("warm", ["#ff8800", "#ffaa44"])
    scraped = [(255, 136, 0)]
    chosen, shortlist = runner.pick_nearest(scraped, [a, b], top_n=2)
    assert chosen.name == "warm"
    assert shortlist[0].palette.name == "warm"


def test_run_palette_writes_chosen_and_shortlist(tmp_clients_root, monkeypatch):
    from adgen import paths
    # Set up a fake scrape output with a single accent color.
    domain = "example.com"
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "accent_colors.txt").write_text("#ff8800\n", encoding="utf-8")

    # Monkeypatch the catalog loader to a small in-memory list.
    a = _palette("dark", ["#000000", "#111111"])
    b = _palette("warm", ["#ff8800", "#ffaa44"])
    monkeypatch.setattr(runner, "load_catalog", lambda *_args, **_kwargs: [a, b])

    runner.run_palette(domain)

    palette_dir = paths.palette_dir(domain)
    chosen = json.loads((palette_dir / "chosen.json").read_text(encoding="utf-8"))
    assert chosen["name"] == "warm"
    assert chosen["swatches"]["base"] == "#ff8800"
    assert chosen["matched_against"] == ["#ff8800"]
    shortlist = json.loads((palette_dir / "shortlist.json").read_text(encoding="utf-8"))
    assert len(shortlist) == 2
    assert shortlist[0]["name"] == "warm"


def test_run_palette_missing_accent_colors_raises(tmp_clients_root):
    with pytest.raises(FileNotFoundError):
        runner.run_palette("missing.com")
```

- [ ] **Step 9.2: Run the tests — confirm they fail**

Run:
```bash
pytest tests/test_palette_runner.py -v
```

Expected: All FAIL — `ModuleNotFoundError: No module named 'adgen.palette.runner'`.

- [ ] **Step 9.3: Implement `adgen/palette/runner.py`**

Create `adgen/palette/runner.py`:
```python
"""Stage 3 — pick the catalog palette nearest to the scraped accent colors."""
from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from adgen import paths
from adgen.palette.catalog import Palette, load_catalog


CATALOG_PATH = Path(__file__).parent / "data" / "palettes-neutral.md"


@dataclass
class Candidate:
    palette: Palette
    distance: float


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    text = value.lstrip("#")
    if len(text) == 3:
        text = "".join(c * 2 for c in text)
    return int(text[0:2], 16), int(text[2:4], 16), int(text[4:6], 16)


def rgb_euclidean(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(3)))


def palette_distance(palette: Palette, scraped_rgbs: list[tuple[int, int, int]]) -> float:
    """For each scraped color, find the nearest swatch in this palette. Sum those distances."""
    swatch_rgbs = [hex_to_rgb(swatch) for swatch in palette.all_swatches if swatch.startswith("#")]
    if not swatch_rgbs:
        return float("inf")
    return sum(min(rgb_euclidean(scraped, swatch) for swatch in swatch_rgbs) for scraped in scraped_rgbs)


def pick_nearest(
    scraped: list[tuple[int, int, int]],
    palettes: list[Palette],
    top_n: int = 5,
) -> tuple[Palette, list[Candidate]]:
    candidates = [Candidate(p, palette_distance(p, scraped)) for p in palettes]
    candidates.sort(key=lambda c: c.distance)
    return candidates[0].palette, candidates[:top_n]


def _palette_to_dict(palette: Palette, distance: float, matched_against: list[str]) -> dict:
    return {
        "name": palette.name,
        "theme": palette.theme,
        "use_for": palette.use_for,
        "swatches": {
            "base": palette.base,
            "second_tone": palette.second_tone,
            "accents": palette.accents,
            "text_cta_bg": palette.text_cta_bg,
            "body_text": palette.body_text,
            "cta_text": palette.cta_text,
        },
        "contrast_rating": palette.contrast_rating,
        "distance": round(distance, 2),
        "matched_against": matched_against,
    }


def run_palette(domain: str, catalog_path: Path = CATALOG_PATH) -> None:
    accent_file = paths.scrape_dir(domain) / "accent_colors.txt"
    if not accent_file.exists():
        raise FileNotFoundError(f"Expected scraped colors at {accent_file}")

    raw = [line.strip() for line in accent_file.read_text(encoding="utf-8").splitlines() if line.strip().startswith("#")]
    if not raw:
        raise ValueError(f"No hex colors found in {accent_file}")
    scraped_rgbs = [hex_to_rgb(c) for c in raw]

    palettes = load_catalog(catalog_path)
    chosen, shortlist = pick_nearest(scraped_rgbs, palettes, top_n=5)

    palette_dir = paths.palette_dir(domain)
    palette_dir.mkdir(parents=True, exist_ok=True)

    (palette_dir / "chosen.json").write_text(
        json.dumps(_palette_to_dict(chosen, shortlist[0].distance, raw), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (palette_dir / "shortlist.json").write_text(
        json.dumps(
            [_palette_to_dict(c.palette, c.distance, raw) for c in shortlist],
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
```

- [ ] **Step 9.4: Run the tests — confirm they pass**

Run:
```bash
pytest tests/test_palette_runner.py -v
```

Expected: All seven tests PASS.

- [ ] **Step 9.5: Commit**

```bash
git add adgen/palette/runner.py tests/test_palette_runner.py
git commit -m "feat: palette matcher — pick nearest catalog palette by hex distance"
```

---

## Task 10: CLI dispatcher (`adgen/__main__.py`)

The subcommand router. Routes to scrape / validate / palette.

**Files:**
- Create: `adgen/__main__.py`
- Create: `tests/test_cli_dispatch.py`

- [ ] **Step 10.1: Write a failing test**

Create `tests/test_cli_dispatch.py`:
```python
from __future__ import annotations

from click.testing import CliRunner

from adgen.__main__ import cli


def test_cli_lists_three_subcommands():
    result = CliRunner().invoke(cli, ["--help"])
    assert result.exit_code == 0
    for cmd in ("scrape", "validate", "palette"):
        assert cmd in result.output


def test_validate_subcommand_runs_on_clean_file(tmp_path):
    file = tmp_path / "components.json"
    file.write_text(
        '{"headlines":["short headline"],"bullets":[],"base_texts":[],"on_image_texts":[],"cta":"Sign Up"}',
        encoding="utf-8",
    )
    result = CliRunner().invoke(cli, ["validate", str(file)])
    assert result.exit_code == 0
    assert "PASS" in result.output
```

- [ ] **Step 10.2: Run the test — confirm it fails**

Run:
```bash
pytest tests/test_cli_dispatch.py -v
```

Expected: FAIL — `ModuleNotFoundError`.

- [ ] **Step 10.3: Implement `adgen/__main__.py`**

Create `adgen/__main__.py`:
```python
"""CLI dispatcher: `python -m adgen <subcommand>`."""
from __future__ import annotations

from pathlib import Path

import click

from adgen import brief as brief_module
from adgen import paths
from adgen.config import DEFAULT_MAX_IMAGES, DEFAULT_MAX_PAGES
from adgen.palette.runner import run_palette
from adgen.scrape.cli import run_scrape
from adgen.validate import cli as validate_cli


@click.group()
def cli() -> None:
    """Meta Ad Generator — pipeline tools."""


@cli.command()
@click.argument("url")
@click.option("--brief", "brief_path", type=click.Path(path_type=Path), default=None,
              help="Optional path to a brand brief file. If omitted, you will be prompted.")
@click.option("--max-images", type=int, default=DEFAULT_MAX_IMAGES, show_default=True)
@click.option("--max-pages", type=int, default=DEFAULT_MAX_PAGES, show_default=True)
@click.option("--keep-existing", is_flag=True,
              help="Keep existing scrape output for this domain instead of clearing first.")
def scrape(url: str, brief_path: Path | None, max_images: int, max_pages: int, keep_existing: bool) -> None:
    """Run stage 1 — scrape a website."""
    brief_text = brief_module.load_brief(brief_path) if brief_path else brief_module.prompt_brief()
    output_dir = run_scrape(
        url,
        max_images=max_images,
        max_pages=max_pages,
        keep_existing=keep_existing,
    )
    domain = output_dir.parent.name  # output_dir is .../clients/<domain>/scrape
    paths.brief_path(domain).write_text(brief_text + "\n", encoding="utf-8")
    click.echo(f"Done. Scrape output: {output_dir.resolve()}")
    click.echo(f"Brief saved to:    {paths.brief_path(domain).resolve()}")


cli.add_command(validate_cli, name="validate")


@cli.command()
@click.argument("domain")
def palette(domain: str) -> None:
    """Run stage 3 — pick the nearest catalog palette for a previously-scraped domain."""
    run_palette(domain)
    out = paths.palette_dir(domain)
    click.echo(f"Done. Palette output: {out.resolve()}")


if __name__ == "__main__":
    cli()
```

- [ ] **Step 10.4: Run the test — confirm it passes**

Run:
```bash
pytest tests/test_cli_dispatch.py -v
```

Expected: Both tests PASS.

- [ ] **Step 10.5: Commit**

```bash
git add adgen/__main__.py tests/test_cli_dispatch.py
git commit -m "feat: add CLI dispatcher with scrape/validate/palette subcommands"
```

---

## Task 11: Copy the prompts into `prompts/`

The copywriter and refiner instruction files that Claude will read during stage 2.

**Files:**
- Create: `prompts/copywriter.md`
- Create: `prompts/refiner.md`

- [ ] **Step 11.1: Copy `copywriter.md`**

Copy contents of `C:\Users\Ritvars Volfs\Downloads\copy+color (1)\copy+color\prompts\copywriter.md` to `prompts/copywriter.md` verbatim (use Read + Write).

- [ ] **Step 11.2: Copy `refiner.md`**

Copy contents of `C:\Users\Ritvars Volfs\Downloads\copy+color (1)\copy+color\prompts\refiner.md` to `prompts/refiner.md` verbatim.

- [ ] **Step 11.3: Verify the files exist and are non-empty**

Run:
```bash
ls -la prompts/
```

Expected: two files, each several KB.

- [ ] **Step 11.4: Commit**

```bash
git add prompts/copywriter.md prompts/refiner.md
git commit -m "feat: add copywriter and refiner prompt files for Claude to follow"
```

---

## Task 12: Write `CLAUDE.md` — orchestration instructions

The single file at project root that tells any Claude Code session opened in this folder how to run the pipeline.

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 12.1: Write `CLAUDE.md`**

Create `CLAUDE.md`:
```markdown
# Meta Ad Generator — Pipeline Instructions

You are the orchestrator. The user gives you a website URL and a brand brief; you run the pipeline below. Stages 1 and 3 are Python scripts you invoke. Stage 2 is **you** doing copywriting work directly, guided by `prompts/copywriter.md` and `prompts/refiner.md`.

The design spec is at `docs/superpowers/specs/2026-05-11-meta-ad-pipeline-design.md`. The implementation plan is at `docs/superpowers/plans/2026-05-11-meta-ad-pipeline-stages-1-3.md`.

## When the user gives you a URL + brief

### Step 1 — Scrape

If the user supplied the brief as a file path:
```
python -m adgen scrape <url> --brief <path-to-brief-file>
```

If they typed the brief inline, save it to a temp file first, then pass `--brief`:
```
python -m adgen scrape <url> --brief <temp-brief-file>
```

Note the domain from the scraper's final output line. The scrape output lives at `clients/<domain>/scrape/`.

### Step 2 — Copy

1. Read these files into context:
   - `clients/<domain>/scrape/info.txt` — brand summary
   - `clients/<domain>/scrape/manifest.json` — structured data (language, brand_name)
   - `clients/<domain>/brief.txt` — the user's brief
   - `prompts/copywriter.md` — your instructions

2. Following `prompts/copywriter.md` **exactly**, generate the components JSON. Write it to `clients/<domain>/copy/components.json`. Do not include any prose around the JSON; the file must be valid JSON.

3. Validate the output:
   ```
   python -m adgen validate clients/<domain>/copy/components.json
   ```

4. If the validator reports issues:
   - Read `prompts/refiner.md`.
   - Fix only the flagged issues. Preserve everything else.
   - Write the result to `clients/<domain>/copy/refined.json`.
   - Re-run the validator on `refined.json` to confirm clean.

5. Copy the canonical version (refined if it ran, else components) to `clients/<domain>/copy/final.json`. Stages 4+ read only `final.json`.

### Step 3 — Palette

```
python -m adgen palette <domain>
```

Output lands at `clients/<domain>/palette/chosen.json` (top pick) and `clients/<domain>/palette/shortlist.json` (top 5 for reference).

### Stages 4–7

Not yet implemented. After stages 1–3 finish, summarize what was produced and stop — wait for the user's next instruction.

## When the user asks for something else

If the user is iterating on a single stage (e.g. "regenerate the copy for 123spa.lv"), run only that stage. Each stage is independently re-runnable as long as the prior stage's output exists.
```

- [ ] **Step 12.2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md orchestration instructions for the pipeline"
```

---

## Task 13: End-to-end smoke test on 123spa.lv

Validates that scrape → palette flows correctly. (Copy stage requires Claude in the loop, so this task does the deterministic stages only.)

**Files:**
- Create: `tests/test_smoke.py` (marked `slow` so it can be skipped by default)
- Modify: `pyproject.toml` — register the `slow` marker

- [ ] **Step 13.1: Register the `slow` marker in pyproject.toml**

Add to the bottom of `pyproject.toml`:
```toml
[tool.pytest.ini_options]
markers = [
  "slow: marks integration tests that hit the network",
]
```

- [ ] **Step 13.2: Write the smoke test**

Create `tests/test_smoke.py`:
```python
"""End-to-end smoke test — hits the network. Skip in normal runs.

Run explicitly with:  pytest -m slow tests/test_smoke.py -v
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from adgen.palette.runner import run_palette
from adgen.scrape.cli import run_scrape


@pytest.mark.slow
def test_scrape_and_palette_on_123spa(tmp_clients_root):
    # Stage 1: scrape.
    output_dir = run_scrape("https://123spa.lv", max_images=20, max_pages=4)
    assert output_dir.is_dir()
    assert (output_dir / "info.txt").exists()
    assert (output_dir / "manifest.json").exists()
    assert (output_dir / "accent_colors.txt").exists()
    manifest = json.loads((output_dir / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["brand_name"], "brand name should be detected"

    # Stage 3: palette (no LLM, deterministic).
    domain = output_dir.parent.name
    run_palette(domain)
    palette_dir = output_dir.parent / "palette"
    chosen = json.loads((palette_dir / "chosen.json").read_text(encoding="utf-8"))
    assert chosen["name"], "chosen palette must have a name"
    assert chosen["swatches"]["base"].startswith("#"), "base swatch must be a hex"
    shortlist = json.loads((palette_dir / "shortlist.json").read_text(encoding="utf-8"))
    assert len(shortlist) == 5
```

- [ ] **Step 13.3: Run the smoke test**

Run:
```bash
pytest -m slow tests/test_smoke.py -v
```

Expected: PASS (takes 30–90s as it actually crawls the site).

If it fails: read the error, check whether the scraper's output paths are still correct, whether `clients/<domain>/scrape/` exists, and whether `accent_colors.txt` has at least one hex line.

- [ ] **Step 13.4: Run the full test suite**

Run:
```bash
pytest -v
```

Expected: All non-slow tests PASS. (The slow test is skipped by default since no `-m slow` was passed.)

- [ ] **Step 13.5: Commit**

```bash
git add pyproject.toml tests/test_smoke.py
git commit -m "test: end-to-end smoke test for scrape + palette on 123spa.lv"
```

---

## Task 14: Final verification

Sanity-check that all the pieces are in place and the project is in a runnable state.

- [ ] **Step 14.1: Verify the package layout**

Run:
```bash
ls -la adgen/ prompts/ docs/superpowers/specs/ docs/superpowers/plans/
```

Expected:
- `adgen/` contains: `__init__.py`, `__main__.py`, `config.py`, `paths.py`, `brief.py`, `validate.py`, `scrape/`, `palette/`
- `prompts/` contains: `copywriter.md`, `refiner.md`
- `docs/superpowers/specs/` contains the design doc
- `docs/superpowers/plans/` contains this plan

- [ ] **Step 14.2: Verify CLI surface**

Run:
```bash
python -m adgen --help
```

Expected: Help text listing three commands (`scrape`, `validate`, `palette`).

Run:
```bash
python -m adgen scrape --help
python -m adgen validate --help
python -m adgen palette --help
```

Expected: each shows its own help with the documented flags.

- [ ] **Step 14.3: Verify the test suite is green**

Run:
```bash
pytest -v
```

Expected: All non-slow tests PASS, zero failures.

- [ ] **Step 14.4: Verify CLAUDE.md is present and discoverable**

Run:
```bash
cat CLAUDE.md | head -10
```

Expected: First lines of the orchestration document.

- [ ] **Step 14.5: Verify git log shows clean commit history**

Run:
```bash
git log --oneline
```

Expected: ~13 commits, one per task, all with conventional commit prefixes (`feat:`, `chore:`, `docs:`, `test:`).

- [ ] **Step 14.6: Final commit if anything is uncommitted**

```bash
git status
```

If clean, you're done. If anything is uncommitted, commit it with a meaningful message.

---

## Done — what works now

After Task 14 completes:

- `python -m adgen scrape <url> [--brief file]` scrapes a brand site into `clients/<domain>/scrape/` and saves the brief next to it.
- `python -m adgen validate <path>` checks copy components against char limits, dashes, fillers, vague descriptors.
- `python -m adgen palette <domain>` picks the nearest catalog palette and writes `chosen.json` + `shortlist.json`.
- Claude can be told "generate ads for example.com with this brief" — it follows `CLAUDE.md` to chain stages 1–3, with stage 2 driven by `prompts/copywriter.md` and `prompts/refiner.md`.

Stages 4–7 (templates, OpenAI image generation, image verification, chat memory) are out of scope and will be planned separately.
