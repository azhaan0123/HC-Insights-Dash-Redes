import { useState } from "react";
import { Users, UserCheck, UserMinus, CalendarDays, CalendarRange } from "../lib/icons";
import { Page } from "../components/layout/Page";
import { KpiCard } from "../components/dashboard/KpiCard";
import { Panel } from "../components/dashboard/EmptyState";
import { GroupedBar } from "../components/dashboard/charts";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { claimsChips } from "../data/filters";
import { claimsCostPmpm } from "../data/datasets";
import { usePageLoading } from "../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton } from "../components/dashboard/SkeletonPrimitives";

export default function ClaimsUtilization() {
  const isLoading = usePageLoading();


  const [mode, setMode] = useState("pmpm");
  const scale = mode === "total" ? 1200 : 1;
  const data = claimsCostPmpm.map((d) => ({
    name: d.name,
    DPC: d.DPC * scale,
    "Non DPC": d["Non DPC"] * scale,
  }));

  if (isLoading) {
    return (
      <Page title="Claims Utilization">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <ChartSkeleton height={280} className="mb-6" />
      </Page>
    );
  }

  return (
    <Page title="Claims Utilization" chips={claimsChips}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-section mb-6">
        <KpiCard icon={Users} title="Total Active Patients" value="2,823" caption="Total active patients" info="Total patients covered under DPC or Non-DPC for the selected timeframe." />
        <KpiCard icon={UserCheck} title="DPC Patients" value="1,894" caption="Patients with DPC coverage" info="Patients enrolled in DPC during the selected timeframe." />
        <KpiCard icon={UserMinus} title="Non DPC Patients" value="929" caption="Patients without DPC coverage" info="Patients covered under Non-DPC for the selected timeframe." />
        <KpiCard icon={CalendarDays} title="DPC Member Months" value="14,238" caption="Total DPC member months" info="Cumulative months patients were enrolled in DPC , showing utilization trends." />
        <KpiCard icon={CalendarRange} title="Non DPC Member Months" value="6,902" caption="Total Non DPC member months" info="Cumulative months patients were covered under Non-DPC for cost and usage analysis." />
      </div>

      <div className="stagger-section mb-6">
        <Panel>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm text-foreground">Claims Costs - Per Member Per Month</h3>
          <RadioGroup
            value={mode}
            onValueChange={setMode}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pmpm" id="pmpm" />
              <Label htmlFor="pmpm" className="text-sm">Per Member Per Month</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="total" id="total" />
              <Label htmlFor="total" className="text-sm">Total Amount</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <KpiCard title="Total Claims Costs" value="$ 1.42M" caption="All claims" info="Overall claims costs for DPC and Non-DPC patients during the selected timeframe." />
          <KpiCard title="DPC Claims Costs" value="$ 612K" caption="DPC claims" info="Total claims costs for DPC patients, reflecting preventive care efficiency." />
          <KpiCard title="Non DPC Claims Costs" value="$ 808K" caption="Non DPC claims" info="Total claims costs for Non-DPC patients, enabling cost comparison with DPC patients." />
        </div>

        <GroupedBar
          data={data}
          series={[
            { key: "DPC", name: "DPC", color: "var(--chart-1)" },
            { key: "Non DPC", name: "Non DPC", color: "#f59e0b" },
          ]}
          height={340}
        />
        </Panel>
      </div>

      <div className="stagger-section">
        <Panel title="High Cost Claims #">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-md">
          <KpiCard title="High Cost Claims #" value="48" caption="High cost claims" info="Number of claims categorized as high-cost, helping identify cost outliers." />
          <KpiCard title="# of Members with high cost claims" value="31" caption="Members affected" info="Unique patients with high-cost claims, indicating distribution and concentration of high-cost care." />
        </div>
        </Panel>
      </div>
    </Page>
  );
}
