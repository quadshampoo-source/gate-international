import { DISTRICTS, TYPOLOGIES, CATEGORIES } from '@/lib/projects';

export default function ProjectForm({ action, project = {}, isNew = false, deleteAction }) {
  const v = (k, fallback = '') => project[k] ?? fallback;
  const jsonVal = (k) => (project[k] != null ? JSON.stringify(project[k], null, 2) : '');

  return (
    <form action={action} className="max-w-[860px]">
      <Row label="ID (slug)">
        <input
          name="id"
          required
          defaultValue={v('id')}
          readOnly={!isNew}
          pattern="[a-z0-9-]+"
          className="admin-input font-mono text-[13px]"
        />
      </Row>

      <Row label="Sort index">
        <input name="sort_index" type="number" defaultValue={v('sort_index', 0)} className="admin-input w-32" />
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Names & location</h3>
      <Row label="Name (EN)"><input name="name" required defaultValue={v('name')} className="admin-input" /></Row>
      <Row label="Name (AR)"><input name="name_ar" defaultValue={v('name_ar')} className="admin-input" /></Row>
      <Row label="Name (ZH)"><input name="name_zh" defaultValue={v('name_zh')} className="admin-input" /></Row>
      <Row label="District">
        <select name="district" required defaultValue={v('district')} className="admin-select">
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </Row>
      <Row label="District (AR)"><input name="district_ar" defaultValue={v('district_ar')} className="admin-input" /></Row>
      <Row label="District (ZH)"><input name="district_zh" defaultValue={v('district_zh')} className="admin-input" /></Row>
      <Row label="Developer"><input name="developer" defaultValue={v('developer')} className="admin-input" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Pricing & spec</h3>
      <Row label="Price USD"><input name="price_usd" type="number" defaultValue={v('price_usd')} className="admin-input" /></Row>
      <Row label="Bedrooms"><input name="bedrooms" type="number" defaultValue={v('bedrooms')} className="admin-input w-32" /></Row>
      <Row label="Area (m²)"><input name="area" type="number" defaultValue={v('area')} className="admin-input w-32" /></Row>
      <Row label="Typology">
        <select name="typology" defaultValue={v('typology')} className="admin-select">
          <option value="">—</option>
          {TYPOLOGIES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Row>
      <Row label="Category">
        <select name="category" defaultValue={v('category')} className="admin-select">
          <option value="">—</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Row>
      <Row label="Status">
        <select name="status" defaultValue={v('status')} className="admin-select">
          <option value="forSale">forSale</option>
          <option value="construction">construction</option>
          <option value="delivered">delivered</option>
        </select>
      </Row>
      <Row label="Market">
        <select name="market" defaultValue={v('market')} className="admin-select">
          <option value="china">china</option>
          <option value="arab">arab</option>
          <option value="both">both</option>
        </select>
      </Row>
      <Row label="View">
        <select name="view" defaultValue={v('view')} className="admin-select">
          <option value="City">City</option>
          <option value="Bosphorus">Bosphorus</option>
          <option value="Forest">Forest</option>
          <option value="Park">Park</option>
          <option value="Sea of Marmara">Sea of Marmara</option>
        </select>
      </Row>
      <Row label="Delivery"><input name="delivery" defaultValue={v('delivery')} className="admin-input" /></Row>
      <Row label="Metro">
        <label className="flex items-center gap-2">
          <input name="metro" type="checkbox" defaultChecked={!!project.metro} className="w-4 h-4 accent-gold" />
          <span className="text-sm">Metro nearby</span>
        </label>
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Media</h3>
      <Row label="Image URL"><input name="img" type="url" defaultValue={v('img')} className="admin-input" placeholder="https://…" /></Row>
      <Row label="Vimeo ID"><input name="vimeo_id" defaultValue={v('vimeo_id')} className="admin-input font-mono" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Project scale</h3>
      <Row label="Total units"><input name="total_units" type="number" defaultValue={v('total_units')} className="admin-input w-40" /></Row>
      <Row label="Blocks"><input name="blocks" type="number" defaultValue={v('blocks')} className="admin-input w-32" /></Row>
      <Row label="Land area (m²)"><input name="land_area" type="number" defaultValue={v('land_area')} className="admin-input" /></Row>
      <Row label="Unit types (comma)"><input name="unit_types_csv" defaultValue={(project.unit_types || []).join(', ')} className="admin-input" placeholder="1+1, 2+1, 3+1" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Scores</h3>
      <Row label="China score (1–5)"><input name="china_score" type="number" min="1" max="5" defaultValue={v('china_score')} className="admin-input w-24" /></Row>
      <Row label="Arab score (1–5)"><input name="arab_score" type="number" min="1" max="5" defaultValue={v('arab_score')} className="admin-input w-24" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Rich fields (JSON)</h3>
      <Row label="Price table"><textarea name="price_table" defaultValue={jsonVal('price_table')} rows="4" className="admin-textarea font-mono text-[12px]" placeholder='[{"type":"2+1","priceUsd":450000}]' /></Row>
      <Row label="Payment plan"><textarea name="payment_plan" defaultValue={jsonVal('payment_plan')} rows="3" className="admin-textarea font-mono text-[12px]" placeholder='{"downPct":30,"termMonths":18,"interestPct":0}' /></Row>
      <Row label="Distances"><textarea name="distances" defaultValue={jsonVal('distances')} rows="3" className="admin-textarea font-mono text-[12px]" placeholder='{"metro_km":0.3,"mall_km":0.8}' /></Row>
      <Row label="Reasons (one per line)"><textarea name="reasons_lines" defaultValue={(project.reasons || []).join('\n')} rows="5" className="admin-textarea" /></Row>

      <div className="flex gap-3 mt-10 pt-6 border-t border-line">
        <button type="submit" className="admin-btn">{isNew ? 'Create project' : 'Save changes'}</button>
        <a href="/admin/projects" className="admin-btn secondary">Cancel</a>
        {!isNew && deleteAction && (
          <form action={deleteAction} className="ml-auto">
            <input type="hidden" name="id" value={project.id} />
            <button type="submit" className="admin-btn danger" onClick={() => true}>Delete</button>
          </form>
        )}
      </div>
    </form>
  );
}

function Row({ label, children }) {
  return (
    <div className="admin-row">
      <label>{label}</label>
      <div>{children}</div>
    </div>
  );
}
