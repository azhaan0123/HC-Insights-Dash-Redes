import React from 'react';
import { Sparkles, X, MessageSquare, Lightbulb, Zap, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { AiChatInterface } from "./AiChatInterface";
import { AiInsightsTab } from "./AiInsightsTab";
import { AiActionsTab } from "./AiActionsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "../ui/utils";

export function RightAiSidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean; 
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div 
      className={cn(
        "h-full bg-card flex flex-col shrink-0 transition-[width] duration-200 ease-linear overflow-hidden hidden xl:flex shadow-2xl z-30",
        isOpen ? "w-[420px] border-l border-border/80 dark:border-border" : "w-0 border-l-0"
      )}
    >
      <div className="w-[420px] flex-1 flex flex-col min-h-0 h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/80 dark:border-border bg-gradient-to-b from-slate-50/80 dark:from-muted/20 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#FF6B2B] to-[#ff8c5a] text-white shadow-md shadow-[#FF6B2B]/25">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-foreground">HealthCompiler AI</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready</span>
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground dark:text-muted-foreground/70 font-normal">Cross-domain clinical & financial co-pilot</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)} 
            className="size-8 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-secondary dark:hover:bg-card cursor-pointer"
            title="Close AI Assistant"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Tabs Container */}
        <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-5 pt-3.5 pb-3 border-b border-border/80 dark:border-border shrink-0 bg-background/50">
            <TabsList className="w-full grid grid-cols-3 bg-secondary dark:bg-card/60 p-1 h-9 rounded-xl border border-border/60 dark:border-border/50">
              <TabsTrigger 
                value="chat" 
                className="text-xs font-semibold h-full rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="size-3.5" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="text-xs font-semibold h-full rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="size-3.5 text-amber-500" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className="text-xs font-semibold h-full rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="size-3.5 text-purple-500" />
                <span>Actions</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden outline-none flex flex-col min-h-0 h-full data-[state=inactive]:hidden">
            {/* Context Banner inside Chat */}
            <div className="bg-[#FF6B2B]/5 px-5 py-2.5 text-xs text-foreground border-b border-[#FF6B2B]/10 shrink-0 flex items-center gap-2">
              <Activity className="size-3.5 text-[#FF6B2B] shrink-0" />
              <span className="truncate"><span className="font-semibold text-[#FF6B2B]">Workspace Sync:</span> Analyzing data across Dashboards, HCC, and ACO.</span>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <AiChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 mt-0 overflow-hidden outline-none flex flex-col min-h-0 h-full data-[state=inactive]:hidden bg-muted/50 dark:bg-muted/10">
            <AiInsightsTab />
          </TabsContent>

          <TabsContent value="actions" className="flex-1 mt-0 overflow-hidden outline-none flex flex-col min-h-0 h-full data-[state=inactive]:hidden bg-muted/50 dark:bg-muted/10">
            <AiActionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
