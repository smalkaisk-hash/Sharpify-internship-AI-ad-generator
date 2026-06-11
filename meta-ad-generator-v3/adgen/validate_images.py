"""Quality gate for the scraped image assets recorded in a manifest.json.

Run as a script:  python -m adgen validate-images path/to/manifest.json

Exits 0 if clean, 1 if any issues found. Prints one issue per line to stdout.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

import click
from PIL import Image, ImageStat, UnidentifiedImageError


MIN_LOGO_WIDTH = 200
MIN_LOGO_HEIGHT = 60
MIN_PRODUCT_WIDTH = 600
MIN_PRODUCT_HEIGHT = 400
MIN_USABLE_LOGOS = 1
MIN_USABLE_PRODUCTS = 2

# Copy-space brightness check: bottom 40% of image must be below this luminance
# so white ad text can sit on it without a heavy overlay.
# Scale 0–255: 155 ≈ medium grey. Anything brighter risks clash with white text.
COPY_SPACE_LUM_MAX = 155


@dataclass
class Issue:
    field: str
    message: str
    level: str = "error"  # "error" blocks pipeline; "warn" prints but passes


def _check_file_exists(field: str, path: str) -> Issue | None:
    if not Path(path).exists():
        return Issue(field, f"file not found: {path}")
    return None


def _check_copy_space(field: str, path: str) -> Issue | None:
    """Warn if the bottom 40% of the image is too bright for white text overlay."""
    if path.endswith(".svg"):
        return None
    try:
        img = Image.open(path).convert("L")
    except (UnidentifiedImageError, OSError):
        return None  # file/format errors already caught by _check_dimensions
    w, h = img.size
    if h < 10:
        return None
    bottom_crop = img.crop((0, int(h * 0.60), w, h))
    mean_lum = ImageStat.Stat(bottom_crop).mean[0]
    if mean_lum > COPY_SPACE_LUM_MAX:
        return Issue(
            field,
            f"bottom 40% too bright (avg luminance {mean_lum:.0f}/255, "
            f"threshold {COPY_SPACE_LUM_MAX}) — white text overlay will clash; "
            f"use a darker image or add a solid dark gradient over the text zone",
            level="warn",
        )
    return None


def _check_dimensions(field: str, path: str, min_w: int, min_h: int) -> Issue | None:
    if path.endswith(".svg"):
        return None
    try:
        w, h = Image.open(path).size
    except (UnidentifiedImageError, OSError):
        return Issue(field, f"cannot open image: {path}")
    if w < min_w or h < min_h:
        return Issue(field, f"too small ({w}×{h}px, need at least {min_w}×{min_h}px)")
    return None


def analyze_logo_bg(path: str) -> str:
    """Return 'transparent', 'white', 'dark', or 'color' based on logo background.

    Checks alpha channel first; falls back to sampling the four corners.
    Result is stored in manifest so HTML rendering can place the logo correctly.
    """
    if path.endswith(".svg"):
        return "transparent"
    try:
        img = Image.open(path)
    except (UnidentifiedImageError, OSError):
        return "unknown"

    # Alpha channel present → check if corners are actually transparent
    if img.mode in ("RGBA", "LA", "PA"):
        rgba = img.convert("RGBA")
        w, h = rgba.size
        patch = 12
        corners = [
            rgba.crop((0, 0, patch, patch)),
            rgba.crop((w - patch, 0, w, patch)),
            rgba.crop((0, h - patch, patch, h)),
            rgba.crop((w - patch, h - patch, w, h)),
        ]
        avg_alpha = sum(
            sum(px[3] for px in list(c.getdata())) / (patch * patch)
            for c in corners
        ) / 4
        if avg_alpha < 30:
            return "transparent"
        # Has alpha channel but corners aren't transparent — fall through to color check

    rgb = img.convert("RGB")
    w, h = rgb.size
    patch = 12
    corner_pixels: list[tuple[int, int, int]] = []
    for corner in [
        rgb.crop((0, 0, patch, patch)),
        rgb.crop((w - patch, 0, w, patch)),
        rgb.crop((0, h - patch, patch, h)),
        rgb.crop((w - patch, h - patch, w, h)),
    ]:
        data = list(corner.getdata())
        r = sum(p[0] for p in data) // len(data)
        g = sum(p[1] for p in data) // len(data)
        b = sum(p[2] for p in data) // len(data)
        corner_pixels.append((r, g, b))

    avg_r = sum(p[0] for p in corner_pixels) // 4
    avg_g = sum(p[1] for p in corner_pixels) // 4
    avg_b = sum(p[2] for p in corner_pixels) // 4

    if avg_r > 220 and avg_g > 220 and avg_b > 220:
        return "white"
    if avg_r < 40 and avg_g < 40 and avg_b < 40:
        return "dark"
    return "color"


def validate_images(manifest: dict) -> list[Issue]:
    issues: list[Issue] = []

    primary = manifest.get("primary_logo_path") or ""
    if not primary:
        issues.append(Issue("primary_logo_path", "not set — no primary logo identified during scrape"))
    elif not Path(primary).exists():
        issues.append(Issue("primary_logo_path", f"file not found: {primary}"))
    else:
        manifest["logo_bg"] = analyze_logo_bg(primary)

    usable_logos = 0
    usable_products = 0

    for group in ("logos", "product_images", "other_images"):
        is_logo_group = group == "logos"
        min_w = MIN_LOGO_WIDTH if is_logo_group else MIN_PRODUCT_WIDTH
        min_h = MIN_LOGO_HEIGHT if is_logo_group else MIN_PRODUCT_HEIGHT

        for idx, item in enumerate(manifest.get(group) or []):
            downloaded = item.get("downloaded_path") or ""
            if not downloaded:
                continue

            field = f"{group}[{idx}]"

            if issue := _check_file_exists(field, downloaded):
                issues.append(issue)
                continue

            if issue := _check_dimensions(field, downloaded, min_w, min_h):
                issues.append(issue)
                continue

            if is_logo_group:
                usable_logos += 1
            else:
                usable_products += 1
                # Brightness check: non-logo images may be used as ad backgrounds
                if issue := _check_copy_space(field, downloaded):
                    issues.append(issue)

    if usable_logos < MIN_USABLE_LOGOS:
        issues.append(Issue(
            "logos",
            f"need at least {MIN_USABLE_LOGOS} usable logo(s), found {usable_logos}",
        ))
    if usable_products < MIN_USABLE_PRODUCTS:
        issues.append(Issue(
            "product_images + other_images",
            f"need at least {MIN_USABLE_PRODUCTS} usable product/other image(s), found {usable_products}",
        ))

    return issues


@click.command()
@click.argument("path", type=click.Path(exists=True, dir_okay=False, path_type=Path))
def cli(path: Path) -> None:
    """Validate image assets recorded in a scrape manifest.json."""
    manifest = json.loads(path.read_text(encoding="utf-8"))
    issues = validate_images(manifest)
    # Write back logo_bg if it was set during validation
    if "logo_bg" in manifest:
        path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    errors = [i for i in issues if i.level == "error"]
    warnings = [i for i in issues if i.level == "warn"]
    if warnings:
        click.echo(f"WARN — {len(warnings)} suggestion(s):")
        for issue in warnings:
            click.echo(f"  ⚠  {issue.field}: {issue.message}")
    if not errors:
        click.echo("PASS — no blocking issues found")
        sys.exit(0)
    click.echo(f"FAIL — {len(errors)} issue(s):")
    for issue in errors:
        click.echo(f"  • {issue.field}: {issue.message}")
    sys.exit(1)


if __name__ == "__main__":
    cli()
