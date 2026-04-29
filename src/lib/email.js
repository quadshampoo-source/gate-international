import 'server-only';
import nodemailer from 'nodemailer';
import {
  buildRegistrationNotice,
  buildApprovalEmail,
  buildRejectionEmail,
} from '@/lib/email-templates';

// Gmail SMTP transport using an app password.
// Env:
//   GMAIL_USER           — full address (hello@gateinternational.co)
//   GMAIL_APP_PASSWORD   — 16-char Gmail app password (no spaces)
//   EMAIL_FROM           — display sender, e.g. `Gate International <hello@gateinternational.co>`
//                          falls back to GMAIL_USER if unset
let cached = null;

export function mailer() {
  if (cached) return cached;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  cached = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,          // STARTTLS on 587
    requireTLS: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return cached;
}

// Fire-and-forget wrapper. Logs errors but never throws to the caller, so a
// downed SMTP host can't block user operations (signup, approvals, etc.).
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const t = mailer();
  if (!t) {
    console.warn('[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping send', { to, subject });
    return { skipped: true };
  }
  try {
    const from = process.env.EMAIL_FROM || `Gate International <${process.env.GMAIL_USER}>`;
    const info = await t.sendMail({ from, to, subject, html, text, replyTo });
    return { ok: true, id: info.messageId };
  } catch (e) {
    console.error('[email] send failed', e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
}

// --- Concrete templates ---------------------------------------------------

export async function sendRegistrationNotice({ adminTo, applicant, dashboardUrl }) {
  return sendEmail({ to: adminTo, ...buildRegistrationNotice({ applicant, dashboardUrl }) });
}

export async function sendApprovalEmail({ to, name, role, projects, loginUrl }) {
  return sendEmail({ to, ...buildApprovalEmail({ name, role, projects, loginUrl }) });
}

export async function sendRejectionEmail({ to, name }) {
  return sendEmail({ to, ...buildRejectionEmail({ name }) });
}
