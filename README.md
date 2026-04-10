<div align="center">

# ☁️ CloudSage AI

### AWS Infrastructure Cost Optimization Platform

**AI-powered cost analysis for Solutions Architects — identify savings, fix architecture risks, and optimize spend in seconds.**

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📌 What is CloudSage AI?

CloudSage AI is a **production-grade, 3-tier web application** that helps Solutions Architects and Cloud Engineers analyze AWS infrastructure configurations and receive AI-driven cost optimization recommendations.

Submit your AWS resource config (EC2, RDS, S3, ECS, NAT Gateway, ALB) and get back:

- 💰 **Monthly cost breakdown** per service
- 📋 **Prioritized optimization recommendations** with estimated savings
- 🏥 **Architecture Health Score** across Cost Efficiency, Reliability, Security, and Scalability
- ⚠️ **Risk flags** for single points of failure, over-provisioning, and idle resources
- 💬 **AI chat follow-up** — ask questions about your analysis in natural language

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User's Browser                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP
┌──────────────────────────────▼──────────────────────────────┐
│              Frontend  ·  React 18 + Vite + TailwindCSS     │
│                    Served by nginx on port 3000              │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API  /api/v1/...
┌──────────────────────────────▼──────────────────────────────┐
│              Backend  ·  Python FastAPI + uvicorn            │
│          Async SQLAlchemy · Pydantic v2 · Port 8000          │
│                                                              │
│   ┌─────────────────┐        ┌──────────────────────────┐   │
│   │  Claude Service │──────▶│   Anthropic / Gemini API  │   │
│   │  (AI Analysis)  │        │   (Structured JSON out)   │   │
│   └─────────────────┘        └──────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────┘
                               │ asyncpg
┌──────────────────────────────▼──────────────────────────────┐
│              Database  ·  PostgreSQL 15                      │
│   Tables: analysis_sessions · chat_messages · recommendations│
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature                       | Description                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| **AI Cost Analysis**          | Submit EC2, RDS, S3, ECS, NAT, ALB configs — Claude/Gemini returns structured JSON analysis |
| **Cost Dashboard**            | Summary cards, donut chart, before/after bar chart, sortable recommendations table          |
| **Architecture Health Score** | 0–100 score across Cost Efficiency, Reliability, Security Posture, Scalability              |
| **Risk Flags**                | AI-identified single points of failure, over-provisioning, idle resources                   |
| **Chat Follow-up**            | Ask follow-up questions with full analysis context in a chat UI                             |
| **Session History**           | Every analysis saved to PostgreSQL — browse and compare past sessions                       |
| **JSON / Form Input**         | Input resources via structured form OR paste raw JSON/YAML config                           |
| **Multi-AI Provider**         | Swap between Claude, Gemini Flash, Groq (Llama 3.1), or local Ollama                        |

---

## 🔧 Tech Stack

### Frontend

| Technology      | Purpose                              |
| --------------- | ------------------------------------ |
| React 18 + Vite | UI framework + dev server            |
| TailwindCSS     | Utility-first styling                |
| Recharts        | Cost breakdown + before/after charts |
| Lucide React    | Icon library                         |
| Axios           | HTTP client → FastAPI                |
| React Router v6 | Client-side routing                  |

### Backend

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| FastAPI            | Async REST API framework    |
| Anthropic SDK      | Claude AI integration       |
| SQLAlchemy (async) | ORM with asyncpg driver     |
| Alembic            | Database migrations         |
| Pydantic v2        | Request/response validation |
| uvicorn            | ASGI server                 |

### Infrastructure

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| PostgreSQL 15    | Primary database               |
| Docker + Compose | Local 3-container dev stack    |
| nginx            | Serves React SPA in production |
| python:3.11-slim | Backend base image             |
| node:18-alpine   | Frontend build stage           |

---

## 🚀 Quick Start (Docker — Recommended)

### Prerequisites

- Docker Desktop or Docker Engine + Compose plugin
- An AI API key — **Gemini Flash is free**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/shivang-sharma-dev/CloudSage-AI.git
cd CloudSage-AI
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env and add your API key:
# GEMINI_API_KEY=your-key-here   ← free from Google AI Studio
# or
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Start all 3 containers

```bash
docker compose up --build
```

### 4. Run migrations + seed demo data

```bash
# Wait for containers to be healthy, then:
docker exec -it cloudsage-ai-backend-1 alembic upgrade head
docker exec -it cloudsage-ai-backend-1 python3 database/seed.py
```

### 5. Open the app

| Service         | URL                          |
| --------------- | ---------------------------- |
| 🌐 Frontend     | http://localhost:3000        |
| ⚙️ API          | http://localhost:8000        |
| 📖 API Docs     | http://localhost:8000/docs   |
| ❤️ Health Check | http://localhost:8000/health |

---

## 💻 Local Development (Without Docker)

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt -r requirements-dev.txt

# Set environment variables
cp .env.example .env  # Add your API key

# Run migrations (PostgreSQL must be running)
alembic upgrade head

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# → http://localhost:3000
```

---

## 📡 API Reference

### Analysis

| Method | Endpoint                    | Description                                   |
| ------ | --------------------------- | --------------------------------------------- |
| `POST` | `/api/v1/analyze`           | Submit infrastructure config, get AI analysis |
| `GET`  | `/api/v1/analyze/{id}`      | Retrieve a completed analysis by session ID   |
| `POST` | `/api/v1/analyze/{id}/chat` | Send a follow-up question on an analysis      |

### Sessions

| Method   | Endpoint                | Description                                      |
| -------- | ----------------------- | ------------------------------------------------ |
| `GET`    | `/api/v1/sessions`      | List all sessions (paginated: `?page=1&size=20`) |
| `GET`    | `/api/v1/sessions/{id}` | Get full session detail                          |
| `DELETE` | `/api/v1/sessions/{id}` | Delete a session and all related data            |

### Health

| Method | Endpoint       | Description                                       |
| ------ | -------------- | ------------------------------------------------- |
| `GET`  | `/health`      | Returns `{"status":"ok","db":"ok","model":"..."}` |
| `GET`  | `/api/v1/info` | App version, model, and endpoint map              |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "input_type": "form",
    "resources": [
      {
        "type": "ec2",
        "name": "web-server",
        "instance_type": "m5.4xlarge",
        "count": 6,
        "region": "us-east-1",
        "usage_hours": 744
      },
      {
        "type": "rds",
        "name": "prod-postgres",
        "instance_type": "db.r5.2xlarge",
        "storage_gb": 500,
        "multi_az": false
      }
    ]
  }'
```

---

## 🗄️ Database Schema

```sql
analysis_sessions   -- Core session: input config, AI response, cost fields
chat_messages       -- Conversation history per session (user + assistant)
recommendations     -- Denormalized recommendations for fast filtering
```

**Indexes:**

- `idx_sessions_created_at DESC` — fast history pagination
- `idx_chat_messages_session_id` — fast chat load per session
- `idx_recommendations_session_id` — fast rec lookup
- `idx_recommendations_priority` — fast priority filtering

---

## 🤖 AI Provider Configuration

CloudSage AI supports multiple AI backends. Set `AI_PROVIDER` in your `.env`:

| Provider             | `AI_PROVIDER` value | Cost            | Key                                             |
| -------------------- | ------------------- | --------------- | ----------------------------------------------- |
| Google Gemini Flash  | `gemini`            | ✅ Free         | [AI Studio](https://aistudio.google.com/apikey) |
| Groq (Llama 3.1 70B) | `groq`              | ✅ Free tier    | [Groq Console](https://console.groq.com)        |
| Anthropic Claude     | `claude`            | 💳 Paid         | [Anthropic](https://console.anthropic.com)      |
| Local Ollama         | `ollama`            | ✅ Free (local) | `ollama pull llama3.1`                          |

---

## 📁 Project Structure

```
cloudsage-ai/
├── docker-compose.yml          ← Local 3-container dev stack
├── .env.example                ← Environment variable template
│
├── frontend/                   ← React 18 + Vite + TailwindCSS
│   ├── Dockerfile              ← Multi-stage: node build → nginx serve
│   ├── nginx.conf              ← SPA routing + static asset caching
│   └── src/
│       ├── components/         ← analysis/, dashboard/, chat/, layout/, shared/
│       ├── pages/              ← Home, Analyze, History, SessionDetail, Settings
│       ├── context/            ← AnalysisContext (global state)
│       ├── api/                ← Axios client → FastAPI
│       └── utils/              ← Currency + date formatters
│
├── backend/                    ← Python FastAPI
│   ├── Dockerfile              ← python:3.11-slim, non-root user
│   ├── requirements.txt
│   ├── alembic/                ← DB migrations (3 tables)
│   └── app/
│       ├── main.py             ← FastAPI app, CORS, routers
│       ├── config.py           ← Pydantic settings (reads .env)
│       ├── database.py         ← Async SQLAlchemy engine
│       ├── models/             ← ORM: session, message, recommendation
│       ├── schemas/            ← Pydantic v2 request/response models
│       ├── routers/            ← /analyze, /sessions routes
│       ├── services/           ← Claude AI service + business logic
│       └── utils/              ← Prompt builder (system + user prompts)
│
└── database/
    ├── init.sql                ← pgcrypto extension setup
    ├── seed.py                 ← 3 realistic demo sessions
    └── db_utils.py             ← 20+ helper query functions
```

---

## 🧪 Tests

```bash
cd backend
pytest tests/ -v

# Tests cover:
# ✓ Health check endpoint (DB up/down states)
# ✓ Analyze endpoint input validation
# ✓ Claude JSON retry logic (2-attempt retry on malformed JSON)
# ✓ Markdown fence stripping from Claude responses
# ✓ Session 404 handling
# ✓ Paginated sessions list
```

---

## 🔮 Roadmap

- [ ] Terraform modules for AWS ECS + RDS + ALB deployment
- [ ] GitHub Actions CI/CD pipeline (lint → test → build → deploy)
- [ ] PDF export of analysis reports
- [ ] Cost trend charts across multiple sessions
- [ ] AWS Cost Explorer API integration for real spend data
- [ ] Slack / Teams notification webhook when savings threshold exceeded

---

## 👤 Author

**Shivang Sharma**

- GitHub: [@shivang-sharma-dev](https://github.com/shivang-sharma-dev)

---

<div align="center">
  <sub>Built as a portfolio project demonstrating AI integration, async Python, and production-grade React architecture.</sub>
</div>
