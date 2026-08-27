# HealthCompiler Insights Dashboard (`HC-Insights-Dash-Redes`)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Design System](https://img.shields.io/badge/Design_System-Tokenized-e32168?style=flat)](./design-system/README.md)
[![License](https://img.shields.io/badge/License-Proprietary-slate.svg)](#)

Welcome to the **HealthCompiler Insights Dashboard**. This repository contains the next-generation clinical analytics, utilization tracking, HCC risk adjustment, MIPS performance, ACO quality management, patient engagement, and Direct Primary Care (DPC) operations platform for modern healthcare systems, ACOs, and medical practices.

Built with **React 18**, **TypeScript**, **Vite 6**, **Tailwind CSS v4**, and **Radix UI Primitives**, the platform pairs an enterprise-grade tokenized design system with an embedded **Helix AI Co-Pilot & Action Layer** governed by Human-in-the-Loop (HITL) approval protocols.

---

## 📑 Table of Contents
1. [System Architecture & Core Technology Stack](#-system-architecture--core-technology-stack)
2. [Complete URL Routes & Slug Directory](#-complete-url-routes--slug-directory)
   - [Executive & Global Intelligence](#1-executive--global-intelligence)
   - [Engagement & Utilization Analytics](#2-engagement--utilization-analytics)
   - [HCC Risk Adjustment & Coding (Hierarchical Condition Categories)](#3-hcc-risk-adjustment--coding)
   - [ACO Insights & Quality (Accountable Care Organizations)](#4-aco-insights--quality)
   - [MIPS Nexus (Merit-based Incentive Payment System)](#5-mips-nexus-performance)
   - [Employer Health Plan Analytics](#6-employer-health-plan-analytics)
   - [Clinical Outcomes & Quality Measures](#7-clinical-outcomes--quality-measures)
   - [SmartyPants Direct Primary Care (DPC) Suite](#8-smartypants-direct-primary-care-dpc-suite)
   - [Enterprise Administration & Governance](#9-enterprise-administration--governance)
   - [Classic Action Centre Interfaces](#10-classic-action-centre-interfaces)
   - [Authentication & Setup Flows](#11-authentication--setup-flows)
3. [Helix AI Co-Pilot & HITL Action Layer](#-helix-ai-co-pilot--hitl-action-layer)
4. [Design System & Theme Engine](#-design-system--theme-engine)
5. [Directory & File Organization](#-directory--file-organization)
6. [Getting Started & Local Development](#-getting-started--local-development)
7. [Build & Optimization Configuration](#-build--optimization-configuration)

---

## 🏗️ System Architecture & Core Technology Stack

- **Core Framework**: React 18.3.1 (SPA with React Router v7 data routing)
- **Language**: TypeScript 5.x (Strict type safety, custom domain schemas)
- **Build Tool**: Vite 6.3.5 with Rollup manual vendor chunk splitting
- **Styling**: Tailwind CSS v4, CSS Custom Properties (`src/styles/theme.css`), and `tw-animate-css`
- **Component Primitives**: Radix UI (Dialog, DropdownMenu, Tooltip, Popover, Accordion, Tabs, Slider, Switch, ContextMenu, Sheet)
- **Data Visualization**: Recharts 3.x with custom tokenized SVG tooltips and MUI X-Charts
- **Animation**: Motion (Framer Motion v12) + custom Apple-inspired easing curves
- **Iconography**: Two-tone icon wrapping engine supporting Iconsax, Lucide, and Bootstrap Icons
- **Database & Integrations**: Supabase JS Client (`@supabase/supabase-js`), Google APIs (`googleapis`), Elation EHR, Hint Core, Spruce Health

---

## 🗺️ Complete URL Routes & Slug Directory

Below is the complete inventory of all operational sections, modules, and their respective URL paths and slugs.

### 1. Executive & Global Intelligence
Central command, search, AI copilot, documentation, and design foundation.

| URL Slug | Route Name | Description | Key Components |
| :--- | :--- | :--- | :--- |
| `/home` | **Executive Home** | Top-level KPI overview, strategic metric trends, care gap alerts, and revenue opportunities. | `Home.tsx`, `KpiCard.tsx`, `AiInsightsTab.tsx` |
| `/patient-search` | **Patient 360 Search** | Universal patient search with cross-system MRN lookup, clinical timeline, and active condition viewer. | `PatientSearch.tsx` |
| `/ask-hc` *(alias `/ask-ai`)* | **AskHC AI Copilot** | Full-page interactive AI medical intelligence workspace for deep data queries and cohort synthesis. | `AskHC.tsx`, `AiChatInterface.tsx` |
| `/wiki` *(and `/wiki/*`)* | **Clinical Wiki** | Contextual knowledge base, coding guidelines, MIPS measure specifications, and workflows. | `Wiki.tsx`, `WikiDrawer.tsx` |
| `/design-system` | **Design System** | Live interactive component registry, typography scales, color palettes, and token tests. | `DesignSystem.tsx` |

---

### 2. Engagement & Utilization Analytics
Deep longitudinal tracking of patient interactions, encounters, medication orders, messaging volume, and spend leakage.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/engagement` | **Engagement Overview** | High-level summary of active patients, encounters, digital touches, and after-hours demand. |
| `/engagement/active-patients` | **Active Patients Roster** | Detailed roster of active patients with engagement scores and last-contact dates. |
| `/engagement/total-active-patients` | **Total Active Patients** | Historical growth trends, cohort retention, and active enrollment trajectories. |
| `/engagement/after-hours-encounters` | **After-Hours Encounters** | Analysis of urgent/after-hours clinical visits to evaluate practice capacity. |
| `/engagement/total-active-manifest-members` | **Active Manifest Members** | Employer-sponsored manifest member validation and roster synchronization. |
| `/engagement/patient-touch-ratio` | **Patient Touch Ratio** | Clinician-to-patient touch frequency ratios and outreach workload distributions. |
| `/engagement/encounters` | **Encounters Ledger** | Comprehensive log of clinical visits, appointment types, and provider assignments. |
| `/engagement/encounter-types-breakdown` | **Encounter Modalities** | Distribution of in-person, telehealth, asynchronous, and home visits. |
| `/engagement/care-episodes-breakdown` | **Care Episodes** | Longitudinal episode tracking across acute and chronic patient journeys. |
| `/engagement/prescriptions` | **Prescriptions Ledger** | Active prescription volume, provider order patterns, and fulfillment statuses. |
| `/engagement/after-hours-prescriptions` | **After-Hours Rx** | Prescription refills and urgent orders generated outside standard clinic hours. |
| `/engagement/prescriptions-breakdown` | **Medication Breakdown** | Pharmaceutical drug class distribution (maintenance vs. acute medications). |
| `/engagement/digital-engagement` | **Digital Engagement** | Patient portal logins, mobile app adoption, and digital self-service trends. |
| `/engagement/messages` | **Secure Messages** | Omnichannel clinical and administrative message volumes and response times. |
| `/engagement/message-types-breakdown` | **Message Categorization** | Classification of patient inquiries (refill, scheduling, clinical, billing). |
| `/engagement/after-hours-messages` | **After-Hours Inquiries** | Urgent message queues requiring automated triage or on-call clinician review. |
| `/cost-savings` | **Cost Savings & ROI** | Financial ROI calculator modeling generic conversions and ER diversion savings. |
| `/utilization-gaps` *(alias `/action-centre`)* | **Care & Utilization Gaps** | Prioritized clinical gaps queue ranked by revenue opportunity and risk score. |
| `/chronic-risk` | **Chronic Risk Stratification** | Stratification of patient cohorts into Low, Rising, and High chronic risk tiers. |
| `/claims` | **Claims Utilization** | Paid claims data, out-of-network leakage, and specialized procedure spend. |
| `/billing` | **Claims Billing Report** | Billing reconciliation, claim rejection analysis, and CPT code utilization. |
| `/coordinated-care` | **Coordinated Care** | Case management, care coordination tasks, and complex patient outreach. |
| `/communication` | **Patient Communications** | Central hub for automated broadcast announcements and targeted outreach. |
| `/marketing` | **Practice Marketing** | Patient acquisition metrics, campaign conversions, and retention analytics. |
| `/survey` | **Patient Surveys & NPS** | Net Promoter Score (NPS), clinical feedback, and patient satisfaction surveys. |

---

### 3. HCC Risk Adjustment & Coding
Hierarchical Condition Category (HCC) risk adjustment, RAF score optimization, suspect diagnosis validation, and audit readiness.

| URL Slug | Route Name | Description | Key Features |
| :--- | :--- | :--- | :--- |
| `/hcc/overview` | **HCC Overview** | Risk Adjustment Factor (RAF) summary, annual recapture calendar, and financial impact. | `Overview.tsx`, Recapture Gauge |
| `/hcc/patient-list` | **HCC Patient Roster** | Stratified patient roster with individual RAF scores, missing HCCs, and AWV status. | `PatientList.tsx`, RAF Filter |
| `/hcc/pre-visit-plan` | **Pre-Visit Planning** | Point-of-care preparation sheet detailing open HCC suspect opportunities for AWVs. | `PreVisitPlan.tsx`, Coding Sheet |
| `/hcc/coding-queue` | **Coding Queue** | AI-generated suspect diagnoses detected from prescription/lab data ready for approval. | `CodingQueue.tsx`, Approval Gate |
| `/hcc/bulk-audit` | **Documentation Audit** | Pre-screening encounter notes against billed ICD-10 codes to prevent audit clawbacks. | `BulkAudit.tsx`, Compliance Score |

---

### 4. ACO Insights & Quality
Accountable Care Organization (ACO) performance benchmarks, MSSP measure tracking, and provider scorecards.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/aco/overview` | **ACO Executive Overview** | Shared savings projections, quality composite score, and benchmark standings. |
| `/aco/journey` | **Performance Journey** | Step-by-step milestone progress across annual ACO performance and reporting cycles. |
| `/aco/provider-performance` | **Provider Scorecards** | Clinician-level quality measure compliance, depression screening rates, and AWVs. |
| `/aco/gaps` | **Quality Gaps Tracker** | Open care gap inventory for ACO quality measures with outreach actions. |
| `/aco/utilization` | **ACO Utilization** | Inpatient admissions, readmissions, ER visits per 1,000, and specialist referrals. |
| `/aco/reports` | **ACO Reports** | CMS compliance exports, quarterly performance binders, and audit packages. |

---

### 5. MIPS Nexus Performance
Merit-based Incentive Payment System (MIPS) composite scoring, CMS quality measures, and payment adjustment forecasts.

| URL Slug | Route Name | Description | Category Weight |
| :--- | :--- | :--- | :--- |
| `/mips/dashboard` | **MIPS Dashboard** | Live composite score projection (0-100 pts) and positive payment adjustment estimator. | All Categories |
| `/mips/ai-assistant` | **MIPS AI Assistant** | AI recommendations for closing high-decile measures to maximize point totals. | Optimization Engine |
| `/mips/quality-measures` | **Quality Measures** | Detailed tracker for 6 selected eCQMs/MIPS quality measures with decile benchmarks. | 30% Weight |
| `/mips/cost-performance` | **Cost Category** | Spend analysis against MSPB (Medicare Spend Per Beneficiary) and TPCC benchmarks. | 30% Weight |
| `/mips/interoperability` | **Promoting Interoperability** | CEHRT compliance, electronic prescribing, HIE query, and patient portal access. | 25% Weight |
| `/mips/improvement-activities`| **Improvement Activities** | High and medium-weighted clinical practice improvement activity verifications. | 15% Weight |
| `/mips/provider-comparison` | **Provider Comparison** | Side-by-side benchmarking of providers across quality and cost categories. | Clinician Breakdown |
| `/mips/reports` | **CMS Submission Reports** | QRDA III and JSON export packaging for direct CMS QPP portal submission. | Compliance Export |

---

### 6. Employer Health Plan Analytics
Self-insured employer group reporting, workforce risk profiling, and healthcare expenditure benchmarking.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/employer/overview` | **Employer Overview** | PMPM cost trends, active subscriber counts, and high-level health risk indicators. |
| `/employer/enrollment` | **Enrollment & Demographics**| Covered lives, tier splits (Employee, Family), age distributions, and turnover. |
| `/employer/financial` | **Financial Breakdown** | Medical vs. Rx spend, catastrophic claims reinsurance threshold tracking, and PMPM. |
| `/employer/chronic` | **Chronic Prevalence** | Workforce prevalence rates for diabetes, hypertension, musculoskeletal, and mental health. |
| `/employer/high-cost` | **High-Cost Claimants** | Top 1% and 5% cost driver analysis with early rising-risk prediction. |
| `/employer/benchmarking` | **Industry Benchmarks** | Peer comparison against regional, national, and industry-specific benefit metrics. |

---

### 7. Clinical Outcomes & Quality Measures
Population health surveillance, disease registries, screening adherence, and longitudinal biomarker tracking.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/outcomes/dashboard` | **Outcomes Dashboard** | Population health overview, quality measure attainment, and clinical intervention KPIs. |
| `/outcomes/patient-groups` | **Disease Cohorts** | Dynamic patient segmentation (Hypertension, Diabetes, CKD, Post-Op, Geriatric). |
| `/outcomes/screenings` | **Screenings Due** | Mammography, colorectal cancer, cervical screening, and diabetic retinal exam rosters. |
| `/outcomes/vaccinations` | **Immunizations** | Flu, COVID-19, Pneumococcal, and Shingrix vaccination compliance rosters. |
| `/outcomes/appointments` | **Appointments Roster** | Chronic care follow-up schedule and preventive visit status tracking. |
| `/outcomes/lab-trends` | **Lab Trends** | Longitudinal lab trajectories (HbA1c, eGFR, LDL, microalbumin) with worsening flags. |
| `/outcomes/medication-refills`| **Medication Refills** | PDC (Proportion of Days Covered) adherence monitoring and refill gap alerts. |
| `/outcomes/lab-cadence` | **Lab Order Cadence** | Routine testing cycle compliance (quarterly A1c, annual lipid panels, kidney checks). |
| `/outcomes/report-builder` | **Custom Report Builder** | Multi-attribute clinical query builder for custom population cohort reports. |

---

### 8. SmartyPants Direct Primary Care (DPC) Suite
Dedicated operational suite for Direct Primary Care clinics managing memberships, communications, and workflows.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/smartypants/dashboard` | **DPC Operations** | Active membership counts, MRR, churn rate, inbound leads, and daily task queues. |
| `/smartypants/crm` | **Internal CRM** | Member directory, membership tier management, employer billing ties, and notes. |
| `/smartypants/segmentation` | **Member Segmentation** | Custom cohort filters by membership status, tenure, age group, and clinical risk. |
| `/smartypants/campaigns` | **Outreach Campaigns** | Automated SMS and email broadcast sequences for wellness and practice updates. |
| `/smartypants/tasks` | **Workflow Tasks** | Team task board for administrative follow-ups, lab reviews, and onboarding steps. |
| `/smartypants/communications`| **Omnichannel Inbox** | Unified two-way SMS, email, and secure chat center for patient communications. |
| `/smartypants/leads` | **Lead Pipeline** | Prospective member CRM tracking employer group inquiries and individual signups. |
| `/smartypants/employer-analytics`| **Corporate DPC** | Utilization and engagement metrics for employer-sponsored membership contracts. |
| `/smartypants/automations` | **Workflow Automations**| Trigger-based automation rules for member welcome sequences and renewal notices. |
| `/smartypants/reports` | **Practice Financials** | Financial exports, revenue per member, subscription billing, and growth trends. |
| `/smartypants/settings` | **DPC Configurations** | Practice details, Stripe billing integration, Twilio SMS routing, and branding. |

---

### 9. Enterprise Administration & Governance
Role-based access control (RBAC), multi-practice organizational setup, inbound data integrations, and audit logs.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/admin/users` | **User Management** | Clinician, staff, and admin accounts, role permissions, and access provisioning. |
| `/admin/onboarding` | **Onboarding Control** | Network and clinic self-serve onboarding queue and status approvals. |
| `/admin/organization` | **Organization Hierarchy**| Multi-tenant clinic entities, NPI associations, tax IDs, and billing entities. |
| `/admin/patient-counts` | **Patient Manifest Sync** | Practice-level patient census verification and EHR roster synchronization. |
| `/admin/integration-batches`| **Data Integrations** | Inbound HL7/FHIR, Claims 837/835, and Elation/Hint EHR batch processing logs. |
| `/admin/survey-config` | **Survey Builder** | Dynamic survey question editor, NPS rating triggers, and branching logic. |
| `/admin/templates` | **Survey Templates** | Pre-built clinical questionnaires (PHQ-9, GAD-7, Post-Visit Satisfaction). |
| `/admin/audit-log` | **HIPAA Security Audit** | Immutable audit trail tracking record access, exports, approvals, and logins. |

---

### 10. Classic Action Centre Interfaces
Preserved legacy views for existing staff workflows and transition periods.

| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/utilization-gaps-classic` *(alias `/action-centre-classic`)* | **Classic Gaps View** | Original table-oriented care gap workflow with legacy filter controls. |
| `/home-classic` | **Classic Action Home** | Legacy home interface with legacy navigation wrappers. |

---

### 11. Authentication & Setup Flows
| URL Slug | Route Name | Description |
| :--- | :--- | :--- |
| `/login` | **Authentication** | Secure credentials and single sign-on (SSO) login portal. |
| `/onboarding` | **Self-Serve Onboarding** | Multi-step clinic setup (Organization, Network Association, Data Feeds). |
| `/support` | **Support & Help Center** | In-app help resources, documentation links, and support ticket creation. |

---

## 🤖 Helix AI Co-Pilot & HITL Action Layer

The platform features an embedded **Clinical AI Co-Pilot** designed according to Apple Human Interface Guidelines (HIG) for AI and rigorous clinical governance standards.

```
┌─────────────────────────────────────────────────────────────┐
│                    Helix AI Co-Pilot Engine                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ┌──────────────────┐                  ┌──────────────────┐
   │ Real-time Chat   │                  │ Background Alert │
   │ & Presets        │                  │ Insights Tab     │
   └──────────────────┘                  └────────┬─────────┘
                                                  │
                                                  ▼
                                         ┌──────────────────┐
                                         │ Action Queue     │
                                         │ & Plan Preview   │
                                         └────────┬─────────┘
                                                  │
                                                  ▼
                                         ┌──────────────────┐
                                         │ Approval Modal   │
                                         │ (Pre-Action Gate)│
                                         └──────────────────┘
```

### Key AI Components:
1. **Interactive Sidebar ([RightAiSidebar.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/RightAiSidebar.tsx))**:
   - **Insights Tab ([AiInsightsTab.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiInsightsTab.tsx))**: Proactive cards surfacing suspect diagnoses, revenue shortfalls, and expiring recaptures with hero stats.
   - **Actions Tab ([AiActionsTab.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiActionsTab.tsx))**: Actionable approval queue with countdown undo windows.
   - **Chat Interface ([AiChatInterface.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/AiChatInterface.tsx))**: Context-aware natural language Q&A referencing active page data.
2. **Action Review Modal ([ApprovalModal.tsx](file:///c:/Users/azhaa/Desktop/HealthCompiler/HC-Insights-Dash-Redes/src/app/components/ai/ApprovalModal.tsx))**:
   - **Dominant Confidence Hero**: High-impact percentage display with segmented score track.
   - **High-Stakes Warning**: Dedicated warning banner for irreversible EHR write-backs.
   - **Border-Integrated Code Comparison**: Direct side-by-side evaluation of recommended vs. differential ICD-10 codes.
   - **Unified Evidence Stream**: Consolidated RAG citations from Elation EHR and claims feeds.
   - **Persistent Decision Strip**: Locked summary bar directly above Approve/Reject buttons ensuring key facts remain visible on scroll.

---

## 🎨 Design System & Theme Engine

The UI follows a strict, tokenized design system built around CSS custom properties:

```css
/* Core Semantic Tokens (src/styles/theme.css) */
:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --primary: #e32168;           /* HealthCompiler Brand Accent */
  --primary-foreground: #ffffff;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --radius: 0.75rem;
  --chart-1: #e32168;
  --chart-2: #10b981;
  --chart-3: #6366f1;
  --chart-4: #f59e0b;
  --chart-5: #06b6d4;
}

.dark {
  --background: #090d16;
  --foreground: #f8fafc;
  --card: #0f172a;
  --card-foreground: #f8fafc;
  --border: #1e293b;
}
```

### Color Meaning Conventions:
- **Pink (`#e32168`)**: Primary brand identity & AI-origin markers.
- **Emerald (`#10b981`)**: Positive status, verified clinical checks, high confidence scores, and approved executions.
- **Rose / Red (`#f43f5e`)**: High-risk warnings, irreversible actions, and rejections.
- **Amber (`#f59e0b`)**: Cautions, pending verifications, and medium priority indicators.
- **Slate / Zinc**: Secondary metadata, SLA timers, record IDs, and structural borders.

---

## 📂 Directory & File Organization

```text
HC-Insights-Dash-Redes/
├── design-system/             # Design System Specifications & Component Guides
├── public/                    # Static Assets (Favicons, Branding)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ai/            # Helix AI Co-Pilot (RightAiSidebar, ApprovalModal, PlanPreview)
│   │   │   ├── dashboard/     # KPI Cards, DataTables, Chart Wrappers, Tooltips
│   │   │   ├── layout/        # AppShell, AppSidebar, PageHeader, FilterBar
│   │   │   ├── ui/            # Radix Primitives (Dialog, Dropdown, Tabs, Button)
│   │   │   └── wiki/          # Interactive Clinical Wiki Drawer & Registry
│   │   ├── contexts/          # React Contexts (AiContext, ThemeContext, FilterContext)
│   │   ├── data/              # Mock Datasets (HCC, MIPS, Outcomes, SmartyPants, ACO)
│   │   ├── lib/               # Utilities, Navigation Configuration, Icon Engine
│   │   ├── pages/             # Application Route Views
│   │   │   ├── aco/           # ACO Journey, Performance, Utilization Views
│   │   │   ├── action-centre/ # Action Centre & Care Gaps
│   │   │   ├── admin/         # User Management, Onboarding, Survey Config
│   │   │   ├── auth/          # Login, Multi-Step Onboarding
│   │   │   ├── employer/      # Employer Analytics Sub-Pages
│   │   │   ├── engagement/    # Encounters, Prescriptions, Messages Breakdowns
│   │   │   ├── hcc/           # Overview, PatientList, PreVisitPlan, CodingQueue, BulkAudit
│   │   │   ├── mips/          # Dashboard, Quality, Cost, Interoperability Views
│   │   │   ├── outcomes/      # Dashboard, Screenings, Vaccines, Lab Trends
│   │   │   └── smartypants/   # DPC CRM, Campaigns, Tasks, Inbox, Automations
│   │   └── routes.tsx         # Unified Application Router
│   ├── styles/
│   │   ├── globals.css        # Global CSS resets & utility imports
│   │   └── theme.css          # Semantic CSS variables & token mappings
│   ├── main.tsx               # Application Root Mounting
│   └── index.html             # HTML Shell Template
├── package.json               # Dependencies & Build Scripts
├── tsconfig.json              # TypeScript Compiler Configuration
└── vite.config.ts             # Vite Configuration with Rollup Chunk Splitting
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 2. Installation
```bash
git clone https://github.com/azhhhyyy/HC-Insights-Dash-Redes.git
cd HC-Insights-Dash-Redes
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:5173](http://localhost:5173) in your browser. The default root route (`/`) immediately redirects to the Executive Home Dashboard (`/home`).

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified production build in the `./dist` directory.

---

## ⚡ Build & Optimization Configuration

Vite is configured with automated Rollup manual chunking in `vite.config.ts` to optimize caching and eliminate oversized bundle warnings:

```typescript
// vite.config.ts (Extract)
build: {
  chunkSizeWarningLimit: 1600,
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-recharts';
          if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui';
          if (id.includes('iconsax-react') || id.includes('bootstrap-icons')) return 'vendor-icons';
          if (id.includes('@radix-ui')) return 'vendor-radix';
          if (id.includes('motion')) return 'vendor-motion';
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'vendor-react';
          if (id.includes('@supabase') || id.includes('googleapis')) return 'vendor-services';
          if (id.includes('date-fns') || id.includes('cmdk') || id.includes('vaul')) return 'vendor-ui';
        }
      },
    },
  },
}
```

---

## 📄 License & Intellectual Property
Copyright © 2026 HealthCompiler, Inc. All rights reserved. Proprietary and confidential.
