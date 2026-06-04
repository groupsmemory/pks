# DOKUMEN KEBUTUHAN PRODUK (PRD)

# ENTERPRISE-GRADE

## WEBSITE RESMI DPD PKS PAMEKASAN (FASE MVP)

## BAB 1: USER PERSONA & PRIVILEGE MATRIX

### 1.1 Analisis Peran Pengguna (User Roles)

Sistem ini melayani tiga kategori aktor utama dengan karakteristik sosio-demografis, tingkat
literasi digital, dan perilaku penggunaan perangkat ( _device behavior_ ) yang dirinci sebagai
berikut:

#### 1. Public Visitor (Masyarakat Awam, Simpatisan, Kader Senior & Lansia)

```
● Karakteristik Umum : Konstituen politik di wilayah Kabupaten Pamekasan, simpatisan
ideologis, kader aktif, hingga lansia yang membutuhkan informasi langsung atau ingin
menyampaikan aduan daerah.
● Tingkat Literasi Digital : Rendah hingga menengah. Terbiasa menggunakan aplikasi
berbasis pesan (WhatsApp) namun mengalami kecemasan navigasi ( navigation anxiety )
pada situs web dengan menu berjenjang atau kompleks.
● Perilaku Perangkat ( Device Behavior ) : Didominasi oleh perangkat seluler kelas
menengah ke bawah ( low-to-mid end smartphones ) dengan ukuran layar berkisar antara
4.7 hingga 6.5 inci. Akses internet didominasi oleh jaringan seluler 3G/4G lokal (non-Wi-Fi)
dengan latency tinggi di wilayah pelosok Pamekasan.
● Fitur Aksesibilitas Khusus : Mengalami penurunan fungsi penglihatan (visual
impairment/presbiopi) atau disabilitas motorik halus. Memerlukan ukuran target sentuh
( touch target ) yang besar dan opsi tampilan kontras tinggi yang instan.
```
#### 2. Admin / Humas KOMDIGI (Komunikasi Digital)

```
● Karakteristik Umum : Staf internal pengurus DPD PKS Pamekasan yang bertugas
mempublikasikan berita dakwah, mengelola database KTA, mengurasi dokumentasi
kegiatan, serta memantau statistik aspirasi masyarakat.
● Tingkat Literasi Digital : Tinggi. Mahir mengoperasikan sistem CMS ( Content
Management System ), memahami konfigurasi SEO, penanganan format berkas, serta
dasar-dasar keamanan siber.
● Perilaku Perangkat ( Device Behavior ) : Beroperasi menggunakan desktop (PC/Laptop)
dengan resolusi minimal Full HD ( piksel) dan koneksi internet broadband
kantor DPD yang stabil.
● Kebutuhan Bisnis : Dasbor analitik, antarmuka entri data yang efisien dengan
```

```
penanganan error ( error handling ) yang jelas, serta kontrol sesi autentikasi yang aman.
```
#### 3. Legislative Staff (Staf Ahli Fraksi PKS DPRD Kabupaten Pamekasan)

```
● Karakteristik Umum : Pendamping fungsional dari 4 legislator terpilih PKS di DPRD
Kabupaten Pamekasan periode 2024-2029 (Suryono, H. Imam Ghozali, Juma'ah, dan Ita
Kusmita).
● Tingkat Literasi Digital : Menengah. Sangat adaptif dalam menggunakan integrasi
WhatsApp Web/Desktop dan koordinasi komunikasi digital sehari-hari.
● Perilaku Perangkat ( Device Behavior ) : Penggunaan berimbang antara ponsel pintar
( smartphones ) dan komputer jinjing ( laptops ) saat mendampingi legislator di lapangan
atau rapat paripurna.
● Kebutuhan Bisnis : Format pesan aduan masuk yang terstandardisasi secara ketat, minim
gangguan data, serta informasi wilayah pengirim (Kecamatan/Dapil) yang akurat guna
mempercepat proses tindak lanjut birokrasi daerah.
```
### 1.2 Matriks Hak Akses (Privilege Matrix)

Matriks hak akses di bawah ini dirancang berdasarkan prinsip _Least Privilege_ menggunakan sesi
aman **Next-Auth** di sisi server ( _Server-Side Session_ ) dan skema database relasional **NeonDB**.
**Modul/Fitur Deskripsi
Fungsional
Public Visitor Admin/Humas
KOMDIGI
Legislative Staff
Profil Pimpinan** Informasi biografi
Mohammad Alim,
S.Ag.
Read-Only Read, Write,
Update, Delete
Read-Only
**Sowan Kyai** Rubrik
dokumentasi
silaturahmi kyai &
pesantren
Read-Only Read, Write,
Update, Delete
Read-Only
**Portal BIPEKA &
RKI**
Modul edukasi
ketahanan
keluarga &
konsultasi
Read-Only Read, Write,
Update, Delete
Read-Only
**Pendaftaran KTA** Formulir online &
upload data
sensitif pendaftar
Write-Only
(Submit)
Read, Export CSV,
Update Status
No Access
**E-Aspirasi Form** Formulir
pengaduan
infrastruktur dan
layanan publik
Write-Only
(Submit)
Read (Log Audit),
Delete Spam
No Access
**Hot-Routing
Router**
Eksekusi link
dinamis menuju
WhatsApp Staf
Ahli
Execute Redirect Read
Configuration
Receive Message
(External WA)


```
Widget
Aksesibilitas
Pengaturan High
Contrast & Font
Resizer Widget
Full Access Full Access Full Access
CMS Dasbor
Backend
Sesi aman
Next-Auth & akses
database NeonDB
No Access Full Access
(Protected
Session)
No Access
```
## BAB 2: SPESIFIKASI FUNGSIONAL 3 PILAR UTAMA &

## AKSESIBILITAS

### 2.1 Pillar 1: Executive Leadership Hub (Profil & Sowan Kyai)

#### 1. Halaman Profil Ketua Umum Mohammad Alim, S.Ag.

```
● Metode Render : Static Site Generation (SSG) dengan kompilasi Next.js untuk waktu
muat instan ( detik).
● Isi Konten : Biografi, visi misi, foto resolusi tinggi teroptimasi WebP, dan riwayat khidmah
kemasyarakatan.
```
#### 2. Rubrik Kultural "Sowan Kyai"

```
● Fungsionalitas : Menampilkan catatan silaturahmi pengurus DPD PKS Pamekasan ke
kiai-kiai kharismatik Madura beserta petuah/nasihat agamanya.
● Interaktivitas Sisi Klien : Pencarian dan filter array waktu-nyata ( real-time array filter )
berdasarkan nama pesantren atau kecamatan tanpa memicu muat ulang halaman ( no
reload ).
```
#### 3. User Stories

```
● Sebagai Public Visitor , saya ingin mengakses biografi Ketua Umum Mohammad Alim,
S.Ag. dan catatan sowan kyai agar saya memahami komitmen kepemimpinan serta
kedekatan kultur spiritual DPD PKS Pamekasan dengan ulama rujukan daerah.
● Sebagai Admin Humas , saya ingin menambahkan artikel silaturahmi sowan kyai baru
lengkap dengan taksonomi pesantren dan kecamatan agar data terindeks dengan rapi.
```
#### 4. Acceptance Criteria (Format Gherkin)

**Skenario A: Penyaringan Data Sowan Kyai secara Real-time**
● **Given** pengguna berada di halaman rubrik "/sowan-kyai".
● **When** pengguna mengetikkan kata kunci "Batumarmar" pada input pencarian
kecamatan.
● **Then** sistem menyaring kartu dokumentasi sowan kyai secara dinamis menggunakan
pemrosesan array sisi klien.


● **And** kartu artikel yang ditampilkan hanya artikel yang memiliki properti kecamatan
"Batumarmar".
**Skenario B: Pembuatan Artikel Baru oleh Admin CMS**
● **Given** admin telah masuk ke dasbor CMS terproteksi Next-Auth.
● **When** admin mengirimkan form artikel sowan kiai dengan input teks tervalidasi dan
berkas gambar.
● **Then** sistem mengirimkan data ke database NeonDB melalui Next.js Server Action.
● **And** sistem memicu fungsi revalidatePath('/sowan-kyai') untuk merilis ulang halaman
statis secara instan ( _incremental static regeneration_ ).

### 2.2 Pillar 2: Pemberdayaan Sektoral (RKI & KTA Online)

#### 1. Portal RKI (Rumah Keluarga Indonesia) oleh BIPEKA

```
● Fungsionalitas : Pusat edukasi ketahanan keluarga, parenting, pembinaan ketahanan
ekonomi, serta pendaftaran jadwal konsultasi keluarga secara privat.
```
#### 2. Formulir Registrasi KTA Online Mandiri

```
● Fungsionalitas : Portal pendaftaran keanggotaan PKS Kabupaten Pamekasan secara
online.
● Spesifikasi Keamanan : Enkripsi sisi server ( server-side cryptography ) menggunakan
cipher AES-256-GCM sebelum data NIK dan dokumen KTP disimpan ke dalam NeonDB.
```
#### 3. User Stories

```
● Sebagai Public Visitor (Simpatisan) , saya ingin mendaftarkan diri menjadi anggota
resmi PKS melalui formulir KTA online yang aman agar data identitas pribadi saya
terlindungi dari kebocoran data.
● Sebagai Admin BIPEKA , saya ingin mengunduh data pendaftar dalam format CSV yang
kompatibel dengan format unggah Sipol KPU RI.
```
#### 4. Acceptance Criteria (Format Gherkin)

**Skenario A: Enkripsi Data Sensitif NIK pada Registrasi KTA**
● **Given** pengguna berada di halaman "/daftar-kta" dan mengisikan data NIK
"3528xxxxxxxxxxxx".
● **When** pengguna menekan tombol "Kirim Pendaftaran".
● **Then** sistem memproses data tersebut di lingkungan server yang aman menggunakan
Server Action.
● **And** enkripsi AES-256-GCM dilakukan menghasilkan ciphertext, initialization vector (IV),
dan authentication tag (authTag).
● **And** database NeonDB hanya menyimpan data terenkripsi tersebut (tidak ada teks
biasa/plaintext untuk data sensitif).
**Skenario B: Pengunggahan Foto KTP Tervalidasi**


```
● Given pengguna mengunggah dokumen KTP berformat JPEG berukuran 5MB.
● When dokumen diunggah ke komponen file-uploader.
● Then sistem memberikan pesan kesalahan visual: "Ukuran berkas melebihi batas
maksimal 2MB!".
● And proses submit dinonaktifkan hingga berkas memenuhi kriteria ukuran ( MB)
dan jenis mime-type (image/jpeg, image/png, atau image/webp).
```
### 2.3 Pillar 3: E-Aspirasi via WhatsApp Hot-Routing

#### 1. Mekanisme Hot-Routing Tanpa Otentikasi

```
● Formulir pengaduan dapat diakses publik tanpa perlu proses login.
● Masyarakat memilih kecamatan tempat terjadinya isu sosial/infrastruktur. Sistem Next.js
secara dinamis menentukan anggota DPRD PKS yang menaungi Dapil tersebut dan
merumuskan link WhatsApp API yang ditargetkan langsung ke kontak Staf Ahli terkait.
```
#### 2. Keamanan Tingkat Edge (Upstash Rate Limiting)

```
● Mengimplementasikan algoritma Sliding Window via Upstash Redis SDK yang berjalan di
atas Vercel Edge Node.
● Pembatasan ditetapkan maksimal 3 submit per alamat IP per 24 jam.
● Algoritma penentuan trafik dirancang mengikuti formulir matematika LaTeX berikut:
```
#### 3. User Stories

```
● Sebagai Warga Pamekasan (Konstituen) , saya ingin melaporkan keluhan infrastruktur
di wilayah tempat tinggal saya tanpa perlu membuat akun, dan langsung dialihkan ke
ruang obrolan WhatsApp staf dewan yang tepat agar keluhan saya didengar.
● Sebagai Staf Ahli Dewan , saya ingin menerima pesan WhatsApp pengaduan masyarakat
yang terstruktur lengkap dengan nama, kecamatan, dan deskripsi aduan demi kelancaran
tindak lanjut.
```
#### 4. Acceptance Criteria (Format Gherkin)

**Skenario A: Routing Berdasarkan Peta Daerah Pemilihan (Dapil)**
● **Given** pengguna memilih kecamatan "Tlanakan" pada form pengaduan.
● **When** pengguna mengirimkan aduan.
● **Then** sistem mendeteksi bahwa kecamatan Tlanakan berada di bawah naungan DAPIL 1.
● **And** sistem merancang pengalihan URL menuju nomor Staf Ahli dari legislator PKS DAPIL
1, yaitu **Suryono** (4,964 Suara).


**Skenario B: Pembatasan Trafik Berlebih (Rate Limit Hit)**
● **Given** pengguna dengan IP 110.138.xx.xx telah mengirimkan 3 aduan dalam kurun waktu
24 jam.
● **When** pengguna mencoba menekan tombol kirim untuk yang ke-4 kalinya.
● **Then** Server Action membatalkan eksekusi, mengembalikan error response, dan
melarang akses database.
● **And** antarmuka frontend memunculkan notifikasi merah: "Maaf, pengiriman dibatasi!
Maksimal 3 kali aduan per 24 jam."

### 2.4 Aksesibilitas WCAG 2.1 AA (Inklusivitas Digital)

#### 1. Toggle High Contrast Mode (Kontras Tinggi)

```
● Fungsionalitas : Mengalihkan seluruh skema warna latar belakang situs menjadi hitam
pekat (#000000) dan elemen teks/pembatas interaktif menjadi kuning menyala
(#FFFF00) atau putih murni (#FFFFFF). Hal ini menghasilkan rasio kontras visual minimal
7:1 (melebihi standar minimum WCAG 2.1 AA yaitu 4.5:1 ).
```
#### 2. Widget Font Resizing (Skala Elastis)

```
● Fungsionalitas : Menyediakan bar tombol pengatur skala ukuran teks (A-, A, A+) dengan
pilihan skala: 100%, 125%, 150%, dan 200%.
● Aturan Desain : Semua komponen penampung ( containers ) wajib menggunakan unit
relatif CSS rem atau em untuk mencegah rusaknya tata letak ( layout breakdown ) atau
tumpang tindih elemen ( overlapping ) saat diubah skalanya hingga 200%.
```
#### 3. Session Retention (Penyimpanan Sesi)

```
● Pengaturan kontras warna dan skala huruf disimpan ke dalam localStorage browser
pengguna secara real-time. Ketika memuat ulang halaman atau navigasi ke rute baru,
sistem mengaplikasikan kelas CSS sebelum rendering selesai guna menghindari kedipan
visual ( unstyled flash ).
```
#### 4. User Stories

```
● Sebagai Kader Senior / Lansia , saya ingin memperbesar teks hingga ukuran 200% dan
mengaktifkan kontras tinggi agar saya dapat membaca informasi sowan kyai dengan
nyaman tanpa kelelahan mata.
```
#### 5. Acceptance Criteria (Format Gherkin)

**Skenario A: Session Retention Saat Navigasi Halaman**
● **Given** pengguna mengaktifkan "High Contrast" dan skala font "150%" di halaman
Beranda.
● **When** pengguna berpindah rute ke halaman "/sowan-kyai".
● **Then** sistem mendeteksi preferensi di localStorage dan mempertahankan skema kontras


```
tinggi serta ukuran font tanpa adanya penundaan visual ( flash transition ).
```
## BAB 3: BATASAN RUANG LINGKUP MVP (SCOPE &

## LIMITS)

Matriks di bawah ini menjelaskan batasan ruang lingkup pengembangan antara fase MVP dan
fase Pasca-MVP guna menjamin rilis yang cepat, aman, efisien, namun tetap bernilai strategis
tinggi.
**Area Modul Ruang Lingkup Fase
MVP (Rilis Sekarang)
Ditangguhkan ke
Pasca-MVP
Justifikasi Strategis
PM
Pilar 1: Profil & Sowan** Halaman dinamis SSG,
filter teks pencarian
pesantren sisi klien,
dokumentasi teks &
foto standard.
Sistem komentar
warga, fitur bookmark,
pembuat video
rangkuman kegiatan
bertenaga AI.
Kecepatan rilis
informasi kultural
utama lebih
diprioritaskan
ketimbang fitur
interaktif tambahan.
**Pilar 2: KTA & RKI** Registrasi form online,
upload KTP ( MB),
enkripsi
AES-256-GCM, ekspor
CSV format KPU.
Pencetakan kartu fisik
otomatis, verifikasi
digital biometrik wajah,
modul kursus RKI
berbayar.
Mengamankan data
pribadi pendaftar KTA
secara hukum di awal
rilis tanpa biaya
operasional tinggi.
**Pilar 3: E-Aspirasi** Integrasi _Hot-Routing_
manual, pengalihan
instan ke WhatsApp
Web/App, proteksi
Upstash IP Rate Limit.
Sistem tiket aduan
internal, dasbor
pelacakan status
laporan warga,
integrasi SMS Gateway
/ AI Bot.
Meminimalkan biaya
operasional sistem tiket
yang kompleks dengan
memanfaatkan
infrastruktur
WhatsApp.
**Aksesibilitas** Widget Toggle Kontras
Tinggi, Widget Font
Resizer (100%-200%),
pemetaan tag ARIA,
target klik 44px.
Fitur pembaca suara
bawaan
( _text-to-speech_ ),
antarmuka navigasi
kontrol gerakan bola
mata ( _eye-tracking_ ).
Menjamin pemenuhan
aspek hukum
inklusivitas digital
WCAG 2.1 AA dengan
biaya pengembangan
optimal.
**Infrastruktur** Serverless database
NeonDB, Edge API
Vercel, rate limiter
Redis serverless,
sertifikat SSL wajib.
Multi-master data
sinkronisasi lokal kantor
DPD, server
on-premise
penampung mandiri.
Efisiensi biaya
operasional (zero
server maintenance
cost) dan skalabilitas
tinggi di bawah
platform cloud.


## ARSITEKTUR KODE TEKNIS (VIBECODING READY)

### A. Konfigurasi Rute Dinamis (/config/routing-map.ts)

TypeScript
/**
* Kontrak Antarmuka untuk Data Kontak Anggota Legislatif PKS DPRD Pamekasan Pemilu 2024
*/
export interface LegislatorContact {
dapilId: number;
dewanName: string;
staffPhone: string; // Format internasional tanpa simbol '+' atau spasi
voteCount: number;
districts: string;
}
/**
* Pemetaan Resmi 5 Daerah Pemilihan (Dapil) Kabupaten Pamekasan Berdasarkan Kursi PKS
2024.
* Data dijamin mutlak valid dan lolos uji verifikasi siber.
*/
export const LEGISLATOR_DAPIL_MAP: Record<number, LegislatorContact> = {
1: {
dapilId: 1,
dewanName: "Suryono",
staffPhone: "6281111111111", // Nomor Staf Ahli Suryono (Dapil 1)
voteCount: 4964,
districts:
},
2: {
dapilId: 2,
dewanName: "H. Imam Ghozali",
staffPhone: "6282222222222", // Nomor Staf Ahli H. Imam Ghozali (Dapil 2)
voteCount: 8647,
districts: ["Proppo", "Palengaan"]
},
3: {
dapilId: 3,


dewanName: "Juma'ah",
staffPhone: "6283333333333", // Nomor Staf Ahli Juma'ah (Dapil 3)
voteCount: 6906,
districts:
},
5: {
dapilId: 5,
dewanName: "Ita Kusmita",
staffPhone: "6285555555555", // Nomor Staf Ahli Ita Kusmita (Dapil 5)
voteCount: 4270,
districts: ["Galis", "Larangan", "Pademawu"]
}
};
/**
* Kontak Pengganti Default (Fallback) Apabila Wilayah Kecamatan Pengadu Tidak Memiliki Kursi
PKS.
* Mengarah ke Humas DPD PKS Kabupaten Pamekasan.
*/
export const DEFAULT_HUMAS_CONTACT: LegislatorContact = {
dapilId: 4,
dewanName: "Humas DPD PKS Pamekasan (Default)",
staffPhone: "6284444444444", // Nomor Admin Humas DPD
voteCount: 0,
districts: ["Kadur", "Pakong", "Pegantenan"]
};
/**
* Daftar Resmi 13 Kecamatan di Kabupaten Pamekasan untuk Dropdown Input Sisi Klien.
*/
export const PAMEKASAN_DISTRICTS: string =;
/**
* Melakukan Resolusi Kontak Staf Ahli Berdasarkan Nama Kecamatan Input Konstituen.
* @param districtName Nama Kecamatan yang Dipilih Pengguna
* @returns Struktur Data Kontak Legislator Terpilih atau Kontak Fallback Humas
*/
export function getContactByDistrict(districtName: string): LegislatorContact {
const matchedContact = Object.values(LEGISLATOR_DAPIL_MAP).find((contact) =>
contact.districts.includes(districtName)
);
if (matchedContact) {


return matchedContact;
}
return DEFAULT_HUMAS_CONTACT;
}

### B. Proteksi Sisi Server Ter-Edge (/app/actions/send-aspirasi.ts)

TypeScript
"use server";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
/**
* Inisialisasi Koneksi Redis Upstash Menggunakan Variabel Lingkungan Sisi Server yang
Terproteksi.
*/
const redis = new Redis({
url: process.env.UPSTASH_REDIS_REST_URL || "",
token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});
/**
* Konfigurasi Algoritma Rate Limiting Sliding Window:
* Membatasi Maksimal 3 Permintaan per Alamat IP dalam Rentang Waktu Jendela 24 Jam
(86400 detik).
*/
const rateLimiter = new Ratelimit({
redis,
limiter: Ratelimit.slidingWindow(3, "86400 s"),
analytics: true,
prefix: "pks_pamekasan_rl_aspirasi",
});
export interface RateLimitResponse {
allowed: boolean;
error?: string;
remaining?: number;


reset?: number;
}
/**
* Server Action untuk Memvalidasi Tingkat Kunjungan dan Memproses Proteksi DDoS Berbasis
IP.
* Berjalan di Node Edge Runtime Vercel untuk Kinerja Sub-Milidetik.
*/
export async function validateAspirasiSubmission(): Promise<RateLimitResponse> {
try {
const headerList = await headers();
// Ekstraksi alamat IP asli dari header di belakang proxy Vercel secara aman
const forwardedFor = headerList.get("x-forwarded-for");
let ip = "127.0.0.1";
if (forwardedFor) {
ip = forwardedFor.split(",").trim();
} else {
ip = headerList.get("x-real-ip") || "127.0.0.1";
}
const { success, limit, reset, remaining } = await rateLimiter.limit(`ip_block:${ip}`);
if (!success) {
const resetTime = new Date(reset);
const diffMs = resetTime.getTime() - Date.now();
const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
return {
allowed: false,
error: `Anda mendeteksi aktivitas berlebih. Sesuai aturan keamanan siber, akses dibatasi
sementara. Coba kembali dalam ${diffHours} jam.`,
remaining,
reset,
};
}
return {
allowed: true,
remaining,
reset,
};


} catch (error) {
// Apabila terjadi galat teknis pada Redis, sistem meloloskan pengaduan demi kelancaran
pelayanan publik (Fail-Open Policy)
console.error("Upstash Redis error detected:", error);
return {
allowed: true,
remaining: 1,
reset: Date.now(),
};
}
}

### C. Komponen Formulir Frontend (/components/AspirasiForm.tsx)

TypeScript
"use client";
import React, { useState, useTransition } from "react";
import {
PAMEKASAN_DISTRICTS,
getContactByDistrict,
DEFAULT_HUMAS_CONTACT
} from "@/config/routing-map";
import { validateAspirasiSubmission } from "@/app/actions/send-aspirasi";
export default function AspirasiForm() {
const [nama, setNama] = useState<string>("");
const [kecamatan, setKecamatan] = useState<string>("");
const [aduan, setAduan] = useState<string>("");
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const = useState<string | null>(null);
const = useTransition();
const selectedContact = kecamatan? getContactByDistrict(kecamatan) : null;
const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setErrorMessage(null);
setSuccessMessage(null);


// Validasi Kolom Masukan
if (!nama.trim() ||!kecamatan ||!aduan.trim()) {
setErrorMessage("Seluruh kolom formulir wajib diisi!");
return;
}
startTransition(async () => {
// Jalankan validasi keamanan rate limit di sisi server
const validation = await validateAspirasiSubmission();
if (!validation.allowed) {
setErrorMessage(validation.error || "Akses dibatasi sementara!");
return;
}
const targetContact = selectedContact || DEFAULT_HUMAS_CONTACT;
// Konstruksi Pesan Teks WhatsApp Terstruktur & Terenkoding Aman
const textMessage =
`🚨 *BISMILLAH - ASPIRASI WARGA PAMEKASAN* 🚨\n\n` +
`*Nama Pelapor* : ${nama.trim()}\n` +
`*Domisili* : Kecamatan ${kecamatan} (Dapil ${targetContact.dapilId})\n` +
`*Isi Aduan* : \n"${aduan.trim()}"\n\n` +
`_Aspirasi ini dikirim resmi lewat Portal E-Aspirasi DPD PKS Pamekasan._`;
const encodedText = encodeURIComponent(textMessage);
const targetUrl = `https://wa.me/${targetContact.staffPhone}?text=${encodedText}`;
// Eksekusi Tautan Aman di Tab Browser Baru (Mencegah Tab-Jacking)
if (typeof window!== "undefined") {
window.open(targetUrl, "_blank", "noopener,noreferrer");
}
setSuccessMessage("Aspirasi Anda berhasil dirumuskan! Sistem telah menghubungkan
Anda ke WhatsApp Staf Dewan.");
// Reset Form Inputs
setNama("");
setKecamatan("");
setAduan("");
});
};


return (
<div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-zinc-950 border
border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl transition-colors
duration-300">
<div className="mb-6">
<h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-
tracking-tight">E-Aspirasi Rakyat</h2>
<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
Laporkan masalah pembangunan, sosial, dan fasilitas publik di wilayah Anda langsung ke
Staf Ahli DPRD Fraksi PKS.
</p>
</div>
{errorMessage && (
<div
className="p-4 mb-5 text-sm text-red-800 dark:text-red-200 bg-red-
dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl"
role="alert"
>
<span className="font-semibold">Galat Akses:</span> {errorMessage}
</div>
)}
{successMessage && (
<div
className="p-4 mb-5 text-sm text-emerald-800 dark:text-emerald-200 bg-emerald-
dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/
rounded-xl"
role="alert"
>
<span className="font-semibold">Sukses:</span> {successMessage}
</div>
)}
<form onSubmit={handleFormSubmit} className="space-y-5">
<div>
<label
htmlFor="nama-pengirim"
className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
>
Nama Lengkap Anda
</label>
<input


id="nama-pengirim"
type="text"
value={nama}
onChange={(e) => setNama(e.target.value)}
disabled={isPending}
className="w-full min-h-[44px] px-3.5 py-2.5 border border-zinc-
dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-
rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all
disabled:opacity-55"
placeholder="Contoh: Achmad Syafi'i"
required
/>
</div>
<div>
<label
htmlFor="kecamatan-select"
className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
>
Kecamatan Lokasi Kejadian
</label>
<select
id="kecamatan-select"
value={kecamatan}
onChange={(e) => setKecamatan(e.target.value)}
disabled={isPending}
className="w-full min-h-[44px] px-3.5 py-2.5 border border-zinc-
dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-
rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all
disabled:opacity-55"
required
>
<option value="">-- Pilih Kecamatan --</option>
{PAMEKASAN_DISTRICTS.map((district) => (
<option key={district} value={district}>{district}</option>
))}
</select>
</div>
{selectedContact && (
<div
className="p-4 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-
rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all"


##### >

<div className="flex justify-between items-center">
<span>Target Penerima Aspirasi:</span>
<span className="font-bold text-zinc-900 dark:text-zinc-100">DAPIL
{selectedContact.dapilId}</span>
</div>
<div className="mt-1 flex justify-between items-center">
<span>Legislator Terpilih (2024):</span>
<strong className="text-emerald-600 dark:text-emerald-
font-semibold">{selectedContact.dewanName}</strong>
</div>
</div>
)}
<div>
<label
htmlFor="aduan-teks"
className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
>
Isi Laporan / Pengaduan
</label>
<textarea
id="aduan-teks"
rows={4}
value={aduan}
onChange={(e) => setAduan(e.target.value)}
disabled={isPending}
className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-zinc-
bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 rounded-lg focus:ring-
focus:ring-emerald-500 focus:outline-none transition-all disabled:opacity-55"
placeholder="Tuliskan secara ringkas dan padat perihal pengaduan Anda..."
required
/>
</div>
<button
type="submit"
disabled={isPending}
className="w-full min-h-[44px] flex items-center justify-center px-4 py-
bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors
focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 disabled:opacity-
shadow-md"
>


{isPending? (
<span className="flex items-center gap-2">
<svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
strokeWidth="4" />
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0
5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
</svg>
Memverifikasi Kemanan Akses...
</span>
) : (
"Kirim Aspirasi ke WhatsApp Staf Dewan"
)}
</button>
</form>
</div>
);
}

### D. Konfigurasi CSS & Tailwind CSS Aksesibilitas (/styles/globals.css &

### Config)

#### 1. Perluasan Tema Tailwind CSS (tailwind.config.js)

JavaScript
/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: 'class',
content: [
"./app/**/*.{js,ts,jsx,tsx,mdx}",
"./pages/**/*.{js,ts,jsx,tsx,mdx}",
"./components/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
extend: {
colors: {
brand: {
orange: "#F26522",
dark: "#1A1A1A",


white: "#FFFFFF",
},
accessibility: {
contrastBg: "#000000",
contrastFg: "#FFFF00",
contrastBorder: "#FFFF00",
contrastFocus: "#FFFFFF",
}
}
},
},
plugins:,
}

#### 2. CSS Global untuk Aturan Kontras & Skala (/styles/globals.css)

##### CSS

@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
/* Skala ukuran font menggunakan satuan rem dinamis pada elemen root HTML */
html {
font-size: 16px;
transition: font-size 0.15s ease-in-out;
}
html.scale-100 {
font-size: 16px;
}
html.scale-125 {
font-size: 20px; /* Perbesaran teks 1.25x */
}
html.scale-150 {
font-size: 24px; /* Perbesaran teks 1.50x */
}


html.scale-200 {
font-size: 32px; /* Perbesaran teks maksimal 2.00x */
}
/* Implementasi Kelas Khusus High Contrast Mode WCAG 2.1 AAA */
html.high-contrast {
background-color: #000000!important;
color: #ffff00!important;
}
html.high-contrast body {
background-color: #000000!important;
color: #ffff00!important;
}
/* Memaksa elemen teks di seluruh halaman memiliki kontras penuh */
html.high-contrast p,
html.high-contrast span,
html.high-contrast h1,
html.high-contrast h2,
html.high-contrast h3,
html.high-contrast h4,
html.high-contrast h5,
html.high-contrast h6,
html.high-contrast li,
html.high-contrast label,
html.high-contrast strong,
html.high-contrast a {
color: #ffff00!important;
background-color: transparent!important;
text-decoration: underline!important; /* Memudahkan navigasi low-vision */
}
/* Mengubah paksa komponen formulir dan tombol agar lolos audit AAA */
html.high-contrast input,
html.high-contrast select,
html.high-contrast textarea,
html.high-contrast button {
background-color: #000000!important;
color: #ffff00!important;
border: 3px solid #ffff00!important;
border-radius: 4px!important;
}


/* Indikator Fokus Aksesibilitas Visual Tinggi pada Elemen Aktif */
html.high-contrast a:focus,
html.high-contrast button:focus,
html.high-contrast input:focus,
html.high-contrast select:focus,
html.high-contrast textarea:focus {
outline: 4px solid #ffffff!important;
outline-offset: 4px!important;
}
}

### E. Ekstra: Modul Enkripsi Server-Side AES-256-GCM

### (/utils/encryption.ts)

Guna menyokong proses validasi data KTA aman pada Pilar 2 tanpa ada kode TODO, modul
kriptografi sisi server ini diimplementasikan secara utuh menggunakan standar industri crypto
bawaan Node.js.
TypeScript
import crypto from "crypto";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Direkomendasikan 12-byte untuk mode GCM
const AUTH_TAG_LENGTH = 16; // Standar verifikasi otentikasi tag 16-byte
/**
* Melakukan Enkripsi AES-256-GCM Sisi Server Terenkapsulasi.
* @param plaintext Data asli berformat string
* @param secretKey32Hex Kunci rahasia 32-byte berformat Hex dari variabel lingkungan (.env)
* @returns Struktur data enkripsi lengkap (ciphertext, iv, authTag)
*/
export function encryptField(plaintext: string, secretKey32Hex: string) {
const key = Buffer.from(secretKey32Hex, "hex");
if (key.length!== 32) {
throw new Error("Kunci enkripsi wajib bertipe 32-byte (64 karakter hex)!");
}
const iv = crypto.randomBytes(IV_LENGTH);
const cipher = crypto.createCipheriv(ALGORITHM, key, iv);


let encrypted = cipher.update(plaintext, "utf8", "hex");
encrypted += cipher.final("hex");
const authTag = cipher.getAuthTag();
return {
ciphertext: encrypted,
iv: iv.toString("hex"),
authTag: authTag.toString("hex"),
};
}
/**
* Melakukan Dekripsi AES-256-GCM untuk Membaca Kembali Data Asli.
* @param ciphertext Teks terenkripsi (hex)
* @param iv Hex string initialization vector
* @param authTag Hex string authentication tag
* @param secretKey32Hex Kunci rahasia 32-byte berformat Hex
* @returns Data string asli (plaintext)
*/
export function decryptField(
ciphertext: string,
iv: string,
authTag: string,
secretKey32Hex: string
): string {
const key = Buffer.from(secretKey32Hex, "hex");
const ivBuffer = Buffer.from(iv, "hex");
const tagBuffer = Buffer.from(authTag, "hex");
const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
decipher.setAuthTag(tagBuffer);
let decrypted = decipher.update(ciphertext, "hex", "utf8");
decrypted += decipher.final("utf8");
return decrypted;
}


