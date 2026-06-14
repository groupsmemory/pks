import type { MetadataRoute } from 'next';
import { getDb } from '@/src/lib/db';

const siteUrl = process.env.APP_URL || 'https://pkspamekasan.id';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteUrl, changeFrequency: 'weekly', priority: 1.0 },
  { url: `${siteUrl}/berita`, changeFrequency: 'hourly', priority: 0.9 },
  { url: `${siteUrl}/agenda`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${siteUrl}/galeri`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/donasi`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${siteUrl}/profil`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${siteUrl}/rki`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${siteUrl}/sowan-kyai`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${siteUrl}/kebijakan-privasi`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/syarat-ketentuan`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/kontak`, changeFrequency: 'yearly', priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [...staticRoutes];

  if (process.env.DATABASE_URL) {
    try {
      const sql = getDb();

      const beritaSlugs = await sql`
        SELECT slug, updated_at FROM berita ORDER BY updated_at DESC LIMIT 500
      ` as { slug: string; updated_at: string }[];

      for (const row of beritaSlugs) {
        entries.push({
          url: `${siteUrl}/berita/${row.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
          lastModified: new Date(row.updated_at),
        });
      }

      const agendaSlugs = await sql`
        SELECT slug, date FROM agenda ORDER BY date DESC LIMIT 500
      ` as { slug: string; date: string }[];

      for (const row of agendaSlugs) {
        entries.push({
          url: `${siteUrl}/agenda/${row.slug}`,
          changeFrequency: 'weekly',
          priority: 0.6,
          lastModified: new Date(row.date),
        });
      }
    } catch {
    }
  }

  return entries;
}
