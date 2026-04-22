'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyCta({ lang }) {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    router.push(`/${lang}/contact${qs}`);
  };

  return (
    <section className="cta">
      <div className="cta-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=2400&q=85')" }} />
      <div className="cta-inner">
        <div>
          <h2>Begin your <span className="ital">journey.</span></h2>
          <div className="cta-note">No obligation · Free consultation</div>
        </div>
        <div>
          <form className="cta-form" onSubmit={submit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Get in Touch</button>
          </form>
        </div>
      </div>
    </section>
  );
}
