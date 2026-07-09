import { WikiArticle } from './types';

export const mipsArticles: WikiArticle[] = [
  {
    id: 'mips-dashboard',
    title: 'MIPS Executive Performance & Composite Score',
    routePath: '/mips/dashboard',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Physician', 'Practice Manager', 'Superadmin'],
    overview: 'The central hub for tracking Merit-based Incentive Payment System (MIPS) performance. Integrates four performance categories (Quality, Cost, Promoting Interoperability, and Improvement Activities) to calculate a predicted MIPS composite score and projected payment adjustments.',
    features: [
      {
        featureName: 'Composite Score Gauge',
        description: 'Visual speedometer displaying the projected performance year score (out of 100 points) compared to the CMS penalty threshold (60 points) and exceptional performance baseline (85 points).',
        uiLocation: 'Top Left Main Panel',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 120 70" className="w-40 h-24">
  <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
  <path d="M 10 60 A 50 50 0 0 1 95 25" fill="none" stroke="currentColor" strokeWidth="10" className="text-primary" />
  <text x="60" y="52" textAnchor="middle" className="text-xl font-bold fill-foreground">77.9</text>
  <text x="60" y="65" textAnchor="middle" className="text-[9px] fill-muted-foreground">MIPS Composite Score</text>
</svg>`
      },
      {
        featureName: 'Estimated CMS Payment Adjustment Calculator',
        description: 'Real-time financial estimator predicting positive, neutral, or negative Medicare Part B payment adjustment multipliers for the corresponding payment year.',
        uiLocation: 'Top Right Metrics Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs">
  <div className="text-muted-foreground">Payment Adjustment Range</div>
  <div className="text-lg font-bold text-emerald-600">+0.00% to +1.84%</div>
  <div className="text-[10px] text-muted-foreground">Based on current predicted composite score of 77.9</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'MIPS Composite Score calculation',
        clinicalOrBusinessLogic: 'CMS combines weighted category scores to output a value between 0.0 and 100.0.',
        formula: 'Composite Score = (Quality Score × 0.40) + (Cost Score × 0.30) + (Promoting Interoperability Score × 0.25) + (Improvement Activities Score × 0.15)',
        dataSources: ['EHR Quality Measures Database', 'Adjudicated Medicare Claims DB', 'Promoting Interoperability Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Tracking Cumulative MIPS Score & Gap Closing',
        userRoles: ['Practice Manager', 'Physician'],
        steps: [
          'Review the MIPS Executive Dashboard weekly to monitor the composite score.',
          'Identify categories falling below the target threshold (e.g. Quality or Cost).',
          'Drill down into individual category details to find specific clinicians needing support.'
        ],
        downstreamImpact: 'Directly impacts Medicare Part B reimbursements with adjustments ranging from -9% to +9%.'
      }
    ],
    relatedArticleIds: ['mips-ai-assistant', 'mips-quality-measures', 'mips-cost-performance']
  },
  {
    id: 'mips-ai-assistant',
    title: 'MIPS Helix Assistant & Predictive Optimization',
    routePath: '/mips/ai-assistant',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'A conversational and predictive engine designed to analyze EHR databases, identify quality gaps, and recommend point-maximizing interventions before the CMS submission deadline.',
    features: [
      {
        featureName: 'Interactive AI Query Box',
        description: 'Allows users to run natural language questions regarding specialty measures, point gains, and compliance rates.',
        uiLocation: 'Center Roster',
        snippetType: 'jsx',
        uiSnippet: `<div className="flex gap-2">
  <input type="text" placeholder="Which measures can we improve for the highest score gain?" className="flex-1 border p-2 text-xs rounded" />
  <button className="bg-primary text-white px-3 py-1 text-xs rounded">Analyze</button>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Priority Action Point Yield Recommendation',
        clinicalOrBusinessLogic: 'AI prioritizes actions based on their current score impact and clinician burden.',
        formula: 'PriorityScore = (Potential Point Increase) / (Clinician Hours Required to Complete Activity)',
        dataSources: ['CMS Benchmark Decile Tables', 'Internal Care Delivery Logs']
      }
    ],
    workflows: [
      {
        actionName: 'Executing MIPS Optimization Suggestions',
        userRoles: ['Practice Manager', 'Care Coordinator'],
        steps: [
          'Input questions into the query box to generate automated MIPS improvement checklists.',
          'Review recommendations such as adding a new High-Weight Improvement Activity.',
          'Assign recommended activities to target coordinators to secure compliance points.'
        ],
        downstreamImpact: 'Increases optimization efficiency and ensures no quality points are left on the table.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-quality-measures', 'mips-improvement-activities']
  },
  {
    id: 'mips-quality-measures',
    title: 'eCQM Quality Performance Measures',
    routePath: '/mips/quality-measures',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Medical Coder', 'Physician', 'Practice Manager'],
    overview: 'Tracks compliance, numerators, and denominators for electronic Clinical Quality Measures (eCQMs). Includes exports for Quality Reporting Document Architecture (QRDA Category III) files.',
    features: [
      {
        featureName: 'eCQM Performance Grid',
        description: 'Roster of active measures showing current clinical rates vs. target national decile benchmarks.',
        uiLocation: 'Main Roster Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs">
  <div className="flex justify-between"><span>Diabetes HbA1c Control (Quality ID 001)</span><span>72.4%</span></div>
  <div className="w-full bg-muted h-2 rounded"><div className="bg-emerald-500 h-full w-[72%]" /></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Clinical Performance Rate',
        clinicalOrBusinessLogic: 'Measures patient compliance against the total eligible population matching diagnostic denominators.',
        formula: 'Performance Rate = (Numerator / (Denominator - Exclusions - Exceptions)) × 100',
        dataSources: ['EHR Patient Encounters', 'ICD-10 Diagnoses', 'CPT Procedure Codes']
      }
    ],
    workflows: [
      {
        actionName: 'Identifying and Rectifying Quality Gaps',
        userRoles: ['Care Coordinator', 'Medical Coder'],
        steps: [
          'Filter the Quality Measures table for metrics scoring below Decile 7.',
          'Select the specific measure (e.g. Hypertension BP Control) to pull up non-compliant patients.',
          'Contact patients for follow-up blood pressure readings to update the registry.'
        ],
        downstreamImpact: 'Improves core care metrics, closing gaps that directly drive higher MIPS composite scores.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-provider-comparison']
  },
  {
    id: 'mips-cost-performance',
    title: 'MIPS Cost Performance & Spending Ratios',
    routePath: '/mips/cost-performance',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Practice Manager', 'Physician'],
    overview: 'Monitors the CMS Cost Category performance. Tracks key spending indexes such as Medicare Spending Per Beneficiary (MSPB) and Total Per Capita Cost (TPCC) based on administrative claims.',
    features: [
      {
        featureName: 'Cost Performance Trend Graph',
        description: 'Line chart indicating historical and current spending trends compared against CMS national cost target averages.',
        uiLocation: 'Center Panel Chart',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-muted/20 border rounded-lg text-xs space-y-1">
  <div className="flex justify-between"><span>TPCC (Per Beneficiary)</span><span className="font-bold font-mono">$12,480</span></div>
  <div className="text-[10px] text-emerald-600">6.2% below national median benchmark ($13,310)</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Total Per Capita Cost (TPCC)',
        clinicalOrBusinessLogic: 'Evaluates the overall cost of care provided to beneficiaries assigned to a primary care clinician.',
        formula: 'TPCC = (Total Risk-Adjusted Cost of Beneficiary Services / Count of Allocated Beneficiaries)',
        dataSources: ['Medicare Part A & B Claims', 'Patient Risk Factors Tables']
      }
    ],
    workflows: [
      {
        actionName: 'Analyzing Cost Drivers & Referral Patterns',
        userRoles: ['Practice Manager', 'Physician'],
        steps: [
          'Analyze spending charts to pinpoint categories with high outliers (e.g. emergency services).',
          'Coordinate with referral partners to ensure services stay within cost-effective networks.'
        ],
        downstreamImpact: 'Minimizes unwarranted clinical spending and increases the practice\'s performance rating in the CMS cost category.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-provider-comparison']
  },
  {
    id: 'mips-interoperability',
    title: 'Promoting Interoperability & EHR Syncing',
    routePath: '/mips/interoperability',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Practice Manager', 'Superadmin'],
    overview: 'Ensures the practice fulfills promoting interoperability (PI) requirements including e-Prescribing, Health Information Exchange (HIE), and patient portal access tracking.',
    features: [
      {
        featureName: 'PI Category Status Cards',
        description: 'Grid of status cards reporting completion metrics for mandatory and bonus interoperability requirements.',
        uiLocation: 'Top Category Cards',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-2 gap-2 text-xs">
  <div className="p-2 border rounded bg-emerald-500/10 border-emerald-500 text-emerald-800">e-Prescribing: Complete</div>
  <div className="p-2 border rounded bg-amber-500/10 border-amber-500 text-amber-800">Health Information Exchange: 82%</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Interoperability Compliance Ratio',
        clinicalOrBusinessLogic: 'Maintains records on electronic messaging and query performance out of total patient interactions.',
        formula: 'PI Metric Rate = (Count of Compliant Transactions / Total Count of Qualifying Patient Transactions) × 100',
        dataSources: ['EHR System Audit Logs', 'e-Prescribing Portals']
      }
    ],
    workflows: [
      {
        actionName: 'Validating Interoperability Data Integrity',
        userRoles: ['Superadmin', 'Practice Manager'],
        steps: [
          'Verify EHR transmission endpoints are fully validated and registered.',
          'Review error logs for electronic patient records sent to external facilities.',
          'Re-sync failed messages to keep e-Prescribing and query metrics above standard thresholds.'
        ],
        downstreamImpact: 'Ensures a passing score in the Promoting Interoperability section, avoiding complete category forfeitures.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-reports']
  },
  {
    id: 'mips-improvement-activities',
    title: 'MIPS Improvement Activities Log',
    routePath: '/mips/improvement-activities',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'A clinical checklist directory to select, document, and claim points for qualifying Improvement Activities (IA).',
    features: [
      {
        featureName: 'IA Selection Board',
        description: 'Interactive roster divided by Medium and High weight activities showing active, planned, or completed statuses.',
        uiLocation: 'Main Board',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 border rounded-xl space-y-2 text-xs">
  <div className="flex justify-between font-bold"><span>Activity: Care Coordination (IA_CC_1)</span><span className="text-primary">High Weight</span></div>
  <p className="text-muted-foreground text-[10.5px]">Implementation of care coordination practices across services.</p>
  <span className="bg-emerald-500/20 text-emerald-800 border border-emerald-500 px-2 py-0.5 rounded text-[10px]">Active</span>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'IA Points Aggregation',
        clinicalOrBusinessLogic: 'Fulfilling the category requires earning 40 points through combinations of Medium (10 pt) and High (20 pt) activities.',
        formula: 'Total IA Points = Σ(Completed High Activities × 20) + Σ(Completed Medium Activities × 10)',
        dataSources: ['Attestation Records', 'Practice Workflows Documentation']
      }
    ],
    workflows: [
      {
        actionName: 'Selecting and Attesting to Improvement Activities',
        userRoles: ['Practice Manager'],
        steps: [
          'Browse the IA Checklist to identify activities matching active clinical initiatives.',
          'Document evidence of the practice\'s engagement (e.g. 24/7 care portal screenshots).',
          'Mark activity status as "Attested" to lock in the points for submission.'
        ],
        downstreamImpact: 'Ensures the practice secures the full 15% improvement activities contribution toward the composite score.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-ai-assistant']
  },
  {
    id: 'mips-provider-comparison',
    title: 'Specialist & Provider MIPS Comparison',
    routePath: '/mips/provider-comparison',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Practice Manager', 'Physician'],
    overview: 'Allows practice administrators to benchmark individual clinician performance metrics, patient panels, quality rates, and composite point values.',
    features: [
      {
        featureName: 'Provider Comparison Table',
        description: 'Multi-column grid comparing clinicians side-by-side, detailing average risk profiles, compliant patients, and total points.',
        uiLocation: 'Main Screen Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1.5 text-xs">
  <div className="flex justify-between"><span>Dr. Amanda Johnson</span><span className="font-bold">88.5 Points</span></div>
  <div className="flex justify-between"><span>Dr. Andrew Anderson</span><span className="font-bold">78.2 Points</span></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Clinician Score Attribution',
        clinicalOrBusinessLogic: 'Attributes eCQM numerator/denominators to the specific primary care provider listed in billing claims.',
        formula: 'Clinician Compliance = (Clinician Numerator / Clinician Denominator) × 100',
        dataSources: ['NPI Provider Tables', 'EHR Patient Encounter Roster']
      }
    ],
    workflows: [
      {
        actionName: 'Conducting Provider Feedback and Quality Reviews',
        userRoles: ['Practice Manager'],
        steps: [
          'Filter the Provider Comparison Table by specializations or clinics.',
          'Highlight providers falling below targets to initiate targeted care coordination reviews.',
          'Review workflow gaps with underperforming staff to align them with practice best practices.'
        ],
        downstreamImpact: 'Standardizes care standards across the practice, lifting the average composite MIPS performance.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-quality-measures']
  },
  {
    id: 'mips-reports',
    title: 'MIPS Reporting & QRDA III Data Export',
    routePath: '/mips/reports',
    dashboardGroup: 'MIPS Nexus',
    targetAudience: ['Practice Manager', 'Superadmin', 'Medical Coder'],
    overview: 'Final submission preparation portal. Compiles quality measure files, attestations, and logs into standard QRDA Category III XML formats for CMS API uploads.',
    features: [
      {
        featureName: 'XML Preview & Validation Panel',
        description: 'Displays a live code editor view of generated QRDA XML data with validation indicators.',
        uiLocation: 'Center Workspace',
        snippetType: 'code',
        uiSnippet: `<?xml version="1.0" encoding="utf-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3">
  <!-- QRDA Category III Template -->
  <templateId root="2.16.840.1.113883.10.20.27.1.1" />
  <title>QRDA Category III Report</title>
</ClinicalDocument>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'CMS Schema Validation Pass Rate',
        clinicalOrBusinessLogic: 'Runs pre-audit validation on files to ensure zero XML format, OID, or formatting errors.',
        formula: 'Validation Checks = Count(Passed XML Schemas) / Total Mandatory Rules',
        dataSources: ['CMS QRDA Schematron Files', 'EHR Reporting Engine']
      }
    ],
    workflows: [
      {
        actionName: 'Generating and Uploading the Annual CMS Report',
        userRoles: ['Practice Manager', 'Superadmin'],
        steps: [
          'Verify all four MIPS category points are finalized on the main dashboard.',
          'Run the pre-submission validator on the MIPS Reports page.',
          'Download the verified QRDA Category III XML file.',
          'Upload the file to the CMS Quality Payment Program (QPP) portal.'
        ],
        downstreamImpact: 'Completes the compliance loop to secure positive Medicare payment adjustments.'
      }
    ],
    relatedArticleIds: ['mips-dashboard', 'mips-quality-measures', 'mips-interoperability']
  }
];
