/**
 * RightAiSidebar — Context-aware AI copilot sidebar.
 * Four tabs: Chat | Insights | Actions | Audit
 * Dynamic header showing current agent context and active page.
 * Notification badge on Actions tab for pending approval count.
 */

import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { AGENT_META } from "./aiTypes";
import { AiChatInterface } from "./AiChatInterface";
import { AiInsightsTab } from "./AiInsightsTab";
import { AiActionsTab } from "./AiActionsTab";
import { AiAuditTab } from "./AiAuditTab";

type SidebarTab = "chat" | "insights" | "actions" | "audit";

interface RightAiSidebarProps {
  className?: string;
}

export function RightAiSidebar({ className }: RightAiSidebarProps) {
  const { isOpen, setIsOpen, pageContext, pendingCount } = useAiContext();
  const [activeTab, setActiveTab] = useState<SidebarTab>("insights");

  if (!isOpen) return null;

  const agentMeta = AGENT_META[pageContext.agentType];

  const tabs: { key: SidebarTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: "chat", label: "Chat", icon: MessageSquare },
    { key: "insights", label: "Insights", icon: Sparkles },
    { key: "actions", label: "Actions", icon: Zap, badge: pendingCount },
    { key: "audit", label: "Audit", icon: Shield },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full w-[420px] border-l border-border bg-card shrink-0 ai-sidebar-enter",
        className
      )}
    >
      {/* Header */}
      <div
        className="shrink-0 border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${agentMeta.color}08, transparent)`,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div
              className="grid size-8 place-items-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: agentMeta.color }}
            >
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-none">
                Helix
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {agentMeta.label} · {pageContext.pageName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="grid size-7 place-items-center rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Context Banner */}
        <div className="px-4 pb-2">
          <div
            className="rounded-lg px-3 py-1.5 text-[10px] text-foreground/60 leading-relaxed"
            style={{ backgroundColor: `${agentMeta.color}06` }}
          >
            <span
              className="font-semibold"
              style={{ color: agentMeta.color }}
            >
              Active:
            </span>{" "}
            {pageContext.contextDescription}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium border-b-2 transition-all cursor-pointer relative",
                  isActive
                    ? "border-[#e32168] text-[#e32168]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute top-1.5 right-2 grid size-4 place-items-center rounded-full bg-[#e32168] text-white text-[9px] font-bold leading-none ai-badge-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "chat" && <AiChatInterface />}
        {activeTab === "insights" && <AiInsightsTab />}
        {activeTab === "actions" && <AiActionsTab />}
        {activeTab === "audit" && <AiAuditTab />}
      </div>
    </div>
  );
}
