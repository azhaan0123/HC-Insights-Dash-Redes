/**
 * TrustGradient — Trust tier management UI.
 * Shows current autonomy tier per agent, graduation prompts,
 * and per-action-type auto-approve toggles.
 */

import React from "react";
import {
  Eye,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
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
  }
> = {
  preview: {
    label: "Preview",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20",
  },
  supervised: {
    label: "Supervised",
    icon: Shield,
    color: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/20",
  },
  autonomous: {
    label: "Autonomous",
    icon: Zap,
    color: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
  },
};

export function TierBadge({ tier, className }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier];
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border",
        cfg.bgClass,
        cfg.borderClass,
        cfg.color,
        className
      )}
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

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden ai-graduation-glow",
        className
      )}
      style={{
        borderColor: `${agentMeta.color}30`,
        background: `linear-gradient(135deg, ${agentMeta.color}08, transparent)`,
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="grid size-6 place-items-center rounded-lg text-white"
            style={{ backgroundColor: agentMeta.color }}
          >
            <Sparkles className="size-3" />
          </div>
          <span className="text-xs font-bold text-foreground">
            Ready to Upgrade
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
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

        <div className="flex items-center gap-2 mb-3">
          <TierBadge tier={currentTier} />
          <ArrowRight className="size-3.5 text-muted-foreground/40" />
          <TierBadge tier={nextTier} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 text-xs font-medium shadow-sm"
            style={{ backgroundColor: agentMeta.color }}
            onClick={onUpgrade}
          >
            <CheckCircle2 className="size-3.5 mr-1.5" />
            Enable {nextTier === "supervised" ? "Supervised" : "Autonomous"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground"
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
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: meta.color }}
              />
              <span className="text-xs font-medium text-foreground">
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
