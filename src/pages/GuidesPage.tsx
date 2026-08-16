import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import GuideCard from '@/components/cards/GuideCard';
import { getGuides } from '@/services/api';
import { useDebounce } from '@/hooks/use-debounce';
import type { Guide } from '@/types';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'How-To', label: 'How-To Guides' },
  { value: 'Comparisons', label: 'Comparisons' },
  { value: 'Explainers', label: 'Explainers' },
  { value: 'Best-Of', label: 'Best Of' },
  { value: 'Learning', label: 'Learning' },
];

const platforms = [
  { value: 'all', label: 'All Platforms' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini-spark', label: 'Gemini Spark' },
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'how-to', label: 'How-To' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'explainer', label: 'Explainer' },
  { value: 'best-of', label: 'Best Of' },
  { value: 'learning', label: 'Learning' },
];

export default function GuidesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');
  const [platform, setPlatform] = useState(searchParams.get('platform') ?? 'all');
  const [type, setType] = useState(searchParams.get('type') ?? 'all');

  const debouncedSearch = useDebounce(search, 350);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGuides({
        search: debouncedSearch || undefined,
        category: category !== 'all' ? category : undefined,
        platform: platform !== 'all' ? platform : undefined,
        guide_type: type !== 'all' ? type : undefined,
      });
      setGuides(data);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, platform, type]);

  useEffect(() => { fetchGuides(); }, [fetchGuides]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (category !== 'all') params.category = category;
    if (platform !== 'all') params.platform = platform;
    if (type !== 'all') params.type = type;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, platform, type, setSearchParams]);

  const clearFilters = () => { setSearch(''); setCategory('all'); setPlatform('all'); setType('all'); };
  const hasFilters = search || category !== 'all' || platform !== 'all' || type !== 'all';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Guides</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Guides & Articles</h1>
        <p className="text-sm text-muted-foreground">
          {guides.length} article{guides.length !== 1 ? 's' : ''} — how-tos, comparisons, explainers, and best-of lists.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-8 flex-wrap">
        <div className="relative flex-1 min-w-0 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guides…"
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40 bg-card border-border text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-40 bg-card border-border text-sm">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-36 bg-card border-border text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg bg-muted" />)}
        </div>
      ) : guides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">No guides match your filters.</p>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs border border-border">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map(guide => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}
