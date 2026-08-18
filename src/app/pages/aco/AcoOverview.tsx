import { useState } from "react";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Syringe, HeartPulse, ShieldCheck, Activity, BrainCircuit, AlertOctagon, FileCheck, type LucideIcon, BarChart2, TrendingUp } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { acoChips } from "../../data/filters";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";


type MeasureCardProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  percentage: string;
  fraction: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
  counts: {
    eligible: number;
    met: number;
    notMet: number;
    excluded: number;
  };
};

const measures: MeasureCardProps[] = [
  {
    id: "influenza",
    title: "Influenza Immunization",
    icon: Syringe,
    percentage: "71.4%",
    fraction: "663 / 929 eligible",
    trend: "down",
    trendValue: "3.7%",
    counts: { eligible: 929, met: 663, notMet: 237, excluded: 29 },
  },
  {
    id: "bp",
    title: "Controlling High BP",
    icon: HeartPulse,
    percentage: "41.4%",
    fraction: "170 / 411 eligible",
    trend: "down",
    trendValue: "3.9%",
    counts: { eligible: 411, met: 170, notMet: 210, excluded: 31 },
  },
  {
    id: "colorectal",
    title: "Colorectal Cancer Screening",
    icon: ShieldCheck,
    percentage: "59.6%",
    fraction: "272 / 456 eligible",
    trend: "up",
    trendValue: "4.9%",
    counts: { eligible: 456, met: 272, notMet: 150, excluded: 34 },
  },
  {
    id: "diabetes",
    title: "Diabetes HbA1c Poor Control > 9%",
    icon: Activity,
    percentage: "34.1%",
    fraction: "100 / 293 eligible",
    trend: "down",
    trendValue: "3.3%",
    counts: { eligible: 293, met: 100, notMet: 180, excluded: 13 },
  },
  {
    id: "depression",
    title: "Depression Remission at 12 Months",
    icon: BrainCircuit,
    percentage: "15.9%",
    fraction: "35 / 220 eligible",
    trend: "up",
    trendValue: "5.0%",
    counts: { eligible: 220, met: 35, notMet: 170, excluded: 15 },
  },
  {
    id: "falls",
    title: "Falls Risk Screening",
    icon: AlertOctagon,
    percentage: "77.7%",
    fraction: "254 / 327 eligible",
    trend: "down",
    trendValue: "1.5%",
    counts: { eligible: 327, met: 254, notMet: 60, excluded: 13 },
  },
  {
    id: "medication",
    title: "Medication Reconciliation Post-Discharge",
    icon: FileCheck,
    percentage: "90.7%",
    fraction: "360 / 397 eligible",
    trend: "flat",
    trendValue: "0.0%",
    counts: { eligible: 397, met: 360, notMet: 30, excluded: 7 },
  },
];

type PatientMeasureRow = {
  id: string;
  patientId: string;
  status: "Met" | "Not Met";
  lastEventDate: string;
  reason: string;
};

// Generates fake patient rows based on the measure
const getMockPatients = (measureId: string): PatientMeasureRow[] => {
  return Array.from({ length: 25 }).map((_, i) => {
    const isMet = Math.random() > 0.5;
    return {
      id: `${measureId}-${i}`,
      patientId: `P${Math.floor(1000 + Math.random() * 9000)}`,
      status: isMet ? "Met" : "Not Met",
      lastEventDate: isMet ? "2026-10-15" : "N/A",
      reason: isMet ? "N/A" : "No record in period",
    };
  });
};

const columns: Column<PatientMeasureRow>[] = [
  {
    key: "patientId",
    header: "Patient ID",
    cell: (row) => <span className="text-foreground font-medium">{row.patientId}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => {
      const isMet = row.status === "Met";
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ${isMet ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground"}`}>
          {isMet ? (
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          )}
          {row.status}
        </span>
      );
    },
  },
  {
    key: "lastEventDate",
    header: "Last Event Date",
    cell: (row) => <span className="text-muted-foreground">{row.lastEventDate}</span>,
  },
  {
    key: "reason",
    header: "Reason / Value",
    cell: (row) => <span className="text-muted-foreground">{row.reason}</span>,
  },
];

const COLORS = {
  Met: "#FF6B2B", // primary
  "Not Met": "var(--muted-foreground)", // slate-400
  Excluded: "var(--muted-foreground)", // slate-300
};

export default function AcoOverview() {
  const isLoading = usePageLoading();


  const [selectedMeasureId, setSelectedMeasureId] = useState<string>(measures[0].id);

  const selectedMeasure = measures.find((m) => m.id === selectedMeasureId) || measures[0];
  // Re-generate mock data whenever selected measure changes
  const patientData = getMockPatients(selectedMeasure.id);

  const chartData = [
    { name: "Met", count: selectedMeasure.counts.met, color: COLORS["Met"] },
    { name: "Not Met", count: selectedMeasure.counts.notMet, color: COLORS["Not Met"] },
    { name: "Excluded", count: selectedMeasure.counts.excluded, color: COLORS["Excluded"] },
  ];

  const lineChartData = [
    { month: "Jan", met: Math.floor(selectedMeasure.counts.met * 0.8) },
    { month: "Feb", met: Math.floor(selectedMeasure.counts.met * 0.85) },
    { month: "Mar", met: Math.floor(selectedMeasure.counts.met * 0.9) },
    { month: "Apr", met: Math.floor(selectedMeasure.counts.met * 0.95) },
    { month: "May", met: selectedMeasure.counts.met },
  ];

  if (isLoading) {
    return (
      <Page title="Dashboard / Overview" crumbs={[{ label: "ACO Insights" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
          <ChartSkeleton height={280} />
          <ChartSkeleton height={280} />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Dashboard / Overview" crumbs={[{ label: "ACO Insights" }]} chips={acoChips}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Measure Performance Overview</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {measures.map((measure) => {
              const isUp = measure.trend === "up";
              const isDown = measure.trend === "down";
              const trendColor = isUp ? "text-emerald-500" : isDown ? "text-primary" : "text-muted-foreground";
              const trendIcon = isUp ? "↑ " : isDown ? "↓ " : "";
              
              return (
                <KpiCard
                  key={measure.id}
                  icon={measure.icon}
                  title={measure.title}
                  value={measure.percentage}
                  caption={measure.fraction}
                  selected={selectedMeasureId === measure.id}
                  onClick={() => setSelectedMeasureId(measure.id)}
                  subs={[
                    { 
                      value: `${trendIcon}${measure.trendValue}`, 
                      label: "vs last period", 
                      className: trendColor 
                    }
                  ]}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Patient Details for {selectedMeasure.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">Total Eligible: {selectedMeasure.counts.eligible} | Met Criteria: {selectedMeasure.counts.met} | Not Met: {selectedMeasure.counts.notMet} | Excluded: {selectedMeasure.counts.excluded}</p>
            </div>
            <div className="p-2 flex-1 flex flex-col">
              <DataTable
                columns={columns}
                rows={patientData}
                rowKey={(row) => row.id}
                pageSize={12}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-border">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <TrendingUp className="size-5 text-primary" />
                  Total Met Over Time
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Patients meeting criteria over the last 5 months.</p>
              </div>
              <div className="p-5 flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B2B" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF6B2B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
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
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="met" 
                        stroke="#FF6B2B" 
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorMet)"
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-border">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <BarChart2 className="size-5 text-primary" />
                  Count Distribution
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Breakdown of patient statuses.</p>
              </div>
              <div className="p-5 flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
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
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
