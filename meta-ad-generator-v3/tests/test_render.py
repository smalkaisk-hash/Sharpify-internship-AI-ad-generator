from __future__ import annotations

import json
from pathlib import Path

import pytest

from adgen.render.context import load_context
from adgen.render.renderer import render_ads


# ── Pipeline file helpers ──────────────────────────────────────────────────

def _write_pipeline_files(domain: str, tmp_clients_root: Path) -> None:
    from adgen import paths
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "manifest.json").write_text(json.dumps({
        "brand_name": "TestSpa",
        "language": "en",
        "primary_logo_path": None,
    }), encoding="utf-8")
    copy = paths.copy_dir(domain)
    copy.mkdir(parents=True)
    (copy / "final.json").write_text(json.dumps({
        "headlines": ["Skin changes after 2 sessions", "IPL RF laser one protocol", "95% return rate"],
        "bullets": ["IPL RF laser combined", "95% clients return", "Results after 2 sessions",
                    "Free consult worth 40", "No downtime same day", "Calibrated per skin type"],
        "base_texts": [
            "Creams don't fix pigmentation. Optimas does. Results in 2 sessions.",
            "95% of clients see change after session one. One platform. Your skin.",
            "First consult is free, worth 40. Only Optimas combines IPL RF laser. Book today.",
        ],
        "on_image_texts": ["Optimas skin tech", "95% clients return", "Free consult now"],
        "cta": "Book Now",
    }), encoding="utf-8")
    palette = paths.palette_dir(domain)
    palette.mkdir(parents=True)
    (palette / "chosen.json").write_text(json.dumps({
        "name": "Blush",
        "theme": "Light",
        "use_for": "Beauty",
        "swatches": {
            "base": "#f0dad5",
            "second_tone": "#eedbd4",
            "accents": ["#c56b62", "#dea785"],
            "text_cta_bg": "#424658",
            "body_text": "#1e0c1a",
            "cta_text": "#f0dad5",
        },
        "contrast_rating": "✓",
    }), encoding="utf-8")


# ── render_ads integration ─────────────────────────────────────────────────

def test_render_ads_returns_empty_with_no_templates(tmp_clients_root):
    domain = "render-test.com"
    _write_pipeline_files(domain, tmp_clients_root)
    written = render_ads(domain)
    assert written == []


def test_render_ads_missing_final_json_raises(tmp_clients_root):
    from adgen import paths
    domain = "no-copy.com"
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    with pytest.raises(FileNotFoundError):
        render_ads(domain)


def test_load_context_reads_all_pipeline_files(tmp_clients_root):
    domain = "ctx-test.com"
    _write_pipeline_files(domain, tmp_clients_root)
    ctx = load_context(domain)
    assert ctx.brand_name == "TestSpa"
    assert ctx.language == "en"
    assert ctx.base == "#f0dad5"
    assert ctx.cta == "Book Now"
    assert len(ctx.headlines) == 3
