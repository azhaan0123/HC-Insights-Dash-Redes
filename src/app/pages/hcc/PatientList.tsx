import { ReactNode } from "react";
import { Link } from "react-router";
import { Paperclip, Clock, ExternalLink, Users, HelpCircle, Eye } from "../../lib/icons";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { PatientRow, PATIENT_DATA } from "../../data/patients";

const getStatusBadge = (status: PatientRow["status"]) => {
  switch (status) {
    case "Open":
      return <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">Open</span>;
    case "Confirmed":
      return <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Confirmed</span>;
    case "Deferred":
      return <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">Deferred</span>;
    case "Rejected":
      return <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Rejected</span>;
    default:
      return <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">N/A</span>;
  }
};

const getClassificationBadge = (cls: string) => {
  if (cls === "Proactive") {
    return <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">Proactive</span>;
  }
  return <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">Reactive</span>;
};

const getAwvBadge = (awv: string) => {
  if (awv === "Completed") {
    return <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">Completed</span>;
  }
  return <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Pending</span>;
};

import { Page } from "../../components/layout/Page";
import { hccChips } from "../../data/filters";
import { useState, useMemo } from "react";
import { PatientProfileSidebar } from "./PatientProfileSidebar";
import { usePageLoading } from "../../hooks/usePageLoading";
import { TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

export default function HccPatientList() {
  const isLoading = usePageLoading();


  const [selectedPatient, setSelectedPatient] = useState<PatientRow | null>(null);

  const columns = useMemo<Column<PatientRow>[]>(() => [
    {
      key: "name",
      header: "Patient",
      cell: (row) => <span className="font-medium text-primary hover:underline cursor-pointer" onClick={() => setSelectedPatient(row)}>{row.name}</span>,
    },
    { key: "mrn", header: "MRN", cell: (row) => <span className="text-muted-foreground">{row.mrn}</span> },
    { key: "suspectedHcc", header: "Suspected HCC" },
    { key: "classification", header: "Classification", cell: (row) => getClassificationBadge(row.classification) },
    { key: "awvStatus", header: "AWV Status", cell: (row) => getAwvBadge(row.awvStatus) },
    {
      key: "lastTrigger",
      header: "Last Trigger",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {row.lastTrigger.type === "paperclip" ? <Paperclip className="size-3.5" /> : <Clock className="size-3.5" />}
          {row.lastTrigger.date}
        </div>
      ),
    },
    { key: "status", header: "Status", cell: (row) => getStatusBadge(row.status) },
    {
      key: "lastReviewed",
      header: "Last Reviewed",
      cell: (row) => {
        if (!row.lastReviewed) return <span className="text-muted-foreground/70">N/A</span>;
        return (
          <div className="flex flex-col text-[13px]">
            <span className="font-medium text-foreground/90">{row.lastReviewed.doctor}</span>
            <span className="text-muted-foreground/70">{row.lastReviewed.date}</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setSelectedPatient(row)}
          className="h-8 gap-1.5 text-xs text-muted-foreground"
        >
          <Eye className="size-3.5" />
          View Details
        </Button>
      ),
    },
  ], []);

  if (isLoading) {
    return (
      <Page title="Patient List" crumbs={[{ label: "HCC Insights" }]}>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Patient List" crumbs={[{ label: "HCC Insights" }]} chips={hccChips}>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          rows={PATIENT_DATA}
          rowKey={(row) => row.id}
          pageSize={10}
        />
      </div>

      <PatientProfileSidebar 
        open={selectedPatient !== null} 
        onOpenChange={(open) => !open && setSelectedPatient(null)} 
        patient={selectedPatient} 
      />
    </Page>
  );
}
