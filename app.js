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

const SCORABLE_WORRY_VALUES = new Set(["application", "true_cost", "roommate"]);

const VALUE_SIGNAL_CAVEATS = {
  en: "Approximate $/sqft uses marketplace-listed rent and square footage. The cheapest rent and largest unit may not be the same unit; compare within the same fee mode.",
  zh: "每平方英尺价格使用平台展示的租金和面积粗算。最低租金和最大面积不一定来自同一个房源；只应在同一费用口径内比较。"
};

const MVP_MIN_APARTMENT_BUDGET = 1600;
const FEEDBACK_EMAIL = "vince.xy.wang@gmail.com";
const HIGH_MOVE_IN_CASH_TOP_SHARE = 0.25;
const STRONG_AMENITY_TAG_COUNT = 2;

const BUDGET_LABELS = {
  1400: "< $1,600",
  1900: "$1,600-$1,900",
  2300: "$1,900-$2,300",
  3000: "$2,300-$3,000",
  4000: "$3,000+"
};

const BUDGET_BANDS = {
  1900: { lower: 1600, upper: 1900 },
  2300: { lower: 1900, upper: 2300 },
  3000: { lower: 2300, upper: 3000 },
  4000: { lower: 3000, upper: 4200 }
};

const DEFAULT_COST_ASSUMPTIONS = {
  utilitiesByPredictability: {
    predictable: 80,
    mixed: 120,
    variable: 180,
    unknown: 180
  },
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
    advertised_rent: "展示租金",
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
    insuranceEstimate: "Renters insurance",
    furnitureAmortized: "Furniture rental if needed",
    parkingEstimate: "Parking if selected",
    concessionEstimate: "Estimated concession credit",
    firstMonth: "First month rent",
    securityDeposit: "Security deposit",
    appFee: "Application fee",
    adminFee: "Admin / move-in fee"
  },
  zh: {
    recurringFees: "固定楼内月费",
    utilitiesEstimate: "水电网估算",
    insuranceEstimate: "租客保险",
    furnitureAmortized: "需要家具时的租赁估算",
    parkingEstimate: "选择停车时的估算",
    concessionEstimate: "估算优惠月摊",
    firstMonth: "首月租金",
    securityDeposit: "押金",
    appFee: "申请费",
    adminFee: "admin / move-in fee"
  }
};

const COST_TEXT = {
  en: {
    title: "True cost check",
    advertised: "Advertised rent",
    trueMonthly: "Estimated true monthly",
    moveInCash: "Move-in cash",
    monthlyDelta: delta => delta >= 0
      ? `+${formatMoney(delta)} over advertised rent`
      : `${formatMoney(Math.abs(delta))} below advertised after estimated concession`,
    grossBeforeConcession: "Before concession",
    monthlyIncludes: "Monthly estimate includes",
    moveInIncludes: "Move-in estimate includes",
    caveat: "Estimate only. Use it to compare hidden-cost exposure, then verify the exact fee sheet and lease terms before applying.",
    excludedPrefix: "Not included yet",
    estimateSuffix: "est."
  },
  zh: {
    title: "真实成本粗算",
    advertised: "展示租金",
    trueMonthly: "估算月成本",
    moveInCash: "入住前现金",
    monthlyDelta: delta => delta >= 0
      ? `比展示租金多 ${formatMoney(delta)}`
      : `估算优惠后比展示租金低 ${formatMoney(Math.abs(delta))}`,
    grossBeforeConcession: "优惠前估算",
    monthlyIncludes: "月成本包含",
    moveInIncludes: "入住前现金包含",
    caveat: "这是估算，用来比较 hidden cost 暴露程度；申请前仍要用具体房源的 fee sheet 和 lease 条款核实。",
    excludedPrefix: "暂未计入",
    estimateSuffix: "估算"
  }
};

const CAMPUS_LABELS = {
  central_campus: "Central Campus",
  med_school: "Med School / YNHH",
  som_prospect: "SOM / Prospect Hill",
  seas_science: "SEAS / Science Hill",
  downtown_station: "Downtown / Union Station",
  balanced: "Not sure / balanced"
};

const CAMPUS_LABELS_ZH = {
  central_campus: "Central Campus",
  med_school: "Med School / YNHH",
  som_prospect: "SOM / Prospect Hill",
  seas_science: "SEAS / Science Hill",
  downtown_station: "Downtown / Union Station",
  balanced: "不确定 / 均衡通勤"
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
    baseSummary: (budget, campus, count) => `Given your ${budget} budget and ${campus} routine, start with these ${count}.`,
    budgetGapSummary: "The current mainstream apartment pool has no strong budget fit; treat these as stretch comparisons and confirm true monthly cost before applying.",
    match: "match",
    exploreDirection: "explore direction",
    scoreLabel: "fit score",
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
      concession: "Concession not in budget score",
      rent: "Verify current rent"
    },
    confidenceExploration: "This is an exploration direction, not a specific apartment recommendation. First identify a specific unit, then verify rent, fees, utilities, and lease terms.",
    confidenceStale: "This option has public signals, but the data is stale. Refresh official rent, availability, fees, and local services first.",
    confidenceLow: "This option has not been verified enough. Treat the fit score as directional only, and refresh rent, availability, fees, and policy before applying.",
    feedbackEmailSubject: "NHV Apartment Fit Checker beta feedback",
    feedbackEmailOpenedCopied: "Gmail draft opened. Feedback text was also copied, so paste it if Gmail leaves the body blank.",
    feedbackEmailOpenedNoCopy: "Gmail draft opened. If the body is blank, your browser blocked clipboard access; please use the prefilled Gmail draft.",
    feedbackTitle: "[NHV Apartment Fit Checker beta feedback]",
    feedbackRecipient: email => `Send to: ${email}`,
    feedbackEntry: "Entry path",
    entryDefault: "Default balanced view",
    entryFullQuiz: "Full questionnaire / refined answers",
    entryQuickStart: campus => `Quick start: ${campus}`,
    feedbackAnswers: "My answers:",
    feedbackTop: "Top 3 shown:",
    feedbackAccuracy: "Top 3 accuracy",
    feedbackMissing: "Missing apartment",
    feedbackImprove: "What to improve",
    feedbackNote: "Note: this is beta feedback, not an application request.",
    notSpecified: "Not specified",
    none: "None",
    noTop3: "No apartment top 3 shown",
    quickStartSummary: (campus, count) => `Quick start for ${campus}: start with these ${count}. Use the questionnaire below to refine budget and true cost.`,
    ruleTags: {
      campusFit: campus => `${campus} access`,
      balancedFit: "Balanced access",
      utilitiesPredictable: "Predictable utilities",
      amenityStrong: "Strong amenities",
      parkingVerify: "Ask about parking",
      moveInHigh: "Higher move-in cash",
      roommateFriendly: "Roommate split friendly"
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
    baseSummary: (budget, campus, count) => `根据你的预算 ${budget} 和 ${campus} 作息，先看这 ${count} 个。`,
    budgetGapSummary: "目前没有特别贴合预算的选择；下面这几栋只能当作加预算对照，申请前一定要确认每月总成本。",
    match: "匹配",
    exploreDirection: "探索方向",
    scoreLabel: "匹配分",
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
      concession: "优惠未计入预算",
      rent: "租金要再确认"
    },
    confidenceExploration: "这是一个方向，不是具体公寓推荐。先锁定具体房源，再确认租金、费用、水电网和 lease 条款。",
    confidenceStale: "这个选项有公开线索，但信息比较旧。先确认最新租金、availability、费用和周边服务。",
    confidenceLow: "这个选项的信息还不够扎实，匹配分只能当方向参考。申请前先确认租金、availability、费用和政策。",
    feedbackEmailSubject: "纽黑文公寓匹配器测试反馈",
    feedbackEmailOpenedCopied: "Gmail 草稿已打开；反馈文本也已复制。如果 Gmail 正文没有自动填入，可以直接粘贴。",
    feedbackEmailOpenedNoCopy: "Gmail 草稿已打开。如果正文没有自动填入，说明浏览器拦截了剪贴板，请以 Gmail 草稿为准。",
    feedbackTitle: "[纽黑文公寓匹配器测试反馈]",
    feedbackRecipient: email => `反馈收件人：${email}`,
    feedbackEntry: "进入方式",
    entryDefault: "默认均衡结果",
    entryFullQuiz: "完整问卷 / 已细化答案",
    entryQuickStart: campus => `快速入口：${campus}`,
    feedbackAnswers: "我的答案：",
    feedbackTop: "显示的前三名：",
    feedbackAccuracy: "前三名准确度",
    feedbackMissing: "缺少的公寓",
    feedbackImprove: "需要改进的地方",
    feedbackNote: "注：这是测试反馈，不是申请请求。",
    notSpecified: "未填写",
    none: "无",
    noTop3: "未显示公寓前三名",
    quickStartSummary: (campus, count) => `${campus} 快速入口：先看这 ${count} 个；预算和真实成本可以继续用下面的问卷细化。`,
    ruleTags: {
      campusFit: campus => `${campus} 方便`,
      balancedFit: "通勤均衡",
      utilitiesPredictable: "utilities 更好预估",
      amenityStrong: "楼内配套强",
      parkingVerify: "parking 要提前问",
      moveInHigh: "move-in cash 较高",
      roommateFriendly: "roommate 分摊友好"
    }
  }
};

const CATEGORY_LABELS_BY_LANG = {
  en: {
    budget: "Budget fit",
    campus: "Campus fit",
    utilities: "Utilities",
    setup: "Setup",
    priority: "Priority fit"
  },
  zh: {
    budget: "预算匹配",
    campus: "位置匹配",
    utilities: "水电网",
    setup: "入住配置",
    priority: "关注点匹配"
  }
};

const PRIORITY_REASON_LABELS = {
  en: {
    application: "Application fit",
    true_cost: "True-cost fit",
    roommate: "Roommate fit",
    basic: "Basic-amenity fit",
    package: "Building-service fit",
    gym_pool: "Amenity fit",
    parking: "Parking fit",
    building_access: "Building-access fit",
    late_route: "Route fit",
    food_store: "Local-service fit",
    quiet_routine: "Quiet fit"
  },
  zh: {
    application: "申请门槛匹配",
    true_cost: "真实成本匹配",
    roommate: "合租匹配",
    basic: "基础配套匹配",
    package: "楼内服务匹配",
    gym_pool: "配套匹配",
    parking: "停车匹配",
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
      roommate: "Roommate or split-cost fit",
      basic: "Basic amenities are enough",
      package: "Package / front desk / maintenance",
      gym_pool: "Gym / pool / lounge",
      parking: "Parking / EV / car-friendly",
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
    amenity: {
      basic: "够用就行",
      package: "收包裹 / 前台 / 维修",
      gym_pool: "健身房 / 泳池 / 公共休息区",
      parking: "停车 / 充电 / 对开车友好"
    },
    worry: {
      application: "申请门槛和材料",
      true_cost: "每月总成本 / 入住前现金",
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
      true_cost: "每月总成本 / 入住前现金",
      roommate: "合租 / 分摊成本",
      basic: "配套够用就行",
      package: "收包裹 / 前台 / 维修",
      gym_pool: "健身房 / 泳池 / 公共休息区",
      parking: "停车 / 充电 / 对开车友好",
      building_access: "门禁、收包裹和报修",
      late_route: "晚间路线和交通",
      food_store: "餐馆、买菜和药店",
      quiet_routine: "街道噪音 / 安静"
    }
  }
};

let latestAnswers = null;
let latestResults = [];
let latestEntry = "default";

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
    trueMonthlyCost: {
      advertisedRent: 2055,
      recurringFees: { amount: 115, confidence: "marketplace_supplied" },
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 130, confidence: "marketplace_supplied", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 0, leaseMonths: 12, confidence: "unknown" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 27, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 35,
    flooring: "Photos suggest hardwood flooring; verify exact unit",
    furnishing: "Unfurnished base; CORT furniture partner; 1BR rental is about $250/mo on a 12-mo lease",
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
    trueMonthlyCost: {
      advertisedRent: 2400,
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 175, confidence: "marketplace_supplied", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 2, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 100, confidence: "marketplace_supplied" },
      adminFee: { amount: 50, confidence: "marketplace_supplied" }
    },
    concession: "Official page shows up to 3 months free on select apartments and reduced pricing on select 1BR; not counted in budget score.",
    valueSignal: "Marketplace sqft check: A1 1BR $1,880-$2,824 / 631 sq ft, about $2.98-$4.48 per sq ft. Co-living floorplans appear separately, so compare rent basis carefully.",
    campusScores: {
      central_campus: 3,
      med_school: 3,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 5,
      balanced: 4
    },
    utilities: "variable",
    setupTags: ["laundry", "private_space"],
    amenityTags: ["package", "gym_pool", "parking"],
    dailyTags: ["building_access", "food_store"],
    quietScore: 62,
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
    trueMonthlyCost: {
      advertisedRent: 1865,
      recurringFees: { amount: 55, confidence: "verified_public" },
      utilitiesEstimate: { amount: 90, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: null,
      concessionEstimate: { monthsFree: 2, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { amount: 2000, confidence: "marketplace_supplied" },
      appFee: { amount: 50, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 42,
    flooring: "Vinyl plank or hardwood",
    furnishing: "CORT / corporate furnished option visible; not furnished-included; 1BR rental is about $250/mo on a 12-mo lease",
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
    trueMonthlyCost: {
      advertisedRent: 2164,
      recurringFees: { amount: 0, confidence: "marketplace_supplied" },
      utilitiesEstimate: { amount: 90, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 14, confidence: "sample_lease" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 200, confidence: "marketplace_supplied", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 2, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { amount: 0, confidence: "sample_lease" },
      appFee: { amount: 50, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 48,
    flooring: "Photos suggest luxury vinyl tile (LVT); verify exact unit",
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
    trueMonthlyCost: {
      advertisedRent: 2795,
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "marketplace_supplied" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 180, confidence: "planning_assumption", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 2, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 50, confidence: "planning_assumption" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 50,
    flooring: "Photos suggest warm wood-style flooring; verify exact unit",
    furnishing: "Optional furnished apartments available for additional cost",
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
    trueMonthlyCost: {
      advertisedRent: 1852,
      recurringFees: { amount: 23, confidence: "marketplace_supplied" },
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "marketplace_supplied" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 125, confidence: "marketplace_supplied", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 2, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 50, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 85,
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
    trueMonthlyCost: {
      advertisedRent: 2250,
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 150, confidence: "planning_assumption", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 1.5, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 50, confidence: "planning_assumption" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 62,
    flooring: "Photos suggest hardwood floors; verify exact unit",
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
      "学生社群里出现过 garage / neighbor / access-related concerns，只能作为 route/access verification trigger",
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
    trueMonthlyCost: {
      advertisedRent: 1695,
      utilitiesEstimate: { amount: 75, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 130, confidence: "verified_public", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 0, leaseMonths: 12, confidence: "unknown" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1.5, confidence: "verified_public" },
      appFee: { amount: 50, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 45,
    flooring: "Photos suggest hardwood floors; verify exact unit",
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
    trueMonthlyCost: {
      advertisedRent: 2218,
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 150, confidence: "planning_assumption", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 1, leaseMonths: 12, confidence: "conditional_offer" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 25, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
    },
    campusScores: {
      central_campus: 3,
      // Apartments.com pins City Crossing at 9 Tower Ln in The Hill and labels it "Walk To Campus";
      // this keeps the Med score location-based rather than result-driven.
      med_school: 5,
      som_prospect: 2,
      seas_science: 2,
      downtown_station: 5,
      balanced: 3
    },
    utilities: "variable",
    setupTags: ["private_space"],
    amenityTags: ["package"],
    dailyTags: ["building_access", "food_store", "late_route"],
    quietScore: 75,
    flooring: "Photos suggest luxury wood plank vinyl in living areas, carpet in bedrooms; verify exact unit",
    furnishing: "Short-term stays may include furniture/utilities; normal lease furnishing not verified",
    applicationFriction: 4,
    roommateFit: 3,
    confidence: "partial",
    confidenceLabel: "Partial confidence",
    dailyLabel: "Station / Med / downtown crossing routine",
    sourceLabel: "RMS official page + Apartments.com 9 Tower Ln / Walk To Campus location check",
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
    trueMonthlyCost: {
      advertisedRent: 2400,
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 15, confidence: "planning_assumption" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 180, confidence: "planning_assumption", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 0, leaseMonths: 12, confidence: "unknown" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { amount: 500, confidence: "marketplace_supplied" },
      appFee: { amount: 50, confidence: "planning_assumption" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 58,
    flooring: "wide plank flooring listed; verify exact unit",
    furnishing: "Unfurnished base; CORT furnished solutions partner; 1BR rental is about $250/mo on a 12-mo lease",
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
    trueMonthlyCost: {
      advertisedRent: 2200,
      recurringFees: { amount: 105.25, confidence: "marketplace_supplied" },
      utilitiesEstimate: { amount: 180, confidence: "planning_assumption" },
      insuranceEstimate: { amount: 25, confidence: "marketplace_supplied" },
      furnitureAmortized: { amount: 250, confidence: "planning_assumption", appliesWhenSetup: "furniture_ready" },
      parkingEstimate: { amount: 150, confidence: "planning_assumption", appliesWhenPriority: "parking" },
      concessionEstimate: { monthsFree: 0, leaseMonths: 12, confidence: "unknown" }
    },
    moveInCash: {
      firstMonth: { multiplier: 1, confidence: "advertised_rent" },
      securityDeposit: { multiplier: 1, confidence: "planning_assumption" },
      appFee: { amount: 0, confidence: "marketplace_supplied" },
      adminFee: { amount: 0, confidence: "unknown" }
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
    quietScore: 65,
    flooring: "Photos suggest polished concrete in main living, carpet in bedrooms; verify exact unit",
    furnishing: "Furnished and partially furnished units available",
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
    name: "The Elm",
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
    quietScore: 48,
    flooring: "needs verification",
    furnishing: "Furnished status not verified",
    applicationFriction: 3,
    roommateFit: 2,
    confidence: "low",
    confidenceLabel: "Needs source refresh",
    dailyLabel: "Campus-adjacent routine",
    sourceLabel: "Seed profile only; official source pending; no Yale affiliation implied",
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
    quietScore: 74,
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
    quietScore: 82,
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
    quietScore: 78,
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

const APARTMENT_TRANSLATIONS = {
  zh: {
    "360-state": {
      area: "市中心高层 · 360 State St",
      priceLabel: "studio $2,055 起 / 1BR $2,254 起；加上费用后会更高",
      concession: "官网显示部分房源最高免 2 个月租金，另有 $500 look-and-lease 优惠。",
      valueSignal: "按平台上的租金和面积粗算：Studio S $2,220-$2,345 / 517 sq ft，约 $4.29-$4.54/sq ft。大一点的 2BR 可能每尺更便宜，但总租金和费用会更高。",
      flooring: "需按具体房源确认",
      furnishing: "普通 lease 默认不带家具；可看 CORT 家具方案，1BR 约 $250/月（12个月 lease）",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Downtown 买菜吃饭方便，楼内服务完整",
      sourceLabel: "2026-06-29 查过官网；完整 fee sheet 还要书面确认",
      bestFor: [
        "预算较高、主要活动在 Downtown 或 Central Campus，并想住服务型高层的学生",
        "看重房内洗衣、收包裹、维修、停车和楼下日常便利的学生",
        "不要求租金内自带家具，但愿意用家具租赁或自己购买家具解决入住准备的学生"
      ],
      tradeoffs: [
        "展示租金之外还要确认水电网、保险、押金、停车、配套费和管理费",
        "去 Med School、SOM 和 Science Hill 的实际通勤感觉差很多，不能只看楼名",
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
      priceLabel: "官网有优惠信息；具体租金要看最新 availability",
      concession: "官网显示部分公寓最高免 3 个月租金，部分 1BR 有降价。",
      valueSignal: "按平台上的租金和面积粗算：A1 1BR $1,880-$2,824 / 631 sq ft，约 $2.98-$4.48/sq ft。co-living 户型要单独看租金口径。",
      flooring: "需按具体房源确认",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Med School 方向和 Wooster Square 餐饮方便",
      sourceLabel: "2026-06-29 查过官网；页面没有稳定展示完整租金表",
      bestFor: [
        "主要去 Med School、YNHH 或 SPH，并想住较新楼的学生",
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
      area: "Central Campus / Chapel-College 走廊 · 265 College St",
      priceLabel: "studio $1,865-$2,060；1BR $2,150-$2,440；2BR $2,950-$3,300",
      concession: "2026-08-01 或之前入住的 studio / 1BR lease 可免 2 个月租金。",
      valueSignal: "按平台上的租金和面积粗算：studio $1,920-$2,115 / 424-524 sq ft，约 $3.66-$4.99/sq ft。studio loft 面积更划算，但还要看具体 unit 状态。",
      flooring: "需按具体房源确认",
      furnishing: "能看到 CORT / corporate furniture 选项；不是默认带家具，1BR 约 $250/月（12个月 lease）",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Central Campus 和 Downtown 日常都方便",
      sourceLabel: "2026-06-29 查过 Paredim 和 RentCafe；fee sheet 仍不完整",
      bestFor: [
        "Central Campus、Law School 或 Downtown 活动多，想靠位置省事的学生",
        "预算在 studio 或 1BR 主流区间，并能赶上 2026-08-01 前入住优惠的学生",
        "需要暖气和热水包含，并愿意核实电费、网络和家具方案的学生"
      ],
      tradeoffs: [
        "优惠条件很具体，不能直接折成净租金来打预算分",
        "已看到 trash + amenity fee 合计 $55/月，但完整 fee sheet、停车和保险仍缺",
        "不是新玻璃楼类型，具体房源状态、洗衣和地板都要看房确认"
      ],
      verify: [
        "完整费用表以及免押金方案是否有条件",
        "电费、网络、洗衣、停车、宠物和租客保险成本",
        "CORT 或企业家具选项是否适用于普通学生租约",
        "学生担保人、共同签署和远程申请政策"
      ]
    },
    "the-archive": {
      area: "Downtown / Ninth Square · Chapel / Orange",
      priceLabel: "studio $2,232 起；1BR $2,164 起；2BR $3,041 起；3BR $3,922 起，按总月价展示",
      concession: "官网显示 24 个月以上 lease 最高免 3 个月，immediate move-in 最高免 2 个月，另有 Yale discount。",
      valueSignal: "按平台上的租金和面积粗算：Sx1 studio $1,894-$4,944 / 387 sq ft，区间很宽。多人合租大户型可能每尺更便宜，但室友分摊和 lease term 要单独核实。",
      flooring: "需按具体房源确认",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Ninth Square / Downtown 服务多，也有多人户型",
      sourceLabel: "2026-06-29 查过官网和 Entrata；all-in 口径还要确认",
      bestFor: [
        "想住 Downtown 或 Ninth Square，并希望从 studio 到 3BR 都有选择的学生",
        "已有室友，或想比较 2BR / 3BR 分摊成本的学生",
        "对优惠敏感，但愿意逐条确认租期和资格条件的学生"
      ],
      tradeoffs: [
        "页面用 total monthly leasing price，必须问清楚到底包含和排除哪些费用",
        "all-in leasing / zero extra fees 如果属实很有价值，但需要书面确认",
        "Archive I/II 或多地址口径还要确认，避免把不同楼混成同一体验"
      ],
      verify: [
        "总月租到底包含哪些项目",
        "水电网、网络、停车、宠物、保险、申请费和管理费",
        "24 个月以上租约、立即入住和耶鲁折扣的准确优惠条件",
        "是否需要按楼栋或地址拆分资料"
      ]
    },
    "estelle": {
      area: "Downtown / New Haven Green 边缘 · 19 Elm St",
      priceLabel: "studio 需询价；1BR $2,795 起；2BR $3,870 起；3BR $4,725 起；4BR $5,795 起",
      concession: "开业优惠：12 个月 lease 免 2 个月，24 个月以上 lease 免 4 个月。",
      valueSignal: "按平台上的租金和面积粗算：S1 studio $2,290 / 469 sq ft，约 $4.88/sq ft。大户型可能每尺更便宜，但总月租会更高。",
      flooring: "需按具体房源确认",
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
        "单间当前只显示需询价，不能把筛选器里的低价当作已确认单间租金",
        "开业优惠很强，但优惠、价格、租期和空房可能每天变化",
        "费用表、水电网、停车、押金和保险还没有进入真实成本评分"
      ],
      verify: [
        "最终开业和入住准备状态，以及具体可租房源",
        "费用表、水电网计费、停车、押金、宠物、保险和网络",
        "12 个月与 24 个月以上租约的优惠限制",
        "邮编差异和学生申请要求"
      ]
    },
    "axis-201": {
      area: "Science Park / Munson St · 201 Munson St",
      priceLabel: "studio $1,852 起；1BR $2,282 起；2BR $3,084 起；3BR / townhome $4,425 起",
      concession: "官网显示部分房源降价，并最高免 3 个月租金。",
      valueSignal: "按平台上的租金和面积粗算：studio $1,935-$2,150 / 333-519 sq ft，约 $3.73-$6.46/sq ft。2BR 对合租分摊更值得细看。",
      flooring: "需按具体房源确认",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "更适合 Science Park / Science Hill 作息",
      sourceLabel: "2026-06-29 查过官方户型页；水电网和学生政策仍需确认",
      bestFor: [
        "主要去 SEAS、Science Hill、SOM 或 Prospect 走廊，想避开市中心核心区的学生",
        "想用较低 studio 起租价，或通过 2BR / townhome 分摊控制成本的学生",
        "日常更看重楼内秩序和安静感，而不是市中心夜生活的学生"
      ],
      tradeoffs: [
        "去 Med School、Union Station 或 Downtown 办事不一定顺",
        "已看到 recurring fees 约 $83.39/月，但水电网和停车等仍需补齐",
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
      area: "Audubon / Whitney-Arts 走廊 · 367 Orange St",
      priceLabel: "studio $2,250 起；1BR $2,671 起；2BR $3,691 起；3BR $4,180 起，按估算月成本展示",
      concession: "官网首页显示部分房源最高免 1.5 个月租金。",
      flooring: "需按具体房源确认",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Arts、Central Campus 和 Whitney-Audubon 走廊都方便",
      sourceLabel: "2026-06-29 查过官网；estimated monthly cost 需要拆费用明细",
      bestFor: [
        "Central Campus、Arts 或 Whitney-Audubon 走廊活动多，想要通勤比较均衡的学生",
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
      priceLabel: "Madison 单间 $1,695 起；Crown / Crown Court / 18 High 按楼不同",
      flooring: "需按楼栋和具体房源确认",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "离校园近，但一定要按具体楼比较",
      sourceLabel: "2026-06-29 查过官方户型页；已整理到楼栋级价格",
      bestFor: [
        "Central Campus、Law School、Art 或 Med School 附近活动多，想住老牌 Downtown 公寓的学生",
        "希望暖气和热水包含，让水电网更可预期的学生",
        "愿意按 Madison、Crown、Crown Court 和 18 High 分楼比较价格和位置的学生"
      ],
      tradeoffs: [
        "不能把四栋楼当成同一个体验；价格、位置和配套都要按楼栋看",
        "1.5 个月押金和申请费会影响入住前现金",
        "停车约 $90-$170/月，且具体楼栋空位需要确认"
      ],
      verify: [
        "你申请的是哪栋楼和哪个具体房源",
        "停车空位和价格、电费、租客保险、入住前现金",
        "各楼栋的洗衣、地板、收包裹和维修设置",
        "学生担保人或共同签署要求"
      ]
    },
    "pierpont-city-crossing": {
      area: "Downtown Crossing / 车站-医学院边缘",
      priceLabel: "Jr Studio $2,218 起；1BR $2,486 起；2BR $3,613 起",
      flooring: "需按具体房源确认",
      furnishing: "短租可能包含家具和水电网；普通 lease 是否带家具还没确认",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Union Station、Med School 和 Downtown Crossing 作息",
      sourceLabel: "RMS 官网 + Apartments.com 9 Tower Ln / Walk To Campus 位置核对",
      bestFor: [
        "主要去 Med School、Union Station 或 Downtown 南侧，想要 City Crossing 位置的学生",
        "想比较 Jr Studio、1BR 和 2BR，并能接受普通 lease 条款待确认的学生",
        "可能需要短租或临时落脚，但会把短租和普通 lease 分开核实的学生"
      ],
      tradeoffs: [
        "学生说的 City Crossing 可能包括其他楼，Pierpont 只是当前锁定的官方身份之一",
        "短租包含家具、水电网或停车，不能外推到普通租约",
        "普通租约的费用、水电网、停车和申请政策还要补"
      ],
      verify: [
        "你的目标是 Pierpont 还是另一栋 City Crossing 楼",
        "普通租约费用表、水电网、停车和租客保险",
        "如果需要临时住房，短租和普通租约的区别",
        "学生担保人、共同签署和远程签约政策"
      ]
    },
    "the-whit": {
      area: "Wooster Square · 630 Chapel St",
      priceLabel: "官网说明价格会变化；准确租金要看最新 availability",
      flooring: "列有宽木板地板；仍需按具体房源确认",
      furnishing: "普通 lease 默认不带家具；可看 CORT 家具方案，1BR 约 $250/月（12个月 lease）",
      confidenceLabel: "部分信息已确认",
      dailyLabel: "Wooster Square 餐饮方便，也有收包裹 / concierge",
      sourceLabel: "2026-06-29 查过 Scully 官网",
      bestFor: [
        "想住在 Wooster Square 或 Chapel 走廊，兼顾 Central Campus 和 Med School 的学生",
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
      valueSignal: "按平台上的租金和面积粗算：S1 studio $1,921-$2,201 / 373 sq ft，约 $5.15-$5.90/sq ft。B1 2BR 在确认费用前看起来约 $3.06/sq ft 起。",
      flooring: "需核实",
      furnishing: "是否带家具尚未核实",
      confidenceLabel: "旧新闻线索（2024-12）；需要再查官网",
      dailyLabel: "Union Station / Med School 方向较好，周边服务还在变化",
      sourceLabel: "目前主要是 2024-12 新闻线索；仍需官网实时数据",
      bestFor: [
        "主要去 Med School、Union Station 或 Downtown 南侧，并想关注新楼供应的学生",
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
        "Students with frequent Central Campus, Law, or downtown routines who want location to reduce daily friction.",
        "Students in the mainstream studio or 1BR budget range who can use the move-in concession before 2026-08-01.",
        "Students who need heat and hot water included, and are willing to verify electricity, internet, and furniture options."
      ],
      tradeoffs: [
        "The concession has specific conditions, so it should not be directly converted into net rent for scoring.",
        "Trash plus amenity charges are visible at $55/month, but the full fee sheet, parking, and insurance are still incomplete.",
        "This is not a new glass-tower profile; exact unit condition, laundry, and flooring need unit-level confirmation."
      ],
      verify: [
        "Full fee sheet and whether the skip-deposit offer has conditions.",
        "Electricity, internet, laundry, parking, pet, and renter's insurance costs.",
        "Whether CORT or corporate furnished options work for ordinary student leases.",
        "Student guarantor/co-signer and remote application policy."
      ]
    },
    "the-archive": {
      bestFor: [
        "Students who want downtown or Ninth Square and need options from studio through 3BR.",
        "Students with roommates or those comparing 2BR/3BR split cost.",
        "Students who care about concessions and are willing to verify lease length and eligibility terms one by one."
      ],
      tradeoffs: [
        "The site uses a total monthly leasing price, so confirm exactly what is included and excluded.",
        "All-in leasing and zero-extra-fee claims could be valuable, but need written confirmation before public use.",
        "Archive I/II or multi-address wording still needs confirmation so different buildings are not collapsed into one experience."
      ],
      verify: [
        "What the total monthly leasing price includes.",
        "Utilities, internet, parking, pet fees, insurance, application fees, and admin fees.",
        "Exact concession terms for 24+ month leases, immediate move-in, and Yale discounts.",
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
        "Studio currently shows as inquire-only, so a filter-level low price should not be treated as confirmed studio rent.",
        "Opening concessions are strong, but specials, pricing, lease terms, and availability may change daily.",
        "Fee sheet, utilities, parking, deposit, and insurance are not yet part of true-cost scoring."
      ],
      verify: [
        "Final opening and move-in readiness, plus the exact available unit.",
        "Fee sheet, utility billing, parking, deposit, pet, insurance, and internet.",
        "Concession restrictions for 12-month versus 24+ month leases.",
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
        "A recurring fee of about $83.39/month is visible, but utilities, parking, and other costs still need confirmation.",
        "The concession applies only to select homes, so it cannot replace true monthly cost."
      ],
      verify: [
        "Utility billing, parking, renter's insurance, and pet/storage fees.",
        "Lease term and concession eligibility.",
        "Route to your exact SEAS, SOM, or lab building, including late-night plan.",
        "Student guarantor/co-signer requirements."
      ]
    },
    "the-audubon": {
      bestFor: [
        "Students with frequent Central Campus, Arts, or Whitney-Audubon corridor routines who want balanced campus access.",
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
        "Students mainly going to Med School, Union Station, or the south side of downtown who want a City Crossing location.",
        "Students comparing Jr Studio, 1BR, and 2BR options while accepting that standard lease terms still need confirmation.",
        "Students who may need a short-term landing option, but will separate short-term terms from normal lease terms."
      ],
      tradeoffs: [
        "What students call City Crossing may include other buildings; Pierpont is only the official identity currently pinned down.",
        "Short-term furniture, utility, or parking inclusions should not be applied to ordinary leases.",
        "Standard lease fees, utilities, parking, and application policy still need follow-up."
      ],
      verify: [
        "Whether your target is Pierpont or another City Crossing building.",
        "Standard lease fee sheet, utilities, parking, and renter's insurance.",
        "Short-term versus normal lease terms if you need temporary housing.",
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

// Draft fallback weights, not validated. Budget and campus routine are weighted highest
// because they usually behave like hard constraints for incoming students.
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
      predictable: "predictable",
      mixed: "mixed",
      variable: "variable",
      unknown: "unknown"
    },
    zh: {
      predictable: "较可预期",
      mixed: "部分可预期",
      variable: "浮动较多",
      unknown: "尚不清楚"
    }
  };
  return (labels[lang] || labels.en)[value] || value;
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

function getFormValues(form) {
  const data = new FormData(form);
  return {
    budget: Number(data.get("budget")),
    campus: data.get("campus"),
    utilities: data.get("utilities"),
    setup: getSelectedValues(form, "setup"),
    priority: getSelectedValues(form, "priority")
  };
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
  if (!item) {
    return {
      key,
      amount: fallbackAmount,
      confidence: "planning_assumption"
    };
  }
  if ((item.appliesWhenSetup || item.appliesWhenPriority) && !appliesToAnswers(item, answers)) return null;
  const amount = costItemAmount(item, baseRent, fallbackAmount);
  if (!amount && item.confidence === "unknown") return null;
  return {
    key,
    amount,
    confidence: item.confidence || "planning_assumption"
  };
}

function concessionCostLine(item, baseRent) {
  if (!item || item.monthsFree <= 0) return null;
  const leaseMonths = item.leaseMonths || 12;
  const amount = Number.isFinite(item.monthlyCredit)
    ? item.monthlyCredit
    : baseRent * (item.monthsFree / leaseMonths);
  if (!amount) return null;
  return {
    key: "concessionEstimate",
    amount,
    confidence: item.confidence || "conditional_offer",
    isCredit: true
  };
}

function moveInCostLine(key, item, baseRent, fallbackAmount = 0) {
  const amount = costItemAmount(item, baseRent, fallbackAmount);
  const maxAmount = costItemMaxAmount(item, baseRent, amount);
  const confidence = item?.confidence || "planning_assumption";
  if (!amount && !maxAmount && confidence === "unknown") return null;
  return { key, amount, maxAmount, confidence };
}

function calculateCosts(apartment, answers = {}) {
  const monthlyProfile = apartment.trueMonthlyCost || {};
  const moveInProfile = apartment.moveInCash || {};
  const baseRent = monthlyProfile.advertisedRent || apartment.price.min;
  const utilitiesFallback = DEFAULT_COST_ASSUMPTIONS.utilitiesByPredictability[apartment.utilities] || DEFAULT_COST_ASSUMPTIONS.utilitiesByPredictability.unknown;

  const monthlyItems = [
    monthlyCostLine("recurringFees", monthlyProfile.recurringFees, baseRent, answers, 0),
    monthlyCostLine("utilitiesEstimate", monthlyProfile.utilitiesEstimate, baseRent, answers, utilitiesFallback),
    monthlyCostLine("insuranceEstimate", monthlyProfile.insuranceEstimate, baseRent, answers, DEFAULT_COST_ASSUMPTIONS.renterInsurance),
    monthlyCostLine("furnitureAmortized", monthlyProfile.furnitureAmortized, baseRent, answers, DEFAULT_COST_ASSUMPTIONS.furnitureMonthly),
    monthlyCostLine("parkingEstimate", monthlyProfile.parkingEstimate, baseRent, answers, DEFAULT_COST_ASSUMPTIONS.parkingMonthly)
  ].filter(Boolean);

  const concessionLine = concessionCostLine(monthlyProfile.concessionEstimate, baseRent);
  const grossMonthly = baseRent + monthlyItems.reduce((sum, item) => sum + item.amount, 0);
  const concessionCredit = concessionLine ? concessionLine.amount : 0;
  const trueMonthly = Math.max(0, grossMonthly - concessionCredit);

  const moveInItems = [
    moveInCostLine("firstMonth", moveInProfile.firstMonth || { multiplier: 1, confidence: "advertised_rent" }, baseRent, baseRent),
    moveInCostLine("securityDeposit", moveInProfile.securityDeposit || { multiplier: DEFAULT_COST_ASSUMPTIONS.securityDepositMultiplier }, baseRent, baseRent),
    moveInCostLine("appFee", moveInProfile.appFee, baseRent, DEFAULT_COST_ASSUMPTIONS.applicationFee),
    moveInCostLine("adminFee", moveInProfile.adminFee, baseRent, 0)
  ].filter(Boolean);
  const moveInMin = moveInItems.reduce((sum, item) => sum + item.amount, 0);
  const moveInMax = moveInItems.reduce((sum, item) => sum + (Number.isFinite(item.maxAmount) ? item.maxAmount : item.amount), 0);

  const excluded = [];
  if (moveInProfile.adminFee?.confidence === "unknown" && !moveInProfile.adminFee.amount) excluded.push("adminFee");

  return {
    baseRent,
    grossMonthly,
    trueMonthly,
    concessionLine,
    monthlyItems,
    moveInMin,
    moveInMax,
    moveInItems,
    monthlyDelta: trueMonthly - baseRent,
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

function renderCostBreakdown(costs, lang = activeLang()) {
  const text = COST_TEXT[lang] || COST_TEXT.en;
  const monthlyLines = [...costs.monthlyItems, costs.concessionLine].filter(Boolean).map(item => renderCostLine(item, lang)).join("");
  const moveInLines = costs.moveInItems.map(item => renderCostLine(item, lang)).join("");
  const excluded = costs.excluded.length
    ? `<p class="cost-excluded">${escapeHtml(text.excludedPrefix)}：${costs.excluded.map(key => escapeHtml(costItemLabel(key, lang))).join(" / ")}</p>`
    : "";
  return `
    <div class="cost-breakdown">
      <div class="cost-breakdown-title">${escapeHtml(text.title)}</div>
      <div class="cost-metrics">
        <div>
          <span>${escapeHtml(text.advertised)}</span>
          <strong>${escapeHtml(formatMoney(costs.baseRent))}</strong>
        </div>
        <div class="cost-metric-primary">
          <span>${escapeHtml(text.trueMonthly)}</span>
          <strong>${escapeHtml(formatMoney(costs.trueMonthly))}<small>${escapeHtml(text.estimateSuffix)}</small></strong>
          <em>${escapeHtml(text.monthlyDelta(costs.monthlyDelta))}</em>
        </div>
        <div>
          <span>${escapeHtml(text.moveInCash)}</span>
          <strong>${escapeHtml(formatMoneyRange(costs.moveInMin, costs.moveInMax))}<small>${escapeHtml(text.estimateSuffix)}</small></strong>
        </div>
      </div>
      ${costs.concessionLine ? `<p class="cost-gross">${escapeHtml(text.grossBeforeConcession)}：${escapeHtml(formatMoney(costs.grossMonthly))}</p>` : ""}
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

function scoreBudget(apartment, budgetOrAnswers) {
  // Budget is a band fit against estimated true monthly cost when answers are available.
  // Direct numeric calls keep the older advertised-rent behavior for smoke tests.
  const maxBudget = typeof budgetOrAnswers === "object" ? Number(budgetOrAnswers.budget) : Number(budgetOrAnswers);
  const costBasis = typeof budgetOrAnswers === "object"
    ? calculateCosts(apartment, budgetOrAnswers).trueMonthly
    : apartment.price.min;
  const band = BUDGET_BANDS[maxBudget];
  if (!band) {
    if (costBasis <= maxBudget) return SCORE.FULL;
    if (costBasis <= maxBudget + 250) return SCORE.HIGH;
    if (costBasis <= maxBudget + 500) return SCORE.LOW;
    return SCORE.MISS;
  }

  if (maxBudget === 1900) {
    if (costBasis <= band.upper) return SCORE.FULL;
    if (costBasis <= band.upper + 250) return SCORE.HIGH;
    if (costBasis <= band.upper + 500) return SCORE.LOW;
    return SCORE.MISS;
  }

  if (maxBudget === 2300) {
    if (costBasis >= 1600 && costBasis <= band.upper) return SCORE.FULL;
    if (costBasis <= band.upper + 250) return SCORE.HIGH;
    if (costBasis <= band.upper + 500) return SCORE.LOW;
    return SCORE.MISS;
  }

  if (maxBudget === 3000) {
    if (costBasis >= 1800 && costBasis <= band.upper) return SCORE.FULL;
    if (costBasis >= 1600 && costBasis < 1800) return SCORE.HIGH;
    if (costBasis <= band.upper + 300) return SCORE.HIGH;
    return SCORE.LOW;
  }

  if (maxBudget === 4000) {
    if (costBasis >= 2200 && costBasis <= band.upper) return SCORE.FULL;
    if (costBasis >= 1850 && costBasis < 2200) return SCORE.HIGH;
    if (costBasis >= 1600 && costBasis < 1850) return SCORE.MID;
    if (costBasis <= band.upper + 500) return SCORE.HIGH;
    return SCORE.LOW;
  }

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
  if (!preferences.length) return SCORE.MID;
  const selected = preferences;
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
  const trueMonthly = calculateCosts(apartment, { setup: [], priority: [] }).trueMonthly;
  const price = trueMonthly < 1600 ? SCORE.FULL : trueMonthly < 2200 ? SCORE.HIGH : trueMonthly < 2800 ? SCORE.MID : SCORE.LOW;
  // Keep this score about cost exposure only; source confidence is shown separately.
  return Math.round((predictability + price) / 2);
}

function scoreSingleWorry(apartment, preference) {
  if (preference === "application") return Math.max(20, 100 - apartment.applicationFriction * 16);
  if (preference === "roommate") return apartment.roommateFit * 20;
  if (preference === "trust") return null;
  if (preference === "true_cost") return scoreTrueCostConcern(apartment);
  return SCORE.MID;
}

function scoreWorry(apartment, preferences) {
  const selected = preferences.length ? preferences : ["application"];
  const scores = selected
    .map(preference => scoreSingleWorry(apartment, preference))
    .filter(Number.isFinite);
  if (!scores.length) return SCORE.MID;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function scoreDaily(apartment, preference) {
  if (preference === "quiet_routine") return apartment.quietScore || SCORE.LOW;
  if (apartment.dailyTags.includes(preference)) return SCORE.FULL;
  if (preference === "building_access" && apartment.amenityTags.includes("package")) return SCORE.HIGH;
  if (preference === "food_store" && apartment.campusScores.downtown_station >= 4) return SCORE.HIGH;
  if (preference === "late_route" && Math.max(apartment.campusScores.central_campus, apartment.campusScores.med_school) >= 4) return SCORE.HIGH;
  return SCORE.LOW;
}

function scoreSinglePriority(apartment, preference) {
  if (SCORABLE_WORRY_VALUES.has(preference)) return scoreSingleWorry(apartment, preference);
  if (preference === "trust") return null;
  if (["basic", "package", "gym_pool", "parking"].includes(preference)) return scoreAmenity(apartment, preference);
  if (["building_access", "late_route", "food_store", "quiet_routine"].includes(preference)) return scoreDaily(apartment, preference);
  return SCORE.MID;
}

function scorePriority(apartment, priorities) {
  const selected = priorities.length ? priorities : ["application", "true_cost"];
  const scores = selected
    .map(preference => scoreSinglePriority(apartment, preference))
    .filter(Number.isFinite);
  if (!scores.length) return SCORE.MID;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function weightsForAnswers(answers) {
  return (answers.priority || []).includes("quiet_routine") ? QUIET_PRIORITY_WEIGHTS : WEIGHTS;
}

function scoreApartment(apartment, answers) {
  const weights = weightsForAnswers(answers);
  const breakdown = {
    budget: scoreBudget(apartment, answers),
    campus: scoreCampus(apartment, answers.campus),
    utilities: scoreUtilities(apartment, answers.utilities),
    setup: scoreSetup(apartment, answers.setup),
    priority: scorePriority(apartment, answers.priority || [])
  };
  const weightedTotal = Object.entries(breakdown).reduce((sum, [key, score]) => {
    return sum + score * weights[key];
  }, 0);
  const max = Object.values(weights).reduce((sum, value) => sum + value * 100, 0);
  return {
    apartment,
    breakdown,
    score: Math.round((weightedTotal / max) * 100)
  };
}

function compareResults(a, b, answers = null) {
  const scoreDiff = b.score - a.score;
  if (scoreDiff !== 0) return scoreDiff;
  if ((answers?.priority || []).length) {
    const priorityDiff = b.breakdown.priority - a.breakdown.priority;
    if (priorityDiff !== 0) return priorityDiff;
  }
  const budgetDiff = b.breakdown.budget - a.breakdown.budget;
  if (budgetDiff !== 0) return budgetDiff;
  const campusDiff = b.breakdown.campus - a.breakdown.campus;
  if (campusDiff !== 0) return campusDiff;
  const priceDiff = a.apartment.price.min - b.apartment.price.min;
  if (priceDiff !== 0) return priceDiff;
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
      score: scoreSinglePriority(result.apartment, preference)
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

function confidenceClass(confidence) {
  if (confidence === "high") return "good";
  if (confidence === "partial") return "warn";
  return "low";
}

function confidenceBanner(apartment) {
  if (!["low", "stale"].includes(apartment.confidence) && !apartment.isExploration) return "";
  const lang = activeLang();
  const message = apartment.isExploration
    ? ui("confidenceExploration", lang)
    : apartment.confidence === "stale"
      ? ui("confidenceStale", lang)
      : ui("confidenceLow", lang);
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

function labelLine(label, value, lang = activeLang()) {
  return `${label}${lang === "zh" ? "：" : ": "}${value}`;
}

function budgetLabel(maxBudget) {
  return BUDGET_LABELS[maxBudget] || `$${maxBudget.toLocaleString()}`;
}

function entryLabel(entry = latestEntry, lang = activeLang()) {
  if (entry.startsWith("quick_start:")) {
    const campus = entry.split(":")[1];
    return ui("entryQuickStart", lang)(campusLabel(campus, lang));
  }
  if (entry === "full_quiz") return ui("entryFullQuiz", lang);
  return ui("entryDefault", lang);
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
  const lang = activeLang();
  const campus = campusLabel(answers.campus, lang);
  summary.textContent = lang === "zh"
    ? `${budgetLabel(answers.budget)} / ${campus} 这类需求当前不进入推荐池。`
    : `${budgetLabel(answers.budget)} / ${campus} is outside the current recommendation pool.`;
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
  return results.slice(0, 3).map((result, index) => {
    return `${index + 1}. ${result.apartment.name} (${result.score})`;
  }).join("\n");
}

function formatAnswersForShare(answers, lang = activeLang()) {
  if (!answers) return lang === "zh" ? "还没有记录问卷答案。" : "No questionnaire answers captured yet.";
  const setup = answers.setup.map(value => answerValueLabel("setup", value, lang)).join(", ") || ui("none", lang);
  const priorities = (answers.priority || []).map(value => answerValueLabel("priority", value, lang)).join(", ") || ui("none", lang);
  const labels = lang === "zh"
    ? {
      budget: "预算",
      campus: "校区",
      utilities: "水电网",
      setup: "房间配置",
      priorities: "其他关注点"
    }
    : {
      budget: "Budget",
      campus: "Campus",
      utilities: "Utilities",
      setup: "Setup",
      priorities: "Other priorities"
    };
  return [
    labelLine(labels.budget, budgetLabel(answers.budget), lang),
    labelLine(labels.campus, campusLabel(answers.campus, lang), lang),
    labelLine(labels.utilities, answerValueLabel("utilities", answers.utilities, lang), lang),
    labelLine(labels.setup, setup, lang),
    labelLine(labels.priorities, priorities, lang)
  ].join("\n");
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

function hasStrongAmenities(apartment) {
  return apartment.amenityTags.filter(tag => tag !== "basic").length >= STRONG_AMENITY_TAG_COUNT;
}

function ruleBadges(apartment, answers, lang = activeLang()) {
  const labels = ui("ruleTags", lang);
  const badges = [];
  const add = (label, level = "") => {
    if (label && !badges.some(badge => badge.label === label)) badges.push({ label, level });
  };

  const campusScore = apartment.campusScores[answers.campus] || 0;
  if (answers.campus === "balanced" && campusScore >= 4) {
    add(labels.balancedFit, "good");
  } else if (answers.campus && campusScore >= 4) {
    add(labels.campusFit(campusLabel(answers.campus, lang)), "good");
  }

  if (apartment.utilities === "predictable") add(labels.utilitiesPredictable, "good");
  if (hasStrongAmenities(apartment)) add(labels.amenityStrong, "good");
  if ((answers.priority || []).includes("parking")) {
    add(labels.parkingVerify, "warn");
  }
  if (apartment.roommateFit >= 4) add(labels.roommateFriendly, "good");
  if (calculateCosts(apartment, answers).moveInMin >= highMoveInCashCutoff(answers)) {
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

function feedbackText() {
  const lang = activeLang();
  const accuracy = getInputValue("feedback-accuracy") || ui("notSpecified", lang);
  const missing = getInputValue("feedback-missing") || ui("none", lang);
  const note = getInputValue("feedback-note") || ui("none", lang);
  return [
    ui("feedbackTitle", lang),
    ui("feedbackRecipient", lang)(FEEDBACK_EMAIL),
    labelLine(ui("feedbackEntry", lang), entryLabel(latestEntry, lang), lang),
    "",
    ui("feedbackAnswers", lang),
    formatAnswersForShare(latestAnswers, lang),
    "",
    ui("feedbackTop", lang),
    topResultNames(latestResults, lang),
    "",
    labelLine(ui("feedbackAccuracy", lang), accuracy, lang),
    labelLine(ui("feedbackMissing", lang), missing, lang),
    labelLine(ui("feedbackImprove", lang), note, lang),
    "",
    ui("feedbackNote", lang)
  ].join("\n");
}

function feedbackGmailHref(text, lang = activeLang()) {
  const subject = ui("feedbackEmailSubject", lang);
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: FEEDBACK_EMAIL,
    su: subject,
    body: text
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
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

function openFeedbackEmail(statusId) {
  const status = document.getElementById(statusId);
  const lang = activeLang();
  const text = feedbackText();
  const copied = copyTextFallback(text);
  const draft = window.open(feedbackGmailHref(text, lang), "_blank", "noopener");
  if (!draft) {
    window.location.href = feedbackGmailHref(text, lang);
  }
  if (!copied && navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      if (status) status.textContent = ui("feedbackEmailOpenedCopied", lang);
    }).catch(() => {});
  }
  if (status) {
    status.textContent = ui(copied ? "feedbackEmailOpenedCopied" : "feedbackEmailOpenedNoCopy", lang);
  }
}

function renderResults(results, answers, options = {}) {
  const list = document.getElementById("results");
  const summary = document.getElementById("result-summary");
  const lang = activeLang();
  const top = results.slice(0, 3);
  const campus = campusLabel(answers.campus, lang);
  const hasSpecificBudgetFit = results.some(result => {
    return !result.apartment.isExploration && result.breakdown.budget >= SCORE.HIGH;
  });
  const budgetCoverageGap = !hasSpecificBudgetFit;
  const baseSummary = options.quickStart
    ? ui("quickStartSummary", lang)(campus, top.length)
    : ui("baseSummary", lang)(budgetLabel(answers.budget), campus, top.length);
  const budgetGapSummary = ui("budgetGapSummary", lang);
  summary.textContent = !options.quickStart && budgetCoverageGap ? `${baseSummary} ${budgetGapSummary}` : baseSummary;
  summary.classList.toggle("summary-warning", !options.quickStart && budgetCoverageGap);

  list.innerHTML = top.map((result, index) => {
    const apartment = result.apartment;
    const copy = apartmentCopy(apartment, lang);
    const costs = calculateCosts(apartment, answers);
    const reasons = topReasons(result, lang, answers).map(escapeHtml);
    const rankLabel = apartment.isExploration
      ? `#${index + 1} ${ui("exploreDirection", lang)}`
      : `#${index + 1} ${ui("match", lang)}`;
    const bars = Object.entries(result.breakdown).map(([key, value]) => `
      <div class="bar-row">
        <span>${escapeHtml(categoryLabel(key, lang))}</span>
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
            <p class="subtitle">${escapeHtml(copy.area)}</p>
          </div>
          <div class="score-pill">${result.score}<small>${escapeHtml(ui("scoreLabel", lang))}</small></div>
        </div>

        <div class="facts">
          <div class="fact"><strong>${escapeHtml(ui("facts", lang).cost)}</strong><span>${escapeHtml(copy.priceLabel)}</span></div>
          <div class="fact"><strong>${escapeHtml(ui("facts", lang).utilities)}</strong><span>${escapeHtml(utilityLabel(apartment.utilities, lang))}</span></div>
          <div class="fact"><strong>${escapeHtml(ui("facts", lang).furnishing)}</strong><span>${escapeHtml(copy.furnishing)}</span></div>
          <div class="fact"><strong>${escapeHtml(ui("facts", lang).flooring)}</strong><span>${escapeHtml(copy.flooring)}</span></div>
          <div class="fact"><strong>${escapeHtml(ui("facts", lang).daily)}</strong><span>${escapeHtml(copy.dailyLabel)}</span></div>
          <div class="fact"><strong>${escapeHtml(ui("facts", lang).source)}</strong><span>${escapeHtml(copy.sourceLabel)}</span></div>
        </div>
        ${renderCostBreakdown(costs, lang)}
        ${copy.valueSignal || copy.concession ? `
          <div class="card-callouts">
            ${copy.valueSignal ? `
              <div class="card-callout value-callout">
                <strong>${escapeHtml(ui("facts", lang).value)}</strong>
                <span>${escapeHtml(copy.valueSignal)}</span>
              </div>
              <div class="value-caveat">${escapeHtml(VALUE_SIGNAL_CAVEATS[lang] || VALUE_SIGNAL_CAVEATS.en)}</div>
            ` : ""}
            ${copy.concession ? `
              <div class="card-callout concession-callout">
                <strong>${escapeHtml(ui("facts", lang).concession)}</strong>
                <span>${escapeHtml(copy.concession)}</span>
              </div>
            ` : ""}
          </div>
        ` : ""}

        <div class="reason-grid">
          <div class="reason-box">
            <h4>${escapeHtml(ui("sections", lang).bestFor)}</h4>
            <ul>${renderList(copy.bestFor.slice(0, 3))}</ul>
          </div>
          <div class="reason-box">
            <h4>${escapeHtml(ui("sections", lang).tradeoffs)}</h4>
            <ul>${renderList(copy.tradeoffs.slice(0, 3))}</ul>
          </div>
          <div class="reason-box">
            <h4>${escapeHtml(ui("sections", lang).verify)}</h4>
            <ul>${renderList(copy.verify.slice(0, 4))}</ul>
          </div>
        </div>

        <div class="breakdown">${bars}</div>

        <div class="tags">
          ${renderRuleBadges(apartment, answers, lang)}
          <span class="tag ${confidenceClass(apartment.confidence)}">${escapeHtml(copy.confidenceLabel)}</span>
          ${apartment.isExploration ? `<span class="tag low">${escapeHtml(ui("tags", lang).exploration)}</span>` : ""}
          ${copy.concession ? `<span class="tag warn">${escapeHtml(ui("tags", lang).concession)}</span>` : ""}
          <span class="tag warn">${escapeHtml(ui("tags", lang).rent)}</span>
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
    .sort((a, b) => compareResults(a, b, answers));
}

function rankQuickStartApartments(answers) {
  if (isOutOfScope(answers)) return [];
  return APARTMENTS
    .filter(isRankableApartment)
    .map(apartment => scoreApartment(apartment, answers))
    .sort((a, b) => {
      const campusDiff = (b.apartment.campusScores[answers.campus] || 1) - (a.apartment.campusScores[answers.campus] || 1);
      if (campusDiff !== 0) return campusDiff;
      return compareResults(a, b, answers);
    });
}

function setCampusValue(form, campus) {
  const input = form.querySelector(`input[name="campus"][value="${campus}"]`);
  if (input) input.checked = true;
}

function setActiveQuickStart(campus) {
  document.querySelectorAll(".quick-start-button").forEach(button => {
    button.classList.toggle("is-active", button.dataset.campus === campus);
  });
}

function scrollResultsIntoView() {
  const panel = document.querySelector(".results-panel");
  if (panel && typeof panel.scrollIntoView === "function") {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function runQuickStart(form, campus) {
  setCampusValue(form, campus);
  setActiveQuickStart(campus);
  const answers = getFormValues(form);
  latestAnswers = answers;
  latestEntry = `quick_start:${campus}`;
  if (isOutOfScope(answers)) {
    latestResults = [];
    renderOutOfScope(answers);
    scrollResultsIntoView();
    return [];
  }
  const results = rankQuickStartApartments(answers);
  latestResults = results;
  renderResults(results, answers, { quickStart: true });
  scrollResultsIntoView();
  return results;
}

function runMatch(form, entry = "full_quiz") {
  const answers = getFormValues(form);
  latestAnswers = answers;
  latestEntry = entry;
  setActiveQuickStart("");
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
  runMatch(form, "default");
}

function init() {
  const form = document.getElementById("fit-form");
  const reset = document.getElementById("reset-button");
  const emailFeedback = document.getElementById("email-feedback");
  const quickStartButtons = [...document.querySelectorAll(".quick-start-button")];
  enforceMaxSelections(form, "setup", 2);
  enforceMaxSelections(form, "priority", 3);
  form.addEventListener("submit", event => {
    event.preventDefault();
    runMatch(form);
  });
  form.addEventListener("change", event => {
    if (event.target.name !== "setup" && event.target.name !== "priority") runMatch(form);
  });
  reset.addEventListener("click", () => resetForm(form));
  emailFeedback.addEventListener("click", () => openFeedbackEmail("feedback-status"));
  quickStartButtons.forEach(button => {
    button.addEventListener("click", () => runQuickStart(form, button.dataset.campus));
  });
  runMatch(form, "default");
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
    scorePriority,
    calculateCosts,
    formatMoney,
    weightsForAnswers,
    compareResults,
    budgetLabel,
    isOutOfScope,
    isRankableApartment,
    rankApartments,
    rankQuickStartApartments,
    escapeHtml,
    formatAnswersForShare,
    topResultNames,
    topReasons,
    entryLabel,
    ruleBadges,
    campusLabel,
    categoryLabel,
    answerValueLabel,
    apartmentCopy,
    utilityLabel,
    UI_TEXT,
    APARTMENT_TRANSLATIONS
  };
}
