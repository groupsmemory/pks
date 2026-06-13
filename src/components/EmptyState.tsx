interface EmptyStateProps {
  title?: string;
  message: string;
  variant?: 'default' | 'admin';
}

function EmptyBoxIllustration() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mx-auto"
    >
      <rect x="8" y="12" width="64" height="56" rx="8" className="stroke-gray-300" strokeWidth="2" fill="none" />
      <path d="M8 28h64" className="stroke-gray-200" strokeWidth="2" />
      <rect x="20" y="36" width="16" height="4" rx="2" className="fill-gray-200" />
      <rect x="20" y="44" width="24" height="4" rx="2" className="fill-gray-200" />
      <rect x="20" y="52" width="12" height="4" rx="2" className="fill-gray-200" />
      <circle cx="64" cy="52" r="12" className="stroke-gray-300" strokeWidth="2" fill="none" />
      <path d="M64 47v10M59 52h10" className="stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function EmptyState({ title, message, variant = 'default' }: EmptyStateProps) {
  const isAdmin = variant === 'admin';

  return (
    <div
      className={`rounded-xl border text-center ${
        isAdmin
          ? 'border-gray-200 bg-white p-8'
          : 'border-gray-200 bg-gray-50 p-12'
      }`}
    >
      <EmptyBoxIllustration />
      {title && (
        <h3 className={`font-bold mt-4 ${isAdmin ? 'text-gray-900' : 'text-gray-800'}`}>
          {title}
        </h3>
      )}
      <p
        className={`mt-2 ${isAdmin ? 'text-sm text-gray-500' : 'text-gray-500 text-lg'}`}
      >
        {message}
      </p>
    </div>
  );
}
