import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  FlaskConical,
  Clock,
  Star,
  Cake,
  Pill,
  AlertTriangle,
  Mail,
  MessageSquare,
  Eye,
  Reply,
  XCircle,
  Zap,
  Users,
  UserMinus,
  ShieldAlert,
  CheckCircle2,
  BarChart3,
  Activity,
  UserPlus,
  Building2,
  Handshake,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Megaphone,
  Upload,
  FileText,
  Send,
  Rocket,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  X,
  Phone,
  ArrowLeft,
  Check,
} from "../../lib/icons";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_ACTIVITIES, SP_EMPLOYERS } from "../../data/smartypantsData";

const TASK_CARDS = [
  { id: "annual", label: "Annual Exams Due", count: 342, trend: -12, trendLabel: "vs last week", icon: Calendar, color: "#e61952" },
  { id: "labs", label: "Lab Reminders Due", count: 218, trend: -8, trendLabel: "vs last week", icon: FlaskConical, color: "#dc3545" },
  { id: "checkins", label: "6 Month Check-ins", count: 156, trend: 5, trendLabel: "vs last week", icon: Clock, color: "#007bff" },
  { id: "reviews", label: "Review Requests", count: 423, trend: -18, trendLabel: "vs last week", icon: Star, color: "#ffc107" },
  { id: "birthdays", label: "Birthdays", count: 12, trend: 3, trendLabel: "vs last week", icon: Cake, color: "#e91e63" },
  { id: "meds", label: "Medication Follow-ups", count: 89, trend: -2, trendLabel: "vs last week", icon: Pill, color: "#673ab7" },
  { id: "overdue", label: "Overdue Outreach", count: 67, trend: 15, trendLabel: "vs last week", icon: AlertTriangle, color: "#dc3545" },
];

export interface TaskPatient {
  id: string;
  name: string;
  employer: string;
  condition: string;
  lastVisit: string;
  phone: string;
  email: string;
}

const TASK_PATIENTS_MAP: Record<string, TaskPatient[]> = {
  annual: [
    { id: "SP-1004", name: "Michael Thompson", employer: "Apex Technologies", condition: "Annual Exam Overdue", lastVisit: "2026-03-10", phone: "(913) 555-0334", email: "mthompson@apex.com" },
    { id: "SP-1008", name: "David Kim", employer: "Apex Technologies", condition: "Annual Exam Overdue", lastVisit: "2026-02-14", phone: "(913) 555-0789", email: "dkim@apex.com" },
    { id: "SP-1014", name: "Christopher Martinez", employer: "Pinnacle Corp", condition: "Annual Exam Overdue", lastVisit: "2026-01-05", phone: "(913) 555-1356", email: "cmartinez@pinnacle.com" },
    { id: "SP-1002", name: "James Rodriguez", employer: "Pinnacle Corp", condition: "Annual Exam Due Soon", lastVisit: "2026-05-22", phone: "(913) 555-0198", email: "j.rodriguez@pinnacle.com" },
  ],
  labs: [
    { id: "SP-1002", name: "James Rodriguez", employer: "Pinnacle Corp", condition: "HbA1c & Lipid Panel Due", lastVisit: "2026-05-22", phone: "(913) 555-0198", email: "j.rodriguez@pinnacle.com" },
    { id: "SP-1008", name: "David Kim", employer: "Apex Technologies", condition: "Comprehensive Metabolic Panel", lastVisit: "2026-02-14", phone: "(913) 555-0789", email: "dkim@apex.com" },
    { id: "SP-1012", name: "William Brown", employer: "Apex Technologies", condition: "Sleep Study & Blood Panel", lastVisit: "2026-05-10", phone: "(913) 555-1134", email: "wbrown@apex.com" },
    { id: "SP-1009", name: "Rachel Green", employer: "Horizon Medical", condition: "Thyroid TSH Screening", lastVisit: "2026-07-05", phone: "(913) 555-0891", email: "rgreen@horizon.com" },
  ],
  checkins: [
    { id: "SP-1007", name: "Amanda Wilson", employer: "Atlas Group", condition: "6-Month DPC Wellness Review", lastVisit: "2026-06-28", phone: "(913) 555-0678", email: "awilson@atlasgroup.com" },
    { id: "SP-1013", name: "Jennifer Lee", employer: "Horizon Medical", condition: "Migraine Protocol Follow-up", lastVisit: "2026-06-18", phone: "(913) 555-1245", email: "jlee@horizon.com" },
    { id: "SP-1001", name: "Sarah Mitchell", employer: "Apex Technologies", condition: "Hypertension Management Review", lastVisit: "2026-06-15", phone: "(913) 555-0142", email: "sarah.m@apex.com" },
    { id: "SP-1003", name: "Emily Chen", employer: "Atlas Group", condition: "Routine Wellness Check", lastVisit: "2026-07-01", phone: "(913) 555-0211", email: "echen@atlasgroup.com" },
  ],
  reviews: [
    { id: "SP-1001", name: "Sarah Mitchell", employer: "Apex Technologies", condition: "Annual Exam Completed — High Satisfaction", lastVisit: "2026-06-15", phone: "(913) 555-0142", email: "sarah.m@apex.com" },
    { id: "SP-1005", name: "Jessica Park", employer: "Horizon Medical", condition: "Recent Visit — 5 Star Candidate", lastVisit: "2026-07-18", phone: "(913) 555-0456", email: "jpark@horizon.com" },
    { id: "SP-1011", name: "Maria Santos", employer: "Atlas Group", condition: "New Member — Active Advocate", lastVisit: "2026-07-22", phone: "(913) 555-1023", email: "msantos@atlasgroup.com" },
    { id: "SP-1015", name: "Nicole Taylor", employer: "Atlas Group", condition: "Routine Care Complete — Review Ready", lastVisit: "2026-07-10", phone: "(913) 555-1467", email: "ntaylor@atlasgroup.com" },
  ],
  birthdays: [
    { id: "SP-1005", name: "Jessica Park", employer: "Horizon Medical", condition: "Birthday Today (Turning 30)", lastVisit: "2026-07-18", phone: "(913) 555-0456", email: "jpark@horizon.com" },
    { id: "SP-1015", name: "Nicole Taylor", employer: "Atlas Group", condition: "Birthday Tomorrow (Turning 27)", lastVisit: "2026-07-10", phone: "(913) 555-1467", email: "ntaylor@atlasgroup.com" },
    { id: "SP-1011", name: "Maria Santos", employer: "Atlas Group", condition: "Birthday This Week (Turning 32)", lastVisit: "2026-07-22", phone: "(913) 555-1023", email: "msantos@atlasgroup.com" },
  ],
  meds: [
    { id: "SP-1010", name: "Thomas Anderson", employer: "Pinnacle Corp", condition: "Atrial Fibrillation Medication Refill", lastVisit: "2026-06-01", phone: "(913) 555-0912", email: "tanderson@pinnacle.com" },
    { id: "SP-1012", name: "William Brown", employer: "Apex Technologies", condition: "Diabetes & CPAP Protocol Sync", lastVisit: "2026-05-10", phone: "(913) 555-1134", email: "wbrown@apex.com" },
    { id: "SP-1008", name: "David Kim", employer: "Apex Technologies", condition: "CKD & Antihypertensive Refill", lastVisit: "2026-02-14", phone: "(913) 555-0789", email: "dkim@apex.com" },
  ],
  overdue: [
    { id: "SP-1004", name: "Michael Thompson", employer: "Apex Technologies", condition: "Unresponsive for >90 Days", lastVisit: "2026-03-10", phone: "(913) 555-0334", email: "mthompson@apex.com" },
    { id: "SP-1008", name: "David Kim", employer: "Apex Technologies", condition: "Escalated Care Gap — 3 Bounced Reminders", lastVisit: "2026-02-14", phone: "(913) 555-0789", email: "dkim@apex.com" },
    { id: "SP-1014", name: "Christopher Martinez", employer: "Pinnacle Corp", condition: "Critical Depression & BP Follow-up Needed", lastVisit: "2026-01-05", phone: "(913) 555-1356", email: "cmartinez@pinnacle.com" },
  ]
};

const COMM_STATS = [
  { label: "Emails Sent Today", value: "128", icon: Mail, color: "#007bff" },
  { label: "Texts Sent Today", value: "47", icon: MessageSquare, color: "#28a745" },
  { label: "Open Rate", value: "64.2%", icon: Eye, color: "#17a2b8" },
  { label: "Reply Rate", value: "18.5%", icon: Reply, color: "#6f42c1" },
  { label: "Delivery Failures", value: "3", icon: XCircle, color: "#dc3545" },
  { label: "Active Campaigns", value: "5", icon: Zap, color: "#e61952" },
];

const PATIENT_FUNNEL = [
  { label: "Total Active Patients", value: "1,420", icon: Users, color: "#28a745" },
  { label: "Inactive Patients", value: "241", icon: UserMinus, color: "#6c757d" },
  { label: "At Risk Patients", value: "89", icon: ShieldAlert, color: "#dc3545" },
  { label: "Annual Exams Complete", value: "72%", icon: CheckCircle2, color: "#28a745" },
  { label: "Labs Complete", value: "68%", icon: BarChart3, color: "#007bff" },
  { label: "Engagement Score", value: "78", icon: Activity, color: "#e61952" },
];

const LEAD_FUNNEL = [
  { label: "New Community Leads", value: "34", trend: 8, icon: UserPlus, color: "#007bff" },
  { label: "Employer Leads", value: "12", trend: 2, icon: Building2, color: "#1976d2" },
  { label: "Discovery Meetings", value: "8", trend: 3, icon: Handshake, color: "#17a2b8" },
  { label: "Conversions", value: "5", trend: 1, icon: TrendingUp, color: "#28a745" },
  { label: "Lost Leads", value: "7", trend: -2, icon: TrendingDown, color: "#dc3545" },
];

const QUICK_ACTIONS = [
  { label: "Create Campaign", icon: Megaphone, route: "/smartypants/campaigns", color: "#e61952" },
  { label: "Import Patients", icon: Upload, route: "/smartypants/crm", color: "#007bff" },
  { label: "Generate Employer Report", icon: FileText, route: "/smartypants/employer-analytics", color: "#28a745" },
  { label: "Bulk Send Newsletter", icon: Send, route: "/smartypants/communications", color: "#673ab7" },
  { label: "Launch Review Campaign", icon: Rocket, route: "/smartypants/campaigns", color: "#ffc107" },
];

export function SPDashboard() {
  const navigate = useNavigate();

  // Task Workflow Modal States
  const [selectedTaskCard, setSelectedTaskCard] = useState<typeof TASK_CARDS[0] | null>(null);
  const [taskStep, setTaskStep] = useState<"queue" | "configure" | "confirm" | "success">("queue");
  const [selectedTaskPatient, setSelectedTaskPatient] = useState<TaskPatient | null>(null);
  const [outreachChannel, setOutreachChannel] = useState<"email" | "sms" | "call">("email");
  const [outreachNote, setOutreachNote] = useState<string>("");
  const [completedTaskPatientIds, setCompletedTaskPatientIds] = useState<Set<string>>(new Set());

  const handleOpenTaskQueue = (card: typeof TASK_CARDS[0]) => {
    setSelectedTaskCard(card);
    setTaskStep("queue");
    setSelectedTaskPatient(null);
    setOutreachChannel("email");
    setOutreachNote("");
  };

  const handleSelectPatientForAction = (patient: TaskPatient) => {
    setSelectedTaskPatient(patient);
    setTaskStep("configure");
    const defaultChannel = selectedTaskCard?.id === "birthdays" || selectedTaskCard?.id === "labs" ? "sms" : "email";
    setOutreachChannel(defaultChannel);
    
    let note = `Hi ${patient.name.split(" ")[0]},\n`;
    if (selectedTaskCard?.id === "annual") {
      note += `Our records show your DPC $0 copay Annual Wellness Exam is due. Let's schedule your check-in with your provider!`;
    } else if (selectedTaskCard?.id === "labs") {
      note += `Reminder: Your ordered lab work (${patient.condition}) is outstanding. Please reply to schedule your lab visit.`;
    } else if (selectedTaskCard?.id === "checkins") {
      note += `It's time for your 6-Month Wellness Check-in! Please reply to confirm your appointment window.`;
    } else if (selectedTaskCard?.id === "reviews") {
      note += `Thank you for being a valued member of SmartyPants Medicine! Would you mind sharing a quick 5-star review on Google?`;
    } else if (selectedTaskCard?.id === "birthdays") {
      note += `Happy Birthday from all of us at SmartyPants Medicine! Wishing you a healthy and wonderful year ahead! 🎉`;
    } else if (selectedTaskCard?.id === "meds") {
      note += `Care Team Sync: Following up regarding your medication plan (${patient.condition}). Let us know if you need refills or adjustments!`;
    } else {
      note += `Important Care Notice: We've tried reaching you regarding your care plan. Please call our clinic at your earliest convenience.`;
    }
    setOutreachNote(note);
  };

  const handleConfirmTaskAction = () => {
    if (!selectedTaskPatient) return;
    setCompletedTaskPatientIds((prev) => new Set(prev).add(`${selectedTaskCard?.id}-${selectedTaskPatient.id}`));
    setTaskStep("success");
    toast.success(`Action Executed for ${selectedTaskPatient.name}`, {
      description: `Dispatched via ${outreachChannel.toUpperCase()}. Logged to AtlasMD EHR.`,
    });
  };

  return (
    <ClassicLayout
      title="Care Operations Hub"
      subtitleNote="Executive dashboard — everything requiring attention today at a glance."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Practice", val: "SmartyPants Medicine" },
        { label: "Date", val: "July 28, 2026" },
        { label: "Provider", val: "All Providers" },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Generating daily operations report...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs transition-colors"
          >
            <FileText className="size-3.5 text-[#6c757d]" />
            <span>Daily Report</span>
          </button>
        </div>
      }
    >
      {/* ── Today's Patient Tasks ── */}
      <div>
        <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide mb-3">Today's Patient Tasks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {TASK_CARDS.map((card) => {
            const Icon = card.icon;
            const isNeg = card.trend < 0;
            return (
              <div
                key={card.id}
                onClick={() => handleOpenTaskCard(card)}
                className="bg-white rounded border border-[#dee2e6] shadow-2xs p-3 cursor-pointer hover:border-[#e61952] transition-all group flex flex-col gap-2 select-none"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-4" style={{ color: card.color }} />
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-bold ${
                      isNeg ? "bg-[#d4edda] text-[#155724]" : "bg-[#f8d7da] text-[#721c24]"
                    }`}
                  >
                    {isNeg ? <ArrowDown className="size-2.5" /> : <ArrowUp className="size-2.5" />}
                    {Math.abs(card.trend)}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#212529] tabular-nums">{card.count}</div>
                <div className="text-[10px] text-[#6c757d] font-medium leading-tight">{card.label}</div>
                <button className="mt-auto text-[10px] font-bold text-[#e61952] group-hover:underline flex items-center gap-0.5">
                  Take Action <ArrowRight className="size-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Task Card Interactive Completed Workflow Modal ── */}
      {selectedTaskCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#dee2e6] max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#f8f9fa] border-b border-[#dee2e6] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full flex items-center justify-center shadow-2xs" style={{ backgroundColor: selectedTaskCard.color + "20" }}>
                  {React.createElement(selectedTaskCard.icon, { className: "size-5", style: { color: selectedTaskCard.color } })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#212529]">{selectedTaskCard.label} Workflow</h3>
                    <span className="bg-[#e61952] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {taskStep === "queue" ? "Step 1: Patient Queue" : taskStep === "configure" ? "Step 2: Configure Outreach" : taskStep === "confirm" ? "Step 3: Review & Dispatch" : "Completed ✓"}
                    </span>
                  </div>
                  <p className="text-xs text-[#6c757d]">
                    {selectedTaskCard.count} total items requiring action in this operational bucket
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTaskCard(null)}
                className="p-1 rounded text-[#6c757d] hover:text-[#212529] hover:bg-[#e9ecef] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-[#495057]">
              {/* STEP 1: QUEUE SELECTION */}
              {taskStep === "queue" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
                    <span className="font-semibold text-[#212529]">Select a patient below to execute outreach or clear the task:</span>
                    <span className="text-[11px] text-[#6c757d]">Active Queue: {TASK_PATIENTS_MAP[selectedTaskCard.id]?.length || 0} patients</span>
                  </div>

                  <div className="border border-[#dee2e6] rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                          <th className="py-2.5 px-3">Patient ID</th>
                          <th className="py-2.5 px-3">Patient Name</th>
                          <th className="py-2.5 px-3">Employer</th>
                          <th className="py-2.5 px-3">Status / Detail</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
                        {(TASK_PATIENTS_MAP[selectedTaskCard.id] || []).map((row) => {
                          const isDone = completedTaskPatientIds.has(`${selectedTaskCard.id}-${row.id}`);
                          return (
                            <tr key={row.id} className={`hover:bg-[#f8f9fa] transition-colors ${isDone ? "bg-[#d4edda]/30" : ""}`}>
                              <td className="py-2.5 px-3 font-mono font-medium text-[#007bff]">{row.id}</td>
                              <td className="py-2.5 px-3 font-bold">{row.name}</td>
                              <td className="py-2.5 px-3 text-[#495057]">{row.employer}</td>
                              <td className="py-2.5 px-3 font-medium text-[#e61952]">{row.condition}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => handleSelectPatientForAction(row)}
                                  disabled={isDone}
                                  className={`px-3 py-1 rounded text-xs font-bold transition-all shadow-2xs ${
                                    isDone
                                      ? "bg-[#d4edda] text-[#155724] border border-[#c3e6cb] cursor-default"
                                      : "bg-[#e61952] hover:bg-[#c41344] text-white flex items-center gap-1 ml-auto cursor-pointer"
                                  }`}
                                >
                                  <span>{isDone ? "Completed ✓" : "Execute Action"}</span>
                                  {!isDone && <ArrowRight className="size-3" />}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STEP 2: CONFIGURE OUTREACH */}
              {taskStep === "configure" && selectedTaskPatient && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6] flex items-center justify-between">
                    <div>
                      <span className="text-[#6c757d] block text-[10px] uppercase font-bold">Target Patient</span>
                      <span className="font-extrabold text-[#212529] text-sm">{selectedTaskPatient.name} ({selectedTaskPatient.id})</span>
                    </div>
                    <span className="text-xs bg-[#e3f2fd] text-[#0d47a1] font-bold px-2.5 py-1 rounded">
                      {selectedTaskPatient.condition}
                    </span>
                  </div>

                  {/* Channel Choice */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#6c757d] tracking-wide mb-2">
                      Select Communication Channel
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "email" as const, label: "Secure Email", icon: Mail, detail: selectedTaskPatient.email },
                        { id: "sms" as const, label: "Direct SMS Text", icon: MessageSquare, detail: selectedTaskPatient.phone },
                        { id: "call" as const, label: "Phone Call Log", icon: Phone, detail: selectedTaskPatient.phone },
                      ].map((ch) => {
                        const Icon = ch.icon;
                        const isSelected = outreachChannel === ch.id;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => setOutreachChannel(ch.id)}
                            className={`p-3 rounded border text-left flex flex-col gap-1.5 transition-all text-xs font-semibold ${
                              isSelected
                                ? "border-[#e61952] bg-[#fff0f4] text-[#212529] ring-1 ring-[#e61952]/30 shadow-2xs cursor-pointer"
                                : "border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <Icon className={`size-4 ${isSelected ? "text-[#e61952]" : "text-[#6c757d]"}`} />
                              {isSelected && <span className="size-2 rounded-full bg-[#e61952]" />}
                            </div>
                            <span className="font-bold">{ch.label}</span>
                            <span className="text-[10px] text-[#6c757d] font-mono truncate">{ch.detail}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Script / Note */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#6c757d] tracking-wide mb-1.5">
                      Outreach Script / EHR Note Draft
                    </label>
                    <textarea
                      rows={4}
                      value={outreachNote}
                      onChange={(e) => setOutreachNote(e.target.value)}
                      className="w-full text-xs text-[#212529] p-3 rounded border border-[#dee2e6] bg-[#fdfdfd] focus:outline-none focus:border-[#e61952] font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIRM & REVIEW */}
              {taskStep === "confirm" && selectedTaskPatient && (
                <div className="bg-[#fff8f0] border-2 border-[#fd7e14] rounded p-4 space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="flex items-center gap-2 text-[#d96b0c] font-bold text-xs border-b border-[#fd7e14]/30 pb-2">
                    <ShieldAlert className="size-4" />
                    <span>Final Execution Confirmation</span>
                  </div>

                  <div className="bg-white rounded border border-[#fd7e14]/40 p-3 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#f0f0f0] pb-1.5">
                      <span className="text-[#6c757d] font-semibold">Patient:</span>
                      <span className="font-bold text-[#212529]">{selectedTaskPatient.name} ({selectedTaskPatient.id})</span>
                    </div>
                    <div className="flex justify-between border-b border-[#f0f0f0] pb-1.5">
                      <span className="text-[#6c757d] font-semibold">Channel & Task:</span>
                      <span className="font-bold text-[#e61952]">{selectedTaskCard.label} via {outreachChannel.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[#6c757d] font-semibold block mb-1">Logged Note Preview:</span>
                      <div className="bg-[#f8f9fa] p-2 rounded text-[11px] font-mono text-[#343a40] border border-[#dee2e6]">
                        {outreachNote}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#8a531b] font-medium leading-normal flex items-start gap-1.5">
                    <span>ℹ️</span>
                    <span>Clicking confirm will send out the communication via {outreachChannel.toUpperCase()}, sync task completion to AtlasMD EHR, and update your daily operational metrics.</span>
                  </p>
                </div>
              )}

              {/* STEP 4: SUCCESS STATE */}
              {taskStep === "success" && selectedTaskPatient && (
                <div className="bg-[#d4edda] border-2 border-[#28a745] rounded p-5 text-[#155724] space-y-3 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 font-extrabold text-base">
                    <Check className="size-6 text-[#28a745] bg-white rounded-full p-1 shadow-2xs" />
                    <span>Task Workflow Successfully Completed!</span>
                  </div>
                  <p className="text-xs leading-relaxed bg-white/90 p-3 rounded border border-[#c3e6cb] text-[#212529] font-medium">
                    Outreach for <strong>{selectedTaskPatient.name}</strong> was dispatched via <strong>{outreachChannel.toUpperCase()}</strong>. Practice task logged to EHR timestamp.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-6 py-3.5 flex items-center justify-between">
              {taskStep === "queue" && (
                <button
                  onClick={() => setSelectedTaskCard(null)}
                  className="px-4 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors"
                >
                  Close Queue
                </button>
              )}

              {taskStep === "configure" && (
                <>
                  <button
                    onClick={() => setTaskStep("queue")}
                    className="px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="size-3.5" /> Back to Queue
                  </button>
                  <button
                    onClick={() => setTaskStep("confirm")}
                    className="px-4 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Proceed to Review →</span>
                  </button>
                </>
              )}

              {taskStep === "confirm" && (
                <>
                  <button
                    onClick={() => setTaskStep("configure")}
                    className="px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="size-3.5" /> Back to Edit
                  </button>
                  <button
                    onClick={handleConfirmTaskAction}
                    className="px-4 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer animate-pulse"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Confirm & Dispatch Action</span>
                  </button>
                </>
              )}

              {taskStep === "success" && (
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setTaskStep("queue")}
                    className="px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors"
                  >
                    Process Another Patient
                  </button>
                  <button
                    onClick={() => setSelectedTaskCard(null)}
                    className="px-4 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white font-bold text-xs transition-colors"
                  >
                    Done & Exit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Communication Activity + Patient Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Communication Activity */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4">
          <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
            Communication Activity
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COMM_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-2.5 p-2 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                  <div className="size-8 rounded flex items-center justify-center" style={{ backgroundColor: stat.color + "15" }}>
                    <Icon className="size-4" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#212529] tabular-nums">{stat.value}</div>
                    <div className="text-[10px] text-[#6c757d] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient Funnel */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4">
          <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
            Patient Funnel
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PATIENT_FUNNEL.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-2.5 p-2 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                  <div className="size-8 rounded flex items-center justify-center" style={{ backgroundColor: stat.color + "15" }}>
                    <Icon className="size-4" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#212529] tabular-nums">{stat.value}</div>
                    <div className="text-[10px] text-[#6c757d] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Lead Funnel ── */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4">
        <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
          Lead Funnel
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {LEAD_FUNNEL.map((item) => {
            const Icon = item.icon;
            const isPos = item.trend > 0;
            return (
              <div key={item.label} className="flex items-center gap-2.5 p-3 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                <div className="size-9 rounded flex items-center justify-center" style={{ backgroundColor: item.color + "15" }}>
                  <Icon className="size-4.5" style={{ color: item.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-extrabold text-[#212529] tabular-nums">{item.value}</span>
                    <span className={`text-[10px] font-bold ${isPos ? "text-[#28a745]" : "text-[#dc3545]"}`}>
                      {isPos ? "+" : ""}{item.trend}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6c757d] font-medium">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Employer Snapshot ── */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">Employer Snapshot</h2>
          <button
            onClick={() => navigate("/smartypants/employer-analytics")}
            className="text-[11px] font-bold text-[#e61952] hover:underline flex items-center gap-1"
          >
            View All <ExternalLink className="size-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-xs font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3">Employer</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Engagement %</th>
                <th className="py-2.5 px-3">Cost PMPM</th>
                <th className="py-2.5 px-3">ROI</th>
                <th className="py-2.5 px-3">Review Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {SP_EMPLOYERS.map((emp) => (
                <tr key={emp.name} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-2.5 px-3 font-bold">{emp.name}</td>
                  <td className="py-2.5 px-3 tabular-nums">{emp.members}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#e9ecef] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#28a745]" style={{ width: `${emp.engagement}%` }} />
                      </div>
                      <span className="font-semibold tabular-nums">{emp.engagement}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold tabular-nums">${emp.costPMPM}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4edda] text-[#155724]">{emp.roi}x</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#6c757d] font-mono text-[11px]">{emp.reviewDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Activity Feed + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white border border-[#dee2e6] rounded shadow-2xs p-4">
          <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
            Recent Activity Feed
          </h2>
          <div className="flex flex-col divide-y divide-[#dee2e6]">
            {SP_ACTIVITIES.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start gap-3 first:pt-0 last:pb-0">
                <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${
                  act.type === "clinical" ? "bg-[#d4edda] text-[#155724]" :
                  act.type === "communication" ? "bg-[#cce5ff] text-[#004085]" :
                  act.type === "campaign" ? "bg-[#e8daef] text-[#6f42c1]" :
                  act.type === "employer" ? "bg-[#fff3cd] text-[#856404]" :
                  "bg-[#f8f9fa] text-[#495057]"
                }`}>
                  {act.type === "clinical" && <CheckCircle className="size-3.5" />}
                  {act.type === "communication" && <Mail className="size-3.5" />}
                  {act.type === "campaign" && <Megaphone className="size-3.5" />}
                  {act.type === "employer" && <Building2 className="size-3.5" />}
                  {act.type === "system" && <Zap className="size-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#212529] font-medium">{act.text}</p>
                  <p className="text-[10px] text-[#6c757d] mt-0.5">{act.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4">
          <h2 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.route)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded border border-[#dee2e6] bg-[#f8f9fa] hover:bg-white hover:border-[#e61952]/40 transition-all text-left group"
                >
                  <div className="size-8 rounded flex items-center justify-center" style={{ backgroundColor: action.color + "15" }}>
                    <Icon className="size-4" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-semibold text-[#343a40] group-hover:text-[#e61952] transition-colors">{action.label}</span>
                  <ArrowRight className="size-3.5 ml-auto text-[#6c757d] group-hover:text-[#e61952] transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ClassicLayout>
  );
}

