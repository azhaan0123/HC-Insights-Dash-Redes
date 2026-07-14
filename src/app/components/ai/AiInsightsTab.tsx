/**
 * AiInsightsTab — Page-scoped, agent-driven insights panel.
 * Dynamically shows insight cards based on current route with
 * confidence badges, reasoning chains, and one-click action dispatch.
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { getInsightsForRoute } from "./aiData";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { AGENT_META } from "./aiTypes";
import type { AIInsight } from "./aiTypes";

interface AiInsightsTabProps {
  className?: string;
}

export function AiInsightsTab({ className }: AiInsightsTabProps) {
  const { pageContext } = useAiContext();
  const insights = getInsightsForRoute(pageContext.route);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Context Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-[#e32168]" />
          <span className="text-xs font-semibold text-foreground">
            Insights for {pageContext.pageName}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {pageContext.contextDescription}
        </p>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="grid size-12 place-items-center rounded-xl bg-muted mb-3">
              <Sparkles className="size-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground/60">
              No active insights
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Navigate to a module page to see agent insights
            </p>
          </div>
        ) : (
          insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Insight Card ───────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: AIInsight }) {
  const [expanded, setExpanded] = useState(false);
  const agentMeta = AGENT_META[insight.agentType];

  const TrendIcon =
    insight.metric?.trend === "up"
      ? TrendingUp
      : insight.metric?.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-all hover:shadow-sm",
        insight.priority === "critical"
          ? "border-red-500/25 bg-red-500/[0.02]"
          : "border-border"
      )}
    >
      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: agentMeta.color }}
            />
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider truncate">
              {agentMeta.label}
            </span>
          </div>
          <ConfidenceBadge tier={insight.confidenceTier} compact />
        </div>

        <h3 className="text-xs font-bold text-foreground leading-snug">
          {insight.title}
        </h3>

        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
          {insight.description}
        </p>

        {/* Metric card */}
        {insight.metric && (
          <div
            className="flex items-center gap-3 mt-3 rounded-lg px-3 py-2"
            style={{ backgroundColor: `${agentMeta.color}08` }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: agentMeta.color }}
            >
              {insight.metric.value}
            </span>
            <div className="flex-1">
              <span className="text-[10px] text-muted-foreground">
                {insight.metric.label}
              </span>
              {insight.metric.trendValue && (
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendIcon
                    className={cn(
                      "size-3",
                      insight.metric.trend === "up" && "text-red-500",
                      insight.metric.trend === "down" && "text-emerald-500",
                      insight.metric.trend === "flat" && "text-muted-foreground"
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {insight.metric.trendValue}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cross-module badge */}
        {insight.isCrossModule && (
          <div className="flex items-center gap-1.5 mt-2">
            <Zap className="size-3 text-amber-500" />
            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Cross-module pattern detected
            </span>
          </div>
        )}
      </div>

      {/* Reasoning (Progressive Disclosure) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/20 transition-colors border-t border-border/50 cursor-pointer"
      >
        <ChevronDown
          className={cn(
            "size-3 transition-transform",
            !expanded && "-rotate-90"
          )}
        />
        {expanded ? "Hide reasoning" : "Show reasoning"}
      </button>
      {expanded && (
        <div className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed animate-fade-in-up">
          {insight.reasoning}
        </div>
      )}

      {/* Actions */}
      {insight.actions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {insight.actions.map((action, i) => (
            <Button
              key={action.label}
              size="sm"
              variant={i === 0 ? "default" : "outline"}
              className={cn(
                "text-[11px] h-7",
                i === 0 &&
                  "bg-[#e32168] hover:bg-[#ca0055] text-white shadow-sm"
              )}
            >
              {action.label}
              {i === 0 && <ArrowUpRight className="size-3 ml-1" />}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
