# Gate International — Admin Setup

## 1 · Create the DB schema

1. Open Supabase → **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql`
3. Run. This creates the `projects` table with RLS enabled (public read, no public write).

## 2 · Create the admin user

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `quadshampoo@gmail.com`
3. Set a password (you will use it to sign in)
4. Uncheck "Auto Confirm User" off → **Create user** (or confirm manually)

## 3 · Seed the 73 projects from the static list

From the project root:

```bash
node scripts/seed-projects.mjs
```

Expected output: `✓ Upserted 73 rows.`

## 4 · Sign in

- Local: `npm run dev` → open http://localhost:3000/admin/login
- Credentials: the email and password you set in step 2

## 5 · Admin features (MVP)

- `/admin` — dashboard (project count)
- `/admin/projects` — list, sort by `sort_index`
- `/admin/projects/new` — create a new project (unique slug required)
- `/admin/projects/[id]` — edit / delete
- Changes revalidate the public portfolio pages automatically.

## 6 · Deploy on Vercel

1. Import the repo on Vercel.
2. Add env vars in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as secret)
   - `ADMIN_EMAIL` (e.g. `quadshampoo@gmail.com`)
3. Deploy. `next build` pre-renders the public portfolio from the DB (or falls back to the static list if DB is empty).

## 7 · Security notes

- `ADMIN_EMAIL` gates both middleware and the login action. Only that email may sign in.
- The **service role key** bypasses RLS — keep it server-only (no `NEXT_PUBLIC_` prefix).
- The public anon key and URL are safe to expose (RLS allows only `select` for anon).
- If the service role key was ever pasted in a shared conversation, rotate it: Supabase → Settings → API → **Reset service role key**.

## 8 · What's NOT in the MVP (Phase 3)

- Image uploads (Supabase Storage wiring)
- Leads inbox (Property Finder submissions → DB)
- Testimonials / blog / site-settings CRUD
- Newsletter signup persistence
- Currency switcher with live rates
