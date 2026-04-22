import Link from 'next/link';
import './theme.css';
import { getProjects, getDistricts } from '@/lib/data';
import { getTestimonials } from '@/lib/testimonials';
import { getAllTeamMembers } from '@/lib/team';
import LegacyNav from './nav';
import LegacySearchBar from './search-bar';
import LegacyProperties from './properties';
import LegacyTestimonials from './testimonials';
import LegacyFaqs from './faqs';
import LegacyCta from './cta';

const RTL_LANGS = new Set(['ar', 'fa']);

const NAV_LABELS = {
  en: { projects: 'Projects', services: 'Services', citizenship: 'Citizenship', about: 'About', contact: 'Contact', cta: 'Book Consultation' },
  ar: { projects: 'المشاريع', services: 'الخدمات', citizenship: 'الجنسية', about: 'من نحن', contact: 'تواصل', cta: 'احجز استشارة' },
  zh: { projects: '项目', services: '服务', citizenship: '护照项目', about: '关于', contact: '联系', cta: '预约咨询' },
  ru: { projects: 'Проекты', services: 'Услуги', citizenship: 'Гражданство', about: 'О нас', contact: 'Контакт', cta: 'Консультация' },
  fa: { projects: 'پروژه\u200cها', services: 'خدمات', citizenship: 'شهروندی', about: 'درباره', contact: 'تماس', cta: 'مشاوره' },
  fr: { projects: 'Projets', services: 'Services', citizenship: 'Citoyenneté', about: 'À propos', contact: 'Contact', cta: 'Consultation' },
};

const CITIES = [
  { name: 'Istanbul', coord: '41.0082° N' },
  { name: 'Bodrum', coord: '37.0344° N' },
  { name: 'Bursa', coord: '40.1826° N' },
  { name: 'Riyadh', coord: '24.7136° N' },
  { name: 'Dubai', coord: '25.2048° N' },
  { name: 'Beijing', coord: '39.9042° N' },
];

const SERVICES = [
  { n: '01', title: <>Citizenship <span className="ital">pathway.</span></>, body: 'Full legal guidance from purchase to passport — drafting, filing, follow-up with Nüfus.', link: 'Learn more', stat: '250+ approved' },
  { n: '02', title: <>Property <span className="ital">tours.</span></>, body: 'Curated site visits across Istanbul, Bodrum and Bursa with private drivers and advisors.', link: 'Arrange a tour', stat: '4-day itineraries' },
  { n: '03', title: <>Legal <span className="ital">&amp; title.</span></>, body: 'End-to-end legal — due diligence, TAPU transfer, notarised translations in EN · AR · ZH.', link: 'How it works', stat: 'Bar-licensed' },
  { n: '04', title: <>After-<span className="ital">sale.</span></>, body: 'Furniture procurement, rental management on Airbnb and Booking, tax filings.', link: 'Explore', stat: '6–9% net yield' },
  { n: '05', title: <>Investment <span className="ital">advisory.</span></>, body: 'ROI and capital-gains modelling, off-plan vs ready, district thesis in plain language.', link: 'Book a call', stat: 'CFA on team' },
  { n: '06', title: <>Concierge <span className="ital">services.</span></>, body: 'Bank accounts, residency permits, schools, private healthcare — handled on your behalf.', link: 'See list', stat: '24 / 7 desk' },
];

const NEWS = [
  {
    feature: true,
    tag: 'Market Report',
    title: <>Istanbul Q1 2026 — Where <span className="ital">value</span> has moved.</>,
    excerpt: 'Beşiktaş and Sarıyer led transaction volume, but Göktürk and Çekmeköy showed the steepest price acceleration against the dollar — a classic signal of capital rotating into low-density enclaves.',
    date: 'Apr 12 · 2026',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=85',
  },
  {
    tag: 'Citizenship',
    title: <>The 2026 citizenship rule changes, explained.</>,
    excerpt: 'What the new $400K threshold means for families — and the documentation bottlenecks we\u2019re seeing in practice.',
    date: 'Apr 3 · 2026',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=85',
  },
  {
    tag: 'Bodrum',
    title: <>Yalıkavak vs Türkbükü — the real difference.</>,
    excerpt: 'A walk-through comparison of the two bays from an investor\u2019s perspective — price per square metre, rental density and build quality.',
    date: 'Mar 21 · 2026',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=85',
  },
];

export default async function LegacyHome({ lang = 'en' }) {
  const [projects, districts, testimonials, team] = await Promise.all([
    getProjects(),
    getDistricts(),
    getTestimonials(),
    getAllTeamMembers().catch(() => []),
  ]);

  const isRtl = RTL_LANGS.has(lang);
  const labels = NAV_LABELS[lang] || NAV_LABELS.en;
  const districtNames = (districts || []).map((d) => d.name).filter(Boolean).slice(0, 14);

  // Hero background image — first project exterior if available.
  const first = projects[0];
  const heroBg = (Array.isArray(first?.exteriorImages) && first.exteriorImages[0])
    || (Array.isArray(first?.gallery) && first.gallery[0])
    || first?.img
    || 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=2400&q=85';

  const stats = [
    { num: String(projects.length || 96), sym: '+', lbl: 'Properties', desc: 'Premium residences across three cities.' },
    { num: '3', sym: '', lbl: 'Cities', desc: 'Istanbul, Bodrum, and Bursa.' },
    { num: '$400', sym: 'K', lbl: 'Citizenship', desc: 'Minimum investment threshold.' },
    { num: '98', sym: '%', lbl: 'Success rate', desc: 'Citizenship applications approved.' },
  ];

  const agents = (team || []).filter((m) => m.active !== false).slice(0, 4);

  return (
    <div className="legacy" dir={isRtl ? 'rtl' : 'ltr'}>
      <LegacyNav lang={lang} labels={labels} />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="hero-inner">
          <h1>Where vision meets <span className="ital">legacy.</span></h1>
          <div className="hero-sub">Istanbul · Bodrum · Bursa</div>
          <div className="hero-meta">
            <p className="hero-desc">A curated portfolio of premium residences for discerning investors from the Gulf and Asia.</p>
            <div className="hero-cta">
              <Link href={`/${lang}/projects`} className="btn-light btn-arrow">Explore Portfolio</Link>
              <Link href={`/${lang}/contact`} className="btn-dark btn-arrow">Book a Tour</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <LegacySearchBar lang={lang} districts={districtNames} />

      {/* City ticker */}
      <section className="cities">
        <div className="container">
          <div className="cities-inner">
            {CITIES.map((c, i) => (
              <span key={c.name} className="city-item">
                <span>{c.name}</span>
                <span className="city-dot" />
                <span className="city-coord">{c.coord}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="intro">
        <div className="container">
          <div className="intro-grid">
            <h2>A different kind of <span className="ital">real estate</span> practice.</h2>
            <div className="intro-right">
              <p>
                Gate International is a boutique advisory firm serving discerning clients across the Gulf, Greater China and Europe since 2009. We focus on a narrow slice of the Turkish market — premium residences in Istanbul, Bodrum and Bursa — and on doing each transaction with the patience it deserves.
              </p>
              <p>
                We source privately, underwrite carefully, and stand behind every property with our full legal and after-sale team. No listings-site volume, no hidden commissions. Just a short list of residences we would own ourselves.
              </p>
              <div className="sig">
                <div>
                  <div className="sig-name">Ali Yılmaz</div>
                  <div className="sig-role">Founder &amp; CEO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="stat-num">{s.num}{s.sym && <span className="sym">{s.sym}</span>}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className="stat-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties */}
      <LegacyProperties projects={projects} lang={lang} />

      {/* Services */}
      <section className="services">
        <div className="container">
          <div className="services-head">
            <span className="eyebrow center">— What we do —</span>
            <h2 style={{ marginTop: 16 }}>End-to-end <span className="ital">concierge.</span></h2>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <article key={s.n} className="svc">
                <div className="svc-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="svc-foot">
                  <span className="svc-link">{s.link} →</span>
                  <span className="svc-stat">{s.stat}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="promo">
        <div className="promo-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=2400&q=85')" }} />
        <div className="promo-inner">
          <div>
            <h2>Turkish <span className="ital">Citizenship</span></h2>
            <p>Own a qualifying residence worth $400,000 or more — held for three years — and secure full Turkish citizenship for your immediate family. Visa-free access to 110+ countries, E-2 eligibility with the United States, and 2-year processing on average.</p>
            <Link href={`/${lang}/citizenship`} className="btn-light btn-arrow">Learn More</Link>
          </div>
          <aside className="promo-offer">
            <div className="big">$400K</div>
            <div className="lbl">Minimum investment</div>
            <div className="sub">Full family included</div>
          </aside>
        </div>
      </section>

      {/* Testimonials */}
      <LegacyTestimonials items={testimonials || []} />

      {/* Agents */}
      <section className="agents">
        <div className="container">
          <div className="agents-head">
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>— Team —</span>
            <h2 style={{ marginTop: 16 }}>Your dedicated <span className="ital">advisors.</span></h2>
          </div>
          {agents.length > 0 ? (
            <div className="agents-grid">
              {agents.map((m) => (
                <article key={m.id}>
                  <div className="agent-img">
                    {m.photo_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={m.photo_url} alt={m.name} loading="lazy" />
                    )}
                  </div>
                  <div className="agent-body">
                    <div className="agent-name">{m.name}</div>
                    <div className="agent-role">{m.role || 'ADVISOR'}</div>
                    <div className="agent-meta">
                      <span>{m.office || 'ISTANBUL'}</span>
                      <span>{(m.languages || ['EN']).map((l) => String(l).toUpperCase()).join(' · ')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.7, fontSize: 15 }}>Team profiles coming soon.</p>
          )}
        </div>
      </section>

      {/* News / Insights */}
      <section className="news">
        <div className="container">
          <div className="news-head">
            <span className="eyebrow center">— Insights —</span>
            <h2 style={{ marginTop: 16 }}>Market <span className="ital">intelligence.</span></h2>
          </div>
          <div className="news-grid">
            {NEWS.map((n, i) => (
              <article key={i} className={`news-card ${n.feature ? 'feature' : ''}`}>
                <div className="news-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={n.image} alt="" loading="lazy" />
                </div>
                <div className="news-body">
                  <span className="news-tag">{n.tag}</span>
                  <h3>{n.title}</h3>
                  <p className="news-excerpt">{n.excerpt}</p>
                  <div className="news-foot">{n.date} · {n.read}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <LegacyFaqs lang={lang} />

      {/* CTA */}
      <LegacyCta lang={lang} />

      {/* Footer */}
      <footer className="foot">
        <div className="container">
          <div className="foot-top">
            <div className="foot-brand">
              <span className="logo-group">
                <span className="logo-mark">G</span>
                <span>
                  <span className="logo-text">Gate International</span>
                  <span className="logo-sub" style={{ display: 'block' }}>EST. 2009</span>
                </span>
              </span>
              <p>A boutique advisory for premium Turkish residences. Istanbul, Bodrum and Bursa — sourced privately, underwritten carefully.</p>
            </div>
            <div className="foot-col">
              <h4>Properties</h4>
              <ul>
                <li><Link href={`/${lang}/projects?district=Beşiktaş`}>Istanbul</Link></li>
                <li><Link href={`/${lang}/districts/bodrum`}>Bodrum</Link></li>
                <li><Link href={`/${lang}/districts/bursa`}>Bursa</Link></li>
                <li><Link href={`/${lang}/projects`}>All Properties</Link></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Services</h4>
              <ul>
                <li><Link href={`/${lang}/citizenship`}>Citizenship</Link></li>
                <li><Link href={`/${lang}/about`}>Legal</Link></li>
                <li><Link href={`/${lang}/about`}>After-Sale</Link></li>
                <li><Link href={`/${lang}/about`}>Concierge</Link></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Company</h4>
              <ul>
                <li><Link href={`/${lang}/about`}>About</Link></li>
                <li><Link href={`/${lang}/about`}>Team</Link></li>
                <li><Link href={`/${lang}/about`}>Blog</Link></li>
                <li><Link href={`/${lang}/contact`}>Contact</Link></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bot">
            <span>© 2026 Gate International</span>
            <span>Privacy · Terms · Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
