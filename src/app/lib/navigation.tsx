import {
  Home,
  Activity,
  BarChart3,
  Users,
  HeartPulse,
  ReceiptText,
  Receipt,
  Workflow,
  MessageSquare,
  Megaphone,
  ClipboardCheck,
  Palette,
  LayoutDashboard,
  CalendarCheck,
  ListTodo,
  Layers,
  ShieldAlert,
  LineChart,
  Pill,
  CalendarDays,
  FilePlus,
  BadgeDollarSign,
  Sparkles,
  Sliders,
  FileText,
  ShieldCheck,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
  subItems?: { key: string; label: string; path: string }[];
  tourId?: string;
};

/** Primary analytics modules, in display order, matching the Figma frame. */
export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: Home, path: "/home" },
  { 
    key: "engagement", 
    label: "Engagement & Utilization", 
    icon: BarChart3, 
    path: "/engagement",
    tourId: "tour-step-2",
    subItems: [
      { key: "eng-overview", label: "Overview", path: "/engagement" },
      { key: "eng-active-patients", label: "Active Patients", path: "/engagement/active-patients" },
      { key: "eng-total-active-patients", label: "Total Active Patients", path: "/engagement/total-active-patients" },
      { key: "eng-after-hours-encounters", label: "After Hours Encounters", path: "/engagement/after-hours-encounters" },
      { key: "eng-total-manifest", label: "Total Active Manifest Members", path: "/engagement/total-active-manifest-members" },
      { key: "eng-touch-ratio", label: "Patient Touch Ratio", path: "/engagement/patient-touch-ratio" },
      { key: "eng-encounters", label: "Encounters", path: "/engagement/encounters" },
      { key: "eng-encounter-types", label: "Encounter Types", path: "/engagement/encounter-types-breakdown" },
      { key: "eng-care-episodes", label: "Care Episodes", path: "/engagement/care-episodes-breakdown" },
      { key: "eng-prescriptions", label: "Prescriptions", path: "/engagement/prescriptions" },
      { key: "eng-after-hours-rx", label: "After Hours Prescriptions", path: "/engagement/after-hours-prescriptions" },
      { key: "eng-rx-breakdown", label: "Prescriptions Breakdown", path: "/engagement/prescriptions-breakdown" },
      { key: "eng-digital", label: "Digital Engagement", path: "/engagement/digital-engagement" },
      { key: "eng-messages", label: "Messages", path: "/engagement/messages" },
      { key: "eng-message-types", label: "Message Types", path: "/engagement/message-types-breakdown" },
      { key: "eng-after-hours-msg", label: "After Hours Messages", path: "/engagement/after-hours-messages" },
    ]
  },
  { key: "utilization-gaps", label: "Utilization Gaps", icon: Activity, path: "/utilization-gaps", tourId: "tour-step-3" },
  { key: "cost-savings", label: "Cost Savings", icon: BadgeDollarSign, path: "/cost-savings", tourId: "tour-step-6" },
  { key: "chronic-risk", label: "Chronic Risk", icon: HeartPulse, path: "/chronic-risk", tourId: "tour-step-4" },
  { key: "claims", label: "Claims Utilization", icon: ReceiptText, path: "/claims", tourId: "tour-step-7" },
  { key: "billing", label: "Claims Billing Report", icon: Receipt, path: "/billing", tourId: "tour-step-5" },
  { key: "coordinated-care", label: "Coordinated Care", icon: Workflow, path: "/coordinated-care", tourId: "tour-step-8" },
  { key: "communication", label: "Communication", icon: MessageSquare, path: "/communication", tourId: "tour-step-9" },
  { key: "marketing", label: "Marketing", icon: Megaphone, path: "/marketing", tourId: "tour-step-10" },
  { key: "survey", label: "Survey", icon: ClipboardCheck, path: "/survey", tourId: "tour-step-11" },
];

export const HCC_NAV_ITEMS: NavItem[] = [
  { key: "hcc-overview", label: "Overview", icon: LayoutDashboard, path: "/hcc/overview" },
  { key: "hcc-patient-list", label: "Patient List", icon: Users, path: "/hcc/patient-list" },
  { key: "hcc-pre-visit-plan", label: "Pre-visit Plan", icon: CalendarCheck, path: "/hcc/pre-visit-plan" },
  { key: "hcc-coding-queue", label: "Coding Queue", icon: ListTodo, path: "/hcc/coding-queue" },
  { key: "hcc-bulk-audit", label: "Bulk Audit", icon: Layers, path: "/hcc/bulk-audit" },
];

export const ACO_NAV_ITEMS: NavItem[] = [
  { key: "aco-overview", label: "Dashboard / Overview", icon: LayoutDashboard, path: "/aco/overview" },
  { key: "aco-journey", label: "Patient-Centered Journey", icon: Users, path: "/aco/journey" },
  { key: "aco-provider-performance", label: "Provider Performance", icon: BarChart3, path: "/aco/provider-performance" },
  { key: "aco-gaps", label: "Gaps in Care Tracker", icon: ClipboardCheck, path: "/aco/gaps" },
  { key: "aco-utilization", label: "Utilization Metrics", icon: HeartPulse, path: "/aco/utilization" },
  { key: "aco-reports", label: "Reports", icon: ReceiptText, path: "/aco/reports" },
];

/** Secondary / system-level destinations shown in their own sidebar group. */
export const SYSTEM_NAV_ITEMS: NavItem[] = [
  { key: "design-system", label: "Design System", icon: Palette, path: "/design-system" },
];

export const OUTCOMES_NAV_ITEMS: NavItem[] = [
  { key: "outcomes-dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/outcomes/dashboard" },
  { key: "outcomes-patient-groups", label: "Patient Groups", icon: Users, path: "/outcomes/patient-groups" },
  { key: "outcomes-screenings", label: "Screenings Due", icon: ClipboardCheck, path: "/outcomes/screenings" },
  { key: "outcomes-vaccinations", label: "Vaccinations", icon: ShieldAlert, path: "/outcomes/vaccinations" },
  { key: "outcomes-appointments", label: "Appointments", icon: CalendarCheck, path: "/outcomes/appointments" },
  { key: "outcomes-lab-trends", label: "Lab Trends", icon: LineChart, path: "/outcomes/lab-trends" },
  { key: "outcomes-medication-refills", label: "Medication Refills", icon: Pill, path: "/outcomes/medication-refills" },
  { key: "outcomes-lab-cadence", label: "Lab Cadence", icon: CalendarDays, path: "/outcomes/lab-cadence" },
  { key: "outcomes-report-builder", label: "Report Builder", icon: FilePlus, path: "/outcomes/report-builder" },
];

export const MIPS_NAV_ITEMS: NavItem[] = [
  { key: "mips-dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/mips/dashboard" },
  { key: "mips-ai-assistant", label: "Helix Assistant", icon: Sparkles, path: "/mips/ai-assistant" },
  { key: "mips-quality-measures", label: "Quality Measures", icon: ShieldCheck, path: "/mips/quality-measures" },
  { key: "mips-cost-performance", label: "Cost Performance", icon: BadgeDollarSign, path: "/mips/cost-performance" },
  { key: "mips-interoperability", label: "Interoperability", icon: Sliders, path: "/mips/interoperability" },
  { key: "mips-improvement-activities", label: "Improvement Activities", icon: ClipboardCheck, path: "/mips/improvement-activities" },
  { key: "mips-provider-comparison", label: "Provider Comparison", icon: Users, path: "/mips/provider-comparison" },
  { key: "mips-reports", label: "Reports", icon: FileText, path: "/mips/reports" },
];

export const EMPLOYER_NAV_ITEMS: NavItem[] = [
  { key: "emp-overview", label: "Overview", icon: LayoutDashboard, path: "/employer/overview" },
  { key: "emp-enrollment", label: "Enrollment", icon: Users, path: "/employer/enrollment" },
  { key: "emp-financial", label: "Financial Performance", icon: BadgeDollarSign, path: "/employer/financial" },
  { key: "emp-chronic", label: "Chronic Conditions", icon: HeartPulse, path: "/employer/chronic" },
  { key: "emp-high-cost", label: "High-Cost Claimants", icon: ShieldAlert, path: "/employer/high-cost" },
  { key: "emp-benchmarking", label: "Risk Benchmarking", icon: LineChart, path: "/employer/benchmarking" },
];

export const SMARTYPANTS_NAV_ITEMS: NavItem[] = [
  { key: "sp-dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/smartypants/dashboard" },
  { key: "sp-crm", label: "Internal CRM", icon: Users, path: "/smartypants/crm" },
  { key: "sp-segmentation", label: "Patient Segmentation", icon: Layers, path: "/smartypants/segmentation" },
  { key: "sp-campaigns", label: "Campaign Center", icon: Megaphone, path: "/smartypants/campaigns" },
  { key: "sp-tasks", label: "Task & Reminders", icon: ListTodo, path: "/smartypants/tasks" },
  { key: "sp-communications", label: "Communications Center", icon: MessageSquare, path: "/smartypants/communications" },
  { key: "sp-leads", label: "External CRM (Leads)", icon: UserPlus, path: "/smartypants/leads" },
  { key: "sp-employer", label: "Employer Analytics", icon: BarChart3, path: "/smartypants/employer-analytics" },
  { key: "sp-automations", label: "Automation Builder", icon: Workflow, path: "/smartypants/automations" },
  { key: "sp-reports", label: "Reports & Insights", icon: FileText, path: "/smartypants/reports" },
  { key: "sp-settings", label: "Settings", icon: Sliders, path: "/smartypants/settings" },
];

