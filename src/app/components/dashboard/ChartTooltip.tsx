import type { TooltipProps } from "recharts";

/**
 * Standard chart tooltip matching the design system.
 * Renders as a compact pill with: [colored square] [label] [value]
 *
 * Usage with Recharts:
 *   <RechartsTooltip content={<ChartTooltip />} />
 *
 * For custom value formatting pass a `valueFormatter`:
 *   <RechartsTooltip content={<ChartTooltip valueFormatter={(v) => `$${v}`} />} />
 *
 * Color mapping: pass `colorMap` to associate dataKeys with specific colors:
 *   <RechartsTooltip content={<ChartTooltip colorMap={{ inPerson: 'var(--primary)', virtual: '#3b82f6' }} />} />
 */
type ChartTooltipProps = TooltipProps<number, string> & {
  colorMap?: Record<string, string>;
  valueFormatter?: (value: number) => string;
};

export function ChartTooltip({ active, payload, colorMap, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      {payload.map((entry, i) => {
        const color =
          colorMap?.[entry.dataKey as string] ??
          entry.color ??
          entry.payload?.color ??
          entry.payload?.fill ??
          "var(--foreground)";

        // Use the real `value` field from the payload item if available (handles displayValue trick)
        const displayVal = entry.payload?.value !== undefined && entry.payload?.displayValue !== undefined
          ? entry.payload.value
          : entry.value;

        const name =
          (entry.name === "value" || entry.name === "displayValue" || !entry.name) && entry.payload?.name
            ? entry.payload.name
            : (entry.name ?? entry.payload?.name ?? "Value");

        return (
          <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-popover-foreground whitespace-nowrap">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{name}</span>
            <span className="ml-auto tabular-nums font-semibold">{fmt(displayVal as number)}</span>
          </div>
        );
      })}
    </div>
  );
}
