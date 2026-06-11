from __future__ import annotations

from adgen.validate import validate_components, Issue


CLEAN: dict = {
    "headlines": [
        "Pay off debt 3x faster",
        "AI tracks every subscription",
        "42,000 users save 280 per month",
    ],
    "bullets": [
        "Connects to 12,000+ banks in 30 seconds",
        "Cancels unused subscriptions automatically",
        "Average user saves 280 per month",
        "No spreadsheets. One dashboard.",
        "Free 30-day trial. No credit card needed.",
        "Bank-level 256-bit encryption",
    ],
    "base_texts": [
        "Most people overspend by 340 per month without realising it. Clarity shows you where it goes and stops it.",
        "42,000 users cut their monthly spend by 280. The app does the tracking. You keep the money.",
        "Try Clarity free for 30 days. No credit card. If it does not save you money in the first month, cancel in two taps.",
    ],
    "on_image_texts": [
        "Stop bleeding money.",
        "280 saved. Every month.",
        "Free 30 days. Real results.",
    ],
    "cta": "Sign Up",
}


def test_clean_components_have_no_issues():
    issues = validate_components(CLEAN)
    assert issues == []


def test_headline_over_40_chars_flagged():
    bad = {**CLEAN, "headlines": ["x" * 41, *CLEAN["headlines"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "headlines[0]" and "40" in i.message for i in issues)


def test_bullet_over_60_chars_flagged():
    bad = {**CLEAN, "bullets": ["x" * 61, *CLEAN["bullets"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "bullets[0]" and "60" in i.message for i in issues)


def test_base_text_over_220_chars_flagged():
    bad = {**CLEAN, "base_texts": ["x" * 221, *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "base_texts[0]" and "220" in i.message for i in issues)


def test_on_image_text_over_30_chars_flagged():
    bad = {**CLEAN, "on_image_texts": ["x" * 31, *CLEAN["on_image_texts"][1:]]}
    issues = validate_components(bad)
    assert any(i.field == "on_image_texts[0]" and "30" in i.message for i in issues)


def test_em_dash_separator_flagged():
    bad = {**CLEAN, "base_texts": ["A long claim — with em dash separator here, definitely.", *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any("dash" in i.message.lower() for i in issues)


def test_hyphen_separator_flagged():
    bad = {**CLEAN, "base_texts": ["A long claim - with hyphen separator here, definitely.", *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any("dash" in i.message.lower() for i in issues)


def test_filler_opener_flagged():
    bad = {**CLEAN, "base_texts": ["Are you tired of overspending every single month, friend?", *CLEAN["base_texts"][1:]]}
    issues = validate_components(bad)
    assert any("filler" in i.message.lower() or "opener" in i.message.lower() for i in issues)


def test_vague_descriptor_flagged():
    bad = {**CLEAN, "bullets": ["Great service that gives you amazing results.", *CLEAN["bullets"][1:]]}
    issues = validate_components(bad)
    assert any("vague" in i.message.lower() for i in issues)


def test_issue_dataclass_fields():
    bad = {**CLEAN, "headlines": ["x" * 50, *CLEAN["headlines"][1:]]}
    issues = validate_components(bad)
    issue = issues[0]
    assert isinstance(issue, Issue)
    assert isinstance(issue.field, str)
    assert isinstance(issue.message, str)


# ── Count validation ─────────────────────────────────────────────────────────

def test_too_few_headlines_flagged():
    bad = {**CLEAN, "headlines": ["Only one headline"]}
    issues = validate_components(bad)
    assert any(i.field == "headlines" and "expected exactly 3" in i.message for i in issues)


def test_too_many_bullets_flagged():
    bad = {**CLEAN, "bullets": [*CLEAN["bullets"], "Seventh bullet extra"]}
    issues = validate_components(bad)
    assert any(i.field == "bullets" and "expected exactly 6" in i.message for i in issues)


def test_missing_field_flagged():
    bad = {k: v for k, v in CLEAN.items() if k != "on_image_texts"}
    issues = validate_components(bad)
    assert any(i.field == "on_image_texts" and "expected exactly 3" in i.message for i in issues)


def test_correct_counts_pass():
    issues = validate_components(CLEAN)
    count_issues = [i for i in issues if "expected exactly" in i.message]
    assert count_issues == []
