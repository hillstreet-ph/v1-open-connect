
INSERT INTO resources (slug, resource_type, title, description, long_description, category, compatible_platforms, is_free, is_featured, prompt_content, source_url, author, tags) VALUES

('owui-web-search-plugin-v2', 'plugin', 'Web Search Plugin (DuckDuckGo/Brave)', 'Real-time web search for Open WebUI using DuckDuckGo, Brave Search or SearXNG — zero API key for DDG.',
'Adds live internet search to Open WebUI. Queries DuckDuckGo (no key needed), Brave Search, or self-hosted SearXNG. Retrieves top results, extracts snippets, injects citations into model responses. Supports result count config, domain filtering, and safe-search.',
'research-analysis', ARRAY['Open WebUI'], true, true,
'## Web Search Plugin for Open WebUI

### Quick Install
1. Open WebUI Admin Panel → Functions → Add New Function
2. Paste the plugin code below
3. Configure your preferred search backend

### Plugin Code
```python
"""
title: Web Search (DDG/Brave/SearXNG)
author: OpenWebUI Community
version: 2.0.0
description: Real-time web search supporting multiple backends
license: MIT
"""
from pydantic import BaseModel, Field
import requests, json
from typing import Optional

class Tools:
    class Valves(BaseModel):
        backend: str = Field(
            default="duckduckgo",
            description="Search backend: duckduckgo | brave | searxng"
        )
        max_results: int = Field(default=5)
        brave_api_key: Optional[str] = Field(default=None)
        searxng_url: Optional[str] = Field(default=None)
        safe_search: bool = Field(default=True)
    
    def __init__(self):
        self.valves = self.Valves()
    
    def web_search(self, query: str) -> str:
        """
        Search the web for current information.
        :param query: The search query
        :return: Search results as formatted text
        """
        if self.valves.backend == "duckduckgo":
            return self._ddg_search(query)
        elif self.valves.backend == "brave":
            return self._brave_search(query)
        return self._searxng_search(query)
    
    def _ddg_search(self, query: str) -> str:
        url = "https://api.duckduckgo.com/"
        params = {"q": query, "format": "json", "no_html": 1}
        r = requests.get(url, params=params, timeout=10)
        data = r.json()
        results = []
        for i, result in enumerate(data.get("Results", [])[:self.valves.max_results]):
            results.append(f"[{i+1}] {result.get(''Text'', '''')} — {result.get(''FirstURL'', '''')}")
        return "\\n\\n".join(results) if results else "No results found."
```

### Usage Tips
- Works best when model is prompted: "Search the web for [topic] then summarize"
- Results inject as tool context — model cites them automatically
- For academic queries, pair with arxiv plugin for paper search',
'https://openwebui.com/functions', 'Open WebUI Community', ARRAY['search', 'web', 'duckduckgo', 'brave', 'real-time']),

('owui-code-interpreter-v2', 'plugin', 'Python Code Interpreter', 'Execute Python in a Docker sandbox within Open WebUI — pandas, matplotlib, scipy, scikit-learn pre-installed.',
'Sandboxed Python execution inside Open WebUI chat. Write code, run it, see output and plots inline. Pre-installed: pandas, numpy, matplotlib, plotly, seaborn, scipy, scikit-learn. 30-second timeout, 512MB RAM limit, no internet access from sandbox.',
'documents-data', ARRAY['Open WebUI'], true, true,
'## Python Code Interpreter Plugin

### Prerequisites
- Docker must be running on the Open WebUI host
- At least 2GB free RAM for the sandbox container

### Install Steps
1. Admin → Functions → New Function
2. Paste plugin code
3. Set `SANDBOX_IMAGE` in admin settings
4. First run pulls the Python image (one-time, ~200MB)

### Plugin Configuration
```python
"""
title: Python Code Interpreter
author: OpenWebUI Community  
version: 1.5.0
"""
class Valves(BaseModel):
    sandbox_image: str = Field(default="python:3.11-slim")
    timeout_seconds: int = Field(default=30)
    max_memory_mb: int = Field(default=512)
    pre_install_packages: str = Field(
        default="pandas numpy matplotlib plotly seaborn scipy scikit-learn"
    )
```

### What You Can Do
```python
# Data analysis
import pandas as pd
df = pd.read_csv("data.csv")
print(df.describe())

# Visualization
import matplotlib.pyplot as plt
df["revenue"].plot(kind="bar")
plt.savefig("/output/chart.png")

# Machine learning
from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X_train, y_train)
print(f"R² score: {model.score(X_test, y_test):.3f}")

# Math / simulations
import numpy as np
result = np.linalg.solve(A, b)
```

### Security Boundaries
- No outbound internet from sandbox
- Filesystem: /tmp/sandbox/ only
- No subprocess.run, os.system, exec() allowed
- Containers destroyed after each execution',
'https://openwebui.com/functions', 'Open WebUI Community', ARRAY['python', 'code-execution', 'data-science', 'sandbox', 'charts']),

('lobehub-bing-search-plugin', 'plugin', 'Bing Search Plugin', 'Real-time Bing web and news search for LobeHub agents with structured result formatting.',
'Integrates Microsoft Bing Web Search and News Search APIs into LobeHub agent conversations. Returns structured results with titles, URLs, snippets, and publication dates. Supports news freshness filtering, result count configuration, and market/language settings.',
'research-analysis', ARRAY['LobeHub', 'Open WebUI'], true, false,
'## Bing Search Plugin for LobeHub

### Setup
```bash
# Get Bing Search API key from Azure Portal
# https://portal.azure.com → Cognitive Services → Bing Search v7

BING_SEARCH_API_KEY=your_azure_bing_key
```

### Plugin Manifest
```json
{
  "name_for_human": "Bing Search",
  "name_for_model": "bing_search",
  "description_for_model": "Search the web using Bing. Use this when you need current information, news, or facts not in your training data.",
  "api": {
    "type": "openapi",
    "url": "https://api.bing.microsoft.com/v7.0/search"
  },
  "auth": {
    "type": "service_http",
    "authorization_type": "apikey",
    "verification_tokens": {"bing": "your_key"}
  }
}
```

### Search Parameters
```
q         — Search query (required)
count     — Results per page (1-50, default 10)
freshness — Day | Week | Month (news recency filter)
mkt       — Market: en-US, en-GB, de-DE, zh-CN, etc.
safeSearch — Off | Moderate | Strict
responseFilter — Webpages,News,Images (comma-separated)
```

### Response Structure
```json
{
  "webPages": {
    "value": [{
      "name": "Result Title",
      "url": "https://...",
      "snippet": "Description text...",
      "dateLastCrawled": "2024-01-15"
    }]
  },
  "news": { "value": [...] }
}
```',
'https://lobehub.com/plugins', 'LobeHub', ARRAY['bing', 'search', 'news', 'web', 'microsoft']),

('lobehub-wolfram-alpha-plugin', 'plugin', 'Wolfram Alpha Plugin', 'Computational intelligence plugin — math, science, data and factual queries answered with step-by-step solutions.',
'Connects LobeHub agents to the Wolfram Alpha Computational Knowledge Engine. Solves complex math equations, performs unit conversions, answers factual queries with structured data, generates plots, and explains scientific concepts with step-by-step solutions. Ideal for STEM education, engineering, and research workflows.',
'research-analysis', ARRAY['LobeHub', 'Open WebUI', 'ChatGPT'], true, false,
'## Wolfram Alpha Plugin

### Setup
```bash
# Get API key from Wolfram Alpha Developer Portal
# https://developer.wolframalpha.com/portal/myapps/

WOLFRAM_APP_ID=your_app_id
```

### Capabilities
- **Mathematics**: Calculus, algebra, statistics, number theory
- **Science**: Physics, chemistry, biology, astronomy
- **Data**: Population stats, economic data, historical facts
- **Unit Conversion**: Any unit to any unit
- **Plotting**: Functions, data, parametric plots
- **Step-by-Step**: Detailed solution breakdowns

### Query Examples
```
"Solve x^2 + 5x + 6 = 0"
"Derivative of sin(x)*e^x"
"Convert 72 degrees Fahrenheit to Celsius"
"Population of Germany 2020-2024"
"Distance from Earth to Mars in light-minutes"
"Integral of 1/(1+x^2) from 0 to infinity"
"Eigenvalues of [[1,2],[3,4]]"
```

### API Usage
```python
import requests

def query_wolfram(input: str, app_id: str) -> str:
    r = requests.get(
        "http://api.wolframalpha.com/v2/query",
        params={
            "input": input,
            "appid": app_id,
            "format": "plaintext",
            "output": "JSON"
        }
    )
    data = r.json()
    results = []
    for pod in data["queryresult"].get("pods", []):
        if pod.get("primary"):
            for sub in pod.get("subpods", []):
                results.append(sub.get("plaintext", ""))
    return "\\n".join(results)
```',
'https://lobehub.com/plugins', 'LobeHub', ARRAY['math', 'science', 'wolfram', 'computation', 'education']),

('clawhub-salesforce-plugin', 'plugin', 'Salesforce CRM Plugin', 'Query, update and create Salesforce records — leads, opportunities, contacts and reports from AI chat.',
'Full Salesforce CRM integration for ClawhHub. Query SOQL, manage leads and opportunities, update contact records, run reports, trigger workflows, and manage pipeline from natural language commands. Uses Salesforce REST API with OAuth 2.0 authentication.',
'business-operations', ARRAY['ClawhHub', 'Open WebUI', 'SwarmClaw'], true, false,
'## Salesforce CRM Plugin

### Authentication
```bash
# Connected App setup in Salesforce Setup → Apps → App Manager
# Required permissions: API, Read/Write on objects you need

SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_secret
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
```

### OAuth 2.0 Flow
```python
def get_salesforce_token(client_id, client_secret, username, password):
    r = requests.post(
        "https://login.salesforce.com/services/oauth2/token",
        data={
            "grant_type": "password",
            "client_id": client_id,
            "client_secret": client_secret,
            "username": username,
            "password": password  # append security token if needed
        }
    )
    return r.json()["access_token"]
```

### SOQL Query Examples
```sql
-- Open opportunities closing this quarter
SELECT Id, Name, Amount, CloseDate, StageName, Owner.Name
FROM Opportunity
WHERE IsClosed = false 
AND CloseDate = THIS_QUARTER
ORDER BY Amount DESC

-- Hot leads from this week
SELECT Id, FirstName, LastName, Company, LeadSource, Status
FROM Lead
WHERE CreatedDate = THIS_WEEK
AND Rating = ''Hot''

-- Account contacts with recent activity
SELECT Id, Name, Email, LastActivityDate
FROM Contact
WHERE AccountId = ''001...''
ORDER BY LastActivityDate DESC
```

### Natural Language Commands
"Show me all deals closing this month over $50K"
"Update opportunity ''Acme Corp'' stage to Negotiation"
"Create a new lead: John Smith at TechCorp, email john@techcorp.com, source: Web"
"What''s our pipeline total for Q4?"',
'https://clawhub.ai/plugins', 'ClawhHub', ARRAY['salesforce', 'crm', 'sales', 'opportunities', 'leads']),

('clawhub-linear-plugin', 'plugin', 'Linear Issue Tracker Plugin', 'Manage Linear issues, cycles, projects and roadmaps from AI conversations with full GraphQL API support.',
'Complete Linear.app integration for engineering teams. Create and update issues, manage cycles (sprints), view project roadmaps, add comments, set priorities, filter by assignee/label/state, and get team velocity metrics. Uses Linear GraphQL API.',
'documents-data', ARRAY['ClawhHub', 'Open WebUI', 'SwarmClaw'], true, false,
'## Linear Issue Tracker Plugin

### Authentication
```bash
# Generate API key at: https://linear.app/settings/api
# Personal API keys have full access to your workspace

LINEAR_API_KEY=lin_api_your_key_here
LINEAR_TEAM_ID=your_team_id  # Get from Linear URL or API
```

### GraphQL Queries

#### Get open issues assigned to me
```graphql
query MyIssues {
  viewer {
    assignedIssues(filter: { state: { type: { nin: ["completed", "cancelled"] } } }) {
      nodes {
        id title priority state { name }
        dueDate assignee { name }
        project { name }
      }
    }
  }
}
```

#### Create an issue
```graphql
mutation CreateIssue($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue { id title url }
  }
}
# Variables:
{
  "input": {
    "title": "Fix authentication bug",
    "description": "Users are getting 401 on refresh token",
    "teamId": "TEAM_ID",
    "priority": 2,
    "labelIds": ["LABEL_ID"]
  }
}
```

### Natural Language Commands
"Show me all P1 bugs open in the current cycle"
"Create an issue ''Add dark mode'' assigned to @alice with priority High"
"What''s the cycle progress? How many issues done vs remaining?"
"Move issue ENG-123 to In Review"',
'https://clawhub.ai/plugins', 'ClawhHub', ARRAY['linear', 'issue-tracking', 'engineering', 'sprints', 'devops']);
