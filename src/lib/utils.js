export const fmtUsd = (n) => {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 2) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n;
};

export const localizedName = (project, lang) => {
  if (lang === 'ar') return project.nameAr || project.name;
  if (lang === 'zh') return project.nameZh || project.name;
  return project.name;
};

export const localizedDistrict = (project, lang) => {
  if (lang === 'ar') return project.districtAr || project.district;
  if (lang === 'zh') return project.districtZh || project.district;
  return project.district;
};

export const WHATSAPP_NUMBER = '902120001453';
export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const cn = (...classes) => classes.filter(Boolean).join(' ');
