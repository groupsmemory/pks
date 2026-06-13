import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { neon } from '@neondatabase/serverless';

interface BeritaDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  published_at: string;
  updated_at: string;
}

async function getBerita(slug: string): Promise<BeritaDetail | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT * FROM berita WHERE slug = ${slug} LIMIT 1
  `;
  return (rows as BeritaDetail[])[0] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBerita(slug);
  if (!item) return { title: 'Berita tidak ditemukan' };

  return {
    title: `${item.title} — DPD PKS Pamekasan`,
    description: item.excerpt || item.title,
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getBerita(slug);

  if (!item) notFound();

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link
          href="/berita"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6 min-h-[44px]"
        >
          ← Kembali ke Berita
        </Link>

        {item.image_url && (
          <div className="rounded-xl overflow-hidden mb-6 aspect-video bg-gray-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="text-sm text-gray-500 mb-3">
          {new Date(item.published_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
          {' — '}
          {item.author}
        </div>

        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold leading-tight mb-6">
          {item.title}
        </h1>

        <div className="prose prose-gray max-w-none leading-relaxed whitespace-pre-wrap">
          {item.content}
        </div>
      </article>
    </main>
  );
}
