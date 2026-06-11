"""Extract dominant colors from a product image using Pillow quantization."""
from __future__ import annotations

from pathlib import Path


def _saturation(r: int, g: int, b: int) -> float:
    rf, gf, bf = r / 255, g / 255, b / 255
    c_max = max(rf, gf, bf)
    c_min = min(rf, gf, bf)
    return (c_max - c_min) / c_max if c_max > 0 else 0.0


def extract_dominant_colors(image_path: str | Path, n: int = 8) -> list[str]:
    """
    Return up to n hex colors dominant in the image, sorted by weighted frequency.

    Skips near-black (shadow) and near-white (blown-out) pixels so the palette
    reflects the actual mid-tone brand colours present in the photo.
    """
    try:
        from PIL import Image
    except ImportError:
        return []

    try:
        img = Image.open(image_path).convert("RGB")
    except Exception:
        return []

    # Shrink for speed — 180px is enough for colour statistics
    img.thumbnail((180, 180), Image.LANCZOS)

    # Quantize to 64 colours then count pixel frequency
    quantized = img.quantize(colors=64).convert("RGB")
    freq: dict[tuple[int, int, int], int] = {}
    for pixel in quantized.getdata():
        freq[pixel] = freq.get(pixel, 0) + 1

    # Score = count weighted by saturation so we prefer colourful swatches
    scored = [
        (count * (0.25 + _saturation(r, g, b)), r, g, b)
        for (r, g, b), count in freq.items()
    ]
    scored.sort(reverse=True)

    results: list[str] = []
    for _, r, g, b in scored:
        brightness = (r + g + b) / 3
        if brightness < 38 or brightness > 218:  # skip very dark / very bright
            continue
        results.append(f"#{r:02x}{g:02x}{b:02x}")
        if len(results) >= n:
            break

    return results


def extract_colors_from_folder(folder: str | Path, max_images: int = 4, n_per_image: int = 6) -> list[str]:
    """
    Sample up to max_images images from folder (evenly spaced) and return combined dominant colours.
    Deduplicates while preserving order.
    """
    folder = Path(folder)
    images = sorted(
        [p for p in folder.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}],
        key=lambda p: p.name,
    )
    if not images:
        return []

    # Pick evenly spaced indices so we sample early, mid, and late images
    if len(images) <= max_images:
        selected = images
    else:
        step = len(images) / max_images
        selected = [images[int(i * step)] for i in range(max_images)]

    seen: set[str] = set()
    combined: list[str] = []
    for img_path in selected:
        for color in extract_dominant_colors(img_path, n=n_per_image):
            if color not in seen:
                seen.add(color)
                combined.append(color)

    return combined
