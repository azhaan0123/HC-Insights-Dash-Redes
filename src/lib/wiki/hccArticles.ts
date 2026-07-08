import { WikiArticle } from './types';

export const hccArticles: WikiArticle[] = [
  {
    id: 'hcc-overview',
    title: 'HCC Risk Adjustment Overview & RAF Gauge',
    routePath: '/hcc/overview',
    dashboardGroup: 'HCC Insights',
    targetAudience: ['Medical Director', 'Practice Manager', 'Medical Coder', 'Superadmin'],
    overview: 'The executive command dashboard for CMS Hierarchical Condition Category (HCC) risk adjustment. Displays practice average Risk Adjustment Factor (RAF) scores, prospective risk recapture rates, and total potential revenue impact.',
    features: [
      {
        featureName: 'Practice Average RAF Score Gauge',
        description: 'Circular meter displaying current practice-wide average RAF score compared against baseline historical performance and payer targets.',
        uiLocation: 'Top Left Executive Card',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 120 70" className="w-40 h-24">
  <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
  <path d="M 10 60 A 50 50 0 0 1 85 20" fill="none" stroke="currentColor" strokeWidth="12" className="text-primary" />
  <text x="60" y="52" textAnchor="middle" className="text-xl font-black fill-foreground">1.34</text>
  <text x="60" y="65" textAnchor="middle" className="text-[10px] fill-muted-foreground">Practice Avg RAF</text>
</svg>`
      },
      {
        featureName: 'Recaptured vs. Dropped Chronic Conditions Chart',
        description: 'Comparison bar chart highlighting how many chronic HCC conditions from the prior calendar year have been successfully recaptured this year vs. dropped/unassessed.',
        uiLocation: 'Center Right Chart Panel',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-2 text-xs">
  <div className="flex justify-between"><span>Recaptured HCCs (2,140)</span><span className="font-bold text-emerald-600">78%</span></div>
  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[78%]" /></div>
  <div className="flex justify-between"><span>Dropped / Unassessed HCCs (604)</span><span className="font-bold text-rose-600">22%</span></div>
  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[22%]" /></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'CMS-HCC Model V28 RAF Score Calculation',
        clinicalOrBusinessLogic: 'Calculates expected healthcare expenditure risk by combining baseline demographic risk factors with disease weights and clinical interaction multipliers.',
        formula: 'Total RAF = Base Demographic Score (Age/Gender/Medicaid/Disability) + Σ(HCC Disease Category Weights) + Σ(Disease Interaction Multipliers)',
        dataSources: ['CMS V28 Risk Adjustment Model Weights Table', 'Adjudicated Medicare/MA Billing Claims']
      },
      {
        metricName: 'Prospective Revenue Gap Impact',
        clinicalOrBusinessLogic: 'Estimates the financial risk of failing to recapture previously documented chronic HCC conditions before the December 31st annual CMS reporting cutoff.',
        formula: 'Revenue Impact = Σ(Dropped HCC Weight × Base Capitation Rate / RAF Unit Value per Patient)',
        dataSources: ['Historical Prior Year Claims DB', 'Current Year Encounter Diagnoses']
      }
    ],
    workflows: [
      {
        actionName: 'Conducting Mid-Year Prospective RAF Recapture Audit',
        userRoles: ['Medical Director', 'Practice Manager', 'Medical Coder'],
        steps: [
          'Open the HCC Overview dashboard and check the percentage of Dropped / Unassessed HCC conditions.',
          'Click the "Dropped / Unassessed HCCs" segment to drill into the specific patient list.',
          'Filter for patients with high-weight dropped conditions (`HCC 19 Diabetes with Complications`, `HCC 85 Congestive Heart Failure`).',
          'Sort by patients who have an upcoming primary care appointment scheduled within the next 30 days.',
          'Export this roster directly to the Pre-Visit Plan huddle sheets so clinicians assess and document these conditions during their upcoming encounters.'
        ],
        downstreamImpact: 'Recaptures valid chronic disease risk scores, ensures fair capitation reimbursement for high-complexity panels, and prevents sudden financial clawbacks.'
      }
    ],
    relatedArticleIds: ['hcc-patient-list', 'hcc-pre-visit-plan', 'hcc-coding-queue']
  },
  {
    id: 'hcc-patient-list',
    title: 'Patient RAF Scorecard & Suspect Indicators',
    routePath: '/hcc/patient-list',
    dashboardGroup: 'HCC Insights',
    targetAudience: ['Medical Coder', 'Care Coordinator', 'Physician'],
    overview: 'Granular patient-by-patient risk adjustment roster. Displays current vs. prospective RAF scores, open suspect condition indicators, and direct chart links for clinical documentation verification.',
    features: [
      {
        featureName: 'Suspect Condition Identification Badges',
        description: 'Interactive condition badges (`Suspect: Diabetes E11.9`, `Suspect: COPD J44.9`) indicating chronic conditions suspected from pharmacy orders or historical claims that lack current-year ICD-10 documentation.',
        uiLocation: 'Main Patient Table > Suspects Column',
        snippetType: 'jsx',
        uiSnippet: `<div className="flex flex-wrap gap-1">
  <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-500/10 text-[10px]">Suspect: Rx Insulin without E11 code</Badge>
  <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-500/10 text-[10px]">Suspect: Prior Year COPD not coded</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Clinical Suspect Mining Engine',
        clinicalOrBusinessLogic: 'Mines pharmacy dispensing logs, diagnostic lab observations, and prior year historical claims to flag undocumented chronic diseases requiring physician evaluation.',
        formula: 'SuspectTrigger = (Active Pharmacy Order in [Insulin, Metformin] AND Count(ICD-10 E11.* in Current Calendar Year) == 0)',
        dataSources: ['EHR Medication Orders', 'Historical Claims DB', 'EHR Problem List']
      }
    ],
    workflows: [
      {
        actionName: 'Validating & Scheduling Suspect Condition Workups',
        userRoles: ['Care Coordinator', 'Medical Coder'],
        steps: [
          'Filter the HCC Patient List by `Status: Has Open Suspect Conditions` and `Attending Provider: Dr. Robert Chen`.',
          'Inspect the patient record for Eleanor Vance showing a suspect badge for `Diabetes E11.9 (Rx Metformin without diagnosis)`.',
          'Click the patient row to open the historical audit drawer and verify she has been taking Metformin continuously since 2023.',
          'Verify whether she has had an annual comprehensive metabolic workup this calendar year.',
          'If no appointment has occurred, click "Add to Scheduling Queue" to book a comprehensive chronic disease follow-up with Dr. Chen.'
        ],
        downstreamImpact: 'Ensures clinical accuracy of the medical record, identifies silent progression of chronic disease, and validates HCC coding.'
      }
    ],
    relatedArticleIds: ['hcc-overview', 'hcc-pre-visit-plan']
  },
  {
    id: 'hcc-pre-visit-plan',
    title: 'Pre-Visit Plan & MEAT Documentation Sheets',
    routePath: '/hcc/pre-visit-plan',
    dashboardGroup: 'HCC Insights',
    targetAudience: ['Physician', 'Medical Assistant', 'Nurse'],
    overview: 'Automated clinical huddle prep tool generating pre-encounter checklists for every patient scheduled to visit the clinic today. Highlights open HCC care gaps and enforces MEAT documentation standards.',
    features: [
      {
        featureName: 'MEAT Documentation Prompt Worksheet',
        description: 'Structured physician checklist displayed alongside the day\'s appointment schedule showing each open HCC condition due for assessment along with MEAT guidance prompts.',
        uiLocation: 'Main Huddle Sheet Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card border-2 border-primary/40 rounded-xl space-y-3">
  <div className="flex justify-between items-center border-b pb-2">
    <div><span className="font-bold text-base">Eleanor Vance</span> <span className="text-xs text-muted-foreground ml-2">10:00 AM Office Visit</span></div>
    <Badge className="bg-primary text-primary-foreground">2 Open HCC Gaps</Badge>
  </div>
  <div className="space-y-2 text-xs">
    <div className="p-2.5 bg-muted rounded border">
      <span className="font-bold text-rose-600 block">HCC 19: Diabetes with Chronic Complications (E11.22)</span>
      <p className="text-muted-foreground mt-1"><strong>MEAT Checklist:</strong> Monitor HbA1c lab trends → Evaluate nephropathy status → Assess diabetic CKD stability → Document renal protective ACE inhibitor plan.</p>
    </div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'MEAT Documentation Compliance Engine',
        clinicalOrBusinessLogic: 'Validates whether a clinician\'s signed progress note contains the 4 essential legal elements required by CMS and commercial payers to substantiate an HCC code assignment.',
        formula: 'Valid HCC Note = Must Contain [Monitor (Labs/Vitals) OR Evaluate (History/Symptoms)] AND [Assess (Stable/Worsening)] AND [Treat (Rx/Plan/Referral)]',
        dataSources: ['EHR Clinical Progress Note Text', 'NLP Chart Parsing Engine']
      }
    ],
    workflows: [
      {
        actionName: 'Conducting Morning Clinical Huddle with Pre-Visit Sheets',
        userRoles: ['Physician', 'Medical Assistant'],
        steps: [
          'At 8:00 AM, the Medical Assistant opens the Pre-Visit Plan dashboard and filters by the clinician\'s daily schedule (`Provider: Dr. Robert Chen • Date: Today`).',
          'Print or export the 14 Pre-Visit Huddle Sheets to the clinician\'s tablet.',
          'During the 8:15 AM huddle, review every patient on the schedule who has open chronic HCC gaps.',
          'Ensure the Medical Assistant orders required point-of-care lab draws (e.g., HbA1c or urine microalbumin) before the physician enters the examination room.',
          'During the examination, the physician uses the MEAT checklist prompts to explicitly document chronic disease status inside the assessment and plan.'
        ],
        downstreamImpact: 'Transform passive encounters into proactive population health interventions, guaranteeing 100% audit-proof clinical chart documentation.'
      }
    ],
    relatedArticleIds: ['hcc-patient-list', 'hcc-coding-queue']
  },
  {
    id: 'hcc-coding-queue',
    title: 'Coding Queue & Chart Verification Workflow',
    routePath: '/hcc/coding-queue',
    dashboardGroup: 'HCC Insights',
    targetAudience: ['Medical Coder', 'Coding Supervisor'],
    overview: 'Dedicated medical coder chart review station. Enables coders to inspect physician clinical notes side-by-side with NLP-suggested ICD-10/HCC codes and either Accept, Reject, or Query the physician.',
    features: [
      {
        featureName: 'Side-by-Side Chart vs. Suggested Code Inspector',
        description: 'Split-screen interface displaying the raw signed physician progress note on the left and automated NLP-detected HCC diagnoses on the right with single-click Accept/Reject buttons.',
        uiLocation: 'Main Split-Screen Workspace',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-2 gap-4 text-xs h-40">
  <div className="p-3 bg-muted rounded border overflow-y-auto font-mono">
    <strong>PCP Assessment Note (Dr. Chen):</strong> "Patient seen for routine checkup. Diabetes stable on Metformin 1000mg BID. Last HbA1c 7.1%. Continue current regimen."
  </div>
  <div className="p-3 bg-card rounded border space-y-2">
    <div className="flex justify-between items-center p-2 bg-primary/5 rounded border border-primary/20">
      <div><span className="font-bold">E11.9 Diabetes without complications</span> <Badge className="ml-1 bg-emerald-500 text-white">HCC 19</Badge></div>
      <div className="flex gap-1"><Button size="sm" className="h-6 px-2 bg-emerald-600">Accept</Button><Button size="sm" variant="outline" className="h-6 px-2">Reject</Button></div>
    </div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'ICD-10 to CMS-HCC V28 Crosswalk Validation',
        clinicalOrBusinessLogic: 'Verifies whether an assigned diagnosis code maps to a valid Risk Adjustment factor category for the active model year, checking against annual CMS specificity updates.',
        formula: 'IsBillableHCC = Lookup(ICD10_Code in CMS_V28_Crosswalk_Table where ModelYear == CurrentCalendarYear)',
        dataSources: ['CMS HCC V28 Crosswalk Master DB', 'EHR Encounter Diagnosis List']
      }
    ],
    workflows: [
      {
        actionName: 'Auditing and Submitting Coded Encounters to Payer Files',
        userRoles: ['Medical Coder'],
        steps: [
          'Open the Coding Queue and filter for `Queue: Pending Coder Review` sorted by Encounter Date ascending.',
          'Review the physician\'s signed clinical progress note on the left panel.',
          'Check the NLP-suggested codes on the right panel. Verify that each suggested code meets full MEAT documentation criteria within the text note.',
          'Click "Accept" for substantiated codes. If a physician documented a condition without sufficient MEAT detail, click "Query Provider" to send an electronic clarification alert.',
          'Once all valid codes are accepted, click "Finalize Encounter Coding" to release the claim to the billing clearinghouse.'
        ],
        downstreamImpact: 'Prevents submission of unsupported diagnostic codes, ensuring clean claims and complete audit readiness prior to payer billing.'
      }
    ],
    relatedArticleIds: ['hcc-overview', 'hcc-bulk-audit']
  },
  {
    id: 'hcc-bulk-audit',
    title: 'Retrospective Bulk Audit & RADV Preparation',
    routePath: '/hcc/bulk-audit',
    dashboardGroup: 'HCC Insights',
    targetAudience: ['Coding Supervisor', 'Compliance Officer', 'Superadmin'],
    overview: 'Retrospective batch compliance checking tool and RADV (Risk Adjustment Data Validation) mock audit generator. Enables compliance officers to verify chart proof for thousands of billed HCC codes simultaneously.',
    features: [
      {
        featureName: 'RADV Audit Readiness Scorecard',
        description: 'Aggregate risk meter verifying what percentage of all billed HCC codes across the practice have an attached, signed, date-stamped clinical chart proving valid MEAT documentation.',
        uiLocation: 'Top Compliance Score Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border flex justify-between items-center text-xs">
  <div><span className="font-bold text-sm block">RADV Audit Readiness Verification Rate</span><span className="text-muted-foreground">Target: 100% Substantiated Charts</span></div>
  <div className="text-2xl font-black text-emerald-600">98.2% <span className="text-xs font-normal block text-muted-foreground">38 codes flagged for chart review</span></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'RADV Chart Proof Verification Formula',
        clinicalOrBusinessLogic: 'Performs continuous compliance checking by verifying that every diagnostic code submitted on an 837P claim file links to a verified encounter note inside the local database.',
        formula: 'Substantiated Rate % = (Billed HCC Codes with Linked Signed MEAT Chart Note / Total Billed HCC Codes in Calendar Year) × 100',
        dataSources: ['837P Submitted Claim Files', 'EHR Chart Audit Log']
      }
    ],
    workflows: [
      {
        actionName: 'Preparing Chart Packets for CMS RADV Audit Submission',
        userRoles: ['Compliance Officer', 'Coding Supervisor'],
        steps: [
          'Open the Bulk Audit dashboard and click "Launch RADV Audit Preparation Wizard".',
          'Upload or paste the list of patient Medicare Beneficiary Identifiers (MBIs) requested by CMS or the health plan.',
          'The system automatically queries historical records and retrieves all signed clinical encounter notes supporting the audited HCC codes.',
          'Inspect any flagged charts where MEAT documentation is disputed or incomplete.',
          'Click "Generate RADV Evidence Packet PDF" to compile a structured, indexed PDF containing all chart proofs formatted to exact CMS audit submission specifications.'
        ],
        downstreamImpact: 'Protects the practice from multi-million dollar CMS financial clawbacks and penalties during federal retrospective risk adjustment audits.'
      }
    ],
    relatedArticleIds: ['hcc-coding-queue', 'hcc-overview']
  }
];
