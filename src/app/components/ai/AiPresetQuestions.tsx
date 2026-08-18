/**
 * AiPresetQuestions — Context-aware preset question chips.
 * Questions change based on current page/route and active agent type.
 *
 * Apple HIG: "Offer diverse, predefined example inputs that hint
 * at what's possible for a feature."
 */

import React from "react";
import { Sparkles, MessageCircle } from "../../lib/icons";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { getPresetsForRoute } from "./aiData";

interface AiPresetQuestionsProps {
  onSelectQuestion: (question: string) => void;
  className?: string;
}

export function AiPresetQuestions({
  onSelectQuestion,
  className,
}: AiPresetQuestionsProps) {
  const { pageContext } = useAiContext();
  const presets = getPresetsForRoute(pageContext.route);

  return (
    <div className={cn("space-y-2 px-1", className)}>
      <div className="flex items-center gap-1.5">
        <MessageCircle className="size-3 text-[#e32168]/60" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
          Try asking
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((q, i) => (
          <button
            key={q}
            onClick={() => onSelectQuestion(q)}
            className={cn(
              "ai-stagger-item rounded-lg border border-border/60 px-3 py-2 text-[11px] text-foreground/70 leading-tight text-left transition-all duration-200 cursor-pointer",
              "hover:border-[#e32168]/30 hover:bg-[#e32168]/[0.03] hover:text-[#e32168] hover:shadow-sm",
              "active:scale-[0.97]"
            )}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
