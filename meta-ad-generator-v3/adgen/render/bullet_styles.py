"""
Bullet point style catalog for Meta ad HTML templates.

Usage in step 4b when writing ad HTML:
    from adgen.render.bullet_styles import bullet_style_for_ad, bullet_style_css
    style = bullet_style_for_ad(ad_index)   # 0-indexed
    css   = bullet_style_css(style, palette['accent'], palette['accent2'])
    # Paste css inside the ad's <style> tag

Or via CLI to preview:
    python -c "from adgen.render.bullet_styles import bullet_style_for_ad, bullet_style_css; \
               print(bullet_style_css(bullet_style_for_ad(0), '#E4A489', '#C87A5B'))"
"""
from __future__ import annotations

STYLE_NAMES: list[str] = [
    "gradient-pill",    # gradient fill pill — most aggressive, highest contrast
    "glow-border",      # outlined pill with neon glow
    "color-flash",      # full-width stripe + bold left accent bar (feature-table feel)
    "hard-tab",         # sharp left border, no container — editorial
    "frosted-card",     # frosted glass backdrop-blur card
    "numbered-badge",   # numbered accent circles replace icons
    "accent-dot",       # glowing accent dot marker, bottom-border separator
]


def bullet_style_for_ad(ad_index: int) -> str:
    """Return the bullet style name for this ad index (cycles through all 7 styles)."""
    return STYLE_NAMES[ad_index % len(STYLE_NAMES)]


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _rgba(hex_color: str, alpha: float) -> str:
    r, g, b = _hex_to_rgb(hex_color)
    return f"rgba({r},{g},{b},{alpha})"


def bullet_style_css(
    style: str,
    accent: str,
    accent2: str,
    text: str = "#ffffff",
) -> str:
    """
    Return a CSS block that styles .benefit / .brow elements for the chosen style.
    Paste the returned string verbatim inside the ad's <style> tag.

    Parameters
    ----------
    style   : one of STYLE_NAMES
    accent  : primary accent hex from chosen.json  (e.g. '#E4A489')
    accent2 : secondary accent hex from chosen.json (e.g. '#C87A5B')
    text    : bullet text color (default white — override for light-bg ads)
    """
    glow   = _rgba(accent, 0.55)
    light  = _rgba(accent, 0.14)
    faint  = _rgba(accent, 0.20)
    inner  = _rgba(accent, 0.08)

    # ── gradient-pill ───────────────────────────────────────────────────────────
    if style == "gradient-pill":
        return (
            f".benefit,.brow{{background:linear-gradient(105deg,{accent},{accent2});"
            f"border-radius:28px;padding:11px 20px;"
            f"box-shadow:0 4px 18px {glow};gap:12px;}}\n"
            f".btext{{color:#fff;font-weight:600;}}\n"
            f".bicon,.bicon svg{{color:#fff;fill:#fff;}}\n"
            f".bdot{{background:rgba(255,255,255,0.65);}}"
        )

    # ── glow-border ─────────────────────────────────────────────────────────────
    if style == "glow-border":
        return (
            f".benefit,.brow{{border:2px solid {accent};border-radius:28px;"
            f"padding:10px 18px;gap:12px;"
            f"box-shadow:0 0 18px {glow},inset 0 0 8px {inner};"
            f"background:rgba(255,255,255,0.05);}}\n"
            f".btext{{color:{text};}}\n"
            f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
            f".bdot{{background:{accent};box-shadow:0 0 8px {glow};}}"
        )

    # ── color-flash ─────────────────────────────────────────────────────────────
    if style == "color-flash":
        return (
            f".benefit,.brow{{background:{light};border-left:5px solid {accent};"
            f"border-radius:0 10px 10px 0;padding:11px 18px;gap:12px;}}\n"
            f".btext{{color:{text};font-weight:500;}}\n"
            f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
            f".bdot{{display:none;}}"
        )

    # ── hard-tab ────────────────────────────────────────────────────────────────
    if style == "hard-tab":
        return (
            f".benefit,.brow{{border-left:5px solid {accent};border-radius:0;"
            f"padding:9px 16px;gap:12px;background:transparent;}}\n"
            f".btext{{color:{text};}}\n"
            f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
            f".bdot{{display:none;}}"
        )

    # ── frosted-card ────────────────────────────────────────────────────────────
    if style == "frosted-card":
        return (
            f".benefit,.brow{{background:rgba(255,255,255,0.13);"
            f"backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);"
            f"border:1px solid rgba(255,255,255,0.22);"
            f"border-radius:14px;padding:11px 18px;gap:12px;}}\n"
            f".btext{{color:{text};}}\n"
            f".bicon,.bicon svg{{color:{accent};fill:{accent};}}\n"
            f".bdot{{background:rgba(255,255,255,0.6);}}"
        )

    # ── numbered-badge ──────────────────────────────────────────────────────────
    if style == "numbered-badge":
        return (
            f".benefits{{counter-reset:benefit-num;}}\n"
            f".benefit,.brow{{counter-increment:benefit-num;gap:14px;}}\n"
            f".benefit::before,.brow::before{{content:counter(benefit-num);"
            f"min-width:34px;height:34px;background:{accent};border-radius:50%;"
            f"font-size:15px;font-weight:700;color:#fff;"
            f"text-align:center;line-height:34px;flex-shrink:0;}}\n"
            f".bicon,.bdot{{display:none;}}\n"
            f".btext{{color:{text};font-weight:500;}}"
        )

    # ── accent-dot ──────────────────────────────────────────────────────────────
    if style == "accent-dot":
        return (
            f".benefit,.brow{{gap:14px;padding:8px 0;"
            f"border-bottom:1px solid {faint};}}\n"
            f".benefit:last-child,.brow:last-child{{border-bottom:none;}}\n"
            f".benefit::before,.brow::before{{content:'';"
            f"width:10px;height:10px;border-radius:50%;background:{accent};"
            f"flex-shrink:0;margin-top:7px;box-shadow:0 0 8px {glow};}}\n"
            f".bicon,.bdot{{display:none;}}\n"
            f".btext{{color:{text};}}"
        )

    raise ValueError(f"Unknown bullet style: {style!r}. Must be one of {STYLE_NAMES}")
