import { WikiArticle } from './types';

export const employerArticles: WikiArticle[] = [
  {
    id: 'emp-overview',
    title: 'Employer Analytics Executive ROI Dashboard',
    routePath: '/employer/overview',
    dashboardGroup: 'Employer Analytics',
    targetAudience: ['Practice Manager', 'Superadmin'],
    overview: 'The executive command board for employer health groups. Aggregates population healthcare trends, direct primary care (DPC) enrollment ratios, and calculated financial return-on-investment (ROI) metrics.',
    features: [
      {
        featureName: 'DPC Enrollment Ratio Card',
        description: 'Percentage meter showing active covered lives registered in the direct primary care benefit tier vs. total eligible employee roster.',
        uiLocation: 'Top Left KPI Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs">
  <div className="text-muted-foreground">Active DPC Enrollment</div>
  <div className="text-2xl font-bold">84.2%</div>
  <div className="text-[10px] text-emerald-600">+2.4% MoM growth</div>
</div>`
      },
      {
        featureName: 'Cumulative Health ROI Counter',
        description: 'Projects direct health plan savings gained by shifting care away from expensive emergency visits toward primary preventive management.',
        uiLocation: 'Top Center KPI Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs">
  <div className="text-muted-foreground">Calculated Savings (PMPM)</div>
  <div className="text-2xl font-bold text-emerald-600">$245,366</div>
  <div className="text-[10px] text-muted-foreground">Based on $41.80 PMPM net savings</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Direct Primary Care ROI Metric',
        clinicalOrBusinessLogic: 'Measures financial savings by subtracting direct program fees from gross claims expenditure differences.',
        formula: 'Net Savings = (Baseline Claims Costs PMPM - DPC Claims Costs PMPM) × Covered Members × Tracking Months - Total Program Fees',
        dataSources: ['Employer Claims Database', 'DPC Member Enrollment Tables']
      }
    ],
    workflows: [
      {
        actionName: 'Evaluating Annual Health Plan Performance',
        userRoles: ['Practice Manager', 'Superadmin'],
        steps: [
          'Log into the Employer Overview page to view total enrollment and ROI statistics.',
          'Identify enrollment drops or claims spikes by comparing monthly financial intervals.',
          'Export performance data to present during quarterly client review meetings.'
        ],
        downstreamImpact: 'Aids employers in assessing health plan efficiency, locking in benefit renewals, and adjusting benefit models.'
      }
    ],
    relatedArticleIds: ['emp-financial', 'emp-enrollment', 'emp-benchmarking']
  },
  {
    id: 'emp-enrollment',
    title: 'Employer Member Enrollment & Demographics',
    routePath: '/employer/enrollment',
    dashboardGroup: 'Employer Analytics',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'Provides granular tracking of subscriber growth, age distributions, gender ratios, dependency counts, and active tier distributions across employer populations.',
    features: [
      {
        featureName: 'Subscriber Tier Grid',
        description: 'Tabular breakdown listing participant counts across categories (Employee Only, Employee + Spouse, Family).',
        uiLocation: 'Center Roster Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1.5 text-xs">
  <div className="flex justify-between"><span>Employee Only</span><span className="font-bold font-mono">210 Subscribers</span></div>
  <div className="flex justify-between"><span>Family Tier</span><span className="font-bold font-mono">142 Subscribers</span></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Subscriber Retention Rate',
        clinicalOrBusinessLogic: 'Evaluates the percentage of active members retaining coverage year-over-year.',
        formula: 'Retention Rate = (Active Members at End of Month / Active Members at Start of Month) × 100',
        dataSources: ['HR Member Roster Logs', 'DPC Billing Databases']
      }
    ],
    workflows: [
      {
        actionName: 'Managing Population Health Adjustments',
        userRoles: ['Care Coordinator'],
        steps: [
          'Examine demographics to isolate age cohorts with higher risk potentials.',
          'Tailor outreach strategies (e.g. checkups for members over 50 years of age).'
        ],
        downstreamImpact: 'Aligns preventative health priorities with the demographic properties of covered employee families.'
      }
    ],
    relatedArticleIds: ['emp-overview', 'emp-chronic']
  },
  {
    id: 'emp-financial',
    title: 'Financial Claims Performance & PMPM Trends',
    routePath: '/employer/financial',
    dashboardGroup: 'Employer Analytics',
    targetAudience: ['Practice Manager', 'Superadmin'],
    overview: 'Analyzes financial claims data including total spending trends, category distributions (inpatient, outpatient, pharmacy, primary care), and Per Member Per Month (PMPM) variations.',
    features: [
      {
        featureName: 'PMPM Spending Line Chart',
        description: 'Interactive graph comparing current PMPM claims spending against historical trends and payer baseline targets.',
        uiLocation: 'Main Chart Area',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 border bg-muted/10 rounded-lg text-xs space-y-1">
  <div className="flex justify-between"><span>Current PMPM Claim Average</span><span className="font-bold font-mono">$489.50</span></div>
  <div className="text-[10px] text-emerald-600">8.2% lower than commercial baseline ($531.30)</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Per Member Per Month (PMPM) Spending',
        clinicalOrBusinessLogic: 'Standardizes healthcare spending trends to evaluate population utilization efficiency.',
        formula: 'PMPM Value = Total Claims Spending in Month / Total Covered Members in Month',
        dataSources: ['Adjudicated Claims EDW', 'Member Enrollment Database']
      }
    ],
    workflows: [
      {
        actionName: 'Auditing Pharmacy & Outpatient Cost Spikes',
        userRoles: ['Practice Manager', 'Superadmin'],
        steps: [
          'Filter PMPM charts for outpatient or brand-name drug categories.',
          'Review the cost spikes with care coordinators to explore generic alternatives or outpatient care plans.'
        ],
        downstreamImpact: 'Minimizes wasteful plan spending and increases employer savings under risk-sharing models.'
      }
    ],
    relatedArticleIds: ['emp-overview', 'emp-high-cost']
  },
  {
    id: 'emp-chronic',
    title: 'Chronic Disease Prevalence & Management',
    routePath: '/employer/chronic',
    dashboardGroup: 'Employer Analytics',
    targetAudience: ['Care Coordinator', 'Physician'],
    overview: 'Monitors chronic condition incidence rates (Diabetes, Hypertension, Cardiovascular Disease) and reports on clinical control status and preventive health compliance.',
    features: [
      {
        featureName: 'Chronic Condition Control Meters',
        description: 'Tracks metrics such as HbA1c control rates or blood pressure compliance levels inside specific diagnostic cohorts.',
        uiLocation: 'Mid Page Performance Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1 text-xs">
  <div className="flex justify-between"><span>Hypertension BP Control (<140/90)</span><span>76.8%</span></div>
  <div className="w-full bg-muted h-2 rounded"><div className="bg-emerald-500 h-full w-[76%]" /></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Cohort Prevalence Rate',
        clinicalOrBusinessLogic: 'Identifies the percentage of covered employees affected by a specific diagnostic profile.',
        formula: 'Prevalence Rate = (Count of Patients with Chronic Diagnosis / Total Covered Lives) × 1,000',
        dataSources: ['EHR Medical Problem Lists', 'claims_edw Billing Codes']
      }
    ],
    workflows: [
      {
        actionName: 'Enrolling Uncontrolled Patients in Disease Management Programs',
        userRoles: ['Care Coordinator'],
        steps: [
          'Filter the Chronic Conditions dashboard for patients categorized as "Uncontrolled".',
          'Coordinate clinical huddles to enroll these patients in proactive counseling programs.'
        ],
        downstreamImpact: 'Drives down secondary complications and mitigates high-cost inpatient claims.'
      }
    ],
    relatedArticleIds: ['emp-overview', 'emp-high-cost']
  },
  {
    id: 'emp-high-cost',
    title: 'High-Cost Claimants & Risk Stratification',
    routePath: '/employer/high-cost',
    dashboardGroup: 'Employer Analytics',
    targetAudience: ['Practice Manager', 'Care Coordinator'],
    overview: 'Isolates and stratifies patients with high-cost claims thresholds. Targets case management resources to optimize care and control catastrophic claims exposure.',
    features: [
      {
        featureName: 'Catastrophic Risk Stratification Card',
        description: 'Graph highlighting the distribution of total claims spend concentrated within the top percentile tiers of patient panels.',
        uiLocation: 'Top Right Dashboard Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1.5 text-xs">
  <div className="flex justify-between"><span>Top 5% Claimant Concentration</span><span className="font-bold text-rose-600">42% of Spend</span></div>
  <div className="text-[10px] text-muted-foreground">Top 5% of members account for $1.2M of claims</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'High-Cost Claimant Threshold flag',
        clinicalOrBusinessLogic: 'Identifies individuals exceeding typical annual claims limits to flag case management needs.',
        formula: 'High-Cost Claimant = (Total Claims Spend in Year >= $50,000)',
        dataSources: ['Adjudicated Claims Databases', 'Case Management Roster']
      }
    ],
    workflows: [
      {
        actionName: 'Assigning Case Managers to High-Risk Members',
        userRoles: ['Care Coordinator', 'Practice Manager'],
        steps: [
          'Filter the High-Cost Claimant roster by cost thresholds and open clinical gaps.',
          'Review medical charts to confirm engagement with specialized case management.',
          'Verify outpatient care plans are in place to reduce unnecessary emergency visits.'
        ],
        downstreamImpact: 'Mitigates health risk escalations, improves care transitions, and controls total employer financial risk.'
      }
    ],
    relatedArticleIds: ['emp-financial', 'emp-chronic']
  },
  {
    id: 'emp-benchmarking',
    title: 'Employer Risk Benchmarking & ROI Scorecard',
    routePath: '/employer/benchmarking',
    dashboardGroup: 'Employer Analytics',
    targetAudience: ['Practice Manager', 'Superadmin'],
    overview: 'Compares the employer health plan metrics against regional healthcare plans, commercial averages, and national quality standards.',
    features: [
      {
        featureName: 'Benchmark Comparison Matrix',
        description: 'Multi-column overview grid showing the organization\'s metrics vs. regional average and national target indicators.',
        uiLocation: 'Main Matrix View',
        snippetType: 'jsx',
        uiSnippet: `<div className="space-y-1.5 text-xs font-mono">
  <div className="flex justify-between"><span>Acme Risk Score</span><span>53 / 100</span></div>
  <div className="flex justify-between"><span>Regional Average</span><span>62 / 100</span></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Benchmarked Spending Savings Variance',
        clinicalOrBusinessLogic: 'Evaluates direct savings against commercial averages to demonstrate the financial return of the program.',
        formula: 'Claims Variance PMPM = Regional Average PMPM - Acme Corporation PMPM',
        dataSources: ['Regional Commercial Health Plans Database', 'Acme Financial Records']
      }
    ],
    workflows: [
      {
        actionName: 'Reviewing and Exporting ROI Attestation Files',
        userRoles: ['Practice Manager', 'Superadmin'],
        steps: [
          'Generate the annual ROI benchmark comparison sheet.',
          'Confirm performance improvements in key care indices (e.g. emergency visits, primary care touch rate).',
          'Download and share results with benefits leadership to document program savings.'
        ],
        downstreamImpact: 'Validates health program efficiency and provides documentation for direct return-on-investment.'
      }
    ],
    relatedArticleIds: ['emp-overview', 'emp-financial']
  }
];
