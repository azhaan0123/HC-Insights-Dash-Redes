import { WikiArticle } from './types';

export const adminArticles: WikiArticle[] = [
  {
    id: 'admin-users',
    title: 'Manage Users & Role-Based Access Control (RBAC)',
    routePath: '/admin/users',
    dashboardGroup: 'Administration',
    targetAudience: ['Superadmin', 'Practice Manager'],
    overview: 'Central user identity governance and permission management console. Enables practice administrators to invite new staff members, assign clinical or administrative RBAC roles, and deactivate departed personnel.',
    features: [
      {
        featureName: 'User Governance & Permissions Roster',
        description: 'Sortable table listing every practice user along with their active email, assigned RBAC role (`Superadmin`, `Org Admin`, `Care Coordinator`, `Provider`, `Coder`), MFA status, and last login timestamp.',
        uiLocation: 'Main User Management Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">User & Email</th><th className="p-2">Assigned Role</th><th className="p-2">MFA Status</th><th className="p-2">Action</th></tr>
  <tr><td className="p-2 font-medium">Dr. Robert Chen <span className="block text-muted-foreground font-normal">rchen@healthcompiler.com</span></td><td className="p-2"><Badge className="bg-primary text-primary-foreground">Provider (Clinician)</Badge></td><td className="p-2 text-emerald-600 font-bold">Enabled (SMS + Auth App)</td><td className="p-2"><Button size="sm" variant="ghost">Edit Role</Button></td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'RBAC Permission Evaluation Matrix',
        clinicalOrBusinessLogic: 'Strictly governs access to Protected Health Information (PHI) and system configuration settings using least-privilege role definitions.',
        formula: 'IsActionPermitted = CheckRoleAccess(UserRole, ResourcePath, ActionType: [Read | Write | Delete | Admin])',
        dataSources: ['JWT Token Claim Profile', 'Backend Role-Permissions Mapping Table']
      }
    ],
    workflows: [
      {
        actionName: 'Offboarding a Departed Clinician or Care Coordinator',
        userRoles: ['Superadmin', 'Practice Manager'],
        steps: [
          'Immediately upon notification of staff departure, open Manage Users (`/admin/users`).',
          'Locate the departed employee\'s row and click "Edit Role / Status".',
          'Toggle account status from `Active` to `Deactivated / Revoked`.',
          'Select a covering staff member from the prompt (`Reassign 184 assigned care gaps and open tasks to: Sarah Jenkins, RN`).',
          'Click "Confirm Revocation & Reassign Tasks".'
        ],
        downstreamImpact: 'Instantly terminates system login access, revokes active API tokens, and prevents orphaned care management tasks by automatically transferring workload.'
      }
    ],
    relatedArticleIds: ['admin-organization', 'auth-login']
  },
  {
    id: 'admin-onboarding',
    title: 'Client Organization Onboarding Pipeline',
    routePath: '/admin/onboarding',
    dashboardGroup: 'Administration',
    targetAudience: ['Superadmin', 'Implementation Team'],
    overview: 'Implementation tracking station monitoring new client practices as they progress through onboarding milestones (`Account Created` → `EMR Credentials Verified` → `Historical Data Ingested` → `Go-Live`).',
    features: [
      {
        featureName: 'Onboarding Milestone State Machine Table',
        description: 'Tracking grid showing each client practice, assigned implementation engineer, current milestone stage, and days elapsed in current phase.',
        uiLocation: 'Main Milestone Tracking Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-card rounded border text-xs flex justify-between items-center">
  <div><span className="font-bold block">Client: Premier Primary Care of Austin (TIN: XX-XXX8421)</span><span className="text-muted-foreground text-[11px]">Assigned Engineer: Alex M. • Day 14 of Onboarding</span></div>
  <Badge className="bg-amber-500/20 text-amber-700 font-bold">Stage 3: Historical HL7 Data Ingestion (64% Complete)</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Onboarding State Machine Transition Logic',
        clinicalOrBusinessLogic: 'Enforces sequential implementation verification, blocking a practice from advancing to live production until all EMR data validation checks pass with zero fatal schema errors.',
        formula: 'CanAdvanceToStage4 = Assert(HistoricalHL7ErrorRate < 0.01% AND AllMandatoryTINsVerified == True)',
        dataSources: ['Inbound Integration Batches Status Log', 'Organization Setup Master Table']
      }
    ],
    workflows: [
      {
        actionName: 'Validating Historical Data Ingestion Before Go-Live Sign-off',
        userRoles: ['Superadmin', 'Implementation Team'],
        steps: [
          'Filter Onboarding Management by `Current Stage: Stage 3 (Historical Ingestion)`.',
          'Review the validation scorecard for Premier Primary Care of Austin confirming 36 months of historical patient charts have completed processing.',
          'Verify that RAF score benchmarks match historical baseline claims.',
          'Click "Approve Stage 3 Completion & Unlock Go-Live Production Access".'
        ],
        downstreamImpact: 'Transitions the practice into live production, enables daily real-time ADT/lab feeds, and activates automated monthly SaaS billing.'
      }
    ],
    relatedArticleIds: ['admin-integration-batches', 'admin-organization']
  },
  {
    id: 'admin-organization',
    title: 'Manage Organization Profile & Branding Settings',
    routePath: '/admin/organization',
    dashboardGroup: 'Administration',
    targetAudience: ['Practice Manager', 'Superadmin'],
    overview: 'Practice settings profile configuration hub. Allows practice leadership to upload custom branding logos, select primary color themes (`#e32168`, `#2563eb`), configure operating hours, and manage clinic addresses.',
    features: [
      {
        featureName: 'Live Theme Color Picker & Branding Customizer',
        description: 'Interactive hex color selector and logo uploader that immediately propagates chosen brand colors across sidebar navigation, buttons, and patient-facing portal views.',
        uiLocation: 'Top Branding Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border flex items-center justify-between text-xs font-mono">
  <div><span className="font-bold font-sans text-sm block">Primary Brand Color Theme</span><span className="text-muted-foreground">Persists across all practice dashboard modules</span></div>
  <div className="flex items-center gap-2">
    <div className="size-6 rounded-full bg-[#e32168] border-2 border-white shadow-sm" title="Default Pink (#e32168)" />
    <div className="size-6 rounded-full bg-[#2563eb] border cursor-pointer" title="Royal Blue (#2563eb)" />
    <div className="size-6 rounded-full bg-[#059669] border cursor-pointer" title="Emerald (#059669)" />
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'CSS Variable & Theme Persistence Engine',
        clinicalOrBusinessLogic: 'Persists chosen primary color (`--primary`) in session storage and backend organization profile configuration, injecting dynamic root DOM CSS styles (`document.documentElement.style.setProperty`).',
        formula: 'ApplyTheme(HexColor: string) => SetRootCSSVariable("--primary", HexColor) + SaveOrgProfile({ primaryColor: HexColor })',
        dataSources: ['Backend Organization Config Table', 'Browser LocalStorage / SessionStorage']
      }
    ],
    workflows: [
      {
        actionName: 'Customizing Practice Branding for Multi-Clinic Networks',
        userRoles: ['Practice Manager'],
        steps: [
          'Open Manage Organization (`/admin/organization`).',
          'Upload the practice\'s high-resolution PNG transparent logo in the Branding uploader.',
          'Select the practice\'s official brand hex code (`#e32168`) from the theme picker.',
          'Set operating hours (`Monday - Friday: 08:00 AM - 17:00 PM • Saturday/Sunday: Closed`).',
          'Click "Save Organization Settings".'
        ],
        downstreamImpact: 'Instantly updates the visual aesthetic across every dashboard page and aligns patient portal emails with official practice branding.'
      }
    ],
    relatedArticleIds: ['admin-users', 'design-system']
  },
  {
    id: 'admin-patient-counts',
    title: 'Organization Patient Counts & Billing Census Verification',
    routePath: '/admin/patient-counts',
    dashboardGroup: 'Administration',
    targetAudience: ['Superadmin', 'Practice Manager', 'Financial Analyst'],
    overview: 'Monthly active patient census verification dashboard. Tracks historical census counts on the 1st of each month to reconcile SaaS subscription billing tiers and direct primary care panel sizes.',
    features: [
      {
        featureName: 'Monthly Active Census Audit Table',
        description: 'Table logging month-by-month active patient counts, DPC vs network tier split, exact billing tier classification, and exportable census backup lists.',
        uiLocation: 'Main Census Audit Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border font-mono">
  <tr className="bg-muted font-sans font-bold"><th className="p-2">Snapshot Date</th><th className="p-2">Active DPC Patients</th><th className="p-2">Network Patients</th><th className="p-2">Assigned Billing Tier</th></tr>
  <tr><td className="p-2 font-bold">July 1, 2026</td><td className="p-2">4,821</td><td className="p-2">1,240</td><td className="p-2 text-emerald-600 font-bold font-sans">Tier 4 (4,001 - 6,000 active members)</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Automated Midnight Census Snapshot Engine',
        clinicalOrBusinessLogic: 'Captures a locked, immutable snapshot of active patient charts at 00:00 UTC on the 1st day of every calendar month for transparent SaaS invoice verification.',
        formula: 'MonthlyCensus = Count(Unique Patients where Status == "Active" AND AttributedOrgID == CurrentOrgID at SnapshotTimestamp)',
        dataSources: ['EHR Master Patient Index Active Status Table']
      }
    ],
    workflows: [
      {
        actionName: 'Reconciling Monthly SaaS Subscription Invoice Tier',
        userRoles: ['Practice Manager', 'Financial Analyst'],
        steps: [
          'Navigate to Organization Patient Counts on the 2nd day of the month following receipt of the monthly platform invoice.',
          'Compare the billed active member count against the July 1st snapshot (`4,821 active DPC members`).',
          'Click "Download Active Roster CSV Snapshot" to verify individual patient charts included in the census.',
          'Confirm that the invoice accurately matches `Tier 4` subscription pricing.'
        ],
        downstreamImpact: 'Provides complete financial transparency between the healthcare practice and the HealthCompiler platform, eliminating billing disputes.'
      }
    ],
    relatedArticleIds: ['engagement-total-active-patients', 'admin-organization']
  },
  {
    id: 'admin-integration-batches',
    title: 'Inbound Integration Batches & Data Feed Monitoring',
    routePath: '/admin/integration-batches',
    dashboardGroup: 'Administration',
    targetAudience: ['Superadmin', 'Data Engineer', 'Practice Manager'],
    overview: 'Live data engineering monitoring console. Displays real-time ingestion status (`Success`, `Processing`, `Failed`) for inbound HL7 v2 ADT feeds, FHIR R4 clinical bundles, and CSV roster uploads.',
    features: [
      {
        featureName: 'Live Ingestion Batch Processing Table',
        description: 'Monitoring grid displaying batch ID, source interface (`St. Jude Hospital ADT Feed`), record count processed, timestamp, status indicator badge, and error log viewer.',
        uiLocation: 'Main Ingestion Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border font-mono">
  <tr className="bg-muted font-sans font-bold"><th className="p-2">Batch ID & Source</th><th className="p-2">Records</th><th className="p-2">Timestamp</th><th className="p-2">Status</th><th className="p-2">Action</th></tr>
  <tr><td className="p-2 font-bold">BATCH-8421 (St. Jude HL7 ADT)</td><td className="p-2">1,420</td><td className="p-2 text-muted-foreground">Today 08:14:22</td><td className="p-2"><Badge className="bg-emerald-500 text-white font-sans">Success (0 Errors)</Badge></td><td className="p-2"><Button size="sm" variant="ghost">Inspect Logs</Button></td></tr>
  <tr><td className="p-2 font-bold text-rose-600">BATCH-8422 (Payer 834 EDI)</td><td className="p-2">412</td><td className="p-2 text-muted-foreground">Today 07:30:11</td><td className="p-2"><Badge variant="destructive" className="font-sans">Failed (Invalid NPI format)</Badge></td><td className="p-2"><Button size="sm" variant="outline">Retry Batch</Button></td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'HL7 / FHIR Ingestion Schema Validation & Retry Engine',
        clinicalOrBusinessLogic: 'Validates inbound interface messages against strict HL7 v2/FHIR profiles. If a batch fails due to transient network timeouts, the system automatically re-attempts ingestion using exponential backoff.',
        formula: 'RetrySchedule = BaseDelayMinutes × 2^(AttemptNumber) up to MaxAttempts (3). If final attempt fails, trigger high-priority Superadmin alert.',
        dataSources: ['Direct MLLP/SFTP Interface Engines', 'FHIR REST Ingestion API']
      }
    ],
    workflows: [
      {
        actionName: 'Troubleshooting and Retrying a Failed Inbound EDI Roster Batch',
        userRoles: ['Superadmin', 'Data Engineer'],
        steps: [
          'Open Inbound Integration Batches (`/admin/integration-batches`) following an automated failed batch alert (`BATCH-8422`).',
          'Click "Inspect Logs" on the failed row to read the exact parser exception (`Line 142: Field NPI contains 9 digits instead of required 10 digits`).',
          'Coordinate with the payer or EMR vendor IT contact to correct the malformed file in their SFTP export directory.',
          'Once the corrected file is placed, click "Retry Batch" to re-trigger the parsing pipeline.',
          'Verify that the batch status transitions from `Failed` to `Success (412 records processed)`.'
        ],
        downstreamImpact: 'Prevents data loss, maintains synchronized clinical health records across disparate EMRs, and guarantees zero interruption to daily care coordination work.'
      }
    ],
    relatedArticleIds: ['admin-onboarding', 'engagement-total-active-manifest-members']
  },
  {
    id: 'admin-survey-config',
    title: 'Survey Configuration & Automated Trigger Rules',
    routePath: '/admin/survey-config',
    dashboardGroup: 'Administration',
    targetAudience: ['Quality Officer', 'Practice Manager', 'Superadmin'],
    overview: 'Custom survey and PROM builder console. Enables quality officers to design multi-question clinical assessments (`PHQ-9`, `GAD-7`, `SDOH Assessment`), define numerical scoring rules, and set automated delivery schedules.',
    features: [
      {
        featureName: 'Automated Survey Trigger Schedule Editor',
        description: 'Rule editor where administrators link specific clinical events (`Post-Hospital Discharge < 24h`, `New Diabetes Diagnosis`, `Quarterly Check-in`) to automatic SMS/email survey dispatch rules.',
        uiLocation: 'Top Trigger Rules Panel',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border space-y-2 text-xs">
  <div className="flex justify-between font-bold"><span>Trigger Rule: Post-Inpatient Discharge Satisfaction & Safety Check</span><Badge className="bg-emerald-500/20 text-emerald-700">Active</Badge></div>
  <p className="text-muted-foreground">When: Patient discharged from Inpatient Hospital (HL7 ADT A03) → Wait 24 Hours → Auto-send survey template "Post-Discharge Care Transition Assessment" via SMS.</p>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Automated Clinical Task Generation from Survey Scores',
        clinicalOrBusinessLogic: 'Enforces closed-loop clinical intervention by automatically creating high-priority Action Centre tasks whenever a patient submits a survey assessment crossing clinical severity thresholds.',
        formula: 'If SurveyTemplate == "PHQ-9" AND TotalScore >= 15 => AutoCreateTask(Priority: "High", Title: "Depression Severity Excursion - PHQ-9: " + TotalScore, Assignee: PatientPCP)',
        dataSources: ['Inbound Patient Portal Questionnaire Database']
      }
    ],
    workflows: [
      {
        actionName: 'Configuring an Automated Quarterly Social Determinants of Health (SDOH) Screening',
        userRoles: ['Quality Officer', 'Practice Manager'],
        steps: [
          'Open Survey Configuration (`/admin/survey-config`) and click "Create New Automated Delivery Rule".',
          'Select Target Template: choose "Standard SDOH Assessment (PRAPARE Framework)" from the template library.',
          'Set Target Cohort: select all active Medicaid or Rising Risk chronic disease patients.',
          'Set Delivery Cadence: `Send every 180 days via automated secure SMS check-in link`.',
          'Add Scoring Rule: `If Question "Food Insecurity" == Positive OR "Transportation Barrier" == Positive => Auto-create Social Work Outreach Task in Action Centre`.',
          'Save and activate rule.'
        ],
        downstreamImpact: 'Systematically captures billable SDOH screening G-codes (`G0136`), fulfills health equity accreditation standards, and connects vulnerable patients to community support.'
      }
    ],
    relatedArticleIds: ['admin-templates', 'survey-proms']
  },
  {
    id: 'admin-templates',
    title: 'Survey Templates Library & Standardized Question Banks',
    routePath: '/admin/templates',
    dashboardGroup: 'Administration',
    targetAudience: ['Quality Officer', 'Practice Manager'],
    overview: 'Pre-built standardized survey template repository. Contains clinically validated, copyright-cleared question banks for clinical outcome assessments and patient satisfaction questionnaires (`NPS`, `CSAT`, `PHQ-9`, `GAD-7`, `SDOH`).',
    features: [
      {
        featureName: 'Standardized Assessment Template Showcase Grid',
        description: 'Visual grid of pre-packaged survey cards displaying question count, estimated patient completion time (`Avg 2 mins`), validated clinical reference, and one-click "Clone to Practice" actions.',
        uiLocation: 'Main Template Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-2 gap-3 text-xs">
  <div className="p-4 bg-card rounded-xl border flex flex-col justify-between space-y-2">
    <div>
      <div className="flex justify-between items-center"><span className="font-bold text-sm">PHQ-9 Patient Depression Questionnaire</span><Badge variant="outline">Validated Clinical PROM</Badge></div>
      <p className="text-muted-foreground text-[11px] mt-1">9-item multiple choice depression screening tool with built-in severity scoring (0-27 points) and self-harm alert flag.</p>
    </div>
    <div className="flex justify-between items-center pt-2 border-t text-[10px] text-muted-foreground">
      <span>Avg completion: 2.5 minutes</span>
      <Button size="sm" className="h-7 px-3 bg-primary">Clone & Customize</Button>
    </div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'SDOH PRAPARE to ICD-10 Z-Code Mapping Engine',
        clinicalOrBusinessLogic: 'Maps affirmative responses from Social Determinants of Health screening templates directly to standard Z-codes (`Z62-Z65`) inside the patient\'s active EMR problem list.',
        formula: 'If SDOH_Question("Food_Insecure") == Yes => AutoSuggestDiagnosis(Code: "Z59.4 (Lack of adequate food)", Status: "Active Problem")',
        dataSources: ['SDOH Template Question Bank Mapping Table']
      }
    ],
    workflows: [
      {
        actionName: 'Cloning and Deploying a Post-Visit Net Promoter Score (NPS) Template',
        userRoles: ['Quality Officer', 'Practice Manager'],
        steps: [
          'Navigate to Survey Templates (`/admin/templates`).',
          'Locate the "Post-Encounter Net Promoter Score (NPS) & Patient Satisfaction Check-in" template.',
          'Click "Clone & Customize" to open the template inside your practice\'s Survey Configuration workspace.',
          'Adjust the intro text to feature your practice name and branding.',
          'Enable the automated trigger: `Dispatch via SMS exactly 2 hours after completion of any In-Person Office Visit (`POS 11`)`.',
          'Save and activate template.'
        ],
        downstreamImpact: 'Captures continuous, real-time patient feedback, allowing practice managers to instantly intercept dissatisfied patients before negative reviews appear online.'
      }
    ],
    relatedArticleIds: ['admin-survey-config', 'survey-proms']
  },
  {
    id: 'design-system',
    title: 'Design System Governance & UI Component Library',
    routePath: '/design-system',
    dashboardGroup: 'Administration',
    targetAudience: ['Developers', 'UI/UX Designers', 'Superadmin'],
    overview: 'The interactive UI component showcase and design standards registry for the HealthCompiler frontend. Enforces consistent design tokens, color contrast compliance, typography hierarchy, and accessibility across all dashboards.',
    features: [
      {
        featureName: 'Interactive Component Playground & Token Inspector',
        description: 'Live interactive sandbox displaying every button state, badge variant, form input, card layout, and data table alongside exact CSS/Tailwind utility classes.',
        uiLocation: 'Main Design System Tabs Workspace',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border space-y-3 text-xs">
  <div className="flex justify-between font-bold border-b pb-2"><span>Standardized Button Variants Showcase</span><span className="font-mono text-muted-foreground">src/app/components/ui/button.tsx</span></div>
  <div className="flex flex-wrap gap-2 pt-1">
    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">Primary Button</Button>
    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Outline Secondary</Button>
    <Button variant="destructive" className="bg-rose-600 text-white shadow-sm">Destructive Action</Button>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'WCAG 2.1 AA Accessibility Contrast & Spacing Compliance',
        clinicalOrBusinessLogic: 'All dashboard UI elements must maintain strict color contrast ratios against background fills to ensure readability for clinicians operating in high-stress or low-light clinical environments.',
        formula: 'ContrastRatio(ForegroundHex, BackgroundHex) >= 4.5:1 for Normal Text (>= 3.0:1 for Large Headers/Icons)',
        dataSources: ['Tailwind Root CSS Variables (`index.css`)']
      }
    ],
    workflows: [
      {
        actionName: 'Auditing New Dashboard Additions Against Design Tokens',
        userRoles: ['Developers', 'UI/UX Designers'],
        steps: [
          'Before submitting a pull request containing new frontend dashboard pages, open `/design-system`.',
          'Verify that all tables utilize standard `DataTable` layouts rather than ad-hoc inline tables.',
          'Verify that spacing uses predefined design tokens (`gap-3`, `p-4`, `rounded-xl`) and that buttons use standard Shadcn/Radix UI variants.',
          'Inspect the component in both Light Mode and Dark Mode to confirm zero color inversion bugs or unreadable contrast clashes.'
        ],
        downstreamImpact: 'Maintains a pristine, premium, state-of-the-art clinical user experience that wows users at first glance and prevents UI visual fragmentation.'
      }
    ],
    relatedArticleIds: ['admin-organization']
  }
];
