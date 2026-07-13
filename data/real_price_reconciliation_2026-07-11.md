# Real Price Reconciliation (11 P0/P1 Buildings) - Snapshot: 2026-07-11

## 1. 360 State Street
- **Marketed Rent**: Base rent only.
- **Real Price Engine**: `calculated_total`.
- **Gap Status**: `not_comparable` (in CSV). Required fees added to base rent.

## 2. Olive and Wooster
- **Marketed Rent**: Base rent or range.
- **Real Price Engine**: `range_including_special`, `base_rent_only`, or `unknown`.
- **Gap Status**: `not_comparable` (in CSV). No effective cost calculated in snapshot.

## 3. Axis 201
- **Marketed Rent**: Base rent only.
- **Real Price Engine**: `base_rent_only` (Incomplete).
- **Gap Status**: `not_comparable` (in CSV). Total monthly cost is null in the snapshot.

## 4. The Whit
- **Marketed Rent**: Base rent only.
- **Real Price Engine**: `base_rent_only` (Incomplete).
- **Gap Status**: `not_comparable` (in CSV). Total monthly cost is null in the snapshot.

## 5. The Taft
- **Marketed Rent**: Base rent only.
- **Real Price Engine**: `base_rent_only` (Incomplete).
- **Gap Status**: `not_comparable` (in CSV). Total monthly cost is null in the snapshot.

## 6. New Haven Towers (Madison, Crown Towers, Crown Court, 18 High)
- **Marketed Rent**: Base rent floorplan range.
- **Real Price Engine**: `base_rent_only` (Incomplete).
- **Gap Status**: `not_comparable` (in CSV). Utilities (Heat/HW) are included.

## 7. The Archive
- **Marketed Rent**: Total Monthly Leasing Price (3-18 month range).
- **Real Price Engine**: `official_total` or `unknown`.
- **Gap Status**: `not_comparable` (in CSV).

## 8. Anthem at Square 10
- **Marketed Rent**: Base rent (e.g. 5 month lease).
- **Real Price Engine**: `calculated_total` or `unknown`.
- **Gap Status**: `not_comparable` (in CSV). Estimated monthly cost reveals a ~$105 exact delta for required fees.

## 9. The Audubon
- **Marketed Rent**: Base rent (17 month lease).
- **Real Price Engine**: `calculated_total`.
- **Gap Status**: `not_comparable` (in CSV). Estimated monthly cost precisely accounts for Amenity ($65) + Waste ($25) + Utility ($7) = $97.

## 10. Pierpont at City Crossing
- **Marketed Rent**: Total Monthly Cost.
- **Real Price Engine**: `official_total`.
- **Gap Status**: `not_comparable` (in CSV).

## 11. Estelle
- **Marketed Rent**: Starting base rent.
- **Real Price Engine**: `base_rent_only` or `unknown` (Incomplete).
- **Gap Status**: `not_comparable` (in CSV). Missing total monthly cost.
