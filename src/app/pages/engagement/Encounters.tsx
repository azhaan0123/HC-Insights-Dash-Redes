import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Panel } from "../../components/dashboard/EmptyState";
import { AreaTrend } from "../../components/dashboard/charts";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { IdCell } from "../../components/dashboard/cells";
import { baseChips } from "../../data/filters";
import { encounters, encounterTrend, type EncounterRow } from "../../data/datasets";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

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

const noteLines = [
  "Date Range = 31 Days: Daily data, each day as a unit.",
  "Date Range 31-90 Days: Weekly data, each point as the week's total from its first day.",
  "Date Range 91-548 Days (1-1.5 Years): Monthly data, each month as a single point.",
  "Date Range > 548 Days (>1.5 Years): Yearly data, each year as a single point.",
];

export default function Encounters() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Total # Encounters" crumbs={[{ label: "Engagement and Utilization", to: "/engagement" }]}>
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
    <Page
      title="Total # Encounters"
      crumbs={[{ label: "Engagement and Utilization", to: "/engagement" }]}
      chips={baseChips}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <KpiCard 
          title="Total # Encounters" 
          value="7214" 
          caption="Total encounters during selected timeframe" 
          info="This is the total number of encounters that have occurred during the selected period for all employees on the plan, as of the latest date and time the dashboard was updated. This includes office visits, chat (conversations via the Spruce messaging application), and telehealth encounters."
        />
        <KpiCard
          title="Encounter Types - Breakdown"
          subs={[
            { value: "53.2%", label: "In Person" },
            { value: "17.6%", label: "Virtual" },
            { value: "15%", label: "Telehealth" },
            { value: "6.8%", label: "Documentation" },
            { value: "6.5%", label: "After Hours" },
            { value: "0.9%", label: "Chat" },
          ]}
          info="This is the breakdown of encounters by type, including in-person, telehealth, and chat (conversations through the Spruce messaging application), for the selected period."
        />
      </div>

      <Panel>
        <p className="mb-2 text-xs text-muted-foreground">
          Note: Dynamic date range on the x-axis in the graph.
        </p>
        <ul className="mb-3 space-y-0.5 text-xs text-muted-foreground">
          {noteLines.map((l) => (
            <li key={l}>• {l}</li>
          ))}
        </ul>
        <AreaTrend
          data={encounterTrend}
          series={[{ key: "value", name: "Total Encounters", color: "var(--chart-1)" }]}
          xLabel="Time Period (Yearly)"
          yLabel="Total Encounters"
        />
      </Panel>

      <DataTable columns={columns} rows={encounters} rowKey={(r) => r.id} />
    </Page>
  );
}
