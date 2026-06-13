import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — DPD PKS Pamekasan',
  description: 'Kebijakan privasi portal resmi DPD PKS Kabupaten Pamekasan.',
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-6">Kebijakan Privasi</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-[1.25em] font-bold mb-2">1. Pengumpulan Data</h2>
            <p>
              Kami mengumpulkan data pribadi yang Anda berikan secara sukarela melalui formulir di portal ini,
              termasuk nama, nomor WhatsApp, NIK, alamat kecamatan, serta isi aspirasi atau permohonan KTA.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">2. Enkripsi Data Sensitif</h2>
            <p>
              Nomor Induk Kependudukan (NIK) Anda dienkripsi menggunakan algoritma AES-256-GCM sebelum
              disimpan ke dalam database. Data enkripsi disimpan secara terpisah dan tidak dapat dibaca oleh
              pihak yang tidak berwenang.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">3. Penggunaan Data</h2>
            <p>Data yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Memproses dan menindaklanjuti aspirasi masyarakat</li>
              <li>Registrasi keanggotaan (KTA) PKS</li>
              <li>Verifikasi donasi dan transaksi keuangan</li>
              <li>Komunikasi langsung melalui WhatsApp terkait layanan publik</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">4. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi
              data pribadi Anda, termasuk enkripsi sisi server, pembatasan akses database, dan penggunaan
              koneksi HTTPS yang aman.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">5. Pembagian Data</h2>
            <p>
              Kami tidak membagikan data pribadi Anda kepada pihak ketiga, kecuali diwajibkan oleh hukum
              atau peraturan perundang-undangan yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">6. Hak Anda</h2>
            <p>
              Anda berhak mengakses, memperbaiki, atau menghapus data pribadi Anda dengan menghubungi
              kami melalui WhatsApp atau email yang tercantum di halaman Kontak.
            </p>
          </section>

          <section>
            <h2 className="text-[1.25em] font-bold mb-2">7. Perubahan Kebijakan</h2>
            <p>
              Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan diumumkan melalui portal
              resmi DPD PKS Kabupaten Pamekasan.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
