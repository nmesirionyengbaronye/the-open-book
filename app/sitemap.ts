import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Sitemap.
 *
 * `lastModified` is derived from the build date rather than `new Date()` on every
 * request, so crawlers see a stable value for unchanged pages instead of a
 * permanently "fresh" timestamp that trains them to ignore the field.
 *
 * Only indexable, public pages are listed. /admin, /api, /r/[code], /dashboard,
 * /retrieve, /rewards, /feedback and /data-deletion are excluded deliberately —
 * see each page's robots directive for why.
 */

const lastModified = new Date();

/** Rough crawl priority. Home and the money pages first. */
function page(path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly') {
  return {
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    page('/', 1.0, 'daily'),
    page('/join', 0.9, 'daily'),
    page('/creators', 0.9, 'weekly'),
    page('/about', 0.7, 'monthly'),
    page('/status', 0.6, 'daily'),
    page('/leaderboard', 0.6, 'daily'),
    page('/milestones', 0.5, 'weekly'),
    page('/winners', 0.4, 'weekly'),
    page('/contact', 0.5, 'monthly'),
    page('/terms', 0.3, 'monthly'),
    page('/privacy', 0.3, 'monthly'),
  ];
}