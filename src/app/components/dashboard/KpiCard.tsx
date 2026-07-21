import type { ReactNode } from "react";
import { Info, type LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "../ui/utils";

export type KpiSub = { value: string; label: string; className?: string; tooltip?: string };

type KpiCardProps = {
  id?: string;
  title: string;
  value?: ReactNode;
  /** Small caption beneath the primary value. */
  caption?: ReactNode;
  /** Inline split metrics (e.g. "Overall / Refills" or breakdown segments). */
  subs?: KpiSub[];
  /** Optional leading icon (flat, monochrome) for quicker scanning. */
  icon?: LucideIcon;
  /** Explanatory text surfaced on the info icon. */
  info?: string;
  empty?: boolean;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
};

export function KpiCard({
  id,
  title,
  value,
  caption,
  subs,
  icon: Icon,
  info,
  empty,
  selected,
  className,
  onClick,
}: KpiCardProps) {
  const interactive = Boolean(onClick);
  return (
    <Card
      id={id || "tour-step-15"}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        "group relative gap-0 rounded-xl border border-transparent bg-card p-6 shadow-sm transition-[box-shadow,transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        interactive &&
          "cursor-pointer hover:shadow-md hover:bg-accent/30 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        selected && "ring-2 ring-primary/40 shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          {Icon && <Icon className="size-4 shrink-0 text-muted-foreground/70" />}
          <span className="text-sm leading-tight text-foreground/80">{title}</span>
        </div>
        {info ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground/50 hover:text-muted-foreground">
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-56">{info}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Info className="size-3.5 shrink-0 text-muted-foreground/50" />
        )}
      </div>

      {empty ? (
        <p className="mt-6 text-sm text-muted-foreground">No data available</p>
      ) : subs && subs.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-y-2">
          {subs.map((s, index) => {
            const content = (
              <div className={cn("flex flex-col", s.tooltip && "cursor-help")}>
                <span
                  className={cn("tracking-tight text-foreground tabular-nums font-medium", s.className)}
                  style={{ fontSize: "1.4rem", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}
                >
                  {s.value}
                </span>
                <span className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            );

            let wrapped = content;
            if (s.tooltip) {
              wrapped = (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent>{s.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return (
              <div key={s.label} className="flex items-center">
                {wrapped}
                {index < subs.length - 1 && (
                  <div className="mx-4 h-10 w-px bg-border" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3">
          <div
            className="tracking-tight text-foreground tabular-nums font-medium"
            style={{ fontSize: "1.85rem", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </div>
          {caption && <p className="mt-1.5 text-[11px] text-muted-foreground">{caption}</p>}
        </div>
      )}
    </Card>
  );
}
