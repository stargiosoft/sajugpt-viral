import type { MetadataRoute } from 'next';

const BASE_URL = 'https://sajugpt-viral.vercel.app';

const ROUTES = [
  '',
  '/ghost-tarot',
  '/romance-ghost-tarot',
  '/sexy-battle',
  '/oheng',
  '/love-chat',
  '/money-timeline',
  '/deang-saju',
  '/solo-guide',
  '/court',
  '/gisaeng',
  '/dating-sim',
  '/night-manual',
  '/stock',
  '/autopsy',
  '/about',
  '/partner',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));
}
