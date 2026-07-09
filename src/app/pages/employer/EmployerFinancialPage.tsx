import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Link as LinkIcon,
  User,
  Users,
  Smile,
  Download,
  Sparkles,
  ArrowUpDown,
  CheckCircle2
} from "lucide-react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase font-semibold">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

// ----------------------------------------------------------------------
// DATA FOR CHARTS & TABLES
// ----------------------------------------------------------------------

// 1. Monthly Spend Data (Medical vs Pharmacy)
const MONTHLY_SPEND_DATA = [
  { month: "Jan", medical: 208468, pharmacy: 43984 },
  { month: "Feb", medical: 250412, pharmacy: 49124 },
  { month: "Mar", medical: 199620, pharmacy: 43825 },
  { month: "Apr", medical: 179788, pharmacy: 42978 },
  { month: "May", medical: 149796, pharmacy: 47495 },
  { month: "Jun", medical: 160759, pharmacy: 45541 },
  { month: "Jul", medical: 235051, pharmacy: 44789 },
  { month: "Aug", medical: 200196, pharmacy: 44130 },
  { month: "Sep", medical: 148116, pharmacy: 45111 },
  { month: "Oct", medical: 183013, pharmacy: 46597 },
  { month: "Nov", medical: 238631, pharmacy: 45114 },
  { month: "Dec", medical: 156740, pharmacy: 46475 },
];

// 2. PMPM & PEPM History Data
const PMPM_PEPM_HISTORY_DATA = [
  { month: "Jan", pmpm: 517, pepm: 1014 },
  { month: "Feb", pmpm: 618, pepm: 1208 },
  { month: "Mar", pmpm: 498, pepm: 974 },
  { month: "Apr", pmpm: 456, pepm: 895 },
  { month: "May", pmpm: 406, pepm: 792 },
  { month: "Jun", pmpm: 423, pepm: 829 },
  { month: "Jul", pmpm: 584, pepm: 1147 },
  { month: "Aug", pmpm: 507, pepm: 997 },
  { month: "Sep", pmpm: 399, pepm: 776 },
  { month: "Oct", pmpm: 471, pepm: 922 },
  { month: "Nov", pmpm: 580, pepm: 1135 },
  { month: "Dec", pmpm: 416, pepm: 813 },
];

// 3. Cost Distribution Pie Data
const COST_DISTRIBUTION_PIE = [
  { name: "Medical", value: 2310753, label: "$2.3M", color: "#e32168" },
  { name: "Pharmacy", value: 545000, label: "$545K", color: "#65a30d" },
];

// 4. Cost Share Pie Data
const COST_SHARE_PIE = [
  { name: "Employer Share", value: 2855753, label: "$2.9M", color: "#e32168" },
  { name: "Employee Share", value: 338000, label: "$338K", color: "#0d9488" },
];

// 5. Monthly Financial Trend Table Rows
const FINANCIAL_TABLE_ROWS = [
  { month: "Jan 2024", medicalPaid: "$208,468", rxPaid: "$43,984", totalPaid: "$252,452", memberMonths: 488, subMonths: 249, pmpm: "$517.00", pepm: "$1,014.00" },
  { month: "Feb 2024", medicalPaid: "$250,412", rxPaid: "$49,124", totalPaid: "$299,536", memberMonths: 485, subMonths: 248, pmpm: "$618.00", pepm: "$1,208.00" },
  { month: "Mar 2024", medicalPaid: "$199,620", rxPaid: "$43,825", totalPaid: "$243,445", memberMonths: 489, subMonths: 250, pmpm: "$498.00", pepm: "$974.00" },
  { month: "Apr 2024", medicalPaid: "$179,788", rxPaid: "$42,978", totalPaid: "$222,766", memberMonths: 488, subMonths: 249, pmpm: "$456.00", pepm: "$895.00" },
  { month: "May 2024", medicalPaid: "$149,796", rxPaid: "$47,495", totalPaid: "$197,291", memberMonths: 486, subMonths: 249, pmpm: "$406.00", pepm: "$792.00" },
  { month: "Jun 2024", medicalPaid: "$160,759", rxPaid: "$45,541", totalPaid: "$206,300", memberMonths: 488, subMonths: 249, pmpm: "$423.00", pepm: "$829.00" },
  { month: "Jul 2024", medicalPaid: "$235,051", rxPaid: "$44,789", totalPaid: "$279,840", memberMonths: 479, subMonths: 244, pmpm: "$584.00", pepm: "$1,147.00" },
  { month: "Aug 2024", medicalPaid: "$200,196", rxPaid: "$44,130", totalPaid: "$244,326", memberMonths: 482, subMonths: 245, pmpm: "$507.00", pepm: "$997.00" },
  { month: "Sep 2024", medicalPaid: "$148,116", rxPaid: "$45,111", totalPaid: "$193,227", memberMonths: 484, subMonths: 249, pmpm: "$399.00", pepm: "$776.00" },
  { month: "Oct 2024", medicalPaid: "$183,013", rxPaid: "$46,597", totalPaid: "$229,610", memberMonths: 487, subMonths: 249, pmpm: "$471.00", pepm: "$922.00" },
  { month: "Nov 2024", medicalPaid: "$238,631", rxPaid: "$45,114", totalPaid: "$283,745", memberMonths: 489, subMonths: 250, pmpm: "$580.00", pepm: "$1,135.00" },
  { month: "Dec 2024", medicalPaid: "$156,740", rxPaid: "$46,475", totalPaid: "$203,215", memberMonths: 489, subMonths: 250, pmpm: "$416.00", pepm: "$813.00" },
];

const financialColumns: Column<typeof FINANCIAL_TABLE_ROWS[number]>[] = [
  {
    key: "month",
    header: "Month",
    cell: (r) => <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">{r.month}</span>,
  },
  {
    key: "medicalPaid",
    header: "Medical Paid",
    align: "right",
    cell: (r) => <span className="font-mono font-bold text-foreground">{r.medicalPaid}</span>,
  },
  {
    key: "rxPaid",
    header: "Rx Paid",
    align: "right",
    cell: (r) => <span className="font-mono font-semibold text-muted-foreground">{r.rxPaid}</span>,
  },
  {
    key: "totalPaid",
    header: "Total Paid",
    align: "right",
    cell: (r) => <span className="font-mono font-bold text-primary">{r.totalPaid}</span>,
  },
  {
    key: "memberMonths",
    header: "Member Months",
    align: "right",
    cell: (r) => <span className="font-mono font-semibold text-foreground">{r.memberMonths}</span>,
  },
  {
    key: "subMonths",
    header: "Sub Months",
    align: "right",
    cell: (r) => <span className="font-mono font-semibold text-muted-foreground">{r.subMonths}</span>,
  },
  {
    key: "pmpm",
    header: "PMPM",
    align: "right",
    cell: (r) => <span className="font-mono font-bold text-foreground">{r.pmpm}</span>,
  },
  {
    key: "pepm",
    header: "PEPM",
    align: "right",
    cell: (r) => <span className="font-mono font-bold text-foreground">{r.pepm}</span>,
  },
];

export function EmployerFinancialPage() {
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  return (
    <Page
      title="Financial Performance"
      subtitle="Healthcare spend, PMPM/PEPM metrics, and cost trend analysis"
      chips={employerChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* ----------------------------------------------------------------------
          1. FIRST KPI ROW: 6 PRIMARY FINANCIAL METRICS (input_file_0.png)
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <KpiCard
            icon={DollarSign}
            title="Gross Claims Total"
            value="$2.9M"
            caption="$2,855,753"
            info="Total cumulative health claims spend across medical and pharmacy."
          />

          <KpiCard
            icon={TrendingUp}
            title="Medical Paid"
            value="$2.3M"
            caption="80.9% of total"
            info="Total paid amount reconciled for medical claims."
          />

          <KpiCard
            icon={LinkIcon}
            title="Pharmacy Paid"
            value="$545K"
            caption="19.1% of total"
            info="Total paid amount reconciled for pharmacy prescriptions."
          />

          <KpiCard
            icon={Activity}
            title="Paid-to-Allowed Ratio"
            value="0.89"
            caption="total paid / total allowed"
            info="Ratio of total paid claims to total allowed amount."
          />

          <KpiCard
            icon={TrendingDown}
            title="Total PMPM"
            value="$489.50"
            caption="No prior year data"
            info="Average Per Member Per Month cost across enrolled active members."
          />

          <KpiCard
            icon={TrendingUp}
            title="Total PEPM"
            value="$957.98"
            caption="No prior year data"
            info="Average Per Employee Per Month cost across enrolled primary subscribers."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. SECOND KPI ROW: PMPM BY RELATIONSHIP (input_file_0.png)
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <SectionLabel>PMPM by Relationship</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={User}
            title="Self"
            value="$519.97"
            caption="Primary subscriber"
            info="Average Per Member Per Month spend across primary subscriber contracts."
          />

          <KpiCard
            icon={Users}
            title="Spouse"
            value="$395.94"
            caption="Spouse/Partner"
            info="Average Per Member Per Month spend across enrolled spouses and partners."
          />

          <KpiCard
            icon={Smile}
            title="Child"
            value="$537.61"
            caption="Dependent children"
            info="Average Per Member Per Month spend across enrolled dependent children."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. THIRD ROW: TWO DONUT CHARTS (COST DISTRIBUTION & COST SHARE)
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Card A: Cost Distribution (Medical vs Pharmacy) */}
          <Card className="p-6 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-foreground">Cost Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Medical vs Pharmacy</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-auto h-[210px]">
              {/* Legend Side */}
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#e32168] shrink-0 shadow-2xs" />
                  <span className="text-xs font-bold text-foreground">Medical - $2.3M</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#65a30d] shrink-0 shadow-2xs" />
                  <span className="text-xs font-bold text-foreground">Pharmacy - $545K</span>
                </div>
              </div>

              {/* Pie Chart Side */}
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COST_DISTRIBUTION_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {COST_DISTRIBUTION_PIE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => `$${val.toLocaleString()}`}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Card B: Cost Share (Employer vs Employee) */}
          <Card className="p-6 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-foreground">Cost Share</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-auto h-[210px]">
              {/* Legend Side */}
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#e32168] shrink-0 shadow-2xs" />
                  <span className="text-xs font-bold text-foreground">Employer Share - $2.9M</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#0d9488] shrink-0 shadow-2xs" />
                  <span className="text-xs font-bold text-foreground">Employee Share - $338K</span>
                </div>
              </div>

              {/* Pie Chart Side */}
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COST_SHARE_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {COST_SHARE_PIE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => `$${val.toLocaleString()}`}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. FOURTH ROW: TWO RECHARTS (MONTHLY SPEND & PMPM/PEPM HISTORY) (input_file_1.png)
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6 stagger-section">
        {/* Card A: Monthly Healthcare Spend (Stacked Bar Chart) */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Monthly Healthcare Spend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Medical vs Pharmacy breakdown</p>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_SPEND_DATA} barGap={2} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis
                    tickFormatter={(val: number) => `$${val / 1000}K`}
                    domain={[0, 300000]}
                    ticks={[0, 75000, 150000, 225000, 300000]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <RechartsTooltip
                    formatter={(val: number) => `$${val.toLocaleString()}`}
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="medical" name="Medical" stackId="spend" fill="#e32168" radius={[0, 0, 0, 0]} barSize={15} />
                  <Bar dataKey="pharmacy" name="Pharmacy" stackId="spend" fill="#65a30d" radius={[3, 3, 0, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-2.5 border-t border-border/50 text-xs font-bold text-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#e32168]" />
              <span>Medical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#65a30d]" />
              <span>Pharmacy</span>
            </div>
          </div>

          {/* Pink Alert Banner inside Spend Card */}
          <div className="mt-3.5 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3 flex items-start sm:items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Budget overrun</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
                YTD spend is <span className="font-semibold">$3.1M (12.4% over pro-rated budget through May)</span>. Primary driver: specialty pharmacy spend up 23% vs. same period last year.
              </p>
            </div>
          </div>
        </Card>

        {/* Card B: PMPM/PEPM History (Dual Line Chart) */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">PMPM/PEPM History</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Per member and per subscriber monthly cost</p>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PMPM_PEPM_HISTORY_DATA} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis
                    tickFormatter={(val: number) => `$${val}`}
                    domain={[250, 1250]}
                    ticks={[250, 500, 750, 1000, 1250]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <RechartsTooltip
                    formatter={(val: number) => `$${val.toLocaleString()}`}
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pmpm"
                    name="PMPM"
                    stroke="#e32168"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#e32168" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pepm"
                    name="PEPM"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 3.5, fill: "#f59e0b" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-2.5 border-t border-border/50 text-xs font-bold text-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#e32168]" />
              <span>PMPM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#f59e0b]" />
              <span>PEPM</span>
            </div>
          </div>

          {/* Pink Alert Banner inside PMPM/PEPM Card */}
          <div className="mt-3.5 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3 flex items-start sm:items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">PEPM consecutive increase</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
                PEPM has increased for <span className="font-semibold">4 consecutive months</span>. Current: $1,027.12. Same month last year: $943.86. Change: +8.8%.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ----------------------------------------------------------------------
          5. FIFTH ROW: FULL-WIDTH TABLE: MONTHLY FINANCIAL TREND (input_file_2.png)
          ---------------------------------------------------------------------- */}
      <section className="stagger-section mb-6">
        <Card className="rounded-2xl border border-border/60 bg-card shadow-2xs overflow-hidden">
          {/* Table Header Bar */}
          <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
            <div>
              <h3 className="text-sm font-bold text-foreground">Monthly Financial Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Detailed monthly spend and utilization metrics</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg shadow-2xs gap-1.5 self-start sm:self-auto font-semibold text-xs">
              <Download className="size-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>

          {/* Table */}
          <DataTable
            columns={financialColumns}
            rows={FINANCIAL_TABLE_ROWS}
            rowKey={(r) => r.month}
            attached={true}
          />
        </Card>
      </section>
    </Page>
  );
}
