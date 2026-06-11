"""Stage 4 helpers — validate and collect HTML ad files written directly by Claude."""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

from adgen import paths
from adgen.render.bullet_styles import bullet_style_css, bullet_style_for_ad
from adgen.render.context import RenderContext, load_context  # noqa: F401
from adgen.validate_html import (
    _check_photo_brightness,
    _css_blocks,
    check_and_fix_layout,
    check_template_style,
)

_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

_BULLET_BLOCK_RE = re.compile(
    r"/\* bullet-style-start \*/.*?/\* bullet-style-end \*/",
    re.DOTALL,
)


def _load_accent_colors(domain: str) -> tuple[str, str] | None:
    """Return (accent, accent2) hex strings from chosen.json, or None if missing."""
    p = paths.palette_dir(domain) / "chosen.json"
    if not p.exists():
        return None
    data = json.loads(p.read_text(encoding="utf-8"))
    accents = data.get("swatches", {}).get("accents", [])
    second_tone = data.get("swatches", {}).get("second_tone", "#888888")
    accent  = accents[0] if accents else second_tone
    accent2 = accents[1] if len(accents) > 1 else second_tone
    return accent, accent2


_BICON_HIDE_RE = re.compile(r"\.bicon[^}]*display\s*:\s*none", re.DOTALL)
_BICON_COLOR_RE = re.compile(
    r"\.bicon[^{]*\{[^}]*(?:color|fill)\s*:\s*(#[0-9a-fA-F]{3,8})",
    re.DOTALL,
)


def _update_bicon_strokes(html: str, style_css: str) -> str:
    """Update inline SVG stroke="#hex" attributes to match the injected bullet style's icon color.

    When adgen render swaps the bullet style, CSS color/fill update but inline stroke
    attributes on SVG icons are untouched — icons become invisible or show the wrong color.
    This fixes all stroke="#..." values in the file to match the new icon color.
    Skips styles (numbered-badge, accent-dot) where .bicon is hidden.
    """
    if _BICON_HIDE_RE.search(style_css):
        return html  # icons are display:none in this style — no stroke update needed
    m = _BICON_COLOR_RE.search(style_css)
    if not m:
        return html
    icon_color = m.group(1)
    updated = re.sub(r'stroke="#[0-9a-fA-F]{3,8}"', f'stroke="{icon_color}"', html)
    if updated != html:
        print(f"         → updated SVG stroke to {icon_color}")
    return updated


def _print_batch_summary(rows: list[tuple[str, str, int, int]]) -> None:
    """Print a per-file summary table after the validation loop."""
    width = 62
    print(f"\n{'─' * width}")
    print(f"  Batch summary — {len(rows)} ad(s)")
    print(f"{'─' * width}")
    for name, style, n_fix, n_warn in rows:
        if n_fix == 0 and n_warn == 0:
            status = "✓ OK"
        else:
            parts = []
            if n_fix:
                parts.append(f"{n_fix} fix{'es' if n_fix > 1 else ''}")
            if n_warn:
                parts.append(f"{n_warn} warn{'s' if n_warn > 1 else ''}")
            status = ", ".join(parts)
        print(f"  {name:<32}  {style:<16}  {status}")
    print(f"{'─' * width}\n")


def _run_check_copy(html_dir: Path) -> None:
    """Run check-copy.js against the html dir if Node.js is available."""
    node = shutil.which("node")
    script = Path(__file__).parent.parent.parent / "scripts" / "check-copy.js"
    if not node or not script.exists():
        return
    print("[copy]  Running check-copy.js…")
    result = subprocess.run(
        [node, str(script), str(html_dir)],
        capture_output=True,
        text=True,
    )
    if result.stdout.strip():
        print(result.stdout)
    if result.returncode != 0 and result.stderr.strip():
        print(f"[copy]  error: {result.stderr.strip()}", file=sys.stderr)


def _inject_bullet_style(html: str, style_css: str) -> str:
    """Insert or replace the bullet-style CSS block inside the first <style> tag."""
    block = f"/* bullet-style-start */\n{style_css}\n/* bullet-style-end */"
    if _BULLET_BLOCK_RE.search(html):
        return _BULLET_BLOCK_RE.sub(block, html)
    return html.replace("</style>", f"{block}\n</style>", 1)


def validate_and_fix_html_dir(domain: str) -> list[Path]:
    """
    Run the layout validator on every HTML file in clients/<domain>/html/.
    Injects a unique bullet style per ad, fixes layout issues in-place,
    and prints a report. Returns the list of files processed.
    """
    html_dir = paths.client_dir(domain) / "html"
    if not html_dir.exists():
        raise FileNotFoundError(
            f"No html/ directory found at {html_dir}.\n"
            f"Write ad HTML files to clients/{domain}/html/ before running validate."
        )
    files = sorted(html_dir.glob("*.html"))
    if not files:
        raise FileNotFoundError(f"No HTML files found in {html_dir}.")

    colors = _load_accent_colors(domain)
    summary_rows: list[tuple[str, str, int, int]] = []

    for i, f in enumerate(files):
        html = f.read_text(encoding="utf-8")
        style_name = "—"

        if colors:
            style_name = bullet_style_for_ad(i)
            css = bullet_style_css(style_name, *colors)
            html = _inject_bullet_style(html, css)
            html = _update_bicon_strokes(html, css)
            print(f"[bullet]   {f.name}: {style_name}")

        issues, html = check_and_fix_layout(html)
        if issues:
            for iss in issues:
                print(f"[layout]   Fixed {f.name}: {iss.selector} — {iss.message}")

        style_issues = check_template_style(f.stem, html)
        for iss in style_issues:
            print(f"[template] WARN {f.name}: {iss.message}")

        # Re-parse CSS blocks for brightness check
        _style_m = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
        _blocks = _css_blocks(_style_m.group(1)) if _style_m else {}
        brightness_issues = _check_photo_brightness(html, _blocks)
        for iss in brightness_issues:
            print(f"[contrast] WARN {f.name}: {iss.selector} — {iss.message}")

        if not issues and not style_issues and not brightness_issues:
            print(f"[validate] OK   {f.name}")

        f.write_text(html, encoding="utf-8")
        summary_rows.append((f.name, style_name, len(issues), len(style_issues) + len(brightness_issues)))

    _print_batch_summary(summary_rows)
    _run_check_copy(html_dir)

    return files
