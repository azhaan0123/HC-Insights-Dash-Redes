import { useState } from "react";
import { HeartPulse } from "../lib/icons";
import { Page } from "../components/layout/Page";
import { KpiCard } from "../components/dashboard/KpiCard";
import { Panel } from "../components/dashboard/EmptyState";
import { HorizontalBar } from "../components/dashboard/charts";
import { DataTable, type Column } from "../components/dashboard/DataTable";
import { IdCell } from "../components/dashboard/cells";
import { ToggleTabs } from "../components/dashboard/ToggleTabs";
import { baseChips } from "../data/filters";
import {
  chronicConditionPatients,
  chronicDistribution,
  topChronicConditions,
} from "../data/datasets";
import { usePageLoading } from "../hooks/usePageLoading";
import { KpiCardSkeleton, PanelSkeleton } from "../components/dashboard/SkeletonPrimitives";

type Row = (typeof chronicConditionPatients)[number];

const columns: Column<Row>[] = [
  { key: "id", header: "Patient ID", cell: (r) => <IdCell id={r.id} /> },
  { key: "name", header: "Patient Name" },
  { key: "condition", header: "Medical Condition" },
  { key: "employer", header: "Employer" },
  { key: "dpc", header: "DPC" },
  { key: "physician", header: "Physician" },
];

export default function ChronicRisk() {
  const isLoading = usePageLoading();


  const [mode, setMode] = useState("active");
  const [showTable, setShowTable] = useState(false);
  const chips = baseChips.filter((c) => c.label !== "Start Date" && c.label !== "End Date");

  if (isLoading) {
    return (
      <Page title="Calculate Chronic Risk By">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 mb-6">
          <KpiCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
          <PanelSkeleton height={220} />
          <PanelSkeleton height={220} />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Calculate Chronic Risk By"
      chips={chips}
      leading={
        <ToggleTabs
          value={mode}
          onChange={setMode}
          withCheck
          options={[
            { value: "active", label: "Total Active Patients" },
            { value: "encounters", label: "Patients with Encounter(s)" },
          ]}
        />
      }
    >
      <div className="stagger-section mb-6">
        <KpiCard
        icon={HeartPulse}
        className="max-w-xs"
        title="Chronic Condition Patients"
        info={
          mode === "active"
            ? "Total count and percentage of active patients with Chronic Conditions."
            : "Total count and percentage of patients with encounters with Chronic Conditions."
        }
        value={
          mode === "active" ? (
            <span>
              1612 <span className="text-primary" style={{ fontSize: "0.9rem" }}>(57.1%)</span>
            </span>
          ) : (
            <span>
              1611 <span className="text-primary" style={{ fontSize: "0.9rem" }}>(57.5%)</span>
            </span>
          )
        }
        caption={
          mode === "active"
            ? "Total Active Patients: 2823"
            : "Patients with Encounter(s): 2802"
        }
              />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 stagger-section mb-6">
        <Panel title="Top Chronic Conditions">
          <div onClick={() => setShowTable(true)} className="cursor-pointer">
            <HorizontalBar
              data={topChronicConditions}
              color="var(--chart-1)"
              xLabel="Percentage of Active Patients"
              yLabel="Chronic Condition"
              valueFormatter={(v) => `${v}%`}
            />
          </div>
        </Panel>
        <Panel title="Chronic Condition Distribution">
          <HorizontalBar
            data={chronicDistribution}
            color="#f59e0b"
            xLabel="Percentage of Active Patients"
            yLabel="Condition Type"
            valueFormatter={(v) => `${v}%`}
          />
        </Panel>
      </div>

      {showTable ? (
        <div className="space-y-2 stagger-section">
          <h3 className="text-sm text-foreground">
            Top Chronic Conditions - Essential (primary) hypertension (I10)
          </h3>
          <DataTable columns={columns} rows={chronicConditionPatients} rowKey={(r) => r.id} />
        </div>
      ) : (
        <div className="stagger-section">
          <Panel>
            <p className="py-6 text-center text-sm text-muted-foreground">
              Click a bar or label to show or hide patient details.
            </p>
          </Panel>
        </div>
      )}
    </Page>
  );
}
