import React from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  Layers, 
  Calendar, 
  DollarSign, 
  HeartPulse, 
  Workflow, 
  Stethoscope, 
  Receipt, 
  Database,
  ArrowRight,
  Sparkles,
  Filter,
  Download,
  Share2,
  Check,
  X,
  ChevronRight
} from "../../lib/icons";
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface WikiComponentDemoProps {
  featureName: string;
  articleId?: string;
  fallbackSnippet?: string;
}

/**
 * Developer Component Registry
 * Renders exact, bug-free React components showing the physical UI layout, props, and visual structure
 * of dashboard sections referred to in the product documentation.
 */
export function WikiComponentDemo({ featureName, articleId = '', fallbackSnippet = '' }: WikiComponentDemoProps) {
  const normalized = `${articleId}::${featureName}`.toLowerCase();

  // ---------------------------------------------------------
  // 1. ENGAGEMENT & ANALYTICS UI COMPONENTS
  // ---------------------------------------------------------
  if (normalized.includes('touch-ratio') || normalized.includes('touch ratio') || featureName.toLowerCase().includes('touch')) {
    return (
      <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">Component: &lt;TouchRatioGauge /&gt;</span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
            Target &gt;= 1.8x PMPM
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg border text-center space-y-1">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Current Touch Ratio</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono">2.4x</div>
            <div className="text-[10px] text-emerald-600 flex items-center justify-center gap-1">
              <TrendingUp className="size-3" /> +14% vs last quarter
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border text-center space-y-1">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Encounters</div>
            <div className="text-2xl font-bold text-foreground font-mono">1,482</div>
            <div className="text-[10px] text-muted-foreground">Across 618 active patients</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border text-center space-y-1">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Benchmark Tier</div>
            <div className="text-2xl font-bold text-primary font-mono">Tier 1</div>
            <div className="text-[10px] text-primary font-medium">Shared savings eligible</div>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes('after hours') || featureName.toLowerCase().includes('after hours')) {
    return (
      <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-muted-foreground">Component: &lt;AfterHoursDistributionChart /&gt;</span>
          <Badge variant="outline" className="text-[10px] font-mono bg-amber-500/10 text-amber-700 border-amber-500/30">
            eCQM Access Metric
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-2"><Clock className="size-4 text-amber-500" /> Weekday Evenings (6 PM - 8 AM)</span>
            <span className="font-mono font-bold">64.2% (312 encounters)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '64%' }} />
          </div>
          <div className="flex items-center justify-between text-xs font-medium pt-1">
            <span className="flex items-center gap-2"><Calendar className="size-4 text-primary" /> Weekend & Holiday On-Call</span>
            <span className="font-mono font-bold">35.8% (174 encounters)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '36%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes('care episodes') || featureName.toLowerCase().includes('care episode') || featureName.toLowerCase().includes('funnel')) {
    return (
      <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-muted-foreground">Component: &lt;CareEpisodeFunnelTable /&gt;</span>
          <span className="text-[11px] font-mono text-muted-foreground">Cohorts: N = 3,420</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono">STAGE 1</div>
            <div className="font-bold text-foreground">Intake / Triage</div>
            <div className="text-base font-mono font-bold text-primary">100%</div>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono">STAGE 2</div>
            <div className="font-bold text-foreground">Active Care Plan</div>
            <div className="text-base font-mono font-bold text-emerald-600">84.2%</div>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono">STAGE 3</div>
            <div className="font-bold text-foreground">Follow-Up Complete</div>
            <div className="text-base font-mono font-bold text-emerald-600">76.8%</div>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono">STAGE 4</div>
            <div className="font-bold text-foreground">Resolution / Closed</div>
            <div className="text-base font-mono font-bold text-muted-foreground">68.5%</div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 2. HCC RISK ADJUSTMENT UI COMPONENTS
  // ---------------------------------------------------------
  if (normalized.includes('raf') || normalized.includes('hcc') || featureName.toLowerCase().includes('coding') || featureName.toLowerCase().includes('pre-visit')) {
    return (
      <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-muted-foreground">Component: &lt;HCCRiskAdjustmentComparison /&gt;</span>
          <Badge variant="outline" className="text-[10px] font-mono bg-blue-500/10 text-blue-700 border-blue-500/30">
            CMS-HCC V28 Model
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold px-2 py-1 bg-background rounded border text-foreground">HCC 19</span>
              <div>
                <div className="font-bold text-foreground">Diabetes without Complication</div>
                <div className="text-[11px] text-muted-foreground">ICD-10: E11.9</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-emerald-600">+0.104 RAF</div>
              <div className="text-[10px] text-muted-foreground">Status: Documented</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold px-2 py-1 bg-amber-500/10 text-amber-800 rounded border border-amber-500/20">HCC 18</span>
              <div>
                <div className="font-bold text-foreground">Diabetes with Chronic Complication (Nephropathy)</div>
                <div className="text-[11px] text-muted-foreground">ICD-10: E11.22 (Suspected via eGFR &lt; 45)</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-amber-600">+0.331 RAF</div>
              <div className="text-[10px] font-semibold text-amber-700">Delta: +0.227 RAF</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 3. CLINICAL OUTCOMES & POPULATION HEALTH UI COMPONENTS
  // ---------------------------------------------------------
  if (normalized.includes('screenings') || normalized.includes('vaccin') || normalized.includes('outcomes') || featureName.toLowerCase().includes('hedis')) {
    return (
      <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-muted-foreground">Component: &lt;QualityMeasureProgressBoard /&gt;</span>
          <span className="text-[11px] font-mono text-muted-foreground">HEDIS MY2026</span>
        </div>
        <div className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-foreground">Colorectal Cancer Screening (COL)</span>
              <span className="font-mono font-bold text-primary">78.4% (Target: 75%)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78.4%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-foreground">Breast Cancer Screening (BCS-E)</span>
              <span className="font-mono font-bold text-amber-600">71.2% (Target: 74%)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '71.2%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-foreground">HbA1c Poor Control (&gt; 9.0%) - Inverse Measure</span>
              <span className="font-mono font-bold text-emerald-600">14.8% (Target: &lt; 18%)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '14.8%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 4. ADMINISTRATION & SYSTEM UI COMPONENTS
  // ---------------------------------------------------------
  if (normalized.includes('admin') || normalized.includes('batch') || normalized.includes('survey') || featureName.toLowerCase().includes('integration')) {
    return (
      <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-muted-foreground">Component: &lt;IntegrationBatchStatusTable /&gt;</span>
          <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-700">
            Active Pipeline
          </Badge>
        </div>
        <div className="border rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-muted/60 font-mono text-[11px] uppercase text-muted-foreground border-b">
              <tr>
                <th className="p-2.5">Batch ID</th>
                <th className="p-2.5">Source System</th>
                <th className="p-2.5">Records Processed</th>
                <th className="p-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono">
              <tr>
                <td className="p-2.5 font-bold text-foreground">B-88492</td>
                <td className="p-2.5">Epic EHR (HL7 v2.5)</td>
                <td className="p-2.5">14,210 / 14,210</td>
                <td className="p-2.5 text-right"><Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px]">SUCCESS</Badge></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-foreground">B-88493</td>
                <td className="p-2.5">AthenaHealth (FHIR R4)</td>
                <td className="p-2.5">2,104 / 2,150</td>
                <td className="p-2.5 text-right"><Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-[10px]">RETRYING (46)</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 5. DEFAULT GENERIC DEVELOPER UI SPECIFICATION BOX
  // ---------------------------------------------------------
  return (
    <div className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="text-xs font-mono text-muted-foreground">Component Specification: &lt;{featureName.replace(/\s+/g, '')}Section /&gt;</span>
        <span className="text-[11px] font-mono text-muted-foreground">React / Tailwind / shadcn</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-muted/30 rounded-lg border space-y-1.5">
          <div className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" /> UI Layout Structure
          </div>
          <p className="text-muted-foreground text-[12px] leading-relaxed">
            Responsive CSS grid container with interactive metric summary headers, data sorting filters, and drill-down table rows.
          </p>
        </div>
        <div className="p-3.5 bg-muted/30 rounded-lg border space-y-1.5">
          <div className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
            <Database className="size-3.5 text-primary" /> Data Source Props
          </div>
          <p className="text-muted-foreground text-[12px] leading-relaxed font-mono">
            props: &#123; cohortId: string; dateRange: DateInterval; filters: FilterState &#125;
          </p>
        </div>
      </div>
      {fallbackSnippet && (
        <div className="pt-2">
          <div className="text-[11px] font-mono text-muted-foreground mb-1.5">Raw Structural Reference Snippet:</div>
          <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800">
            <code>{fallbackSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
