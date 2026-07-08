import React from 'react';
import { Sparkles, ArrowUpRight } from "lucide-react";

const PRESETS = [
  "Summarize patient risk profile",
  "Show quarterly utilization gaps",
  "Generate ACO outcomes summary",
  "Identify HCC coding drop-offs"
];

export function AiPresetQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/70 flex items-center gap-1.5">
        <Sparkles className="size-3 text-[#FF6B2B]" />
        <span>Suggested Prompts</span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onSelect(preset)}
            className="group inline-flex items-center gap-1 text-left rounded-full border border-border dark:border-border bg-background/90 hover:bg-[#FF6B2B]/5 hover:border-[#FF6B2B]/40 px-3 py-1 text-xs font-medium text-muted-foreground dark:text-muted-foreground/50 hover:text-[#FF6B2B] transition-all duration-150 shadow-2xs cursor-pointer active:scale-95"
          >
            <span>{preset}</span>
            <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#FF6B2B]" />
          </button>
        ))}
      </div>
    </div>
  );
}
