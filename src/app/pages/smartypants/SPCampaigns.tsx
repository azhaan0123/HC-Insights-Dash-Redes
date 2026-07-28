import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Mail,
  MessageSquare,
  Zap,
  Eye,
  MousePointer,
  Reply,
  Calendar,
  Star,
  FlaskConical,
  Send,
  ExternalLink,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_CAMPAIGNS, type SPCampaign } from "../../data/smartypantsData";

type TabKey = "patient" | "lead" | "employer" | "completed" | "drafts" | "archived";

const TABS: { id: TabKey; label: string }[] = [
  { id: "patient", label: "Patient Campaigns" },
  { id: "lead", label: "Lead Campaigns" },
  { id: "employer", label: "Employer Campaigns" },
  { id: "completed", label: "Completed" },
  { id: "drafts", label: "Drafts" },
  { id: "archived", label: "Archived" },
];

export function SPCampaigns() {
  const [activeTab, setActiveTab] = useState<TabKey>("patient");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);

  const filteredCampaigns = useMemo(() => {
    let list = [...SP_CAMPAIGNS];
    if (activeTab === "patient") list = list.filter((c) => c.type === "Patient" && c.status === "Active");
    else if (activeTab === "lead") list = list.filter((c) => c.type === "Lead" && c.status !== "Archived");
    else if (activeTab === "employer") list = list.filter((c) => c.type === "Employer" && c.status !== "Archived");
    else if (activeTab === "completed") list = list.filter((c) => c.status === "Completed");
    else if (activeTab === "drafts") list = list.filter((c) => c.status === "Draft");
    else if (activeTab === "archived") list = list.filter((c) => c.status === "Archived");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, searchQuery]);

  const getStatusBadge = (status: string) => {
    if (status === "Active") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (status === "Draft") return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
    if (status === "Completed") return "bg-[#cce5ff] text-[#004085] border-[#b8daff]";
    if (status === "Archived") return "bg-[#f8f9fa] text-[#6c757d] border-[#dee2e6]";
    return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
  };

  const getChannelIcon = (channel: string) => {
    if (channel === "Email") return <Mail className="size-3 text-[#007bff]" />;
    if (channel === "SMS") return <MessageSquare className="size-3 text-[#28a745]" />;
    return <Zap className="size-3 text-[#e61952]" />;
  };

  // Summary stats
  const totalSent = SP_CAMPAIGNS.reduce((a, c) => a + c.sent, 0);
  const totalDelivered = SP_CAMPAIGNS.reduce((a, c) => a + c.delivered, 0);
  const totalOpened = SP_CAMPAIGNS.reduce((a, c) => a + c.opened, 0);
  const totalClicked = SP_CAMPAIGNS.reduce((a, c) => a + c.clicked, 0);
  const totalReplies = SP_CAMPAIGNS.reduce((a, c) => a + c.replies, 0);

  return (
    <ClassicLayout
      title="Campaign Center"
      subtitleNote="Marketing automation engine — create, manage, and analyze patient, lead, and employer campaigns."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Active Campaigns", val: SP_CAMPAIGNS.filter((c) => c.status === "Active").length.toString() },
        { label: "Total Sent", val: totalSent.toLocaleString() },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>{showBuilder ? "Close Builder" : "New Campaign"}</span>
          </button>
        </div>
      }
    >
      {/* Campaign Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-1">
        {[
          { label: "Total Sent", value: totalSent.toLocaleString(), icon: Send, color: "#007bff" },
          { label: "Delivered", value: totalDelivered.toLocaleString(), icon: Mail, color: "#28a745" },
          { label: "Opened", value: totalOpened.toLocaleString(), icon: Eye, color: "#17a2b8" },
          { label: "Clicked", value: totalClicked.toLocaleString(), icon: MousePointer, color: "#ffc107" },
          { label: "Replies", value: totalReplies.toLocaleString(), icon: Reply, color: "#6f42c1" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#dee2e6] rounded shadow-2xs p-3 flex items-center gap-3">
              <div className="size-9 rounded flex items-center justify-center" style={{ backgroundColor: stat.color + "15" }}>
                <Icon className="size-4" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-[#212529] tabular-nums">{stat.value}</div>
                <div className="text-[10px] text-[#6c757d] font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Builder Panel */}
      {showBuilder && (
        <div className="bg-white border border-[#e61952]/30 rounded shadow-2xs p-5 mb-1">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Campaign Builder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Campaign Name</label>
              <input className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]" placeholder="e.g., Annual Exam Reminder Q4" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Audience / Segment</label>
              <select className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]">
                <option>Needs Annual Exam (342 patients)</option>
                <option>Labs Outstanding (218 patients)</option>
                <option>Review Eligible (423 patients)</option>
                <option>All Active Patients (1,420)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Entry Trigger</label>
              <select className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]">
                <option>Immediate (on enrollment)</option>
                <option>Annual Exam Due Date</option>
                <option>Lab Ordered</option>
                <option>Visit Completed</option>
                <option>Manual Entry</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Channel</label>
              <select className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]">
                <option>Email</option>
                <option>SMS</option>
                <option>Multi-Channel (Email + SMS)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Delay Between Steps</label>
              <select className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]">
                <option>No delay</option>
                <option>1 day</option>
                <option>3 days</option>
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Success Goal</label>
              <select className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]">
                <option>Appointment Booked</option>
                <option>Review Submitted</option>
                <option>Lab Completed</option>
                <option>Reply Received</option>
                <option>Link Clicked</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#dee2e6]">
            <button
              onClick={() => { toast.success("Campaign saved as draft!"); setShowBuilder(false); }}
              className="px-4 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057]"
            >Save Draft</button>
            <button
              onClick={() => { toast.success("Campaign launched!"); setShowBuilder(false); }}
              className="px-4 py-2 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs"
            >Launch Campaign</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); }}
            className={`px-3.5 py-1.5 rounded text-xs transition-all cursor-pointer select-none ${
              activeTab === tab.id
                ? "border-2 border-[#e61952] bg-[#fff0f4] text-[#212529] font-bold shadow-2xs"
                : "border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] font-medium"
            }`}
          >{tab.label}</button>
        ))}
        <div className="ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952] w-52"
            />
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3">Campaign</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Audience</th>
                <th className="py-2.5 px-3">Sent</th>
                <th className="py-2.5 px-3">Delivered</th>
                <th className="py-2.5 px-3">Opened</th>
                <th className="py-2.5 px-3">Clicked</th>
                <th className="py-2.5 px-3">Replies</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {filteredCampaigns.length === 0 ? (
                <tr><td colSpan={12} className="py-8 text-center text-[#6c757d] italic">No campaigns found for this tab.</td></tr>
              ) : (
                filteredCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-2.5 px-3">
                      <div>
                        <span className="font-bold text-[#212529]">{c.name}</span>
                        <div className="text-[10px] text-[#6c757d] font-mono">{c.id}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#495057]">{c.type}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        {getChannelIcon(c.channel)}
                        <span className="text-[11px]">{c.channel}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(c.status)}`}>{c.status}</span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-semibold">{c.audience.toLocaleString()}</td>
                    <td className="py-2.5 px-3 tabular-nums">{c.sent.toLocaleString()}</td>
                    <td className="py-2.5 px-3 tabular-nums">{c.delivered.toLocaleString()}</td>
                    <td className="py-2.5 px-3 tabular-nums">{c.opened.toLocaleString()}</td>
                    <td className="py-2.5 px-3 tabular-nums">{c.clicked.toLocaleString()}</td>
                    <td className="py-2.5 px-3 tabular-nums">{c.replies.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#6c757d] font-mono text-[10px]">{c.createdAt}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => toast.info(`Viewing analytics for "${c.name}"...`)}
                        className="px-2.5 py-1 rounded text-[10px] font-semibold bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057] shadow-2xs"
                      >View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ClassicLayout>
  );
}
