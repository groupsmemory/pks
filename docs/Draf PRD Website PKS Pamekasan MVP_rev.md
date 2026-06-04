# **Dokumen Kebutuhan Produk (PRD) Website Resmi DPD PKS Pamekasan: Fase Minimum Viable Product (MVP)**

## **BAB 1: USER PERSONA & USER ROLES**

Sistem informasi berbasis web untuk Dewan Pengurus Daerah (DPD) Partai Keadilan Sejahtera (PKS) Kabupaten Pamekasan dirancang sebagai instrumen komunikasi politik, pelayanan aspirasi rakyat, serta edukasi publik yang inklusif. Guna mengakomodasi keberagaman karakteristik pengguna di wilayah Pamekasan, arsitektur sistem membagi pengguna ke dalam tiga peran utama dengan karakteristik, kebutuhan, dan tingkat literasi digital yang spesifik.

### **1.1 Definisi Karakteristik dan Sesi Pengguna**

Pembagian peran ini bertujuan untuk memastikan bahwa seluruh fungsi dalam platform Next.js dapat diakses secara optimal, aman, dan efisien, baik oleh masyarakat awam maupun oleh aparatur internal partai yang bertugas mengelola data sensitif.

#### **1\. Public Visitor (Masyarakat Awam, Simpatisan, dan Kader Senior/Lansia)**

Kelompok ini mencakup konstituen umum yang berdomisili di wilayah Kabupaten Pamekasan, simpatisan partai, serta kader senior yang sering kali berada pada kelompok usia lanjut (lansia). Karakteristik utama dari kelompok ini adalah tingkat literasi digital yang sangat bervariasi, mulai dari pengguna ponsel pintar aktif hingga lansia yang mengalami penurunan daya akomodasi mata (presbiopi) atau keterbatasan motorik halus.1 Mereka memerlukan antarmuka yang sangat sederhana, navigasi intuitif, keterbacaan tinggi, serta aksesibilitas yang ramah terhadap keterbatasan fisik.2 Kebutuhan utama mereka meliputi pencarian informasi profil pimpinan, berita keagamaan/kultural, pengajuan keanggotaan, dan pengiriman aspirasi langsung tanpa hambatan teknis.4

#### **2\. Admin/Humas KOMDIGI (Komunikasi Digital)**

Staf internal pengurus DPD PKS Pamekasan yang bertanggung jawab atas pengelolaan seluruh konten dinamis di website. Admin memiliki literasi teknologi menengah hingga tinggi, terbiasa menggunakan sistem manajemen konten (CMS), serta memahami protokol dasar keamanan data. Tugas utama admin mencakup pemutakhiran data biografi pimpinan, pengelolaan artikel dakwah, kurasi modul ketahanan keluarga Rumah Keluarga Indonesia (RKI), pengawasan pendaftaran Kartu Tanda Anggota (KTA) baru, serta pemantauan log sistem.5 Admin membutuhkan dasbor analitik dan CMS yang aman, responsif, dan terproteksi dari ancaman siber.

#### **3\. Legislative Staff (Staf Ahli Fraksi PKS DPRD Kabupaten Pamekasan)**

Aparatur pendamping fungsional yang bertugas mengelola jalur komunikasi dan menindaklanjuti pengaduan masyarakat yang dialirkan melalui sistem *Hot-Routing* WhatsApp.7 Staf ahli ini terbagi berdasarkan lima Daerah Pemilihan (Dapil) di Kabupaten Pamekasan.7 Mereka memiliki literasi digital menengah yang berfokus pada efisiensi penggunaan aplikasi pesan instan. Kebutuhan utama mereka adalah menerima pesan aspirasi yang sudah terstruktur rapi berdasarkan format standarisasi partai, meminimalkan waktu pemrosesan aduan, dan mengidentifikasi keabsahan konstituen di wilayah kerja masing-masing.7

### **1.2 Matriks Hak Akses (Privilege Matrix)**

Sistem mengadopsi prinsip *Least Privilege* untuk mengamankan data dan mencegah modifikasi tanpa wewenang pada basis data NeonDB. Matriks di bawah ini memetakan hak akses setiap peran terhadap modul-modul utama website DPD PKS Pamekasan.

| Modul/Fitur Utama | Deskripsi Fungsional | Public Visitor | Admin/Humas KOMDIGI | Legislative Staff |
| :---- | :---- | :---- | :---- | :---- |
| **Profil Pimpinan** | Informasi biografi Ketua Umum Mohammad Alim, S.Ag. 10 | Read-Only | Read, Write, Update, Delete | Read-Only |
| **Sowan Kyai** | Rubrik dokumentasi silaturahmi tokoh ulama dan pesantren 4 | Read-Only | Read, Write, Update, Delete | Read-Only |
| **Portal BIPEKA & RKI** | Modul edukasi parenting dan ketahanan keluarga 6 | Read-Only | Read, Write, Update, Delete | Read-Only |
| **Pendaftaran KTA** | Pengisian formulir pendaftaran anggota dan unggah KTP 5 | Write-Only (Submit) | Read, Export CSV, Update Status | No Access |
| **E-Aspirasi Form** | Pengisian pengaduan berbasis kecamatan dan Dapil 7 | Write-Only (Submit) | Read Logs, View Analytics | No Access |
| **WhatsApp Router** | Eksekusi tautan dinamis menuju nomor staf legislatif 7 | Execute Redirect | Read Configuration | Receive Message (External WA) |
| **Widget Aksesibilitas** | Modul pengaturan ukuran font dan kontras warna 1 | Full Control | Full Control | Full Control |
| **CMS Dasbor Backend** | Antarmuka otentikasi admin (Next-Auth) dan manajemen database | No Access | Full Access (Protected Session) | No Access |

## **BAB 2: DETIL SPESIFIKASI FUNGSIONAL (THE 3 PILLARS)**

### **2.1 Pillar 1: Executive Leadership Hub (Profil & Sowan Kyai)**

Pilar ini didesain untuk menegaskan legitimasi kepemimpinan politik dan kultural DPD PKS Pamekasan di bawah kepemimpinan Ketua Umum Mohammad Alim, S.Ag..10 Hub ini mengintegrasikan profil biografi pimpinan dengan khidmah kultural melalui tradisi silaturahmi pesantren di Madura, yang dikemas dalam rubrik "Sowan Kyai".4

#### **1\. Fitur Halaman Profil Mohammad Alim, S.Ag.**

Menyajikan halaman biografi statis berkinerja tinggi yang memuat portofolio kepemimpinan, visi politik dakwah, dan komitmen pelayanan publik Ketua Umum DPD PKS Pamekasan.10 Halaman ini dirancang menggunakan metode *Static Site Generation* (SSG) pada Next.js guna memastikan kecepatan muat di bawah satu detik, bahkan pada area dengan konektivitas seluler terbatas di pelosok Pamekasan.

#### **2\. Fitur Rubrik Kultural "Sowan Kyai"**

Menampilkan dokumentasi kunjungan resmi jajaran pengurus PKS Pamekasan kepada para kiai sepuh, ulama kharismatik, dan pengasuh pondok pesantren di wilayah Pamekasan.4 Fitur ini berfungsi sebagai penegas bahwa garis perjuangan partai selaras dengan nilai-nilai kepesantrenan Madura.4

#### **3\. User Stories**

* **Sebagai Public Visitor**, pengamat politik lokal, atau simpatisan di Pamekasan, pengguna ingin mengakses profil Ketua Umum Mohammad Alim, S.Ag. dan rincian kunjungan "Sowan Kyai" agar dapat memahami integritas moral, visi kepemimpinan, serta kedekatan emosional partai dengan para ulama rujukan di Madura.4  
* **Sebagai Admin Humas KOMDIGI**, pengelola konten ingin mempublikasikan dokumentasi sowan kyai yang memuat kutipan nasihat keagamaan secara terstruktur agar nilai-nilai dakwah kultural tersampaikan dengan baik kepada konstituen.4

#### **4\. Acceptance Criteria (Gherkin Format)**

##### **Skenario 1: Menampilkan Halaman Profil Ketua Umum DPD PKS Pamekasan**

* **Given** pengguna berada pada halaman beranda Website DPD PKS Pamekasan.  
* **When** pengguna memilih menu "Profil Ketua Umum" pada bilah navigasi utama.  
* **Then** sistem harus menampilkan halaman biografi dinamis Mohammad Alim, S.Ag. secara instan.10  
* **And** halaman wajib memuat komponen gambar profil yang dioptimasi dengan format WebP, riwayat pendidikan, garis waktu pengabdian masyarakat, serta kutipan visi kepemimpinan yang telah dikonfigurasi menggunakan tag aksesibilitas gambar alt="Foto Resmi Mohammad Alim, S.Ag. \- Ketua DPD PKS Pamekasan".

##### **Skenario 2: Mengakses Rubrik "Sowan Kyai" dan Melakukan Penyaringan Data**

* **Given** pengguna berada pada halaman indeks "Sowan Kyai".4  
* **When** pengguna memilih opsi penyaringan (filter) berdasarkan "Nama Pondok Pesantren" atau "Kecamatan".11  
* **Then** sistem harus menyaring daftar kartu dokumentasi sowan secara real-time di sisi klien menggunakan fungsi filter array Next.js tanpa melakukan muat ulang halaman penuh (*full page reload*).  
* **And** setiap kartu dokumentasi wajib menampilkan nama kiai sepuh, nama pesantren, tanggal kunjungan, poin-poin tausiyah/nasihat khidmah, serta dokumentasi foto kunjungan yang responsif.4

##### **Skenario 3: Penambahan Konten Sowan Kyai Baru oleh Admin**

* **Given** admin telah masuk ke sistem CMS menggunakan kredensial yang valid melalui gerbang masuk otentikasi Next-Auth.  
* **When** admin mengisi formulir entri data sowan kyai baru (berisi nama kiai, nama pesantren, kutipan nasihat, tanggal sowan, dan mengunggah satu berkas gambar berukuran maksimal 2MB) lalu menekan tombol "Publikasikan".  
* **Then** sistem harus memvalidasi jenis berkas (hanya mengizinkan.jpg,.jpeg,.png, atau.webp) dan melakukan sanitasi input teks untuk mencegah serangan injeksi naskah (*XSS injection*).  
* **And** sistem menyimpan rekaman baru ke dalam NeonDB, memicu pembersihan tembolok (*cache*) Next.js menggunakan fungsi revalidatePath('/sowan-kyai'), sehingga artikel terbaru dapat langsung diakses publik dalam hitungan detik.

### **2.2 Pillar 2: BIPEKA & Sektoral Portal (RKI & KTA Online)**

Pilar ini berfokus pada pemberdayaan sosial masyarakat melalui penguatan ketahanan keluarga yang dikelola oleh Bidang Perempuan dan Ketahanan Keluarga (BIPEKA), serta memfasilitasi konversi dukungan politik simpatisan menjadi keanggotaan formal partai secara digital melalui platform registrasi KTA Online.5

#### **1\. Fitur Portal Rumah Keluarga Indonesia (RKI)**

RKI berfungsi sebagai ruang edukasi publik yang berfokus pada pengarusutamaan peran keluarga sebagai fondasi pembangunan karakter generasi masa depan bangsa.6 Fitur ini menyediakan modul pembelajaran mandiri (parenting Islam, ketahanan ekonomi, regulasi konflik rumah tangga) serta jadwal konsultasi keluarga yang diselenggarakan secara luring maupun daring oleh BIPEKA PKS Pamekasan.6

#### **2\. Fitur Formulir Registrasi KTA Online**

Menyediakan mekanisme pendaftaran keanggotaan PKS secara mandiri bagi warga Pamekasan.5 Sistem harus mengumpulkan data identitas yang valid, mengunggah berkas penunjang, serta memprosesnya ke dalam antrean verifikasi administratif pengurus daerah secara aman.13

#### **3\. User Stories**

* **Sebagai Public Visitor (Simpatisan PKS di Pamekasan)**, pengguna ingin mengakses modul pembinaan keluarga sakinah di portal RKI dan mendaftarkan diri menjadi anggota resmi PKS melalui formulir online agar mendapatkan kartu tanda anggota resmi tanpa harus mendatangi kantor sekretariat fisik.5  
* **Sebagai Admin BIPEKA & Humas**, pengelola ingin memantau daftar masuk calon anggota baru, memverifikasi dokumen KTP yang diunggah, serta mengekspor metadata pendaftar ke format lembar kerja spreadsheet untuk kebutuhan pendaftaran Sipol KPU.5

#### **4\. Acceptance Criteria (Gherkin Format)**

##### **Skenario 1: Mengakses Modul Pembelajaran RKI**

* **Given** pengguna berada di halaman utama portal "Rumah Keluarga Indonesia" (RKI).6  
* **When** pengguna memilih salah satu modul edukasi (misal: "Seminar Parenting" atau "Tips Ketahanan Ekonomi Keluarga").12  
* **Then** sistem harus menampilkan isi artikel secara lengkap disertai sematan (*embed*) pemutar video edukasi yang ramah pembaca layar (screen-reader friendly).  
* **And** sistem harus menyediakan tombol unduh berkas panduan PDF yang terhubung secara aman dengan media penyimpanan awan (cloud storage) terenkripsi SSL.

##### **Skenario 2: Melakukan Pendaftaran KTA Baru dengan Validasi Berkas Lengkap**

* **Given** pengguna membuka halaman "Pendaftaran Anggota PKS".5  
* **When** pengguna mengisi seluruh kolom wajib: Nomor Induk Kependudukan (NIK 16 digit), Nama Lengkap (sesuai KTP), Tempat & Tanggal Lahir, Jenis Kelamin, Golongan Darah, Alamat Lengkap (Kecamatan, Desa/Kelurahan, RT/RW), Status Pernikahan, Pekerjaan, Pendidikan Terakhir, Nomor WhatsApp, mengunggah berkas foto KTP asli, serta foto diri setengah badan.5  
* **And** pengguna menandai kotak pernyataan wajib "Saya menyatakan bahwa saya bukan merupakan pengurus/anggota dari partai politik lain".5  
* **And** pengguna menekan tombol "Kirim Pendaftaran".  
* **Then** sistem harus menjalankan validasi di sisi klien (regex format NIK dan nomor handphone) serta validasi sisi server (keabsahan file gambar, ukuran maksimal 2MB, dan pengecekan duplikasi NIK di database NeonDB).13  
* **And** jika data valid, sistem harus mengenkripsi data sensitif (NIK dan Foto KTP) menggunakan standar Advanced Encryption Standard (AES-256) sebelum disimpan ke dalam NeonDB, lalu menampilkan notifikasi sukses: "Pendaftaran Berhasil dikirim. Tim Humas akan memverifikasi data Anda.".5

##### **Skenario 3: Ekspor Data Anggota oleh Admin untuk Sipol KPU**

* **Given** admin telah masuk ke dasbor CMS dengan hak akses khusus sekretariat.  
* **When** admin mengakses tab "Manajemen Anggota KTA" dan menekan tombol "Ekspor Data Sipol (.csv)".15  
* **Then** sistem harus menghasilkan dokumen CSV yang terstruktur rapi sesuai format kolom yang diisyaratkan oleh aplikasi Sipol KPU RI.15  
* **And** sistem harus menyembunyikan/menghapus kunci dekripsi data KTP pada file ekspor tersebut guna menjaga kerahasiaan data pribadi sesuai regulasi perlindungan data konsumen.

### **2.3 Pillar 3: E-Aspirasi via WhatsApp Hot-Routing**

Pilar ketiga menjembatani kebutuhan mendesak konstituen dalam menyampaikan aduan pembangunan, layanan sosial, dan infrastruktur langsung kepada perwakilan legislatif PKS di DPRD Kabupaten Pamekasan.7 Fitur ini secara cerdas memetakan wilayah asal pengadu menuju staf ahli dewan dari Dapil yang relevan untuk memastikan penanganan yang responsif.7

#### **1\. Mekanisme Pemetaan Konstituen Berdasarkan Daerah Pemilihan (Dapil)**

Untuk memudahkan masyarakat awam yang sering kali tidak mengetahui pembagian nomor Dapil mereka, formulir aduan hanya menyediakan pilihan wilayah kecamatan.8 Sistem kemudian secara otomatis memetakan kecamatan tersebut ke anggota legislatif terpilih Pemilu 2024 dari Fraksi PKS.7

| Daerah Pemilihan (Dapil) | Wilayah Kecamatan Cakupan | Anggota DPRD PKS Terpilih (2024-2029) | Perolehan Suara Sah | Target Nomor WhatsApp Staf Penerima |
| :---- | :---- | :---- | :---- | :---- |
| **DAPIL 1** | Pamekasan, Tlanakan 9 | **Suryono** 7 | 4,964 Suara 7 | Staf Ahli Suryono (Dapil 1\) |
| **DAPIL 2** | Proppo, Palengaan 7 | **H. Imam Ghozali** 7 | 8,647 Suara 7 | Staf Ahli H. Imam Ghozali (Dapil 2\) |
| **DAPIL 3** | Batumarmar, Pasean, Waru 8 | **Juma'ah** 7 | 6,906 Suara 7 | Staf Ahli Juma'ah (Dapil 3\) |
| **DAPIL 4** | Kadur, Pakong, Pegantenan 8 | *Tidak ada kursi PKS* 7 | N/A | Humas DPD PKS Pamekasan (Default) |
| **DAPIL 5** | Galis, Larangan, Pademawu 8 | **Ita Kusmita** 7 | 4,270 Suara 7 | Staf Ahli Ita Kusmita (Dapil 5\) |

#### **2\. Analisis Keamanan dan Proteksi Sistem dengan Upstash Rate Limit**

Karena formulir ini bersifat publik dan dapat diakses oleh pengguna tanpa otentikasi (anonim), fitur ini rentan terhadap serangan spamming, bot otomatis, atau upaya DDoS yang berpotensi merusak database dan membebani nomor WhatsApp operasional staf ahli.14  
Untuk memitigasi risiko ini, dipasang proteksi berlapis menggunakan **Upstash Rate Limit** berbasis algoritma *Sliding Window*.17 Setiap alamat IP pengunjung dibatasi maksimal hanya dapat melakukan **3 kali submit formulir per 24 jam**.20 Batasan ini dinilai cukup longgar bagi pengguna normal yang ingin menyampaikan aduan darurat, sekaligus sangat kokoh untuk memblokir script eksploitasi otomatis di tingkat jaringan Edge Node Vercel terdekat sebelum sempat memproses kueri ke database NeonDB.18

#### **3\. User Stories**

* **Sebagai Warga Masyarakat Pamekasan (Konstituen)**, pengadu ingin mengisi formulir pengaduan sederhana yang secara otomatis mendeteksi dan mengalihkan jalur komunikasi langsung ke nomor WhatsApp staf legislatif pendamping dewan yang mewakili wilayah domisili pengadu agar masalah kedaruratan daerah segera ditindaklanjuti secara taktis.7  
* **Sebagai Staf Ahli Legislator PKS**, penerima pengaduan ingin menerima pesan WhatsApp dalam format teks yang rapi, berisikan identitas pelapor yang jelas, wilayah asal, serta pokok permasalahan tanpa perlu menyalin-tempel informasi secara manual.

#### **4\. Acceptance Criteria (Gherkin Format)**

##### **Skenario 1: Routing Otomatis Berdasarkan Pilihan Kecamatan Domisili**

* **Given** pengguna berada pada halaman formulir "E-Aspirasi" di website.  
* **When** pengguna mengisi nama "Arifin", memilih kecamatan "Batumarmar" pada dropdown kecamatan, dan menulis pesan aduan "Jalan berlubang parah di Desa Lesong Daya".8  
* **Then** sistem secara dinamis mendeteksi bahwa kecamatan tersebut masuk ke dalam cakupan wilayah administratif Dapil 3\.8  
* **And** sistem mengarahkan target tautan WhatsApp menuju nomor kontak Staf Ahli Juma'ah (DPRD Dapil 3 Fraksi PKS).7

##### **Skenario 2: Pemblokiran Akses Berlebih Menggunakan Upstash Rate Limit (IP-Based)**

* **Given** pengguna dengan alamat IP 180.252.XX.XX telah melakukan submit pengaduan sebanyak 3 kali dalam kurun waktu 24 jam terakhir.20  
* **When** pengguna mencoba mengirimkan aduan ke-4 pada hari yang sama menggunakan formulir yang sama.  
* **Then** sistem di sisi server (Server Action Next.js) harus mendeteksi batas kuota limit IP dari Upstash Redis.18  
* **And** sistem membatalkan proses penulisan ke NeonDB dan mengembalikan respon kesalahan status HTTP 429\.14  
* **And** halaman web menampilkan modal peringatan merah: "Akses diblokir sementara. Anda telah melebihi batas pengiriman aspirasi harian (Maksimal 3 kali dalam 24 jam)".14

##### **Skenario 3: Pembuatan Link Teks WhatsApp Terstruktur dan Aman**

* **Given** data aduan pengguna dinyatakan lolos verifikasi validasi dan batasan jaringan siber.20  
* **When** pengguna menekan tombol "Kirim Aspirasi Sekarang".  
* **Then** sistem harus menyimpan log metadata aduan secara anonim ke NeonDB (untuk keperluan statistik performa penanganan isu oleh KOMDIGI).  
* **And** sistem di sisi klien mengeksekusi fungsi pengalihan url aman window.open menuju tautan eksternal WhatsApp API yang telah terenkoding URL secara sempurna 17: https://wa.me/6283333333333?text=BISMILLAH%20-%20ASPIRASI%20WARGA%20PAMEKASAN%0A%0A\*Nama%20Pelapor\*:%20Arifin%0A\*Domisili\*:%20Kecamatan%20Batumarmar%20(Dapil%203)%0A\*Isi%20Aduan%20Masyarakat\*:%20Jalan%20berlubang%20parah%20di%20Desa%20Lesong%20Daya.%0A%0A\_Aspirasi%20ini%20dikirim%20resmi%20lewat%20Portal%20E-Aspirasi%20DPD%20PKS%20Pamekasan.\_

#### **5\. Spesifikasi Implementasi Teknis Next.js (Client-Side & Server-Side Code)**

Berikut adalah cetak biru arsitektur kode pemrograman untuk mengimplementasikan fitur *Hot-Routing* dinamis yang aman dan efisien di Next.js menggunakan Tailwind CSS dan integrasi Upstash Rate Limit.17

##### **A. Struktur Data Pemetaan Wilayah dan Kontak Staf Ahli (/config/routing-map.ts)**

TypeScript  
export interface LegislatorContact {  
  dapilId: number;  
  dewanName: string;  
  staffPhone: string; // Format internasional tanpa simbol '+'  
  districts: string;  
}

export const LEGISLATOR\_DAPIL\_MAP: Record\<number, LegislatorContact\> \= {  
  1: {  
    dapilId: 1,  
    dewanName: "Suryono",  
    staffPhone: "6281111111111", // Nomor Staf Ahli Suryono   
    districts:  
  },  
  2: {  
    dapilId: 2,  
    dewanName: "H. Imam Ghozali",  
    staffPhone: "6282222222222", // Nomor Staf Ahli H. Imam Ghozali   
    districts: \["Proppo", "Palengaan"\]  
  },  
  3: {  
    dapilId: 3,  
    dewanName: "Juma'ah",  
    staffPhone: "6283333333333", // Nomor Staf Ahli Juma'ah   
    districts:  
  },  
  5: {  
    dapilId: 5,  
    dewanName: "Ita Kusmita",  
    staffPhone: "6285555555555", // Nomor Staf Ahli Ita Kusmita   
    districts: \["Galis", "Larangan", "Pademawu"\]  
  }  
};

export const DEFAULT\_HUMAS\_CONTACT: LegislatorContact \= {  
  dapilId: 4,  
  dewanName: "Humas DPD PKS Pamekasan (Default)",  
  staffPhone: "6284444444444", // Nomor Admin Humas DPD   
  districts: \["Kadur", "Pakong", "Pegantenan"\]  
};

// Fungsi penolong untuk mendapatkan kontak berdasarkan kecamatan domisili  
export function getContactByDistrict(districtName: string): LegislatorContact {  
  const matchedDapil \= Object.values(LEGISLATOR\_DAPIL\_MAP).find(contact \=\>   
    contact.districts.includes(districtName)  
  );  
  return matchedDapil || DEFAULT\_HUMAS\_CONTACT;  
}

##### **B. Proteksi Sisi Server Menggunakan Upstash Redis Rate Limiting (/app/actions/send-aspirasi.ts)**

TypeScript  
"use server";

import { headers } from "next/headers";  
import { Ratelimit } from "@upstash/ratelimit";  
import { Redis } from "@upstash/redis";

// Inisialisasi koneksi SDK Upstash menggunakan variabel lingkungan yang aman \[17, 18\]  
const redis \= new Redis({  
  url: process.env.UPSTASH\_REDIS\_REST\_URL\!,  
  token: process.env.UPSTASH\_REDIS\_REST\_TOKEN\!,  
});

// Pembatasan ketat: Maksimal 3 pengiriman per IP per 24 jam (86400 detik)   
const rateLimiter \= new Ratelimit({  
  redis,  
  limiter: Ratelimit.slidingWindow(3, "86400 s"),  
  analytics: true,  
  prefix: "pks\_pamekasan\_rl\_aspirasi",  
});

export async function processAspirasiValidation() {  
  const headerList \= await headers();  
    
  // Ekstraksi alamat IP asli di belakang proksi Vercel secara aman \[14, 20\]  
  const forwardedFor \= headerList.get("x-forwarded-for");  
  const ip \= forwardedFor? forwardedFor.split(",").trim() : (headerList.get("x-real-ip") || "127.0.0.1");

  const { success, limit, reset, remaining } \= await rateLimiter.limit(\`ip:${ip}\`);

  if (\!success) {  
    const timeRemainingInHours \= Math.ceil((reset \- Date.now()) / (1000 \* 60 \* 60));  
    return {  
      allowed: false,  
      error: \`Anda mendeteksi aktivitas berlebih. Sesuai aturan keamanan siber, akses dibatasi sementara. Coba kembali dalam ${timeRemainingInHours} jam.\`,  
      remaining,  
      reset  
    };  
  }

  // TODO: Simpan log pengaduan anonim ke NeonDB di sini demi keperluan audit internal  
  return {  
    allowed: true,  
    remaining,  
    reset  
  };  
}

##### **C. Komponen Antarmuka Form Sisi Klien (/components/AspirasiForm.tsx)**

TypeScript  
"use client";

import React, { useState, useTransition } from "react";  
import { getContactByDistrict } from "@/config/routing-map";  
import { processAspirasiValidation } from "@/app/actions/send-aspirasi";

const PAMEKASAN\_DISTRICTS \=;

export default function AspirasiForm() {  
  const \[nama, setNama\] \= useState("");  
  const \[kecamatan, setKecamatan\] \= useState("");  
  const \[aduan, setAduan\] \= useState("");  
  const \[errorMessage, setErrorMessage\] \= useState\<string | null\>(null);  
  const \= useTransition();

  const selectedContact \= getContactByDistrict(kecamatan);

  const handleFormSubmit \= async (e: React.FormEvent) \=\> {  
    e.preventDefault();  
    setErrorMessage(null);

    if (\!nama ||\!kecamatan ||\!aduan) {  
      setErrorMessage("Seluruh kolom formulir wajib diisi\!");  
      return;  
    }

    startTransition(async () \=\> {  
      // Validasi rate limit di sisi server (mencegah manipulasi klien)   
      const response \= await processAspirasiValidation();

      if (\!response.allowed) {  
        setErrorMessage(response.error);  
        return;  
      }

      // Bangun struktur pesan teks WA terenkoding dengan baik   
      const textMessage \=   
        \`🚨 \*BISMILLAH \- ASPIRASI WARGA PAMEKASAN\* 🚨\\n\\n\` \+  
        \`\*Nama Pelapor\* : ${nama}\\n\` \+  
        \`\*Domisili\* : Kecamatan ${kecamatan} (Dapil ${selectedContact.dapilId})\\n\` \+  
        \`\*Isi Aduan\* : \\n"${aduan}"\\n\\n\` \+  
        \`\_Aspirasi ini dikirim resmi lewat Portal E-Aspirasi DPD PKS Pamekasan.\_\`;

      const encodedText \= encodeURIComponent(textMessage);  
      const targetUrl \= \`https://wa.me/${selectedContact.staffPhone}?text=${encodedText}\`;

      // Pengalihan tautan aman di tab browser baru untuk mencegah tab-jacking  
      window.open(targetUrl, "\_blank", "noopener,noreferrer");  
        
      // Bersihkan formulir setelah pengalihan berhasil dilakukan  
      setNama("");  
      setAduan("");  
    });  
  };

  return (  
    \<div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg transition-colors duration-300"\>  
      \<h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6"\>Kirim Aspirasi Rakyat\</h2\>  
        
      {errorMessage && (  
        \<div className="p-4 mb-4 text-sm text-red-800 bg-red-50 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-900/50 rounded-lg" role="alert"\>  
          {errorMessage}  
        \</div\>  
      )}

      \<form onSubmit={handleFormSubmit} className="space-y-4"\>  
        \<div\>  
          \<label htmlFor="nama-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"\>Nama Lengkap\</label\>  
          \<input  
            id="nama-input"  
            type="text"  
            value={nama}  
            onChange={(e) \=\> setNama(e.target.value)}  
            disabled={isPending}  
            className="w-full min-h-\[44px\] px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"  
            placeholder="Masukkan nama lengkap Anda..."  
            required  
          /\>  
        \</div\>

        \<div\>  
          \<label htmlFor="kecamatan-select" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"\>Kecamatan Domisili\</label\>  
          \<select  
            id="kecamatan-select"  
            value={kecamatan}  
            onChange={(e) \=\> setKecamatan(e.target.value)}  
            disabled={isPending}  
            className="w-full min-h-\[44px\] px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"  
            required  
          \>  
            \<option value=""\>-- Pilih Kecamatan \--\</option\>  
            {PAMEKASAN\_DISTRICTS.map((district) \=\> (  
              \<option key={district} value={district}\>{district}\</option\>  
            ))}  
          \</select\>  
        \</div\>

        {kecamatan && (  
          \<div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 rounded-md border border-zinc-200 dark:border-zinc-700"\>  
            Aspirasi akan otomatis diarahkan ke: \<strong className="text-zinc-900 dark:text-zinc-200"\>{selectedContact.dewanName} (Dapil {selectedContact.dapilId})\</strong\>   
          \</div\>  
        )}

        \<div\>  
          \<label htmlFor="aduan-textarea" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"\>Aduan / Masalah Kedaruratan\</label\>  
          \<textarea  
            id="aduan-textarea"  
            rows={4}  
            value={aduan}  
            onChange={(e) \=\> setAduan(e.target.value)}  
            disabled={isPending}  
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"  
            placeholder="Tuliskan detail permasalahan infrastruktur atau keluhan sosial Anda..."  
            required  
          /\>  
        \</div\>

        \<button  
          type="submit"  
          disabled={isPending}  
          className="w-full min-h-\[44px\] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md transition-colors focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 disabled:opacity-50"  
        \>  
          {isPending? "Memverifikasi Akses..." : "Hubungkan ke WhatsApp Staf Dewan"}  
        \</button\>  
      \</form\>  
    \</div\>  
  );  
}

### **2.4 Aksesibilitas WCAG 2.1 AA (Toggle Contrast & Resizer Widget)**

Inklusivitas digital menjadi pilar penting bagi DPD PKS Pamekasan untuk memastikan bahwa seluruh konstituen, termasuk lansia dan individu dengan gangguan penglihatan (*low vision*), dapat mengonsumsi informasi politik tanpa hambatan fungsional.1

\+--------------------------------------------------------------------------+  
|                     BAR AKSESIBILITAS WCAG 2.1 AA                        |  
\+--------------------------------------------------------------------------+  
|                                                                          |  
|  \[ A- \]  \[ A \]  \[ A+ \]    |  
|                                                                          |  
\+--------------------------------------------------------------------------+  
| Aturan Aksesibilitas:                                                    |  
| \- Ukuran Target Sentuh (Touch Target) minimum: 44px x 44px        |  
| \- Rasio Kontras Teks Normal: \>= 4.5:1 terhadap latar belakang     |  
| \- Rasio Kontras Teks Besar:  \>= 3.0:1 terhadap latar belakang     |  
| \- Skala Ukuran Teks: 100% \-\> 125% \-\> 150% \-\> 200% tanpa rusak     |  
\+--------------------------------------------------------------------------+

#### **1\. Aturan Kepatuhan WCAG 2.1 AA**

* **Rasio Kontras Warna (SC 1.4.3):** Elemen teks berukuran normal (di bawah 18pt) wajib memiliki rasio kontras minimal **4.5:1** terhadap latar belakangnya.2 Untuk teks berukuran besar (18pt ke atas atau 14pt tebal), rasio kontras minimal adalah **3:1**.2  
* **Resize Text (SC 1.4.4):** Pengguna harus dapat memperbesar teks hingga **200%** tanpa merusak tata letak struktural (*layout breakdown*), menyebabkan teks tumpang tindih (*overlapping text*), atau menghilangkan navigasi penting pada antarmuka web.1  
* **Touch Target Minimum (SC 2.5.5 \- Level AAA Alignment):** Seluruh elemen interaktif, tombol, dan pilihan dropdown pada website wajib memiliki ukuran target sentuh minimum **44px x 44px** guna mempermudah akses bagi penyandang disabilitas motorik halus atau lansia.3

#### **2\. User Stories**

* **Sebagai Kader Senior (Lansia) di Pamekasan**, pengguna ingin mengaktifkan opsi "Kontras Tinggi" dan memperbesar ukuran huruf hingga 200% melalui panel kontrol aksesibilitas agar dapat membaca rilis berita dakwah dan silsilah kiai di rubrik sowan tanpa kelelahan mata.1  
* **Sebagai Developer/Pengembang Sistem**, tim teknis ingin menyediakan konfigurasi standar CSS kelas utilitas yang mematuhi prefers-contrast dan menyimpan pengaturan preferensi pengguna ke penyimpanan lokal browser (*localStorage*) guna memberikan pengalaman pengguna yang mulus saat transisi antar halaman.2

#### **3\. Acceptance Criteria (Gherkin Format)**

##### **Skenario 1: Penerapan Mode High Contrast (Warna Kontras Tinggi)**

* **Given** pengguna berada di halaman manapun di dalam website DPD PKS Pamekasan.  
* **When** pengguna mengklik tombol "Kontras Tinggi" pada widget aksesibilitas.  
* **Then** sistem harus menambahkan kelas CSS high-contrast ke elemen root \<html\>.2  
* **And** warna latar belakang seluruh situs web beralih menjadi hitam pekat (\#000000) dan warna teks beralih menjadi kuning terang (\#FFFF00) atau putih murni (\#FFFFFF) guna memastikan rasio kontras di atas 7:1 (Lolos Kriteria AAA).2

##### **Skenario 2: Mengubah Skala Font Tanpa Merusak Tata Letak**

* **Given** ukuran dasar teks situs web diatur menggunakan satuan rem (1rem \= 16px).22  
* **When** pengguna menekan tombol perbesar teks ("A+") pada bar widget aksesibilitas.  
* **Then** sistem harus memperbesar skala teks secara bertahap dari 100% \-\> 125% \-\> 150% \-\> maksimal 200%.1  
* **And** seluruh wadah penampung teks (card, header, form) menyesuaikan ukurannya secara dinamis menggunakan properti elastis flexbox/grid Tailwind tanpa ada elemen visual yang bertumpuk atau terpotong.22

##### **Skenario 3: Mempertahankan Sesi Aksesibilitas Pengguna (Sesssion Retention)**

* **Given** pengguna telah memilih pengaturan skala huruf "150%" dan mengaktifkan mode kontras tinggi.  
* **When** pengguna berpindah halaman dari halaman Profil Pimpinan ke halaman Portal RKI.6  
* **Then** sistem harus mendeteksi konfigurasi tersebut dari *localStorage* sebelum proses *rendering* halaman selesai.  
* **And** sistem mempertahankan tampilan kontras tinggi dan skala font tanpa adanya kedipan visual transisi (*unstyled content flash*).

#### **4\. Spesifikasi Teknis Konfigurasi Tema Aksesibilitas**

##### **A. Perluasan Tema Tailwind (tailwind.config.js)**

JavaScript  
/\*\* @type {import('tailwindcss').Config} \*/  
module.exports \= {  
  darkMode: 'class',  
  theme: {  
    extend: {  
      colors: {  
        // Skema warna standar yang telah terverifikasi kontras rasio AA \[3, 21\]  
        brand: {  
          orange: "\#F26522",  
          dark: "\#1A1A1A"  
        },  
        accessibility: {  
          hcBg: "\#000000",  
          hcFg: "\#FFFF00",  
          hcBorder: "\#FFFF00",  
          hcActive: "\#FFFFFF"  
        }  
      }  
    },  
  },  
  plugins:,  
}

##### **B. Aturan Cascading Style Sheet Global (/styles/globals.css)**

CSS  
@layer base {  
  /\* Skala ukuran font dinamis berbasis rem pada root tag html  \*/  
  html {  
    font-size: 16px;  
    transition: font-size 0.2s ease-in-out;  
  }  
    
  html.scale-100 {  
    font-size: 16px;  
  }  
    
  html.scale-125 {  
    font-size: 20px; /\* Perbesaran 1.25x  \*/  
  }  
    
  html.scale-150 {  
    font-size: 24px; /\* Perbesaran 1.5x  \*/  
  }  
    
  html.scale-200 {  
    font-size: 32px; /\* Perbesaran maksimal 2x  \*/  
  }

  /\* Override Kontras Tinggi untuk Kepatuhan WCAG 2.1 AA  \*/  
  html.high-contrast {  
    background-color: \#000000\!important;  
    color: \#ffff00\!important;  
  }

  html.high-contrast body {  
    background-color: \#000000\!important;  
    color: \#ffff00\!important;  
  }

  /\* Memaksa kontras penuh pada seluruh elemen interaktif \*/  
  html.high-contrast a,  
  html.high-contrast p,  
  html.high-contrast span,  
  html.high-contrast h1,  
  html.high-contrast h2,  
  html.high-contrast h3,  
  html.high-contrast h4,  
  html.high-contrast label,  
  html.high-contrast strong {  
    color: \#ffff00\!important;  
    background-color: transparent\!important;  
  }

  html.high-contrast button,  
  html.high-contrast select,  
  html.high-contrast input,  
  html.high-contrast textarea {  
    background-color: \#000000\!important;  
    color: \#ffff00\!important;  
    border: 2px solid \#ffff00\!important;  
  }

  html.high-contrast button:focus,  
  html.high-contrast a:focus,  
  html.high-contrast input:focus {  
    outline: 4px solid \#ffffff\!important;  
    outline-offset: 3px\!important; /\* Indikator fokus visual yang sangat kontras  \*/  
  }

  /\* Dukungan deteksi otomatis preferensi tingkat sistem operasi  \*/  
  @media (prefers-contrast: more) {  
    html:not(.high-contrast-disabled) {  
      background-color: \#000000;  
      color: \#ffff00;  
    }  
  }  
}

## **BAB 3: BATASAN RUANG LINGKUP MVP (MVP SCOPE & LIMITS)**

Guna memastikan bahwa Website Resmi DPD PKS Pamekasan dapat segera diluncurkan guna mengimbangi agenda pelayanan dakwah di lapangan, ditentukan batasan fungsionalitas produk yang masuk ke dalam ruang lingkup Fase MVP dan fitur yang ditangguhkan ke Fase Pasca-MVP.

### **3.1 Matriks Perbandingan Fitur Fase MVP dan Pasca-MVP**

Matriks di bawah ini memaparkan batasan pengerjaan teknis yang disepakati untuk proses rilis cepat namun tetap bernilai tinggi.

| Cakupan Modul | Fitur Fase MVP (Rilis Cepat & Fungsional) | Fitur Pasca-MVP (Pengembangan Lanjutan) | Justifikasi Strategis PM |
| :---- | :---- | :---- | :---- |
| **Aspirasi Publik** | Formulir *Hot-Routing* berbasis Next.js Client-Side redirect langsung ke WhatsApp Staf Ahli Dewan.7 | Integrasi API Gateway Resmi, Sistem Tiket Terpusat, SMS Gateway, Chatbot AI Otomatis. | Menghindari biaya langganan API pihak ketiga yang mahal di awal rilis, memanfaatkan infrastruktur WhatsApp yang gratis.17 |
| **Keamanan Form** | *Upstash Rate Limit* berbasis IP (Maksimal 3 aduan per 24 jam).17 | Otentikasi verifikasi biometrik wajah, integrasi sistem tanda tangan digital tersertifikasi. | Melindungi sistem dari DDoS bot tanpa mengurangi kenyamanan pengguna anonim.19 |
| **Sistem Anggota** | Formulir KTA digital, enkripsi data KTP (AES-256), ekspor file CSV untuk verifikasi manual.13 | Pencetakan KTA otomatis terintegrasi mesin printer kartu, gerbang e-wallet kartu anggota. | Fokus mengumpulkan data dan koordinasi internal terlebih dahulu demi verifikasi fisik lapangan.5 |
| **Aksesibilitas** | Widget Toggle Kontras Tinggi & Skala Ukuran Font (100% \- 200%) berbasis client cookie.1 | Pembuat audio pidato otomatis (*text-to-speech*), asisten perintah suara bahasa Madura halus. | Memenuhi standar kepatuhan hukum WCAG 2.1 AA dengan biaya pengembangan minimal.2 |
| **Arsitektur Data** | Penyimpanan awan serverless NeonDB dengan perlindungan enkripsi SSL aktif. | Sinkronisasi multi-master database real-time on-premise di kantor DPD Pamekasan. | Meminimalkan biaya operasional server fisik serta menyederhanakan proses pemeliharaan tim internal. |

Dokumen Spesifikasi Kebutuhan Produk (PRD) Bab 1 dan Bab 2 ini telah disusun dengan presisi enterprise dan siap untuk diserahkan kepada tim arsitek kecerdasan buatan (*Chief AI Architect*) serta tim pengembang Next.js untuk dieksekusi ke tahap pengodean produksi.

#### **Karya yang dikutip**

1. Web Content Accessibility Guidelines (WCAG) 2.1 \- W3C, diakses Mei 18, 2026, [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)  
2. \[feature\]: Add a high-contrast mode for better readability (WCAG AA accessibility) · Issue \#6261 \- GitHub, diakses Mei 18, 2026, [https://github.com/hoppscotch/hoppscotch/issues/6261](https://github.com/hoppscotch/hoppscotch/issues/6261)  
3. Tailwind Accessibility Kit (Free) \- TheFrontKit, diakses Mei 18, 2026, [https://thefrontkit.com/tailwind-accessibility-starter-kit](https://thefrontkit.com/tailwind-accessibility-starter-kit)  
4. sejarah pengawasan pemilu di jawa timur (1999-2019) \- Bawaslu Jatim, diakses Mei 18, 2026, [https://jatim.bawaslu.go.id/sites/prov\_jatim/files/uploads/2020/01/Sejarah-Pengawasan-Pemilu-Di-Jawa-Timur-1999-2019.pdf](https://jatim.bawaslu.go.id/sites/prov_jatim/files/uploads/2020/01/Sejarah-Pengawasan-Pemilu-Di-Jawa-Timur-1999-2019.pdf)  
5. Cara Bergabung Menjadi Anggota PKS Ciamis, diakses Mei 18, 2026, [https://ciamis.pks.id/cara-bergabung-menjadi-anggota-pks-ciamis/](https://ciamis.pks.id/cara-bergabung-menjadi-anggota-pks-ciamis/)  
6. Launching Rumah Keluarga Indonesia (RKI) PKS Bali: Kokohkan Keluarga untuk Masa Depan Indonesia, diakses Mei 18, 2026, [https://bali.pks.id/launching-rumah-keluarga-indonesia-rki-pks-bali-kokohkan-keluarga-untuk-masa-depan-indonesia/](https://bali.pks.id/launching-rumah-keluarga-indonesia-rki-pks-bali-kokohkan-keluarga-untuk-masa-depan-indonesia/)  
7. KPU Pamekasan Tetapkan 45 Anggota DPRD Periode 2024-2029 Melalui Rapat Pleno Terbuka | Bawaslu, diakses Mei 18, 2026, [https://pamekasan.bawaslu.go.id/berita/kpu-pamekasan-tetapkan-45-anggota-dprd-periode-2024-2029-melalui-rapat-pleno-terbuka](https://pamekasan.bawaslu.go.id/berita/kpu-pamekasan-tetapkan-45-anggota-dprd-periode-2024-2029-melalui-rapat-pleno-terbuka)  
8. Dewan Perwakilan Rakyat Daerah Kabupaten Pamekasan \- Wikipedia bahasa Indonesia, ensiklopedia bebas, diakses Mei 18, 2026, [https://id.wikipedia.org/wiki/Dewan\_Perwakilan\_Rakyat\_Daerah\_Kabupaten\_Pamekasan](https://id.wikipedia.org/wiki/Dewan_Perwakilan_Rakyat_Daerah_Kabupaten_Pamekasan)  
9. Ismail, Anggota DPRD Kab. Pamekasan 2019-2024, Demokrat \- JariUngu.com, diakses Mei 18, 2026, [https://jariungu.com/caleg\_2019.php?idCaleg2019=171548](https://jariungu.com/caleg_2019.php?idCaleg2019=171548)  
10. Undangan Pertemuan DPC PKS Pamekasan | PDF \- Scribd, diakses Mei 18, 2026, [https://www.scribd.com/document/881289201/UND-DPC-Deklarasi-Paslon-Tauhid](https://www.scribd.com/document/881289201/UND-DPC-Deklarasi-Paslon-Tauhid)  
11. (PDF) Fesyen yang Tak Pernah Mati \- ResearchGate, diakses Mei 18, 2026, [https://www.researchgate.net/publication/385492417\_Fesyen\_yang\_Tak\_Pernah\_Mati](https://www.researchgate.net/publication/385492417_Fesyen_yang_Tak_Pernah_Mati)  
12. BIPEKA DPW PKS Bengkulu Gelar Seminar Keluarga dan Luncurkan Program Rumah Keluarga Indonesia | Teropong Publik, diakses Mei 18, 2026, [https://www.teropongpublik.co.id/bipeka-dpw-pks-bengkulu-gelar-seminar-keluarga-dan-luncurkan-program-rumah-keluarga-indonesia](https://www.teropongpublik.co.id/bipeka-dpw-pks-bengkulu-gelar-seminar-keluarga-dan-luncurkan-program-rumah-keluarga-indonesia)  
13. Pendaftaran Anggota Partai Keadilan Sejahtera, diakses Mei 18, 2026, [https://daftar.pksjabar.id/](https://daftar.pksjabar.id/)  
14. Rate-limiting Server Actions in Next.js, diakses Mei 18, 2026, [https://nextjsweekly.com/blog/rate-limiting-server-actions](https://nextjsweekly.com/blog/rate-limiting-server-actions)  
15. Jelang Pendaftaran Parpol, PKS Bukittinggi 100% Siap Jadi Peserta Pemilu 2024, diakses Mei 18, 2026, [https://bukittinggi.pks.id/2022/07/jelang-pendaftaran-parpol-pks.html](https://bukittinggi.pks.id/2022/07/jelang-pendaftaran-parpol-pks.html)  
16. 45 Anggota DPRD Pamekasan Periode 2024-2029 Resmi Dilantik, diakses Mei 18, 2026, [https://pamekasankab.go.id/berita/1407/45-anggota-dprd-pamekasan-periode-20242029-resmi-dilantik](https://pamekasankab.go.id/berita/1407/45-anggota-dprd-pamekasan-periode-20242029-resmi-dilantik)  
17. Rate Limiting Next.js API Routes: In-Memory, Redis, and Plan-Based Limits \- DEV Community, diakses Mei 18, 2026, [https://dev.to/whoffagents/rate-limiting-nextjs-api-routes-in-memory-redis-and-plan-based-limits-5coo](https://dev.to/whoffagents/rate-limiting-nextjs-api-routes-in-memory-redis-and-plan-based-limits-5coo)  
18. Rate Limiting Your Next.js App with Vercel Edge | Upstash Blog, diakses Mei 18, 2026, [https://upstash.com/blog/edge-rate-limiting](https://upstash.com/blog/edge-rate-limiting)  
19. How to Use Redis for Next.js Rate Limiting at the Edge \- OneUptime, diakses Mei 18, 2026, [https://oneuptime.com/blog/post/2026-03-31-redis-nextjs-edge-rate-limiting/view](https://oneuptime.com/blog/post/2026-03-31-redis-nextjs-edge-rate-limiting/view)  
20. Rate Limit on Server Actions : r/nextjs \- Reddit, diakses Mei 18, 2026, [https://www.reddit.com/r/nextjs/comments/1htzt0q/rate\_limit\_on\_server\_actions/](https://www.reddit.com/r/nextjs/comments/1htzt0q/rate_limit_on_server_actions/)  
21. Creating High-Contrast, Accessible Themes with shadcn/ui \- Newline.co, diakses Mei 18, 2026, [https://www.newline.co/@eyalcohen/creating-high-contrast-accessible-themes-with-shadcnui--124da688](https://www.newline.co/@eyalcohen/creating-high-contrast-accessible-themes-with-shadcnui--124da688)  
22. Tailwind CSS Font Size \- Kombai Blog, diakses Mei 18, 2026, [https://kombai.com/tailwind/font-size/](https://kombai.com/tailwind/font-size/)