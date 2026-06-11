"""Post-render layout validator: detects and fixes text/button overlaps, logo sizing,
and template-style compliance.

Runs after `adgen render` to ensure:
  • No text element overlaps or touches the CTA button.
  • Every logo element is within readable size bounds.
  • Logo opacity is high enough to be visible.
  • Logo has max-width + object-fit to prevent stretching (img logos).
  • Rendered HTML matches the catalog style for its template (tone, fonts, photo zones).

Layout fixes are applied in-place. Template-style issues are reported as warnings only.

Run as:  python -m adgen validate-html <domain>
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import click

from adgen import paths

_CATALOG_PATH = Path(__file__).parent.parent / "templates" / "catalog.json"

CANVAS_H = 1080
MIN_GAP = 8  # px minimum clear gap between any text element and CTA

# ── Logo thresholds ──────────────────────────────────────────────────────────
# On a 1080×1080 canvas the logo must be visually prominent.
# templates.py uses _LOGO_HEIGHT = 116px as the house standard; keep LOGO_IMG_MAX_H
# above that value so the validator never auto-shrinks a deliberately large logo.
# Img-based logos  (.logo-img, .logo)
LOGO_IMG_MIN_H   = 64    # below this logo disappears at feed scale
LOGO_IMG_MAX_H   = 130   # must stay above _LOGO_HEIGHT (116) — do not lower this
LOGO_IMG_DEFAULT = 76

# Text-based logos  (.logo-txt)
LOGO_TXT_MIN_FONT   = 36   # below this text logo is barely readable
LOGO_TXT_MAX_FONT   = 64
LOGO_TXT_DEFAULT    = 48

LOGO_DEFAULT_MAX_W  = "360px"   # matches _LOGO_MAX_W in templates.py
LOGO_MIN_OPACITY    = 0.50      # below this the logo is barely visible

# ── Proportionality thresholds ───────────────────────────────────────────────
# LOGO_HEADLINE_MAX_RATIO is intentionally permissive (2.0).
# The house logo (116px) is larger than the typical 80px headline; the validator
# must NOT fight this — the user controls logo sizing directly via _LOGO_HEIGHT.
LOGO_HEADLINE_MIN_RATIO = 0.45
LOGO_HEADLINE_MAX_RATIO = 2.00  # permissive — do not lower without checking _LOGO_HEIGHT

# Minimum bullet / body text sizes on a 1080px canvas.
# Rationale: 1080px canvas → ~360px on phone feed (0.33× scale).
# 22px × 0.33 = ~7px on screen — the minimum legible size.
BULLET_TEXT_MIN_FONT = 22
BODY_TEXT_MIN_FONT   = 22
CHIP_TEXT_MIN_FONT   = 20   # chip/tag/eyebrow/badge — slightly smaller is OK
EYEBROW_MIN_FONT     = 20

# Headline font-weight threshold for non-editorial templates
# On mobile feed the thumb moves in ~1 second; sub-600 weight headlines disappear
HEADLINE_MIN_WEIGHT_NON_EDITORIAL = 600

# Selector sets
_LOGO_IMG_SELECTORS = {".logo-img", ".logo"}
_LOGO_TXT_SELECTORS = {".logo-txt"}
_ALL_LOGO_SELECTORS = _LOGO_IMG_SELECTORS | _LOGO_TXT_SELECTORS

# CSS class names that represent the CTA button wrapper
_CTA_SELECTORS = {".cta-wrap"}

# Full-bleed photo classes that typically have ad text sitting on top of them
_BG_PHOTO_CLASSES = {"bg-img", "pimg", "limg"}

# Gradient overlay classes that protect text on top of photos
_OVERLAY_CLASSES = {"overlay", "phaze", "pfade", "lcurve", "gradient", "bg-overlay"}

# Minimum opacity the darkest gradient stop must reach to protect white text
MIN_OVERLAY_ALPHA = 0.55

# CSS class names that represent text/chip content to check against the CTA
_TEXT_SELECTORS = {".content", ".chips", ".stat-wrap"}


# ── Box model ────────────────────────────────────────────────────────────────

@dataclass
class _Box:
    selector: str
    bottom: int
    height: int

    @property
    def top(self) -> int:
        return self.bottom + self.height

    def overlaps_or_touches(self, other: "_Box") -> bool:
        return self.bottom <= other.top and other.bottom <= self.top


@dataclass
class LayoutIssue:
    selector: str
    message: str


# ── CSS parsing / rewriting helpers ──────────────────────────────────────────

def _css_blocks(style_text: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for m in re.finditer(r"(\.[a-zA-Z][\w-]*)\s*\{([^}]*)\}", style_text, re.DOTALL):
        result[m.group(1).strip()] = m.group(2)
    return result


def _int_px(rules: str, prop: str, default: int = 0) -> int:
    m = re.search(rf"\b{re.escape(prop)}:\s*(\d+(?:\.\d+)?)px", rules)
    return int(float(m.group(1))) if m else default


def _float_prop(rules: str, prop: str, default: float = 1.4) -> float:
    m = re.search(rf"\b{re.escape(prop)}:\s*(\d+(?:\.\d+)?)", rules)
    return float(m.group(1)) if m else default


def _has_prop(rules: str, prop: str) -> bool:
    return bool(re.search(rf"\b{re.escape(prop)}\s*:", rules))


def _padding_vertical(rules: str) -> tuple[int, int]:
    # CSS padding shorthand: 1-value → all sides; 2-value → V H; 3-value → T H B; 4-value → T R B L
    m = re.search(r"\bpadding:\s*([^;]+)", rules)
    if m:
        nums = [int(float(v)) for v in re.findall(r"\d+(?:\.\d+)?", m.group(1))]
        if len(nums) == 1:   return nums[0], nums[0]
        if len(nums) == 2:   return nums[0], nums[0]   # top=bottom=A in "A B"
        if len(nums) >= 3:   return nums[0], nums[2]   # top=nums[0], bottom=nums[2]
    return _int_px(rules, "padding-top"), _int_px(rules, "padding-bottom")


def _estimate_height(rules: str, n_lines: int = 1) -> int:
    font_size   = _int_px(rules, "font-size", 16)
    line_height = _float_prop(rules, "line-height", 1.4)
    pt, pb      = _padding_vertical(rules)
    return pt + max(1, int(font_size * line_height * n_lines)) + pb


def _count_text_lines(html: str, css_class: str) -> int:
    cls = re.escape(css_class.lstrip("."))
    m = re.search(
        rf'class="[^"]*\b{cls}\b[^"]*"[^>]*>(.*?)</(?:div|p|span)>',
        html, re.DOTALL | re.IGNORECASE,
    )
    if not m:
        return 1
    inner    = m.group(1)
    br_count = inner.count("<br>") + inner.count("<br/>") + inner.count("<br />")
    if br_count:
        return br_count + 1
    plain = re.sub(r"<[^>]+>", "", inner).strip()
    return max(1, len(plain) // 60 + 1)


def _replace_prop_in_block(html: str, css_class: str, prop: str, new_val: str) -> str:
    pattern = re.compile(
        r"(" + re.escape(css_class) + r"\s*\{[^}]*?)"
        + rf"\b{re.escape(prop)}:\s*[^;}}]+",
        re.DOTALL,
    )
    return pattern.sub(rf"\g<1>{prop}:{new_val}", html)


def _add_prop_to_block(html: str, css_class: str, prop: str, value: str) -> str:
    pattern = re.compile(
        r"(" + re.escape(css_class) + r"\s*\{)([^}]*)(\})", re.DOTALL,
    )
    def _repl(m: re.Match) -> str:
        open_b, rules, close_b = m.group(1), m.group(2), m.group(3)
        if re.search(rf"\b{re.escape(prop)}\s*:", rules):
            return m.group(0)
        sep = " " if rules.rstrip().endswith(";") else "; "
        return open_b + rules + sep + f"{prop}:{value};" + close_b
    return pattern.sub(_repl, html)


def _set_prop_in_block(html: str, css_class: str, prop: str, value: str) -> str:
    exists = re.search(
        re.escape(css_class) + r"\s*\{[^}]*\b" + re.escape(prop) + r"\s*:",
        html, re.DOTALL,
    )
    return (_replace_prop_in_block(html, css_class, prop, value)
            if exists else _add_prop_to_block(html, css_class, prop, value))


def _replace_bottom_in_block(html: str, css_class: str, new_px: int) -> str:
    return _set_prop_in_block(html, css_class, "bottom", f"{new_px}px")


# ── Inline-style logo helpers ─────────────────────────────────────────────────
# _logo_tag() writes height / max-width / object-fit as inline style attributes,
# not into the <style> block. The CSS-block parser misses these, so we handle
# inline logos with a dedicated pair of helpers.

_LOGO_IMG_CLASSES = ("logo-img", "logo")


def _all_inline_logo_heights(html: str) -> list[tuple[int, str]]:
    """Return (height_px, css_class_name) for every inline-styled logo <img> found."""
    results: list[tuple[int, str]] = []
    seen_classes: set[str] = set()
    for cls in _LOGO_IMG_CLASSES:
        if cls in seen_classes:
            continue
        for m in re.finditer(
            rf'<img\b[^>]*class="[^"]*\b{re.escape(cls)}\b[^"]*"[^>]*style="([^"]+)"',
            html,
        ):
            h = _int_px(m.group(1), "height", 0)
            if h:
                results.append((h, cls))
                seen_classes.add(cls)
                break  # one entry per class name is enough for validate+fix
    return results


def _inline_logo_height(html: str) -> tuple[int, str]:
    """Return (height_px, css_class_name) from the first inline-styled logo <img>, or (0, '')."""
    logos = _all_inline_logo_heights(html)
    return logos[0] if logos else (0, "")


def _fix_inline_logo_height(html: str, cls: str, new_h: int) -> str:
    """Rewrite the height: value inside the inline style of all logo <img> tags with cls."""
    return re.sub(
        rf'(<img\b[^>]*class="[^"]*\b{re.escape(cls)}\b[^"]*"[^>]*style="[^"]*)height:\d+(?:\.\d+)?px',
        rf'\g<1>height:{new_h}px',
        html,
    )


def _fix_inline_logo_max_width(html: str, cls: str, max_w: str) -> str:
    """Add max-width to inline logo style if not already present."""
    for m in re.finditer(
        rf'<img\b[^>]*class="[^"]*\b{re.escape(cls)}\b[^"]*"[^>]*style="([^"]+)"',
        html,
    ):
        if "max-width" not in m.group(1):
            old = m.group(0)
            new = old.replace('style="', f'style="max-width:{max_w};', 1)
            return html.replace(old, new, 1)
    return html


# ── Logo validation ───────────────────────────────────────────────────────────

def _check_and_fix_logo(html: str, blocks: dict[str, str]) -> tuple[list[LayoutIssue], str]:
    """Validate all logo selectors (.logo-img, .logo, .logo-txt) and fix in-place."""
    issues: list[LayoutIssue] = []
    modified = html

    for sel, rules in blocks.items():
        if sel not in _ALL_LOGO_SELECTORS:
            continue

        # ── Img-based logos: check height ───────────────────────────────────
        if sel in _LOGO_IMG_SELECTORS:
            height = _int_px(rules, "height", 0)
            if height == 0:
                issues.append(LayoutIssue(sel, "missing height — logo may render invisible"))
                modified = _set_prop_in_block(modified, sel, "height", f"{LOGO_IMG_DEFAULT}px")
            elif height < LOGO_IMG_MIN_H:
                issues.append(LayoutIssue(
                    sel,
                    f"height:{height}px too small (min {LOGO_IMG_MIN_H}px) — logo barely visible",
                ))
                modified = _set_prop_in_block(modified, sel, "height", f"{LOGO_IMG_DEFAULT}px")
            elif height > LOGO_IMG_MAX_H:
                issues.append(LayoutIssue(
                    sel,
                    f"height:{height}px too large (max {LOGO_IMG_MAX_H}px) — logo dominates layout",
                ))
                modified = _set_prop_in_block(modified, sel, "height", f"{LOGO_IMG_MAX_H}px")

            # max-width prevents wide logos overflowing container
            if not _has_prop(rules, "max-width"):
                issues.append(LayoutIssue(sel, "missing max-width — wide logos will stretch"))
                modified = _add_prop_to_block(modified, sel, "max-width", LOGO_DEFAULT_MAX_W)

            # object-fit:contain prevents distortion when container bounds both axes
            if not _has_prop(rules, "object-fit"):
                issues.append(LayoutIssue(sel, "missing object-fit:contain — logo may distort"))
                modified = _add_prop_to_block(modified, sel, "object-fit", "contain")

        # ── Text-based logos: check font-size ───────────────────────────────
        elif sel in _LOGO_TXT_SELECTORS:
            font_size = _int_px(rules, "font-size", 0)
            if font_size == 0:
                issues.append(LayoutIssue(sel, "missing font-size — text logo may render tiny"))
                modified = _set_prop_in_block(modified, sel, "font-size", f"{LOGO_TXT_DEFAULT}px")
            elif font_size < LOGO_TXT_MIN_FONT:
                issues.append(LayoutIssue(
                    sel,
                    f"font-size:{font_size}px too small (min {LOGO_TXT_MIN_FONT}px) — text logo barely readable",
                ))
                modified = _set_prop_in_block(modified, sel, "font-size", f"{LOGO_TXT_DEFAULT}px")
            elif font_size > LOGO_TXT_MAX_FONT:
                issues.append(LayoutIssue(
                    sel,
                    f"font-size:{font_size}px too large (max {LOGO_TXT_MAX_FONT}px)",
                ))
                modified = _set_prop_in_block(modified, sel, "font-size", f"{LOGO_TXT_MAX_FONT}px")

        # ── All logo types: check opacity ────────────────────────────────────
        if _has_prop(rules, "opacity"):
            opacity = _float_prop(rules, "opacity", 1.0)
            if opacity < LOGO_MIN_OPACITY:
                issues.append(LayoutIssue(
                    sel,
                    f"opacity:{opacity:.2f} too low (min {LOGO_MIN_OPACITY}) — logo nearly invisible",
                ))
                modified = _set_prop_in_block(modified, sel, "opacity", "0.82")

        # ── All logo types: brightness(0) on dark bg makes logo invisible ──
        # brightness(0) is intentional on light backgrounds (darkens logo for contrast).
        # Only flag/fix it when the ad background is dark (luminance < 0.4).
        filter_m = re.search(r"\bfilter:\s*([^;]+)", rules)
        if filter_m and "brightness(0)" in filter_m.group(1):
            lum = _bg_luminance(html)
            bg_is_dark = lum is None or lum < 0.4
            if bg_is_dark:
                issues.append(LayoutIssue(
                    sel,
                    "filter contains brightness(0) — logo is rendered pure black and invisible on dark backgrounds",
                ))
                old_filter = filter_m.group(0)
                new_filter = old_filter.replace("brightness(0)", "brightness(1)")
                modified = modified.replace(old_filter, new_filter, 1)

    # ── Inline-styled logo images (style="" attribute, not in <style> block) ──
    for inline_h, inline_cls in _all_inline_logo_heights(modified):
        if inline_h < LOGO_IMG_MIN_H:
            issues.append(LayoutIssue(
                f".{inline_cls}[inline]",
                f"inline logo height {inline_h}px too small (min {LOGO_IMG_MIN_H}px) — resizing to {LOGO_IMG_DEFAULT}px",
            ))
            modified = _fix_inline_logo_height(modified, inline_cls, LOGO_IMG_DEFAULT)
        elif inline_h > LOGO_IMG_MAX_H:
            issues.append(LayoutIssue(
                f".{inline_cls}[inline]",
                f"inline logo height {inline_h}px too large (max {LOGO_IMG_MAX_H}px) — resizing to {LOGO_IMG_MAX_H}px",
            ))
            modified = _fix_inline_logo_height(modified, inline_cls, LOGO_IMG_MAX_H)
        modified = _fix_inline_logo_max_width(modified, inline_cls, LOGO_DEFAULT_MAX_W)

    return issues, modified


# ── Overlap check + fix ───────────────────────────────────────────────────────

def _check_and_fix_overlaps(
    html: str, blocks: dict[str, str]
) -> tuple[list[LayoutIssue], str]:
    boxes: list[_Box] = []
    for sel, rules in blocks.items():
        if sel not in _CTA_SELECTORS and sel not in _TEXT_SELECTORS:
            continue
        if "bottom:" not in rules:
            continue
        bottom = _int_px(rules, "bottom")

        if sel in _CTA_SELECTORS:
            inner  = blocks.get(".cta", rules)
            height = _estimate_height(inner)
        elif sel == ".chips":
            inner  = blocks.get(".chip", rules)
            height = _estimate_height(inner)
        else:
            n      = _count_text_lines(html, sel)
            height = _estimate_height(rules, n)

        boxes.append(_Box(sel, bottom, height))

    if not boxes:
        return [], html

    cta_boxes = [b for b in boxes if b.selector in _CTA_SELECTORS]
    if not cta_boxes:
        return [], html

    ordered = sorted(boxes, key=lambda b: b.bottom)
    issues:  list[LayoutIssue] = []
    modified = html
    fixed:   list[_Box] = [ordered[0]]

    for box in ordered[1:]:
        prev = fixed[-1]
        if box.overlaps_or_touches(prev):
            issues.append(LayoutIssue(
                box.selector,
                f"overlaps/touches {prev.selector} "
                f"(element bottom={box.bottom}px, required clearance above {prev.top}px)",
            ))
            new_bottom = prev.top + MIN_GAP
            modified   = _replace_bottom_in_block(modified, box.selector, new_bottom)
            box        = _Box(box.selector, new_bottom, box.height)
        fixed.append(box)

    return issues, modified


# ── Proportionality + text-size checks ───────────────────────────────────────

def _check_and_fix_proportions(
    html: str, blocks: dict[str, str]
) -> tuple[list[LayoutIssue], str]:
    """
    Ensure logo, headline, and body/bullet text are proportionally sized.

    Logo should be 45-90% of headline font-size (LOGO_HEADLINE_MIN/MAX_RATIO).
    Bullet text (.btext, .body-text) must be at least BULLET_TEXT_MIN_FONT px.
    """
    issues: list[LayoutIssue] = []
    modified = html

    # ── Derive headline size (.hd) ────────────────────────────────────────────
    headline_size: int | None = None
    hd_rules = blocks.get(".hd")
    if hd_rules:
        headline_size = _int_px(hd_rules, "font-size") or None

    # ── Logo-to-headline proportionality ─────────────────────────────────────
    if headline_size:
        # Try CSS-block logo first; fall back to inline-style logo
        css_logo_h, css_logo_sel = 0, ""
        for sel in _LOGO_IMG_SELECTORS:
            rules = blocks.get(sel)
            if rules:
                h = _int_px(rules, "height", 0)
                if h:
                    css_logo_h, css_logo_sel = h, sel
                    break

        inline_h, inline_cls = _inline_logo_height(modified)
        logo_h   = css_logo_h or inline_h
        logo_src = "css" if css_logo_h else ("inline" if inline_h else "")

        if logo_h and logo_src:
            ratio = logo_h / headline_size
            if ratio < LOGO_HEADLINE_MIN_RATIO:
                ideal = max(LOGO_IMG_MIN_H, int(headline_size * 0.60))
                ideal = min(ideal, LOGO_IMG_MAX_H)
                issues.append(LayoutIssue(
                    css_logo_sel or f".{inline_cls}[inline]",
                    f"logo {logo_h}px is only {ratio:.0%} of headline {headline_size}px "
                    f"(min {LOGO_HEADLINE_MIN_RATIO:.0%}) — resizing to {ideal}px",
                ))
                if logo_src == "css":
                    modified = _set_prop_in_block(modified, css_logo_sel, "height", f"{ideal}px")
                else:
                    modified = _fix_inline_logo_height(modified, inline_cls, ideal)
            elif ratio > LOGO_HEADLINE_MAX_RATIO:
                ideal = min(LOGO_IMG_MAX_H, int(headline_size * 0.72))
                ideal = max(ideal, LOGO_IMG_MIN_H)
                issues.append(LayoutIssue(
                    css_logo_sel or f".{inline_cls}[inline]",
                    f"logo {logo_h}px is {ratio:.0%} of headline {headline_size}px "
                    f"(max {LOGO_HEADLINE_MAX_RATIO:.0%}) — resizing to {ideal}px",
                ))
                if logo_src == "css":
                    modified = _set_prop_in_block(modified, css_logo_sel, "height", f"{ideal}px")
                else:
                    modified = _fix_inline_logo_height(modified, inline_cls, ideal)

        for sel in _LOGO_TXT_SELECTORS:
            rules = blocks.get(sel)
            if rules is None:
                continue
            logo_fs = _int_px(rules, "font-size", 0)
            if logo_fs == 0:
                continue
            ratio = logo_fs / headline_size
            if ratio < LOGO_HEADLINE_MIN_RATIO:
                ideal = max(LOGO_TXT_MIN_FONT, int(headline_size * 0.55))
                ideal = min(ideal, LOGO_TXT_MAX_FONT)
                issues.append(LayoutIssue(
                    sel,
                    f"text logo font-size {logo_fs}px is only {ratio:.0%} of headline "
                    f"{headline_size}px — resizing to {ideal}px",
                ))
                modified = _set_prop_in_block(modified, sel, "font-size", f"{ideal}px")

    # ── Bullet / body text legibility ─────────────────────────────────────────
    # 1080px canvas displays at ~360px on phone feed (0.33×). 22px → ~7px on
    # screen — the minimum legible size at scroll speed.
    _BULLET_SELECTORS = {
        ".btext", ".bullet", ".itext", ".body-text", ".body", ".sub",
        ".brand-tag", ".bar-text", ".tape-text", ".ri-line",
    }
    for sel in _BULLET_SELECTORS:
        rules = blocks.get(sel)
        if rules is None:
            continue
        fs = _int_px(rules, "font-size", 0)
        if fs and fs < BULLET_TEXT_MIN_FONT:
            issues.append(LayoutIssue(
                sel,
                f"font-size:{fs}px too small (min {BULLET_TEXT_MIN_FONT}px on 1080px canvas — "
                f"renders as ~{int(fs * 0.33)}px on phone feed) — bumping to {BULLET_TEXT_MIN_FONT}px",
            ))
            modified = _set_prop_in_block(modified, sel, "font-size", f"{BULLET_TEXT_MIN_FONT}px")

    # ── Chip / eyebrow / badge legibility ─────────────────────────────────────
    _CHIP_SELECTORS = {
        ".chip-text", ".chip", ".eyebrow", ".eyebrow-text", ".badge-text",
        ".badge", ".tag-text", ".tag-top", ".pe-text",
        # Shape-layout variants used in diagonal-band and wave ads
        ".eyebrow-above", ".band-sub-text",
    }
    for sel in _CHIP_SELECTORS:
        rules = blocks.get(sel)
        if rules is None:
            continue
        fs = _int_px(rules, "font-size", 0)
        if fs and fs < CHIP_TEXT_MIN_FONT:
            issues.append(LayoutIssue(
                sel,
                f"font-size:{fs}px too small for chip/eyebrow/badge "
                f"(min {CHIP_TEXT_MIN_FONT}px) — bumping up",
            ))
            modified = _set_prop_in_block(modified, sel, "font-size", f"{CHIP_TEXT_MIN_FONT}px")

    # ── Bullet icon legibility ────────────────────────────────────────────────
    # SVG icons next to 22px bullet text must be ≥ 24px to remain visible at
    # 0.33× phone-feed scale. Check the CSS class; also patch inline SVG attrs.
    BICON_MIN = 24
    bicon_rules = blocks.get(".bicon")
    if bicon_rules is not None:
        icon_w = _int_px(bicon_rules, "width", 0)
        icon_h = _int_px(bicon_rules, "height", 0)
        icon_size = max(icon_w, icon_h)
        if icon_size and icon_size < BICON_MIN:
            issues.append(LayoutIssue(
                ".bicon",
                f"icon size {icon_size}px too small (min {BICON_MIN}px next to 22px bullet text) "
                f"— bumping to {BICON_MIN}px",
            ))
            modified = _set_prop_in_block(modified, ".bicon", "width", f"{BICON_MIN}px")
            modified = _set_prop_in_block(modified, ".bicon", "height", f"{BICON_MIN}px")
            # Also patch inline SVG width/height attributes
            modified = re.sub(
                r'(<svg\b[^>]*class="[^"]*\bbicon\b[^"]*"[^>]*)\bwidth="\d+"',
                rf'\g<1>width="{BICON_MIN}"', modified,
            )
            modified = re.sub(
                r'(<svg\b[^>]*class="[^"]*\bbicon\b[^"]*"[^>]*)\bheight="\d+"',
                rf'\g<1>height="{BICON_MIN}"', modified,
            )

    return issues, modified


# ── Hyphenation check ─────────────────────────────────────────────────────────

def _check_and_fix_hyphens(html: str) -> tuple[list[LayoutIssue], str]:
    """Ensure no element auto-hyphenates and no word is manually split across a <br>.

    Fixes applied in-place:
      1. Any vendor-prefixed or bare hyphens:auto → hyphens:none.
      2. Universal *{} reset: add hyphens:none if missing.
      3. Universal *{} reset: add -webkit-hyphens:none if missing (Blink/WebKit safety).
      4. Hard-hyphen word splits in HTML content (e.g. tehno-<br>loģijas → tehnoloģijas).
    """
    issues: list[LayoutIssue] = []
    modified = html

    # Replace vendor-prefixed auto first so the bare hyphens:auto check is clean
    for pattern, replacement, label in [
        (r"-webkit-hyphens\s*:\s*auto", "-webkit-hyphens:none", "-webkit-hyphens:auto"),
        (r"-moz-hyphens\s*:\s*auto",    "-moz-hyphens:none",    "-moz-hyphens:auto"),
        (r"-ms-hyphens\s*:\s*auto",     "-ms-hyphens:none",     "-ms-hyphens:auto"),
    ]:
        if re.search(pattern, modified):
            issues.append(LayoutIssue("*", f"{label} found — replaced with none"))
            modified = re.sub(pattern, replacement, modified)

    # bare hyphens:auto — safe after vendor prefixes already replaced above
    if re.search(r"hyphens\s*:\s*auto", modified):
        issues.append(LayoutIssue(
            "*",
            "hyphens:auto found — replaced with hyphens:none to prevent mid-word breaks in headlines",
        ))
        modified = re.sub(r"hyphens\s*:\s*auto", "hyphens:none", modified)

    # Ensure universal *{} reset has both hyphens:none and -webkit-hyphens:none.
    # Prefer the *{} block that already declares a bare hyphens property; else use first *{} block.
    star_blocks = list(re.finditer(r"(\*\s*\{)([^}]*)(\})", modified))
    target = next(
        (m for m in star_blocks if re.search(r"(?<![a-z-])hyphens\s*:", m.group(2))),
        star_blocks[0] if star_blocks else None,
    )
    if target is not None:
        rules     = target.group(2)
        open_b    = target.group(1)
        close_b   = target.group(3)
        new_rules = rules

        if not re.search(r"(?<![a-z-])hyphens\s*:", new_rules):
            issues.append(LayoutIssue("*", "universal reset missing hyphens:none — added"))
            sep = "" if new_rules.rstrip().endswith(";") else ";"
            new_rules = new_rules.rstrip() + sep + "hyphens:none"

        if not re.search(r"-webkit-hyphens\s*:", new_rules):
            issues.append(LayoutIssue("*", "universal reset missing -webkit-hyphens:none — added"))
            sep = "" if new_rules.rstrip().endswith(";") else ";"
            new_rules = new_rules.rstrip() + sep + "-webkit-hyphens:none"

        if new_rules != rules:
            modified = (
                modified[: target.start()]
                + open_b + new_rules + close_b
                + modified[target.end():]
            )
    else:
        # No *{} block at all — inject one right after <style>
        style_m = re.search(r"<style>", modified)
        if style_m:
            issues.append(LayoutIssue(
                "*",
                "no universal CSS reset found — injecting *{hyphens:none;-webkit-hyphens:none}",
            ))
            pos = style_m.end()
            modified = modified[:pos] + "\n*{hyphens:none;-webkit-hyphens:none}" + modified[pos:]

    # 4. Hard-hyphen word splits: letter-<br> joins the broken word (removes hyphen + <br>).
    #    Matches Latvian letters (āčēģīķļņšūž etc.) as well as ASCII.
    _WORD_SPLIT = re.compile(
        r"([A-Za-zāčēģīķļņšūžĀČĒĢĪĶĻŅŠŪŽ])-<br\s*/?>",
        re.IGNORECASE,
    )
    if _WORD_SPLIT.search(modified):
        count = len(_WORD_SPLIT.findall(modified))
        issues.append(LayoutIssue(
            ".hd",
            f"{count} hard-hyphen word split(s) found in content (e.g. tehno-<br>loģijas) "
            "— hyphens and <br> removed to rejoin words",
        ))
        modified = _WORD_SPLIT.sub(r"\1", modified)

    return issues, modified


# ── Single-spacer dead-zone check ─────────────────────────────────────────────

def _check_single_spacer(html: str, blocks: dict[str, str]) -> list[LayoutIssue]:
    """Warn when a layout has exactly one flex:1 spacer and no .middle centering.

    One spacer between the logo and the content block dumps all dead space into
    the top zone, making the ad look top-heavy with a large gap under the logo.

    Correct alternatives:
      - Two .spacer elements (one above content, one below) — distributes space evenly.
      - .middle { flex:1; display:flex; flex-direction:column; justify-content:center }
        wrapping the headline+bullets — centers the content block vertically.
    """
    spacer_rules = blocks.get(".spacer")
    if spacer_rules is None:
        return []

    flex_val = re.search(r"\bflex\s*:\s*(\S+)", spacer_rules)
    if not flex_val or flex_val.group(1) not in ("1", "1 1 0", "1 1 auto", "1 1 0%"):
        return []

    # Count all spacer variants: class="spacer", class="spacer2", etc.
    # \bspacer\b alone misses "spacer2" because digits are word chars (\w).
    spacer_count = len(re.findall(r'class="[^"]*\bspacer\w*', html))
    if spacer_count != 1:
        return []  # Two spacers = correct; zero = not applicable

    # .middle { flex:1; justify-content:center } is an accepted alternative
    middle_rules = blocks.get(".middle")
    if middle_rules:
        has_flex1 = bool(re.search(r"\bflex\s*:\s*1\b", middle_rules))
        has_center = bool(re.search(r"\bjustify-content\s*:\s*center\b", middle_rules))
        if has_flex1 and has_center:
            return []

    return [LayoutIssue(
        ".spacer",
        "single flex:1 spacer — all dead space stacks above the content block (top-heavy). "
        "Fix A: add a second <div class=\"spacer\"></div> after the content block. "
        "Fix B: replace spacer+content with "
        "<div class=\"middle\" style=\"flex:1;display:flex;flex-direction:column;"
        "justify-content:center\">…</div>",
    )]


# ── Public entry point ────────────────────────────────────────────────────────

def check_and_fix_layout(html: str) -> tuple[list[LayoutIssue], str]:
    """Run all layout checks on a single HTML ad string.

    Checks:
      1. Logo sizing (height/font-size in bounds, max-width, object-fit, opacity, brightness)
      2. Logo-to-headline proportionality + bullet/body text legibility
      3. Text/button overlap (absolutely-positioned elements only)
      4. hyphens:auto → hyphens:none (auto-fixed)
      5. Single-spacer dead-zone (warning only — not auto-fixed)

    Returns (all_issues, fixed_html).
    """
    style_m = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
    if not style_m:
        return [], html

    blocks     = _css_blocks(style_m.group(1))
    all_issues: list[LayoutIssue] = []
    modified   = html

    hyph_issues, modified = _check_and_fix_hyphens(modified)
    all_issues.extend(hyph_issues)

    logo_issues, modified = _check_and_fix_logo(modified, blocks)
    all_issues.extend(logo_issues)

    # Re-parse after logo fix so proportion check sees corrected logo sizes
    style_m2 = re.search(r"<style>(.*?)</style>", modified, re.DOTALL)
    blocks2  = _css_blocks(style_m2.group(1)) if style_m2 else blocks

    prop_issues, modified = _check_and_fix_proportions(modified, blocks2)
    all_issues.extend(prop_issues)

    # Re-parse again so overlap check sees final element sizes
    style_m3 = re.search(r"<style>(.*?)</style>", modified, re.DOTALL)
    blocks3  = _css_blocks(style_m3.group(1)) if style_m3 else blocks2

    overlap_issues, modified = _check_and_fix_overlaps(modified, blocks3)
    all_issues.extend(overlap_issues)

    return all_issues, modified


# ── Template-style compliance ─────────────────────────────────────────────────

def _load_catalog() -> dict:
    if not _CATALOG_PATH.exists():
        return {}
    try:
        return json.loads(_CATALOG_PATH.read_text(encoding="utf-8")).get("templates", {})
    except (json.JSONDecodeError, OSError):
        return {}


def _slug_to_template_id(slug: str) -> str | None:
    """'ad-4-r01' → 'r01'. Returns None for built-in slugs not in the catalog."""
    m = re.match(r"^ad-\d+-(.+?)(?:-a\d+)?$", slug)
    if not m:
        return None
    candidate = m.group(1)
    catalog = _load_catalog()
    return candidate if candidate in catalog else None


def _bg_luminance(html: str) -> float | None:
    """Extract perceived background luminance from .ad CSS block (0.0 dark – 1.0 light)."""
    style_m = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
    if not style_m:
        return None
    ad_block = re.search(r"\.ad\s*\{([^}]*)\}", style_m.group(1), re.DOTALL)
    if not ad_block:
        return None
    bg_m = re.search(r"\bbackground\s*:\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\))", ad_block.group(1))
    if not bg_m:
        return None
    val = bg_m.group(1).strip()
    try:
        if val.startswith("#"):
            h = val[1:]
            if len(h) == 3:
                h = h[0] * 2 + h[1] * 2 + h[2] * 2
            r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        elif val.startswith("rgb"):
            nums = re.findall(r"\d+", val)
            if len(nums) < 3:
                return None
            r, g, b = int(nums[0]), int(nums[1]), int(nums[2])
        else:
            return None
    except (ValueError, IndexError):
        return None
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255


def _has_product_img(html: str) -> bool:
    """True if the HTML contains at least one <img> that is not a web font reference."""
    srcs = re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', html)
    return any("googleapis" not in s and "gstatic" not in s for s in srcs)


def check_template_style(slug: str, html: str) -> list[LayoutIssue]:
    """
    Compare rendered HTML against the catalog entry for this template ID.

    slug must follow the convention 'ad-N-<template-id>' for catalog lookup.
    Built-in slugs (editorial, dark, offer) return no issues.
    Issues are warnings only — nothing is auto-fixed.
    """
    catalog = _load_catalog()
    template_id = _slug_to_template_id(slug)
    if template_id is None:
        return []

    entry = catalog.get(template_id)
    if entry is None:
        return [LayoutIssue(slug, f"template ID '{template_id}' not in catalog")]

    issues: list[LayoutIssue] = []
    style       = entry.get("style", "")
    elements    = entry.get("elements", [])
    photo_zones = entry.get("photo_zones", [])

    # 1. Background tone — dark vs light
    lum = _bg_luminance(html)
    if lum is not None:
        expects_dark  = any(k in style for k in ("dark", "industrial", "bold"))
        expects_light = any(k in style for k in ("editorial-light", "clean-light"))
        if expects_dark and lum > 0.5:
            issues.append(LayoutIssue(
                slug,
                f"catalog style '{style}' expects dark background "
                f"but .ad luminance={lum:.2f} (looks light) — check background color",
            ))
        elif expects_light and lum < 0.4:
            issues.append(LayoutIssue(
                slug,
                f"catalog style '{style}' expects light background "
                f"but .ad luminance={lum:.2f} (looks dark) — check background color",
            ))

    # 2. Font personality
    uses_serif = "Cormorant" in html or "cormorant" in html
    uses_heavy = bool(re.search(r"font-weight\s*:\s*(700|800|900|bold)\b", html))
    if "editorial" in style and not uses_serif:
        issues.append(LayoutIssue(
            slug,
            f"catalog style '{style}' is editorial — expected Cormorant Garamond serif",
        ))
    if "bold" in style and not uses_heavy:
        issues.append(LayoutIssue(
            slug,
            f"catalog style '{style}' is bold — expected font-weight ≥700 on at least one element",
        ))

    # 3b. Headline font-weight for non-editorial templates (advisory only, not auto-fixed)
    # Editorial (Cormorant) looks fine at 400-600; everything else needs 600+ to survive
    # the ~1-second mobile scroll window.
    if not uses_serif:
        style_m = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
        if style_m:
            hd_block = re.search(r"\.hd(?:-wrap)?\s*\{([^}]*)\}", style_m.group(1), re.DOTALL)
            if hd_block:
                wm = re.search(r"\bfont-weight\s*:\s*(\d+|bold|bolder)\b", hd_block.group(1))
                if wm:
                    raw = wm.group(1)
                    numeric = 700 if raw in ("bold", "bolder") else int(raw)
                    if numeric < HEADLINE_MIN_WEIGHT_NON_EDITORIAL:
                        issues.append(LayoutIssue(
                            slug,
                            f".hd font-weight:{raw} is below {HEADLINE_MIN_WEIGHT_NON_EDITORIAL} "
                            f"on a non-editorial template — increase to 700+ for mobile legibility",
                        ))

    # 3. Photo zones
    has_photo = _has_product_img(html)
    if photo_zones and not has_photo:
        zones_str = ", ".join(photo_zones)
        issues.append(LayoutIssue(
            slug,
            f"catalog lists photo zone(s) [{zones_str}] but no <img> found — add a product image",
        ))
    if not photo_zones and has_photo:
        issues.append(LayoutIssue(
            slug,
            f"catalog lists no photo zones for '{template_id}' but HTML contains <img> elements",
        ))

    # 4. Required structural elements
    if "logo" in elements and not re.search(r'class="[^"]*logo', html):
        issues.append(LayoutIssue(slug, "catalog requires 'logo' element but no logo class found"))
    cta_els = [e for e in elements if e == "cta" or e.startswith("cta-") or e.endswith("-cta")]
    if cta_els and not re.search(r'class="[^"]*\bcta\b', html):
        issues.append(LayoutIssue(slug, "catalog requires CTA element but no .cta class found"))

    return issues


# ── Photo brightness floor check ─────────────────────────────────────────────

# brightness() values below this make hero photos appear almost black on-screen.
# Hero photos should stay at ≥0.85 and rely on a gradient overlay on the content
# panel rather than darkening the photo itself.
PHOTO_BRIGHTNESS_FLOOR = 0.65


def _check_photo_brightness(html: str, blocks: dict[str, str]) -> list[LayoutIssue]:
    """Warn when any element has a CSS brightness() filter below PHOTO_BRIGHTNESS_FLOOR."""
    issues: list[LayoutIssue] = []

    # Scan CSS block filter rules
    for sel, rules in blocks.items():
        if "filter" not in rules:
            continue
        bm = re.search(r"\bfilter\s*:[^;]*brightness\s*\(\s*([\d.]+)\s*\)", rules)
        if bm:
            val = float(bm.group(1))
            if val < PHOTO_BRIGHTNESS_FLOOR:
                issues.append(LayoutIssue(
                    sel,
                    f"brightness({val:.2f}) is below {PHOTO_BRIGHTNESS_FLOOR} — "
                    f"photo will appear almost black; use brightness(≥0.85) and "
                    f"add a gradient overlay on the content panel instead",
                ))

    # Also scan inline style attributes
    for im in re.finditer(r"<[^>]+\bstyle=\"([^\"]*brightness[^\"]*)\"\s*[^>]*>", html):
        bm = re.search(r"brightness\s*\(\s*([\d.]+)\s*\)", im.group(1))
        if bm:
            val = float(bm.group(1))
            if val < PHOTO_BRIGHTNESS_FLOOR:
                cls_m = re.search(r'\bclass="([^"]+)"', im.group(0))
                sel_hint = f".{cls_m.group(1).split()[0]}" if cls_m else "inline-style"
                issues.append(LayoutIssue(
                    sel_hint,
                    f"inline brightness({val:.2f}) is below {PHOTO_BRIGHTNESS_FLOOR} — "
                    f"photo will appear almost black",
                ))

    return issues


# ── Image/overlay contrast check ─────────────────────────────────────────────

def _parse_gradient_max_alpha(gradient_css: str) -> float:
    """Return the maximum opacity found across all stops in a gradient CSS value.

    Handles: rgba(..., a), #rrggbbaa hex, 6-digit solid hex, and 'transparent'.
    Returns 0.0 when no stops can be parsed (unknown format — assume no coverage).
    """
    alphas: list[float] = []

    # rgba(r, g, b, alpha) stops
    for m in re.finditer(r'rgba\s*\([^)]+,\s*([\d.]+)\s*\)', gradient_css):
        alphas.append(min(1.0, float(m.group(1))))

    # 8-digit hex #rrggbbaa — last two digits are alpha byte
    for h in re.findall(r'#([0-9a-fA-F]{8})\b', gradient_css):
        alphas.append(int(h[6:8], 16) / 255)

    # 6-digit solid hex — fully opaque
    for h in re.findall(r'#([0-9a-fA-F]{6})\b', gradient_css):
        alphas.append(1.0)

    # 'transparent' keyword = alpha 0
    alphas.extend([0.0] * len(re.findall(r'\btransparent\b', gradient_css)))

    return max(alphas) if alphas else 0.0


def _check_image_overlays(html: str, blocks: dict[str, str]) -> list[LayoutIssue]:
    """Warn when a full-bleed background photo lacks an adequate dark gradient overlay.

    Only fires when at least one _BG_PHOTO_CLASSES element is present in the HTML,
    meaning this template overlays ad text directly on a photo.
    """
    issues: list[LayoutIssue] = []

    used_bg = [
        cls for cls in _BG_PHOTO_CLASSES
        if re.search(rf'class="[^"]*\b{re.escape(cls)}\b', html)
    ]
    if not used_bg:
        return []

    # Collect max alpha from every gradient overlay candidate
    overlay_alphas: list[tuple[str, float]] = []
    for sel, rules in blocks.items():
        cls_name = sel.lstrip(".")
        is_named_overlay = cls_name in _OVERLAY_CLASSES
        has_gradient = "linear-gradient" in rules or "radial-gradient" in rules
        is_positioned = "inset" in rules or (
            "position" in rules and "absolute" in rules
        )
        if not has_gradient:
            continue
        if not (is_named_overlay or is_positioned):
            continue
        bg_m = re.search(r'\bbackground\s*:\s*([^;]+gradient[^;]+)', rules)
        if bg_m:
            alpha = _parse_gradient_max_alpha(bg_m.group(1))
            overlay_alphas.append((sel, alpha))

    if not overlay_alphas:
        for cls in used_bg:
            issues.append(LayoutIssue(
                f".{cls}",
                "full-bleed background photo has no gradient overlay — "
                "text will be unreadable over bright images; "
                "add a dark linear-gradient div on top of the photo zone",
            ))
        return issues

    # Report any overlay whose maximum stop is weaker than the threshold
    for sel, alpha in overlay_alphas:
        if alpha < MIN_OVERLAY_ALPHA:
            issues.append(LayoutIssue(
                sel,
                f"gradient overlay max opacity is only {alpha:.0%} "
                f"(need ≥{MIN_OVERLAY_ALPHA:.0%}) — text sitting on the photo "
                f"may be unreadable; darken the opaque gradient stop",
            ))

    return issues


# ── Domain-level helper ───────────────────────────────────────────────────────

def validate_html_ads(domain: str) -> list[LayoutIssue]:
    """Check and fix all HTML ads for a domain. Overwrites files that had issues."""
    html_dir = paths.client_dir(domain) / "html"
    if not html_dir.exists():
        return [LayoutIssue("*", f"html/ directory not found for '{domain}'")]

    all_issues: list[LayoutIssue] = []
    for html_path in sorted(html_dir.glob("*.html")):
        slug           = html_path.stem
        raw            = html_path.read_text(encoding="utf-8")

        # Layout fixes (overlaps, logo sizing) — modifies HTML in-place
        layout_issues, fixed = check_and_fix_layout(raw)
        for iss in layout_issues:
            all_issues.append(LayoutIssue(f"{html_path.name}:{iss.selector}", iss.message))
        if layout_issues:
            html_path.write_text(fixed, encoding="utf-8")
            print(f"[layout]   Fixed {len(layout_issues)} issue(s) in {html_path.name}")
        else:
            print(f"[layout]   OK  {html_path.name}")

        # Single-spacer dead-zone — warning only, no auto-fix
        style_m_sp = re.search(r"<style>(.*?)</style>", fixed, re.DOTALL)
        sp_blocks  = _css_blocks(style_m_sp.group(1)) if style_m_sp else {}
        for iss in _check_single_spacer(fixed, sp_blocks):
            all_issues.append(LayoutIssue(f"{html_path.name}:{iss.selector}", iss.message))
            print(f"[spacing]  WARN {html_path.name}: {iss.message}")

        # Template-style compliance — warnings only, no auto-fix
        style_issues = check_template_style(slug, fixed)
        for iss in style_issues:
            all_issues.append(LayoutIssue(f"{html_path.name}:{iss.selector}", iss.message))
            print(f"[template] WARN {html_path.name}: {iss.message}")

        # Image/overlay contrast — warnings only, no auto-fix
        style_m = re.search(r"<style>(.*?)</style>", fixed, re.DOTALL)
        overlay_blocks = _css_blocks(style_m.group(1)) if style_m else {}
        overlay_issues = _check_image_overlays(fixed, overlay_blocks)
        for iss in overlay_issues:
            all_issues.append(LayoutIssue(f"{html_path.name}:{iss.selector}", iss.message))
            print(f"[contrast] WARN {html_path.name}: {iss.message}")

        # Photo brightness floor — warnings only, no auto-fix
        brightness_issues = _check_photo_brightness(fixed, overlay_blocks)
        for iss in brightness_issues:
            all_issues.append(LayoutIssue(f"{html_path.name}:{iss.selector}", iss.message))
            print(f"[contrast] WARN {html_path.name}: {iss.message}")

    return all_issues


# ── CLI ───────────────────────────────────────────────────────────────────────

@click.command("validate-html")
@click.argument("domain")
def cli(domain: str) -> None:
    """Check and auto-fix layout issues; warn on template-style mismatches."""
    issues = validate_html_ads(domain)
    if not issues:
        click.echo("PASS — no layout issues found")
        sys.exit(0)
    click.echo(f"FIXED — {len(issues)} issue(s) corrected:")
    for iss in issues:
        click.echo(f"  • {iss.selector}: {iss.message}")


if __name__ == "__main__":
    cli()
