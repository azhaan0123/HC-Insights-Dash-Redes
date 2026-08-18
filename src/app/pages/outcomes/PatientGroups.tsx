import { useState } from "react";
import { Page } from "../../components/layout/Page";
import { patientGroupsChips } from "../../data/filters";
import { Icd10Code } from "../../components/ui/icd10-code";
import { Users, Download, Filter } from "../../lib/icons";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type PatientGroupRow = {
  id: string;
  name: string;
  disease: string;
  icd10: string;
  status: "Controlled" | "Uncontrolled" | "Stable" | "Improving" | "Worsening";
};

const mockData: PatientGroupRow[] = [
  { id: "1", name: "Mary Wilson", disease: "Hypertension", icd10: "I10", status: "Uncontrolled" },
  { id: "2", name: "Ashley Garcia", disease: "Diabetes Mellitus Type 2", icd10: "E11.9", status: "Controlled" },
  { id: "3", name: "Ashley Garcia", disease: "Obesity", icd10: "E66.9", status: "Stable" },
  { id: "4", name: "Lisa Gonzalez", disease: "Vitamin B12 deficiency", icd10: "E53.8", status: "Improving" },
  { id: "5", name: "Lisa Gonzalez", disease: "Hormone Replacement Therapy Management", icd10: "Z79.890", status: "Worsening" },
  { id: "6", name: "Lisa Gonzalez", disease: "Diabetes Mellitus Type 2", icd10: "E11.9", status: "Controlled" },
  { id: "7", name: "Lisa Gonzalez", disease: "Hypertension", icd10: "I10", status: "Controlled" },
  { id: "8", name: "Andrew Jones", disease: "Obesity", icd10: "E66.9", status: "Controlled" },
  { id: "9", name: "Nancy Wilson", disease: "Hypertension", icd10: "I10", status: "Controlled" },
  { id: "10", name: "Robert Ramirez", disease: "Vitamin B12 deficiency", icd10: "E53.8", status: "Stable" },
  { id: "11", name: "Robert Ramirez", disease: "Vitamin D deficiency, unspecified", icd10: "E55.9", status: "Improving" },
  { id: "12", name: "Robert Ramirez", disease: "Diabetes Mellitus Type 2", icd10: "E11.9", status: "Stable" },
  { id: "13", name: "Robert Ramirez", disease: "Anxiety disorder, unspecified", icd10: "F41.9", status: "Stable" },
  { id: "14", name: "Donna Moore", disease: "Hyperlipidemia, unspecified", icd10: "E78.5", status: "Worsening" },
  { id: "15", name: "Christopher Williams", disease: "Diabetes Mellitus Type 2", icd10: "E11.9", status: "Uncontrolled" },
  { id: "16", name: "Christopher Williams", disease: "Vitamin B12 deficiency", icd10: "E53.8", status: "Improving" },
  { id: "17", name: "Christopher Williams", disease: "Hypertension", icd10: "I10", status: "Controlled" },
];

const columns: Column<PatientGroupRow>[] = [
  {
    key: "name",
    header: "Patient Name",
    cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
  },
  {
    key: "disease",
    header: "Disease",
    cell: (row) => <span className="text-muted-foreground">{row.disease}</span>,
  },
  {
    key: "icd10",
    header: "ICD-10",
    cell: (row) => <Icd10Code code={row.icd10} className="text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground/90 transition-colors" />,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => {
      const isStable = row.status === "Stable";
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ${
          isStable 
            ? "border border-border bg-background text-muted-foreground" 
            : "bg-primary text-primary-foreground"
        }`}>
          {row.status}
        </span>
      );
    },
  },
];

export default function PatientGroups() {
  const isLoading = usePageLoading();


  const [data] = useState<PatientGroupRow[]>(mockData);

  if (isLoading) {
    return (
      <Page title="Patient Groups" crumbs={[{ label: "Patient Outcomes" }]}>
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
    <Page title="Patient Groups" crumbs={[{ label: "Patient Outcomes" }]} chips={patientGroupsChips}>
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
    </Page>
  );
}
