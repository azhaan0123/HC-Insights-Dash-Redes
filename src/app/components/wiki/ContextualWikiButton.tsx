import { useLocation, useNavigate } from 'react-router';
import { BookOpen } from "../../lib/icons";
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getWikiArticleByRoute } from '../../../lib/wiki';

interface ContextualWikiButtonProps {
  className?: string;
  variant?: 'outline' | 'default' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

/**
 * Contextual Tech Spec Nav Button
 * Directly opens our full-page /wiki specifications portal for the current route.
 */
export function ContextualWikiButton({
  className = '',
  variant = 'outline',
  size = 'sm',
  showLabel = true,
}: ContextualWikiButtonProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const matchedArticle = getWikiArticleByRoute(pathname);

  const handleClick = () => {
    if (matchedArticle) {
      navigate(`/wiki?spec=${matchedArticle.id}`);
    } else {
      navigate('/wiki');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`gap-1.5 font-mono text-xs transition-all hover:border-primary/60 shadow-xs ${className}`}
      title={matchedArticle ? `Specification: ${matchedArticle.title}` : 'Open Technical Documentation Portal (/wiki)'}
    >
      <BookOpen className="size-3.5 text-primary" />
      {showLabel && (
        <span>
          {matchedArticle ? 'Tech Spec' : 'API & UI Specs'}
        </span>
      )}
      {matchedArticle && showLabel && (
        <Badge variant="outline" className="ml-0.5 font-mono text-[10px] px-1.5 py-0 h-4 bg-muted/60 text-foreground border-border">
          DOCS
        </Badge>
      )}
    </Button>
  );
}
