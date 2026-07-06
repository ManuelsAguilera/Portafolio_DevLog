# Customizing ManuDevLog — For Developers

This guide explains how to fork and adapt this project for your own devlog portfolio.

---

## 1. Quick Start

```bash
git clone <your-fork>
npm install
npm run dev
```

---

## 2. Firebase Setup

The app uses Firebase for auth, database (Firestore), and optional push notifications.

### 2.1 Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Cloud Firestore** → Choose a location → Start in **production mode**

### 2.2 Configure environment

Copy your Firebase web app config to `.env.local` (create it if missing):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_VAPID_KEY=...

FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

- `NEXT_PUBLIC_*` values are from Firebase Console → Project Settings → General → Your apps → Web app
- `NEXT_PUBLIC_VAPID_KEY` is from Console → Cloud Messaging → Web configuration (optional, for push notifications)
- `FIREBASE_SERVICE_ACCOUNT_KEY` is the full JSON from Console → Service accounts → Generate key (used by seed script and admin SDK)

### 2.3 Deploy Firestore rules

```bash
npx firebase login
npx firebase use <your-project-id>
npx firebase deploy --only firestore:rules
```

### 2.4 Create admin user

1. Firebase Console → Authentication → Users → Add user (your email, set a password)
2. Note the UID of the created user
3. Set the admin custom claim:

```bash
npx tsx scripts/set-admin-claim.ts your@email.com
```

---

## 3. Colors & Design

### CSS Variables (in `app/globals.css`)

Most colors are defined as CSS custom properties under `:root`:

| Variable | Default | Usage |
|----------|---------|-------|
| `--background` | `#FAFAF7` | Page background |
| `--foreground` | `#3452C9` | Main text color |
| `--primary` | `#34C94E` | Buttons, links, interactive elements |
| `--accent` | `#C9A334` | Secondary accent (admin header border, tags) |
| `--destructive` | `#C93453` | Delete buttons, errors |
| `--border` | `#D4D4CC` | Borders, dividers |
| `--muted-foreground` | `#45744D` | Secondary text, meta info |

### Inline hex values

Many components use Tailwind inline colors like `text-[#3452C9]`, `bg-[#FAFAF7]`, `border-[#D4D4CC]`.

To change the palette globally, search and replace these hex values across the entire `app/` and `components/` directories:

| Hex | Tailwind class pattern | Purpose |
|-----|----------------------|---------|
| `#FAFAF7` | `bg-[#FAFAF7]` | Page and section backgrounds |
| `#3452C9` | `text-[#3452C9]` | Main text, headings |
| `#F5F5F0` | `bg-[#F5F5F0]` | Card backgrounds |
| `#34C94E` | `text-[#34C94E]`, `bg-[#34C94E]`, `border-[#34C94E]`, `hover:bg-[#34C94E]` | Primary actions |
| `#C9A334` | `text-[#C9A334]`, `border-[#C9A334]` | Accent elements |
| `#C93453` | `text-[#C93453]`, `border-[#C93453]` | Destructive actions |
| `#D4D4CC` | `border-[#D4D4CC]`, `text-[#D4D4CC]` | Borders, placeholders |
| `#45744D` | `text-[#45744D]`, `shadow-[...*#45744D]` | Muted text, sketchy shadows |
| `#EDEEE8` | `bg-[#EDEEE8]` | Muted backgrounds, image placeholders |
| `#2ab342` | `hover:bg-[#2ab342]` | Primary hover state |

### Sketchy shadows

The portafolio uses custom box-shadows for a "sketchy" aesthetic:

- Default: `2px 3px 0px #45744D` (constant `sketchyShadow` in `lib/data.ts`)
- Hover: `3px 4px 0px #45744D` (constant `sketchyShadowHover` in `lib/data.ts`)

References use `shadow-[2px_3px_0px_#45744D]` inline. Search‑replace `#45744D` in shadow values if you change the shadow color.

### Border radius

All elements use `3px` radius, defined as `--radius: 3px` in `globals.css`. Applied via inline `style={{ borderRadius: "3px" }}` in components.

---

## 4. Fonts

Fonts are loaded in `app/layout.tsx` via `next/font/google`:

| Variable | Font | Weights |
|----------|------|---------|
| `--font-display` | Playfair Display | 400, 600, 700 |
| `--font-body` | DM Sans | 300, 400, 500 |
| `--font-mono` | JetBrains Mono | 400, 500 |

To change:
1. Import your font from `next/font/google` (or `next/font/local`)
2. Replace the variable names in `layout.tsx`
3. Use the same CSS variable names (`--font-display`, etc.) throughout components — or do a search-replace if you rename them

---

## 5. Social Links

Edit the array in `app/page.tsx` (lines 125–129):

```tsx
{ icon: <SiGithub size={14} />, label: "GitHub", href: "https://github.com/your-username", color: "#3452C9" },
{ icon: <SiYoutube size={12} />, label: "YouTube", href: "https://youtube.com/@your-channel", color: "#C93453" },
{ icon: <FaLinkedin size={12} />, label: "LinkedIn", href: "https://linkedin.com/in/your-profile", color: "#3452C9" },
{ icon: <Mail size={12} />, label: "Email", href: "mailto:your@email.com", color: "#C9A334" },
```

- Icons come from `react-icons/si` (Simple Icons) and `lucide-react`
- `color` controls the border and text color of each bubble
- Add or remove entries as needed

---

## 6. Content Management

### Seed initial data

The `scripts/seed-projects.ts` script populates Firestore with sample projects. Edit the `projects` array in that file with your own content, then run:

```bash
npx tsx scripts/seed-projects.ts
```

### Admin panel

- URL: `/admin`
- Login with the admin email/password you created in step 2.4
- Create, edit, and delete projects (devlogs)
- View suggestions submitted via `/recomendaciones`

### Public pages

- `/` — Home with hero card, YouTube embed, social links
- `/proyectos` — Grid of all projects, filterable by status
- `/proyectos/[slug]` — Project detail with expandable blog entries
- `/recomendaciones` — Contact/suggestion form (saved to Firestore)

---

## 7. Personal Info

Edit these files to replace my name and details with yours:

| File | What to change |
|------|---------------|
| `app/layout.tsx` | `metadata.title`, `metadata.description` |
| `app/page.tsx` | Hero section text (lines 40–54) |
| `app/page.tsx` | YouTube embed URL (line 91) |
| `app/admin/login/page.tsx` | Brand initials "MA" (line 42) |

---

## 8. Icon on browser tab

Replace `public/favicon.ico` and `public/opengraph-image.png` with your own assets.

---

## 9. Deployment

### Vercel (recommended)

1. Push your fork to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local` (including `FIREBASE_SERVICE_ACCOUNT_KEY`)
4. Deploy — Vercel auto-detects Next.js

### Build locally

```bash
npm run build
npm run start
```

---

## 10. Project Structure

```
app/                  # Next.js App Router pages
  admin/              # Admin panel routes (login, devlogs CRUD, suggestions)
  proyectos/          # Public project list and detail pages
  page.tsx            # Home page
  layout.tsx          # Root layout (fonts, metadata)
  globals.css         # CSS variables and base styles
components/           # React components
  admin/              # Admin-specific components
  PublicLayout.tsx    # Public layout wrapper (header + footer)
lib/                  # Shared utilities
  firebase/           # Firebase client + admin SDK init
  types.ts            # Shared TypeScript types
  data.ts             # Helper constants (status labels, colors)
scripts/              # Utility scripts
  seed-projects.ts    # Seed Firestore with initial project data
  set-admin-claim.ts  # Set admin custom claim on a Firebase Auth user
functions/            # Firebase Cloud Functions (optional)
docs/                 # Documentation
```

---

## 11. Removing existing content

The Firestore database currently has my projects and suggestions. To start fresh:

```bash
# Clear the projects collection (via Firebase Console or Admin SDK)
# Then re-seed with your own data
npx tsx scripts/seed-projects.ts
```

The static data file `lib/data.ts` contains only helper constants — no projects data (it was removed in favor of Firestore).
