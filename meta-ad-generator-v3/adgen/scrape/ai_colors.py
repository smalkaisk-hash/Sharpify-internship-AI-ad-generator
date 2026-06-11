"""AI-powered CSS color extraction using Claude.

Calls Claude with the full CSS collected from the site and returns structured
color roles (primary, accent, background, text, button, border, gradient).
Falls back silently if ANTHROPIC_API_KEY is not set or the call fails.
"""
from __future__ import annotations

import json
import os
import re

_SYSTEM_PROMPT = """\
Analyze the CSS provided and extract its visual color system accurately. Detect and return:

- Primary brand color(s)
- Secondary/accent colors
- Background colors
- Text colors
- Button/link colors
- Border and UI element colors
- Gradient colors if present

Prioritize colors from:
- CSS variables (:root, custom properties)
- Computed styles of visible elements
- Inline styles
- SVG fills/strokes

Ignore temporary hover states unless explicitly dominant.
Ignore images unless the site heavily relies on image-based branding.

Return colors in HEX only. Also classify each color role.
Detect dark/light theme automatically.
If multiple shades exist, group them into a palette with usage frequency percentages.

Output clean structured JSON only — no markdown, no explanation.
Schema: {"theme": "light|dark", "colors": [{"hex": "#rrggbb", "role": "primary|accent|background|text|button|border|gradient", "frequency": 0.0-1.0}]}
"""

_HEX_RE = re.compile(r"#[0-9a-fA-F]{6}")


def extract_colors_via_ai(css_text: str) -> list[str]:
    """Return a deduplicated list of hex colors extracted by Claude from css_text.

    Returns an empty list if ANTHROPIC_API_KEY is missing, the CSS is too short
    to be useful, or the API call fails for any reason.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key or len(css_text.strip()) < 200:
        return []

    try:
        import anthropic
    except ImportError:
        return []

    # Keep only the most color-dense first 40 KB to stay within token limits.
    css_snippet = css_text[:40_000]

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": f"CSS:\n\n{css_snippet}"}],
        )
        raw = message.content[0].text.strip()
    except Exception:
        return []

    try:
        data = json.loads(raw)
        entries = data.get("colors", [])
        # Sort by frequency descending so highest-impact colors come first.
        entries.sort(key=lambda e: float(e.get("frequency", 0)), reverse=True)
        hexes: list[str] = []
        for entry in entries:
            hex_val = str(entry.get("hex", "")).lower()
            if _HEX_RE.match(hex_val) and hex_val not in hexes:
                hexes.append(hex_val)
        return hexes
    except (json.JSONDecodeError, KeyError, TypeError):
        # Claude returned something we can't parse — fall back gracefully.
        return _HEX_RE.findall(raw)
