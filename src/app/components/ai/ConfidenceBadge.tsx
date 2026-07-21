/**
 * ConfidenceBadge — Three-tier visual confidence indicator.
 * High (90%+): Solid emerald with checkmark
 * Medium (70-89%): Hatched amber with explanation tooltip
 * Low (<70%): Red warning with micro-confirmation
 */

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "../ui/utils";
import type { ConfidenceTier } from "./aiTypes";

interface ConfidenceBadgeProps {
  tier: ConfidenceTier;
  score?: number;
  explanation?: string;
  compact?: boolean;
  className?: string;
  variant?: "default" | "speedometer";
}

export function ConfidenceSpeedometer({
  tier,
  score = 0.95,
  explanation,
  className,
}: {
  tier: ConfidenceTier;
  score?: number;
  explanation?: string;
  className?: string;
}) {
  const totalBars = 40;
  const filledBars = Math.round(score * totalBars);

  // Colors based on tier
  const activeBgClass =
    tier === "high"
      ? "bg-emerald-500 dark:bg-emerald-400"
      : tier === "medium"
        ? "bg-amber-500 dark:bg-amber-400"
        : "bg-red-500 dark:bg-red-400";

  const textClass =
    tier === "high"
      ? "text-emerald-600 dark:text-emerald-400"
      : tier === "medium"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const labelText =
    tier === "high"
      ? "High Confidence"
      : tier === "medium"
        ? "Verify Details"
        : "Low Confidence";

  return (
    <div className={cn("w-full py-4 space-y-3.5", className)}>
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          AI Confidence Rating
        </span>
      </div>

      {/* Main Score and Rating Text */}
      <div className="flex items-baseline gap-2.5">
        <span className={cn("text-4xl font-medium tracking-tight leading-none", textClass)}>
          {Math.round(score * 100)}%
        </span>
        <span className={cn("text-base font-normal tracking-wide leading-none", textClass)}>
          {labelText}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex items-center gap-[3px] w-full">
        {Array.from({ length: totalBars }).map((_, i) => {
          const isActive = i < filledBars;
          return (
            <div
              key={i}
              className={cn(
                "h-6 flex-1 rounded-[1px] transition-all duration-300",
                isActive
                  ? activeBgClass
                  : "bg-zinc-200 dark:bg-zinc-800"
              )}
            />
          );
        })}
      </div>

      {explanation && (
        <p className="text-sm text-muted-foreground leading-relaxed pt-1.5 border-t border-border/40 mt-1">
          {explanation}
        </p>
      )}
    </div>
  );
}

export function ConfidenceBadge({
  tier,
  score,
  explanation,
  compact = false,
  className,
  variant = "default",
}: ConfidenceBadgeProps) {
  if (variant === "speedometer") {
    return (
      <ConfidenceSpeedometer
        tier={tier}
        score={score}
        explanation={explanation}
        className={className}
      />
    );
  }

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
          tier === "high" &&
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
          tier === "medium" &&
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 border-dashed",
          tier === "low" &&
            "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
          className
        )}
        title={explanation}
      >
        {tier === "high" && <span className="size-1.5 rounded-full bg-emerald-500" />}
        {tier === "medium" && <span className="size-1.5 rounded-full bg-amber-500" />}
        {tier === "low" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
        {tier === "high" && "Confident"}
        {tier === "medium" && "Verify"}
        {tier === "low" && "Uncertain"}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
        tier === "high" &&
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25",
        tier === "medium" &&
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 border-dashed",
        tier === "low" &&
          "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/25 ai-badge-low",
        className
      )}
    >
      {tier === "high" && (
        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
      )}
      {tier === "medium" && (
        <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
      )}
      {tier === "low" && (
        <ShieldAlert className="size-3.5 text-red-500 shrink-0 animate-pulse" />
      )}

      <div className="flex flex-col gap-0.5">
        <span className="font-semibold leading-none">
          {tier === "high" && "High Confidence"}
          {tier === "medium" && "Needs Verification"}
          {tier === "low" && "Low Confidence — Verify"}
        </span>
        {explanation && (
          <span className="text-[10px] opacity-70 leading-tight font-normal">
            {explanation}
          </span>
        )}
      </div>

      {score !== undefined && (
        <span className="ml-auto text-[10px] opacity-50 tabular-nums">
          {Math.round(score * 100)}%
        </span>
      )}
    </div>
  );
}
