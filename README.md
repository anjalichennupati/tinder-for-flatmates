# FlatMate 🏠

A Tinder-style app for finding flatmates in Bangalore. Register, build a profile,
and swipe through potential flatmates filtered by budget and area.

> **Status:** frontend prototype. All data is stored in the browser (`localStorage`) —
> there is no backend or real SMS yet. See [Roadmap](#roadmap).

## Features

- **Register** with mobile number + email and a **mock OTP** (`123456` in demo mode).
- **Profile setup** — 2 photos, age, gender, areas, budget, number of flatmates,
  an introvert↔extrovert slider, and personality traits.
- **Discover / swipe** — a card deck hard-filtered so you only see people whose
  **budget and area overlap** yours. Swipe (drag or buttons) on the softer preferences.
- **Filters** — further narrow the deck by gender, budget range, and area.
- **Matches & chat** — mutual likes become matches you can message (with demo replies).

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for swipe animations
- `localStorage` for persistence; seeded demo profiles use locally-generated SVG avatars

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Project structure

```
src/
  types.ts                 # shared types + constants (areas, traits)
  store.ts                 # localStorage persistence (user, swipes, matches, chats)
  seed.ts                  # demo Bangalore profiles
  lib/filtering.ts         # budget/area eligibility + discovery filters
  components/
    OnboardingRegister.tsx # mobile + email + mock OTP
    ProfileSetup.tsx       # profile form
    SwipeDeck.tsx / SwipeCard.tsx
    FilterSheet.tsx        # gender / budget / area filters
    Matches.tsx / Chat.tsx / MatchPopup.tsx / NavBar.tsx
```

## Roadmap

To make this production-ready you'd add a backend and a real database:

- **Database**: PostgreSQL (users, profiles, swipes, matches, messages).
- **Photos**: store files in object storage (S3 / Cloudflare R2 / Supabase Storage)
  and keep only the URL in Postgres — not the image bytes.
- **Auth**: real phone OTP (e.g. via Supabase Auth or an SMS provider).

Swapping `store.ts` to call a real API is the main integration point.
