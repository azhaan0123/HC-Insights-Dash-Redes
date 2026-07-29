import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { FilterChip } from "./FilterBar";

type ManageFiltersSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chips: FilterChip[];
  onApply: (chips: FilterChip[]) => void;
};

export function ManageFiltersSidebar({ open, onOpenChange, chips, onApply }: ManageFiltersSidebarProps) {
  const [localChips, setLocalChips] = useState<FilterChip[]>(chips);

  useEffect(() => {
    if (open) {
      setLocalChips(chips);
    }
  }, [open, chips]);

  const updateChipValue = (index: number, value: string) => {
    const newChips = [...localChips];
    newChips[index] = { ...newChips[index], value };
    setLocalChips(newChips);
  };

  const handleApply = () => {
    onApply(localChips);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalChips(chips);
  };

  // Convert mm-dd-yyyy or mm/dd/yyyy to yyyy-mm-dd for input type="date"
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
      // Check if it's already yyyy-mm-dd
      if (parts[0].length === 4) return dateStr;
      // Assuming mm-dd-yyyy
      const [m, d, y] = parts;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return dateStr;
  };

  // Convert back to mm-dd-yyyy for display in the chip
  const formatInputForChip = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3 && parts[0].length === 4) {
      const [y, m, d] = parts;
      return `${m}-${d}-${y}`;
    }
    return dateStr;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col overflow-y-hidden">
        <SheetHeader>
          <SheetTitle>Manage Filters</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 space-y-5 overflow-y-auto py-4 px-4 -mr-4">
          {localChips.map((chip, index) => {
            const hasOptions = chip.options && chip.options.length > 0;
            const isDate = chip.label.toLowerCase().includes("date");
            return (
              <div key={chip.label} className="space-y-1.5">
                <Label className="text-muted-foreground text-xs font-normal">Select {chip.label}</Label>
                {hasOptions ? (
                  <Select value={chip.value} onValueChange={(v) => updateChipValue(index, v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${chip.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {chip.options!.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    type={isDate ? "date" : "text"} 
                    value={isDate ? formatDateForInput(chip.value) : chip.value}
                    onChange={(e) => {
                      const val = isDate ? formatInputForChip(e.target.value) : e.target.value;
                      updateChipValue(index, val);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <SheetFooter className="flex flex-col gap-3 sm:flex-col sm:space-x-0 mt-auto pt-6 pb-2 border-t">
          <SheetDescription className="text-[11px] text-muted-foreground">
            Note: After changing any filters, click Apply to update the results.
          </SheetDescription>
          <div className="flex gap-4 w-full">
            <Button className="flex-1" onClick={handleApply}>
              Apply
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
