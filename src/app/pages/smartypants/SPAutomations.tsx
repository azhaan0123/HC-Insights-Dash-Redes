import React, { useState } from "react";
import {
  Plus,
  Play,
  Pause,
  Search,
  ArrowRight,
  ArrowDown,
  Zap,
  Mail,
  MessageSquare,
  ClipboardList,
  FileText,
  Bell,
  Tag,
  Webhook,
  Users,
  Calendar,
  FlaskConical,
  CheckCircle2,
  Building2,
  UserPlus,
  Megaphone,
  AlertTriangle,
  RefreshCw,
} from "../../lib/icons";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_AUTOMATIONS, SP_EXECUTION_LOG } from "../../data/smartypantsData";

const TRIGGER_OPTIONS = [
  { label: "Patient Created", icon: UserPlus },
  { label: "Annual Exam Due", icon: Calendar },
  { label: "Lab Ordered", icon: FlaskConical },
  { label: "Visit Completed", icon: CheckCircle2 },
  { label: "Employer Added", icon: Building2 },
  { label: "Lead Created", icon: Users },
  { label: "Campaign Finished", icon: Megaphone },
  { label: "Google Sheet Updated", icon: FileText },
];

const ACTION_OPTIONS = [
  { label: "Send Email", icon: Mail, color: "#007bff" },
  { label: "Send SMS", icon: MessageSquare, color: "#28a745" },
  { label: "Assign Task", icon: ClipboardList, color: "#673ab7" },
  { label: "Notify Staff", icon: Bell, color: "#ffc107" },
  { label: "Generate Report", icon: FileText, color: "#e61952" },
  { label: "Add Tag", icon: Tag, color: "#17a2b8" },
  { label: "Remove Tag", icon: Tag, color: "#6c757d" },
  { label: "Webhook", icon: Webhook, color: "#495057" },
];

export function SPAutomations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCanvas, setShowCanvas] = useState(false);

  const filteredAutomations = searchQuery.trim()
    ? SP_AUTOMATIONS.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.trigger.toLowerCase().includes(searchQuery.toLowerCase()))
    : SP_AUTOMATIONS;

  const getStatusBadge = (status: string) => {
    if (status === "Active") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (status === "Paused") return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]";
    return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
  };

  return (
    <ClassicLayout
      title="Automation Builder"
      subtitleNote="Visual workflow builder — create and manage automated patient journeys, lead nurtures, and operational workflows."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Active Automations", val: SP_AUTOMATIONS.filter((a) => a.status === "Active").length.toString() },
        { label: "Total Executions", val: SP_AUTOMATIONS.reduce((a, b) => a + b.executions, 0).toLocaleString() },
      ]}
      headerActions={
        <button
          onClick={() => setShowCanvas(!showCanvas)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors"
        >
          <Plus className="size-3.5" />
          <span>{showCanvas ? "Close Canvas" : "New Automation"}</span>
        </button>
      }
    >
      {/* Visual Workflow Canvas */}
      {showCanvas && (
        <div className="bg-white border border-[#e61952]/30 rounded shadow-2xs p-5 mb-1">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Workflow Canvas</h3>

          {/* Canvas Flow */}
          <div className="flex flex-col items-center gap-2 py-4">
            {[
              { label: "Trigger", sub: "Select trigger event", color: "#e61952", icon: Zap },
              { label: "Condition", sub: "Filter by criteria", color: "#ffc107", icon: AlertTriangle },
              { label: "Delay", sub: "Wait period", color: "#6c757d", icon: RefreshCw },
              { label: "Action", sub: "Execute step", color: "#007bff", icon: Mail },
              { label: "Decision", sub: "Branch logic", color: "#673ab7", icon: AlertTriangle },
              { label: "Action", sub: "Execute step", color: "#28a745", icon: MessageSquare },
              { label: "Exit", sub: "End workflow", color: "#495057", icon: CheckCircle2 },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div
                  className="w-[280px] p-3 rounded-lg border-2 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
                  style={{ borderColor: step.color, backgroundColor: step.color + "08" }}
                >
                  <div className="size-9 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: step.color + "20" }}>
                    <step.icon className="size-4" style={{ color: step.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#212529]">{step.label}</div>
                    <div className="text-[10px] text-[#6c757d]">{step.sub}</div>
                  </div>
                </div>
                {idx < arr.length - 1 && <ArrowDown className="size-5 text-[#dee2e6]" />}
              </React.Fragment>
            ))}
          </div>

          {/* Trigger & Action Palettes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#dee2e6]">
            <div>
              <h4 className="text-[11px] font-bold text-[#343a40] uppercase tracking-wide mb-2">Available Triggers</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {TRIGGER_OPTIONS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.label} className="flex items-center gap-2 px-2.5 py-2 rounded border border-[#dee2e6] bg-[#f8f9fa] hover:bg-white hover:border-[#e61952]/40 cursor-pointer transition-all text-xs">
                      <Icon className="size-3.5 text-[#e61952]" />
                      <span className="font-medium text-[#343a40]">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[#343a40] uppercase tracking-wide mb-2">Available Actions</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {ACTION_OPTIONS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.label} className="flex items-center gap-2 px-2.5 py-2 rounded border border-[#dee2e6] bg-[#f8f9fa] hover:bg-white hover:border-[#e61952]/40 cursor-pointer transition-all text-xs">
                      <Icon className="size-3.5" style={{ color: a.color }} />
                      <span className="font-medium text-[#343a40]">{a.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 mb-1">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
          <input type="text" placeholder="Search automations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952]" />
        </div>
      </div>

      {/* Automations Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden mb-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3">Automation</th>
                <th className="py-2.5 px-3">Trigger</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Steps</th>
                <th className="py-2.5 px-3">Executions</th>
                <th className="py-2.5 px-3">Success Rate</th>
                <th className="py-2.5 px-3">Last Run</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {filteredAutomations.map((a) => (
                <tr key={a.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-2.5 px-3">
                    <div>
                      <span className="font-bold">{a.name}</span>
                      <div className="text-[10px] text-[#6c757d] font-mono">{a.id}</div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#495057] font-medium">{a.trigger}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(a.status)}`}>{a.status}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold tabular-nums">{a.steps}</td>
                  <td className="py-2.5 px-3 tabular-nums">{a.executions.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 bg-[#e9ecef] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#28a745]" style={{ width: `${a.successRate}%` }} />
                      </div>
                      <span className="font-semibold tabular-nums">{a.successRate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#6c757d] font-mono text-[10px]">{a.lastRun}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "Active" ? (
                        <button onClick={() => toast.info(`Pausing "${a.name}"...`)} className="size-6 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#ffc107]" title="Pause">
                          <Pause className="size-3" />
                        </button>
                      ) : (
                        <button onClick={() => toast.info(`Activating "${a.name}"...`)} className="size-6 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#28a745]" title="Activate">
                          <Play className="size-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execution Log */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#dee2e6]">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">Execution Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3">Automation</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Error</th>
                <th className="py-2.5 px-3">Retries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {SP_EXECUTION_LOG.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-[#495057]">{log.automation}</td>
                  <td className="py-2.5 px-3 font-bold">{log.patient}</td>
                  <td className="py-2.5 px-3 text-[#6c757d] font-mono text-[10px]">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${log.success ? "bg-[#d4edda] text-[#155724] border-[#c3e6cb]" : "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]"}`}>
                      {log.success ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#6c757d] text-[11px] max-w-[250px] truncate">{log.error || "—"}</td>
                  <td className="py-2.5 px-3 tabular-nums">{log.retries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClassicLayout>
  );
}
