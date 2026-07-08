import { WikiArticle } from './types';

export const outcomesArticles: WikiArticle[] = [
  {
    id: 'outcomes-dashboard',
    title: 'Clinical Quality Dashboard Overview',
    routePath: '/outcomes/dashboard',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Quality Officer', 'Medical Director', 'Care Coordinator'],
    overview: 'The clinical excellence command center summarizing practice-wide preventative screening rates, chronic disease control benchmarks, and population health quality indices.',
    features: [
      {
        featureName: 'Composite Clinical Quality Index Gauge',
        description: 'Aggregate percentage meter reflecting overall practice adherence to evidence-based preventive and chronic disease management guidelines across all active patient panels.',
        uiLocation: 'Top Left Executive Summary Card',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 100 100" className="size-20">
  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-muted fill-none" />
  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" strokeDasharray="263.8" strokeDashoffset="31.6" className="text-emerald-500 fill-none -rotate-90 origin-center" />
  <text x="50" y="55" textAnchor="middle" className="text-sm font-bold fill-foreground">88%</text>
</svg>`
      },
      {
        featureName: 'Preventive Screening Summary Grid',
        description: 'Quick-look cards showing current compliance percentage and overdue patient count for core screenings (`Mammography: 82%`, `Colorectal: 79%`, `Cervical: 89%`).',
        uiLocation: 'Center Summary Cards Grid',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-3 gap-2 text-xs">
  <div className="p-3 bg-card rounded border"><span className="font-bold block">Colorectal Screening</span><span className="text-xl font-black text-amber-600">79.2%</span><p className="text-[10px] text-muted-foreground">142 Overdue</p></div>
  <div className="p-3 bg-card rounded border"><span className="font-bold block">Breast Cancer Screening</span><span className="text-xl font-black text-emerald-600">88.4%</span><p className="text-[10px] text-muted-foreground">64 Overdue</p></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Composite Quality Index Algorithm',
        clinicalOrBusinessLogic: 'Calculates a weighted average across all active clinical quality indicators, granting higher weight to high-impact chronic management metrics (`Diabetes Control`, `BP Control`).',
        formula: 'Quality Index = Σ(Individual Measure Compliance % × Clinical Impact Weight) / Σ(Clinical Impact Weights)',
        dataSources: ['EHR Problem List', 'LOINC Lab Observations Database', 'Radiology/Screening Reports']
      }
    ],
    workflows: [
      {
        actionName: 'Prioritizing Quality Improvement Campaigns',
        userRoles: ['Quality Officer', 'Medical Director'],
        steps: [
          'Review the Preventive Screening Summary Grid to identify whichever measure sits lowest relative to HEDIS/Star rating targets (`Colorectal Screening: 79.2%`).',
          'Click the Colorectal Screening card to jump directly into the detailed Screenings Due roster.',
          'Launch a targeted outreach campaign shipping at-home FIT (Fecal Immunochemical Test) kits to all 142 overdue patients.'
        ],
        downstreamImpact: 'Rapidly closes clinical gap deficits, elevates practice quality scores above national 90th percentile benchmarks, and catches early-stage colorectal malignancy.'
      }
    ],
    relatedArticleIds: ['outcomes-screenings', 'outcomes-patient-groups', 'aco-gaps']
  },
  {
    id: 'outcomes-patient-groups',
    title: 'Dynamic Patient Cohort & Group Builder',
    routePath: '/outcomes/patient-groups',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Care Coordinator', 'Practice Manager', 'Quality Officer'],
    overview: 'Advanced patient segmentation query engine. Enables clinical teams to build dynamic, rule-based patient cohorts (`AND` / `OR` boolean logic) for targeted care coordination and research.',
    features: [
      {
        featureName: 'Boolean Clinical Query Builder',
        description: 'Visual rule editor allowing selection of demographic filters (`Age >= 65`), diagnosis criteria (`ICD-10 = E11.*`), lab observation boundaries (`Last LDL > 130 mg/dL`), and medication flags.',
        uiLocation: 'Top Query Builder Card',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-4 bg-card rounded-xl border space-y-2 text-xs font-mono">
  <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-primary text-primary-foreground rounded font-sans font-bold">WHERE</span> <span>Age >= 65</span></div>
  <div className="flex items-center gap-2 pl-6"><span className="px-2 py-0.5 bg-muted rounded font-sans font-bold text-amber-600">AND</span> <span>Diagnosis contains "Diabetes (E11)"</span></div>
  <div className="flex items-center gap-2 pl-6"><span className="px-2 py-0.5 bg-muted rounded font-sans font-bold text-amber-600">AND</span> <span>Last Observation "LDL Cholesterol" > 130 mg/dL</span></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Real-Time Dynamic Cohort Evaluation Engine',
        clinicalOrBusinessLogic: 'Evaluates the active master patient index nightly (or instantly upon query adjustment) against compound boolean rules to maintain exact membership rosters.',
        formula: 'CohortMembership = EvaluateChartAgainstRuleTree(PatientChart, BooleanAbstractSyntaxTree)',
        dataSources: ['EHR Structured Database (`Demographics`, `Problems`, `Observations`, `Medications`)']
      }
    ],
    workflows: [
      {
        actionName: 'Creating a High-Risk Lipid Management Cohort',
        userRoles: ['Care Coordinator', 'Physician'],
        steps: [
          'Open Patient Groups and click "Create New Dynamic Group".',
          'Add Rule 1: `Diagnosis contains "Coronary Artery Disease (I25)" OR "Diabetes (E11)"`.',
          'Add Rule 2 (`AND` condition): `Last Lab "LDL Cholesterol" > 100 mg/dL (`or unassessed in > 12m`)`.',
          'Add Rule 3 (`AND` condition): `Active Medications does NOT contain "Statin"`.',
          'Save group as `"High-Risk Lipid Gap Cohort (Statin Needed)"`.',
          'Click "Bulk Action → Send to Provider Review Queue" so clinicians authorize prescription statin therapy for these high-risk patients.'
        ],
        downstreamImpact: 'Systematically eliminates primary cardiovascular medication gaps across thousands of charts, dramatically lowering incidence of heart attack and stroke.'
      }
    ],
    relatedArticleIds: ['outcomes-dashboard', 'chronic-risk']
  },
  {
    id: 'outcomes-screenings',
    title: 'Screenings Due & Preventive Care Rosters',
    routePath: '/outcomes/screenings',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Care Coordinator', 'Medical Assistant', 'Quality Officer'],
    overview: 'Granular patient rosters tracking compliance across evidence-based USPSTF and CDC preventive cancer and health screenings (`Mammography`, `Colorectal`, `Cervical`, `Lung LDCT`).',
    features: [
      {
        featureName: 'Screening Type Selector Tabs & Filterable Roster',
        description: 'Horizontal tabs dividing rosters by screening guideline (`Colorectal Cancer Screening (45-75 yrs)`), displaying patient contact info, last completed screening date, and assigned outreach staff.',
        uiLocation: 'Main Roster Table Section',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Patient</th><th className="p-2">Screening Requirement</th><th className="p-2">Last Completed</th><th className="p-2">Status</th></tr>
  <tr><td className="p-2 font-medium">Eleanor Vance (68F)</td><td className="p-2 font-mono">USPSTF Mammography (Every 24m)</td><td className="p-2 text-muted-foreground">03/14/2024 (28m ago)</td><td className="p-2"><Badge variant="destructive">Overdue by 4m</Badge></td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'USPSTF Evidence-Based Screening Guideline Rules',
        clinicalOrBusinessLogic: 'Evaluates patient age, gender, surgical history exclusions (e.g., bilateral mastectomy or total hysterectomy), and observation timestamps to assign screening eligibility.',
        formula: 'IsScreeningOverdue = (Age >= MinAge AND Age <= MaxAge) AND (HasSurgicalExclusion == False) AND (LastScreeningDate < Today - RecommendedIntervalMonths)',
        dataSources: ['EHR Diagnostic Radiology/Pathology Reports', 'Surgical History Exclusions List']
      }
    ],
    workflows: [
      {
        actionName: 'Coordinating Standing Radiology Order Dispatch',
        userRoles: ['Care Coordinator', 'Medical Assistant'],
        steps: [
          'Select the `Mammography Screening` tab on the Screenings Due page.',
          'Filter for patients assigned to your care coordination panel (`Assigned Staff: Sarah J., RN`).',
          'Use table checkboxes to select 20 overdue female patients who have no documented mammogram in over 24 months.',
          'Click "Generate Standing Radiology Order & Send Self-Schedule Link".',
          'The system auto-generates a signed standing mammography order from the attending PCP and texts/emails a direct booking link to the patient\'s smartphone.'
        ],
        downstreamImpact: 'Removes scheduling friction for patients and ensures early detection of breast pathology while boosting HEDIS breast cancer screening compliance.'
      }
    ],
    relatedArticleIds: ['outcomes-dashboard', 'communication-campaigns']
  },
  {
    id: 'outcomes-vaccinations',
    title: 'Vaccinations & Immunization Compliance Tracking',
    routePath: '/outcomes/vaccinations',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Care Coordinator', 'Nurse', 'Medical Assistant'],
    overview: 'Tracks immunization status across the patient population according to CDC ACIP recommendations (`Influenza`, `Pneumococcal PCV20/PPSV23`, `Shingles Shingrix`, `COVID-19`, `Tdap`).',
    features: [
      {
        featureName: 'Immunization Gap Matrix Table',
        description: 'Multi-column grid displaying each patient row with colored status cells (`Green Check: Up-to-Date`, `Red Alert: Overdue`, `Gray: Contraindicated/Refused`) for every major vaccine family.',
        uiLocation: 'Center Immunization Matrix Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-center border">
  <tr className="bg-muted font-bold"><th className="p-2 text-left">Patient Name</th><th className="p-2">Influenza (Annual)</th><th className="p-2">Pneumococcal (>65)</th><th className="p-2">Shingrix (2-Dose)</th></tr>
  <tr><td className="p-2 text-left font-medium">Arthur Pendelton (72M)</td><td className="p-2 bg-emerald-500/20 text-emerald-700 font-bold">Given 10/14/25</td><td className="p-2 bg-rose-500/20 text-rose-700 font-bold">Overdue</td><td className="p-2 bg-amber-500/20 text-amber-700">Dose 1 Given (Dose 2 Due)</td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'CDC ACIP Immunization Periodicity & Contraindication Engine',
        clinicalOrBusinessLogic: 'Evaluates age thresholds, high-risk clinical conditions (e.g., diabetes, asplenia, immunocompromise), prior dose timestamps, and documented medical/religious refusals.',
        formula: 'IsVaccineDue = (Age >= ACIP_MinAge OR HasRiskFactor) AND (Count(ValidDoseCVX_Codes) < RecommendedDoseCount) AND (HasRefusalOrContraindication == False)',
        dataSources: ['EHR Immunization Registry (CVX / MVX Codes)', 'State Immunization Information System (IIS / HL7 VXU Sync)']
      }
    ],
    workflows: [
      {
        actionName: 'Executing Annual Fall Influenza & Pneumococcal Outreach',
        userRoles: ['Nurse', 'Care Coordinator'],
        steps: [
          'In September, open Vaccinations tracking and filter for `Age >= 65` and `Pneumococcal: Overdue`.',
          'Verify which patients are also due for their annual Influenza vaccine.',
          'Schedule targeted "Flu & Pneumonia Express Drive-Thru Clinics" on Saturday mornings.',
          'Send broadcast SMS invitations to the eligible cohort with single-click time slot reservations.'
        ],
        downstreamImpact: 'Protects vulnerable seniors from invasive pneumococcal disease and winter influenza hospitalizations, achieving > 85% immunization rates.'
      }
    ],
    relatedArticleIds: ['outcomes-dashboard', 'outcomes-screenings']
  },
  {
    id: 'outcomes-appointments',
    title: 'Preventive Appointments & AWV Scheduling Tracking',
    routePath: '/outcomes/appointments',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Front Desk', 'Care Coordinator', 'Practice Manager'],
    overview: 'Monitors preventive wellness appointment scheduling status, tracking Medicare Annual Wellness Visits (AWV - CPT G0438/G0439), physical exams, and no-show patterns.',
    features: [
      {
        featureName: 'AWV Scheduling Funnel & Status Table',
        description: 'Tracking table segmenting Medicare beneficiaries into `AWV Completed This Year`, `AWV Currently Scheduled`, and `AWV Overdue & Unscheduled (> 12m since last visit)`.',
        uiLocation: 'Main Center Tracking Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-3 gap-3 text-xs mb-4">
  <div className="p-3 bg-card rounded border font-semibold">Completed AWVs: <span className="text-emerald-600 font-bold block text-lg">1,120 (74%)</span></div>
  <div className="p-3 bg-card rounded border font-semibold">Scheduled (< 30d): <span className="text-blue-600 font-bold block text-lg">184 (12%)</span></div>
  <div className="p-3 bg-card rounded border border-rose-500/40 font-semibold">Unscheduled / Overdue: <span className="text-rose-600 font-bold block text-lg">214 (14%)</span></div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Medicare Annual Wellness Visit (AWV) Periodicity Rule',
        clinicalOrBusinessLogic: 'CMS Medicare Part B covers an Initial Annual Wellness Visit (G0438) once per lifetime after the first 12 months of Part B enrollment, and Subsequent Annual Wellness Visits (G0439) exactly once every 12 full calendar months thereafter.',
        formula: 'IsAWVPayable = (Days Since Last G0438 or G0439 Claim >= 366 Days) AND (Enrolled in Part B > 12 Months)',
        dataSources: ['Billing CPT Encounter History (`G0438`, `G0439`, `G0402 IPPE`)']
      }
    ],
    workflows: [
      {
        actionName: 'Booking Overdue Annual Wellness Visits via Automated Scheduling',
        userRoles: ['Front Desk Lead', 'Care Coordinator'],
        steps: [
          'Filter the AWV Status table by `Status: Unscheduled & Overdue (> 366d since last AWV)` sorted by attributed primary care clinician.',
          'Verify that each patient has active Medicare Part B coverage.',
          'Click "Send Direct AWV Booking Invitation". The system dispatches an SMS containing a secure link to choose an open 45-minute wellness visit slot on their clinician\'s calendar.',
          'For patients without smartphones, assign the remaining roster to front desk staff for outbound phone scheduling.'
        ],
        downstreamImpact: 'Captures $175+ in clean, guaranteed Medicare preventive E&M revenue per patient while providing the exact dedicated encounter time needed to perform thorough HCC risk adjustment workups.'
      }
    ],
    relatedArticleIds: ['hcc-pre-visit-plan', 'engagement-encounters']
  },
  {
    id: 'outcomes-lab-trends',
    title: 'Longitudinal Biomarker Lab Trends & Risk Alerts',
    routePath: '/outcomes/lab-trends',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Physician', 'Care Coordinator', 'Medical Director'],
    overview: 'Interactive biomarker monitoring station displaying longitudinal graphs for critical clinical observations (`HbA1c`, `eGFR`, `LDL-C`, `Systolic/Diastolic BP`). Highlights critical value excursions.',
    features: [
      {
        featureName: 'Multi-Biomarker Longitudinal Trend Chart',
        description: 'Interactive line graph plotting patient or cohort average lab values over a 3 to 5 year time horizon, overlaid with shaded green normal reference zones and red high-risk boundaries.',
        uiLocation: 'Main Center Trend Chart',
        snippetType: 'svg',
        uiSnippet: `<svg viewBox="0 0 350 100" className="w-full h-24 stroke-rose-500">
  <rect x="0" y="50" width="350" height="50" className="fill-emerald-500/10 stroke-none" />
  <line x1="0" y1="50" x2="350" y2="50" className="stroke-emerald-500 stroke-dasharray-2" strokeWidth="1" />
  <polyline points="0,30 70,40 140,25 210,35 280,45 350,20" strokeWidth="2.5" fill="none" />
  <circle cx="350" cy="20" r="4" className="fill-rose-600" />
  <text x="310" y="15" className="text-[10px] fill-rose-600 font-bold">HbA1c: 9.4% (Critical)</text>
</svg>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Biomarker Clinical Excursion & Risk Categorization Engine',
        clinicalOrBusinessLogic: 'Evaluates incoming LOINC-coded laboratory results against clinical specialty society guidelines (ADA for HbA1c, ACC/AHA for Blood Pressure and LDL, KDIGO for eGFR).',
        formula: 'If LOINC == "4548-4 (HbA1c)" and Value > 9.0% => Assign Flag "Uncontrolled / Critical Risk", trigger immediate clinical workup task.',
        dataSources: ['HL7 ORU Lab Result Interfaces (Quest / Labcorp / Hospital Labs)']
      }
    ],
    workflows: [
      {
        actionName: 'Rapid Intercept on Critical Renal Function Decline (eGFR Drop)',
        userRoles: ['Physician', 'Care Coordinator'],
        steps: [
          'Open Lab Trends and select the `eGFR (Estimated Glomerular Filtration Rate)` biomarker tab.',
          'Filter for patients whose eGFR has dropped by > 15 mL/min/1.73m² over the prior 12-month window (`Rapid Decliners`).',
          'Inspect the chart of a diabetic patient whose eGFR dropped from 58 to 38 mL/min (entering Stage 3b CKD).',
          'Verify current medications and immediately discontinue nephrotoxic NSAIDs.',
          'Initiate SGLT2 inhibitor renal protective therapy (`Dapagliflozin / Empagliflozin`) and place a standing referral to Nephrology.'
        ],
        downstreamImpact: 'Preserves residual kidney function, delays or prevents end-stage renal disease (ESRD) dialysis, and avoids catastrophic $100,000+ annual dialysis expenditures.'
      }
    ],
    relatedArticleIds: ['outcomes-lab-cadence', 'chronic-risk']
  },
  {
    id: 'outcomes-medication-refills',
    title: 'Medication Refills & PDC Adherence Tracking',
    routePath: '/outcomes/medication-refills',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Care Coordinator', 'Pharmacist', 'Medical Director'],
    overview: 'Monitors chronic medication adherence using Proportion of Days Covered (PDC) methodologies across core maintenance drug classes (`RAAS Antagonists`, `Statins`, `Oral Diabetes Medications`).',
    features: [
      {
        featureName: 'PDC Adherence Scorecard Table',
        description: 'Sortable patient table displaying each chronic medication, current calculated PDC percentage, exact number of gap days without medication, and preferred pharmacy details.',
        uiLocation: 'Main Adherence Roster Table',
        snippetType: 'jsx',
        uiSnippet: `<table className="w-full text-xs text-left border">
  <tr className="bg-muted font-bold"><th className="p-2">Patient</th><th className="p-2">Drug Class</th><th className="p-2">PDC Score</th><th className="p-2">Adherence Status</th></tr>
  <tr><td className="p-2 font-medium">Arthur Pendelton</td><td className="p-2 font-mono">RAAS (Lisinopril 20mg)</td><td className="p-2 text-rose-600 font-bold">68.2%</td><td className="p-2"><Badge variant="destructive">Non-Adherent (32d gap)</Badge></td></tr>
  <tr><td className="p-2 font-medium">Eleanor Vance</td><td className="p-2 font-mono">Statin (Atorvastatin 40mg)</td><td className="p-2 text-emerald-600 font-bold">94.1%</td><td className="p-2"><Badge className="bg-emerald-500/20 text-emerald-700">Adherent</Badge></td></tr>
</table>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Proportion of Days Covered (PDC) Calculation Formula',
        clinicalOrBusinessLogic: 'The CMS Star Rating and HEDIS gold standard metric for evaluating chronic medication compliance. Patients achieving PDC >= 80% across the measurement period are classified as adherent.',
        formula: 'PDC % = (Number of Unique Calendar Days Covered by Prescription Fills in Period / Total Days in Measurement Period) × 100',
        dataSources: ['NCPDP Pharmacy Claims Feed', 'Surescripts Medication History Feed']
      }
    ],
    workflows: [
      {
        actionName: 'Enrolling Non-Adherent Patients into 90-Day Mail Order & MedSync',
        userRoles: ['Care Coordinator', 'Pharmacist'],
        steps: [
          'Filter the Medication Refills dashboard for `Drug Class: Statins` and `PDC Score: 60% to 79% (Borderline Non-Adherent)`.',
          'Sort by patients who are currently filling 30-day supplies at retail brick-and-mortar pharmacies.',
          'Call the patient or send an interactive portal message explaining that switching to a 90-day mail-order supply eliminates monthly pharmacy trips and lowers copays.',
          'Coordinate with the attending clinician to convert the prescription order from a 30-day fill (`#30 with 3 refills`) to a 90-day maintenance fill (`#90 with 3 refills`).'
        ],
        downstreamImpact: 'Instantly elevates practice PDC adherence scores above the 80% Star Rating threshold, unlocking substantial Medicare Advantage quality bonus pools.'
      }
    ],
    relatedArticleIds: ['engagement-prescriptions', 'engagement-prescriptions-breakdown']
  },
  {
    id: 'outcomes-lab-cadence',
    title: 'Lab Cadence & Periodicity Compliance Tracking',
    routePath: '/outcomes/lab-cadence',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Care Coordinator', 'Physician'],
    overview: 'Monitors testing cadence regularity for patients with chronic disease, verifying that recommended laboratory monitoring occurs at guideline-defined periodicity (e.g., semi-annual vs. quarterly HbA1c testing).',
    features: [
      {
        featureName: 'Cadence Periodicity Compliance Grid',
        description: 'Patient status grid showing required testing cadence (`Diabetic HbA1c: 2x / Year if Controlled; 4x / Year if Uncontrolled`), last test date, next due date, and cadence status (`On Cadence` vs `Cadence Broken`).',
        uiLocation: 'Main Cadence Status Table',
        snippetType: 'jsx',
        uiSnippet: `<div className="p-3 bg-muted/30 border rounded text-xs flex justify-between items-center font-mono">
  <div><span className="font-bold text-foreground font-sans">Eleanor Vance (Uncontrolled Diabetes - HbA1c 9.4%)</span> <p className="text-muted-foreground text-[11px]">Required Cadence: Quarterly (Every 90d) • Last Test: 03/14/2026 (116 days ago)</p></div>
  <Badge variant="destructive" className="font-sans">Cadence Broken (Overdue by 26 days)</Badge>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'ADA / ACC Guideline Periodicity Engine',
        clinicalOrBusinessLogic: 'Adjusts testing frequency intervals dynamically based on the patient\'s most recent clinical observation severity.',
        formula: 'If Diagnosis == Diabetes AND Last_HbA1c >= 8.0% => CadenceInterval = 90 Days; If Last_HbA1c < 8.0% => CadenceInterval = 180 Days.',
        dataSources: ['LOINC Lab Results Table', 'EHR Problem List']
      }
    ],
    workflows: [
      {
        actionName: 'Establishing Standing Quarterly Lab Orders for Uncontrolled Patients',
        userRoles: ['Care Coordinator', 'Physician'],
        steps: [
          'Filter Lab Cadence by `Status: Cadence Broken` and `Diagnosis: Diabetes (`HbA1c > 8.0%`)`.',
          'Select all 42 uncontrolled diabetic patients whose testing cadence has lapsed past 90 days.',
          'Click "Create Standing Quarterly Lab Requisition". The system authorizes a recurring standing lab order valid for 12 months at the patient\'s preferred clinical laboratory (`Quest` / `Labcorp`).',
          'Dispatch automated SMS scheduling reminders 14 days before each quarterly due date.'
        ],
        downstreamImpact: 'Ensures continuous clinical oversight of high-risk patients, eliminating gaps in diagnostic data and driving rapid clinical intervention when control slips.'
      }
    ],
    relatedArticleIds: ['outcomes-lab-trends', 'utilization-gaps']
  },
  {
    id: 'outcomes-report-builder',
    title: 'Custom Clinical & Operational Report Builder',
    routePath: '/outcomes/report-builder',
    dashboardGroup: 'Patient Outcomes',
    targetAudience: ['Practice Manager', 'Quality Officer', 'Data Analyst'],
    overview: 'Interactive drag-and-drop report generator. Enables users to build custom multi-column queries across demographics, diagnoses, vital observations, lab results, medications, and financial metrics with one-click CSV/Excel export.',
    features: [
      {
        featureName: 'Drag-and-Drop Column Picker & Query Designer',
        description: 'Split-screen builder where users drag data attributes (`Patient Name`, `DOB`, `Attending PCP`, `Last HbA1c`, `Last Systolic BP`, `Active RAF Score`) from the field library into their custom report schema.',
        uiLocation: 'Top Split-Screen Query Builder Panel',
        snippetType: 'jsx',
        uiSnippet: `<div className="grid grid-cols-3 gap-3 text-xs p-3 bg-card rounded-xl border font-mono">
  <div className="p-2 bg-muted rounded border"><span className="font-sans font-bold block mb-1">Available Fields</span> • Patient Demographics <br/> • LOINC Observations <br/> • Active Medications</div>
  <div className="col-span-2 p-2 bg-primary/5 rounded border border-primary/30"><span className="font-sans font-bold text-primary block mb-1">Selected Report Columns (Ordered)</span> [1. Patient Name] → [2. DOB] → [3. Attending PCP] → [4. Last HbA1c Value] → [5. Last HbA1c Date]</div>
</div>`
      }
    ],
    logicAndMetrics: [
      {
        metricName: 'Secure Parameterized Query Abstraction Engine',
        clinicalOrBusinessLogic: 'Translates user UI field selections, sorting preferences, and filter criteria (`WHERE Age > 65 AND eGFR < 45`) into optimized, SQL-injection-proof aggregations respecting RBAC row-level security.',
        formula: 'ExecuteQuery(Fields: UserSelectedColumns, Filters: UserAbstractSyntaxTree, UserRBACRole: CurrentRole)',
        dataSources: ['EHR Master Relational Database (`Patients`, `Encounters`, `Observations`, `Billing`)']
      }
    ],
    workflows: [
      {
        actionName: 'Designing and Scheduling a Monthly High-Risk CKD Registry Export',
        userRoles: ['Quality Officer', 'Practice Manager'],
        steps: [
          'Open Report Builder and select fields: `Patient Name`, `DOB`, `PCP`, `Last eGFR Value`, `Last Urine Microalbumin`, and `ACE/ARB Rx Status`.',
          'Add Filter Criteria: `Last eGFR < 45 mL/min/1.73m² (Stage 3b/4 CKD)`.',
          'Click "Preview Report" to verify query results across the active patient database.',
          'Click "Save & Schedule Template". Name the report `"Monthly Stage 3b/4 CKD Registry"`.',
          'Configure delivery schedule: `Email encrypted CSV export to carecoordinators@healthcompiler.com on the 1st of every month at 06:00 AM`.'
        ],
        downstreamImpact: 'Automates clinical quality surveillance, providing care coordinators with fresh actionable registries without requiring manual database exports.'
      }
    ],
    relatedArticleIds: ['outcomes-dashboard', 'outcomes-patient-groups']
  }
];
