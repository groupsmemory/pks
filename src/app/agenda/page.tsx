import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/src/lib/db';
import EmptyState from '@/src/components/EmptyState';

export const metadata: Metadata = {
  title: 'Agenda — DPD PKS Pamekasan',
  description: 'Jadwal kegiatan dan agenda DPD PKS Kabupaten Pamekasan.',
};

interface AgendaRow {
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

async function getAgendaList(): Promise<AgendaRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT id, title, slug, description, date, time_start, time_end, location, image_url
    FROM agenda ORDER BY date DESC LIMIT 50
  `;
  return rows as AgendaRow[];
}

export default async function AgendaPage() {
  const data = await getAgendaList();
  const now = new Date();
  const upcoming = data.filter((a) => new Date(a.date) >= now);
  const past = data.filter((a) => new Date(a.date) < now);

  function renderCard(item: AgendaRow) {
    const eventDate = new Date(item.date);
    const isPast = eventDate < now;

    return (
      <Link
        key={item.id}
        href={`/agenda/${item.slug}`}
        className={`group rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isPast ? 'opacity-70' : ''}`}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-32 bg-blue-600 text-white p-4 text-center flex sm:flex-col items-center justify-center gap-1">
            <span className="text-[1.75em] font-extrabold">
              {eventDate.toLocaleDateString('id-ID', { day: 'numeric' })}
            </span>
            <span className="text-sm uppercase opacity-90">
              {eventDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex-1 p-4">
            <h2 className="font-bold text-[1.125em] group-hover:text-blue-600 transition-colors">
              {item.title}
            </h2>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
              {item.location && (
                <span className="flex items-center gap-1">📍 {item.location}</span>
              )}
              {item.time_start && (
                <span className="flex items-center gap-1">🕐 {item.time_start}{item.time_end ? ` - ${item.time_end}` : ''}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-2">Agenda</h1>
        <p className="text-gray-600 mb-8">Jadwal kegiatan DPD PKS Pamekasan</p>

        {data.length === 0 ? (
          <EmptyState message="Belum ada agenda." />
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-10">
                <h2 className="text-[1.25em] font-bold mb-4 flex items-center gap-2">
                  <span aria-hidden="true">🗓️</span> Agenda Mendatang
                </h2>
                <div className="space-y-4">{upcoming.map(renderCard)}</div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-[1.25em] font-bold mb-4 flex items-center gap-2">
                  <span aria-hidden="true">📋</span> Agenda Sebelumnya
                </h2>
                <div className="space-y-4">{past.map(renderCard)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
