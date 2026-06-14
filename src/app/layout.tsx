import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const siteUrl = process.env.APP_URL || 'https://pkspamekasan.id';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DPD PKS Kabupaten Pamekasan — Portal Resmi',
    template: '%s — DPD PKS Pamekasan',
  },
  description:
    'Portal resmi Dewan Pengurus Daerah PKS Kabupaten Pamekasan. Berita, agenda, galeri, layanan aspirasi rakyat, registrasi KTA, profil partai, dan dokumentasi dakwah kultural.',
  keywords: ['PKS', 'Pamekasan', 'aspirasi', 'KTA', 'dakwah', 'sowan kyai', 'DPD PKS', 'berita', 'agenda', 'galeri'],
  authors: [{ name: 'Dewan Pengurus Daerah PKS Kabupaten Pamekasan' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'DPD PKS Kabupaten Pamekasan',
    title: 'DPD PKS Kabupaten Pamekasan — Portal Resmi',
    description:
      'Portal resmi Dewan Pengurus Daerah PKS Kabupaten Pamekasan. Berita, agenda, galeri, layanan aspirasi rakyat, registrasi KTA, profil partai, dan dokumentasi dakwah kultural.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPD PKS Kabupaten Pamekasan — Portal Resmi',
    description:
      'Portal resmi Dewan Pengurus Daerah PKS Kabupaten Pamekasan. Berita, agenda, galeri, layanan aspirasi rakyat, registrasi KTA, profil partai, dan dokumentasi dakwah kultural.',
  },
};

// Script pencegah layout flash: membaca preferensi aksesibilitas dari localStorage
// dan menerapkan class ke <html> SEBELUM React hydrate, menghindari FOUC.
const antiFlashScript = `
(function() {
  try {
    var d = document.documentElement;
    var hc = localStorage.getItem('accessibility_high_contrast');
    var fs = localStorage.getItem('accessibility_font_size');
    if (hc === 'true') d.classList.add('high-contrast');
    if (fs && ['scale-100','scale-125','scale-150','scale-200'].indexOf(fs) !== -1) {
      d.classList.add(fs);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
