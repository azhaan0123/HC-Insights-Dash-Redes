import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  UserCheck,
  Bell,
  Pause,
  Trash2,
  Calendar,
  FlaskConical,
  Clock,
  Pill,
  ShieldCheck,
  Star,
  ArrowRight,
  Building2,
  AlertTriangle,
  ArrowDown,
  Mail,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_TASKS, type SPTask } from "../../data/smartypantsData";

const REMINDER_TYPES = ["All Types", "Annual Exam", "Lab Due", "6 Month Follow-up", "Medication", "Vaccination", "Review Request", "Referral Follow-up", "Employer Renewal"];
const PRIORITIES = ["All Priorities", "High", "Medium", "Low"];
const STATUSES = ["All Statuses", "Pending", "In Progress", "Completed", "Overdue", "Escalated"];

export function SPTasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredTasks = useMemo(() => {
    let list = [...SP_TASKS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.patient.toLowerCase().includes(q) || t.reminderType.toLowerCase().includes(q) || t.assignedStaff.toLowerCase().includes(q));
    }
    if (typeFilter !== "All Types") list = list.filter((t) => t.reminderType === typeFilter);
    if (priorityFilter !== "All Priorities") list = list.filter((t) => t.priority === priorityFilter);
    if (statusFilter !== "All Statuses") list = list.filter((t) => t.status === statusFilter);
    return list;
  }, [searchQuery, typeFilter, priorityFilter, statusFilter]);

  const totalRecords = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));
  const paginatedRows = filteredTasks.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedTasks.size === paginatedRows.length) setSelectedTasks(new Set());
    else setSelectedTasks(new Set(paginatedRows.map((t) => t.id)));
  };

  const getPriorityBadge = (p: string) => {
    if (p === "High") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    if (p === "Medium") return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]";
    return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
  };

  const getStatusBadge = (s: string) => {
    if (s === "Completed") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (s === "In Progress") return "bg-[#cce5ff] text-[#004085] border-[#b8daff]";
    if (s === "Pending") return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
    if (s === "Overdue") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    if (s === "Escalated") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
  };

  // Summary counts
  const pendingCount = SP_TASKS.filter((t) => t.status === "Pending").length;
  const overdueCount = SP_TASKS.filter((t) => t.status === "Overdue" || t.status === "Escalated").length;
  const inProgressCount = SP_TASKS.filter((t) => t.status === "In Progress").length;
  const completedCount = SP_TASKS.filter((t) => t.status === "Completed").length;

  return (
    <ClassicLayout
      title="Task & Reminder Engine"
      subtitleNote="Automatically create and manage operational tasks and patient reminders."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Total Tasks", val: SP_TASKS.length.toString() },
        { label: "Overdue", val: overdueCount.toString() },
      ]}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
        {[
          { label: "Pending", count: pendingCount, color: "#6c757d", icon: Clock },
          { label: "In Progress", count: inProgressCount, color: "#007bff", icon: ClipboardList },
          { label: "Overdue / Escalated", count: overdueCount, color: "#dc3545", icon: AlertTriangle },
          { label: "Completed", count: completedCount, color: "#28a745", icon: CheckCircle2 },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-[#dee2e6] rounded shadow-2xs p-3 flex items-center gap-3">
              <div className="size-9 rounded flex items-center justify-center" style={{ backgroundColor: card.color + "15" }}>
                <Icon className="size-4" style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#212529] tabular-nums">{card.count}</div>
                <div className="text-[10px] text-[#6c757d] font-medium">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Automation Logic Visualization */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 mb-1">
        <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
          Automation Logic — Annual Exam Reminder Sequence
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: "Annual Exam Due", sub: "Trigger", color: "#e61952" },
            { label: "90 Days Before", sub: "Timing", color: "#6c757d" },
            { label: "Email Sent", sub: "Action", color: "#007bff" },
            { label: "7 Days Later", sub: "Delay", color: "#6c757d" },
            { label: "Text Sent", sub: "Action", color: "#28a745" },
            { label: "14 Days Later", sub: "Delay", color: "#6c757d" },
            { label: "Staff Task Created", sub: "Action", color: "#673ab7" },
            { label: "30 Days Later", sub: "Delay", color: "#6c757d" },
            { label: "Final Reminder", sub: "Action", color: "#dc3545" },
          ].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[100px]">
                <div
                  className="px-3 py-2 rounded border-2 text-center"
                  style={{ borderColor: step.color, backgroundColor: step.color + "10" }}
                >
                  <div className="text-[10px] font-bold text-[#212529]">{step.label}</div>
                </div>
                <span className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: step.color }}>{step.sub}</span>
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight className="size-4 text-[#dee2e6] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <div className="relative flex-1 min-w-[200px] max-w-[280px]">
          <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
          <input
            type="text"
            placeholder="Search patient, type, staff..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-8 pr-3 py-1.5 w-full rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
          />
        </div>
        {[
          { value: typeFilter, setter: setTypeFilter, options: REMINDER_TYPES },
          { value: priorityFilter, setter: setPriorityFilter, options: PRIORITIES },
          { value: statusFilter, setter: setStatusFilter, options: STATUSES },
        ].map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => { filter.setter(e.target.value); setCurrentPage(1); }}
            className="px-2 py-1.5 rounded border border-[#dee2e6] bg-white text-xs font-medium text-[#212529] focus:outline-none focus:border-[#e61952]"
          >
            {filter.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}

        {selectedTasks.size > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] text-[#6c757d] font-medium">{selectedTasks.size} selected</span>
            {[
              { label: "Complete", icon: CheckCircle2, color: "#28a745" },
              { label: "Reassign", icon: UserCheck, color: "#007bff" },
              { label: "Send Reminder", icon: Bell, color: "#ffc107" },
              { label: "Pause", icon: Pause, color: "#6c757d" },
              { label: "Delete", icon: Trash2, color: "#dc3545" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => toast.info(`Bulk ${action.label.toLowerCase()} for ${selectedTasks.size} tasks...`)}
                  className="flex items-center gap-1 px-2 py-1 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-[10px] font-semibold text-[#495057]"
                  title={action.label}
                >
                  <Icon className="size-3" style={{ color: action.color }} />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Queue Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3 w-8">
                  <input type="checkbox" checked={selectedTasks.size === paginatedRows.length && paginatedRows.length > 0} onChange={toggleAll} className="accent-[#e61952]" />
                </th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Reminder Type</th>
                <th className="py-2.5 px-3">Assigned Staff</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Comm Sent</th>
                <th className="py-2.5 px-3">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {paginatedRows.length === 0 ? (
                <tr><td colSpan={9} className="py-8 text-center text-[#6c757d] italic">No tasks match the current filters.</td></tr>
              ) : (
                paginatedRows.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-2.5 px-3">
                      <input type="checkbox" checked={selectedTasks.has(t.id)} onChange={() => toggleTask(t.id)} className="accent-[#e61952]" />
                    </td>
                    <td className="py-2.5 px-3">
                      <div>
                        <span className="font-bold">{t.patient}</span>
                        <div className="text-[10px] text-[#6c757d] font-mono">{t.patientId}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#495057]">{t.reminderType}</td>
                    <td className="py-2.5 px-3 text-[#495057]">{t.assignedStaff}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-[#6c757d]">{t.dueDate}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getPriorityBadge(t.priority)}`}>{t.priority}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {t.commSent ? (
                        <span className="text-[#28a745] font-bold flex items-center gap-0.5"><CheckCircle2 className="size-3" /> Yes</span>
                      ) : (
                        <span className="text-[#6c757d]">No</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-[#e9ecef] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${t.completion}%`,
                              backgroundColor: t.completion === 100 ? "#28a745" : t.completion > 0 ? "#007bff" : "#dee2e6",
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold tabular-nums">{t.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-4 py-3 flex items-center justify-between text-xs text-[#495057]">
          <span>
            Showing {totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} tasks
          </span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            <span className="px-3 py-1 font-semibold">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </ClassicLayout>
  );
}
