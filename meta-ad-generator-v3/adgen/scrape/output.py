from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .models import ImageCandidate, ScrapeResult


def write_info_file(result: ScrapeResult, output_dir: Path) -> None:
    lines = [
        f"Source URL: {result.source_url}",
        f"Final URL: {result.final_url}",
        f"Title: {result.title or 'unknown'}",
        f"Brand name: {result.brand_name or 'unknown'}",
        f"Language: {result.language}",
        f"Location: {result.location}",
        "",
        "Company / basic information:",
        result.company_summary,
        "",
        "Goal / purpose:",
        result.goal_summary,
        "",
        "Extended information from website pages:",
    ]
    for section_name, texts in result.text_sections.items():
        lines.extend(["", section_name + ":"])
        lines.extend(f"- {text}" for text in texts)

    sp = result.social_proof
    has_sp = any(sp.get(k) for k in ("review_snippets", "testimonial_quotes", "press_mentions", "trust_badges"))
    if has_sp:
        lines.extend(["", "Social proof found on website:"])
        for snippet in sp.get("review_snippets", []):
            lines.append(f"- [REVIEW COUNT] {snippet}")
        for quote in sp.get("testimonial_quotes", []):
            lines.append(f"- [TESTIMONIAL] {quote}")
        for mention in sp.get("press_mentions", []):
            lines.append(f"- [PRESS] As seen in: {mention}")
        for badge in sp.get("trust_badges", []):
            lines.append(f"- [BADGE] {badge}")

    (output_dir / "info.txt").write_text("\n".join(lines), encoding="utf-8")


def write_urls_file(result: ScrapeResult, output_dir: Path) -> None:
    lines = ["Scraped pages:", *result.scraped_pages, "", "Image source URLs:"]
    for group_name, images in (
        ("logos", result.logos),
        ("product_images", result.product_images),
        ("other_images", result.other_images),
    ):
        lines.extend(["", group_name + ":"])
        lines.extend(item.url for item in images)
    (output_dir / "scraped_urls.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_colors_file(colors: list[str], output_dir: Path) -> None:
    text = "\n".join(colors) if colors else "No accent colors detected."
    (output_dir / "accent_colors.txt").write_text(text + "\n", encoding="utf-8")


def write_client_memory_file(result: ScrapeResult, output_dir: Path, chat_context: str) -> None:
    lines = [
        f"Client: {result.brand_name or result.title or 'unknown'}",
        f"Website: {result.final_url}",
        f"Source URL: {result.source_url}",
        f"Language: {result.language}",
        f"Location: {result.location}",
        f"Primary logo for palette: {result.primary_logo_path or 'unknown'}",
        "",
        "Scraped assets:",
        f"- Logos: {len(result.logos)} files in logo/",
        f"- Product images: {len(result.product_images)} files in product_images/",
        f"- Other images: {len(result.other_images)} files in other_images/",
        f"- Colors: accent_colors.txt",
        f"- Page and image URLs: scraped_urls.txt",
        f"- Full structured data: manifest.json",
        "",
        "Chat context:",
        chat_context,
    ]
    (output_dir / "client_memory.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_manifest(result: ScrapeResult, output_dir: Path) -> None:
    def serialize_image(item: ImageCandidate) -> dict[str, Any]:
        return {
            "url": item.url,
            "label": item.label,
            "source": item.source,
            "kind": item.kind,
            "score": item.score,
            "downloaded_path": item.downloaded_path,
        }

    manifest = {
        "source_url": result.source_url,
        "final_url": result.final_url,
        "title": result.title,
        "brand_name": result.brand_name,
        "language": result.language,
        "location": result.location,
        "company_summary": result.company_summary,
        "goal_summary": result.goal_summary,
        "primary_logo_path": result.primary_logo_path,
        "text_sections": result.text_sections,
        "scraped_pages": result.scraped_pages,
        "accent_colors": result.colors,
        "social_proof": result.social_proof,
        "logos": [serialize_image(item) for item in result.logos],
        "product_images": [serialize_image(item) for item in result.product_images],
        "other_images": [serialize_image(item) for item in result.other_images],
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
