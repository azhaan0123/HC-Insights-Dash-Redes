import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Panel } from "../../components/dashboard/EmptyState";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { IdCell } from "../../components/dashboard/cells";
import { baseChips } from "../../data/filters";
import { afterHoursEncounters, type EncounterRow } from "../../data/datasets";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton } from "../../components/dashboard/SkeletonPrimitives";

const columns: Column<EncounterRow>[] = [
  { key: "id", header: "Patient ID", cell: (r) => <IdCell id={r.id} /> },
  { key: "name", header: "Patient Name" },
  { key: "encounterId", header: "Encounter ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.encounterId}</span> },
  { key: "type", header: "Encounter Type" },
  { key: "date", header: "Encounter Date Time" },
  { key: "employer", header: "Employer" },
  { key: "dpc", header: "DPC" },
  { key: "physician", header: "Physician" },
];

export default function TotalAfterHoursEncounters() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Total # After Hours Encounters" crumbs={[{ label: "Engagement and Utilization", to: "/engagement" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 mb-6">
          <KpiCardSkeleton />
        </div>
        <ChartSkeleton height={280} className="mb-6" />
      </Page>
    );
  }

  return (
    <Page
      title="Total # After Hours Encounters"
      crumbs={[{ label: "Engagement and Utilization", to: "/engagement" }]}
      chips={baseChips}
    >
      <KpiCard
        className="max-w-xs"
        title="Total # After Hours Encounters"
        value="6627"
        caption="Total encounters after hours and weekends."
        info="This represents the total count of encounters that occurred after 5 PM and before 8 AM (Local Practice Timezone) on weekdays, as well as any time during weekends."
      />

      <Panel>
        <DataTable
          columns={columns}
          rows={afterHoursEncounters}
          rowKey={(r, i) => r.id + i}
        />
      </Panel>
    </Page>
  );
}
