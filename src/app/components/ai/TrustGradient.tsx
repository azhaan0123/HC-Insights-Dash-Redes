/**
 * TrustGradient — Trust tier management UI.
 * Shows current autonomy tier per agent, graduation prompts,
 * and per-action-type auto-approve toggles.
 *
 * Apple HIG:
 * — "Keep people in control" → Explicit opt-in for autonomy upgrades
 * — "Clearly identify when and where you use AI" → Tier labels explain AI behavior
 * — "Ensure a great experience even when generative features aren't available"
 *   → Each tier has clear fallback behavior
 */

import React from "react";
import {
  Eye,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import type { AgentType, AutonomyTier } from "./aiTypes";
import { AGENT_META } from "./aiTypes";

// ── Tier Badge ─────────────────────────────────────────────────────────────

interface TierBadgeProps {
  tier: AutonomyTier;
  className?: string;
}

const TIER_CONFIG: Record<
  AutonomyTier,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgClass: string;
    borderClass: string;
    description: string;
  }
> = {
  preview: {
    label: "Preview",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/8",
    borderClass: "border-blue-500/15",
    description: "All actions require your approval",
  },
  supervised: {
    label: "Supervised",
    icon: Shield,
    color: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/8",
    borderClass: "border-amber-500/15",
    description: "Low-risk actions auto-execute with undo",
  },
  autonomous: {
    label: "Autonomous",
    icon: Zap,
    color: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/8",
    borderClass: "border-emerald-500/15",
    description: "Auto-execute with 5% audit sampling",
  },
};

export function TierBadge({ tier, className }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier];
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-all duration-200",
        cfg.bgClass,
        cfg.borderClass,
        cfg.color,
        className
      )}
      title={cfg.description}
    >
      <Icon className="size-3" />
      {cfg.label} Mode
    </span>
  );
}

// ── Graduation Prompt ──────────────────────────────────────────────────────

interface GraduationPromptProps {
  agentType: AgentType;
  currentTier: AutonomyTier;
  approvalCount: number;
  onUpgrade: () => void;
  onDismiss: () => void;
  className?: string;
}

export function GraduationPrompt({
  agentType,
  currentTier,
  approvalCount,
  onUpgrade,
  onDismiss,
  className,
}: GraduationPromptProps) {
  const agentMeta = AGENT_META[agentType];
  const nextTier: AutonomyTier =
    currentTier === "preview" ? "supervised" : "autonomous";
  const nextConfig = TIER_CONFIG[nextTier];

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden ai-graduation-glow",
        className
      )}
      style={{
        borderColor: `${agentMeta.color}25`,
        background: `linear-gradient(135deg, ${agentMeta.color}06, transparent)`,
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="grid size-6 place-items-center rounded-lg text-white shadow-sm"
            style={{
              backgroundColor: agentMeta.color,
              boxShadow: `0 2px 6px -1px ${agentMeta.color}30`,
            }}
          >
            <Sparkles className="size-3" />
          </div>
          <span className="text-xs font-bold text-foreground">
            Ready to Upgrade
          </span>
        </div>

        <p className="text-xs text-muted-foreground/70 leading-relaxed mb-2.5">
          You've approved{" "}
          <span className="font-semibold text-foreground">
            {approvalCount} consecutive
          </span>{" "}
          {agentMeta.label} actions. Enable{" "}
          <span className="font-semibold" style={{ color: agentMeta.color }}>
            {nextTier === "supervised"
              ? "auto-execute for low-risk actions"
              : "full autonomy with 5% audit sampling"}
          </span>
          ?
        </p>

        {/* HIG: "Clearly identify when and where you use AI" — explain what changes */}
        <div className="flex items-start gap-1.5 mb-3 bg-muted/20 rounded-lg px-2.5 py-2 border border-border/30">
          <Info className="size-3 text-muted-foreground/40 mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
            {nextConfig.description}. You can revert to {TIER_CONFIG[currentTier].label} mode at any time.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <TierBadge tier={currentTier} />
          <ArrowRight className="size-3.5 text-muted-foreground/30" />
          <TierBadge tier={nextTier} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97] text-white"
            style={{
              backgroundColor: agentMeta.color,
              boxShadow: `0 2px 8px -2px ${agentMeta.color}40`,
            }}
            onClick={onUpgrade}
          >
            <CheckCircle2 className="size-3.5 mr-1.5" />
            Enable {nextTier === "supervised" ? "Supervised" : "Autonomous"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground/60 hover:text-foreground"
            onClick={onDismiss}
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Trust Overview (for Audit tab) ─────────────────────────────────────────

interface TrustOverviewProps {
  tiers: Record<AgentType, AutonomyTier>;
  className?: string;
}

export function TrustOverview({ tiers, className }: TrustOverviewProps) {
  const agents: AgentType[] = [
    "care-gap",
    "hcc-coding",
    "clinical-outcomes",
    "claims-cost",
    "mips-aco",
    "employer",
  ];

  return (
    <div className={cn("space-y-1.5", className)}>
      {agents.map((agent) => {
        const meta = AGENT_META[agent];
        const tier = tiers[agent];
        return (
          <div
            key={agent}
            className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 transition-all duration-200 hover:border-border/60 hover:bg-muted/5"
          >
            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full shrink-0 transition-all duration-200"
                style={{ backgroundColor: meta.color }}
              />
              <span className="text-xs font-medium text-foreground/80">
                {meta.label}
              </span>
            </div>
            <TierBadge tier={tier} />
          </div>
        );
      })}
    </div>
  );
}
