import { WikiArticle } from './types';

export const acoArticles: WikiArticle[] = [
  {
    id: 'aco-overview',
    title: 'ACO Shared Savings & TCOC Overview',
    routePath: '/aco/overview',
    dashboardGroup: 'ACO Insights',
    targetAudience: ['ACO Executive', 'Medical Director', 'Practice Manager'],
    overview: 'The central dashboard for Medicare Shared Savings Program (MSSP) and commercial value-based care contracts. Tracks actual Total Cost of Care (TCOC) against CMS historical expenditure benchmarks to forecast annual shared savings bonuses.',
    features: [
      {
        featureName: 'Shared Savings Benchmark Comparison Gauge',
        description: 'Visual meter displaying actual annualized PMPM expenditure versus the CMS risk-adjusted benchmark target (`Benchmark: $842/mo vs Actual: $784/mo`).',
        uiLocation: 'Top Left Executive Summary Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border flex justify-between items-center text-xs">
  <div><span className="font-bold text-sm block">MSSP Annual Shared Savings Forecast</span><span className="text-muted-foreground">CMS Benchmark: $14,250,000 Total Spend Target</span></div>
  <div className="text-right"><div className="text-2xl font-black text-emerald-600">$1,142,000</div><span className="text-[11px] text-emerald-500 font-medium">8.0% Below Benchmark Target</span></div>
</div>`
      },
      {
        featureName: 'Total Cost of Care (TCOC) Category Breakdown',
        description: 'Treemap and stacked bar chart segmenting total ACO expenditures across Inpatient Hospitalization, Outpatient Surgery, Primary Care, Skilled Nursing Facility (SNF), and Part D Pharmacy.',
        uiLocation: 'Center Spend Distribution Chart',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs">
  <div className="flex justify-between font-semibold"><span>Inpatient Hospital Utilization ($5.4M)</span><span>45% of TCOC</span></div>
  <div className="w-full bg-muted h-2 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[45%]" /></div>
  <div className="flex justify-between font-semibold"><span>Post-Acute SNF Care ($2.1M)</span><span>18% of TCOC</span></div>
  <div className="w-full bg-muted h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[18%]" /></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'MSSP Shared Savings Bonus Calculation',
        clinicalOrBusinessLogic: 'Calculates practice revenue sharing under Medicare Shared Savings Program rules. Requires actual expenditures to undercut the historical risk-adjusted benchmark by greater than the Minimum Savings Rate (MSR threshold).',
        formula: 'If (Benchmark - Actual Spend) > MSR => Shared Savings Bonus = (Benchmark - Actual Spend) × ACO Quality Score % × Sharing Rate % (e.g., 50% or 75%)',
        dataSources: ['CMS Claim and Claim Line Feed (CCLF)', 'ACO Annual Quality Submission Score']
      }
    ],
    workflows: [
      {
        actionName: 'Analyzing Quarterly CCLF Claims Data for Cost Outliers',
        userRoles: ['ACO Executive', 'Medical Director'],
        steps: [
          'Open the ACO Overview dashboard following ingestion of the monthly CMS Claim and Claim Line Feed (CCLF).',
          'Inspect the TCOC Category Breakdown to identify expenditure categories exceeding historical benchmarks.',
          'If Skilled Nursing Facility (SNF) spend is up by > 12%, click the category to inspect attributed patient admissions.',
          'Review average SNF Length of Stay (LOS) per patient (`Practice Avg: 24 days vs Benchmark: 16 days`).',
          'Implement a mandatory weekly SNF care manager rounds protocol to safely transition stable post-acute patients back home with home health assistance.'
        ],
        downstreamImpact: 'Reduces post-acute care expenditure by hundreds of thousands of dollars annually, directly boosting the practice\'s shared savings bonus pool.'
      }
    ],
    relatedArticleIds: ['aco-utilization', 'aco-provider-performance', 'cost-savings']
  },
  {
    id: 'aco-journey',
    title: 'Patient-Centered Care Transition Journey Mapping',
    routePath: '/aco/journey',
    dashboardGroup: 'ACO Insights',
    targetAudience: ['Care Coordinator', 'Medical Director'],
    overview: 'Longitudinal visual timeline mapping patient transitions across various healthcare delivery settings (`Primary Care` → `Emergency Department` → `Inpatient Hospital` → `Skilled Nursing` → `Home Health`). Highlights 30-day readmission risk windows.',
    features: [
      {
        featureName: 'Multi-Setting Longitudinal Care Timeline',
        description: 'Interactive graphical timeline showing every clinical touchpoint across different healthcare facilities over a 90 to 180 day window.',
        uiLocation: 'Main Center Timeline Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-card rounded border space-y-2 text-xs">
  <div className="flex justify-between font-bold"><span>Patient: Arthur Pendelton (Attributed Medicare Beneficiary)</span><Badge className="bg-rose-500 text-white">High Readmission Risk</Badge></div>
  <div className="flex items-center gap-1.5 font-mono text-[11px] overflow-x-auto p-2 bg-muted rounded">
    <span className="p-1 bg-blue-500/20 rounded">05/10: PCP Visit</span> → <span className="p-1 bg-rose-500/30 text-rose-800 font-bold rounded">05/14: ED Admission (CHF)</span> → <span className="p-1 bg-amber-500/20 rounded">05/18: SNF Discharge</span> → <span className="p-1 bg-emerald-500/20 text-emerald-800 font-bold rounded animate-pulse">05/20: Home Health Check (Active)</span>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: '30-Day All-Cause Readmission Risk Engine',
        clinicalOrBusinessLogic: 'Ingests real-time Admission, Discharge, Transfer (ADT) HL7 messages to start a 30-day countdown clock following any acute hospital discharge.',
        formula: 'Readmission Window Active = (CurrentDate <= HospitalDischargeTimestamp + 30 Days)',
        dataSources: ['Hospital ADT HL7 v2.5 Feed (A01 Admission / A03 Discharge / A08 Update)']
      }
    ],
    workflows: [
      {
        actionName: 'Executing Transitional Care Management (TCM) within 48 Hours',
        userRoles: ['Care Coordinator', 'Nurse'],
        steps: [
          'Filter the Patient-Centered Journey board by `Active Transition Window: Post-Hospital Discharge (< 48 Hours)`.',
          'Select Arthur Pendelton following his discharge from St. Jude Hospital for acute heart failure.',
          'Call the patient or caregiver within 48 business hours of discharge to reconcile medications against the hospital discharge summary (`CPT 99495 / 99496 requirement`).',
          'Ensure a face-to-face or telehealth follow-up visit with Dr. Robert Chen is scheduled within 7 calendar days of discharge.',
          'Log the completed interaction inside the Journey timeline.'
        ],
        downstreamImpact: 'Slashes 30-day hospital readmissions by over 35%, captures $210+ per patient in billable TCM revenue, and fulfills core ACO quality metrics.'
      }
    ],
    relatedArticleIds: ['aco-overview', 'aco-utilization', 'engagement-care-episodes']
  },
  {
    id: 'aco-provider-performance',
    title: 'Provider Performance Scorecards & Attribution',
    routePath: '/aco/provider-performance',
    dashboardGroup: 'ACO Insights',
    targetAudience: ['Medical Director', 'ACO Executive', 'Practice Manager'],
    overview: 'Physician scorecard benchmarking clinical quality measure compliance, PMPM cost efficiency, attributed panel size, and out-of-network specialist referral leakage across all network clinicians.',
    features: [
      {
        featureName: 'Network Clinician Scorecard Table',
        description: 'Comprehensive ranking table displaying every attributed clinician alongside their assigned patient panel count, quality composite score, annualized PMPM expenditure, and referral leakage rate.',
        uiLocation: 'Main Benchmarking Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Clinician Name</th><th className="p-2">Attributed Panel</th><th className="p-2">Quality Score</th><th className="p-2">PMPM Cost</th><th className="p-2">Referral Leakage</th></tr>
  <tr><td className="p-2 font-bold">Dr. Robert Chen, MD</td><td className="p-2 font-mono">1,420</td><td className="p-2 text-emerald-600 font-bold">96.4%</td><td className="p-2">$742 / mo</td><td className="p-2 text-emerald-600">4.2% (Low)</td></tr>
  <tr><td className="p-2 font-bold">Dr. Amanda Vance, MD</td><td className="p-2 font-mono">1,180</td><td className="p-2 text-amber-600 font-bold">84.1%</td><td className="p-2 text-rose-600">$912 / mo</td><td className="p-2 text-rose-600">18.4% (High)</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Out-of-Network Referral Leakage Calculation',
        clinicalOrBusinessLogic: 'Tracks what percentage of primary care specialist referrals are directed outside the preferred ACO clinically integrated network (CIN), driving higher medical costs and fragmented care.',
        formula: 'Referral Leakage % = (Specialist Referrals to Non-ACO Network NPIs / Total Outbound Specialist Referrals) × 100',
        dataSources: ['EHR Outbound Referral Orders', 'Provider Network Master NPI Directory']
      }
    ],
    workflows: [
      {
        actionName: 'Curbing Out-of-Network Referral Leakage',
        userRoles: ['Medical Director', 'Practice Manager'],
        steps: [
          'Inspect the Provider Performance table to identify clinicians with Referral Leakage exceeding 15% (`Dr. Amanda Vance: 18.4%`).',
          'Click Dr. Vance\'s name to drill down into her historical referral logs.',
          'Discover that 80% of her orthopedics referrals are being sent to an out-of-network ambulatory surgical center due to habit or outdated referral templates.',
          'Provide Dr. Vance with the updated ACO Preferred Specialist Directory and configure preferred network defaults inside her EHR referral order entry screen.'
        ],
        downstreamImpact: 'Keeps specialty surgical and diagnostic spend inside the cost-controlled preferred ACO network, protecting shared savings margins.'
      }
    ],
    relatedArticleIds: ['aco-overview', 'coordinated-care']
  },
  {
    id: 'aco-gaps',
    title: 'ACO Gaps in Care Tracker (eCQMs & MIPS)',
    routePath: '/aco/gaps',
    dashboardGroup: 'ACO Insights',
    targetAudience: ['Quality Officer', 'Care Coordinator', 'Medical Director'],
    overview: 'Quality measure compliance board tracking CMS Electronic Clinical Quality Measures (eCQMs) and MIPS quality metrics (`Diabetes HbA1c Control`, `Hypertension BP Control`, `Colorectal Screening`, `Depression Screening`).',
    features: [
      {
        featureName: 'eCQM Quality Measure Compliance Board',
        description: 'Card and table views showing exact compliance percentage, numerator count, denominator count, and gap deficit required to reach the 90th percentile CMS quality benchmark.',
        uiLocation: 'Main Quality Measures Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-2 gap-3 text-xs">
  <div className="p-3.5 bg-card rounded-xl border space-y-1.5">
    <div className="flex justify-between font-bold"><span>CMS-122: Diabetes HbA1c Poor Control (> 9%)</span><Badge className="bg-emerald-500/20 text-emerald-700 font-bold">88.4% Compliant</Badge></div>
    <div className="text-muted-foreground text-[11px]">Numerator: 1,254 • Denominator: 1,418 • Exclusions: 24</div>
    <div className="p-1.5 bg-muted/50 rounded font-mono text-[10px] text-primary">Need 12 more controlled patients to hit 90th percentile bonus tier!</div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'CMS-122 / CMS-165 eCQM Electronic Specifications',
        clinicalOrBusinessLogic: 'Evaluates clinical observations using strict electronic logic definitions set by CMS and the National Quality Forum (NQF) for annual quality reporting.',
        formula: 'Compliance Rate % = ((Eligible Denominator - Exclusions - Overdue/Uncontrolled Numerator Gaps) / (Eligible Denominator - Exclusions)) × 100',
        dataSources: ['EHR Structured Observations (LOINC / SNOMED / CPT II)']
      }
    ],
    workflows: [
      {
        actionName: 'Closing Quality Measure Deficits Before Year-End Deadline',
        userRoles: ['Quality Officer', 'Care Coordinator'],
        steps: [
          'Open the ACO Gaps Tracker in October and sort by measures close to the 90th percentile bonus threshold (`CMS-122 Diabetes Control`).',
          'Note that closing exactly 12 patient care gaps will elevate the practice into the highest quality bonus tier.',
          'Click the "Need 12 more controlled patients" alert card to view the exact roster of 164 patients currently sitting in the uncontrolled gap.',
          'Filter for patients whose last recorded HbA1c was between 9.1% and 9.5% (> 60 days ago).',
          'Dispatch priority home lab testing kits or schedule point-of-care clinic visits to re-test and document improved glycemic control.'
        ],
        downstreamImpact: 'Maximizes the ACO quality multiplier from 50% to 100%, directly doubling the final dollar amount of shared savings distributed by CMS.'
      }
    ],
    relatedArticleIds: ['utilization-gaps', 'outcomes-screenings']
  },
  {
    id: 'aco-utilization',
    title: 'Annualized Utilization Metrics & Hospitalization Tracking',
    routePath: '/aco/utilization',
    dashboardGroup: 'ACO Insights',
    targetAudience: ['Medical Director', 'ACO Executive'],
    overview: 'Monitors acute healthcare utilization frequency across the attributed patient population. Tracks Inpatient Admissions per 1,000 members, Emergency Department visits per 1,000, and 30-day readmission rates.',
    features: [
      {
        featureName: 'Annualized Utilization Rate Cards',
        description: 'Benchmark comparison cards showing practice acute event rates normalized per 1,000 attributed member months alongside national Medicare averages.',
        uiLocation: 'Top Benchmarking Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-3 gap-3 text-xs">
  <div className="p-4 bg-card rounded-xl border space-y-1">
    <span className="text-muted-foreground text-sm font-medium">Inpatient Admissions / 1,000</span>
    <div className="text-2xl font-black text-foreground">184.2 <span className="text-xs font-normal text-emerald-600 block">Benchmark: 210.0 / 1k (12% Better)</span></div>
  </div>
  <div className="p-4 bg-card rounded-xl border space-y-1">
    <span className="text-muted-foreground text-sm font-medium">Emergency Dept Visits / 1,000</span>
    <div className="text-2xl font-black text-rose-600">462.8 <span className="text-xs font-normal text-rose-600 block">Benchmark: 410.0 / 1k (13% Worse)</span></div>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Annualized Events Per 1,000 Members Formula',
        clinicalOrBusinessLogic: 'Standardizes acute event counts across fluctuating population sizes and varying observation periods to allow direct comparison against national actuarial tables.',
        formula: 'Annualized Rate / 1,000 = (Total Acute Events in Measurement Window / Total Attributed Member Months in Window) × 12,000',
        dataSources: ['CMS CCLF Inpatient/Outpatient Claims Files', 'HL7 ADT Hospital Feeds']
      }
    ],
    workflows: [
      {
        actionName: 'Investigating Emergency Department Utilization Spikes',
        userRoles: ['Medical Director', 'Care Coordinator'],
        steps: [
          'Observe that `Emergency Dept Visits / 1,000` (`462.8`) exceeds the national Medicare benchmark (`410.0`).',
          'Click the ED utilization card to inspect the facility breakdown table.',
          'Discover that 65% of ED visits occur at St. Jude Hospital during weekend hours.',
          'Cross-reference against After-Hours Encounters and implement an on-call weekend nurse triage line with guaranteed same-day urgent primary care slots on Saturdays.'
        ],
        downstreamImpact: 'Diverts unnecessary weekend emergency room visits to practice-controlled urgent slots, lowering annualized ED utilization per 1,000 members.'
      }
    ],
    relatedArticleIds: ['aco-overview', 'engagement-after-hours-encounters']
  },
  {
    id: 'aco-reports',
    title: 'ACO Regulatory Reporting & Quality File Generation',
    routePath: '/aco/reports',
    dashboardGroup: 'ACO Insights',
    targetAudience: ['Compliance Officer', 'Quality Officer', 'Practice Manager'],
    overview: 'Regulatory compliance and export hub. Generates official CMS-validated Quality Reporting Document Architecture (`QRDA Category III`) XML files, MIPS performance exports, and annual financial reconciliation statements.',
    features: [
      {
        featureName: 'QRDA III XML Submission Generator Wizard',
        description: 'Interactive export tool allowing compliance officers to select reporting calendar year, validate eCQM data completion rates, and generate schema-compliant XML files for direct upload to the CMS Quality Payment Program (QPP) portal.',
        uiLocation: 'Main Export Configuration Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border space-y-3 text-xs">
  <div className="flex justify-between items-center border-b pb-2">
    <div><span className="font-bold text-base">CMS Quality Reporting Export Wizard</span> <span className="text-muted-foreground block">Reporting Year: 2026 • eCQM Bundle: MSSP Web Interface / MIPS</span></div>
    <Badge className="bg-emerald-500 text-white">Schema Validated (0 Errors)</Badge>
  </div>
  <div className="flex justify-end gap-2 pt-2">
    <Button variant="outline" size="sm">Preview Validation Log</Button>
    <Button size="sm" className="gap-2 bg-primary"><FilePlus className="size-4" /> Download QRDA Category III XML File</Button>
  </div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'CMS QRDA Category III XML Schema Validation Engine',
        clinicalOrBusinessLogic: 'Performs pre-submission validation checking every aggregated quality measure numerator, denominator, and exclusion against strict CMS Schematron XSD structure guidelines.',
        formula: 'IsExportValid = Assert(No Missing Stratifications AND Numerator <= Denominator AND All Required NPIs Included)',
        dataSources: ['EHR Aggregated eCQM Results Database']
      }
    ],
    workflows: [
      {
        actionName: 'Executing Annual CMS Quality Submission Without Rejections',
        userRoles: ['Compliance Officer', 'Quality Officer'],
        steps: [
          'Navigate to ACO Reports in January following the close of the reporting calendar year.',
          'Click "Run Pre-Submission Schema Check" inside the QRDA III Generator Wizard.',
          'Review the validation log confirming 0 structural or mathematical discrepancies.',
          'Click "Download QRDA Category III XML File" and securely save the generated document.',
          'Log into the federal CMS Quality Payment Program (qpp.cms.gov) portal and upload the XML file prior to the March submission deadline.'
        ],
        downstreamImpact: 'Guarantees successful compliance with federal Medicare quality reporting mandates, securing maximum shared savings bonus multipliers without administrative audit rejections.'
      }
    ],
    relatedArticleIds: ['aco-gaps', 'aco-overview']
  }
];
