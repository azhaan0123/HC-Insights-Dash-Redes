import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { cn } from "../ui/utils";

export type Column<T> = {
  key: string;
  header: ReactNode;
  /** Optional grouped sub-columns rendered as a second header row. */
  cell?: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  rowKey: (row: T, index: number) => string;
  emptyMessage?: string;
  dense?: boolean;
  attached?: boolean;
  showFilterBar?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  pageSize: initialPageSize = 10,
  rowKey,
  emptyMessage = "No records found",
  dense = false,
  attached = false,
  showFilterBar = true,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const filteredRows = useMemo(() => {
    let result = rows;
    if (globalFilter) {
      const lower = globalFilter.toLowerCase();
      result = result.filter((row) => {
        return columns.some((c) => {
          const val = (row as Record<string, any>)[c.key];
          return val && String(val).toLowerCase().includes(lower);
        });
      });
    }
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const valA = (a as Record<string, any>)[sortConfig.key];
        const valB = (b as Record<string, any>)[sortConfig.key];
        if (valA < valB) return sortConfig.dir === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [rows, columns, globalFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const visible = useMemo(
    () => filteredRows.slice(start, start + pageSize),
    [filteredRows, start, pageSize],
  );

  const pageButtons = useMemo(() => {
    const out: number[] = [];
    const from = Math.max(1, current - 2);
    const to = Math.min(totalPages, from + 4);
    for (let p = from; p <= to; p++) out.push(p);
    return out;
  }, [current, totalPages]);

  const alignClass = (a?: string) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  return (
    <div className={cn(
      "overflow-hidden flex flex-col w-full min-w-0 bg-card",
      attached ? "border-transparent shadow-none" : "rounded-xl border border-border/60 shadow-sm"
    )}>
      {showFilterBar && (
        <div className="flex items-center justify-between gap-4 border-b border-border/60 bg-muted/20 px-4 py-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search all columns..." 
              value={globalFilter}
              onChange={e => { setGlobalFilter(e.target.value); setPage(1); }}
              className="pl-9 h-8 text-xs bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            <Select 
              value={sortConfig ? `${sortConfig.key}-${sortConfig.dir}` : "none"} 
              onValueChange={v => {
                if (v === "none") setSortConfig(null);
                else {
                  const [key, dir] = v.split("-");
                  setSortConfig({ key, dir: dir as "asc" | "desc" });
                }
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[160px] text-xs bg-background">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default order</SelectItem>
                {columns.flatMap(c => {
                  const label = typeof c.header === "string" ? c.header : c.key;
                  return [
                    <SelectItem key={`${c.key}-asc`} value={`${c.key}-asc`}>{label} (A-Z)</SelectItem>,
                    <SelectItem key={`${c.key}-desc`} value={`${c.key}-desc`}>{label} (Z-A)</SelectItem>
                  ];
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <div className="overflow-auto w-full min-w-0 flex flex-col">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="border-b border-border/60 bg-[#f8f9fa] dark:bg-muted/40 hover:bg-[#f8f9fa] dark:hover:bg-muted/40">
              {columns.map((c) => {
                const isSorted = sortConfig?.key === c.key;
                const dir = isSorted ? sortConfig.dir : null;

                return (
                  <TableHead
                    key={c.key}
                    className={cn(
                      "h-11 whitespace-nowrap bg-[#f8f9fa] dark:bg-muted/40 text-[11px] font-bold tracking-wider text-muted-foreground/90 uppercase select-none cursor-pointer hover:bg-muted/80 hover:text-foreground transition-colors group/th",
                      alignClass(c.align),
                      c.className,
                    )}
                    onClick={() => {
                      if (sortConfig?.key !== c.key) {
                        setSortConfig({ key: c.key, dir: "asc" });
                      } else if (sortConfig?.dir === "asc") {
                        setSortConfig({ key: c.key, dir: "desc" });
                      } else {
                        setSortConfig(null);
                      }
                      setPage(1);
                    }}
                  >
                    <div className={cn(
                      "inline-flex items-center gap-1.5",
                      c.align === "right" && "flex-row-reverse justify-end",
                      c.align === "center" && "justify-center w-full"
                    )}>
                      <span>{c.header}</span>
                      <span className="inline-flex items-center justify-center size-4 shrink-0 rounded">
                        {dir === "asc" ? (
                          <ArrowUp className="size-3 text-primary font-bold" />
                        ) : dir === "desc" ? (
                          <ArrowDown className="size-3 text-primary font-bold" />
                        ) : (
                          <ArrowUpDown className="size-3 text-muted-foreground/70 opacity-40 group-hover/th:opacity-100 transition-opacity" />
                        )}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center text-muted-foreground/70">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((row, i) => (
                <TableRow
                  key={rowKey(row, start + i)}
                  className="border-b border-border/60 transition-[background-color,transform] duration-150 ease-out hover:bg-secondary/40"
                >
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(
                        dense ? "py-2 px-4" : "py-3.5 px-4",
                        "text-xs font-medium text-foreground",
                        alignClass(c.align),
                        c.className,
                      )}
                    >
                      {c.cell ? c.cell(row) : (row as Record<string, ReactNode>)[c.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing <span className="text-foreground font-semibold tabular-nums">{filteredRows.length === 0 ? 0 : start + 1}</span> to{" "}
          <span className="text-foreground font-semibold tabular-nums">{Math.min(start + pageSize, filteredRows.length)}</span> of{" "}
          <span className="text-foreground font-semibold tabular-nums">{filteredRows.length}</span> entries
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              className="grid size-7 place-items-center rounded border bg-background transition-[background-color,opacity] duration-150 disabled:opacity-40"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              <ChevronLeft className="size-3.5" />
            </button>
            {pageButtons.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "grid size-7 place-items-center rounded border text-xs",
                  p === current
                    ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 font-bold shadow-2xs"
                    : "bg-background hover:bg-accent font-medium text-foreground",
                )}
              >
                {p}
              </button>
            ))}
            {totalPages > pageButtons[pageButtons.length - 1] && (
              <>
                <span className="px-1">…</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="grid h-7 min-w-7 place-items-center rounded border bg-background px-1 text-xs hover:bg-accent"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              className="grid size-7 place-items-center rounded border bg-background transition-[background-color,opacity] duration-150 disabled:opacity-40"
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>Records per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
