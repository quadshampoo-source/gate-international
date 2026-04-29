// Send the three editor-flow templates (registration / approval / rejection)
// to a recipient — for visual/end-to-end verification.
//
// Usage:
//   node scripts/test-editor-emails.mjs                       # → ADMIN_EMAIL
//   node scripts/test-editor-emails.mjs you@example.com       # → custom recipient
import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';
import {
  buildRegistrationNotice,
  buildApprovalEmail,
  buildRejectionEmail,
} from '../src/lib/email-templates.js';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const { GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_FROM, ADMIN_EMAIL } = process.env;
if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error('✗ GMAIL_USER / GMAIL_APP_PASSWORD missing in .env.local');
  process.exit(1);
}

const recipient = process.argv[2] || ADMIN_EMAIL || GMAIL_USER;
const from = EMAIL_FROM || `Gate International <${GMAIL_USER}>`;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

const sampleApplicant = {
  email: 'test.editor@example.com',
  full_name: 'Test Editör',
  company: 'Acme Yayıncılık',
  phone: '+90 555 000 1234',
};

const sampleProjects = [
  { name: 'Maslak 1453', district: 'Sarıyer' },
  { name: 'Zorlu Center', district: 'Beşiktaş' },
];

const cases = [
  {
    label: '1/3 Registration notice (admin)',
    payload: {
      ...buildRegistrationNotice({
        applicant: sampleApplicant,
        dashboardUrl: 'https://gateinternational.co/admin/users',
      }),
    },
  },
  {
    label: '2/3 Approval email (editor)',
    payload: {
      ...buildApprovalEmail({
        name: sampleApplicant.full_name,
        role: 'editor',
        projects: sampleProjects,
        loginUrl: 'https://gateinternational.co/admin/login',
      }),
    },
  },
  {
    label: '3/3 Rejection email (editor)',
    payload: {
      ...buildRejectionEmail({ name: sampleApplicant.full_name }),
    },
  },
];

console.log(`→ Recipient: ${recipient}`);
console.log(`→ From:      ${from}\n`);

for (const c of cases) {
  try {
    const info = await transporter.sendMail({
      from,
      to: recipient,
      replyTo: c.payload.replyTo,
      subject: c.payload.subject,
      html: c.payload.html,
      text: c.payload.text,
    });
    console.log(`✅ ${c.label}`);
    console.log(`   subject: ${c.payload.subject}`);
    console.log(`   id:      ${info.messageId}\n`);
  } catch (e) {
    console.error(`✗ ${c.label} — failed:`, e?.message || e);
    process.exit(1);
  }
}

console.log('Done — check the inbox (and spam folder).');
