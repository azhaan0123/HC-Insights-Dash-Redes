import React, { useState, useMemo } from "react";
import { 
  Trophy, 
  Award, 
  DollarSign, 
  Sliders, 
  Download, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Calendar, 
  FileCheck, 
  TrendingUp,
  Info,
  ExternalLink,
  Activity
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { ChartTooltip } from "../../components/dashboard/ChartTooltip";
import { KpiSparklineCard } from "../../components/dashboard/KpiSparklineCard";
import { 
  MIPS_SCORE_TREND, 
  MIPS_CATEGORY_PERFORMANCE, 
  MIPS_PROVIDERS, 
  MIPS_QUALITY_MEASURES, 
  MIPS_IMPROVEMENT_ACTIVITIES,
  type MipsProviderRow 
} from "./MipsData";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { cn } from "../../components/ui/utils";
import { Page } from "../../components/layout/Page";
import { mipsChips } from "../../data/filters";

const kpiDataComposite = [
  { day: "Tue", value: 74.2 },
  { day: "Wed", value: 75.1 },
  { day: "Thu", value: 76.4 },
  { day: "Fri", value: 77.9 },
];

const kpiDataQuality = [
  { day: "Tue", value: 39.5 },
  { day: "Wed", value: 40.2 },
  { day: "Thu", value: 41.0 },
  { day: "Fri", value: 42.1 },
];

const kpiDataCost = [
  { day: "Tue", value: 14.8 },
  { day: "Wed", value: 15.2 },
  { day: "Thu", value: 15.6 },
  { day: "Fri", value: 16.1 },
];

const kpiDataPi = [
  { day: "Tue", value: 17.5 },
  { day: "Wed", value: 18.0 },
  { day: "Thu", value: 18.5 },
  { day: "Fri", value: 19.1 },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase font-semibold">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

export default function MipsDashboard() {
  const [trendPeriod, setTrendPeriod] = useState<"12M" | "6M" | "3M">("12M");
  const [providerFilter, setProviderFilter] = useState<string>("All Providers");

  // Filter provider roster if dropdown or filter changed
  const filteredProviders = useMemo(() => {
    if (providerFilter === "All Providers") return MIPS_PROVIDERS;
    return MIPS_PROVIDERS.filter(p => p.specialty === providerFilter || p.name.includes(providerFilter));
  }, [providerFilter]);

  const providerColumns: Column<MipsProviderRow>[] = [
    {
      key: "provider",
      header: "Provider",
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div 
            className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: row.avatarColor }}
          >
            {row.avatar}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">{row.name}</span>
            <span className="text-xs text-muted-foreground truncate">{row.specialty}</span>
          </div>
        </div>
      ),
    },
    {
      key: "score",
      header: "MIPS Score",
      align: "center",
      cell: (row) => (
        <span 
          className={cn(
            "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums shadow-sm",
            row.score >= 90 
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" 
              : row.score >= 80 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" 
              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
          )}
        >
          {row.score.toFixed(1)}
        </span>
      ),
    },
    {
      key: "quality",
      header: "Quality",
      align: "right",
      cell: (row) => <span className="text-sm tabular-nums text-foreground">{row.quality.toFixed(1)}</span>,
    },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      cell: (row) => <span className="text-sm tabular-nums text-foreground">{row.cost.toFixed(1)}</span>,
    },
    {
      key: "pi",
      header: "PI",
      align: "right",
      cell: (row) => <span className="text-sm tabular-nums text-foreground">{row.pi.toFixed(1)}</span>,
    },
    {
      key: "ia",
      header: "IA",
      align: "right",
      cell: (row) => <span className="text-sm tabular-nums text-foreground">{row.ia.toFixed(1)}</span>,
    },
    {
      key: "trend",
      header: "Trend",
      align: "right",
      cell: (row) => (
        <span 
          className={cn(
            "inline-flex items-center text-xs font-semibold tabular-nums",
            row.trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}
        >
          {row.trend}
        </span>
      ),
    },
  ];

  return (
    <Page
      title="MIPS Performance Dashboard"
      subtitle="Comprehensive overview of Merit-based Incentive Payment System metrics and category breakdowns."
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* 1. Top KPI Cards Row */}
      <section className="stagger-section mb-6">
        <SectionLabel>Performance Overview</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiSparklineCard 
            title="MIPS Composite Score" 
            value="77.9 / 100" 
            change="↑ +3.2 pts" 
            changeType="positive" 
            data={kpiDataComposite} 
            dataKey="value" 
            color="#f43f5e" 
            className="bg-gradient-to-br from-pink-100/90 via-pink-50/40 to-white dark:from-pink-950/50 dark:via-pink-950/20 dark:to-card border border-pink-200/80 dark:border-pink-800/50"
          />
          <KpiSparklineCard 
            title="Quality Score (45% wt)" 
            value="42.1" 
            change="↑ 4.1%" 
            changeType="positive" 
            data={kpiDataQuality} 
            dataKey="value" 
            color="#10b981" 
          />
          <KpiSparklineCard 
            title="Cost Score (30% wt)" 
            value="16.1" 
            change="↑ 1.8%" 
            changeType="positive" 
            data={kpiDataCost} 
            dataKey="value" 
            color="#3b82f6" 
          />
          <KpiSparklineCard 
            title="PI Score (25% wt)" 
            value="19.1" 
            change="↑ 2.3%" 
            changeType="positive" 
            data={kpiDataPi} 
            dataKey="value" 
            color="#8b5cf6" 
          />
        </div>
      </section>

      {/* 3. Charts Row: MIPS Score Trend & Category Performance */}
      <section className="stagger-section mb-6">
        <SectionLabel>Performance Trends & Category Weights</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Trend (7 cols) */}
        <Card className="lg:col-span-7 rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-foreground">MIPS Score Trend</h3>
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/40">
              {(["12M", "6M", "3M"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTrendPeriod(period)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150",
                    trendPeriod === period
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MIPS_SCORE_TREND} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                />
                <YAxis 
                  domain={[70, 100]} 
                  ticks={[70, 80, 90, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                />
                <RechartsTooltip content={<ChartTooltip valueFormatter={(v) => `${v.toFixed(1)} pts`} />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  name="Score" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#scoreTrendGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Category Performance (5 cols) */}
        <Card className="lg:col-span-5 rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-base font-bold text-foreground">Category Performance</h3>
              <span className="text-xs font-medium text-muted-foreground">Current Period</span>
            </div>
            <div className="h-[185px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MIPS_CATEGORY_PERFORMANCE}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="score"
                  >
                    {MIPS_CATEGORY_PERFORMANCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltip valueFormatter={(v) => `${v.toFixed(1)} pts`} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-medium text-foreground tabular-nums tracking-tight">77.9</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60">
            {MIPS_CATEGORY_PERFORMANCE.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium text-foreground tabular-nums">{cat.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </section>

      {/* 4. AI Predictive Analytics Section */}
      <section className="stagger-section mb-6">
        <SectionLabel>AI Predictive & Outcome Modeling</SectionLabel>
        <Card className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border/60 pb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span>AI Predictive Analytics</span>
          </h2>
          <Badge variant="outline" className="rounded-full bg-muted/60 text-xs font-semibold px-3 py-0.5 border-border">
            AI Powered
          </Badge>
        </div>

        {/* 3 AI Sub-cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1: Payment Prediction */}
          <div className="rounded-xl border border-border/80 bg-muted/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <DollarSign className="size-4 text-primary" />
                <span>Payment Prediction</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-medium text-foreground tabular-nums tracking-tight">~ 0%</span>
                <span className="text-xs font-medium text-muted-foreground">Estimated: $0</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">Confidence:</span>
                <span className="font-medium text-foreground tabular-nums">87%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "87%" }} />
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  MEDIUM RISK
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Compliance Risks */}
          <div className="rounded-xl border border-border/80 bg-muted/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <AlertTriangle className="size-4 text-amber-500" />
                <span>Compliance Risks</span>
              </div>
              <div className="mt-3">
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  No compliance risks identified
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
              All reporting criteria verified across quality and interoperability domains.
            </div>
          </div>

          {/* Card 3: Outcome Predictions */}
          <div className="rounded-xl border border-border/80 bg-muted/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Outcome Predictions</span>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">Controlling Blood Pressure</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">~ Predicted: 95.93%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Improvement potential +3.20%</p>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">Depression Remission</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">~ Predicted: 97.00%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Improvement potential +2.54%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles className="size-4 text-primary" />
            <span>AI Recommendations</span>
          </div>
          <div className="space-y-2.5 pl-1">
            <div className="flex items-start gap-3 text-xs md:text-sm text-foreground/90 font-medium">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary font-bold text-xs mt-0.5">
                1
              </span>
              <span>Target composite score above 82.5 points to achieve positive payment adjustment</span>
            </div>
            <div className="flex items-start gap-3 text-xs md:text-sm text-foreground/90 font-medium">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary font-bold text-xs mt-0.5">
                2
              </span>
              <span>Monitor quarterly performance trends to identify improvement opportunities</span>
            </div>
          </div>
        </div>

        {/* AI Analysis Banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 text-xs md:text-sm text-foreground">
          <Info className="size-5 shrink-0 text-primary" />
          <div>
            <span className="font-semibold text-foreground">AI Analysis: </span>
            <span className="text-muted-foreground">
              Based on composite score of 77.9 points, projected 0% payment adjustment. Practice revenue impact estimated at $0.
            </span>
          </div>
        </div>
      </Card>
      </section>

      {/* 5. Quality Measures Performance & Improvement Activities Row */}
      <section className="stagger-section mb-6">
        <SectionLabel>Quality & Improvement Activities</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quality Measures Performance */}
        <Card className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h3 className="text-base font-bold text-foreground">Quality Measures Performance</h3>
              <a href="#all-measures" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                <span>View All Measures</span>
              </a>
            </div>
            <div className="divide-y divide-border/60">
              {MIPS_QUALITY_MEASURES.map((measure) => (
                <div key={measure.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-foreground block truncate">{measure.name}</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">{measure.cmsCode} • {measure.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground tabular-nums block">{measure.rate}</span>
                      <span className="text-[10px] text-muted-foreground block">Performance Rate</span>
                    </div>
                    <div className={cn("grid size-8 place-items-center rounded-full border-2 text-xs font-bold shadow-sm", measure.colorClass)}>
                      {measure.scoreBadge}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: Improvement Activities */}
        <Card className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-bold text-foreground">Improvement Activities</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                15% weight
              </span>
            </div>
            <div className="pb-4 border-b border-border/60">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="text-muted-foreground">Current Progress</span>
                <span className="font-medium text-foreground tabular-nums">2 / 3 activities</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "66.6%" }} />
              </div>
            </div>
            <div className="divide-y divide-border/60">
              {MIPS_IMPROVEMENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex items-start gap-2">
                    <span className="text-primary font-bold text-base leading-none mt-0.5">•</span>
                    <div>
                      <span className="text-sm font-semibold text-foreground block truncate">{act.name}</span>
                      <span className="text-xs text-muted-foreground block mt-0.5">{act.code} • {act.weight}</span>
                    </div>
                  </div>
                  <span 
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 shadow-sm",
                      act.status === "Complete" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    )}
                  >
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      </section>

      {/* 6. Provider Performance Comparison Table */}
      <section className="stagger-section mb-6">
        <SectionLabel>Provider Comparison & Benchmarks</SectionLabel>
        <Card className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <h3 className="text-base font-bold text-foreground">Provider Performance Comparison</h3>
          <div className="flex items-center gap-3">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="h-8.5 rounded-lg border bg-background px-3 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
            >
              <option value="All Providers">All Providers</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Physical Medicine">Physical Medicine</option>
              <option value="Preventive Medicine">Preventive Medicine</option>
              <option value="Radiology">Radiology</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Surgery">Surgery</option>
            </select>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8.5 px-3 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 transition-colors"
            >
              Export Data
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 overflow-hidden bg-background">
          <DataTable
            columns={providerColumns}
            rows={filteredProviders}
            rowKey={(r) => r.id}
            pageSize={15}
            showFilterBar={false}
          />
        </div>
      </Card>
      </section>

      {/* 7. Performance Insights & Upcoming Deadlines Row */}
      <section className="stagger-section mb-6">
        <SectionLabel>Performance Insights & Key Deadlines</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Performance Insights */}
          <Card className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground pb-4 border-b border-border/60">Performance Insights</h3>
              <div className="space-y-3.5 pt-4">
                {/* Insight 1: Quality Above Benchmark */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/40 dark:bg-emerald-950/20 p-4 flex gap-3.5 shadow-sm">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      Quality Performance Above Benchmark
                    </h4>
                    <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-400/80 mt-1 leading-relaxed">
                      Your quality score of 42.1 exceeds the national average. Strong performance in diabetes and hypertension measures.
                    </p>
                  </div>
                </div>

                {/* Insight 2: Improvement Activities Gap */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-800/40 dark:bg-amber-950/20 p-4 flex gap-3.5 shadow-sm">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-500 text-white shadow-sm">
                    <AlertTriangle className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                      Improvement Activities Gap
                    </h4>
                    <p className="text-xs font-medium text-amber-800/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                      Complete 1 more activity to maximize IA category points. Consider population management initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right: Upcoming Deadlines */}
          <Card className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground pb-4 border-b border-border/60">Upcoming Deadlines</h3>
              <div className="space-y-3.5 pt-4">
                {/* Deadline 1: Q4 Data Submission */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex items-center justify-between gap-4 shadow-sm transition-colors hover:bg-muted/20">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 shadow-inner">
                      <Calendar className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-foreground block truncate">Q4 Data Submission</span>
                      <span className="text-xs text-muted-foreground block mt-0.5 truncate">Quality and PI measures due</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block">Dec 31, 2026</span>
                    <span className="text-[11px] font-medium text-muted-foreground block mt-0.5">⏱ 24 days remaining</span>
                  </div>
                </div>

                {/* Deadline 2: IA Documentation */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex items-center justify-between gap-4 shadow-sm transition-colors hover:bg-muted/20">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-inner">
                      <FileCheck className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-foreground block truncate">IA Documentation</span>
                      <span className="text-xs text-muted-foreground block mt-0.5 truncate">Complete attestation forms</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 block">Jan 15, 2027</span>
                    <span className="text-[11px] font-medium text-muted-foreground block mt-0.5">⏱ 39 days remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Page>
  );
}
