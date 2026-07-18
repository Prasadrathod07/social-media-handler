# Mobile App

React Native + Expo (TypeScript) client — the only user-facing app (no web dashboard). Styled with NativeWind/Tailwind, routed with `expo-router`.

## Setup

```bash
npm install
npm start
```

Then press `a` for Android or `i` for iOS (simulator/emulator or Expo Go). Update `expo.extra.apiBaseUrl` in `app.json` to point at your running backend.

## Structure

```
app/                    expo-router routes
  index.tsx              entry redirect (auth/onboarding/app)
  (auth)/                login, signup
  (onboarding)/           welcome, profile-setup, connect-accounts, schedule-setup
  (app)/                  tab navigator: home, topics, chat, schedule, profile
  post/[id].tsx           post review/approval modal
src/
  theme/                 design tokens (brand palette, platform colors)
  components/            Button, Card, Input, Badge, Avatar, PlatformIcon, ScreenContainer, Text
  api/                    typed REST client + per-resource calls to the backend
  store/                  Zustand stores (auth, onboarding draft)
  types/                  shared TypeScript types
```

## Notes

- Dark mode follows the OS setting via NativeWind's `dark:` variant.
- Auth tokens are stored in `expo-secure-store`; the API client auto-refreshes on 401.
- LinkedIn OAuth in `connect-accounts.tsx` is a placeholder — swap in the real authorize URL once LinkedIn app credentials exist.
