import type { Metadata } from 'next';
import SowanKyaiClient from './SowanKyaiClient';

export const metadata: Metadata = {
  title: 'Sowan Kyai — Silaturahmi Ulama DPD PKS Pamekasan',
  description:
    'Dokumentasi kunjungan silaturahmi (sowan) jajaran pengurus DPD PKS Pamekasan kepada para kiai kharismatik dan pengasuh pondok pesantren di Kabupaten Pamekasan.',
};

// Data statis dokumentasi sowan kyai — SSG, di-render saat build
const sowanData = [
  {
    id: '1',
    namaKiai: 'KH. Abdul Hamid Bakir',
    namaPesantren: 'Pondok Pesantren Mambaul Ulum',
    kecamatan: 'Pamekasan',
    tanggalSowan: '12 Januari 2025',
    tausiyah: [
      'Pentingnya menjaga ukhuwah islamiyah dalam berpolitik.',
      'Kader partai harus menjadi teladan akhlak di tengah masyarakat.',
      'Dakwah politik yang benar adalah yang membawa maslahat bagi umat.',
    ],
    delegasi: 'Mohammad Alim, S.Ag. bersama jajaran pengurus DPD',
  },
  {
    id: '2',
    namaKiai: 'KH. Moh. Syafi\'i Hadziq',
    namaPesantren: 'Pondok Pesantren Darul Ulum',
    kecamatan: 'Pademawu',
    tanggalSowan: '28 Januari 2025',
    tausiyah: [
      'Pendidikan pesantren harus tetap menjadi fondasi pembangunan karakter bangsa.',
      'Legislator wajib memperjuangkan anggaran pendidikan keagamaan.',
      'Jangan lupakan santri dan guru ngaji dalam kebijakan daerah.',
    ],
    delegasi: 'Mohammad Alim, S.Ag. dan Bidang Pembinaan Umat',
  },
  {
    id: '3',
    namaKiai: 'KH. Ahmad Fauzi',
    namaPesantren: 'Pondok Pesantren Al-Mujtahidin',
    kecamatan: 'Batumarmar',
    tanggalSowan: '15 Februari 2025',
    tausiyah: [
      'Masyarakat pesisir membutuhkan perhatian khusus dari wakil rakyat.',
      'Program bantuan nelayan harus tepat sasaran dan bebas korupsi.',
      'Kekuatan umat ada pada persatuan, bukan perpecahan politik.',
    ],
    delegasi: 'Mohammad Alim, S.Ag. bersama Juma\'ah (Anggota DPRD Dapil 3)',
  },
  {
    id: '4',
    namaKiai: 'KH. Imam Baihaqi',
    namaPesantren: 'Pondok Pesantren Nurul Jadid',
    kecamatan: 'Proppo',
    tanggalSowan: '3 Maret 2025',
    tausiyah: [
      'Ketahanan keluarga adalah pondasi ketahanan bangsa.',
      'Program RKI (Rumah Keluarga Indonesia) harus diperluas ke pelosok desa.',
      'Kader PKS harus hadir di tengah masyarakat, bukan hanya saat pemilu.',
    ],
    delegasi: 'Mohammad Alim, S.Ag. dan H. Imam Ghozali (Anggota DPRD Dapil 2)',
  },
  {
    id: '5',
    namaKiai: 'KH. Moh. Hasan Basri',
    namaPesantren: 'Pondok Pesantren Al-Hikam',
    kecamatan: 'Palengaan',
    tanggalSowan: '20 Maret 2025',
    tausiyah: [
      'Ekonomi umat harus dibangun dari bawah melalui koperasi dan UMKM.',
      'Jangan biarkan generasi muda terjebak dalam budaya konsumtif.',
      'Pesantren siap menjadi mitra pembangunan daerah.',
    ],
    delegasi: 'Pengurus DPD PKS Pamekasan dan Bidang Kesejahteraan Rakyat',
  },
  {
    id: '6',
    namaKiai: 'KH. Zainal Abidin',
    namaPesantren: 'Pondok Pesantren Sumber Anyar',
    kecamatan: 'Tlanakan',
    tanggalSowan: '5 April 2025',
    tausiyah: [
      'Infrastruktur jalan desa harus menjadi prioritas anggaran DPRD.',
      'Aspirasi warga yang masuk harus ditindaklanjuti dengan cepat.',
      'Wakil rakyat harus rajin turun ke bawah, bukan hanya duduk di gedung.',
    ],
    delegasi: 'Mohammad Alim, S.Ag. dan Suryono (Anggota DPRD Dapil 1)',
  },
  {
    id: '7',
    namaKiai: 'KH. Moh. Rofi\'i',
    namaPesantren: 'Pondok Pesantren Miftahul Ulum',
    kecamatan: 'Pasean',
    tanggalSowan: '18 April 2025',
    tausiyah: [
      'Daerah terpencil jangan sampai tertinggal dalam pembangunan.',
      'Akses kesehatan dan pendidikan harus merata hingga ke pelosok.',
      'Silaturahmi politik yang ikhlas akan mendatangkan berkah.',
    ],
    delegasi: 'Jajaran DPD PKS Pamekasan dan Bidang Advokasi',
  },
  {
    id: '8',
    namaKiai: 'Nyai Hj. Siti Aminah',
    namaPesantren: 'Pondok Pesantren Putri Al-Amien',
    kecamatan: 'Galis',
    tanggalSowan: '2 Mei 2025',
    tausiyah: [
      'Perempuan Madura harus diberdayakan melalui pendidikan dan ekonomi.',
      'Program BIPEKA PKS sangat relevan dengan kebutuhan keluarga di desa.',
      'Jangan remehkan peran ibu dalam membangun generasi yang berakhlak.',
    ],
    delegasi: 'Mohammad Alim, S.Ag. bersama Ita Kusmita (Anggota DPRD Dapil 5) dan BIPEKA',
  },
];

export default function SowanKyaiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <section className="mb-8" aria-labelledby="sowan-heading">
          <h1 id="sowan-heading" className="text-[2em] font-extrabold mb-3 leading-tight">
            Sowan Kyai
          </h1>
          <p className="text-[1.125em] opacity-90 leading-relaxed">
            Dokumentasi silaturahmi resmi jajaran pengurus DPD PKS Pamekasan kepada para kiai
            kharismatik, ulama sepuh, dan pengasuh pondok pesantren di Kabupaten Pamekasan.
            Tradisi <em>sowan</em> ini merupakan wujud komitmen partai dalam menjaga harmoni
            antara gerakan politik dakwah dengan nilai-nilai kepesantrenan Madura.
          </p>
        </section>

        {/* Client Component: Filter + Cards */}
        <SowanKyaiClient data={sowanData} />
      </div>
    </main>
  );
}
