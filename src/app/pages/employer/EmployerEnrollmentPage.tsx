import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Sparkles,
  Download,
  MapPin,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowUpDown
} from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { employerChips } from "../../data/filters";
import { InteractiveUSMap } from "../../components/dashboard/InteractiveUSMap";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell
} from "recharts";

// ----------------------------------------------------------------------
// DATA FOR CHARTS & TABLES
// ----------------------------------------------------------------------

// 1. Monthly Enrollment Trend Data (12 Months)
const ENROLLMENT_TREND_DATA = [
  { month: "Jan", members: 488, subscribers: 249 },
  { month: "Feb", members: 485, subscribers: 248 },
  { month: "Mar", members: 489, subscribers: 250 },
  { month: "Apr", members: 488, subscribers: 249 },
  { month: "May", members: 486, subscribers: 249 },
  { month: "Jun", members: 488, subscribers: 249 },
  { month: "Jul", members: 479, subscribers: 244 },
  { month: "Aug", members: 482, subscribers: 245 },
  { month: "Sep", members: 484, subscribers: 249 },
  { month: "Oct", members: 487, subscribers: 249 },
  { month: "Nov", members: 489, subscribers: 250 },
  { month: "Dec", members: 489, subscribers: 250 },
];

// 2. Monthly Joins vs Leaves Data
const JOINS_LEAVES_DATA = [
  { month: "Jan", joins: 9, leaves: 7 },
  { month: "Feb", joins: 0, leaves: 5 },
  { month: "Mar", joins: 10, leaves: 0 },
  { month: "Apr", joins: 3, leaves: 3 },
  { month: "May", joins: 5, leaves: 2 },
  { month: "Jun", joins: 2, leaves: 2 },
  { month: "Jul", joins: 0, leaves: 9 },
  { month: "Aug", joins: 7, leaves: 0 },
  { month: "Sep", joins: 8, leaves: 0 },
  { month: "Oct", joins: 7, leaves: 0 },
  { month: "Nov", joins: 7, leaves: 0 },
  { month: "Dec", joins: 7, leaves: 2 },
];

// 3. Gender Distribution Data
const GENDER_DATA = [
  { gender: "Male", count: 245, color: "#e32168" },
  { gender: "Female", count: 244, color: "#65a30d" },
];

// 4. Age Group Distribution Data
const AGE_DISTRIBUTION_DATA = [
  { ageGroup: "0-17", self: 0, spouse: 0, child: 85 },
  { ageGroup: "18-25", self: 5, spouse: 0, child: 20 },
  { ageGroup: "26-34", self: 63, spouse: 28, child: 0 },
  { ageGroup: "35-44", self: 52, spouse: 33, child: 0 },
  { ageGroup: "45-54", self: 66, spouse: 32, child: 0 },
  { ageGroup: "55-64", self: 66, spouse: 20, child: 0 },
  { ageGroup: "65+", self: 0, spouse: 14, child: 0 },
];

// 5. Geographic Distribution State Data
const STATE_DISTRIBUTION_DATA = [
  { state: "Texas (TX)", count: 145, pct: "29.6%", color: "#e32168" },
  { state: "Illinois (IL)", count: 110, pct: "22.5%", color: "#ec4899" },
  { state: "Florida (FL)", count: 88, pct: "18.0%", color: "#f43f5e" },
  { state: "California (CA)", count: 56, pct: "11.5%", color: "#fb7185" },
  { state: "New York (NY)", count: 42, pct: "8.6%", color: "#fda4af" },
  { state: "North Carolina (NC)", count: 28, pct: "5.7%", color: "#fecdd3" },
  { state: "Georgia (GA)", count: 20, pct: "4.1%", color: "#ffe4e6" },
];

// 6. Table Summary Data
const SUMMARY_TABLE_ROWS = [
  { month: "Jan 2024", totalMembers: 488, subscribers: 249, dependents: 239, ratio: 0.96 },
  { month: "Feb 2024", totalMembers: 485, subscribers: 248, dependents: 237, ratio: 0.96 },
  { month: "Mar 2024", totalMembers: 489, subscribers: 250, dependents: 239, ratio: 0.96 },
  { month: "Apr 2024", totalMembers: 488, subscribers: 249, dependents: 239, ratio: 0.96 },
  { month: "May 2024", totalMembers: 486, subscribers: 249, dependents: 237, ratio: 0.95 },
  { month: "Jun 2024", totalMembers: 488, subscribers: 249, dependents: 239, ratio: 0.96 },
  { month: "Jul 2024", totalMembers: 479, subscribers: 244, dependents: 235, ratio: 0.96 },
  { month: "Aug 2024", totalMembers: 482, subscribers: 245, dependents: 237, ratio: 0.97 },
  { month: "Sep 2024", totalMembers: 484, subscribers: 249, dependents: 235, ratio: 0.94 },
  { month: "Oct 2024", totalMembers: 487, subscribers: 249, dependents: 238, ratio: 0.96 },
  { month: "Nov 2024", totalMembers: 489, subscribers: 250, dependents: 239, ratio: 0.96 },
  { month: "Dec 2024", totalMembers: 489, subscribers: 250, dependents: 239, ratio: 0.96 },
];

const summaryColumns: Column<typeof SUMMARY_TABLE_ROWS[number]>[] = [
  {
    key: "month",
    header: "Month",
    cell: (r) => <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">{r.month}</span>,
  },
  {
    key: "totalMembers",
    header: "Total Members",
    align: "right",
    cell: (r) => <span className="font-mono font-bold text-foreground">{r.totalMembers}</span>,
  },
  {
    key: "subscribers",
    header: "Subscribers",
    align: "right",
    cell: (r) => <span className="font-mono font-semibold text-muted-foreground">{r.subscribers}</span>,
  },
  {
    key: "dependents",
    header: "Dependents",
    align: "right",
    cell: (r) => <span className="font-mono font-semibold text-muted-foreground">{r.dependents}</span>,
  },
  {
    key: "ratio",
    header: "Dependent Ratio",
    align: "right",
    cell: (r) => <span className="font-mono font-bold text-foreground">{r.ratio.toFixed(2)}</span>,
  },
];

export function EmployerEnrollmentPage() {
  return (
    <Page
      title="Enrollment"
      subtitle="Member and subscriber counts, demographics, and enrollment trends"
      chips={employerChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* ----------------------------------------------------------------------
          1. TOP KPI SUMMARY CARDS ROW (4 CARDS)
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 stagger-section">
        <KpiCard
          icon={Users}
          title="Avg Monthly Members"
          value="486"
          caption="members per month"
          info="Average active member count enrolled per month across the 2024 plan year."
        />

        <KpiCard
          icon={UserCheck}
          title="Avg Monthly Subscribers"
          value="248"
          caption="employees per month"
          info="Average active primary employee subscriber count per month across the 2024 plan year."
        />

        <KpiCard
          icon={Users}
          title="Dependent Ratio"
          value="0.96"
          caption="dependents per employee"
          info="Average ratio of enrolled dependents per active employee subscriber."
        />

        <KpiCard
          icon={CheckCircle2}
          title="Active Members"
          value="489"
          caption="enrolled in period"
          info="Total active members currently enrolled as of December 2024."
        />
      </div>

      {/* ----------------------------------------------------------------------
          2. FULL-WIDTH CHART: MONTHLY ENROLLMENT TREND
          ---------------------------------------------------------------------- */}
      <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs mb-6 stagger-section">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Monthly Enrollment Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Members and subscribers over time</p>
        </div>

        {/* Line Chart with CartesianGrid */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ENROLLMENT_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[210, 490]} ticks={[210, 280, 350, 420, 490]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="members"
                name="Members"
                stroke="#e32168"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#e32168" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="subscribers"
                name="Subscribers"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#22c55e" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-3 pt-2.5 border-t border-border/50 text-xs font-bold text-foreground">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#e32168]" />
            <span>Members</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#22c55e]" />
            <span>Subscribers</span>
          </div>
        </div>

        {/* Pink Alert Banner Inside Chart Card */}
        <div className="mt-3.5 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3 flex items-start sm:items-center gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Enrollment spike</h4>
            <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
              Enrollment increased <span className="font-semibold">7.3% in March</span> — 34 new members added.
            </p>
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------------------
          3. 2x2 GRID OF DEMOGRAPHIC CHARTS & MAPS
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6 stagger-section">
        {/* Card A: Monthly Joins vs Leaves */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Monthly Joins vs Leaves</h3>
              <p className="text-xs text-muted-foreground mt-0.5">New enrollments and terminations</p>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={JOINS_LEAVES_DATA} barGap={3} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="joins" name="Joins" fill="#22c55e" radius={[3, 3, 0, 0]} barSize={9} />
                  <Bar dataKey="leaves" name="Leaves" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-2.5 border-t border-border/50 text-xs font-bold text-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#22c55e]" />
              <span>Joins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#ef4444]" />
              <span>Leaves</span>
            </div>
          </div>
        </Card>

        {/* Card B: Gender Distribution */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Gender Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Active population breakdown by gender</p>
            </div>

            <div className="h-[220px] w-full flex flex-col justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={GENDER_DATA}
                  margin={{ top: 15, right: 30, left: 15, bottom: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} opacity={0.6} />
                  <XAxis type="number" domain={[0, 260]} ticks={[0, 65, 130, 195, 260]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis type="category" dataKey="gender" tickLine={false} axisLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: "var(--foreground)" }} />
                  <RechartsTooltip
                    formatter={(val: number) => `${val} Members`}
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={26}>
                    {GENDER_DATA.map((entry, idx) => (
                      <Cell key={`gender-cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Male: <strong className="text-foreground">245 (50.1%)</strong></span>
            <span>Female: <strong className="text-foreground">244 (49.9%)</strong></span>
          </div>
        </Card>

        {/* Card C: Age Group Distribution */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Age Group Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Demographic breakdown across age bands</p>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AGE_DISTRIBUTION_DATA} barGap={1} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="ageGroup" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="self" name="Self" fill="#e32168" radius={[2, 2, 0, 0]} barSize={8} />
                  <Bar dataKey="spouse" name="Spouse" fill="#65a30d" radius={[2, 2, 0, 0]} barSize={8} />
                  <Bar dataKey="child" name="Child" fill="#0d9488" radius={[2, 2, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-5 mt-2.5 pt-2 text-xs font-bold text-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#e32168]" />
                <span>Self</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#65a30d]" />
                <span>Spouse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#0d9488]" />
                <span>Child</span>
              </div>
            </div>
          </div>

          {/* Pink Alert Box inside Age Card */}
          <div className="mt-3.5 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3 flex items-start sm:items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Age skew</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
                Your 55+ population grew <span className="font-semibold">14% YoY</span> — 18 new members in this age band.
              </p>
            </div>
          </div>
        </Card>

        {/* Card D: Member Distribution (Geographic distribution) */}
        <Card className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Member Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Interactive 50-state DPC density map — hover or click any state for regional hub report</p>
            </div>

            {/* Interactive US Map */}
            <div className="my-auto">
              <InteractiveUSMap />
            </div>
          </div>

          {/* Pink Alert Box inside Map Card */}
          <div className="mt-3.5 rounded-lg border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-3 flex items-start sm:items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">Geographic distribution</h4>
              <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-relaxed">
                Your members are distributed across <span className="font-semibold">7 states</span>. No single state accounts for more than 32%.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ----------------------------------------------------------------------
          4. FULL-WIDTH TABLE: PLAN YEAR ENROLLMENT SUMMARY
          ---------------------------------------------------------------------- */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-2xs mb-6 overflow-hidden stagger-section">
        {/* Header Bar */}
        <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
          <div>
            <h3 className="text-sm font-bold text-foreground">Plan Year Enrollment Summary</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Month-by-month enrollment breakdown</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg shadow-2xs gap-1.5 self-start sm:self-auto font-semibold text-xs">
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={summaryColumns}
          rows={SUMMARY_TABLE_ROWS}
          rowKey={(r) => r.month}
          attached={true}
        />
      </Card>
    </Page>
  );
}

