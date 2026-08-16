// Open Connect MCP Server — Model Context Protocol (JSON-RPC 2.0)
// Compatible with Claude Desktop, Cursor, Windsurf, Open WebUI, and any MCP client
// Endpoint: POST /functions/v1/oc-mcp
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

function rpcOk(id: string | number | null, result: unknown) {
  return new Response(JSON.stringify({ jsonrpc: '2.0', id, result }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function rpcError(id: string | number | null, code: number, message: string) {
  return new Response(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// Tool definitions exposed to MCP clients
const TOOLS = [
  {
    name: 'search_resources',
    description: 'Search Open Connect for AI tools, skills, plugins, MCP servers, prompts, or agents. Returns matching resources with title, description, type, and slug.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query text' },
        type: { type: 'string', description: 'Filter by type: agents, skills, plugins, mcp, prompts, tools', enum: ['agents','skills','plugins','mcp','prompts','tools',''] },
        platform: { type: 'string', description: 'Filter by platform slug: claude, chatgpt, gemini-spark, open-webui, lobehub' },
        limit: { type: 'number', description: 'Max results (1-20, default 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_resource',
    description: 'Get full details for a specific resource by slug, including prompt_content (the actual skill/prompt text you can use directly).',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Resource slug identifier' },
        type: { type: 'string', description: 'Resource type: resources or skills', enum: ['resources','skills'] },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_resources',
    description: 'List Open Connect resources by type and/or platform. Use to browse available AI agents, skills, plugins, MCP servers, prompts, and tools.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Resource type: agents, skills, plugins, mcp, prompts, tools', enum: ['agents','skills','plugins','mcp','prompts','tools'] },
        platform: { type: 'string', description: 'Platform slug: claude, chatgpt, gemini-spark, open-webui, lobehub' },
        featured_only: { type: 'boolean', description: 'Return only featured resources' },
        limit: { type: 'number', description: 'Max results (1-50, default 20)' },
      },
    },
  },
  {
    name: 'get_categories',
    description: 'List all available resource categories in Open Connect.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_platforms',
    description: 'List all supported AI platforms (Claude, ChatGPT, Gemini Spark, Open WebUI, LobeHub) with descriptions.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function handleTool(name: string, args: Record<string, unknown>) {
  switch (name) {

    case 'search_resources': {
      const q = String(args.query ?? '').trim();
      const type = String(args.type ?? '');
      const platform = String(args.platform ?? '');
      const limit = Math.min(20, Math.max(1, Number(args.limit ?? 10)));

      const results: unknown[] = [];

      // Search resources
      if (!type || type !== 'skills') {
        let qb = supabase
          .from('resources')
          .select('slug, resource_type, title, description, category, compatible_platforms, is_free, tags')
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .limit(limit);
        if (type) qb = qb.eq('resource_type', type);
        if (platform) qb = qb.contains('compatible_platforms', [platform]);
        const { data } = await qb;
        if (data) results.push(...data.map(r => ({ ...r, _source: 'resources' })));
      }

      // Search skills
      if (!type || type === 'skills') {
        let qb = supabase
          .from('skills')
          .select('slug, title, description, category_slug, compatible_platforms, is_free')
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .limit(limit);
        if (platform) qb = qb.contains('compatible_platforms', [platform]);
        const { data } = await qb;
        if (data) results.push(...data.map(r => ({ ...r, resource_type: 'skills', _source: 'skills' })));
      }

      return {
        content: [{ type: 'text', text: JSON.stringify({ query: q, count: results.length, results }, null, 2) }],
      };
    }

    case 'get_resource': {
      const slug = String(args.slug ?? '').trim();
      const type = String(args.type ?? 'resources');

      if (type === 'skills') {
        const { data } = await supabase.from('skills').select('*').eq('slug', slug).maybeSingle();
        if (!data) return { content: [{ type: 'text', text: `Skill not found: ${slug}` }], isError: true };
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      const { data } = await supabase.from('resources').select('*').eq('slug', slug).maybeSingle();
      if (!data) return { content: [{ type: 'text', text: `Resource not found: ${slug}` }], isError: true };
      // Increment view_count
      supabase.from('resources').update({ view_count: (data as Record<string,unknown>).view_count as number + 1 }).eq('slug', slug);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'list_resources': {
      const type = String(args.type ?? '');
      const platform = String(args.platform ?? '');
      const featured = Boolean(args.featured_only ?? false);
      const limit = Math.min(50, Math.max(1, Number(args.limit ?? 20)));

      if (type === 'skills' || !type) {
        let qb = supabase
          .from('skills')
          .select('slug, title, description, category_slug, compatible_platforms, is_free, is_featured')
          .limit(limit);
        if (platform) qb = qb.contains('compatible_platforms', [platform]);
        if (featured) qb = qb.eq('is_featured', true);
        const { data } = await qb;
        if (type === 'skills') {
          return { content: [{ type: 'text', text: JSON.stringify({ type: 'skills', count: data?.length, items: data }, null, 2) }] };
        }
      }

      let qb = supabase
        .from('resources')
        .select('slug, resource_type, title, description, category, compatible_platforms, is_free, is_featured')
        .limit(limit);
      if (type) qb = qb.eq('resource_type', type);
      if (platform) qb = qb.contains('compatible_platforms', [platform]);
      if (featured) qb = qb.eq('is_featured', true);
      const { data } = await qb;
      return { content: [{ type: 'text', text: JSON.stringify({ type: type || 'all', count: data?.length, items: data }, null, 2) }] };
    }

    case 'get_categories': {
      const { data } = await supabase.from('categories').select('slug, name, description').order('sort_order');
      return { content: [{ type: 'text', text: JSON.stringify({ categories: data }, null, 2) }] };
    }

    case 'get_platforms': {
      const { data } = await supabase.from('platforms').select('slug, name, color, description').order('sort_order');
      return { content: [{ type: 'text', text: JSON.stringify({ platforms: data }, null, 2) }] };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  // SSE transport for MCP (GET /) — return server info
  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      name: 'open-connect',
      version: '1.0.0',
      description: 'Open Connect MCP Server — search and retrieve AI tools, skills, agents, plugins, MCP servers, prompts, and guides.',
      transport: 'http',
      endpoint: req.url,
    }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
  }

  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS });

  let body: JsonRpcRequest;
  try {
    body = await req.json();
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  const { id, method, params = {} } = body;

  switch (method) {
    case 'initialize':
      return rpcOk(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'open-connect', version: '1.0.0' },
      });

    case 'tools/list':
      return rpcOk(id, { tools: TOOLS });

    case 'tools/call': {
      const toolName = String((params as Record<string,unknown>).name ?? '');
      const toolArgs = ((params as Record<string,unknown>).arguments ?? {}) as Record<string, unknown>;
      if (!toolName) return rpcError(id, -32602, 'Missing tool name');
      const result = await handleTool(toolName, toolArgs);
      return rpcOk(id, result);
    }

    case 'ping':
      return rpcOk(id, {});

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
});
