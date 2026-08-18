import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  UserPlus,
  Building2,
  Users,
  Pill,
  X,
  Mail,
  MessageSquare,
  Clock,
  FileText,
  Calendar,
  ArrowRight,
  ExternalLink,
  Star,
} from "../../lib/icons";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_LEADS, type SPLead } from "../../data/smartypantsData";

type PipelineFilter = "all" | "Community" | "Employer" | "Referral" | "HRT";

const PIPELINES: { id: PipelineFilter; label: string; icon: React.ElementType; color: string }[] = [
  { id: "all", label: "All Pipelines", icon: Users, color: "#495057" },
  { id: "Community", label: "Community Leads", icon: UserPlus, color: "#007bff" },
  { id: "Employer", label: "Employer Leads", icon: Building2, color: "#28a745" },
  { id: "Referral", label: "Referral Partners", icon: Users, color: "#17a2b8" },
  { id: "HRT", label: "HRT Leads", icon: Pill, color: "#673ab7" },
];

const STAGES = ["New", "Contacted", "Meeting Scheduled", "Proposal", "Follow-up", "Won", "Lost"];

export function SPLeads() {
  const [pipelineFilter, setPipelineFilter] = useState<PipelineFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<SPLead | null>(null);

  const filteredLeads = useMemo(() => {
    let list = [...SP_LEADS];
    if (pipelineFilter !== "all") list = list.filter((l) => l.pipeline === pipelineFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.interest.toLowerCase().includes(q));
    }
    return list;
  }, [pipelineFilter, searchQuery]);

  const getStageBadge = (stage: string) => {
    if (stage === "New") return "bg-[#cce5ff] text-[#004085] border-[#b8daff]";
    if (stage === "Contacted") return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]";
    if (stage === "Meeting Scheduled") return "bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]";
    if (stage === "Proposal") return "bg-[#e8daef] text-[#6f42c1] border-[#d5b9e3]";
    if (stage === "Follow-up") return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]";
    if (stage === "Won") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (stage === "Lost") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#28a745";
    if (score >= 50) return "#ffc107";
    return "#dc3545";
  };

  // Pipeline counts
  const pipelineCounts = {
    Community: SP_LEADS.filter((l) => l.pipeline === "Community").length,
    Employer: SP_LEADS.filter((l) => l.pipeline === "Employer").length,
    Referral: SP_LEADS.filter((l) => l.pipeline === "Referral").length,
    HRT: SP_LEADS.filter((l) => l.pipeline === "HRT").length,
  };

  return (
    <ClassicLayout
      title="External CRM — Lead Management"
      subtitleNote="Manage non-patient leads across Community, Employer, Referral, and HRT pipelines."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Total Leads", val: SP_LEADS.length.toString() },
        { label: "Won", val: SP_LEADS.filter((l) => l.stage === "Won").length.toString() },
        { label: "Active", val: SP_LEADS.filter((l) => l.stage !== "Won" && l.stage !== "Lost").length.toString() },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Add lead form coming soon...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      }
    >
      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
        {PIPELINES.filter((p) => p.id !== "all").map((p) => {
          const Icon = p.icon;
          const count = pipelineCounts[p.id as keyof typeof pipelineCounts];
          return (
            <div
              key={p.id}
              onClick={() => setPipelineFilter(pipelineFilter === p.id ? "all" : p.id)}
              className={`bg-white border rounded shadow-2xs p-3 flex items-center gap-3 cursor-pointer transition-all ${
                pipelineFilter === p.id ? "border-[#e61952] ring-1 ring-[#e61952]/20" : "border-[#dee2e6] hover:border-[#e61952]/50"
              }`}
            >
              <div className="size-9 rounded flex items-center justify-center" style={{ backgroundColor: p.color + "15" }}>
                <Icon className="size-4" style={{ color: p.color }} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-[#212529] tabular-nums">{count}</div>
                <div className="text-[10px] text-[#6c757d] font-medium">{p.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-1">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
          />
        </div>
      </div>

      {/* Stage Pipeline Visual */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 mb-1">
        <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide mb-3">Pipeline Stages</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STAGES.map((stage, idx) => {
            const count = filteredLeads.filter((l) => l.stage === stage).length;
            return (
              <React.Fragment key={stage}>
                <div className={`flex flex-col items-center gap-1.5 min-w-[100px] p-2.5 rounded border ${count > 0 ? "border-[#dee2e6] bg-[#f8f9fa]" : "border-dashed border-[#dee2e6] bg-white"}`}>
                  <span className="text-xl font-extrabold text-[#212529] tabular-nums">{count}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStageBadge(stage)}`}>{stage}</span>
                </div>
                {idx < STAGES.length - 1 && <ArrowRight className="size-4 text-[#dee2e6] shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Lead Table + Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lead Table */}
        <div className={`${selectedLead ? "lg:col-span-2" : "lg:col-span-3"} bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Interest</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Next Follow-up</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
                {filteredLeads.length === 0 ? (
                  <tr><td colSpan={9} className="py-8 text-center text-[#6c757d] italic">No leads match the current filters.</td></tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`hover:bg-[#f8f9fa] transition-colors cursor-pointer ${selectedLead?.id === lead.id ? "bg-[#fff0f4]" : ""}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-2.5 px-3">
                        <div>
                          <span className="font-bold">{lead.name}</span>
                          <div className="text-[10px] text-[#6c757d] font-mono">{lead.id}</div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#495057]">{lead.company}</td>
                      <td className="py-2.5 px-3 text-[#495057]">{lead.source}</td>
                      <td className="py-2.5 px-3 text-[#495057]">{lead.interest}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStageBadge(lead.stage)}`}>{lead.stage}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#495057]">{lead.owner}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full" style={{ backgroundColor: getScoreColor(lead.score) }} />
                          <span className="font-bold tabular-nums">{lead.score}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-[#6c757d]">{lead.nextFollowUp}</td>
                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toast.info(`Quick action for ${lead.name}...`)} className="px-2 py-1 rounded text-[10px] font-semibold bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057] shadow-2xs">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Profile Sidebar */}
        {selectedLead && (
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#212529]">{selectedLead.name}</h3>
                <p className="text-[11px] text-[#6c757d]">{selectedLead.id} · {selectedLead.pipeline}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="size-6 rounded border border-[#dee2e6] flex items-center justify-center text-[#495057] hover:bg-[#f8f9fa]">
                <X className="size-3.5" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {[
                { label: "Company", value: selectedLead.company },
                { label: "Source", value: selectedLead.source },
                { label: "Interest", value: selectedLead.interest },
                { label: "Stage", value: selectedLead.stage },
                { label: "Owner", value: selectedLead.owner },
                { label: "Score", value: selectedLead.score.toString() },
                { label: "Last Contact", value: selectedLead.lastContact },
                { label: "Next Follow-up", value: selectedLead.nextFollowUp },
                { label: "Campaign", value: selectedLead.campaign },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span className="text-[#6c757d] font-medium">{item.label}</span>
                  <span className="font-bold text-[#212529]">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Lead Timeline */}
            <div className="mt-4 pt-3 border-t border-[#dee2e6]">
              <h4 className="text-[11px] font-bold text-[#343a40] uppercase tracking-wide mb-2">Timeline</h4>
              <div className="space-y-2">
                {[
                  { date: selectedLead.lastContact, event: "Last contact made" },
                  { date: "2026-07-20", event: "Welcome email sent" },
                  { date: "2026-07-18", event: "Lead created via " + selectedLead.source },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="w-1 h-1 rounded-full bg-[#e61952] mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#212529]">{item.event}</p>
                      <p className="text-[9px] text-[#6c757d]">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#dee2e6]">
              {[
                { label: "Email", icon: Mail, color: "#007bff" },
                { label: "Text", icon: MessageSquare, color: "#28a745" },
                { label: "Schedule", icon: Calendar, color: "#ffc107" },
                { label: "Add Note", icon: FileText, color: "#6c757d" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => toast.info(`${action.label} for ${selectedLead.name}...`)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-[10px] font-semibold text-[#495057]"
                  >
                    <Icon className="size-3" style={{ color: action.color }} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lead Automation Flow */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 mt-1">
        <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
          Lead Automation — Community Lead Nurture Sequence
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: "Website Form", sub: "Trigger", color: "#e61952" },
            { label: "Lead Created", sub: "System", color: "#495057" },
            { label: "Welcome Email", sub: "Action", color: "#007bff" },
            { label: "2 Days", sub: "Delay", color: "#6c757d" },
            { label: "Educational Email", sub: "Action", color: "#007bff" },
            { label: "5 Days", sub: "Delay", color: "#6c757d" },
            { label: "Meeting Invite", sub: "Action", color: "#28a745" },
            { label: "No Response?", sub: "Decision", color: "#ffc107" },
            { label: "Reminder", sub: "Action", color: "#dc3545" },
            { label: "Close / Continue", sub: "Exit", color: "#495057" },
          ].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[90px]">
                <div className="px-2.5 py-1.5 rounded border-2 text-center" style={{ borderColor: step.color, backgroundColor: step.color + "10" }}>
                  <div className="text-[9px] font-bold text-[#212529]">{step.label}</div>
                </div>
                <span className="text-[7px] font-semibold uppercase tracking-wider" style={{ color: step.color }}>{step.sub}</span>
              </div>
              {idx < arr.length - 1 && <ArrowRight className="size-3.5 text-[#dee2e6] shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </ClassicLayout>
  );
}
