"""
Spatial zone analysis for generated ad PNGs.

Divides each ad into a configurable grid and measures per-zone:
  brightness     — 0-255 mean pixel brightness (dark panel vs photo vs light bg)
  uniformity     — 0-1, inverse of brightness std-dev; high = flat solid fill
  edge_density   — 0-1, mean edge strength after FIND_EDGES; high = text / UI elements
  dominant_color — most-frequent hex after quantisation (ignores pure black / white)
  label          — human-readable guess: "dark panel", "photo", "text/UI", "light bg", etc.

Usage (CLI):
  python -m adgen zone-review <domain>          # all PNGs in clients/<domain>/png/
  python -m adgen zone-review --file path.png   # single file

Output:
  Prints a compact grid table to stdout so you can read it.
  Writes  clients/<domain>/png/<ad-name>-zones.json  for programmatic use.
"""
from __future__ import annotations

import json
import statistics
from pathlib import Path


# ── image analysis ─────────────────────────────────────────────────────────────

def _analyse_zone(zone_img) -> dict:
    """Return stats for one cropped PIL image zone."""
    import colorsys
    from PIL import ImageFilter

    pixels = list(zone_img.getdata())          # list of (R, G, B)
    n = len(pixels)

    brightness_vals = [(r + g + b) / 3 for r, g, b in pixels]
    mean_b = sum(brightness_vals) / n
    std_b  = statistics.pstdev(brightness_vals)
    uniformity = max(0.0, 1.0 - std_b / 128)  # 0 = chaotic, 1 = flat solid

    # Edge density via FIND_EDGES on greyscale
    grey = zone_img.convert("L")
    edges = grey.filter(ImageFilter.FIND_EDGES)
    edge_mean = sum(edges.getdata()) / n / 255  # 0-1

    # Dominant colour — quantise to 16, pick most-frequent non-extreme swatch
    q = zone_img.quantize(colors=16).convert("RGB")
    freq: dict[tuple[int, int, int], int] = {}
    for p in q.getdata():
        freq[p] = freq.get(p, 0) + 1

    dominant = "#888888"
    for (r, g, b), _ in sorted(freq.items(), key=lambda x: -x[1]):
        avg = (r + g + b) / 3
        if 12 < avg < 244:
            dominant = f"#{r:02x}{g:02x}{b:02x}"
            break

    label = _interpret(mean_b, uniformity, edge_mean)

    return {
        "brightness":    round(mean_b, 1),
        "uniformity":    round(uniformity, 2),
        "edge_density":  round(edge_mean, 3),
        "dominant_color": dominant,
        "label":         label,
    }


def _interpret(brightness: float, uniformity: float, edge_density: float) -> str:
    """Heuristic zone label from three metrics."""
    dark  = brightness < 65
    light = brightness > 190
    flat  = uniformity > 0.60   # text on panel drops uniformity; 0.60 still separates from complex photo
    busy  = edge_density > 0.025   # antialiased ad text sits at ~0.03-0.05

    if dark and flat and not busy:
        return "dark panel"
    if dark and flat and busy:
        return "dark panel + UI"
    if dark and not flat and busy:
        return "dark photo"
    if dark and not flat:
        return "dark photo"
    if light and flat and not busy:
        return "light background"
    if light and busy:
        return "light text / UI"
    if not dark and not light and flat and busy:
        return "solid fill + UI"
    if not dark and not light and flat:
        return "mid-tone solid"
    if busy:
        return "photo + text overlay" if not flat else "UI element"
    return "photo"


# ── grid splitter ──────────────────────────────────────────────────────────────

def analyse_ad(png_path: str | Path, rows: int = 3, cols: int = 3) -> dict:
    """
    Split the ad PNG into a rows×cols grid and return analysis per zone.

    Returns:
        {
          "file": "ad-1-editorial.png",
          "size": [1080, 1080],
          "grid": "3x3",
          "zones": {
            "r0c0": {"label": "dark panel", "brightness": 28, ...},
            ...
          }
        }
    """
    try:
        from PIL import Image
    except ImportError:
        raise RuntimeError("Pillow is required: pip install pillow")

    path = Path(png_path)
    img  = Image.open(path).convert("RGB")
    w, h = img.size

    cell_w = w // cols
    cell_h = h // rows

    zones: dict[str, dict] = {}
    for r in range(rows):
        for c in range(cols):
            x0 = c * cell_w
            y0 = r * cell_h
            x1 = x0 + cell_w
            y1 = y0 + cell_h
            crop = img.crop((x0, y0, x1, y1))
            key  = f"r{r}c{c}"
            zones[key] = {"row": r, "col": c, **_analyse_zone(crop)}

    return {
        "file":  path.name,
        "size":  [w, h],
        "grid":  f"{rows}x{cols}",
        "zones": zones,
    }


# ── pretty printer ─────────────────────────────────────────────────────────────

_COL_HEADERS = ["LEFT", "CENTER", "RIGHT"]
_ROW_HEADERS = ["TOP", "MID", "BOT"]


def print_report(report: dict) -> None:
    """Print a compact grid table + per-zone details to stdout."""
    print(f"\n{'─'*60}")
    print(f"  {report['file']}  ({report['size'][0]}×{report['size'][1]}px)  grid {report['grid']}")
    print(f"{'─'*60}")

    zones  = report["zones"]
    rows   = max(z["row"] for z in zones.values()) + 1
    cols   = max(z["col"] for z in zones.values()) + 1
    r_hdrs = _ROW_HEADERS[:rows]
    c_hdrs = _COL_HEADERS[:cols]

    # Header row
    col_w = 22
    print("         " + "".join(f"{h:<{col_w}}" for h in c_hdrs))

    for r in range(rows):
        row_label = r_hdrs[r] if r < len(r_hdrs) else f"R{r}"
        cells = []
        for c in range(cols):
            z = zones.get(f"r{r}c{c}", {})
            label = z.get("label", "?")
            cells.append(f"{label:<{col_w}}")
        print(f"  {row_label:<6}  {''.join(cells)}")

    print()

    # Detail table
    print(f"  {'zone':<6} {'label':<24} {'bright':>6} {'uniform':>7} {'edges':>7} {'color'}")
    print(f"  {'─'*5} {'─'*23} {'─'*6} {'─'*7} {'─'*7} {'─'*9}")
    for key, z in zones.items():
        print(
            f"  {key:<6} {z['label']:<24} "
            f"{z['brightness']:>6.0f} {z['uniformity']:>7.2f} "
            f"{z['edge_density']:>7.3f} {z['dominant_color']}"
        )
    print()


# ── CLI helper (called from __main__.py) ───────────────────────────────────────

def run_zone_review(domain: str | None, file_path: str | None,
                    rows: int = 3, cols: int = 3) -> None:
    from adgen import paths

    if file_path:
        targets = [Path(file_path)]
    elif domain:
        png_dir = paths.client_dir(domain) / "png"
        if not png_dir.exists():
            raise FileNotFoundError(f"No png/ directory for {domain}: {png_dir}")
        targets = sorted(
            p for p in png_dir.iterdir()
            if p.suffix.lower() == ".png" and "zones" not in p.name
        )
        if not targets:
            raise FileNotFoundError(f"No PNGs found in {png_dir}")
    else:
        raise ValueError("Provide domain or --file")

    for target in targets:
        report = analyse_ad(target, rows=rows, cols=cols)
        print_report(report)

        out = target.with_name(target.stem + "-zones.json")
        out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  Saved: {out.name}\n")
