import { ReactNode } from "react";
import { HelpCircle } from "../lib/icons";

export type PatientRow = {
  id: string;
  name: string;
  mrn: string;
  suspectedHcc: ReactNode;
  suspectedHccText: string;
  classification: "Proactive" | "Reactive";
  awvStatus: "Pending" | "Completed";
  lastTrigger: { type: "paperclip" | "clock"; date: string };
  status: "Open" | "Confirmed" | "Deferred" | "Rejected" | "N/A";
  lastReviewed: { doctor?: string; date?: string } | null;
  age: number;
  gender: string;
  year: string;
  
  // Pre-visit Plan fields
  appointment: string;
  risks: string[];
  lastReview: string;
  aiNotes: string;

  // Coding Queue fields
  encounterId: string;
  encounterDate: string;
  diagnosis: string;
  suggestions: { code: string; score: string }[];
  codingStatus: "AI Suggested" | "Reviewed" | "Flagged";
};

export const PATIENT_DATA: PatientRow[] = [
  {
    id: "1",
    name: "James Smith",
    mrn: "PT0001",
    suspectedHcc: "High Risk: Liver Disease Stage 2-3",
    suspectedHccText: "High Risk: Liver Disease Stage 2-3",
    classification: "Proactive",
    awvStatus: "Pending",
    lastTrigger: { type: "paperclip", date: "03/29/2026" },
    status: "Open",
    lastReviewed: null,
    age: 74,
    gender: "Male",
    year: "2026",
    appointment: "Jun 20, 2026 at 3:30 PM",
    risks: ["High Risk: Liver Disease Stage 2-3", "Indicator A1", "Chronic Condition 1"],
    lastReview: "N/A",
    aiNotes: "Patient has multiple chronic conditions including Chronic Condition 1. Ensure all are addressed. Last relevant lab: Lab X1 Abnormal. AWV status: Not Completed.",
    encounterId: "ENC_PT0001_20260501_0",
    encounterDate: "May 1, 2026",
    diagnosis: "Post-hospital follow-up",
    suggestions: [
      { code: "R05", score: "0.70" },
      { code: "J44.9", score: "0.65" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "2",
    name: "Patricia Smith",
    mrn: "PT0004",
    suspectedHcc: (
      <div className="flex items-center gap-1.5">
        <HelpCircle className="size-3.5 text-amber-500" />
        High Risk: NAFLD with Advanced Fibrosis (F3-F4)
      </div>
    ),
    suspectedHccText: "High Risk: NAFLD with Advanced Fibrosis (F3-F4)",
    classification: "Reactive",
    awvStatus: "Completed",
    lastTrigger: { type: "clock", date: "05/10/2026" },
    status: "Rejected",
    lastReviewed: { doctor: "Dr. Mike Brown", date: "05/18/2026" },
    age: 65,
    gender: "Female",
    year: "2026",
    appointment: "Jun 18, 2026 at 3:30 PM",
    risks: ["High Risk: Liver Disease Stage 2-3", "Indicator A3", "Chronic Condition 3"],
    lastReview: "N/A",
    aiNotes: "Focus on High Risk: Liver Disease Stage 2-3. Review recent Indicator A3. Verify stability of Chronic Condition 3. Consider specific HCC code if documentation supports.",
    encounterId: "ENC_PT0004_20260419_1",
    encounterDate: "Apr 19, 2026",
    diagnosis: "New problem: Worsening Fatigue",
    suggestions: [
      { code: "I23.3", score: "0.87" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "3",
    name: "John Smith",
    mrn: "PT0005",
    suspectedHcc: "Allergic Rhinitis",
    suspectedHccText: "Allergic Rhinitis",
    classification: "Proactive",
    awvStatus: "Pending",
    lastTrigger: { type: "clock", date: "05/08/2026" },
    status: "N/A",
    lastReviewed: null,
    age: 59,
    gender: "Male",
    year: "2026",
    appointment: "Jun 19, 2026 at 3:30 PM",
    risks: ["High Risk: Liver Disease Stage 2-3", "Indicator A1", "Chronic Condition 5"],
    lastReview: "N/A",
    aiNotes: "Upcoming: John Smith. Assess for higher specificity on existing codes. Current medications: Medication 1 XR. Check for recent hospitalizations.",
    encounterId: "ENC_PT0005_20260506_2",
    encounterDate: "May 6, 2026",
    diagnosis: "Routine chronic care management visit",
    suggestions: [
      { code: "R05", score: "0.70" },
      { code: "J44.9", score: "0.65" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "4",
    name: "Jennifer Smith",
    mrn: "PT0006",
    suspectedHcc: (
      <div className="flex items-center gap-1.5">
        <HelpCircle className="size-3.5 text-amber-500" />
        High Risk: Primary Biliary Cholangitis, symptomatic
      </div>
    ),
    suspectedHccText: "High Risk: Primary Biliary Cholangitis, symptomatic",
    classification: "Reactive",
    awvStatus: "Completed",
    lastTrigger: { type: "paperclip", date: "06/23/2026" },
    status: "Open",
    lastReviewed: null,
    age: 71,
    gender: "Female",
    year: "2026",
    appointment: "Jun 18, 2026 at 3:30 PM",
    risks: ["High Risk: Primary Biliary Cholangitis, symptomatic", "Indicator A4", "Chronic Condition 4"],
    lastReview: "N/A",
    aiNotes: "Patient has multiple chronic conditions including Chronic Condition 4. Ensure all are addressed. AWV status: Completed.",
    encounterId: "ENC_PT0006_20260607_3",
    encounterDate: "Jun 7, 2026",
    diagnosis: "Pre-operative clearance",
    suggestions: [
      { code: "I10.5", score: "0.80" },
      { code: "E12.00", score: "0.69" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "5",
    name: "Linda Smith",
    mrn: "PT0008",
    suspectedHcc: (
      <div className="flex items-center gap-1.5">
        <HelpCircle className="size-3.5 text-amber-500" />
        Congestive Heart Failure, NYHA II-III
      </div>
    ),
    suspectedHccText: "Congestive Heart Failure, NYHA II-III",
    classification: "Reactive",
    awvStatus: "Pending",
    lastTrigger: { type: "clock", date: "04/17/2026" },
    status: "Deferred",
    lastReviewed: { doctor: "Dr. Alex Young", date: "03/15/2026" },
    age: 82,
    gender: "Female",
    year: "2026",
    appointment: "Jun 20, 2026 at 3:30 PM",
    risks: ["High Risk: Primary Biliary Cholangitis", "Indicator A9", "Chronic Condition 4"],
    lastReview: "N/A",
    aiNotes: "Routine pre-visit for Linda Smith. Confirm adherence for Medication 12 IR. Discuss lifestyle. Potential recapture for Congestive Heart Failure.",
    encounterId: "ENC_PT0008_20260529_4",
    encounterDate: "May 29, 2026",
    diagnosis: "Acute illness: Respiratory Infection",
    suggestions: [
      { code: "R05", score: "0.70" },
      { code: "J44.9", score: "0.65" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "6",
    name: "William Smith",
    mrn: "PT0009",
    suspectedHcc: (
      <div className="flex items-center gap-1.5">
        <HelpCircle className="size-3.5 text-amber-500" />
        High Risk: Primary Sclerosing Cholangitis
      </div>
    ),
    suspectedHccText: "High Risk: Primary Sclerosing Cholangitis",
    classification: "Proactive",
    awvStatus: "Pending",
    lastTrigger: { type: "clock", date: "04/01/2026" },
    status: "Rejected",
    lastReviewed: { doctor: "Dr. Jordan Rivera", date: "05/24/2026" },
    age: 63,
    gender: "Male",
    year: "2026",
    appointment: "Jun 19, 2026 at 3:30 PM",
    risks: ["Chronic Kidney Disease Stage 3-4", "Indicator A1", "Chronic Condition 3"],
    lastReview: "N/A",
    aiNotes: "Focus on Chronic Kidney Disease Stage 3-4. Review recent Indicator A1. Verify stability of Chronic Condition 3. Consider specific HCC code.",
    encounterId: "ENC_PT0009_20260522_5",
    encounterDate: "May 22, 2026",
    diagnosis: "Medication Refill / Management",
    suggestions: [
      { code: "I24.9", score: "0.91" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "7",
    name: "Elizabeth Smith",
    mrn: "PT0010",
    suspectedHcc: "Gastroesophageal Reflux Disease",
    suspectedHccText: "Gastroesophageal Reflux Disease",
    classification: "Reactive",
    awvStatus: "Completed",
    lastTrigger: { type: "clock", date: "05/22/2026" },
    status: "N/A",
    lastReviewed: null,
    age: 69,
    gender: "Female",
    year: "2026",
    appointment: "Jun 21, 2026 at 3:30 PM",
    risks: ["Gastroesophageal Reflux Disease", "Indicator A1", "Chronic Condition 8"],
    lastReview: "N/A",
    aiNotes: "Patient has multiple chronic conditions including Chronic Condition 8. Ensure all are addressed.",
    encounterId: "ENC_PT0010_20260524_6",
    encounterDate: "May 24, 2026",
    diagnosis: "Post-hospital follow-up",
    suggestions: [
      { code: "R05", score: "0.70" },
      { code: "J44.9", score: "0.65" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "8",
    name: "David Smith",
    mrn: "PT0011",
    suspectedHcc: "Hyperlipidemia",
    suspectedHccText: "Hyperlipidemia",
    classification: "Reactive",
    awvStatus: "Pending",
    lastTrigger: { type: "clock", date: "04/17/2026" },
    status: "Confirmed",
    lastReviewed: { doctor: "Dr. Ben Miller", date: "08/06/2025" },
    age: 68,
    gender: "Male",
    year: "2026",
    appointment: "Jun 19, 2026 at 3:30 PM",
    risks: ["Osteoarthritis", "Indicator A6", "Chronic Condition 5"],
    lastReview: "N/A",
    aiNotes: "Routine pre-visit. Confirm adherence for Medication 9 XR. Discuss lifestyle for Current Smoker, Sedentary. Potential recapture for Osteoarthritis.",
    encounterId: "ENC_PT0011_20260522_7",
    encounterDate: "May 22, 2026",
    diagnosis: "New problem: Worsening Fatigue",
    suggestions: [
      { code: "I17.7", score: "0.77" },
      { code: "C22.4", score: "0.82" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "9",
    name: "Joseph Smith",
    mrn: "PT0015",
    suspectedHcc: "High Risk: Hepatocellular Carcinoma Stage I-II",
    suspectedHccText: "High Risk: Hepatocellular Carcinoma Stage I-II",
    classification: "Proactive",
    awvStatus: "Completed",
    lastTrigger: { type: "clock", date: "05/03/2026" },
    status: "Confirmed",
    lastReviewed: { doctor: "Dr. Pat Kim", date: "06/26/2025" },
    age: 77,
    gender: "Male",
    year: "2026",
    appointment: "Jun 21, 2026 at 3:30 PM",
    risks: ["Rheumatoid Arthritis, active", "Indicator A2", "Chronic Condition 5"],
    lastReview: "N/A",
    aiNotes: "Upcoming: Joseph Smith. Assess for higher specificity on existing codes. Current medications: Medication 5 XR. Check for recent hospitalizations.",
    encounterId: "ENC_PT0015_20260606_8",
    encounterDate: "Jun 6, 2026",
    diagnosis: "Routine chronic care management visit",
    suggestions: [
      { code: "R05", score: "0.70" },
      { code: "J44.9", score: "0.65" },
    ],
    codingStatus: "AI Suggested",
  },
  {
    id: "10",
    name: "Jessica Smith",
    mrn: "PT0016",
    suspectedHcc: "Osteoarthritis",
    suspectedHccText: "Osteoarthritis",
    classification: "Proactive",
    awvStatus: "Completed",
    lastTrigger: { type: "clock", date: "05/21/2026" },
    status: "Deferred",
    lastReviewed: { doctor: "Dr. Sarah Lee", date: "06/15/2026" },
    age: 72,
    gender: "Female",
    year: "2026",
    appointment: "Jun 21, 2026 at 3:30 PM",
    risks: ["High Risk: Liver Disease Stage 2-3", "Indicator A2", "Chronic Condition 7"],
    lastReview: "N/A",
    aiNotes: "Focus on High Risk: Liver Disease Stage 2-3. Review recent Indicator A2. Verify stability of Chronic Condition 7. Consider specific HCC code if documentation supports.",
    encounterId: "ENC_PT0016_20260513_9",
    encounterDate: "May 13, 2026",
    diagnosis: "Pre-operative clearance",
    suggestions: [
      { code: "I24.4", score: "0.88" },
    ],
    codingStatus: "AI Suggested",
  },
];
