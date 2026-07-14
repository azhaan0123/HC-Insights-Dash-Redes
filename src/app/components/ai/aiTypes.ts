/**
 * Central type definitions for the Agentic AI Action Layer.
 * Every AI component imports from here — this is the single source of truth
 * for agent types, confidence tiers, autonomy tiers, action interfaces,
 * plan steps, audit records, and page-to-agent context mapping.
 */

// ─── Agent Types ────────────────────────────────────────────────────────────

export type AgentType =
  | "care-gap"
  | "hcc-coding"
  | "clinical-outcomes"
  | "claims-cost"
  | "mips-aco"
  | "employer"
  | "cross-module";

export const AGENT_META: Record<
  AgentType,
  { label: string; color: string; darkColor: string; icon: string }
> = {
  "care-gap": {
    label: "Care Gap Closure",
    color: "#e32168",
    darkColor: "#fb5b87",
    icon: "Activity",
  },
  "hcc-coding": {
    label: "HCC Risk & Coding",
    color: "#7c3aed",
    darkColor: "#a78bfa",
    icon: "FileCode",
  },
  "clinical-outcomes": {
    label: "Clinical Outcomes",
    color: "#0891b2",
    darkColor: "#22d3ee",
    icon: "HeartPulse",
  },
  "claims-cost": {
    label: "Claims & Cost",
    color: "#059669",
    darkColor: "#34d399",
    icon: "DollarSign",
  },
  "mips-aco": {
    label: "MIPS/ACO Quality",
    color: "#d97706",
    darkColor: "#fbbf24",
    icon: "Award",
  },
  employer: {
    label: "Employer Analytics",
    color: "#2563eb",
    darkColor: "#60a5fa",
    icon: "Building2",
  },
  "cross-module": {
    label: "Cross-Module Intelligence",
    color: "#e32168",
    darkColor: "#fb5b87",
    icon: "Sparkles",
  },
};

// ─── Confidence & Trust Tiers ───────────────────────────────────────────────

export type ConfidenceTier = "high" | "medium" | "low";

export function getConfidenceTier(score: number): ConfidenceTier {
  if (score >= 0.9) return "high";
  if (score >= 0.7) return "medium";
  return "low";
}

export type AutonomyTier = "preview" | "supervised" | "autonomous";

// ─── Action & Approval Types ────────────────────────────────────────────────

export type ActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "edited"
  | "auto"
  | "undone";

export type ApprovalPattern =
  | "pre-action"
  | "parallel-draft"
  | "post-action"
  | "selective-escalation";

export type ActionType =
  | "send-message"
  | "book-appointment"
  | "submit-code"
  | "flag-review"
  | "generate-report"
  | "assign-cohort"
  | "queue-outreach"
  | "escalate"
  | "triage";

export type RejectionReason =
  | "wrong-diagnosis"
  | "insufficient-evidence"
  | "already-coded"
  | "patient-doesnt-have-condition"
  | "wrong-patient"
  | "timing-inappropriate"
  | "other";

export const REJECTION_LABELS: Record<RejectionReason, string> = {
  "wrong-diagnosis": "Wrong diagnosis",
  "insufficient-evidence": "Insufficient evidence",
  "already-coded": "Already coded elsewhere",
  "patient-doesnt-have-condition": "Patient doesn't have condition",
  "wrong-patient": "Wrong patient",
  "timing-inappropriate": "Timing inappropriate",
  other: "Other reason",
};

// ─── Plan Steps ─────────────────────────────────────────────────────────────

export interface PlanStep {
  id: string;
  label: string;
  description: string;
  confidence: number;
  confidenceTier: ConfidenceTier;
  status: "pending" | "in-progress" | "completed" | "failed" | "skipped";
  isEditable: boolean;
  isSkippable: boolean;
  durationMs?: number;
  progressCurrent?: number;
  progressTotal?: number;
}

// ─── AI Action ──────────────────────────────────────────────────────────────

export interface AIAction {
  id: string;
  agentType: AgentType;
  title: string;
  description: string;
  confidence: number;
  confidenceTier: ConfidenceTier;
  reasoning: string;
  evidenceItems: string[];
  suggestedAction: string;
  actionType: ActionType;
  approvalPattern: ApprovalPattern;
  targetPatients?: { id: string; name: string; condition?: string }[];
  status: ActionStatus;
  reviewerId?: string;
  rejectionReason?: RejectionReason;
  rejectionNote?: string;
  rawOutput?: string;
  finalOutput?: string;
  createdAt: string;
  decidedAt?: string;
  isUndoable: boolean;
  undoWindowMs?: number;
  planSteps?: PlanStep[];
  priority: "critical" | "high" | "medium" | "low";
  /** Draft message content for outreach actions */
  draftContent?: string;
  /** Suggested ICD-10 codes for coding actions */
  suggestedCodes?: { code: string; description: string; score: number }[];

  // ─── Gate Ranking Properties (Reversibility, Volume, Latency) ───
  /** Reversibility ranking: if irreversible (sent msg, submitted code), requires pre-action approval */
  reversibility?: "reversible" | "irreversible";
  /** Volume ranking: high-volume workflows require exception-only thresholds so queue stays manageable */
  volumeTier?: "high-volume" | "medium-volume" | "low-volume";
  /** Latency tolerance ranking: hours/days can wait for pre-action; real-time needs dual-track or exception-only */
  latencyTolerance?: "real-time" | "hours" | "days";
  /** Timeout behavior & SLA for long-running suspended workflow gates */
  timeoutPolicy?: {
    durationHours: number;
    actionOnTimeout: "auto-approve" | "auto-reject" | "auto-escalate" | "hard-fail";
    escalateToRole?: string;
    deadlineIso?: string;
  };
  /** Alternatives considered and discarded by the AI model (Element #4 of Five-Element Reviewer Interface) */
  alternativesConsidered?: string[];

  // ─── Hallucination & Grounding Safeguards ───
  /** Self-reflection verification loop results against source EHR/claims data */
  selfReflectionVerification?: {
    status: "verified" | "flagged" | "suppressed";
    checksPassed: string[];
    checksFailed?: string[];
    verifiedAgainst: string[];
  };
  /** RAG retrieval base layer citations tying output to specific patient records or lab entries */
  ragCitations?: {
    sourceSystem: "Elation EHR" | "Hint Core" | "Spruce Health" | "Claims Feed";
    recordId: string;
    description: string;
    timestamp: string;
  }[];
}

// ─── AI Insight ─────────────────────────────────────────────────────────────

export interface AIInsight {
  id: string;
  agentType: AgentType;
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  confidenceTier: ConfidenceTier;
  /** Inline actions the operator can take from this insight */
  actions: {
    label: string;
    actionType: ActionType;
    actionId?: string;
  }[];
  /** Which routes this insight is relevant to */
  pageScopes: string[];
  priority: "critical" | "high" | "medium" | "low";
  /** Cross-module pattern detection flag */
  isCrossModule?: boolean;
  /** Metric data for display */
  metric?: {
    value: string;
    label: string;
    trend?: "up" | "down" | "flat";
    trendValue?: string;
  };
  /** RAG citations grounding the insight in underlying patient/claims records */
  ragCitations?: {
    sourceSystem: "Elation EHR" | "Hint Core" | "Spruce Health" | "Claims Feed";
    recordId: string;
    description: string;
    timestamp: string;
  }[];
}

// ─── Audit Record (12-Field Minimum Schema + Healthcare Extensions) ─────────

export interface AuditRecord {
  // Field 1: Timestamp (NTP-synced, UTC)
  timestamp_ntp_utc?: string;
  // Field 2: Unique decision ID
  ai_decision_id: string;
  // Field 3: Authenticated human user identity & role (HIPAA § 164.312(a)(2)(i) compliance)
  authenticated_human_user?: {
    user_id: string;
    name: string;
    role: "Clinical Provider (MD/DO)" | "Coding Auditor (CPC)" | "Practice Manager" | "System Administrator";
    email: string;
  };
  // Field 4: AI system identity and version
  ai_system_identity?: string;
  // Field 5: Model identity and version pinned
  model_version_pinned?: string;
  // Field 6: Inputs received with source attribution
  inputs_received?: {
    source: "Elation EHR" | "Hint Core" | "Spruce Health" | "Claims Feed";
    data_refs: string[];
    query_scope_phi: string;
  }[];
  // Field 7: Specific policy, rule, or prompt invoked
  policy_rule_invoked?: string;
  // Field 8: Reasoning in human-readable language (Confidence scores not accepted as sole reasoning)
  human_readable_reasoning?: string;
  // Field 9: Output produced
  output_produced?: string;
  // Field 10: Action taken in downstream systems & unified correlation ID
  downstream_action_taken?: {
    system: "Spruce API" | "Elation EHR" | "Hint Billing" | "CMS MIPS Portal";
    action_type: string;
    target_id: string;
    correlation_id: string;
  };
  // Field 11: Human review or approval disposition
  human_review_disposition?: {
    status: ActionStatus;
    reviewer_id: string;
    decided_at: string;
    review_duration_ms?: number;
    reviewer_reason?: RejectionReason;
    reviewer_note?: string;
    override_rationale?: string;
  };
  // Field 12: Tamper-evident integrity proof (SHA-256 Merkle chain hash)
  tamper_evident_proof?: string;

  // ── Legacy / Quick Compatibility Fields (Mapped cleanly from above) ──
  workflow: AgentType;
  input_ref: string;
  model_version: string;
  prompt_version: string;
  raw_output: string;
  final_output: string;
  confidence: number;
  confidence_tier: ConfidenceTier;
  risk_tier: "low" | "medium" | "high";
  status: ActionStatus;
  reviewer_id: string;
  reviewer_reason?: RejectionReason;
  reviewer_note?: string;
  created_at: string;
  decided_at?: string;
  review_duration_ms?: number;

  // Healthcare specific extensions
  is_phi_access?: boolean;
  retention_policy?: "HIPAA_6_YEARS" | "STATE_10_YEARS" | "EU_AI_ACT_6_MONTHS";
}

// ─── Anti-Rubber-Stamping Metrics ───────────────────────────────────────────


export interface TrustMetrics {
  avgReviewTimeMs: number;
  disagreementRate: number;
  autoApprovedPct: number;
  totalActions: number;
  approvedCount: number;
  rejectedCount: number;
  editedCount: number;
}

// ─── Page Context Mapping ───────────────────────────────────────────────────

export interface PageContext {
  route: string;
  pageName: string;
  agentType: AgentType;
  agentLabel: string;
  contextDescription: string;
}

/**
 * Maps every route in the platform to its primary agent type and context.
 * The sidebar uses this to determine which insights, presets, and actions to show.
 */
export const PAGE_CONTEXT_MAP: Record<string, PageContext> = {
  "/home": {
    route: "/home",
    pageName: "Home",
    agentType: "cross-module",
    agentLabel: "Cross-Module Intelligence",
    contextDescription: "Org-wide metric anomalies and cross-module patterns",
  },
  // ── Engagement & Utilization ──
  "/engagement": {
    route: "/engagement",
    pageName: "Engagement Overview",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Enrollment drift and encounter cadence patterns",
  },
  "/engagement/active-patients": {
    route: "/engagement/active-patients",
    pageName: "Active Patients",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Churn risk and disengagement signals",
  },
  "/engagement/encounters": {
    route: "/engagement/encounters",
    pageName: "Encounters",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Triage workload and encounter channel patterns",
  },
  "/engagement/encounter-types-breakdown": {
    route: "/engagement/encounter-types-breakdown",
    pageName: "Encounter Types",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "After-hours triage to virtual visit optimization",
  },
  "/engagement/prescriptions": {
    route: "/engagement/prescriptions",
    pageName: "Prescription Orders",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Refill gap detection and adherence coaching",
  },
  "/engagement/prescriptions-breakdown": {
    route: "/engagement/prescriptions-breakdown",
    pageName: "Prescription Breakdown",
    agentType: "claims-cost",
    agentLabel: "Claims & Cost",
    contextDescription: "Mail-order conversion and cost optimization",
  },
  "/engagement/digital-engagement": {
    route: "/engagement/digital-engagement",
    pageName: "Digital Engagement",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Spruce message triage and response drafting",
  },
  "/engagement/messages": {
    route: "/engagement/messages",
    pageName: "Messages",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Communication volume and response-time analysis",
  },
  "/engagement/patient-touch-ratio": {
    route: "/engagement/patient-touch-ratio",
    pageName: "Patient Touch Ratio",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Touch ratio trends and engagement patterns",
  },
  // ── Action Centre ──
  "/utilization-gaps": {
    route: "/utilization-gaps",
    pageName: "Action Centre",
    agentType: "care-gap",
    agentLabel: "Care Gap Closure",
    contextDescription: "Prioritized care gap closure workflow orchestration",
  },
  // ── Cost & Claims ──
  "/cost-savings": {
    route: "/cost-savings",
    pageName: "Cost Savings",
    agentType: "claims-cost",
    agentLabel: "Claims & Cost",
    contextDescription: "ROI opportunity detection and cost anomaly analysis",
  },
  "/claims": {
    route: "/claims",
    pageName: "Claims Utilization",
    agentType: "claims-cost",
    agentLabel: "Claims & Cost",
    contextDescription: "Claims spending patterns and anomaly detection",
  },
  "/billing": {
    route: "/billing",
    pageName: "Claims Billing Report",
    agentType: "claims-cost",
    agentLabel: "Claims & Cost",
    contextDescription: "Billing audit and report generation",
  },
  "/coordinated-care": {
    route: "/coordinated-care",
    pageName: "Coordinated Care",
    agentType: "claims-cost",
    agentLabel: "Claims & Cost",
    contextDescription: "Care intervention effectiveness and claims correlation",
  },
  "/chronic-risk": {
    route: "/chronic-risk",
    pageName: "Chronic Risk",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Chronic condition cohorting and risk stratification",
  },
  // ── HCC Insights ──
  "/hcc/overview": {
    route: "/hcc/overview",
    pageName: "HCC Overview",
    agentType: "hcc-coding",
    agentLabel: "HCC Risk & Coding",
    contextDescription: "AWV prioritization and recapture opportunity ranking",
  },
  "/hcc/patient-list": {
    route: "/hcc/patient-list",
    pageName: "HCC Patient List",
    agentType: "hcc-coding",
    agentLabel: "HCC Risk & Coding",
    contextDescription: "Patient risk score analysis and suspect conditions",
  },
  "/hcc/coding-queue": {
    route: "/hcc/coding-queue",
    pageName: "HCC Coding Queue",
    agentType: "hcc-coding",
    agentLabel: "HCC Risk & Coding",
    contextDescription: "Suspect diagnosis detection and ICD-10 specificity",
  },
  "/hcc/bulk-audit": {
    route: "/hcc/bulk-audit",
    pageName: "Bulk Audit",
    agentType: "hcc-coding",
    agentLabel: "HCC Risk & Coding",
    contextDescription: "Pre-submission documentation accuracy screening",
  },
  "/hcc/pre-visit-plan": {
    route: "/hcc/pre-visit-plan",
    pageName: "Pre-visit Plan",
    agentType: "hcc-coding",
    agentLabel: "HCC Risk & Coding",
    contextDescription: "Pre-visit HCC review preparation",
  },
  // ── ACO Insights ──
  "/aco/overview": {
    route: "/aco/overview",
    pageName: "ACO Overview",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "ACO performance metrics and quality trajectories",
  },
  "/aco/provider-performance": {
    route: "/aco/provider-performance",
    pageName: "Provider Performance",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "Provider coaching and measure-level gap analysis",
  },
  "/aco/gaps": {
    route: "/aco/gaps",
    pageName: "ACO Gaps Tracker",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "Measure gap-to-action conversion and patient queues",
  },
  "/aco/utilization": {
    route: "/aco/utilization",
    pageName: "ACO Utilization",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "ACO utilization metrics and benchmarks",
  },
  "/aco/reports": {
    route: "/aco/reports",
    pageName: "ACO Reports",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "ACO reporting and compliance documentation",
  },
  // ── MIPS ──
  "/mips/dashboard": {
    route: "/mips/dashboard",
    pageName: "MIPS Dashboard",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "MIPS score trajectory prediction and financial impact",
  },
  "/mips/quality-measures": {
    route: "/mips/quality-measures",
    pageName: "Quality Measures",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "Quality measure compliance and gap closure",
  },
  "/mips/cost-performance": {
    route: "/mips/cost-performance",
    pageName: "Cost Performance",
    agentType: "claims-cost",
    agentLabel: "Claims & Cost",
    contextDescription: "MIPS cost performance category optimization",
  },
  "/mips/provider-comparison": {
    route: "/mips/provider-comparison",
    pageName: "Provider Comparison",
    agentType: "mips-aco",
    agentLabel: "MIPS/ACO Quality",
    contextDescription: "Provider-level performance comparison and coaching",
  },
  // ── Patient Outcomes ──
  "/outcomes/dashboard": {
    route: "/outcomes/dashboard",
    pageName: "Outcomes Dashboard",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Outcomes overview and quality metrics",
  },
  "/outcomes/screenings": {
    route: "/outcomes/screenings",
    pageName: "Screenings Due",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Predictive non-compliance alerts and targeted interventions",
  },
  "/outcomes/vaccinations": {
    route: "/outcomes/vaccinations",
    pageName: "Vaccinations",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Vaccination compliance and outreach scheduling",
  },
  "/outcomes/lab-trends": {
    route: "/outcomes/lab-trends",
    pageName: "Lab Trends",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Lab value anomaly detection and trend alerts",
  },
  "/outcomes/lab-cadence": {
    route: "/outcomes/lab-cadence",
    pageName: "Lab Cadence",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Lab scheduling cadence and compliance tracking",
  },
  "/outcomes/medication-refills": {
    route: "/outcomes/medication-refills",
    pageName: "Medication Refills",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Refill adherence gaps and mail-order nudges",
  },
  "/outcomes/patient-groups": {
    route: "/outcomes/patient-groups",
    pageName: "Patient Groups",
    agentType: "clinical-outcomes",
    agentLabel: "Clinical Outcomes",
    contextDescription: "Chronic condition cohorting and sub-cohort analysis",
  },
  // ── Employer ──
  "/employer/overview": {
    route: "/employer/overview",
    pageName: "Employer Overview",
    agentType: "employer",
    agentLabel: "Employer Analytics",
    contextDescription: "Employer benchmark gap analysis and report generation",
  },
  "/employer/enrollment": {
    route: "/employer/enrollment",
    pageName: "Employer Enrollment",
    agentType: "employer",
    agentLabel: "Employer Analytics",
    contextDescription: "Workforce enrollment trends and growth tracking",
  },
  "/employer/financial": {
    route: "/employer/financial",
    pageName: "Employer Financial",
    agentType: "employer",
    agentLabel: "Employer Analytics",
    contextDescription: "Financial performance vs. traditional plan analysis",
  },
  "/employer/chronic": {
    route: "/employer/chronic",
    pageName: "Employer Chronic Conditions",
    agentType: "employer",
    agentLabel: "Employer Analytics",
    contextDescription: "Workforce chronic condition management and improvement",
  },
  "/employer/high-cost": {
    route: "/employer/high-cost",
    pageName: "High-Cost Claimants",
    agentType: "employer",
    agentLabel: "Employer Analytics",
    contextDescription: "Rising-cost early warning and care coordination triggers",
  },
  "/employer/benchmarking": {
    route: "/employer/benchmarking",
    pageName: "Risk Benchmarking",
    agentType: "employer",
    agentLabel: "Employer Analytics",
    contextDescription: "National benchmark comparison and intervention targeting",
  },
  // ── Other ──
  "/communication": {
    route: "/communication",
    pageName: "Communication",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Communication channel optimization",
  },
  "/survey": {
    route: "/survey",
    pageName: "Survey",
    agentType: "care-gap",
    agentLabel: "Patient Engagement",
    contextDescription: "Patient satisfaction survey targeting",
  },
  "/ask-hc": {
    route: "/ask-hc",
    pageName: "Ask HC",
    agentType: "cross-module",
    agentLabel: "Cross-Module Intelligence",
    contextDescription: "Natural language data query and cohort analysis",
  },
};

/**
 * Resolves the current route to its page context.
 * Falls back to cross-module intelligence for unknown routes.
 */
export function resolvePageContext(pathname: string): PageContext {
  // Try exact match first
  if (PAGE_CONTEXT_MAP[pathname]) return PAGE_CONTEXT_MAP[pathname];

  // Try parent path match (e.g., /engagement/whatever → /engagement)
  const segments = pathname.split("/").filter(Boolean);
  while (segments.length > 0) {
    const candidate = "/" + segments.join("/");
    if (PAGE_CONTEXT_MAP[candidate]) return PAGE_CONTEXT_MAP[candidate];
    segments.pop();
  }

  // Default fallback
  return {
    route: pathname,
    pageName: "Dashboard",
    agentType: "cross-module",
    agentLabel: "Cross-Module Intelligence",
    contextDescription: "Cross-domain clinical & financial analysis",
  };
}

// ─── Exception Types ────────────────────────────────────────────────────────

export type ExceptionType = "blocking" | "non-blocking" | "escalation";

export interface AIException {
  id: string;
  type: ExceptionType;
  whatHappened: string;
  whyItHappened: string;
  whatToTryNext: string;
  options?: { label: string; value: string }[];
  agentType: AgentType;
}
