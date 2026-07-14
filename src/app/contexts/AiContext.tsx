/**
 * AiContext — React context provider managing all AI state.
 * Provides current page context (via useLocation), agent autonomy tier
 * tracking, action queue state, audit trail, and trust metrics.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";
import {
  type AgentType,
  type AutonomyTier,
  type AIAction,
  type AuditRecord,
  type ActionStatus,
  type RejectionReason,
  type PageContext,
  resolvePageContext,
} from "../components/ai/aiTypes";
import {
  MOCK_ACTIONS,
  MOCK_AUDIT_RECORDS,
  calculateTrustMetrics,
} from "../components/ai/aiData";

// ─── Context Interface ─────────────────────────────────────────────────────

interface AiContextValue {
  /** Whether the AI sidebar is open */
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;

  /** Current page context resolved from the route */
  pageContext: PageContext;

  /** Autonomy tier per agent type */
  autonomyTiers: Record<AgentType, AutonomyTier>;
  setAutonomyTier: (agent: AgentType, tier: AutonomyTier) => void;

  /** Approval counts per agent (for graduation tracking) */
  approvalCounts: Record<AgentType, number>;

  /** Action queue */
  actions: AIAction[];
  pendingCount: number;
  approveAction: (id: string, finalOutput?: string) => void;
  rejectAction: (id: string, reason: RejectionReason, note?: string) => void;
  editAction: (id: string, edits: Partial<AIAction>) => void;
  undoAction: (id: string) => void;

  /** Audit trail */
  auditRecords: AuditRecord[];

  /** Trust metrics */
  trustMetrics: {
    avgReviewTimeMs: number;
    disagreementRate: number;
    autoApprovedPct: number;
    totalActions: number;
  };

  /** Should we show the graduation prompt for this agent? */
  shouldShowGraduation: (agent: AgentType) => boolean;
  dismissGraduation: (agent: AgentType) => void;
}

const AiContext = createContext<AiContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

const DEFAULT_TIERS: Record<AgentType, AutonomyTier> = {
  "care-gap": "preview",
  "hcc-coding": "preview",
  "clinical-outcomes": "preview",
  "claims-cost": "preview",
  "mips-aco": "preview",
  employer: "preview",
  "cross-module": "preview",
};

export function AiContextProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const pageContext = useMemo(() => resolvePageContext(pathname), [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [autonomyTiers, setAutonomyTiers] =
    useState<Record<AgentType, AutonomyTier>>(DEFAULT_TIERS);
  const [approvalCounts, setApprovalCounts] = useState<
    Record<AgentType, number>
  >({
    "care-gap": 3,
    "hcc-coding": 2,
    "clinical-outcomes": 1,
    "claims-cost": 4,
    "mips-aco": 0,
    employer: 0,
    "cross-module": 0,
  });
  const [graduationDismissed, setGraduationDismissed] = useState<
    Set<AgentType>
  >(new Set());

  const [actions, setActions] = useState<AIAction[]>(MOCK_ACTIONS);
  const [auditRecords, setAuditRecords] =
    useState<AuditRecord[]>(MOCK_AUDIT_RECORDS);

  const pendingCount = useMemo(
    () => actions.filter((a) => a.status === "pending").length,
    [actions]
  );

  // ── Action Handlers ──────────────────────────────────────────────────────

  const approveAction = useCallback(
    (id: string, finalOutput?: string) => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "approved" as ActionStatus,
                decidedAt: new Date().toISOString(),
                finalOutput: finalOutput || a.suggestedAction,
              }
            : a
        )
      );
      // Increment approval count for this agent type
      const action = actions.find((a) => a.id === id);
      if (action) {
        setApprovalCounts((prev) => ({
          ...prev,
          [action.agentType]: (prev[action.agentType] || 0) + 1,
        }));
        // Add audit record
        const newRecord: AuditRecord = {
          ai_decision_id: `aud-${Date.now()}`,
          workflow: action.agentType,
          input_ref: action.targetPatients?.[0]?.name || action.title,
          model_version: "helix-v2.4.1",
          prompt_version: "action-v1",
          raw_output: action.suggestedAction,
          final_output: finalOutput || action.suggestedAction,
          confidence: action.confidence,
          confidence_tier: action.confidenceTier,
          risk_tier:
            action.priority === "critical" || action.priority === "high"
              ? "high"
              : action.priority === "medium"
                ? "medium"
                : "low",
          status: "approved",
          reviewer_id: "current-user",
          created_at: action.createdAt,
          decided_at: new Date().toISOString(),
          review_duration_ms: Math.floor(Math.random() * 30000 + 15000),
        };
        setAuditRecords((prev) => [newRecord, ...prev]);
      }
    },
    [actions]
  );

  const rejectAction = useCallback(
    (id: string, reason: RejectionReason, note?: string) => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "rejected" as ActionStatus,
                rejectionReason: reason,
                rejectionNote: note,
                decidedAt: new Date().toISOString(),
              }
            : a
        )
      );
      const action = actions.find((a) => a.id === id);
      if (action) {
        const newRecord: AuditRecord = {
          ai_decision_id: `aud-${Date.now()}`,
          workflow: action.agentType,
          input_ref: action.targetPatients?.[0]?.name || action.title,
          model_version: "helix-v2.4.1",
          prompt_version: "action-v1",
          raw_output: action.suggestedAction,
          final_output: "Rejected",
          confidence: action.confidence,
          confidence_tier: action.confidenceTier,
          risk_tier:
            action.priority === "critical" || action.priority === "high"
              ? "high"
              : "medium",
          status: "rejected",
          reviewer_id: "current-user",
          reviewer_reason: reason,
          reviewer_note: note,
          created_at: action.createdAt,
          decided_at: new Date().toISOString(),
          review_duration_ms: Math.floor(Math.random() * 60000 + 20000),
        };
        setAuditRecords((prev) => [newRecord, ...prev]);
      }
    },
    [actions]
  );

  const editAction = useCallback((id: string, edits: Partial<AIAction>) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...edits } : a))
    );
  }, []);

  const undoAction = useCallback((id: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "undone" as ActionStatus,
              decidedAt: new Date().toISOString(),
            }
          : a
      )
    );
  }, []);

  // ── Autonomy Tier Management ─────────────────────────────────────────────

  const setAutonomyTier = useCallback(
    (agent: AgentType, tier: AutonomyTier) => {
      setAutonomyTiers((prev) => ({ ...prev, [agent]: tier }));
    },
    []
  );

  const shouldShowGraduation = useCallback(
    (agent: AgentType) => {
      if (graduationDismissed.has(agent)) return false;
      const count = approvalCounts[agent] || 0;
      const currentTier = autonomyTiers[agent];
      // Show graduation prompt at 4 approvals for preview → supervised
      if (currentTier === "preview" && count >= 4) return true;
      // Show at 10 for supervised → autonomous
      if (currentTier === "supervised" && count >= 10) return true;
      return false;
    },
    [approvalCounts, autonomyTiers, graduationDismissed]
  );

  const dismissGraduation = useCallback((agent: AgentType) => {
    setGraduationDismissed((prev) => new Set([...prev, agent]));
  }, []);

  // ── Trust Metrics ────────────────────────────────────────────────────────

  const trustMetrics = useMemo(
    () => calculateTrustMetrics(auditRecords),
    [auditRecords]
  );

  // ── Value ────────────────────────────────────────────────────────────────

  const value: AiContextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      pageContext,
      autonomyTiers,
      setAutonomyTier,
      approvalCounts,
      actions,
      pendingCount,
      approveAction,
      rejectAction,
      editAction,
      undoAction,
      auditRecords,
      trustMetrics,
      shouldShowGraduation,
      dismissGraduation,
    }),
    [
      isOpen,
      pageContext,
      autonomyTiers,
      setAutonomyTier,
      approvalCounts,
      actions,
      pendingCount,
      approveAction,
      rejectAction,
      editAction,
      undoAction,
      auditRecords,
      trustMetrics,
      shouldShowGraduation,
      dismissGraduation,
    ]
  );

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAiContext(): AiContextValue {
  const ctx = useContext(AiContext);
  if (!ctx) {
    throw new Error("useAiContext must be used within AiContextProvider");
  }
  return ctx;
}
