import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Info,
  Download,
  Share2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  Calendar,
  Building2,
  Stethoscope,
  X,
} from "../../lib/icons";
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
import { ACTION_CENTRE_PATIENTS, type ActionCentrePatientRow } from "../../data/actionCentreData";

export function ClassicActionCentreDetail() {
  const { cohortId = "all" } = useParams<{ cohortId?: string }>();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<"Overall" | "HighPriority">("Overall");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState("");
  const [activePatientDrawer, setActivePatientDrawer] = useState<ActionCentrePatientRow | null>(null);

  const cohortTitleMap: Record<string, string> = {
    all: "Active Actionable Patients (Work Queue)",
    "new-activation": "New Patient Activation",
    "engagement-gap": "Engagement Gaps (30+ Days)",
    "low-response": "Low Response Rate & Escalation",
  };

  const currentTitle = cohortTitleMap[cohortId] || "Active Actionable Patients";

  const filteredPatients = useMemo(() => {
    let list = ACTION_CENTRE_PATIENTS;
    if (cohortId && cohortId !== "all") {
      list = list.filter((p) => p.cohort === cohortId);
    }
    if (selectedTab === "HighPriority") {
      list = list.filter((p) => p.priority === "High");
    }
    return list;
  }, [cohortId, selectedTab]);

  const totalEntries = filteredPatients.length;
  const totalPages = Math.ceil(totalEntries / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRows = filteredPatients.slice(startIndex, startIndex + recordsPerPage);

  const chartData = useMemo(() => {
    const multiplier = cohortId === "all" ? 1 : cohortId === "new-activation" ? 0.3 : 0.55;
    return [
      { year: "2023", Overall: Math.round(15 * multiplier), HighPriority: Math.round(4 * multiplier) },
      { year: "2024", Overall: Math.round(180 * multiplier), HighPriority: Math.round(45 * multiplier) },
      { year: "2025", Overall: Math.round(850 * multiplier), HighPriority: Math.round(210 * multiplier) },
      { year: "2026", Overall: Math.round(2823 * multiplier), HighPriority: Math.round(719 * multiplier) },
    ];
  }, [cohortId]);

  const handleActionClick = (p: ActionCentrePatientRow) => {
    setActivePatientDrawer(p);
  };

  const executePatientAction = (p: ActionCentrePatientRow) => {
    toast.success(`Action Executed for ${p.name}`, {
      description: `Logged: ${p.suggestedAction}`,
    });
    setActivePatientDrawer(null);
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
      title={currentTitle}
      onBack={() => navigate("/utilization-gaps-classic")}
      backTitle="Utilization Gaps"
      subtitleNote=""
      activeNavIndex={2}
    >
      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-[#e61952] rounded p-4 flex flex-col justify-between shadow-sm relative">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-[#343a40]">{currentTitle}</span>
            <Info className="size-4 text-[#495057]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-medium text-[#212529]">{filteredPatients.length}</span>
            <span className="text-xs font-bold text-[#495057]">
              ({Math.round((filteredPatients.length / 98) * 100)}% of queue)
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-[#6c757d] font-semibold uppercase tracking-wider">
            <span>Overall Active</span>
            <span>Priority Filtered</span>
          </div>
        </div>

        <div className="bg-white border border-[#dee2e6] rounded p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-[#343a40]">{currentTitle} - Breakdown</span>
            <Info className="size-4 text-[#495057]" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-medium text-[#212529]">100%</span>
          </div>
          <div className="text-xs text-[#6c757d] font-medium">Direct Primary Care Coordinated</div>
        </div>

        <div className="bg-white border border-[#dee2e6] rounded p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-[#343a40]">Clinical Reconciliation Gap</span>
            <Info className="size-4 text-[#495057]" />
          </div>
          <div className="my-auto py-4 text-xs text-[#adb5bd] italic">No data available</div>
        </div>
      </div>

      {/* Bulleted Note Box */}
      <div className="space-y-1.5 mt-2">
        <p className="text-xs font-medium text-[#495057]">
          Note: Dynamic date range on the x-axis in the graph.
        </p>
        <div className="bg-white border border-[#dee2e6] rounded p-3.5 text-xs text-[#495057] space-y-1 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[#495057]" />
            <span>Date Range &lt; 15 Days: Daily data, each day as a unit.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[#495057]" />
            <span>Date Range 15-90 Days: Weekly data, each point as the week&apos;s total from its first day.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[#495057]" />
            <span>Date Range 91-548 Days (~1.5 Years): Monthly data, each month as a single point.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[#495057]" />
            <span>Date Range &gt; 548 Days (~1.5 Years): Yearly data, each year as a single point.</span>
          </div>
        </div>
      </div>

      {/* Chart Box */}
      <div className="bg-white border border-[#dee2e6] rounded p-5 shadow-sm">
        <div className="h-[340px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
              <defs>
                <linearGradient id="legacyBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007bff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#007bff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="legacyGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#28a745" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#28a745" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
              <XAxis
                dataKey="year"
                axisLine={{ stroke: "#adb5bd" }}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6c757d" }}
                dy={8}
                label={{ value: "Time Period (Yearly)", position: "insideBottom", offset: -15, fontSize: 11, fill: "#343a40", fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6c757d" }}
                label={{ value: "Patient Count", angle: -90, position: "insideLeft", offset: 0, fontSize: 11, fill: "#343a40", fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#dee2e6",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="Overall"
                name="Overall Queue"
                stroke="#007bff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#legacyBlue)"
              />
              <Area
                type="monotone"
                dataKey="HighPriority"
                name="High Priority Action Required"
                stroke="#28a745"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#legacyGreen)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Under Chart */}
        <div className="flex items-center justify-center gap-6 mt-2 pb-1 text-xs font-bold text-[#343a40]">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#007bff] inline-block" />
            <span>-o- Overall Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#28a745] inline-block" />
            <span>-o- High Priority Required</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher Below Chart exactly like reference ([ Overall ] [ Refills ]) */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => {
            setSelectedTab("Overall");
            setCurrentPage(1);
          }}
          className={`px-5 py-2 rounded font-bold text-xs border transition-all ${
            selectedTab === "Overall"
              ? "bg-[#fff0f4] border-[#e61952] text-[#e61952] shadow-2xs"
              : "bg-white border-[#dee2e6] text-[#495057] hover:bg-[#f8f9fa]"
          }`}
        >
          Overall
        </button>
        <button
          onClick={() => {
            setSelectedTab("HighPriority");
            setCurrentPage(1);
          }}
          className={`px-5 py-2 rounded font-bold text-xs border transition-all ${
            selectedTab === "HighPriority"
              ? "bg-[#fff0f4] border-[#e61952] text-[#e61952] shadow-2xs"
              : "bg-white border-[#dee2e6] text-[#495057] hover:bg-[#f8f9fa]"
          }`}
        >
          High Priority Only
        </button>
      </div>

      {/* EXACT REFERENCE TABLE DESIGN */}
      <div className="bg-white border border-[#dee2e6] rounded-lg shadow-sm overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs divide-y divide-[#dee2e6]">
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
                  <td colSpan={10} className="py-8 text-center text-[#6c757d] italic">
                    No actionable patients match this filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#f8f9fa] transition-colors divide-x divide-[#dee2e6]/40">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleActionClick(row)}
                        className="text-[#007bff] hover:underline font-normal"
                      >
                        {row.id}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-normal text-[#212529] whitespace-nowrap">{row.name}</td>
                    <td className="py-3 px-4 text-[#495057] whitespace-nowrap">{row.contactEmail}</td>
                    <td className="py-3 px-4 text-[#212529] max-w-xs truncate">{row.reason}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          row.priority === "High"
                            ? "text-[#e61952] font-bold"
                            : row.priority === "Medium"
                            ? "text-[#856404]"
                            : "text-[#6c757d]"
                        }`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#495057] whitespace-nowrap">{row.lastVisitText}</td>
                    <td className="py-3 px-4 text-[#212529] whitespace-nowrap">{row.employer}</td>
                    <td className="py-3 px-4 text-[#212529] whitespace-nowrap">HC Clinic</td>
                    <td className="py-3 px-4 text-[#212529] whitespace-nowrap">{row.physician}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleActionClick(row)}
                        className="text-[#e61952] hover:underline font-medium"
                      >
                        {row.suggestedAction}
                      </button>
                    </td>
                  </tr>
                ))
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

      {/* Patient Action Drawer */}
      {activePatientDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl border border-[#dee2e6] w-full max-w-lg overflow-hidden">
            <div className="bg-[#343a40] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>{activePatientDrawer.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#e61952] text-white uppercase">
                    {activePatientDrawer.priority} Priority
                  </span>
                </h3>
                <p className="text-xs text-[#adb5bd] font-mono mt-0.5">
                  ID: {activePatientDrawer.id} • {activePatientDrawer.age}y • {activePatientDrawer.gender}
                </p>
              </div>
              <button
                onClick={() => setActivePatientDrawer(null)}
                className="p-1.5 rounded text-[#adb5bd] hover:text-white hover:bg-[#212529] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-[#212529]">
              <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-3.5 rounded border border-[#dee2e6]">
                <div>
                  <span className="text-[#6c757d] block mb-0.5">Employer / Group</span>
                  <span className="font-semibold text-[#212529]">{activePatientDrawer.employer}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block mb-0.5">Assigned Physician</span>
                  <span className="font-semibold text-[#212529]">{activePatientDrawer.physician}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block mb-0.5">Last Encounter</span>
                  <span className="font-semibold text-[#212529]">{activePatientDrawer.lastVisitText}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block mb-0.5">Last Outreach Attempt</span>
                  <span className="font-semibold text-[#212529]">{activePatientDrawer.lastOutreachText}</span>
                </div>
              </div>

              <div className="border border-[#ffeeba] bg-[#fff3cd] p-3.5 rounded">
                <span className="font-bold text-[#856404] block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-[#856404]" />
                  Reason for Flagging
                </span>
                <p className="text-[#856404] font-medium">{activePatientDrawer.reason}</p>
              </div>

              <div className="space-y-2 pt-1">
                <span className="font-bold text-[#212529] block">Recommended Timely Action</span>
                <div className="p-3 bg-[#fff0f4] border border-[#e61952] rounded flex items-center justify-between">
                  <span className="font-bold text-[#e61952] text-sm">{activePatientDrawer.suggestedAction}</span>
                  <span className="px-2 py-1 rounded bg-white text-[#e61952] border border-[#e61952] font-bold text-[10px] uppercase tracking-wider">
                    Ready to Execute
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] px-5 py-3.5 border-t border-[#dee2e6] flex items-center justify-end gap-3">
              <button
                onClick={() => setActivePatientDrawer(null)}
                className="px-4 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#f1f3f5] font-semibold text-[#495057] text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => executePatientAction(activePatientDrawer)}
                className="px-5 py-2 rounded bg-[#e61952] hover:bg-[#c91244] font-bold text-white text-xs shadow-sm transition-colors"
              >
                Execute Action & Log
              </button>
            </div>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
export default ClassicActionCentreDetail;
