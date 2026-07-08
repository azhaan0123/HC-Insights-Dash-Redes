import type { ReactNode } from "react";
import { Link } from "react-router";
import { Download, Share2, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ContextualWikiButton } from "../wiki/ContextualWikiButton";

export type Crumb = { label: string; to?: string };

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  /** Optional control rendered next to the title (toggle group / tabs). */
  leading?: ReactNode;
  /** Optional custom action elements rendered on the right side of header. */
  actions?: ReactNode;
  showIconActions?: boolean;
  showGenerateReport?: boolean;
  showFilters?: boolean;
  onFiltersClick?: () => void;
};

export function PageHeader({
  title,
  subtitle,
  crumbs,
  leading,
  actions,
  showIconActions = true,
  showGenerateReport = true,
  showFilters = true,
  onFiltersClick,
}: PageHeaderProps) {
  return (
    <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-border/60">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {crumbs && crumbs.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            <nav className="flex items-center gap-1.5 text-xs">
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  {c.to ? (
                    <Link to={c.to} className="text-muted-foreground/70 hover:text-foreground">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground/70">{c.label}</span>
                  )}
                  <span className="text-border">/</span>
                </span>
              ))}
              <span className="text-muted-foreground/90">{title}</span>
            </nav>
            <h2 className="text-foreground text-balance font-semibold" style={{ fontSize: "1.4rem", lineHeight: 1.2 }}>
              {title}
            </h2>
          </div>
        ) : (
          <div className="flex flex-col">
            <h2 className="text-foreground text-balance font-semibold" style={{ fontSize: "1.4rem", lineHeight: 1.2 }}>
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {leading}
      </div>

      <div className="flex items-center gap-2">
        <ContextualWikiButton />
        {actions}
        {showFilters && (
          <Button id="tour-step-14" variant="outline" size="sm" className="gap-2" onClick={onFiltersClick}>
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            Filters
          </Button>
        )}
        {showIconActions && (
          <>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <Share2 className="size-4" />
            </Button>
          </>
        )}
        {showGenerateReport && (
          <div id="tour-step-13" className="relative">
            <Button variant="outline" size="sm" className="gap-2 pl-4 pr-3.5">
              <Download className="size-4" />
              Generate Report
            </Button>
            <Badge className="absolute -right-2 -top-2 h-4 bg-green-600 px-1 text-[9px] text-white">
              NEW
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
