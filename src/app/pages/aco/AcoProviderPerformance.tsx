import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { ChevronDown, ArrowUp, ArrowDown } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { acoChips } from "../../data/filters";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type ProviderRow = {
  id: string;
  npi: string;
  patientCount: number;
  influenza: { value: number; trend: "up" | "down" };
  bp: { value: number; trend: "up" | "down" };
  colorectal: { value: number; trend: "up" | "down" };
  diabetes: { value: number; trend: "up" | "down" };
  depression: { value: number; trend: "up" | "down" };
  falls: { value: number; trend: "up" | "down" };
};

const mockProviders: ProviderRow[] = [
  {
    id: "1",
    npi: "NPI1000000011",
    patientCount: 36,
    influenza: { value: 73.5, trend: "up" },
    bp: { value: 28.6, trend: "down" },
    colorectal: { value: 35.7, trend: "down" },
    diabetes: { value: 71.4, trend: "down" },
    depression: { value: 11.1, trend: "down" },
    falls: { value: 61.5, trend: "down" },
  },
  {
    id: "2",
    npi: "NPI1000000004",
    patientCount: 29,
    influenza: { value: 66.7, trend: "down" },
    bp: { value: 28.6, trend: "down" },
    colorectal: { value: 58.3, trend: "down" },
    diabetes: { value: 71.4, trend: "down" },
    depression: { value: 0.0, trend: "down" },
    falls: { value: 75.0, trend: "down" },
  },
  {
    id: "3",
    npi: "NPI1000000050",
    patientCount: 27,
    influenza: { value: 88.0, trend: "up" },
    bp: { value: 63.6, trend: "up" },
    colorectal: { value: 66.7, trend: "up" },
    diabetes: { value: 62.5, trend: "up" },
    depression: { value: 25.0, trend: "up" },
    falls: { value: 100.0, trend: "up" },
  },
  {
    id: "4",
    npi: "NPI1000000048",
    patientCount: 27,
    influenza: { value: 77.8, trend: "up" },
    bp: { value: 50.0, trend: "up" },
    colorectal: { value: 69.2, trend: "up" },
    diabetes: { value: 66.7, trend: "down" },
    depression: { value: 20.0, trend: "up" },
    falls: { value: 80.0, trend: "up" },
  },
  {
    id: "5",
    npi: "NPI1000000032",
    patientCount: 26,
    influenza: { value: 60.0, trend: "down" },
    bp: { value: 25.0, trend: "down" },
    colorectal: { value: 81.8, trend: "up" },
    diabetes: { value: 81.8, trend: "down" },
    depression: { value: 23.1, trend: "up" },
    falls: { value: 77.8, trend: "down" },
  },
  {
    id: "6",
    npi: "NPI1000000033",
    patientCount: 26,
    influenza: { value: 69.2, trend: "up" },
    bp: { value: 30.0, trend: "down" },
    colorectal: { value: 68.8, trend: "up" },
    diabetes: { value: 50.0, trend: "up" },
    depression: { value: 20.0, trend: "up" },
    falls: { value: 88.9, trend: "up" },
  },
  {
    id: "7",
    npi: "NPI1000000029",
    patientCount: 25,
    influenza: { value: 66.7, trend: "down" },
    bp: { value: 27.3, trend: "down" },
    colorectal: { value: 60.0, trend: "down" },
    diabetes: { value: 50.0, trend: "up" },
    depression: { value: 20.0, trend: "up" },
    falls: { value: 88.9, trend: "up" },
  },
];

function TrendCell({ data }: { data: { value: number; trend: "up" | "down" } }) {
  const isUp = data.trend === "up";
  return (
    <div className={`flex justify-end gap-1 ${isUp ? "text-emerald-600" : "text-primary"}`}>
      <span>{data.value.toFixed(1)}</span>
      {isUp ? <ArrowUp className="size-3.5 mt-0.5" /> : <ArrowDown className="size-3.5 mt-0.5" />}
    </div>
  );
}

const columns: Column<ProviderRow>[] = [
  {
    key: "npi",
    header: "Provider NPI",
    cell: (row) => <span className="text-foreground font-medium">{row.npi}</span>,
  },
  {
    key: "patientCount",
    header: "Patient Count",
    align: "right",
    cell: (row) => <span className="text-muted-foreground">{row.patientCount}</span>,
  },
  {
    key: "influenza",
    header: "Influenza Immunization (%)",
    align: "right",
    cell: (row) => <TrendCell data={row.influenza} />,
  },
  {
    key: "bp",
    header: "Controlling High BP (%)",
    align: "right",
    cell: (row) => <TrendCell data={row.bp} />,
  },
  {
    key: "colorectal",
    header: "Colorectal Cancer Screening (%)",
    align: "right",
    cell: (row) => <TrendCell data={row.colorectal} />,
  },
  {
    key: "diabetes",
    header: "Diabetes HbA1c Poor Control > 9% (%)",
    align: "right",
    cell: (row) => <TrendCell data={row.diabetes} />,
  },
  {
    key: "depression",
    header: "Depression Remission at 12 Months (%)",
    align: "right",
    cell: (row) => <TrendCell data={row.depression} />,
  },
  {
    key: "falls",
    header: "Falls Risk Screening (%)",
    align: "right",
    cell: (row) => <TrendCell data={row.falls} />,
  },
];

export default function AcoProviderPerformance() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Provider Performance" crumbs={[{ label: "ACO Insights" }]}>
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
    <Page title="Provider Performance" crumbs={[{ label: "ACO Insights" }]} chips={acoChips}>
      <div className="space-y-6">
      
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Provider Performance Benchmarking</h3>
          
          <div className="relative">
            <select className="appearance-none rounded border border-border bg-background pl-3 pr-8 py-1.5 text-sm text-foreground outline-none focus:border-primary">
              <option>All Measures</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <svg className="absolute left-[-24px] top-1/2 size-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </div>
        </div>
        
        <div className="p-2 overflow-x-auto">
          <div className="min-w-[1200px]">
            <DataTable
              columns={columns}
              rows={mockProviders}
              rowKey={(row) => row.id}
              pageSize={15}
            />
          </div>
        </div>
      </div>
      </div>
    </Page>
  );
}
