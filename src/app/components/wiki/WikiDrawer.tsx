import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  BookOpen,
  Search,
  ArrowLeft,
  Filter,
  ExternalLink,
  ChevronRight,
  FileCode2,
  Terminal,
  FileText
} from 'lucide-react';
import { ALL_WIKI_ARTICLES, searchWikiArticles, WikiArticle } from '../../../lib/wiki';
import { WikiArticleView } from './WikiArticleView';

const DASHBOARD_GROUPS = [
  'All',
  'Analytics',
  'HCC Insights',
  'ACO Insights',
  'Patient Outcomes',
  'Administration',
  'Authentication & Support'
] as const;

type DashboardGroup = typeof DASHBOARD_GROUPS[number];

interface WikiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialArticleId?: string;
}

/**
 * Technical Documentation Drawer & API Reference
 * Developer documentation portal with instant route search and module specifications.
 */
export function WikiDrawer({ isOpen, onClose, initialArticleId }: WikiDrawerProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<DashboardGroup>('All');
  const [isDirectoryView, setIsDirectoryView] = useState(true);

  useEffect(() => {
    if (initialArticleId) {
      setSelectedArticleId(initialArticleId);
      setIsDirectoryView(false);
    } else {
      setIsDirectoryView(true);
      setSelectedArticleId(null);
    }
  }, [initialArticleId, isOpen]);

  const filteredArticles = React.useMemo(() => {
    let results = searchQuery.trim() ? searchWikiArticles(searchQuery) : ALL_WIKI_ARTICLES;
    if (selectedGroup !== 'All') {
      results = results.filter(a => a.dashboardGroup === selectedGroup);
    }
    return results;
  }, [searchQuery, selectedGroup]);

  const activeArticle = ALL_WIKI_ARTICLES.find(a => a.id === selectedArticleId);

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsDirectoryView(false);
  };

  const handleBackToDirectory = () => {
    setIsDirectoryView(true);
    setSelectedArticleId(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-3xl lg:max-w-4xl p-0 flex flex-col bg-background border-l border-border shadow-2xl overflow-hidden font-sans"
      >
        {/* Technical Spec Header Bar */}
        <SheetHeader className="px-6 py-4 border-b border-border bg-card flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {(!isDirectoryView && activeArticle) ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 pl-2 pr-3 text-muted-foreground hover:text-foreground font-mono text-xs"
                onClick={handleBackToDirectory}
              >
                <ArrowLeft className="size-4" /> [Back to Specs Index]
              </Button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-md bg-muted text-foreground border flex items-center justify-center font-mono font-bold text-xs">
                  <Terminal className="size-4 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-sm font-mono font-bold text-foreground flex items-center gap-2">
                    HealthCompiler Technical Documentation &amp; eCQM Specs
                  </SheetTitle>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Developer Architecture, Formula Reference &amp; React UI Mockups ({ALL_WIKI_ARTICLES.length} modules)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pr-8">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 text-xs font-mono h-8 bg-muted/40"
              onClick={() => window.open('https://intercom.help/health-compiler-inc/en', '_blank')}
            >
              Intercom Portal <ExternalLink className="size-3 text-muted-foreground" />
            </Button>
          </div>
        </SheetHeader>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isDirectoryView && activeArticle ? (
            <WikiArticleView 
              article={activeArticle} 
              onSelectArticle={handleSelectArticle}
            />
          ) : (
            <div className="space-y-6">
              {/* Developer Search & Filter Control */}
              <div className="p-5 bg-card rounded-xl border border-border space-y-3 shadow-xs">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by route path (/engagement/...), metric name (RAF, Touch Ratio), or algorithm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-16 py-2.5 bg-background border border-border rounded-lg text-sm font-mono outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/60"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground bg-muted px-2 py-0.5 rounded border"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-mono font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                    <Filter className="size-3 text-primary" /> Filter Module:
                  </span>
                  {DASHBOARD_GROUPS.map(group => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
                        selectedGroup === group
                          ? 'bg-foreground text-background border-foreground font-bold shadow-xs'
                          : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:text-foreground'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs Index Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  <span>Documentation Modules ({filteredArticles.length})</span>
                  <span>Target Route &amp; Spec ID</span>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="p-12 text-center bg-card rounded-xl border border-dashed space-y-2 font-mono text-xs">
                    <p className="text-foreground font-bold">No documentation specs matching query: "{searchQuery}"</p>
                    <p className="text-muted-foreground">Try clearing your filters or searching for eCQM IDs (e.g. CMS122), ICD-10 codes, or route names.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredArticles.map(art => (
                      <div
                        key={art.id}
                        onClick={() => handleSelectArticle(art.id)}
                        className="p-4 bg-card hover:bg-muted/40 rounded-xl border border-border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground border">
                              {art.dashboardGroup}
                            </span>
                            <h3 className="font-mono font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                              {art.title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 font-sans leading-relaxed">
                            {art.overview}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {art.targetAudience.slice(0, 3).map(role => (
                              <Badge key={role} variant="outline" className="text-[10px] font-mono bg-background text-muted-foreground">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <code className="text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded border">
                            {art.routePath}
                          </code>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
