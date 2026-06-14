import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/src/lib/db';

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
  if (!process.env.DATABASE_URL) return null;

  const sql = getDb();
  const rows = await sql`
    SELECT * FROM berita WHERE slug = ${slug} LIMIT 1
  `;
  return (rows as BeritaDetail[])[0] || null;
}

export const revalidate = 60;

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT slug FROM berita ORDER BY published_at DESC LIMIT 50
  `;
  return (rows as { slug: string }[]).map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBerita(slug);
  if (!item) return { title: 'Berita tidak ditemukan' };

  const ogImage = item.image_url
    ? { url: item.image_url, width: 1200, height: 630, alt: item.title }
    : undefined;

  return {
    title: `${item.title} — DPD PKS Pamekasan`,
    description: item.excerpt || item.title,
    openGraph: {
      title: `${item.title} — DPD PKS Pamekasan`,
      description: item.excerpt || item.title,
      type: 'article',
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} — DPD PKS Pamekasan`,
      description: item.excerpt || item.title,
      images: ogImage ? [ogImage.url] : undefined,
    },
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
          <div className="relative rounded-xl overflow-hidden mb-6 aspect-video bg-gray-100">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
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
