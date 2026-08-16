import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Key, Server, Zap, Globe, BookOpen, CheckCircle, Terminal, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BASE = 'https://hclzajrfohycvoysknkq.supabase.co/functions/v1';
const API_BASE  = `${BASE}/oc-api`;
const MCP_BASE  = `${BASE}/oc-mcp`;
const PLUGIN_BASE = `${BASE}/oc-plugin`;

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const copy = () => { navigator.clipboard.writeText(code); toast.success('Copied!'); };
  return (
    <div className="relative group rounded-lg bg-muted border border-border overflow-x-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{lang}</span>
        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={copy}>
          <Copy className="h-3 w-3" /> Copy
        </Button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed text-foreground whitespace-pre overflow-x-auto">{code}</pre>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, badge }: { icon: React.ComponentType<{className?: string}>; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h2 className="text-xl font-semibold flex-1 min-w-0">{title}</h2>
      {badge && <Badge variant="secondary" className="shrink-0">{badge}</Badge>}
    </div>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const color = method === 'GET' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <span className={cn('shrink-0 text-xs font-bold px-2 py-0.5 rounded font-mono', color)}>{method}</span>
      <div className="flex-1 min-w-0">
        <code className="text-xs font-mono text-foreground break-all">{path}</code>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function CollapseSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors" onClick={() => setOpen(v => !v)}>
        {title}
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">{children}</div>}
    </div>
  );
}

export default function GatewayPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 w-full">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">Gateway</Badge>
          <Badge variant="outline" className="text-primary border-primary/30">v1.0</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-3 text-balance">Open Connect Gateway</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed text-pretty">
          Connect your AI apps directly to Open Connect's 200+ resources via REST API, MCP Server, or ChatGPT Plugin.
          Search, fetch, and use skills, agents, plugins, MCP servers, and prompts from inside any AI assistant.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link to="/api-keys">
            <Button><Key className="h-4 w-4 mr-2" /> Get API Key</Button>
          </Link>
          <a href={`${PLUGIN_BASE}/.well-known/ai-plugin.json`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" /> ai-plugin.json</Button>
          </a>
          <a href={`${PLUGIN_BASE}/openapi.yaml`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" /> OpenAPI Spec</Button>
          </a>
        </div>
      </div>

      {/* Capability cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Globe,    title: 'REST API',        desc: 'Standard JSON REST — use from any app, script, or workflow.',  badge: 'Bearer token' },
          { icon: Terminal, title: 'MCP Server',       desc: 'JSON-RPC 2.0 — connect Claude Desktop, Cursor, Open WebUI.',  badge: 'JSON-RPC 2.0' },
          { icon: Zap,      title: 'ChatGPT Plugin',  desc: 'OpenAI Plugin manifest — install directly in ChatGPT.',       badge: 'OpenAI spec' },
        ].map(({ icon: Icon, title, desc, badge }) => (
          <Card key={title} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">{title}</CardTitle>
                <Badge variant="outline" className="text-xs ml-auto">{badge}</Badge>
              </div>
              <CardDescription className="text-xs">{desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main tabs */}
      <Tabs defaultValue="rest">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="rest">REST API</TabsTrigger>
          <TabsTrigger value="mcp">MCP Server</TabsTrigger>
          <TabsTrigger value="plugin">ChatGPT Plugin</TabsTrigger>
        </TabsList>

        {/* ── REST API ── */}
        <TabsContent value="rest" className="space-y-8">
          <div>
            <SectionHeader icon={Globe} title="REST API" badge="No auth for public read" />
            <Card className="mb-6">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">Base URL</p>
                <CodeBlock code={API_BASE} lang="text" />
                <p className="text-xs text-muted-foreground mt-4 mb-3">Authentication — add your API key as a header or query param:</p>
                <CodeBlock code={`Authorization: Bearer YOUR_API_KEY\n# or\n?apikey=YOUR_API_KEY`} lang="http" />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader><CardTitle className="text-sm">Endpoints</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <Endpoint method="GET" path="/search?q=blog+post&type=skills" desc="Search all resources and skills by keyword, type, and platform" />
                <Endpoint method="GET" path="/resources?type=agents&platform=claude&limit=20" desc="List resources filtered by type, platform, category, featured" />
                <Endpoint method="GET" path="/resources/:slug" desc="Get full resource with prompt_content (requires API key for full text)" />
                <Endpoint method="GET" path="/skills?platform=chatgpt&category=productivity" desc="List skills with optional platform/category filters" />
                <Endpoint method="GET" path="/skills/:slug" desc="Get full skill details with prompt content" />
                <Endpoint method="GET" path="/categories" desc="List all resource categories" />
                <Endpoint method="GET" path="/platforms" desc="List all supported AI platforms" />
              </CardContent>
            </Card>

            <CollapseSection title="Example: Search resources" defaultOpen>
              <CodeBlock code={`curl "${API_BASE}/search?q=email+writer&type=skills&platform=claude" \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
            </CollapseSection>
            <CollapseSection title="Example: Get full skill prompt">
              <CodeBlock code={`curl "${API_BASE}/skills/meeting-notes" \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
            </CollapseSection>
            <CollapseSection title="Example: List all agents for ChatGPT">
              <CodeBlock code={`curl "${API_BASE}/resources?type=agents&platform=chatgpt&limit=50" \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
            </CollapseSection>
            <CollapseSection title="Python example">
              <CodeBlock code={`import requests

API_KEY = "YOUR_API_KEY"
BASE = "${API_BASE}"

# Search for email skills
r = requests.get(f"{BASE}/search",
    params={"q": "email", "type": "skills"},
    headers={"Authorization": f"Bearer {API_KEY}"}
)
results = r.json()
for item in results["results"]["skills"]:
    print(item["title"], "-", item["slug"])`} lang="python" />
            </CollapseSection>

            <div className="mt-6 flex gap-3">
              <Link to="/api-keys">
                <Button size="sm"><Key className="h-4 w-4 mr-2" /> Manage API Keys</Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        {/* ── MCP Server ── */}
        <TabsContent value="mcp" className="space-y-8">
          <div>
            <SectionHeader icon={Terminal} title="MCP Server" badge="JSON-RPC 2.0" />
            <Card className="mb-6">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">MCP Endpoint (HTTP transport)</p>
                <CodeBlock code={MCP_BASE} lang="text" />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader><CardTitle className="text-sm">Available Tools</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  { name: 'search_resources', desc: 'Search across all resource types by keyword, type, and platform' },
                  { name: 'get_resource',     desc: 'Retrieve full resource or skill including ready-to-use prompt_content' },
                  { name: 'list_resources',   desc: 'Browse resources by type (agents, plugins, mcp, prompts, tools, skills)' },
                  { name: 'get_categories',   desc: 'List all available categories' },
                  { name: 'get_platforms',    desc: 'List all supported AI platforms with descriptions' },
                ].map(t => (
                  <div key={t.name} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <code className="text-xs font-mono text-foreground">{t.name}</code>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <CollapseSection title="Claude Desktop — mcp_servers config" defaultOpen>
              <CodeBlock code={`{
  "mcpServers": {
    "open-connect": {
      "transport": "http",
      "url": "${MCP_BASE}"
    }
  }
}`} lang="json" />
              <p className="text-xs text-muted-foreground">Add this to your <code>claude_desktop_config.json</code> (Settings → Developer → Edit Config).</p>
            </CollapseSection>

            <CollapseSection title="Cursor / Windsurf config">
              <CodeBlock code={`{
  "mcpServers": {
    "open-connect": {
      "url": "${MCP_BASE}",
      "transport": "streamable-http"
    }
  }
}`} lang="json" />
            </CollapseSection>

            <CollapseSection title="Open WebUI MCP Tool">
              <CodeBlock code={`# In Open WebUI → Settings → Tools → Add Tool
URL:  ${MCP_BASE}
Type: MCP (JSON-RPC)
Name: Open Connect`} lang="text" />
            </CollapseSection>

            <CollapseSection title="Raw JSON-RPC example (curl)">
              <CodeBlock code={`# List available tools
curl -X POST "${MCP_BASE}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Search for blog skills
curl -X POST "${MCP_BASE}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc":"2.0","id":2,
    "method":"tools/call",
    "params":{
      "name":"search_resources",
      "arguments":{"query":"blog post","type":"skills"}
    }
  }'`} />
            </CollapseSection>
          </div>
        </TabsContent>

        {/* ── ChatGPT Plugin ── */}
        <TabsContent value="plugin" className="space-y-8">
          <div>
            <SectionHeader icon={Zap} title="ChatGPT Plugin" badge="OpenAI Plugin Spec v1" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Plugin Manifest', url: `${PLUGIN_BASE}/.well-known/ai-plugin.json`, desc: 'ai-plugin.json' },
                { label: 'OpenAPI Spec',    url: `${PLUGIN_BASE}/openapi.yaml`,               desc: 'openapi.yaml' },
              ].map(({ label, url, desc }) => (
                <Card key={label}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{label}</p>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <ExternalLink className="h-3 w-3" /> Open
                        </Button>
                      </a>
                    </div>
                    <code className="text-xs text-muted-foreground break-all">{url}</code>
                  </CardContent>
                </Card>
              ))}
            </div>

            <CollapseSection title="Install in ChatGPT (Plugin Protocol)" defaultOpen>
              <ol className="space-y-3 text-sm">
                {[
                  'In ChatGPT, go to Settings → Beta Features → Plugins (or use GPT builder).',
                  'Click "Develop your own plugin" or "Install unverified plugin".',
                  `Enter the plugin manifest URL: ${PLUGIN_BASE}/.well-known/ai-plugin.json`,
                  'ChatGPT will auto-fetch the OpenAPI spec and register all endpoints.',
                  'Open a chat and start with: "Search Open Connect for email writing skills for Claude".',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </CollapseSection>

            <CollapseSection title="Build a Custom GPT with Open Connect">
              <p className="text-xs text-muted-foreground mb-3">In ChatGPT → Explore GPTs → Create a GPT → Actions → Add action</p>
              <CodeBlock code={`Schema URL: ${PLUGIN_BASE}/openapi.yaml

# Or paste the spec directly from:
# ${PLUGIN_BASE}/openapi.yaml`} lang="text" />
              <p className="text-xs text-muted-foreground mt-3">Your Custom GPT will have access to all Open Connect search and retrieval tools.</p>
            </CollapseSection>

            <CollapseSection title="Example ChatGPT system prompt for your Custom GPT">
              <CodeBlock code={`You are a helpful AI assistant with access to Open Connect — a unified AI resource hub.

When users ask for AI skills, tools, agents, plugins, or prompts:
1. Use searchResources to find relevant resources
2. Use getResource or getSkill to retrieve full prompt_content
3. Present the prompt_content directly so the user can copy and use it

Always search before saying a resource doesn't exist.
Prefer resources compatible with the user's AI platform when specified.`} lang="text" />
            </CollapseSection>

            <CollapseSection title="Other integrations">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium mb-2">LobeHub Plugin</p>
                  <CodeBlock code={`# Add as a custom plugin in LobeHub → Settings → Plugins
Manifest: ${PLUGIN_BASE}/.well-known/ai-plugin.json`} lang="text" />
                </div>
                <div>
                  <p className="text-xs font-medium mb-2">n8n / Make.com Webhook</p>
                  <CodeBlock code={`# HTTP Request node
Method: GET
URL:    ${API_BASE}/search?q={{query}}&type={{resource_type}}
Header: Authorization: Bearer YOUR_API_KEY`} lang="text" />
                </div>
              </div>
            </CollapseSection>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick ref */}
      <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Quick Reference</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { label: 'REST API base', value: API_BASE },
            { label: 'MCP endpoint',  value: MCP_BASE },
            { label: 'Plugin manifest', value: `${PLUGIN_BASE}/.well-known/ai-plugin.json` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-muted-foreground mb-1">{label}</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-primary truncate flex-1 min-w-0">{value}</code>
                <button onClick={() => { navigator.clipboard.writeText(value); toast.success('Copied!'); }} className="shrink-0 text-muted-foreground hover:text-foreground">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/api-keys">
          <Button variant="outline" size="sm"><Key className="h-4 w-4 mr-2" /> Manage API Keys</Button>
        </Link>
        <a href={`${PLUGIN_BASE}/openapi.yaml`} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm"><Server className="h-4 w-4 mr-2" /> OpenAPI Spec</Button>
        </a>
      </div>
    </div>
  );
}
