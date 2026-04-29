import Link from 'next/link';
import Image from 'next/image';
import { WHATSAPP_DEFAULT_MESSAGES } from '@/lib/utils';
import { LANG_FLAGS, localizedTitle } from '@/lib/team-constants';

function memberWaLink(number, lang) {
  if (!number) return null;
  const msg = WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

function avatarHue(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

function Avatar({ name, photoUrl }) {
  if (photoUrl) {
    return (
      <div
        className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
        style={{ border: '1px solid var(--neutral-200)' }}
      >
        <Image src={photoUrl} alt={name} fill sizes="64px" style={{ objectFit: 'cover' }} />
      </div>
    );
  }
  const initials = name.split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
  const hue = avatarHue(name);
  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 92%), hsl(${(hue + 40) % 360} 70% 88%))`,
        color: `hsl(${hue} 50% 35%)`,
      }}
    >
      {initials}
    </div>
  );
}

function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.46 0 .1 5.37.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.24-1.63a12 12 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.37 11.95-11.96 0-3.19-1.24-6.19-3.48-8.41zm-8.47 18.4h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.22-3.71.97.99-3.6-.24-.37a9.91 9.91 0 0 1-1.52-5.31c0-5.48 4.46-9.93 9.95-9.93a9.93 9.93 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.92 7.03c0 5.48-4.47 9.93-9.98 9.93zm5.45-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export default function AtomTeamCard({ member, lang, dict }) {
  const title = localizedTitle(member, lang);
  const waText = dict?.team?.chatCta || 'Chat';
  const emailText = dict?.team?.emailCta || 'Email';
  const speaksText = dict?.team?.speaks || 'Speaks';
  const waHref = memberWaLink(member.whatsapp_number, lang);

  return (
    <div
      className="group p-5 transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--atom-surface)',
        border: '1px solid var(--neutral-200)',
        borderRadius: 'var(--atom-radius-lg)',
        boxShadow: 'var(--atom-shadow-sm)',
      }}
    >
      <div className="flex items-start gap-4">
        <Avatar name={member.name} photoUrl={member.photo_url} />
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold leading-tight truncate" style={{ color: 'var(--neutral-900)' }}>
            {member.name}
          </div>
          <div
            className="text-[11px] font-semibold uppercase tracking-wider mt-1"
            style={{ color: 'var(--neutral-400)' }}
          >
            {title}
          </div>
          {member.languages?.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider mr-1"
                style={{ color: 'var(--neutral-400)' }}
              >
                {speaksText}
              </span>
              {member.languages.map((l) => (
                <span key={l} title={l.toUpperCase()} className="text-base leading-none">
                  {LANG_FLAGS[l] || '🌐'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {waHref && (
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 text-sm font-semibold transition-colors"
            style={{ background: '#25D366', color: '#fff', borderRadius: 'var(--atom-radius-md)' }}
          >
            <WaIcon />
            {waText}
          </Link>
        )}
        <Link
          href={`mailto:${member.email || 'hello@gateinternational.co'}?subject=${encodeURIComponent(`Inquiry for ${member.name}`)}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 text-sm font-semibold transition-colors"
          style={{
            background: 'var(--atom-surface)',
            border: '1px solid var(--neutral-200)',
            color: 'var(--primary-700)',
            borderRadius: 'var(--atom-radius-md)',
          }}
        >
          <EmailIcon />
          {emailText}
        </Link>
      </div>
    </div>
  );
}
