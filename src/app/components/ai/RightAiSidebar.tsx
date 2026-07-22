/**
 * RightAiSidebar — Context-aware AI copilot sidebar.
 * Four tabs: Chat | Insights | Actions | Audit
 * Dynamic header showing current agent context and active page.
 * Notification badge on Actions tab for pending approval count.
 *
 * Apple HIG: "Communicate where your app uses AI."
 * — Displays AI-powered disclosure pill in header.
 * — Sets clear expectations via context description.
 */

import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  X,
  Bot,
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
        className="shrink-0 border-b border-border ai-glass-header"
        style={{
          background: `linear-gradient(135deg, ${agentMeta.color}06, ${agentMeta.color}02, transparent)`,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="grid size-8 place-items-center rounded-xl text-white shadow-sm"
              style={{
                backgroundColor: agentMeta.color,
                boxShadow: `0 2px 8px -2px ${agentMeta.color}40`,
              }}
            >
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground leading-none">
                  Helix
                </h2>
                {/* Apple HIG: "Communicate where your app uses AI" */}
                <span className="ai-disclosure-pill">
                  <Bot className="size-2.5" />
                  AI-Powered
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-none">
                {agentMeta.label} · {pageContext.pageName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="grid size-7 place-items-center rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-muted/80 transition-all duration-200 cursor-pointer"
            aria-label="Close AI sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Context Banner — HIG: "Set clear expectations" */}
        <div className="px-4 pb-2.5">
          <div
            className="rounded-lg px-3 py-1.5 text-[10px] text-foreground/60 leading-relaxed flex items-start gap-1.5"
            style={{ backgroundColor: `${agentMeta.color}06` }}
          >
            <span
              className="font-semibold shrink-0"
              style={{ color: agentMeta.color }}
            >
              Active:
            </span>
            <span>{pageContext.contextDescription}</span>
          </div>
        </div>

        {/* Tab Bar — polished with sliding indicator */}
        <div className="flex px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                data-active={isActive}
                className={cn(
                  "ai-tab-indicator flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-all duration-300 cursor-pointer relative",
                  isActive
                    ? "text-[#e32168]"
                    : "text-muted-foreground/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("size-3.5 transition-transform duration-200", isActive && "scale-110")} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute top-1 right-1.5 grid size-4 place-items-center rounded-full bg-[#e32168] text-white text-[9px] font-bold leading-none ai-badge-pulse shadow-sm">
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
