/**
 * ApprovalModal — Pre-action approval for high-stakes actions.
 * Shows patient context, AI reasoning chain, evidence items,
 * and structured rejection with categorized reasons.
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  X,
  Edit3,
  AlertCircle,
  Clock,
  User,
  FileText,
  ChevronDown,
} from "lucide-react";
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

export function ApprovalModal({
  action,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApprovalModalProps) {
  const [showRejectReasons, setShowRejectReasons] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  if (!action) return null;

  const agentMeta = AGENT_META[action.agentType];

  const handleReject = (reason: RejectionReason) => {
    onReject(action.id, reason, rejectNote || undefined);
    setShowRejectReasons(false);
    setRejectNote("");
    onOpenChange(false);
  };

  const handleApprove = () => {
    onApprove(action.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div
          className="px-5 py-4 border-b border-border"
          style={{
            background: `linear-gradient(135deg, ${agentMeta.color}08, transparent)`,
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="grid size-7 place-items-center rounded-lg text-white shadow-sm"
                style={{ backgroundColor: agentMeta.color }}
              >
                <FileText className="size-3.5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {agentMeta.label} Agent
              </span>
            </div>
            <DialogTitle className="text-sm font-bold text-foreground">
              {action.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {action.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Confidence */}
        <div className="px-5 py-3 border-b border-border">
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
            className="w-full"
          />
        </div>

        {/* Reasoning Chain & Gate Policy Profile */}
        <div className="px-5 py-3 border-b border-border space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="size-3 text-primary" />
              Reasoning
            </h4>
            {action.reversibility && (
              <span
                className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                  action.reversibility === "irreversible"
                    ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                )}
              >
                {action.reversibility === "irreversible"
                  ? "Irreversible Action · Pre-Action Gate"
                  : "Reversible Action"}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">
            {action.reasoning}
          </p>

          {/* Gate Policy Profile & SLA Timeout */}
          {action.timeoutPolicy && (
            <div className="flex items-center justify-between text-[10px] bg-muted/40 px-2.5 py-1.5 rounded border border-border/40 text-muted-foreground font-mono">
              <span>
                Volume Profile:{" "}
                <strong className="text-foreground capitalize">
                  {action.volumeTier?.replace("-", " ") || "Medium Volume"}
                </strong>
              </span>
              <span>
                Timeout SLA:{" "}
                <strong className="text-foreground">
                  {action.timeoutPolicy.durationHours}h
                </strong>{" "}
                ({action.timeoutPolicy.actionOnTimeout.replace("-", " ")})
              </span>
            </div>
          )}
        </div>

        {/* Self-Reflection Grounding Verification (Hallucination Safeguard) */}
        {action.selfReflectionVerification && (
          <div className="px-5 py-3 border-b border-border space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2
                  className={cn(
                    "size-3",
                    action.selfReflectionVerification.status === "verified"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  )}
                />
                Grounding Verification Pass
              </h4>
              <span
                className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                  action.selfReflectionVerification.status === "verified"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                )}
              >
                {action.selfReflectionVerification.status === "verified"
                  ? "100% Verified against Source"
                  : "Flagged — Review Required"}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {action.selfReflectionVerification.checksPassed.map((chk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-foreground/80 bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/15">
                  <CheckCircle2 className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{chk}</span>
                </div>
              ))}
              {action.selfReflectionVerification.checksFailed?.map((fail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded border border-amber-500/25 font-medium">
                  <AlertCircle className="size-3 text-amber-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{fail}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-0.5">
              <span>Sources Verified:</span>
              <div className="flex flex-wrap gap-1">
                {action.selfReflectionVerification.verifiedAgainst.map((src, i) => (
                  <span key={i} className="font-mono text-[9px] bg-muted px-1.5 py-0.2 rounded border border-border/50">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alternatives Considered (Element #4 of Five-Element Reviewer Interface) */}
        {action.alternativesConsidered && action.alternativesConsidered.length > 0 && (
          <div className="px-5 py-3 border-b border-border space-y-1.5">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Alternatives Evaluated & Discarded
            </h4>
            <div className="space-y-1">
              {action.alternativesConsidered.map((alt, i) => (
                <div key={i} className="text-[11px] text-muted-foreground bg-muted/30 px-2.5 py-1.5 rounded border border-border/40 italic">
                  &bull; {alt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Items & RAG Citations */}
        <div className="px-5 py-3 border-b border-border">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
            <span>Evidence</span>
            {action.ragCitations && (
              <span className="text-[9px] text-[#e32168] font-mono lowercase">
                {action.ragCitations.length} rag citations
              </span>
            )}
          </h4>
          <div className="space-y-1.5">
            {action.evidenceItems.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 text-xs rounded-lg px-3 py-2",
                  item.startsWith("⚠")
                    ? "bg-amber-500/5 border border-amber-500/15 text-amber-700 dark:text-amber-300"
                    : "bg-muted/50 text-foreground/80"
                )}
              >
                {!item.startsWith("⚠") && (
                  <span className="text-muted-foreground/40 font-mono text-[10px] mt-px shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          {/* RAG Citations Section */}
          {action.ragCitations && action.ragCitations.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-border/40 space-y-1">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Source System Links (PHI Grounding):
              </span>
              <div className="grid grid-cols-1 gap-1">
                {action.ragCitations.map((cit, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] bg-card px-2 py-1 rounded border border-border/60 font-mono">
                    <span className="text-primary font-bold">{cit.sourceSystem}</span>
                    <span className="text-foreground truncate mx-2">{cit.description}</span>
                    <span className="text-muted-foreground shrink-0">{cit.recordId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Target Patients (if any) */}
        {action.targetPatients && action.targetPatients.length > 0 && (
          <div className="px-5 py-3 border-b border-border">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <User className="size-3" />
              Affected Patients ({action.targetPatients.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {action.targetPatients.slice(0, 5).map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                >
                  {p.name}
                  {p.condition && (
                    <span className="text-muted-foreground/60">
                      ({p.condition})
                    </span>
                  )}
                </span>
              ))}
              {action.targetPatients.length > 5 && (
                <span className="text-[11px] text-muted-foreground font-medium px-2 py-1">
                  +{action.targetPatients.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Suggested Codes (for coding actions) */}
        {action.suggestedCodes && action.suggestedCodes.length > 0 && (
          <div className="px-5 py-3 border-b border-border">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Suggested Codes
            </h4>
            <div className="space-y-1.5">
              {action.suggestedCodes.map((code) => (
                <div
                  key={code.code}
                  className="flex items-center justify-between rounded-lg bg-purple-500/5 border border-purple-500/15 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      {code.code}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {code.description}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                    {Math.round(code.score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 py-4 bg-muted/20">
          {!showRejectReasons ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                onClick={handleApprove}
              >
                <CheckCircle2 className="size-3.5 mr-1.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs font-medium"
                onClick={() => setShowRejectReasons(true)}
              >
                Reject with Reason
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Select rejection reason:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  Object.entries(REJECTION_LABELS) as [
                    RejectionReason,
                    string,
                  ][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleReject(key)}
                    className="text-left rounded-lg border border-border px-3 py-2 text-[11px] font-medium text-foreground/80 hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-xs"
                onClick={() => setShowRejectReasons(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
