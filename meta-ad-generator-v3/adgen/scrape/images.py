from __future__ import annotations

import mimetypes
import re
import statistics
from collections import Counter
from io import BytesIO
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageChops, UnidentifiedImageError

from .config import (
    BACKGROUND_URL_RE,
    HEADER_HINTS,
    IMAGE_URL_EXTENSIONS,
    IMG_SOURCE_ATTRS,
    IMG_SRCSET_ATTRS,
    LOGO_HINTS,
    LOW_QUALITY_IMAGE_HINTS,
    MAX_IMAGES,
    PRODUCT_HINTS,
    REQUEST_TIMEOUT,
)
from .models import ImageCandidate
from .utils import clean_text, get_meta, safe_name


def first_srcset_url(srcset: str) -> str:
    best_url = ""
    best_score = -1.0
    for part in (srcset or "").split(","):
        tokens = part.strip().split()
        if not tokens:
            continue
        score = 1.0
        if len(tokens) > 1:
            descriptor = tokens[1].lower()
            try:
                score = float(descriptor[:-1]) if descriptor.endswith("w") else float(descriptor[:-1]) * 1000
            except ValueError:
                score = 1.0
        if score > best_score:
            best_url, best_score = tokens[0], score
    return best_url


def high_quality_url_variants(url: str) -> list[str]:
    parsed = urlparse(url)
    variants = [url]
    for old in ("/thumbs/", "/thumb/", "/thumbnails/", "/thumbnail/", "/small/", "/preview/", "/previews/"):
        if old in parsed.path.lower():
            variants.append(urlunparse(parsed._replace(path=re.sub(re.escape(old), "/", parsed.path, flags=re.I))))
    no_size = re.sub(r"-(?:\d{2,5})x(?:\d{2,5})(?=\.[A-Za-z]{3,5}$)", "", parsed.path)
    if no_size != parsed.path:
        variants.append(urlunparse(parsed._replace(path=no_size)))
    query = [(k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=True) if k.lower() not in {"w", "width", "h", "height", "fit", "crop", "resize"}]
    if len(query) != len(parse_qsl(parsed.query, keep_blank_values=True)):
        variants.append(urlunparse(parsed._replace(query=urlencode(query))))
    return list(dict.fromkeys(variants))


def element_attr_text(element) -> str:
    return " ".join(str(element.get(attr, "")) for attr in ("class", "id", "role", "aria-label", "title", "alt", "href")).lower()


def is_inside_header(element) -> bool:
    for parent in getattr(element, "parents", []):
        if getattr(parent, "name", "") in {"header", "nav"}:
            return True
        if any(hint in element_attr_text(parent) for hint in HEADER_HINTS):
            return True
    return False


def links_to_homepage(element, base_url: str) -> bool:
    link = element.find_parent("a", href=True)
    if not link:
        return False
    href = urljoin(base_url, str(link.get("href", "")))
    base = urlparse(base_url)
    parsed = urlparse(href)
    return parsed.netloc == base.netloc and parsed.path.rstrip("/") in {"", "/"}


def looks_like_image_url(url: str) -> bool:
    return urlparse(url).path.lower().endswith(IMAGE_URL_EXTENSIONS)


def image_urls_from_tag(img) -> list[str]:
    urls: list[str] = []
    for attr in IMG_SOURCE_ATTRS:
        value = str(img.get(attr, "")).strip()
        if value:
            urls.extend(high_quality_url_variants(value))
    for attr in IMG_SRCSET_ATTRS:
        value = first_srcset_url(str(img.get(attr, "")))
        if value:
            urls.extend(high_quality_url_variants(value))
    return list(dict.fromkeys(urls))


def add_image_candidate(candidates: dict[str, ImageCandidate], url: str, base_url: str, label: str, source: str, kind: str, score: int, brand_keywords: tuple[str, ...]) -> None:
    if not url or url.startswith("data:"):
        return
    absolute_url = urljoin(base_url, url)
    parsed = urlparse(absolute_url)
    if parsed.scheme not in {"http", "https"}:
        return

    haystack = f"{parsed.path} {parsed.query} {label}".lower()
    if kind != "logo" and any(hint in haystack for hint in PRODUCT_HINTS):
        kind, score = "product", score + 25
    if kind != "logo" and any(hint in haystack for hint in LOW_QUALITY_IMAGE_HINTS):
        score -= 35
    if brand_keywords and any(keyword in haystack for keyword in brand_keywords):
        score += 45
        if any(hint in haystack for hint in LOGO_HINTS) and kind != "product":
            kind = "logo"

    existing = candidates.get(absolute_url)
    if existing:
        if score > existing.score:
            existing.score, existing.kind, existing.label, existing.source = score, kind, label or existing.label, source
        return
    candidates[absolute_url] = ImageCandidate(absolute_url, label, source, kind, score)


def extract_images(soup: BeautifulSoup, base_url: str, json_ld: list[dict], brand_keywords: tuple[str, ...]) -> list[ImageCandidate]:
    candidates: dict[str, ImageCandidate] = {}

    for meta_name in ("og:image", "og:image:url", "og:image:secure_url", "twitter:image", "image"):
        image_url = get_meta(soup, meta_name)
        if image_url:
            add_image_candidate(candidates, image_url, base_url, meta_name, "meta", "other", 55, brand_keywords)

    for link in soup.find_all("link"):
        rel = " ".join(link.get("rel", []) if isinstance(link.get("rel"), list) else [str(link.get("rel", ""))])
        href = str(link.get("href", ""))
        if href and any(hint in rel.lower() for hint in ("icon", "apple-touch-icon", "mask-icon")):
            add_image_candidate(candidates, href, base_url, "site-icon", "link", "logo", 70, brand_keywords)

    for block in json_ld:
        logo = block.get("logo")
        if isinstance(logo, str):
            add_image_candidate(candidates, logo, base_url, "structured-logo", "json-ld", "logo", 110, brand_keywords)
        elif isinstance(logo, dict):
            add_image_candidate(candidates, str(logo.get("url", "")), base_url, "structured-logo", "json-ld", "logo", 110, brand_keywords)
        image = block.get("image")
        image_values = image if isinstance(image, list) else [image]
        for value in image_values:
            if isinstance(value, str):
                add_image_candidate(candidates, value, base_url, "structured-image", "json-ld", "product", 70, brand_keywords)
            elif isinstance(value, dict):
                add_image_candidate(candidates, str(value.get("url", "")), base_url, "structured-image", "json-ld", "product", 70, brand_keywords)

    for source in soup.find_all("source"):
        srcset_url = first_srcset_url(str(source.get("srcset") or source.get("data-srcset") or ""))
        if srcset_url:
            parent = source.find_parent(["picture", "figure", "div", "section", "article"])
            attrs = f"{element_attr_text(source)} {element_attr_text(parent) if parent else ''}"
            kind = "product" if any(hint in attrs for hint in PRODUCT_HINTS) else "other"
            score = 60 if kind == "product" else 35
            for variant in high_quality_url_variants(srcset_url):
                add_image_candidate(candidates, variant, base_url, Path(urlparse(variant).path).stem, "source-srcset", kind, score, brand_keywords)

    for img in soup.find_all("img"):
        image_urls = image_urls_from_tag(img)
        src = image_urls[0] if image_urls else ""
        attrs = " ".join(str(img.get(attr, "")) for attr in ("alt", "title", "class", "id", *IMG_SOURCE_ATTRS, *IMG_SRCSET_ATTRS))
        lower_attrs = attrs.lower()
        in_header = is_inside_header(img)
        kind, score = "other", 20
        if in_header and (links_to_homepage(img, base_url) or any(hint in lower_attrs for hint in LOGO_HINTS) or any(k in lower_attrs for k in brand_keywords)):
            kind, score = "logo", 140
        elif any(hint in lower_attrs for hint in LOGO_HINTS):
            kind, score = "logo", 90
        elif any(hint in lower_attrs for hint in PRODUCT_HINTS):
            kind, score = "product", 60

        parent = img.find_parent(["a", "figure", "div", "section", "article"])
        if parent and any(hint in element_attr_text(parent) for hint in PRODUCT_HINTS) and kind != "logo":
            kind, score = "product", score + 25
        if parent and parent.name == "a" and parent.get("href") and looks_like_image_url(str(parent.get("href"))):
            linked_url = str(parent.get("href"))
            label = clean_text(str(img.get("alt") or img.get("title") or Path(urlparse(linked_url).path).stem))
            add_image_candidate(candidates, linked_url, base_url, label, "header-linked-image" if in_header else "linked-image", kind, score + 30, brand_keywords)

        label = clean_text(str(img.get("alt") or img.get("title") or Path(urlparse(str(src)).path).stem))
        for offset, image_url in enumerate(image_urls):
            add_image_candidate(candidates, image_url, base_url, label, "header-img" if in_header else "img", kind, score - offset, brand_keywords)

    for tag in soup.find_all(style=True):
        in_header = is_inside_header(tag)
        attrs = element_attr_text(tag)
        kind = "logo" if in_header and (any(h in attrs for h in LOGO_HINTS) or any(k in attrs for k in brand_keywords)) else ("product" if any(h in attrs for h in PRODUCT_HINTS) else "other")
        score = 125 if kind == "logo" else (45 if kind == "product" else 25)
        for match in BACKGROUND_URL_RE.finditer(str(tag.get("style", ""))):
            for variant in high_quality_url_variants(match.group(2).strip()):
                add_image_candidate(candidates, variant, base_url, Path(urlparse(variant).path).stem, "header-style" if in_header else "inline-style", kind, score, brand_keywords)

    for tag in soup.find_all(attrs={"data-bg": True}):
        image_url = str(tag.get("data-bg", "")).strip()
        attrs = element_attr_text(tag)
        kind = "product" if any(hint in attrs for hint in PRODUCT_HINTS) else "other"
        score = 50 if kind == "product" else 30
        for variant in high_quality_url_variants(image_url):
            add_image_candidate(candidates, variant, base_url, Path(urlparse(variant).path).stem, "data-bg", kind, score, brand_keywords)

    for attr_name in ("data-background", "data-background-image"):
        for tag in soup.find_all(attrs={attr_name: True}):
            image_url = str(tag.get(attr_name, "")).strip()
            attrs = element_attr_text(tag)
            kind = "product" if any(hint in attrs for hint in PRODUCT_HINTS) else "other"
            score = 50 if kind == "product" else 30
            for variant in high_quality_url_variants(image_url):
                add_image_candidate(candidates, variant, base_url, Path(urlparse(variant).path).stem, attr_name, kind, score, brand_keywords)

    for style in soup.find_all("style"):
        for match in BACKGROUND_URL_RE.finditer(style.get_text(" ", strip=True)):
            image_url = match.group(2).strip()
            kind = "product" if any(hint in image_url.lower() for hint in PRODUCT_HINTS) else "other"
            score = 40 if kind == "product" else 25
            for variant in high_quality_url_variants(image_url):
                add_image_candidate(candidates, variant, base_url, Path(urlparse(variant).path).stem, "style", kind, score, brand_keywords)

    ranked = sorted(candidates.values(), key=lambda item: item.score, reverse=True)
    return ranked[:MAX_IMAGES]


def choose_logo_candidates(images: list[ImageCandidate], limit: int = 12) -> list[ImageCandidate]:
    logo_images = [item for item in images if item.kind == "logo"]
    if not logo_images:
        return images[: min(limit, len(images))]

    buckets = [
        [item for item in logo_images if item.source.startswith("header")],
        [item for item in logo_images if item.source == "json-ld"],
        [item for item in logo_images if item.source == "meta"],
        [item for item in logo_images if item.source == "link"],
        [item for item in logo_images if item.source not in {"json-ld", "meta", "link"} and not item.source.startswith("header")],
    ]
    selected: list[ImageCandidate] = []
    seen: set[str] = set()
    for bucket in buckets:
        for item in bucket:
            if item.url in seen:
                continue
            selected.append(item)
            seen.add(item.url)
            if len(selected) >= limit:
                return selected
    return selected


_FLAG_WORDS = ("flag", "karogs", "country", "nation", "lang-flag", "language-flag")


def choose_primary_logo_for_palette(logos: list[ImageCandidate], brand_keywords: tuple[str, ...]) -> ImageCandidate | None:
    if not logos:
        return None

    def identity_haystack(item: ImageCandidate) -> str:
        return f"{item.url} {item.label} {item.source} {item.downloaded_path or ''}".lower()

    non_flag_logos = [item for item in logos if not any(word in identity_haystack(item) for word in _FLAG_WORDS)]
    logos = non_flag_logos if non_flag_logos else logos

    has_strong_identity = any(
        item.source.startswith("header")
        or item.source == "json-ld"
        or any(keyword in identity_haystack(item) for keyword in brand_keywords)
        for item in logos
    )
    if not has_strong_identity:
        return None

    def score_logo(item: ImageCandidate) -> float:
        haystack = identity_haystack(item)
        score = float(item.score)

        if item.source.startswith("header"):
            score += 140
        if item.source == "json-ld":
            score += 80
        if any(keyword in haystack for keyword in brand_keywords):
            score += 220
        if "logo" in haystack or "brand" in haystack:
            score += 80

        weak_logo_words = ("site-icon", "favicon", "fav.", "/fav", "apple-touch", "icon", "flag", "language", "lang", "translate")
        if any(word in haystack for word in weak_logo_words):
            score -= 220

        if item.downloaded_path:
            try:
                image = Image.open(item.downloaded_path)
                width, height = image.size
                ratio = width / max(height, 1)
                area = width * height
                score += min(area / 12000, 80)
                if 2.0 <= ratio <= 12.0:
                    score += 90
                elif 0.75 <= ratio <= 1.35:
                    score -= 120
            except (UnidentifiedImageError, OSError):
                pass

        return score

    return max(logos, key=score_logo)


def guess_extension(url: str, content_type: str) -> str:
    extension = Path(urlparse(url).path).suffix.lower()
    if extension and len(extension) <= 6:
        return extension
    return mimetypes.guess_extension(content_type.split(";")[0].strip()) or ".img"


def trim_and_scale_logo(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha_bbox = rgba.getchannel("A").getbbox()
    if alpha_bbox:
        rgba = rgba.crop(alpha_bbox)
    else:
        bg = Image.new("RGBA", rgba.size, rgba.getpixel((0, 0)))
        bbox = ImageChops.difference(rgba, bg).getbbox()
        if bbox:
            rgba = rgba.crop(bbox)

    padding = max(12, int(max(rgba.size) * 0.08))
    canvas = Image.new("RGBA", (rgba.width + padding * 2, rgba.height + padding * 2), (255, 255, 255, 0))
    canvas.paste(rgba, (padding, padding), rgba)
    min_width, min_height = 600, 180
    scale = max(1.0, min_width / canvas.width, min_height / canvas.height)
    if scale > 1.0:
        canvas = canvas.resize((int(canvas.width * scale), int(canvas.height * scale)), Image.Resampling.LANCZOS)
    return canvas


def download_image(session: requests.Session, candidate: ImageCandidate, folder: Path, index: int) -> Path | None:
    try:
        response = session.get(candidate.url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
    except requests.RequestException:
        return None

    content_type = response.headers.get("content-type", "")
    if "image" not in content_type and not Path(urlparse(candidate.url).path).suffix:
        return None

    extension = guess_extension(candidate.url, content_type)
    label = safe_name(candidate.label or Path(urlparse(candidate.url).path).stem, candidate.kind)
    is_svg = extension == ".svg" or "svg" in content_type.lower()
    output_extension = ".svg" if is_svg else ".png"
    path = folder / f"{index:03d}-{label}{output_extension}"

    if is_svg:
        path.write_bytes(response.content)
    else:
        try:
            image = Image.open(BytesIO(response.content))
            if candidate.kind != "logo" and (image.width < 300 or image.height < 200):
                return None
            image = trim_and_scale_logo(image) if candidate.kind == "logo" else image.convert("RGBA")
            image.save(path, format="PNG")
        except (UnidentifiedImageError, OSError):
            return None

    candidate.downloaded_path = str(path)
    return path


def extract_colors_from_image(path: Path, limit: int = 5) -> list[str]:
    if path.suffix.lower() == ".svg":
        return []
    try:
        image = Image.open(path).convert("RGB")
    except (UnidentifiedImageError, OSError):
        return []
    image.thumbnail((180, 180))
    pixels = []
    for red, green, blue in image.getdata():
        brightness = statistics.mean((red, green, blue))
        if 20 <= brightness <= 245:
            pixels.append((red // 32 * 32, green // 32 * 32, blue // 32 * 32))
    return [f"#{r:02x}{g:02x}{b:02x}" for (r, g, b), _count in Counter(pixels).most_common(limit)]


def extract_css_colors_from_text(css_text: str) -> list[str]:
    return re.findall(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b", css_text or "")


def extract_background_css_colors_from_text(css_text: str) -> list[str]:
    colors: list[str] = []
    for match in re.finditer(r"background(?:-color)?\s*:[^;{}]*", css_text or "", flags=re.I):
        colors.extend(extract_css_colors_from_text(match.group(0)))
    return colors


def choose_accent_colors(background_colors: list[str], logo_colors: list[str]) -> list[str]:
    ignored = {"#000000", "#ffffff", "#f8f8f8", "#f9f9f9", "#eeeeee", "#eaeaea"}

    def normalize(color: str) -> str:
        color = color.lower()
        return "#" + "".join(ch * 2 for ch in color[1:]) if len(color) == 4 else color

    def ranked(colors: list[str]) -> list[str]:
        normalized = [normalize(color) for color in colors]
        return [color for color, _count in Counter(c for c in normalized if c not in ignored).most_common()]

    palette: list[str] = []
    for color in ranked(background_colors):
        if color not in palette:
            palette.append(color)
        if len(palette) >= 8:
            return palette

    for color in ranked(logo_colors):
        if color not in palette:
            palette.append(color)
        if len(palette) >= 8:
            return palette

    return palette
