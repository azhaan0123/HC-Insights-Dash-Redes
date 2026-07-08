import { Page } from "../components/layout/Page";
import { KpiCard } from "../components/dashboard/KpiCard";
import { Info } from "lucide-react";
import { cn } from "../components/ui/utils";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector } from "recharts";
import { useState } from "react";
import { ChartTooltip } from "../components/dashboard/ChartTooltip";
import { DataTable, type Column } from "../components/dashboard/DataTable";

import { usePageLoading } from "../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton, PieChartSkeleton, TableSkeleton } from "../components/dashboard/SkeletonPrimitives";

const overviewData = [
  { name: "Total Value", value: 1652117 },
  { name: "Employer Investment", value: 75000 },
  { name: "Total Savings", value: 1577117 },
];

const barColors = [
  "#3b82f6",  // blue — Total Value
  "#f5a623",  // orange — Employer Investment
  "#22c55e",  // green — Total Savings
];

const PIE_COLORS = [
  "#FF6B2B", // primary orange — Covered Visit
  "#22a952", // green — Covered Procedures
  "#f5a623", // orange — Low Cost Labs
  "#f97316", // secondary orange — Free Rx
  "#d32f2f", // red — Medication Management
  "#f97316", // tangerine — Quality Measures
  "#7c3aed", // violet — Messaging
  "#0ea5e9", // sky blue — Spruce Conversation
  "#475569", // slate — Encounter
  "#4ade80", // light green — Covered Labs
  "#2563eb", // blue — Low Cost Procedures
];

const rawPieData = [
  { name: "Covered Visit", value: 721400 },
  { name: "Covered Procedures", value: 377094 },
  { name: "Low Cost Labs", value: 253250 },
  { name: "Free Rx", value: 130009 },
  { name: "Medication Management", value: 108900 },
  { name: "Quality Measures / Screening (Custom)", value: 54250 },
  { name: "Messaging", value: 4490 },
  { name: "Spruce Conversation", value: 1280 },
  { name: "Encounter", value: 694 },
  { name: "Covered Labs", value: 500 },
  { name: "Low Cost Procedures", value: 250 },
];

/* Enforce a minimum 2% visual slice so tiny items stay visible */
const total = rawPieData.reduce((s, d) => s + d.value, 0);
const MIN_PCT = 0.02;
const pieData = rawPieData.map((d, i) => {
  const pct = d.value / total;
  return {
    ...d,
    displayValue: pct < MIN_PCT ? total * MIN_PCT : d.value,
    color: PIE_COLORS[i],
  };
});

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </g>
  );
};

const CATEGORY_PATIENTS: Record<string, any[]> = {
  "Covered Visit": [
    { id: "PT-1042", name: "Sarah Jenkins", email: "s.jenkins@example.com", cpt: "99214 : 4 Visits", employer: "Acme Corp", dpc: "Downtown Health", physician: "Dr. Robert Chen" },
    { id: "PT-1089", name: "Michael Chang", email: "m.chang@example.com", cpt: "99213 : 2 Visits", employer: "Acme Corp", dpc: "Westside Clinic", physician: "Dr. Emily Alcott" },
    { id: "PT-1102", name: "Amanda Ross", email: "a.ross@example.com", cpt: "99215 : 1 Visit", employer: "Globex Inc", dpc: "Downtown Health", physician: "Dr. Robert Chen" },
  ],
  "Covered Procedures": [
    { id: "PT-2011", name: "David Smith", email: "d.smith@example.com", cpt: "17000 : 1 Visit", employer: "Stark Industries", dpc: "Northside Care", physician: "Dr. Marcus Brody" },
    { id: "PT-2045", name: "Elena Rostova", email: "e.rostova@example.com", cpt: "11102 : 2 Visits", employer: "Wayne Enterprises", dpc: "Downtown Health", physician: "Dr. Robert Chen" },
  ],
  "Low Cost Labs": [
    { id: "PT-3022", name: "Rachel Green", email: "r.green@example.com", cpt: "80053 : 2 Visits", employer: "Central Perk", dpc: "Village Health", physician: "Dr. Richard Burke" },
    { id: "PT-3091", name: "Ross Geller", email: "r.geller@example.com", cpt: "85025 : 1 Visit", employer: "NYU", dpc: "Village Health", physician: "Dr. Richard Burke" },
  ],
  "Free Rx": [
    { id: "PT-4012", name: "Walter White", email: "w.white@example.com", cpt: "RX-FREE : 3 Refills", employer: "JPW High School", dpc: "Desert Care", physician: "Dr. Delcavoli" },
  ],
  "Medication Management": [
    { id: "PT-5088", name: "Jesse Pinkman", email: "j.pinkman@example.com", cpt: "99605 : 2 Visits", employer: "Self Employed", dpc: "Desert Care", physician: "Dr. Delcavoli" },
  ],
  "Quality Measures / Screening (Custom)": [
    { id: "PT-6011", name: "Leslie Knope", email: "l.knope@example.com", cpt: "G0438 : 1 Visit", employer: "City of Pawnee", dpc: "Pawnee Health", physician: "Dr. Harris" },
  ],
  "Messaging": [
    { id: "PT-7034", name: "Ron Swanson", email: "r.swanson@example.com", cpt: "99421 : 5 Msgs", employer: "City of Pawnee", dpc: "Pawnee Health", physician: "Dr. Harris" },
  ],
  "Spruce Conversation": [
    { id: "PT-8099", name: "Tom Haverford", email: "t.haverford@example.com", cpt: "SPR-01 : 2 Chats", employer: "Entertainment 720", dpc: "Pawnee Health", physician: "Dr. Harris" },
  ],
  "Encounter": [
    { id: "PT-9012", name: "Ann Perkins", email: "a.perkins@example.com", cpt: "99211 : 1 Visit", employer: "Pawnee General", dpc: "Pawnee Health", physician: "Dr. Harris" },
  ],
  "Covered Labs": [
    { id: "PT-9101", name: "Ben Wyatt", email: "b.wyatt@example.com", cpt: "80061 : 1 Visit", employer: "State of Indiana", dpc: "Pawnee Health", physician: "Dr. Harris" },
  ],
  "Low Cost Procedures": [
    { id: "PT-9202", name: "Chris Traeger", email: "c.traeger@example.com", cpt: "93000 : 1 Visit", employer: "City of Pawnee", dpc: "Pawnee Health", physician: "Dr. Harris" },
  ],
};

const ALL_PATIENTS = Object.values(CATEGORY_PATIENTS).flat();

export default function CostSavings() {
  const isLoading = usePageLoading();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <Page title="Cost Savings">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 mb-6">
          <KpiCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
          <ChartSkeleton height={280} />
          <ChartSkeleton height={280} />
        </div>
        <PieChartSkeleton className="mb-6" />
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const tableColumns: Column<any>[] = [
    { key: "id", header: "Patient ID" },
    { key: "name", header: "Patient Name" },
    { key: "email", header: "Patient Email" },
    { key: "cpt", header: "CPT Code : # of Visits" },
    { key: "employer", header: "Employer" },
    { key: "dpc", header: "DPC" },
    { key: "physician", header: "Physician" },
  ];

  const costSavingsChips = [
    { label: "Start Date", value: "01-01-2023", options: [] },
    { label: "End Date", value: "06-18-2026", options: [] },
    { label: "Employer", value: "All Sponsored Patients", options: ["All Sponsored Patients"] },
    { label: "Division", value: "All Divisions", options: ["All Divisions"] },
    { label: "DPC", value: "All DPCs", options: ["All DPCs"] },
    { label: "Physician", value: "All Physicians", options: ["All Physicians"] },
  ];

  return (
    <Page title="Cost Savings" chips={costSavingsChips}>
      {/* Top Grid Area */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3 stagger-section">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Total Savings KPI */}
          <div className="flex flex-col rounded-2xl border border-transparent bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total Savings</span>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-emerald-600 mb-1 tabular-nums">
                $1,577,117
              </div>
              <p className="text-xs text-muted-foreground">
                Difference between value and investment.
              </p>
            </div>
          </div>

          {/* Info Card */}
          <div className="flex flex-col rounded-2xl border border-transparent bg-card p-5 shadow-sm">
            <ul className="space-y-2 text-xs text-foreground list-disc pl-4">
              <li>Savings are based on encounter counts, CPT codes, and fee-for-service rates from DPC locations.</li>
              <li>Procedure pricing uses Healthcare Bluebook or CMS fee schedules.</li>
              <li>Fallback CPT: Defaults to 99215 (In-person) or 99443 (telemed/chat) if code is unavailable.</li>
              <li>Employer Investment = Monthly rate x active adult/dependent members at month-end.</li>
              <li>Total Savings = Total Value - Employer Investment.</li>
            </ul>
          </div>
        </div>

        {/* Right Column (Overview Chart) */}
        <div className="flex flex-col rounded-2xl border border-transparent bg-card p-6 shadow-sm lg:col-span-2 min-h-[350px]">
          <h3 className="mb-6 text-sm font-medium text-foreground">Overview</h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={60}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--foreground)' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                  domain={[0, 1800000]}
                  ticks={[0, 450000, 900000, 1350000, 1800000]}
                />
                <RechartsTooltip 
                  content={<ChartTooltip valueFormatter={(v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)} />}
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {overviewData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Encounters KPI Cards Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-section">
        <KpiCard
          title="Total # Encounters"
          value="124"
          caption="Total encounters during selected timeframe."
          className="lg:col-span-1"
        />
        <KpiCard
          title="Encounter Types - Breakdown"
          subs={[
            { value: "91", label: "Spruce Conversation" },
            { value: "17", label: "Clinic (Office)" },
            { value: "14", label: "Phone/Video (Virtual)" },
          ]}
          className="md:col-span-2 lg:col-span-2"
        />
        <KpiCard
          title="Total # After Hours Encounters"
          value="7"
          caption="Total encounters after hours and weekends."
          className="lg:col-span-1"
        />
      </div>

      {/* Middle Section (Pie Chart Breakdown) */}
      <div className="mb-6 flex flex-col rounded-2xl border border-transparent bg-card p-6 shadow-sm min-h-[400px] stagger-section">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground">Total Value - Breakdown (Service Types)</h3>
          <p className="text-xs text-muted-foreground mt-1">Note: Hover service types to highlight, click legends for patient details.</p>
        </div>
        
        <div className="flex flex-1 flex-col md:flex-row items-center gap-8">
          {/* Legend */}
          <div className="flex-1 space-y-2">
            {pieData.map((item, index) => {
              const isSelected = selectedCategory === item.name;
              return (
              <div 
                key={index} 
                className={cn(
                  "flex items-center gap-2 cursor-pointer text-sm font-medium transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1",
                  isSelected ? "text-primary font-bold" : "text-foreground"
                )}
                style={{ opacity: selectedCategory ? (isSelected ? 1 : 0.3) : (activeIndex === undefined || activeIndex === index ? 1 : 0.4) }}
                onClick={() => setSelectedCategory(isSelected ? undefined : item.name)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}: {formatCurrency(item.value)}
              </div>
            );})}
          </div>

          {/* Pie Chart */}
          <div className="flex-1 w-full h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={120}
                  dataKey="displayValue"
                  stroke="none"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  onClick={(_, index) => setSelectedCategory(selectedCategory === pieData[index].name ? undefined : pieData[index].name)}
                  className="cursor-pointer"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={<ChartTooltip valueFormatter={(v) => formatCurrency(v)} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section (Data Table) */}
      <div className="rounded-2xl border border-transparent flex flex-col min-h-[200px] stagger-section">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5 border border-border">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: selectedCategory ? pieData.find(p => p.name === selectedCategory)?.color : "var(--primary)" }} />
            <span className="text-xs font-semibold text-foreground">
              {selectedCategory ? (
                <>Showing patient details for: <span className="text-primary font-bold">{selectedCategory}</span></>
              ) : (
                <>Showing <span className="text-primary font-bold">All Service Categories</span> ({ALL_PATIENTS.length} Patients)</>
              )}
            </span>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(undefined)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
        <DataTable
          columns={tableColumns}
          rows={selectedCategory ? CATEGORY_PATIENTS[selectedCategory] || [] : ALL_PATIENTS}
          rowKey={(_, i) => String(i)}
          emptyMessage="No patient records found"
        />
      </div>
    </Page>
  );
}
