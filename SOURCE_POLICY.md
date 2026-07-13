# Source Use Policy

## Purpose

MatchNHV publishes concise decision support, not a copy of a listing platform.
This policy separates private research leads from evidence that may enter the
public app or scoring model.

## Allowed Public Evidence

A public field must be supported by at least one of the following:

- an official property or property-manager website/portal;
- a written leasing-office response or fee sheet;
- a user-supplied capture or document from an official source;
- an official Yale, city, state, or transit source for location and services.

Store the source URL or document reference, the checked date, the exact scope
(property, floorplan, or unit), and any eligibility condition. Promotions must
also record eligible unit types, lease term, move-in deadline, and expiry when
those details are available.

When the project owner independently re-checks a field on an official site, the
public card may omit the marketplace lead URL while the data record retains an
internal decision-log `sourceRef` and checked date. This is a human Review Gate,
not permission to relabel an unverified marketplace value as official.

## Internal Leads Only

Marketplace, social, forum, and review-site material may identify what to ask or
where a gap exists. It must not be redistributed in the public data package,
quoted as a property fact, or used in scoring unless written permission or an
applicable license has been reviewed.

Do not use automated access, bots, spiders, or scraping against third-party
marketplaces or community platforms. Manual review of those sites is also a
lead-generation step only; independently verify the fact through an allowed
public source before publication.

## Review Gate

Before a field changes public copy or ranking:

1. Confirm the field came from an allowed public source.
2. Record provenance and checked date.
3. Keep `not found` as `unknown`; never convert it to `$0`, `false`, or an
   inferred amenity.
4. Separate mandatory monthly cost, optional user-selected cost, move-in cash,
   and concessions.
5. Run `node tools/validate_apartment_data.mjs` and confirm the public-source
   policy scan passes.

## Existing Quarantine

The 2026-07-13 cleanup preserves prior marketplace-derived records under
`phase1_mvp_app/data/internal_leads/marketplace_quarantine_2026-07-13/` for
provenance and independent re-verification. The raw files are not part of the
GitHub Pages package. Facts independently approved through the human Review
Gate may return to the app with official verification metadata; raw marketplace
exports and marketplace source labels may not.

## Escalation

Pause publication and obtain legal review before adding licensed marketplace
data, resuming automated third-party collection, responding to a platform
complaint, or materially expanding commercial/referral use.
