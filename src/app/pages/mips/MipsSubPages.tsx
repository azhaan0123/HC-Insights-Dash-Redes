import React from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import {
  Sparkles,
  ShieldCheck,
  BadgeDollarSign,
  Sliders,
  ClipboardCheck,
  Users,
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Filter,
  Check,
  Clock,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Plus,
  DollarSign,
  Activity,
  Calendar,
} from "../../lib/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "../../components/dashboard/ChartTooltip";
import { MIPS_QUALITY_MEASURES, MIPS_IMPROVEMENT_ACTIVITIES, MIPS_PROVIDERS } from "./MipsData";
import { DataTable } from "../../components/dashboard/DataTable";
import { Page } from "../../components/layout/Page";
import { cn } from "../../components/ui/utils";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { mipsChips } from "../../data/filters";

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase font-semibold">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

export function MipsAiAssistantPage() {
  return (
    <Page
      title="MIPS Helix Assistant"
      subtitle="Predictive analytics, gap detection, and real-time CMS compliance recommendations"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Helix Assistant" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
      actions={
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-semibold text-xs shadow-2xs">
          Active AI Engine v3.4
        </Badge>
      }
    >
      <section className="stagger-section mb-6">
        <SectionLabel>Predictive Analytics & Recommendations</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={Sparkles}
            title="Estimated Adjustment"
            value="~ 0.00%"
            caption="Based on current composite score of 77.9 / 100"
            info="Projected CMS payment adjustment percentage based on your current predicted decile standing."
          />
          <KpiCard
            icon={ArrowUpRight}
            title="Top Priority Action"
            value="+0.8 Points"
            caption="Complete 1 Improvement Activity"
            info="Completing an additional Improvement Activity will boost your composite score from 77.9 to 78.7."
          />
          <KpiCard
            icon={CheckCircle2}
            title="CMS Submission Status"
            value="Ready for Pre-Audit"
            caption="All quality data feeds active & validated"
            info="Electronic health record integration feeds are actively syncing and meeting 2026 data completeness thresholds."
          />
        </div>
      </section>

      <section className="stagger-section mb-6">
        <SectionLabel>Interactive AI Query</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground">Interactive AI Query & Recommendations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ask Helix specifically how to maximize quality points or optimize specialty-specific benchmarks for 2026.
            </p>
          </div>
          <div className="flex gap-3 pt-1">
            <input 
              type="text" 
              placeholder="e.g. Which quality measure will yield the highest point increase if improved by 5%?" 
              className="flex-1 h-10 px-3.5 text-sm rounded-xl border bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <Button className="h-10 px-6 rounded-xl font-semibold gap-2 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
              <Sparkles className="size-4" />
              <span>Analyze</span>
            </Button>
          </div>
        </Card>
      </section>
    </Page>
  );
}

export function MipsQualityMeasuresPage() {
  return (
    <Page
      title="Quality Measures"
      subtitle="Dr. Amanda Johnson • Performance Year 2026"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Quality Measures" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
      actions={
        <Button size="sm" variant="default" className="gap-1.5 text-xs font-medium h-8.5 px-3.5 rounded-lg shadow-2xs transition-all">
          <Download className="size-3.5" />
          <span>Export QRDA III</span>
        </Button>
      }
    >
      {/* 1. Top Summary KPI Cards Row matching Screenshot 1 */}
      <section className="stagger-section mb-6">
        <SectionLabel>Quality Measures Overview</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={ClipboardCheck}
            title="Reported Measures"
            value="4"
            caption="Total measures reported"
            info="Count of electronic Clinical Quality Measures (eCQMs) successfully tracked."
          />
          <KpiCard
            icon={ArrowUpRight}
            title="Average Decile"
            value="Decile 7"
            caption="Across active eCQMs"
            info="The average national performance benchmark decile achieved across all reported quality measures."
          />
          <KpiCard
            icon={CheckCircle2}
            title="Meeting Threshold"
            value="3 / 4"
            caption="Measures meeting threshold (75%)"
            info="Number of quality measures currently exceeding the minimum CMS performance threshold required to avoid penalties."
          />
          <KpiCard
            icon={FileText}
            title="High Priority"
            value="2"
            caption="Outcome measures active"
            info="Count of high-priority or outcome measures that yield bonus points in the CMS scoring formula."
          />
        </div>
      </section>

      {/* 2. Active Quality Measures Analysis Section with Search Input */}
      <section className="stagger-section mb-6">
        <SectionLabel>Active Quality Measures Analysis</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Active Quality Measures Analysis</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Performance rates, decile scores, and benchmark status across reported measures</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search quality measures..."
                className="h-9 px-3.5 text-xs rounded-xl border bg-background text-foreground shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500/40 w-full sm:w-64"
              />
              <Badge variant="outline" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted/30 shrink-0">
                {MIPS_QUALITY_MEASURES.length} Measures
              </Badge>
            </div>
          </div>
          <div className="space-y-3.5 pt-1">
            {MIPS_QUALITY_MEASURES.map((measure) => {
              const isHighPriority = measure.priority.includes("High");
              const isMediumPriority = measure.priority.includes("Medium");
              const priorityBadgeClass = isHighPriority
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50"
                : isMediumPriority
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
                : "bg-amber-50/60 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40";

              return (
                <div
                  key={measure.id}
                  className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm font-bold text-foreground">{measure.name}</span>
                      <Badge className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md border shadow-none", priorityBadgeClass)}>
                        {measure.priority}
                      </Badge>
                      {measure.type && (
                        <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground bg-card px-2 py-0.5 rounded-md border border-border/80 shadow-none">
                          {measure.type}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium flex flex-wrap items-center gap-3">
                      <span>{measure.cmsCode}</span>
                      {measure.benchmark && (
                        <>
                          <span className="opacity-60">•</span>
                          <span>National Benchmark: <strong className="text-foreground">{measure.benchmark}</strong></span>
                        </>
                      )}
                      <span className="opacity-60">•</span>
                      <span>Performance Rate: <strong className="text-foreground">{measure.rate}</strong></span>
                    </div>
                    {/* Decile Progress Bar */}
                    <div className="pt-1.5 flex items-center gap-3 max-w-md">
                      <div className="w-full h-1.5 rounded-full bg-muted/80 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            parseInt(measure.scoreBadge) >= 7 ? "bg-emerald-600 dark:bg-emerald-500" : "bg-amber-600 dark:bg-amber-500"
                          )}
                          style={{ width: `${(parseInt(measure.scoreBadge) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground shrink-0">Decile {measure.scoreBadge}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 justify-end shrink-0">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-foreground tabular-nums block">Decile {measure.scoreBadge}</span>
                      <span className="text-[11px] font-medium text-muted-foreground block mt-0.5">{parseInt(measure.scoreBadge) * 1.25} pts earned</span>
                    </div>
                    <div
                      className={cn(
                        "grid size-11 place-items-center rounded-2xl border font-extrabold text-base shadow-2xs transition-transform duration-200 hover:scale-105",
                        parseInt(measure.scoreBadge) >= 7
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                          : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                      )}
                    >
                      {measure.scoreBadge}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* 3. Bottom Section: Category Performance & Insights */}
      <section className="stagger-section mb-6">
        <SectionLabel>Category Breakdown & Insights</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Measure Category Performance Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Measure Category Performance</h3>
            <div className="space-y-4 pt-1 flex-1 flex flex-col justify-around">
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-foreground">Clinical Quality Measures (CQMs)</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">3 / 4 Measures</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/80 overflow-hidden">
                  <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-foreground">Patient Safety & Outcome Measures</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">2 / 2 Measures</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/80 overflow-hidden">
                  <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Insights Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Performance Insights</h3>
            <div className="space-y-4 pt-1 flex-1 flex flex-col justify-around">
              <div className="bg-emerald-50/70 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/40 rounded-2xl p-4.5 space-y-1.5">
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Strong Performance: Decile 8+</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                  Controlling Blood Pressure and Breast Cancer Screening are performing in top national deciles, securing maximum quality points.
                </p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/40 rounded-2xl p-4.5 space-y-1.5">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Focus Area: Diabetes HbA1c Control</h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed font-medium">
                  Improving Diabetes HbA1c Control (&lt; 8%) by just 3.2% will push your standing from Decile 5 to Decile 7, adding +2.5 domain points.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Page>
  );
}

const costTrendData = [
  { month: "Jan", cost: 11.2 },
  { month: "Feb", cost: 12.0 },
  { month: "Mar", cost: 12.5 },
  { month: "Apr", cost: 13.1 },
  { month: "May", cost: 13.8 },
  { month: "Jun", cost: 14.2 },
  { month: "Jul", cost: 14.5 },
  { month: "Aug", cost: 14.9 },
  { month: "Sep", cost: 15.2 },
  { month: "Oct", cost: 15.6 },
  { month: "Nov", cost: 15.9 },
  { month: "Dec", cost: 16.1 },
];

export function MipsCostPerformancePage() {
  return (
    <Page
      title="Cost Performance"
      subtitle="Dr. Amanda Johnson • Performance Year 2026"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Cost Performance" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* 1. Top KPI Summary Row */}
      <section className="stagger-section mb-6">
        <SectionLabel>Cost Performance Overview</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={DollarSign}
            title="Current Cost Score"
            value="16.1 / 30"
            caption="53.6% • 30% total domain weight"
            info="Score derived from Medicare Spending Per Beneficiary (MSPB) and total per capita cost measures."
          />
          <KpiCard
            icon={ArrowUpRight}
            title="Cost Efficiency"
            value="87%"
            caption="↑ +5.2% from last quarter"
            info="Overall efficiency percentage compared to regional and national specialty averages."
          />
          <KpiCard
            icon={ArrowDownRight}
            title="Cost Per Episode"
            value="$2,845"
            caption="↓ -$127 from specialty benchmark"
            info="Risk-adjusted average cost per attributed clinical episode during the performance period."
          />
        </div>
      </section>

      {/* 2. Middle Row: Historical Trend & Categories */}
      <section className="stagger-section mb-6">
        <SectionLabel>Trend Analysis & Categories</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card: Cost Score Trend Line Chart */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-base font-bold text-foreground">Cost Score Trend</h3>
              <Badge variant="outline" className="text-xs font-semibold bg-muted/30">Last 12 Months</Badge>
            </div>
            <div className="h-[230px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="costTrendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[8, 18]} ticks={[8, 12, 16]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <RechartsTooltip content={<ChartTooltip valueFormatter={(v) => `${v.toFixed(1)} pts`} />} />
                  <Area type="monotone" dataKey="cost" name="Cost Score" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#costTrendGradient)" isAnimationActive={true} animationDuration={800} animationEasing="ease-in-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Right Card: Cost Categories List */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-base font-bold text-foreground">Cost Categories</h3>
              <span className="text-xs font-semibold text-muted-foreground">3 Active Categories</span>
            </div>
            <div className="space-y-4 pt-2 flex-1 flex flex-col justify-around">
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Total Per Capita Cost</span>
                  <span className="text-xs text-muted-foreground">TPCC across attributed beneficiaries</span>
                </div>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">5.2 points</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Medicare Spending Per Beneficiary</span>
                  <span className="text-xs text-muted-foreground">MSPB clinician evaluation score</span>
                </div>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">4.1 points</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Episode-Based Cost Measures</span>
                  <span className="text-xs text-muted-foreground">Procedural and chronic clinical condition episodes</span>
                </div>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">3.5 points</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Bottom Row: Cost Performance Insights */}
      <section className="stagger-section mb-6">
        <SectionLabel>Cost Performance Insights</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Cost Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-emerald-50/70 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/40 rounded-2xl p-4.5 space-y-3">
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Strengths</h4>
              <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  <span>Efficient care coordination reducing readmissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  <span>Strong preventive care programs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  <span>Effective chronic disease management</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/40 rounded-2xl p-4.5 space-y-3">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Improvement Opportunities</h4>
              <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" />
                  <span>Optimize medication management</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" />
                  <span>Reduce emergency department utilization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" />
                  <span>Improve post-acute care transitions</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </Page>
  );
}

export function MipsInteroperabilityPage() {
  return (
    <Page
      title="Promoting Interoperability"
      subtitle="Dr. Amanda Johnson • Performance Year 2026"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Promoting Interoperability" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* 1. Top Summary KPI Cards Row */}
      <section className="stagger-section mb-6">
        <SectionLabel>PI Domain Overview</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={Sliders}
            title="PI Score"
            value="19.1 / 25"
            caption="76.4% • 25% total domain weight"
            info="Score derived from objective measures including e-Prescribing, HIE bi-directional exchange, and patient portal access."
          />
          <KpiCard
            icon={CheckCircle2}
            title="Required Measures"
            value="2 / 2"
            caption="All mandatory objectives complete"
            info="Both mandatory Promoting Interoperability core objectives have met the required verification standards."
          />
          <KpiCard
            icon={Clock}
            title="Bonus Measures"
            value="1 / 2"
            caption="1 measure currently in progress"
            info="Optional public health registry and clinical data exchange bonus measures that add up to 5 points to the PI domain."
          />
        </div>
      </section>

      {/* 2. PI Measures Status Section */}
      <section className="stagger-section mb-6">
        <SectionLabel>PI Measures Status</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-base font-bold text-foreground">PI Measures Status</h3>
            <span className="text-xs font-semibold text-muted-foreground">4 Objectives Reported</span>
          </div>
          <div className="space-y-3.5 pt-1">
            {/* e-Prescribing */}
            <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-foreground">e-Prescribing</span>
                  <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50 text-[11px] font-semibold px-2 py-0.5 rounded-md border shadow-none">
                    Required
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium pl-4.5">Electronic prescribing of medications</p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Complete
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">10 pts</span>
              </div>
            </div>

            {/* Health Information Exchange */}
            <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-foreground">Health Information Exchange</span>
                  <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50 text-[11px] font-semibold px-2 py-0.5 rounded-md border shadow-none">
                    Required
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium pl-4.5">Bi-directional exchange of health information</p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Complete
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">10 pts</span>
              </div>
            </div>

            {/* Provider to Patient Exchange */}
            <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-foreground">Provider to Patient Exchange</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium pl-4.5">Provide patients access to health information</p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  In Progress
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">5 pts</span>
              </div>
            </div>

            {/* Consumer Access API */}
            <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-foreground">Consumer Access API</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium pl-4.5">Patients can access health information via API</p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Complete
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">5 pts</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Bottom Row: Security & Privacy + Insights */}
      <section className="stagger-section mb-6">
        <SectionLabel>Security Compliance & Insights</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security & Privacy Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Security & Privacy</h3>
            <div className="space-y-3 pt-1 flex-1 flex flex-col justify-around">
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <Check className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm font-bold text-foreground">Security Risk Assessment</span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5 rounded-lg border shadow-none">
                  Complete
                </Badge>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <Check className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm font-bold text-foreground">Multi-factor Authentication</span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5 rounded-lg border shadow-none">
                  Complete
                </Badge>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <Check className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm font-bold text-foreground">Encryption of Data</span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5 rounded-lg border shadow-none">
                  Complete
                </Badge>
              </div>
            </div>
          </Card>

          {/* Performance Insights Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Performance Insights</h3>
            <div className="space-y-4 pt-1 flex-1 flex flex-col justify-around">
              <div className="bg-blue-50/70 border border-blue-200/60 dark:bg-blue-950/20 dark:border-blue-800/40 rounded-2xl p-4.5 flex gap-3.5">
                <Info className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Strong Foundation</h4>
                  <p className="text-xs text-blue-800/80 dark:text-blue-400/80 mt-1 leading-relaxed">
                    All required PI measures are complete with excellent compliance rates.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/40 rounded-2xl p-4.5 flex gap-3.5">
                <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Opportunity</h4>
                  <p className="text-xs text-amber-800/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                    Complete Provider to Patient Exchange measure to earn additional bonus points.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Page>
  );
}

export function MipsImprovementActivitiesPage() {
  return (
    <Page
      title="Improvement Activities"
      subtitle="Dr. Amanda Johnson • Performance Year 2026"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Improvement Activities" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
      actions={
        <Button size="sm" variant="default" className="gap-1.5 text-xs font-medium h-8.5 px-3.5 rounded-lg shadow-2xs transition-all">
          <Plus className="size-3.5" />
          <span>Add Activity</span>
        </Button>
      }
    >
      {/* 1. Top Summary KPI Cards Row (4 Columns matching Screenshot 3) */}
      <section className="stagger-section mb-6">
        <SectionLabel>IA Domain Overview</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={ClipboardCheck}
            title="Total Points"
            value="35"
            caption="100% of required domain score (15% weight)"
            info="Total points accumulated from active and completed improvement activities."
          />
          <KpiCard
            icon={Check}
            title="Completed"
            value="2"
            caption="Activities fully attested"
            info="Number of improvement activities with 90+ continuous days of completed documentation."
          />
          <KpiCard
            icon={Clock}
            title="In Progress"
            value="1"
            caption="Currently tracking adherence"
            info="Count of activities that have been initiated and are building towards the 90-day threshold."
          />
          <KpiCard
            icon={Sparkles}
            title="High Weight"
            value="1"
            caption="20 pts earned per high-weight activity"
            info="High-weighted activities provide double the score of medium-weighted activities."
          />
        </div>
      </section>

      {/* 2. Attested Activities Status Section */}
      <section className="stagger-section mb-6">
        <SectionLabel>Attested Activities Status</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-base font-bold text-foreground">Activity Details</h3>
            <span className="text-xs font-semibold text-muted-foreground">3 Selected Activities</span>
          </div>
          <div className="space-y-3.5 pt-1">
            {/* Row 1: Medication Management */}
            <div className="p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/10 hover:bg-emerald-50/60 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">Medication Management</span>
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-semibold px-2 py-0.2 rounded shadow-none">
                    High Weight
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.2 rounded shadow-none bg-background/80">
                    Population Management
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-3">
                  <span>Activity ID: <strong className="text-foreground">IA_PM_4</strong></span>
                  <span>•</span>
                  <span>Completed: <strong className="text-foreground">7/12/2026</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Complete
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">20 pts</span>
              </div>
            </div>

            {/* Row 2: Care Coordination */}
            <div className="p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/10 hover:bg-emerald-50/60 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">Care Coordination</span>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-semibold px-2 py-0.2 rounded shadow-none">
                    Low Weight
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.2 rounded shadow-none bg-background/80">
                    Care Coordination
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-3">
                  <span>Activity ID: <strong className="text-foreground">IA_CC_1</strong></span>
                  <span>•</span>
                  <span>Completed: <strong className="text-foreground">7/12/2026</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Complete
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">15 pts</span>
              </div>
            </div>

            {/* Row 3: Patient Engagement */}
            <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">Patient Engagement</span>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-semibold px-2 py-0.2 rounded shadow-none">
                    Medium Weight
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.2 rounded shadow-none bg-background/80">
                    Beneficiary Engagement
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-3">
                  <span>Activity ID: <strong className="text-foreground">IA_BE_2</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 justify-end">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  In Progress
                </Badge>
                <span className="text-base font-extrabold text-foreground tabular-nums w-14 text-right">0 pts</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Bottom Row: Available Activities + Performance Insights */}
      <section className="stagger-section mb-6">
        <SectionLabel>Available Activities & Insights</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Activities Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Available Activities</h3>
            <div className="space-y-3 pt-1 flex-1 flex flex-col justify-around">
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Telemedicine Implementation</span>
                  <span className="text-xs text-muted-foreground">IA_EPA_4 • Expanded Practice Access</span>
                </div>
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-semibold px-2.5 py-0.5 rounded-lg border shadow-none">
                  High Weight
                </Badge>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Chronic Care Management</span>
                  <span className="text-xs text-muted-foreground">IA_CC_14 • Care Coordination</span>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-lg border shadow-none">
                  Medium Weight
                </Badge>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">CAHPS Patient Experience</span>
                  <span className="text-xs text-muted-foreground">IA_PCMH_2 • Patient-Centered Medical Home</span>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-lg border shadow-none">
                  Medium Weight
                </Badge>
              </div>
            </div>
          </Card>

          {/* Performance Insights Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Performance Insights</h3>
            <div className="space-y-4 pt-1 flex-1 flex flex-col justify-around">
              <div className="bg-emerald-50/70 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/40 rounded-2xl p-4.5 space-y-1.5">
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Strong Performance</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                  You've completed most improvement activities ahead of schedule. Focus on high-weight activities for maximum impact.
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/60 dark:bg-blue-950/20 dark:border-blue-800/40 rounded-2xl p-4.5 space-y-1.5">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Recommendation</h4>
                <p className="text-xs text-blue-800/80 dark:text-blue-400/80 leading-relaxed font-medium">
                  Consider implementing telemedicine programs to earn additional high-weight activity points and improve patient access.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Page>
  );
}

export function MipsProviderComparisonPage() {
  return (
    <Page
      title="Provider Comparison"
      subtitle="Dr. Amanda Johnson • Performance Year 2026"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Provider Comparison" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
      actions={
        <Button size="sm" variant="default" className="gap-1.5 text-xs font-medium h-8.5 px-3.5 rounded-lg shadow-2xs transition-all">
          <Download className="size-3.5" />
          <span>Export Data</span>
        </Button>
      }
    >
      {/* 1. Top Summary KPI Cards Row (4 Columns matching Screenshot 4) */}
      <section className="stagger-section mb-6">
        <SectionLabel>Group Provider Benchmarks</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Users}
            title="Average Score"
            value="92.0"
            caption={`Across all ${MIPS_PROVIDERS.length} group providers`}
            info="Mean composite score across all clinical providers within the practice network."
          />
          <KpiCard
            icon={ArrowUpRight}
            title="Top Performer"
            value="100.5"
            caption="Highest individual MIPS score"
            info="Top provider composite score including complex patient bonus adjustments."
          />
          <KpiCard
            icon={Sparkles}
            title="Quality Leader"
            value="44.8"
            caption="Best quality domain score (out of 45)"
            info="Highest quality category performance score achieved by a practice clinician."
          />
          <KpiCard
            icon={CheckCircle2}
            title="Above 85"
            value="28"
            caption="Exceptional performers exceeding benchmark"
            info="Number of clinicians exceeding the 85-point threshold required for maximum incentive adjustments."
          />
        </div>
      </section>

      {/* 2. Provider Performance Comparison Table */}
      <section className="stagger-section mb-6">
        <SectionLabel>Provider Performance Table</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground">Provider Performance Comparison</h3>
            <span className="text-xs font-semibold text-muted-foreground">{MIPS_PROVIDERS.length} Active Providers</span>
          </div>
          <DataTable
            columns={[
              {
                key: "name",
                header: "Provider",
                cell: (r) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className="size-8 rounded-full bg-rose-600 text-white font-bold text-xs grid place-items-center shrink-0 shadow-2xs">
                      {r.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <span className="font-bold text-foreground text-sm block">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.specialty}</span>
                    </div>
                  </div>
                ),
              },
              {
                key: "score",
                header: "MIPS Score",
                align: "center",
                cell: (r) => (
                  <Badge
                    className={cn(
                      "text-xs font-bold tabular-nums px-2.5 py-0.5 rounded-lg shadow-none border",
                      r.score >= 90
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                    )}
                  >
                    {r.score.toFixed(1)}
                  </Badge>
                ),
              },
              { key: "quality", header: "Quality", align: "right", cell: (r) => <span className="font-semibold text-foreground tabular-nums">{r.quality.toFixed(1)}</span> },
              { key: "cost", header: "Cost", align: "right", cell: (r) => <span className="font-semibold text-foreground tabular-nums">{r.cost.toFixed(1)}</span> },
              { key: "pi", header: "PI", align: "right", cell: (r) => <span className="font-semibold text-foreground tabular-nums">{r.pi.toFixed(1)}</span> },
              { key: "ia", header: "IA", align: "right", cell: (r) => <span className="font-semibold text-foreground tabular-nums">{r.ia.toFixed(1)}</span> },
              {
                key: "trend",
                header: "Trend",
                align: "right",
                cell: (r) => (
                  <span
                    className={cn(
                      "text-xs font-bold tabular-nums flex items-center gap-1 justify-end",
                      r.trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {r.trendPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    <span>{r.trend}</span>
                  </span>
                ),
              },
            ]}
            rows={MIPS_PROVIDERS}
            rowKey={(r) => r.id}
            pageSize={20}
          />
        </Card>
      </section>

      {/* 3. Bottom Section: Performance Distribution & Key Insights matching Screenshot 5 */}
      <section className="stagger-section mb-6">
        <SectionLabel>Distribution & Key Insights</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Distribution Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Performance Distribution</h3>
            <div className="space-y-4 pt-2 flex-1 flex flex-col justify-around">
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Exceptional (85+)</span>
                  <span className="text-xs text-muted-foreground">Providers eligible for exceptional performance bonus</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">28 providers</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Good (70-84)</span>
                  <span className="text-xs text-muted-foreground">Providers meeting standard performance thresholds</span>
                </div>
                <span className="text-sm font-extrabold text-amber-700 dark:text-amber-400 tabular-nums">2 providers</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">Needs Improvement (&lt; 70)</span>
                  <span className="text-xs text-muted-foreground">Providers at risk of negative CMS payment adjustments</span>
                </div>
                <span className="text-sm font-extrabold text-rose-700 dark:text-rose-400 tabular-nums">0 providers</span>
              </div>
            </div>
          </Card>

          {/* Key Insights Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Key Insights</h3>
            <div className="space-y-3.5 pt-1 flex-1 flex flex-col justify-around">
              <div className="bg-emerald-50/70 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/40 rounded-xl p-3.5 flex items-center gap-3">
                <CheckCircle2 className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                  <strong className="font-bold">Quality Excellence:</strong> 67% of providers exceed quality benchmarks
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/60 dark:bg-blue-950/20 dark:border-blue-800/40 rounded-xl p-3.5 flex items-center gap-3">
                <Info className="size-4.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                  <strong className="font-bold">Cost Efficiency:</strong> Average cost performance shows room for improvement
                </p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/40 rounded-xl p-3.5 flex items-center gap-3">
                <AlertCircle className="size-4.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs font-medium text-amber-900 dark:text-amber-300">
                  <strong className="font-bold">Opportunity:</strong> Focus on Interoperability measures for better PI scores
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Page>
  );
}

export function MipsReportsPage() {
  return (
    <Page
      title="Reports & Exports"
      subtitle="Generate and download MIPS performance reports"
      crumbs={[{ label: "Mips Nexus", to: "/mips/dashboard" }, { label: "Reports & Exports" }]}
      chips={mipsChips}
      showFilters={true}
      showIconActions={true}
      showGenerateReport={false}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs font-medium h-8.5 px-3 rounded-lg border-border hover:bg-muted/50 shadow-2xs transition-all">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span>Schedule</span>
          </Button>
          <Button variant="default" size="sm" className="gap-1.5 text-xs font-medium h-8.5 px-3.5 rounded-lg shadow-2xs transition-all">
            <Download className="size-3.5" />
            <span>Export All</span>
          </Button>
        </div>
      }
    >
      {/* Top Filter Bar Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Select defaultValue="amanda">
          <SelectTrigger className="h-10 rounded-xl font-medium border-border/60 bg-card shadow-2xs text-sm">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amanda">Dr. Amanda Johnson</SelectItem>
            <SelectItem value="robert">Dr. Robert Chen</SelectItem>
            <SelectItem value="sarah">Dr. Sarah Williams</SelectItem>
            <SelectItem value="michael">Dr. Michael Chang</SelectItem>
            <SelectItem value="emily">Dr. Emily Rodriguez</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="2024">
          <SelectTrigger className="h-10 rounded-xl font-medium border-border/60 bg-card shadow-2xs text-sm">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="q4">
          <SelectTrigger className="h-10 rounded-xl font-medium border-border/60 bg-card shadow-2xs text-sm">
            <SelectValue placeholder="Select Quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="q4">Q4</SelectItem>
            <SelectItem value="q3">Q3</SelectItem>
            <SelectItem value="q2">Q2</SelectItem>
            <SelectItem value="q1">Q1</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row 1: Quick Stats and Export Status Side-by-Side */}
      <section className="stagger-section mb-6">
        <SectionLabel>Status & Quick Metrics</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Quick Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 flex-1">
              <div className="bg-blue-50/70 border border-blue-200/60 dark:bg-blue-950/30 dark:border-blue-800/40 rounded-2xl p-4.5 flex flex-col items-center justify-center text-center shadow-2xs transition-all hover:shadow-sm">
                <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 tabular-nums tracking-tight">77.9</span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1.5">MIPS Score</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200/60 dark:bg-emerald-950/30 dark:border-emerald-800/40 rounded-2xl p-4.5 flex flex-col items-center justify-center text-center shadow-2xs transition-all hover:shadow-sm">
                <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums tracking-tight">3</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">Quality Measures</span>
              </div>
              <div className="bg-purple-50/70 border border-purple-200/60 dark:bg-purple-950/30 dark:border-purple-800/40 rounded-2xl p-4.5 flex flex-col items-center justify-center text-center shadow-2xs transition-all hover:shadow-sm">
                <span className="text-3xl font-extrabold text-purple-700 dark:text-purple-300 tabular-nums tracking-tight">19.1</span>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1.5">PI Score</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-800/40 rounded-2xl p-4.5 flex flex-col items-center justify-center text-center shadow-2xs transition-all hover:shadow-sm">
                <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-300 tabular-nums tracking-tight">2</span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1.5">Completed IAs</span>
              </div>
            </div>
          </Card>

          {/* Export Status Card */}
          <Card className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3">Export Status</h3>
            <div className="space-y-3.5 pt-4 flex-1 flex flex-col justify-around">
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <span className="text-sm font-bold text-foreground">Data Validation</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Complete
                </Badge>
              </div>
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <span className="text-sm font-bold text-foreground">Quality Measures</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Ready
                </Badge>
              </div>
              <div className="p-4 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-all flex items-center justify-between shadow-2xs">
                <span className="text-sm font-bold text-foreground">QRDA III Format</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-lg border shadow-none">
                  Valid
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Row 2: Available Reports Section */}
      <section className="stagger-section mb-6">
        <SectionLabel>Report Catalog</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-base font-bold text-foreground">Available Reports</h3>
            <span className="text-xs font-semibold text-muted-foreground">5 Standard Formats</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Report 1: QRDA Category I */}
            <div className="p-4.5 rounded-2xl border border-border/60 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 grid place-items-center shrink-0 border border-blue-200/60 dark:border-blue-800/40 shadow-2xs mt-0.5">
                    <FileText className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">QRDA Category I</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Patient-level clinical quality data for CMS submission</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-muted/40 border-border/60 shadow-none shrink-0">
                  XML
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground font-medium">Size: ~25KB • Last: 2024-12-15</span>
                <Button size="sm" variant="default" className="h-8 px-3.5 gap-1.5 font-medium text-xs rounded-lg shadow-2xs transition-all">
                  <Download className="size-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            {/* Report 2: QRDA Category III */}
            <div className="p-4.5 rounded-2xl border border-border/60 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 grid place-items-center shrink-0 border border-blue-200/60 dark:border-blue-800/40 shadow-2xs mt-0.5">
                    <FileText className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">QRDA Category III</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Aggregate clinical quality data with numerator/denominator counts</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-muted/40 border-border/60 shadow-none shrink-0">
                  XML
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground font-medium">Size: ~45KB • Last: 2024-12-15</span>
                <Button size="sm" variant="default" className="h-8 px-3.5 gap-1.5 font-medium text-xs rounded-lg shadow-2xs transition-all">
                  <Download className="size-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            {/* Report 3: MIPS Summary Report */}
            <div className="p-4.5 rounded-2xl border border-border/60 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 grid place-items-center shrink-0 border border-blue-200/60 dark:border-blue-800/40 shadow-2xs mt-0.5">
                    <FileText className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">MIPS Summary Report</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Comprehensive performance summary</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-muted/40 border-border/60 shadow-none shrink-0">
                  JSON
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground font-medium">Size: ~15KB • Last: 2024-12-15</span>
                <Button size="sm" variant="default" className="h-8 px-3.5 gap-1.5 font-medium text-xs rounded-lg shadow-2xs transition-all">
                  <Download className="size-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            {/* Report 4: Quality Measures Detail */}
            <div className="p-4.5 rounded-2xl border border-border/60 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 grid place-items-center shrink-0 border border-blue-200/60 dark:border-blue-800/40 shadow-2xs mt-0.5">
                    <FileText className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">Quality Measures Detail</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Detailed quality measures breakdown</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-muted/40 border-border/60 shadow-none shrink-0">
                  CSV
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground font-medium">Size: ~8KB • Last: 2024-12-15</span>
                <Button size="sm" variant="default" className="h-8 px-3.5 gap-1.5 font-medium text-xs rounded-lg shadow-2xs transition-all">
                  <Download className="size-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            {/* Report 5: Provider Comparison */}
            <div className="p-4.5 rounded-2xl border border-border/60 bg-background/60 hover:bg-muted/40 transition-all duration-200 flex flex-col justify-between gap-4 shadow-2xs md:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 grid place-items-center shrink-0 border border-blue-200/60 dark:border-blue-800/40 shadow-2xs mt-0.5">
                    <FileText className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">Provider Comparison</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Benchmarking against peers</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-muted/40 border-border/60 shadow-none shrink-0">
                  HTML
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground font-medium">Size: ~12KB • Last: 2024-12-15</span>
                <Button size="sm" variant="default" className="h-8 px-3.5 gap-1.5 font-medium text-xs rounded-lg shadow-2xs transition-all">
                  <Download className="size-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Row 3: Submission Guidelines Section */}
      <section className="stagger-section mb-6">
        <SectionLabel>Compliance & Guidelines</SectionLabel>
        <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="text-base font-bold text-foreground">Submission Guidelines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">QRDA Category III requirements</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Submit by March 31st following performance year</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Include all required quality measures</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Validate XML against CMS schema</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Include provider NPI and TIN information</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Submission Methods</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>CMS Quality Payment Program portal</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Third-party qualified registry</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>EHR direct submission</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Qualified Clinical Data Registry (QCDR)</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </Page>
  );
}
