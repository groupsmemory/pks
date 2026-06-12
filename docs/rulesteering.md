
# Project Steering Rules — DPD PKS Pamekasan Digital Portal

## 1. Brand Identity
- **Warna Utama:** Orange PKS `#F26522`
- **Warna Dark/High Contrast:** Background `#000000`, Text `#F26522`
- **Warna Focus/Aksen:** White `#FFFFFF` pada high-contrast
- **Font:** Sistem font (sans-serif), unit relatif `rem`/`em`
- **Logo:** logo resmi PKS

## 2. Tech Stack (Wajib)
- Next.js 15 (App Router)
- TypeScript 5+ (strict mode)
- Tailwind CSS 4
- NeonDB (PostgreSQL serverless)
- NextAuth v4 (Credentials, JWT)
- Upstash Redis + Ratelimit
- Midtrans Snap (payment)
- bcryptjs (password)
- AES-256-GCM (enkripsi NIK)
- lucide-react (icons)
- motion (animasi)

## 3. Struktur Direktori
src/
├── app/          # App Router pages & API routes
│   ├── actions/  # Server Actions
│   ├── admin/    # Admin dashboard CMS
│   └── components/  # Client components
├── db/           # Schema SQL
├── lib/          # Utilities (auth, crypto, midtrans)
hooks/
lib/              # Shared utilities (cn)
scripts/          # Seed & maintenance
docs/             # PRD, blueprint, analisis

## 4. Aksesibilitas (WCAG 2.1 AA — WAJIB)
- [ ] Skip-to-content link
- [ ] High Contrast toggle (black/orange)
- [ ] Font resizer (100%, 125%, 150%, 200%)
- [ ] localStorage session retention
- [ ] min-h-[44px] touch targets
- [ ] ARIA labels & roles
- [ ] Focus ring visible
- [ ] Semantic HTML (h1-h6, nav, main, etc.)
- [ ] Server-side anti-FOUC script
- [ ] Keyboard navigation (Tab, Enter, Escape)

## 5. Keamanan
- Rate limit: 3 submit/IP/24jam (Upstash)
- Enkripsi AES-256-GCM untuk NIK & data sensitif
- bcryptjs untuk password admin
- NextAuth session dengan JWT
- Server-only env variables
- Fail-open policy untuk Redis error (aspirasi tetap jalan)

## 6. Routing & Dapil Map
- 4 DPRD PKS Pamekasan 2024-2029:
  - Dapil 1: Suryono (Pamekasan, Tlanakan)
  - Dapil 2: H. Imam Ghozali (Proppo, Palengaan)
  - Dapil 3: Juma'ah (Batumarmar, Waru, Pasean)
  - Dapil 5: Ita Kusmita (Galis, Larangan, Pademawu)
  - Default/Fallback: Humas DPD (Kadur, Pakong, Pegantenan)

## 7. Code Conventions
- "use client" hanya untuk komponen interaktif
- Server Actions untuk semua mutasi data
- SSG untuk halaman publik (Profil, Sowan Kyai, RKI)
- CSS: Tailwind utility classes, hindari CSS custom
- Imports: @/ alias untuk absolute imports
- Tidak ada komentar kode (kecuali dokumentasi API)
- Bahasa Indonesia untuk UI/UX, English untuk kode

## 8. Environment Variables
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
DATABASE_CRYPTO_KEY=  # 32-byte hex
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=

## 9. Git Rules
- No commit secrets (.env)
- Bahasa Indonesia untuk commit messages
- Satu fitur = satu commit
- Branch: main (production), develop (staging)

## 10. 4 aturan disiplin:
🧠 Think before coding
Jelaskan asumsi yang dipakai. Kalau nggak yakin, tanya. Jangan asal nebak.
✂️ Simplicity first
Tulis kode sesederhana mungkin untuk menyelesaikan masalah. Jangan bikin kompleksitas yang nggak diminta.
🎯 Surgical changes
Jangan sentuh bagian kode yang nggak ada hubungannya dengan request. Setiap perubahan harus punya alasan yang jelas.
✅ Goal-oriented execution
Ubah instruksi yang ambigu menjadi target yang bisa diverifikasi sebelum mulai ngoding.
