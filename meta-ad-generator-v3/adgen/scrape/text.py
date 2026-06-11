from __future__ import annotations

import re
from urllib.parse import urlparse

from bs4 import BeautifulSoup

from .config import ADDRESS_LABEL_RE, ADDRESS_RE, LOCATION_HINTS, SKIP_LINK_HINTS, TEXT_SECTION_KEYWORDS
from .utils import clean_text, get_meta, safe_name, unique_texts

# ── Social proof extraction ───────────────────────────────────────────────────

_REVIEW_COUNT_RE = re.compile(
    r"([\d][,\d]*\+?)\s*(?:verified\s+)?(?:five[- ]star\s+)?(?:customer\s+)?reviews?",
    re.IGNORECASE,
)
_CUSTOMER_COUNT_RE = re.compile(
    r"([\d][,\d]*\+?)\s*(?:happy\s+|satisfied\s+|active\s+)?(?:customers?|clients?|users?|members?)\b",
    re.IGNORECASE,
)
_RATING_RE = re.compile(
    r"rated?\s+#?1\b|(?:average\s+)?(?:rating|score)\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*/\s*5",
    re.IGNORECASE,
)
_KNOWN_PRESS = [
    "Forbes", "Wired", "TechCrunch", "Guardian", "New York Times", "NYT",
    "Inc.", "Fast Company", "Business Insider", "Bloomberg", "Reuters",
    "GQ", "Vogue", "Wirecutter", "The Verge",
]
_KNOWN_BADGES = [
    "Trustpilot", "G2", "Capterra", "Clutch", "AppSumo", "ProductHunt",
    "Google Reviews", "Amazon", "Yelp", "Tripadvisor",
]

_PRESS_RE = [re.compile(r"\b" + re.escape(p) + r"\b") for p in _KNOWN_PRESS]
_BADGE_RE = [re.compile(r"\b" + re.escape(b) + r"\b", re.IGNORECASE) for b in _KNOWN_BADGES]


def extract_social_proof(pages: list) -> dict:
    """Extract quantified social proof signals from scraped pages.

    Returns a dict with keys: review_snippets, testimonial_quotes,
    press_mentions, trust_badges.
    """
    review_snippets: list[str] = []
    testimonial_quotes: list[str] = []
    press_mentions: list[str] = []
    trust_badges: list[str] = []

    for page in pages:
        # ── Schema.org structured data ────────────────────────────────────────
        for block in page.json_ld:
            block_types = block.get("@type", "")
            if isinstance(block_types, str):
                block_types = [block_types]

            for block_type in block_types:
                if block_type == "Review":
                    body = block.get("reviewBody", "")
                    if isinstance(body, str) and 20 <= len(body) <= 250:
                        testimonial_quotes.append(clean_text(body))
                if block_type in ("Organization", "LocalBusiness", "Product", "Store"):
                    agg = block.get("aggregateRating")
                    if isinstance(agg, dict):
                        count = agg.get("ratingCount") or agg.get("reviewCount")
                        rating = agg.get("ratingValue")
                        if count:
                            snippet = f"{count} reviews"
                            if rating:
                                snippet += f", rated {rating}/5"
                            review_snippets.append(snippet)

        # ── HTML blockquotes / testimonial elements ───────────────────────────
        for tag in page.soup.find_all(["blockquote", "q"]):
            text = clean_text(tag.get_text(" ", strip=True))
            if 20 <= len(text) <= 250 and not is_noise_text(text):
                testimonial_quotes.append(text)

        # ── Free-text scan for counts and social proof numbers ────────────────
        text = page.soup.get_text(" ", strip=True)

        for m in _REVIEW_COUNT_RE.finditer(text):
            context_start = max(0, m.start() - 25)
            context_end = min(len(text), m.end() + 25)
            snippet = clean_text(text[context_start:context_end])
            if snippet:
                review_snippets.append(snippet)

        for m in _CUSTOMER_COUNT_RE.finditer(text):
            context_start = max(0, m.start() - 15)
            context_end = min(len(text), m.end() + 15)
            snippet = clean_text(text[context_start:context_end])
            if snippet:
                review_snippets.append(snippet)

        if _RATING_RE.search(text):
            for m in _RATING_RE.finditer(text):
                snippet = clean_text(text[max(0, m.start() - 10):m.end() + 10])
                if snippet:
                    review_snippets.append(snippet)

        # ── Press mentions ────────────────────────────────────────────────────
        for pattern, name in zip(_PRESS_RE, _KNOWN_PRESS):
            if pattern.search(text):
                press_mentions.append(name.replace("\\", ""))

        # ── Trust badges ─────────────────────────────────────────────────────
        for pattern, badge in zip(_BADGE_RE, _KNOWN_BADGES):
            if pattern.search(text):
                trust_badges.append(badge)

    return {
        "review_snippets": unique_texts(review_snippets, limit=5),
        "testimonial_quotes": unique_texts(testimonial_quotes, limit=6),
        "press_mentions": list(dict.fromkeys(m.replace("\\.", ".") for m in press_mentions))[:5],
        "trust_badges": list(dict.fromkeys(trust_badges))[:5],
    }


def extract_brand_name(soup: BeautifulSoup, json_ld: list[dict], final_url: str) -> str:
    for block in json_ld:
        block_type = block.get("@type")
        types = {str(item).lower() for item in block_type} if isinstance(block_type, list) else {str(block_type).lower()}
        if types & {"organization", "localbusiness", "corporation", "store"} and block.get("name"):
            return clean_text(str(block["name"]))

    meta_name = get_meta(soup, "og:site_name", "application-name")
    if meta_name:
        return meta_name

    title = clean_text(soup.title.string) if soup.title and soup.title.string else ""
    if title:
        return clean_text(title.split("|")[0].split("-")[0])

    return urlparse(final_url).netloc.replace("www.", "")


def brand_keywords(brand_name: str) -> tuple[str, ...]:
    base = safe_name(brand_name, "").replace("-", " ")
    words = [word for word in base.split() if len(word) >= 3]
    compact = "".join(words)
    keywords = words + ([compact] if compact else [])
    return tuple(dict.fromkeys(keywords))


def extract_language(soup: BeautifulSoup, json_ld: list[dict]) -> str:
    html_tag = soup.find("html")
    if html_tag and html_tag.get("lang"):
        return str(html_tag["lang"])
    og_locale = get_meta(soup, "og:locale")
    if og_locale:
        return og_locale.replace("_", "-")
    for block in json_ld:
        language = block.get("inLanguage")
        if isinstance(language, str):
            return language
    return "unknown"


def extract_location(soup: BeautifulSoup, json_ld: list[dict]) -> str:
    priority: list[str] = []
    locations: list[str] = []

    for block in json_ld:
        address = block.get("address")
        if isinstance(address, dict):
            parts = [
                address.get("streetAddress"),
                address.get("addressLocality"),
                address.get("addressRegion"),
                address.get("postalCode"),
                address.get("addressCountry"),
            ]
            priority.append(", ".join(clean_text(str(part)) for part in parts if part))
        elif isinstance(address, str):
            priority.append(clean_text(address))

    for line in soup.get_text("\n", strip=True).splitlines():
        lower = line.lower()
        if lower in {"kontakti", "contact", "adrese", "address", "location"}:
            continue
        if any(hint in lower for hint in SKIP_LINK_HINTS):
            continue
        if any(hint in lower for hint in LOCATION_HINTS):
            cleaned = clean_text(line)
            if 8 <= len(cleaned) <= 180 and (any(char.isdigit() for char in cleaned) or "," in cleaned):
                priority.append(cleaned)
            for match in ADDRESS_LABEL_RE.findall(line):
                if 8 <= len(clean_text(match)) <= 180:
                    priority.append(clean_text(match))
        if any(hint in lower for hint in LOCATION_HINTS) or "@" in lower or "+371" in lower:
            for match in ADDRESS_RE.findall(line):
                if 8 <= len(clean_text(match)) <= 180:
                    locations.append(clean_text(match))

    return "; ".join(unique_texts(priority + locations, limit=5)) or "unknown"


def extract_best_location(pages: list) -> str:
    contact_pages = [
        page for page in pages
        if any(hint in page.url.lower() for hint in ("contact", "kontakti", "rekviziti", "rekvizīti", "address", "adrese"))
    ]
    collected: list[str] = []
    for page in contact_pages:
        location = extract_location(page.soup, page.json_ld)
        if location != "unknown":
            collected.extend(part.strip() for part in location.split(";") if part.strip())
    if collected:
        return "; ".join(unique_texts(collected, limit=5))

    for page in pages:
        location = extract_location(page.soup, page.json_ld)
        if location != "unknown":
            return location
    return "unknown"


def extract_company_info(soup: BeautifulSoup, json_ld: list[dict], brand_name: str) -> tuple[str, str]:
    description = get_meta(soup, "description", "og:description", "twitter:description")
    for block in json_ld:
        if not description and block.get("description"):
            description = clean_text(str(block["description"]))

    summary = f"{brand_name}: {description}" if description else "unknown"
    if summary == "unknown":
        candidates = [
            clean_text(tag.get_text(" ", strip=True))
            for tag in soup.find_all(["h1", "h2", "p"])
            if 45 <= len(clean_text(tag.get_text(" ", strip=True))) <= 320
        ]
        summary = candidates[0] if candidates else "unknown"

    goal_keywords = TEXT_SECTION_KEYWORDS["Mission / vision / goals"]
    goal_candidates = []
    for tag in soup.find_all(["h1", "h2", "h3", "p", "li"]):
        text = clean_text(tag.get_text(" ", strip=True))
        lower = text.lower()
        if any(keyword in lower for keyword in goal_keywords) and 35 <= len(text) <= 320:
            goal_candidates.append(text)
    return summary, goal_candidates[0] if goal_candidates else "unknown"


def is_noise_text(text: str) -> bool:
    lower = text.lower()
    noise = (
        "cookie", "privacy policy", "accept", "read more", "lasīt vairāk", "copyright",
        "tālrunis:", "telefons", "e-pasts", "rekvizīti", "rekviziti", "bankas dati",
        "pārbaudes kods", "vārds, uzvārds", "surname", "jautājiet mums",
    )
    if any(word in lower for word in noise):
        return True
    return "?" in text and len(text) > 220


def extract_text_sections(pages: list) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {name: [] for name in TEXT_SECTION_KEYWORDS}
    sections["Useful page text"] = []

    for page in pages:
        page_title = clean_text(page.soup.title.string) if page.soup.title and page.soup.title.string else page.url
        current_heading = ""
        for tag in page.soup.find_all(["h1", "h2", "h3", "p", "li"]):
            if tag.find_parent(["header", "nav", "form"]):
                continue
            text = clean_text(tag.get_text(" ", strip=True))
            if tag.name in {"h1", "h2", "h3"} and text:
                current_heading = text
            if not (35 <= len(text) <= 500) or is_noise_text(text):
                continue

            context = f"{page_title} {page.url} {current_heading} {text}".lower()
            matched = False
            for section_name, keywords in TEXT_SECTION_KEYWORDS.items():
                if section_name == "Mission / vision / goals":
                    heading_context = f"{page_title} {page.url} {current_heading}".lower()
                    if not any(keyword in heading_context for keyword in keywords):
                        continue
                if any(keyword in context for keyword in keywords):
                    sections[section_name].append(text)
                    matched = True
            if not matched:
                sections["Useful page text"].append(text)

    return {name: unique_texts(values, limit=8) for name, values in sections.items() if unique_texts(values, limit=8)}
