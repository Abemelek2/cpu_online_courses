# Course Platform (course_site1)

A full-stack course platform built with Next.js (App Router), Prisma, PostgreSQL, Supabase, and NextAuth. It provides course creation and management, lessons with video playback, student enrollment and progress tracking, review system, and an admin UI. The project is implemented in TypeScript and uses Tailwind/Radix UI primitives and numerous utility libraries for forms, validation, and animations.

---

## Table of contents

- Project overview
- Features
- Tech stack & key dependencies
- Project layout (important files & folders)
- Data model (Prisma) — detailed
- Authentication & authorization
- API & App routes (summary)
- Environment variables
- Local setup & development
- Database setup, migrations & seeding
- Scripts
- Deployment notes
- Troubleshooting & common issues
- Suggested next steps / improvements

---

## Project overview

This repository implements a course marketplace / learning platform. Authors (ADMIN or instructor accounts) can create courses composed of sections and lessons. Students can browse the catalog, enroll in courses, play lesson videos, track their progress, and leave reviews. The project uses a modern stack and patterns:

- Next.js (App Router) for pages & API routes
- Prisma as ORM for the PostgreSQL schema
- Supabase for storage and additional server-side operations
- NextAuth (credentials provider) for authentication
- Server- and client-side components (React, TypeScript)

The UI glue is implemented with Radix primitives and Tailwind-based UI components found in `components/ui`.

## Features

- Course CRUD (admin area)
- Sections & lessons with video playback and optional free preview
- Enrollment / purchase flow scaffold (enrollment table exists)
- Lesson progress tracking (position/time + completed flag)
- Reviews with moderation state
- Tagging system for courses
- Authentication (email/password via credentials provider)
- Supabase client & service-role client configured for storage/admin tasks
- Prisma schema + seed script to populate initial data

## Tech stack & key dependencies

- Next.js 15 (App Router)
- React 19
- TypeScript
- Prisma + @prisma/client (v6.x)
- PostgreSQL (datasource)
- Supabase JS (v2.x)
- next-auth (v5 beta credentials provider)
- bcryptjs for password hashing
- react-hook-form + zod for validations
- @tanstack/react-query for client state
- Tailwind CSS + Radix UI primitives
- Framer Motion, Lucide icons, Sonner for toasts

Refer to `package.json` for exact versions used in this project.

## Project layout (high-level)

- `app/` — Next.js App Router pages and layouts. Notable groups:
  - `app/(admin)/admin/` — admin dashboard and course management pages
  - `app/(app)/learn/[courseSlug]/[lessonSlug]/` — learning/player pages
  - `app/(marketing)/` — marketing pages and public catalog
  - `app/courses/[slug]/` — course detail page
  - `app/my-learning/` — student learning dashboard
- `app/api/` — server API route implementations (REST-style handlers)
- `components/` — shared UI and domain components (player, forms, admin builder, navigation)
- `components/ui/` — design-system primitives (button, input, card, etc.)
- `lib/` — server-side helpers and clients (Prisma, Supabase, auth)
- `prisma/` — Prisma schema, seed and SQL migrations
- `public/` — static assets

## Data model (Prisma) — detailed

The Prisma schema (see `prisma/schema.prisma`) defines the core models. Below is a concise summary of each model, key fields and relations.

- User
  - id: String (cuid), email (unique), password (hashed), role: enum (ADMIN | STUDENT)
  - relations: createdCourses (Course, Course.createdBy), enrollments (Enrollment), progress (Progress), reviews (Review)

- Course
  - id: String, slug (unique), title, subtitle, description, priceCents, status: enum (DRAFT | PUBLISHED)
  - createdById -> User (relation name: CourseCreator)
  - relations: sections (Section[]), enrollments (Enrollment[]), reviews (Review[]), courseTags (CourseTag[])

- Section
  - id, title, order, courseId -> Course
  - relations: lessons (Lesson[])

- Lesson
  - id, title, slug (unique per section), order, videoUrl, durationSec, freePreview: boolean
  - sectionId -> Section
  - relations: progress (Progress[])

- Enrollment
  - id, userId, courseId, createdAt
  - unique(userId, courseId)
  - relations: user, course

- Progress
  - id, userId, lessonId, completed: boolean, positionSec: Int, updatedAt
  - unique(userId, lessonId)
  - relations: user, lesson

- Review
  - id, userId, courseId, rating (Int), comment, status: enum (VISIBLE | HIDDEN), timestamps
  - unique(userId, courseId)

- Tag & CourseTag
  - Tag has unique name, CourseTag is join table (unique per courseId+tagId)

Enums: Role (ADMIN/STUDENT), CourseStatus (DRAFT/PUBLISHED), ReviewStatus (VISIBLE/HIDDEN)

This relational structure supports:
- multiple sections per course
- multiple lessons per section
- per-lesson progress per-user
- per-user per-course enrollments and reviews

## Authentication & authorization

- Authentication uses NextAuth Credentials provider (see `lib/auth.ts`):
  - Users authenticate with email and password.
  - Passwords are checked with `bcrypt.compare` against the stored `user.password` hash.
  - Session strategy: JWT. The `role` is included in the token and added to `session.user`.
  - Custom sign-in page: `/auth/signin`.

- Authorization notes:
  - User roles are stored in the `User.role` enum. Code paths (server handlers and UI) should check `session.user.role` to gate admin features.

## Supabase

- `lib/supabase.ts` exports two clients:
  - `supabase` — client-side / public anon client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `supabaseAdmin` — server-side client using `SUPABASE_SERVICE_ROLE_KEY` for admin tasks (e.g., signed url management, server uploads).

Use `supabaseAdmin` only in server contexts and keep the service-role key secret.

## API & App routes (summary)

Key API routes found under `app/api/` (server route files):

- `app/api/courses/route.ts` — public courses endpoints (listing, creation may differ)
- `app/api/courses/[slug]/route.ts` — fetch a single course by slug
- `app/api/courses/[slug]/sections/route.ts` — sections listing/management
- `app/api/courses/[slug]/sections/[sectionId]/lessons/route.ts` — lesson-level routes
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `app/api/enroll/route.ts` — enrollments endpoint
- `app/api/my-courses/route.ts` — current user's courses
- `app/api/progress/route.ts` — progress update/reading endpoints
- `app/api/reviews/route.ts` — reviews creation/moderation
- `app/api/upload/route.ts` — upload endpoints (likely backed by Supabase)
- `app/api/admin/courses/*` — admin-only course stats or management endpoints

On the App (page) side, important routes include:

- `app/courses/[slug]/` — course detail + curriculum
- `app/(app)/learn/[courseSlug]/[lessonSlug]/` — player + progress updates
- `app/(admin)/admin/courses/` — admin course list / builder
- `app/my-learning/` — user's enrolled courses and progress

Refer to the `app/` folder for the exact route tree; this project uses the Next.js App Router conventions.

## Environment variables

Create a `.env.local` at the project root with the following (example):

```bash
# PostgreSQL / Prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL="https://xyzcompany.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"

# Supabase (server / service role) - keep secret
SUPABASE_SERVICE_ROLE_KEY="service-role-key"

# NextAuth recommended secret (production)
NEXTAUTH_SECRET="a-long-random-string"

# Optional: set NODE_ENV=development or production as appropriate
```

Notes:
- The code expects `NEXT_PUBLIC_SUPABASE_*` variables to initialize the public client.
- `SUPABASE_SERVICE_ROLE_KEY` is used by the server-side admin client in `lib/supabase.ts`.
- Prisma reads `DATABASE_URL` and `DIRECT_URL` from the environment as configured in `prisma/schema.prisma`.

## Local setup & development

1. Install dependencies

```bash
npm install
```

2. Configure `.env.local` with the variables shown above.

3. Database & Prisma

- If you are starting from scratch and want to push the schema to your PostgreSQL database and seed sample data:

```bash
# push the Prisma schema and run seed
npm run db:reset
```

This project defines the `db:reset` script in `package.json` as:

```json
"db:reset": "npx prisma db push --force-reset && npm run db:seed"
```

- To only run the seed script (seed file is `prisma/seed.ts`):

```bash
npm run db:seed
```

Note: `prisma/migrations/` exists and contains SQL; depending on your workflow you may prefer `npx prisma migrate dev` or `npx prisma migrate deploy` in production. `db push` is faster for development but does not create migration history.

4. Start the dev server

```bash
npm run dev
```

The app will run with the Next.js dev server (default: http://localhost:3000).

## Scripts (from package.json)

- `npm run dev` — Next.js development server
- `npm run build` — build for production
- `npm run start` — start production build
- `npm run db:seed` — run `tsx prisma/seed.ts` (seed script)
- `npm run db:reset` — push schema to DB (force reset) and run seed

## Prisma client & helpers

- `lib/prisma.ts` exports a singleton Prisma client. In development it reuses a global to avoid exhausting connections.

## Running and debugging authentication

- Credentials provider is configured in `lib/auth.ts`. It reads the `User` record from Prisma and validates passwords using `bcryptjs`.
- If users are empty after seed, create a user via the `prisma/seed.ts` or directly in the DB with a bcrypt-hashed password.

## Deployment notes

- Recommended platform: Vercel (Next.js first-class) or any provider supporting Node.js and environment variables.
- Ensure environment variables are set in your deployment platform (DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_*, SUPABASE_SERVICE_ROLE_KEY, NEXTAUTH_SECRET).
- Use `npx prisma migrate deploy` during production deploys if you maintain migrations. If you use `prisma db push`, the schema will be pushed directly but without migration history.

## Troubleshooting & common issues

- Prisma Client errors (e.g., generated client missing): run `npx prisma generate` or use `npm run db:reset` which triggers the client generation as part of flow.
- Database connection errors: verify `DATABASE_URL` and that the database allows connections from your host (and correct port/credentials).
- NextAuth/JWT issues: verify `NEXTAUTH_SECRET` is set in production. In dev NextAuth may work without a secret, but tokens in production require a strong secret.
- Missing Supabase keys: ensure `NEXT_PUBLIC_SUPABASE_*` are present to initialize the client; `SUPABASE_SERVICE_ROLE_KEY` is required for server admin tasks.

## Suggested next steps / improvements

- Add end-to-end tests (Cypress / Playwright) for flows (signup, enroll, play lesson, complete progress).
- Add CI for linting, type-check, and test runs.
- Add more robust role-based guards in API routes and UI (explicit server-side checks for `session.user.role`).
- Add Sentry or other error-tracking integrations.
- Improve payment/enrollment flow (Stripe integration) if paid courses are needed.
- Use CDN + secure video hosting for large lesson video files; integrate signed URLs via Supabase or cloud storage.

---

If you'd like, I can also:

- generate a `.env.example` file with placeholders for every required environment variable,
- add a short CONTRIBUTING.md and PR checklist,
- or scaffold deployment instructions for Vercel / Docker specifically.

If you want any of that, tell me which and I'll add it to the repository.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
