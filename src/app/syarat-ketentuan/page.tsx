import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — DPD PKS Pamekasan',
  description: 'Syarat dan ketentuan penggunaan portal resmi DPD PKS Kabupaten Pamekasan.',
};

export default function SyaratKetentuanPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-6">Syarat &amp; Ketentuan</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-[1.25em] font-bold mb-2">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan mengakses dan menggunakan portal resmi DPD PKS Kabupaten Pamekasan, Anda menyatakan
              telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">2. Layanan Portal</h2>
            <p>Portal ini menyediakan layanan berikut kepada masyarakat:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Informasi profil kepemimpinan dan struktur partai</li>
              <li>Berita dan rilis pers resmi</li>
              <li>Agenda dan jadwal kegiatan</li>
              <li>Galeri dokumentasi kegiatan</li>
              <li>Formulir aspirasi masyarakat (E-Aspirasi)</li>
              <li>Registrasi Kartu Tanda Anggota (KTA) online</li>
              <li>Donasi dan infak online</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">3. Tanggung Jawab Pengguna</h2>
            <p>
              Pengguna bertanggung jawab penuh atas keakuratan data yang disampaikan melalui formulir di
              portal ini. Pengguna dilarang menyampaikan informasi palsu, menyesatkan, atau melanggar hukum.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">4. Kekayaan Intelektual</h2>
            <p>
              Seluruh konten yang tersedia di portal ini, termasuk teks, gambar, logo, dan video, adalah
              milik DPD PKS Kabupaten Pamekasan dan dilindungi oleh undang-undang hak cipta.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">5. Batasan Tanggung Jawab</h2>
            <p>
              DPD PKS Kabupaten Pamekasan tidak bertanggung jawab atas kerugian langsung atau tidak langsung
              yang timbul dari penggunaan portal ini. Kami berusaha menjaga ketersediaan layanan, namun tidak
              menjamin bahwa portal bebas dari gangguan teknis.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">6. Perubahan Layanan</h2>
            <p>
              Kami berhak mengubah, menangguhkan, atau menghentikan sebagian atau seluruh layanan portal
              tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">7. Hukum yang Berlaku</h2>
            <p>
              Syarat dan ketentuan ini diatur oleh hukum Negara Kesatuan Republik Indonesia. Setiap
              sengketa yang timbul akan diselesaikan melalui musyawarah atau jalur hukum yang berlaku.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
