# 02. Dashboard & KPI Widgets

Dashboard and KPI widgets are specialized presentation components crafted specifically for complex healthcare analytics, financial metrics, and clinical tracking.

---

## 1. KpiCard (`src/app/components/dashboard/KpiCard.tsx`)

### Purpose
The `KpiCard` is a highly structured, interactive summary card designed to surface top-line clinical or financial metrics (e.g., Total Population, Risk-Adjusted PMPM, Preventive Gap Closure Rate). It supports drill-down clicks, inline sub-metric breakdowns, and guided onboarding tour targeting.

### Key Props & Interface
```tsx
export type KpiSub = {
  value: string;
  label: string;
  className?: string;
  tooltip?: string;
};

export interface KpiCardProps {
  id?: string;               // Dom ID used for onboarding tours (e.g., "tour-step-15")
  title: string;             // Card headline
  value?: React.ReactNode;   // Primary metric display (large typography)
  caption?: React.ReactNode; // Supporting trend text or period comparison
  subs?: KpiSub[];           // Split segments (e.g. "Compliant: 82% / Non-Compliant: 18%")
  icon?: LucideIcon;         // Monochrome leading icon
  info?: string;             // Detailed definition surfaced via info hover icon
  empty?: boolean;           // Renders placeholder state if data is unavailable
  selected?: boolean;        // Active selection border ring for cross-filtering
  className?: string;
  onClick?: () => void;      // Triggers interactive selection or drill-down modal
}
```

### Accessibility & Interactive Features
* Automatically applies `role="button"` and `tabIndex={0}` when `onClick` is provided.
* Handles both `Enter` and `Space` keypress events to trigger actions via keyboard navigation.
* Integrated `TooltipProvider` displays medical metric definitions when hovering over the info icon.

---

## 2. DataTable (`src/app/components/dashboard/DataTable.tsx`)

### Purpose
A powerful, feature-dense tabular grid built around `@tanstack/react-table` and custom UI primitives. Tailored for displaying large patient rosters, utilization gap lists, and network provider directories.

### Key Capabilities
* **Sorting & Filtering**: Supports client-side or server-side sorting across columns, along with debounced global text search.
* **Row Selection**: Built-in checkbox column allowing multi-patient selection for batch outreach or export workflows.
* **Pagination Controls**: Configurable page sizes (10, 25, 50 rows per page) with direct jump-to-page controls.
* **Custom Cell Rendering**: Seamlessly renders rich UI elements inside cells such as `ICD10Code` pills, status `Badge` indicators, and action dropdowns (`cells.tsx`).

---

## 3. Analytics Charts (`src/app/components/dashboard/charts.tsx`)

### Purpose
Wraps Recharts primitives (`ResponsiveContainer`, `AreaChart`, `BarChart`, `LineChart`) to enforce uniform styling, responsive heights, and direct mapping to theme color variables (`--chart-1` through `--chart-5`).

### Available Chart Wrappers
* **TrendLineChart**: Displays longitudinal metrics over time (e.g., Monthly Emergency Department visits).
* **StackedBarChart**: Visualizes multi-category distributions (e.g., Patient population by chronic condition risk tier).
* **ComparisonBarChart**: Side-by-side bar plots comparing current performance against clinical benchmarks.

---

## 4. ChartTooltip (`src/app/components/dashboard/ChartTooltip.tsx`)

### Purpose
A custom Recharts tooltip payload component that replaces default browser styling with high-contrast, polished cards matching `--card` and `--card-foreground` tokens. Formats numeric data with appropriate healthcare prefixes/suffixes (e.g., `$`, `%`, `pts`).

---

## 5. ToggleTabs (`src/app/components/dashboard/ToggleTabs.tsx`)

### Purpose
A compact pill-style segmentation toggle used within dashboard widgets to switch data perspectives instantly (e.g., switching a chart between *Count of Patients* vs. *Percentage of Cohort*, or *Cost* vs. *Utilization*).

---

## 6. EmptyState (`src/app/components/dashboard/EmptyState.tsx`)

### Purpose
Provides structured feedback when a filtered dataset returns zero results or an EHR integration is still processing.

### Key Props & Interface
```tsx
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

---

## 7. SkeletonPrimitives (`src/app/components/dashboard/SkeletonPrimitives.tsx`)

### Purpose
Pre-composed shimmer loading skeletons designed specifically for complex dashboard layouts to eliminate layout shifts (`CLS`) while async API queries resolve.

### Exported Primitives
* `KpiGridSkeleton`: Renders 4 responsive KPI card placeholders.
* `TableSkeleton`: Renders header rows and 5 simulated data rows with randomized cell width placeholders.
* `ChartCardSkeleton`: Renders a card container with simulated Y-axis lines and animated bar/area placeholders.
