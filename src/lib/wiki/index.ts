import { WikiArticle } from './types';
import { analyticsArticles } from './analyticsArticles';
import { hccArticles } from './hccArticles';
import { acoArticles } from './acoArticles';
import { outcomesArticles } from './outcomesArticles';
import { adminArticles } from './adminArticles';
import { supportArticles } from './supportArticles';
import { mipsArticles } from './mipsArticles';
import { employerArticles } from './employerArticles';

export * from './types';
export { analyticsArticles } from './analyticsArticles';
export { hccArticles } from './hccArticles';
export { acoArticles } from './acoArticles';
export { outcomesArticles } from './outcomesArticles';
export { adminArticles } from './adminArticles';
export { supportArticles } from './supportArticles';
export { mipsArticles } from './mipsArticles';
export { employerArticles } from './employerArticles';

export const ALL_WIKI_ARTICLES: WikiArticle[] = [
  ...analyticsArticles,
  ...hccArticles,
  ...acoArticles,
  ...outcomesArticles,
  ...adminArticles,
  ...supportArticles,
  ...mipsArticles,
  ...employerArticles,
];

/**
 * Retrieves a wiki article matching the given route pathname.
 * Handles both exact matches and prefix/slug variants.
 */
export function getWikiArticleByRoute(pathname: string): WikiArticle | undefined {
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  
  // 1. Exact match first
  const exact = ALL_WIKI_ARTICLES.find(a => a.routePath === cleanPath);
  if (exact) return exact;

  // 2. Special route aliases or fallbacks
  if (cleanPath === '/' || cleanPath === '/home') {
    return ALL_WIKI_ARTICLES.find(a => a.id === 'engagement-overview');
  }

  // 3. Match longest matching route prefix (e.g. /engagement/active-patients/123 -> /engagement/active-patients)
  const sortedPrefixes = [...ALL_WIKI_ARTICLES].sort((a, b) => b.routePath.length - a.routePath.length);
  for (const article of sortedPrefixes) {
    if (article.routePath !== '/' && cleanPath.startsWith(article.routePath)) {
      return article;
    }
  }

  return undefined;
}

/**
 * Searches across all wiki articles by title, overview, features, metrics, or workflows.
 */
export function searchWikiArticles(query: string): WikiArticle[] {
  if (!query || !query.trim()) return ALL_WIKI_ARTICLES;
  
  const q = query.toLowerCase().trim();
  return ALL_WIKI_ARTICLES.filter(article => {
    if (article.title.toLowerCase().includes(q)) return true;
    if (article.overview.toLowerCase().includes(q)) return true;
    if (article.dashboardGroup.toLowerCase().includes(q)) return true;
    if (article.targetAudience.some(t => t.toLowerCase().includes(q))) return true;
    if (article.features.some(f => f.featureName.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))) return true;
    if (article.logicAndMetrics.some(m => m.metricName.toLowerCase().includes(q) || m.clinicalOrBusinessLogic.toLowerCase().includes(q) || m.formula?.toLowerCase().includes(q))) return true;
    if (article.workflows.some(w => w.actionName.toLowerCase().includes(q) || w.steps.some(s => s.toLowerCase().includes(q)))) return true;
    return false;
  });
}
