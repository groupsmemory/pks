import AspirasiForm from '@/src/app/components/AspirasiForm';
import KtaForm from '@/src/app/components/KtaForm';
import HeroSection from '@/src/app/components/HeroSection';
import QuickStats from '@/src/app/components/QuickStats';
import SidebarKunjungi from '@/src/app/components/SidebarKunjungi';
import { getDb } from '@/src/lib/db';

interface BeritaRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: string;
  published_at: string;
}

async function getLatestBerita(limit: number): Promise<BeritaRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT id, title, slug, excerpt, image_url, author, published_at
    FROM berita ORDER BY published_at DESC LIMIT ${limit}
  `;
  return rows as BeritaRow[];
}

export default async function HomePage() {
  const allBerita = await getLatestBerita(15);
  const heroBerita = allBerita.slice(0, 5);
  const featuredBerita = allBerita.slice(5, 8);
  const latestBerita = allBerita.slice(8);

  return (
    <main className="min-h-screen">
      <HeroSection berita={heroBerita} />

      <QuickStats />

      {/* Section: Berita Pilihan */}
      {featuredBerita.length > 0 && (
        <section aria-labelledby="heading-berita-pilihan" className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="heading-berita-pilihan" className="text-[1.375em] sm:text-[1.75em] font-extrabold">
                  Berita Pilihan
                </h2>
                <p className="text-gray-500 mt-1">Sorotan informasi dan liputan utama</p>
              </div>
              <a
                href="/berita"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg px-3 py-2"
              >
                Lihat Semua
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBerita.map((item, i) => (
                <a
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className={`group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                    i === 0 ? 'md:col-span-2 md:row-span-1' : ''
                  }`}
                >
                  <div className={`${i === 0 ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[16/9]'} bg-gray-100 overflow-hidden`}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <span className="text-5xl text-white/40" aria-hidden="true">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <p className="text-xs text-blue-200 mb-1">
                      {new Date(item.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <h3 className={`font-bold text-white group-hover:underline line-clamp-2 ${
                      i === 0 ? 'text-[1.25em] lg:text-[1.5em]' : 'text-[1.0625em] lg:text-[1.125em]'
                    }`}>
                      {item.title}
                    </h3>
                    {item.excerpt && i === 0 && (
                      <p className="text-sm text-gray-200 mt-2 line-clamp-2 hidden sm:block">
                        {item.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-gray-300 mt-2">— {item.author}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section: Layanan + Sidebar */}
      <section aria-labelledby="heading-layanan">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Formulir Aspirasi Masyarakat */}
              <div id="heading-aspirasi">
                <AspirasiForm />
              </div>

              <hr className="border-current opacity-30" />

              {/* Registrasi KTA Online */}
              <div id="heading-kta">
                <KtaForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <SidebarKunjungi />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Berita Terkini */}
      <section aria-labelledby="heading-berita-terkini" className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="heading-berita-terkini" className="text-[1.375em] sm:text-[1.75em] font-extrabold">
                Berita Terkini
              </h2>
              <p className="text-gray-500 mt-1">Informasi dan rilis terbaru DPD PKS Kabupaten Pamekasan</p>
            </div>
            <a
              href="/berita"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg px-3 py-2"
            >
              Lihat Semua
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {latestBerita.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Belum ada berita.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBerita.map((item) => (
                <a
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {item.image_url ? (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <span className="text-4xl text-white/60" aria-hidden="true">📰</span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(item.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <h3 className="font-bold text-[1.125em] group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.excerpt}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">— {item.author}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <a
              href="/berita"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg px-3 py-2"
            >
              Lihat Semua Berita
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
