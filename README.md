# Social Media Handler — Multi-Agent SaaS

AI-driven multi-agent platform that automates social media content creation and publishing (LinkedIn first, then X, Instagram, Facebook, and blogs) based on a user's profile, resume, notes, and uploaded images.

## Monorepo layout

- **`mobile/`** — React Native + Expo (TypeScript) client app. The only user-facing client (no web app).
- **`backend/`** — Node.js + Express (TypeScript) API. Auth, user/social account management, scheduling, billing, publishing.
- **`ai-service/`** — Python + FastAPI. Multi-agent pipeline (profile, vision, ideation, content generation, conversational), OpenAI embeddings, FAISS vector store for RAG.
- **`admin/`** — Next.js (TypeScript) super admin dashboard for operating the platform (users, subscriptions, moderation, agent monitoring).

## Architecture

```
Mobile App (Expo/RN, TS)
      │  REST (HTTPS)
      ▼
Backend API (Node/Express, TS) ── MongoDB
      │  internal REST
      ▼
AI Service (Python/FastAPI) ── FAISS (vectors) + OpenAI (embeddings)

Admin Dashboard (Next.js, TS) ──▶ Backend API
```

See `docs/ARCHITECTURE.md` for the full design and MongoDB schema (added alongside the initial scaffolding).

## Local development

MongoDB and Redis run via Docker Compose; everything else runs natively for fast iteration.

```bash
docker compose up -d          # starts mongo (27017) and redis (6379)
docker compose ps             # check health
docker compose logs -f mongo  # tail logs
docker compose down           # stop (add -v to also wipe volumes/data)
```

Then, in separate terminals:

```bash
cd backend && npm install && cp .env.example .env && npm run dev       # :4000
cd ai-service && python3 -m venv .venv && source .venv/bin/activate \
  && pip install -r requirements.txt && cp .env.example .env \
  && uvicorn app.main:app --reload --port 8000                        # :8000
cd mobile && npm install && npm start                                  # Expo dev server
cd admin && npm install && cp .env.local.example .env.local && npm run dev  # :3000
```

The backend's `.env.example` already points at the Compose defaults (`mongodb://localhost:27017/social-media-handler`, `redis://localhost:6379`) — no changes needed for local dev.

## Getting started

Each workspace has its own README with setup instructions:

- [`backend/README.md`](backend/README.md)
- [`ai-service/README.md`](ai-service/README.md)
- [`mobile/README.md`](mobile/README.md)
- [`admin/README.md`](admin/README.md)
