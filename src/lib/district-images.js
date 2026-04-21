// Final-fallback imagery for the homepage "By neighbourhood" rail.
// Used only when a district has no image in the DB and no project in that
// district has a cover photo. Editors should replace these via the admin
// Districts page.
export const DEFAULT_DISTRICT_IMAGES = {
  'Sariyer':   'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Sarıyer':   'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Beşiktaş':  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85',
  'Besiktas':  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85',
  'Beyoğlu':   'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=85',
  'Beyoglu':   'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=85',
  'Şişli':     'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=85',
  'Sisli':     'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=85',
  'Üsküdar':   'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=85',
  'Uskudar':   'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=85',
  'Kadıköy':   'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85',
  'Kadikoy':   'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85',
  'Bodrum':    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=85',
  'Bursa':     'https://images.unsplash.com/photo-1542317854-b935c7dc9bb6?w=800&q=85',
  'Levent':    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85',
  'Nişantaşı': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=85',
  'Nisantasi': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=85',
  'Maslak':    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85',
  'Zekeriyaköy': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Zekeriyakoy': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Göktürk':   'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Gokturk':   'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Çekmeköy':  'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
  'Cekmekoy':  'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=85',
};

export function coverOfProject(p) {
  if (!p) return null;
  if (Array.isArray(p.exteriorImages) && p.exteriorImages[0]) return p.exteriorImages[0];
  if (Array.isArray(p.gallery) && p.gallery[0]) return p.gallery[0];
  return p.img || null;
}
