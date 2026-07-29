import {
  TrendingUp,
  CalendarCheck,
  FileCheck,
  RefreshCw,
  Search,
  Layers,
  ClipboardX,
  UserPlus,
  ScanSearch,
  BarChart2,
  PieChart as PieChartIcon
} from "lucide-react";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";

const RISK_SCORE_DATA = [
  { range: "0-20", count: 120 },
  { range: "21-40", count: 210 },
  { range: "41-60", count: 240 },
  { range: "61-80", count: 180 },
  { range: "81-100", count: 140 },
];

const DEMOGRAPHICS_DATA = [
  { name: "Male", value: 33, count: 167, color: "#FF6B2B" }, // Primary
  { name: "Female", value: 33, count: 167, color: "#3b82f6" }, // Blue
  { name: "Other", value: 34, count: 172, color: "#f59e0b" }, // Orange
];

import { ChartTooltip } from "../../components/dashboard/ChartTooltip";

import { Page } from "../../components/layout/Page";
import { hccChips } from "../../data/filters";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton, PieChartSkeleton } from "../../components/dashboard/SkeletonPrimitives";


export default function HccOverview() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="HCC Overview" crumbs={[{ label: "HCC Insights" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <ChartSkeleton height={280} className="mb-6" />
        <PieChartSkeleton className="mb-6" />
      </Page>
    );
  }

  return (
    <Page title="HCC Overview" crumbs={[{ label: "HCC Insights" }]} chips={hccChips}>
      <div className="space-y-6">
      {/* Key HCC Metrics & Opportunities */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-foreground">
          <TrendingUp className="size-5 text-primary" />
          Key HCC Metrics & Opportunities
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={CalendarCheck}
            title="AWV Completion Rate"
            value="66%"
            caption="Annual Wellness Visits completed"
          />
          <KpiCard
            icon={FileCheck}
            title="Avg. Doc Accuracy"
            value="77.3%"
            caption="Average documentation accuracy score"
          />
          <KpiCard
            icon={RefreshCw}
            title="Annual Recapture Ops"
            value="26"
            caption="Confirmed HCCs needing revalidation"
          />
          <KpiCard
            icon={Search}
            title="Specificity Review Ops"
            value="152"
            caption="Diagnoses needing higher specificity"
          />
          <KpiCard
            icon={Layers}
            title="Complex Code Ops"
            value="564"
            caption="Potential missing/combination codes"
          />
          <KpiCard
            icon={ClipboardX}
            title="Doc Quality Gaps"
            value="205"
            caption="Patients with low doc accuracy (<75%)"
          />
          <KpiCard
            icon={UserPlus}
            title="New Patient Review Ops"
            value="225"
            caption="New patients needing coding review"
          />
          <KpiCard
            icon={ScanSearch}
            title="Suspect Code Ops"
            value="7"
            caption="Undocumented conditions based on meds/indicators"
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Risk Score Distribution */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <BarChart2 className="size-4 text-primary" />
              Risk Score Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">Distribution of HCC risk scores across patients.</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RISK_SCORE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="range" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#a1a1aa" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#a1a1aa" }} 
                  />
                  <RechartsTooltip 
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="count" fill="#FF6B2B" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Patient Demographics */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <PieChartIcon className="size-4 text-primary" />
                Patient Demographics (Gender)
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Breakdown of patients by selected demographic.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Breakdown:</span>
              <Select defaultValue="gender">
                <SelectTrigger className="h-8 w-28 text-xs bg-muted/30 border-transparent shadow-none hover:bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gender">Gender</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMOGRAPHICS_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    stroke="none"
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {DEMOGRAPHICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: "transparent" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              {DEMOGRAPHICS_DATA.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      </div>
    </Page>
  );
}
