import { Page } from "../../components/layout/Page";
import { appointmentsChips } from "../../data/filters";
import { CalendarClock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";


const mockChartData = [
  { month: "Dec 24", scheduled: 0, completed: 650, missed: 150, cancelled: 50 },
  { month: "Jan 25", scheduled: 0, completed: 680, missed: 180, cancelled: 60 },
  { month: "Feb 25", scheduled: 0, completed: 640, missed: 160, cancelled: 50 },
  { month: "Mar 25", scheduled: 0, completed: 670, missed: 170, cancelled: 40 },
  { month: "Apr 25", scheduled: 80, completed: 700, missed: 180, cancelled: 80 },
  { month: "May 25", scheduled: 380, completed: 700, missed: 150, cancelled: 60 },
  { month: "Jun 25", scheduled: 420, completed: 150, missed: 0, cancelled: 80 },
  { month: "Jul 25", scheduled: 510, completed: 0, missed: 0, cancelled: 50 },
  { month: "Aug 25", scheduled: 480, completed: 0, missed: 0, cancelled: 40 },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-md min-w-[160px]">
        <p className="text-[13px] font-semibold text-foreground pb-1">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="size-3.5 rounded-[3px]" style={{ backgroundColor: entry.color }} />
                <span className="text-[13px] font-medium text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-[13px] text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Appointments() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Appointments" crumbs={[{ label: "Patient Outcomes" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Appointments" crumbs={[{ label: "Patient Outcomes" }]} chips={appointmentsChips}>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 flex items-center justify-center min-h-[400px]">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: "transparent" }}
                  content={<CustomBarTooltip />}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: "20px" }} />
                <Bar dataKey="scheduled" name="Scheduled" stackId="a" fill="#FF6B2B" />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" />
                <Bar dataKey="missed" name="Missed" stackId="a" fill="#f59e0b" />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Page>
  );
}
