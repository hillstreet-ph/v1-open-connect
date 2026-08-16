
-- Unified resources table for agents, plugins, mcp, prompts (tools reuse free_tools)
CREATE TABLE IF NOT EXISTS resources (
  id              bigserial PRIMARY KEY,
  slug            text        NOT NULL UNIQUE,
  resource_type   text        NOT NULL CHECK (resource_type IN ('agent','plugin','mcp','prompt','tool')),
  title           text        NOT NULL,
  description     text        NOT NULL DEFAULT '',
  long_description text       DEFAULT NULL,
  category        text        NOT NULL DEFAULT 'General',
  compatible_platforms text[] NOT NULL DEFAULT '{}',
  is_free         boolean     NOT NULL DEFAULT true,
  is_featured     boolean     NOT NULL DEFAULT false,
  prompt_content  text        DEFAULT NULL,
  source_url      text        DEFAULT NULL,
  author          text        DEFAULT NULL,
  tags            text[]      NOT NULL DEFAULT '{}',
  view_count      integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Full-text + gin indexes
CREATE INDEX IF NOT EXISTS resources_type_idx     ON resources (resource_type);
CREATE INDEX IF NOT EXISTS resources_category_idx ON resources (category);
CREATE INDEX IF NOT EXISTS resources_platforms_idx ON resources USING gin (compatible_platforms);
CREATE INDEX IF NOT EXISTS resources_tags_idx      ON resources USING gin (tags);
CREATE INDEX IF NOT EXISTS resources_featured_idx  ON resources (is_featured, view_count DESC);

-- RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='resources' AND policyname='allow_public_read_resources'
  ) THEN
    CREATE POLICY allow_public_read_resources ON resources FOR SELECT USING (true);
  END IF;
END $$;

-- Seed: Agents from lobehub, agencyagents, openwebui, agentfield, multion, swarmclaw, openclaw, clawhub
INSERT INTO resources (slug, resource_type, title, description, category, compatible_platforms, is_featured, tags, source_url) VALUES
-- LobeHub Agents
('lobehub-web-development-expert',     'agent','Web Development Expert','Full-stack web developer specializing in modern JavaScript frameworks, responsive design, and API integration.','Development',   ARRAY['LobeHub','Open WebUI','ChatGPT','Claude'],'true', ARRAY['web','dev','javascript','react'],'https://lobehub.com/agents'),
('lobehub-data-analyst',               'agent','Data Analyst',          'Expert data analyst skilled in Python, SQL, statistical analysis, and data visualization.','Research & Analysis',ARRAY['LobeHub','ChatGPT','Claude'],'true',ARRAY['data','analytics','python','sql'],'https://lobehub.com/agents'),
('lobehub-content-strategist',         'agent','Content Strategist',    'Creative content strategist who plans, creates, and optimizes engaging content across digital channels.','Content & Marketing',ARRAY['LobeHub','ChatGPT','Claude','Gemini Spark'],'true',ARRAY['content','marketing','seo','copywriting'],'https://lobehub.com/agents'),
('lobehub-resume-optimizer',           'agent','Resume Optimizer',      'Professional career coach who reviews and enhances resumes to maximize interview opportunities.','Productivity',ARRAY['LobeHub','ChatGPT'],'false',ARRAY['resume','career','hr'],'https://lobehub.com/agents'),
('lobehub-sql-expert',                 'agent','SQL Database Expert',   'Database specialist proficient in SQL query optimization, schema design, and database management.','Documents & Data',ARRAY['LobeHub','Open WebUI','ChatGPT'],'false',ARRAY['sql','database','query'],'https://lobehub.com/agents'),
('lobehub-code-reviewer',              'agent','Code Reviewer',         'Senior software engineer who provides thorough code reviews focusing on quality, performance, and best practices.','Development',ARRAY['LobeHub','Open WebUI','Claude'],'false',ARRAY['code','review','quality','github'],'https://lobehub.com/agents'),
('lobehub-creative-writer',            'agent','Creative Writer',       'Imaginative storyteller who crafts compelling narratives, fiction, screenplays, and creative content.','Content & Marketing',ARRAY['LobeHub','ChatGPT','Claude'],'false',ARRAY['writing','creative','fiction','stories'],'https://lobehub.com/agents'),
('lobehub-business-plan-advisor',      'agent','Business Plan Advisor', 'Experienced business consultant who helps develop comprehensive business plans and strategies.','Business Operations',ARRAY['LobeHub','ChatGPT','Claude'],'true',ARRAY['business','startup','strategy','planning'],'https://lobehub.com/agents'),
('lobehub-ux-researcher',              'agent','UX Researcher',         'User experience researcher who conducts usability studies and provides actionable design insights.','Web & Design',ARRAY['LobeHub','ChatGPT'],'false',ARRAY['ux','design','research','usability'],'https://lobehub.com/agents'),
('lobehub-email-marketer',             'agent','Email Marketing Expert','Email marketing specialist who creates high-converting campaigns and optimizes for open rates.','Email & Communication',ARRAY['LobeHub','ChatGPT','Gemini Spark'],'false',ARRAY['email','marketing','campaigns'],'https://lobehub.com/agents'),
('lobehub-financial-analyst',          'agent','Financial Analyst',     'Chartered financial analyst providing investment analysis, financial modeling, and market research.','Business Operations',ARRAY['LobeHub','ChatGPT','Claude'],'false',ARRAY['finance','investment','analysis','modeling'],'https://lobehub.com/agents'),
('lobehub-linux-terminal',             'agent','Linux Terminal',        'Expert Linux system administrator and command-line specialist for shell scripting and server management.','Development',ARRAY['LobeHub','Open WebUI'],'true',ARRAY['linux','terminal','bash','devops'],'https://lobehub.com/agents'),
('lobehub-translation-expert',         'agent','Translation Expert',    'Professional linguist offering accurate translation services across 50+ languages with cultural context.','Productivity',ARRAY['LobeHub','ChatGPT','Gemini Spark'],'false',ARRAY['translation','language','multilingual'],'https://lobehub.com/agents'),
('lobehub-academic-paper-reviewer',    'agent','Academic Paper Reviewer','Senior researcher who provides detailed feedback on academic papers, methodology, and citations.','Research & Analysis',ARRAY['LobeHub','Claude','ChatGPT'],'false',ARRAY['academic','research','papers','review'],'https://lobehub.com/agents'),
('lobehub-social-media-manager',       'agent','Social Media Manager',  'Social media strategist who creates engaging content calendars and manages brand presence.','Content & Marketing',ARRAY['LobeHub','ChatGPT','Gemini Spark'],'false',ARRAY['social','media','content','branding'],'https://lobehub.com/agents'),

-- Agency Agents (agencyagents.dev / github.com/msitarzewski/agency-agents)
('agency-blog-post-writer',      'agent','Blog Post Writer Agent',  'Specialized agent for researching and writing SEO-optimized long-form blog posts with proper structure.','Content & Marketing',ARRAY['Claude','ChatGPT','Open WebUI'],'true',ARRAY['blog','writing','seo','content'],'https://agencyagents.dev/agents'),
('agency-client-onboarding',     'agent','Client Onboarding Agent', 'Guides new clients through onboarding workflows, collects information, and sets expectations.','Business Operations',ARRAY['Claude','ChatGPT'],'true',ARRAY['client','onboarding','crm','workflow'],'https://agencyagents.dev/agents'),
('agency-seo-audit',             'agent','SEO Audit Agent',         'Performs comprehensive SEO audits covering on-page optimization, technical SEO, and backlink analysis.','Research & Analysis',ARRAY['Claude','ChatGPT','Gemini Spark'],'true',ARRAY['seo','audit','technical','marketing'],'https://agencyagents.dev/agents'),
('agency-project-manager',       'agent','Project Manager Agent',   'Agile project manager who tracks tasks, coordinates teams, and ensures project delivery on time.','Productivity',ARRAY['Claude','ChatGPT'],'false',ARRAY['project','management','agile','tasks'],'https://agencyagents.dev/agents'),
('agency-lead-qualifier',        'agent','Lead Qualification Agent', 'Sales-focused agent that qualifies inbound leads using BANT methodology and scoring criteria.','Sales & Support',ARRAY['Claude','ChatGPT'],'false',ARRAY['sales','leads','crm','qualification'],'https://agencyagents.dev/agents'),
('agency-copywriting-reviewer',  'agent','Copywriting Reviewer',    'Expert copywriter who reviews and improves marketing copy for clarity, persuasion, and brand voice.','Content & Marketing',ARRAY['Claude','ChatGPT'],'false',ARRAY['copy','writing','review','marketing'],'https://agencyagents.dev/agents'),

-- Open WebUI community agents
('openwebui-document-summarizer','agent','Document Summarizer',     'Processes long documents and produces structured summaries with key points, action items, and highlights.','Documents & Data',ARRAY['Open WebUI','Claude','ChatGPT'],'true',ARRAY['summarize','documents','extraction'],'https://openwebui.com/home'),
('openwebui-research-assistant', 'agent','Research Assistant',      'Comprehensive research agent that gathers, synthesizes, and presents information on any topic.','Research & Analysis',ARRAY['Open WebUI','Claude','ChatGPT','Gemini Spark'],'true',ARRAY['research','analysis','facts'],'https://openwebui.com/home'),
('openwebui-coding-assistant',   'agent','Coding Assistant',        'General-purpose coding agent that writes, debugs, and explains code in multiple languages.','Development',ARRAY['Open WebUI','Claude','ChatGPT'],'true',ARRAY['code','debug','programming','dev'],'https://openwebui.com/home'),

-- AgentField agents
('agentfield-customer-support',  'agent','Customer Support Agent',  'Handles customer inquiries, escalations, and feedback with empathy and resolution focus.','Sales & Support',ARRAY['Claude','ChatGPT','LobeHub'],'true',ARRAY['support','customer','helpdesk','crm'],'https://agentfield.ai/'),
('agentfield-data-extractor',    'agent','Data Extraction Agent',   'Extracts structured data from unstructured text, PDFs, and web pages for analysis or import.','Documents & Data',ARRAY['Claude','ChatGPT'],'false',ARRAY['data','extraction','parsing','automation'],'https://agentfield.ai/'),
('agentfield-contract-reviewer', 'agent','Contract Review Agent',   'Legal-aware agent that reviews contracts, highlights risks, and summarizes key clauses.','Business Operations',ARRAY['Claude','ChatGPT'],'true',ARRAY['legal','contracts','review','compliance'],'https://agentfield.ai/'),

-- MultiOn agents
('multion-browser-automation',   'agent','Browser Automation Agent','MultiOn-powered agent that automates web browsing tasks including form filling and data extraction.','Productivity',ARRAY['ChatGPT','Claude'],'true',ARRAY['browser','automation','web','scraping'],'https://docs.multion.ai/welcome'),
('multion-web-researcher',       'agent','Web Research Agent',      'Autonomously browses the web to research topics, compare products, and compile findings.','Research & Analysis',ARRAY['ChatGPT','Claude'],'true',ARRAY['research','web','autonomous','browse'],'https://docs.multion.ai/welcome'),

-- SwarmClaw agents
('swarmclaw-swarm-coordinator',  'agent','Swarm Coordinator',       'Orchestrates multiple AI agents working in parallel to complete complex multi-step tasks.','Business Operations',ARRAY['SwarmClaw','Claude','ChatGPT'],'true',ARRAY['swarm','orchestration','multi-agent','automation'],'https://www.swarmclaw.ai/'),
('swarmclaw-task-decomposer',    'agent','Task Decomposer',         'Breaks down complex goals into parallel sub-tasks and assigns them to specialized agents.','Productivity',ARRAY['SwarmClaw','Claude','ChatGPT'],'true',ARRAY['decompose','tasks','planning','agents'],'https://www.swarmclaw.ai/'),

-- Plugins (ClaWHub, OpenClaw, SwarmDock)
('clawhub-github-plugin',        'plugin','GitHub Plugin',           'Connect Claude to GitHub for repository browsing, PR reviews, and code management.','Development',ARRAY['Claude','Open WebUI'],'true',ARRAY['github','code','repository','pr'],'https://clawhub.ai/plugins'),
('clawhub-notion-plugin',        'plugin','Notion Plugin',           'Integrate Notion workspaces with Claude for document creation and database management.','Productivity',ARRAY['Claude'],'true',ARRAY['notion','docs','workspace','database'],'https://clawhub.ai/plugins'),
('clawhub-jira-plugin',          'plugin','Jira Plugin',             'Connect Jira to Claude for issue tracking, sprint planning, and project management automation.','Business Operations',ARRAY['Claude'],'false',ARRAY['jira','project','issues','agile'],'https://clawhub.ai/plugins'),
('clawhub-slack-plugin',         'plugin','Slack Plugin',            'Integrate Slack messaging with Claude for team communication and notification workflows.','Business Operations',ARRAY['Claude'],'false',ARRAY['slack','communication','teams','messaging'],'https://clawhub.ai/plugins'),
('clawhub-calendar-plugin',      'plugin','Calendar Plugin',         'Manage Google Calendar events, schedule meetings, and set reminders through Claude.','Productivity',ARRAY['Claude','Gemini Spark'],'true',ARRAY['calendar','schedule','meetings','google'],'https://clawhub.ai/plugins'),
('clawhub-email-plugin',         'plugin','Email Plugin',            'Read, compose, and send emails through Gmail and Outlook integration with Claude.','Email & Communication',ARRAY['Claude','Gemini Spark'],'true',ARRAY['email','gmail','outlook','communication'],'https://clawhub.ai/plugins'),
('clawhub-sheets-plugin',        'plugin','Google Sheets Plugin',   'Read and write Google Sheets data, create formulas, and automate spreadsheet workflows.','Documents & Data',ARRAY['Claude','Gemini Spark'],'true',ARRAY['sheets','spreadsheet','google','data'],'https://clawhub.ai/plugins'),
('clawhub-web-search-plugin',    'plugin','Web Search Plugin',       'Real-time web search integration giving Claude access to current information and news.','Research & Analysis',ARRAY['Claude'],'true',ARRAY['search','web','realtime','news'],'https://clawhub.ai/plugins'),
('openclaw-drive-plugin',        'plugin','Google Drive Plugin',     'Access and manage Google Drive files, folders, and documents through AI agents.','Documents & Data',ARRAY['Claude','Gemini Spark'],'true',ARRAY['drive','google','files','storage'],'https://openclaw.ai/'),
('openclaw-stripe-plugin',       'plugin','Stripe Plugin',           'Access Stripe payment data, manage subscriptions, and handle billing queries through AI.','Business Operations',ARRAY['Claude','ChatGPT'],'false',ARRAY['stripe','payments','billing','saas'],'https://openclaw.ai/'),
('openclaw-hubspot-plugin',      'plugin','HubSpot CRM Plugin',     'Sync HubSpot CRM contacts, deals, and pipeline data with your AI agent workflows.','Sales & Support',ARRAY['Claude','ChatGPT'],'false',ARRAY['hubspot','crm','sales','deals'],'https://openclaw.ai/'),
('swarmdock-docker-plugin',      'plugin','Docker Manager Plugin',   'Manage Docker containers, images, and deployments through natural language commands.','Development',ARRAY['SwarmDock','Open WebUI'],'true',ARRAY['docker','containers','devops','deployment'],'https://www.swarmdock.ai/'),
('swarmdock-kubernetes-plugin',  'plugin','Kubernetes Plugin',       'Orchestrate Kubernetes clusters, pods, and services using AI agent automation.','Development',ARRAY['SwarmDock','Open WebUI'],'false',ARRAY['kubernetes','k8s','devops','cloud'],'https://www.swarmdock.ai/'),

-- MCP Servers (from lobehub.com/mcp)
('mcp-filesystem',         'mcp','Filesystem MCP',         'Model Context Protocol server for reading and writing local files and directories.','Development',ARRAY['Claude','Open WebUI','LobeHub'],'true',ARRAY['filesystem','files','mcp','storage'],'https://lobehub.com/mcp'),
('mcp-github',             'mcp','GitHub MCP',             'MCP server that exposes GitHub repositories, issues, PRs, and commits to AI agents.','Development',ARRAY['Claude','Open WebUI','LobeHub'],'true',ARRAY['github','mcp','code','version-control'],'https://lobehub.com/mcp'),
('mcp-postgres',           'mcp','PostgreSQL MCP',         'MCP server for querying and managing PostgreSQL databases through natural language.','Documents & Data',ARRAY['Claude','Open WebUI','LobeHub'],'true',ARRAY['postgres','database','mcp','sql'],'https://lobehub.com/mcp'),
('mcp-sqlite',             'mcp','SQLite MCP',             'Lightweight MCP server for reading and writing SQLite database files.','Documents & Data',ARRAY['Claude','Open WebUI'],'false',ARRAY['sqlite','database','mcp'],'https://lobehub.com/mcp'),
('mcp-brave-search',       'mcp','Brave Search MCP',       'Web search MCP server powered by Brave Search API for real-time internet queries.','Research & Analysis',ARRAY['Claude','Open WebUI','LobeHub'],'true',ARRAY['search','brave','mcp','web'],'https://lobehub.com/mcp'),
('mcp-puppeteer',          'mcp','Puppeteer MCP',          'Browser automation MCP server for web scraping, screenshots, and form interactions.','Productivity',ARRAY['Claude','Open WebUI'],'true',ARRAY['browser','puppeteer','mcp','automation'],'https://lobehub.com/mcp'),
('mcp-slack',              'mcp','Slack MCP',              'MCP integration for reading and sending Slack messages, channels, and workspace data.','Business Operations',ARRAY['Claude','LobeHub'],'false',ARRAY['slack','mcp','communication','teams'],'https://lobehub.com/mcp'),
('mcp-google-maps',        'mcp','Google Maps MCP',        'Location and mapping MCP server using Google Maps API for geocoding and routing.','Productivity',ARRAY['Claude','LobeHub'],'false',ARRAY['maps','location','google','mcp'],'https://lobehub.com/mcp'),
('mcp-fetch',              'mcp','Fetch MCP',              'HTTP fetch MCP server that enables AI agents to make web requests and read URLs.','Development',ARRAY['Claude','Open WebUI','LobeHub'],'true',ARRAY['fetch','http','web','mcp'],'https://lobehub.com/mcp'),
('mcp-memory',             'mcp','Memory MCP',             'Persistent memory MCP server that lets AI agents store and recall information across sessions.','Productivity',ARRAY['Claude','LobeHub'],'true',ARRAY['memory','persistence','mcp','context'],'https://lobehub.com/mcp'),
('mcp-everything',         'mcp','Everything Search MCP',  'Fast local file search MCP server using Everything search engine for Windows.','Development',ARRAY['Claude','Open WebUI'],'false',ARRAY['search','files','local','mcp'],'https://lobehub.com/mcp'),
('mcp-sequential-thinking','mcp','Sequential Thinking MCP','MCP server enabling step-by-step reasoning and dynamic problem-solving for AI agents.','Research & Analysis',ARRAY['Claude','LobeHub'],'true',ARRAY['reasoning','thinking','mcp','logic'],'https://lobehub.com/mcp'),

-- Prompts
('prompt-chain-of-thought',      'prompt','Chain of Thought Prompt',   'Template that guides AI to reason step-by-step through complex problems before answering.','Research & Analysis',ARRAY['Claude','ChatGPT','Gemini Spark','Open WebUI','LobeHub'],'true',ARRAY['reasoning','cot','prompt','logic'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-role-play-expert',      'prompt','Expert Role-Play Prompt',   'Framework for assigning AI a domain expert role with specific expertise and communication style.','Productivity',ARRAY['Claude','ChatGPT','Gemini Spark'],'true',ARRAY['roleplay','expert','persona','prompt'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-structured-output',     'prompt','Structured Output Prompt',  'Forces AI to return data in specified JSON, Markdown table, or custom formats consistently.','Documents & Data',ARRAY['Claude','ChatGPT','Gemini Spark','Open WebUI'],'true',ARRAY['json','output','format','structured'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-swarmclaw-master',      'prompt','SwarmClaw Agent Prompt',    'Master orchestrator prompt for SwarmClaw multi-agent coordination and task distribution.','Business Operations',ARRAY['SwarmClaw','Claude','ChatGPT'],'true',ARRAY['swarm','orchestration','multi-agent','swarmclaw'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-few-shot-learning',     'prompt','Few-Shot Learning Template','Provide 2–5 examples to teach AI the exact pattern, tone, and format you want.','Productivity',ARRAY['Claude','ChatGPT','Gemini Spark'],'false',ARRAY['few-shot','examples','learning','prompt'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-system-persona',        'prompt','System Persona Builder',    'Construct detailed system prompts defining AI personality, expertise, and behavioral guardrails.','Productivity',ARRAY['Claude','ChatGPT','Open WebUI','LobeHub'],'true',ARRAY['system','persona','instructions','prompt'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-rewrite-improve',       'prompt','Rewrite & Improve Prompt',  'Iterative refinement prompt that rewrites content for clarity, tone, and impact.','Content & Marketing',ARRAY['Claude','ChatGPT','Gemini Spark'],'false',ARRAY['rewrite','editing','improve','writing'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-meeting-notes',         'prompt','Meeting Notes Summarizer',  'Converts raw meeting transcripts into structured notes with action items and decisions.','Business Operations',ARRAY['Claude','ChatGPT','Gemini Spark'],'true',ARRAY['meetings','notes','summary','action-items'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-competitor-analysis',   'prompt','Competitor Analysis Prompt','Systematic framework for analyzing competitors across product, pricing, and positioning.','Research & Analysis',ARRAY['Claude','ChatGPT'],'false',ARRAY['competitor','analysis','research','strategy'],'https://skillsllm.com/skill/swarmclaw'),
('prompt-omni-agent-skill',      'prompt','Omni Agent Skill Prompt',   'Omni.co-compatible agent skill prompt for defining specialized AI capabilities and workflows.','Business Operations',ARRAY['Claude','ChatGPT'],'false',ARRAY['omni','agent','skill','workflow'],'https://docs.omni.co/developers/agent-skills')
ON CONFLICT (slug) DO NOTHING;
