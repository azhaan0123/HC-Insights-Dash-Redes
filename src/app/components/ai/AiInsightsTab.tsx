/**
 * AiInsightsTab — Page-scoped, agent-driven insights panel.
 * Dynamically shows insight cards based on current route with
 * confidence badges, reasoning chains, and one-click action dispatch.
 *
 * Apple HIG:
 * — "Clearly identify when and where you use AI" → AI-generated label on each card
 * — "Let people share feedback on outputs" → Thumbs up/down on insights
 * — "Make it easy for people to refine or revert generated results" → Dismiss/retry
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from "../../lib/icons";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { getInsightsForRoute } from "./aiData";
import { ConfidenceBadge } from "./ConfidenceBadge";
import type { AIInsight } from "./aiTypes";

interface AiInsightsTabProps {
  className?: string;
}

export function AiInsightsTab({ className }: AiInsightsTabProps) {
  const { pageContext } = useAiContext();
  const rawInsights = getInsightsForRoute(pageContext.route);

  // Priority sorting: critical > high > medium > low
  const priorityOrder: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const insights = [...rawInsights].sort(
    (a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Clean Section Subheader */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/60 bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-[#e32168]" />
          <span className="text-xs font-semibold text-foreground">
            Insights for {pageContext.pageName}
          </span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/50 tabular-nums">
          {insights.length} {insights.length === 1 ? "insight" : "insights"}
        </span>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 min-h-0">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="grid size-12 place-items-center rounded-xl bg-muted/50 mb-3 ai-empty-float">
              <Sparkles className="size-5 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-foreground/60">
              No active insights
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1 max-w-[220px]">
              Navigate to a module page to see agent-generated insights
            </p>
          </div>
        ) : (
          insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Insight Card ───────────────────────────────────────────────────────────

function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const isUrgent = insight.priority === "critical" || insight.priority === "high";

  const TrendIcon =
    insight.metric?.trend === "up"
      ? TrendingUp
      : insight.metric?.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <div
      className={cn(
        "ai-stagger-item ai-insight-lift rounded-xl border transition-all duration-200 overflow-hidden",
        isUrgent
          ? "border-border/80 bg-card shadow-xs"
          : "border-border/60 bg-card/70"
      )}
    >
      {/* Card Header: Priority Pill + Confidence Badge */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          {isUrgent ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/25 uppercase tracking-wide">
              <span className="size-1.5 rounded-full bg-amber-500" />
              High Impact
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Advisory
            </span>
          )}
          <ConfidenceBadge tier={insight.confidenceTier} compact />
        </div>

        {/* 1 & 5: Strong Headline */}
        <h3 className="text-[13.5px] font-bold text-foreground leading-snug tracking-tight">
          {insight.title}
        </h3>

        {/* 1: Hero Metric Callout (Darkened/Crisp container, 2-3x font size) */}
        {insight.metric && (
          <div className="my-2.5 p-3 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border/60 flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold text-muted-foreground/75 uppercase tracking-wider truncate">
                {insight.metric.label}
              </span>
              <span className="text-2xl sm:text-[26px] font-extrabold text-foreground tabular-nums tracking-tight leading-tight mt-0.5">
                {insight.metric.value}
              </span>
            </div>
            {insight.metric.trendValue && (
              <div
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold shrink-0 tabular-nums border",
                  insight.metric.trend === "down"
                    ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                    : insight.metric.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                )}
              >
                <TrendIcon className="size-3" />
                <span>{insight.metric.trendValue}</span>
              </div>
            )}
          </div>
        )}

        {/* 5: Softened Supporting Description */}
        <p className="text-[11px] text-muted-foreground/75 leading-relaxed font-normal mt-1">
          {insight.description}
        </p>
      </div>

      {/* Clinical Rationale (Progressive Disclosure) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30 transition-all duration-200 border-t border-border/40 cursor-pointer"
      >
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            !expanded && "-rotate-90"
          )}
        />
        <span>{expanded ? "Hide clinical rationale" : "Show clinical rationale"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-3 pt-1.5 ai-expand-enter bg-muted/20 border-t border-border/30">
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-normal">
            {insight.reasoning}
          </p>
        </div>
      )}

      {/* 4: Distinct Primary vs. Secondary CTAs + Feedback */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-border/40 bg-muted/10">
        {insight.actions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {insight.actions.map((action, i) =>
              i === 0 ? (
                /* Primary CTA: Solid Brand Pink */
                <button
                  key={action.label}
                  className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold h-7 px-3 rounded-lg bg-[#e32168] hover:bg-[#ca0055] text-white shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <span>{action.label}</span>
                  <ArrowUpRight className="size-3" />
                </button>
              ) : (
                /* Secondary CTA: Plain Text Link */
                <button
                  key={action.label}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors px-1 py-1 bg-transparent border-0 cursor-pointer"
                >
                  {action.label}
                </button>
              )
            )}
          </div>
        )}

        {/* HIG: "Let people share feedback on outputs" */}
        <div className="flex items-center gap-0.5 shrink-0 ml-auto">
          <button
            onClick={() => setFeedback(feedback === "up" ? null : "up")}
            className={cn("ai-feedback-btn", feedback === "up" && "ai-feedback-flash")}
            data-active={feedback === "up"}
            aria-label="Useful insight"
            title="Useful"
          >
            <ThumbsUp className="size-2.5" />
          </button>
          <button
            onClick={() => setFeedback(feedback === "down" ? null : "down")}
            className={cn("ai-feedback-btn", feedback === "down" && "ai-feedback-flash")}
            data-active={feedback === "down"}
            aria-label="Not useful"
            title="Not useful"
          >
            <ThumbsDown className="size-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
