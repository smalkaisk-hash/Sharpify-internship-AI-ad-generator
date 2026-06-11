"""Promote the validated copy to final.json so stages 4+ have a stable read target."""
from __future__ import annotations

import shutil
from pathlib import Path

import click

from adgen import paths


def promote_copy(domain: str) -> Path:
    """Copy refined.json (if it exists) or components.json to final.json.

    Returns the path to the written final.json.
    Raises FileNotFoundError if neither source file exists.
    """
    copy_dir = paths.copy_dir(domain)
    refined = copy_dir / "refined.json"
    components = copy_dir / "components.json"
    final = copy_dir / "final.json"

    if refined.exists():
        source = refined
    elif components.exists():
        source = components
    else:
        raise FileNotFoundError(
            f"No copy file found in {copy_dir}. "
            "Run stage 2 (copy generation) first."
        )

    shutil.copy2(source, final)
    return final


@click.command("promote-copy")
@click.argument("domain")
def cli(domain: str) -> None:
    """Promote validated copy to final.json (stage 2 → stage 4 handoff)."""
    try:
        final = promote_copy(domain)
        click.echo(f"Promoted to: {final.resolve()}")
    except FileNotFoundError as exc:
        click.echo(f"Error: {exc}", err=True)
        raise SystemExit(1)
