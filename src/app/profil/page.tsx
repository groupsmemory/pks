import type { Metadata } from 'next';
import { profilData, partyData } from '@/src/data/profil';

export const metadata: Metadata = {
  title: 'Profil Partai — DPD PKS Pamekasan',
  description:
    'Profil resmi DPD PKS Kabupaten Pamekasan. Sejarah partai, visi dan misi, struktur kepengurusan, serta profil Ketua Umum Mohammad Alim, S.Ag.',
  openGraph: {
    title: 'Profil Partai — DPD PKS Pamekasan',
    description:
      'Profil resmi DPD PKS Kabupaten Pamekasan. Sejarah partai, visi dan misi, struktur kepengurusan, serta profil Ketua Umum Mohammad Alim, S.Ag.',
  },
  twitter: {
    title: 'Profil Partai — DPD PKS Pamekasan',
    description:
      'Profil resmi DPD PKS Kabupaten Pamekasan. Sejarah partai, visi dan misi, struktur kepengurusan, serta profil Ketua Umum Mohammad Alim, S.Ag.',
  },
};

export default function ProfilPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Partai */}
        <section className="mb-12 text-center" aria-labelledby="partai-heading">
          <h1
            id="partai-heading"
            className="text-[2em] sm:text-[2.5em] font-extrabold mb-2"
          >
            {partyData.namaPartai}
          </h1>
          <p className="text-gray-600">{partyData.alamat}</p>
        </section>

        {/* Visi & Misi Partai */}
        <section className="mb-10" aria-labelledby="visi-partai-heading">
          <h2 id="visi-partai-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Visi &amp; Misi Partai
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[1.125em] mb-2">Visi</h3>
              <p className="leading-relaxed">{partyData.visi}</p>
            </div>
            <div>
              <h3 className="font-bold text-[1.125em] mb-2">Misi</h3>
              <ol className="list-decimal list-inside space-y-2">
                {partyData.misi.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Sejarah Partai */}
        <section className="mb-10" aria-labelledby="sejarah-partai-heading">
          <h2 id="sejarah-partai-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Sejarah Partai
          </h2>
          <div className="space-y-4">
            {partyData.sejarah.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="inline-block min-w-[70px] px-2 py-1 text-sm font-bold text-center bg-blue-100 text-blue-800 rounded">
                  {item.tahun}
                </span>
                <p className="leading-relaxed">{item.peristiwa}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Struktur Kepengurusan */}
        <section className="mb-10" aria-labelledby="struktur-heading">
          <h2 id="struktur-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Struktur Kepengurusan
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" aria-label="Struktur pengurus DPD PKS Pamekasan">
              <thead>
                <tr className="border-b-2 border-current">
                  <th scope="col" className="py-3 px-4 font-bold">Jabatan</th>
                  <th scope="col" className="py-3 px-4 font-bold">Nama</th>
                </tr>
              </thead>
              <tbody>
                {partyData.struktur.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">{item.jabatan}</td>
                    <td className="py-3 px-4">{item.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Divider */}
        <hr className="my-12 border-current opacity-20" />

        {/* ===== Profil Ketua Umum ===== */}
        <section className="mb-12" aria-labelledby="ketua-heading">
          <h2 id="ketua-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Profil Ketua Umum
          </h2>
          <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 sm:p-12 text-white text-center">
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center mb-6"
                role="img"
                aria-label={profilData.fotoAlt}
              >
                <span className="text-[3em] sm:text-[4em]" aria-hidden="true">👤</span>
              </div>
              <h3 className="text-[1.75em] sm:text-[2.25em] font-extrabold leading-tight">
                {profilData.namaLengkap}
              </h3>
              <p className="text-[1.125em] mt-2 opacity-90">{profilData.jabatan}</p>
              <p className="text-sm mt-1 opacity-75">Periode {profilData.periode}</p>
            </div>

            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 py-6">
              <blockquote className="text-center italic text-[1.125em] leading-relaxed">
                {profilData.kutipan}
              </blockquote>
              <p className="text-center text-sm mt-2 opacity-70">— {profilData.namaLengkap}</p>
            </div>
          </div>
        </section>

        {/* Ringkasan Biografi */}
        <section className="mb-10" aria-labelledby="biografi-heading">
          <h2 id="biografi-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Biografi Singkat
          </h2>
          <p className="text-[1em] leading-relaxed">{profilData.ringkasan}</p>
        </section>

        {/* Visi & Misi */}
        <section className="mb-10" aria-labelledby="visi-misi-heading">
          <h2 id="visi-misi-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Visi &amp; Misi Kepemimpinan
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[1.125em] mb-2">Visi</h3>
              <p className="leading-relaxed">{profilData.visiMisi.visi}</p>
            </div>
            <div>
              <h3 className="font-bold text-[1.125em] mb-2">Misi</h3>
              <ol className="list-decimal list-inside space-y-2">
                {profilData.visiMisi.misi.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Riwayat Pendidikan */}
        <section className="mb-10" aria-labelledby="pendidikan-heading">
          <h2 id="pendidikan-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Riwayat Pendidikan
          </h2>
          <ul className="space-y-3">
            {profilData.riwayatPendidikan.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold" aria-hidden="true">🎓</span>
                <div>
                  <p className="font-bold">{item.jenjang}</p>
                  <p className="text-sm opacity-80">{item.institusi}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Rekam Jejak Politik */}
        <section className="mb-10" aria-labelledby="rekam-jejak-heading">
          <h2 id="rekam-jejak-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Rekam Jejak Politik
          </h2>
          <div className="space-y-4">
            {profilData.rekamJejakPolitik.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="inline-block min-w-[60px] px-2 py-1 text-sm font-bold text-center bg-blue-100 text-blue-800 rounded">
                  {item.tahun}
                </span>
                <p className="leading-relaxed">{item.keterangan}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Khidmah Kemasyarakatan */}
        <section className="mb-10" aria-labelledby="khidmah-heading">
          <h2 id="khidmah-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Khidmah Kemasyarakatan
          </h2>
          <ul className="space-y-3">
            {profilData.khidmahKemasyarakatan.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600" aria-hidden="true">✦</span>
                <p className="leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Representasi Legislatif PKS */}
        <section className="mb-10" aria-labelledby="legislatif-heading">
          <h2 id="legislatif-heading" className="text-[1.5em] font-bold mb-4 border-b pb-2 border-current">
            Representasi Legislatif PKS di DPRD Pamekasan (2024–2029)
          </h2>
          <p className="mb-4 opacity-80">
            Di bawah kepemimpinan Mohammad Alim, S.Ag., PKS Pamekasan berhasil mengamankan 4 kursi
            di DPRD Kabupaten Pamekasan pada Pemilu Legislatif 2024:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" aria-label="Daftar Anggota DPRD PKS Pamekasan">
              <thead>
                <tr className="border-b-2 border-current">
                  <th scope="col" className="py-3 px-4 font-bold">Nama</th>
                  <th scope="col" className="py-3 px-4 font-bold">Daerah Pemilihan</th>
                  <th scope="col" className="py-3 px-4 font-bold">Perolehan Suara</th>
                </tr>
              </thead>
              <tbody>
                {profilData.anggotaDPRD.map((anggota, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">{anggota.nama}</td>
                    <td className="py-3 px-4">{anggota.dapil}</td>
                    <td className="py-3 px-4">{anggota.suara}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-[1.25em] font-bold mb-3">
            Sampaikan Aspirasi Anda
          </h2>
          <p className="mb-6 opacity-80">
            Punya masukan untuk pembangunan Pamekasan? Sampaikan langsung melalui portal E-Aspirasi kami.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-8 py-3 font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
          >
            Kirim Aspirasi Sekarang
          </a>
        </section>
      </div>
    </main>
  );
}
