
INSERT INTO categories (slug,name,description,icon,sort_order) VALUES
('content-marketing','Content & Marketing','Blog posts, social media, SEO, and content repurposing','Megaphone',1),
('email-communication','Email & Communication','Cold outreach, follow-ups, inbox triage, and customer replies','Mail',2),
('research-analysis','Research & Analysis','Competitor research, market briefs, customer feedback, and news','Search',3),
('business-operations','Business Operations','SOPs, onboarding, reviews, CRM updates, and proposals','Briefcase',4),
('productivity','Productivity','Daily briefs, meeting notes, file organization, and presentations','Zap',5),
('documents-data','Documents & Data','PDF summaries, spreadsheet insights, and document processing','FileText',6),
('web-design','Web & Design','Website building, landing pages, SEO audits, and UX review','Globe',7),
('sales-support','Sales & Support','Client proposals, CRM updates, cold outreach, and support replies','Users',8),
('free-tools','Free Tools','Credit savers, generators, and utility AI tools','Wrench',9)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO platforms (slug,name,color,description,sort_order) VALUES
('claude','Claude','#d97706','Anthropic''s AI assistant — Claude Cowork, Claude Desktop, Fable 5',1),
('chatgpt','ChatGPT','#10a37f','OpenAI''s ChatGPT Work and Custom GPTs platform',2),
('gemini-spark','Gemini Spark','#4285f4','Google''s AI agent with Gmail, Docs, and Drive integration',3),
('open-webui','Open WebUI','#8b5cf6','Open-source self-hosted AI interface for local and cloud models',4),
('lobehub','LobeHub','#6366f1','LobeChat — extensible open-source AI chat framework',5)
ON CONFLICT (slug) DO NOTHING;
