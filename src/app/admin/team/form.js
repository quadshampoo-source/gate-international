import { OFFICES, ALL_LANGUAGES, LANG_FLAGS, OFFICE_FLAGS } from '@/lib/team-constants';

export default function TeamForm({ action, member = {}, error, submitLabel = 'Save' }) {
  const langs = new Set(member.languages || []);
  const isEdit = !!member.id;

  return (
    <form action={action} encType="multipart/form-data" className="max-w-[720px] space-y-6">
      {isEdit && <input type="hidden" name="id" value={member.id} />}

      {error && (
        <div className="text-[13px] text-[#ef4444] border border-[#ef4444]/40 bg-[#ef4444]/5 px-4 py-3">
          {error}
        </div>
      )}

      <Row label="Full name *">
        <input name="name" defaultValue={member.name || ''} required className="admin-input" />
      </Row>

      <Row label="Photo">
        <div className="flex items-center gap-5">
          {member.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo_url} alt="" className="w-16 h-16 rounded-full object-cover border border-gold/30" />
          )}
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="text-[13px]" />
          <span className="text-[11px] text-fg-dim">Upload to replace. Max 5 MB · JPEG/PNG/WebP.</span>
        </div>
      </Row>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="Title — EN">
          <input name="title_en" defaultValue={member.title_en || ''} className="admin-input" placeholder="Sales Consultant" />
        </Row>
        <Row label="Title — AR (عربي)">
          <input name="title_ar" defaultValue={member.title_ar || ''} className="admin-input" dir="rtl" />
        </Row>
        <Row label="Title — ZH (中文)">
          <input name="title_zh" defaultValue={member.title_zh || ''} className="admin-input" />
        </Row>
        <Row label="Title — RU (Русский)">
          <input name="title_ru" defaultValue={member.title_ru || ''} className="admin-input" />
        </Row>
        <Row label="Title — FA (فارسی)">
          <input name="title_fa" defaultValue={member.title_fa || ''} className="admin-input" dir="rtl" />
        </Row>
        <Row label="Title — FR (Français)">
          <input name="title_fr" defaultValue={member.title_fr || ''} className="admin-input" />
        </Row>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="WhatsApp number (E.164, no +)">
          <input
            name="whatsapp_number"
            defaultValue={member.whatsapp_number || ''}
            className="admin-input font-mono"
            placeholder="905355206339"
            pattern="\d{6,16}"
          />
        </Row>
        <Row label="Email">
          <input
            name="email"
            type="email"
            defaultValue={member.email || ''}
            className="admin-input"
            placeholder="name@gateinternational.co"
          />
        </Row>
      </div>

      <Row label="Office *">
        <select name="office" defaultValue={member.office || 'istanbul'} required className="admin-input">
          {OFFICES.map((o) => (
            <option key={o} value={o}>{OFFICE_FLAGS[o] || '🌍'} {o}</option>
          ))}
        </select>
      </Row>

      <Row label="Spoken languages">
        <div className="flex flex-wrap gap-2">
          {ALL_LANGUAGES.map((l) => (
            <label
              key={l}
              className="inline-flex items-center gap-2 px-3 py-2 border border-line rounded cursor-pointer hover:border-gold/50"
            >
              <input type="checkbox" name={`lang_${l}`} defaultChecked={langs.has(l)} />
              <span className="text-[14px]">{LANG_FLAGS[l] || '🌐'}</span>
              <span className="text-[12px] font-mono uppercase tracking-[0.12em]">{l}</span>
            </label>
          ))}
        </div>
      </Row>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="Sort order">
          <input name="sort_order" type="number" defaultValue={member.sort_order ?? 0} className="admin-input" />
        </Row>
        <Row label="Active">
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" name="active" defaultChecked={member.active !== false} />
            <span className="text-[13px] text-fg-muted">Visible on public contact page</span>
          </label>
        </Row>
      </div>

      <div className="pt-4 border-t border-line flex items-center gap-3">
        <button type="submit" className="admin-btn">{submitLabel}</button>
        <a href="/admin/team" className="admin-btn secondary">Cancel</a>
      </div>
    </form>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
