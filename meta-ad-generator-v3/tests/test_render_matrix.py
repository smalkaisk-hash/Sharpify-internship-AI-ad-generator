from __future__ import annotations

import json
from pathlib import Path

from adgen.render.renderer import render_matrix


# ── Pipeline file helpers ──────────────────────────────────────────────────

def _write_pipeline_files(domain: str, tmp_clients_root: Path) -> None:
    from adgen import paths
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "manifest.json").write_text(json.dumps({
        "brand_name": "TestSpa", "language": "en", "primary_logo_path": None,
    }), encoding="utf-8")
    copy = paths.copy_dir(domain)
    copy.mkdir(parents=True)
    (copy / "final.json").write_text(json.dumps({
        "headlines": ["Problem hl", "Result hl", "95% stat hl"],
        "bullets": ["B1", "B2", "B3", "B4", "B5", "B6"],
        "base_texts": ["Text A.", "Text B.", "Text C."],
        "on_image_texts": ["Anchor A", "Anchor B", "Anchor C"],
        "cta": "Book Now",
    }), encoding="utf-8")
    palette = paths.palette_dir(domain)
    palette.mkdir(parents=True)
    (palette / "chosen.json").write_text(json.dumps({
        "name": "Blush",
        "swatches": {
            "base": "#f0dad5", "second_tone": "#eedbd4",
            "accents": ["#c56b62", "#dea785"],
            "text_cta_bg": "#424658", "body_text": "#1e0c1a", "cta_text": "#f0dad5",
        },
    }), encoding="utf-8")


# ── render_matrix ──────────────────────────────────────────────────────────

def test_render_matrix_returns_empty_with_no_templates(tmp_clients_root):
    domain = "matrix-test.com"
    _write_pipeline_files(domain, tmp_clients_root)
    written = render_matrix(domain)
    assert written == []
