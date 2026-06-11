"""Background removal for product images using rembg (ISNet/U2-Net)."""
from __future__ import annotations

from pathlib import Path

import click
from PIL import Image

_SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".tif"}


def _remove_one(src: Path, dest: Path, model: str, session) -> None:
    from rembg import remove as _remove

    with Image.open(src) as img:
        result: Image.Image = _remove(img, session=session)

    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, format="PNG")


def remove_backgrounds(
    inputs: list[Path],
    output_dir: Path | None,
    model: str,
    suffix: str,
) -> list[Path]:
    """Remove backgrounds from a list of image files.

    Returns list of output paths.
    """
    try:
        from rembg import new_session
    except ImportError:
        raise click.ClickException(
            "rembg is not installed. Run: pip install rembg"
        )

    click.echo(f"Loading model '{model}' (first run downloads ~170 MB)…")
    session = new_session(model)

    results: list[Path] = []
    for src in inputs:
        if src.suffix.lower() not in _SUPPORTED:
            click.echo(f"  Skipping {src.name} (unsupported format)", err=True)
            continue

        if output_dir:
            dest = output_dir / (src.stem + suffix + ".png")
        else:
            dest = src.parent / (src.stem + suffix + ".png")

        click.echo(f"  {src.name} → {dest.name}")
        _remove_one(src, dest, model, session)
        results.append(dest)

    return results


def collect_images(paths: tuple[Path, ...]) -> list[Path]:
    """Expand files and directories into a flat image file list."""
    out: list[Path] = []
    for p in paths:
        if p.is_dir():
            for f in sorted(p.iterdir()):
                if f.is_file() and f.suffix.lower() in _SUPPORTED:
                    out.append(f)
        elif p.is_file():
            out.append(p)
        else:
            raise click.BadParameter(f"Path does not exist: {p}")
    return out


@click.command("remove-bg")
@click.argument("paths", nargs=-1, required=True, type=click.Path(path_type=Path))
@click.option(
    "--output-dir", "-o",
    type=click.Path(path_type=Path),
    default=None,
    help="Save outputs here instead of alongside the source files.",
)
@click.option(
    "--model", "-m",
    default="isnet-general-use",
    show_default=True,
    help="rembg model: isnet-general-use | u2net | u2net_human_seg | silueta",
)
@click.option(
    "--suffix",
    default="_nobg",
    show_default=True,
    help="Filename suffix appended before .png extension.",
)
def cli(paths: tuple[Path, ...], output_dir: Path | None, model: str, suffix: str) -> None:
    """Remove backgrounds from product images.

    PATHS can be individual image files or directories. Outputs are transparent
    PNG files saved alongside the originals (or in --output-dir if given).

    Examples:

    \b
        python -m adgen remove-bg product.jpg
        python -m adgen remove-bg clients/myshop.lv/scrape/product_images/
        python -m adgen remove-bg *.jpg --output-dir out/
    """
    images = collect_images(paths)
    if not images:
        click.echo("No supported image files found.", err=True)
        raise SystemExit(1)

    click.echo(f"Found {len(images)} image(s).")
    results = remove_backgrounds(images, output_dir, model, suffix)
    click.echo(f"\nDone. {len(results)} file(s) saved.")
    for r in results:
        click.echo(f"  {r.resolve()}")
