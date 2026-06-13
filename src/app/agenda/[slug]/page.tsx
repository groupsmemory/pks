import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { neon } from '@neondatabase/serverless';

interface AgendaDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  image_url: string | null;
}

async function getAgenda(slug: string): Promise<AgendaDetail | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT * FROM agenda WHERE slug = ${slug} LIMIT 1
  `;
  return (rows as AgendaDetail[])[0] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAgenda(slug);
  if (!item) return { title: 'Agenda tidak ditemukan' };

  return {
    title: `${item.title} — DPD PKS Pamekasan`,
    description: item.description || item.title,
  };
}

export default async function AgendaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAgenda(slug);

  if (!item) notFound();

  const eventDate = new Date(item.date);

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link
          href="/agenda"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6 min-h-[44px]"
        >
          ← Kembali ke Agenda
        </Link>

        {item.image_url && (
          <div className="rounded-xl overflow-hidden mb-6 aspect-video bg-gray-100">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            🗓️ {eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {item.time_start && (
            <span className="flex items-center gap-1">
              🕐 {item.time_start}{item.time_end ? ` - ${item.time_end}` : ''}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1">📍 {item.location}</span>
          )}
        </div>

        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold leading-tight mb-6">
          {item.title}
        </h1>

        {item.description && (
          <div className="text-[1.125em] leading-relaxed whitespace-pre-wrap">
            {item.description}
          </div>
        )}
      </article>
    </main>
  );
}
