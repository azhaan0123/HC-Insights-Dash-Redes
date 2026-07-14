/**
 * Rich mock data generators for the AI Action Layer.
 * Provides page-scoped insights, actions, and audit records
 * with realistic clinical reasoning chains for all agent types.
 */

import {
  type AgentType,
  type AIInsight,
  type AIAction,
  type AuditRecord,
  type PlanStep,
  type AIException,
  type ConfidenceTier,
  type ActionStatus,
  getConfidenceTier,
} from "./aiTypes";

// ─── Deterministic RNG (separate seed from main data) ───────────────────────
let _aiSeed = 42;
function aiRand(): number {
  _aiSeed = (_aiSeed * 1103515245 + 12345) & 0x7fffffff;
  return _aiSeed / 0x7fffffff;
}
function aiPick<T>(arr: T[]): T {
  return arr[Math.floor(aiRand() * arr.length)];
}
let _idCounter = 1000;
function aiId(prefix: string): string {
  return `${prefix}-${++_idCounter}`;
}

// ─── Page-Scoped Insights ──────────────────────────────────────────────────

const INSIGHTS_BY_ROUTE: Record<string, AIInsight[]> = {
  "/home": [
    {
      id: aiId("ins"),
      agentType: "cross-module",
      title: "3 metrics trending below target",
      description:
        "Active Patient count, Encounter Volume, and HCC Documentation Accuracy are all trending below your monthly targets. Combined impact: potential $42K revenue shortfall this quarter.",
      reasoning:
        "Compared 30-day rolling averages against org-level targets set in Q1 planning. Active Patients down 4.2%, Encounters down 7.8%, Doc Accuracy at 77.3% vs 85% target.",
      confidence: 0.92,
      confidenceTier: "high",
      actions: [
        { label: "Review recommendations", actionType: "flag-review" },
        { label: "Generate executive summary", actionType: "generate-report" },
      ],
      pageScopes: ["/home"],
      priority: "high",
      isCrossModule: true,
      metric: {
        value: "$42K",
        label: "Projected quarterly shortfall",
        trend: "down",
        trendValue: "-4.2%",
      },
    },
    {
      id: aiId("ins"),
      agentType: "cross-module",
      title: "Employer X leakage rate 40% above Employer Y",
      description:
        "Patients enrolled via CedarBridge Manufacturing have 40% higher external leakage rates than BlueSky Enterprises. 12 patients accessed out-of-network urgent care in the last 30 days.",
      reasoning:
        "Cross-referenced enrollment data (Hint) with claims data for last 90 days. CedarBridge: 18% leakage rate. BlueSky: 11% leakage rate. National DPC average: 14%.",
      confidence: 0.88,
      confidenceTier: "medium",
      actions: [
        { label: "View leakage details", actionType: "flag-review" },
        { label: "Draft employer communication", actionType: "generate-report" },
      ],
      pageScopes: ["/home"],
      priority: "medium",
      isCrossModule: true,
    },
  ],

  "/engagement/active-patients": [
    {
      id: aiId("ins"),
      agentType: "care-gap",
      title: "4 members showing disengagement signals",
      description:
        "These patients have declining touch ratios, lapsed refills, and reduced Spruce message volume over the past 60 days — they're trending toward membership cancellation.",
      reasoning:
        "Analyzed encounter cadence, Spruce message frequency (Spruce), and prescription refill patterns (Elation) for all active patients. Flagged patients with ≥2 declining metrics.",
      confidence: 0.85,
      confidenceTier: "medium",
      actions: [
        { label: "Draft outreach", actionType: "send-message" },
        { label: "Schedule check-in calls", actionType: "book-appointment" },
      ],
      pageScopes: ["/engagement/active-patients"],
      priority: "high",
      metric: {
        value: "4",
        label: "Patients at churn risk",
        trend: "up",
        trendValue: "+2 from last week",
      },
    },
  ],

  "/engagement/encounters": [
    {
      id: aiId("ins"),
      agentType: "care-gap",
      title: "After-hours volume up 23% this week",
      description:
        "12 after-hours encounters could have been triaged to virtual visits instead. This is creating unnecessary triage burden and may indicate staffing gaps.",
      reasoning:
        "Compared after-hours encounter volume (Elation) against prior 4-week average. Classified encounter types to identify those eligible for virtual visit routing.",
      confidence: 0.91,
      confidenceTier: "high",
      actions: [
        {
          label: "Consider virtual visit routing",
          actionType: "queue-outreach",
        },
        { label: "Analyze staffing impact", actionType: "generate-report" },
      ],
      pageScopes: ["/engagement/encounters"],
      priority: "medium",
      metric: {
        value: "+23%",
        label: "After-hours volume increase",
        trend: "up",
        trendValue: "12 triageable cases",
      },
    },
  ],

  "/engagement/digital-engagement": [
    {
      id: aiId("ins"),
      agentType: "care-gap",
      title: "12 inbound messages need urgency triage",
      description:
        "Auto-categorized 12 unread Spruce messages: 2 clinical urgency (escalation needed), 7 routine (draft responses ready), 3 scheduling requests (auto-bookable).",
      reasoning:
        "Scanned inbound Spruce message content for urgency keywords, clinical terminology, and scheduling intent patterns.",
      confidence: 0.87,
      confidenceTier: "medium",
      actions: [
        { label: "Review triage results", actionType: "triage" },
        { label: "Send drafted responses", actionType: "send-message" },
      ],
      pageScopes: ["/engagement/digital-engagement"],
      priority: "high",
    },
  ],

  "/utilization-gaps": [
    {
      id: aiId("ins"),
      agentType: "care-gap",
      title: "23 care gaps ranked by risk + quality impact",
      description:
        "Combined clinical risk tier, chronic condition load, and MIPS measure impact to re-prioritize your action queue. Top 5 patients would close 3 quality measures if contacted this week.",
      reasoning:
        "Merged data from Action Centre cohorts (Hint enrollment + Elation encounters), chronic condition registry, and ACO quality measure gaps. Ranked by composite score: clinical risk (40%) + quality impact (35%) + revenue at risk (25%).",
      confidence: 0.94,
      confidenceTier: "high",
      actions: [
        { label: "Generate outreach plan", actionType: "queue-outreach" },
        { label: "View patient details", actionType: "flag-review" },
      ],
      pageScopes: ["/utilization-gaps"],
      priority: "critical",
      metric: {
        value: "23",
        label: "Care gaps prioritized",
        trend: "down",
        trendValue: "-4 from last week",
      },
    },
    {
      id: aiId("ins"),
      agentType: "care-gap",
      title: "External leakage: 6 patients used out-of-network care",
      description:
        "6 patients received care outside the DPC network in the past 14 days. Combined out-of-network spend: $2,140. All are reachable via Spruce.",
      reasoning:
        "Cross-referenced claims feed (last 14 days) with DPC enrollment roster (Hint). Identified claims from non-network providers for enrolled members.",
      confidence: 0.91,
      confidenceTier: "high",
      actions: [
        { label: "Draft return-to-network outreach", actionType: "send-message" },
        { label: "View claims details", actionType: "flag-review" },
      ],
      pageScopes: ["/utilization-gaps"],
      priority: "high",
    },
  ],

  "/hcc/coding-queue": [
    {
      id: aiId("ins"),
      agentType: "hcc-coding",
      title: "12 suspect diagnoses from prescription/lab patterns",
      description:
        "Scanned active prescriptions and lab values to identify conditions clinically present but missing from billing codes. High-confidence opportunities ranked by revenue impact.",
      reasoning:
        "Cross-referenced Elation prescription records with ICD-10 codes on file. Identified 12 patients where medication patterns suggest undocumented conditions.",
      confidence: 0.89,
      confidenceTier: "medium",
      actions: [
        { label: "Review with evidence", actionType: "submit-code" },
        { label: "Queue for clinical review", actionType: "flag-review" },
      ],
      pageScopes: ["/hcc/coding-queue"],
      priority: "critical",
      metric: {
        value: "12",
        label: "Coding opportunities",
        trend: "up",
        trendValue: "+3 new this week",
      },
    },
  ],

  "/hcc/overview": [
    {
      id: aiId("ins"),
      agentType: "hcc-coding",
      title: "26 recapture opportunities expiring this quarter",
      description:
        "26 patients have chronic HCC diagnoses that need Annual Wellness Visit revalidation before Q3 end. Prioritized by risk-adjustment revenue impact.",
      reasoning:
        "Analyzed HCC recapture calendar against AWV completion status (Elation). Ranked by HCC coefficient value × probability of successful recapture.",
      confidence: 0.93,
      confidenceTier: "high",
      actions: [
        { label: "Prioritize AWV scheduling", actionType: "book-appointment" },
        { label: "Generate recapture report", actionType: "generate-report" },
      ],
      pageScopes: ["/hcc/overview"],
      priority: "high",
      metric: {
        value: "26",
        label: "Expiring recaptures",
        trend: "up",
        trendValue: "~$78K at risk",
      },
    },
  ],

  "/hcc/bulk-audit": [
    {
      id: aiId("ins"),
      agentType: "hcc-coding",
      title: "Pre-screened 45 encounters for accuracy gaps",
      description:
        "8 encounters have documentation that doesn't support the billed HCC code. Flagged before submission to prevent audit risk.",
      reasoning:
        "Compared encounter notes (Elation) against billed ICD-10 codes for specificity, supporting evidence, and clinical consistency.",
      confidence: 0.86,
      confidenceTier: "medium",
      actions: [
        { label: "Review flagged encounters", actionType: "flag-review" },
        { label: "Generate audit summary", actionType: "generate-report" },
      ],
      pageScopes: ["/hcc/bulk-audit"],
      priority: "high",
    },
  ],

  "/outcomes/screenings": [
    {
      id: aiId("ins"),
      agentType: "clinical-outcomes",
      title: "8 patients unlikely to complete screening without intervention",
      description:
        "Behavioral prediction model identifies 8 patients who historically miss scheduled screenings. Targeted SMS reminders with ride-share links increase completion by 34%.",
      reasoning:
        "Analyzed 12-month screening history, appointment no-show rates, and Spruce response patterns. Patients with ≥2 prior missed screenings and low Spruce engagement flagged.",
      confidence: 0.82,
      confidenceTier: "medium",
      actions: [
        {
          label: "Send targeted reminders",
          actionType: "send-message",
        },
        { label: "Schedule nurse calls", actionType: "book-appointment" },
      ],
      pageScopes: ["/outcomes/screenings"],
      priority: "high",
      metric: {
        value: "8",
        label: "At-risk for non-compliance",
        trend: "flat",
      },
    },
  ],

  "/outcomes/lab-trends": [
    {
      id: aiId("ins"),
      agentType: "clinical-outcomes",
      title: "3 patients trending toward dangerous lab thresholds",
      description:
        "HbA1c rising steadily for 2 diabetic patients (currently 7.6 and 7.9, projected to exceed 8.0 within 6 weeks). 1 patient with worsening lipid panel.",
      reasoning:
        "Applied linear trend analysis to sequential lab results (Elation). Projected forward 6 weeks using 3-point moving average. Flagged when projected value exceeds clinical threshold.",
      confidence: 0.88,
      confidenceTier: "medium",
      actions: [
        {
          label: "Schedule proactive outreach",
          actionType: "queue-outreach",
        },
        { label: "Flag for clinical review", actionType: "flag-review" },
      ],
      pageScopes: ["/outcomes/lab-trends"],
      priority: "critical",
      metric: {
        value: "3",
        label: "Patients approaching thresholds",
        trend: "up",
        trendValue: "6-week projection",
      },
    },
  ],

  "/cost-savings": [
    {
      id: aiId("ins"),
      agentType: "claims-cost",
      title: "Mail-order conversion saves ~$2,400/month",
      description:
        "12 patients currently using retail pharmacy for chronic medications could be moved to mail-order. Projected savings: $2,400/month ($28,800/year).",
      reasoning:
        "Analyzed prescription refill data (Elation) for patients on ≥2 chronic medications filled at retail. Compared retail vs. mail-order costs using wholesale pricing.",
      confidence: 0.95,
      confidenceTier: "high",
      actions: [
        { label: "Generate conversion list", actionType: "generate-report" },
        { label: "Draft patient outreach", actionType: "send-message" },
      ],
      pageScopes: ["/cost-savings"],
      priority: "high",
      metric: {
        value: "$2,400",
        label: "Monthly savings opportunity",
        trend: "up",
        trendValue: "$28.8K/year",
      },
    },
  ],

  "/claims": [
    {
      id: aiId("ins"),
      agentType: "claims-cost",
      title: "Cost anomaly: imaging spend spike detected",
      description:
        "3 patients with sudden high imaging costs ($4,200 combined) in the past 2 weeks. One patient has 4 MRI claims in 30 days — possible duplicate billing or care fragmentation.",
      reasoning:
        "Applied statistical anomaly detection to claims feed. Flagged spend that exceeds 2σ from patient's 6-month rolling average.",
      confidence: 0.84,
      confidenceTier: "medium",
      actions: [
        { label: "Investigate claims", actionType: "flag-review" },
        { label: "Contact patients", actionType: "queue-outreach" },
      ],
      pageScopes: ["/claims"],
      priority: "high",
    },
  ],

  "/mips/dashboard": [
    {
      id: aiId("ins"),
      agentType: "mips-aco",
      title: "Closing 3 measures adds +4.2 points ≈ $18K",
      description:
        "Your current projected MIPS score is 77.9/100. Closing Depression Screening (PHQ-9), Diabetes A1c Control, and Colorectal Cancer Screening would add 4.2 points and increase your payment adjustment by approximately $18,000.",
      reasoning:
        "Projected forward based on current measure completion rates, outstanding patient lists, and CMS payment adjustment formula for your TIN size.",
      confidence: 0.91,
      confidenceTier: "high",
      actions: [
        { label: "Generate measure action queue", actionType: "queue-outreach" },
        {
          label: "View dollar impact per measure",
          actionType: "generate-report",
        },
      ],
      pageScopes: ["/mips/dashboard"],
      priority: "critical",
      metric: {
        value: "+4.2",
        label: "Points from closing 3 measures",
        trend: "up",
        trendValue: "≈$18K payment adjustment",
      },
    },
  ],

  "/aco/provider-performance": [
    {
      id: aiId("ins"),
      agentType: "mips-aco",
      title: "Dr. Smith's depression screening at 62% vs 78% org avg",
      description:
        "Dr. Smith has 23 patients eligible for PHQ-9 depression screening who haven't been screened. Completing these would bring their rate to 84% — above org average.",
      reasoning:
        "Compared individual provider measure rates against organization-wide averages from ACO quality data. Identified providers ≥10% below average on any measure.",
      confidence: 0.93,
      confidenceTier: "high",
      actions: [
        { label: "View 23 patients to screen", actionType: "flag-review" },
        { label: "Generate coaching summary", actionType: "generate-report" },
      ],
      pageScopes: ["/aco/provider-performance"],
      priority: "high",
    },
  ],

  "/aco/gaps": [
    {
      id: aiId("ins"),
      agentType: "mips-aco",
      title: "14 open ACO measures convertible to patient actions",
      description:
        "Each open measure has been converted into a specific patient list with pre-drafted outreach templates. Closing all 14 would improve your ACO quality score by 6.1%.",
      reasoning:
        "Mapped ACO quality measure gaps to individual patient records (Elation). Generated outreach templates based on measure type and patient communication preferences.",
      confidence: 0.89,
      confidenceTier: "medium",
      actions: [
        { label: "Create outreach batches", actionType: "queue-outreach" },
        { label: "View by measure", actionType: "flag-review" },
      ],
      pageScopes: ["/aco/gaps"],
      priority: "high",
    },
  ],

  "/employer/overview": [
    {
      id: aiId("ins"),
      agentType: "employer",
      title: "Workforce 15% above national avg in pharmacy spend",
      description:
        "CedarBridge Manufacturing's pharmacy spend per member is $342/month vs. national average of $298/month. Top 3 high-impact interventions identified.",
      reasoning:
        "Benchmarked employer-level claims data against CMS national averages for employer size bracket and industry. Identified pharmacy, imaging, and ER visit as top variance categories.",
      confidence: 0.9,
      confidenceTier: "high",
      actions: [
        { label: "View top 3 interventions", actionType: "flag-review" },
        {
          label: "Generate quarterly employer report",
          actionType: "generate-report",
        },
      ],
      pageScopes: ["/employer/overview"],
      priority: "high",
      metric: {
        value: "+15%",
        label: "Above national pharmacy avg",
        trend: "up",
        trendValue: "$342 vs $298/member/mo",
      },
    },
  ],

  "/employer/high-cost": [
    {
      id: aiId("ins"),
      agentType: "employer",
      title: "4 patients showing rising-cost early warning patterns",
      description:
        "Before becoming top-5% spenders: 2 patients with increasing ER visits, 1 with escalating prescription costs, 1 with new specialist referral pattern.",
      reasoning:
        "Applied 90-day cost trajectory analysis to all enrolled members. Flagged patients whose monthly cost trend would place them in top-5% within 60 days.",
      confidence: 0.83,
      confidenceTier: "medium",
      actions: [
        { label: "Trigger care coordination", actionType: "queue-outreach" },
        { label: "Review cost details", actionType: "flag-review" },
      ],
      pageScopes: ["/employer/high-cost"],
      priority: "high",
    },
  ],

  "/employer/benchmarking": [
    {
      id: aiId("ins"),
      agentType: "employer",
      title: "2 benchmark gaps with highest improvement potential",
      description:
        "Preventive screening completion (68% vs 82% national) and chronic condition management adherence (71% vs 85% national) represent the largest gaps with clear intervention paths.",
      reasoning:
        "Compared employer cohort against CMS Quality Reporting benchmark data. Ranked gaps by intervention feasibility × potential cost savings.",
      confidence: 0.87,
      confidenceTier: "medium",
      actions: [
        { label: "Generate intervention plan", actionType: "generate-report" },
        { label: "View gap details", actionType: "flag-review" },
      ],
      pageScopes: ["/employer/benchmarking"],
      priority: "medium",
    },
  ],
};

/** Get insights for a given route path. Falls back to cross-module insights. */
export function getInsightsForRoute(route: string): AIInsight[] {
  if (INSIGHTS_BY_ROUTE[route]) return INSIGHTS_BY_ROUTE[route];
  // Try parent route
  const segments = route.split("/").filter(Boolean);
  while (segments.length > 0) {
    const candidate = "/" + segments.join("/");
    if (INSIGHTS_BY_ROUTE[candidate]) return INSIGHTS_BY_ROUTE[candidate];
    segments.pop();
  }
  return INSIGHTS_BY_ROUTE["/home"] || [];
}

// ─── Page-Scoped Preset Questions ──────────────────────────────────────────

const PRESETS_BY_ROUTE: Record<string, string[]> = {
  "/home": [
    "Summarize all org-wide metric anomalies",
    "Which patients need the most urgent attention?",
    "Show cross-module risk patterns",
    "Generate executive dashboard summary",
  ],
  "/engagement/active-patients": [
    "Show patients trending toward churn",
    "Who hasn't been seen in 90+ days?",
    "Draft re-engagement outreach for high-risk",
    "Compare touch ratios across employers",
  ],
  "/engagement/encounters": [
    "Show after-hours encounter trends",
    "Which encounters could be virtual visits?",
    "Identify staffing gap patterns",
    "Compare in-person vs virtual utilization",
  ],
  "/engagement/digital-engagement": [
    "Triage unread Spruce messages by urgency",
    "Draft responses for routine inquiries",
    "Show response-time benchmarks",
    "Identify messages needing clinical escalation",
  ],
  "/utilization-gaps": [
    "Rank care gaps by risk + revenue impact",
    "Generate outreach plan for top 10 patients",
    "Show external leakage details",
    "Which gaps close MIPS measures?",
  ],
  "/hcc/coding-queue": [
    "Show suspect diagnoses from prescription patterns",
    "Which patients are on metformin without diabetes code?",
    "Suggest more specific ICD-10 codes",
    "Pre-screen documentation for accuracy",
  ],
  "/hcc/overview": [
    "Rank patients by AWV recapture opportunity",
    "Show expiring chronic diagnoses",
    "Calculate revenue impact of AWV completion",
    "Identify specificity review opportunities",
  ],
  "/hcc/bulk-audit": [
    "Pre-screen encounters for documentation gaps",
    "Flag encounters where docs don't support HCC codes",
    "Generate audit readiness report",
    "Show documentation accuracy by provider",
  ],
  "/outcomes/screenings": [
    "Which patients are most likely to miss screenings?",
    "Generate targeted screening reminders",
    "Show screening completion by type",
    "Predict non-compliance based on history",
  ],
  "/outcomes/lab-trends": [
    "Flag patients with worsening lab trends",
    "Show HbA1c trajectories for diabetic cohort",
    "Which patients need proactive lab orders?",
    "Detect lab value anomalies",
  ],
  "/cost-savings": [
    "Identify mail-order pharmacy conversion candidates",
    "Calculate ROI of top 5 interventions",
    "Show cost anomalies this month",
    "Compare savings vs traditional plan",
  ],
  "/claims": [
    "Detect unusual spending spikes",
    "Show duplicate billing patterns",
    "Identify high-frequency CPT codes",
    "Flag possible care fragmentation",
  ],
  "/mips/dashboard": [
    "Project MIPS score forward with open measures",
    "Calculate dollar impact of closing each gap",
    "Which 3 measures give the most points?",
    "Show provider-level MIPS breakdowns",
  ],
  "/aco/provider-performance": [
    "Which providers lag on depression screening?",
    "Generate coaching recommendations",
    "Show patients to screen for each provider",
    "Compare provider rates vs org average",
  ],
  "/aco/gaps": [
    "Convert gap list to patient action queues",
    "Draft outreach templates by measure type",
    "Show which gaps are most impactful",
    "Generate compliance report",
  ],
  "/employer/overview": [
    "Compare metrics against national benchmarks",
    "Generate quarterly employer narrative",
    "Show top 3 cost reduction opportunities",
    "Draft stakeholder-ready summary",
  ],
  "/employer/high-cost": [
    "Identify rising-cost patients before they peak",
    "Show ER visit trends for this employer",
    "Trigger care coordination for at-risk members",
    "Compare cost trajectories across cohorts",
  ],
  "/employer/benchmarking": [
    "Show benchmark gaps by category",
    "Identify highest-impact intervention areas",
    "Compare employer against peer group",
    "Generate improvement roadmap",
  ],
};

export function getPresetsForRoute(route: string): string[] {
  if (PRESETS_BY_ROUTE[route]) return PRESETS_BY_ROUTE[route];
  const segments = route.split("/").filter(Boolean);
  while (segments.length > 0) {
    const candidate = "/" + segments.join("/");
    if (PRESETS_BY_ROUTE[candidate]) return PRESETS_BY_ROUTE[candidate];
    segments.pop();
  }
  return PRESETS_BY_ROUTE["/home"] || [];
}

// ─── Mock AI Actions (Pending Approval Queue) ──────────────────────────────

export const MOCK_ACTIONS: AIAction[] = [
  {
    id: aiId("act"),
    agentType: "hcc-coding",
    title: "Add diabetes ICD-10 for James Smith",
    description:
      "Patient is on metformin (14 months), HbA1c = 7.8 (latest lab, 2 months ago). No diabetes ICD-10 on file.",
    confidence: 0.92,
    confidenceTier: "high",
    reasoning:
      "Metformin prescribed 14 months ago. HbA1c = 7.8 (latest lab, 2 months ago). No diabetes ICD-10 on file. Active prescription pattern consistent with Type 2 Diabetes management.",
    evidenceItems: [
      "Rx: Metformin 500mg BID — prescribed 01/15/2025",
      "Lab: HbA1c = 7.8% — collected 05/02/2026",
      "No ICD-10 E11.x code on file",
      "BMI: 31.2 (Obese class I)",
    ],
    suggestedAction: "Add ICD-10: E11.9 — Type 2 diabetes mellitus without complications",
    actionType: "submit-code",
    approvalPattern: "pre-action",
    targetPatients: [
      { id: "1", name: "James Smith", condition: "Suspected T2DM" },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isUndoable: true,
    undoWindowMs: 30000,
    priority: "critical",
    reversibility: "irreversible",
    volumeTier: "medium-volume",
    latencyTolerance: "days",
    timeoutPolicy: {
      durationHours: 48,
      actionOnTimeout: "auto-reject",
      escalateToRole: "Coding Auditor (CPC)",
      deadlineIso: new Date(Date.now() + 47 * 3600000).toISOString(),
    },
    alternativesConsidered: [
      "E11.65 (Type 2 diabetes with hyperglycemia) — discarded because fasting glucose is currently controlled under medication",
      "R73.03 (Prediabetes) — discarded because HbA1c of 7.8% exceeds the 6.5% diagnostic threshold for T2DM",
    ],
    selfReflectionVerification: {
      status: "verified",
      checksPassed: [
        "Metformin 500mg prescription is active in Elation EHR (Verified 07/14/2026)",
        "HbA1c lab result 7.8% verified from Quest Diagnostics feed within 90 days",
        "Knowledge Graph verified: E11.9 is valid ICD-10 billable leaf node under E11 hierarchy",
        "No conflicting diabetes code already present on active problem list",
      ],
      verifiedAgainst: ["Elation EHR Problem List", "Hint Core Claims Feed"],
    },
    ragCitations: [
      {
        sourceSystem: "Elation EHR",
        recordId: "ENC-2026-8819",
        description: "Encounter note by Dr. Hernandez noting metformin tolerance",
        timestamp: "2026-05-02T14:22:00Z",
      },
      {
        sourceSystem: "Elation EHR",
        recordId: "LAB-2026-4402",
        description: "Quest Diagnostics HbA1c panel result: 7.8%",
        timestamp: "2026-05-02T09:15:00Z",
      },
    ],
    suggestedCodes: [
      {
        code: "E11.9",
        description: "Type 2 diabetes mellitus without complications",
        score: 0.92,
      },
      {
        code: "E11.65",
        description: "Type 2 diabetes mellitus with hyperglycemia",
        score: 0.78,
      },
    ],
  },
  {
    id: aiId("act"),
    agentType: "hcc-coding",
    title: "Upgrade diabetes code specificity for Patricia Smith",
    description:
      "Current code: E11.9 (unspecified). Lab values and medication pattern suggest E11.22 (Type 2 with diabetic chronic kidney disease).",
    confidence: 0.76,
    confidenceTier: "medium",
    reasoning:
      "Metformin detected, but also prescribed for PCOS in some patients. eGFR = 48 mL/min (Stage 3b CKD). Current diabetes code is unspecified. Kidney function data supports more specific coding.",
    evidenceItems: [
      "Current code: E11.9 — diabetes unspecified",
      "Lab: eGFR = 48 mL/min — Stage 3b CKD",
      "Rx: Metformin + Lisinopril (renal protective)",
      "Note: Metformin also used for PCOS — verify indication",
    ],
    suggestedAction:
      "Upgrade to E11.22 — Type 2 diabetes with diabetic chronic kidney disease",
    actionType: "submit-code",
    approvalPattern: "pre-action",
    targetPatients: [
      { id: "2", name: "Patricia Smith", condition: "DM w/ CKD suspected" },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isUndoable: true,
    undoWindowMs: 30000,
    priority: "high",
    reversibility: "irreversible",
    volumeTier: "medium-volume",
    latencyTolerance: "days",
    timeoutPolicy: {
      durationHours: 48,
      actionOnTimeout: "auto-reject",
      escalateToRole: "Lead Coding Auditor",
    },
    alternativesConsidered: [
      "Keep E11.9 + add separate N18.32 code — discarded because ICD-10 coding guidelines mandate combination code E11.22 when both diabetes and CKD exist",
    ],
    selfReflectionVerification: {
      status: "flagged",
      checksPassed: [
        "eGFR = 48 mL/min lab verified from lab feed",
        "Lisinopril active prescription confirmed",
      ],
      checksFailed: [
        "Clinical ambiguity: Metformin indication in encounter history lists PCOS in 2023. Clinician verification required before upgrading code.",
      ],
      verifiedAgainst: ["Elation EHR Problem List"],
    },
    ragCitations: [
      {
        sourceSystem: "Elation EHR",
        recordId: "LAB-2026-3391",
        description: "Comprehensive Metabolic Panel: eGFR 48 mL/min/1.73m2",
        timestamp: "2026-04-18T11:05:00Z",
      },
    ],
    suggestedCodes: [
      {
        code: "E11.22",
        description:
          "Type 2 diabetes mellitus with diabetic chronic kidney disease",
        score: 0.76,
      },
    ],
  },
  {
    id: aiId("act"),
    agentType: "care-gap",
    title: "Outreach batch: 23 engagement gap patients",
    description:
      "Personalized Spruce messages for 23 patients with 60+ day encounter gaps. Messages include scheduling links and DPC benefits reminder.",
    confidence: 0.94,
    confidenceTier: "high",
    reasoning:
      "Identified 23 patients from Engagement Gap cohort with no DPC encounter in 60+ days. Combined with chronic condition data to prioritize by clinical risk. All patients have active Spruce accounts.",
    evidenceItems: [
      "23 patients with 60+ day encounter gap",
      "All have active Spruce accounts",
      "12 have chronic conditions requiring follow-up",
      "Average gap: 78 days",
    ],
    suggestedAction: "Send personalized Spruce outreach to 23 patients",
    actionType: "send-message",
    approvalPattern: "pre-action",
    targetPatients: [
      { id: "p1", name: "Robyn Williams", condition: "Hypertension" },
      { id: "p2", name: "Kristen Anderson", condition: "Type 2 Diabetes" },
      { id: "p3", name: "Justin Hobbs", condition: "Asthma" },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isUndoable: true,
    undoWindowMs: 30000,
    priority: "high",
    reversibility: "irreversible",
    volumeTier: "high-volume",
    latencyTolerance: "hours",
    timeoutPolicy: {
      durationHours: 24,
      actionOnTimeout: "auto-escalate",
      escalateToRole: "Practice Manager",
      deadlineIso: new Date(Date.now() + 23.5 * 3600000).toISOString(),
    },
    alternativesConsidered: [
      "Send automated voice reminder calls — discarded because patient communication preferences show 91% preference for asynchronous Spruce secure messaging",
      "Immediate urgent check-in flag — discarded because none of the 23 patients have acute symptom flags in recent triage logs",
    ],
    selfReflectionVerification: {
      status: "verified",
      checksPassed: [
        "All 23 patient Spruce UUIDs verified active and opted-in to secure messaging",
        "Checked encounter schedules: zero scheduled appointments on calendar for next 30 days",
        "No opt-out flags or DPC membership cancellation pending in Hint Core",
      ],
      verifiedAgainst: ["Hint Core Membership API", "Spruce Health Roster", "Elation Appointments"],
    },
    ragCitations: [
      {
        sourceSystem: "Hint Core",
        recordId: "SUB-99201-ALL",
        description: "Active DPC membership verification across 23 target patients",
        timestamp: "2026-07-14T08:00:00Z",
      },
    ],
    draftContent:
      "Hi [Patient Name],\n\nIt's been a while since your last visit with us. As your DPC practice, we're here to help you stay on top of your health — at no additional cost to you.\n\nWe'd love to schedule a check-in. You can book directly here: [scheduling link]\n\nYour care team is always just a message away.\n\n— [Practice Name]",
    planSteps: [
      {
        id: "s1",
        label: "Identify patients",
        description: "Filter engagement gap cohort for 60+ day gaps",
        confidence: 0.98,
        confidenceTier: "high",
        status: "pending",
        isEditable: false,
        isSkippable: false,
      },
      {
        id: "s2",
        label: "Draft 23 messages",
        description: "Personalize Spruce messages with patient names and scheduling links",
        confidence: 0.94,
        confidenceTier: "high",
        status: "pending",
        isEditable: true,
        isSkippable: false,
      },
      {
        id: "s3",
        label: "Schedule sends",
        description: "Queue messages for delivery tomorrow at 9:00 AM",
        confidence: 0.96,
        confidenceTier: "high",
        status: "pending",
        isEditable: true,
        isSkippable: false,
      },
      {
        id: "s4",
        label: "Log outreach",
        description: "Record outreach attempts in care gap tracker",
        confidence: 0.99,
        confidenceTier: "high",
        status: "pending",
        isEditable: false,
        isSkippable: true,
      },
      {
        id: "s5",
        label: "Update quality measures",
        description: "Update 4 ACO quality measure scores affected by outreach",
        confidence: 0.88,
        confidenceTier: "medium",
        status: "pending",
        isEditable: true,
        isSkippable: true,
      },
    ],
  },
  {
    id: aiId("act"),
    agentType: "mips-aco",
    title: "Depression screening action queue — Dr. Smith",
    description:
      "23 patients eligible for PHQ-9 screening. Completing these would raise Dr. Smith's rate from 62% to 84%.",
    confidence: 0.91,
    confidenceTier: "high",
    reasoning:
      "Identified from ACO Provider Performance data. Dr. Smith's depression screening rate is 62% vs. org average of 78%. 23 specific patients due for PHQ-9 this quarter.",
    evidenceItems: [
      "Dr. Smith depression screening: 62%",
      "Org average: 78%",
      "23 patients eligible for PHQ-9",
      "Projected rate after completion: 84%",
    ],
    suggestedAction: "Generate screening action queue for Dr. Smith's panel",
    actionType: "queue-outreach",
    approvalPattern: "pre-action",
    status: "pending",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    isUndoable: false,
    priority: "high",
    reversibility: "reversible",
    volumeTier: "medium-volume",
    latencyTolerance: "days",
    timeoutPolicy: {
      durationHours: 24,
      actionOnTimeout: "auto-escalate",
      escalateToRole: "ACO Quality Director",
    },
    alternativesConsidered: [
      "Broadcast general depression awareness email — discarded because targeted individual PHQ-9 link dispatch achieves 4.2x higher completion rate",
    ],
    selfReflectionVerification: {
      status: "verified",
      checksPassed: [
        "Verified 23 patients are aged 12+ without active bipolar/depression diagnosis exclusion",
        "No PHQ-9 completed within the last 12 months in Elation encounters",
      ],
      verifiedAgainst: ["Elation EHR Flowsheets"],
    },
  },
  {
    id: aiId("act"),
    agentType: "claims-cost",
    title: "Mail-order pharmacy conversion — 12 patients",
    description:
      "12 patients currently on retail pharmacy could save $2,400/month with mail-order conversion.",
    confidence: 0.95,
    confidenceTier: "high",
    reasoning:
      "Analyzed prescription refill patterns for patients on ≥2 chronic medications filled at retail pharmacy. Compared costs using wholesale pricing database.",
    evidenceItems: [
      "12 patients on ≥2 chronic meds at retail",
      "Average retail cost: $286/mo per patient",
      "Mail-order equivalent: $86/mo per patient",
      "Projected savings: $2,400/month total",
    ],
    suggestedAction:
      "Draft mail-order conversion outreach for 12 eligible patients",
    actionType: "send-message",
    approvalPattern: "parallel-draft",
    status: "pending",
    createdAt: new Date(Date.now() - 9000000).toISOString(),
    isUndoable: true,
    priority: "medium",
    reversibility: "reversible",
    volumeTier: "high-volume",
    latencyTolerance: "hours",
    timeoutPolicy: {
      durationHours: 72,
      actionOnTimeout: "auto-approve",
    },
    alternativesConsidered: [
      "Directly notify retail pharmacies — discarded because patient consent must be obtained prior to transferring prescription refills",
    ],
    draftContent:
      "Hi [Patient Name],\n\nDid you know your DPC membership includes access to mail-order pharmacy at significantly reduced costs? For your current medications, you could save approximately $[savings]/month.\n\nWould you like us to help you switch? Reply YES and we'll handle the transfer.\n\n— [Practice Name]",
  },
  {
    id: aiId("act"),
    agentType: "clinical-outcomes",
    title: "Lab trend alert: HbA1c rising for 2 patients",
    description:
      "Two diabetic patients showing steady HbA1c increase over 3 consecutive labs. Projected to exceed 8.0 within 6 weeks.",
    confidence: 0.62,
    confidenceTier: "low",
    reasoning:
      "Lab values suggest possible worsening glycemic control, but data is based on 3-point trend which has wider confidence intervals. Most recent labs are 2-3 months old — recommend fresh labs before clinical intervention.",
    evidenceItems: [
      "Patient A: HbA1c trend 7.2 → 7.6 → 7.9 (over 9 months)",
      "Patient B: HbA1c trend 7.0 → 7.4 → 7.6 (over 8 months)",
      "Both patients last seen 3+ months ago",
      "⚠ Lab data is 2-3 months old — verify with fresh labs",
    ],
    suggestedAction:
      "Order fresh HbA1c labs and schedule follow-up if confirmed",
    actionType: "flag-review",
    approvalPattern: "selective-escalation",
    status: "pending",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    isUndoable: false,
    priority: "critical",
    reversibility: "reversible",
    volumeTier: "high-volume",
    latencyTolerance: "hours",
    timeoutPolicy: {
      durationHours: 12,
      actionOnTimeout: "auto-escalate",
      escalateToRole: "On-Call Clinical Nurse",
    },
    alternativesConsidered: [
      "Immediately escalate diabetes medication dosage — discarded because lab results exceed 60 days age and statistical trend requires fresh confirmatory draw (>2 SD threshold check)",
    ],
    selfReflectionVerification: {
      status: "flagged",
      checksPassed: ["3 historical lab trend data points verified"],
      checksFailed: [
        "Stale Data Warning: Most recent lab draw was 74 days ago. Confirmatory draw required.",
      ],
      verifiedAgainst: ["Elation EHR Lab Module"],
    },
  },
];

// ─── Mock Audit Records (12-Field Minimum Schema + Healthcare Requirements) ───

export const MOCK_AUDIT_RECORDS: AuditRecord[] = [
  {
    timestamp_ntp_utc: new Date(Date.now() - 86400000).toISOString(),
    ai_decision_id: "aud-001",
    authenticated_human_user: {
      user_id: "usr-dr-hernandez",
      name: "Dr. Jennifer Hernandez, MD",
      role: "Clinical Provider (MD/DO)",
      email: "j.hernandez@healthcompiler.com",
    },
    ai_system_identity: "Helix Core Copilot v3.4.1 (SOC2/HIPAA Certified)",
    model_version_pinned: "gemini-2.5-pro-0615-medical-v4",
    inputs_received: [
      {
        source: "Elation EHR",
        data_refs: ["PT0001-James-Smith", "RX-Metformin-500mg-BID", "LAB-HbA1c-7.8"],
        query_scope_phi: "Minimum necessary problem list, active Rx, and recent A1c labs",
      },
      {
        source: "Hint Core",
        data_refs: ["MEM-88210-ACTIVE"],
        query_scope_phi: "Membership billing status verification",
      },
    ],
    policy_rule_invoked: "HCC Suspect Diagnosis Protocol v2026.2 / Rule #402 (Rx-Lab-NoCode match)",
    human_readable_reasoning:
      "Patient James Smith prescribed metformin for 14 months with HbA1c of 7.8% (collected 2 months ago). No active diabetes ICD-10 code on problem list. Self-reflection verification passed with 100% hierarchy check. Recommended adding E11.9 to ensure accurate risk capture.",
    output_produced: "Add ICD-10 code E11.9 (Type 2 diabetes mellitus without complications)",
    downstream_action_taken: {
      system: "Elation EHR",
      action_type: "CREATE_PROBLEM_LIST_ENTRY",
      target_id: "PROB-99182-E119",
      correlation_id: "corr-8812-elation-hcc",
    },
    human_review_disposition: {
      status: "approved",
      reviewer_id: "usr-dr-hernandez",
      decided_at: new Date(Date.now() - 86340000).toISOString(),
      review_duration_ms: 22000,
      override_rationale: "Clinically confirmed. Patient active on metformin with uncontrolled A1c.",
    },
    tamper_evident_proof: "sha256:4f8b2c1a99e23b8117c458390b1e4f62d1a88c3e174b099238f4d50278103c81",
    is_phi_access: true,
    retention_policy: "HIPAA_6_YEARS",

    // Legacy quick compatibility fields
    workflow: "hcc-coding",
    input_ref: "PT0001 — James Smith",
    model_version: "helix-v2.4.1",
    prompt_version: "hcc-suspect-v3",
    raw_output: "E11.9 — Type 2 diabetes, confidence: 0.92",
    final_output: "E11.9 — Approved as suggested",
    confidence: 0.92,
    confidence_tier: "high",
    risk_tier: "high",
    status: "approved",
    reviewer_id: "Dr. Jennifer Hernandez, MD",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    decided_at: new Date(Date.now() - 86340000).toISOString(),
    review_duration_ms: 22000,
  },
  {
    timestamp_ntp_utc: new Date(Date.now() - 172800000).toISOString(),
    ai_decision_id: "aud-002",
    authenticated_human_user: {
      user_id: "usr-pm-davis",
      name: "Sarah Davis, CPC",
      role: "Practice Manager",
      email: "s.davis@healthcompiler.com",
    },
    ai_system_identity: "Helix Core Copilot v3.4.1 (SOC2/HIPAA Certified)",
    model_version_pinned: "gemini-2.5-pro-0615-medical-v4",
    inputs_received: [
      {
        source: "Spruce Health",
        data_refs: ["ROSTER-ENGAGEMENT-GAP-18-PATIENTS"],
        query_scope_phi: "Secure messaging preference and encounter gap calculation (>90 days)",
      },
    ],
    policy_rule_invoked: "Patient Outreach Orchestration v2026.1 / Rule #109 (Cadence Check)",
    human_readable_reasoning:
      "Identified 18 patients with >90 day encounter gap. Drafted personalized Spruce secure messages. Reviewer edited target cohort before dispatch to exclude 2 currently hospitalized members.",
    output_produced: "Batch dispatch of 18 Spruce secure messages",
    downstream_action_taken: {
      system: "Spruce API",
      action_type: "DISPATCH_BATCH_MESSAGE",
      target_id: "BATCH-SPRUCE-20260712",
      correlation_id: "corr-7718-spruce-outreach",
    },
    human_review_disposition: {
      status: "edited",
      reviewer_id: "usr-pm-davis",
      decided_at: new Date(Date.now() - 172680000).toISOString(),
      review_duration_ms: 45000,
      reviewer_reason: "wrong-patient",
      reviewer_note: "Removed 2 patients who are currently hospitalized",
      override_rationale: "Edited cohort from 18 to 16 members to avoid messaging hospitalized patients.",
    },
    tamper_evident_proof: "sha256:9a3e51f88c02b1c4e7d80012f4553a990e1011c3b1238981109912a7711d9901",
    is_phi_access: true,
    retention_policy: "HIPAA_6_YEARS",

    // Legacy quick compatibility fields
    workflow: "care-gap",
    input_ref: "Engagement Gap cohort — 18 patients",
    model_version: "helix-v2.4.1",
    prompt_version: "outreach-draft-v2",
    raw_output: "Send Spruce SMS to 18 patients with 90+ day gap",
    final_output: "Sent to 16 patients (2 removed by reviewer)",
    confidence: 0.89,
    confidence_tier: "medium",
    risk_tier: "medium",
    status: "edited",
    reviewer_id: "Sarah Davis, CPC",
    reviewer_reason: "wrong-patient",
    reviewer_note: "Removed 2 patients who are currently hospitalized",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    decided_at: new Date(Date.now() - 172680000).toISOString(),
    review_duration_ms: 45000,
  },
  {
    timestamp_ntp_utc: new Date(Date.now() - 259200000).toISOString(),
    ai_decision_id: "aud-003",
    authenticated_human_user: {
      user_id: "usr-cpc-reynolds",
      name: "Marcus Reynolds, CPC",
      role: "Coding Auditor (CPC)",
      email: "m.reynolds@healthcompiler.com",
    },
    ai_system_identity: "Helix Core Copilot v3.4.1 (SOC2/HIPAA Certified)",
    model_version_pinned: "gemini-2.5-pro-0615-medical-v4",
    inputs_received: [
      {
        source: "Elation EHR",
        data_refs: ["PT0008-Christopher-Taylor", "RX-Metformin-850mg"],
        query_scope_phi: "Problem list and prescription audit",
      },
    ],
    policy_rule_invoked: "HCC Suspect Diagnosis Protocol v2026.2 / Rule #402",
    human_readable_reasoning:
      "Flagged suspected diabetes based on Metformin prescription. Self-reflection check flagged potential alternative indication (PCOS). Auditor rejected because patient takes metformin for insulin resistance/PCOS without diabetic lab criteria.",
    output_produced: "Add ICD-10 code E11.65 (Type 2 diabetes with hyperglycemia)",
    downstream_action_taken: {
      system: "Elation EHR",
      action_type: "REJECTED_NO_ACTION",
      target_id: "NONE",
      correlation_id: "corr-3391-rejected-audit",
    },
    human_review_disposition: {
      status: "rejected",
      reviewer_id: "usr-cpc-reynolds",
      decided_at: new Date(Date.now() - 259020000).toISOString(),
      review_duration_ms: 68000,
      reviewer_reason: "insufficient-evidence",
      reviewer_note: "Metformin is prescribed for PCOS, not diabetes. No supporting labs.",
      override_rationale: "Rejected per clinical documentation: Metformin indication is PCOS.",
    },
    tamper_evident_proof: "sha256:c77b9112001aa3902f8841443a089011f19028e3b1c900881900192a83741890",
    is_phi_access: true,
    retention_policy: "HIPAA_6_YEARS",

    // Legacy quick compatibility fields
    workflow: "hcc-coding",
    input_ref: "PT0008 — Christopher Taylor",
    model_version: "helix-v2.4.1",
    prompt_version: "hcc-suspect-v3",
    raw_output: "E11.65 — T2DM with hyperglycemia, confidence: 0.68",
    final_output: "Rejected — insufficient evidence",
    confidence: 0.68,
    confidence_tier: "low",
    risk_tier: "high",
    status: "rejected",
    reviewer_id: "Marcus Reynolds, CPC",
    reviewer_reason: "insufficient-evidence",
    reviewer_note: "Metformin is prescribed for PCOS, not diabetes. No supporting labs.",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    decided_at: new Date(Date.now() - 259020000).toISOString(),
    review_duration_ms: 68000,
  },
  {
    timestamp_ntp_utc: new Date(Date.now() - 345600000).toISOString(),
    ai_decision_id: "aud-004",
    authenticated_human_user: {
      user_id: "usr-pm-davis",
      name: "Sarah Davis, CPC",
      role: "Practice Manager",
      email: "s.davis@healthcompiler.com",
    },
    ai_system_identity: "Helix Core Copilot v3.4.1 (SOC2/HIPAA Certified)",
    model_version_pinned: "gemini-2.5-pro-0615-medical-v4",
    inputs_received: [
      {
        source: "Claims Feed",
        data_refs: ["RX-RETAIL-CLAIMS-8-PATIENTS"],
        query_scope_phi: "Retail vs Wholesale pharmacy cost differential analysis",
      },
    ],
    policy_rule_invoked: "Cost Optimization & Mail-Order Conversion Protocol v2026.1 / Rule #88",
    human_readable_reasoning:
      "Identified 8 patients taking 2+ maintenance meds at retail pharmacy with high out-of-pocket cost. Approved parallel draft review outreach for mail-order conversion saving $1,600/mo.",
    output_produced: "Dispatch mail-order conversion SMS to 8 members",
    downstream_action_taken: {
      system: "Spruce API",
      action_type: "DISPATCH_CONVERSION_SMS",
      target_id: "BATCH-MAILORDER-004",
      correlation_id: "corr-4418-mailorder-conversion",
    },
    human_review_disposition: {
      status: "approved",
      reviewer_id: "usr-pm-davis",
      decided_at: new Date(Date.now() - 345580000).toISOString(),
      review_duration_ms: 12000,
      override_rationale: "Approved. All 8 patients confirmed stable on maintenance prescriptions.",
    },
    tamper_evident_proof: "sha256:11a008892fbc982187cc8819011e44f811a01b38190c10298411082199011aa3",
    is_phi_access: true,
    retention_policy: "HIPAA_6_YEARS",

    // Legacy quick compatibility fields
    workflow: "claims-cost",
    input_ref: "Mail-order conversion — 8 patients",
    model_version: "helix-v2.4.1",
    prompt_version: "cost-optimization-v1",
    raw_output: "Convert 8 patients to mail-order pharmacy",
    final_output: "Converted 8 patients — outreach sent",
    confidence: 0.95,
    confidence_tier: "high",
    risk_tier: "low",
    status: "approved",
    reviewer_id: "Sarah Davis, CPC",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    decided_at: new Date(Date.now() - 345580000).toISOString(),
    review_duration_ms: 12000,
  },
  {
    timestamp_ntp_utc: new Date(Date.now() - 432000000).toISOString(),
    ai_decision_id: "aud-005",
    authenticated_human_user: {
      user_id: "system-autonomous-supervisor",
      name: "Helix Autonomous Supervisor Engine",
      role: "System Administrator",
      email: "system@healthcompiler.com",
    },
    ai_system_identity: "Helix Core Copilot v3.4.1 (SOC2/HIPAA Certified)",
    model_version_pinned: "gemini-2.5-pro-0615-medical-v4",
    inputs_received: [
      {
        source: "Elation EHR",
        data_refs: ["PANEL-DR-SMITH-23-ELIGIBLE-PHQ9"],
        query_scope_phi: "PHQ-9 screening gap calculation (>12 mos without screen)",
      },
    ],
    policy_rule_invoked: "MIPS/ACO Quality Measure Triage v2026.1 / Rule #201 (Exception-Only Auto-Queue)",
    human_readable_reasoning:
      "Dr. Smith depression screening measure at 62%. Identified 23 eligible patients aged 12+ without screening in last 12 months. Auto-queued under Tier 3 Exception-Only thresholds. Sampled for 5% drift audit.",
    output_produced: "Created 23 patient task items in Dr. Smith's clinical screening queue",
    downstream_action_taken: {
      system: "Elation EHR",
      action_type: "CREATE_TASK_QUEUE_ITEMS",
      target_id: "TASK-QUEUE-SMITH-PHQ9",
      correlation_id: "corr-9921-auto-phq9-queue",
    },
    human_review_disposition: {
      status: "auto",
      reviewer_id: "system-autonomous-supervisor",
      decided_at: new Date(Date.now() - 432000000).toISOString(),
      review_duration_ms: 0,
      override_rationale: "Auto-approved under Tier 3 Autonomous Mode (Low-risk reversible queue assignment).",
    },
    tamper_evident_proof: "sha256:55f8832a01b1a7722cc8192a0011bb44c219803011a00291100234a8110291a1",
    is_phi_access: true,
    retention_policy: "HIPAA_6_YEARS",

    // Legacy quick compatibility fields
    workflow: "mips-aco",
    input_ref: "Depression screening — Dr. Smith panel",
    model_version: "helix-v2.4.1",
    prompt_version: "quality-measures-v2",
    raw_output: "Queue PHQ-9 for 23 patients",
    final_output: "Queued for 23 patients",
    confidence: 0.91,
    confidence_tier: "high",
    risk_tier: "medium",
    status: "auto",
    reviewer_id: "system",
    created_at: new Date(Date.now() - 432000000).toISOString(),
    decided_at: new Date(Date.now() - 432000000).toISOString(),
    review_duration_ms: 0,
  },
];

// ─── Mock Exception ────────────────────────────────────────────────────────

export const MOCK_EXCEPTIONS: AIException[] = [
  {
    id: "exc-001",
    type: "blocking",
    whatHappened:
      "I couldn't identify the patient's primary care provider for care gap assignment.",
    whyItHappened:
      "The patient's Elation record shows two providers with active status and no designated primary.",
    whatToTryNext:
      "Select the primary provider below, or skip this patient for now.",
    options: [
      { label: "Dr. Sam Wills", value: "sam-wills" },
      { label: "Dr. Jennifer Hernandez", value: "jennifer-hernandez" },
      { label: "Skip this patient", value: "skip" },
    ],
    agentType: "care-gap",
  },
  {
    id: "exc-002",
    type: "non-blocking",
    whatHappened: "Lab data is older than 6 months for 3 flagged patients.",
    whyItHappened:
      "Most recent lab results in Elation are from January 2026. Trend analysis has wider confidence intervals with stale data.",
    whatToTryNext:
      "Proceeding with flags but recommending fresh labs before clinical intervention. Flag accuracy may be reduced.",
    agentType: "clinical-outcomes",
  },
  {
    id: "exc-003",
    type: "escalation",
    whatHappened:
      "Patient response to Spruce outreach suggests clinical urgency.",
    whyItHappened:
      "Inbound reply contains keywords indicating acute symptom onset: 'chest pain', 'shortness of breath'. This is beyond automated triage scope.",
    whatToTryNext:
      "Routing to nurse queue with full conversation context. Please review within 15 minutes.",
    agentType: "care-gap",
  },
];

// ─── Simulated Chat Responses ──────────────────────────────────────────────

export interface ChatResponse {
  content: string;
  actions?: { label: string; actionType: string }[];
  cohortTable?: {
    headers: string[];
    rows: string[][];
  };
}

const CHAT_RESPONSES_BY_ROUTE: Record<string, ChatResponse[]> = {
  "/home": [
    {
      content:
        "I've analyzed your org-wide metrics. Here's the summary:\n\n• **Active Patients**: 2,823 (↑3.2% MoM)\n• **Encounter Volume**: 7,214 total (↓7.8% vs target)\n• **Care Gaps**: 118 patients requiring attention\n• **HCC Doc Accuracy**: 77.3% (target: 85%)\n\n3 metrics are trending below target — the biggest risk is the encounter volume decline, which is correlated with the rising care gap count.",
      actions: [
        { label: "View care gap breakdown", actionType: "navigate" },
        { label: "Generate executive report", actionType: "generate-report" },
      ],
    },
  ],
  "/hcc/coding-queue": [
    {
      content:
        "I found **12 coding opportunities** based on prescription and lab patterns:\n\n• **7 High confidence** (90%+): Medication patterns clearly indicate undocumented conditions\n• **3 Medium** (70-89%): Medications sometimes used for other indications — verification needed\n• **2 Low** (<70%): Lab-only signals with stale data\n\nThe highest-impact opportunity: **James Smith** — on metformin for 14 months with HbA1c = 7.8, but no diabetes ICD-10 code on file.",
      actions: [
        { label: "Review top 7 opportunities", actionType: "flag-review" },
        { label: "Queue all for clinical review", actionType: "queue-outreach" },
      ],
    },
  ],
  "/utilization-gaps": [
    {
      content:
        "Your care gap queue has been re-prioritized using a composite score:\n\n• **Clinical risk** (40% weight): Chronic condition severity + recent trending\n• **Quality impact** (35%): Which MIPS/ACO measures each patient closes\n• **Revenue at risk** (25%): HCC recapture value + membership retention\n\nTop 5 patients would close 3 quality measures if contacted this week. Want me to generate a full outreach plan?",
      actions: [
        {
          label: "Generate outreach plan for top 5",
          actionType: "queue-outreach",
        },
        { label: "Show all 23 ranked patients", actionType: "flag-review" },
      ],
    },
  ],
  "/mips/dashboard": [
    {
      content:
        "Your current projected MIPS score is **77.9/100**. Here's how to maximize it:\n\n| Measure | Gap | Points | Revenue Impact |\n|---|---|---|---|\n| Depression Screening (PHQ-9) | 23 patients | +1.8 pts | ~$7,800 |\n| Diabetes A1c Control | 14 patients | +1.4 pts | ~$6,100 |\n| Colorectal Screening | 11 patients | +1.0 pts | ~$4,300 |\n\nClosing all 3 adds **+4.2 points** for approximately **$18,200** in payment adjustment.",
      actions: [
        { label: "Generate action queue", actionType: "queue-outreach" },
        { label: "View by provider", actionType: "flag-review" },
      ],
    },
  ],
};

export function getChatResponseForRoute(route: string): ChatResponse {
  const responses = CHAT_RESPONSES_BY_ROUTE[route];
  if (responses && responses.length > 0) return responses[0];

  // Default response
  return {
    content: `I've analyzed the data on this page. Based on current patterns, I've identified several opportunities. Would you like me to surface specific insights or generate an action plan?`,
    actions: [
      { label: "Show top insights", actionType: "flag-review" },
      { label: "Generate report", actionType: "generate-report" },
    ],
  };
}

// ─── Trust Metrics Calculator ──────────────────────────────────────────────

export function calculateTrustMetrics(records: AuditRecord[]): {
  avgReviewTimeMs: number;
  disagreementRate: number;
  autoApprovedPct: number;
  totalActions: number;
} {
  if (records.length === 0) {
    return {
      avgReviewTimeMs: 0,
      disagreementRate: 0,
      autoApprovedPct: 0,
      totalActions: 0,
    };
  }

  const reviewTimes = records
    .filter((r) => r.review_duration_ms && r.review_duration_ms > 0)
    .map((r) => r.review_duration_ms!);

  const avgReviewTimeMs =
    reviewTimes.length > 0
      ? reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length
      : 0;

  const disagreements = records.filter(
    (r) => r.status === "rejected" || r.status === "edited"
  ).length;
  const disagreementRate = disagreements / records.length;

  const autoApproved = records.filter((r) => r.status === "auto").length;
  const autoApprovedPct = autoApproved / records.length;

  return {
    avgReviewTimeMs,
    disagreementRate,
    autoApprovedPct,
    totalActions: records.length,
  };
}
