from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .config import DEFAULT_OUTPUT_ROOT, MAX_IMAGES, MAX_PAGES
from .crawler import scrape_site
from .utils import RequestException, ensure_dependencies, normalize_url


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Scrape brand assets, language, location, basic info, colors and images from a website."
    )
    parser.add_argument("url", help="Website URL, for example https://example.com")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT_ROOT), help="Output root folder. Default: clients/scraping")
    parser.add_argument("--max-images", type=int, default=MAX_IMAGES, help=f"Maximum image candidates to process. Default: {MAX_IMAGES}")
    parser.add_argument("--max-pages", type=int, default=MAX_PAGES, help=f"Maximum internal pages to scan. Default: {MAX_PAGES}")
    parser.add_argument("--keep-existing", action="store_true", help="Do not clear the existing domain output folder before saving new files.")
    return parser


def main() -> None:
    ensure_dependencies()
    args = build_parser().parse_args()
    try:
        output_dir = scrape_site(
            args.url,
            Path(args.output),
            max_images=args.max_images,
            max_pages=args.max_pages,
            clear_existing=not args.keep_existing,
        )
    except RequestException as exc:
        print("Could not open the website.", file=sys.stderr)
        print(f"URL: {normalize_url(args.url)}", file=sys.stderr)
        print("Check the domain, browser access, internet and DNS.", file=sys.stderr)
        print(f"Technical reason: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc

    print(f"Done. Saved scraping results to: {output_dir.resolve()}")


def run_scrape(
    url: str,
    output: Path | None = None,
    max_images: int = MAX_IMAGES,
    max_pages: int = MAX_PAGES,
    keep_existing: bool = False,
) -> Path:
    """Programmatic entry point used by the project CLI dispatcher.

    Returns the output directory on success. Raises RequestException if the
    site cannot be opened.
    """
    output_root = Path(output) if output else DEFAULT_OUTPUT_ROOT
    ensure_dependencies()
    return scrape_site(
        url,
        output_root,
        max_images=max_images,
        max_pages=max_pages,
        clear_existing=not keep_existing,
    )
