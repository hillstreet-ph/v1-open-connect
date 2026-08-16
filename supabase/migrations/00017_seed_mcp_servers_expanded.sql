
INSERT INTO resources (slug, resource_type, title, description, long_description, category, compatible_platforms, is_free, is_featured, prompt_content, source_url, author, tags) VALUES

('mcp-filesystem-server', 'mcp', 'Filesystem MCP Server', 'Read, write, list, search and manage files on the local filesystem through a standardized MCP interface.',
'The official Anthropic Filesystem MCP Server provides AI agents with controlled access to the local file system. It supports reading/writing files, listing directories, searching by content or pattern, moving/copying files, and watching for changes. Configurable access controls limit which paths agents can touch.',
'documents-data', ARRAY['Claude', 'Open WebUI', 'Hermes Agent'], true, true,
'## Filesystem MCP Server

### Installation
```bash
npm install -g @modelcontextprotocol/server-filesystem
# or
npx @modelcontextprotocol/server-filesystem /path/to/allowed/dir
```

### Claude Desktop Config
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents",
        "/Users/username/Projects"
      ]
    }
  }
}
```

### Available Tools
```
read_file          — Read the complete contents of a file
read_multiple_files — Read multiple files at once
write_file         — Create or overwrite a file with content
edit_file          — Make line-based edits to a file
create_directory   — Create a new directory
list_directory     — Get directory listing (files + subdirs)
directory_tree     — Recursive directory structure as tree
move_file          — Move or rename a file/directory
search_files       — Regex/glob search across file contents
get_file_info      — Get metadata (size, created, modified, permissions)
list_allowed_directories — Show which paths are accessible
```

### Security Model
- Only paths explicitly listed in args are accessible
- No symlink traversal outside allowed dirs
- Paths are validated and normalized before all operations
- Write operations create backups optionally

### Example Interactions
"Read the package.json in my project"
"Search all .ts files for TODO comments"
"Create a new file called notes.md with today''s date as the title"
"List all Python files modified in the last 7 days"',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['filesystem', 'files', 'local', 'storage', 'read-write']),

('mcp-postgres-server', 'mcp', 'PostgreSQL MCP Server', 'Query and inspect PostgreSQL databases — run SELECT queries, explore schema, get table stats.',
'The PostgreSQL MCP Server gives AI models read access to PostgreSQL databases. It can execute queries, describe table schemas, list databases and tables, get column statistics, explain query plans, and retrieve sample data. Designed for data exploration and analysis workflows.',
'documents-data', ARRAY['Claude', 'Open WebUI', 'Hermes Agent'], true, true,
'## PostgreSQL MCP Server

### Installation
```bash
npm install -g @modelcontextprotocol/server-postgres
```

### Configuration
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://username:password@localhost:5432/dbname"
      ]
    }
  }
}
```

### Connection String Formats
```
# Standard
postgresql://user:pass@host:5432/dbname

# With SSL
postgresql://user:pass@host:5432/dbname?sslmode=require

# With connection pool settings
postgresql://user:pass@host:5432/dbname?pool_min=2&pool_max=10
```

### Available Tools
```
query              — Execute a read-only SQL query
list_schemas       — List all database schemas
list_tables        — List tables in a schema with row counts
describe_table     — Get column names, types, constraints, indexes
get_table_stats    — Row count, size, bloat, last vacuum/analyze
explain_query      — Get EXPLAIN ANALYZE output for a query
sample_data        — Get N random rows from a table
```

### Safety: Read-Only Enforcement
The server wraps all queries in a READ ONLY transaction:
```sql
BEGIN TRANSACTION READ ONLY;
-- your query here
COMMIT;
```
This prevents any accidental data modification.

### Example Queries the Agent Can Run
```sql
-- Find tables with most data
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||''.''||tablename))
FROM pg_tables WHERE schemaname = ''public'' ORDER BY pg_total_relation_size DESC;

-- Check for missing indexes on foreign keys
SELECT ... [standard FK index check query]
```',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['postgresql', 'database', 'sql', 'data-analysis', 'schema']),

('mcp-brave-search-server', 'mcp', 'Brave Search MCP Server', 'Real-time web and news search via Brave Search API — privacy-focused, no Google tracking.',
'The Brave Search MCP Server integrates Brave''s privacy-respecting search engine into AI workflows. Performs web search, news search, and image search with clean results. Requires a Brave Search API key (free tier available at 2000 queries/month).',
'research-analysis', ARRAY['Claude', 'Open WebUI', 'Hermes Agent'], true, false,
'## Brave Search MCP Server

### API Key Setup
1. Visit https://brave.com/search/api/
2. Sign up for free tier (2000 queries/month free)
3. Copy your API key

### Installation & Config
```bash
npm install -g @modelcontextprotocol/server-brave-search
```

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSAxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Available Tools
```
brave_web_search   — Web search with count, offset, freshness params
brave_local_search — Local business/place search with location
brave_news_search  — News articles with recency filtering
brave_image_search — Image search results
```

### Search Parameters
```
query         — Search query (required)
count         — Results per page: 1-20 (default 10)
offset        — Pagination offset
freshness     — pd (past day), pw (past week), pm (past month), py (past year)
search_lang   — Language: en, de, fr, es, zh, ja, etc.
country       — Country: us, gb, de, fr, jp, etc.
safe_search   — strict, moderate, off
```

### Response Format
Each result includes:
```json
{
  "title": "Result Title",
  "url": "https://example.com",
  "description": "Snippet of page content...",
  "age": "2 hours ago",
  "page_age": "2024-01-15T10:30:00Z"
}
```

### Usage Tips
- Combine with filesystem MCP to save search results to files
- Use freshness param for news monitoring workflows
- Brave doesn''t track queries — ideal for privacy-sensitive research',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['search', 'brave', 'web', 'news', 'privacy']),

('mcp-memory-server', 'mcp', 'Memory MCP Server', 'Persistent key-value memory store for AI agents — remember facts, context and state across conversations.',
'The Memory MCP Server provides persistent memory for AI agents. Store and retrieve facts, user preferences, ongoing context, and structured data across conversation sessions. Uses a local knowledge graph with entity relationships. Agents can add entities, create relations between them, and query the memory store semantically.',
'productivity', ARRAY['Claude', 'Open WebUI', 'Hermes Agent', 'SwarmClaw'], true, true,
'## Memory MCP Server

### Installation
```bash
npm install -g @modelcontextprotocol/server-memory
```

### Configuration
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/path/to/memory.json"
      }
    }
  }
}
```

### Knowledge Graph Concepts
The memory server uses an entity-relation graph:
- **Entities**: Named objects with type and observations (facts)
- **Relations**: Typed connections between entities
- **Observations**: Individual facts about an entity

### Available Tools
```
create_entities    — Add new entities with observations
create_relations   — Add relationships between entities
add_observations   — Add facts to existing entities
delete_entities    — Remove entities and their relations
delete_observations — Remove specific facts from entities
delete_relations   — Remove relationships
read_graph         — Get the entire memory graph
search_nodes       — Search entities by name/observation
open_nodes         — Get details on specific entities
```

### Memory Schema Example
```json
{
  "entities": [
    {
      "name": "John Smith",
      "entityType": "person",
      "observations": [
        "Works at Acme Corp as VP Engineering",
        "Prefers async communication",
        "Dog''s name is Rex"
      ]
    }
  ],
  "relations": [
    {
      "from": "John Smith",
      "to": "Acme Corp",
      "relationType": "works_at"
    }
  ]
}
```

### Effective Memory Patterns
- Store user preferences at start of each session
- Record important decisions and their rationale
- Track project context across multiple working sessions
- Build contact/company knowledge graphs for CRM workflows',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['memory', 'persistence', 'knowledge-graph', 'context', 'state']),

('mcp-puppeteer-server', 'mcp', 'Puppeteer Browser MCP Server', 'Control a headless Chrome browser — navigate, screenshot, extract content, fill forms and run JavaScript.',
'The Puppeteer MCP Server gives AI agents full control of a headless Chrome browser. Navigate URLs, take screenshots, extract page text and structure, fill and submit forms, execute JavaScript, handle dialogs, and interact with dynamic web content. Ideal for web automation, testing, and data extraction workflows.',
'productivity', ARRAY['Claude', 'Open WebUI', 'SwarmClaw'], true, false,
'## Puppeteer Browser MCP Server

### Prerequisites
```bash
# Node.js 18+ required
npm install -g @modelcontextprotocol/server-puppeteer
```

### Configuration
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Available Tools
```
puppeteer_navigate      — Navigate to a URL (waits for load)
puppeteer_screenshot    — Take screenshot (returns base64 PNG)
puppeteer_click         — Click an element (CSS selector)
puppeteer_fill          — Fill an input field with text
puppeteer_select        — Choose a dropdown option
puppeteer_hover         — Hover over an element
puppeteer_evaluate      — Execute JavaScript and return result
puppeteer_get_content   — Get the full page HTML content
```

### Common Automation Flows

#### Login and navigate
```
1. puppeteer_navigate(url=login_url)
2. puppeteer_fill(selector="#email", value=email)
3. puppeteer_fill(selector="#password", value=password)
4. puppeteer_click(selector="button[type=submit]")
5. puppeteer_screenshot() — verify login succeeded
6. puppeteer_navigate(url=target_page)
```

#### Extract structured data
```
1. puppeteer_navigate(url=target_url)
2. puppeteer_evaluate(script="
   return Array.from(document.querySelectorAll(''.product'')).map(el => ({
     name: el.querySelector(''.name'').textContent,
     price: el.querySelector(''.price'').textContent
   }))")
```

### Screenshot Tips
- Always take a screenshot after navigation to verify the page loaded correctly
- Screenshots help debug when element selectors don''t work
- Use puppeteer_evaluate for extracting data more reliably than screenshot OCR',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['browser', 'puppeteer', 'automation', 'chrome', 'scraping']),

('mcp-github-server', 'mcp', 'GitHub MCP Server', 'Full GitHub API access — repos, issues, PRs, code search, file operations and workflow management.',
'The GitHub MCP Server provides AI agents with comprehensive access to GitHub repositories. Create and review pull requests, manage issues, search code, read and write files, trigger GitHub Actions workflows, and get repository analytics. Works with both GitHub.com and GitHub Enterprise.',
'documents-data', ARRAY['Claude', 'Open WebUI', 'SwarmClaw'], true, true,
'## GitHub MCP Server

### Setup
```bash
# Get token from https://github.com/settings/tokens
# Scopes needed: repo, read:org, workflow (for Actions)
```

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Available Tools
```
search_repositories    — Search GitHub for repositories
get_file_contents      — Read file from any branch/commit
create_or_update_file  — Create or update a file
push_files             — Push multiple files in one commit
create_repository      — Create new repository
fork_repository        — Fork a repository
create_branch          — Create a new branch
list_commits           — Get commit history
get_commit             — Get details of a specific commit
list_issues            — List issues with filters
get_issue              — Get issue details and comments
create_issue           — Create new issue
update_issue           — Update issue (close, label, assign)
add_issue_comment      — Comment on an issue
list_pull_requests     — List PRs with filters
get_pull_request       — Get PR details and diff
create_pull_request    — Open a new pull request
merge_pull_request     — Merge a PR
search_code            — Search code across GitHub
```

### Power Workflows
"Review this PR and suggest improvements"
"Create an issue for every TODO comment in the codebase"
"Find all repositories using a specific npm package"
"Create a new branch, push a fix, and open a PR"',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['github', 'git', 'code', 'pullrequest', 'devops']),

('mcp-slack-server', 'mcp', 'Slack MCP Server', 'Read and send Slack messages, manage channels, search history and post to workflows.',
'The Slack MCP Server connects AI agents to Slack workspaces. Read channel messages, send messages (as bot or user), search message history, list channels and members, post to incoming webhooks, and trigger Slack workflow steps. Requires a Slack bot token with appropriate scopes.',
'business-operations', ARRAY['Claude', 'Open WebUI', 'Hermes Agent', 'SwarmClaw'], true, false,
'## Slack MCP Server

### Bot Token Setup
```
1. Go to https://api.slack.com/apps → Create New App
2. Add OAuth Scopes under "Bot Token Scopes":
   - channels:read, channels:history
   - chat:write, chat:write.public
   - users:read
   - search:read
   - files:read, files:write
3. Install to workspace → copy Bot User OAuth Token
```

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

### Available Tools
```
slack_list_channels     — List all channels (public/private bot is member of)
slack_post_message      — Post message to channel or DM
slack_reply_to_thread   — Reply to a specific message thread
slack_add_reaction      — Add emoji reaction to message
slack_get_channel_history — Get recent messages from a channel
slack_get_thread_replies  — Get replies in a message thread
slack_search_messages   — Full-text search across workspace
slack_get_users         — List workspace members
slack_get_user_profile  — Get user details by ID
slack_upload_file       — Upload file to channel
```

### Common Agent Workflows
"Post the weekly report to #team-updates"
"Search for messages about the login bug from this week"
"Send a DM to @alice with the meeting summary"
"List all unread messages in #customer-support from today"
"Upload the generated report PDF to #reports channel"',
'https://github.com/modelcontextprotocol/servers', 'Anthropic', ARRAY['slack', 'messaging', 'team', 'notifications', 'collaboration']);
