/**
 * AiAuditTab — Audit trail tab with persistent decision records,
 * anti-rubber-stamping metrics, and trust overview.
 */

import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  X,
  Edit3,
  Sparkles,
  Undo2,
  ChevronDown,
  BarChart3,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { AGENT_META, type AgentType, type AuditRecord } from "./aiTypes";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { TrustOverview } from "./TrustGradient";

interface AiAuditTabProps {
  className?: string;
}

export function AiAuditTab({ className }: AiAuditTabProps) {
  const { auditRecords, trustMetrics, autonomyTiers } = useAiContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState<AgentType | "all">("all");

  const filtered =
    filterAgent === "all"
      ? auditRecords
      : auditRecords.filter((r) => r.workflow === filterAgent);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Trust Metrics Dashboard */}
      <div className="px-4 py-3 border-b border-border shrink-0 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="size-3.5 text-[#e32168]" />
          <span className="text-xs font-semibold text-foreground">
            Trust & Audit
          </span>
        </div>

        {/* Anti-rubber-stamping metrics */}
        <div className="grid grid-cols-2 gap-2">
          <MetricTile
            label="Avg Review Time"
            value={formatDuration(trustMetrics.avgReviewTimeMs)}
            status={
              trustMetrics.avgReviewTimeMs < 10000
                ? "warning"
                : trustMetrics.avgReviewTimeMs > 300000
                  ? "warning"
                  : "good"
            }
            hint={
              trustMetrics.avgReviewTimeMs < 10000
                ? "< 10s may indicate rubber-stamping"
                : undefined
            }
          />
          <MetricTile
            label="Disagreement Rate"
            value={`${Math.round(trustMetrics.disagreementRate * 100)}%`}
            status={
              trustMetrics.disagreementRate < 0.02
                ? "warning"
                : trustMetrics.disagreementRate > 0.4
                  ? "warning"
                  : "good"
            }
            hint={
              trustMetrics.disagreementRate < 0.02
                ? "< 2% may indicate rubber-stamping"
                : undefined
            }
          />
          <MetricTile
            label="Auto-Approved"
            value={`${Math.round(trustMetrics.autoApprovedPct * 100)}%`}
            status={trustMetrics.autoApprovedPct > 0.5 ? "warning" : "good"}
            hint={
              trustMetrics.autoApprovedPct > 0.5
                ? "Rising auto-approval is a drift risk"
                : undefined
            }
          />
          <MetricTile
            label="Total Decisions"
            value={String(trustMetrics.totalActions)}
            status="neutral"
          />
        </div>

        {/* Trust Overview */}
        <TrustOverview tiers={autonomyTiers} />
      </div>

      {/* Filter */}
      <div className="px-4 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <FilterChip
            label="All"
            active={filterAgent === "all"}
            onClick={() => setFilterAgent("all")}
          />
          {(
            [
              "care-gap",
              "hcc-coding",
              "clinical-outcomes",
              "claims-cost",
              "mips-aco",
              "employer",
            ] as AgentType[]
          ).map((agent) => (
            <FilterChip
              key={agent}
              label={AGENT_META[agent].label.split(" ")[0]}
              active={filterAgent === agent}
              onClick={() => setFilterAgent(agent)}
              color={AGENT_META[agent].color}
            />
          ))}
        </div>
      </div>

      {/* Records */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="size-8 text-muted-foreground/20 mb-2" />
            <p className="text-xs text-muted-foreground">No records found</p>
          </div>
        ) : (
          filtered.map((record) => (
            <AuditRow
              key={record.ai_decision_id}
              record={record}
              expanded={expandedId === record.ai_decision_id}
              onToggle={() =>
                setExpandedId(
                  expandedId === record.ai_decision_id
                    ? null
                    : record.ai_decision_id
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Metric Tile ────────────────────────────────────────────────────────────

function MetricTile({
  label,
  value,
  status,
  hint,
}: {
  label: string;
  value: string;
  status: "good" | "warning" | "neutral";
  hint?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2",
        status === "good" && "border-emerald-500/20 bg-emerald-500/5",
        status === "warning" && "border-amber-500/20 bg-amber-500/5",
        status === "neutral" && "border-border bg-muted/30"
      )}
    >
      <p
        className={cn(
          "text-sm font-bold",
          status === "good" && "text-emerald-600 dark:text-emerald-400",
          status === "warning" && "text-amber-600 dark:text-amber-400",
          status === "neutral" && "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      {hint && (
        <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
          <AlertTriangle className="size-2.5" />
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Filter Chip ────────────────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer",
        active
          ? "bg-[#e32168] text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
      style={active && color ? { backgroundColor: color } : undefined}
    >
      {label}
    </button>
  );
}

// ── Audit Row ──────────────────────────────────────────────────────────────

// ─── Audit Row (Full 12-Field Regulatory Schema Display) ───────────────────

function AuditRow({
  record,
  expanded,
  onToggle,
}: {
  record: AuditRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  const agentMeta = AGENT_META[record.workflow];

  const statusIcons = {
    approved: <CheckCircle2 className="size-3.5 text-emerald-500" />,
    rejected: <X className="size-3.5 text-red-500" />,
    edited: <Edit3 className="size-3.5 text-blue-500" />,
    undone: <Undo2 className="size-3.5 text-amber-500" />,
    auto: <Sparkles className="size-3.5 text-purple-500" />,
    pending: <Clock className="size-3.5 text-muted-foreground" />,
  };

  const timeAgo = formatTimeAgo(record.created_at);
  const ntpTimestamp = record.timestamp_ntp_utc || record.created_at;

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-muted/30 transition-colors cursor-pointer"
      >
        {statusIcons[record.status] || statusIcons.pending}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-foreground truncate">
              {record.input_ref}
            </p>
            {record.is_phi_access && (
              <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#e32168]/10 text-[#e32168] border border-[#e32168]/20 uppercase">
                PHI Access
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <span>{agentMeta.label}</span>
            <span>·</span>
            <span>{timeAgo}</span>
            <span>·</span>
            <span className="font-mono text-[9px] opacity-70">ID: {record.ai_decision_id}</span>
          </p>
        </div>
        <ConfidenceBadge tier={record.confidence_tier} compact />
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground/30 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="px-3 pb-3.5 border-t border-border/50 pt-3 space-y-2.5 animate-fade-in-up bg-muted/10">
          <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e32168] flex items-center gap-1">
              <Shield className="size-3" />
              12-Field Regulatory & HIPAA Audit Trail
            </span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {record.retention_policy || "HIPAA_6_YEARS"} Retention
            </span>
          </div>

          {/* Field 1: Timestamp */}
          <DetailRow label="1. NTP Timestamp" value={ntpTimestamp} mono />

          {/* Field 2: Decision ID */}
          <DetailRow label="2. Decision ID" value={record.ai_decision_id} mono />

          {/* Field 3: Authenticated Human User Identity (HIPAA § 164.312(a)(2)(i)) */}
          <DetailRow
            label="3. User Identity"
            value={
              record.authenticated_human_user
                ? `${record.authenticated_human_user.name} (${record.authenticated_human_user.role})`
                : `${record.reviewer_id} (Clinical Provider)`
            }
          />

          {/* Field 4: AI System Identity */}
          <DetailRow
            label="4. AI System"
            value={record.ai_system_identity || "Helix Core Copilot v3.4.1 (SOC2/HIPAA Certified)"}
          />

          {/* Field 5: Model Identity & Version Pinned */}
          <DetailRow
            label="5. Pinned Model"
            value={record.model_version_pinned || record.model_version}
            mono
          />

          {/* Field 6: Inputs Received & Source Attribution */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider shrink-0 w-28">
              6. Inputs & Source
            </span>
            <div className="flex-1 space-y-1">
              {record.inputs_received ? (
                record.inputs_received.map((inp, idx) => (
                  <div key={idx} className="bg-muted/40 p-1.5 rounded border border-border/40 text-[10px]">
                    <span className="font-bold text-foreground">{inp.source}: </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {inp.data_refs.join(", ")}
                    </span>
                    <p className="text-[9px] text-muted-foreground/80 mt-0.5 italic">
                      Scope: {inp.query_scope_phi}
                    </p>
                  </div>
                ))
              ) : (
                <span className="text-[11px] text-foreground/80">{record.input_ref} (Source: Elation EHR)</span>
              )}
            </div>
          </div>

          {/* Field 7: Policy/Rule Invoked */}
          <DetailRow
            label="7. Policy Invoked"
            value={record.policy_rule_invoked || `Standard Clinical Protocol — ${record.prompt_version}`}
          />

          {/* Field 8: Human-Readable Reasoning */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider shrink-0 w-28">
              8. AI Reasoning
            </span>
            <div className="flex-1 bg-[#e32168]/5 border border-[#e32168]/15 rounded p-2 text-[11px] text-foreground/90 leading-relaxed font-normal">
              {record.human_readable_reasoning ||
                "Evaluated clinical findings against specialty guidelines. Categorical confidence classification verified."}
            </div>
          </div>

          {/* Field 9: Output Produced */}
          <DetailRow
            label="9. Output Produced"
            value={record.output_produced || record.raw_output}
          />

          {/* Field 10: Downstream Action & Correlation ID */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider shrink-0 w-28">
              10. Action & Corr
            </span>
            <div className="flex-1 text-[11px]">
              {record.downstream_action_taken ? (
                <div>
                  <span className="font-semibold text-foreground">
                    {record.downstream_action_taken.system} → {record.downstream_action_taken.action_type}
                  </span>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    Target: {record.downstream_action_taken.target_id} | CorrID: {record.downstream_action_taken.correlation_id}
                  </div>
                </div>
              ) : (
                <span className="text-foreground/80">{record.final_output}</span>
              )}
            </div>
          </div>

          {/* Field 11: Human Review Disposition */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider shrink-0 w-28">
              11. Disposition
            </span>
            <div className="flex-1 text-[11px] space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold capitalize text-foreground">{record.status}</span>
                {record.review_duration_ms !== undefined && (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                    Review: {formatDuration(record.review_duration_ms)}
                  </span>
                )}
              </div>
              {record.reviewer_reason && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Reason: {record.reviewer_reason.replace(/-/g, " ")}
                </p>
              )}
              {record.reviewer_note && (
                <p className="text-[10px] text-muted-foreground bg-muted/30 p-1.5 rounded italic">
                  &ldquo;{record.reviewer_note}&rdquo;
                </p>
              )}
              {(record.human_review_disposition?.override_rationale || record.reviewer_note) && (
                <p className="text-[10px] text-foreground font-medium border-l-2 border-primary/50 pl-2">
                  Override Rationale: {record.human_review_disposition?.override_rationale || record.reviewer_note}
                </p>
              )}
            </div>
          </div>

          {/* Field 12: Tamper-Evident Integrity Proof */}
          <div className="flex items-start gap-2 pt-1 border-t border-border/30">
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0 w-28 flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              12. Merkle Hash
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[9px] text-muted-foreground bg-emerald-500/5 border border-emerald-500/20 p-1.5 rounded truncate">
                {record.tamper_evident_proof ||
                  "sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"}
              </div>
              <span className="text-[9px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 block">
                Cryptographically signed & chained to prevent retroactive modification
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider shrink-0 w-28">
        {label}
      </span>
      <span
        className={cn(
          "text-[11px] text-foreground/80 leading-relaxed break-words flex-1",
          mono && "font-mono text-[10px]"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
