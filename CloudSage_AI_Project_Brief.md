# CloudSage AI — Infrastructure Cost Optimization Platform
### Project Brief for AI-Assisted Development

---

## 🧭 Project Overview

**CloudSage AI** is a Solutions Architect's AI-powered assistant that analyzes AWS infrastructure configurations, identifies cost inefficiencies, and delivers intelligent optimization recommendations — all through a clean, professional dashboard interface.

This is a **3-Tier production-grade web application** designed to be deployed on AWS using Terraform + GitHub Actions CI/CD. The app itself is built with React (frontend), Python FastAPI (backend), and PostgreSQL (database).

> **Target User:** Solutions Architects, Cloud Engineers, DevOps Engineers who manage AWS infrastructure and want actionable cost insights powered by AI.

---

## 🎯 Core Features

### 1. Infrastructure Input Panel
- User can input AWS resource configurations manually via form fields
- Supported resource types:
  - EC2 instances (instance type, count, region, usage hours/month)
  - RDS databases (instance type, storage GB, multi-AZ yes/no)
  - S3 buckets (storage GB, requests/month, transfer GB)
  - ECS/EKS clusters (task count, CPU/memory allocation)
  - NAT Gateways (data processed GB/month)
  - Load Balancers (ALB/NLB, LCUs/month)
- User can also paste a raw JSON/YAML infrastructure config block
- "Analyze" button triggers the AI analysis pipeline

### 2. AI Cost Analysis Engine
- Sends the resource config to Claude API (claude-sonnet-4-20250514)
- Claude returns a **structured JSON response** containing:
  - Estimated monthly cost per resource
  - Total estimated monthly spend
  - Optimization recommendations (array of objects)
  - Each recommendation includes: resource, issue, suggestion, estimated_savings_usd, priority (high/medium/low), effort (easy/medium/hard)
  - Architecture risk flags (over-provisioned, single-AZ, unused resources, etc.)
  - Savings summary: total potential savings per month and per year

### 3. Cost Dashboard
- **Summary cards row:** Total Current Spend · Potential Savings · Optimized Spend · Savings %
- **Cost Breakdown Chart:** Pie/donut chart showing spend by service (EC2, RDS, S3, etc.)
- **Recommendations Table:** Sortable by priority/savings, filterable by effort level
- Each recommendation card shows: resource name, issue description, AI suggestion, savings badge, effort tag, priority color indicator
- **Before vs After bar chart:** Current cost vs projected cost after applying all recommendations

### 4. Conversation Follow-up (ChatOps)
- After the initial analysis, user can ask follow-up questions in a chat panel
- Example questions: "What if I switch all EC2 to Savings Plans?", "Show me only high-priority changes", "Explain the RDS recommendation in detail"
- Chat history is saved per analysis session
- Claude maintains context of the current infrastructure config throughout the conversation

### 5. History & Sessions
- Each analysis is saved as a session with a timestamp and config snapshot
- User can view past sessions and compare recommendations over time
- Sessions list in a sidebar with search/filter
- Ability to export a session as PDF report

### 6. Architecture Risk Score
- AI generates an overall "Architecture Health Score" (0–100)
- Broken into sub-scores: Cost Efficiency · Reliability · Security Posture · Scalability
- Visual gauge/meter UI component per score
- Brief AI-generated commentary on each score

---

## 🖥️ Frontend Specification

**Framework:** React 18 + Vite  
**Styling:** TailwindCSS  
**Charts:** Recharts  
**HTTP Client:** Axios  
**State Management:** React Context API or Zustand  
**Icons:** Lucide React  

### Design Inspiration
The UI is inspired by a clean, modern SaaS landing + dashboard hybrid design (reference: Dribbble — Fahema Yesmin, SaleRush). Key qualities to extract and adapt for CloudSage AI:

- **White/light backgrounds with bold black typography** — feels premium, trustworthy, professional
- **Hero section with a live data widget embedded in it** — show a mini cost chart or savings card floating inside the hero, not just text
- **Blue as the signature accent** — used sparingly on CTAs, highlighted keywords, icons, and chart fills
- **Feature cards with icon + title + description layout** — clean 3-column grid
- **Testimonials / social proof section** — use fake-but-realistic Solutions Architect testimonials
- **Navbar** — clean, minimal, with logo left + nav links center + CTA button right

---

### Design Direction (CloudSage AI Adaptation)

| Property | Reference (SaleRush) | CloudSage AI Adaptation |
|----------|---------------------|------------------------|
| **Background** | Pure white `#ffffff` | Warm off-white `#f8fafc` with subtle grid pattern |
| **Primary text** | Near-black `#1a1a2e` | Slate `#0f172a` |
| **Accent color** | Bright blue `#3b82f6` | Electric indigo-blue `#4f6ef7` |
| **Warning/alert** | Orange gradient | Amber `#f59e0b` for cost overruns |
| **Success/savings** | — | Emerald `#10b981` for savings metrics |
| **Hero layout** | Bold headline + embedded chart widget | Bold headline + floating AWS cost breakdown card |
| **Font — Display** | Heavy sans-serif | **Clash Display** or **Cabinet Grotesk** (bold, modern) |
| **Font — Body** | Clean readable | **Plus Jakarta Sans** (warm, professional) |
| **Font — Numbers** | Standard | **JetBrains Mono** (technical, monospace for $ figures) |
| **Charts** | Bar charts with rounded tops | Recharts — rounded bars + smooth area charts |
| **Cards** | White, soft shadow | White with `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` + subtle border |
| **CTA Button** | Solid blue "Sign Up" | Solid indigo "Start Free Analysis" with arrow icon |

---

### Page-by-Page Design Spec

#### `/` — Landing / Home Page
Sections in order (exactly like the Dribbble reference):
1. **Navbar** — Logo left · Nav links (Features, How it Works, Pricing, Docs) · "Start Free Analysis" CTA button right
2. **Hero Section** — Large bold headline: *"Optimize Your AWS Costs with AI"* · subtext · two CTAs (primary + secondary) · **floating dashboard card** showing a mini bar chart of AWS spend by service (mock data, visually embedded like the SaleRush balance card)
3. **Logos / Trust bar** — "Trusted by engineers at:" + placeholder company logos (or AWS partner badges)
4. **Features Section** — 3-column grid: icon + title + description for: AI Analysis · Cost Breakdown · Architecture Scoring · Chat Follow-up · Session History · Export Reports
5. **Product Demo Section** — Bold headline: *"Discover the power of real-time cost intelligence"* · Left: feature list with bullet points · Right: screenshot/mockup of the dashboard
6. **How It Works** — 3-step horizontal flow: Input Your Config → AI Analyzes → Get Recommendations
7. **Testimonials** — 2-row grid of 3 cards each (like SaleRush reference) with avatar + name + role + quote from fictional Solutions Architects
8. **Pricing Section** — 3 tiers: Free · Pro · Team
9. **CTA Banner** — Full-width indigo background · "Start optimizing your AWS spend today" · button
10. **Footer** — Links + copyright

#### `/analyze` — Analysis Workspace (App)
- **Top navbar** switches to app nav (no marketing links)
- **Left sidebar** — session history list + new analysis button
- **Main area** — Split view: Input form (left 40%) + Results dashboard (right 60%)
- Results use the same card/chart aesthetic as the landing page — consistent visual language
- Loading state: animated indigo progress bar + step labels

#### `/history`, `/session/:id`, `/settings`
- Full app layout (sidebar + topnav)
- Same card/table aesthetic — white cards, soft shadows, indigo accents

---

### CSS Design Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: #f8fafc;
  --bg-card: #ffffff;
  --bg-sidebar: #0f172a;
  --bg-sidebar-hover: #1e293b;

  /* Text */
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --text-sidebar: #e2e8f0;

  /* Accents */
  --accent-primary: #4f6ef7;       /* Main blue-indigo */
  --accent-primary-hover: #3b5bdb;
  --accent-success: #10b981;       /* Savings green */
  --accent-warning: #f59e0b;       /* Cost alert amber */
  --accent-danger: #ef4444;        /* High priority red */

  /* Borders & Shadows */
  --border-color: #e2e8f0;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.10);

  /* Typography */
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

### Animations to Include
- **Hero chart card** — floats with subtle `translateY` CSS animation (like SaleRush balance card)
- **Number counters** — animate from 0 to final value on page load (use `CountUp.js`)
- **Feature cards** — staggered fade-up on scroll (Intersection Observer)
- **CTA button** — subtle scale + shadow on hover
- **Analysis loader** — animated indigo progress steps with checkmarks
- **Chart bars** — draw up animation via Recharts `animationBegin` + `animationDuration`

### Pages / Views
1. **`/` — Home/Landing:** Brief hero, "Start New Analysis" CTA, recent sessions preview
2. **`/analyze` — Analysis Workspace:** Input panel + results dashboard (main view)
3. **`/history` — Session History:** List of all past analyses with summary stats
4. **`/session/:id` — Session Detail:** Full analysis results for a saved session
5. **`/settings` — Settings:** API key config (optional), preferences

### Key Components to Build
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── TopNav.jsx
│   │   └── Layout.jsx
│   ├── analysis/
│   │   ├── ResourceInputForm.jsx      # Form to input AWS resources
│   │   ├── JsonConfigInput.jsx        # Raw JSON/YAML paste input
│   │   ├── AnalysisLoader.jsx         # Animated loading state
│   │   └── ArchitectureHealthScore.jsx # Score gauges
│   ├── dashboard/
│   │   ├── SummaryCards.jsx           # KPI cards row
│   │   ├── CostBreakdownChart.jsx     # Donut chart
│   │   ├── BeforeAfterChart.jsx       # Bar chart comparison
│   │   └── RecommendationsTable.jsx   # Sortable recommendations
│   ├── chat/
│   │   ├── ChatPanel.jsx              # Follow-up conversation UI
│   │   └── ChatMessage.jsx            # Individual message bubble
│   └── shared/
│       ├── Badge.jsx                  # Priority/effort badges
│       ├── MetricCard.jsx             # Reusable stat card
│       └── LoadingSkeleton.jsx
├── pages/
│   ├── Home.jsx
│   ├── Analyze.jsx
│   ├── History.jsx
│   ├── SessionDetail.jsx
│   └── Settings.jsx
├── api/
│   └── client.js                      # Axios instance pointing to FastAPI backend
├── context/
│   └── AnalysisContext.jsx
└── utils/
    └── formatters.js                  # Currency, percentage formatters
```

---

## ⚙️ Backend Specification

**Framework:** Python 3.11 + FastAPI  
**AI SDK:** `anthropic` Python SDK  
**ORM:** SQLAlchemy + Alembic (migrations)  
**Database Driver:** `asyncpg` (async PostgreSQL)  
**Validation:** Pydantic v2  
**CORS:** FastAPI CORS middleware (allow React dev server)  

### Environment Variables Required
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/cloudsage
ANTHROPIC_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-sonnet-4-20250514
APP_ENV=development
```

### API Endpoints

#### Analysis
```
POST   /api/v1/analyze              # Submit config, get AI analysis
POST   /api/v1/analyze/{id}/chat    # Follow-up chat message on a session
GET    /api/v1/analyze/{id}         # Get a specific analysis session
```

#### Sessions
```
GET    /api/v1/sessions             # List all sessions (paginated)
GET    /api/v1/sessions/{id}        # Get session detail
DELETE /api/v1/sessions/{id}        # Delete a session
```

#### Health
```
GET    /health                      # Health check endpoint (used by ALB)
GET    /api/v1/info                 # App info (version, model used)
```

### Claude API Integration Details

**System Prompt for Analysis:**
```
You are CloudSage, an expert AWS Solutions Architect and FinOps specialist.
Analyze the provided AWS infrastructure configuration and return a detailed
cost optimization analysis in valid JSON format only. No markdown, no prose outside JSON.
```

**Claude Response Schema (enforce via prompt):**
```json
{
  "total_monthly_cost_usd": 0.00,
  "optimized_monthly_cost_usd": 0.00,
  "total_savings_usd": 0.00,
  "savings_percentage": 0.0,
  "cost_breakdown": [
    { "service": "EC2", "monthly_cost": 0.00, "percentage": 0.0 }
  ],
  "recommendations": [
    {
      "id": "rec_001",
      "resource_type": "EC2",
      "resource_name": "",
      "issue": "",
      "recommendation": "",
      "estimated_savings_usd": 0.00,
      "priority": "high|medium|low",
      "effort": "easy|medium|hard",
      "category": "rightsizing|reserved|scheduling|architecture|storage"
    }
  ],
  "health_scores": {
    "overall": 0,
    "cost_efficiency": 0,
    "reliability": 0,
    "security_posture": 0,
    "scalability": 0,
    "commentary": {
      "cost_efficiency": "",
      "reliability": "",
      "security_posture": "",
      "scalability": ""
    }
  },
  "risk_flags": [
    { "severity": "high|medium|low", "resource": "", "message": "" }
  ]
}
```

### Project File Structure
```
backend/
├── app/
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Settings via pydantic-settings
│   ├── database.py                # Async SQLAlchemy engine + session
│   ├── models/
│   │   ├── session.py             # SQLAlchemy ORM models
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── analysis.py            # Pydantic request/response schemas
│   │   └── session.py
│   ├── routers/
│   │   ├── analysis.py            # /api/v1/analyze routes
│   │   └── sessions.py            # /api/v1/sessions routes
│   ├── services/
│   │   ├── claude_service.py      # All Anthropic API calls
│   │   └── analysis_service.py   # Business logic
│   └── utils/
│       └── prompt_builder.py      # Builds system + user prompts
├── alembic/                       # DB migrations
├── alembic.ini
├── requirements.txt
├── Dockerfile
└── .env.example
```

---

## 🗄️ Database Schema

**Database:** PostgreSQL 15  

```sql
-- Analysis Sessions
CREATE TABLE analysis_sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title       VARCHAR(255),                        -- Auto-generated or user-named
    input_config JSONB NOT NULL,                     -- Raw input the user submitted
    input_type  VARCHAR(50),                         -- 'form' or 'json'
    ai_response  JSONB NOT NULL,                     -- Full Claude response stored
    total_monthly_cost    DECIMAL(12,2),
    optimized_monthly_cost DECIMAL(12,2),
    total_savings         DECIMAL(12,2),
    savings_percentage    DECIMAL(5,2),
    overall_health_score  INTEGER,
    status      VARCHAR(50) DEFAULT 'completed'      -- 'pending','completed','failed'
);

-- Chat Messages per Session
CREATE TABLE chat_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role        VARCHAR(20) NOT NULL,                -- 'user' or 'assistant'
    content     TEXT NOT NULL,
    token_count INTEGER
);

-- Recommendations (denormalized for fast querying)
CREATE TABLE recommendations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    rec_id          VARCHAR(50),                     -- Claude-assigned ID (rec_001 etc)
    resource_type   VARCHAR(100),
    resource_name   VARCHAR(255),
    issue           TEXT,
    recommendation  TEXT,
    estimated_savings_usd DECIMAL(10,2),
    priority        VARCHAR(20),
    effort          VARCHAR(20),
    category        VARCHAR(50)
);

-- Indexes
CREATE INDEX idx_sessions_created_at ON analysis_sessions(created_at DESC);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_recommendations_session_id ON recommendations(session_id);
CREATE INDEX idx_recommendations_priority ON recommendations(priority);
```

---

## 🐳 Docker Setup (3 Containers)

```yaml
# docker-compose.yml (for local development)
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql+asyncpg://cloudsage:cloudsage@db:5432/cloudsage
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on: [db]

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: cloudsage
      POSTGRES_PASSWORD: cloudsage
      POSTGRES_DB: cloudsage
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports: ["5432:5432"]

volumes:
  postgres_data:
```

---

## 📋 Prompts to Give Claude for Building Each Layer

### PROMPT 1 — Build the Frontend

```
I am building CloudSage AI — an AWS Infrastructure Cost Optimization Platform 
for Solutions Architects. Build the complete React + Vite + TailwindCSS frontend 
based on the full project spec below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN REFERENCE & INSPIRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The UI is inspired by a modern SaaS product design (Dribbble reference: SaleRush 
by Fahema Yesmin). Extract these specific design qualities:

1. LAYOUT STYLE
   - Clean white/off-white backgrounds (#f8fafc) — NOT dark theme
   - Bold, heavy black headlines paired with lighter body text
   - Left sidebar (dark #0f172a) for app navigation, white main content area
   - Marketing landing page (/) uses full-width sections like a real SaaS product

2. HERO SECTION (for / landing page)
   - Large bold headline: "Optimize Your AWS Costs with AI"
   - A floating dashboard widget embedded IN the hero — show a mini bar chart 
     of AWS spend by service (EC2, RDS, S3, ECS) with mock data, styled exactly 
     like the SaleRush "Balance" card — white card, soft shadow, bar chart inside
   - Two CTA buttons: "Start Free Analysis" (filled indigo) + "See How It Works" (outline)

3. COLOR TOKENS (use exactly these)
   --bg-primary: #f8fafc
   --bg-card: #ffffff
   --bg-sidebar: #0f172a
   --accent-primary: #4f6ef7      ← indigo-blue (replaces SaleRush's bright blue)
   --accent-success: #10b981      ← emerald for savings
   --accent-warning: #f59e0b      ← amber for cost alerts
   --accent-danger: #ef4444       ← red for high priority
   --text-primary: #0f172a
   --text-secondary: #64748b
   --border-color: #e2e8f0
   --shadow-card: 0 1px 3px rgba(0,0,0,0.08)

4. TYPOGRAPHY
   - Display/Headlines: 'Clash Display' or 'Cabinet Grotesk' — bold, modern
   - Body text: 'Plus Jakarta Sans' — warm, professional
   - Numbers/metrics: 'JetBrains Mono' — monospace, technical feel for $ amounts
   - Load fonts from Google Fonts or Fontsource

5. LANDING PAGE SECTIONS (in order, like the Dribbble reference)
   Section 1: Navbar — Logo + nav links + "Start Free Analysis" CTA
   Section 2: Hero — headline + subtext + CTAs + floating AWS spend chart widget
   Section 3: Trust bar — "Trusted by engineers at [logos]"
   Section 4: Features — 3-col grid with icon + title + description (6 features)
   Section 5: Product demo — bold headline + feature list left + dashboard screenshot right
   Section 6: How It Works — 3-step horizontal: Input → Analyze → Optimize
   Section 7: Testimonials — 2-row × 3-col grid of cards (avatar + name + role + quote)
              Use fictional Solutions Architects as testimonial authors
   Section 8: Pricing — 3 tiers (Free / Pro / Team)
   Section 9: CTA banner — full-width indigo bg + headline + button
   Section 10: Footer

6. CARDS & COMPONENTS
   - All cards: white bg, border: 1px solid #e2e8f0, border-radius: 12px, 
     box-shadow: 0 1px 3px rgba(0,0,0,0.08)
   - Hover state: shadow increases to 0 4px 12px rgba(0,0,0,0.10)
   - Feature icons: square indigo (#4f6ef7) rounded bg with white icon inside
     (exactly like the SaleRush "Awesome Interface" feature cards)
   - Testimonial cards: white, quote mark top-right in light gray, avatar + name + handle

7. ANIMATIONS
   - Hero floating chart card: subtle CSS translateY loop animation (floating effect)
   - Number counters (savings $, cost $): animate from 0 to value on mount
   - Feature cards: staggered fade-up on scroll using Intersection Observer
   - CTA button: scale(1.02) + shadow on hover
   - Chart bars: draw-up animation via Recharts animationDuration
   - Analysis loader: indigo animated progress steps with ✓ checkmarks

━━━━━━━━━━━━━━━━━━━━━━━━━━
BUILD REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━
- Build ALL pages and ALL components listed in the spec
- Use Recharts for all charts (bar, donut, area)
- Use Lucide React for all icons
- Use Axios for API calls to http://localhost:8000
- Include realistic mock/demo data so every page renders fully without a backend
- The /analyze page uses sidebar layout (dark sidebar + white content)
- The / landing page uses full-width marketing layout (no sidebar)
- Make it production-grade — a recruiter should look at this and think it's a real product

[PASTE FULL PROJECT BRIEF HERE]
```

---

### PROMPT 2 — Build the Backend

```
I am building CloudSage AI — an AWS Infrastructure Cost Optimization Platform.
Build the complete Python FastAPI backend as specified below.

Requirements:
- Use the anthropic Python SDK to call claude-sonnet-4-20250514
- All Claude calls must enforce structured JSON responses (no markdown)
- Use async SQLAlchemy with asyncpg for PostgreSQL
- Use Pydantic v2 for all request/response validation
- Include Alembic migration files for all tables
- Add proper error handling — if Claude returns malformed JSON, retry once
- The /health endpoint must return {"status": "ok", "db": "ok", "model": "..."}
- Add CORS middleware allowing all origins (will be locked down in production via ALB)
- Include a Dockerfile using python:3.11-slim base image

[PASTE FULL PROJECT BRIEF HERE]
```

---

### PROMPT 3 — Build the Database Layer

```
I am building CloudSage AI. Set up the complete PostgreSQL database layer:

1. Write all SQLAlchemy ORM models (async) as specified in the schema section
2. Write Alembic migration files to create all tables and indexes
3. Write a database.py with async engine setup, session factory, and get_db dependency
4. Write seed data script (seed.py) with 2-3 realistic sample analysis sessions 
   with recommendations so the app has demo data on first run
5. Write a db_utils.py with helper functions for common queries

Use asyncpg driver. Include all indexes from the schema.
Make all models use UUID primary keys with gen_random_uuid().

[PASTE FULL PROJECT BRIEF HERE]
```

---

## 🔑 AI Tools Recommended Per Layer

| Task | Recommended AI | Why |
|------|---------------|-----|
| Frontend (React UI) | **Claude** (claude.ai) | Best at component structure, TailwindCSS, Recharts |
| Backend (FastAPI) | **Claude** (claude.ai) | Excellent at Python async, Pydantic v2, SQLAlchemy |
| Database Schema | **Claude** (claude.ai) | Strong SQL, Alembic migrations, PostgreSQL |
| AI Cost Analysis Logic | **Claude API** (claude-sonnet-4-20250514) | Powers the core feature inside the app |
| Architecture Diagrams | **Claude** (claude.ai) | Can generate Mermaid or draw.io XML |
| Dockerfile / Compose | **Claude** (claude.ai) | Reliable for container configs |
| Debugging errors | **Claude** (claude.ai) | Paste error + code, ask for fix |
| README writing | **Claude** (claude.ai) | Portfolio-ready documentation |

> **DevOps layer (Terraform, GitHub Actions, ECS, RDS, ALB)** — You build this yourself as your learning practice.

---

## ✅ Definition of Done (App Layer)

Before handing to DevOps layer, the app must:

- [ ] All 5 pages render without errors
- [ ] Resource input form submits and shows analysis results
- [ ] Claude API returns structured JSON and populates the dashboard
- [ ] All 4 charts render with real data from Claude response
- [ ] Recommendations table is sortable and filterable
- [ ] Chat follow-up sends messages and shows Claude response
- [ ] Session is saved to PostgreSQL after each analysis
- [ ] Session history page loads and shows past analyses
- [ ] `/health` endpoint returns 200 with DB status
- [ ] `docker-compose up` brings all 3 tiers up cleanly
- [ ] No hardcoded secrets — all config via environment variables

---

## 📁 GitHub Repository Structure

### Repo Name: `cloudsage-ai`
**Visibility:** Public (portfolio project)
**Branch Strategy:** `main` (production) · `dev` (development) · `feature/*` (features)

---

### Complete Folder + File Tree

```
cloudsage-ai/                                   ← GitHub repo root
│
├── 📄 README.md                                ← Portfolio README (architecture diagram + demo GIF)
├── 📄 .gitignore                               ← Root gitignore (covers all 3 tiers)
├── 📄 .env.example                             ← Template for all env vars (NO real secrets)
├── 📄 docker-compose.yml                       ← Local dev: spins up all 3 containers
├── 📄 docker-compose.override.yml              ← Local overrides (hot-reload, debug ports)
├── 📄 CONTRIBUTING.md                          ← How to set up locally (good for interviewers)
├── 📄 LICENSE                                  ← MIT License
│
├── 📁 .github/                                 ← GitHub-specific config
│   ├── 📁 workflows/                           ← GitHub Actions CI/CD pipelines
│   │   ├── 📄 ci.yml                           ← Run on every PR: lint + test + docker build
│   │   ├── 📄 deploy-dev.yml                   ← Deploy to dev on push to dev branch
│   │   └── 📄 deploy-prod.yml                  ← Deploy to prod on push to main branch
│   ├── 📁 ISSUE_TEMPLATE/
│   │   ├── 📄 bug_report.md
│   │   └── 📄 feature_request.md
│   └── 📄 pull_request_template.md
│
├── 📁 frontend/                                ← Tier 1: React + Vite + TailwindCSS
│   ├── 📄 Dockerfile                           ← Multi-stage: node build → nginx serve
│   ├── 📄 nginx.conf                           ← Nginx config for serving React SPA
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   ├── 📄 index.html
│   ├── 📄 .env.example                         ← VITE_API_URL=http://localhost:8000
│   ├── 📄 .eslintrc.js
│   ├── 📁 public/
│   │   ├── 📄 favicon.ico
│   │   └── 📄 logo.svg
│   └── 📁 src/
│       ├── 📄 main.jsx
│       ├── 📄 App.jsx
│       ├── 📄 index.css
│       ├── 📁 components/
│       │   ├── 📁 layout/
│       │   │   ├── 📄 Sidebar.jsx
│       │   │   ├── 📄 TopNav.jsx
│       │   │   └── 📄 Layout.jsx
│       │   ├── 📁 analysis/
│       │   │   ├── 📄 ResourceInputForm.jsx
│       │   │   ├── 📄 JsonConfigInput.jsx
│       │   │   ├── 📄 AnalysisLoader.jsx
│       │   │   └── 📄 ArchitectureHealthScore.jsx
│       │   ├── 📁 dashboard/
│       │   │   ├── 📄 SummaryCards.jsx
│       │   │   ├── 📄 CostBreakdownChart.jsx
│       │   │   ├── 📄 BeforeAfterChart.jsx
│       │   │   └── 📄 RecommendationsTable.jsx
│       │   ├── 📁 chat/
│       │   │   ├── 📄 ChatPanel.jsx
│       │   │   └── 📄 ChatMessage.jsx
│       │   └── 📁 shared/
│       │       ├── 📄 Badge.jsx
│       │       ├── 📄 MetricCard.jsx
│       │       └── 📄 LoadingSkeleton.jsx
│       ├── 📁 pages/
│       │   ├── 📄 Home.jsx
│       │   ├── 📄 Analyze.jsx
│       │   ├── 📄 History.jsx
│       │   ├── 📄 SessionDetail.jsx
│       │   └── 📄 Settings.jsx
│       ├── 📁 api/
│       │   └── 📄 client.js
│       ├── 📁 context/
│       │   └── 📄 AnalysisContext.jsx
│       └── 📁 utils/
│           └── 📄 formatters.js
│
├── 📁 backend/                                 ← Tier 2: Python FastAPI
│   ├── 📄 Dockerfile                           ← python:3.11-slim base
│   ├── 📄 requirements.txt
│   ├── 📄 requirements-dev.txt                 ← pytest, httpx, black, ruff
│   ├── 📄 alembic.ini
│   ├── 📄 .env.example                         ← All backend env var templates
│   ├── 📁 app/
│   │   ├── 📄 main.py                          ← FastAPI app, CORS, router registration
│   │   ├── 📄 config.py                        ← Pydantic settings (reads from env)
│   │   ├── 📄 database.py                      ← Async SQLAlchemy engine + session
│   │   ├── 📁 models/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 session.py                   ← AnalysisSession ORM model
│   │   │   ├── 📄 message.py                   ← ChatMessage ORM model
│   │   │   └── 📄 recommendation.py            ← Recommendation ORM model
│   │   ├── 📁 schemas/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 analysis.py                  ← Request/response Pydantic models
│   │   │   └── 📄 session.py
│   │   ├── 📁 routers/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 analysis.py                  ← /api/v1/analyze routes
│   │   │   └── 📄 sessions.py                  ← /api/v1/sessions routes
│   │   ├── 📁 services/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 claude_service.py            ← All Anthropic API calls
│   │   │   └── 📄 analysis_service.py          ← Business logic layer
│   │   └── 📁 utils/
│   │       ├── 📄 __init__.py
│   │       └── 📄 prompt_builder.py            ← Builds Claude system + user prompts
│   ├── 📁 alembic/
│   │   ├── 📄 env.py
│   │   ├── 📄 script.py.mako
│   │   └── 📁 versions/
│   │       ├── 📄 001_create_analysis_sessions.py
│   │       ├── 📄 002_create_chat_messages.py
│   │       └── 📄 003_create_recommendations.py
│   └── 📁 tests/
│       ├── 📄 __init__.py
│       ├── 📄 conftest.py                      ← pytest fixtures, test DB setup
│       ├── 📄 test_analysis.py                 ← API endpoint tests
│       └── 📄 test_claude_service.py           ← Claude service unit tests
│
├── 📁 database/                                ← Tier 3: PostgreSQL config + scripts
│   ├── 📄 init.sql                             ← DB init script (extensions, roles)
│   ├── 📄 seed.py                              ← Seed 2-3 demo sessions on first run
│   └── 📄 db_utils.py                          ← Helper query functions
│
├── 📁 infrastructure/                          ← DevOps layer (YOUR Terraform practice)
│   ├── 📄 README.md                            ← How to deploy the infra
│   ├── 📁 terraform/
│   │   ├── 📄 main.tf                          ← Root module
│   │   ├── 📄 variables.tf
│   │   ├── 📄 outputs.tf
│   │   ├── 📄 versions.tf                      ← Terraform + provider version locks
│   │   ├── 📄 terraform.tfvars.example         ← Template (never commit real tfvars)
│   │   ├── 📁 modules/
│   │   │   ├── 📁 vpc/                         ← VPC, subnets, IGW, NAT, route tables
│   │   │   │   ├── 📄 main.tf
│   │   │   │   ├── 📄 variables.tf
│   │   │   │   └── 📄 outputs.tf
│   │   │   ├── 📁 ecs/                         ← ECS cluster, task defs, services
│   │   │   │   ├── 📄 main.tf
│   │   │   │   ├── 📄 variables.tf
│   │   │   │   └── 📄 outputs.tf
│   │   │   ├── 📁 rds/                         ← RDS PostgreSQL, subnet group, SGs
│   │   │   │   ├── 📄 main.tf
│   │   │   │   ├── 📄 variables.tf
│   │   │   │   └── 📄 outputs.tf
│   │   │   ├── 📁 alb/                         ← ALB, target groups, listeners, rules
│   │   │   │   ├── 📄 main.tf
│   │   │   │   ├── 📄 variables.tf
│   │   │   │   └── 📄 outputs.tf
│   │   │   ├── 📁 ecr/                         ← ECR repos for frontend + backend images
│   │   │   │   ├── 📄 main.tf
│   │   │   │   ├── 📄 variables.tf
│   │   │   │   └── 📄 outputs.tf
│   │   │   └── 📁 secrets/                     ← Secrets Manager: API key + DB creds
│   │   │       ├── 📄 main.tf
│   │   │       ├── 📄 variables.tf
│   │   │       └── 📄 outputs.tf
│   │   └── 📁 environments/
│   │       ├── 📁 dev/
│   │       │   ├── 📄 main.tf                  ← Dev environment root
│   │       │   ├── 📄 variables.tf
│   │       │   └── 📄 terraform.tfvars.example
│   │       └── 📁 prod/
│   │           ├── 📄 main.tf                  ← Prod environment root
│   │           ├── 📄 variables.tf
│   │           └── 📄 terraform.tfvars.example
│   └── 📁 scripts/
│       ├── 📄 setup-backend.sh                 ← Create S3 bucket + DynamoDB for TF state
│       ├── 📄 build-and-push.sh                ← Build Docker images + push to ECR
│       └── 📄 run-migrations.sh                ← Run Alembic migrations on RDS
│
└── 📁 docs/                                    ← Project documentation
    ├── 📄 architecture.png                     ← AWS architecture diagram (add to README)
    ├── 📄 architecture.drawio                  ← Editable draw.io source
    ├── 📄 local-setup.md                       ← Full local dev setup guide
    ├── 📄 api-reference.md                     ← All API endpoints documented
    └── 📄 deployment-guide.md                  ← Step-by-step AWS deployment
```

---

### .gitignore (Root — covers everything)

```gitignore
# ---- Environment & Secrets ----
.env
.env.local
.env.*.local
*.tfvars
!*.tfvars.example

# ---- Terraform ----
infrastructure/terraform/.terraform/
infrastructure/terraform/**/.terraform/
*.tfstate
*.tfstate.backup
*.tfstate.lock.info
.terraform.lock.hcl
crash.log
override.tf
override.tf.json

# ---- Python / Backend ----
__pycache__/
*.py[cod]
*.pyo
.pytest_cache/
.mypy_cache/
.ruff_cache/
*.egg-info/
dist/
build/
.venv/
venv/
env/

# ---- Node / Frontend ----
node_modules/
frontend/dist/
frontend/build/
.npm/
*.log
npm-debug.log*

# ---- Docker ----
.dockerignore

# ---- IDE & OS ----
.vscode/
.idea/
*.swp
*.swo
.DS_Store
Thumbs.db

# ---- Database ----
*.sqlite
*.db
postgres_data/
```

---

### Git Branch Strategy

```
main          ← Protected. Only merges from dev via PR. Triggers prod deploy.
│
dev           ← Integration branch. Merges from feature branches. Triggers dev deploy.
│
├── feature/frontend-dashboard
├── feature/backend-claude-integration
├── feature/terraform-vpc
├── feature/terraform-ecs
├── feature/github-actions-cicd
└── fix/rds-connection-timeout
```

**Branch Protection Rules for `main` (set in GitHub Settings):**
- Require pull request before merging
- Require at least 1 approval
- Require status checks to pass (CI workflow must be green)
- Do not allow force pushes
- Do not allow deletions

---

### GitHub Secrets to Configure

Go to `Settings → Secrets and variables → Actions` and add:

```
AWS_ROLE_ARN              ← IAM Role ARN for OIDC (no access keys needed)
AWS_REGION                ← e.g. ap-south-1
ANTHROPIC_API_KEY         ← Your Claude API key
DB_PASSWORD               ← RDS master password
TF_STATE_BUCKET           ← S3 bucket name for Terraform remote state
TF_STATE_DYNAMODB_TABLE   ← DynamoDB table name for state locking
```

> **Never store AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY** — use OIDC Role assumption instead. This is the professional way and what all DevOps JDs expect.

---

### Recommended GitHub Repo Setup Checklist

```
[ ] Create repo: github.com/<your-username>/cloudsage-ai  (Public)
[ ] Add description: "AI-powered AWS cost optimization platform for Solutions Architects"
[ ] Add topics: aws, terraform, react, fastapi, devops, ai, claude, ecs, github-actions
[ ] Add architecture.png as social preview image (Settings → Social Preview)
[ ] Pin repo to your GitHub profile
[ ] Enable GitHub Issues (for tracking your own TODO items)
[ ] Set default branch to main
[ ] Add branch protection rules on main
[ ] Add GitHub Secrets (AWS OIDC, Anthropic key)
[ ] Star your own repo (signals activity to recruiters)
```

---

## 🏗️ What Comes Next (DevOps Layer — Your Practice)

Once the app is running locally via Docker Compose:

```
Phase 1  →  Write Terraform for AWS VPC (subnets, IGW, NAT, SGs)
Phase 2  →  Terraform for RDS PostgreSQL in private subnet
Phase 3  →  ECR repositories + push Docker images
Phase 4  →  Terraform for ECS Fargate (3 task definitions)
Phase 5  →  Terraform for ALB + target groups + listener rules
Phase 6  →  GitHub Actions CI/CD (OIDC → ECR push → ECS deploy)
Phase 7  →  S3 remote state + DynamoDB lock for Terraform
Phase 8  →  Secrets Manager for ANTHROPIC_API_KEY + DB credentials
Phase 9  →  README + architecture diagram (portfolio ready)
```

---

*Project: CloudSage AI | Stack: React + FastAPI + PostgreSQL + Claude API | Infra: AWS ECS + RDS + ALB via Terraform*
