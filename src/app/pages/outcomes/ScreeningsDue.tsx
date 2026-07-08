import { useState } from "react";
import { Page } from "../../components/layout/Page";
import { screeningsChips } from "../../data/filters";
import { ClipboardCheck, ShieldCheck, Download, Filter } from "lucide-react";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";


type ScreeningRow = {
  id: string;
  name: string;
  type: string;
  dueDate: string;
  status: "Overdue" | "Due Soon";
};

const mockChartData = [
  { name: "Colon Cancer", overdue: 350, dueSoon: 250 },
  { name: "Cervical Cancer", overdue: 300, dueSoon: 250 },
  { name: "Prostate Cancer", overdue: 280, dueSoon: 240 },
  { name: "Dermatology", overdue: 250, dueSoon: 230 },
  { name: "Breast Cancer", overdue: 220, dueSoon: 240 },
  { name: "Eye Exam", overdue: 180, dueSoon: 120 },
  { name: "Dental Exam", overdue: 150, dueSoon: 100 },
  { name: "Lung Cancer", overdue: 140, dueSoon: 90 },
  { name: "Lipid Panel", overdue: 100, dueSoon: 60 },
  { name: "Bone Density Scan", overdue: 80, dueSoon: 50 },
  { name: "Diabetes (A1c)", overdue: 70, dueSoon: 40 },
  { name: "AAA", overdue: 60, dueSoon: 40 },
].reverse(); // Reverse so that Colon Cancer is at the top in vertical chart

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

const mockTableData: ScreeningRow[] = [
  { id: "1", name: "John Sanchez", type: "Bone Density Scan", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "2", name: "Margaret Thomas", type: "Eye Exam", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "3", name: "William Harris", type: "Lung Cancer Screening", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "4", name: "Joshua Robinson", type: "Prostate Cancer Screening", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "5", name: "Patricia Rodriguez", type: "Cervical Cancer Screening", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "6", name: "Steven Johnson", type: "Dental Exam", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "7", name: "Christopher Taylor", type: "Colon Cancer Screening", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "8", name: "Richard Martin", type: "Prostate Cancer Screening", dueDate: "Sep 06, 2025", status: "Due Soon" },
  { id: "9", name: "Robert Ramirez", type: "Lipid Panel", dueDate: "Oct 10, 2025", status: "Overdue" },
  { id: "10", name: "Ashley Garcia", type: "Diabetes (A1c)", dueDate: "Oct 15, 2025", status: "Overdue" },
];

const columns: Column<ScreeningRow>[] = [
  {
    key: "name",
    header: "Patient Name",
    cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
  },
  {
    key: "type",
    header: "Screening Type",
    cell: (row) => <span className="text-muted-foreground">{row.type}</span>,
  },
  {
    key: "dueDate",
    header: "Due Date",
    cell: (row) => <span className="text-muted-foreground">{row.dueDate}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm bg-primary text-primary-foreground">
        {row.status}
      </span>
    ),
  },
];

export default function ScreeningsDue() {
  const isLoading = usePageLoading();


  const [data] = useState<ScreeningRow[]>(mockTableData);

  if (isLoading) {
    return (
      <Page title="Screenings Due" crumbs={[{ label: "Patient Outcomes" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Screenings Due" crumbs={[{ label: "Patient Outcomes" }]} chips={screeningsChips}>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 flex items-center justify-center min-h-[400px]">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockChartData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: "transparent" }}
                  content={<CustomBarTooltip />}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Bar dataKey="overdue" name="Overdue" stackId="a" fill="#10b981" barSize={16} />
                <Bar dataKey="dueSoon" name="Due Soon" stackId="a" fill="#FF6B2B" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="p-5 flex flex-col gap-4">
            
            <DataTable
              columns={columns}
              rows={data}
              rowKey={(row) => row.id}
              pageSize={10}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
