import { Page } from "../../components/layout/Page";
import { outcomesChips } from "../../data/filters";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Users, ShieldAlert, AlertCircle, CalendarClock, Pill, Activity, LayoutDashboard } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, PieChartSkeleton } from "../../components/dashboard/SkeletonPrimitives";


const kpiData = [
  { id: "total-patients", title: "Total Patients", value: "1,550", caption: "Actively monitored patients", icon: Users },
  { id: "overdue-screenings", title: "Overdue Screenings", value: "1,971", caption: "Preventive screenings past due", icon: ShieldAlert },
  { id: "overdue-vaccinations", title: "Overdue Vaccinations", value: "608", caption: "Vaccinations past due", icon: AlertCircle },
  { id: "upcoming-appointments", title: "Upcoming Appointments", value: "89", caption: "Scheduled in next 7 days", icon: CalendarClock },
  { id: "medication-refills", title: "Medication Refills Due", value: "3,482", caption: "Require immediate attention", icon: Pill },
  { id: "chronic-conditions", title: "Chronic Conditions Tracked", value: "11", caption: "Unique ICD-10 codes monitored", icon: Activity },
];

const pieData = [
  { name: "Hypertension", value: 745, color: "#10b981" },
  { name: "Vitamin D deficiency", value: 739, color: "#FF6B2B" },
  { name: "Vitamin B12 deficiency", value: 506, color: "#f59e0b" },
  { name: "Prediabetes", value: 391, color: "#8b5cf6" },
  { name: "Diabetes Mellitus Type 2", value: 222, color: "#06b6d4" },
  { name: "Hypothyroidism, unspecified", value: 157, color: "#ef4444" },
  { name: "Hyperlipidemia, unspecified", value: 101, color: "#22c55e" },
  { name: "Obesity", value: 34, color: "#f97316" },
  { name: "Anxiety disorder, unspecified", value: 33, color: "#0ea5e9" },
  { name: "Asthma, unspecified", value: 31, color: "#6366f1" },
  { name: "Hormone Replacement Therapy", value: 18, color: "#c2410c" },
];

import { ChartTooltip } from "../../components/dashboard/ChartTooltip";

export default function DashboardOverview() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Dashboard" crumbs={[{ label: "Patient Outcomes" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <PieChartSkeleton className="mb-6" />
      </Page>
    );
  }

  return (
    <Page title="Dashboard" crumbs={[{ label: "Patient Outcomes" }]} chips={outcomesChips}>
      <div className="space-y-6">
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpiData.map((kpi) => (
              <KpiCard
                key={kpi.id}
                icon={kpi.icon}
                title={kpi.title}
                value={kpi.value}
                caption={kpi.caption}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 flex flex-col lg:flex-row items-center justify-center min-h-[500px]">
            <div className="w-full lg:w-2/3 h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius="80%"
                    stroke="none"
                    paddingAngle={0}
                    dataKey="value"
                    label={({ percent }) => percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-1.5 mt-6 lg:mt-0 pl-0 lg:pl-8">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-start text-xs">
                  <div className="size-2.5 rounded-full mr-2 shrink-0 mt-0.5" style={{ backgroundColor: entry.color }} />
                  <span className="font-medium text-muted-foreground leading-snug">({entry.value}) {entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
