import { getDb } from '@/src/lib/db';
import { BeritaForm, BeritaDeleteForm } from './BeritaClient';
import EmptyState from '@/src/components/EmptyState';
import { encodeCursor, decodeCursor } from '@/src/lib/pagination';

interface BeritaRow {
  id: string;
  title: string;
  slug: string;
  author: string;
  published_at: string;
}

const PAGE_SIZE = 15;

async function getBeritaList(params: {
  cursor?: string;
  dir?: string;
}): Promise<{ data: BeritaRow[]; nextCursor: string | null; prevCursor: string | null }> {
  if (!process.env.DATABASE_URL) return { data: [], nextCursor: null, prevCursor: null };

  const sql = getDb();

  let rows: BeritaRow[];
  if (params.cursor && params.dir === 'prev') {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    const sub = await sql`
      SELECT id, title, slug, author, published_at
      FROM berita
      WHERE (published_at, id) > (${cursorDate}::timestamptz, ${cursorId}::uuid)
      ORDER BY published_at ASC, id ASC
      LIMIT ${PAGE_SIZE + 1}
    ` as BeritaRow[];
    rows = (sub as BeritaRow[]).reverse();
  } else if (params.cursor) {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    rows = await sql`
      SELECT id, title, slug, author, published_at
      FROM berita
      WHERE (published_at, id) < (${cursorDate}::timestamptz, ${cursorId}::uuid)
      ORDER BY published_at DESC, id DESC
      LIMIT ${PAGE_SIZE + 1}
    ` as BeritaRow[];
  } else {
    rows = await sql`
      SELECT id, title, slug, author, published_at
      FROM berita
      ORDER BY published_at DESC, id DESC
      LIMIT ${PAGE_SIZE + 1}
    ` as BeritaRow[];
  }

  const hasMore = rows.length > PAGE_SIZE;
  if (hasMore) rows.pop();

  const nextCursor = rows.length > 0
    ? encodeCursor(rows[rows.length - 1].published_at, rows[rows.length - 1].id)
    : null;
  const prevCursor = params.cursor && rows.length > 0
    ? encodeCursor(rows[0].published_at, rows[0].id)
    : null;

  return { data: rows, nextCursor, prevCursor };
}

export default async function AdminBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; dir?: string }>;
}) {
  const { cursor, dir } = await searchParams;
  const { data, nextCursor, prevCursor } = await getBeritaList({ cursor, dir });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Kelola Berita</h1>
          <p className="text-sm text-gray-600 mt-1">{data.length} berita</p>
        </div>
      </div>

      <BeritaForm />

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message="Belum ada berita."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Judul</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Penulis</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
                    <td className="px-4 py-3 text-gray-600">{row.author}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(row.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <BeritaDeleteForm id={row.id} />
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
                  href={`/admin/dashboard/berita?cursor=${prevCursor}&dir=prev`}
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
                  href={`/admin/dashboard/berita?cursor=${nextCursor}&dir=next`}
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
