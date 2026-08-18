import {
  User,
  Activity,
  Stethoscope,
  MessageSquare,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
} from "../lib/icons";
import {
  Sheet,
  SheetContent,
  SheetFooter,
} from "../components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BoolBadge } from "../components/dashboard/cells";
import { cn } from "../components/ui/utils";
import type { ActionCentrePatientRow } from "../data/actionCentreData";

type PatientSearchDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: ActionCentrePatientRow | null;
  /**
   * True if this patient has orphaned/deleted linked patient records.
   * Surfaces the DCMP-3616 deduplication context — a warning banner is shown
   * so admins know a canonical record was selected from multiple linked records.
   */
  hasDuplicateFlag?: boolean;
};

const ENGAGEMENT_SOURCE_COLORS: Record<string, string> = {
  "Elation EHR": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
  "Hint Core": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
  "Spruce Health": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  "Claims Feed": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30",
};

function getEngagementSource(patient: ActionCentrePatientRow): string {
  if (patient.spruce === "Yes") return "Spruce Health";
  if (patient.condition && patient.condition !== "—") return "Elation EHR";
  return "Hint Core";
}

function getLastEncounterDisplay(patient: ActionCentrePatientRow): string {
  if (patient.lastVisitDaysAgo === null) return "No encounters on record";
  return patient.lastVisitText;
}

function getLastMessageDisplay(patient: ActionCentrePatientRow): string {
  if (!patient.lastOutreachText || patient.lastOutreachText === "—") return "No messages on record";
  return patient.lastOutreachText;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-x-2 items-start text-[13px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground break-words">{children}</span>
    </div>
  );
}

export function PatientSearchDetailSheet({
  open,
  onOpenChange,
  patient,
  hasDuplicateFlag = false,
}: PatientSearchDetailSheetProps) {
  if (!patient) return null;

  const engagementSource = getEngagementSource(patient);
  const sourceColorClass = ENGAGEMENT_SOURCE_COLORS[engagementSource] || "bg-secondary text-secondary-foreground border-border";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[500px] sm:max-w-[500px] p-0 overflow-y-auto bg-card text-card-foreground border-l border-border shadow-2xl flex flex-col">

        {/* ── Header ── */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground leading-tight">
                  {patient.name}
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  ID: <span className="font-mono">{patient.id}</span>
                  {" · "}{patient.age} yrs {patient.gender === "M" ? "Male" : "Female"}
                </p>
              </div>
            </div>
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0", sourceColorClass)}>
              {engagementSource}
            </span>
          </div>

          {/* Duplicate Flag Warning (DCMP-3616) */}
          {hasDuplicateFlag && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-[12px] text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0 mt-px" />
              <div>
                <span className="font-semibold">Duplicate Record Detected</span>
                <p className="text-[11px] mt-0.5 opacity-80">
                  This patient has orphaned or deleted linked records. The active canonical
                  record is displayed. An admin should review and resolve the duplicates.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-3 mx-5 mt-4 mb-0 rounded-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="encounters">Encounters</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="px-5 pt-4 pb-6 space-y-4">
              {/* Last Encounter / Last Message quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Last Encounter",
                    value: getLastEncounterDisplay(patient),
                    icon: <Stethoscope className="size-3.5 text-primary" />,
                    warn: patient.lastVisitDaysAgo !== null && patient.lastVisitDaysAgo >= 90,
                  },
                  {
                    label: "Last Message",
                    value: getLastMessageDisplay(patient),
                    icon: <MessageSquare className="size-3.5 text-emerald-600" />,
                    warn: false,
                  },
                ].map((s) => (
                  <div key={s.label} className={cn(
                    "rounded-xl border p-3 space-y-1",
                    s.warn ? "border-amber-500/40 bg-amber-500/5" : "border-border bg-muted/30"
                  )}>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                      {s.icon}{s.label}
                    </div>
                    <p className={cn("text-[13px] font-semibold", s.warn && "text-amber-700 dark:text-amber-400")}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Patient Details */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Activity className="size-4 text-primary" />
                  Patient Details
                </h3>
                <div className="space-y-2.5">
                  <InfoRow label="Employer">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="size-3 text-muted-foreground/60" />
                      {patient.employer || "—"}
                    </span>
                  </InfoRow>
                  <InfoRow label="Physician">{patient.physician || "—"}</InfoRow>
                  <InfoRow label="Phone">
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3 text-muted-foreground/60" />
                      {patient.contactPhone || "—"}
                    </span>
                  </InfoRow>
                  <InfoRow label="Email">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3 text-muted-foreground/60" />
                      {patient.contactEmail || "—"}
                    </span>
                  </InfoRow>
                  <InfoRow label="Priority">
                    <Badge className={cn("text-[10px] px-2 py-0 border font-semibold",
                      patient.priority === "High" ? "bg-red-500/10 text-red-600 border-red-500/30"
                      : patient.priority === "Medium" ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                      : "bg-sky-500/10 text-sky-700 border-sky-500/30"
                    )}>
                      {patient.priority}
                    </Badge>
                  </InfoRow>
                  <InfoRow label="Cohort">
                    {patient.cohort.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </InfoRow>
                  {patient.gapTier && (
                    <InfoRow label="Gap Tier">{patient.gapTier}</InfoRow>
                  )}
                </div>
              </div>

              {/* Conditions (ICD-10 from Elation EHR) */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Stethoscope className="size-4 text-primary" />
                  Conditions
                </h3>
                {patient.condition && patient.condition !== "—" ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-foreground">
                        {patient.condition}
                      </span>
                      <span className="text-[11px] text-muted-foreground">ICD-10 · Elation EHR</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{patient.reason}</p>
                  </div>
                ) : (
                  <p className="text-[13px] text-muted-foreground/70">No conditions on record.</p>
                )}
              </div>

              {/* Engagement Source */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MessageSquare className="size-4 text-primary" />
                  Engagement
                </h3>
                <div className="space-y-2.5">
                  <InfoRow label="Source System">
                    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", sourceColorClass)}>
                      {engagementSource}
                    </span>
                  </InfoRow>
                  <InfoRow label="Spruce Enrolled">
                    <BoolBadge value={patient.spruce} />
                  </InfoRow>
                  <InfoRow label="Last Encounter">{getLastEncounterDisplay(patient)}</InfoRow>
                  <InfoRow label="Last Message">{getLastMessageDisplay(patient)}</InfoRow>
                </div>
              </div>
            </TabsContent>

            {/* Encounters */}
            <TabsContent value="encounters" className="px-5 pt-4 pb-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent DPC Encounters
              </h4>
              {patient.recentEncounters.length === 0 ? (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="size-4" />
                    No Completed DPC Visits
                  </div>
                  <p>This patient has no primary care encounter history since enrollment.</p>
                </div>
              ) : (
                patient.recentEncounters.map((enc) => (
                  <div key={enc.id} className="p-3 rounded-xl border border-border/50 bg-card text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>{enc.type}</span>
                      <span className="text-muted-foreground font-normal">{enc.date}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Provider: {enc.provider}</div>
                    <p className="text-muted-foreground bg-muted/40 p-2 rounded-lg">{enc.notes}</p>
                  </div>
                ))
              )}
              <p className="text-[11px] text-muted-foreground/60 italic">
                Encounter data from Elation EHR. Last encounter: {getLastEncounterDisplay(patient)}.
              </p>
            </TabsContent>

            {/* Engagement / Outreach */}
            <TabsContent value="engagement" className="px-5 pt-4 pb-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Outreach &amp; Communication History
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground">Primary Source</div>
                  <div className={cn("mt-1 text-[11px] font-semibold rounded-full px-2 py-0.5 border inline-block", sourceColorClass)}>
                    {engagementSource}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground">Spruce Account</div>
                  <div className="mt-1">
                    <BoolBadge value={patient.spruce} />
                  </div>
                </div>
              </div>

              {patient.engagementHistory.length === 0 ? (
                <p className="text-[13px] text-muted-foreground/70">No outreach history available.</p>
              ) : (
                <div className="space-y-2">
                  {patient.engagementHistory.map((ev) => (
                    <div key={ev.id} className="p-3 rounded-xl border border-border/50 bg-card text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border",
                            ev.type === "SMS" ? "bg-green-500/10 text-green-700 border-green-500/20"
                              : ev.type === "Email" ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                              : "bg-purple-500/10 text-purple-700 border-purple-500/20"
                          )}>
                            {ev.type}
                          </span>
                          <span className="text-muted-foreground">{ev.date}</span>
                        </div>
                        {ev.outcome && (
                          <span className="text-[10px] text-muted-foreground/70">{ev.outcome}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{ev.description}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground/60 italic">
                Last message: {getLastMessageDisplay(patient)}. Messages from Spruce Health.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Footer ── */}
        <SheetFooter className="p-4 border-t border-border bg-muted/30 flex flex-row justify-between items-center">
          <span className="text-xs text-muted-foreground">Patient Search · DCMP-3618</span>
          <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
