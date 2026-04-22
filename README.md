This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Uploading the site logo

The brand logo is managed from the admin panel and stored on Supabase Storage. The navbars render it automatically on every theme (classic, cinematic, editorial/Gate, legacy, atom). When no logo is set, a per-theme wordmark fallback is shown.

First time only — add the logo columns to `site_settings`:

```bash
node scripts/add-logo-columns.mjs
```

The script prints the `ALTER TABLE` SQL and then verifies whether the columns exist. Copy the SQL into **Supabase → SQL Editor → Run**, then rerun the script to confirm.

Then, as an admin:

1. Sign in at `/admin`
2. **Site Settings → Branding & logo**
3. Upload a **PNG** (max **2 MB**; transparent background recommended)
4. Optionally set the **Alt text** for screen readers
5. Preview appears on both light and dark backgrounds
6. Click **Remove logo** to fall back to the wordmark

Rules enforced on the upload endpoint (`/api/admin/logo-upload`):
- Admin auth required
- PNG only (verified against the 8-byte magic number, not just the extension)
- 2 MB hard cap
- Replaces the previous file in Supabase Storage (`project-photos/branding/`)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
