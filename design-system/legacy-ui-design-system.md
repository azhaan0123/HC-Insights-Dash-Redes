# HealthCompiler Legacy UI (Classic) — Transferable Design System Specification

> **Specification Version**: 1.0.0  
> **Source Platform**: HealthCompiler Insights Dashboard (`HC-Insights-Dash-Redes`)  
> **Architecture Target**: React 18+ / Next.js / Vite / Tailwind CSS 3.4+ / Vanilla CSS  
> **Primary Purpose**: Complete architectural specification and ready-to-use component library for the Classic / Legacy HealthCompiler UI to enable 1:1 reproduction, migration, and seamless transfer across different software projects.

---

## 1. Executive Summary & Design Philosophy

The **HealthCompiler Legacy UI** (also known as *Action Centre Classic / Classic DPC Hub*) is an enterprise healthcare analytics interface optimized for **high data density, rapid clinical triage, and low cognitive overhead**. 

While the modern redesign emphasizes dark mode, generative AI co-pilots, and glassmorphic aesthetics, the **Legacy UI** is built on proven principles of clinical ergonomics:

1. **High-Contrast Clinical Legibility**: Pure white card containers (`#ffffff`) placed over a clean light slate-gray canvas (`#f4f6f8`), paired with deep charcoal text (`#212529` / `#343a40`) and crisp structural borders (`#dee2e6`).
2. **Signature Brand Magenta Accent (`#e61952`)**: A distinctive crimson-magenta primary accent used selectively for critical action buttons, active navigation markers, page headings, and high-priority clinical risk alerts.
3. **Information-Dense Workflows**: Tabular clinical lists, compact filter pill strips, 4-column operational KPI summary grids, and two-step right slide-out action drawers designed for high-volume care coordination.
4. **Standard Enterprise Status Signals**: Strict semantic color coding adhering to classic healthcare standards (Green for positive benchmarks/SOC 2, Red/Pink for high-risk gaps, Amber for medium priority, Blue for virtual care/intake).

```
+----------------------------------------------------------------------------------------------------+
|  [LOGO: ACME DPC]        [Nav: (Home) (Care Hub) (Gaps) (Claims) (Cost)]     [Portal] [#] [Org v] [HS] |  <-- Classic Header
+----------------------------------------------------------------------------------------------------+
|  [Care Hub: (Dashboard) (CRM) (Segmentation) (Campaigns) (Tasks) (Settings)]                         |  <-- Sub-Nav Strip
+----------------------------------------------------------------------------------------------------+
|  <- Back / Section     PAGE TITLE (e.g., Utilization Gaps)            [Generate Report] [Filters]   |  <-- Title & Action Bar
|  [Start Date: 01-01-23] [End Date: 07-01-26] [Employer: All] [Division: All] [Physician: All]      |  <-- Filter Pills
+----------------------------------------------------------------------------------------------------+
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+       |
|  | TOTAL REQUIRING    | | NEW ACTIVATION     | | ENGAGEMENT GAP     | | LOW RESPONSE       |       |  <-- KPI Cards Grid
|  | 118       +12.4% ^ | | 28         -6.2% v | | 54         +8.5% ^ | | 22         +2.1% ^ |       |
|  | View Details ->    | | View Details ->    | | View Details ->    | | View Details ->    |       |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+       |
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+ |
|  | Search [___________]  Sort: [Longest Inactive v]                           Showing 1-10 of 98 | |  <-- Dense Table Container
|  +-----------------------------------------------------------------------------------------------+ |
|  | PATIENT ID | NAME & AGE     | CONDITION        | LAST VISIT | PRIORITY      | ACTION          | |
|  | PT-1002    | Sarah Jenkins  | Type 2 Diabetes  | 42 days    | [High Priority]| [Contact]       | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [<<] [<] Page 1 of 10 [>] [>>]  Jump to: [___] [Go]                        Records: [10 v]    | |  <-- Table Pagination
+----------------------------------------------------------------------------------------------------+
|  (o) AICPA SOC 2   (o) HIPAA COMPLIANT      (c) 2026 HealthCompiler     Powered by <~> HealthCompiler|  <-- Classic Footer
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Foundational Design Tokens

### 2.1 Color Palette Reference

#### Primary & Brand Tokens
| Token Name | Hex Code | RGB | Role & Application |
| :--- | :--- | :--- | :--- |
| `brand-primary` | `#e61952` | `rgb(230, 25, 82)` | Primary brand color, active nav indicators, page titles, high-priority text, primary CTAs. |
| `brand-primary-hover` | `#c41344` | `rgb(196, 19, 68)` | Hover/pressed state for primary buttons and interactive badges. |
| `brand-primary-subtle` | `#fff0f4` | `rgb(255, 240, 244)` | Light pink wash for icon containers, active pill hovers, and table selection tint. |
| `brand-primary-border` | `rgba(230, 25, 82, 0.5)` | `rgba(230, 25, 82, 0.5)` | 50% opacity border for hovered and focused cards. |

#### Canvas, Surfaces & Neutral Grays
| Token Name | Hex Code | RGB | Role & Application |
| :--- | :--- | :--- | :--- |
| `canvas-bg` | `#f4f6f8` | `rgb(244, 246, 248)` | Global background canvas for all classic pages. |
| `surface-white` | `#ffffff` | `rgb(255, 255, 255)` | Elevated cards, sticky headers, table bodies, modal dialogs, drawers. |
| `surface-recessed` | `#f8f9fa` | `rgb(248, 249, 250)` | Table header rows, sub-nav bars, hover rows, footer background. |
| `surface-pill` | `#e9ecef` | `rgb(233, 236, 239)` | Filter pill chip backgrounds, secondary badge containers. |
| `border-default` | `#dee2e6` | `rgb(222, 226, 230)` | Universal 1px border for cards, dividers, tables, and buttons. |
| `border-input` | `#ced4da` | `rgb(206, 212, 218)` | Form inputs, select dropdowns, search bars. |

#### Typography & Neutral Text
| Token Name | Hex Code | RGB | Role & Application |
| :--- | :--- | :--- | :--- |
| `text-primary` | `#212529` | `rgb(33, 37, 41)` | Primary high-contrast body text, table cell values, large metric numbers. |
| `text-heading` | `#343a40` | `rgb(52, 58, 64)` | Section headings, card titles (uppercase), modal headers. |
| `text-secondary` | `#495057` | `rgb(73, 80, 87)` | Secondary labels, breadcrumbs, action button text, filter pill keys. |
| `text-muted` | `#6c757d` | `rgb(108, 117, 125)` | Subtitle notes, timestamps, inactive nav icons, table column headers, footers. |
| `text-disabled` | `#adb5bd` | `rgb(173, 181, 189)` | Disabled buttons, placeholder text, "No data available" fallbacks. |

#### Semantic Status & Clinical Indicators
| Status | Badge Background | Badge Text | Solid Accent | Clinical Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Positive** | `#d4edda` | `#155724` | `#28a745` | Positive WoW/MoM trends, Completed actions, HIPAA compliant, On track. |
| **Danger / High Risk** | `#f8d7da` | `#721c24` | `#e61952` / `#dc3545` | Negative trends, High-priority care gap, Overdue screening, Alert state. |
| **Warning / Medium** | `#fff3cd` | `#856404` | `#ffc107` | Medium priority gap, Pending reconciliation, Approaching deadline. |
| **Info / Telehealth** | `#cce5ff` | `#004085` | `#007bff` | Virtual encounters, SOC 2 compliance dot, Information notices, Active intake. |

#### Data Visualization & Recharts Palette
| Series Identifier | Hex Code | Visual Meaning in Classic Analytics |
| :--- | :--- | :--- |
| `chart-primary` | `#e61952` | Primary Metric / In-Person Encounters / Actual Active Count |
| `chart-secondary` | `#007bff` | Secondary Metric / Virtual Encounters / Prior Period Baseline |
| `chart-success` | `#28a745` | Benchmark Goal / Closed Gaps / Resolved Patients |
| `chart-warning` | `#ffc107` | At-Risk Patients / Escalation Queue |
| `chart-grid` | `#dee2e6` | Cartesian grid line stroke (`strokeDasharray="3 3"`) |

---

### 2.2 CSS Variables Definition (`classic-tokens.css`)

Drop this CSS file into any project to establish the exact legacy design system tokens:

```css
:root {
  /* Brand Accents */
  --hc-brand: #e61952;
  --hc-brand-hover: #c41344;
  --hc-brand-subtle: #fff0f4;
  --hc-brand-border: rgba(230, 25, 82, 0.5);

  /* Canvas & Surfaces */
  --hc-canvas: #f4f6f8;
  --hc-surface: #ffffff;
  --hc-surface-recessed: #f8f9fa;
  --hc-surface-pill: #e9ecef;

  /* Borders & Dividers */
  --hc-border: #dee2e6;
  --hc-border-input: #ced4da;

  /* Text & Typography */
  --hc-text-primary: #212529;
  --hc-text-heading: #343a40;
  --hc-text-secondary: #495057;
  --hc-text-muted: #6c757d;
  --hc-text-disabled: #adb5bd;

  /* Semantic Status Badges */
  --hc-status-success-bg: #d4edda;
  --hc-status-success-text: #155724;
  --hc-status-success-accent: #28a745;

  --hc-status-danger-bg: #f8d7da;
  --hc-status-danger-text: #721c24;
  --hc-status-danger-accent: #e61952;

  --hc-status-warning-bg: #fff3cd;
  --hc-status-warning-text: #856404;
  --hc-status-warning-accent: #ffc107;

  --hc-status-info-bg: #cce5ff;
  --hc-status-info-text: #004085;
  --hc-status-info-accent: #007bff;

  /* Charts */
  --hc-chart-1: #e61952;
  --hc-chart-2: #007bff;
  --hc-chart-3: #28a745;
  --hc-chart-4: #ffc107;
  --hc-chart-grid: #dee2e6;

  /* Spacing, Radius & Elevation */
  --hc-radius: 4px;
  --hc-radius-lg: 8px;
  --hc-radius-pill: 9999px;
  --hc-shadow-2xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --hc-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08);
  --hc-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --hc-shadow-drawer: -4px 0 24px rgba(0, 0, 0, 0.15);
}
```

---

### 2.3 Tailwind CSS Configuration (`tailwind.config.js`)

To transfer this design system to a Tailwind-powered repository, extend your theme configuration:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        hc: {
          brand: {
            DEFAULT: '#e61952',
            hover: '#c41344',
            subtle: '#fff0f4',
          },
          canvas: '#f4f6f8',
          surface: {
            DEFAULT: '#ffffff',
            recessed: '#f8f9fa',
            pill: '#e9ecef',
          },
          border: {
            DEFAULT: '#dee2e6',
            input: '#ced4da',
          },
          text: {
            primary: '#212529',
            heading: '#343a40',
            secondary: '#495057',
            muted: '#6c757d',
            disabled: '#adb5bd',
          },
          status: {
            success: { bg: '#d4edda', text: '#155724', solid: '#28a745' },
            danger: { bg: '#f8d7da', text: '#721c24', solid: '#e61952' },
            warning: { bg: '#fff3cd', text: '#856404', solid: '#ffc107' },
            info: { bg: '#cce5ff', text: '#004085', solid: '#007bff' },
          },
          chart: {
            1: '#e61952',
            2: '#007bff',
            3: '#28a745',
            4: '#ffc107',
            grid: '#dee2e6',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        drawer: '-4px 0 24px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
      },
    },
  },
};
```

---

## 3. Typography System & Type Hierarchy

The Legacy UI uses a strict typographic hierarchy that balances compact enterprise scanability with prominent analytical KPIs:

| UI Element | CSS / Tailwind Classes | Font Size | Weight | Color | Case / Transform |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Logo Header** | `font-serif italic font-extrabold tracking-tight` | `18px` (`1.125rem`) | `800` | `#e61952` | Normal (Italic) |
| **Logo Subtitle** | `text-[10px] font-medium tracking-wide` | `10px` (`0.625rem`) | `500` | `#6c757d` | Normal |
| **Page Title (`h1`)** | `text-xl md:text-2xl font-bold tracking-tight` | `20px` - `24px` | `700` | `#e61952` | Normal |
| **Section / Card Header**| `text-xs font-bold uppercase tracking-wide` | `12px` (`0.75rem`) | `700` | `#343a40` | Uppercase |
| **KPI Metric Count** | `text-2xl font-extrabold tabular-nums tracking-tight` | `24px` (`1.5rem`) | `800` | `#212529` | Tabular Nums |
| **WoW/MoM Delta Badge** | `text-[10px] font-bold` | `10px` (`0.625rem`) | `700` | `#155724` / `#721c24` | Normal |
| **Subtitle Note** | `text-xs font-normal` | `12px` (`0.75rem`) | `400` | `#495057` | Normal |
| **Filter Pill Key** | `text-xs font-normal` | `12px` (`0.75rem`) | `400` | `#6c757d` | Normal |
| **Filter Pill Value** | `text-xs font-semibold` | `12px` (`0.75rem`) | `600` | `#212529` | Normal |
| **Table Column Header** | `text-xs font-bold uppercase tracking-wider` | `12px` (`0.75rem`) | `700` | `#495057` | Uppercase |
| **Table Body Cell** | `text-xs font-normal` | `12px` (`0.75rem`) | `400` | `#212529` | Normal |
| **ICD-10 Code Pill** | `font-mono text-[11px] font-semibold` | `11px` (`0.6875rem`)| `600` | `#343a40` | Monospace |
| **Footer Text** | `text-xs font-normal` | `12px` (`0.75rem`) | `400` | `#6c757d` | Normal |
| **Compliance Badge** | `text-[10px] font-bold tracking-wider` | `10px` (`0.625rem`) | `700` | `#343a40` | Uppercase |

---

## 4. Application Shell & Structural Layout (`ClassicLayout`)

The cornerstone of the legacy experience is the `ClassicLayout` wrapper. It arranges the top sticky header, optional module sub-navigation, breadcrumbs/title bar, filter pill strip, main content canvas, and compliance footer.

### 4.1 Visual Wireframe of ClassicLayout

```
+--------------------------------------------------------------------------------------------------------------------+
| ACME DPC        [Dashboard] [Care Hub] [Gaps] [Claims] [Cost] [ACO]       [Workspace Portal] [ # ] [Org v] ( ? ) [HS] |
| Your Logo Here                                                                                                    |
+--------------------------------------------------------------------------------------------------------------------+
| Care Hub | [Dashboard] [Internal CRM] [Segmentation] [Campaigns] [Tasks] [Communications] [Reports] [Settings]    |
+--------------------------------------------------------------------------------------------------------------------+
| <- Back / Overview   Utilization Gaps                                       [ (v) Generate Report (BETA) ] [ Filters ]|
| [Start: 01-01-2023] [End: 07-01-2026] [Employer: All] [Division: All] [Physician: All] [Sender: All]              |
| Note: Click a card to view details, cards without data are not clickable.                                          |
+--------------------------------------------------------------------------------------------------------------------+
|                                                                                                                    |
|   { CHILDREN PAGE CONTENT HERE }                                                                                   |
|                                                                                                                    |
+--------------------------------------------------------------------------------------------------------------------+
| [*] AICPA SOC 2   [*] HIPAA COMPLIANT      (c) 2026 HealthCompiler    Privacy   Terms   Help    Powered by HealthCompiler|
+--------------------------------------------------------------------------------------------------------------------+
```

### 4.2 Complete `ClassicLayout.tsx` Reference Implementation

```tsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  Filter,
  Download,
  Share2,
  Users,
  Activity,
  FileText,
  BadgeDollarSign,
  ClipboardCheck,
  MessageSquare,
  LayoutDashboard,
  BarChart,
  Stethoscope,
  LineChart,
  Sparkles,
} from "lucide-react";

export interface FilterPillItem {
  label: string;
  val: string;
}

export interface ClassicLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitleNote?: string | null;
  onBack?: () => void;
  backTitle?: string;
  activeNavIndex?: number;
  filterPills?: FilterPillItem[];
  filterBar?: React.ReactNode;
  headerActions?: React.ReactNode;
  subNavBar?: React.ReactNode;
}

const APPS_MENU = [
  { label: "Dashboards", icon: LayoutDashboard, to: "/engagement" },
  { label: "SmartyPants Hub", icon: Users, to: "/smartypants/dashboard" },
  { label: "HCC Insights", icon: BarChart, to: "/hcc" },
  { label: "ACO Insights", icon: ClipboardCheck, to: "/aco" },
  { label: "Patient Outcomes", icon: Stethoscope, to: "/outcomes" },
  { label: "Mips Nexus", icon: LineChart, to: "/mips/dashboard" },
  { label: "Helix AI", icon: Sparkles, to: "/ask-hc" },
  { label: "Employer Insights", icon: Users, to: "/employer/overview" },
];

export function ClassicLayout({
  children,
  title,
  subtitleNote = "Note: Click a card to view details, cards without data are not clickable.",
  onBack,
  backTitle,
  activeNavIndex = 0,
  filterPills,
  filterBar,
  headerActions,
  subNavBar,
}: ClassicLayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);

  const navIcons = [
    { icon: LayoutDashboard, label: "Home Dashboard", path: "/home-classic" },
    { icon: Users, label: "SmartyPants DPC Hub", path: "/smartypants/dashboard" },
    { icon: Users, label: "Utilization Gaps", path: "/utilization-gaps-classic" },
    { icon: Activity, label: "Engagement & Utilization", path: "/engagement" },
    { icon: FileText, label: "Claims Utilization", path: "/claims" },
    { icon: BadgeDollarSign, label: "Cost Savings", path: "/cost-savings" },
    { icon: ClipboardCheck, label: "Outcomes", path: "/outcomes/dashboard" },
    { icon: MessageSquare, label: "Communication", path: "/communication" },
    { icon: LayoutDashboard, label: "ACO Insights", path: "/aco/overview" },
  ];

  const defaultPills: FilterPillItem[] = [
    { label: "Start Date", val: "01-01-2023" },
    { label: "End Date", val: "07-01-2026" },
    { label: "Employer", val: "All Sponsored Patients" },
    { label: "Division", val: "All Divisions" },
    { label: "Physician", val: "All Physicians" },
    { label: "Sender", val: "All Senders" },
  ];

  const pillsToRender = filterPills || defaultPills;

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col font-sans antialiased text-[#212529]">
      {/* 1. TOP GLOBAL STICKY HEADER */}
      <header className="bg-white border-b border-[#dee2e6] px-6 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        {/* Left: Brand Identity */}
        <div
          onClick={() => navigate("/home-classic")}
          className="cursor-pointer flex flex-col leading-tight select-none"
        >
          <span className="text-[#e61952] font-extrabold text-lg tracking-tight font-serif italic">
            ACME DPC
          </span>
          <span className="text-[10px] text-[#6c757d] font-medium tracking-wide">
            Your Logo Here
          </span>
        </div>

        {/* Center: Pink Nav Icons Bar */}
        <nav className="hidden xl:flex items-center gap-1 px-4">
          {navIcons.map((item, idx) => {
            const Icon = item.icon;
            const isSelected =
              pathname === item.path ||
              (activeNavIndex !== undefined && idx === activeNavIndex);
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                title={item.label}
                className={`p-2 transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  isSelected
                    ? "text-[#e61952] border-b-2 border-[#e61952] pb-1.5 font-bold"
                    : "text-[#6c757d] hover:text-[#e61952]"
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Profile Cluster */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/portal")}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded bg-[#e61952] text-white hover:bg-[#c41344] transition-colors shadow-2xs cursor-pointer"
            title="Return to Workspace Portal Selection"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Workspace Portal</span>
          </button>

          {/* Apps 2x4 Grid Dropdown Launcher */}
          <div className="relative">
            <button
              onClick={() => setIsAppsMenuOpen(!isAppsMenuOpen)}
              className="p-1.5 rounded text-[#e61952] hover:bg-[#fff0f4] transition-colors outline-none cursor-pointer"
              title="Open Apps Launcher"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {isAppsMenuOpen && (
              <div className="absolute right-0 mt-2 w-[320px] rounded-xl border border-[#dee2e6] bg-white p-4 shadow-lg text-[#212529] z-50">
                <div className="grid grid-cols-2 gap-y-6 gap-x-2 py-2">
                  {APPS_MENU.map((app) => (
                    <Link
                      key={app.label}
                      to={app.to}
                      onClick={() => setIsAppsMenuOpen(false)}
                      className="group flex flex-col items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-[#f8f9fa] cursor-pointer"
                    >
                      <app.icon className="w-6 h-6 text-[#212529] transition-colors group-hover:text-[#e61952]" />
                      <span className="text-[13px] font-medium text-[#212529]">
                        {app.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Org Switcher */}
          <button className="flex items-center gap-1.5 px-3 py-1 rounded border border-[#e61952] bg-white hover:bg-[#fff0f4] text-xs font-medium text-[#e61952] transition-colors cursor-pointer">
            <span>ACME Health</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#e61952]" />
          </button>

          {/* Help Button */}
          <a
            href="https://intercom.help/health-compiler-inc/en"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full border border-[#dee2e6] flex items-center justify-center text-[#6c757d] hover:bg-[#f8f9fa] transition-colors"
            title="Get Help"
          >
            <HelpCircle className="w-4 h-4" />
          </a>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#e61952] text-white font-bold text-xs flex items-center justify-center shadow-2xs cursor-pointer hover:opacity-90">
            HS
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER CANVAS */}
      <main className="flex-1 px-6 py-5 max-w-[1600px] w-full mx-auto flex flex-col gap-4">
        {/* Optional Sub-Navigation Strip (e.g. Care Hub) */}
        {subNavBar}

        {/* Title Bar & Top Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-[#e61952] hover:underline font-bold text-lg mr-1 cursor-pointer"
              >
                <span>&larr;</span>
                {backTitle && (
                  <span className="text-[#495057] font-normal">{backTitle} /</span>
                )}
              </button>
            )}
            <h1 className="text-[#e61952] font-bold text-xl md:text-2xl tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {headerActions ? (
              headerActions
            ) : (
              <>
                {onBack && (
                  <>
                    <button className="w-8 h-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057] shadow-2xs cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057] shadow-2xs cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs relative cursor-pointer">
                  <Download className="w-3.5 h-3.5 text-[#6c757d]" />
                  <span>Generate Report</span>
                  <span className="absolute -bottom-2 -right-1 bg-[#28a745] text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-wider shadow-2xs">
                    BETA
                  </span>
                </button>

                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs cursor-pointer">
                  <Filter className="w-3.5 h-3.5 text-[#e61952]" />
                  <span>Filters</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Global Filter Pills Strip */}
        {filterBar ? (
          filterBar
        ) : (
          <div className="flex flex-wrap items-center gap-2 py-1">
            {pillsToRender.map((pill, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded bg-[#e9ecef] border border-[#dee2e6] text-xs text-[#495057] font-medium flex items-center gap-1 shadow-2xs select-none"
              >
                <span className="text-[#6c757d]">{pill.label}:</span>
                <span className="font-semibold text-[#212529]">{pill.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subtitle Note Text */}
        {subtitleNote && (
          <p className="text-xs text-[#495057] font-normal">
            {subtitleNote}
          </p>
        )}

        {/* Main Content Slot */}
        <div className="flex-1 flex flex-col gap-6 mt-1">
          {children}
        </div>
      </main>

      {/* 3. CLASSIC ENTERPRISE COMPLIANCE FOOTER */}
      <footer className="bg-[#f8f9fa] border-t border-[#dee2e6] px-6 py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6c757d] font-normal">
          {/* Left Compliance Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#dee2e6] bg-white font-bold text-[10px] text-[#343a40] tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#007bff]" />
              AICPA SOC 2
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#dee2e6] bg-white font-bold text-[10px] text-[#343a40] tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#28a745]" />
              HIPAA COMPLIANT
            </div>
          </div>

          {/* Center Copyright & Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#6c757d]">
            <span>&copy; {new Date().getFullYear()} Healthcompiler, Inc.</span>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a
              href="https://intercom.help/health-compiler-inc/en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Help
            </a>
          </div>

          {/* Right Powered By Indicator */}
          <div className="flex items-center gap-1.5 text-[#6c757d] font-medium">
            <span>Powered by</span>
            <span className="text-[#e61952] font-bold flex items-center gap-0.5 tracking-tight">
              <span>&lt;~&gt;</span> HealthCompiler
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## 5. Reusable Component Specifications & Source Code

Below is the standalone component suite for all classic healthcare widgets.

### 5.1 Operational Summary KPI Card (`ClassicKpiCard.tsx`)

The summary card displays high-level healthcare metrics (e.g. Total Patients, Overdue Screenings, Active Gaps) with week-over-week (WoW) or month-over-month (MoM) delta percentages.

```tsx
import React from "react";
import { ArrowUp, ArrowDown, ExternalLink, LucideIcon } from "lucide-react";

export interface ClassicKpiCardProps {
  id: string;
  title: string;
  count: number | string;
  wowChange: string;
  wowPositive: boolean;
  description: string;
  icon: LucideIcon;
  isSelected?: boolean;
  onClick?: () => void;
  actionText?: string;
}

export function ClassicKpiCard({
  title,
  count,
  wowChange,
  wowPositive,
  description,
  icon: Icon,
  isSelected = false,
  onClick,
  actionText = "View Details",
}: ClassicKpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded p-4 flex flex-col justify-between min-h-[135px] transition-all select-none group ${
        onClick ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-2 border-[#e61952] shadow-sm"
          : "border border-[#dee2e6] shadow-2xs hover:border-[#e61952]/50"
      }`}
    >
      <div>
        {/* Top Title & Icon */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold text-[#343a40] leading-tight uppercase tracking-wide">
            {title}
          </span>
          <div className="p-1.5 rounded bg-[#f8f9fa] text-[#6c757d] group-hover:text-[#e61952] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Middle Count & Trend Pill */}
        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-2xl font-extrabold tracking-tight tabular-nums text-[#212529]">
            {count}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
              wowPositive
                ? "bg-[#d4edda] text-[#155724]"
                : "bg-[#f8d7da] text-[#721c24]"
            }`}
          >
            {wowPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{wowChange}</span>
          </span>
        </div>
      </div>

      {/* Bottom Separator & Action */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#dee2e6] text-[11px]">
        <span className="text-[#6c757d] truncate max-w-[130px]" title={description}>
          {description}
        </span>
        <span className="font-bold text-[#e61952] group-hover:underline flex items-center gap-1">
          <span>{actionText}</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
```

---

### 5.2 Dense Clinical Data Table (`ClassicDataTable.tsx`)

Designed for high-throughput operational patient triage with multi-attribute search, sorting, priority badges, custom row actions, records-per-page selector, and Jump-to-Page input.

```tsx
import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, Phone, Mail } from "lucide-react";

export interface PatientTableRow {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  condition: string;
  icdCode?: string;
  lastVisitDaysAgo: number | null;
  lastVisitText: string;
  priority: "High" | "Medium" | "Low";
  employer: string;
  suggestedAction: string;
  contactPhone: string;
}

export interface ClassicDataTableProps {
  data: PatientTableRow[];
  onSelectPatient: (patient: PatientTableRow) => void;
  completedPatientIds?: Set<string>;
}

export function ClassicDataTable({
  data,
  onSelectPatient,
  completedPatientIds = new Set(),
}: ClassicDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("longest-inactive");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState("");

  const filteredData = useMemo(() => {
    let list = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q)
      );
    }

    if (sortBy === "longest-inactive") {
      list.sort((a, b) => (b.lastVisitDaysAgo || 999) - (a.lastVisitDaysAgo || 999));
    } else if (sortBy === "highest-priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [data, searchQuery, sortBy]);

  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / recordsPerPage));
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRows = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const handleJumpTo = () => {
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  return (
    <div className="bg-white border border-[#dee2e6] rounded shadow-2xs flex flex-col overflow-hidden">
      {/* 1. Table Top Controls Bar */}
      <div className="p-3 border-b border-[#dee2e6] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6c757d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search patient, ID, employer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#ced4da] rounded text-[#212529] placeholder-[#6c757d] focus:outline-none focus:border-[#e61952]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-[#495057]">
            <span className="text-[#6c757d]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#ced4da] rounded px-2 py-1 text-xs text-[#212529] font-medium focus:outline-none focus:border-[#e61952] cursor-pointer"
            >
              <option value="longest-inactive">Longest Inactive (Days)</option>
              <option value="highest-priority">Highest Priority</option>
              <option value="name">Patient Name (A-Z)</option>
            </select>
          </div>

          <span className="text-xs text-[#6c757d]">
            Showing <strong className="text-[#212529] tabular-nums">{totalEntries > 0 ? startIndex + 1 : 0}</strong> to{" "}
            <strong className="text-[#212529] tabular-nums">{Math.min(startIndex + recordsPerPage, totalEntries)}</strong> of{" "}
            <strong className="text-[#212529] tabular-nums">{totalEntries}</strong> entries
          </span>
        </div>
      </div>

      {/* 2. Responsive Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#dee2e6] text-[#495057] font-bold uppercase tracking-wider select-none">
              <th className="py-2.5 px-3">Patient ID</th>
              <th className="py-2.5 px-3">Patient Name</th>
              <th className="py-2.5 px-3">Condition / Diagnosis</th>
              <th className="py-2.5 px-3">Last Visit</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Employer</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dee2e6]">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#6c757d] italic">
                  No matching patients found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((patient) => {
                const isCompleted = completedPatientIds.has(patient.id);

                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-[#f8f9fa] transition-colors"
                  >
                    {/* Patient ID */}
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#495057]">
                      {patient.id}
                    </td>

                    {/* Patient Name & Demographics */}
                    <td className="py-2.5 px-3 font-medium text-[#212529]">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#212529]">{patient.name}</span>
                        <span className="text-[10px] text-[#6c757d]">
                          {patient.age}y &bull; {patient.gender === "M" ? "Male" : "Female"}
                        </span>
                      </div>
                    </td>

                    {/* Condition & ICD Pill */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#212529]">{patient.condition}</span>
                        {patient.icdCode && (
                          <span className="font-mono text-[10px] text-[#6c757d]">
                            ICD: {patient.icdCode}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Last Visit Days */}
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-[#212529]">
                        {patient.lastVisitText}
                      </span>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-2.5 px-3">
                      {patient.priority === "High" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#f8d7da] text-[#721c24]">
                          High Priority
                        </span>
                      ) : patient.priority === "Medium" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#fff3cd] text-[#856404]">
                          Medium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#e9ecef] text-[#495057]">
                          Low
                        </span>
                      )}
                    </td>

                    {/* Employer */}
                    <td className="py-2.5 px-3 text-[#495057]">{patient.employer}</td>

                    {/* Action Button */}
                    <td className="py-2.5 px-3 text-right">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#28a745]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Contacted</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectPatient(patient)}
                          className="px-3 py-1 rounded bg-[#e61952] text-white hover:bg-[#c41344] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          Review & Action
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Table Pagination Footer */}
      <div className="p-3 border-t border-[#dee2e6] bg-[#f8f9fa] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6c757d]">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-[#ced4da] rounded px-2 py-0.5 text-xs text-[#212529] focus:outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Jump To Page */}
          <div className="flex items-center gap-1">
            <span>Jump to:</span>
            <input
              type="text"
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJumpTo()}
              className="w-10 px-1 py-0.5 text-center text-xs bg-white border border-[#ced4da] rounded text-[#212529]"
              placeholder="1"
            />
            <button
              onClick={handleJumpTo}
              className="px-2 py-0.5 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] text-xs text-[#495057] font-medium"
            >
              Go
            </button>
          </div>

          {/* Navigation Chevron Buttons */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-[#495057]" />
            </button>

            <span className="px-2 font-medium text-[#212529]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-[#495057]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 5.3 Two-Step Slide-Out Patient Action Drawer (`ClassicPatientDrawer.tsx`)

The standard workflow drawer for executing clinical interventions (Phone Call, SMS Outreach, Email Reminder) with care coordinator assignment and internal note logging.

```tsx
import React, { useState } from "react";
import { X, Phone, Mail, MessageSquare, Check, AlertCircle } from "lucide-react";
import type { PatientTableRow } from "./ClassicDataTable";

export interface ClassicPatientDrawerProps {
  patient: PatientTableRow | null;
  onClose: () => void;
  onActionComplete: (patientId: string, actionNote: string) => void;
}

export function ClassicPatientDrawer({
  patient,
  onClose,
  onActionComplete,
}: ClassicPatientDrawerProps) {
  const [selectedChannel, setSelectedChannel] = useState<"call" | "sms" | "email">("call");
  const [assignedCoordinator, setAssignedCoordinator] = useState("Sarah Jenkins, RN (Care Coordinator)");
  const [actionNote, setActionNote] = useState("");
  const [step, setStep] = useState<"form" | "confirm">("form");

  if (!patient) return null;

  const handleSubmit = () => {
    onActionComplete(patient.id, actionNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Semi-transparent Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Slide-out White Panel */}
      <div className="relative w-full max-w-lg bg-white border-l border-[#dee2e6] shadow-drawer flex flex-col h-full z-10">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#dee2e6] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] font-bold text-[#e61952] uppercase tracking-wider">
              Care Coordination Action
            </span>
            <h2 className="text-lg font-bold text-[#212529]">{patient.name}</h2>
            <span className="text-xs text-[#6c757d]">ID: {patient.id} &bull; {patient.employer}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#212529] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#212529]">
          {/* Patient Overview Box */}
          <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#6c757d]">Condition:</span>
              <span className="font-semibold text-[#212529]">{patient.condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6c757d]">Last Visit:</span>
              <span className="font-semibold text-[#212529]">{patient.lastVisitText}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6c757d]">Contact Phone:</span>
              <span className="font-mono font-medium text-[#212529]">{patient.contactPhone}</span>
            </div>
          </div>

          {step === "form" ? (
            <>
              {/* Step 1: Channel Selector */}
              <div>
                <label className="block text-xs font-bold text-[#343a40] uppercase tracking-wider mb-2">
                  Select Outreach Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "call", label: "Phone Call", icon: Phone },
                    { id: "sms", label: "SMS Text", icon: MessageSquare },
                    { id: "email", label: "Email Notice", icon: Mail },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isSelected = selectedChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedChannel(ch.id as any)}
                        className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#e61952] bg-[#fff0f4] text-[#e61952] font-bold"
                            : "border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Assigned Staff */}
              <div>
                <label className="block text-xs font-bold text-[#343a40] uppercase tracking-wider mb-1.5">
                  Assigned Coordinator
                </label>
                <select
                  value={assignedCoordinator}
                  onChange={(e) => setAssignedCoordinator(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
                >
                  <option value="Sarah Jenkins, RN (Care Coordinator)">Sarah Jenkins, RN (Care Coordinator)</option>
                  <option value="Dr. Michael Evans, MD">Dr. Michael Evans, MD</option>
                  <option value="Elena Rostova, Patient Advocate">Elena Rostova, Patient Advocate</option>
                </select>
              </div>

              {/* Step 3: Clinical Note */}
              <div>
                <label className="block text-xs font-bold text-[#343a40] uppercase tracking-wider mb-1.5">
                  Action Note / Protocol
                </label>
                <textarea
                  rows={4}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Record patient response, outreach instructions, or appointment scheduling notes..."
                  className="w-full bg-white border border-[#ced4da] rounded p-2.5 text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
                />
              </div>
            </>
          ) : (
            /* Confirmation Step */
            <div className="space-y-4 py-2">
              <div className="p-3 bg-[#d4edda] border border-[#c3e6cb] rounded text-[#155724] flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Ready to Dispatch Action</span>
                  <p className="text-[11px] mt-0.5">
                    This will log a <strong>{selectedChannel.toUpperCase()}</strong> outreach event to the patient record.
                  </p>
                </div>
              </div>

              <div className="border border-[#dee2e6] rounded p-3 bg-white space-y-1.5">
                <span className="text-[#6c757d] font-bold text-[10px] uppercase">Summary</span>
                <p><strong>Coordinator:</strong> {assignedCoordinator}</p>
                <p><strong>Note:</strong> {actionNote || "Standard protocol outreach."}</p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Fixed Footer */}
        <div className="p-4 border-t border-[#dee2e6] bg-[#f8f9fa] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-xs font-semibold text-[#495057] cursor-pointer"
          >
            Cancel
          </button>

          {step === "form" ? (
            <button
              onClick={() => setStep("confirm")}
              className="px-4 py-1.5 rounded bg-[#e61952] text-white hover:bg-[#c41344] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Next: Review Action &rarr;
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded bg-[#28a745] text-white hover:bg-[#218838] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Confirm & Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 5.4 Recharts Analytics Chart Wrapper (`ClassicTrendChart.tsx`)

Standardized Recharts wrapper applying the exact legacy styling, grid lines, and high-contrast tooltip.

```tsx
import React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export interface TrendDataPoint {
  period: string;
  inPerson: number;
  virtual: number;
}

export interface ClassicTrendChartProps {
  title: string;
  subtitle?: string;
  data: TrendDataPoint[];
}

export function ClassicTrendChart({
  title,
  subtitle = "In-Person vs Virtual encounters (Last 6 Months)",
  data,
}: ClassicTrendChartProps) {
  return (
    <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[360px]">
      {/* Top Title & Legend Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-3">
        <div>
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">
            {title}
          </h3>
          {subtitle && <p className="text-[11px] text-[#6c757d]">{subtitle}</p>}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1 text-[#e61952]">
            <span className="w-2 h-2 rounded-full bg-[#e61952]" /> In-Person
          </span>
          <span className="flex items-center gap-1 text-[#007bff]">
            <span className="w-2 h-2 rounded-full bg-[#007bff]" /> Virtual
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "#6c757d" }}
              axisLine={{ stroke: "#dee2e6" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6c757d" }}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-[#dee2e6] rounded p-2 shadow-md text-xs">
                      <span className="font-bold text-[#212529]">{label}</span>
                      <div className="mt-1 space-y-0.5">
                        {payload.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-4">
                            <span className="text-[#6c757d]">{item.name}:</span>
                            <span className="font-bold text-[#212529] tabular-nums">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="inPerson"
              name="In-Person"
              stroke="#e61952"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#e61952" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="virtual"
              name="Virtual"
              stroke="#007bff"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "#007bff" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

## 6. TypeScript Data Models & Contract Specifications

When transferring this UI system to a new repository, define the following data contracts in `src/types/classic-ui.ts`:

```typescript
export type PriorityLevel = "High" | "Medium" | "Low";

export type CohortType =
  | "new-activation"
  | "engagement-gap"
  | "low-response"
  | "external-leakage";

export interface TouchpointEvent {
  id: string;
  date: string;
  type: "SMS" | "Email" | "Call" | "Appt";
  description: string;
  outcome?: string;
}

export interface ClaimEvent {
  id: string;
  date: string;
  provider: string;
  diagnosis: string;
  amount: string;
}

export interface EncounterEvent {
  id: string;
  date: string;
  type: string;
  provider: string;
  notes: string;
}

export interface ActionCentrePatientRow {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  condition: string;
  icdCode?: string;
  priority: PriorityLevel;
  cohort: CohortType;
  lastVisitDaysAgo: number | null;
  lastVisitText: string;
  lastOutreachText: string;
  lastOutreachDaysAgo: number | null;
  reason: string;
  suggestedAction: string;
  suggestedActionType: "email" | "sms" | "call" | "appt";
  contactPhone: string;
  contactEmail: string;
  employer: string;
  physician: string;
  engagementHistory?: TouchpointEvent[];
  recentClaims?: ClaimEvent[];
  recentEncounters?: EncounterEvent[];
}

export interface CohortSummaryCard {
  id: CohortType | "all";
  title: string;
  count: number;
  wowChange: string;
  wowPositive: boolean;
  momChange: string;
  momPositive: boolean;
  description: string;
}
```

---

## 7. Migration & Transferability Playbook

Follow this step-by-step checklist to port the HealthCompiler Classic UI into any new project:

### Step 1: Install Required Dependencies

```bash
npm install lucide-react recharts clsx tailwind-merge
```

### Step 2: Configure CSS Variables & Tailwind Theme
1. Include the tokens from **Section 2.2** in your root stylesheet (`globals.css` or `index.css`).
2. Add the custom color extensions from **Section 2.3** into `tailwind.config.js`.

### Step 3: Copy Core Component Files
Place the following files into your project:
* `src/components/classic/ClassicLayout.tsx`
* `src/components/classic/ClassicKpiCard.tsx`
* `src/components/classic/ClassicDataTable.tsx`
* `src/components/classic/ClassicPatientDrawer.tsx`
* `src/components/classic/ClassicTrendChart.tsx`
* `src/types/classic-ui.ts`

### Step 4: Validate Visual Parity
Verify the following essential visual checkpoints:
* [ ] Background canvas is `#f4f6f8` (not stark white `#ffffff`).
* [ ] Top header has pink logo (`font-serif italic font-extrabold text-[#e61952]`) and sticky top positioning.
* [ ] Selected navigation item displays `border-b-2 border-[#e61952]` with bold pink text.
* [ ] KPI Cards show light green (`#d4edda`) or pink (`#f8d7da`) trend badges with uppercase headers (`#343a40`).
* [ ] Tables feature uppercase gray headers (`#f8f9fa` background) with thin borders (`#dee2e6`).
* [ ] Compliance badges (SOC 2 with Blue dot, HIPAA with Green dot) render cleanly in the footer.
