"""Stage 4b — assemble Meta API-ready copy from pipeline outputs.

Reads clients/{domain}/copy/final.json and writes assembled.json with
one entry per copy angle, formatted for the Meta Ads API:
  primary_text  → message field (copywriter spec: max 220 chars; Meta displays
                  ~125 chars before truncating to "... more" — no hard rejection)
  headline      → name field   (max 40 chars)
  description   → description  (max 30 chars; bullets are truncated to fit)
  call_to_action_type → Meta CTA enum
  cta_display   → internal reference only, not sent to Meta API
"""
from __future__ import annotations

import json
from pathlib import Path

import click

from adgen import paths

_CTA_MAP: list[tuple[str, str]] = [
    ("book",       "BOOK_TRAVEL"),
    ("reserve",    "BOOK_TRAVEL"),
    ("shop",       "SHOP_NOW"),
    ("buy",        "SHOP_NOW"),
    ("order",      "SHOP_NOW"),
    ("sign up",    "SIGN_UP"),
    ("subscribe",  "SUBSCRIBE"),
    ("download",   "DOWNLOAD"),
    ("install",    "INSTALL_MOBILE_APP"),
    ("contact",    "CONTACT_US"),
    ("call",       "CALL_NOW"),
    ("get",        "GET_OFFER"),
    ("claim",      "GET_OFFER"),
    ("learn",      "LEARN_MORE"),
    ("see",        "LEARN_MORE"),
    ("watch",      "WATCH_MORE"),
]


def _map_cta(cta_text: str) -> str:
    low = cta_text.lower()
    for keyword, enum in _CTA_MAP:
        if keyword in low:
            return enum
    return "LEARN_MORE"


def assemble_copy(domain: str) -> Path:
    """Build assembled.json from final.json — 3 angle variants.

    Returns the path to the written assembled.json.
    Raises FileNotFoundError if final.json is missing.
    """
    copy_dir = paths.copy_dir(domain)
    final = copy_dir / "final.json"
    if not final.exists():
        raise FileNotFoundError(f"No final.json found in {copy_dir}. Run promote-copy first.")

    data = json.loads(final.read_text(encoding="utf-8"))
    headlines   = data.get("headlines", [])
    base_texts  = data.get("base_texts", [])
    bullets     = data.get("bullets", [])
    cta         = data.get("cta", "Book Now")
    cta_type    = _map_cta(cta)

    n_angles = max(len(headlines), len(base_texts), 1)
    n_angles = min(n_angles, 3)

    rows: list[dict] = []
    for angle in range(n_angles):
        hl   = headlines[angle % len(headlines)]   if headlines  else ""
        pt   = base_texts[angle % len(base_texts)] if base_texts else ""
        desc = bullets[angle % len(bullets)]       if bullets    else ""
        rows.append({
            "angle":               angle + 1,
            "primary_text":        pt,
            "headline":            hl,
            "description":         desc[:30],
            "call_to_action_type": cta_type,
            "cta_display":         cta,
        })

    out = copy_dir / "assembled.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    return out


@click.command("assemble")
@click.argument("domain")
def cli(domain: str) -> None:
    """Assemble Meta API-ready copy variants from final.json."""
    try:
        out = assemble_copy(domain)
        click.echo(f"Done. Assembled copy written to: {out.resolve()}")
    except FileNotFoundError as exc:
        click.echo(f"Error: {exc}", err=True)
        raise SystemExit(1)
