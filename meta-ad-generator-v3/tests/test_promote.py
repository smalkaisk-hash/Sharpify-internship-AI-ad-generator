from __future__ import annotations

import json

import pytest

from adgen.promote import promote_copy


def test_promote_uses_refined_when_present(tmp_clients_root):
    from adgen import paths
    domain = "promo.com"
    copy_dir = paths.copy_dir(domain)
    copy_dir.mkdir(parents=True)
    (copy_dir / "components.json").write_text('{"cta": "components"}', encoding="utf-8")
    (copy_dir / "refined.json").write_text('{"cta": "refined"}', encoding="utf-8")

    final = promote_copy(domain)

    assert final == copy_dir / "final.json"
    data = json.loads(final.read_text(encoding="utf-8"))
    assert data["cta"] == "refined"


def test_promote_falls_back_to_components(tmp_clients_root):
    from adgen import paths
    domain = "promo2.com"
    copy_dir = paths.copy_dir(domain)
    copy_dir.mkdir(parents=True)
    (copy_dir / "components.json").write_text('{"cta": "components"}', encoding="utf-8")

    final = promote_copy(domain)

    data = json.loads(final.read_text(encoding="utf-8"))
    assert data["cta"] == "components"


def test_promote_raises_when_no_source(tmp_clients_root):
    with pytest.raises(FileNotFoundError, match="No copy file found"):
        promote_copy("nobody.com")


def test_promote_overwrites_existing_final(tmp_clients_root):
    from adgen import paths
    domain = "promo3.com"
    copy_dir = paths.copy_dir(domain)
    copy_dir.mkdir(parents=True)
    (copy_dir / "components.json").write_text('{"cta": "new"}', encoding="utf-8")
    (copy_dir / "final.json").write_text('{"cta": "old"}', encoding="utf-8")

    promote_copy(domain)

    data = json.loads((copy_dir / "final.json").read_text(encoding="utf-8"))
    assert data["cta"] == "new"
