# Admin Dashboard

Next.js (TypeScript) super admin console — user management, subscription plans, post moderation, agent activity.

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Sign in with an account whose `role` is `admin` (promote a user via the backend's Mongo record, or through the Users page once you have one admin).

## Structure

```
src/
  app/
    page.tsx              root redirect (login vs dashboard)
    login/                 admin sign-in
    (dashboard)/            auth-gated shell (Sidebar)
      dashboard/            overview stats
      users/                 user list, role management
      posts/                 post moderation across all users
      plans/                 subscription plan management
      agent-activity/        recent AI-generated posts
  components/
    ui/                    Button, Card, Badge, Input, Table, StatCard
    layout/                Sidebar
  lib/                     API client, auth, admin resource calls
  store/                   Zustand auth store
  types/                    shared TypeScript types
```
