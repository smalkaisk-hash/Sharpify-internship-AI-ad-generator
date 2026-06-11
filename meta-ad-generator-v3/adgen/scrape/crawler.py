from __future__ import annotations

import shutil
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from .config import DEFAULT_OUTPUT_ROOT, INTERNAL_PAGE_HINTS, MAX_IMAGES, MAX_PAGES, REQUEST_TIMEOUT, SKIP_LINK_HINTS
from .ai_colors import extract_colors_via_ai
from .images import choose_accent_colors, choose_logo_candidates, choose_primary_logo_for_palette, download_image, extract_background_css_colors_from_text, extract_colors_from_image, extract_images, is_inside_header
from .models import ImageCandidate, ScrapedPage, ScrapeResult
from .output import write_client_memory_file, write_colors_file, write_info_file, write_manifest, write_urls_file
from .text import brand_keywords, extract_best_location, extract_brand_name, extract_company_info, extract_language, extract_social_proof, extract_text_sections
from .utils import clean_text, domain_slug, extract_json_ld, fetch_html, flatten_json_ld, get_meta, make_session, normalize_url


def extract_internal_links(soup: BeautifulSoup, base_url: str, limit: int) -> list[str]:
    base = urlparse(base_url)
    candidates: list[tuple[int, str]] = []
    seen = {base_url.rstrip("/")}
    for link in soup.find_all("a", href=True):
        absolute_url = urljoin(base_url, str(link["href"])).split("#")[0]
        parsed = urlparse(absolute_url)
        if parsed.scheme not in {"http", "https"} or parsed.netloc != base.netloc:
            continue
        lower_url = absolute_url.lower()
        if any(hint in lower_url for hint in SKIP_LINK_HINTS):
            continue
        if parsed.path.lower().endswith((".pdf", ".zip", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".webp")):
            continue
        normalized = absolute_url.rstrip("/")
        if normalized in seen:
            continue
        seen.add(normalized)

        link_text = clean_text(link.get_text(" ", strip=True)).lower()
        haystack = f"{parsed.path.lower()} {link_text}"
        score = 1 + sum(12 for hint in INTERNAL_PAGE_HINTS if hint in haystack)
        candidates.append((score, normalized))

    return [url for _score, url in sorted(candidates, key=lambda item: item[0], reverse=True)[: max(0, limit)]]


def collect_site_pages(session: requests.Session, start_url: str, first_soup: BeautifulSoup, first_json_ld: list[dict], max_pages: int) -> list[ScrapedPage]:
    pages = [ScrapedPage(start_url, first_soup, first_json_ld)]
    seen = {start_url.rstrip("/")}
    queue = extract_internal_links(first_soup, start_url, max_pages * 2)

    while queue and len(pages) < max_pages:
        page_url = queue.pop(0)
        normalized = page_url.rstrip("/")
        if normalized in seen:
            continue
        seen.add(normalized)
        try:
            page_html, resolved_url = fetch_html(session, page_url)
        except requests.RequestException:
            continue
        page_soup = BeautifulSoup(page_html, "html.parser")
        page_json_ld = flatten_json_ld(extract_json_ld(page_soup))
        pages.append(ScrapedPage(resolved_url, page_soup, page_json_ld))
        for new_url in extract_internal_links(page_soup, resolved_url, max_pages):
            if new_url.rstrip("/") not in seen and new_url not in queue:
                queue.append(new_url)
    return pages


def merge_image_candidate(candidates: dict[str, ImageCandidate], candidate: ImageCandidate) -> None:
    existing = candidates.get(candidate.url)
    if existing and candidate.score > existing.score:
        existing.score, existing.kind, existing.label, existing.source = candidate.score, candidate.kind, candidate.label, candidate.source
    elif not existing:
        candidates[candidate.url] = candidate


def extract_stylesheet_urls(soup: BeautifulSoup, base_url: str) -> list[str]:
    urls: list[str] = []
    for link in soup.find_all("link", href=True):
        rel = " ".join(link.get("rel", []) if isinstance(link.get("rel"), list) else [str(link.get("rel", ""))])
        if "stylesheet" in rel.lower():
            urls.append(urljoin(base_url, str(link["href"])))
    return list(dict.fromkeys(urls))


def scrape_site(url: str, output_root: Path = DEFAULT_OUTPUT_ROOT, max_images: int = MAX_IMAGES, max_pages: int = MAX_PAGES, clear_existing: bool = True) -> Path:
    session = make_session()
    source_url = normalize_url(url)
    html, final_url = fetch_html(session, source_url)
    soup = BeautifulSoup(html, "html.parser")
    json_ld = flatten_json_ld(extract_json_ld(soup))
    pages = collect_site_pages(session, final_url, soup, json_ld, max_pages)

    output_dir = output_root / domain_slug(final_url) / "scrape"
    if clear_existing and output_dir.exists():
        shutil.rmtree(output_dir)
    logo_dir = output_dir / "logo"
    product_dir = output_dir / "product_images"
    other_dir = output_dir / "other_images"
    for folder in (logo_dir, product_dir, other_dir):
        folder.mkdir(parents=True, exist_ok=True)

    combined_json_ld = [block for page in pages for block in page.json_ld]
    brand_name = extract_brand_name(soup, combined_json_ld, final_url)
    keywords = brand_keywords(brand_name)
    title = clean_text(soup.title.string) if soup.title and soup.title.string else ""
    language = extract_language(soup, combined_json_ld)
    location = extract_best_location(pages)
    company_summary, goal_summary = extract_company_info(soup, combined_json_ld, brand_name)
    text_sections = extract_text_sections(pages)
    social_proof = extract_social_proof(pages)

    image_map: dict[str, ImageCandidate] = {}
    for page in pages:
        for image in extract_images(page.soup, page.url, page.json_ld, keywords):
            merge_image_candidate(image_map, image)
    images = sorted(image_map.values(), key=lambda item: item.score, reverse=True)[:max_images]
    logos = choose_logo_candidates(images)
    products = [item for item in images if item.kind == "product"][:35]
    others = images[:max_images]

    downloaded_paths: list[Path] = []
    downloaded_logos = _download_group(session, logos, logo_dir, downloaded_paths)
    downloaded_products = _download_group(session, products, product_dir, downloaded_paths)
    downloaded_others = _download_group(session, others, other_dir, downloaded_paths)

    background_colors: list[str] = []
    for page in pages:
        # meta theme-color is the most explicit brand color signal
        theme_color = get_meta(page.soup, "theme-color")
        if theme_color and theme_color.strip().startswith("#"):
            background_colors.append(theme_color.strip())
        # inline style attributes on header/nav elements
        for tag in page.soup.find_all(style=True):
            if is_inside_header(tag):
                background_colors.extend(extract_background_css_colors_from_text(str(tag.get("style", ""))))

    # fetch up to 4 external stylesheets, extract background-color rules + AI colors
    seen_sheet_urls: set[str] = set()
    combined_css: list[str] = []
    for page in pages:
        for sheet_url in extract_stylesheet_urls(page.soup, page.url):
            if sheet_url in seen_sheet_urls or len(seen_sheet_urls) >= 4:
                break
            seen_sheet_urls.add(sheet_url)
            try:
                resp = session.get(sheet_url, timeout=REQUEST_TIMEOUT)
                if resp.ok:
                    background_colors.extend(extract_background_css_colors_from_text(resp.text))
                    combined_css.append(resp.text)
            except requests.RequestException:
                pass

    ai_colors = extract_colors_via_ai("\n".join(combined_css))
    if ai_colors:
        print(f"[scrape] AI extracted {len(ai_colors)} colors from CSS")
        background_colors = ai_colors + background_colors

    logo_colors: list[str] = []
    primary_logo = choose_primary_logo_for_palette(downloaded_logos, keywords)
    if primary_logo and primary_logo.downloaded_path:
        logo_colors.extend(extract_colors_from_image(Path(primary_logo.downloaded_path)))

    result = ScrapeResult(
        source_url=source_url,
        final_url=final_url,
        title=title,
        brand_name=brand_name,
        language=language,
        location=location,
        company_summary=company_summary,
        goal_summary=goal_summary,
        primary_logo_path=primary_logo.downloaded_path if primary_logo and primary_logo.downloaded_path else "",
        text_sections=text_sections,
        scraped_pages=[page.url for page in pages],
        colors=choose_accent_colors(background_colors, logo_colors),
        logos=downloaded_logos,
        product_images=downloaded_products,
        other_images=downloaded_others,
        social_proof=social_proof,
    )

    write_info_file(result, output_dir)
    write_urls_file(result, output_dir)
    write_colors_file(result.colors, output_dir)
    write_manifest(result, output_dir)
    write_client_memory_inline(result, output_dir)
    return output_dir


def write_client_memory_inline(result: ScrapeResult, output_dir: Path) -> None:
    chat_context = (
        "This brand was scraped by the Meta Ad Generator pipeline. The scrape "
        "output sits under clients/<domain>/scrape/ and is consumed by the copy "
        "and palette stages. See info.txt for human-readable summary, manifest.json "
        "for structured data, accent_colors.txt for the extracted color palette."
    )
    write_client_memory_file(result, output_dir, chat_context)


def _download_group(session: requests.Session, items: list[ImageCandidate], folder: Path, downloaded_paths: list[Path]) -> list[ImageCandidate]:
    downloaded: list[ImageCandidate] = []
    for index, item in enumerate(items, start=1):
        item_copy = ImageCandidate(
            url=item.url,
            label=item.label,
            source=item.source,
            kind=item.kind,
            score=item.score,
        )
        path = download_image(session, item_copy, folder, index)
        if path:
            downloaded_paths.append(path)
            downloaded.append(item_copy)
    return downloaded
