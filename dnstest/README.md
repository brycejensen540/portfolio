# DNStest

A small, fast command-line tool that measures **DNS resolver response times** —
handy for picking a resolver, debugging a slow connection, or settling an
argument about who's fastest.

```
$ dnstest example.com
Querying example.com (A), 4 resolver(s)

resolver             status     avg ms   min ms   max ms
Cloudflare 1.1.1.1   OK           4.2      3.8      4.9
Quad9 9.9.9.9        OK           5.1      4.6      5.9
Google 8.8.8.8       OK           7.3      6.5      8.0
OpenDNS 208.67.222.222 OK         9.8      9.1     10.6

summary  avg 6.6 ms  min 3.8 ms  max 10.6 ms  (4 ok, 0 failed)
```

## Requirements

- Python 3.10+
- [`dnspython`](https://pypi.org/project/dnspython/) (DNS queries)
- [`colorama`](https://pypi.org/project/colorama/) (cross-platform terminal colors)

## Install

```bash
# From PyPI (once published)
pip install dnstest

# Or from source
cd dnstest
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install .
```

That gives you a `dnstest` command. You can also run the module directly:
`python -m dnstest example.com`, or `python dnstest.py example.com`.

## Usage

```
dnstest DOMAIN [options]
```

| Flag | Meaning | Default |
| --- | --- | --- |
| `--resolvers IP[,IP...]` | resolvers to test (comma-separated or repeated) | built-in public set |
| `--type TYPE` | record type: A, AAAA, CNAME, MX, NS, TXT, SOA, PTR | `A` |
| `--timeout SECONDS` | seconds to wait per query | `2.0` |
| `--count N` | query each resolver N times, report min/avg/max | `1` |
| `--json` | machine-readable JSON output | off |
| `--quiet` | print only the per-resolver result lines | off |
| `--no-color` | disable ANSI colors | off |
| `--list-resolvers` | list the built-in public resolvers and exit | – |
| `--help` / `--version` | help / version | – |

Built-in public resolvers: **Cloudflare** `1.1.1.1`, **Google** `8.8.8.8`,
**Quad9** `9.9.9.9`, **OpenDNS** `208.67.222.222`.

### Examples

```bash
dnstest example.com
dnstest example.com --type AAAA
dnstest api.example.com --resolvers 9.9.9.9,149.112.112.112
dnstest example.com --resolvers 1.1.1.1 --resolvers 8.8.8.8 --count 5
dnstest example.com --json | jq '.summary'
dnstest example.com --quiet --no-color > results.txt
dnstest --list-resolvers
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | at least one resolver answered |
| `1` | every resolver failed (timeout / network error) |
| `2` | usage error (bad flags, bad domain, invalid resolver) |

Note: `NXDOMAIN` (and other record-level replies like `SERVFAIL`/`REFUSED`)
still count as **answered** — the resolver responded, which is what we're
measuring. Only timeouts and hard network failures make a resolver "failed".

## Errors

- Invalid domain → usage error (`exit 2`), before any network traffic.
- Per-resolver timeouts/network errors are caught and reported in the table
  (status `TIMEOUT` / `ERROR`, with the underlying message) instead of
  crashing the whole run.

## Development

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
python -m pytest            # the suite mocks the network, so it's offline-safe
```

## Project layout

```
dnstest/
├── dnstest.py          # the whole CLI: parsing, probing, rendering
├── pyproject.toml      # packaging; console script: dnstest = dnstest:cli
├── tests/
│   └── test_dnstest.py # unit tests (network mocked)
├── README.md
└── site/               # companion static website (see site/README.md)
    ├── index.html
    ├── src/styles.css
    └── ...
```

The tool intentionally stays single-file and dependency-light: argparse for
flags, `dns.query.udp()` for one exact round-trip per measurement, and a
small hand-rolled table renderer. No config files, no database, no server.

## Website

The companion landing page (pure-black terminal aesthetic) lives in
[`site/`](site/) — see [`site/README.md`](site/README.md) for build steps.

## License

Not yet decided — add a `LICENSE` file here before public release.