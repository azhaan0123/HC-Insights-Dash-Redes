import { useState, type ReactNode } from "react";
import { FilterBar, type FilterChip } from "./FilterBar";
import { PageHeader, type Crumb } from "./PageHeader";
import { ManageFiltersSidebar } from "./ManageFiltersSidebar";

type PageProps = {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  leading?: ReactNode;
  actions?: ReactNode;
  chips?: FilterChip[];
  children: ReactNode;
  showGenerateReport?: boolean;
  showIconActions?: boolean;
  showFilters?: boolean;
};

/** Standard page scaffold: header + filter chip bar + padded body. */
export function Page({
  title,
  subtitle,
  crumbs,
  leading,
  actions,
  chips: initialChips,
  children,
  showGenerateReport = true,
  showIconActions = true,
  showFilters = true,
}: PageProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [chips, setChips] = useState<FilterChip[]>(initialChips || []);

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <PageHeader
        title={title}
        subtitle={subtitle}
        crumbs={crumbs}
        leading={leading}
        actions={actions}
        showGenerateReport={showGenerateReport}
        showIconActions={showIconActions}
        showFilters={showFilters}
        onFiltersClick={() => setIsFiltersOpen(true)}
      />
      {chips && chips.length > 0 && <FilterBar chips={chips} onChipsChange={setChips} onFiltersClick={() => setIsFiltersOpen(true)} />}
      <div className="space-y-4 px-6 py-5 min-w-0 flex-1 animate-fade-in-up">{children}</div>

      <ManageFiltersSidebar
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        chips={chips}
        onApply={setChips}
      />
    </div>
  );
}
