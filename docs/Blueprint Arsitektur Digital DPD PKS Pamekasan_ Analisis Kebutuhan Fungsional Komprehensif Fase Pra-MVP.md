# **Blueprint Arsitektur Digital DPD PKS Pamekasan: Analisis Kebutuhan Fungsional Komprehensif Fase Pra-MVP**

## **Bab 1: Analisis Makro Demografi dan Perilaku Digital Kabupaten Pamekasan**

Kabupaten Pamekasan menunjukkan lanskap demografis yang dinamis namun diiringi oleh kesenjangan ekonomi yang memerlukan pendekatan taktis dalam penyebaran informasi publik. Berdasarkan data statistik makro dari Badan Pusat Statistik (BPS) Kabupaten Pamekasan, jumlah populasi daerah telah mencapai 901,7 ribu jiwa dengan pertumbuhan penduduk yang konsisten di angka 5,47% per tahun.1 Indeks Pembangunan Manusia (IPM) tercatat berada pada tingkat sedang-tinggi yaitu 71,64, didukung oleh Angka Melek Huruf (AMH) penduduk usia 15 tahun ke atas yang sangat kuat, yakni mencapai 92,08%.1  
Meskipun tingkat literasi dasar tergolong tinggi, Kabupaten Pamekasan masih menghadapi tantangan ekonomi yang cukup signifikan. Persentase penduduk miskin pada Maret 2025 berada pada angka 12,77% (setara dengan 118,52 ribu jiwa). Walaupun angka ini menunjukkan penurunan dari posisi Maret 2024 yang sebesar 13,41%, BPS mencatat bahwa indeks kedalaman dan keparahan kemiskinan justru mengalami peningkatan. Garis Kemiskinan di Pamekasan ditetapkan sebesar Rp 482.278,00 per kapita per bulan. Kondisi ekonomi ini memiliki implikasi teknis yang mutlak terhadap perancangan platform digital partai; mayoritas konstituen merupakan pengguna internet dengan keterbatasan anggaran paket data (bandwidth-sensitive).  
Di sektor teknologi dan komunikasi, penetrasi internet umum di Jawa Timur berada pada angka 64,28%.2 Namun, data BPS menunjukkan penetrasi kepemilikan gawai yang pernah mengakses internet dalam 3 bulan terakhir di tingkat rumah tangga jauh lebih tinggi, yakni 90,64% di perkotaan dan 86,90% di perdesaan.3 Ketersediaan infrastruktur ini sayangnya tidak berbanding lurus dengan kematangan literasi digital. Berbagai lembaga gencar mengadakan edukasi seperti program "Goes to School" oleh Jurnalis Center Pamekasan (JCP) yang didukung Diskominfo guna menyiapkan bonus demografi 2030 4, program pembelajaran koding dasar sejak SD oleh Dinas Pendidikan dan Kebudayaan 5, serta program "Desa Cantik" (Desa Cinta Statistik) oleh BPS untuk memperkuat kecakapan statistik aparatur desa.6  
Dalam konteks perilaku online, terdapat anomali negatif yang mengkhawatirkan. Di satu sisi, Generasi Z di Pamekasan sangat rentan terhadap perilaku konsumtif dan terjebak dalam gaya hidup digital (*FOMO* dan *conformity*) yang didorong oleh media sosial seperti Instagram, TikTok, dan Shopee, yang sering kali memicu kecemasan hingga jeratan utang online.7 Di sisi lain, riset sosiologi digital di wilayah perdesaan pesisir seperti Desa Branta, Kecamatan Tlanakan, Pamekasan menunjukkan bahwa 91,71% remaja telah terpapar konten pornografi di internet, dengan 50% di antaranya secara sengaja mengakses konten tersebut.9 Hal ini berkorelasi kuat dengan tingginya risiko penyimpangan perilaku sosial remaja.9  
Oleh karena itu, website DPD PKS Pamekasan tidak boleh hanya tampil sebagai media propaganda statis, melainkan wajib hadir sebagai portal edukatif yang menyediakan ruang digital yang aman, bersih, dan berorientasi pada ketahanan keluarga konstituen.10

| Indikator Sosio-Demografis Pamekasan | Nilai Statistik | Implikasi Strategis terhadap Platform Digital |
| :---- | :---- | :---- |
| Populasi Total | 901,7 ribu jiwa 1 | Kapasitas infrastruktur server harus dioptimalkan untuk skalabilitas trafik tinggi. |
| Angka Melek Huruf (Usia 15+) | 92,08% 1 | Kesiapan tinggi konstituen untuk mencerna konten informasi berbasis teks, rilis pers, dan dokumen kebijakan. |
| Persentase Penduduk Miskin | 12,77% 1 | Website wajib dirancang sangat ringan, low-bandwidth, minim aset gambar berat, dan bebas auto-play video untuk menghemat kuota pengguna. |
| Keparahan Kemiskinan | Indeks Meningkat | Perlunya modul advokasi kesejahteraan sosial dan informasi bantuan darurat yang mudah diakses. |
| Akses Internet Rumah Tangga | 86,90% s.d. 90,64% 3 | Antarmuka wajib menggunakan pendekatan mobile-first karena mayoritas akses dilakukan via telepon genggam. |
| Keterpaparan Pornografi Remaja | 91,71% 10 | Pentingnya rubrik literasi digital yang aman serta integrasi konten positif ramah anak dan keluarga. |

## **Bab 2: Karakteristik Komunikasi Masyarakat Madura dan Preferensi Kanal**

Pengembangan sistem informasi di wilayah Madura sering kali mengalami kegagalan akibat ketidakcocokan antara teknologi yang ditawarkan dan realitas kebudayaan setempat. Salah satu studi kasus yang sangat relevan adalah dinamika operasional ojek online lokal bernama "Jasku" (Jasa Kurir) yang berbasis di Pamekasan, Sumenep, dan Sampang. Meskipun Jasku sempat mendapatkan dukungan formal dari Pemerintah Kabupaten Pamekasan untuk program kemitraan sosial, analisis perilaku konsumen menunjukkan bahwa aplikasi seluler *standalone* (aplikasi khusus yang harus diunduh di Playstore/Appstore) tidak efektif bagi masyarakat Madura.12  
Masyarakat Madura enggan menginstal aplikasi mandiri karena keterbatasan memori penyimpanan gawai dan keengganan beradaptasi dengan alur sistem (*user journey*) yang rumit.12 Konsumen Madura terbukti jauh lebih memilih melakukan interaksi, pemesanan, dan transaksi secara langsung melalui aplikasi pesan instan WhatsApp yang sudah menjadi bagian dari keseharian mereka.12 Kegagalan retensi aplikasi ojek online kompetitor membuktikan bahwa WhatsApp adalah saluran retensi komunikasi terbaik di wilayah ini.12  
Selain faktor kecenderungan gawai, struktur sosial masyarakat Madura sangat dipengaruhi oleh model kepemimpinan patron-klien yang menempatkan Kyai dan Ulama pada posisi sosial-politik tertinggi. Budaya kepatuhan yang dikenal dengan istilah *ngabulā* atau *khaddam* (mengabdi sepenuhnya kepada Kyai tanpa mengharapkan imbalan materi demi mencari keberkahan) merupakan perekat sosial yang sangat kuat di Pamekasan. Aspirasi keagamaan dan restu tokoh ulama senantiasa menjadi kompas utama dalam gerakan politik daerah.13 PKS Jawa Timur secara konsisten merawat hubungan sosiologis ini melalui kunjungan silaturahmi (*sowan*) rutin ke kediaman para Kyai kharismatik di Pamekasan guna menyerap aspirasi keagamaan dan pembangunan daerah.13  
Implikasi langsung bagi arsitektur website DPD PKS Pamekasan adalah keharusan mutlak untuk tidak memaksakan fitur-fitur aplikasi mandiri yang kompleks. Sebaliknya, website harus berfungsi sebagai *landing page* responsif yang bertindak sebagai jembatan langsung ke WhatsApp (*WhatsApp Hot-Routing*).12 Di sisi lain, guna merespons struktur sosial patron-klien, dokumentasi kegiatan silaturahmi, nasihat ulama, serta kanal komunikasi khusus keagamaan harus diposisikan pada area strategis di halaman utama.

| Dimensi Perilaku Komunikasi | Karakteristik Sosial Budaya Madura | Solusi Integrasi Sistem Website |
| :---- | :---- | :---- |
| Penolakan Aplikasi Standalone | Rendahnya retensi dan memori ponsel terbatas; enggan mengunduh aplikasi baru.12 | Menggunakan arsitektur Progressive Web App (PWA) yang sangat ringan dan responsif, tanpa perlu instalasi rumit.12 |
| Preferensi Kanal WhatsApp | WhatsApp dinilai praktis, personal, dan bebas hambatan teknis.12 | Implementasi fitur "WhatsApp Hot-Routing" yang menghubungkan setiap formulir aspirasi website langsung ke WhatsApp admin divisi terkait.12 |
| Penghormatan terhadap Ulama | Kepatuhan mutlak (*ngabulā*) kepada Kyai dan tokoh agama. | Pembuatan rubrik "Sowan Kyai" dan "Aspirasi Keumatan" yang mempublikasikan hasil silaturahmi tokoh ulama dengan pimpinan partai. |
| Pendekatan Transaksional Sosial | Menyukai aksi nyata langsung dibanding birokrasi tertulis.12 | Penempatan tombol pintas aduan warga di bagian atas (*header*) yang langsung menghubungkan pengguna ke petugas piket partai.12 |

## **Bab 3: Struktur Kepengurusan Riil DPD PKS Pamekasan dan Pemetaan Fitur**

Keberhasilan platform digital parpol sangat ditentukan oleh sinkronisasi antara struktur organisasi di dunia nyata dan arsitektur informasi website. Sejak tahun 2025, DPD PKS Pamekasan dipimpin secara definitif oleh kader senior partai, yaitu Mohammad Alim, S.Ag. selaku Ketua Umum. Beliau merupakan jangkar utama ketokohan PKS di Pamekasan, yang memiliki rekam jejak kepemimpinan kuat dengan konsistensi sebagai Caleg di Dapil 1 Pamekasan sebanyak 4 kali berturut-turut, serta selalu sukses menempati posisi kedua dalam perolehan suara internal pemilu legislatif.  
Pada Pemilu Legislatif 2024, PKS Pamekasan berhasil mengamankan 4 kursi di DPRD Kabupaten Pamekasan. Kekuatan politik parlemen ini merupakan representasi dari kepercayaan konstituen di berbagai daerah pemilihan (Dapil) di Pamekasan. Anggota legislatif PKS terpilih periode 2024-2029 yang wajib diintegrasikan ke dalam sistem aduan daerah adalah sebagai berikut:

1. Suryono (Dapil I \- Pamekasan, Tlanakan) meraih 4.964 suara.  
2. H. Imam Ghozali (Dapil II \- Palengaan, Proppo) meraih 8.647 suara.  
3. Juma'ah (Dapil III \- Batumarmar, Waru, Pasean) meraih 6.906 suara.  
4. Ita Kusmita (Dapil V \- Larangan, Pademawu, Galis) meraih 4.270 suara.

Untuk menerjemahkan struktur ini, website harus menyediakan dua modul utama yang dipersonalisasi:

* **Modul Khusus Pimpinan (Executive Leadership Hub):** Menampilkan profil Mohammad Alim, S.Ag. sebagai representasi kepemimpinan partai, lengkap dengan rilis pers strategis, dokumentasi keputusan partai, serta kanal komunikasi tertutup bagi pengurus tingkat kecamatan (DPC).  
* **Modul Legislative Report & E-Aspirasi Sektoral:** Menyajikan laporan kinerja dari 4 anggota DPRD PKS Pamekasan. Pengguna website dapat menyalurkan aspirasi yang secara otomatis dikelompokkan berdasarkan Dapil asal mereka, sehingga pesan langsung diarahkan kepada anggota legislatif yang bertanggung jawab di wilayah tersebut.

| Struktur Organisasi & Parlemen | Pejabat/Representasi Riil | Modul Website Pra-MVP | Alur Integrasi Fungsional |
| :---- | :---- | :---- | :---- |
| Ketua Umum DPD PKS Pamekasan | Mohammad Alim, S.Ag. | Executive Leadership Hub | Publikasi gagasan utama, foto profil resmi, rilis kepemimpinan, dan tautan koordinasi internal. |
| Fraksi DPRD Dapil I | Suryono (4.964 suara) | E-Aspirasi Dapil I | Formulir pengaduan infrastruktur perkotaan dan pesisir Tlanakan. |
| Fraksi DPRD Dapil II | H. Imam Ghozali (8.647 suara) | E-Aspirasi Dapil II | Portal laporan kemasyarakatan wilayah Palengaan dan Proppo. |
| Fraksi DPRD Dapil III | Juma'ah (6.906 suara) | E-Aspirasi Dapil III | Rubrik penyerapan aspirasi pembangunan wilayah Madura Utara. |
| Fraksi DPRD Dapil V | Ita Kusmita (4.270 suara) | E-Aspirasi Dapil V | Modul aduan sektor pertanian/UMKM wilayah Pademawu, Larangan, Galis. |
| Struktur Divisi/Bidang DPD | BIPEKA, Kepanduan, Kaderisasi 11 | Bidang Portal (Sektoral) | Ruang publikasi mandiri untuk 12 bidang sektoral partai.11 |

## **Bab 4: Analisis Arsitektur Informasi dan Standar Aksesibilitas Inklusif (WCAG 2.1 AA) untuk Kader Senior**

Penyusunan arsitektur informasi untuk partai politik di tingkat daerah sering kali mengabaikan aspek aksesibilitas fisik bagi pengguna lanjut usia (kader senior) dan penyandang disabilitas. Padahal, secara legal, pemenuhan aksesibilitas portal digital didasarkan pada Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas 15 serta Peraturan Menteri Komunikasi dan Informatika Tahun 2017 tentang Penyelenggaraan Portal dan Situs Web Badan Pemerintahan.16 Rendahnya pemenuhan standar ini (Indonesia berada di peringkat ke-47 dari 100 negara pada Indeks Internet Inklusif) disebabkan oleh minimnya kesadaran developer lokal.17  
Berdasarkan tinjauan sistematis, kesalahan umum pada website publik di Indonesia meliputi 16:

1. Ketiadaan deskripsi teks alternatif (*alt text*) pada gambar sehingga tidak terbaca oleh alat pembaca layar (*screen reader*).  
2. Rasio kontras warna teks dan latar belakang yang tidak memenuhi ambang batas minimal (\<4.5:1).  
3. Ketiadaan tag penanda elemen formulir (*ARIA label*) yang jelas bagi disabilitas netra.  
4. Struktur dokumen (*heading levels*) yang tidak berurutan dan membingungkan pembaca layar.  
5. Format dokumen publik (seperti PDF laporan atau AD/ART) yang tidak diproses dengan penandaan (*tagged PDF*) sehingga tidak terbaca sama sekali.18

Untuk mewujudkan inklusivitas digital bagi kader senior dan penyandang disabilitas di Pamekasan, website DPD PKS Pamekasan wajib mengimplementasikan standar internasional Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.18 Sebagai acuan, portal jurnalisme inklusif khub.id sukses memenuhi 21 dari 50 kriteria AA dengan menyediakan fitur pembesaran teks tanpa merusak tata letak, kontras warna yang aman, serta video profil ber-Takarir dan bersumberdaya Juru Bahasa Isyarat (JBI).19  
Website DPD PKS Pamekasan akan mengadopsi kontrol pintasan keyboard (*keyboard shortcuts*) seperti yang diterapkan pada situs Pengadilan Negeri Yogyakarta 20 dan portal Article 33 21 untuk memudahkan navigasi instan tanpa menggunakan tetikus (*mouse*).

| Elemen Aksesibilitas | Kriteria WCAG 2.1 AA | Solusi Teknis Website PKS Pamekasan | Kombinasi Tombol Pintasan (Shortcuts) |
| :---- | :---- | :---- | :---- |
| Kontras Warna Tinggi | Rasio kontras visual teks minimal 4.5:1 terhadap warna latar belakang.18 | Menyediakan tombol *Toggle High Contrast* dengan skema warna kuning-hitam atau biru-putih.18 | Alt \+ J (Kontras 1), Alt \+ K (Kontras 2\) 20 |
| Skalabilitas Huruf | Teks dapat diperbesar hingga 200% tanpa merusak tata letak atau fungsionalitas halaman.19 | Menggunakan unit relatif (rem/em) pada CSS serta widget pengatur ukuran huruf instan di pojok layar.20 | Alt \+ U (Perkecil), Alt \+ R (Reset ke Normal) 20 |
| Navigasi Keyboard | Seluruh elemen interaktif wajib dapat diakses penuh hanya dengan menggunakan tombol Tab.21 | Mengimplementasikan tag penunjuk fokus visual yang tebal saat tombol Tab ditekan, serta melompati elemen berulang (*skip to content*).21 | M (Buka Menu), H (Lompat Headings), F (Lompat Form) 21 |
| Dukungan Screen Reader | Pengguna netra wajib menerima deskripsi akurat dari setiap elemen grafis dan input.16 | Penggunaan tag \<label\> yang eksplisit untuk semua input teks, penerapan atribut ARIA, dan kewajiban pengisian *Alt Text* pada CMS gambar.16 | Otomatis aktif saat pembaca layar (NVDA/JAWS) mendeteksi tag HTML5. |
| Aksesibilitas Dokumen | Dokumen publik yang diunduh harus dapat diuraikan oleh pembaca suara.18 | Seluruh file PDF AD/ART dan regulasi partai dikonversi menjadi *Tagged PDF* sebelum diunggah ke server.18 | N/A |

## **Bab 5: Peta Kebutuhan Fungsional Pra-MVP (Core Pillars)**

Guna membangun fondasi yang kokoh sebelum meluncurkan produk minimum yang layak (*Minimum Viable Product* / MVP), DPD PKS Pamekasan menetapkan tiga pilar fungsional utama yang dirancang secara khusus untuk menjawab tantangan demografi rendah daya, kesiapan literasi, preferensi WhatsApp, dan inklusivitas kader senior.

### **Pilar 1: Manajemen Informasi Publik**

Pilar ini adalah wajah transparansi informasi kepartaian tingkat daerah yang ditujukan untuk mengedukasi warga sekaligus memperkuat kredibilitas kepengurusan di bawah pimpinan Mohammad Alim, S.Ag.

* **Fitur Utama:** Profil Pengurus DPTD (Ketua, Sekretaris, Bendahara, Dewan Pakar), Sejarah Perjuangan PKS Pamekasan, AD/ART resmi.22  
* **Repositori Hukum Digital (JDIH Lokal):** Menyediakan ruang unduh keputusan menteri, regulasi daerah, serta panduan internal partai dalam format PDF teroptimasi (Tagged PDF) yang ramah pembaca layar.18  
* **Pusat Berita Interaktif:** Menyajikan rilis pers kegiatan formal seperti koordinasi pengawasan dengan Bawaslu Pamekasan 24, silaturahmi kepolisian, serta agenda bulanan partai. Fitur ini dirancang dengan kompresi gambar otomatis hingga di bawah 100 KB per berkas demi efisiensi kuota data warga.1

### **Pilar 2: Transparansi Kegiatan dan Pemberdayaan Kader (BIPEKA & Sektoral)**

Pilar ini berfokus pada visualisasi aksi nyata kader PKS di lapangan serta program pemberdayaan masyarakat yang menyasar penguatan ketahanan keluarga dan peningkatan ekonomi rakyat.

* **Rubrik Ketahanan Keluarga (BIPEKA):** Menyediakan konseling ketahanan keluarga, artikel bertema "Ibu Bahagia, Pondasi Ketahanan Keluarga," serta sarasehan Rumah Keluarga Indonesia (RKI) untuk menekan angka perceraian dan menangkal dampak buruk internet pada anak di Pamekasan.10  
* **Ekosistem Pembinaan Pemuda (PKS Muda & Gema Keadilan):** Dokumentasi kegiatan olahraga massal, senam rakyat, serta forum diskusi positif bagi Gen Z Pamekasan untuk mengalihkan kecemasan sosial menjadi aktivitas produktif.7  
* **Pemberdayaan Sosio-Ekonomi Sektoral:** Publikasi berkala tentang "Sekolah Tani, Ternak, dan Nelayan" 22, "Pelatihan Juru Sembelih Halal Berbasis Kompetensi" 11, serta program pendampingan UMKM digital (seperti kelas *digital marketing* dan fotografi produk gratis yang bekerja sama dengan praktisi lokal) guna mendongkrak omzet UMK di Pamekasan.25  
* **Sipol Bridge (Integrasi Keanggotaan):** Modul registrasi KTA PKS secara mandiri yang aman dan terhubung dengan informasi verifikasi keanggotaan SIPOL KPU guna menjaga validitas data internal parpol.26

### **Pilar 3: Pusat Aspirasi Warga Lokal (e-Aspirasi via WhatsApp Routing)**

Menjawab kegagalan retensi aplikasi mandiri di Madura, pilar ini dirancang sebagai sistem penerimaan pengaduan dua arah yang sangat praktis dan terintegrasi dengan struktur parlemen riil.12

* **Formulir Pengaduan Sektoral:** Warga dapat menuliskan keluhan mereka di website (kategori: Kesehatan/UHC, Ketenagakerjaan/Buruh Tani, Pendidikan, atau Infrastruktur).6  
* **WhatsApp Hot-Routing System:** Begitu tombol "Kirim Aspirasi" ditekan, sistem di website akan secara otomatis mengolah data formulir tersebut menjadi pesan teks terstruktur (Nama, Dapil, Kategori, Isi Aduan) dan mengarahkan pengguna membuka aplikasi WhatsApp gawai mereka yang langsung terhubung ke nomor staf ahli dari salah satu dari 4 anggota DPRD PKS Pamekasan yang sesuai dengan Dapil asal pengadu.  
* **Integrasi Saluran Pengaduan Daerah:** Menyediakan tautan rujukan eksternal yang aman menuju portal penanganan pengaduan nasional SP4N Lapor\! Kabupaten Pamekasan, Whistleblowing System (WBS) Inspektorat, dan sistem pelaporan Gratifikasi Online KPK.28

| Komponen Pilar Fungsional | Fitur Inti Platform | Output Teknis Pra-MVP | Parameter Kepatuhan Aksesibilitas (WCAG 2.1 AA) |
| :---- | :---- | :---- | :---- |
| **Pilar 1: Informasi Publik** | Profil Mohammad Alim, S.Ag., arsip AD/ART, berita kegiatan. | Halaman statis ultra-cepat (\<1,2 detik waktu muat); Tagged PDF AD/ART.18 | Tag heading berurutan (H1-H3); teks deskriptif pada tautan dokumen.16 |
| **Pilar 2: Pemberdayaan Kader** 11 | Berita RKI BIPEKA, kelas pelatihan UMKM Madura, link pendaftaran KTA.11 | Galeri foto/video terkompresi; formulir pengajuan KTA yang responsif.25 | CMS wajib meminta pengisian *Alt Text* pada gambar kegiatan sebelum disimpan.16 |
| **Pilar 3: Pusat e-Aspirasi** | Form keluhan per Dapil; link SP4N Lapor\!. | Skrip pengarah pesan (*routing script*) otomatis dari input web ke WhatsApp API.12 | Label form eksplisit \<label\>; warna input kontras tinggi; error diumumkan lewat suara.18 |

#### **Karya yang dikutip**

1. Statistik \- Pemerintah Kabupaten Pamekasan, diakses Mei 18, 2026, [https://pamekasankab.go.id/statistik](https://pamekasankab.go.id/statistik)  
2. Penetrasi Internet di Indonesia Belum Merata sampai 2022 \- Databoks, diakses Mei 18, 2026, [https://databoks.katadata.co.id/teknologi-telekomunikasi/statistik/d65dc6c13d9d7bd/penetrasi-internet-di-indonesia-belum-merata-sampai-2022](https://databoks.katadata.co.id/teknologi-telekomunikasi/statistik/d65dc6c13d9d7bd/penetrasi-internet-di-indonesia-belum-merata-sampai-2022)  
3. Persentase Rumah Tangga yang Pernah Mengakses Internet dalam 3 Bulan Terakhir Menurut Provinsi dan Klasifikasi Daerah \- Tabel Statistik \- BPS, diakses Mei 18, 2026, [https://www.bps.go.id/id/statistics-table/2/Mzk4IzI=/persentase-rumah-tangga-yang-pernah-mengakses-internet-dalam-3-bulan-terakhir-menurut-provinsi-dan-klasifikasi-daerah.html](https://www.bps.go.id/id/statistics-table/2/Mzk4IzI=/persentase-rumah-tangga-yang-pernah-mengakses-internet-dalam-3-bulan-terakhir-menurut-provinsi-dan-klasifikasi-daerah.html)  
4. Membumikan Literasi Digital, Jurnalis Center Pamekasan Goes To School, diakses Mei 18, 2026, [https://www.jatimpos.co/pendidikan/7792-membumikan-literasi-digital-jurnalis-center-pamekasan-goes-to-school](https://www.jatimpos.co/pendidikan/7792-membumikan-literasi-digital-jurnalis-center-pamekasan-goes-to-school)  
5. Disdikbud Pamekasan Bekerjasama Dengan Yudistira Gelar Seminar Pendidikan: Perkuat Literasi Digital Dan Pembelajaran Koding Di SD Pamekasan, diakses Mei 18, 2026, [https://dinaspendidikan.pamekasankab.go.id/detail-berita-disdikbud-pamekasan-bekerjasama-dengan-yudistira-gelar-seminar-pendidikan-perkuat-literasi-digital-dan-pembelajaran-koding-di-sd-pamekasan](https://dinaspendidikan.pamekasankab.go.id/detail-berita-disdikbud-pamekasan-bekerjasama-dengan-yudistira-gelar-seminar-pendidikan-perkuat-literasi-digital-dan-pembelajaran-koding-di-sd-pamekasan)  
6. BPS catat penduduk Pamekasan bertambah 5 ribuan orang per tahun \- Antara News jatim, diakses Mei 18, 2026, [https://jatim.antaranews.com/berita/456501/bps-catat-penduduk-pamekasan-bertambah-5-ribuan-orang-per-tahun](https://jatim.antaranews.com/berita/456501/bps-catat-penduduk-pamekasan-bertambah-5-ribuan-orang-per-tahun)  
7. (PDF) Perilaku Konsumtif Gen Z di Era Digital: Studi Kasus di Kabupaten Pamekasan, diakses Mei 18, 2026, [https://www.researchgate.net/publication/388757515\_Perilaku\_Konsumtif\_Gen\_Z\_di\_Era\_Digital\_Studi\_Kasus\_di\_Kabupaten\_Pamekasan](https://www.researchgate.net/publication/388757515_Perilaku_Konsumtif_Gen_Z_di_Era_Digital_Studi_Kasus_di_Kabupaten_Pamekasan)  
8. Perilaku Konsumtif Gen Z di Era Digital: Studi Kasus di Kabupaten Pamekasan \- ResearchGate, diakses Mei 18, 2026, [https://www.researchgate.net/publication/388757515\_Perilaku\_Konsumtif\_Gen\_Z\_di\_Era\_Digital\_Studi\_Kasus\_di\_Kabupaten\_Pamekasan/fulltext/67a4ec4a207c0c20fa7c1c82/Perilaku-Konsumtif-Gen-Z-di-Era-Digital-Studi-Kasus-di-Kabupaten-Pamekasan.pdf](https://www.researchgate.net/publication/388757515_Perilaku_Konsumtif_Gen_Z_di_Era_Digital_Studi_Kasus_di_Kabupaten_Pamekasan/fulltext/67a4ec4a207c0c20fa7c1c82/Perilaku-Konsumtif-Gen-Z-di-Era-Digital-Studi-Kasus-di-Kabupaten-Pamekasan.pdf)  
9. INTERNET DAN PERILAKU SEKSUAL REMAJA PESISIR MADURA: STUDI CROSS SECTIONAL DI DESA BRANTA \- Jurnal USM, diakses Mei 18, 2026, [https://journals.usm.ac.id/index.php/jdsb/article/download/1621/1148](https://journals.usm.ac.id/index.php/jdsb/article/download/1621/1148)  
10. internet dan perilaku seksual remaja pesisir madura: studi cross sectional di desa branta \- Garuda, diakses Mei 18, 2026, [https://garuda.kemdiktisaintek.go.id/documents/detail/1489757](https://garuda.kemdiktisaintek.go.id/documents/detail/1489757)  
11. Home | DPD PKS Sleman, diakses Mei 18, 2026, [https://sleman.pks.id/home-3/](https://sleman.pks.id/home-3/)  
12. IMPLEMENTASI DIGITAL MARKETING LAYANAN JASA KURIR JASKU DI MADURA \- E-Journal Unesa, diakses Mei 18, 2026, [https://ejournal.unesa.ac.id/index.php/Commercium/article/download/58356/45518](https://ejournal.unesa.ac.id/index.php/Commercium/article/download/58356/45518)  
13. Sowan Para Kyai, PKS Siap Wujudkan Aspirasi Umat di Pamekasan \- DPW PKS Jatim, diakses Mei 18, 2026, [https://jatim.pks.id/sowan-para-kyai-pks-siap-wujudkan-aspirasi-umat-di-pamekasan/](https://jatim.pks.id/sowan-para-kyai-pks-siap-wujudkan-aspirasi-umat-di-pamekasan/)  
14. Struktur Dan Kepengurusan PKS Kota Cirebon 2025 – 2030 | DPD ..., diakses Mei 18, 2026, [https://cirebon.pks.id/p/susunan-pengurus.html](https://cirebon.pks.id/p/susunan-pengurus.html)  
15. Kominfo Hadirkan Fitur Disabilitas Di Website Resminya Untuk Permudah Akses Untuk Difabel \- Gamatechno, diakses Mei 18, 2026, [https://www.gamatechno.com/development/kominfo-hadirkan-fitur-disabilitas-di-website-resminya-untuk-permudah-akses-untuk-difabel/](https://www.gamatechno.com/development/kominfo-hadirkan-fitur-disabilitas-di-website-resminya-untuk-permudah-akses-untuk-difabel/)  
16. Analisis Aksesibilitas Website Kementerian di Indonesia Sebagai Implementasi dari E-Government \- Journal, diakses Mei 18, 2026, [https://journals.inaba.ac.id/index.php/jdcs/article/download/274/241](https://journals.inaba.ac.id/index.php/jdcs/article/download/274/241)  
17. Hadirkan Fitur Disabilitas pada Website Pemerintah bersama Layanan Software House Malang (try to redesign web) | by Arkatama Multi Solusindo \- Medium, diakses Mei 18, 2026, [https://medium.com/arkatama/hadirkan-fitur-disabilitas-pada-website-pemerintah-bersama-layanan-software-house-malang-try-to-4a272f671145](https://medium.com/arkatama/hadirkan-fitur-disabilitas-pada-website-pemerintah-bersama-layanan-software-house-malang-try-to-4a272f671145)  
18. Accessibility \- AXA IM Select Indonesia, diakses Mei 18, 2026, [https://select.axa-im.co.id/accessibility](https://select.axa-im.co.id/accessibility)  
19. Pernyataan Aksesibilitas \- KHUB, diakses Mei 18, 2026, [https://khub.id/aksesibilitas](https://khub.id/aksesibilitas)  
20. Petunjuk Aksesibilitas Difabel \- Pengadilan Negeri Yogyakarta, diakses Mei 18, 2026, [https://pn-yogyakota.go.id/pnyk/hukum/aksesibilitas-difabel.html](https://pn-yogyakota.go.id/pnyk/hukum/aksesibilitas-difabel.html)  
21. Pernyataan Aksesibilitas | Article 33 Indonesia, diakses Mei 18, 2026, [https://www.article33.or.id/pernyataan-aksesibilitas/](https://www.article33.or.id/pernyataan-aksesibilitas/)  
22. Pasca Dilantik, Ketua Dewan Pakar PKS Pamekasan: Niat Saya Mengabdi untuk Bangsa dan Negara, diakses Mei 18, 2026, [https://jatim.pks.id/pasca-dilantik-ketua-dewan-pakar-pks-pamekasan-niat-saya-mengabdi-untuk-bangsa-dan-negara/](https://jatim.pks.id/pasca-dilantik-ketua-dewan-pakar-pks-pamekasan-niat-saya-mengabdi-untuk-bangsa-dan-negara/)  
23. MPR RI, diakses Mei 18, 2026, [https://www.mpr.go.id/](https://www.mpr.go.id/)  
24. Perkuat Komitmen Demokrasi, Bawaslu Pamekasan Silaturahmi ke DPD PKS, diakses Mei 18, 2026, [https://pamekasan.bawaslu.go.id/berita/perkuat-komitmen-demokrasi-bawaslu-pamekasan-silaturahmi-ke-dpd-pks](https://pamekasan.bawaslu.go.id/berita/perkuat-komitmen-demokrasi-bawaslu-pamekasan-silaturahmi-ke-dpd-pks)  
25. DISEMINASI LITERASI DIGITAL dalam MENINGKATKAN OMZET UMK \- Bakorwil IV Pamekasan, diakses Mei 18, 2026, [https://mail.bakorwilpamekasan.jatimprov.go.id/berita/read/diseminasi-literasi-digital-dalam-meningkatkan-omzet-umk](https://mail.bakorwilpamekasan.jatimprov.go.id/berita/read/diseminasi-literasi-digital-dalam-meningkatkan-omzet-umk)  
26. PRO DAN KONTRA PENERAPAN SISTEM INFORMASI PARTAI POLITIK (SIPOL) PADA PADA PEMILU 2024 DI INDONESIA, diakses Mei 18, 2026, [https://jurnalfuf.uinsa.ac.id/index.php/JRP/article/view/2110/1430](https://jurnalfuf.uinsa.ac.id/index.php/JRP/article/view/2110/1430)  
27. AHU Partai Politik, diakses Mei 18, 2026, [https://parpol.ahu.go.id/](https://parpol.ahu.go.id/)  
28. Pemerintah Kabupaten Pamekasan, diakses Mei 18, 2026, [https://pamekasankab.go.id/](https://pamekasankab.go.id/)  
29. PKS \- DISPERINDAG – Kabupaten Pamekasan, diakses Mei 18, 2026, [https://disperindag.pamekasankab.go.id/sakip/pks/](https://disperindag.pamekasankab.go.id/sakip/pks/)