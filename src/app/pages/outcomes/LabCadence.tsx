import { useState } from "react";
import { Page } from "../../components/layout/Page";
import { labCadenceChips } from "../../data/filters";
import { CalendarDays, Download, Filter, ChevronDown } from "../../lib/icons";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type CadenceRow = {
  id: string;
  name: string;
  labTest: string;
  nextDue: string;
  status: "Overdue";
};

const mockTableData: CadenceRow[] = [
  { id: "1", name: "Kimberly Martinez", labTest: "Glucose", nextDue: "Sep 08, 2024", status: "Overdue" },
  { id: "2", name: "Charles Moore", labTest: "Vitamin D", nextDue: "Sep 08, 2024", status: "Overdue" },
  { id: "3", name: "William Taylor", labTest: "TSH", nextDue: "Sep 08, 2024", status: "Overdue" },
  { id: "4", name: "Joseph Miller", labTest: "Lipid Panel Screening", nextDue: "Sep 08, 2024", status: "Overdue" },
  { id: "5", name: "Barbara Lopez", labTest: "Glucose", nextDue: "Sep 08, 2024", status: "Overdue" },
  { id: "6", name: "Joseph Jones", labTest: "Lipid Panel Screening", nextDue: "Sep 09, 2024", status: "Overdue" },
  { id: "7", name: "Michael Thomas", labTest: "Lipid Panel Screening", nextDue: "Sep 09, 2024", status: "Overdue" },
  { id: "8", name: "Kimberly Robinson", labTest: "Lipid Panel Screening", nextDue: "Sep 10, 2024", status: "Overdue" },
  { id: "9", name: "Ashley Martin", labTest: "Lipid Panel Screening", nextDue: "Sep 10, 2024", status: "Overdue" },
  { id: "10", name: "Karen Robinson", labTest: "Glucose", nextDue: "Sep 10, 2024", status: "Overdue" },
  { id: "11", name: "Donald Lee", labTest: "Lipid Panel Screening", nextDue: "Sep 10, 2024", status: "Overdue" },
  { id: "12", name: "Steven Gonzalez", labTest: "Lipid Panel Screening", nextDue: "Sep 11, 2024", status: "Overdue" },
  { id: "13", name: "Jessica Rodriguez", labTest: "Lipid Panel Screening", nextDue: "Sep 11, 2024", status: "Overdue" },
  { id: "14", name: "Michelle Davis", labTest: "Vitamin D", nextDue: "Sep 11, 2024", status: "Overdue" },
  { id: "15", name: "Matthew Perez", labTest: "Lipid Panel Screening", nextDue: "Sep 11, 2024", status: "Overdue" },
  { id: "16", name: "Patricia Perez", labTest: "TSH", nextDue: "Sep 11, 2024", status: "Overdue" },
  { id: "17", name: "Matthew Moore", labTest: "Lipid Panel Screening", nextDue: "Sep 11, 2024", status: "Overdue" },
];

const columns: Column<CadenceRow>[] = [
  {
    key: "name",
    header: "Patient Name",
    cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
  },
  {
    key: "labTest",
    header: "Lab Test",
    cell: (row) => <span className="text-muted-foreground">{row.labTest}</span>,
  },
  {
    key: "nextDue",
    header: "Next Due",
    cell: (row) => <span className="text-muted-foreground">{row.nextDue}</span>,
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

export default function LabCadence() {
  const isLoading = usePageLoading();


  const [data] = useState<CadenceRow[]>(mockTableData);

  if (isLoading) {
    return (
      <Page title="Lab Cadence" crumbs={[{ label: "Patient Outcomes" }]}>
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
    <Page title="Lab Cadence" crumbs={[{ label: "Patient Outcomes" }]} chips={labCadenceChips}>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="p-5 flex flex-col gap-4">
            
            <DataTable
              columns={columns}
              rows={data}
              rowKey={(row) => row.id}
              pageSize={15}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
