import { useState } from "react";
import { FileText, DollarSign, Workflow, Wallet, PiggyBank, Percent } from "../lib/icons";
import { Page } from "../components/layout/Page";
import { KpiCard } from "../components/dashboard/KpiCard";
import { Panel } from "../components/dashboard/EmptyState";
import { ToggleTabs } from "../components/dashboard/ToggleTabs";
import {
  HorizontalBar,
  PieBreakdown,
  GroupedBar,
  AreaTrend,
} from "../components/dashboard/charts";
import { coordinatedCareChips } from "../data/filters";
import {
  coordinatedCareCategories,
  procedureSubCategories,
  claimsCategoryCount,
  serviceTypeCount,
  claimsCategoryAmount,
  serviceTypeAmount,
} from "../data/datasets";
import { usePageLoading } from "../hooks/usePageLoading";
import { KpiCardSkeleton, PanelSkeleton } from "../components/dashboard/SkeletonPrimitives";

const TABS = [
  { value: "categories", label: "Coordinated Care Categories" },
  { value: "savings", label: "Care Coordination Savings" },
  { value: "categorization", label: "Claims Categorization" },
  { value: "cost", label: "Cost Analysis" },
  { value: "volume", label: "Volume & Patterns" },
];

const money = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function CoordinatedCare() {
  const isLoading = usePageLoading();


  const [tab, setTab] = useState("categories");

  if (isLoading) {
    return (
      <Page title="Coordinated Care">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
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
    <Page title="Coordinated Care" chips={coordinatedCareChips}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 stagger-section mb-4">
        <KpiCard icon={FileText} title="Total # of Claims" value="170" caption="Total claims." />
        <KpiCard icon={DollarSign} title="Total Amount on Claims" value="$35,497.14" caption="Total claims amount." />
        <KpiCard icon={Workflow} title="Total # Coordinated Care" value="101" caption="Unique coordinated care claims" />
        <KpiCard icon={Wallet} title="Total Amount on Coordinated Care" value="$24,296.92" caption="Total plan-paid amount." />
        <KpiCard icon={PiggyBank} title="Total Care Coordination Cost Savings" empty />
      </div>
      <div className="stagger-section mb-6">
        <KpiCard icon={Percent} className="max-w-xs" title="Cost as % of Medicaid" value="546.55%" />
      </div>

      <div className="stagger-section mb-6">
        <ToggleTabs value={tab} onChange={setTab} options={TABS} className="flex-wrap" />
      </div>

      <div key={tab} className="animate-fade-in-up">

      {tab === "categories" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Coordinated Care Categories: Amount Distribution">
            <HorizontalBar
              data={coordinatedCareCategories}
              color="var(--chart-1)"
              xLabel="Percentage"
              yLabel="Categories"
              valueFormatter={(v) => `${v}%`}
            />
          </Panel>
          <Panel title="Procedures Sub-Categories">
            <p className="mb-2 text-xs text-muted-foreground">
              Note: Hover sub-categories to highlight, click legends for details.
            </p>
            <PieBreakdown data={procedureSubCategories} />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {procedureSubCategories.map((p) => (
                <span key={p.name} className="flex items-center gap-1.5 transition-[opacity,transform] duration-200 hover:translate-x-1 cursor-default">
                  <span className="size-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  {p.name}: <span className="tabular-nums font-medium">{money(p.value)}</span>
                </span>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === "categorization" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Claims Category - Claims Count">
            <HorizontalBar data={claimsCategoryCount} color="var(--chart-1)" xLabel="Claims Count" yLabel="Claims Category" />
          </Panel>
          <Panel title="Service Type - Claims Count">
            <HorizontalBar data={serviceTypeCount} color="var(--chart-1)" xLabel="Claims Count" yLabel="Service Type" />
          </Panel>
          <Panel title="Claims Category - (PatientPaid + PlanPaid) Amount">
            <HorizontalBar
              data={claimsCategoryAmount}
              color="var(--chart-1)"
              xLabel="Total (PatientPaid + PlanPaid) Amount"
              yLabel="Claims Category"
              valueFormatter={money}
            />
          </Panel>
          <Panel title="Service Type - (PatientPaid + PlanPaid) Amount">
            <HorizontalBar
              data={serviceTypeAmount}
              color="var(--chart-1)"
              xLabel="Total (PatientPaid + PlanPaid) Amount"
              yLabel="Service Type"
              valueFormatter={money}
            />
          </Panel>
        </div>
      )}

      {tab === "savings" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Care Coordination Savings by Category">
            <HorizontalBar
              data={[
                { name: "Procedures", value: 8420 },
                { name: "Imaging", value: 3160 },
                { name: "Labs", value: 980 },
              ]}
              color="#16a34a"
              xLabel="Savings ($)"
              yLabel="Category"
              valueFormatter={money}
            />
          </Panel>
          <Panel title="Cumulative Savings Trend">
            <AreaTrend
              data={[
                { name: "Q1", value: 2400 },
                { name: "Q2", value: 5600 },
                { name: "Q3", value: 9100 },
                { name: "Q4", value: 12560 },
              ]}
              series={[{ key: "value", name: "Savings", color: "#16a34a" }]}
              yLabel="Cumulative Savings ($)"
            />
          </Panel>
        </div>
      )}

      {tab === "cost" && (
        <Panel title="Cost Analysis - Patient vs Plan Paid">
          <GroupedBar
            data={[
              { name: "Procedures", "Patient Paid": 1200, "Plan Paid": 8800 },
              { name: "Imaging", "Patient Paid": 640, "Plan Paid": 2086 },
              { name: "Labs", "Patient Paid": 180, "Plan Paid": 540 },
            ]}
            series={[
              { key: "Patient Paid", name: "Patient Paid", color: "var(--chart-1)" },
              { key: "Plan Paid", name: "Plan Paid", color: "var(--chart-3)" },
            ]}
            height={340}
          />
        </Panel>
      )}

      {tab === "volume" && (
        <Panel title="Claims Volume & Patterns Over Time">
          <AreaTrend
            data={[
              { name: "Jan", value: 12 },
              { name: "Feb", value: 18 },
              { name: "Mar", value: 22 },
              { name: "Apr", value: 28 },
              { name: "May", value: 24 },
              { name: "Jun", value: 31 },
            ]}
            series={[{ key: "value", name: "Coordinated Care Claims", color: "var(--chart-1)" }]}
            yLabel="Claims Count"
          />
        </Panel>
      )}
      </div>
    </Page>
  );
}
