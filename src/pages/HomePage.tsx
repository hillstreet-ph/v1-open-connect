import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Bot, Cpu, MessageSquare, Puzzle,
  Search, Server, Sparkles, Star, Wrench, Zap, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SkillCard from '@/components/cards/SkillCard';
import ResourceCard from '@/components/cards/ResourceCard';
import GuideCard from '@/components/cards/GuideCard';
import { getFeaturedSkills, getFeaturedGuides, getCategories, getFeaturedResources } from '@/services/api';
import type { Skill, Guide, Category, Resource } from '@/types';

const platforms = [
  { slug: 'claude',       name: 'Claude',       color: '#d97706', desc: 'Cowork & Fable 5' },
  { slug: 'chatgpt',      name: 'ChatGPT',      color: '#10a37f', desc: 'Work & Custom GPTs' },
  { slug: 'gemini-spark', name: 'Gemini Spark', color: '#4285f4', desc: 'Gmail & Workspace' },
  { slug: 'open-webui',   name: 'Open WebUI',   color: '#8b5cf6', desc: 'Self-hosted AI' },
  { slug: 'lobehub',      name: 'LobeHub',      color: '#6366f1', desc: 'Open-source chat' },
];

const resourceTypeLinks = [
  { to: '/agents',  label: 'Agents',      icon: Bot,          color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',  desc: 'Pre-built task agents' },
  { to: '/skills',  label: 'Skills',      icon: Zap,          color: 'text-primary bg-primary/10 border-primary/20',           desc: 'Reusable skill files' },
  { to: '/plugins', label: 'Plugins',     icon: Puzzle,       color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',        desc: 'Platform connectors' },
  { to: '/mcp',     label: 'MCP Servers', icon: Server,       color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',desc: 'Model Context Protocol' },
  { to: '/prompts', label: 'Prompts',     icon: MessageSquare,color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',     desc: 'Prompt templates' },
  { to: '/guides',  label: 'Guides',      icon: BookOpen,     color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',        desc: 'How-tos & tutorials' },
  { to: '/setup-guides', label: 'Setup',  icon: Cpu,          color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',        desc: 'Platform setup help' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([]);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedSkills(4),
      getFeaturedGuides(4),
      getCategories(),
      getFeaturedResources(8),
    ]).then(([skills, guides, cats, resources]) => {
      setFeaturedSkills(skills);
      setFeaturedGuides(guides);
      setCategories(cats);
      setFeaturedResources(resources);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }, [searchQuery, navigate]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6">
            <Sparkles className="h-3 w-3" />
            Agents · Skills · Plugins · MCP · Prompts · Guides — all free
          </div>

          <h1 className="text-balance text-3xl font-semibold md:text-5xl mb-4">
            Your unified AI resource hub for{' '}
            <span className="gradient-text">all platforms & agents</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto text-pretty">
            One place for every AI resource — Claude, ChatGPT, Gemini Spark, LobeHub, SwarmClaw, Open WebUI, and more.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search agents, skills, plugins, MCP, prompts…"
                className="pl-9 bg-card border-border h-11 text-sm"
              />
            </div>
            <Button type="submit" className="h-11 px-5 shrink-0">Search</Button>
          </form>

          {/* Resource type quick-links */}
          <div className="flex flex-wrap justify-center gap-2">
            {resourceTypeLinks.map(({ to, label, icon: Icon, color }) => (
              <Link key={to} to={to}>
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${color}`}>
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform compatibility strip */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-muted-foreground mr-2 shrink-0">Compatible with:</span>
            {platforms.map(p => (
              <Link key={p.slug} to={`/skills?platform=${p.slug}`}>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 hover:border-primary/30 transition-colors">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground hidden md:block">{p.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Resource type cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 w-full">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">All Resource Types</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Everything in one place</h2>
          <p className="text-sm text-muted-foreground mt-1">Browse every category of AI resource — agents, skills, plugins, MCP, prompts, and guides.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {resourceTypeLinks.map(({ to, label, icon: Icon, color, desc }) => (
            <Link key={to} to={to}>
              <Card className="bg-card border-border card-hover group h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-[11px] text-muted-foreground text-pretty leading-snug">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Resources (agents, plugins, MCP, prompts) */}
      <section className="bg-card/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Featured Resources</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">Top Agents, Plugins & MCP</h2>
              <p className="text-sm text-muted-foreground mt-1">The most popular resources across all types.</p>
            </div>
            <Link to="/agents">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground shrink-0">
                Browse agents <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-lg bg-muted" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featuredResources.map(r => (
                <div key={r.id} className="opacity-0 intersect:opacity-100 transition duration-500">
                  <ResourceCard resource={r} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Skills */}
      <section className="mx-auto max-w-7xl px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Skills Library</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Featured AI Skills</h2>
            <p className="text-sm text-muted-foreground mt-1">Reusable skill files ready to drop into any AI platform.</p>
          </div>
          <Link to="/skills">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground shrink-0">
              Browse all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-lg bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredSkills.map(skill => (
              <div key={skill.id} className="opacity-0 intersect:opacity-100 transition duration-500">
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/skills">
            <Button variant="ghost" className="border border-border hover:border-primary/40 text-sm">
              View all 45+ skills <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Categories</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map(cat => (
              <Link key={cat.slug} to={`/skills?category=${cat.slug}`}>
                <Card className="bg-card border-border card-hover group h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary border border-border group-hover:border-primary/30 transition-colors">
                      <span className="text-sm">{getCategoryEmoji(cat.slug)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{cat.description?.split('—')[0].trim()}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="mx-auto max-w-7xl px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Guides</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Featured Guides</h2>
            <p className="text-sm text-muted-foreground mt-1">How-tos, comparisons, and best-of lists.</p>
          </div>
          <Link to="/guides">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground shrink-0">
              Browse all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredGuides.map(guide => (
              <div key={guide.id} className="opacity-0 intersect:opacity-100 transition duration-500">
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link to="/guides">
            <Button variant="ghost" className="border border-border hover:border-primary/40 text-sm">
              View all 51+ guides <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA cards */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: Cpu, title: 'Setup Guides', desc: 'Step-by-step setup for Claude, Gemini Spark, and ChatGPT.', to: '/setup-guides', cta: 'View Setup Guides' },
              { icon: Wrench, title: 'Free Tools', desc: 'AI generators, prompt optimizers, and quick-build tools.', to: '/free-tools', cta: 'Browse Tools' },
              { icon: BookOpen, title: 'Learning Path', desc: 'New to AI agents? Start with the beginner learning path.', to: '/guides?type=learning', cta: 'Start Learning' },
            ].map(({ icon: Icon, title, desc, to, cta }) => (
              <Card key={to} className="bg-card border-border card-hover group">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-pretty">{desc}</p>
                  <Link to={to}>
                    <Button variant="ghost" size="sm" className="text-xs border border-border hover:border-primary/40 hover:bg-primary/5">
                      {cta} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    'content-marketing': '✍️',
    'email-communication': '📧',
    'research-analysis': '🔬',
    'business-operations': '💼',
    'productivity': '⚡',
    'documents-data': '📄',
    'web-design': '🌐',
    'sales-support': '🤝',
    'free-tools': '🔧',
  };
  return map[slug] ?? '📦';
}
