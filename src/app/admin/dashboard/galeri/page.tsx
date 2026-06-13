import { neon } from '@neondatabase/serverless';
import { GaleriForm, GaleriDeleteForm } from './GaleriClient';

interface GaleriRow {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
}

async function getGaleriList(): Promise<GaleriRow[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT id, title, image_url, category, created_at
    FROM galeri ORDER BY created_at DESC LIMIT 100
  `;
  return rows as GaleriRow[];
}

export default async function AdminGaleriPage() {
  const data = await getGaleriList();

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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Belum ada galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((row) => (
            <div key={row.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img src={row.image_url} alt={row.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{row.title}</p>
                <p className="text-xs text-gray-500">{row.category}</p>
                <GaleriDeleteForm id={row.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
