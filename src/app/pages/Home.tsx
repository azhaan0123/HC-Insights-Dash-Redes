import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Stethoscope,
  UserX,
  HeartPulse,
  Activity,
  ListTodo,
  FileCheck,
  Megaphone,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  Sparkles,
  Layers,
} from "lucide-react";
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { Page } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { ChartTooltip } from "../components/dashboard/ChartTooltip";
import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { usePageLoading } from "../hooks/usePageLoading";
import {
  QuickActionSkeleton,
  KpiSparklineSkeleton,
  ChartSkeleton,
  ActivityListSkeleton,
} from "../components/dashboard/SkeletonPrimitives";

const chartData = [
  { name: "Jan", inPerson: 12, virtual: 8 },
  { name: "Feb", inPerson: 14, virtual: 19 },
  { name: "Mar", inPerson: 20, virtual: 14 },
  { name: "Apr", inPerson: 26, virtual: 19 },
  { name: "May", inPerson: 17, virtual: 12 },
  { name: "Jun", inPerson: 23, virtual: 16 },
];

const chronicRiskData = [
  { name: "Jan", high: 380, atRisk: 650 },
  { name: "Feb", high: 410, atRisk: 680 },
  { name: "Mar", high: 450, atRisk: 720 },
  { name: "Apr", high: 440, atRisk: 780 },
  { name: "May", high: 435, atRisk: 790 },
  { name: "Jun", high: 432, atRisk: 810 },
];

const kpiDataActive = [
  { day: "Mon", value: 2400 },
  { day: "Tue", value: 2550 },
  { day: "Wed", value: 2500 },
  { day: "Thu", value: 2700 },
  { day: "Fri", value: 2823 },
];

const kpiDataEncounters = [
  { day: "Mon", value: 6800 },
  { day: "Tue", value: 6950 },
  { day: "Wed", value: 7100 },
  { day: "Thu", value: 7000 },
  { day: "Fri", value: 7214 },
];

const kpiDataGaps = [
  { day: "Mon", value: 600 },
  { day: "Tue", value: 610 },
  { day: "Wed", value: 605 },
  { day: "Thu", value: 615 },
  { day: "Fri", value: 625 },
];

const kpiDataRisk = [
  { day: "Mon", value: 450 },
  { day: "Tue", value: 445 },
  { day: "Wed", value: 440 },
  { day: "Thu", value: 435 },
  { day: "Fri", value: 432 },
];

const recentActivity = [
  { id: "ACT_001", icon: Users, type: "Clinical", text: "Annual checkup completed", status: "Completed", date: "Today, 09:45 AM" },
  { id: "ACT_002", icon: FileCheck, type: "Billing", text: "Claim #4020 generated", status: "Pending", date: "Today, 08:30 AM" },
  { id: "ACT_003", icon: Megaphone, type: "Engagement", text: "Campaign email sent", status: "Completed", date: "Yesterday, 04:15 PM" },
  { id: "ACT_004", icon: Activity, type: "Clinical", text: "Refill requested by pharmacy", status: "In Progress", date: "Yesterday, 02:00 PM" },
  { id: "ACT_005", icon: Users, type: "Clinical", text: "New patient intake", status: "Completed", date: "16 Jun, 11:30 AM" },
  { id: "ACT_006", icon: FileCheck, type: "Billing", text: "Invoice #1042 paid", status: "Completed", date: "15 Jun, 09:15 AM" },
  { id: "ACT_007", icon: HeartPulse, type: "Clinical", text: "Lab results reviewed", status: "Completed", date: "15 Jun, 08:00 AM" },
  { id: "ACT_008", icon: Calendar, type: "Administrative", text: "Appointment rescheduled", status: "Pending", date: "14 Jun, 03:20 PM" },
  { id: "ACT_009", icon: Activity, type: "Clinical", text: "Follow-up consultation", status: "In Progress", date: "14 Jun, 01:10 PM" },
  { id: "ACT_010", icon: Megaphone, type: "Engagement", text: "Newsletter distributed", status: "Completed", date: "13 Jun, 10:00 AM" },
];

function StatusDot({ status }: { status: string }) {
  if (status === "Completed") return <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />;
  if (status === "Pending") return <span className="mr-2 inline-block size-2 rounded-full bg-amber-500" />;
  if (status === "In Progress") return <span className="mr-2 inline-block size-2 rounded-full bg-blue-500" />;
  return <span className="mr-2 inline-block size-2 rounded-full bg-muted-foreground/40" />;
}

function QuickActionCard({ title, description, impact, icon: Icon, onAction, badgeText = "AI Recommendation" }: any) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-transparent bg-gradient-to-br from-card to-primary/5 p-4 shadow-sm transition-[box-shadow,transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-md hover:border-primary/20 flex flex-col justify-between group">
      <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-primary/5 opacity-50 transition-all group-hover:scale-110" />
      
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="mr-0.5 size-2.5" />
          {badgeText}
        </span>
      </div>
      
      <div className="mb-3">
        <h4 className="font-semibold text-foreground text-xs mb-0.5">{title}</h4>
        <p className="text-[11px] text-muted-foreground leading-normal">{description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
          {impact}
        </span>
          <Button 
            onClick={onAction}
            size="sm" 
            className="h-7 rounded-full pl-3 pr-2.5 text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs transition-[background-color,transform] duration-150 active:scale-[0.96]"
          >
          Review
        </Button>
      </div>
    </div>
  );
}

function KpiSparklineCard({ 
  title, 
  value, 
  change, 
  changeType, 
  data, 
  dataKey,
  color,
  onClick
}: any) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-transparent bg-card p-6 shadow-sm transition-[box-shadow,transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-md active:scale-[0.98] flex flex-col h-[240px]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="flex size-8 items-center justify-center rounded-full border border-transparent text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="size-4" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-medium tracking-tight text-foreground tabular-nums">{value}</span>
        <span className={cn(
          "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium",
          changeType === "positive" ? "bg-emerald-50 text-emerald-600" : "bg-destructive/10 text-destructive"
        )}>
          {change}
        </span>
      </div>

      <div className="flex-1 w-full min-h-0 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={true} horizontal={false} stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
              dy={10}
            />
            <RechartsTooltip 
              content={<ChartTooltip colorMap={{ [dataKey]: color }} />}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill={`url(#grad-${title.replace(/\s+/g, '-')})`} 
              activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const isLoading = usePageLoading();

  const hour = new Date().getHours();
  let greeting = "Good evening, Hannah!";
  if (hour < 12) greeting = "Good morning, Hannah!";
  else if (hour < 18) greeting = "Good afternoon, Hannah!";

  const subtitleText = "Stay on top of your practice, monitor patient progress, and track engagement.";

  if (isLoading) {
    return (
      <Page title={greeting} subtitle={subtitleText}>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-4 rounded bg-accent animate-pulse" />
            <div className="h-3 w-48 rounded bg-accent animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionSkeleton />
            <QuickActionSkeleton />
            <QuickActionSkeleton />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="size-4 rounded bg-accent animate-pulse" />
          <div className="h-3 w-40 rounded bg-accent animate-pulse" />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <KpiSparklineSkeleton />
          <KpiSparklineSkeleton />
          <KpiSparklineSkeleton />
          <KpiSparklineSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="flex flex-col gap-6 xl:col-span-2">
            <ChartSkeleton height={300} />
            <ChartSkeleton height={300} />
          </div>
          <div className="flex flex-col gap-6">
            <ChartSkeleton height={200} />
            <ActivityListSkeleton items={6} />
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={greeting}
      subtitle={subtitleText}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/home-classic")}
          className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40 font-semibold"
        >
          <Layers className="size-3.5" />
          <span>Legacy UI</span>
        </Button>
      }
    >


      {/* Performance Overview Heading */}
      <div className="flex items-center gap-2 mb-3 stagger-section">
        <Activity className="size-4 text-muted-foreground/70" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Performance Overview</h3>
      </div>

      {/* Primary KPIs Row */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-section">
        <KpiSparklineCard 
          title="Total Active Patients"
          value="2,823"
          change="↑ 12%"
          changeType="positive"
          data={kpiDataActive}
          dataKey="value"
          color="#10b981"
          onClick={() => navigate("/engagement/total-active-patients")}
        />
        
        <KpiSparklineCard 
          title="Total Encounters"
          value="7,214"
          change="↑ 8%"
          changeType="positive"
          data={kpiDataEncounters}
          dataKey="value"
          color="#10b981"
          onClick={() => navigate("/engagement/encounters")}
        />

        <KpiSparklineCard 
          title="Utilization Gaps"
          value="625"
          change="↑ 3%"
          changeType="negative"
          data={kpiDataGaps}
          dataKey="value"
          color="#ef4444"
          onClick={() => navigate("/utilization-gaps")}
        />

        <KpiSparklineCard 
          title="High Risk Patients"
          value="432"
          change="↓ 5%"
          changeType="positive"
          data={kpiDataRisk}
          dataKey="value"
          color="#10b981"
          onClick={() => navigate("/chronic-risk")}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 stagger-section">
        
        {/* Chart Column - Styled like "Health Report Pending" from image */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="flex flex-col rounded-2xl border border-transparent bg-card p-6 shadow-sm min-h-[400px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Engagement Trends</h3>
                <p className="text-xs text-muted-foreground mt-1">In-Person vs Virtual encounters over the last 6 months</p>
              </div>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-full">
                Report
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                <span className="size-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                In-Person
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                <span className="size-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                Virtual
              </div>
            </div>
            
            <div className="w-full flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid vertical={false} horizontal={true} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  />
                  <RechartsTooltip 
                    content={<ChartTooltip colorMap={{ inPerson: 'var(--primary)', virtual: '#3b82f6' }} />}
                    cursor={{ stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inPerson" 
                    stroke="var(--primary)" 
                    strokeWidth={2.5} 
                    dot={false} 
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--primary)", fill: "var(--background)" }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="virtual" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    dot={false} 
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#3b82f6", fill: "var(--background)" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chronic Risk Graph */}
          <div className="flex flex-col rounded-2xl border border-transparent bg-card p-6 shadow-sm min-h-[400px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Chronic Risk</h3>
                <p className="text-xs text-muted-foreground mt-1">High Risk vs At Risk patients over 6 months</p>
              </div>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-full">
                Report
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                <span className="size-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                High Risk
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                <span className="size-2 rounded-full" style={{ backgroundColor: '#eab308' }} />
                At Risk
              </div>
            </div>
            
            <div className="w-full flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chronicRiskData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-high" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="grad-atRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} horizontal={true} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  />
                  <RechartsTooltip 
                    content={<ChartTooltip colorMap={{ high: '#ef4444', atRisk: '#eab308' }} />}
                    cursor={{ stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#ef4444" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#grad-high)" 
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#ef4444", fill: "var(--background)" }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="atRisk" 
                    stroke="#eab308" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#grad-atRisk)" 
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#eab308", fill: "var(--background)" }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Cost Savings Overview */}
          <div className="rounded-2xl border border-transparent bg-card p-6 shadow-sm flex flex-col min-h-[220px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cost Savings</h3>
                <div className="text-2xl font-medium tracking-tight text-emerald-600 tabular-nums">
                  $1,577,117 <span className="text-sm font-medium text-emerald-600/80">saved</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold mt-1" onClick={() => navigate("/cost-savings")}>
                View Details
              </Button>
            </div>
            <div className="flex-1 w-full min-h-[160px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Total Value", value: 1652117 },
                    { name: "Investment", value: 75000 },
                    { name: "Savings", value: 1577117 },
                  ]}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  barSize={24}
                >
                  <CartesianGrid vertical={true} horizontal={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    width={90}
                  />
                  <RechartsTooltip
                    content={<ChartTooltip valueFormatter={(v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)} />}
                    cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f5a623" />
                    <Cell fill="#22c55e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="rounded-2xl border border-transparent bg-card shadow-sm flex-1 flex flex-col overflow-hidden min-h-0 max-h-[520px]">
            <div className="flex items-center justify-between border-b border-border/50 p-6 bg-card z-10 shrink-0">
              <h3 className="font-semibold text-foreground">Recent Activities</h3>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary">View All</Button>
            </div>
            <div className="flex flex-col py-2 overflow-y-auto flex-1">
              {recentActivity.map((activity, idx) => {
                const isLast = idx === recentActivity.length - 1;
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className={cn("flex items-start gap-4 px-6 py-4 hover:bg-muted/50 transition-[background-color] duration-150", !isLast && "border-b border-border/50")}>
                    <div className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <Icon className="size-[18px]" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden mt-0.5">
                      <p className="truncate text-[14px] font-medium text-foreground">{activity.text}</p>
                      <div className="flex items-center justify-between text-[12px] text-muted-foreground mt-0.5">
                        <span className="truncate">{activity.date}</span>
                        <div className="flex items-center whitespace-nowrap pl-2">
                          <StatusDot status={activity.status} />
                          <span className={cn(
                            activity.status === "Completed" && "text-emerald-600",
                            activity.status === "Pending" && "text-amber-600",
                            activity.status === "In Progress" && "text-blue-600"
                          )}>{activity.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <Dialog open={activeAction !== null} onOpenChange={() => setActiveAction(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-2xl border-border bg-card shadow-xl">
          {activeAction === "care-gaps" && (
            <div>
              <div className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border-b border-border/50">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="size-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Insight & Automation</span>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">Auto-Close Care Gaps</DialogTitle>
                <DialogDescription className="text-xs mt-1 text-muted-foreground">
                  AI identified 14 patients overdue for diabetic HbA1c screenings. Outreach templates have been pre-drafted.
                </DialogDescription>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-muted/50 p-4">
                    <span className="text-xs text-muted-foreground block mb-1">Quality Bonus Impact</span>
                    <span className="text-2xl font-bold text-emerald-600">+$2,400</span>
                    <span className="text-[10px] text-muted-foreground block mt-1">HEDIS score optimization</span>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/50 p-4">
                    <span className="text-xs text-muted-foreground block mb-1">Target Patients</span>
                    <span className="text-2xl font-bold text-foreground">14 Patients</span>
                    <span className="text-[10px] text-muted-foreground block mt-1">&gt;12 months since last checkup</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Priority Outreach List</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Hannah Smith", lastVisit: "14 months ago", status: "High Risk (HbA1c 9.2%)" },
                      { name: "John Doe", lastVisit: "13 months ago", status: "Medium Risk (HbA1c 8.9%)" },
                      { name: "Sarah Jenkins", lastVisit: "12 months ago", status: "Medium Risk (HbA1c 8.5%)" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
                        <div>
                          <span className="font-semibold text-foreground block">{p.name}</span>
                          <span className="text-muted-foreground text-[10px]">Last visit: {p.lastVisit}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium text-[10px]">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[120px] w-full">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Care Gap Closure Progress</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: "Jan", gaps: 45 },
                      { month: "Feb", gaps: 38 },
                      { month: "Mar", gaps: 32 },
                      { month: "Apr", gaps: 25 },
                      { month: "May", gaps: 20 },
                      { month: "Jun", gaps: 14 },
                    ]}>
                      <CartesianGrid vertical={false} horizontal={true} stroke="var(--border)" strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Line type="monotone" dataKey="gaps" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 bg-muted/50 border-t border-border/50">
                <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>Cancel</Button>
                <Button size="sm" onClick={() => { alert("Campaign sent!"); setActiveAction(null); }}>Send Smart Outreach</Button>
              </div>
            </div>
          )}

          {activeAction === "claims" && (
            <div>
              <div className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border-b border-border/50">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="size-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Diagnostic Code Match</span>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">Resolve Claim Denial</DialogTitle>
                <DialogDescription className="text-xs mt-1 text-muted-foreground">
                  Claim #4020 rejected due to missing secondary diagnosis code. AI detected neuropathy notes.
                </DialogDescription>
              </div>

              <div className="p-6 space-y-4">
                <div className="rounded-xl border border-border p-4 bg-card space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Patient:</span>
                    <span className="font-semibold text-foreground">David Miller (DOB: 08/14/1974)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Payer:</span>
                    <span className="font-semibold text-foreground">Blue Cross Blue Shield</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-emerald-600">$1,280.00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 border border-red-200 bg-red-50/30 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-red-500 block mb-1">Submitted Claim</span>
                    <span className="font-semibold block text-foreground">E11.9</span>
                    <span className="text-muted-foreground text-[10px] leading-tight block mt-0.5">Type 2 Diabetes without complications</span>
                    <span className="text-red-600 font-bold block mt-2 text-[10px]">REJECTED</span>
                  </div>
                  <div className="p-3 border border-emerald-200 bg-emerald-50/30 rounded-xl relative overflow-hidden">
                    <div className="absolute right-1 top-1">
                      <Sparkles className="size-3 text-emerald-500" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">AI Recommendation</span>
                    <span className="font-semibold block text-foreground">E11.9 + E11.40</span>
                    <span className="text-muted-foreground text-[10px] leading-tight block mt-0.5">Diabetes with diabetic neuropathy</span>
                    <span className="text-emerald-600 font-bold block mt-2 text-[10px]">98% Approval Probability</span>
                  </div>
                </div>

                <div className="p-3 bg-muted border border-border rounded-xl text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-bold text-foreground block mb-1">Clinical Note Evidence:</span>
                  "...Patient reports tingling and numbness in lower extremities. Sensation reduced on monofilament exam. Dr. Evans, 12 Jun"
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 bg-muted/50 border-t border-border/50">
                <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>Cancel</Button>
                <Button size="sm" onClick={() => { alert("Claim resubmitted!"); setActiveAction(null); }}>Approve & Resubmit Claim</Button>
              </div>
            </div>
          )}

          {activeAction === "cancellation" && (
            <div>
              <div className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border-b border-border/50">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="size-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Smart Waitlist Matcher</span>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">Fill Empty Slot</DialogTitle>
                <DialogDescription className="text-xs mt-1 text-muted-foreground">
                  Fill Dr. Evans' tomorrow 2:00 PM slot with the best matching waitlist patient.
                </DialogDescription>
              </div>

              <div className="p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Waitlist Matches</h4>
                <div className="space-y-3">
                  {[
                    { name: "Robert Chen", risk: "High Risk", wait: "28 days", score: "98%", desc: "Overdue for cardiovascular follow-up. Lives 1.5mi away." },
                    { name: "Emily Taylor", risk: "Medium Risk", wait: "14 days", score: "91%", desc: "Needs routine wellness exam. Lives 3.2mi away." },
                    { name: "Michael Chang", risk: "Low Risk", wait: "5 days", score: "85%", desc: "Waitlisted for routine physical. Lives 4.0mi away." },
                  ].map((w, i) => (
                    <div key={i} className="p-3 border border-border rounded-xl bg-card flex justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{w.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-medium">{w.risk}</span>
                        </div>
                        <p className="text-muted-foreground text-[10px]">{w.desc}</p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col justify-between">
                        <span className="font-bold text-primary block text-sm">{w.score} Match</span>
                        <span className="text-muted-foreground text-[10px]">{w.wait} wait</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 bg-muted/50 border-t border-border/50">
                <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>Cancel</Button>
                <Button size="sm" onClick={() => { alert("Invitations sent!"); setActiveAction(null); }}>Send Smart Invites</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
