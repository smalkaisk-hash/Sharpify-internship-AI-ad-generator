from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class ImageCandidate:
    url: str
    label: str = ""
    source: str = ""
    kind: str = "other"
    score: int = 0
    downloaded_path: str | None = None


@dataclass(slots=True)
class ScrapedPage:
    url: str
    soup: object
    json_ld: list[dict]


@dataclass(slots=True)
class ScrapeResult:
    source_url: str
    final_url: str
    title: str
    brand_name: str
    language: str
    location: str
    company_summary: str
    goal_summary: str
    primary_logo_path: str = ""
    text_sections: dict[str, list[str]] = field(default_factory=dict)
    scraped_pages: list[str] = field(default_factory=list)
    colors: list[str] = field(default_factory=list)
    logos: list[ImageCandidate] = field(default_factory=list)
    product_images: list[ImageCandidate] = field(default_factory=list)
    other_images: list[ImageCandidate] = field(default_factory=list)
    social_proof: dict = field(default_factory=dict)
