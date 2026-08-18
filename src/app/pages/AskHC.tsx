import React, { useState } from "react";
import { Page } from "../components/layout/Page";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase font-semibold">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

import {
  Sparkles,
  CodeXml,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  Building2,
  Clock,
  RotateCcw,
  BarChart2,
  PieChart as PieChartIcon,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Download,
} from "../lib/icons";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type VisualTab = "all" | "graphs" | "kpis" | "table";

interface QueryPreset {
  id: string;
  title: string;
  icon: React.ElementType;
  category: string;
}

const SUGGESTED_PROMPTS: QueryPreset[] = [
  {
    id: "patients_count",
    title: "What is the total count of patients",
    icon: Users,
    category: "Population Health",
  },
  {
    id: "taliun_notes",
    title: "What is the count of visit notes for Taliun employees",
    icon: FileText,
    category: "Employer Analytics",
  },
  {
    id: "after_hours_messages",
    title: "What is the count of messages sent by Healthcompiler patients after 6 PM",
    icon: MessageSquare,
    category: "After-Hours Triage",
  },
  {
    id: "total_messages",
    title: "What is the total count of messages",
    icon: MessageSquare,
    category: "Communication",
  },
  {
    id: "notes_trend",
    title: "What is the trend of visit notes over the different months in this year",
    icon: Calendar,
    category: "Clinical Documentation",
  },
  {
    id: "employer_distribution",
    title: "What is the distribution of active patients across employers",
    icon: Building2,
    category: "Employer Contracts",
  },
];

// --- Mock Data for Visual Representations ---

// 1. Total Patients Data
const PATIENT_GROWTH_DATA = [
  { month: "Jan", total: 13120, active: 12850 },
  { month: "Feb", total: 13290, active: 13010 },
  { month: "Mar", total: 13480, active: 13210 },
  { month: "Apr", total: 13650, active: 13390 },
  { month: "May", total: 13810, active: 13540 },
  { month: "Jun", total: 13990, active: 13720 },
  { month: "Jul", total: 14120, active: 13860 },
  { month: "Aug", total: 14285, active: 14028 },
];

const AGE_DISTRIBUTION_DATA = [
  { name: "18-34 Years", value: 3140, color: "#3b82f6" },
  { name: "35-50 Years", value: 4850, color: "#10b981" },
  { name: "51-65 Years", value: 4005, color: "#8b5cf6" },
  { name: "65+ Years", value: 2290, color: "#f59e0b" },
];

// 2. Taliun Employees Data
const TALIUN_ENCOUNTER_TYPES = [
  { type: "Annual Wellness Check", notes: 612, compliance: 98.4 },
  { type: "Telehealth Follow-up", notes: 445, compliance: 96.8 },
  { type: "Acute Care / Urgent", notes: 285, compliance: 95.1 },
  { type: "Chronic Care Review", notes: 140, compliance: 97.2 },
];

const TALIUN_RECENT_NOTES = [
  { id: "T-1042", employee: "Marcus Vance", department: "Engineering", type: "Annual Wellness Check", date: "2026-07-08", provider: "Dr. Amanda Johnson", status: "Signed" },
  { id: "T-0891", employee: "Elena Rostova", department: "Product Design", type: "Telehealth Follow-up", date: "2026-07-08", provider: "Dr. Robert Chen", status: "Signed" },
  { id: "T-1150", employee: "David K.", department: "Operations", type: "Acute Care / Urgent", date: "2026-07-07", provider: "Dr. Sarah Williams", status: "Signed" },
  { id: "T-0432", employee: "Samantha Wu", department: "Executive", type: "Chronic Care Review", date: "2026-07-07", provider: "Dr. Amanda Johnson", status: "Pending Cosign" },
  { id: "T-0988", employee: "Jameson Lee", department: "Data Science", type: "Annual Wellness Check", date: "2026-07-06", provider: "Dr. Michael Chang", status: "Signed" },
];

// 3. After-Hours Messages Data
const AFTER_HOURS_HOURLY = [
  { hour: "6-7 PM", messages: 1120, aiResolved: 940, escalated: 180 },
  { hour: "7-8 PM", messages: 890, aiResolved: 730, escalated: 160 },
  { hour: "8-9 PM", messages: 640, aiResolved: 520, escalated: 120 },
  { hour: "9-10 PM", messages: 410, aiResolved: 340, escalated: 70 },
  { hour: "10 PM-12 AM", messages: 460, aiResolved: 380, escalated: 80 },
  { hour: "12 AM-6 AM", messages: 322, aiResolved: 200, escalated: 122 },
];

const AFTER_HOURS_CHANNELS = [
  { name: "Patient Portal App", value: 2382, color: "#3b82f6" },
  { name: "Secure SMS Triage", value: 1075, color: "#10b981" },
  { name: "AI Voice / After-Hours Line", value: 385, color: "#8b5cf6" },
];

// 4. Total Messages Data
const MONTHLY_MESSAGES_TREND = [
  { month: "Jan", inbound: 840, outbound: 710, total: 1550 },
  { month: "Feb", inbound: 880, outbound: 740, total: 1620 },
  { month: "Mar", inbound: 920, outbound: 780, total: 1700 },
  { month: "Apr", inbound: 890, outbound: 760, total: 1650 },
  { month: "May", inbound: 950, outbound: 810, total: 1760 },
  { month: "Jun", inbound: 990, outbound: 840, total: 1830 },
  { month: "Jul", inbound: 960, outbound: 820, total: 1780 },
  { month: "Aug", inbound: 1020, outbound: 880, total: 1900 },
  { month: "Sep", inbound: 1060, outbound: 910, total: 1970 },
  { month: "Oct", inbound: 1110, outbound: 950, total: 2060 },
  { month: "Nov", inbound: 1150, outbound: 990, total: 2140 },
  { month: "Dec", inbound: 1650, outbound: 1280, total: 2930 },
];

// 5. Visit Notes Trend Data
const VISIT_NOTES_MONTHLY = [
  { month: "Jan", notes: 1080, aiScribed: 720, avgWords: 410 },
  { month: "Feb", notes: 1120, aiScribed: 760, avgWords: 415 },
  { month: "Mar", notes: 1190, aiScribed: 815, avgWords: 420 },
  { month: "Apr", notes: 1150, aiScribed: 790, avgWords: 418 },
  { month: "May", notes: 1210, aiScribed: 840, avgWords: 425 },
  { month: "Jun", notes: 1280, aiScribed: 895, avgWords: 430 },
  { month: "Jul", notes: 1240, aiScribed: 860, avgWords: 428 },
  { month: "Aug", notes: 1310, aiScribed: 920, avgWords: 435 },
  { month: "Sep", notes: 1350, aiScribed: 960, avgWords: 440 },
  { month: "Oct", notes: 1410, aiScribed: 1010, avgWords: 442 },
  { month: "Nov", notes: 1450, aiScribed: 1050, avgWords: 445 },
  { month: "Dec", notes: 1510, aiScribed: 1110, avgWords: 450 },
];

// 6. Employer Distribution Data
const EMPLOYER_DISTRIBUTION = [
  { employer: "Taliun Global Tech", count: 3420, percentage: 23.9, riskScore: 1.05, retention: "98.4%" },
  { employer: "Apex Manufacturing", count: 3110, percentage: 21.8, riskScore: 1.18, retention: "96.2%" },
  { employer: "Horizon Healthcare Sys", count: 2650, percentage: 18.6, riskScore: 1.12, retention: "97.5%" },
  { employer: "Starlight Financial", count: 1890, percentage: 13.2, riskScore: 0.94, retention: "98.1%" },
  { employer: "Metro Transit Auth.", count: 1340, percentage: 9.4, riskScore: 1.24, retention: "94.8%" },
  { employer: "Other / Individual", count: 1875, percentage: 13.1, riskScore: 1.08, retention: "95.5%" },
];

export default function AskHC() {
  const [promptText, setPromptText] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<VisualTab>("all");

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    setActiveQuery(promptText.trim());
  };

  const handleSelectPrompt = (title: string) => {
    setPromptText(title);
    setActiveQuery(title);
  };

  // Determine which preset output to render based on query text similarity
  const getQueryType = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("total count of patients") || q.includes("count of patients") || q.includes("active patients")) return "patients_count";
    if (q.includes("taliun") || (q.includes("visit notes") && q.includes("employee"))) return "taliun_notes";
    if (q.includes("after 6 pm") || q.includes("after hours") || q.includes("6pm")) return "after_hours_messages";
    if (q.includes("total count of messages") || (q.includes("messages") && !q.includes("6 pm"))) return "total_messages";
    if (q.includes("trend of visit notes") || q.includes("different months") || q.includes("notes trend")) return "notes_trend";
    if (q.includes("distribution") || q.includes("employers") || q.includes("across employers")) return "employer_distribution";
    return "custom";
  };

  const queryType = activeQuery ? getQueryType(activeQuery) : null;

  return (
    <Page
      title="Helix (AI Query)"
      subtitle="Instant interactive analytics, graphs, and visual representations from natural language queries"
      crumbs={[{ label: "Dashboards", to: "/engagement" }, { label: "Helix" }]}
      showFilters={false}
      showIconActions={true}
      showGenerateReport={false}
    >
      {/* Top Banner exactly matching the user screenshot */}
      <div className="py-4 flex flex-col items-center justify-center animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center tracking-tight">
          What are you looking for Today?
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
          Find answers to your questions with instant graphs, text summaries, and visual representations.
        </p>

        {/* Prompt Input Card exactly matching screenshot <-> Enter a prompt here [Execute ✨] */}
        <form
          onSubmit={handleExecute}
          className="w-full max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card shadow-md p-2 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50"
        >
          <div className="size-9 rounded-xl bg-muted/60 text-muted-foreground grid place-items-center ml-1.5 shrink-0">
            <CodeXml className="size-4.5 text-primary" />
          </div>
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Enter a prompt here"
            className="flex-1 bg-transparent text-sm md:text-base font-medium outline-none text-foreground placeholder:text-muted-foreground/60 px-2 h-11"
          />
          {promptText && (
            <button
              type="button"
              onClick={() => {
                setPromptText("");
                setActiveQuery(null);
              }}
              className="text-muted-foreground hover:text-foreground text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          <Button
            type="submit"
            className="h-10 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm gap-2 text-sm transition-all shrink-0 cursor-pointer"
          >
            <span>Execute</span>
            <Sparkles className="size-4" />
          </Button>
        </form>

        {/* Suggested Prompts Section exactly matching screenshot grid */}
        <div className="w-full max-w-5xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="size-4 text-primary animate-pulse" />
            <h2 className="text-sm font-bold text-foreground tracking-tight">Suggested Prompts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {SUGGESTED_PROMPTS.map((prompt) => {
              const isSelected = activeQuery === prompt.title;
              const Icon = prompt.icon;
              return (
                <div
                  key={prompt.id}
                  onClick={() => handleSelectPrompt(prompt.title)}
                  className={`p-4.5 rounded-2xl border bg-card hover:bg-accent/40 cursor-pointer transition-all duration-200 shadow-2xs flex items-start gap-3 group text-left relative overflow-hidden ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10"
                      : "border-border/70 hover:border-primary/40"
                  }`}
                >
                  <div className="size-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 grid place-items-center shrink-0 border border-blue-200/50 dark:border-blue-800/40 mt-0.5 group-hover:scale-105 transition-transform">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 block mb-1">
                      {prompt.category}
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-foreground leading-snug block">
                      {prompt.title}
                    </span>
                  </div>
                  <ArrowUpRight className={`size-4 shrink-0 transition-all ${isSelected ? "text-primary opacity-100" : "text-muted-foreground/40 group-hover:text-primary group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Visual Representations & Graphs Output Deck --- */}
      {activeQuery && (
        <div className="mt-8 space-y-6 animate-fade-in-up border-t border-border/80 pt-8">
          {/* Top Output Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 rounded-2xl bg-card border border-border shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 grid place-items-center border border-blue-200/60 dark:border-blue-800/40 shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Query Executed</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Live SQL/Analytics Engine
                  </Badge>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-foreground mt-0.5 leading-snug">
                  "{activeQuery}"
                </h3>
              </div>
            </div>

            {/* Sub-Tabs: All, Graphs, KPIs & Text, Data Table */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/60 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "all" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="size-3.5" />
                  <span>All Views</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("graphs")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "graphs" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart2 className="size-3.5" />
                  <span>Graphs & Charts</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("kpis")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "kpis" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="size-3.5" />
                  <span>Text & KPIs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("table")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "table" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TableIcon className="size-3.5" />
                  <span>Data Grid</span>
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPromptText("");
                  setActiveQuery(null);
                }}
                className="gap-1.5 text-xs h-8.5 px-3 rounded-lg"
              >
                <RotateCcw className="size-3.5" />
                <span>Ask Another</span>
              </Button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* OUTPUT FOR PROMPT 1: What is the total count of patients */}
          {/* ========================================================= */}
          {queryType === "patients_count" && (
            <div className="space-y-6">
              {/* Text & KPI Summary Deck */}
              {(activeTab === "all" || activeTab === "kpis") && (
                <section className="stagger-section">
                  <SectionLabel>Text Summary & Key Metrics</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Active Patients</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-foreground tabular-nums">14,285</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                          <TrendingUp className="size-3.5 mr-0.5" /> +8.4% YoY
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">100% of current contracted lives</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Manifest Enrolled</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">14,028</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          98.2% Coverage
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Synced with EHR in last 24 hours</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Patient Additions</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">+342</span>
                        <span className="text-xs font-medium text-muted-foreground">This month</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Highest monthly intake in Q3</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">High Risk (HCC ≥2.0)</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">1,840</span>
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          12.9% of Cohort
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Assigned to care management</span>
                    </Card>
                  </div>
                </section>
              )}

              {/* Graphs & Charts Section */}
              {(activeTab === "all" || activeTab === "graphs") && (
                <section className="stagger-section">
                  <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 8-Month Patient Growth Graph */}
                    <Card className="p-6 rounded-2xl border bg-card shadow-sm lg:col-span-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                        <div>
                          <h3 className="text-base font-bold text-foreground">Patient Cohort Growth Over Time</h3>
                          <p className="text-xs text-muted-foreground">Monthly total active versus manifest-engaged member count</p>
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold">Jan — Aug 2026</Badge>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={PATIENT_GROWTH_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="totalPatientGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                              </linearGradient>
                              <linearGradient id="activePatientGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[12500, 14500]} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }}
                              formatter={(val: number) => [`${val.toLocaleString()} Patients`, ""]}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <Area type="monotone" name="Total Contracted Patients" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#totalPatientGradient)" isAnimationActive={true} animationDuration={800} animationEasing="ease-in-out" />
                            <Area type="monotone" name="Manifest Engaged Patients" dataKey="active" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#activePatientGradient)" isAnimationActive={true} animationDuration={800} animationEasing="ease-in-out" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Demographics Donut Chart */}
                    <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                      <div className="border-b border-border/60 pb-3 mb-4">
                        <h3 className="text-base font-bold text-foreground">Age Breakdown</h3>
                        <p className="text-xs text-muted-foreground">Demographic distribution across 14,285 patients</p>
                      </div>
                      <div className="h-56 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={AGE_DISTRIBUTION_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {AGE_DISTRIBUTION_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val: number) => [`${val.toLocaleString()} Patients (${((val / 14285) * 100).toFixed(1)}%)`, ""]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                        {AGE_DISTRIBUTION_DATA.map((item) => (
                          <div key={item.name} className="flex items-center gap-2 text-xs">
                            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="font-medium text-foreground truncate">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </section>
              )}

              {/* Data Table View */}
              {(activeTab === "all" || activeTab === "table") && (
                <section className="stagger-section">
                  <SectionLabel>Structured Data Representation</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Age Cohort & Clinical Risk Matrix</h3>
                        <p className="text-xs text-muted-foreground">Complete tabular breakdown with chronic condition prevalence</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8.5 px-3 rounded-lg">
                        <Download className="size-3.5" />
                        <span>Export CSV</span>
                      </Button>
                    </div>
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground">
                            <th className="py-3 px-4">Age Bracket</th>
                            <th className="py-3 px-4 text-right">Patient Count</th>
                            <th className="py-3 px-4 text-right">% of Total</th>
                            <th className="py-3 px-4 text-right">Avg Risk Score (HCC)</th>
                            <th className="py-3 px-4 text-right">Hypertension %</th>
                            <th className="py-3 px-4 text-right">Diabetes %</th>
                            <th className="py-3 px-4 text-right">Care Plan Compliance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium text-foreground">
                          <tr className="hover:bg-muted/30">
                            <td className="py-3.5 px-4 font-bold">18 - 34 Years</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">3,140</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">22.0%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">0.64</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">11.2%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">4.8%</td>
                            <td className="py-3.5 px-4 text-right"><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 border shadow-none">94.1%</Badge></td>
                          </tr>
                          <tr className="hover:bg-muted/30">
                            <td className="py-3.5 px-4 font-bold">35 - 50 Years</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">4,850</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">34.0%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">0.92</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">24.5%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">12.1%</td>
                            <td className="py-3.5 px-4 text-right"><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 border shadow-none">92.8%</Badge></td>
                          </tr>
                          <tr className="hover:bg-muted/30">
                            <td className="py-3.5 px-4 font-bold">51 - 65 Years</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">4,005</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">28.0%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">1.34</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">48.2%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">22.4%</td>
                            <td className="py-3.5 px-4 text-right"><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 border shadow-none">91.4%</Badge></td>
                          </tr>
                          <tr className="hover:bg-muted/30">
                            <td className="py-3.5 px-4 font-bold">65+ Years</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">2,290</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">16.0%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-bold text-purple-600 dark:text-purple-400">2.18</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">68.4%</td>
                            <td className="py-3.5 px-4 text-right tabular-nums">38.9%</td>
                            <td className="py-3.5 px-4 text-right"><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 border shadow-none">89.6%</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* OUTPUT FOR PROMPT 2: Count of visit notes for Taliun employees */}
          {/* ========================================================= */}
          {queryType === "taliun_notes" && (
            <div className="space-y-6">
              {(activeTab === "all" || activeTab === "kpis") && (
                <section className="stagger-section">
                  <SectionLabel>Text Summary & Key Documentation Metrics</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Taliun Visit Notes</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-foreground tabular-nums">1,482</span>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] px-2 py-0.5 border shadow-none font-semibold">
                          YTD 2026
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Across all clinical encounter types</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Taliun Employee Cohort</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">428</span>
                        <span className="text-xs font-semibold text-muted-foreground">Active Members</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Avg 3.46 visit notes per employee</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Signed Electronically</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">1,445</span>
                        <span className="text-xs font-bold text-emerald-600">97.5%</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Signed within 24-hour compliance SLA</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pending Review / Cosign</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">37</span>
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          2.5% Pending
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">All notes within 48h active queue</span>
                    </Card>
                  </div>
                </section>
              )}

              {(activeTab === "all" || activeTab === "graphs") && (
                <section className="stagger-section">
                  <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Taliun Visit Notes by Encounter Type</h3>
                        <p className="text-xs text-muted-foreground">Distribution of documented clinical visits across 1,482 total records</p>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1 font-semibold border shadow-none">
                        Taliun Global Tech Contract
                      </Badge>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TALIUN_ENCOUNTER_TYPES} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                          <XAxis dataKey="type" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }}
                            formatter={(val: number) => [`${val} Visit Notes`, "Documented Notes"]}
                          />
                          <Bar dataKey="notes" name="Documented Notes" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                            {TALIUN_ENCOUNTER_TYPES.map((_, index) => (
                              <Cell key={`taliun-cell-${index}`} fill={index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : index === 2 ? "#8b5cf6" : "#f59e0b"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </section>
              )}

              {(activeTab === "all" || activeTab === "table") && (
                <section className="stagger-section">
                  <SectionLabel>Recent Documentation Roster</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Recent Taliun Employee Visit Notes</h3>
                        <p className="text-xs text-muted-foreground">Sample excerpt of real-time EHR clinical notes documented for this employer</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8.5 px-3 rounded-lg">
                        <Download className="size-3.5" />
                        <span>Export All 1,482 Notes</span>
                      </Button>
                    </div>
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground">
                            <th className="py-3 px-4">Note ID</th>
                            <th className="py-3 px-4">Employee Name</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Encounter Type</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Documenting Provider</th>
                            <th className="py-3 px-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium text-foreground">
                          {TALIUN_RECENT_NOTES.map((note) => (
                            <tr key={note.id} className="hover:bg-muted/30">
                              <td className="py-3.5 px-4 font-bold text-primary">{note.id}</td>
                              <td className="py-3.5 px-4 font-semibold">{note.employee}</td>
                              <td className="py-3.5 px-4 text-muted-foreground">{note.department}</td>
                              <td className="py-3.5 px-4">{note.type}</td>
                              <td className="py-3.5 px-4 tabular-nums text-muted-foreground">{note.date}</td>
                              <td className="py-3.5 px-4 font-semibold">{note.provider}</td>
                              <td className="py-3.5 px-4 text-right">
                                <Badge className={note.status === "Signed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 border shadow-none" : "bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-2 py-0.5 border shadow-none"}>
                                  {note.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* OUTPUT FOR PROMPT 3: Messages sent after 6 PM */}
          {/* ========================================================= */}
          {queryType === "after_hours_messages" && (
            <div className="space-y-6">
              {(activeTab === "all" || activeTab === "kpis") && (
                <section className="stagger-section">
                  <SectionLabel>Text Summary & Triage SLA Metrics</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">After-Hours Messages (&gt;6 PM)</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-foreground tabular-nums">3,842</span>
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          18.4% of Total
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Received between 6:00 PM and 6:00 AM</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Auto-Responded &amp; Triaged</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">3,110</span>
                        <span className="text-xs font-bold text-emerald-600">80.9%</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Instant symptom check &amp; scheduling help</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Escalated to On-Call Provider</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">732</span>
                        <span className="text-xs font-medium text-muted-foreground">14m avg SLA</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Requires clinical physician review</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">High Acuity / Urgent Clinical</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">142</span>
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          3.7% Urgent
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Immediate ED/Urgent Care redirection</span>
                    </Card>
                  </div>
                </section>
              )}

              {(activeTab === "all" || activeTab === "graphs") && (
                <section className="stagger-section">
                  <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-6 rounded-2xl border bg-card shadow-sm lg:col-span-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                        <div>
                          <h3 className="text-base font-bold text-foreground">After-Hours Message Volume by Time Window</h3>
                          <p className="text-xs text-muted-foreground">Comparison of total inquiries vs AI auto-resolved vs physician escalations</p>
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold">6:00 PM — 6:00 AM</Badge>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={AFTER_HOURS_HOURLY} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                            <XAxis dataKey="hour" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <Bar dataKey="aiResolved" name="AI Auto-Resolved" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="escalated" name="Escalated to Provider" stackId="a" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                      <div className="border-b border-border/60 pb-3 mb-4">
                        <h3 className="text-base font-bold text-foreground">Channel Breakdown</h3>
                        <p className="text-xs text-muted-foreground">Inquiry origin points after 6 PM</p>
                      </div>
                      <div className="h-56 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={AFTER_HOURS_CHANNELS} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                              {AFTER_HOURS_CHANNELS.map((entry, idx) => (
                                <Cell key={`after-channel-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val: number) => [`${val.toLocaleString()} Messages`, ""]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-border/40">
                        {AFTER_HOURS_CHANNELS.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center gap-2">
                              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-foreground">{item.name}</span>
                            </div>
                            <span className="tabular-nums font-bold text-muted-foreground">{item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* OUTPUT FOR PROMPT 4: Total count of messages */}
          {/* ========================================================= */}
          {queryType === "total_messages" && (
            <div className="space-y-6">
              {(activeTab === "all" || activeTab === "kpis") && (
                <section className="stagger-section">
                  <SectionLabel>Text Summary & Communication Metrics</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Practice Message Volume</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-foreground tabular-nums">20,890</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                          <TrendingUp className="size-3.5 mr-0.5" /> +14.2%
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Total bidirectional EHR secure messages</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inbound Patient Inquiries</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">11,420</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          54.7% of Total
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Patient portal &amp; mobile app alerts</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Outbound Practice Outreach</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">9,470</span>
                        <span className="text-xs font-medium text-muted-foreground">45.3% of Total</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Preventive care &amp; lab notification outreach</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">First-Contact Resolution</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">89.4%</span>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          Target &gt;85%
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Resolved without follow-up phone call</span>
                    </Card>
                  </div>
                </section>
              )}

              {(activeTab === "all" || activeTab === "graphs") && (
                <section className="stagger-section">
                  <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Monthly Bidirectional Message Volume Trend</h3>
                        <p className="text-xs text-muted-foreground">Comparison of inbound patient requests versus outbound clinical communications</p>
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold">Jan — Dec 2026</Badge>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MONTHLY_MESSAGES_TREND} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                          <Area type="monotone" name="Inbound Patient Inquiries" dataKey="inbound" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#inboundGrad)" />
                          <Area type="monotone" name="Outbound Practice Outreach" dataKey="outbound" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#outboundGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* OUTPUT FOR PROMPT 5: Trend of visit notes over months */}
          {/* ========================================================= */}
          {queryType === "notes_trend" && (
            <div className="space-y-6">
              {(activeTab === "all" || activeTab === "kpis") && (
                <section className="stagger-section">
                  <SectionLabel>Text Summary & Monthly Documentation KPIs</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total YTD Visit Notes</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-foreground tabular-nums">14,640</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                          <TrendingUp className="size-3.5 mr-0.5" /> +11.8%
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">All completed physician clinical notes</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Average Monthly Volume</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">1,220</span>
                        <span className="text-xs font-medium text-muted-foreground">notes / month</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Peak volume recorded in December (1,510)</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Ambient Scribing Rate</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">68.5%</span>
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          ~3.2m Saved / Note
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Scribed automatically during clinical exam</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Same-Day Sign Rate</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">94.2%</span>
                        <span className="text-xs font-bold text-emerald-600">SLA Met</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Completed &amp; locked before midnight</span>
                    </Card>
                  </div>
                </section>
              )}

              {(activeTab === "all" || activeTab === "graphs") && (
                <section className="stagger-section">
                  <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Monthly Clinical Visit Notes Documentation Trend</h3>
                        <p className="text-xs text-muted-foreground">Overall note volume compared with AI ambient scribe assistance adoption</p>
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold">2026 Annual Cycle</Badge>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={VISIT_NOTES_MONTHLY} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="notesTotalGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="aiScribedGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[500, 1600]} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                          <Area type="monotone" name="Total Visit Notes" dataKey="notes" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#notesTotalGrad)" isAnimationActive={true} animationDuration={800} animationEasing="ease-in-out" />
                          <Area type="monotone" name="AI Ambient Scribed Notes" dataKey="aiScribed" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#aiScribedGrad)" isAnimationActive={true} animationDuration={800} animationEasing="ease-in-out" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* OUTPUT FOR PROMPT 6: Active patients across employers */}
          {/* ========================================================= */}
          {queryType === "employer_distribution" && (
            <div className="space-y-6">
              {(activeTab === "all" || activeTab === "kpis") && (
                <section className="stagger-section">
                  <SectionLabel>Text Summary & Employer Contract KPIs</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Contracted Employers</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-foreground tabular-nums">8</span>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          Active Contracts
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Direct-to-employer healthcare partnerships</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Top Employer Share</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">3,420</span>
                        <span className="text-xs font-bold text-blue-600">23.9% of Cohort</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Taliun Global Tech (Largest Single Contract)</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Corporate Retention Rate</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">97.1%</span>
                        <span className="text-xs font-semibold text-muted-foreground">Avg Across Groups</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Zero contract churn in 2025/2026</span>
                    </Card>

                    <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Highest Acuity Cohort</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">1.24</span>
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                          HCC Risk Score
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 block">Metro Transit Authority employee group</span>
                    </Card>
                  </div>
                </section>
              )}

              {(activeTab === "all" || activeTab === "graphs") && (
                <section className="stagger-section">
                  <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Active Patient Distribution across Employer Organizations</h3>
                        <p className="text-xs text-muted-foreground">Member headcounts classified by corporate contracting group</p>
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold">14,285 Total Active Members</Badge>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={EMPLOYER_DISTRIBUTION} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                          <XAxis type="number" stroke="#888888" fontSize={12} />
                          <YAxis type="category" dataKey="employer" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }}
                            formatter={(val: number, _name: string, props: { payload?: { percentage?: number } }) => [`${val.toLocaleString()} Patients (${props.payload?.percentage ?? 0}%)`, "Enrolled Members"]}
                          />
                          <Bar dataKey="count" name="Enrolled Patients" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                            {EMPLOYER_DISTRIBUTION.map((_, idx) => (
                              <Cell key={`emp-cell-${idx}`} fill={idx === 0 ? "#3b82f6" : idx === 1 ? "#10b981" : idx === 2 ? "#8b5cf6" : idx === 3 ? "#f59e0b" : "#ec4899"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </section>
              )}

              {(activeTab === "all" || activeTab === "table") && (
                <section className="stagger-section">
                  <SectionLabel>Structured Employer Matrix</SectionLabel>
                  <Card className="p-6 rounded-2xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Employer Contract Performance Roster</h3>
                        <p className="text-xs text-muted-foreground">Comparison of clinical acuity risk scores and corporate employee retention</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8.5 px-3 rounded-lg">
                        <Download className="size-3.5" />
                        <span>Export Group Roster</span>
                      </Button>
                    </div>
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground">
                            <th className="py-3 px-4">Employer Group Name</th>
                            <th className="py-3 px-4 text-right">Active Patients</th>
                            <th className="py-3 px-4 text-right">% of Cohort</th>
                            <th className="py-3 px-4 text-right">Avg Risk Score (HCC)</th>
                            <th className="py-3 px-4 text-right">Contract Retention</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium text-foreground">
                          {EMPLOYER_DISTRIBUTION.map((emp) => (
                            <tr key={emp.employer} className="hover:bg-muted/30">
                              <td className="py-3.5 px-4 font-bold text-primary flex items-center gap-2">
                                <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                                <span>{emp.employer}</span>
                              </td>
                              <td className="py-3.5 px-4 text-right tabular-nums font-semibold">{emp.count.toLocaleString()}</td>
                              <td className="py-3.5 px-4 text-right tabular-nums">{emp.percentage}%</td>
                              <td className="py-3.5 px-4 text-right tabular-nums font-bold text-purple-600 dark:text-purple-400">{emp.riskScore}</td>
                              <td className="py-3.5 px-4 text-right">
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 border shadow-none font-semibold">
                                  {emp.retention}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* OUTPUT FOR CUSTOM / FALLBACK PROMPT */}
          {/* ========================================================= */}
          {queryType === "custom" && (
            <div className="space-y-6">
              <section className="stagger-section">
                <SectionLabel>Text Summary & Key AI Insights</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Analysis Confidence</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-foreground tabular-nums">99.4%</span>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] px-2 py-0.5 border shadow-none font-semibold">
                        Verified SQL
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2 block">Query executed against live practice replica</span>
                  </Card>

                  <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Matched Records</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">2,840</span>
                      <span className="text-xs font-semibold text-muted-foreground">Data points</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2 block">Aggregated from 14 EHR &amp; claims sources</span>
                  </Card>

                  <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Benchmark Status</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">+12.4%</span>
                      <span className="text-xs font-bold text-emerald-600">Above Avg</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2 block">Outperforming national peer cohort</span>
                  </Card>

                  <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Execution SLA</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">142ms</span>
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 font-semibold text-[10px] px-2 py-0.5 shadow-none border">
                        Instant
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2 block">In-memory columnar query response</span>
                  </Card>
                </div>
              </section>

              <section className="stagger-section">
                <SectionLabel>Visual Representations (Graphs & Charts)</SectionLabel>
                <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Custom Query Multi-Metric Trend Analysis</h3>
                      <p className="text-xs text-muted-foreground">Dynamic real-time graphical synthesis generated from custom prompt parameters</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-semibold">Live Analytics</Badge>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PATIENT_GROWTH_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="customGrad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="customGrad2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Area type="monotone" name="Primary Metric Trajectory" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#customGrad1)" />
                        <Area type="monotone" name="Secondary Benchmark" dataKey="active" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#customGrad2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </section>
            </div>
          )}
        </div>
      )}
    </Page>
  );
}
