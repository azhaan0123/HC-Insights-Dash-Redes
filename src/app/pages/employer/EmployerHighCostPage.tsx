import React, { useState } from "react";
import {
  Users,
  ShieldAlert,
  BadgeDollarSign,
  TrendingUp,
  Download,
  ArrowUpDown,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Info
} from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { employerChips } from "../../data/filters";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell
} from "recharts";

// ----------------------------------------------------------------------
// DATA DEFINITIONS & CHARTS DATA
// ----------------------------------------------------------------------

// 1. Potential HCC Distribution horizontal bar data
const POTENTIAL_HCC_DIST = [
  { name: "Low (25-50%)", count: 5, color: "#374151" },
  { name: "Moderate (50-75%)", count: 1, color: "#22c55e" },
  { name: "Elevated (75-90%)", count: 0, color: "#eab308" },
  { name: "Approaching (90-100%)", count: 0, color: "#ea580c" },
  { name: "Exceeded (>100%)", count: 11, color: "#dc2626" },
];

// 2. HCC by Relationship horizontal bar data
const RELATIONSHIP_SPEND_DATA = [
  { name: "Self", spend: 1100000, formattedSpend: "$1.1M", color: "#e32168" },
  { name: "Spouse", spend: 320000, formattedSpend: "$320K", color: "#65a30d" },
  { name: "Child", spend: 500000, formattedSpend: "$500K", color: "#0d9488" },
];

// 3. High-Cost Claimant Detail Table Data
interface ClaimantRow {
  id: number;
  age: number;
  sex: "F" | "M";
  relationship: string;
  diagnosis: string;
  medicalPaid: number;
  rxPaid: number;
  priorYearTotal: number;
  currentTotal: number;
  dpcStatus: "gray" | "red" | "green";
}

const CLAIMANT_ROWS: ClaimantRow[] = [
  { id: 1, age: 45, sex: "F", relationship: "Self", diagnosis: "Hyperlipidemia", medicalPaid: 215143, rxPaid: 11549, priorYearTotal: 222158, currentTotal: 226692, dpcStatus: "gray" },
  { id: 2, age: 36, sex: "M", relationship: "Self", diagnosis: "Hypertension", medicalPaid: 199529, rxPaid: 2809, priorYearTotal: 204361, currentTotal: 202338, dpcStatus: "gray" },
  { id: 3, age: 14, sex: "M", relationship: "Child", diagnosis: "None identified", medicalPaid: 188882, rxPaid: 480, priorYearTotal: 195002, currentTotal: 189322, dpcStatus: "red" },
  { id: 4, age: 38, sex: "F", relationship: "Spouse", diagnosis: "None identified", medicalPaid: 183507, rxPaid: 898, priorYearTotal: 156744, currentTotal: 184405, dpcStatus: "green" },
  { id: 5, age: 10, sex: "F", relationship: "Child", diagnosis: "None identified", medicalPaid: 179465, rxPaid: 236, priorYearTotal: 204859, currentTotal: 179701, dpcStatus: "gray" },
  { id: 6, age: 58, sex: "M", relationship: "Self", diagnosis: "Hypertension", medicalPaid: 161017, rxPaid: 546, priorYearTotal: 150254, currentTotal: 161563, dpcStatus: "red" },
  { id: 7, age: 55, sex: "M", relationship: "Self", diagnosis: "Coronary Artery Disease", medicalPaid: 159836, rxPaid: 584, priorYearTotal: 150795, currentTotal: 160420, dpcStatus: "gray" },
  { id: 8, age: 6, sex: "M", relationship: "Child", diagnosis: "None identified", medicalPaid: 156311, rxPaid: 459, priorYearTotal: 158905, currentTotal: 156770, dpcStatus: "green" },
  { id: 9, age: 42, sex: "F", relationship: "Spouse", diagnosis: "Rheumatoid Arthritis", medicalPaid: 110250, rxPaid: 35400, priorYearTotal: 138000, currentTotal: 145650, dpcStatus: "green" },
  { id: 10, age: 50, sex: "M", relationship: "Self", diagnosis: "Type 2 Diabetes", medicalPaid: 122400, rxPaid: 8900, priorYearTotal: 120500, currentTotal: 131300, dpcStatus: "red" },
  { id: 11, age: 29, sex: "F", relationship: "Self", diagnosis: "Asthma & COPD", medicalPaid: 98150, rxPaid: 14200, priorYearTotal: 108400, currentTotal: 112350, dpcStatus: "green" }
];

// Helper to format currency values
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(val);
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export function EmployerHighCostPage() {
  const [claimants, setClaimants] = useState<ClaimantRow[]>(CLAIMANT_ROWS);

  const columns: Column<ClaimantRow>[] = [
    {
      header: "#",
      key: "id",
      cell: (row) => (
        <span className="flex items-center justify-center size-5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-bold">
          {row.id}
        </span>
      ),
    },
    {
      header: "Age",
      key: "age",
      sortable: true,
      cell: (row) => <span className="font-semibold text-foreground">{row.age}</span>,
    },
    {
      header: "Sex",
      key: "sex",
      cell: (row) => (
        <Badge
          variant="outline"
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            row.sex === "F"
              ? "border-pink-200 text-pink-700 bg-pink-50/55 dark:bg-pink-950/20 dark:border-pink-900/60 dark:text-pink-300"
              : "border-blue-200 text-blue-700 bg-blue-50/55 dark:bg-blue-950/20 dark:border-blue-900/60 dark:text-blue-300"
          }`}
        >
          {row.sex}
        </Badge>
      ),
    },
    {
      header: "Relationship",
      key: "relationship",
      sortable: true,
      cell: (row) => <span className="font-semibold text-foreground">{row.relationship}</span>,
    },
    {
      header: "Diagnosis Category",
      key: "diagnosis",
      sortable: true,
      cell: (row) => <span className="font-bold text-foreground">{row.diagnosis}</span>,
    },
    {
      header: "Medical Paid",
      key: "medicalPaid",
      align: "right",
      sortable: true,
      cell: (row) => <span className="font-mono font-semibold text-foreground">{formatCurrency(row.medicalPaid)}</span>,
    },
    {
      header: "Rx Paid",
      key: "rxPaid",
      align: "right",
      sortable: true,
      cell: (row) => <span className="font-mono font-semibold text-foreground">{formatCurrency(row.rxPaid)}</span>,
    },
    {
      header: "Prior Year Total",
      key: "priorYearTotal",
      align: "right",
      sortable: true,
      cell: (row) => <span className="font-mono text-muted-foreground">{formatCurrency(row.priorYearTotal)}</span>,
    },
    {
      header: "Current Total",
      key: "currentTotal",
      align: "right",
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-foreground">{formatCurrency(row.currentTotal)}</span>,
    },
    {
      header: "DPC Status",
      key: "dpcStatus",
      cell: (row) => {
        let dotColor = "bg-slate-300 dark:bg-slate-700";
        let label = "Not Enrolled";
        if (row.dpcStatus === "red") {
          dotColor = "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
          label = "Critical Gap / Outreach";
        } else if (row.dpcStatus === "green") {
          dotColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
          label = "Engaged / Managed";
        }
        return (
          <div className="flex items-center gap-2" title={label}>
            <span className={`size-2 rounded-full ${dotColor}`} />
          </div>
        );
      },
    },
  ];

  return (
    <Page
      title="High-Cost Claimants"
      subtitle="Members exceeding cost thresholds and utilization patterns"
      chips={employerChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* ----------------------------------------------------------------------
          1. TOP ROW: 3 KPI CARDS (HCC Count, Total HCC Paid, Stop-Loss Reimbursement)
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={ShieldAlert}
            title="HCC Count"
            value="11"
            caption="$100K Attachment Point"
            info="Number of distinct members whose claims have exceeded the standard $100,000 threshold."
          />
          <KpiCard
            icon={AlertTriangle}
            title="Total HCC Paid"
            value="$1.9M"
            caption="YTD spend for HCC members"
            info="Cumulative health plan spend attributed directly to the high-cost claimant group."
          />
          <KpiCard
            icon={TrendingUp}
            title="Stop-Loss Reimbursement"
            value="$775K"
            caption="Estimated exposure"
            info="Expected reimbursement claim amount from the stop-loss insurer."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. SECOND ROW: STOP-LOSS THRESHOLD TRACKER & POTENTIAL HCC DISTRIBUTION
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6 stagger-section">
        {/* Card A: Stop-Loss Threshold Tracker */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Stop-Loss Threshold Tracker</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Progress toward attachment point</p>
            </div>

            {/* Gray Attachment Point Display */}
            <div className="bg-muted/40 dark:bg-muted/10 border border-border/40 p-4 rounded-xl text-center mb-6">
              <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Attachment Point</div>
              <div className="text-3xl font-black text-foreground mt-1">$100K</div>
            </div>

            {/* Custom Progress Bars */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-foreground mb-1.5">
                  <span>Members Exceeded</span>
                  <span className="text-rose-600">11</span>
                </div>
                <div className="h-2.5 w-full bg-muted/60 dark:bg-muted/20 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-foreground mb-1.5">
                  <span>Members Approaching (90%+)</span>
                  <span className="text-muted-foreground font-mono">0</span>
                </div>
                <div className="h-2.5 w-full bg-muted/60 dark:bg-muted/20 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full w-[0%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Pink Alert Box */}
          <div className="mt-6 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3.5 flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <TrendingDown className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Stop-loss proximity</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed font-medium">
                3 members are within $18,000 of your $125,000 stop-loss attachment point. Combined YTD: $342,000.
              </p>
            </div>
          </div>
        </Card>

        {/* Card B: Potential HCC Distribution */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Potential HCC Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Proximity to stop-loss attachment</p>
            </div>

            <div className="h-[188px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={POTENTIAL_HCC_DIST} margin={{ top: 5, right: 15, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} opacity={0.6} />
                  <XAxis type="number" domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fontWeight: 600 }} />
                  <RechartsTooltip
                    formatter={(val: number) => [`${val} Members`, "Count"]}
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={10}>
                    {POTENTIAL_HCC_DIST.map((entry, idx) => (
                      <Cell key={`pot-bar-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pink Alert Box */}
          <div className="mt-6 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3.5 flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <Info className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Potential HCC growth</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed font-medium">
                5 members at 50-75% of threshold, up from 2 last quarter. Trending toward high-cost status.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ----------------------------------------------------------------------
          3. THIRD ROW: HCC BY RELATIONSHIP
          ---------------------------------------------------------------------- */}
      <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs mb-6 stagger-section">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">HCC by Relationship</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Spend distribution</p>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={RELATIONSHIP_SPEND_DATA} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} opacity={0.6} />
              <XAxis
                type="number"
                domain={[0, 1200000]}
                ticks={[0, 300000, 600000, 900000, 1200000]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val === 0) return "$0";
                  return `$${(val / 1000).toFixed(0)}K`;
                }}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--foreground)", fontWeight: 700 }} />
              <RechartsTooltip
                formatter={(val: number) => [formatCurrency(val), "Paid Spend"]}
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
              />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]} barSize={15}>
                {RELATIONSHIP_SPEND_DATA.map((entry, idx) => (
                  <Cell key={`rel-bar-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ----------------------------------------------------------------------
          4. FOURTH ROW: HIGH-COST CLAIMANT DETAIL TABLE
          ---------------------------------------------------------------------- */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-2xs mb-6 overflow-hidden stagger-section">
        {/* Header Bar */}
        <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
          <div>
            <h3 className="text-sm font-bold text-foreground">High-Cost Claimant Detail</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Click a row to view monthly cost timeline</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg shadow-2xs gap-1.5 self-start sm:self-auto font-semibold text-xs">
            <Download className="size-3.5" />
            <span>Export Table</span>
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          rows={claimants}
          rowKey={(r) => r.id}
          attached={true}
        />
      </Card>
    </Page>
  );
}
