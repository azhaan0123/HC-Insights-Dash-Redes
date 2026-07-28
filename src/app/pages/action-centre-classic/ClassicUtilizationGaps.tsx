import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Info,
  Download,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Building2,
  Stethoscope,
  X,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  MessageSquareOff,
  ShieldAlert,
  Activity,
  ArrowRight,
  ArrowLeft,
  Mail,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { ClassicLayout } from "./ClassicLayout";
import {
  ACTION_CENTRE_PATIENTS,
  COHORT_SUMMARIES,
  type ActionCentrePatientRow,
  type CohortType,
  type TouchpointEvent,
} from "../../data/actionCentreData";

const DIAGNOSIS_MAP: Record<string, string> = {
  "E78.5": "Hyperlipidemia, unspecified",
  "I10": "Essential (primary) hypertension",
  "E11.9": "Type 2 diabetes mellitus without complications",
  "E78.2": "Mixed hyperlipidemia",
  "J45.909": "Unspecified asthma, uncomplicated",
  "M54.5": "Low back pain",
  "E66.01": "Morbid (severe) obesity due to excess calories",
  "F41.1": "Generalized anxiety disorder",
  "J44.9": "Chronic obstructive pulmonary disease, unspecified",
  "K21.9": "Gastro-esophageal reflux disease without esophagitis",
  "E03.9": "Hypothyroidism, unspecified",
  "M19.90": "Unspecified osteoarthritis, unspecified site",
  "G43.909": "Migraine, unspecified, not intractable",
  "N18.3": "Chronic kidney disease, stage 3 (moderate)",
  "—": "No diagnosis provided",
};

const getDiagnosisDesc = (code: string) => DIAGNOSIS_MAP[code] || "General primary care screening / follow-up";

const getMetricGraphData = (count: number, view: "WoW" | "MoM", isPositive: boolean) => {
  if (view === "WoW") {
    const factor = isPositive ? 0.85 : 1.15;
    return [
      { period: "Wk 1", value: Math.max(1, Math.round(count * factor * 0.9)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 2", value: Math.max(1, Math.round(count * factor * 0.93)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 3", value: Math.max(1, Math.round(count * factor * 0.96)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 4", value: Math.max(1, Math.round(count * factor * 0.98)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 5", value: Math.max(1, Math.round(count * factor * 1.0)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 6", value: Math.max(1, Math.round(count * 0.96)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 7", value: Math.max(1, Math.round(count * 0.93)), benchmark: Math.round(count * 0.95) },
      { period: "Current Wk", value: count, benchmark: Math.round(count * 0.95) },
    ];
  } else {
    const factor = isPositive ? 0.75 : 1.25;
    return [
      { period: "Feb", value: Math.max(1, Math.round(count * factor * 0.85)), benchmark: Math.round(count * 0.9) },
      { period: "Mar", value: Math.max(1, Math.round(count * factor * 0.9)), benchmark: Math.round(count * 0.9) },
      { period: "Apr", value: Math.max(1, Math.round(count * factor * 0.95)), benchmark: Math.round(count * 0.9) },
      { period: "May", value: Math.max(1, Math.round(count * 0.92)), benchmark: Math.round(count * 0.9) },
      { period: "Jun", value: Math.max(1, Math.round(count * 0.95)), benchmark: Math.round(count * 0.9) },
      { period: "Jul (Current)", value: count, benchmark: Math.round(count * 0.9) },
    ];
  }
};

const getCohortIcon = (id: string) => {
  switch (id) {
    case "new-activation":
      return <UserPlus className="size-4 shrink-0 text-[#6c757d]" />;
    case "engagement-gap":
      return <Clock className="size-4 shrink-0 text-[#6c757d]" />;
    case "low-response":
      return <MessageSquareOff className="size-4 shrink-0 text-[#6c757d]" />;
    case "external-leakage":
      return <ShieldAlert className="size-4 shrink-0 text-[#6c757d]" />;
    default:
      return <Activity className="size-4 shrink-0 text-[#6c757d]" />;
  }
};

export function ClassicUtilizationGaps() {
  const navigate = useNavigate();

  // Cohort & Filter States
  const [activeCohort, setActiveCohort] = useState<CohortType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("longest-inactive");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState("");

  // Action / Completion States
  const [completedPatientIds, setCompletedPatientIds] = useState<Set<string>>(new Set());
  const [activePatientDrawer, setActivePatientDrawer] = useState<ActionCentrePatientRow | null>(null);

  // 2-Step Action Workflow State for Patient Detail Sidebar
  const [actionStep, setActionStep] = useState<"overview" | "step1" | "step2" | "success">("overview");
  const [selectedChannel, setSelectedChannel] = useState<"call" | "email" | "sms">("call");
  const [outreachError, setOutreachError] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState<string>("");
  const [assignedStaff, setAssignedStaff] = useState<string>("Sarah Jenkins, RN (Care Coordinator)");

  // Metric Overlay Modal State
  const [selectedMetricOverlay, setSelectedMetricOverlay] = useState<any | null>(null);
  const [metricGraphView, setMetricGraphView] = useState<"WoW" | "MoM">("WoW");

  // Lock body scroll when patient detail sidebar is open
  useEffect(() => {
    if (activePatientDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePatientDrawer]);

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    let list = ACTION_CENTRE_PATIENTS.filter((p) => p.cohort !== "external-leakage");

    if (activeCohort !== "all") {
      list = list.filter((p) => p.cohort === activeCohort);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reason.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q) ||
          p.physician.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.id.includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "longest-inactive") {
        return (b.lastVisitDaysAgo || 999) - (a.lastVisitDaysAgo || 999);
      }
      if (sortBy === "last-visit") {
        return (a.lastVisitDaysAgo || 0) - (b.lastVisitDaysAgo || 0);
      }
      if (sortBy === "newest") {
        return (a.lastVisitDaysAgo === null ? 0 : 1) - (b.lastVisitDaysAgo === null ? 0 : 1);
      }
      return 0;
    });

    return list;
  }, [activeCohort, searchQuery, sortBy]);

  const totalRecords = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));

  // Current page slice
  const currentRows = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredPatients.slice(startIndex, startIndex + recordsPerPage).map((row, idx) => {
      const isPhoneAvail = Boolean(row.contactPhone && row.contactPhone !== "Unavailable" && row.contactPhone.replace(/\D/g, "") !== "");
      const cleanPhone = isPhoneAvail ? row.contactPhone.replace(/\D/g, "").slice(0, 10) : "Unavailable";
      const monthStr = ((idx % 2) + 1).toString().padStart(2, "0");
      const dayStr = ((idx * 3 + 12) % 28 + 1).toString().padStart(2, "0");
      const hourStr = ((idx * 2 + 2) % 12 + 1).toString().padStart(2, "0");
      const minStr = ((idx * 7 + 15) % 60).toString().padStart(2, "0");
      const encounterDateTime = `${monthStr}-${dayStr}-2026 ${hourStr}:${minStr} PST`;
      
      return {
        ...row,
        formattedPhone: cleanPhone,
        encounterDateTime,
      };
    });
  }, [currentPage, recordsPerPage, filteredPatients]);

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpToPage("");
    } else {
      toast.error(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  const handleActionExecution = (patient: ActionCentrePatientRow, actionType: string) => {
    toast.success(`Action Executed: ${actionType}`, {
      description: `Logged for ${patient.name} (${patient.id}). Task queued in practice EHR.`,
    });
    setCompletedPatientIds((prev) => new Set(prev).add(patient.id));
    setActivePatientDrawer(null);
  };

  const openDrawerWithStep = (
    patient: ActionCentrePatientRow,
    step: "overview" | "step1" | "step2" | "success" = "overview",
    channel?: "call" | "email" | "sms"
  ) => {
    setActivePatientDrawer(patient);
    setActionStep(step);
    setOutreachError(null);

    const isPhoneAvail = Boolean(patient.contactPhone && patient.contactPhone !== "Unavailable" && patient.contactPhone.replace(/\D/g, "") !== "");
    const isEmailAvail = Boolean(patient.contactEmail && patient.contactEmail !== "Unavailable" && patient.contactEmail.trim() !== "");

    let chosenChannel: "call" | "email" | "sms" = channel || (patient.suggestedActionType === "sms" ? "sms" : patient.suggestedActionType === "email" ? "email" : "call");
    if ((chosenChannel === "call" || chosenChannel === "sms") && !isPhoneAvail) {
      if (isEmailAvail) {
        chosenChannel = "email";
      } else {
        setOutreachError("phone number is unavailable please use other method for outreach");
      }
    } else if (chosenChannel === "email" && !isEmailAvail) {
      if (isPhoneAvail) {
        chosenChannel = "sms";
      } else {
        setOutreachError("email is unavailable please use other method for outreach");
      }
    }

    setSelectedChannel(chosenChannel);
    if (chosenChannel === "call") {
      setActionNote(`Phone Outreach for ${patient.name}: Review ${patient.condition} gap status and explain DPC $0 copay visits & lab work with ${patient.physician}.`);
    } else if (chosenChannel === "email") {
      setActionNote(`Subject: Care Coordination & DPC Check-in\n\nDear ${patient.name},\nWe noticed an open care gap regarding your ${patient.condition} care plan...`);
    } else {
      setActionNote(`SMS Outreach to ${patient.name}: Hi ${patient.name.split(" ")[0]}, your DPC care team noticed an open care gap for ${patient.condition}. Please reply to schedule your $0 copay check-in or lab work.`);
    }
  };

  const handleConfirmTwoStepAction = () => {
    if (!activePatientDrawer) return;

    const newTouchpoint: TouchpointEvent = {
      id: `ev-${Date.now()}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      type: selectedChannel === "call" ? "Call" : selectedChannel === "email" ? "Email" : "SMS",
      description: `Executed 2-Step Action: ${activePatientDrawer.suggestedAction} (${selectedChannel.toUpperCase()}) — Note: ${actionNote.slice(0, 100)}...`,
      outcome: "Initiated & Queued in EHR",
    };

    const updatedPatient = {
      ...activePatientDrawer,
      engagementHistory: [newTouchpoint, ...activePatientDrawer.engagementHistory],
    };

    setActivePatientDrawer(updatedPatient);
    setCompletedPatientIds((prev) => new Set(prev).add(activePatientDrawer.id));
    setActionStep("success");

    toast.success(`Outreach Action Executed for ${activePatientDrawer.name}`, {
      description: `Logged via ${selectedChannel.toUpperCase()} (${assignedStaff}). Touchpoint recorded in EHR.`,
    });
  };

  // Clean Header Actions matching legacy action centre simplicity
  const headerActionsNode = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => toast.info("Exporting utilization gap data to CSV...")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs transition-colors"
        title="Export Data"
      >
        <Download className="size-3.5 text-[#6c757d]" />
        <span>Export</span>
      </button>

      <button
        onClick={() => toast.success("Generating Utilization Gap Beta Report...", { description: "You will receive an email when the report is ready." })}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs relative transition-colors"
      >
        <Download className="size-3.5 text-[#6c757d]" />
        <span>Generate Report</span>
        <span className="absolute -bottom-2 -right-1 bg-[#28a745] text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-wider shadow-2xs">
          BETA
        </span>
      </button>
    </div>
  );

  return (
    <ClassicLayout
      title="Utilization Gaps"
      subtitleNote="Note: Click a card or tab to filter the actionable queue. Click Patient ID to view full clinical details and execute outreach."
      modernRoute="/utilization-gaps"
      activeNavIndex={1}
      headerActions={headerActionsNode}
    >
      {/* 1. OPERATIONAL SUMMARY CARDS (Clean Legacy Design exactly like Action Centre Classic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {COHORT_SUMMARIES.filter((c) => c.id !== "external-leakage").map((card) => {
          const isSelected = activeCohort === card.id;
          const displayCount = card.id === "all" ? 98 : card.count;
          return (
            <div
              key={card.id}
              onClick={() => {
                setActiveCohort(card.id as any);
                setCurrentPage(1);
              }}
              className={`bg-white rounded p-4 flex flex-col justify-between min-h-[135px] transition-all cursor-pointer select-none border ${
                isSelected
                  ? "border-2 border-[#e61952] shadow-sm bg-[#fff0f4]/20"
                  : "border border-[#dee2e6] shadow-2xs hover:border-[#e61952]/50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-[#343a40] leading-tight uppercase tracking-wide">
                    {card.title}
                  </span>
                  {getCohortIcon(card.id)}
                </div>

                <div className="flex items-baseline gap-2 mt-2.5">
                  <span className="text-2xl font-extrabold tracking-tight tabular-nums text-[#212529]">
                    {displayCount}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      card.wowPositive ? "bg-[#d4edda] text-[#155724]" : "bg-[#f8d7da] text-[#721c24]"
                    }`}
                  >
                    {card.wowPositive ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
                    <span>{card.wowChange}</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#dee2e6] text-[11px]">
                <span className="text-[#6c757d] truncate max-w-[90px]" title={card.description}>
                  {card.id === "all" ? "All Attention" : "Engagement"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMetricOverlay(card);
                    setMetricGraphView("WoW");
                  }}
                  className="font-bold text-[#e61952] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. CLEAN TABS & QUEUE CONTROLS (Exactly like legacy Action Centre - un-crowded!) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Left Side: Clean Queue Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all" as const, label: "All Actionable Queue" },
            { id: "new-activation" as const, label: "New Activation" },
            { id: "engagement-gap" as const, label: "Engagement Gap" },
            { id: "low-response" as const, label: "Low Response" },
          ].map((tab) => {
            const isSelected = activeCohort === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCohort(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded text-xs transition-all cursor-pointer select-none ${
                  isSelected
                    ? "border-2 border-[#e61952] bg-[#fff0f4] text-[#212529] font-bold shadow-2xs"
                    : "border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] font-medium"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
            <input
              type="text"
              placeholder="Search patient, ID, employer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1 rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952] w-60"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold text-[#212529] focus:outline-none focus:border-[#e61952]"
          >
            <option value="longest-inactive">Sort: Longest Inactive</option>
            <option value="last-visit">Sort: Recent Visit First</option>
            <option value="newest">Sort: Newest Member</option>
          </select>
        </div>
      </div>

      {/* 3. CLEAN LEGACY TABLE SECTION */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden flex flex-col mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-xs font-semibold border-b border-[#dee2e6]">
                <th className="py-3 px-3">Patient ID</th>
                <th className="py-3 px-3">Patient Member</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Diagnosis</th>
                <th className="py-3 px-3">Last Encounter</th>
                <th className="py-3 px-3">Employer</th>
                <th className="py-3 px-3 text-right">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#6c757d]">
                    No utilization gap records found in this queue.
                  </td>
                </tr>
              ) : (
                currentRows.map((row) => {
                  const isDone = completedPatientIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#f8f9fa] transition-colors ${isDone ? "bg-[#d4edda]/30" : ""}`}
                    >
                      {/* Patient ID (Blue Link) */}
                      <td className="py-3 px-3 font-medium">
                        <span
                          onClick={() => openDrawerWithStep(row, "overview")}
                          className="text-[#007bff] hover:underline cursor-pointer flex items-center gap-1 font-mono"
                        >
                          <span>{row.id}</span>
                          {isDone && (
                            <span className="text-[#28a745]" title="Action Completed">
                              ✓
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Patient Member Name */}
                      <td className="py-3 px-3 font-bold text-[#212529]">
                        <div className="flex items-center gap-1.5">
                          <span>{row.name}</span>
                          {isDone && (
                            <span className="bg-[#28a745] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                              Done
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3 text-[#495057]">
                        {row.age} Yrs ({row.gender})
                      </td>

                      {/* Diagnosis (code only, description on hover) */}
                      <td className="py-3 px-3">
                        <span
                          className="font-semibold text-[#212529] cursor-help underline decoration-dotted underline-offset-4"
                          title={getDiagnosisDesc(row.condition)}
                        >
                          {row.condition || "Preventive"}
                        </span>
                      </td>

                      {/* Last Encounter */}
                      <td className="py-3 px-3 text-[#6c757d] font-mono text-[11px]">
                        {row.encounterDateTime}
                      </td>

                      {/* Employer */}
                      <td className="py-3 px-3 font-medium text-[#343a40]">
                        {row.employer}
                      </td>

                      {/* Suggested Action Button -> Opens 2-Step Sidebar directly into Step 1 */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => openDrawerWithStep(row, "step1")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all shadow-2xs ${
                            isDone
                              ? "bg-[#d4edda] text-[#155724] border border-[#c3e6cb]"
                              : "bg-[#fff0f4] text-[#e61952] border border-[#ffccd8] hover:bg-[#e61952] hover:text-white flex items-center gap-1 ml-auto"
                          }`}
                        >
                          <span>{isDone ? "Completed ✓" : row.suggestedAction}</span>
                          {!isDone && <ArrowRight className="size-3" />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Legacy Pagination Footer */}
        <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#495057]">
          <div>
            Showing <span className="font-semibold">{totalRecords === 0 ? 0 : ((currentPage - 1) * recordsPerPage) + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * recordsPerPage, totalRecords)}</span> of{" "}
            <span className="font-semibold">{totalRecords.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Records per page select */}
            <div className="flex items-center gap-1.5">
              <span>Records per page:</span>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(parseInt(e.target.value, 10));
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#dee2e6] rounded px-2 py-1 text-[#212529] font-medium focus:outline-none focus:border-[#e61952]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#e9ecef] disabled:opacity-40 disabled:pointer-events-none"
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let pNum: number;
                if (totalPages <= 5) {
                  pNum = idx + 1;
                } else if (currentPage <= 3) {
                  pNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pNum = totalPages - 4 + idx;
                } else {
                  pNum = currentPage - 2 + idx;
                }

                return (
                  <button
                    key={pNum}
                    onClick={() => setCurrentPage(pNum)}
                    className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                      currentPage === pNum
                        ? "bg-[#e61952] border-[#e61952] text-white font-bold"
                        : "bg-white border-[#dee2e6] text-[#495057] hover:bg-[#e9ecef]"
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#e9ecef] disabled:opacity-40 disabled:pointer-events-none"
              >
                &gt;
              </button>
            </div>

            {/* Jump to Page Form */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-1.5">
              <span>Page</span>
              <input
                type="text"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder={currentPage.toString()}
                className="w-12 px-1.5 py-1 text-center bg-white border border-[#dee2e6] rounded text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-[#e9ecef] hover:bg-[#dee2e6] text-[#495057] font-semibold rounded border border-[#dee2e6] transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. METRIC OVERLAY GRAPH MODAL */}
      {selectedMetricOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#dee2e6] max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#f8f9fa] border-b border-[#dee2e6] px-5 py-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#e61952] uppercase tracking-wider bg-[#fff0f4] px-2 py-0.5 rounded border border-[#ffccd8]">
                  Metric Trend Analysis
                </span>
                <h3 className="text-base font-bold text-[#212529] mt-1">
                  {selectedMetricOverlay.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMetricOverlay(null)}
                className="p-1 rounded text-[#6c757d] hover:text-[#212529] hover:bg-[#e9ecef] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-[#495057]">
              <div className="flex items-center justify-between bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
                <div>
                  <span className="text-[#6c757d]">Current Cohort Count:</span>
                  <span className="text-xl font-extrabold text-[#212529] ml-2">
                    {selectedMetricOverlay.count}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-[#dee2e6] rounded p-0.5">
                  <button
                    onClick={() => setMetricGraphView("WoW")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      metricGraphView === "WoW"
                        ? "bg-[#e61952] text-white"
                        : "text-[#6c757d] hover:text-[#212529]"
                    }`}
                  >
                    WoW Trend
                  </button>
                  <button
                    onClick={() => setMetricGraphView("MoM")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      metricGraphView === "MoM"
                        ? "bg-[#e61952] text-white"
                        : "text-[#6c757d] hover:text-[#212529]"
                    }`}
                  >
                    MoM Trend
                  </button>
                </div>
              </div>

              <div className="h-64 w-full bg-white border border-[#dee2e6] rounded p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getMetricGraphData(
                      selectedMetricOverlay.count,
                      metricGraphView,
                      selectedMetricOverlay.wowPositive
                    )}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="legacyColorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e61952" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e61952" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                    <XAxis dataKey="period" stroke="#6c757d" fontSize={11} />
                    <YAxis stroke="#6c757d" fontSize={11} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#fff", borderColor: "#dee2e6", fontSize: "11px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#e61952"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#legacyColorVal)"
                      name="Active Queue"
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#6c757d"
                      strokeDasharray="4 4"
                      fill="none"
                      name="Benchmark"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#e2e3e5] border border-[#d6d8db] p-3 rounded text-[#383d41]">
                <span className="font-bold">Operational Context:</span> {selectedMetricOverlay.description}
              </div>
            </div>

            <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-5 py-3 flex justify-end">
              <button
                onClick={() => setSelectedMetricOverlay(null)}
                className="px-4 py-1.5 bg-white border border-[#dee2e6] hover:bg-[#e9ecef] text-[#495057] font-semibold rounded text-xs transition-colors"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ENHANCED LEGACY PATIENT DETAIL DRAWER (With Claims & Encounters Tabs) */}
      {activePatientDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-[#dee2e6] flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Drawer Header — stacked for clearer hierarchy */}
            <div>
              <div className="bg-[#f8f9fa] border-b border-[#dee2e6] px-6 py-5 flex items-start justify-between">
                <div className="space-y-1.5">
                  {/* Row 1: patient name */}
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-[#212529] leading-tight">
                      {activePatientDrawer.name}
                    </h3>
                  </div>
                  {/* Row 2: ID */}
                  <span className="text-[11px] text-[#6c757d] font-mono">
                    ID: {activePatientDrawer.id}
                  </span>
                </div>
                <button
                  onClick={() => setActivePatientDrawer(null)}
                  className="p-1.5 rounded text-[#6c757d] hover:text-[#212529] hover:bg-[#e9ecef] transition-colors mt-0.5"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)] text-xs text-[#495057]">
                {/* Patient Overview Box — with diagnosis at top */}
                <div className="bg-[#f8f9fa] rounded border border-[#dee2e6] overflow-hidden">
                  {[
                    {
                      label: "Diagnosis:",
                      value: (
                        <span className="font-semibold text-[#212529] flex items-center gap-1.5">
                          <Info className="size-3.5 text-[#adb5bd] shrink-0" />
                          <span>{activePatientDrawer.condition || "Preventive Care Gap"} — {getDiagnosisDesc(activePatientDrawer.condition)}</span>
                        </span>
                      ),
                    },
                    {
                      label: "Age / Gender:",
                      value: (
                        <span className="font-semibold text-[#212529]">
                          {activePatientDrawer.age} Yrs ({activePatientDrawer.gender})
                        </span>
                      ),
                    },
                    {
                      label: "Employer / Sponsor:",
                      value: (
                        <span className="font-semibold text-[#212529] flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-[#adb5bd]" />
                          {activePatientDrawer.employer}
                        </span>
                      ),
                    },
                    {
                      label: "Assigned Physician:",
                      value: (
                        <span className="font-semibold text-[#212529] flex items-center gap-1.5">
                          <Stethoscope className="size-3.5 text-[#adb5bd]" />
                          {activePatientDrawer.physician}
                        </span>
                      ),
                    },
                    {
                      label: "Phone Number:",
                      value: (
                        <span className="font-semibold text-[#212529] font-mono flex items-center gap-1.5">
                          {activePatientDrawer.contactPhone !== "Unavailable" && activePatientDrawer.contactPhone ? (
                            <>
                              <Phone className="size-3.5 text-[#adb5bd]" />
                              {activePatientDrawer.contactPhone.replace(/\D/g, "").slice(0, 10)}
                            </>
                          ) : (
                            <span className="text-[#adb5bd] italic font-sans text-xs">Unavailable (Email Only)</span>
                          )}
                        </span>
                      ),
                    },
                    {
                      label: "Email Address:",
                      value: (
                        <span className="font-semibold text-[#212529] font-sans text-xs flex items-center gap-1.5 truncate max-w-[200px]">
                          {activePatientDrawer.contactEmail !== "Unavailable" && activePatientDrawer.contactEmail ? (
                            <>
                              <Mail className="size-3.5 text-[#adb5bd] shrink-0" />
                              <span className="truncate">{activePatientDrawer.contactEmail}</span>
                            </>
                          ) : (
                            <span className="text-[#adb5bd] italic text-xs">Unavailable (Phone Only)</span>
                          )}
                        </span>
                      ),
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-4 py-2.5 ${
                        i < 5 ? "border-b border-[#e9ecef]" : ""
                      }`}
                    >
                      <span className="text-[#6c757d]">{row.label}</span>
                      {row.value}
                    </div>
                  ))}
                </div>

                    {/* Gap Reason — red accent card */}
                    <div>
                      <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] border-l-2 border-[#e61952] pl-2">
                        Gap Reason
                      </h4>
                      <div className="bg-[#fff0f4] border border-[#ffccd8] text-[#8b1a34] p-4 rounded-md">
                        <div className="font-bold flex items-center gap-1.5 text-[13px]">
                          <AlertTriangle className="size-4 text-[#e61952] shrink-0" />
                          <span>{activePatientDrawer.reason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Outreach Action & 2-Step Execution Workflow */}
                    <div>
                      <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] border-l-2 border-[#6c757d] pl-2 flex items-center justify-between">
                        <span>Recommended Outreach Action</span>
                        {actionStep !== "overview" && (
                          <span className="text-[10px] bg-[#e61952] text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-normal">
                            {actionStep === "step1" ? "Step 1 of 2: Configure" : actionStep === "step2" ? "Step 2 of 2: Confirm" : "Completed ✓"}
                          </span>
                        )}
                      </h4>

                      {/* STATE 1: OVERVIEW */}
                      {actionStep === "overview" && (
                        <div className="bg-[#f8f9fa] border border-[#dee2e6] text-[#343a40] p-4 rounded-md space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#212529]">{activePatientDrawer.suggestedAction}</span>
                            <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-white rounded border border-[#dee2e6] text-[#495057] tracking-wide">
                              {activePatientDrawer.suggestedActionType}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-[#dee2e6] flex items-center justify-between gap-3">
                            <span className="text-xs text-[#6c757d] font-medium">
                              Initiate secure two-step outreach for this care gap.
                            </span>
                            <button
                              type="button"
                              onClick={() => openDrawerWithStep(activePatientDrawer, "step1", "sms")}
                              className="px-3.5 py-1.5 bg-[#e61952] hover:bg-[#c81345] text-white font-bold text-xs rounded shadow-2xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                            >
                              <span>Initiate Action (Step 1 of 2)</span>
                              <ArrowRight className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STATE 2: STEP 1 (CONFIGURE & REVIEW) */}
                      {actionStep === "step1" && (() => {
                        const isPhoneAvail = Boolean(activePatientDrawer.contactPhone && activePatientDrawer.contactPhone !== "Unavailable" && activePatientDrawer.contactPhone.replace(/\D/g, "") !== "");
                        const isEmailAvail = Boolean(activePatientDrawer.contactEmail && activePatientDrawer.contactEmail !== "Unavailable" && activePatientDrawer.contactEmail.trim() !== "");

                        return (
                          <div className="bg-white border-2 border-[#007bff] rounded-md p-4 space-y-5 shadow-sm animate-in fade-in duration-200 relative">
                            <div className="flex items-center justify-between border-b border-[#dee2e6] pb-2.5">
                              <div className="flex items-center gap-2 text-[#007bff] font-bold text-xs">
                                <span>Select Channel & Customize Message</span>
                              </div>
                            </div>

                            {/* Red Error Banner when unavailable contact method is clicked */}
                            {outreachError && (
                              <div className="bg-[#fff0f4] border-2 border-[#e61952] text-[#c91244] p-3 rounded-md flex items-center justify-between gap-3 shadow-md mb-2 animate-in fade-in duration-200 z-10 relative">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  <ShieldAlert className="size-4 text-[#e61952] shrink-0" />
                                  <span>{outreachError}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setOutreachError(null)}
                                  className="px-2.5 py-1 bg-white border border-[#e61952] text-[#e61952] hover:bg-[#e61952] hover:text-white font-bold text-xs rounded shadow-2xs transition-colors shrink-0 cursor-pointer pointer-events-auto"
                                >
                                  Clear
                                </button>
                              </div>
                            )}

                            {/* Main Section Content - Grayed out if outreachError is set */}
                            <div className={`space-y-5 transition-all duration-200 ${outreachError ? "opacity-40 grayscale pointer-events-none select-none" : ""}`}>
                              {/* Channel Selector Pills */}
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-[#6c757d] tracking-wide mb-2">
                                  Outreach Channel
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {[
                                    { id: "call" as const, label: "Direct Phone Call", icon: Phone },
                                    { id: "email" as const, label: "Secure Email", icon: Mail },
                                    { id: "sms" as const, label: "Direct SMS Outreach", icon: MessageSquare },
                                  ].map((ch) => {
                                    const Icon = ch.icon;
                                    const isSelected = selectedChannel === ch.id;
                                    const isOptionDisabled = ch.id === "email" ? !isEmailAvail : !isPhoneAvail;

                                    return (
                                      <button
                                        key={ch.id}
                                        type="button"
                                        onClick={() => {
                                          if (isOptionDisabled) {
                                            const missingType = ch.id === "email" ? "email" : "phone number";
                                            setOutreachError(`${missingType} is unavailable please use other method for outreach`);
                                            return;
                                          }
                                          setOutreachError(null);
                                          setSelectedChannel(ch.id);
                                          if (ch.id === "call") {
                                            setActionNote(`Phone Outreach for ${activePatientDrawer.name}: Review ${activePatientDrawer.condition} gap status and explain DPC $0 copay visits & lab work with ${activePatientDrawer.physician}.`);
                                          } else if (ch.id === "email") {
                                            setActionNote(`Subject: Care Coordination & DPC Check-in\n\nDear ${activePatientDrawer.name},\nWe noticed an open care gap regarding your ${activePatientDrawer.condition} care plan...`);
                                          } else {
                                            setActionNote(`SMS Outreach to ${activePatientDrawer.name}: Hi ${activePatientDrawer.name.split(" ")[0]}, your DPC care team noticed an open care gap for ${activePatientDrawer.condition}. Please reply to schedule your $0 copay check-in or lab work.`);
                                          }
                                        }}
                                        className={`p-2.5 rounded text-left border flex flex-col gap-1.5 transition-all text-xs font-semibold ${
                                          isOptionDisabled
                                            ? "border-dashed border-[#dee2e6] bg-[#f1f3f5] text-[#adb5bd] cursor-not-allowed opacity-60 pointer-events-auto"
                                            : isSelected
                                            ? "border-[#007bff] bg-[#e3f2fd]/70 text-[#0d47a1] shadow-2xs ring-1 ring-[#007bff]/30 cursor-pointer pointer-events-auto"
                                            : "border-[#dee2e6] bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] cursor-pointer pointer-events-auto"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          {!isOptionDisabled ? (
                                            <Icon className={`size-4 ${isSelected ? "text-[#007bff]" : "text-[#6c757d]"}`} />
                                          ) : (
                                            <span className="text-[9px] font-bold uppercase bg-[#e9ecef] text-[#868e96] px-1.5 py-0.5 rounded">
                                              Unavailable
                                            </span>
                                          )}
                                          {isSelected && !isOptionDisabled && <span className="size-2 rounded-full bg-[#007bff]" />}
                                        </div>
                                        <span className="truncate">{ch.label}</span>
                                        {isOptionDisabled && (
                                          <span className="text-[10px] font-normal text-[#868e96]">
                                            {ch.id === "email" ? "No Email ID" : "No Phone #"}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Target Action Pill */}
                              <div className="flex items-center">
                                <span className="text-[10px] bg-[#e3f2fd] text-[#0d47a1] font-bold px-2.5 py-1 rounded">
                                  Target: {activePatientDrawer.suggestedAction}
                                </span>
                              </div>

                              {/* Editable Message / Note */}
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-[#6c757d] tracking-wide mb-1.5">
                                  {selectedChannel === "sms" ? "Secure SMS Preview (Editable)" : selectedChannel === "call" ? "Call Script / Clinical Note" : "Email Draft (Editable)"}
                                </label>
                                <textarea
                                  rows={3}
                                  value={actionNote}
                                  onChange={(e) => setActionNote(e.target.value)}
                                  className="w-full text-xs text-[#212529] p-2.5 rounded border border-[#dee2e6] bg-[#fdfdfd] focus:outline-none focus:border-[#007bff] font-mono leading-relaxed"
                                />
                              </div>

                          {/* Step 1 Action Bar */}
                          <div className="pt-2 border-t border-[#dee2e6] flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setActionStep("overview")}
                              className="px-3.5 py-1.5 rounded border border-[#dee2e6] bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionStep("step2")}
                              className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0056b3] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                            >
                              <span>Proceed to Final Review (Step 2)</span>
                              <ArrowRight className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                      {/* STATE 3: STEP 2 (FINAL REVIEW & CONFIRMATION) */}
                      {actionStep === "step2" && (
                        <div className="bg-[#fff8f0] border-2 border-[#fd7e14] rounded-md p-4 space-y-3.5 shadow-sm animate-in slide-in-from-right duration-200">
                          <div className="flex items-center justify-between border-b border-[#fd7e14]/30 pb-2">
                            <div className="flex items-center gap-2 text-[#d96b0c] font-bold text-xs">
                              <ShieldAlert className="size-4" />
                              <span>Final Confirmation & Execution</span>
                            </div>
                          </div>

                          <div className="bg-white rounded border border-[#fd7e14]/40 p-3 space-y-2 text-xs">
                            <div className="flex justify-between border-b border-[#f0f0f0] pb-1.5">
                              <span className="text-[#6c757d] font-semibold">Patient:</span>
                              <span className="font-bold text-[#212529]">{activePatientDrawer.name} ({activePatientDrawer.id})</span>
                            </div>
                            <div className="flex justify-between border-b border-[#f0f0f0] pb-1.5">
                              <span className="text-[#6c757d] font-semibold">Action & Channel:</span>
                              <span className="font-bold text-[#e61952]">{activePatientDrawer.suggestedAction} via {selectedChannel.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#f0f0f0] pb-1.5">
                              <span className="text-[#6c757d] font-semibold">Assigned Care Staff:</span>
                              <span className="font-semibold text-[#212529]">{assignedStaff}</span>
                            </div>
                            <div>
                              <span className="text-[#6c757d] font-semibold block mb-1">Logged Note Preview:</span>
                              <div className="bg-[#f8f9fa] p-2 rounded text-[11px] font-mono text-[#343a40] border border-[#dee2e6] max-h-[70px] overflow-y-auto">
                                {actionNote}
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#8a531b] font-medium leading-normal flex items-start gap-1.5">
                            <span className="text-base leading-none">ℹ️</span>
                            <span>Confirming will queue this outreach in the practice EHR, dispatch the communication via {selectedChannel.toUpperCase()}, and log a touchpoint timestamp in the patient history.</span>
                          </p>

                          {/* Step 2 Action Bar */}
                          <div className="pt-2 border-t border-[#fd7e14]/30 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setActionStep("step1")}
                              className="px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors flex items-center gap-1"
                            >
                              <ArrowLeft className="size-3.5" />
                              <span>Back to Edit (Step 1)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmTwoStepAction()}
                              className="px-4 py-2 rounded bg-[#28a745] hover:bg-[#218838] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-pulse"
                            >
                              <CheckCircle2 className="size-4" />
                              <span>Confirm & Log Action (Complete Step 2)</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STATE 4: SUCCESS */}
                      {actionStep === "success" && (
                        <div className="bg-[#d4edda] border-2 border-[#28a745] rounded-md p-4 space-y-3 text-[#155724] shadow-sm animate-in zoom-in-95 duration-200">
                          <div className="flex items-center gap-2 font-extrabold text-sm">
                            <Check className="size-5 text-[#28a745] bg-white rounded-full p-0.5 shadow-2xs shrink-0" />
                            <span>Outreach Action Successfully Executed & Logged!</span>
                          </div>
                          <p className="text-xs leading-relaxed bg-white/80 p-2.5 rounded border border-[#c3e6cb] font-medium text-[#212529]">
                            Touchpoint recorded for <strong>{activePatientDrawer.name}</strong> (`{activePatientDrawer.id}`) via <strong>{selectedChannel.toUpperCase()}</strong>. Practice task created for {assignedStaff.split(" ")[0]}.
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-[#c3e6cb]">
                            <button
                              type="button"
                              onClick={() => setActionStep("overview")}
                              className="text-xs font-bold underline hover:text-[#0b2e13] cursor-pointer"
                            >
                              View Updated History Below ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => setActivePatientDrawer(null)}
                              className="px-3.5 py-1 rounded bg-[#28a745] hover:bg-[#218838] text-white font-bold text-xs transition-all cursor-pointer"
                            >
                              Done & Close Drawer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recent Touchpoint History */}
                    <div>
                      <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] border-l-2 border-[#007bff] pl-2">
                        Recent Touchpoint History
                      </h4>
                      <div className="border border-[#dee2e6] rounded-md divide-y divide-[#f0f0f0] bg-white overflow-hidden">
                        {activePatientDrawer.engagementHistory.map((item) => (
                          <div key={item.id} className="px-4 py-3 flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="text-[10px] font-bold text-[#495057] bg-[#e9ecef] px-1.5 py-0.5 rounded shrink-0 mt-px">
                                {item.type}
                              </span>
                              <span className="text-[#495057] leading-relaxed">{item.description}</span>
                            </div>
                            <span className="text-[11px] text-[#adb5bd] font-mono whitespace-nowrap shrink-0">
                              {item.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-6 py-3.5 flex items-center justify-between gap-3">
              <button
                onClick={() => setActivePatientDrawer(null)}
                className="px-4 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors"
              >
                Close Drawer
              </button>

              <div className="flex items-center gap-2">
                {actionStep === "overview" && (
                  <button
                    onClick={() => openDrawerWithStep(activePatientDrawer, "step1")}
                    className="px-4 py-2 rounded bg-[#e61952] hover:bg-[#c81345] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Initiate 2-Step Action →</span>
                  </button>
                )}

                {actionStep === "step1" && (
                  <>
                    <button
                      onClick={() => setActionStep("overview")}
                      className="px-3.5 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors"
                    >
                      Cancel Step 1
                    </button>
                    <button
                      onClick={() => setActionStep("step2")}
                      className="px-4 py-2 rounded bg-[#007bff] hover:bg-[#0056b3] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Proceed to Step 2 →</span>
                    </button>
                  </>
                )}

                {actionStep === "step2" && (
                  <>
                    <button
                      onClick={() => setActionStep("step1")}
                      className="px-3.5 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="size-3.5" />
                      <span>Back (Step 1)</span>
                    </button>
                    <button
                      onClick={() => handleConfirmTwoStepAction()}
                      className="px-4 py-2 rounded bg-[#28a745] hover:bg-[#218838] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer animate-pulse"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Confirm & Log Action</span>
                    </button>
                  </>
                )}

                {actionStep === "success" && (
                  <button
                    onClick={() => setActionStep("overview")}
                    className="px-4 py-2 rounded bg-[#e9ecef] hover:bg-[#dee2e6] text-[#212529] font-bold text-xs transition-colors"
                  >
                    Return to Overview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
