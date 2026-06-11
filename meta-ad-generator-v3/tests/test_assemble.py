from __future__ import annotations

import json

import pytest

from adgen.assemble import assemble_copy, _map_cta


# ── CTA mapping ─────────────────────────────────────────────────────────────

def test_map_cta_book():
    assert _map_cta("Book Now") == "BOOK_TRAVEL"


def test_map_cta_shop():
    assert _map_cta("Shop the collection") == "SHOP_NOW"


def test_map_cta_sign_up():
    assert _map_cta("Sign Up Free") == "SIGN_UP"


def test_map_cta_contact():
    assert _map_cta("Contact Us") == "CONTACT_US"


def test_map_cta_unknown_falls_back():
    assert _map_cta("Pieteikties") == "LEARN_MORE"


# ── assemble_copy integration ────────────────────────────────────────────────

def _write_final(domain: str, data: dict, tmp_clients_root) -> None:
    from adgen import paths
    copy_dir = paths.copy_dir(domain)
    copy_dir.mkdir(parents=True)
    (copy_dir / "final.json").write_text(json.dumps(data), encoding="utf-8")


def test_assemble_writes_three_angles(tmp_clients_root):
    domain = "asm-test.com"
    _write_final(domain, {
        "headlines":      ["H1", "H2", "H3"],
        "base_texts":     ["BT1", "BT2", "BT3"],
        "bullets":        ["B1", "B2", "B3", "B4"],
        "on_image_texts": ["OI1", "OI2", "OI3"],
        "cta":            "Book Now",
    }, tmp_clients_root)
    out = assemble_copy(domain)
    rows = json.loads(out.read_text(encoding="utf-8"))
    assert len(rows) == 3
    assert rows[0]["angle"] == 1
    assert rows[1]["angle"] == 2
    assert rows[2]["angle"] == 3


def test_assemble_fields_populated(tmp_clients_root):
    domain = "asm-fields.com"
    _write_final(domain, {
        "headlines":  ["H1", "H2", "H3"],
        "base_texts": ["Long primary text one.", "Long primary text two.", "Long primary text three."],
        "bullets":    ["Short bullet one", "Short bullet two", "Short bullet three"],
        "cta":        "Shop Now",
    }, tmp_clients_root)
    out = assemble_copy(domain)
    rows = json.loads(out.read_text(encoding="utf-8"))
    row = rows[0]
    assert row["primary_text"] == "Long primary text one."
    assert row["headline"] == "H1"
    assert row["call_to_action_type"] == "SHOP_NOW"
    assert row["cta_display"] == "Shop Now"


def test_assemble_description_truncated(tmp_clients_root):
    domain = "asm-desc.com"
    _write_final(domain, {
        "headlines":  ["H1"],
        "base_texts": ["BT1"],
        "bullets":    ["A very long bullet point that exceeds thirty characters easily"],
        "cta":        "Learn More",
    }, tmp_clients_root)
    out = assemble_copy(domain)
    rows = json.loads(out.read_text(encoding="utf-8"))
    assert len(rows[0]["description"]) <= 30


def test_assemble_angles_use_different_copy(tmp_clients_root):
    domain = "asm-angles.com"
    _write_final(domain, {
        "headlines":  ["H1", "H2", "H3"],
        "base_texts": ["BT1", "BT2", "BT3"],
        "bullets":    ["B1", "B2", "B3"],
        "cta":        "Get Offer",
    }, tmp_clients_root)
    out = assemble_copy(domain)
    rows = json.loads(out.read_text(encoding="utf-8"))
    headlines = [r["headline"] for r in rows]
    assert len(set(headlines)) == 3  # all three are different


def test_assemble_raises_without_final(tmp_clients_root):
    with pytest.raises(FileNotFoundError, match="final.json"):
        assemble_copy("no-final.com")


def test_assemble_short_lists_wrap(tmp_clients_root):
    domain = "asm-short.com"
    _write_final(domain, {
        "headlines":  ["Only headline"],
        "base_texts": ["Only base text"],
        "bullets":    ["Only bullet"],
        "cta":        "Book",
    }, tmp_clients_root)
    out = assemble_copy(domain)
    rows = json.loads(out.read_text(encoding="utf-8"))
    # Should produce 1 angle (min of len(headlines)=1, len(base_texts)=1)
    assert len(rows) == 1
    assert rows[0]["headline"] == "Only headline"
