'use client';

import { useState } from 'react';

const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5', '6+', 'Up to 1', 'Up to 2', 'Up to 3', 'Up to 4'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5+', 'Up to 1', 'Up to 2', 'Up to 3'];
const PROPERTY_TYPE_OPTIONS = ['Apartment', 'Villa', 'Penthouse', 'Duplex', 'Townhouse', 'Office', 'Mixed-Use', 'Land'];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];

function ButtonGroup({ name, value, options, onChange }) {
  return (
    <div className="btn-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`btn-option ${value === opt ? 'active' : ''}`}
          onClick={() => onChange(value === opt ? '' : opt)}
        >
          {opt}
        </button>
      ))}
      <input type="hidden" name={name} value={value || ''} />
    </div>
  );
}

export default function SpecsPicker({
  initialBedrooms = '',
  initialBathrooms = '',
  initialPropertyType = '',
  initialDeliveryMonth = '',
  initialDeliveryYear = '',
  initialDeliveryStatus = '',
}) {
  const [bedrooms, setBedrooms] = useState(initialBedrooms || '');
  const [bathrooms, setBathrooms] = useState(initialBathrooms || '');
  const [propertyType, setPropertyType] = useState(initialPropertyType || '');
  const [deliveryMonth, setDeliveryMonth] = useState(initialDeliveryMonth || '');
  const [deliveryYear, setDeliveryYear] = useState(initialDeliveryYear || '');
  const [deliveryStatus, setDeliveryStatus] = useState(initialDeliveryStatus || '');

  const markDelivered = () => {
    if (deliveryStatus === 'DELIVERED') {
      setDeliveryStatus('');
    } else {
      setDeliveryStatus('DELIVERED');
      setDeliveryMonth('');
      setDeliveryYear('');
    }
  };

  const setMonth = (v) => {
    setDeliveryMonth(v);
    if (v) setDeliveryStatus('');
  };
  const setYear = (v) => {
    setDeliveryYear(v);
    if (v) setDeliveryStatus('');
  };

  return (
    <>
      <div className="admin-row">
        <label>Bedrooms</label>
        <ButtonGroup name="bedrooms" value={bedrooms} options={BEDROOM_OPTIONS} onChange={setBedrooms} />
      </div>

      <div className="admin-row">
        <label>Bathrooms</label>
        <ButtonGroup name="bathrooms" value={bathrooms} options={BATHROOM_OPTIONS} onChange={setBathrooms} />
      </div>

      <div className="admin-row">
        <label>Property Type</label>
        <ButtonGroup name="property_type" value={propertyType} options={PROPERTY_TYPE_OPTIONS} onChange={setPropertyType} />
      </div>

      <div className="admin-row">
        <label>Delivery Date</label>
        <div className="date-select-row">
          <select
            value={deliveryMonth}
            onChange={(e) => setMonth(e.target.value)}
            className="admin-select"
          >
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
          <select
            value={deliveryYear}
            onChange={(e) => setYear(e.target.value)}
            className="admin-select"
          >
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            type="button"
            className={`btn-option ${deliveryStatus === 'DELIVERED' ? 'active' : ''}`}
            onClick={markDelivered}
          >
            Delivered
          </button>
          <input type="hidden" name="delivery_month" value={deliveryMonth} />
          <input type="hidden" name="delivery_year" value={deliveryYear} />
          <input type="hidden" name="delivery_status" value={deliveryStatus} />
        </div>
      </div>
    </>
  );
}
