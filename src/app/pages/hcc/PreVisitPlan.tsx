import { Page } from "../../components/layout/Page";
import { hccChips } from "../../data/filters";
import { CalendarCheck, Eye } from "lucide-react";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

import { PATIENT_DATA, PatientRow } from "../../data/patients";

const columns: Column<PatientRow>[] = [
  {
    key: "name",
    header: "Patient",
    cell: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{row.name}</span>
        <span className="text-[13px] text-muted-foreground/70">{row.mrn}</span>
      </div>
    ),
  },
  {
    key: "appointment",
    header: "Appointment",
    cell: (row) => <span className="text-muted-foreground">{row.appointment}</span>,
  },
  {
    key: "risks",
    header: "Key Risks",
    cell: (row) => (
      <div className="flex flex-wrap gap-1.5 max-w-[280px]">
        {row.risks.map((risk, i) => (
          <span 
            key={i} 
            className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {risk}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: "lastReview",
    header: "Last HCC Review",
    cell: (row) => <span className="text-muted-foreground">{row.lastReview}</span>,
  },
  {
    key: "aiNotes",
    header: "AI Prep Notes",
    cell: (row) => (
      <p className="text-sm text-muted-foreground leading-relaxed min-w-[200px] max-w-[450px] whitespace-normal line-clamp-3" title={row.aiNotes}>
        {row.aiNotes}
      </p>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
        <Eye className="size-3.5" />
        View Chart
      </Button>
    ),
  },
];

export default function PreVisitPlan() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Pre-visit Planning Queue" crumbs={[{ label: "HCC Insights" }]} chips={hccChips}>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Pre-visit Planning Queue" crumbs={[{ label: "HCC Insights" }]} chips={hccChips}>
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Patients with upcoming appointments. Review potential HCC opportunities and ensure documentation readiness.
        </p>
        
        <DataTable
          columns={columns}
          rows={PATIENT_DATA}
          rowKey={(row) => row.id}
          pageSize={10}
        />
      </div>
    </Page>
  );
}
