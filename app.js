const SCORE = {
  FULL: 100,
  VERY_HIGH: 92,
  HIGH: 82,
  MID: 64,
  LOW: 42,
  MISS: 18
};

const CONFIDENCE_SCORE = {
  high: 100,
  partial: 72,
  stale: 50,
  low: 38
};

const UTILITY_PREDICTABILITY_SCORE = {
  predictable: 100,
  mixed: 68,
  variable: 38,
  unknown: 44
};

const VALUE_SIGNAL_CAVEAT = "Approximate $/sqft uses marketplace-listed rent and square footage. The cheapest rent and largest unit may not be the same unit; compare within the same fee mode.";

const MVP_MIN_APARTMENT_BUDGET = 1600;

const BUDGET_LABELS = {
  1400: "< $1,600",
  1900: "$1,600-$1,900",
  2300: "$1,900-$2,300",
  3000: "$2,300-$3,000",
  4000: "$3,000+"
};

const CAMPUS_LABELS = {
  central_campus: "Central Campus",
  med_school: "Med School / YNHH",
  som_prospect: "SOM / Prospect Hill",
  seas_science: "SEAS / Science Hill",
  downtown_station: "Downtown / Union Station",
  balanced: "Not sure / balanced"
};

let latestAnswers = null;
let latestResults = [];

const APARTMENTS = [
  {
    id: "360-state",
    name: "360 State Street",
    area: "Downtown high-rise · 360 State St",
    price: {
      min: 2055,
      max: 5200,
      label: "$2,055+ studio / $2,254+ 1BR adv.; true cost higher"
    },
    concession: "Official page advertises up to 2 months free + $500 look-and-lease on selected homes; not counted in budget score.",
    valueSignal: "Marketplace sqft check: Studio S $2,220-$2,345 / 517 sq ft, about $4.29-$4.54 per sq ft. Larger 2BR layouts may have lower $/sq ft, but total rent and fees are higher.",
    // 1-5 fit scores, not minutes. 5 = strongest match for that campus destination.
    campusScores: {
      central_campus: 4,
      med_school: 3,
      som_prospect: 2,
      seas_science: 3,
      downtown_station: 5,
      balanced: 4
    },
    utilities: "variable",
    setupTags: ["furniture_ready", "laundry", "private_space"],
    amenityTags: ["package", "gym_pool", "parking"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs exact-unit verification",
    furnishing: "Unfurnished base; CORT furniture partner",
    applicationFriction: 4,
    roommateFit: 2,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Downtown grocery/food + building services",
    sourceLabel: "Official site refreshed 2026-06-29; fees still need written sheet",
    bestFor: [
      "预算较高，主要活动在 downtown / Central Campus，想要 full-service building 的学生",
      "看重 in-unit laundry、package handling、maintenance、parking 和楼内/楼下日常便利的学生",
      "不需要真正 furnished included，但愿意用 CORT 或购买家具解决 setup 的学生"
    ],
    tradeoffs: [
      "advertised rent 之外还要确认 utilities、insurance、deposit、parking、amenity/admin fees",
      "到 Med School、SOM、Science Hill 的体感差异会很大，不能只看楼名",
      "家具不是默认包含，CORT partner 只是降低 setup friction"
    ],
    verify: [
      "written fee sheet and utility billing",
      "guarantor/co-signer policy for students without U.S. credit history",
      "flooring and furniture option for exact unit",
      "late-night route to your exact Yale building"
    ]
  },
  {
    id: "olive-wooster",
    name: "Olive & Wooster",
    area: "Wooster Square / downtown edge · 87 Union St",
    price: {
      min: 2400,
      max: 3800,
      label: "Official page shows specials; exact rent needs availability refresh"
    },
    concession: "Official page shows up to 3 months free on select apartments and reduced pricing on select 1BR; not counted in budget score.",
    valueSignal: "Marketplace sqft check: A1 1BR $1,880-$2,824 / 631 sq ft, about $2.98-$4.48 per sq ft. Co-living floorplans appear separately, so compare rent basis carefully.",
    campusScores: {
      central_campus: 3,
      med_school: 5,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 5,
      balanced: 4
    },
    utilities: "variable",
    setupTags: ["laundry", "private_space"],
    amenityTags: ["package", "gym_pool", "parking"],
    dailyTags: ["building_access", "food_store"],
    flooring: "needs exact-unit verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Med District / Wooster food convenience",
    sourceLabel: "Official site refreshed 2026-06-29; rent table not visible in static page",
    bestFor: [
      "主要去 Med School / YNHH / SPH，且想住 newer building 的学生",
      "看重 in-unit laundry、fob access、amenities 和 Wooster/downtown local services 的学生",
      "有 roommate 或较高预算，愿意核实 concessions 后再比较 true cost 的学生"
    ],
    tradeoffs: [
      "官方 availability 页面没有在静态文本里列出 exact rent，需要人工刷新或问 leasing",
      "furnished 没有被验证，不能当成少折腾选项直接推荐",
      "到 SOM / Science Hill 的通勤不一定优，需要按课表或实验室路线算"
    ],
    verify: [
      "exact unit rent and concessions",
      "what utilities and Wi-Fi billing actually include",
      "furnished or furniture-rental options",
      "walking route to your exact Yale building"
    ]
  },
  {
    id: "the-taft",
    name: "The Taft",
    area: "Central / Chapel-College corridor · 265 College St",
    price: {
      min: 1865,
      max: 3300,
      label: "$1,865-$2,060 studio; $2,150-$2,440 1BR; $2,950-$3,300 2BR"
    },
    concession: "2 months free for studio/1BR leases with move-in on or before 2026-08-01; not counted in budget score.",
    valueSignal: "Marketplace sqft check: studio $1,920-$2,115 / 424-524 sq ft, about $3.66-$4.99 per sq ft. Studio lofts look stronger on $/sq ft, but exact unit condition matters.",
    campusScores: {
      central_campus: 5,
      med_school: 4,
      som_prospect: 3,
      seas_science: 3,
      downtown_station: 5,
      balanced: 5
    },
    utilities: "mixed",
    setupTags: ["furniture_ready", "private_space"],
    amenityTags: ["package", "gym_pool"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs exact-unit verification",
    furnishing: "CORT / corporate furnished option visible; not verified as normal furnished-included",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Central campus + downtown daily routine",
    sourceLabel: "Paredim + RentCafe refreshed 2026-06-29; fee sheet still incomplete",
    bestFor: [
      "Central Campus / Law / downtown 活动多，想用 location 降低 daily friction 的学生",
      "预算在 studio / 1BR 主流区间，且能赶上 2026-08-01 前 move-in concession 的学生",
      "需要 heat/hot water included，并愿意核实电费、网络和家具方案的学生"
    ],
    tradeoffs: [
      "concession 条件很具体，不能直接折成 net rent 来打预算分",
      "recurring Trash + Amenities 已见 $55/mo，但完整 fee sheet、parking、insurance 还缺",
      "不是 newer glass-tower profile，unit condition、laundry、flooring 要看 exact unit"
    ],
    verify: [
      "full fee sheet and whether skip-deposit offer has conditions",
      "electricity, internet, laundry, parking, pet, and renter's insurance costs",
      "whether CORT / corporate furnished option works for normal student leases",
      "student guarantor/co-signer and remote application policy"
    ]
  },
  {
    id: "the-archive",
    name: "The Archive",
    area: "Downtown / Ninth Square · Chapel / Orange",
    price: {
      min: 2164,
      max: 8513,
      label: "$2,232+ studio; $2,164+ 1BR; $3,041+ 2BR; $3,922+ 3BR total monthly price"
    },
    concession: "Official site shows up to 3 months free on 24+ month leases and up to 2 months free on immediate move-ins + Yale discounts; not counted in budget score.",
    valueSignal: "Marketplace sqft check: Sx1 studio $1,894-$4,944 / 387 sq ft has a wide value range. Larger shared layouts may lower $/sq ft, but roommate split and lease terms must be checked separately.",
    campusScores: {
      central_campus: 4,
      med_school: 3,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 5,
      balanced: 4
    },
    utilities: "mixed",
    setupTags: ["private_space"],
    amenityTags: ["package"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs exact-unit verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 4,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Ninth Square / downtown services + roommate-sized layouts",
    sourceLabel: "Official site + Entrata refreshed 2026-06-29; all-in claims need confirmation",
    bestFor: [
      "想住 downtown / Ninth Square，同时需要 studio 到 3BR 选择面的学生",
      "有 roommate 或想比较 2BR/3BR split cost 的学生",
      "对 concessions 敏感，但愿意逐条确认 lease length 和 eligibility 的学生"
    ],
    tradeoffs: [
      "页面使用 Total Monthly Leasing Price，必须确认到底包含和排除哪些费用",
      "All-In Leasing / Zero Extra Fees 很有价值，但发布前需要 written confirmation",
      "Archive I/II 或多地址口径还要确认，避免把不同楼混成一个体验"
    ],
    verify: [
      "what Total Monthly Leasing Price includes",
      "utilities, internet, parking, pet, insurance, application/admin fees",
      "exact concession terms for 24+ month lease, immediate move-in, and Yale discount",
      "whether to split profile by building/address"
    ]
  },
  {
    id: "estelle",
    name: "Estelle",
    area: "Downtown / New Haven Green edge · 19 Elm St",
    price: {
      min: 2795,
      max: 5795,
      label: "Studio inquire; $2,795+ 1BR; $3,870+ 2BR; $4,725+ 3BR; $5,795+ 4BR"
    },
    concession: "Opening offer: 2 months free on 12-month lease or 4 months free on 24+ month lease; not counted in budget score.",
    valueSignal: "Marketplace sqft check: S1 studio $2,290 / 469 sq ft, about $4.88 per sq ft. Larger layouts may improve $/sq ft but raise total monthly cost.",
    campusScores: {
      central_campus: 5,
      med_school: 3,
      som_prospect: 3,
      seas_science: 3,
      downtown_station: 5,
      balanced: 4
    },
    utilities: "unknown",
    setupTags: ["private_space"],
    amenityTags: ["package", "gym_pool"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs exact-unit verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 4,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "New downtown opening + Central Campus access",
    sourceLabel: "Official site + SecureCafe refreshed 2026-06-29; opening/fees need confirmation",
    bestFor: [
      "想要 newest-building feel，主要在 Central Campus / downtown 活动的学生",
      "能接受新开楼 move-in execution risk，但想用 opening concession 抵消部分成本的学生",
      "有 roommate 或高预算，想比较 2BR/3BR/4BR split 的学生"
    ],
    tradeoffs: [
      "studio 当前只显示 inquire，不能把 filter 里的低价当 confirmed studio rent",
      "opening concessions 很强，但 specials、pricing、lease terms、availability 可能 daily change",
      "fee sheet、utilities、parking、deposit、insurance 都还没进入 true-cost scoring"
    ],
    verify: [
      "final opening / move-in readiness and exact available unit",
      "fee sheet, utility billing, parking, deposit, pet, insurance, and internet",
      "concession restrictions for 12-month vs 24+ month leases",
      "postal code discrepancy and student application requirements"
    ]
  },
  {
    id: "axis-201",
    name: "Axis 201",
    area: "Science Park / Munson St · 201 Munson St",
    price: {
      min: 1852,
      max: 4425,
      label: "$1,852+ studio; $2,282+ 1BR; $3,084+ 2BR; $4,425+ 3BR/townhome"
    },
    concession: "Official page advertises reduced rates plus up to 3 months free on select homes; not counted in budget score.",
    valueSignal: "Marketplace sqft check: studio $1,935-$2,150 / 333-519 sq ft, about $3.73-$6.46 per sq ft. 2BR layouts look stronger on $/sq ft for roommate splits.",
    campusScores: {
      central_campus: 3,
      med_school: 2,
      som_prospect: 4,
      seas_science: 5,
      downtown_station: 2,
      balanced: 3
    },
    utilities: "variable",
    setupTags: ["private_space"],
    amenityTags: ["package", "gym_pool"],
    dailyTags: ["building_access", "quiet_routine"],
    flooring: "needs exact-unit verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 4,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Science Park / Science Hill-oriented routine",
    sourceLabel: "Official floorplans refreshed 2026-06-29; utilities and student policy need confirmation",
    bestFor: [
      "主要去 SEAS / Science Hill / SOM / Prospect corridor，想避开 downtown core 的学生",
      "想用 lower studio starting rent 或 roommate/townhome layout 控制 cost 的学生",
      "日常更看重 building routine 和安静感，而不是 downtown nightlife 的学生"
    ],
    tradeoffs: [
      "到 Med School / Union Station / downtown errands 的 routine 不一定顺",
      "已见 recurring fee $83.39/mo，但 utilities 和 parking 等还要补齐",
      "concession 只适用于 select homes，不能替代 true monthly cost"
    ],
    verify: [
      "utility billing, parking, renters insurance, and pet/storage fees",
      "lease term and concession eligibility",
      "route to exact SEAS / SOM / lab building, including late-night plan",
      "student guarantor/co-signer requirements"
    ]
  },
  {
    id: "the-audubon",
    name: "The Audubon",
    area: "Audubon / Whitney-Arts corridor · 367 Orange St",
    price: {
      min: 2250,
      max: 4952,
      label: "$2,250+ studio; $2,671+ 1BR; $3,691+ 2BR; $4,180+ 3BR estimated monthly cost"
    },
    concession: "Official home page advertises up to 1.5 months free on select homes; not counted in budget score.",
    campusScores: {
      central_campus: 5,
      med_school: 3,
      som_prospect: 4,
      seas_science: 4,
      downtown_station: 3,
      balanced: 5
    },
    utilities: "variable",
    setupTags: ["private_space"],
    amenityTags: ["package", "parking"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs exact-unit verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Arts / Central Campus / Whitney-Audubon access",
    sourceLabel: "Official site refreshed 2026-06-29; estimated monthly cost needs fee breakdown",
    bestFor: [
      "Central Campus / Arts / Whitney-Audubon corridor 活动多，想要 balanced campus access 的学生",
      "看重 building access、package、parking/garage verification 的学生",
      "预算较高，愿意在申请前核实 estimated monthly cost 的学生"
    ],
    tradeoffs: [
      "页面使用 Estimated Monthly Cost，但 full fee breakdown 还没完整捕捉",
      "RedNote 上有 garage / neighbor / safety-concern wording，只能作为 route/access verification trigger",
      "到 Med School 或 downtown south side 的路线需要按真实作息看"
    ],
    verify: [
      "cost-estimator fee breakdown and utility billing",
      "garage, access, package, lighting, and late-night route process",
      "concession terms and selected-home eligibility",
      "student guarantor/co-signer and remote application policy"
    ]
  },
  {
    id: "new-haven-towers",
    name: "New Haven Towers / NHV Towers",
    area: "Downtown York/Park/High cluster · 4 buildings",
    price: {
      min: 1695,
      max: 4795,
      label: "Madison studio $1,695+; Crown/Court/18 High vary by building"
    },
    campusScores: {
      central_campus: 5,
      med_school: 4,
      som_prospect: 3,
      seas_science: 4,
      downtown_station: 4,
      balanced: 5
    },
    utilities: "predictable",
    setupTags: ["private_space"],
    amenityTags: ["package", "gym_pool", "parking"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs building/exact-unit verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 3,
    roommateFit: 4,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Campus-adjacent downtown cluster; tower-specific fit",
    sourceLabel: "Official floorplans refreshed 2026-06-29; tower-level pricing captured",
    bestFor: [
      "Central Campus / Law / Art / Med 附近活动多，想要老牌 downtown cluster 的学生",
      "想要 heat/hot water included，让 utilities 更 predictable 的学生",
      "愿意按 Madison / Crown / Crown Court / 18 High 分楼比较价格和位置的学生"
    ],
    tradeoffs: [
      "不能把四栋楼压成一个体验，价格、位置、amenities 都要 tower-specific",
      "security deposit 1.5 months + application fee 会影响 move-in cash",
      "parking $90-$170/mo，且 exact building availability 需要确认"
    ],
    verify: [
      "which tower and exact unit you are applying for",
      "parking availability/cost, electricity, renters insurance, and move-in cash",
      "laundry, flooring, package, and maintenance setup by building",
      "student guarantor/co-signer requirements"
    ]
  },
  {
    id: "pierpont-city-crossing",
    name: "Pierpont at City Crossing",
    area: "Downtown Crossing / station-med edge",
    price: {
      min: 2218,
      max: 3613,
      label: "$2,218+ Jr Studio; $2,486+ 1BR; $3,613+ 2BR"
    },
    campusScores: {
      central_campus: 3,
      med_school: 4,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 5,
      balanced: 3
    },
    utilities: "variable",
    setupTags: ["private_space"],
    amenityTags: ["package"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "needs exact-unit verification",
    furnishing: "Short-term stays may include furniture/utilities; normal lease furnishing not verified",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Station / Med / downtown crossing routine",
    sourceLabel: "RMS official page + embedded RentCafe refreshed 2026-06-29",
    bestFor: [
      "主要去 Med School / Union Station / downtown south side，想要 City Crossing 位置的学生",
      "想比较 Jr Studio / 1BR / 2BR，且能接受 standard lease 条款待确认的学生",
      "可能需要短租/临时落脚选项，但会把 short-term terms 和 normal lease 分开核实的学生"
    ],
    tradeoffs: [
      "学生说的 City Crossing 可能还包括其他楼，Pierpont 只是当前锁定的官方身份之一",
      "short-term 家具/utility/parking 包含不能外推到普通 lease",
      "standard lease 的 fees、utilities、parking 和 application policy 还要补"
    ],
    verify: [
      "whether your target is Pierpont or another City Crossing building",
      "standard lease fee sheet, utilities, parking, and renter's insurance",
      "short-term vs normal lease terms if you need temporary housing",
      "student guarantor/co-signer and remote signing policy"
    ]
  },
  {
    id: "the-whit",
    name: "The Whit",
    area: "Wooster Square · 630 Chapel St",
    price: {
      min: 2400,
      max: 5400,
      label: "Official page says rates subject to change; exact rent needs refresh"
    },
    campusScores: {
      central_campus: 4,
      med_school: 4,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 4,
      balanced: 4
    },
    utilities: "variable",
    setupTags: ["furniture_ready", "laundry", "private_space", "wood_floor"],
    amenityTags: ["package", "gym_pool", "parking"],
    dailyTags: ["building_access", "food_store", "late_route"],
    flooring: "wide plank flooring listed; verify exact unit",
    furnishing: "Unfurnished base; CORT furnished solutions partner",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Wooster restaurants + package/concierge",
    sourceLabel: "Official Scully page refreshed 2026-06-29",
    bestFor: [
      "想在 Wooster Square / Chapel corridor，兼顾 Central Campus 和 Med School 的学生",
      "明确在意 in-unit washer/dryer、wide plank floor、package/concierge 和 gym/pool 的学生",
      "需要家具解决方案但可以接受 furniture rental，而非租金内 furnished 的学生"
    ],
    tradeoffs: [
      "当前页面不提供稳定静态 rent table，价格需要 availability refresh",
      "amenities 多，true monthly cost 可能被 utilities、parking、fees 拉高",
      "到 SOM / Science Hill 不一定是最顺的通勤"
    ],
    verify: [
      "current rent and move-in availability",
      "CORT furniture cost and minimum rental term",
      "fee guide and utility billing",
      "late-night route and package/guest access process"
    ]
  },
  {
    id: "anthem-square10",
    name: "The Anthem at Square 10",
    area: "Downtown Crossing / Union Station side · South Orange / George",
    price: {
      min: 2200,
      max: 3700,
      label: "Stale news baseline: studio $1,900, 1BR $2,625, 2BR $3,300"
    },
    valueSignal: "Marketplace sqft check: S1 studio $1,921-$2,201 / 373 sq ft, about $5.15-$5.90 per sq ft. 2BR B1 appears closer to $3.06+ per sq ft before fee confirmation.",
    campusScores: {
      central_campus: 3,
      med_school: 4,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 5,
      balanced: 3
    },
    utilities: "unknown",
    setupTags: ["private_space"],
    amenityTags: ["gym_pool", "parking"],
    dailyTags: ["food_store", "late_route"],
    flooring: "needs verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "stale",
    confidenceLabel: "Stale news (2024-12); needs official refresh",
    dailyLabel: "Good station/Med orientation, services changing",
    sourceLabel: "News source from 2024-12; official live data still needed",
    bestFor: [
      "主要去 Med School / Union Station / downtown south side，想关注新楼供给的学生",
      "愿意追踪新盘 concessions、affordable/market-rate mix 和后续 retail 变化的学生",
      "有 roommate、预算中高，想比较 downtown south side 与 Wooster/Downtown core 的学生"
    ],
    tradeoffs: [
      "当前不是官方 live rent，不能直接作为申请依据",
      "local services 在变化，不能用旧开业新闻判断现在是否方便",
      "unit-level laundry、flooring、utilities、家具都还没核实"
    ],
    verify: [
      "official leasing site and current floorplans",
      "current rent, concessions, affordable-unit eligibility if relevant",
      "utility package and move-in fees",
      "current grocery/restaurant status around Square 10"
    ]
  },
  {
    id: "the-elm",
    name: "The Elm / Apartments at Yale",
    area: "Central campus edge",
    price: {
      min: 2000,
      max: 3000,
      label: "$2,000+ seed estimate; source pending"
    },
    campusScores: {
      central_campus: 5,
      med_school: 3,
      som_prospect: 4,
      seas_science: 4,
      downtown_station: 4,
      balanced: 5
    },
    utilities: "mixed",
    setupTags: ["private_space"],
    amenityTags: ["package"],
    dailyTags: ["food_store", "late_route"],
    flooring: "needs verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 3,
    roommateFit: 2,
    confidence: "low",
    confidenceLabel: "Needs source refresh",
    dailyLabel: "Campus-adjacent routine",
    sourceLabel: "Seed profile only; official source pending",
    bestFor: [
      "Central Campus / Law / Humanities / Art / Music 附近活动很多，campus proximity 是第一优先级的学生",
      "可以接受 older-building trade-offs，用短 commute 换 daily routine 的学生",
      "想拿 campus-adjacent apartment 与 downtown high-rise 做对照的学生"
    ],
    tradeoffs: [
      "当前价格、availability、fees、utilities 都没有完成官方刷新",
      "amenities 和 maintenance profile 可能明显弱于 newer buildings",
      "如果预算敏感，短 commute 不一定抵消 true cost"
    ],
    verify: [
      "current official source and property manager",
      "rent, availability, fees, and included utilities",
      "laundry, flooring, heat/AC, and package process",
      "route to your exact Yale building"
    ]
  },
  {
    id: "corsair",
    name: "Corsair",
    area: "East Rock / State Street corridor",
    price: {
      min: 2200,
      max: 3300,
      label: "$2,200+ seed estimate; source pending"
    },
    campusScores: {
      central_campus: 3,
      med_school: 2,
      som_prospect: 3,
      seas_science: 4,
      downtown_station: 3,
      balanced: 4
    },
    utilities: "variable",
    setupTags: ["laundry", "private_space"],
    amenityTags: ["package", "gym_pool", "parking"],
    dailyTags: ["building_access", "quiet_routine"],
    flooring: "needs verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "low",
    confidenceLabel: "Needs source refresh",
    dailyLabel: "Quieter building routine; services need route check",
    sourceLabel: "Seed profile only; New Haven official source pending",
    bestFor: [
      "SEAS / Science Hill / East Rock routine 更多，想要 newer apartment feel 的学生",
      "愿意用稍远 downtown/Med commute 换 building quality、space 或 parking 的学生",
      "有预算空间，且希望 package、maintenance、parking options 更清楚的学生"
    ],
    tradeoffs: [
      "官方 New Haven source 尚未锁定，暂时只能当 candidate",
      "到 Med School / downtown south side 的通勤需要按时间段核实",
      "flooring、utilities、concessions 不能按楼名假设"
    ],
    verify: [
      "correct official New Haven leasing source",
      "commute to your exact Yale building",
      "parking, utility, amenity, and application fees",
      "nearby grocery/pharmacy/restaurant routine"
    ]
  },
  {
    id: "east-rock-landlord",
    name: "East Rock independent landlord",
    area: "Exploration direction · residential / roommate-friendly",
    isExploration: true,
    price: {
      min: 850,
      max: 1600,
      label: "$850-$1,600 est. per person; exact unit required"
    },
    campusScores: {
      central_campus: 3,
      med_school: 2,
      som_prospect: 4,
      seas_science: 5,
      downtown_station: 2,
      balanced: 4
    },
    utilities: "mixed",
    setupTags: ["wood_floor"],
    amenityTags: ["basic"],
    dailyTags: ["quiet_routine"],
    flooring: "wood floors more common, verify unit",
    furnishing: "Usually unfurnished unless listing says otherwise",
    applicationFriction: 3,
    roommateFit: 5,
    confidence: "low",
    confidenceLabel: "Low source confidence",
    dailyLabel: "Quiet/residential; services vary by exact block",
    sourceLabel: "Pattern-based exploration direction",
    bestFor: [
      "预算敏感，愿意找 roommate 或接受 older housing 的学生",
      "主要去 Science Hill / SOM / Prospect Hill，想住 residential feel 的学生",
      "愿意自己核实 lease、utilities、maintenance 和冬天 heating cost 的学生"
    ],
    tradeoffs: [
      "这是探索方向，不是具体 apartment 推荐",
      "package、laundry、maintenance、heat/water 体验差异可能很大",
      "不适合想要 front desk / amenities / 一站式申请流程的人"
    ],
    verify: [
      "lease and fee sheet",
      "heating type and winter utility average",
      "maintenance response process",
      "roommate/sublet rules"
    ]
  },
  {
    id: "hamden-large",
    name: "Hamden large apartment",
    area: "Exploration direction · lower-rent commute trade-off",
    isExploration: true,
    price: {
      min: 1400,
      max: 2300,
      label: "$1,400-$2,300 est.; exact building needed"
    },
    campusScores: {
      central_campus: 1,
      med_school: 1,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 1,
      balanced: 2
    },
    utilities: "variable",
    setupTags: ["private_space"],
    amenityTags: ["parking", "basic"],
    dailyTags: ["quiet_routine", "building_access"],
    flooring: "needs verification",
    furnishing: "Usually unfurnished unless listing says otherwise",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "low",
    confidenceLabel: "Needs source refresh",
    dailyLabel: "Car-friendly errands; no-car routine needs check",
    sourceLabel: "Category-level exploration direction",
    bestFor: [
      "预算有限，愿意用 commute 换 rent/space 的学生",
      "有车，或能稳定处理 bus / shuttle / rideshare 的学生",
      "不需要每天晚间频繁往返 campus 的学生"
    ],
    tradeoffs: [
      "这是探索方向，不是具体 apartment 推荐",
      "对无车学生不一定友好，late-night commute 要谨慎核实",
      "不同 building 的 fees、utilities、application policy 差异很大"
    ],
    verify: [
      "commute time by your real schedule",
      "parking fee and winter parking rules",
      "utility average",
      "restaurant/store access without a car"
    ]
  }
];

const CATEGORY_LABELS = {
  budget: "Budget fit",
  campus: "Campus fit",
  utilities: "Utilities",
  setup: "Setup",
  amenity: "Amenities",
  worry: "Main worry",
  daily: "Daily life"
};

// Draft fallback weights, not validated. Budget and campus routine are weighted highest
// because they usually behave like hard constraints for incoming students.
const WEIGHTS = {
  budget: 1.25,
  campus: 1.5,
  utilities: 1,
  setup: 0.95,
  amenity: 0.75,
  worry: 1.15,
  daily: 0.95
};

function getSelectedValues(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function getFormValues(form) {
  const data = new FormData(form);
  return {
    budget: Number(data.get("budget")),
    campus: data.get("campus"),
    utilities: data.get("utilities"),
    setup: getSelectedValues(form, "setup"),
    amenity: data.get("amenity"),
    worry: getSelectedValues(form, "worry"),
    daily: data.get("daily")
  };
}

function scoreBudget(apartment, maxBudget) {
  // Budget uses advertised/current starting rent only. Concessions are shown
  // separately because eligibility, lease length, and move-in timing vary.
  if (apartment.price.min <= maxBudget) return SCORE.FULL;
  // +250 = stretch budget; +500 = significant overspend but still worth surfacing.
  if (apartment.price.min <= maxBudget + 250) return SCORE.HIGH;
  if (apartment.price.min <= maxBudget + 500) return SCORE.LOW;
  return SCORE.MISS;
}

function scoreCampus(apartment, preference) {
  return (apartment.campusScores[preference] || 1) * 20;
}

// Backward-compat alias for older tests or review snippets that still call location.
function scoreLocation(apartment, preference) {
  return scoreCampus(apartment, preference);
}

function scoreUtilities(apartment, preference) {
  if (preference === "predictable") return UTILITY_PREDICTABILITY_SCORE[apartment.utilities] || SCORE.LOW;
  if (preference === "some_variable") {
    if (apartment.utilities === "mixed") return SCORE.VERY_HIGH;
    if (apartment.utilities === "predictable") return SCORE.HIGH;
    if (apartment.utilities === "unknown") return SCORE.MID;
    return SCORE.MID;
  }
  return apartment.amenityTags.includes("gym_pool") || apartment.amenityTags.includes("package") ? SCORE.VERY_HIGH : SCORE.MID;
}

function scoreSetup(apartment, preferences) {
  const selected = preferences.length ? preferences : ["furniture_ready"];
  const scores = selected.map(preference => {
    if (apartment.setupTags.includes(preference)) return SCORE.FULL;
    if (preference === "wood_floor" && apartment.flooring.includes("verify")) return SCORE.MID;
    if (preference === "furniture_ready" && apartment.setupTags.includes("private_space")) return SCORE.LOW;
    return SCORE.MISS;
  });
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function scoreAmenity(apartment, preference) {
  if (apartment.amenityTags.includes(preference)) return SCORE.FULL;
  if (preference === "basic" && apartment.price.min < 1800) return SCORE.VERY_HIGH;
  if (preference === "basic") return SCORE.HIGH;
  if (apartment.amenityTags.includes("package") && preference === "gym_pool") return SCORE.MID;
  return SCORE.LOW;
}

function scoreTrueCostConcern(apartment) {
  const predictability = UTILITY_PREDICTABILITY_SCORE[apartment.utilities] || SCORE.LOW;
  const price = apartment.price.min < 1200 ? SCORE.FULL : apartment.price.min < 1800 ? SCORE.HIGH : apartment.price.min < 2400 ? SCORE.MID : SCORE.LOW;
  // Keep this score about cost exposure only; source confidence is shown separately and scored under trust.
  return Math.round((predictability + price) / 2);
}

function scoreSingleWorry(apartment, preference) {
  if (preference === "application") return Math.max(20, 100 - apartment.applicationFriction * 16);
  if (preference === "roommate") return apartment.roommateFit * 20;
  if (preference === "trust") return CONFIDENCE_SCORE[apartment.confidence] || SCORE.LOW;
  if (preference === "true_cost") return scoreTrueCostConcern(apartment);
  return SCORE.MID;
}

function scoreWorry(apartment, preferences) {
  const selected = preferences.length ? preferences : ["application"];
  const scores = selected.map(preference => scoreSingleWorry(apartment, preference));
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function scoreDaily(apartment, preference) {
  if (apartment.dailyTags.includes(preference)) return SCORE.FULL;
  if (preference === "building_access" && apartment.amenityTags.includes("package")) return SCORE.HIGH;
  if (preference === "food_store" && apartment.campusScores.downtown_station >= 4) return SCORE.HIGH;
  if (preference === "late_route" && Math.max(apartment.campusScores.central_campus, apartment.campusScores.med_school) >= 4) return SCORE.HIGH;
  if (preference === "quiet_routine" && apartment.dailyTags.includes("quiet_routine")) return SCORE.VERY_HIGH;
  return SCORE.LOW;
}

function scoreApartment(apartment, answers) {
  const breakdown = {
    budget: scoreBudget(apartment, answers.budget),
    campus: scoreCampus(apartment, answers.campus),
    utilities: scoreUtilities(apartment, answers.utilities),
    setup: scoreSetup(apartment, answers.setup),
    amenity: scoreAmenity(apartment, answers.amenity),
    worry: scoreWorry(apartment, answers.worry),
    daily: scoreDaily(apartment, answers.daily)
  };
  const weightedTotal = Object.entries(breakdown).reduce((sum, [key, score]) => {
    return sum + score * WEIGHTS[key];
  }, 0);
  const max = Object.values(WEIGHTS).reduce((sum, value) => sum + value * 100, 0);
  return {
    apartment,
    breakdown,
    score: Math.round((weightedTotal / max) * 100)
  };
}

function compareResults(a, b) {
  const scoreDiff = b.score - a.score;
  // Fit score stays primary. Exact ties use source confidence as a stable
  // ordering hint without making the displayed scores look out of order.
  if (scoreDiff === 0) {
    const confidenceDiff = (CONFIDENCE_SCORE[b.apartment.confidence] || 0) - (CONFIDENCE_SCORE[a.apartment.confidence] || 0);
    if (confidenceDiff !== 0) return confidenceDiff;
  }
  return scoreDiff;
}

function topReasons(result) {
  return Object.entries(result.breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => CATEGORY_LABELS[key]);
}

function confidenceClass(confidence) {
  if (confidence === "high") return "good";
  if (confidence === "partial") return "warn";
  return "low";
}

function confidenceBanner(apartment) {
  if (!["low", "stale"].includes(apartment.confidence) && !apartment.isExploration) return "";
  const message = apartment.isExploration
    ? "这是探索方向，不是具体 apartment 推荐。请先锁定具体房源，再核实 rent、fees、utilities、lease terms。"
    : apartment.confidence === "stale"
      ? "这个选项有公开线索，但数据已经 stale。请先刷新 official rent、availability、fees 和 local services。"
      : "这个选项的数据尚未核实，fit score 仅供方向参考。申请前请刷新 rent、availability、fees 和 policy。";
  return `<div class="confidence-banner">${escapeHtml(message)}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderList(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function valueLabel(value, labels) {
  return labels[value] || value || "Not specified";
}

function budgetLabel(maxBudget) {
  return BUDGET_LABELS[maxBudget] || `$${maxBudget.toLocaleString()}`;
}

function isOutOfScope(answers) {
  return answers.budget < MVP_MIN_APARTMENT_BUDGET;
}

function isRankableApartment(apartment) {
  return !apartment.isExploration && apartment.confidence !== "low";
}

function renderOutOfScope(answers) {
  const list = document.getElementById("results");
  const summary = document.getElementById("result-summary");
  const campus = CAMPUS_LABELS[answers.campus] || "your Yale destination";
  summary.textContent = `${budgetLabel(answers.budget)} / ${campus} 这类需求当前不进入推荐池。`;
  summary.classList.add("summary-warning");
  list.innerHTML = `
    <article class="result-card scope-card">
      <div class="card-top">
        <div>
          <div class="rank">Out of current scope</div>
          <h3>暂不生成 apartment top 3</h3>
          <p class="subtitle">当前版本先服务 New Haven mainstream apartments，不覆盖低预算房间、二手转租、独立房东或纯 roommate matching。</p>
        </div>
      </div>
      <div class="reason-grid">
        <div class="reason-box">
          <h4>为什么过滤</h4>
          <ul>
            <li>这个预算段的主要解法通常不是 apartment leasing office，而是 room / sublet / independent landlord。</li>
            <li>当前数据池没有足够可靠的低预算房源、室友规则、maintenance 和 utility evidence。</li>
          </ul>
        </div>
        <div class="reason-box">
          <h4>这版继续覆盖</h4>
          <ul>
            <li>studio / 1BR / 2BR split 的 mainstream apartment 选择。</li>
            <li>按 campus、true cost、utilities、amenities、daily life 和申请摩擦做 fit ranking。</li>
          </ul>
        </div>
        <div class="reason-box">
          <h4>后续可单独做</h4>
          <ul>
            <li>房间/转租 workflow、室友匹配、RedNote 二手帖和独立房东核验。</li>
            <li>Yale Graduate Housing 可在下一轮申请季作为单独 baseline 回归。</li>
          </ul>
        </div>
      </div>
      <div class="tags">
        <span class="tag warn">No apartment recommendation shown</span>
        <span class="tag">Scope boundary</span>
      </div>
    </article>
  `;
}

function topResultNames(results) {
  if (!results.length) return "No apartment top 3 shown";
  return results.slice(0, 3).map((result, index) => {
    return `${index + 1}. ${result.apartment.name} (${result.score})`;
  }).join("\n");
}

function formatAnswersForShare(answers) {
  if (!answers) return "No questionnaire answers captured yet.";
  return [
    `Budget: ${budgetLabel(answers.budget)}`,
    `Campus: ${valueLabel(answers.campus, CAMPUS_LABELS)}`,
    `Utilities: ${answers.utilities}`,
    `Setup: ${answers.setup.join(", ") || "none"}`,
    `Amenities: ${answers.amenity}`,
    `Worries: ${answers.worry.join(", ") || "none"}`,
    `Daily life: ${answers.daily}`
  ].join("\n");
}

function getInputValue(id) {
  const input = document.getElementById(id);
  return input ? input.value.trim() : "";
}

function feedbackText() {
  const accuracy = getInputValue("feedback-accuracy") || "Not specified";
  const missing = getInputValue("feedback-missing") || "None";
  const note = getInputValue("feedback-note") || "None";
  return [
    "[NHV Apartment Fit Checker beta feedback]",
    "",
    "My answers:",
    formatAnswersForShare(latestAnswers),
    "",
    "Top 3 shown:",
    topResultNames(latestResults),
    "",
    `Top 3 accuracy: ${accuracy}`,
    `Missing apartment: ${missing}`,
    `What to improve: ${note}`,
    "",
    "Note: this is beta feedback, not an application request."
  ].join("\n");
}

function copyText(text, statusId) {
  const status = document.getElementById(statusId);
  const done = () => {
    if (status) status.textContent = "已复制，可以直接粘贴到微信。";
  };
  const fail = () => {
    if (status) status.textContent = "复制失败，请手动选中文本。";
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done, fail));
    return;
  }
  fallbackCopy(text, done, fail);
}

function fallbackCopy(text, done, fail) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy") ? done() : fail();
  } catch {
    fail();
  }
  textArea.remove();
}

function renderResults(results, answers) {
  const list = document.getElementById("results");
  const summary = document.getElementById("result-summary");
  const top = results.slice(0, 3);
  const campus = CAMPUS_LABELS[answers.campus] || "your Yale destination";
  const hasSpecificBudgetFit = results.some(result => {
    return !result.apartment.isExploration && result.breakdown.budget >= SCORE.HIGH;
  });
  const budgetCoverageGap = !hasSpecificBudgetFit;
  const baseSummary = `按你的预算 ${budgetLabel(answers.budget)} 和 ${campus} routine，先看这 ${top.length} 个。`;
  const budgetGapSummary = "当前 mainstream apartment pool 没有高预算匹配项；以下仅作为 stretch comparison，申请前请先确认真实月成本。";
  summary.textContent = budgetCoverageGap ? `${baseSummary} ${budgetGapSummary}` : baseSummary;
  summary.classList.toggle("summary-warning", budgetCoverageGap);

  list.innerHTML = top.map((result, index) => {
    const apartment = result.apartment;
    const reasons = topReasons(result).map(escapeHtml);
    const rankLabel = apartment.isExploration ? `#${index + 1} explore direction` : `#${index + 1} match`;
    const bars = Object.entries(result.breakdown).map(([key, value]) => `
      <div class="bar-row">
        <span>${escapeHtml(CATEGORY_LABELS[key])}</span>
        <div class="bar-track"><div class="bar-fill" style="width: ${Math.round(value)}%"></div></div>
        <strong>${Math.round(value)}</strong>
      </div>
    `).join("");

    return `
      <article class="result-card">
        ${confidenceBanner(apartment)}
        <div class="card-top">
          <div>
            <div class="rank">${escapeHtml(rankLabel)} · ${reasons.join(" + ")}</div>
            <h3>${escapeHtml(apartment.name)}</h3>
            <p class="subtitle">${escapeHtml(apartment.area)}</p>
          </div>
          <div class="score-pill">${result.score}<small>fit score</small></div>
        </div>

        <div class="facts">
          <div class="fact"><strong>Cost signal</strong><span>${escapeHtml(apartment.price.label)}</span></div>
          ${apartment.valueSignal ? `<div class="fact value-fact"><strong>Value signal</strong><span>${escapeHtml(apartment.valueSignal)}</span></div>` : ""}
          ${apartment.concession ? `<div class="fact concession-fact"><strong>Concession</strong><span>${escapeHtml(apartment.concession)}</span></div>` : ""}
          <div class="fact"><strong>Utilities</strong><span>${escapeHtml(apartment.utilities)}</span></div>
          <div class="fact"><strong>Furnishing</strong><span>${escapeHtml(apartment.furnishing)}</span></div>
          <div class="fact"><strong>Flooring</strong><span>${escapeHtml(apartment.flooring)}</span></div>
          <div class="fact"><strong>Daily life</strong><span>${escapeHtml(apartment.dailyLabel)}</span></div>
          <div class="fact"><strong>Source</strong><span>${escapeHtml(apartment.sourceLabel)}</span></div>
        </div>
        ${apartment.valueSignal ? `<div class="value-caveat">${escapeHtml(VALUE_SIGNAL_CAVEAT)}</div>` : ""}

        <div class="reason-grid">
          <div class="reason-box">
            <h4>Why this fits</h4>
            <ul>${renderList(apartment.bestFor.slice(0, 3))}</ul>
          </div>
          <div class="reason-box">
            <h4>Trade-offs</h4>
            <ul>${renderList(apartment.tradeoffs.slice(0, 3))}</ul>
          </div>
          <div class="reason-box">
            <h4>Verify before applying</h4>
            <ul>${renderList(apartment.verify.slice(0, 4))}</ul>
          </div>
        </div>

        <div class="breakdown">${bars}</div>

        <div class="tags">
          <span class="tag ${confidenceClass(apartment.confidence)}">${escapeHtml(apartment.confidenceLabel)}</span>
          ${apartment.isExploration ? '<span class="tag low">Exploration direction</span>' : ""}
          ${apartment.concession ? '<span class="tag warn">Concession not in budget score</span>' : ""}
          <span class="tag">No sponsored ranking</span>
          <span class="tag warn">Verify current rent</span>
        </div>
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
      runMatch(form);
    });
  });
}

function rankApartments(answers) {
  if (isOutOfScope(answers)) return [];
  return APARTMENTS
    .filter(isRankableApartment)
    .map(apartment => scoreApartment(apartment, answers))
    .sort(compareResults);
}

function runMatch(form) {
  const answers = getFormValues(form);
  latestAnswers = answers;
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
  [...form.querySelectorAll("input")].forEach(input => {
    input.disabled = false;
  });
  runMatch(form);
}

function init() {
  const form = document.getElementById("fit-form");
  const reset = document.getElementById("reset-button");
  const copyFeedback = document.getElementById("copy-feedback");
  enforceMaxSelections(form, "setup", 2);
  enforceMaxSelections(form, "worry", 2);
  form.addEventListener("submit", event => {
    event.preventDefault();
    runMatch(form);
  });
  form.addEventListener("change", event => {
    if (event.target.name !== "setup" && event.target.name !== "worry") runMatch(form);
  });
  reset.addEventListener("click", () => resetForm(form));
  copyFeedback.addEventListener("click", () => copyText(feedbackText(), "feedback-status"));
  runMatch(form);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

if (typeof module !== "undefined") {
  module.exports = {
    APARTMENTS,
    CAMPUS_LABELS,
    SCORE,
    BUDGET_LABELS,
    MVP_MIN_APARTMENT_BUDGET,
    scoreApartment,
    scoreBudget,
    scoreCampus,
    scoreLocation,
    scoreUtilities,
    scoreSetup,
    scoreAmenity,
    scoreWorry,
    scoreDaily,
    compareResults,
    budgetLabel,
    isOutOfScope,
    isRankableApartment,
    rankApartments,
    escapeHtml,
    formatAnswersForShare,
    topResultNames
  };
}
