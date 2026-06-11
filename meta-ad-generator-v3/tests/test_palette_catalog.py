from __future__ import annotations

from pathlib import Path

from adgen.palette.catalog import Palette, load_catalog

FIXTURE = Path(__file__).parent / "fixtures" / "sample_palettes.md"


def test_load_catalog_returns_two_palettes():
    palettes = load_catalog(FIXTURE)
    assert len(palettes) == 2


def test_first_palette_fields():
    p = load_catalog(FIXTURE)[0]
    assert isinstance(p, Palette)
    assert p.name == "Test Light"
    assert p.theme == "Light"
    assert "wellness" in p.use_for
    assert p.base == "#F0DAD5"
    assert p.text_cta_bg == "#424658"
    assert p.body_text == "#424658"
    assert p.cta_text == "#F0DAD5"


def test_second_palette_dark_theme():
    p = load_catalog(FIXTURE)[1]
    assert p.name == "Test Dark"
    assert p.theme == "Dark"
    assert p.base == "#0d0b09"
    assert p.text_cta_bg == "#c8a86a"


def test_all_swatches_collects_every_hex():
    p = load_catalog(FIXTURE)[0]
    assert "#F0DAD5" in p.all_swatches
    assert "#BABBB1" in p.all_swatches
    assert "#424658" in p.all_swatches


def test_real_catalog_loads_with_many_palettes():
    real = Path(__file__).parent.parent / "adgen" / "palette" / "data" / "palettes-neutral.md"
    palettes = load_catalog(real)
    assert len(palettes) > 100, f"expected 100+ palettes, got {len(palettes)}"
    for p in palettes:
        assert p.name, f"empty name in palette: {p}"
        assert p.base.startswith("#"), f"bad base in {p.name}: {p.base}"
