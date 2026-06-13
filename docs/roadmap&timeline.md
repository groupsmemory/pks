🗺️ ROADMAP & TIMELINE — PORTAL DPD PKS KABUPATEN PAMEKASAN
Proyek: Next.js 15 + React 19 + TypeScript 5.9 + Tailwind 4 + NeonDB + NextAuth + Midtrans
Total Estimasi: 8-12 minggu (2-3 bulan) — eksekusi paralel dimungkinkan
FASE 0: CRITICAL FIXES (Minggu 1) — ⚡ PRIORITAS TERTINGGI
#	WP	Task	Lokasi	Estimasi
0.1	🚑	Buat halaman /donasi/selesai — tampilkan order_id, status pembayaran, CTA donasi lagi	Baru	1 hari
0.2	🚑	Pindahkan password admin seed-admin.ts ke env var ADMIN_SEED_PASSWORD + validasi di runtime	scripts/seed-admin.ts	0.5 hari
0.3	🚑	Buat tabel DB dapil_routing — pindahkan routing DPRD dari hardcode ke database	submit-aspirasi.ts + schema.sql	1 hari
0.4	🚑	Hapus KtaRegistrationForm.tsx — dead code, 200+ baris duplikat	src/app/components/	0.5 hari
0.5	🚑	Hapus .eslintrc.json — duplicate config, pilih eslint.config.mjs	Root	0.25 hari
0.6	🚑	Hapus hooks/use-mobile.ts — unused	hooks/	0.25 hari
0.7	🚑	Hapus scripts/migrate-cms.cjs — redundant (TS version sudah ada)	scripts/	0.25 hari
0.8	🚑	Install & setup Vitest — minimal 1 test untuk crypto.ts round-trip	package.json	1 hari
Total Fase 0: ~4.75 hari kerja
FASE 1: KEAMANAN & ARSITEKTUR DATA (Minggu 2)
#	WP	Task	Detail
1.1	🔒	Implementasi Zod schemas untuk semua form — dual-use client & server	Baru: src/lib/validations.ts
1.2	🔒	Validasi NIK (16 digit + checksum), nomor HP (62xxx, 10-15 digit), email format	validations.ts
1.3	🔒	Database transaction di create-donation.ts — rollback Midtrans jika DB gagal	create-donation.ts
1.4	🔒	Idempotency key di webhook handler — cek midtrans_transaction_id sebelum proses	notification/route.ts
1.5	🔒	Ganti catch (e: any) di AspirasiForm.tsx dengan catch (e: unknown)	AspirasiForm.tsx
1.6	🔒	Ganti semua as Kecamatan / as JenisDonasi dengan Zod parse runtime	Semua server actions
Total Fase 1: ~5 hari kerja
FASE 2: CODE QUALITY & MAINTAINABILITY (Minggu 3)
#	WP	Task	Detail
2.1	🧹	Buat src/lib/constants.ts — PAMEKASAN_KECAMATAN, JENIS_DONASI, FONT_SCALES, dll	Baru
2.2	🧹	Buat src/hooks/useAccessibility.ts — hook reusable high contrast + font scaling	Baru
2.3	🧹	Buat src/lib/utils.ts — slugify(), formatRupiah(), validateNIK(), validatePhone()	Baru
2.4	🧹	Buat src/lib/db.ts — centralized database connection helper	Baru
2.5	🧹	Extract static data ke file terpisah: src/data/profil.ts, sowan-kyai.ts, rki.ts	Baru
2.6	🧹	Hapus dependencies tidak terpakai: @hookform/resolvers, firebase-tools	package.json
Total Fase 2: ~4 hari kerja
FASE 3: USER EXPERIENCE (Minggu 4)
#	WP	Task	Detail
3.1	🎨	Implementasi Error Boundary global + per-page	src/components/ErrorBoundary.tsx
3.2	🎨	Loading skeleton untuk semua admin CMS data tables	admin/dashboard/*
3.3	🎨	Custom ConfirmModal komponen — ganti confirm() dialog native	src/components/ConfirmModal.tsx
3.4	🎨	Empty state untuk setiap data list — "Belum ada data" + ilustrasi	Semua list pages
3.5	🎨	High contrast mode + font scaling di admin dashboard	admin/dashboard/layout.tsx
3.6	🎨	Tambah validasi real-time di form (NIK, HP) dengan feedback visual	AspirasiForm, KtaForm, DonasiForm
3.7	🎨	Loading state blocking di admin CMS saat create/update/delete	BeritaClient, AgendaClient, GaleriClient
Total Fase 3: ~5 hari kerja
FASE 4: HOMEPAGE REDESIGN — ATM PKS.ID (Minggu 5-6)
#	WP	Task	Detail
4.1	🏠	Header redesign: Logo kiri + teks "Dewan Pengurus Daerah PKS Kabupaten Pamekasan"	Header.tsx
4.2	🏠	Mega menu navigasi — dropdown dengan submenu (Tiru dari pks.id)	Header.tsx
4.3	🏠	Hero section — slider berita terbaru + kutipan tokoh (Presiden PKS)	page.tsx
4.4	🏠	Quick stats / Layanan Cepat — 4 kolom: Aspirasi, KTA, Donasi, Info Publik	page.tsx
4.5	🏠	Berita Terkini — grid 3 kolom berita terbaru dari DB	page.tsx
4.6	🏠	Berita Pilihan — 2-3 berita featured dengan gambar besar	page.tsx
4.7	🏠	Sidebar — "Kunjungi Juga" link boxes (Join PKS, Sumbangan, Info Publik, Unduh)	page.tsx
4.8	🏠	Footer redesign — two-tone (hitam + oranye), logo, alamat, kontak, sosial media, copyright	Footer.tsx
Total Fase 4: ~10 hari kerja
FASE 5: PERFORMANCE & DATABASE (Minggu 7)
#	WP	Task	Detail
5.1	⚡	Gabung 6 query COUNT dashboard jadi 1 query dengan subqueries	admin/dashboard/page.tsx
5.2	⚡	Filter agenda upcoming/past di SQL (WHERE date >= NOW() / < NOW())	agenda/page.tsx
5.3	⚡	Tambah pagination (cursor-based) untuk berita, agenda, galeri	Semua list pages
5.4	⚡	Implementasi ISR (Incremental Static Regeneration) untuk halaman publik	berita/[slug], agenda/[slug]
5.5	⚡	Tambah GIN index untuk full-text search di berita.content	schema.sql
5.6	⚡	Optimasi gambar — next/image dengan format WebP/AVIF	Semua image components
5.7	⚡	Implementasi React.lazy + Suspense untuk komponen berat	AspirasiForm, DonasiForm
Total Fase 5: ~5 hari kerja
FASE 6: TESTING & CI/CD (Minggu 8)
#	WP	Task	Detail
6.1	🧪	Unit test: crypto.ts — encrypt/decrypt round-trip, invalid key, invalid ciphertext	src/__tests__/crypto.test.ts
6.2	🧪	Unit test: Zod validations — NIK, phone, email, kecamatan, donasi amount	src/__tests__/validations.test.ts
6.3	🧪	Unit test: determineRoutingDetails() — semua kecamatan ter-map dengan benar	src/__tests__/routing.test.ts
6.4	🧪	Integration test: Midtrans webhook handler — signature verify, status update	src/__tests__/webhook.test.ts
6.5	🧪	Integration test: Form submissions — aspirasi, KTA, donasi (mocked DB)	src/__tests__/actions.test.ts
6.6	🚀	Setup GitHub Actions: lint → typecheck → test → build on push & PR	.github/workflows/ci.yml
6.7	🚀	Setup Dockerfile (multi-stage) + deployment config (Vercel/Cloud Run)	Dockerfile
Total Fase 6: ~5 hari kerja
FASE 7: ENHANCEMENT & POLISH (Minggu 9-10)
#	WP	Task	Detail
7.1	✨	Open Graph + Twitter Card meta tags dinamis per halaman	layout.tsx + generateMetadata()
7.2	✨	Sitemap.xml generator — dinamis dari berita + agenda slugs	src/app/sitemap.ts
7.3	✨	RSS feed untuk berita	src/app/feed.xml/route.ts
7.4	✨	Export data aspirasi/KTA/donasi ke CSV dari admin	admin/dashboard/*/page.tsx
7.5	✨	Search + filter di admin list pages (by nama, status, kecamatan)	admin/dashboard/*
7.6	✨	Role-based access: ADMIN vs SUPER_ADMIN untuk aksi sensitif	auth.ts + middleware
7.7	✨	Split besar komponen: AspirasiForm (330 baris), DonasiForm (343 baris)	Refactor ke sub-components
7.8	✨	Share buttons di detail berita (WhatsApp, Telegram, FB, Twitter) — tiru pks.id	berita/[slug]/page.tsx
7.9	✨	Tags/hashtag system di berita + filter by tag	schema.sql + berita/page.tsx
7.10	✨	"Berita Terkait" di detail berita — berdasarkan tag/kategori	berita/[slug]/page.tsx
Total Fase 7: ~10 hari kerja
FASE 8: ADVANCED FEATURES (Minggu 11-12) — Opsional
#	WP	Task	Detail
8.1	🚀	Notifikasi real-time untuk admin saat ada aspirasi/KTA baru	WebSocket / SSE
8.2	🚀	Dashboard chart visual (penambahan per bulan) — Recharts/Chart.js	admin/dashboard/page.tsx
8.3	🚀	Multi-bahasa (Indonesia + Inggris) — i18n dengan next-intl	src/i18n/
8.4	🚀	Integrasi Google Analytics / Umami untuk traffic analytics	layout.tsx
8.5	🚀	PWA (Progressive Web App) — manifest.json + service worker	next.config.ts
8.6	🚀	Dark mode (non-high-contrast) — toggle smooth antara light/dark	globals.css + context
Total Fase 8: ~10 hari kerja
📊 RINGKASAN TIMELINE
Minggu 1  ████████████████  Fase 0: Critical Fixes
Minggu 2  ████████████████  Fase 1: Keamanan & Arsitektur
Minggu 3  ████████████████  Fase 2: Code Quality
Minggu 4  ████████████████  Fase 3: User Experience
Minggu 5-6 ██████████████████████████████  Fase 4: Homepage Redesign (ATM)
Minggu 7  ████████████████  Fase 5: Performance & DB
Minggu 8  ████████████████  Fase 6: Testing & CI/CD
Minggu 9-10 ██████████████████████████████  Fase 7: Enhancement & Polish
Minggu 11-12 ██████████████████████████████  Fase 8: Advanced (Opsional)
Timeline paralel (recommended):
        Fase 0 ██
        Fase 1 ██████
        Fase 2 ██████████
        Fase 3 ████████████████
Fase 4 (ATM)   ████████████████████████
        Fase 5 ██████████████████████████████
        Fase 6 ████████████████████████████████████
        Fase 7 ██████████████████████████████████████████
        Fase 8 ████████████████████████████████████████████████
       ------------------------------------------------------------
Weeks   1 2 3 4 5 6 7 8 9 10 11 12
🏷️ LEGENDA STATUS WORK PACKAGES
Simbol	Arti
🚑 Critical	Blocker — harus selesai sebelum production launch
🔒 Security	Keamanan data & sistem
🧹 Cleanup	Refactor, DRY, maintainability
🎨 UX	User experience & interface
🏠 ATM	Amati-Tiru-Modifikasi dari pks.id
⚡ Performance	Optimasi kecepatan & database
🧪 Testing	Unit, integration, CI/CD
✨ Enhancement	Fitur tambahan untuk parity dengan pks.id
🚀 Advanced	Fitur premium / nice-to-have
📋 45 WORK PACKAGES — CHECKLIST
WP	Fase	Status	Catatan
0.1	Critical	⬜	/donasi/selesai
0.2	Critical	⬜	Seed password → env
0.3	Critical	⬜	Tabel dapil_routing
0.4	Critical	⬜	Hapus KtaRegistrationForm
0.5	Critical	⬜	Hapus .eslintrc.json
0.6	Critical	⬜	Hapus use-mobile.ts
0.7	Critical	⬜	Hapus migrate-cms.cjs
0.8	Critical	⬜	Setup Vitest
1.1	Security	⬜	Zod schemas
1.2	Security	⬜	NIK/HP/email validasi
1.3	Security	⬜	DB transaction donasi
1.4	Security	⬜	Idempotency webhook
1.5	Security	⬜	catch (e: any) → unknown
1.6	Security	⬜	Zod ganti as assertions
2.1	Quality	⬜	constants.ts
2.2	Quality	⬜	useAccessibility.ts
2.3	Quality	⬜	utils.ts
2.4	Quality	⬜	db.ts helper
2.5	Quality	⬜	Extract static data
2.6	Quality	⬜	Hapus unused deps
3.1	UX	⬜	Error Boundary
3.2	UX	⬜	Loading skeleton
3.3	UX	⬜	ConfirmModal
3.4	UX	⬜	Empty states
3.5	UX	⬜	Admin accessibility
3.6	UX	⬜	Real-time form validasi
3.7	UX	⬜	Loading blocking CMS
4.1	ATM	⬜	Header redesign
4.2	ATM	⬜	Mega menu navigasi
4.3	ATM	⬜	Hero + slider
4.4	ATM	⬜	Layanan Cepat
4.5	ATM	⬜	Berita Terkini grid
4.6	ATM	⬜	Berita Pilihan
4.7	ATM	⬜	Sidebar link boxes
4.8	ATM	⬜	Footer two-tone
5.1	Perf	⬜	Optimasi COUNT queries
5.2	Perf	⬜	SQL filter agenda
5.3	Perf	⬜	Pagination
5.4	Perf	⬜	ISR caching
5.5	Perf	⬜	GIN index
5.6	Perf	⬜	next/image optimasi
5.7	Perf	⬜	lazy + Suspense
6.1	Test	⬜	Unit: crypto.ts
6.2	Test	⬜	Unit: validations
6.3	Test	⬜	Unit: routing
6.4	Test	⬜	Integration: webhook
6.5	Test	⬜	Integration: actions
6.6	Test	⬜	GitHub Actions
6.7	Test	⬜	Dockerfile
7.1	Enhance	⬜	OG + Twitter Cards
7.2	Enhance	⬜	Sitemap.xml
7.3	Enhance	⬜	RSS feed
7.4	Enhance	⬜	Export CSV
7.5	Enhance	⬜	Admin search/filter
7.6	Enhance	⬜	Role-based access
7.7	Enhance	⬜	Split besar komponen
7.8	Enhance	⬜	Share buttons
7.9	Enhance	⬜	Tags system
7.10	Enhance	⬜	Berita Terkait
8.1	Advanced	⬜	Real-time notifikasi
8.2	Advanced	⬜	Chart dashboard
8.3	Advanced	⬜	i18n multi-bahasa
8.4	Advanced	⬜	Google Analytics
8.5	Advanced	⬜	PWA
8.6	Advanced	⬜	Dark mode
Catatan penting untuk eksekusi nanti:
- Fase 0 wajib selesai SEBELUM production launch
- Fase 4 (ATM Redesign) bisa mulai paralel dengan Fase 2-3 karena mostly UI
- Fase 6 (Testing) idealnya dimulai setelah Fase 1-2 selesai
- Untuk domain resmi .pks.id — koordinasikan dengan Humas DPW PKS Jawa Timur (sesuai syarat & ketentuan dari pks.id)
Silakan salin, akhi. Jika ada yang perlu ditanyakan atau ingin mulai eksekusi fase tertentu, bilang saja. Jazakallah khoiran.
