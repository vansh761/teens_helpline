# Teens Helpline

A two-part platform built for teenagers aged 13–19: doubt-solving, career
guidance, peer pressure support, and stress/anxiety guidance — plus a
companion dashboard for booking real counselling and tuition sessions.

This was built as an internship assignment, structured as a monorepo with
one shared FastAPI backend and two independently deployable Next.js
frontends.

## What's in here

```
teens-helpline/
├── backend/             FastAPI API — auth, bookings, AI chat, admin
├── helpline-website/    Public site — chat, articles, guidance topics
└── dashboard/           Booking dashboard — student/counselor/admin
```

| Piece | Purpose | Tech |
|---|---|---|
| **Helpline Website** | Public-facing support site: AI chat for doubts/career/peer pressure/stress, articles, structured guidance topics | Next.js 15, TypeScript, Tailwind |
| **Helpline Dashboard** | Auth-gated booking platform for students, counsellors, and admins | Next.js 15, TypeScript, Tailwind |
| **Backend API** | Shared API powering both frontends | FastAPI, SQLAlchemy, JWT auth, Gemini |

The two frontends are **deliberately separate deployments** (separate
Vercel projects, separate URLs) that link to each other — a student
browsing the public site can jump to the dashboard to book a session, and
vice versa, via the nav bar and footer on both apps.

## Why this architecture

- **One backend, two frontends** — the booking logic, auth, and AI safety
  layer live in exactly one place, so there's a single source of truth and
  no duplicated business logic between the public site and the dashboard.
- **Role-based JWT auth** — a single `User` table with a `role` column
  (`student` / `counselor` / `admin`), enforced via FastAPI dependencies
  (`require_role(...)`) on every protected route, not just hidden in the UI.
- **The public chat requires no login** — a teenager in distress shouldn't
  have to sign up before getting a response. It's tracked by an anonymous,
  client-generated session ID instead.
- **Crisis safety is deterministic, not AI-judged** — a keyword/pattern
  check runs before every AI reply and appends verified Indian crisis
  helpline numbers (Tele-MANAS, KIRAN, AASRA) whenever it fires, regardless
  of what the language model says. Flagged conversations are also visible
  to admins for human follow-up.

## Running locally

You'll need Python 3.11+, Node 18+, and (optionally) a [Gemini API
key](https://aistudio.google.com/apikey) for live chat responses — without
one, the chat endpoint still works but returns a placeholder message.

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # edit GEMINI_API_KEY etc. if you have one
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`. Interactive API docs at `/docs`.

On first run, a default admin account is seeded:
- Email: whatever you set as `DEFAULT_ADMIN_EMAIL` (default `admin@teenshelpline.org`)
- Password: `DEFAULT_ADMIN_PASSWORD` (default `ChangeThisPassword123!`)

**Change this password (or deactivate the account and create a new admin)
immediately after your first real deployment.**

### 2. Helpline website

```bash
cd helpline-website
cp .env.local.example .env.local
npm install
npm run dev -- --port 3000
```

Runs on `http://localhost:3000`.

### 3. Dashboard

```bash
cd dashboard
cp .env.local.example .env.local
npm install
npm run dev -- --port 3001
```

Runs on `http://localhost:3001`.

With all three running, the "Booking dashboard" link on the website and the
"Helpline site" link in the dashboard header will correctly cross-link
between `localhost:3000` and `localhost:3001`.

## Using the dashboard

1. **Students** sign up directly at `/signup` on the dashboard.
2. **Counsellors** cannot self-register — log in as the seeded admin and
   create counsellor accounts under **Counsellors → Add counsellor**.
3. As a counsellor, open availability slots under **Availability**.
4. As a student, browse and book those slots under **Find a session**.
5. The counsellor confirms/completes the booking from their **My bookings**
   view; the admin can see everything under **Overview** and **All
   bookings**.

## Deploying

Both frontends include a `vercel.json` and deploy as standard Next.js apps.
The backend includes a `render.yaml` for Render. After deploying, set:

- On the backend: `DATABASE_URL` (Postgres in production), `JWT_SECRET_KEY`,
  `ALLOWED_ORIGINS` (both frontend URLs), `GEMINI_API_KEY`.
- On the website: `NEXT_PUBLIC_API_URL` (backend URL), `NEXT_PUBLIC_DASHBOARD_URL`.
- On the dashboard: `NEXT_PUBLIC_API_URL` (backend URL), `NEXT_PUBLIC_WEBSITE_URL`.

## Design notes

Both frontends share one design token system (warm paper background, deep
evergreen + amber + dusty-blue accents — no purple, pink, red, or violet
anywhere) and the same hand-drawn compass/signpost logomark, so the two
separately-deployed apps still read as one product.

## Known scope limits (by design, for an assignment timeline)

- Tutoring/counselling "sessions" are time slots, not video calls — no
  video integration is included.
- Email/SMS notifications aren't wired up; booking status changes are
  visible in-app only.
- The crisis-keyword list is a first-pass safety net, not a clinical
  screening tool — it's intentionally narrow rather than guessing at every
  possible phrasing.
