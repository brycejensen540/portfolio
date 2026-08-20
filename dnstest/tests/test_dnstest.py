"""Unit tests for the dnstest CLI.

The DNS probing itself is mocked (no network), so the suite is fast and
deterministic. Run with:  python -m pytest
"""

import argparse
import json

import pytest

import dnstest
from dnstest import (
    EXIT_FAILED,
    EXIT_OK,
    STATUS_ERROR,
    STATUS_OK,
    STATUS_TIMEOUT,
    ResolverResult,
    build_arg_parser,
    build_resolver_list,
    build_summary,
    cli,
    probe_resolver,
    render_quiet,
    render_table,
    split_resolvers,
    validate_domain,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def make_result(status=STATUS_OK, times=(10.0,), name="", ip="1.1.1.1", attempted=1):
    return ResolverResult(
        name=name, ip=ip, status=status, times_ms=list(times), attempted=attempted
    )


class FakeResponse:
    """Stand-in for dns.message.Message that answers with a fixed RCODE."""

    def __init__(self, rcode):
        self._rcode = rcode

    def rcode(self):
        return self._rcode


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------


def test_split_resolvers_handles_commas_and_repeats():
    assert split_resolvers(["9.9.9.9,149.112.112.112", "1.1.1.1"]) == [
        "9.9.9.9",
        "149.112.112.112",
        "1.1.1.1",
    ]


def test_split_resolvers_deduplicates_and_strips():
    assert split_resolvers([" 1.1.1.1 ,8.8.8.8", "1.1.1.1"]) == ["1.1.1.1", "8.8.8.8"]


def test_split_resolvers_rejects_garbage():
    with pytest.raises(argparse.ArgumentTypeError):
        split_resolvers(["not an ip!"])


def test_validate_domain_accepts_common_names():
    assert validate_domain("example.com") == "example.com"
    assert validate_domain("sub.deep.example.com.") == "sub.deep.example.com"
    assert validate_domain("my-site.io") == "my-site.io"


def test_validate_domain_rejects_bad_input():
    for bad in ["", "-bad.com", "exa mple.com", "https://example.com", "exa..mple.com"]:
        with pytest.raises(ValueError):
            validate_domain(bad)


def test_build_resolver_list_default_and_custom(monkeypatch):
    args = build_arg_parser().parse_args(["example.com"])
    assert build_resolver_list(args) == dnstest.DEFAULT_RESOLVERS

    args = build_arg_parser().parse_args(
        ["example.com", "--resolvers", "9.9.9.9,149.112.112.112"]
    )
    assert build_resolver_list(args) == [("", "9.9.9.9"), ("", "149.112.112.112")]


# ---------------------------------------------------------------------------
# Probing (mocked network)
# ---------------------------------------------------------------------------


def test_probe_resolver_ok(monkeypatch):
    monkeypatch.setattr(
        dnstest, "single_query",
        lambda *a, **k: dnstest._QueryAttempt(STATUS_OK, "NOERROR", 7.5),
    )
    result = probe_resolver("Cloudflare", "1.1.1.1", "example.com", "A", 2.0, 3)
    assert result.status == STATUS_OK
    assert result.times_ms == [7.5, 7.5, 7.5]
    assert result.attempted == 3
    assert result.avg_ms == 7.5


def test_probe_resolver_timeout(monkeypatch):
    monkeypatch.setattr(
        dnstest, "single_query",
        lambda *a, **k: dnstest._QueryAttempt(STATUS_TIMEOUT, None, None, "no answer within timeout"),
    )
    result = probe_resolver("Google", "8.8.8.8", "example.com", "A", 2.0, 1)
    assert result.status == STATUS_TIMEOUT
    assert result.failed is True
    assert result.times_ms == []


def test_single_query_ok(monkeypatch):
    def fake_udp(question, where, timeout):
        return FakeResponse(dnstest.dns.rcode.NOERROR)

    monkeypatch.setattr(dnstest.dns.query, "udp", fake_udp)
    attempt = dnstest.single_query("example.com", "A", "1.1.1.1", 2.0)
    assert attempt.status == STATUS_OK
    assert attempt.elapsed_ms is not None and attempt.elapsed_ms >= 0


def test_single_query_nxdomain(monkeypatch):
    monkeypatch.setattr(
        dnstest.dns.query, "udp",
        lambda q, where, timeout: FakeResponse(dnstest.dns.rcode.NXDOMAIN),
    )
    attempt = dnstest.single_query("nonexistent.example", "A", "1.1.1.1", 2.0)
    assert attempt.status == "NXDOMAIN"
    assert attempt.elapsed_ms is not None  # the round-trip still happened


def test_single_query_timeout(monkeypatch):
    def raise_timeout(question, where, timeout):
        raise dnstest.dns.exception.Timeout()

    monkeypatch.setattr(dnstest.dns.query, "udp", raise_timeout)
    attempt = dnstest.single_query("example.com", "A", "1.1.1.1", 2.0)
    assert attempt.status == STATUS_TIMEOUT
    assert attempt.elapsed_ms is None


def test_single_query_network_error(monkeypatch):
    def raise_oserror(question, where, timeout):
        raise ConnectionRefusedError("refused")

    monkeypatch.setattr(dnstest.dns.query, "udp", raise_oserror)
    attempt = dnstest.single_query("example.com", "A", "1.1.1.1", 2.0)
    assert attempt.status == STATUS_ERROR
    assert "refused" in attempt.detail


# ---------------------------------------------------------------------------
# Aggregation & rendering
# ---------------------------------------------------------------------------


def test_summary_statistics():
    summary = build_summary(
        [
            make_result(times=[10.0, 20.0]),
            make_result(times=[30.0]),
            make_result(status=STATUS_TIMEOUT, times=[]),
        ]
    )
    assert summary.resolvers == 3
    assert summary.ok == 2
    assert summary.failed == 1
    assert summary.min_ms == 10.0
    assert summary.max_ms == 30.0
    assert summary.avg_ms == 20.0


def test_render_table_sorts_fastest_first(monkeypatch):
    monkeypatch.setattr(dnstest, "USE_COLOR", False)
    args = build_arg_parser().parse_args(["example.com"])
    results = [
        make_result(times=[50.0], name="Slow", ip="9.9.9.9"),
        make_result(times=[12.0], name="Fast", ip="1.1.1.1"),
        make_result(status=STATUS_ERROR, times=[], name="Down", ip="10.0.0.1"),
    ]
    summary = build_summary(results)
    table = render_table(args, "example.com", results, summary)
    # Fastest answer first, then the slow one, failures last
    assert table.index("Fast") < table.index("Slow") < table.index("Down")
    assert "resolver" in table and "avg ms" in table


def test_render_quiet_single_line_per_resolver(monkeypatch):
    monkeypatch.setattr(dnstest, "USE_COLOR", False)
    results = [make_result(times=[12.0], name="Cloudflare", ip="1.1.1.1")]
    out = render_quiet(results)
    assert "Cloudflare" in out and "12.0 ms" in out


def test_json_round_trip(monkeypatch, capsys):
    monkeypatch.setattr(
        dnstest, "probe_resolver",
        lambda name, ip, domain, qtype, timeout, count: make_result(
            status=STATUS_OK, times=[15.0], name=name, ip=ip, attempted=count
        ),
    )
    assert cli(["example.com", "--json"]) == EXIT_OK
    payload = json.loads(capsys.readouterr().out)
    assert payload["domain"] == "example.com"
    assert payload["qtype"] == "A"
    assert payload["resolvers"][0]["status"] == "OK"
    assert payload["summary"]["ok"] == len(payload["resolvers"])


# ---------------------------------------------------------------------------
# Exit codes
# ---------------------------------------------------------------------------


def test_exit_ok_when_any_resolver_answers(monkeypatch):
    monkeypatch.setattr(
        dnstest, "probe_resolver",
        lambda *a, **k: make_result(status=STATUS_OK, times=[10.0]),
    )
    assert cli(["example.com", "--quiet"]) == EXIT_OK


def test_exit_failed_when_everything_times_out(monkeypatch):
    monkeypatch.setattr(
        dnstest, "probe_resolver",
        lambda *a, **k: make_result(status=STATUS_TIMEOUT, times=[]),
    )
    assert cli(["example.com", "--quiet"]) == EXIT_FAILED


def test_exit_usage_on_bad_domain(capsys):
    with pytest.raises(SystemExit) as exc_info:
        cli(["not a domain"])
    assert exc_info.value.code == 2


def test_exit_usage_on_unknown_flag():
    with pytest.raises(SystemExit) as exc_info:
        cli(["example.com", "--nope"])
    assert exc_info.value.code == 2


def test_list_resolvers_no_network(capsys):
    assert cli(["--list-resolvers"]) == EXIT_OK
    out = capsys.readouterr().out
    assert "Cloudflare" in out and "8.8.8.8" in out


def test_list_resolvers_rejects_a_domain():
    with pytest.raises(SystemExit) as exc_info:
        cli(["example.com", "--list-resolvers"])
    assert exc_info.value.code == 2


def test_missing_domain_is_a_usage_error():
    with pytest.raises(SystemExit) as exc_info:
        cli([])
    assert exc_info.value.code == 2


# ---------------------------------------------------------------------------
# CLI surface
# ---------------------------------------------------------------------------


def test_version_flag(capsys):
    with pytest.raises(SystemExit) as exc_info:
        cli(["--version"])
    assert exc_info.value.code == 0
    assert "dnstest" in capsys.readouterr().out


def test_default_qtype_is_a():
    args = build_arg_parser().parse_args(["example.com"])
    assert args.qtype == "A"


def test_quiet_and_json_are_mutually_accepted_flags():
    args = build_arg_parser().parse_args(["example.com", "--quiet", "--json"])
    assert args.quiet and args.json