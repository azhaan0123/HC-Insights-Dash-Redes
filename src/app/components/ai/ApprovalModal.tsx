/**
 * ApprovalModal — Pre-action approval for high-stakes actions.
 * Shows patient context, AI reasoning chain, evidence items,
 * and structured rejection with categorized reasons.
 *
 * Apple HIG:
 * — "Consider consequences and get permission before performing irreversible tasks"
 * — "Never trick someone into thinking they're interacting with content authored by a human"
 *   → AI-recommended action label
 * — "Respect people's agency and ensure they remain in charge"
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
import { ConfidenceBadge } from "./ConfidenceBadge";
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

  if (!action) return null;

  const agentMeta = AGENT_META[action.agentType];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-0 gap-0 overflow-hidden rounded-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-border ai-glass-header"
          style={{
            background: `linear-gradient(135deg, ${agentMeta.color}06, ${agentMeta.color}02, transparent)`,
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="grid size-8 place-items-center rounded-lg text-white shadow-sm"
                style={{
                  backgroundColor: agentMeta.color,
                  boxShadow: `0 2px 8px -2px ${agentMeta.color}40`,
                }}
              >
                <FileText className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                {agentMeta.label} Agent
              </span>
              {/* HIG: "Never trick someone" — disclose AI origin */}
              <span className="ai-disclosure-pill ml-1">
                <Bot className="size-2.5" />
                AI-Recommended
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              {action.title}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground/70">
              {action.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 overflow-x-hidden antialiased">

        {/* ═══ Confidence — Full-width top banner ═══ */}
        <div className="px-6 py-4 border-b border-border/30">
          <ConfidenceBadge
            tier={action.confidenceTier}
            score={action.confidence}
            explanation={
              action.confidenceTier === "medium"
                ? "Additional verification recommended"
                : action.confidenceTier === "low"
                  ? "Data may be incomplete — please verify before acting"
                  : undefined
            }
            variant="speedometer"
            className="w-full"
          />
        </div>

        {/* ═══ BENTO GRID — Main content area ═══ */}
        <div className="px-5 py-5 space-y-4">

          {/* ── Row 1: Reasoning + Verification (vertical layout) ── */}
          <div className="flex flex-col gap-4">

            {/* Cell: Reasoning & Gate Policy */}
            <div className="rounded-xl border border-border/30 bg-card p-5 space-y-3 shadow-2xs flex flex-col transition-all duration-200 hover:border-border/50">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                  <div className="grid size-6 place-items-center rounded-md bg-primary/8">
                    <AlertCircle className="size-3.5 text-primary" />
                  </div>
                  Reasoning
                </h4>
                {action.reversibility && (
                  <span
                    className={cn(
                      "text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                      action.reversibility === "irreversible"
                        ? "bg-red-500/8 border-red-500/15 text-red-600 dark:text-red-400"
                        : "bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {action.reversibility === "irreversible"
                      ? "Irreversible"
                      : "Reversible"}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-foreground/75 leading-relaxed flex-1">
                {action.reasoning}
              </p>

              {action.timeoutPolicy && (
                <div className="flex items-center justify-between text-[10px] bg-muted/30 px-3 py-2 rounded-lg border border-border/20 text-muted-foreground/60 font-mono mt-auto">
                  <span>
                    Vol:{" "}
                    <strong className="text-foreground/70 font-semibold capitalize">
                      {action.volumeTier?.replace("-", " ") || "Medium"}
                    </strong>
                  </span>
                  <span className="text-border">|</span>
                  <span>
                    SLA:{" "}
                    <strong className="text-foreground/70 font-semibold">
                      {action.timeoutPolicy.durationHours}h
                    </strong>
                    <span className="opacity-50 ml-1">({action.timeoutPolicy.actionOnTimeout.replace("-", " ")})</span>
                  </span>
                </div>
              )}
            </div>

            {/* Cell: Grounding Verification */}
            {action.selfReflectionVerification ? (
              <div className="rounded-xl border border-border/30 bg-card p-5 space-y-3 shadow-2xs flex flex-col transition-all duration-200 hover:border-border/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                    <div className={cn(
                      "grid size-6 place-items-center rounded-md",
                      action.selfReflectionVerification.status === "verified"
                        ? "bg-emerald-500/8"
                        : "bg-amber-500/8"
                    )}>
                      <CheckCircle2
                        className={cn(
                          "size-3.5",
                          action.selfReflectionVerification.status === "verified"
                            ? "text-emerald-500"
                            : "text-amber-500"
                        )}
                      />
                    </div>
                    Verification
                  </h4>
                  <span
                    className={cn(
                      "text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                      action.selfReflectionVerification.status === "verified"
                        ? "bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/8 border-amber-500/15 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {action.selfReflectionVerification.status === "verified"
                      ? "Verified"
                      : "Flagged"}
                  </span>
                </div>

                <div className="space-y-1.5 flex-1">
                  {action.selfReflectionVerification.checksPassed.map((chk, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-2 text-[12px] text-foreground/75 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] px-3 py-2 rounded-lg border border-emerald-500/8 hover:border-emerald-500/15 transition-all duration-200"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{chk}</span>
                    </div>
                  ))}
                  {action.selfReflectionVerification.checksFailed?.map((fail, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-2 text-[12px] text-amber-700 dark:text-amber-300 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] px-3 py-2 rounded-lg border border-amber-500/10 hover:border-amber-500/20 transition-all duration-200 font-medium"
                    >
                      <AlertCircle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{fail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 pt-1 mt-auto border-t border-border/20">
                  <span className="font-medium shrink-0 pt-2">Sources:</span>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {action.selfReflectionVerification.verifiedAgainst.map((src, i) => (
                      <span
                        key={i}
                        className="font-mono text-[9px] bg-muted/40 px-2 py-0.5 rounded border border-border/30"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Placeholder when no verification — alternatives can take this slot */
              action.alternativesConsidered && action.alternativesConsidered.length > 0 && (
                <div className="rounded-xl border border-border/30 bg-card p-5 space-y-3 shadow-2xs flex flex-col transition-all duration-200 hover:border-border/50">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-md bg-muted">
                      <X className="size-3.5 text-muted-foreground/60" />
                    </div>
                    Alternatives Discarded
                  </h4>
                  <div className="space-y-1.5 flex-1">
                    {action.alternativesConsidered.map((alt, i) => (
                      <div
                        key={i}
                        className="text-[12px] text-muted-foreground/60 bg-muted/10 hover:bg-muted/25 px-3 py-2 rounded-lg border border-border/20 hover:border-border/40 transition-all duration-200 italic flex gap-2"
                      >
                        <span className="text-muted-foreground/30 select-none shrink-0">•</span>
                        <span className="leading-relaxed font-normal">{alt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* ── Row 2: Alternatives (if verification exists and alternatives also exist) ── */}
          {action.selfReflectionVerification && action.alternativesConsidered && action.alternativesConsidered.length > 0 && (
            <div className="rounded-xl border border-border/30 bg-card p-5 space-y-3 shadow-2xs transition-all duration-200 hover:border-border/50">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-md bg-muted">
                  <X className="size-3.5 text-muted-foreground/60" />
                </div>
                Alternatives Evaluated & Discarded
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {action.alternativesConsidered.map((alt, i) => (
                  <div
                    key={i}
                    className="text-[12px] text-muted-foreground/60 bg-muted/10 hover:bg-muted/25 px-3 py-2 rounded-lg border border-border/20 hover:border-border/40 transition-all duration-200 italic flex gap-2"
                  >
                    <span className="text-muted-foreground/30 select-none shrink-0">•</span>
                    <span className="leading-relaxed font-normal">{alt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Row 3: Evidence — Full-width card ── */}
          <div className="rounded-xl border border-border/30 bg-card p-5 space-y-3.5 shadow-2xs transition-all duration-200 hover:border-border/50">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-md bg-primary/8">
                  <FileText className="size-3.5 text-primary" />
                </div>
                Evidence
              </span>
              {action.ragCitations && (
                <span className="text-[9px] bg-primary/[0.04] border border-primary/8 text-primary/70 px-2 py-0.5 rounded-full font-mono tabular-nums">
                  {action.ragCitations.length} citations
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {action.evidenceItems.map((item, i) => {
                const isWarning = item.startsWith("⚠");
                const cleanItem = isWarning ? item.substring(1).trim() : item;
                return (
                  <div
                    key={i}
                    className={cn(
                      "group flex items-start gap-2.5 text-[12px] rounded-lg px-3 py-2.5 transition-all duration-200 border",
                      isWarning
                        ? "bg-amber-500/[0.02] border-amber-500/8 text-amber-700 dark:text-amber-300 hover:bg-amber-500/[0.05] hover:border-amber-500/15"
                        : "bg-muted/15 border-transparent hover:bg-muted/35 hover:border-border/20"
                    )}
                  >
                    {isWarning ? (
                      <AlertTriangle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <span className="text-muted-foreground/30 font-mono text-[9px] mt-0.5 shrink-0 select-none bg-muted dark:bg-card px-1.5 py-0.5 rounded border border-border/20 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span className="leading-relaxed">{cleanItem}</span>
                  </div>
                );
              })}
            </div>

            {/* RAG Citations Sub-grid */}
            {action.ragCitations && action.ragCitations.length > 0 && (
              <div className="pt-3.5 border-t border-border/20 space-y-2.5">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                  Source System Links
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {action.ragCitations.map((cit, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col text-[11px] bg-muted/10 hover:bg-muted/25 px-3.5 py-2.5 rounded-lg border border-border/20 hover:border-border/40 transition-all duration-200 shadow-3xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-primary/70 font-bold text-[9px] uppercase tracking-wider bg-primary/[0.04] px-1.5 py-0.5 rounded font-mono">{cit.sourceSystem}</span>
                        <span className="text-muted-foreground/50 text-[9px] bg-muted/30 px-1.5 py-0.5 rounded font-mono select-all">{cit.recordId}</span>
                      </div>
                      <span className="text-foreground/60 leading-normal truncate">{cit.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Row 4: Patients + Codes (side-by-side bento) ── */}
          {(action.targetPatients?.length || action.suggestedCodes?.length) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Cell: Affected Patients */}
              {action.targetPatients && action.targetPatients.length > 0 && (
                <div className={cn(
                  "rounded-xl border border-border/30 bg-card p-5 space-y-3 shadow-2xs transition-all duration-200 hover:border-border/50",
                  !action.suggestedCodes?.length && "lg:col-span-2"
                )}>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-md bg-primary/8">
                      <User className="size-3.5 text-primary" />
                    </div>
                    Affected Patients
                    <span className="text-[9px] font-mono bg-muted/30 px-1.5 py-0.5 rounded tabular-nums ml-auto">{action.targetPatients.length}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {action.targetPatients.slice(0, 5).map((p) => (
                      <span
                        key={p.id}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-muted/20 hover:bg-muted/40 border border-border/20 hover:border-border/40 px-2.5 py-1 text-[11px] font-medium text-foreground/70 transition-all duration-200 cursor-default"
                      >
                        <span className="size-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                        {p.name}
                        {p.condition && (
                          <span className="text-muted-foreground/40 text-[9px] font-normal">
                            {p.condition}
                          </span>
                        )}
                      </span>
                    ))}
                    {action.targetPatients.length > 5 && (
                      <span className="text-[11px] text-muted-foreground/50 font-medium px-2 py-1">
                        +{action.targetPatients.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Cell: Suggested Codes */}
              {action.suggestedCodes && action.suggestedCodes.length > 0 && (
                <div className={cn(
                  "rounded-xl border border-border/30 bg-card p-5 space-y-3 shadow-2xs transition-all duration-200 hover:border-border/50",
                  !action.targetPatients?.length && "lg:col-span-2"
                )}>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-md bg-purple-500/8">
                      <Edit3 className="size-3.5 text-purple-500" />
                    </div>
                    Suggested Codes
                  </h4>
                  <div className="space-y-1.5">
                    {action.suggestedCodes.map((code) => (
                      <div
                        key={code.code}
                        className="group flex items-center justify-between rounded-lg bg-purple-500/[0.02] hover:bg-purple-500/[0.05] border border-purple-500/8 hover:border-purple-500/15 px-3 py-2.5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-500/8 px-1.5 py-0.5 rounded shrink-0 tabular-nums">
                            {code.code}
                          </span>
                          <span className="text-[11px] font-medium text-foreground/70 truncate">
                            {code.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <div className="w-10 h-1 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${code.score * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 tabular-nums w-8 text-right">
                            {Math.round(code.score * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
        {/* ═══ END BENTO GRID ═══ */}
        </div>

        {/* Actions — HIG: "Respect people's agency" */}
        <div className="px-6 py-5 bg-muted/10 shrink-0 border-t border-border/30 antialiased">
          {!showRejectReasons ? (
            <div className="flex items-center gap-3">
              <Button
                size="default"
                className="flex-1 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md py-6 transition-all duration-300 active:scale-[0.98] hover:-translate-y-px"
                onClick={handleApprove}
              >
                <CheckCircle2 className="size-5 mr-2" />
                Approve
              </Button>
              <Button
                size="default"
                variant="outline"
                className="flex-1 text-sm font-medium py-6 transition-all duration-300 active:scale-[0.98] hover:bg-muted/60 hover:-translate-y-px hover:border-red-500/20 hover:text-red-600 dark:hover:text-red-400"
                onClick={() => setShowRejectReasons(true)}
              >
                Reject with Reason
              </Button>
            </div>
          ) : (
            <div className="space-y-4 ai-expand-enter">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 text-wrap-balance">
                Select Rejection Reason:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
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
                      className="group text-left rounded-xl border border-border/40 px-4 py-3.5 text-xs font-semibold text-foreground/75 hover:border-rose-500/25 hover:bg-rose-500/[0.03] hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 shadow-3xs hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex items-center gap-2.5"
                    >
                      <ReasonIcon className="size-4 text-muted-foreground/30 group-hover:text-rose-500 transition-colors shrink-0" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
              <Button
                size="default"
                variant="ghost"
                className="w-full text-sm font-medium py-6 transition-all duration-200 active:scale-[0.98] text-muted-foreground/60"
                onClick={() => setShowRejectReasons(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Final Confirmation Overlay Animation */}
        {animatingState !== "idle" && (
          <div className="ai-confirmation-overlay">
            {animatingState === "approved" ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="ai-success-scale grid size-20 place-items-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="size-10 text-emerald-500" />
                </div>
                <div className="ai-text-reveal space-y-1 px-6">
                  <h3 className="text-lg font-bold text-foreground">Action Approved & Scheduled</h3>
                  <p className="text-xs text-muted-foreground/75">Initializing execution sequence across clinical channels.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="ai-reject-scale grid size-20 place-items-center rounded-full bg-red-500/10 border-2 border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]">
                  <X className="size-10 text-red-500" />
                </div>
                <div className="ai-text-reveal space-y-1 px-6">
                  <h3 className="text-lg font-bold text-foreground">Action Rejected</h3>
                  {selectedReasonForAnim && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                      Reason: {REJECTION_LABELS[selectedReasonForAnim]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/50">Recommendation removed from pending queue.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
