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
    row_re = re.compile(rf"^\|\s*{role_pattern}[^|\n]*\|\s*([^\n|]+)\|\s*$", re.MULTILINE)
    match = row_re.search(body)
    if not match:
        return None
    cell = match.group(1)
    hex_match = HEX_RE.search(cell)
    return hex_match.group(0) if hex_match else None
