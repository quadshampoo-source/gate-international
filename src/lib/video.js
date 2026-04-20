// Video embed helpers — consumed by both the Editorial and Classic detail pages.
// Priority: Vimeo wins when present; YouTube is the fallback.

// Extracts the 11-character YouTube video id from any of the common forms:
//   https://www.youtube.com/watch?v=XYZ
//   https://youtu.be/XYZ
//   https://www.youtube.com/embed/XYZ
//   https://www.youtube.com/shorts/XYZ
//   https://m.youtube.com/watch?v=XYZ
//   XYZ         (already just an id)
export function parseYouTubeId(input) {
  if (!input) return null;
  const raw = String(input).trim();
  if (!raw) return null;
  // Bare 11-char id.
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      // /embed/XYZ or /shorts/XYZ or /v/XYZ
      const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'v');
      if (idx >= 0 && parts[idx + 1] && /^[\w-]{11}$/.test(parts[idx + 1])) return parts[idx + 1];
    }
  } catch {}
  return null;
}

// Returns { provider: 'vimeo' | 'youtube', embedUrl, id, title } or null.
// Respects the priority rule: Vimeo first, YouTube only if Vimeo is empty.
export function resolveVideo(project) {
  if (!project) return null;
  const vimeoId = project.vimeoId || project.vimeo_id;
  if (vimeoId) {
    return {
      provider: 'vimeo',
      id: String(vimeoId),
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`,
    };
  }
  const youtubeId = parseYouTubeId(project.youtubeUrl || project.youtube_url);
  if (youtubeId) {
    return {
      provider: 'youtube',
      id: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`,
    };
  }
  return null;
}
