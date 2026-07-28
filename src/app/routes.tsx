import { createBrowserRouter, Navigate } from "react-router";
import { AppShell } from "./components/layout/AppShell";
import Onboarding from "./pages/auth/Onboarding";
import Login from "./pages/auth/Login";
import SupportPage from "./pages/Support";
import Home from "./pages/Home";
import ActionCentreOverview from "./pages/action-centre/ActionCentreOverview";
import EngagementOverview from "./pages/engagement/Overview";
import Encounters from "./pages/engagement/Encounters";
import ActivePatients from "./pages/engagement/ActivePatients";
import TotalActivePatients from "./pages/engagement/TotalActivePatients";
import TotalAfterHoursEncounters from "./pages/engagement/TotalAfterHoursEncounters";
import TotalActiveManifestMembers from "./pages/engagement/TotalActiveManifestMembers";
import TotalAfterHoursPrescriptions from "./pages/engagement/TotalAfterHoursPrescriptions";
import TotalMessages from "./pages/engagement/TotalMessages";
import MessageTypesBreakdown from "./pages/engagement/MessageTypesBreakdown";
import TotalAfterHoursMessages from "./pages/engagement/TotalAfterHoursMessages";
import PatientTouchRatio from "./pages/engagement/PatientTouchRatio";
import EncounterTypesBreakdown from "./pages/engagement/EncounterTypesBreakdown";
import CareEpisodesBreakdown from "./pages/engagement/CareEpisodesBreakdown";
import PrescriptionOrders from "./pages/engagement/PrescriptionOrders";
import PrescriptionBreakdown from "./pages/engagement/PrescriptionBreakdown";
import DigitalEngagement from "./pages/engagement/DigitalEngagement";
import CostSavings from "./pages/CostSavings";
import UtilizationGaps from "./pages/UtilizationGaps";
import ChronicRisk from "./pages/ChronicRisk";
import ClaimsUtilization from "./pages/ClaimsUtilization";
import ClaimsBillingReport from "./pages/ClaimsBillingReport";
import CoordinatedCare from "./pages/CoordinatedCare";
import Communication from "./pages/Communication";
import Marketing from "./pages/Marketing";
import Survey from "./pages/Survey";
import DesignSystem from "./pages/DesignSystem";
import AskHC from "./pages/AskHC";
import HccLayout from "./pages/hcc/HccLayout";
import HccOverview from "./pages/hcc/Overview";
import HccPatientList from "./pages/hcc/PatientList";
import HccPreVisitPlan from "./pages/hcc/PreVisitPlan";
import HccBulkAudit from "./pages/hcc/BulkAudit";
import HccCodingQueue from "./pages/hcc/CodingQueue";
import WikiPage from "./pages/Wiki";

// Admin Imports
import ManageUsers from "./pages/admin/ManageUsers";
import OnboardingManagement from "./pages/admin/OnboardingManagement";
import ManageOrganization from "./pages/admin/ManageOrganization";
import OrgPatientCounts from "./pages/admin/OrgPatientCounts";
import InboundIntegrationBatches from "./pages/admin/InboundIntegrationBatches";
import SurveyConfiguration from "./pages/admin/SurveyConfiguration";
import SurveyTemplates from "./pages/admin/SurveyTemplates";
import AdminAuditLog from "./pages/admin/AuditLog";

// ACO Insights Imports
import AcoLayout from "./pages/aco/AcoLayout";
import AcoOverview from "./pages/aco/AcoOverview";
import AcoJourney from "./pages/aco/AcoJourney";
import AcoProviderPerformance from "./pages/aco/AcoProviderPerformance";
import AcoGapsTracker from "./pages/aco/AcoGapsTracker";
import AcoUtilization from "./pages/aco/AcoUtilization";
import AcoReports from "./pages/aco/AcoReports";

// MIPS Nexus Imports
import MipsLayout from "./pages/mips/MipsLayout";
import MipsDashboard from "./pages/mips/MipsDashboard";
import {
  MipsAiAssistantPage,
  MipsQualityMeasuresPage,
  MipsCostPerformancePage,
  MipsInteroperabilityPage,
  MipsImprovementActivitiesPage,
  MipsProviderComparisonPage,
  MipsReportsPage,
} from "./pages/mips/MipsSubPages";

// Employer Analytics Imports
import EmployerLayout from "./pages/employer/EmployerLayout";
import EmployerOverview from "./pages/employer/EmployerOverview";
import {
  EmployerEnrollmentPage,
  EmployerFinancialPage,
  EmployerChronicPage,
  EmployerHighCostPage,
  EmployerBenchmarkingPage,
} from "./pages/employer/EmployerSubPages";

// Outcomes Imports
import OutcomesLayout from "./pages/outcomes/OutcomesLayout";
import DashboardOverview from "./pages/outcomes/DashboardOverview";
import PatientGroups from "./pages/outcomes/PatientGroups";
import ScreeningsDue from "./pages/outcomes/ScreeningsDue";
import Vaccinations from "./pages/outcomes/Vaccinations";
import Appointments from "./pages/outcomes/Appointments";
import LabTrends from "./pages/outcomes/LabTrends";
import MedicationRefills from "./pages/outcomes/MedicationRefills";
import LabCadence from "./pages/outcomes/LabCadence";
import ReportBuilder from "./pages/outcomes/ReportBuilder";
import { ClassicUtilizationGaps } from "./pages/action-centre-classic/ClassicUtilizationGaps";
import { ClassicHome } from "./pages/action-centre-classic/ClassicHome";

export const router = createBrowserRouter([
  {
    path: "/support",
    Component: SupportPage,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/action-centre-classic",
    element: <Navigate to="/utilization-gaps-classic" replace />,
  },
  {
    path: "/action-centre-classic/:cohortId",
    element: <Navigate to="/utilization-gaps-classic" replace />,
  },
  {
    path: "/utilization-gaps-classic",
    Component: ClassicUtilizationGaps,
  },
  {
    path: "/home-classic",
    Component: ClassicHome,
  },
  {
    path: "/wiki",
    Component: WikiPage,
  },
  {
    path: "/wiki/*",
    Component: WikiPage,
  },
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", Component: Home },
      { path: "action-centre", element: <Navigate to="/utilization-gaps" replace /> },
      { path: "engagement", Component: EngagementOverview },
      { path: "engagement/active-patients", Component: ActivePatients },
      { path: "engagement/total-active-patients", Component: TotalActivePatients },
      { path: "engagement/after-hours-encounters", Component: TotalAfterHoursEncounters },
      { path: "engagement/total-active-manifest-members", Component: TotalActiveManifestMembers },
      { path: "engagement/patient-touch-ratio", Component: PatientTouchRatio },
      { path: "engagement/encounters", Component: Encounters },
      { path: "engagement/encounter-types-breakdown", Component: EncounterTypesBreakdown },
      { path: "engagement/care-episodes-breakdown", Component: CareEpisodesBreakdown },
      { path: "engagement/prescriptions", Component: PrescriptionOrders },
      { path: "engagement/after-hours-prescriptions", Component: TotalAfterHoursPrescriptions },
      { path: "engagement/prescriptions-breakdown", Component: PrescriptionBreakdown },
      { path: "engagement/digital-engagement", Component: DigitalEngagement },
      { path: "engagement/messages", Component: TotalMessages },
      { path: "engagement/message-types-breakdown", Component: MessageTypesBreakdown },
      { path: "engagement/after-hours-messages", Component: TotalAfterHoursMessages },
      { path: "cost-savings", Component: CostSavings },
      { path: "utilization-gaps", Component: UtilizationGaps },
      { path: "chronic-risk", Component: ChronicRisk },
      { path: "claims", Component: ClaimsUtilization },
      { path: "billing", Component: ClaimsBillingReport },
      { path: "coordinated-care", Component: CoordinatedCare },
      { path: "communication", Component: Communication },
      { path: "marketing", Component: Marketing },
      { path: "survey", Component: Survey },
      { path: "design-system", Component: DesignSystem },
      { path: "ask-hc", Component: AskHC },
      { path: "ask-ai", element: <Navigate to="/ask-hc" replace /> },
      {
        path: "employer",
        Component: EmployerLayout,
        children: [
          { index: true, element: <Navigate to="/employer/overview" replace /> },
          { path: "overview", Component: EmployerOverview },
          { path: "enrollment", Component: EmployerEnrollmentPage },
          { path: "financial", Component: EmployerFinancialPage },
          { path: "chronic", Component: EmployerChronicPage },
          { path: "high-cost", Component: EmployerHighCostPage },
          { path: "benchmarking", Component: EmployerBenchmarkingPage },
        ],
      },
      {
        path: "hcc",
        Component: HccLayout,
        children: [
          { index: true, element: <Navigate to="/hcc/overview" replace /> },
          { path: "overview", Component: HccOverview },
          { path: "patient-list", Component: HccPatientList },
          { path: "pre-visit-plan", Component: HccPreVisitPlan },
          { path: "coding-queue", Component: HccCodingQueue },
          { path: "bulk-audit", Component: HccBulkAudit },
        ],
      },
      {
        path: "aco",
        Component: AcoLayout,
        children: [
          { index: true, element: <Navigate to="/aco/overview" replace /> },
          { path: "overview", Component: AcoOverview },
          { path: "journey", Component: AcoJourney },
          { path: "provider-performance", Component: AcoProviderPerformance },
          { path: "gaps", Component: AcoGapsTracker },
          { path: "utilization", Component: AcoUtilization },
          { path: "reports", Component: AcoReports },
        ],
      },
      {
        path: "outcomes",
        Component: OutcomesLayout,
        children: [
          { index: true, element: <Navigate to="/outcomes/dashboard" replace /> },
          { path: "dashboard", Component: DashboardOverview },
          { path: "patient-groups", Component: PatientGroups },
          { path: "screenings", Component: ScreeningsDue },
          { path: "vaccinations", Component: Vaccinations },
          { path: "appointments", Component: Appointments },
          { path: "lab-trends", Component: LabTrends },
          { path: "medication-refills", Component: MedicationRefills },
          { path: "lab-cadence", Component: LabCadence },
          { path: "report-builder", Component: ReportBuilder },
        ],
      },
      {
        path: "mips",
        Component: MipsLayout,
        children: [
          { index: true, element: <Navigate to="/mips/dashboard" replace /> },
          { path: "dashboard", Component: MipsDashboard },
          { path: "ai-assistant", Component: MipsAiAssistantPage },
          { path: "quality-measures", Component: MipsQualityMeasuresPage },
          { path: "cost-performance", Component: MipsCostPerformancePage },
          { path: "interoperability", Component: MipsInteroperabilityPage },
          { path: "improvement-activities", Component: MipsImprovementActivitiesPage },
          { path: "provider-comparison", Component: MipsProviderComparisonPage },
          { path: "reports", Component: MipsReportsPage },
        ],
      },
      {
        path: "admin",
        children: [
          { index: true, element: <Navigate to="/admin/users" replace /> },
          { path: "users", Component: ManageUsers },
          { path: "onboarding", Component: OnboardingManagement },
          { path: "organization", Component: ManageOrganization },
          { path: "patient-counts", Component: OrgPatientCounts },
          { path: "integration-batches", Component: InboundIntegrationBatches },
          { path: "survey-config", Component: SurveyConfiguration },
          { path: "templates", Component: SurveyTemplates },
          { path: "audit-log", Component: AdminAuditLog },
        ],
      },
      { path: "*", element: <Navigate to="/engagement" replace /> },
    ],
  },
]);
