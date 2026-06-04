import type { Metadata } from 'next';
import RkiClient from './RkiClient';

export const metadata: Metadata = {
  title: 'Portal RKI — Rumah Keluarga Indonesia',
  description:
    'Portal edukasi ketahanan keluarga oleh BIPEKA DPD PKS Pamekasan. Modul parenting Islam, pembinaan ekonomi keluarga, dan jadwal konsultasi.',
};

// Data modul edukasi statis — SSG
const modulData = [
  {
    id: '1',
    judul: 'Parenting Islami: Mendidik Anak di Era Digital',
    kategori: 'PARENTING',
    ringkasan:
      'Panduan praktis bagi orang tua Muslim dalam mendampingi tumbuh kembang anak di tengah derasnya arus informasi digital. Membahas batasan screen time, konten positif, dan komunikasi efektif.',
    poinPembelajaran: [
      'Memahami tahapan perkembangan psikologi anak usia 0-12 tahun.',
      'Menetapkan aturan penggunaan gadget yang seimbang dan konsisten.',
      'Membangun komunikasi terbuka tanpa kekerasan verbal.',
      'Mengenali tanda-tanda kecanduan digital pada anak.',
      'Menyediakan alternatif kegiatan produktif berbasis nilai keislaman.',
    ],
    narasumber: 'Tim BIPEKA DPD PKS Pamekasan',
    durasi: '4 sesi (masing-masing 90 menit)',
  },
  {
    id: '2',
    judul: 'Ketahanan Ekonomi Keluarga: Mengelola Keuangan Rumah Tangga',
    kategori: 'EKONOMI',
    ringkasan:
      'Modul pelatihan literasi keuangan keluarga yang mencakup perencanaan anggaran, manajemen utang, tabungan darurat, dan pengenalan investasi halal untuk keluarga berpenghasilan menengah ke bawah.',
    poinPembelajaran: [
      'Menyusun anggaran bulanan keluarga dengan metode amplop digital.',
      'Membedakan kebutuhan primer, sekunder, dan tersier.',
      'Strategi menabung dengan penghasilan terbatas.',
      'Menghindari jebakan pinjaman online ilegal.',
      'Mengenal instrumen investasi syariah yang aman dan terjangkau.',
    ],
    narasumber: 'Bidang Kesejahteraan Rakyat DPD PKS Pamekasan',
    durasi: '3 sesi (masing-masing 120 menit)',
  },
  {
    id: '3',
    judul: 'Resolusi Konflik Rumah Tangga Secara Islami',
    kategori: 'KONSELING',
    ringkasan:
      'Panduan mengelola perbedaan pendapat dan konflik dalam rumah tangga dengan pendekatan musyawarah, sabar, dan prinsip mawaddah wa rahmah sesuai tuntunan Al-Quran dan Sunnah.',
    poinPembelajaran: [
      'Memahami sumber-sumber konflik umum dalam rumah tangga.',
      'Teknik komunikasi asertif tanpa menyakiti pasangan.',
      'Peran mediasi keluarga besar dan tokoh agama.',
      'Kapan dan bagaimana mencari bantuan konseling profesional.',
      'Menjaga keutuhan keluarga demi kemaslahatan anak.',
    ],
    narasumber: 'Konselor Keluarga BIPEKA PKS Pamekasan',
    durasi: '2 sesi (masing-masing 90 menit)',
  },
  {
    id: '4',
    judul: 'Kesehatan Reproduksi dan Keluarga Berencana Islami',
    kategori: 'KESEHATAN',
    ringkasan:
      'Edukasi kesehatan reproduksi bagi pasangan muda Muslim, mencakup perencanaan kehamilan, nutrisi ibu hamil, serta pandangan fikih kontemporer tentang pengaturan jarak kelahiran.',
    poinPembelajaran: [
      'Persiapan fisik dan mental sebelum kehamilan.',
      'Nutrisi penting bagi ibu hamil dan menyusui.',
      'Pandangan ulama tentang KB dalam perspektif maqashid syariah.',
      'Mengenali tanda bahaya kehamilan dan persalinan.',
      'Hak-hak kesehatan reproduksi perempuan dalam Islam.',
    ],
    narasumber: 'Tim Medis Mitra BIPEKA & Puskesmas Pamekasan',
    durasi: '2 sesi (masing-masing 90 menit)',
  },
  {
    id: '5',
    judul: 'Membangun Keluarga Sakinah: Fondasi Rumah Tangga Islami',
    kategori: 'PARENTING',
    ringkasan:
      'Modul dasar pembinaan keluarga sakinah yang membahas hak dan kewajiban suami-istri, membangun tradisi ibadah keluarga, serta menanamkan nilai-nilai akhlak mulia sejak dini.',
    poinPembelajaran: [
      'Memahami konsep sakinah, mawaddah, wa rahmah secara komprehensif.',
      'Pembagian peran yang adil dan saling menghormati.',
      'Membangun rutinitas ibadah bersama (shalat jamaah, tadarus).',
      'Menanamkan adab dan akhlak pada anak melalui keteladanan.',
      'Mengelola hubungan dengan keluarga besar secara harmonis.',
    ],
    narasumber: 'Ustadzah Pembina BIPEKA DPD PKS Pamekasan',
    durasi: '5 sesi (masing-masing 60 menit)',
  },
  {
    id: '6',
    judul: 'Literasi Digital untuk Ibu: Peluang Ekonomi dari Rumah',
    kategori: 'EKONOMI',
    ringkasan:
      'Pelatihan keterampilan digital dasar bagi ibu rumah tangga untuk membuka peluang penghasilan tambahan melalui media sosial, marketplace, dan konten kreator halal.',
    poinPembelajaran: [
      'Mengenal platform marketplace (Shopee, Tokopedia) untuk berjualan.',
      'Membuat konten promosi sederhana menggunakan smartphone.',
      'Manajemen waktu antara mengurus rumah tangga dan bisnis online.',
      'Etika berdagang online sesuai prinsip muamalah Islam.',
      'Membangun personal branding yang positif dan bermanfaat.',
    ],
    narasumber: 'Bidang UMKM & Ekonomi Kreatif DPD PKS Pamekasan',
    durasi: '4 sesi (masing-masing 90 menit)',
  },
];

const jadwalKonsultasi = [
  {
    id: '1',
    judul: 'Konsultasi Keluarga Mingguan',
    hari: 'Setiap Sabtu',
    waktu: '09:00 - 11:00 WIB',
    lokasi: 'Sekretariat DPD PKS Pamekasan, Jl. Patemon',
    metode: 'Tatap Muka & WhatsApp',
    konselor: 'Tim Konselor BIPEKA',
  },
  {
    id: '2',
    judul: 'Konseling Pranikah',
    hari: 'Setiap Jumat (minggu ke-2 & ke-4)',
    waktu: '13:00 - 15:00 WIB',
    lokasi: 'Online via Google Meet',
    metode: 'Daring (Online)',
    konselor: 'Ustadzah Pembina BIPEKA',
  },
  {
    id: '3',
    judul: 'Pendampingan Ekonomi Keluarga',
    hari: 'Setiap Rabu (minggu ke-1 & ke-3)',
    waktu: '10:00 - 12:00 WIB',
    lokasi: 'Sekretariat DPD PKS Pamekasan',
    metode: 'Tatap Muka',
    konselor: 'Bidang Kesejahteraan Rakyat',
  },
];

export default function RkiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <section className="mb-10" aria-labelledby="rki-heading">
          <h1 id="rki-heading" className="text-[2em] font-extrabold mb-3 leading-tight">
            Rumah Keluarga Indonesia (RKI)
          </h1>
          <p className="text-[1.125em] opacity-90 leading-relaxed mb-4">
            Portal edukasi ketahanan keluarga oleh Bidang Perempuan dan Ketahanan Keluarga
            (BIPEKA) DPD PKS Kabupaten Pamekasan. Menyediakan modul pembelajaran mandiri,
            pelatihan keterampilan, dan layanan konsultasi keluarga.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-800 font-medium">
              Parenting Islami
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
              Ekonomi Keluarga
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
              Konseling
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
              Kesehatan
            </span>
          </div>
        </section>

        {/* Client Component: Filter + Modul Cards + Jadwal */}
        <RkiClient modulData={modulData} jadwalData={jadwalKonsultasi} />
      </div>
    </main>
  );
}
