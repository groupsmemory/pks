export interface RiwayatPendidikan {
  institusi: string;
  jenjang: string;
}

export interface RekamJejakPolitik {
  tahun: string;
  keterangan: string;
}

export interface AnggotaDPRD {
  nama: string;
  dapil: string;
  suara: string;
}

export interface ProfilData {
  namaLengkap: string;
  jabatan: string;
  periode: string;
  fotoAlt: string;
  ringkasan: string;
  visiMisi: {
    visi: string;
    misi: string[];
  };
  riwayatPendidikan: RiwayatPendidikan[];
  rekamJejakPolitik: RekamJejakPolitik[];
  khidmahKemasyarakatan: string[];
  kutipan: string;
  anggotaDPRD: AnggotaDPRD[];
}

export const profilData: ProfilData = {
  namaLengkap: 'Mohammad Alim, S.Ag.',
  jabatan: 'Ketua Umum DPD PKS Kabupaten Pamekasan',
  periode: '2025 – Sekarang',
  fotoAlt: 'Foto Resmi Mohammad Alim, S.Ag. - Ketua DPD PKS Pamekasan',
  ringkasan:
    'Mohammad Alim, S.Ag. adalah kader senior Partai Keadilan Sejahtera yang telah mengabdikan diri dalam gerakan dakwah politik di Kabupaten Pamekasan selama lebih dari dua dekade. Beliau dikenal sebagai sosok pemimpin yang konsisten memperjuangkan aspirasi rakyat kecil, menjaga kedekatan dengan para ulama dan kiai kharismatik Madura, serta mengedepankan nilai-nilai keislaman dalam setiap kebijakan politik daerah.',
  visiMisi: {
    visi: 'Mewujudkan Pamekasan yang bermartabat, sejahtera, dan berkeadilan melalui dakwah politik yang berakar pada nilai-nilai keislaman dan kearifan lokal Madura.',
    misi: [
      'Memperkuat pelayanan aspirasi rakyat melalui kanal digital yang inklusif dan aksesibel.',
      'Membangun jembatan silaturahmi antara partai, ulama, dan masyarakat Pamekasan.',
      'Mendorong transparansi kinerja legislatif PKS di DPRD Kabupaten Pamekasan.',
      'Memberdayakan ekonomi konstituen melalui program UMKM dan ketahanan keluarga.',
      'Menjaga integritas moral kader melalui pembinaan ruhaniyah yang berkelanjutan.',
    ],
  },
  riwayatPendidikan: [
    { institusi: 'Pondok Pesantren di Pamekasan', jenjang: 'Pendidikan Dasar Keagamaan' },
    { institusi: 'IAIN/Perguruan Tinggi Islam', jenjang: 'Sarjana Agama (S.Ag.)' },
  ],
  rekamJejakPolitik: [
    { tahun: '2009', keterangan: 'Calon Legislatif DPRD Kabupaten Pamekasan Dapil 1 (Periode I)' },
    { tahun: '2014', keterangan: 'Calon Legislatif DPRD Kabupaten Pamekasan Dapil 1 (Periode II)' },
    { tahun: '2019', keterangan: 'Calon Legislatif DPRD Kabupaten Pamekasan Dapil 1 (Periode III)' },
    { tahun: '2024', keterangan: 'Calon Legislatif DPRD Kabupaten Pamekasan Dapil 1 (Periode IV) — Peraih suara kedua tertinggi internal' },
    { tahun: '2025', keterangan: 'Terpilih sebagai Ketua Umum DPD PKS Kabupaten Pamekasan' },
  ],
  khidmahKemasyarakatan: [
    'Penggerak program dakwah kultural di pesantren-pesantren Pamekasan.',
    'Inisiator silaturahmi rutin "Sowan Kyai" ke ulama kharismatik se-Kabupaten Pamekasan.',
    'Pendamping advokasi hak-hak masyarakat miskin di wilayah pelosok.',
    'Pembina kegiatan sosial dan keagamaan di tingkat kecamatan.',
    'Fasilitator dialog publik antara konstituen dan legislator PKS DPRD Pamekasan.',
  ],
  kutipan:
    '"Dakwah politik bukan soal merebut kekuasaan, melainkan soal menghadirkan keadilan bagi rakyat yang selama ini tidak terdengar suaranya."',
  anggotaDPRD: [
    { nama: 'Suryono', dapil: 'Dapil 1 (Pamekasan, Tlanakan)', suara: '4.964 suara' },
    { nama: 'H. Imam Ghozali', dapil: 'Dapil 2 (Palengaan, Proppo)', suara: '8.647 suara' },
    { nama: "Juma'ah", dapil: 'Dapil 3 (Batumarmar, Waru, Pasean)', suara: '6.906 suara' },
    { nama: 'Ita Kusmita', dapil: 'Dapil 5 (Larangan, Pademawu, Galis)', suara: '4.270 suara' },
  ],
};

export interface SejarahItem {
  tahun: string;
  peristiwa: string;
}

export interface StrukturItem {
  jabatan: string;
  nama: string;
}

export interface PartyData {
  namaPartai: string;
  singkatan: string;
  alamat: string;
  visi: string;
  misi: string[];
  sejarah: SejarahItem[];
  struktur: StrukturItem[];
}

export const partyData: PartyData = {
  namaPartai: 'DPD PKS Kabupaten Pamekasan',
  singkatan: 'DPD PKS Pamekasan',
  alamat: 'Jl. Patemon, Kabupaten Pamekasan, Jawa Timur',
  visi: 'Terwujudnya masyarakat Pamekasan yang religius, sejahtera, dan berkeadilan dalam bingkai Negara Kesatuan Republik Indonesia.',
  misi: [
    'Memperkuat dakwah politik yang berlandaskan nilai-nilai keislaman dan kebangsaan.',
    'Mendorong tata kelola pemerintahan yang bersih, transparan, dan partisipatif.',
    'Memperjuangkan keadilan ekonomi melalui pemberdayaan UMKM dan sektor riil.',
    'Membangun kader partai yang berintegritas, kompeten, dan dekat dengan rakyat.',
    'Menjalin silaturahmi dengan ulama, tokoh masyarakat, dan seluruh elemen bangsa.',
  ],
  sejarah: [
    { tahun: '2000', peristiwa: 'Pendirian PKS (saat itu PK) di tingkat nasional' },
    { tahun: '2004', peristiwa: 'Pembentukan struktur DPD PKS Kabupaten Pamekasan' },
    { tahun: '2009', peristiwa: 'Perolehan kursi pertama di DPRD Kabupaten Pamekasan' },
    { tahun: '2019', peristiwa: 'Pencapaian kursi terbanyak di DPRD Pamekasan' },
    { tahun: '2024', peristiwa: 'Mempertahankan 4 kursi di DPRD Kabupaten Pamekasan' },
    { tahun: '2025', peristiwa: 'Musyawarah Daerah (Musda) V dan kepemimpinan baru' },
  ],
  struktur: [
    { jabatan: 'Ketua Umum', nama: 'Mohammad Alim, S.Ag.' },
    { jabatan: 'Sekretaris', nama: '(dalam proses)' },
    { jabatan: 'Bendahara', nama: '(dalam proses)' },
    { jabatan: 'Ketua MPD', nama: '(dalam proses)' },
    { jabatan: 'Dewan Pakar', nama: '8 Anggota' },
  ],
};
