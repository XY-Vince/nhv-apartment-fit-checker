# MatchNHV

Beta static site for matching Yale / New Haven apartment options to a student's actual needs.

It is a lightweight decision-support prototype:

- answer a few fit questions
- get 2-3 mainstream apartment options
- read why they fit, what trade-offs matter, and what to verify before applying

## Language Versions

- Chinese: `index.html`
- English: `en/index.html` (`en.html` redirects old links)

## Current Scope

The beta is designed for mainstream New Haven apartment searches, especially students comparing location, budget, utilities, amenities, furnishing/setup, application friction, and daily convenience.

It is not built for low-budget room search, sublets, independent landlords, or roommate matching.

Result cards include true-monthly and move-in-cash estimates. These are planning estimates built from public fee signals and assumptions, not final lease numbers.

## Data And Trust

All apartment data is a beta seed profile. Rent, availability, concessions, fees, furnished status, utilities, parking, insurance, and guarantor policies must be confirmed with the property before applying or signing.

The tool avoids universal "best apartment" rankings. Fit depends on campus destination, true monthly budget, setup needs, and trade-offs.

The consolidated research export lives in `data/apartment_research_consolidated_2026-07-02.csv`. `data/csv_source_inventory_2026-07-02.csv` explains which raw CSV snapshots fed that export.

## Deployment

This repo is intended for GitHub Pages:

- source: deploy from branch
- branch: `main`
- folder: `/root`
