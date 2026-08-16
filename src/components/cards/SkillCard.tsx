import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlatformBadgeList } from '@/components/ui/platform-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Skill } from '@/types';

const categoryColors: Record<string, string> = {
  'content-marketing': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'email-communication': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'research-analysis': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'business-operations': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'productivity': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'documents-data': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'web-design': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'sales-support': 'bg-green-500/10 text-green-400 border-green-500/20',
  'free-tools': 'bg-primary/10 text-primary border-primary/20',
};

const categoryLabels: Record<string, string> = {
  'content-marketing': 'Content & Marketing',
  'email-communication': 'Email',
  'research-analysis': 'Research',
  'business-operations': 'Operations',
  'productivity': 'Productivity',
  'documents-data': 'Documents',
  'web-design': 'Web & Design',
  'sales-support': 'Sales & Support',
  'free-tools': 'Free Tools',
};

interface SkillCardProps {
  skill: Skill;
  className?: string;
  detailPath?: string;
}

export default function SkillCard({ skill, className, detailPath }: SkillCardProps) {
  const to = detailPath ?? `/skills/${skill.slug}`;
  return (
    <Card className={cn('h-full flex flex-col bg-card border-border card-hover group', className)}>
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          {skill.is_free && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
              Free
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {skill.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {skill.description}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            categoryColors[skill.category_slug] ?? 'bg-muted text-muted-foreground border-border'
          )}>
            {categoryLabels[skill.category_slug] ?? skill.category_slug}
          </span>
        </div>

        <PlatformBadgeList platforms={skill.compatible_platforms} max={3} />

        <Link to={to} className="mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 hover:bg-primary/5"
          >
            View Skill
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
