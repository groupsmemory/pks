Peta Jalan Eksekusi
# ROADMAP — Website Resmi DPD PKS Pamekasan

## Fase 0: Foundation (Selesai)
- [x] Inisialisasi Next.js 15 + TypeScript
- [x] Konfigurasi Tailwind 4 + PostCSS
- [x] Struktur direktori (src/app, lib, db, hooks)
- [x] Schema database (aspirasi, kta, donasi, admin_users)
- [x] Auth NextAuth + bcrypt
- [x] Enkripsi AES-256-GCM
- [x] Midtrans client
- [x] Routing map Dapil
- [x] env.example

## Fase 1: Core Public Pages (Selesai — Review)
- [x] Layout utama (Header + Footer + Skip-to-content)
- [x] Halaman Beranda (AspirasiForm + KTA)
- [x] Halaman Profil (SSG)
- [x] Halaman Sowan Kyai + SowanKyaiClient
- [x] Halaman RKI + RkiClient
- [x] Halaman Donasi + DonasiForm (Midtrans)
- [x] Komponen KtaForm, AspirasiForm
- [x] Server Actions: submit-aspirasi, submit-kta, create-donation

## Fase 2: Admin Dashboard
- [x] Admin login page
- [x] Admin layout + sidebar
- [ ] Admin dashboard stats page (pending data integration)
- [ ] Admin aspirasi management
- [ ] Admin KTA management
- [ ] Admin donasi management

## Fase 3: Aksesibilitas & Polish
- [x] WCAG high-contrast toggle
- [x] Font resizer (100%-200%)
- [x] Anti-FOUC script
- [ ] Audit ARIA labels
- [ ] Keyboard navigation audit
- [ ] Screen reader testing
- [ ] Touch target audit (44px)

## Fase 4: Testing & Deployment
- [ ] TypeScript strict check
- [ ] ESLint pass
- [ ] Build test (next build)
- [ ] Environment validation
- [ ] Deploy to production

## Fase 5: Pasca-MVP (Future)
- [x] Berita/artikel CMS (done)
- [x] Galeri foto (done)
- [x] Agenda kegiatan (done)
- [x] Halaman statis: Kontak, Kebijakan Privasi, Syarat & Ketentuan (done)
- [ ] Integrasi SIPOL
- [ ] Sistem komentar
- [ ] PWA
