# .relay/memory/

This directory is managed by [memory](https://github.com/relay-platform/memory) — a structured expertise layer for coding agents.

## Key Commands

- `relay memory init`      — Initialize a .relay/memory directory
- `relay memory add`       — Add a new domain
- `relay memory record`    — Record an expertise record
- `relay memory edit`      — Edit an existing record
- `relay memory query`     — Query expertise records
- `relay memory prime [domain]` — Output a priming prompt (optionally scoped to one domain)
- `relay memory search`   — Search records across domains
- `relay memory status`    — Show domain statistics
- `relay memory validate`  — Validate all records against the schema
- `relay memory prune`     — Remove expired records

## Structure

- `memory.config.yaml` — Configuration file
- `expertise/`        — JSONL files, one per domain

## Configuration

Optional knobs in `memory.config.yaml`:

```yaml
prime:
  default_mode: manifest   # or "full". Omit to let `relay memory prime` auto-flip:
                           # full output until the corpus exceeds 100 records
                           # or 5 domains, then manifest. Set explicitly to pin
                           # one mode. Scoping flags (`--files`, `<domain>`)
                           # always force full.

search:
  boost_factor: 0.1        # multiplier on BM25 scores for confirmed records.
                           # 0 disables (pure BM25). Override with
                           # `relay memory search --no-boost`.
```
