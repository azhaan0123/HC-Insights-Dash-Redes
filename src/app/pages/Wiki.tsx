import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router';
import { 
  ALL_WIKI_ARTICLES, 
  searchWikiArticles, 
  WikiArticle 
} from '../../lib/wiki';
import { WikiArticleView } from '../components/wiki/WikiArticleView';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Search, 
  Filter, 
  Terminal, 
  FileCode2, 
  BookOpen, 
  ChevronRight, 
  ExternalLink, 
  ArrowLeft,
  Database,
  Layers,
  Calculator,
  Workflow
} from 'lucide-react';

const DASHBOARD_GROUPS = [
  'All',
  'Analytics',
  'HCC Insights',
  'ACO Insights',
  'Patient Outcomes',
  'MIPS Nexus',
  'Employer Analytics',
  'Administration',
  'Authentication & Support'
] as const;

type DashboardGroup = typeof DASHBOARD_GROUPS[number];

/**
 * Full-Page Technical Specification & README Portal (/wiki)
 * Developer documentation hub featuring multi-column navigation, instant route search,
 * mathematical formulas, and live React component previews.
 */
export default function WikiPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  const activeIdParam = params['*'] || params.specId || searchParams.get('spec') || searchParams.get('id') || null;
  const initialGroupParam = (searchParams.get('group') as DashboardGroup) || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<DashboardGroup>(
    DASHBOARD_GROUPS.includes(initialGroupParam) ? initialGroupParam : 'All'
  );

  const activeArticle = useMemo(() => {
    if (!activeIdParam) return null;
    return ALL_WIKI_ARTICLES.find(a => a.id === activeIdParam) || null;
  }, [activeIdParam]);

  const filteredArticles = useMemo(() => {
    let results = searchQuery.trim() ? searchWikiArticles(searchQuery) : ALL_WIKI_ARTICLES;
    if (selectedGroup !== 'All') {
      results = results.filter(a => a.dashboardGroup === selectedGroup);
    }
    return results;
  }, [searchQuery, selectedGroup]);

  const handleSelectArticle = (articleId: string) => {
    navigate(`/wiki?spec=${articleId}`);
  };

  const handleClearSelection = () => {
    navigate('/wiki');
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-background font-sans text-foreground">
      {/* Top Technical Navigation Header */}
      <div className="px-6 py-4 border-b border-border bg-card flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-muted text-foreground border flex items-center justify-center font-mono font-bold text-sm shadow-xs">
            <Terminal className="size-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-mono font-black text-foreground">
                HealthCompiler Technical Architecture &amp; eCQM Specs
              </h1>
              <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[11px] font-mono font-bold text-primary border border-primary/20">
                v24.0.3
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Complete developer reference: React UI structure, CMS-HCC V28 risk models, eCQM formulas &amp; pipelines ({ALL_WIKI_ARTICLES.length} modules)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeArticle && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="gap-1.5 text-xs font-mono h-8 bg-muted/40"
            >
              <ArrowLeft className="size-3.5" /> Back to Specs Index
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://intercom.help/health-compiler-inc/en', '_blank')}
            className="gap-1.5 text-xs font-mono h-8 bg-muted/40"
          >
            Intercom Portal <ExternalLink className="size-3 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Main Multi-Column Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Index Directory & Search (Width 80 or 96 on Desktop) */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card/50 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search specs, routes, eCQM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 bg-background border border-border rounded-lg text-xs font-mono outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground hover:text-foreground bg-muted px-1.5 py-0.5 rounded border"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {DASHBOARD_GROUPS.map(group => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border ${
                    selectedGroup === group
                      ? 'bg-foreground text-background border-foreground font-bold shadow-xs'
                      : 'bg-muted/60 text-muted-foreground border-transparent hover:border-border hover:text-foreground'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Index List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-muted-foreground">
                No matching specifications found.
              </div>
            ) : (
              filteredArticles.map(art => {
                const isSelected = activeArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => handleSelectArticle(art.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border shrink-0">
                          {art.dashboardGroup.split(' ')[0]}
                        </span>
                        <h4 className="font-mono font-bold text-xs text-foreground truncate">
                          {art.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 font-sans">
                        {art.overview}
                      </p>
                      <div className="text-[10px] font-mono text-muted-foreground/80 truncate">
                        {art.routePath}
                      </div>
                    </div>
                    <ChevronRight className={`size-3.5 shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-primary translate-x-0.5' : 'text-muted-foreground'
                    }`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Spec Viewer or README Overview */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {activeArticle ? (
            <div className="max-w-4xl mx-auto">
              <WikiArticleView 
                article={activeArticle} 
                onSelectArticle={handleSelectArticle} 
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 font-sans">
              {/* README Hero Box */}
              <div className="p-8 bg-card rounded-2xl border border-border space-y-4 shadow-xs">
                <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold uppercase tracking-wider">
                  <FileCode2 className="size-4" /> Technical Documentation Index
                </div>
                <h2 className="text-3xl font-black text-foreground tracking-tight font-mono">
                  HealthCompiler Dashboard Architecture &amp; Data Contracts
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
                  Welcome to the HealthCompiler developer specifications hub. This system documents all 61 front-end views, clinical logic formulas (`RAF`, `HEDIS`, `PMPM`), back-end database schemas (`claims_edw`, `manifest_db`), and live React component mockups.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                  <div className="p-4 bg-muted/30 rounded-xl border space-y-1">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs text-foreground">
                      <Layers className="size-4 text-primary" /> UI Architecture
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Exact React/TypeScript component structures, mount points, and interactive shadcn/Tailwind UI previews.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border space-y-1">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs text-foreground">
                      <Calculator className="size-4 text-amber-500" /> Data &amp; Formulas
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Exact mathematical algorithms, CMS-HCC V28 risk models, eCQM numerator/denominator logic, and database tables.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border space-y-1">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs text-foreground">
                      <Workflow className="size-4 text-emerald-500" /> Event Pipelines
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Step-by-step technical event sequences, RBAC permissions, and downstream clinical &amp; financial impacts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Module Directory Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  Explore Specifications by Module
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DASHBOARD_GROUPS.filter(g => g !== 'All').map(group => {
                    const groupArticles = ALL_WIKI_ARTICLES.filter(a => a.dashboardGroup === group);
                    return (
                      <div 
                        key={group}
                        onClick={() => setSelectedGroup(group)}
                        className="p-5 bg-card hover:bg-muted/40 rounded-xl border border-border transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono mb-1">
                            <span className="font-bold text-primary">{group}</span>
                            <Badge variant="outline" className="text-[10px] font-mono bg-muted text-muted-foreground">
                              {groupArticles.length} specs
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {groupArticles.slice(0, 3).map(a => a.title).join(', ')}...
                          </p>
                        </div>
                        <div className="text-[11px] font-mono font-semibold text-foreground pt-2 border-t border-border/40 flex items-center justify-between">
                          <span>Browse {group}</span>
                          <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
