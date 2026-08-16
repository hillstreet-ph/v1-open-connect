import { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getSetupGuides } from '@/services/api';
import type { SetupGuide } from '@/types';

export default function SetupGuidesPage() {
  const [guides, setGuides] = useState<SetupGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getSetupGuides().then(setGuides).finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Setup Guides</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Platform Setup Guides</h1>
        <p className="text-sm text-muted-foreground">
          Step-by-step setup instructions for Claude Cowork, Gemini Spark, and ChatGPT Work.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {guides.map(guide => (
            <div key={guide.id} id={guide.slug} className="opacity-0 intersect:opacity-100 transition duration-700">
              {/* Platform header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{ backgroundColor: `${guide.platform_color}15`, borderColor: `${guide.platform_color}30` }}
                >
                  <Cpu className="h-5 w-5" style={{ color: guide.platform_color }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{guide.title}</h2>
                  <p className="text-xs text-muted-foreground">{guide.description}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {guide.steps.map((step, idx) => {
                  const isLast = idx === guide.steps.length - 1;
                  return (
                    <Card key={step.step} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-start">
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold border mt-0.5"
                            style={{
                              backgroundColor: `${guide.platform_color}15`,
                              borderColor: `${guide.platform_color}40`,
                              color: guide.platform_color,
                            }}
                          >
                            {step.step}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">{step.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Done banner */}
              <div
                className="mt-4 rounded-lg border p-4 text-sm"
                style={{
                  backgroundColor: `${guide.platform_color}08`,
                  borderColor: `${guide.platform_color}25`,
                  color: guide.platform_color,
                }}
              >
                Setup complete! Start by browsing skills for <strong>{guide.platform}</strong> in the Skills Library.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
