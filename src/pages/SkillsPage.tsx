import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import SkillCard from '@/components/cards/SkillCard';
import BulkDownloadToolbar from '@/components/ui/bulk-download-toolbar';
import { getSkills, getCategories } from '@/services/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useSelectMode } from '@/hooks/use-select-mode';
import type { Skill, Category } from '@/types';

const platforms = [
  { value: 'all', label: 'All Platforms' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini-spark', label: 'Gemini Spark' },
  { value: 'open-webui', label: 'Open WebUI' },
  { value: 'lobehub', label: 'LobeHub' },
];

export default function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [platform, setPlatform] = useState(searchParams.get('platform') ?? 'all');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');

  const debouncedSearch = useDebounce(search, 350);
  const selectState = useSelectMode(skills);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSkills({
        search: debouncedSearch || undefined,
        platform: platform !== 'all' ? platform : undefined,
        category: category !== 'all' ? category : undefined,
      });
      setSkills(data);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, platform, category]);

  useEffect(() => { getCategories().then(setCategories); }, []);
  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (platform !== 'all') params.platform = platform;
    if (category !== 'all') params.category = category;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, platform, category, setSearchParams]);

  const clearFilters = () => { setSearch(''); setPlatform('all'); setCategory('all'); };
  const hasFilters = search || platform !== 'all' || category !== 'all';

  // Map skills to Downloadable shape
  const downloadableSkills = skills.map(s => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    category: s.category_slug,
    compatible_platforms: s.compatible_platforms,
    prompt_content: s.prompt_content,
    resource_type: 'skill' as const,
    tags: s.tags,
  }));
  const downloadableSelected = selectState.selectedItems.map(s => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    category: s.category_slug,
    compatible_platforms: s.compatible_platforms,
    prompt_content: s.prompt_content,
    resource_type: 'skill' as const,
    tags: s.tags,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">AI Skills Library</h1>
        <p className="text-sm text-muted-foreground">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} — reusable skill files for Claude, ChatGPT, Gemini Spark, and more.
        </p>
      </div>

      {/* Bulk Download Toolbar */}
      <BulkDownloadToolbar
        selectMode={selectState.selectMode}
        onToggleSelectMode={selectState.toggleSelectMode}
        selectedCount={selectState.selectedCount}
        selectedItems={downloadableSelected}
        allItems={downloadableSkills}
        categoryLabel={category !== 'all' ? category : undefined}
        onSelectAll={selectState.selectAll}
        onClearSelection={selectState.clearSelection}
        zipBaseName="openxstack-skills"
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills…"
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-44 bg-card border-border text-sm">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-52 bg-card border-border text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-lg bg-muted" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">No skills match your filters.</p>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs border border-border">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map(skill => (
            <div
              key={skill.id}
              className={selectState.selectMode ? 'relative cursor-pointer' : ''}
              onClick={selectState.selectMode ? () => selectState.toggleItem(skill.id) : undefined}
            >
              {selectState.selectMode && (
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                  {selectState.isSelected(skill.id)
                    ? <div className="h-5 w-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                        <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    : <div className="h-5 w-5 rounded border-2 border-muted-foreground bg-background" />
                  }
                </div>
              )}
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
