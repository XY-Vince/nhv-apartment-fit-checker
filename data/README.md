# Published Research Data

These files are the public, consolidated data exports for the beta site. The full dated raw CSV snapshots remain in the local project workspace.

## Canonical Files

- `apartment_research_consolidated_2026-07-02.csv`
  - one row per apartment, candidate, exploration direction, or general housing signal
  - merges app seed data, Apartments.com marketplace signals, square-foot value checks, official-source reconciliation, fee-sheet follow-up, Reddit/public-signal summaries, and RedNote social-heat fields
  - keeps source confidence and follow-up text visible instead of turning weak evidence into hard claims

- `csv_source_inventory_2026-07-02.csv`
  - one row per raw CSV source
  - records row count, purpose, and how each source is used in the canonical table

## Regenerate

Regenerate these files from the local project workspace with `phase1_mvp_app/tools/consolidate_research_csvs.mjs`, then copy the outputs into this published repo.
