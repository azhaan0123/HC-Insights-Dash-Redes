/**
 * AiPresetQuestions — Context-aware preset question chips.
 * Questions change based on current page/route and active agent type.
 */

import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
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
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles className="size-3 text-[#e32168]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Suggested for {pageContext.pageName}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((q) => (
          <button
            key={q}
            onClick={() => onSelectQuestion(q)}
            className="rounded-lg border border-border px-3 py-2 text-[11px] text-foreground/80 hover:border-[#e32168]/40 hover:bg-[#e32168]/5 hover:text-[#e32168] transition-all cursor-pointer leading-tight text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
