import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bot, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ResourceCard from '@/components/cards/ResourceCard';
import BulkDownloadToolbar from '@/components/ui/bulk-download-toolbar';
import { getAgents, getResourceCategories } from '@/services/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useSelectMode } from '@/hooks/use-select-mode';
import type { Resource } from '@/types';

const platformOptions = [
  { value: 'all', label: 'All Platforms' },
  { value: 'Claude', label: 'Claude' },
  { value: 'ChatGPT', label: 'ChatGPT' },
  { value: 'Gemini Spark', label: 'Gemini Spark' },
  { value: 'Open WebUI', label: 'Open WebUI' },
  { value: 'LobeHub', label: 'LobeHub' },
  { value: 'SwarmClaw', label: 'SwarmClaw' },
  { value: 'MultiOn', label: 'MultiOn' },
];

export default function AgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [agents, setAgents] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [platform, setPlatform] = useState(searchParams.get('platform') ?? 'all');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');

  const debouncedSearch = useDebounce(search, 350);
  const selectState = useSelectMode(agents);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAgents({
        search: debouncedSearch || undefined,
        platform: platform !== 'all' ? platform : undefined,
        category: category !== 'all' ? category : undefined,
      });
      setAgents(data);
    } finally { setLoading(false); }
  }, [debouncedSearch, platform, category]);

  useEffect(() => { getResourceCategories('agent').then(setCategories); }, []);
  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    const p: Record<string, string> = {};
    if (debouncedSearch) p.q = debouncedSearch;
    if (platform !== 'all') p.platform = platform;
    if (category !== 'all') p.category = category;
    setSearchParams(p, { replace: true });
  }, [debouncedSearch, platform, category, setSearchParams]);

  const clearFilters = () => { setSearch(''); setPlatform('all'); setCategory('all'); };
  const hasFilters = search || platform !== 'all' || category !== 'all';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 w-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Agents</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">AI Agents</h1>
        <p className="text-sm text-muted-foreground">
          {agents.length} agent{agents.length !== 1 ? 's' : ''} — pre-built AI agents for Claude, ChatGPT, LobeHub, SwarmClaw, and more.
        </p>
      </div>

      {/* Bulk Download Toolbar */}
      <BulkDownloadToolbar
        selectMode={selectState.selectMode}
        onToggleSelectMode={selectState.toggleSelectMode}
        selectedCount={selectState.selectedCount}
        selectedItems={selectState.selectedItems}
        allItems={agents}
        categoryLabel={category !== 'all' ? category : undefined}
        onSelectAll={selectState.selectAll}
        onClearSelection={selectState.clearSelection}
        zipBaseName="open-connect-agents"
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents…" className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-44 bg-card border-border text-sm"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>{platformOptions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48 bg-card border-border text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg bg-muted" />)}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">No agents match your filters.</p>
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs border border-border">Clear filters</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map(agent => (
            <ResourceCard
              key={agent.id}
              resource={agent}
              selectMode={selectState.selectMode}
              isSelected={selectState.isSelected(agent.id)}
              onToggle={selectState.toggleItem}
              detailPath={`/agents/${agent.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
