import type { ReactNode } from "react";
import { cn } from "../ui/utils";

/** Opaque record IDs: monospace, truncated, full value on hover. */
export function IdCell({ id }: { id: string }) {
  return (
    <span
      title={id}
      className="block max-w-[120px] truncate font-mono text-xs text-primary"
    >
      {id}
    </span>
  );
}

/** Yes/No style boolean badge. */
export function BoolBadge({ value }: { value: boolean | string }) {
  const yes = value === true || value === "Yes";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        yes ? "bg-green-50 text-green-700" : "bg-secondary text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", yes ? "bg-green-500" : "bg-muted-foreground/50")} />
      {typeof value === "boolean" ? (yes ? "Yes" : "No") : value}
    </span>
  );
}

/** Muted placeholder for empty cells. */
export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground/70">{children}</span>;
}
