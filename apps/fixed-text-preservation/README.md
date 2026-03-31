# Fixed-Text Preservation MVP

Standalone Next.js 16 app for the Qur'an-first Fixed-Text Preservation MVP.

## Run

```bash
npm install
npm run dev
```

Run commands from `apps/fixed-text-preservation`.

## Scope

- manual ayah-bounded passage definitions
- acquisition gate before active preservation tracking
- human-entered review events with explicit verification mode
- deterministic preservation state and due ordering
- local-first SQLite persistence for one local user

## Local reference package

- pinned package: `quran-json@3.1.2`
- local manifest: `data/quran-reference/manifest.json`
- local seed data: `data/quran-reference/provisional-quran-reference.json`
- adapter boundary: `src/lib/quran-reference/adapter.ts`

The reference package is provisional and intentionally isolated so it can later
be swapped for `kr` without changing product behavior.
