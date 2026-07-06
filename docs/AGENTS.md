# AGENTS.md — Portfolio / Devlog

## Project structure

Next.js 15 App Router (`app/layout.tsx` → `app/page.tsx` etc.). CSS in `app/globals.css`.

## Key facts

- **Package manager:** npm (was pnpm, migrated out).
- **All page components use `"use client"`** — no React Server Components are used.
- **Data lives in Firestore** — public pages (`/proyectos`, `/proyectos/:slug`) and admin pages read from Firestore directly. `lib/data.ts` only has helpers (`statusLabel`, `statusColor`, `sketchyShadow`, etc.) and shared types.
- **Backend:** Firebase (Firestore + Cloud Functions + Auth + FCM) as described in `arquitectura-backend-portafolio.md`. Config in `.env.local`, SDK init in `lib/firebase/`, functions in `functions/src/`.
- **Alias `@/*`** → root (`./*` in tsconfig).
- **Fonts via CSS custom props:** `--font-display` (Playfair Display), `--font-body` (DM Sans), `--font-mono` (JetBrains Mono).
- **Design palette:** bg `#FAFAF7`, text `#3452C9`, primary `#34C94E`, accent `#C9A334`, destructive `#C93453`, border `#D4D4CC`, muted `#45744D`. Radius `3px`. Sketchy `2px 3px 0px` box-shadow offsets.
- **No test/lint scripts in package.json.** Type-check with `npx tsc --noEmit`.
- **`docs/Guidelines.md`** is a template (not filled in).

## Firebase setup

| File | Purpose |
|------|---------|
| `.env.local` | Public Firebase config + VAPID key placeholder |
| `lib/firebase/client.ts` | Browser SDK init (`db`, `auth`, `messaging`) |
| `lib/firebase/admin.ts` | Admin SDK init (`adminDb`, `adminAuth`) — requires `FIREBASE_SERVICE_ACCOUNT_KEY` env |
| `lib/types.ts` | Shared TS types matching Firestore collections (`Project`, `Suggestion`, etc.) |
| `lib/data.ts` | Helpers (`statusLabel`, `statusColor`, `sketchyShadow`) — no static data |
| `firestore.rules` | Security rules (create-only for public, admin custom claim for write access) |
| `firebase.json` | Firebase project config for CLI |
| `functions/src/index.ts` | Cloud Functions: `onNewSuggestion`, `sendPushNotification` |
| `scripts/set-admin-claim.ts` | Sets `{ admin: true }` custom claim on existing Firebase Auth user |
| `scripts/create-admin.ts` | Creates Firebase Auth user + admin in one step (reads local service account key) |
| `scripts/seed-projects.ts` | Seeds Firestore `projects` collection with 9 hardcoded sample projects |
| `public/firebase-messaging-sw.js` | FCM service worker (hardcoded Firebase config — by design for SW context) |

### Deploy steps
```bash
npx firebase login                 # browser OAuth
npx firebase use manudevlog        # set project
npx firebase deploy --only firestore:rules
```

### Admin scripts

```bash
# Set admin custom claim on existing Firebase Auth user
npx tsx scripts/set-admin-claim.ts <admin-email>

# Create Firebase Auth user + admin claim in one step
ADMIN_PASSWORD=<pass> npx tsx scripts/create-admin.ts [email]

# Seed Firestore with 9 sample projects
npx tsx scripts/seed-projects.ts
```

> ⚠️ `scripts/create-admin.ts` requires `ADMIN_PASSWORD` env var or 2nd CLI arg — see Security notes below.

### ⚠️ Before deploying functions
1. Generate service account key: Console → Project Settings → Service accounts → Generate key → save as `FIREBASE_SERVICE_ACCOUNT_KEY`
2. Generate VAPID key: Console → Cloud Messaging → Web configuration
3. Set both as env vars (`.env.local` for VAPID, Vercel dashboard for both)

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Inicio | Hero card, YouTube embed, social bubbles, EmailSubscription, PushSubscription (FCM) |
| `/proyectos` | Proyectos | Grid with Radix Tabs (Pasados/Actuales/Futuros) |
| `/proyectos/:slug` | ProyectoDetalle | Project header + expandable blog entries |
| `/recomendaciones` | Recomendaciones | Contact form → Firestore suggestions collection |
| `/admin/login` | AdminLogin | Firebase Auth email/password |
| `/admin/devlogs` | AdminDevlogs | Devlog list (search, filter by status, bulk delete) |
| `/admin/devlogs/nuevo` | NewDevlog | Create new devlog with editor + preview toggle |
| `/admin/devlogs/:slug` | EditDevlog | Edit existing devlog (reads/writes Firestore) |
| `/admin/suggestions` | AdminSuggestions | Mail-like two-panel viewer with copy-email, mark read |

## Admin Panel (`/admin`)

- **Layout:** `components/PublicLayout.tsx` hides public Header/Footer on admin routes. Admin layout (`app/admin/layout.tsx`) uses `AdminHeader` (brand + user email + logout, accent border) + `AdminSidebar` (nav: Devlogs, Sugerencias).
- **Auth guard:** `components/admin/AuthGuard.tsx` — `onAuthStateChanged` + `getIdTokenResult()` checks `claims.admin === true`. Login at `/admin/login` with Firebase email/password.
- **Devlog CRUD:** Client SDK direct to Firestore `projects` collection. Slug = document ID. Editor has toggle tabs (Editar / Vista previa) via `DevlogForm` + `DevlogPreview`.
- **Sanitization:** `DOMPurify.sanitize()` on `dangerouslySetInnerHTML` in `DevlogPreview` and `SuggestionDetail` (SEGURIDAD-DEVLOG.md compliance).
- **Suggestions viewer:** Two-panel layout (`SuggestionInbox` + `SuggestionDetail`). Bulk copy emails, auto-mark-as-read on select.
- **Security:** All Firestore writes pass through Rules (deployed with `request.auth.token.admin == true`). No API routes needed. Admin claim set via `scripts/set-admin-claim.ts`.

## Build / Dev workflow

- **`npm run dev`** — development server with hot reload (default workflow).
- **`npm run build`** — production build (Node.js output). Only used for local verification.
- **`npm run deploy`** — builds via OpenNext for Cloudflare Workers runtime and deploys.
- **`npm run preview`** — builds and serves locally in the Workers runtime (closer to production than `next dev`).
- **`.next` / `.open-next` cache corruption** — if switching between `build` and `dev`, or if weird compilation errors appear, delete these directories and restart:
  ```powershell
  Remove-Item -Recurse -Force .next, .open-next
  npm run dev
  ```
- **Verification without build artifacts:** use `npx tsc --noEmit` for type-checking without generating `.next/`.
- **Deployment:** Push to `master` — Workers Builds (Cloudflare) runs `npm run deploy` automatically. Env vars must be set in both "Build variables" and "Settings → Variables" in the Cloudflare dashboard.

## Security notes

- **`.next/` and `node_modules/` were previously tracked in git** — removed via `git rm --cached`. If they reappear in status, untrack them.
- **`scripts/create-admin.ts` previously had a hardcoded password** — now fixed to read from `ADMIN_PASSWORD` env var or CLI arg. If you forked before the fix, rotate the exposed password in Firebase Console.
- **`public/firebase-messaging-sw.js` hardcodes Firebase config** — this is standard for FCM service workers (no `process.env` access). Config values are public by Firebase design.
