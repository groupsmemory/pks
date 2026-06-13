import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/src/lib/db';
import EmptyState from '@/src/components/EmptyState';

export const metadata: Metadata = {
  title: 'Berita — DPD PKS Pamekasan',
  description: 'Kumpulan berita, rilis pers, dan informasi terbaru dari DPD PKS Kabupaten Pamekasan.',
};

interface BeritaRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: string;
  published_at: string;
}

async function getBeritaList(): Promise<BeritaRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT id, title, slug, excerpt, image_url, author, published_at
    FROM berita ORDER BY published_at DESC LIMIT 50
  `;
  return rows as BeritaRow[];
}

export default async function BeritaPage() {
  const data = await getBeritaList();

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-2">Berita</h1>
        <p className="text-gray-600 mb-8">Informasi dan rilis pers terbaru DPD PKS Pamekasan</p>

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
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
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
