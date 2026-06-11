from __future__ import annotations

import json
import re
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

from .config import REQUEST_TIMEOUT, USER_AGENT


RequestException = requests.RequestException


def ensure_dependencies() -> None:
    try:
        import bs4  # noqa: F401
        import PIL  # noqa: F401
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "Missing dependencies. Install them with:\n"
            "  pip install -r requirements.txt\n"
            "or:\n"
            "  pip install requests beautifulsoup4 Pillow"
        ) from exc


def normalize_url(raw_url: str) -> str:
    raw_url = raw_url.strip()
    if not re.match(r"^https?://", raw_url, flags=re.I):
        raw_url = "https://" + raw_url
    return raw_url


def safe_name(text: str, fallback: str = "item", max_length: int = 80) -> str:
    text = re.sub(r"https?://", "", text.strip().lower())
    text = re.sub(r"\.(png|jpe?g|webp|gif|svg|avif)$", "", text, flags=re.I)
    text = re.sub(r"[^a-z0-9._-]+", "-", text)
    text = re.sub(r"-{2,}", "-", text).strip("-._")
    return (text or fallback)[:max_length].strip("-._") or fallback


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def unique_texts(values: list[str], limit: int = 12) -> list[str]:
    unique: list[str] = []
    seen: set[str] = set()
    for value in values:
        cleaned = clean_text(value)
        key = cleaned.lower()
        if cleaned and key not in seen:
            unique.append(cleaned)
            seen.add(key)
        if len(unique) >= limit:
            break
    return unique


def make_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept": "text/html,*/*"})
    return session


def fetch_html(session: requests.Session, url: str) -> tuple[str, str]:
    response = session.get(url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    content_type = response.headers.get("content-type", "").lower()
    if "charset=" in content_type:
        return response.text, response.url
    try:
        return response.content.decode("utf-8"), response.url
    except UnicodeDecodeError:
        if response.apparent_encoding:
            response.encoding = response.apparent_encoding
        return response.text, response.url


def get_meta(soup: BeautifulSoup, *names: str) -> str:
    lowered = {name.lower() for name in names}
    for tag in soup.find_all("meta"):
        keys = {
            str(tag.get("name", "")).lower(),
            str(tag.get("property", "")).lower(),
            str(tag.get("itemprop", "")).lower(),
        }
        if keys & lowered and tag.get("content"):
            return clean_text(str(tag["content"]))
    return ""


def extract_json_ld(soup: BeautifulSoup) -> list:
    blocks: list = []
    for script in soup.find_all("script", type=lambda value: value and "ld+json" in value):
        raw = script.string or script.get_text(strip=True)
        if not raw:
            continue
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            continue
        blocks.extend(parsed if isinstance(parsed, list) else [parsed])
    return blocks


def flatten_json_ld(items: list) -> list[dict]:
    flattened: list[dict] = []

    def walk(value) -> None:
        if isinstance(value, dict):
            flattened.append(value)
            graph = value.get("@graph")
            if isinstance(graph, list):
                for item in graph:
                    walk(item)
        elif isinstance(value, list):
            for item in value:
                walk(item)

    walk(items)
    return flattened


def domain_slug(url: str) -> str:
    parsed = urlparse(url)
    return safe_name(parsed.netloc.replace("www.", ""), "website")
