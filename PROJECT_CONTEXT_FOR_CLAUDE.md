# AI Company Brain — Complete Project Context for Claude

> **Purpose of this file:** Give this document to Claude (or any AI coding assistant) as full project context.  
> **Last analyzed:** July 26, 2026  
> **Owner:** Ahsan Taqweem  
> **Product:** AI Company Brain (enterprise SaaS)

---

## 1. What This Product Is

**AI Company Brain** is an enterprise AI-powered knowledge / operations platform — the “digital brain” of an organization.

**Vision:** Help companies store, organize, search, and retrieve organizational knowledge (docs, projects, code context, meetings, processes) so employees can find trusted information fast, reduce onboarding time, and stop knowledge loss.

**Problem it solves:** Knowledge is scattered across GitHub, Drive, Notion, Jira, Slack, PDFs, wikis, emails, etc.

**Long-term capabilities (planned):**
- Understand company documentation & repos
- Answer technical questions with AI
- Explain source code
- Search across org knowledge
- Role-based enterprise access
- Projects, tasks, teams, meetings, files, reports, audit logs

**Current development reality (important):**
- Frontend UI is **far ahead** of backend integration
- Almost everything on screen uses **static / dummy data**
- **No real API calls** from the React app yet
- **No real authentication** — auth screens are click-through UI only
- Laravel backend exists as a skeleton (Sanctum + Spatie Permission planned) but is **not wired** to the frontend

---

## 2. Monorepo Structure

```
AI Company Brain/
├── frontend/          ← Main active work (React SPA) ✅
├── backend/           ← Laravel 13 skeleton (PHP 8.3) — early stage
├── docs/              ← Product / architecture documentation
├── CHANGELOG.md
└── README.md          ← Currently empty
```

---

## 3. Technology Stack

### Frontend (primary)
| Tech | Version / notes |
|------|-----------------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 (`@theme` in `index.css` + legacy `tailwind.config.js`) |
| Framer Motion | Animations, drawers, modals |
| Lucide React | Icons |
| React Router DOM | 7 — client routing |
| React Hook Form | Auth forms |
| Recharts | Dashboard charts |
| Fuse.js | Command palette fuzzy search (client-side, static index) |

### Backend (planned / skeleton)
| Tech | Notes |
|------|-------|
| Laravel | ^13.8 |
| PHP | ^8.3 |
| Laravel Sanctum | Auth tokens |
| Spatie Laravel Permission | Roles & permissions |

### Design inspiration
Linear · Notion · Stripe · Slack · Vercel · ClickUp · GitHub · VS Code (command palette)

---

## 4. How to Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Other scripts:
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — ESLint

Default Vite app. Open the local URL Vite prints (usually `http://localhost:5173`).

---

## 5. Routes (React Router)

Defined in `frontend/src/App.jsx`:

| Path | Screen | Layout |
|------|--------|--------|
| `/` | Redirect → `/dashboard` | — |
| `/auth` | Login | `AuthLayout` (`variant="login"`) |
| `/auth/forgot-password` | Forgot Password | `AuthLayout` (`variant="forgot"`) |
| `/auth/verify-otp` | OTP Verification | `AuthLayout` (`variant="otp"`) |
| `/auth/reset-password` | Reset Password | `AuthLayout` (`variant="reset"`) |
| `/auth/password-updated` | Password Updated success | `AuthLayout` (`variant="password-updated"`) |
| `/dashboard` | Dashboard Home | `DashboardLayout` |
| `/dashboard/notifications` | Notifications full page | `DashboardLayout` |
| `*` | Redirect → `/dashboard` | — |

**Auth flow (UI only, static click-through):**  
Login → Forgot Password → OTP → Reset Password → Password Updated → “Go to Home” → Dashboard

There is **no auth guard**. Dashboard is publicly reachable in the SPA.

---

## 6. Design System (MUST MATCH)

When building or polishing UI, **exactly match** this language. Do not invent a new look.

### Colors (Tailwind tokens in `frontend/src/index.css` `@theme`)
| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#2563EB` | Buttons, links, focus, accents |
| `background` | `#F8FAFC` | Page background |
| `surface` | `#FFFFFF` | Cards |
| `border` | `#E5E7EB` | Borders |
| `heading` | `#111827` | Titles |
| `secondaryText` | `#6B7280` | Subtitles / muted |
| `success` | `#10B981` | Online / success |
| `warning` | `#F59E0B` | Warnings |
| `error` | `#EF4444` | Danger / logout |

### Typography
- Font: **Inter** (Google Fonts via `index.css`)
- Headings: semibold, tight tracking
- Body: medium labels, small descriptions

### Visual principles used across the app
- Soft **glassmorphism** (`bg-white/90`, `backdrop-blur-2xl`)
- Premium layered **shadows** (not heavy Material shadows)
- Subtle **gradients** (blue-tinted, never purple-on-white cliché)
- Rounded corners: ~14–24px depending on component
- Micro-interactions with Framer Motion (fade, scale, spring, hover lift)
- Soft borders `border-border/40`–`/60`
- Custom scrollbars: `.dashboard-scrollbar`, `.palette-scrollbar`

### Anti-patterns to avoid
- Purple-to-indigo default AI themes
- Cream + terracotta “serif brochure” look
- Overuse of cards in heroes
- Flat single-color backgrounds without atmosphere
- Emoji as primary UI icons (Lucide only)

---

## 7. Frontend Architecture

```
frontend/src/
├── main.jsx                 # React entry
├── App.jsx                  # Routes
├── index.css                # Tailwind v4 theme + global styles
├── layouts/
│   └── AuthLayout.jsx       # Split auth layouts (variants)
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── OtpVerification.jsx
│   │   ├── ResetPassword.jsx
│   │   └── PasswordUpdated.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       └── Notifications.jsx
└── components/
    ├── ui/                  # Shared primitives
    ├── auth/                # Auth-specific UI / illustrations
    ├── layout/              # Shell: Sidebar, TopNavbar, DashboardLayout
    ├── dashboard/           # Dashboard widgets
    ├── notifications/       # Drawer + cards + data
    ├── profile/             # Avatar dropdown
    └── search/              # Command palette (⌘K)
```

### Shell composition
`DashboardLayout` owns:
- Sidebar (desktop fixed / mobile drawer)
- TopNavbar
- NotificationDrawer state
- CommandPalette state + global `Ctrl/⌘ + K` listener
- Page `children`

---

## 8. Features Already Built (UI)

### A. Authentication Screens
Premium split layouts with illustrations (`AuthLayout` variants).

| Screen | Notes |
|--------|-------|
| Login | React Hook Form, remember me, links to forgot password |
| Forgot Password | Email form → navigates to OTP |
| OTP | `OtpInput`, timer/resend UI (static) |
| Reset Password | `PasswordStrength` meter (static) |
| Password Updated | `SuccessCard`, CTA to dashboard |

Reusable: `Button`, `Input`, `Card`, `Checkbox`, `Logo`, hero illustrations.

### B. Dashboard Home (`/dashboard`)
Enterprise overview with static widgets:
- Welcome / header section
- Stat cards
- Charts (`ChartCard` + Recharts)
- Progress cards
- Recent tasks
- Upcoming meetings
- Quick actions
- Activity timeline
- Online members / deadlines (static)
- Empty state component available

### C. Layout Shell
- **Sidebar:** Nav items (many are placeholder `#` routes); real routes: Dashboard, Notifications
- **TopNavbar:** Search trigger, notifications bell, messages, theme icon (UI), Quick Add, profile avatar
- Tagline on logo: “Smart. Organized. Productive.”

### D. Notifications
- **Drawer** (right slide-in) opened from navbar bell
- Tabs, search, cards, empty state
- Full page at `/dashboard/notifications`
- Data: `notificationData.js` (dummy)

### E. User Profile Dropdown
Opened from navbar avatar.

Components under `components/profile/`:
- `ProfileDropdown.jsx` — desktop popover / mobile bottom sheet
- `ProfileCard.jsx` — Ahsan Taqweem, Super Administrator, online status, quick stats
- `ProfileMenuItem.jsx`
- `ThemeSwitcher.jsx` — Light / Dark / System (**UI only**, no real theme engine)
- `StorageCard.jsx` — 7.2 GB / 10 GB animated bar

Behavior: ESC, click outside, focus states, Framer Motion animations.

Static user:
- Name: **Ahsan Taqweem**
- Role: **Super Administrator**
- Email: **ahsan@example.com**
- Initials: **AT**

### F. Global Search / Command Palette
Inspired by Linear / Notion / GitHub / VS Code.

Open via:
- `Ctrl + K` or `⌘ + K`
- Clicking navbar search field

Components under `components/search/`:
- `CommandPalette.jsx` — modal, keyboard nav, focus trap
- `SearchInput.jsx`
- `QuickActionCard.jsx`
- `SearchCategory.jsx`
- `SearchResultCard.jsx`
- `RecentSearches.jsx`
- `EmptySearch.jsx`
- `KeyboardHelper.jsx`
- `searchData.js` — dummy catalog + Fuse.js index

Keyboard: ↑↓ navigate, Enter open, Esc close, Tab jump.

Desktop: ~720px centered modal, max-height 650px.  
Mobile: full-screen modal.  
Backdrop: blurred. Glass panel.

Fuse.js is **prepared and used for client-side filtering** of static results — not a backend search.

---

## 9. Component Inventory (Quick Reference)

### `components/ui/`
`Button.jsx` · `Input.jsx` · `Card.jsx` · `Checkbox.jsx` · `Logo.jsx`

### `components/layout/`
`DashboardLayout.jsx` · `Sidebar.jsx` · `TopNavbar.jsx`

### `components/dashboard/`
`DashboardPanel.jsx` · `StatCard.jsx` · `ChartCard.jsx` · `ProgressCard.jsx` · `RecentTasks.jsx` · `UpcomingMeetings.jsx` · `QuickActions.jsx` · `ActivityTimeline.jsx` · `EmptyState.jsx`

### `components/notifications/`
`NotificationDrawer.jsx` · `NotificationCard.jsx` · `NotificationTabs.jsx` · `NotificationSearch.jsx` · `EmptyNotifications.jsx` · `notificationData.js`

### `components/profile/`
`ProfileDropdown.jsx` · `ProfileCard.jsx` · `ProfileMenuItem.jsx` · `ThemeSwitcher.jsx` · `StorageCard.jsx`

### `components/search/`
`CommandPalette.jsx` · `SearchInput.jsx` · `QuickActionCard.jsx` · `SearchCategory.jsx` · `SearchResultCard.jsx` · `RecentSearches.jsx` · `EmptySearch.jsx` · `KeyboardHelper.jsx` · `searchData.js`

### `components/auth/`
Illustrations + `OtpInput.jsx` · `PasswordStrength.jsx` · `SuccessCard.jsx`

---

## 10. Sidebar Navigation Map

| Label | Target | Status |
|-------|--------|--------|
| Dashboard | `/dashboard` | Live |
| Organizations | `#organizations` | Placeholder |
| Users | `#users` | Placeholder |
| Departments | `#departments` | Placeholder |
| Projects | `#projects` | Placeholder |
| Tasks | `#tasks` | Placeholder |
| Teams | `#teams` | Placeholder |
| Meetings | `#meetings` | Placeholder |
| Time Tracking | `#time-tracking` | Placeholder |
| Files | `#files` | Placeholder |
| Notifications | `/dashboard/notifications` | Live |
| Reports | `#reports` | Placeholder |
| Audit Logs | `#audit-logs` | Placeholder |
| Settings | `#settings` | Placeholder |
| Profile | `#profile` | Placeholder (dropdown exists instead) |

---

## 11. Documentation Set (`docs/`)

These are product planning docs (many still outline / draft). Use them for product intent; use **this file + frontend code** for what is actually built.

| Doc | Path |
|-----|------|
| Daily Log | `docs/00_Project_Journal/Daily_Log.md` |
| Vision | `docs/01_Project_Foundation/Project_Vision.md` |
| BRD | `docs/02_Business_Requirements/Business_Requirements_Document.md` |
| SRS | `docs/03_Software_Requirements/Software_Requirements_Specification.md` |
| User Stories | `docs/04_User_Stories/User_Stories_Document.md` |
| Architecture | `docs/05_System_Architecture/System_Architecture_Document.md` |
| Database | `docs/06_Database/ Database_Design_Document.md` *(note space in folder name)* |
| API | `docs/07_API/API_Design_Document.md` |
| AI System | `docs/08_AI/AI_System_Design_Document.md` |
| UI/UX | `docs/09_UI_UX/UI_UX_Design_Document.md` |
| Deployment | `docs/10_Deployment/ Deployment_Document.md` *(note space)* |
| Testing | `docs/11_Testing/Testing_Document.md` |
| Security | `docs/12_Security/Security_Document.md` |
| Roadmap | `docs/13_Roadmap/Roadmap_Document.md` |

### Planned user roles (from User Stories)
Super Admin · Organization Owner · Organization Admin · Department Manager · Team Lead · Employee · HR · AI Assistant · Guest

---

## 12. Backend Status

Location: `backend/`

- Standard Laravel app skeleton
- Packages of interest: `laravel/sanctum`, `spatie/laravel-permission`
- **Not integrated** with the React frontend
- No production API contract implemented in the SPA yet
- Frontend must continue assuming **static data** unless explicitly asked to wire APIs

---

## 13. Current Dummy Data Conventions

- User: Ahsan Taqweem / Super Administrator / ahsan@example.com / AT
- Notifications: `notificationData.js`
- Search index: `searchData.js` (projects, users, tasks, meetings, files, reports, etc.)
- Dashboard charts/tasks/meetings: hardcoded in page/components
- Theme switcher & dark mode icon: **visual only**
- Logout button: **no real logout**
- Forms: client validation UI only; no server submit

---

## 14. Coding Conventions for Future Work

1. **Match existing design system** — colors, radius, glass, shadows, Inter, motion style.
2. **Reusable components** — put shared UI in the right folder (`ui/`, `layout/`, feature folders).
3. **No backend / no API** unless the user explicitly asks to integrate.
4. Prefer **static realistic enterprise dummy data**.
5. Accessibility: semantic HTML, keyboard support, ESC/outside close for overlays, focus rings.
6. Responsive: mobile-first; overlays often become full-screen / bottom sheets on small screens.
7. Animations: Framer Motion springs; keep them subtle and premium.
8. Do **not** change layouts when user asks only to “polish / improve UI”.
9. Do **not** create unsolicited markdown docs unless asked.
10. Keep components clean — no drive-by refactors outside the requested area.

---

## 15. What Is NOT Built Yet (Gaps)

Useful for planning next tasks:

- [ ] Real auth (Sanctum / sessions / JWT)
- [ ] Protected routes
- [ ] API client / React Query / fetch layer
- [ ] Organizations, Users, Departments, Projects, Tasks, Teams modules (pages)
- [ ] Meetings, Time Tracking, Files modules
- [ ] Reports & Audit Logs pages
- [ ] Settings & Profile pages (beyond dropdown)
- [ ] Real theme (dark/system) application
- [ ] Real notifications from backend / websockets
- [ ] Real global search API
- [ ] AI chat / knowledge Q&A UI
- [ ] File upload & storage integration
- [ ] Role-based UI permissions
- [ ] Tests (unit/e2e) for frontend
- [ ] CI/CD for frontend
- [ ] Root README content

---

## 16. Roadmap Snapshot (from docs)

- **Phase 1 – Foundation:** Documentation & planning — largely done
- **Later phases:** Auth, core modules, AI features, integrations, hardening

(Exact phase details live in `docs/13_Roadmap/Roadmap_Document.md`.)

---

## 17. Key Files to Read First (for Claude)

If continuing development, read in this order:

1. `frontend/src/App.jsx` — routes
2. `frontend/src/index.css` — design tokens
3. `frontend/src/components/layout/DashboardLayout.jsx` — shell state
4. `frontend/src/components/layout/TopNavbar.jsx` — search / profile / notifications triggers
5. `frontend/src/pages/dashboard/Dashboard.jsx` — home composition
6. Feature folder for the task (`profile/`, `search/`, `notifications/`, `auth/`)
7. Relevant `docs/` file for product intent

---

## 18. Prompt Template (paste into Claude)

You can start a new Claude chat with:

```text
You are working on AI Company Brain — an enterprise SaaS (React 19 + Vite + Tailwind 4 + Framer Motion + Lucide).

Read and follow the project context in PROJECT_CONTEXT_FOR_CLAUDE.md.

Rules:
- Match the existing design system exactly
- Keep components reusable
- Use static dummy data only (no backend) unless I ask
- Prefer polish + production-ready UI inspired by Linear/Notion/Stripe/Vercel
- Do not change layout when I ask only for visual improvements

My task: [DESCRIBE TASK HERE]
```

---

## 19. Summary for Claude (one paragraph)

AI Company Brain is a Fortune-500-style enterprise SaaS frontend currently focused on premium UI: auth screens, dashboard shell, notifications drawer/page, profile dropdown, and a Linear-like command palette. Stack is React 19, Vite, Tailwind 4, Framer Motion, Lucide, Recharts, Fuse.js, React Router, React Hook Form. Data is static. Laravel backend exists but is not connected. Design language is blue-primary (`#2563EB`), Inter, glassmorphism, soft shadows, and subtle motion. Continue building modules and polish without breaking the established visual system.

---

*End of project context document.*
