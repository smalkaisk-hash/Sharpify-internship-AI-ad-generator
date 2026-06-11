"""File layout helpers anchored under `config.CLIENTS_ROOT`.

Importing `config.CLIENTS_ROOT` at call time (rather than at import time)
lets tests monkeypatch the root.
"""
from __future__ import annotations

from pathlib import Path

from . import config


def client_dir(domain: str) -> Path:
    return config.CLIENTS_ROOT / domain


def scrape_dir(domain: str) -> Path:
    return client_dir(domain) / "scrape"


def copy_dir(domain: str) -> Path:
    return client_dir(domain) / "copy"


def palette_dir(domain: str) -> Path:
    return client_dir(domain) / "palette"


def brief_path(domain: str) -> Path:
    return client_dir(domain) / "brief.txt"


def assembled_path(domain: str) -> Path:
    return copy_dir(domain) / "assembled.json"


def image_dir(domain: str) -> Path:
    return client_dir(domain) / "image"


def generated_image_path(domain: str) -> Path:
    return image_dir(domain) / "generated.jpg"


def ensure_client_dirs(domain: str) -> None:
    for path in (scrape_dir(domain), copy_dir(domain), palette_dir(domain), image_dir(domain)):
        path.mkdir(parents=True, exist_ok=True)
