"""Project-wide constants."""
from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CLIENTS_ROOT = PROJECT_ROOT / "clients"

DEFAULT_MAX_PAGES = 12
DEFAULT_MAX_IMAGES = 100
