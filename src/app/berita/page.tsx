import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/src/lib/db';
import EmptyState from '@/src/components/EmptyState';

export const metadata: Metadata = {
  title: 'Berita — DPD PKS Pamekasan',
  description: 'Kumpulan berita, rilis pers, dan informasi terbaru dari DPD PKS Kabupaten Pamekasan.',
  openGraph: {
    title: 'Berita — DPD PKS Pamekasan',
    description: 'Kumpulan berita, rilis pers, dan informasi terbaru dari DPD PKS Kabupaten Pamekasan.',
  },
  twitter: {
    title: 'Berita — DPD PKS Pamekasan',
    description: 'Kumpulan berita, rilis pers, dan informasi terbaru dari DPD PKS Kabupaten Pamekasan.',
  },
};

interface BeritaRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: string;
  published_at: string;
  tags: string[];
}

interface TagRow {
  slug: string;
  name: string;
  count: number;
}

async function getAllTags(): Promise<TagRow[]> {
  if (!process.env.DATABASE_URL) return [];
  const sql = getDb();
  const rows = await sql`
    SELECT t.slug, t.name, COUNT(bt.berita_id)::int AS count
    FROM tags t
    JOIN berita_tags bt ON bt.tag_id = t.id
    GROUP BY t.id, t.slug, t.name
    ORDER BY count DESC
  `;
  return rows as TagRow[];
}

async function getBeritaList(tagSlug?: string): Promise<BeritaRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  let rows: BeritaRow[];

  if (tagSlug) {
    rows = (await sql`
      SELECT b.id, b.title, b.slug, b.excerpt, b.image_url, b.author, b.published_at,
        COALESCE(
          (SELECT array_agg(t.name ORDER BY t.name) FROM berita_tags bt2
           JOIN tags t ON t.id = bt2.tag_id
           WHERE bt2.berita_id = b.id),
          '{}'
        ) AS tags
      FROM berita b
      JOIN berita_tags bt ON bt.berita_id = b.id
      JOIN tags t ON t.id = bt.tag_id
      WHERE t.slug = ${tagSlug}
      ORDER BY b.published_at DESC
      LIMIT 50
    `) as BeritaRow[];
  } else {
    rows = (await sql`
      SELECT b.id, b.title, b.slug, b.excerpt, b.image_url, b.author, b.published_at,
        COALESCE(
          (SELECT array_agg(t.name ORDER BY t.name) FROM berita_tags bt2
           JOIN tags t ON t.id = bt2.tag_id
           WHERE bt2.berita_id = b.id),
          '{}'
        ) AS tags
      FROM berita b
      ORDER BY b.published_at DESC
      LIMIT 50
    `) as BeritaRow[];
  }

  return rows;
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [data, allTags] = await Promise.all([getBeritaList(tag), getAllTags()]);

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-2">Berita</h1>
        <p className="text-gray-600 mb-6">Informasi dan rilis pers terbaru DPD PKS Pamekasan</p>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Link
              href="/berita"
              className={`inline-flex items-center min-h-[36px] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 ${!tag ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Semua
            </Link>
            {allTags.map((t) => (
              <Link
                key={t.slug}
                href={`/berita?tag=${t.slug}`}
                className={`inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 ${tag === t.slug ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                #{t.name}
                <span className="opacity-60">({t.count})</span>
              </Link>
            ))}
          </div>
        )}

        {tag && (
          <p className="text-sm text-gray-500 mb-4">
            Menampilkan berita dengan tag: <strong className="text-gray-800">#{allTags.find((t) => t.slug === tag)?.name || tag}</strong>
            {' — '}
            <Link href="/berita" className="text-blue-600 hover:underline">Tampilkan semua</Link>
          </p>
        )}

        {data.length === 0 ? (
          <EmptyState message="Belum ada berita." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {item.image_url ? (
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-4xl text-white/60" aria-hidden="true">📰</span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(item.published_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <h2 className="font-bold text-[1.125em] group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.excerpt}</p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tagName) => (
                        <span
                          key={tagName}
                          className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded"
                        >
                          #{tagName}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">— {item.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
