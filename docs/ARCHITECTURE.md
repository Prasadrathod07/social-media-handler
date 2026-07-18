# Architecture

## System overview

```
Mobile App (React Native + Expo, TypeScript)
      │ REST (HTTPS, JWT auth)
      ▼
Backend API (Node.js + Express, TypeScript)
      │                              │
      │ Mongoose                     │ internal REST
      ▼                              ▼
   MongoDB                    AI Service (Python + FastAPI)
                                      │
                                      ├─ OpenAI Embeddings API
                                      ├─ FAISS vector store (per-user index)
                                      └─ Agent orchestration (LangGraph)

Super Admin Dashboard (Next.js, TypeScript) ──▶ Backend API (admin-scoped routes)
```

## Components

- **`mobile/`** — Expo + TypeScript + `expo-router`. The only client for end users. Handles onboarding, social account linking (OAuth via in-app browser + deep link back), profile/resume/notes/image upload, chat with the AI agent, schedule configuration, topic/post approval, and billing.
- **`backend/`** — Express + TypeScript REST API. Owns auth, user & social account records, scheduling (BullMQ + Redis), billing, and platform publishing. Delegates all generative work to the AI service.
- **`ai-service/`** — FastAPI (Python). Hosts the multi-agent pipeline:
  - **Profile Agent** — parses resume/bio/notes into structured profile + chunks.
  - **Vision Agent** — extracts descriptive info from uploaded images.
  - **Ideation Agent** — proposes post subjects using RAG over the user's FAISS index.
  - **Content Agent(s)** — platform-specific copy generation (LinkedIn, X, Instagram, Facebook, blog).
  - **Image Agent** — generates a matching banner/graphic per post (OpenAI `gpt-image-1`), sized per platform. Returned as base64; the backend decodes and stores it under `backend/uploads/`, serving it back over HTTP and recording the URL on `Post.mediaUrls`. Triggered on demand from the post review screen, not automatically on every post.
  - **Conversational Agent** — chat interface, RAG-grounded.
  - Embeddings: OpenAI (`text-embedding-3-small`). Vector store: FAISS, one index per user, with a MongoDB `knowledgeChunks` collection mapping FAISS vector IDs to source text/metadata.
- **`admin/`** — Next.js + TypeScript super admin dashboard. Operates the whole platform: user management, subscription/plan management, post moderation, connected-account health, agent job monitoring/logs.

## MongoDB schema

### `users`
```
_id, email, passwordHash, name, role: "user" | "admin",
subscription: { planId, cadence: "daily" | "weekly" | "monthly", status, currentPeriodEnd },
onboardingComplete: boolean,
createdAt, updatedAt
```

### `socialAccounts`
```
_id, userId, platform: "linkedin" | "x" | "instagram" | "facebook" | "blog",
accessToken (encrypted), refreshToken (encrypted), tokenExpiresAt,
platformUserId, platformHandle, connectedAt, status: "active" | "expired" | "revoked"
```

### `profiles`
```
_id, userId (unique), resumeText, bio, aboutMe,
tone: string[], focusAreas: string[],
rawUploads: [{ type: "resume" | "note" | "image", fileUrl, uploadedAt }],
updatedAt
```

### `knowledgeChunks`
```
_id, userId, sourceType: "resume" | "bio" | "note" | "image" | "pastPost",
sourceRefId, text, faissVectorId, faissIndexNamespace, createdAt
```

### `topics`
```
_id, userId, subjectText, suggestedBy: "ai" | "user",
status: "pending" | "approved" | "rejected", scheduledFor,
platformTargets: string[], createdAt
```

### `posts`
```
_id, userId, topicId, platform, content, mediaUrls: string[],
status: "draft" | "pendingApproval" | "approved" | "scheduled" | "published" | "failed",
scheduledAt, publishedAt, platformPostId, error, createdAt, updatedAt
```

### `schedules`
```
_id, userId, cadence: "daily" | "weekly" | "monthly",
dayOfWeek, dayOfMonth, time, timezone,
autoPublish: boolean, platforms: string[], active: boolean
```

### `conversations` / `messages`
```
conversations: { _id, userId, createdAt, lastMessageAt }
messages: { _id, conversationId, role: "user" | "agent", text, imageUrls: string[], createdAt }
```

### `subscriptionPlans`
```
_id, name, cadence, price, postsPerCycle, platformsIncluded: string[], features: string[]
```

Indexes: `userId` on all user-scoped collections; `{ status: 1, scheduledAt: 1 }` on `posts` for the scheduler; `{ userId: 1, sourceType: 1 }` on `knowledgeChunks`.

## Open decisions (placeholders in code)

- **Generation LLM** — provider-agnostic interface in `ai-service`; defaults to Claude, swappable.
- **Billing** — provider-agnostic interface in `backend`; Stripe stubbed first, IAP (RevenueCat) to be evaluated for App/Play Store compliance.
