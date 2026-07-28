// Shared mock data for SmartyPants DPC Care Operations Hub pages

// ─── Patient Records (Internal CRM) ───────────────────────────────────────
export interface SPPatient {
  id: string;
  name: string;
  employer: string;
  age: number;
  gender: "M" | "F";
  provider: string;
  lastVisit: string;
  nextAppt: string;
  annualExam: "Complete" | "Due" | "Overdue";
  labStatus: "Complete" | "Pending" | "Overdue";
  reviewStatus: "Submitted" | "Requested" | "None";
  riskScore: number;
  engagementScore: number;
  diseaseTags: string[];
  commStatus: "Active" | "Unresponsive" | "Opted Out";
  preferredContact: "Email" | "SMS" | "Phone";
  email: string;
  phone: string;
  lastOutreach: string;
}

export const SP_PATIENTS: SPPatient[] = [
  { id: "SP-1001", name: "Sarah Mitchell", employer: "Apex Technologies", age: 42, gender: "F", provider: "Dr. Josh Umbehr", lastVisit: "2026-06-15", nextAppt: "2026-08-12", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Submitted", riskScore: 2, engagementScore: 92, diseaseTags: ["Hypertension"], commStatus: "Active", preferredContact: "Email", email: "sarah.m@apex.com", phone: "(913) 555-0142", lastOutreach: "2026-07-20" },
  { id: "SP-1002", name: "James Rodriguez", employer: "Pinnacle Corp", age: 55, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-05-22", nextAppt: "2026-09-01", annualExam: "Due", labStatus: "Pending", reviewStatus: "None", riskScore: 7, engagementScore: 58, diseaseTags: ["Diabetes", "Obesity"], commStatus: "Active", preferredContact: "SMS", email: "j.rodriguez@pinnacle.com", phone: "(913) 555-0198", lastOutreach: "2026-07-14" },
  { id: "SP-1003", name: "Emily Chen", employer: "Atlas Group", age: 34, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-07-01", nextAppt: "2026-08-05", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Requested", riskScore: 1, engagementScore: 95, diseaseTags: [], commStatus: "Active", preferredContact: "Email", email: "echen@atlasgroup.com", phone: "(913) 555-0211", lastOutreach: "2026-07-22" },
  { id: "SP-1004", name: "Michael Thompson", employer: "Apex Technologies", age: 61, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-03-10", nextAppt: "—", annualExam: "Overdue", labStatus: "Overdue", reviewStatus: "None", riskScore: 9, engagementScore: 22, diseaseTags: ["COPD", "Hypertension", "Prediabetes"], commStatus: "Unresponsive", preferredContact: "Phone", email: "mthompson@apex.com", phone: "(913) 555-0334", lastOutreach: "2026-06-28" },
  { id: "SP-1005", name: "Jessica Park", employer: "Horizon Medical", age: 29, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-07-18", nextAppt: "2026-10-15", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Submitted", riskScore: 1, engagementScore: 98, diseaseTags: [], commStatus: "Active", preferredContact: "SMS", email: "jpark@horizon.com", phone: "(913) 555-0456", lastOutreach: "2026-07-25" },
  { id: "SP-1006", name: "Robert Davis", employer: "Pinnacle Corp", age: 48, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-04-20", nextAppt: "2026-08-20", annualExam: "Due", labStatus: "Pending", reviewStatus: "None", riskScore: 5, engagementScore: 65, diseaseTags: ["Hyperlipidemia"], commStatus: "Active", preferredContact: "Email", email: "rdavis@pinnacle.com", phone: "(913) 555-0512", lastOutreach: "2026-07-10" },
  { id: "SP-1007", name: "Amanda Wilson", employer: "Atlas Group", age: 37, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-06-28", nextAppt: "2026-09-28", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Submitted", riskScore: 2, engagementScore: 88, diseaseTags: ["Anxiety"], commStatus: "Active", preferredContact: "Email", email: "awilson@atlasgroup.com", phone: "(913) 555-0678", lastOutreach: "2026-07-19" },
  { id: "SP-1008", name: "David Kim", employer: "Apex Technologies", age: 52, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-02-14", nextAppt: "—", annualExam: "Overdue", labStatus: "Overdue", reviewStatus: "None", riskScore: 8, engagementScore: 18, diseaseTags: ["Diabetes", "Hypertension", "CKD Stage 3"], commStatus: "Unresponsive", preferredContact: "Phone", email: "dkim@apex.com", phone: "(913) 555-0789", lastOutreach: "2026-05-30" },
  { id: "SP-1009", name: "Rachel Green", employer: "Horizon Medical", age: 44, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-07-05", nextAppt: "2026-08-25", annualExam: "Complete", labStatus: "Pending", reviewStatus: "Requested", riskScore: 3, engagementScore: 78, diseaseTags: ["Hypothyroidism"], commStatus: "Active", preferredContact: "SMS", email: "rgreen@horizon.com", phone: "(913) 555-0891", lastOutreach: "2026-07-21" },
  { id: "SP-1010", name: "Thomas Anderson", employer: "Pinnacle Corp", age: 67, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-06-01", nextAppt: "2026-08-15", annualExam: "Due", labStatus: "Pending", reviewStatus: "None", riskScore: 6, engagementScore: 55, diseaseTags: ["Atrial Fibrillation", "Hypertension"], commStatus: "Active", preferredContact: "Phone", email: "tanderson@pinnacle.com", phone: "(913) 555-0912", lastOutreach: "2026-07-08" },
  { id: "SP-1011", name: "Maria Santos", employer: "Atlas Group", age: 31, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-07-22", nextAppt: "2026-10-22", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Submitted", riskScore: 1, engagementScore: 96, diseaseTags: [], commStatus: "Active", preferredContact: "Email", email: "msantos@atlasgroup.com", phone: "(913) 555-1023", lastOutreach: "2026-07-26" },
  { id: "SP-1012", name: "William Brown", employer: "Apex Technologies", age: 58, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-05-10", nextAppt: "2026-08-30", annualExam: "Due", labStatus: "Overdue", reviewStatus: "None", riskScore: 7, engagementScore: 42, diseaseTags: ["Diabetes", "Obesity", "Sleep Apnea"], commStatus: "Active", preferredContact: "SMS", email: "wbrown@apex.com", phone: "(913) 555-1134", lastOutreach: "2026-07-12" },
  { id: "SP-1013", name: "Jennifer Lee", employer: "Horizon Medical", age: 39, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-06-18", nextAppt: "2026-09-18", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Requested", riskScore: 2, engagementScore: 85, diseaseTags: ["Migraine"], commStatus: "Active", preferredContact: "Email", email: "jlee@horizon.com", phone: "(913) 555-1245", lastOutreach: "2026-07-17" },
  { id: "SP-1014", name: "Christopher Martinez", employer: "Pinnacle Corp", age: 45, gender: "M", provider: "Dr. Josh Umbehr", lastVisit: "2026-01-05", nextAppt: "—", annualExam: "Overdue", labStatus: "Overdue", reviewStatus: "None", riskScore: 8, engagementScore: 15, diseaseTags: ["Depression", "Hypertension"], commStatus: "Opted Out", preferredContact: "Phone", email: "cmartinez@pinnacle.com", phone: "(913) 555-1356", lastOutreach: "2026-04-15" },
  { id: "SP-1015", name: "Nicole Taylor", employer: "Atlas Group", age: 26, gender: "F", provider: "Dr. Lisa Dang", lastVisit: "2026-07-10", nextAppt: "2026-10-10", annualExam: "Complete", labStatus: "Complete", reviewStatus: "Submitted", riskScore: 1, engagementScore: 97, diseaseTags: [], commStatus: "Active", preferredContact: "SMS", email: "ntaylor@atlasgroup.com", phone: "(913) 555-1467", lastOutreach: "2026-07-24" },
];

// ─── Segments ──────────────────────────────────────────────────────────────
export interface SPSegment {
  id: string;
  name: string;
  patientCount: number;
  trend: number; // +/-
  avgEngagement: number;
  avgClaims: number;
  avgVisits: number;
  campaigns: number;
  color: string;
}

export const SP_SEGMENTS: SPSegment[] = [
  { id: "seg-1", name: "Needs Annual Exam", patientCount: 342, trend: -12, avgEngagement: 62, avgClaims: 2.1, avgVisits: 1.8, campaigns: 2, color: "#e61952" },
  { id: "seg-2", name: "Labs Outstanding", patientCount: 218, trend: -8, avgEngagement: 55, avgClaims: 1.9, avgVisits: 2.0, campaigns: 1, color: "#dc3545" },
  { id: "seg-3", name: "Diabetes", patientCount: 189, trend: 5, avgEngagement: 71, avgClaims: 4.2, avgVisits: 3.5, campaigns: 3, color: "#007bff" },
  { id: "seg-4", name: "Hypertension", patientCount: 312, trend: 8, avgEngagement: 68, avgClaims: 3.1, avgVisits: 2.8, campaigns: 2, color: "#1976d2" },
  { id: "seg-5", name: "Obesity", patientCount: 156, trend: 3, avgEngagement: 52, avgClaims: 2.8, avgVisits: 1.6, campaigns: 1, color: "#ffa000" },
  { id: "seg-6", name: "Prediabetes", patientCount: 98, trend: -2, avgEngagement: 60, avgClaims: 1.5, avgVisits: 1.4, campaigns: 2, color: "#ff6f00" },
  { id: "seg-7", name: "Mental Health", patientCount: 134, trend: 12, avgEngagement: 74, avgClaims: 3.8, avgVisits: 4.2, campaigns: 1, color: "#673ab7" },
  { id: "seg-8", name: "High Utilizer", patientCount: 67, trend: -3, avgEngagement: 88, avgClaims: 8.5, avgVisits: 6.2, campaigns: 0, color: "#28a745" },
  { id: "seg-9", name: "Inactive >12 Months", patientCount: 241, trend: 15, avgEngagement: 8, avgClaims: 0.2, avgVisits: 0.0, campaigns: 1, color: "#6c757d" },
  { id: "seg-10", name: "High Risk", patientCount: 89, trend: -5, avgEngagement: 45, avgClaims: 6.1, avgVisits: 3.0, campaigns: 2, color: "#dc3545" },
  { id: "seg-11", name: "Low Engagement", patientCount: 178, trend: 7, avgEngagement: 22, avgClaims: 1.0, avgVisits: 0.8, campaigns: 1, color: "#ffc107" },
  { id: "seg-12", name: "Review Eligible", patientCount: 423, trend: -18, avgEngagement: 78, avgClaims: 2.5, avgVisits: 2.4, campaigns: 1, color: "#17a2b8" },
];

// ─── Campaigns ─────────────────────────────────────────────────────────────
export interface SPCampaign {
  id: string;
  name: string;
  type: "Patient" | "Lead" | "Employer";
  status: "Active" | "Draft" | "Completed" | "Archived";
  audience: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replies: number;
  channel: "Email" | "SMS" | "Multi-Channel";
  createdAt: string;
}

export const SP_CAMPAIGNS: SPCampaign[] = [
  { id: "CMP-001", name: "Annual Exam Reminder Q3", type: "Patient", status: "Active", audience: 342, sent: 310, delivered: 298, opened: 186, clicked: 72, replies: 28, channel: "Email", createdAt: "2026-07-01" },
  { id: "CMP-002", name: "Lab Reminder — Diabetes Panel", type: "Patient", status: "Active", audience: 189, sent: 175, delivered: 170, opened: 102, clicked: 45, replies: 15, channel: "SMS", createdAt: "2026-07-05" },
  { id: "CMP-003", name: "Monthly Newsletter — July", type: "Patient", status: "Completed", audience: 1420, sent: 1380, delivered: 1352, opened: 892, clicked: 234, replies: 12, channel: "Email", createdAt: "2026-07-15" },
  { id: "CMP-004", name: "Review Request Campaign", type: "Patient", status: "Active", audience: 423, sent: 400, delivered: 392, opened: 245, clicked: 89, replies: 42, channel: "Multi-Channel", createdAt: "2026-07-10" },
  { id: "CMP-005", name: "Employer Q3 Education", type: "Employer", status: "Draft", audience: 45, sent: 0, delivered: 0, opened: 0, clicked: 0, replies: 0, channel: "Email", createdAt: "2026-07-20" },
  { id: "CMP-006", name: "Community Lead Welcome", type: "Lead", status: "Active", audience: 78, sent: 72, delivered: 68, opened: 45, clicked: 22, replies: 8, channel: "Multi-Channel", createdAt: "2026-06-15" },
  { id: "CMP-007", name: "HRT Interest Nurture", type: "Lead", status: "Active", audience: 34, sent: 30, delivered: 28, opened: 19, clicked: 12, replies: 5, channel: "Email", createdAt: "2026-06-28" },
  { id: "CMP-008", name: "Vaccination Reminder", type: "Patient", status: "Completed", audience: 567, sent: 540, delivered: 528, opened: 312, clicked: 98, replies: 22, channel: "SMS", createdAt: "2026-06-01" },
  { id: "CMP-009", name: "6-Month Check-in", type: "Patient", status: "Active", audience: 234, sent: 210, delivered: 205, opened: 134, clicked: 56, replies: 18, channel: "Email", createdAt: "2026-07-12" },
  { id: "CMP-010", name: "Employer Onboarding — Atlas Group", type: "Employer", status: "Archived", audience: 120, sent: 120, delivered: 118, opened: 95, clicked: 42, replies: 8, channel: "Email", createdAt: "2026-03-01" },
];

// ─── Tasks / Reminders ─────────────────────────────────────────────────────
export interface SPTask {
  id: string;
  patient: string;
  patientId: string;
  reminderType: string;
  assignedStaff: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed" | "Overdue" | "Escalated";
  commSent: boolean;
  completion: number;
}

export const SP_TASKS: SPTask[] = [
  { id: "TSK-001", patient: "Michael Thompson", patientId: "SP-1004", reminderType: "Annual Exam", assignedStaff: "Sarah Jenkins, RN", dueDate: "2026-07-30", priority: "High", status: "Overdue", commSent: true, completion: 0 },
  { id: "TSK-002", patient: "David Kim", patientId: "SP-1008", reminderType: "Lab Due", assignedStaff: "Sarah Jenkins, RN", dueDate: "2026-08-01", priority: "High", status: "Escalated", commSent: true, completion: 0 },
  { id: "TSK-003", patient: "James Rodriguez", patientId: "SP-1002", reminderType: "Annual Exam", assignedStaff: "Maria Lopez, MA", dueDate: "2026-08-05", priority: "Medium", status: "Pending", commSent: true, completion: 0 },
  { id: "TSK-004", patient: "Robert Davis", patientId: "SP-1006", reminderType: "Lab Due", assignedStaff: "Maria Lopez, MA", dueDate: "2026-08-10", priority: "Medium", status: "In Progress", commSent: true, completion: 50 },
  { id: "TSK-005", patient: "Thomas Anderson", patientId: "SP-1010", reminderType: "Medication", assignedStaff: "Sarah Jenkins, RN", dueDate: "2026-08-12", priority: "Medium", status: "Pending", commSent: false, completion: 0 },
  { id: "TSK-006", patient: "William Brown", patientId: "SP-1012", reminderType: "6 Month Follow-up", assignedStaff: "Maria Lopez, MA", dueDate: "2026-08-15", priority: "Low", status: "Pending", commSent: false, completion: 0 },
  { id: "TSK-007", patient: "Christopher Martinez", patientId: "SP-1014", reminderType: "Annual Exam", assignedStaff: "Sarah Jenkins, RN", dueDate: "2026-07-25", priority: "High", status: "Overdue", commSent: true, completion: 0 },
  { id: "TSK-008", patient: "Rachel Green", patientId: "SP-1009", reminderType: "Review Request", assignedStaff: "Maria Lopez, MA", dueDate: "2026-08-20", priority: "Low", status: "In Progress", commSent: true, completion: 75 },
  { id: "TSK-009", patient: "Sarah Mitchell", patientId: "SP-1001", reminderType: "Vaccination", assignedStaff: "Sarah Jenkins, RN", dueDate: "2026-09-01", priority: "Low", status: "Pending", commSent: false, completion: 0 },
  { id: "TSK-010", patient: "Emily Chen", patientId: "SP-1003", reminderType: "Review Request", assignedStaff: "Maria Lopez, MA", dueDate: "2026-08-08", priority: "Low", status: "Completed", commSent: true, completion: 100 },
  { id: "TSK-011", patient: "Jennifer Lee", patientId: "SP-1013", reminderType: "Referral Follow-up", assignedStaff: "Sarah Jenkins, RN", dueDate: "2026-08-18", priority: "Medium", status: "Pending", commSent: false, completion: 0 },
  { id: "TSK-012", patient: "Nicole Taylor", patientId: "SP-1015", reminderType: "Employer Renewal", assignedStaff: "Maria Lopez, MA", dueDate: "2026-09-15", priority: "Low", status: "Pending", commSent: false, completion: 0 },
];

// ─── Leads (External CRM) ─────────────────────────────────────────────────
export interface SPLead {
  id: string;
  name: string;
  company: string;
  source: string;
  interest: string;
  pipeline: "Community" | "Employer" | "Referral" | "HRT";
  stage: "New" | "Contacted" | "Meeting Scheduled" | "Proposal" | "Follow-up" | "Won" | "Lost";
  owner: string;
  lastContact: string;
  nextFollowUp: string;
  score: number;
  campaign: string;
}

export const SP_LEADS: SPLead[] = [
  { id: "LD-001", name: "Mark Stevens", company: "—", source: "Website Form", interest: "Primary Care Membership", pipeline: "Community", stage: "New", owner: "Lisa Chen", lastContact: "2026-07-26", nextFollowUp: "2026-07-29", score: 72, campaign: "Community Lead Welcome" },
  { id: "LD-002", name: "Karen Phillips", company: "Techflow Inc", source: "Referral", interest: "Employer Plan", pipeline: "Employer", stage: "Meeting Scheduled", owner: "Dr. Josh Umbehr", lastContact: "2026-07-22", nextFollowUp: "2026-07-30", score: 88, campaign: "—" },
  { id: "LD-003", name: "Brian Walsh", company: "—", source: "Social Media", interest: "HRT Consultation", pipeline: "HRT", stage: "Contacted", owner: "Lisa Chen", lastContact: "2026-07-24", nextFollowUp: "2026-07-31", score: 65, campaign: "HRT Interest Nurture" },
  { id: "LD-004", name: "Susan Hayes", company: "—", source: "Google Ads", interest: "Primary Care Membership", pipeline: "Community", stage: "Follow-up", owner: "Lisa Chen", lastContact: "2026-07-18", nextFollowUp: "2026-07-28", score: 45, campaign: "Community Lead Welcome" },
  { id: "LD-005", name: "Daniel Morrison", company: "Greenfield LLC", source: "Cold Outreach", interest: "Employer Plan", pipeline: "Employer", stage: "Proposal", owner: "Dr. Josh Umbehr", lastContact: "2026-07-20", nextFollowUp: "2026-08-01", score: 91, campaign: "—" },
  { id: "LD-006", name: "Lisa Park", company: "—", source: "Patient Referral", interest: "Primary Care Membership", pipeline: "Referral", stage: "Won", owner: "Lisa Chen", lastContact: "2026-07-15", nextFollowUp: "—", score: 95, campaign: "—" },
  { id: "LD-007", name: "Andrew Chen", company: "—", source: "Website Form", interest: "HRT Consultation", pipeline: "HRT", stage: "New", owner: "Lisa Chen", lastContact: "2026-07-27", nextFollowUp: "2026-07-30", score: 58, campaign: "HRT Interest Nurture" },
  { id: "LD-008", name: "Patricia Gomez", company: "Metro Staffing", source: "Event", interest: "Employer Plan", pipeline: "Employer", stage: "Contacted", owner: "Dr. Josh Umbehr", lastContact: "2026-07-21", nextFollowUp: "2026-08-02", score: 75, campaign: "—" },
  { id: "LD-009", name: "Ryan Mitchell", company: "—", source: "Google Ads", interest: "Primary Care Membership", pipeline: "Community", stage: "Lost", owner: "Lisa Chen", lastContact: "2026-06-30", nextFollowUp: "—", score: 20, campaign: "Community Lead Welcome" },
  { id: "LD-010", name: "Anna Rodriguez", company: "—", source: "Patient Referral", interest: "Primary Care Membership", pipeline: "Referral", stage: "Meeting Scheduled", owner: "Lisa Chen", lastContact: "2026-07-25", nextFollowUp: "2026-07-29", score: 82, campaign: "—" },
];

// ─── Employers ─────────────────────────────────────────────────────────────
export interface SPEmployer {
  name: string;
  members: number;
  activeMembers: number;
  engagement: number;
  utilization: number;
  costPMPM: number;
  claims: number;
  visits: number;
  roi: number;
  annualExams: number;
  preventiveCare: number;
  labCompletion: number;
  reviewDate: string;
}

export const SP_EMPLOYERS: SPEmployer[] = [
  { name: "Apex Technologies", members: 420, activeMembers: 385, engagement: 78, utilization: 82, costPMPM: 125, claims: 1240, visits: 2810, roi: 18.5, annualExams: 72, preventiveCare: 68, labCompletion: 75, reviewDate: "2026-09-15" },
  { name: "Pinnacle Corp", members: 310, activeMembers: 275, engagement: 65, utilization: 71, costPMPM: 142, claims: 980, visits: 1920, roi: 14.2, annualExams: 58, preventiveCare: 55, labCompletion: 62, reviewDate: "2026-10-01" },
  { name: "Atlas Group", members: 280, activeMembers: 268, engagement: 88, utilization: 90, costPMPM: 98, claims: 620, visits: 2450, roi: 24.1, annualExams: 85, preventiveCare: 82, labCompletion: 88, reviewDate: "2026-08-30" },
  { name: "Horizon Medical", members: 195, activeMembers: 180, engagement: 82, utilization: 85, costPMPM: 110, claims: 480, visits: 1680, roi: 20.3, annualExams: 78, preventiveCare: 75, labCompletion: 80, reviewDate: "2026-11-15" },
  { name: "Greenfield LLC", members: 85, activeMembers: 72, engagement: 55, utilization: 60, costPMPM: 165, claims: 310, visits: 520, roi: 8.5, annualExams: 45, preventiveCare: 40, labCompletion: 48, reviewDate: "2026-12-01" },
];

// ─── Activity Feed ─────────────────────────────────────────────────────────
export interface SPActivity {
  id: string;
  text: string;
  type: "clinical" | "communication" | "campaign" | "employer" | "system";
  timestamp: string;
  icon: string;
}

export const SP_ACTIVITIES: SPActivity[] = [
  { id: "ACT-1", text: "Sarah Mitchell completed Annual Exam", type: "clinical", timestamp: "Today, 10:15 AM", icon: "check" },
  { id: "ACT-2", text: "Lab reminder sent to 42 patients", type: "communication", timestamp: "Today, 09:30 AM", icon: "mail" },
  { id: "ACT-3", text: "Apex Technologies Q3 report generated", type: "employer", timestamp: "Today, 08:45 AM", icon: "file" },
  { id: "ACT-4", text: "Monthly Newsletter campaign published", type: "campaign", timestamp: "Yesterday, 04:00 PM", icon: "send" },
  { id: "ACT-5", text: "3 new Google reviews submitted", type: "system", timestamp: "Yesterday, 02:30 PM", icon: "star" },
  { id: "ACT-6", text: "Emily Chen enrolled in Review Request campaign", type: "campaign", timestamp: "Yesterday, 01:15 PM", icon: "user" },
  { id: "ACT-7", text: "Dr. Umbehr completed 8 patient notes", type: "clinical", timestamp: "Yesterday, 12:00 PM", icon: "edit" },
  { id: "ACT-8", text: "New lead: Mark Stevens via website form", type: "system", timestamp: "Yesterday, 11:30 AM", icon: "plus" },
  { id: "ACT-9", text: "Pinnacle Corp engagement sync completed", type: "employer", timestamp: "Jul 25, 05:00 PM", icon: "refresh" },
  { id: "ACT-10", text: "Vaccination reminder sent to 156 patients", type: "communication", timestamp: "Jul 25, 09:00 AM", icon: "mail" },
];

// ─── Chart Data ────────────────────────────────────────────────────────────
export const SP_MONTHLY_ENGAGEMENT = [
  { month: "Jan", emails: 1200, texts: 450, engagement: 72 },
  { month: "Feb", emails: 1350, texts: 520, engagement: 74 },
  { month: "Mar", emails: 1180, texts: 480, engagement: 71 },
  { month: "Apr", emails: 1420, texts: 560, engagement: 76 },
  { month: "May", emails: 1550, texts: 620, engagement: 78 },
  { month: "Jun", emails: 1680, texts: 710, engagement: 80 },
  { month: "Jul", emails: 1820, texts: 790, engagement: 82 },
];

export const SP_EMPLOYER_COST_TREND = [
  { month: "Jan", apex: 132, pinnacle: 155, atlas: 105, horizon: 118 },
  { month: "Feb", apex: 130, pinnacle: 150, atlas: 102, horizon: 115 },
  { month: "Mar", apex: 128, pinnacle: 148, atlas: 100, horizon: 112 },
  { month: "Apr", apex: 127, pinnacle: 145, atlas: 99, horizon: 111 },
  { month: "May", apex: 126, pinnacle: 144, atlas: 98, horizon: 110 },
  { month: "Jun", apex: 125, pinnacle: 142, atlas: 98, horizon: 110 },
];

// ─── Communications ────────────────────────────────────────────────────────
export interface SPMessage {
  id: string;
  patient: string;
  patientId: string;
  channel: "Email" | "SMS";
  subject: string;
  preview: string;
  status: "Delivered" | "Opened" | "Replied" | "Failed" | "Bounced";
  timestamp: string;
  direction: "Outbound" | "Inbound";
}

export const SP_MESSAGES: SPMessage[] = [
  { id: "MSG-001", patient: "Sarah Mitchell", patientId: "SP-1001", channel: "Email", subject: "Your Annual Exam is Complete!", preview: "Hi Sarah, thank you for completing your annual exam...", status: "Opened", timestamp: "2026-07-26 10:30 AM", direction: "Outbound" },
  { id: "MSG-002", patient: "James Rodriguez", patientId: "SP-1002", channel: "SMS", subject: "—", preview: "Hi James, your annual exam is due. Please call to schedule.", status: "Delivered", timestamp: "2026-07-26 09:15 AM", direction: "Outbound" },
  { id: "MSG-003", patient: "Emily Chen", patientId: "SP-1003", channel: "Email", subject: "We'd Love Your Feedback!", preview: "Hi Emily, would you mind leaving us a review on Google?", status: "Replied", timestamp: "2026-07-25 03:00 PM", direction: "Outbound" },
  { id: "MSG-004", patient: "Emily Chen", patientId: "SP-1003", channel: "Email", subject: "Re: We'd Love Your Feedback!", preview: "Of course! I just left a 5-star review. Love the practice!", status: "Replied", timestamp: "2026-07-25 04:15 PM", direction: "Inbound" },
  { id: "MSG-005", patient: "Michael Thompson", patientId: "SP-1004", channel: "Email", subject: "Important: Annual Exam Overdue", preview: "Dear Michael, our records show your annual exam is overdue...", status: "Failed", timestamp: "2026-07-24 11:00 AM", direction: "Outbound" },
  { id: "MSG-006", patient: "David Kim", patientId: "SP-1008", channel: "SMS", subject: "—", preview: "David, you have overdue lab work. Please contact us ASAP.", status: "Delivered", timestamp: "2026-07-24 10:00 AM", direction: "Outbound" },
  { id: "MSG-007", patient: "Robert Davis", patientId: "SP-1006", channel: "Email", subject: "Lab Reminder", preview: "Hi Robert, this is a reminder that your lipid panel is due...", status: "Opened", timestamp: "2026-07-23 02:30 PM", direction: "Outbound" },
  { id: "MSG-008", patient: "Amanda Wilson", patientId: "SP-1007", channel: "Email", subject: "SmartyPants Medicine July Newsletter", preview: "This month: summer health tips, new services, and more!", status: "Opened", timestamp: "2026-07-22 09:00 AM", direction: "Outbound" },
];

// ─── Templates ─────────────────────────────────────────────────────────────
export interface SPTemplate {
  id: string;
  name: string;
  category: string;
  channel: "Email" | "SMS";
  subject: string;
  lastUsed: string;
  timesUsed: number;
}

export const SP_TEMPLATES: SPTemplate[] = [
  { id: "TPL-001", name: "Annual Exam Reminder", category: "Clinical", channel: "Email", subject: "Time for Your Annual Exam!", lastUsed: "2026-07-20", timesUsed: 342 },
  { id: "TPL-002", name: "Lab Reminder", category: "Clinical", channel: "SMS", subject: "—", lastUsed: "2026-07-18", timesUsed: 218 },
  { id: "TPL-003", name: "Review Request", category: "Marketing", channel: "Email", subject: "We'd Love Your Feedback!", lastUsed: "2026-07-22", timesUsed: 423 },
  { id: "TPL-004", name: "Employer Welcome", category: "Employer", channel: "Email", subject: "Welcome to SmartyPants Medicine!", lastUsed: "2026-06-15", timesUsed: 45 },
  { id: "TPL-005", name: "Monthly Newsletter", category: "Marketing", channel: "Email", subject: "SmartyPants Medicine Monthly Update", lastUsed: "2026-07-15", timesUsed: 1420 },
  { id: "TPL-006", name: "Event Invitation", category: "Marketing", channel: "Email", subject: "You're Invited!", lastUsed: "2026-06-28", timesUsed: 89 },
  { id: "TPL-007", name: "HRT Consultation", category: "Clinical", channel: "Email", subject: "Learn About HRT Options", lastUsed: "2026-07-10", timesUsed: 34 },
  { id: "TPL-008", name: "Welcome New Patient", category: "Onboarding", channel: "Email", subject: "Welcome to SmartyPants Medicine!", lastUsed: "2026-07-25", timesUsed: 567 },
];

// ─── Automations ───────────────────────────────────────────────────────────
export interface SPAutomation {
  id: string;
  name: string;
  trigger: string;
  status: "Active" | "Paused" | "Draft";
  executions: number;
  successRate: number;
  lastRun: string;
  steps: number;
}

export const SP_AUTOMATIONS: SPAutomation[] = [
  { id: "AUT-001", name: "Annual Exam Reminder Sequence", trigger: "Annual Exam Due", status: "Active", executions: 342, successRate: 94, lastRun: "2026-07-26", steps: 5 },
  { id: "AUT-002", name: "Lab Due Follow-up", trigger: "Lab Ordered", status: "Active", executions: 218, successRate: 89, lastRun: "2026-07-25", steps: 4 },
  { id: "AUT-003", name: "New Patient Onboarding", trigger: "Patient Created", status: "Active", executions: 567, successRate: 97, lastRun: "2026-07-26", steps: 6 },
  { id: "AUT-004", name: "Review Request After Visit", trigger: "Visit Completed", status: "Active", executions: 1420, successRate: 91, lastRun: "2026-07-26", steps: 3 },
  { id: "AUT-005", name: "Community Lead Nurture", trigger: "Lead Created", status: "Active", executions: 78, successRate: 86, lastRun: "2026-07-24", steps: 7 },
  { id: "AUT-006", name: "Employer Monthly Sync", trigger: "Google Sheet Updated", status: "Active", executions: 45, successRate: 100, lastRun: "2026-07-01", steps: 4 },
  { id: "AUT-007", name: "Birthday Greeting", trigger: "Manual Entry", status: "Paused", executions: 890, successRate: 99, lastRun: "2026-06-30", steps: 2 },
  { id: "AUT-008", name: "Employer ROI Report", trigger: "Employer Added", status: "Draft", executions: 0, successRate: 0, lastRun: "—", steps: 5 },
];

// ─── Execution Log ─────────────────────────────────────────────────────────
export interface SPExecutionLog {
  id: string;
  automation: string;
  patient: string;
  timestamp: string;
  success: boolean;
  error: string | null;
  retries: number;
}

export const SP_EXECUTION_LOG: SPExecutionLog[] = [
  { id: "EXE-001", automation: "Annual Exam Reminder Sequence", patient: "James Rodriguez", timestamp: "2026-07-26 09:15 AM", success: true, error: null, retries: 0 },
  { id: "EXE-002", automation: "Review Request After Visit", patient: "Sarah Mitchell", timestamp: "2026-07-26 10:30 AM", success: true, error: null, retries: 0 },
  { id: "EXE-003", automation: "Lab Due Follow-up", patient: "Robert Davis", timestamp: "2026-07-25 02:30 PM", success: true, error: null, retries: 1 },
  { id: "EXE-004", automation: "Annual Exam Reminder Sequence", patient: "Michael Thompson", timestamp: "2026-07-24 11:00 AM", success: false, error: "Email bounced — invalid address", retries: 2 },
  { id: "EXE-005", automation: "Community Lead Nurture", patient: "Mark Stevens", timestamp: "2026-07-26 08:00 AM", success: true, error: null, retries: 0 },
  { id: "EXE-006", automation: "New Patient Onboarding", patient: "Lisa Park", timestamp: "2026-07-25 11:30 AM", success: true, error: null, retries: 0 },
  { id: "EXE-007", automation: "Employer Monthly Sync", patient: "Apex Technologies", timestamp: "2026-07-01 05:00 AM", success: true, error: null, retries: 0 },
  { id: "EXE-008", automation: "Lab Due Follow-up", patient: "David Kim", timestamp: "2026-07-24 10:00 AM", success: false, error: "SMS delivery failed — number unregistered", retries: 3 },
];
