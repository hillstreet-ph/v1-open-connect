# Open-Connect Service Topology

Open-Connect is one public platform at `https://open-connect.site` backed by three repositories.

| Plane | Repository | Public surface |
|---|---|---|
| Skills / product / toolkits | `hillstreet-ph/open-connect` | `/`, `/skills`, `/toolkits`, `/api/v1/*`, `/mcp` |
| Connections engine | `hillstreet-ph/open-connect-connections` | `/apps`, `/connections`, `/oauth/*`, `/api/v1/connections/*` |
| Model engine | `hillstreet-ph/open-connect-models` | `/models`, `/v1/*` |

## User experience

Users get one Open-Connect account, one dashboard, one resource search, and Toolkits that combine capabilities from all three planes.

A Toolkit can include:

- Skills, prompts, agents, MCP servers, tools, plugins and references
- Connected applications, actions, triggers and workflows
- Model aliases, providers, routing policy, limits and budgets
- Explicit permissions/scopes

External clients connect to Open-Connect rather than directly to provider credentials.

Supported integration surfaces are designed around:

- MCP: `https://open-connect.site/mcp`
- REST: `https://open-connect.site/api/v1/*`
- OAuth facade: `https://open-connect.site/oauth/*`
- OpenAI-compatible models: `https://open-connect.site/v1/*`

## Infrastructure

- GitHub: source control and CI/CD
- Cloudflare: public domain, TLS, frontend/static assets, edge routing
- Supabase: authentication, PostgreSQL, RLS, registry and audit state
- Connections runtime: upstream-derived Pipedream integration components/service layer
- Models runtime: upstream-derived LiteLLM proxy/service

## Secret boundary

Browser and agent clients must never receive Supabase service-role credentials, provider OAuth refresh tokens, Pipedream/provider secrets, LiteLLM master credentials, or raw model-provider API keys.
