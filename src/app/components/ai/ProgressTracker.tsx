/**
 * ProgressTracker — Real-time collapsible timeline for agent plan execution.
 * Shows step states: ✓ completed, → in progress, ⏸ pending, ✗ failed
 */

import React, { useState } from "react";
import { Check, Loader2, Pause, X, ChevronDown } from "lucide-react";
import { cn } from "../ui/utils";
import type { PlanStep } from "./aiTypes";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface ProgressTrackerProps {
  steps: PlanStep[];
  isCollapsed?: boolean;
  className?: string;
}

const STEP_ICON: Record<PlanStep["status"], React.ReactNode> = {
  completed: (
    <div className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white">
      <Check className="size-3" strokeWidth={3} />
    </div>
  ),
  "in-progress": (
    <div className="grid size-5 place-items-center rounded-full bg-[#e32168] text-white ai-progress-pulse">
      <Loader2 className="size-3 animate-spin" />
    </div>
  ),
  pending: (
    <div className="grid size-5 place-items-center rounded-full bg-muted text-muted-foreground/50 border border-border">
      <Pause className="size-2.5" />
    </div>
  ),
  failed: (
    <div className="grid size-5 place-items-center rounded-full bg-red-500 text-white">
      <X className="size-3" strokeWidth={3} />
    </div>
  ),
  skipped: (
    <div className="grid size-5 place-items-center rounded-full bg-muted text-muted-foreground/40 border border-border border-dashed">
      <span className="text-[9px] font-bold">—</span>
    </div>
  ),
};

export function ProgressTracker({
  steps,
  isCollapsed: initialCollapsed = false,
  className,
}: ProgressTrackerProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const completedCount = steps.filter(
    (s) => s.status === "completed" || s.status === "skipped"
  ).length;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Loader2
            className={cn(
              "size-3.5 text-[#e32168]",
              completedCount < steps.length && "animate-spin"
            )}
          />
          <span className="font-semibold text-foreground">
            Execution Progress
          </span>
          <span className="text-muted-foreground font-medium">
            {completedCount}/{steps.length} steps
          </span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            collapsed && "-rotate-90"
          )}
        />
      </button>

      {/* Steps */}
      {!collapsed && (
        <div className="px-4 pb-3 space-y-1">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-start gap-3 py-1.5">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center shrink-0">
                {STEP_ICON[step.status]}
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-4 mt-1",
                      step.status === "completed"
                        ? "bg-emerald-500/40"
                        : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      step.status === "completed"
                        ? "text-muted-foreground"
                        : step.status === "in-progress"
                          ? "text-foreground"
                          : "text-muted-foreground/60"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.durationMs !== undefined && step.status === "completed" && (
                    <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                      [{(step.durationMs / 1000).toFixed(1)}s]
                    </span>
                  )}
                </div>
                {step.status === "in-progress" &&
                  step.progressCurrent !== undefined &&
                  step.progressTotal !== undefined && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e32168] rounded-full transition-all duration-300"
                          style={{
                            width: `${(step.progressCurrent / step.progressTotal) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                        {step.progressCurrent}/{step.progressTotal}
                      </span>
                    </div>
                  )}
                {step.status === "failed" && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    Step failed — click to retry
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
