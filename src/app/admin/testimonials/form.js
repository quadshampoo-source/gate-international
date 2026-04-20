export default function TestimonialForm({ action, row = {}, error, submitLabel = 'Save' }) {
  const isEdit = !!row.id;
  return (
    <form action={action} encType="multipart/form-data" className="max-w-[720px] space-y-6">
      {isEdit && <input type="hidden" name="id" value={row.id} />}
      {error && (
        <div className="text-[13px] text-[#ef4444] border border-[#ef4444]/40 bg-[#ef4444]/5 px-4 py-3">
          {error}
        </div>
      )}

      <Row label="Client name *">
        <input name="name" defaultValue={row.name || ''} required className="admin-input" />
      </Row>

      <Row label="Role / city (e.g. Private Investor · Riyadh)">
        <input name="role" defaultValue={row.role || ''} className="admin-input" />
      </Row>

      <Row label="Quote *">
        <textarea name="quote" defaultValue={row.quote || ''} required rows={5} className="admin-input" style={{ resize: 'vertical' }} />
      </Row>

      <Row label="Photo">
        <div className="flex items-center gap-5">
          {row.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.photo_url} alt="" className="w-16 h-16 rounded-full object-cover border border-gold/30" />
          )}
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="text-[13px]" />
          <span className="text-[11px] text-fg-dim">Optional. Max 5 MB · JPEG/PNG/WebP.</span>
        </div>
      </Row>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Row label="Source language (optional)">
          <select name="lang" defaultValue={row.lang || ''} className="admin-input">
            <option value="">—</option>
            <option value="en">EN</option>
            <option value="ar">AR (RTL)</option>
            <option value="zh">ZH</option>
            <option value="ru">RU</option>
            <option value="fa">FA (RTL)</option>
            <option value="fr">FR</option>
            <option value="tr">TR</option>
          </select>
        </Row>
        <Row label="Sort order">
          <input name="sort_order" type="number" defaultValue={row.sort_order ?? 0} className="admin-input" />
        </Row>
        <Row label="Active">
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" name="active" defaultChecked={row.active !== false} />
            <span className="text-[13px] text-fg-muted">Visible on public pages</span>
          </label>
        </Row>
      </div>

      <div className="pt-4 border-t border-line flex items-center gap-3">
        <button type="submit" className="admin-btn">{submitLabel}</button>
        <a href="/admin/testimonials" className="admin-btn secondary">Cancel</a>
      </div>
    </form>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">{label}</label>
      {children}
    </div>
  );
}
