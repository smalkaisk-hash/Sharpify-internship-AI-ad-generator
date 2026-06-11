"""CLI entry points for stage 4 — validate HTML ads written by Claude."""
from __future__ import annotations

import click

from adgen.render.renderer import validate_and_fix_html_dir


@click.command("render")
@click.argument("domain")
def cli(domain: str) -> None:
    """Run layout validator on HTML files in clients/<domain>/html/."""
    try:
        files = validate_and_fix_html_dir(domain)
        click.echo(f"Done. {len(files)} file(s) validated in: {files[0].parent.resolve()}")
    except FileNotFoundError as exc:
        click.echo(f"Error: {exc}", err=True)
        raise SystemExit(1)


@click.command("matrix")
@click.argument("domain")
def matrix_cli(domain: str) -> None:
    """Not yet implemented."""
    click.echo("matrix command is not yet implemented.", err=True)
    raise SystemExit(1)
