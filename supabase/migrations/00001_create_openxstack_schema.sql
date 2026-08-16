
-- Enable required extensions
create extension if not exists "unaccent";

-- Categories table
create table public.categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  sort_order integer default 0
);

-- Platforms table
create table public.platforms (
  id serial primary key,
  slug text unique not null,
  name text not null,
  color text not null,
  description text,
  sort_order integer default 0
);

-- Skills table
create table public.skills (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  category_slug text not null references public.categories(slug),
  compatible_platforms text[] not null default '{}',
  is_free boolean not null default true,
  prompt_content text,
  use_case text,
  tags text[] default '{}',
  is_featured boolean default false,
  view_count integer default 0,
  created_at timestamptz not null default now()
);

-- Guides table
create table public.guides (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  category text not null,
  platform_tags text[] default '{}',
  guide_type text not null default 'article',
  is_featured boolean default false,
  view_count integer default 0,
  published_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Setup guides table
create table public.setup_guides (
  id serial primary key,
  slug text unique not null,
  platform text not null,
  title text not null,
  description text not null,
  steps jsonb not null default '[]',
  platform_color text default '#6366f1',
  sort_order integer default 0
);

-- Free tools table
create table public.free_tools (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  tool_url text,
  category text,
  platforms text[] default '{}',
  is_featured boolean default false,
  sort_order integer default 0
);

-- RLS
alter table public.categories enable row level security;
alter table public.platforms enable row level security;
alter table public.skills enable row level security;
alter table public.guides enable row level security;
alter table public.setup_guides enable row level security;
alter table public.free_tools enable row level security;

-- Public read policies
create policy "public_read_categories" on public.categories for select to anon, authenticated using (true);
create policy "public_read_platforms" on public.platforms for select to anon, authenticated using (true);
create policy "public_read_skills" on public.skills for select to anon, authenticated using (true);
create policy "public_read_guides" on public.guides for select to anon, authenticated using (true);
create policy "public_read_setup_guides" on public.setup_guides for select to anon, authenticated using (true);
create policy "public_read_free_tools" on public.free_tools for select to anon, authenticated using (true);

-- Indexes
create index idx_skills_category on public.skills(category_slug);
create index idx_skills_featured on public.skills(is_featured);
create index idx_skills_platforms on public.skills using gin(compatible_platforms);
create index idx_guides_category on public.guides(category);
create index idx_guides_platform_tags on public.guides using gin(platform_tags);
create index idx_guides_featured on public.guides(is_featured);

-- Full text search
create index idx_skills_fts on public.skills using gin(to_tsvector('english', title || ' ' || description));
create index idx_guides_fts on public.guides using gin(to_tsvector('english', title || ' ' || description));
