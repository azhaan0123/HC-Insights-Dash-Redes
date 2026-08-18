import { useState } from "react";
import { ListTodo, ClipboardList, CheckCircle2, XCircle } from "../../lib/icons";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Page } from "../../components/layout/Page";
import { hccChips } from "../../data/filters";
import { PATIENT_DATA, PatientRow } from "../../data/patients";
import { PatientProfileSidebar } from "./PatientProfileSidebar";
import { Icd10Code } from "../../components/ui/icd10-code";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

export default function HccCodingQueue() {
  const isLoading = usePageLoading();


  const [patients, setPatients] = useState<PatientRow[]>(PATIENT_DATA);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: PatientRow["codingStatus"]) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, codingStatus: newStatus } : p));
  };

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
      key: "encounter",
      header: "Encounter",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-muted-foreground">{row.encounterId}</span>
          <span className="text-[13px] text-muted-foreground/70">{row.encounterDate}</span>
        </div>
      ),
    },
    {
      key: "diagnosis",
      header: "Primary Diagnosis",
      cell: (row) => <span className="text-muted-foreground">{row.diagnosis}</span>,
    },
    {
      key: "suggestions",
      header: "AI Suggested HCCs",
      cell: (row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.suggestions.length > 0 ? (
            row.suggestions.map((sug, i) => (
              <Icd10Code
                key={i} 
                code={sug.code}
                className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                {sug.code} <span className="ml-1 opacity-70">({sug.score})</span>
              </Icd10Code>
            ))
          ) : (
            <span className="text-muted-foreground/70 text-xs italic">None</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        if (row.codingStatus === "Reviewed") {
          return (
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Reviewed
            </span>
          );
        }
        if (row.codingStatus === "Flagged") {
          return (
            <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground shadow-xs">
              Flagged
            </span>
          );
        }
        return (
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground shadow-xs">
            AI Suggested
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2.5">
          <div className="group relative flex justify-center">
            <button 
              onClick={() => setSelectedPatientId(row.id)}
              className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            >
              <ClipboardList className="size-[18px]" />
            </button>
            <div className="pointer-events-none absolute bottom-full mb-1.5 z-50 flex flex-col items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="whitespace-nowrap rounded-lg bg-popover border border-border px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md">
                Review Patient Chart / Edit Codes
              </span>
            </div>
          </div>

          <div className="group relative flex justify-center">
            <button 
              onClick={() => handleUpdateStatus(row.id, "Reviewed")}
              className={`grid size-8 place-items-center rounded-full transition-colors cursor-pointer ${
                row.codingStatus === "Reviewed" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" : "text-emerald-600/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              }`}
            >
              <CheckCircle2 className="size-[18px]" />
            </button>
            <div className="pointer-events-none absolute bottom-full mb-1.5 z-50 flex flex-col items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="whitespace-nowrap rounded-lg bg-popover border border-border px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md">
                Accept AI Suggestions
              </span>
            </div>
          </div>

          <div className="group relative flex justify-center">
            <button 
              onClick={() => handleUpdateStatus(row.id, "Flagged")}
              className={`grid size-8 place-items-center rounded-full transition-colors cursor-pointer ${
                row.codingStatus === "Flagged" ? "text-destructive bg-destructive/10" : "text-destructive/70 hover:bg-destructive/10"
              }`}
            >
              <XCircle className="size-[18px]" />
            </button>
            <div className="pointer-events-none absolute bottom-full mb-1.5 z-50 flex flex-col items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="whitespace-nowrap rounded-lg bg-popover border border-border px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md">
                Flag for Deeper Review
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Page title="Coding Queue" crumbs={[{ label: "HCC Insights" }]}>
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
    <>
      <Page title="HCC Coding Queue" crumbs={[{ label: "HCC Insights" }]} chips={hccChips}>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            rows={patients}
            rowKey={(row) => row.id}
            pageSize={10}
          />
        </div>
      </Page>

      {/* Patient Details Sidebar */}
      <PatientProfileSidebar
        open={selectedPatientId !== null}
        onOpenChange={(open) => !open && setSelectedPatientId(null)}
        patient={patients.find((p) => p.id === selectedPatientId) || null}
      />
    </>
  );
}
