
INSERT INTO resources (slug, resource_type, title, description, long_description, category, compatible_platforms, is_free, is_featured, prompt_content, source_url, author, tags) VALUES

('swarmclaw-vector-search-tool', 'tool', 'Vector Semantic Search Tool', 'Embeds documents and queries into vector space for semantic similarity search using pgvector or Pinecone.',
'The Vector Search Tool enables semantic (meaning-based) search over document collections. It chunks documents, generates embeddings via OpenAI or local models, stores vectors in pgvector or Pinecone, and retrieves semantically similar results for any query. Powers RAG (Retrieval-Augmented Generation) workflows.',
'documents-data', ARRAY['SwarmClaw', 'Open WebUI', 'Claude'], true, true,
'## Vector Semantic Search Tool

### Architecture
```
Documents → Chunker → Embedder → Vector Store → Search Index
                                                      ↓
Query → Embedder → Similarity Search → Top-K Results → LLM Context
```

### Installation & Setup
```bash
# For pgvector (PostgreSQL)
pip install pgvector psycopg2 openai

# Enable pgvector extension
psql -c "CREATE EXTENSION IF NOT EXISTS vector;"

# For Pinecone
pip install pinecone-client openai
```

### Core Implementation
```python
import openai
import numpy as np
from typing import List

def embed_text(text: str, model: str = "text-embedding-3-small") -> List[float]:
    """Generate embedding for a text string"""
    response = openai.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

def chunk_document(text: str, chunk_size: int = 512, overlap: int = 50) -> List[str]:
    """Split document into overlapping chunks"""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks

def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# pgvector table setup
CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS document_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536),  -- OpenAI text-embedding-3-small
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
"""

# Insert document
INSERT_SQL = """
INSERT INTO document_embeddings (content, embedding, metadata)
VALUES (%s, %s, %s)
"""

# Semantic search
SEARCH_SQL = """
SELECT content, metadata, 1 - (embedding <=> %s::vector) AS similarity
FROM document_embeddings
ORDER BY embedding <=> %s::vector
LIMIT %s;
"""
```

### RAG Integration
```python
def rag_query(question: str, top_k: int = 5) -> str:
    q_embedding = embed_text(question)
    results = semantic_search(q_embedding, top_k)
    context = "\\n\\n---\\n\\n".join([r["content"] for r in results])
    return f"Based on these documents:\\n\\n{context}\\n\\nQuestion: {question}"
```',
'https://swarmclaw.com/tools', 'SwarmClaw', ARRAY['rag', 'vector-search', 'embeddings', 'pgvector', 'semantic']),

('hermes-email-automation-tool', 'tool', 'Email Automation Tool', 'Send, receive, parse and automate email workflows — supports Gmail, Outlook and SMTP/IMAP.',
'Full email automation toolkit supporting Gmail API, Microsoft Graph (Outlook), and standard SMTP/IMAP. Send emails, read inboxes, search messages, parse content, manage labels/folders, set up filters, and trigger actions on incoming messages. Powers automated notification systems, lead nurture sequences, and support ticket workflows.',
'business-operations', ARRAY['Hermes Agent', 'SwarmClaw', 'Open WebUI'], true, false,
'## Email Automation Tool

### Backend Support
| Backend | Auth | Features |
|---------|------|---------|
| Gmail | OAuth2 | Full API, labels, search |
| Outlook | OAuth2 (Graph) | Full API, folders, calendar |
| SMTP/IMAP | Password/API | Universal, any provider |

### Gmail Setup
```python
# pip install google-auth google-api-python-client
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify"
]

def get_gmail_service(credentials_json: str):
    creds = Credentials.from_authorized_user_info(
        json.loads(credentials_json), SCOPES
    )
    return build("gmail", "v1", credentials=creds)
```

### Send Email
```python
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(service, to: str, subject: str, body: str, html: bool = False):
    msg = MIMEMultipart("alternative")
    msg["to"] = to
    msg["subject"] = subject
    
    part = MIMEText(body, "html" if html else "plain")
    msg.attach(part)
    
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    service.users().messages().send(
        userId="me",
        body={"raw": raw}
    ).execute()
```

### Search & Parse
```python
# Search Gmail messages
def search_emails(service, query: str, max_results: int = 10):
    results = service.users().messages().list(
        userId="me", q=query, maxResults=max_results
    ).execute()
    return results.get("messages", [])

# Common search queries
# "from:boss@company.com is:unread"
# "subject:invoice newer_than:7d"
# "has:attachment label:inbox"
```

### Automation Triggers
```python
# Watch for new emails matching criteria
def watch_inbox(service, topic_name: str):
    service.users().watch(
        userId="me",
        body={"topicName": topic_name, "labelIds": ["INBOX"]}
    ).execute()
```',
'https://hermesagent.ai/tools', 'Hermes Agent', ARRAY['email', 'gmail', 'outlook', 'automation', 'smtp']),

('openclaw-browser-scraper-tool', 'tool', 'Browser Scraper Tool', 'Playwright-based headless browser scraper that handles JS-rendered pages, authentication and complex interactions.',
'JavaScript-rendered page scraper using Playwright. Handles SPAs, dynamic content, login walls, pagination, infinite scroll, file downloads, and screenshot capture. Supports Chromium, Firefox, and WebKit. Outputs clean structured data as JSON, CSV, or Markdown.',
'documents-data', ARRAY['OpenClaw', 'SwarmClaw', 'Open WebUI'], true, true,
'## Browser Scraper Tool (Playwright)

### Installation
```bash
pip install playwright
playwright install chromium  # or firefox, webkit
```

### Basic Scraping
```python
from playwright.async_api import async_playwright
import asyncio
import json

async def scrape_page(url: str, selectors: dict) -> dict:
    """
    Scrape content from a page using CSS selectors.
    
    Args:
        url: Target URL
        selectors: {field_name: css_selector} mapping
    Returns:
        Extracted data as dict
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Block unnecessary resources for speed
        await page.route("**/*.{png,jpg,gif,css,font}", lambda r: r.abort())
        
        await page.goto(url, wait_until="networkidle")
        
        data = {}
        for field, selector in selectors.items():
            try:
                element = await page.query_selector(selector)
                data[field] = await element.inner_text() if element else None
            except Exception as e:
                data[field] = None
        
        await browser.close()
        return data

# Example usage
result = asyncio.run(scrape_page(
    "https://example.com/product",
    {
        "title": "h1.product-title",
        "price": ".price-current",
        "description": ".product-description",
        "rating": ".star-rating"
    }
))
```

### Authentication Flow
```python
async def scrape_with_login(url: str, login_url: str, username: str, password: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Login
        await page.goto(login_url)
        await page.fill("[name=email]", username)
        await page.fill("[name=password]", password)
        await page.click("[type=submit]")
        await page.wait_for_navigation()
        
        # Now scrape authenticated pages
        await page.goto(url)
        content = await page.content()
        await browser.close()
        return content
```

### Pagination Handler
```python
async def scrape_all_pages(base_url: str, item_selector: str) -> list:
    all_items = []
    page_num = 1
    
    while True:
        url = f"{base_url}?page={page_num}"
        items = await get_items(url, item_selector)
        if not items:
            break
        all_items.extend(items)
        page_num += 1
    
    return all_items
```',
'https://openclaw.ai/tools', 'OpenClaw', ARRAY['scraping', 'playwright', 'browser', 'web-data', 'automation']),

('skillsllm-batch-processor-tool', 'tool', 'Batch LLM Processor Tool', 'Process thousands of records through LLM prompts with rate limiting, cost estimation, retry logic and progress tracking.',
'High-throughput batch processing tool for LLM operations. Queue thousands of records, process them with configurable concurrency and rate limits, estimate costs upfront, handle failures with exponential backoff retries, track progress with a dashboard, and export results. Supports OpenAI, Anthropic, and any OpenAI-compatible API.',
'productivity', ARRAY['SkillsLLM', 'Open WebUI', 'SwarmClaw'], true, true,
'## Batch LLM Processor Tool

### Use Cases
- Classify/categorize thousands of records
- Summarize large document collections
- Extract structured data from unstructured text at scale
- Translate content in bulk
- Score/evaluate items against a rubric

### Core Implementation
```python
import asyncio
import time
from typing import List, Callable, Any
import openai
from dataclasses import dataclass, field
from tqdm.asyncio import tqdm

@dataclass
class BatchJob:
    id: str
    input: str
    prompt_template: str
    result: str = None
    error: str = None
    attempts: int = 0

@dataclass  
class BatchConfig:
    model: str = "gpt-4o-mini"
    max_concurrency: int = 10      # Parallel requests
    requests_per_minute: int = 500  # Rate limit
    max_retries: int = 3
    retry_backoff_base: float = 2.0
    temperature: float = 0.0        # Deterministic output

async def process_single(job: BatchJob, client: openai.AsyncOpenAI, config: BatchConfig) -> BatchJob:
    for attempt in range(config.max_retries):
        try:
            response = await client.chat.completions.create(
                model=config.model,
                messages=[{
                    "role": "user",
                    "content": job.prompt_template.format(input=job.input)
                }],
                temperature=config.temperature
            )
            job.result = response.choices[0].message.content
            return job
        except openai.RateLimitError:
            wait = config.retry_backoff_base ** attempt
            await asyncio.sleep(wait)
        except Exception as e:
            job.error = str(e)
            if attempt == config.max_retries - 1:
                return job
    return job

async def batch_process(jobs: List[BatchJob], api_key: str, config: BatchConfig) -> List[BatchJob]:
    client = openai.AsyncOpenAI(api_key=api_key)
    semaphore = asyncio.Semaphore(config.max_concurrency)
    
    async def bounded_process(job):
        async with semaphore:
            return await process_single(job, client, config)
    
    results = await tqdm.gather(*[bounded_process(j) for j in jobs])
    return list(results)
```

### Cost Estimation
```python
COST_PER_1K_TOKENS = {
    "gpt-4o": {"input": 0.0025, "output": 0.01},
    "gpt-4o-mini": {"input": 0.000150, "output": 0.000600},
    "claude-3-haiku": {"input": 0.00025, "output": 0.00125},
}

def estimate_cost(records: List[str], prompt: str, model: str = "gpt-4o-mini") -> dict:
    avg_input_tokens = sum(len(r.split()) * 1.3 for r in records) / len(records)
    avg_prompt_tokens = len(prompt.split()) * 1.3
    total_input = (avg_input_tokens + avg_prompt_tokens) * len(records) / 1000
    total_output = 200 * len(records) / 1000  # est. 200 tokens output
    
    rates = COST_PER_1K_TOKENS[model]
    cost = total_input * rates["input"] + total_output * rates["output"]
    return {"estimated_cost_usd": round(cost, 4), "total_records": len(records)}
```',
'https://skillsllm.com/tools', 'SkillsLLM', ARRAY['batch', 'llm', 'processing', 'openai', 'scale']),

('hermes-rss-monitor-tool', 'tool', 'RSS Feed Monitor Tool', 'Monitor multiple RSS/Atom feeds, detect new items, filter by keywords and trigger automated actions.',
'The RSS Feed Monitor Tool watches multiple RSS/Atom feeds simultaneously, detects new entries since last check, filters by keyword/category/author, deduplicates, and triggers downstream actions (email, webhook, Slack, database). Supports polling intervals from 5 minutes to 24 hours with persistent state tracking.',
'productivity', ARRAY['Hermes Agent', 'SwarmClaw', 'Open WebUI'], true, false,
'## RSS Feed Monitor Tool

### Installation
```bash
pip install feedparser aiohttp schedule sqlite3
```

### Core Monitor Implementation
```python
import feedparser
import sqlite3
import hashlib
from datetime import datetime
from typing import List, Callable

class RSSMonitor:
    def __init__(self, db_path: str = "rss_state.db"):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS seen_items (
                id TEXT PRIMARY KEY,
                feed_url TEXT,
                title TEXT,
                link TEXT,
                published TIMESTAMP,
                seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    
    def parse_feed(self, url: str) -> list:
        feed = feedparser.parse(url)
        return feed.entries
    
    def is_new(self, entry) -> bool:
        entry_id = hashlib.md5(
            (entry.get("id", entry.get("link", "")) + entry.get("title", "")).encode()
        ).hexdigest()
        
        conn = sqlite3.connect(self.db_path)
        result = conn.execute(
            "SELECT id FROM seen_items WHERE id = ?", (entry_id,)
        ).fetchone()
        
        if not result:
            conn.execute(
                "INSERT INTO seen_items (id, title, link) VALUES (?, ?, ?)",
                (entry_id, entry.get("title"), entry.get("link"))
            )
            conn.commit()
            return True
        return False
    
    def check_feed(self, url: str, keywords: List[str] = None) -> List[dict]:
        entries = self.parse_feed(url)
        new_items = []
        
        for entry in entries:
            if not self.is_new(entry):
                continue
            
            # Keyword filter
            if keywords:
                text = (entry.get("title", "") + entry.get("summary", "")).lower()
                if not any(kw.lower() in text for kw in keywords):
                    continue
            
            new_items.append({
                "title": entry.get("title"),
                "link": entry.get("link"),
                "summary": entry.get("summary", "")[:500],
                "published": entry.get("published"),
                "author": entry.get("author")
            })
        
        return new_items

# Example: monitor tech news feeds
monitor = RSSMonitor()
feeds = [
    ("https://feeds.ycombinator.com/hackernews.rss", ["AI", "LLM", "agent"]),
    ("https://techcrunch.com/feed/", ["startup", "funding"]),
    ("https://www.theverge.com/rss/index.xml", None),
]

for feed_url, keywords in feeds:
    new_items = monitor.check_feed(feed_url, keywords)
    for item in new_items:
        print(f"NEW: {item[''title'']} — {item[''link'']}")
```',
'https://hermesagent.ai/tools', 'Hermes Agent', ARRAY['rss', 'monitoring', 'feeds', 'automation', 'news']),

('agency-agents-report-generator-tool', 'tool', 'Report Generator Tool', 'Generates professional PDF/HTML reports from data inputs with charts, tables and branded templates.',
'The Report Generator Tool produces professional business reports from structured data. It accepts data objects, generates visualizations (charts, tables), applies branded templates, and outputs PDF, HTML, or DOCX. Supports executive summaries, financial reports, project status reports, and analytics dashboards.',
'business-operations', ARRAY['Agency Agents', 'Hermes Agent', 'Open WebUI'], true, false,
'## Report Generator Tool

### Installation
```bash
pip install jinja2 weasyprint plotly pandas openpyxl
```

### Report Template System
```python
from jinja2 import Environment, FileSystemLoader
import plotly.graph_objects as go
import plotly.io as pio
import base64
from io import BytesIO

class ReportGenerator:
    def __init__(self, template_dir: str = "templates"):
        self.env = Environment(loader=FileSystemLoader(template_dir))
    
    def create_bar_chart(self, labels: list, values: list, title: str) -> str:
        """Generate base64-encoded chart image"""
        fig = go.Figure(go.Bar(x=labels, y=values))
        fig.update_layout(title=title, template="plotly_white")
        img_bytes = pio.to_image(fig, format="png", width=800, height=400)
        return base64.b64encode(img_bytes).decode()
    
    def generate_html(self, template_name: str, data: dict) -> str:
        template = self.env.get_template(template_name)
        return template.render(**data)
    
    def generate_pdf(self, html_content: str, output_path: str):
        from weasyprint import HTML
        HTML(string=html_content).write_pdf(output_path)

# HTML Template Example
REPORT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; color: #333; margin: 40px; }
  h1 { color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 10px; }
  .metric { display: inline-block; background: #f8f9fa; padding: 20px; 
             margin: 10px; border-radius: 8px; text-align: center; }
  .metric-value { font-size: 2em; font-weight: bold; color: #e94560; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #1a1a2e; color: white; padding: 12px; }
  td { padding: 10px; border-bottom: 1px solid #eee; }
</style>
</head>
<body>
  <h1>{{ report_title }}</h1>
  <p>Generated: {{ generated_at }} | Period: {{ period }}</p>
  
  <div class="metrics">
    {% for metric in metrics %}
    <div class="metric">
      <div class="metric-label">{{ metric.label }}</div>
      <div class="metric-value">{{ metric.value }}</div>
      <div class="metric-change">{{ metric.change }}</div>
    </div>
    {% endfor %}
  </div>
  
  {% if chart_b64 %}
  <img src="data:image/png;base64,{{ chart_b64 }}" style="width:100%">
  {% endif %}
  
  <h2>Details</h2>
  <table>
    <tr>{% for col in columns %}<th>{{ col }}</th>{% endfor %}</tr>
    {% for row in rows %}
    <tr>{% for cell in row %}<td>{{ cell }}</td>{% endfor %}</tr>
    {% endfor %}
  </table>
</body>
</html>
"""
```',
'https://agencyagents.ai/tools', 'Agency Agents', ARRAY['reports', 'pdf', 'charts', 'templates', 'visualization']);
