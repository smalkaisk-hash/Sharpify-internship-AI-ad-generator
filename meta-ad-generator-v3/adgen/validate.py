"""Quality gate for the copy components JSON produced by Claude in stage 2.

Run as a script:  python -m adgen validate path/to/components.json

Exits 0 if clean, 1 if any issues found. Prints one issue per line to stdout.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import click


LIMITS = {
    "headlines": 40,
    "bullets": 60,
    "base_texts": 220,
    "on_image_texts": 30,
}

REQUIRED_COUNTS = {
    "headlines": 3,
    "bullets": 6,
    "base_texts": 3,
    "on_image_texts": 3,
}

FILLER_OPENERS = (
    # English
    "are you", "do you", "have you", "imagine",
    # Latvian equivalents
    "vai jūs", "vai tu", "iedomājies", "iedomājieties",
)

# Patterns that signal a strong hook (at least one must match headline[0])
_HOOK_NUMBER_RE = re.compile(r"\d")
_HOOK_CONTRAST_RE = re.compile(
    r"\b(stop|quit|never|without|instead|before|after|still|finally|already|"
    r"every|zero|only|no more|why|what if|this is)\b",
    re.IGNORECASE,
)

TESTIMONIAL_QUOTE_MAX = 120
TESTIMONIAL_NAME_MAX = 40
TESTIMONIAL_OUTCOME_MAX = 30

VAGUE_DESCRIPTORS = (
    # English
    "great", "amazing", "best", "quality", "professional",
    "effective", "fast results", "modern", "innovative", "seamless",
    # Latvian
    "efektīvs", "labākais", "kvalitatīvs", "profesionāls",
    "moderns", "inovatīvs",
)


@dataclass
class Issue:
    field: str
    message: str
    level: str = "error"  # "error" blocks the pipeline; "warn" prints but passes


def _check_length(field: str, value: str, limit: int) -> Issue | None:
    if len(value) > limit:
        return Issue(field, f"exceeds max {limit} chars (got {len(value)})")
    return None


def _check_dashes(field: str, value: str) -> Issue | None:
    if " — " in value or " - " in value:
        return Issue(field, "contains dash separator (use period, colon, or comma)")
    return None


def _check_filler_opener(field: str, value: str) -> Issue | None:
    lower = value.lstrip().lower()
    if any(lower.startswith(opener) for opener in FILLER_OPENERS):
        return Issue(field, "opens with filler phrase (lead with the pain, fact, or result)")
    return None


def _check_vague(field: str, value: str) -> Issue | None:
    lower = value.lower()
    hit = next((word for word in VAGUE_DESCRIPTORS if word in lower), None)
    if hit:
        return Issue(field, f"contains vague descriptor '{hit}' — replace with a concrete fact")
    return None


def _check_hook_strength(field: str, value: str) -> Issue | None:
    """Warn if the first headline lacks a strong pattern-interrupt hook."""
    if _HOOK_NUMBER_RE.search(value):
        return None
    if _HOOK_CONTRAST_RE.search(value):
        return None
    return Issue(
        field,
        "weak hook — add a number, contrast word (still/stop/finally/never/without), "
        "or specific pain point to interrupt the scroll",
        level="warn",
    )


def _validate_testimonials(testimonials: list) -> list[Issue]:
    issues: list[Issue] = []
    for i, entry in enumerate(testimonials):
        if not isinstance(entry, dict):
            issues.append(Issue(f"testimonials[{i}]", "must be an object with quote, name, outcome"))
            continue
        quote = entry.get("quote", "")
        name = entry.get("name", "")
        outcome = entry.get("outcome", "")
        if not quote:
            issues.append(Issue(f"testimonials[{i}].quote", "required and cannot be empty"))
        elif len(quote) > TESTIMONIAL_QUOTE_MAX:
            issues.append(Issue(
                f"testimonials[{i}].quote",
                f"exceeds max {TESTIMONIAL_QUOTE_MAX} chars (got {len(quote)})",
            ))
        if not name:
            issues.append(Issue(f"testimonials[{i}].name", "required — use first name + last initial"))
        elif len(name) > TESTIMONIAL_NAME_MAX:
            issues.append(Issue(
                f"testimonials[{i}].name",
                f"exceeds max {TESTIMONIAL_NAME_MAX} chars (got {len(name)})",
            ))
        if outcome and len(outcome) > TESTIMONIAL_OUTCOME_MAX:
            issues.append(Issue(
                f"testimonials[{i}].outcome",
                f"exceeds max {TESTIMONIAL_OUTCOME_MAX} chars (got {len(outcome)})",
            ))
    return issues


def validate_components(components: dict) -> list[Issue]:
    issues: list[Issue] = []

    for category, expected_count in REQUIRED_COUNTS.items():
        values = components.get(category) or []
        if len(values) != expected_count:
            issues.append(Issue(
                category,
                f"expected exactly {expected_count} items (got {len(values)})",
            ))

    for category, limit in LIMITS.items():
        values = components.get(category) or []
        for index, value in enumerate(values):
            field = f"{category}[{index}]"
            if (issue := _check_length(field, value, limit)):
                issues.append(issue)
            if (issue := _check_dashes(field, value)):
                issues.append(issue)
            if category in {"base_texts", "headlines"} and (issue := _check_filler_opener(field, value)):
                issues.append(issue)
            if (issue := _check_vague(field, value)):
                issues.append(issue)
            # Hook strength: check only the first headline
            if category == "headlines" and index == 0:
                if (issue := _check_hook_strength(field, value)):
                    issues.append(issue)

    cta = components.get("cta", "")
    if isinstance(cta, str) and len(cta) > 40:
        issues.append(Issue("cta", f"exceeds max 40 chars (got {len(cta)})"))

    # Testimonials — optional field, validated only when present
    testimonials = components.get("testimonials")
    if testimonials is not None:
        if not isinstance(testimonials, list):
            issues.append(Issue("testimonials", "must be a list"))
        else:
            issues.extend(_validate_testimonials(testimonials))

    return issues


@click.command()
@click.argument("path", type=click.Path(exists=True, dir_okay=False, path_type=Path))
def cli(path: Path) -> None:
    """Validate a copy components JSON file."""
    data = json.loads(path.read_text(encoding="utf-8"))
    issues = validate_components(data)
    errors = [i for i in issues if i.level == "error"]
    warnings = [i for i in issues if i.level == "warn"]
    if warnings:
        click.echo(f"WARN — {len(warnings)} suggestion(s):")
        for issue in warnings:
            click.echo(f"  ⚠  {issue.field}: {issue.message}")
    if not errors:
        click.echo("PASS — no blocking issues found")
        sys.exit(0)
    click.echo(f"FAIL — {len(errors)} issue(s):")
    for issue in errors:
        click.echo(f"  • {issue.field}: {issue.message}")
    sys.exit(1)


if __name__ == "__main__":
    cli()
