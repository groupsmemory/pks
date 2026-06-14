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
  tags: string[];
}

const PAGE_SIZE = 15;

async function getBeritaList(params: {
  cursor?: string;
  dir?: string;
}): Promise<{ data: BeritaRow[]; nextCursor: string | null; prevCursor: string | null }> {
  if (!process.env.DATABASE_URL) return { data: [], nextCursor: null, prevCursor: null };

  const sql = getDb();

  const baseSelect = `b.id, b.title, b.slug, b.author, b.published_at,
    COALESCE(
      (SELECT array_agg(t.name ORDER BY t.name) FROM berita_tags bt
       JOIN tags t ON t.id = bt.tag_id
       WHERE bt.berita_id = b.id),
      '{}'
    ) AS tags`;

  let rows: BeritaRow[];
  if (params.cursor && params.dir === 'prev') {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    const sub = await sql.query(`
      SELECT ${baseSelect}
      FROM berita b
      WHERE (b.published_at, b.id) > ($1::timestamptz, $2::uuid)
      ORDER BY b.published_at ASC, b.id ASC
      LIMIT $3
    `, [cursorDate, cursorId, PAGE_SIZE + 1]);
    rows = (sub as BeritaRow[]).reverse();
  } else if (params.cursor) {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    rows = await sql.query(`
      SELECT ${baseSelect}
      FROM berita b
      WHERE (b.published_at, b.id) < ($1::timestamptz, $2::uuid)
      ORDER BY b.published_at DESC, b.id DESC
      LIMIT $3
    `, [cursorDate, cursorId, PAGE_SIZE + 1]) as BeritaRow[];
  } else {
    rows = await sql.query(`
      SELECT ${baseSelect}
      FROM berita b
      ORDER BY b.published_at DESC, b.id DESC
      LIMIT $1
    `, [PAGE_SIZE + 1]) as BeritaRow[];
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
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tags</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal</th>
                  <th scope="col" className="px-4 py-3 font-bold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
                    <td className="px-4 py-3 text-gray-600">{row.author}</td>
                    <td className="px-4 py-3">
                      {row.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {row.tags.map((tag) => (
                            <span key={tag} className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
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
