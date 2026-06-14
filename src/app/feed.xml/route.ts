import { getDb } from '@/src/lib/db';

const siteUrl = process.env.APP_URL || 'https://pkspamekasan.id';

interface BeritaItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  published_at: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildRss(items: BeritaItem[]): string {
  const now = new Date().toUTCString();

  const itemXml = items
    .map((item) => {
      const link = `${siteUrl}/berita/${item.slug}`;
      const pubDate = new Date(item.published_at).toUTCString();
      const description = item.excerpt || item.title;

      let mediaTag = '';
      if (item.image_url) {
        mediaTag = `\n      <media:content url="${escapeXml(item.image_url)}" medium="image" />`;
      }

      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(item.author)}</author>
      <pubDate>${pubDate}</pubDate>${mediaTag}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>DPD PKS Kabupaten Pamekasan — Berita</title>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Kumpulan berita, rilis pers, dan informasi terbaru dari DPD PKS Kabupaten Pamekasan.</description>
    <language>id</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>60</ttl>${itemXml}
  </channel>
</rss>`;
}

export async function GET(): Promise<Response> {
  if (!process.env.DATABASE_URL) {
    return new Response('', { status: 404 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, slug, content, excerpt, image_url, author, published_at
      FROM berita
      ORDER BY published_at DESC
      LIMIT 20
    ` as BeritaItem[];

    const xml = buildRss(rows);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch {
    return new Response('', { status: 500 });
  }
}
