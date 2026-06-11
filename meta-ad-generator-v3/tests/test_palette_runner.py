from __future__ import annotations

import json
from pathlib import Path

import pytest

from adgen.palette import runner
from adgen.palette.catalog import Palette


# ── Helpers ────────────────────────────────────────────────────────────────

def _palette(name: str, swatches: list[str], use_for: str = "test") -> Palette:
    return Palette(
        name=name,
        theme="Light",
        use_for=use_for,
        base=swatches[0],
        second_tone=None,
        accents=[],
        text_cta_bg=swatches[-1],
        body_text=swatches[-1],
        cta_text=swatches[0],
        all_swatches=swatches,
    )


# ── hex_to_rgb ─────────────────────────────────────────────────────────────

def test_hex_to_rgb_basic():
    assert runner.hex_to_rgb("#ff0000") == (255, 0, 0)
    assert runner.hex_to_rgb("#00ff00") == (0, 255, 0)
    assert runner.hex_to_rgb("#0000ff") == (0, 0, 255)
    assert runner.hex_to_rgb("#FFFFFF") == (255, 255, 255)


def test_hex_to_rgb_shorthand():
    assert runner.hex_to_rgb("#fff") == (255, 255, 255)
    assert runner.hex_to_rgb("#000") == (0, 0, 0)


# ── rgb_to_lab ─────────────────────────────────────────────────────────────

def test_rgb_to_lab_white():
    L, a, b = runner.rgb_to_lab(255, 255, 255)
    assert abs(L - 100.0) < 0.1
    assert abs(a) < 0.1
    assert abs(b) < 0.1


def test_rgb_to_lab_black():
    L, a, b = runner.rgb_to_lab(0, 0, 0)
    assert abs(L) < 0.1


def test_rgb_to_lab_red_higher_a_than_blue():
    _, a_red, _ = runner.rgb_to_lab(255, 0, 0)
    _, a_blue, _ = runner.rgb_to_lab(0, 0, 255)
    assert a_red > a_blue


# ── lab_distance ───────────────────────────────────────────────────────────

def test_lab_distance_self_is_zero():
    lab = runner.rgb_to_lab(128, 64, 32)
    assert runner.lab_distance(lab, lab) == 0.0


def test_lab_distance_white_black():
    white = runner.rgb_to_lab(255, 255, 255)
    black = runner.rgb_to_lab(0, 0, 0)
    dist = runner.lab_distance(white, black)
    assert dist > 90  # L* differs by ~100


def test_lab_distance_perceptual_warm_beiges_closer_than_rgb():
    # Two warm beiges that look similar — Lab distance should be small
    beige1 = runner.rgb_to_lab(240, 220, 200)
    beige2 = runner.rgb_to_lab(235, 215, 195)
    dist = runner.lab_distance(beige1, beige2)
    assert dist < 10  # perceptually very close


# ── palette_distance ───────────────────────────────────────────────────────

def test_palette_distance_picks_nearer_swatch():
    palette = _palette("p", ["#000000", "#ff0000"])
    red_lab = [runner.rgb_to_lab(255, 0, 0)]
    distance = runner.palette_distance(palette, red_lab)
    assert distance < 1.0  # red scraped → red swatch is distance ~0


def test_palette_distance_empty_swatches_returns_inf():
    p = _palette("empty", [])
    p.all_swatches = []
    assert runner.palette_distance(p, [runner.rgb_to_lab(0, 0, 0)]) == float("inf")


# ── pick_nearest ───────────────────────────────────────────────────────────

def test_pick_nearest_palette_returns_lowest_distance():
    a = _palette("dark", ["#000000", "#111111"])
    b = _palette("warm", ["#ff8800", "#ffaa44"])
    orange_lab = [runner.rgb_to_lab(255, 136, 0)]
    chosen, shortlist = runner.pick_nearest(orange_lab, [a, b], top_n=2)
    assert chosen.name == "warm"
    assert shortlist[0].palette.name == "warm"


def test_pick_nearest_category_boost_promotes_matching_palette():
    # "wellness" in use_for → beauty category boost
    generic = _palette("generic", ["#ff8800", "#ffaa44"], use_for="Industrial")
    beauty = _palette("beauty", ["#ff4400", "#ff6600"], use_for="Beauty & Wellness")
    # orange is geometrically closer to generic, but beauty boost should win
    orange_lab = [runner.rgb_to_lab(255, 136, 0)]
    chosen, _ = runner.pick_nearest(orange_lab, [generic, beauty], category="beauty", top_n=2)
    assert chosen.name == "beauty"


def test_pick_nearest_no_category_uses_pure_distance():
    a = _palette("dark", ["#000000", "#111111"], use_for="Beauty & Wellness")
    b = _palette("warm", ["#ff8800", "#ffaa44"], use_for="Industrial")
    orange_lab = [runner.rgb_to_lab(255, 136, 0)]
    chosen, _ = runner.pick_nearest(orange_lab, [a, b], category=None, top_n=2)
    assert chosen.name == "warm"  # still wins on pure distance


# ── detect_category ────────────────────────────────────────────────────────

def test_detect_category_beauty():
    manifest = {"company_summary": "We are a beauty salon specialising in skin treatments."}
    assert runner.detect_category(manifest) == "beauty"


def test_detect_category_b2b():
    manifest = {"goal_summary": "Help corporate clients find staffing solutions."}
    assert runner.detect_category(manifest) == "b2b"


def test_detect_category_unknown_returns_none():
    manifest = {"company_summary": "We do things."}
    assert runner.detect_category(manifest) is None


# ── run_palette ────────────────────────────────────────────────────────────

def test_run_palette_writes_chosen_and_shortlist(tmp_clients_root, monkeypatch):
    from adgen import paths
    domain = "example.com"
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "accent_colors.txt").write_text("#ff8800\n", encoding="utf-8")

    a = _palette("dark", ["#000000", "#111111"])
    b = _palette("warm", ["#ff8800", "#ffaa44"])
    monkeypatch.setattr(runner, "load_catalog", lambda *_args, **_kwargs: [a, b])

    runner.run_palette(domain)

    palette_dir = paths.palette_dir(domain)
    chosen = json.loads((palette_dir / "chosen.json").read_text(encoding="utf-8"))
    assert chosen["name"] == "warm"
    assert chosen["swatches"]["base"] == "#ff8800"
    assert chosen["matched_against"] == ["#ff8800"]
    shortlist = json.loads((palette_dir / "shortlist.json").read_text(encoding="utf-8"))
    assert len(shortlist) == 2
    assert shortlist[0]["name"] == "warm"


def test_run_palette_missing_accent_colors_raises(tmp_clients_root):
    with pytest.raises(FileNotFoundError):
        runner.run_palette("missing.com")


def test_run_palette_empty_accent_colors_uses_fallback(tmp_clients_root, monkeypatch):
    from adgen import paths
    domain = "empty.com"
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "accent_colors.txt").write_text("No accent colors detected.\n", encoding="utf-8")

    only = _palette("neutral", ["#888888", "#cccccc", "#f5f5f5", "#000000"])
    monkeypatch.setattr(runner, "load_catalog", lambda *_args, **_kwargs: [only])

    runner.run_palette(domain)

    chosen = json.loads((paths.palette_dir(domain) / "chosen.json").read_text(encoding="utf-8"))
    assert chosen["name"] == "neutral"
    assert chosen["fallback_used"] is True
    assert chosen["matched_against"] == runner.DEFAULT_FALLBACK_COLORS


def test_run_palette_detects_category_from_manifest(tmp_clients_root, monkeypatch):
    from adgen import paths
    domain = "spa.com"
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "accent_colors.txt").write_text("#ff8800\n", encoding="utf-8")
    (scrape / "manifest.json").write_text(
        json.dumps({"company_summary": "A beauty spa and wellness clinic."}),
        encoding="utf-8",
    )

    only = _palette("warm", ["#ff8800", "#ffaa44"], use_for="Beauty & Wellness")
    monkeypatch.setattr(runner, "load_catalog", lambda *_args, **_kwargs: [only])

    runner.run_palette(domain)

    chosen = json.loads((paths.palette_dir(domain) / "chosen.json").read_text(encoding="utf-8"))
    assert chosen.get("detected_category") == "beauty"
