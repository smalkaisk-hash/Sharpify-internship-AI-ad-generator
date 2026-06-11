"""Stage 3 — pick the catalog palette nearest to the scraped accent colors."""
from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from adgen import paths
from adgen.palette.catalog import Palette, load_catalog
from adgen.palette.image_colors import extract_colors_from_folder


CATALOG_PATH = Path(__file__).parent / "data" / "palettes-neutral.md"

DEFAULT_FALLBACK_COLORS = ["#888888", "#cccccc", "#f5f5f5"]

# Maps broad industry keywords (lowercased) to use_for tag fragments for category detection.
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "travel":       ["travel", "ceļojum", "tour", "vacation", "holiday", "trip", "destination",
                     "flight", "hotel", "resort", "beach", "maršrut", "atpūt", "tūrism", "viesn"],
    "beauty":       ["beauty", "wellness", "cosmetics", "spa", "salon", "skin", "āda", "skaistum"],
    "luxury":       ["luxury", "premium", "luksus", "ekskluzīv"],
    "fitness":      ["gym", "fitness", "crossfit", "pilates", "yoga", "workout", "personal trainer",
                     "sporta zāl", "trenažier", "fitnesa", "treniņ"],
    "pets":         ["veterinary", "vet clinic", "pet shop", "pet care", "dog training", "animal shelter",
                     "veterinār", "mājas dzīvnieks", "suņ", "kaķ", "zoovet"],
    "health":       ["health", "medical", "clinic", "klīnik", "veselīb", "pharmacy", "aptieka"],
    "food":         ["food", "restaurant", "café", "cafe", "restorān", "ēdien", "catering", "bakery",
                     "maizn", "konditorejas"],
    "real-estate":  ["real estate", "property", "realty", "apartment", "mortgage", "housing",
                     "nekustam", "dzīvokl", "māj", "īpašum", "rent", "īre", "developer", "būvniek"],
    "automotive":   ["car", "vehicle", "dealership", "auto repair", "car service", "automašīn",
                     "autoserviss", "autoīre", "autosalons", "wheel", "tire", "riepa"],
    "education":    ["school", "course", "training", "academy", "university", "e-learning", "tutor",
                     "skol", "kurs", "akadēmij", "apmācīb", "izglītīb", "sertifikāt"],
    "finance":      ["bank", "insurance", "loan", "invest", "fintech", "mortgage", "credit",
                     "apdrošināšan", "kredīt", "ieguldījum", "finanses", "pensij", "savings"],
    "fashion":      ["fashion", "clothing", "apparel", "collection", "boutique", "wear",
                     "mode", "apģērb", "kolekcij", "drēb"],
    "home":         ["furniture", "interior design", "decor", "renovation", "flooring", "curtains",
                     "mēbel", "interjers", "remont", "dizains", "grīd", "logiem"],
    "events":       ["wedding", "event", "venue", "photography", "photo studio", "videography",
                     "kāzas", "pasākum", "fotogrāf", "videograf", "birthday", "corporate event"],
    "legal":        ["law", "legal", "notary", "attorney", "juridisk", "advokāt", "notārs",
                     "tiesisk", "jurists"],
    "b2b":          ["b2b", "business", "corporate", "staffing", "recruitment", "uzņēmum"],
    "tech":         ["saas", "software", "app", "platform", "digital", "programm", "tehnoloģij"],
    "industrial":   [
        "construction", "manufacturing", "logistics", "būvniecīb", "loģistik",
        "safety", "drošīb", "aizsardz", "augstum", "alpīnism", "alpinism",
        "fall protection", "height", "scaffold", "industrial", "facility",
        "warehouse", "installation", "inspection", "certif",
    ],
    "retail":       ["shop", "store", "e-commerce", "veikals"],
}

# Maps detected category to use_for fragments that warrant a score boost.
USE_FOR_BOOST: dict[str, list[str]] = {
    "travel":       ["travel", "lifestyle", "outdoor", "adventure", "clean", "water"],
    "beauty":       ["beauty", "wellness", "cosmetics", "spa", "luxury", "feminine"],
    "luxury":       ["luxury", "premium", "beauty", "fashion"],
    "fitness":      ["fitness", "sport", "health", "active", "energetic", "bold"],
    "health":       ["wellness", "health", "medical", "clean"],
    "food":         ["food", "warm", "restaurant", "appetite"],
    "real-estate":  ["real estate", "luxury", "home", "property", "clean", "minimal"],
    "automotive":   ["automotive", "industrial", "clean", "professional", "bold"],
    "education":    ["education", "professional", "clean", "corporate", "fresh"],
    "finance":      ["finance", "corporate", "professional", "clean", "premium"],
    "fashion":      ["fashion", "luxury", "lifestyle", "premium", "feminine", "editorial"],
    "home":         ["home", "interior", "lifestyle", "warm", "clean", "minimal"],
    "events":       ["events", "luxury", "lifestyle", "warm", "feminine", "premium", "wedding"],
    "legal":        ["legal", "corporate", "professional", "b2b", "business"],
    "pets":         ["lifestyle", "warm", "clean", "fresh", "friendly"],
    "b2b":          ["b2b", "corporate", "professional", "business"],
    "tech":         ["tech", "saas", "software", "digital", "minimal"],
    "industrial":   ["industrial", "construction", "heavy", "utilitarian", "b2b", "professional services", "safety"],
    "retail":       ["retail", "e-commerce", "product", "consumer"],
}

# Subtracted from palette distance when use_for matches the detected category.
CATEGORY_BOOST = 60.0


@dataclass
class Candidate:
    palette: Palette
    distance: float


# ── Color space conversions ────────────────────────────────────────────────

def hex_to_rgb(value: str) -> tuple[int, int, int]:
    text = value.lstrip("#")
    if len(text) == 3:
        text = "".join(c * 2 for c in text)
    return int(text[0:2], 16), int(text[2:4], 16), int(text[4:6], 16)


def _linearize(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _f(t: float) -> float:
    return t ** (1 / 3) if t > 0.008856 else (7.787 * t + 16 / 116)


def rgb_to_lab(r: int, g: int, b: int) -> tuple[float, float, float]:
    """Convert sRGB (0–255) to CIE L*a*b* using the D65 illuminant."""
    rl, gl, bl = _linearize(r / 255), _linearize(g / 255), _linearize(b / 255)
    x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047
    y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) / 1.00000
    z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883
    L = 116 * _f(y) - 16
    a = 500 * (_f(x) - _f(y))
    b_val = 200 * (_f(y) - _f(z))
    return L, a, b_val


def lab_distance(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(3)))


# ── Category detection ────────────────────────────────────────────────────

def detect_category(manifest: dict) -> str | None:
    """Infer the broadest brand industry from manifest text fields."""
    text = " ".join(filter(None, [
        manifest.get("company_summary", ""),
        manifest.get("goal_summary", ""),
        manifest.get("brand_name", ""),
        " ".join(
            item
            for section in manifest.get("text_sections", {}).values()
            for item in (section if isinstance(section, list) else [])
        ),
    ])).lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return category
    return None


def _use_for_matches(palette: Palette, category: str) -> bool:
    use_for_lower = palette.use_for.lower()
    return any(tag in use_for_lower for tag in USE_FOR_BOOST.get(category, []))


# ── Scoring ────────────────────────────────────────────────────────────────

def palette_distance(palette: Palette, scraped_labs: list[tuple[float, float, float]]) -> float:
    """Sum of nearest-swatch CIE Lab distances for each scraped color."""
    swatch_labs = [
        rgb_to_lab(*hex_to_rgb(s))
        for s in palette.all_swatches
        if s.startswith("#")
    ]
    if not swatch_labs:
        return float("inf")
    return sum(
        min(lab_distance(scraped, swatch) for swatch in swatch_labs)
        for scraped in scraped_labs
    )


def pick_nearest(
    scraped: list[tuple[float, float, float]],
    palettes: list[Palette],
    category: str | None = None,
    top_n: int = 5,
) -> tuple[Palette, list[Candidate]]:
    candidates = []
    for p in palettes:
        dist = palette_distance(p, scraped)
        if category and _use_for_matches(p, category):
            dist -= CATEGORY_BOOST
        candidates.append(Candidate(p, dist))
    candidates.sort(key=lambda c: c.distance)
    return candidates[0].palette, candidates[:top_n]


# ── Output helpers ─────────────────────────────────────────────────────────

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

    raw = [
        line.strip()
        for line in accent_file.read_text(encoding="utf-8").splitlines()
        if line.strip().startswith("#")
    ]

    # Detect brand category from manifest for use_for scoring.
    manifest_file = paths.scrape_dir(domain) / "manifest.json"
    category: str | None = None
    if manifest_file.exists():
        try:
            manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
            category = detect_category(manifest)
        except Exception:
            pass

    # Augment CSS colours with colours extracted from actual product photography.
    # Image colours go first — they reflect visual aesthetics better than CSS UI colours.
    product_dir = paths.scrape_dir(domain) / "product_images"
    if product_dir.exists():
        img_colors = extract_colors_from_folder(product_dir, max_images=4, n_per_image=6)
        if img_colors:
            print(f"[palette] Extracted {len(img_colors)} colours from product images.")
            # Merge: image colours first, then any CSS colours not already present
            img_set = set(img_colors)
            raw = img_colors + [c for c in raw if c not in img_set]

    used_fallback = False
    if not raw:
        print(f"[palette] No colors found; using neutral fallback.")
        raw = list(DEFAULT_FALLBACK_COLORS)
        used_fallback = True

    scraped_labs = [rgb_to_lab(*hex_to_rgb(c)) for c in raw]
    palettes = load_catalog(catalog_path)
    chosen, shortlist = pick_nearest(scraped_labs, palettes, category=category, top_n=5)

    palette_dir = paths.palette_dir(domain)
    palette_dir.mkdir(parents=True, exist_ok=True)

    # Respect manually image-matched palettes — don't overwrite them.
    existing = palette_dir / "chosen.json"
    if existing.exists():
        try:
            existing_data = json.loads(existing.read_text(encoding="utf-8"))
            if existing_data.get("source") == "image-match":
                print(f"[palette] Skipping — {domain} has an image-matched palette ({existing_data.get('name')}). Delete chosen.json to force re-pick.")
                return
        except Exception:
            pass

    chosen_payload = _palette_to_dict(chosen, shortlist[0].distance, raw)
    if used_fallback:
        chosen_payload["fallback_used"] = True
    if category:
        chosen_payload["detected_category"] = category

    (palette_dir / "chosen.json").write_text(
        json.dumps(chosen_payload, indent=2, ensure_ascii=False),
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
    if category:
        print(f"[palette] Detected category: {category}")
    print(f"[palette] Chosen: {chosen.name} (distance={shortlist[0].distance:.1f})")
