# Architecture

## Canonical Split

- tracked docs and seed artifacts hold durable repo truth
- `runtime/local/` holds mutable local working state
- the dashboard reads and writes through the runtime repository layer

## Stack

- Next.js dashboard at repo root
- TypeScript control-plane logic in `src/lib/`
- bootstrap file-store repository now
- PostgreSQL + durable queue later inside WSL
- WSL runtime clone as the unattended host

## Why Bootstrap File Mode Exists

The repo needed a live control tower immediately.
Bootstrap file mode makes the system runnable now while preserving the path to a stronger WSL/PostgreSQL runtime.

## Future Upgrade Path

1. install PostgreSQL in WSL
2. add the database-backed repository adapter
3. move runtime queues from deterministic local ticks to durable scheduled workers
4. keep the dashboard surface stable while the storage layer changes
