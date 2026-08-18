import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { AlertTriangle, Activity, HeartCrack, TrendingUp, Users, type LucideIcon } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { acoChips } from "../../data/filters";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type MetricCardProps = {
  title: string;
  icon: LucideIcon;
  value: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
  trendIsGood: boolean;
};

const metrics: MetricCardProps[] = [
  {
    title: "ED Visits / 1000",
    icon: AlertTriangle,
    value: "619.0",
    trend: "down",
    trendValue: "-0.5%",
    trendIsGood: true,
  },
  {
    title: "IP Admits / 1000",
    icon: Activity,
    value: "629.0",
    trend: "down",
    trendValue: "-0.5%",
    trendIsGood: true,
  },
  {
    title: "Readmission Rate",
    icon: HeartCrack,
    value: "3.5%",
    trend: "down",
    trendValue: "-0.1%",
    trendIsGood: true,
  },
  {
    title: "SNF Stays / 1000",
    icon: TrendingUp,
    value: "653.0",
    trend: "down",
    trendValue: "-0.8%",
    trendIsGood: true,
  },
  {
    title: "Home Health / 1000",
    icon: Users,
    value: "700.0",
    trend: "up",
    trendValue: "0.7%",
    trendIsGood: false,
  },
];

type HighCostPatientRow = {
  id: string;
  patientId: string;
  totalCost: string;
  recentDx: string;
};

const mockHighCostPatients: HighCostPatientRow[] = [
  { id: "1", patientId: "P0739", totalCost: "$30,423", recentDx: "J02.9" },
  { id: "2", patientId: "P0570", totalCost: "$30,381", recentDx: "J02.9" },
  { id: "3", patientId: "P0547", totalCost: "$30,369", recentDx: "R51" },
  { id: "4", patientId: "P0586", totalCost: "$30,355", recentDx: "R05" },
  { id: "5", patientId: "P0627", totalCost: "$30,338", recentDx: "R05" },
];

const columns: Column<HighCostPatientRow>[] = [
  {
    key: "patientId",
    header: "Patient ID",
    cell: (row) => <span className="text-foreground font-medium">{row.patientId}</span>,
  },
  {
    key: "totalCost",
    header: "Total Cost (Last 12M)",
    cell: (row) => <span className="text-muted-foreground">{row.totalCost}</span>,
  },
  {
    key: "recentDx",
    header: "Recent Primary Dx (Guess)",
    cell: (row) => <span className="text-muted-foreground">{row.recentDx}</span>,
  },
];

export default function AcoUtilization() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Utilization" crumbs={[{ label: "ACO Insights" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <ChartSkeleton height={280} className="mb-6" />
      </Page>
    );
  }

  return (
    <Page title="Utilization Metrics" crumbs={[{ label: "ACO Insights" }]} chips={acoChips}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">Key Utilization Metrics (Last 12 Months)</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, idx) => {
              const trendColor = metric.trendIsGood ? "text-emerald-500" : "text-primary";
              const trendIcon = metric.trend === "up" ? "↑ " : metric.trend === "down" ? "↓ " : "";
              
              return (
                <KpiCard
                  key={idx}
                  icon={metric.icon}
                  title={metric.title}
                  value={metric.value}
                  subs={[
                    {
                      value: `${trendIcon}${metric.trendValue}`,
                      label: "vs last period",
                      className: trendColor
                    }
                  ]}
                />
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">High-Cost Patients (Top 5)</h3>
          </div>
          
          <div className="p-2">
            <DataTable
              columns={columns}
              rows={mockHighCostPatients}
              rowKey={(row) => row.id}
              pageSize={5}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
