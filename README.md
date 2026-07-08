# HealthCompiler Insights Dashboard (`HC-Insights-Dash-Redes`)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Design System](https://img.shields.io/badge/Design_System-Tokenized-e32168?style=flat)](./design-system/README.md)

Welcome to the **HealthCompiler Insights Dashboard Redesign**. This repository houses the next-generation clinical analytics, utilization tracking, patient engagement, and financial insights platform crafted for modern healthcare networks, ACOs, and medical practices.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Radix UI Primitives**, this redesign introduces a complete architectural overhaul centering around a modular design system, streamlined clinical workflows, accessibility-first interfaces, and an embedded AI Co-Pilot action layer.

---

## 🌟 Comprehensive Breakdown of Changes & UX Improvements

### 🎨 1. Tokenized & Modular Design System Implementation
A unified, tokenized design system has been architected and implemented across all internal dashboards (Insights, HCC, ACO, etc.) to guarantee seamless visual harmony, component modularity, and effortless white-labeling for partner health networks.

* **Tokenized Architecture**: Built upon CSS Custom Properties (`src/styles/theme.css`) mapped to semantic Tailwind CSS utilities (`--primary`, `--card`, `--muted`, `--chart-1`). White-labeling a new health network requires modifying only a few CSS variables.
* **Curated Typography & Typescale**: Transitioned to a purpose-built font stack:
  * **Geist Sans**: Crisp digital legibility for KPI figures, navigation links, and dense tabular data.
  * **Merriweather Serif**: Available for editorial executive reporting summaries.
  * **JetBrains Mono**: Dedicated monospace rendering for ICD-10 medical diagnoses, CPT billing codes, MRNs, and NPI identifiers.
* **Standardized Component Geometry & Corner Radius**: Established a consistent component hierarchy based on `--radius: 0.7rem` (`rounded-lg`, `rounded-md`, `rounded-sm`).
* **Animation & Easing Standards**: All UI transitions—including slide-out sheets, accordion toggles, dropdown viewports, and hover micro-interactions—adhere to standardized cubic-bezier easing curves for smooth, predictable motion.
* **Universal Iconography**: Fully migrated to the **Lucide Icons** library across the entire product ecosystem, ensuring clean, monochrome, scalable vector icons with consistent stroke weights.
* **Elevation & Shadow Hierarchy**: Refined shadow scales (`--shadow-sm` through `--shadow-2xl`) providing clear depth layering between static cards, floating popovers, and slide-out AI drawers.

---

### 🧭 2. Primary Navigation UX Overhaul
To improve screen real estate, spatial orientation, and navigation efficiency during complex analytical investigations, the core navigation pattern has been completely reimagined:

* **Top Navbar → Persistent Left Sidebar**: Replaced the legacy top navigation bar with a dedicated, responsive left sidebar ([AppSidebar](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/layout/AppSidebar.tsx)). This provides better vertical hierarchy and keeps critical modules accessible at all times.
* **Engagement & Utilization Dropdown Architecture**: All specialized cards and sub-reports within **Engagement & Utilization** have been reorganized into collapsible dropdown sublists directly inside the sidebar. Users can now deep-link into specific care gap views or active patient rosters with a single click.
* **Footer User Profile & Tenant Menu**: Relocated the User Profile, Practice Switcher, and Account Settings menu to the bottom-right/bottom-left footer of the sidebar, establishing a clean ergonomic split between application navigation and tenant/user settings.

---

### ⚙️ 3. Component Standardization & UI Consistency
Every UI primitive across the product has been standardized to eliminate behavioral discrepancies and lower user cognitive load:

* **Semantic Table Column Standardization**: Standardized column behaviors across all analytical tables ([DataTable](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/dashboard/DataTable.tsx)). Columns sharing data types now behave identically across the product:
  * **Status Pills & Badges**: Unified color coding (`default`, `secondary`, `destructive`, `outline`) for clinical risk tiers and care statuses.
  * **Medical Codes**: Standardized monospace formatting with integrated hover definitions ([ICD10Code](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ui/icd10-code.tsx)).
  * **Identifiers (MRNs / Patient IDs)**: Clickable, copyable, and formatted uniformly.
  * **Action Toolbars**: Standardized row-level action menus and batch selection checkboxes.
* **Universal Graph & Chart Behavior**: All data visualizations ([charts.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/dashboard/charts.tsx)) utilize standardized Recharts containers, uniform color tokens (`--chart-1` to `--chart-5`), and high-contrast tooltip payloads ([ChartTooltip](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/dashboard/ChartTooltip.tsx)).
* **Cross-Product Alignment**: Insights, HCC Risk Adjustment, and ACO Quality modules now share exact UI primitives, dialogs, and layout containers.

---

### 🚀 4. Major New Features

#### 🤖 AI-Powered Action Layer & Clinical Co-Pilot
Initiated the foundational implementation of an embedded AI Co-Pilot designed to translate raw healthcare analytics into immediate clinical actions:
* **Interactive AI Sidebar ([RightAiSidebar](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/RightAiSidebar.tsx))**: A collapsible co-pilot drawer accessible from any dashboard view, featuring natural language Q&A ([AiChatInterface](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiChatInterface.tsx)), background anomaly alerts ([AiInsightsTab](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiInsightsTab.tsx)), and domain-specific prompt starters ([AiPresetQuestions](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiPresetQuestions.tsx)).
* **Prescriptive Quick Actions ([AiActionsTab](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiActionsTab.tsx))**: Generates actionable task sequences (e.g., batch patient outreach lists or care gap scheduling instructions) complete with estimated quality bonus financial impact.

#### 📈 Executive Home Landing Dashboard
Designed and implemented an executive-first home landing view ([Home.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/pages/Home.tsx)) that surfaces critical trends at a glance using interactive KPI cards ([KpiCard](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/dashboard/KpiCard.tsx)) supporting multi-metric split breakdowns and drill-down filtering.

#### ♿ Universal Accessibility Suite (a11y)
Integrated robust accessibility controls directly into the profile menu, empowering users to customize visual rendering to their environmental or visual needs:
* **Dark Mode**: OLED-friendly dark charcoal theme (`#171717`) with warm amber primary highlights (`#f59e0b`) reducing eye strain during night shifts.
* **High Contrast Mode**: Enhanced border delineation and text contrast ratios meeting WCAG 2.1 AAA standards.
* **Large Text Mode**: Scaled typography preferences for enhanced clinical readability.

---

### ⚡ 5. Minor New Features & Workflow Enhancements

* **Instant Table Filtering & Attribute Search**: Equipped all data tables with global text filtering and multi-column sorting. Architected to interface with BigQuery backends for blazing-fast attribute-based querying over large patient populations.
* **Interactive & Editable Filter Pills**: Filter pills displayed in the floating [FilterBar](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/layout/FilterBar.tsx) are now directly clickable and editable for rapid context slicing. Clicking the primary filter trigger opens the comprehensive slide-out [ManageFiltersSidebar](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/layout/ManageFiltersSidebar.tsx) drawer for holistic boolean filtering.
* **Smart Network Association Onboarding**: Upgraded the Network Association input field inside Self-Serve Onboarding ([NetworkAssociationStep.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/pages/auth/steps/NetworkAssociationStep.tsx)):
  * Implemented **type-ahead predictive search** that dynamically shows matching healthcare networks as the user types—preventing mistype edge cases while ensuring the full network directory is never exposed publicly.
  * Added **multi-select capabilities** and **independent onboarding paths** for multi-practice administrators.

---

## 📚 Design System Documentation

For a deep dive into component APIs, design tokens, and architectural guidelines, explore the comprehensive documentation generated inside the [`design-system/`](./design-system/README.md) directory:

| Document | Description |
| :--- | :--- |
| **[00. Overview & Design Tokens](./design-system/00-overview-and-tokens.md)** | Color palettes, chart colors, typography stack, radius hierarchy, and elevation shadows. |
| **[01. Layout & Shell Components](./design-system/01-layout-and-shell.md)** | `AppShell`, `AppSidebar`, `Page`, `PageHeader`, `FilterBar`, and `ManageFiltersSidebar`. |
| **[02. Dashboard & KPI Widgets](./design-system/02-dashboard-and-kpis.md)** | `KpiCard`, `DataTable`, Recharts wrappers, `ChartTooltip`, `EmptyState`, and `SkeletonPrimitives`. |
| **[03. AI Assistant & Insights](./design-system/03-ai-assistant-and-insights.md)** | `RightAiSidebar`, `AiChatInterface`, `AiInsightsTab`, `AiActionsTab`, and `AiPresetQuestions`. |
| **[04. Navigation & Menus](./design-system/04-navigation-and-menus.md)** | Sidebar primitives, breadcrumbs, dropdowns, menubars, tabs, and responsive mobile hooks. |
| **[05. Form Controls & Inputs](./design-system/05-forms-and-inputs.md)** | Buttons, inputs, OTP fields, combobox command palettes (`cmdk`), switches, and form validation bindings. |
| **[06. Overlays & Dialogs](./design-system/06-overlays-and-dialogs.md)** | Modals, alert dialogs, drawers, sheets, popovers, and contextual tooltips. |
| **[07. Data Display & Feedback Primitives](./design-system/07-data-display-and-feedback.md)** | Cards, status badges, avatars, tables, accordions, ICD-10 diagnosis pills, and sonner toasts. |

---

## 🛠️ Quick Start & Local Development

### Prerequisites
* **Node.js**: v18.x or higher
* **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/azhhhyyy/HC-Insights-Dash-Redes.git
cd HC-Insights-Dash-Redes
npm install
# or
pnpm install
```

### 2. Run Local Development Server
Launch the Vite development server with instant Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to inspect the redesigned dashboard.

### 3. Build for Production
Create an optimized, minified bundle inside `./dist`:
```bash
npm run build
```

---

## 📂 Project Structure Overview

```text
HC-Insights-Dash-Redes/
├── design-system/             # Comprehensive Design System Markdown Documentation
├── public/                    # Static branding and favicon assets
└── src/
    ├── app/
    │   ├── components/        # Reusable UI primitives and domain widgets
    │   │   ├── ai/            # AI Co-Pilot drawers, chat, and action tabs
    │   │   ├── dashboard/     # KpiCards, DataTables, Recharts wrappers, Tooltips
    │   │   ├── layout/        # AppShell, AppSidebar, PageHeader, FilterBar
    │   │   └── ui/            # Radix-powered primitive controls (shadcn-compatible)
    │   ├── pages/             # Route views (Home, UtilizationGaps, Onboarding, etc.)
    │   └── routes.tsx         # Application routing tree
    ├── styles/
    │   ├── globals.css        # Global CSS resets and base utility imports
    │   └── theme.css          # Semantic CSS variables and design tokens
    └── main.tsx               # Application root entrypoint
```
