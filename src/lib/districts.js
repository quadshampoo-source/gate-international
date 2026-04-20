// Centralised district-name translations for all 6 languages.
// EN is the canonical key; other locales are looked up via districtLabel(name, lang).

export const DISTRICT_NAMES = {
  Sariyer:       { ar: 'ساريير',       zh: '萨里耳',     ru: 'Сарыер',       fa: 'ساری‌یر',    fr: 'Sarıyer' },
  'Beşiktaş':    { ar: 'بشكتاش',       zh: '贝什塔什',   ru: 'Бешикташ',     fa: 'بشیکتاش',    fr: 'Beşiktaş' },
  'Beyoğlu':     { ar: 'بي أوغلو',     zh: '贝尤卢',     ru: 'Бейоглу',      fa: 'بی‌اوغلو',   fr: 'Beyoğlu' },
  'Şişli':       { ar: 'شيشلي',        zh: '希什利',     ru: 'Шишли',        fa: 'شیشلی',      fr: 'Şişli' },
  'Üsküdar':     { ar: 'أسكدار',       zh: '乌斯库达尔', ru: 'Ускюдар',      fa: 'اسکودار',    fr: 'Üsküdar' },
  Zekeriyaköy:   { ar: 'زكرياكوي',     zh: '扎克里亚科伊', ru: 'Зекериякёй',  fa: 'زکریاکوی',   fr: 'Zekeriyaköy' },
  Maslak:        { ar: 'مسلك',         zh: '马斯拉克',   ru: 'Маслак',       fa: 'مسلک',       fr: 'Maslak' },
  Levent:        { ar: 'ليفنت',        zh: '列文特',     ru: 'Левент',       fa: 'لوانت',      fr: 'Levent' },
  Kağıthane:     { ar: 'كاياتهانه',    zh: '卡厄特哈内', ru: 'Кягытхане',    fa: 'کاغدهانه',   fr: 'Kağıthane' },
  Ataşehir:      { ar: 'أتاشهر',       zh: '阿塔谢希尔', ru: 'Аташехир',     fa: 'آتاشهیر',    fr: 'Ataşehir' },
  'Göktürk':     { ar: 'غوكتورك',      zh: '戈克蒂尔克', ru: 'Гёктюрк',      fa: 'گوک‌تورک',   fr: 'Göktürk' },
  'Güneşli':     { ar: 'جونشلي',       zh: '居内什利',   ru: 'Гюнешли',      fa: 'گونشلی',     fr: 'Güneşli' },
  Bodrum:        { ar: 'بودروم',       zh: '博德鲁姆',   ru: 'Бодрум',       fa: 'بدروم',      fr: 'Bodrum' },
  Bursa:         { ar: 'بورصة',        zh: '布尔萨',     ru: 'Бурса',        fa: 'بورسا',      fr: 'Bursa' },
  'Çekmeköy':    { ar: 'تشكمه كوي',    zh: '切克梅柯伊', ru: 'Чекмекёй',     fa: 'چکمه‌کوی',   fr: 'Çekmeköy' },
};

export const districtLabel = (district, lang) => {
  if (!district) return district;
  if (lang === 'en' || !lang) return district;
  return DISTRICT_NAMES[district]?.[lang] || district;
};
