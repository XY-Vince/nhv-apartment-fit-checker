# MatchNHV

MatchNHV is a static New Haven apartment fit checker. It starts with the user's
main Yale destination, then optionally refines the Top 3 with five questions
about unit type, budget, utilities, setup, and daily priorities.

## Public Pages

- `index.html`: Chinese
- `en/index.html`: English
- `en.html`: redirect for the previous English URL

Apartment profiles and scoring logic are embedded in `app.js`, so the site can
run as a static GitHub Pages project without a backend.

Feedback is copied to the clipboard. Set the project-only inbox once in the
single `FEEDBACK_EMAIL` constant; do not put a personal address in public HTML.

## Phase D Price Matching

The public questionnaire supports Studio, 1BR, 2BR, and Not sure. Not sure uses
a disclosed 1BR comparison basis. Budget bands change with the selected unit
type. Switching unit type clears the old budget choice. Each band uses only its
upper bound as the affordability ceiling, so a cheaper apartment receives the
same full budget fit rather than being penalized for not using the whole range.
The open-ended top band does not impose a hidden ceiling.

The current comparison snapshot is
`data/availability_price_snapshot_2026-07-13.csv`:

- Studio: 10/10 applicable properties; Estelle Studio is N/A
- 1BR: 11/11 properties
- 2BR: 11/11 properties
- New Haven Towers uses approved official-range midpoints as planning values
- The Archive uses approved official-range lower bounds as 12-month comparison
  values

Those two approved policies are stored separately in
`data/phase_c_budget_policy_2026-07-13.csv` and are disclosed on result cards.
They do not overwrite the original official ranges or imply current inventory.

## Matching Guardrails

- Location tier is evaluated before budget and preference detail.
- Budget compares only the unit type selected by the user.
- Missing price evidence stays visible and does not count as affordability.
- Requested unit-level features with unknown evidence can remove budget scoring
  from that card instead of pairing an unverified feature with a cheap unit.
- Recorded months-free offers with a usable lease term are prorated into the
  monthly estimate and budget comparison. Cards retain the pre-concession
  amount because exact-unit eligibility still needs confirmation.
- Parking, furniture rental, and pet costs enter the displayed estimate only
  when the user selects the corresponding need. They do not redefine the base
  affordability score.
- Move-in cash and guarantor/co-signer uncertainty stay visible as separate
  checks instead of being hidden inside monthly budget fit.
- Source confidence is displayed separately from fit score.
- The app does not score protected-class traits or label an area as safe/unsafe.
- Rent, availability, fees, utilities, and lease policies must be confirmed
  before applying.

## Deployment

GitHub Pages serves the repository from `main` and `/root`.

Before publishing, run the validators from the parent project workspace, confirm
that source and GitHub Pages copies are byte-identical, then bump the cache key
in both language entry points.
