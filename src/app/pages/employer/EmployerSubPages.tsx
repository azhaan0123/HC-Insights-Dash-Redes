import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  DollarSign,
  Heart,
  AlertTriangle,
  BarChart2,
  Download,
  Search,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Building2,
  BadgeDollarSign,
  HeartPulse,
  LineChart,
  ClipboardCheck
} from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { employerChips } from "../../data/filters";

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase font-semibold">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

// ----------------------------------------------------------------------
// 1. ENROLLMENT SUBPAGE (Re-exported from dedicated standalone file)
// ----------------------------------------------------------------------
export { EmployerEnrollmentPage } from "./EmployerEnrollmentPage";

// ----------------------------------------------------------------------
// 2. FINANCIAL PERFORMANCE SUBPAGE (Re-exported from dedicated standalone file)
// ----------------------------------------------------------------------
export { EmployerFinancialPage } from "./EmployerFinancialPage";

// ----------------------------------------------------------------------
// 3. CHRONIC CONDITIONS SUBPAGE (Re-exported from dedicated standalone file)
// ----------------------------------------------------------------------
export { EmployerChronicPage } from "./EmployerChronicPage";

// ----------------------------------------------------------------------
// 4. HIGH-COST CLAIMANTS SUBPAGE (Re-exported from dedicated standalone file)
// ----------------------------------------------------------------------
export { EmployerHighCostPage } from "./EmployerHighCostPage";

// ----------------------------------------------------------------------
// 5. BENCHMARKING SUBPAGE
// ----------------------------------------------------------------------
export function EmployerBenchmarkingPage() {
  const benchmarkRows = [
    { metric: "Overall Employer Risk Score", acme: "53 / 100", regionalAvg: "62 / 100", nationalAvg: "65 / 100", status: "Better (Lower Risk)" },
    { metric: "Emergency Department Visits (Per 1k)", acme: "112 Visits", regionalAvg: "185 Visits", nationalAvg: "210 Visits", status: "39.5% Lower Utilization" },
    { metric: "Inpatient Hospital Admissions (Per 1k)", acme: "42 Admits", regionalAvg: "68 Admits", nationalAvg: "74 Admits", status: "38.2% Lower Hospitalization" },
    { metric: "Generic Drug Dispensing Rate (GDR)", acme: "89.4%", regionalAvg: "82.1%", nationalAvg: "80.5%", status: "7.3% Higher Efficiency" },
    { metric: "Primary Care Annual Touch Rate", acme: "94.2%", regionalAvg: "61.0%", nationalAvg: "58.4%", status: "+33.2% Better Engagement" },
    { metric: "Total Per Member Per Month (PMPM)", acme: "$489.50", regionalAvg: "$531.30", nationalAvg: "$565.00", status: "$41.80 PMPM Savings" },
  ];

  return (
    <Page
      title="Employer Risk Benchmarking & ROI Scorecard"
      subtitle="Comparing Acme Corporation against regional commercial health plans and national benchmarks"
      chips={employerChips}
      showFilters={true}
      showIconActions={true}
    >
      <section className="stagger-section mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={LineChart}
            title="Overall Risk Score"
            value="53 / 100"
            caption="Moderate Risk • 9 points below benchmark"
            info="Population risk score benchmarked against regional employer health plans."
          />
          <KpiCard
            icon={BadgeDollarSign}
            title="Total Annual DPC Savings"
            value="$245,366"
            caption="Calculated via $41.80 PMPM × 489 members × 12 mo"
            info="Direct primary care financial savings compared to regional fee-for-service benchmarks."
          />
          <KpiCard
            icon={TrendingUp}
            title="Estimated 3-Year ROI"
            value="3.4x"
            caption="Direct primary care investment multiple"
            info="Cumulative return on investment achieved over a 36-month tracking horizon."
          />
        </div>
      </section>

      <section className="stagger-section mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <SectionLabel>Comparative Performance vs Regional & National Commercial Health Plans</SectionLabel>
          <Button variant="default" size="sm" className="rounded-lg shadow-2xs gap-1.5 self-start sm:self-auto font-semibold">
            <Download className="size-3.5" />
            <span>Export Executive Scorecard</span>
          </Button>
        </div>
        <Card className="p-6 rounded-2xl border bg-card shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Performance Metric</th>
                <th className="py-3 px-4">Acme Corporation (HealthCompiler DPC)</th>
                <th className="py-3 px-4">Regional Commercial Average</th>
                <th className="py-3 px-4">National Commercial Average</th>
                <th className="py-3 px-4">DPC Performance Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {benchmarkRows.map((b) => (
                <tr key={b.metric} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{b.metric}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-rose-600">{b.acme}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-muted-foreground">{b.regionalAvg}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-muted-foreground">{b.nationalAvg}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold">
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </Page>
  );
}
