import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PlatformBadgeList } from '@/components/ui/platform-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Guide } from '@/types';

const typeStyles: Record<string, string> = {
  'how-to': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'comparison': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'explainer': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'best-of': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'learning': 'bg-green-500/10 text-green-400 border-green-500/20',
};

const typeLabels: Record<string, string> = {
  'how-to': 'How-To',
  'comparison': 'Comparison',
  'explainer': 'Explainer',
  'best-of': 'Best Of',
  'learning': 'Learning',
};

interface GuideCardProps {
  guide: Guide;
  className?: string;
}

export default function GuideCard({ guide, className }: GuideCardProps) {
  return (
    <Card className={cn('h-full flex flex-col bg-card border-border card-hover group', className)}>
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 border border-accent/20">
            <BookOpen className="h-4 w-4 text-accent" />
          </div>
          <span className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium shrink-0',
            typeStyles[guide.guide_type] ?? 'bg-muted text-muted-foreground border-border'
          )}>
            {typeLabels[guide.guide_type] ?? guide.guide_type}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {guide.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {guide.description}
          </p>
        </div>

        <PlatformBadgeList platforms={guide.platform_tags} max={3} />

        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(guide.published_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <Link to={`/guides?type=${guide.guide_type}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 hover:bg-primary/5"
            >
              Read <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
