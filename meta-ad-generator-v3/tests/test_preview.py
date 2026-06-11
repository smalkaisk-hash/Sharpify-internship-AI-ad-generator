from __future__ import annotations

import json

import pytest

from adgen.preview import render_preview


def _write_ad_files(domain: str, tmp_clients_root) -> None:
    from adgen import paths
    html_dir = paths.client_dir(domain) / "html"
    html_dir.mkdir(parents=True)
    for slug in ("ad-1-editorial", "ad-2-dark", "ad-3-offer"):
        (html_dir / f"{slug}.html").write_text("<!DOCTYPE html><html><body>ad</body></html>", encoding="utf-8")
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    (scrape / "manifest.json").write_text(
        json.dumps({"brand_name": "TestSpa", "language": "en"}), encoding="utf-8"
    )


def test_preview_writes_html_file(tmp_clients_root):
    domain = "preview-test.com"
    _write_ad_files(domain, tmp_clients_root)
    out = render_preview(domain)
    assert out.exists()
    assert out.name == "preview-feed.html"


def test_preview_contains_all_three_iframes(tmp_clients_root):
    domain = "preview-iframes.com"
    _write_ad_files(domain, tmp_clients_root)
    out = render_preview(domain)
    content = out.read_text(encoding="utf-8")
    assert content.count("<iframe") == 3


def test_preview_contains_brand_name(tmp_clients_root):
    domain = "preview-brand.com"
    _write_ad_files(domain, tmp_clients_root)
    out = render_preview(domain)
    assert "TestSpa" in out.read_text(encoding="utf-8")


def test_preview_iframe_src_uses_file_uri(tmp_clients_root):
    domain = "preview-uri.com"
    _write_ad_files(domain, tmp_clients_root)
    out = render_preview(domain)
    content = out.read_text(encoding="utf-8")
    assert 'src="file:///' in content


def test_preview_raises_without_html_dir(tmp_clients_root):
    with pytest.raises(FileNotFoundError, match="html/"):
        render_preview("no-html.com")


def test_preview_raises_without_ad_files(tmp_clients_root):
    from adgen import paths
    domain = "empty-html.com"
    html_dir = paths.client_dir(domain) / "html"
    html_dir.mkdir(parents=True)
    with pytest.raises(FileNotFoundError, match="No ad HTML files"):
        render_preview(domain)


def test_preview_works_with_partial_ads(tmp_clients_root):
    from adgen import paths
    domain = "partial-ads.com"
    html_dir = paths.client_dir(domain) / "html"
    html_dir.mkdir(parents=True)
    (html_dir / "ad-1-editorial.html").write_text("<!DOCTYPE html><html><body></body></html>", encoding="utf-8")
    scrape = paths.scrape_dir(domain)
    scrape.mkdir(parents=True)
    out = render_preview(domain)
    content = out.read_text(encoding="utf-8")
    assert content.count("<iframe") == 1
