import { ChevronDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format, differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";

export type FilterChip = {
  label: string;
  value: string;
  options?: string[];
};

function Chip({ chip, onOptionSelect }: { chip: FilterChip; onOptionSelect?: (value: string) => void }) {
  const hasOptions = chip.options && chip.options.length > 0;
  const content = (
    <div
      className={[
        "flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs transition-colors",
        hasOptions ? "hover:border-primary/40 hover:bg-accent/50 cursor-pointer" : "",
      ].join(" ")}
    >
      <span className="text-muted-foreground/70">{chip.label}</span>
      <span className="text-foreground">{chip.value}</span>
      {hasOptions && <ChevronDown className="size-3 text-muted-foreground/70" />}
    </div>
  );

  if (!hasOptions) return content;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">{content}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 overflow-auto">
        {chip.options!.map((o) => (
          <DropdownMenuItem key={o} onClick={() => onOptionSelect?.(o)}>{o}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FilterBar({ chips, onChipsChange, onFiltersClick }: { chips: FilterChip[], onChipsChange?: (chips: FilterChip[]) => void, onFiltersClick?: () => void }) {
  const parseDate = (dStr: string) => {
    if (!dStr) return undefined;
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    }
    return undefined;
  };

  const startDateChip = chips.find(c => c.label === "Start Date");
  const endDateChip = chips.find(c => c.label === "End Date");

  const initialRange: DateRange | undefined = (startDateChip && endDateChip) ? {
    from: parseDate(startDateChip.value),
    to: parseDate(endDateChip.value)
  } : undefined;

  const handleRangeChange = (range: DateRange | undefined) => {
    if (!range || !onChipsChange) return;
    const newChips = [...chips];
    
    if (range.from) {
      const startIdx = newChips.findIndex(c => c.label === "Start Date");
      if (startIdx >= 0) newChips[startIdx] = { ...newChips[startIdx], value: format(range.from, "MM-dd-yyyy") };
    }
    if (range.to) {
      const endIdx = newChips.findIndex(c => c.label === "End Date");
      if (endIdx >= 0) newChips[endIdx] = { ...newChips[endIdx], value: format(range.to, "MM-dd-yyyy") };
    }
    onChipsChange(newChips);
  };

  const handleChipChange = (index: number, value: string) => {
    if (!onChipsChange) return;
    const newChips = [...chips];
    newChips[index] = { ...newChips[index], value };
    onChipsChange(newChips);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-y bg-card px-6 py-2.5">
      <button
        type="button"
        onClick={onFiltersClick}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground rounded-full border border-border bg-muted px-3 py-1.5 hover:bg-muted hover:text-foreground/90 hover:border-border transition-all duration-150 active:scale-[0.97] cursor-pointer"
      >
        <Filter className="size-3.5" />
        Filters
      </button>
      <span className="mr-1 h-4 w-px bg-border" />
      {chips.map((chip, index) => {
        const isDate = chip.label.toLowerCase().includes("date");
        if (isDate) {
          const content = (
            <div className="flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs transition-colors hover:border-primary/40 hover:bg-accent/50 cursor-pointer">
              <span className="text-muted-foreground/70">{chip.label}</span>
              <span className="text-foreground">{chip.value}</span>
            </div>
          );
          
          let duration = 0;
          if (initialRange?.from && initialRange?.to) {
            duration = differenceInDays(initialRange.to, initialRange.from) + 1;
          }

          const defaultMonth = chip.label === "End Date" ? initialRange?.to : initialRange?.from;

          return (
            <Popover key={chip.label}>
              <PopoverTrigger className="outline-none">{content}</PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={defaultMonth}
                  selected={initialRange}
                  onSelect={handleRangeChange}
                  numberOfMonths={1}
                />
                {(initialRange?.from && initialRange?.to) && (
                  <div className="p-3 border-t text-xs font-medium text-center text-muted-foreground bg-muted/20">
                    Duration: {duration} day{duration !== 1 ? 's' : ''}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          );
        }

        return <Chip key={chip.label} chip={chip} onOptionSelect={(val) => handleChipChange(index, val)} />;
      })}
    </div>
  );
}
