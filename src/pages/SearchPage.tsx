import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SkillCard from '@/components/cards/SkillCard';
import GuideCard from '@/components/cards/GuideCard';
import ResourceCard from '@/components/cards/ResourceCard';
import { globalSearch } from '@/services/api';
import { useDebounce } from '@/hooks/use-debounce';
import type { Skill, Guide, Resource } from '@/types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSkills([]); setGuides([]); setResources([]); setHasSearched(false); return; }
    setLoading(true);
    setHasSearched(true);
    try {
      const { skills: s, guides: g, resources: r } = await globalSearch(q);
      setSkills(s);
      setGuides(g);
      setResources(r);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { doSearch(debouncedQuery); }, [debouncedQuery, doSearch]);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  // Group resources by type for display
  const agents    = resources.filter(r => r.resource_type === 'agent');
  const plugins   = resources.filter(r => r.resource_type === 'plugin');
  const mcps      = resources.filter(r => r.resource_type === 'mcp');
  const prompts   = resources.filter(r => r.resource_type === 'prompt');
  const tools     = resources.filter(r => r.resource_type === 'tool');
  const skillRes  = resources.filter(r => r.resource_type === 'skill');

  const totalResults = skills.length + guides.length + resources.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Search</h1>

      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search skills, agents, plugins, MCP, prompts, guides…"
          className="pl-9 h-12 text-base bg-card border-border"
          autoFocus
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {!hasSearched && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Type to search across all skills, agents, plugins, MCP servers, prompts, and guides.</p>
        </div>
      )}

      {hasSearched && !loading && totalResults === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No results found for "<span className="text-foreground">{query}</span>".</p>
          <div className="flex justify-center gap-3 mt-4">
            <Link to="/skills"><Button variant="ghost" size="sm" className="border border-border text-xs">Browse Skills</Button></Link>
            <Link to="/agents"><Button variant="ghost" size="sm" className="border border-border text-xs">Browse Agents</Button></Link>
            <Link to="/guides"><Button variant="ghost" size="sm" className="border border-border text-xs">Browse Guides</Button></Link>
          </div>
        </div>
      )}

      {hasSearched && !loading && totalResults > 0 && (
        <div className="space-y-10">
          <p className="text-xs text-muted-foreground">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for "<span className="text-foreground">{query}</span>"
          </p>

          {skills.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Skills ({skills.length})</h2>
                <Link to={`/skills?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skills.map(s => <SkillCard key={s.id} skill={s} />)}
              </div>
            </section>
          )}

          {agents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Agents ({agents.length})</h2>
                <Link to={`/agents?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agents.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {plugins.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Plugins ({plugins.length})</h2>
                <Link to={`/plugins?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plugins.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {mcps.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">MCP Servers ({mcps.length})</h2>
                <Link to={`/mcp?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mcps.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {prompts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Prompts ({prompts.length})</h2>
                <Link to={`/prompts?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {prompts.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {tools.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Tools ({tools.length})</h2>
                <Link to={`/tools?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tools.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {skillRes.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Skill Packs ({skillRes.length})</h2>
                <Link to={`/skills?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skillRes.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {guides.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Guides ({guides.length})</h2>
                <Link to={`/guides?q=${encodeURIComponent(query)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {guides.map(g => <GuideCard key={g.id} guide={g} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
