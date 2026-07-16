# User Official-Site Verification - 2026-07-13

## Decision

On 2026-07-13, the project owner confirmed that all apartment facts previously
tagged with marketplace provenance had been independently checked against the
properties' official websites. The factual values are therefore approved for
restoration to the public app.

This record documents the human Review Gate. It does not claim that a third-
party marketplace is the source of the restored facts, and those marketplace
URLs, labels, and exports remain excluded from the public package.

## Restored Fields

- Parking prices and ranges
- Application and administration fees
- Security-deposit amounts and ranges
- Renter-insurance estimates where recorded
- Pet eligibility, limits, deposits, one-time fees, and monthly pet rent
- Flooring materials inferred from official property imagery or descriptions
- Furnished/partially furnished status for Anthem
- Previously recorded concessions for New Haven Towers and Pierpont

Later official captures continue to take precedence where they corrected an
older value. In particular, Axis 201 keeps the reviewed official required-fee
total of $83.39/month rather than the older $23 figure.

## Yale-Affiliate Deposit Correction

On 2026-07-14, the project owner reconfirmed through official property sources
that the Yale-affiliate security-deposit amount is $250 at The Taft and Axis
201. MatchNHV uses this audience-specific amount in its upfront estimate.

## Yale-Community Bank Statement Path

On 2026-07-14, the project owner reconfirmed through official property sources
that Yale community applicants at The Taft and Axis 201 do not need a guarantor
or co-signer. A bank statement is accepted for this application path.

The exact raw marketplace exports remain under `data/internal_leads/` for
incident provenance only and are not approved for public redistribution.

# Field Guide Renderer Release Gate - 2026-07-15

## Rendering Architecture

- The Field Guide card is the only production result renderer.
- The prior card renderer and `?renderer=legacy` path were removed; rollback is
  handled through Git history.
- Rendering uses the shared ranking, selected-unit, concession, utilities, and
  cost engines without recalculating order.
- Fit score is folded inside the Field Guide report instead of competing with
  monthly cost in the card header.
- The collapsed card separates estimated total monthly spending from the
  housing-cost basis used for budget comparison.
- Production maps remain hidden because the current property-origin and walking-
  route review rows are still pending.

## Scoring Corrections

- Result rationale and main trade-off now respond to the submitted campus,
  budget, main needs, and preferences instead of reusing one static sentence.
- Location-only browsing no longer changes the questionnaire's selected campus.
- `balanced` now means four-campus commute balance and is calculated from the
  four concrete campus scores.
- Unknown-heavy main needs cannot create a hard ranking tier until at least
  `7/11` recommendation properties have explicit support or conflict evidence.
- Quiet routine, Yale Shuttle, and low-density preferences now use an evidence
  gate as well. With `0/11` current coverage, selecting quiet leaves ranking and
  scores unchanged while still adding a verification prompt; its measured
  order impact fell from `16/120` contexts to `0/120`.
- Concessions expire at their explicit deadline or after a `30`-day freshness
  window when only `checkedDate` is available.
- Concession `eligibleUnitTypes` is enforced and schema-validated. The current
  questionnaire has no move-in-date input, so a published move-in deadline can
  expire an offer but cannot confirm a particular user's eligibility; cards
  show both pre- and post-concession amounts for that reason.
- The questionnaire itself now asks for the maximum accepted official rent plus
  required building fees. The validator locks this wording in both languages so
  the input and the card's budget-comparison basis cannot drift apart.
- Feedback email text lists the visible order without leaking a misleading
  exact fit score.

## Automated Checks

- `node --check phase1_mvp_app/app.js`
- `node tools/validate_apartment_data.mjs`
- `node tools/scoring_contract_regression.mjs`
- `node tools/phase_d_regression.mjs`
- `node tools/budget_regression.mjs`
- `node tools/field_guide_renderer_regression.mjs`
- `node tools/comprehensive_user_simulation.mjs`

The renderer regression covers all 11 recommendation properties in Chinese and
English and rejects missing property names, invalid numeric output, a visible
score pill, static campus rationale, a reachable legacy renderer, or an
unreviewed map reference.

The comprehensive simulation also locks six canonical user paths: Med student,
Central Campus true-cost, Science Hill, Downtown high-amenity, a Med School
location-first boundary with a small visible budget overage, and the out-of-
scope low-budget roommate path.

## Browser Checks

Targeted release check completed on 2026-07-16 against the latest local source
through `http://127.0.0.1:4317/`. The matrix remains covered by simulation; this
browser pass was intentionally limited to behavior that cannot be established
by source-level rendering alone.

- The Chinese budget question visibly uses the official-rent-plus-required-fee
  ceiling and shows the matching 1BR budget bands after unit-type selection.
- The balanced path explains that it compares commute balance across four main
  Yale areas.
- Selecting quiet is visibly retained in the submitted-needs summary with
  `recorded; not ranked until evidence coverage improves`; it does not look
  silently ignored or falsely verified.
- The Med School 1BR / $2,500 edge case shows Pierpont first with a visible
  `$25/mo` housing-cost overage, a `$2,630` total-spending estimate, and in-
  budget Taft and New Haven Towers alternatives.
- `?renderer=legacy` loads the single Field Guide implementation with no legacy
  nodes or half-rendered fallback.
- Full-questionnaire feedback includes entry path, submitted answers, visible
  order, and the user's outcome judgment.
- Location browse now exposes its lightweight feedback mode. Its copied email
  records only the selected Yale area and location options; it no longer invents
  `Studio` or a `$0` budget for an unanswered questionnaire.
- Browser console reported no warnings or errors during the targeted pass.

## Comprehensive Simulation Metrics

Post-remediation matrix: `1,920` scenarios, `5,760` Top-3 cards, `11,640`
bilingual rendered-card checks, and `3,880` bilingual needs-summary checks.

- Top 1 over budget: `30/1,920` (`1.6%`); the largest overage is small and is
  shown prominently in the trade-off line.
- Top 3 over budget: `207/5,760` (`3.6%`).
- Top 3 dependent on a current concession: `1,073/5,760` (`18.6%`); this remains
  a tracked freshness risk, not an automatic failure. The prior observation was
  `1,019/5,760` (`17.7%`), so the post-remediation baseline is higher by `0.9`
  percentage points rather than silently treated as an improvement.
- Top 1 with an explicit selected-need conflict: `0/840`.
- Top 1 with at least one selected need still unknown: `419/840` (`49.9%`).
  The gap remains visible, but low-coverage needs cannot become hard ranking
  tiers.
- Three visible cards with the same trade-off: `5/960` (`0.5%`), down from
  `261/960` before dynamic trade-offs.

Main-need evidence coverage is also baseline-tracked on every comprehensive
simulation run:

- Laundry: `0/11`; flooring: `0/11`; private space: `1/11`; furniture: `1/11`.
  These remain soft signals with verification prompts.
- Parking: `7/11`; cat policy: `7/11`; dog policy: `7/11`. These currently meet
  the ranking-tier threshold.
- The harness prints any coverage delta and any `off -> on` or `on -> off`
  transition. A transition still requires evidence review before release.

Evidence-dependent preference coverage is currently quiet `0/11`, Yale Shuttle
`0/11`, and low tenant density `0/11`; all three ranking weights remain off.
