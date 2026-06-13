import { neon } from '@neondatabase/serverless';
import { BeritaForm, BeritaDeleteForm } from './BeritaClient';

interface BeritaRow {
  id: string;
  title: string;
  slug: string;
  author: string;
  published_at: string;
}

async function getBeritaList(): Promise<BeritaRow[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT id, title, slug, author, published_at
    FROM berita ORDER BY published_at DESC LIMIT 100
  `;
  return rows as BeritaRow[];
}

export default async function AdminBeritaPage() {
  const data = await getBeritaList();

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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Belum ada berita.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
