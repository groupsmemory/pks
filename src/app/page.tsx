import AspirasiForm from '@/src/app/components/AspirasiForm';
import KtaForm from '@/src/app/components/KtaForm';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Section 1: Formulir Aspirasi Masyarakat */}
      <section aria-labelledby="heading-aspirasi">
        <AspirasiForm />
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-current opacity-30" />
      </div>

      {/* Section 2: Registrasi KTA Online */}
      <section aria-labelledby="heading-kta" className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <KtaForm />
      </section>
    </main>
  );
}
