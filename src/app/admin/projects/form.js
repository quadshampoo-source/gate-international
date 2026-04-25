import { TYPOLOGIES, CATEGORIES } from '@/lib/projects';
import GalleryUpload from '@/components/admin/gallery-upload';
import SpecsPicker from './_components/specs-picker';
import OptionsEditor from './_components/options-editor';
import DistrictPicker from './_components/district-picker';
import AmenitiesEditor from './_components/amenities-editor';
import FaqsEditor from './_components/faqs-editor';

export default function ProjectForm({ action, project = {}, isNew = false, deleteAction }) {
  const v = (k, fallback = '') => project[k] ?? fallback;
  const jsonVal = (k) => (project[k] != null ? JSON.stringify(project[k], null, 2) : '');
  const dev = (project.developer_info && typeof project.developer_info === 'object') ? project.developer_info : {};
  const inv = (project.investment && typeof project.investment === 'object') ? project.investment : {};
  const dist = (project.distances && typeof project.distances === 'object') ? project.distances : {};

  return (
    <form action={action} encType="multipart/form-data" className="max-w-[860px]">
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
        <DistrictPicker
          initialDistrict={v('district')}
          initialSubDistrict={v('sub_district')}
        />
      </Row>
      <Row label="District (AR)"><input name="district_ar" defaultValue={v('district_ar')} className="admin-input" /></Row>
      <Row label="District (ZH)"><input name="district_zh" defaultValue={v('district_zh')} className="admin-input" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Hero & Description</h3>
      <Row label="Hero tagline">
        <input
          name="hero_tagline"
          defaultValue={v('hero_tagline')}
          maxLength={120}
          className="admin-input"
          placeholder="One-line pitch shown in the hero (max 120 chars)"
        />
      </Row>
      <Row label="Description">
        <textarea
          name="description"
          defaultValue={v('description')}
          rows="10"
          className="admin-textarea"
          placeholder="Long-form description. Markdown supported."
        />
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Property Specs</h3>
      <SpecsPicker
        initialBedrooms={v('bedrooms')}
        initialBathrooms={v('bathrooms')}
        initialPropertyType={v('property_type') || v('typology')}
        initialDeliveryMonth={v('delivery_month')}
        initialDeliveryYear={v('delivery_year')}
        initialDeliveryStatus={v('delivery_status')}
      />

      <h3 className="font-serif text-[22px] mt-8 mb-4">Pricing & spec</h3>
      <Row label="Price USD"><input name="price_usd" type="number" defaultValue={v('price_usd')} className="admin-input" /></Row>
      <Row label="Area (m²)"><input name="area" type="number" defaultValue={v('area')} className="admin-input w-32" /></Row>
      <Row label="Typology (legacy)">
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
      <Row label="Delivery (legacy text)"><input name="delivery" defaultValue={v('delivery')} className="admin-input" placeholder="Use Property Specs → Delivery Date instead" /></Row>
      <Row label="Metro">
        <label className="flex items-center gap-2">
          <input name="metro" type="checkbox" defaultChecked={!!project.metro} className="w-4 h-4 accent-gold" />
          <span className="text-sm">Metro nearby</span>
        </label>
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Media</h3>

      <Row label="Exterior images (Dış görünüm)">
        <GalleryUpload
          name="exterior_lines"
          initialUrls={
            Array.isArray(project?.exterior_images) && project.exterior_images.length > 0
              ? project.exterior_images
              : (Array.isArray(project?.gallery) && project.gallery.length > 0
                ? project.gallery
                : (project.img ? [project.img] : []))
          }
        />
        <p className="text-[11px] text-fg-dim mt-3">
          Cephe render, site planı, peyzaj, bina genel görünümü. İlk görsel kapak fotoğrafı olur ve hero slider&apos;a düşer. Max 12 görsel.
        </p>
      </Row>

      <Row label="Interior images (İç mekan)">
        <GalleryUpload
          name="interior_lines"
          initialUrls={Array.isArray(project?.interior_images) ? project.interior_images : []}
        />
        <p className="text-[11px] text-fg-dim mt-3">
          Salon, mutfak, yatak odası, banyo, balkon, iç mekan detayları. &quot;Interior studies&quot; bölümüne düşer; boş bırakırsan o section gizlenir. Max 12 görsel.
        </p>
      </Row>
      <Row label="Vimeo ID">
        <input
          name="vimeo_id"
          defaultValue={v('vimeo_id') || v('vimeoId')}
          className="admin-input font-mono"
          placeholder="1234567890 — numeric Vimeo video ID"
        />
      </Row>
      <Row label="Video Tour URL (YouTube)">
        <input
          name="youtube_url"
          defaultValue={v('youtube_url') || v('youtubeUrl')}
          className="admin-input font-mono"
          placeholder="https://www.youtube.com/watch?v=XXXXX  veya  https://youtu.be/XXXXX"
        />
        <p className="text-[11px] text-fg-dim mt-1.5">
          Atom detay sayfasında &ldquo;Video Tour&rdquo; bölümünde gömülü oynatılır. Vimeo ID doluyken YouTube yok sayılır.
        </p>
      </Row>
      <Row label="Residence Brochure URL (PDF)">
        <input
          name="brochure_url"
          type="url"
          defaultValue={v('brochure_url')}
          className="admin-input font-mono"
          placeholder="https://.../brochure.pdf"
        />
        <p className="text-[11px] text-fg-dim mt-1.5">
          Direct link to the detailed residence-specific PDF (max ~25 MB).
        </p>
      </Row>
      <Row label="Master Plan URL (PDF)">
        <input
          name="master_plan_url"
          type="url"
          defaultValue={v('master_plan_url')}
          className="admin-input font-mono"
          placeholder="https://.../master-plan.pdf"
        />
        <p className="text-[11px] text-fg-dim mt-1.5">
          Optional. Direct link to the parent development&rsquo;s master plan / overview PDF, if this project is part of a larger development.
        </p>
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Project scale</h3>
      <Row label="Total units"><input name="total_units" type="number" defaultValue={v('total_units')} className="admin-input w-40" /></Row>
      <Row label="Blocks"><input name="blocks" type="number" defaultValue={v('blocks')} className="admin-input w-32" /></Row>
      <Row label="Land area (m²)"><input name="land_area" type="number" defaultValue={v('land_area')} className="admin-input" /></Row>
      <Row label="Unit types (comma)"><input name="unit_types_csv" defaultValue={(project.unit_types || []).join(', ')} className="admin-input" placeholder="1+1, 2+1, 3+1" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Amenities & Features</h3>
      <AmenitiesEditor initialAmenities={Array.isArray(project.amenities) ? project.amenities : []} />

      <h3 className="font-serif text-[22px] mt-8 mb-4">Developer</h3>
      <Row label="Name">
        <input name="developer_name" defaultValue={dev.name ?? v('developer')} className="admin-input" />
      </Row>
      <Row label="Logo URL">
        <input name="developer_logo_url" type="url" defaultValue={dev.logo_url ?? ''} className="admin-input font-mono" placeholder="https://..." />
      </Row>
      <Row label="Founded year">
        <input name="developer_founded_year" type="number" min="1800" max="2100" defaultValue={dev.founded_year ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Website">
        <input name="developer_website_url" type="url" defaultValue={dev.website_url ?? ''} className="admin-input font-mono" placeholder="https://..." />
      </Row>
      <Row label="Past projects count">
        <input name="developer_past_projects_count" type="number" min="0" defaultValue={dev.past_projects_count ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Description">
        <textarea
          name="developer_description"
          defaultValue={dev.description ?? ''}
          maxLength={500}
          rows="4"
          className="admin-textarea"
          placeholder="Max 500 chars"
        />
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Scores</h3>
      <Row label="China score (1–5)"><input name="china_score" type="number" min="1" max="5" defaultValue={v('china_score')} className="admin-input w-24" /></Row>
      <Row label="Arab score (1–5)"><input name="arab_score" type="number" min="1" max="5" defaultValue={v('arab_score')} className="admin-input w-24" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Available Options</h3>
      <OptionsEditor initialOptions={Array.isArray(project.options) ? project.options : []} />

      <h3 className="font-serif text-[22px] mt-8 mb-4">Investment Info</h3>
      <Row label="Rental yield (%)">
        <input
          name="investment_rental_yield_pct"
          type="number"
          step="0.1"
          defaultValue={inv.rental_yield_pct ?? ''}
          className="admin-input w-40"
        />
      </Row>
      <Row label="5-yr appreciation (%)">
        <input
          name="investment_appreciation_pct_5yr"
          type="number"
          step="0.1"
          defaultValue={inv.appreciation_pct_5yr ?? ''}
          className="admin-input w-40"
        />
      </Row>
      <Row label="Min investment for citizenship (USD)">
        <input
          name="investment_min_investment_for_citizenship"
          type="number"
          min="0"
          defaultValue={inv.min_investment_for_citizenship ?? ''}
          className="admin-input w-48"
          placeholder="400000"
        />
      </Row>
      <Row label="Citizenship eligible">
        <label className="flex items-center gap-2">
          <input
            name="investment_citizenship_eligible"
            type="checkbox"
            defaultChecked={!!inv.citizenship_eligible}
            className="w-4 h-4 accent-gold"
          />
          <span className="text-sm">Qualifies for Turkish Citizenship by Investment</span>
        </label>
      </Row>
      <Row label="ROI notes">
        <textarea
          name="investment_roi_notes"
          defaultValue={inv.roi_notes ?? ''}
          maxLength={500}
          rows="4"
          className="admin-textarea"
          placeholder="Max 500 chars"
        />
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Distances</h3>
      <Row label="Metro (km)">
        <input name="distance_metro_km" type="number" step="0.1" min="0" defaultValue={dist.metro_km ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Mall (km)">
        <input name="distance_mall_km" type="number" step="0.1" min="0" defaultValue={dist.mall_km ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="School (km)">
        <input name="distance_school_km" type="number" step="0.1" min="0" defaultValue={dist.school_km ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Airport (min)">
        <input name="distance_airport_min" type="number" min="0" defaultValue={dist.airport_min ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Bosphorus (min)">
        <input name="distance_bosphorus_min" type="number" min="0" defaultValue={dist.bosphorus_min ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Beach (km)">
        <input name="distance_beach_km" type="number" step="0.1" min="0" defaultValue={dist.beach_km ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Hospital (km)">
        <input name="distance_hospital_km" type="number" step="0.1" min="0" defaultValue={dist.hospital_km ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="Business district (min)">
        <input name="distance_business_district_min" type="number" min="0" defaultValue={dist.business_district_min ?? ''} className="admin-input w-40" />
      </Row>
      <Row label="City center (min)">
        <input name="distance_city_center_min" type="number" min="0" defaultValue={dist.city_center_min ?? ''} className="admin-input w-40" />
      </Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">Rich fields (JSON)</h3>
      <Row label="Price table"><textarea name="price_table" defaultValue={jsonVal('price_table')} rows="4" className="admin-textarea font-mono text-[12px]" placeholder='[{"type":"2+1","priceUsd":450000}]' /></Row>
      <Row label="Payment plan"><textarea name="payment_plan" defaultValue={jsonVal('payment_plan')} rows="3" className="admin-textarea font-mono text-[12px]" placeholder='{"downPct":30,"termMonths":18,"interestPct":0}' /></Row>
      <Row label="Reasons (one per line)"><textarea name="reasons_lines" defaultValue={(project.reasons || []).join('\n')} rows="5" className="admin-textarea" /></Row>

      <h3 className="font-serif text-[22px] mt-8 mb-4">FAQ</h3>
      <FaqsEditor initialFaqs={Array.isArray(project.faqs) ? project.faqs : []} />

      <div className="flex gap-3 mt-10 pt-6 border-t border-line">
        <button type="submit" className="admin-btn">{isNew ? 'Create project' : 'Save changes'}</button>
        <a href="/admin/projects" className="admin-btn secondary">Cancel</a>
        {!isNew && deleteAction && (
          <form action={deleteAction} className="ml-auto">
            <input type="hidden" name="id" value={project.id} />
            <button type="submit" className="admin-btn danger">Delete</button>
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
