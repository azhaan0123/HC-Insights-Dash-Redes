export interface WikiMetricLogic {
  metricName: string;
  clinicalOrBusinessLogic: string;
  formula?: string;
  dataSources: string[];
}

export interface WikiFeature {
  featureName: string;
  description: string;
  uiLocation: string;
  /**
   * Embedded code/JSX or SVG string or stylized HTML snippet demonstrating 
   * exactly what UI component or dashboard section this documentation refers to.
   */
  uiSnippet?: string;
  snippetType?: 'jsx' | 'svg' | 'code';
}

export interface WikiWorkflow {
  actionName: string;
  userRoles: string[];
  steps: string[];
  downstreamImpact: string;
}

export interface WikiArticle {
  id: string;
  title: string;
  routePath: string;
  dashboardGroup: 'Analytics' | 'HCC Insights' | 'ACO Insights' | 'Patient Outcomes' | 'Administration' | 'Authentication & Support';
  targetAudience: ('Care Coordinator' | 'Physician' | 'Medical Coder' | 'Practice Manager' | 'Superadmin' | 'Patient App User')[];
  overview: string;
  features: WikiFeature[];
  logicAndMetrics: WikiMetricLogic[];
  workflows: WikiWorkflow[];
  relatedArticleIds: string[];
}
