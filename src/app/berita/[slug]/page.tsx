import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/src/lib/db';
import ShareButtons from '@/src/app/components/ShareButtons';

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
  tags: { name: string; slug: string }[];
}

async function getBerita(slug: string): Promise<BeritaDetail | null> {
  if (!process.env.DATABASE_URL) return null;

  const sql = getDb();
  const rows = await sql`
    SELECT b.*,
      COALESCE(
        (SELECT json_agg(json_build_object('name', t.name, 'slug', t.slug) ORDER BY t.name)
         FROM berita_tags bt JOIN tags t ON t.id = bt.tag_id
         WHERE bt.berita_id = b.id),
        '[]'::json
      ) AS tags
    FROM berita b WHERE b.slug = ${slug} LIMIT 1
  `;
  return (rows as BeritaDetail[])[0] || null;
}

export const revalidate = 60;

interface RelatedBerita {
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string;
}

async function getRelatedBerita(item: BeritaDetail): Promise<RelatedBerita[]> {
  if (!process.env.DATABASE_URL || item.tags.length === 0) return [];

  const sql = getDb();
  const tagSlugs = item.tags.map((t) => t.slug);
  const placeholders = tagSlugs.map((_, i) => `$${i + 2}`).join(', ');
  const params: (string | number)[] = [item.slug, ...tagSlugs];
  const rows = await sql.query(`
    SELECT b.title, b.slug, b.excerpt, b.image_url, b.published_at
    FROM berita b
    JOIN berita_tags bt ON bt.berita_id = b.id
    JOIN tags t ON t.id = bt.tag_id
    WHERE t.slug IN (${placeholders})
      AND b.slug != $1
    GROUP BY b.id, b.title, b.slug, b.excerpt, b.image_url, b.published_at
    ORDER BY COUNT(*) DESC, b.published_at DESC
    LIMIT 3
  `, params);
  return rows as RelatedBerita[];
}

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

  const related = await getRelatedBerita(item);

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

        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold leading-tight mb-4">
          {item.title}
        </h1>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/berita?tag=${tag.slug}`}
                className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-100 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="prose prose-gray max-w-none leading-relaxed whitespace-pre-wrap">
          {item.content}
        </div>

        <hr className="my-8 border-gray-200" />

        <ShareButtons title={item.title} />

        {related.length > 0 && (
          <section className="mt-12">
            <hr className="mb-8 border-gray-200" />
            <h2 className="text-[1.375em] font-extrabold mb-6">Berita Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/berita/${r.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {r.image_url ? (
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      <Image
                        src={r.image_url}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <span className="text-2xl text-white/60" aria-hidden="true">📰</span>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[10px] text-gray-500 mb-1">
                      {new Date(r.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                    <h3 className="text-sm font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{r.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
