export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  role: 'user' | 'admin';
  avatar_url: string | null;
  created_at: string;
}

export interface Skill {
  id: number;
  slug: string;
  title: string;
  description: string;
  category_slug: string;
  compatible_platforms: string[];
  is_free: boolean;
  prompt_content: string | null;
  use_case: string | null;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export interface Guide {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  platform_tags: string[];
  guide_type: string;
  is_featured: boolean;
  view_count: number;
  published_date: string;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
}

export interface Platform {
  id: number;
  slug: string;
  name: string;
  color: string;
  description: string | null;
  sort_order: number;
}

export interface SetupStep {
  step: number;
  title: string;
  desc: string;
}

export interface SetupGuide {
  id: number;
  slug: string;
  platform: string;
  title: string;
  description: string;
  steps: SetupStep[];
  platform_color: string;
  sort_order: number;
}

export interface FreeTool {
  id: number;
  slug: string;
  title: string;
  description: string;
  tool_url: string | null;
  category: string | null;
  platforms: string[];
  is_featured: boolean;
  sort_order: number;
}

export interface Resource {
  id: number;
  slug: string;
  resource_type: 'agent' | 'plugin' | 'mcp' | 'prompt' | 'tool' | 'skill';
  title: string;
  description: string;
  long_description: string | null;
  category: string;
  compatible_platforms: string[];
  is_free: boolean;
  is_featured: boolean;
  prompt_content: string | null | undefined;
  source_url: string | null | undefined;
  author: string | null | undefined;
  tags: string[];
  view_count: number;
  created_at: string;
}

export type GuideType = 'how-to' | 'comparison' | 'explainer' | 'best-of' | 'learning' | 'article';
export type GuideCategory = 'How-To' | 'Comparisons' | 'Explainers' | 'Best-Of' | 'Learning';
export type PlatformSlug = 'claude' | 'chatgpt' | 'gemini-spark' | 'open-webui' | 'lobehub';
