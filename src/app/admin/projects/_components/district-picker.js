'use client';

import { useState } from 'react';
import { DISTRICTS, BODRUM_SUB_DISTRICTS, BURSA_SUB_DISTRICTS } from '@/lib/projects';

// Top-level district drives the sub-district picker:
// - Istanbul neighborhood → sub_district hidden (sent as empty)
// - 'Bodrum' → sub_district picks from BODRUM_SUB_DISTRICTS
// - 'Bursa'  → sub_district picks from BURSA_SUB_DISTRICTS
export default function DistrictPicker({ initialDistrict, initialSubDistrict }) {
  const [district, setDistrict] = useState(initialDistrict || DISTRICTS[0]);
  const [subDistrict, setSubDistrict] = useState(initialSubDistrict || '');

  const subOptions = district === 'Bodrum' ? BODRUM_SUB_DISTRICTS
                   : district === 'Bursa' ? BURSA_SUB_DISTRICTS
                   : null;

  const onDistrictChange = (e) => {
    setDistrict(e.target.value);
    setSubDistrict('');
  };

  return (
    <>
      <select
        name="district"
        required
        value={district}
        onChange={onDistrictChange}
        className="admin-select"
      >
        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      {subOptions ? (
        <select
          name="sub_district"
          value={subDistrict}
          onChange={(e) => setSubDistrict(e.target.value)}
          className="admin-select mt-2"
        >
          <option value="">— pick a {district} sub-district —</option>
          {subOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ) : (
        <input type="hidden" name="sub_district" value="" />
      )}
    </>
  );
}
