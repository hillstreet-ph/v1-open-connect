// Open Connect ChatGPT Plugin + OpenAPI Spec server
// Serves: /.well-known/ai-plugin.json and /openapi.yaml
// Also handles actual API calls from ChatGPT plugin runtime
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, OpenAI-Ephemeral-User-Id',
};

const BASE_URL = 'https://hclzajrfohycvoysknkq.supabase.co/functions/v1/oc-plugin';
const API_URL  = 'https://hclzajrfohycvoysknkq.supabase.co/functions/v1/oc-api';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

function jsonResp(data: unknown, status = 200, extraHeaders: Record<string,string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function textResp(text: string, contentType = 'text/plain') {
  return new Response(text, {
    headers: { ...CORS, 'Content-Type': contentType },
  });
}

// ai-plugin.json manifest
const AI_PLUGIN_MANIFEST = {
  schema_version: 'v1',
  name_for_human: 'Open Connect',
  name_for_model: 'open_connect',
  description_for_human: 'Search and retrieve AI tools, skills, agents, plugins, MCP servers, and prompts from Open Connect.',
  description_for_model: `Open Connect is a unified AI resource hub. Use it to:
1. Search for AI tools, skills, plugins, MCP servers, agents, and prompts.
2. Get full resource details including ready-to-use prompt_content.
3. Filter by platform (claude, chatgpt, gemini-spark, open-webui, lobehub) or category.
4. List featured resources by type.
Always search before claiming a resource doesn't exist. Use get_resource to retrieve full prompt content once you have a slug.`,
  auth: { type: 'none' },
  api: {
    type: 'openapi',
    url: `${BASE_URL}/openapi.yaml`,
  },
  logo_url: `${BASE_URL}/logo.png`,
  contact_email: 'admin@openconnect.ai',
  legal_info_url: `${BASE_URL}/legal`,
};

// OpenAPI spec
const OPENAPI_YAML = `openapi: "3.0.3"
info:
  title: Open Connect API
  description: Unified AI resource hub — search skills, agents, plugins, MCP servers, prompts, and tools.
  version: "1.0.0"
servers:
  - url: ${API_URL}
paths:
  /search:
    get:
      operationId: searchResources
      summary: Search for AI resources
      description: Search across all resource types (skills, agents, plugins, MCP, prompts, tools) and return matching results.
      parameters:
        - name: q
          in: query
          required: true
          schema: { type: string }
          description: Search query text
        - name: type
          in: query
          schema: { type: string, enum: [agents, skills, plugins, mcp, prompts, tools] }
          description: Filter by resource type
        - name: platform
          in: query
          schema: { type: string, enum: [claude, chatgpt, gemini-spark, open-webui, lobehub] }
          description: Filter by AI platform
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        "200":
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  query: { type: string }
                  results:
                    type: object
                    properties:
                      resources: { type: array, items: { \\$ref: "#/components/schemas/ResourceSummary" } }
                      skills: { type: array, items: { \\$ref: "#/components/schemas/SkillSummary" } }
  /resources:
    get:
      operationId: listResources
      summary: List AI resources
      parameters:
        - name: type
          in: query
          schema: { type: string, enum: [agents, plugins, mcp, prompts, tools] }
        - name: platform
          in: query
          schema: { type: string }
        - name: featured
          in: query
          schema: { type: boolean }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        "200":
          description: List of resources
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { \\$ref: "#/components/schemas/ResourceSummary" } }
                  total: { type: integer }
  /resources/{slug}:
    get:
      operationId: getResource
      summary: Get full resource details including prompt content
      parameters:
        - name: slug
          in: path
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Resource detail
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { \\$ref: "#/components/schemas/ResourceDetail" }
        "404":
          description: Resource not found
  /skills:
    get:
      operationId: listSkills
      summary: List AI skills
      parameters:
        - name: platform
          in: query
          schema: { type: string }
        - name: category
          in: query
          schema: { type: string }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        "200":
          description: List of skills
  /skills/{slug}:
    get:
      operationId: getSkill
      summary: Get full skill details including prompt content
      parameters:
        - name: slug
          in: path
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Skill detail
        "404":
          description: Skill not found
  /categories:
    get:
      operationId: getCategories
      summary: List all resource categories
      responses:
        "200":
          description: Categories
  /platforms:
    get:
      operationId: getPlatforms
      summary: List all supported AI platforms
      responses:
        "200":
          description: Platforms
components:
  schemas:
    ResourceSummary:
      type: object
      properties:
        slug: { type: string }
        resource_type: { type: string }
        title: { type: string }
        description: { type: string }
        category: { type: string }
        compatible_platforms: { type: array, items: { type: string } }
        is_free: { type: boolean }
        is_featured: { type: boolean }
        tags: { type: array, items: { type: string } }
    ResourceDetail:
      allOf:
        - \\$ref: "#/components/schemas/ResourceSummary"
        - type: object
          properties:
            long_description: { type: string }
            prompt_content: { type: string, description: "Full prompt text ready to use" }
            source_url: { type: string }
            author: { type: string }
    SkillSummary:
      type: object
      properties:
        slug: { type: string }
        title: { type: string }
        description: { type: string }
        category_slug: { type: string }
        compatible_platforms: { type: array, items: { type: string } }
        is_free: { type: boolean }
`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/functions\/v1\/oc-plugin/, '') || '/';

  // ai-plugin.json
  if (path === '/.well-known/ai-plugin.json' || path === '/ai-plugin.json') {
    return jsonResp(AI_PLUGIN_MANIFEST);
  }

  // openapi.yaml
  if (path === '/openapi.yaml') {
    return textResp(OPENAPI_YAML, 'application/yaml');
  }

  // openapi.json variant
  if (path === '/openapi.json') {
    return jsonResp({
      openapi: '3.0.3',
      info: { title: 'Open Connect API', version: '1.0.0', description: 'Unified AI resource hub' },
      servers: [{ url: API_URL }],
    });
  }

  // Logo placeholder (1x1 transparent PNG)
  if (path === '/logo.png') {
    const png = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,2,0,1,232,166,63,40,0,0,0,0,73,69,78,68,174,66,96,130]);
    return new Response(png, { headers: { ...CORS, 'Content-Type': 'image/png' } });
  }

  // Legal info
  if (path === '/legal') {
    return textResp('Open Connect API is provided as-is. All AI resources are for informational use. By using this plugin you agree to use AI responsibly.');
  }

  // Health check
  if (path === '/' || path === '/health') {
    return jsonResp({
      status: 'ok',
      service: 'Open Connect Plugin Server',
      endpoints: {
        manifest: `${BASE_URL}/.well-known/ai-plugin.json`,
        openapi:  `${BASE_URL}/openapi.yaml`,
        api:      API_URL,
        mcp:      'https://hclzajrfohycvoysknkq.supabase.co/functions/v1/oc-mcp',
      },
    });
  }

  // Proxy API calls that come through the plugin runtime
  if (path.startsWith('/proxy/')) {
    const proxyPath = path.replace('/proxy', '');
    const target = `${API_URL}${proxyPath}${url.search}`;
    const resp = await fetch(target, { method: req.method, headers: req.headers, body: req.body });
    const data = await resp.json();
    return jsonResp(data, resp.status);
  }

  // Featured resources shortcut — useful for ChatGPT discovery
  if (path === '/featured') {
    const { data } = await supabase
      .from('resources')
      .select('slug, resource_type, title, description, category, compatible_platforms, is_free')
      .eq('is_featured', true)
      .limit(20);
    return jsonResp({ featured: data });
  }

  return jsonResp({ error: 'Not found' }, 404);
});
