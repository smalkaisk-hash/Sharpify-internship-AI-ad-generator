"""RenderContext — all data needed to populate an ad template."""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

from adgen import paths


@dataclass
class RenderContext:
    domain: str
    brand_name: str
    language: str
    logo_path: str | None
    photo_path: str | None

    # Palette swatches
    base: str
    second_tone: str
    accents: list[str]
    text_cta_bg: str
    body_text: str
    cta_text: str

    # Copy components
    headlines: list[str] = field(default_factory=list)
    bullets: list[str] = field(default_factory=list)
    base_texts: list[str] = field(default_factory=list)
    on_image_texts: list[str] = field(default_factory=list)
    cta: str = "Book Now"

    # Derived helpers
    @property
    def accent(self) -> str:
        return self.accents[0] if self.accents else self.text_cta_bg

    @property
    def accent2(self) -> str:
        return self.accents[1] if len(self.accents) > 1 else self.accent

    @property
    def short_name(self) -> str:
        """Primary brand name — everything before ' – ', ' | ', or ' - '."""
        for sep in (" – ", " | ", " - ", " — "):
            if sep in self.brand_name:
                return self.brand_name.split(sep)[0].strip()
        return self.brand_name

    def logo_url(self) -> str:
        if self.logo_path:
            p = Path(self.logo_path)
            if p.exists():
                return "file:///" + str(p).replace("\\", "/")
        return ""

    def photo_url(self) -> str:
        if self.photo_path:
            p = Path(self.photo_path).resolve()
            if p.exists():
                return "file:///" + str(p).replace("\\", "/")
        return ""


def load_context(domain: str, photo_path: str | None = None) -> RenderContext:
    """Build a RenderContext from the pipeline outputs for a domain."""
    scrape_dir = paths.scrape_dir(domain)
    copy_dir = paths.copy_dir(domain)
    palette_dir = paths.palette_dir(domain)

    manifest = json.loads((scrape_dir / "manifest.json").read_text(encoding="utf-8"))
    copy = json.loads((copy_dir / "final.json").read_text(encoding="utf-8"))
    palette = json.loads((palette_dir / "chosen.json").read_text(encoding="utf-8"))

    swatches = palette["swatches"]

    return RenderContext(
        domain=domain,
        brand_name=manifest.get("brand_name", domain),
        language=manifest.get("language", "en"),
        logo_path=manifest.get("primary_logo_path"),
        photo_path=photo_path,
        base=swatches.get("base", "#ffffff"),
        second_tone=swatches.get("second_tone") or swatches.get("base", "#ffffff"),
        accents=swatches.get("accents", []),
        text_cta_bg=swatches.get("text_cta_bg", "#222222"),
        body_text=swatches.get("body_text", "#111111"),
        cta_text=swatches.get("cta_text", "#ffffff"),
        headlines=copy.get("headlines", []),
        bullets=copy.get("bullets", []),
        base_texts=copy.get("base_texts", []),
        on_image_texts=copy.get("on_image_texts", []),
        cta=copy.get("cta", "Book Now"),
    )
