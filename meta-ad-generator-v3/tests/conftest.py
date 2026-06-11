"""Shared pytest fixtures."""
from __future__ import annotations

import pytest


@pytest.fixture
def tmp_clients_root(tmp_path, monkeypatch):
    """Redirect CLIENTS_ROOT to a temp directory for the duration of a test."""
    from adgen import config
    monkeypatch.setattr(config, "CLIENTS_ROOT", tmp_path)
    return tmp_path
