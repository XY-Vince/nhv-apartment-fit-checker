const SCORE = {
  FULL: 100,
  VERY_HIGH: 92,
  HIGH: 82,
  MID: 64,
  LOW: 42,
  MISS: 18
};

const UTILITY_PREDICTABILITY_SCORE = {
  predictable: 100,
  mixed: 68,
  variable: 38,
  unknown: 44
};

const LOCATION_BROWSE_LIMIT = 5;
const BUDGET_LOCATION_SOFT_TOLERANCE = 100;

const UTILITY_PROFILES = Object.freeze({
  "360-state": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "olive-wooster": { included: [], tenantPays: ["electricity", "internet"], verify: ["water_sewer"] },
  "the-taft": { included: ["heat", "hot_water", "water_sewer"], tenantPays: ["electricity", "internet"], verify: [] },
  "the-archive": { included: ["high_speed_internet"], tenantPays: ["electricity"], verify: ["water_sewer"] },
  "estelle": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "axis-201": { included: ["water_sewer"], tenantPays: ["electricity", "internet"], verify: ["heating_cooling"] },
  "the-audubon": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "new-haven-towers": {
    included: ["heat", "hot_water", "air_conditioning_most_units", "water_sewer"],
    tenantPays: ["electricity", "internet"],
    verify: []
  },
  "pierpont-city-crossing": {
    included: [],
    tenantPays: ["electricity", "internet"],
    verify: ["heating_cooling", "water_sewer"]
  },
  "anthem-square10": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "the-whit": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "the-elm": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "corsair": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "east-rock-landlord": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] },
  "hamden-large": { included: [], tenantPays: ["electricity", "internet"], verify: ["heating_cooling", "water_sewer"] }
});

const UTILITY_ITEM_LABELS = Object.freeze({
  en: {
    heat: "Heat",
    hot_water: "hot water",
    high_speed_internet: "high-speed internet",
    air_conditioning_most_units: "A/C in most units",
    electricity_lights_appliances: "electricity for lights/appliances",
    electricity: "electricity",
    heating_cooling: "heating/cooling billing",
    water_sewer: "water/sewer",
    internet: "internet",
    standard_lease_utilities: "standard-lease utilities",
    standard_lease_internet: "standard-lease internet"
  },
  zh: {
    heat: "暖气",
    hot_water: "热水",
    high_speed_internet: "高速网络",
    air_conditioning_most_units: "空调",
    electricity_lights_appliances: "电费",
    electricity: "电费",
    heating_cooling: "暖气和空调",
    water_sewer: "水费和污水费",
    internet: "网络",
    standard_lease_utilities: "普通 lease 的水电项目",
    standard_lease_internet: "普通 lease 的网络"
  }
});

const UTILITY_DETAIL_TEXT = Object.freeze({
  en: {
    included: "Included",
    tenantPays: "Tenant pays",
    verify: "Verify"
  },
  zh: {
    included: "已包含",
    tenantPays: "租客自付",
    verify: "待核实"
  }
});

const SCORABLE_WORRY_VALUES = new Set(["application", "true_cost", "roommate"]);

const VALUE_SIGNAL_CAVEATS = {
  en: "Approximate $/sqft uses reviewed property-site price and area rows. Compare only within the same lease and fee basis.",
  zh: "每平方英尺价格只使用审核过的公寓官网价格和面积；请在相同租期与费用口径内比较。"
};

const MVP_MIN_APARTMENT_BUDGET = 1600;
// Project-only inbox shown in the feedback section.
const FEEDBACK_EMAIL = "MatchNHV@gmail.com";
const HIGH_MOVE_IN_CASH_TOP_SHARE = 0.25;
const STRONG_AMENITY_FEATURE_COUNT = 4;
const HARD_REQUIREMENT_PRIORITIES = new Set(["parking", "pet_friendly"]);
const MAIN_NEED_TIER_MIN_KNOWN = 7;
const BALANCED_CAMPUS_KEYS = Object.freeze([
  "central_campus",
  "med_school",
  "som_prospect",
  "seas_science"
]);
const BALANCED_REASON_MIN_SCORE = 70;
const CONCESSION_FRESHNESS_DAYS = 30;

function formatPetPolicyTag(policy, lang) {
  const costs = [];
  if (Number.isFinite(policy?.oneTimeFee)) {
    costs.push(lang === "zh" ? `一次性 $${policy.oneTimeFee}` : `$${policy.oneTimeFee} one-time`);
  }
  if (Number.isFinite(policy?.monthlyRent)) {
    costs.push(lang === "zh" ? `每月 $${policy.monthlyRent}` : `$${policy.monthlyRent}/mo`);
  }
  if (!costs.length) return lang === "zh" ? "宠物政策已找到" : "Pet policy found";
  return `${lang === "zh" ? "宠物：" : "Pets: "}${costs.join(" + ")}`;
}

const STUDIO_BUDGET_OPTIONS = [
  { value: 1900, lower: 0, upper: 1900, label: "< $1,900" },
  { value: 2100, lower: 1900, upper: 2100, label: "$1,900-$2,100" },
  { value: 2300, lower: 2100, upper: 2300, label: "$2,100-$2,300" },
  { value: 2500, lower: 2300, upper: 2500, label: "$2,300-$2,500" },
  { value: 99999, lower: 2500, upper: Infinity, label: "$2,500+", openEnded: true }
];

const ONE_BR_BUDGET_OPTIONS = [
  { value: 2200, lower: 0, upper: 2200, label: "< $2,200" },
  { value: 2500, lower: 2200, upper: 2500, label: "$2,200-$2,500" },
  { value: 2800, lower: 2500, upper: 2800, label: "$2,500-$2,800" },
  { value: 3100, lower: 2800, upper: 3100, label: "$2,800-$3,100" },
  { value: 99999, lower: 3100, upper: Infinity, label: "$3,100+", openEnded: true }
];

const TWO_BR_BUDGET_OPTIONS = [
  { value: 2800, lower: 0, upper: 2800, label: "< $2,800" },
  { value: 3200, lower: 2800, upper: 3200, label: "$2,800-$3,200" },
  { value: 3500, lower: 3200, upper: 3500, label: "$3,200-$3,500" },
  { value: 3800, lower: 3500, upper: 3800, label: "$3,500-$3,800" },
  { value: 99999, lower: 3800, upper: Infinity, label: "$3,800+", openEnded: true }
];

const BUDGET_OPTIONS_BY_UNIT_TYPE = Object.freeze({
  studio: STUDIO_BUDGET_OPTIONS,
  "1br": ONE_BR_BUDGET_OPTIONS,
  "2br": TWO_BR_BUDGET_OPTIONS,
  not_sure: ONE_BR_BUDGET_OPTIONS
});

const BUDGET_LABELS = Object.fromEntries(STUDIO_BUDGET_OPTIONS.map(option => [option.value, option.label]));

function budgetOptionsFor(unitType = "studio") {
  return BUDGET_OPTIONS_BY_UNIT_TYPE[unitType] || STUDIO_BUDGET_OPTIONS;
}

function budgetBand(maxBudget, unitType = "studio") {
  return budgetOptionsFor(unitType).find(option => option.value === Number(maxBudget)) || null;
}

// PRICE_SNAPSHOT_START
// Generated by tools/inject_price_snapshot.mjs after Review Gate approval.
const AVAILABILITY_PRICE_SNAPSHOT = Object.freeze({
  "360-state": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2385,
        "standardLeasePrice": 2385,
        "budgetLowerBound": 2385,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 582,
        "sourceUrl": "https://www.360statestreet.com/floorplans",
        "sourceRef": null,
        "checkedDate": "2026-07-11",
        "retrievedAt": "2026-07-04",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "APT 1109",
          "floorplanId": null,
          "availableFrom": "Available Now",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2270,
          "baseRentMax": 2270,
          "totalCostMin": 2385,
          "totalCostMax": 2385,
          "sourceRef": null,
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-04",
          "checkedDate": "2026-07-11",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3628,
        "standardLeasePrice": 3628,
        "budgetLowerBound": 3628,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 10,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 1012,
        "sourceUrl": "https://www.360statestreet.com/floorplans",
        "sourceRef": null,
        "checkedDate": "2026-07-11",
        "retrievedAt": "2026-07-04",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "APT 2418",
          "floorplanId": null,
          "availableFrom": "Available Now",
          "leaseMonths": 10,
          "rentBasis": "per_unit",
          "baseRentMin": 3513,
          "baseRentMax": 3513,
          "totalCostMin": 3628,
          "totalCostMax": 3628,
          "sourceRef": null,
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-04",
          "checkedDate": "2026-07-11",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 2372,
        "standardLeasePrice": 2372,
        "budgetLowerBound": 2372,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 11,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 517,
        "sourceUrl": "https://www.360statestreet.com/floorplans",
        "sourceRef": null,
        "checkedDate": "2026-07-11",
        "retrievedAt": "2026-07-04",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "APT 705",
          "floorplanId": null,
          "availableFrom": "Available Now",
          "leaseMonths": 11,
          "rentBasis": "per_unit",
          "baseRentMin": 2257,
          "baseRentMax": 2257,
          "totalCostMin": 2372,
          "totalCostMax": 2372,
          "sourceRef": null,
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-04",
          "checkedDate": "2026-07-11",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "olive-wooster": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2376,
        "standardLeasePrice": 2376,
        "budgetLowerBound": 2376,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 631,
        "sourceUrl": "https://oliveandwooster.com/availability",
        "sourceRef": "docs/phase_c_evidence/olive-wooster_2026-07-12.md;data/olive_parsed_fixed.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": true
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1bd 631 sqft",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2230,
          "baseRentMax": 2325,
          "totalCostMin": 2376,
          "totalCostMax": 2471,
          "sourceRef": "docs/phase_c_evidence/olive-wooster_2026-07-12.md;data/olive_parsed_fixed.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "furnished"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 2562,
        "standardLeasePrice": 2562,
        "budgetLowerBound": 2562,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 967,
        "sourceUrl": "https://oliveandwooster.com/availability",
        "sourceRef": "docs/phase_c_evidence/olive-wooster_2026-07-12.md;data/olive_parsed_fixed.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": true
        },
        "trace": {
          "unitId": null,
          "floorplanId": "2bd 967 sqft",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2416,
          "baseRentMax": 2983,
          "totalCostMin": 2562,
          "totalCostMax": 3129,
          "sourceRef": "docs/phase_c_evidence/olive-wooster_2026-07-12.md;data/olive_parsed_fixed.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "furnished"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 2226,
        "standardLeasePrice": 2226,
        "budgetLowerBound": 2226,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 501,
        "sourceUrl": "https://oliveandwooster.com/availability",
        "sourceRef": "docs/phase_c_evidence/olive-wooster_2026-07-12.md;data/olive_parsed_fixed.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": true
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Studio 501 sqft",
          "availableFrom": "2026-10-07",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2080,
          "baseRentMax": 2080,
          "totalCostMin": 2226,
          "totalCostMax": 2226,
          "sourceRef": "docs/phase_c_evidence/olive-wooster_2026-07-12.md;data/olive_parsed_fixed.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "furnished"
        }
      }
    ]
  },
  "axis-201": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2528.39,
        "standardLeasePrice": 2528.39,
        "budgetLowerBound": 2528.39,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 681,
        "sourceUrl": "https://axis201.com/floor-plans",
        "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md;data/axis_201_availability.md;data/Axis_eBrochure.pdf",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "0331",
          "floorplanId": null,
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2445,
          "baseRentMax": 2445,
          "totalCostMin": 2528.39,
          "totalCostMax": 2528.39,
          "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md;data/axis_201_availability.md;data/Axis_eBrochure.pdf",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3274.39,
        "standardLeasePrice": 3274.39,
        "budgetLowerBound": 3274.39,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 967,
        "sourceUrl": "https://axis201.com/floor-plans",
        "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md;data/axis_201_availability.md;data/Axis_eBrochure.pdf",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "0321",
          "floorplanId": null,
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 3191,
          "baseRentMax": 3191,
          "totalCostMin": 3274.39,
          "totalCostMax": 3274.39,
          "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md;data/axis_201_availability.md;data/Axis_eBrochure.pdf",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 1935.39,
        "standardLeasePrice": 1935.39,
        "budgetLowerBound": 1935.39,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 345,
        "sourceUrl": "https://axis201.com/floor-plans",
        "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md;data/axis_201_availability.md;data/Axis_eBrochure.pdf",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "0249",
          "floorplanId": null,
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 1852,
          "baseRentMax": 1852,
          "totalCostMin": 1935.39,
          "totalCostMax": 1935.39,
          "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md;data/axis_201_availability.md;data/Axis_eBrochure.pdf",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "the-whit": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2490,
        "standardLeasePrice": 2490,
        "budgetLowerBound": 2490,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 677,
        "sourceUrl": "https://www.scullycompany.com/apartments/new-england/new-haven-county/new-haven/the-whit/",
        "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md;data/whit_parsed.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1-Bedroom 1-Bathroom / 677 sqft",
          "availableFrom": "2026-08-03",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2475,
          "baseRentMax": 2475,
          "totalCostMin": 2490,
          "totalCostMax": 2490,
          "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md;data/whit_parsed.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3415,
        "standardLeasePrice": 3415,
        "budgetLowerBound": 3415,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 11,
        "availabilityScope": "planning_range",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 1114,
        "sourceUrl": "https://www.scullycompany.com/apartments/new-england/new-haven-county/new-haven/the-whit/",
        "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md;data/whit_parsed.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "2-Bedroom 2-Bathroom / 1114 sqft",
          "availableFrom": "2026-05-11",
          "leaseMonths": 11,
          "rentBasis": "per_unit",
          "baseRentMin": 3400,
          "baseRentMax": 3400,
          "totalCostMin": 3415,
          "totalCostMax": 3415,
          "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md;data/whit_parsed.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 2321,
        "standardLeasePrice": 2321,
        "budgetLowerBound": 2321,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 11,
        "availabilityScope": "planning_range",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 591,
        "sourceUrl": "https://www.scullycompany.com/apartments/new-england/new-haven-county/new-haven/the-whit/",
        "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md;data/whit_parsed.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Studio / 591 sqft",
          "availableFrom": "2026-06-28",
          "leaseMonths": 11,
          "rentBasis": "per_unit",
          "baseRentMin": 2306,
          "baseRentMax": 2306,
          "totalCostMin": 2321,
          "totalCostMax": 2321,
          "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md;data/whit_parsed.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "the-taft": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 1999,
        "standardLeasePrice": 1999,
        "budgetLowerBound": 1999,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 697,
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/taft-apartments/default.aspx",
        "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": true,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "05S",
          "floorplanId": "1-Bedroom, 1-Bath",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 1999,
          "totalCostMax": 1999,
          "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 2950,
        "standardLeasePrice": 2950,
        "budgetLowerBound": 2950,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 1200,
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/taft-apartments/default.aspx",
        "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": true,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "01A",
          "floorplanId": "2-Bedroom Duplex",
          "availableFrom": "2026-08-15",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 2950,
          "totalCostMax": 2950,
          "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 1895,
        "standardLeasePrice": 1895,
        "budgetLowerBound": 1895,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 424,
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/taft-apartments/default.aspx",
        "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": true,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "05O",
          "floorplanId": "Studio",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 1895,
          "totalCostMax": 1895,
          "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "new-haven-towers": {
    "1br": [
      {
        "subBuildingId": "18_high",
        "unitType": "1br",
        "lowestObservedPrice": 2745,
        "standardLeasePrice": 2920,
        "budgetLowerBound": 2920,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1 BD 1BA Standard",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2745,
          "baseRentMax": 3095,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "crown_court",
        "unitType": "1br",
        "lowestObservedPrice": 1995,
        "standardLeasePrice": 2095,
        "budgetLowerBound": 2095,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1 BD Standard",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 1995,
          "baseRentMax": 2195,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "crown_towers",
        "unitType": "1br",
        "lowestObservedPrice": 2145,
        "standardLeasePrice": 2220,
        "budgetLowerBound": 2220,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1 BD, South",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2145,
          "baseRentMax": 2295,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "madison",
        "unitType": "1br",
        "lowestObservedPrice": 1975,
        "standardLeasePrice": 2060,
        "budgetLowerBound": 2060,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1 BD - Large",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 1975,
          "baseRentMax": 2145,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": "18_high",
        "unitType": "2br",
        "lowestObservedPrice": 4095,
        "standardLeasePrice": 4295,
        "budgetLowerBound": 4295,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "2 BD 1 BA",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 4095,
          "baseRentMax": 4495,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "crown_court",
        "unitType": "2br",
        "lowestObservedPrice": 2895,
        "standardLeasePrice": 3045,
        "budgetLowerBound": 3045,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "2 BD 2 BA",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2895,
          "baseRentMax": 3195,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "madison",
        "unitType": "2br",
        "lowestObservedPrice": 2895,
        "standardLeasePrice": 3045,
        "budgetLowerBound": 3045,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "2 BD 2 BA",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2895,
          "baseRentMax": 3195,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": "18_high",
        "unitType": "studio",
        "lowestObservedPrice": 2245,
        "standardLeasePrice": 2370,
        "budgetLowerBound": 2370,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Studio",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2245,
          "baseRentMax": 2495,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "crown_towers",
        "unitType": "studio",
        "lowestObservedPrice": 1895,
        "standardLeasePrice": 1970,
        "budgetLowerBound": 1970,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Studio South",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 1895,
          "baseRentMax": 2045,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "madison",
        "unitType": "studio",
        "lowestObservedPrice": 1695,
        "standardLeasePrice": 1770,
        "budgetLowerBound": 1770,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "base_rent_only",
        "comparisonPolicy": "official_range_midpoint",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the midpoint of the official floorplan rent range regardless of lease term; recurring fees remain unconfirmed",
        "sqftMin": null,
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Studio - Large",
          "availableFrom": null,
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 1695,
          "baseRentMax": 1845,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/new-haven-towers_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "the-archive": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2464,
        "standardLeasePrice": 2464,
        "budgetLowerBound": 2464,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "official_range_lower_bound_as_12_month",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_floorplan",
        "comparisonNote": "Use the lowest official Total Monthly Leasing Price as the 12-month comparison price",
        "sqftMin": 503,
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "1x1 A",
          "availableFrom": "2026-08-12",
          "leaseMonths": null,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 2464,
          "totalCostMax": 5117,
          "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3041,
        "standardLeasePrice": 3041,
        "budgetLowerBound": 3041,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "official_range_lower_bound_as_12_month",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_floorplan",
        "comparisonNote": "Use the lowest official Total Monthly Leasing Price as the 12-month comparison price",
        "sqftMin": 631,
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "2x2 Balcony A",
          "availableFrom": "2026-09-16",
          "leaseMonths": null,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 3041,
          "totalCostMax": 5248,
          "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 2232,
        "standardLeasePrice": 2232,
        "budgetLowerBound": 2232,
        "comparisonStatus": "policy_comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "official_range_lower_bound_as_12_month",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "planning_range",
        "comparisonNote": "Use the lowest official Total Monthly Leasing Price as the 12-month comparison price; current Studio availability is not confirmed",
        "sqftMin": 387,
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Sx1 A",
          "availableFrom": null,
          "leaseMonths": null,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 2232,
          "totalCostMax": 2282,
          "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "anthem-square10": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2790.25,
        "standardLeasePrice": 2790.25,
        "budgetLowerBound": 2790.25,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 718,
        "sourceUrl": "https://www.anthemsquare10.com/floorplans/a1",
        "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "634",
          "floorplanId": "A1",
          "availableFrom": "2026-08-07",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2685,
          "baseRentMax": 2685,
          "totalCostMin": 2790.25,
          "totalCostMax": 2790.25,
          "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3440.25,
        "standardLeasePrice": 3440.25,
        "budgetLowerBound": 3440.25,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 1064,
        "sourceUrl": "https://www.anthemsquare10.com/floorplans/b2",
        "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "707",
          "floorplanId": "B2",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 3335,
          "baseRentMax": 3335,
          "totalCostMin": 3440.25,
          "totalCostMax": 3440.25,
          "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 1930.25,
        "standardLeasePrice": 1930.25,
        "budgetLowerBound": 1930.25,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 373,
        "sourceUrl": "https://www.anthemsquare10.com/floorplans/s1",
        "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "313",
          "floorplanId": "S1",
          "availableFrom": "2026-10-07",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 1825,
          "baseRentMax": 1825,
          "totalCostMin": 1930.25,
          "totalCostMax": 1930.25,
          "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "the-audubon": {
    "1br": [
      {
        "subBuildingId": "367 Orange",
        "unitType": "1br",
        "lowestObservedPrice": 2685,
        "standardLeasePrice": 2685,
        "budgetLowerBound": 2685,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 670,
        "sourceUrl": "https://www.theaudubonapts.com/rentestimate/1-bed%2f1-bath-a3.1-367-orange",
        "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "518",
          "floorplanId": "1 Bed/1 Bath-A3.1",
          "availableFrom": "2026-10-05",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2588,
          "baseRentMax": 2588,
          "totalCostMin": 2685,
          "totalCostMax": 2685,
          "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": "29 Audubon Street",
        "unitType": "2br",
        "lowestObservedPrice": 3927,
        "standardLeasePrice": 3927,
        "budgetLowerBound": 3927,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 1220,
        "sourceUrl": "https://www.theaudubonapts.com/rentestimate/2-bed%2f2-bath-den-f1_1---29-audubon-street",
        "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "102",
          "floorplanId": "2 Bed/2 Bath Den-F1_1",
          "availableFrom": "2026-07-13",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 3830,
          "baseRentMax": 3830,
          "totalCostMin": 3927,
          "totalCostMax": 3927,
          "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 2532,
        "standardLeasePrice": 2532,
        "budgetLowerBound": 2532,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 575,
        "sourceUrl": "https://www.theaudubonapts.com/rentestimate/studio-s1.1",
        "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "220",
          "floorplanId": "Studio-S1.1",
          "availableFrom": "2026-07-13",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2440,
          "baseRentMax": 2440,
          "totalCostMin": 2532,
          "totalCostMax": 2532,
          "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      },
      {
        "subBuildingId": "367 Orange",
        "unitType": "studio",
        "lowestObservedPrice": 2482,
        "standardLeasePrice": null,
        "budgetLowerBound": null,
        "comparisonStatus": "planning_range",
        "budgetEligible": false,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "none",
        "comparisonLeaseMonths": null,
        "availabilityScope": "planning_range",
        "comparisonNote": null,
        "sqftMin": 608,
        "sourceUrl": "https://www.theaudubonapts.com/floorplans",
        "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "Studio-S4",
          "availableFrom": null,
          "leaseMonths": 17,
          "rentBasis": "per_unit",
          "baseRentMin": 2392,
          "baseRentMax": 2392,
          "totalCostMin": 2482,
          "totalCostMax": 2482,
          "sourceRef": "docs/phase_c_evidence/the-audubon_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "pierpont-city-crossing": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2754,
        "standardLeasePrice": 2754,
        "budgetLowerBound": 2754,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 774,
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/pierpont-at-city-crossing/default.aspx",
        "sourceRef": "docs/phase_c_evidence/pierpont-city-crossing_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "629",
          "floorplanId": "A5",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 2754,
          "totalCostMax": 4408,
          "sourceRef": "docs/phase_c_evidence/pierpont-city-crossing_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3615,
        "standardLeasePrice": 3615,
        "budgetLowerBound": 3615,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 1039,
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/pierpont-at-city-crossing/default.aspx",
        "sourceRef": "docs/phase_c_evidence/pierpont-city-crossing_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "305",
          "floorplanId": "B1",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 3615,
          "totalCostMax": 6869,
          "sourceRef": "docs/phase_c_evidence/pierpont-city-crossing_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": 2280,
        "standardLeasePrice": 2280,
        "budgetLowerBound": 2280,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "official_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": 537,
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/pierpont-at-city-crossing/default.aspx",
        "sourceRef": "docs/phase_c_evidence/pierpont-city-crossing_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_paste",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "525",
          "floorplanId": "JR1",
          "availableFrom": "2026-07-12",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": 2280,
          "totalCostMax": 7846,
          "sourceRef": "docs/phase_c_evidence/pierpont-city-crossing_2026-07-12.md",
          "sourceType": "official_paste",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  },
  "estelle": {
    "1br": [
      {
        "subBuildingId": null,
        "unitType": "1br",
        "lowestObservedPrice": 2835,
        "standardLeasePrice": 2835,
        "budgetLowerBound": 2835,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": null,
        "sourceUrl": "https://estellenewhaven.securecafe.com/onlineleasing/estelle-new-haven/rentaloptions.aspx?UnitID=48066972&FloorPlanID=6409675&myOlePropertyid=2326474&MoveInDate=7/13/2026",
        "sourceRef": "docs/phase_c_evidence/estelle_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "506",
          "floorplanId": "A3",
          "availableFrom": "2026-07-13",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 2795,
          "baseRentMax": 2795,
          "totalCostMin": 2835,
          "totalCostMax": 2835,
          "sourceRef": "docs/phase_c_evidence/estelle_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "2br": [
      {
        "subBuildingId": null,
        "unitType": "2br",
        "lowestObservedPrice": 3910,
        "standardLeasePrice": 3910,
        "budgetLowerBound": 3910,
        "comparisonStatus": "comparable",
        "budgetEligible": true,
        "priceBasis": "calculated_total",
        "comparisonPolicy": "source_standard_lease",
        "comparisonLeaseMonths": 12,
        "availabilityScope": "current_unit",
        "comparisonNote": "Official current standard-lease evidence",
        "sqftMin": null,
        "sourceUrl": "https://estellenewhaven.securecafe.com/onlineleasing/estelle-new-haven/rentaloptions.aspx?UnitID=48066927&FloorPlanID=6409679&myOlePropertyid=2326474&MoveInDate=7/13/2026",
        "sourceRef": "docs/phase_c_evidence/estelle_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": "209",
          "floorplanId": "B3",
          "availableFrom": "2026-07-13",
          "leaseMonths": 12,
          "rentBasis": "per_unit",
          "baseRentMin": 3870,
          "baseRentMax": 3870,
          "totalCostMin": 3910,
          "totalCostMax": 3910,
          "sourceRef": "docs/phase_c_evidence/estelle_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ],
    "studio": [
      {
        "subBuildingId": null,
        "unitType": "studio",
        "lowestObservedPrice": null,
        "standardLeasePrice": null,
        "budgetLowerBound": null,
        "comparisonStatus": "not_applicable",
        "budgetEligible": false,
        "priceBasis": "unknown",
        "comparisonPolicy": "not_applicable",
        "comparisonLeaseMonths": null,
        "availabilityScope": "not_applicable",
        "comparisonNote": "Studio is N/A for this pass; keep eligible 1BR and 2BR evidence unchanged",
        "sqftMin": null,
        "sourceUrl": "https://estellenewhaven.securecafe.com/onlineleasing/estelle-new-haven/floorplans",
        "sourceRef": "docs/phase_c_evidence/estelle_2026-07-12.md",
        "checkedDate": "2026-07-12",
        "retrievedAt": "2026-07-12",
        "sourceType": "official_page_capture",
        "rentBasis": "per_unit",
        "features": {
          "laundry": null,
          "privateSpace": null,
          "woodFloor": null,
          "furnitureReady": null
        },
        "trace": {
          "unitId": null,
          "floorplanId": "S1",
          "availableFrom": null,
          "leaseMonths": null,
          "rentBasis": "per_unit",
          "baseRentMin": null,
          "baseRentMax": null,
          "totalCostMin": null,
          "totalCostMax": null,
          "sourceRef": "docs/phase_c_evidence/estelle_2026-07-12.md",
          "sourceType": "official_page_capture",
          "retrievedAt": "2026-07-12",
          "checkedDate": "2026-07-12",
          "flooringMaterials": [],
          "furnishedStatus": "unknown"
        }
      }
    ]
  }
});
// PRICE_SNAPSHOT_END

const DEFAULT_COST_ASSUMPTIONS = {
  electricityMonthly: 50,
  internetMonthly: 40,
  renterInsurance: 15,
  furnitureMonthly: 250,
  parkingMonthly: 150,
  applicationFee: 50,
  securityDepositMultiplier: 1
};

const COST_CONFIDENCE_LABELS = {
  en: {
    advertised_rent: "advertised rent",
    verified_public: "public source",
    sample_lease: "sample lease",
    partial_public: "partial source",
    marketplace_supplied: "marketplace",
    planning_assumption: "planning assumption",
    conditional_offer: "conditional",
    unknown: "needs verification"
  },
  zh: {
    advertised_rent: "当前比较价",
    verified_public: "公开信息",
    sample_lease: "sample lease",
    partial_public: "部分公开",
    marketplace_supplied: "平台信息",
    planning_assumption: "估算假设",
    conditional_offer: "有条件",
    unknown: "需核实"
  }
};

const COST_ITEM_LABELS = {
  en: {
    recurringFees: "Required monthly building fees",
    utilitiesEstimate: "Utilities / internet estimate",
    electricityEstimate: "Electricity estimate",
    internetEstimate: "Internet estimate",
    insuranceEstimate: "Renters insurance",
    furnitureAmortized: "Furniture rental if needed",
    parkingEstimate: "Parking if selected",
    petRent: "Pet rent if selected",
    concessionEstimate: "Estimated concession credit",
    firstMonth: "First month rent",
    securityDeposit: "Security deposit",
    appFee: "Application fee",
    adminFee: "Admin / move-in fee",
    petFee: "Pet fee / deposit if selected"
  },
  zh: {
    recurringFees: "固定楼内月费",
    utilitiesEstimate: "水电网估算",
    electricityEstimate: "电费估算",
    internetEstimate: "网络估算",
    insuranceEstimate: "租客保险",
    furnitureAmortized: "需要家具时的租赁估算",
    parkingEstimate: "选择停车时的估算",
    petRent: "养宠物时的每月费用",
    concessionEstimate: "估算优惠月摊",
    firstMonth: "首月租金",
    securityDeposit: "押金",
    appFee: "申请费",
    adminFee: "admin / move-in fee",
    petFee: "养宠物时的一次性费用 / 押金"
  }
};

const COST_TEXT = {
  en: {
    title: "True cost check",
    trueMonthly: "Estimated true monthly",
    moveInCash: "Upfront amount",
    grossBeforeConcession: "Before concession",
    potentialConcession: amount => `Estimated concession credit: about ${formatMoney(amount)}/mo; confirm exact-unit and lease eligibility.`,
    monthlyIncludes: "Monthly estimate includes",
    moveInIncludes: "Upfront estimate includes",
    caveat: "Estimate only. Use it to compare hidden-cost exposure, then verify the exact fee sheet and lease terms before applying.",
    excludedPrefix: "Not included yet",
    estimateSuffix: "est."
  },
  zh: {
    title: "真实成本粗算",
    trueMonthly: "估算月成本",
    moveInCash: "签约入住前付款",
    grossBeforeConcession: "优惠前估算",
    potentialConcession: amount => `优惠月摊估算约 ${formatMoney(amount)}；具体房源和租期资格仍需确认。`,
    monthlyIncludes: "月成本包含",
    moveInIncludes: "签约入住前付款包括",
    caveat: "这是估算，用来比较 hidden cost 暴露程度；申请前仍要用具体房源的 fee sheet 和 lease 条款核实。",
    excludedPrefix: "暂未计入",
    estimateSuffix: "估算"
  }
};

const CAMPUS_LABELS = {
  central_campus: "Central Campus / Law / Humanities",
  med_school: "Med School / YNHH",
  som_prospect: "SOM / Prospect Hill",
  seas_science: "SEAS / Science Hill",
  downtown_station: "Downtown",
  balanced: "Balanced Yale-area access"
};

const CAMPUS_LABELS_ZH = {
  central_campus: "Central Campus / Law / Humanities",
  med_school: "医学院 / YNHH",
  som_prospect: "SOM / Prospect Hill",
  seas_science: "SEAS / Science Hill",
  downtown_station: "Downtown",
  balanced: "主要校区通勤均衡"
};

const UI_TEXT = {
  en: {
    defaultSummary: "Using the default answers, start with these 3.",
    outOfScopeRank: "Out of current scope",
    outOfScopeTitle: "No apartment top 3 yet",
    outOfScopeSubtitle: "This version focuses on mainstream New Haven apartments. It does not cover low-budget rooms, sublets, independent landlords, or pure roommate matching.",
    whyFiltered: "Why this is filtered",
    whyFilteredItems: [
      "This budget range is usually solved through rooms, sublets, or independent landlords rather than apartment leasing offices.",
      "The current data pool does not have enough reliable evidence on low-budget rooms, roommate rules, maintenance, and utilities."
    ],
    stillCovered: "Still covered here",
    stillCoveredItems: [
      "Mainstream studio, 1BR, and 2BR split apartment options.",
      "Fit ranking by campus, true cost, utilities, amenities, daily life, and application friction."
    ],
    laterScope: "Can be separate later",
    laterScopeItems: [
      "Room, sublet, roommate, and independent-landlord verification workflows.",
      "Yale Graduate Housing can return as a separate baseline for the next application cycle."
    ],
    noApartmentShown: "No apartment recommendation shown",
    scopeBoundary: "Scope boundary",
    baseSummary: (unitType, budget, campus, count) => `For a ${unitType} with a ${budget} budget and a ${campus} routine, start with these ${count}.`,
    balancedSummary: (unitType, budget, count) => `For a ${unitType} with a ${budget} budget, these ${count} offer the most balanced access across four main Yale areas.`,
    budgetGapSummary: "The current mainstream apartment pool has no strong budget fit; treat these as stretch comparisons and confirm true monthly cost before applying.",
    match: "match",
    exploreDirection: "explore direction",
    scoreLabel: "fit score",
    campusTierLabel: "Location fit",
    facts: {
      cost: "Cost signal",
      value: "Value signal",
      concession: "Concession",
      utilities: "Utilities",
      furnishing: "Furnishing",
      flooring: "Flooring",
      daily: "Daily life",
      source: "Source"
    },
    sections: {
      bestFor: "Why this fits",
      tradeoffs: "Trade-offs",
      verify: "Verify before applying"
    },
    tags: {
      exploration: "Exploration direction",
      concession: "Conditional offer",
      rent: "Verify current rent"
    },
    confidenceExploration: "This is an exploration direction, not a specific apartment recommendation. First identify a specific unit, then verify rent, fees, utilities, and lease terms.",
    confidenceStale: "This option has public signals, but the data is stale. Refresh official rent, availability, fees, and local services first.",
    confidenceLow: "This option has not been verified enough. Treat the fit score as directional only, and refresh rent, availability, fees, and policy before applying.",
    feedbackEmailSubject: "MatchNHV beta feedback",
    feedbackCopied: "Feedback email copied.",
    feedbackCopying: "Copying feedback email...",
    feedbackCopyFailed: "Copy was blocked by the browser. Select the text and copy it manually.",
    feedbackTitle: "[MatchNHV beta feedback]",
    feedbackEntry: "Entry path",
    entryDefault: "Default balanced view",
    entryFullQuiz: "Full questionnaire / refined answers",
    entryLocationBrowse: campus => `Location browse: ${campus}`,
    feedbackAnswers: "My answers:",
    feedbackTop: "Top 3 shown:",
    feedbackAccuracy: "Top 3 accuracy",
    feedbackLocationTop: "Location options shown:",
    feedbackLocationAccuracy: "Location browse usefulness",
    feedbackMissing: "What is missing",
    feedbackImprove: "What to improve",
    feedbackNote: "Note: this is beta feedback, not an application request.",
    notSpecified: "Not specified",
    none: "None",
    noTop3: "No apartment top 3 shown",
    fullResultsTitle: "Apartments that fit your needs",
    locationBrowseTitle: campus => `Apartments worth comparing near ${campus}`,
    locationBrowseSummary: (campus, count) => `${count} options are shown by the current ${campus} location tier only; options in the same tier are not ranked. Complete the questionnaire for a formal ranking by budget, unit type, and living preferences.`,
    locationBrowseCardNote: "Location view only. Complete the questionnaire before comparing price, amenities, and application fit.",
    fullTieSummary: "Some options are in the same score tier. Compare the cost and trade-off summaries instead of treating their order as precise.",
    locationCandidate: "Location option",
    balancedCandidate: "balanced reference",
    sameTierMatch: "Same-tier match",
    viewDetails: "View full analysis",
    quickWhy: "Why it may fit",
    quickWatch: "Main trade-off",
    evidenceLinks: "Check sources",
    evidenceChecked: date => `Evidence checked: ${date}`,
    publicSource: "Public source",
    officialSource: "Official site",
    refinementPending: "Answers changed. Submit the questionnaire again to update the ranking.",
    feedbackScopeAccuracy: "Scope judgment",
    feedbackScopeTop: "Scope result shown:",
    feedbackContact: email => `Project email: ${email}`,
    ruleTags: {
      budgetOver: amount => `${formatMoney(amount)}/mo over budget`,
      budgetNeedsConcession: "Needs the current concession to fit budget",
      laundryVerify: "In-unit laundry needs confirmation",
      laundryMiss: "Selected unit does not show in-unit laundry",
      woodFloorVerify: "Flooring needs confirmation",
      woodFloorMiss: "Carpet may conflict with your preference",
      privateSpaceVerify: "Whether the kitchen or bathroom is shared needs confirmation",
      furnitureReadyVerify: "Furnished or furniture-rental option needs confirmation",
      campusFit: campus => `${campus} access`,
      balancedFit: "Balanced access",
      utilitiesPredictable: "Predictable utilities",
      newerBuilding: year => `Opened ${year}`,
      newerBuildingVerify: "Building age / renovation needs verification",
      amenityStrong: "Broad amenity set",
      amenityModerate: "Core amenities covered",
      amenityLimited: "Amenity set is more limited",
      densityLower: "Lower-density evidence found",
      densityVerify: "Resident density needs verification",
      accessRouteStrong: "Access + late-route signals found",
      accessRoutePartial: "Verify access and late-night route",
      parkingAmple: "Official page says ample; verify current space",
      parkingAvailable: "Parking listed; verify current space",
      parkingAdjacent: "Monthly parking next door; not onsite; verify rate and space",
      parkingNoOnsite: "No onsite parking; verify nearby options",
      parkingNone: "No practical parking option confirmed",
      parkingVerify: "Parking needs verification",
      petPolicyFound: policy => formatPetPolicyTag(policy, "en"),
      petPolicyVerify: "Pet policy needs verification",
      concessionStrong: discount => `Estimated ${discount}% concession`,
      concessionNone: "No usable concession in current estimate",
      concessionVerify: "Current concession needs verification",
      shuttleFound: "Yale Shuttle access verified",
      shuttleVerify: "Yale Shuttle stop / service needs verification",
      applicationLower: "Lower application-friction signal",
      applicationVerify: "Confirm application and guarantor rules",
      localServices: "Daily services nearby",
      localServicesVerify: "Local services need a route check",
      quietStrong: "Stronger quiet-routine signal",
      quietVerify: "Quieter-living fit is limited; check orientation and street noise",
      moveInHigh: "Higher move-in cash",
      roommateFriendly: "Roommate split friendly",
      roommateVerify: "Roommate layout / lease fit needs verification"
    }
  },
  zh: {
    defaultSummary: "基于默认需求，先看这 3 个。",
    outOfScopeRank: "当前版本暂不覆盖",
    outOfScopeTitle: "这版先不推荐公寓",
    outOfScopeSubtitle: "这版先帮大家比较纽黑文主流公寓，不覆盖低预算房间、转租、独立房东或纯室友匹配。",
    whyFiltered: "为什么先不推",
    whyFilteredItems: [
      "这个预算段通常靠房间、转租或独立房东解决，不太像直接找公寓 leasing office。",
      "目前手里的资料还不足以靠谱比较低预算房源、室友规则、维修和水电网。"
    ],
    stillCovered: "这一版适合比较",
    stillCoveredItems: [
      "主流公寓里的 studio、1BR，以及 2BR 分摊选择。",
      "按常去区域、每月总成本、水电网、楼内配套、日常便利和申请难度排序。"
    ],
    laterScope: "之后可以单独做",
    laterScopeItems: [
      "房间、转租、室友匹配和独立房东核实流程。",
      "Yale Graduate Housing 可以在下一轮申请季作为单独对照加回来。"
    ],
    noApartmentShown: "暂不显示推荐",
    scopeBoundary: "当前范围",
    baseSummary: (unitType, budget, campus, count) => `你想找 ${unitType}，预算是 ${budget}，主要活动在 ${campus}；先看这 ${count} 个。`,
    balancedSummary: (unitType, budget, count) => `你想找 ${unitType}，预算是 ${budget}；这里先比较四个主要 Yale 校区之间的通勤均衡度，选出这 ${count} 个。`,
    budgetGapSummary: "目前没有特别贴合预算的选择；下面这几栋只能当作加预算对照，申请前一定要确认每月总成本。",
    match: "匹配",
    exploreDirection: "探索方向",
    scoreLabel: "匹配分",
    campusTierLabel: "位置匹配",
    facts: {
      cost: "价格线索",
      value: "面积/价格参考",
      concession: "入住优惠",
      utilities: "水电网",
      furnishing: "家具",
      flooring: "地板",
      daily: "日常生活",
      source: "信息来源"
    },
    sections: {
      bestFor: "为什么适合",
      tradeoffs: "需要注意",
      verify: "申请前核实"
    },
    tags: {
      exploration: "探索方向",
      concession: "优惠有条件",
      rent: "租金要再确认"
    },
    confidenceExploration: "这是一个方向，不是具体公寓推荐。先锁定具体房源，再确认租金、费用、水电网和 lease 条款。",
    confidenceStale: "这个选项有公开线索，但信息比较旧。先确认最新租金、availability、费用和周边服务。",
    confidenceLow: "这个选项的信息还不够扎实，匹配分只能当方向参考。申请前先确认租金、availability、费用和政策。",
    feedbackEmailSubject: "MatchNHV 测试反馈",
    feedbackCopied: "反馈邮件正文已复制。",
    feedbackCopying: "正在复制反馈邮件正文……",
    feedbackCopyFailed: "浏览器没有允许复制，请手动选中文本复制。",
    feedbackTitle: "[MatchNHV 测试反馈]",
    feedbackEntry: "进入方式",
    entryDefault: "默认均衡结果",
    entryFullQuiz: "完整问卷 / 已细化答案",
    entryLocationBrowse: campus => `按地点浏览：${campus}`,
    feedbackAnswers: "我的答案：",
    feedbackTop: "显示的前三名：",
    feedbackAccuracy: "前三名准确度",
    feedbackLocationTop: "显示的位置选项：",
    feedbackLocationAccuracy: "地点浏览是否有用",
    feedbackMissing: "这里还漏了哪些",
    feedbackImprove: "需要改进的地方",
    feedbackNote: "注：这是测试反馈，不是申请请求。",
    notSpecified: "未填写",
    none: "无",
    noTop3: "未显示公寓前三名",
    fullResultsTitle: "适合你的公寓",
    locationBrowseTitle: campus => `${campus} 附近值得进一步比较的公寓`,
    locationBrowseSummary: (campus, count) => `这里只按现有位置资料展示 ${count} 个 ${campus} 参考选项，同一位置档不分先后。补充预算、户型和居住偏好，获得正式排序。`,
    locationBrowseCardNote: "这里只看位置；完成问卷后再比较价格、设施和申请条件。",
    fullTieSummary: "部分选项处在同一分数档，请重点比较成本和取舍，不必把先后顺序当成精确排名。",
    locationCandidate: "位置候选",
    balancedCandidate: "均衡参考",
    sameTierMatch: "同档匹配",
    viewDetails: "查看完整分析",
    quickWhy: "为什么可能适合",
    quickWatch: "最重要的取舍",
    evidenceLinks: "核对来源",
    evidenceChecked: date => `资料核对日期：${date}`,
    publicSource: "公开来源",
    officialSource: "官网来源",
    refinementPending: "答案已修改，请重新提交问卷更新排序。",
    feedbackScopeAccuracy: "范围判断",
    feedbackScopeTop: "显示的范围判断：",
    feedbackContact: email => `项目邮箱：${email}`,
    ruleTags: {
      budgetOver: amount => `高于预算上限 ${formatMoney(amount)}/月`,
      budgetNeedsConcession: "需要当前优惠后才在预算内",
      laundryVerify: "房内洗烘需按具体房间核实",
      laundryMiss: "所选户型未显示房内洗烘",
      woodFloorVerify: "地板需按具体房间核实",
      woodFloorMiss: "可能有地毯",
      privateSpaceVerify: "厨卫是否与人共用待核实",
      furnitureReadyVerify: "家具方案待核实",
      campusFit: campus => `${campus} 方便`,
      balancedFit: "通勤均衡",
      utilitiesPredictable: "utilities 更好预估",
      newerBuilding: year => `${year} 年开业`,
      newerBuildingVerify: "楼龄与翻新待核实",
      amenityStrong: "楼内设施较全",
      amenityModerate: "常用设施基本覆盖",
      amenityLimited: "楼内设施相对精简",
      densityLower: "有较低租户密度证据",
      densityVerify: "租户密度待核实",
      accessRouteStrong: "门禁与晚间路线信息较全",
      accessRoutePartial: "门禁与晚间路线要确认",
      parkingAmple: "官网称 parking 充足，空位仍要确认",
      parkingAvailable: "有 parking，空位要确认",
      parkingAdjacent: "隔壁有月租 parking，非楼内；价格和空位要确认",
      parkingNoOnsite: "没有楼内 parking，附近方案待核实",
      parkingNone: "没有确认可用的 parking 方案",
      parkingVerify: "parking 情况待核实",
      petPolicyFound: policy => formatPetPolicyTag(policy, "zh"),
      petPolicyVerify: "宠物政策待核实",
      concessionStrong: discount => `估算优惠约 ${discount}%`,
      concessionNone: "当前没有可计入的优惠",
      concessionVerify: "当前优惠待核实",
      shuttleFound: "Yale Shuttle 信息已核实",
      shuttleVerify: "Yale Shuttle 站点与班次待核实",
      applicationLower: "申请流程相对省事",
      applicationVerify: "申请材料与 guarantor 要确认",
      localServices: "吃饭买菜方便",
      localServicesVerify: "周边服务要按路线确认",
      quietStrong: "更适合怕街噪",
      quietVerify: "安静匹配一般，注意房源朝向和街噪",
      moveInHigh: "move-in cash 较高",
      roommateFriendly: "roommate 分摊友好",
      roommateVerify: "合租户型与 lease 要确认"
    }
  }
};

const FEEDBACK_FORM_TEXT = {
  en: {
    results: {
      label: "Does the Top 3 feel right?",
      options: ["Mostly accurate", "One option is clearly off", "Not close to my needs"]
    },
    scope: {
      label: "Was this scope boundary helpful?",
      options: ["Yes, this is clear", "I still expected apartment options", "The explanation needs work"]
    },
    location: {
      label: "Were these location options useful?",
      options: ["Useful starting point", "A clear option is missing", "Not what I expected"]
    }
  },
  zh: {
    results: {
      label: "前三名感觉准吗？",
      options: ["大方向准确", "有一个明显不对", "不太符合我的需求"]
    },
    scope: {
      label: "这个范围判断有帮助吗？",
      options: ["有帮助，范围很清楚", "我还是希望看到公寓选项", "这段解释需要调整"]
    },
    location: {
      label: "这些地点参考有帮助吗？",
      options: ["有帮助，方向清楚", "有明显遗漏", "不太符合我的预期"]
    }
  }
};

const CATEGORY_LABELS_BY_LANG = {
  en: {
    budget: "Budget fit",
    campus: "Campus fit",
    utilities: "Utilities",
    setup: "Main needs",
    priority: "Priority fit"
  },
  zh: {
    budget: "预算匹配",
    campus: "位置匹配",
    utilities: "水电网",
    setup: "主要需求匹配",
    priority: "关注点匹配"
  }
};

const PRIORITY_REASON_LABELS = {
  en: {
    application: "Application fit",
    true_cost: "True-cost fit",
    utilities_predictable: "Utility-cost fit",
    roommate: "Roommate fit",
    basic: "Basic-amenity fit",
    package: "Building-service fit",
    gym_pool: "Amenity fit",
    parking: "Parking fit",
    newer_building: "New-building fit",
    amenity_breadth: "Amenity-breadth fit",
    low_density: "Resident-density check",
    access_late_route: "Access and late-route fit",
    pet_friendly: "Pet-policy fit",
    concession: "Concession fit",
    yale_shuttle: "Yale Shuttle check",
    building_access: "Building-access fit",
    late_route: "Route fit",
    food_store: "Local-service fit",
    quiet_routine: "Quiet fit"
  },
  zh: {
    application: "申请门槛匹配",
    true_cost: "真实成本匹配",
    utilities_predictable: "水电暖费用匹配",
    roommate: "合租匹配",
    basic: "基础配套匹配",
    package: "楼内服务匹配",
    gym_pool: "配套匹配",
    parking: "停车匹配",
    newer_building: "新楼匹配",
    amenity_breadth: "设施完整度匹配",
    low_density: "租户密度核实",
    access_late_route: "门禁与晚间路线匹配",
    pet_friendly: "宠物政策匹配",
    concession: "入住优惠匹配",
    yale_shuttle: "Yale Shuttle 核实",
    building_access: "门禁/报修匹配",
    late_route: "晚间路线匹配",
    food_store: "生活便利匹配",
    quiet_routine: "安静匹配"
  }
};

const ANSWER_VALUE_LABELS = {
  en: {
    utilities: {
      predictable: "As predictable as possible",
      some_variable: "Some variable costs are fine",
      amenity_tradeoff: "Pay more true cost for stronger amenities"
    },
    setup: {
      furniture_ready: "Less furniture hassle (rental ~$250/mo extra)",
      wood_floor: "Wood-style floor / avoid carpet if possible",
      laundry: "In-unit laundry",
      private_space: "Not sharing kitchen or bathroom with roommates"
    },
    requirement: {
      laundry: "In-unit laundry",
      wood_floor: "Avoid carpet if possible",
      private_space: "Kitchen and bathroom not shared",
      furniture_ready: "Furnished or furniture-rental option",
      parking: "Parking",
      pet_friendly: "Pet-friendly policy"
    },
    amenity: {
      basic: "Basic is enough",
      package: "Package / front desk / maintenance",
      gym_pool: "Gym / pool / lounge",
      parking: "Parking / EV / car-friendly"
    },
    worry: {
      application: "Application friction",
      true_cost: "True monthly cost / move-in cash",
      roommate: "Roommate or split-cost fit"
    },
    daily: {
      building_access: "Access, package, and repairs",
      late_route: "Late-night routes and transportation",
      food_store: "Restaurants, groceries, and pharmacy",
      quiet_routine: "Quieter routine"
    },
    priority: {
      application: "Application friction",
      true_cost: "True monthly cost / move-in cash",
      utilities_predictable: "Clearer utility costs",
      roommate: "Roommate or split-cost fit",
      basic: "Basic amenities are enough",
      package: "Package / front desk / maintenance",
      gym_pool: "Gym / pool / lounge",
      parking: "Parking / EV / car-friendly",
      newer_building: "Newer building",
      amenity_breadth: "Broader building amenities",
      low_density: "Lower resident density",
      access_late_route: "Building access and late-night route",
      pet_friendly: "Pet-friendly policy",
      concession: "Move-in concession",
      yale_shuttle: "Yale Shuttle access",
      building_access: "Access, package, and repairs",
      late_route: "Late-night routes and transportation",
      food_store: "Restaurants, groceries, and pharmacy",
      quiet_routine: "Street noise / quieter routine"
    }
  },
  zh: {
    utilities: {
      predictable: "越可预期越好",
      some_variable: "能接受部分浮动费用",
      amenity_tradeoff: "愿意为楼内配套承担更高真实成本"
    },
    setup: {
      furniture_ready: "入住尽量少折腾（家具租赁约 $250/月额外）",
      wood_floor: "木地板风格 / 尽量不铺地毯",
      laundry: "房内洗衣机和烘干机",
      private_space: "不想和室友共用厨房或卫生间"
    },
    requirement: {
      laundry: "房内洗衣机和烘干机",
      wood_floor: "尽量不铺地毯",
      private_space: "厨卫不与人共用",
      furniture_ready: "带家具或可租家具",
      parking: "停车位",
      pet_friendly: "宠物友好"
    },
    amenity: {
      basic: "够用就行",
      package: "收包裹 / 前台 / 维修",
      gym_pool: "健身房 / 泳池 / 公共休息区",
      parking: "停车 / 充电 / 对开车友好"
    },
    worry: {
      application: "申请流程省事",
      true_cost: "每月总成本更可控",
      roommate: "合租 / 分摊成本"
    },
    daily: {
      building_access: "门禁、收包裹和报修",
      late_route: "晚间路线和交通",
      food_store: "餐馆、买菜和药店",
      quiet_routine: "更安静的日常"
    },
    priority: {
      application: "申请门槛和材料",
      true_cost: "每月总成本 / 入住前需准备",
      utilities_predictable: "水电暖费用更明确",
      roommate: "合租 / 分摊成本",
      basic: "配套够用就行",
      package: "收包裹 / 前台 / 维修",
      gym_pool: "健身房 / 泳池 / 公共休息区",
      parking: "停车 / 充电 / 对开车友好",
      newer_building: "新楼 / 装修更新",
      amenity_breadth: "楼内设施更全",
      low_density: "租户密度低",
      access_late_route: "楼内门禁与晚间路线",
      pet_friendly: "宠物友好",
      concession: "免租期 / 入住优惠",
      yale_shuttle: "Yale Shuttle 方便",
      building_access: "门禁、收包裹和报修",
      late_route: "晚间路线和交通",
      food_store: "吃饭买菜方便",
      quiet_routine: "住得安静"
    }
  }
};

let latestAnswers = null;
let latestResults = [];
let latestEntry = "default";

const APARTMENTS = [
  {
    "id": "360-state",
    "name": "360 State Street",
    "area": "Downtown high-rise · 360 State St",
    "price": {
      "min": 1735,
      "max": 5200,
      "label": "$1,735 advertised studio; current visible total starts at $2,372",
      "availability": {
        "checkedDate": "2026-07-11",
        "horizonLabel": "current visible inventory + next 3 months",
        "sourceUrl": "https://www.360statestreet.com/floorplans",
        "sourceFile": "data/360_availability_v2.md",
        "priceClassification": "advertised_gap",
        "rentMode": "total_including_required_fees",
        "includes": [
          "base rent",
          "required monthly fees"
        ],
        "unitCount": 31,
        "advertisedByType": {
          "studio": 1735,
          "1br": 2055,
          "2br": 3340,
          "3br": 4907
        },
        "budgetBasis": {
          "unitType": "studio",
          "rent": 2372,
          "baseRent": 2257,
          "unit": "APT 705",
          "availableFrom": "Available Now",
          "leaseMonths": 11,
          "sqft": 517,
          "pricePerSqft": 4.59
        },
        "currentMinByType": {
          "studio": {
            "rent": 2372,
            "baseRent": 2257,
            "unit": "APT 705",
            "availableFrom": "Available Now",
            "leaseMonths": 11,
            "sqft": 517,
            "pricePerSqft": 4.59
          },
          "1br": {
            "rent": 2385,
            "baseRent": 2270,
            "unit": "APT 1109",
            "availableFrom": "Available Now",
            "leaseMonths": 12,
            "sqft": 582,
            "pricePerSqft": 4.1
          },
          "2br": {
            "rent": 3628,
            "baseRent": 3513,
            "unit": "APT 2418",
            "availableFrom": "Available Now",
            "leaseMonths": 10,
            "sqft": 1012,
            "pricePerSqft": 3.58
          },
          "3br": {
            "rent": 4822,
            "baseRent": 4707,
            "unit": "APT 3107",
            "availableFrom": "Available Now",
            "leaseMonths": 12,
            "sqft": 1256,
            "pricePerSqft": 3.84
          }
        }
      }
    },
    "trueMonthlyCost": {
      "advertisedRent": 1735,
      "recurringFees": {
        "amount": 115,
        "confidence": "verified_public",
        "sourceUrl": "https://www.360statestreet.com/floorplans",
        "sourceRef": "data/360_availability_v2.md",
        "checkedDate": "2026-07-11"
      },
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 130,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionEstimate": {
        "monthsFree": null,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 350,
        "maxMultiplier": 2,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "appFee": {
        "amount": 27,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "concession": "",
    "valueSignal": "Current snapshot: Studio APT 705 is $2,372 total / 517 sq ft ($4.59/sqft); 1BR APT 1109 is $2,385 total / 582 sq ft ($4.10/sqft). Compare within the same lease and fee basis.",
    "campusScores": {
      "central_campus": 4,
      "med_school": 3,
      "som_prospect": 2,
      "seas_science": 3,
      "downtown_station": 5,
      "balanced": 4
    },
    "utilities": "variable",
    "setupTags": [
      "furniture_ready",
      "laundry",
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool",
      "parking"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "decisionSignals": {
      "parkingAvailability": "official_ample_claim",
      "parkingSource": "Official amenities page checked 2026-07-01",
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": null,
        "breedRestrictions": null,
        "maxPets": 2,
        "oneTimeFee": 400,
        "petDeposit": null,
        "monthlyRent": 35,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionAvailability": "limited_not_scored"
    },
    "quietScore": 35,
    "flooring": "Photos suggest hardwood flooring; verify exact unit",
    "furnishing": "Unfurnished base; CORT furniture partner; 1BR rental is about $250/mo on a 12-mo lease",
    "applicationFriction": 4,
    "roommateFit": 2,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Downtown grocery/food + building services",
    "sourceLabel": "Official availability snapshot checked 2026-07-11; fees still need written sheet",
    "bestFor": [
      "预算较高，主要活动在 downtown / Central Campus，想要 full-service building 的学生",
      "看重 in-unit laundry、package handling、maintenance、parking 和楼内/楼下日常便利的学生",
      "不需要真正 furnished included，但愿意用 CORT 或购买家具解决 setup 的学生"
    ],
    "tradeoffs": [
      "advertised rent 之外还要确认 utilities、insurance、deposit、parking、amenity/admin fees",
      "到医学院、SOM、Science Hill 的体感差异会很大，不能只看楼名",
      "家具不是默认包含，CORT partner 只是降低 setup friction"
    ],
    "verify": [
      "written fee sheet and utility billing",
      "guarantor/co-signer policy for students without U.S. credit history",
      "flooring and furniture option for exact unit",
      "late-night route to your exact Yale building"
    ],
    "priceAvailabilityConfidence": "verified_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "hardwood"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown high-rise · 360 State St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "olive-wooster",
    "name": "Olive & Wooster",
    "area": "Wooster Square / downtown edge · 87 Union St",
    "price": {
      "min": 2400,
      "max": 3800,
      "label": "当前可见：studio $1,808-$2,170；1BR $1,864-$2,237（含 special 口径）",
      "availability": {
        "checkedDate": "2026-07-11",
        "horizonLabel": "当前可见房源 + 未来 3 个月",
        "sourceUrl": "https://oliveandwooster.com/availability",
        "sourceFile": "data/olive_parsed_fixed.md",
        "priceClassification": "range_including_current_special",
        "rentMode": "range_including_current_special",
        "includes": [
          "published price range"
        ],
        "unitCount": 34,
        "budgetBasis": {
          "unitType": "studio",
          "rent": 1808,
          "rentMax": 2170,
          "unit": "226W",
          "availableFrom": "7/10/26",
          "sqft": 605,
          "pricePerSqft": 2.99
        },
        "currentMinByType": {
          "studio": {
            "rent": 1808,
            "rentMax": 2170,
            "unit": "226W",
            "availableFrom": "7/10/26",
            "sqft": 605,
            "pricePerSqft": 2.99
          },
          "1br": {
            "rent": 1864,
            "rentMax": 2237,
            "unit": "321E",
            "availableFrom": "8/22/26",
            "sqft": 631,
            "pricePerSqft": 2.95
          },
          "2br": {
            "rent": 2416,
            "rentMax": 3141,
            "unit": "233W",
            "availableFrom": "8/22/26",
            "sqft": 967,
            "pricePerSqft": 2.5
          },
          "3br": {
            "rent": 4019,
            "rentMax": 5828,
            "unit": "302E",
            "availableFrom": "8/14/26",
            "sqft": 1314,
            "pricePerSqft": 3.06
          },
          "4br": {
            "rent": 5368,
            "rentMax": 6442,
            "unit": "651W",
            "availableFrom": "NOW",
            "sqft": 1386,
            "pricePerSqft": 3.87
          },
          "co_living": {
            "rent": 1010,
            "rentMax": 1211,
            "unit": "Unspecified",
            "availableFrom": "9/2/26",
            "sqft": 347,
            "pricePerSqft": 2.91,
            "perPerson": true
          }
        }
      }
    },
    "trueMonthlyCost": {
      "advertisedRent": 2400,
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 175,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionEstimate": {
        "monthsFree": 3,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": "https://oliveandwooster.com/availability",
        "sourceRef": "data/apartment_research_consolidated_2026-07-02.csv#official_concession",
        "checkedDate": "2026-07-01"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "multiplier": 1,
        "confidence": "planning_assumption"
      },
      "appFee": {
        "amount": 100,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "amount": 50,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "concession": "Official page shows up to 3 months free on select apartments and reduced pricing on select 1BR.",
    "valueSignal": "Current snapshot: private studio $1,808-$2,170 / 605 sq ft and 1BR $1,864-$2,237 / 631 sq ft. Lower bounds may include current specials; co-living is a separate per-person basis.",
    "campusScores": {
      "central_campus": 3,
      "med_school": 3,
      "som_prospect": 2,
      "seas_science": 2,
      "downtown_station": 3,
      "balanced": 4
    },
    "utilities": "variable",
    "setupTags": [
      "laundry",
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool",
      "parking"
    ],
    "dailyTags": [
      "building_access",
      "food_store"
    ],
    "quietScore": 62,
    "flooring": "needs exact-unit verification",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Med District / Wooster food convenience",
    "sourceLabel": "Official availability snapshot checked 2026-07-11; lower bounds may include current special",
    "bestFor": [
      "主要去医学院 / YNHH / 公卫学院，且想住 newer building 的学生",
      "看重 in-unit laundry、fob access、amenities 和 Wooster/downtown local services 的学生",
      "有 roommate 或较高预算，愿意核实 concessions 后再比较 true cost 的学生"
    ],
    "tradeoffs": [
      "官方 availability 页面没有在静态文本里列出 exact rent，需要人工刷新或问 leasing",
      "furnished 没有被验证，不能当成少折腾选项直接推荐",
      "到 SOM / Science Hill 的通勤不一定优，需要按课表或实验室路线算"
    ],
    "verify": [
      "exact unit rent and concessions",
      "what utilities and Wi-Fi billing actually include",
      "furnished or furniture-rental options",
      "walking route to your exact Yale building"
    ],
    "priceAvailabilityConfidence": "verified_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "wood_look"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "sourceUrl": null,
      "checkedDate": "2026-07-13",
      "confidence": "verified_public",
      "sourceRef": "VERIFICATION_LOG.md#restored-fields"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Wooster Square / downtown edge · 87 Union St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "the-taft",
    "name": "The Taft",
    "area": "Downtown · 265 College St",
    "price": {
      "min": 1865,
      "max": 3300,
      "label": "$1,865-$2,060 studio; $2,150-$2,440 1BR; $2,950-$3,300 2BR"
    },
    "trueMonthlyCost": {
      "advertisedRent": 1865,
      "recurringFees": {
        "amount": 55,
        "confidence": "verified_public",
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/taft-apartments/default.aspx",
        "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "utilitiesEstimate": {
        "amount": 90,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": null,
      "concessionEstimate": {
        "monthsFree": 2,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "eligibleUnitTypes": [
          "studio",
          "1br"
        ],
        "moveInDeadline": "2026-08-01",
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": "https://www.rentcafe.com/apartments/ct/new-haven/taft-apartments/default.aspx",
        "sourceRef": "docs/phase_c_evidence/the-taft_2026-07-12.md",
        "checkedDate": "2026-07-12"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 250,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#yale-affiliate-deposit-correction",
        "checkedDate": "2026-07-14"
      },
      "appFee": {
        "amount": 50,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "concession": "2 months free for studio/1BR leases with move-in on or before 2026-08-01.",
    "valueSignal": "Reviewed official snapshot: Studio 05O is $1,895 / 424 sq ft ($4.47/sqft); 1BR 05S is $1,999 / 697 sq ft ($2.87/sqft). Compare total price, lease, and unit condition together.",
    "campusScores": {
      "central_campus": 5,
      "med_school": 4,
      "som_prospect": 3,
      "seas_science": 3,
      "downtown_station": 5,
      "balanced": 5
    },
    "utilities": "mixed",
    "setupTags": [
      "furniture_ready",
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "decisionSignals": {
      "parkingAvailability": "no_onsite",
      "parkingAccess": {
        "type": "adjacent_monthly_garage",
        "walkMinutes": 1,
        "monthlyParking": true,
        "availability": "verify",
        "priceStatus": "market_rate_user_reported",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "user_feedback_2026-07-14",
        "checkedDate": "2026-07-14"
      },
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": 25,
        "breedRestrictions": null,
        "maxPets": 1,
        "oneTimeFee": 350,
        "petDeposit": null,
        "monthlyRent": 50,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "parkingSourceUrl": null,
      "parkingCheckedDate": "2026-07-09",
      "parkingSourceRef": "user_supplied_official_site_review_2026-07-09"
    },
    "quietScore": 42,
    "flooring": "Vinyl plank or hardwood; verify exact unit",
    "furnishing": "CORT / corporate furnished option visible; not furnished-included; 1BR rental is about $250/mo on a 12-mo lease",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Convenient for Central Campus and Med School",
    "sourceLabel": "Paredim + RentCafe refreshed 2026-06-29; fee sheet still incomplete",
    "bestFor": [
      "Central Campus / Downtown 活动多，希望缩短日常通勤的学生",
      "预算在 studio / 1BR 主流区间，且能赶上 2026-08-01 前 move-in concession 的学生",
      "需要 heat/hot water included，并愿意核实电费、网络和家具方案的学生"
    ],
    "tradeoffs": [
      "当前 2 个月免租只适用于 Studio / 1BR；具体房源和入住日期仍要确认",
      "recurring Trash + Amenities 已见 $55/mo；楼内没有住户停车位，隔壁有月租 parking，完整 fee sheet 和 insurance 仍缺",
      "不是 newer glass-tower profile，unit condition、laundry、flooring 要看 exact unit"
    ],
    "verify": [
      "full fee sheet and whether skip-deposit offer has conditions",
      "electricity, internet, laundry, pet, and renter's insurance costs; nearby garage options if you have a car",
      "whether CORT / corporate furnished option works for normal student leases",
      "bank statement format for Yale community applicants and remote application policy"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "hard_surface"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleCommunityBankStatementPath": {
        "value": true,
        "guarantorRequired": false,
        "coSignerRequired": false,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#yale-community-bank-statement-path",
        "checkedDate": "2026-07-14"
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown · 265 College St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "the-archive",
    "name": "The Archive",
    "area": "Downtown / Ninth Square · Chapel / Orange",
    "price": {
      "min": 2164,
      "max": 8513,
      "label": "$2,232+ studio; $2,164+ 1BR; $3,041+ 2BR; $3,922+ 3BR total monthly price"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2164,
      "recurringFees": {
        "amount": 0,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "utilitiesEstimate": {
        "amount": 90,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 14,
        "confidence": "sample_lease",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 200,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "concessionEstimate": {
        "monthsFree": 2,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "data/apartment_research_consolidated_2026-07-02.csv#official_concession",
        "checkedDate": "2026-07-01"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 0,
        "confidence": "sample_lease",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "appFee": {
        "amount": 50,
        "confidence": "verified_public",
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "concession": "Official site shows up to 2 months free on immediate move-ins + Yale discounts.",
    "valueSignal": "Reviewed official total monthly price: Sx1 Studio starts at $2,232 / 387 sq ft ($5.77/sqft); 1x1 starts at $2,464 / 503 sq ft ($4.90/sqft).",
    "campusScores": {
      "central_campus": 4,
      "med_school": 3,
      "som_prospect": 2,
      "seas_science": 2,
      "downtown_station": 5,
      "balanced": 4
    },
    "utilities": "mixed",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "quietScore": 48,
    "flooring": "Photos suggest luxury vinyl tile (LVT); verify exact unit",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 4,
    "roommateFit": 4,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Ninth Square / downtown services + roommate-sized layouts",
    "sourceLabel": "Official site + Entrata refreshed 2026-06-29; all-in claims need confirmation",
    "bestFor": [
      "还没确定独居还是合租，想在同一栋楼比较不同户型的学生",
      "有 roommate 或想比较 2BR/3BR split cost 的学生",
      "对 concessions 敏感，但愿意逐条确认 lease length 和 eligibility 的学生"
    ],
    "tradeoffs": [
      "部分 1BR / 2BR 的价格区间跨度很大，实际总价会随具体房源和 lease term 明显变化",
      "总月价口径更容易比较，但停车、宠物和保险等按需费用仍可能另算",
      "Archive I/II 或多地址口径还要确认，避免把不同楼混成一个体验"
    ],
    "verify": [
      "what Total Monthly Leasing Price includes and excludes",
      "utilities, internet, parking, pet, insurance, application/admin fees",
      "exact concession terms for immediate move-in and Yale discount",
      "whether to split profile by building/address"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "lvt"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": null,
        "breedRestrictions": null,
        "maxPets": null,
        "oneTimeFee": 350,
        "petDeposit": null,
        "monthlyRent": null,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": "https://entrata.thearchiveapts.com/new-haven/the-archive/conventional/",
        "sourceRef": "docs/phase_c_evidence/the-archive_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "utilitiesIncluded": [
        "internet"
      ]
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown / Ninth Square · Chapel / Orange",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "estelle",
    "name": "Estelle",
    "area": "Downtown / New Haven Green edge · 19 Elm St",
    "price": {
      "min": 2795,
      "max": 5795,
      "label": "Studio inquire; $2,795+ 1BR; $3,870+ 2BR; $4,725+ 3BR; $5,795+ 4BR"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2795,
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 180,
        "confidence": "planning_assumption",
        "appliesWhenPriority": "parking"
      },
      "concessionEstimate": {
        "monthsFree": 2,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": "https://estellenewhaven.securecafe.com/onlineleasing/estelle-new-haven/floorplans",
        "sourceRef": "data/apartment_research_consolidated_2026-07-02.csv#official_concession",
        "checkedDate": "2026-07-01"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "multiplier": 1,
        "confidence": "planning_assumption"
      },
      "appFee": {
        "amount": 50,
        "confidence": "planning_assumption"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "concession": "Official page shows 2 months free on a 12-month lease; confirm exact-unit eligibility.",
    "valueSignal": "Reviewed official snapshot: 1BR starts at $2,835 total and 2BR starts at $3,910 total. The reviewed rows do not contain reliable square footage, so no $/sqft claim is shown.",
    "campusScores": {
      "central_campus": 5,
      "med_school": 3,
      "som_prospect": 3,
      "seas_science": 3,
      "downtown_station": 5,
      "balanced": 4
    },
    "utilities": "unknown",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "decisionSignals": {
      "openedYear": 2026,
      "openedYearConfidence": "verified_public",
      "openedYearSource": "Official opening announcement checked 2026-07-01",
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "quietScore": 50,
    "flooring": "Photos suggest warm wood-style flooring; verify exact unit",
    "furnishing": "Optional furnished apartments available for additional cost",
    "applicationFriction": 4,
    "roommateFit": 4,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "New downtown opening + Central Campus access",
    "sourceLabel": "Official site + SecureCafe refreshed 2026-06-29; opening/fees need confirmation",
    "bestFor": [
      "想要 newest-building feel，主要在 Central Campus / downtown 活动的学生",
      "能接受新开楼 move-in execution risk，但想用 opening concession 抵消部分成本的学生",
      "有 roommate 或高预算，想比较 2BR/3BR/4BR split 的学生"
    ],
    "tradeoffs": [
      "Studio pricing is not publicly listed; ask the leasing office for a current quote",
      "opening concessions 很强，但 specials、pricing、lease terms、availability 可能 daily change",
      "fee sheet、utilities、parking、deposit、insurance 都还没进入 true-cost scoring"
    ],
    "verify": [
      "final opening / move-in readiness and exact available unit",
      "fee sheet, utility billing, parking, deposit, pet, insurance, and internet",
      "12-month concession eligibility for the exact unit",
      "postal code discrepancy and student application requirements"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "low",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "wood_look"
      ],
      "scope": null,
      "evidenceType": null,
      "sourceUrl": null,
      "checkedDate": "2026-07-13",
      "confidence": "verified_public",
      "sourceRef": "VERIFICATION_LOG.md#restored-fields"
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown / New Haven Green edge · 19 Elm St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "axis-201",
    "name": "Axis 201",
    "area": "Science Park / Munson St · 201 Munson St",
    "price": {
      "min": 1852,
      "max": 4425,
      "label": "当前可见：studio $1,852（345 sqft）；1BR $2,445（681 sqft）起",
      "availability": {
        "checkedDate": "2026-07-11",
        "horizonLabel": "当前可见房源 + 未来 3 个月",
        "sourceUrl": "https://axis201.com/floor-plans",
        "sourceFile": "data/axis_201_availability.md",
        "priceClassification": "verified_available",
        "rentMode": "base_rent",
        "includes": [
          "base rent"
        ],
        "unitCount": 56,
        "advertisedByType": {
          "studio": 1852,
          "1br": 2282,
          "2br": 3084,
          "3br": 4425
        },
        "budgetBasis": {
          "unitType": "studio",
          "rent": 1852,
          "unit": "0249",
          "availableFrom": "Today",
          "sqft": 345,
          "pricePerSqft": 5.37
        },
        "currentMinByType": {
          "studio": {
            "rent": 1852,
            "unit": "0249",
            "availableFrom": "Today",
            "sqft": 345,
            "pricePerSqft": 5.37
          },
          "1br": {
            "rent": 2445,
            "unit": "0331",
            "availableFrom": "Jul 7",
            "sqft": 681,
            "pricePerSqft": 3.59
          },
          "2br": {
            "rent": 3084,
            "unit": "0647",
            "availableFrom": "Today",
            "sqft": 918,
            "pricePerSqft": 3.36
          },
          "3br": {
            "rent": 4425,
            "unit": "0120",
            "availableFrom": "Today",
            "sqft": 1310,
            "pricePerSqft": 3.38
          }
        }
      }
    },
    "trueMonthlyCost": {
      "advertisedRent": 1852,
      "recurringFees": {
        "amount": 83.39,
        "confidence": "verified_public",
        "sourceUrl": "https://axis201.com/floor-plans",
        "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 125,
        "maxAmount": 195,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionEstimate": {
        "monthsFree": 2,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": "https://axis201.com/floor-plans",
        "sourceRef": "docs/phase_c_evidence/axis-201_2026-07-12.md",
        "checkedDate": "2026-07-12"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 250,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#yale-affiliate-deposit-correction",
        "checkedDate": "2026-07-14"
      },
      "appFee": {
        "amount": 50,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "concession": "Official page advertises up to 2 months free on qualifying leases.",
    "valueSignal": "Current snapshot: studio starts at $1,852 / 345 sq ft ($5.37/sqft); 1BR starts at $2,445 / 681 sq ft ($3.59/sqft). The low studio entry price does not represent the 1BR market.",
    "campusScores": {
      "central_campus": 3,
      "med_school": 2,
      "som_prospect": 4,
      "seas_science": 5,
      "downtown_station": 2,
      "balanced": 3
    },
    "utilities": "variable",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool"
    ],
    "dailyTags": [
      "building_access",
      "quiet_routine"
    ],
    "quietScore": 85,
    "flooring": "needs exact-unit verification",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 4,
    "roommateFit": 4,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Science Park / Science Hill commute",
    "sourceLabel": "Official availability snapshot checked 2026-07-11; utilities and student policy need confirmation",
    "bestFor": [
      "主要去 SEAS / Science Hill / SOM / Prospect corridor，想避开 downtown core 的学生",
      "想用 lower studio starting rent 或 roommate/townhome layout 控制 cost 的学生",
      "日常更看重 building routine 和安静感，而不是 downtown nightlife 的学生"
    ],
    "tradeoffs": [
      "到医学院 / Union Station / Downtown 办事不一定顺",
      "官网价格页列出 required fees $83.39/月；水电网和宠物/储物等额外费用仍需确认",
      "公开优惠已计入估算；若具体房源不符合资格，应改看优惠前金额"
    ],
    "verify": [
      "utility billing, parking, renters insurance, and pet/storage fees",
      "lease term and concession eligibility",
      "route to exact SEAS / SOM / lab building, including late-night plan",
      "bank statement format for Yale community applicants"
    ],
    "priceAvailabilityConfidence": "verified_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [],
      "scope": "building",
      "evidenceType": null,
      "sourceUrl": null,
      "checkedDate": "2026-07-13",
      "confidence": "verified_public",
      "sourceRef": "VERIFICATION_LOG.md#restored-fields"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleCommunityBankStatementPath": {
        "value": true,
        "guarantorRequired": false,
        "coSignerRequired": false,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#yale-community-bank-statement-path",
        "checkedDate": "2026-07-14"
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Science Park / Munson St · 201 Munson St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "the-audubon",
    "name": "The Audubon",
    "area": "Audubon / Whitney-Church corridor · 367 Orange St",
    "price": {
      "min": 2250,
      "max": 4952,
      "label": "$2,250+ studio; $2,671+ 1BR; $3,691+ 2BR; $4,180+ 3BR estimated monthly cost"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2250,
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 150,
        "confidence": "planning_assumption",
        "appliesWhenPriority": "parking"
      },
      "concessionEstimate": {
        "monthsFree": 1.5,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": "https://www.theaudubonapts.com/floorplans",
        "sourceRef": "data/apartment_research_consolidated_2026-07-02.csv#official_concession",
        "checkedDate": "2026-07-01"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "multiplier": 1,
        "confidence": "planning_assumption"
      },
      "appFee": {
        "amount": 50,
        "confidence": "planning_assumption"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "concession": "Official home page advertises up to 1.5 months free on select homes.",
    "campusScores": {
      "central_campus": 5,
      "med_school": 3,
      "som_prospect": 4,
      "seas_science": 4,
      "downtown_station": 3,
      "balanced": 5
    },
    "utilities": "variable",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package",
      "parking"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "quietScore": 62,
    "flooring": "Photos suggest multiple flooring selections; verify exact unit",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Arts / Central Campus / Whitney-Church access",
    "sourceLabel": "Official site refreshed 2026-06-29; estimated monthly cost needs fee breakdown",
    "bestFor": [
      "Central Campus / Arts / Whitney-Church corridor 活动多，想要 balanced campus access 的学生",
      "看重 building access、package、parking/garage verification 的学生",
      "预算较高，愿意在申请前核实 estimated monthly cost 的学生"
    ],
    "tradeoffs": [
      "页面使用 Estimated Monthly Cost，但 full fee breakdown 还没完整捕捉",
      "学生社群里出现过 garage / neighbor / access-related concerns，只能作为 route/access verification trigger",
      "到医学院或 Downtown 南侧的路线需要按真实作息看"
    ],
    "verify": [
      "cost-estimator fee breakdown and utility billing",
      "garage, access, package, lighting, and late-night route process",
      "concession terms and selected-home eligibility",
      "student guarantor/co-signer and remote application policy"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "low",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [],
      "scope": null,
      "evidenceType": null,
      "sourceUrl": null,
      "checkedDate": "2026-07-13",
      "confidence": "verified_public",
      "sourceRef": "VERIFICATION_LOG.md#restored-fields"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": null,
        "breedRestrictions": null,
        "maxPets": null,
        "oneTimeFee": 350,
        "petDeposit": null,
        "monthlyRent": 50,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Audubon / Whitney-Church corridor · 367 Orange St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "new-haven-towers",
    "name": "New Haven Towers / NHV Towers",
    "area": "Downtown York/Park/High cluster · 4 buildings",
    "price": {
      "min": 1695,
      "max": 4795,
      "label": "Madison studio $1,695+; Crown/Court/18 High vary by building"
    },
    "trueMonthlyCost": {
      "advertisedRent": 1695,
      "utilitiesEstimate": {
        "amount": 75,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 90,
        "maxAmount": 170,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": null,
        "checkedDate": "2026-07-09"
      },
      "concessionEstimate": {
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "monthsFree": 2,
        "leaseMonths": 12,
        "confidence": "conditional_offer",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "multiplier": 1.5,
        "confidence": "verified_public",
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": null,
        "checkedDate": "2026-07-09"
      },
      "appFee": {
        "amount": 50,
        "confidence": "verified_public",
        "sourceUrl": "https://newhaventowers.com/floorplans/",
        "sourceRef": null,
        "checkedDate": "2026-07-09"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "campusScores": {
      "central_campus": 5,
      "med_school": 4,
      "som_prospect": 3,
      "seas_science": 4,
      "downtown_station": 4,
      "balanced": 5
    },
    "utilities": "predictable",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool",
      "parking"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "quietScore": 45,
    "flooring": "Photos suggest hardwood floors; verify exact unit",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 3,
    "roommateFit": 4,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Campus-adjacent; slight differences across the four buildings",
    "sourceLabel": "Official floorplans refreshed 2026-06-29; tower-level pricing captured",
    "bestFor": [
      "Central Campus / Law / Art / Med 附近活动多，想要老牌 downtown cluster 的学生",
      "想要 heat/hot water included，让 utilities 更 predictable 的学生",
      "愿意按 Madison / Crown / Crown Court / 18 High 分楼比较价格和位置的学生"
    ],
    "tradeoffs": [
      "不能把四栋楼压成一个体验，价格、位置、amenities 都要 tower-specific",
      "security deposit 1.5 months + application fee 会影响 move-in cash",
      "parking $90-$170/mo，且 exact building availability 需要确认"
    ],
    "verify": [
      "which tower and exact unit you are applying for",
      "parking availability/cost, electricity, renters insurance, and move-in cash",
      "laundry, flooring, package, and maintenance setup by building",
      "student guarantor/co-signer requirements"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "hardwood"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown York/Park/High cluster · 4 buildings",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": [],
    "subBuildings": [
      {
        "name": "Madison Towers",
        "address": "111 Park St",
        "parking": null,
        "units": null
      },
      {
        "name": "Crown Towers",
        "address": "123 York St",
        "parking": null,
        "units": null
      },
      {
        "name": "Crown Court",
        "address": "100 York St",
        "parking": null,
        "units": null
      },
      {
        "name": "18 High St",
        "address": "18 High St",
        "parking": null,
        "units": null
      }
    ],
    "concession": "Official site shows 2 months free; confirm eligible tower, unit, and lease."
  },
  {
    "id": "pierpont-city-crossing",
    "name": "Pierpont at City Crossing",
    "area": "Downtown Crossing / station-med edge",
    "price": {
      "min": 2218,
      "max": 3613,
      "label": "$2,218+ Jr Studio; $2,486+ 1BR; $3,613+ 2BR"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2218,
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 150,
        "confidence": "planning_assumption",
        "appliesWhenPriority": "parking"
      },
      "concessionEstimate": {
        "monthsFree": 1,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "conditional_offer",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "multiplier": 1,
        "confidence": "planning_assumption"
      },
      "appFee": {
        "amount": 25,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "campusScores": {
      "central_campus": 3,
      "med_school": 5,
      "som_prospect": 2,
      "seas_science": 2,
      "downtown_station": 5,
      "balanced": 3
    },
    "utilities": "variable",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "quietScore": 75,
    "flooring": "Photos suggest luxury wood plank vinyl in living areas, carpet in bedrooms; verify exact unit",
    "furnishing": "Furnished status has not been verified for standard leases",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Station / Med / downtown crossing routine",
    "sourceLabel": "RMS and official RentCafe pages checked 2026-07-12",
    "bestFor": [
      "主要去医学院、Union Station 或 Downtown 南侧，想住 Pierpont 的学生",
      "想比较 Jr Studio、1BR 和 2BR，并愿意按具体房源确认价格和入住日期的学生"
    ],
    "tradeoffs": [
      "位置在 Downtown 南侧；去 Central Campus、SOM 或 Science Hill 不如市中心核心区方便",
      "部分费用、水电网、parking 和标准 lease 政策仍需确认"
    ],
    "verify": [
      "the exact unit, price, and move-in date",
      "the full fee sheet, utilities, parking, and renter's insurance",
      "student guarantor/co-signer and remote signing policy"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "lvp",
        "carpet",
        "tile"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": null,
        "breedRestrictions": null,
        "maxPets": null,
        "oneTimeFee": 350,
        "petDeposit": null,
        "monthlyRent": 25,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown Crossing / station-med edge",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": [],
    "concession": "Official site shows 1 month free on select units and lease terms; confirm eligibility."
  },
  {
    "id": "the-whit",
    "name": "The Whit",
    "area": "Wooster Square · 630 Chapel St",
    "price": {
      "min": 2400,
      "max": 5400,
      "label": "当前可见：studio $2,306（591 sqft）；1BR $2,475（677 sqft）起",
      "availability": {
        "checkedDate": "2026-07-11",
        "horizonLabel": "当前可见房源 + 未来 3 个月",
        "sourceUrl": "https://www.scullycompany.com/apartments/new-england/new-haven-county/new-haven/the-whit/",
        "sourceFile": "data/whit_parsed.md",
        "priceClassification": "verified_available",
        "rentMode": "base_rent",
        "includes": [
          "base rent"
        ],
        "unitCount": 18,
        "budgetBasis": {
          "unitType": "studio",
          "rent": 2306,
          "unit": "Studio / 591 sqft",
          "availableFrom": "Jun 28 2026",
          "leaseMonths": 11,
          "sqft": 591,
          "pricePerSqft": 3.9
        },
        "currentMinByType": {
          "studio": {
            "rent": 2306,
            "unit": "Studio / 591 sqft",
            "availableFrom": "Jun 28 2026",
            "leaseMonths": 11,
            "sqft": 591,
            "pricePerSqft": 3.9
          },
          "1br": {
            "rent": 2475,
            "unit": "1-Bedroom 1-Bathroom / 677 sqft",
            "availableFrom": "Aug 3 2026",
            "leaseMonths": 12,
            "sqft": 677,
            "pricePerSqft": 3.66
          },
          "2br": {
            "rent": 3400,
            "unit": "2-Bedroom 2-Bathroom / 1114 sqft",
            "availableFrom": "May 11 2026",
            "leaseMonths": 11,
            "sqft": 1114,
            "pricePerSqft": 3.05
          },
          "3br": {
            "rent": 5190,
            "unit": "3-Bedroom 3-Bath w/ Loft / 1396 sqft",
            "availableFrom": "Jul 14 2026",
            "leaseMonths": 11,
            "sqft": 1396,
            "pricePerSqft": 3.72
          }
        }
      }
    },
    "trueMonthlyCost": {
      "advertisedRent": 2400,
      "recurringFees": {
        "amount": 15,
        "confidence": "verified_public",
        "sourceUrl": "https://www.scullycompany.com/apartments/new-england/new-haven-county/new-haven/the-whit/",
        "sourceRef": "docs/phase_c_evidence/the-whit_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 128,
        "maxAmount": 213,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionEstimate": {
        "monthsFree": null,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 500,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "appFee": {
        "amount": 50,
        "confidence": "planning_assumption"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "campusScores": {
      "central_campus": 4,
      "med_school": 4,
      "som_prospect": 2,
      "seas_science": 2,
      "downtown_station": 4,
      "balanced": 4
    },
    "utilities": "variable",
    "setupTags": [
      "furniture_ready",
      "laundry",
      "private_space",
      "wood_floor"
    ],
    "amenityTags": [
      "package",
      "gym_pool",
      "parking"
    ],
    "dailyTags": [
      "building_access",
      "food_store",
      "late_route"
    ],
    "decisionSignals": {
      "openedYear": 2022,
      "openedYearConfidence": "public_news",
      "openedYearSource": "Public completion coverage checked 2026-07-01",
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": null,
        "breedRestrictions": true,
        "maxPets": null,
        "oneTimeFee": null,
        "petDeposit": 500,
        "monthlyRent": 60,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "quietScore": 58,
    "flooring": "Photos suggest wide plank flooring; verify exact unit",
    "furnishing": "Unfurnished base; CORT furnished solutions partner; 1BR rental is about $250/mo on a 12-mo lease",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "partial",
    "confidenceLabel": "Partial confidence",
    "dailyLabel": "Wooster restaurants + package/concierge",
    "sourceLabel": "Official availability snapshot checked 2026-07-11; fee sheet and manager details still incomplete",
    "valueSignal": "Current snapshot: studio starts at $2,306 / 591 sq ft ($3.90/sqft); 1BR starts at $2,475 / 677 sq ft ($3.66/sqft). The 11-month studio price should not represent the 1BR cost.",
    "bestFor": [
      "想在 Wooster Square / Chapel corridor，兼顾 Central Campus 和医学院的学生",
      "明确在意 in-unit washer/dryer、wide plank floor、package/concierge 和 gym/pool 的学生",
      "需要家具解决方案但可以接受 furniture rental，而非租金内 furnished 的学生"
    ],
    "tradeoffs": [
      "当前价格是 2026-07-11 的 availability snapshot，申请前仍要确认具体房源",
      "amenities 多，true monthly cost 可能被 utilities、parking、fees 拉高",
      "到 SOM / Science Hill 不一定是最顺的通勤"
    ],
    "verify": [
      "current rent and move-in availability",
      "CORT furniture cost and minimum rental term",
      "fee guide and utility billing",
      "late-night route and package/guest access process"
    ],
    "priceAvailabilityConfidence": "verified_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "hard_surface"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Wooster Square · 630 Chapel St",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "anthem-square10",
    "name": "The Anthem at Square 10",
    "area": "Downtown Crossing / Union Station side · South Orange / George",
    "price": {
      "min": 2200,
      "max": 3700,
      "label": "Stale news baseline: studio $1,900, 1BR $2,625, 2BR $3,300"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2200,
      "recurringFees": {
        "amount": 105.25,
        "confidence": "verified_public",
        "sourceUrl": "https://www.anthemsquare10.com/floorplans",
        "sourceRef": "docs/phase_c_evidence/anthem-square10_2026-07-12.md",
        "checkedDate": "2026-07-12"
      },
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 25,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 150,
        "confidence": "planning_assumption",
        "appliesWhenPriority": "parking"
      },
      "concessionEstimate": {
        "monthsFree": null,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 2265,
        "maxAmount": 3800,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "appFee": {
        "amount": 0,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "valueSignal": "Reviewed official snapshot: S1 Studio is $1,930.25 total / 373 sq ft ($5.18/sqft); A1 1BR is $2,790.25 / 718 sq ft ($3.89/sqft); B2 2BR is $3,440.25 / 1,064 sq ft ($3.23/sqft).",
    "campusScores": {
      "central_campus": 3,
      "med_school": 4,
      "som_prospect": 2,
      "seas_science": 2,
      "downtown_station": 5,
      "balanced": 3
    },
    "utilities": "unknown",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "gym_pool",
      "parking"
    ],
    "dailyTags": [
      "food_store",
      "late_route"
    ],
    "quietScore": 65,
    "flooring": "Photos suggest polished concrete in main living, carpet in bedrooms; verify exact unit",
    "furnishing": "Furnished and partially furnished units available",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "partial",
    "confidenceLabel": "Official price snapshot available; fees and policies remain partial",
    "dailyLabel": "Good station/Med orientation, services changing",
    "sourceLabel": "Official floorplans and availability checked 2026-07-12; policies remain partial",
    "bestFor": [
      "主要去医学院 / Union Station / Downtown 南侧，想关注新楼供给的学生",
      "愿意追踪新盘 concessions、affordable/market-rate mix 和后续 retail 变化的学生",
      "有 roommate、预算中高，想比较 downtown south side 与 Wooster/Downtown core 的学生"
    ],
    "tradeoffs": [
      "当前不是官方 live rent，不能直接作为申请依据",
      "local services 在变化，不能用旧开业新闻判断现在是否方便",
      "unit-level laundry、flooring、utilities、家具都还没核实"
    ],
    "verify": [
      "official leasing site and current floorplans",
      "current rent, concessions, affordable-unit eligibility if relevant",
      "utility package and move-in fees",
      "current grocery/restaurant status around Square 10"
    ],
    "priceAvailabilityConfidence": "partial_public",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "polished_concrete",
        "carpet"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": 50,
        "breedRestrictions": null,
        "maxPets": 2,
        "oneTimeFee": 350,
        "petDeposit": null,
        "monthlyRent": 50,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Downtown Crossing / Union Station side · South Orange / George",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": [],
    "priceAvailabilitySourceUrl": null,
    "priceAvailabilityCheckedDate": "2026-07-09"
  },
  {
    "id": "the-elm",
    "name": "The Elm",
    "area": "Central campus edge",
    "price": {
      "min": 2000,
      "max": 3000,
      "label": "$2,000+ seed estimate; source pending"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2000,
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 175,
        "maxAmount": 200,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionEstimate": {
        "monthsFree": null,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 2095,
        "maxAmount": 2100,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "appFee": {
        "amount": 50,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "campusScores": {
      "central_campus": 5,
      "med_school": 3,
      "som_prospect": 4,
      "seas_science": 4,
      "downtown_station": 4,
      "balanced": 5
    },
    "utilities": "mixed",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "package"
    ],
    "dailyTags": [
      "food_store",
      "late_route"
    ],
    "quietScore": 48,
    "flooring": "Photos suggest hardwood flooring; verify exact unit",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 3,
    "roommateFit": 2,
    "confidence": "low",
    "confidenceLabel": "Needs source refresh",
    "dailyLabel": "Campus-adjacent routine",
    "sourceLabel": "Seed profile only; official source pending; no Yale affiliation implied",
    "bestFor": [
      "Central Campus / Law / Humanities / Art / Music 附近活动很多，campus proximity 是第一优先级的学生",
      "可以接受 older-building trade-offs，用短 commute 换 daily routine 的学生",
      "想拿 campus-adjacent apartment 与 downtown high-rise 做对照的学生"
    ],
    "tradeoffs": [
      "当前价格、availability、fees、utilities 都没有完成官方刷新",
      "amenities 和 maintenance profile 可能明显弱于 newer buildings",
      "如果预算敏感，短 commute 不一定抵消 true cost"
    ],
    "verify": [
      "current official source and property manager",
      "rent, availability, fees, and included utilities",
      "laundry, flooring, heat/AC, and package process",
      "route to your exact Yale building"
    ],
    "priceAvailabilityConfidence": "low",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "hardwood"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": true,
        "allowedTypes": [
          "cat",
          "dog"
        ],
        "weightLimitLbs": null,
        "breedRestrictions": true,
        "maxPets": null,
        "oneTimeFee": 250,
        "petDeposit": null,
        "monthlyRent": 25,
        "monthlyRentRange": null,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Central campus edge",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "corsair",
    "name": "Corsair",
    "area": "East Rock / State Street corridor",
    "price": {
      "min": 2200,
      "max": 3300,
      "label": "$2,200+ seed estimate; source pending"
    },
    "trueMonthlyCost": {
      "advertisedRent": 2200,
      "utilitiesEstimate": {
        "amount": 180,
        "confidence": "planning_assumption"
      },
      "insuranceEstimate": {
        "amount": 15,
        "confidence": "planning_assumption"
      },
      "furnitureAmortized": {
        "amount": 250,
        "confidence": "planning_assumption",
        "appliesWhenSetup": "furniture_ready"
      },
      "parkingEstimate": {
        "amount": 117,
        "maxAmount": 186,
        "appliesWhenPriority": "parking",
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "concessionEstimate": {
        "monthsFree": null,
        "leaseMonths": 12,
        "monthlyCredit": null,
        "eligibleUnits": null,
        "moveInDeadline": null,
        "validThrough": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "moveInCash": {
      "firstMonth": {
        "multiplier": 1,
        "confidence": "advertised_rent"
      },
      "securityDeposit": {
        "amount": 500,
        "confidence": "verified_public",
        "sourceUrl": null,
        "sourceRef": "VERIFICATION_LOG.md#restored-fields",
        "checkedDate": "2026-07-13"
      },
      "appFee": {
        "amount": 50,
        "confidence": "planning_assumption"
      },
      "adminFee": {
        "confidence": "unknown"
      }
    },
    "campusScores": {
      "central_campus": 3,
      "med_school": 2,
      "som_prospect": 3,
      "seas_science": 4,
      "downtown_station": 3,
      "balanced": 4
    },
    "utilities": "variable",
    "setupTags": [
      "laundry",
      "private_space"
    ],
    "amenityTags": [
      "package",
      "gym_pool",
      "parking"
    ],
    "dailyTags": [
      "building_access",
      "quiet_routine"
    ],
    "quietScore": 74,
    "flooring": "Photos suggest light hardwood flooring; verify exact unit",
    "furnishing": "Furnished status not verified",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "low",
    "confidenceLabel": "Needs source refresh",
    "dailyLabel": "Quieter building routine; services need route check",
    "sourceLabel": "Seed profile only; New Haven official source pending",
    "bestFor": [
      "SEAS / Science Hill / East Rock routine 更多，想要 newer apartment feel 的学生",
      "愿意用稍远 downtown/Med commute 换 building quality、space 或 parking 的学生",
      "有预算空间，且希望 package、maintenance、parking options 更清楚的学生"
    ],
    "tradeoffs": [
      "官方 New Haven source 尚未锁定，暂时只能当 candidate",
      "到医学院 / Downtown 南侧的通勤需要按时间段核实",
      "flooring、utilities、concessions 不能按楼名假设"
    ],
    "verify": [
      "correct official New Haven leasing source",
      "commute to your exact Yale building",
      "parking, utility, amenity, and application fees",
      "nearby grocery/pharmacy/restaurant routine"
    ],
    "priceAvailabilityConfidence": "low",
    "feeConfidence": "partial_public",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "hardwood"
      ],
      "scope": "building",
      "evidenceType": "photo_inferred",
      "confidence": "verified_public",
      "sourceUrl": null,
      "sourceRef": "VERIFICATION_LOG.md#restored-fields",
      "checkedDate": "2026-07-13"
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "East Rock / State Street corridor",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "east-rock-landlord",
    "name": "East Rock independent landlord",
    "area": "Exploration direction · residential / roommate-friendly",
    "isExploration": true,
    "price": {
      "min": 850,
      "max": 1600,
      "label": "$850-$1,600 est. per person; exact unit required"
    },
    "campusScores": {
      "central_campus": 3,
      "med_school": 2,
      "som_prospect": 4,
      "seas_science": 5,
      "downtown_station": 2,
      "balanced": 4
    },
    "utilities": "mixed",
    "setupTags": [
      "wood_floor"
    ],
    "amenityTags": [
      "basic"
    ],
    "dailyTags": [
      "quiet_routine"
    ],
    "quietScore": 82,
    "flooring": "wood floors more common, verify unit",
    "furnishing": "Usually unfurnished unless listing says otherwise",
    "applicationFriction": 3,
    "roommateFit": 5,
    "confidence": "low",
    "confidenceLabel": "Low source confidence",
    "dailyLabel": "Quiet/residential; services vary by exact block",
    "sourceLabel": "Pattern-based exploration direction",
    "bestFor": [
      "预算敏感，愿意找 roommate 或接受 older housing 的学生",
      "主要去 Science Hill / SOM / Prospect Hill，想住 residential feel 的学生",
      "愿意自己核实 lease、utilities、maintenance 和冬天 heating cost 的学生"
    ],
    "tradeoffs": [
      "这是探索方向，不是具体 apartment 推荐",
      "package、laundry、maintenance、heat/water 体验差异可能很大",
      "不适合想要 front desk / amenities / 一站式申请流程的人"
    ],
    "verify": [
      "lease and fee sheet",
      "heating type and winter utility average",
      "maintenance response process",
      "roommate/sublet rules"
    ],
    "priceAvailabilityConfidence": "low",
    "feeConfidence": "low",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [
        "wood_look"
      ],
      "scope": null,
      "evidenceType": null,
      "sourceUrl": null,
      "checkedDate": null
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Exploration direction · residential / roommate-friendly",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  },
  {
    "id": "hamden-large",
    "name": "Hamden large apartment",
    "area": "Exploration direction · lower-rent commute trade-off",
    "isExploration": true,
    "price": {
      "min": 1400,
      "max": 2300,
      "label": "$1,400-$2,300 est.; exact building needed"
    },
    "campusScores": {
      "central_campus": 1,
      "med_school": 1,
      "som_prospect": 2,
      "seas_science": 2,
      "downtown_station": 1,
      "balanced": 2
    },
    "utilities": "variable",
    "setupTags": [
      "private_space"
    ],
    "amenityTags": [
      "parking",
      "basic"
    ],
    "dailyTags": [
      "quiet_routine",
      "building_access"
    ],
    "quietScore": 78,
    "flooring": "needs verification",
    "furnishing": "Usually unfurnished unless listing says otherwise",
    "applicationFriction": 4,
    "roommateFit": 3,
    "confidence": "low",
    "confidenceLabel": "Needs source refresh",
    "dailyLabel": "Car-friendly errands; no-car routine needs check",
    "sourceLabel": "Category-level exploration direction",
    "bestFor": [
      "预算有限，愿意用 commute 换 rent/space 的学生",
      "有车，或能稳定处理 bus / shuttle / rideshare 的学生",
      "不需要每天晚间频繁往返 campus 的学生"
    ],
    "tradeoffs": [
      "这是探索方向，不是具体 apartment 推荐",
      "对无车学生不一定友好，late-night commute 要谨慎核实",
      "不同 building 的 fees、utilities、application policy 差异很大"
    ],
    "verify": [
      "commute time by your real schedule",
      "parking fee and winter parking rules",
      "utility average",
      "restaurant/store access without a car"
    ],
    "priceAvailabilityConfidence": "low",
    "feeConfidence": "low",
    "applicationConfidence": "low",
    "flooringStatus": {
      "materials": [],
      "scope": "building",
      "evidenceType": null,
      "sourceUrl": null,
      "checkedDate": null
    },
    "decisionSignals": {
      "petPolicy": {
        "allowed": null,
        "allowedTypes": null,
        "weightLimitLbs": null,
        "petDeposit": null,
        "monthlyRentRange": null,
        "confidence": "unknown",
        "checkedDate": null
      }
    },
    "applicationPolicy": {
      "ssnRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "creditCheckRequired": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "guarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "internationalGuarantorAccepted": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "thirdPartyGuarantor": {
        "value": [],
        "confidence": "unknown",
        "sourceUrl": null
      },
      "remoteSigningAvailable": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      },
      "yaleAffiliateProgram": {
        "value": null,
        "confidence": "unknown",
        "sourceUrl": null
      }
    },
    "location": {
      "address": "Exploration direction · lower-rent commute trade-off",
      "lat": null,
      "lng": null,
      "walkMinutes": {
        "central_campus": null,
        "med_school": null,
        "som_prospect": null,
        "seas_science": null,
        "downtown_station": null
      },
      "walkSource": null,
      "walkCheckedDate": null
    },
    "floorplans": []
  }
];

const APARTMENT_TRANSLATIONS = {
  zh: {
    "360-state": {
      area: "市中心高层 · 360 State St",
      priceLabel: "展示 studio $2,055；当前可见 total 从 $2,372 起",
      valueSignal: "按当前快照：Studio APT 705 为 $2,372 total / 517 sq ft（$4.59/sqft）；1BR APT 1109 为 $2,385 total / 582 sq ft（$4.10/sqft）。应在相同租期和费用口径内比较。",
      flooring: "照片显示为硬木地板；具体房间可能不同",
      furnishing: "普通 lease 默认不带家具；可看 CORT 家具方案，1BR 约 $250/月（12个月 lease）",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Downtown 买菜吃饭方便，楼内服务完整",
      sourceLabel: "2026-07-11 查过 availability；完整 fee sheet 还要书面确认",
      bestFor: [
        "预算较高、主要活动在 Downtown 或 Central Campus，并想住服务型高层的学生",
        "看重房内洗衣、收包裹、维修、停车和楼下日常便利的学生",
        "不要求租金内自带家具，但愿意用家具租赁或自己购买家具解决入住准备的学生"
      ],
      tradeoffs: [
        "展示租金之外还要确认水电网、保险、押金、停车、配套费和管理费",
        "去医学院、SOM 和 Science Hill 的实际通勤感觉差很多，不能只看楼名",
        "家具不是默认包含，家具合作方只能降低准备成本"
      ],
      verify: [
        "书面费用表和水电网计费方式",
        "无美国信用记录学生的担保人或共同签署政策",
        "具体房源的地板和家具方案",
        "到你具体耶鲁楼宇的晚间路线"
      ]
    },
    "olive-wooster": {
      area: "Wooster Square / Downtown 边缘 · 87 Union St",
      priceLabel: "当前 studio $1,808-$2,170；1BR $1,864-$2,237（含 special 口径）",
      concession: "官网显示部分公寓最高免 3 个月租金，部分 1BR 有降价。",
      valueSignal: "按当前快照：整租 studio $1,808-$2,170 / 605 sq ft，1BR $1,864-$2,237 / 631 sq ft。低端价格可能含当前 special；co-living 要按人单独比较。",
      flooring: "照片显示为木纹地板；具体房间可能不同",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "医学院方向和 Wooster Square 餐饮方便",
      sourceLabel: "2026-07-11 查过 availability；低端价格可能含当前 special",
      bestFor: [
        "主要去医学院、YNHH 或公卫学院，并想住较新楼的学生",
        "看重房内洗衣、门禁、楼内配套和 Wooster / Downtown 生活服务的学生",
        "有室友或预算较高，并愿意核实优惠后再比较真实成本的学生"
      ],
      tradeoffs: [
        "官网页面没有稳定列出准确租金，需要刷新 availability 或直接问 leasing office",
        "是否带家具没有被验证，不能直接当作少折腾选项推荐",
        "去 SOM 或 Science Hill 不一定最顺，需要按课表或实验室路线计算"
      ],
      verify: [
        "具体房源租金和优惠条件",
        "水电网和网络账单实际包含哪些项目",
        "是否带家具或可租家具",
        "步行到你具体耶鲁楼宇的路线"
      ]
    },
    "the-taft": {
      area: "Downtown · 265 College St",
      priceLabel: "studio $1,865-$2,060；1BR $2,150-$2,440；2BR $2,950-$3,300",
      concession: "2026-08-01 或之前入住的 studio / 1BR lease 可免 2 个月租金。",
      valueSignal: "按审核过的官网快照：Studio 05O 为 $1,895 / 424 sq ft（$4.47/sqft）；1BR 05S 为 $1,999 / 697 sq ft（$2.87/sqft）。总价、租期和具体房源状态要一起比较。",
      flooring: "LVP 或硬木地板；具体房间可能不同",
      furnishing: "能看到 CORT / corporate furniture 选项；不是默认带家具，1BR 约 $250/月（12个月 lease）",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Central Campus 和 Med School 都方便",
      sourceLabel: "2026-06-29 查过 Paredim 和 RentCafe；fee sheet 仍不完整",
      bestFor: [
        "经常去 Central Campus 或 Downtown，希望缩短日常通勤的学生",
        "预算在 studio 或 1BR 主流区间，并能赶上 2026-08-01 前入住优惠的学生",
        "需要暖气和热水包含，并愿意核实电费、网络和家具方案的学生"
      ],
      tradeoffs: [
        "当前 2 个月免租只适用于 Studio / 1BR；具体房源和入住日期仍要确认",
        "已看到垃圾处理和配套费合计 $55/月；楼内没有住户停车位，隔壁有月租 parking，价格和空位仍需确认",
        "不是新玻璃楼类型，具体房源状态、洗衣和地板都要看房确认"
      ],
      verify: [
        "完整费用表以及免押金方案是否有条件",
        "电费、网络、洗衣、宠物和租客保险成本；如果有车，还要另查附近车库",
        "CORT 或企业家具选项是否适用于普通学生租约",
        "Yale community 申请需要的 bank statement 格式，以及远程申请流程"
      ]
    },
    "the-archive": {
      area: "Downtown / Ninth Square · Chapel / Orange",
      priceLabel: "studio $2,232 起；1BR $2,164 起；2BR $3,041 起；3BR $3,922 起，按总月价展示",
      concession: "官网显示 immediate move-in 最高免 2 个月，另有 Yale discount。",
      valueSignal: "按审核过的官网总月价：Sx1 Studio 从 $2,232 / 387 sq ft（$5.77/sqft）起；1x1 从 $2,464 / 503 sq ft（$4.90/sqft）起。",
      flooring: "照片显示为 LVT 地板；具体房间可能不同",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Ninth Square / Downtown 服务多，也有多人户型",
      sourceLabel: "2026-06-29 查过官网和 Entrata；总月价包含项目仍需确认",
      bestFor: [
        "还没确定独居还是合租，想在同一栋楼比较不同户型的学生",
        "已有室友，或想比较 2BR / 3BR 分摊成本的学生",
        "对优惠敏感，但愿意逐条确认租期和资格条件的学生"
      ],
      tradeoffs: [
        "部分 1BR / 2BR 的价格区间跨度很大，实际总价会随具体房源和 lease term 明显变化",
        "总月价口径更容易比较，但停车、宠物和保险等按需费用仍可能另算",
        "Archive I/II 或多地址口径还要确认，避免把不同楼混成同一体验"
      ],
      verify: [
        "总月租到底包含和排除哪些项目",
        "水电网、网络、停车、宠物、保险、申请费和管理费",
        "立即入住和 Yale discount 的准确优惠条件",
        "是否需要按楼栋或地址拆分资料"
      ]
    },
    "estelle": {
      area: "Downtown / New Haven Green 边缘 · 19 Elm St",
      priceLabel: "studio 需询价；1BR $2,795 起；2BR $3,870 起；3BR $4,725 起；4BR $5,795 起",
      concession: "官网显示 12 个月 lease 免 2 个月；具体房源资格需确认。",
      valueSignal: "按审核过的官网快照：1BR 总月价从 $2,835 起，2BR 从 $3,910 起。现有审核行没有可靠面积，因此不展示每平方英尺价格。",
      flooring: "照片显示为木纹地板；具体房间可能不同",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "新开 Downtown 楼，去 Central Campus 方便",
      sourceLabel: "2026-06-29 查过官网和 SecureCafe；开业状态和费用还要确认",
      bestFor: [
        "想要新楼体验，并主要在 Central Campus 或 Downtown 活动的学生",
        "能接受新开楼交付风险，但希望用开业优惠抵消部分成本的学生",
        "已有室友或预算较高，想比较 2BR、3BR、4BR 分摊的学生"
      ],
      tradeoffs: [
        "Studio 暂无公开价格，需向 leasing office 询价",
        "开业优惠很强，但优惠、价格、租期和空房可能每天变化",
        "费用表、水电网、停车、押金和保险还没有进入真实成本评分"
      ],
      verify: [
        "最终开业和入住准备状态，以及具体可租房源",
        "费用表、水电网计费、停车、押金、宠物、保险和网络",
        "具体房源是否符合 12 个月 lease 的优惠资格",
        "邮编差异和学生申请要求"
      ]
    },
    "axis-201": {
      area: "Science Park / Munson St · 201 Munson St",
      priceLabel: "当前 studio $1,852 起；1BR $2,445 起；2BR $3,084 起；3BR $4,425 起",
      concession: "官网显示符合条件的 lease 最高免 2 个月租金。",
      valueSignal: "按当前快照：studio 从 $1,852 / 345 sq ft（$5.37/sqft）起；1BR 从 $2,445 / 681 sq ft（$3.59/sqft）起。studio 的低价不能代表 1BR。",
      flooring: "需按具体房源确认",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "更适合 Science Park / Science Hill 通勤",
      sourceLabel: "2026-07-11 查过 availability；水电网和学生政策仍需确认",
      bestFor: [
        "主要去 SEAS、Science Hill、SOM 或 Prospect 走廊，想避开市中心核心区的学生",
        "想用较低 studio 起租价，或通过 2BR / townhome 分摊控制成本的学生",
        "日常更看重楼内秩序和安静感，而不是市中心夜生活的学生"
      ],
      tradeoffs: [
        "去医学院、Union Station 或 Downtown 办事不一定顺",
        "官网价格页列出 required fees $83.39/月；水电网和宠物/储物等额外费用仍需确认",
        "优惠只适用于部分房源，不能直接当作每月总成本"
      ],
      verify: [
        "水电网、停车、租客保险和宠物/储物费用",
        "租期和优惠资格",
        "到具体工程学院、管理学院或实验楼的路线，包括晚间方案",
        "学生担保人或共同签署要求"
      ]
    },
    "the-audubon": {
      area: "Audubon / Whitney-Church 走廊 · 367 Orange St",
      priceLabel: "studio $2,250 起；1BR $2,671 起；2BR $3,691 起；3BR $4,180 起，按估算月成本展示",
      concession: "官网首页显示部分房源最高免 1.5 个月租金。",
      flooring: "不同房间可能使用不同地板",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Arts、Central Campus 和 Whitney-Church 走廊都方便",
      sourceLabel: "2026-06-29 查过官网；estimated monthly cost 需要拆费用明细",
      bestFor: [
        "Central Campus、Arts 或 Whitney-Church 走廊活动多，想要通勤比较均衡的学生",
        "看重门禁、收包裹和停车 / garage 细节的学生",
        "预算较高，并愿意在申请前核实 estimated monthly cost 的学生"
      ],
      tradeoffs: [
        "页面使用估算月成本口径，但完整费用拆分还没有捕捉完",
        "学生社群出现过车库、邻居或门禁相关说法，只能作为路线和门禁核实触发点",
        "去医学院或市中心南侧的路线需要按真实作息看"
      ],
      verify: [
        "费用估算器里的明细和水电网计费",
        "车库、门禁、收包裹、照明和晚间路线流程",
        "优惠条款和部分房源资格",
        "学生担保人、共同签署和远程申请政策"
      ]
    },
    "new-haven-towers": {
      area: "Downtown York/Park/High 一带 · 4 栋楼",
      priceLabel: "Madison studio $1,695 起；Crown / Crown Court / 18 High 按楼不同",
      concession: "官网显示免 2 个月租金；需确认适用楼栋、房间和 lease。",
      flooring: "照片显示为硬木地板；4 栋楼和具体房间可能不同",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "离校园近，4 栋楼之间略有差异",
      sourceLabel: "2026-06-29 查过官方户型页；已整理到楼栋级价格",
      bestFor: [
        "Central Campus 或医学院附近活动多，想住老牌 Downtown 公寓的学生",
        "希望暖气和热水包含，让水电网更可预期的学生",
        "愿意按 Madison、Crown、Crown Court 和 18 High 分楼比较价格和位置的学生"
      ],
      tradeoffs: [
        "不能把四栋楼当成同一个体验；价格、位置和配套都要按楼栋看",
        "1.5 个月押金和申请费会增加入住前需准备的金额",
        "停车约 $90-$170/月，且具体楼栋空位需要确认"
      ],
      verify: [
        "你申请的是哪栋楼和哪个具体房源",
        "停车空位和价格、电费、租客保险、入住前需准备的金额",
        "各楼栋的洗衣、地板、收包裹和维修设置",
        "学生担保人或共同签署要求"
      ]
    },
    "pierpont-city-crossing": {
      area: "Downtown Crossing / 车站-医学院边缘",
      priceLabel: "Jr Studio $2,218 起；1BR $2,486 起；2BR $3,613 起",
      concession: "官网显示部分房间和 lease 免 1 个月租金；需确认资格。",
      flooring: "客厅为木纹 LVP、卧室为地毯；具体房间可能不同",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Union Station、医学院和 Downtown 南侧通勤",
      sourceLabel: "2026-07-12 查过 RMS 和官方 RentCafe 页面",
      bestFor: [
        "主要去医学院、Union Station 或 Downtown 南侧，想住 Pierpont 的学生",
        "想比较 Jr Studio、1BR 和 2BR，并愿意按具体房源确认价格和入住日期的学生"
      ],
      tradeoffs: [
        "位置在 Downtown 南侧；去 Central Campus、SOM 或 Science Hill 不如市中心核心区方便",
        "部分费用、水电网、parking 和标准 lease 政策仍需确认"
      ],
      verify: [
        "具体房源、价格和入住日期",
        "完整费用表、水电网、parking 和租客保险",
        "学生担保人、共同签署和远程签约政策"
      ]
    },
    "the-whit": {
      area: "Wooster Square · 630 Chapel St",
      priceLabel: "当前 studio $2,306 起；1BR $2,475 起；2BR $3,400 起",
      valueSignal: "按当前快照：studio 从 $2,306 / 591 sq ft（$3.90/sqft）起；1BR 从 $2,475 / 677 sq ft（$3.66/sqft）起。11个月 studio 价格不能代表 1BR。",
      flooring: "宽板硬质地板；具体房间可能不同",
      furnishing: "普通 lease 默认不带家具；可看 CORT 家具方案，1BR 约 $250/月（12个月 lease）",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Wooster Square 餐饮方便，也有收包裹 / concierge",
      sourceLabel: "2026-07-11 查过 availability；费用表和管理方信息仍不完整",
      bestFor: [
        "想住在 Wooster Square 或 Chapel 走廊，兼顾 Central Campus 和医学院的学生",
        "明确在意房内洗衣、宽木板地板、收包裹 / concierge 和健身房 / 泳池的学生",
        "需要家具解决方案但可以接受租家具，而不是租金内自带家具的学生"
      ],
      tradeoffs: [
        "官网没有稳定的租金表，价格要看最新 availability",
        "配套多，每月总成本可能被水电网、停车和各种费用拉高",
        "去 SOM 或 Science Hill 不一定是最顺通勤"
      ],
      verify: [
        "当前租金和入住时间",
        "CORT 家具成本和最短租期",
        "费用指南和水电网计费",
        "晚间路线和包裹/访客门禁流程"
      ]
    },
    "anthem-square10": {
      area: "Downtown Crossing / 联合车站一侧 · South Orange / George",
      priceLabel: "旧新闻基准：studio $1,900，1BR $2,625，2BR $3,300",
      valueSignal: "按审核过的官网快照：S1 Studio 为 $1,930.25 total / 373 sq ft（$5.18/sqft）；A1 1BR 为 $2,790.25 / 718 sq ft（$3.89/sqft）；B2 2BR 为 $3,440.25 / 1,064 sq ft（$3.23/sqft）。",
      flooring: "主起居区为抛光混凝土、卧室为地毯；具体房间可能不同",
      furnishing: "有带家具和部分带家具的房源；具体配置需确认",
      confidenceLabel: "已有官网价格快照；费用和政策仍不完整",
      dailyLabel: "Union Station / 医学院方向较好，周边服务还在变化",
      sourceLabel: "2026-07-12 查过官网户型和 availability；政策仍不完整",
      bestFor: [
        "主要去医学院、Union Station 或 Downtown 南侧，并想关注新楼供应的学生",
        "愿意追踪新楼优惠、市场价 / affordable units 和后续商业配套变化的学生",
        "已有室友、预算中高，想比较 Downtown 南侧、Wooster Square 和核心 Downtown 的学生"
      ],
      tradeoffs: [
        "当前不是官方实时租金，不能直接作为申请依据",
        "周边服务仍在变化，不能用旧开业新闻判断现在是否方便",
        "房内洗衣、地板、水电网和家具都还没有按房源核实"
      ],
      verify: [
        "官方租赁网站和当前户型",
        "当前租金、优惠、可负担房源资格（如适用）",
        "水电网组合和入住费用",
        "Square 10 周边目前的餐饮和买菜状态"
      ]
    }
  },
  en: {
    "360-state": {
      bestFor: [
        "Higher-budget students based around downtown or Central Campus who want a full-service high-rise.",
        "Students who value in-unit laundry, package handling, maintenance, parking, and daily convenience in or near the building.",
        "Students who do not need furniture included in rent, but can use furniture rental or buy furniture for setup."
      ],
      tradeoffs: [
        "Beyond advertised rent, confirm utilities, insurance, deposit, parking, amenity fees, and admin fees.",
        "The feel of the commute to Med School, SOM, and Science Hill can vary a lot; do not rely on the building name alone.",
        "Furniture is not included by default; the furniture partner only lowers setup friction."
      ],
      verify: [
        "Written fee sheet and utility billing method.",
        "Guarantor or co-signer policy for students without U.S. credit history.",
        "Flooring and furniture option for the exact unit.",
        "Late-night route to your exact Yale building."
      ]
    },
    "olive-wooster": {
      bestFor: [
        "Students mainly going to Med School, YNHH, or School of Public Health who want a newer-building profile.",
        "Students who value in-unit laundry, fob access, amenities, and Wooster/downtown local services.",
        "Students with roommates or a higher budget who are willing to verify concessions before comparing true cost."
      ],
      tradeoffs: [
        "The official availability page does not expose a stable rent table in static text; refresh it manually or ask leasing.",
        "Furnished status is not verified, so it should not be treated as a low-setup option yet.",
        "Commutes to SOM or Science Hill may not be ideal; check against your actual class or lab routine."
      ],
      verify: [
        "Exact unit rent and concession terms.",
        "What utilities and internet billing actually include.",
        "Whether furnished or furniture-rental options are available.",
        "Walking route to your exact Yale building."
      ]
    },
    "the-taft": {
      bestFor: [
        "Students with frequent Central Campus or downtown routines who want a shorter everyday commute.",
        "Students in the mainstream studio or 1BR budget range who can use the move-in concession before 2026-08-01.",
        "Students who need heat and hot water included, and are willing to verify electricity, internet, and furniture options."
      ],
      tradeoffs: [
        "The current two-month concession applies only to Studio and 1BR leases; confirm the exact unit and move-in deadline.",
        "Trash plus amenity charges are visible at $55/month. The Taft has no onsite resident parking, but monthly parking is available next door; confirm the rate and current space.",
        "This is not a new glass-tower profile; exact unit condition, laundry, and flooring need unit-level confirmation."
      ],
      verify: [
        "Full fee sheet and whether the skip-deposit offer has conditions.",
        "Electricity, internet, laundry, pet, and renter's insurance costs; nearby garage options if you have a car.",
        "Whether CORT or corporate furnished options work for ordinary student leases.",
        "Bank statement format for Yale community applicants and the remote application process."
      ]
    },
    "the-archive": {
      bestFor: [
        "Students still deciding between living alone and sharing, and comparing different layouts in one property.",
        "Students with roommates or those comparing 2BR/3BR split cost.",
        "Students who care about concessions and are willing to verify lease length and eligibility terms one by one."
      ],
      tradeoffs: [
        "Some 1BR and 2BR price ranges are wide; the actual total can change materially by unit and lease term.",
        "The total-monthly-price format is easier to compare, but optional parking, pet, and insurance costs may still be separate.",
        "Archive I/II or multi-address wording still needs confirmation so different buildings are not collapsed into one experience."
      ],
      verify: [
        "What the total monthly leasing price includes and excludes.",
        "Utilities, internet, parking, pet fees, insurance, application fees, and admin fees.",
        "Exact concession terms for immediate move-ins and Yale discounts.",
        "Whether the profile should be split by building or address."
      ]
    },
    "estelle": {
      bestFor: [
        "Students who want a newest-building feel and are mainly around Central Campus or downtown.",
        "Students who can tolerate new-building execution risk but want an opening concession to offset part of the cost.",
        "Students with roommates or a higher budget who want to compare 2BR, 3BR, and 4BR split options."
      ],
      tradeoffs: [
        "Studio pricing is not publicly listed; ask the leasing office for a current quote.",
        "Opening concessions are strong, but specials, pricing, lease terms, and availability may change daily.",
        "Fee sheet, utilities, parking, deposit, and insurance are not yet part of true-cost scoring."
      ],
      verify: [
        "Final opening and move-in readiness, plus the exact available unit.",
        "Fee sheet, utility billing, parking, deposit, pet, insurance, and internet.",
        "Whether the exact unit qualifies for the 12-month concession.",
        "Postal code discrepancy and student application requirements."
      ]
    },
    "axis-201": {
      bestFor: [
        "Students mainly going to SEAS, Science Hill, SOM, or the Prospect corridor who want to avoid the downtown core.",
        "Students trying to control cost through a lower studio starting rent or roommate/townhome layouts.",
        "Students who care more about building routine and quiet than downtown nightlife."
      ],
      tradeoffs: [
        "The routine to Med School, Union Station, or downtown errands may not be smooth.",
        "The official price page lists $83.39/month in required fees; utilities and other pet/storage costs still need confirmation.",
        "The published special is included in the estimate; use the pre-concession amount if the exact home is not eligible."
      ],
      verify: [
        "Utility billing, parking, renter's insurance, and pet/storage fees.",
        "Lease term and concession eligibility.",
        "Route to your exact SEAS, SOM, or lab building, including late-night plan.",
        "Bank statement format for Yale community applicants."
      ]
    },
    "the-audubon": {
      bestFor: [
        "Students with frequent Central Campus, Arts, or Whitney-Church corridor routines who want balanced campus access.",
        "Students who value building access, package handling, and parking/garage verification.",
        "Higher-budget students who will verify the estimated monthly cost before applying."
      ],
      tradeoffs: [
        "The page uses estimated monthly cost, but the full fee breakdown has not been fully captured.",
        "Student community mentions around garage, neighbor, or access concerns should be used only as route and access verification triggers.",
        "Routes to Med School or the south side of downtown need to be checked against your actual schedule."
      ],
      verify: [
        "Cost-estimator fee breakdown and utility billing.",
        "Garage, access, package, lighting, and late-night route process.",
        "Concession terms and selected-home eligibility.",
        "Student guarantor/co-signer and remote application policy."
      ]
    },
    "new-haven-towers": {
      bestFor: [
        "Students with frequent Central Campus, Law, Art, or Med routines who want an established downtown cluster.",
        "Students who want heat and hot water included so utilities are more predictable.",
        "Students willing to compare Madison, Crown, Crown Court, and 18 High separately by price and location."
      ],
      tradeoffs: [
        "The four buildings should not be treated as one experience; price, location, and amenities are tower-specific.",
        "A 1.5-month security deposit plus application fee affects move-in cash.",
        "Parking is about $90-$170/month, and exact building availability needs confirmation."
      ],
      verify: [
        "Which tower and exact unit you are applying for.",
        "Parking availability and cost, electricity, renter's insurance, and move-in cash.",
        "Laundry, flooring, package, and maintenance setup by building.",
        "Student guarantor/co-signer requirements."
      ]
    },
    "pierpont-city-crossing": {
      bestFor: [
        "Students mainly going to Med School, Union Station, or the south side of downtown who want to live at Pierpont.",
        "Students comparing Jr Studio, 1BR, and 2BR options who will confirm the exact unit, price, and move-in date."
      ],
      tradeoffs: [
        "This is on the south side of downtown; Central Campus, SOM, and Science Hill are less convenient than from the downtown core.",
        "Some fees, utilities, parking, and standard lease policies still need confirmation."
      ],
      verify: [
        "The exact unit, price, and move-in date.",
        "The full fee sheet, utilities, parking, and renter's insurance.",
        "Student guarantor/co-signer and remote signing policy."
      ]
    },
    "the-whit": {
      bestFor: [
        "Students who want Wooster Square or the Chapel corridor while balancing Central Campus and Med School.",
        "Students who explicitly care about in-unit washer/dryer, wide plank flooring, package/concierge, and gym/pool.",
        "Students who need a furniture solution but can accept furniture rental rather than furniture included in rent."
      ],
      tradeoffs: [
        "The current page does not provide a stable static rent table, so pricing needs an availability refresh.",
        "Amenities are strong, but true monthly cost may rise through utilities, parking, and fees.",
        "Commute to SOM or Science Hill may not be the smoothest."
      ],
      verify: [
        "Current rent and move-in availability.",
        "CORT furniture cost and minimum rental term.",
        "Fee guide and utility billing.",
        "Late-night route and package/guest access process."
      ]
    },
    "anthem-square10": {
      bestFor: [
        "Students mainly going to Med School, Union Station, or the south side of downtown who want to track new-building supply.",
        "Students willing to track new-property concessions, affordable/market-rate mix, and later retail changes.",
        "Students with roommates and a mid-to-high budget who want to compare downtown south side with Wooster or the downtown core."
      ],
      tradeoffs: [
        "Current data is not official live rent, so it cannot be used directly for applications.",
        "Local services are changing, so old opening news should not be used to judge current convenience.",
        "Unit-level laundry, flooring, utilities, and furniture are not yet verified."
      ],
      verify: [
        "Official leasing site and current floorplans.",
        "Current rent, concessions, and affordable-unit eligibility if relevant.",
        "Utility package and move-in fees.",
        "Current grocery and restaurant status around Square 10."
      ]
    }
  }
};

// Draft fallback weights, not validated. Specific campus choices are ordered by
// campus tier before this weighted score; balanced access still uses the full mix.
const WEIGHTS = {
  budget: 1.25,
  campus: 1.5,
  utilities: 1,
  setup: 0.95,
  priority: 1.35
};

const QUIET_PRIORITY_WEIGHTS = {
  budget: 1.2,
  campus: 1.4,
  utilities: 0.9,
  setup: 0.75,
  priority: 2
};

function activeLang() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function ui(key, lang = activeLang()) {
  return UI_TEXT[lang][key] ?? UI_TEXT.en[key] ?? key;
}

function campusLabel(value, lang = activeLang()) {
  return (lang === "zh" ? CAMPUS_LABELS_ZH : CAMPUS_LABELS)[value] || value || ui("notSpecified", lang);
}

function categoryLabel(key, lang = activeLang()) {
  return (CATEGORY_LABELS_BY_LANG[lang] || CATEGORY_LABELS_BY_LANG.en)[key] || key;
}

function priorityReasonLabel(key, lang = activeLang()) {
  const labels = PRIORITY_REASON_LABELS[lang] || PRIORITY_REASON_LABELS.en;
  return labels[key] || categoryLabel("priority", lang);
}

function answerValueLabel(group, value, lang = activeLang()) {
  const labels = (ANSWER_VALUE_LABELS[lang] || ANSWER_VALUE_LABELS.en)[group] || {};
  return labels[value] || value || ui("notSpecified", lang);
}

function utilityLabel(value, lang = activeLang()) {
  const labels = {
    en: {
      predictable: "Key utilities are included, so monthly costs are more predictable",
      mixed: "Some utilities are included; others are billed separately",
      variable: "Most utilities are billed separately, so monthly costs can vary",
      unknown: "What is included still needs confirmation"
    },
    zh: {
      predictable: "主要水电项目已包含，每月支出更容易预估",
      mixed: "部分水电项目已包含，其余项目另付",
      variable: "多数水电项目另付，每月金额会浮动",
      unknown: "包含哪些水电项目仍需确认"
    }
  };
  return (labels[lang] || labels.en)[value] || value;
}

function utilityProfile(apartment) {
  return UTILITY_PROFILES[apartment?.id] || {
    included: [],
    tenantPays: ["electricity", "internet"],
    verify: ["heating_cooling", "water_sewer"]
  };
}

function internetIncluded(apartment) {
  const included = [
    ...(utilityProfile(apartment).included || []),
    ...(apartment?.decisionSignals?.utilitiesIncluded || [])
  ];
  return included.some(item => item === "internet" || item === "high_speed_internet");
}

function utilityCostItems(apartment) {
  const items = [{
    key: "electricityEstimate",
    amount: DEFAULT_COST_ASSUMPTIONS.electricityMonthly,
    maxAmount: DEFAULT_COST_ASSUMPTIONS.electricityMonthly,
    confidence: "planning_assumption"
  }];
  if (!internetIncluded(apartment)) {
    items.push({
      key: "internetEstimate",
      amount: DEFAULT_COST_ASSUMPTIONS.internetMonthly,
      maxAmount: DEFAULT_COST_ASSUMPTIONS.internetMonthly,
      confidence: "planning_assumption"
    });
  }
  return items;
}

function utilityItemLabel(key, lang = activeLang()) {
  return (UTILITY_ITEM_LABELS[lang] || UTILITY_ITEM_LABELS.en)[key] || key;
}

function renderUtilityDetails(apartment, lang = activeLang()) {
  const profile = utilityProfile(apartment);
  const text = UTILITY_DETAIL_TEXT[lang] || UTILITY_DETAIL_TEXT.en;
  const rows = [
    ...(profile.included || []).map(item => ({ item, status: "included" })),
    ...(profile.tenantPays || []).map(item => ({ item, status: "tenantPays" })),
    ...(profile.verify || []).map(item => ({ item, status: "verify" }))
  ];
  const note = profile.note ? text[profile.note] : "";
  const costAssumption = lang === "zh"
    ? (internetIncluded(apartment) ? "月成本按电费 $50 估算；网络已包含。" : "月成本按电费 $50 + 网络 $40 估算。")
    : (internetIncluded(apartment) ? "Monthly cost assumes $50 for electricity; internet is included." : "Monthly cost assumes $50 for electricity plus $40 for internet.");
  const statusLabel = row => {
    if (row.item === "air_conditioning_most_units" && row.status === "included") {
      return lang === "zh" ? "（多数房间）已包含" : "Included (most units)";
    }
    return text[row.status];
  };
  return `
    <div class="utility-details">
      ${rows.map(row => `
        <div>
          <b>${escapeHtml(utilityItemLabel(row.item, lang))}</b>
          <span class="utility-status ${escapeHtml(row.status)}">${escapeHtml(statusLabel(row))}</span>
        </div>
      `).join("")}
      ${note ? `<small>${escapeHtml(note)}</small>` : ""}
      <small>${escapeHtml(costAssumption)}</small>
    </div>
  `;
}

const CARD_FOOTNOTE_TEXT = {
  en: {
    flooring: "Flooring can vary by unit; confirm the exact unit.",
    concessionIncluded: "The public offer is prorated into estimated monthly cost and budget fit. If the exact unit or lease is ineligible, use the pre-concession amount.",
    concessionExcluded: "The offer cannot be converted into a monthly credit from the details currently available."
  },
  zh: {
    flooring: "地板可能因房源而不同，需按具体房源确认。",
    concessionIncluded: "公开优惠已折算进估算月成本和预算匹配；若具体房源或租期不符合资格，请看优惠前金额。",
    concessionExcluded: "目前的优惠信息不足以折算成每月金额。"
  }
};

function sentenceEnding(value, lang) {
  const text = String(value || "").trim();
  if (!text || /[.!?。！？]$/.test(text)) return text;
  return `${text}${lang === "zh" ? "。" : "."}`;
}

function normalizeSourceNote(value, lang) {
  let note = String(value || "").trim();
  if (lang === "zh") {
    note = note
      .replace(/^完整 fee sheet 还要书面确认$/i, "完整费用表仍需书面确认")
      .replace(/^fee sheet 仍不完整$/i, "完整费用表仍需补齐");
  }
  return sentenceEnding(note, lang);
}

function splitCardDisplay(value, kind, lang = activeLang()) {
  const text = String(value || "").trim();
  if (kind === "flooring") {
    const match = text.match(/^(.*?)[;；]\s*(?:verify exact unit|具体房源需确认|需按楼栋和具体房源确认)$/i);
    if (match?.[1]?.trim()) {
      return {
        text: match[1].trim(),
        note: (CARD_FOOTNOTE_TEXT[lang] || CARD_FOOTNOTE_TEXT.en).flooring
      };
    }
  }
  if (kind === "source") {
    const parts = text.split(/\s*[;；]\s*/).filter(Boolean);
    if (parts.length > 1) {
      const noteText = parts.slice(1).join(lang === "zh" ? "；" : "; ");
      const isVerificationNote = /need|pending|incomplete|not visible|confirm|stale|未|需|待确认|不完整|没有稳定|还要|尚/i.test(noteText);
      if (!isVerificationNote) return { text, note: "" };
      return {
        text: parts.shift(),
        note: normalizeSourceNote(noteText, lang)
      };
    }
  }
  if (kind === "concession") {
    return {
      text: text.replace(/[;；]\s*not counted in budget score\.?$/i, "").trim(),
      note: ""
    };
  }
  return { text, note: "" };
}

function addCardFootnote(footnotes, note) {
  if (!note) return "";
  let index = footnotes.indexOf(note);
  if (index === -1) {
    footnotes.push(note);
    index = footnotes.length - 1;
  }
  return `<sup class="footnote-marker">${index + 1}</sup>`;
}

function renderCardFootnotes(footnotes) {
  if (!footnotes.length) return "";
  return `
    <ol class="card-footnotes">
      ${footnotes.map((note, index) => `<li><sup>${index + 1}</sup><span>${escapeHtml(note)}</span></li>`).join("")}
    </ol>
  `;
}

function apartmentCopy(apartment, lang = activeLang()) {
  const translation = APARTMENT_TRANSLATIONS[lang]?.[apartment.id] || {};
  return {
    area: translation.area || apartment.area,
    priceLabel: translation.priceLabel || apartment.price.label,
    concession: translation.concession || apartment.concession || "",
    valueSignal: translation.valueSignal || apartment.valueSignal || "",
    flooring: translation.flooring || apartment.flooring,
    furnishing: translation.furnishing || apartment.furnishing,
    confidenceLabel: translation.confidenceLabel || apartment.confidenceLabel,
    dailyLabel: translation.dailyLabel || apartment.dailyLabel,
    sourceLabel: translation.sourceLabel || apartment.sourceLabel,
    bestFor: translation.bestFor || apartment.bestFor,
    tradeoffs: translation.tradeoffs || apartment.tradeoffs,
    verify: translation.verify || apartment.verify
  };
}

function getSelectedValues(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function normalizeQuestionnaireAnswers({ budget, unitType, campus, requirements = [], preferences = [], petType = null }) {
  const setup = requirements.filter(value => ["wood_floor", "laundry", "private_space", "furniture_ready"].includes(value));
  const requirementPriorities = requirements.filter(value => HARD_REQUIREMENT_PRIORITIES.has(value));
  const wantsPredictableUtilities = preferences.includes("utilities_predictable");
  return {
    budget: budget === null ? null : Number(budget),
    unitType: unitType || null,
    campus,
    // This checkbox feeds the dedicated utilities dimension and is removed
    // from priority below so the same preference is never scored twice.
    utilities: wantsPredictableUtilities ? "predictable" : null,
    requirements,
    preferences,
    setup,
    priority: [...preferences.filter(value => value !== "utilities_predictable"), ...requirementPriorities],
    petType
  };
}

function getFormValues(form) {
  const data = new FormData(form);
  return normalizeQuestionnaireAnswers({
    budget: data.get("budget"),
    unitType: data.get("unit_type"),
    campus: data.get("campus"),
    requirements: getSelectedValues(form, "requirement"),
    preferences: getSelectedValues(form, "preference"),
    petType: data.get("pet_type") || null
  });
}

function budgetOptionDisplay(option, lang) {
  return option.label;
}

function renderBudgetOptions(form, { preserve = true, preferredValue = null, clearSelection = false } = {}) {
  const container = form.querySelector("#budget-options");
  if (!container) return;
  const lang = activeLang();
  const unitType = form.querySelector('input[name="unit_type"]:checked')?.value || null;
  const note = form.querySelector("#budget-range-note");
  if (!unitType) {
    container.innerHTML = "";
    if (note) note.textContent = lang === "zh" ? "请先选择户型。" : "Choose a unit type first.";
    return;
  }
  const currentInput = preserve ? form.querySelector('input[name="budget"]:checked') : null;
  const currentValue = clearSelection
    ? null
    : currentInput
      ? Number(currentInput.value)
      : Number.isFinite(Number(preferredValue)) && preferredValue !== null
        ? Number(preferredValue)
        : null;
  const options = budgetOptionsFor(unitType);
  const selectedValue = options.some(option => option.value === currentValue) ? currentValue : null;
  container.innerHTML = options.map(option => `
    <label><input type="radio" name="budget" value="${option.value}" required${option.value === selectedValue ? " checked" : ""}><span>${escapeHtml(budgetOptionDisplay(option, lang))}</span></label>
  `).join("");

  if (!note) return;
  const notes = [lang === "zh" ? "$1,600 以下将在后续版本覆盖。" : "Budgets below $1,600 will be covered in a future version."];
  if (clearSelection || selectedValue === null) {
    notes.unshift(lang === "zh" ? "户型已切换，请重新选择预算区间。" : "Unit type changed; choose a new budget band.");
  } else if (options.find(option => option.value === selectedValue)?.openEnded) {
    notes.unshift(lang === "zh" ? "最高档不设隐藏上限，预算不会鼓励把钱花满。" : "The top band has no hidden ceiling; budget fit does not reward spending more.");
  }
  if (unitType === "not_sure") {
    notes.push(lang === "zh"
      ? "不确定户型时按 1BR 做保守预算比较，不会自动换成更便宜的 Studio。"
      : "Not sure uses a conservative 1BR budget basis and never substitutes a cheaper Studio.");
  }
  note.textContent = notes.join(" ");
}

function formatMoney(value) {
  const rounded = Math.round(Number(value) || 0);
  return `$${rounded.toLocaleString()}`;
}

function formatMoneyRange(min, max) {
  const roundedMin = Math.round(Number(min) || 0);
  const roundedMax = Math.round(Number(max) || roundedMin);
  if (roundedMin === roundedMax) return formatMoney(roundedMin);
  return `${formatMoney(roundedMin)}-${formatMoney(roundedMax)}`;
}

const UNIT_TYPE_LABELS = {
  en: { studio: "Studio", "1br": "1BR", "2br": "2BR", "3br": "3BR", "4br": "4BR", not_sure: "Not sure (1BR basis)", co_living: "Co-living" },
  zh: { studio: "Studio", "1br": "1BR", "2br": "2BR", "3br": "3BR", "4br": "4BR", not_sure: "不确定（按 1BR）", co_living: "Co-living" }
};

function unitTypeLabel(unitType = "studio", lang = activeLang()) {
  return (UNIT_TYPE_LABELS[lang] || UNIT_TYPE_LABELS.en)[unitType] || unitType;
}

function availabilityRows(apartment) {
  const rows = apartment.price?.availability?.currentMinByType;
  if (!rows || typeof rows !== "object") return [];
  return Object.entries(rows).map(([unitType, row]) => ({ unitType, ...row }));
}

function currentRentBasis(apartment) {
  const availability = apartment.price?.availability;
  const basis = availability?.budgetBasis;
  if (!basis || !Number.isFinite(basis.rent)) return null;
  return {
    rent: basis.rent,
    rentMax: Number.isFinite(basis.rentMax) ? basis.rentMax : basis.rent,
    unitType: basis.unitType,
    includesRequiredFees: availability.rentMode === "total_including_required_fees"
  };
}

function priceStatus(apartment, lang = activeLang(), answers = null) {
  if (answers) {
    const selection = selectBudgetCandidate(apartment, answers, { respectFeatures: true });
    const candidate = selection.candidate;
    if (!candidate && selection.compatibility === "incompatible") {
      return { level: "warn", label: lang === "zh" ? "没有符合硬性要求的房源" : "No unit meets the selected requirement" };
    }
    if (candidate && selection.compatibility === "unknown_feature_compatibility") {
      return { level: "warn", label: lang === "zh" ? "价格已核对 · 配置待核实" : "Price checked · features to confirm" };
    }
    if (candidate?.comparisonStatus === "not_applicable") {
      return { level: "warn", label: lang === "zh" ? "所选户型当前 N/A" : "Selected unit type is N/A" };
    }
    if (candidate?.budgetEligible) {
      const policyEstimate = ["official_range_midpoint", "official_range_lower_bound_as_12_month"].includes(candidate.comparisonPolicy);
      return policyEstimate
        ? { level: "warn", label: lang === "zh" ? "官网区间比较口径" : "Official-range comparison basis" }
        : { level: "good", label: lang === "zh" ? "所选户型价格已核对" : "Selected unit price checked" };
    }
  }
  const classification = apartment.price?.availability?.priceClassification;
  if (classification === "advertised_gap") {
    return { level: "warn", label: lang === "zh" ? "广告起价低于当前可租价" : "Advertised floor is below current availability" };
  }
  if (classification === "range_including_current_special") {
    return { level: "warn", label: lang === "zh" ? "当前价格含 special 口径" : "Current range includes a special" };
  }
  if (classification === "verified_available") {
    return { level: "good", label: lang === "zh" ? "当前 availability 已核对" : "Current availability checked" };
  }
  return { level: "warn", label: ui("tags", lang).rent };
}

function priceSignalText(apartment, lang = activeLang(), answers = null) {
  if (answers) {
    const selection = selectBudgetCandidate(apartment, answers, { respectFeatures: true });
    const candidate = selection.candidate;
    const label = unitTypeLabel(selection.unitType.resolved, lang);
    if (!candidate && selection.compatibility === "incompatible") {
      return lang === "zh"
        ? `${label} 暂无符合所选硬性要求的房源价格`
        : `No ${label} price currently meets the selected requirement`;
    }
    if (candidate?.comparisonStatus === "not_applicable") {
      return lang === "zh" ? `${label} 当前 N/A` : `${label} is currently N/A`;
    }
    if (candidate?.budgetEligible && Number.isFinite(candidate.standardLeasePrice)) {
      const policy = candidate.comparisonPolicy === "official_range_midpoint"
        ? (lang === "zh" ? "官网区间中位数" : "official range midpoint")
        : candidate.comparisonPolicy === "official_range_lower_bound_as_12_month"
          ? (lang === "zh" ? "官网区间下限" : "official range lower bound")
          : (lang === "zh" ? "官网标准租期" : "official standard term");
      return `${label} ${formatMoney(candidate.standardLeasePrice)} / ${lang === "zh" ? "月" : "mo"} · ${policy}`;
    }
  }
  const availability = apartment.price?.availability;
  if (!availability) return apartment.price?.label || "";
  const labels = UNIT_TYPE_LABELS[lang] || UNIT_TYPE_LABELS.en;
  const rows = availabilityRows(apartment).filter(row => !row.perPerson);
  const firstRows = rows.slice(0, 2).map(row => {
    const rent = formatMoneyRange(row.rent, row.rentMax);
    return `${labels[row.unitType] || row.unitType} ${rent}`;
  });
  if (availability.priceClassification === "advertised_gap") {
    const basis = availability.budgetBasis;
    return lang === "zh"
      ? `展示 ${formatMoney(availability.advertisedByType?.studio || apartment.price.min)}；当前 ${labels[basis.unitType]} ${formatMoney(basis.rent)} 起`
      : `Advertised ${formatMoney(availability.advertisedByType?.studio || apartment.price.min)}; current ${labels[basis.unitType]} from ${formatMoney(basis.rent)}`;
  }
  return `${lang === "zh" ? "当前可见" : "Current"}: ${firstRows.join(lang === "zh" ? "；" : "; ")}`;
}

function quickPriceSignalRows(apartment, lang = activeLang()) {
  const snapshot = AVAILABILITY_PRICE_SNAPSHOT[apartment.id];
  if (!snapshot) return [];
  return ["studio", "1br", "2br"].map(unitType => {
    const candidate = selectBudgetCandidate(apartment, unitType).candidate;
    if (!candidate) return null;
    const label = unitTypeLabel(unitType, lang);
    if (candidate.comparisonStatus === "not_applicable") return { label, value: "N/A" };
    if (!candidate.budgetEligible || !Number.isFinite(candidate.standardLeasePrice)) return null;
    return { label, value: formatMoney(candidate.standardLeasePrice) };
  }).filter(Boolean);
}

function renderPriceSignal(apartment, lang = activeLang(), answers = null) {
  if (answers) return `<span>${escapeHtml(priceSignalText(apartment, lang, answers))}</span>`;
  const rows = quickPriceSignalRows(apartment, lang);
  if (!rows.length) return `<span>${escapeHtml(priceSignalText(apartment, lang, answers))}</span>`;
  return `
    <div class="price-signal-list">
      ${rows.map(row => `<span><b>${escapeHtml(row.label)}</b>${escapeHtml(row.value)}</span>`).join("")}
    </div>
  `;
}

function renderPriceAvailability(apartment, lang = activeLang()) {
  const availability = apartment.price?.availability;
  if (!availability) return "";
  const labels = UNIT_TYPE_LABELS[lang] || UNIT_TYPE_LABELS.en;
  const rows = availabilityRows(apartment);
  const rowMarkup = rows.map(row => {
    const rent = formatMoneyRange(row.rent, row.rentMax);
    const lease = row.leaseMonths ? ` · ${row.leaseMonths}${lang === "zh" ? "个月" : "mo"}` : "";
    const perPerson = row.perPerson ? (lang === "zh" ? " / 人" : " / person") : "";
    const sqft = Number.isFinite(row.sqft) ? ` · ${row.sqft} sqft` : "";
    const psf = Number.isFinite(row.pricePerSqft) ? ` · $${row.pricePerSqft}/sqft` : "";
    return `<li><span>${escapeHtml(labels[row.unitType] || row.unitType)}${escapeHtml(perPerson)}</span><strong>${escapeHtml(rent)}</strong><em>${escapeHtml(row.unit || "")}${escapeHtml(lease)}${escapeHtml(sqft)}${escapeHtml(psf)}</em></li>`;
  }).join("");
  const note = availability.priceClassification === "advertised_gap"
    ? (lang === "zh" ? "展示租金与当前可租总价不是同一口径；360 的 total 已含强制月费。" : "The advertised floor and current available total use different bases; 360's total includes required monthly fees.")
    : availability.priceClassification === "range_including_current_special"
      ? (lang === "zh" ? "低端价格可能含当前 special；co-living 为按人价格，不能和整租户型直接比较。" : "The low end may include a current special; co-living is per-person and is not directly comparable to private units.")
      : (lang === "zh" ? "这是截至快照日期看到的最低房源，不代表申请时仍然可用。" : "These are the lowest visible units in the snapshot, not a guarantee at application time.");
  return `
    <div class="price-availability">
      <div class="price-availability-title">${escapeHtml(lang === "zh" ? "当前房源价格口径" : "Current availability price check")}</div>
      <ul>${rowMarkup}</ul>
      <p>${escapeHtml(note)} ${escapeHtml(lang === "zh" ? `核对日期：${availability.checkedDate}` : `Checked ${availability.checkedDate}`)}</p>
    </div>
  `;
}

function costText(key, lang = activeLang()) {
  return (COST_TEXT[lang] || COST_TEXT.en)[key];
}

function costItemLabel(key, lang = activeLang()) {
  return (COST_ITEM_LABELS[lang] || COST_ITEM_LABELS.en)[key] || key;
}

function costConfidenceLabel(confidence, lang = activeLang()) {
  const labels = COST_CONFIDENCE_LABELS[lang] || COST_CONFIDENCE_LABELS.en;
  return labels[confidence] || labels.planning_assumption;
}

function costItemAmount(item, baseRent, fallbackAmount = 0) {
  if (!item) return fallbackAmount;
  if (Number.isFinite(item.amount)) return item.amount;
  if (Number.isFinite(item.multiplier)) return baseRent * item.multiplier;
  return fallbackAmount;
}

function costItemMaxAmount(item, baseRent, fallbackAmount = null) {
  if (!item) return fallbackAmount;
  if (Number.isFinite(item.maxAmount)) return item.maxAmount;
  if (Number.isFinite(item.maxMultiplier)) return baseRent * item.maxMultiplier;
  return fallbackAmount;
}

function appliesToAnswers(item, answers) {
  if (!item) return false;
  if (item.appliesWhenSetup && !(answers?.setup || []).includes(item.appliesWhenSetup)) return false;
  if (item.appliesWhenPriority && !(answers?.priority || []).includes(item.appliesWhenPriority)) return false;
  return true;
}

function monthlyCostLine(key, item, baseRent, answers, fallbackAmount = 0) {
  if (item === null) return null;
  if (!item) {
    return {
      key,
      amount: fallbackAmount,
      confidence: "planning_assumption"
    };
  }
  if ((item.appliesWhenSetup || item.appliesWhenPriority) && !appliesToAnswers(item, answers)) return null;
  const amount = costItemAmount(item, baseRent, fallbackAmount);
  const maxAmount = costItemMaxAmount(item, baseRent, amount);
  if (!amount && item.confidence === "unknown") return null;
  return {
    key,
    amount,
    maxAmount,
    confidence: item.confidence || "planning_assumption"
  };
}

function dateAtEndOfDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const date = new Date(`${value}T23:59:59.999Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function concessionIsCurrent(item, asOf = new Date()) {
  if (!item || Number.isNaN(asOf.getTime())) return false;
  const explicitExpiry = dateAtEndOfDay(item.validThrough || item.moveInDeadline);
  if (explicitExpiry) return asOf <= explicitExpiry;
  const checkedDate = dateAtEndOfDay(item.checkedDate);
  if (!checkedDate) return false;
  return asOf.getTime() - checkedDate.getTime() <= CONCESSION_FRESHNESS_DAYS * 24 * 60 * 60 * 1000;
}

function knownConcessionEstimate(apartment, unitType = null) {
  if (apartment?.decisionSignals?.concessionAvailability === "limited_not_scored") return null;
  const item = apartment?.trueMonthlyCost?.concessionEstimate;
  if (!item || item.confidence === "unknown") return null;
  if (!concessionIsCurrent(item)) return null;
  const hasMonthlyCredit = Number.isFinite(item.monthlyCredit) && item.monthlyCredit > 0;
  const hasFreeRent = Number.isFinite(item.monthsFree) && item.monthsFree > 0 && Number.isFinite(item.leaseMonths) && item.leaseMonths > 0;
  if (!hasMonthlyCredit && !hasFreeRent) return null;
  if (unitType && Array.isArray(item.eligibleUnitTypes) && !item.eligibleUnitTypes.includes(unitType)) return null;
  return item;
}

function knownConcessionCredit(apartment, baseRent, unitType = null) {
  const item = knownConcessionEstimate(apartment, unitType);
  if (!item) return 0;
  if (Number.isFinite(item.monthlyCredit) && item.monthlyCredit > 0) return item.monthlyCredit;
  return baseRent * (item.monthsFree / item.leaseMonths);
}

function concessionLabel(item, lang = activeLang()) {
  if (Number.isFinite(item?.monthsFree) && Number.isFinite(item?.leaseMonths)) {
    return lang === "zh"
      ? `${item.monthsFree}/${item.leaseMonths} 免租优惠`
      : `${item.monthsFree}/${item.leaseMonths} free-rent offer`;
  }
  return lang === "zh"
    ? `每月 ${formatMoney(item?.monthlyCredit)} 抵扣`
    : `${formatMoney(item?.monthlyCredit)}/mo credit`;
}

function concessionCostLine(apartment, baseRent, unitType = null) {
  const item = knownConcessionEstimate(apartment, unitType);
  if (!item) return null;
  const amount = knownConcessionCredit(apartment, baseRent, unitType);
  if (!amount) return null;
  return {
    key: "concessionEstimate",
    amount,
    confidence: item.confidence || "conditional_offer",
    isCredit: true,
    eligibilityNeedsConfirmation: item.eligibleUnits !== true
  };
}

function moveInCostLine(key, item, baseRent, fallbackAmount = 0) {
  const amount = costItemAmount(item, baseRent, fallbackAmount);
  const maxAmount = costItemMaxAmount(item, baseRent, amount);
  const confidence = item?.confidence || "planning_assumption";
  if (!amount && !maxAmount && confidence === "unknown") return null;
  return { key, amount, maxAmount, confidence };
}

function advertisedRentForAnswers(apartment, answers = {}, selectedCandidate = null) {
  const unitType = budgetUnitTypeSelection(answers).resolved;
  const availability = apartment.price?.availability || {};
  const advertisedByType = availability.advertisedByType?.[unitType];
  if (Number.isFinite(advertisedByType)) return advertisedByType;

  const currentByType = availability.currentMinByType?.[unitType];
  if (Number.isFinite(currentByType?.baseRent)) return currentByType.baseRent;
  if (Number.isFinite(selectedCandidate?.trace?.baseRentMin)) return selectedCandidate.trace.baseRentMin;
  if (Number.isFinite(currentByType?.rent)) return currentByType.rent;
  if (Number.isFinite(selectedCandidate?.standardLeasePrice)) return selectedCandidate.standardLeasePrice;

  const fallback = apartment.trueMonthlyCost?.advertisedRent;
  return Number.isFinite(fallback) ? fallback : apartment.price.min;
}

function calculateCosts(apartment, answers = {}, options = {}) {
  const monthlyProfile = apartment.trueMonthlyCost || {};
  const moveInProfile = apartment.moveInCash || {};
  const selectedCandidate = AVAILABILITY_PRICE_SNAPSHOT[apartment.id]
    ? selectBudgetCandidate(apartment, answers, { respectFeatures: true }).candidate
    : null;
  const advertisedRent = advertisedRentForAnswers(apartment, answers, selectedCandidate);
  const selectedBasis = selectedCandidate?.budgetEligible && Number.isFinite(selectedCandidate.standardLeasePrice)
    ? {
        rent: selectedCandidate.standardLeasePrice,
        rentMax: selectedCandidate.standardLeasePrice,
        includesRequiredFees: ["official_total", "calculated_total"].includes(selectedCandidate.priceBasis),
        candidate: selectedCandidate
      }
    : null;
  const currentBasis = selectedBasis || currentRentBasis(apartment);
  const baseRent = currentBasis?.rent || advertisedRent;
  const baseRentMax = currentBasis?.rentMax || baseRent;

  const excluded = [];
  const petSelected = (answers.priority || []).includes("pet_friendly");
  const petPolicy = apartment.decisionSignals?.petPolicy || null;
  const petTypeAllowed = !answers.petType
    || !Array.isArray(petPolicy?.allowedTypes)
    || petPolicy.allowedTypes.includes(answers.petType);
  const petPolicyApplies = petSelected && petPolicy?.allowed === true && petTypeAllowed;
  const petMonthlyItem = petPolicyApplies && Number.isFinite(petPolicy.monthlyRent)
    ? {
        key: "petRent",
        amount: petPolicy.monthlyRent,
        maxAmount: petPolicy.monthlyRent,
        confidence: petPolicy.confidence || "unknown"
      }
    : null;
  const petOneTimeAmount = petPolicyApplies
    ? (Number(petPolicy.oneTimeFee) || 0) + (Number(petPolicy.petDeposit) || 0)
    : 0;
  if (petSelected && petPolicy?.allowed !== false && !petMonthlyItem) excluded.push("petRent");
  if (petSelected && petPolicy?.allowed !== false && !petOneTimeAmount) excluded.push("petFee");

  const recurringItem = currentBasis?.includesRequiredFees
    ? null
    : monthlyCostLine("recurringFees", monthlyProfile.recurringFees, baseRent, answers, 0);
  if (!currentBasis?.includesRequiredFees && (!recurringItem || recurringItem.confidence === "unknown" || (!monthlyProfile.recurringFees && recurringItem.amount === 0))) {
    excluded.push("recurringFees");
  }

  const parkingSelected = (answers.priority || []).includes("parking") || (answers.requirements || []).includes("parking");
  const parkingItem = monthlyCostLine("parkingEstimate", monthlyProfile.parkingEstimate, baseRent, answers, DEFAULT_COST_ASSUMPTIONS.parkingMonthly);
  if (parkingSelected && !parkingItem) excluded.push("parkingEstimate");

  const monthlyItems = [
    (!excluded.includes("recurringFees") ? recurringItem : null),
    ...utilityCostItems(apartment),
    monthlyCostLine("insuranceEstimate", monthlyProfile.insuranceEstimate, baseRent, answers, DEFAULT_COST_ASSUMPTIONS.renterInsurance),
    monthlyCostLine("furnitureAmortized", monthlyProfile.furnitureAmortized, baseRent, answers, DEFAULT_COST_ASSUMPTIONS.furnitureMonthly),
    parkingItem,
    petMonthlyItem
  ].filter(Boolean);

  const selectedUnitType = selectedCandidate?.unitType || budgetUnitTypeSelection(answers).resolved;
  const concessionBaseRent = Number.isFinite(selectedCandidate?.trace?.baseRentMin)
    ? selectedCandidate.trace.baseRentMin
    : baseRent;
  const concessionLine = concessionCostLine(apartment, concessionBaseRent, selectedUnitType);
  const grossMonthlyMin = baseRent + monthlyItems.reduce((sum, item) => sum + item.amount, 0);
  const grossMonthlyMax = baseRentMax + monthlyItems.reduce((sum, item) => {
    return sum + (Number.isFinite(item.maxAmount) ? item.maxAmount : item.amount);
  }, 0);
  const concessionCredit = concessionLine?.amount || 0;
  const trueMonthlyMin = Math.max(0, grossMonthlyMin - concessionCredit);
  const trueMonthlyMax = Math.max(0, grossMonthlyMax - concessionCredit);

  const moveInItems = [
    moveInCostLine("firstMonth", moveInProfile.firstMonth || { multiplier: 1, confidence: "advertised_rent" }, baseRent, baseRent),
    moveInCostLine("securityDeposit", moveInProfile.securityDeposit || { multiplier: DEFAULT_COST_ASSUMPTIONS.securityDepositMultiplier }, baseRent, baseRent),
    moveInCostLine("appFee", moveInProfile.appFee, baseRent, DEFAULT_COST_ASSUMPTIONS.applicationFee),
    moveInCostLine("adminFee", moveInProfile.adminFee, baseRent, 0),
    petOneTimeAmount > 0 ? {
      key: "petFee",
      amount: petOneTimeAmount,
      maxAmount: petOneTimeAmount,
      confidence: petPolicy.confidence || "unknown"
    } : null
  ].filter(Boolean);
  if (Number.isFinite(currentBasis?.rentMax) && moveInItems[0]) moveInItems[0].maxAmount = currentBasis.rentMax;
  const moveInMin = moveInItems.reduce((sum, item) => sum + item.amount, 0);
  const moveInMax = moveInItems.reduce((sum, item) => sum + (Number.isFinite(item.maxAmount) ? item.maxAmount : item.amount), 0);

  if (moveInProfile.adminFee?.confidence === "unknown" && !moveInProfile.adminFee.amount) excluded.push("adminFee");

  return {
    advertisedRent,
    baseRent,
    selectedBudgetCandidateUsed: Boolean(selectedBasis),
    currentAvailabilityUsed: Boolean(currentBasis),
    grossMonthly: grossMonthlyMin,
    grossMonthlyMin,
    grossMonthlyMax,
    trueMonthly: trueMonthlyMax,
    trueMonthlyMin,
    trueMonthlyMax,
    concessionLine,
    concessionApplied: concessionCredit > 0,
    monthlyItems,
    moveInMin,
    moveInMax,
    moveInItems,
    monthlyDelta: trueMonthlyMax - advertisedRent,
    excluded
  };
}

function renderCostLine(item, lang) {
  const amount = item.maxAmount && item.maxAmount !== item.amount
    ? formatMoneyRange(item.amount, item.maxAmount)
    : formatMoney(item.amount);
  const signedAmount = item.isCredit ? `-${amount}` : amount;
  return `
    <li>
      <span>${escapeHtml(costItemLabel(item.key, lang))}</span>
      <strong>${escapeHtml(signedAmount)}</strong>
      <em>${escapeHtml(costConfidenceLabel(item.confidence, lang))}</em>
    </li>
  `;
}

function renderCostMetrics(costs, text) {
  return `
    <div class="cost-metrics">
      <div class="cost-metric-primary">
        <span>${escapeHtml(text.trueMonthly)}</span>
        <strong>${escapeHtml(formatMoneyRange(costs.trueMonthlyMin, costs.trueMonthlyMax))}<small>${escapeHtml(text.estimateSuffix)}</small></strong>
      </div>
      <div>
        <span>${escapeHtml(text.moveInCash)}</span>
        <strong>${escapeHtml(formatMoneyRange(costs.moveInMin, costs.moveInMax))}<small>${escapeHtml(text.estimateSuffix)}</small></strong>
      </div>
    </div>
  `;
}

function renderCostSummary(costs, lang = activeLang()) {
  const text = COST_TEXT[lang] || COST_TEXT.en;
  const specialComparison = costs.concessionApplied
    ? `<div class="special-comparison">
        <span>${escapeHtml(lang === "zh" ? "优惠前" : "Before special")} <strong>${escapeHtml(formatMoneyRange(costs.grossMonthlyMin, costs.grossMonthlyMax))}</strong></span>
        <b aria-hidden="true">→</b>
        <span>${escapeHtml(lang === "zh" ? "优惠后" : "After special")} <strong>${escapeHtml(formatMoneyRange(costs.trueMonthlyMin, costs.trueMonthlyMax))}</strong></span>
      </div>`
    : "";
  return `<div class="cost-summary">${renderCostMetrics(costs, text)}${specialComparison}</div>`;
}

function renderCostBreakdown(costs, lang = activeLang(), options = {}) {
  const text = COST_TEXT[lang] || COST_TEXT.en;
  const appliedConcession = costs.concessionLine && costs.concessionApplied ? [costs.concessionLine] : [];
  const monthlyLines = [...costs.monthlyItems, ...appliedConcession].map(item => renderCostLine(item, lang)).join("");
  const moveInLines = costs.moveInItems.map(item => renderCostLine(item, lang)).join("");
  const excluded = costs.excluded.length
    ? `<p class="cost-excluded">${escapeHtml(text.excludedPrefix)}：${costs.excluded.map(key => escapeHtml(costItemLabel(key, lang))).join(" / ")}</p>`
    : "";
  return `
    <div class="cost-breakdown">
      <div class="cost-breakdown-title">${escapeHtml(text.title)}</div>
      ${options.showMetrics === false ? "" : renderCostMetrics(costs, text)}
      ${costs.concessionApplied ? `<p class="cost-gross">${escapeHtml(text.grossBeforeConcession)}：${escapeHtml(formatMoneyRange(costs.grossMonthlyMin, costs.grossMonthlyMax))}</p>` : ""}
      ${costs.concessionLine?.isConditional ? `<p class="cost-conditional">${escapeHtml(text.potentialConcession(costs.concessionLine.amount))}</p>` : ""}
      <div class="cost-line-grid">
        <div>
          <h4>${escapeHtml(text.monthlyIncludes)}</h4>
          <ul>${monthlyLines}</ul>
        </div>
        <div>
          <h4>${escapeHtml(text.moveInIncludes)}</h4>
          <ul>${moveInLines}</ul>
        </div>
      </div>
      ${excluded}
      <p class="cost-caveat">${escapeHtml(text.caveat)}</p>
    </div>
  `;
}

const SETUP_TO_BUDGET_FEATURE = {
  wood_floor: "woodFloor",
  laundry: "laundry",
  private_space: "privateSpace",
  furniture_ready: "furnitureReady"
};

function budgetUnitTypeSelection(answersOrUnitType = {}) {
  const requested = typeof answersOrUnitType === "string"
    ? answersOrUnitType
    : answersOrUnitType?.unitType || answersOrUnitType?.unit_type || "studio";
  if (requested === "not_sure") {
    return { requested, resolved: "1br", conservative: true };
  }
  if (["studio", "1br", "2br"].includes(requested)) {
    return { requested, resolved: requested, conservative: false };
  }
  return { requested: "studio", resolved: "studio", conservative: false };
}

function budgetSnapshotCandidates(apartment, answersOrUnitType = {}) {
  const propertySnapshot = AVAILABILITY_PRICE_SNAPSHOT[apartment.id];
  if (!propertySnapshot) return [];
  if (propertySnapshot.comparisonStatus) return [propertySnapshot];
  const unitType = budgetUnitTypeSelection(answersOrUnitType).resolved;
  const candidates = propertySnapshot[unitType];
  if (!candidates) return [];
  return Array.isArray(candidates) ? [...candidates] : [candidates];
}

function candidateFeatureCompatibility(candidate, setup = []) {
  const requestedFeatures = setup
    .map(value => SETUP_TO_BUDGET_FEATURE[value])
    .filter(Boolean);
  if (!requestedFeatures.length) return "compatible";
  const values = requestedFeatures.map(feature => candidate?.features?.[feature]);
  if (values.some(value => value === false)) return "incompatible";
  if (values.some(value => value !== true)) return "unknown";
  return "compatible";
}

function budgetCandidateEvidenceRank(candidate) {
  if (candidate.budgetEligible) return 0;
  if (candidate.comparisonStatus === "comparable") return 1;
  if (Number.isFinite(candidate.lowestObservedPrice)) return 2;
  return 3;
}

function budgetCandidatePrice(candidate) {
  for (const value of [candidate.standardLeasePrice, candidate.budgetLowerBound, candidate.lowestObservedPrice]) {
    if (Number.isFinite(value)) return value;
  }
  return Infinity;
}

function compareBudgetCandidates(left, right) {
  return budgetCandidateEvidenceRank(left) - budgetCandidateEvidenceRank(right) ||
    budgetCandidatePrice(left) - budgetCandidatePrice(right) ||
    String(left.subBuildingId || "").localeCompare(String(right.subBuildingId || "")) ||
    String(left.trace?.unitId || left.trace?.floorplanId || "").localeCompare(String(right.trace?.unitId || right.trace?.floorplanId || ""));
}

function selectBudgetCandidate(apartment, answersOrUnitType = {}, options = {}) {
  const unitType = budgetUnitTypeSelection(answersOrUnitType);
  const candidates = budgetSnapshotCandidates(apartment, answersOrUnitType);
  if (!candidates.length) return { candidate: null, unitType, compatibility: "no_candidate" };

  let pool = candidates;
  let compatibility = "not_checked";
  if (options.respectFeatures) {
    const setup = typeof answersOrUnitType === "object" ? answersOrUnitType.setup || [] : [];
    const statuses = candidates.map(candidate => ({
      candidate,
      status: candidateFeatureCompatibility(candidate, setup)
    }));
    const compatible = statuses.filter(item => item.status === "compatible").map(item => item.candidate);
    if (compatible.length) {
      pool = compatible;
      compatibility = "compatible";
    } else {
      const unknown = statuses.filter(item => item.status === "unknown").map(item => item.candidate);
      if (unknown.length) {
        pool = unknown;
        compatibility = "unknown_feature_compatibility";
      } else {
        return { candidate: null, unitType, compatibility: "incompatible" };
      }
    }
  }

  return {
    candidate: [...pool].sort(compareBudgetCandidates)[0],
    unitType,
    compatibility
  };
}

function subBuildingLabel(value = "") {
  return String(value)
    .split("_")
    .filter(Boolean)
    .map(part => part === "nhv" ? "NHV" : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function renderSelectedBudgetBasis(apartment, answers, lang = activeLang()) {
  const selection = selectBudgetCandidate(apartment, answers, { respectFeatures: true });
  const candidate = selection.candidate;
  const unitLabel = unitTypeLabel(selection.unitType.resolved, lang);
  if (!candidate && selection.compatibility === "incompatible") {
    const text = lang === "zh"
      ? `${unitLabel} 暂无明确符合所选硬性要求的房源，因此没有采用其他房源价格代替。`
      : `No ${unitLabel} candidate is confirmed to meet the selected requirement, so another unit's price is not substituted.`;
    return `<div class="budget-basis-note warn"><strong>${escapeHtml(lang === "zh" ? "预算采用" : "Budget basis")}</strong><span>${escapeHtml(text)}</span></div>`;
  }
  if (!candidate) return "";
  if (candidate.comparisonStatus === "not_applicable") {
    const text = lang === "zh"
      ? `${unitLabel} 在这次官网快照中为 N/A；不会用 Studio 以外的价格代替。`
      : `${unitLabel} is N/A in this official snapshot; no other unit type is substituted.`;
    return `<div class="budget-basis-note warn"><strong>${escapeHtml(lang === "zh" ? "预算采用" : "Budget basis")}</strong><span>${escapeHtml(text)}</span></div>`;
  }
  if (!candidate.budgetEligible || !Number.isFinite(candidate.standardLeasePrice)) return "";

  const grossComparisonPrice = candidate.standardLeasePrice;
  const concessionBase = Number.isFinite(candidate.trace?.baseRentMin)
    ? candidate.trace.baseRentMin
    : grossComparisonPrice;
  const concessionCredit = knownConcessionCredit(apartment, concessionBase, candidate.unitType);
  const comparisonPrice = Math.max(0, grossComparisonPrice - concessionCredit);
  const concession = knownConcessionEstimate(apartment, candidate.unitType);

  const identity = [
    candidate.subBuildingId ? subBuildingLabel(candidate.subBuildingId) : "",
    candidate.trace?.unitId || candidate.trace?.floorplanId || ""
  ].filter(Boolean).join(" · ");
  const details = [
    identity,
    candidate.comparisonLeaseMonths ? `${candidate.comparisonLeaseMonths}${lang === "zh" ? "个月" : " months"}` : "",
    Number.isFinite(candidate.sqftMin) ? `${candidate.sqftMin} sqft` : "",
    candidate.trace?.availableFrom
      ? /^available now$/i.test(candidate.trace.availableFrom)
        ? (lang === "zh" ? "现在可入住" : "available now")
        : `${lang === "zh" ? "可入住" : "available"} ${candidate.trace.availableFrom}`
      : "",
    candidate.checkedDate ? `${lang === "zh" ? "核对" : "checked"} ${candidate.checkedDate}` : ""
  ].filter(Boolean);
  const policy = candidate.comparisonPolicy === "official_range_midpoint"
    ? (lang === "zh"
        ? "采用官网户型租金区间中位数；不代表当前有房，固定月费仍需确认。"
        : "Uses the midpoint of the official floorplan rent range; current availability and required monthly fees still need confirmation.")
    : candidate.comparisonPolicy === "official_range_lower_bound_as_12_month"
      ? (lang === "zh"
          ? "采用官网 3-18 个月总月价区间下限，并按 12 个月作为比较口径。"
          : "Uses the lower bound of the official 3-18 month total-price range as the 12-month comparison basis.")
      : (lang === "zh"
          ? "采用官网当前 10/11/12 个月房源价格。"
          : "Uses current official 10/11/12-month unit pricing.");
  const concessionPolicy = concessionCredit > 0
    ? (lang === "zh"
        ? `已把 ${concession.monthsFree} 个月免租期优惠折算进月成本；若具体房源或租期不符合资格，仍以优惠前 ${formatMoney(grossComparisonPrice)}/月为准。`
        : `${concession.monthsFree} months free is prorated into monthly cost. If the exact unit or lease is not eligible, use the pre-concession ${formatMoney(grossComparisonPrice)}/mo instead.`)
    : "";
  const conservative = selection.unitType.conservative
    ? (lang === "zh" ? "Not sure 按 1BR 保守比较。" : "Not sure uses a conservative 1BR basis.")
    : "";
  const featureNote = selection.compatibility === "unknown_feature_compatibility"
    ? (lang === "zh"
        ? "价格已计入预算；房内配置仍需按具体房源确认。"
        : "The price is included in budget fit; confirm the selected in-unit feature for the exact unit.")
    : "";
  return `
    <div class="budget-basis-note${candidate.comparisonStatus === "policy_comparable" || featureNote ? " warn" : ""}">
      <strong>${escapeHtml(lang === "zh" ? "预算采用" : "Budget basis")}</strong>
      <span>${escapeHtml(`${unitLabel} ${formatMoney(comparisonPrice)} / ${lang === "zh" ? "月" : "mo"}${concessionCredit > 0 ? (lang === "zh" ? "（含当前优惠）" : " after current special") : ""}`)}</span>
      ${details.length ? `<em>${escapeHtml(details.join(" · "))}</em>` : ""}
      <small>${escapeHtml([policy, concessionPolicy, conservative, featureNote].filter(Boolean).join(" "))}</small>
    </div>
  `;
}

function budgetComparison(apartment, answers = {}) {
  const ceilingValue = Number(answers.budget);
  if (!Number.isFinite(ceilingValue)) return null;
  const unitType = budgetUnitTypeSelection(answers).resolved;
  const selection = selectBudgetCandidate(apartment, answers, { respectFeatures: true });
  const candidate = selection.candidate;
  if (!candidate || !candidate.budgetEligible || !["comparable", "policy_comparable"].includes(candidate.comparisonStatus)) return null;
  const grossCost = Number(candidate.standardLeasePrice);
  if (!Number.isFinite(grossCost)) return null;
  const concessionBase = Number.isFinite(candidate.trace?.baseRentMin)
    ? candidate.trace.baseRentMin
    : grossCost;
  const concessionCredit = knownConcessionCredit(apartment, concessionBase, candidate.unitType || unitType);
  const effectiveCost = Math.max(0, grossCost - concessionCredit);
  const band = budgetBand(ceilingValue, unitType);
  const ceiling = band ? band.upper : ceilingValue;
  return {
    candidate,
    selection,
    unitType,
    grossCost,
    concessionCredit,
    effectiveCost,
    ceiling,
    overage: Math.max(0, effectiveCost - ceiling),
    requiresConcession: concessionCredit > 0 && grossCost > ceiling && effectiveCost <= ceiling
  };
}

function scoreBudget(apartment, budgetOrAnswers) {
  const maxBudget = typeof budgetOrAnswers === "object" ? Number(budgetOrAnswers.budget) : Number(budgetOrAnswers);
  const unitType = typeof budgetOrAnswers === "object"
    ? budgetUnitTypeSelection(budgetOrAnswers).resolved
    : "studio";

  if (typeof budgetOrAnswers === "object") {
    const comparison = budgetComparison(apartment, budgetOrAnswers);
    if (comparison) return applyBudgetCeiling(comparison.effectiveCost, maxBudget, unitType);
  }

  const propertySnapshot = AVAILABILITY_PRICE_SNAPSHOT[apartment.id];
  const selection = propertySnapshot
    ? selectBudgetCandidate(apartment, budgetOrAnswers, { respectFeatures: typeof budgetOrAnswers === "object" })
    : null;
  const availability = propertySnapshot ? selection.candidate : apartment.price?.availability;

  if (propertySnapshot && !availability) return null;

  if (availability && availability.comparisonStatus) {
    const status = availability.comparisonStatus;
    const eligible = availability.budgetEligible;
    if (['comparable', 'policy_comparable'].includes(status) && eligible) {
      const grossCostBasis = Number(availability.standardLeasePrice);
      if (!Number.isFinite(grossCostBasis)) return null;
      const concessionBase = Number.isFinite(availability.trace?.baseRentMin)
        ? availability.trace.baseRentMin
        : grossCostBasis;
      const concessionCredit = knownConcessionCredit(apartment, concessionBase, availability.unitType || unitType);
      return applyBudgetCeiling(Math.max(0, grossCostBasis - concessionCredit), maxBudget, unitType);
    }

    if (status === 'comparable' && !eligible) {
      const lowerBound = Number(availability.budgetLowerBound);
      if (!Number.isFinite(lowerBound)) return null;
      const band = budgetBand(maxBudget, unitType);
      const ceiling = band ? band.upper : maxBudget;
      if (lowerBound > ceiling + 500) return SCORE.MISS;
      return null;
    }

    // Unknown, planning-only, inquire-only, and not-applicable states remain unscored.
    return null;
  }

  // Legacy path: no comparisonStatus injected yet — use traditional cost calculation
  const costBasis = typeof budgetOrAnswers === "object"
    ? calculateCosts(apartment, budgetOrAnswers).trueMonthlyMax
    : apartment.price.min;
  return applyBudgetCeiling(costBasis, maxBudget, unitType);
}

function applyBudgetCeiling(costBasis, maxBudget, unitType = "studio") {
  const band = budgetBand(maxBudget, unitType);
  if (!band) {
    if (costBasis <= maxBudget) return SCORE.FULL;
    if (costBasis <= maxBudget + 250) return SCORE.HIGH;
    if (costBasis <= maxBudget + 500) return SCORE.LOW;
    return SCORE.MISS;
  }
  if (costBasis <= band.upper) return SCORE.FULL;
  if (costBasis <= band.upper + 250) return SCORE.HIGH;
  if (costBasis <= band.upper + 500) return SCORE.LOW;
  return SCORE.MISS;
}

function balancedCampusScore(apartment) {
  const values = BALANCED_CAMPUS_KEYS
    .map(key => Number(apartment?.campusScores?.[key]))
    .filter(Number.isFinite);
  if (values.length !== BALANCED_CAMPUS_KEYS.length) return SCORE.LOW;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const weakest = Math.min(...values);
  return Math.round((average * 0.7 + weakest * 0.3) * 20);
}

function scoreCampus(apartment, preference) {
  if (preference === "balanced") return balancedCampusScore(apartment);
  return (apartment.campusScores[preference] || 1) * 20;
}

// Backward-compat alias for older tests or review snippets that still call location.
function scoreLocation(apartment, preference) {
  return scoreCampus(apartment, preference);
}

function scoreUtilities(apartment, preference) {
  if (!preference) return null;
  if (preference === "predictable") return UTILITY_PREDICTABILITY_SCORE[apartment.utilities] || SCORE.LOW;
  if (preference === "some_variable") {
    if (apartment.utilities === "mixed") return SCORE.VERY_HIGH;
    if (apartment.utilities === "predictable") return SCORE.HIGH;
    if (apartment.utilities === "unknown") return SCORE.MID;
    return SCORE.MID;
  }
  return apartment.amenityTags.includes("gym_pool") || apartment.amenityTags.includes("package") ? SCORE.VERY_HIGH : SCORE.MID;
}

function scoreFlooringStatus(flooringStatus) {
  const fs = flooringStatus;
  if (!fs || !Array.isArray(fs.materials) || !fs.materials.length || fs.scope === null) return SCORE.MID;
  // Building-level photos can show that a material exists somewhere in the
  // property, but cannot prove the flooring in the selected unit.
  if (!["exact_unit", "floorplan"].includes(fs.scope)) return SCORE.MID;
  const hardSurfaceMaterials = ["wood_look", "hard_surface", "hardwood", "lvp", "lvt", "polished_concrete"];
  const hasHardSurface = hardSurfaceMaterials.some(material => fs.materials.includes(material));
  const hasCarpet = fs.materials.includes("carpet");
  if (hasCarpet && !hasHardSurface) return SCORE.MISS;
  if (hasCarpet && hasHardSurface) return SCORE.LOW;
  if (fs.scope === "exact_unit" && hasHardSurface) return SCORE.FULL;
  if (fs.scope === "floorplan" && fs.evidenceType === "official_claim" && hasHardSurface) return SCORE.HIGH;
  return SCORE.MID;
}

function scoreSetup(apartment, preferences, answers = {}) {
  if (!preferences.length) return null;
  const selected = preferences.filter(preference => (
    !Object.hasOwn(SETUP_TO_BUDGET_FEATURE, preference)
    || requirementEvidenceCoverage(preference, answers).active
  ));
  if (!selected.length) return null;
  const scores = selected.map(preference => {
    if (Object.hasOwn(SETUP_TO_BUDGET_FEATURE, preference)) {
      const selection = selectBudgetCandidate(
        apartment,
        { ...answers, setup: [preference] },
        { respectFeatures: true }
      );
      if (selection.compatibility === "compatible") return SCORE.FULL;
      if (selection.compatibility === "incompatible") return SCORE.MISS;
    }

    if (preference === "wood_floor") {
      return scoreFlooringStatus(apartment.flooringStatus);
    }

    // Building-level tags can indicate that a feature exists somewhere in the
    // property, but they do not prove that the selected unit has it.
    if (apartment.setupTags.includes(preference)) return SCORE.MID;
    return SCORE.MID;
  }).filter(Number.isFinite);
  if (!scores.length) return null;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function scoreAmenity(apartment, preference) {
  if (apartment.amenityTags.includes(preference)) return SCORE.FULL;
  if (preference === "basic" && apartment.price.min < 1800) return SCORE.VERY_HIGH;
  if (preference === "basic") return SCORE.HIGH;
  if (apartment.amenityTags.includes("package") && preference === "gym_pool") return SCORE.MID;
  return SCORE.LOW;
}

function amenityFeatureCount(apartment) {
  return [
    apartment.amenityTags.includes("package"),
    apartment.amenityTags.includes("gym_pool"),
    apartment.amenityTags.includes("parking"),
    apartment.setupTags.includes("laundry"),
    apartment.dailyTags.includes("building_access")
  ].filter(Boolean).length;
}

function scoreAmenityBreadth(apartment) {
  const count = amenityFeatureCount(apartment);
  if (count >= STRONG_AMENITY_FEATURE_COUNT) return SCORE.FULL;
  if (count === 3) return SCORE.HIGH;
  if (count === 2) return SCORE.MID;
  return SCORE.LOW;
}

function scoreNewerBuilding(apartment) {
  const openedYear = apartment.decisionSignals?.openedYear;
  const confidence = apartment.decisionSignals?.openedYearConfidence;
  if (!Number.isFinite(openedYear) || !confidence) return SCORE.MID;
  if (openedYear >= 2024) return SCORE.FULL;
  if (openedYear >= 2020) return SCORE.HIGH;
  if (openedYear >= 2010) return SCORE.MID;
  return SCORE.LOW;
}

function parkingRequirementTier(apartment) {
  const access = apartment.decisionSignals?.parkingAccess;
  const availability = apartment.decisionSignals?.parkingAvailability;
  const estimate = apartment.trueMonthlyCost?.parkingEstimate;

  if (["onsite", "adjacent_monthly_garage"].includes(access?.type) && access.monthlyParking !== false) return 2;
  if (access?.type === "none") return 0;
  if (["nearby_garage", "street_only"].includes(access?.type)) return 1;
  if (availability === "official_ample_claim") return 2;
  if (Number.isFinite(estimate?.amount) && hasRequirementEvidence(estimate)) return 2;
  return 1;
}

function scoreParking(apartment) {
  const access = apartment.decisionSignals?.parkingAccess;
  const availability = apartment.decisionSignals?.parkingAvailability;
  if (access?.type === "onsite") return access.availability === "ample" ? SCORE.FULL : SCORE.HIGH;
  if (access?.type === "adjacent_monthly_garage") return SCORE.HIGH;
  if (access?.type === "nearby_garage") return SCORE.MID;
  if (access?.type === "street_only") return SCORE.LOW;
  if (access?.type === "none") return SCORE.MISS;
  if (availability === "official_ample_claim") return SCORE.FULL;
  const estimate = apartment.trueMonthlyCost?.parkingEstimate;
  if (apartment.amenityTags.includes("parking") || Number.isFinite(estimate?.amount)) return SCORE.HIGH;
  if (availability === "no_onsite") return SCORE.LOW;
  return SCORE.MID;
}

function scorePetPolicy(apartment, userPet = null) {
  const policy = apartment.decisionSignals?.petPolicy;
  if (!policy || policy.allowed === null) return SCORE.MID;
  if (policy.allowed === false) return SCORE.MISS;
  const allowedTypes = Array.isArray(policy.allowedTypes) ? policy.allowedTypes : [];
  if (policy.allowed === "cats_only") {
    if (!userPet) return SCORE.MID;
    return userPet === "cat" ? SCORE.FULL : SCORE.MISS;
  }
  if (userPet && allowedTypes.length && !allowedTypes.includes(userPet)) return SCORE.MISS;
  if (policy.allowed === "restricted") return userPet ? SCORE.HIGH : SCORE.MID;
  if (policy.allowed === true) return userPet ? SCORE.FULL : SCORE.HIGH;
  return null;
}

function hasRequirementEvidence(item) {
  return Boolean(item && !["unknown", "planning_assumption", "low", "stale"].includes(item.confidence));
}

function selectedHardRequirements(answers = {}) {
  return [...new Set([
    ...(answers.requirements || []),
    ...(answers.setup || []),
    ...(answers.priority || []).filter(value => HARD_REQUIREMENT_PRIORITIES.has(value))
  ])];
}

function requirementEvidenceTier(apartment, requirement, answers = {}) {
  if (Object.hasOwn(SETUP_TO_BUDGET_FEATURE, requirement)) {
    const selection = selectBudgetCandidate(
      apartment,
      { ...answers, setup: [requirement] },
      { respectFeatures: true }
    );
    if (selection.compatibility === "compatible") return 2;
    if (selection.compatibility === "incompatible") return 0;
    return 1;
  }

  if (requirement === "pet_friendly") {
    const petScore = scorePetPolicy(apartment, answers.petType || null);
    if (!Number.isFinite(petScore)) return 1;
    if (petScore >= SCORE.HIGH) return 2;
    if (petScore <= SCORE.LOW) return 0;
    return 1;
  }

  if (requirement === "parking") return parkingRequirementTier(apartment);
  return 1;
}

function requirementEvidenceCoverage(requirement, answers = {}) {
  const tiers = APARTMENTS
    .filter(isRankableApartment)
    .map(apartment => requirementEvidenceTier(apartment, requirement, answers));
  const known = tiers.filter(tier => tier === 0 || tier === 2).length;
  return { known, total: tiers.length, active: known >= MAIN_NEED_TIER_MIN_KNOWN };
}

function activeHardRequirements(answers = {}) {
  return selectedHardRequirements(answers)
    .filter(requirement => requirementEvidenceCoverage(requirement, answers).active);
}

function hardRequirementTier(apartment, answers = {}) {
  const tiers = activeHardRequirements(answers)
    .map(requirement => requirementEvidenceTier(apartment, requirement, answers));

  if (!tiers.length) return null;
  if (tiers.includes(0)) return 0;
  if (tiers.every(tier => tier === 2)) return 2;
  return 1;
}

function concessionDiscountPercent(apartment, unitType = null) {
  const concession = knownConcessionEstimate(apartment, unitType);
  if (!concession || !Number.isFinite(concession.monthsFree) || !Number.isFinite(concession.leaseMonths) || concession.leaseMonths <= 0) return 0;
  return Math.round((concession.monthsFree / concession.leaseMonths) * 100);
}

function scoreConcession(apartment, answers = {}) {
  if (apartment.decisionSignals?.concessionAvailability === "limited_not_scored") return SCORE.LOW;
  const unitType = budgetUnitTypeSelection(answers).resolved;
  const concession = knownConcessionEstimate(apartment, unitType);
  if (!concession) return SCORE.MID;

  const discount = concessionDiscountPercent(apartment, unitType);
  if (discount >= 15) return SCORE.FULL;
  if (discount >= 8) return SCORE.HIGH;
  if (discount > 0) return SCORE.MID;
  return SCORE.MID;
}

function scoreAccessAndLateRoute(apartment) {
  const access = apartment.dailyTags.includes("building_access");
  const lateRoute = apartment.dailyTags.includes("late_route");
  if (access && lateRoute) return SCORE.FULL;
  if (access || lateRoute) return SCORE.HIGH;
  return SCORE.MID;
}

function preferenceEvidenceCoverage(preference) {
  const pool = APARTMENTS.filter(isRankableApartment);
  const known = pool.filter(apartment => {
    if (preference === "quiet_routine") {
      return Number.isFinite(Number(apartment.quietScore)) && Boolean(apartment.decisionSignals?.quietSource);
    }
    if (preference === "yale_shuttle") {
      return Number.isFinite(Number(apartment.decisionSignals?.yaleShuttleScore)) && Boolean(apartment.decisionSignals?.yaleShuttleSource);
    }
    if (preference === "low_density") {
      return Number.isFinite(Number(apartment.decisionSignals?.lowDensityScore)) && Boolean(apartment.decisionSignals?.lowDensitySource);
    }
    return true;
  }).length;
  return { known, total: pool.length, active: known >= MAIN_NEED_TIER_MIN_KNOWN };
}

function scoreLowDensity(apartment) {
  if (!preferenceEvidenceCoverage("low_density").active) return null;
  const score = apartment.decisionSignals?.lowDensityScore;
  const source = apartment.decisionSignals?.lowDensitySource;
  return Number.isFinite(score) && source ? Math.max(SCORE.MISS, Math.min(SCORE.FULL, score * 20)) : SCORE.MID;
}

function scoreYaleShuttle(apartment) {
  if (!preferenceEvidenceCoverage("yale_shuttle").active) return null;
  const score = apartment.decisionSignals?.yaleShuttleScore;
  const source = apartment.decisionSignals?.yaleShuttleSource;
  return Number.isFinite(score) && source ? Math.max(SCORE.MISS, Math.min(SCORE.FULL, score * 20)) : SCORE.MID;
}

function scoreTrueCostConcern(apartment, answers = {}) {
  const predictability = UTILITY_PREDICTABILITY_SCORE[apartment.utilities] || SCORE.LOW;
  const trueMonthly = calculateCosts(apartment, answers).trueMonthly;
  const unitType = budgetUnitTypeSelection(answers).resolved;
  const price = Number.isFinite(Number(answers.budget))
    ? applyBudgetCeiling(trueMonthly, Number(answers.budget), unitType)
    : trueMonthly < 1600 ? SCORE.FULL : trueMonthly < 2200 ? SCORE.HIGH : trueMonthly < 2800 ? SCORE.MID : SCORE.LOW;
  // Keep this score about cost exposure only; source confidence is shown separately.
  return Math.round((predictability + price) / 2);
}

function scoreSingleWorry(apartment, preference, answers = {}) {
  if (preference === "application") {
    const yalePath = apartment.applicationPolicy?.yaleCommunityBankStatementPath;
    if (yalePath?.value === true && yalePath.guarantorRequired === false && yalePath.coSignerRequired === false && hasRequirementEvidence(yalePath)) {
      return SCORE.HIGH;
    }
    if (["low", "unknown", "stale"].includes(apartment.applicationConfidence)) return SCORE.MID;
    return Math.max(20, 100 - apartment.applicationFriction * 16);
  }
  if (preference === "roommate") return apartment.roommateFit * 20;
  if (preference === "trust") return null;
  if (preference === "true_cost") return scoreTrueCostConcern(apartment, answers);
  return SCORE.MID;
}

function scoreWorry(apartment, preferences, answers = {}) {
  const selected = preferences.length ? preferences : ["application"];
  const scores = selected
    .map(preference => scoreSingleWorry(apartment, preference, answers))
    .filter(Number.isFinite);
  if (!scores.length) return SCORE.MID;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function scoreDaily(apartment, preference) {
  if (preference === "quiet_routine") {
    if (!preferenceEvidenceCoverage("quiet_routine").active) return null;
    if (!apartment.decisionSignals?.quietSource) return SCORE.MID;
    const quiet = Number(apartment.quietScore);
    if (!Number.isFinite(quiet)) return SCORE.MID;
    if (quiet >= 75) return SCORE.FULL;
    if (quiet >= 60) return SCORE.HIGH;
    if (quiet >= 40) return SCORE.MID;
    if (quiet >= 25) return SCORE.LOW;
    return SCORE.MISS;
  }
  if (apartment.dailyTags.includes(preference)) return SCORE.FULL;
  if (preference === "building_access" && apartment.amenityTags.includes("package")) return SCORE.HIGH;
  if (preference === "food_store" && apartment.campusScores.downtown_station >= 4) return SCORE.HIGH;
  if (preference === "late_route" && Math.max(apartment.campusScores.central_campus, apartment.campusScores.med_school) >= 4) return SCORE.HIGH;
  return SCORE.LOW;
}

function scoreSinglePriority(apartment, preference, answers = {}) {
  if (SCORABLE_WORRY_VALUES.has(preference)) return scoreSingleWorry(apartment, preference, answers);
  if (preference === "trust") return null;
  if (preference === "utilities_predictable") return scoreUtilities(apartment, "predictable");
  if (preference === "newer_building") return scoreNewerBuilding(apartment);
  if (preference === "amenity_breadth") return scoreAmenityBreadth(apartment);
  if (preference === "low_density") return scoreLowDensity(apartment);
  if (preference === "access_late_route") return scoreAccessAndLateRoute(apartment);
  if (preference === "parking") return scoreParking(apartment);
  if (preference === "pet_friendly") return scorePetPolicy(apartment, answers.petType || null);
  if (preference === "concession") return scoreConcession(apartment, answers);
  if (preference === "yale_shuttle") return scoreYaleShuttle(apartment);
  if (["basic", "package", "gym_pool"].includes(preference)) return scoreAmenity(apartment, preference);
  if (["building_access", "late_route", "food_store", "quiet_routine"].includes(preference)) return scoreDaily(apartment, preference);
  return SCORE.MID;
}

function scorePriority(apartment, priorities, answers = {}) {
  if (!priorities.length) return null;
  const scores = priorities
    .map(preference => scoreSinglePriority(apartment, preference, answers))
    .filter(Number.isFinite);
  if (!scores.length) return null;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function weightsForAnswers(answers) {
  const quietIsActive = (answers.priority || []).includes("quiet_routine")
    && preferenceEvidenceCoverage("quiet_routine").active;
  return quietIsActive ? QUIET_PRIORITY_WEIGHTS : WEIGHTS;
}

function scoreApartment(apartment, answers) {
  const weights = weightsForAnswers(answers);
  const rawBreakdown = {
    budget: scoreBudget(apartment, answers),
    campus: scoreCampus(apartment, answers.campus),
    utilities: scoreUtilities(apartment, answers.utilities),
    setup: scoreSetup(apartment, answers.setup, answers),
    priority: scorePriority(apartment, answers.priority || [], answers)
  };
  const breakdown = Object.fromEntries(Object.entries(rawBreakdown).filter(([, score]) => Number.isFinite(score)));
  const weightedTotal = Object.entries(breakdown).reduce((sum, [key, score]) => {
    return sum + score * weights[key];
  }, 0);
  const max = Object.keys(breakdown).reduce((sum, key) => sum + weights[key] * 100, 0);
  return {
    apartment,
    breakdown,
    hardRequirementTier: hardRequirementTier(apartment, answers),
    score: Math.round((weightedTotal / max) * 100)
  };
}

function campusFitTier(apartment, campus) {
  if (!campus || campus === "balanced") return null;
  const campusScore = apartment?.campusScores?.[campus] || 1;
  if (campusScore >= 5) return 4;
  if (campusScore >= 4) return 3;
  if (campusScore >= 3) return 2;
  return 1;
}

function campusFitTierLabel(apartment, campus, lang = activeLang()) {
  if (!campus || campus === "balanced") return null;
  return locationFitLabel(apartment?.campusScores?.[campus] || 1, lang);
}

function locationFitLabel(campusScore, lang = activeLang()) {
  const score = Number(campusScore) || 1;
  if (lang === "zh") {
    if (score >= 5) return "位置匹配极佳";
    if (score >= 4) return "位置匹配良好";
    if (score >= 3) return "位置匹配一般";
    return "位置匹配较弱";
  }
  if (score >= 5) return "Excellent location fit";
  if (score >= 4) return "Good location fit";
  if (score >= 3) return "Moderate location fit";
  return "Weak location fit";
}

function locationBrowseTierLabel(campusScore, lang = activeLang()) {
  const score = Number(campusScore) || 1;
  if (lang === "zh") return score >= 5 ? "最接近的一档" : "较近的一档";
  return score >= 5 ? "Closest location tier" : "Nearby location tier";
}

function confirmedBudgetMiss(result) {
  return result?.breakdown?.budget === SCORE.MISS;
}

function budgetRankingTier(result) {
  const score = result?.breakdown?.budget;
  if (score === SCORE.FULL) return 4;
  if (score === SCORE.HIGH) return 3;
  if (!Number.isFinite(score)) return 2;
  if (score === SCORE.LOW) return 1;
  return 0;
}

function budgetLocationPenalty(result, answers = {}) {
  const comparison = budgetComparison(result.apartment, answers);
  const overage = comparison?.overage;
  if (Number.isFinite(overage)) {
    if (overage <= BUDGET_LOCATION_SOFT_TOLERANCE) return 0;
    if (overage <= 250) return 1;
    if (overage <= 500) return 2;
    return 3;
  }
  if (result?.breakdown?.budget === SCORE.LOW) return 2;
  if (result?.breakdown?.budget === SCORE.MISS) return 3;
  return 0;
}

function rankingCampusTier(result, answers = {}) {
  const tier = campusFitTier(result.apartment, answers.campus);
  if (!Number.isFinite(tier)) return null;
  return Math.max(1, tier - budgetLocationPenalty(result, answers));
}

function compareResults(a, b, answers = null) {
  if (answers && (Number.isFinite(a.hardRequirementTier) || Number.isFinite(b.hardRequirementTier))) {
    const aNeedTier = Number.isFinite(a.hardRequirementTier) ? a.hardRequirementTier : 1;
    const bNeedTier = Number.isFinite(b.hardRequirementTier) ? b.hardRequirementTier : 1;
    const needTierDiff = bNeedTier - aNeedTier;
    if (needTierDiff !== 0) return needTierDiff;
  }

  if (answers?.campus && answers.campus !== "balanced") {
    const campusTierDiff = rankingCampusTier(b, answers) - rankingCampusTier(a, answers);
    if (campusTierDiff !== 0) return campusTierDiff;
    const budgetTierDiff = budgetRankingTier(b) - budgetRankingTier(a);
    if (budgetTierDiff !== 0) return budgetTierDiff;
  } else if (answers?.campus === "balanced") {
    const budgetTierDiff = budgetRankingTier(b) - budgetRankingTier(a);
    if (budgetTierDiff !== 0) return budgetTierDiff;
  }

  const scoreDiff = b.score - a.score;
  if (scoreDiff !== 0) return scoreDiff;
  const aEffectivePrice = budgetComparison(a.apartment, answers || {})?.effectiveCost;
  const bEffectivePrice = budgetComparison(b.apartment, answers || {})?.effectiveCost;
  if (Number.isFinite(aEffectivePrice) && Number.isFinite(bEffectivePrice)) {
    const priceDiff = aEffectivePrice - bEffectivePrice;
    if (priceDiff !== 0) return priceDiff;
  } else if (Number.isFinite(aEffectivePrice) !== Number.isFinite(bEffectivePrice)) {
    return Number.isFinite(aEffectivePrice) ? -1 : 1;
  }
  if ((answers?.priority || []).length) {
    const priorityDiff = (b.breakdown.priority ?? -Infinity) - (a.breakdown.priority ?? -Infinity);
    if (priorityDiff !== 0) return priorityDiff;
  }
  const budgetDiff = (b.breakdown.budget ?? -Infinity) - (a.breakdown.budget ?? -Infinity);
  if (budgetDiff !== 0) return budgetDiff;
  const campusDiff = b.breakdown.campus - a.breakdown.campus;
  if (campusDiff !== 0) return campusDiff;
  const advertisedPriceDiff = a.apartment.price.min - b.apartment.price.min;
  if (advertisedPriceDiff !== 0) return advertisedPriceDiff;
  return a.apartment.name.localeCompare(b.apartment.name);
}

function topReasons(result, lang = activeLang(), answers = null) {
  const reasons = [];
  const add = label => {
    if (label && !reasons.includes(label)) reasons.push(label);
  };

  const selectedPriorities = answers?.priority || [];
  const priorityScores = selectedPriorities
    .map(preference => ({
      preference,
      score: scoreSinglePriority(result.apartment, preference, answers || {})
    }))
    .filter(item => Number.isFinite(item.score) && item.score >= SCORE.MID)
    .sort((a, b) => b.score - a.score);

  if (priorityScores.length) add(priorityReasonLabel(priorityScores[0].preference, lang));
  if (answers?.campus && answers.campus !== "balanced" && result.breakdown.campus >= 80) add(categoryLabel("campus", lang));
  if (result.breakdown.budget >= SCORE.HIGH) add(categoryLabel("budget", lang));
  if (answers?.utilities && result.breakdown.utilities >= SCORE.HIGH) add(categoryLabel("utilities", lang));
  if ((answers?.setup || []).length && result.breakdown.setup >= SCORE.HIGH) add(categoryLabel("setup", lang));

  Object.entries(result.breakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key]) => add(categoryLabel(key, lang)));

  return reasons.slice(0, 2);
}

function confidenceClass(apartment) {
  if (["low", "stale"].includes(apartment.priceAvailabilityConfidence)) return "low";
  if (apartment.priceAvailabilityConfidence === "verified_public" &&
      apartment.feeConfidence === "verified_public" &&
      apartment.applicationConfidence === "verified_public") return "good";
  return "warn";
}

function confidenceSummaryLabel(apartment, lang = activeLang()) {
  if (["low", "stale"].includes(apartment.priceAvailabilityConfidence)) {
    return lang === "zh" ? "数据缺口较大" : "Major data gaps";
  }
  if (confidenceClass(apartment) === "good") {
    return lang === "zh" ? "主要信息已核实" : "Core data verified";
  }
  return lang === "zh" ? "部分信息待核实" : "Some details need verification";
}

function confidenceBanner(apartment) {
  if (apartment.isExploration) {
    return `<div class="confidence-banner">${escapeHtml(ui("confidenceExploration", activeLang()))}</div>`;
  }

  const warnings = [];
  const lang = activeLang();

  if (apartment.priceAvailabilityConfidence === "stale") {
     warnings.push(lang === "zh" ? "价格/房源数据过旧" : "Stale price/availability data");
  } else if (apartment.priceAvailabilityConfidence === "low") {
     warnings.push(lang === "zh" ? "价格/房源缺口大" : "Low confidence in price/availability");
  }

  if (apartment.feeConfidence === "stale") {
     warnings.push(lang === "zh" ? "费用数据过旧" : "Stale fee data");
  } else if (apartment.feeConfidence === "unknown" || apartment.feeConfidence === "low") {
     warnings.push(lang === "zh" ? "附加费用未知" : "Unknown fee details");
  } else if (apartment.feeConfidence === "partial_public") {
     warnings.push(lang === "zh" ? "费用信息不完整" : "Incomplete fee details");
  }

  if (apartment.applicationConfidence === "stale") {
     warnings.push(lang === "zh" ? "申请政策过旧" : "Stale application policy");
  } else if (apartment.applicationConfidence === "unknown" || apartment.applicationConfidence === "low") {
     warnings.push(lang === "zh" ? "申请政策未知" : "Unknown application policy");
  } else if (apartment.applicationConfidence === "partial_public") {
     warnings.push(lang === "zh" ? "申请政策部分核实" : "Application policy only partly verified");
  }

  if (warnings.length === 0) return "";

  const label = lang === "zh" ? "建议核实：" : "Needs verification: ";
  return `<div class="confidence-banner">${escapeHtml(label + warnings.join(" · "))}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function apartmentEvidence(apartment) {
  const urls = new Set();
  const dates = [];
  const seen = new Set();
  const visit = value => {
    if (!value || typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    for (const [key, nested] of Object.entries(value)) {
      if (key === "sourceUrl" && typeof nested === "string" && /^https?:\/\//.test(nested)) urls.add(nested);
      else if (key === "checkedDate" && /^\d{4}-\d{2}-\d{2}$/.test(String(nested))) dates.push(String(nested));
      else visit(nested);
    }
  };
  visit(apartment);
  const sortedUrls = [...urls].sort((a, b) => a.localeCompare(b));
  return {
    urls: sortedUrls.slice(0, 3),
    checkedDate: dates.sort().at(-1) || null
  };
}

function evidenceLinkLabel(url, lang) {
  if (/newhaventowers\.com/i.test(url)) return ui("officialSource", lang);
  return ui("publicSource", lang);
}

function renderEvidenceLinks(apartment, lang = activeLang(), answers = null) {
  const evidence = apartmentEvidence(apartment);
  const candidate = answers
    ? selectBudgetCandidate(apartment, answers, { respectFeatures: true }).candidate
    : null;
  const urls = [...new Set([candidate?.sourceUrl, ...evidence.urls].filter(Boolean))].slice(0, 3);
  const checkedDate = [candidate?.checkedDate, evidence.checkedDate].filter(Boolean).sort().at(-1) || null;
  if (!urls.length) return "";
  const links = urls.map(url => `
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(evidenceLinkLabel(url, lang))}</a>
  `).join("");
  const checked = checkedDate ? `<span>${escapeHtml(ui("evidenceChecked", lang)(checkedDate))}</span>` : "";
  return `<div class="source-links"><strong>${escapeHtml(ui("evidenceLinks", lang))}</strong>${links}${checked}</div>`;
}

function renderList(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function valueLabel(value, labels) {
  return labels[value] || value || "Not specified";
}

function labelLine(label, value, lang = activeLang()) {
  return `${label}${lang === "zh" ? "：" : ": "}${value}`;
}

function budgetLabel(maxBudget, unitType = "studio", lang = activeLang()) {
  const option = budgetBand(maxBudget, unitType);
  if (option) return option.label;
  return lang === "zh"
    ? `${formatMoney(maxBudget)} 上限`
    : `${formatMoney(maxBudget)} ceiling`;
}

function entryLabel(entry = latestEntry, lang = activeLang()) {
  if (entry.startsWith("location_browse:")) {
    const campus = entry.split(":")[1];
    return ui("entryLocationBrowse", lang)(campusLabel(campus, lang));
  }
  if (entry === "full_quiz") return ui("entryFullQuiz", lang);
  return ui("entryDefault", lang);
}

function isOutOfScope(answers) {
  return answers.budget < MVP_MIN_APARTMENT_BUDGET;
}

function isRankableApartment(apartment) {
  return !apartment.isExploration && !["low", "stale"].includes(apartment.priceAvailabilityConfidence);
}

function isTopThreeEligible(apartment) {
  return apartment.priceAvailabilityConfidence !== "stale";
}

function renderOutOfScope(answers) {
  showResultsPanel();
  setFeedbackMode("scope");
  const list = document.getElementById("results");
  const summary = document.getElementById("result-summary");
  const lang = activeLang();
  const campus = campusLabel(answers.campus, lang);
  summary.textContent = lang === "zh"
    ? `${unitTypeLabel(answers.unitType, lang)} / ${budgetLabel(answers.budget, answers.unitType, lang)} / ${campus} 这类需求当前不进入推荐池。`
    : `${unitTypeLabel(answers.unitType, lang)} / ${budgetLabel(answers.budget, answers.unitType, lang)} / ${campus} is outside the current recommendation pool.`;
  summary.classList.add("summary-warning");
  list.innerHTML = `
    <article class="result-card scope-card">
      <div class="card-top">
        <div>
          <div class="rank">${escapeHtml(ui("outOfScopeRank", lang))}</div>
          <h3>${escapeHtml(ui("outOfScopeTitle", lang))}</h3>
          <p class="subtitle">${escapeHtml(ui("outOfScopeSubtitle", lang))}</p>
        </div>
      </div>
      <div class="reason-grid">
        <div class="reason-box">
          <h4>${escapeHtml(ui("whyFiltered", lang))}</h4>
          <ul>${renderList(ui("whyFilteredItems", lang))}</ul>
        </div>
        <div class="reason-box">
          <h4>${escapeHtml(ui("stillCovered", lang))}</h4>
          <ul>${renderList(ui("stillCoveredItems", lang))}</ul>
        </div>
        <div class="reason-box">
          <h4>${escapeHtml(ui("laterScope", lang))}</h4>
          <ul>${renderList(ui("laterScopeItems", lang))}</ul>
        </div>
      </div>
      <div class="tags">
        <span class="tag warn">${escapeHtml(ui("noApartmentShown", lang))}</span>
        <span class="tag">${escapeHtml(ui("scopeBoundary", lang))}</span>
      </div>
    </article>
  `;
}

function topResultNames(results, lang = activeLang()) {
  if (!results.length) return ui("noTop3", lang);
  return results.slice(0, 3).map((result, index) => `${index + 1}. ${result.apartment.name}`).join("\n");
}

function formatAnswersForShare(answers, lang = activeLang()) {
  if (!answers) return lang === "zh" ? "还没有记录问卷答案。" : "No questionnaire answers captured yet.";
  const requirements = selectedHardRequirements(answers)
    .map(value => answerValueLabel("requirement", value, lang))
    .join(", ") || ui("none", lang);
  const preferences = (answers.preferences || (answers.priority || []).filter(value => !HARD_REQUIREMENT_PRIORITIES.has(value)))
    .map(value => answerValueLabel("priority", value, lang))
    .join(", ") || ui("none", lang);
  const labels = lang === "zh"
    ? {
      unitType: "户型",
      budget: "预算",
      campus: "常去地点",
      requirements: "主要需求",
      priorities: "其他关注点"
    }
    : {
      unitType: "Unit type",
      budget: "Budget",
      campus: "Main Yale area",
      requirements: "Main needs",
      priorities: "Other priorities"
    };
  return [
    labelLine(labels.unitType, unitTypeLabel(answers.unitType, lang), lang),
    labelLine(labels.budget, budgetLabel(answers.budget, answers.unitType, lang), lang),
    labelLine(labels.campus, campusLabel(answers.campus, lang), lang),
    labelLine(labels.requirements, requirements, lang),
    labelLine(labels.priorities, preferences, lang)
  ].join("\n");
}

function formatFeedbackAnswers(answers, entry, lang = activeLang()) {
  if (entry.startsWith("location_browse:")) {
    const campus = entry.split(":")[1] || answers?.campus;
    const label = lang === "zh" ? "常去地点" : "Main Yale area";
    return labelLine(label, campusLabel(campus, lang), lang);
  }
  return formatAnswersForShare(answers, lang);
}

function highMoveInCashCutoff(answers) {
  const amounts = APARTMENTS
    .filter(isRankableApartment)
    .map(apartment => calculateCosts(apartment, answers).moveInMin)
    .filter(Number.isFinite)
    .sort((a, b) => b - a);
  if (!amounts.length) return Infinity;
  const cutoffIndex = Math.max(0, Math.ceil(amounts.length * HIGH_MOVE_IN_CASH_TOP_SHARE) - 1);
  return amounts[cutoffIndex];
}

function renderMoveInChecks(apartment, answers, costs, lang = activeLang()) {
  const checks = [];
  if (costs.moveInMin >= highMoveInCashCutoff(answers)) {
    checks.push(lang === "zh" ? "入住前需准备的金额较高" : "Higher upfront amount");
  }
  const yaleBankStatementPath = apartment.applicationPolicy?.yaleCommunityBankStatementPath;
  const guarantor = apartment.applicationPolicy?.guarantorAccepted;
  if (yaleBankStatementPath?.value === true && yaleBankStatementPath.guarantorRequired === false && yaleBankStatementPath.coSignerRequired === false) {
    checks.push(lang === "zh"
      ? "Yale community 申请：无需 guarantor / co-signer，只需提供 bank statement"
      : "Yale community applications: no guarantor/co-signer required; only a bank statement is needed");
  } else if (!guarantor || guarantor.value === null || guarantor.confidence === "unknown") {
    checks.push(lang === "zh" ? "guarantor / co-signer 政策待核实" : "Guarantor / co-signer policy needs confirmation");
  } else if (guarantor.value === false) {
    checks.push(lang === "zh" ? "不接受 guarantor / co-signer" : "Guarantor / co-signer not accepted");
  }
  if (!checks.length) return "";
  return `<div class="move-in-checks">${checks.map(check => `<span>${escapeHtml(check)}</span>`).join("")}</div>`;
}

function hasStrongAmenities(apartment) {
  return amenityFeatureCount(apartment) >= STRONG_AMENITY_FEATURE_COUNT;
}

function mainNeedWarning(apartment, requirement, answers, labels) {
  const evidenceTier = requirementEvidenceTier(apartment, requirement, answers);
  if (evidenceTier === 2) return null;
  const score = scoreSetup(apartment, [requirement], answers);
  if (Number.isFinite(score) && score >= SCORE.HIGH) return null;

  const selection = Object.hasOwn(SETUP_TO_BUDGET_FEATURE, requirement)
    ? selectBudgetCandidate(apartment, { ...answers, setup: [requirement] }, { respectFeatures: true })
    : null;
  const explicitMiss = evidenceTier === 0 || selection?.compatibility === "incompatible" || score === SCORE.MISS;

  if (requirement === "laundry") return explicitMiss ? labels.laundryMiss : labels.laundryVerify;
  if (requirement === "wood_floor") return explicitMiss ? labels.woodFloorMiss : labels.woodFloorVerify;
  if (requirement === "private_space") return labels.privateSpaceVerify;
  if (requirement === "furniture_ready") return labels.furnitureReadyVerify;
  return null;
}

function ruleBadges(apartment, answers, lang = activeLang()) {
  const labels = ui("ruleTags", lang);
  const badges = [];
  const add = (label, level = "") => {
    if (label && !badges.some(badge => badge.label === label)) badges.push({ label, level });
  };

  const budgetState = budgetComparison(apartment, answers);
  if (budgetState?.overage > 0) add(labels.budgetOver(Math.ceil(budgetState.overage)), "warn");
  else if (budgetState?.requiresConcession) add(labels.budgetNeedsConcession, "warn");

  (answers.requirements || [])
    .filter(requirement => Object.hasOwn(SETUP_TO_BUDGET_FEATURE, requirement))
    .forEach(requirement => add(mainNeedWarning(apartment, requirement, answers, labels), "warn"));

  const campusScore = scoreCampus(apartment, answers.campus);
  if (answers.campus === "balanced" && campusScore >= BALANCED_REASON_MIN_SCORE) {
    add(labels.balancedFit, "good");
  } else if (answers.campus && campusScore >= 80) {
    add(labels.campusFit(campusLabel(answers.campus, lang)), "good");
  }

  (answers.priority || []).forEach(priority => {
    if (priority === "newer_building") {
      const openedYear = apartment.decisionSignals?.openedYear;
      const hasEvidence = Number.isFinite(openedYear) && apartment.decisionSignals?.openedYearConfidence;
      add(hasEvidence ? labels.newerBuilding(openedYear) : labels.newerBuildingVerify, hasEvidence ? "good" : "warn");
    }
    if (priority === "amenity_breadth") {
      const amenityCount = amenityFeatureCount(apartment);
      if (amenityCount >= STRONG_AMENITY_FEATURE_COUNT) add(labels.amenityStrong, "good");
      else if (amenityCount === 3) add(labels.amenityModerate);
      else add(labels.amenityLimited, "warn");
    }
    if (priority === "low_density") {
      const hasDensityEvidence = Number.isFinite(apartment.decisionSignals?.lowDensityScore) && apartment.decisionSignals?.lowDensitySource;
      add(hasDensityEvidence ? labels.densityLower : labels.densityVerify, hasDensityEvidence ? "good" : "warn");
    }
    if (priority === "access_late_route") {
      add(scoreAccessAndLateRoute(apartment) === SCORE.FULL ? labels.accessRouteStrong : labels.accessRoutePartial, scoreAccessAndLateRoute(apartment) === SCORE.FULL ? "good" : "warn");
    }
    if (priority === "parking") {
      const parkingSignal = apartment.decisionSignals?.parkingAvailability;
      const parkingAccess = apartment.decisionSignals?.parkingAccess;
      if (parkingAccess?.type === "adjacent_monthly_garage") add(labels.parkingAdjacent, "warn");
      else if (parkingAccess?.type === "none") add(labels.parkingNone, "warn");
      else if (parkingSignal === "official_ample_claim") add(labels.parkingAmple, "good");
      else if (parkingSignal === "no_onsite") add(labels.parkingNoOnsite, "warn");
      else if (scoreParking(apartment) >= SCORE.HIGH) add(labels.parkingAvailable, "warn");
      else add(labels.parkingVerify, "warn");
    }
    if (priority === "pet_friendly") {
      const petPolicy = apartment.decisionSignals?.petPolicy;
      const petScore = scorePetPolicy(apartment, answers.petType || null);
      add(petScore >= SCORE.HIGH ? labels.petPolicyFound(petPolicy) : labels.petPolicyVerify, petScore >= SCORE.HIGH ? "good" : "warn");
    }
    if (priority === "concession") {
      const discount = concessionDiscountPercent(apartment, budgetUnitTypeSelection(answers).resolved);
      if (discount > 0) add(labels.concessionStrong(discount), "good");
      else if (apartment.decisionSignals?.concessionAvailability === "limited_not_scored") add(labels.concessionNone, "warn");
      else add(labels.concessionVerify, "warn");
    }
    if (priority === "yale_shuttle") {
      const hasShuttleEvidence = Number.isFinite(apartment.decisionSignals?.yaleShuttleScore) && apartment.decisionSignals?.yaleShuttleSource;
      add(hasShuttleEvidence ? labels.shuttleFound : labels.shuttleVerify, hasShuttleEvidence ? "good" : "warn");
    }
    if (priority === "application") {
      const hasApplicationEvidence = !["low", "unknown", "stale"].includes(apartment.applicationConfidence);
      const lowerFriction = hasApplicationEvidence && apartment.applicationFriction <= 3;
      add(lowerFriction ? labels.applicationLower : labels.applicationVerify, lowerFriction ? "good" : "warn");
    }
    if (priority === "food_store") {
      add(apartment.dailyTags.includes("food_store") ? labels.localServices : labels.localServicesVerify, apartment.dailyTags.includes("food_store") ? "good" : "warn");
    }
    if (priority === "quiet_routine") {
      const hasQuietEvidence = Boolean(apartment.decisionSignals?.quietSource);
      const quietStrong = hasQuietEvidence && apartment.quietScore >= 75;
      add(quietStrong ? labels.quietStrong : labels.quietVerify, quietStrong ? "good" : "warn");
    }
    if (priority === "roommate") {
      add(apartment.roommateFit >= 4 ? labels.roommateFriendly : labels.roommateVerify, apartment.roommateFit >= 4 ? "good" : "warn");
    }
  });

  if (answers.utilities === "predictable" && apartment.utilities === "predictable") add(labels.utilitiesPredictable, "good");
  if ((answers.priority || []).includes("true_cost") && calculateCosts(apartment, answers).moveInMin >= highMoveInCashCutoff(answers)) {
    add(labels.moveInHigh, "warn");
  }

  return badges.slice(0, 5);
}

function renderRuleBadges(apartment, answers, lang = activeLang()) {
  return ruleBadges(apartment, answers, lang)
    .map(badge => `<span class="tag ${escapeHtml(badge.level)}">${escapeHtml(badge.label)}</span>`)
    .join("");
}

function getInputValue(id) {
  const input = document.getElementById(id);
  return input ? input.value.trim() : "";
}

function setFeedbackMode(mode = "results") {
  if (typeof document === "undefined") return;
  const lang = activeLang();
  const text = (FEEDBACK_FORM_TEXT[lang] || FEEDBACK_FORM_TEXT.en)[mode];
  const label = document.getElementById("feedback-accuracy-label");
  const select = document.getElementById("feedback-accuracy");
  const missingField = document.getElementById("feedback-missing-field");
  if (label) label.textContent = text.label;
  if (select) {
    select.innerHTML = text.options.map(option => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("");
  }
  if (missingField) missingField.hidden = mode !== "results";
}

function buildFeedbackText({
  answers,
  results = [],
  entry = "default",
  accuracy,
  missing,
  note,
  lang = activeLang(),
  hasResults = results.length > 0
} = {}) {
  const outcome = accuracy || ui("notSpecified", lang);
  const missingItems = missing || ui("none", lang);
  const improvement = note || ui("none", lang);
  const isLocationBrowse = entry.startsWith("location_browse:");
  const resultHeading = isLocationBrowse
    ? ui("feedbackLocationTop", lang)
    : (hasResults ? ui("feedbackTop", lang) : ui("feedbackScopeTop", lang));
  const outcomeLabel = isLocationBrowse
    ? ui("feedbackLocationAccuracy", lang)
    : (hasResults ? ui("feedbackAccuracy", lang) : ui("feedbackScopeAccuracy", lang));
  return [
    ui("feedbackTitle", lang),
    labelLine(ui("feedbackEntry", lang), entryLabel(entry, lang), lang),
    "",
    ui("feedbackAnswers", lang),
    formatFeedbackAnswers(answers, entry, lang),
    "",
    resultHeading,
    topResultNames(results, lang),
    "",
    labelLine(outcomeLabel, outcome, lang),
    ...(hasResults && !isLocationBrowse ? [labelLine(ui("feedbackMissing", lang), missingItems, lang)] : []),
    labelLine(ui("feedbackImprove", lang), improvement, lang),
    "",
    ui("feedbackNote", lang)
  ].join("\n");
}

function feedbackText() {
  const lang = activeLang();
  return buildFeedbackText({
    answers: latestAnswers,
    results: latestResults,
    entry: latestEntry,
    accuracy: getInputValue("feedback-accuracy"),
    missing: getInputValue("feedback-missing"),
    note: getInputValue("feedback-note"),
    lang
  });
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }
  textarea.remove();
  return copied;
}

async function copyWithClipboardApi(text, timeoutMs = 1200) {
  if (!navigator.clipboard || !window.isSecureContext) return false;
  return Promise.race([
    navigator.clipboard.writeText(text).then(() => true, () => false),
    new Promise(resolve => window.setTimeout(() => resolve(false), timeoutMs))
  ]);
}

async function copyFeedback(statusId) {
  const status = document.getElementById(statusId);
  const preview = document.getElementById("feedback-preview");
  const lang = activeLang();
  const text = feedbackText();
  if (status) status.textContent = ui("feedbackCopying", lang);
  if (preview) {
    preview.value = text;
    preview.hidden = true;
  }
  let copied = copyTextFallback(text);
  if (!copied) copied = await copyWithClipboardApi(text);
  if (status) status.textContent = ui(copied ? "feedbackCopied" : "feedbackCopyFailed", lang);
  if (preview) {
    preview.hidden = copied;
    if (!copied) {
      preview.focus();
      preview.select();
    }
  }
}

const FIELD_GUIDE_TEXT = Object.freeze({
  en: {
    needsTitle: "What you told us", needsHome: "Unit and budget", needsCampus: "Main destination",
    needsRequirements: "Main needs", needsPreferences: "Also matters", noneSelected: "No preference selected",
    monthlyCost: "Estimated total monthly spending", monthlyAfterSpecial: "Estimated total monthly after special", beforeSpecial: "total before special",
    housingBudgetBasis: "Housing-cost budget basis", location: "Location", utilities: "Utilities", moveIn: "Upfront",
    included: "included", tenantPays: "tenant-paid", verify: "needs verification", balancedLocation: "Balanced Yale-area access",
    why: "Why it is worth a closer look", tradeoff: "Most important trade-off", officialEvidence: "Official property sources",
    checked: "Checked", reportClosed: "+ View the full verification report and details", reportOpen: "- Close full analysis",
    priceMath: "How the monthly cost is calculated", selectedPrice: "Selected-unit rent",
    estimatedMonthly: "Estimated total monthly spending", moveInBreakdown: "Upfront payments", moveInTotal: "Estimated upfront total",
    needsCheck: "Main-needs check", currentInfoSupports: "Consistent with the current evidence", noMainNeeds: "No main need was selected.",
    scoreBreakdown: "Fit score lives here",
    scoreNote: "The score explains differences within a location tier. It does not replace the monthly cost, exact-unit condition, or application eligibility.",
    beforeApplying: "Questions to ask before applying", sources: "Sources", applicationPolicy: "application policy",
    exactUnitConfiguration: "exact-unit configuration", quietness: "quietness",
    quietUnitSpecific: "Quietness needs to be checked by floor, orientation, and exact unit.",
    overBudget: (amount, total) => `The housing-cost basis is about ${formatMoney(amount)}/mo above your ceiling; estimated total monthly spending is ${formatMoney(total)}.`,
    unitPriceUnavailable: unitType => `No comparable current ${unitType} price is available yet.`,
    concessionDependency: "This option only fits the selected budget after the current concession; confirm the exact unit, lease, and move-in eligibility.",
    weakLocation: campus => `The location fit for ${campus} is weaker than the options above it.`,
    higherUpfront: amount => `Estimated upfront payments are relatively high at about ${formatMoney(amount)}.`,
    utilityUncertain: "Several utility billing items still need confirmation before the total monthly cost is predictable.",
    unknownGroupLabels: { utilities: "Utilities", exactUnit: "exact unit", feesPolicy: "fees/application", lifestyle: "living experience" },
    unknownGroupSummary: groups => `${groups.map(group => `${group.label} ${group.count}`).join(" · ")} need verification`
  },
  zh: {
    needsTitle: "你刚才说的是", needsHome: "户型与预算", needsCampus: "常去地点", needsRequirements: "主要需求",
    needsPreferences: "比较在意", noneSelected: "暂未选择", monthlyCost: "每月总支出估算", monthlyAfterSpecial: "优惠后每月总支出估算",
    beforeSpecial: "优惠前总支出", housingBudgetBasis: "预算比较口径", location: "位置", utilities: "水电网", moveIn: "签约入住前", included: "已包含",
    tenantPays: "租客自付", verify: "待核实", balancedLocation: "主要校区通勤参考", why: "为什么值得先看",
    tradeoff: "最重要的取舍", officialEvidence: "官网资料", checked: "核对", reportClosed: "＋ 查看完整核实报告与各项明细",
    reportOpen: "－ 收起完整分析", priceMath: "每月总支出怎么得出", selectedPrice: "所选户型租金",
    estimatedMonthly: "每月总支出估算", moveInBreakdown: "签约入住前付款", moveInTotal: "预计付款", needsCheck: "主要需求核对",
    currentInfoSupports: "与当前资料相符", noMainNeeds: "没有选择主要需求。", scoreBreakdown: "匹配分放在这里",
    scoreNote: "分数用于解释同一位置档位内的差异，不替代月成本、具体房间状态或申请资格。",
    beforeApplying: "申请前最值得问清楚", sources: "资料来源", applicationPolicy: "申请政策", exactUnitConfiguration: "具体房间配置",
    quietness: "安静度",
    quietUnitSpecific: "安静度需按楼层、朝向和具体房间核实。",
    overBudget: (amount, total) => `住房费口径高于预算上限约 ${formatMoney(amount)}/月；计入电费、网络和保险等项目后，每月总支出估算为 ${formatMoney(total)}。`,
    unitPriceUnavailable: unitType => `目前还没有可比较的 ${unitType} 价格。`,
    concessionDependency: "只有计入当前优惠后才在所选预算内；需确认具体房源、租期和入住日期是否符合条件。",
    weakLocation: campus => `去 ${campus} 的位置匹配较弱。`,
    higherUpfront: amount => `签约入住前预计付款较高，约 ${formatMoney(amount)}。`,
    utilityUncertain: "还有多项水电网计费方式待核实，总支出暂时不够稳定。",
    unknownGroupLabels: { utilities: "水电网", exactUnit: "具体房间", feesPolicy: "费用/申请", lifestyle: "居住体验" },
    unknownGroupSummary: groups => `${groups.map(group => `${group.label} ${group.count} 项`).join(" · ")}待核实`
  }
});

const FIELD_GUIDE_REASON_COPY = Object.freeze({
  en: {
    campus: (campus, score) => `${score >= 100 ? "Excellent" : "Good"} location fit for ${campus}`,
    balanced: "More even access across the four main Yale areas",
    budget: "the reviewed housing-cost basis stays within your budget",
    budgetWithSpecial: "the reviewed housing-cost basis stays within budget after the current special",
    setup: label => `the selected-unit evidence supports ${label.toLowerCase()}`,
    parking: "a confirmed onsite or next-door monthly parking option is available",
    pet: "the pet policy fits the pet you selected",
    priority: {
      true_cost: "the current fee structure is relatively easier to budget",
      utilities_predictable: "more utility inclusions are already known",
      amenity_breadth: "the building amenities align with your preference",
      newer_building: "the building age or finishes align with your preference",
      application: "Yale community applicants can use the verified bank-statement path",
      concession: "a current move-in special is reflected in the comparison",
      food_store: "restaurants and groceries are easier to reach",
      quiet_routine: "the available evidence supports a quieter routine"
    },
    fallback: "The current price and location evidence make this worth comparing"
  },
  zh: {
    campus: (campus, score) => `去 ${campus} 的位置匹配${score >= 100 ? "极佳" : "良好"}`,
    balanced: "在四个主要 Yale 校区之间通勤更均衡",
    budget: "官网租金和必选楼费在你的预算内",
    budgetWithSpecial: "计入当前优惠后，官网租金和必选楼费在你的预算内",
    setup: label => `当前具体房源资料支持“${label}”`,
    parking: "有已确认的楼内或隔壁月租停车方案",
    pet: "宠物政策与你选择的宠物相符",
    priority: {
      true_cost: "目前的费用结构相对更容易做预算",
      utilities_predictable: "已确认的水电网包含项更多",
      amenity_breadth: "楼内设施更符合你的偏好",
      newer_building: "楼龄或装修更符合你的偏好",
      application: "Yale community 可使用已核实的 bank statement 申请路径",
      concession: "当前比较已计入住优惠",
      food_store: "吃饭买菜更方便",
      quiet_routine: "现有资料更支持安静需求"
    },
    fallback: "目前的价格和位置资料值得进一步比较"
  }
});

const FIELD_GUIDE_PROPERTY_TRADEOFFS = Object.freeze({
  en: {
    "360-state": "Required building fees, insurance, and optional parking can push total monthly spending higher; water and HVAC billing still need confirmation.",
    "olive-wooster": "The exact unit price and concession eligibility can change with availability.",
    "the-taft": "Laundry, flooring, and unit condition need to be checked for the exact apartment.",
    "the-archive": "Official total-monthly price ranges vary widely by unit and lease term.",
    "estelle": "Several utility and fee details still need confirmation before total monthly spending is firm.",
    "axis-201": "Laundry, flooring, and furniture status still need exact-unit confirmation.",
    "the-audubon": "Ask which charges are included in the published Estimated Monthly Cost.",
    "new-haven-towers": "The four buildings differ in price, location, parking, and amenities; compare the exact tower.",
    "pierpont-city-crossing": "Utilities, parking, and exact-unit configuration still need confirmation.",
    "the-whit": "The larger amenity set can come with higher utility and optional parking costs.",
    "anthem-square10": "HVAC, water/sewer, and exact-unit configuration still need confirmation."
  },
  zh: {
    "360-state": "固定楼费、保险和可选停车会推高总支出；水费和暖通计费仍待核实。",
    "olive-wooster": "具体房源价格和优惠资格会随 availability 变化。",
    "the-taft": "洗烘、地板和房况要按具体房间确认。",
    "the-archive": "官网总月价区间跨度较大，具体房源和租期会明显改变价格。",
    "estelle": "水电暖和部分费用仍待核实，总支出暂时不能完全确定。",
    "axis-201": "洗烘、地板和家具状态仍需按具体房间确认。",
    "the-audubon": "申请前要问清楚 Estimated Monthly Cost 具体包含哪些费用。",
    "new-haven-towers": "四栋楼的价格、位置、停车和设施略有不同，需要按具体楼栋比较。",
    "pierpont-city-crossing": "水电暖、停车和具体房间配置仍需确认。",
    "the-whit": "楼内设施较多，但水电网和可选停车会增加总支出。",
    "anthem-square10": "暖通、水费和具体房间配置仍待核实。"
  }
});

// Map output is evidence-gated just like price and policy data. The current
// route/origin review queue has no approved rows, so production renders no map.
const REVIEWED_SPATIAL_REFERENCES = Object.freeze({});

function fieldGuideText(key, lang = activeLang()) {
  return (FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en)[key];
}

function fieldGuideSpatialReference(viewModels, answers) {
  const reference = REVIEWED_SPATIAL_REFERENCES[answers?.campus];
  if (!reference || reference.reviewStatus !== "approved") return null;
  const markers = viewModels.map(viewModel => reference.properties?.[viewModel.apartment.id]);
  if (markers.some(marker => !marker || marker.reviewStatus !== "approved")) return null;
  return { reference, markers };
}

function fieldGuideUnknownEvidence(apartment, answers, costs, selection, lang = activeLang()) {
  const groupedItems = new Map([
    ["utilities", []],
    ["exactUnit", []],
    ["feesPolicy", []],
    ["lifestyle", []]
  ]);
  const add = (value, group) => {
    if (!value || !groupedItems.has(group)) return;
    const items = groupedItems.get(group);
    if (!items.includes(value)) items.push(value);
  };
  (utilityProfile(apartment).verify || []).forEach(item => add(utilityItemLabel(item, lang), "utilities"));
  const labels = ui("ruleTags", lang);
  (answers.requirements || [])
    .filter(requirement => Object.hasOwn(SETUP_TO_BUDGET_FEATURE, requirement))
    .forEach(requirement => {
      if (mainNeedWarning(apartment, requirement, answers, labels)) add(answerValueLabel("requirement", requirement, lang), "exactUnit");
    });
  if (selection.compatibility === "unknown_feature_compatibility" && !groupedItems.get("exactUnit").length) {
    add(fieldGuideText("exactUnitConfiguration", lang), "exactUnit");
  }
  costs.excluded.forEach(key => add(costItemLabel(key, lang), "feesPolicy"));
  if (["unknown", "low", "partial_public", "stale"].includes(apartment.applicationConfidence)) {
    add(fieldGuideText("applicationPolicy", lang), "feesPolicy");
  }
  if ((answers.priority || []).includes("quiet_routine") && !apartment.decisionSignals?.quietSource) {
    add(fieldGuideText("quietness", lang), "lifestyle");
  }
  const labelsByGroup = fieldGuideText("unknownGroupLabels", lang);
  const groups = [...groupedItems.entries()]
    .filter(([, items]) => items.length)
    .map(([key, items]) => ({ key, label: labelsByGroup[key], count: items.length, items }));
  return { items: groups.flatMap(group => group.items), groups };
}

function fieldGuideUtilitySummary(apartment, lang = activeLang()) {
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const profile = utilityProfile(apartment);
  const labels = key => utilityItemLabel(key, lang);
  const included = (profile.included || []).map(labels);
  const tenantPays = (profile.tenantPays || []).map(labels);
  const verify = (profile.verify || []).map(labels);
  const compact = items => items.length <= 2
    ? items.join(lang === "zh" ? "、" : ", ")
    : (lang === "zh" ? `${items.slice(0, 2).join("、")}等` : `${items.slice(0, 2).join(", ")}, and more`);
  let primary = text.verify;
  const details = [];
  if (included.length) {
    primary = `${compact(included)} ${text.included}`;
    if (tenantPays.length) details.push(`${compact(tenantPays)} ${text.tenantPays}`);
  } else if (tenantPays.length) {
    primary = `${compact(tenantPays)} ${text.tenantPays}`;
  }
  if (verify.length) details.push(`${compact(verify)} ${text.verify}`);
  return { primary, detail: details.join(lang === "zh" ? "；" : "; ") };
}

function fieldGuideWhy(viewModel) {
  const { apartment, result, answers, lang } = viewModel;
  const copy = FIELD_GUIDE_REASON_COPY[lang] || FIELD_GUIDE_REASON_COPY.en;
  const clauses = [];
  const add = value => {
    if (value && !clauses.includes(value)) clauses.push(value);
  };
  const campusScore = scoreCampus(apartment, answers.campus);
  if (answers.campus === "balanced" && campusScore >= BALANCED_REASON_MIN_SCORE) {
    add(copy.balanced);
  } else if (answers.campus && campusScore >= 80) {
    add(copy.campus(campusLabel(answers.campus, lang), campusScore));
  }

  for (const requirement of answers.requirements || []) {
    if (!activeHardRequirements(answers).includes(requirement)) continue;
    if (requirementEvidenceTier(apartment, requirement, answers) !== 2) continue;
    if (requirement === "parking") add(copy.parking);
    else if (requirement === "pet_friendly") add(copy.pet);
    else add(copy.setup(answerValueLabel("requirement", requirement, lang)));
    break;
  }

  const supportedPreference = (answers.preferences || [])
    .map(preference => ({
      preference,
      score: preference === "utilities_predictable"
        ? scoreUtilities(apartment, "predictable")
        : scoreSinglePriority(apartment, preference, answers)
    }))
    .filter(item => Number.isFinite(item.score) && item.score >= SCORE.HIGH)
    .filter(item => item.preference !== "quiet_routine" || apartment.decisionSignals?.quietSource)
    .sort((a, b) => b.score - a.score)[0];
  if (supportedPreference) add(copy.priority[supportedPreference.preference]);

  const comparison = budgetComparison(apartment, answers);
  if (comparison && comparison.overage === 0) {
    add(comparison.concessionCredit > 0 ? copy.budgetWithSpecial : copy.budget);
  }

  if (!clauses.length) add(result.score >= SCORE.HIGH ? copy.fallback : viewModel.reasons[0] || copy.fallback);
  return sentenceEnding(clauses.slice(0, 2).join(lang === "zh" ? "；" : "; "), lang);
}

function fieldGuideTradeoff(viewModel) {
  const { apartment, answers, costs, selection, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const comparison = budgetComparison(apartment, answers);
  if (comparison?.overage > 0) return text.overBudget(Math.ceil(comparison.overage), Math.ceil(costs.trueMonthlyMax));
  const labels = ui("ruleTags", lang);
  for (const requirement of answers.requirements || []) {
    if (requirementEvidenceTier(apartment, requirement, answers) !== 0) continue;
    const warning = Object.hasOwn(SETUP_TO_BUDGET_FEATURE, requirement)
      ? mainNeedWarning(apartment, requirement, answers, labels)
      : lang === "zh"
        ? `“${answerValueLabel("requirement", requirement, lang)}”与当前资料不符`
        : `The current evidence conflicts with ${answerValueLabel("requirement", requirement, lang).toLowerCase()}`;
    if (warning) return sentenceEnding(warning, lang);
  }
  if (!comparison) return text.unitPriceUnavailable(unitTypeLabel(answers.unitType, lang));
  if (comparison.requiresConcession) return text.concessionDependency;
  if (answers.campus && answers.campus !== "balanced" && scoreCampus(apartment, answers.campus) <= 40) {
    return text.weakLocation(campusLabel(answers.campus, lang));
  }
  if (costs.moveInMin >= highMoveInCashCutoff(answers)) return text.higherUpfront(Math.ceil(costs.moveInMin));
  if ((answers.preferences || []).some(value => ["true_cost", "utilities_predictable"].includes(value)) && (utilityProfile(apartment).verify || []).length >= 2) {
    return text.utilityUncertain;
  }
  if (selection.compatibility === "incompatible") {
    return lang === "zh" ? "所选房型与至少一项主要需求不符。" : "The selected unit type conflicts with at least one main need.";
  }
  return (FIELD_GUIDE_PROPERTY_TRADEOFFS[lang] || FIELD_GUIDE_PROPERTY_TRADEOFFS.en)[apartment.id]
    || (lang === "zh" ? "具体房源和费用仍需申请前核实。" : "Confirm the exact unit and fees before applying.");
}

function buildResultViewModel(result, index, top, answers, lang = activeLang()) {
  const apartment = result.apartment;
  const copy = apartmentCopy(apartment, lang);
  const costs = calculateCosts(apartment, answers);
  const selection = selectBudgetCandidate(apartment, answers, { respectFeatures: true });
  const candidate = selection.candidate;
  const evidence = apartmentEvidence(apartment);
  const flooringDisplay = splitCardDisplay(copy.flooring, "flooring", lang);
  const sourceDisplay = splitCardDisplay(copy.sourceLabel, "source", lang);
  const concessionDisplay = splitCardDisplay(copy.concession, "concession", lang);
  const footnotes = [];
  const flooringMarker = addCardFootnote(footnotes, flooringDisplay.note);
  const sourceMarker = addCardFootnote(footnotes, sourceDisplay.note);
  const concessionNote = copy.concession
    ? (CARD_FOOTNOTE_TEXT[lang] || CARD_FOOTNOTE_TEXT.en)[costs.concessionApplied ? "concessionIncluded" : "concessionExcluded"]
    : "";
  const concessionMarker = addCardFootnote(footnotes, concessionNote);
  const unknownEvidence = fieldGuideUnknownEvidence(apartment, answers, costs, selection, lang);
  return {
    result, apartment, copy, costs, selection, candidate, answers, lang,
    evidence: {
      sourceUrls: [...new Set([candidate?.sourceUrl, ...evidence.urls].filter(Boolean))].slice(0, 3),
      checkedDate: [candidate?.checkedDate, evidence.checkedDate].filter(Boolean).sort().at(-1) || null,
      unknowns: unknownEvidence.items,
      unknownGroups: unknownEvidence.groups
    },
    flooringDisplay, sourceDisplay, concessionDisplay, footnotes, flooringMarker, sourceMarker, concessionMarker,
    priceTag: priceStatus(apartment, lang, answers), ruleBadges: ruleBadges(apartment, answers, lang),
    reasons: topReasons(result, lang, answers), sameScoreCount: top.filter(other => other.score === result.score).length,
    campusTier: campusFitTierLabel(apartment, answers.campus, lang), rankNumber: index + 1
  };
}

function buildResultViewModels(top, answers, lang = activeLang()) {
  return top.map((result, index) => buildResultViewModel(result, index, top, answers, lang));
}

function renderNeedsSummary(answers, lang = activeLang()) {
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const requirements = (answers.requirements || []).map(value => {
    const label = answerValueLabel("requirement", value, lang);
    if (!Object.hasOwn(SETUP_TO_BUDGET_FEATURE, value) || requirementEvidenceCoverage(value, answers).active) {
      return label;
    }
    return lang === "zh"
      ? `${label}（已记录；资料不足，暂不影响排序）`
      : `${label} (recorded; not ranked until evidence coverage improves)`;
  });
  const preferences = (answers.preferences || []).map(value => {
    const label = answerValueLabel("priority", value, lang);
    if (!["quiet_routine", "yale_shuttle", "low_density"].includes(value) || preferenceEvidenceCoverage(value).active) {
      return label;
    }
    return lang === "zh"
      ? `${label}（已记录；资料不足，暂不影响排序）`
      : `${label} (recorded; not ranked until evidence coverage improves)`;
  });
  return `
    <section class="needs-summary" aria-label="${escapeHtml(text.needsTitle)}">
      <h3>${escapeHtml(text.needsTitle)}</h3>
      <dl>
        <div><dt>${escapeHtml(text.needsHome)}</dt><dd><span class="data">${escapeHtml(unitTypeLabel(answers.unitType, lang))}</span> · <span class="data">${escapeHtml(budgetLabel(answers.budget, answers.unitType, lang))}</span></dd></div>
        <div><dt>${escapeHtml(text.needsCampus)}</dt><dd>${escapeHtml(campusLabel(answers.campus, lang))}</dd></div>
        <div><dt>${escapeHtml(text.needsRequirements)}</dt><dd>${escapeHtml(requirements.join(" · ") || text.noneSelected)}</dd></div>
        <div><dt>${escapeHtml(text.needsPreferences)}</dt><dd>${escapeHtml(preferences.join(" · ") || text.noneSelected)}</dd></div>
      </dl>
    </section>`;
}

function renderFieldGuideCostRows(items, lang, { credit = false } = {}) {
  return items.map(item => {
    const amount = Number.isFinite(item.maxAmount) && item.maxAmount !== item.amount ? formatMoneyRange(item.amount, item.maxAmount) : formatMoney(item.amount);
    return `<div><dt>${escapeHtml(costItemLabel(item.key, lang))}</dt><dd><span class="data">${credit || item.isCredit ? "-" : ""}${escapeHtml(amount)}</span><small>${escapeHtml(costConfidenceLabel(item.confidence, lang))}</small></dd></div>`;
  }).join("");
}

function renderFieldGuideCostReport(viewModel) {
  const { costs, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const concession = costs.concessionApplied && costs.concessionLine ? [costs.concessionLine] : [];
  return `
    <section><h4>${escapeHtml(text.priceMath)}</h4>
      <dl class="field-report-list">
        <div><dt>${escapeHtml(text.selectedPrice)}</dt><dd><span class="data">${escapeHtml(formatMoney(costs.baseRent))}</span></dd></div>
        ${renderFieldGuideCostRows(costs.monthlyItems, lang)}${renderFieldGuideCostRows(concession, lang, { credit: true })}
        <div class="report-total"><dt>${escapeHtml(text.estimatedMonthly)}</dt><dd><span class="data">${escapeHtml(formatMoneyRange(costs.trueMonthlyMin, costs.trueMonthlyMax))}</span></dd></div>
      </dl>
      <h5>${escapeHtml(text.moveInBreakdown)}</h5>
      <dl class="field-report-list">${renderFieldGuideCostRows(costs.moveInItems, lang)}<div class="report-total"><dt>${escapeHtml(text.moveInTotal)}</dt><dd><span class="data">${escapeHtml(formatMoneyRange(costs.moveInMin, costs.moveInMax))}</span></dd></div></dl>
    </section>`;
}

function renderFieldGuideUtilities(viewModel) {
  const { apartment, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const profile = utilityProfile(apartment);
  const rows = [...(profile.included || []).map(item => ({ item, status: "included" })), ...(profile.tenantPays || []).map(item => ({ item, status: "tenantPays" })), ...(profile.verify || []).map(item => ({ item, status: "verify" }))];
  const status = row => row.item === "air_conditioning_most_units" && row.status === "included"
    ? (lang === "zh" ? "（多数房间）已包含" : "Included in most units")
    : row.status === "included" ? text.included : row.status === "tenantPays" ? text.tenantPays : text.verify;
  return `<section><h4>${escapeHtml(text.utilities)}</h4><dl class="field-report-list">${rows.map(row => `<div><dt>${escapeHtml(utilityItemLabel(row.item, lang))}</dt><dd class="${row.status === "verify" ? "verify-text" : ""}">${escapeHtml(status(row))}</dd></div>`).join("")}</dl></section>`;
}

function renderFieldGuideNeeds(viewModel) {
  const { apartment, answers, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const labels = ui("ruleTags", lang);
  const rows = (answers.requirements || []).map(requirement => {
    const warning = mainNeedWarning(apartment, requirement, answers, labels);
    return `<div><dt>${escapeHtml(answerValueLabel("requirement", requirement, lang))}</dt><dd class="${warning ? "verify-text" : ""}">${escapeHtml(warning ? sentenceEnding(warning, lang) : text.currentInfoSupports)}</dd></div>`;
  }).join("");
  return `<section><h4>${escapeHtml(text.needsCheck)}</h4>${rows ? `<dl class="field-report-list">${rows}</dl>` : `<p class="report-note">${escapeHtml(text.noMainNeeds)}</p>`}</section>`;
}

function renderFieldGuideScore(viewModel) {
  const { result, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  return `<section><h4>${escapeHtml(text.scoreBreakdown)}</h4><div class="score-line"><span>${escapeHtml(ui("scoreLabel", lang))}</span><strong class="data">${result.score} / 100</strong></div><dl class="field-report-list compact-score-list">${Object.entries(result.breakdown).map(([key, value]) => `<div><dt>${escapeHtml(categoryLabel(key, lang))}</dt><dd class="data">${Math.round(value)} / 100</dd></div>`).join("")}</dl><p class="report-note">${escapeHtml(text.scoreNote)}</p></section>`;
}

function sourceDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

function renderFieldGuideSources(viewModel) {
  const { evidence, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  if (!evidence.sourceUrls.length && !evidence.checkedDate) return "";
  return `<footer class="report-source"><span>${escapeHtml(text.sources)}</span>${evidence.sourceUrls.map(url => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceDomain(url))}</a>`).join("")}${evidence.checkedDate ? `<span>${escapeHtml(text.checked)} <span class="data">${escapeHtml(evidence.checkedDate)}</span></span>` : ""}</footer>`;
}

function renderFieldGuideCard(viewModel) {
  const { apartment, copy, costs, candidate, selection, result, rankNumber, campusTier, evidence, answers, lang } = viewModel;
  const text = FIELD_GUIDE_TEXT[lang] || FIELD_GUIDE_TEXT.en;
  const utilities = fieldGuideUtilitySummary(apartment, lang);
  const unknownSummary = evidence.unknownGroups.length ? text.unknownGroupSummary(evidence.unknownGroups) : confidenceSummaryLabel(apartment, lang);
  const meta = [unitTypeLabel(candidate?.unitType || selection.unitType.resolved, lang), Number.isFinite(candidate?.sqftMin) ? `${candidate.sqftMin} sqft` : "", candidate?.comparisonLeaseMonths ? `${candidate.comparisonLeaseMonths}${lang === "zh" ? " 个月" : " months"}` : "", candidate?.subBuildingId ? subBuildingLabel(candidate.subBuildingId) : ""].filter(Boolean);
  const locationPrimary = campusTier || text.balancedLocation;
  const locationDetail = campusLabel(answers.campus, lang);
  const why = fieldGuideWhy(viewModel);
  const tradeoff = fieldGuideTradeoff(viewModel);
  const titleId = `field-guide-${apartment.id}-${rankNumber}`;
  const grossLine = costs.concessionApplied ? `<span class="data">${escapeHtml(formatMoneyRange(costs.grossMonthlyMin, costs.grossMonthlyMax))}</span> ${escapeHtml(text.beforeSpecial)}` : "";
  const comparison = budgetComparison(apartment, answers);
  const budgetBasisLine = comparison
    ? `${escapeHtml(text.housingBudgetBasis)} <span class="data">${escapeHtml(formatMoney(comparison.effectiveCost))}</span>${comparison.concessionCredit > 0 ? escapeHtml(lang === "zh" ? "（已计入当前优惠）" : " after current special") : ""}`
    : escapeHtml(text.unitPriceUnavailable(unitTypeLabel(answers.unitType, lang)));
  const candidateIdentity = [candidate?.trace?.unitId, candidate?.trace?.floorplanId].filter(Boolean).join(" · ");
  const moveInItems = costs.moveInItems.map(item => costItemLabel(item.key, lang)).join(lang === "zh" ? "、" : ", ");
  return `
    <article class="result-card field-guide-card" aria-labelledby="${escapeHtml(titleId)}">
      <header class="field-card-heading"><span class="result-number data">${String(rankNumber).padStart(2, "0")}</span><div class="property-heading"><p class="result-context">${escapeHtml(locationDetail)} · ${escapeHtml(locationPrimary)}</p><h3 id="${escapeHtml(titleId)}">${escapeHtml(apartment.name)}</h3><p>${escapeHtml(copy.area)}</p></div><div class="monthly-cost"><span>${escapeHtml(costs.concessionApplied ? text.monthlyAfterSpecial : text.monthlyCost)}</span><strong><span class="data">${escapeHtml(formatMoneyRange(costs.trueMonthlyMin, costs.trueMonthlyMax))}</span><small>${escapeHtml(lang === "zh" ? " / 月" : " / mo")}</small></strong><p class="budget-basis-line">${budgetBasisLine}</p><p>${[grossLine, ...meta.map(item => `<span class="data">${escapeHtml(item)}</span>`)].filter(Boolean).join(" · ")}</p></div></header>
      <div class="comparison-strip" aria-label="${escapeHtml(lang === "zh" ? "关键比较信息" : "Key comparison information")}"><div><span class="strip-label">${escapeHtml(text.location)}</span><strong>${escapeHtml(locationPrimary)}</strong><p>${escapeHtml(locationDetail)}</p></div><div><span class="strip-label">${escapeHtml(text.utilities)}</span><strong>${escapeHtml(utilities.primary)}</strong><p class="${(utilityProfile(apartment).verify || []).length ? "verify-text" : ""}">${escapeHtml(utilities.detail)}</p></div><div><span class="strip-label">${escapeHtml(text.moveIn)}</span><strong><span class="data">${escapeHtml(formatMoneyRange(costs.moveInMin, costs.moveInMax))}</span></strong><p>${escapeHtml(moveInItems)}</p></div></div>
      <div class="decision-lines"><div><span>${escapeHtml(text.why)}</span><p>${escapeHtml(why)}</p></div><div><span>${escapeHtml(text.tradeoff)}</span><p>${escapeHtml(tradeoff)}</p></div></div>
      <p class="evidence-line"><span class="verified-text">${escapeHtml(text.officialEvidence)}</span>${evidence.checkedDate ? `<span>${escapeHtml(text.checked)} <span class="data">${escapeHtml(evidence.checkedDate)}</span></span>` : ""}<span class="${evidence.unknowns.length ? "verify-text" : "verified-text"}">${escapeHtml(unknownSummary)}</span></p>
      <details class="full-report"><summary><span class="summary-closed">${escapeHtml(text.reportClosed)}</span><span class="summary-open">${escapeHtml(text.reportOpen)}</span></summary><div class="report-body">${renderFieldGuideCostReport(viewModel)}${renderFieldGuideUtilities(viewModel)}${renderFieldGuideNeeds(viewModel)}${renderFieldGuideScore(viewModel)}<section class="report-wide"><h4>${escapeHtml(text.beforeApplying)}</h4><ol class="verification-list">${renderList(copy.verify.slice(0, 4))}</ol>${candidateIdentity ? `<p class="report-note">${escapeHtml(lang === "zh" ? "价格依据" : "Price basis")}: <span class="data">${escapeHtml(candidateIdentity)}</span></p>` : ""}</section>${renderFieldGuideSources(viewModel)}</div></details>
    </article>`;
}

function renderResults(results, answers) {
  document.querySelector(".workspace")?.classList.remove("is-location-browse");
  showResultsPanel({ showFeedback: true });
  setFeedbackMode("results");
  const list = document.getElementById("results");
  const summary = document.getElementById("result-summary");
  const title = document.getElementById("results-title");
  const lang = activeLang();
  if (title) title.textContent = ui("fullResultsTitle", lang);
  list.classList.remove("location-browse-results");
  const eligibleResults = results.filter(r => isTopThreeEligible(r.apartment));
  const top = eligibleResults.slice(0, 3);
  const campus = campusLabel(answers.campus, lang);
  const hasSpecificBudgetFit = top.some(result => {
    return !result.apartment.isExploration && result.breakdown.budget === SCORE.FULL;
  });
  const budgetCoverageGap = !hasSpecificBudgetFit;
  const topHasTie = top.some((result, index) => top.some((other, otherIndex) => otherIndex !== index && other.score === result.score));
  const unitType = unitTypeLabel(answers.unitType, lang);
  const budget = budgetLabel(answers.budget, answers.unitType, lang);
  let baseSummary = answers.campus === "balanced"
    ? ui("balancedSummary", lang)(unitType, budget, top.length)
    : ui("baseSummary", lang)(unitType, budget, campus, top.length);
  if (topHasTie) {
    baseSummary = `${baseSummary} ${ui("fullTieSummary", lang)}`;
  }
  const budgetGapSummary = ui("budgetGapSummary", lang);
  summary.textContent = budgetCoverageGap ? `${baseSummary} ${budgetGapSummary}` : baseSummary;
  summary.classList.toggle("summary-warning", budgetCoverageGap);

  document.body.dataset.resultRenderer = "field_guide";
  list.classList.add("field-guide-results");
  const viewModels = buildResultViewModels(top, answers, lang);
  // Keep the map absent until the selected anchor and every visible property
  // marker have approved route/origin evidence.
  fieldGuideSpatialReference(viewModels, answers);
  list.innerHTML = `${renderNeedsSummary(answers, lang)}${viewModels.map(renderFieldGuideCard).join("")}`;
}

function renderLocationBrowse(results, campus) {
  document.querySelector(".workspace")?.classList.add("is-location-browse");
  showResultsPanel({ showFeedback: true });
  setFeedbackMode("location");
  const list = document.getElementById("results");
  const summary = document.getElementById("result-summary");
  const title = document.getElementById("results-title");
  const lang = activeLang();
  const campusName = campusLabel(campus, lang);
  if (title) title.textContent = ui("locationBrowseTitle", lang)(campusName);
  summary.textContent = ui("locationBrowseSummary", lang)(campusName, results.length);
  summary.classList.remove("summary-warning");
  document.body.dataset.resultRenderer = "location_browse";
  list.classList.remove("field-guide-results");
  list.classList.add("location-browse-results");
  list.innerHTML = results.map(result => {
    const apartment = result.apartment;
    const copy = apartmentCopy(apartment, lang);
    return `
      <article class="result-card location-browse-card">
        <div>
          <span class="location-tier">${escapeHtml(locationBrowseTierLabel(result.locationScore, lang))}</span>
          <h3>${escapeHtml(apartment.name)}</h3>
          <p class="subtitle">${escapeHtml(copy.area)}</p>
        </div>
        <p>${escapeHtml(ui("locationBrowseCardNote", lang))}</p>
      </article>
    `;
  }).join("");
}

function enforceMaxSelections(form, name, max) {
  const inputs = [...form.querySelectorAll(`input[name="${name}"]`)];
  inputs.forEach(input => {
    input.addEventListener("change", () => {
      const checked = inputs.filter(option => option.checked);
      if (checked.length > max) input.checked = false;
      inputs.forEach(option => {
        option.disabled = !option.checked && inputs.filter(item => item.checked).length >= max;
      });
    });
  });
}

function setRefinementStatus(message = "") {
  const status = typeof document === "undefined" ? null : document.getElementById("refinement-status");
  if (status) status.textContent = message;
}

function rankApartments(answers) {
  if (isOutOfScope(answers)) return [];
  return APARTMENTS
    .filter(isRankableApartment)
    .map(apartment => scoreApartment(apartment, answers))
    .sort((a, b) => compareResults(a, b, answers));
}

function rankLocationBrowseApartments({ campus } = {}) {
  if (!campus || campus === "balanced") return [];
  const ranked = APARTMENTS
    .filter(apartment => isRankableApartment(apartment) && (apartment.campusScores[campus] || 1) >= 4)
    .map(apartment => ({
      apartment,
      locationScore: apartment.campusScores[campus]
    }))
    .sort((a, b) => b.locationScore - a.locationScore || a.apartment.name.localeCompare(b.apartment.name));
  if (ranked.length <= LOCATION_BROWSE_LIMIT) return ranked;
  const boundaryScore = ranked[LOCATION_BROWSE_LIMIT - 1].locationScore;
  return ranked.filter((result, index) => index < LOCATION_BROWSE_LIMIT || result.locationScore === boundaryScore);
}

function setActiveLocationBrowse(campus) {
  document.querySelectorAll(".location-browser-button").forEach(button => {
    button.classList.toggle("is-active", button.dataset.campus === campus);
  });
}

function showResultsPanel({ showFeedback = true } = {}) {
  const panel = document.querySelector(".results-panel");
  const feedbackPanel = document.getElementById("feedback-panel");
  if (panel) panel.hidden = false;
  if (feedbackPanel) feedbackPanel.hidden = !showFeedback;
}

function hideResultsPanel() {
  document.querySelector(".workspace")?.classList.remove("is-location-browse");
  const panel = document.querySelector(".results-panel");
  const feedbackPanel = document.getElementById("feedback-panel");
  const list = document.getElementById("results");
  if (list) list.innerHTML = "";
  if (panel) panel.hidden = true;
  if (feedbackPanel) feedbackPanel.hidden = true;
}

function scrollResultsIntoView({ focusHeading = false } = {}) {
  const panel = document.querySelector(".results-panel");
  const heading = document.getElementById("results-title");
  if (panel && typeof panel.scrollIntoView === "function") {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
  if (focusHeading && heading && typeof heading.focus === "function") {
    const focus = () => heading.focus({ preventScroll: true });
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(focus);
    else focus();
  }
}

function runLocationBrowse(campus) {
  setActiveLocationBrowse(campus);
  latestAnswers = { campus, requirements: [], preferences: [], setup: [], priority: [] };
  latestEntry = `location_browse:${campus}`;
  setRefinementStatus("");
  const results = rankLocationBrowseApartments({ campus });
  latestResults = results;
  renderLocationBrowse(results, campus);
  scrollResultsIntoView({ focusHeading: true });
  return results;
}

function runMatch(form, entry = "full_quiz") {
  document.querySelector(".workspace")?.classList.remove("is-location-browse");
  const answers = getFormValues(form);
  latestAnswers = answers;
  latestEntry = entry;
  setRefinementStatus("");
  setActiveLocationBrowse("");
  if (isOutOfScope(answers)) {
    latestResults = [];
    renderOutOfScope(answers);
    return [];
  }
  const results = rankApartments(answers);
  latestResults = results;
  renderResults(results, answers);
  return results;
}

function resetForm(form) {
  form.reset();
  renderBudgetOptions(form, { preserve: false });
  [...form.querySelectorAll("input")].forEach(input => {
    input.disabled = false;
  });
  setActiveLocationBrowse("");
  latestAnswers = null;
  latestResults = [];
  latestEntry = "default";
  const petFollowup = document.getElementById("pet-type-followup");
  if (petFollowup) petFollowup.hidden = true;
  setFeedbackMode("results");
  setRefinementStatus("");
  hideResultsPanel();
}

function init() {
  const form = document.getElementById("fit-form");
  const reset = document.getElementById("reset-button");
  const copyFeedbackButton = document.getElementById("copy-feedback");
  const feedbackRecipient = document.getElementById("feedback-recipient");
  const petPriority = form.querySelector('input[name="requirement"][value="pet_friendly"]');
  const petFollowup = document.getElementById("pet-type-followup");
  const petTypeInputs = [...form.querySelectorAll('input[name="pet_type"]')];
  const locationBrowseButtons = [...document.querySelectorAll(".location-browser-button")];
  const unitTypeInputs = [...form.querySelectorAll('input[name="unit_type"]')];
  enforceMaxSelections(form, "requirement", 2);
  enforceMaxSelections(form, "preference", 3);
  const syncPetFollowup = () => {
    if (!petFollowup || !petPriority) return;
    petFollowup.hidden = !petPriority.checked;
    petTypeInputs.forEach(input => {
      input.required = petPriority.checked;
      if (!petPriority.checked) input.checked = false;
    });
  };
  if (petPriority) petPriority.addEventListener("change", syncPetFollowup);
  unitTypeInputs.forEach(input => {
    input.addEventListener("change", () => renderBudgetOptions(form, { preserve: false, clearSelection: true }));
  });
  form.addEventListener("change", event => {
    if (event.target?.name === "budget") renderBudgetOptions(form, { preserve: true });
    syncPetFollowup();
    setRefinementStatus(latestEntry === "full_quiz" && latestResults.length ? ui("refinementPending", activeLang()) : "");
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    runMatch(form);
    scrollResultsIntoView({ focusHeading: true });
  });
  reset.addEventListener("click", () => resetForm(form));
  copyFeedbackButton.addEventListener("click", () => copyFeedback("feedback-status"));
  locationBrowseButtons.forEach(button => {
    button.addEventListener("click", () => runLocationBrowse(button.dataset.campus));
  });
  hideResultsPanel();
  renderBudgetOptions(form, { preserve: false });
  if (feedbackRecipient && FEEDBACK_EMAIL) {
    feedbackRecipient.textContent = ui("feedbackContact", activeLang())(FEEDBACK_EMAIL);
    feedbackRecipient.hidden = false;
  }
  syncPetFollowup();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

if (typeof module !== "undefined") {
  module.exports = {
    APARTMENTS,
    AVAILABILITY_PRICE_SNAPSHOT,
    LOCATION_BROWSE_LIMIT,
    UTILITY_PROFILES,
    CAMPUS_LABELS,
    SCORE,
    BUDGET_LABELS,
    BUDGET_OPTIONS_BY_UNIT_TYPE,
    MVP_MIN_APARTMENT_BUDGET,
    scoreApartment,
    scoreBudget,
    budgetComparison,
    applyBudgetCeiling,
    budgetUnitTypeSelection,
    budgetSnapshotCandidates,
    candidateFeatureCompatibility,
    selectBudgetCandidate,
    scoreCampus,
    scoreLocation,
    scoreUtilities,
    scoreFlooringStatus,
    scoreSetup,
    scoreAmenity,
    scoreAmenityBreadth,
    scoreNewerBuilding,
    scoreParking,
    scorePetPolicy,
    selectedHardRequirements,
    requirementEvidenceTier,
    requirementEvidenceCoverage,
    preferenceEvidenceCoverage,
    activeHardRequirements,
    hardRequirementTier,
    campusFitTier,
    campusFitTierLabel,
    locationFitLabel,
    locationBrowseTierLabel,
    confirmedBudgetMiss,
    budgetRankingTier,
    budgetLocationPenalty,
    rankingCampusTier,
    scoreConcession,
    concessionIsCurrent,
    knownConcessionEstimate,
    knownConcessionCredit,
    scoreAccessAndLateRoute,
    scoreLowDensity,
    scoreYaleShuttle,
    scoreSinglePriority,
    scoreWorry,
    scoreDaily,
    scorePriority,
    calculateCosts,
    COST_TEXT,
    renderCostMetrics,
    formatMoney,
    weightsForAnswers,
    compareResults,
    budgetLabel,
    budgetBand,
    budgetOptionsFor,
    unitTypeLabel,
    isOutOfScope,
    isRankableApartment,
    isTopThreeEligible,
    rankApartments,
    rankLocationBrowseApartments,
    escapeHtml,
    formatAnswersForShare,
    buildFeedbackText,
    normalizeQuestionnaireAnswers,
    topResultNames,
    topReasons,
    buildResultViewModel,
    buildResultViewModels,
    fieldGuideWhy,
    fieldGuideTradeoff,
    renderFieldGuideCard,
    renderNeedsSummary,
    fieldGuideSpatialReference,
    entryLabel,
    ruleBadges,
    amenityFeatureCount,
    concessionDiscountPercent,
    apartmentEvidence,
    availabilityRows,
    currentRentBasis,
    priceStatus,
    priceSignalText,
    quickPriceSignalRows,
    utilityProfile,
    internetIncluded,
    utilityCostItems,
    renderUtilityDetails,
    renderMoveInChecks,
    campusLabel,
    categoryLabel,
    answerValueLabel,
    apartmentCopy,
    utilityLabel,
    UI_TEXT,
    APARTMENT_TRANSLATIONS
  };
}
