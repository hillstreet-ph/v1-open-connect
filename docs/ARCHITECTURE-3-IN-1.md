# Open-Connect — 3-in-1 Architecture

Open-Connect is one public product at `https://open-connect.site` with three capability planes behind one account, one dashboard, and one gateway.

## 1. AI Agent Skills Library

Open-Connect owns the capability registry for Skills, MCP, Tools, Plugins, Agents, and Prompts.

## 2. Connections and Credentials

The connection plane uses Pipedream Connect-style managed app connections for OAuth, API integrations, actions, triggers, and workflows. Provider credentials and refresh tokens must never be returned to AI clients. Open-Connect stores only safe connection metadata/references where possible.

## 3. AI Model Gateway

LiteLLM is the model proxy plane. It provides one OpenAI-compatible model API for configured providers, routing, fallback, quotas, and usage controls. Provider secrets stay server-side.

## External contract

AI clients such as Hermes Agent, ChatGPT integrations, and custom agents connect to Open-Connect rather than configuring every provider independently.

- Web: `https://open-connect.site`
- REST: `https://open-connect.site/api/v1`
- MCP: `https://open-connect.site/mcp`
- Models: `https://open-connect.site/v1`
- OAuth: `https://open-connect.site/oauth`

## Core infrastructure

- GitHub: source, skills, CI/CD, releases
- Cloudflare: domain, TLS, edge routing, frontend hosting/gateway
- Supabase: PostgreSQL, authentication, RLS, registry, connection metadata, audit

## Security invariants

1. Never expose Supabase service-role credentials to browsers or agents.
2. Never expose Pipedream/provider OAuth refresh tokens to agents.
3. Never expose the LiteLLM master key to community clients.
4. User-facing Open-Connect keys are scoped, revocable, hash-at-rest credentials.
5. RLS is required for user-owned database records.
6. Production and development configuration must remain separated.
