// Open Connect REST API Gateway — /functions/v1/oc-api
// Routes: GET /search  /resources  /resources/:slug  /categories  /platforms
// Auth: Bearer <api_key> header OR ?apikey= query param
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Api-Key',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function error(msg: string, status = 400) {
  return json({ error: msg }, status);
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

async function verifyApiKey(req: Request): Promise<boolean> {
  const auth = req.headers.get('Authorization') ?? '';
  const header = req.headers.get('X-Api-Key') ?? '';
  const url = new URL(req.url);
  const query = url.searchParams.get('apikey') ?? '';

  const raw = header || query || auth.replace(/^Bearer\s+/i, '').trim();
  if (!raw) return false;

  // Hash the raw key with SHA-256 then hex-encode
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

  const { data } = await supabase
    .from('api_keys')
    .select('id, is_active')
    .eq('key_hash', hash)
    .eq('is_active', true)
    .maybeSingle();

  if (data?.id) {
    // Update last_used_at async — don't await
    supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id);
    return true;
  }
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  // Strip function prefix: /functions/v1/oc-api/...  →  /...
  const path = url.pathname.replace(/^\/functions\/v1\/oc-api/, '') || '/';

  // ── Auth check (allow public read without key too, key unlocks full content) ──
  const authed = await verifyApiKey(req);

  const q = url.searchParams;
  const page  = Math.max(1, parseInt(q.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, parseInt(q.get('limit') ?? '20')));
  const from  = (page - 1) * limit;
  const to    = from + limit - 1;

  // ── GET /categories ──────────────────────────────────────────────────────────
  if (path === '/categories' || path === '/categories/') {
    const { data, error: err } = await supabase
      .from('categories')
      .select('slug, name, description, icon, sort_order')
      .order('sort_order');
    if (err) return error(err.message, 500);
    return json({ data, total: data?.length });
  }

  // ── GET /platforms ───────────────────────────────────────────────────────────
  if (path === '/platforms' || path === '/platforms/') {
    const { data, error: err } = await supabase
      .from('platforms')
      .select('slug, name, color, description, sort_order')
      .order('sort_order');
    if (err) return error(err.message, 500);
    return json({ data, total: data?.length });
  }

  // ── GET /search?q=... ────────────────────────────────────────────────────────
  if (path === '/search' || path === '/search/') {
    const searchQ = (q.get('q') ?? '').trim();
    const type    = q.get('type') ?? '';  // resources | skills | all
    if (!searchQ) return error('Missing query parameter: q');

    const results: Record<string, unknown[]> = {};

    if (!type || type === 'resources' || type === 'all') {
      const { data } = await supabase
        .from('resources')
        .select('id, slug, resource_type, title, description, category, compatible_platforms, is_free, is_featured, tags')
        .or(`title.ilike.%${searchQ}%,description.ilike.%${searchQ}%`)
        .range(from, to);
      results.resources = data ?? [];
    }

    if (!type || type === 'skills' || type === 'all') {
      const { data } = await supabase
        .from('skills')
        .select('id, slug, title, description, category_slug, compatible_platforms, is_free, is_featured')
        .or(`title.ilike.%${searchQ}%,description.ilike.%${searchQ}%`)
        .range(from, to);
      results.skills = data ?? [];
    }

    return json({ query: searchQ, page, limit, results });
  }

  // ── GET /resources ───────────────────────────────────────────────────────────
  if (path === '/resources' || path === '/resources/') {
    const type     = q.get('type') ?? '';
    const platform = q.get('platform') ?? '';
    const category = q.get('category') ?? '';
    const featured = q.get('featured') ?? '';

    let qb = supabase
      .from('resources')
      .select('id, slug, resource_type, title, description, category, compatible_platforms, is_free, is_featured, tags, source_url, author, created_at', { count: 'exact' });

    if (type)     qb = qb.eq('resource_type', type);
    if (category) qb = qb.eq('category', category);
    if (featured) qb = qb.eq('is_featured', featured === 'true');
    if (platform) qb = qb.contains('compatible_platforms', [platform]);

    const { data, error: err, count } = await qb.order('created_at', { ascending: false }).range(from, to);
    if (err) return error(err.message, 500);

    return json({ data, page, limit, total: count });
  }

  // ── GET /resources/:slug ─────────────────────────────────────────────────────
  const resourceMatch = path.match(/^\/resources\/([^/]+)$/);
  if (resourceMatch) {
    const slug = resourceMatch[1];
    const select = authed
      ? '*'
      : 'id, slug, resource_type, title, description, long_description, category, compatible_platforms, is_free, is_featured, tags, source_url, author, created_at';

    const { data, error: err } = await supabase
      .from('resources')
      .select(select)
      .eq('slug', slug)
      .maybeSingle();

    if (err) return error(err.message, 500);
    if (!data) return error('Resource not found', 404);

    // Increment view_count async
    supabase.from('resources').update({ view_count: (data as Record<string,unknown>).view_count as number + 1 }).eq('slug', slug);

    return json({ data });
  }

  // ── GET /skills ──────────────────────────────────────────────────────────────
  if (path === '/skills' || path === '/skills/') {
    const platform = q.get('platform') ?? '';
    const category = q.get('category') ?? '';

    let qb = supabase
      .from('skills')
      .select('id, slug, title, description, category_slug, compatible_platforms, is_free, is_featured, use_case, tags, created_at', { count: 'exact' });

    if (category) qb = qb.eq('category_slug', category);
    if (platform) qb = qb.contains('compatible_platforms', [platform]);

    const { data, error: err, count } = await qb.order('created_at', { ascending: false }).range(from, to);
    if (err) return error(err.message, 500);
    return json({ data, page, limit, total: count });
  }

  // ── GET /skills/:slug ────────────────────────────────────────────────────────
  const skillMatch = path.match(/^\/skills\/([^/]+)$/);
  if (skillMatch) {
    const slug = skillMatch[1];
    const select = authed ? '*' : 'id, slug, title, description, category_slug, compatible_platforms, is_free, is_featured, use_case, tags, created_at';
    const { data, error: err } = await supabase.from('skills').select(select).eq('slug', slug).maybeSingle();
    if (err) return error(err.message, 500);
    if (!data) return error('Skill not found', 404);
    return json({ data });
  }

  return error('Not found', 404);
});
