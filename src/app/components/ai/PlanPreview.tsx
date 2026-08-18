/**
 * PlanPreview — Multi-step plan preview before agent execution.
 * Shows plan summary, assumptions, scope, and individually editable steps.
 * This is the most critical UX moment in agentic interaction.
 *
 * Apple HIG:
 * — "Consider consequences and get permission before performing irreversible tasks"
 * — "Keep people in control" → every step is editable/skippable
 * — "Make it easy for people to refine or revert generated results"
 *   → Edit/Skip controls on each step
 */

import React, { useState } from "react";
import {
  FileText,
  Lightbulb,
  Target,
  Edit3,
  X,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Info,
} from "../../lib/icons";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import type { PlanStep, AIAction } from "./aiTypes";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface PlanPreviewProps {
  action: AIAction;
  onApprove: () => void;
  onReject: () => void;
  onEdit?: (stepId: string) => void;
  onRemoveStep?: (stepId: string) => void;
  className?: string;
}

export function PlanPreview({
  action,
  onApprove,
  onReject,
  onEdit,
  onRemoveStep,
  className,
}: PlanPreviewProps) {
  const steps = action.planSteps || [];
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["summary", "plan"])
  );

  const toggle = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const totalPatients = action.targetPatients?.length || 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card overflow-hidden",
        className
      )}
    >
      {/* Step 1: Plan Summary */}
      <SectionHeader
        icon={<FileText className="size-3.5 text-[#e32168]" />}
        title="Plan Summary"
        stepNumber={1}
        isOpen={expandedSections.has("summary")}
        onToggle={() => toggle("summary")}
      />
      {expandedSections.has("summary") && (
        <div className="px-4 pb-3 text-xs text-muted-foreground/70 leading-relaxed ai-expand-enter">
          <div className="bg-[#e32168]/[0.03] border border-[#e32168]/8 rounded-lg p-3 mt-1">
            <p className="text-foreground/80">
              I will{" "}
              {steps.map((s, i) => (
                <span key={s.id}>
                  ({i + 1}) {s.description.toLowerCase()}
                  {i < steps.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
            {totalPatients > 0 && (
              <p className="mt-2 font-medium text-[#e32168]">
                This will affect {totalPatients} patient
                {totalPatients > 1 ? "s" : ""}.
              </p>
            )}

            {/* Gate Ranking & SLA Timeout Profile */}
            {(action.reversibility || action.timeoutPolicy) && (
              <div className="mt-3 pt-2.5 border-t border-border/30 grid grid-cols-2 gap-2 text-[10px] font-mono">
                {action.reversibility && (
                  <div className="bg-card px-2 py-1.5 rounded border border-border/40">
                    <span className="text-muted-foreground/50 block text-[9px]">Gate Type:</span>
                    <strong className={cn(
                      "capitalize",
                      action.reversibility === "irreversible" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                      {action.reversibility} Gate
                    </strong>
                  </div>
                )}
                {action.timeoutPolicy && (
                  <div className="bg-card px-2 py-1.5 rounded border border-border/40">
                    <span className="text-muted-foreground/50 block text-[9px]">SLA Timeout:</span>
                    <strong className="text-foreground/80">
                      {action.timeoutPolicy.durationHours}h ({action.timeoutPolicy.actionOnTimeout})
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* Grounding Verification Check */}
            {action.selfReflectionVerification && (
              <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between text-[10px]">
                <span className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Grounding Pass: {action.selfReflectionVerification.status.toUpperCase()}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/50">
                  Verified against: {action.selfReflectionVerification.verifiedAgainst.join(", ")}
                </span>
              </div>
            )}

            {/* Alternatives Evaluated & Discarded */}
            {action.alternativesConsidered && action.alternativesConsidered.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-border/30 space-y-1">
                <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-wider block">
                  Alternatives Considered & Discarded:
                </span>
                {action.alternativesConsidered.map((alt, i) => (
                  <div key={i} className="text-[10px] text-muted-foreground/60 bg-muted/20 px-2 py-1 rounded border border-border/20 italic">
                    &bull; {alt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Assumptions */}
      <SectionHeader
        icon={<Lightbulb className="size-3.5 text-amber-500" />}
        title="Assumptions"
        stepNumber={2}
        isOpen={expandedSections.has("assumptions")}
        onToggle={() => toggle("assumptions")}
      />
      {expandedSections.has("assumptions") && (
        <div className="px-4 pb-3 text-xs text-muted-foreground/70 leading-relaxed ai-expand-enter">
          <ul className="space-y-1.5 mt-1">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>
                Messages will be sent from the practice's main Spruce line.{" "}
                <button className="text-[#e32168] hover:underline font-medium cursor-pointer">
                  Change
                </button>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>
                Scheduled for morning delivery (9:00 AM).{" "}
                <button className="text-[#e32168] hover:underline font-medium cursor-pointer">
                  Change
                </button>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>
                "High-risk" means clinical risk tier 3+.{" "}
                <button className="text-[#e32168] hover:underline font-medium cursor-pointer">
                  Change
                </button>
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Step 3: Scope */}
      <SectionHeader
        icon={<Target className="size-3.5 text-blue-500" />}
        title="Scope"
        stepNumber={3}
        isOpen={expandedSections.has("scope")}
        onToggle={() => toggle("scope")}
      />
      {expandedSections.has("scope") && (
        <div className="px-4 pb-3 ai-expand-enter">
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="rounded-lg bg-blue-500/[0.04] border border-blue-500/10 p-2 text-center">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 ai-counter-pulse tabular-nums">
                {totalPatients || "23"}
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                Patients affected
              </p>
            </div>
            <div className="rounded-lg bg-purple-500/[0.04] border border-purple-500/10 p-2 text-center">
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400 ai-counter-pulse tabular-nums">
                {steps.length}
              </p>
              <p className="text-[10px] text-muted-foreground/60">Steps</p>
            </div>
            <div className="rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10 p-2 text-center">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 ai-counter-pulse tabular-nums">
                {steps.filter((s) => s.isSkippable).length}
              </p>
              <p className="text-[10px] text-muted-foreground/60">Optional</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Editable Plan */}
      <SectionHeader
        icon={<Edit3 className="size-3.5 text-purple-500" />}
        title="Editable Plan"
        stepNumber={4}
        isOpen={expandedSections.has("plan")}
        onToggle={() => toggle("plan")}
      />
      {expandedSections.has("plan") && (
        <div className="px-4 pb-3 space-y-2 mt-1 ai-expand-enter">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={cn(
                "ai-stagger-item flex items-start gap-2.5 rounded-lg border px-3 py-2 text-xs transition-all duration-200",
                step.isEditable
                  ? "border-border/50 hover:border-[#e32168]/25 bg-card"
                  : "border-border/30 bg-muted/20"
              )}
            >
              <span className="text-muted-foreground/40 font-mono text-[10px] mt-0.5 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground/80">
                    {step.label}
                  </span>
                  <ConfidenceBadge
                    tier={step.confidenceTier}
                    compact
                  />
                </div>
                <p className="text-muted-foreground/60 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {step.isEditable && onEdit && (
                  <button
                    onClick={() => onEdit(step.id)}
                    className="grid size-6 place-items-center rounded text-muted-foreground/40 hover:text-[#e32168] hover:bg-[#e32168]/5 transition-all duration-200 cursor-pointer"
                    title="Edit step"
                  >
                    <Edit3 className="size-3" />
                  </button>
                )}
                {step.isSkippable && onRemoveStep && (
                  <button
                    onClick={() => onRemoveStep(step.id)}
                    className="grid size-6 place-items-center rounded text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                    title="Skip step"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions — HIG: careful language for execution */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border/40 bg-muted/10">
        <Button
          size="sm"
          className="flex-1 text-xs font-medium bg-[#e32168] hover:bg-[#ca0055] text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97]"
          onClick={onApprove}
        >
          <ShieldCheck className="size-3.5 mr-1.5" />
          Approve & Execute
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-medium transition-all duration-200 active:scale-[0.97]"
          onClick={onReject}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Section Header — with step numbering ───────────────────────────────────

function SectionHeader({
  icon,
  title,
  stepNumber,
  isOpen,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  stepNumber: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-foreground/80 hover:bg-muted/20 transition-all duration-200 border-b border-border/30 cursor-pointer"
    >
      <span className="text-[9px] font-bold text-muted-foreground/30 tabular-nums shrink-0 w-4">
        {stepNumber}.
      </span>
      {icon}
      <span>{title}</span>
      <ChevronDown
        className={cn(
          "size-3.5 ml-auto text-muted-foreground/30 transition-transform duration-300",
          !isOpen && "-rotate-90"
        )}
      />
    </button>
  );
}
