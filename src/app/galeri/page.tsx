import type { Metadata } from 'next';
import SafeImage from '@/src/components/SafeImage';
import { getDb } from '@/src/lib/db';
import EmptyState from '@/src/components/EmptyState';

export const metadata: Metadata = {
  title: 'Galeri — DPD PKS Pamekasan',
  description: 'Galeri foto dan dokumentasi kegiatan DPD PKS Kabupaten Pamekasan.',
  openGraph: {
    title: 'Galeri — DPD PKS Pamekasan',
    description: 'Galeri foto dan dokumentasi kegiatan DPD PKS Kabupaten Pamekasan.',
  },
  twitter: {
    title: 'Galeri — DPD PKS Pamekasan',
    description: 'Galeri foto dan dokumentasi kegiatan DPD PKS Kabupaten Pamekasan.',
  },
};

interface GaleriRow {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  created_at: string;
}

async function getGaleriList(): Promise<GaleriRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT id, title, description, image_url, category, created_at
    FROM galeri ORDER BY created_at DESC LIMIT 100
  `;
  return rows as GaleriRow[];
}

export default async function GaleriPage() {
  const data = await getGaleriList();

  const categories = [...new Set(data.map((item) => item.category))];

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-2">Galeri</h1>
        <p className="text-gray-600 mb-8">Dokumentasi foto kegiatan DPD PKS Pamekasan</p>

        {data.length === 0 ? (
          <EmptyState message="Belum ada galeri." />
        ) : (
          <>
            {categories.map((cat) => {
              const items = data.filter((item) => item.category === cat);
              return (
                <section key={cat} className="mb-10">
                  <h2 className="text-[1.25em] font-bold mb-4">{cat}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                      >
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <SafeImage
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}
