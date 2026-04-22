'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ = [
  { q: 'How does Turkish citizenship by investment work?', a: 'A minimum $400K property purchase — held for 3 years — qualifies the buyer and immediate family (spouse + children under 18) for Turkish citizenship. We handle end-to-end legal filing.' },
  { q: 'Can I finance part of the purchase?', a: 'Yes. Developer-backed installment plans are common for off-plan inventory. We also work with Turkish banks for refinancing at delivery.' },
  { q: 'Who holds the title deed?', a: 'You do. The TAPU (title deed) is issued in the buyer\u2019s name directly from the Land Registry. We provide notarised translations in EN, AR and ZH.' },
  { q: 'Do you assist with rental management?', a: 'Our after-sale team handles furnishings, short-term letting platforms, tax filings and tenant relations on a transparent monthly fee.' },
  { q: 'What are the ongoing costs?', a: 'Annual property tax runs 0.1–0.6%, plus site maintenance (aidat). Expect roughly 1–2% of property value per year including insurance.' },
  { q: 'Can I visit before buying?', a: 'Absolutely — we arrange private tours across Istanbul, Bodrum and Bursa, inclusive of airport transfers and a dedicated advisor.' },
];

export default function LegacyFaqs({ lang }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faqs">
      <div className="container">
        <div className="faqs-grid">
          <div className="faqs-left">
            <span className="eyebrow">— FAQ —</span>
            <h2 style={{ marginTop: 16, fontSize: 'clamp(36px, 5vw, 64px)' }}>Questions, <span className="ital">answered.</span></h2>
            <p>The quick reference for first-time buyers. Need something specific? Our team replies in under an hour, seven days a week.</p>
            <Link href={`/${lang}/contact`} className="btn-dark btn-arrow">Contact Us</Link>
          </div>
          <div>
            {FAQ.map((item, i) => (
              <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
                <button className="faq-q" type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{item.q}</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
