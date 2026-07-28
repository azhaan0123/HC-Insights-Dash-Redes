import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Mail,
  MessageSquare,
  Clock,
  Megaphone,
  UserPlus,
  ClipboardList,
  CheckCircle2,
  X,
  ChevronDown,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_PATIENTS, type SPPatient } from "../../data/smartypantsData";

const PROVIDERS = ["All Providers", "Dr. Josh Umbehr", "Dr. Lisa Dang"];
const EMPLOYERS = ["All Employers", "Apex Technologies", "Pinnacle Corp", "Atlas Group", "Horizon Medical"];
const RISK_LEVELS = ["All Risk", "High (7-10)", "Medium (4-6)", "Low (1-3)"];
const EXAM_STATUSES = ["All Statuses", "Complete", "Due", "Overdue"];

export function SPInternalCRM() {
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("All Providers");
  const [employerFilter, setEmployerFilter] = useState("All Employers");
  const [riskFilter, setRiskFilter] = useState("All Risk");
  const [examFilter, setExamFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState<SPPatient | null>(null);
  const [drawerTab, setDrawerTab] = useState<"summary" | "timeline" | "comms">("summary");

  const filteredPatients = useMemo(() => {
    let list = [...SP_PATIENTS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q) ||
          p.diseaseTags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (providerFilter !== "All Providers") list = list.filter((p) => p.provider === providerFilter);
    if (employerFilter !== "All Employers") list = list.filter((p) => p.employer === employerFilter);
    if (riskFilter === "High (7-10)") list = list.filter((p) => p.riskScore >= 7);
    else if (riskFilter === "Medium (4-6)") list = list.filter((p) => p.riskScore >= 4 && p.riskScore <= 6);
    else if (riskFilter === "Low (1-3)") list = list.filter((p) => p.riskScore <= 3);
    if (examFilter !== "All Statuses") list = list.filter((p) => p.annualExam === examFilter);
    return list;
  }, [searchQuery, providerFilter, employerFilter, riskFilter, examFilter]);

  const totalRecords = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredPatients.slice(start, start + recordsPerPage);
  }, [filteredPatients, currentPage, recordsPerPage]);

  const getStatusBadge = (status: string) => {
    if (status === "Complete") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (status === "Due") return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]";
    if (status === "Overdue") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    if (status === "Submitted") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (status === "Requested") return "bg-[#cce5ff] text-[#004085] border-[#b8daff]";
    if (status === "None") return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
    if (status === "Active") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (status === "Unresponsive") return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]";
    if (status === "Opted Out") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return "text-[#dc3545] font-extrabold";
    if (score >= 4) return "text-[#ffc107] font-bold";
    return "text-[#28a745] font-bold";
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "#28a745";
    if (score >= 50) return "#ffc107";
    return "#dc3545";
  };

  return (
    <ClassicLayout
      title="Internal CRM — Patient Management"
      subtitleNote="Complete CRM for all active patients. Click any row to view patient profile."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Practice", val: "SmartyPants Medicine" },
        { label: "Total Patients", val: SP_PATIENTS.length.toString() },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Exporting patient data to CSV...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs transition-colors"
          >
            <Download className="size-3.5 text-[#6c757d]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => toast.info("Import patient wizard coming soon...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <UserPlus className="size-3.5" />
            <span>Import Patients</span>
          </button>
        </div>
      }
    >
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
          <input
            type="text"
            placeholder="Search patient, ID, email, disease..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-8 pr-3 py-1.5 w-full rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
          />
        </div>
        {[
          { value: providerFilter, setter: setProviderFilter, options: PROVIDERS },
          { value: employerFilter, setter: setEmployerFilter, options: EMPLOYERS },
          { value: riskFilter, setter: setRiskFilter, options: RISK_LEVELS },
          { value: examFilter, setter: setExamFilter, options: EXAM_STATUSES },
        ].map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => { filter.setter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 rounded border border-[#dee2e6] bg-white text-xs font-medium text-[#212529] focus:outline-none focus:border-[#e61952]"
          >
            {filter.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-2.5">ID</th>
                <th className="py-2.5 px-2.5">Name</th>
                <th className="py-2.5 px-2.5">Employer</th>
                <th className="py-2.5 px-2.5">Age</th>
                <th className="py-2.5 px-2.5">Gender</th>
                <th className="py-2.5 px-2.5">Provider</th>
                <th className="py-2.5 px-2.5">Last Visit</th>
                <th className="py-2.5 px-2.5">Annual Exam</th>
                <th className="py-2.5 px-2.5">Lab Status</th>
                <th className="py-2.5 px-2.5">Review</th>
                <th className="py-2.5 px-2.5">Risk</th>
                <th className="py-2.5 px-2.5">Engage</th>
                <th className="py-2.5 px-2.5">Disease Tags</th>
                <th className="py-2.5 px-2.5">Comm Status</th>
                <th className="py-2.5 px-2.5">Contact</th>
                <th className="py-2.5 px-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-[11px] text-[#212529]">
              {paginatedRows.length === 0 ? (
                <tr><td colSpan={16} className="py-8 text-center text-[#6c757d] italic">No patients match the current filters.</td></tr>
              ) : (
                paginatedRows.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                    onClick={() => { setSelectedPatient(p); setDrawerTab("summary"); }}
                  >
                    <td className="py-2.5 px-2.5 font-mono text-[#007bff] font-medium">{p.id}</td>
                    <td className="py-2.5 px-2.5 font-bold text-[#212529]">{p.name}</td>
                    <td className="py-2.5 px-2.5">{p.employer}</td>
                    <td className="py-2.5 px-2.5 tabular-nums">{p.age}</td>
                    <td className="py-2.5 px-2.5">{p.gender}</td>
                    <td className="py-2.5 px-2.5 text-[#495057]">{p.provider}</td>
                    <td className="py-2.5 px-2.5 font-mono text-[10px] text-[#6c757d]">{p.lastVisit}</td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(p.annualExam)}`}>{p.annualExam}</span>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(p.labStatus)}`}>{p.labStatus}</span>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(p.reviewStatus)}`}>{p.reviewStatus}</span>
                    </td>
                    <td className={`py-2.5 px-2.5 tabular-nums ${getRiskColor(p.riskScore)}`}>{p.riskScore}</td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-1.5 bg-[#e9ecef] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.engagementScore}%`, backgroundColor: getEngagementColor(p.engagementScore) }} />
                        </div>
                        <span className="tabular-nums font-semibold text-[10px]">{p.engagementScore}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex flex-wrap gap-0.5">
                        {p.diseaseTags.length === 0 ? (
                          <span className="text-[#6c757d]">—</span>
                        ) : (
                          p.diseaseTags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-1 py-0.5 rounded bg-[#e9ecef] text-[#495057] text-[8px] font-medium">{tag}</span>
                          ))
                        )}
                        {p.diseaseTags.length > 2 && (
                          <span className="px-1 py-0.5 rounded bg-[#e9ecef] text-[#495057] text-[8px] font-bold">+{p.diseaseTags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(p.commStatus)}`}>{p.commStatus}</span>
                    </td>
                    <td className="py-2.5 px-2.5 text-[#6c757d]">{p.preferredContact}</td>
                    <td className="py-2.5 px-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toast.info(`Sending email to ${p.name}...`)} className="size-6 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#007bff]" title="Send Email">
                          <Mail className="size-3" />
                        </button>
                        <button onClick={() => toast.info(`Sending text to ${p.name}...`)} className="size-6 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#28a745]" title="Send Text">
                          <MessageSquare className="size-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#495057]">
          <div>
            Showing <span className="font-semibold">{totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * recordsPerPage, totalRecords)}</span> of{" "}
            <span className="font-semibold">{totalRecords}</span> patients
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={recordsPerPage}
                onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold text-[#212529] focus:outline-none focus:border-[#e61952]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed"
              >Previous</button>
              <span className="px-3 py-1 font-semibold">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed"
              >Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Patient Profile Drawer ── */}
      {selectedPatient && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[90]" onClick={() => setSelectedPatient(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white shadow-xl z-[100] flex flex-col overflow-hidden border-l border-[#dee2e6]">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-[#dee2e6] flex items-center justify-between bg-[#f8f9fa]">
              <div>
                <h3 className="text-sm font-bold text-[#212529]">{selectedPatient.name}</h3>
                <p className="text-[11px] text-[#6c757d]">{selectedPatient.id} · {selectedPatient.employer} · {selectedPatient.provider}</p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="size-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057]">
                <X className="size-4" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-[#dee2e6]">
              {[
                { id: "summary" as const, label: "Summary" },
                { id: "timeline" as const, label: "Timeline" },
                { id: "comms" as const, label: "Communications" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerTab(tab.id)}
                  className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
                    drawerTab === tab.id
                      ? "text-[#e61952] border-b-2 border-[#e61952]"
                      : "text-[#6c757d] hover:text-[#212529]"
                  }`}
                >{tab.label}</button>
              ))}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {drawerTab === "summary" && (
                <div className="space-y-4">
                  {/* Patient Summary Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Age", value: `${selectedPatient.age} yrs (${selectedPatient.gender})` },
                      { label: "Risk Score", value: selectedPatient.riskScore.toString() },
                      { label: "Engagement", value: `${selectedPatient.engagementScore}%` },
                      { label: "Annual Exam", value: selectedPatient.annualExam },
                      { label: "Lab Status", value: selectedPatient.labStatus },
                      { label: "Last Visit", value: selectedPatient.lastVisit },
                      { label: "Next Appt", value: selectedPatient.nextAppt },
                      { label: "Preferred Contact", value: selectedPatient.preferredContact },
                    ].map((item) => (
                      <div key={item.label} className="p-2.5 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                        <div className="text-[10px] text-[#6c757d] font-medium">{item.label}</div>
                        <div className="text-xs font-bold text-[#212529] mt-0.5">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Disease Tags */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#343a40] uppercase tracking-wide mb-2">Disease Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.diseaseTags.length === 0 ? (
                        <span className="text-xs text-[#6c757d] italic">No disease tags</span>
                      ) : (
                        selectedPatient.diseaseTags.map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded bg-[#e9ecef] text-[#495057] text-[11px] font-medium border border-[#dee2e6]">{tag}</span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#343a40] uppercase tracking-wide mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#212529]">
                        <Mail className="size-3.5 text-[#6c757d]" />
                        <span>{selectedPatient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#212529]">
                        <MessageSquare className="size-3.5 text-[#6c757d]" />
                        <span>{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6c757d]">
                        <Clock className="size-3.5" />
                        <span>Last outreach: {selectedPatient.lastOutreach}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === "timeline" && (
                <div className="space-y-3">
                  {[
                    { date: selectedPatient.lastVisit, event: "Office Visit — Annual Checkup", type: "visit" },
                    { date: selectedPatient.lastOutreach, event: "Email sent — Lab Reminder", type: "comm" },
                    { date: "2026-06-01", event: "Enrolled in Annual Exam Reminder campaign", type: "campaign" },
                    { date: "2026-05-15", event: "Lab results reviewed by provider", type: "clinical" },
                    { date: "2026-04-20", event: "Prescription refill completed", type: "clinical" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e61952] mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[#212529]">{item.event}</p>
                        <p className="text-[10px] text-[#6c757d] mt-0.5">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === "comms" && (
                <div className="space-y-3">
                  <p className="text-xs text-[#6c757d] italic">Communication history for {selectedPatient.name}</p>
                  {[
                    { type: "Email", subject: "Annual Exam Reminder", date: selectedPatient.lastOutreach, status: "Opened" },
                    { type: "SMS", subject: "Lab follow-up", date: "2026-07-10", status: "Delivered" },
                    { type: "Email", subject: "Monthly Newsletter", date: "2026-07-01", status: "Opened" },
                    { type: "Email", subject: "Welcome to SmartyPants Medicine", date: "2026-01-15", status: "Opened" },
                  ].map((msg, idx) => (
                    <div key={idx} className="p-3 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#212529]">{msg.subject}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(msg.status)}`}>{msg.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#6c757d]">
                        <span className="font-medium">{msg.type}</span>
                        <span>·</span>
                        <span>{msg.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Actions */}
            <div className="px-5 py-3 border-t border-[#dee2e6] bg-[#f8f9fa] flex flex-wrap gap-2">
              {[
                { label: "Send Email", icon: Mail, color: "#007bff" },
                { label: "Send Text", icon: MessageSquare, color: "#28a745" },
                { label: "Schedule Reminder", icon: Clock, color: "#ffc107" },
                { label: "Enroll Campaign", icon: Megaphone, color: "#e61952" },
                { label: "Create Task", icon: ClipboardList, color: "#673ab7" },
                { label: "Mark Complete", icon: CheckCircle2, color: "#28a745" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => toast.info(`${action.label} for ${selectedPatient.name}...`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-[10px] font-semibold text-[#495057] shadow-2xs transition-colors"
                  >
                    <Icon className="size-3" style={{ color: action.color }} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </ClassicLayout>
  );
}
