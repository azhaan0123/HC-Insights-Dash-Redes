# 04. Navigation & Menu Components

Navigation components ensure accessible, keyboard-navigable routing and hierarchical disclosure throughout the dashboard application. Built on Radix UI primitives.

---

## 1. Sidebar Primitive (`src/app/components/ui/sidebar.tsx`)

### Purpose
The foundational UI engine powering `AppSidebar`. Provides context providers, keyboard shortcut listeners (`Cmd/Ctrl + B`), responsive mobile overlays, and collapsible sidebar state management (`expanded`, `collapsed`, `floating`, `inset`).

### Key Sub-Components
* `SidebarProvider`: React Context provider managing collapse state, cookies, and mobile drawer toggles.
* `SidebarTrigger`: Button rendering sidebar toggle icons (`PanelLeft`).
* `SidebarGroup` & `SidebarGroupLabel`: Logical section containers with uppercase tracking typography.
* `SidebarMenu`, `SidebarMenuItem` & `SidebarMenuButton`: Accessible button primitives supporting active state styling and tooltip hints when collapsed.

---

## 2. Breadcrumb (`src/app/components/ui/breadcrumb.tsx`)

### Purpose
Renders breadcrumb trail links inside page headers, helping users navigate deep clinical hierarchies (e.g., *Networks > Acme Healthcare > Cardiology Clinic > Quality Metrics*).

### Exported Primitives
* `Breadcrumb`: Root `<nav aria-label="breadcrumb">` container.
* `BreadcrumbList` & `BreadcrumbItem`: Ordered list formatting.
* `BreadcrumbLink` & `BreadcrumbPage`: Anchor tag styling and non-clickable terminal page styling (`aria-current="page"`).
* `BreadcrumbSeparator` & `BreadcrumbEllipsis`: Chevron separators (`ChevronRight`) and collapsed trail dots.

---

## 3. DropdownMenu (`src/app/components/ui/dropdown-menu.tsx`)

### Purpose
Accessible floating menu triggered by buttons or profile icons. Supports multi-level nesting, radio selection groups, boolean checkbox items, and keyboard shortcut indicators.

### Usage Example
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Export Data</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuLabel>Format Options</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={exportCsv}>
      <span>Spreadsheet (.CSV)</span>
      <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem onClick={exportPdf}>
      <span>Executive Report (.PDF)</span>
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 4. Menubar (`src/app/components/ui/menubar.tsx`)

### Purpose
Horizontal desktop-style menu bar used for complex administrative interfaces or data onboarding studios requiring top-level file/edit/view menus.

---

## 5. NavigationMenu (`src/app/components/ui/navigation-menu.tsx`)

### Purpose
Radix-powered horizontal navigation bar with animated dropdown viewports. Ideal for high-level module navigation across multi-tenant enterprise views.

---

## 6. Tabs (`src/app/components/ui/tabs.tsx`)

### Purpose
Switches content views within the same URL route. Used extensively in KPI detail panels, AI drawers, and data onboarding steps.

### Exported Primitives
* `Tabs`: Root state controller.
* `TabsList`: Horizontal or vertical pill container (`bg-muted rounded-lg p-1`).
* `TabsTrigger`: Accessible tab button supporting active state transitions (`data-[state=active]:bg-background data-[state=active]:shadow-sm`).
* `TabsContent`: Focusable panel displayed when corresponding trigger is active.

---

## 7. Pagination (`src/app/components/ui/pagination.tsx`)

### Purpose
Standardized pagination controls for tables and large patient rosters.

### Exported Primitives
* `Pagination`, `PaginationContent`, `PaginationItem`.
* `PaginationPrevious` & `PaginationNext`: Accessible labeled buttons with chevron iconography.
* `PaginationEllipsis`: Visual skip indicator for large page counts.

---

## 8. useMobile Hook (`src/app/components/ui/use-mobile.ts`)

### Purpose
A performant React hook utilizing `window.matchMedia` (`max-width: 768px`) to dynamically detect mobile breakpoints. Instructs layout components like `Sidebar` and `FilterBar` to render as bottom sheets or slide-over drawers on smaller viewports.
