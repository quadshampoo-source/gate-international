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

// Iframe attribute bundles per provider. Spread these onto the <iframe>
// element so the consumer doesn't need provider-specific branching.
const VIMEO_IFRAME_PROPS = {
  allow: 'autoplay; fullscreen; picture-in-picture; encrypted-media',
  // Vimeo's own branding-free options come from query params.
};

const YOUTUBE_IFRAME_PROPS = {
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  referrerPolicy: 'strict-origin-when-cross-origin',
  // allow-popups lets the "share/open in YouTube" controls work; without it
  // the fullscreen button in some browsers fails. Extra lockdown stays via
  // the rest of the sandbox tokens.
  sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups',
};

// Privacy-enhanced domain suppresses tracking cookies until the user hits
// play, and together with rel=0 cuts related-video carousel noise.
const YOUTUBE_HOST = 'https://www.youtube-nocookie.com';
const YOUTUBE_PARAMS = 'rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&playsinline=1';

// Returns { provider: 'vimeo' | 'youtube', embedUrl, id, iframeProps } or null.
// Respects the priority rule: Vimeo first, YouTube only if Vimeo is empty.
export function resolveVideo(project) {
  if (!project) return null;
  const vimeoId = project.vimeoId || project.vimeo_id;
  if (vimeoId) {
    return {
      provider: 'vimeo',
      id: String(vimeoId),
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`,
      iframeProps: VIMEO_IFRAME_PROPS,
    };
  }
  const youtubeId = parseYouTubeId(project.youtubeUrl || project.youtube_url);
  if (youtubeId) {
    return {
      provider: 'youtube',
      id: youtubeId,
      embedUrl: `${YOUTUBE_HOST}/embed/${youtubeId}?${YOUTUBE_PARAMS}`,
      iframeProps: YOUTUBE_IFRAME_PROPS,
    };
  }
  return null;
}
