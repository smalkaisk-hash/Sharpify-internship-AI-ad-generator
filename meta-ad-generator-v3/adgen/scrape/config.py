from __future__ import annotations

from pathlib import Path
import re

from adgen.config import CLIENTS_ROOT


DEFAULT_OUTPUT_ROOT = CLIENTS_ROOT
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
REQUEST_TIMEOUT = 20
MAX_IMAGES = 100
MAX_PAGES = 12

LOGO_HINTS = ("logo", "brand", "identity", "logotype", "site-logo", "aqqa")
HEADER_HINTS = ("header", "site-header", "navbar", "navigation", "main-nav", "topbar", "brand", "branding")
NON_LOGO_HINTS = (
    "phone", "tel", "telefons", "email", "mail", "epasts", "address", "adrese",
    "search", "cart", "basket", "menu", "facebook", "instagram", "linkedin",
)
PRODUCT_HINTS = (
    "product", "products", "produkts", "produkti", "prece", "preces", "shop", "store",
    "catalog", "katalogs", "sku", "item", "collection", "gallery", "galerija",
    "project", "projects", "projekts", "projekti", "portfolio", "work", "works", "darbi",
)
LOCATION_HINTS = (
    "adrese", "address", "kontakti", "juridiska adrese", "juridiskā adrese",
    "birojs", "office", "headquarters", "location", "streetaddress",
)
INTERNAL_PAGE_HINTS = (
    "about", "par-mums", "par_mums", "par mums", "kas-mes-esam", "komanda",
    "company", "mission", "misija", "vision", "vizija", "vīzija", "values",
    "vertibas", "vērtības", "merki", "mērķi", "uzdevumi", "services",
    "pakalpojumi", "ko-mes-daram", "products", "produkti", "shop", "catalog",
    "katalogs", "contact", "kontakti", "rekviziti", "rekvizīti",
)
SKIP_LINK_HINTS = (
    "google.com/maps", "maps.google", "facebook.com", "instagram.com", "linkedin.com",
    "youtube.com", "tiktok.com", "wa.me", "privacy", "terms", "cookies", "login", "cart", "grozs",
)
LOW_QUALITY_IMAGE_HINTS = (
    "thumb", "thumbnail", "placeholder", "preview", "blur", "lowres", "small", "tiny",
    "lazy", "spinner", "loader",
)
TEXT_SECTION_KEYWORDS = {
    "About / company": ("about", "par mums", "par uzņēmumu", "kas mēs esam", "company", "komanda", "vēsture"),
    "What they do": (
        "ko mēs darām", "pakalpojumi", "services", "risinājumi", "solutions",
        "produkti", "products", "specializējamies", "nodarbojamies",
    ),
    "Mission / vision / goals": (
        "misija", "mission", "vīzija", "vizija", "vision", "mērķis", "mērķi",
        "goal", "goals", "purpose", "uzdevums", "uzdevumi", "vērtības", "values",
    ),
}

IMAGE_URL_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif")
IMG_SOURCE_ATTRS = (
    "data-full", "data-full-src", "data-large", "data-large-src", "data-large_image",
    "data-zoom-image", "data-src", "data-original", "data-lazy-src", "data-bg",
    "data-background", "data-background-image", "src",
)
IMG_SRCSET_ATTRS = ("srcset", "data-srcset", "data-lazy-srcset")

BACKGROUND_URL_RE = re.compile(r"url\((['\"]?)(.*?)\1\)", flags=re.I)
ADDRESS_RE = re.compile(
    r"\b(?:[A-ZĀČĒĢĪĶĻŅŠŪŽ][\wĀČĒĢĪĶĻŅŠŪŽāčēģīķļņšūž'.-]+(?:\s+|,\s*)){1,6}"
    r"(?:iela|gatve|bulvāris|prospekts|laukums|ceļš|street|road|avenue)\s+\d+[A-Za-z]?"
    r"(?:[-/]\d+[A-Za-z]?)?(?:,\s*[\wĀČĒĢĪĶĻŅŠŪŽāčēģīķļņšūž .-]+){0,3}",
    flags=re.I,
)
ADDRESS_LABEL_RE = re.compile(
    r"(?:adrese|address)\s*:\s*([^;\n\r]+?)(?=\s+(?:rekvizīti|rekviziti|bankas dati|jautājiet|contact)|$)",
    flags=re.I,
)
