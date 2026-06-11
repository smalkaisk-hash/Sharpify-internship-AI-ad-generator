"""Load a brand brief from a file or interactive prompt."""
from __future__ import annotations

from pathlib import Path


def load_brief(path: Path) -> str:
    """Read brief text from a file, stripped of leading/trailing whitespace."""
    return Path(path).read_text(encoding="utf-8").strip()


def prompt_brief() -> str:
    """Prompt for multi-line brief input. Two consecutive blank lines end input."""
    print("Paste any extra context about the brand (target audience, offer, tone).")
    print("Press Enter on an empty line twice when done.\n")
    lines: list[str] = []
    blank_run = 0
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line == "":
            blank_run += 1
            if blank_run >= 2:
                break
            continue
        blank_run = 0
        lines.append(line)
    return "\n".join(lines).strip()
