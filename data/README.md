# Published Data

## Current Phase D Files

- `availability_price_snapshot_2026-07-29.csv`
  - public unit-type comparison snapshot used by the Phase D budget contract
  - preserves source URL, check date, unit/floorplan trace, lease information,
    price basis, availability scope, and unit-level feature evidence
- `phase_d_comparison_policy_2026-07-29.csv`
  - separate human-approved policy overlay for New Haven Towers and The Archive
  - does not replace or modify the original official ranges

`availability_price_snapshot_2026-07-13.csv` and
`phase_c_budget_policy_2026-07-13.csv` are retained as historical Review Gate
artifacts in the editable source workspace. They are not active runtime inputs
and are excluded from the public GitHub Pages package.

The 2026-07-29 refresh is rebuilt deterministically from the historical snapshot
and `price_refresh_review_2026-07-29.json`:

```bash
node tools/build_price_refresh_snapshot.mjs
node tools/validate_phase_d_snapshot.mjs
node tools/inject_price_snapshot.mjs
node tools/validate_price_refresh_freshness.mjs
```

The final command enforces the 14-day release cadence. It checks that the active
dated snapshot and its human Review Gate metadata match; it does not make an old
price current or extend an offer.

New Haven Towers comparison prices are official-range midpoints used as planning
values regardless of lease term. The Archive comparison prices are official-range
lower bounds approved as 12-month comparison values. Result cards disclose both
policies. Estelle Studio is explicitly N/A; its 1BR and 2BR data remain eligible.
The Whit now has official standard-term Studio and 1BR comparison rows. Its 2BR
card keeps the current 15-month planning reference visible but receives no budget
score because no 10/11/12-month row is currently available. Each public unit type
must retain at least 8 eligible properties before budget ranking remains active.

## Internal Leads

Marketplace, social, forum, and review-site material is kept outside the public
package under `internal_leads/`. It may be used only to identify a question or a
field that needs checking. A value cannot enter the public app or scoring until
it has independent evidence from an official property/manager page, a written
leasing-office response, or a user-supplied official document.

See `docs/source_use_policy.md` for the collection and publication rules.

## Field Evidence Review Queue

`evidence_gap_review_2026-07-14/` is the field-level research and review queue. It
tracks five fixed campus anchors plus walking routes, Yale Shuttle access,
application policies, exact-unit features, unit-specific quiet signals, and The
Taft's adjacent parking arrangement.

The unit-feature portion completed its Review Gate on 2026-07-27. Accepted facts
are applied to the Phase D snapshot by a separate adapter; searched-but-unresolved
rows remain explicit `unknown` values. Validate and apply it with:

```bash
node tools/validate_evidence_gap_collection.mjs
node tools/apply_reviewed_unit_features.mjs
node tools/validate_beta_release_readiness.mjs
```

Human Review Gate approval remains mandatory before a value can change runtime
data or scoring. Application-policy completeness is advisory for this beta and is
not a release blocker. Walking, Shuttle, quiet, and utility-sheet completeness
remain post-launch evidence lanes until their own gates are met. Price refresh
cadence is enforced separately by the 14-day release gate above.

`candidate_properties_review_2026-07-27.csv` is the single expansion registry.
It records standalone candidates, complex parents, and child buildings. A
candidate can be present in this registry without entering the recommendation
pool. City Crossing is modeled as a five-building complex; its current runtime
price basis is explicitly limited to Pierpont until the other four children pass
their own price and fee Review Gates.
