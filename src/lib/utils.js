import { districtLabel } from '@/lib/districts';

export const fmtUsd = (n) => {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 2) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n;
};

export const localizedName = (project, lang) => {
  if (lang === 'ar') return project.nameAr || project.name;
  if (lang === 'zh') return project.nameZh || project.name;
  if (lang === 'ru') return project.nameRu || project.name;
  if (lang === 'fa') return project.nameFa || project.name;
  if (lang === 'fr') return project.nameFr || project.name;
  return project.name;
};

export const localizedDistrict = (project, lang) => {
  const fallback = districtLabel(project.district, lang);
  if (lang === 'ar') return project.districtAr || fallback;
  if (lang === 'zh') return project.districtZh || fallback;
  if (lang === 'ru') return project.districtRu || fallback;
  if (lang === 'fa') return project.districtFa || fallback;
  if (lang === 'fr') return project.districtFr || fallback;
  return project.district;
};

// Per-language WhatsApp numbers.
// Stored without the leading `+` so they drop into wa.me directly.
export const WHATSAPP_NUMBERS = {
  en: '905355206339',   // Istanbul line
  ar: '966500110830',   // Jeddah line
  zh: '905355206339',   // Istanbul (placeholder until China line is live)
  ru: '905355206339',   // Istanbul
  fa: '905355206339',   // Istanbul
  fr: '905355206339',   // Istanbul
};
export const DEFAULT_WHATSAPP = WHATSAPP_NUMBERS.en;

export const WHATSAPP_DEFAULT_MESSAGES = {
  en: "Hello, I'm interested in investing in Turkish real estate through Gate International. Can you help me?",
  ar: 'مرحباً، أنا مهتم بالاستثمار العقاري في تركيا عبر Gate International. هل يمكنك مساعدتي؟',
  zh: '您好,我对通过 Gate International 投资土耳其房地产感兴趣。您能帮助我吗?',
  ru: 'Здравствуйте, меня интересует инвестиция в недвижимость Турции через Gate International.',
  fa: 'سلام، من به سرمایه‌گذاری در املاک ترکیه از طریق Gate International علاقه‌مندم.',
  fr: "Bonjour, je suis intéressé par l'investissement immobilier en Turquie via Gate International.",
};

export const whatsappNumber = (lang) => WHATSAPP_NUMBERS[lang] || DEFAULT_WHATSAPP;

// Accept (text, lang) or (text) for back-compat.
export const whatsappLink = (text, lang) => {
  const num = whatsappNumber(lang);
  return `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');
