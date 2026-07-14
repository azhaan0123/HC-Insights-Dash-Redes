/**
 * AiActionsTab — The action queue and approval center.
 * Implements all four HITL approval gate patterns:
 *  1. Pre-Action Approval (high-stakes modal)
 *  2. Parallel Draft Review (inline suggestions)
 *  3. Post-Action Correction (auto-executed with undo)
 *  4. Selective Escalation (ambiguity routing)
 *
 * Features structured rejection, rollback/undo, trust tier graduation,
 * and plan preview with editable steps.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  X,
  ChevronDown,
  Undo2,
  Eye,
  Clock,
  ArrowUpRight,
  Sparkles,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { AGENT_META, type AIAction, type AgentType } from "./aiTypes";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ApprovalModal } from "./ApprovalModal";
import { PlanPreview } from "./PlanPreview";
import { GraduationPrompt, TierBadge } from "./TrustGradient";

interface AiActionsTabProps {
  className?: string;
}

export function AiActionsTab({ className }: AiActionsTabProps) {
  const {
    actions,
    pendingCount,
    pageContext,
    approveAction,
    rejectAction,
    undoAction,
    autonomyTiers,
    approvalCounts,
    shouldShowGraduation,
    setAutonomyTier,
    dismissGraduation,
  } = useAiContext();

  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPlanFor, setShowPlanFor] = useState<string | null>(null);
  const [undoTimers, setUndoTimers] = useState<Record<string, number>>({});

  // Group actions by status
  const pendingActions = actions.filter((a) => a.status === "pending");
  const recentActions = actions.filter(
    (a) =>
      a.status === "approved" ||
      a.status === "edited" ||
      a.status === "rejected" ||
      a.status === "undone"
  );

  // Undo timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setUndoTimers((prev) => {
        const next: Record<string, number> = {};
        for (const [id, remaining] of Object.entries(prev)) {
          if (remaining > 0) next[id] = remaining - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = useCallback(
    (id: string) => {
      approveAction(id);
      const action = actions.find((a) => a.id === id);
      if (action?.isUndoable) {
        setUndoTimers((prev) => ({ ...prev, [id]: 30 }));
      }
    },
    [approveAction, actions]
  );

  const handleUndo = useCallback(
    (id: string) => {
      undoAction(id);
      setUndoTimers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [undoAction]
  );

  // Check if graduation prompt should show for current agent
  const currentAgent = pageContext.agentType;
  const showGraduation = shouldShowGraduation(currentAgent);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-[#e32168]" />
            <span className="text-xs font-semibold text-foreground">
              Action Queue
            </span>
            {pendingCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-[#e32168] text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </div>
          <TierBadge tier={autonomyTiers[currentAgent]} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {/* Graduation Prompt */}
        {showGraduation && (
          <GraduationPrompt
            agentType={currentAgent}
            currentTier={autonomyTiers[currentAgent]}
            approvalCount={approvalCounts[currentAgent] || 0}
            onUpgrade={() => {
              const next =
                autonomyTiers[currentAgent] === "preview"
                  ? "supervised"
                  : "autonomous";
              setAutonomyTier(currentAgent, next as any);
              dismissGraduation(currentAgent);
            }}
            onDismiss={() => dismissGraduation(currentAgent)}
          />
        )}

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2 px-1">
              Pending Approval ({pendingActions.length})
            </h3>
            <div className="space-y-2">
              {pendingActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onApprove={() => {
                    if (action.planSteps && action.planSteps.length > 0) {
                      setShowPlanFor(action.id);
                    } else {
                      setSelectedAction(action);
                      setModalOpen(true);
                    }
                  }}
                  onReject={() => {
                    setSelectedAction(action);
                    setModalOpen(true);
                  }}
                  showPlan={showPlanFor === action.id}
                  onClosePlan={() => setShowPlanFor(null)}
                  onPlanApprove={() => {
                    handleApprove(action.id);
                    setShowPlanFor(null);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingActions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="grid size-12 place-items-center rounded-xl bg-emerald-500/10 mb-3">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-foreground/60">
              All caught up
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No pending actions requiring approval
            </p>
          </div>
        )}

        {/* Recent Actions */}
        {recentActions.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2 px-1">
              Recent Decisions
            </h3>
            <div className="space-y-1.5">
              {recentActions.slice(0, 5).map((action) => (
                <RecentActionRow
                  key={action.id}
                  action={action}
                  undoRemaining={undoTimers[action.id]}
                  onUndo={() => handleUndo(action.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        action={selectedAction}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApprove={(id) => {
          handleApprove(id);
          setModalOpen(false);
        }}
        onReject={(id, reason, note) => {
          rejectAction(id, reason, note);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

// ── Action Card (Pending) ──────────────────────────────────────────────────

function ActionCard({
  action,
  onApprove,
  onReject,
  showPlan,
  onClosePlan,
  onPlanApprove,
}: {
  action: AIAction;
  onApprove: () => void;
  onReject: () => void;
  showPlan: boolean;
  onClosePlan: () => void;
  onPlanApprove: () => void;
}) {
  const agentMeta = AGENT_META[action.agentType];
  const hasPlan = action.planSteps && action.planSteps.length > 0;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-xl border overflow-hidden transition-all",
          action.priority === "critical"
            ? "border-red-500/25 shadow-sm shadow-red-500/5"
            : "border-border hover:border-[#e32168]/20"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: agentMeta.color }}
              />
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                {agentMeta.label}
              </span>
            </div>
            <ConfidenceBadge tier={action.confidenceTier} compact />
          </div>

          <h4 className="text-xs font-bold text-foreground leading-snug">
            {action.title}
          </h4>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            {action.description}
          </p>

          {/* Draft preview */}
          {action.draftContent && (
            <div className="mt-2 rounded-lg bg-muted/50 border border-border/50 px-3 py-2 text-[11px] text-muted-foreground font-mono leading-relaxed line-clamp-3">
              {action.draftContent.split("\n").slice(0, 3).join(" ")}…
            </div>
          )}

          {/* Suggested codes */}
          {action.suggestedCodes && action.suggestedCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {action.suggestedCodes.map((code) => (
                <span
                  key={code.code}
                  className="inline-flex items-center gap-1 rounded-md bg-purple-500/8 border border-purple-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400"
                >
                  {code.code}
                  <span className="font-normal text-muted-foreground/60">
                    {Math.round(code.score * 100)}%
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Target patients count */}
          {action.targetPatients && action.targetPatients.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
              <span className="font-medium">
                {action.targetPatients.length} patient
                {action.targetPatients.length > 1 ? "s" : ""}
              </span>
              <span>affected</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/50 bg-muted/20">
          <Button
            size="sm"
            className="flex-1 text-[11px] h-7 font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            onClick={onApprove}
          >
            {hasPlan ? (
              <>
                <Eye className="size-3 mr-1" />
                Review Plan
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3 mr-1" />
                Review & Approve
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-[11px] h-7 font-medium"
            onClick={onReject}
          >
            <X className="size-3 mr-1" />
            Reject
          </Button>
        </div>
      </div>

      {/* Plan Preview (expanded) */}
      {showPlan && hasPlan && (
        <PlanPreview
          action={action}
          onApprove={onPlanApprove}
          onReject={onClosePlan}
          className="animate-fade-in-up"
        />
      )}
    </div>
  );
}

// ── Recent Action Row ──────────────────────────────────────────────────────

function RecentActionRow({
  action,
  undoRemaining,
  onUndo,
}: {
  action: AIAction;
  undoRemaining?: number;
  onUndo: () => void;
}) {
  const statusConfig = {
    approved: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      label: "Approved",
    },
    rejected: { icon: X, color: "text-red-500", label: "Rejected" },
    edited: { icon: FileText, color: "text-blue-500", label: "Edited" },
    undone: { icon: Undo2, color: "text-amber-500", label: "Undone" },
    auto: { icon: Sparkles, color: "text-purple-500", label: "Auto" },
    pending: {
      icon: Clock,
      color: "text-muted-foreground",
      label: "Pending",
    },
  };

  const cfg = statusConfig[action.status] || statusConfig.pending;
  const Icon = cfg.icon;
  const showUndo =
    action.status === "approved" &&
    action.isUndoable &&
    undoRemaining !== undefined &&
    undoRemaining > 0;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/50 px-3 py-2 text-xs">
      <Icon className={cn("size-3.5 shrink-0", cfg.color)} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{action.title}</p>
        <p className="text-[10px] text-muted-foreground">
          {cfg.label}
          {action.rejectionReason && (
            <> — {action.rejectionReason.replace(/-/g, " ")}</>
          )}
        </p>
      </div>
      {showUndo && (
        <button
          onClick={onUndo}
          className="shrink-0 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer ai-undo-ring"
          title="Undo this action"
        >
          <Undo2 className="size-3" />
          <span className="tabular-nums">{undoRemaining}s</span>
        </button>
      )}
    </div>
  );
}
