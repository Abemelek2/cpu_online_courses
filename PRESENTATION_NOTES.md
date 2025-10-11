# Presentation Notes — CPU Online Courses (final year project)

These notes are a ready-to-use guide for presenting your final year project: "CPU Online Courses" (repo: `course_site1`). Use this as your script and checklist. It includes a short elevator pitch, architecture summary, demo script with timings, key technical points, commands to run locally, challenges you solved, and prepared answers for likely questions.

---

## 1. Elevator pitch (30–45 seconds)

"CPU Online Courses is a full-stack learning platform that lets instructors publish structured courses (sections + lessons), while students can browse, enroll, watch lessons, and track progress. It’s built with modern web technologies (Next.js App Router, TypeScript, Prisma + PostgreSQL, Supabase for storage) and includes an admin interface for course management. For this project I focused on creating a robust authoring workflow, reliable progress tracking, and a polished, accessible UI suitable for both learners and instructors."

Key highlights to call out:
- All courses in the demo are set to be free to simplify the student workflow.
- Progressive UI: server components for fast loads and client components where interaction (e.g., video player, forms) is required.

---

## 2. Suggested slide order (6–8 slides)

1. Title slide: Project name, your name, supervisor, date.
2. Motivation & problem statement (why this matters).
3. What I built — features and target users.
4. Architecture & technologies (diagram + stack list).
5. Live demo (short, focused) — show 8–12 minute walkthrough.
6. Challenges & technical takeaways.
7. Future work & credits.
8. Q&A / contact.

---

## 3. Demo script (10–12 minutes)

Timing guidance: total 10–12 minutes. Practice once with a local run.

- 0:00–0:45 — Quick elevator pitch and what you will demo.
- 0:45–1:30 — Home page & site branding: show site title, search / hero area.
- 1:30–3:00 — Catalog: use filters (category, level) and show a course card (thumbnail, description, lessons count).
- 3:00–5:00 — Course detail: show course hero, curriculum (sections & lessons), show a lesson and play video with progress tracking (if seeded data has video URL). Explain free preview if available.
- 5:00–7:00 — Enrollment flow: enroll in a course, show `My Learning` page with progress updates. Emphasize the progress persistence in the DB.
- 7:00–9:00 — Admin area: sign in as admin (seed or create admin user), open Admin Dashboard, show course list, open a course editor, add a section / lesson and save. Mention server-side validation and file upload (Supabase).
- 9:00–10:00 — Quick recap of the system and technical highlights; invite questions.

Notes for the demo:
- If you have network issues for video hosting, use a local short video file or demonstrate the lesson UI without playing the video.
- Keep actions simple and predictable; pre-create any data steps that might take long during the presentation.

---

## 4. Architecture & components (1 slide + talking points)

- Frontend: Next.js (App Router) with TypeScript. Mix of Server Components and Client Components. Tailwind CSS for styling and Radix UI primitives for accessible widgets.
- Backend & data layer: Prisma ORM with PostgreSQL (schema in `prisma/schema.prisma`). Seed script in `prisma/seed.ts`.
- Authentication: NextAuth (Credentials provider) with bcrypt password hashing.
- Storage & uploads: Supabase JS clients (public & service role) in `lib/supabase.ts`.
- Hosting & runtime: intended for Vercel/any Node host; local dev with `npm run dev`.

Files to mention while presenting:
- `app/` — main routes and UI.
- `app/(admin)/admin/` — admin dashboard and course editor.
- `lib/prisma.ts`, `lib/supabase.ts`, `lib/auth.ts` — key server helpers.
- `components/admin/CurriculumBuilder.tsx` — the course authoring UI.

Draw a simple flow diagram: Browser -> Next.js (server) -> Prisma -> PostgreSQL; and uploads -> Supabase.

---

## 5. Key implementation details (talking points)

- Server vs Client components: explain why some components are server (fast rendering, data fetching) and others are client (video controls, onError handlers, forms).
- Course model: `priceCents` retained for completeness but forced to `0` across create/update flows in this demo to keep courses free.
- Image handling: fallback local SVG thumbnail used for robustness.
- Admin stats: originally included revenue, but since demo courses are free, revenue was removed and the dashboard shows usage metrics (enrollments, growth).
- Security & roles: server routes check `session.user.role === 'ADMIN'` for admin actions; NextAuth JWTs carry role information.

---

## 6. Commands — how to run locally (copyable)

Install deps:

```bash
npm install
```

Create `.env.local` (example variables — fill yours):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://xyzcompany.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
NEXTAUTH_SECRET="some-long-secret"
```

Reset DB and seed (development):

```bash
npm run db:reset
# or if you only want to seed:
npm run db:seed
```

Start dev server:

```bash
npm run dev
# visit http://localhost:3000 (or port printed by Next)
```

Useful debugging commands:

```bash
# generate prisma client
npx prisma generate
# run migrations (if you prefer migrations over db push)
npx prisma migrate dev
```

---

## 7. Common questions & prepared answers

Q: Why did you choose Next.js and Prisma?
- A: Next.js (App Router) provides a clear separation of server and client responsibilities, great performance, and built-in routing. Prisma gives a type-safe ORM that maps directly to PostgreSQL and makes seeding and typed queries easier.

Q: How do you handle authentication and authorization?
- A: NextAuth (credentials provider) with bcrypt password hashing. Server routes check the user role on every admin endpoint. JWTs carry role info.

Q: How would you support paid courses in production?
- A: Integrate a payments provider (e.g., Stripe) for checkout and webhooks. Keep `priceCents` in the DB and add payment records. Use server-side checks to ensure content is gated until payment is confirmed; consider a license/enrollment model.

Q: How do you scale video hosting?
- A: Host videos on a CDN or dedicated streaming provider. Use signed URLs (currently Supabase can generate signed URLs via the service role) and a signed-URL expiration strategy.

Q: What were the biggest challenges?
- A: Managing server/client boundaries (event handlers must live in client components), handling image fallbacks robustly, and designing an authoring UI that is easy to use. Also, ensuring Prisma queries were efficient for admin stats.

---

## 8. Challenges & solutions (short bullets)

- Problem: Radix Select runtime error when passing empty string values.
  - Fix: use a sentinel value for the "All" option and map it in the filter logic.

- Problem: Aggregation of related model field caused a 500 in admin stats.
  - Fix: query enrollments with course references and compute sums in server code (or restructure prisma query).

- Problem: Passing event handlers into server components (e.g., `img onError`) caused runtime errors.
  - Fix: introduced a small client-only `ClientImage` component that handles `onError` internally.

- Problem: Broken external thumbnails caused poor UX.
  - Fix: add a local default SVG and robust fallback handling in the client image component.

---

## 9. Future work (short roadmap)

- Add end-to-end tests (Playwright/Cypress). 
- Add Stripe integration and purchase flows for paid courses.
- Improve authoring UX: drag-and-drop lesson reordering, bulk uploads.
- Add certificates & completion badges.
- Add analytics dashboards with richer cohort analysis.

---

## 10. Appendix — helpful file pointers (quick links in your code editor)

- `app/page.tsx` — homepage / hero / trending
- `app/(marketing)/catalog/page.tsx` — course catalog & filters
- `app/(marketing)/courses/[slug]/page.tsx` — course detail + curriculum
- `app/(admin)/admin/page.tsx` — admin dashboard
- `app/(admin)/admin/courses/` — admin course list & edit
- `components/admin/CurriculumBuilder.tsx` — course authoring UI
- `components/ClientImage.tsx` — client image fallback component
- `lib/prisma.ts`, `lib/supabase.ts`, `lib/auth.ts` — core backend helpers
- `prisma/schema.prisma`, `prisma/seed.ts` — DB schema and seed data

---

## Final tips for presentation day

- Start the dev server before your talk and keep the terminal visible only if you need to show commands.
- If possible, pre-seed data and have one instructor account ready to log into the admin dashboard.
- Rehearse the demo flow to stay within the time limit. Focus on 2–3 polished interactions rather than trying to show everything.
- Keep answers high-level and point to the code only for technical questions.

Good luck with your presentation — if you want, I can also generate a 10-slide slide deck (PowerPoint / Markdown for Reveal.js) that follows the slide order above. Tell me which format (PowerPoint .pptx, PDF, or Reveal.js markdown) you prefer and I’ll generate it next.