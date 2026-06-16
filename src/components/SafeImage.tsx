'use client';

import Image, { type ImageProps } from 'next/image';
import { useCallback, useState } from 'react';

type SafeImageProps = ImageProps & {
  fallback?: React.ReactNode;
};

function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center p-4">
        <svg
          className="w-8 h-8 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-xs text-gray-500 mt-1">Gambar tidak tersedia</p>
      </div>
    </div>
  );
}

export default function SafeImage({
  alt,
  fallback,
  className,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          aria-hidden="true"
        />
      )}

      {error ? (
        fallback ?? <ImagePlaceholder />
      ) : (
        <Image
          {...props}
          alt={alt}
          className={`${className ?? ''} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={onError}
          onLoad={onLoad}
        />
      )}
    </div>
  );
}
