import { useState } from "react";
import { Page } from "../../components/layout/Page";
import { vaccinationsChips } from "../../data/filters";
import { ShieldAlert, Download, Filter } from "../../lib/icons";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type VaccinationRow = {
  id: string;
  name: string;
  vaccination: string;
  dueDate: string;
  status: "Overdue" | "Due Soon";
};

const mockTableData: VaccinationRow[] = [
  { id: "1", name: "Robert Rodriguez", vaccination: "TdaP", dueDate: "Jun 07, 2024", status: "Overdue" },
  { id: "2", name: "Nancy Taylor", vaccination: "TdaP", dueDate: "Jun 08, 2024", status: "Overdue" },
  { id: "3", name: "David Ramirez", vaccination: "TdaP", dueDate: "Jun 09, 2024", status: "Overdue" },
  { id: "4", name: "Charles Garcia", vaccination: "TdaP", dueDate: "Jun 10, 2024", status: "Overdue" },
  { id: "5", name: "David Martinez", vaccination: "TdaP", dueDate: "Jun 10, 2024", status: "Overdue" },
  { id: "6", name: "Michael Moore", vaccination: "TdaP", dueDate: "Jun 10, 2024", status: "Overdue" },
  { id: "7", name: "Sarah Jackson", vaccination: "TdaP", dueDate: "Jun 10, 2024", status: "Overdue" },
  { id: "8", name: "Donald Sanchez", vaccination: "TdaP", dueDate: "Jun 11, 2024", status: "Overdue" },
  { id: "9", name: "Ashley Jones", vaccination: "TdaP", dueDate: "Jun 11, 2024", status: "Overdue" },
  { id: "10", name: "Barbara Hernandez", vaccination: "TdaP", dueDate: "Jun 13, 2024", status: "Overdue" },
  { id: "11", name: "Steven Anderson", vaccination: "TdaP", dueDate: "Jun 13, 2024", status: "Overdue" },
  { id: "12", name: "Kimberly Brown", vaccination: "TdaP", dueDate: "Jun 13, 2024", status: "Overdue" },
  { id: "13", name: "Steven Thomas", vaccination: "TdaP", dueDate: "Jun 14, 2024", status: "Overdue" },
  { id: "14", name: "Donna Moore", vaccination: "TdaP", dueDate: "Jun 14, 2024", status: "Overdue" },
  { id: "15", name: "Margaret Martinez", vaccination: "TdaP", dueDate: "Jun 14, 2024", status: "Overdue" },
];

const columns: Column<VaccinationRow>[] = [
  {
    key: "name",
    header: "Patient Name",
    cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
  },
  {
    key: "vaccination",
    header: "Vaccination",
    cell: (row) => <span className="text-muted-foreground">{row.vaccination}</span>,
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

export default function Vaccinations() {
  const isLoading = usePageLoading();


  const [data] = useState<VaccinationRow[]>(mockTableData);

  if (isLoading) {
    return (
      <Page title="Vaccinations" crumbs={[{ label: "Patient Outcomes" }]}>
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
    <Page title="Vaccinations" crumbs={[{ label: "Patient Outcomes" }]} chips={vaccinationsChips}>
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
    </Page>
  );
}
