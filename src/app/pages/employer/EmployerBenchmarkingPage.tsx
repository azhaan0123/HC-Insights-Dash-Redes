import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Shield,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { employerChips } from "../../data/filters";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  ReferenceLine,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// ----------------------------------------------------------------------
// DATA DEFINITIONS
// ----------------------------------------------------------------------

// 1. Metric Comparative Data
interface MetricCardData {
  id: string;
  title: string;
  subtitle: string;
  status: "Slightly Above" | "Within Benchmark" | "Above Benchmark";
  statusColor: string;
  statusBg: string;
  yourOrg: string;
  benchmark: string;
  comparisonText: string;
  isPositive: boolean; // green vs red indicator
  orgVal: number;      // raw value for index chart
  benchVal: number;    // raw benchmark for index chart
}

const COMPARATIVE_METRICS: MetricCardData[] = [
  {
    id: "total-pmpm",
    title: "Total PMPM",
    subtitle: "Per member per month total spend",
    status: "Slightly Above",
    statusColor: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60",
    statusBg: "bg-amber-50/50 dark:bg-amber-950/20",
    yourOrg: "$489.50",
    benchmark: "$450.00",
    comparisonText: "+8.8% vs benchmark (+$39.50)",
    isPositive: false,
    orgVal: 489.5,
    benchVal: 450.0
  },
  {
    id: "dep-ratio",
    title: "Dependent Ratio",
    subtitle: "Dependents per subscriber",
    status: "Within Benchmark",
    statusColor: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
    statusBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    yourOrg: "0.96",
    benchmark: "1.15",
    comparisonText: "-16.5% vs benchmark (0.19)",
    isPositive: true,
    orgVal: 0.96,
    benchVal: 1.15
  },
  {
    id: "chronic-burden",
    title: "Chronic Condition Burden",
    subtitle: "Members with at least one chronic condition",
    status: "Above Benchmark",
    statusColor: "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60",
    statusBg: "bg-rose-50/50 dark:bg-rose-950/20",
    yourOrg: "53.8%",
    benchmark: "38.0%",
    comparisonText: "+41.6% vs benchmark (+15.8%)",
    isPositive: false,
    orgVal: 53.8,
    benchVal: 38.0
  },
  {
    id: "hcc-rate",
    title: "High-Cost Claimant Rate",
    subtitle: "Members exceeding $25K annual spend",
    status: "Within Benchmark",
    statusColor: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
    statusBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    yourOrg: "3.5%",
    benchmark: "4.0%",
    comparisonText: "-12.5% vs benchmark (0.5%)",
    isPositive: true,
    orgVal: 3.5,
    benchVal: 4.0
  },
  {
    id: "er-util",
    title: "ER Utilization Rate",
    subtitle: "Members with at least one ER visit",
    status: "Within Benchmark",
    statusColor: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
    statusBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    yourOrg: "2.7%",
    benchmark: "6.5%",
    comparisonText: "-58.5% vs benchmark (3.8%)",
    isPositive: true,
    orgVal: 2.7,
    benchVal: 6.5
  },
  {
    id: "rx-pmpm",
    title: "Rx PMPM",
    subtitle: "Pharmacy spend per member per month",
    status: "Within Benchmark",
    statusColor: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
    statusBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    yourOrg: "$93.45",
    benchmark: "$95.00",
    comparisonText: "-1.6% vs benchmark ($1.55)",
    isPositive: true,
    orgVal: 93.45,
    benchVal: 95.0
  }
];

// 2. Bar Chart: Employer vs Benchmark Index (value as % of benchmark)
const INDEX_CHART_DATA = COMPARATIVE_METRICS.map(m => {
  let pct = 100;
  if (m.id === "dep-ratio") {
    // 0.96 / 1.15 = 83.4%
    pct = Math.round((m.orgVal / m.benchVal) * 100);
  } else if (m.id === "er-util") {
    // 2.7 / 6.5 = 41.5%
    pct = Math.round((m.orgVal / m.benchVal) * 100);
  } else {
    pct = Math.round((m.orgVal / m.benchVal) * 100);
  }

  // Assign bar color matching status
  let barColor = "#22c55e"; // Within Benchmark -> Green
  if (m.status === "Slightly Above") barColor = "#f59e0b"; // Orange
  if (m.status === "Above Benchmark") barColor = "#ef4444"; // Red

  return {
    name: m.title,
    index: pct,
    color: barColor
  };
});

// 3. Line Chart: Risk Score Trend Data (Jan to Dec)
const RISK_SCORE_TREND = [
  { month: "Jan", score: 58 },
  { month: "Feb", score: 59 },
  { month: "Mar", score: 57 },
  { month: "Apr", score: 61 },
  { month: "May", score: 60 },
  { month: "Jun", score: 62 },
  { month: "Jul", score: 64 },
  { month: "Aug", score: 61 },
  { month: "Sep", score: 65 },
  { month: "Oct", score: 64 },
  { month: "Nov", score: 66 },
  { month: "Dec", score: 53 },
];

// 4. Radar Chart: Risk Profile Radar Data
const RADAR_DATA = [
  { subject: "Total", Employer: 109, Benchmark: 100 },
  { subject: "Dependent", Employer: 83, Benchmark: 100 },
  { subject: "Chronic", Employer: 141, Benchmark: 100 },
  { subject: "High-Cost", Employer: 87, Benchmark: 100 },
  { subject: "ER", Employer: 41, Benchmark: 100 },
  { subject: "Rx", Employer: 98, Benchmark: 100 },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export function EmployerBenchmarkingPage() {
  return (
    <Page
      title="Employer Risk & Benchmarking"
      subtitle="Compare your population health metrics against industry benchmarks"
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
            icon={Shield}
            title="Overall Risk Score"
            value="53/100"
            caption="Risk Level: Moderate"
            info="Calculated population risk score relative to normal healthy cohorts."
          />
          <KpiCard
            icon={CheckCircle}
            title="Within Benchmark"
            value="4"
            caption="4 of 8 metrics"
            info="Number of key performance indicators performing at or better than average."
          />
          <KpiCard
            icon={AlertCircle}
            title="Slightly Above"
            value="1"
            caption="1 metrics w/ moderate elevation"
            info="Indicators demonstrating minor unfavorable variances against baseline norms."
          />
          <KpiCard
            icon={AlertTriangle}
            title="Above Benchmark"
            value="1"
            caption="1 metrics need attention"
            info="Critical clinical or spend metrics showing major elevation above target levels."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. SECOND & THIRD ROW: COMPARATIVE METRICS GRIDS
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPARATIVE_METRICS.map((item) => {
            const isWithin = item.status === "Within Benchmark";
            const isSlightly = item.status === "Slightly Above";

            return (
              <Card key={item.id} className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between hover:border-border transition-all">
                <div>
                  {/* Card Header with Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-xs font-black text-foreground tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                    </div>
                    <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${item.statusColor} ${item.statusBg}`}>
                      <span className={`size-1.5 rounded-full mr-1.5 shrink-0 ${
                        isWithin ? "bg-emerald-500" : isSlightly ? "bg-amber-500" : "bg-rose-500"
                      }`} />
                      {item.status}
                    </Badge>
                  </div>

                  {/* Your Org vs Benchmark Containers */}
                  <div className="grid grid-cols-2 gap-3.5 my-4">
                    <div className="p-3 bg-muted/40 dark:bg-muted/10 border border-border/40 rounded-lg">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Your Org</div>
                      <div className="text-lg font-black text-foreground mt-1">{item.yourOrg}</div>
                    </div>
                    <div className={`p-3 border rounded-lg ${
                      isWithin
                        ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/60 dark:bg-emerald-950/10"
                        : isSlightly
                        ? "border-amber-200 bg-amber-50/20 dark:border-amber-950/60 dark:bg-amber-950/10"
                        : "border-rose-200 bg-rose-50/20 dark:border-rose-950/60 dark:bg-rose-950/10"
                    }`}>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Benchmark</div>
                      <div className={`text-lg font-black mt-1 ${
                        isWithin
                          ? "text-emerald-700 dark:text-emerald-400"
                          : isSlightly
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-rose-700 dark:text-rose-400"
                      }`}>{item.benchmark}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Trend Text Indicator */}
                <div className={`flex items-center gap-1.5 text-xs font-bold ${
                  item.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}>
                  {item.isPositive ? (
                    <TrendingDown className="size-3.5" />
                  ) : (
                    <TrendingUp className="size-3.5" />
                  )}
                  <span>{item.comparisonText}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. FOURTH ROW: EMPLOYER VS BENCHMARK INDEX BAR CHART
          ---------------------------------------------------------------------- */}
      <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs mb-6 stagger-section">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Employer vs Benchmark Index</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Employer value as % of benchmark (100 = at benchmark)</p>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INDEX_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fontWeight: 600 }} />
              <YAxis
                domain={[0, 150]}
                ticks={[0, 40, 80, 100, 150]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1.5} />
              <RechartsTooltip
                formatter={(val: number) => [`${val}% of Benchmark`, "Index"]}
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
              />
              <Bar dataKey="index" barSize={12} radius={[4, 4, 0, 0]}>
                {INDEX_CHART_DATA.map((entry, idx) => (
                  <Cell key={`index-bar-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs font-bold text-muted-foreground">
          <span className="size-2.5 rounded-full bg-slate-900 dark:bg-slate-400" />
          <span>Employer Index</span>
        </div>
      </Card>

      {/* ----------------------------------------------------------------------
          4. FIFTH ROW: LINE & RADAR CHART SIDE-BY-SIDE
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6 stagger-section">
        {/* Card A: Risk Score Trend */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Risk Score Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly composite risk score (higher = better)</p>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RISK_SCORE_TREND} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[40, 80]} ticks={[40, 50, 60, 70, 80]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <ReferenceLine y={65} stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1.2} opacity={0.7} label={{ value: "Target Benchmark (65)", position: "insideBottomRight", fill: "#10b981", fontSize: 10, fontWeight: 700 }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Risk Score"
                    stroke="#e32168"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#e32168" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Card B: Risk Profile Radar */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Risk Profile Radar</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Employer vs benchmark across dimensions</p>
            </div>

            <div className="h-[220px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--foreground)", fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fontSize: 9 }} />
                  <Radar name="Employer" dataKey="Employer" stroke="#e32168" fill="#e32168" fillOpacity={0.2} />
                  <Radar name="Benchmark" dataKey="Benchmark" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-3 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#e32168]" />
              <span className="text-foreground">Employer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#22c55e]" />
              <span className="text-foreground">Benchmark</span>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
