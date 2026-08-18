import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  AlertTriangle,
  BarChart2,
  Download,
  Building2,
  ShieldAlert,
  BadgeDollarSign,
  HeartPulse,
  LineChart
} from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { employerChips } from "../../data/filters";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// Data for Monthly Enrollment Trend
const ENROLLMENT_TREND_DATA = [
  { month: "Jan", members: 485, subscribers: 248 },
  { month: "Feb", members: 486, subscribers: 249 },
  { month: "Mar", members: 488, subscribers: 250 },
  { month: "Apr", members: 490, subscribers: 251 },
  { month: "May", members: 489, subscribers: 250 },
  { month: "Jun", members: 488, subscribers: 250 },
  { month: "Jul", members: 487, subscribers: 249 },
  { month: "Aug", members: 489, subscribers: 250 },
  { month: "Sep", members: 490, subscribers: 251 },
  { month: "Oct", members: 489, subscribers: 250 },
  { month: "Nov", members: 489, subscribers: 250 },
  { month: "Dec", members: 489, subscribers: 250 },
];

// Data for Cost Distribution Donut
const COST_DISTRIBUTION_DATA = [
  { name: "Medical", value: 2300000, color: "#ec4899", formatted: "$2.3M" },
  { name: "Pharmacy", value: 545000, color: "#22c55e", formatted: "$545K" },
];

// Data for Top Chronic Conditions Donut
const CHRONIC_CONDITIONS_DATA = [
  { name: "Hypertension", count: 98, color: "#ec4899" },
  { name: "Hyperlipidemia", count: 70, color: "#22c55e" },
  { name: "Musculoskeletal", count: 68, color: "#06b6d4" },
  { name: "Depression & Anxiety", count: 61, color: "#f59e0b" },
  { name: "Type 2 Diabetes", count: 45, color: "#f97316" },
  { name: "Asthma", count: 35, color: "#84cc16" },
];

// Data for Potential HCC Distribution Bar Chart
const HCC_DISTRIBUTION_DATA = [
  { tier: "Low (25-50%)", count: 4.5, color: "#475569" },
  { tier: "Moderate (50-75%)", count: 1.2, color: "#22c55e" },
  { tier: "Elevated (75-90%)", count: 0.2, color: "#06b6d4" },
  { tier: "Approaching (90-100%)", count: 0.1, color: "#f59e0b" },
  { tier: "Exceeded (>100%)", count: 11.5, color: "#ef4444" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase font-semibold">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

export default function EmployerOverview() {
  const navigate = useNavigate();

  return (
    <Page
      title="Employer Analytics Overview"
      subtitle="Jan – Dec 2024 • Acme Corporation (Active Manifest)"
      chips={employerChips}
      showFilters={true}
      showIconActions={true}
    >
      {/* Row 1: Enrollment Drift Alert Banner */}
      <section className="stagger-section mb-6">
        <div className="flex items-start sm:items-center gap-3.5 rounded-2xl border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 p-4 text-sm shadow-2xs transition-all hover:border-rose-300">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 shadow-2xs">
            <TrendingDown className="size-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-rose-950 dark:text-rose-200 text-sm">Enrollment drift</h4>
            <p className="text-xs sm:text-sm text-rose-800/90 dark:text-rose-300/90 leading-relaxed mt-0.5">
              Dependent ratio increased <span className="font-semibold underline">6.2%</span> this quarter — 14 new dependents added in March.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-rose-700 hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-900/40 hidden md:flex shrink-0 font-semibold"
            onClick={() => navigate("/employer/enrollment")}
          >
            View Roster
          </Button>
        </div>
      </section>

      {/* Row 2: 5 Domain Summary KPI Cards */}
      <section className="stagger-section mb-6">
        <SectionLabel>Key Performance Domains & Metrics</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            icon={Users}
            title="Enrollment"
            subs={[
              { value: "489", label: "Active Members" },
              { value: "250", label: "Subscribers" },
              { value: "0.96", label: "Dependent Ratio" },
            ]}
            info="Detailed enrollment breakdown of active members, subscribers, and dependent ratio across Acme Corporation."
            onClick={() => navigate("/employer/enrollment")}
          />

          <KpiCard
            icon={BadgeDollarSign}
            title="Financial Performance"
            subs={[
              { value: "$2.9M", label: "Total Spend" },
              { value: "$489.50", label: "Total PMPM" },
              { value: "$957.98", label: "Total PEPM" },
            ]}
            info="Total health plan spend, Per Member Per Month (PMPM), and Per Employee Per Month (PEPM) financial analysis."
            onClick={() => navigate("/employer/financial")}
          />

          <KpiCard
            icon={HeartPulse}
            title="Chronic Conditions"
            subs={[
              { value: "263", label: "Members w/ Condition" },
              { value: "53.8%", label: "Chronic Burden" },
              { value: "127", label: "Multi-Condition" },
            ]}
            info="Population health burden tracking chronic condition prevalence and clinical control metrics."
            onClick={() => navigate("/employer/chronic")}
          />

          <KpiCard
            icon={ShieldAlert}
            title="High-Cost Claimants"
            subs={[
              { value: "11", label: "HCC Count" },
              { value: "$1.9M", label: "Total Paid" },
              { value: "$775K", label: "Stop-Loss Reimb." },
            ]}
            info="Tracking members exceeding or approaching the $100,000 stop-loss attachment threshold."
            onClick={() => navigate("/employer/high-cost")}
          />

          <KpiCard
            icon={LineChart}
            title="Employer Risk Benchmarking"
            subs={[
              { value: "53/100", label: "Overall Risk Score" },
              { value: "Moderate", label: "Risk Level" },
              { value: "6", label: "Total Benchmarks" },
            ]}
            info="Comparing Acme Corporation performance against regional commercial health plans and national DPC averages."
            onClick={() => navigate("/employer/benchmarking")}
          />
        </div>
      </section>

      {/* Row 3: Charts & Visuals Part 1 (Enrollment Trend & Cost Distribution) */}
      <section className="stagger-section mb-6">
        <SectionLabel>Longitudinal Trends & Financial Breakdown</SectionLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Chart 1: Monthly Enrollment Trend */}
          <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Monthly Enrollment Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Members and subscribers over time</p>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ENROLLMENT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="membersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="subscribersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis domain={[200, 520]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="members" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#membersGrad)" name="Members" />
                  <Area type="monotone" dataKey="subscribers" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#subscribersGrad)" name="Subscribers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-pink-500" />
                <span>Members (489)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span>Subscribers (250)</span>
              </div>
            </div>
          </Card>

          {/* Chart 2: Cost Distribution */}
          <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Cost Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Medical vs Pharmacy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 my-auto">
              {/* Legend on Left */}
              <div className="flex flex-col gap-4 pl-2">
                {COST_DISTRIBUTION_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                    <div className="flex items-center gap-2.5">
                      <span className="size-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-black tracking-tight" style={{ color: item.color }}>
                      {item.formatted}
                    </span>
                  </div>
                ))}
              </div>

              {/* Donut on Right */}
              <div className="h-[210px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COST_DISTRIBUTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {COST_DISTRIBUTION_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(val: number) => `$${(val / 1000).toLocaleString()}K`}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Plan Year Medical Spend: <strong className="text-foreground">$2,845,000</strong></span>
              <span>Medical 81% • Rx 19%</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Row 4: Charts & Visuals Part 2 (Top Chronic Conditions & Potential HCC Distribution) */}
      <section className="stagger-section mb-6">
        <SectionLabel>Population Health Burden & Stop-Loss Proximity</SectionLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Chart 3: Top Chronic Conditions */}
          <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Top Chronic Conditions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Member prevalence count</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 my-auto">
              {/* List on Left */}
              <div className="flex flex-col gap-2 pr-2">
                {CHRONIC_CONDITIONS_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                    <div className="flex items-center gap-2 truncate">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="font-bold font-mono text-muted-foreground ml-2">{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Pie/Donut on Right */}
              <div className="h-[210px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHRONIC_CONDITIONS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {CHRONIC_CONDITIONS_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(val: number) => `${val} Members`}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Chronic Prevalence: <strong className="text-foreground">263 Members (53.8%)</strong></span>
              <span>Multi-Condition: <strong className="text-foreground">127 Members</strong></span>
            </div>
          </Card>

          {/* Chart 4: Potential HCC Distribution */}
          <Card className="p-5 rounded-2xl border bg-card shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Potential HCC Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Proximity to stop-loss attachment ($100,000 threshold)</p>
            </div>

            <div className="h-[230px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={HCC_DISTRIBUTION_DATA}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 14]} tickCount={6} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="tier" tickLine={false} axisLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
                  <RechartsTooltip 
                    formatter={(val: number) => `${Math.round(val)} Claimants`}
                    contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16} animationDuration={800}>
                    {HCC_DISTRIBUTION_DATA.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Exceeded Stop-Loss (&gt;100%): <strong className="text-rose-600 font-black">11 Claimants ($1.9M Paid)</strong></span>
              <span>Stop-Loss Reimbursed: <strong className="text-emerald-600 font-bold">$775K</strong></span>
            </div>
          </Card>
        </div>
      </section>
    </Page>
  );
}
