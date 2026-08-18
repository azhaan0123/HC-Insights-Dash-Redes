/**
 * ExceptionHandler — Three-part error structure component.
 * Renders "What happened" / "Why it happened" / "What to try next"
 * with blocking vs non-blocking visual distinction.
 *
 * Apple HIG:
 * — "Help people improve requests when blocked or undesirable results occur"
 * — "Describe what happened in plain language and offer a clear next step"
 * — "Minimize scoped or blocked output by coaching people how to be more successful"
 */

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  ArrowUpRight,
  HelpCircle,
  ChevronRight,
  Info,
} from "../../lib/icons";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import type { AIException } from "./aiTypes";
import { AGENT_META } from "./aiTypes";

interface ExceptionHandlerProps {
  exception: AIException;
  onOption?: (value: string) => void;
  onDismiss?: () => void;
  className?: string;
}

export function ExceptionHandler({
  exception,
  onOption,
  onDismiss,
  className,
}: ExceptionHandlerProps) {
  const agentMeta = AGENT_META[exception.agentType];

  const borderColor =
    exception.type === "blocking"
      ? "border-red-500/25"
      : exception.type === "escalation"
        ? "border-amber-500/25"
        : "border-blue-500/25";

  const bgGradient =
    exception.type === "blocking"
      ? "from-red-500/[0.03]"
      : exception.type === "escalation"
        ? "from-amber-500/[0.03]"
        : "from-blue-500/[0.03]";

  const iconColor =
    exception.type === "blocking"
      ? "text-red-500"
      : exception.type === "escalation"
        ? "text-amber-500"
        : "text-blue-500";

  const Icon =
    exception.type === "blocking"
      ? AlertCircle
      : exception.type === "escalation"
        ? ArrowUpRight
        : HelpCircle;

  const typeLabel =
    exception.type === "blocking"
      ? "Action Required"
      : exception.type === "escalation"
        ? "Escalated"
        : "Note";

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden bg-gradient-to-br to-transparent transition-all duration-200",
        borderColor,
        bgGradient,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30">
        <Icon className={cn("size-4 shrink-0", iconColor)} />
        <span className={cn("text-[10px] font-bold uppercase tracking-wider", iconColor)}>
          {typeLabel}
        </span>
        <span className="text-[10px] text-muted-foreground/50 ml-auto">
          {agentMeta.label}
        </span>
      </div>

      {/* What happened — HIG: "Describe what happened in plain language" */}
      <div className="px-4 pt-3 pb-1.5">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1 flex items-center gap-1">
          <span className="size-1 rounded-full bg-current opacity-40" />
          What happened
        </h4>
        <p className="text-xs text-foreground/80 leading-relaxed">
          {exception.whatHappened}
        </p>
      </div>

      {/* Why it happened */}
      <div className="px-4 pt-2 pb-1.5">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1 flex items-center gap-1">
          <span className="size-1 rounded-full bg-current opacity-40" />
          Why
        </h4>
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          {exception.whyItHappened}
        </p>
      </div>

      {/* What to try next — HIG: "offer a clear next step" */}
      <div className="px-4 pt-2 pb-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1 flex items-center gap-1">
          <span className="size-1 rounded-full bg-current opacity-40" />
          Next step
        </h4>
        <p className="text-xs text-foreground/70 leading-relaxed">
          {exception.whatToTryNext}
        </p>
      </div>

      {/* Options (for blocking exceptions) — HIG: "coaching people how to be more successful" */}
      {exception.options && exception.options.length > 0 && (
        <div className="px-4 pb-3 space-y-1.5">
          {exception.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onOption?.(opt.value)}
              className="w-full flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5 text-xs font-medium text-foreground/80 hover:border-[#e32168]/30 hover:bg-[#e32168]/[0.03] hover:text-[#e32168] transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              {opt.label}
              <ChevronRight className="size-3.5 text-muted-foreground/20" />
            </button>
          ))}
        </div>
      )}

      {/* Dismiss (for non-blocking) */}
      {exception.type === "non-blocking" && onDismiss && (
        <div className="px-4 pb-3">
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs text-muted-foreground/60 hover:text-foreground transition-all duration-200"
            onClick={onDismiss}
          >
            Understood
          </Button>
        </div>
      )}
    </div>
  );
}
