/**
 * ApprovalModal — Pre-action approval for high-stakes actions.
 * Redesigned for maximum clarity, decision-making confidence, and clinical governance.
 *
 * Apple HIG:
 * — "Consider consequences and get permission before performing irreversible tasks"
 * — "Never trick someone into thinking they're interacting with content authored by a human"
 *   → Clear AI-Recommended indicator
 * — "Respect people's agency and ensure they remain in charge"
 *   → Unambiguous Approve / Categorized Reject actions with persistent decision facts
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  X,
  Edit3,
  AlertCircle,
  AlertTriangle,
  Clock,
  User,
  FileText,
  ChevronDown,
  Bot,
  Ban,
  ShieldX,
  UserX,
  CalendarX,
  HelpCircle,
  FileX,
  Stethoscope,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "../../lib/icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { cn } from "../ui/utils";
import type {
  AIAction,
  RejectionReason,
} from "./aiTypes";
import { REJECTION_LABELS, AGENT_META } from "./aiTypes";

interface ApprovalModalProps {
  action: AIAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: RejectionReason, note?: string) => void;
}

/** Icons for each rejection reason — makes the grid more scannable */
const REJECTION_ICONS: Record<RejectionReason, React.ElementType> = {
  "wrong-diagnosis": Stethoscope,
  "insufficient-evidence": FileX,
  "already-coded": FileText,
  "patient-doesnt-have-condition": Ban,
  "wrong-patient": UserX,
  "timing-inappropriate": CalendarX,
  other: HelpCircle,
};

export function ApprovalModal({
  action,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApprovalModalProps) {
  const [showRejectReasons, setShowRejectReasons] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [animatingState, setAnimatingState] = useState<"idle" | "approved" | "rejected">("idle");
  const [selectedReasonForAnim, setSelectedReasonForAnim] = useState<RejectionReason | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!action) return null;

  const agentMeta = AGENT_META[action.agentType];
  const isIrreversible = action.reversibility === "irreversible";
  const confidencePercent = Math.round(action.confidence * 100);

  const handleReject = (reason: RejectionReason) => {
    setSelectedReasonForAnim(reason);
    setAnimatingState("rejected");
    setTimeout(() => {
      onReject(action.id, reason, rejectNote || undefined);
      setShowRejectReasons(false);
      setRejectNote("");
      setAnimatingState("idle");
      setSelectedReasonForAnim(null);
      onOpenChange(false);
    }, 1200);
  };

  const handleApprove = () => {
    setAnimatingState("approved");
    setTimeout(() => {
      onApprove(action.id);
      setAnimatingState("idle");
      onOpenChange(false);
    }, 1200);
  };

  const totalBars = 40;
  const filledBars = Math.round(action.confidence * totalBars);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1080px] w-[95vw] p-0 gap-0 overflow-hidden rounded-2xl flex flex-col max-h-[92vh] bg-card border-border shadow-2xl">
        {/* 4. Streamlined Compact Header */}
        <div className="px-6 py-4 border-b border-border/70 bg-card shrink-0">
          <DialogHeader className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* AI Origin Marker: Dedicated Brand Pink */}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#e32168] bg-[#e32168]/10 px-2 py-0.5 rounded-full border border-[#e32168]/20 tracking-wide">
                  <Bot className="size-3 text-[#e32168]" />
                  Helix AI-Recommended
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {agentMeta.label}
                </span>
              </div>

              {/* Patient Context Pill */}
              {action.targetPatients?.[0] && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/60">
                  <User className="size-3 text-muted-foreground" />
                  <span>{action.targetPatients[0].name}</span>
                  {action.targetPatients[0].condition && (
                    <span className="text-muted-foreground font-normal text-[10px]">
                      · {action.targetPatients[0].condition}
                    </span>
                  )}
                </div>
              )}
            </div>

            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight tracking-tight">
              {action.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground/80 leading-snug">
              {action.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Narrative Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5 antialiased">

          {/* 1. DOMINANT HERO CONFIDENCE PANEL */}
          <div className="rounded-xl border border-border/70 bg-muted/20 dark:bg-muted/10 p-5 space-y-3.5">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                  AI Recommendation Confidence
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground tabular-nums tracking-tight leading-none">
                    {confidencePercent}%
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    High Confidence
                  </span>
                </div>
              </div>

              <p className="text-right text-[11px] text-muted-foreground/75 max-w-[240px] leading-relaxed hidden sm:block">
                Clinical evidence and historical patterns exceed the 90% threshold for automated coding recommendation.
              </p>
            </div>

            {/* Segmented meter */}
            <div className="flex items-center gap-[3px] w-full pt-1">
              {Array.from({ length: totalBars }).map((_, i) => {
                const isActive = i < filledBars;
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-3 flex-1 rounded-[2px] transition-all duration-300",
                      isActive
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-muted-foreground/15"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* 3. HIGH-STAKES IRREVERSIBLE WARNING BANNER (Exclusively Red for Danger/Risk) */}
          {isIrreversible ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/[0.06] border border-rose-500/25 text-rose-900 dark:text-rose-200 shadow-xs">
              <div className="grid size-7 place-items-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    High Stakes · Irreversible EHR Write-Back
                  </span>
                </div>
                <p className="text-[12px] text-rose-700/90 dark:text-rose-300/90 mt-1 leading-relaxed">
                  Approving this recommendation will write ICD-10 diagnostic codes directly to active EHR problem lists and clinical claims feeds. This action cannot be automatically undone.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/50 text-muted-foreground text-xs">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Reversible Action:</strong> Can be rolled back within 30 minutes from the Actions history tab.
              </span>
            </div>
          )}

          {/* 5. SUGGESTED CODES: SIDE-BY-SIDE DECISION COMPARISON */}
          {action.suggestedCodes && action.suggestedCodes.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-card p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-6 place-items-center rounded-md bg-muted text-foreground">
                    <Edit3 className="size-3.5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Diagnostic Code Evaluation & Comparison
                  </h4>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Ranked by clinical specificity & match confidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                {action.suggestedCodes.map((code, idx) => {
                  const isTopPick = idx === 0;
                  return (
                    <div
                      key={code.code}
                      className={cn(
                        "rounded-xl p-4 flex flex-col justify-between transition-all duration-200 min-w-0 relative",
                        isTopPick
                          ? "bg-emerald-500/[0.04] border-2 border-emerald-600 dark:border-emerald-500 shadow-sm pt-4.5"
                          : "bg-muted/30 border border-border/60"
                      )}
                    >
                      {/* Integrated Border Pill for Recommended Card */}
                      {isTopPick && (
                        <div className="absolute -top-3 left-4 z-10">
                          <span className="inline-flex items-center text-[11px] font-semibold text-white bg-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-500 dark:border-emerald-400/60 px-2.5 py-0.5 rounded-md shadow-xs">
                            Recommended
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "font-mono text-sm font-extrabold px-2 py-0.5 rounded-md shrink-0",
                              isTopPick
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : "bg-muted text-muted-foreground border border-border/60"
                            )}
                          >
                            {code.code}
                          </span>

                          <span
                            className={cn(
                              "text-[11px] font-bold tabular-nums shrink-0 px-2 py-0.5 rounded-md",
                              isTopPick
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-500/20"
                                : "bg-muted text-muted-foreground border border-border/40"
                            )}
                          >
                            {Math.round(code.score * 100)}% match
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-foreground/90 leading-snug">
                          {code.description}
                        </p>
                      </div>

                      {/* Comparison Match Bar */}
                      <div className="pt-3 mt-3 border-t border-border/30">
                        <div className="w-full h-2 rounded-full bg-muted-foreground/15 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              isTopPick ? "bg-emerald-500" : "bg-muted-foreground/50"
                            )}
                            style={{ width: `${code.score * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground/75 mt-1 block truncate">
                          {isTopPick
                            ? "Optimal ICD-10 leaf node supported by Metformin & HbA1c"
                            : "Differential candidate — lacks acute complication evidence"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CLINICAL REASONING */}
          <div className="rounded-xl border border-border/70 bg-card p-5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <div className="grid size-6 place-items-center rounded-md bg-muted text-foreground">
                <FileText className="size-3.5" />
              </div>
              Clinical Reasoning Chain
            </h4>
            <p className="text-[13px] text-foreground/85 leading-relaxed">
              {action.reasoning}
            </p>
          </div>

          {/* 2 & 7. UNIFIED EVIDENCE & VERIFICATION STREAM */}
          <div className="rounded-xl border border-border/70 bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-md bg-muted text-foreground">
                  <ShieldCheck className="size-3.5" />
                </div>
                Verified Evidence & Grounding
              </h4>
              {action.ragCitations && (
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground font-mono tabular-nums">
                  {action.ragCitations.length} source records
                </span>
              )}
            </div>

            {/* Evidence items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {action.evidenceItems.map((item, i) => {
                const isWarning = item.startsWith("⚠");
                const cleanItem = isWarning ? item.substring(1).trim() : item;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2.5 text-xs rounded-lg px-3 py-2.5 border",
                      isWarning
                        ? "bg-amber-500/[0.04] border-amber-500/20 text-amber-800 dark:text-amber-300"
                        : "bg-muted/25 border-border/50 text-foreground/85"
                    )}
                  >
                    {isWarning ? (
                      <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    )}
                    <span className="leading-relaxed">{cleanItem}</span>
                  </div>
                );
              })}
            </div>

            {/* Self Reflection Checks */}
            {action.selfReflectionVerification && (
              <div className="pt-3 border-t border-border/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Automated Verification Safeguards
                </span>
                <div className="space-y-1.5">
                  {action.selfReflectionVerification.checksPassed.map((chk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] text-muted-foreground/90 bg-muted/20 px-2.5 py-1.5 rounded-md border border-border/40"
                    >
                      <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source citations */}
            {action.ragCitations && action.ragCitations.length > 0 && (
              <div className="pt-3 border-t border-border/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  EHR & Lab Citations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {action.ragCitations.map((cit, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col text-[11px] bg-muted/20 px-3 py-2 rounded-lg border border-border/40"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-foreground text-[10px]">{cit.sourceSystem}</span>
                        <span className="font-mono text-[9px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded border border-border/40">{cit.recordId}</span>
                      </div>
                      <span className="text-muted-foreground/80 text-[10px] truncate">{cit.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. COLLAPSIBLE REFERENCE / ALTERNATIVES EVALUATED (Collapsed by Default) */}
          {(action.alternativesConsidered?.length || action.timeoutPolicy) && (
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="size-3.5" />
                  <span>Reference: Discarded Alternatives & Audit Policy</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                  <span>{showAlternatives ? "Collapse" : "Expand"}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      !showAlternatives && "-rotate-90"
                    )}
                  />
                </div>
              </button>

              {showAlternatives && (
                <div className="px-5 pb-4 pt-1 space-y-3 border-t border-border/30 bg-muted/10 ai-expand-enter">
                  {action.alternativesConsidered && action.alternativesConsidered.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                        Ruled-Out Differential Options
                      </span>
                      {action.alternativesConsidered.map((alt, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-muted-foreground/80 bg-muted/20 px-3 py-2 rounded-md border border-border/30 italic flex items-start gap-2"
                        >
                          <span className="text-muted-foreground/40 shrink-0">•</span>
                          <span>{alt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {action.timeoutPolicy && (
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground bg-muted/30 px-3 py-2 rounded-md border border-border/30 font-mono">
                      <span>Governance SLA: <strong>{action.timeoutPolicy.durationHours} hours</strong></span>
                      <span>Action on Timeout: <strong className="capitalize">{action.timeoutPolicy.actionOnTimeout.replace("-", " ")}</strong></span>
                      {action.timeoutPolicy.escalateToRole && (
                        <span>Escalation: <strong>{action.timeoutPolicy.escalateToRole}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* 6. PERSISTENT DECISION SUMMARY STRIP ANCHORED DIRECTLY ABOVE BUTTONS */}
        <div className="px-6 py-2.5 bg-muted/40 border-t border-border/60 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            {/* Confidence status */}
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{confidencePercent}% Confidence</span>
            </div>

            <span className="text-border">|</span>

            {/* Irreversibility status */}
            {isIrreversible ? (
              <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="size-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Irreversible Write-Back</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                <span>Reversible (30m window)</span>
              </div>
            )}
          </div>

          {/* SLA / Context */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono hidden sm:flex">
            {action.targetPatients?.length ? (
              <span>{action.targetPatients.length} patient affected</span>
            ) : null}
            {action.timeoutPolicy ? (
              <>
                <span className="text-border">·</span>
                <span>{action.timeoutPolicy.durationHours}h SLA</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="px-6 py-4 bg-card shrink-0 border-t border-border/40 antialiased">
          {!showRejectReasons ? (
            <div className="flex items-center gap-3">
              <Button
                size="default"
                className="flex-1 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow py-5 rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                onClick={handleApprove}
              >
                <CheckCircle2 className="size-4" />
                Approve & Execute Action
              </Button>
              <Button
                size="default"
                variant="outline"
                className="flex-1 text-sm font-medium py-5 rounded-xl transition-all duration-200 active:scale-[0.98] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                onClick={() => setShowRejectReasons(true)}
              >
                Reject with Reason
              </Button>
            </div>
          ) : (
            <div className="space-y-3.5 ai-expand-enter">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Select Rejection Reason:
                </p>
                <span className="text-[11px] text-muted-foreground">
                  Feedback will tune future agent recommendations
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  Object.entries(REJECTION_LABELS) as [
                    RejectionReason,
                    string,
                  ][]
                ).map(([key, label]) => {
                  const ReasonIcon = REJECTION_ICONS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleReject(key)}
                      className="group text-left rounded-xl border border-border/50 px-3.5 py-2.5 text-xs font-medium text-foreground/85 hover:border-rose-500/30 hover:bg-rose-500/[0.04] hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-150 cursor-pointer flex items-center gap-2.5"
                    >
                      <ReasonIcon className="size-4 text-muted-foreground/40 group-hover:text-rose-500 transition-colors shrink-0" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
              <Button
                size="default"
                variant="ghost"
                className="w-full text-xs font-medium py-2 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setShowRejectReasons(false)}
              >
                Cancel Rejection
              </Button>
            </div>
          )}
        </div>

        {/* Confirmation Animations Overlay */}
        {animatingState !== "idle" && (
          <div className="ai-confirmation-overlay">
            {animatingState === "approved" ? (
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="ai-success-scale grid size-16 place-items-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                </div>
                <div className="ai-text-reveal space-y-1 px-4">
                  <h3 className="text-base font-bold text-foreground">Action Approved & Submitted</h3>
                  <p className="text-xs text-muted-foreground/75">Written to EHR problem list and billing queue.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="ai-reject-scale grid size-16 place-items-center rounded-full bg-rose-500/10 border-2 border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.3)]">
                  <X className="size-8 text-rose-500" />
                </div>
                <div className="ai-text-reveal space-y-1 px-4">
                  <h3 className="text-base font-bold text-foreground">Action Rejected</h3>
                  {selectedReasonForAnim && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                      Reason: {REJECTION_LABELS[selectedReasonForAnim]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60">Removed from pending approval queue.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
