# Backend API

Node.js + Express + TypeScript REST API for the social media handler SaaS.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Requires a running MongoDB instance (`MONGODB_URI`) and, for scheduling, Redis (`REDIS_URL`).

## Scripts

- `npm run dev` — start with hot reload (ts-node-dev)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled build
- `npm run typecheck` — type-check without emitting

## Structure

```
src/
  config/       env + database connection
  models/       Mongoose schemas
  middleware/   auth, error handling
  controllers/  request handlers
  routes/       Express routers
  services/     AI service client, external integrations
  utils/        JWT, async handler, ApiError
```
