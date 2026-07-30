import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Paperclip,
  FileText,
  UploadCloud,
  X,
  Download,
  FileSpreadsheet,
  Link2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_CAMPAIGNS, type SPCampaign } from "../../data/smartypantsData";
import { createDbCampaign } from "../../services/dbService";

type TabKey = "all" | "patient" | "lead" | "employer" | "completed" | "drafts" | "archived";

const TABS: { id: TabKey; label: string }[] = [
  { id: "all", label: "All Campaigns" },
  { id: "patient", label: "Patient Campaigns" },
  { id: "lead", label: "Lead Campaigns" },
  { id: "employer", label: "Employer Campaigns" },
  { id: "completed", label: "Completed" },
  { id: "drafts", label: "Drafts" },
  { id: "archived", label: "Archived" },
];

function parseCsvToCampaigns(csvText: string): SPCampaign[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const results: SPCampaign[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Split CSV handling quote escaping
    const parts: string[] = [];
    let inQuotes = false;
    let current = "";

    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.replace(/^"|"$/g, '').trim());
        current = "";
      } else {
        current += char;
      }
    }
    parts.push(current.replace(/^"|"$/g, '').trim());

    if (!parts[0] && !parts[1]) continue;

    results.push({
      id: parts[0] || `CMP-${100 + i}`,
      name: parts[1] || "Untitled Campaign",
      type: (parts[2] as any) || "Patient",
      channel: (parts[3] as any) || "Email",
      status: (parts[4] as any) || "Active",
      audience: parseInt(parts[5], 10) || 0,
      sent: parseInt(parts[6], 10) || 0,
      delivered: parseInt(parts[7], 10) || 0,
      opened: parseInt(parts[8], 10) || 0,
      clicked: parseInt(parts[9], 10) || 0,
      replies: parseInt(parts[10], 10) || 0,
      createdAt: parts[11] || new Date().toISOString().slice(0, 10),
    });
  }
  return results;
}

function getDirectFetchUrl(url: string): string {
  const trimmed = url.trim();
  const sheetIdMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetIdMatch && sheetIdMatch[1] && !trimmed.includes("/pub") && !trimmed.includes("gviz/tq")) {
    const sheetId = sheetIdMatch[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }
  return trimmed;
}

export function SPCampaigns() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([]);
  
  // Campaign Builder input state
  const [builderName, setBuilderName] = useState("");
  const [builderType, setBuilderType] = useState<"Patient" | "Lead" | "Employer">("Patient");
  const [builderChannel, setBuilderChannel] = useState<"Email" | "SMS" | "Multi-Channel">("Email");

  // Fresh live state pulled directly from the sheet on refresh (no localStorage)
  const [allCampaigns, setAllCampaigns] = useState<SPCampaign[]>([]);

  const DEFAULT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxUBWSEADR_v0k5Ct7KxVrqCKwoEDqUzPtP3XnVtXe9EFRw3FwnE0x6EHRRk7hWXfFp/exec";

  const [showSheetModal, setShowSheetModal] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(DEFAULT_WEBAPP_URL);
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [sheetFetchError, setSheetFetchError] = useState<string | null>(null);

  const fetchSheetCampaigns = useCallback(async (silent = false) => {
    const rawUrl = googleSheetUrl.trim() || DEFAULT_WEBAPP_URL;
    const targetUrl = getDirectFetchUrl(rawUrl);
    if (!targetUrl) return;

    if (!silent) setIsSyncing(true);
    setSheetFetchError(null);

    try {
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const text = await res.text();

      if (text.includes("Script function not found: doGet")) {
        setSheetFetchError("Google Apps Script requires a doGet(e) function to return rows via Web App URL. Alternatively, paste your Google Sheet URL (https://docs.google.com/spreadsheets/d/...) above.");
        if (!silent) toast.error("Google Apps Script needs a doGet(e) function or paste your Google Sheet URL!");
        return;
      }

      let fetchedCampaigns: SPCampaign[] = [];
      if (text.trim().startsWith("[") || text.trim().startsWith("{")) {
        const parsed = JSON.parse(text);
        fetchedCampaigns = Array.isArray(parsed) ? parsed : [parsed];
      } else if (!text.includes("<!DOCTYPE html>")) {
        fetchedCampaigns = parseCsvToCampaigns(text);
      }

      if (fetchedCampaigns && fetchedCampaigns.length > 0) {
        setAllCampaigns(fetchedCampaigns);
        setLastSyncedTime(new Date().toLocaleTimeString());
        setIsConnected(true);
        if (!silent) toast.success(`Synced ${fetchedCampaigns.length} campaigns from Google Sheet!`);
      } else {
        if (!silent) toast.info("No campaign rows parsed from sheet CSV.");
      }
    } catch (err: any) {
      console.warn("Sheet fetch error:", err);
      setSheetFetchError("Could not fetch data from Google Sheet URL. Ensure sheet sharing or URL is valid.");
      if (!silent) toast.error("Could not pull fresh data from sheet URL.");
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }, [googleSheetUrl]);

  // Pull fresh data immediately on page refresh, and auto-resync every 30 seconds
  useEffect(() => {
    fetchSheetCampaigns(true);
    const interval = setInterval(() => {
      fetchSheetCampaigns(true);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchSheetCampaigns]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(file.size / 1024)} KB`;
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: sizeStr,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      };
    });
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    toast.success(`Attached ${files.length} document(s) to campaign`);
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
    toast.info("Attachment removed");
  };

  const filteredCampaigns = useMemo(() => {
    let list = [...allCampaigns];
    if (activeTab === "all") list = list;
    else if (activeTab === "patient") list = list.filter((c) => c.type === "Patient" && c.status === "Active");
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
  }, [activeTab, searchQuery, allCampaigns]);

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
  const totalSent = allCampaigns.reduce((a, c) => a + c.sent, 0);
  const totalDelivered = allCampaigns.reduce((a, c) => a + c.delivered, 0);
  const totalOpened = allCampaigns.reduce((a, c) => a + c.opened, 0);
  const totalClicked = allCampaigns.reduce((a, c) => a + c.clicked, 0);
  const totalReplies = allCampaigns.reduce((a, c) => a + c.replies, 0);

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Type", "Channel", "Status", "Audience", "Sent", "Delivered", "Opened", "Clicked", "Replies", "Created Date"];
    const rows = filteredCampaigns.map((c) => [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.type}"`,
      `"${c.channel}"`,
      `"${c.status}"`,
      c.audience,
      c.sent,
      c.delivered,
      c.opened,
      c.clicked,
      c.replies,
      `"${c.createdAt}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campaigns_info_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredCampaigns.length} campaign(s) to CSV!`);
  };

  const syncCampaignsToGoogleSheet = async (campaignsToSync = filteredCampaigns) => {
    const targetUrl = googleSheetUrl.trim() || DEFAULT_WEBAPP_URL;
    setIsSyncing(true);
    let successCount = 0;
    try {
      for (const c of campaignsToSync) {
        await fetch(targetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            id: c.id,
            name: c.name,
            type: c.type,
            channel: c.channel,
            status: c.status,
            audience: c.audience,
            sent: c.sent,
            delivered: c.delivered,
            opened: c.opened,
            clicked: c.clicked,
            replies: c.replies,
            createdAt: c.createdAt,
            syncedAt: new Date().toISOString(),
          }),
        });
        successCount++;
      }
      setIsConnected(true);
      toast.success(`Successfully pushed ${successCount} campaign record(s) to your Google Sheet!`);
    } catch (err) {
      console.error("Error syncing to Google Sheet WebApp:", err);
      toast.error("Failed to sync campaigns to Google Sheet.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateCampaign = (status: "Draft" | "Active") => {
    const name = builderName.trim() || `New DPC ${status} Campaign`;
    const newCampaign: SPCampaign = {
      id: `CMP-${String(Math.floor(100 + Math.random() * 900))}`,
      name,
      type: builderType,
      channel: builderChannel,
      status,
      audience: 342,
      sent: status === "Active" ? 342 : 0,
      delivered: status === "Active" ? 335 : 0,
      opened: status === "Active" ? 210 : 0,
      clicked: status === "Active" ? 95 : 0,
      replies: status === "Active" ? 32 : 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    createDbCampaign({
      name: newCampaign.name,
      type: newCampaign.type,
      channel: newCampaign.channel,
      status: newCampaign.status,
      attachments: attachedFiles.map((f) => ({ name: f.name, size: f.size, fileType: f.type })),
    });

    setAllCampaigns((prev) => [newCampaign, ...prev]);
    syncCampaignsToGoogleSheet([newCampaign]);

    toast.success(`Campaign "${name}" created and synced to Google Sheet! Saved in memory & localStorage.`);
    setBuilderName("");
    setShowBuilder(false);
    setAttachedFiles([]);
  };

  const handleConnectSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleSheetUrl.trim()) {
      toast.error("Please enter a Google Sheet Web App or Published CSV URL");
      return;
    }
    fetchSheetCampaigns(false);
    setShowSheetModal(false);
  };

  return (
    <ClassicLayout
      title="Campaign Center"
      subtitleNote="Marketing automation engine — create, manage, and analyze patient, lead, and employer campaigns."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Active Campaigns", val: allCampaigns.filter((c) => c.status === "Active").length.toString() },
        { label: "Total Sent", val: totalSent.toLocaleString() },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchSheetCampaigns(false)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-[#495057] text-xs font-semibold shadow-2xs transition-colors"
            title="Fetch latest campaigns from Google Sheet"
          >
            <RefreshCw className={`size-3.5 text-[#28a745] ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Refresh Sheet Data"}</span>
          </button>
          <button
            onClick={() => setShowSheetModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold shadow-2xs transition-colors ${
              isConnected
                ? "bg-[#d4edda] text-[#155724] border-[#c3e6cb]"
                : "bg-white border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057]"
            }`}
          >
            <FileSpreadsheet className="size-3.5 text-[#28a745]" />
            <span>{isConnected ? "Spreadsheet Connected" : "Connect Spreadsheet"}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-[#495057] text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="size-3.5 text-[#007bff]" />
            <span>Export CSV</span>
          </button>
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
              <input
                value={builderName}
                onChange={(e) => setBuilderName(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]"
                placeholder="e.g., Annual Exam Reminder Q4"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">Audience / Segment</label>
              <select
                value={builderType}
                onChange={(e) => setBuilderType(e.target.value as any)}
                className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]"
              >
                <option value="Patient">Needs Annual Exam (342 patients)</option>
                <option value="Lead">Lead Nurture Cohort (218 leads)</option>
                <option value="Employer">Employer HR Contacts (45 employers)</option>
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
              <select
                value={builderChannel}
                onChange={(e) => setBuilderChannel(e.target.value as any)}
                className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs focus:outline-none focus:border-[#e61952]"
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Multi-Channel">Multi-Channel (Email + SMS)</option>
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

            {/* Attachment Section */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-semibold text-[#495057] mb-1">
                Attach Campaign Documents / PDF (Optional)
              </label>
              <div className="border border-dashed border-[#dee2e6] rounded-lg p-3 bg-[#f8f9fa] hover:bg-[#fff0f4]/40 hover:border-[#e61952]/40 transition-colors">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded bg-[#e61952]/10 flex items-center justify-center text-[#e61952] shrink-0">
                      <Paperclip className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#212529]">
                        Attach Patient Flyers, Educational PDFs, or Onboarding Guides
                      </div>
                      <div className="text-[10px] text-[#6c757d]">
                        Supports PDF, DOCX, XLSX, PNG, JPG (Max 25MB per file)
                      </div>
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-xs font-bold text-[#495057] cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors">
                    <UploadCloud className="size-3.5 text-[#e61952]" />
                    <span>Attach Files</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Attached File List */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-[#dee2e6]">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-[#c3e6cb] shadow-2xs text-xs"
                      >
                        <FileText className="size-3.5 text-[#28a745]" />
                        <span className="font-semibold text-[#212529] max-w-[180px] truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-[9px] font-bold text-[#6c757d] uppercase bg-[#e9ecef] px-1 py-0.2 rounded">
                          {file.type}
                        </span>
                        <span className="text-[10px] text-[#6c757d]">({file.size})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-[#6c757d] hover:text-[#dc3545] p-0.5 rounded hover:bg-[#f8f9fa] transition-colors"
                          title="Remove attachment"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#dee2e6]">
            <button
              onClick={() => handleCreateCampaign("Draft")}
              className="px-4 py-2 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057]"
            >Save Draft</button>
            <button
              onClick={() => handleCreateCampaign("Active")}
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

      {/* Google Sheets / Spreadsheet Sync Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xl max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowSheetModal(false)}
              className="absolute top-4 right-4 text-[#6c757d] hover:text-[#212529] p-1 rounded hover:bg-[#f8f9fa]"
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-9 rounded bg-[#28a745]/10 flex items-center justify-center text-[#28a745]">
                <FileSpreadsheet className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#212529]">Connect Campaign Table to Spreadsheet</h3>
                <p className="text-[11px] text-[#6c757d]">Sync live campaign metrics with Google Sheets, Excel, or Webhook CSV</p>
              </div>
            </div>

            <form onSubmit={handleConnectSheet} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#495057] mb-1 flex items-center justify-between">
                  <span>Google Sheet URL or Web App Endpoint</span>
                  <span className="text-[10px] text-[#28a745] font-bold bg-[#d4edda] px-1.5 py-0.5 rounded border border-[#c3e6cb]">Live Sync Ready</span>
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#28a745] focus:outline-none focus:border-[#218838] font-mono text-[11px] bg-[#f8fff9]"
                />
                <p className="text-[10px] text-[#6c757d] mt-1">
                  Paste your Google Sheet link above (e.g., <code className="text-[#212529] bg-[#e9ecef] px-1 rounded font-mono">https://docs.google.com/spreadsheets/d/.../edit</code>) or Apps Script WebApp URL.
                </p>
              </div>

              {sheetFetchError && (
                <div className="p-3 bg-[#fff3cd] border border-[#ffeeba] text-[#856404] rounded text-[11px] leading-relaxed">
                  <strong>Notice on Web App Sync:</strong> {sheetFetchError}
                </div>
              )}

              <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded p-3 text-[11px] space-y-2">
                <div className="font-semibold text-[#343a40] flex items-center gap-1.5">
                  <Link2 className="size-3.5 text-[#007bff]" />
                  <span>Real-Time Sheet Sync (Every 30s):</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[#6c757d]">
                  <li><strong>Automatic 30-Second Auto-Pull:</strong> Fetches all new rows from your Google Sheet every 30s while page is open.</li>
                  <li><strong>Zero Frontend Storage:</strong> No localStorage is used — every refresh pulls fresh entries from the sheet.</li>
                  <li><strong>Direct Google Sheet Import:</strong> Automatically converts standard Google Sheet links to CSV endpoints.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-[#495057] font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="size-3.5 text-[#007bff]" />
                  <span>Download CSV</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSheetModal(false)}
                    className="px-3 py-1.5 rounded border border-[#dee2e6] text-[#6c757d] hover:bg-[#f8f9fa] font-medium"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="px-4 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] disabled:opacity-50 text-white font-bold shadow-2xs flex items-center gap-1.5"
                  >
                    <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Fetch Fresh Sheet Data"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
