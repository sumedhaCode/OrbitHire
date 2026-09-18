# OrbitHire

Campus placement operating system: students apply to roles, recruiters run a hiring pipeline, and the training & placement officer watches funnel and CTC analytics.

Built as a **resume project** for product / full-stack roles at large product companies. It is not a CRUD tutorial app — eligibility is enforced in MongoDB, pipeline transitions are validated, and dashboards are aggregation queries.

## What you can demo in an interview

1. Sign in as **student@orbithire.dev** / `Campus@2026`, open a role, submit an application (CGPA and branch are checked).
2. Sign in as **recruiter@orbithire.dev** (same password), open **Pipeline**, shortlist someone, schedule an interview, release an offer.
3. Sign in as **tpo@orbithire.dev**, open **Analytics** — funnel, placement rate, average offered CTC, students by branch.

Other recruiters: `cloud@orbithire.dev` (Vertex Cloud), `labs@orbithire.dev` (Northstar Labs).

## Stack

- Next.js App Router (TypeScript)
- MongoDB via Mongoose (indexes, unique compound application key, aggregations)
- Server Actions for mutations
- Role-based sessions (HMAC-signed httpOnly cookie)
- Tailwind CSS + shadcn/ui

If `MONGODB_URI` is unset, the app starts an **in-memory MongoDB** so a recruiter can `npm run dev` without Atlas. For a real database:

```bash
docker compose up -d
# then set MONGODB_URI=mongodb://127.0.0.1:27017/orbithire in .env.local
```

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

## Resume bullets you can actually defend

- Designed a role-based campus recruitment workflow (student / recruiter / TPO) with signed sessions and server-side authorization on every mutation.
- Modeled jobs and applications in MongoDB with a unique `(jobId, studentId)` index, eligibility checks (CGPA, branch, deadline), and an append-only status timeline.
- Built a constrained hiring pipeline (applied → shortlisted → interview → offer → placed) so illegal stage jumps fail on the server, not only in the UI.
- Exposed placement-cell analytics from MongoDB aggregations (funnel counts, average offered CTC, headcount by branch).

## Project layout

```
src/app/(app)     authenticated workspace
src/app/actions   server mutations
src/lib/models.ts User, Job, Application
src/lib/data.ts   queries + aggregations
src/lib/seed.ts   realistic demo season
```
