import { WikiArticle } from './types';

export const supportArticles: WikiArticle[] = [
  {
    id: 'auth-onboarding',
    title: 'Platform Welcome & Onboarding Wizard',
    routePath: '/onboarding',
    dashboardGroup: 'Support & Auth',
    targetAudience: ['New Users', 'Clinicians', 'Practice Managers'],
    overview: 'The initial welcome gateway and interactive onboarding wizard for newly provisioned practice staff. Guides users through profile setup, MFA enrollment, and role-based workspace personalization.',
    features: [
      {
        featureName: 'Multi-Step Role Personalization Carousel',
        description: 'Guided step-by-step wizard allowing users to select their primary clinical role (`Physician`, `Care Coordinator`, `Coder`), set notification preferences, and connect their calendar.',
        uiLocation: 'Main Onboarding Card Screen',
        snippetType: 'jsx',
        uiSnippet: `<div className="max-w-md mx-auto p-6 bg-card rounded-2xl border shadow-lg text-center space-y-4 text-xs">
  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-black text-lg">1/3</div>
  <h2 className="text-lg font-bold">Welcome to HealthCompiler Insights</h2>
  <p className="text-muted-foreground">Let's tailor your dashboard experience. What is your primary role in the clinic?</p>
  <div className="grid grid-cols-2 gap-2 pt-2">
    <Button variant="outline" className="h-16 flex flex-col items-center justify-center border-primary bg-primary/5 font-bold">Physician / Clinician</Button>
    <Button variant="outline" className="h-16 flex flex-col items-center justify-center">Care Coordinator</Button>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'User State Provisioning Engine',
        clinicalOrBusinessLogic: 'Updates user onboarding flag (`isOnboarded = true`) upon completion and redirects the user directly to their assigned default dashboard based on RBAC profile (`Physicians` -> `/hcc/overview`, `Coordinators` -> `/action-centre`).',
        formula: 'CompleteOnboarding(UserRole) => UpdateUserProfile({ onboarded: true }) + RouteToDefaultWorkspace(UserRole)',
        dataSources: ['Backend User Profile Database']
      }
    ],
    workflows: [
      {
        actionName: 'Completing Initial Account Activation after Email Invite',
        userRoles: ['New Users', 'Clinicians', 'Practice Managers'],
        steps: [
          'Click the secure activation link sent via email from HealthCompiler (`no-reply@healthcompiler.com`).',
          'Create a secure password matching NIST complexity guidelines.',
          'Complete the 3-step Onboarding Wizard by selecting your clinical role and practice location.',
          'Scan the MFA QR code using Google Authenticator or verify via SMS.',
          'Click "Launch Practice Workspace" to enter your live dashboard.'
        ],
        downstreamImpact: 'Establishes a secure, audit-compliant user identity while tailoring the navigation menu to show only clinically relevant tools.'
      }
    ],
    relatedArticleIds: ['auth-login', 'admin-users']
  },
  {
    id: 'auth-login',
    title: 'Secure Authentication & Login Portal',
    routePath: '/login',
    dashboardGroup: 'Support & Auth',
    targetAudience: ['All Users'],
    overview: 'NIST/HIPAA-compliant authentication portal supporting Single Sign-On (SSO via Okta/Azure AD), multi-factor authentication (MFA), and automated session timeout controls.',
    features: [
      {
        featureName: 'SSO & MFA Verification Modal',
        description: 'Clean login card providing enterprise SAML 2.0 / OIDC SSO buttons alongside traditional credentials and instant 6-digit MFA challenge verification.',
        uiLocation: 'Main Screen Center Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="max-w-sm mx-auto p-6 bg-card rounded-2xl border shadow-xl space-y-4 text-xs">
  <div className="text-center"><span className="font-black text-xl text-primary tracking-tight">HealthCompiler</span><p className="text-muted-foreground mt-1">Sign in to your clinical workspace</p></div>
  <div className="space-y-2">
    <Button className="w-full bg-primary font-semibold">Continue with Enterprise SSO</Button>
    <div className="relative text-center my-3"><span className="bg-card px-2 text-[10px] text-muted-foreground relative z-10">OR</span><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div></div>
    <Button variant="outline" className="w-full">Sign in with Email & MFA</Button>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'HIPAA 15-Minute Inactivity Auto-Logout Timer',
        clinicalOrBusinessLogic: 'Tracks mouse, keyboard, and touch interactions. If no user activity occurs within exactly 15 minutes, the system terminates the JWT access token and redirects to `/onboarding` (or `/login`) to protect unattended PHI on clinic workstation screens.',
        formula: 'If (CurrentTime - LastActivityTimestamp) >= 900 Seconds => RevokeJWT() + Redirect("/onboarding")',
        dataSources: ['Browser Document Event Listeners (`mousemove`, `keydown`)']
      }
    ],
    workflows: [
      {
        actionName: 'Logging Out and Protecting Workstation Security',
        userRoles: ['All Users'],
        steps: [
          'Click your user profile avatar in the bottom-left corner of the sidebar navigation.',
          'Select "Log out" from the dropdown menu.',
          'The system immediately destroys session tokens in memory and redirects to `/onboarding`.',
          'Ensure the screen displays the onboarding/login prompt before leaving the workstation.'
        ],
        downstreamImpact: 'Prevents unauthorized chart access and enforces strict federal HIPAA privacy mandates.'
      }
    ],
    relatedArticleIds: ['auth-onboarding', 'admin-users']
  },
  {
    id: 'support-page',
    title: 'Help Center & Intercom Technical Support',
    routePath: '/support',
    dashboardGroup: 'Support & Auth',
    targetAudience: ['All Users'],
    overview: 'The integrated self-service knowledge base and real-time clinical IT support portal. Provides immediate access to searchable knowledge articles, video tutorials, and live chat with HealthCompiler engineers.',
    features: [
      {
        featureName: 'Intercom Live Support & Knowledge Base Launchers',
        description: 'Dedicated support dashboard containing quick-search article links (`How to export QRDA III files`, `Understanding your RAF score`) and a direct link to the external Intercom help portal (`https://intercom.help/health-compiler-inc/en`).',
        uiLocation: 'Main Support Dashboard Cards',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-2 gap-4 text-xs">
  <div className="p-5 bg-card rounded-xl border space-y-2">
    <span className="font-bold text-base block">Visit Intercom Help Center</span>
    <p className="text-muted-foreground">Browse comprehensive how-to guides, release notes, and video tutorials across every dashboard module.</p>
    <Button size="sm" className="mt-2 bg-primary font-bold" onClick={() => window.open('https://intercom.help/health-compiler-inc/en', '_blank')}>Open Knowledge Base ↗</Button>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'External Intercom Support Integration Linkage',
        clinicalOrBusinessLogic: 'All "Get Help" and support portal buttons must link directly to the verified HealthCompiler Intercom documentation base at `https://intercom.help/health-compiler-inc/en` ensuring users always view up-to-date documentation.',
        formula: 'OnClick(SupportButton) => Window.Open("https://intercom.help/health-compiler-inc/en", "_blank")',
        dataSources: ['Intercom Hosted Knowledge Base']
      }
    ],
    workflows: [
      {
        actionName: 'Requesting Emergency Engineering Support During an EMR Feed Outage',
        userRoles: ['Practice Manager', 'Superadmin'],
        steps: [
          'Open the Support portal (`/support`) or click "Get Help" in the sidebar navigation.',
          'Click "Open Knowledge Base ↗" or open the live Intercom chat widget in the bottom right corner.',
          'Type "Emergency ADT Feed Outage" along with your practice TIN and batch ID (`BATCH-8422`).',
          'An on-call HealthCompiler integration engineer is paged instantly to investigate the inbound SFTP queue.'
        ],
        downstreamImpact: 'Provides immediate 24/7 technical triage to restore critical care coordination interfaces within minutes.'
      }
    ],
    relatedArticleIds: ['admin-integration-batches', 'auth-onboarding']
  },
  {
    id: 'utilization-gaps',
    title: 'Utilization Gaps & Action Centre Hub',
    routePath: '/action-centre',
    dashboardGroup: 'Support & Auth',
    targetAudience: ['Care Coordinator', 'Medical Director', 'Nurse'],
    overview: 'The primary care gap remediation workspace (also referred to as Utilization Gaps). Consolidates open HEDIS/Star care gaps, ER follow-up tasks, and HCC recapture alerts into an actionable triage queue.',
    features: [
      {
        featureName: 'Multi-Queue Utilization Gap Task Board',
        description: 'Interactive Kanban/Table workspace sorting open patient tasks by clinical urgency (`High Priority: ED Discharge < 48h`, `Medium: Overdue Mammogram`, `Low: Annual Wellness Check`).',
        uiLocation: 'Main Task Board Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Patient & Age</th><th className="p-2">Utilization Gap Task</th><th className="p-2">Urgency</th><th className="p-2">Assigned To</th></tr>
  <tr><td className="p-2 font-medium">Arthur Pendelton (72M)</td><td className="p-2 font-bold text-rose-600">ED Discharge Follow-up (CHF Exacerbation)</td><td className="p-2"><Badge variant="destructive">Critical (< 24h left)</Badge></td><td className="p-2">Sarah Jenkins, RN</td></tr>
  <tr><td className="p-2 font-medium">Eleanor Vance (68F)</td><td className="p-2 font-bold">Overdue Mammogram & Colorectal Screening</td><td className="p-2"><Badge variant="outline" className="border-amber-500 text-amber-700">Moderate</Badge></td><td className="p-2">Alex Miller, MA</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Utilization Gaps Priority Scoring Engine',
        clinicalOrBusinessLogic: 'Assigns a dynamic priority score to every open care gap by evaluating acute hospitalization proximity, revenue impact, and regulatory reporting deadlines.',
        formula: 'GapScore = (ReadmissionRiskMultiplier × 40) + (HCC_Weight_Value × 30) + (DaysOverdue / 10)',
        dataSources: ['EHR Problem List', 'HL7 ADT Discharge Feed', 'Preventive Screenings Roster']
      }
    ],
    workflows: [
      {
        actionName: 'Closing an Emergency Department Discharge Utilization Gap',
        userRoles: ['Care Coordinator', 'Nurse'],
        steps: [
          'Open Utilization Gaps (`/action-centre`) and sort by `Urgency: Critical / High`.',
          'Click Arthur Pendelton\'s task (`ED Discharge Follow-up`).',
          'Review the hospital ED encounter summary showing he was treated for fluid overload.',
          'Call Arthur to verify weight monitoring and confirm he has resumed his daily Lasix diuretic.',
          'Book a priority primary care follow-up visit with Dr. Robert Chen for tomorrow at 10:00 AM.',
          'Mark the Utilization Gap task as `Resolved / TCM Completed`.'
        ],
        downstreamImpact: 'Directly bridges the gap between acute emergency events and outpatient primary care, safeguarding patient stability and capturing quality metrics.'
      }
    ],
    relatedArticleIds: ['aco-journey', 'outcomes-screenings', 'hcc-pre-visit-plan']
  },
  {
    id: 'chronic-risk',
    title: 'Chronic Condition Management & Risk Categorization',
    routePath: '/chronic-risk',
    dashboardGroup: 'Support & Auth',
    targetAudience: ['Care Coordinator', 'Physician', 'Medical Director'],
    overview: 'Specialized longitudinal chronic disease surveillance dashboard. Segments patients by chronic disease burden (`Diabetes`, `CHF`, `COPD`, `CKD`) and stratifies them into Rising Risk and High Risk cohorts.',
    features: [
      {
        featureName: 'Disease Burden & Severity Matrix Table',
        description: 'Multi-condition tracking matrix displaying patient name, active chronic disease diagnoses, current severity stage (`CKD Stage 3b`, `Diabetic HbA1c 9.4%`), and active care management enrollment status.',
        uiLocation: 'Main Chronic Matrix Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Patient</th><th className="p-2">Primary Chronic Conditions</th><th className="p-2">Clinical Severity Index</th><th className="p-2">Care Management Status</th></tr>
  <tr><td className="p-2 font-medium">Eleanor Vance (68F)</td><td className="p-2 font-mono">Diabetes Type 2 • Hypertension</td><td className="p-2 font-bold text-rose-600">High Risk (HbA1c > 9%)</td><td className="p-2"><Badge className="bg-primary text-primary-foreground">Enrolled in CCM (Monthly Checks)</Badge></td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Johns Hopkins ACG / Clinical Risk Stratification Engine',
        clinicalOrBusinessLogic: 'Evaluates diagnostic comorbidities, pharmacy dispensing volume, and historical acute hospitalizations to categorize every patient into 4 distinct clinical risk tiers (`Low Risk`, `Rising Risk`, `High Risk`, `Catastrophic`).',
        formula: 'RiskTier = Classify(ComorbidityCount, ER_Visits_Past_Year, TotalActivePrescriptions, BiomarkerExcursionIndex)',
        dataSources: ['EHR Master Encounter & Diagnosis History']
      }
    ],
    workflows: [
      {
        actionName: 'Enrolling Rising Risk Patients into Chronic Care Management (CCM)',
        userRoles: ['Care Coordinator', 'Nurse'],
        steps: [
          'Filter Chronic Condition Management (`/chronic-risk`) by `Risk Tier: Rising Risk` and `CCM Status: Not Enrolled`.',
          'Identify patients with 2+ chronic conditions whose HbA1c or BP shows an upward trend over the last 6 months.',
          'Contact the patient to explain the benefits of dedicated monthly phone/video check-ins under Medicare Chronic Care Management (`CPT 99490`).',
          'Obtain verbal or written consent and enroll the patient in the CCM monitoring roster.',
          'Schedule the initial 20-minute monthly clinical check-in call with Sarah Jenkins, RN.'
        ],
        downstreamImpact: 'Halts disease progression before emergency hospitalization is required, while generating $65+ per patient per month in recurring CPT 99490 care coordination billing.'
      }
    ],
    relatedArticleIds: ['outcomes-lab-trends', 'hcc-overview', 'utilization-gaps']
  },
  {
    id: 'cost-savings',
    title: 'Financial ROI & Cost Savings Analytics',
    routePath: '/cost-savings',
    dashboardGroup: 'Support & Auth',
    targetAudience: ['Practice Manager', 'Medical Director', 'ACO Executive'],
    overview: 'Financial performance and ROI tracking command center. Quantifies exact dollar savings achieved through ED diversion, hospital readmission reduction, generic drug conversions, and HCC recapture enhancement.',
    features: [
      {
        featureName: 'Cumulative Cost Savings & Revenue Impact Scorecard',
        description: 'Financial dashboard cards breaking down practice revenue gains across Shared Savings bonuses, Chronic Care Management billing, and avoided avoidable hospitalizations.',
        uiLocation: 'Top Financial Summary Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-3 gap-3 text-xs">
  <div className="p-4 bg-card rounded-xl border space-y-1">
    <span className="text-muted-foreground text-sm font-medium">Avoided ED & Readmission Spend</span>
    <div className="text-2xl font-black text-emerald-600">$428,500 <span className="text-xs font-normal text-muted-foreground block">34 avoided admissions this year</span></div>
  </div>
  <div className="p-4 bg-card rounded-xl border space-y-1">
    <span className="text-muted-foreground text-sm font-medium">HCC Recapture Revenue Lift</span>
    <div className="text-2xl font-black text-primary">$312,000 <span className="text-xs font-normal text-muted-foreground block">From 412 recaptured V28 codes</span></div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Avoided Hospitalization & Emergency Diversion Valuation Engine',
        clinicalOrBusinessLogic: 'Calculates net actuarial cost avoidance by multiplying the number of successfully diverted ED visits and avoided 30-day readmissions by national CMS benchmark episode costs (`Average CHF Readmission Cost: $14,200`).',
        formula: 'Total Avoided Spend = (Diverted_ED_Count × $1,250 Avg ED Cost) + (Avoided_Readmissions × $14,200 Avg Inpatient Cost)',
        dataSources: ['Historical CCLF Claims Benchmarks', 'TCM Completed Encounter Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Presenting Annual Value-Based Care Financial ROI to Practice Board',
        userRoles: ['Practice Manager', 'ACO Executive'],
        steps: [
          'Open Cost Savings Analytics (`/cost-savings`) prior to the quarterly executive board meeting.',
          'Set the reporting horizon to `Current Calendar Year-to-Date`.',
          'Review the cumulative savings scorecard showing `$428,500` in avoided acute hospital spend and `$312,000` in prospective HCC risk recapture value.',
          'Click "Export Executive Financial ROI Package PDF".',
          'Distribute the summary report to practice partners to validate the financial return of dedicated care coordination staffing.'
        ],
        downstreamImpact: 'Proves the undeniable ROI of proactive population health tools, securing budget approvals for care team expansion and clinical quality software.'
      }
    ],
    relatedArticleIds: ['aco-overview', 'hcc-overview', 'utilization-gaps']
  }
];
