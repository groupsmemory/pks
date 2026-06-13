export default function LoadingOverlay({ label = 'Memproses...' }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/80"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="mt-3 text-sm font-medium text-blue-600">{label}</p>
    </div>
  );
}
