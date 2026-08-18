import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import {
  Search,
  User,
  AlertTriangle,
  Stethoscope,
  MessageSquare,
  Building2,
  Activity,
  X,
  ChevronRight,
  Info,
} from "../lib/icons";
import { Page } from "../components/layout/Page";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";
import { BoolBadge, IdCell } from "../components/dashboard/cells";
import { TableSkeleton } from "../components/dashboard/SkeletonPrimitives";
import {
  ACTION_CENTRE_PATIENTS,
  searchActionCentrePatients,
  type ActionCentrePatientRow,
} from "../data/actionCentreData";
import { PatientSearchDetailSheet } from "./PatientSearchDetailSheet";

// ─── Engagement source color map ────────────────────────────────────────────
const SOURCE_BADGE: Record<string, string> = {
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function PatientSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Pre-populate search from the URL ?q= param (wired from AppShell top-bar)
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [committedQuery, setCommittedQuery] = useState(searchParams.get("q") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ActionCentrePatientRow | null>(null);

  // Simulate async search loading state
  useEffect(() => {
    if (!committedQuery.trim()) return;
    setIsSearching(true);
    const t = setTimeout(() => setIsSearching(false), 400);
    return () => clearTimeout(t);
  }, [committedQuery]);

  // Commit search on Enter or clicking the search button
  const handleSearch = useCallback(() => {
    const q = inputValue.trim();
    setCommittedQuery(q);
    if (q) {
      setSearchParams({ q }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [inputValue, setSearchParams]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setInputValue("");
      setCommittedQuery("");
      setSearchParams({}, { replace: true });
    }
  };

  const clearSearch = () => {
    setInputValue("");
    setCommittedQuery("");
    setSearchParams({}, { replace: true });
  };

  /**
   * Search results — applies DCMP-3616 deduplication rules:
   *   1. Deduplicates by patient id (never two rows for the same patient).
   *   2. Uses OR semantics: matches by name OR patient ID.
   *   3. Never applies inactivity date filters (those are for the work queue,
   *      not the lookup tool). A patient is a valid result even if they have a
   *      recent encounter — because search is not a gap-detection tool.
   *
   * In production: replace searchActionCentrePatients() with dbService.searchPatients()
   * which uses the LATERAL join / DISTINCT ON dedup pattern from the DCMP-3616 fix.
   */
  const results = useMemo<ActionCentrePatientRow[]>(() => {
    return searchActionCentrePatients(committedQuery);
  }, [committedQuery]);

  const hasQuery = committedQuery.trim().length > 0;
  const hasResults = results.length > 0;

  // Count patients flagged for duplicate records (for summary display)
  const duplicateCount = results.filter((p) => {
    // In mock data there are no real duplicates; in production this comes
    // from hasDuplicateFlag on the PatientSearchResult row.
    return false;
  }).length;

  return (
    <Page
      title="Patient Search"
      subtitle="Search for an individual patient by name or patient ID."
      showFilters={false}
      showIconActions={false}
    >
      {/* ── Dedup Context Info Bar ── */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
        <Info className="size-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <p className="text-[12px] text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>Deduplication active (DCMP-3616):</strong> Results are deduplicated by patient ID —
          each patient appears at most once. Duplicate or orphaned linked records are flagged with{" "}
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0 text-[10px] font-bold text-amber-700">
            <AlertTriangle className="size-2.5" /> Duplicates
          </span>{" "}
          so an admin can resolve them. Search is not filtered by last encounter or message date.
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div
        id="patient-search-bar"
        className="relative flex items-center gap-3 rounded-2xl border border-border bg-card shadow-sm px-4 py-3 mb-6 transition-shadow focus-within:shadow-md focus-within:border-primary/40"
      >
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <Input
          id="patient-search-input"
          type="text"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by patient name or patient ID (e.g. 'John Smith' or 'HC-003421')…"
          className="border-0 shadow-none bg-transparent p-0 h-auto text-[15px] font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0"
        />
        {inputValue && (
          <button
            id="patient-search-clear"
            onClick={clearSearch}
            className="size-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
        <Button
          id="patient-search-submit"
          onClick={handleSearch}
          size="sm"
          className="rounded-xl shrink-0"
        >
          Search
        </Button>
      </div>

      {/* ── Results ── */}
      {!hasQuery && (
        <EmptyState />
      )}

      {hasQuery && isSearching && (
        <TableSkeleton cols={6} rows={5} />
      )}

      {hasQuery && !isSearching && !hasResults && (
        <NoResultsState query={committedQuery} />
      )}

      {hasQuery && !isSearching && hasResults && (
        <>
          {/* Summary bar */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span> patient{results.length !== 1 ? "s" : ""} found
              {duplicateCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <AlertTriangle className="size-3" />
                  {duplicateCount} with duplicate records
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground/60">
              Deduplicated by patient ID · {results.length} unique records
            </p>
          </div>

          {/* Results Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Conditions</th>
                    <th className="px-4 py-3">Engagement Source</th>
                    <th className="px-4 py-3">Last Encounter</th>
                    <th className="px-4 py-3">Last Message</th>
                    <th className="px-4 py-3">Spruce</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {results.map((patient) => {
                    const source = getEngagementSource(patient);
                    const sourceBadgeClass = SOURCE_BADGE[source] || "bg-secondary text-secondary-foreground border-border";
                    // hasDuplicateFlag: in production this comes from the LATERAL join query (DCMP-3616).
                    // In mock data, no duplicates exist; this is a stub for the production pattern.
                    const hasDuplicateFlag = false;

                    return (
                      <tr
                        key={patient.id}
                        id={`patient-search-row-${patient.id}`}
                        className="group hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        {/* Patient Name + ID */}
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2.5">
                            <div className="size-7 shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                              <User className="size-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{patient.name}</span>
                                {hasDuplicateFlag && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-400">
                                    <AlertTriangle className="size-2.5" />
                                    Duplicate
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <IdCell id={patient.id} />
                                <span className="text-[11px] text-muted-foreground">
                                  {patient.age}y {patient.gender}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Conditions */}
                        <td className="px-4 py-3">
                          {patient.condition && patient.condition !== "—" ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                                {patient.condition}
                              </span>
                              <p className="text-[11px] text-muted-foreground line-clamp-1">{patient.reason}</p>
                            </div>
                          ) : (
                            <span className="text-[12px] text-muted-foreground/50 italic">No conditions</span>
                          )}
                        </td>

                        {/* Engagement Source */}
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", sourceBadgeClass)}>
                            {source}
                          </span>
                        </td>

                        {/* Last Encounter Date */}
                        <td className="px-4 py-3">
                          {patient.lastVisitDaysAgo !== null ? (
                            <div className="flex items-center gap-1.5">
                              <Stethoscope className={cn("size-3.5 shrink-0",
                                patient.lastVisitDaysAgo >= 90 ? "text-amber-500" : "text-primary/60"
                              )} />
                              <span className={cn("text-[12px]",
                                patient.lastVisitDaysAgo >= 90 ? "font-semibold text-amber-700 dark:text-amber-400" : "text-foreground"
                              )}>
                                {patient.lastVisitText}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-muted-foreground/50 italic">No visits</span>
                          )}
                        </td>

                        {/* Last Message Date */}
                        <td className="px-4 py-3">
                          {patient.lastOutreachText ? (
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="size-3.5 shrink-0 text-emerald-600/60" />
                              <span className="text-[12px] text-foreground">{patient.lastOutreachText}</span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-muted-foreground/50 italic">No messages</span>
                          )}
                        </td>

                        {/* Spruce Status */}
                        <td className="px-4 py-3">
                          <BoolBadge value={patient.spruce} />
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 text-right">
                          <button
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-foreground shadow-xs hover:bg-muted/50 group-hover:border-primary/40 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}
                          >
                            View
                            <ChevronRight className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-muted-foreground/50">
            Search results are deduplicated by patient ID (DCMP-3616). Results include all patients
            regardless of last encounter or message date — search is a lookup tool, not a gap filter.
          </p>
        </>
      )}

      {/* ── Patient Detail Sheet ── */}
      <PatientSearchDetailSheet
        open={selectedPatient !== null}
        onOpenChange={(open) => { if (!open) setSelectedPatient(null); }}
        patient={selectedPatient}
        hasDuplicateFlag={false} // Set to true when DCMP-3616 hasDuplicateFlag is true
      />
    </Page>
  );
}

// ─── Empty / No-Results States ───────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Search className="size-8 text-primary/60" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">Search for a Patient</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          Enter a patient name or patient ID above and press Enter (or click Search)
          to find individual patient records.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 max-w-xl w-full">
        {[
          { icon: <User className="size-4" />, label: "Search by Name", example: "e.g. 'Jane Doe'" },
          { icon: <Activity className="size-4" />, label: "Search by Patient ID", example: "e.g. 'HC-003421'" },
          { icon: <Building2 className="size-4" />, label: "Search by Employer", example: "e.g. 'Acme Corp'" },
        ].map((tip) => (
          <div key={tip.label} className="rounded-xl border border-border bg-muted/30 p-3 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-primary">
              {tip.icon}
              <span className="text-[12px] font-semibold text-foreground">{tip.label}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{tip.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
      <div className="size-14 rounded-2xl bg-muted/50 flex items-center justify-center">
        <Search className="size-7 text-muted-foreground/60" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">No patients found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No results for <strong>&ldquo;{query}&rdquo;</strong>. Try a different name or patient ID.
        </p>
      </div>
      <p className="text-[11px] text-muted-foreground/60 max-w-sm">
        Search is not filtered by last encounter or message date — all active patients
        are included regardless of their activity level.
      </p>
    </div>
  );
}
