import React, { useState } from 'react';
import { WikiArticle, WikiFeature } from '../../../lib/wiki/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BookOpen,
  CheckCircle2,
  Code,
  Layers,
  Sparkles,
  Target,
  Workflow,
  ArrowRight,
  Database,
  Calculator,
  Terminal,
  FileCode2,
  GitBranch
} from "../../lib/icons";
import { ALL_WIKI_ARTICLES } from '../../../lib/wiki';
import { WikiComponentDemo } from './WikiComponentRegistry';

interface WikiArticleViewProps {
  article: WikiArticle;
  onSelectArticle?: (articleId: string) => void;
}

/**
 * Developer Technical Spec & README Viewer
 * Styled cleanly for software engineers, data architects, and clinical engineering teams.
 */
export function WikiArticleView({ article, onSelectArticle }: WikiArticleViewProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'logic' | 'workflows'>('features');
  const [codeModes, setCodeModes] = useState<Record<string, boolean>>({});

  const toggleCodeMode = (featureName: string) => {
    setCodeModes(prev => ({ ...prev, [featureName]: !prev[featureName] }));
  };

  const relatedArticles = (article.relatedArticleIds || [])
    .map(id => ALL_WIKI_ARTICLES.find(a => a.id === id))
    .filter(Boolean) as WikiArticle[];

  return (
    <div className="space-y-6 pb-12 font-sans text-foreground">
      {/* Technical Spec README Header */}
      <div className="p-6 bg-card rounded-xl border border-border shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-mono font-bold text-primary border border-primary/20">
              {article.dashboardGroup}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">
              <Terminal className="size-3.5" /> route: {article.routePath}
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Spec ID: {article.id}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl font-mono">
            {article.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {article.overview}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono font-semibold text-muted-foreground">Target Roles:</span>
            {article.targetAudience.map(role => (
              <Badge key={role} variant="secondary" className="font-mono text-[11px] bg-muted text-foreground">
                {role}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-start sm:justify-end gap-1.5 text-muted-foreground font-mono">
            <FileCode2 className="size-3.5 text-primary" /> React / TypeScript / eCQM Engine
          </div>
        </div>
      </div>

      {/* Developer Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg bg-muted p-1 rounded-lg border border-border/60">
          <TabsTrigger value="features" className="gap-1.5 text-xs font-mono font-semibold rounded-md data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Layers className="size-3.5 text-primary" />
            UI Architecture ({article.features.length})
          </TabsTrigger>
          <TabsTrigger value="logic" className="gap-1.5 text-xs font-mono font-semibold rounded-md data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Calculator className="size-3.5 text-amber-500" />
            Data &amp; Formulas ({article.logicAndMetrics.length})
          </TabsTrigger>
          <TabsTrigger value="workflows" className="gap-1.5 text-xs font-mono font-semibold rounded-md data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Workflow className="size-3.5 text-emerald-500" />
            Event Pipeline ({article.workflows.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: UI Architecture & React Rendered Components */}
        <TabsContent value="features" className="space-y-6 pt-4">
          <div className="space-y-5">
            {article.features.map((feature, idx) => {
              const showSource = codeModes[feature.featureName] || false;

              return (
                <div key={idx} className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
                    <div>
                      <h3 className="font-bold font-mono text-base text-foreground flex items-center gap-2">
                        <span className="text-xs font-normal text-muted-foreground font-mono">[{idx + 1}]</span>
                        {feature.featureName}
                      </h3>
                      {feature.uiLocation && (
                        <div className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Target className="size-3.5 text-primary" /> Mount Path: <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">{feature.uiLocation}</code>
                        </div>
                      )}
                    </div>

                    {feature.uiSnippet && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-mono gap-1.5"
                        onClick={() => toggleCodeMode(feature.featureName)}
                      >
                        <Code className="size-3.5 text-primary" />
                        {showSource ? 'View Component Demo' : 'View Raw Source'}
                      </Button>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold font-mono text-foreground uppercase tracking-wider text-[11px] block mb-1">Functional Specification:</span>
                    {feature.description}
                  </div>

                  {/* Component Demo or Raw Code */}
                  <div className="pt-2">
                    <div className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="size-3.5 text-primary" />
                      {showSource ? 'Raw Structural Code Snippet' : 'Interactive React Component Rendering'}
                    </div>

                    {showSource && feature.uiSnippet ? (
                      <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                        <code>{feature.uiSnippet}</code>
                      </pre>
                    ) : (
                      <WikiComponentDemo 
                        featureName={feature.featureName} 
                        articleId={article.id} 
                        fallbackSnippet={feature.uiSnippet} 
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Data & Calculation Logic */}
        <TabsContent value="logic" className="space-y-4 pt-4">
          <div className="space-y-4">
            {article.logicAndMetrics.map((logic, idx) => (
              <div key={idx} className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Calculator className="size-4 text-amber-500" />
                  <h3 className="font-bold font-mono text-base text-foreground">{logic.metricName}</h3>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">Clinical &amp; Business Specification:</div>
                  <p className="text-muted-foreground leading-relaxed bg-muted/40 p-3.5 rounded-lg border border-border/60 font-sans">
                    {logic.clinicalOrBusinessLogic}
                  </p>
                </div>

                {logic.formula && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="size-3.5" /> Mathematical Algorithm &amp; eCQM Formula:
                    </div>
                    <div className="p-3.5 bg-primary/5 text-primary font-mono text-xs sm:text-sm rounded-lg border border-primary/20 overflow-x-auto shadow-inner">
                      {logic.formula}
                    </div>
                  </div>
                )}

                {logic.dataSources && logic.dataSources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                    <span className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Database className="size-3.5 text-muted-foreground" /> Database Tables / Schemas:
                    </span>
                    {logic.dataSources.map((ds, dIdx) => (
                      <Badge key={dIdx} variant="outline" className="font-mono text-xs bg-muted/60 text-foreground">
                        {ds}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Execution Sequence & Workflows */}
        <TabsContent value="workflows" className="space-y-4 pt-4">
          <div className="space-y-4">
            {article.workflows.map((wf, idx) => (
              <div key={idx} className="p-5 bg-card rounded-xl border border-border shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Workflow className="size-4 text-emerald-500" />
                    <h3 className="font-bold font-mono text-base text-foreground">{wf.actionName}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {wf.userRoles.map(r => (
                      <Badge key={r} variant="outline" className="font-mono text-[11px] bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                    Technical Execution Pipeline:
                  </div>
                  <div className="space-y-2 font-mono text-xs sm:text-sm">
                    {wf.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-border/60">
                        <span className="size-6 rounded-md bg-foreground text-background font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="text-foreground leading-relaxed pt-0.5 font-sans">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {wf.downstreamImpact && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3 text-xs text-emerald-800">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-mono font-bold mb-1 uppercase tracking-wider text-[11px]">Downstream Data &amp; Financial Impact:</strong>
                      <span className="font-sans leading-relaxed">{wf.downstreamImpact}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Specifications README Footer */}
      {relatedArticles.length > 0 && (
        <div className="pt-8 border-t border-border space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
            <GitBranch className="size-4 text-primary" /> Related Technical Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedArticles.map(rel => (
              <button
                key={rel.id}
                onClick={() => onSelectArticle && onSelectArticle(rel.id)}
                className="p-4 bg-card hover:bg-muted/50 rounded-xl border text-left transition-all hover:border-primary/50 flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-block font-mono text-[10px] mb-2 px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    {rel.dashboardGroup}
                  </span>
                  <div className="font-bold font-mono text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {rel.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 font-sans leading-relaxed">
                    {rel.overview}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-primary mt-3 pt-2.5 border-t border-border/40">
                  Inspect Spec <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
