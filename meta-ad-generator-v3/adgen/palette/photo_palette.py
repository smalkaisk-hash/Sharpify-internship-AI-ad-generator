"""
Derive a usable 5-slot colour palette from a single product/lifestyle image.

Design principle (validated by ad-1 Warm Chocolate success):
  Cohesion comes from staying within the photo's dominant hue temperature.
  All five slots are pulled from the SAME narrow hue band — just at different
  lightness levels. The panel bg is the darkest native hue; the headline is
  the lightest; the accent is the most saturated mid-tone.

  For multi-hued photos (e.g. warm skin + cool water) we allow accent2 to
  use the second hue — but only if it is genuinely 20°+ away. Otherwise
  accent2 is a tonal variant of accent (lighter or darker same hue), which
  reads as a supporting highlight rather than a jarring contrast.

Slots returned:
  text_cta_bg  — dark panel background
  base         — headline text on dark bg (lightest tint of dominant hue)
  second_tone  — body text on dark bg (slightly deeper than base)
  accent       — primary CTA / accent (most saturated mid-tone)
  accent2      — secondary accent (different hue if available, else tonal)
  cta_text     — text on accent button (same value as base)
"""
from __future__ import annotations

import colorsys
from pathlib import Path


# ── colour math ──────────────────────────────────────────────────────────────

def _parse(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _to_hls(hex_color: str) -> tuple[float, float, float]:
    """Return (hue 0-1, lightness 0-1, saturation 0-1)."""
    r, g, b = _parse(hex_color)
    return colorsys.rgb_to_hls(r / 255, g / 255, b / 255)


def _to_hex(h: float, l: float, s: float) -> str:
    r, g, b = colorsys.hls_to_rgb(h, max(0.0, min(1.0, l)), max(0.0, min(1.0, s)))
    return "#{:02x}{:02x}{:02x}".format(
        max(0, min(255, int(r * 255))),
        max(0, min(255, int(g * 255))),
        max(0, min(255, int(b * 255))),
    )


def _hue_dist(a: float, b: float) -> float:
    """Circular distance between two hues (0-1 scale), max 0.5."""
    d = abs(a - b)
    return min(d, 1.0 - d)


# ── image extraction ─────────────────────────────────────────────────────────

def _extract_full_range(image_path: str | Path, n: int = 24) -> list[str]:
    """
    Extract dominant colours across the full brightness range (dark to light).
    Unlike extract_dominant_colors(), this keeps near-dark and near-light
    tones because we need them to derive the panel background and headline.
    """
    try:
        from PIL import Image
    except ImportError:
        return []

    try:
        img = Image.open(image_path).convert("RGB")
    except Exception:
        return []

    img.thumbnail((180, 180), Image.LANCZOS)
    quantized = img.quantize(colors=96).convert("RGB")

    freq: dict[tuple[int, int, int], int] = {}
    for pixel in quantized.getdata():
        freq[pixel] = freq.get(pixel, 0) + 1

    scored = []
    for (r, g, b), count in freq.items():
        avg = (r + g + b) / 3
        if avg < 8 or avg > 248:        # skip only pure black / pure white
            continue
        _, _, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        scored.append((count * (0.3 + s), f"#{r:02x}{g:02x}{b:02x}"))

    scored.sort(reverse=True)
    return [c for _, c in scored[:n]]


# ── palette derivation ───────────────────────────────────────────────────────

def derive_palette_from_photo(image_path: str | Path) -> dict | None:
    """
    Return a palette dict for the given image, or None on failure.
    Caller should fall back to the brand palette when None is returned.
    """
    colors = _extract_full_range(image_path, n=24)
    if not colors:
        return None

    # Annotate with (hex, hue, lightness, saturation)
    ann: list[tuple[str, float, float, float]] = [
        (c, *_to_hls(c)) for c in colors
    ]

    darks     = [t for t in ann if t[2] < 0.32]
    lights    = [t for t in ann if t[2] > 0.62]
    mids      = [t for t in ann if 0.22 <= t[2] <= 0.74]
    saturated = sorted(mids, key=lambda t: -t[3])

    darks.sort(key=lambda t: t[2])       # darkest first
    lights.sort(key=lambda t: -t[2])     # lightest first

    # ── panel background ─────────────────────────────────────────────────────
    # Use the darkest native hue from the image and push lightness to ≤ 0.18.
    # This makes the panel feel like a deep shadow of the photo itself.
    if darks:
        _, h, l, s = darks[0]
        bg = _to_hex(h, min(l, 0.18), max(s, 0.12))
    elif saturated:
        _, h, l, s = saturated[0]
        bg = _to_hex(h, 0.16, max(s, 0.30))
    else:
        _, h, l, s = ann[0]
        bg = _to_hex(h, 0.16, 0.10)

    # ── base / headline colour ───────────────────────────────────────────────
    # Lightest native tone, pushed to ≥ 0.88 lightness.
    # Keeping the photo's hue (e.g. warm cream vs cold white) is what makes
    # the headline feel extracted from the image rather than imposed on it.
    if lights:
        _, h, l, s = lights[0]
        base = _to_hex(h, max(l, 0.88), max(s, 0.08))
    elif saturated:
        _, h, l, s = saturated[0]
        base = _to_hex(h, 0.92, 0.18)
    else:
        base = "#f0ece8"

    # ── second tone (body text) ───────────────────────────────────────────────
    # A slightly deeper tint of base — same hue family, 6-10% lower lightness.
    # This gives body copy visual weight without breaking hue temperature.
    if len(lights) > 1:
        _, h, l, s = lights[1]
        second_tone = _to_hex(h, max(l, 0.82), max(s, 0.10))
    elif saturated:
        _, h, l, s = saturated[0]
        second_tone = _to_hex(h, 0.84, max(s * 0.6, 0.18))
    else:
        second_tone = base

    # Enforce a minimum lightness gap of 0.07 between base and second_tone
    bh, bl, bs = _to_hls(base)
    sh, sl, ss = _to_hls(second_tone)
    if abs(bl - sl) < 0.07:
        second_tone = _to_hex(sh, max(sl - 0.09, 0.73), ss)

    # ── primary accent ───────────────────────────────────────────────────────
    # Most saturated mid-tone from the image — the "hero" colour.
    # Pushed into the 36-62% lightness band so it reads as a strong accent,
    # not a washed-out tint or a muddy shadow.
    if saturated:
        _, h, l, s = saturated[0]
        accent = _to_hex(h, max(min(l, 0.62), 0.36), max(s, 0.42))
    else:
        h, l, s = _to_hls(bg)
        accent = _to_hex(h, 0.48, 0.40)

    # ── secondary accent ─────────────────────────────────────────────────────
    # STRATEGY A — multi-hued photo: find a colour with hue ≥ 20° from accent.
    #   Example: warm skin (orange) + cool water (blue) → two real accent hues.
    # STRATEGY B — monochromatic photo: create a tonal variant.
    #   Lighter if accent is dark, darker if accent is light.
    #   This keeps the scheme coherent (no jarring foreign hue) while giving
    #   the templates a visually distinct secondary element.
    acc_h, acc_l, acc_s = _to_hls(accent)

    accent2 = None
    if len(saturated) > 1:
        for _, h, l, s in saturated[1:]:
            if _hue_dist(h, acc_h) >= 0.055:          # ≥ ~20° apart
                accent2 = _to_hex(h, max(min(l, 0.62), 0.36), max(s, 0.35))
                break

    if accent2 is None:
        # No distinct hue found — make a tonal variant (Strategy B).
        step = 0.16
        if acc_l < 0.50:
            accent2 = _to_hex(acc_h, min(acc_l + step, 0.72), max(acc_s * 0.75, 0.25))
        else:
            accent2 = _to_hex(acc_h, max(acc_l - step, 0.28), max(acc_s * 0.75, 0.25))

    return {
        "text_cta_bg": bg,
        "base":        base,
        "second_tone": second_tone,
        "accent":      accent,
        "accent2":     accent2,
        "cta_text":    base,
    }
