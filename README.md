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

## Getting started

Each workspace has its own README with setup instructions:

- [`backend/README.md`](backend/README.md)
- [`ai-service/README.md`](ai-service/README.md)
- [`mobile/README.md`](mobile/README.md)
- [`admin/README.md`](admin/README.md)
