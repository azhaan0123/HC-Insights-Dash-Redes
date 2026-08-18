import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  UserPlus,
  Clock,
  MessageSquareOff,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Check,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Send,
  UserCheck,
  Building2,
  Stethoscope,
  SlidersHorizontal,
  Info,
  AlertTriangle,
  ExternalLink,
} from "../lib/icons";
import { toast } from "sonner";
import { Page } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { IdCell, BoolBadge } from "../components/dashboard/cells";
import {
  ACTION_CENTRE_PATIENTS,
  COHORT_SUMMARIES,
  type ActionCentrePatientRow,
  type CohortType,
} from "../data/actionCentreData";
import { cn } from "../components/ui/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { utilizationGapsChips } from "../data/filters";
import { usePageLoading } from "../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../components/dashboard/SkeletonPrimitives";

const DIAGNOSIS_MAP: Record<string, string> = {
  "E78.5": "Hyperlipidemia, unspecified",
  "I10": "Essential (primary) hypertension",
  "E11.9": "Type 2 diabetes mellitus without complications",
  "E78.2": "Mixed hyperlipidemia",
  "J45.909": "Unspecified asthma, uncomplicated",
  "M54.5": "Low back pain",
  "E66.01": "Morbid (severe) obesity due to excess calories",
  "F41.1": "Generalized anxiety disorder",
  "J44.9": "Chronic obstructive pulmonary disease, unspecified",
  "K21.9": "Gastro-esophageal reflux disease without esophagitis",
  "E03.9": "Hypothyroidism, unspecified",
  "M19.90": "Unspecified osteoarthritis, unspecified site",
  "G43.909": "Migraine, unspecified, not intractable",
  "N18.3": "Chronic kidney disease, stage 3 (moderate)",
  "—": "No diagnosis provided",
};

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

const getDiagnosisDesc = (code: string) => DIAGNOSIS_MAP[code] || "General primary care screening / follow-up";

const getCohortIcon = (id: string) => {
  switch (id) {
    case "new-activation":
      return <UserPlus className="size-4 shrink-0 text-muted-foreground/70" />;
    case "engagement-gap":
      return <Clock className="size-4 shrink-0 text-muted-foreground/70" />;
    case "low-response":
      return <MessageSquareOff className="size-4 shrink-0 text-muted-foreground/70" />;
    case "external-leakage":
      return <ShieldAlert className="size-4 shrink-0 text-muted-foreground/70" />;
    default:
      return <Activity className="size-4 shrink-0 text-muted-foreground/70" />;
  }
};

export default function UtilizationGaps() {
  const navigate = useNavigate();
  const isLoading = usePageLoading();
  const [activeCohort, setActiveCohort] = useState<CohortType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("longest-inactive");
  const [selectedPatient, setSelectedPatient] = useState<ActionCentrePatientRow | null>(null);
  const [completedPatientIds, setCompletedPatientIds] = useState<Set<string>>(new Set());
  const [selectedMetricOverlay, setSelectedMetricOverlay] = useState<any | null>(null);
  const [metricGraphView, setMetricGraphView] = useState<"WoW" | "MoM">("WoW");

  // Multi-Step Outreach Action Workflow State
  const [actionStep, setActionStep] = useState<"overview" | "step1" | "step2" | "success">("overview");
  const [selectedChannel, setSelectedChannel] = useState<"sms" | "email" | "call">("sms");
  const [actionNote, setActionNote] = useState<string>("");
  const [assignedStaff] = useState<string>("Dr. Sarah Evans, MD (PCP)");
  const [outreachError, setOutreachError] = useState<string | null>(null);

  const openPatientDrawerWithStep = (
    patient: ActionCentrePatientRow,
    step: "overview" | "step1" | "step2" | "success" = "overview",
    channel?: "sms" | "email" | "call"
  ) => {
    setSelectedPatient(patient);
    setActionStep(step);
    setOutreachError(null);
    const ch = channel || (patient.suggestedActionType === "email" ? "email" : patient.suggestedActionType === "call" ? "call" : "sms");
    setSelectedChannel(ch);

    const isPhoneAvail = Boolean(patient.contactPhone && patient.contactPhone !== "Unavailable" && patient.contactPhone.replace(/\D/g, "") !== "");
    const isEmailAvail = Boolean(patient.contactEmail && patient.contactEmail !== "Unavailable" && patient.contactEmail.trim() !== "");

    if (ch === "email" && !isEmailAvail) {
      setOutreachError("email is unavailable please use other method for outreach");
    } else if ((ch === "sms" || ch === "call") && !isPhoneAvail) {
      setOutreachError("phone number is unavailable please use other method for outreach");
    }

    if (ch === "call") {
      setActionNote(`Phone Outreach for ${patient.name}: Review ${patient.condition} gap status and explain DPC $0 copay visits & lab work with ${patient.physician}.`);
    } else if (ch === "email") {
      setActionNote(`Subject: Care Coordination & DPC Check-in\n\nDear ${patient.name},\nWe noticed an open care gap regarding your ${patient.condition} care plan...`);
    } else {
      setActionNote(`SMS Outreach to ${patient.name}: Hi ${patient.name.split(" ")[0]}, your DPC care team noticed an open care gap for ${patient.condition}. Please reply to schedule your $0 copay check-in or lab work.`);
    }
  };

  const handleConfirmTwoStepAction = () => {
    if (!selectedPatient) return;

    const newTouchpoint = {
      id: `EV-${Date.now().toString().slice(-4)}`,
      type: selectedChannel === "sms" ? "SMS" : selectedChannel === "email" ? "Email" : "Call",
      date: "Just now",
      description: `${selectedPatient.suggestedAction} (${selectedChannel.toUpperCase()}) — ${actionNote.slice(0, 70)}...`,
      outcome: "Sent & Logged to Practice EHR",
    };

    selectedPatient.engagementHistory = [newTouchpoint, ...selectedPatient.engagementHistory];
    setCompletedPatientIds((prev) => new Set(prev).add(selectedPatient.id));

    toast.success(`Action Executed & Logged for ${selectedPatient.name}`, {
      description: `Outreach via ${selectedChannel.toUpperCase()} successfully logged to EHR.`,
    });

    setActionStep("success");
  };

  // Filter patients
  const filteredPatients = useMemo(() => {
    let list = ACTION_CENTRE_PATIENTS.filter((p) => p.cohort !== "external-leakage");

    if (activeCohort !== "all") {
      list = list.filter((p) => p.cohort === activeCohort);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reason.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q) ||
          p.physician.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
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
  }, [activeCohort, searchQuery, sortBy]);

  const handleTriggerAction = (patient: ActionCentrePatientRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast.success(`Action initiated for ${patient.name}`, {
      description: `${patient.suggestedAction} has been queued or logged successfully.`,
      action: {
        label: "Undo",
        onClick: () => { /* undo handler placeholder */ },
      },
    });
    setCompletedPatientIds((prev) => new Set(prev).add(patient.id));
  };

  if (isLoading) {
    return (
      <Page title="Utilization Gaps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <TableSkeleton rows={8} cols={5} />
      </Page>
    );
  }

  return (
    <Page
      title="Utilization Gaps"
      subtitle="Unified Operational Hub — Replace passive reporting with daily actionable work queues and care leakage prevention."
      chips={utilizationGapsChips}
      showFilters={true}
      showIconActions={false}
    >
      {/* 1. Engagement & Utilization Overview Metric Deck (Clean, No Icons) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Operational & Utilization Gap Summary
            </h2>
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <Info className="size-3.5 text-muted-foreground hover:text-primary transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                These cards synthesize patient engagement drop-offs, onboarding delays, and low response into actionable daily work queues.
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-xs text-muted-foreground">
            Click any card below to filter the patient work queue
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COHORT_SUMMARIES.filter((c) => c.id !== "external-leakage").map((card) => {
            const isSelected = activeCohort === card.id;
            const displayCount = card.id === "all" ? 98 : card.count;
            return (
              <Card
                key={card.id}
                onClick={() => setActiveCohort(card.id as any)}
                className={cn(
                  "cursor-pointer rounded-xl border transition-[box-shadow,transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden flex flex-col justify-between active:scale-[0.98]",
                  isSelected
                    ? "border-transparent ring-2 ring-primary bg-primary/[0.04] shadow-sm"
                    : "border-border/60 bg-card shadow-2xs hover:shadow-sm hover:border-border"
                )}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {getCohortIcon(card.id)}
                      <span className="text-sm leading-tight text-foreground/80 font-medium line-clamp-1">
                        {card.title}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-2xl font-medium tracking-tight tabular-nums text-foreground">
                        {displayCount}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tracking-tight",
                          card.wowPositive
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                        )}
                        title="Week over Week Change"
                      >
                        {card.wowPositive ? (
                          <ArrowDown className="size-3" />
                        ) : (
                          <ArrowUp className="size-3" />
                        )}
                        <span>{card.wowChange}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-border/40 text-[11px]">
                    <span className="text-muted-foreground truncate max-w-[110px]" title={card.description}>
                      {card.id === "all" ? "All Gaps" : "Engagement"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMetricOverlay(card);
                        setMetricGraphView("WoW");
                      }}
                      className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1 transition-colors"
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

      {/* 2. Actionable Patient Work Queue & Hybrid Table */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-2xs mb-6 overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/30 dark:bg-card/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>Patient Work Queue</span>
              <Badge variant="secondary" className="font-mono text-xs font-normal">
                {filteredPatients.length}
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">
              Surfacing members requiring timely primary care intervention or leakage redirection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, diagnosis, employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-lg border-border/80 bg-background"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[170px] h-9 text-xs rounded-lg border-border/80 bg-background">
                <SlidersHorizontal className="size-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Sort queue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="longest-inactive">Longest Inactive</SelectItem>
                <SelectItem value="last-visit">Recent Visit First</SelectItem>
                <SelectItem value="newest">Newest Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cohort Tabs Bar (Clean & Streamlined) */}
        <div className="px-4 py-3 border-b border-border/50 bg-background/50 overflow-x-auto">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
            {[
              { id: "all" as const, label: "All Attention", count: 98 },
              { id: "new-activation" as const, label: "New Activation", count: 28 },
              { id: "engagement-gap" as const, label: "Engagement Gap", count: 54 },
              { id: "low-response" as const, label: "Low Response", count: 16 },
            ].map((tab) => {
              const isSelected = activeCohort === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCohort(tab.id)}
                  className={cn(
                    "relative z-10 flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none",
                    isSelected
                      ? "text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="queueSwitchIndicator"
                      className="absolute inset-0 rounded-md bg-background border border-border/60 shadow-2xs z-[-1]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-semibold",
                      isSelected ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Clean Uncluttered Hybrid Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-5">Patient Member</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Gap Reason</th>
                <th className="py-3 px-4">Last Encounter</th>
                <th className="py-3 px-5 text-right">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="font-semibold text-foreground/90 dark:text-muted-foreground/50">
                      No patients pending in this queue!
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      All engagement and leakage opportunities for this criteria have been handled or none match search.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isDone = completedPatientIds.has(patient.id);
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => openPatientDrawerWithStep(patient, "overview")}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50 group",
                        isDone && "opacity-50 bg-muted/30"
                      )}
                    >
                      {/* Patient Member */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-secondary dark:bg-card border border-border/50 flex items-center justify-center text-xs font-bold shrink-0 text-foreground">
                            {patient.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="font-semibold text-foreground truncate flex items-center gap-1.5 text-sm">
                            <span>{patient.name}</span>
                            {isDone && (
                              <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[10px] px-1.5 py-0 font-normal">
                                Actioned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Diagnosis & Spruce Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4 text-xs font-medium text-foreground">
                              {patient.condition}
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[250px] text-xs">
                              {getDiagnosisDesc(patient.condition)}
                            </TooltipContent>
                          </Tooltip>
                          {patient.spruce && (
                            <span className="inline-flex items-center rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300">
                              Spruce
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Gap Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-xs font-medium text-foreground truncate" title={patient.reason}>
                          {patient.reason}
                        </div>
                      </td>

                      {/* Last Encounter */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        <div className="font-medium text-foreground">
                          {patient.lastVisitText}
                        </div>
                      </td>

                      {/* Suggested Action */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant={isDone ? "secondary" : "default"}
                            onClick={(e) => {
                              e.stopPropagation();
                              openPatientDrawerWithStep(patient, "step1");
                            }}
                            className="h-8 text-xs font-medium shadow-2xs gap-1.5 px-3 rounded-lg"
                          >
                            {patient.suggestedActionType === "sms" && <MessageSquare className="size-3.5 shrink-0" />}
                            {patient.suggestedActionType === "email" && <Mail className="size-3.5 shrink-0" />}
                            {patient.suggestedActionType === "call" && <Phone className="size-3.5 shrink-0" />}
                            {patient.suggestedActionType === "appt" && <Calendar className="size-3.5 shrink-0" />}
                            <span>{isDone ? "Done" : patient.suggestedAction}</span>
                          </Button>
                          <ChevronRight className="size-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
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

      {/* 4. Deep Patient Drill-down Drawer (Sheet) */}
      <Sheet open={Boolean(selectedPatient)} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col overflow-hidden bg-background">
          {selectedPatient && (
            <>
              <SheetHeader className="p-6 border-b border-border bg-muted/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <SheetTitle className="text-xl font-bold">
                        {selectedPatient.name}
                      </SheetTitle>
                    </div>
                    <SheetDescription className="text-xs flex items-center gap-2 text-muted-foreground">
                      <span>ID: {selectedPatient.id}</span>
                      <span>•</span>
                      <span>{selectedPatient.age}y ({selectedPatient.gender})</span>
                      <span>•</span>
                      <span>Spruce: <BoolBadge value={selectedPatient.spruce} /></span>
                    </SheetDescription>
                  </div>
                </div>

                {/* Demographics Strip */}
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-border/60">
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium">{selectedPatient.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">{selectedPatient.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">{selectedPatient.employer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Stethoscope className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">{selectedPatient.physician}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-foreground bg-background p-2.5 rounded-lg border border-border/60">
                    <Info className="size-3.5 text-primary shrink-0" />
                    <span className="font-semibold">Diagnosis ({selectedPatient.condition}):</span>
                    <span className="text-muted-foreground">{getDiagnosisDesc(selectedPatient.condition)}</span>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Multi-Step Outreach Action & Execution Section */}
                <Card className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                      <AlertCircle className="size-4 text-primary shrink-0" />
                      <span>Recommended Outreach Action</span>
                    </div>
                    {actionStep !== "overview" && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                        {actionStep === "step1" ? "Step 1 of 2: Configure" : actionStep === "step2" ? "Step 2 of 2: Confirm" : "Completed ✓"}
                      </Badge>
                    )}
                  </div>

                  {/* STATE 1: OVERVIEW */}
                  {actionStep === "overview" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/60">
                        <div>
                          <span className="text-sm font-bold text-foreground block">{selectedPatient.suggestedAction}</span>
                          <span className="text-xs text-muted-foreground">Reason: {selectedPatient.reason}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase bg-background">
                          {selectedPatient.suggestedActionType}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          Initiate secure two-step outreach for this care gap.
                        </span>
                        <Button
                          size="sm"
                          onClick={() => openPatientDrawerWithStep(selectedPatient, "step1", "sms")}
                          className="h-8 text-xs font-bold gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <span>Initiate Action (Step 1 of 2)</span>
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STATE 2: STEP 1 (CONFIGURE & REVIEW) */}
                  {actionStep === "step1" && (() => {
                    const isPhoneAvail = Boolean(selectedPatient.contactPhone && selectedPatient.contactPhone !== "Unavailable" && selectedPatient.contactPhone.replace(/\D/g, "") !== "");
                    const isEmailAvail = Boolean(selectedPatient.contactEmail && selectedPatient.contactEmail !== "Unavailable" && selectedPatient.contactEmail.trim() !== "");

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-primary">
                          <span>Select Channel & Customize Message</span>
                        </div>

                        {/* Red Error Banner when unavailable contact method is clicked */}
                        {outreachError && (
                          <div className="bg-destructive/10 border-2 border-destructive text-destructive p-3 rounded-lg flex items-center justify-between gap-3 text-xs font-semibold shadow-sm animate-in fade-in duration-150">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="size-4 text-destructive shrink-0" />
                              <span>{outreachError}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setOutreachError(null)}
                              className="h-7 text-xs font-bold bg-background text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 cursor-pointer"
                            >
                              Clear
                            </Button>
                          </div>
                        )}

                        <div className={cn("space-y-4 transition-all duration-200", outreachError && "opacity-40 pointer-events-none select-none")}>
                          {/* Channel Selector Pills */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-muted-foreground tracking-wider mb-2">
                              Outreach Channel
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: "call" as const, label: "Phone Call", icon: Phone },
                                { id: "email" as const, label: "Secure Email", icon: Mail },
                                { id: "sms" as const, label: "Direct SMS", icon: MessageSquare },
                              ].map((ch) => {
                                const Icon = ch.icon;
                                const isSelected = selectedChannel === ch.id;
                                const isOptionDisabled = ch.id === "email" ? !isEmailAvail : !isPhoneAvail;

                                return (
                                  <button
                                    key={ch.id}
                                    type="button"
                                    onClick={() => {
                                      if (isOptionDisabled) {
                                        const missingType = ch.id === "email" ? "email" : "phone number";
                                        setOutreachError(`${missingType} is unavailable please use other method for outreach`);
                                        return;
                                      }
                                      setOutreachError(null);
                                      setSelectedChannel(ch.id);
                                      if (ch.id === "call") {
                                        setActionNote(`Phone Outreach for ${selectedPatient.name}: Review ${selectedPatient.condition} gap status and explain DPC $0 copay visits & lab work with ${selectedPatient.physician}.`);
                                      } else if (ch.id === "email") {
                                        setActionNote(`Subject: Care Coordination & DPC Check-in\n\nDear ${selectedPatient.name},\nWe noticed an open care gap regarding your ${selectedPatient.condition} care plan...`);
                                      } else {
                                        setActionNote(`SMS Outreach to ${selectedPatient.name}: Hi ${selectedPatient.name.split(" ")[0]}, your DPC care team noticed an open care gap for ${selectedPatient.condition}. Please reply to schedule your $0 copay check-in or lab work.`);
                                      }
                                    }}
                                    className={cn(
                                      "p-2.5 rounded-lg border text-left flex flex-col gap-1.5 transition-all text-xs font-semibold cursor-pointer",
                                      isOptionDisabled
                                        ? "border-dashed border-border/80 bg-muted/50 text-muted-foreground opacity-60 cursor-not-allowed"
                                        : isSelected
                                        ? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/30"
                                        : "border-border bg-card text-foreground hover:bg-muted/40"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <Icon className={cn("size-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                                      {isOptionDisabled && (
                                        <span className="text-[9px] font-bold uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                          Unavailable
                                        </span>
                                      )}
                                      {isSelected && !isOptionDisabled && <span className="size-2 rounded-full bg-primary" />}
                                    </div>
                                    <span className="truncate">{ch.label}</span>
                                    {isOptionDisabled && (
                                      <span className="text-[10px] font-normal text-muted-foreground">
                                        {ch.id === "email" ? "No Email ID" : "No Phone #"}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Editable Message / Note */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-muted-foreground tracking-wider mb-1.5">
                              {selectedChannel === "sms" ? "Secure SMS Preview (Editable)" : selectedChannel === "call" ? "Call Script / Clinical Note" : "Email Draft (Editable)"}
                            </label>
                            <textarea
                              rows={3}
                              value={actionNote}
                              onChange={(e) => setActionNote(e.target.value)}
                              className="w-full text-xs text-foreground p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
                            />
                          </div>

                          {/* Step 1 Action Bar */}
                          <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActionStep("overview")}
                              className="h-8 text-xs font-medium cursor-pointer"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setActionStep("step2")}
                              className="h-8 text-xs font-bold gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <span>Proceed to Final Review (Step 2)</span>
                              <ArrowRight className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* STATE 3: STEP 2 (FINAL REVIEW & CONFIRMATION) */}
                  {actionStep === "step2" && (
                    <div className="space-y-3.5 bg-amber-500/5 dark:bg-amber-500/10 border-2 border-amber-500/40 rounded-xl p-4 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                          <ShieldAlert className="size-4" />
                          <span>Final Confirmation & Execution</span>
                        </div>
                      </div>

                      <div className="bg-background rounded-lg border border-amber-500/30 p-3 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground font-semibold">Patient:</span>
                          <span className="font-bold text-foreground">{selectedPatient.name} ({selectedPatient.id})</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground font-semibold">Action & Channel:</span>
                          <span className="font-bold text-primary">{selectedPatient.suggestedAction} via {selectedChannel.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground font-semibold">Assigned Care Staff:</span>
                          <span className="font-semibold text-foreground">{assignedStaff}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold block mb-1">Logged Note Preview:</span>
                          <div className="bg-muted/50 p-2 rounded text-[11px] font-mono text-foreground border border-border/60 max-h-[70px] overflow-y-auto">
                            {actionNote}
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-normal flex items-start gap-1.5">
                        <span className="text-base leading-none">ℹ️</span>
                        <span>Confirming will queue this outreach in the practice EHR, dispatch the communication via {selectedChannel.toUpperCase()}, and log a touchpoint timestamp in the patient history.</span>
                      </p>

                      {/* Step 2 Action Bar */}
                      <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActionStep("step1")}
                          className="h-8 text-xs font-semibold gap-1 cursor-pointer"
                        >
                          <ArrowLeft className="size-3.5" />
                          <span>Back to Edit (Step 1)</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmTwoStepAction()}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm animate-pulse cursor-pointer"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>Confirm & Log Action (Complete Step 2)</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STATE 4: SUCCESS */}
                  {actionStep === "success" && (
                    <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-4 space-y-3 text-emerald-800 dark:text-emerald-300 shadow-sm animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Check className="size-5 text-white bg-emerald-600 rounded-full p-0.5 shrink-0" />
                        <span>Outreach Action Successfully Executed & Logged!</span>
                      </div>
                      <p className="text-xs leading-relaxed bg-background/90 p-2.5 rounded-lg border border-emerald-500/30 font-medium text-foreground">
                        Touchpoint recorded for <strong>{selectedPatient.name}</strong> (`{selectedPatient.id}`) via <strong>{selectedChannel.toUpperCase()}</strong>. Practice task created for {assignedStaff.split(" ")[0]}.
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/30">
                        <button
                          type="button"
                          onClick={() => setActionStep("overview")}
                          className="text-xs font-bold underline hover:text-emerald-900 cursor-pointer"
                        >
                          View Updated History Below ↓
                        </button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedPatient(null)}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          Done & Close Drawer
                        </Button>
                      </div>
                    </div>
                  )}
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
                      DPC Visits ({selectedPatient.recentEncounters.length})
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
                        <div key={enc.id} className="p-3 rounded-xl border border-border/50 bg-card text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span>{enc.type}</span>
                            <span className="text-muted-foreground font-normal">{enc.date}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">Provider: {enc.provider}</div>
                          <p className="text-muted-foreground bg-muted/40 p-2 rounded-lg">
                            {enc.notes}
                          </p>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <SheetFooter className="p-4 border-t border-border bg-muted/30 flex flex-row justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  DPC Operational Work Queue • Phase 1
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedPatient(null)} className="rounded-lg cursor-pointer">
                    Close Drawer
                  </Button>
                  {actionStep === "overview" && (
                    <Button size="sm" onClick={() => openPatientDrawerWithStep(selectedPatient, "step1")} className="rounded-lg font-semibold gap-1 cursor-pointer">
                      <span>Initiate 2-Step Action →</span>
                    </Button>
                  )}
                  {actionStep === "step1" && (
                    <Button size="sm" onClick={() => setActionStep("step2")} className="rounded-lg font-semibold gap-1 cursor-pointer">
                      <span>Proceed to Step 2 →</span>
                    </Button>
                  )}
                  {actionStep === "step2" && (
                    <Button size="sm" onClick={() => handleConfirmTwoStepAction()} className="rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer">
                      <CheckCircle2 className="size-3.5" />
                      <span>Confirm & Log Action</span>
                    </Button>
                  )}
                  {actionStep === "success" && (
                    <Button size="sm" variant="secondary" onClick={() => setActionStep("overview")} className="rounded-lg font-semibold cursor-pointer">
                      Return to Overview
                    </Button>
                  )}
                </div>
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
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getCohortIcon(selectedMetricOverlay.id)}
                    </div>
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
                  <div className="text-2xl font-medium text-foreground tabular-nums">{selectedMetricOverlay.count}</div>
                  <span className="text-[10px] text-muted-foreground">Active in queue today</span>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/70 dark:bg-card/40 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">WoW Trend</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-medium text-foreground tabular-nums">{selectedMetricOverlay.wowChange}</span>
                    <Badge className={cn("text-[10px] px-1.5 py-0 border-none", selectedMetricOverlay.wowPositive ? "bg-emerald-500/15 text-emerald-600" : "bg-red-500/15 text-red-600")}>
                      {selectedMetricOverlay.wowPositive ? "Improving" : "Elevated"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Vs. previous 7 days</span>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/70 dark:bg-card/40 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">MoM Trend</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-medium text-foreground tabular-nums">{selectedMetricOverlay.momChange}</span>
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
                          ? "bg-primary text-primary-foreground shadow-2xs"
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
                          ? "bg-primary text-primary-foreground shadow-2xs"
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
                      <RechartsTooltip
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
