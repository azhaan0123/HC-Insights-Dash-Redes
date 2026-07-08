import { WikiArticle } from './types';

export const analyticsArticles: WikiArticle[] = [
  {
    id: 'home-overview',
    title: 'Executive Practice Overview & Pulse',
    routePath: '/home',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Physician', 'Care Coordinator', 'Superadmin'],
    overview: 'The central command hub for the clinical practice providing real-time operational pulse, top-level KPI indicators, high-priority clinical action items, and financial performance summaries.',
    features: [
      {
        featureName: 'Top Executive KPI Cards',
        description: 'Four high-visibility metrics tracking Total Active Patients, Monthly Clinical Encounters, Open Care Gaps, and Estimated Cost Savings.',
        uiLocation: 'Top Header Banner (Grid of 4 Cards)',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Card className="p-4 border-l-4 border-l-primary">
    <div className="text-sm font-medium text-muted-foreground">Total Active Patients</div>
    <div className="text-2xl font-bold mt-1">4,821 <span className="text-xs text-emerald-500 font-normal">+12% MoM</span></div>
  </Card>
</div>`
      },
      {
        featureName: 'High-Priority Action Feed',
        description: 'Real-time feed highlighting urgent patient alerts, such as recent hospital ADT discharges (< 72 hours), critical lab values, and unassigned high-risk gaps.',
        uiLocation: 'Main Content > Left Column',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
  <div className="flex items-center gap-3">
    <AlertCircle className="size-5 text-amber-500 shrink-0" />
    <div>
      <span className="font-semibold text-sm">Post-Discharge Outreach Needed</span>
      <p className="text-xs text-muted-foreground">3 patients discharged from ED in past 24h</p>
    </div>
  </div>
  <Button size="sm" variant="outline">Review Feed</Button>
</div>`
      },
      {
        featureName: 'Practice Pulse Activity Chart',
        description: 'Interactive longitudinal trend chart displaying daily encounter volume, secure messages sent, and active portal logins over the past 30 to 90 days.',
        uiLocation: 'Main Content > Right Column',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 400 100" className="w-full h-20 stroke-primary fill-primary/10">
  <polyline points="0,80 50,60 100,65 150,30 200,45 250,20 300,35 350,15 400,25" strokeWidth="2" fill="none" />
  <circle cx="250" cy="20" r="4" className="fill-primary" />
</svg>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Active Census Calculation',
        clinicalOrBusinessLogic: 'Calculates the real-time count of enrolled direct primary care or attributed network patients who have active status and at least one primary care evaluation within 24 months.',
        formula: 'Active Patients = Total Enrolled Roster - (Disenrolled + Deceased + Inactive > 24m)',
        dataSources: ['EHR Master Patient Index (MPI)', 'Payer 834 EDI Enrollment Feed']
      },
      {
        metricName: 'Priority Outreach Score',
        clinicalOrBusinessLogic: 'Determines the ordering of items inside the High-Priority Action Feed using a multi-factor clinical urgency weight.',
        formula: 'Outreach Score = (Recent ADT Discharge × 50) + (Critical Lab Alert × 40) + (Overdue Chronic Gap × 20)',
        dataSources: ['Hospital ADT HL7 v2 Feed', 'EHR Lab Order Results']
      }
    ],
    workflows: [
      {
        actionName: 'Triage Post-Discharge Patient from Action Feed',
        userRoles: ['Care Coordinator', 'Physician'],
        steps: [
          'Locate the Post-Discharge Alert card inside the High-Priority Action Feed on the Home dashboard.',
          'Click "Review Feed" to expand the list of recently discharged patients.',
          'Select a patient row to slide open the right-hand Clinical Details Drawer.',
          'Review the inpatient discharge summary, note medications added during hospitalization, and click "Log Outreach Call".',
          'Select "Transition of Care (TCM) Scheduled" and assign the follow-up appointment date within 7 or 14 days.'
        ],
        downstreamImpact: 'Closes the acute ADT discharge alert, logs a CPT 99495/99496 Transitional Care Management qualifying contact, and reduces 30-day readmission risk.'
      }
    ],
    relatedArticleIds: ['utilization-gaps', 'engagement-overview', 'chronic-risk']
  },
  {
    id: 'utilization-gaps',
    title: 'Utilization Gaps Action Centre (Modern UI)',
    routePath: '/utilization-gaps',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Physician', 'Quality Officer'],
    overview: 'A high-velocity clinical action center designed for population health management. Enables care teams to filter patient cohorts, inspect overdue preventive and chronic care gaps, and log multi-channel outreach directly.',
    features: [
      {
        featureName: 'Cohort Navigation Cards',
        description: 'Interactive top selector cards allowing one-click filtering by clinical cohort (e.g., Diabetes Control, Hypertension, Annual Wellness Visits, Breast Cancer Screening).',
        uiLocation: 'Top Page Section (Horizontal Scrollable Cards)',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
  <div className="p-3.5 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <span className="font-bold text-sm">Diabetes HbA1c Control</span>
      <Badge className="bg-primary/20 text-primary">High Priority</Badge>
    </div>
    <div className="text-2xl font-black mt-2">142 <span className="text-xs font-normal text-muted-foreground">overdue</span></div>
  </div>
</div>`
      },
      {
        featureName: 'Clinical Gap Record Table',
        description: 'Sortable patient table displaying patient demographic pills, specific clinical gap description, last recorded date, assigned care coordinator, and current outreach workflow status.',
        uiLocation: 'Center Main Area',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-left border-collapse text-xs">
  <thead>
    <tr className="border-b bg-muted/50 font-semibold">
      <th className="p-3">Patient Name & DOB</th>
      <th className="p-3">Clinical Gap</th>
      <th className="p-3">Status</th>
      <th className="p-3 text-right">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b hover:bg-muted/30">
      <td className="p-3 font-semibold">Eleanor Vance <span className="text-muted-foreground block font-normal">68F • DOB: 04/12/1958</span></td>
      <td className="p-3"><Badge variant="outline" className="border-rose-500 text-rose-600">HbA1c > 9.0% Overdue</Badge></td>
      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium">In Outreach</span></td>
      <td className="p-3 text-right"><Button size="sm" variant="ghost">Inspect Drawer</Button></td>
    </tr>
  </tbody>
</table>`
      },
      {
        featureName: 'Right-Hand Patient Details Overlay',
        description: 'Comprehensive clinical drawer sliding out from the right when a row is clicked. Displays patient summary, historical lab trends, chronic problem list, and an interactive multi-channel outreach logger.',
        uiLocation: 'Slide-Over Right Drawer Panel',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card border-l h-full flex flex-col justify-between">
  <div>
    <h3 className="font-bold text-base">Eleanor Vance</h3>
    <p className="text-xs text-muted-foreground">Primary Care: Dr. Robert Chen</p>
    <div className="mt-4 p-3 bg-muted/50 rounded-lg border text-xs">
      <strong>Gap Logic:</strong> Last HbA1c recorded 9.4% on 08/14/2025 (328 days ago). Guideline requires testing every 90 days for uncontrolled diabetes.
    </div>
  </div>
  <div className="border-t pt-4 space-y-2">
    <Button className="w-full gap-2 font-semibold"><PhoneCall className="size-4" /> Log Phone Outreach</Button>
    <Button variant="outline" className="w-full gap-2"><MessageSquare className="size-4" /> Send Automated SMS Reminder</Button>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Clinical Gap Identification Engine',
        clinicalOrBusinessLogic: 'Continuously evaluates clinical observations and billing claims against evidence-based quality measures (eCQM / HEDIS / USPSTF specifications).',
        formula: 'IsGapOpen = (ObservationDate < Today - GuidelineInterval) OR (ObservationValue > TargetThreshold)',
        dataSources: ['EHR LOINC Lab Observations', 'ICD-10 Billing Encounter Log', 'HL7 ADT Feeds']
      },
      {
        metricName: 'Outreach State Machine Engine',
        clinicalOrBusinessLogic: 'Controls patient transition stages across population health campaigns to prevent duplicate outreach and ensure closed-loop verification.',
        formula: 'Allowed Transitions: [Unassigned] → [In Outreach] → [Appointment Scheduled] → [Closed Gap (Lab Verified)]',
        dataSources: ['Care Coordinator Activity Logs', 'EHR Scheduling Feed']
      }
    ],
    workflows: [
      {
        actionName: 'Conducting and Logging Multi-Channel Patient Outreach',
        userRoles: ['Care Coordinator', 'Medical Assistant'],
        steps: [
          'Filter the Action Centre by clicking the "Diabetes HbA1c Control" cohort card.',
          'Sort the table by "High Priority" to identify patients with values > 9.0% or unassessed for > 6 months.',
          'Click anywhere on a patient row to open the Right-Hand Patient Details Overlay.',
          'Review the patient\'s communication preferences and prior contact history.',
          'Click "Send Automated SMS Reminder" to dispatch a pre-approved secure booking link, OR click "Log Phone Outreach" after speaking with the patient.',
          'Select the outcome state ("Appointment Scheduled for Next Tuesday") and click "Save & Advance".'
        ],
        downstreamImpact: 'Updates patient status to "Scheduled", logs a timestamped care coordination note inside the EHR chart, and increments the coordinator\'s daily outreach KPI.'
      }
    ],
    relatedArticleIds: ['utilization-gaps-classic', 'outcomes-screenings', 'chronic-risk']
  },
  {
    id: 'utilization-gaps-classic',
    title: 'Utilization Gaps (Classic UI)',
    routePath: '/utilization-gaps-classic',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Practice Manager'],
    overview: 'The legacy layout of the Utilization Gaps page featuring tabbed cohort selectors and dense tabular layouts. Preserved for clinical teams accustomed to historical tabular care management workflows.',
    features: [
      {
        featureName: 'Tabbed Cohort Navigation',
        description: 'Standard horizontal pill tabs separating patient lists by disease state or preventative screening requirement.',
        uiLocation: 'Top Sub-header Navigation Tabs',
        snippetType: 'jsx',
        uiSnippet: `<div className="flex border-b gap-4 text-sm font-semibold">
  <span className="pb-2 border-b-2 border-primary text-primary cursor-pointer">All Gaps (384)</span>
  <span className="pb-2 text-muted-foreground hover:text-foreground cursor-pointer">Diabetes (142)</span>
  <span className="pb-2 text-muted-foreground hover:text-foreground cursor-pointer">Hypertension (98)</span>
</div>`
      },
      {
        featureName: 'Classic Dense Patient Table',
        description: 'Compact table rendering maximum rows per screen with direct inline action dropdowns (`Log Call`, `Schedule`, `Dismiss`).',
        uiLocation: 'Main Tab Content Area',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs border">
  <tr className="bg-muted">
    <th className="p-2 border">Patient</th>
    <th className="p-2 border">Gap Type</th>
    <th className="p-2 border">Due Date</th>
    <th className="p-2 border">Assigned Staff</th>
  </tr>
  <tr>
    <td className="p-2 border font-medium">Arthur Pendelton</td>
    <td className="p-2 border">Annual Wellness Visit</td>
    <td className="p-2 border text-rose-600 font-bold">Overdue (45d)</td>
    <td className="p-2 border">Sarah J., RN</td>
  </tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Classic Gap Evaluation Rules',
        clinicalOrBusinessLogic: 'Identical underlying clinical engine as the Modern UI, ensuring 100% data consistency regardless of which interface care coordinators choose to use.',
        formula: 'Same eCQM / HEDIS numerator and denominator evaluation criteria as Modern Utilization Gaps.',
        dataSources: ['EHR Problem List', 'Claims Feed']
      }
    ],
    workflows: [
      {
        actionName: 'Batch Status Update in Classic UI',
        userRoles: ['Care Coordinator'],
        steps: [
          'Select the specific disease cohort tab (`Hypertension`).',
          'Use table checkboxes to select multiple patients assigned to the same primary care clinic.',
          'Click the bulk action header button "Assign Coordinator" and select a nurse care manager.',
          'Confirm batch assignment.'
        ],
        downstreamImpact: 'Reassigns patient outreach ownership in bulk across selected patient records.'
      }
    ],
    relatedArticleIds: ['utilization-gaps']
  },
  {
    id: 'engagement-overview',
    title: 'Engagement & Utilization Overview',
    routePath: '/engagement',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Care Coordinator', 'Medical Director'],
    overview: 'High-level population engagement dashboard summarizing patient interaction frequency, communication channel preference, and overall clinical vs. administrative touch density.',
    features: [
      {
        featureName: 'Omni-Channel Engagement Score Gauge',
        description: 'Circular percentage meter reflecting what portion of the active patient panel has interacted with the practice via any channel within the past 90 days.',
        uiLocation: 'Top Left Summary Card',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 100 100" className="size-20">
  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-muted fill-none" />
  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="62.8" className="text-primary fill-none -rotate-90 origin-center" />
  <text x="50" y="55" textAnchor="middle" className="text-sm font-bold fill-foreground">75%</text>
</svg>`
      },
      {
        featureName: 'Interaction Channel Distribution Chart',
        description: 'Stacked bar graph showing monthly volume of In-Person Visits, Telehealth Sessions, Portal Secure Messages, and Automated SMS check-ins.',
        uiLocation: 'Main Center Chart Panel',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-2 text-xs">
  <div className="flex justify-between"><span>In-Person Visits</span><span className="font-bold">45%</span></div>
  <div className="w-full bg-muted h-2 rounded-full overflow-hidden"><div className="bg-primary h-full w-[45%]" /></div>
  <div className="flex justify-between"><span>Secure Portal Messages</span><span className="font-bold">35%</span></div>
  <div className="w-full bg-muted h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[35%]" /></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Omni-Channel Engagement Index',
        clinicalOrBusinessLogic: 'Measures patient retention and stickiness by evaluating the proportion of unique patients who had at least one qualifying clinical or administrative touchpoint in a 90-day window.',
        formula: 'Engagement Rate = (Unique Patients with Touchpoint in Past 90d / Total Active Patient Panel) × 100',
        dataSources: ['EHR Encounters Log', 'Patient Portal Audit Log', 'SMS Gateway Log']
      }
    ],
    workflows: [
      {
        actionName: 'Identifying Low-Engagement Patient Cohorts',
        userRoles: ['Practice Manager', 'Care Coordinator'],
        steps: [
          'Review the Omni-Channel Engagement Score Gauge on the Engagement Overview page.',
          'Click the "Disengaged (< 1 Touch in 180d)" segment breakdown inside the interaction chart.',
          'Export the resulting patient list or click "Create Re-engagement Campaign".',
          'Select the "Annual Check-in & Preventive Wellness" automated message template.'
        ],
        downstreamImpact: 'Triggers automated SMS and email check-in prompts to disengaged patients, reducing patient attrition and catching silent chronic health deterioration.'
      }
    ],
    relatedArticleIds: ['engagement-active-patients', 'engagement-touch-ratio', 'engagement-digital']
  },
  {
    id: 'engagement-active-patients',
    title: 'Active Patients Demographics & Stratification',
    routePath: '/engagement/active-patients',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Superadmin'],
    overview: 'Detailed demographic segmentation of the current active patient census. Displays age and gender pyramids, risk tier distributions, and primary care provider panel assignment ratios.',
    features: [
      {
        featureName: 'Age & Gender Demographic Pyramid',
        description: 'Bidirectional bar chart breaking down the active patient panel by standard 5-year or 10-year age brackets separated by male and female enrollees.',
        uiLocation: 'Top Left Chart Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="flex items-center justify-center gap-4 text-xs font-mono">
  <div className="text-right w-24">65-74 yrs <span className="bg-blue-500 text-white px-2 py-0.5 rounded ml-1">18%</span></div>
  <div className="w-px h-8 bg-border" />
  <div className="text-left w-24"><span className="bg-rose-500 text-white px-2 py-0.5 rounded mr-1">21%</span> 65-74 yrs</div>
</div>`
      },
      {
        featureName: 'Provider Panel Distribution Table',
        description: 'Table showing each clinician in the practice along with their attributed patient count, average panel age, and average risk adjustment factor (RAF) score.',
        uiLocation: 'Bottom Table Area',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-left text-xs border">
  <tr className="bg-muted font-bold"><th className="p-2">Provider</th><th className="p-2">Attributed Panel</th><th className="p-2">Avg RAF</th></tr>
  <tr><td className="p-2">Dr. Robert Chen, MD</td><td className="p-2 font-bold">1,420</td><td className="p-2 text-amber-600">1.34</td></tr>
  <tr><td className="p-2">Sarah Jenkins, FNP</td><td className="p-2 font-bold">980</td><td className="p-2 text-emerald-600">0.89</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Provider Attribution Logic',
        clinicalOrBusinessLogic: 'Assigns patients to a primary care clinician based on explicit chart designation or plurality of primary care visits over the prior 24 months.',
        formula: 'Assigned PCP = Provider with Max(Primary Care E&M Visits in Past 24 Months)',
        dataSources: ['EHR Patient Demographics', 'Billing E&M Claims History']
      }
    ],
    workflows: [
      {
        actionName: 'Rebalancing Overloaded Clinician Panels',
        userRoles: ['Practice Manager', 'Superadmin'],
        steps: [
          'Inspect the Provider Panel Distribution Table to identify clinicians with panels exceeding 1,500 active patients or average RAF > 1.50.',
          'Click the provider\'s name to filter their attributed patient roster.',
          'Filter for low-complexity or newly enrolled patients without established chronic visits.',
          'Use the bulk re-assignment tool to transfer 100 low-complexity patients to a newly hired Nurse Practitioner.'
        ],
        downstreamImpact: 'Balances clinical workload across the practice, prevents physician burnout, and improves appointment availability for urgent patient needs.'
      }
    ],
    relatedArticleIds: ['engagement-overview', 'engagement-total-active-patients']
  },
  {
    id: 'engagement-total-active-patients',
    title: 'Total Active Patients & Longitudinal Enrollment',
    routePath: '/engagement/total-active-patients',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Superadmin', 'Financial Analyst'],
    overview: 'Tracks longitudinal membership growth, monthly net additions, and retention trends. Critical for direct primary care (DPC) and subscription health practices verifying billing metrics.',
    features: [
      {
        featureName: 'Longitudinal Enrollment Growth Curve',
        description: 'Multi-year area chart displaying total active census on the 1st of each calendar month alongside new member signups and disenrollment cancellations.',
        uiLocation: 'Main Top Chart Area',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 300 80" className="w-full h-16 stroke-emerald-500 fill-emerald-500/10">
  <path d="M0,70 Q75,60 150,40 T300,10 L300,80 L0,80 Z" fill="currentColor" stroke="none" />
  <polyline points="0,70 75,60 150,40 225,25 300,10" strokeWidth="2.5" fill="none" />
</svg>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Monthly Net Membership Growth Rate',
        clinicalOrBusinessLogic: 'Calculates practice expansion or contraction by subtracting monthly member churn from gross new patient enrollments.',
        formula: 'Net Growth % = ((New Enrollees - Disenrolled Members) / Beginning Month Active Census) × 100',
        dataSources: ['Payer 834 EDI Feed', 'EHR Membership Status Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Auditing Monthly Churn Spikes',
        userRoles: ['Practice Manager', 'Financial Analyst'],
        steps: [
          'Navigate to the Total Active Patients chart and check for months where the red disenrollment bar exceeds 3% of total census.',
          'Click the monthly disenrollment bar to view the exact list of cancelled or disenrolled patients.',
          'Filter by stated cancellation reason (`Relocation`, `Employer Switch`, `Cost/Affordability`, `Dissatisfaction`).',
          'Export the list for exit interview follow-up or practice quality review.'
        ],
        downstreamImpact: 'Identifies systemic patient retention issues and allows practice leadership to adjust pricing, communication, or access policies.'
      }
    ],
    relatedArticleIds: ['engagement-active-patients', 'admin-patient-counts']
  },
  {
    id: 'engagement-after-hours-encounters',
    title: 'After Hours Encounters & ED Diversion',
    routePath: '/engagement/after-hours-encounters',
    dashboardGroup: 'Analytics',
    targetAudience: ['Medical Director', 'Care Coordinator', 'Practice Manager'],
    overview: 'Analyzes patient visits, telehealth sessions, and urgent phone calls occurring outside normal practice operating hours. Essential for identifying avoidable Emergency Department (ED) visits and optimizing on-call provider staffing.',
    features: [
      {
        featureName: 'Time-of-Day Encounter Heatmap',
        description: 'Grid chart showing encounter volume mapped across all 24 hours of the day and 7 days of the week, highlighting evening and weekend volume concentrations.',
        uiLocation: 'Main Center Heatmap Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-7 gap-1 text-[10px] text-center font-mono">
  <div className="p-2 bg-muted rounded">Mon 8PM</div>
  <div className="p-2 bg-rose-500/30 text-rose-800 font-bold rounded">Sat 2AM (12)</div>
  <div className="p-2 bg-amber-500/20 rounded">Sun 10AM (5)</div>
</div>`
      },
      {
        featureName: 'Avoidable ED Diversion Opportunity Table',
        description: 'List of after-hours encounters categorized by presenting chief complaint (`Upper Respiratory`, `Minor Laceration`, `Dysuria`, `Refill Request`) to highlight visits that could be diverted to lower-cost asynchronous or telehealth modalities.',
        uiLocation: 'Bottom Breakdown Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-muted rounded border text-xs flex justify-between items-center">
  <div><span className="font-bold">Chief Complaint: Dysuria (UTI symptoms)</span> <p className="text-muted-foreground text-[11px]">18 encounters after 8 PM</p></div>
  <Badge className="bg-emerald-500/20 text-emerald-700">88% Divertable via Asynchronous Protocol</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'After-Hours Encounter Classification',
        clinicalOrBusinessLogic: 'Flags all clinical interactions timestamped outside designated clinic hours as after-hours events.',
        formula: 'IsAfterHours = (EncounterTimestamp < 08:00 AM OR EncounterTimestamp >= 17:00 PM) OR (DayOfWeek in [Saturday, Sunday, FederalHoliday])',
        dataSources: ['EHR Encounter Timestamp Log', 'Telehealth Session Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Implementing Asynchronous Clinical Triage Protocols',
        userRoles: ['Medical Director', 'Practice Manager'],
        steps: [
          'Review the After Hours Encounters table to identify the top 3 high-volume minor chief complaints (`UTI`, `Pink Eye`, `Medication Refill`).',
          'Evaluate how many of these visits resulted in unnecessary ED or Urgent Care referrals.',
          'Configure automated portal intake questionnaires for these 3 complaints inside Survey & Templates configuration.',
          'Instruct on-call staff to route after-hours patients through these rapid digital intake forms.'
        ],
        downstreamImpact: 'Reduces physician on-call sleep disruption, lowers commercial payer ED utilization costs, and provides rapid 15-minute resolution for minor acute ailments.'
      }
    ],
    relatedArticleIds: ['engagement-encounters', 'engagement-after-hours-rx', 'engagement-after-hours-msg']
  },
  {
    id: 'engagement-total-active-manifest-members',
    title: 'Total Active Manifest Members & Roster Reconciliation',
    routePath: '/engagement/total-active-manifest-members',
    dashboardGroup: 'Analytics',
    targetAudience: ['Billing Analyst', 'Practice Manager', 'Superadmin'],
    overview: 'Provides automated eligibility and roster reconciliation by cross-referencing employer group manifest rosters (834 EDI files) against local EHR active chart status.',
    features: [
      {
        featureName: 'Roster Mismatch Alert Banner',
        description: 'Prominent summary banner reporting total active manifest members alongside discrepancies (`Unbilled EHR Active Charts` vs `Ghost Enrollees Not in EHR`).',
        uiLocation: 'Top Alert Banner',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
  <div className="flex items-center gap-3">
    <ShieldAlert className="size-6 text-rose-500" />
    <div>
      <h4 className="font-bold text-sm text-foreground">Roster Mismatch Detected</h4>
      <p className="text-xs text-muted-foreground">14 patients active in EHR but missing from current Employer Payer Manifest</p>
    </div>
  </div>
  <Button size="sm" variant="destructive">Reconcile Roster</Button>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Roster Reconciliation Discrepancy Formula',
        clinicalOrBusinessLogic: 'Identifies billing leakage and uncompensated care by flagging chart mismatches between local practice records and payer eligibility feeds.',
        formula: 'Unbilled Active Charts = { EHR Active Patients } - { Payer Manifest 834 Roster }',
        dataSources: ['Payer 834 Eligibility EDI Feed', 'EHR Master Patient Index']
      }
    ],
    workflows: [
      {
        actionName: 'Reconciling Unbilled Patient Records',
        userRoles: ['Billing Analyst', 'Practice Manager'],
        steps: [
          'Click the "Reconcile Roster" button on the Active Manifest Members dashboard.',
          'Inspect the list of 14 patients who are active in the EHR but missing from the payer\'s monthly roster.',
          'Verify whether each patient recently changed employers or if the payer dropped their coverage in error.',
          'Export the discrepancy report and transmit it via secure SFTP/EDI to the employer benefits broker or health plan eligibility department.'
        ],
        downstreamImpact: 'Recovers lost monthly subscription/capitation revenue and prevents practice staff from providing uncompensated care to disenrolled members.'
      }
    ],
    relatedArticleIds: ['engagement-total-active-patients', 'billing-reports']
  },
  {
    id: 'engagement-patient-touch-ratio',
    title: 'Patient Touch Ratio & Panel Efficiency',
    routePath: '/engagement/patient-touch-ratio',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Medical Director'],
    overview: 'Tracks the monthly ratio of total clinical and administrative interactions against active patient panel counts. Highlights care team proactive outreach frequency vs. reactive acute visits.',
    features: [
      {
        featureName: 'Touch Ratio Gauge & Trend Curve',
        description: 'Displays the practice average touch ratio (e.g., 2.4 touches per patient per month) with comparative benchmarks across different provider panels.',
        uiLocation: 'Main Center Trend Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border space-y-2">
  <div className="flex justify-between text-sm font-semibold"><span>Practice Average Touch Ratio</span><span className="text-primary font-bold text-lg">2.41 / mo</span></div>
  <p className="text-xs text-muted-foreground">Clinical Touches: 1.15 • Administrative & Digital Touches: 1.26</p>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Patient Touch Ratio Calculation',
        clinicalOrBusinessLogic: 'Evaluates population engagement intensity. High-performing value-based care practices aim for touch ratios >= 2.0 per month to maintain strong patient relationships.',
        formula: 'Touch Ratio = (Total Clinical Encounters + Phone Calls + Secure Messages + Automated Prompts) / Active Patient Panel',
        dataSources: ['EHR Encounters Log', 'Twilio SMS Logs', 'Portal Audit Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Optimizing Touch Ratio via Automated Proactive Campaigns',
        userRoles: ['Practice Manager', 'Care Coordinator'],
        steps: [
          'Identify provider panels where the monthly Touch Ratio falls below 1.0 per patient.',
          'Navigate to Communication Campaigns and select the assigned provider\'s patient panel.',
          'Schedule a monthly automated SMS health check-in ("How are you feeling with your current blood pressure medications? Reply 1 for Good, 2 for Side Effects").',
          'Monitor next month\'s Touch Ratio report to verify increased patient engagement.'
        ],
        downstreamImpact: 'Increases practice touch ratio with near-zero clinical staff effort, improves patient satisfaction, and fulfills value-based care touchpoint requirements.'
      }
    ],
    relatedArticleIds: ['engagement-overview', 'communication-campaigns']
  },
  {
    id: 'engagement-encounters',
    title: 'Comprehensive Clinical Encounters Log',
    routePath: '/engagement/encounters',
    dashboardGroup: 'Analytics',
    targetAudience: ['Physician', 'Medical Coder', 'Care Coordinator'],
    overview: 'Master filterable log of all clinical visits, telehealth appointments, procedure check-ins, and administrative encounters across the entire medical practice.',
    features: [
      {
        featureName: 'Multi-Criteria Encounter Filter Bar',
        description: 'Powerful filter bar allowing simultaneous filtering by Date Range, Attending Clinician, Place of Service (POS), ICD-10 Diagnosis Code, and Billing Adjudication Status.',
        uiLocation: 'Top Filter Controls Bar',
        snippetType: 'jsx',
        uiSnippet: `<div className="flex flex-wrap gap-2 p-3 bg-muted/40 rounded-lg border text-xs">
  <span className="px-2 py-1 bg-background border rounded font-medium">Provider: All</span>
  <span className="px-2 py-1 bg-background border rounded font-medium">Modality: Telehealth (POS 02)</span>
  <span className="px-2 py-1 bg-background border rounded font-medium">Status: Signed & Coded</span>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Encounter Coded Completion Rate',
        clinicalOrBusinessLogic: 'Tracks what percentage of closed clinical visits have complete E&M procedure codes (CPT) and primary diagnoses (ICD-10) assigned.',
        formula: 'Coded Rate % = (Encounters with Valid CPT & ICD-10 / Total Signed Encounters) × 100',
        dataSources: ['EHR Encounter Notes', 'Billing Superbill Records']
      }
    ],
    workflows: [
      {
        actionName: 'Auditing Unsigned & Uncoded Clinical Notes',
        userRoles: ['Medical Coder', 'Physician'],
        steps: [
          'Open the Encounters Log and apply the filter `Billing Status: Draft / Unsigned`.',
          'Sort the table by Encounter Date ascending to highlight aging notes (> 72 hours old).',
          'Click an unsigned encounter row to inspect the provider\'s draft chart.',
          'Send an automated chart completion reminder prompt directly to the attending physician\'s task queue.'
        ],
        downstreamImpact: 'Prevents revenue cycle delays, ensures timely claim submission within payer filing limits, and maintains accurate clinical medical records.'
      }
    ],
    relatedArticleIds: ['engagement-encounter-types', 'hcc-coding-queue']
  },
  {
    id: 'engagement-encounter-types-breakdown',
    title: 'Encounter Modality Breakdown',
    routePath: '/engagement/encounter-types-breakdown',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Medical Director'],
    overview: 'Detailed segmentation of clinical visits categorized across In-Person Office Visits, Telehealth Video Appointments, Telephone Check-ins, and Asynchronous e-Visits.',
    features: [
      {
        featureName: 'Modality Distribution Pie & Bar Charts',
        description: 'Visual comparison illustrating shifts in how patients consume healthcare services, comparing current month modality split against historical 12-month averages.',
        uiLocation: 'Center Visual Charts Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border flex items-center justify-around text-xs">
  <div className="text-center"><span className="block text-xl font-black text-primary">58%</span> In-Person Office</div>
  <div className="h-8 w-px bg-border" />
  <div className="text-center"><span className="block text-xl font-black text-blue-500">32%</span> Telehealth Video</div>
  <div className="h-8 w-px bg-border" />
  <div className="text-center"><span className="block text-xl font-black text-emerald-500">10%</span> Async / Phone</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Encounter Modality Categorization Rule',
        clinicalOrBusinessLogic: 'Classifies visit type by inspecting Place of Service (POS) codes and CPT telehealth modifiers.',
        formula: 'If POS == "02" or CPT Modifier in ["-95", "-GT"] => Telehealth; If POS == "11" => In-Person Office',
        dataSources: ['EHR Billing Claim Line Items']
      }
    ],
    workflows: [
      {
        actionName: 'Expanding Telehealth Capacity for Routine Follow-ups',
        userRoles: ['Practice Manager', 'Medical Director'],
        steps: [
          'Review the Modality Breakdown and note if routine chronic disease follow-ups (e.g., uncomplicated hypertension checks) are occupying > 60% of In-Person Office slots.',
          'Adjust scheduling templates to convert 30% of routine follow-up slots into dedicated 15-minute Telehealth blocks.',
          'Send SMS notifications to stable chronic patients offering convenient virtual video follow-ups.'
        ],
        downstreamImpact: 'Frees up physical examination rooms for complex acute patients and new consults while improving patient convenience and satisfaction.'
      }
    ],
    relatedArticleIds: ['engagement-encounters', 'engagement-care-episodes']
  },
  {
    id: 'engagement-care-episodes-breakdown',
    title: 'Longitudinal Care Episodes Breakdown',
    routePath: '/engagement/care-episodes-breakdown',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Physician', 'Medical Director'],
    overview: 'Groups disconnected individual clinical encounters, prescription refills, and diagnostic lab orders into unified longitudinal care episodes (e.g., 90-day Post-Acute COPD Exacerbation episode).',
    features: [
      {
        featureName: 'Care Episode Timeline Visualizer',
        description: 'Interactive Gantt-style timeline tracking patient care episodes from initial diagnostic trigger through active management and final resolution/stabilization.',
        uiLocation: 'Main Timeline Card Area',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-muted/40 rounded-lg border space-y-2 text-xs">
  <div className="flex justify-between font-bold"><span>Episode: Acute Congestive Heart Failure Exacerbation</span><Badge className="bg-amber-500/20 text-amber-700">Active (Day 24 of 90)</Badge></div>
  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
    <span>06/14: ED Discharge</span> → <span>06/18: PCP Follow-up</span> → <span>06/25: Lasix Titration Lab</span>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Episode Grouping & Attribution Engine',
        clinicalOrBusinessLogic: 'Bundles all clinical claims and EHR observations sharing clinically related ICD-10 diagnosis families (`I50.*` for Heart Failure, `E11.*` for Diabetes) within a defined time horizon.',
        formula: 'Episode Duration = [Initial Trigger Diagnosis Date] to [Last Related Encounter + 90 Days Clean Window]',
        dataSources: ['EHR Problem List', 'ICD-10 Billing Claims', 'Pharmacy Refill Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Managing Active 90-Day Post-Acute Episodes',
        userRoles: ['Care Coordinator'],
        steps: [
          'Open the Care Episodes Breakdown and filter for `Status: Active` and `Risk Level: High`.',
          'Select a patient undergoing a 90-day post-hospitalization Heart Failure care episode.',
          'Verify that all required milestone checks (7-day post-discharge visit, 14-day basic metabolic panel, 30-day medication reconciliation) have scheduled timestamps.',
          'If a milestone is missing, click "Add Episode Task" to assign a priority scheduling order to the front desk.'
        ],
        downstreamImpact: 'Ensures structured protocol compliance during high-risk post-acute windows, preventing avoidable 30-day hospital readmissions.'
      }
    ],
    relatedArticleIds: ['engagement-encounters', 'coordinated-care']
  },
  {
    id: 'engagement-prescriptions',
    title: 'Prescription Orders & Fulfillment Tracking',
    routePath: '/engagement/prescriptions',
    dashboardGroup: 'Analytics',
    targetAudience: ['Physician', 'Care Coordinator', 'Pharmacist'],
    overview: 'Master e-prescribing tracking hub logging all medication orders, controlled substance verifications (PDMP checks), electronic refill requests, and pharmacy pickup fulfillment statuses.',
    features: [
      {
        featureName: 'Rx Fulfillment Status Board',
        description: 'Table tracking outbound e-prescriptions with real-time NCPDP electronic status confirmations (`Status: Transmitted`, `Dispensed by Pharmacy`, `Unpicked Up > 7 Days`).',
        uiLocation: 'Main Center Tracking Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Patient</th><th className="p-2">Medication Order</th><th className="p-2">Pharmacy Status</th></tr>
  <tr><td className="p-2 font-medium">Eleanor Vance</td><td className="p-2 font-mono">Lisinopril 20mg Tab (#90)</td><td className="p-2"><Badge className="bg-emerald-500/20 text-emerald-700">Dispensed 07/04/2026</Badge></td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Unpicked Prescription Abandonment Rate',
        clinicalOrBusinessLogic: 'Identifies primary non-adherence where a clinician successfully e-prescribes a medication but the patient fails to pick it up from the pharmacy within 10 days.',
        formula: 'Primary Non-Adherence % = (Prescriptions Marked Unpicked Up / Total e-Prescriptions Transmitted) × 100',
        dataSources: ['NCPDP SCRIPT Electronic Pharmacy Status Feed']
      }
    ],
    workflows: [
      {
        actionName: 'Outreach to Patients with Abandoned Prescriptions',
        userRoles: ['Care Coordinator', 'Medical Assistant'],
        steps: [
          'Filter the Prescriptions table by `Status: Unpicked Up (> 7 Days)`.',
          'Sort by high-priority maintenance drug classes (`Antihypertensives`, `Insulin`, `Anticoagulants`).',
          'Click the patient row to open the contact drawer and call the patient to investigate barrier (cost, transportation, side effect fear).',
          'If cost is the barrier, switch prescription to a $4 generic formulary alternative or route order to a home delivery discount pharmacy.'
        ],
        downstreamImpact: 'Eliminates primary medication non-adherence, prevents acute disease exacerbation, and improves HEDIS/Star rating medication metrics.'
      }
    ],
    relatedArticleIds: ['engagement-prescriptions-breakdown', 'outcomes-medication-refills']
  },
  {
    id: 'engagement-after-hours-prescriptions',
    title: 'After Hours Prescriptions & Urgent Dispensing',
    routePath: '/engagement/after-hours-prescriptions',
    dashboardGroup: 'Analytics',
    targetAudience: ['Medical Director', 'Physician'],
    overview: 'Monitors all e-prescriptions and telephone drug orders authorized by on-call clinicians outside normal clinic hours. Essential for quality auditing of after-hours antibiotic and controlled substance prescribing.',
    features: [
      {
        featureName: 'On-Call Prescribing Audit Table',
        description: 'Chronological log detailing attending on-call clinician, patient name, prescribed medication, chief complaint, and whether a corresponding after-hours encounter note was documented.',
        uiLocation: 'Main Audit Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-muted/30 border rounded text-xs flex justify-between items-center">
  <div><span className="font-bold">Amoxicillin-Pot Clavulanate 875-125 mg Tab</span> <p className="text-muted-foreground text-[11px]">Prescribed Sat 11:42 PM by Dr. Robert Chen (On-Call)</p></div>
  <Badge variant="outline" className="text-emerald-600 border-emerald-500">Encounter Note Linked</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'After-Hours Rx without Note Rate',
        clinicalOrBusinessLogic: 'Flags compliance risks where a medication is called into a 24-hour pharmacy during on-call hours without a corresponding clinical encounter note entered within 24 hours.',
        formula: 'Unlinked After-Hours Rx % = (After-Hours Rx without Linked Encounter ID within 24h / Total After-Hours Rx) × 100',
        dataSources: ['EHR Prescription Transmission Log', 'EHR Encounter Master Table']
      }
    ],
    workflows: [
      {
        actionName: 'Reconciling Unlinked After-Hours Prescriptions',
        userRoles: ['Medical Director', 'Care Coordinator'],
        steps: [
          'Filter the After Hours Prescriptions table by `Encounter Note: Missing (> 24h)`.',
          'Identify the prescribing on-call clinician and click "Send Charting Reminder".',
          'Ensure the clinician documents the brief telephone encounter justifying the urgent prescription.'
        ],
        downstreamImpact: 'Maintains rigorous legal and regulatory medical record compliance and captures billable CPT 99441-99443 telephone E&M revenue.'
      }
    ],
    relatedArticleIds: ['engagement-after-hours-encounters', 'engagement-prescriptions']
  },
  {
    id: 'engagement-prescriptions-breakdown',
    title: 'Prescriptions Therapeutic Class & Generic Breakdown',
    routePath: '/engagement/prescriptions-breakdown',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'Categorizes prescribing patterns by therapeutic drug class (`Cardiovascular`, `Endocrine`, `Psychotropic`, `Anti-Infective`), brand vs. generic dispensing ratios, and chronic maintenance status.',
    features: [
      {
        featureName: 'Generic vs. Brand Dispensing Efficiency Chart',
        description: 'Comparative bar graph tracking what percentage of prescribed medications utilize cost-effective generic formulations versus expensive brand-name equivalents.',
        uiLocation: 'Top Efficiency Summary Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border flex items-center justify-between text-xs">
  <div><span className="font-bold text-sm block">Generic Dispensing Rate (GDR)</span><span className="text-muted-foreground">Target: >= 88%</span></div>
  <div className="text-2xl font-black text-emerald-600">91.4%</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Generic Dispensing Rate (GDR)',
        clinicalOrBusinessLogic: 'Measures pharmacy cost-efficiency by comparing the volume of generic fills against total multi-source prescription fills.',
        formula: 'GDR % = (Total Generic Prescriptions Dispensed / Total Multi-Source Prescriptions Dispensed) × 100',
        dataSources: ['NCPDP Pharmacy Claims Feed', 'EHR Medication Formulary DB']
      }
    ],
    workflows: [
      {
        actionName: 'Identifying Brand-to-Generic Switch Opportunities',
        userRoles: ['Care Coordinator', 'Pharmacist'],
        steps: [
          'Review the Prescriptions Breakdown and filter for `Therapeutic Class: Cardiovascular` and `Formulation: Brand Name Only`.',
          'Export the list of patients taking brand-name cholesterol or blood pressure medications where FDA-approved AB-rated generics exist.',
          'Submit a batch therapeutic interchange recommendation request to the attending primary care physicians for approval.'
        ],
        downstreamImpact: 'Significantly lowers patient out-of-pocket copay costs, improves long-term medication adherence, and boosts ACO/health plan cost-efficiency bonus scores.'
      }
    ],
    relatedArticleIds: ['engagement-prescriptions', 'cost-savings']
  },
  {
    id: 'engagement-digital-engagement',
    title: 'Digital Engagement & Connected Device Sync',
    routePath: '/engagement/digital-engagement',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'Monitors patient adoption of digital health tools, including web/mobile portal logins, Remote Patient Monitoring (RPM) device transmissions (blood pressure cuffs, glucometers), and Apple Health/Fitbit syncs.',
    features: [
      {
        featureName: 'Remote Patient Monitoring (RPM) Sync Status Table',
        description: 'Live roster of patients enrolled in cellular or Bluetooth RPM programs, showing last biometric transmission timestamp (`BP: 124/82 2h ago`) and transmission regularity.',
        uiLocation: 'Center RPM Roster Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-muted/40 border rounded text-xs flex justify-between items-center">
  <div><span className="font-bold">Arthur Pendelton (Enrolled in RPM Hypertension)</span> <p className="text-muted-foreground text-[11px]">Last Sync: Today at 08:14 AM • BP: 128/84 mmHg</p></div>
  <Badge className="bg-emerald-500/20 text-emerald-700">16 Days Synced This Month (Billable threshold reached)</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'RPM CPT 99454 Billing Eligibility Engine',
        clinicalOrBusinessLogic: 'Tracks daily device transmissions to verify whether a patient has met the mandatory 16 days of biometric syncs per calendar month required to bill CPT 99454 ($50-$65/mo).',
        formula: 'Is99454Billable = (Count of Unique Calendar Days with Valid Biometric Sync in Month >= 16)',
        dataSources: ['Cellular/Bluetooth RPM Gateway Feed (Withings / iHealth / BodyTrace)']
      }
    ],
    workflows: [
      {
        actionName: 'Intervening on RPM Device Transmission Drop-offs',
        userRoles: ['Care Coordinator', 'Medical Assistant'],
        steps: [
          'Filter the RPM Sync Status table by `Days Synced This Month: 10 to 15 Days` on the 24th day of the month.',
          'Identify patients who are only 1 or 2 transmission days away from reaching the 16-day billing threshold.',
          'Send an automated SMS reminder or place a brief technical support check-in call to ensure their blood pressure cuff has charged batteries and cell signal.',
          'Guide the patient to take a blood pressure reading over the phone.'
        ],
        downstreamImpact: 'Secures recurring monthly RPM CPT 99454 practice revenue while maintaining continuous clinical oversight of high-risk hypertensive patients.'
      }
    ],
    relatedArticleIds: ['engagement-overview', 'chronic-risk']
  },
  {
    id: 'engagement-messages',
    title: 'Two-Way Patient Messages Log & Response Times',
    routePath: '/engagement/messages',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Physician', 'Front Desk'],
    overview: 'Master communication log capturing two-way secure SMS, portal chat threads, and triage messaging between patients and practice staff. Tracks staff response turnaround metrics.',
    features: [
      {
        featureName: 'Response Turnaround Time (TAT) Meter',
        description: 'Dashboard gauge displaying average practice response time to inbound patient queries during business hours (`Avg Turnaround: 42 minutes`).',
        uiLocation: 'Top Right Metrics Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border flex justify-between items-center text-xs">
  <div><span className="font-bold text-sm block">Avg Staff Response Turnaround</span><span className="text-muted-foreground">SLA Target: < 60 mins</span></div>
  <div className="text-2xl font-black text-emerald-600">38 mins</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Business-Hours Message Response Turnaround Time',
        clinicalOrBusinessLogic: 'Calculates elapsed time between patient message receipt and first staff reply, pausing calculation clocks during overnight after-hours and weekend windows.',
        formula: 'Turnaround Time = StaffFirstReplyTimestamp - PatientInboundMessageTimestamp (excluding non-operating hours)',
        dataSources: ['EHR Secure Messaging Audit Log', 'Twilio SMS Log']
      }
    ],
    workflows: [
      {
        actionName: 'Escalating Unanswered Patient Messages > 2 Hours',
        userRoles: ['Care Coordinator', 'Front Desk Lead'],
        steps: [
          'Open the Messages Log and filter by `Status: Unread / Unanswered` and `Turnaround: > 120 Minutes`.',
          'Sort by clinical triage tag (`Symptom Complaint` vs `Billing Inquiry`).',
          'Directly assign overdue clinical inquiries to the covering triage nurse for immediate phone escalation.'
        ],
        downstreamImpact: 'Prevents patient dissatisfaction, reduces negative online reviews, and ensures prompt clinical evaluation of rising acute symptoms.'
      }
    ],
    relatedArticleIds: ['engagement-message-types', 'engagement-after-hours-msg']
  },
  {
    id: 'engagement-message-types-breakdown',
    title: 'Inbound Message NLP Categorization & Tags',
    routePath: '/engagement/message-types-breakdown',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'Utilizes Natural Language Processing (NLP) keyword and intent classification to automatically segment inbound messages into clinical triage, refill requests, scheduling, and billing inquiries.',
    features: [
      {
        featureName: 'Message Category Distribution Heatmap',
        description: 'Visual treemap showing relative volume of each message category (`Refill Requests: 42%`, `Scheduling: 28%`, `Clinical Triage: 20%`, `Billing: 10%`).',
        uiLocation: 'Center Treemap Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-4 gap-2 text-xs text-white font-bold">
  <div className="col-span-2 bg-blue-600 p-4 rounded-lg">Medication Refill Requests (42%)</div>
  <div className="bg-emerald-600 p-4 rounded-lg">Scheduling (28%)</div>
  <div className="bg-amber-600 p-4 rounded-lg">Clinical Triage (20%)</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Automated NLP Tag Classification Algorithm',
        clinicalOrBusinessLogic: 'Evaluates inbound message body text against weighted regex dictionaries and intent classification models to assign primary routing tags within 500 milliseconds.',
        formula: 'If text matches regex /(refill|renew|out of|pharmacy)/i => Tag as "Refill Request" and route to Medical Assistant Queue.',
        dataSources: ['Inbound SMS/Chat Body Text']
      }
    ],
    workflows: [
      {
        actionName: 'Automating Routine Medication Refill Workflows',
        userRoles: ['Practice Manager', 'Pharmacist'],
        steps: [
          'Observe that `Medication Refill Requests` represent > 40% of total practice messaging volume.',
          'Enable the automated "Asynchronous Refill Protocol" inside Survey Configuration.',
          'When a patient texts "Refill Lisinopril", the system automatically checks if they had an annual lab draw within 12m and sends an approval request directly to the physician\'s one-click sign queue.'
        ],
        downstreamImpact: 'Saves care coordinators 2 to 3 hours of manual phone and chat typing daily while accelerating prescription refill turnaround to under 15 minutes.'
      }
    ],
    relatedArticleIds: ['engagement-messages', 'engagement-prescriptions']
  },
  {
    id: 'engagement-after-hours-messages',
    title: 'After Hours Messages & On-Call Triage',
    routePath: '/engagement/after-hours-messages',
    dashboardGroup: 'Analytics',
    targetAudience: ['Medical Director', 'Care Coordinator'],
    overview: 'Monitors inbound SMS and portal secure messages received during overnight, weekend, and holiday hours. Enforces automated keyword screening for emergency symptoms.',
    features: [
      {
        featureName: 'On-Call Emergency Keyword Alert Log',
        description: 'High-visibility log detailing after-hours messages that triggered emergency keyword escalations (`"chest pain"`, `"can\'t breathe"`, `"bleeding heavily"`) and exact on-call physician acknowledgment timestamps.',
        uiLocation: 'Top Emergency Alert Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-xs flex justify-between items-center font-mono">
  <div><span className="font-bold text-rose-600">EMERGENCY KEYWORD TRIGGERED: "shortness of breath"</span> <p className="text-muted-foreground text-[10px]">Received Sun 02:14 AM from Eleanor Vance • Auto-Paging On-Call MD</p></div>
  <Badge className="bg-emerald-500/20 text-emerald-700 font-sans">MD Acknowledged 02:17 AM (3 min TAT)</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Emergency Keyword Auto-Escalation Engine',
        clinicalOrBusinessLogic: 'Immediately intercepts after-hours messages containing critical symptom keywords and triggers high-priority SMS and automated voice pages to the on-call clinician.',
        formula: 'If IsAfterHours AND MessageBody contains any [EmergencyKeywordList] => Trigger Immediate Pager Duty SMS + Auto-Reply 911 Banner to Patient.',
        dataSources: ['Inbound After-Hours Message Text Stream']
      }
    ],
    workflows: [
      {
        actionName: 'Auditing On-Call Emergency Response Turnaround',
        userRoles: ['Medical Director'],
        steps: [
          'Review the After Hours Messages audit table every Monday morning.',
          'Inspect any emergency keyword escalation where on-call clinician acknowledgment time exceeded 15 minutes.',
          'Verify that the covering clinician successfully contacted the patient and documented the triage decision.'
        ],
        downstreamImpact: 'Guarantees patient safety during high-risk overnight windows and protects the medical practice from clinical liability.'
      }
    ],
    relatedArticleIds: ['engagement-after-hours-encounters', 'engagement-messages']
  },
  {
    id: 'cost-savings',
    title: 'Cost Savings Analytics & Value ROI',
    routePath: '/cost-savings',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Employer Group Executive', 'Financial Analyst'],
    overview: 'Comprehensive financial dashboard quantifying the tangible economic ROI generated by direct primary care (DPC) and proactive care coordination. Tracks avoidable ED visits, generic Rx savings, and hospital readmission reductions.',
    features: [
      {
        featureName: 'Total Economic Savings ROI Waterfall Chart',
        description: 'Visual waterfall bar chart breaking down total practice dollars saved across Avoided ED Visits ($2,100 avg), Avoided Inpatient Admissions ($14,500 avg), and Generic Rx Substitutions ($85/rx avg).',
        uiLocation: 'Main Top Waterfall Chart',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border space-y-3 text-xs">
  <div className="flex justify-between font-bold text-sm"><span>Total Estimated Annual Employer Healthcare Savings</span><span className="text-emerald-600 font-black text-xl">$1,428,500</span></div>
  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t font-mono">
    <div className="p-2 bg-emerald-500/10 rounded">ED Diversion: $412,000</div>
    <div className="p-2 bg-blue-500/10 rounded">Readmission Avoidance: $652,500</div>
    <div className="p-2 bg-purple-500/10 rounded">Generic Rx Savings: $364,000</div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Avoidable ED & Hospitalization Economic Formula',
        clinicalOrBusinessLogic: 'Applies actuarial benchmarks from commercial and Medicare claims databases to calculate estimated downstream savings from diverted acute encounters.',
        formula: 'Total Savings = (Avoided ED Visits × $2,100) + (Avoided Readmissions × $14,500) + Σ(Brand Price - Generic Price for Substituted Rx)',
        dataSources: ['Claims 837P/837I History', 'Actuarial Cost Benchmark Tables']
      }
    ],
    workflows: [
      {
        actionName: 'Generating Employer Group ROI Performance Scorecard',
        userRoles: ['Practice Manager', 'Employer Group Executive'],
        steps: [
          'Open the Cost Savings dashboard and filter by specific `Employer Group Manifest` (e.g., "Acme Manufacturing").',
          'Set the date range to `Previous Calendar Year (Jan 1 - Dec 31)`.',
          'Click "Export Employer Executive ROI Summary PDF".',
          'Present the report during annual benefits renewal negotiations to demonstrate a 3.4x ROI on direct primary care subscription fees.'
        ],
        downstreamImpact: 'Secures long-term employer contract renewals and justifies premium direct primary care per-member-per-month (PMPM) pricing.'
      }
    ],
    relatedArticleIds: ['claims-utilization', 'engagement-overview']
  },
  {
    id: 'chronic-risk',
    title: 'Chronic Risk Stratification & Burden Heatmaps',
    routePath: '/chronic-risk',
    dashboardGroup: 'Analytics',
    targetAudience: ['Medical Director', 'Care Coordinator', 'Physician'],
    overview: 'Stratifies the entire patient population into Low, Rising, and High-Risk clinical tiers based on multi-morbidity burden (`Diabetes`, `Hypertension`, `CHF`, `COPD`, `CKD`) and recent acute utilization history.',
    features: [
      {
        featureName: 'Population Risk Pyramid & Cohort Selector',
        description: '3-tier interactive pyramid showing exact percentage and patient count across High Risk (Top 5%), Rising Risk (Next 20%), and Low Risk (Bottom 75%). Clicking any tier filters the patient list.',
        uiLocation: 'Top Left Pyramid Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs font-bold text-white text-center">
  <div className="bg-rose-600 p-2 rounded-t-lg cursor-pointer hover:opacity-90">High Risk Tier (Top 5% • 241 Patients)</div>
  <div className="bg-amber-500 p-3 cursor-pointer hover:opacity-90">Rising Risk Tier (Next 20% • 964 Patients)</div>
  <div className="bg-emerald-600 p-4 rounded-b-lg cursor-pointer hover:opacity-90">Low Risk Tier (Bottom 75% • 3,616 Patients)</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Multi-Morbidity Risk Index Calculation',
        clinicalOrBusinessLogic: 'Synthesizes active chronic diagnosis count, age > 65, polypharmacy (> 5 concurrent rx), and hospital admissions within the past 12 months into a composite risk score.',
        formula: 'Risk Score = (Active Chronic ICD-10 Count × 2) + (Age > 65 × 1.5) + (Inpatient Admit in 12m × 4) + (Polypharmacy > 5 Rx × 1)',
        dataSources: ['EHR Problem List', 'Inpatient ADT Feeds', 'Active Medication Roster']
      }
    ],
    workflows: [
      {
        actionName: 'Enrollment of Rising Risk Patients into Intensive Care Management',
        userRoles: ['Care Coordinator'],
        steps: [
          'Click the yellow "Rising Risk Tier (Next 20%)" segment on the Chronic Risk pyramid.',
          'Filter for patients with newly diagnosed Type 2 Diabetes or Stage 3 CKD within the past 6 months.',
          'Select 25 patients and click "Bulk Assign to Chronic Care Management (CCM)".',
          'Schedule structured 20-minute monthly nurse check-in calls to provide dietary counseling and medication titration.'
        ],
        downstreamImpact: 'Halts clinical disease progression from Rising Risk into high-cost High Risk status, while capturing billable CPT 99490 ($60/mo) Chronic Care Management revenue.'
      }
    ],
    relatedArticleIds: ['utilization-gaps', 'outcomes-patient-groups']
  },
  {
    id: 'claims',
    title: 'Claims Utilization & PMPM Expenditure Analysis',
    routePath: '/claims',
    dashboardGroup: 'Analytics',
    targetAudience: ['Billing Analyst', 'Practice Manager', 'Financial Analyst'],
    overview: 'Deep dive medical claims parser analyzing historical adjudicated 837P/837I files. Breaks down spend by service category (`Inpatient`, `Outpatient`, `Primary Care`, `Rx`), tracking true Per Member Per Month (PMPM) costs.',
    features: [
      {
        featureName: 'Service Category Spend Distribution Table',
        description: 'Detailed financial table showing total dollar volume, percentage of total medical spend, and PMPM cost breakdown for Facility Hospital vs Professional Physician claims.',
        uiLocation: 'Center Spend Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-left text-xs border font-mono">
  <tr className="bg-muted font-sans font-bold"><th className="p-2">Service Category</th><th className="p-2">Total Paid Spend</th><th className="p-2">PMPM Cost</th></tr>
  <tr><td className="p-2 font-bold">Inpatient Hospital Facility</td><td className="p-2">$642,100</td><td className="p-2 text-rose-600">$111.05 / mo</td></tr>
  <tr><td className="p-2 font-bold">Primary Care Professional</td><td className="p-2">$142,000</td><td className="p-2 text-emerald-600">$24.56 / mo</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Per Member Per Month (PMPM) Formula',
        clinicalOrBusinessLogic: 'The gold standard actuarial metric for normalizing healthcare costs across changing membership panel sizes over time.',
        formula: 'PMPM = Total Paid Medical & Pharmacy Claims in Measurement Window / Total Attributed Member Months in Window',
        dataSources: ['Adjudicated 835 Electronic Remittance Advice (ERA) Files', '834 Eligibility Rosters']
      }
    ],
    workflows: [
      {
        actionName: 'Investigating Outpatient Specialist Cost Outliers',
        userRoles: ['Practice Manager', 'Financial Analyst'],
        steps: [
          'Inspect the Claims Utilization table and observe if `Outpatient Specialist Diagnostic Imaging` PMPM has jumped by > 15% quarter-over-quarter.',
          'Drill down into the Diagnostic Imaging category to view specific high-cost CPT codes (`MRI`, `CT Scan`).',
          'Identify top ordering providers and high-cost hospital outpatient imaging facilities ($2,500/scan vs $450/scan at freestanding imaging centers).',
          'Establish a preferred network referral guide directing elective imaging to accredited freestanding imaging centers.'
        ],
        downstreamImpact: 'Reduces diagnostic imaging spend by up to 60% without compromising clinical diagnostic quality.'
      }
    ],
    relatedArticleIds: ['billing-reports', 'cost-savings']
  },
  {
    id: 'billing',
    title: 'Claims Billing Report & A/R Aging',
    routePath: '/billing',
    dashboardGroup: 'Analytics',
    targetAudience: ['Billing Analyst', 'Practice Manager'],
    overview: 'Revenue cycle management (RCM) dashboard tracking clean claim submission rates, first-pass denial reason codes, aging Accounts Receivable (`0-30d`, `31-60d`, `61-90d`, `>90d`), and payer reimbursement velocity.',
    features: [
      {
        featureName: 'Accounts Receivable Aging Buckets Bar Chart',
        description: 'Stacked horizontal progress bar showing the exact dollar amount and percentage distribution of outstanding medical claims sitting across 30-day aging buckets.',
        uiLocation: 'Top A/R Summary Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-2 text-xs font-mono">
  <div className="flex justify-between font-sans font-bold"><span>Total Outstanding A/R: $342,100</span><span className="text-rose-600">> 90 Days: $42,500 (12.4%)</span></div>
  <div className="w-full bg-muted h-3 rounded-full overflow-hidden flex">
    <div className="bg-emerald-500 h-full w-[60%]" title="0-30 Days ($205,260)" />
    <div className="bg-amber-500 h-full w-[20%]" title="31-60 Days ($68,420)" />
    <div className="bg-orange-500 h-full w-[8%]" title="61-90 Days ($25,920)" />
    <div className="bg-rose-600 h-full w-[12%]" title=">90 Days ($42,500)" />
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'First-Pass Clean Claim Submission Rate',
        clinicalOrBusinessLogic: 'Measures billing accuracy by tracking the percentage of submitted claims accepted and adjudicated for payment on the initial electronic transmission without requiring rework or appeal.',
        formula: 'Clean Claim Rate % = (Claims Paid on Initial Submission / Total Electronic 837 Claims Submitted) × 100',
        dataSources: ['Electronic 277 Claim Acknowledgments', '835 Electronic Remittance Advice (ERA)']
      }
    ],
    workflows: [
      {
        actionName: 'Remediating Top First-Pass Denial Reason Codes',
        userRoles: ['Billing Analyst'],
        steps: [
          'Filter the Claims Billing Report by `Status: Denied / Rejected`.',
          'Group denials by CARC (Claim Adjustment Reason Code) to identify the #1 issue (`CO-16: Claim/service lacks information or has submission error - Missing Prior Auth`).',
          'Open the list of 24 claims denied for missing prior authorization (`CARC CO-16`).',
          'Batch generate standardized medical necessity appeal letters and attach corresponding clinical progress notes directly from the EHR.'
        ],
        downstreamImpact: 'Recovers aging denied accounts receivable dollars and provides feedback loop to clinical front desk to check prior authorizations before scheduling procedures.'
      }
    ],
    relatedArticleIds: ['claims-utilization', 'engagement-encounters']
  },
  {
    id: 'coordinated-care',
    title: 'Coordinated Care & Closed-Loop Referrals',
    routePath: '/coordinated-care',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Physician'],
    overview: 'Tracks specialist referrals, hospital discharge ADT alerts, and transitions of care. Ensures closed-loop verification by monitoring whether consultation notes from specialists are received back into the primary care chart.',
    features: [
      {
        featureName: 'Closed-Loop Referral Tracking Pipeline',
        description: 'Kanban board or status pipeline organizing outbound specialist referrals across `Referral Sent` → `Appointment Scheduled` → `Specialist Consult Complete` → `Consult Note Reconciled`.',
        uiLocation: 'Main Center Pipeline Board',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-3 gap-2 text-xs">
  <div className="p-3 bg-muted rounded border"><span className="font-bold block">1. Referral Sent (42)</span><p className="text-muted-foreground text-[10px]">Awaiting patient booking</p></div>
  <div className="p-3 bg-amber-500/10 rounded border border-amber-500/30"><span className="font-bold block text-amber-700">2. Consult Complete (18)</span><p className="text-muted-foreground text-[10px]">Awaiting consult note receipt</p></div>
  <div className="p-3 bg-emerald-500/10 rounded border border-emerald-500/30"><span className="font-bold block text-emerald-700">3. Closed Loop (142)</span><p className="text-muted-foreground text-[10px]">Reconciled in EHR chart</p></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Closed-Loop Referral Reconciliation Rate',
        clinicalOrBusinessLogic: 'Evaluates care coordination quality by calculating what percentage of outbound specialist referrals have a signed specialist consultation report filed back into the PCP electronic health record within 30 days.',
        formula: 'Closed Loop Rate % = (Referrals with Reconciled Consult Note within 30d / Total Outbound Referrals Sent) × 100',
        dataSources: ['EHR Referral Orders Table', 'Inbound Direct Secure Email / Fax OCR Ingestion']
      }
    ],
    workflows: [
      {
        actionName: 'Chasing Overdue Specialist Consultation Reports',
        userRoles: ['Care Coordinator'],
        steps: [
          'Filter the Coordinated Care pipeline by `Stage: Consult Complete` and `Days Since Visit: > 14 Days`.',
          'Select the 18 specialist visits where the patient completed the appointment but the specialist has not transmitted their consult note.',
          'Click "Send Automated Fax/Direct Request" to dispatch a pre-populated medical records request to the specialist clinic\'s medical records department.',
          'Upon receipt of the inbound fax/Direct message, reconcile the document into the patient\'s active chart and mark the referral as `Closed Loop`.'
        ],
        downstreamImpact: 'Guarantees primary care physicians have full visibility into specialist medication changes or surgical plans, preventing adverse drug interactions.'
      }
    ],
    relatedArticleIds: ['engagement-after-hours-encounters', 'engagement-care-episodes']
  },
  {
    id: 'communication-campaigns',
    title: 'Communication Campaigns & Broadcast Messaging',
    routePath: '/communication',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Practice Manager'],
    overview: 'Practice-wide broadcast and targeted messaging tool. Enables creating automated SMS check-in campaigns, preventive screening recall reminders, and clinic closure alerts across specific patient cohorts.',
    features: [
      {
        featureName: 'Campaign Performance & Engagement Metrics Table',
        description: 'Summary scorecard for each active messaging campaign showing Total Recipients, Carrier Delivery Success %, Open/Click Rates, and direct Appointment Conversion rate.',
        uiLocation: 'Main Campaign Dashboard Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-card rounded border text-xs flex justify-between items-center font-mono">
  <div><span className="font-bold font-sans">Campaign: Fall Flu Vaccination Recall (Seniors > 65)</span> <p className="text-muted-foreground text-[11px]">Sent 1,420 SMS • 98.4% Delivered</p></div>
  <Badge className="bg-primary/20 text-primary font-sans">342 Appointments Booked (24.1% Conversion)</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Campaign Conversion Rate Formula',
        clinicalOrBusinessLogic: 'Measures clinical effectiveness of population health messaging by tracking how many campaign recipients complete the targeted clinical action (e.g., booking an appointment or completing a lab draw) within 30 days of message receipt.',
        formula: 'Campaign Conversion % = (Recipients who Completed Targeted Clinical Action within 30d / Total Delivered Campaign Messages) × 100',
        dataSources: ['Twilio SMS Delivery Webhooks', 'EHR Appointment Scheduling Log']
      }
    ],
    workflows: [
      {
        actionName: 'Launching a Targeted Mammography Recall Campaign',
        userRoles: ['Care Coordinator', 'Practice Manager'],
        steps: [
          'Navigate to Communication Campaigns and click "Create New Campaign".',
          'Select Target Cohort: import the `Overdue Mammography Screening` list directly from the Patient Outcomes dashboard.',
          'Select Message Template: "Preventive Screening Reminder with Self-Scheduling Link".',
          'Set Delivery Schedule: send in batches of 100 SMS messages per day between 10:00 AM and 2:00 PM to prevent overwhelming the clinic front desk phone lines.',
          'Activate campaign and monitor daily booking conversion metrics.'
        ],
        downstreamImpact: 'Closes critical HEDIS/eCQM breast cancer screening quality gaps at scale with zero manual phone calls required from clinical staff.'
      }
    ],
    relatedArticleIds: ['outcomes-screenings', 'engagement-patient-touch-ratio']
  },
  {
    id: 'marketing-analytics',
    title: 'Marketing Analytics & Patient Acquisition Funnel',
    routePath: '/marketing',
    dashboardGroup: 'Analytics',
    targetAudience: ['Practice Manager', 'Practice Owner'],
    overview: 'Tracks patient acquisition funnels, lead conversion rates, marketing channel attribution (`Organic Web`, `Employer Referral`, `Physician Referral`, `Community Event`), and Customer Acquisition Cost (CAC).',
    features: [
      {
        featureName: 'Acquisition Funnel Conversion Pipeline',
        description: 'Visual funnel diagram showing drop-off rates across `Website Visitors` → `Inquiry Form Submitted` → `Initial Consult Booked` → `Enrolled Active Patient`.',
        uiLocation: 'Main Left Funnel Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs text-center font-bold text-white">
  <div className="bg-blue-600 p-2 rounded w-full">1. Website Leads / Inquiries (420)</div>
  <div className="bg-indigo-600 p-2 rounded w-4/5 mx-auto">2. Initial Consults Booked (184 • 43% Conv)</div>
  <div className="bg-emerald-600 p-2 rounded w-3/5 mx-auto">3. Enrolled Active DPC Members (142 • 77% Conv)</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Customer Acquisition Cost (CAC)',
        clinicalOrBusinessLogic: 'Calculates the total marketing, advertising, and promotional spend required to acquire a single newly enrolled direct primary care (DPC) member.',
        formula: 'CAC = Total Marketing & Advertising Expenditures in Period / Total New Enrolled Active Patients in Period',
        dataSources: ['General Ledger Marketing Expenses', 'Payer/EHR New Patient Enrollment Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Reallocating Marketing Spend to High-Converting Channels',
        userRoles: ['Practice Manager'],
        steps: [
          'Open Marketing Analytics and review the Channel Attribution comparison table.',
          'Observe that `Employer Group Referrals` have a CAC of $45 with a 92% 12-month retention rate, whereas `Paid Facebook Ads` have a CAC of $310 with a 45% retention rate.',
          'Shift 70% of the digital ad budget into funding employer wellness lunch-and-learn presentations.'
        ],
        downstreamImpact: 'Lowers overall practice acquisition costs, improves member lifetime value (LTV), and accelerates direct primary care panel growth.'
      }
    ],
    relatedArticleIds: ['engagement-total-active-patients', 'home-overview']
  },
  {
    id: 'survey-proms',
    title: 'Patient Surveys & PROMs (PHQ-9, GAD-7, NPS)',
    routePath: '/survey',
    dashboardGroup: 'Analytics',
    targetAudience: ['Care Coordinator', 'Quality Officer', 'Physician'],
    overview: 'Collects, tracks, and scores Patient Reported Outcome Measures (PROMs) including clinical behavioral health assessments (`PHQ-9` depression, `GAD-7` anxiety) and satisfaction metrics (`NPS`, `CSAT`).',
    features: [
      {
        featureName: 'PROM Clinical Severity Alert Table',
        description: 'Live table showing submitted patient surveys with automated severity color-coding (`PHQ-9 >= 15 Moderately Severe/Severe Red Pill`, `Self-Harm Q9 Positive Urgent Flag`).',
        uiLocation: 'Main Survey Results Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Patient</th><th className="p-2">Assessment</th><th className="p-2">Score & Severity</th><th className="p-2">Q9 Alert</th></tr>
  <tr><td className="p-2 font-medium">Eleanor Vance</td><td className="p-2">PHQ-9 Depression</td><td className="p-2"><Badge className="bg-rose-500/20 text-rose-700">Score: 18 (Moderately Severe)</Badge></td><td className="p-2 font-bold text-rose-600 animate-pulse">Q9 POSITIVE (+1)</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'PHQ-9 Clinical Depression Severity Scoring Rule',
        clinicalOrBusinessLogic: 'Sums the 0-3 numerical responses across all 9 standard questions to assign validated clinical depression brackets.',
        formula: 'Total Score = Σ(Q1..Q9). Severity Brackets: 0-4 (None/Minimal), 5-9 (Mild), 10-14 (Moderate), 15-19 (Moderately Severe), 20-27 (Severe).',
        dataSources: ['Inbound Patient Portal Questionnaire Responses']
      }
    ],
    workflows: [
      {
        actionName: 'Immediate Clinical Intervention on PHQ-9 Question 9 Positive Alert',
        userRoles: ['Care Coordinator', 'Physician'],
        steps: [
          'Observe the flashing red `Q9 POSITIVE (+1)` alert inside the Survey & PROMs dashboard.',
          'Verify that the patient answered positive (> 0) to Question 9 ("Thoughts that you would be better off dead or of hurting yourself in some way").',
          'Immediately follow the practice Behavioral Health Crisis Protocol: place an urgent priority telephone call to the patient within 30 minutes.',
          'If patient is reachable, conduct suicidal ideation safety assessment (C-SSRS) and arrange immediate same-day evaluation or crisis response connection.'
        ],
        downstreamImpact: 'Provides immediate life-saving crisis intervention and satisfies clinical behavioral health quality safety mandates.'
      }
    ],
    relatedArticleIds: ['admin-survey-config', 'admin-survey-templates']
  }
];
