import type { ReactNode } from "react";
import { Check } from "../../lib/icons";
import { cn } from "../ui/utils";

export type ToggleOption = { value: string; label: string; icon?: ReactNode };

/** Pill toggle group used across the dashboard (Overall/Refills, CSAT/NPS, etc.). */
export function ToggleTabs({
  value,
  onChange,
  options,
  withCheck = false,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: ToggleOption[];
  withCheck?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-md border bg-card p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {active && withCheck && <Check className="size-3.5" />}
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Underlined text tabs (e.g. Recent Encounters / Survey Sent / ...). */
export function TextTabs({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: ToggleOption[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-6 border-b", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-2 text-sm transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
