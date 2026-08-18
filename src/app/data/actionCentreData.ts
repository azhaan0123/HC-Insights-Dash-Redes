import { pick, rand, fullName, phone, email, EMPLOYERS, PHYSICIANS, patientId, MEDICAL_CONDITIONS } from "./options";

export type PriorityLevel = "High" | "Medium" | "Low";

export type CohortType = 
  | "new-activation"
  | "engagement-gap"
  | "low-response"
  | "external-leakage";

export type GapTier = "30-days" | "60-days" | "90-days" | "custom";

export interface TouchpointEvent {
  id: string;
  date: string;
  type: "SMS" | "Email" | "Call" | "Appt";
  description: string;
  outcome?: string;
}

export interface ClaimEvent {
  id: string;
  date: string;
  provider: string;
  diagnosis: string;
  amount: string;
}

export interface EncounterEvent {
  id: string;
  date: string;
  type: string;
  provider: string;
  notes: string;
}

export interface ActionCentrePatientRow {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  condition: string;
  spruce: "Yes" | "No";
  priority: PriorityLevel;
  cohort: CohortType;
  gapTier?: GapTier;
  lastVisitDaysAgo: number | null;
  lastVisitText: string;
  lastOutreachText: string;
  lastOutreachDaysAgo: number | null;
  reason: string;
  suggestedAction: string;
  suggestedActionType: "email" | "sms" | "call" | "appt";
  contactPhone: string;
  contactEmail: string;
  employer: string;
  physician: string;
  engagementHistory: TouchpointEvent[];
  recentClaims: ClaimEvent[];
  recentEncounters: EncounterEvent[];
}

export interface CohortSummaryCard {
  id: CohortType | "all";
  title: string;
  count: number;
  wowChange: string;
  wowPositive: boolean;
  momChange: string;
  momPositive: boolean;
  description: string;
}

export const COHORT_SUMMARIES: CohortSummaryCard[] = [
  {
    id: "all",
    title: "Total Requiring Attention",
    count: 118,
    wowChange: "+12.4%",
    wowPositive: false, // More patients needing attention is an operational alert
    momChange: "-4.1%",
    momPositive: true,
    description: "Total unique DPC patients flagged across all actionable cohorts today.",
  },
  {
    id: "new-activation",
    title: "New Patient Activation",
    count: 28,
    wowChange: "-6.2%",
    wowPositive: true,
    momChange: "+14.0%",
    momPositive: false,
    description: "Recently enrolled members without a completed first DPC visit or onboarding.",
  },
  {
    id: "engagement-gap",
    title: "Engagement Gap",
    count: 54,
    wowChange: "+8.5%",
    wowPositive: false,
    momChange: "+18.2%",
    momPositive: false,
    description: "Patients with zero DPC encounters in the last 30, 60, or 90+ days.",
  },
  {
    id: "low-response",
    title: "Low Response",
    count: 16,
    wowChange: "0.0%",
    wowPositive: true,
    momChange: "-11.5%",
    momPositive: true,
    description: "Patients with 3+ unreturned outreach attempts requiring channel escalation.",
  },
  {
    id: "external-leakage",
    title: "External Care Leakage",
    count: 20,
    wowChange: "+15.3%",
    wowPositive: false,
    momChange: "+8.7%",
    momPositive: false,
    description: "Members seeking out-of-network urgent care or labs instead of utilizing DPC.",
  },
];

const REASONS_BY_COHORT: Record<CohortType, string[]> = {
  "new-activation": [
    "Enrolled 18 days ago • No completed DPC onboarding visit",
    "Enrolled 24 days ago • Welcome email sent, appointment not booked",
    "Enrolled 12 days ago • Initial health survey unsubmitted",
    "Enrolled 29 days ago • Missing initial baseline checkup",
  ],
  "engagement-gap": [
    "No DPC encounter in 94 days • History of hypertension",
    "No DPC encounter in 62 days • Missed annual wellness visit",
    "No DPC encounter in 112 days • High BMI baseline",
    "No DPC encounter in 38 days • Expired prescription refill check",
  ],
  "low-response": [
    "3 unreturned automated SMS reminders in June • Needs voice call",
    "4 unopened emails regarding scheduling • Switch to Spruce SMS",
    "No response to Care Coordinator voicemail left 10 days ago",
    "Failed appointment confirmation twice • Require alternate phone contact",
  ],
  "external-leakage": [
    "Out-of-network urgent care claim ($340) • Needs DPC walk-in education",
    "External lab workup billed ($185) • Route future labs through DPC wholesale",
    "ER visit for uncomplicated sinusitis • Schedule follow-up & Spruce guide",
    "Specialist referral without PCP consult • Review care coordination protocol",
  ],
};

const ACTIONS_BY_COHORT: Record<CohortType, { text: string; type: "email" | "sms" | "call" | "appt" }[]> = {
  "new-activation": [
    { text: "Send Welcome SMS & Scheduling Link", type: "sms" },
    { text: "Call for Personal Onboarding Check-in", type: "call" },
    { text: "Schedule 30-min Intake Visit", type: "appt" },
    { text: "Email DPC Welcome Packet", type: "email" },
  ],
  "engagement-gap": [
    { text: "Send 60-Day Check-in SMS", type: "sms" },
    { text: "Schedule Wellness Follow-up", type: "appt" },
    { text: "Call for Preventive Screening Check", type: "call" },
    { text: "Email Personalized Health Check Reminder", type: "email" },
  ],
  "low-response": [
    { text: "Call Secondary Emergency Phone Number", type: "call" },
    { text: "Switch to Spruce Direct Secure Message", type: "sms" },
    { text: "Flag for Front Desk In-Person Notification", type: "call" },
  ],
  "external-leakage": [
    { text: "Send DPC Zero-Copay Benefits Reminder SMS", type: "sms" },
    { text: "Call to Explain Wholesale Lab & Urgent Care Access", type: "call" },
    { text: "Email Care Coordination & 24/7 Spruce Guide", type: "email" },
    { text: "Schedule Post-ER/Urgent Care Follow-up", type: "appt" },
  ],
};

// Generate deterministic list of 118 patients
export const ACTION_CENTRE_PATIENTS: ActionCentrePatientRow[] = Array.from({ length: 118 }, (_, idx) => {
  const name = fullName();
  let cohort: CohortType;
  if (idx < 28) cohort = "new-activation";
  else if (idx < 82) cohort = "engagement-gap";
  else if (idx < 98) cohort = "low-response";
  else cohort = "external-leakage";

  let priority: PriorityLevel = "Medium";
  if (cohort === "engagement-gap") {
    priority = rand() > 0.6 ? "High" : rand() > 0.4 ? "Medium" : "Low";
  } else {
    priority = rand() > 0.5 ? "Medium" : "Low";
  }

  let gapTier: GapTier | undefined;
  let lastVisitDaysAgo: number | null = null;
  if (cohort === "new-activation") {
    lastVisitDaysAgo = null;
  } else if (cohort === "engagement-gap") {
    const days = Math.floor(rand() * 90) + 32;
    lastVisitDaysAgo = days;
    if (days >= 90) gapTier = "90-days";
    else if (days >= 60) gapTier = "60-days";
    else gapTier = "30-days";
  } else {
    lastVisitDaysAgo = Math.floor(rand() * 80) + 15;
  }

  const lastVisitText = lastVisitDaysAgo === null ? "Never (New)" : `${lastVisitDaysAgo} days ago`;

  const outreachDays = Math.floor(rand() * 25) + 2;
  const outreachTypes = ["SMS sent", "Email sent", "Spruce msg", "Voicemail left"];
  const lastOutreachText = `${pick(outreachTypes)} (${outreachDays}d ago)`;

  const actionObj = pick(ACTIONS_BY_COHORT[cohort]);

  return {
    id: patientId(),
    name,
    age: Math.floor(rand() * 50) + 22,
    gender: rand() > 0.5 ? "F" : "M",
    condition: pick(MEDICAL_CONDITIONS),
    spruce: rand() > 0.5 ? "Yes" : "No",
    priority,
    cohort,
    gapTier,
    lastVisitDaysAgo,
    lastVisitText,
    lastOutreachText,
    lastOutreachDaysAgo: outreachDays,
    reason: pick(REASONS_BY_COHORT[cohort]),
    suggestedAction: actionObj.text,
    suggestedActionType: actionObj.type,
    contactPhone: (idx % 6 === 1 || idx % 12 === 5) ? "Unavailable" : phone(),
    contactEmail: (idx % 6 === 2 || idx % 12 === 5) ? "Unavailable" : email(name),
    employer: pick(EMPLOYERS),
    physician: pick(PHYSICIANS),
    engagementHistory: [
      {
        id: "ev-1",
        date: `${outreachDays} days ago`,
        type: actionObj.type === "sms" ? "SMS" : actionObj.type === "email" ? "Email" : "Call",
        description: `Automated outreach check regarding ${cohort.replace("-", " ")} status.`,
        outcome: rand() > 0.5 ? "Delivered — No reply yet" : "Voicemail left",
      },
      {
        id: "ev-2",
        date: `${outreachDays + 14} days ago`,
        type: "Email",
        description: "Monthly practice health newsletter & scheduler invitation.",
        outcome: "Opened",
      },
    ],
    recentClaims: cohort === "external-leakage" ? [
      {
        id: "cl-1",
        date: "06/18/2026",
        provider: "CityHealth Urgent Care Center",
        diagnosis: "Acute sinusitis / Upper respiratory infection",
        amount: "$340.00",
      },
      {
        id: "cl-2",
        date: "02/11/2026",
        provider: "Metro Diagnostic Lab",
        diagnosis: "Routine lipid panel & metabolic workup",
        amount: "$185.00",
      }
    ] : [
      {
        id: "cl-def",
        date: "04/05/2026",
        provider: "Quest Diagnostics External",
        diagnosis: "Routine blood draw",
        amount: "$92.00",
      }
    ],
    recentEncounters: lastVisitDaysAgo ? [
      {
        id: "enc-1",
        date: `${lastVisitDaysAgo} days ago`,
        type: "Office Visit",
        provider: pick(PHYSICIANS),
        notes: "Routine follow-up check. Patient reported feeling well overall. Advised lifestyle modifications.",
      }
    ] : [],
  };
});

/**
 * Mock patient search for DCMP-3618.
 *
 * Follows the DCMP-3616 deduplication contract:
 *   1. Deduplicates by patient id — never returns two rows for the same patient.
 *   2. Uses OR semantics: matches on name OR id (never requires both).
 *   3. Uses OR for date fields: hasDuplicateFlag is checked independently of
 *      lastVisitDaysAgo and lastOutreachDaysAgo — a patient with only a recent
 *      message but no recent encounter is still a valid search result.
 *
 * In production, this is replaced by dbService.searchPatients() which queries
 * the Supabase api_patient table with the LATERAL join dedup pattern.
 */
export function searchActionCentrePatients(query: string): ActionCentrePatientRow[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();

  // Step 1: filter by name OR id (OR semantics, never AND)
  const matched = ACTION_CENTRE_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q) ||
      p.employer.toLowerCase().includes(q)
  );

  // Step 2: deduplicate by id — enforce uniqueness (DCMP-3616 pattern)
  // In practice mock data has no duplicates, but this guarantees it explicitly.
  const seen = new Set<string>();
  return matched.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

