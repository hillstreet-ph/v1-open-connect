
-- ============================================================
-- Open Connect — Full Schema with Auth, Profiles, RLS, Realtime
-- ============================================================

-- 1. User roles enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text,
  phone      text,
  username   text UNIQUE,
  role       public.user_role NOT NULL DEFAULT 'user',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Bookmarks (user saves resources)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id bigint REFERENCES resources(id) ON DELETE CASCADE,
  skill_id    integer REFERENCES skills(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id),
  UNIQUE(user_id, skill_id)
);

-- ============================================================
-- Auth trigger: sync new users to profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (NEW.id, NEW.email, NEW.phone, 'user'::public.user_role)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Helper: get_user_role
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = uid;
$$;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks  ENABLE ROW LEVEL SECURITY;

-- Ensure RLS on content tables (idempotent)
ALTER TABLE public.resources    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setup_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_tools   ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies cleanly
DROP POLICY IF EXISTS "Admins full access to profiles"   ON profiles;
DROP POLICY IF EXISTS "Users view own profile"           ON profiles;
DROP POLICY IF EXISTS "Users update own profile"         ON profiles;
DROP POLICY IF EXISTS "Users manage own bookmarks"       ON bookmarks;
DROP POLICY IF EXISTS "Public read categories"           ON categories;
DROP POLICY IF EXISTS "Admin write categories"           ON categories;
DROP POLICY IF EXISTS "Public read platforms"            ON platforms;
DROP POLICY IF EXISTS "Admin write platforms"            ON platforms;
DROP POLICY IF EXISTS "Public read skills"               ON skills;
DROP POLICY IF EXISTS "Admin write skills"               ON skills;
DROP POLICY IF EXISTS "Public read guides"               ON guides;
DROP POLICY IF EXISTS "Admin write guides"               ON guides;
DROP POLICY IF EXISTS "Public read setup_guides"         ON setup_guides;
DROP POLICY IF EXISTS "Admin write setup_guides"         ON setup_guides;
DROP POLICY IF EXISTS "Public read free_tools"           ON free_tools;
DROP POLICY IF EXISTS "Admin write free_tools"           ON free_tools;
DROP POLICY IF EXISTS "Public read resources"            ON resources;
DROP POLICY IF EXISTS "Admin write resources"            ON resources;

-- ── profiles ──
CREATE POLICY "Admins full access to profiles" ON profiles
  FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Users view own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM get_user_role(auth.uid()));

-- ── bookmarks ──
CREATE POLICY "Users manage own bookmarks" ON bookmarks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── public content tables ──
CREATE POLICY "Public read categories"   ON categories   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write categories"   ON categories   FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Public read platforms"    ON platforms    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write platforms"    ON platforms    FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Public read skills"       ON skills       FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write skills"       ON skills       FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Public read guides"       ON guides       FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write guides"       ON guides       FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Public read setup_guides" ON setup_guides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write setup_guides" ON setup_guides FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Public read free_tools"   ON free_tools   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write free_tools"   ON free_tools   FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Public read resources"    ON resources    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write resources"    ON resources    FOR ALL    TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- ── public_profiles view ──
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
  SELECT id, username, role, avatar_url FROM profiles;

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_profiles_role       ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user      ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_type      ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_featured  ON resources(is_featured);
