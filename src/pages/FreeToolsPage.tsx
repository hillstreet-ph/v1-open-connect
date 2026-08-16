import { useState, useEffect } from 'react';
import { Wrench, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlatformBadgeList } from '@/components/ui/platform-badge';
import { getFreeTools } from '@/services/api';
import type { FreeTool } from '@/types';

const categoryColors: Record<string, string> = {
  Generator: 'bg-primary/10 text-primary border-primary/20',
  Optimizer: 'bg-accent/10 text-accent border-accent/20',
  Builder: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

export default function FreeToolsPage() {
  const [tools, setTools] = useState<FreeTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFreeTools().then(setTools).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Free Tools</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Free AI Tools</h1>
        <p className="text-sm text-muted-foreground">
          Utility tools to help you work smarter with AI — generators, optimizers, and builders.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg bg-muted" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tools.map(tool => (
            <Card key={tool.id} className="bg-card border-border card-hover group h-full flex flex-col opacity-0 intersect:opacity-100 transition duration-500">
              <CardContent className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  {tool.category && (
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${categoryColors[tool.category] ?? 'bg-muted text-muted-foreground border-border'}`}>
                      {tool.category}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                </div>
                <PlatformBadgeList platforms={tool.platforms} max={3} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-auto w-full justify-between text-xs border border-border hover:border-primary/40 hover:bg-primary/5"
                  disabled={!tool.tool_url}
                  onClick={tool.tool_url ? () => window.open(tool.tool_url!, '_blank') : undefined}
                >
                  {tool.tool_url ? 'Use Tool' : 'Coming Soon'}
                  {tool.tool_url && <ExternalLink className="h-3 w-3" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Banner */}
      <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <h2 className="font-semibold text-foreground mb-2">More tools coming soon</h2>
        <p className="text-sm text-muted-foreground text-pretty">
          We're adding more free AI tools regularly. Check back soon or browse the Skills Library for ready-to-use skill files.
        </p>
      </div>
    </div>
  );
}
