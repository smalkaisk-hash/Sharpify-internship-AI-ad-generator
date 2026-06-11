"""
Shared utilities for ad template authors.

Each template function must accept (ctx: RenderContext, angle: int = 0) and return
a complete 1080x1080 HTML string.

Templates are NOT registered here. Write them in clients/<domain>/templates.py and
define a TEMPLATES list there. The renderer loads that file at render time.

Color roles (example from a Botanical Water palette):
  base        #EBF6F0  sage mint    — large headline text on dark bg
  second_tone #C8E8F5  powder blue  — body text on dark bg (9.7:1 contrast)
  accent      #4BADD6  water blue   — primary accent, CTA buttons, accent bars
  accent2     #5A9E6B  moss green   — secondary accent, rules, alternate dots
  text_cta_bg #1A3D2E  forest green — dark panel backgrounds
  cta_text    #EBF6F0  sage mint    — (same as base, text on accent buttons)
"""
from __future__ import annotations

from pathlib import Path

from adgen.render.context import RenderContext  # noqa: F401  -- re-exported for client templates
from adgen.render.bullet_styles import (  # noqa: F401  -- re-exported for client templates
    bullet_style_for_ad,
    bullet_style_css,
    STYLE_NAMES as BULLET_STYLE_NAMES,
)

# ── Shared ad design constants ────────────────────────────────────────────────
# Change _LOGO_HEIGHT here and every template + derived position updates.
# _LOGO_MAX_W caps wide logos from overflowing narrow panels (490px dark column).
_LOGO_HEIGHT = 116   # px — logo img height used across every template
_LOGO_MAX_W  = 360   # px — max-width for logo images


def _make_dark_logo(logo_path: str) -> str:
    """
    Return a version of the logo suitable for dark panel backgrounds.
    If the logo already has a transparent background (white-on-transparent design),
    return it unchanged — it is already correct for dark backgrounds.
    Otherwise strip near-white background pixels so the logo floats on the dark panel.
    Result is cached next to the source as <name>-dark.png and re-used on repeat calls.
    """
    src = Path(logo_path)
    dst = src.parent / (src.stem + "-dark.png")
    if dst.exists():
        return str(dst)
    try:
        from PIL import Image
        img = Image.open(src).convert("RGBA")
        data = img.load()
        w, h = img.size
        total = w * h

        # Logos with transparent backgrounds (e.g. white-on-transparent) are already
        # ready for dark panels — processing would erase the white content itself.
        transparent = sum(1 for y in range(h) for x in range(w) if data[x, y][3] < 30)
        if transparent / total > 0.40:
            return logo_path

        for y in range(h):
            for x in range(w):
                r, g, b, a = data[x, y]
                if r > 245 and g > 242 and b > 238:
                    # Smoothly fade near-whites to transparent
                    white = (r + g + b) / 765          # 0.96-1.0 for near-whites
                    fade = max(0.0, (white - 0.94) / 0.06)
                    data[x, y] = (r, g, b, int(a * (1.0 - fade)))
        img.save(dst, "PNG")
        return str(dst)
    except Exception:
        return logo_path

_FONTS = (
    '<link href="https://fonts.googleapis.com/css2?family='
    'Cormorant+Garamond:ital,wght@0,300;1,300;1,400;1,600'
    "&family=DM+Sans:wght@300;400;500;600"
    '&display=swap" rel="stylesheet">'
)

_FONT_READY = '<script>document.fonts.ready.then(()=>{ document.title="fonts-ready"; });</script>'


def _h(text: str) -> str:
    return (
        text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
    )


def _get(lst: list[str], idx: int, fallback: str = "") -> str:
    try:
        return lst[idx]
    except IndexError:
        return fallback


def _rot(lst: list[str], base: int, angle: int) -> str:
    if not lst:
        return ""
    return lst[(base + angle) % len(lst)]


def _logo_tag(ctx: RenderContext, height: int = _LOGO_HEIGHT, extra_css: str = "") -> str:
    if ctx.logo_path:
        dark_path = _make_dark_logo(ctx.logo_path)
        p = Path(dark_path).resolve()
        url = "file:///" + str(p).replace("\\", "/")
        return (
            f'<img class="logo-img" src="{url}" alt="{_h(ctx.brand_name)}" '
            f'style="height:{height}px;max-width:{_LOGO_MAX_W}px;width:auto;display:block;'
            f'object-fit:contain;opacity:0.92;{extra_css}">'
        )
    # Scale text logo to the same visual weight as an img logo at the requested height.
    # Cormorant at weight 300 reads narrow, so font-size ≈ height * 0.75 gives similar mass.
    font_size = max(36, int(height * 0.75))
    return (
        f'<span class="logo-txt" style="font-family:\'Cormorant Garamond\',serif;'
        f'font-size:{font_size}px;'
        f'font-weight:300;font-style:italic;color:rgba(255,255,255,0.88);'
        f'letter-spacing:0.12em;{extra_css}">{_h(ctx.brand_name)}</span>'
    )
