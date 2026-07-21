import { useState } from "react";
import { Layers, PlayCircle, History, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Page } from "../../components/layout/Page";
import { hccChips } from "../../data/filters";
import { PATIENT_DATA, PatientRow } from "../../data/patients";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

type FindingType = "Gap" | "Compliance" | "Overcode";

type AuditResultRow = {
  id: string;
  patient: PatientRow;
  findingType: FindingType;
  description: string;
  aiRationale: {
    rationale: string;
    recommendation: string;
  };
};

type AuditResultData = {
  id: string;
  timestamp: string;
  criteria: string;
  patientsAudited: number;
  potentialGaps: number;
  potentialCompliance: number;
  findings: AuditResultRow[];
};

export default function HccBulkAudit() {
  const isLoading = usePageLoading();


  const [criteria, setCriteria] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResultData | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const startAudit = () => {
    if (!criteria.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setShowError(false);
    setIsAuditing(true);
    setAuditResult(null);
    setShowSuccessToast(false);

    // Simulate audit processing time
    setTimeout(() => {
      // Strip punctuation and split
      const lowerCriteria = criteria.toLowerCase().replace(/[,.><]/g, ' ');
      const criteriaTerms = lowerCriteria.split(/\s+/).filter(t => t.trim().length > 0);

      // Simple mock filter: check if any term matches any field in the patient row
      const matchedPatients = PATIENT_DATA.filter((p) => {
        const searchableString = `
          ${p.name.toLowerCase()} 
          ${p.mrn.toLowerCase()} 
          ${p.suspectedHccText.toLowerCase()} 
          ${p.classification.toLowerCase()} 
          year ${p.year} 
          age ${p.age} 
          gender ${p.gender.toLowerCase()}
        `;
        // Match if ALL terms are found
        return criteriaTerms.every(term => searchableString.includes(term));
      });

      // Generate findings for matched patients
      let gapCount = 0;
      let complianceCount = 0;
      
      const findings: AuditResultRow[] = matchedPatients.map((p) => {
        const isGap = Math.random() > 0.4; // 60% chance of being a gap
        if (isGap) gapCount++;
        else complianceCount++;

        return {
          id: `fnd_${p.id}`,
          patient: p,
          findingType: isGap ? "Gap" : "Compliance",
          description: isGap 
            ? `Documented condition potentially missing specific code link.`
            : `Condition accurately coded to highest specificity.`,
          aiRationale: {
            rationale: isGap
              ? `Patient has indicators for ${p.suspectedHccText} in recent notes, but the specific ICD-10 code is absent or lacks specificity in the current encounter.`
              : `Documentation thoroughly supports the coded condition with no ambiguity.`,
            recommendation: isGap
              ? `Review chart for clinical correlation. Query physician for linkage if supported.`
              : `No changes recommended at this time.`
          }
        };
      });

      const now = new Date();
      setAuditResult({
        id: `AUDIT_${now.getTime()}`,
        timestamp: now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
        criteria: criteria,
        patientsAudited: matchedPatients.length,
        potentialGaps: gapCount,
        potentialCompliance: complianceCount,
        findings,
      });

      setIsAuditing(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 1500);
  };

  const columns: Column<AuditResultRow>[] = [
    {
      key: "patient",
      header: "Patient",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.patient.name}</span>
          <span className="text-[13px] text-muted-foreground/70">{row.patient.mrn}</span>
        </div>
      ),
    },
    {
      key: "findingType",
      header: "Finding Type",
      cell: (row) => (
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          row.findingType === "Gap" 
            ? "bg-primary/15 text-primary" 
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {row.findingType}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => <span className="text-[13px] text-muted-foreground">{row.description}</span>,
    },
    {
      key: "rationale",
      header: "AI Rationale & Recommendation",
      cell: (row) => (
        <RationaleCell 
          rationale={row.aiRationale.rationale} 
          recommendation={row.aiRationale.recommendation} 
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <Page title="Bulk Audit" crumbs={[{ label: "HCC Insights" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Bulk HCC Audit" crumbs={[{ label: "HCC Insights" }]} chips={hccChips}>
      <div className="relative h-full min-h-[500px] space-y-6">
        
        {/* Intro Message */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="size-4 text-primary" />
          <span className="font-semibold text-foreground">Bulk HCC Audit</span>
          <span className="mx-1 text-muted-foreground/50">|</span>
          <span>Define criteria to audit patient cohorts for HCC coding accuracy, completeness, and compliance.</span>
        </div>

        {/* Input Card */}
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-6 shadow-xs">
          <label className="text-xs font-semibold text-foreground">Audit Criteria Description</label>
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                placeholder="e.g., Year 2026, Proactive, Male, Stage 2-3"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') startAudit(); }}
                disabled={isAuditing}
                className="w-full rounded-md border bg-muted/50 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-background disabled:opacity-50"
              />
              <p className="text-[13px] text-muted-foreground/70">
                Describe the patient cohort and conditions for this audit.
              </p>
            </div>
            <Button 
              size="sm" 
              className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none disabled:opacity-50"
              onClick={startAudit}
              disabled={isAuditing}
            >
              {isAuditing ? (
                <>
                  <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Auditing...
                </>
              ) : (
                <>
                  <PlayCircle className="size-3.5" />
                  Start New Audit
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Dynamic Content: Empty State vs Results */}
        {!auditResult ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 py-16 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary">
              <History className="size-6 text-muted-foreground/70" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">No Audits Running</h3>
            <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Enter your criteria above and click "Start Audit" to begin generating a new report for your patient cohort.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FileTextIcon className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Audit Report: {auditResult.id}</h3>
              </div>
              <p className="text-[13px] text-muted-foreground">Generated on {auditResult.timestamp}. Criteria: {auditResult.criteria}</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl border bg-muted p-4 shadow-xs">
                <span className="text-[13px] font-medium text-muted-foreground">Patients Audited</span>
                <span className="text-2xl font-medium text-foreground">{auditResult.patientsAudited}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-xs">
                <span className="text-[13px] font-medium text-muted-foreground">Potential Gaps</span>
                <span className="text-2xl font-medium text-primary">{auditResult.potentialGaps}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl border border-red-50 bg-red-50/50 p-4 shadow-xs">
                <span className="text-[13px] font-medium text-muted-foreground">Potential Overcodes/Compliance</span>
                <span className="text-2xl font-medium text-foreground">{auditResult.potentialCompliance}</span>
              </div>
            </div>

            {/* Detailed Findings */}
            <div className="pt-2">
              <h4 className="mb-3 text-[13px] font-semibold text-foreground">Detailed Findings:</h4>
              <DataTable
                columns={columns}
                rows={auditResult.findings}
                rowKey={(row) => row.id}
                pageSize={10}
              />
            </div>
          </div>
        )}

        {/* Error Toast */}
        {showError && (
          <div className="fixed bottom-6 right-6 z-50 flex w-[320px] flex-col gap-1 rounded-xl border-l-4 border-l-red-500 bg-white p-4 shadow-lg ring-1 ring-border/50 animate-in slide-in-from-right-8">
            <span className="text-sm font-semibold">Missing Criteria</span>
            <span className="text-[13px] opacity-90">Please enter audit criteria before starting.</span>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && auditResult && (
          <div className="fixed bottom-6 right-6 z-50 flex w-[340px] items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-xl animate-in slide-in-from-right-8 fade-in">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">Audit Completed</span>
              <span className="text-[13px] leading-snug text-muted-foreground">
                Audit {auditResult.id} has finished processing.
              </span>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function RationaleCell({ rationale, recommendation }: { rationale: string; recommendation: string }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="flex flex-col gap-2 min-w-[350px] w-full max-w-[450px] py-1">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary/90 transition-colors w-fit"
      >
        View AI Rationale
        <ChevronDown className={`size-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>
      
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 text-[13px] text-muted-foreground pb-2 pt-1">
            <div>
              <span className="font-semibold text-foreground/90 block mb-0.5">Rationale:</span>
              <span className="leading-relaxed">{rationale}</span>
            </div>
            <div>
              <span className="font-semibold text-foreground/90 block mb-0.5">Recommendation:</span>
              <span className="leading-relaxed">{recommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
