import React, { useState } from "react";
import {
  Users,
  Heart,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Download,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2
} from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { employerChips } from "../../data/filters";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// ----------------------------------------------------------------------
// DATA DEFINITIONS & CHARTS DATA
// ----------------------------------------------------------------------

// 1. Top Chronic Conditions Pie Data
const TOP_CHRONIC_PIE_DATA = [
  { name: "Hypertension", count: 98, color: "#e32168" },
  { name: "Hyperlipidemia", count: 70, color: "#22c55e" },
  { name: "Musculoskeletal", count: 68, color: "#0d9488" },
  { name: "Depression & Anxiety", count: 61, color: "#f97316" },
  { name: "Type 2 Diabetes", count: 45, color: "#ea580c" },
  { name: "Asthma", count: 35, color: "#eab308" },
];

// 2. Chronic Prevalence Trend Data (12 Months)
const PREVALENCE_TREND_DATA = [
  { month: "Jan", Hypertension: 85, Hyperlipidemia: 60, Musculoskeletal: 58, Depression: 52 },
  { month: "Feb", Hypertension: 88, Hyperlipidemia: 62, Musculoskeletal: 60, Depression: 54 },
  { month: "Mar", Hypertension: 90, Hyperlipidemia: 64, Musculoskeletal: 62, Depression: 55 },
  { month: "Apr", Hypertension: 91, Hyperlipidemia: 65, Musculoskeletal: 63, Depression: 56 },
  { month: "May", Hypertension: 93, Hyperlipidemia: 66, Musculoskeletal: 64, Depression: 57 },
  { month: "Jun", Hypertension: 94, Hyperlipidemia: 67, Musculoskeletal: 65, Depression: 58 },
  { month: "Jul", Hypertension: 95, Hyperlipidemia: 68, Musculoskeletal: 66, Depression: 59 },
  { month: "Aug", Hypertension: 96, Hyperlipidemia: 69, Musculoskeletal: 66, Depression: 60 },
  { month: "Sep", Hypertension: 97, Hyperlipidemia: 69, Musculoskeletal: 67, Depression: 60 },
  { month: "Oct", Hypertension: 98, Hyperlipidemia: 70, Musculoskeletal: 68, Depression: 61 },
  { month: "Nov", Hypertension: 98, Hyperlipidemia: 70, Musculoskeletal: 68, Depression: 61 },
  { month: "Dec", Hypertension: 98, Hyperlipidemia: 70, Musculoskeletal: 68, Depression: 61 },
];

// 3. Condition Prevalence Horizontal Bar Data
const CONDITION_PREVALENCE_BARS = [
  { name: "Hypertension", members: 98, color: "#e32168" },
  { name: "Hyperlipidemia", members: 70, color: "#65a30d" },
  { name: "Musculoskeletal", members: 68, color: "#0d9488" },
  { name: "Depression & Anxiety", members: 61, color: "#0284c7" },
  { name: "Type 2 Diabetes", members: 45, color: "#ea580c" },
  { name: "Asthma", members: 35, color: "#eab308" },
  { name: "Coronary Artery Disease", members: 30, color: "#6b21a8" },
  { name: "COPD", members: 21, color: "#059669" },
  { name: "Chronic Kidney Disease", members: 18, color: "#dc2626" },
  { name: "Heart Failure", members: 11, color: "#475569" },
];

// 4. Overall Chronic Prevalence Donut Data
const OVERALL_CHRONIC_DONUT_DATA = [
  { name: "0 Conditions", count: 226, color: "#e32168" },
  { name: "1 Condition", count: 136, color: "#65a30d" },
  { name: "2 Conditions", count: 80, color: "#eab308" },
  { name: "3+ Conditions", count: 47, color: "#ea580c" },
];

// 5. PMPM by Condition Mini KPI Data
const PMPM_CONDITION_DATA = [
  { name: "Diabetes", pmpm: "$892", diff: "+$580", colorClass: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300" },
  { name: "Hypertension", pmpm: "$687", diff: "+$375", colorClass: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300" },
  { name: "Asthma", pmpm: "$534", diff: "+$222", colorClass: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300" },
  { name: "Heart Failure", pmpm: "$1,457", diff: "+$1,145", colorClass: "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300" },
  { name: "Mental Health", pmpm: "$624", diff: "+$312", colorClass: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300" },
  { name: "Musculoskeletal", pmpm: "$578", diff: "+$266", colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300" },
];

// 6. Multimorbidity Analysis Table Data
interface MultimorbidityRow {
  id: string;
  combination: string;
  members: number;
  pmpm: string;
}

const MULTIMORBIDITY_ROWS: MultimorbidityRow[] = [
  { id: "mm-1", combination: "Hypertension + Musculoskeletal", members: 25, pmpm: "$1,245" },
  { id: "mm-2", combination: "Hyperlipidemia + Hypertension", members: 22, pmpm: "$1,087" },
  { id: "mm-3", combination: "Hyperlipidemia + Musculoskeletal", members: 17, pmpm: "$983" },
  { id: "mm-4", combination: "Depression & Anxiety + Hypertension", members: 15, pmpm: "$1,421" },
  { id: "mm-5", combination: "Hypertension + Type 2 Diabetes", members: 14, pmpm: "$867" },
  { id: "mm-6", combination: "Hyperlipidemia + Type 2 Diabetes", members: 13, pmpm: "$1,156" },
  { id: "mm-7", combination: "Asthma + Hypertension", members: 12, pmpm: "$934" },
  { id: "mm-8", combination: "Depression & Anxiety + Hyperlipidemia", members: 12, pmpm: "$1,312" },
  { id: "mm-9", combination: "Depression & Anxiety + Musculoskeletal", members: 11, pmpm: "$798" },
  { id: "mm-10", combination: "Coronary Artery Disease + Hypertension", members: 11, pmpm: "$1,063" },
];

interface ConditionSummaryRow {
  id: string;
  combination: string;
  members: number;
  pmpm: string;
}

const CONDITION_SUMMARY_ROWS: ConditionSummaryRow[] = [
  { id: "cs-1", combination: "Hypertension", members: 98, pmpm: "$687" },
  { id: "cs-2", combination: "Hyperlipidemia", members: 70, pmpm: "$687" },
  { id: "cs-3", combination: "Musculoskeletal", members: 68, pmpm: "$578" },
  { id: "cs-4", combination: "Depression & Anxiety", members: 61, pmpm: "$624" },
  { id: "cs-5", combination: "Type 2 Diabetes", members: 45, pmpm: "$892" },
  { id: "cs-6", combination: "Asthma", members: 35, pmpm: "$534" },
  { id: "cs-7", combination: "Coronary Artery Disease", members: 30, pmpm: "$1,063" },
  { id: "cs-8", combination: "COPD", members: 21, pmpm: "$1,120" },
  { id: "cs-9", combination: "Chronic Kidney Disease", members: 18, pmpm: "$1,450" },
  { id: "cs-10", combination: "Heart Failure", members: 11, pmpm: "$1,457" },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT EXPORT
// ----------------------------------------------------------------------
export function EmployerChronicPage() {
  const [activeTab, setActiveTab] = useState<"multimorbidity" | "summary">("multimorbidity");

  const tableColumns: Column<MultimorbidityRow | ConditionSummaryRow>[] = [
    {
      header: activeTab === "multimorbidity" ? "Condition Combination" : "Condition Name",
      key: "combination",
      sortable: true,
      cell: (row) => <span className="font-bold text-foreground">{row.combination}</span>,
    },
    {
      header: "Members",
      key: "members",
      align: "right",
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-foreground">{row.members}</span>,
    },
    {
      header: "PMPM",
      key: "pmpm",
      align: "right",
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-primary">{row.pmpm}</span>,
    },
  ];

  return (
    <Page
      title="Chronic Conditions"
      subtitle="Disease prevalence, cost drivers, and multi-condition burden"
      chips={employerChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* ----------------------------------------------------------------------
          1. TOP ROW: 4 KPI CARDS
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Activity}
            title="Chronic Burden"
            value="53.8%"
            caption="263 members w/ condition"
            info="Percentage of total population diagnosed with at least one chronic condition."
          />
          <KpiCard
            icon={Heart}
            title="Members w/ Condition"
            value="263"
            caption="53.8% of population"
            info="Count of distinct members diagnosed with one or more chronic conditions."
          />
          <KpiCard
            icon={Users}
            title="Multi-Condition Members"
            value="127"
            caption="2 or more conditions"
            info="Count of members diagnosed with two or more concurrent chronic conditions."
          />
          <KpiCard
            icon={DollarSign}
            title="Total Chronic Spend"
            value="$1.8M"
            caption="allowed cost (attributed)"
            info="Cumulative allowed medical spend attributed directly to chronic care management."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. SECOND ROW: PMPM BY CONDITION (6 MINI CARDS)
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-foreground">PMPM by Condition</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Per member per month cost vs. baseline ($312)</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {PMPM_CONDITION_DATA.map((item) => (
            <div key={item.name} className="p-4 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between hover:border-border transition-all">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-foreground truncate" title={item.name}>{item.name}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 flex items-center gap-0.5 ${item.colorClass}`}>
                  <TrendingUp className="size-2.5" />
                  <span>{item.diff}</span>
                </span>
              </div>
              <div className="text-xl font-mono font-black text-foreground mt-1">{item.pmpm}</div>
              <div className="text-[11px] font-medium text-muted-foreground mt-0.5">vs. baseline $312</div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. THIRD ROW: TOP CHRONIC CONDITIONS PIE & PREVALENCE TREND LINE
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6 stagger-section">
        {/* Card A: Top Chronic Conditions */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Top Chronic Conditions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Member prevalence count</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-2">
              {/* Legend Breakdown */}
              <div className="space-y-2.5 text-xs">
                {TOP_CHRONIC_PIE_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between font-medium">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground font-semibold">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-muted-foreground">- {item.count}</span>
                  </div>
                ))}
              </div>

              {/* Donut Chart */}
              <div className="h-[220px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TOP_CHRONIC_PIE_DATA}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      label={({ count }) => `${count}`}
                    >
                      {TOP_CHRONIC_PIE_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number, name: string) => [`${val} Members`, name]}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        {/* Card B: Chronic Prevalence Trend */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Chronic Prevalence Trend</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Monthly member count by condition</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">Hypertension</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">Hyperlipidemia</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300">Musculoskeletal</span>
                <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300">Depression</span>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PREVALENCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Line type="monotone" dataKey="Hypertension" stroke="#e32168" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Hyperlipidemia" stroke="#22c55e" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Musculoskeletal" stroke="#0d9488" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Depression" stroke="#f97316" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-3 pt-2.5 border-t border-border/50 text-xs font-bold text-foreground">
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#e32168]" /><span>Hypertension</span></div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#22c55e]" /><span>Hyperlipidemia</span></div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#0d9488]" /><span>Musculoskeletal</span></div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#f97316]" /><span>Depression & Anxiety</span></div>
          </div>
        </Card>
      </div>

      {/* ----------------------------------------------------------------------
          4. FOURTH ROW: CONDITION PREVALENCE BAR & OVERALL PREVALENCE DONUT
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6 stagger-section">
        {/* Card C: Condition Prevalence Horizontal Bar */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Condition Prevalence</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Members by chronic condition (conditions with &lt;5 members grouped as &quot;Other&quot;)</p>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={CONDITION_PREVALENCE_BARS} margin={{ top: 5, right: 30, left: 65, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} opacity={0.6} />
                  <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fontWeight: 600 }} />
                  <RechartsTooltip
                    formatter={(val: number) => [`${val} Members`, "Count"]}
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="members" radius={[0, 4, 4, 0]} barSize={12}>
                    {CONDITION_PREVALENCE_BARS.map((entry, idx) => (
                      <Cell key={`bar-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pink Alert Box inside Bar Card */}
          <div className="mt-4 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3.5 flex items-start sm:items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <TrendingDown className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">High prevalence</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
                Hyperlipidemia prevalence is <span className="font-semibold">19.1% (94 employees)</span>. PMPM: $687.43. 31 are not engaged with DPC.
              </p>
            </div>
          </div>
        </Card>

        {/* Card D: Overall Chronic Prevalence Donut */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Overall Chronic Prevalence</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Distribution by number of chronic conditions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-3">
              {/* Legend List */}
              <div className="space-y-3 text-xs">
                {OVERALL_CHRONIC_DONUT_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between font-medium">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground font-semibold">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-muted-foreground">- {item.count}</span>
                  </div>
                ))}
              </div>

              {/* Donut Chart */}
              <div className="h-[220px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={OVERALL_CHRONIC_DONUT_DATA}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      label={({ count }) => `${count}`}
                    >
                      {OVERALL_CHRONIC_DONUT_DATA.map((entry, idx) => (
                        <Cell key={`donut-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number, name: string) => [`${val} Members`, name]}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pink Alert Box inside Donut Card */}
          <div className="mt-4 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3.5 flex items-start sm:items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Multimorbidity cost</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
                <span className="font-semibold">17.8% have 3+ conditions (88 employees)</span>. This group accounts for 42% of total claims. PMPM: $1,247.89 vs. $312.45 for 0 conditions.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ----------------------------------------------------------------------
          5. FIFTH ROW: MULTIMORBIDITY ANALYSIS TABLE
          ---------------------------------------------------------------------- */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-2xs mb-6 overflow-hidden stagger-section">
        {/* Header Bar with Pill Switch */}
        <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {activeTab === "multimorbidity" ? "Multimorbidity Analysis" : "Condition Summary"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeTab === "multimorbidity" ? "Top 10 condition combinations by member count" : "Overall member counts and PMPM costs by individual condition"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("multimorbidity")}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                activeTab === "multimorbidity"
                  ? "bg-rose-50 border border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-300 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground font-semibold"
              }`}
            >
              Multimorbidity Analysis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                activeTab === "summary"
                  ? "bg-rose-50 border border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-300 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground font-semibold"
              }`}
            >
              Condition Summary
            </button>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={tableColumns}
          rows={activeTab === "multimorbidity" ? MULTIMORBIDITY_ROWS : CONDITION_SUMMARY_ROWS}
          rowKey={(r) => r.id}
          attached={true}
        />
      </Card>
    </Page>
  );
}
