from __future__ import annotations

from adgen import paths


def test_client_dir_under_root(tmp_clients_root):
    result = paths.client_dir("example.com")
    assert result == tmp_clients_root / "example.com"


def test_scrape_dir(tmp_clients_root):
    assert paths.scrape_dir("example.com") == tmp_clients_root / "example.com" / "scrape"


def test_copy_dir(tmp_clients_root):
    assert paths.copy_dir("example.com") == tmp_clients_root / "example.com" / "copy"


def test_palette_dir(tmp_clients_root):
    assert paths.palette_dir("example.com") == tmp_clients_root / "example.com" / "palette"


def test_brief_path(tmp_clients_root):
    assert paths.brief_path("example.com") == tmp_clients_root / "example.com" / "brief.txt"


def test_ensure_client_dirs_creates_all_subdirs(tmp_clients_root):
    paths.ensure_client_dirs("example.com")
    base = tmp_clients_root / "example.com"
    assert (base / "scrape").is_dir()
    assert (base / "copy").is_dir()
    assert (base / "palette").is_dir()
