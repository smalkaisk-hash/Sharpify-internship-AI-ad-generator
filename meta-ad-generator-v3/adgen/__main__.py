"""CLI dispatcher: `python -m adgen <subcommand>`."""
from __future__ import annotations

from pathlib import Path

import click
from dotenv import load_dotenv

# Load .env from the repo root (two levels up from this file: adgen/__main__.py → adgen/ → project root)
load_dotenv(Path(__file__).parent.parent.parent / ".env", override=False)

from adgen import brief as brief_module
from adgen import paths
from adgen.assemble import cli as assemble_cli
from adgen.image.generator import _FORMAT_DIMENSIONS, generate_image as _generate_image
from adgen.image.prompt_builder import CONCEPTS
from adgen.config import DEFAULT_MAX_IMAGES, DEFAULT_MAX_PAGES
from adgen.palette.runner import run_palette
from adgen.preview import cli as preview_cli
from adgen.promote import cli as promote_copy_cli
from adgen.render.cli import cli as render_cli
from adgen.render.cli import matrix_cli
from adgen.render.shape_templates import TEMPLATES as _SHAPE_TEMPLATES
from adgen.scrape.cli import run_scrape
from adgen.validate import cli as validate_cli
from adgen.validate_html import cli as validate_html_cli
from adgen.validate_images import cli as validate_images_cli
from adgen.zone_analysis import run_zone_review
from adgen.bg_remove import cli as remove_bg_cli


@click.group()
def cli() -> None:
    """Meta Ad Generator — pipeline tools."""


@cli.command()
@click.argument("url")
@click.option("--brief", "brief_path", type=click.Path(path_type=Path), default=None,
              help="Optional path to a brand brief file. If omitted, you will be prompted.")
@click.option("--max-images", type=int, default=DEFAULT_MAX_IMAGES, show_default=True)
@click.option("--max-pages", type=int, default=DEFAULT_MAX_PAGES, show_default=True)
@click.option("--keep-existing", is_flag=True,
              help="Keep existing scrape output for this domain instead of clearing first.")
def scrape(url: str, brief_path: Path | None, max_images: int, max_pages: int, keep_existing: bool) -> None:
    """Run stage 1 — scrape a website."""
    brief_text = brief_module.load_brief(brief_path) if brief_path else brief_module.prompt_brief()
    output_dir = run_scrape(
        url,
        max_images=max_images,
        max_pages=max_pages,
        keep_existing=keep_existing,
    )
    domain = output_dir.parent.name
    paths.brief_path(domain).write_text(brief_text + "\n", encoding="utf-8")
    click.echo(f"Done. Scrape output: {output_dir.resolve()}")
    click.echo(f"Brief saved to:    {paths.brief_path(domain).resolve()}")


cli.add_command(validate_cli, name="validate")
cli.add_command(validate_images_cli, name="validate-images")
cli.add_command(validate_html_cli, name="validate-html")
cli.add_command(promote_copy_cli, name="promote-copy")
cli.add_command(render_cli, name="render")
cli.add_command(matrix_cli, name="matrix")
cli.add_command(assemble_cli, name="assemble")
cli.add_command(preview_cli, name="preview")
cli.add_command(remove_bg_cli, name="remove-bg")


@cli.command()
@click.argument("domain")
def palette(domain: str) -> None:
    """Run stage 3 — pick the nearest catalog palette for a previously-scraped domain."""
    run_palette(domain)
    out = paths.palette_dir(domain)
    click.echo(f"Done. Palette output: {out.resolve()}")


@cli.command("generate-image")
@click.argument("domain")
@click.option("--count", type=int, default=1, show_default=True, help="Number of images to generate.")
@click.option("--seed", type=int, default=None, help="Fixed seed (single image only).")
@click.option("--model", default="flux", show_default=True, help="Pollinations model name.")
@click.option(
    "--concept",
    default="lifestyle",
    show_default=True,
    type=click.Choice(list(CONCEPTS)),
    help="Visual concept: lifestyle (default), product-flat, before-after, social-proof.",
)
@click.option(
    "--format",
    "fmt",
    default="square",
    show_default=True,
    type=click.Choice(list(_FORMAT_DIMENSIONS)),
    help="Canvas format: square (1080×1080) or portrait (1080×1350).",
)
@click.option("--append", is_flag=True,
              help="Start numbering after the highest existing generated-N file instead of overwriting.")
def generate_image_cmd(
    domain: str,
    count: int,
    seed: int | None,
    model: str,
    concept: str,
    fmt: str,
    append: bool,
) -> None:
    """Run stage 3b — generate brand images with Pollinations AI.

    Each image gets a freshly randomised prompt, so --count 3 produces
    3 visually distinct results.

    Use --concept to control the visual style:
      lifestyle    — person in brand-matching scene (default)
      product-flat — clean product-on-surface shot
      before-after — split problem/solution composition
      social-proof — happy customer(s), testimonial feel

    Use --format portrait to generate 1080×1350 for 4:5 feed placement.

    Use --append to add images to an existing set without overwriting.
    """
    import json as _json
    from adgen.palette.runner import detect_category as _detect_category

    manifest_file = paths.scrape_dir(domain) / "manifest.json"
    if manifest_file.exists():
        try:
            _manifest = _json.loads(manifest_file.read_text(encoding="utf-8"))
            _cat = _detect_category(_manifest)
            if _cat is None:
                click.echo(
                    f"[ERROR] detect_category() returned None for '{domain}'.\n"
                    f"\n"
                    f"  No matching industry in CATEGORY_KEYWORDS → wrong scene pool\n"
                    f"  and wrong palette boost, producing irrelevant images.\n"
                    f"\n"
                    f"  Fix: add the industry to CATEGORY_KEYWORDS (and USE_FOR_BOOST +\n"
                    f"  a _SCENES entry in prompt_builder.py), then re-run.\n"
                    f"\n"
                    f"  Smoke-test after adding:\n"
                    f"    python -c \"from adgen.palette.runner import detect_category; \\\\\n"
                    f"import json, pathlib; m = json.loads(pathlib.Path(\\\\\n"
                    f"'clients/{domain}/scrape/manifest.json').read_text()); \\\\\n"
                    f"print(detect_category(m))\"",
                    err=True,
                )
                raise SystemExit(1)
            click.echo(f"[image] Category: {_cat}")
        except SystemExit:
            raise
        except Exception:
            pass  # manifest unreadable — let generate_image surface the real error

    results = _generate_image(domain, count=count, seed=seed, model=model, concept=concept, fmt=fmt, append=append)
    for out in results:
        click.echo(f"Saved: {out.resolve()}")
    if len(results) == 1:
        click.echo(f"Pass to render: python -m adgen render {domain} --photo {results[0].resolve()}")


@cli.command("zone-review")
@click.argument("domain", required=False, default=None)
@click.option("--file", "file_path", default=None, help="Analyse a single PNG instead of a whole domain.")
@click.option("--rows", type=int, default=3, show_default=True)
@click.option("--cols", type=int, default=3, show_default=True)
def zone_review_cmd(domain: str | None, file_path: str | None, rows: int, cols: int) -> None:
    """Analyse ad PNGs zone-by-zone: brightness, edge density, dominant colour."""
    try:
        run_zone_review(domain, file_path, rows=rows, cols=cols)
    except (FileNotFoundError, ValueError) as exc:
        click.echo(f"Error: {exc}", err=True)
        raise SystemExit(1)


@cli.command("generate-shapes")
@click.argument("domain")
@click.option("--photo", "photo_path", default=None,
              help="Path to generated image (passed to templates that need one).")
@click.option("--start-index", type=int, default=None,
              help="First ad number for output filenames. Auto-detected from existing files if omitted.")
@click.option("--only", default=None,
              help="Comma-separated subset of shape slugs to generate, e.g. 'starburst,hexagon'.")
def generate_shapes_cmd(
    domain: str,
    photo_path: str | None,
    start_index: int | None,
    only: str | None,
) -> None:
    """Generate the 7 new shape-vocabulary ad templates for a domain.

    Writes HTML files to clients/<domain>/html/ then runs the layout validator.
    Each file is named ad-N-<shape>.html, where N continues after the highest
    existing ad number in that directory.

    Shapes: starburst, overlap, diamond, knockout, hexagon, scallop, conic
    """
    from adgen.render.context import load_context
    from adgen.render.renderer import validate_and_fix_html_dir

    html_dir = paths.client_dir(domain) / "html"
    html_dir.mkdir(parents=True, exist_ok=True)

    # Auto-detect starting index from existing files
    if start_index is None:
        existing = sorted(html_dir.glob("ad-*.html"))
        if existing:
            import re
            nums = [int(m.group(1)) for f in existing
                    if (m := re.match(r"ad-(\d+)-", f.name))]
            start_index = (max(nums) + 1) if nums else 1
        else:
            start_index = 1

    ctx = load_context(domain, photo_path=photo_path)

    filter_slugs = set(only.split(",")) if only else None
    templates = [(s, fn) for s, fn in _SHAPE_TEMPLATES
                 if filter_slugs is None or s in filter_slugs]

    written = []
    for i, (slug, fn) in enumerate(templates):
        ad_num = start_index + i
        out_path = html_dir / f"ad-{ad_num}-{slug}.html"
        html = fn(ctx, angle=0)
        out_path.write_text(html, encoding="utf-8")
        click.echo(f"Wrote  {out_path.name}")
        written.append(out_path)

    if written:
        click.echo(f"\nRunning layout validator on {len(written)} new file(s)…")
        validate_and_fix_html_dir(domain)
        click.echo(f"\nDone. {len(written)} shape ad(s) in {html_dir.resolve()}")


if __name__ == "__main__":
    cli()
