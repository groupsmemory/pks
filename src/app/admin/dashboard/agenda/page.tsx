import { getDb } from '@/src/lib/db';
import { AgendaForm, AgendaDeleteForm } from './AgendaClient';
import EmptyState from '@/src/components/EmptyState';

interface AgendaRow {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string | null;
}

async function getAgendaList(): Promise<AgendaRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT id, title, slug, date, location
    FROM agenda ORDER BY date DESC LIMIT 100
  `;
  return rows as AgendaRow[];
}

export default async function AdminAgendaPage() {
  const data = await getAgendaList();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Kelola Agenda</h1>
          <p className="text-sm text-gray-600 mt-1">{data.length} agenda</p>
        </div>
      </div>

      <AgendaForm />

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message="Belum ada agenda."
        />
      ) : (
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
      )}
    </div>
  );
}
