# HealthCompiler Insights Dashboard — Design System Documentation

Welcome to the comprehensive Design System documentation for the **HealthCompiler Insights Dashboard (`HC-Insights-Dash-Redes`)**. This design system provides a unified architectural language, reusable React components, standardized design tokens, and domain-specific healthcare widgets designed for high visual excellence, rich analytics, and seamless AI co-pilot integration.

---

## Table of Contents

### [00. Overview & Design Tokens](./00-overview-and-tokens.md)
* Core color palettes (Light & Dark modes), brand accents (`#e32168`, `#f59e0b`), semantic status tokens.
* Typography system (`Geist Sans`, `Merriweather Serif`, `JetBrains Mono`).
* Radius hierarchy (`0.7rem`), shadows, and elevation scales.

### [01. Layout & Application Shell Components](./01-layout-and-shell.md)
* **AppShell**: Global wrapper coordinating sidebar navigation, header, page area, and right AI drawer.
* **AppSidebar**: Responsive navigation sidebar with workspace switcher, core routing links, and admin modules.
* **Page & PageHeader**: Standardized container architecture and page header with title, subtitle, badges, and action slots.
* **FilterBar & ManageFiltersSidebar**: Universal data filtering bar with drawer/sidebar customization for healthcare dimensions (practice, network, provider, payer).

### [02. Dashboard & KPI Widgets](./02-dashboard-and-kpis.md)
* **KpiCard**: Interactive summary metric card supporting primary values, sub-metrics, tooltips, tour IDs, and active selection states.
* **DataTable**: Advanced tabular component supporting pagination, multi-column sorting, row selection, search filtering, and custom cell renders.
* **Charts**: Recharts wrappers tailored with theme colors (`--chart-1` to `--chart-5`), custom legends, and responsive containers.
* **ChartTooltip**: Consistent, high-contrast hover tooltip formatting series data cleanly across all charts.
* **ToggleTabs & EmptyState**: State toggle pills and structured empty states with iconography and CTA prompts.
* **SkeletonPrimitives**: Cohesive loading placeholders for KPI grids, tables, and analytics charts.

### [03. AI Assistant & Insights Integration](./03-ai-assistant-and-insights.md)
* **RightAiSidebar**: Collapsible right-hand drawer providing context-aware AI tools alongside any view.
* **AiChatInterface**: Chat interface with natural language prompt handling, conversation history, and quick suggestions.
* **AiInsightsTab**: Automated anomaly detection, trend summaries, and prescriptive analytics feed.
* **AiActionsTab & AiPresetQuestions**: Action recommendation list and domain-specific preset prompt starters.

### [04. Navigation & Menu Components](./04-navigation-and-menus.md)
* **Sidebar (UI Primitive)**: Collapsible sidebar primitive supporting floating, inset, and fixed layouts with mobile backdrop.
* **Breadcrumb**: Hierarchical page path navigation with ellipses and separator support.
* **DropdownMenu & Menubar**: Multi-level accessible menus with submenus, checkboxes, radio items, and shortcuts.
* **NavigationMenu & Tabs**: Horizontal navigation bars and accessible tab view controllers.
* **Pagination**: Standardized table and list pagination controls.

### [05. Form Controls & Inputs](./05-forms-and-inputs.md)
* **Button**: Multi-variant action button (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) with size scales.
* **Input, Textarea & InputOTP**: Text entry fields, multi-line areas, and one-time password segmented fields.
* **Select & Command**: Native/custom dropdown selectors and searchable command combobox dialogs (`cmdk`).
* **Checkbox, RadioGroup, Switch & Toggle**: Boolean toggles, mutually exclusive option groups, and pressed-state buttons.
* **Calendar & Slider**: Date picking grids and numeric range sliders.
* **Form & Label**: React Hook Form integration utilities with accessible label bindings and validation messaging.

### [06. Overlays & Dialogs](./06-overlays-and-dialogs.md)
* **Dialog & AlertDialog**: Modal dialogs for focus-trapped tasks and destructive confirmation workflows.
* **Sheet & Drawer**: Side-slide sheets and bottom slide-up mobile drawers.
* **Popover & HoverCard**: Lightweight floating panels for contextual details and interactive popovers.
* **Tooltip & ContextMenu**: Delay-triggered informational tooltips and right-click contextual action menus.

### [07. Data Display & Feedback Primitives](./07-data-display-and-feedback.md)
* **Card, Badge & Avatar**: Structural content cards, status badges (`default`, `secondary`, `destructive`, `outline`), and user identity circles.
* **Table (UI Primitive)**: HTML table primitives (`TableHeader`, `TableRow`, `TableCell`) with hover and selected row styling.
* **Accordion & Collapsible**: Expandable content sections for FAQs and progressive disclosure.
* **Carousel & AspectRatio**: Media slide viewers and constrained aspect ratio boxes.
* **Progress, Skeleton & Sonner**: Visual completion progress bars, shimmer loading skeletons, and toast notifications.
* **ICD10Code & ImageWithFallback**: Healthcare diagnosis badge component and resilient image display with error fallbacks.

---

## Design Principles

1. **Healthcare-Grade Clarity & Scannability**: Medical metrics, financial figures, and clinical gaps must be instantly recognizable without cognitive overload.
2. **Dynamic & Responsive Interaction**: Interactive states, hover cards, keyboard navigation (`Enter`/`Space` activation), and subtle micro-transitions ensure the app feels alive and polished.
3. **Accessibility (a11y) First**: Built upon Radix UI primitives ensuring WAI-ARIA compliance, screen reader support, focus trapping, and proper color contrast ratios across light and dark themes.
