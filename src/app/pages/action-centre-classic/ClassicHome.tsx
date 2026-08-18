import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Activity,
  Calendar,
  FileCheck,
  Megaphone,
  HeartPulse,
  Search,
  ArrowUp,
  ArrowDown,
  Download,
  ExternalLink,
  AlertCircle,
  ArrowRight,
} from "../../lib/icons";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { ClassicLayout } from "./ClassicLayout";

const chartData = [
  { name: "Jan", inPerson: 12, virtual: 8 },
  { name: "Feb", inPerson: 14, virtual: 19 },
  { name: "Mar", inPerson: 20, virtual: 14 },
  { name: "Apr", inPerson: 26, virtual: 19 },
  { name: "May", inPerson: 17, virtual: 12 },
  { name: "Jun", inPerson: 23, virtual: 16 },
];

const chronicRiskData = [
  { name: "Jan", high: 380, atRisk: 650 },
  { name: "Feb", high: 410, atRisk: 680 },
  { name: "Mar", high: 450, atRisk: 720 },
  { name: "Apr", high: 440, atRisk: 780 },
  { name: "May", high: 435, atRisk: 790 },
  { name: "Jun", high: 432, atRisk: 810 },
];

const KPI_SUMMARIES = [
  {
    id: "active-patients",
    title: "Total Active Patients",
    count: "2,823",
    wowChange: "12.0%",
    wowPositive: true,
    description: "Active assigned panel members",
    link: "/engagement/total-active-patients",
  },
  {
    id: "encounters",
    title: "Total Encounters",
    count: "7,214",
    wowChange: "8.4%",
    wowPositive: true,
    description: "In-Person & Virtual visits",
    link: "/engagement/encounters",
  },
  {
    id: "utilization-gaps",
    title: "Utilization Gaps",
    count: "625",
    wowChange: "3.1%",
    wowPositive: false,
    description: "Overdue screenings & checkups",
    link: "/utilization-gaps-classic",
  },
  {
    id: "high-risk",
    title: "High Risk Patients",
    count: "432",
    wowChange: "5.2%",
    wowPositive: true,
    description: "HCC & chronic tier 1 members",
    link: "/chronic-risk",
  },
];

const RECENT_ACTIVITIES = [
  { id: "ACT_001", patientId: "PT-8402", patientName: "Hannah Smith", type: "Clinical Checkup", text: "Annual wellness checkup completed and documented", status: "Completed", date: "Today, 09:45 AM", employer: "Apex Technologies" },
  { id: "ACT_002", patientId: "PT-9104", patientName: "David Miller", type: "Billing & Claims", text: "Claim #4020 generated for endocrinology follow-up", status: "Pending", date: "Today, 08:30 AM", employer: "Vanguard Retail" },
  { id: "ACT_003", patientId: "PT-7731", patientName: "Robert Chen", type: "Patient Outreach", text: "Preventive health campaign email distributed successfully", status: "Completed", date: "Yesterday, 04:15 PM", employer: "Sovereign Logistics" },
  { id: "ACT_004", patientId: "PT-6520", patientName: "Sarah Jenkins", type: "Clinical Order", text: "Prescription refill requested by community pharmacy", status: "In Progress", date: "Yesterday, 02:00 PM", employer: "Apex Technologies" },
  { id: "ACT_005", patientId: "PT-5812", patientName: "Michael Chang", type: "Onboarding Intake", text: "New patient registration and baseline assessment", status: "Completed", date: "16 Jun, 11:30 AM", employer: "Vanguard Retail" },
  { id: "ACT_006", patientId: "PT-4921", patientName: "Emily Taylor", type: "Billing & Claims", text: "Employer subscription invoice #1042 settled", status: "Completed", date: "15 Jun, 09:15 AM", employer: "Horizon Medical" },
  { id: "ACT_007", patientId: "PT-3840", patientName: "John Doe", type: "Lab Results", text: "Comprehensive metabolic panel reviewed by Dr. Evans", status: "Completed", date: "15 Jun, 08:00 AM", employer: "Apex Technologies" },
  { id: "ACT_008", patientId: "PT-2910", patientName: "Lisa Wong", type: "Administrative", text: "Cardiology follow-up appointment rescheduled", status: "Pending", date: "14 Jun, 03:20 PM", employer: "Sovereign Logistics" },
  { id: "ACT_009", patientId: "PT-1845", patientName: "James Wilson", type: "Clinical Checkup", text: "Virtual telehealth follow-up consultation completed", status: "In Progress", date: "14 Jun, 01:10 PM", employer: "Horizon Medical" },
  { id: "ACT_010", patientId: "PT-1029", patientName: "Elena Rostova", type: "Patient Outreach", text: "Monthly health practice newsletter distributed", status: "Completed", date: "13 Jun, 10:00 AM", employer: "Apex Technologies" },
];

export function ClassicHome() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "recent-activities" | "care-gaps">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Pagination states for table
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const hour = new Date().getHours();
  let greeting = "Good evening, Hannah!";
  if (hour < 12) greeting = "Good morning, Hannah!";
  else if (hour < 18) greeting = "Good afternoon, Hannah!";

  const filteredActivities = useMemo(() => {
    let list = [...RECENT_ACTIVITIES];

    if (activeTab === "recent-activities") {
      list = list.filter((a) => a.status === "Completed");
    } else if (activeTab === "care-gaps") {
      list = list.filter((a) => a.type.includes("Clinical") || a.type.includes("Outreach"));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.patientId.toLowerCase().includes(q) ||
          a.text.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.employer.toLowerCase().includes(q)
      );
    }

    if (sortBy === "recent") {
      // Keep default chronological order
    } else if (sortBy === "patient") {
      list.sort((a, b) => a.patientName.localeCompare(b.patientName));
    } else if (sortBy === "status") {
      list.sort((a, b) => a.status.localeCompare(b.status));
    }

    return list;
  }, [activeTab, searchQuery, sortBy]);

  const totalRecords = filteredActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredActivities.slice(start, start + recordsPerPage);
  }, [filteredActivities, currentPage, recordsPerPage]);

  const headerActionsNode = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => toast.success("Generating Executive Summary Report...", { description: "You will receive an email with the PDF summary shortly." })}
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
      title={`${greeting} (Legacy UI)`}
      subtitleNote="Note: Click any KPI summary card or AI quick action queue to drill down into actionable work queues."
      modernRoute="/home"
      activeNavIndex={0}
      headerActions={headerActionsNode}
    >
      {/* 1. OPERATIONAL SUMMARY KPI CARDS (Exact Legacy Action Centre Classic Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {KPI_SUMMARIES.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => navigate(card.link)}
              className="bg-white rounded p-4 flex flex-col justify-between min-h-[135px] transition-all cursor-pointer select-none border border-[#dee2e6] shadow-2xs hover:border-[#e61952]/50 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-[#343a40] leading-tight uppercase tracking-wide">
                    {card.title}
                  </span>
                  <div className="p-1.5 rounded bg-[#f8f9fa] text-[#6c757d] group-hover:text-[#e61952] transition-colors">
                    {card.id === "active-patients" && <Users className="size-4" />}
                    {card.id === "encounters" && <Activity className="size-4" />}
                    {card.id === "utilization-gaps" && <AlertCircle className="size-4" />}
                    {card.id === "high-risk" && <HeartPulse className="size-4" />}
                  </div>
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
                    {card.wowPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                    <span>{card.wowChange}</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#dee2e6] text-[11px]">
                <span className="text-[#6c757d] truncate max-w-[120px]" title={card.description}>
                  {card.description}
                </span>
                <span className="font-bold text-[#e61952] group-hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <ExternalLink className="size-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. CHARTS BOX: ENGAGEMENT TRENDS & CHRONIC RISK (Legacy Container Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Engagement Trends Line Chart */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">
                Engagement & Encounter Trends
              </h3>
              <p className="text-[11px] text-[#6c757d]">In-Person vs Virtual encounters (Last 6 Months)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-[#e61952]">
                <span className="size-2 rounded-full bg-[#e61952]" /> In-Person
              </span>
              <span className="flex items-center gap-1 text-[#007bff]">
                <span className="size-2 rounded-full bg-[#007bff]" /> Virtual
              </span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={{ stroke: "#dee2e6" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }}
                />
                <Line type="monotone" dataKey="inPerson" stroke="#e61952" strokeWidth={2.5} dot={{ r: 4, fill: "#e61952" }} name="In-Person Visits" />
                <Line type="monotone" dataKey="virtual" stroke="#007bff" strokeWidth={2.5} dot={{ r: 4, fill: "#007bff" }} name="Virtual Telehealth" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chronic Risk Area Chart */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">
                Chronic Risk Distribution
              </h3>
              <p className="text-[11px] text-[#6c757d]">High Risk vs At Risk panel progression</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-[#dc3545]">
                <span className="size-2 rounded-full bg-[#dc3545]" /> High Risk
              </span>
              <span className="flex items-center gap-1 text-[#ffc107]">
                <span className="size-2 rounded-full bg-[#ffc107]" /> At Risk
              </span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chronicRiskData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="legacyHighRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc3545" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#dc3545" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="legacyAtRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc107" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ffc107" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={{ stroke: "#dee2e6" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }}
                />
                <Area type="monotone" dataKey="high" stroke="#dc3545" strokeWidth={2.5} fillOpacity={1} fill="url(#legacyHighRisk)" name="High Risk Panel" />
                <Area type="monotone" dataKey="atRisk" stroke="#ffc107" strokeWidth={2.5} fillOpacity={1} fill="url(#legacyAtRisk)" name="At Risk Panel" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. VALIDATED COST SAVINGS & SAVINGS SPLIT DISTRIBUTION EXECUTIVE CARD (Right Above Table) */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#dee2e6] gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-[#212529] uppercase tracking-wide">
                Validated Practice Cost Savings & Value Distribution
              </span>
              <span className="bg-[#d4edda] text-[#155724] border border-[#c3e6cb] px-2 py-0.5 rounded text-[10px] font-bold">
                Annual Audit Verified
              </span>
              <span className="bg-[#cce5ff] text-[#004085] border border-[#b8daff] px-2 py-0.5 rounded text-[10px] font-bold">
                21.0x Net ROI
              </span>
            </div>
            <p className="text-xs text-[#6c757d] mt-1">
              Comprehensive breakdown of total savings split across clinical categories and network optimizations for 1,420 attributed member lives.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/cost-savings")}
              className="px-4 py-2 rounded bg-[#e61952] hover:bg-[#c41344] text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Full Financial Report</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Total Savings Summary Metric */}
          <div className="lg:col-span-4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#dee2e6] pb-4 lg:pb-0 lg:pr-6">
            <span className="text-[11px] font-bold text-[#6c757d] uppercase tracking-wider mb-1">
              Total Net Practice Reductions
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#28a745] tabular-nums tracking-tight">
              $1,577,117
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#495057]">
              <span>Gross Value: <strong className="text-[#212529]">$1,652,117</strong></span>
              <span className="text-[#dee2e6]">|</span>
              <span>Investment: <strong className="text-[#212529]">$75,000</strong></span>
            </div>
            <div className="mt-3 bg-[#f8f9fa] border border-[#dee2e6] rounded p-3 text-[11px] text-[#495057] leading-relaxed">
              <strong className="text-[#212529]">Executive Summary:</strong> Proactive chronic disease management ($842k) and emergency room diversion ($480k) account for 79.7% of total practice savings.
            </div>
          </div>

          {/* Right Column: Savings Split Graphs & Breakdown Grid */}
          <div className="lg:col-span-8 flex flex-col gap-4 lg:pl-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#343a40] mb-1.5">
                <span>Savings Split Distribution by Category</span>
                <span className="text-[#6c757d] text-[11px] font-normal">100% of Verified Reductions ($1.65M Total)</span>
              </div>
              
              {/* Stacked Horizontal Progress Bar Graph */}
              <div className="h-4 w-full rounded-full overflow-hidden flex border border-[#dee2e6] bg-[#e9ecef] shadow-inner">
                <div style={{ width: "43.7%" }} className="bg-[#1976d2] h-full transition-all hover:opacity-90" title="Covered Visits: $721,400 (43.7%)" />
                <div style={{ width: "22.8%" }} className="bg-[#689f38] h-full transition-all hover:opacity-90" title="Covered Procedures: $377,094 (22.8%)" />
                <div style={{ width: "15.3%" }} className="bg-[#00897b] h-full transition-all hover:opacity-90" title="Low Cost Labs: $253,250 (15.3%)" />
                <div style={{ width: "7.9%" }} className="bg-[#ffa000] h-full transition-all hover:opacity-90" title="Free Rx & Refills: $130,009 (7.9%)" />
                <div style={{ width: "6.6%" }} className="bg-[#d81b60] h-full transition-all hover:opacity-90" title="Medication Management: $108,900 (6.6%)" />
                <div style={{ width: "3.7%" }} className="bg-[#673ab7] h-full transition-all hover:opacity-90" title="Quality & Screenings: $61,464 (3.7%)" />
              </div>
            </div>

            {/* Category Split Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                { name: "Covered Visits", amount: "$721,400", pct: "43.7%", color: "bg-[#1976d2]", text: "text-[#1976d2]", border: "border-[#1976d2]/30" },
                { name: "Covered Procedures", amount: "$377,094", pct: "22.8%", color: "bg-[#689f38]", text: "text-[#689f38]", border: "border-[#689f38]/30" },
                { name: "Low Cost Labs", amount: "$253,250", pct: "15.3%", color: "bg-[#00897b]", text: "text-[#00897b]", border: "border-[#00897b]/30" },
                { name: "Free Rx & Refills", amount: "$130,009", pct: "7.9%", color: "bg-[#ffa000]", text: "text-[#ffa000]", border: "border-[#ffa000]/30" },
                { name: "Medication Mgmt", amount: "$108,900", pct: "6.6%", color: "bg-[#d81b60]", text: "text-[#d81b60]", border: "border-[#d81b60]/30" },
                { name: "Quality & Screenings", amount: "$61,464", pct: "3.7%", color: "bg-[#673ab7]", text: "text-[#673ab7]", border: "border-[#673ab7]/30" },
              ].map((item, idx) => (
                <div key={idx} className={`p-2.5 rounded border ${item.border} bg-[#f8f9fa] flex items-center justify-between gap-2`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`size-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-xs font-bold text-[#343a40] truncate">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#212529] block">{item.amount}</span>
                    <span className={`text-[10px] font-bold ${item.text}`}>{item.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. CLEAN TABS & QUEUE CONTROLS FOR RECENT ACTIVITIES TABLE */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Left Side: Clean Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all" as const, label: "All Practice Activities" },
            { id: "recent-activities" as const, label: "Completed Clinical Logs" },
            { id: "care-gaps" as const, label: "Care Gap Outreach Queue" },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
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
              placeholder="Search patient, ID, activity..."
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
            <option value="recent">Sort: Most Recent First</option>
            <option value="patient">Sort: Patient Name (A-Z)</option>
            <option value="status">Sort: Activity Status</option>
          </select>
        </div>
      </div>

      {/* 6. CLEAN LEGACY TABLE FOR RECENT ACTIVITIES */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden flex flex-col mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-xs font-semibold border-b border-[#dee2e6]">
                <th className="py-3 px-3">Activity ID</th>
                <th className="py-3 px-3">Patient Member</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Activity Description</th>
                <th className="py-3 px-3">Employer</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6c757d] italic">
                    No activity logs found matching the current filters.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => {
                  return (
                    <tr key={row.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="py-3 px-3 font-mono text-[#007bff] font-medium hover:underline cursor-pointer">
                        {row.id}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#212529]">
                        <div className="flex flex-col">
                          <span>{row.patientName}</span>
                          <span className="text-[10px] text-[#6c757d] font-mono">{row.patientId}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#343a40]">
                        {row.type}
                      </td>
                      <td className="py-3 px-3 text-[#495057] max-w-[280px] truncate" title={row.text}>
                        {row.text}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#343a40]">
                        {row.employer}
                      </td>
                      <td className="py-3 px-3 text-[#6c757d] font-mono text-[11px]">
                        {row.date}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            row.status === "Completed"
                              ? "bg-[#d4edda] text-[#155724] border-[#c3e6cb]"
                              : row.status === "Pending"
                              ? "bg-[#fff3cd] text-[#856404] border-[#ffeeba]"
                              : "bg-[#cce5ff] text-[#004085] border-[#b8daff]"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => toast.info(`Viewing details for ${row.id}: ${row.text}`)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057] shadow-2xs ml-auto"
                        >
                          View Details
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
            Showing <span className="font-semibold">{totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * recordsPerPage, totalRecords)}</span> of{" "}
            <span className="font-semibold">{totalRecords.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span>Records per page:</span>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
              >
                Previous
              </button>
              <span className="px-3 py-1 font-semibold text-[#212529]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-[#dee2e6] bg-white text-xs font-semibold hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClassicLayout>
  );
}
