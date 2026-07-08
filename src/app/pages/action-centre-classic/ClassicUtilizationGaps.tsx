import React, { useState, useMemo } from "react";
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
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  MessageSquareOff,
  ShieldAlert,
  Activity,
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
  const [sortBy, setSortBy] = useState<string>("highest-risk");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState("");

  // Action / Completion States
  const [completedPatientIds, setCompletedPatientIds] = useState<Set<string>>(new Set());
  const [activePatientDrawer, setActivePatientDrawer] = useState<ActionCentrePatientRow | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"overview" | "claims" | "encounters">("overview");

  // Metric Overlay Modal State
  const [selectedMetricOverlay, setSelectedMetricOverlay] = useState<any | null>(null);
  const [metricGraphView, setMetricGraphView] = useState<"WoW" | "MoM">("WoW");

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    let list = [...ACTION_CENTRE_PATIENTS];

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
      if (sortBy === "highest-risk") {
        const pOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        if (pOrder[b.priority] !== pOrder[a.priority]) {
          return pOrder[b.priority] - pOrder[a.priority];
        }
        return (b.lastVisitDaysAgo || 999) - (a.lastVisitDaysAgo || 999);
      }
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
      const cleanPhone = row.contactPhone.replace(/\D/g, "").slice(0, 10) || "5652677598";
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

  const handleSpruceMessage = (patient: ActionCentrePatientRow) => {
    toast.success(`Spruce Secure Message initiated for ${patient.name}`, {
      description: "Opening direct communication channel...",
    });
    setCompletedPatientIds((prev) => new Set(prev).add(patient.id));
  };

  const handleActionExecution = (patient: ActionCentrePatientRow, actionType: string) => {
    toast.success(`Action Executed: ${actionType}`, {
      description: `Logged for ${patient.name} (${patient.id}). Task queued in practice EHR.`,
    });
    setCompletedPatientIds((prev) => new Set(prev).add(patient.id));
    setActivePatientDrawer(null);
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
      subtitleNote="Note: Click a card or tab to filter the actionable queue. Click Patient ID to view full clinical details, claims leakage, and encounter notes."
      modernRoute="/utilization-gaps"
      activeNavIndex={0}
      headerActions={headerActionsNode}
    >
      {/* 1. OPERATIONAL SUMMARY CARDS (Clean Legacy Design exactly like Action Centre Classic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {COHORT_SUMMARIES.map((card) => {
          const isSelected = activeCohort === card.id;
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
                    {card.count}
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
                  {card.id === "all" ? "All Attention" : card.id === "external-leakage" ? "Claims Gap" : "Engagement"}
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
            { id: "external-leakage" as const, label: "External Care Leakage" },
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
            <option value="highest-risk">Sort: Highest Priority</option>
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
                <th className="py-3 px-3.5 w-14 text-center">Message</th>
                <th className="py-3 px-3">Patient ID</th>
                <th className="py-3 px-3">Patient Member</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Phone Number</th>
                <th className="py-3 px-3">Diagnosis & Gap Reason</th>
                <th className="py-3 px-3">Spruce App</th>
                <th className="py-3 px-3">Last Encounter</th>
                <th className="py-3 px-3">Employer</th>
                <th className="py-3 px-3 text-right">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-[#6c757d]">
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
                      {/* Message Icon Button */}
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => handleSpruceMessage(row)}
                          className="p-1.5 rounded bg-[#fff0f4] text-[#e61952] hover:bg-[#e61952] hover:text-white transition-all shadow-2xs"
                          title={`Send Spruce Message to ${row.name}`}
                        >
                          <MessageSquare className="size-3.5" />
                        </button>
                      </td>

                      {/* Patient ID (Blue Link) */}
                      <td className="py-3 px-3 font-medium">
                        <span
                          onClick={() => {
                            setActivePatientDrawer(row);
                            setActiveDrawerTab("overview");
                          }}
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

                      {/* Priority Badge */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            row.priority === "High"
                              ? "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]"
                              : row.priority === "Medium"
                              ? "bg-[#fff3cd] text-[#856404] border-[#ffeeba]"
                              : "bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]"
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3 text-[#495057]">
                        {row.age} Yrs ({row.gender})
                      </td>

                      {/* Phone Number */}
                      <td className="py-3 px-3 text-[#495057] font-mono">
                        {row.formattedPhone}
                      </td>

                      {/* Diagnosis & Gap Reason */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-semibold text-[#212529] truncate" title={getDiagnosisDesc(row.condition)}>
                          {row.condition ? `${row.condition} - ${getDiagnosisDesc(row.condition)}` : "Preventive Screening"}
                        </div>
                        <div className="text-[11px] text-[#6c757d] truncate" title={row.reason}>
                          {row.reason}
                        </div>
                      </td>

                      {/* Spruce App */}
                      <td className="py-3 px-3">
                        {row.spruce === "Yes" ? (
                          <span className="text-[#28a745] font-semibold">Yes</span>
                        ) : (
                          <span
                            onClick={() => handleSpruceMessage(row)}
                            className="text-[#007bff] hover:underline cursor-pointer"
                          >
                            No
                          </span>
                        )}
                      </td>

                      {/* Last Encounter */}
                      <td className="py-3 px-3 text-[#6c757d] font-mono text-[11px]">
                        {row.encounterDateTime}
                      </td>

                      {/* Employer */}
                      <td className="py-3 px-3 font-medium text-[#343a40]">
                        {row.employer}
                      </td>

                      {/* Suggested Action Button */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleActionExecution(row, row.suggestedAction)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all shadow-2xs ${
                            isDone
                              ? "bg-[#d4edda] text-[#155724] border border-[#c3e6cb]"
                              : "bg-[#fff0f4] text-[#e61952] border border-[#ffccd8] hover:bg-[#e61952] hover:text-white"
                          }`}
                        >
                          {isDone ? "Completed ✓" : row.suggestedAction}
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
                  {/* Row 1: patient name + priority badge */}
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-[#212529] leading-tight">
                      {activePatientDrawer.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        activePatientDrawer.priority === "High"
                          ? "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]"
                          : activePatientDrawer.priority === "Medium"
                          ? "bg-[#fff3cd] text-[#856404] border-[#ffeeba]"
                          : "bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]"
                      }`}
                    >
                      {activePatientDrawer.priority} Priority
                    </span>
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

              {/* Drawer Navigation Tabs */}
              <div className="bg-white border-b border-[#dee2e6] px-6 flex items-center gap-1">
                <button
                  onClick={() => setActiveDrawerTab("overview")}
                  className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors ${
                    activeDrawerTab === "overview"
                      ? "border-[#e61952] text-[#e61952]"
                      : "border-transparent text-[#6c757d] hover:text-[#212529]"
                  }`}
                >
                  Overview & Action
                </button>
                <button
                  onClick={() => setActiveDrawerTab("claims")}
                  className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeDrawerTab === "claims"
                      ? "border-[#e61952] text-[#e61952]"
                      : "border-transparent text-[#6c757d] hover:text-[#212529]"
                  }`}
                >
                  <span>Claims Leakage</span>
                  <span className="bg-[#e9ecef] text-[#495057] px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none">
                    {activePatientDrawer.recentClaims.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveDrawerTab("encounters")}
                  className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeDrawerTab === "encounters"
                      ? "border-[#e61952] text-[#e61952]"
                      : "border-transparent text-[#6c757d] hover:text-[#212529]"
                  }`}
                >
                  <span>Clinical Encounters</span>
                  <span className="bg-[#e9ecef] text-[#495057] px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none">
                    {activePatientDrawer.recentEncounters.length}
                  </span>
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)] text-xs text-[#495057]">
                {activeDrawerTab === "overview" && (
                  <>
                    {/* Patient Overview Box — tighter rows with better rhythm */}
                    <div className="bg-[#f8f9fa] rounded border border-[#dee2e6] overflow-hidden">
                      {[
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
                              <Phone className="size-3.5 text-[#adb5bd]" />
                              {activePatientDrawer.contactPhone.replace(/\D/g, "").slice(0, 10) || "5652677598"}
                            </span>
                          ),
                        },
                        {
                          label: "Spruce App Active:",
                          value: (
                            <span className={`font-semibold ${activePatientDrawer.spruce === "Yes" ? "text-[#28a745]" : "text-[#212529]"}`}>
                              {activePatientDrawer.spruce}
                            </span>
                          ),
                        },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between px-4 py-2.5 ${
                            i < 4 ? "border-b border-[#e9ecef]" : ""
                          }`}
                        >
                          <span className="text-[#6c757d]">{row.label}</span>
                          {row.value}
                        </div>
                      ))}
                    </div>

                    {/* Diagnosis & Gap Reason — accent left border for hierarchy */}
                    <div>
                      <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] border-l-2 border-[#e61952] pl-2">
                        Diagnosis & Gap Reason
                      </h4>
                      <div className="bg-[#fff8e1] border border-[#ffe082] text-[#7b6b2e] p-4 rounded-md space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5 text-[13px]">
                          <AlertTriangle className="size-4 text-[#e6a817] shrink-0" />
                          <span>ICD-10 Condition: {activePatientDrawer.condition || "Preventive Care Gap"}</span>
                        </div>
                        <div className="text-xs font-medium text-[#8d7a32] pl-[22px]">
                          {getDiagnosisDesc(activePatientDrawer.condition)}
                        </div>
                        <p className="text-xs text-[#7b6b2e] mt-1.5 pt-2 border-t border-[#ffe082]/60 pl-[22px]">
                          {activePatientDrawer.reason}
                        </p>
                      </div>
                    </div>

                    {/* Recommended Outreach Action */}
                    <div>
                      <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] border-l-2 border-[#6c757d] pl-2">
                        Recommended Outreach Action
                      </h4>
                      <div className="bg-[#f8f9fa] border border-[#dee2e6] text-[#343a40] p-4 rounded-md flex items-center justify-between">
                        <span className="text-[13px] font-bold">{activePatientDrawer.suggestedAction}</span>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-white rounded border border-[#dee2e6] text-[#495057] tracking-wide">
                          {activePatientDrawer.suggestedActionType}
                        </span>
                      </div>
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
                  </>
                )}

                {activeDrawerTab === "claims" && (
                  <div>
                    <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] flex items-center justify-between border-l-2 border-[#e61952] pl-2">
                      <span>Out-of-Network Claims Leakage</span>
                      <span className="text-xs text-[#e61952] font-semibold normal-case">{activePatientDrawer.recentClaims.length} claims</span>
                    </h4>
                    {activePatientDrawer.recentClaims.length === 0 ? (
                      <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded-md p-6 text-center text-[#6c757d]">
                        No external claims leakage recorded for this patient.
                      </div>
                    ) : (
                      <div className="border border-[#dee2e6] rounded-md overflow-hidden bg-white">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#f8f9fa] text-[#6c757d] text-[11px] font-semibold border-b border-[#dee2e6]">
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">External Provider</th>
                              <th className="py-2.5 px-3">Diagnosis / Procedure</th>
                              <th className="py-2.5 px-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#f0f0f0]">
                            {activePatientDrawer.recentClaims.map((claim) => (
                              <tr key={claim.id} className="hover:bg-[#f8f9fa] transition-colors">
                                <td className="py-2.5 px-3 font-mono text-[11px] text-[#6c757d]">{claim.date}</td>
                                <td className="py-2.5 px-3 font-semibold text-[#212529]">{claim.provider}</td>
                                <td className="py-2.5 px-3 text-[#495057]">{claim.diagnosis}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-[#e61952]">{claim.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeDrawerTab === "encounters" && (
                  <div>
                    <h4 className="font-bold text-[#343a40] uppercase tracking-wide mb-2.5 text-[11px] flex items-center justify-between border-l-2 border-[#007bff] pl-2">
                      <span>Recent Clinical Encounters & Notes</span>
                      <span className="text-xs text-[#007bff] font-semibold normal-case">{activePatientDrawer.recentEncounters.length} visits</span>
                    </h4>
                    {activePatientDrawer.recentEncounters.length === 0 ? (
                      <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded-md p-6 text-center text-[#6c757d]">
                        No completed DPC clinical encounters on file.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activePatientDrawer.recentEncounters.map((enc) => (
                          <div key={enc.id} className="bg-[#f8f9fa] border border-[#dee2e6] rounded-md p-4 space-y-2">
                            <div className="flex items-center justify-between pb-2 border-b border-[#e9ecef]">
                              <span className="font-bold text-[#212529] text-[13px]">{enc.type}</span>
                              <span className="font-mono text-[11px] text-[#adb5bd]">{enc.date}</span>
                            </div>
                            <div className="text-xs font-semibold text-[#495057] flex items-center gap-1.5">
                              <Stethoscope className="size-3.5 text-[#adb5bd]" />
                              <span>Provider: {enc.provider}</span>
                            </div>
                            <p className="text-xs text-[#343a40] bg-white p-2.5 rounded border border-[#e9ecef] leading-relaxed">
                              "{enc.notes}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                <button
                  onClick={() => {
                    handleSpruceMessage(activePatientDrawer);
                    setActivePatientDrawer(null);
                  }}
                  className="px-3.5 py-2 rounded border border-[#e61952] bg-[#fff0f4] text-[#e61952] hover:bg-[#e61952] hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Send Spruce SMS</span>
                </button>

                <button
                  onClick={() => handleActionExecution(activePatientDrawer, activePatientDrawer.suggestedAction)}
                  className="px-4 py-2 rounded bg-[#e61952] hover:bg-[#c81345] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Execute Action</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
