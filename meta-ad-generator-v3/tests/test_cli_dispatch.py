from __future__ import annotations

from click.testing import CliRunner

from adgen.__main__ import cli


def test_cli_lists_three_subcommands():
    result = CliRunner().invoke(cli, ["--help"])
    assert result.exit_code == 0
    for cmd in ("scrape", "validate", "palette"):
        assert cmd in result.output


def test_validate_subcommand_runs_on_clean_file(tmp_path):
    import json
    from tests.test_validate import CLEAN

    file = tmp_path / "components.json"
    file.write_text(json.dumps(CLEAN), encoding="utf-8")
    result = CliRunner().invoke(cli, ["validate", str(file)])
    assert result.exit_code == 0, result.output
    assert "PASS" in result.output
