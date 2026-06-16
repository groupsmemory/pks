import SafeImage from '@/src/components/SafeImage';
import { getDb } from '@/src/lib/db';
import { GaleriForm, GaleriDeleteForm } from './GaleriClient';
import EmptyState from '@/src/components/EmptyState';
import { encodeCursor, decodeCursor } from '@/src/lib/pagination';

interface GaleriRow {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
}

const PAGE_SIZE = 12;

async function getGaleriList(params: {
  cursor?: string;
  dir?: string;
}): Promise<{ data: GaleriRow[]; nextCursor: string | null; prevCursor: string | null }> {
  if (!process.env.DATABASE_URL) return { data: [], nextCursor: null, prevCursor: null };

  const sql = getDb();

  let rows: GaleriRow[];
  if (params.cursor && params.dir === 'prev') {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    const sub = await sql`
      SELECT id, title, image_url, category, created_at
      FROM galeri
      WHERE (created_at, id) > (${cursorDate}::timestamptz, ${cursorId}::uuid)
      ORDER BY created_at ASC, id ASC
      LIMIT ${PAGE_SIZE + 1}
    ` as GaleriRow[];
    rows = (sub as GaleriRow[]).reverse();
  } else if (params.cursor) {
    const [cursorDate, cursorId] = decodeCursor(params.cursor);
    rows = await sql`
      SELECT id, title, image_url, category, created_at
      FROM galeri
      WHERE (created_at, id) < (${cursorDate}::timestamptz, ${cursorId}::uuid)
      ORDER BY created_at DESC, id DESC
      LIMIT ${PAGE_SIZE + 1}
    ` as GaleriRow[];
  } else {
    rows = await sql`
      SELECT id, title, image_url, category, created_at
      FROM galeri
      ORDER BY created_at DESC, id DESC
      LIMIT ${PAGE_SIZE + 1}
    ` as GaleriRow[];
  }

  const hasMore = rows.length > PAGE_SIZE;
  if (hasMore) rows.pop();

  const nextCursor = rows.length > 0
    ? encodeCursor(rows[rows.length - 1].created_at, rows[rows.length - 1].id)
    : null;
  const prevCursor = params.cursor && rows.length > 0
    ? encodeCursor(rows[0].created_at, rows[0].id)
    : null;

  return { data: rows, nextCursor, prevCursor };
}

export default async function AdminGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; dir?: string }>;
}) {
  const { cursor, dir } = await searchParams;
  const { data, nextCursor, prevCursor } = await getGaleriList({ cursor, dir });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Kelola Galeri</h1>
          <p className="text-sm text-gray-600 mt-1">{data.length} foto</p>
        </div>
      </div>

      <GaleriForm />

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message="Belum ada galeri."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((row) => (
              <div key={row.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <SafeImage src={row.image_url} alt={row.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
              </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.category}</p>
                  <GaleriDeleteForm id={row.id} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {prevCursor ? (
                <a
                  href={`/admin/dashboard/galeri?cursor=${prevCursor}&dir=prev`}
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
                  href={`/admin/dashboard/galeri?cursor=${nextCursor}&dir=next`}
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
