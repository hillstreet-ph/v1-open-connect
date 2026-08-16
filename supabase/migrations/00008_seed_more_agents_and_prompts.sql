
-- ─── MORE AGENTS ──────────────────────────────────────────────────────────────
INSERT INTO resources (slug, resource_type, title, description, long_description, category, compatible_platforms, is_free, is_featured, source_url, author, tags)
VALUES
-- Hermes Agent (Nous Research) - from PDF
('hermes-agent', 'agent', 'Hermes Agent', 'Open-source self-hosted AI agent by Nous Research — runs everywhere, lives on 20+ platforms, and builds its own skills.', 'Hermes Agent is the flagship AI agent from Nous Research (creators of the Hermes, Nomos, and Psyche models). It runs on 6 terminal backends (local, Docker, SSH, Daytona, Singularity, Modal), connects to 20+ messaging platforms (Telegram, Discord, Slack, WhatsApp, Signal, Email, SMS, DingTalk, Feishu, WeChat, QQ Bot, Home Assistant, Teams, Google Chat), features persistent memory with FTS5 cross-session recall, a Skills System compatible with agentskills.io, built-in cron scheduling, MCP server integration, voice mode, and parallel sub-agent spawning. Designed for power users who want a fully autonomous self-hosted agent.', 'autonomous-agent', ARRAY['Open WebUI','Claude'], true, true, 'https://hermes-agent.nousresearch.com/', 'Nous Research', ARRAY['hermes','nous-research','self-hosted','autonomous','multi-platform','skills','memory','mcp','voice']),

('hermes-agent-telegram', 'agent', 'Hermes Telegram Agent', 'Deploy Hermes Agent on Telegram — autonomous AI assistant with memory, skills, and voice support on Telegram.', 'A pre-configured Hermes Agent deployment optimized for Telegram. Supports multi-user DMs, group chats, voice messages (STT/TTS), scheduled automations, and skill execution. Configure once and have a fully autonomous Telegram AI assistant with persistent memory.', 'messaging-agent', ARRAY['Open WebUI'], true, false, 'https://hermes-agent.nousresearch.com/docs', 'Nous Research', ARRAY['telegram','hermes','messaging','voice','memory']),

('hermes-agent-discord', 'agent', 'Hermes Discord Agent', 'Deploy Hermes Agent on Discord — AI agent with voice channel support, slash commands, and persistent memory.', 'Hermes Agent Discord integration enables the agent to participate in text and voice channels. Supports slash commands, mention-based activation, voice channel interaction (Discord VC), server-specific memory, and scheduled announcements. Full skill system access from any Discord server.', 'messaging-agent', ARRAY['Open WebUI'], true, false, 'https://hermes-agent.nousresearch.com/docs', 'Nous Research', ARRAY['discord','hermes','voice','skills','memory']),

-- Open-Agent.io agents
('open-agent-research', 'agent', 'Open Agent Research Assistant', 'Deep research agent from Open-Agent.io — autonomously researches topics, synthesizes sources, and produces structured reports.', 'The Open Agent Research Assistant autonomously plans research tasks, queries multiple sources (web search, academic databases, news feeds), cross-references facts, and produces structured Markdown reports with citations. Supports iterative refinement and human-in-the-loop feedback checkpoints.', 'research', ARRAY['Claude','ChatGPT'], false, true, 'https://app.open-agent.io/', 'Open Agent', ARRAY['research','reports','citations','synthesis','autonomous']),

('open-agent-workflow', 'agent', 'Open Agent Workflow Builder', 'Visual workflow builder agent — creates multi-step automated workflows from natural language descriptions.', 'Translates natural language workflow descriptions into executable step-by-step automation plans. Integrates with APIs, webhooks, databases, and file systems. Handles branching logic, error recovery, and workflow monitoring. Part of the Open-Agent.io platform.', 'automation', ARRAY['Claude','ChatGPT'], false, false, 'https://app.open-agent.io/', 'Open Agent', ARRAY['workflow','automation','no-code','planning']),

-- AgentField agents
('agentfield-data-analyst', 'agent', 'AgentField Data Analyst', 'Specialized data analysis agent from AgentField — connects to databases, runs SQL, and generates insights automatically.', 'AgentField''s Data Analyst agent connects to PostgreSQL, MySQL, BigQuery, Snowflake, and CSV files. It understands schema, generates optimized SQL queries, creates visualizations, detects anomalies, and produces executive summaries. No SQL knowledge required.', 'data-analysis', ARRAY['Claude','ChatGPT'], false, true, 'https://agentfield.ai/', 'AgentField', ARRAY['data','sql','analytics','databases','visualization']),

('agentfield-sales-agent', 'agent', 'AgentField Sales Agent', 'AI sales development agent from AgentField — qualifies leads, drafts outreach, and manages pipeline updates.', 'Automates the top of the sales funnel. Researches prospects, scores leads based on ICP criteria, drafts personalized outreach emails, schedules follow-ups, and syncs activity to CRM. Integrates with Salesforce, HubSpot, and Pipedrive.', 'sales', ARRAY['Claude','ChatGPT'], false, false, 'https://agentfield.ai/', 'AgentField', ARRAY['sales','crm','leads','outreach','hubspot']),

('agentfield-support-agent', 'agent', 'AgentField Support Agent', 'Customer support AI agent from AgentField — resolves tickets, escalates complex issues, and learns from feedback.', 'Handles Tier-1 customer support across email, chat, and ticketing systems (Zendesk, Intercom, Freshdesk). Uses RAG over your knowledge base for accurate answers, detects frustration signals for human escalation, and continuously improves from resolved ticket patterns.', 'customer-support', ARRAY['Claude','ChatGPT'], false, false, 'https://agentfield.ai/', 'AgentField', ARRAY['support','tickets','zendesk','intercom','customer-service']),

-- Agency Agents (GitHub: msitarzewski/agency-agents)
('agency-ceo-agent', 'agent', 'Agency CEO Agent', 'Strategic orchestrator agent from Agency Agents framework — manages other agents, sets priorities, and reports outcomes.', 'The CEO agent in the Agency Agents framework acts as the top-level orchestrator. It receives high-level goals, decomposes them into tasks, assigns them to specialist agents (CTO, CFO, CMO, etc.), monitors progress, handles conflicts, and synthesizes final reports. Designed for complex multi-agent business automation.', 'orchestration', ARRAY['Claude','ChatGPT'], true, true, 'https://github.com/msitarzewski/agency-agents', 'msitarzewski', ARRAY['orchestration','multi-agent','agency','strategy','github']),

('agency-developer-agent', 'agent', 'Agency Developer Agent', 'Specialist developer agent from Agency Agents — writes, tests, and deploys code under direction of the CEO agent.', 'A specialized coding agent in the Agency Agents framework. Receives feature specifications, writes clean code, generates tests, handles code review feedback, and manages deployment scripts. Can spawn sub-agents for parallel frontend/backend work.', 'coding', ARRAY['Claude','ChatGPT'], true, false, 'https://github.com/msitarzewski/agency-agents', 'msitarzewski', ARRAY['coding','development','github','agency','testing']),

('agency-researcher-agent', 'agent', 'Agency Researcher Agent', 'Deep research agent from Agency Agents framework — gathers data, validates sources, and synthesizes insights for other agents.', 'Handles research tasks delegated by the CEO agent. Uses web search, document analysis, and API queries to gather evidence. Validates sources, removes duplicates, and produces structured research briefs consumed by other agents in the network.', 'research', ARRAY['Claude','ChatGPT'], true, false, 'https://github.com/msitarzewski/agency-agents', 'msitarzewski', ARRAY['research','agency','web-search','synthesis','github']),

-- LobeHub additional agents
('lobehub-academic-writing', 'agent', 'LobeHub Academic Writing Assistant', 'Academic writing and research agent from LobeHub — helps with papers, citations, literature reviews, and thesis writing.', 'Specialized for academic contexts: formats citations (APA, MLA, Chicago, Vancouver), helps structure research papers, suggests related literature, refines academic prose, and assists with abstract and conclusion writing. Available in the LobeHub agent marketplace.', 'writing', ARRAY['LobeHub','Claude','ChatGPT'], true, false, 'https://lobehub.com/agents', 'LobeHub', ARRAY['academic','writing','citations','research','thesis']),

('lobehub-language-tutor', 'agent', 'LobeHub Language Tutor', 'Language learning AI agent from LobeHub — teaches vocabulary, grammar, and conversation in 50+ languages.', 'Interactive language learning agent with adaptive difficulty. Provides vocabulary drills, grammar exercises, conversational practice, pronunciation tips, and cultural context. Tracks progress across sessions and adjusts to learner level. Available for 50+ languages on LobeHub.', 'education', ARRAY['LobeHub','Claude','ChatGPT'], true, false, 'https://lobehub.com/agents', 'LobeHub', ARRAY['language','learning','education','grammar','vocabulary']),

('lobehub-financial-advisor', 'agent', 'LobeHub Financial Advisor', 'Personal finance AI agent from LobeHub — budgeting, investment basics, and financial planning guidance.', 'Provides financial literacy education and planning assistance. Helps users build budgets, understand investment options (stocks, bonds, ETFs, crypto), plan for retirement, and analyze spending patterns. Note: for educational purposes only, not financial advice.', 'finance', ARRAY['LobeHub','Claude','ChatGPT'], true, false, 'https://lobehub.com/agents', 'LobeHub', ARRAY['finance','budgeting','investing','planning','education']),

('lobehub-ux-designer', 'agent', 'LobeHub UX Designer Agent', 'UX/UI design assistant agent from LobeHub — wireframes, design critiques, accessibility reviews, and design system guidance.', 'Assists product teams with UX tasks: creates wireframe descriptions, provides design critique using established principles (Nielsen heuristics, Gestalt), reviews accessibility (WCAG compliance), suggests component patterns, and helps document design systems.', 'design', ARRAY['LobeHub','Claude'], true, false, 'https://lobehub.com/agents', 'LobeHub', ARRAY['ux','ui','design','wireframes','accessibility']),

-- SwarmClaw additional agents
('swarmclaw-devops-agent', 'agent', 'SwarmClaw DevOps Agent', 'Infrastructure and DevOps automation agent — manages CI/CD pipelines, monitors deployments, and resolves incidents.', 'SwarmClaw''s DevOps agent automates infrastructure tasks: triggers CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI), monitors deployment health, detects and diagnoses production incidents, rolls back failed deployments, and generates incident reports.', 'devops', ARRAY['SwarmClaw','Claude','ChatGPT'], true, true, 'https://www.swarmclaw.ai/', 'SwarmClaw', ARRAY['devops','cicd','infrastructure','deployment','monitoring']),

('swarmclaw-content-writer', 'agent', 'SwarmClaw Content Writer', 'AI content creation agent from SwarmClaw — writes blog posts, social copy, newsletters, and marketing content.', 'Produces long-form and short-form content for marketing teams. Given a brief, it researches the topic, outlines structure, writes drafts, optimizes for SEO, and adapts tone for different channels (blog, LinkedIn, Twitter, email). Supports brand voice guidelines.', 'content', ARRAY['SwarmClaw','LobeHub'], true, false, 'https://www.swarmclaw.ai/', 'SwarmClaw', ARRAY['content','writing','seo','marketing','blog']),

-- Open WebUI community agents
('openwebui-code-reviewer', 'agent', 'Open WebUI Code Reviewer', 'Code review agent for Open WebUI — analyzes pull requests, detects bugs, and suggests improvements.', 'A community-built Open WebUI agent that performs thorough code reviews. Analyzes code for bugs, security vulnerabilities, performance issues, and style violations. Supports Python, JavaScript, TypeScript, Go, Rust, and more. Outputs structured review comments with severity ratings.', 'coding', ARRAY['Open WebUI','Claude','ChatGPT'], true, false, 'https://openwebui.com/', 'Open WebUI Community', ARRAY['code-review','security','bugs','performance','open-source']),

('openwebui-document-summarizer', 'agent', 'Open WebUI Document Summarizer', 'Document summarization agent for Open WebUI — uploads and summarizes PDFs, Word docs, and web pages.', 'Accepts uploaded documents or URLs and produces tiered summaries: executive summary (3 sentences), key points list, and detailed section-by-section breakdown. Supports multi-document comparison and Q&A over the uploaded content using RAG.', 'productivity', ARRAY['Open WebUI'], true, false, 'https://openwebui.com/', 'Open WebUI Community', ARRAY['summarization','documents','pdf','rag','productivity'])

ON CONFLICT (slug) DO NOTHING;

-- ─── MORE PROMPTS ──────────────────────────────────────────────────────────────
INSERT INTO resources (slug, resource_type, title, description, long_description, category, compatible_platforms, is_free, is_featured, prompt_content, source_url, author, tags)
VALUES
('hermes-soul-prompt', 'prompt', 'Hermes Soul Prompt (SOULmd)', 'Define the default personality and behavioral identity of a Hermes Agent deployment.', 'The SOULmd prompt file defines the agent''s persistent personality traits, communication style, ethical boundaries, and default behaviors. This is the foundational identity layer for Hermes Agent — all interactions are filtered through this persona definition.', 'agent-identity', ARRAY['Open WebUI'], true, true,
'---
name: Hermes
role: Autonomous AI Assistant
personality:
  - Thoughtful and precise in responses
  - Proactively asks clarifying questions
  - Uses structured formatting for complex answers
  - Maintains consistent tone across platforms
ethics:
  - Never deceives the user
  - Flags uncertainty with confidence levels
  - Escalates dangerous requests with explanation
defaults:
  response_format: markdown
  memory_enabled: true
  skills_enabled: true
---
You are Hermes, an autonomous AI assistant built by Nous Research. Your core mission is to be genuinely useful while being honest about your capabilities and limitations. You maintain persistent memory across sessions and continuously improve through your Skills System. Always think step-by-step for complex tasks and proactively suggest relevant follow-up actions.',
'https://hermes-agent.nousresearch.com/docs', 'Nous Research', ARRAY['hermes','soul','personality','identity','nous-research']),

('swarmclaw-master-prompt', 'prompt', 'SwarmClaw Master Agent Prompt', 'Master system prompt for SwarmClaw multi-agent deployments — orchestrates tool use and sub-agent delegation.', 'The definitive system prompt for deploying SwarmClaw as a coordinating master agent. Defines tool selection logic, delegation patterns, error handling, and output formatting. Compatible with Claude, GPT-4, and Llama 3.', 'orchestration', ARRAY['SwarmClaw','Claude','ChatGPT'], true, true,
'You are a SwarmClaw master orchestration agent. Your role is to:

1. ANALYZE the user request and determine if it requires single-agent or multi-agent execution
2. SELECT the appropriate tools from your available toolkit based on task requirements
3. DELEGATE sub-tasks to specialized agents when parallel execution is beneficial
4. SYNTHESIZE results from multiple sources into a coherent, actionable response
5. VERIFY completion criteria before marking any task as done

Tool Selection Rules:
- Use web_search for any question requiring current information
- Use code_executor for calculations, data processing, or file manipulation
- Use memory_store to save important facts the user will reference again
- Always use the minimum number of tools needed to complete the task

Output Format:
- Lead with the direct answer/result
- Follow with methodology only if asked
- Flag any uncertainties or assumptions made',
'https://www.swarmclaw.ai/', 'SwarmClaw', ARRAY['orchestration','system-prompt','multi-agent','tools','swarmclaw']),

('openwebui-rag-system-prompt', 'prompt', 'Open WebUI RAG System Prompt', 'Optimized system prompt for RAG-powered Open WebUI agents — maximizes document retrieval accuracy and citation quality.', 'A carefully engineered system prompt that guides Open WebUI agents to use RAG context effectively. Instructs the agent to always cite source documents, acknowledge when information is not in the knowledge base, and distinguish between retrieved facts and general knowledge.', 'rag', ARRAY['Open WebUI'], true, false,
'You are a knowledgeable assistant with access to a document knowledge base. When answering questions:

RETRIEVAL RULES:
1. Always search the knowledge base first before using general knowledge
2. If the answer is found in documents: cite the specific document and section
3. If the answer is NOT in documents: clearly state "This is not in your knowledge base — answering from general knowledge:"
4. Never fabricate citations or document references

RESPONSE FORMAT:
- Direct answer first
- Citation: [Document Name, Section/Page]
- Confidence: High (from documents) / Medium (general knowledge) / Low (uncertain)

If the user uploads a new document, acknowledge it and confirm it has been indexed before answering questions about it.',
'https://openwebui.com/', 'Open WebUI Community', ARRAY['rag','system-prompt','citations','knowledge-base','open-webui']),

('claude-xml-tool-use-prompt', 'prompt', 'Claude XML Tool Use Prompt', 'System prompt template for Claude tool-use — structured XML format for reliable function calling.', 'Claude responds best to tool definitions provided in XML format. This template shows the canonical structure for defining tools, providing examples, and instructing Claude to use them correctly with proper parameter validation and error handling.', 'tool-use', ARRAY['Claude'], true, true,
'You have access to the following tools. Use them when they are the most appropriate way to answer the user''s request.

<tools>
<tool>
<name>web_search</name>
<description>Search the web for current information. Use when the user asks about recent events, current data, or facts you might not have.</description>
<parameters>
  <parameter name="query" type="string" required="true">The search query</parameter>
  <parameter name="num_results" type="integer" required="false" default="5">Number of results to return</parameter>
</parameters>
</tool>
</tools>

Tool Use Rules:
1. Only call a tool when it is genuinely needed
2. Always explain what tool you are using and why
3. If a tool returns an error, inform the user and try an alternative approach
4. Synthesize tool results — do not just dump raw output

Respond in <result> tags after completing tool calls.',
'https://docs.anthropic.com/', 'Anthropic', ARRAY['claude','tools','xml','function-calling','structured']),

('gpt-structured-output-prompt', 'prompt', 'GPT-4 Structured Output Prompt', 'System prompt for GPT-4 JSON mode — ensures consistent structured output for agent workflows.', 'Forces GPT-4 to produce valid, schema-compliant JSON output for downstream agent consumption. Includes field definitions, type constraints, and handling instructions for missing or ambiguous data.', 'structured-output', ARRAY['ChatGPT'], true, false,
'You are a data extraction assistant. Always respond with valid JSON matching the required schema.

RESPONSE SCHEMA:
{
  "status": "success" | "partial" | "error",
  "data": { /* extracted fields */ },
  "confidence": 0.0-1.0,
  "missing_fields": ["field1", "field2"],
  "notes": "Any important caveats or assumptions"
}

EXTRACTION RULES:
1. Extract only what is explicitly stated — do not infer unless confidence < 0.7
2. Set confidence based on: 1.0=explicitly stated, 0.7=clearly implied, 0.4=uncertain, 0.0=not found
3. List all fields you could not extract in missing_fields
4. Never return invalid JSON — if unsure, use the error status

Respond ONLY with the JSON object. No markdown, no explanation outside the JSON.',
'https://platform.openai.com/', 'OpenAI', ARRAY['ChatGPT','structured-output','json','extraction','function-calling']),

('multi-agent-coordination-prompt', 'prompt', 'Multi-Agent Coordination Prompt', 'System prompt for coordinating multiple AI agents — defines communication protocols and handoff patterns.', 'Used in multi-agent frameworks (Agency Agents, SwarmClaw, LangGraph) to give each agent clear instructions about its role, how to communicate task results to other agents, and how to handle failures gracefully.', 'orchestration', ARRAY['Claude','ChatGPT','Open WebUI'], true, true,
'You are Agent [ROLE] in a multi-agent system. Your responsibilities are clearly scoped:

YOUR ROLE: [AGENT_ROLE_DESCRIPTION]
YOUR INPUTS: [DESCRIBE_EXPECTED_INPUTS]
YOUR OUTPUTS: [DESCRIBE_EXPECTED_OUTPUTS]

COMMUNICATION PROTOCOL:
- When you complete a task: respond with TASK_COMPLETE: [summary]
- When you need more information: respond with NEED_INPUT: [specific question]
- When you cannot complete a task: respond with TASK_FAILED: [reason] SUGGEST: [alternative]
- Never respond outside these formats when communicating with other agents

DELEGATION RULES:
- If a subtask is outside your scope, return it with DELEGATE: [suggested_agent]: [task]
- Do not attempt tasks outside your defined role
- Always validate your inputs before processing — return INPUT_ERROR if invalid

QUALITY CHECKLIST:
□ Have I addressed the complete request?
□ Is my output in the expected format?
□ Have I flagged any assumptions or uncertainties?',
'https://agencyagents.dev/agents', 'Agency Agents', ARRAY['multi-agent','coordination','orchestration','protocol','agency']),

('lobehub-persona-builder-prompt', 'prompt', 'LobeHub Persona Builder Prompt', 'Meta-prompt for building custom AI personas on LobeHub — define personality, expertise, and communication style.', 'A structured template for creating custom agent personas on LobeHub. Fill in the role, domain expertise, communication style, and behavioral constraints to generate a complete system prompt for your custom agent.', 'persona', ARRAY['LobeHub','Claude','ChatGPT'], true, false,
'# Persona Builder Template

## Identity
Name: [AGENT_NAME]
Role: [PRIMARY_ROLE]
Domain Expertise: [DOMAIN_1], [DOMAIN_2], [DOMAIN_3]

## Communication Style
- Tone: [professional/casual/academic/friendly]
- Response Length: [concise/detailed/adaptive]
- Format Preference: [markdown/plain/structured]
- Language: [primary language(s)]

## Expertise Depth
- Expert In: [topics where agent responds with high confidence]
- Familiar With: [topics where agent notes it may be incomplete]
- Outside Scope: [topics agent should decline or redirect]

## Behavioral Rules
1. Always [positive behavior]
2. Never [prohibited behavior]
3. When uncertain: [uncertainty handling approach]
4. For sensitive topics: [handling approach]

## Example Interaction
User: [example question]
Agent: [example ideal response demonstrating the persona]',
'https://lobehub.com/', 'LobeHub', ARRAY['persona','template','lobehub','system-prompt','customization']),

('omni-agent-skill-prompt', 'prompt', 'Omni Agent Skill Prompt', 'System prompt for Omni agent skills — structured format for defining reusable agent capabilities in the Omni platform.', 'Omni agent skills are defined using a specific prompt structure that connects to Omni''s semantic layer. This template shows how to define an agent skill that queries Omni dashboards, formats results, and handles edge cases.', 'agent-skill', ARRAY['Claude','ChatGPT'], false, false,
'# Omni Agent Skill Definition

## Skill Metadata
name: [SKILL_NAME]
version: 1.0
description: [WHAT_THIS_SKILL_DOES]
triggers: [keywords or patterns that activate this skill]

## Context
You have access to the Omni semantic data layer. When the user asks about business metrics:
1. Identify the relevant metric or dimension from their question
2. Call the omni_query tool with the appropriate metric name
3. Format the response with: current value, trend (vs prior period), and key drivers

## Query Patterns
- "What is our [metric]?" → query current period value
- "How did [metric] change?" → query with period comparison
- "Break down [metric] by [dimension]" → query with dimension grouping

## Output Format
Always structure metric responses as:
📊 **[Metric Name]**: [Value] ([Change vs prior period])
📈 Trend: [Up/Down/Flat] by [X]%
🔍 Key Drivers: [top 2-3 factors]',
'https://docs.omni.co/developers/agent-skills', 'Omni', ARRAY['omni','analytics','skill','data','business-intelligence'])

ON CONFLICT (slug) DO NOTHING;
