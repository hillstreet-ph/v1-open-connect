import { supabase } from '@/db/supabase';
import type { Skill, Guide, Category, Platform, SetupGuide, FreeTool, Resource } from '@/types';

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function getSkills(opts: {
  category?: string;
  platform?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  cursor?: number;
} = {}): Promise<Skill[]> {
  let query = supabase
    .from('skills')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('view_count', { ascending: false })
    .order('id', { ascending: true });

  if (opts.category) query = query.eq('category_slug', opts.category);
  if (opts.platform) query = query.contains('compatible_platforms', [opts.platform]);
  if (opts.featured) query = query.eq('is_featured', true);
  if (opts.search) {
    query = query.or(`title.ilike.%${opts.search}%,description.ilike.%${opts.search}%`);
  }
  if (opts.cursor) query = query.gt('id', opts.cursor);
  query = query.limit(opts.limit ?? 50);

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getFeaturedSkills(limit = 8): Promise<Skill[]> {
  return getSkills({ featured: true, limit });
}

// ─── Guides ───────────────────────────────────────────────────────────────────

export async function getGuides(opts: {
  category?: string;
  platform?: string;
  guide_type?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  cursor?: number;
} = {}): Promise<Guide[]> {
  let query = supabase
    .from('guides')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('published_date', { ascending: false })
    .order('id', { ascending: true });

  if (opts.category) query = query.eq('category', opts.category);
  if (opts.platform) query = query.contains('platform_tags', [opts.platform]);
  if (opts.guide_type) query = query.eq('guide_type', opts.guide_type);
  if (opts.featured) query = query.eq('is_featured', true);
  if (opts.search) {
    query = query.or(`title.ilike.%${opts.search}%,description.ilike.%${opts.search}%`);
  }
  if (opts.cursor) query = query.gt('id', opts.cursor);
  query = query.limit(opts.limit ?? 60);

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getFeaturedGuides(limit = 6): Promise<Guide[]> {
  return getGuides({ featured: true, limit });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Platforms ────────────────────────────────────────────────────────────────

export async function getPlatforms(): Promise<Platform[]> {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Setup Guides ─────────────────────────────────────────────────────────────

export async function getSetupGuides(): Promise<SetupGuide[]> {
  const { data, error } = await supabase
    .from('setup_guides')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Free Tools ───────────────────────────────────────────────────────────────

export async function getFreeTools(): Promise<FreeTool[]> {
  const { data, error } = await supabase
    .from('free_tools')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Resources (agents, plugins, mcp, prompts, tools) ─────────────────────────

export async function getResources(opts: {
  resource_type?: string;
  category?: string;
  platform?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  cursor?: number;
} = {}): Promise<Resource[]> {
  let query = supabase
    .from('resources')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('view_count', { ascending: false })
    .order('id', { ascending: true });

  if (opts.resource_type) query = query.eq('resource_type', opts.resource_type);
  if (opts.category) query = query.eq('category', opts.category);
  if (opts.platform) query = query.contains('compatible_platforms', [opts.platform]);
  if (opts.featured) query = query.eq('is_featured', true);
  if (opts.search) {
    query = query.or(`title.ilike.%${opts.search}%,description.ilike.%${opts.search}%`);
  }
  if (opts.cursor) query = query.gt('id', opts.cursor);
  query = query.limit(opts.limit ?? 100);

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getFeaturedResources(limit = 8): Promise<Resource[]> {
  return getResources({ featured: true, limit });
}

export async function getAgents(opts: Parameters<typeof getResources>[0] = {}): Promise<Resource[]> {
  return getResources({ ...opts, resource_type: 'agent' });
}
export async function getPlugins(opts: Parameters<typeof getResources>[0] = {}): Promise<Resource[]> {
  return getResources({ ...opts, resource_type: 'plugin' });
}
export async function getMCPs(opts: Parameters<typeof getResources>[0] = {}): Promise<Resource[]> {
  return getResources({ ...opts, resource_type: 'mcp' });
}
export async function getPrompts(opts: Parameters<typeof getResources>[0] = {}): Promise<Resource[]> {
  return getResources({ ...opts, resource_type: 'prompt' });
}
export async function getTools(opts: Parameters<typeof getResources>[0] = {}): Promise<Resource[]> {
  return getResources({ ...opts, resource_type: 'tool' });
}
export async function getSkillResources(opts: Parameters<typeof getResources>[0] = {}): Promise<Resource[]> {
  return getResources({ ...opts, resource_type: 'skill' });
}

export async function getResourceCategories(resource_type?: string): Promise<string[]> {
  let query = supabase.from('resources').select('category');
  if (resource_type) query = query.eq('resource_type', resource_type);
  const { data, error } = await query;
  if (error) throw error;
  const cats = [...new Set((data ?? []).map((r: { category: string }) => r.category).filter(Boolean))].sort();
  return cats;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function globalSearch(query: string): Promise<{
  skills: Skill[];
  guides: Guide[];
  resources: Resource[];
}> {
  if (!query.trim()) return { skills: [], guides: [], resources: [] };
  const [skills, guides, resources] = await Promise.all([
    getSkills({ search: query, limit: 6 }),
    getGuides({ search: query, limit: 6 }),
    getResources({ search: query, limit: 12 }),
  ]);
  return { skills, guides, resources };
}
