import 'server-only';
import nodemailer from 'nodemailer';

// Gmail SMTP transport using an app password.
// Env:
//   GMAIL_USER           — full address (hello@gateinternational.co)
//   GMAIL_APP_PASSWORD   — 16-char Gmail app password (no spaces)
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
    const from = `Gate International <${process.env.GMAIL_USER}>`;
    const info = await t.sendMail({ from, to, subject, html, text, replyTo });
    return { ok: true, id: info.messageId };
  } catch (e) {
    console.error('[email] send failed', e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
}

// --- Layout helper --------------------------------------------------------
const BRAND_GOLD = '#C9A84C';
const BRAND_BG = '#0a0a0a';
const BRAND_FG = '#EDE6D3';

function shell(innerHtml, { preheader = '' } = {}) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Gate International</title>
</head>
<body style="margin:0;background:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:${BRAND_FG};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND_BG};">
  <tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:#111110;border:1px solid #1e1d17;border-radius:6px;max-width:600px;">
      <tr><td style="padding:28px 32px;border-bottom:1px solid #1e1d17;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="width:10px;height:10px;background:${BRAND_GOLD};border-radius:50%;"></td>
          <td style="padding-left:10px;font-family:Georgia,serif;font-size:18px;color:${BRAND_FG};letter-spacing:.08em;">GATE INTERNATIONAL</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:32px;">
        ${innerHtml}
      </td></tr>
      <tr><td style="padding:22px 32px;border-top:1px solid #1e1d17;color:#6b6659;font-size:12px;line-height:1.6;">
        Gate International · Maslak 1453, Istanbul · <a href="mailto:hello@gateinternational.co" style="color:#9a9487;text-decoration:underline;">hello@gateinternational.co</a><br>
        This message was sent from an automated system — reply directly and it will reach the team.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// --- Concrete templates ---------------------------------------------------

export async function sendRegistrationNotice({ adminTo, applicant, dashboardUrl }) {
  const subject = `Yeni Editör Başvurusu — ${applicant.company || applicant.full_name || applicant.email}`;
  const rows = [
    ['Ad', applicant.full_name],
    ['E-posta', applicant.email],
    ['Firma', applicant.company],
    ['Telefon', applicant.phone],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 0;color:#9a9487;font-size:12px;letter-spacing:.12em;text-transform:uppercase;width:120px;">${k}</td>
        <td style="padding:8px 0;color:${BRAND_FG};font-size:15px;">${escapeHtml(v)}</td>
      </tr>`
    )
    .join('');

  const inner = `
    <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_GOLD};margin-bottom:12px;">NEW · REGISTRATION</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 16px;color:${BRAND_FG};letter-spacing:-.01em;">Yeni editör başvurusu</h1>
    <p style="color:#9a9487;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Aşağıdaki kullanıcı <b>/admin/register</b> üzerinden kayıt oldu ve onay bekliyor.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #1e1d17;border-bottom:1px solid #1e1d17;">${rows}</table>
    <div style="margin-top:28px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_BG};padding:14px 24px;border-radius:2px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;text-decoration:none;">Onay panelini aç</a>
    </div>
  `;
  return sendEmail({
    to: adminTo,
    subject,
    html: shell(inner, { preheader: `${applicant.full_name || applicant.email} — ${applicant.company || ''}` }),
    text: `Yeni editör başvurusu\n\nAd: ${applicant.full_name || ''}\nE-posta: ${applicant.email}\nFirma: ${applicant.company || '-'}\nTelefon: ${applicant.phone || '-'}\n\n${dashboardUrl}`,
    replyTo: applicant.email,
  });
}

export async function sendApprovalEmail({ to, name, role, projects, loginUrl }) {
  const list = (projects || []).length
    ? `<ul style="margin:16px 0 0;padding-left:20px;color:${BRAND_FG};font-size:14px;line-height:1.7;">${projects
        .map((p) => `<li>${escapeHtml(p.name)} <span style="color:#6b6659;">· ${escapeHtml(p.district || '')}</span></li>`)
        .join('')}</ul>`
    : '';
  const roleLabel = role === 'admin' ? 'yönetici (admin)' : 'editör';
  const inner = `
    <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_GOLD};margin-bottom:12px;">ACCESS · ACTIVATED</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 16px;color:${BRAND_FG};letter-spacing:-.01em;">Erişiminiz aktif</h1>
    <p style="color:#9a9487;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Merhaba${name ? ` ${escapeHtml(name)}` : ''},<br><br>
      Gate International yönetim paneline <b>${roleLabel}</b> olarak erişiminiz onaylandı.
      ${projects && projects.length ? `Size ${projects.length} proje atandı:` : 'Henüz atanmış projeniz yok — kısa süre içinde atanacak.'}
    </p>
    ${list}
    <div style="margin-top:28px;">
      <a href="${loginUrl}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_BG};padding:14px 24px;border-radius:2px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;text-decoration:none;">Giriş yap</a>
    </div>
    <p style="color:#6b6659;font-size:12px;line-height:1.6;margin:32px 0 0;">
      Şifrenizi kayıt sırasında belirlediniz. Unuttuysanız bu e-postaya yanıt vererek sıfırlama talep edebilirsiniz.
    </p>
  `;
  return sendEmail({
    to,
    subject: 'Gate International — Editör Erişiminiz Aktif',
    html: shell(inner, { preheader: 'Erişiminiz onaylandı — panele giriş yapabilirsiniz.' }),
    text: `Erişiminiz aktif.\nRol: ${roleLabel}\nAtanan proje sayısı: ${projects?.length || 0}\n\nGiriş: ${loginUrl}`,
  });
}

export async function sendRejectionEmail({ to, name }) {
  const inner = `
    <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_GOLD};margin-bottom:12px;">APPLICATION · UPDATE</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 16px;color:${BRAND_FG};letter-spacing:-.01em;">Başvurunuza dair</h1>
    <p style="color:#9a9487;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Merhaba${name ? ` ${escapeHtml(name)}` : ''},<br><br>
      İlginiz için teşekkür ederiz. Başvurunuzu değerlendirdikten sonra şu an için sistemimize
      yeni editör eklemediğimizi bildirmek isteriz.
    </p>
    <p style="color:#9a9487;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Bir yanlış anlaşılma olduğunu düşünüyor veya Gate International ile başka bir alanda
      iş birliği yapmak istiyorsanız lütfen bu e-postaya yanıt verin veya bize WhatsApp'tan
      ulaşın: <span style="color:${BRAND_GOLD};">+90 535 520 6339</span>.
    </p>
    <p style="color:#6b6659;font-size:12px;line-height:1.6;margin:24px 0 0;">Saygılarımızla,<br>Gate International</p>
  `;
  return sendEmail({
    to,
    subject: 'Gate International — Başvuru Sonucu',
    html: shell(inner, { preheader: 'Başvurunuzun değerlendirilmesi hakkında.' }),
    text: `Merhaba${name ? ` ${name}` : ''},\n\nİlginiz için teşekkür ederiz. Şu an için sistemimize yeni editör eklememekteyiz.\n\nBize WhatsApp'tan ulaşabilirsiniz: +90 535 520 6339\n\nGate International`,
  });
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
