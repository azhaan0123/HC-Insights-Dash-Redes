import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  UserPlus,
  Clock,
  MessageSquareOff,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Send,
  UserCheck,
  Building2,
  Stethoscope,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Page } from "../../components/layout/Page";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/ui/sheet";
import { IdCell } from "../../components/dashboard/cells";
import {
  ACTION_CENTRE_PATIENTS,
  COHORT_SUMMARIES,
  type ActionCentrePatientRow,
  type CohortType,
  type GapTier,
} from "../../data/actionCentreData";
import { cn } from "../../components/ui/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const getMetricGraphData = (count: number, view: "WoW" | "MoM", isPositive: boolean) => {
  if (view === "WoW") {
    const factor = isPositive ? 0.85 : 1.15;
    return [
      { period: "Wk 1", value: Math.max(1, Math.round(count * factor * 0.9)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 2", value: Math.max(1, Math.round(count * factor * 0.93)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 3", value: Math.max(1, Math.round(count * factor * 0.96)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 4", value: Math.max(1, Math.round(count * factor * 0.98)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 5", value: Math.max(1, Math.round(count * factor * 1.0)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 6", value: Math.max(1, Math.round(count * 0.96)), benchmark: Math.round(count * 0.95) },
      { period: "Wk 7", value: Math.max(1, Math.round(count * 0.93)), benchmark: Math.round(count * 0.95) },
      { period: "Current Wk", value: count, benchmark: Math.round(count * 0.95) },
    ];
  } else {
    const factor = isPositive ? 0.75 : 1.25;
    return [
      { period: "Feb", value: Math.max(1, Math.round(count * factor * 0.85)), benchmark: Math.round(count * 0.9) },
      { period: "Mar", value: Math.max(1, Math.round(count * factor * 0.9)), benchmark: Math.round(count * 0.9) },
      { period: "Apr", value: Math.max(1, Math.round(count * factor * 0.95)), benchmark: Math.round(count * 0.9) },
      { period: "May", value: Math.max(1, Math.round(count * 0.92)), benchmark: Math.round(count * 0.9) },
      { period: "Jun", value: Math.max(1, Math.round(count * 0.95)), benchmark: Math.round(count * 0.9) },
      { period: "Jul (Current)", value: count, benchmark: Math.round(count * 0.9) },
    ];
  }
};

export default function ActionCentreOverview() {
  const navigate = useNavigate();
  const [activeCohort, setActiveCohort] = useState<CohortType | "all">("all");
  const [activeGapTier, setActiveGapTier] = useState<GapTier | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("highest-risk");
  const [selectedPatient, setSelectedPatient] = useState<ActionCentrePatientRow | null>(null);
  const [completedPatientIds, setCompletedPatientIds] = useState<Set<string>>(new Set());
  const [selectedMetricOverlay, setSelectedMetricOverlay] = useState<typeof COHORT_SUMMARIES[number] | null>(null);
  const [metricGraphView, setMetricGraphView] = useState<"WoW" | "MoM">("WoW");

  // Filter patients
  const filteredPatients = useMemo(() => {
    let list = [...ACTION_CENTRE_PATIENTS];

    // Exclude completed/handled patients from immediate active list if needed or mark them
    if (activeCohort !== "all") {
      list = list.filter((p) => p.cohort === activeCohort);
    }

    if (activeCohort === "engagement-gap" && activeGapTier !== "all") {
      list = list.filter((p) => p.gapTier === activeGapTier);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reason.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q) ||
          p.physician.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "highest-risk") {
        const pOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        if (pOrder[b.priority] !== pOrder[a.priority]) {
          return pOrder[b.priority] - pOrder[a.priority];
        }
        return (b.lastVisitDaysAgo || 999) - (a.lastVisitDaysAgo || 999);
      }
      if (sortBy === "longest-inactive") {
        return (b.lastVisitDaysAgo || 999) - (a.lastVisitDaysAgo || 999);
      }
      if (sortBy === "last-visit") {
        return (a.lastVisitDaysAgo || 0) - (b.lastVisitDaysAgo || 0);
      }
      if (sortBy === "newest") {
        return (a.lastVisitDaysAgo === null ? 0 : 1) - (b.lastVisitDaysAgo === null ? 0 : 1);
      }
      return 0;
    });

    return list;
  }, [activeCohort, activeGapTier, searchQuery, sortBy]);

  const handleTriggerAction = (patient: ActionCentrePatientRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast.success(`Action initiated for ${patient.name}`, {
      description: `${patient.suggestedAction} has been queued or logged successfully.`,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo action"),
      },
    });
    setCompletedPatientIds((prev) => new Set(prev).add(patient.id));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge className="bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/30 font-semibold px-2.5 py-0.5">
            High Priority
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30 font-medium px-2.5 py-0.5">
            Medium Priority
          </Badge>
        );
      default:
        return (
          <Badge className="bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/30 font-medium px-2.5 py-0.5">
            Low Priority
          </Badge>
        );
    }
  };

  const getCohortIconBox = (id: string) => {
    const baseClass = "flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary dark:bg-card text-muted-foreground dark:text-muted-foreground/70";
    switch (id) {
      case "new-activation":
        return (
          <div className={baseClass}>
            <UserPlus className="size-3.5" />
          </div>
        );
      case "engagement-gap":
        return (
          <div className={baseClass}>
            <Clock className="size-3.5" />
          </div>
        );
      case "low-response":
        return (
          <div className={baseClass}>
            <MessageSquareOff className="size-3.5" />
          </div>
        );
      default:
        return (
          <div className={baseClass}>
            <Activity className="size-3.5" />
          </div>
        );
    }
  };

  return (
    <Page
      title="Utilization Gaps"
      subtitle="Phase 1: Operational Visibility — Replace passive reporting with daily actionable patient work queues."
      showFilters={false}
      showIconActions={false}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/action-centre-classic")}
          className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40 font-semibold"
        >
          <span>Legacy UI</span>
        </Button>
      }
    >
      {/* 1. Engagement Overview Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-tight text-foreground dark:text-foreground/90 uppercase">
            Operational Summary Cards
          </h2>
          <span className="text-xs text-muted-foreground">
            Click any card to switch patient queue view
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COHORT_SUMMARIES.map((card) => {
            const isSelected = activeCohort === card.id;
            return (
              <Card
                key={card.id}
                onClick={() => {
                  setActiveCohort(card.id as any);
                  if (card.id !== "engagement-gap") setActiveGapTier("all");
                }}
                className={cn(
                  "cursor-pointer rounded-2xl border transition-[box-shadow,transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden flex flex-col justify-between active:scale-[0.98]",
                  isSelected
                    ? "border-transparent ring-2 ring-primary/40 bg-primary/[0.03] shadow-md"
                    : "border-transparent bg-card shadow-sm hover:shadow-md hover:bg-accent/30"
                )}
              >
                <CardContent className="p-3.5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground/90 dark:text-foreground/90 line-clamp-1 leading-tight pt-0.5">
                        {card.title}
                      </span>
                      {getCohortIconBox(card.id)}
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                        {card.count}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium tracking-tight",
                          card.wowPositive
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                        )}
                        title="Week over Week Change"
                      >
                        {card.wowPositive ? (
                          <ArrowDownRight className="size-3" />
                        ) : (
                          <ArrowUpRight className="size-3" />
                        )}
                        <span>{card.wowChange} WoW</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                    <span className="text-muted-foreground font-medium">Patients</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMetricOverlay(card);
                        setMetricGraphView("WoW");
                      }}
                      className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ExternalLink className="size-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2. Actionable Patient Cohorts Work Queue Controls */}
      <Card className="rounded-2xl border border-transparent bg-card shadow-sm transition-[box-shadow] duration-200 hover:shadow-md mb-6 overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/50 dark:bg-card/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>Patient Work Queue</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {filteredPatients.length} Active
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">
              Rule-based cohorts surfacing members requiring timely DPC intervention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, condition, employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-9 text-xs">
                <SlidersHorizontal className="size-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Sort queue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest-risk">Sort: Highest Priority</SelectItem>
                <SelectItem value="longest-inactive">Sort: Longest Inactive</SelectItem>
                <SelectItem value="last-visit">Sort: Recent Visit First</SelectItem>
                <SelectItem value="newest">Sort: Newest Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cohort Tabs Bar */}
        <div className="px-4 pt-3 border-b border-border/50 overflow-x-auto">
          <div className="pb-3">
            <div className="inline-flex flex-wrap items-center gap-1 rounded-md border bg-card p-1 shadow-2xs relative z-0">
              {[
                {
                  id: "all" as const,
                  label: "All Requiring Attention",
                  count: 98,
                  icon: null,
                  activeBg: "bg-primary",
                  activeText: "text-primary-foreground font-semibold",
                  activeBadge: "bg-white/20 text-white",
                  unselectedIcon: null,
                },
                {
                  id: "new-activation" as const,
                  label: "New Activation",
                  count: 28,
                  icon: UserPlus,
                  activeBg: "bg-emerald-600 dark:bg-emerald-500",
                  activeText: "text-white font-semibold",
                  activeBadge: "bg-white/20 text-white",
                  unselectedIcon: "text-emerald-500/80",
                },
                {
                  id: "engagement-gap" as const,
                  label: "Engagement Gap",
                  count: 54,
                  icon: Clock,
                  activeBg: "bg-amber-600 dark:bg-amber-500",
                  activeText: "text-white font-semibold",
                  activeBadge: "bg-white/20 text-white",
                  unselectedIcon: "text-amber-500/80",
                },
                {
                  id: "low-response" as const,
                  label: "Low Response",
                  count: 16,
                  icon: MessageSquareOff,
                  activeBg: "bg-sky-600 dark:bg-sky-500",
                  activeText: "text-white font-semibold",
                  activeBadge: "bg-white/20 text-white",
                  unselectedIcon: "text-sky-500/80",
                },
              ].map((tab) => {
                const isSelected = activeCohort === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCohort(tab.id);
                      if (tab.id !== "engagement-gap") setActiveGapTier("all");
                    }}
                    className={cn(
                      "relative z-10 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors cursor-pointer select-none",
                      isSelected
                        ? tab.activeText
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="queueSwitchIndicator"
                        className={cn("absolute inset-0 rounded-md shadow-sm z-[-1]", tab.activeBg)}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    {Icon && (
                      <Icon className={cn("size-3.5", isSelected ? "text-white" : tab.unselectedIcon)} />
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-semibold",
                        isSelected ? tab.activeBadge : "bg-muted text-muted-foreground"
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-filters for Engagement Gap */}
          {activeCohort === "engagement-gap" && (
            <div className="flex flex-wrap items-center gap-2 pb-3 pt-1 border-t border-border/40 text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Filter className="size-3" /> Duration Sub-filter:
              </span>
              <button
                onClick={() => setActiveGapTier("all")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
                  activeGapTier === "all"
                    ? "bg-pink-500/15 text-primary dark:bg-pink-500/25 dark:text-pink-300 border border-pink-500/40 font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary dark:hover:bg-card"
                )}
              >
                All Gaps
              </button>
              <button
                onClick={() => setActiveGapTier("30-days")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
                  activeGapTier === "30-days"
                    ? "bg-pink-500/15 text-primary dark:bg-pink-500/25 dark:text-pink-300 border border-pink-500/40 font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary dark:hover:bg-card"
                )}
              >
                30+ Days No Visit
              </button>
              <button
                onClick={() => setActiveGapTier("60-days")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
                  activeGapTier === "60-days"
                    ? "bg-pink-500/15 text-primary dark:bg-pink-500/25 dark:text-pink-300 border border-pink-500/40 font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary dark:hover:bg-card"
                )}
              >
                60+ Days No Visit
              </button>
              <button
                onClick={() => setActiveGapTier("90-days")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
                  activeGapTier === "90-days"
                    ? "bg-pink-500/15 text-primary dark:bg-pink-500/25 dark:text-pink-300 border border-pink-500/40 font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary dark:hover:bg-card"
                )}
              >
                90+ Days Critical Gap
              </button>
              <button
                onClick={() => setActiveGapTier("custom")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer flex items-center gap-1",
                  activeGapTier === "custom"
                    ? "bg-pink-500/15 text-primary dark:bg-pink-500/25 dark:text-pink-300 border border-pink-500/40 font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary dark:hover:bg-card"
                )}
              >
                <Calendar className="size-3" />
                <span>Custom Date Range</span>
              </button>

              {activeGapTier === "custom" && (
                <div className="inline-flex items-center gap-1.5 ml-1 pl-2 border-l border-border/60 animate-fade-in text-[11px]">
                  <span className="text-muted-foreground">From:</span>
                  <input type="date" defaultValue="2025-10-01" className="h-6 rounded border border-border bg-background px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  <span className="text-muted-foreground">To:</span>
                  <input type="date" defaultValue="2026-03-31" className="h-6 rounded border border-border bg-background px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Patient Lists Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/70 dark:bg-card/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Patient Member</th>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-4">Reason for Inclusion</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4">Last Outreach</th>
                <th className="py-3 px-4 text-right">Suggested Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="font-semibold text-foreground/90 dark:text-muted-foreground/50">
                      No patients pending in this queue!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All engagement opportunities for this criteria have been handled or none match search.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isDone = completedPatientIds.has(patient.id);
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-primary/[0.04] group",
                        isDone && "opacity-60 bg-muted/50 dark:bg-card/30"
                      )}
                    >
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-muted dark:bg-card flex items-center justify-center text-xs font-bold shrink-0 text-foreground/90 dark:text-muted-foreground/50">
                            {patient.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground dark:text-foreground flex items-center gap-1.5">
                              <span>{patient.name}</span>
                              {isDone && (
                                <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[10px] px-1.5 py-0">
                                  Actioned
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <IdCell id={patient.id} /> • {patient.age} Yrs ({patient.gender})
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(patient.priority)}
                      </td>

                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-xs font-medium text-foreground dark:text-foreground/90 leading-snug">
                          {patient.reason}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                          <span>🏢 {patient.employer}</span>
                          <span>👨‍⚕️ {patient.physician}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-foreground/90 dark:text-muted-foreground/50 font-medium">
                        {patient.lastVisitText}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                        {patient.lastOutreachText}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5 text-xs font-semibold text-foreground/90 dark:text-muted-foreground/50 group-hover:text-primary transition-colors">
                          {patient.suggestedActionType === "sms" && <MessageSquare className="size-3.5 shrink-0" />}
                          {patient.suggestedActionType === "email" && <Mail className="size-3.5 shrink-0" />}
                          {patient.suggestedActionType === "call" && <Phone className="size-3.5 shrink-0" />}
                          {patient.suggestedActionType === "appt" && <Calendar className="size-3.5 shrink-0" />}
                          <span>{patient.suggestedAction}</span>
                          {isDone ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[10px] px-1.5 py-0 ml-1">
                              Done
                            </Badge>
                          ) : (
                            <ChevronRight className="size-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Basic Patient Detail Drawer (Drill-down) */}
      <Sheet open={Boolean(selectedPatient)} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col overflow-hidden bg-background">
          {selectedPatient && (
            <>
              <SheetHeader className="p-6 border-b border-border bg-muted/80 dark:bg-card/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <SheetTitle className="text-xl font-bold">
                        {selectedPatient.name}
                      </SheetTitle>
                      {getPriorityBadge(selectedPatient.priority)}
                    </div>
                    <SheetDescription className="text-xs flex items-center gap-2 text-muted-foreground">
                      <span>ID: {selectedPatient.id}</span>
                      <span>•</span>
                      <span>{selectedPatient.age} Yrs ({selectedPatient.gender})</span>
                    </SheetDescription>
                  </div>
                </div>

                {/* Demographics Strip */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-border/60">
                  <div className="flex items-center gap-2 text-foreground/90 dark:text-muted-foreground/50">
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{selectedPatient.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90 dark:text-muted-foreground/50">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span className="font-medium truncate">{selectedPatient.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90 dark:text-muted-foreground/50">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    <span className="font-medium truncate">{selectedPatient.employer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90 dark:text-muted-foreground/50">
                    <Stethoscope className="size-3.5 text-muted-foreground" />
                    <span className="font-medium truncate">{selectedPatient.physician}</span>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Recommended Action Box */}
                <Card className="rounded-xl border border-transparent ring-1 ring-primary/25 bg-primary/[0.04] p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <AlertCircle className="size-4" />
                      <span>Recommended Operational Action</span>
                    </div>
                    <Badge variant="outline" className="bg-white/80 dark:bg-black/50 text-xs">
                      Phase 1 Rule
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedPatient.suggestedAction}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Flag Reason:</strong> {selectedPatient.reason}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 font-semibold w-full shadow"
                onClick={() => handleTriggerAction(selectedPatient)}
                    >
                      <Send className="size-3.5 mr-2" /> Execute Action & Log Outreach
                    </Button>
                  </div>
                </Card>

                {/* Tabs for Drawer Details */}
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="inline-flex w-full bg-muted/40 p-1 rounded-lg border border-border/60 gap-1 mb-4">
                    <TabsTrigger
                      value="history"
                      className="flex-1 text-xs rounded-md py-1.5 font-semibold transition-all cursor-pointer text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border/60 data-[state=active]:shadow-2xs"
                    >
                      Outreach History
                    </TabsTrigger>
                    <TabsTrigger
                      value="encounters"
                      className="flex-1 text-xs rounded-md py-1.5 font-semibold transition-all cursor-pointer text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border/60 data-[state=active]:shadow-2xs"
                    >
                      Recent Visits ({selectedPatient.recentEncounters.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="history" className="pt-1 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Past Outreach & Touchpoints
                    </h4>
                    {selectedPatient.engagementHistory.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No prior touchpoints logged.</p>
                    ) : (
                      <div className="relative border-l-2 border-border pl-6 ml-3.5 space-y-5">
                        {selectedPatient.engagementHistory.map((ev) => (
                          <div key={ev.id} className="relative">
                            {/* Circle dot on the left line */}
                            <span className="absolute -left-[33px] top-1.5 flex size-4 items-center justify-center rounded-full bg-background border-2 border-primary">
                              <span className="size-1.5 rounded-full bg-primary" />
                            </span>
                            <div className="bg-muted/40 p-3 rounded-xl border border-border/50 text-xs space-y-1">
                              <div className="flex items-center justify-between font-semibold text-foreground">
                                <span>{ev.type} Outreach</span>
                                <span className="text-muted-foreground font-normal">{ev.date}</span>
                              </div>
                              <p className="text-muted-foreground">{ev.description}</p>
                              {ev.outcome && (
                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                                  Outcome: {ev.outcome}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="encounters" className="pt-1 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Completed DPC Appointments
                    </h4>
                    {selectedPatient.recentEncounters.length === 0 ? (
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="size-4" /> No Completed DPC Visits
                        </div>
                        <p>This patient has not completed a primary care visit since enrollment.</p>
                      </div>
                    ) : (
                      selectedPatient.recentEncounters.map((enc) => (
                        <div key={enc.id} className="p-3 rounded-xl border border-transparent bg-card shadow-sm text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span>{enc.type}</span>
                            <span className="text-muted-foreground font-normal">{enc.date}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">Provider: {enc.provider}</div>
                          <p className="text-foreground/90 dark:text-muted-foreground/50 bg-muted dark:bg-card p-2 rounded">
                            {enc.notes}
                          </p>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <SheetFooter className="p-4 border-t border-border bg-muted/50 dark:bg-card/50 flex flex-row justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                  Close Drawer
                </Button>
                <Button size="sm" onClick={() => handleTriggerAction(selectedPatient)}>
                  <CheckCircle2 className="size-3.5 mr-1.5" /> Mark Action Handled
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Detailed Metric Overlay Dialog */}
      <Dialog open={Boolean(selectedMetricOverlay)} onOpenChange={(open) => !open && setSelectedMetricOverlay(null)}>
        <DialogContent className="sm:max-w-2xl bg-background p-6 rounded-2xl shadow-xl border border-border">
          {selectedMetricOverlay && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCohortIconBox(selectedMetricOverlay.id)}
                    <div>
                      <DialogTitle className="text-xl font-bold text-foreground">
                        {selectedMetricOverlay.title} Metric Details
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                        {selectedMetricOverlay.description}
                      </DialogDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
                    {selectedMetricOverlay.count} Active Members
                  </Badge>
                </div>
              </DialogHeader>

              {/* Metric Summary Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border bg-muted/70 dark:bg-card/40 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">Current Volume</span>
                  <div className="text-2xl font-bold text-foreground tabular-nums">{selectedMetricOverlay.count}</div>
                  <span className="text-[10px] text-muted-foreground">Active in queue today</span>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/70 dark:bg-card/40 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">WoW Trend</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold text-foreground tabular-nums">{selectedMetricOverlay.wowChange}</span>
                    <Badge className={cn("text-[10px] px-1.5 py-0 border-none", selectedMetricOverlay.wowPositive ? "bg-emerald-500/15 text-emerald-600" : "bg-red-500/15 text-red-600")}>
                      {selectedMetricOverlay.wowPositive ? "Improving" : "Elevated"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Vs. previous 7 days</span>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/70 dark:bg-card/40 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">MoM Trend</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold text-foreground tabular-nums">{selectedMetricOverlay.momChange}</span>
                    <Badge className={cn("text-[10px] px-1.5 py-0 border-none", selectedMetricOverlay.momPositive ? "bg-emerald-500/15 text-emerald-600" : "bg-red-500/15 text-red-600")}>
                      {selectedMetricOverlay.momPositive ? "Improving" : "Elevated"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Vs. previous 30 days</span>
                </div>
              </div>

              {/* Graph Section with WoW / MoM Switcher */}
              <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Trend Trajectory</h4>
                    <p className="text-xs text-muted-foreground">Historical volume tracking against baseline target</p>
                  </div>

                  <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
                    <button
                      type="button"
                      onClick={() => setMetricGraphView("WoW")}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                        metricGraphView === "WoW"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      WoW Trend
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetricGraphView("MoM")}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                        metricGraphView === "MoM"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      MoM Trend
                    </button>
                  </div>
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getMetricGraphData(selectedMetricOverlay.count, metricGraphView, selectedMetricOverlay.wowPositive)}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.5rem",
                          fontSize: "0.75rem",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Active Members"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#metricGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="benchmark"
                        name="Target Threshold"
                        stroke="var(--muted-foreground)"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Actionable Footer Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground">
                  Ready to action these members?
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedMetricOverlay(null)}>
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveCohort(selectedMetricOverlay.id as CohortType);
                      if (selectedMetricOverlay.id !== "engagement-gap") setActiveGapTier("all");
                      setSelectedMetricOverlay(null);
                    }}
                  >
                    Filter Queue to {selectedMetricOverlay.title} ({selectedMetricOverlay.count})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
