
insert into public.setup_guides (slug, platform, title, description, steps, platform_color, sort_order) values
('claude-cowork', 'Claude', 'Claude Cowork Setup Guide', 'Get Claude Cowork running from scratch — access, projects, skills, and your first workflow.', '[
  {"step": 1, "title": "Check Your Plan Access", "desc": "Claude Cowork is available on Pro and Team plans. Go to claude.ai and confirm your subscription includes Cowork access."},
  {"step": 2, "title": "Create Your First Project", "desc": "Click ''New Project'' in the sidebar. Projects keep your skills, instructions, and conversation history organized by topic or client."},
  {"step": 3, "title": "Add a System Prompt", "desc": "Inside your project, add a system prompt. This is where you paste a skill file to give Claude persistent instructions for every conversation."},
  {"step": 4, "title": "Upload a Skill File", "desc": "Download any SKILL.md from Open XStack, then paste its contents into your project system prompt. Claude will follow those instructions every time."},
  {"step": 5, "title": "Connect Your Files", "desc": "Use the Files section to attach PDFs, spreadsheets, or documents. Claude can reference them throughout your project conversations."},
  {"step": 6, "title": "Test Your Setup", "desc": "Start a new conversation inside the project and test it with a real task. Adjust the skill instructions based on the output."}
]', '#d97706', 1),
('gemini-spark', 'Gemini Spark', 'Gemini Spark Setup Guide', 'Set up Gemini Spark with skills, scheduled tasks, and Google Workspace integration.', '[
  {"step": 1, "title": "Check Workspace Access", "desc": "Gemini Spark requires a Google Workspace Business or Enterprise plan, or a personal Google One AI Premium subscription."},
  {"step": 2, "title": "Enable Gemini Spark", "desc": "Go to gemini.google.com and look for the Spark icon. If your plan includes it, you''ll see the Spark interface with Skills and Tasks tabs."},
  {"step": 3, "title": "Connect Google Workspace", "desc": "Authorize Gemini Spark to access Gmail, Drive, Docs, and Calendar. This enables it to read and act on your real files and inbox."},
  {"step": 4, "title": "Install Your First Skill", "desc": "Go to the Skills tab, click ''Add Skill'', and paste in a skill from Open XStack. Give it a clear name and description."},
  {"step": 5, "title": "Set Up a Scheduled Task", "desc": "Use the Tasks tab to schedule a skill to run automatically — daily brief at 8am, weekly summary on Fridays, etc."},
  {"step": 6, "title": "Test With a Real Workflow", "desc": "Trigger your skill manually first to verify the output. Once it looks right, let the schedule run it automatically."}
]', '#4285f4', 2),
('chatgpt-work', 'ChatGPT', 'ChatGPT Work Setup Guide', 'Set up ChatGPT Work with skills, tasks, and team collaboration features.', '[
  {"step": 1, "title": "Upgrade to a Work Plan", "desc": "ChatGPT Skills require a Plus, Team, or Enterprise plan. Go to chatgpt.com and upgrade if needed."},
  {"step": 2, "title": "Open ChatGPT Work", "desc": "Navigate to chatgpt.com and look for the Work tab or Skills section in the left sidebar. This is your skill management hub."},
  {"step": 3, "title": "Create Your First Skill", "desc": "Click ''Add Skill''. Give it a name, write a description of what it does, and paste in the skill instructions from Open XStack."},
  {"step": 4, "title": "Invoke a Skill", "desc": "In any ChatGPT conversation, type @ and the skill name to activate it. ChatGPT will follow the skill instructions for that session."},
  {"step": 5, "title": "Schedule a Task", "desc": "Use ChatGPT Tasks (available in Plus and above) to schedule skills to run at specific times — daily summaries, weekly reports, etc."},
  {"step": 6, "title": "Share With Your Team", "desc": "On Team and Enterprise plans, you can share skills with teammates. Export a skill and send the file, or share via your team workspace."}
]', '#10a37f', 3);

insert into public.free_tools (slug, title, description, category, platforms, is_featured, sort_order) values
('ai-agent-generator', 'AI Agent Generator', 'Paste your job role and get a custom AI agent setup — system prompt, skill list, and workflow plan.', 'Generator', array['claude','chatgpt','gemini-spark'], true, 1),
('prompt-cleanup-tool', 'Prompt Cleanup Tool', 'Paste a messy prompt and get a cleaner, more effective version ready to run in any AI tool.', 'Optimizer', array['claude','chatgpt','gemini-spark'], true, 2),
('skill-template-generator', 'Skill Template Generator', 'Answer a few questions about your task and get a ready-to-use skill template for Claude, ChatGPT, or Gemini.', 'Generator', array['claude','chatgpt','gemini-spark'], false, 3),
('sop-quick-builder', 'SOP Quick Builder', 'Turn bullet points and brain-dumps into a clean, formatted standard operating procedure in minutes.', 'Builder', array['claude','chatgpt','gemini-spark'], false, 4),
('weekly-brief-builder', 'Weekly Brief Builder', 'Paste your week''s notes and get a structured weekly brief with wins, blockers, and next steps.', 'Builder', array['claude','chatgpt','gemini-spark'], false, 5);
