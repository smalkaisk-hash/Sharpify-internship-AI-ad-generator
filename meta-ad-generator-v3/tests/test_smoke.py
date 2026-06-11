"""End-to-end smoke test — hits the network. Skip in normal runs.

Run explicitly with:  pytest -m slow tests/test_smoke.py -v
"""
from __future__ import annotations

import json

import pytest

from adgen.palette.runner import run_palette
from adgen.scrape.cli import run_scrape


@pytest.mark.slow
def test_scrape_and_palette_on_123spa(tmp_clients_root):
    output_dir = run_scrape("https://123spa.lv", output=tmp_clients_root, max_images=20, max_pages=4)
    assert output_dir.is_dir()
    assert (output_dir / "info.txt").exists()
    assert (output_dir / "manifest.json").exists()
    assert (output_dir / "accent_colors.txt").exists()
    manifest = json.loads((output_dir / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["brand_name"], "brand name should be detected"

    domain = output_dir.parent.name
    run_palette(domain)
    palette_dir = output_dir.parent / "palette"
    chosen = json.loads((palette_dir / "chosen.json").read_text(encoding="utf-8"))
    assert chosen["name"], "chosen palette must have a name"
    assert chosen["swatches"]["base"].startswith("#"), "base swatch must be a hex"
    shortlist = json.loads((palette_dir / "shortlist.json").read_text(encoding="utf-8"))
    assert len(shortlist) == 5
