#!/usr/bin/env python3
"""dnstest -- measure DNS resolver response times from the terminal.

Queries one or more DNS resolvers for a given domain and reports how long
each resolver took to answer. Fast, dependency-light, and easy to script.

Examples:
    dnstest example.com                        # table across the default resolvers
    dnstest example.com --type AAAA            # query IPv6 addresses
    dnstest api.example.com --resolvers 9.9.9.9,149.112.112.112
    dnstest example.com --count 5 --json       # JSON for scripts

Exit codes:
    0  at least one resolver answered
    1  every resolver failed (timeout/network error)
    2  usage error (bad flags, bad domain, unknown resolver)
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass
from typing import Optional

# ---------------------------------------------------------------------------
# Dependencies (install with: pip install dnspython colorama)
# ---------------------------------------------------------------------------
import dns.exception
import dns.message
import dns.query
import dns.rcode
import dns.rdatatype
from colorama import Fore, Style, init

__version__ = "1.0.0"

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Sensible public resolvers used when --resolvers is not given.
DEFAULT_RESOLVERS = [
    # (label, IP)
    ("Cloudflare", "1.1.1.1"),
    ("Google", "8.8.8.8"),
    ("Quad9", "9.9.9.9"),
    ("OpenDNS", "208.67.222.222"),
]

# Record types we offer. Kept to common ones to keep the tool focused.
QUERY_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "PTR"]

# Exit codes (documented in --help).
EXIT_OK = 0       # at least one resolver answered
EXIT_FAILED = 1   # every resolver failed
EXIT_USAGE = 2    # bad arguments (argparse default)

# Statuses we report per resolver.
STATUS_OK = "OK"          # NOERROR
STATUS_TIMEOUT = "TIMEOUT"
STATUS_ERROR = "ERROR"

VALID_DOMAIN = re.compile(
    r"^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?)*\.?$",
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# Terminal coloring (cross-platform via colorama). A single flag toggles it.
# ---------------------------------------------------------------------------

USE_COLOR = True


def enable_color(flag: bool) -> None:
    global USE_COLOR
    USE_COLOR = flag
    if flag:
        init()


def c(text: str, code: str) -> str:
    """Wrap ``text`` in an ANSI color code, or return it plain when disabled."""
    return f"{code}{text}{Style.RESET_ALL}" if USE_COLOR else text


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class ResolverResult:
    """The outcome of probing one resolver for a domain."""

    name: str
    ip: str
    status: str                    # OK / NXDOMAIN / SERVFAIL / TIMEOUT / ERROR…
    times_ms: list[float]          # successful round-trips, in milliseconds
    attempted: int                 # how many queries were made
    detail: Optional[str] = None   # extra info (e.g. the error message)

    @property
    def failed(self) -> bool:
        return self.status in (STATUS_TIMEOUT, STATUS_ERROR)

    @property
    def avg_ms(self) -> Optional[float]:
        return _mean(self.times_ms)

    @property
    def min_ms(self) -> Optional[float]:
        return min(self.times_ms) if self.times_ms else None

    @property
    def max_ms(self) -> Optional[float]:
        return max(self.times_ms) if self.times_ms else None


@dataclass
class Summary:
    """Aggregate statistics across every resolver tested."""

    resolvers: int
    ok: int
    failed: int
    min_ms: Optional[float]
    max_ms: Optional[float]
    avg_ms: Optional[float]


def _mean(values: list[float]) -> Optional[float]:
    return sum(values) / len(values) if values else None


# ---------------------------------------------------------------------------
# Parsing & validation
# ---------------------------------------------------------------------------


def positive_int(value: str) -> int:
    """argparse type for integers that must be >= 1."""
    try:
        number = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError(f"expected an integer, got {value!r}")
    if number < 1:
        raise argparse.ArgumentTypeError(f"expected a positive integer, got {number}")
    return number


def timeout_value(value: str) -> float:
    """argparse type for a timeout in seconds (must be > 0)."""
    try:
        seconds = float(value)
    except ValueError:
        raise argparse.ArgumentTypeError(f"expected a number of seconds, got {value!r}")
    if seconds <= 0:
        raise argparse.ArgumentTypeError(f"timeout must be > 0, got {seconds}")
    return seconds


def split_resolvers(values: list[str]) -> list[str]:
    """Turn --resolvers input (repeatable, comma-separated) into one list.

    >>> split_resolvers(["9.9.9.9,149.112.112.112", "1.1.1.1"])
    ['9.9.9.9', '149.112.112.112', '1.1.1.1']
    """
    resolvers: list[str] = []
    for value in values:
        for item in value.split(","):
            item = item.strip()
            if not item:
                continue
            if not is_ipv4_or_host(item):
                raise argparse.ArgumentTypeError(f"invalid resolver address: {item!r}")
            if item not in resolvers:  # de-duplicate, keep order
                resolvers.append(item)
    return resolvers


def is_ipv4_or_host(value: str) -> bool:
    """Accept a dotted-quad IPv4 address or a plain hostname."""
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", value):
        return all(0 <= int(part) <= 255 for part in value.split("."))
    return bool(re.fullmatch(r"[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?)*", value, re.IGNORECASE))


def validate_domain(domain: str) -> str:
    """Reject an obviously invalid domain name (raises ValueError)."""
    if len(domain) > 253:
        raise ValueError("domain name is too long (max 253 characters)")
    if not VALID_DOMAIN.fullmatch(domain):
        raise ValueError(
            "invalid domain name. Expected something like 'example.com' (no scheme, no spaces)."
        )
    return domain.strip(".")


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="dnstest",
        description="Measure DNS resolver response times from the terminal.",
        epilog=(
            "Exit codes: 0 = at least one resolver answered, "
            "1 = all resolvers failed, 2 = usage error."
        ),
    )
    parser.add_argument(
        "domain",
        metavar="DOMAIN",
        nargs="?",
        help="domain to query (e.g. example.com)",
    )
    parser.add_argument(
        "--resolvers",
        metavar="IP[,IP...]",
        action="append",
        help=(
            "resolver(s) to test; comma-separated or repeated. "
            "Defaults to the built-in public set (see --list-resolvers)."
        ),
    )
    parser.add_argument(
        "--type",
        dest="qtype",
        default="A",
        choices=QUERY_TYPES,
        help=f"record type to query (default: %(default)s)",
    )
    parser.add_argument(
        "--timeout",
        type=timeout_value,
        default=2.0,
        metavar="SECONDS",
        help="seconds to wait per query (default: %(default)s)",
    )
    parser.add_argument(
        "--count",
        type=positive_int,
        default=1,
        metavar="N",
        help="query each resolver N times and report min/avg/max (default: %(default)s)",
    )
    parser.add_argument("--json", action="store_true", help="print results as JSON (for scripts)")
    parser.add_argument("--quiet", action="store_true", help="print only the result lines")
    parser.add_argument("--no-color", action="store_true", help="disable colored output")
    parser.add_argument(
        "--list-resolvers", action="store_true", help="list the built-in resolvers and exit"
    )
    parser.add_argument(
        "--version", action="version", version=f"%(prog)s {__version__}"
    )
    return parser


# ---------------------------------------------------------------------------
# Probing
# ---------------------------------------------------------------------------


@dataclass
class _QueryAttempt:
    """One individual DNS round-trip against one resolver."""

    status: str
    rcode_text: Optional[str]
    elapsed_ms: Optional[float]
    detail: Optional[str] = None


def single_query(
    domain: str, qtype: str, resolver_ip: str, timeout: float
) -> _QueryAttempt:
    """Run one UDP DNS query and time it. Never raises for network problems."""
    try:
        question = dns.message.make_query(domain, qtype)
        started = time.perf_counter()
        response = dns.query.udp(question, resolver_ip, timeout=timeout)
        elapsed_ms = (time.perf_counter() - started) * 1000.0

        rcode = response.rcode()
        rcode_text = dns.rcode.to_text(rcode)
        if rcode == dns.rcode.NOERROR:
            return _QueryAttempt(STATUS_OK, rcode_text, elapsed_ms)
        # NXDOMAIN / SERVFAIL / REFUSED… — a valid answer, just not NOERROR.
        return _QueryAttempt(rcode_text, rcode_text, elapsed_ms)
    except dns.exception.Timeout:
        return _QueryAttempt(STATUS_TIMEOUT, None, None, "no answer within timeout")
    except OSError as exc:
        return _QueryAttempt(STATUS_ERROR, None, None, str(exc) or exc.__class__.__name__)


def probe_resolver(
    name: str, ip: str, domain: str, qtype: str, timeout: float, count: int
) -> ResolverResult:
    """Probe one resolver ``count`` times and collect the timings."""
    last = _QueryAttempt(STATUS_ERROR, None, None, "no queries attempted")
    times: list[float] = []

    for _ in range(count):
        last = single_query(domain, qtype, ip, timeout)
        if last.elapsed_ms is not None:  # any DNS reply counts as a timing
            times.append(last.elapsed_ms)

    return ResolverResult(
        name=name,
        ip=ip,
        status=last.status,
        times_ms=times,
        attempted=count,
        detail=last.detail,
    )


def build_resolver_list(args) -> list[tuple[str, str]]:
    """Return (label, ip) pairs to test. Uses --resolvers when provided."""
    if args.resolvers:
        return [("", ip) for ip in split_resolvers(args.resolvers)]
    return DEFAULT_RESOLVERS


def build_summary(results: list[ResolverResult]) -> Summary:
    all_times = [ms for r in results for ms in r.times_ms]
    return Summary(
        resolvers=len(results),
        ok=sum(1 for r in results if not r.failed),
        failed=sum(1 for r in results if r.failed),
        min_ms=min(all_times) if all_times else None,
        max_ms=max(all_times) if all_times else None,
        avg_ms=_mean(all_times) if all_times else None,
    )


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------


def _format_ms(value: Optional[float]) -> str:
    return f"{value:.1f}" if value is not None else "-"


def _sort_key(result: ResolverResult):
    # Answers first (fastest first); failures at the bottom.
    return (int(result.failed), result.avg_ms if result.avg_ms is not None else float("inf"))


def _status_color(status: str) -> str:
    if status == STATUS_OK:
        return Fore.GREEN
    if status in (STATUS_TIMEOUT, STATUS_ERROR, "REFUSED", "SERVFAIL"):
        return Fore.RED if status in (STATUS_TIMEOUT, STATUS_ERROR) else Fore.YELLOW
    if status == "NXDOMAIN":
        return Fore.YELLOW
    return Fore.YELLOW


def render_table(args, domain: str, results: list[ResolverResult], summary: Summary) -> str:
    """Human-readable table, sorted by speed."""
    lines: list[str] = []
    header = f"Querying {domain} ({args.qtype}), {len(results)} resolver(s)"
    lines.append(c(header, Style.BRIGHT))
    lines.append("")

    rows = sorted(results, key=_sort_key)

    # Build the table with a fixed simple monospace layout. Column widths are
    # computed from the *plain* text (ANSI codes would inflate them), and
    # colors are applied after padding.
    headers = ["resolver", "status", "avg ms", "min ms", "max ms"]
    plain_rows = [
        [
            f"{row.name + ' ' if row.name else ''}{row.ip}",
            row.status,
            _format_ms(row.avg_ms),
            _format_ms(row.min_ms),
            _format_ms(row.max_ms),
        ]
        for row in rows
    ]

    widths = [10, 10, 8, 8, 8]
    for i in range(len(headers)):
        widths[i] = max(widths[i], len(headers[i]))
        for plain_row in plain_rows:
            widths[i] = max(widths[i], len(plain_row[i]))

    def pad(cell: str, width: int) -> str:
        return cell.ljust(width)

    lines.append(
        "  ".join(c(pad(header, w), Fore.CYAN) for header, w in zip(headers, widths))
    )
    lines.append("  ".join("-" * w for w in widths))
    for i, plain_row in enumerate(plain_rows):
        cells = plain_row[:]
        cells[1] = c(pad(cells[1], widths[1]), _status_color(rows[i].status))
        parts = [
            cells[1] if col == 1 else pad(cells[col], widths[col])
            for col in range(len(headers))
        ]
        lines.append("  ".join(parts))

    if summary.resolvers > 1:
        lines.append("")
        lines.append(
            c(
                "summary  "
                f"avg {_format_ms(summary.avg_ms)} ms  "
                f"min {_format_ms(summary.min_ms)} ms  "
                f"max {_format_ms(summary.max_ms)} ms  "
                f"({summary.ok} ok, {summary.failed} failed)",
                Style.DIM,
            )
        )
    return "\n".join(lines)


def render_quiet(results: list[ResolverResult]) -> str:
    """One line per resolver — scripting-friendly without JSON."""
    lines: list[str] = []
    for row in sorted(results, key=_sort_key):
        status = c(f"{row.status:<10}", _status_color(row.status))
        lines.append(
            f"{row.name + ' ' if row.name else ''}{row.ip:<16} "
            f"{status} {_format_ms(row.avg_ms)} ms"
        )
    return "\n".join(lines)


def result_to_dict(result: ResolverResult) -> dict:
    return {
        "name": result.name,
        "resolver": result.ip,
        "status": result.status,
        "detail": result.detail,
        "attempted": result.attempted,
        "times_ms": result.times_ms,
        "avg_ms": result.avg_ms,
        "min_ms": result.min_ms,
        "max_ms": result.max_ms,
    }


def build_json(domain: str, qtype: str, results: list[ResolverResult], summary: Summary, count: int, timeout: float) -> dict:
    return {
        "domain": domain,
        "qtype": qtype,
        "count": count,
        "timeout": timeout,
        "resolvers": [result_to_dict(r) for r in sorted(results, key=_sort_key)],
        "summary": {
            "resolvers": summary.resolvers,
            "ok": summary.ok,
            "failed": summary.failed,
            "min_ms": summary.min_ms,
            "max_ms": summary.max_ms,
            "avg_ms": summary.avg_ms,
        },
    }


# ---------------------------------------------------------------------------
# Entry points
# ---------------------------------------------------------------------------


def run(args) -> int:
    assert args.domain is not None  # cli() enforces this before calling run()
    domain = validate_domain(args.domain)
    resolvers = build_resolver_list(args)

    results = [probe_resolver(name, ip, domain, args.qtype, args.timeout, args.count)
               for name, ip in resolvers]
    summary = build_summary(results)

    if args.json:
        print(json.dumps(build_json(domain, args.qtype, results, summary, args.count, args.timeout), indent=2))
    elif args.quiet:
        print(render_quiet(results))
    else:
        print(render_table(args, domain, results, summary))

    return EXIT_OK if summary.ok else EXIT_FAILED


def cli(argv: Optional[list[str]] = None) -> int:
    """Console-script entry point. Returns the process exit code."""
    parser = build_arg_parser()
    args = parser.parse_args(argv)
    enable_color(not args.no_color)

    if args.list_resolvers:
        if args.domain:
            parser.error("--list-resolvers takes no DOMAIN argument")
        lines = [f"{name:<12} {ip}" for name, ip in DEFAULT_RESOLVERS]
        print("built-in public resolvers:")
        print("\n".join(lines))
        return EXIT_OK

    if not args.domain:
        parser.error("the following arguments are required: DOMAIN")

    try:
        return run(args)
    except (ValueError, argparse.ArgumentTypeError) as exc:
        parser.error(str(exc))  # prints usage + message, exits with code 2
        lines = [f"{name:<12} {ip}" for name, ip in DEFAULT_RESOLVERS]
        print("built-in public resolvers:")
        print("\n".join(lines))
        return EXIT_OK

    try:
        return run(args)
    except (ValueError, argparse.ArgumentTypeError) as exc:
        parser.error(str(exc))  # prints usage + message, exits with code 2


if __name__ == "__main__":
    sys.exit(cli())
