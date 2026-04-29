# Email Setup

Gate International uses **Gmail SMTP** for transactional mail (registration notices, approval/rejection emails) via `nodemailer`. All sends go through one entry point: `sendEmail()` in `src/lib/email.js`.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `GMAIL_USER` | yes | Workspace address that sends mail (`hello@gateinternational.co`) |
| `GMAIL_APP_PASSWORD` | yes | 16-char Google App Password, no spaces |
| `EMAIL_FROM` | no | Display sender, e.g. `Gate International <hello@gateinternational.co>`. Falls back to `Gate International <${GMAIL_USER}>` |
| `ADMIN_EMAIL` | yes | Address that gets new-registration notices |

Set these in `.env.local` (dev) and Vercel → Project Settings → Environment Variables (Production / Preview / Development).

## Generating a Gmail App Password

1. The sending account must have **2-Step Verification** enabled (Google Account → Security)
2. Visit https://myaccount.google.com/apppasswords
3. Create a password with name "Gate International SMTP", copy the 16-char value
4. Paste into `GMAIL_APP_PASSWORD` (strip spaces)
5. Old/leaked passwords: revoke them on the same page

## Verifying the connection

```bash
npm run test:smtp
```

Runs `scripts/test-smtp.mjs` which:
1. Loads creds from `.env.local`
2. Calls `transporter.verify()` — fails if auth is wrong
3. Sends a test email to `ADMIN_EMAIL` (falls back to `GMAIL_USER`)

Expected output:
```
✅ SMTP OK — connection + auth succeeded
✅ Test mail sent to <admin>
   messageId: <...>
```

## Where mail is sent from

| Trigger | Function | Recipient |
|---|---|---|
| New `/admin/register` signup | `sendRegistrationNotice` | `ADMIN_EMAIL` |
| Admin approves user | `sendApprovalEmail` | The applicant |
| Admin rejects user | `sendRejectionEmail` | The applicant |
| Generic API call | `POST /api/send-email` | Any (admin-only endpoint) |

All of them route through `sendEmail()` in `src/lib/email.js`. Don't call `nodemailer.createTransport` from anywhere else.

## Supabase auth emails (dashboard config)

Supabase sends its own auth mails (signup confirm, password reset, magic link). To route them through the same Gmail account, configure custom SMTP in the Supabase Dashboard — **this is dashboard-only, no code change**:

> Supabase Dashboard → Project Settings → Authentication → SMTP Settings
> - Enable Custom SMTP: **ON**
> - Sender email: `hello@gateinternational.co`
> - Sender name: `Gate International`
> - Host: `smtp.gmail.com`
> - Port: `587`
> - Username: `hello@gateinternational.co`
> - Password: *(Gmail App Password — same value as `GMAIL_APP_PASSWORD`)*
> - Minimum interval between emails: `60 seconds`

After saving, send a test signup to confirm Supabase delivers via the new SMTP.

## Troubleshooting

- **`Invalid login: 535-5.7.8`** — App password wrong or revoked. Regenerate.
- **`Application-specific password required`** — 2FA isn't on, or you used the regular Google password. Use an App Password.
- **Gmail rate limits** — Workspace sending limit is ~2000/day. Burst hard and Google will throttle for ~24h.
- **From address rewritten / "on behalf of"** — `EMAIL_FROM` must be the same Workspace mailbox (or an alias of it) as `GMAIL_USER`. Different domains will be rewritten by Gmail.
- **Mail not arriving but no error** — `sendEmail()` is fire-and-forget; check server logs (`[email]` prefix). Also verify `ADMIN_EMAIL` is correct and check spam.
