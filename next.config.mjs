/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      // Supabase Storage — team photos, project photos, gallery uploads.
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
  experimental: {
    // Hero banner uploads can be a few MB. Default Server Action body
    // limit is 1 MB and large uploads silently fail — bump to 10 MB to
    // match the 8 MB max enforced inside the action.
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
