from __future__ import annotations

from pathlib import Path

import pytest

from adgen import brief


def test_load_from_file_reads_contents(tmp_path: Path):
    target = tmp_path / "brief.txt"
    target.write_text("Premium spa builder targeting affluent homeowners.\n", encoding="utf-8")
    assert brief.load_brief(target) == "Premium spa builder targeting affluent homeowners."


def test_load_from_file_missing_raises(tmp_path: Path):
    with pytest.raises(FileNotFoundError):
        brief.load_brief(tmp_path / "missing.txt")


def test_prompt_brief_reads_multiline_until_blank(monkeypatch):
    lines = iter(["First line.", "Second line.", "", ""])
    monkeypatch.setattr("builtins.input", lambda *_args, **_kwargs: next(lines))
    result = brief.prompt_brief()
    assert result == "First line.\nSecond line."
