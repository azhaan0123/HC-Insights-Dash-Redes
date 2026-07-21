import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  UserPlus,
  Clock,
  MessageSquareOff,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  Info,
  X,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { ClassicLayout } from "./ClassicLayout";
import {
  ACTION_CENTRE_PATIENTS,
  COHORT_SUMMARIES,
  type CohortType,
  type GapTier,
  type ActionCentrePatientRow,
} from "../../data/actionCentreData";

export function ClassicActionCentreOverview() {
  const navigate = useNavigate();

  const [activeCohort, setActiveCohort] = useState<CohortType | "all">("all");
  const [activeGapTier, setActiveGapTier] = useState<GapTier | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("highest-risk");
  const [selectedPatient, setSelectedPatient] = useState<ActionCentrePatientRow | null>(null);
  const [completedPatientIds, setCompletedPatientIds] = useState<Set<string>>(new Set());
  const [selectedMetricOverlay, setSelectedMetricOverlay] = useState<typeof COHORT_SUMMARIES[number] | null>(null);
  const [metricGraphView, setMetricGraphView] = useState<"WoW" | "MoM">("WoW");

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState("");

  const filteredPatients = useMemo(() => {
    let list = [...ACTION_CENTRE_PATIENTS];

    if (activeCohort !== "all") {
      list = list.filter((p) => p.cohort === activeCohort);
    }

    if (activeCohort === "engagement-gap" && activeGapTier !== "all") {
      list = list.filter((p) => p.gapTier === activeGapTier);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.reason.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q) ||
          p.suggestedAction.toLowerCase().includes(q)
      );
    }

    if (sortBy === "highest-risk") {
      const pOrder = { High: 0, Medium: 1, Low: 2 };
      list.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
    } else if (sortBy === "longest-inactive") {
      list.sort((a, b) => b.gapDays - a.gapDays);
    } else if (sortBy === "last-visit") {
      list.sort((a, b) => a.gapDays - b.gapDays);
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [activeCohort, activeGapTier, searchQuery, sortBy]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCohort, activeGapTier, searchQuery, sortBy, recordsPerPage]);

  const totalEntries = filteredPatients.length;
  const totalPages = Math.ceil(totalEntries / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRows = filteredPatients.slice(startIndex, startIndex + recordsPerPage);

  const getPriorityText = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return <span className="font-bold text-[#e61952]">High Priority</span>;
      case "Medium":
        return <span className="font-semibold text-[#856404]">Medium</span>;
      case "Low":
        return <span className="text-[#6c757d]">Low</span>;
    }
  };

  const executeAction = (patient: ActionCentrePatientRow, actionTitle?: string) => {
    const act = actionTitle || patient.suggestedAction;
    toast.success(`Action Executed for ${patient.name}`, {
      description: `Initiated: ${act}`,
    });
    setCompletedPatientIds((prev) => new Set(prev).add(patient.id));
    setSelectedPatient(null);
  };

  const getMetricChartData = (card: typeof COHORT_SUMMARIES[number], view: "WoW" | "MoM") => {
    const count = card.count;
    const isPositive = card.wowPositive;
    if (view === "WoW") {
      const factor = isPositive ? 0.88 : 1.12;
      return [
        { period: "W1 (4 wks ago)", value: Math.max(1, Math.round(count * factor * 0.92)) },
        { period: "W2 (3 wks ago)", value: Math.max(1, Math.round(count * factor * 0.95)) },
        { period: "W3 (2 wks ago)", value: Math.max(1, Math.round(count * factor * 0.98)) },
        { period: "W4 (Last wk)", value: Math.max(1, Math.round(count * factor)) },
        { period: "Current Wk", value: count },
      ];
    } else {
      const factor = isPositive ? 0.75 : 1.25;
      return [
        { period: "Feb", value: Math.max(1, Math.round(count * factor * 0.85)) },
        { period: "Mar", value: Math.max(1, Math.round(count * factor * 0.9)) },
        { period: "Apr", value: Math.max(1, Math.round(count * factor * 0.95)) },
        { period: "May", value: Math.max(1, Math.round(count * 0.92)) },
        { period: "Jun", value: Math.max(1, Math.round(count * 0.95)) },
        { period: "Jul (Current)", value: count },
      ];
    }
  };

  const handleJumpTo = () => {
    const num = parseInt(jumpToPage, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setCurrentPage(num);
    }
    setJumpToPage("");
  };

  return (
    <ClassicLayout
      title="Utilization Gaps"
      subtitleNote="Note: Click a card to view details, cards without data are not clickable."
      activeNavIndex={1}
    >
      {/* SECTION 1: OPERATIONAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {COHORT_SUMMARIES.map((card) => {
          const isSelected = activeCohort === card.id;
          return (
            <div
              key={card.id}
              onClick={() => {
                setActiveCohort(card.id as any);
                if (card.id !== "engagement-gap") setActiveGapTier("all");
              }}
              className={`bg-white rounded p-4 flex flex-col justify-between min-h-[140px] transition-all cursor-pointer select-none border ${
                isSelected
                  ? "border-2 border-[#e61952] shadow-sm"
                  : "border border-[#dee2e6] shadow-2xs hover:border-[#e61952]/50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-[#343a40] leading-tight">
                    {card.title}
                  </span>
                  <Info className="size-4 text-[#6c757d] shrink-0" />
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-medium tracking-tight tabular-nums text-[#212529]">
                    {card.count}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                      card.wowPositive
                        ? "text-[#28a745]"
                        : "text-[#e61952]"
                    }`}
                  >
                    <span>{card.wowChange} ({card.wowPositive ? "+" : "-"}13.4%)</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#dee2e6] text-[11px]">
                <span className="text-[#6c757d]">Overall Active</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMetricOverlay(card);
                    setMetricGraphView("WoW");
                  }}
                  className="font-semibold text-[#e61952] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: TABS & QUEUE CONTROLS (Reference Design) */}
      <div className="flex flex-col gap-3 mt-4">
        {/* Top Queue Tabs exactly like reference ([ Overall ] [ Refills ]) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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
                    if (tab.id !== "engagement-gap") setActiveGapTier("all");
                  }}
                  className={`px-4 py-1.5 rounded text-xs transition-all cursor-pointer select-none ${
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

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
              <input
                type="text"
                placeholder="Search patient, ID, employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952] w-56"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
            >
              <option value="highest-risk">Sort: Highest Priority</option>
              <option value="longest-inactive">Sort: Longest Inactive</option>
              <option value="last-visit">Sort: Recent Visit First</option>
              <option value="newest">Sort: Newest Member</option>
            </select>
          </div>
        </div>

        {/* Duration Sub-filter pills if Engagement Gap selected */}
        {activeCohort === "engagement-gap" && (
          <div className="flex flex-wrap items-center gap-2 bg-[#f8f9fa] p-2.5 rounded border border-[#dee2e6] text-xs">
            <span className="text-[#495057] font-semibold">Duration Filter:</span>
            {[
              { id: "all" as const, label: "All Gaps" },
              { id: "30-days" as const, label: "30+ Days" },
              { id: "60-days" as const, label: "60+ Days" },
              { id: "90-days" as const, label: "90+ Days" },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveGapTier(sub.id)}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                  activeGapTier === sub.id
                    ? "bg-[#fff0f4] text-[#e61952] border-[#e61952]"
                    : "bg-white text-[#495057] border-[#dee2e6] hover:bg-muted"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* SECTION 3: EXACT REFERENCE TABLE STRUCTURE */}
        <div className="bg-white border border-[#dee2e6] rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs divide-y divide-[#dee2e6]">
              {/* Reference Header: solid #e9ecef background, #343a40 text, normal/title case, exact columns */}
              <thead>
                <tr className="bg-[#e9ecef] text-[#343a40] font-semibold select-none divide-x divide-[#dee2e6]/60">
                  <th className="py-3 px-4 whitespace-nowrap">Patient ID</th>
                  <th className="py-3 px-4 whitespace-nowrap">Patient Name</th>
                  <th className="py-3 px-4 whitespace-nowrap">Patient Email</th>
                  <th className="py-3 px-4 whitespace-nowrap">Reason for Inclusion</th>
                  <th className="py-3 px-4 whitespace-nowrap">Priority</th>
                  <th className="py-3 px-4 whitespace-nowrap">Last Visit Date Time</th>
                  <th className="py-3 px-4 whitespace-nowrap">Employer</th>
                  <th className="py-3 px-4 whitespace-nowrap">DPC</th>
                  <th className="py-3 px-4 whitespace-nowrap">Physician</th>
                  <th className="py-3 px-4 whitespace-nowrap text-right">Suggested Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6] bg-white">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-[#6c757d] italic">
                      No matching patient entries found in this queue.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((patient) => {
                    const isDone = completedPatientIds.has(patient.id);
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`cursor-pointer hover:bg-[#f8f9fa] transition-colors divide-x divide-[#dee2e6]/40 ${
                          isDone ? "opacity-60 bg-[#f8f9fa]" : ""
                        }`}
                      >
                        {/* Patient ID column: Bright blue link matching reference table */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-[#007bff] hover:underline font-normal">
                            {patient.id}
                          </span>
                        </td>

                        {/* Patient Name column */}
                        <td className="py-3 px-4 font-normal text-[#212529] whitespace-nowrap">
                          {patient.name}
                        </td>

                        {/* Patient Email column */}
                        <td className="py-3 px-4 text-[#495057] whitespace-nowrap">
                          {patient.contactEmail}
                        </td>

                        {/* Reason for Inclusion column */}
                        <td className="py-3 px-4 text-[#212529] max-w-xs truncate">
                          {patient.reason}
                        </td>

                        {/* Priority column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getPriorityText(patient.priority)}
                        </td>

                        {/* Last Visit Date Time column */}
                        <td className="py-3 px-4 text-[#495057] whitespace-nowrap">
                          {patient.lastVisitText}
                        </td>

                        {/* Employer column */}
                        <td className="py-3 px-4 text-[#212529] whitespace-nowrap">
                          {patient.employer}
                        </td>

                        {/* DPC column */}
                        <td className="py-3 px-4 text-[#212529] whitespace-nowrap">
                          HC Clinic
                        </td>

                        {/* Physician column */}
                        <td className="py-3 px-4 text-[#212529] whitespace-nowrap">
                          {patient.physician}
                        </td>

                        {/* Suggested Action column */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span className="text-[#e61952] hover:underline font-medium">
                            {patient.suggestedAction}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* REFERENCE PAGINATION BAR EXACTLY MATCHING SCREENSHOT */}
          <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#495057]">
            <div>
              Showing {totalEntries === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + recordsPerPage, totalEntries)} of {totalEntries} entries
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white hover:bg-[#f1f3f5] disabled:opacity-50 text-[#495057]"
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`px-2.5 py-1 rounded border ${
                        currentPage === pNum
                          ? "border-[#e61952] bg-[#fff0f4] text-[#e61952] font-bold"
                          : "border-[#dee2e6] bg-white hover:bg-[#f1f3f5] text-[#495057]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-1 text-[#6c757d]">...</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-2.5 py-1 rounded border ${
                      currentPage === totalPages
                        ? "border-[#e61952] bg-[#fff0f4] text-[#e61952] font-bold"
                        : "border-[#dee2e6] bg-white hover:bg-[#f1f3f5] text-[#495057]"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white hover:bg-[#f1f3f5] disabled:opacity-50 text-[#495057]"
                >
                  &gt;
                </button>
              </div>

              <div className="flex items-center gap-2 border-l border-[#dee2e6] pl-3">
                <span>Records per page:</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded border border-[#dee2e6] bg-white text-[#212529]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 border-l border-[#dee2e6] pl-3">
                <button className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white hover:bg-muted text-[#495057]">
                  Page
                </button>
                <input
                  type="text"
                  placeholder="1"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJumpTo()}
                  className="w-10 h-7 px-1.5 text-center rounded border border-[#dee2e6] bg-white text-xs text-[#212529]"
                />
                <button
                  onClick={handleJumpTo}
                  className="px-2.5 py-1 rounded border border-[#dee2e6] bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057]"
                >
                  Jump to
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC DETAILS OVERLAY DIALOG */}
      <AnimatePresence>
        {selectedMetricOverlay && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded shadow-2xl border border-[#dee2e6] w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-[#343a40] text-white px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span>{selectedMetricOverlay.title} - Operational Trend</span>
                  </h3>
                  <p className="text-xs text-[#adb5bd] mt-0.5">
                    Comparative metric analysis with target benchmark threshold
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMetricOverlay(null)}
                  className="p-1.5 rounded text-[#adb5bd] hover:text-white hover:bg-[#212529]"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
                  <div>
                    <span className="text-xs text-[#6c757d] font-semibold block">Current Active Queue</span>
                    <span className="text-2xl font-medium text-[#212529]">{selectedMetricOverlay.count}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded border border-[#dee2e6]">
                    <button
                      onClick={() => setMetricGraphView("WoW")}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        metricGraphView === "WoW"
                          ? "bg-[#e61952] text-white shadow-2xs"
                          : "text-[#495057] hover:bg-[#f8f9fa]"
                      }`}
                    >
                      WoW View
                    </button>
                    <button
                      onClick={() => setMetricGraphView("MoM")}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        metricGraphView === "MoM"
                          ? "bg-[#e61952] text-white shadow-2xs"
                          : "text-[#495057] hover:bg-[#f8f9fa]"
                      }`}
                    >
                      MoM View
                    </button>
                  </div>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getMetricChartData(selectedMetricOverlay, metricGraphView)}>
                      <defs>
                        <linearGradient id="classicOverlayGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e61952" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#e61952" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                      <XAxis dataKey="period" tickLine={false} tick={{ fontSize: 11, fill: "#6c757d" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6c757d" }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" name="Active Queue" stroke="#e61952" strokeWidth={2.5} fillOpacity={1} fill="url(#classicOverlayGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#f8f9fa] px-5 py-3 border-t border-[#dee2e6] flex justify-end">
                <button
                  onClick={() => setSelectedMetricOverlay(null)}
                  className="px-5 py-1.5 rounded bg-[#343a40] text-white font-bold text-xs hover:bg-[#212529]"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PATIENT DETAIL DRAWER */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white h-full w-full max-w-lg shadow-2xl border-l border-[#dee2e6] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-[#dee2e6] bg-[#343a40] text-white flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#e61952] text-white uppercase">
                      {selectedPatient.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-[#adb5bd] mt-1">
                    ID: {selectedPatient.id} • {selectedPatient.age} Yrs ({selectedPatient.gender})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 rounded text-[#adb5bd] hover:text-white hover:bg-[#212529]"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#212529]">
                <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-3.5 rounded border border-[#dee2e6]">
                  <div>
                    <span className="text-[#6c757d] block mb-0.5">Phone</span>
                    <span className="font-semibold text-[#212529]">{selectedPatient.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#6c757d] block mb-0.5">Email</span>
                    <span className="font-semibold text-[#212529] truncate block">{selectedPatient.contactEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#6c757d] block mb-0.5">Employer</span>
                    <span className="font-semibold text-[#212529]">{selectedPatient.employer}</span>
                  </div>
                  <div>
                    <span className="text-[#6c757d] block mb-0.5">Physician</span>
                    <span className="font-semibold text-[#212529]">{selectedPatient.physician}</span>
                  </div>
                </div>

                <div className="border border-[#e61952] bg-[#fff0f4] p-4 rounded space-y-2">
                  <span className="font-bold text-[#e61952] flex items-center gap-1.5 text-sm">
                    <AlertCircle className="size-4 text-[#e61952]" />
                    Recommended Operational Action
                  </span>
                  <p className="text-[#212529] font-semibold">{selectedPatient.suggestedAction}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#212529] text-sm">Action Execution Options</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => executeAction(selectedPatient)}
                      className="w-full py-2.5 px-4 rounded bg-[#e61952] hover:bg-[#c91244] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Send className="size-3.5" />
                      <span>Execute Primary Action ({selectedPatient.suggestedAction})</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] px-6 py-4 border-t border-[#dee2e6] flex justify-end">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-5 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] font-bold text-[#343a40] text-xs"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ClassicLayout>
  );
}
export default ClassicActionCentreOverview;
