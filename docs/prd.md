# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Open XStack

### 1.2 Application Description
Open XStack is a comprehensive review and resource hub for all AI agent tools, skills, prompts, plugins, MCP servers, and guides. It serves as a free, open, user-friendly library of resources for AI chat agents across multiple platforms including ChatGPT, Claude, Gemini Spark, Open WebUI, LobeHub, MultiOn, SwarmClaw, and more.

**Tagline**: \"Your single source for all AI agent resources — skills, prompts, guides, and tools\"

### 1.3 Design Style
- Clean, modern, developer/tech-friendly aesthetic
- Dark theme default with light mode toggle option
- Color accent: indigo/purple gradient representing the \"X\" in XStack
- Card-based layout for resources
- Prominent search bar
- Platform badges displayed as colored pills on resource cards
- Beginner-friendly language throughout
- Responsive mobile-friendly design

## 2. Users and Usage Scenarios

### 2.1 Target Users
- AI agent users across different platforms (ChatGPT, Claude, Gemini Spark, Open WebUI, LobeHub, MultiOn, SwarmClaw)
- Beginners learning about AI skills and tools
- Developers and professionals seeking AI productivity resources
- Content creators and marketers using AI tools

### 2.2 Core Usage Scenarios
- Browse and discover AI resources by platform or category
- Search for specific skills, agents, plugins, tools, MCP servers, or guides
- Download individual resources or bulk download by category/selection
- Learn how to create and use AI skills through guides
- Access setup instructions for different AI platforms
- Find free tools and utilities for AI agents

## 3. Page Structure and Functionality

### 3.1 Page Structure

```
Open XStack
├── Home
├── Agents
├── Skills
├── Plugins
├── Tools
├── MCP
├── Prompts
├── Guides
├── Setup Guides
├── Free Tools
└── About
```

### 3.2 Page Functionality

#### 3.2.1 Home Page

**Components:**
- Hero section with application name, tagline, and description
- Global search bar
- Featured resources carousel displaying selected items from all resource types
- Category grid showing all resource categories
- Featured guides section displaying selected articles
- Platform badges section showing supported AI platforms
- Dark/Light mode toggle

**Functionality:**
- Display featured content from database
- Search bar allows users to search across all resource types
- Category grid links to filtered resource pages
- Platform badges link to platform-specific pages

#### 3.2.2 Agents Page

**Display:**
- Grid layout of agent cards
- Each card shows: title, description, compatible AI platforms (badges), category tag, download button, checkbox (in select mode)

**Filter Options:**
- By Platform: Claude, ChatGPT, Gemini Spark, Open WebUI, LobeHub, MultiOn, SwarmClaw, etc.
- By Category
- Search input field

**Sort Options:**
- Newest
- Popular

**Download Features:**
- Individual download button on each card (download as .txt, .md, or .json)
- Bulk download button to download all visible/filtered results as ZIP
- Bulk download by category button
- Select mode toggle: enables checkboxes on cards for selective bulk download

**Content Source:**
- Scraped and extracted from:
  + https://lobehub.com/agent
  + https://agencyagents.dev/agents
  + https://github.com/msitarzewski/agency-agents
  + https://app.open-agent.io/onboarding
  + https://agentfield.ai/

**Interaction:**
- Click agent card to view Agent Detail Page
- Apply filters to narrow down displayed agents
- Use search to find specific agents
- Click download button to download individual agent file
- Toggle select mode, check desired agents, click bulk download button
- Click bulk download by category to download all agents in current category

#### 3.2.3 Skills Page

**Display:**
- Grid layout of skill cards
- Each skill card shows: title, description, compatible AI platforms (badges), category tag, download button, checkbox (in select mode)

**Filter Options:**
- By Platform: Claude, ChatGPT, Gemini Spark, Open WebUI, LobeHub, MultiOn, SwarmClaw, etc.
- By Category: Content & Marketing, Email & Communication, Research & Analysis, Business Operations, Productivity, Documents & Data, Web & Design, Sales & Customer Support, Free/Credit Tools
- Search input field

**Sort Options:**
- Newest
- Popular

**Download Features:**
- Individual download button on each card (download as .txt, .md, or .json)
- Bulk download button to download all visible/filtered results as ZIP
- Bulk download by category button
- Select mode toggle: enables checkboxes on cards for selective bulk download

**Content Source:**
- Pre-populated skills (45 total) from original PRD
- Additional skills scraped from:
  + https://lobehub.com/skills
  + https://skillsllm.com/skill/swarmclaw
  + https://docs.omni.co/developers/agent-skills
  + https://openwebui.com/home

**Interaction:**
- Click skill card to navigate to Skill Detail Page
- Apply filters to narrow down displayed skills
- Use search to find specific skills
- Change sort order
- Click download button to download individual skill file
- Toggle select mode, check desired skills, click bulk download button
- Click bulk download by category to download all skills in current category

#### 3.2.4 Plugins Page

**Display:**
- Grid layout of plugin cards
- Each card shows: title, description, compatible platforms (badges), category tag, download button, checkbox (in select mode)

**Filter Options:**
- By Platform
- By Category
- Search input field

**Sort Options:**
- Newest
- Popular

**Download Features:**
- Individual download button on each card (download as .txt, .md, or .json)
- Bulk download button to download all visible/filtered results as ZIP
- Bulk download by category button
- Select mode toggle: enables checkboxes on cards for selective bulk download

**Content Source:**
- Scraped and extracted from:
  + https://clawhub.ai/plugins
  + https://openclaw.ai/
  + https://www.swarmclaw.ai/

**Interaction:**
- Click plugin card to view Plugin Detail Page
- Apply filters and search
- Download individual or bulk plugin files

#### 3.2.5 Tools Page

**Display:**
- Grid layout of tool cards
- Each card shows: tool name, description, compatible platforms (badges), category tag, download button, checkbox (in select mode)

**Filter Options:**
- By Platform
- By Category
- Search input field

**Sort Options:**
- Newest
- Popular

**Download Features:**
- Individual download button on each card (download as .txt, .md, or .json)
- Bulk download button to download all visible/filtered results as ZIP
- Bulk download by category button
- Select mode toggle: enables checkboxes on cards for selective bulk download

**Content Source:**
- Free tools from original PRD
- Additional tools scraped from:
  + https://www.swarmdock.ai/
  + https://docs.multion.ai/welcome
  + https://openwebui.com/home

**Interaction:**
- Click tool card to view Tool Detail Page
- Apply filters and search
- Download individual or bulk tool files

#### 3.2.6 MCP Page

**Display:**
- Grid layout of MCP server/integration cards
- Each card shows: title, description, compatible platforms (badges), category tag, download button, checkbox (in select mode)

**Filter Options:**
- By Platform
- By Category
- Search input field

**Sort Options:**
- Newest
- Popular

**Download Features:**
- Individual download button on each card (download as .txt, .md, or .json)
- Bulk download button to download all visible/filtered results as ZIP
- Bulk download by category button
- Select mode toggle: enables checkboxes on cards for selective bulk download

**Content Source:**
- Scraped and extracted from:
  + https://lobehub.com/mcp

**Interaction:**
- Click MCP card to view MCP Detail Page
- Apply filters and search
- Download individual or bulk MCP files

#### 3.2.7 Prompts Page

**Display:**
- Grid layout of prompt template cards
- Each card shows: title, description, compatible platforms (badges), category tag, download button, checkbox (in select mode)

**Filter Options:**
- By Platform
- By Category
- Search input field

**Sort Options:**
- Newest
- Popular

**Download Features:**
- Individual download button on each card (download as .txt, .md, or .json)
- Bulk download button to download all visible/filtered results as ZIP
- Bulk download by category button
- Select mode toggle: enables checkboxes on cards for selective bulk download

**Content Source:**
- Scraped and extracted from provided URLs

**Interaction:**
- Click prompt card to view Prompt Detail Page
- Apply filters and search
- Download individual or bulk prompt files

#### 3.2.8 Resource Detail Pages

**Applies to:** Agent Detail, Skill Detail, Plugin Detail, Tool Detail, MCP Detail, Prompt Detail

**Display:**
- Resource title
- Full description
- Compatible platforms (badges)
- Use case explanation
- Category tag
- Download button (download as .txt, .md, or .json)

**Functionality:**
- Display complete resource information from database
- Download resource file when user clicks download button

#### 3.2.9 Guides Page

**Display:**
- Grid layout of guide/article cards
- Each card shows: title, description, category, platform tags, published date

**Filter Options:**
- By Category: Claude, ChatGPT, Gemini Spark, How-To, Comparisons
- Search input field

**Pre-populated Guides (51 total):**
- How-to guides: create a Claude skill, create a Gemini Spark skill, create a ChatGPT skill, turn a prompt into a skill, use Claude Cowork, use Gemini Spark
- Comparisons: Claude vs ChatGPT, ChatGPT vs Gemini Spark, Claude Desktop vs Gemini Spark
- Tool explainers: What is Claude Cowork, What is Gemini Spark, What is Claude Fable 5, What is ChatGPT Work
- Best-of lists: Best Claude Skills, Best ChatGPT Skills, Best Gemini Spark Skills, Best AI Email Skills, Best AI Website Skills
- Learning paths: AI Skills Learning Path for Beginners

**Interaction:**
- Click guide card to view full article content
- Apply filters to narrow down displayed guides
- Use search to find specific guides

#### 3.2.10 Setup Guides Page

**Display:**
- List of setup guides for different AI platforms
- Each guide shows: platform name, step-by-step instructions

**Pre-populated Setup Guides:**
- Claude Cowork Setup
- Gemini Spark Setup
- ChatGPT Work Setup

**Functionality:**
- Display complete setup instructions for each platform
- Users can follow step-by-step guides to configure their AI platforms

#### 3.2.11 Free Tools Page

**Display:**
- Grid layout of free tool cards
- Each card shows: tool name, description, \"Use Tool\" button

**Content:**
- Free tools and utilities from pre-populated data (free-tools, ai-agent-generator pages)

**Functionality:**
- Display available free tools
- Link to tool usage pages

#### 3.2.12 About Page

**Content:**
- What is Open XStack
- Mission statement
- Purpose and goals of the platform

#### 3.2.13 Category Pages

**Functionality:**
- Dedicated page for each category showing all related resources
- Display agents, skills, plugins, tools, MCP servers, prompts, and guides belonging to the selected category
- Same filter, search, and download capabilities as resource pages

#### 3.2.14 Platform Pages

**Platforms:**
- Claude
- ChatGPT
- Gemini Spark
- Open WebUI
- LobeHub
- MultiOn
- SwarmClaw

**Functionality:**
- Dedicated page for each platform showing all related resources
- Display all resource types compatible with the selected platform
- Same filter, search, and download capabilities as resource pages

### 3.3 Global Features

#### 3.3.1 Global Search
- Search bar accessible from all pages
- Search across all resource types (agents, skills, plugins, tools, MCP, prompts, guides)
- Display search results with resource type indicators

#### 3.3.2 Dark/Light Mode Toggle
- Toggle button accessible from all pages
- Switch between dark theme (default) and light theme
- User preference persists across sessions

#### 3.3.3 Navigation Menu
- Consistent navigation menu across all pages
- Links to: Home, Agents, Skills, Plugins, Tools, MCP, Prompts, Guides, Setup Guides, Free Tools, About

## 4. Business Rules and Logic

### 4.1 Data Structure

**Resources Table (unified structure for Agents, Skills, Plugins, Tools, MCP, Prompts):**
- slug (unique identifier)
- resource_type (agent/skill/plugin/tool/mcp/prompt)
- title
- description
- category
- compatible_platforms (array)
- is_free (boolean)
- file_url
- source_url (original URL from scraping)

**Guides Table:**
- slug (unique identifier)
- title
- description
- category
- platform_tags (array)
- published_date

### 4.2 Content Scraping and Extraction

**Source URLs:**
- https://lobehub.com/agent
- https://lobehub.com/mcp
- https://lobehub.com/skills
- https://openclaw.ai/
- https://www.swarmclaw.ai/
- https://clawhub.ai/plugins
- https://www.swarmdock.ai/
- https://docs.multion.ai/welcome
- https://skillsllm.com/skill/swarmclaw
- https://agentfield.ai/
- https://agencyagents.dev/agents
- https://docs.omni.co/developers/agent-skills
- https://github.com/msitarzewski/agency-agents
- https://app.open-agent.io/onboarding
- https://openwebui.com/home

**Extraction Logic:**
- Extract resource title, description, category, compatible platforms from each source URL
- Store extracted data in Resources Table with appropriate resource_type
- Preserve source_url for reference

### 4.3 Download Functionality

**Individual Download:**
- User clicks download button on resource card or detail page
- System generates file in selected format (.txt, .md, or .json)
- File contains resource title, description, content, and metadata
- Browser initiates file download

**Bulk Download (All Visible/Filtered Results):**
- User clicks bulk download button
- System collects all currently displayed resources (after filters applied)
- System generates individual files for each resource
- System packages all files into a ZIP archive
- Browser initiates ZIP file download

**Bulk Download by Category:**
- User clicks bulk download by category button
- System collects all resources in current category
- System generates individual files for each resource
- System packages all files into a ZIP archive
- Browser initiates ZIP file download

**Select Mode Bulk Download:**
- User toggles select mode
- Checkboxes appear on all resource cards
- User checks desired resources
- User clicks bulk download button
- System collects only selected resources
- System generates individual files for each selected resource
- System packages all files into a ZIP archive
- Browser initiates ZIP file download

### 4.4 Filter Logic

**Resource Pages (Agents, Skills, Plugins, Tools, MCP, Prompts):**
- Platform filter: display only resources where compatible_platforms array contains selected platform
- Category filter: display only resources matching selected category
- Multiple filters can be applied simultaneously (AND logic)
- Search filter: match against title and description fields

**Guides Page:**
- Category filter: display only guides matching selected category
- Platform filter: display only guides where platform_tags array contains selected platform
- Multiple filters can be applied simultaneously (AND logic)
- Search filter: match against title and description fields

### 4.5 Sort Logic

**Newest:**
- Sort by published_date or created_date in descending order

**Popular:**
- Sort by view count or popularity metric in descending order

### 4.6 Search Logic

- Search query matches against title and description fields
- Case-insensitive matching
- Display results grouped by resource type (Agents, Skills, Plugins, Tools, MCP, Prompts, Guides)

### 4.7 Data Extensibility

- System must support easy addition of new resources from additional URLs
- Database structure allows for future content expansion
- Backend capability to scrape and extract data from new sources

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| No search results found | Display \"No results found\" message with suggestion to try different keywords |
| No resources match selected filters | Display \"No resources match your filters\" message with option to clear filters |
| Resource file URL is empty or invalid | Disable download button or show error message |
| Guide content fails to load | Display error message and retry option |
| Dark/Light mode preference not saved | Default to dark theme |
| Platform badge data missing | Display resource without platform badges |
| Category data missing | Display resource under \"Uncategorized\" |
| Scraping source URL fails | Log error, skip resource, continue with other sources |
| Bulk download with no resources selected | Display message \"Please select at least one resource\" |
| Bulk download exceeds size limit | Display warning message and suggest downloading by category or smaller selections |
| Download file generation fails | Display error message and retry option |
| ZIP file creation fails | Display error message and suggest individual downloads |

## 6. Acceptance Criteria

1. User opens Open XStack home page and sees hero section, search bar, featured resources carousel, category grid, featured guides, and platform badges
2. User clicks on Agents navigation link and sees grid of agent cards scraped from source URLs with filter options, sort options, and download buttons
3. User clicks download button on an agent card and successfully downloads the agent file in .txt, .md, or .json format
4. User toggles select mode on Skills page, checks 5 skills, clicks bulk download button, and successfully downloads a ZIP file containing the 5 selected skills
5. User clicks bulk download by category button on Plugins page and successfully downloads a ZIP file containing all plugins in the current category
6. User applies platform filter (e.g., Claude) on Tools page and sees only tools compatible with Claude platform
7. User clicks on MCP navigation link and sees grid of MCP server cards scraped from https://lobehub.com/mcp
8. User clicks on Prompts navigation link and sees grid of prompt template cards with download functionality
9. User uses global search bar to search for \"email\" and sees search results showing relevant resources across all types (agents, skills, plugins, tools, prompts)
10. User clicks on Guides navigation link and sees grid of 51 pre-populated guide cards with filter options
11. User clicks on Setup Guides navigation link and sees setup instructions for Claude Cowork, Gemini Spark, and ChatGPT Work
12. User toggles dark/light mode and sees theme change applied across the application

## 7. Out of Scope for This Release

- User registration and login system
- User-generated content submission
- Rating and review system for resources
- Bookmark or favorite functionality
- Social sharing features
- Comments section on guides
- Email notifications or newsletters
- Analytics dashboard
- Admin panel for content management (will be added later)
- Multi-language support
- Advanced search with filters in search results page
- Resource version history or updates tracking
- Integration with external AI platforms
- API for third-party access
- Mobile native applications (iOS/Android)
- Offline mode or PWA capabilities
- File format conversion beyond .txt, .md, .json
- Scheduled scraping or automatic content updates
- Duplicate detection across scraped sources
- Resource quality scoring or verification