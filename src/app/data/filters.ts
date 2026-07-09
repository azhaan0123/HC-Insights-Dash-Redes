import type { FilterChip } from "../components/layout/FilterBar";
import { DPCS, EMPLOYERS, PHYSICIANS } from "./options";

const employerOptions = ["All Sponsored Patients", ...EMPLOYERS];
const dpcOptions = ["All DPCs", ...DPCS];
const physicianOptions = ["All Physicians", ...PHYSICIANS];

export const baseChips: FilterChip[] = [
  { label: "Start Date", value: "01-01-2023" },
  { label: "End Date", value: "06-09-2026" },
  { label: "Employer", value: "All Sponsored Patients", options: employerOptions },
  { label: "Division", value: "All Divisions", options: ["All Divisions", "Clinical", "Operations"] },
  { label: "DPC", value: "All DPCs", options: dpcOptions },
  { label: "Physician", value: "All Physicians", options: physicianOptions },
];

export const engagementChips: FilterChip[] = [
  ...baseChips,
  { label: "Sender", value: "All Senders", options: ["All Senders", "Care Team", "Automated"] },
];

export const surveyChips: FilterChip[] = [
  { label: "Start Date", value: "01-01-2023" },
  { label: "End Date", value: "06-09-2026" },
  { label: "Employer", value: "All Sponsored Patients", options: employerOptions },
  { label: "Patient Category", value: "All Patients", options: ["All Patients", "Active", "Inactive"] },
  { label: "DPC", value: "All DPCs", options: dpcOptions },
  { label: "Physician", value: "All Physicians", options: physicianOptions },
];

export const claimsChips: FilterChip[] = [
  { label: "Start Date", value: "01-01-2023" },
  { label: "End Date", value: "06-09-2026" },
  { label: "Employer", value: "All Sponsored Patients", options: employerOptions },
  { label: "Division", value: "All Divisions", options: ["All Divisions", "Clinical", "Operations"] },
];

export const coordinatedCareChips: FilterChip[] = [
  { label: "Start Date", value: "01-01-2023" },
  { label: "End Date", value: "06-09-2026" },
  { label: "Employer", value: "All Sponsored Patients", options: employerOptions },
];

export const utilizationGapsChips: FilterChip[] = [
  { label: "Employer", value: "All Sponsored Patients", options: employerOptions },
  { label: "Division", value: "All Divisions", options: ["All Divisions", "Clinical", "Operations"] },
  { label: "DPC", value: "All DPCs", options: dpcOptions },
  { label: "Physician", value: "All Physicians", options: physicianOptions },
  { label: "Inactivity Period", value: "30+ Days Inactive", options: ["30+ Days Inactive", "60+ Days Inactive", "90+ Days Inactive"] },
];

export const hccChips: FilterChip[] = [
  { label: "Start Date", value: "01-01-2023" },
  { label: "End Date", value: "06-09-2026" },
  { label: "Classification", value: "All Classifications", options: ["All Classifications", "Proactive", "Reactive"] },
  { label: "Trigger", value: "All Triggers", options: ["All Triggers", "Recent Lab", "Medication"] },
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Pending", "Completed"] },
  { label: "AWV", value: "All AWV", options: ["All AWV", "Completed", "Pending"] },
];

export const acoChips: FilterChip[] = [
  { label: "Start Date", value: "01-01-2023" },
  { label: "End Date", value: "06-09-2026" },
  { label: "Provider", value: "All Providers", options: ["All Providers", ...physicianOptions.filter(p => p !== "All Physicians")] },
  { label: "Measure", value: "All Measures", options: ["All Measures", "Influenza Immunization", "Controlling High BP", "Colorectal Cancer Screening", "Diabetes HbA1c Poor Control > 9%", "Depression Remission at 12 Months", "Falls Risk Screening", "Medication Reconciliation Post-Discharge"] },
  { label: "Facility", value: "All Facilities", options: ["All Facilities", "Main Clinic", "North Branch", "West Branch"] },
];

export const outcomesChips: FilterChip[] = [
  { label: "Employer", value: "All Sponsored Patients", options: employerOptions },
  { label: "DPC", value: "All DPCs", options: dpcOptions },
  { label: "Physician", value: "All Physicians", options: physicianOptions },
  { label: "Period", value: "Last 12 Months", options: ["Last 12 Months", "Year to Date", "Last 30 Days"] },
];

export const patientGroupsChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Disease", value: "All Diseases", options: ["All Diseases", "Hypertension", "Diabetes Mellitus Type 2", "Obesity", "Vitamin B12 deficiency"] },
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Controlled", "Uncontrolled", "Stable", "Improving", "Worsening"] },
];

export const screeningsChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Type", value: "All Types", options: ["All Types", "Colon Cancer", "Cervical Cancer", "Prostate Cancer", "Breast Cancer", "Eye Exam", "Dental Exam"] },
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Overdue", "Due Soon"] },
];

export const vaccinationsChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Type", value: "All Types", options: ["All Types", "TdaP", "Influenza", "COVID-19", "Pneumococcal", "Shingles"] },
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Overdue", "Due Soon"] },
];

export const appointmentsChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Scheduled", "Completed", "Missed", "Cancelled"] },
];

export const labTrendsChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Lab Test", value: "LDL Cholesterol", options: ["LDL Cholesterol", "HbA1c", "Vitamin D", "TSH"] },
];

export const medicationRefillsChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Medication", value: "All Medications", options: ["All Medications", "Lisinopril", "Metformin", "Atorvastatin", "Levothyroxine", "Amlodipine"] },
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Due Soon", "Overdue"] },
];

export const labCadenceChips: FilterChip[] = [
  ...outcomesChips,
  { label: "Lab Test", value: "All Lab Tests", options: ["All Lab Tests", "Lipid Panel", "Comprehensive Metabolic Panel", "CBC", "HbA1c"] },
  { label: "Status", value: "All Statuses", options: ["All Statuses", "Due Soon", "Overdue"] },
];

export const mipsChips: FilterChip[] = [
  { label: "Performance Year", value: "2026", options: ["2026", "2025", "2026"] },
  { label: "Provider", value: "All Providers", options: ["All Providers", ...physicianOptions.filter(p => p !== "All Physicians")] },
  { label: "Submission Status", value: "Q4 In Progress", options: ["Q4 In Progress", "Submitted", "Ready for Review"] },
  { label: "Domain", value: "All Domains", options: ["All Domains", "Quality", "Cost", "Promoting Interoperability", "Improvement Activities"] },
];

export const employerChips: FilterChip[] = [
  { label: "Plan Year", value: "2024", options: ["2024", "2025", "2026"] },
  { label: "Employer Group", value: "Acme Corporation", options: ["Acme Corporation", ...employerOptions.filter(e => e !== "All Sponsored Patients" && e !== "Acme Corporation")] },
  { label: "From Month", value: "Jan", options: ["Jan", "Apr", "Jul", "Oct"] },
  { label: "To Month", value: "Dec", options: ["Mar", "Jun", "Sep", "Dec"] },
  { label: "Cohort Status", value: "Active Manifest", options: ["Active Manifest", "COBRA / Terminated", "All Members"] },
];

