import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.uniui.com.ng';
  const lastModified = new Date();

  return [
    { url: `${baseUrl}/`, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/join`, lastModified },
    { url: `${baseUrl}/retrieve`, lastModified },
    { url: `${baseUrl}/leaderboard`, lastModified },
    { url: `${baseUrl}/status`, lastModified },
    { url: `${baseUrl}/milestones`, lastModified },
  ];
}