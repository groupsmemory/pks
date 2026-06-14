import { getDb } from '@/src/lib/db';
import { AgendaForm, AgendaDeleteForm } from './AgendaClient';
import EmptyState from '@/src/components/EmptyState';
import { encodeCursor, decodeCursor } from '@/src/lib/pagination';

interface AgendaRow {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string | null;
}

const PAGE_SIZE = 15;

async function getAgendaList(params: {
  filter?: string;
  cursor?: string;
  dir?: string;
}): Promise<{ data: AgendaRow[]; nextCursor: string | null; prevCursor: string | null }> {
  if (!process.env.DATABASE_URL) return { data: [], nextCursor: null, prevCursor: null };

  const sql = getDb();
  const { filter = 'all' } = params;

  let baseQuery = sql`SELECT id, title, slug, date, location FROM agenda`;
  if (filter === 'upcoming') {
    baseQuery = sql`${baseQuery} WHERE date >= NOW()`;
  } else if (filter === 'past') {
    baseQuery = sql`${baseQuery} WHERE date < NOW()`;
  }

  let rows: AgendaRow[];
  if (params.cursor && params.dir === 'prev') {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    const sub = await sql`
      SELECT * FROM (${baseQuery}) sub
      WHERE (date, id) > (${cursorDate}::timestamptz, ${cursorId}::uuid)
      ORDER BY date ASC, id ASC
      LIMIT ${PAGE_SIZE + 1}
    ` as AgendaRow[];
    rows = (sub as AgendaRow[]).reverse();
  } else if (params.cursor) {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    rows = await sql`
      SELECT * FROM (${baseQuery}) sub
      WHERE (date, id) < (${cursorDate}::timestamptz, ${cursorId}::uuid)
      ORDER BY date DESC, id DESC
      LIMIT ${PAGE_SIZE + 1}
    ` as AgendaRow[];
  } else {
    rows = await sql`
      ${baseQuery}
      ORDER BY date DESC, id DESC
      LIMIT ${PAGE_SIZE + 1}
    ` as AgendaRow[];
  }

  const hasMore = rows.length > PAGE_SIZE;
  if (hasMore) rows.pop();

  const nextCursor = rows.length > 0
    ? encodeCursor(rows[rows.length - 1].date, rows[rows.length - 1].id)
    : null;
  const prevCursor = params.cursor && rows.length > 0
    ? encodeCursor(rows[0].date, rows[0].id)
    : null;

  return { data: rows, nextCursor, prevCursor };
}

export default async function AdminAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; cursor?: string; dir?: string }>;
}) {
  const { filter = 'all', cursor, dir } = await searchParams;
  const { data, nextCursor, prevCursor } = await getAgendaList({ filter, cursor, dir });

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'upcoming', label: 'Akan Datang' },
    { key: 'past', label: 'Sudah Lewat' },
  ] as const;

  const baseHref = filter === 'all' ? '/admin/dashboard/agenda' : `?filter=${filter}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Kelola Agenda</h1>
          <p className="text-sm text-gray-600 mt-1">
            {data.length} agenda
            {filter !== 'all' && (
              <span className="text-gray-400">
                {' '}(filter: {filter === 'upcoming' ? 'akan datang' : 'sudah lewat'})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={tab.key === 'all' ? '/admin/dashboard/agenda' : `?filter=${tab.key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 ${
              filter === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <AgendaForm />

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message="Belum ada agenda."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Judul</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Lokasi</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(row.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.location || '-'}</td>
                    <td className="px-4 py-3">
                      <AgendaDeleteForm id={row.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {prevCursor ? (
                <a
                  href={`${baseHref}&cursor=${prevCursor}&dir=prev`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  &larr; Sebelumnya
                </a>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                  &larr; Sebelumnya
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {nextCursor ? (
                <a
                  href={`${baseHref}&cursor=${nextCursor}&dir=next`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  Selanjutnya &rarr;
                </a>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                  Selanjutnya &rarr;
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
