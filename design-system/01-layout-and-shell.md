# 01. Layout & Application Shell Components

Layout components form the structural backbone of the HealthCompiler dashboard. They ensure a consistent viewport structure across desktop and mobile devices while managing global state contexts such as sidebar toggling, active filtering dimensions, and AI co-pilot panels.

---

## 1. AppShell (`src/app/components/layout/AppShell.tsx`)

### Purpose
The `AppShell` acts as the root structural wrapper for authenticated dashboard routes. It establishes a multi-pane flex grid containing the left navigation sidebar, top topbar/header, central scrollable page canvas, and optional right-hand AI assistant drawer.

### Key Props & Interface
```tsx
interface AppShellProps {
  children: React.ReactNode;
}
```

### Architectural Details
* **Sidebar Integration**: Wraps children within the `SidebarProvider` context, allowing child views or topbar toggles to programmatically open/collapse the left navigation.
* **Header Bar**: Houses global actions including tenant/practice selector, theme toggle (light/dark), notification alerts, user profile menu, and the AI Co-pilot trigger button.
* **Main Content Area**: Configured with responsive padding (`px-4 md:px-8 py-6`) and vertical scrolling isolated from the fixed sidebars.

---

## 2. AppSidebar (`src/app/components/layout/AppSidebar.tsx`)

### Purpose
Provides comprehensive navigation across all healthcare insight domains (Executive Summary, Clinical Utilization, Patient Engagement, Financial Performance, and Administration).

### Component Structure
* **Workspace Header**: Displays current healthcare network/practice branding with a dropdown menu for multi-tenant practice switching.
* **Core Navigation Groups**: Organized using structured sections:
  * *Analytics*: Home / Executive Dashboard, Utilization Gaps, Engagement Trends.
  * *Clinical Management*: Active Patients, Care Gaps, Risk Stratification.
  * *Administration*: User Management, Network Associations, Data Onboarding.
* **Footer Status**: Displays system synchronization timestamp and EHR connector status indicators.

---

## 3. Page (`src/app/components/layout/Page.tsx`)

### Purpose
A standardized container primitive used at the root of every page component (`Home.tsx`, `UtilizationGaps.tsx`, etc.). It enforces uniform vertical spacing and max-width layout bounds.

### Key Props & Interface
```tsx
interface PageProps {
  children: React.ReactNode;
  className?: string;
  /** Sets maximum width constraints (e.g., 'max-w-7xl' vs full screen width) */
  fullWidth?: boolean;
}
```

---

## 4. PageHeader (`src/app/components/layout/PageHeader.tsx`)

### Purpose
Renders the standard page title area with clear typographic hierarchy, optional status badges, breadcrumbs, and right-aligned action toolbars (e.g., Export PDF, Share Report, Refresh Data).

### Key Props & Interface
```tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  actions?: React.ReactNode;
  className?: string;
}
```

### Usage Example
```tsx
<PageHeader
  title="Utilization Gaps & Care Opportunities"
  description="Monitor preventative screening deficits and chronic care adherence across primary care networks."
  badge={{ label: "Live EHR Sync", variant: "default" }}
  actions={
    <div className="flex gap-2">
      <Button variant="outline" size="sm">Export CSV</Button>
      <Button size="sm">Generate Action Plan</Button>
    </div>
  }
/>
```

---

## 5. FilterBar (`src/app/components/layout/FilterBar.tsx`)

### Purpose
A horizontal floating toolbar that enables multi-dimensional slicing of healthcare data. Allows clinicians and analysts to filter dashboard views by Date Range, Payer/Insurance Network, Provider/Facility, and Patient Risk Tier.

### Key Features
* **Active Filter Chips**: Displays currently applied filters as removable badges (`Badge`) with quick clear buttons.
* **Quick Presets**: Single-click date toggles (e.g., *YTD*, *Last 12 Months*, *Q3 2026*).
* **Manage Filters Trigger**: Opens the `ManageFiltersSidebar` drawer for advanced boolean logic or granular clinical criteria selection.

---

## 6. ManageFiltersSidebar (`src/app/components/layout/ManageFiltersSidebar.tsx`)

### Purpose
A slide-out sheet overlay (`Sheet`) triggered from the `FilterBar` that provides deep, categorized filter selections without cluttering the primary dashboard layout.

### Capabilities
* **Granular Checkbox Trees**: Select specific ICD-10 diagnostic cohorts, CPT billing codes, or primary care locations.
* **Persistent Filter State**: Saves filter sets to user session preferences or URL query parameters for shareable analytical views.
