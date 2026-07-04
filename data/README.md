# Published Research Data

These files are the public consolidated data exports for the beta site. The dated raw snapshots stay in the local project workspace and are not part of the public app.

## Canonical Files

- `apartment_research_consolidated_2026-07-02.csv`
  - one row per apartment, candidate, exploration direction, or general housing signal
  - merges app seed data, Apartments.com marketplace signals, square-foot value checks, official-source reconciliation, fee-sheet follow-up, and Reddit/public-signal summaries
  - keeps source confidence and follow-up text visible instead of turning weak evidence into hard claims
  - excludes social-platform raw or mention-count fields from the public data package; those local files remain internal research leads and are not used for app scoring

- `csv_source_inventory_2026-07-02.csv`
  - one row per raw CSV source
  - records row count, purpose, and how each source is used in the canonical table

## Regenerate

Regenerate these files from the local project workspace with `phase1_mvp_app/tools/consolidate_research_csvs.mjs`, then copy the outputs into this published repo.
