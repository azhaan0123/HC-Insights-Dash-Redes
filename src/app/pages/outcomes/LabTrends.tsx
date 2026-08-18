import { Page } from "../../components/layout/Page";
import { labTrendsChips } from "../../data/filters";
import { LineChart, RotateCcw, ChevronDown } from "../../lib/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";


const mockLabData = [
  { month: "Dec 24", belowRange: 0, withinRange: 45, aboveRange: 220 },
  { month: "Jan 25", belowRange: 0, withinRange: 42, aboveRange: 230 },
  { month: "Feb 25", belowRange: 0, withinRange: 35, aboveRange: 220 },
  { month: "Mar 25", belowRange: 0, withinRange: 32, aboveRange: 250 },
  { month: "Apr 25", belowRange: 0, withinRange: 48, aboveRange: 250 },
  { month: "May 25", belowRange: 0, withinRange: 30, aboveRange: 240 },
  { month: "Jun 25", belowRange: 0, withinRange: 5, aboveRange: 45 },
];

import { ChartTooltip } from "../../components/dashboard/ChartTooltip";

export default function LabTrends() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Lab Trends" crumbs={[{ label: "Patient Outcomes" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <ChartSkeleton height={280} className="mb-6" />
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Lab Trends" crumbs={[{ label: "Patient Outcomes" }]} chips={labTrendsChips}>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-5 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" className="gap-2 justify-between text-muted-foreground bg-secondary/50 border border-transparent hover:border-border min-w-[200px]">
                LDL Cholesterol
                <ChevronDown className="size-4 opacity-50" />
              </Button>
              <Button variant="secondary" size="sm" className="gap-2 justify-between text-muted-foreground bg-secondary/50 border border-transparent hover:border-border min-w-[200px]">
                All (Since Dec '24)
                <ChevronDown className="size-4 opacity-50" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <RotateCcw className="size-4" />
                Clear Lab Filter
              </Button>
            </div>

            <div className="flex items-center justify-center h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockLabData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} dx={-10} />
                  <RechartsTooltip 
                    cursor={{ fill: "transparent" }}
                    content={<ChartTooltip />}
                  />
                  <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: "20px" }} />
                  <Bar dataKey="belowRange" name="Below Range" stackId="a" fill="#f59e0b" barSize={20} />
                  <Bar dataKey="withinRange" name="Within Range" stackId="a" fill="#10b981" barSize={20} />
                  <Bar dataKey="aboveRange" name="Above Range" stackId="a" fill="#FF6B2B" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
