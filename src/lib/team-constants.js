// Client-safe constants + helpers for the team system. No server-only deps here
// so this module can be imported from both server and client components.

export const OFFICES = ['istanbul', 'jeddah', 'china', 'russian-desk', 'persian-desk', 'french-desk', 'remote'];
export const OFFICE_GROUP_ORDER = ['istanbul', 'jeddah', 'china', 'russian-desk', 'persian-desk', 'french-desk'];

export const OFFICE_FLAGS = {
  istanbul: '🇹🇷',
  jeddah: '🇸🇦',
  china: '🇨🇳',
  'russian-desk': '🇷🇺',
  'persian-desk': '🇮🇷',
  'french-desk': '🇫🇷',
  remote: '🌍',
};

export const LANG_OFFICE_PRIORITY = {
  en: ['istanbul', 'jeddah'],
  ar: ['jeddah', 'istanbul'],
  zh: ['china', 'istanbul'],
  ru: ['russian-desk', 'istanbul'],
  fa: ['persian-desk', 'istanbul'],
  fr: ['french-desk', 'istanbul'],
};

export const LANG_FLAGS = {
  tr: '🇹🇷',
  en: '🇬🇧',
  ar: '🇸🇦',
  zh: '🇨🇳',
  ru: '🇷🇺',
  fa: '🇮🇷',
  fr: '🇫🇷',
};

export const ALL_LANGUAGES = ['tr', 'en', 'ar', 'zh', 'ru', 'fa', 'fr'];

export function localizedTitle(member, lang) {
  return member[`title_${lang}`] || member.title_en || '';
}

export function sortTeamForLang(team, lang) {
  const priority = LANG_OFFICE_PRIORITY[lang] || ['istanbul'];
  const score = (m) => {
    const i = priority.indexOf(m.office);
    return i === -1 ? 999 : i;
  };
  return [...team].sort((a, b) => score(a) - score(b) || a.sort_order - b.sort_order);
}
