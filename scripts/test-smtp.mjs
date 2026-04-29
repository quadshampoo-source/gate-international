// Verify Gmail SMTP credentials and send a test email to ADMIN_EMAIL.
// Usage: node scripts/test-smtp.mjs
import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';

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

const to = ADMIN_EMAIL || GMAIL_USER;
const from = EMAIL_FROM || `Gate International <${GMAIL_USER}>`;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

try {
  await transporter.verify();
  console.log('✅ SMTP OK — connection + auth succeeded');
} catch (e) {
  console.error('✗ SMTP verify failed:', e?.message || e);
  process.exit(1);
}

try {
  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Gate International — SMTP test',
    text: `If you can read this, Gmail SMTP works.\n\nFrom: ${from}\nTime: ${new Date().toISOString()}`,
    html: `<p>If you can read this, Gmail SMTP works.</p><p style="color:#888;font-size:12px">From: ${from}<br>Time: ${new Date().toISOString()}</p>`,
  });
  console.log(`✅ Test mail sent to ${to}`);
  console.log(`   messageId: ${info.messageId}`);
} catch (e) {
  console.error('✗ Send failed:', e?.message || e);
  process.exit(1);
}
