from __future__ import annotations

from pathlib import Path

import pytest
from PIL import Image

from adgen.validate_images import (
    Issue,
    MIN_LOGO_HEIGHT,
    MIN_LOGO_WIDTH,
    MIN_PRODUCT_HEIGHT,
    MIN_PRODUCT_WIDTH,
    MIN_USABLE_LOGOS,
    MIN_USABLE_PRODUCTS,
    validate_images,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_png(path: Path, width: int, height: int) -> str:
    Image.new("RGB", (width, height), color=(128, 128, 128)).save(path, format="PNG")
    return str(path)


def _make_svg(path: Path) -> str:
    path.write_text('<svg xmlns="http://www.w3.org/2000/svg"/>', encoding="utf-8")
    return str(path)


def _img(downloaded_path: str | None, kind: str = "product") -> dict:
    return {"url": "https://example.com/img.png", "kind": kind, "score": 50, "downloaded_path": downloaded_path}


# ---------------------------------------------------------------------------
# Clean fixture
# ---------------------------------------------------------------------------

@pytest.fixture
def clean(tmp_path: Path) -> dict:
    logo = _make_png(tmp_path / "logo.png", MIN_LOGO_WIDTH + 50, MIN_LOGO_HEIGHT + 50)
    p1 = _make_png(tmp_path / "p1.png", MIN_PRODUCT_WIDTH + 10, MIN_PRODUCT_HEIGHT + 10)
    p2 = _make_png(tmp_path / "p2.png", MIN_PRODUCT_WIDTH + 20, MIN_PRODUCT_HEIGHT + 20)
    return {
        "primary_logo_path": logo,
        "logos": [_img(logo, kind="logo")],
        "product_images": [_img(p1), _img(p2)],
        "other_images": [],
    }


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_clean_manifest_has_no_issues(clean):
    assert validate_images(clean) == []


def test_primary_logo_path_missing_flagged(clean):
    bad = {**clean, "primary_logo_path": ""}
    issues = validate_images(bad)
    assert any(i.field == "primary_logo_path" and "not set" in i.message for i in issues)


def test_primary_logo_path_nonexistent_file_flagged(clean):
    bad = {**clean, "primary_logo_path": "/does/not/exist.png"}
    issues = validate_images(bad)
    assert any(i.field == "primary_logo_path" and "not found" in i.message for i in issues)


def test_missing_downloaded_file_flagged(clean, tmp_path):
    ghost = str(tmp_path / "ghost.png")  # never created
    bad = {**clean, "product_images": [_img(ghost), *clean["product_images"]]}
    issues = validate_images(bad)
    assert any("not found" in i.message for i in issues)


def test_logo_too_small_flagged(clean, tmp_path):
    tiny_logo = _make_png(tmp_path / "tiny_logo.png", MIN_LOGO_WIDTH - 1, MIN_LOGO_HEIGHT - 1)
    bad = {**clean, "logos": [_img(tiny_logo, kind="logo")]}
    issues = validate_images(bad)
    assert any("too small" in i.message for i in issues)


def test_product_image_too_small_flagged(clean, tmp_path):
    tiny = _make_png(tmp_path / "tiny_product.png", MIN_PRODUCT_WIDTH - 1, MIN_PRODUCT_HEIGHT - 1)
    bad = {**clean, "product_images": [_img(tiny), *clean["product_images"][1:]]}
    issues = validate_images(bad)
    assert any("too small" in i.message for i in issues)


def test_svg_logo_skips_dimension_check_and_counts_as_usable(clean, tmp_path):
    svg = _make_svg(tmp_path / "logo.svg")
    manifest = {**clean, "logos": [_img(svg, kind="logo")]}
    issues = validate_images(manifest)
    assert not any(i.field == "logos" and "need at least" in i.message for i in issues)


def test_images_without_downloaded_path_are_ignored(clean):
    extra = _img(None)
    bad = {**clean, "other_images": [extra, extra, extra]}
    assert validate_images(bad) == []


def test_not_enough_usable_logos_flagged(clean):
    bad = {**clean, "logos": []}
    issues = validate_images(bad)
    assert any(i.field == "logos" and "need at least" in i.message for i in issues)


def test_not_enough_usable_products_flagged(clean, tmp_path):
    one = _make_png(tmp_path / "one.png", MIN_PRODUCT_WIDTH + 10, MIN_PRODUCT_HEIGHT + 10)
    bad = {**clean, "product_images": [_img(one)], "other_images": []}
    issues = validate_images(bad)
    assert any("product" in i.field and "need at least" in i.message for i in issues)


def test_other_images_count_toward_usable_products(clean, tmp_path):
    p1 = _make_png(tmp_path / "p1.png", MIN_PRODUCT_WIDTH + 10, MIN_PRODUCT_HEIGHT + 10)
    p2 = _make_png(tmp_path / "p2.png", MIN_PRODUCT_WIDTH + 20, MIN_PRODUCT_HEIGHT + 20)
    manifest = {**clean, "product_images": [], "other_images": [_img(p1), _img(p2)]}
    assert validate_images(manifest) == []


def test_issue_dataclass_has_field_and_message(clean):
    bad = {**clean, "primary_logo_path": ""}
    issues = validate_images(bad)
    assert issues
    issue = issues[0]
    assert isinstance(issue, Issue)
    assert isinstance(issue.field, str)
    assert isinstance(issue.message, str)
