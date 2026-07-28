import React, { useState, useMemo } from "react";
import {
  Search,
  Mail,
  MessageSquare,
  Reply,
  XCircle,
  FileText,
  Eye,
  MousePointer,
  Calendar,
  Send,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_MESSAGES, SP_TEMPLATES, type SPMessage, type SPTemplate } from "../../data/smartypantsData";

type TabKey = "email" | "sms" | "replies" | "failed" | "templates";

const TABS: { id: TabKey; label: string; icon: React.ElementType }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "replies", label: "Campaign Replies", icon: Reply },
  { id: "failed", label: "Failed Messages", icon: XCircle },
  { id: "templates", label: "Templates", icon: FileText },
];

export function SPCommunications() {
  const [activeTab, setActiveTab] = useState<TabKey>("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<SPMessage | null>(null);

  const filteredMessages = useMemo(() => {
    let list = [...SP_MESSAGES];
    if (activeTab === "email") list = list.filter((m) => m.channel === "Email");
    else if (activeTab === "sms") list = list.filter((m) => m.channel === "SMS");
    else if (activeTab === "replies") list = list.filter((m) => m.direction === "Inbound" || m.status === "Replied");
    else if (activeTab === "failed") list = list.filter((m) => m.status === "Failed" || m.status === "Bounced");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => m.patient.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, searchQuery]);

  const getStatusBadge = (s: string) => {
    if (s === "Delivered") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (s === "Opened") return "bg-[#cce5ff] text-[#004085] border-[#b8daff]";
    if (s === "Replied") return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
    if (s === "Failed") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    if (s === "Bounced") return "bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]";
    return "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]";
  };

  // Metrics
  const totalEmails = SP_MESSAGES.filter((m) => m.channel === "Email").length;
  const totalSMS = SP_MESSAGES.filter((m) => m.channel === "SMS").length;
  const deliveredCount = SP_MESSAGES.filter((m) => m.status !== "Failed" && m.status !== "Bounced").length;
  const openedCount = SP_MESSAGES.filter((m) => m.status === "Opened" || m.status === "Replied").length;
  const repliedCount = SP_MESSAGES.filter((m) => m.status === "Replied" || m.direction === "Inbound").length;

  return (
    <ClassicLayout
      title="Communications Center"
      subtitleNote="Unified inbox for all patient communications — email, SMS, campaign replies, and templates."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Total Messages", val: SP_MESSAGES.length.toString() },
        { label: "Today", val: "July 28, 2026" },
      ]}
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-1">
        {[
          { label: "Delivery Rate", value: `${Math.round((deliveredCount / SP_MESSAGES.length) * 100)}%`, icon: Send, color: "#28a745" },
          { label: "Open Rate", value: `${Math.round((openedCount / SP_MESSAGES.length) * 100)}%`, icon: Eye, color: "#17a2b8" },
          { label: "Reply Rate", value: `${Math.round((repliedCount / SP_MESSAGES.length) * 100)}%`, icon: Reply, color: "#6f42c1" },
          { label: "Click Rate", value: "12.4%", icon: MousePointer, color: "#ffc107" },
          { label: "Appts Generated", value: "18", icon: Calendar, color: "#e61952" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#dee2e6] rounded shadow-2xs p-3 flex items-center gap-2.5">
              <div className="size-8 rounded flex items-center justify-center" style={{ backgroundColor: stat.color + "15" }}>
                <Icon className="size-3.5" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#212529] tabular-nums">{stat.value}</div>
                <div className="text-[10px] text-[#6c757d] font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center gap-1.5 mb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedMessage(null); }}
              className={`px-3 py-1.5 rounded text-xs transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-2 border-[#e61952] bg-[#fff0f4] text-[#212529] font-bold shadow-2xs"
                  : "border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] font-medium"
              }`}
            >
              <Icon className="size-3" />
              {tab.label}
            </button>
          );
        })}
        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952] w-52"
          />
        </div>
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" ? (
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                  <th className="py-2.5 px-3">Template Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Times Used</th>
                  <th className="py-2.5 px-3">Last Used</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
                {SP_TEMPLATES.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-2.5 px-3 font-bold">{tpl.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#e9ecef] text-[#495057] text-[10px] font-semibold border border-[#dee2e6]">{tpl.category}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="flex items-center gap-1">
                        {tpl.channel === "Email" ? <Mail className="size-3 text-[#007bff]" /> : <MessageSquare className="size-3 text-[#28a745]" />}
                        <span className="text-[11px]">{tpl.channel}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#495057] max-w-[250px] truncate">{tpl.subject}</td>
                    <td className="py-2.5 px-3 tabular-nums font-semibold">{tpl.timesUsed.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#6c757d] font-mono text-[10px]">{tpl.lastUsed}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button onClick={() => toast.info(`Editing template "${tpl.name}"...`)} className="px-2.5 py-1 rounded text-[10px] font-semibold bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057] shadow-2xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Messages List + Conversation View */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Message List */}
          <div className="lg:col-span-2 bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden flex flex-col max-h-[600px]">
            <div className="overflow-y-auto divide-y divide-[#dee2e6]">
              {filteredMessages.length === 0 ? (
                <div className="py-8 text-center text-[#6c757d] italic text-xs">No messages found.</div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      selectedMessage?.id === msg.id ? "bg-[#fff0f4] border-l-2 border-[#e61952]" : "hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#212529]">{msg.patient}</span>
                      <span className={`px-1 py-0.5 rounded text-[8px] font-bold border ${getStatusBadge(msg.status)}`}>{msg.status}</span>
                    </div>
                    <div className="text-[11px] font-medium text-[#343a40]">{msg.subject !== "—" ? msg.subject : "(SMS)"}</div>
                    <div className="text-[10px] text-[#6c757d] truncate mt-0.5">{msg.preview}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[9px] text-[#6c757d]">
                      {msg.channel === "Email" ? <Mail className="size-2.5" /> : <MessageSquare className="size-2.5" />}
                      <span>{msg.channel}</span>
                      <span>·</span>
                      <span>{msg.direction}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div className="lg:col-span-3 bg-white border border-[#dee2e6] rounded shadow-2xs p-5 flex flex-col min-h-[400px]">
            {selectedMessage ? (
              <>
                <div className="pb-3 border-b border-[#dee2e6] mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#212529]">{selectedMessage.patient}</h3>
                      <p className="text-[11px] text-[#6c757d]">{selectedMessage.patientId} · {selectedMessage.channel} · {selectedMessage.direction}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(selectedMessage.status)}`}>{selectedMessage.status}</span>
                  </div>
                </div>
                {selectedMessage.subject !== "—" && (
                  <div className="text-xs font-bold text-[#343a40] mb-2">Subject: {selectedMessage.subject}</div>
                )}
                <div className="flex-1 bg-[#f8f9fa] border border-[#dee2e6] rounded p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`size-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                      selectedMessage.direction === "Outbound" ? "bg-[#e61952]" : "bg-[#007bff]"
                    }`}>
                      {selectedMessage.direction === "Outbound" ? "SP" : selectedMessage.patient.charAt(0)}
                    </div>
                    <span className="text-[11px] font-semibold text-[#212529]">
                      {selectedMessage.direction === "Outbound" ? "SmartyPants Medicine" : selectedMessage.patient}
                    </span>
                    <span className="text-[10px] text-[#6c757d] ml-auto">{selectedMessage.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#495057] leading-relaxed">{selectedMessage.preview}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast.info("Reply feature coming soon...")} className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs">
                    <Reply className="size-3" /> Reply
                  </button>
                  <button onClick={() => toast.info("Forwarding...")} className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057]">
                    <Send className="size-3 text-[#6c757d]" /> Forward
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Mail className="size-10 text-[#dee2e6] mb-3" />
                <p className="text-sm text-[#6c757d] font-medium">Select a message to view</p>
                <p className="text-xs text-[#adb5bd] mt-1">Click on any message from the list to view its full content.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
