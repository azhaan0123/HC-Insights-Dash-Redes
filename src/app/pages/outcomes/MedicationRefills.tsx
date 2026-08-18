import { useState } from "react";
import { Page } from "../../components/layout/Page";
import { medicationRefillsChips } from "../../data/filters";
import { Pill, Download, Filter, ChevronDown } from "../../lib/icons";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type RefillRow = {
  id: string;
  name: string;
  medication: string;
  dueDate: string;
  status: "Refill Due";
};

const mockTableData: RefillRow[] = [
  { id: "1", name: "Margaret Sanchez", medication: "Amlodipine (5mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "2", name: "Emily Garcia", medication: "Omeprazole (20mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "3", name: "Joshua Moore", medication: "Lisinopril (10mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "4", name: "Michael Moore", medication: "Lisinopril (10mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "5", name: "Karen Thomas", medication: "Amlodipine (5mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "6", name: "Matthew Hernandez", medication: "Amlodipine (5mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "7", name: "Matthew Miller", medication: "Lisinopril (10mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "8", name: "Jessica Miller", medication: "Lisinopril (10mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "9", name: "Richard Jackson", medication: "Metformin (1000mg twice daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "10", name: "Barbara Clark", medication: "Omeprazole (20mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "11", name: "Matthew Thomas", medication: "Vitamin D Supplement (2000IU daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "12", name: "Mary Miller", medication: "Omeprazole (20mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "13", name: "Lisa Martin", medication: "Omeprazole (20mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "14", name: "Andrew Martinez", medication: "Lisinopril (10mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "15", name: "James Gonzalez", medication: "Lisinopril (10mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "16", name: "Jennifer Johnson", medication: "Omeprazole (20mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
  { id: "17", name: "Kimberly Davis", medication: "Amlodipine (5mg daily)", dueDate: "May 08, 2025", status: "Refill Due" },
];

const columns: Column<RefillRow>[] = [
  {
    key: "name",
    header: "Patient Name",
    cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
  },
  {
    key: "medication",
    header: "Medication",
    cell: (row) => <span className="text-muted-foreground">{row.medication}</span>,
  },
  {
    key: "dueDate",
    header: "Refill Due",
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

export default function MedicationRefills() {
  const isLoading = usePageLoading();


  const [data] = useState<RefillRow[]>(mockTableData);

  if (isLoading) {
    return (
      <Page title="Medication Refills" crumbs={[{ label: "Patient Outcomes" }]}>
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
    <Page title="Medication Refills" crumbs={[{ label: "Patient Outcomes" }]} chips={medicationRefillsChips}>
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
